/**
 * 课程管理相关API
 */
import request from './request'

/**
 * 获取课程列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.limit - 每页数量
 * @param {string} params.keyword - 搜索关键词
 * @param {number} params.status - 课程状态
 * @param {string} params.start_date - 开始日期
 * @param {string} params.end_date - 结束日期
 * @returns {Promise} 课程列表
 */
export const getCourseList = (params) => {
  return request.get('/courses', { params })
}

/**
 * 获取课程详情
 * @param {number} id - 课程ID
 * @returns {Promise} 课程详情
 */
export const getCourseDetail = (id) => {
  return request.get(`/courses/${id}`)
}

/**
 * 删除课程
 * @param {number} id - 课程ID
 * @returns {Promise} 删除结果
 */
export const deleteCourse = (id) => {
  return request.delete(`/courses/${id}`)
}

/**
 * 获取课程统计
 * @returns {Promise} 课程统计数据
 */
export const getCourseStats = () => {
  return request.get('/courses/stats')
}
