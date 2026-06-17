import { Star, Tag as TagIcon } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Tag } from "./Tag";

interface ProductCardProps {
  product: Product;
  className?: string;
  footer?: React.ReactNode;
  compact?: boolean;
}

export function ProductCard({ product, className, footer, compact }: ProductCardProps) {
  return (
    <div
      className={cn(
        "card-surface rounded-2xl overflow-hidden group flex flex-col",
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-ink-800">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Tag variant="category">{product.category}</Tag>
        </div>
        <div className="absolute bottom-3 right-3 glass rounded-full px-2.5 py-1 flex items-center gap-1">
          <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
          <span className="text-xs font-mono text-cream-100">{product.avgRating}</span>
        </div>
      </div>
      <div className={cn("flex flex-col flex-1", compact ? "p-3" : "p-4")}>
        <h3 className={cn("font-display font-medium text-cream-100 leading-tight", compact ? "text-sm" : "text-base")}>
          {product.name}
        </h3>
        {!compact && (
          <p className="mt-2 text-xs text-cream-400 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {product.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-200/70 uppercase tracking-wider"
            >
              <TagIcon className="w-2.5 h-2.5" />
              {t}
            </span>
          ))}
        </div>
        {product.allergens.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {product.allergens.map((a) => (
              <span key={a} className="text-[10px] text-coral-300/80">
                ⚠ {a}
              </span>
            ))}
          </div>
        )}
        {footer && <div className="mt-auto pt-3">{footer}</div>}
      </div>
    </div>
  );
}
