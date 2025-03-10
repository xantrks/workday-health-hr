'use client';

import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

import { AuthForm } from "@/components/custom/auth-form";
import { SubmitButton } from "@/components/custom/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { login } from "../../actions";
import { LoginActionState } from '../types';

/**
 * 登录表单组件
 * 处理用户通过邮箱和密码登录
 */
export function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const [state, formAction] = useFormState<LoginActionState, FormData>(login, {
    status: "idle"
  });
  
  // 监听state变化
  useEffect(() => {
    if (state.status === 'success' && state.userId) {
      console.log('登录成功:', state);
      setLoginSuccess(true);
      setUserId(state.userId);
      toast.success("登录成功!");
      
      // 尝试自动重定向（但保留备用UI以防失败）
      const timer = setTimeout(() => {
        try {
          // 先尝试直接导航
          window.location.href = `/employee-dashboard/${state.userId}`;
        } catch (error) {
          console.error("自动重定向失败，等待用户手动选择:", error);
          // 失败时不做任何处理，用户将看到手动选择按钮
        }
      }, 800); // 给toast足够时间显示
      
      // 清理定时器
      return () => clearTimeout(timer);
    } else if (state.status === 'failed') {
      toast.error("无效的邮箱或密码");
      setIsSubmitting(false);
    } else if (state.status === 'invalid_data') {
      toast.error("请检查您的输入");
      setIsSubmitting(false);
    }
  }, [state]);
  
  // 创建一个包装的表单动作处理函数
  const handleSubmit = (formData: FormData) => {
    setIsSubmitting(true);
    formAction(formData);
  };
  
  // 修改导航目标地址 - 直接导航到用户特定仪表盘
  const handleDirectNavigation = () => {
    try {
      if (window.top) {
        // Directly navigate to user-specific dashboard
        window.top.location.href = `/employee-dashboard/${userId}`;
      } else {
        window.location.href = `/employee-dashboard/${userId}`;
      }
    } catch (error) {
      console.error("Navigation failed:", error);
      
      // Backup method: Create form and submit directly
      const form = document.createElement('form');
      form.method = 'GET';
      form.action = `/employee-dashboard/${userId}`;
      form.target = '_top';
      document.body.appendChild(form);
      form.submit();
    }
  };

  // 如果登录成功，显示导航界面
  if (loginSuccess && userId) {
    return (
      <div className="w-full flex items-center justify-center p-6 md:p-8">
        <div className="text-center max-w-md bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Login Successful</h2>
          <p className="mb-8 text-gray-600">Please select a way to go to your dashboard</p>
          
          <div className="space-y-4">
            <button 
              onClick={handleDirectNavigation}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Go directly to my dashboard
            </button>
            
            <form action={`/employee-dashboard/${userId}`} method="GET" target="_top">
              <button 
                type="submit"
                className="w-full bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 transition-colors"
              >
                Go through form
              </button>
            </form>
            
            <a 
              href={`/employee-dashboard/${userId}`}
              className="block w-full bg-purple-600 text-white px-4 py-3 rounded-md hover:bg-purple-700 transition-colors text-center"
            >
              Use direct link
            </a>
          </div>
          
          {/* 在使用iframe预加载静态页面 */}
          <iframe 
            ref={iframeRef}
            src="/employee-dashboard/static"
            style={{ display: 'none' }}
            title="预加载页面"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-8">
      <div className="w-full max-w-md">
        <div className="lg:hidden flex justify-center mb-8">
          <Image 
            src="/images/sanicle_logo.svg" 
            alt="Sanicle Logo" 
            width={150} 
            height={50}
          />
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight">
            欢迎回来
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            请登录您的账户
          </p>
        </div>

        <AuthForm action={handleSubmit} variant="login">
          <div className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-sm font-medium">邮箱</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="输入您的邮箱"
                className="mt-1"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">密码</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  忘记密码?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="输入您的密码"
                className="mt-1"
                disabled={isSubmitting}
              />
            </div>

            <SubmitButton
              className="w-full py-2.5"
              loading={state.status === "in_progress" || isSubmitting}
            >
              登录
            </SubmitButton>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground">
                  或
                </span>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground mb-4">
              没有账号?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline"
              >
                注册
              </Link>
            </p>
          </div>
        </AuthForm>
      </div>
    </div>
  );
} 