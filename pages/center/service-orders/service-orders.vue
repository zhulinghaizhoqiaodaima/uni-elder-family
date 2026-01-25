<template>
  <view class="page">
    <!-- 历史订单列表 -->
    <view class="section">
      <!-- <view class="section-title">历史订单</view> -->

      <!-- 订单列表 -->
      <view class="order-list">
        <view
          class="order-card"
          v-for="(order, index) in orders"
          :key="index"
        >
          <view class="order-header">
            <text class="order-service">{{ order.service }}</text>
            <text class="order-date">{{ order.date }}</text>
          </view>
          <view class="order-remark" v-if="order.remark">
            <text class="remark-label">备注：</text>
            <text class="remark-text">{{ order.remark }}</text>
          </view>
          <button class="view-detail-btn" @click="viewOrderDetail(order)">查看详情</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const orders = ref([])  // 存储历史订单数据

// 模拟获取历史订单数据的函数
const fetchOrders = async () => {
  orders.value = [
    { service: '上门帮忙', date: '2025-11-10 09:30', remark: '搬运物品', orderId: 1 },
    { service: '陪诊', date: '2025-11-12 14:00', remark: '', orderId: 2 },
    { service: '量血压', date: '2025-11-15 08:30', remark: '早晨检测', orderId: 3 },
    { service: '送餐上门', date: '2025-11-20 12:00', remark: '特别定制餐', orderId: 4 },
  ]
}

// 加载历史订单数据
onMounted(() => {
  fetchOrders()
})

// 查看订单详情
const viewOrderDetail = (order) => {
  // 在这里可以导航到订单详情页面，或者弹出一个对话框显示详细信息
  uni.showToast({
    title: `查看订单：${order.orderId}`,
    icon: 'none'
  })
}
</script>

<style scoped lang="scss">
.page {
  padding: 14px;
  background: #f5f7fa;
  min-height: 100vh;
}

.section {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-card {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.order-service {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.order-date {
  font-size: 14px;
  color: #999;
}

.order-remark {
  margin-top: 12px;
}

.remark-label {
  font-weight: 600;
  color: #333;
}

.remark-text {
  font-size: 14px;
  color: #666;
}

.view-detail-btn {
  width: 100%;
  padding: 10px;
  background-color: #4b8df8;
  color: #fff;
  border-radius: 12px;
  font-size: 16px;
  margin-top: 12px;
}
</style>
