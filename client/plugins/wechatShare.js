import wx from 'weixin-js-sdk'

export default ({ $axios }, inject) => {
  inject(
    'wechatShare',
    async (title, desc = '', imgUrl = '', url = window.location.href) => {
      const config = await $axios.$post('jssdk', {
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'],
        url: url
      })

      wx.config(config)
      const shareData = {
        title: title,
        desc: desc,
        link: url,
        imgUrl: imgUrl
      }
      wx.ready(() => {
        wx.onMenuShareTimeline(shareData)
        wx.onMenuShareAppMessage(shareData)
      })
    }
  )
}
