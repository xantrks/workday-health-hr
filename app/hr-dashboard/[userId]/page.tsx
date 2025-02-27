'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  BarChart3, 
  Calendar, 
  Users, 
  TrendingUp, 
  MessageSquare,
  Calendar as CalendarIcon,
  PieChart,
  FileBarChart
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HRDashboard({ params }: { params: { userId: string } }) {
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
      router.replace(`/hr-dashboard/${session.user.id}`);
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
          <h1 className="text-3xl font-bold text-primary">HR健康管理仪表盘</h1>
          <p className="text-muted-foreground mt-1">欢迎回来, {session.user.name}</p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700"
          onClick={() => router.push(`/chat/new?userId=${params.userId}&role=hr`)}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          咨询 Sani 助手
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">总览</TabsTrigger>
          <TabsTrigger value="leave">请假分析</TabsTrigger>
          <TabsTrigger value="workforce">劳动力调度</TabsTrigger>
          <TabsTrigger value="health">健康趋势</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">员工总数</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">152</div>
                <p className="text-xs text-muted-foreground">较上月增加3人</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">本月请假率</CardTitle>
                <Calendar className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.8%</div>
                <p className="text-xs text-muted-foreground">较上月下降0.5%</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">健康满意度</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-muted-foreground">较上季度增加3%</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">今日缺勤</CardTitle>
                <BarChart3 className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5人</div>
                <p className="text-xs text-muted-foreground">3.3%的员工缺勤</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>员工健康趋势</CardTitle>
                <CardDescription>各部门员工健康数据匿名汇总</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center border-t pt-4">
                <p className="text-muted-foreground text-center">趋势图表将在这里显示</p>
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
                      <p className="text-sm font-medium">请假高峰期提醒</p>
                      <p className="text-sm text-muted-foreground">
                        下周四预计将有7人请假，可能需要调整人力安排
                      </p>
                    </div>
                    <CalendarIcon className="h-5 w-5 text-blue-500" />
                  </div>
                  
                  <div className="flex items-start gap-4 rounded-lg border p-3">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">季度健康报告</p>
                      <p className="text-sm text-muted-foreground">
                        第一季度健康满意度调查结果已出，满意度提升3%
                      </p>
                    </div>
                    <FileBarChart className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="leave" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>请假分析</CardTitle>
              <CardDescription>
                匿名化的员工请假数据分析和趋势预测
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center border-t pt-4">
              <p className="text-muted-foreground text-center">请假数据图表将在这里显示</p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>请假类型分布</CardTitle>
              </CardHeader>
              <CardContent className="h-60 flex items-center justify-center border-t pt-4">
                <p className="text-muted-foreground text-center">请假类型饼图将在这里显示</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>请假预测</CardTitle>
              </CardHeader>
              <CardContent className="h-60 flex items-center justify-center border-t pt-4">
                <p className="text-muted-foreground text-center">未来30天请假预测将在这里显示</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>请假管理政策建议</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">弹性工作安排</h3>
                  <p className="text-sm text-muted-foreground">
                    数据显示35%的女性员工在经期前后有轻微不适。建议考虑在这些时期提供弹性工作时间或远程工作选项，预计可减少15%的短期请假。
                  </p>
                </div>
                
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">健康关怀日</h3>
                  <p className="text-sm text-muted-foreground">
                    建议每季度设立一天作为"女性健康关怀日"，允许女性员工进行常规体检和健康咨询，预计可减少22%的临时请假。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="workforce" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>劳动力智能调度</CardTitle>
              <CardDescription>
                基于健康数据的劳动力优化建议
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center border-t pt-4">
              <p className="text-muted-foreground text-center">劳动力分布图将在这里显示</p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>部门工作量预测</CardTitle>
              </CardHeader>
              <CardContent className="h-60 flex items-center justify-center border-t pt-4">
                <p className="text-muted-foreground text-center">工作量预测图表将在这里显示</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>人力资源优化建议</CardTitle>
              </CardHeader>
              <CardContent className="h-60">
                <div className="space-y-4 mt-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">市场部</h3>
                      <p className="text-sm text-muted-foreground">下周工作量预计增加22%</p>
                    </div>
                    <Button size="sm">临时增援</Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">客户服务部</h3>
                      <p className="text-sm text-muted-foreground">明天预计有2位员工请假</p>
                    </div>
                    <Button size="sm">重新分配</Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">研发部</h3>
                      <p className="text-sm text-muted-foreground">本周工作量低于平均水平15%</p>
                    </div>
                    <Button size="sm">调整任务</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="health" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>健康数据统计与趋势</CardTitle>
              <CardDescription>匿名化的员工健康数据分析</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center border-t pt-4">
              <p className="text-muted-foreground text-center">健康趋势图表将在这里显示</p>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">注意：所有数据均已匿名化，无法识别个人身份</p>
            </CardFooter>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">压力水平</CardTitle>
                <BarChart3 className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">中等</div>
                <p className="text-xs text-muted-foreground">组织平均水平</p>
                <div className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">女性健康关怀满意度</CardTitle>
                <PieChart className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">满意或非常满意</p>
                <div className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">健康计划参与率</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">较上季度增加12%</p>
                <div className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>健康计划有效性分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">女性健康讲座</h3>
                    <p className="text-sm text-muted-foreground">参与率: 68% | 满意度: 91%</p>
                  </div>
                  <Button variant="outline">查看详情</Button>
                </div>
                
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">经期健康管理课程</h3>
                    <p className="text-sm text-muted-foreground">参与率: 72% | 满意度: 94%</p>
                  </div>
                  <Button variant="outline">查看详情</Button>
                </div>
                
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">工作与生活平衡工作坊</h3>
                    <p className="text-sm text-muted-foreground">参与率: 85% | 满意度: 89%</p>
                  </div>
                  <Button variant="outline">查看详情</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 