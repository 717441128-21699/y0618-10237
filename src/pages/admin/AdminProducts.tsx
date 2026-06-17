import { useState, useMemo } from "react";
import { Plus, Search, Pencil, Trash2, Star, AlertTriangle } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/Button";
import { ProductEditModal } from "@/components/admin/ProductEditModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useStore } from "@/store/useStore";
import type { Product, ProductCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORIES: (ProductCategory | "全部")[] = ["全部", "运动", "美食", "美妆", "文创", "科技", "家居", "香氛", "户外"];

export default function AdminProducts() {
  const products = useStore((s) => s.products);
  const deleteProduct = useStore((s) => s.deleteProduct);

  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("全部");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = cat === "全部" || p.category === cat;
      return matchSearch && matchCat;
    });
  }, [products, search, cat]);

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (p: Product) => {
    setEditing(p);
    setModalOpen(true);
  };

  return (
    <AdminLayout
      title="商品池管理"
      action={
        <Button size="sm" onClick={openNew}>
          <Plus className="w-4 h-4" />
          新增商品
        </Button>
      }
    >
      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <MiniStat label="商品总数" value={products.length} />
        <MiniStat label="品类数" value={new Set(products.map((p) => p.category)).size} />
        <MiniStat label="含过敏标记" value={products.filter((p) => p.allergens.length).length} />
        <MiniStat label="平均好评" value={(products.reduce((s, p) => s + p.avgRating, 0) / products.length).toFixed(1)} />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索商品名称…"
            className="w-full rounded-xl border border-cream-100/10 bg-ink-850 pl-10 pr-4 py-2.5 text-sm text-cream-100 outline-none focus:border-amber-300/50"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                cat === c
                  ? "bg-amber-300 text-ink-900"
                  : "bg-ink-850 text-cream-400 hover:text-cream-100",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card-surface rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream-100/5 text-left">
                <th className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-cream-400">商品</th>
                <th className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-cream-400">品类</th>
                <th className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-cream-400">标签</th>
                <th className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-cream-400">过敏</th>
                <th className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-cream-400">评分</th>
                <th className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-cream-400 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-cream-100/[0.03] hover:bg-amber-300/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <div className="text-cream-100 font-medium">{p.name}</div>
                        <div className="text-xs text-cream-400 line-clamp-1 max-w-[220px]">{p.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-ink-700 text-cream-300">{p.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {p.tags.map((t) => (
                        <span key={t} className="text-[10px] text-amber-200/70">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {p.allergens.length ? (
                      <span className="inline-flex items-center gap-1 text-xs text-coral-300">
                        <AlertTriangle className="w-3 h-3" />
                        {p.allergens.length}
                      </span>
                    ) : (
                      <span className="text-xs text-cream-400/40">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-cream-200">
                      <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                      {p.avgRating}
                      <span className="text-xs text-cream-400">({p.reviewCount})</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-2 rounded-lg text-cream-400 hover:text-amber-300 hover:bg-amber-300/10 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="p-2 rounded-lg text-cream-400 hover:text-coral-300 hover:bg-coral-300/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-cream-400 text-sm">没有匹配的商品</div>
        )}
      </div>

      <ProductEditModal open={modalOpen} onClose={() => setModalOpen(false)} editing={editing} />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteProduct(deleteTarget.id);
          setDeleteTarget(null);
        }}
        title="删除商品？"
        description={`「${deleteTarget?.name}」将被从商品池移除，此操作不可撤销。`}
        confirmText="确认删除"
        variant="danger"
      />
    </AdminLayout>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card-surface rounded-2xl p-4">
      <div className="text-xs font-mono uppercase tracking-wider text-cream-400">{label}</div>
      <div className="font-display text-2xl text-amber-300 mt-1">{value}</div>
    </div>
  );
}
