/*
 * @Author: diaochan
 * @Date: 2025-09-04 17:14:30
 * @LastEditors: diaochan
 * @LastEditTime: 2025-09-11 14:48:57
 * @Description: 
 */
/**
 * 用户管理相关API
 */
import request from './request'

/**
 * 获取用户列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.limit - 每页数量
 * @param {string} params.keyword - 搜索关键词
 * @param {number} params.status - 用户状态
 * @param {string} params.start_date - 开始日期
 * @param {string} params.end_date - 结束日期
 * @returns {Promise} 用户列表
 */
export const getUserList = (params) => {
  return request.get('/users', { params })
}

/**
 * 获取用户详情
 * @param {number} id - 用户ID
 * @returns {Promise} 用户详情
 */
export const getUserDetail = (id) => {
  return request.get(`/users/${id}`)
}

/**
 * 删除用户
 * @param {number} id - 用户ID
 * @returns {Promise} 删除结果
 */
export const deleteUser = (id) => {
  return request.delete(`/users/${id}`)
}

/**
 * 修改用户状态
 * @param {number} id - 用户ID
 * @param {number} status - 新状态
 * @returns {Promise} 修改结果
 */
export const updateUserStatus = (id, status) => {
  return request.put(`/users/${id}/status`, { status })
}
