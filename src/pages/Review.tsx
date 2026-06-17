import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Send, ChevronLeft, PartyPopper, MessageCircle, AlertTriangle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/Button";
import { StarRating } from "@/components/StarRating";
import { useStore } from "@/store/useStore";
import { getProductMap } from "@/lib/engine";
import { cn } from "@/lib/utils";

const QUICK_TAGS = ["正中下怀", "超出预期", "想回购", "包装精美", "适合送礼", "略不合口味", "重复了", "性价比一般"];

interface DraftReview {
  rating: number;
  likeScore: number;
  comment: string;
}

export default function Review() {
  const { periodId } = useParams();
  const navigate = useNavigate();
  const boxPeriods = useStore((s) => s.boxPeriods);
  const products = useStore((s) => s.products);
  const currentUser = useStore((s) => s.currentUser);
  const reviews = useStore((s) => s.reviews);
  const matchForUser = useStore((s) => s.matchForUser);
  const submitReview = useStore((s) => s.submitReview);

  const period = boxPeriods.find((b) => b.id === periodId);
  const productMap = getProductMap(products);

  const unboxedPeriods = useStore((s) => s.unboxedPeriods);
  const isUnboxed = period ? unboxedPeriods.includes(period.id) : false;
  const isDelivered = period?.status === "delivered";
  const isShipping = period?.status === "shipping";
  const canReview = period && (isDelivered || isUnboxed) && period.status !== "preview";

  const { picked, filtered } = currentUser && period
    ? matchForUser(period)
    : { picked: period?.products ?? [], filtered: [] };
  const hasShortage = picked.length < 3 && filtered.length > 0;
  const isEmpty = picked.length === 0;

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

  if (!canReview) {
    return (
      <div className="min-h-screen grain-overlay">
        <Navbar />
        <div className="container pt-40 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-300 mb-4">
            {period?.periodLabel}
          </div>
          <h1 className="font-display text-4xl text-cream-100">评价未开放</h1>
          <p className="mt-4 text-cream-400 max-w-md mx-auto">
            {period?.status === "preview"
              ? "本期仍在预告中，暂无法评价。"
              : isShipping
                ? "本期正在配送中，送达后即可评价。"
                : "请先完成本期开箱后再来评价。"}
          </p>
          <Link to="/dashboard"><Button className="mt-8">返回主页</Button></Link>
        </div>
      </div>
    );
  }

  const existingReviews = reviews.filter(
    (r) => r.periodId === periodId && r.userId === currentUser?.id,
  );

  const relevantReviews = existingReviews.filter((r) => picked.includes(r.productId));

  const [drafts, setDrafts] = useState<Record<string, DraftReview>>(() => {
    const init: Record<string, DraftReview> = {};
    picked.forEach((pid) => {
      const ex = relevantReviews.find((r) => r.productId === pid);
      init[pid] = ex
        ? { rating: ex.rating, likeScore: ex.likeScore, comment: ex.comment }
        : { rating: 0, likeScore: 50, comment: "" };
    });
    return init;
  });
  const [submitted, setSubmitted] = useState<Set<string>>(
    new Set(relevantReviews.map((r) => r.productId)),
  );
  const [allDone, setAllDone] = useState(false);

  const updateDraft = (pid: string, patch: Partial<DraftReview>) =>
    setDrafts((d) => ({ ...d, [pid]: { ...d[pid], ...patch } }));

  const submitOne = (pid: string) => {
    const draft = drafts[pid];
    if (!draft || draft.rating === 0) return;
    submitReview({
      periodId: period.id,
      productId: pid,
      rating: draft.rating,
      likeScore: draft.likeScore,
      comment: draft.comment,
    });
    setSubmitted((s) => new Set(s).add(pid));
  };

  const doneCount = submitted.size;
  const totalCount = picked.length;
  const canFinish = doneCount === totalCount && totalCount > 0;

  return (
    <div className="min-h-screen grain-overlay">
      <Navbar />
      <main className="container pt-32 pb-24">
        <div className="max-w-4xl mx-auto">
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-cream-400 hover:text-amber-300 mb-6">
            <ChevronLeft className="w-4 h-4" />
            返回主页
          </Link>

          <div className="flex items-end justify-between mb-2">
            <div>
              <div className="text-xs font-mono uppercase tracking-[0.3em] text-amber-300 mb-2">
                {period.periodLabel}
              </div>
              <h1 className="font-display text-4xl text-cream-100">评价本期商品</h1>
            </div>
            <div className="text-right">
              <div className="font-display text-3xl text-amber-300">{doneCount}/{totalCount}</div>
              <div className="text-xs text-cream-400">已评价</div>
            </div>
          </div>
          <div className="h-1 bg-ink-700 rounded-full overflow-hidden mb-10">
            <motion.div
              className="h-full bg-amber-300"
              animate={{ width: `${(doneCount / Math.max(1, totalCount)) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {hasShortage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-surface rounded-2xl p-5 mb-6 border border-amber-300/20"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-display text-lg text-amber-300 mb-1">本期商品少于 3 件</div>
                  <div className="text-sm text-cream-300">
                    有 {filtered.length} 件商品因过敏、已有物品或下架被过滤。你可以先评价现有商品，也可以调整偏好后等待下次补货。
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link to="/subscribe">
                      <Button size="sm" variant="coral">调整偏好</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {isEmpty ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-surface rounded-3xl p-10 text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-ink-800 flex items-center justify-center mb-6">
                <MessageCircle className="w-7 h-7 text-cream-400/40" />
              </div>
              <h2 className="font-display text-2xl text-cream-100">暂无可评价商品</h2>
              <p className="mt-3 text-cream-400 text-sm max-w-md mx-auto">
                本期商品列表为空，可能是商品下架或配置调整导致。请稍后再试，或联系运营补充商品。
              </p>
              <div className="mt-8 flex justify-center gap-3">
                <Link to="/dashboard">
                  <Button variant="secondary">返回主页</Button>
                </Link>
              </div>
            </motion.div>
          ) : allDone ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-surface rounded-3xl p-10 text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-forest-400/15 flex items-center justify-center mb-6">
                <PartyPopper className="w-8 h-8 text-forest-300" />
              </div>
              <h2 className="font-display text-3xl text-cream-100">评价已提交</h2>
              <p className="mt-3 text-cream-400 max-w-md mx-auto">
                感谢你的反馈！你的评价将进入选品算法，帮助下一期更懂你。
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/dashboard"><Button>返回主页</Button></Link>
                <Link to="/admin/analytics"><Button variant="secondary">查看数据洞察</Button></Link>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {picked.map((pid, i) => {
                const product = productMap.get(pid);
                if (!product) return null;
                const draft = drafts[pid];
                const isSubmitted = submitted.has(pid);
                return (
                  <motion.div
                    key={pid}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="card-surface rounded-3xl overflow-hidden"
                  >
                    <div className="grid sm:grid-cols-[160px_1fr]">
                      <div className="relative aspect-square sm:aspect-auto bg-ink-800">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 w-6 h-6 rounded-full glass flex items-center justify-center text-xs font-mono text-amber-300">
                          {i + 1}
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-[10px] font-mono uppercase tracking-wider text-amber-300/70">
                              {product.category}
                            </div>
                            <h3 className="font-display text-lg text-cream-100 mt-0.5">{product.name}</h3>
                          </div>
                          {isSubmitted && (
                            <span className="inline-flex items-center gap-1 text-xs text-forest-300 bg-forest-400/10 rounded-full px-2.5 py-1 shrink-0">
                              <Check className="w-3 h-3" /> 已评价
                            </span>
                          )}
                        </div>

                        <div className="mt-4">
                          <label className="text-xs font-mono uppercase tracking-wider text-cream-400">评分</label>
                          <div className="mt-2 flex items-center gap-3">
                            <StarRating
                              value={draft.rating}
                              interactive={!isSubmitted}
                              onChange={(v) => updateDraft(pid, { rating: v })}
                              size={26}
                            />
                            <span className="text-sm text-cream-300 font-mono">{draft.rating}.0</span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-mono uppercase tracking-wider text-cream-400">喜好度</label>
                            <span className="text-sm text-amber-300 font-mono">{draft.likeScore}%</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={draft.likeScore}
                            disabled={isSubmitted}
                            onChange={(e) => updateDraft(pid, { likeScore: Number(e.target.value) })}
                            className="mt-2 w-full accent-amber-300"
                          />
                        </div>

                        <div className="mt-4">
                          <label className="text-xs font-mono uppercase tracking-wider text-cream-400 flex items-center gap-1.5">
                            <MessageCircle className="w-3 h-3" /> 评价（可选）
                          </label>
                          <textarea
                            value={draft.comment}
                            disabled={isSubmitted}
                            onChange={(e) => updateDraft(pid, { comment: e.target.value })}
                            placeholder="说说你的使用感受…"
                            rows={2}
                            className="mt-2 w-full rounded-xl border border-cream-100/15 bg-ink-800 px-4 py-3 text-sm text-cream-100 outline-none focus:border-amber-300/60 transition-colors resize-none placeholder:text-cream-400/40"
                          />
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {QUICK_TAGS.map((t) => (
                              <button
                                key={t}
                                disabled={isSubmitted}
                                onClick={() => updateDraft(pid, { comment: draft.comment ? `${draft.comment} ${t}` : t })}
                                className="text-xs px-2.5 py-1 rounded-full border border-cream-100/10 text-cream-400 hover:border-amber-300/40 hover:text-amber-200 transition-colors disabled:opacity-40"
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>

                        {!isSubmitted && (
                          <div className="mt-5 flex justify-end">
                            <Button size="sm" onClick={() => submitOne(pid)} disabled={draft.rating === 0}>
                              <Send className="w-3.5 h-3.5" />
                              提交评价
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              <div className="flex justify-end">
                <Button
                  size="lg"
                  variant={canFinish ? "primary" : "secondary"}
                  onClick={() => canFinish && setAllDone(true)}
                  className={cn(canFinish && "shadow-glow")}
                >
                  <Check className="w-5 h-5" />
                  完成本期评价
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
