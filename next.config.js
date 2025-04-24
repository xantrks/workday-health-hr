/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', process.env.NEXTAUTH_URL, 'sanicle-ai.vercel.app'],
    }
  },
  serverExternalPackages: ['bcryptjs'],
  // Add rewrite rules to support custom routing
  async rewrites() {
    return [
      // Redirect root path to login page
      {
        source: '/',
        destination: '/login',
      },
      // Redirect dashboard to role-specific dashboard based on session
      {
        source: '/dashboard',
        destination: '/api/redirect/dashboard',
      },
    ];
  },
  // Disable strict mode to avoid double rendering issues in development
  reactStrictMode: false,
  // Configure image domains
  images: {
    domains: ['sanicle-ai.vercel.app'],
  },
  // Ensure correct output directory
  distDir: '.next'
}

module.exports = nextConfig 