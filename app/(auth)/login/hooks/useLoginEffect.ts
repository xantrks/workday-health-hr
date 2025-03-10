'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LoginActionState } from '../types';

/**
 * 处理登录状态变化和导航的自定义钩子
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
      
      console.log("登录成功，角色:", state.role, "用户ID:", state.userId);
      
      // 使用最简单最直接的方式重定向到dashboard
      console.log("准备重定向到dashboard...");
      
      // 不使用任何复杂的路由逻辑，直接设置URL
      window.location.href = "/dashboard";
    }
  }, [state.status, state.userId, state.role]);
} 