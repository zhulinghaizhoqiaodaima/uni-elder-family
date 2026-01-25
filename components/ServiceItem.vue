<template>
  <view class="service-item">
    <view class="img-box">
      <image 
        :src="item.icon || '/static/logo.png'" 
        class="service-icon" 
        mode="aspectFit"
      ></image>
    </view>

    <view class="info-box">
      <text class="title">{{ item.title }}</text>
      <text class="desc">{{ item.description || '暂无描述' }}</text>
    </view>

    <view class="action-box">
      <text class="price">{{ item.price }}</text>
      <button class="book-btn" @click.stop="$emit('book', item)">预约</button>
    </view>
  </view>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style scoped lang="scss">
.service-item {
  display: flex;
  align-items: center;
  background: #ffffff;
  padding: 24rpx;
  margin-bottom: 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.03);
}

.img-box {
  width: 100rpx;
  height: 100rpx;
  background: #f8faff;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.service-icon {
  width: 60rpx;
  height: 60rpx;
}

.info-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-right: 20rpx;
  overflow: hidden; /* 防止文字撑开布局 */
}

.title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.desc {
  font-size: 24rpx;
  color: #999;
  /* 限制显示两行，超出省略 */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  line-height: 1.4;
}

.action-box {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
}

.price {
  font-size: 28rpx;
  font-weight: bold;
  color: #ff6b00;
  margin-bottom: 12rpx;
}

.book-btn {
  margin: 0;
  padding: 0 24rpx;
  height: 50rpx;
  line-height: 50rpx;
  background: linear-gradient(135deg, #409eff, #3a7bd5);
  color: #fff;
  font-size: 24rpx;
  border-radius: 25rpx;
  border: none;
}

.book-btn:active {
  opacity: 0.9;
  transform: scale(0.98);
}
</style>