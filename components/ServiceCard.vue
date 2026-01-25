<template>
  <view class="service-card">
    <!-- 图标/图片区域 -->
    <view class="icon-wrapper">
      <!-- 如果图片加载失败，可以用 v-if 切换显示默认图标，这里假设图片路径正确 -->
      <image 
        :src="service.icon || '/static/logo.png'" 
        mode="aspectFit" 
        class="srv-icon" 
      />
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <text class="title">{{ service.title }}</text>
      <text class="desc">{{ service.desc }}</text>
    </view>

    <!-- 底部价格与按钮 -->
    <view class="footer">
      <text class="price">{{ service.price }}</text>
      <view class="btn" @click.stop="$emit('order')">
        <text>预约</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  // 接收的数据结构: { id, title, desc, price, icon }
  service: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style scoped lang="scss">
.service-card {
  /* 关键布局属性：适应横向滚动 */
  width: 300rpx; 
  display: inline-flex; /* 或 inline-block */
  flex-direction: column;
  background: #ffffff;
  border-radius: 20rpx;
  padding: 24rpx;
  box-sizing: border-box; /* 确保padding不撑大宽度 */
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
  margin-right: 20rpx; /* 卡片之间的间距 */
  white-space: normal; /* 强制内部文字换行，抵消父级scroll-view的nowrap */
  vertical-align: top;
  border: 1px solid rgba(0,0,0,0.02);
}

.icon-wrapper {
  width: 100%;
  height: 140rpx;
  background: #f8faff;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.srv-icon {
  width: 80rpx;
  height: 80rpx;
}

.content {
  display: flex;
  flex-direction: column;
  margin-bottom: 20rpx;
  min-height: 80rpx; /* 保持高度一致 */
}

.title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
  
  /* 单行省略 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.desc {
  font-size: 22rpx;
  color: #909399;
  line-height: 1.4;
  
  /* 两行省略 */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto; /* 推到底部 */
}

.price {
  font-size: 28rpx;
  font-weight: bold;
  color: #ff6b00; /* 橙色强调价格 */
}

.btn {
  background: linear-gradient(135deg, #409eff, #2b85e4);
  color: #fff;
  font-size: 24rpx;
  padding: 10rpx 24rpx;
  border-radius: 30rpx;
  font-weight: 500;
  box-shadow: 0 4rpx 10rpx rgba(64, 158, 255, 0.3);
  transition: opacity 0.2s;
}

.btn:active {
  opacity: 0.8;
}
</style>