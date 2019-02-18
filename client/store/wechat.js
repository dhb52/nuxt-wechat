export const state = () => ({
  user: null
})

export const mutations = {
  setUser(state, user) {
    // this.$axios.setToken(user.jwt, 'Bearer')
    state.user = user
  }
}
