'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  Calendar, 
  Activity, 
  Clock, 
  MessageSquare, 
  Calendar as CalendarIcon,
  Heart,
  PlusCircle
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function EmployeeDashboard({ params }: { params: { userId: string } }) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/login');
    },
  });
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (session?.user && session.user.id !== params.userId) {
      router.replace(`/employee-dashboard/${session.user.id}`);
    }
  }, [session, params.userId, router]);

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">加载中...</div>
    </div>;
  }

  if (!session?.user) return null;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">员工健康仪表盘</h1>
          <p className="text-muted-foreground mt-1">欢迎回来, {session.user.name}</p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-pink-600 hover:bg-pink-700"
          onClick={() => router.push(`/chat/new?userId=${params.userId}&role=employee`)}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          咨询 Sani 助手
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">总览</TabsTrigger>
          <TabsTrigger value="cycle">经期追踪</TabsTrigger>
          <TabsTrigger value="health">健康状态</TabsTrigger>
          <TabsTrigger value="appointments">医疗预约</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">下次经期预测</CardTitle>
                <Calendar className="h-4 w-4 text-pink-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3月15日</div>
                <p className="text-xs text-muted-foreground">距今还有7天</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">情绪状态</CardTitle>
                <Heart className="h-4 w-4 text-pink-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">良好</div>
                <p className="text-xs text-muted-foreground">近7天平均</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">即将到来的预约</CardTitle>
                <Clock className="h-4 w-4 text-pink-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">3月10日 妇科检查</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">健康活动</CardTitle>
                <Activity className="h-4 w-4 text-pink-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">健康指数</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>本月健康概览</CardTitle>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center border-t pt-4">
                <p className="text-muted-foreground text-center">健康数据图表将在这里显示</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>最近通知</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 rounded-lg border p-3">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">经期提醒</p>
                      <p className="text-sm text-muted-foreground">
                        您的下一次经期预计在7天后开始
                      </p>
                    </div>
                    <CalendarIcon className="h-5 w-5 text-pink-500" />
                  </div>
                  
                  <div className="flex items-start gap-4 rounded-lg border p-3">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">医疗预约确认</p>
                      <p className="text-sm text-muted-foreground">
                        您的妇科检查预约已确认
                      </p>
                    </div>
                    <Clock className="h-5 w-5 text-pink-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="cycle" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>经期日历</CardTitle>
              <CardDescription>
                追踪和预测您的经期周期
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center border-t pt-4">
              <p className="text-muted-foreground text-center">经期日历将在这里显示</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">记录症状</Button>
              <Button>更新周期</Button>
            </CardFooter>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>周期分析</CardTitle>
              </CardHeader>
              <CardContent className="h-60 flex items-center justify-center border-t pt-4">
                <p className="text-muted-foreground text-center">周期分析图表将在这里显示</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>症状记录</CardTitle>
              </CardHeader>
              <CardContent className="h-60 flex flex-col space-y-4 border-t pt-4">
                <div className="flex justify-between items-center">
                  <p>腹痛</p>
                  <div className="flex">
                    <span className="block w-4 h-4 mx-1 rounded-full bg-pink-200"></span>
                    <span className="block w-4 h-4 mx-1 rounded-full bg-pink-300"></span>
                    <span className="block w-4 h-4 mx-1 rounded-full bg-pink-400"></span>
                    <span className="block w-4 h-4 mx-1 rounded-full bg-gray-200"></span>
                    <span className="block w-4 h-4 mx-1 rounded-full bg-gray-200"></span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p>情绪波动</p>
                  <div className="flex">
                    <span className="block w-4 h-4 mx-1 rounded-full bg-pink-200"></span>
                    <span className="block w-4 h-4 mx-1 rounded-full bg-pink-300"></span>
                    <span className="block w-4 h-4 mx-1 rounded-full bg-gray-200"></span>
                    <span className="block w-4 h-4 mx-1 rounded-full bg-gray-200"></span>
                    <span className="block w-4 h-4 mx-1 rounded-full bg-gray-200"></span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p>疲劳</p>
                  <div className="flex">
                    <span className="block w-4 h-4 mx-1 rounded-full bg-pink-200"></span>
                    <span className="block w-4 h-4 mx-1 rounded-full bg-pink-300"></span>
                    <span className="block w-4 h-4 mx-1 rounded-full bg-pink-400"></span>
                    <span className="block w-4 h-4 mx-1 rounded-full bg-pink-500"></span>
                    <span className="block w-4 h-4 mx-1 rounded-full bg-gray-200"></span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="health" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>健康状态跟踪</CardTitle>
              <CardDescription>
                记录和监控您的整体健康状况
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center border-t pt-4">
              <p className="text-muted-foreground text-center">健康状态图表将在这里显示</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">添加今日记录</Button>
            </CardFooter>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>情绪记录</CardTitle>
              </CardHeader>
              <CardContent className="h-40 flex items-center justify-center border-t pt-4">
                <p className="text-muted-foreground text-center">情绪变化图将在这里显示</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>睡眠质量</CardTitle>
              </CardHeader>
              <CardContent className="h-40 flex items-center justify-center border-t pt-4">
                <p className="text-muted-foreground text-center">睡眠数据将在这里显示</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>能量水平</CardTitle>
              </CardHeader>
              <CardContent className="h-40 flex items-center justify-center border-t pt-4">
                <p className="text-muted-foreground text-center">能量水平数据将在这里显示</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="appointments" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">我的医疗预约</h2>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              新建预约
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>即将到来的预约</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">妇科检查</h3>
                    <p className="text-sm text-muted-foreground">妇科医院 - 张医生</p>
                  </div>
                  <div className="mt-2 sm:mt-0 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-pink-500" />
                    <span>2025年3月10日 10:00</span>
                  </div>
                  <div className="mt-2 sm:mt-0 flex space-x-2">
                    <Button variant="outline" size="sm">重新安排</Button>
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">取消</Button>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">心理咨询</h3>
                    <p className="text-sm text-muted-foreground">心理健康中心 - 李顾问</p>
                  </div>
                  <div className="mt-2 sm:mt-0 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-pink-500" />
                    <span>2025年3月25日 15:30</span>
                  </div>
                  <div className="mt-2 sm:mt-0 flex space-x-2">
                    <Button variant="outline" size="sm">重新安排</Button>
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">取消</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>历史预约记录</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-gray-50">
                  <div>
                    <h3 className="font-medium">年度体检</h3>
                    <p className="text-sm text-muted-foreground">市中心医院 - 王医生</p>
                  </div>
                  <div className="mt-2 sm:mt-0 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                    <span>2025年2月15日 09:00</span>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <Button variant="outline" size="sm">查看报告</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 