import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    sourcemap: false, // Tắt source map trong esbuild (cả dev và build)
  },
  optimizeDeps: {
    esbuildOptions: {
      sourcemap: false, // Tắt source map trong pre-bundling
    },
  },
  server: {
    port: 2222,
    host: '0.0.0.0', // Listen trên tất cả interfaces để có thể truy cập từ bên ngoài
  },
  build: {
    minify: 'esbuild', // Minify JavaScript code với esbuild
    sourcemap: false, // Không tạo source maps trong production
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined, // Tắt code splitting tự động
        format: 'es',
        sourcemap: false, // Đảm bảo không tạo source map trong output
      },
    },
  },
  css: {
    devSourcemap: false, // Tắt CSS source map trong development
  },
  // Expose env variables to client
  envPrefix: 'VITE_',
})