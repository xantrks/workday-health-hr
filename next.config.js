/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', process.env.NEXTAUTH_URL, 'sanicle-ai.vercel.app'],
    }
  },
  serverExternalPackages: ['bcryptjs'],
  // 添加重写规则以支持自定义路由
  async rewrites() {
    return [
      // 根路径重定向到登录页
      {
        source: '/',
        destination: '/login',
      },
      // 如果用户已登录，访问/login时重定向到dashboard
      {
        source: '/login',
        destination: '/api/auth/session?redirect=/dashboard',
        has: [
          {
            type: 'cookie',
            key: '__Secure-authjs.session-token',
          },
        ],
      },
      // 从dashboard重定向到适当的仪表盘
      {
        source: '/dashboard',
        destination: '/api/auth/session?redirect=/employee-dashboard',
      },
      // 确保可以直接访问用户仪表盘
      {
        source: '/employee-dashboard/:userId',
        destination: '/employee-dashboard/:userId',
      },
    ];
  },
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