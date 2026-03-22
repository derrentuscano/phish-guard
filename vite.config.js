import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      // In development: /hf-proxy/* → https://api-inference.huggingface.co/*
      // This stops the browser from ever making a cross-origin request to HF
      '/hf-proxy': {
        target: 'https://api-inference.huggingface.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/hf-proxy/, ''),
        secure: true,
      },
    },
  },
})

