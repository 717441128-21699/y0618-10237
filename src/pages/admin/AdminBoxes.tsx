import { useState } from "react";
import { Plus, Pencil, Trash2, Calendar, Package, Layers, Eye, Lock, ArrowRight, AlertTriangle } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/Button";
import { BoxEditModal } from "@/components/admin/BoxEditModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useStore } from "@/store/useStore";
import type { BoxPeriod, BoxPeriodStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusMap: Record<BoxPeriodStatus, { label: string; cls: string }> = {
  preview: { label: "预告中", cls: "bg-amber-300/15 text-amber-300 border-amber-300/30" },
  shipping: { label: "发货中", cls: "bg-coral-300/15 text-coral-300 border-coral-300/30" },
  delivered: { label: "已送达", cls: "bg-forest-400/15 text-forest-300 border-forest-400/30" },
};

export default function AdminBoxes() {
  const products = useStore((s) => s.products);
  const boxPeriods = useStore((s) => s.boxPeriods);
  const deleteBoxPeriod = useStore((s) => s.deleteBoxPeriod);
  const updateBoxPeriod = useStore((s) => s.updateBoxPeriod);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BoxPeriod | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BoxPeriod | null>(null);
  const [statusTarget, setStatusTarget] = useState<{ period: BoxPeriod; next: BoxPeriodStatus } | null>(null);

  const sorted = [...boxPeriods].reverse();
  const productName = new Map(products.map((p) => [p.id, p.name]));

  const productLabel = (id: string) => productName.get(id) ?? `（已删除）${id.slice(0, 8)}`;

  return (
    <AdminLayout
      title="盲盒配置"
      action={
        <Button
          size="sm"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          新增期次
        </Button>
      }
    >
      <div className="space-y-4">
        {sorted.map((bp) => {
          const st = statusMap[bp.status];
          const deadline = new Date(bp.shipDeadline);
          const missingProducts = bp.products.filter((id) => !productName.has(id)).length;
          const missingAlts = bp.alternatives.filter((id) => !productName.has(id)).length;
          const hasMissing = missingProducts + missingAlts > 0;
          return (
            <div key={bp.id} className="card-surface rounded-2xl overflow-hidden">
              {hasMissing && (
                <div className="px-5 py-2 bg-coral-300/10 border-b border-coral-300/20 text-xs text-coral-300 flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  本期有 {missingProducts + missingAlts} 件商品已从商品池移除，建议尽快替换
                </div>
              )}
              <div className="grid md:grid-cols-[200px_1fr_auto]">
                {/* Mood image */}
                <div className="relative h-40 md:h-full min-h-[160px] overflow-hidden">
                  <img src={bp.themeMoodImage} alt="" className="w-full h-full object-cover opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 to-transparent" />
                  <span className={cn("absolute top-3 left-3 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border", st.cls)}>
                    {st.label}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="text-xs font-mono uppercase tracking-wider text-cream-400">{bp.periodLabel}</div>
                  <h3 className="font-display text-2xl text-cream-100 mt-1">{bp.theme}</h3>
                  <p className="text-sm text-cream-400 mt-2 line-clamp-2">{bp.themeDescription}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {bp.keywords.map((k) => (
                      <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-amber-300/10 text-amber-200 border border-amber-300/20">
                        {k}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-cream-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      截止 {deadline.toLocaleDateString("zh-CN")}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-amber-300" />
                      主选 {bp.products.length}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-coral-300" />
                      备选 {bp.alternatives.length}
                    </span>
                    {bp.status === "preview" && (
                      <span className="inline-flex items-center gap-1.5 text-amber-300">
                        <Lock className="w-3.5 h-3.5" />
                        商品清单保密
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col items-center justify-center gap-2 p-4 md:border-l border-cream-100/5">
                  <button
                    onClick={() => {
                      setEditing(bp);
                      setModalOpen(true);
                    }}
                    className="p-2.5 rounded-xl text-cream-400 hover:text-amber-300 hover:bg-amber-300/10 transition-colors"
                    title="编辑期次"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  {bp.status !== "delivered" && (
                    <button
                      onClick={() => {
                        const next = bp.status === "preview" ? "shipping" : "delivered";
                        setStatusTarget({ period: bp, next });
                      }}
                      className="p-2.5 rounded-xl text-cream-400 hover:text-forest-300 hover:bg-forest-400/10 transition-colors"
                      title={`转为${bp.status === "preview" ? "发货中" : "已送达"}`}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteTarget(bp)}
                    className="p-2.5 rounded-xl text-cream-400 hover:text-coral-300 hover:bg-coral-300/10 transition-colors"
                    title="删除期次"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Product chips preview */}
              <div className="px-5 pb-5">
                <div className="flex items-center gap-2 mb-2 text-xs font-mono uppercase tracking-wider text-cream-400">
                  <Eye className="w-3.5 h-3.5" /> 配置预览
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {bp.products.map((id) => {
                    const exists = productName.has(id);
                    return (
                      <span
                        key={id}
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full",
                          exists
                            ? "bg-amber-300/10 text-amber-200"
                            : "bg-coral-300/10 text-coral-300 border border-coral-300/30",
                        )}
                      >
                        {productLabel(id)}
                      </span>
                    );
                  })}
                  {bp.alternatives.map((id) => {
                    const exists = productName.has(id);
                    return (
                      <span
                        key={id}
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full border",
                          exists
                            ? "bg-coral-300/10 text-coral-200 border-coral-300/20"
                            : "bg-coral-300/10 text-coral-300 border-coral-300/50",
                        )}
                      >
                        备·{productLabel(id)}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <BoxEditModal open={modalOpen} onClose={() => setModalOpen(false)} editing={editing} />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteBoxPeriod(deleteTarget.id);
          setDeleteTarget(null);
        }}
        title="删除期次？"
        description={`「${deleteTarget?.theme}」及其配置将被移除，此操作不可撤销。`}
        confirmText="确认删除"
        variant="danger"
      />

      <ConfirmDialog
        open={!!statusTarget}
        onClose={() => setStatusTarget(null)}
        onConfirm={() => {
          if (statusTarget) {
            updateBoxPeriod(statusTarget.period.id, { status: statusTarget.next });
          }
          setStatusTarget(null);
        }}
        title={statusTarget ? `将「${statusTarget.period.theme}」转为${statusMap[statusTarget.next].label}？` : "切换状态"}
        description={
          statusTarget
            ? statusTarget.next === "shipping"
              ? "转为发货中后，用户将在主页看到配送状态，可准备开箱体验。"
              : "转为已送达后，用户可直接评价，也可先体验开箱。"
            : ""
        }
        confirmText="确认切换"
      />
    </AdminLayout>
  );
}
