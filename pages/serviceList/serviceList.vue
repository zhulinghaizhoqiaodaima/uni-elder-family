<template>
  <view class="page">
    <view class="header-bg"></view>
    
    <view class="content-container">
      <view class="page-title">全部服务</view>
      
      <view class="list-wrap" v-if="services.length > 0">
        <ServiceItem 
          v-for="(item, index) in services" 
          :key="item.id" 
          :item="item"
          @book="handleBook"
        />
      </view>
      
      <view class="empty-state" v-else>
        <uni-icons type="info" size="40" color="#ccc"></uni-icons>
        <text class="empty-text">暂无服务项目</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ServiceItem from '@/components/ServiceItem.vue'
import { fetchRecommendations, createOrderApi } from '@/api/order.js' // 复用获取列表的接口
import { useUserStore } from '@/store/user.js'

const userStore = useUserStore()
const services = ref([])

// 加载数据
const loadData = async () => {
  try {
    uni.showLoading({ title: '加载中...' })
    // 这里直接复用 fetchRecommendations 接口，因为它实际上就是返回所有服务
    const res = await fetchRecommendations()
    // 兼容处理：有些 request 封装直接返回 data，有些返回 {code, data}
    if (Array.isArray(res)) {
      services.value = res
    } else if (res.code === 0 || res.code === 200) {
      services.value = res.data
    }
  } catch (e) {
    console.error(e)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}

// 处理预约
const handleBook = (item) => {
  // 1. 登录校验
  if (!userStore.userInfo.id) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    setTimeout(() => {
      uni.navigateTo({ url: '/pages/login/login' })
    }, 1000)
    return
  }

  // 2. 弹窗确认
  uni.showModal({
    title: '预约确认',
    content: `确定预约【${item.title}】服务吗？\n价格：${item.price}`,
    success: async (res) => {
      if (res.confirm) {
        submitOrder(item)
      }
    }
  })
}

// 提交订单
const submitOrder = async (item) => {
  try {
    uni.showLoading({ title: '提交中' })
    const res = await createOrderApi({
      userId: userStore.userInfo.id,
      name: item.title,
      remark: '列表页快速预约'
    })
    
    uni.showToast({ title: '预约成功', icon: 'success' })
    
    // 可选：跳转到订单页面查看
    // setTimeout(() => {
    //   uni.navigateTo({ url: '/pages/center/service-orders/service-orders' })
    // }, 1500)
    
  } catch (e) {
    uni.showToast({ title: '预约失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background-color: #f5f7fa;
  position: relative;
}

.header-bg {
  height: 100px;
  background: linear-gradient(135deg, #409eff 0%, #a0cfff 100%);
  position: absolute;
  top: 0;
  width: 100%;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  z-index: 0;
}

.content-container {
  position: relative;
  z-index: 1;
  padding: 20px 16px;
}

.page-title {
  font-size: 22px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 20px;
  margin-top: 10px;
}

.list-wrap {
  padding-bottom: 20px;
}

.empty-state {
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .empty-text {
    color: #999;
    font-size: 14px;
    margin-top: 10px;
  }
}
</style>