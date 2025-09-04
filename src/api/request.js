/**
 * HTTP 请求封装
 */
import axios from 'axios'
import { message } from 'ant-design-vue'
import router from '@/router'

// 创建axios实例
const request = axios.create({
  baseURL: '/api/admin',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 添加认证token
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { data } = response
    
    // 如果是健康检查接口，直接返回
    if (response.config.url?.includes('/health')) {
      return data
    }
    
    // 处理业务错误
    if (data.success === false) {
      // 401 未授权，跳转到登录页
      if (data.code === 401) {
        message.error('登录已过期，请重新登录')
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user_info')
        router.push('/login')
        return Promise.reject(new Error('未授权'))
      }
      
      // 其他业务错误
      console.error('业务错误:', data.message)
      return data
    }
    
    return data
  },
  (error) => {
    console.error('响应错误:', error)
    
    // 网络错误
    if (!error.response) {
      message.error('网络连接失败，请检查网络')
      return Promise.reject(error)
    }
    
    const { status, data } = error.response
    
    switch (status) {
      case 401:
        message.error('登录已过期，请重新登录')
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user_info')
        router.push('/login')
        break
      case 403:
        message.error('权限不足')
        break
      case 404:
        message.error('请求的资源不存在')
        break
      case 429:
        message.error('请求过于频繁，请稍后再试')
        break
      case 500:
        message.error('服务器内部错误')
        break
      default:
        message.error(data?.message || `请求失败 (${status})`)
        break
    }
    
    return Promise.reject(error)
  }
)

export default request
