<template>
  <view class="page">
    <view class="banner">
      <image :src="service.icon || '/static/logo.png'" mode="aspectFill" class="banner-img" />
    </view>

    <view class="content-card">
      <view class="header">
        <text class="title">{{ service.title }}</text>
        <text class="price">{{ service.price }}</text>
      </view>
      
      <view class="info-item">
        <uni-icons type="star-filled" size="18" color="#ff9c6e"></uni-icons>
        <text class="info-text">服务评分：4.9 (100+人已预约)</text>
      </view>

      <view class="divider"></view>

      <view class="section">
        <text class="section-title">服务介绍</text>
        <text class="desc">{{ service.description || '暂无详细介绍' }}</text>
      </view>

      <view class="section">
        <text class="section-title">服务流程</text>
        <view class="step-box">
          <text>1. 线上预约</text>
          <uni-icons type="arrowright" size="14" color="#ccc"></uni-icons>
          <text>2. 上门服务</text>
          <uni-icons type="arrowright" size="14" color="#ccc"></uni-icons>
          <text>3. 确认完成</text>
        </view>
      </view>
    </view>

    <view class="footer-bar">
      <view class="home-btn" @click="goHome">
        <uni-icons type="home" size="24" color="#666"></uni-icons>
        <text>首页</text>
      </view>
      <button class="order-btn" @click="handleOrder">立即预约</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue' 
import { onLoad } from '@dcloudio/uni-app'
import { fetchServiceDetail, createOrderApi } from '@/api/order.js'
import { useUserStore } from '@/store/user.js'

const userStore = useUserStore()
const service = ref({})
const serviceId = ref(null)

// 页面加载时获取 ID
onLoad((options) => {
  if (options.id) {
    serviceId.value = options.id
    loadDetail(options.id)
  }
})

const loadDetail = async (id) => {
  try {
    uni.showLoading({ title: '加载中' })
    const res = await fetchServiceDetail(id)
    if (res.code === 0) {
      service.value = res.data
    }
  } catch (e) {
    console.error(e)
  } finally {
    uni.hideLoading()
  }
}

const handleOrder = () => {
  if (!userStore.user.id) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    setTimeout(() => uni.navigateTo({ url: '/pages/login/login' }), 1000)
    return
  }

  uni.showModal({
    title: '确认预约',
    content: `确定预约 ${service.value.title} 吗？`,
    success: async (res) => {
      if (res.confirm) {
        try {
          await createOrderApi({
            userId: userStore.user.id,
            name: service.value.title,
            remark: '详情页下单'
          })
          uni.showToast({ title: '预约成功', icon: 'success' })
          setTimeout(() => uni.navigateBack(), 1500)
        } catch (e) {
          uni.showToast({ title: '预约失败', icon: 'none' })
        }
      }
    }
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
  padding-bottom: 100px;
}

.banner {
  width: 100%;
  height: 240px;
  background-color: #fff;
}
.banner-img {
  width: 100%;
  height: 100%;
}

.content-card {
  background: #fff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  margin-top: -20px; /* 向上覆盖一点 banner */
  padding: 24px;
  position: relative;
  z-index: 1;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.title { font-size: 22px; font-weight: bold; color: #333; }
.price { font-size: 20px; font-weight: bold; color: #ff6b00; }

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.info-text { font-size: 14px; color: #666; margin-left: 6px; }

.divider { height: 1px; background: #f0f0f0; margin: 10px 0 20px; }

.section { margin-bottom: 30px; }
.section-title { font-size: 18px; font-weight: 600; color: #333; margin-bottom: 12px; display: block; }
.desc { font-size: 15px; color: #666; line-height: 1.6; }

.step-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  color: #555;
}

/* 底部栏 */
.footer-bar {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 60px;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
  box-sizing: border-box;
}

.home-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
  font-size: 12px;
  color: #666;
}

.order-btn {
  flex: 1;
  background: linear-gradient(135deg, #409eff, #3a7bd5);
  color: #fff;
  border-radius: 20px;
  font-size: 16px;
  line-height: 40px;
  height: 40px;
}
</style>