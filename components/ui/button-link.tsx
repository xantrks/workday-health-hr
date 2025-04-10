import Link from "next/link";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonLinkProps extends ButtonProps {
  href: string;
  children: React.ReactNode;
}

export function ButtonLink({
  href,
  children,
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonLinkProps) {
  return (
    <Link href={href} passHref>
      <Button
        variant={variant}
        size={size}
        className={cn(className)}
        {...props}
      >
        {children}
      </Button>
    </Link>
  );
} 