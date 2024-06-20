/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  serverRuntimeConfig: {
    projects: {
      MUJI: {
        endpoint: 'https://cd2g26sz16.execute-api.ap-northeast-1.amazonaws.com/api/upload',
      },
      Unicharm: {
        endpoint: 'https://cd2g26sz16.execute-api.ap-northeast-1.amazonaws.com/api/upload',
      },
    },
  },
};

export default nextConfig;
