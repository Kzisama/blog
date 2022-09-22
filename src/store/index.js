import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {
      user_nickname: ''
    },
    userAvatar: ''
  },
  getters: {},
  mutations: {
    // 更新用户信息
    updateUserInfo (state, obj) {
      state.userInfo = obj
    },
    // 更新用户头像
    updateUserAvatar (state, avatar) {
      state.userAvatar = avatar
    },
    // 更新用户昵称
    updateUserNickName (state, nickname) {
      state.userInfo.user_nickname = nickname
    },
  },
  actions: {},
  modules: {},
})
