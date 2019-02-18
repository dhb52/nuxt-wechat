const config = {
  common: {
    wechatAppid: 'FILL_ME_IN'
  },

  prod: {
    apiBaseUrl: 'http://example.com/api',

    wechatAuthExpireMinutes: 60
  },

  dev: {
    apiBaseUrl: 'http://127.0.0.1:8000/api',

    wechatAuthExpireMinutes: 1,

    mockWechatEnabled: false,
    mockWechatData: {
      openid: 'oDfWfuBtdBf5CdcGKOckPlrXBMdw',
      nickname: 'BaRrY',
      headImgUrl:
        'http://thirdwx.qlogo.cn/mmopen/vi_32/hJGFkv2NPy1JW1mvuibKO4c6Oln49clZHHcapD0OxLzTt3ufqiaQxyOUf4xGFgPvy9EzTNyw25qFAPSK8ESKhlag/132'
    },

    mockOauthEnabled: true
  }
}

module.exports = {
  ...config.common,
  ...(process.env.NODE_ENV === 'production' ? config.prod : config.dev)
}
