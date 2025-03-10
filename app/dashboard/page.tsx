'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  useEffect(() => {
    console.log('仪表盘页加载，状态:', status);
    
    if (status === 'authenticated' && session?.user?.id) {
      setIsRedirecting(true);
      
      const role = (session.user.role || '').toLowerCase();
      console.log('用户已认证:', session.user.id, '角色:', role);
      
      const dashboardUrl = role === 'hr' ? 
        `/hr-dashboard/${session.user.id}` : 
        `/employee-dashboard/${session.user.id}`;
        
      console.log('准备重定向到:', dashboardUrl);
      
      // 使用直接的window.location方法
      setTimeout(() => {
        window.location.href = dashboardUrl;
      }, 1500);
    }
  }, [status, session]);
  
  // 简单页面内容，确保有内容显示
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">仪表盘</h1>
      
      {status === 'loading' ? (
        <div className="flex flex-col items-center p-8">
          <p className="mb-4">正在加载您的信息...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : status === 'authenticated' ? (
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-xl font-semibold mb-4">您已登录</h2>
          <p className="mb-2">欢迎回来, {session?.user?.name || '用户'}!</p>
          
          {isRedirecting ? (
            <div>
              <p className="mb-4">正在加载您的个人仪表盘，请稍候...</p>
              <div className="animate-pulse bg-gray-200 h-4 w-1/2 mb-2 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-4 w-3/4 mb-2 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-4 w-1/4 rounded"></div>
            </div>
          ) : (
            <div className="mt-4">
              <p>选择进入您的仪表盘:</p>
              <div className="mt-4 space-x-4">
                <Link 
                  href={`/employee-dashboard/${session?.user?.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  员工仪表盘
                </Link>
                
                {session?.user?.role?.toLowerCase() === 'hr' && (
                  <Link 
                    href={`/hr-dashboard/${session?.user?.id}`}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    HR仪表盘
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-xl font-semibold mb-4">您尚未登录</h2>
          <p>请先登录以访问您的仪表盘</p>
          <Link 
            href="/login" 
            className="bg-blue-600 text-white px-4 py-2 rounded mt-4 inline-block"
          >
            去登录
          </Link>
        </div>
      )}
    </div>
  );
} 