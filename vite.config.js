// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite 配置文件
export default defineConfig({
  plugins: [react()],
  root: '.', // 项目根目录
  build: {
    outDir: 'dist' // 打包输出目录
  },
  server: {
    port: 5175, // 启动端口
    open: true, // 自动打开浏览器
    hmr: {
      host: 'localhost',
      port: 5175
    }
  }
})
