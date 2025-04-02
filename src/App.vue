<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style lang="scss">
/* 全局样式 */
page {
	position: relative;
	width: 100%;
	min-height: 100vh;
	overflow-x: hidden;
	background-image: linear-gradient(
			in oklch longer hue to right,
			oklch(0.93 0.08 var(--hue1) / 50%),
			oklch(0.93 0.08 var(--hue2) / 50%)
		),
		linear-gradient(
			in oklch longer hue to bottom,
			oklch(0.93 0.08 var(--hue1) / 50%),
			oklch(0.93 0.08 var(--hue2) / 50%)
		);
	background-size: 100% 100%;
	animation: anim_bg 5s linear infinite;
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

/* 波浪动画样式 */
.wave {
	position: fixed;
	width: 200%;
	height: 200px;
	background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%23ffffff22'/%3E%3C/svg%3E");
	background-size: 50% 100px;
	animation: wave 25s linear infinite;
	bottom: 0;
	opacity: 0.6;
	z-index: -1;
	transform-origin: bottom;
}

.wave:nth-child(2) {
	bottom: 10px;
	opacity: 0.4;
	animation: wave 20s linear infinite;
	transform-origin: bottom;
}

.wave:nth-child(3) {
	bottom: 20px;
	opacity: 0.2;
	animation: wave 15s linear infinite;
	transform-origin: bottom;
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

/* 重置一些默认样式 */
button {
	background: none;
	border: none;
	padding: 0;
}

/* 设置页面内容区域样式 */
.container {
	min-height: 100vh;
	padding: 20rpx;
	box-sizing: border-box;
	position: relative;
	z-index: 1;
}

/* 设置卡片样式 */
.card {
	background: rgba(255, 255, 255, 0.8);
	backdrop-filter: blur(10px);
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
	transition: transform 0.3s ease;
	
	&:hover {
		transform: translateY(-5px);
	}
}
</style>
