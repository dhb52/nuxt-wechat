<template>
  <div>
    <img :src="wechatUser.avatar">
    {{ wechatUser.name }}
  </div>
</template>

<script>
export default {
  computed: {
    wechatUser() {
      return this.$store.state.wechat.user
    }
  },

  mounted() {
    this.$wechatShare(
      'Barry',
      'Nuxtjs Wechat',
      'http://thirdwx.qlogo.cn/mmopen/vi_32/hJGFkv2NPy1JW1mvuibKO4c6Oln49clZHHcapD0OxLzTt3ufqiaQxyOUf4xGFgPvy9EzTNyw25qFAPSK8ESKhlag/132'
    )
  },

  middleware: ['wechatAuth']
}
</script>

<style>
</style>
