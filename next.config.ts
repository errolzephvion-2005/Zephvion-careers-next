import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 allowedDevOrigins: ['192.168.56.1', '192.168.0.0/16'],
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
