/*
 * @Author: diaochan
 * @Date: 2025-09-04 17:12:09
 * @LastEditors: diaochan
 * @LastEditTime: 2025-09-11 14:29:16
 * @Description: 
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        // target: 'https://admin.rueen.cn',
        changeOrigin: true,
      },
    },
  },
})
