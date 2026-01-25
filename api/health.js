import request from '@/utils/request.js'

// 获取健康记录列表
export function getHealthList(userId) {
  return request({
    url: '/api/health/list',
    method: 'GET',
    data: { userId }
  })
}

// 添加健康记录
export function addHealthRecord(data) {
  return request({
    url: '/api/health/add',
    method: 'POST',
    data
  })
}

// 删除记录
export function deleteHealthRecord(id) {
  return request({
    url: `/api/health/delete?id=${id}`,
    method: 'POST'
  })
}