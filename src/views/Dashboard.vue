<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">控制台</h1>
    </div>
    
    <!-- 统计卡片 -->
    <a-row :gutter="[16, 16]" class="mb-24">
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card>
          <div class="stat-card">
            <div class="stat-number primary">{{ stats?.total || 0 }}</div>
            <div class="stat-label">总课程数</div>
          </div>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card>
          <div class="stat-card">
            <div class="stat-number warning">{{ stats?.by_status?.[1]?.count || 0 }}</div>
            <div class="stat-label">待确认</div>
          </div>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card>
          <div class="stat-card">
            <div class="stat-number success">{{ stats?.by_status?.[2]?.count || 0 }}</div>
            <div class="stat-label">已确认</div>
          </div>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card>
          <div class="stat-card">
            <div class="stat-number">{{ stats?.by_status?.[3]?.count || 0 }}</div>
            <div class="stat-label">已完成</div>
          </div>
        </a-card>
      </a-col>
    </a-row>
    
    <!-- 欢迎信息 -->
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :lg="16">
        <a-card title="欢迎使用自由约课管理端" class="info-card">
          <div class="welcome-content">
            <p>欢迎您，{{ userInfo?.username || 'admin' }}！</p>
            <p>这是自由约课微信小程序的管理后台，您可以在这里管理用户和课程信息。</p>
            
            <div class="feature-list">
              <h4>主要功能：</h4>
              <ul>
                <li>用户管理：查看、搜索、管理用户信息和状态</li>
                <li>课程管理：查看、搜索、管理课程预约信息</li>
                <li>数据统计：实时查看系统运营数据</li>
              </ul>
            </div>
            
            <div class="quick-actions">
              <h4>快速操作：</h4>
              <a-space>
                <a-button type="primary" @click="$router.push('/users')">
                  <user-outlined />
                  用户管理
                </a-button>
                <a-button @click="$router.push('/courses')">
                  <book-outlined />
                  课程管理
                </a-button>
              </a-space>
            </div>
          </div>
        </a-card>
      </a-col>
      
      <a-col :xs="24" :lg="8">
        <a-card title="系统信息" class="info-card">
          <div class="system-info">
            <div class="info-item">
              <span class="label">系统版本：</span>
              <span class="value">v1.0.0</span>
            </div>
            <div class="info-item">
              <span class="label">最后登录：</span>
              <span class="value">{{ formatDateTime(userInfo?.last_login_time) }}</span>
            </div>
            <div class="info-item">
              <span class="label">在线状态：</span>
              <a-tag color="green">正常</a-tag>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
/**
 * 控制台页面
 */
import { ref, computed, onMounted } from 'vue'
import { UserOutlined, BookOutlined } from '@ant-design/icons-vue'
import { useAuthStore } from '@/stores/auth'
import * as courseApi from '@/api/course'
import { formatDateTime } from '@/utils/format'

const authStore = useAuthStore()

// 响应式数据
const stats = ref(null)

// 计算属性
const userInfo = computed(() => authStore.userInfo)

/**
 * 获取统计数据
 */
const getStats = async () => {
  try {
    const response = await courseApi.getCourseStats()
    if (response.code === 200) {
      stats.value = response.data
    } else {
      console.error('获取统计数据失败:', response.message)
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 组件挂载时获取数据
onMounted(() => {
  // getStats()
})
</script>

<style scoped>
.welcome-content {
  line-height: 1.6;
}

.welcome-content p {
  margin-bottom: 16px;
  color: #595959;
}

.feature-list,
.quick-actions {
  margin-top: 24px;
}

.feature-list h4,
.quick-actions h4 {
  margin-bottom: 12px;
  color: #262626;
  font-weight: 600;
}

.feature-list ul {
  padding-left: 20px;
}

.feature-list li {
  margin-bottom: 8px;
  color: #595959;
}

.system-info .info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.system-info .info-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.system-info .label {
  color: #8c8c8c;
  font-weight: 500;
}

.system-info .value {
  color: #262626;
}
</style>
