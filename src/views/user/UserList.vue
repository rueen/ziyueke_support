<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">用户管理</h1>
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
            placeholder="请输入用户昵称或手机号"
            style="width: 200px"
            allow-clear
          />
        </a-form-item>
        
        <a-form-item label="用户状态">
          <a-select
            v-model:value="searchForm.status"
            placeholder="请选择状态"
            style="width: 120px"
            allow-clear
          >
            <a-select-option
              v-for="option in USER_STATUS_OPTIONS"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="注册时间">
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
        :data-source="userList"
        :pagination="paginationConfig"
        :loading="loading"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <!-- 头像 -->
          <template v-if="column.key === 'avatar'">
            <a-avatar :src="record.avatar_url" :size="40">
              <template #icon>
                <user-outlined />
              </template>
            </a-avatar>
          </template>
          
          <!-- 用户信息 -->
          <template v-else-if="column.key === 'userInfo'">
            <div>
              <div class="user-name">{{ record.nickname }}</div>
              <div class="user-phone">{{ formatPhone(record.phone) }}</div>
            </div>
          </template>
          
          <!-- 性别 -->
          <template v-else-if="column.key === 'gender'">
            {{ record.gender || '-' }}
          </template>
          
          <!-- 注册时间 -->
          <template v-else-if="column.key === 'register_time'">
            {{ formatDateTime(record.register_time) }}
          </template>
          
          <!-- 状态 -->
          <template v-else-if="column.key === 'status'">
            <a-tag :color="record.status === 1 ? 'green' : 'red'">
              {{ USER_STATUS_TEXT[record.status] }}
            </a-tag>
          </template>
          
          <!-- 操作 -->
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button
                type="link"
                size="small"
                @click="handleViewDetail(record)"
              >
                编辑
              </a-button>
              <a-button
                type="link"
                size="small"
                :danger="record.status === 1"
                @click="handleToggleStatus(record)"
              >
                {{ record.status === 1 ? '禁用' : '启用' }}
              </a-button>
              <a-popconfirm
                title="确定要删除这个用户吗？"
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
 * 用户列表页面
 */
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { SearchOutlined, ReloadOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'
import { formatDateTime, formatPhone } from '@/utils/format'
import { USER_STATUS_OPTIONS, USER_STATUS_TEXT, PAGINATION_CONFIG } from '@/utils/constants'

const router = useRouter()
const userStore = useUserStore()

// 响应式数据
const searchForm = reactive({
  keyword: '',
  status: null,
  dateRange: null
})

const pagination = reactive({
  current: PAGINATION_CONFIG.DEFAULT_PAGE,
  limit: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
  total: 0
})

// 计算属性
const userList = computed(() => userStore.userList)
const loading = computed(() => userStore.loading)
const total = computed(() => userStore.total)

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
    title: '头像',
    key: 'avatar',
    width: 80,
    align: 'center'
  },
  {
    title: '用户信息',
    key: 'userInfo',
    width: 200
  },
  {
    title: '性别',
    key: 'gender',
    width: 80,
    align: 'center'
  },
  {
    title: '注册时间',
    key: 'register_time',
    width: 180,
    sorter: true
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    align: 'center'
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    align: 'center'
  }
]

/**
 * 获取用户列表
 */
const getUserList = async () => {
  const params = {
    page: pagination.current,
    limit: pagination.limit,
    keyword: searchForm.keyword || undefined,
    status: searchForm.status,
    start_date: searchForm.dateRange?.[0]?.format('YYYY-MM-DD'),
    end_date: searchForm.dateRange?.[1]?.format('YYYY-MM-DD')
  }
  
  await userStore.getUserList(params)
  pagination.total = total.value
}

/**
 * 处理搜索
 */
const handleSearch = () => {
  pagination.current = 1
  getUserList()
}

/**
 * 处理重置
 */
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.status = null
  searchForm.dateRange = null
  pagination.current = 1
  getUserList()
}

/**
 * 处理表格变化
 * @param {Object} paginationInfo - 分页信息
 * @param {Object} filters - 过滤器
 * @param {Object} sorter - 排序
 */
const handleTableChange = (paginationInfo, filters, sorter) => {
  pagination.current = paginationInfo.current
  pagination.limit = paginationInfo.limit
  getUserList()
}

/**
 * 查看用户详情
 * @param {Object} record - 用户记录
 */
const handleViewDetail = (record) => {
  router.push(`/users/${record.id}`)
}

/**
 * 切换用户状态
 * @param {Object} record - 用户记录
 */
const handleToggleStatus = async (record) => {
  const newStatus = record.status === 1 ? 0 : 1
  const success = await userStore.updateUserStatus(record.id, newStatus)
  if (success) {
    getUserList()
  }
}

/**
 * 删除用户
 * @param {Object} record - 用户记录
 */
const handleDelete = async (record) => {
  const success = await userStore.deleteUser(record.id)
  if (success) {
    getUserList()
  }
}

// 组件挂载时获取数据
onMounted(() => {
  getUserList()
})
</script>

<style scoped>
.user-name {
  font-weight: 600;
  color: #262626;
  margin-bottom: 4px;
}

.user-phone {
  font-size: 12px;
  color: #8c8c8c;
}
</style>
