import { useState, useEffect } from "react";
import { Check, Search } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "@/components/Button";
import { ChipInput } from "@/components/ChipInput";
import { useStore } from "@/store/useStore";
import type { BoxPeriod, BoxPeriodStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  editing: BoxPeriod | null;
}

const STATUSES: { value: BoxPeriodStatus; label: string }[] = [
  { value: "preview", label: "预告中" },
  { value: "shipping", label: "发货中" },
  { value: "delivered", label: "已送达" },
];

export function BoxEditModal({ open, onClose, editing }: Props) {
  const products = useStore((s) => s.products);
  const createBoxPeriod = useStore((s) => s.createBoxPeriod);
  const updateBoxPeriod = useStore((s) => s.updateBoxPeriod);

  const [periodLabel, setPeriodLabel] = useState("");
  const [theme, setTheme] = useState("");
  const [themeDescription, setThemeDescription] = useState("");
  const [themeMoodImage, setThemeMoodImage] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [productsSel, setProductsSel] = useState<string[]>([]);
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [shipDeadline, setShipDeadline] = useState("");
  const [status, setStatus] = useState<BoxPeriodStatus>("preview");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (editing) {
      setPeriodLabel(editing.periodLabel);
      setTheme(editing.theme);
      setThemeDescription(editing.themeDescription);
      setThemeMoodImage(editing.themeMoodImage);
      setKeywords(editing.keywords);
      setProductsSel(editing.products);
      setAlternatives(editing.alternatives);
      setShipDeadline(editing.shipDeadline.slice(0, 16));
      setStatus(editing.status);
    } else {
      setPeriodLabel("");
      setTheme("");
      setThemeDescription("");
      setThemeMoodImage("");
      setKeywords([]);
      setProductsSel([]);
      setAlternatives([]);
      setShipDeadline("");
      setStatus("preview");
    }
    setSearch("");
  }, [editing, open]);

  const toggleMain = (id: string) => {
    if (productsSel.includes(id)) {
      setProductsSel(productsSel.filter((x) => x !== id));
    } else {
      setProductsSel([...productsSel, id]);
      setAlternatives(alternatives.filter((x) => x !== id));
    }
  };

  const toggleAlt = (id: string) => {
    if (alternatives.includes(id)) {
      setAlternatives(alternatives.filter((x) => x !== id));
    } else {
      setAlternatives([...alternatives, id]);
      setProductsSel(productsSel.filter((x) => x !== id));
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const save = () => {
    if (!theme.trim() || !shipDeadline) return;
    const mood =
      themeMoodImage ||
      `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
        `${theme} moodboard dark editorial aesthetic`,
      )}&image_size=portrait_16_9`;
    const uniqProducts = Array.from(new Set(productsSel));
    const uniqAlternatives = Array.from(
      new Set(alternatives.filter((a) => !uniqProducts.includes(a))),
    );
    const payload = {
      periodLabel: periodLabel || `${theme}期`,
      theme,
      themeDescription,
      themeMoodImage: mood,
      keywords,
      products: uniqProducts,
      alternatives: uniqAlternatives,
      shipDeadline: new Date(shipDeadline).toISOString(),
      status,
    };
    if (editing) updateBoxPeriod(editing.id, payload);
    else createBoxPeriod(payload);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "编辑期次" : "新增期次"}
      description="配置主题、商品组合与发货截止日期"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>取消</Button>
          <Button onClick={save} disabled={!theme.trim() || !shipDeadline}>保存期次</Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs font-mono uppercase tracking-wider text-cream-400 mb-2 block">期次名称</span>
            <input
              value={periodLabel}
              onChange={(e) => setPeriodLabel(e.target.value)}
              placeholder="如：2026年7月期"
              className="w-full rounded-xl border border-cream-100/15 bg-ink-800 px-4 py-2.5 text-sm text-cream-100 outline-none focus:border-amber-300/60"
            />
          </label>
          <label className="block">
            <span className="text-xs font-mono uppercase tracking-wider text-cream-400 mb-2 block">发货截止日期</span>
            <input
              type="datetime-local"
              value={shipDeadline}
              onChange={(e) => setShipDeadline(e.target.value)}
              className="w-full rounded-xl border border-cream-100/15 bg-ink-800 px-4 py-2.5 text-sm text-cream-100 outline-none focus:border-amber-300/60"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-xs font-mono uppercase tracking-wider text-cream-400 mb-2 block">主题名称</span>
          <input
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="如：仲夏夜之谜"
            className="w-full rounded-xl border border-cream-100/15 bg-ink-800 px-4 py-2.5 text-sm text-cream-100 outline-none focus:border-amber-300/60"
          />
        </label>

        <label className="block">
          <span className="text-xs font-mono uppercase tracking-wider text-cream-400 mb-2 block">主题描述</span>
          <textarea
            value={themeDescription}
            onChange={(e) => setThemeDescription(e.target.value)}
            placeholder="本期氛围与叙事…"
            rows={2}
            className="w-full rounded-xl border border-cream-100/15 bg-ink-800 px-4 py-2.5 text-sm text-cream-100 outline-none focus:border-amber-300/60 resize-none"
          />
        </label>

        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-300 mb-2 block">预告关键词（不剧透商品）</span>
          <ChipInput values={keywords} onChange={setKeywords} placeholder="输入关键词，回车添加" variant="item" />
        </div>

        <div className="flex items-center gap-2">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatus(s.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                status === s.value ? "bg-amber-300 text-ink-900" : "bg-ink-800 text-cream-400",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Product picker */}
        <div className="rounded-2xl border border-cream-100/10 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-cream-100/5 bg-ink-850">
            <span className="text-xs font-mono uppercase tracking-wider text-cream-400">商品池选品</span>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-amber-300">主选 {productsSel.length}</span>
              <span className="text-coral-300">备选 {alternatives.length}</span>
            </div>
          </div>
          <div className="p-3">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索商品…"
                className="w-full rounded-lg border border-cream-100/10 bg-ink-800 pl-9 pr-3 py-2 text-sm text-cream-100 outline-none focus:border-amber-300/50"
              />
            </div>
            <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
              {filteredProducts.map((p) => {
                const isMain = productsSel.includes(p.id);
                const isAlt = alternatives.includes(p.id);
                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-cream-100/5 transition-colors"
                  >
                    <img src={p.image} alt="" className="w-9 h-9 rounded-md object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-cream-100 truncate">{p.name}</div>
                      <div className="text-xs text-cream-400">{p.category} · {p.tags.join("/")}</div>
                    </div>
                    <button
                      onClick={() => toggleMain(p.id)}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all",
                        isMain ? "bg-amber-300 text-ink-900" : "border border-amber-300/30 text-amber-300/70 hover:border-amber-300",
                      )}
                    >
                      {isMain ? <Check className="w-3 h-3 inline" /> : null} 主选
                    </button>
                    <button
                      onClick={() => toggleAlt(p.id)}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all",
                        isAlt ? "bg-coral-300 text-ink-900" : "border border-coral-300/30 text-coral-300/70 hover:border-coral-300",
                      )}
                    >
                      {isAlt ? <Check className="w-3 h-3 inline" /> : null} 备选
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
