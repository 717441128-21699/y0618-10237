import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Lock, ArrowUpRight, Eye } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/Button";
import { Tag } from "@/components/Tag";

export function ThemePreview() {
  const boxPeriods = useStore((s) => s.boxPeriods);
  const current = boxPeriods.find((b) => b.status === "preview") || boxPeriods[boxPeriods.length - 1];

  return (
    <section id="preview" className="py-24 md:py-32 relative overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden card-surface">
              {current && (
                <img
                  src={current.themeMoodImage}
                  alt={current.theme}
                  className="w-full h-full object-cover opacity-80"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent" />
              <div className="absolute top-5 left-5">
                <span className="glass rounded-full px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-amber-300">
                  本期主题预告
                </span>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-8">
                <div className="flex items-center gap-2 text-coral-300 text-xs font-mono uppercase tracking-wider mb-3">
                  <Lock className="w-3.5 h-3.5" />
                  商品清单保密中
                </div>
                {current && (
                  <h3 className="font-display text-4xl md:text-5xl text-cream-100">
                    {current.theme}
                  </h3>
                )}
              </div>
            </div>
            {/* Floating blurred product hints */}
            <div className="absolute -top-6 -right-6 glass rounded-2xl p-4 max-w-[180px] hidden md:block">
              <div className="flex items-center gap-2 text-amber-300 mb-2">
                <Eye className="w-4 h-4" />
                <span className="text-xs font-mono uppercase tracking-wider">线索</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {current?.keywords.map((k) => (
                  <Tag key={k} variant="keyword">
                    {k}
                  </Tag>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-amber-300/60" />
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-amber-300">
                Sneak Peek
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-medium leading-[1.05] tracking-tight text-cream-100">
              主题已就位
              <br />
              <span className="text-gradient-coral">内容待你揭晓</span>
            </h2>
            <p className="mt-5 text-base text-cream-400 leading-relaxed">
              {current?.themeDescription}
            </p>

            <div className="mt-8 space-y-4">
              {[
                { label: "本期商品组合", value: `${current?.products.length} 件主选 + ${current?.alternatives.length} 件备选` },
                { label: "发货截止", value: "每月 25 日 23:59" },
                { label: "跳过政策", value: "截止前可随时跳过本期" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between py-4 border-b border-cream-100/5"
                >
                  <span className="text-sm text-cream-400">{row.label}</span>
                  <span className="text-sm font-medium text-cream-100">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/subscribe">
                <Button>
                  订阅解锁本期
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="secondary">进入我的主页</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
