import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { watchSharedPackage } from "./vite-watch-shared";

const repoRoot = path.resolve(__dirname, "..");
const sharedSrc = path.resolve(repoRoot, "packages/shared/src");
const apiProxyTarget = process.env.VITE_API_PROXY_TARGET ?? "http://127.0.0.1:3000";

export default defineConfig({
  plugins: [react(), watchSharedPackage(sharedSrc)],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@worklog/shared": path.resolve(sharedSrc, "index.ts"),
    },
  },
  optimizeDeps: {
    // Load shared from source on each dev start, not a stale prebundle.
    exclude: ["@worklog/shared"],
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    globals: false,
    css: true,
  },
  server: {
    port: 5173,
    strictPort: true,
    fs: {
      allow: [repoRoot],
    },
    watch: {
      // Required when Vite runs in Docker with bind mounts (web-dev in docker-compose.yml).
      usePolling: process.env.CHOKIDAR_USEPOLLING === "true",
    },
    proxy: {
      "/api": {
        target: apiProxyTarget,
        changeOrigin: true,
      },
    },
  },
});
