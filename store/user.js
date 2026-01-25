// store/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    // 初始化时优先从本地缓存读取，实现持久化
    token: uni.getStorageSync('token') || '',
    userInfo: uni.getStorageSync('userInfo') || {}
  }),
  
  getters: {
    // 方便在页面中判断是否已登录
    isLoggedIn: (state) => !!state.token && !!state.userInfo.id
  },

  actions: {
    /**
     * 登录成功 Action
     * @param {Object} data - 后端返回的登录数据 { token: '...', user: {...} }
     */
    login(data) {
      // 1. 更新 State
      this.token = data.token
      this.userInfo = data.user || {}

      // 2. 持久化到本地存储
      uni.setStorageSync('token', data.token)
      uni.setStorageSync('userInfo', data.user || {})
    },

    /**
     * 退出登录 Action
     */
    logout() {
      // 1. 清空 State
      this.token = ''
      this.userInfo = {}

      // 2. 清除本地存储
      uni.removeStorageSync('token')
      uni.removeStorageSync('userInfo')
      
      // 3. 可选：跳转回登录页
      // uni.reLaunch({ url: '/pages/login/login' })
    },

    /**
     * 更新用户信息（例如修改头像后）
     */
    updateUserInfo(info) {
      this.userInfo = { ...this.userInfo, ...info }
      uni.setStorageSync('userInfo', this.userInfo)
    }
  }
})