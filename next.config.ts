import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Be more specific in production
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
