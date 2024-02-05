import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import compressionPlugin from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: true,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  base: "/Home/",
  plugins: [
    vue(),
    compressionPlugin({
      ext: '.gz', // Расширение для сжатых файлов
      algorithm: 'gzip', // Используемый алгоритм сжатия (gzip или brotli)
      threshold: 10240, // Минимальный размер файла для сжатия (в байтах)
      deleteOriginFile: false // Удалить исходные файлы после сжатия
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
