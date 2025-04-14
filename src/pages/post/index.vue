<template>
	<view class="post-page">
		<view class="post-container">
			<view class="post-content">
				<textarea
					v-model="content"
					placeholder="分享新鲜事..."
					:maxlength="500"
					@input="handleInput"
					class="post-textarea"
				/>
				
				<!-- 多媒体预览区域 -->
				<view class="media-preview" v-if="mediaList.length > 0">
					<view v-for="(media, index) in mediaList" :key="index" class="media-item">
						<image v-if="media.type === 'image'" :src="media.url" mode="aspectFill" />
						<video v-if="media.type === 'video'" :src="media.url" />
						<view v-if="media.type === 'audio'" class="audio-player">
							<text>语音消息</text>
						</view>
						<view class="delete-btn" @tap="removeMedia(index)">
							<text class="iconfont">×</text>
						</view>
					</view>
				</view>

				<!-- 多媒体上传按钮 -->
				<view class="media-actions">
					<view class="media-btn" @tap="handleImageUpload">
						<text class="iconfont">🖼️</text>
						<text>图片</text>
					</view>
					<view class="media-btn" @tap="handleVideoUpload">
						<text class="iconfont">🎥</text>
						<text>视频</text>
					</view>
					<view class="media-btn" @tap="handleAudioUpload">
						<text class="iconfont">🎤</text>
						<text>语音</text>
					</view>
					<view class="media-btn" @tap="showEmojiPicker">
						<text class="iconfont">😊</text>
						<text>表情</text>
					</view>
				</view>
			</view>

			<view class="post-footer">
				<view class="word-count">{{ content.length }}/500</view>
				<button 
					class="post-button"
					:class="{ 'active': content.trim() || mediaList.length > 0 }"
					@tap="handlePost"
				>
					发布
				</button>
			</view>
		</view>

		<!-- 表情选择器 -->
		<view class="emoji-picker" v-if="showEmoji">
			<view class="emoji-header">
				<text>选择表情</text>
				<text class="iconfont close-btn" @tap="showEmoji = false">×</text>
			</view>
			<view class="emoji-grid">
				<text 
					v-for="emoji in emojiList" 
					:key="emoji"
					@tap="insertEmoji(emoji)"
					class="emoji-item"
				>{{ emoji }}</text>
			</view>
		</view>
		
		<!-- 背景动画 -->
		<view class="wave"></view>
		<view class="wave"></view>
		<view class="wave"></view>
	</view>
</template>

<script>
import { ref } from 'vue'
import { usePostStore } from '@/stores/post'

export default {
	setup() {
		const content = ref('')
		const mediaList = ref([])
		const showEmoji = ref(false)
		const emojiList = ['😊', '😂', '🤔', '👍', '❤️', '🎉', '🌟', '💪', '😍', '🤗']
		const postStore = usePostStore()

		// 处理输入
		const handleInput = () => {
			if (content.value.length > 500) {
				content.value = content.value.slice(0, 500)
			}
		}

		// 处理图片上传
		const handleImageUpload = () => {
			uni.chooseImage({
				count: 1,
				success: (res) => {
					mediaList.value.push({
						type: 'image',
						url: res.tempFilePaths[0]
					})
				},
				fail: (err) => {
					console.error('选择图片失败:', err)
					uni.showToast({
						title: '选择图片失败',
						icon: 'none'
					})
				}
			})
		}

		// 处理视频上传
		const handleVideoUpload = () => {
			uni.chooseVideo({
				count: 1,
				success: (res) => {
					mediaList.value.push({
						type: 'video',
						url: res.tempFilePath
					})
				},
				fail: (err) => {
					console.error('选择视频失败:', err)
					uni.showToast({
						title: '选择视频失败',
						icon: 'none'
					})
				}
			})
		}

		// 处理语音上传
		const handleAudioUpload = () => {
			uni.chooseFile({
				count: 1,
				type: 'audio',
				success: (res) => {
					mediaList.value.push({
						type: 'audio',
						url: res.tempFilePaths[0]
					})
				},
				fail: (err) => {
					console.error('选择音频失败:', err)
					uni.showToast({
						title: '选择音频失败',
						icon: 'none'
					})
				}
			})
		}

		// 显示表情选择器
		const showEmojiPicker = () => {
			showEmoji.value = true
		}

		// 插入表情
		const insertEmoji = (emoji) => {
			content.value += emoji
			showEmoji.value = false
		}

		// 删除媒体
		const removeMedia = (index) => {
			mediaList.value.splice(index, 1)
		}

		// 发布内容
		const handlePost = async () => {
			if (!content.value.trim() && mediaList.value.length === 0) {
				uni.showToast({
					title: '请输入内容或上传媒体文件',
					icon: 'none'
				})
				return
			}

			try {
				// 添加到 store
				const newPost = {
					id: Date.now(),
					content: content.value,
					media: mediaList.value,
					createTime: new Date().toLocaleString(),
					user: {
						name: '用户',
						avatar: '/static/avatar.png'
					},
					likeCount: 0,
					commentCount: 0
				}
				
				postStore.addPost(newPost)
				
				// 清空输入内容
				content.value = ''
				mediaList.value = []
				
				uni.showToast({
					title: '发布成功',
					icon: 'success'
				})
				
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/index/index'
					})
				}, 1500)
			} catch (error) {
				console.error('发布失败:', error)
				uni.showToast({
					title: '发布失败，请重试',
					icon: 'none'
				})
			}
		}

		return {
			content,
			mediaList,
			showEmoji,
			emojiList,
			handleInput,
			handleImageUpload,
			handleVideoUpload,
			handleAudioUpload,
			showEmojiPicker,
			insertEmoji,
			removeMedia,
			handlePost
		}
	}
}
</script>

<style lang="scss">
.post-page {
	min-height: 100vh;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20rpx;
	box-sizing: border-box;
	background-image: linear-gradient(
		in oklch longer hue to right,
		oklch(0.93 0.08 var(--hue1) / 30%),
		oklch(0.93 0.08 var(--hue2) / 30%)
	),
	linear-gradient(
		in oklch longer hue to bottom,
		oklch(0.93 0.08 var(--hue1) / 30%),
		oklch(0.93 0.08 var(--hue2) / 30%)
	);
	background-size: 100% 100%;
	animation: anim_bg 5s linear infinite;
	position: relative;
	overflow-x: hidden;
}

.post-container {
	width: 100%;
	max-width: 600rpx;
	background: rgba(255, 255, 255, 0.2);
	backdrop-filter: blur(10px);
	border-radius: 16rpx;
	padding: 30rpx;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 40rpx;
	position: relative;
	z-index: 1;
	border: 1px solid rgba(255, 255, 255, 0.2);
}

.post-content {
	width: 100%;
}

.post-textarea {
	width: 100%;
	min-height: 200rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	border-radius: 12rpx;
	background: rgba(255, 255, 255, 0.9);
	color: #333;
	font-size: 28rpx;
	box-sizing: border-box;
}

.media-preview {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
	gap: $spacing-sm;
	margin: $spacing-md 0;
}

.media-item {
	position: relative;
	aspect-ratio: 1;
	border-radius: $border-radius-sm;
	overflow: hidden;
	background-color: rgba(0, 0, 0, 0.2);
}

.media-item image,
.media-item video {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.audio-player {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	padding: $spacing-sm;
	text-align: center;
	color: rgba(255, 255, 255, 0.8);
}

.delete-btn {
	position: absolute;
	top: $spacing-xs;
	right: $spacing-xs;
	width: 24px;
	height: 24px;
	background: rgba(0, 0, 0, 0.6);
	border-radius: $border-radius-circle;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
}

.media-actions {
	width: 100%;
	display: flex;
	justify-content: space-around;
	gap: 40rpx;
	margin: 20rpx 0;
}

.media-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
	color: #333;
	
	.iconfont {
		font-size: 40rpx;
		margin-bottom: 8rpx;
	}
	
	text {
		font-size: 24rpx;
	}
}

.post-footer {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 30rpx;
}

.word-count {
	font-size: 24rpx;
	color: #666;
}

.post-button {
	width: 160rpx;
	height: 70rpx;
	line-height: 70rpx;
	background: linear-gradient(135deg, #6366f1, #8b5cf6);
	color: white;
	border: none;
	border-radius: 35rpx;
	font-size: 28rpx;
	box-shadow: 0 4rpx 12rpx rgba(99, 102, 241, 0.3);
}

.emoji-picker {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background: rgba(0, 0, 0, 0.8);
	border-radius: $border-radius-lg $border-radius-lg 0 0;
	padding: $spacing-lg;
	box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
	z-index: 1000;
	backdrop-filter: blur(10px);
}

.emoji-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: $spacing-md;
	color: rgba(255, 255, 255, 0.9);
	
	.close-btn {
		color: rgba(255, 255, 255, 0.6);
		font-size: $font-size-lg;
	}
}

.emoji-grid {
	display: grid;
	grid-template-columns: repeat(8, 1fr);
	gap: $spacing-sm;
}

.emoji-item {
	font-size: $font-size-xl;
	text-align: center;
	padding: $spacing-xs;
	border-radius: $border-radius-sm;
	transition: all $transition-duration $transition-timing;
	
	&:active {
		background: rgba(255, 255, 255, 0.1);
		transform: scale(0.95);
	}
}

/* 波浪动画 */
.wave {
	position: fixed;
	width: 200%;
	height: 200px;
	background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%23ffffff22'/%3E%3C/svg%3E");
	background-size: 50% 100px;
	animation: wave 25s linear infinite;
	bottom: 0;
	opacity: 0.6;
	z-index: 0;
	transform-origin: bottom;
}

.wave:nth-child(2) {
	bottom: 10px;
	opacity: 0.4;
	animation: wave 20s linear infinite;
}

.wave:nth-child(3) {
	bottom: 20px;
	opacity: 0.2;
	animation: wave 15s linear infinite;
}

@keyframes wave {
	0% {
		transform: translateX(0) translateY(0) scaleY(1);
	}
	50% {
		transform: translateX(-25%) translateY(10px) scaleY(1.1);
	}
	100% {
		transform: translateX(-50%) translateY(0) scaleY(1);
	}
}

@keyframes anim_bg {
	0% {
		--hue1: 0;
		--hue2: 60;
	}
	25% {
		--hue1: 60;
		--hue2: 120;
	}
	50% {
		--hue1: 120;
		--hue2: 180;
	}
	75% {
		--hue1: 180;
		--hue2: 240;
	}
	100% {
		--hue1: 240;
		--hue2: 300;
	}
}
</style> 