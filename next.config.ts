import type { NextConfig } from "next";

const isTauriExport = process.env.TAURI_EXPORT === "true";

const nextConfig: NextConfig = {
  // Desktop packaging: when TAURI_EXPORT=true, produces a static 'out' directory for Tauri webview.
  output: isTauriExport ? "export" : undefined,
  images: {
    unoptimized: isTauriExport,
  },
  cacheComponents: isTauriExport ? false : true,
  partialPrefetching: isTauriExport ? false : true,
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
