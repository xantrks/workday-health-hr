'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    // 如果用户已登录，重定向到仪表盘
    if (status === 'authenticated' && session?.user?.id) {
      console.log('根页面：用户已登录，重定向到仪表盘');
      
      // 确定用户角色，默认为employee
      const role = ((session.user.role as string) || 'employee').toLowerCase();
      
      // 根据角色选择仪表盘
      const dashboardPath = role === 'hr' ? 
        `/hr-dashboard/${session.user.id}` : 
        `/employee-dashboard/${session.user.id}`;
      
      // 使用路由器重定向
      router.replace(dashboardPath);
    } 
    // 如果用户未登录，重定向到登录页
    else if (status === 'unauthenticated') {
      console.log('根页面：用户未登录，重定向到登录页');
      router.replace('/login');
    }
  }, [session, status, router]);
  
  // 加载状态显示
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Sanicle Health Platform</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-500">正在加载，请稍候...</p>
      </div>
    </div>
  );
} 