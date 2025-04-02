import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
	state: () => ({
		userInfo: null,
		token: '',
		isLogin: false
	}),
	
	getters: {
		getUserInfo: (state) => state.userInfo,
		getToken: (state) => state.token,
		getLoginStatus: (state) => state.isLogin
	},
	
	actions: {
		// 设置用户信息
		setUserInfo(info) {
			this.userInfo = info
		},
		
		// 设置token
		setToken(token) {
			this.token = token
		},
		
		// 设置登录状态
		setLoginStatus(status) {
			this.isLogin = status
		},
		
		// 登录
		async login(code) {
			try {
				// TODO: 调用登录接口
				// const res = await loginApi(code)
				// this.setUserInfo(res.userInfo)
				// this.setToken(res.token)
				// this.setLoginStatus(true)
				
				// 模拟登录成功
				this.setUserInfo({
					userId: '1',
					nickName: '测试用户',
					avatarUrl: '/static/default-avatar.png'
				})
				this.setToken('test-token')
				this.setLoginStatus(true)
				
				return true
			} catch (error) {
				console.error('登录失败:', error)
				return false
			}
		},
		
		// 退出登录
		logout() {
			this.setUserInfo(null)
			this.setToken('')
			this.setLoginStatus(false)
		}
	}
}) 