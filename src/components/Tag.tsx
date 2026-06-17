import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TagProps {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  variant?: "preference" | "keyword" | "category" | "allergen";
  className?: string;
}

const variantStyles = {
  preference: (selected: boolean) =>
    selected
      ? "bg-amber-300 text-ink-900 border-amber-300 shadow-glow"
      : "border-cream-100/15 text-cream-200 hover:border-amber-300/50 hover:text-amber-200",
  keyword: () => "bg-amber-300/10 text-amber-200 border-amber-300/20",
  category: () => "bg-ink-700 text-cream-300 border-cream-100/10",
  allergen: () => "bg-coral-300/10 text-coral-200 border-coral-300/30",
};

export function Tag({ children, selected, onClick, variant = "preference", className }: TagProps) {
  const Comp = onClick ? "button" : "span";
  return (
    <Comp
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 cursor-pointer select-none",
        variantStyles[variant](!!selected),
        onClick && "hover:-translate-y-0.5 active:scale-95",
        className,
      )}
    >
      {children}
    </Comp>
  );
}
