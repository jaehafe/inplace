/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['www.gravatar.com', 'localhost'],
  },
};

module.exports = nextConfig;
