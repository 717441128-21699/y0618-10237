import { useState, type KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChipInputProps {
  values: string[];
  onChange: (values: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  variant?: "allergen" | "item";
  className?: string;
}

export function ChipInput({
  values,
  onChange,
  suggestions = [],
  placeholder = "输入后回车",
  variant = "allergen",
  className,
}: ChipInputProps) {
  const [input, setInput] = useState("");

  const add = (val: string) => {
    const v = val.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setInput("");
  };

  const remove = (val: string) => onChange(values.filter((v) => v !== val));

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add(input);
    }
    if (e.key === "Backspace" && !input && values.length) {
      remove(values[values.length - 1]);
    }
  };

  const remaining = suggestions.filter((s) => !values.includes(s));

  return (
    <div className={className}>
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 rounded-2xl border px-3 py-2.5 min-h-[52px] transition-colors",
          variant === "allergen"
            ? "border-coral-300/30 focus-within:border-coral-300/60 bg-coral-300/[0.03]"
            : "border-cream-100/15 focus-within:border-amber-300/50 bg-amber-300/[0.02]",
        )}
      >
        {values.map((v) => (
          <span
            key={v}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium",
              variant === "allergen"
                ? "bg-coral-300/15 text-coral-200"
                : "bg-amber-300/10 text-amber-200",
            )}
          >
            {variant === "allergen" && "⚠ "}
            {v}
            <button
              type="button"
              onClick={() => remove(v)}
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder={values.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-cream-100 placeholder:text-cream-400/50"
        />
      </div>
      {remaining.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="text-xs text-cream-400/60 mr-1 self-center">快选：</span>
          {remaining.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-all hover:-translate-y-0.5",
                variant === "allergen"
                  ? "border-coral-300/30 text-coral-300/80 hover:border-coral-300/60"
                  : "border-cream-100/15 text-cream-400 hover:border-amber-300/50 hover:text-amber-200",
              )}
            >
              <Plus className="w-2.5 h-2.5" />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
