/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'sanicle-ai.vercel.app'],
    }
  },
  serverExternalPackages: ['bcryptjs']
}

module.exports = nextConfig 