'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function DashboardRedirect() {
  const { data: session, status } = useSession();
  
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      const role = (session.user.role || '').toLowerCase();
      console.log("仪表盘页 - 用户已登录:", session.user.id, "角色:", role);
      
      const dashboardPath = role === 'hr' ? 
        `/hr-dashboard/${session.user.id}` : 
        `/employee-dashboard/${session.user.id}`;
        
      console.log("重定向到:", dashboardPath);
      
      // 直接使用window.location.replace而不是Router
      window.location.replace(dashboardPath);
    } else if (status === 'unauthenticated') {
      console.log("仪表盘页 - 用户未登录");
      window.location.replace('/login');
    }
  }, [session, status]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">正在加载您的仪表盘...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
} 