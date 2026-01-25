<template>
  <view class="daily-health-wrap">
    <!-- 头部：显示日期 -->
    <view class="header-row">
      <view class="date-badge">
        <text class="icon">📅</text>
        <text class="date-text">{{ formatDate(record.measureTime) }} 测量记录</text>
      </view>
    </view>

    <!-- 数据展示区：网格布局 -->
    <view class="stats-grid">
      
      <!-- 1. 血压模块 -->
      <view class="stat-card bp-card" v-if="record.bpHigh && record.bpLow">
        <view class="card-top">
          <text class="label">血压</text>
          <text class="icon-indicator">🩺</text>
        </view>
        <view class="card-main">
          <text class="value">{{ record.bpHigh }}/{{ record.bpLow }}</text>
          <text class="unit">mmHg</text>
        </view>
        <view class="status-tag normal">正常</view>
      </view>

      <!-- 2. 心率模块 -->
      <view class="stat-card heart-card" v-if="record.heartRate">
        <view class="card-top">
          <text class="label">心率</text>
          <text class="icon-indicator">❤️</text>
        </view>
        <view class="card-main">
          <text class="value">{{ record.heartRate }}</text>
          <text class="unit">bpm</text>
        </view>
        <view class="status-tag normal">平稳</view>
      </view>

      <!-- 3. 血糖模块 (对应 api/order.js 的 bloodSugar) -->
      <view class="stat-card sugar-card" v-if="record.bloodSugar">
        <view class="card-top">
          <text class="label">血糖</text>
          <text class="icon-indicator">🍬</text>
        </view>
        <view class="card-main">
          <text class="value">{{ record.bloodSugar }}</text>
          <text class="unit">mmol/L</text>
        </view>
        <view class="status-tag normal">空腹</view>
      </view>

    </view>
  </view>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  // 接收的数据结构需对应 api/order.js 返回的格式
  record: {
    type: Object,
    default: () => ({
      measureTime: '暂无日期',
      bpHigh: 0,
      bpLow: 0,
      heartRate: 0,
      bloodSugar: 0
    })
  }
})

// 简单格式化日期，只保留 月-日 或 时间
const formatDate = (dateStr) => {
  if (!dateStr) return '今日'
  // 如果是 '2023-12-25 08:30' 这种格式，截取日期部分
  return dateStr.split(' ')[0] || dateStr
}
</script>

<style scoped lang="scss">
.daily-health-wrap {
  width: 100%;
  box-sizing: border-box;
}

.header-row {
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
}

.date-badge {
  background-color: #e8f3ff;
  color: #409eff;
  padding: 6rpx 16rpx;
  border-radius: 30rpx;
  font-size: 24rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
  
  .icon {
    margin-right: 8rpx;
    font-size: 24rpx;
  }
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
  min-width: 0; /* 防止内容溢出 */
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
  margin-bottom: 12rpx;
  
  .value {
    font-size: 36rpx;
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
  padding: 4rpx 10rpx;
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
}

/* 针对不同类型的卡片微调 */
.bp-card {
  /* 可以给不同卡片加顶部边框色区分 */
  border-top: 4rpx solid #409eff; 
}
.heart-card {
  border-top: 4rpx solid #f56c6c;
}
.sugar-card {
  border-top: 4rpx solid #e6a23c;
}

</style>