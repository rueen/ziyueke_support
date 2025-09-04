# 自由约课管理端

基于 Vue 3 + Ant Design Vue 的自由约课微信小程序管理后台。

## 🚀 功能特性

- **用户管理**: 查看、搜索、管理用户信息和状态
- **课程管理**: 查看、搜索、管理课程预约信息  
- **数据统计**: 实时查看系统运营数据
- **响应式设计**: 支持桌面端和移动端访问
- **现代化UI**: 基于 Ant Design Vue 4.x 设计

## 📋 技术栈

- **前端框架**: Vue 3.5.13
- **UI组件库**: Ant Design Vue 4.x
- **状态管理**: Pinia 3.0.1
- **路由管理**: Vue Router 4.5.0
- **HTTP客户端**: Axios 1.8.1
- **构建工具**: Vite 6.2.0
- **样式预处理**: Less 4.x
- **开发语言**: JavaScript

## 🛠️ 开发环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

## 📦 安装与运行

### 1. 克隆项目
```bash
git clone <repository-url>
cd ziyueke-admin
```

### 2. 安装依赖
```bash
npm install
```

### 3. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:8080 即可看到管理端界面。

### 4. 构建生产版本
```bash
npm run build
```

### 5. 预览生产版本
```bash
npm run preview
```

## 🔧 配置说明

### API 配置
项目默认后端 API 地址为 `http://localhost:3001/api/admin`，可在 `vite.config.js` 中修改代理配置：

```javascript
server: {
  port: 8080,
  proxy: {
    '/api': {
      target: 'http://your-backend-url',
      changeOrigin: true,
    },
  },
}
```

### 环境变量
可以创建 `.env.local` 文件来配置环境变量：

```env
VITE_API_BASE_URL=http://localhost:3001/api/admin
```


> ⚠️ **安全提示**: 生产环境中请及时修改默认密码！

## 📁 项目结构

```
src/
├── api/              # API 接口
│   ├── auth.js       # 认证相关接口
│   ├── user.js       # 用户管理接口
│   ├── course.js     # 课程管理接口
│   └── request.js    # HTTP 请求封装
├── components/       # 公共组件
├── layouts/          # 布局组件
│   ├── MainLayout.vue    # 主布局
│   └── LoginLayout.vue   # 登录布局
├── router/           # 路由配置
│   └── index.js
├── stores/           # 状态管理
│   ├── auth.js       # 认证状态
│   ├── user.js       # 用户状态
│   └── course.js     # 课程状态
├── styles/           # 样式文件
│   └── index.less    # 全局样式
├── utils/            # 工具函数
│   ├── constants.js  # 常量定义
│   ├── format.js     # 格式化工具
│   └── validate.js   # 验证工具
├── views/            # 页面组件
│   ├── user/         # 用户管理页面
│   ├── course/       # 课程管理页面
│   ├── Dashboard.vue # 控制台
│   └── Login.vue     # 登录页
├── App.vue           # 根组件
└── main.js           # 入口文件
```

## 🎯 主要功能

### 用户管理
- 用户列表查看与搜索
- 用户详情查看
- 用户状态管理（启用/禁用）
- 用户删除

### 课程管理  
- 课程列表查看与搜索
- 课程详情查看
- 课程删除
- 课程统计数据

### 系统功能
- 管理员登录/退出
- 路由权限控制
- 响应式布局
- 数据分页

## 🔌 API 接口

项目使用 RESTful API 与后端通信，主要接口包括：

- `POST /auth/login` - 管理员登录
- `POST /auth/logout` - 管理员退出
- `GET /auth/profile` - 获取管理员信息
- `GET /users` - 获取用户列表
- `GET /users/{id}` - 获取用户详情
- `PUT /users/{id}/status` - 修改用户状态
- `DELETE /users/{id}` - 删除用户
- `GET /courses` - 获取课程列表
- `GET /courses/{id}` - 获取课程详情
- `GET /courses/stats` - 获取课程统计
- `DELETE /courses/{id}` - 删除课程

详细的 API 文档请参考 `admin_api.md`。

## 🎨 界面预览

### 登录页面
- 现代化渐变背景设计
- 表单验证与记住密码功能
- 响应式布局

### 控制台
- 数据统计卡片展示
- 快速导航功能
- 系统信息展示

### 用户管理
- 用户列表表格
- 高级搜索功能
- 用户状态管理

### 课程管理
- 课程列表表格
- 课程状态展示
- 详细信息查看

## 🤝 开发规范

### 代码风格
- 使用 JSDoc 注释
- 组件名采用 PascalCase
- 文件名采用 PascalCase 或 kebab-case
- 变量名采用 camelCase

### 组件开发
- 优先使用 Composition API
- 合理使用 Pinia 进行状态管理
- 组件职责单一，便于复用

### Git 提交
建议使用语义化提交信息：
- `feat:` 新功能
- `fix:` 修复bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 重构代码
- `test:` 测试相关

## 📄 许可证

本项目采用 MIT 许可证。

## 🙋‍♂️ 支持

如有问题或建议，请提交 Issue 或联系开发团队。
