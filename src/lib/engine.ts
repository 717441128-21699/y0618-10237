import type {
  Product,
  BoxPeriod,
  UserProfile,
  ProductReview,
  UnsubscribeRecord,
  AnalyticsResult,
  UnsubscribeReasonCategory,
} from "./types";
import { REASON_LABELS } from "./types";
import { SEED_SUBSCRIBER_TREND } from "./mockData";

export function getProductMap(products: Product[]): Map<string, Product> {
  const map = new Map<string, Product>();
  products.forEach((p) => map.set(p.id, p));
  return map;
}

export interface MatchExplanation {
  productId: string;
  score: number;
  tagHits: string[];
  isAlternative: boolean;
}

export function matchProductsForUser(
  user: UserProfile,
  period: BoxPeriod,
  productMap: Map<string, Product>,
): { picked: string[]; explanations: MatchExplanation[] } {
  const candidates = [
    ...period.products.map((id) => ({ id, isAlt: false })),
    ...period.alternatives.map((id) => ({ id, isAlt: true })),
  ];

  const safe = candidates.filter(({ id }) => {
    const p = productMap.get(id);
    if (!p) return false;
    const hasAllergen = p.allergens.some((a) => user.allergies.includes(a));
    const isDuplicate = user.existingItems.some(
      (i) => p.name.includes(i) || p.category.includes(i),
    );
    return !hasAllergen && !isDuplicate;
  });

  const scored: MatchExplanation[] = safe.map(({ id, isAlt }) => {
    const p = productMap.get(id)!;
    const tagHits = p.tags.filter((t) => user.preferenceTags.includes(t));
    const score = tagHits.length * 2 + p.avgRating;
    return { productId: id, score, tagHits, isAlternative: isAlt };
  });

  scored.sort((a, b) => b.score - a.score);

  let picked = scored.slice(0, 3).map((s) => s.productId);
  if (picked.length < 3) {
    const remaining = scored.slice(3).map((s) => s.productId);
    picked = [...picked, ...remaining];
  }
  const pickedSet = new Set(picked);
  const explanations = scored.filter((s) => pickedSet.has(s.productId));

  return { picked, explanations };
}

export function isPeriodSkipped(user: UserProfile | null, periodId: string): boolean {
  return !!user?.skippedPeriods.includes(periodId);
}

export function computeAnalytics(
  reviews: ProductReview[],
  unsubscribes: UnsubscribeRecord[],
  products: Product[],
  boxPeriods: BoxPeriod[],
): AnalyticsResult {
  const productMap = getProductMap(products);
  const totalSubscribers = 1520;
  const activeSubscribers = totalSubscribers - unsubscribes.length;

  const renewed = SEED_SUBSCRIBER_TREND[SEED_SUBSCRIBER_TREND.length - 1].renewed;
  const prev = SEED_SUBSCRIBER_TREND[SEED_SUBSCRIBER_TREND.length - 2].renewed;
  const renewalRate = Math.round((renewed / (prev || 1)) * 100);

  const avgRating =
    reviews.length > 0
      ? Math.round(
          (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10,
        ) / 10
      : 0;

  const skipRate = 8;

  const reasonCounts = new Map<UnsubscribeReasonCategory, number>();
  unsubscribes.forEach((u) => {
    reasonCounts.set(u.reasonCategory, (reasonCounts.get(u.reasonCategory) || 0) + 1);
  });
  const unsubscribeReasons = Array.from(reasonCounts.entries())
    .map(([category, count]) => ({ category, label: REASON_LABELS[category], count }))
    .sort((a, b) => b.count - a.count);

  const periodRatings = boxPeriods
    .filter((bp) => bp.status === "delivered")
    .map((bp) => {
      const pr = reviews.filter((r) => r.periodId === bp.id);
      const rating =
        pr.length > 0
          ? Math.round((pr.reduce((s, r) => s + r.rating, 0) / pr.length) * 10) / 10
          : 0;
      return { periodLabel: bp.periodLabel, rating, reviewCount: pr.length };
    })
    .reverse();

  const renewalFactors = [
    {
      factor: "偏好匹配度",
      impact: 87,
      description: "标签命中越高的用户续订率越高，影响最显著。",
    },
    {
      factor: "禁忌冲突次数",
      impact: -64,
      description: "过敏或重复物品冲突直接拉低续订意愿。",
    },
    {
      factor: "本期平均好评",
      impact: 72,
      description: "收货后整体评分与下一期续订强相关。",
    },
    {
      factor: "跳过本期频率",
      impact: -41,
      description: "频繁跳过的用户流失风险上升。",
    },
    {
      factor: "开箱完成率",
      impact: 55,
      description: "完整体验开箱流程的用户更易留存。",
    },
  ];

  const productTopRated = products
    .map((p) => ({
      id: p.id,
      name: p.name,
      rating: p.avgRating,
      reviewCount: p.reviewCount,
    }))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  void productMap;

  return {
    totalSubscribers,
    activeSubscribers,
    renewalRate,
    avgRating,
    skipRate,
    subscriberTrend: SEED_SUBSCRIBER_TREND,
    unsubscribeReasons,
    periodRatings,
    renewalFactors,
    productTopRated,
  };
}

export function formatDeadline(deadlineISO: string): {
  date: string;
  daysLeft: number;
} {
  const target = new Date(deadlineISO).getTime();
  const now = Date.now();
  const daysLeft = Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24)));
  const date = new Date(deadlineISO).toLocaleDateString("zh-CN", {
    month: "long",
    day: "numeric",
  });
  return { date, daysLeft };
}
