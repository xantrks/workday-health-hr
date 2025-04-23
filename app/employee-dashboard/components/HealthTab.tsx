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

/**
 * HealthTab component for health status tracking
 * Enhanced for mobile responsiveness
 */
export function HealthTab({ userId }: HealthTabProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <Card>
        <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-2 sm:pb-3">
          <CardTitle className="text-base sm:text-lg">Health Status Tracking</CardTitle>
          <CardDescription className="text-xs sm:text-sm mt-1">
            Track your sleep, stress, and overall health
          </CardDescription>
        </CardHeader>
        <CardContent className="h-64 sm:h-96 flex items-center justify-center border-t pt-3 sm:pt-4 px-3 sm:px-6">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">Health status tracking feature coming soon</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground/70">You&apos;ll be able to track your health metrics and see trends over time</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 