import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  ShieldAlert,
  Package,
  MapPin,
  Sparkles,
  PartyPopper,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/Button";
import { Tag } from "@/components/Tag";
import { ChipInput } from "@/components/ChipInput";
import { useStore } from "@/store/useStore";
import {
  PREFERENCE_TAG_LIST,
  COMMON_ALLERGENS,
  PLAN_OPTIONS,
  type PreferenceTag,
  type SubscriptionPlan,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const STEPS = ["偏好", "禁忌", "套餐", "确认"];

export default function Subscribe() {
  const navigate = useNavigate();
  const createUserProfile = useStore((s) => s.createUserProfile);
  const currentUser = useStore((s) => s.currentUser);
  const [step, setStep] = useState(0);
  const [tags, setTags] = useState<PreferenceTag[]>(
    currentUser?.preferenceTags ?? [],
  );
  const [allergies, setAllergies] = useState<string[]>(currentUser?.allergies ?? []);
  const [items, setItems] = useState<string[]>(currentUser?.existingItems ?? []);
  const [plan, setPlan] = useState<SubscriptionPlan>(currentUser?.subscriptionPlan ?? "quarterly");
  const [name, setName] = useState(currentUser?.name ?? "");
  const [email, setEmail] = useState(currentUser?.email ?? "");
  const [address, setAddress] = useState(currentUser?.address ?? "");

  const toggleTag = (t: PreferenceTag) =>
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const canNext =
    (step === 0 && tags.length > 0) ||
    (step === 1) ||
    (step === 2) ||
    (step === 3 && name && email && address);

  const finish = () => {
    createUserProfile({
      name,
      email,
      preferenceTags: tags,
      allergies,
      existingItems: items,
      subscriptionPlan: plan,
      address,
    });
    navigate("/dashboard");
  };

  const iconFor = (i: number) =>
    [Heart, ShieldAlert, Package, MapPin][i] ?? Heart;

  return (
    <div className="min-h-screen grain-overlay">
      <Navbar />
      <main className="container pt-32 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl text-cream-100">
              定制你的<em className="text-gradient-amber not-italic"> 惊喜档案</em>
            </h1>
            <p className="mt-4 text-cream-400">
              四步完成，算法将用这些信息为你策展每一期盲盒。
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-between mb-12 max-w-xl mx-auto">
            {STEPS.map((label, i) => {
              const Icon = iconFor(i);
              const done = i < step;
              const active = i === step;
              return (
                <div key={label} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={cn(
                        "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300",
                        done && "bg-amber-300 text-ink-900",
                        active && "bg-amber-300/15 text-amber-300 ring-2 ring-amber-300/40",
                        !done && !active && "bg-ink-700 text-cream-400",
                      )}
                    >
                      {done ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-mono uppercase tracking-wider transition-colors",
                        active ? "text-amber-300" : done ? "text-cream-200" : "text-cream-400/50",
                      )}
                    >
                      {label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="flex-1 h-px mx-3 bg-ink-700 relative">
                      <div
                        className="absolute inset-y-0 left-0 bg-amber-300 transition-all duration-500"
                        style={{ width: done ? "100%" : "0%" }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="card-surface rounded-3xl p-8 md:p-10 min-h-[340px]">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="s0"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                >
                  <StepHeader
                    icon={Heart}
                    title="你最感兴趣的领域？"
                    desc="多选没关系，选得越多，匹配空间越大。"
                  />
                  <div className="flex flex-wrap gap-3 mt-8">
                    {PREFERENCE_TAG_LIST.map((t) => (
                      <Tag key={t} selected={tags.includes(t)} onClick={() => toggleTag(t)}>
                        {t}
                      </Tag>
                    ))}
                  </div>
                  <p className="mt-6 text-xs text-cream-400">
                    已选 <span className="text-amber-300 font-medium">{tags.length}</span> 个偏好标签
                  </p>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="s1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="space-y-8"
                >
                  <div>
                    <StepHeader
                      icon={ShieldAlert}
                      title="过敏成分"
                      desc="我们会避开含这些成分的商品，安全第一。"
                    />
                    <ChipInput
                      values={allergies}
                      onChange={setAllergies}
                      suggestions={COMMON_ALLERGENS}
                      placeholder="输入过敏成分，回车添加"
                      variant="allergen"
                      className="mt-6"
                    />
                  </div>
                  <div>
                    <StepHeader
                      icon={Package}
                      title="已有 / 不想重复的物品"
                      desc="告诉算法你已经有什么，避免重复收到。"
                    />
                    <ChipInput
                      values={items}
                      onChange={setItems}
                      suggestions={["手账本", "香薰蜡烛", "运动毛巾", "瑜伽垫"]}
                      placeholder="输入物品名，回车添加"
                      variant="item"
                      className="mt-6"
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                >
                  <StepHeader
                    icon={Package}
                    title="选择订阅周期"
                    desc="周期越长单盒越省，随时可取消。"
                  />
                  <div className="grid sm:grid-cols-3 gap-4 mt-8">
                    {PLAN_OPTIONS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setPlan(p.id)}
                        className={cn(
                          "relative text-left rounded-2xl p-5 border transition-all duration-300 hover:-translate-y-1",
                          plan === p.id
                            ? "border-amber-300 bg-amber-300/10 shadow-glow"
                            : "border-cream-100/10 bg-ink-800 hover:border-amber-300/40",
                        )}
                      >
                        {p.highlight && (
                          <span className="absolute -top-2 right-3 bg-coral-300 text-ink-900 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">
                            热门
                          </span>
                        )}
                        <div className="font-display text-lg text-cream-100">{p.name}</div>
                        <div className="text-xs text-cream-400 mt-1">{p.period}</div>
                        <div className="mt-3 flex items-baseline gap-0.5">
                          <span className="text-cream-400 text-xs">¥</span>
                          <span className="font-display text-2xl text-amber-300">{p.perBox}</span>
                          <span className="text-xs text-cream-400">/盒</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="s3"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                >
                  <StepHeader
                    icon={MapPin}
                    title="收货信息"
                    desc="完成确认，你的第一盒就开始筹备了。"
                  />
                  <div className="grid sm:grid-cols-2 gap-4 mt-8">
                    <Field label="姓名" value={name} onChange={setName} placeholder="你的称呼" />
                    <Field label="邮箱" value={email} onChange={setEmail} placeholder="name@example.com" />
                  </div>
                  <div className="mt-4">
                    <Field
                      label="收货地址"
                      value={address}
                      onChange={setAddress}
                      placeholder="详细收货地址"
                      full
                    />
                  </div>

                  <div className="mt-8 rounded-2xl border border-amber-300/20 bg-amber-300/[0.03] p-5">
                    <div className="flex items-center gap-2 text-amber-300 text-xs font-mono uppercase tracking-wider mb-3">
                      <Sparkles className="w-3.5 h-3.5" /> 订阅摘要
                    </div>
                    <div className="grid grid-cols-2 gap-y-3 text-sm">
                      <span className="text-cream-400">偏好标签</span>
                      <span className="text-cream-100 text-right">{tags.join(" · ") || "—"}</span>
                      <span className="text-cream-400">过敏成分</span>
                      <span className="text-coral-300 text-right">{allergies.join("、") || "无"}</span>
                      <span className="text-cream-400">已有物品</span>
                      <span className="text-cream-100 text-right">{items.join("、") || "无"}</span>
                      <span className="text-cream-400">订阅方案</span>
                      <span className="text-cream-100 text-right">
                        {PLAN_OPTIONS.find((p) => p.id === plan)?.name}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Nav buttons */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="ghost"
              onClick={() => (step === 0 ? navigate("/") : setStep(step - 1))}
            >
              <ArrowLeft className="w-4 h-4" />
              {step === 0 ? "返回首页" : "上一步"}
            </Button>
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canNext}>
                继续
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={finish} disabled={!canNext}>
                <PartyPopper className="w-4 h-4" />
                完成订阅
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StepHeader({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof Heart;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-2xl bg-amber-300/10 text-amber-300 flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h2 className="font-display text-2xl text-cream-100">{title}</h2>
        <p className="text-sm text-cream-400 mt-1">{desc}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  full,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  full?: boolean;
}) {
  return (
    <label className={cn("block", full && "sm:col-span-2")}>
      <span className="block text-xs font-mono uppercase tracking-wider text-cream-400 mb-2">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-cream-100/15 bg-ink-800 px-4 py-3 text-sm text-cream-100 outline-none focus:border-amber-300/60 transition-colors placeholder:text-cream-400/40"
      />
    </label>
  );
}
