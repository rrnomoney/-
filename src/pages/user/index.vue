<template>
	<view class="container">
		<view class="user-info">
			<view class="user-content-wrapper">
			<template v-if="userStore.isLoggedIn">
					<image class="avatar" :src="userStore.userInfo.avatar" mode="aspectFill"></image>
					<text class="username">{{ userStore.userInfo.nickname }}</text>
					<text class="bio">这个人很懒，什么都没写</text>
			</template>
			<template v-else>
					<image class="avatar" src="/static/default-avatar.png" mode="aspectFill"></image>
					<text class="username">未登录</text>
					<text class="bio">登录后查看更多内容</text>
					<button class="login-btn" @tap="goToLogin">立即登录</button>
				</template>
				</view>
		</view>
		
		<view class="menu-list" v-if="userStore.isLoggedIn">
			<view class="menu-content-wrapper">
				<view class="menu-item" v-for="(item, index) in menuItems" :key="index" @tap="handleMenuClick(item)">
					<text class="iconfont">{{ item.icon }}</text>
					<text class="title">{{ item.title }}</text>
					<text class="arrow">></text>
				</view>
				<view class="menu-item" @tap="handleLogout">
					<text class="iconfont">🚪</text>
					<text class="title">退出登录</text>
					<text class="arrow">></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const menuItems = [
	{ icon: '📝', title: '我的帖子', path: '/pages/user/posts' },
	{ icon: '❤️', title: '我的收藏', path: '/pages/user/favorites' },
	{ icon: '⚙️', title: '设置', path: '/pages/user/settings' }
]

const handleMenuClick = (item) => {
	uni.navigateTo({
		url: item.path
	})
}

const goToLogin = () => {
	uni.navigateTo({
		url: '/pages/login/index'
	})
}

const handleLogout = () => {
	uni.showModal({
		title: '提示',
		content: '确定要退出登录吗？',
		success: (res) => {
			if (res.confirm) {
				userStore.logout()
				uni.showToast({
					title: '已退出登录',
					icon: 'success'
				})
			}
		}
	})
}
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap");

@property --hue1 {
	syntax: "<angle>";
	inherits: false;
	initial-value: 0deg;
}

@property --hue2 {
	syntax: "<angle>";
	inherits: false;
	initial-value: 0deg;
}

.container {
	padding: 20rpx;
	min-height: 100vh;
	width: 100%;
	max-width: 100vw;
	text-align: center;
	overflow-x: hidden;
	font-family: "Geist", sans-serif;
	background-image: linear-gradient(
			in oklch longer hue to bottom,
			oklch(0.93 0.08 var(--hue1) / 50%),
			oklch(0.93 0.08 var(--hue2) / 50%)
		),
		linear-gradient(
			in oklch longer hue to bottom,
			oklch(0.93 0.08 var(--hue2) / 50%),
			oklch(0.93 0.08 var(--hue1) / 50%)
		);
	background-size: 100% 200%;
	background-position: 0 0;
	color: PaleVioletRed;
	animation: anim_bg 15s linear infinite;
}

.user-info,
.menu-list {
	position: relative;
		margin-bottom: 24rpx;
	padding: 20rpx;
	border-radius: 25rpx;
	background: rgba(255, 255, 255, 0.9);
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
		}
		
		.user-info {
	text-align: center;
	padding: 40rpx 20rpx;
	
	.avatar {
		width: 160rpx;
		height: 160rpx;
		border-radius: 50%;
		margin-bottom: 20rpx;
		border: 4rpx solid rgba(255, 255, 255, 0.5);
	}
	
	.username {
		font-size: 36rpx;
		font-weight: 500;
		color: #333;
		margin-bottom: 10rpx;
		display: block;
	}
	
	.bio {
		font-size: 28rpx;
		color: #666;
		display: block;
		}
	}
	
	.menu-list {
			.menu-item {
				display: flex;
				align-items: center;
		padding: 30rpx 20rpx;
		border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
				
				&:last-child {
					border-bottom: none;
				}
				
				.iconfont {
			font-size: 40rpx;
			margin-right: 20rpx;
				}
				
				.title {
					flex: 1;
			font-size: 32rpx;
					color: #333;
			text-align: left;
				}
				
		.arrow {
			font-size: 32rpx;
					color: #999;
				}
			}
		}

@keyframes anim_bg {
	0% {
		background-position: 0 0;
		--hue1: 0deg;
		--hue2: 300deg;
	}
	
	100% {
		background-position: 0 100%;
		--hue1: 360deg;
		--hue2: 660deg;
	}
}

@keyframes rainbowRotate {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

.login-btn {
	margin-top: 20rpx;
	width: 200rpx;
	height: 60rpx;
	line-height: 60rpx;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #fff;
	border-radius: 30rpx;
	font-size: 28rpx;
	
	&:active {
		opacity: 0.8;
	}
}
</style> 