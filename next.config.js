/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'sanicle-ai.vercel.app'],
    }
  },
  serverExternalPackages: ['bcryptjs'],
  // 关闭严格模式以排除开发过程中的双重渲染问题
  reactStrictMode: false,
  // 配置图像域
  images: {
    domains: ['sanicle-ai.vercel.app'],
  },
  // 确保输出目录正确
  distDir: '.next'
}

module.exports = nextConfig 