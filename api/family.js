import request from '@/utils/request.js'

// 绑定家属
export function bindFamilyApi(data) {
  return request({
    url: '/api/family/bind',
    method: 'POST',
    data
  })
}

// 获取家属列表
export function getFamilyListApi(userId) {
  return request({
    url: '/api/family/list',
    method: 'GET',
    data: { userId }
  })
}

// 解绑家属
export function unbindFamilyApi(id) {
  return request({
    url: '/api/family/unbind',
    method: 'POST',
    // 注意：如果是POST请求且参数在URL上，根据request封装可能需要放在params或者直接拼接，
    // 或者后端改为 @RequestBody 接收 ID。
    // 这里为了适配 request.js 的通用逻辑，建议后端改为 @RequestBody 接收 {id: xxx} 对象，
    // 或者在 request.js 中支持 params。
    // 简单起见，我们这里使用 query string 方式：
    url: `/api/family/unbind?id=${id}`, 
  })
}