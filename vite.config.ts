import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from "path";
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import dts from "vite-plugin-dts";


// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "global.WebSocket": "globalThis.WebSocket",
  },
  plugins: [
    vue(),
    cssInjectedByJsPlugin(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/main.ts"),
      name: "arcpay",
      fileName: "arcpay-sdk"
    },
    rollupOptions: {
      external: ["vue", "algosdk", "@txnlab/use-wallet", "radix-vue"],
      output: {
        globals: {
          vue: 'vue',
          algosdk: 'algosdk',
          '@txnlab/use-wallet': 'useWallet',
          'radix-vue': 'radix-vue'
        },
      }
    },
  },
})
