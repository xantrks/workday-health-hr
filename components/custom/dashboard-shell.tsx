interface DashboardShellProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardShell({
  children,
  className,
}: DashboardShellProps) {
  return (
    <div className="grid items-start gap-8 p-4 md:p-8">
      {children}
    </div>
  );
} 