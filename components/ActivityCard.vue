<template>
  <view class="activity-card">
    <!-- 左侧/顶部：装饰图标或日期 -->
    <view class="card-left">
      <view class="icon-box">
        <uni-icons type="calendar-filled" size="28" color="#fff"></uni-icons>
      </view>
    </view>

    <!-- 右侧：内容区域 -->
    <view class="card-right">
      <view class="header">
        <text class="title">{{ activity.title }}</text>
        <view class="status-badge">报名中</view>
      </view>

      <text class="desc">{{ activity.content }}</text>

      <!-- 信息行：时间和地点 -->
      <view class="info-row">
        <uni-icons type="smallcircle" size="14" color="#ff9c6e"></uni-icons>
        <text class="info-text">开始时间: {{ activity.startTime }}</text>
      </view>
      <view class="info-row">
        <uni-icons type="location" size="14" color="#ff9c6e"></uni-icons>
        <text class="info-text">活动地点: {{ activity.location }}</text>
      </view>

      <!-- 底部按钮 -->
      <view class="footer">
        <button class="signup-btn" @click.stop="$emit('signup', activity)">
          立即报名
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  // 接收完整的活动对象
  activity: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style scoped lang="scss">
.activity-card {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 24rpx; /* 卡片间距 */
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.99);
  }
}

.card-left {
  margin-right: 24rpx;
  .icon-box {
    width: 90rpx;
    height: 90rpx;
    background: linear-gradient(135deg, #ff9c6e, #ff7a45);
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6rpx 12rpx rgba(255, 122, 69, 0.2);
  }
}

.card-right {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8rpx;

  .title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    line-height: 1.4;
    flex: 1;
    margin-right: 10rpx;
  }

  .status-badge {
    font-size: 20rpx;
    color: #ff7a45;
    background-color: #fff2e8;
    padding: 4rpx 12rpx;
    border-radius: 8rpx;
    flex-shrink: 0;
  }
}

.desc {
  font-size: 24rpx;
  color: #888;
  margin-bottom: 16rpx;
  line-height: 1.4;
  /* 限制两行显示 */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.info-row {
  display: flex;
  align-items: flex-start; /* 顶部对齐，防止文字换行图标错位 */
  margin-bottom: 8rpx;

  .info-text {
    font-size: 22rpx;
    color: #666;
    margin-left: 8rpx;
    line-height: 1.3;
  }
}

.footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 12rpx;
}

.signup-btn {
  margin: 0;
  padding: 0 30rpx;
  height: 56rpx;
  line-height: 56rpx;
  font-size: 24rpx;
  color: #fff;
  background: linear-gradient(90deg, #ff9c6e, #ff7a45);
  border-radius: 28rpx;
  border: none;
  
  /* 移除原生button默认样式 */
  &::after { border: none; }
}
</style>