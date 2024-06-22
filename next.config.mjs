import { createProxyMiddleware } from 'http-proxy-middleware';

/** @type {import('next').NextConfig} */
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

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, PATCH, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-Requested-With, Content-Type, Authorization' },
        ],
      },
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
