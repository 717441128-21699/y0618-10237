import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles, ArrowRight, RotateCcw, Tag as TagIcon, ShieldAlert, AlertTriangle, Package } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/Button";
import { Tag } from "@/components/Tag";
import { useStore } from "@/store/useStore";
import { getProductMap } from "@/lib/engine";
import type { Product } from "@/lib/types";

export default function Unbox() {
  const { periodId } = useParams();
  const navigate = useNavigate();
  const boxPeriods = useStore((s) => s.boxPeriods);
  const products = useStore((s) => s.products);
  const currentUser = useStore((s) => s.currentUser);
  const matchForUser = useStore((s) => s.matchForUser);
  const markUnboxed = useStore((s) => s.markUnboxed);

  const period = boxPeriods.find((b) => b.id === periodId);
  const [opened, setOpened] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);

  if (!period) {
    return (
      <div className="min-h-screen grain-overlay">
        <Navbar />
        <div className="container pt-40 text-center">
          <p className="text-cream-400">未找到该期次。</p>
          <Link to="/dashboard"><Button className="mt-6">返回主页</Button></Link>
        </div>
      </div>
    );
  }

  if (period.status === "preview") {
    return (
      <div className="min-h-screen grain-overlay">
        <Navbar />
        <div className="container pt-40 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-300 mb-4">
            {period.periodLabel}
          </div>
          <h1 className="font-display text-4xl text-cream-100">{period.theme}</h1>
          <p className="mt-4 text-cream-400 max-w-md mx-auto">
            本期仍在预告中，暂无法开箱。截止日期后盲盒将送达，届时可在此揭晓惊喜。
          </p>
          <p className="mt-2 text-xs text-cream-400">
            发货截止：{new Date(period.shipDeadline).toLocaleDateString("zh-CN")}
          </p>
          <Link to="/dashboard"><Button className="mt-8">返回主页</Button></Link>
        </div>
      </div>
    );
  }

  const productMap = getProductMap(products);
  const { picked, explanations, filtered } = currentUser
    ? matchForUser(period)
    : { picked: period.products, explanations: [], filtered: [] };
  const revealed = picked.slice(0, revealedCount);
  const allRevealed = revealedCount >= picked.length && picked.length > 0;
  const missingCount = Math.max(0, period.products.length - picked.length);
  const hasShortage = picked.length < 3 && filtered.length > 0;

  const handleOpen = () => {
    setOpened(true);
    markUnboxed(period.id);
    setTimeout(() => setRevealedCount(1), 900);
  };

  const revealNext = () => {
    setRevealedCount((c) => Math.min(c + 1, picked.length));
  };

  const explanationFor = (pid: string) =>
    explanations.find((e) => e.productId === pid);

  return (
    <div className="min-h-screen grain-overlay">
      <Navbar />
      <main className="container pt-32 pb-24">
        <div className="text-center mb-10">
          <div className="text-xs font-mono uppercase tracking-[0.3em] text-amber-300 mb-2">
            {period.periodLabel}
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-cream-100">{period.theme}</h1>
        </div>

        {!opened ? (
          /* Closed box state */
          <div className="flex flex-col items-center">
            {picked.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-lg"
              >
                <div className="w-24 h-24 mx-auto rounded-full bg-ink-800 flex items-center justify-center mb-6">
                  <Gift className="w-10 h-10 text-cream-400/40" />
                </div>
                <h2 className="font-display text-2xl text-cream-100">本期盲盒为空</h2>
                <p className="mt-3 text-cream-400 text-sm">
                  本期可选商品暂时不足，可能是商品下架或配置调整导致。
                </p>
                {filtered.length > 0 && (
                  <div className="mt-5 text-left bg-ink-800/70 rounded-2xl p-5 border border-cream-100/5">
                    <div className="text-xs font-mono uppercase tracking-wider text-amber-300 mb-3">已过滤商品</div>
                    <div className="space-y-2 text-sm">
                      {filtered.map((f, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          {f.type === "allergen" && (
                            <>
                              <ShieldAlert className="w-4 h-4 text-coral-300 shrink-0 mt-0.5" />
                              <span className="text-cream-300">
                                <span className="text-coral-300">过敏避开</span> · {f.productName}（含 {f.allergen}）
                              </span>
                            </>
                          )}
                          {f.type === "existing" && (
                            <>
                              <Package className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                              <span className="text-cream-300">
                                <span className="text-amber-300">已有避开</span> · {f.productName}（匹配：{f.matched}）
                              </span>
                            </>
                          )}
                          {f.type === "missing" && (
                            <>
                              <AlertTriangle className="w-4 h-4 text-coral-300 shrink-0 mt-0.5" />
                              <span className="text-cream-300">
                                <span className="text-coral-300">商品下架</span> · {f.productId.slice(0, 8)}
                              </span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link to="/dashboard">
                    <Button variant="secondary">返回主页</Button>
                  </Link>
                  <Link to="/subscribe">
                    <Button variant="coral">调整偏好</Button>
                  </Link>
                </div>
              </motion.div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  <ClosedBox />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center mt-8 max-w-lg"
                >
                  <p className="text-cream-400 mb-6">
                    你的盲盒已抵达。本期共 <span className="text-amber-300 font-medium">{picked.length}</span> 件精选好物，根据你的偏好与禁忌智能匹配。
                  </p>
                  {hasShortage && (
                    <div className="mb-6 text-left bg-amber-300/5 rounded-2xl p-4 border border-amber-300/20">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <div className="text-amber-300 font-medium mb-1">本期商品少于 3 件</div>
                          <div className="text-cream-300 text-xs">
                            有 {filtered.length} 件商品因过敏、已有物品或下架被过滤。
                            你可以调整偏好或等待运营补充新商品。
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Link to="/subscribe">
                          <Button size="sm" variant="coral">调整偏好</Button>
                        </Link>
                        <Link to="/dashboard">
                          <Button size="sm" variant="ghost">先不拆</Button>
                        </Link>
                      </div>
                    </div>
                  )}
                  <Button size="lg" onClick={handleOpen} className="animate-pulse-glow">
                    <Gift className="w-5 h-5" />
                    撕开盲盒
                  </Button>
                </motion.div>
              </>
            )}
          </div>
        ) : (
          /* Revealed products state */
          <div className="max-w-5xl mx-auto">
            <AnimatePresence>
              <div className="grid md:grid-cols-3 gap-6">
                {Array.from({ length: picked.length }).map((_, i) => {
                  const pid = picked[i];
                  const product = productMap.get(pid);
                  const isRevealed = i < revealedCount;
                  const exp = explanationFor(pid);
                  return (
                    <motion.div
                      key={pid}
                      initial={{ opacity: 0, scale: 0.6, y: 40 }}
                      animate={
                        isRevealed
                          ? { opacity: 1, scale: 1, y: 0 }
                          : { opacity: 0.3, scale: 0.9, y: 20 }
                      }
                      transition={{ type: "spring", damping: 18, stiffness: 200 }}
                    >
                      {product && (
                        <RevealCard
                          product={product}
                          revealed={isRevealed}
                          matchedTags={exp?.tagHits ?? []}
                          index={i + 1}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </AnimatePresence>

            <div className="mt-12 flex flex-col items-center gap-4">
              {!allRevealed ? (
                <>
                  <p className="text-sm text-cream-400">
                    还有 <span className="text-amber-300 font-medium">{picked.length - revealedCount}</span> 件待揭晓
                  </p>
                  <Button onClick={revealNext} size="lg">
                    <Sparkles className="w-5 h-5" />
                    揭晓下一件
                  </Button>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-6">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span className="text-sm text-cream-200">本期 {picked.length} 件好物已全部揭晓</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button size="lg" onClick={() => navigate(`/review/${period.id}`)}>
                      评价本期商品
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Button variant="secondary" size="lg" onClick={() => { setOpened(false); setRevealedCount(0); }}>
                      <RotateCcw className="w-4 h-4" />
                      再开一次
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ClosedBox() {
  return (
    <div className="relative w-64 h-64 perspective-1000">
      <motion.div
        className="absolute inset-0 preserve-3d"
        style={{ transform: "rotateX(-12deg) rotateY(-22deg)" }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Box body */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden border border-amber-300/30" style={{ background: "linear-gradient(155deg, #272019 0%, #0E0D0C 100%)" }}>
          <div className="absolute inset-0 bg-gradient-to-br from-amber-300/10 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <motion.div
              animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Gift className="w-16 h-16 text-amber-300" />
            </motion.div>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-cream-400">Mystery Box</span>
          </div>
          {/* Tape seal */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-3 bg-amber-300/20" />
        </div>
      </motion.div>
      {/* Glow */}
      <div className="absolute -inset-8 bg-amber-300/10 blur-3xl rounded-full animate-pulse-glow" />
    </div>
  );
}

function RevealCard({
  product,
  revealed,
  matchedTags,
  index,
}: {
  product: Product;
  revealed: boolean;
  matchedTags: string[];
  index: number;
}) {
  return (
    <div className="card-surface rounded-2xl overflow-hidden h-full flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-ink-800">
        {revealed ? (
          <motion.img
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-6xl text-cream-100/10">?</span>
          </div>
        )}
        <div className="absolute top-3 left-3 w-7 h-7 rounded-full glass flex items-center justify-center text-xs font-mono text-amber-300">
          {index}
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        {revealed ? (
          <>
            <div className="text-xs font-mono uppercase tracking-wider text-amber-300/70">
              {product.category}
            </div>
            <h3 className="font-display text-lg text-cream-100 mt-1 leading-tight">{product.name}</h3>
            <p className="text-xs text-cream-400 mt-2 leading-relaxed line-clamp-2">{product.description}</p>
            {matchedTags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {matchedTags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 text-[10px] font-mono uppercase text-forest-300 bg-forest-400/10 rounded-full px-2 py-0.5">
                    <TagIcon className="w-2.5 h-2.5" />
                    {t} · 命中
                  </span>
                ))}
              </div>
            )}
            {product.allergens.length > 0 && (
              <div className="mt-2 text-[10px] text-coral-300/80">⚠ 含 {product.allergens.join("、")}</div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center py-6">
            <span className="text-xs font-mono uppercase tracking-wider text-cream-400/50">待揭晓</span>
          </div>
        )}
      </div>
    </div>
  );
}
