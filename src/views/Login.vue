<template>
  <div class="login-container">
    <div class="login-form">
      <div class="login-title">自由约课</div>
      <div class="login-subtitle">系统登录</div>
      
      <a-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        @finish="handleSubmit"
        @finish-failed="handleSubmitFailed"
      >
        <a-form-item name="username">
          <a-input
            v-model:value="formData.username"
            placeholder="请输入用户名"
            size="large"
            :prefix="h(UserOutlined)"
          />
        </a-form-item>
        
        <a-form-item name="password">
          <a-input-password
            v-model:value="formData.password"
            placeholder="请输入密码"
            size="large"
            :prefix="h(LockOutlined)"
          />
        </a-form-item>
        
        <a-form-item name="remember" class="remember-checkbox">
          <a-checkbox v-model:checked="formData.remember">
            记住密码
          </a-checkbox>
        </a-form-item>
        
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
            class="login-button"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup>
/**
 * 登录页面
 */
import { ref, reactive, h, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// 表单引用
const formRef = ref()

// 加载状态
const loading = ref(false)

// 表单数据
const formData = reactive({
  username: '',
  password: '',
  remember: false
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少 6 个字符', trigger: 'blur' }
  ]
}

/**
 * 处理表单提交
 * @param {Object} values - 表单值
 */
const handleSubmit = async (values) => {
  loading.value = true
  
  try {
    console.log('开始登录...')
    const success = await authStore.login({
      username: values.username,
      password: values.password
    })
    
    console.log('登录结果:', success)
    console.log('认证状态:', authStore.isLoggedIn)
    
    if (success) {
      // 记住密码
      if (values.remember) {
        localStorage.setItem('remembered_username', values.username)
        localStorage.setItem('remembered_password', values.password)
      } else {
        localStorage.removeItem('remembered_username')
        localStorage.removeItem('remembered_password')
      }
      
      console.log('准备跳转到控制台...')
      // 立即跳转到首页
      await router.push('/dashboard')
      console.log('跳转完成')
    } else {
      console.log('登录失败')
    }
  } catch (error) {
    console.error('登录异常:', error)
    message.error('登录失败，请检查用户名和密码')
  } finally {
    loading.value = false
  }
}

/**
 * 处理表单提交失败
 * @param {Object} errorInfo - 错误信息
 */
const handleSubmitFailed = (errorInfo) => {
  console.log('表单验证失败:', errorInfo)
  message.error('请检查输入信息')
}

/**
 * 初始化表单
 */
const initForm = () => {
  // 设置默认用户名
  formData.username = 'admin'
  
  // 如果记住了密码，自动填充
  const rememberedUsername = localStorage.getItem('remembered_username')
  const rememberedPassword = localStorage.getItem('remembered_password')
  
  if (rememberedUsername && rememberedPassword) {
    formData.username = rememberedUsername
    formData.password = rememberedPassword
    formData.remember = true
  }
}

// 组件挂载时初始化
onMounted(() => {
  initForm()
})
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
  opacity: 0.3;
}

.login-form {
  width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
}

.login-title {
  text-align: center;
  margin-bottom: 8px;
  font-size: 32px;
  font-weight: 700;
  color: #262626;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-subtitle {
  text-align: center;
  margin-bottom: 32px;
  color: #8c8c8c;
  font-size: 16px;
}

:deep(.ant-form-item) {
  margin-bottom: 20px;
}

:deep(.ant-input-affix-wrapper) {
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  transition: all 0.3s;
}

:deep(.ant-input-affix-wrapper:focus),
:deep(.ant-input-affix-wrapper-focused) {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.login-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  font-weight: 600;
  transition: all 0.3s;
}

.login-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.remember-checkbox {
  margin-bottom: 24px;
}

:deep(.ant-checkbox-wrapper) {
  color: #595959;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-form {
    width: 90%;
    margin: 0 20px;
    padding: 32px 24px;
  }
  
  .login-title {
    font-size: 28px;
  }
}
</style>
