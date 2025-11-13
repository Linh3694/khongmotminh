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
  // Expose env variables to client
  envPrefix: 'VITE_',
})