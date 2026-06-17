import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "flex items-center gap-3 mb-4",
            align === "center" && "justify-center",
          )}
        >
          <span className="h-px w-8 bg-amber-300/60" />
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-amber-300">
            {eyebrow}
          </span>
          <span className="h-px w-8 bg-amber-300/60" />
        </div>
      )}
      <h2 className="font-display text-4xl md:text-5xl font-medium leading-[1.05] tracking-tight text-cream-100">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base text-cream-400 leading-relaxed">{description}</p>
      )}
    </div>
  );
}
