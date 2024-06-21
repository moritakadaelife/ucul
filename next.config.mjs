/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  serverRuntimeConfig: {

    projects: {

      MUJI: {
        ENDPOINT: 'https://cd2g26sz16.execute-api.ap-northeast-1.amazonaws.com/api/upload',
        API_KEY: 'Fc7lslJVkP6Xr9dbkolZcPICL91IIMA6txhPg5Aj',
      },

      Unicharm: {
        ENDPOINT: 'https://cd2g26sz16.execute-api.ap-northeast-1.amazonaws.com/api/upload',
        API_KEY: 'Fc7lslJVkP6Xr9dbkolZcPICL91IIMA6txhPg5Aj',
      },
    },
  },
};

export default nextConfig;
