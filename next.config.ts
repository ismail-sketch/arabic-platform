import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Для деплоя на VPS: собирается компактная standalone-папка
     и запускается обычным `node server.js`. */
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
