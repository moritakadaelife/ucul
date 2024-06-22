/** @type {import('next').NextConfig} */
import { createProxyMiddleware } from 'http-proxy-middleware';

const nextConfig = {

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },

  async middleware() {
    return [
      createProxyMiddleware('/api', {
        target: process.env.NEXT_PUBLIC_API_URL,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      }),
    ];
  },

  reactStrictMode: true,

  serverRuntimeConfig: {

    projects: {

      "MUJI": {
        ENDPOINT: process.env.MUJI_ENDPOINT,
        API_KEY: process.env.MUJI_API_KEY,
      },

      "ユニチャーム": {
        ENDPOINT: process.env.UNICHARM_ENDPOINT,
        API_KEY: process.env.UNICHARM_API_KEY,
      },
    },
  },
};

export default nextConfig;
