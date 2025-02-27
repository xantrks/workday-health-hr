'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// 设置HR角色的服务器动作
async function setHrRole(email: string) {
  try {
    const response = await fetch('/api/admin/set-hr-role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || '操作失败');
    }
    
    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || '操作失败');
  }
}

export default function SetHrRolePage() {
  const { data: session, status } = useSession({
    required: true,
  });
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      const result = await setHrRole(email);
      setMessage({
        type: 'success',
        text: `${email} 已成功设置为HR角色`
      });
      setEmail('');
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>设置HR角色</CardTitle>
          <CardDescription>
            使用此工具将用户设置为HR角色，允许他们访问HR仪表盘
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  用户邮箱
                </label>
                <Input
                  id="email"
                  placeholder="输入用户邮箱"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              {message && (
                <div className={`p-3 rounded-md ${
                  message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {message.text}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading || !email}>
              {loading ? '处理中...' : '设置为HR角色'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 