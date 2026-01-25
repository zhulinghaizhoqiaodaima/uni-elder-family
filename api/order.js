// 引入刚才封装好的 request
import request from '@/utils/request.js'

/**
 * 创建订单接口
 * URL: /order/create
 */
export function createOrderApi(data) {
  // 现在的调用变得非常清爽
  return request({
    url: '/order/create',
    method: 'POST',
    data: data
  })
}

// --- 以下保持 Mock 数据不变，直到你有真实接口 ---

// 获取推荐服务列表 (Mock)
export function fetchRecommendations() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { 
          id: 1, 
          code: 'HOUSEKEEPING', 
          title: '家政保洁', 
          desc: '深度清洁', 
          price: '35元/h',
          icon: '/static/logo.png' 
        },
        { 
          id: 2, 
          code: 'ACCOMPANY', 
          title: '陪诊就医', 
          desc: '专业陪护', 
          price: '120元/次',
          icon: '/static/logo.png' 
        }
      ])
    }, 500)
  })
}

// 获取健康档案数据 (Mock)
export function fetchHealthRecords(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 101,
          bpHigh: 128,
          bpLow: 82,
          heartRate: 75,
          bloodSugar: 5.6,
          measureTime: '2025-12-25'
        }
      ])
    }, 300)
  })
}