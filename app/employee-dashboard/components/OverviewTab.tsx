import {
  Activity, 
  Calendar as CalendarIcon,
  Clock, 
  Heart
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface OverviewTabProps {
  userId: string;
  userName: string;
}

export function OverviewTab({ userId, userName }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">下次经期预测</CardTitle>
            <CalendarIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3月 15日</div>
            <p className="text-xs text-muted-foreground">距今7天</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">情绪状态</CardTitle>
            <Heart className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">良好</div>
            <p className="text-xs text-muted-foreground">最近7天平均</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">即将到来的预约</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">3月10日 - 妇科检查</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">健康活动</CardTitle>
            <Activity className="h-4 w-4 text-accent" />
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
            <CardTitle>月度健康概览</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center border-t pt-4">
            <p className="text-muted-foreground text-center">健康数据图表将显示在这里</p>
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
                    您的下一次经期预计将在7天后开始
                  </p>
                </div>
                <CalendarIcon className="h-5 w-5 text-primary" />
              </div>
              
              <div className="flex items-start gap-4 rounded-lg border p-3">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">预约确认</p>
                  <p className="text-sm text-muted-foreground">
                    您的妇科检查预约已确认
                  </p>
                </div>
                <Clock className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 