<template>
	<view class="page">
		<!-- 顶部蓝色背景装饰 -->
		<view class="header-bg">
			<view class="bg-circle c1"></view>
			<view class="bg-circle c2"></view>
		</view>

		<!-- 用户信息卡片 (悬浮) -->
		<view class="user-card">
			<view class="avatar-box">
				<!-- 如果没有头像，显示默认图 -->
				<image :src="user.avatar || '/static/images/default-avatar.jpg'" mode="aspectFill" class="avatar" />
				<!-- 性别图标 -->
				<view class="gender-badge" :class="user.gender === 1 ? 'male' : 'female'" v-if="user.gender !== null">
					<uni-icons :type="user.gender === 1 ? 'staff-filled' : 'staff-filled'" size="12"
						color="#fff"></uni-icons>
				</view>
			</view>

			<view class="info-box">
				<text class="username">{{ user.name || '未登录用户' }}</text>
				<text class="phone">{{ user.phone || '请先登录' }}</text>
			</view>

			<!-- 编辑按钮 (右上角) -->
			<view class="edit-btn" @click="goToEdit">
				<text>编辑</text>
				<uni-icons type="forward" size="14" color="#909399"></uni-icons>
			</view>
		</view>

		<!-- 功能菜单列表 -->
		<view class="menu-list">

			<!-- 服务订单 -->
			<view class="menu-item" hover-class="item-hover" @click="goToServiceOrders">
				<view class="left">
					<view class="icon-box blue-bg">
						<uni-icons type="list" size="22" color="#409eff"></uni-icons>
					</view>
					<text class="label">服务订单</text>
				</view>
				<uni-icons type="right" size="16" color="#c0c4cc"></uni-icons>
			</view>

			<view class="menu-item" @click="goToMyActivities">
				<view class="left">
					<uni-icons type="flag-filled" size="22" color="#ff9a9e"></uni-icons>
					<text class="menu-name">我的活动</text>
				</view>
				<uni-icons type="forward" size="16" color="#ccc"></uni-icons>
			</view>

			<!-- 家属绑定 -->
			<view class="menu-item" hover-class="item-hover" @click="goToFamilyBinding">
				<view class="left">
					<view class="icon-box green-bg">
						<uni-icons type="staff" size="22" color="#67c23a"></uni-icons>
					</view>
					<text class="label">家属绑定</text>
				</view>
				<uni-icons type="right" size="16" color="#c0c4cc"></uni-icons>
			</view>

			<!-- 健康档案 -->
			<view class="menu-item" hover-class="item-hover" @click="goToHealthRecords">
				<view class="left">
					<view class="icon-box red-bg">
						<uni-icons type="heart-filled" size="22" color="#f56c6c"></uni-icons>
					</view>
					<text class="label">健康档案</text>
				</view>
				<uni-icons type="right" size="16" color="#c0c4cc"></uni-icons>
			</view>

		</view>

		<!-- 退出登录按钮 -->
		<view class="logout-section" v-if="isLogin">
			<button class="logout-btn" @click="handleLogout">退出登录</button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		onShow
	} from '@dcloudio/uni-app' // onShow 必须从这里引入
	import {
		useUserStore
	} from '@/store/user.js'

	const userStore = useUserStore()
	const user = ref({})
	const isLogin = ref(false)

	// 使用 onShow 确保每次进入页面都刷新数据（比如修改资料后返回）
	onShow(() => {
		initUserData()
	})

	const initUserData = () => {
		// 1. 优先尝试从本地缓存获取登录信息
		const storageUser = userStore.userInfo
		const token = userStore.token
		console.log(storageUser)
		if (token && storageUser) {
			user.value = storageUser
			isLogin.value = true
		} else {
			// 2. 如果没登录，显示默认或 Mock 数据 (开发阶段方便调试)
			isLogin.value = false
			user.value = {
				name: '请点击登录',
				avatar: '',
				gender: 1,
				phone: ''
			}
		}
	}

	// 跳转逻辑
	const goToEdit = () => {
		if (!checkLogin()) return
		uni.navigateTo({
			url: '/pages/edit/edit'
		})
	}

	const goToServiceOrders = () => {
		if (!checkLogin()) return
		uni.navigateTo({
			url: '/pages/center/service-orders/service-orders'
		})
	}
	const goToMyActivities = () => {
		if (!checkLogin()) return
		uni.navigateTo({
			url: '/pages/center/my-activities/my-activities'
		})
	}
	
	const goToFamilyBinding = () => {
		if (!checkLogin()) return
		uni.navigateTo({
			url: '/pages/center/familyBinding/familyBinding'
		})
	}

	const goToHealthRecords = () => {
		if (!checkLogin()) return
		uni.navigateTo({
			url: '/pages/health/health'
		})
	}

	// 简单的登录检查
	const checkLogin = () => {
		if (!isLogin.value) {
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			})
			setTimeout(() => {
				uni.reLaunch({
					url: '/pages/login/login'
				})
			}, 1000)
			return false
		}
		return true
	}

	// 退出登录逻辑
	const handleLogout = () => {
		uni.showModal({
			title: '提示',
			content: '确定要退出当前账号吗？',
			success: (res) => {
				if (res.confirm) {
					// 1. 清除缓存
					uni.removeStorageSync('token')
					uni.removeStorageSync('user')

					// 2. 重置状态
					isLogin.value = false
					user.value = {}

					uni.showToast({
						title: '已退出',
						icon: 'none'
					})

					// 3. 跳转回登录页 (推荐用 reLaunch 关闭所有页面)
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/login/login'
						})
					}, 800)
				}
			}
		})
	}
</script>

<style scoped lang="scss">
	.page {
		min-height: 100vh;
		background: #f6f7f9;
		padding-bottom: 40rpx;
	}

	/* 顶部背景 */
	.header-bg {
		position: relative;
		width: 100%;
		height: 360rpx;
		background: linear-gradient(135deg, #409eff, #2b85e4);
		border-bottom-left-radius: 40rpx;
		border-bottom-right-radius: 40rpx;
		overflow: hidden;

		.bg-circle {
			position: absolute;
			border-radius: 50%;
			background: rgba(255, 255, 255, 0.1);
		}

		.c1 {
			width: 200rpx;
			height: 200rpx;
			top: -40rpx;
			right: -40rpx;
		}

		.c2 {
			width: 300rpx;
			height: 300rpx;
			bottom: -80rpx;
			left: -60rpx;
		}
	}

	/* 用户卡片 */
	.user-card {
		position: relative;
		margin: -160rpx 30rpx 0;
		/* 负边距上移 */
		background: #fff;
		border-radius: 24rpx;
		padding: 40rpx 30rpx;
		display: flex;
		align-items: center;
		box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.08);
		z-index: 10;
	}

	.avatar-box {
		position: relative;
		margin-right: 30rpx;

		.avatar {
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			border: 4rpx solid #fff;
			box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
			background-color: #f0f2f5;
		}

		.gender-badge {
			position: absolute;
			bottom: 0;
			right: 0;
			width: 36rpx;
			height: 36rpx;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			border: 2rpx solid #fff;

			&.male {
				background: #409eff;
			}

			&.female {
				background: #ff69b4;
			}
		}
	}

	.info-box {
		flex: 1;
		display: flex;
		flex-direction: column;

		.username {
			font-size: 36rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 8rpx;
		}

		.phone {
			font-size: 26rpx;
			color: #909399;
		}
	}

	.edit-btn {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #909399;
		padding: 10rpx 0 10rpx 20rpx;

		text {
			margin-right: 4rpx;
		}
	}

	/* 菜单列表 */
	.menu-list {
		background: #fff;
		border-radius: 24rpx;
		margin: 30rpx 30rpx;
		padding: 0 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.03);
	}

	.menu-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 10rpx;
		border-bottom: 2rpx solid #f5f7fa;

		&:last-child {
			border-bottom: none;
		}

		.left {
			display: flex;
			align-items: center;

			.icon-box {
				width: 60rpx;
				height: 60rpx;
				border-radius: 16rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 20rpx;

				&.blue-bg {
					background: rgba(64, 158, 255, 0.1);
				}

				&.green-bg {
					background: rgba(103, 194, 58, 0.1);
				}

				&.red-bg {
					background: rgba(245, 108, 108, 0.1);
				}
			}

			.label {
				font-size: 30rpx;
				color: #333;
			}
		}
	}

	.item-hover {
		background-color: #f9f9f9;
	}

	/* 退出登录 */
	.logout-section {
		margin: 60rpx 30rpx;

		.logout-btn {
			background: #fff;
			color: #f56c6c;
			border: 2rpx solid #f56c6c;
			/* 描边风格 */
			border-radius: 50rpx;
			font-size: 32rpx;
			height: 90rpx;
			line-height: 86rpx;
			/* 减去border宽度 */

			&:active {
				background: #fef0f0;
			}

			&::after {
				border: none;
			}
		}
	}
</style>