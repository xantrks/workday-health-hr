import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AppointmentsTabProps {
  userId: string;
}

export function AppointmentsTab({ userId }: AppointmentsTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>医疗预约</CardTitle>
          <CardDescription>
            管理您的医疗预约
          </CardDescription>
        </CardHeader>
        <CardContent className="h-96 flex items-center justify-center border-t pt-4">
          <p className="text-muted-foreground text-center">医疗预约功能即将推出</p>
        </CardContent>
      </Card>
    </div>
  );
} 