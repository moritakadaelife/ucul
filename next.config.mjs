/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 他の設定
  serverRuntimeConfig: {

    projects: {
      MUJI: {},
      Unicharm: {},
    },
  },
};

export default nextConfig;
