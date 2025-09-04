/*
 * @Author: diaochan
 * @Date: 2025-09-04 17:15:40
 * @LastEditors: diaochan
 * @LastEditTime: 2025-09-04 17:49:16
 * @Description: 
 */
/**
 * 常量定义
 */

// 用户状态
export const USER_STATUS = {
  DISABLED: 0,
  NORMAL: 1
}

export const USER_STATUS_TEXT = {
  [USER_STATUS.DISABLED]: '禁用',
  [USER_STATUS.NORMAL]: '正常'
}

export const USER_STATUS_OPTIONS = [
  { label: '全部', value: null },
  { label: '正常', value: USER_STATUS.NORMAL },
  { label: '禁用', value: USER_STATUS.DISABLED }
]

// 课程状态
export const COURSE_STATUS = {
  PENDING: 1,      // 待确认
  CONFIRMED: 2,    // 已确认
  COMPLETED: 3,    // 已完成
  CANCELLED: 4,    // 已取消
  TIMEOUT: 5       // 超时取消
}

export const COURSE_STATUS_TEXT = {
  [COURSE_STATUS.PENDING]: '待确认',
  [COURSE_STATUS.CONFIRMED]: '已确认',
  [COURSE_STATUS.COMPLETED]: '已完成',
  [COURSE_STATUS.CANCELLED]: '已取消',
  [COURSE_STATUS.TIMEOUT]: '超时取消'
}

export const COURSE_STATUS_OPTIONS = [
  { label: '全部', value: null },
  { label: '待确认', value: COURSE_STATUS.PENDING },
  { label: '已确认', value: COURSE_STATUS.CONFIRMED },
  { label: '已完成', value: COURSE_STATUS.COMPLETED },
  { label: '已取消', value: COURSE_STATUS.CANCELLED },
  { label: '超时取消', value: COURSE_STATUS.TIMEOUT }
]

// 课程状态颜色
export const COURSE_STATUS_COLORS = {
  [COURSE_STATUS.PENDING]: 'orange',
  [COURSE_STATUS.CONFIRMED]: 'blue',
  [COURSE_STATUS.COMPLETED]: 'green',
  [COURSE_STATUS.CANCELLED]: 'red',
  [COURSE_STATUS.TIMEOUT]: 'gray'
}

// 性别
export const GENDER = {
  UNKNOWN: 0,
  MALE: 1,
  FEMALE: 2
}

export const GENDER_TEXT = {
  [GENDER.UNKNOWN]: '未知',
  [GENDER.MALE]: '男',
  [GENDER.FEMALE]: '女'
}

// 分页默认配置
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: ['10', '20', '50', '100'],
  SHOW_SIZE_CHANGER: true,
  SHOW_QUICK_JUMPER: true,
  SHOW_TOTAL: (total, range) => `共 ${total} 条记录，显示第 ${range[0]}-${range[1]} 条`
}
