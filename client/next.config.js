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
      'ec2-3-34-47-215.ap-northeast-2.compute.amazonaws.com',
    ],
  },

  rewrites: () => {
    return {
      fallback: [
        {
          source: '/:path*',
          destination: `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/:path*`,
        },
      ],
    };
  },
};

module.exports = nextConfig;
