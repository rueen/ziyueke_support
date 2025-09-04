/**
 * 课程管理状态
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import * as courseApi from '@/api/course'

export const useCourseStore = defineStore('course', () => {
  // 状态
  const courseList = ref([])
  const total = ref(0)
  const loading = ref(false)
  const currentCourse = ref(null)
  const stats = ref(null)

  /**
   * 获取课程列表
   * @param {Object} params - 查询参数
   */
  const getCourseList = async (params = {}) => {
    loading.value = true
    try {
      const response = await courseApi.getCourseList(params)
      if (response.code === 200) {
        courseList.value = response.data.list
        total.value = response.data.total
      } else {
        message.error(response.message || '获取课程列表失败')
      }
    } catch (error) {
      console.error('获取课程列表失败:', error)
      message.error('获取课程列表失败')
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取课程详情
   * @param {number} id - 课程ID
   */
  const getCourseDetail = async (id) => {
    try {
      const response = await courseApi.getCourseDetail(id)
      if (response.code === 200) {
        currentCourse.value = response.data
        return response.data
      } else {
        message.error(response.message || '获取课程详情失败')
        return null
      }
    } catch (error) {
      console.error('获取课程详情失败:', error)
      message.error('获取课程详情失败')
      return null
    }
  }

  /**
   * 删除课程
   * @param {number} id - 课程ID
   */
  const deleteCourse = async (id) => {
    try {
      const response = await courseApi.deleteCourse(id)
      if (response.code === 200) {
        message.success('删除课程成功')
        return true
      } else {
        message.error(response.message || '删除课程失败')
        return false
      }
    } catch (error) {
      console.error('删除课程失败:', error)
      message.error('删除课程失败')
      return false
    }
  }

  /**
   * 获取课程统计
   */
  const getCourseStats = async () => {
    try {
      const response = await courseApi.getCourseStats()
      if (response.code === 200) {
        stats.value = response.data
        return response.data
      } else {
        message.error(response.message || '获取课程统计失败')
        return null
      }
    } catch (error) {
      console.error('获取课程统计失败:', error)
      message.error('获取课程统计失败')
      return null
    }
  }

  return {
    // 状态
    courseList,
    total,
    loading,
    currentCourse,
    stats,
    
    // 方法
    getCourseList,
    getCourseDetail,
    deleteCourse,
    getCourseStats
  }
})
