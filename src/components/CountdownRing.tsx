import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CountdownRingProps {
  deadline: string;
  size?: number;
  className?: string;
}

export function CountdownRing({ deadline, size = 120, className }: CountdownRingProps) {
  const [daysLeft, setDaysLeft] = useState(0);
  const [hoursLeft, setHoursLeft] = useState(0);

  useEffect(() => {
    const update = () => {
      const diff = new Date(deadline).getTime() - Date.now();
      if (diff <= 0) {
        setDaysLeft(0);
        setHoursLeft(0);
        return;
      }
      setDaysLeft(Math.floor(diff / (1000 * 60 * 60 * 24)));
      setHoursLeft(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [deadline]);

  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const totalWindow = 30;
  const elapsed = Math.min(totalWindow, Math.max(0, totalWindow - daysLeft));
  const progress = elapsed / totalWindow;
  const dashOffset = circumference * (1 - progress);
  const urgent = daysLeft <= 3;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(245,240,232,0.06)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={urgent ? "#FF6B5B" : "#E8B04B"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-1000"
          style={{ filter: urgent ? "drop-shadow(0 0 6px rgba(255,107,91,0.6))" : "drop-shadow(0 0 6px rgba(232,176,75,0.5))" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            "font-display text-3xl font-medium leading-none",
            urgent ? "text-coral-300" : "text-amber-300",
          )}
        >
          {daysLeft}
        </span>
        <span className="text-[10px] font-mono uppercase tracking-wider text-cream-400 mt-1">
          天 {hoursLeft} 时
        </span>
      </div>
    </div>
  );
}
