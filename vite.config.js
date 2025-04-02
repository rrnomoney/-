import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
  ],
  server: {
    port: 3000,
    strictPort: true,
    hmr: {
      overlay: true,
      protocol: 'ws',
      host: 'localhost',
      port: 3000
    },
    host: true,
    cors: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1500
  }
})
