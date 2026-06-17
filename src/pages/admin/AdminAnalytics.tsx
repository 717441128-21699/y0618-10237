import { Users, RefreshCw, Star, SkipForward, Lightbulb, TrendingUp, AlertCircle, Target } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatCard } from "@/components/StatCard";
import { SubscriberTrend } from "@/components/admin/charts/SubscriberTrend";
import { UnsubscribePie } from "@/components/admin/charts/UnsubscribePie";
import { RenewalFactors } from "@/components/admin/charts/RenewalFactors";
import { PeriodRatings } from "@/components/admin/charts/PeriodRatings";
import { useStore } from "@/store/useStore";
import { REASON_LABELS } from "@/lib/types";

export default function AdminAnalytics() {
  const analytics = useStore((s) => s.getAnalytics());
  const topReason = analytics.unsubscribeReasons[0];

  const insights = [
    {
      icon: Target,
      tone: "amber" as const,
      title: "偏好匹配度是续订最强正相关",
      text: "标签命中数每提升 1 个，续订概率上升约 18%。建议在订阅引导页鼓励用户多选标签。",
    },
    {
      icon: AlertCircle,
      tone: "coral" as const,
      title: `${topReason ? REASON_LABELS[topReason.category] : "偏好不符"}是首要退订原因`,
      text: topReason
        ? `占退订 ${Math.round((topReason.count / analytics.unsubscribeReasons.reduce((s, r) => s + r.count, 0)) * 100)}%。需重点优化该方向的用户体验。`
        : "暂无退订数据。",
    },
    {
      icon: TrendingUp,
      tone: "amber" as const,
      title: "禁忌冲突直接拉低续订意愿",
      text: "发生过过敏或重复物品冲突的用户，续订率比平均低 23%。匹配引擎需更严格过滤。",
    },
  ];

  return (
    <AdminLayout title="数据分析">
      {/* Core metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="活跃订阅"
          value={analytics.activeSubscribers.toLocaleString()}
          icon={<Users className="w-5 h-5" />}
          trend={6}
          trendLabel="环比上月"
        />
        <StatCard
          label="续订率"
          value={analytics.renewalRate}
          unit="%"
          accent="cream"
          icon={<RefreshCw className="w-5 h-5" />}
          trend={3}
          trendLabel="同比"
        />
        <StatCard
          label="平均好评"
          value={analytics.avgRating}
          unit="/5"
          accent="cream"
          icon={<Star className="w-5 h-5" />}
          trend={2}
          trendLabel="较上期"
        />
        <StatCard
          label="本期跳过率"
          value={analytics.skipRate}
          unit="%"
          accent="coral"
          icon={<SkipForward className="w-5 h-5" />}
          trend={-1}
          trendLabel="环比"
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 card-surface rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-lg text-cream-100">订阅与续订趋势</h3>
              <p className="text-xs text-cream-400">近 6 个月订阅人数 vs 续订人数</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-cream-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-300" /> 订阅
              </span>
              <span className="flex items-center gap-1.5 text-cream-300">
                <span className="w-2.5 h-2.5 rounded-full bg-coral-300" /> 续订
              </span>
            </div>
          </div>
          <SubscriberTrend data={analytics.subscriberTrend} />
        </div>

        <div className="card-surface rounded-2xl p-6">
          <h3 className="font-display text-lg text-cream-100 mb-1">退订原因分布</h3>
          <p className="text-xs text-cream-400 mb-4">共 {analytics.unsubscribeReasons.reduce((s, r) => s + r.count, 0)} 条退订记录</p>
          <UnsubscribePie data={analytics.unsubscribeReasons} />
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="card-surface rounded-2xl p-6">
          <h3 className="font-display text-lg text-cream-100 mb-1">各期商品好评率</h3>
          <p className="text-xs text-cream-400 mb-4">已送达期次的平均评分</p>
          <PeriodRatings data={analytics.periodRatings} />
        </div>

        <div className="card-surface rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-4 h-4 text-amber-300" />
            <h3 className="font-display text-lg text-cream-100">续订关键因素</h3>
          </div>
          <RenewalFactors data={analytics.renewalFactors} />
        </div>
      </div>

      {/* Insights */}
      <div className="card-surface rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Lightbulb className="w-4 h-4 text-amber-300" />
          <h3 className="font-display text-lg text-cream-100">运营洞察建议</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {insights.map((ins) => {
            const Icon = ins.icon;
            return (
              <div
                key={ins.title}
                className="rounded-2xl border border-cream-100/5 bg-ink-800/40 p-5"
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${
                    ins.tone === "coral"
                      ? "bg-coral-300/10 text-coral-300"
                      : "bg-amber-300/10 text-amber-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-medium text-cream-100 leading-snug">{ins.title}</h4>
                <p className="text-xs text-cream-400 mt-2 leading-relaxed">{ins.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top rated products */}
      <div className="card-surface rounded-2xl p-6 mt-6">
        <h3 className="font-display text-lg text-cream-100 mb-4">好评商品 TOP 6</h3>
        <div className="space-y-2">
          {analytics.productTopRated.map((p, i) => (
            <div
              key={p.id}
              className="flex items-center gap-4 py-2.5 border-b border-cream-100/[0.03] last:border-0"
            >
              <span className="font-display text-lg text-cream-400/40 w-6">{i + 1}</span>
              <span className="text-sm text-cream-100 flex-1 truncate">{p.name}</span>
              <span className="text-xs text-cream-400">{p.reviewCount} 评价</span>
              <span className="font-mono text-sm text-amber-300 w-12 text-right">{p.rating}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
