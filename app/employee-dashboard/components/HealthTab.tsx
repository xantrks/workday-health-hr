import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface HealthTabProps {
  userId: string;
}

export function HealthTab({ userId }: HealthTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>健康状态跟踪</CardTitle>
          <CardDescription>
            跟踪您的睡眠、压力和整体健康状况
          </CardDescription>
        </CardHeader>
        <CardContent className="h-96 flex items-center justify-center border-t pt-4">
          <p className="text-muted-foreground text-center">健康状态跟踪功能即将推出</p>
        </CardContent>
      </Card>
    </div>
  );
} 