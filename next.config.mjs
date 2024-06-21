/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  serverRuntimeConfig: {

    projects: {

      MUJI: {
        ENDPOINT: process.env.MUJI_ENDPOINT,
        API_KEY: process.env.MUJI_API_KEY,
      },

      Unicharm: {
        ENDPOINT: process.env.UNICHARM_ENDPOINT,
        API_KEY: process.env.UNICHARM_API_KEY,
      },
    },
  },
};

export default nextConfig;
