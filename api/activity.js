// 定义基础域名 (确保手机和电脑在同一局域网，或者使用内网穿透地址)
// const BASE_URL = 'http://localhost:8080'
import request from '@/utils/request.js'

/**
 * 获取社区活动列表
 * 对应后端 Controller: @RequestMapping("/api/activity") + @GetMapping("/recommendations")
 * Method: GET
 */
// export function fetchActivityList() {
//   return request({
//     url: '/api/activity/recommendations',
//     method: 'GET'
//   })
// }
export function fetchActivityList() {
  return request({
    url: '/api/activity/recommendations',
    method: 'GET'
  })
}
// export function fetchActivityList() {
//   return new Promise((resolve, reject) => {
//     uni.request({
//       url: `${BASE_URL}/api/activity/recommendations`, // 你的接口地址
//       method: 'GET',
//       success: (res) => {
//         if (res.data.code === 0 || res.data.code === 200) {
//           // 直接返回 list，因为里面已经是 title, content, startTime 了
//           resolve(res.data.data) 
//         } else {
//           reject(res.data.message)
//         }
//       },
//       fail: (err) => reject(err)
//     })
//   })
// }

/**
 * 报名参加活动
 * @param {Object} data { userId, activityId }
 */
export function signUpActivity(data) {
  return request({
    url: '/api/activity/signup',
    method: 'POST',
    data: data
  })
}
// export function signUpActivity(data) {
//   return new Promise((resolve, reject) => {
//     uni.request({
//       url: `${BASE_URL}/api/activity/signup`, // 需后端补充此接口
//       method: 'POST',
//       header: {
//         'Content-Type': 'application/json'
//       },
//       data: data,
//       success: (res) => {
//         const result = res.data
//         if (result.code === 0 || result.code === 200) {
//           resolve(result.data)
//         } else {
//           uni.showToast({ title: result.message || '报名失败', icon: 'none' })
//           reject(result.message)
//         }
//       },
//       fail: (err) => {
//         uni.showToast({ title: '网络请求失败', icon: 'none' })
//         reject(err)
//       }
//     })
//   })
// }

