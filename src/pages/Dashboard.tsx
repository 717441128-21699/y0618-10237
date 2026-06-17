import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Gift,
  SkipForward,
  History,
  Heart,
  ShieldAlert,
  Package,
  CheckCircle2,
  ArrowRight,
  Settings2,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/Button";
import { Tag } from "@/components/Tag";
import { CountdownRing } from "@/components/CountdownRing";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { StarRating } from "@/components/StarRating";
import { useStore } from "@/store/useStore";
import { isPeriodSkipped } from "@/lib/engine";
import { PLAN_OPTIONS } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const navigate = useNavigate();
  const currentUser = useStore((s) => s.currentUser);
  const boxPeriods = useStore((s) => s.boxPeriods);
  const reviews = useStore((s) => s.reviews);
  const unboxedPeriods = useStore((s) => s.unboxedPeriods);
  const skipPeriod = useStore((s) => s.skipPeriod);
  const unskipPeriod = useStore((s) => s.unskipPeriod);

  const [skipTarget, setSkipTarget] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  if (!currentUser) {
    return (
      <div className="min-h-screen grain-overlay">
        <Navbar />
        <div className="container pt-40 pb-32 text-center">
          <h1 className="font-display text-3xl text-cream-100">还没有订阅档案</h1>
          <p className="mt-4 text-cream-400">先创建你的惊喜档案，再来这里查看本期。</p>
          <Link to="/subscribe">
            <Button className="mt-8">去订阅</Button>
          </Link>
        </div>
      </div>
    );
  }

  const current = boxPeriods.find((b) => b.status === "preview") || boxPeriods[boxPeriods.length - 1];
  const history = [...boxPeriods].reverse();
  const skipped = isPeriodSkipped(currentUser, current?.id ?? "");
  const plan = PLAN_OPTIONS.find((p) => p.id === currentUser.subscriptionPlan);

  const myReviewFor = (periodId: string) =>
    reviews.filter((r) => r.periodId === periodId && r.userId === currentUser.id);

  return (
    <div className="min-h-screen grain-overlay">
      <Navbar />
      <main className="container pt-32 pb-24">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.3em] text-amber-300 mb-2">
              我的主页
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-cream-100">
              你好，<span className="text-gradient-amber">{currentUser.name}</span>
            </h1>
            <p className="mt-3 text-cream-400">
              {plan?.name} · 第 {history.length} 盒 · 订阅自{" "}
              {new Date(currentUser.subscribedAt).toLocaleDateString("zh-CN")}
            </p>
          </div>
          <Button variant="secondary" onClick={() => setEditing(!editing)}>
            <Settings2 className="w-4 h-4" />
            {editing ? "收起偏好" : "编辑偏好"}
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Current period preview */}
          <div className="lg:col-span-2 card-surface rounded-3xl overflow-hidden">
            <div className="relative h-48 overflow-hidden">
              {current && (
                <img src={current.themeMoodImage} alt="" className="w-full h-full object-cover opacity-70" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-300">
                    本期预告
                  </span>
                  <h2 className="font-display text-3xl text-cream-100 mt-1">{current?.theme}</h2>
                </div>
                <CountdownRing deadline={current?.shipDeadline ?? ""} size={96} />
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm text-cream-400 leading-relaxed">{current?.themeDescription}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {current?.keywords.map((k) => (
                  <Tag key={k} variant="keyword">{k}</Tag>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <Info icon={Package} label="商品组合" value={`${current?.products.length} 件 + ${current?.alternatives.length} 备选`} />
                <Info icon={Calendar} label="发货截止" value={current ? new Date(current.shipDeadline).toLocaleDateString("zh-CN") : "—"} />
              </div>

              {skipped ? (
                <div className="mt-6 rounded-2xl border border-cream-100/10 bg-ink-800 p-4 flex items-center gap-3">
                  <SkipForward className="w-5 h-5 text-cream-400" />
                  <div className="flex-1">
                    <div className="text-sm text-cream-200">已跳过本期</div>
                    <div className="text-xs text-cream-400">下期预告将在截止后生成</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => unskipPeriod(current?.id ?? "")}>
                    恢复本期
                  </Button>
                </div>
              ) : (
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to={`/unbox/${current?.id}`} className="flex-1">
                    <Button className="w-full">
                      <Gift className="w-4 h-4" />
                      开箱揭晓
                    </Button>
                  </Link>
                  <Button variant="danger" onClick={() => setSkipTarget(current?.id ?? "")}>
                    <SkipForward className="w-4 h-4" />
                    跳过本期
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Side: preference summary */}
          <div className="space-y-6">
            <div className="card-surface rounded-3xl p-6">
              <div className="flex items-center gap-2 text-amber-300 mb-4">
                <Heart className="w-4 h-4" />
                <span className="text-xs font-mono uppercase tracking-wider">偏好档案</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                {currentUser.preferenceTags.map((t) => (
                  <Tag key={t} variant="keyword">{t}</Tag>
                ))}
                {currentUser.preferenceTags.length === 0 && (
                  <span className="text-sm text-cream-400">尚未设置偏好</span>
                )}
              </div>
              <div className="space-y-3 pt-4 border-t border-cream-100/5">
                <PrefRow icon={ShieldAlert} label="过敏" value={currentUser.allergies} danger />
                <PrefRow icon={Package} label="已有" value={currentUser.existingItems} />
              </div>
              {editing && (
                <Link to="/subscribe" className="mt-4 block">
                  <Button variant="secondary" size="sm" className="w-full">
                    修改偏好与禁忌
                  </Button>
                </Link>
              )}
            </div>

            <div className="card-surface rounded-3xl p-6">
              <div className="flex items-center gap-2 text-amber-300 mb-4">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-mono uppercase tracking-wider">订阅状态</span>
              </div>
              <div className="text-3xl font-display text-cream-100">{plan?.name}</div>
              <div className="text-sm text-cream-400 mt-1">单盒 ¥{plan?.perBox}</div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  currentUser.renewed ? "bg-forest-300" : "bg-coral-300",
                )} />
                <span className={currentUser.renewed ? "text-forest-300" : "text-coral-300"}>
                  {currentUser.renewed ? "续订中" : "已暂停"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <History className="w-5 h-5 text-amber-300" />
            <h2 className="font-display text-2xl text-cream-100">往期记录</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map((bp, i) => {
              const myReviews = myReviewFor(bp.id);
              const unboxed = unboxedPeriods.includes(bp.id);
              const isSkipped = isPeriodSkipped(currentUser, bp.id);
              const avgRating = myReviews.length
                ? myReviews.reduce((s, r) => s + r.rating, 0) / myReviews.length
                : 0;
              return (
                <motion.div
                  key={bp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="card-surface rounded-2xl p-5 group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-mono uppercase tracking-wider text-cream-400">
                        {bp.periodLabel}
                      </div>
                      <h3 className="font-display text-xl text-cream-100 mt-1">{bp.theme}</h3>
                    </div>
                    {isSkipped ? (
                      <span className="text-[10px] font-mono uppercase text-cream-400 border border-cream-100/10 rounded-full px-2 py-0.5">
                        跳过
                      </span>
                    ) : bp.status === "preview" ? (
                      <span className="text-[10px] font-mono uppercase text-amber-300 border border-amber-300/30 rounded-full px-2 py-0.5">
                        预告中
                      </span>
                    ) : unboxed ? (
                      <span className="text-[10px] font-mono uppercase text-forest-300 border border-forest-400/30 rounded-full px-2 py-0.5">
                        已开箱
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono uppercase text-cream-400 border border-cream-100/10 rounded-full px-2 py-0.5">
                        待开箱
                      </span>
                    )}
                  </div>

                  {myReviews.length > 0 && (
                    <div className="mt-4 flex items-center gap-2">
                      <StarRating value={avgRating} size={14} />
                      <span className="text-xs text-cream-400">{myReviews.length} 条评价</span>
                    </div>
                  )}

                  {!isSkipped && bp.status !== "preview" && (
                    <Link
                      to={unboxed ? `/review/${bp.id}` : `/unbox/${bp.id}`}
                      className="mt-4 inline-flex items-center gap-1 text-sm text-amber-300 hover:gap-2 transition-all"
                    >
                      {unboxed ? "去评价" : "去开箱"}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                  {bp.status === "preview" && !isSkipped && (
                    <Link
                      to={`/unbox/${bp.id}`}
                      className="mt-4 inline-flex items-center gap-1 text-sm text-amber-300 hover:gap-2 transition-all"
                    >
                      提前开箱
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      <ConfirmDialog
        open={!!skipTarget}
        onClose={() => setSkipTarget(null)}
        onConfirm={() => {
          if (skipTarget) skipPeriod(skipTarget);
          setSkipTarget(null);
        }}
        title="跳过本期？"
        description="跳过后本期不会发货，下期预告将在截止后生成。截止前你可以随时恢复本期。"
        confirmText="确认跳过"
        variant="danger"
      />
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof Calendar; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-ink-800/60 p-3">
      <Icon className="w-4 h-4 text-amber-300 shrink-0" />
      <div>
        <div className="text-[10px] font-mono uppercase tracking-wider text-cream-400">{label}</div>
        <div className="text-sm text-cream-100">{value}</div>
      </div>
    </div>
  );
}

function PrefRow({
  icon: Icon,
  label,
  value,
  danger,
}: {
  icon: typeof Heart;
  label: string;
  value: string[];
  danger?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", danger ? "text-coral-300" : "text-cream-400")} />
      <div className="flex-1">
        <div className="text-[10px] font-mono uppercase tracking-wider text-cream-400">{label}</div>
        <div className={cn("text-sm mt-0.5", danger ? "text-coral-200" : "text-cream-200")}>
          {value.length ? value.join("、") : "无"}
        </div>
      </div>
    </div>
  );
}
