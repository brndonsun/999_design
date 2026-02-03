/** @type {import('next').NextConfig} */
const nextConfig = {
  // Note: Remove 'output: export' to enable API routes for Vercel
  // Static export doesn't support API routes
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
};

module.exports = nextConfig;
