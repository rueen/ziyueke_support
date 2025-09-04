/**
 * 格式化工具函数
 */

/**
 * 格式化日期时间
 * @param {string|Date} dateTime - 日期时间
 * @param {string} format - 格式化模式
 * @returns {string} 格式化后的日期时间
 */
export const formatDateTime = (dateTime, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!dateTime) return '-'
  
  const date = new Date(dateTime)
  if (isNaN(date.getTime())) return '-'
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 格式化日期
 * @param {string|Date} date - 日期
 * @returns {string} 格式化后的日期
 */
export const formatDate = (date) => {
  return formatDateTime(date, 'YYYY-MM-DD')
}

/**
 * 格式化时间
 * @param {string|Date} time - 时间
 * @returns {string} 格式化后的时间
 */
export const formatTime = (time) => {
  return formatDateTime(time, 'HH:mm:ss')
}

/**
 * 格式化手机号（脱敏）
 * @param {string} phone - 手机号
 * @returns {string} 脱敏后的手机号
 */
export const formatPhone = (phone) => {
  if (!phone) return '-'
  if (phone.length !== 11) return phone
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的文件大小
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 格式化数字（千分位）
 * @param {number} num - 数字
 * @returns {string} 格式化后的数字
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '-'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
