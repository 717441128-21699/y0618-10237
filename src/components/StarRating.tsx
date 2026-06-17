import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  max?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

export function StarRating({
  value,
  max = 5,
  size = 20,
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.round(value);
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(i + 1)}
            className={cn(
              "transition-transform",
              interactive && "hover:scale-125 cursor-pointer",
            )}
          >
            <Star
              style={{ width: size, height: size }}
              className={cn(
                filled
                  ? "fill-amber-300 text-amber-300"
                  : "fill-transparent text-cream-400/40",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
