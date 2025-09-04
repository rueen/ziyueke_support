/**
 * 模拟 API 数据 - 仅用于开发环境测试
 */

// 模拟登录响应
export const mockLoginResponse = {
  success: true,
  code: 200,
  message: "登录成功",
  data: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_token",
    expiresIn: 86400,
    userInfo: {
      id: 1,
      username: "admin",
      role: "admin"
    }
  },
  timestamp: Date.now()
}

// 检查是否在开发环境
export const isDevelopment = import.meta.env.MODE === 'development'

// 延迟函数，模拟网络请求
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
