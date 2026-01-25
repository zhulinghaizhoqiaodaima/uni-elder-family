<template>
  <view class="page">
    <!-- 顶部背景 -->
    <view class="header-bg"></view>

    <!-- 欢迎栏 -->
    <view class="welcome-bar">
      <view class="welcome-text">
        <text class="greeting">你好，{{ userName || '长者' }}</text>
        <text class="tips">今天也要保持好心情哦 🌞</text>
      </view>
    </view>

    <!-- 快捷服务 (核心功能区) -->
    <view class="section-card quick-service-card">
      <view class="section-header">
        <text class="title">快捷服务</text>
        <text class="subtitle">一键呼叫，即刻响应</text>
      </view>
      
      <view class="grid-container">
        <!-- 送餐 -->
        <view class="grid-item" hover-class="hover-effect" @click="handleQuickOrder('MEAL', '爱心送餐')">
          <view class="icon-box meal-bg">
            <uni-icons type="shop-filled" size="32" color="#ff9c6e"></uni-icons>
          </view>
          <text class="label">送餐</text>
        </view>
        
        <!-- 理发 -->
        <view class="grid-item" hover-class="hover-effect" @click="handleQuickOrder('HAIRCUT', '上门理发')">
          <view class="icon-box haircut-bg">
            <uni-icons type="vip-filled" size="32" color="#b37feb"></uni-icons>
          </view>
          <text class="label">理发</text>
        </view>
        
        <!-- 上门帮忙 -->
        <view class="grid-item" hover-class="hover-effect" @click="handleQuickOrder('VISIT', '上门帮忙')">
          <view class="icon-box visit-bg">
            <uni-icons type="staff-filled" size="32" color="#95de64"></uni-icons>
          </view>
          <text class="label">上门帮忙</text>
        </view>
        
        <!-- 量血压 -->
        <view class="grid-item" hover-class="hover-effect" @click="handleQuickOrder('BP', '健康检测')">
          <view class="icon-box bp-bg">
            <uni-icons type="heart-filled" size="32" color="#ff85c0"></uni-icons>
          </view>
          <text class="label">量血压</text>
        </view>
      </view>
    </view>

    <!-- 健康档案 -->
    <view class="section-card health-card">
      <view class="card-header">
        <text class="title">健康档案</text>
        <view class="more-btn" @click="gotoHealth">
          <text>详情</text>
          <uni-icons type="right" size="14" color="#409eff"></uni-icons>
        </view>
      </view>
      
      <!-- 这里直接把 DailyHealth 组件放进来，或者用更美观的布局 -->
      <view class="health-content">
        <DailyHealth v-if="healthRecord" :record="healthRecord" />
        <view v-else class="empty-state">暂无今日数据</view>
      </view>
    </view>

    <!-- 推荐服务 -->
    <view class="section-transparent">
      <view class="section-header">
        <text class="title">为您推荐</text>
      </view>
      <scroll-view class="scroll-row" scroll-x enable-flex>
        <ServiceCard
          v-for="s in recommendations"
          :key="s.id"
          :service="s"
          class="scroll-item"
          @order="handleQuickOrder(s.code, s.title)"
        />
      </scroll-view>
    </view>
    
    <!-- 确认下单弹窗 (可选) -->
    <!-- 这里简单用 uni.showModal 代替 -->

  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ServiceCard from '@/components/ServiceCard.vue'
import DailyHealth from '@/components/DailyHealth.vue'
// 引入封装好的 API
import { createOrderApi, fetchRecommendations, fetchHealthRecords } from '@/api/order.js'

// 状态
const userName = ref('') 
const recommendations = ref([])
const healthRecord = ref(null)
const userId = ref(null)
onMounted(async () => {
  // 1. 获取用户信息缓存
  const user = uni.getStorageSync('user')
  if (user) {
    userName.value = user.name
    userId.value = user.id
	console.log(userId)
  }

  // 2. 加载数据
  loadData()
})

const loadData = async () => {
  try {
    recommendations.value = await fetchRecommendations()
    const records = await fetchHealthRecords(userId)
    if(records && records.length > 0) {
      healthRecord.value = records[0]
    }
  } catch (e) {
    console.error(e)
  }
}

// 统一处理下单逻辑
const handleQuickOrder = (serviceCode, serviceName) => {
  // 弹出确认框
  uni.showModal({
    title: '确认服务',
    content: `您确定要预约【${serviceName}】服务吗？`,
    success: async (res) => {
      if (res.confirm) {
        // 构建后端需要的参数
        const payload = {
          userId: userId.value,  
          name: serviceName, // 对应后端 Name 字段
          remark: "用户一键快捷下单" // 默认备注，后续可扩展输入框
        }

        try {
          uni.showLoading({ title: '提交中...' })
          await createOrderApi(payload)
          uni.hideLoading()
          
          uni.showToast({
            title: '预约成功',
            icon: 'success'
          })
        } catch (error) {
          uni.hideLoading()
          uni.showToast({
            title: typeof error === 'string' ? error : '预约失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

const gotoHealth = () => {
  uni.navigateTo({ url: '/pages/elder/health/health' })
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background-color: #f6f7f9;
  padding-bottom: 40rpx;
  position: relative;
}

/* 顶部蓝色背景装饰 */
.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 350rpx;
  background: linear-gradient(180deg, #409eff 0%, #f6f7f9 100%);
  z-index: 0;
  border-bottom-left-radius: 40rpx;
  border-bottom-right-radius: 40rpx;
}

/* 欢迎语 */
.welcome-bar {
  position: relative;
  z-index: 1;
  padding: 40rpx 30rpx 20rpx;
  
  .welcome-text {
    color: #fff;
    .greeting {
      font-size: 44rpx;
      font-weight: bold;
      display: block;
      margin-bottom: 8rpx;
    }
    .tips {
      font-size: 26rpx;
      opacity: 0.9;
    }
  }
}

/* 通用卡片样式 */
.section-card {
  position: relative;
  z-index: 1;
  background: #fff;
  border-radius: 24rpx;
  margin: 0 30rpx 30rpx;
  padding: 30rpx;
  box-shadow: 0 8rpx 20rpx rgba(0,0,0,0.03);
}

.section-header {
  display: flex;
  align-items: baseline;
  margin-bottom: 30rpx;
  
  .title {
    font-size: 34rpx;
    font-weight: bold;
    color: #303133;
    margin-right: 16rpx;
  }
  
  .subtitle {
    font-size: 24rpx;
    color: #909399;
  }
}

/* 快捷服务宫格 */
.grid-container {
  display: flex;
  justify-content: space-between;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 140rpx;
  
  .icon-box {
    width: 100rpx;
    height: 100rpx;
    border-radius: 30rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16rpx;
    transition: transform 0.2s;
  }
  
  .label {
    font-size: 26rpx;
    color: #333;
    font-weight: 500;
  }
}

/* 图标背景色 */
.meal-bg { background: #fff2e8; }
.haircut-bg { background: #f9f0ff; }
.visit-bg { background: #f6ffed; }
.bp-bg { background: #fff0f6; }

/* 按钮点击效果 */
.hover-effect {
  opacity: 0.8;
  transform: scale(0.98);
}

/* 健康档案卡片 */
.health-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .title {
      font-size: 34rpx;
      font-weight: bold;
      color: #303133;
    }
    
    .more-btn {
      display: flex;
      align-items: center;
      font-size: 26rpx;
      color: #409eff;
      padding: 10rpx;
    }
  }
  
  .health-content {
    background: #f8faff;
    border-radius: 16rpx;
    padding: 20rpx;
  }
}

/* 推荐服务 (透明背景) */
.section-transparent {
  margin: 0 30rpx 40rpx;
  
  .section-header {
    margin-bottom: 20rpx;
    .title {
      font-size: 34rpx;
      font-weight: bold;
      color: #303133;
    }
  }
}

.scroll-row {
  white-space: nowrap;
  width: 100%;
  height: 240rpx; /* 根据 ServiceCard 高度调整 */
}

.scroll-item {
  display: inline-block;
  margin-right: 20rpx;
  vertical-align: top;
}
</style>