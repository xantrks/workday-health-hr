import { NextAuthConfig } from "next-auth";

export const authConfig = {
  debug: process.env.NODE_ENV === "development",
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    newUser: "/",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      console.log("auth.config authorized被调用，路径:", nextUrl.pathname);
      console.log("认证状态:", auth?.user ? "已登录" : "未登录");
      
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/hr-dashboard') || 
                           nextUrl.pathname.startsWith('/employee-dashboard');
      const isOnAuth = nextUrl.pathname.startsWith('/login') || 
                      nextUrl.pathname.startsWith('/register');

      // 不再重定向已登录用户离开登录页面
      // 修改：允许已登录用户访问登录页面
      
      // 允许访问登录和注册页面
      if (isOnAuth) return true;

      // 仪表盘页面需要登录
      if (isOnDashboard) return isLoggedIn;

      // 其他页面默认允许访问
      return true;
    },
  },
} satisfies NextAuthConfig;
