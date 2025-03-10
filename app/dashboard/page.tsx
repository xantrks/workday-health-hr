'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // 确认代码是在客户端运行的
    setIsClient(true);
    console.log('仪表盘页面挂载成功');
    
    // 添加调试信息
    if (status === 'authenticated' && session?.user) {
      console.log('用户已登录:', session.user);
    } else {
      console.log('会话状态:', status);
    }
  }, [status, session]);
  
  // 仅在客户端渲染的内容
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
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
          
          <div className="mt-6">
            <p className="mb-4">请选择您要访问的仪表盘:</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href={`/employee-dashboard/${session?.user?.id}`}
                className="bg-blue-600 text-white px-6 py-3 rounded text-center hover:bg-blue-700 transition-colors"
              >
                员工仪表盘
              </Link>
              
              {session?.user?.role?.toLowerCase() === 'hr' && (
                <Link 
                  href={`/hr-dashboard/${session?.user?.id}`}
                  className="bg-green-600 text-white px-6 py-3 rounded text-center hover:bg-green-700 transition-colors"
                >
                  HR仪表盘
                </Link>
              )}
            </div>
            
            <div className="mt-6 p-4 border border-yellow-300 bg-yellow-50 rounded">
              <h3 className="text-lg font-medium text-yellow-800">如果您遇到导航问题</h3>
              <p className="text-yellow-700 mb-3">您可以尝试直接访问以下链接：</p>
              <div className="flex flex-col gap-2">
                <a 
                  href={`/employee-dashboard/${session?.user?.id}`}
                  className="text-blue-600 hover:underline"
                  target="_self"
                >
                  直接链接：员工仪表盘
                </a>
                
                <form action={`/employee-dashboard/${session?.user?.id}`} method="GET" className="mt-2">
                  <button 
                    type="submit" 
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    通过表单导航：员工仪表盘
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-xl font-semibold mb-4">您尚未登录</h2>
          <p>请先登录以访问您的仪表盘</p>
          <Link 
            href="/login" 
            className="bg-blue-600 text-white px-4 py-2 rounded mt-4 inline-block hover:bg-blue-700 transition-colors"
          >
            去登录
          </Link>
        </div>
      )}
    </div>
  );
} 