import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { Box3D } from "@/components/Box3D";
import { Button } from "@/components/Button";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-16">
      {/* Background atmosphere */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-32 w-[40rem] h-[40rem] rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[35rem] h-[35rem] rounded-full bg-coral-500/8 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(232,176,75,0.08) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="container">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 glass rounded-full pl-2 pr-4 py-1.5 mb-8"
            >
              <span className="bg-amber-300 text-ink-900 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                2026·6月
              </span>
              <span className="text-xs text-cream-300">仲夏夜之谜 · 即将揭晓</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display font-medium text-[clamp(3rem,8vw,6.5rem)] leading-[0.92] tracking-tightest text-cream-100"
            >
              每月一盒
              <br />
              <span className="text-gradient-amber italic">未知的惊喜</span>
              <br />
              <span className="text-cream-400 text-[0.6em] font-light">为懂生活的你策展</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-8 max-w-md text-lg text-cream-300 leading-relaxed"
            >
              告诉我们你的偏好与禁忌，算法会为你策展每月精选好物。
              你永远不知道下一盒有什么，但每一件都正中下怀。
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link to="/subscribe">
                <Button size="lg">
                  <Sparkles className="w-5 h-5" />
                  开启我的盲盒
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="secondary" size="lg">
                  查看本期预告
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-12 flex items-center gap-8"
            >
              {[
                { n: "1,520+", l: "活跃订阅" },
                { n: "88%", l: "续订率" },
                { n: "4.6", l: "平均好评" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-3xl font-medium text-amber-300">{s.n}</div>
                  <div className="text-xs font-mono uppercase tracking-wider text-cream-400 mt-1">
                    {s.l}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="lg:col-span-5 relative flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <Box3D size={300} />
            </motion.div>
            {/* Decorative numbered tags */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute top-10 left-0 glass rounded-2xl px-4 py-3 hidden md:block"
            >
              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-300">本期关键词</div>
              <div className="text-sm text-cream-200 mt-1">清凉 · 夜行 · 灵感</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="absolute bottom-16 right-0 glass rounded-2xl px-4 py-3 hidden md:block"
            >
              <div className="text-[10px] font-mono uppercase tracking-wider text-coral-300">不剧透</div>
              <div className="text-sm text-cream-200 mt-1">具体商品保密中</div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
