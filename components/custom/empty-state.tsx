import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  action,
  className,
  icon,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50",
        className
      )}
    >
      {icon && <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">{icon}</div>}
      <div className="mx-auto max-w-[420px] text-center">
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        )}
        {action && (
          <Button
            onClick={action.onClick}
            className="mx-auto mt-4"
            variant="outline"
          >
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
} 