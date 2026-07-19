import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

// @ts-expect-error - eslint config option not reflected in current type defs
nextConfig.eslint = {
  ignoreDuringBuilds: true,
};

export default nextConfig;