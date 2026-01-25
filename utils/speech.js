// 该文件在 H5 中使用 Web Speech API；在微信小程序中使用 wx.getRecorderManager() 或接入科大讯飞小程序SDK

let rec = null; // 全局记录识别实例

export async function startSpeech() {
  // H5 简单实现
  if (typeof window !== 'undefined' && window.SpeechRecognition) {
    return new Promise((resolve) => {
      rec = new window.SpeechRecognition();
      rec.lang = 'zh-CN';
      rec.onresult = (e) => resolve(e.results[0][0].transcript);
      rec.start();
    });
  }
  // 小程序或不支持环境返回模拟文本
  return Promise.resolve('送餐');
}

export function stopSpeech() {
  // H5 停止
  if (rec && typeof rec.stop === 'function') {
    rec.stop();
  }

  // 小程序停止录音
  if (typeof wx !== 'undefined' && wx.getRecorderManager) {
    const recorder = wx.getRecorderManager();
    recorder.stop();
  }
}
