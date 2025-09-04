/**
 * 认证相关API
 */
import request from './request'

/**
 * 管理员登录
 * @param {Object} data - 登录数据
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @returns {Promise} 登录结果
 */
export const login = (data) => {
  return request.post('/auth/login', data)
}

/**
 * 管理员退出登录
 * @returns {Promise} 退出结果
 */
export const logout = () => {
  return request.post('/auth/logout')
}

/**
 * 获取管理员信息
 * @returns {Promise} 用户信息
 */
export const getProfile = () => {
  return request.get('/auth/profile')
}

/**
 * 健康检查
 * @returns {Promise} 健康状态
 */
export const healthCheck = () => {
  return request.get('/health')
}
