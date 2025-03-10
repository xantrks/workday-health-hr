'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
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
      
      const dashboardPath = state.role?.toLowerCase() === "hr" ? 
        `/hr-dashboard/${state.userId}` : 
        `/employee-dashboard/${state.userId}`;
      
      console.log("重定向到:", dashboardPath);
      
      // 使用Next.js的Router进行导航而不是window.location
      router.push(dashboardPath);
      
      // 备用方案：如果router.push不起作用，可以使用这个
      // setTimeout(() => {
      //   window.location.href = dashboardPath;
      // }, 500);
    }
  }, [state.status, state.role, state.userId, router]);
} 