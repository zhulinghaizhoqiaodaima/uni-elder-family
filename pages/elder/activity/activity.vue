<template>
	<view class="page">
		<!-- 顶部 Header -->
		<view class="header-section">
			<text class="page-title">社区活动</text>
			<text class="page-subtitle">丰富晚年生活，共建温暖社区</text>
		</view>

		<!-- 活动列表 -->
		<view class="list-container">

			<!-- 循环使用 ActivityCard 组件 -->
			<ActivityCard v-for="item in activities" :key="item.id" :activity="item" @signup="handleSignUp" />

			<!-- 空状态提示 -->
			<view v-if="activities.length === 0" class="empty-box">
				<uni-icons type="calendar" size="40" color="#ddd"></uni-icons>
				<text>暂无近期活动</text>
			</view>

		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import ActivityCard from '@/components/ActivityCard.vue' // 引入新组件
	import {
		fetchActivityList,signUpActivity
	} from '@/api/activity.js'

	const activities = ref([])

	onMounted(async () => {
		try {
			activities.value = await fetchActivityList()
		} catch (e) {
			uni.showToast({
				title: '加载失败',
				icon: 'none'
			})
		}
	})

	// 处理报名事件
	const handleSignUp = (activity) => {
		uni.showModal({
			title: '确认报名',
			content: `活动：${activity.title}\n时间：${activity.startTime}`,
			confirmText: '立即报名',
			confirmColor: '#ff7a45',
			success: async (res) => {
				if (res.confirm) {
					const user = uni.getStorageSync('user')
					await signUpActivity({
						userId: user.id,
						activityId: activity.id
					})
					// console.log('报名活动ID:', activity.id)
					uni.showToast({
						title: '报名成功',
						icon: 'success'
					})
				}
			}
		})
	}
</script>

<style scoped lang="scss">
	.page {
		min-height: 100vh;
		background-color: #f6f7f9;
	}

	.header-section {
		background: linear-gradient(135deg, #ffc069, #ff9c6e);
		padding: 40rpx 40rpx 80rpx;
		/* 底部留白给列表向上覆盖 */
		display: flex;
		flex-direction: column;
	}

	.page-title {
		font-size: 40rpx;
		font-weight: bold;
		color: #fff;
		margin-bottom: 10rpx;
	}

	.page-subtitle {
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.9);
	}

	.list-container {
		padding: 0 30rpx;
		margin-top: -50rpx;
		/* 向上覆盖 Header */
		position: relative;
		z-index: 10;
		padding-bottom: 40rpx;
	}

	.empty-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 100rpx;
		color: #999;
		font-size: 26rpx;
		gap: 20rpx;
	}
</style>