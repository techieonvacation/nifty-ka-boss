import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border px-3 py-1 text-sm font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(270_50%_35%)] focus:ring-[hsl(var(--ring))]",
        secondary:
          "border-transparent bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(120_100%_20%)] focus:ring-[hsl(var(--secondary))]",
        destructive:
          "border-transparent bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] hover:bg-[hsl(0_100%_45%)] focus:ring-[hsl(var(--destructive))]",
        outline:
          "border-[hsl(var(--border))] bg-transparent text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] focus:ring-[hsl(var(--ring))]",
        success:
          "border-transparent bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(120_100%_20%)] focus:ring-[hsl(var(--accent))]",
        warning:
          "border-transparent bg-gradient-to-r from-[hsl(30_100%_50%)] to-[hsl(45_100%_50%)] text-[hsl(var(--foreground))] hover:from-[hsl(30_100%_45%)] hover:to-[hsl(45_100%_45%)] focus:ring-[hsl(30_100%_50%)]",
        premium:
          "border-transparent bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(300_50%_50%)] text-[hsl(var(--primary-foreground))] hover:from-[hsl(270_50%_35%)] hover:to-[hsl(300_50%_45%)] focus:ring-[hsl(var(--primary))] shadow-md",
        ghost:
          "border-transparent text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] focus:ring-[hsl(var(--muted))]",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-4 py-1.5 text-base",
      },
      rounded: {
        default: "rounded-[var(--radius)]",
        subtle: "rounded-sm",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      rounded: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

function Badge({
  className,
  variant,
  size,
  rounded,
  icon,
  children,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({ variant, size, rounded }),
        "group relative overflow-hidden font-[var(--font-poppins)]",
        className
      )}
      {...props}
    >
      <span className="absolute inset-0 bg-[hsl(var(--foreground))] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      {icon && <span className="mr-1.5 flex items-center">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </div>
  );
}

export { Badge, badgeVariants };
