import { stringify } from 'querystring'

const LS_WECHAT_USER_KEY = 'wechat.user'
const LS_WECHAT_CODE_KEY = 'wechat.code'

// wechat mock user
function _mockUser() {
  return {
    id: process.env.mockWechatData.openid,
    name: process.env.mockWechatData.nickname,
    avatar: process.env.mockWechatData.headImgUrl
  }
}

// strip wechat `code` & `state` query
function _stripWechatQuery(route) {
  delete route.query.code
  delete route.query.state

  return (route.path || '/') + stringify(route.query) + route.hash
}

// the middleware handle function
async function _handle(context) {
  const { route, redirect, app, query, $axios, store, error } = context

  // Step1: get from mock
  if (process.env.mockWechatEnabled) {
    const user = _mockUser()
    store.commit('wechat/setUser', user)

    return
  }

  // Step2: mock oauth from server
  if (process.env.mockOauthEnabled) {
    const user = await $axios.$get('oauth-mock')
    store.commit('wechat/setUser', user)

    return
  }

  // Step3: get from localStorage
  const user = app.$lscache.get(LS_WECHAT_USER_KEY)
  if (user) {
    store.commit('wechat/setUser', user)

    return
  }

  // Step4: callback from wechat server
  const code = query.code
  const oldCode = app.$lscache.get(LS_WECHAT_CODE_KEY)
  if (code && code !== oldCode) {
    app.$lscache.set(LS_WECHAT_CODE_KEY, code)
    try {
      const user = await $axios.$get('oauth/' + code)
      store.commit('wechat/setUser', user)
      app.$lscache.set(
        LS_WECHAT_USER_KEY,
        user,
        process.env.wechatAuthExpireMinutes
      )
    } catch (e) {
      error({ message: '微信授权失败', statusCode: 500 })
    }

    return
  }

  // Step5: not authenticated, redirect
  app.$wechatAuth.setAppId(process.env.wechatAppid)
  app.$wechatAuth.redirectUri =
    process.env.appBaseUrl + _stripWechatQuery(route)
  const url = app.$wechatAuth.authUrl
  redirect(url)
}

export default async function(context) {
  await _handle(context)
}
