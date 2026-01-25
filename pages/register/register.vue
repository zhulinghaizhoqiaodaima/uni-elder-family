<template>
  <view class="page">
    <!-- 背景装饰圆 (保持风格一致) -->
    <view class="bg-circle circle-1"></view>
    <view class="bg-circle circle-2"></view>

    <view class="register-card">
      <!-- 头部 -->
      <view class="header">
        <text class="title">创建账号</text>
        <text class="subtitle">加入智暖社区，开启关爱之旅</text>
      </view>
      
      <!-- 表单区域 -->
      <view class="form-area">
        
        <!-- 1. 姓名 (必填) -->
        <view class="input-group" :class="{ 'input-focus': focusedInput === 'name' }">
          <uni-icons type="person" size="20" color="#909399" class="input-icon"></uni-icons>
          <input 
            v-model="formData.name" 
            type="text" 
            placeholder="请输入真实姓名" 
            placeholder-class="placeholder-style"
            class="input-field" 
            @focus="focusedInput = 'name'"
            @blur="focusedInput = ''"
          />
        </view>

        <!-- 2. 性别 (选填 0女 1男) -->
        <!-- 使用自定义按钮组来美化选择 -->
        <view class="gender-section">
          <text class="gender-label">性别 (选填)</text>
          <view class="gender-options">
            <view 
              class="gender-btn male" 
              :class="{ 'active': formData.gender === 1 }"
              @click="selectGender(1)"
            >
              <uni-icons type="staff-filled" size="18" :color="formData.gender === 1 ? '#fff' : '#909399'"></uni-icons>
              <text>男</text>
            </view>
            <view 
              class="gender-btn female" 
              :class="{ 'active': formData.gender === 0 }"
              @click="selectGender(0)"
            >
              <uni-icons type="staff-filled" size="18" :color="formData.gender === 0 ? '#fff' : '#909399'"></uni-icons>
              <text>女</text>
            </view>
          </view>
        </view>

        <!-- 3. 手机号 (必填) -->
        <view class="input-group" :class="{ 'input-focus': focusedInput === 'phone' }">
          <uni-icons type="phone" size="20" color="#909399" class="input-icon"></uni-icons>
          <input 
            v-model="formData.phone" 
            type="number" 
            maxlength="11"
            placeholder="请输入手机号" 
            placeholder-class="placeholder-style"
            class="input-field" 
            @focus="focusedInput = 'phone'"
            @blur="focusedInput = ''"
          />
        </view>
        
        <!-- 4. 密码 (必填) -->
        <view class="input-group" :class="{ 'input-focus': focusedInput === 'password' }">
          <uni-icons type="locked" size="20" color="#909399" class="input-icon"></uni-icons>
          <input 
            v-model="formData.password" 
            type="password" 
            placeholder="设置登录密码" 
            placeholder-class="placeholder-style"
            class="input-field" 
            @focus="focusedInput = 'password'"
            @blur="focusedInput = ''"
          />
        </view>

        <!-- 注册按钮 -->
        <button 
          class="register-btn" 
          :loading="isLoading" 
          :disabled="isLoading"
          hover-class="btn-hover"
          @click="handleRegister"
        >
          {{ isLoading ? '注册中...' : '立即注册' }}
        </button>

        <!-- 返回登录 -->
        <view class="login-link">
          <text>已有账号？</text>
          <text class="link-highlight" @click="goToLogin">去登录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { registerApi } from '@/api/user.js' 

// 表单数据对象，对应后端字段
const formData = reactive({
  name: '',
  phone: '',
  password: '',
  gender: null // 默认不选，或者你可以设置为 1 默认男
})

// 界面状态
const focusedInput = ref('')
const isLoading = ref(false)

// 选择性别
const selectGender = (val) => {
  // 如果点击已选中的，取消选择(可选逻辑)，或者直接切换
  formData.gender = val
}

// 注册逻辑
const handleRegister = async () => {
  // 1. 前端校验
  if (!formData.name.trim()) return uni.showToast({ title: '请输入姓名', icon: 'none' })
  if (!formData.phone) return uni.showToast({ title: '请输入手机号', icon: 'none' })
  if (!/^1[3-9]\d{9}$/.test(formData.phone)) return uni.showToast({ title: '手机号格式错误', icon: 'none' })
  if (!formData.password) return uni.showToast({ title: '请设置密码', icon: 'none' })
  // 性别是选填，不需要校验

  isLoading.value = true

  try {
    // 2. 发起请求 (模拟)
    // const res = await uni.request({
    //   url: 'https://你的后端地址/api/register',
    //   method: 'POST',
    //   data: formData
    // })
    
    // 模拟网络延迟
    // await new Promise(resolve => setTimeout(resolve, 1500))
	await registerApi(formData)
    // 假设注册成功
    uni.showToast({
      title: '注册成功',
      icon: 'success'
    })

    // 延迟后返回登录页
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)

  } catch (error) {
	console.log(error)
    uni.showToast({ title: '注册失败，请重试', icon: 'none' })
  } finally {
    isLoading.value = false
  }
}

// 返回登录页
const goToLogin = () => {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
/* 复用登录页的基础样式 */
.page {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%);
  overflow: hidden;
  padding: 40rpx 0; /* 增加一点上下边距防止内容太高被切掉 */
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  z-index: 1;
}
.circle-1 {
  width: 200px;
  height: 200px;
  background: rgba(64, 158, 255, 0.15);
  top: -50px;
  left: -50px;
}
.circle-2 {
  width: 300px;
  height: 300px;
  background: rgba(64, 158, 255, 0.1);
  bottom: -100px;
  right: -50px;
}

/* 注册卡片 */
.register-card {
  position: relative;
  z-index: 10;
  width: 85%;
  max-width: 600rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24rpx;
  padding: 50rpx 40rpx;
  box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(10px);
}

.header {
  text-align: center;
  margin-bottom: 50rpx;
}

.title {
  display: block;
  font-size: 40rpx;
  font-weight: bold;
  color: #303133;
  margin-bottom: 10rpx;
}

.subtitle {
  font-size: 24rpx;
  color: #909399;
}

/* 输入框通用样式 */
.input-group {
  display: flex;
  align-items: center;
  background: #f5f7fa;
  border-radius: 16rpx;
  padding: 0 24rpx;
  margin-bottom: 30rpx;
  height: 100rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
}

.input-focus {
  background: #fff;
  border-color: #409eff;
  box-shadow: 0 0 0 4rpx rgba(64, 158, 255, 0.1);
}

.input-icon {
  margin-right: 20rpx;
}

.input-field {
  flex: 1;
  font-size: 30rpx;
  color: #303133;
  height: 100%;
}

.placeholder-style {
  color: #c0c4cc;
}

/* 性别选择区域样式 */
.gender-section {
  margin-bottom: 30rpx;
  padding: 0 10rpx;
}

.gender-label {
  display: block;
  font-size: 26rpx;
  color: #606266;
  margin-bottom: 16rpx;
}

.gender-options {
  display: flex;
  justify-content: space-between;
  gap: 30rpx;
}

.gender-btn {
  flex: 1;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border-radius: 16rpx;
  border: 2rpx solid transparent;
  color: #909399;
  font-size: 28rpx;
  transition: all 0.3s;
  
  text {
    margin-left: 10rpx;
  }
}

/* 选中状态 - 男 (蓝色) */
.gender-btn.male.active {
  background: #ecf5ff;
  border-color: #409eff;
  color: #409eff;
  
  /* 如果想要深色背景效果，可以用下面这套： */
  background: #409eff;
  color: #fff;
}

/* 选中状态 - 女 (粉色或保持统一蓝色，这里用粉色区分一下) */
.gender-btn.female.active {
  /* background: #fef0f0;
  border-color: #f56c6c;
  color: #f56c6c; */
  
  /* 统一风格建议也用蓝色，或者用稍微柔和的颜色 */
  background: #ff69b4; 
  border-color: #ff69b4;
  color: #fff;
}

/* 按钮样式 */
.register-btn {
  background: linear-gradient(90deg, #409eff, #2b85e4);
  color: #fff;
  border-radius: 50rpx;
  height: 90rpx;
  line-height: 90rpx;
  font-size: 32rpx;
  font-weight: bold;
  box-shadow: 0 8rpx 20rpx rgba(64, 158, 255, 0.3);
  margin-top: 40rpx;
  border: none;
}

.btn-hover {
  transform: scale(0.98);
  opacity: 0.9;
}

/* 底部登录链接 */
.login-link {
  margin-top: 30rpx;
  text-align: center;
  font-size: 28rpx;
  color: #909399;
}

.link-highlight {
  color: #409eff;
  font-weight: 500;
  margin-left: 10rpx;
}
</style>