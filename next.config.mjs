/** @type {import('next').NextConfig} */
import { createProxyMiddleware } from 'http-proxy-middleware';

const nextConfig = {

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://cd2g26sz16.execute-api.ap-northeast-1.amazonaws.com/api/:path*',
      },
    ];
  },

  async middleware() {
    return [
      createProxyMiddleware('/api', {
        target: 'https://cd2g26sz16.execute-api.ap-northeast-1.amazonaws.com',
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
