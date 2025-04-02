<template>
  <view class="container">
    <view class="register-form">
      <view class="form-title">注册</view>
      <view class="form-item">
        <input 
          type="text" 
          v-model="username" 
          placeholder="请输入用户名"
          class="input"
        />
      </view>
      <view class="form-item">
        <input 
          type="text" 
          v-model="nickname" 
          placeholder="请输入昵称"
          class="input"
        />
      </view>
      <view class="form-item">
        <input 
          type="password" 
          v-model="password" 
          placeholder="请输入密码"
          class="input"
        />
      </view>
      <view class="form-item">
        <input 
          type="password" 
          v-model="confirmPassword" 
          placeholder="请确认密码"
          class="input"
        />
      </view>
      <view class="form-item">
        <button 
          class="submit-btn" 
          @click="handleRegister"
          :disabled="loading"
        >
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </view>
      <view class="form-item">
        <text class="link" @click="goToLogin">已有账号？立即登录</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const username = ref('')
const nickname = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

const handleRegister = async () => {
  if (!username.value || !nickname.value || !password.value || !confirmPassword.value) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none'
    })
    return
  }
  
  if (password.value !== confirmPassword.value) {
    uni.showToast({
      title: '两次输入的密码不一致',
      icon: 'none'
    })
    return
  }
  
  loading.value = true
  try {
    await userStore.register(username.value, password.value, nickname.value)
    uni.showToast({
      title: '注册成功',
      icon: 'success'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error) {
    uni.showToast({
      title: error.message || '注册失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  uni.navigateBack()
}
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-form {
  width: 100%;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 40rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40rpx;
  color: #333;
}

.form-item {
  margin-bottom: 30rpx;
}

.input {
  width: 100%;
  height: 80rpx;
  background: #f5f5f5;
  border-radius: 40rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
}

.submit-btn {
  width: 100%;
  height: 80rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 40rpx;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:active {
    opacity: 0.8;
  }
  
  &[disabled] {
    opacity: 0.6;
  }
}

.link {
  font-size: 28rpx;
  color: #667eea;
  text-align: center;
  display: block;
  
  &:active {
    opacity: 0.8;
  }
}
</style> 