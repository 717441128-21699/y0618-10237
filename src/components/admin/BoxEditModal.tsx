import { useState, useEffect, useMemo, Fragment } from "react";
import { Check, Search, AlertTriangle, ShieldAlert, Package, TrendingUp, Plus, X, Zap } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "@/components/Button";
import { ChipInput } from "@/components/ChipInput";
import { useStore } from "@/store/useStore";
import type { BoxPeriod, BoxPeriodStatus, Product } from "@/lib/types";
import { COMMON_ALLERGENS } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ConfirmDialog";

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
  const [confirmSave, setConfirmSave] = useState(false);
  const [restockList, setRestockList] = useState<string[]>([]);
  const [showRestock, setShowRestock] = useState(false);

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

  const healthCheck = useMemo(() => {
    const productMap = new Map(products.map((p) => [p.id, p]));
    const selectedProducts = productsSel.map((id) => productMap.get(id)!).filter(Boolean);
    const altProducts = alternatives.map((id) => productMap.get(id)!).filter(Boolean);
    const allProducts = [...selectedProducts, ...altProducts];

    const allergenConflicts: { product: Product; allergen: string }[] = [];
    allProducts.forEach((p) => {
      p.allergens.forEach((a) => {
        if (COMMON_ALLERGENS.includes(a)) {
          allergenConflicts.push({ product: p, allergen: a });
        }
      });
    });

    const safeCount = allProducts.filter((p) => p.allergens.length === 0).length;
    const needs3 = selectedProducts.length >= 3;
    const matchableEstimate = Math.max(0, selectedProducts.length - Math.ceil(allergenConflicts.length / 2));
    const lowMatchRisk = matchableEstimate < 3;

    return {
      mainCount: selectedProducts.length,
      altCount: altProducts.length,
      totalUnique: allProducts.length,
      allergenConflicts,
      safeCount,
      needs3,
      matchableEstimate,
      lowMatchRisk,
      canSave: needs3 && !lowMatchRisk,
    };
  }, [productsSel, alternatives, products]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const trySave = () => {
    if (!theme.trim() || !shipDeadline) return;
    if (!healthCheck.needs3 || healthCheck.lowMatchRisk) {
      setConfirmSave(true);
    } else {
      doSave();
    }
  };

  const doSave = () => {
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
    <Fragment>
      <Modal
      open={open}
      onClose={onClose}
      title={editing ? "编辑期次" : "新增期次"}
      description="配置主题、商品组合与发货截止日期"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>取消</Button>
          <Button
            onClick={trySave}
            disabled={!theme.trim() || !shipDeadline}
            variant={healthCheck.canSave ? "primary" : "coral"}
          >
            {healthCheck.canSave ? "保存期次" : healthCheck.lowMatchRisk ? "强制保存（有风险）" : "强制保存（不足3件）"}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Health check panel */}
        <div className={cn(
          "rounded-2xl p-4 border",
          healthCheck.canSave
            ? "bg-forest-400/5 border-forest-400/20"
            : "bg-coral-300/5 border-coral-300/20",
        )}>
          <div className="flex items-center gap-2 mb-3">
            {healthCheck.canSave
              ? <TrendingUp className="w-4 h-4 text-forest-300" />
              : <AlertTriangle className="w-4 h-4 text-coral-300" />}
            <span className="text-xs font-mono uppercase tracking-wider text-cream-200">期次健康检查</span>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="bg-ink-800/60 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-amber-300 mb-1">
                <Package className="w-3 h-3" /> 主选
              </div>
              <div className={cn(
                "text-2xl font-display font-mono",
                healthCheck.mainCount >= 3 ? "text-forest-300" : "text-coral-300",
              )}>
                {healthCheck.mainCount}
              </div>
              <div className="text-[10px] text-cream-400">需 ≥ 3 件</div>
            </div>
            <div className="bg-ink-800/60 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-coral-300 mb-1">
                <Package className="w-3 h-3" /> 备选
              </div>
              <div className="text-2xl font-display font-mono text-cream-200">
                {healthCheck.altCount}
              </div>
              <div className="text-[10px] text-cream-400">替补品</div>
            </div>
            <div className="bg-ink-800/60 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-cream-300 mb-1">
                <TrendingUp className="w-3 h-3" /> 预计可匹配
              </div>
              <div className={cn(
                "text-2xl font-display font-mono",
                healthCheck.matchableEstimate >= 3 ? "text-forest-300" : "text-coral-300",
              )}>
                {healthCheck.matchableEstimate}
              </div>
              <div className="text-[10px] text-cream-400">需 ≥ 3 件</div>
            </div>
          </div>
          {healthCheck.allergenConflicts.length > 0 && (
            <div className="pt-3 border-t border-cream-100/5">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-coral-300 mb-2">
                <ShieldAlert className="w-3 h-3" /> 潜在禁忌冲突 ({healthCheck.allergenConflicts.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {healthCheck.allergenConflicts.slice(0, 6).map((c, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-coral-300/10 text-coral-200 border border-coral-300/20">
                    {c.product.name} · {c.allergen}
                  </span>
                ))}
                {healthCheck.allergenConflicts.length > 6 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full text-cream-400">
                    +{healthCheck.allergenConflicts.length - 6} 项
                  </span>
                )}
              </div>
            </div>
          )}
          {!healthCheck.needs3 && (
            <div className="pt-3 border-t border-cream-100/5 text-xs text-coral-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              主选商品不足 3 件，可能导致用户收到的盲盒件数不够。
            </div>
          )}
          {healthCheck.lowMatchRisk && healthCheck.needs3 && (
            <div className="pt-3 border-t border-cream-100/5 text-xs text-coral-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              部分用户可能因过敏或已有物品导致可匹配数量不足 3 件。建议增加无禁忌商品或减少过敏原。
            </div>
          )}

          {!healthCheck.canSave && (
            <div className="pt-3 border-t border-cream-100/5 mt-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-amber-300">
                  <Zap className="w-3 h-3" /> 补货队列
                </div>
                <button
                  onClick={() => {
                    const needed = Math.max(0, 3 - healthCheck.mainCount);
                    const usedIds = new Set([...productsSel, ...alternatives]);
                    const available = products.filter((p) => !usedIds.has(p.id));
                    const safeProducts = available.filter((p) => p.allergens.length === 0);
                    const candidates = safeProducts.length > 0 ? safeProducts : available;
                    const picks = candidates.slice(0, needed + 2).map((p) => p.id);
                    setRestockList(picks);
                    setShowRestock(true);
                  }}
                  className="text-[10px] px-2 py-1 rounded-full bg-amber-300/10 text-amber-300 hover:bg-amber-300/20 transition-colors"
                >
                  一键生成补货清单
                </button>
              </div>
              <div className="text-[10px] text-cream-400 mb-2">
                缺口：还需 {Math.max(0, 3 - healthCheck.mainCount)} 件主选商品
              </div>

              {showRestock && restockList.length > 0 && (
                <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                  {restockList.map((pid) => {
                    const p = products.find((x) => x.id === pid);
                    if (!p) return null;
                    const inMain = productsSel.includes(pid);
                    const inAlt = alternatives.includes(pid);
                    return (
                      <div key={pid} className="flex items-center gap-2 bg-ink-800/70 rounded-xl p-2">
                        <img src={p.image} alt="" className="w-8 h-8 rounded-md object-cover" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-cream-200 truncate">{p.name}</div>
                          <div className="text-[10px] text-cream-400">
                            {p.category} · {p.tags.join("/")}
                            {p.allergens.length > 0 && <span className="text-coral-300 ml-1">⚠ 含{p.allergens.join(",")}</span>}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              if (!inMain) {
                                setProductsSel([...productsSel, pid]);
                                setAlternatives(alternatives.filter((x) => x !== pid));
                              }
                            }}
                            disabled={inMain}
                            className={cn(
                              "px-2 py-1 rounded-lg text-[10px] font-mono uppercase transition-colors",
                              inMain
                                ? "bg-amber-300 text-ink-900"
                                : "bg-ink-700 text-amber-300 hover:bg-amber-300/20",
                            )}
                          >
                            {inMain ? <Check className="w-3 h-3 inline" /> : "+ 主选"}
                          </button>
                          <button
                            onClick={() => {
                              if (!inAlt) {
                                setAlternatives([...alternatives, pid]);
                                setProductsSel(productsSel.filter((x) => x !== pid));
                              }
                            }}
                            disabled={inAlt}
                            className={cn(
                              "px-2 py-1 rounded-lg text-[10px] font-mono uppercase transition-colors",
                              inAlt
                                ? "bg-coral-300 text-ink-900"
                                : "bg-ink-700 text-coral-300 hover:bg-coral-300/20",
                            )}
                          >
                            {inAlt ? <Check className="w-3 h-3 inline" /> : "+ 备选"}
                          </button>
                          <button
                            onClick={() => setRestockList(restockList.filter((x) => x !== pid))}
                            className="p-1 rounded-lg text-cream-400 hover:bg-cream-100/10 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {showRestock && restockList.length === 0 && (
                <div className="mt-3 text-center py-4 text-xs text-cream-400">
                  商品池已无可用商品，请先添加新商品
                </div>
              )}
            </div>
          )}
        </div>
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

    <ConfirmDialog
      open={confirmSave}
      onClose={() => setConfirmSave(false)}
      onConfirm={() => {
        doSave();
        setConfirmSave(false);
      }}
      title={!healthCheck.needs3 ? "主选商品不足 3 件" : "可匹配数量不足风险"}
      description={
        !healthCheck.needs3
          ? "当前主选商品仅 " + healthCheck.mainCount + " 件，部分用户可能收到不足 3 件的盲盒。建议补充商品后再保存。"
          : "预估可匹配数量仅 " + healthCheck.matchableEstimate + " 件，有 " + healthCheck.allergenConflicts.length + " 项潜在禁忌冲突。部分用户可能因过敏或已有物品导致可匹配数量不足。"
      }
      confirmText="确认强制保存"
      variant="danger"
    />
    </Fragment>
  );
}
