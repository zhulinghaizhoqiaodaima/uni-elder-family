<template>
  <view class="daily-health-wrap">
    <view class="header-row">
      <view class="date-badge">
        <text class="icon">📅</text>
        <text class="date-text">{{ todayStr }} 健康概览</text>
      </view>
      
      <view class="refresh-icon" @click="loadData">
        <uni-icons type="loop" size="18" color="#409eff"></uni-icons>
      </view>
    </view>

    <view class="stats-grid">
      
      <view class="stat-card bp-card">
        <view class="card-top">
          <text class="label">血压</text>
          <text class="icon-indicator">🩺</text>
        </view>
        <view class="card-main">
          <text class="value">{{ hasTodayData && record.sbp ? record.sbp + '/' + record.dbp : '--/--' }}</text>
          <text class="unit">mmHg</text>
        </view>
        <view class="status-tag" :class="getBpStatusClass(record.sbp, record.dbp)">
          {{ getBpStatusText(record.sbp, record.dbp) }}
        </view>
      </view>

      <view class="stat-card heart-card">
        <view class="card-top">
          <text class="label">心率</text>
          <text class="icon-indicator">❤️</text>
        </view>
        <view class="card-main">
          <text class="value">{{ hasTodayData && record.heartRate ? record.heartRate : '--' }}</text>
          <text class="unit">bpm</text>
        </view>
        <view class="status-tag normal" v-if="hasTodayData && record.heartRate">
          {{ record.heartRate > 100 ? '偏快' : (record.heartRate < 60 ? '偏慢' : '正常') }}
        </view>
        <view class="status-tag gray" v-else>未测量</view>
      </view>

      <view class="stat-card sugar-card">
        <view class="card-top">
          <text class="label">血糖</text>
          <text class="icon-indicator">🍬</text>
        </view>
        <view class="card-main">
          <text class="value">{{ hasTodayData && record.bloodSugar ? record.bloodSugar : '--' }}</text>
          <text class="unit">mmol/L</text>
        </view>
        <view class="status-tag normal" v-if="hasTodayData && record.bloodSugar">已录入</view>
        <view class="status-tag gray" v-else>未测量</view>
      </view>

    </view>
    
    <view class="empty-tip" v-if="!hasTodayData" @click="goRecord">
      <text>今日尚未打卡，点击去记录 >></text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getHealthList } from '@/api/health.js'
import { useUserStore } from '@/store/user.js'
import { formatDate } from '@/utils/format.js'

const userStore = useUserStore()
const record = ref({}) // 存储今日数据
const hasTodayData = ref(false)

// 获取今日日期字符串 (如 1月25日)
const todayStr = computed(() => {
  const d = new Date()
  return `${d.getMonth() + 1}月${d.getDate()}日`
})

// 判断血压状态
const getBpStatusText = (sbp, dbp) => {
  if (!sbp || !dbp) return '待测量'
  if (sbp > 140 || dbp > 90) return '偏高'
  if (sbp < 90 || dbp < 60) return '偏低'
  return '正常'
}

const getBpStatusClass = (sbp, dbp) => {
  if (!sbp || !dbp) return 'gray'
  if (sbp > 140 || dbp > 90 || sbp < 90 || dbp < 60) return 'warning'
  return 'normal'
}

// 加载数据
const loadData = async () => {
  const userId = userStore.userInfo.id
  if (!userId) return

  try {
    const res = await getHealthList(userId)
	console.log(res)
    if (res.length > 0) {
      // 后端返回的数据通常按时间倒序，取第一条最新的
      const latestRecord =res[0]
      
      // 判断是否是今天的记录
      // 假设 backend 返回的 measureTime 格式为 "2026-01-25 14:00:00" 或 时间戳
      // 我们截取前10位日期进行比对
      const recordDate = formatDate(latestRecord.measureTime).substring(0, 10) // "2026-01-25"
      const todayDate = formatDate(new Date()).substring(0, 10)
      
      if (recordDate === todayDate) {
        record.value = latestRecord
        hasTodayData.value = true
      } else {
        // 如果最新的不是今天的，置空
        record.value = {}
        hasTodayData.value = false
      }
    }
  } catch (e) {
    console.error('获取健康数据失败', e)
  }
}

const goRecord = () => {
  // 跳转到健康档案录入页面
  uni.navigateTo({ url: '/pages/health/health' })
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.daily-health-wrap {
  width: 100%;
  box-sizing: border-box;
}

.header-row {
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date-badge {
  background-color: #e8f3ff;
  color: #409eff;
  padding: 6rpx 20rpx;
  border-radius: 30rpx;
  font-size: 26rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  
  .icon {
    margin-right: 8rpx;
    font-size: 24rpx;
  }
}

.refresh-icon {
  padding: 10rpx;
}

/* 网格布局 */
.stats-grid {
  display: flex;
  justify-content: space-between;
  gap: 20rpx;
}

/* 单个卡片通用样式 */
.stat-card {
  flex: 1;
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx 16rpx;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.03);
  min-width: 0;
  height: 160rpx; /* 固定高度，保持整齐 */
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
  
  .label {
    font-size: 24rpx;
    color: #606266;
  }
  .icon-indicator {
    font-size: 24rpx;
  }
}

.card-main {
  display: flex;
  align-items: baseline;
  flex: 1; /* 撑开中间 */
  
  .value {
    font-size: 32rpx; /* 字体稍微调小适应窄屏 */
    font-weight: bold;
    color: #303133;
    margin-right: 4rpx;
    line-height: 1;
  }
  
  .unit {
    font-size: 20rpx;
    color: #909399;
  }
}

.status-tag {
  align-self: flex-start;
  padding: 2rpx 12rpx;
  border-radius: 8rpx;
  font-size: 20rpx;
  
  &.normal {
    background-color: #f0f9eb;
    color: #67c23a;
  }
  &.warning {
    background-color: #fdf6ec;
    color: #e6a23c;
  }
  &.gray {
    background-color: #f4f4f5;
    color: #909399;
  }
}

/* 卡片顶部边框颜色 */
.bp-card { border-top: 4rpx solid #409eff; }
.heart-card { border-top: 4rpx solid #f56c6c; }
.sugar-card { border-top: 4rpx solid #e6a23c; }

.empty-tip {
  margin-top: 20rpx;
  text-align: center;
  font-size: 24rpx;
  color: #409eff;
  background: #f0f8ff;
  padding: 10rpx;
  border-radius: 8rpx;
}
</style>