import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { apiRoutesPlugin } from "./vite-api-plugin";

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), apiRoutesPlugin()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
