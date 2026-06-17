import type { RenewalFactor } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  data: RenewalFactor[];
}

export function RenewalFactors({ data }: Props) {
  const maxAbs = Math.max(...data.map((d) => Math.abs(d.impact)));
  return (
    <div className="space-y-4">
      {data.map((d) => {
        const positive = d.impact >= 0;
        const width = (Math.abs(d.impact) / maxAbs) * 100;
        return (
          <div key={d.factor}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-cream-200">{d.factor}</span>
              <span
                className={cn(
                  "text-xs font-mono",
                  positive ? "text-forest-300" : "text-coral-300",
                )}
              >
                {positive ? "+" : ""}{d.impact}
              </span>
            </div>
            <div className="relative h-2.5 rounded-full bg-ink-700 overflow-hidden">
              <div
                className={cn(
                  "absolute top-0 h-full rounded-full transition-all duration-700",
                  positive ? "left-1/2 bg-forest-400" : "right-1/2 bg-coral-300",
                )}
                style={{ width: `${width / 2}%` }}
              />
              <div className="absolute left-1/2 top-0 h-full w-px bg-cream-100/20" />
            </div>
            <p className="text-[10px] text-cream-400/70 mt-1">{d.description}</p>
          </div>
        );
      })}
    </div>
  );
}
