// utils/format.js

/**
 * 格式化日期时间
 * @param {string|number|Date} date 输入的日期 (时间戳、ISO字符串、Date对象)
 * @returns {string} 格式化后的字符串 (yyyy-MM-dd HH:mm:ss)
 */
export function formatDate(date) {
  if (!date) return '-'
  
  // 处理 iOS 下 new Date('2025-10-10 10:10') 可能解析失败的问题
  if (typeof date === 'string' && date.indexOf('-') > -1 && date.indexOf('T') === -1) {
    // 简单的兼容处理，尝试替换 - 为 / (针对部分部分旧浏览器或环境)
    // 但如果是后端传回的复杂 Java toString 格式，JS Date 也能尝试解析
  }

  const d = new Date(date)
  
  // 检查日期是否有效
  if (isNaN(d.getTime())) {
    return date // 解析失败直接返回原字符串
  }

  const year = d.getFullYear()
  const month = (d.getMonth() + 1).toString().padStart(2, '0') // 补零
  const day = d.getDate().toString().padStart(2, '0')
  const hour = d.getHours().toString().padStart(2, '0')
  const minute = d.getMinutes().toString().padStart(2, '0')
  const second = d.getSeconds().toString().padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}