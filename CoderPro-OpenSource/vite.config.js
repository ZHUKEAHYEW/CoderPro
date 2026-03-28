import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  base: './', // 为 Electron 打包使用相对路径
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})