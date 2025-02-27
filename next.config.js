/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'your-domain.vercel.app'],
    },
  },
  // 禁用 Edge Runtime
  experimental: {
    runtime: 'nodejs',
  },
}

module.exports = nextConfig 