import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.VITE_CLOUDINARY_CLOUD_NAME': JSON.stringify(process.env.VITE_CLOUDINARY_CLOUD_NAME),
    'process.env.VITE_BACKEND_URL': JSON.stringify(process.env.VITE_BACKEND_URL)
  }
})
