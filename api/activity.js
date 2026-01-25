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

export function fetchMyActivities(userId) {
  return request({
    url: '/api/activity/my-list',
    method: 'GET',
    data: { userId }
  })
}

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
