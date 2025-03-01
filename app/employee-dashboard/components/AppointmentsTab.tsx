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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Medical Appointments</CardTitle>
          <CardDescription>
            Manage your medical appointments
          </CardDescription>
        </CardHeader>
        <CardContent className="h-96 flex items-center justify-center border-t pt-4">
          <p className="text-muted-foreground text-center">Medical appointments feature coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
} 