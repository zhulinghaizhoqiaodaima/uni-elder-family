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
			<view class="record-btn" :class="{ 'recording': isRecording }" @touchstart.prevent="handleStart"
				@touchend.prevent="handleEnd" @touchcancel.prevent="handleEnd">
				<view class="icon-mic"></view>
				<view class="ripple" v-if="isRecording"></view>
				<view class="ripple delay" v-if="isRecording"></view>
			</view>
			<text class="tip-text">{{ isRecording ? '松开 结束识别' : '长按 语音下单' }}</text>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		getWebSocketUrl
	} from '@/utils/xf_socket.js' // 引入刚才新建的工具
	import {
		createOrderApi
	} from '@/api/order.js'
	import {
		useUserStore
	} from '@/store/user.js'

	const userStore = useUserStore()
	// =====================
	// 状态管理
	// =====================
	const isRecording = ref(false)
	const resultText = ref('')
	const matchedService = ref(null)
	const recorderManager = uni.getRecorderManager()

	// 配置你的讯飞参数 (正式上线建议由后端生成鉴权URL，前端只负责连接)
	const APPID = '0b5eadc8'
	const API_SECRET = 'ZjhjNzJiMzExNGZiY2ViOWFhZDY1MTc0'
	const API_KEY = 'd81cfe7d903196e9510b45359b778947'

	// 服务类型定义
	const services = [{
			key: 'food',
			name: '社区送餐',
			keywords: ['送餐', '吃饭', '外卖', '饭']
		},
		{
			key: 'help',
			name: '上门帮忙',
			keywords: ['帮忙', '打扫', '修', '搬']
		},
		{
			key: 'health',
			name: '健康监测',
			keywords: ['血压', '血糖', '量一下', '身体不舒服']
		},
		{
			key: 'haircut',
			name: '爱心理发',
			keywords: ['理发', '剪头', '头发']
		}
	]

	// =====================
	// 生命周期
	// =====================
	const userId = ref(null)
	onMounted(() => {
		initRecorder()
		const user = userStore.userInfo
		if (user) {
			userId.value = user.id
		}
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
			uni.showToast({
				title: '录音失败，请检查权限',
				icon: 'none'
			})
		})
	}

	function handleStart() {
		// 讯飞 WebSocket 推荐使用 raw 或 speex，这里用 wav (包含pcm数据) 
		// 采样率必须是 16000
		recorderManager.start({
			duration: 60000,
			sampleRate: 16000,
			numberOfChannels: 1,
			encodeBitRate: 48000,
			format: 'wav'
		})
	}

	function handleEnd() {
		recorderManager.stop()
	}

	// =====================
	// 音频处理与 WebSocket 交互
	// =====================
	function handleAudioFile(filePath) {
		uni.showLoading({
			title: '智能识别中...'
		})

		const fsm = uni.getFileSystemManager()

		// H5端处理
		// #ifdef H5
		fetch(filePath)
			.then(r => r.blob())
			.then(blob => {
				const reader = new FileReader()
				reader.onloadend = () => {
					// 去掉 base64 头 (data:audio/wav;base64,)
					const base64data = reader.result.split(',')[1]
					connectWebSocket(base64data)
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
				connectWebSocket(res.data)
			},
			fail: (err) => {
				uni.hideLoading()
				uni.showToast({
					title: '文件读取失败',
					icon: 'none'
				})
			}
		})
		// #endif
	}

	/**
	 * 核心逻辑：WebSocket 连接与发送
	 */
	function connectWebSocket(base64Audio) {
		const url = getWebSocketUrl(API_KEY, API_SECRET)
		console.log('连接讯飞URL:', url)
		let socketTask = uni.connectSocket({
			url: url,
			success: () => console.log('WebSocket 连接创建成功')
		})

		// 接收消息
		socketTask.onMessage((res) => {
			const data = JSON.parse(res.data)
			if (data.code !== 0) {
				console.error('讯飞识别报错:', data)
				uni.showToast({
					title: `错误: ${data.code}`,
					icon: 'none'
				})
				socketTask.close()
				uni.hideLoading()
				return
			}

			if (data.data && data.data.result) {
				const wsResult = data.data.result
				const text = wsResult.ws.map(item => item.cw.map(w => w.w).join('')).join('')

				// 这里的 text 是分段的，需要累加
				// 如果是 pgs (动态修正)，逻辑会更复杂，这里仅演示基础追加
				resultText.value += text

				if (data.data.status === 2) {
					// 识别结束 (status 2)
					socketTask.close()
					uni.hideLoading()
					console.log('最终结果:', resultText.value)
					analyzeIntent(resultText.value)
				}
			}
		})

		// 连接打开后发送数据
		socketTask.onOpen(() => {
			console.log('WS Open, 发送数据...')
			// 讯飞要求分帧发送，但对于录音文件，可以分块循环发送
			// 每帧建议 1280 字节左右 (Base64后会变大)
			// 为了简化，我们这里把数据切片发送

			const frameSize = 1280 // 每次发送的音频大小
			const len = base64Audio.length
			let offset = 0

			// 循环发送
			while (offset < len) {
				const isFirst = offset === 0
				const isLast = offset + frameSize >= len
				const chunk = base64Audio.substring(offset, offset + frameSize)

				// 构造帧状态
				// 0: 第一帧, 1: 中间帧, 2: 最后一帧
				let status = 1
				if (isFirst) status = 0
				if (isLast) status = 2

				const frameData = {
					common: {
						app_id: APPID
					},
					business: {
						language: "zh_cn",
						domain: "iat",
						accent: "mandarin",
						dwa: "wpgs" // 动态修正 (可选)
					},
					data: {
						status: status,
						format: "audio/L16;rate=16000",
						encoding: "raw", // 或者 "lame" (如果文件很大建议压成 mp3)
						audio: chunk
					}
				}

				// 注意：只有第一帧需要带 common 和 business 字段
				// 后续帧只需要 data 字段，但带上也无妨，讯飞会忽略
				socketTask.send({
					data: JSON.stringify(frameData)
				})

				offset += frameSize
			}
		})

		socketTask.onError((err) => {
			console.error('Socket Error', err)
			uni.hideLoading()
			uni.showToast({
				title: '连接断开',
				icon: 'none'
			})
		})
	}

	// =====================
	// 业务逻辑：意图判断与下单
	// =====================
	function analyzeIntent(text) {
		if (!text) return
		const target = services.find(s => s.keywords.some(k => text.includes(k)))

		if (target) {
			matchedService.value = target
			uni.showModal({
				title: '确认服务',
				content: `识别到您需要【${target.name}】，内容：“${text}”，是否立即下单？`,
				confirmText: '立即下单',
				confirmColor: '#1296DB',
				success: async (res) => {
					if (res.confirm) {
						const payload = {
							userId: userId.value,
							name: target.name, // 对应后端 Name 字段
							remark: `用户语音下单:${text}` // 默认备注，后续可扩展输入框
						}
						try {
							uni.showLoading({
								title: '提交中...'
							})
							await createOrderApi(payload)
							uni.hideLoading()
							uni.showToast({
								title: '预约成功',
								icon: 'success'
							})
						} catch (error) {
							uni.hideLoading()
							uni.showToast({
								title: typeof error === 'string' ? error : '预约失败',
								icon: 'none'
							})
						}
					}
				}
			})
		} else {
			uni.showToast({
				title: '未能匹配服务，请重试',
				icon: 'none'
			})
		}
	}

	function createOrder(serviceType, content) {
		uni.showLoading({
			title: '正在派单...'
		})
		setTimeout(() => {
			uni.hideLoading()
			uni.showToast({
				title: '下单成功！',
				icon: 'success'
			})
			console.log('发送给后端:', {
				type: serviceType,
				remark: content
			})
		}, 1000)
	}
</script>

<style scoped lang="scss">
	// 保持原有样式不变，无需修改
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
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

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
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.03);
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