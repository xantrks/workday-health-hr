import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "same";
  trendValue?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-4">
        <CardTitle className="text-xs sm:text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-4">
        <div className="text-xl sm:text-2xl font-bold">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        <div className="flex items-center space-x-2 mt-0.5 sm:mt-1">
          {trend && (
            <span
              className={cn(
                "flex items-center text-[10px] sm:text-xs",
                trend === "up"
                  ? "text-green-500"
                  : trend === "down"
                  ? "text-red-500"
                  : "text-gray-500"
              )}
            >
              {trend === "up" ? (
                <ArrowUpIcon className="mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3" />
              ) : trend === "down" ? (
                <ArrowDownIcon className="mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3" />
              ) : (
                <ArrowRightIcon className="mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3" />
              )}
              {trendValue}
            </span>
          )}
          {description && (
            <p className="text-[10px] sm:text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 