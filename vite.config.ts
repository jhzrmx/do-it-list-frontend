import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Do It List",
        short_name: "Todo",
        theme_color: "#FA5C5C",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "icon.png",
            sizes: "256x256",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  /*
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_PROXY_BACKEND_URL || "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  */
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
