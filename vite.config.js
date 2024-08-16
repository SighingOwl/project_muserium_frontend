import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [vue()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, process.env.SSL_KEY_PATH)),
      cert: fs.readFileSync(path.resolve(__dirname, process.env.SSL_CERT_PATH)),
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env': process.env
  }
});