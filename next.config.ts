import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.openfoodfacts.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.openfoodfacts.org',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
