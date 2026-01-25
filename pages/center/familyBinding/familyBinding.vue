<template>
	<view class="page">
		<view class="add-card">
			<view class="card-title">添加家属</view>

			<view class="form-item">
				<text class="label">姓名</text>
				<input class="input" v-model="form.name" placeholder="请输入家属姓名" />
			</view>

			<view class="form-item">
				<text class="label">手机号</text>
				<input class="input" type="number" v-model="form.phone" maxlength="11" placeholder="请输入家属手机号" />
			</view>

			<view class="form-item">
				<text class="label">关系</text>
				<picker mode="selector" :range="relations" @change="onRelationChange">
					<view class="picker-val">
						{{ form.relation || '请选择关系' }}
						<uni-icons type="bottom" size="14" color="#999"></uni-icons>
					</view>
				</picker>
			</view>

			<button class="add-btn" :loading="loading" @click="handleBind">确认绑定</button>
		</view>

		<view class="list-container">
			<view class="section-header">已绑定家属 ({{ list.length }})</view>

			<view class="family-list" v-if="list.length > 0">
				<view class="family-item" v-for="(item, index) in list" :key="item.id">
					<view class="avatar-placeholder">{{ item.name ? item.name[0] : '家' }}</view>
					<view class="info">
						<view class="name-row">
							<text class="name">{{ item.name }}</text>
							<text class="relation-tag">{{ item.relation }}</text>
						</view>
						<text class="phone">{{ item.phone }}</text>
					</view>
					<view class="action" @click="handleUnbind(item)">
						<uni-icons type="trash" size="20" color="#ff4d4f"></uni-icons>
					</view>
				</view>
			</view>

			<view class="empty-state" v-else>
				<text>暂无绑定家属</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted
	} from 'vue'
	import {
		useUserStore
	} from '@/store/user.js'
	import {
		bindFamilyApi,
		getFamilyListApi,
		unbindFamilyApi
	} from '@/api/family.js'

	const userStore = useUserStore()
	const loading = ref(false)
	const list = ref([])
	const relations = ['子女', '配偶', '亲戚', '护工', '其他']

	const form = reactive({
		name: '',
		phone: '',
		relation: ''
	})

	// 选择关系
	const onRelationChange = (e) => {
		form.relation = relations[e.detail.value]
	}

	// 加载列表
	const loadList = async () => {
		const userId = userStore.userInfo.id
		if (!userId) return

		try {
			const data = await getFamilyListApi(userId)
			list.value = data
		} catch (e) {
			console.error(e)
		}
	}

	// 提交绑定
	const handleBind = async () => {
		if (!form.name || !form.phone || !form.relation) {
			return uni.showToast({
				title: '请填写完整信息',
				icon: 'none'
			})
		}
		if (!/^1\d{10}$/.test(form.phone)) {
			return uni.showToast({
				title: '手机号格式错误',
				icon: 'none'
			})
		}

		loading.value = true
		try {
			const userId = userStore.userInfo.id
			const res = await bindFamilyApi({
				...form,
				userId
			})

			uni.showToast({
				title: '绑定成功',
				icon: 'success'
			})
			// 清空表单
			form.name = ''
			form.phone = ''
			form.relation = ''
			// 刷新列表
			loadList()
		} catch (e) {
			console.error(e)
		} finally {
			loading.value = false
		}
	}

	// 解绑
	const handleUnbind = (item) => {
		uni.showModal({
			title: '提示',
			content: `确定要解绑 ${item.name} 吗？`,
			success: async (res) => {
				if (res.confirm) {
					try {
						const apiRes = await unbindFamilyApi(item.id)
						uni.showToast({
							title: '已解绑',
							icon: 'none'
						})
						loadList()
					} catch (e) {
						console.error(e)
					}
				}
			}
		})
	}

	onMounted(() => {
		loadList()
	})
</script>

<style scoped lang="scss">
	.page {
		min-height: 100vh;
		background-color: #f5f7fa;
		padding: 16px;
	}

	/* 添加卡片 */
	.add-card {
		background: #fff;
		border-radius: 12px;
		padding: 20px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
		margin-bottom: 24px;
	}

	.card-title {
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 20px;
		color: #333;
	}

	.form-item {
		display: flex;
		align-items: center;
		border-bottom: 1px solid #f0f0f0;
		padding: 12px 0;
		margin-bottom: 8px;
	}

	.label {
		width: 70px;
		font-size: 15px;
		color: #666;
	}

	.input,
	.picker-val {
		flex: 1;
		font-size: 15px;
		color: #333;
	}

	.picker-val {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.add-btn {
		margin-top: 20px;
		background: linear-gradient(135deg, #4b8df8, #3a7bd5);
		color: #fff;
		border-radius: 25px;
		font-size: 15px;
		line-height: 44px;
		height: 44px;
	}

	/* 列表区域 */
	.section-header {
		font-size: 16px;
		font-weight: 600;
		color: #666;
		margin-bottom: 12px;
		margin-left: 4px;
	}

	.family-item {
		background: #fff;
		border-radius: 12px;
		padding: 16px;
		display: flex;
		align-items: center;
		margin-bottom: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
	}

	.avatar-placeholder {
		width: 44px;
		height: 44px;
		background: #e6f7ff;
		color: #1890ff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 18px;
		font-weight: bold;
		margin-right: 12px;
	}

	.info {
		flex: 1;
	}

	.name-row {
		display: flex;
		align-items: center;
		margin-bottom: 4px;
	}

	.name {
		font-size: 16px;
		font-weight: 600;
		color: #333;
		margin-right: 8px;
	}

	.relation-tag {
		font-size: 11px;
		background: #f0f9eb;
		color: #67c23a;
		padding: 2px 6px;
		border-radius: 4px;
	}

	.phone {
		font-size: 14px;
		color: #999;
	}

	.action {
		padding: 8px;
	}

	.empty-state {
		text-align: center;
		color: #ccc;
		padding: 40px 0;
		font-size: 14px;
	}
</style>