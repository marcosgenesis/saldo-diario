import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { resolve } from "node:path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
    VitePWA({ registerType: "autoUpdate", devOptions: { enabled: true } }),
  ],
  resolve: {
    alias: {
      "@": resolve(process.cwd(), "./src"),
    },
  },
});
