// 语音识别适配示例（H5 使用 Web Speech API，小程序使用平台能力或接入科大讯飞）
export async function startVoiceRecognition() {
	if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
		return new Promise((resolve, reject) => {
			const Recog = window.webkitSpeechRecognition
			const r = new Recog()
			r.lang = 'zh-CN'
			r.onresult = e => resolve(e.results[0][0].transcript)
			r.onerror = e => reject(e)
			r.start()
		})
	} else {
		// 小程序或不支持环境 - 返回 mock
		return Promise.resolve('送餐')
	}
}