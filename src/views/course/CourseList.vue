<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">课程管理</h1>
    </div>
    
    <!-- 搜索表单 -->
    <div class="search-form">
      <a-form
        :model="searchForm"
        layout="inline"
        @finish="handleSearch"
      >
        <a-form-item label="搜索关键词">
          <a-input
            v-model:value="searchForm.keyword"
            placeholder="请输入学员昵称或手机号"
            style="width: 200px"
            allow-clear
          />
        </a-form-item>
        
        <a-form-item label="课程状态">
          <a-select
            v-model:value="searchForm.status"
            placeholder="请选择状态"
            style="width: 120px"
            allow-clear
          >
            <a-select-option
              v-for="option in COURSE_STATUS_OPTIONS"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="课程时间">
          <a-range-picker
            v-model:value="searchForm.dateRange"
            format="YYYY-MM-DD"
            style="width: 240px"
          />
        </a-form-item>
        
        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit" :loading="loading">
              <search-outlined />
              搜索
            </a-button>
            <a-button @click="handleReset">
              <reload-outlined />
              重置
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>
    
    <!-- 表格 -->
    <div class="table-container">
      <a-table
        :columns="columns"
        :data-source="courseList"
        :pagination="paginationConfig"
        :loading="loading"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <!-- 学员信息 -->
          <template v-if="column.key === 'student'">
            <div class="user-info">
              <a-avatar :src="record.student?.avatar_url" :size="32">
                <template #icon>
                  <user-outlined />
                </template>
              </a-avatar>
              <div class="user-details">
                <div class="user-name">{{ record.student?.nickname }}</div>
                <div class="user-phone">{{ formatPhone(record.student?.phone) }}</div>
              </div>
            </div>
          </template>
          
          <!-- 教练信息 -->
          <template v-else-if="column.key === 'coach'">
            <div class="user-info">
              <a-avatar :src="record.coach?.avatar_url" :size="32">
                <template #icon>
                  <user-outlined />
                </template>
              </a-avatar>
              <div class="user-details">
                <div class="user-name">{{ record.coach?.nickname }}</div>
                <div class="user-phone">{{ formatPhone(record.coach?.phone) }}</div>
              </div>
            </div>
          </template>
          
          <!-- 课程时间 -->
          <template v-else-if="column.key === 'courseTime'">
            <div>
              <div class="course-date">{{ record.course_date }}</div>
              <div class="course-time">{{ record.start_time }} - {{ record.end_time }}</div>
            </div>
          </template>
          
          <!-- 地址 -->
          <template v-else-if="column.key === 'address'">
            <div>
              <div class="address-name">{{ record.address?.name }}</div>
              <div class="address-detail">{{ record.address?.detailed_address }}</div>
            </div>
          </template>
          
          <!-- 状态 -->
          <template v-else-if="column.key === 'status'">
            <a-tag :color="COURSE_STATUS_COLORS[record.booking_status]">
              {{ COURSE_STATUS_TEXT[record.booking_status] }}
            </a-tag>
          </template>
          
          <!-- 备注 -->
          <template v-else-if="column.key === 'remark'">
            <div>
              <div v-if="record.student_remark" class="remark-item">
                <span class="remark-label">学员：</span>
                <span class="remark-content">{{ record.student_remark }}</span>
              </div>
              <div v-if="record.coach_remark" class="remark-item">
                <span class="remark-label">教练：</span>
                <span class="remark-content">{{ record.coach_remark }}</span>
              </div>
              <span v-if="!record.student_remark && !record.coach_remark">-</span>
            </div>
          </template>
          
          <!-- 操作 -->
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button
                type="link"
                size="small"
                @click="handleViewDetail(record)"
              >
                详情
              </a-button>
              <a-popconfirm
                title="确定要删除这个课程吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDelete(record)"
              >
                <a-button
                  type="link"
                  size="small"
                  danger
                >
                  删除
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup>
/**
 * 课程列表页面
 */
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { SearchOutlined, ReloadOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useCourseStore } from '@/stores/course'
import { formatPhone } from '@/utils/format'
import {
  COURSE_STATUS_OPTIONS,
  COURSE_STATUS_TEXT,
  COURSE_STATUS_COLORS,
  PAGINATION_CONFIG
} from '@/utils/constants'

const router = useRouter()
const courseStore = useCourseStore()

// 响应式数据
const searchForm = reactive({
  keyword: '',
  status: null,
  dateRange: null
})

const pagination = reactive({
  current: PAGINATION_CONFIG.DEFAULT_PAGE,
  pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
  total: 0
})

// 计算属性
const courseList = computed(() => courseStore.courseList)
const loading = computed(() => courseStore.loading)
const total = computed(() => courseStore.total)

// 分页配置
const paginationConfig = computed(() => ({
  ...pagination,
  total: total.value,
  showSizeChanger: PAGINATION_CONFIG.SHOW_SIZE_CHANGER,
  showQuickJumper: PAGINATION_CONFIG.SHOW_QUICK_JUMPER,
  pageSizeOptions: PAGINATION_CONFIG.PAGE_SIZE_OPTIONS,
  showTotal: PAGINATION_CONFIG.SHOW_TOTAL
}))

// 表格列配置
const columns = [
  {
    title: '学员',
    key: 'student',
    width: 160
  },
  {
    title: '教练',
    key: 'coach',
    width: 160
  },
  {
    title: '课程时间',
    key: 'courseTime',
    width: 180,
    sorter: true
  },
  {
    title: '地址',
    key: 'address',
    width: 200
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    align: 'center'
  },
  {
    title: '备注',
    key: 'remark',
    width: 200
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    align: 'center'
  }
]

/**
 * 获取课程列表
 */
const getCourseList = async () => {
  const params = {
    page: pagination.current,
    limit: pagination.pageSize,
    keyword: searchForm.keyword || undefined,
    status: searchForm.status,
    start_date: searchForm.dateRange?.[0]?.format('YYYY-MM-DD'),
    end_date: searchForm.dateRange?.[1]?.format('YYYY-MM-DD')
  }
  
  await courseStore.getCourseList(params)
  pagination.total = total.value
}

/**
 * 处理搜索
 */
const handleSearch = () => {
  pagination.current = 1
  getCourseList()
}

/**
 * 处理重置
 */
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.status = null
  searchForm.dateRange = null
  pagination.current = 1
  getCourseList()
}

/**
 * 处理表格变化
 * @param {Object} paginationInfo - 分页信息
 * @param {Object} filters - 过滤器
 * @param {Object} sorter - 排序
 */
const handleTableChange = (paginationInfo, filters, sorter) => {
  pagination.current = paginationInfo.current
  pagination.pageSize = paginationInfo.pageSize
  getCourseList()
}

/**
 * 查看课程详情
 * @param {Object} record - 课程记录
 */
const handleViewDetail = (record) => {
  router.push(`/courses/${record.id}`)
}

/**
 * 删除课程
 * @param {Object} record - 课程记录
 */
const handleDelete = async (record) => {
  const success = await courseStore.deleteCourse(record.id)
  if (success) {
    getCourseList()
  }
}

// 组件挂载时获取数据
onMounted(() => {
  getCourseList()
})
</script>

<style scoped>
.user-info {
  display: flex;
  align-items: center;
}

.user-details {
  margin-left: 8px;
}

.user-name {
  font-weight: 600;
  color: #262626;
  font-size: 13px;
  line-height: 1.2;
}

.user-phone {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 2px;
}

.course-date {
  font-weight: 600;
  color: #262626;
  font-size: 13px;
  line-height: 1.2;
}

.course-time {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 2px;
}

.address-name {
  font-weight: 600;
  color: #262626;
  font-size: 13px;
  line-height: 1.2;
}

.address-detail {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 2px;
}

.remark-item {
  margin-bottom: 4px;
  font-size: 12px;
}

.remark-label {
  color: #8c8c8c;
  font-weight: 500;
}

.remark-content {
  color: #262626;
}
</style>
