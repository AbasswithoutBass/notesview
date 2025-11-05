// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite 配置文件
export default defineConfig({
  plugins: [react()],
  root: '.', // 项目根目录
  build: {
    outDir: 'dist', // 打包输出目录
    sourcemap: false, // 生产环境不生成 source maps
    minify: 'esbuild', // 使用 esbuild 进行代码压缩（内置）
    rollupOptions: {
      output: {
        manualChunks: {
          'vexflow': ['vexflow'],
          'tone': ['tone']
        }
      }
    }
  },
  server: {
    port: 5183,
    strictPort: true,
    open: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5183,
      timeout: 30000,
      overlay: true
    },
    watch: {
      usePolling: true,
      interval: 100
    }
  }
})
