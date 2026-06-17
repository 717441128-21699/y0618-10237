export type PreferenceTag =
  | "运动"
  | "美食"
  | "美妆"
  | "文创"
  | "科技"
  | "家居"
  | "户外"
  | "香氛";

export type ProductCategory =
  | "运动"
  | "美食"
  | "美妆"
  | "文创"
  | "科技"
  | "家居"
  | "香氛"
  | "户外";

export interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  category: ProductCategory;
  tags: PreferenceTag[];
  allergens: string[];
  avgRating: number;
  reviewCount: number;
}

export type BoxPeriodStatus = "preview" | "shipping" | "delivered";

export interface BoxPeriod {
  id: string;
  periodLabel: string;
  theme: string;
  themeDescription: string;
  themeMoodImage: string;
  keywords: string[];
  products: string[];
  alternatives: string[];
  shipDeadline: string;
  status: BoxPeriodStatus;
}

export type SubscriptionPlan = "monthly" | "quarterly" | "annual";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  preferenceTags: PreferenceTag[];
  allergies: string[];
  existingItems: string[];
  subscriptionPlan: SubscriptionPlan;
  address: string;
  subscribedAt: string;
  skippedPeriods: string[];
  renewed: boolean;
  tagWeights: Record<PreferenceTag, number>;
}

export interface ProductReview {
  id: string;
  userId: string;
  periodId: string;
  productId: string;
  rating: number;
  likeScore: number;
  comment: string;
  createdAt: string;
}

export type UnsubscribeReasonCategory =
  | "preference_mismatch"
  | "allergy_conflict"
  | "duplicate_item"
  | "price"
  | "low_value"
  | "other";

export interface UnsubscribeRecord {
  id: string;
  userId: string;
  reason: string;
  reasonCategory: UnsubscribeReasonCategory;
  createdAt: string;
}

export interface RenewalFactor {
  factor: string;
  impact: number;
  description: string;
}

export interface AnalyticsResult {
  totalSubscribers: number;
  activeSubscribers: number;
  renewalRate: number;
  avgRating: number;
  skipRate: number;
  subscriberTrend: { period: string; subscribers: number; renewed: number }[];
  unsubscribeReasons: { category: UnsubscribeReasonCategory; label: string; count: number }[];
  periodRatings: { periodLabel: string; rating: number; reviewCount: number }[];
  renewalFactors: RenewalFactor[];
  productTopRated: { id: string; name: string; rating: number; reviewCount: number }[];
}

export const PLAN_OPTIONS: {
  id: SubscriptionPlan;
  name: string;
  price: number;
  perBox: number;
  period: string;
  highlight?: boolean;
  perks: string[];
}[] = [
  {
    id: "monthly",
    name: "月度尝鲜",
    price: 168,
    perBox: 168,
    period: "每月一盒",
    perks: ["每月精选 3 件好物", "随时取消", "偏好随时调整", "免运费"],
  },
  {
    id: "quarterly",
    name: "季度订阅",
    price: 458,
    perBox: 152,
    period: "3 个月 · 省 14%",
    highlight: true,
    perks: ["每月精选 3 件好物", "锁定价格 3 期", "专属主题优先", "免运费"],
  },
  {
    id: "annual",
    name: "年度狂热",
    price: 1688,
    perBox: 140,
    period: "12 个月 · 省 17%",
    perks: ["每月精选 3 件好物", "年度限定礼盒", "生日加倍惊喜", "免运费"],
  },
];

export const REASON_LABELS: Record<UnsubscribeReasonCategory, string> = {
  preference_mismatch: "偏好匹配不符",
  allergy_conflict: "过敏成分冲突",
  duplicate_item: "收到重复物品",
  price: "价格偏高",
  low_value: "性价比不足",
  other: "其他原因",
};

export const PREFERENCE_TAG_LIST: PreferenceTag[] = [
  "运动",
  "美食",
  "美妆",
  "文创",
  "科技",
  "家居",
  "户外",
  "香氛",
];

export const COMMON_ALLERGENS = [
  "坚果",
  "乳制品",
  "麸质",
  "海鲜",
  "酒精",
  "花粉",
  "香精",
  "金属饰品",
];
