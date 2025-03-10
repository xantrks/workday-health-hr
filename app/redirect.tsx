'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function RedirectPage() {
  const { data: session } = useSession();
  
  useEffect(() => {
    if (session?.user) {
      const userId = session.user.id;
      const role = (session.user.role || '').toLowerCase();
      
      console.log("重定向页 - 用户信息:", userId, role);
      
      // 构建目标URL
      const dashboardPath = role === 'hr' ? 
        `/hr-dashboard/${userId}` : 
        `/employee-dashboard/${userId}`;
      
      const fullUrl = window.location.origin + dashboardPath;
      console.log("重定向到:", fullUrl);
      
      // 直接使用原生方法进行重定向
      window.location.replace(fullUrl);
    }
  }, [session]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">正在为您跳转...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
} 