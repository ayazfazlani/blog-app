import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure build output is compatible with Vercel
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
