<template>
  <view class="container">
    <view class="header">
      <text class="title">社区智慧服务助手</text>
      <text class="subtitle">长按说话，自动识别服务需求</text>
    </view>

    <view class="result-box">
      <view v-if="!resultText && !isRecording" class="placeholder">
        试着说：“帮我预约明天上午量血压”<br>
        或 “张大爷需要送餐服务”
      </view>
      <view v-else class="text-content">
        {{ resultText || (isRecording ? '正在聆听中...' : '') }}
      </view>
      
      <view v-if="matchedService" class="tag-box">
        <text class="label">识别服务：</text>
        <view class="tag">{{ matchedService.name }}</view>
      </view>
    </view>

    <view class="footer">
      <view 
        class="record-btn" 
        :class="{ 'recording': isRecording }"
        @touchstart.prevent="handleStart"
        @touchend.prevent="handleEnd"
        @touchcancel.prevent="handleEnd"
      >
        <view class="icon-mic"></view>
        <view class="ripple" v-if="isRecording"></view>
        <view class="ripple delay" v-if="isRecording"></view>
      </view>
      <text class="tip-text">{{ isRecording ? '松开 结束识别' : '长按 语音下单' }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MD5 from '@/utils/md5.js' // 确保你有这个MD5工具文件

// =====================
// 状态管理
// =====================
const isRecording = ref(false)
const resultText = ref('')
const matchedService = ref(null)
const recorderManager = uni.getRecorderManager()

// 服务类型定义
const services = [
  { key: 'food', name: '社区送餐', keywords: ['送餐', '吃饭', '外卖', '饭'] },
  { key: 'help', name: '上门帮忙', keywords: ['帮忙', '打扫', '修', '搬'] },
  { key: 'health', name: '健康监测', keywords: ['血压', '血糖', '量一下', '身体不舒服'] },
  { key: 'haircut', name: '爱心理发', keywords: ['理发', '剪头', '头发'] }
]

// =====================
// 生命周期
// =====================
onMounted(() => {
  initRecorder()
})

// =====================
// 录音管理器初始化
// =====================
function initRecorder() {
  recorderManager.onStart(() => {
    console.log('开始录音')
    isRecording.value = true
    resultText.value = ''
    matchedService.value = null
    // 震动反馈 (微信小程序/App支持)
    uni.vibrateShort()
  })

  recorderManager.onStop((res) => {
    console.log('录音结束', res)
    isRecording.value = false
    if (res.tempFilePath) {
      handleAudioFile(res.tempFilePath)
    }
  })

  recorderManager.onError((err) => {
    console.error('录音报错', err)
    isRecording.value = false
    uni.showToast({ title: '录音失败，请检查权限', icon: 'none' })
  })
}

// =====================
// 交互事件
// =====================
function handleStart() {
  // 配置录音参数：格式推荐 wav 或 pcm，讯飞通常支持 raw/pcm/wav
  // 注意：H5端录音需要HTTPS环境
  recorderManager.start({
    duration: 60000,
    sampleRate: 16000, // 讯飞通常要求 16k 采样率
    numberOfChannels: 1,
    encodeBitRate: 48000,
    format: 'wav' // 推荐使用 wav，兼容性好
  })
}

function handleEnd() {
  recorderManager.stop()
}

// =====================
// 音频处理与API调用
// =====================
function handleAudioFile(filePath) {
  uni.showLoading({ title: '智能识别中...' })

  // 读取文件并转为 Base64
  const fsm = uni.getFileSystemManager()
  
  // H5端处理差异
  // #ifdef H5
  fetch(filePath)
    .then(r => r.blob())
    .then(blob => {
        const reader = new FileReader()
        reader.onloadend = () => {
            const base64data = reader.result.split(',')[1] // 去掉 data:audio/wav;base64, 前缀
            requestAsrApi(base64data)
        }
        reader.readAsDataURL(blob)
    })
  // #endif

  // 小程序/App端处理
  // #ifndef H5
  fsm.readFile({
    filePath: filePath,
    encoding: 'base64',
    success: (res) => {
      requestAsrApi(res.data)
    },
    fail: (err) => {
      uni.hideLoading()
      uni.showToast({ title: '文件读取失败', icon: 'none' })
    }
  })
  // #endif
}

function requestAsrApi(base64Audio) {
  // 配置你的讯飞参数
  const APPID = '0b5eadc8'
  const API_KEY = 'd81cfe7d903196e9510b45359b778947'
  
  // 构造鉴权参数
  const curTime = Math.floor(Date.now() / 1000).toString()
  const param = {
    engine_type: "sms16k",
    aue: "raw"
  }
  // Base64编码 param JSON
  // 注意：UniApp没有内置btoa，简单场景可用buffer或引入库，这里假设 param 比较简单，直接硬编码或者用简单转换
  // 为简化演示，这里使用讯飞要求的 X-Param 格式（通常是Base64后的JSON）
  // 实际开发请引入 'js-base64' 库: Base64.encode(JSON.stringify(param))
  const xParam = "eyJlbmdpbmVfdHlwZSI6ICJzbXMxNmsiLCJhdWUiOiAicmF3In0=" // 预计算好的 {"engine_type": "sms16k","aue": "raw"}
  
  const checkSum = MD5(API_KEY + curTime + xParam)

  uni.request({
    url: 'https://api.xfyun.cn/v1/service/v1/iat',
    method: 'POST',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      'X-Appid': APPID,
      'X-CurTime': curTime,
      'X-Param': xParam,
      'X-CheckSum': checkSum
    },
    data: {
      audio: base64Audio
    },
    success: (res) => {
      uni.hideLoading()
      if (res.data.code === '0') {
        const text = res.data.data
        resultText.value = text
        analyzeIntent(text)
      } else {
        console.log(res.data)
        uni.showToast({ title: '识别失败: ' + res.data.desc, icon: 'none' })
      }
    },
    fail: (err) => {
      uni.hideLoading()
      uni.showToast({ title: '网络请求失败', icon: 'none' })
    }
  })
}

// =====================
// 业务逻辑：意图判断与下单
// =====================
function analyzeIntent(text) {
  // 简单的关键词匹配
  const target = services.find(s => s.keywords.some(k => text.includes(k)))
  
  if (target) {
    matchedService.value = target
    // 弹窗确认下单
    uni.showModal({
      title: '确认服务',
      content: `识别到您需要【${target.name}】，内容：“${text}”，是否立即下单？`,
      confirmText: '立即下单',
      confirmColor: '#1296DB',
      success: (res) => {
        if (res.confirm) {
          createOrder(target.key, text)
        }
      }
    })
  } else {
    uni.showToast({ title: '未匹配到具体服务，请重试', icon: 'none' })
  }
}

// 模拟发送给后端
function createOrder(serviceType, content) {
  uni.showLoading({ title: '正在派单...' })
  
  // 模拟 API 请求
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({ title: '下单成功！社工将尽快联系', icon: 'success' })
    // 这里可以跳转到订单列表页
    console.log('发送给后端:', { type: serviceType, remark: content })
  }, 1000)
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  height: 90vh;
  background-color: #f5f7fa;
  overflow: hidden;
}

.header {
  padding: 60rpx 40rpx;
  background: #fff;
  border-bottom-left-radius: 40rpx;
  border-bottom-right-radius: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
  
  .title {
    display: block;
    font-size: 40rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 10rpx;
  }
  
  .subtitle {
    font-size: 26rpx;
    color: #999;
  }
}

.result-box {
  flex: 1;
  margin: 40rpx;
  padding: 40rpx;
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  .placeholder {
    color: #ccc;
    font-size: 30rpx;
    text-align: center;
    line-height: 1.6;
  }
  
  .text-content {
    font-size: 36rpx;
    color: #333;
    text-align: center;
    line-height: 1.5;
  }
  
  .tag-box {
    margin-top: 40rpx;
    display: flex;
    align-items: center;
    background: #e1f3ff;
    padding: 10rpx 30rpx;
    border-radius: 100rpx;
    
    .label {
      font-size: 24rpx;
      color: #1296db;
      margin-right: 10rpx;
    }
    
    .tag {
      font-size: 28rpx;
      font-weight: bold;
      color: #1296db;
    }
  }
}

.footer {
  height: 300rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.record-btn {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  background: #1296db;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.2s;
  box-shadow: 0 8rpx 20rpx rgba(18, 150, 219, 0.4);
  
  .icon-mic {
    width: 50rpx;
    height: 70rpx;
    background-color: #fff;
    mask: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z'/%3E%3Cpath d='M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z'/%3E%3C/svg%3E") no-repeat center;
    mask-size: contain;
    -webkit-mask: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z'/%3E%3Cpath d='M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z'/%3E%3C/svg%3E") no-repeat center;
    -webkit-mask-size: contain;
  }
  
  &.recording {
    transform: scale(1.1);
    background: #ff5252;
    box-shadow: 0 8rpx 20rpx rgba(255, 82, 82, 0.4);
  }
}

.tip-text {
  margin-top: 30rpx;
  font-size: 28rpx;
  color: #666;
}

// 录音波纹动画
.ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  border: 2rpx solid #ff5252;
  opacity: 0;
  animation: ripple 1.5s infinite linear;
  z-index: -1;
  
  &.delay {
    animation-delay: 0.5s;
  }
}

@keyframes ripple {
  0% {
    width: 140rpx;
    height: 140rpx;
    opacity: 0.8;
  }
  100% {
    width: 250rpx;
    height: 250rpx;
    opacity: 0;
  }
}
</style>