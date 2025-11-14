import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
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
      },
    },
  },
  // Expose env variables to client
  envPrefix: 'VITE_',
})