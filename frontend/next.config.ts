// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

    const baseUrl = apiBaseUrl.replace(/\/$/, '');

    return [
      {
        source: '/api/:path*',
        destination: `${baseUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;