/**
 * 认证状态管理
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import * as authApi from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref(localStorage.getItem('admin_token') || '')
  const userInfo = ref(null)
  const isLoggedIn = ref(!!token.value)

  /**
   * 登录
   * @param {Object} credentials - 登录凭据
   * @param {string} credentials.username - 用户名
   * @param {string} credentials.password - 密码
   * @returns {Promise<boolean>} 登录是否成功
   */
  const login = async (credentials) => {
    try {
      const response = await authApi.login(credentials)
      
      if (response.code === 200) {
        console.log('登录成功，开始处理数据...')
        
        // 检查data结构
        if (!response.data) {
          console.error('响应数据为空')
          message.error('登录数据异常')
          return false
        }
        
        const { token: newToken, userInfo: newUserInfo } = response.data
        console.log('解构出的token:', newToken)
        console.log('解构出的userInfo:', newUserInfo)
        
        if (!newToken) {
          console.error('未找到token')
          message.error('登录响应缺少token')
          return false
        }
        
        // 保存token和用户信息
        token.value = newToken
        userInfo.value = newUserInfo
        isLoggedIn.value = true
        
        // 持久化存储
        localStorage.setItem('admin_token', newToken)
        localStorage.setItem('admin_user_info', JSON.stringify(newUserInfo))
        
        console.log('状态更新完成，isLoggedIn:', isLoggedIn.value)
        
        // 显示成功消息
        message.success('登录成功')
        
        return true
      } else {
        console.log('登录失败', 'code:', response.code)
        message.error(response.message || '登录失败')
        return false
      }
    } catch (error) {
      console.error('登录异常:', error)
      message.error('登录失败，请检查网络连接')
      return false
    }
  }

  /**
   * 退出登录
   */
  const logout = async () => {
    try {
      // 调用后端退出接口
      await authApi.logout()
    } catch (error) {
      console.error('退出登录接口调用失败:', error)
    } finally {
      // 清除本地状态
      token.value = ''
      userInfo.value = null
      isLoggedIn.value = false
      
      // 清除持久化存储
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user_info')
      
      message.success('退出登录成功')
    }
  }

  /**
   * 获取用户信息
   */
  const getUserInfo = async () => {
    try {
      const response = await authApi.getProfile()
      if (response.code === 200) {
        userInfo.value = response.data
        localStorage.setItem('admin_user_info', JSON.stringify(response.data))
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      // 如果获取失败，可能token已过期，执行退出
      logout()
    }
  }

  /**
   * 初始化认证状态
   */
  const initAuth = () => {
    const savedUserInfo = localStorage.getItem('admin_user_info')
    if (savedUserInfo && token.value) {
      try {
        userInfo.value = JSON.parse(savedUserInfo)
        isLoggedIn.value = true
      } catch (error) {
        console.error('解析用户信息失败:', error)
        logout()
      }
    }
  }

  return {
    // 状态
    token,
    userInfo,
    isLoggedIn,
    
    // 方法
    login,
    logout,
    getUserInfo,
    initAuth
  }
})
