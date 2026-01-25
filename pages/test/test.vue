<template>
  <view class="container">
    <button 
      class="long-press-btn" 
      @mousedown="startPress" 
      @mouseup="endPress" 
      @touchcancel="endPress">
      长按触发事件
    </button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      pressTimer: null, // 定时器
      pressDuration: 800, // 长按时间，单位是毫秒
    };
  },
  methods: {
    // 按下按钮时触发
    startPress() {
      this.pressTimer = setTimeout(() => {
        this.onLongPress();
      }, this.pressDuration); // 设置长按时间
    },
    
    // 松开按钮时触发
    endPress() {
      clearTimeout(this.pressTimer); // 清除定时器
    },
    
    // 长按触发的事件
    onLongPress() {
      uni.showToast({
        title: '长按事件触发!',
        icon: 'success'
      });
    }
  }
};
</script>

<style>
.container {
  padding: 20px;
}

.long-press-btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  border: none;
  font-size: 16px;
}
</style>
