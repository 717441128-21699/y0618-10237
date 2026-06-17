import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { SEED_TESTIMONIALS } from "@/lib/mockData";

export function Testimonials() {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="container">
        <SectionHeading
          align="center"
          eyebrow="Voices"
          title={<>他们已经<em className="text-gradient-amber not-italic"> 收到惊喜</em></>}
          description="真实的订阅用户反馈。每个月，我们都在用算法赢得下一次续订。"
        />

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {SEED_TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-surface rounded-3xl p-8 relative"
            >
              <Quote className="w-8 h-8 text-amber-300/30 mb-4" />
              <p className="text-cream-200 leading-relaxed text-[15px]">"{t.text}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center font-display text-ink-900 font-medium">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-medium text-cream-100">{t.name}</div>
                  <div className="text-xs font-mono text-cream-400">{t.plan}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
