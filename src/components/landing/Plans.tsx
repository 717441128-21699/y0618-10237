import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/Button";
import { PLAN_OPTIONS } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Plans() {
  return (
    <section id="plans" className="py-24 md:py-32 relative">
      <div className="container">
        <SectionHeading
          align="center"
          eyebrow="Pricing"
          title={<>选一个节奏<em className="text-gradient-amber not-italic"> 订阅惊喜</em></>}
          description="三种周期，随时取消。订阅越长，单盒越省，还有年度限定礼盒等你解锁。"
        />

        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PLAN_OPTIONS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={cn(
                "relative rounded-3xl p-8 flex flex-col",
                plan.highlight
                  ? "bg-gradient-to-b from-amber-300/10 to-transparent border border-amber-300/40 shadow-glow"
                  : "card-surface",
              )}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-300 text-ink-900 text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  最受欢迎
                </span>
              )}
              <div className="font-display text-2xl text-cream-100">{plan.name}</div>
              <div className="text-xs font-mono uppercase tracking-wider text-cream-400 mt-1">
                {plan.period}
              </div>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-cream-400 text-sm">¥</span>
                <span className="font-display text-5xl font-medium text-cream-100">{plan.price}</span>
                <span className="text-sm text-cream-400">/ {plan.id === "monthly" ? "月" : plan.id === "quarterly" ? "季" : "年"}</span>
              </div>
              <div className="text-xs text-amber-300 mt-1">单盒折合 ¥{plan.perBox}</div>

              <ul className="mt-8 space-y-3 flex-1">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5 text-sm text-cream-300">
                    <span className="mt-0.5 w-4 h-4 rounded-full bg-amber-300/15 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-amber-300" />
                    </span>
                    {perk}
                  </li>
                ))}
              </ul>

              <Link to="/subscribe" className="mt-8">
                <Button
                  variant={plan.highlight ? "primary" : "secondary"}
                  className="w-full"
                >
                  {plan.highlight && <Sparkles className="w-4 h-4" />}
                  选择{plan.name}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
