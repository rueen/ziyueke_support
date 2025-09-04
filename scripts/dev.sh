#!/bin/bash

# 自由约课管理端开发启动脚本

echo "🚀 启动自由约课管理端开发服务器..."

# 检查 Node.js 版本
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt "16" ]; then
    echo "❌ Node.js 版本过低，请升级到 16.0.0 或更高版本"
    exit 1
fi

# 检查是否安装了依赖
if [ ! -d "node_modules" ]; then
    echo "📦 检测到未安装依赖，正在安装..."
    npm install
fi

# 启动开发服务器
echo "🌟 启动开发服务器..."
npm run dev
