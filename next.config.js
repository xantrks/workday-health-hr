/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'sanicle-ai.vercel.app'],
    },
    serverComponentsExternalPackages: ['bcryptjs'],
    esmExternals: 'loose',
  }
}

module.exports = nextConfig 