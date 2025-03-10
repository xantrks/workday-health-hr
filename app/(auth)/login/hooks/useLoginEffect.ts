'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LoginActionState } from '../types';

/**
 * Custom hook for handling login state changes and navigation
 */
export function useLoginEffect(state: LoginActionState) {
  const router = useRouter();

  useEffect(() => {
    if (state.status === "failed") {
      toast.error("无效的邮箱或密码");
    } else if (state.status === "invalid_data") {
      toast.error("请检查您的输入");
    } else if (state.status === "success" && state.userId) {
      toast.success("登录成功");
      
      // 添加调试输出
      console.log("登录成功，角色:", state.role, "用户ID:", state.userId);
      
      // 直接使用通用仪表盘路由，避免动态路由问题
      const dashboardUrl = '/dashboard';
      
      console.log("重定向到通用仪表盘:", dashboardUrl);
      
      // 直接使用window.location.replace方法保证跳转
      window.location.replace(dashboardUrl);
      
      // 备用方案：如果上面的方法失败，尝试使用延迟跳转
      // setTimeout(() => {
      //   try {
      //     router.push('/dashboard');
      //   } catch (e) {
      //     console.error("Router导航失败:", e);
      //     window.location.href = '/dashboard';
      //   }
      // }, 500);
    }
  }, [state.status, state.role, state.userId, router]);
} 