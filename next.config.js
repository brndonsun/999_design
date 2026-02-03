/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/interior_design_project' : '',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images-na.ssl-images-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'www.ikea.com',
      },
      {
        protocol: 'https',
        hostname: 'secure.img1-fg.wfcdn.com',
      },
    ],
  },
  trailingSlash: true,
};

module.exports = nextConfig;
