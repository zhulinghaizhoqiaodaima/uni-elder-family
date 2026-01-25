<template>
  <view class="page">
    <view class="header-bg"></view>

    <view class="content-container">
      <view class="page-title">我的服务订单</view>

      <view class="order-list" v-if="orders.length > 0">
        <view
          class="order-card"
          v-for="(order, index) in orders"
          :key="order.id"
        >
          <view class="card-header">
            <view class="service-name">
              <image src="/static/icons/activity_active.png" class="service-icon" mode="aspectFit"></image>
              <text>{{ order.name }}</text>
            </view>
            <view class="status-tag" :class="getStatusClass(order.status)">
              {{ getStatusText(order.status) }}
            </view>
          </view>

          <view class="divider"></view>

          <view class="card-body">
            <view class="info-row">
              <text class="label">下单时间：</text>
              <text class="value">{{ formatDate(order.createTime) }}</text>
            </view>
            <view class="info-row" v-if="order.remark">
              <text class="label">备注信息：</text>
              <text class="value remark-text">{{ order.remark }}</text>
            </view>
            <view class="info-row">
              <text class="label">联系人：</text>
              <text class="value">{{ order.contactName }} ({{ order.contactPhone }})</text>
            </view>
          </view>

          <view class="card-footer">
            <view class="order-id">订单号: {{ order.id }}</view>
            <button class="action-btn" @click="viewOrderDetail(order)">查看详情</button>
          </view>
        </view>
      </view>

      <view class="empty-state" v-else>
        <image src="/static/logo.png" class="empty-img" mode="aspectFit"></image>
        <text class="empty-text">暂无历史订单</text>
        <button class="go-home-btn" @click="goHome">去下单</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchUserOrders } from '@/api/order.js'
import { useUserStore } from '@/store/user.js'

const userStore = useUserStore()
const orders = ref([]) 
import { formatDate } from '@/utils/format.js'
// 获取订单状态文案
const getStatusText = (status) => {
  const map = {
    0: '待接单',
    1: '进行中',
    2: '已完成',
    3: '已取消'
  }
  return map[status] || '未知状态'
}

// 获取状态对应的样式类
const getStatusClass = (status) => {
  if (status === 0) return 'status-pending' // 橙色
  if (status === 1) return 'status-process' // 蓝色
  if (status === 2) return 'status-success' // 绿色
  return 'status-gray'
}

// 获取数据
const loadData = async () => {
  // 1. 检查是否登录
  const userId = userStore.userInfo?.id
  if (!userId) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    setTimeout(() => {
        uni.navigateTo({ url: '/pages/login/login' })
    }, 1500)
    return
  }

  try {
    uni.showLoading({ title: '加载中...' })
    // 2. 调用后端接口
    const data = await fetchUserOrders(userId)
	orders.value = data
    
  } catch (error) {
    console.error(error)
    uni.showToast({ title: '网络异常', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}

onMounted(() => {
  loadData()
})

const viewOrderDetail = (order) => {
  uni.showModal({
    title: '订单详情',
    content: `服务：${order.name}\n备注：${order.remark || '无'}\n状态：${getStatusText(order.status)}`,
    showCancel: false
  })
}

const goHome = () => {
  uni.switchTab({ url: '/pages/index/index' })
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background-color: #f5f7fa;
  position: relative;
}

/* 顶部装饰条 */
.header-bg {
  height: 120px;
  background: linear-gradient(135deg, #4b8df8 0%, #3a7bd5 100%);
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 0;
}

.content-container {
  position: relative;
  z-index: 1;
  padding: 20px 16px;
}

.page-title {
  color: #fff;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
  margin-top: 10px;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 30px;
}

/* 卡片样式 */
.order-card {
  background: #fff;
  border-radius: 12px;
  padding: 0 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
}

.service-name {
  display: flex;
  align-items: center;
  font-size: 17px;
  font-weight: 600;
  color: #333;
}

.service-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

/* 状态标签样式 */
.status-tag {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 500;
}
.status-pending { background-color: #fff7e6; color: #ff9900; }
.status-process { background-color: #e6f7ff; color: #1890ff; }
.status-success { background-color: #f6ffed; color: #52c41a; }
.status-gray { background-color: #f5f5f5; color: #999; }

.divider {
  height: 1px;
  background-color: #f0f0f0;
}

.card-body {
  padding: 16px 0;
}

.info-row {
  display: flex;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.label {
  color: #888;
  width: 70px;
  flex-shrink: 0;
}

.value {
  color: #333;
  flex: 1;
}

.remark-text {
  color: #666;
  font-style: italic;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0 16px;
  border-top: 1px dashed #f0f0f0;
}

.order-id {
  font-size: 12px;
  color: #ccc;
}

.action-btn {
  margin: 0;
  background: #fff;
  color: #4b8df8;
  border: 1px solid #4b8df8;
  border-radius: 18px;
  font-size: 13px;
  padding: 0 16px;
  height: 32px;
  line-height: 30px;
}

.action-btn:active {
  background-color: #f0f8ff;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 80px;
}

.empty-img {
  width: 120px;
  height: 120px;
  opacity: 0.5;
  margin-bottom: 20px;
}

.empty-text {
  color: #999;
  font-size: 15px;
  margin-bottom: 30px;
}

.go-home-btn {
  background: #4b8df8;
  color: #fff;
  padding: 0 40px;
  height: 40px;
  line-height: 40px;
  border-radius: 20px;
  font-size: 15px;
  box-shadow: 0 4px 10px rgba(75, 141, 248, 0.3);
}
</style>