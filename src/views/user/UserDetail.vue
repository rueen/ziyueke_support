<template>
  <div class="page-container">
    <div class="page-header">
      <div class="flex-between">
        <a-button @click="$router.go(-1)">
          <arrow-left-outlined />
          返回
        </a-button>
        <h1 class="page-title">用户详情</h1>
      </div>
    </div>
    
    <div v-if="loading" class="text-center" style="padding: 40px;">
      <a-spin size="large" />
    </div>
    
    <div v-else-if="userDetail">
      <a-row :gutter="[16, 16]">
        <!-- 基本信息 -->
        <a-col :xs="24" :lg="12">
          <a-card title="基本信息" class="info-card">
            <div class="user-detail-info">
              <div class="info-item">
                <span class="label">用户ID：</span>
                <span class="value">{{ userDetail.id }}</span>
              </div>
              
              <div class="info-item">
                <span class="label">昵称：</span>
                <span class="value">{{ userDetail.nickname || '-' }}</span>
              </div>
              
              <div class="info-item">
                <span class="label">手机号：</span>
                <span class="value">{{ userDetail.phone || '-' }}</span>
              </div>
              
              <div class="info-item">
                <span class="label">性别：</span>
                <span class="value">{{ userDetail.gender || '-' }}</span>
              </div>
              
              <div class="info-item">
                <span class="label">个人介绍：</span>
                <span class="value">{{ userDetail.intro || '-' }}</span>
              </div>
              
              <div class="info-item">
                <span class="label">注册时间：</span>
                <span class="value">{{ formatDateTime(userDetail.register_time) }}</span>
              </div>
              
              <div class="info-item">
                <span class="label">最后登录：</span>
                <span class="value">{{ formatDateTime(userDetail.last_login_time) }}</span>
              </div>
              
              <div class="info-item">
                <span class="label">状态：</span>
                <a-tag :color="userDetail.status === 1 ? 'green' : 'red'">
                  {{ USER_STATUS_TEXT[userDetail.status] }}
                </a-tag>
              </div>
            </div>
            
            <div class="user-actions" style="margin-top: 24px;">
              <a-space>
                <a-button
                  type="primary"
                  :danger="userDetail.status === 1"
                  @click="handleToggleStatus"
                >
                  {{ userDetail.status === 1 ? '禁用用户' : '启用用户' }}
                </a-button>
                
                <a-popconfirm
                  title="确定要删除这个用户吗？删除后不可恢复。"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="handleDelete"
                >
                  <a-button danger>删除用户</a-button>
                </a-popconfirm>
              </a-space>
            </div>
          </a-card>
        </a-col>
        
        <!-- 头像信息 -->
        <a-col :xs="24" :lg="12">
          <a-card title="头像信息" class="info-card">
            <div class="avatar-section">
              <div class="avatar-container">
                <a-avatar
                  :src="userDetail.avatar_url"
                  :size="120"
                  class="user-avatar"
                >
                  <template #icon>
                    <user-outlined />
                  </template>
                </a-avatar>
              </div>
              
              <div class="avatar-info">
                <div class="info-item">
                  <span class="label">头像URL：</span>
                  <span class="value">
                    <a
                      v-if="userDetail.avatar_url"
                      :href="userDetail.avatar_url"
                      target="_blank"
                      class="avatar-url"
                    >
                      {{ userDetail.avatar_url }}
                    </a>
                    <span v-else>-</span>
                  </span>
                </div>
              </div>
            </div>
          </a-card>
        </a-col>
        
        <!-- 微信信息 -->
        <a-col :xs="24">
          <a-card title="微信信息" class="info-card">
            <div class="wechat-info">
              <a-row :gutter="[16, 16]">
                <a-col :xs="24" :md="12">
                  <div class="info-item">
                    <span class="label">OpenID：</span>
                    <span class="value code">{{ userDetail.openid || '-' }}</span>
                  </div>
                </a-col>
                
                <a-col :xs="24" :md="12">
                  <div class="info-item">
                    <span class="label">UnionID：</span>
                    <span class="value code">{{ userDetail.unionid || '-' }}</span>
                  </div>
                </a-col>
              </a-row>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
    
    <div v-else class="text-center" style="padding: 40px;">
      <a-empty description="用户不存在" />
    </div>
  </div>
</template>

<script setup>
/**
 * 用户详情页面
 */
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons-vue'
import * as userApi from '@/api/user'
import { formatDateTime } from '@/utils/format'
import { USER_STATUS_TEXT } from '@/utils/constants'

const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(false)
const userDetail = ref(null)

/**
 * 获取用户详情
 */
const getUserDetail = async () => {
  const userId = route.params.id
  if (!userId) {
    message.error('用户ID无效')
    router.go(-1)
    return
  }
  
  loading.value = true
  try {
    const response = await userApi.getUserDetail(userId)
    if (response.code === 200) {
      userDetail.value = response.data
    } else {
      message.error(response.message || '获取用户详情失败')
    }
  } catch (error) {
    console.error('获取用户详情失败:', error)
    message.error('获取用户详情失败')
  } finally {
    loading.value = false
  }
}

/**
 * 切换用户状态
 */
const handleToggleStatus = () => {
  const user = userDetail.value
  const newStatus = user.status === 1 ? 0 : 1
  const actionText = newStatus === 1 ? '启用' : '禁用'
  
  Modal.confirm({
    title: `确认${actionText}用户`,
    content: `确定要${actionText}用户 "${user.nickname}" 吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        const response = await userApi.updateUserStatus(user.id, newStatus)
        if (response.code === 200) {
          message.success(`${actionText}用户成功`)
          userDetail.value.status = newStatus
        } else {
          message.error(response.message || `${actionText}用户失败`)
        }
      } catch (error) {
        console.error(`${actionText}用户失败:`, error)
        message.error(`${actionText}用户失败`)
      }
    }
  })
}

/**
 * 删除用户
 */
const handleDelete = async () => {
  try {
    const response = await userApi.deleteUser(userDetail.value.id)
    if (response.code === 200) {
      message.success('删除用户成功')
      router.go(-1)
    } else {
      message.error(response.message || '删除用户失败')
    }
  } catch (error) {
    console.error('删除用户失败:', error)
    message.error('删除用户失败')
  }
}

// 组件挂载时获取数据
onMounted(() => {
  getUserDetail()
})
</script>

<style scoped>
.user-detail-info .info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.user-detail-info .info-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.user-detail-info .label {
  min-width: 100px;
  color: #8c8c8c;
  font-weight: 500;
}

.user-detail-info .value {
  flex: 1;
  color: #262626;
  word-break: break-all;
}

.avatar-section {
  text-align: center;
}

.avatar-container {
  margin-bottom: 24px;
}

.user-avatar {
  border: 3px solid #f0f0f0;
}

.avatar-info {
  text-align: left;
}

.avatar-url {
  color: #1890ff;
  text-decoration: none;
  word-break: break-all;
}

.avatar-url:hover {
  text-decoration: underline;
}

.wechat-info .info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
}

.wechat-info .label {
  min-width: 80px;
  color: #8c8c8c;
  font-weight: 500;
}

.wechat-info .value {
  flex: 1;
  color: #262626;
}

.wechat-info .value.code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  background-color: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
}
</style>
