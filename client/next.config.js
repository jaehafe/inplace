/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['www.gravatar.com', 'localhost', 'http://localhost:4000'],
  },
};

module.exports = nextConfig;
