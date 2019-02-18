const SCOPES = ['snsapi_base', 'snsapi_userinfo']

class VueWechatAuthPlugin {
  constructor() {
    this.appid = null
    this.redirectUri = null
    this.scope = SCOPES[1]
    this._code = null
    this._redirectUri = null
  }

  install(Vue, options) {
    const wechatAuth = this
    this.setAppId(options.appid)
    Vue.mixin({
      created: function() {
        this.$wechatAuth = wechatAuth
      }
    })
  }

  static makeState() {
    return (
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15)
    )
  }

  setAppId(appid) {
    this.appid = appid
  }

  set redirectUri(redirectUri) {
    this._redirectUri = encodeURIComponent(redirectUri)
  }

  get redirectUri() {
    return this._redirectUri
  }

  get authUrl() {
    if (this.appid === null) {
      throw new Error('appid must not be null')
    }
    if (this.redirectUri === null) {
      throw new Error('redirect uri must not be null')
    }
    this.state = VueWechatAuthPlugin.makeState()

    return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
      this.appid
    }&redirect_uri=${this.redirectUri}&response_type=code&scope=${
      this.scope
    }&state=${this.state}#wechat_redirect`
  }

  get code() {
    if (this._code === null) {
      throw new Error('Not get the code from wechat server!')
    }
    const code = this._code
    this._code = null

    return code
  }
}

const vueWechatAuthPlugin = new VueWechatAuthPlugin()

// eslint-disable-next-line no-unused-vars
export default ({ app }, inject) => {
  inject('wechatAuth', vueWechatAuthPlugin)
}
