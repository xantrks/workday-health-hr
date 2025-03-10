'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function EmployeeDashboardRedirect() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      console.log("重定向到用户仪表盘:", session.user.id);
      router.replace(`/employee-dashboard/${session.user.id}`);
    } else if (status === 'unauthenticated') {
      console.log("未登录用户，重定向到登录页");
      router.replace('/login');
    }
  }, [router, session, status]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">正在加载您的仪表盘...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
} 