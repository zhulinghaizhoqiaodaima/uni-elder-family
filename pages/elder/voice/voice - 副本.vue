<template>
  <view class="page">
    <view class="content">
      <!-- 语音识别按钮 -->
      <view class="voice-recognition">
        <!-- 监听 touchstart 和 touchend 事件 -->
        <button 
          @mousedown="startRecording" 
          @mouseup="stopRecording"
          class="voice-btn"
        >
          <image class="voice-icon" src="@/static/voice.png" />
          <!-- 按钮图标 -->
        </button>
      </view>

      <!-- 正在录音的动效 -->
      <view v-if="isRecording" class="recording-animation">
        <text class="recording-text">正在录音...</text>
        <div class="recording-icon">
          <span class="dot dot-1"></span>
          <span class="dot dot-2"></span>
          <span class="dot dot-3"></span>
        </div>
      </view>

      <!-- 识别结果展示 -->
      <view class="result">
        <text class="label">识别结果：</text>
        <text class="value">{{ text }}</text>
      </view>

      <!-- 匹配的意图展示 -->
      <view class="result">
        <text class="label">匹配意图：</text>
        <text class="value">{{ intent }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
  import { ref } from 'vue'
  import { startVoiceRecognition } from '../../../utils/voice'
  import { createServiceOrder, fetchServiceCatalog } from '../../../api'

  const text = ref('')
  const intent = ref('')
  const isRecording = ref(false) // 用于控制是否显示录音动效

  // 长按开始录音
  function startRecording() {
    isRecording.value = true
    // 播放录音提示音（可选）
    const audio = new Audio('/static/recording.mp3')  // 使用static目录下的音频文件
    audio.play()
  }

  // 松开按钮停止录音并开始识别
  async function stopRecording() {
    isRecording.value = false
    try {
      // 启动语音识别
      text.value = await startVoiceRecognition()

      // 简单意图匹配
      if (text.value.includes('送餐') || text.value.includes('订餐')) intent.value = 'order_meal'
      else if (text.value.includes('理发')) intent.value = 'order_haircut'
      else if (text.value.includes('量血压') || text.value.includes('血压')) intent.value = 'measure_bp'
      else intent.value = 'unknown'

      // 匹配到意图后直接执行
      handleIntent()
    } catch (e) {
      console.error(e)
      text.value = '识别失败'
    }
  }

  // 根据匹配到的意图直接执行相应的操作
  async function handleIntent() {
    if (intent.value === 'order_meal') {
      // 创建送餐订单
      const services = await fetchServiceCatalog()
      const meal = services.find(s => s.name.includes('送餐'))
      if (meal) {
        await createServiceOrder({
          serviceCode: meal.code,
          serviceName: meal.name,
          elderId: 'elder_id_here', // 假设老人ID
          status: '待服务', // 订单初始状态
          details: '送餐服务'
        })
        uni.showToast({
          title: '送餐订单已创建，等待社工上门服务',
          icon: 'success'
        })
      }
    } else if (intent.value === 'measure_bp') {
      // 创建量血压订单
      const services = await fetchServiceCatalog()
      const bpService = services.find(s => s.name.includes('量血压'))
      if (bpService) {
        await createServiceOrder({
          serviceCode: bpService.code,
          serviceName: bpService.name,
          elderId: 'elder_id_here', // 老人ID
          status: '待服务', // 订单初始状态
          details: '血压测量服务'
        })
        uni.showToast({
          title: '血压测量订单已创建，等待社工上门服务',
          icon: 'success'
        })
      }
    } else {
      uni.showToast({
        title: '未识别意图',
        icon: 'none'
      })
    }
  }
</script>


<style scoped>

	/* 录音动效样式 */
	.recording-animation {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 20px;
	}

	.recording-text {
		width:100px;
		font-size: 18px;
		color: #333;
		margin-bottom: 10px;
	}

	.recording-icon {
		display: flex;
		justify-content: center;
		gap: 4px;
	}

	.dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background-color: #4b8df8;
		animation: dot-bounce 0.8s infinite ease-in-out;
	}

	.dot-1 {
		animation-delay: 0s;
	}

	.dot-2 {
		animation-delay: 0.3s;
	}

	.dot-3 {
		animation-delay: 0.6s;
	}

	@keyframes dot-bounce {

		0%,
		100% {
			transform: translateY(0);
		}

		50% {
			transform: translateY(-8px);
		}
	}

	uni-button {
		border: none !important;
	}

	uni-button:after {
		border: none !important;
	}

	.voice-btn {
		background: rgba(0, 0, 0, 0);
		color: white;
		font-size: 18px;
		padding: 12px 30px;
		border-radius: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		cursor: pointer;
	}

	.voice-icon {
		width: 150px;
		/* 设定图片大小 */
		height: 150px;
		margin-right: 10px;
	}

	.result {
		width: 100px;
		margin-top: 12px;
		font-size: 16px;
	}

	.label {
		font-weight: 600;
		color: #333;
	}

	.value {
		font-weight: 500;
		color: #4b8df8;
	}

	.action-btn {
		margin-top: 30px;
	}

	.execute-btn {
		background: #4b8df8;
		color: white;
		font-size: 18px;
		padding: 12px 40px;
		border-radius: 30px;
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
		border: none;
		cursor: pointer;
		transition: all 0.3s;
	}

	.execute-btn:active {
		transform: scale(0.95);
	}
</style>


<style scoped>
	.page {
		padding: 40%;
		background-color: #f5f7fa;
		/* min-height: 100vh; */
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 30px;
	}

	.voice-recognition {
		display: flex;
		justify-content: center;
		margin-bottom: 20px;
	}



	.voice-btn .icon {
		margin-right: 10px;
	}

	.result {
		margin-top: 12px;
		font-size: 16px;
	}

	.label {
		font-weight: 600;
		color: #333;
	}

	.value {
		font-weight: 500;
		color: #4b8df8;
	}

	.action-btn {
		margin-top: 30px;
	}

	.execute-btn {
		background: #4b8df8;
		color: white;
		font-size: 18px;
		padding: 12px 40px;
		border-radius: 30px;
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
		border: none;
		cursor: pointer;
		transition: all 0.3s;
	}

	.execute-btn:active {
		transform: scale(0.95);
	}
</style>