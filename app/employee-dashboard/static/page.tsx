'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function StaticEmployeeDashboard() {
  const { data: session } = useSession();
  const [isClient, setIsClient] = useState(false);
  
  // 页面加载时设置客户端标志
  useEffect(() => {
    setIsClient(true);
    console.log("静态仪表盘页面已加载");
  }, []);
  
  // 只在客户端渲染内容
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-8">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6">员工仪表盘 (静态版)</h1>
        
        {session ? (
          <div>
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
              <h2 className="text-xl font-semibold text-green-800">登录成功!</h2>
              <p className="text-green-700 mt-2">
                欢迎回来, {session.user?.name || '用户'}!
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-3">健康数据</h3>
                <p>这里将显示您的健康数据摘要</p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-3">周期跟踪</h3>
                <p>这里将显示您的周期跟踪信息</p>
              </div>
              
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-3">即将到来的预约</h3>
                <p>您没有即将到来的预约</p>
              </div>
              
              <div className="bg-pink-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-3">健康提示</h3>
                <p>保持水分摄入是维持健康的重要部分</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                返回主仪表盘
              </Link>
              
              <button 
                onClick={() => window.history.back()}
                className="bg-gray-600 text-white px-5 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                返回上一页
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg mb-4">您尚未登录或会话已过期</p>
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              去登录
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 