import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  withText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { box: "w-7 h-7", text: "text-lg" },
  md: { box: "w-9 h-9", text: "text-xl" },
  lg: { box: "w-12 h-12", text: "text-2xl" },
};

export function Logo({ size = "md", withText = true, className }: LogoProps) {
  const s = sizeMap[size];
  return (
    <Link to="/" className={cn("flex items-center gap-2.5 group", className)}>
      <span
        className={cn(
          "relative inline-flex items-center justify-center rounded-md overflow-hidden",
          s.box,
        )}
      >
        <span className="absolute inset-0 bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600" />
        <span className="absolute inset-[2px] rounded-[5px] bg-ink-900" />
        <span className="absolute inset-0 bg-[linear-gradient(45deg,transparent_46%,rgba(232,176,75,0.5)_48%,rgba(232,176,75,0.5)_52%,transparent_54%)] group-hover:translate-x-1 transition-transform duration-500" />
        <span className="relative w-2.5 h-2.5 rounded-sm bg-amber-300 group-hover:rotate-45 transition-transform duration-500" />
      </span>
      {withText && (
        <span className={cn("font-display font-medium tracking-tight text-cream-100", s.text)}>
          盲选盒子
        </span>
      )}
    </Link>
  );
}
