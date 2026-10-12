import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_LEAD_ENDPOINT:
      process.env.NEXT_PUBLIC_LEAD_ENDPOINT ||
      "https://functions.yandexcloud.net/d4eca99gj9rscbeuju4d",
  },
};

export default nextConfig;
