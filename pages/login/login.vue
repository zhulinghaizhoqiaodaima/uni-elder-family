<template>
	<view class="page">
		<!-- 背景装饰圆 -->
		<view class="bg-circle circle-1"></view>
		<view class="bg-circle circle-2"></view>

		<view class="login-card">
			<!-- 头部 Logo/标题区域 -->
			<view class="header">
				<view class="logo-placeholder">
					<image src="/static/logo.png" mode="aspectFit" class="logo-img" v-if="hasLogo" />
					<text v-else class="logo-text">ZN</text>
				</view>
				<text class="title">智暖社区</text>
				<text class="subtitle">让关爱触手可及</text>
			</view>

			<!-- 表单区域 -->
			<view class="form-area">
				<!-- 手机号 -->
				<view class="input-group" :class="{ 'input-focus': focusedInput === 'phone' }">
					<uni-icons type="person" size="20" color="#909399" class="input-icon"></uni-icons>
					<input v-model="phone" type="number" maxlength="11" placeholder="请输入手机号"
						placeholder-class="placeholder-style" class="input-field" @focus="focusedInput = 'phone'"
						@blur="focusedInput = ''" />
				</view>

				<!-- 密码 -->
				<view class="input-group" :class="{ 'input-focus': focusedInput === 'password' }">
					<uni-icons type="locked" size="20" color="#909399" class="input-icon"></uni-icons>
					<input v-model="password" type="password" placeholder="请输入密码" placeholder-class="placeholder-style"
						class="input-field" @focus="focusedInput = 'password'" @blur="focusedInput = ''" />
				</view>

				<!-- 辅助链接 -->
				<view class="links-row">
					<text class="link-text forgot">忘记密码?</text>
					<text class="link-text register" @click="goToRegister">注册新账号</text>
				</view>

				<!-- 登录按钮 -->
				<button class="login-btn" :loading="isLoading" :disabled="isLoading" hover-class="login-btn-hover"
					@click="login">
					{{ isLoading ? '登录中...' : '登 录' }}
				</button>
			</view>
		</view>

		<!-- 底部版权 -->
		<view class="footer">
			<text>Smart Warm Community © 2026</text>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		loginApi
	} from '@/api/user.js'
	// 状态变量
	const phone = ref('')
	const password = ref('')
	const focusedInput = ref('') // 当前聚焦的输入框
	const isLoading = ref(false) // 按钮加载状态
	const hasLogo = ref(false) // 如果你有logo图片，改为true并在上面src填入路径

	// 模拟登录功能
	const login = async () => {
		// 基础校验
		if (!phone.value) return uni.showToast({
			title: '请输入手机号',
			icon: 'none'
		})
		if (phone.value.length !== 11) return uni.showToast({
			title: '手机号格式不正确',
			icon: 'none'
		})
		if (!password.value) return uni.showToast({
			title: '请输入密码',
			icon: 'none'
		})

		isLoading.value = true

		try {
			// 模拟网络延迟
			// await new Promise(resolve => setTimeout(resolve, 1500))

			// 这里替换为你真实的 uni.request
			/* 
			const res = await uni.request({ ... })
			*/
			const res = await loginApi({
				phone: phone.value,
				password: password.value
			})


			// 模拟成功
			// const success = true

			if (res) {
				uni.showToast({
					title: '欢迎回来',
					icon: 'success'
				})

				setTimeout(() => {
					// 注意：如果 '/pages/elder/index/index' 是底部 TabBar 页面，必须用 switchTab
					// 如果是普通页面，使用 navigateTo 或 redirectTo
					uni.navigateTo({
						url: '/pages/index/index',
						fail: () => {
							// 如果跳转失败，尝试 switchTab
							uni.switchTab({
								url: '/pages/index/index'
							})
						}
					})
				}, 500)
			} else {
				uni.showToast({
					title: '账号或密码错误',
					icon: 'none'
				})
			}
		} catch (error) {
			uni.showToast({
				title: '网络异常，请重试',
				icon: 'none'
			})
		} finally {
			isLoading.value = false
		}
	}

	// 跳转到注册页面
	const goToRegister = () => {
		uni.navigateTo({
			url: '/pages/register/register'
		})
	}
</script>

<style scoped lang="scss">
	/* 页面整体容器 */
	.page {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		background: linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%);
		overflow: hidden;
	}

	/* 背景装饰圆球 */
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

	/* 登录卡片 */
	.login-card {
		position: relative;
		z-index: 10;
		width: 85%;
		max-width: 600rpx;
		background: rgba(255, 255, 255, 0.95);
		border-radius: 24rpx;
		padding: 60rpx 40rpx;
		box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.06);
		backdrop-filter: blur(10px);
	}

	/* 头部样式 */
	.header {
		text-align: center;
		margin-bottom: 60rpx;
	}

	.logo-placeholder {
		width: 120rpx;
		height: 120rpx;
		background: linear-gradient(135deg, #409eff, #3a8ee6);
		border-radius: 30rpx;
		margin: 0 auto 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 8rpx 16rpx rgba(64, 158, 255, 0.3);
	}

	.logo-text {
		color: #fff;
		font-size: 48rpx;
		font-weight: bold;
	}

	.logo-img {
		width: 80%;
		height: 80%;
	}

	.title {
		display: block;
		font-size: 36rpx;
		font-weight: bold;
		color: #303133;
		letter-spacing: 2rpx;
	}

	.subtitle {
		display: block;
		font-size: 24rpx;
		color: #909399;
		margin-top: 10rpx;
	}

	/* 输入框区域 */
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

	/* 输入框聚焦态 */
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

	/* 辅助链接 */
	.links-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 50rpx;
		padding: 0 10rpx;
	}

	.link-text {
		font-size: 26rpx;
		color: #909399;
	}

	.link-text.register {
		color: #409eff;
		font-weight: 500;
	}

	/* 登录按钮 */
	.login-btn {
		background: linear-gradient(90deg, #409eff, #2b85e4);
		color: #fff;
		border-radius: 50rpx;
		height: 90rpx;
		line-height: 90rpx;
		font-size: 32rpx;
		font-weight: bold;
		box-shadow: 0 8rpx 20rpx rgba(64, 158, 255, 0.3);
		border: none;
	}

	.login-btn-hover {
		transform: scale(0.98);
		opacity: 0.9;
	}

	/* 底部版权 */
	.footer {
		position: absolute;
		bottom: 40rpx;
		font-size: 22rpx;
		color: #c0c4cc;
	}
</style>