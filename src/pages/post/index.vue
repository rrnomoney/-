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
						url: res.tempFilePaths[0],
						file: res.tempFiles[0]
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
						url: res.tempFilePath,
						file: res.tempFile
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
						url: res.tempFilePaths[0],
						file: res.tempFiles[0]
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
					timestamp: new Date().toISOString(),
					author: {
						name: '用户',
						avatar: '/static/avatar.png'
					}
				}
				
				postStore.addPost(newPost)
				
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
	position: relative;
	width: 100%;
	overflow-x: hidden;
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
	padding: $spacing-lg;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.post-container {
	width: 90%;
	max-width: 600px;
	background: rgba(255, 255, 255, 0.15);
	padding: $spacing-lg;
	backdrop-filter: blur(10px);
	position: relative;
	z-index: 1;
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: $border-radius-lg;
}

.post-content {
	margin-bottom: $spacing-lg;
	background: rgba(255, 255, 255, 0.1);
	border-radius: $border-radius-lg;
	padding: $spacing-md;
}

.post-textarea {
	width: 100%;
	min-height: 120px;
	padding: $spacing-md;
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: $border-radius-md;
	font-size: $font-size-md;
	line-height: 1.5;
	background-color: rgba(255, 255, 255, 0.05);
	color: rgba(255, 255, 255, 0.9);
	
	&::placeholder {
		color: rgba(255, 255, 255, 0.5);
	}
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
	display: flex;
	justify-content: center;
	gap: $spacing-lg;
	padding: $spacing-md;
	background: rgba(255, 255, 255, 0.1);
	border-radius: $border-radius-lg;
	margin-bottom: $spacing-lg;
}

.media-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: $spacing-xs;
	color: rgba(255, 255, 255, 0.8);
	transition: all $transition-duration $transition-timing;
	
	&:active {
		color: white;
		transform: scale(0.95);
	}
	
	.iconfont {
		font-size: $font-size-xl;
	}
	
	text {
		font-size: $font-size-xs;
	}
}

.post-footer {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: $spacing-md;
	background: rgba(255, 255, 255, 0.1);
	border-radius: $border-radius-lg;
	padding: $spacing-md;
}

.word-count {
	color: rgba(255, 255, 255, 0.6);
	font-size: $font-size-sm;
}

.post-button {
	padding: $spacing-sm $spacing-xl;
	border-radius: $border-radius-lg;
	border: none;
	background: linear-gradient(45deg, #667eea, #764ba2);
	color: white;
	font-size: $font-size-md;
	transition: all $transition-duration $transition-timing;
	min-width: 120px;
	position: relative;
	overflow: hidden;
	
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			45deg,
			rgba(255, 255, 255, 0.1) 0%,
			rgba(255, 255, 255, 0.2) 50%,
			rgba(255, 255, 255, 0.1) 100%
		);
		transform: translateX(-100%);
		transition: transform 0.5s ease;
	}
	
	&:active {
		transform: scale(0.95);
		
		&::before {
			transform: translateX(100%);
		}
	}
	
	&.active {
		background: linear-gradient(45deg, #667eea, #764ba2);
		box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
	}
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
		--hue1: 0deg;
		--hue2: 300deg;
	}
	100% {
		--hue1: 360deg;
		--hue2: 660deg;
	}
}
</style> 