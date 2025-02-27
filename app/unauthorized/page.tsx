'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6">
      <div className="text-center max-w-md">
        <Image 
          src="/images/unauthorized.svg" 
          alt="Unauthorized" 
          width={200} 
          height={200}
          className="mx-auto mb-6"
          onError={(e) => {
            // 如果图片加载失败，使用默认图标
            e.currentTarget.style.display = 'none';
          }}
        />
        <h1 className="text-2xl font-bold mb-4">访问未授权</h1>
        <p className="text-muted-foreground mb-8">您没有权限访问此页面。请确认您使用了正确的账户登录。</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => router.push('/login')} variant="default" className="w-full sm:w-auto">
            返回登录页面
          </Button>
          <Button onClick={() => router.back()} variant="outline" className="w-full sm:w-auto">
            返回上一页
          </Button>
        </div>
      </div>
    </div>
  );
} 