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

/**
 * 查询某人的订单列表
 * URL: /order/list?userId=1
 */
export function fetchUserOrders(userId) {
  return request({
    url: '/order/list',
    method: 'GET',
    data: { userId } // uni.request 的 GET 请求参数放在 data 中会自动拼接到 URL
  })
}

// --- 以下保持 Mock 数据不变，直到你有真实接口 ---

// 获取推荐服务列表 (Mock)
export function fetchRecommendations() {
  return request({
    url: '/api/recommendations',
    method: 'GET'
  })
}

export function fetchServiceDetail(id) {
  return request({
    url: '/api/service/detail',
    method: 'GET',
    data: { id }
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