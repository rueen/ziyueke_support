/**
 * 路由配置
 */
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { message } from 'ant-design-vue'

// 布局组件
import MainLayout from '@/layouts/MainLayout.vue'
import LoginLayout from '@/layouts/LoginLayout.vue'

// 页面组件
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import UserList from '@/views/user/UserList.vue'
import UserDetail from '@/views/user/UserDetail.vue'
import CourseList from '@/views/course/CourseList.vue'
import CourseDetail from '@/views/course/CourseDetail.vue'

const routes = [
  {
    path: '/login',
    component: LoginLayout,
    children: [
      {
        path: '',
        name: 'Login',
        component: Login,
        meta: {
          title: '登录',
          requiresAuth: false
        }
      }
    ]
  },
  {
    path: '/',
    component: MainLayout,
    redirect: '/dashboard',
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
          title: '控制台',
          icon: 'dashboard'
        }
      },
      {
        path: 'users',
        name: 'UserManagement',
        meta: {
          title: '用户管理',
          icon: 'user'
        },
        children: [
          {
            path: '',
            name: 'UserList',
            component: UserList,
            meta: {
              title: '用户列表'
            }
          },
          {
            path: ':id',
            name: 'UserDetail',
            component: UserDetail,
            meta: {
              title: '用户详情',
              hidden: true
            }
          }
        ]
      },
      {
        path: 'courses',
        name: 'CourseManagement',
        meta: {
          title: '课程管理',
          icon: 'book'
        },
        children: [
          {
            path: '',
            name: 'CourseList',
            component: CourseList,
            meta: {
              title: '课程列表'
            }
          },
          {
            path: ':id',
            name: 'CourseDetail',
            component: CourseDetail,
            meta: {
              title: '课程详情',
              hidden: true
            }
          }
        ]
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  console.log('路由守卫 - 前往:', to.path)
  console.log('路由守卫 - 认证状态:', authStore.isLoggedIn)
  console.log('路由守卫 - Token:', !!authStore.token)
  
  // 初始化认证状态
  if (!authStore.userInfo && authStore.token) {
    authStore.initAuth()
  }
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 自由约课管理端`
  }
  
  // 检查是否需要认证
  if (to.meta.requiresAuth !== false) {
    if (!authStore.isLoggedIn || !authStore.token) {
      console.log('路由守卫 - 需要登录，重定向到登录页')
      message.warning('请先登录')
      next('/login')
      return
    }
  }
  
  // 如果已登录访问登录页，重定向到首页
  if (to.path === '/login' && authStore.isLoggedIn && authStore.token) {
    console.log('路由守卫 - 已登录用户访问登录页，重定向到控制台')
    next('/dashboard')
    return
  }
  
  console.log('路由守卫 - 通过，继续导航')
  next()
})

// 全局后置钩子
router.afterEach((to) => {
  // 页面加载完成后的处理
  console.log('路由跳转到:', to.path)
})

export default router
