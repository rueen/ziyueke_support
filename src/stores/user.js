/**
 * 用户管理状态
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import * as userApi from '@/api/user'

export const useUserStore = defineStore('user', () => {
  // 状态
  const userList = ref([])
  const total = ref(0)
  const loading = ref(false)
  const currentUser = ref(null)

  /**
   * 获取用户列表
   * @param {Object} params - 查询参数
   */
  const getUserList = async (params = {}) => {
    loading.value = true
    try {
      const response = await userApi.getUserList(params)
      if (response.code === 200) {
        userList.value = response.data.list
        total.value = response.data.total
      } else {
        message.error(response.message || '获取用户列表失败')
      }
    } catch (error) {
      console.error('获取用户列表失败:', error)
      message.error('获取用户列表失败')
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取用户详情
   * @param {number} id - 用户ID
   */
  const getUserDetail = async (id) => {
    try {
      const response = await userApi.getUserDetail(id)
      if (response.code === 200) {
        currentUser.value = response.data
        return response.data
      } else {
        message.error(response.message || '获取用户详情失败')
        return null
      }
    } catch (error) {
      console.error('获取用户详情失败:', error)
      message.error('获取用户详情失败')
      return null
    }
  }

  /**
   * 删除用户
   * @param {number} id - 用户ID
   */
  const deleteUser = async (id) => {
    try {
      const response = await userApi.deleteUser(id)
      if (response.code === 200) {
        message.success('删除用户成功')
        return true
      } else {
        message.error(response.message || '删除用户失败')
        return false
      }
    } catch (error) {
      console.error('删除用户失败:', error)
      message.error('删除用户失败')
      return false
    }
  }

  /**
   * 修改用户状态
   * @param {number} id - 用户ID
   * @param {number} status - 新状态
   */
  const updateUserStatus = async (id, status) => {
    try {
      const response = await userApi.updateUserStatus(id, status)
      if (response.code === 200) {
        const statusText = status === 1 ? '启用' : '禁用'
        message.success(`${statusText}用户成功`)
        return true
      } else {
        message.error(response.message || '修改用户状态失败')
        return false
      }
    } catch (error) {
      console.error('修改用户状态失败:', error)
      message.error('修改用户状态失败')
      return false
    }
  }

  return {
    // 状态
    userList,
    total,
    loading,
    currentUser,
    
    // 方法
    getUserList,
    getUserDetail,
    deleteUser,
    updateUserStatus
  }
})
