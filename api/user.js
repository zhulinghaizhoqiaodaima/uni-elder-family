import request from '@/utils/request.js'

// 登录
export function loginApi(data) {
  return request({
    url: '/api/user/login',
    method: 'POST',
    data: data
  })
}

// 注册
export function registerApi(data) {
  return request({
    url: '/api/user/register',
    method: 'POST',
    data: data
  })
}