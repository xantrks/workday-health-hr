'use client';

import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [state, formAction] = useFormState<LoginActionState, FormData>(login, {
    status: "idle"
  });
  
  // 监听state变化
  useEffect(() => {
    if (state.status === 'success' && state.userId) {
      console.log('登录成功，准备重定向...');
      toast.success("登录成功");
      
      // 设置重定向URL，用于显示过渡界面
      setRedirectUrl(`/api/redirect?to=/employee-dashboard/${state.userId}`);
      
      // 使用服务器端重定向API - 最可靠的方式
      window.location.href = `/api/redirect?to=/employee-dashboard/${state.userId}`;
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

  // 如果有重定向URL，显示重定向页面
  if (redirectUrl) {
    return (
      <div className="w-full flex items-center justify-center p-6 md:p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">登录成功</h2>
          <p className="mb-6">正在重定向到仪表盘...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="mb-4">如果页面长时间没有跳转，请使用以下方法：</p>
          
          {/* 提供多种重定向选项 */}
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            {/* 选项1: API重定向 */}
            <a 
              href={redirectUrl}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              target="_self"
            >
              方法1: 通过API重定向
            </a>
            
            {/* 选项2: 直接链接 */}
            <a 
              href={`/employee-dashboard/${state.userId}`}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              target="_self"
            >
              方法2: 直接访问仪表盘
            </a>
            
            {/* 选项3: 表单提交 */}
            <form action={`/employee-dashboard/${state.userId}`} method="GET">
              <button 
                type="submit" 
                className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
              >
                方法3: 通过表单跳转
              </button>
            </form>
          </div>
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