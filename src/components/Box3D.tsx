import { cn } from "@/lib/utils";

interface Box3DProps {
  className?: string;
  size?: number;
  floating?: boolean;
}

export function Box3D({ className, size = 280, floating = true }: Box3DProps) {
  const s = size;
  const depth = s * 0.18;
  return (
    <div
      className={cn("relative", floating && "animate-float", className)}
      style={{ width: s, height: s + depth }}
    >
      <div
        className="absolute inset-0 perspective-1000 preserve-3d"
        style={{ transform: "rotateX(-18deg) rotateY(-28deg)" }}
      >
        {/* Box body */}
        <div
          className="absolute preserve-3d"
          style={{
            width: s,
            height: s * 0.7,
            transform: `translateZ(${depth / 2}px)`,
          }}
        >
          {/* Front face */}
          <div
            className="absolute inset-0 rounded-md overflow-hidden"
            style={{
              background: "linear-gradient(150deg, #1B1714 0%, #0E0D0C 100%)",
              border: "1px solid rgba(232,176,75,0.25)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <span className="font-display text-amber-300 text-4xl">?</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cream-400">
                Mystery
              </span>
            </div>
            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-amber-300/10 to-transparent" />
            <div className="absolute -left-2 top-1/2 w-4 h-2/3 bg-gradient-to-r from-transparent to-amber-300/5 skew-y-12" />
          </div>
          {/* Top face (lid) */}
          <div
            className="absolute inset-x-0 top-0 rounded-t-md"
            style={{
              height: depth,
              background: "linear-gradient(180deg, #272019 0%, #1B1714 100%)",
              border: "1px solid rgba(232,176,75,0.3)",
              transform: `rotateX(90deg) translateZ(${depth / 2}px)`,
              transformOrigin: "top",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-8 h-1 rounded-full bg-amber-300/40" />
            </div>
          </div>
          {/* Right face */}
          <div
            className="absolute inset-y-0 right-0"
            style={{
              width: depth,
              background: "linear-gradient(90deg, #14110F 0%, #070605 100%)",
              border: "1px solid rgba(232,176,75,0.15)",
              transform: `rotateY(90deg) translateZ(${depth / 2}px)`,
              transformOrigin: "right",
            }}
          />
        </div>
      </div>

      {/* Glow base */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-full blur-2xl bg-amber-300/20 animate-pulse-glow"
        style={{
          width: s * 0.8,
          height: s * 0.15,
          bottom: -depth,
        }}
      />
    </div>
  );
}
