// 1. 定义基础域名
// H5 环境下如果配置了代理，这里可以留空或者写 '/api'
// App/小程序环境下必须写完整域名
const BASE_URL = 'http://192.168.100.40:8080'

// 2. 定义请求函数
const request = (options) => {
  return new Promise((resolve, reject) => {
    
    // 获取本地缓存的 Token (如果有)
    const token = uni.getStorageSync('token')

    // 打印请求日志(可选，调试用)
    // console.log('请求发起:', options.url, options.data)

    uni.request({
      url: BASE_URL + options.url, // 拼接完整地址
      method: options.method || 'GET', // 默认 GET
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        // 自动携带 Token，后端通常需要这个
        'Authorization': token ? token : '', 
        ...options.header // 允许单独覆盖 header
      },
      success: (res) => {
        // HTTP 状态码判断
        if (res.statusCode !== 200) {
          uni.showToast({ title: '服务器异常', icon: 'none' })
          return reject('HTTP Error: ' + res.statusCode)
        }

        // 业务状态码判断 (根据你的后端约定)
        const { code, data, message } = res.data
        
        // 兼容 code=0 或 code=200 为成功
        if (code === 0 || code === 200) {
          resolve(data)
        } else if (code === 401) {
          // 特殊处理：Token 过期或未登录
          uni.showToast({ title: '登录已过期，请重新登录', icon: 'none' })
          uni.removeStorageSync('token')
          setTimeout(() => {
            uni.reLaunch({ url: '/pages/login/login' })
          }, 1500)
          reject('Unauthorized')
        } else {
          // 其他业务错误，统一弹出提示
          uni.showToast({ title: message || '请求失败', icon: 'none' })
          reject(message || 'Error')
        }
      },
      fail: (err) => {
        console.error('网络错误:', err)
        uni.showToast({ title: '网络连接失败', icon: 'none' })
        reject(err)
      }
    })
  })
}

export default request