<template>
    <view class="voice">
      <button @click="start">按住说话</button>
    </view>
  </template>
  
  <script setup>
  import { startSpeech, stopSpeech } from '@/utils/speech'
  
  // 正确获取 emit
  const emit = defineEmits(['intent'])
  
  const start = async () => {
    const text = await startSpeech()
  
    // 简单意图解析：按关键词匹配
    if (/送餐/.test(text))
      emit('intent', { type: 'ORDER', serviceCode: 'MEAL' })
    else if (/理发/.test(text))
      emit('intent', { type: 'ORDER', serviceCode: 'HAIRCUT' })
    else if (/到哪/.test(text))
      emit('intent', { type: 'QUERY', query: 'order_status' })
    else
      uni.showToast({ title: '未识别指令', icon: 'none' })
  }
  </script>
  