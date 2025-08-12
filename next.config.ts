import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
    // (optional) tune these so Next generates good breakpoints
    deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920, 2400],
    imageSizes: [320, 480, 640, 750, 828, 1080, 1200, 1920],
  },
};

export default nextConfig;
