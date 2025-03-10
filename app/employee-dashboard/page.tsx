'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function EmployeeDashboardIndex() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);
  
  // 确保只在客户端执行
  useEffect(() => {
    setIsClient(true);
    
    // 添加控制台输出来跟踪页面加载
    console.log("Employee Dashboard页面加载");
    console.log("会话状态:", status);
    console.log("用户:", session?.user);
    
    if (status === 'authenticated' && session?.user?.id) {
      console.log("已认证用户，尝试重定向到用户特定仪表盘");
      // 添加延迟重定向
      setTimeout(() => {
        router.push(`/employee-dashboard/${session.user.id}`);
      }, 2000);
    }
  }, [router, session, status]);

  // 返回简单UI，确保页面可渲染
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">员工仪表盘</h1>
      
      {!isClient ? (
        <p>加载中...</p>
      ) : status === 'loading' ? (
        <div className="flex flex-col items-center">
          <p className="mb-4">正在加载您的信息...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : status === 'authenticated' ? (
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-xl font-semibold mb-4">您已登录</h2>
          <p className="mb-2">欢迎, {session.user?.name || '用户'}!</p>
          <p className="mb-4">请稍候，正在重定向到您的个人仪表盘...</p>
          
          <div className="mt-6">
            <p>如果您未被自动重定向，请点击下方链接：</p>
            <Link 
              href={`/employee-dashboard/${session.user?.id}`}
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              进入我的仪表盘
            </Link>
          </div>
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