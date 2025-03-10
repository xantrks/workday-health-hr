'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
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
  
  // 处理直接导航到用户仪表盘
  const handleDirectNavigation = () => {
    if (!session?.user?.id) return;
    
    setIsRedirecting(true);
    
    try {
      // 直接导航到用户特定仪表盘
      window.location.href = `/employee-dashboard/${session.user.id}`;
    } catch (error) {
      console.error("导航失败:", error);
      setIsRedirecting(false);
    }
  };
  
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
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {status === 'loading' ? (
        <div className="flex flex-col items-center p-8">
          <p className="mb-4">Loading your information...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : status === 'authenticated' ? (
        <div className="bg-white shadow-md rounded p-6">
          <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
            <h2 className="text-xl font-semibold text-blue-800">Welcome back, {session?.user?.name || 'User'}!</h2>
            <p className="text-blue-700 mt-2">You can use the button below to directly access your personal dashboard.</p>
          </div>
          
          <div className="mb-8">
            <button
              onClick={handleDirectNavigation}
              disabled={isRedirecting}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded text-center hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {isRedirecting ? 'Redirecting...' : 'Go to my personal dashboard'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href={`/employee-dashboard/${session?.user?.id}`}
              className="bg-green-600 text-white px-4 py-3 rounded text-center hover:bg-green-700 transition-colors"
              target="_self"
            >
              Direct link access
            </a>
            
            <form action={`/employee-dashboard/${session?.user?.id}`} method="GET">
              <button 
                type="submit" 
                className="w-full bg-purple-600 text-white px-4 py-3 rounded hover:bg-purple-700 transition-colors"
              >
                Go to my personal dashboard
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-xl font-semibold mb-4">You are not logged in</h2>
          <p>Please log in to access your dashboard</p>
          <Link 
            href="/login" 
            className="bg-blue-600 text-white px-4 py-2 rounded mt-4 inline-block hover:bg-blue-700 transition-colors"
          >
            Go to login
          </Link>
        </div>
      )}
    </div>
  );
} 