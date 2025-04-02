<template>
	<view class="container">
		<view class="logo">
			<image src="/static/logo.png" mode="aspectFit"></image>
		</view>
		
		<view class="title">暖心树洞</view>
		<view class="subtitle">在这里，分享你的故事</view>
		
		<view class="login-box">
			<button class="login-btn" @tap="handleLogin">
				<image class="wechat-icon" src="/static/wechat.png" mode="aspectFit"></image>
				微信一键登录
			</button>
		</view>
		
		<view class="tips">
			<text>登录即代表同意</text>
			<text class="link" @tap="goToPrivacy">《用户协议和隐私政策》</text>
		</view>
	</view>
</template>

<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const handleLogin = () => {
	// #ifdef H5
	// H5环境下模拟登录
	userStore.login('h5_mock_code').then(() => {
		uni.showToast({
			title: '登录成功',
			icon: 'success'
		})
		// 登录成功后跳转到首页
		uni.switchTab({
			url: '/pages/index/index'
		})
	}).catch(() => {
		uni.showToast({
			title: '登录失败，请重试',
			icon: 'none'
		})
	})
	// #endif
	
	// #ifdef MP-WEIXIN
	// 小程序环境下使用微信登录
	uni.login({
		provider: 'weixin',
		success: async (loginRes) => {
			const success = await userStore.login(loginRes.code)
			if (success) {
				uni.showToast({
					title: '登录成功',
					icon: 'success'
				})
				// 登录成功后跳转到首页
				uni.switchTab({
					url: '/pages/index/index'
				})
			} else {
				uni.showToast({
					title: '登录失败，请重试',
					icon: 'none'
				})
			}
		},
		fail: (err) => {
			console.error('登录失败', err)
			uni.showToast({
				title: '登录失败，请重试',
				icon: 'none'
			})
		}
	})
	// #endif
}

const goToPrivacy = () => {
	uni.navigateTo({
		url: '/pages/privacy/index'
	})
}
</script>

<style lang="scss">
.container {
	min-height: 100vh;
	background: #fff;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 100rpx 40rpx;
	
	.logo {
		width: 200rpx;
		height: 200rpx;
		margin-bottom: 40rpx;
		
		image {
			width: 100%;
			height: 100%;
		}
	}
	
	.title {
		font-size: 48rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
	}
	
	.subtitle {
		font-size: 28rpx;
		color: #999;
		margin-bottom: 100rpx;
	}
	
	.login-box {
		width: 100%;
		margin-bottom: 40rpx;
		
		.login-btn {
			width: 100%;
			height: 88rpx;
			background: #07c160;
			color: #fff;
			border-radius: 44rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 32rpx;
			
			.wechat-icon {
				width: 40rpx;
				height: 40rpx;
				margin-right: 10rpx;
			}
		}
	}
	
	.tips {
		font-size: 24rpx;
		color: #999;
		
		.link {
			color: #018EFF;
		}
	}
}
</style> 