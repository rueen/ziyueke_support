/**
 * 验证工具函数
 */

/**
 * 验证手机号
 * @param {string} phone - 手机号
 * @returns {boolean} 是否有效
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

/**
 * 验证邮箱
 * @param {string} email - 邮箱
 * @returns {boolean} 是否有效
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证身份证号
 * @param {string} idCard - 身份证号
 * @returns {boolean} 是否有效
 */
export const validateIdCard = (idCard) => {
  const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return idCardRegex.test(idCard)
}

/**
 * 验证用户名
 * @param {string} username - 用户名
 * @returns {boolean} 是否有效
 */
export const validateUsername = (username) => {
  // 4-20位，字母数字下划线
  const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/
  return usernameRegex.test(username)
}

/**
 * 验证密码强度
 * @param {string} password - 密码
 * @returns {Object} 验证结果
 */
export const validatePassword = (password) => {
  const result = {
    valid: false,
    strength: 0,
    message: []
  }
  
  if (!password) {
    result.message.push('密码不能为空')
    return result
  }
  
  if (password.length < 6) {
    result.message.push('密码长度至少6位')
  } else if (password.length >= 6) {
    result.strength += 1
  }
  
  if (/[a-z]/.test(password)) {
    result.strength += 1
  }
  
  if (/[A-Z]/.test(password)) {
    result.strength += 1
  }
  
  if (/\d/.test(password)) {
    result.strength += 1
  }
  
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    result.strength += 1
  }
  
  result.valid = result.strength >= 2 && password.length >= 6
  
  if (result.strength <= 2) {
    result.message.push('密码强度较弱')
  } else if (result.strength <= 3) {
    result.message.push('密码强度中等')
  } else {
    result.message.push('密码强度较强')
  }
  
  return result
}

/**
 * 验证URL
 * @param {string} url - URL
 * @returns {boolean} 是否有效
 */
export const validateUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
