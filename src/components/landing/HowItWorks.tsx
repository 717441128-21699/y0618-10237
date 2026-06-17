import { motion } from "framer-motion";
import { HeartHandshake, Wand2, Gift } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

const steps = [
  {
    n: "01",
    icon: HeartHandshake,
    title: "设定偏好与禁忌",
    desc: "勾选你感兴趣的领域，标记过敏成分与已有物品。算法以此为基础，从不触碰你的雷区。",
    accent: "amber",
  },
  {
    n: "02",
    icon: Wand2,
    title: "智能匹配策展",
    desc: "每期运营配置主题与商品组合，系统从池中为你匹配最贴合的 3 件好物，备选品随时补位。",
    accent: "coral",
  },
  {
    n: "03",
    icon: Gift,
    title: "预告 · 开箱 · 反馈",
    desc: "发货前推送主题预告，可选跳过本期。收货后逐件评价，你的反馈将优化下期选品。",
    accent: "amber",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-24 md:py-32 relative">
      <div className="container">
        <SectionHeading
          eyebrow="How it works"
          title={<>三步开启<em className="text-gradient-amber not-italic"> 月度惊喜</em></>}
          description="从偏好到开箱，整个过程像拆礼物一样轻盈。算法在背后默默工作，确保每件商品都恰到好处。"
        />

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isCoral = step.accent === "coral";
            return (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="card-surface rounded-3xl p-8 relative overflow-hidden group"
              >
                <span className="absolute -top-4 -right-2 font-display text-[8rem] font-bold text-cream-100/[0.04] leading-none select-none">
                  {step.n}
                </span>
                <div
                  className={`relative w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                    isCoral
                      ? "bg-coral-300/10 text-coral-300"
                      : "bg-amber-300/10 text-amber-300"
                  } group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="relative font-display text-2xl text-cream-100 mb-3">{step.title}</h3>
                <p className="relative text-sm text-cream-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
