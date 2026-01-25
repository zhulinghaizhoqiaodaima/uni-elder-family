<template>
  <view class="service-card" @click="$emit('detail', service)">
    <view class="card-top">
      <view class="icon-box">
        <image 
          :src="service.icon || '/static/logo.png'" 
          mode="aspectFit" 
          class="srv-icon" 
        />
      </view>
      <view class="hot-tag" v-if="index === 0">HOT</view>
    </view>

    <view class="content">
      <text class="title">{{ service.title }}</text>
      <text class="desc">{{ service.description }}</text> </view>

    <view class="footer">
      <text class="price">{{ service.price }}</text>
      <view class="btn" @click.stop="$emit('order', service)">
        <text>预约</text>
      </view>
    </view>
  </view>
</template>
<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  service: {
    type: Object,
    default: () => ({})
  },
  index: {
    type: Number,
    default: 0
  }
})
</script>

<style scoped lang="scss">
.service-card {
  width: 280rpx; /* 稍微调窄一点，让屏幕能露出第三个卡片的一部分，提示可滑动 */
  display: inline-flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 24rpx;
  padding: 24rpx;
  box-sizing: border-box;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
  margin-right: 20rpx;
  white-space: normal;
  vertical-align: top;
  position: relative;
  border: 1px solid #f0f0f0;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20rpx;
}

.icon-box {
  width: 80rpx;
  height: 80rpx;
  background: #f0f7ff;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.srv-icon {
  width: 50rpx;
  height: 50rpx;
}

.hot-tag {
  font-size: 18rpx;
  color: #ff4d4f;
  background: #fff1f0;
  padding: 4rpx 8rpx;
  border-radius: 8rpx;
  font-weight: bold;
}

.content {
  display: flex;
  flex-direction: column;
  min-height: 90rpx;
  margin-bottom: 16rpx;
}

.title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.desc {
  font-size: 22rpx;
  color: #999;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.price {
  font-size: 28rpx;
  font-weight: bold;
  color: #ff6b00;
}

.btn-arrow {
  width: 44rpx;
  height: 44rpx;
  background: linear-gradient(135deg, #409eff, #3a7bd5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 8rpx rgba(64, 158, 255, 0.25);
}
</style>