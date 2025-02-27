"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useActionState } from "react";
import { toast } from "sonner";

import { AuthForm } from "@/components/custom/auth-form";
import { SubmitButton } from "@/components/custom/submit-button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { register, RegisterActionState } from "../actions";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    {
      status: "idle",
    },
  );

  useEffect(() => {
    if (state.status === "user_exists") {
      toast.error("该邮箱已被注册");
    } else if (state.status === "failed") {
      toast.error(state.errors?.[0]?.message || "创建账户失败");
    } else if (state.status === "invalid_data") {
      state.errors?.forEach(error => {
        toast.error(error.message);
      });
    } else if (state.status === "success") {
      toast.success("账户创建成功");
      router.push("/login");
    }
  }, [state, router]);

  const handleSubmit = (formData: FormData) => {
    setFormData({
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    });
    formAction(formData);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] w-full">
      {/* 品牌介绍区域 */}
      <div className="hidden lg:flex w-1/2 bg-primary items-center justify-center p-8">
        <div className="max-w-md text-white">
          <Image 
            src="/images/sanicle_logo_white.svg" 
            alt="Sanicle Logo" 
            width={180} 
            height={60}
            className="mb-8"
          />
          <h1 className="text-3xl font-bold mb-4">加入 FemTech 女性健康平台</h1>
          <p className="text-lg opacity-90 mb-6">
            创建您的账户，开始享受我们为职场女性量身定制的健康管理服务。
          </p>
          <div className="bg-white/10 p-6 rounded-lg mt-8">
            <h3 className="font-medium text-xl mb-4">为什么选择我们？</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>专为职场女性设计的健康管理解决方案</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>AI 健康助手提供个性化建议</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>数据安全保障，保护您的隐私</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>HR 系统集成，实现工作与健康的平衡</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* 注册表单 */}
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
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold tracking-tight">
              创建账户
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              加入 FemTech，管理您的健康与工作平衡
            </p>
          </div>

          <AuthForm action={handleSubmit} defaultValues={formData} variant="register">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="firstName" className="text-sm font-medium">名字</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    placeholder="请输入名字"
                    className="mt-1"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="lastName" className="text-sm font-medium">姓氏</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    placeholder="请输入姓氏"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium">邮箱</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="请输入您的邮箱"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium">密码</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="设置密码（至少8个字符）"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium">确认密码</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="请再次输入密码"
                  className="mt-1"
                />
              </div>

              <div className="flex items-center gap-2 mt-4">
                <Checkbox id="agreedToTerms" name="agreedToTerms" required />
                <Label htmlFor="agreedToTerms" className="text-sm">
                  我同意{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    服务条款和隐私政策
                  </Link>
                </Label>
              </div>

              <SubmitButton 
                className="w-full py-2.5 mt-2"
                loading={state.status === "in_progress"}
              >
                创建账户
              </SubmitButton>

              <p className="text-center text-sm text-muted-foreground mt-6 mb-4">
                已有账户？{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary hover:underline"
                >
                  立即登录
                </Link>
              </p>
            </div>
          </AuthForm>
        </div>
      </div>
    </div>
  );
}
