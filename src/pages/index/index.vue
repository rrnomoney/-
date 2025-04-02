<template>
	<view class="container" :class="{ refreshing: isRefreshing }">
		<view class="post-list">
			<view class="post-item" v-for="item in postList" :key="item.id">
					<view class="post-header">
					<image class="avatar" :src="item.user.avatar" mode="aspectFill"></image>
						<view class="user-info">
						<text class="username">{{ item.user.name }}</text>
							<text class="time">{{ item.createTime }}</text>
						</view>
					</view>
					<view class="post-content">{{ item.content }}</view>
					<view class="post-footer">
						<view class="action-btn">
							<text class="iconfont">❤</text>
						<text class="count">{{ item.likeCount }}</text>
						</view>
						<view class="action-btn">
							<text class="iconfont">💬</text>
							<text class="count">{{ item.commentCount }}</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="loading" v-if="postStore.loading">
			<view class="loading-spinner"></view>
			<text>加载中...</text>
		</view>
		<view class="no-more" v-if="!postStore.hasMore && postList.length > 0">
			<text>没有更多了</text>
		</view>
	</view>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { usePostStore } from '@/stores/post'

const postStore = usePostStore()
const isRefreshing = ref(false)
const postList = ref([])

// 获取帖子列表
const getPosts = async (page = 1) => {
	const posts = await postStore.getPosts(page)
	if (page === 1) {
		postList.value = posts
	} else {
		postList.value = [...postList.value, ...posts]
	}
}

// 下拉刷新
onPullDownRefresh(async () => {
	isRefreshing.value = true
	await getPosts(1)
	uni.stopPullDownRefresh()
	isRefreshing.value = false
})

// 上拉加载更多
onReachBottom(() => {
	if (!postStore.loading && postStore.hasMore) {
		getPosts(postStore.page + 1)
	}
})

// 页面加载时获取数据
onMounted(() => {
	getPosts(1)
})
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
	
	&.refreshing {
		padding-top: 100rpx;
	}
}

.post-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.post-item {
	position: relative;
	margin-bottom: 24rpx;
	padding: 20rpx;
	border-radius: 25rpx;
	background: rgba(255, 255, 255, 0.9);
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);

.post-header {
	display: flex;
	align-items: center;
	margin-bottom: 16rpx;
	
	.avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		margin-right: 16rpx;
	}
	
	.user-info {
		.username {
			font-size: 28rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 4rpx;
		}
		
		.time {
			font-size: 24rpx;
			color: #999;
		}
	}
}

.post-content {
	font-size: 28rpx;
	color: #333;
	line-height: 1.6;
	margin-bottom: 16rpx;
}

.post-footer {
	display: flex;
	gap: 32rpx;
	
	.action-btn {
		display: flex;
		align-items: center;
		gap: 8rpx;
		
		.iconfont {
			font-size: 32rpx;
			color: #666;
		}
		
		.count {
			font-size: 24rpx;
			color: #999;
			}
		}
	}
}

.loading {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20rpx;
	
	.loading-spinner {
		width: 40rpx;
		height: 40rpx;
		border: 4rpx solid #f3f3f3;
		border-top: 4rpx solid #3498db;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-right: 10rpx;
	}
	
	text {
		font-size: 28rpx;
		color: #999;
	}
}

.no-more {
	text-align: center;
	padding: 20rpx;
	
	text {
		font-size: 28rpx;
		color: #999;
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

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>
