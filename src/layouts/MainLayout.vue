<template>
  <a-layout class="main-layout">
    <!-- 侧边栏 -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      width="240"
      theme="dark"
    >
      <div class="logo">
        <span v-if="!collapsed">自由约课</span>
        <span v-else>约课</span>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
        mode="inline"
        theme="dark"
        :inline-collapsed="collapsed"
        @click="handleMenuClick"
      >
        <a-menu-item key="dashboard">
          <dashboard-outlined />
          <span>控制台</span>
        </a-menu-item>
        <a-menu-item key="users">
          <user-outlined />
          <span>用户管理</span>
        </a-menu-item>
        <a-menu-item key="courses">
          <book-outlined />
          <span>课程管理</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <!-- 头部 -->
      <a-layout-header>
        <div class="header-left">
          <menu-fold-outlined
            v-if="!collapsed"
            class="trigger"
            @click="toggleCollapsed"
          />
          <menu-unfold-outlined
            v-else
            class="trigger"
            @click="toggleCollapsed"
          />
        </div>
        
        <div class="header-right">
          <a-dropdown>
            <div class="user-info">
              <a-avatar :size="32">
                <template #icon>
                  <user-outlined />
                </template>
              </a-avatar>
              <span class="username">{{ userInfo?.username || 'admin' }}</span>
              <down-outlined class="ml-8" />
            </div>
            <template #overlay>
              <a-menu>
                <a-menu-item key="profile" @click="handleProfile">
                  <user-outlined />
                  个人信息
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" @click="handleLogout">
                  <logout-outlined />
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <!-- 内容区域 -->
      <a-layout-content>
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
/**
 * 主布局组件
 */
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Modal } from 'ant-design-vue'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  BookOutlined,
  DownOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 响应式数据
const collapsed = ref(false)
const selectedKeys = ref(['dashboard'])
const openKeys = ref([])

// 计算属性
const userInfo = computed(() => authStore.userInfo)

/**
 * 切换侧边栏折叠状态
 */
const toggleCollapsed = () => {
  collapsed.value = !collapsed.value
}

/**
 * 处理菜单点击
 * @param {Object} menuInfo - 菜单信息
 */
const handleMenuClick = ({ key }) => {
  switch (key) {
    case 'dashboard':
      router.push('/dashboard')
      break
    case 'users':
      router.push('/users')
      break
    case 'courses':
      router.push('/courses')
      break
  }
}

/**
 * 处理个人信息
 */
const handleProfile = () => {
  // TODO: 实现个人信息功能
  console.log('查看个人信息')
}

/**
 * 处理退出登录
 */
const handleLogout = () => {
  Modal.confirm({
    title: '确认退出',
    content: '确定要退出登录吗？',
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      await authStore.logout()
      router.push('/login')
    }
  })
}

/**
 * 根据当前路由设置选中的菜单项
 */
const setSelectedKeys = () => {
  const path = route.path
  if (path.startsWith('/users')) {
    selectedKeys.value = ['users']
  } else if (path.startsWith('/courses')) {
    selectedKeys.value = ['courses']
  } else if (path.startsWith('/dashboard')) {
    selectedKeys.value = ['dashboard']
  }
}

// 监听路由变化
watch(route, () => {
  setSelectedKeys()
}, { immediate: true })

// 组件挂载时初始化
onMounted(() => {
  // 初始化认证状态
  authStore.initAuth()
  
  // 获取用户信息
  if (authStore.isLoggedIn && authStore.token && !authStore.userInfo) {
    authStore.getUserInfo()
  }
})
</script>

<style scoped>
.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f5f5;
}

.username {
  margin-left: 8px;
  color: #262626;
}
</style>
