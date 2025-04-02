<template>
	<view class="container">
		<view class="post-form">
			<textarea 
				class="content-input" 
				v-model="content" 
				placeholder="分享你的故事..."
				:maxlength="1000"
				show-confirm-bar
			></textarea>
			
			<view class="action-bar">
				<text class="word-count">{{ content.length }}/1000</text>
				<button class="submit-btn" @click="handleSubmit">发布</button>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { usePostStore } from '@/stores/post'

const postStore = usePostStore()
const content = ref('')

const handleSubmit = () => {
	if (!content.value.trim()) {
		uni.showToast({
			title: '请输入内容',
			icon: 'none'
		})
		return
	}
	
	// 保存帖子
	postStore.addPost({
		content: content.value
	})
	
	uni.showToast({
		title: '发布成功',
		icon: 'success'
	})
	
	setTimeout(() => {
		uni.switchTab({
			url: '/pages/index/index'
		})
	}, 1500)
}
</script>

<style lang="scss">
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
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
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

.post-form {
	background: rgba(255, 255, 255, 0.9);
	border-radius: 20rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
	
	.content-input {
		width: 100%;
		height: 400rpx;
		font-size: 28rpx;
		line-height: 1.6;
		padding: 20rpx;
		box-sizing: border-box;
		border: none;
		background: transparent;
	}
	
	.action-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx;
		border-top: 2rpx solid rgba(0, 0, 0, 0.1);
		
		.word-count {
			font-size: 28rpx;
			color: #999;
		}
		
		.submit-btn {
			width: 160rpx;
			height: 70rpx;
			line-height: 70rpx;
			background: linear-gradient(135deg, #FF4B2B 0%, #FF416C 100%);
			color: #fff;
			border-radius: 35rpx;
			font-size: 30rpx;
			font-weight: bold;
			margin: 0;
			padding: 0;
			box-shadow: 0 4rpx 12rpx rgba(255, 75, 43, 0.3);
			
			&:active {
				opacity: 0.8;
				transform: translateY(2rpx);
			}
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
</style> 