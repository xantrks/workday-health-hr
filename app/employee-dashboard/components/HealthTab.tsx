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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Health Status Tracking</CardTitle>
          <CardDescription>
            Track your sleep, stress, and overall health
          </CardDescription>
        </CardHeader>
        <CardContent className="h-96 flex items-center justify-center border-t pt-4">
          <p className="text-muted-foreground text-center">Health status tracking feature coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
} 