import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from "vite-plugin-dts";
import * as path from "path";
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    cssInjectedByJsPlugin()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/main.ts"),
      name: "arcpay-sdk",
      fileName: "arcpay-sdk"
    },
    rollupOptions: {
      external: ["vue", "algosdk"],
      output: {
        manualChunks: undefined,
        globals: {
          vue: 'Vue',
          algosdk: '_algosdk'
        },
      }
    }
  },
})
