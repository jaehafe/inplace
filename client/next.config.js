/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: [
      'www.gravatar.com',
      'localhost',
      'ec2-54-180-29-58.ap-northeast-2.compute.amazonaws.com',
    ],
  },
};

module.exports = nextConfig;
