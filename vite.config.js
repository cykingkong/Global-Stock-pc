import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      devtools: false,
    }),
    Components({
      resolvers: [VantResolver()],
    }),
    Unocss(),
  ],
  server: {
    // host: false,
    host: '0.0.0.0',
    proxy: {
      '/capi': {
        target: `http://192.168.31.153/`, // 代理接口
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/capi/, ''),
        ws: false,
      },
      '/wss': {
        target: `ws://192.168.31.153:8080/app/uvjkwblrhcjeawsu3jz1`, // 代理接口
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/wss/, ''),
        ws: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~@': fileURLToPath(new URL('./public', import.meta.url)),
    },
  },
})
