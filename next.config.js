/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', process.env.NEXTAUTH_URL],
    }
  },
  serverExternalPackages: ['bcryptjs']
}

module.exports = nextConfig 