"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from 'react-dom';
import { toast } from "sonner";

import { AuthForm } from "@/components/custom/auth-form";
import { SubmitButton } from "@/components/custom/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { login } from "../actions";

export interface LoginActionState {
  status: "idle" | "in_progress" | "success" | "failed" | "invalid_data";
  role?: string;
  userId?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction] = useFormState(login, {
    status: "idle"
  });

  useEffect(() => {
    if (state.status === "failed") {
      toast.error("邮箱或密码错误");
    } else if (state.status === "invalid_data") {
      toast.error("请检查您的输入信息");
    } else if (state.status === "success" && state.userId) {
      toast.success("登录成功");
      const basePath = window.location.origin;
      const dashboardPath = state.role === "hr" ? 
        `/hr-dashboard/${state.userId}` : 
        `/employee-dashboard/${state.userId}`;
      window.location.href = `${basePath}${dashboardPath}`;
    }
  }, [state.status, state.role, state.userId]);

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] w-full">
      {/* 左侧品牌区域 */}
      <div className="hidden lg:flex w-1/2 bg-primary items-center justify-center p-8">
        <div className="max-w-md text-white">
          <Image 
            src="/images/sanicle_logo_white.svg" 
            alt="Sanicle Logo" 
            width={180} 
            height={60}
            className="mb-8"
          />
          <h1 className="text-3xl font-bold mb-4">欢迎使用 FemTech 女性健康平台</h1>
          <p className="text-lg opacity-90 mb-6">
            我们致力于为职场女性提供全面的健康管理解决方案，帮助您更好地平衡工作与健康。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-2">经期追踪</h3>
              <p className="text-sm opacity-80">智能周期预测，帮助您更好地规划工作和生活</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-2">健康咨询</h3>
              <p className="text-sm opacity-80">随时与AI健康助手聊天，获取专业建议</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-2">医疗预约</h3>
              <p className="text-sm opacity-80">便捷的医疗服务预约系统，节省您的时间</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-2">数据分析</h3>
              <p className="text-sm opacity-80">个性化健康数据分析，帮助您监控健康状况</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 右侧登录表单 */}
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

          <AuthForm action={formAction} variant="login">
            <div className="space-y-5">
              <div>
                <Label htmlFor="email" className="text-sm font-medium">邮箱</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="请输入您的邮箱"
                  className="mt-1"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">密码</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    忘记密码？
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="请输入您的密码"
                  className="mt-1"
                />
              </div>

              <SubmitButton
                className="w-full py-2.5"
                loading={state.status === "in_progress"}
              >
                登录
              </SubmitButton>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-2 text-muted-foreground">
                    或者
                  </span>
                </div>
              </div>

              <p className="text-center text-sm text-muted-foreground mb-4">
                还没有账户？{" "}
                <Link
                  href="/register"
                  className="font-medium text-primary hover:underline"
                >
                  立即注册
                </Link>
              </p>
            </div>
          </AuthForm>
        </div>
      </div>
    </div>
  );
}
