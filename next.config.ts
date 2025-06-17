import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['picsum.photos'],
  },

  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
};

export default nextConfig;
