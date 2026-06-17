import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "coral";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-amber-300 text-ink-900 hover:bg-amber-200 shadow-glow hover:shadow-glow hover:-translate-y-0.5",
  secondary:
    "border border-cream-100/20 text-cream-100 hover:border-amber-300/60 hover:text-amber-300 hover:bg-amber-300/5",
  ghost: "text-cream-300 hover:text-cream-100 hover:bg-cream-100/5",
  danger:
    "border border-coral-300/50 text-coral-300 hover:bg-coral-300/10 hover:border-coral-300",
  coral:
    "bg-coral-300 text-ink-900 hover:bg-coral-200 shadow-glow-coral hover:-translate-y-0.5",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-sans font-semibold tracking-wide transition-all duration-300 active:translate-y-0 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none cursor-pointer",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
