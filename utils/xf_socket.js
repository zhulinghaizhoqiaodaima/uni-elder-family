// utils/xf_socket.js
import CryptoJS from 'crypto-js'

export function getWebSocketUrl(apiKey, apiSecret) {
  const url = 'wss://iat-api.xfyun.cn/v2/iat'
  const host = 'iat-api.xfyun.cn'
  // 讯飞要求使用 GMT 格式时间，例如: "Thu, 01 Aug 2019 01:53:21 GMT"
  const date = new Date().toUTCString()
  
  const algorithm = 'hmac-sha256'
  const headers = 'host date request-line'
  
  // 1. 拼接签名字符串 (注意换行符必须是 \n)
  const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/iat HTTP/1.1`
  
  // 2. HMAC-SHA256 签名
  const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret)
  const signature = CryptoJS.enc.Base64.stringify(signatureSha)
  
  // 3. 拼接 Authorization 头部
  const authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
  const authorization = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(authorizationOrigin))
  
  // 4. 生成最终 URL (关键：所有参数必须进行 URI 编码)
  return `${url}?authorization=${encodeURIComponent(authorization)}&date=${encodeURIComponent(date)}&host=${encodeURIComponent(host)}`
}