'use client';

import Link from "next/link";
import Image from "next/image";
import { useFormState } from 'react-dom';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { AuthForm } from "@/components/custom/auth-form";
import { SubmitButton } from "@/components/custom/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { login } from "../../actions";
import { LoginActionState } from '../types';
import { useLoginEffect } from '../hooks/useLoginEffect';

/**
 * 登录表单组件
 * 处理用户通过邮箱和密码登录
 */
export function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, formAction] = useFormState<LoginActionState, FormData>(login, {
    status: "idle"
  });
  
  // 创建一个包装的表单动作处理函数
  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    const result = await formAction(formData);
    
    // 表单处理完成后手动检查状态
    if (result?.status === 'success') {
      console.log('表单提交成功，准备重定向...');
      // 等待一小段时间，确保状态已更新
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 300);
    } else {
      setIsSubmitting(false);
    }
  };

  // 使用自定义钩子处理登录效果
  useLoginEffect(state);

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