/**
 * 应用程序入口文件
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import router from './router'
import App from './App.vue'

// 样式文件
import 'ant-design-vue/dist/reset.css'
import './styles/index.less'

// 创建应用实例
const app = createApp(App)

// 使用插件
app.use(createPinia())
app.use(router)
app.use(Antd)

// 挂载应用
app.mount('#app')
