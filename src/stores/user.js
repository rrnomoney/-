import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    token: null,
    isLoggedIn: false
  }),
  
  actions: {
    // 登录
    async login(code) {
      // 模拟登录成功
      this.isLoggedIn = true
      this.userInfo = {
        username: '测试用户',
        nickname: '测试用户',
        avatar: '/static/default-avatar.png'
      }
      return true
    },
    
    // 注册
    async register(username, password, nickname) {
      // TODO: 实际项目中这里应该调用后端API
      // 这里模拟注册成功
      this.userInfo = {
        id: 1,
        username,
        nickname,
        avatar: '/static/avatar.png'
      }
      this.token = 'mock_token'
      this.isLoggedIn = true
      
      // 保存到本地存储
      uni.setStorageSync('userInfo', this.userInfo)
      uni.setStorageSync('token', this.token)
    },
    
    // 退出登录
    logout() {
      this.userInfo = null
      this.token = null
      this.isLoggedIn = false
      
      // 清除本地存储
      uni.removeStorageSync('userInfo')
      uni.removeStorageSync('token')
    },
    
    // 检查登录状态
    checkLoginStatus() {
      const userInfo = uni.getStorageSync('userInfo')
      const token = uni.getStorageSync('token')
      
      if (userInfo && token) {
        this.userInfo = userInfo
        this.token = token
        this.isLoggedIn = true
      }
    }
  }
}) 