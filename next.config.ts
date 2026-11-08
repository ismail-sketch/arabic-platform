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
  /* /train — старое имя страницы тренажёра, ведём на статическую копию. */
  async redirects() {
    return [{ source: "/train", destination: "/trainer.html", permanent: false }];
  },
};

export default nextConfig;
