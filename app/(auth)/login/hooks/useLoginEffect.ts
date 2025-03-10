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
      
      // 构建完整URL
      const origin = window.location.origin;
      const fullUrl = `${origin}${dashboardPath}`;
      
      console.log("重定向到完整URL:", fullUrl);
      
      // 首先尝试使用router
      try {
        router.push(dashboardPath);
        
        // 设置一个延迟备份，如果router失败则使用window.location.replace
        setTimeout(() => {
          // 检查URL是否仍在登录页
          if (window.location.pathname.includes('/login')) {
            console.log("路由器重定向可能失败，使用location.replace");
            window.location.replace(fullUrl);
          }
        }, 1000);
      } catch (error) {
        console.error("路由器重定向失败:", error);
        // 直接使用location.replace
        window.location.replace(fullUrl);
      }
    }
  }, [state.status, state.role, state.userId, router]);
} 