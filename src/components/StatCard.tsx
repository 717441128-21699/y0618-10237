import type { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: ReactNode;
  unit?: string;
  trend?: number;
  trendLabel?: string;
  icon?: ReactNode;
  accent?: "amber" | "coral" | "cream";
  className?: string;
}

const accentMap = {
  amber: "text-amber-300",
  coral: "text-coral-300",
  cream: "text-cream-100",
};

export function StatCard({
  label,
  value,
  unit,
  trend,
  trendLabel,
  icon,
  accent = "amber",
  className,
}: StatCardProps) {
  const positive = (trend ?? 0) >= 0;
  return (
    <div className={cn("card-surface rounded-2xl p-5 relative overflow-hidden group", className)}>
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-amber-300/5 blur-2xl group-hover:bg-amber-300/10 transition-colors" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono uppercase tracking-wider text-cream-400">
            {label}
          </span>
          {icon && <span className={cn("opacity-70", accentMap[accent])}>{icon}</span>}
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className={cn("font-display text-4xl font-medium tracking-tight", accentMap[accent])}>
            {value}
          </span>
          {unit && <span className="text-sm text-cream-400">{unit}</span>}
        </div>
        {trend !== undefined && (
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium",
                positive
                  ? "bg-forest-400/15 text-forest-300"
                  : "bg-coral-300/15 text-coral-300",
              )}
            >
              {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {positive ? "+" : ""}
              {trend}%
            </span>
            {trendLabel && <span className="text-cream-400">{trendLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
