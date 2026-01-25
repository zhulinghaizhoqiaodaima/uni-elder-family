<template>
	<view class="recording">
		<view class="recording-content">
			（此处放置语音识别结果）
		</view>

		<h6 class="recording-title">长按录音</h6>

		<view class="recording-box">
			<canvas
				canvas-id="canvas"
				style="width:100px;height:100px;"
			>
				<view
					class="recording-button"
					@touchstart="start"
					@touchmove="move"
					@touchend="end"
				/>
			</canvas>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import MD5 from '@/utils/md5.js'

// =====================
// 状态
// =====================
const max = 5000        // 最大录音时间(ms)
const frame = 50        // 动画帧率(ms)

const longTag = ref(false)
let longPressTimer = null
let maxTiming = null
let drawTimer = null

const seconds = ref('00')
const ms = ref('00')

// =====================
// 生命周期
// =====================
onMounted(() => {
	console.log('页面 mounted')
})

onUnmounted(() => {
	clearAllTimer()
})

// =====================
// 事件
// =====================
function start() {
	longPressTimer = setTimeout(() => {
		recording()
	}, 500) // 500ms 判定长按
}

function move() {
	clearAllTimer()
}

function end() {
	clearAllTimer()

	if (longTag.value) {
		console.log('点击事件')
	}

	longTag.value = false
	send()
}

// =====================
// 录音逻辑
// =====================
function recording() {
	console.log('录音开始')
	longTag.value = false

	// 最大录音时间
	maxTiming = setTimeout(() => {
		clearInterval(drawTimer)
		console.log('录音超时')
	}, max)

	// Canvas 动画
	let angle = -0.5
	const ctx = uni.createCanvasContext('canvas')

	drawTimer = setInterval(() => {
		ctx.beginPath()
		ctx.setStrokeStyle('#1296db')
		ctx.setLineWidth(3)
		ctx.arc(
			50,
			50,
			25,
			-0.5 * Math.PI,
			(angle += 2 / (max / frame)) * Math.PI,
			false
		)
		ctx.stroke()
		ctx.draw()
	}, frame)
}

// =====================
// 语音识别请求
// =====================
function send() {
	uni.showModal({
		title: '提示',
		content: '是否进行语音识别',
		confirmColor: '#1296DB',
		success(res) {
			if (!res.confirm) return

			const appid = '5c9c2bdd'
			const time = Math.floor(Date.now() / 1000)
			const param = 'eyJlbmdpbmVfdHlwZSI6ICJzbXMxNmsiLCJhdWUiOiAicmF3In0='
			const apikey = '13bed048d8395c06906fc816a3310402'
			const checksum = apikey + time + param

			uni.request({
				url: 'https://api.xfyun.cn/v1/service/v1/iat',
				method: 'POST',
				header: {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
					'X-Appid': appid,
					'X-CurTime': time,
					'X-Param': param,
					'X-CheckSum': checksum
				},
				data: {
					audio: param
				},
				success(res) {
					console.log('识别结果', res)
				}
			})
		}
	})
}

// =====================
// 工具
// =====================
function clearAllTimer() {
	clearTimeout(longPressTimer)
	clearTimeout(maxTiming)
	clearInterval(drawTimer)
	longPressTimer = null
	maxTiming = null
	drawTimer = null
}
</script>

<style scoped>
.recording {
	position: absolute;
	inset: 0;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	background: #e7e7e7;
}

.recording-content {
	flex-grow: 1;
	padding: 10upx;
	font-size: 32upx;
	color: #1296db;
	background: #fff;
}

.recording-title {
	padding: 20upx;
	text-align: center;
	font-size: 32upx;
	color: #1296db;
}

.recording-box {
	display: flex;
	justify-content: center;
}

.recording-button {
	position: absolute;
	top: 50upx;
	left: 50upx;
	width: 100upx;
	height: 100upx;
	border: 1px dashed #1296db;
	border-radius: 100upx;
	background: url('@/static/recording.png') no-repeat center;
	background-size: 50% 50%;
	z-index: 10;
}
</style>
