'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
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
      
      // 只记录日志，不再执行重定向，避免与LoginForm冲突
      console.log("登录成功，角色:", state.role, "用户ID:", state.userId);
    }
  }, [state.status, state.userId, state.role]);
} 