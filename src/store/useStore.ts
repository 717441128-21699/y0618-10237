import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Product,
  BoxPeriod,
  UserProfile,
  ProductReview,
  UnsubscribeRecord,
  UnsubscribeReasonCategory,
  SubscriptionPlan,
  PreferenceTag,
  AnalyticsResult,
} from "@/lib/types";
import {
  SEED_PRODUCTS,
  SEED_BOX_PERIODS,
  SEED_REVIEWS,
  SEED_UNSUBSCRIBES,
  SEED_USER,
} from "@/lib/mockData";
import { matchProductsForUser, computeAnalytics, getProductMap } from "@/lib/engine";
import type { MatchResult } from "@/lib/engine";

interface AppState {
  products: Product[];
  boxPeriods: BoxPeriod[];
  currentUser: UserProfile | null;
  reviews: ProductReview[];
  unsubscribes: UnsubscribeRecord[];
  hydrated: boolean;
  unboxedPeriods: string[];

  createUserProfile: (profile: {
    name: string;
    email: string;
    preferenceTags: PreferenceTag[];
    allergies: string[];
    existingItems: string[];
    subscriptionPlan: SubscriptionPlan;
    address: string;
  }) => void;
  updateUserProfile: (patch: Partial<Pick<UserProfile, "preferenceTags" | "allergies" | "existingItems" | "subscriptionPlan" | "name" | "email" | "address" | "renewed">>) => void;
  updatePreferences: (patch: Partial<Pick<UserProfile, "preferenceTags" | "allergies" | "existingItems">>) => void;
  skipPeriod: (periodId: string) => void;
  unskipPeriod: (periodId: string) => void;
  submitReview: (review: Omit<ProductReview, "id" | "createdAt" | "userId">) => void;
  markUnboxed: (periodId: string) => void;
  unsubscribe: (reason: string, category: UnsubscribeReasonCategory) => void;
  resubscribe: () => void;
  resetDemo: () => void;

  addProduct: (product: Omit<Product, "id" | "avgRating" | "reviewCount">) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  findPeriodsUsingProduct: (productId: string) => BoxPeriod[];

  createBoxPeriod: (period: Omit<BoxPeriod, "id">) => void;
  updateBoxPeriod: (id: string, patch: Partial<BoxPeriod>) => void;
  deleteBoxPeriod: (id: string) => void;

  matchForUser: (period: BoxPeriod) => MatchResult;
  getAnalytics: () => AnalyticsResult;
}

function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      products: SEED_PRODUCTS,
      boxPeriods: SEED_BOX_PERIODS,
      currentUser: SEED_USER,
      reviews: SEED_REVIEWS,
      unsubscribes: SEED_UNSUBSCRIBES,
      hydrated: false,
      unboxedPeriods: [],

      createUserProfile: (profile) =>
        set({
          currentUser: {
            ...profile,
            id: uid("u"),
            subscribedAt: new Date().toISOString(),
            skippedPeriods: [],
            renewed: true,
            tagWeights: {
              运动: 1.0,
              美食: 1.0,
              美妆: 1.0,
              文创: 1.0,
              科技: 1.0,
              家居: 1.0,
              户外: 1.0,
              香氛: 1.0,
            },
            categoryWeights: {
              运动: 1.0,
              美食: 1.0,
              美妆: 1.0,
              文创: 1.0,
              科技: 1.0,
              家居: 1.0,
              香氛: 1.0,
              户外: 1.0,
            },
          },
        }),

      updatePreferences: (patch) =>
        set((state) => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, ...patch }
            : null,
        })),

      updateUserProfile: (patch) =>
        set((state) => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, ...patch }
            : null,
        })),

      skipPeriod: (periodId) =>
        set((state) => ({
          currentUser: state.currentUser
            ? {
                ...state.currentUser,
                skippedPeriods: state.currentUser.skippedPeriods.includes(
                  periodId,
                )
                  ? state.currentUser.skippedPeriods
                  : [...state.currentUser.skippedPeriods, periodId],
              }
            : null,
        })),

      unskipPeriod: (periodId) =>
        set((state) => ({
          currentUser: state.currentUser
            ? {
                ...state.currentUser,
                skippedPeriods: state.currentUser.skippedPeriods.filter(
                  (p) => p !== periodId,
                ),
              }
            : null,
        })),

      submitReview: (review) =>
        set((state) => {
          const existingIdx = state.reviews.findIndex(
            (r) =>
              r.productId === review.productId &&
              r.periodId === review.periodId &&
              r.userId === (state.currentUser?.id || "u_demo"),
          );
          if (existingIdx >= 0) return state;

          const product = state.products.find((p) => p.id === review.productId);
          const isLowScore = review.rating < 3;
          const isHighScore = review.rating >= 4;
          const isDuplicate = (review.comment?.includes("重复") ?? false) || review.likeScore < 30;

          const newTagWeights = { ...state.currentUser?.tagWeights };
          const newCategoryWeights = { ...state.currentUser?.categoryWeights };
          const newExistingItems = [...(state.currentUser?.existingItems ?? [])];

          if (product) {
            product.tags.forEach((tag) => {
              const current = newTagWeights[tag as keyof typeof newTagWeights] ?? 1;
              if (isHighScore) {
                newTagWeights[tag as keyof typeof newTagWeights] = Math.min(2.5, current + 0.2);
              } else if (isLowScore) {
                newTagWeights[tag as keyof typeof newTagWeights] = Math.max(0.3, current - 0.3);
              }
            });

            const catCurrent = newCategoryWeights[product.category as keyof typeof newCategoryWeights] ?? 1;
            if (isHighScore) {
              newCategoryWeights[product.category as keyof typeof newCategoryWeights] = Math.min(2.0, catCurrent + 0.15);
            } else if (isLowScore || isDuplicate) {
              newCategoryWeights[product.category as keyof typeof newCategoryWeights] = Math.max(0.4, catCurrent - 0.25);
            }

            if (isDuplicate && !newExistingItems.includes(product.name)) {
              newExistingItems.push(product.name);
            }
          }

          const newReview = {
            ...review,
            id: uid("r"),
            userId: state.currentUser?.id || "u_demo",
            createdAt: new Date().toISOString(),
          };

          return {
            reviews: [...state.reviews, newReview],
            products: state.products.map((p) => {
              if (p.id !== review.productId) return p;
              const newCount = p.reviewCount + 1;
              const newRating =
                Math.round(
                  ((p.avgRating * p.reviewCount + review.rating) / newCount) *
                    10,
                ) / 10;
              return { ...p, reviewCount: newCount, avgRating: newRating };
            }),
            currentUser: state.currentUser
              ? {
                  ...state.currentUser,
                  tagWeights: newTagWeights,
                  categoryWeights: newCategoryWeights,
                  existingItems: newExistingItems,
                }
              : null,
          };
        }),

      markUnboxed: (periodId) =>
        set((state) => ({
          unboxedPeriods: state.unboxedPeriods.includes(periodId)
            ? state.unboxedPeriods
            : [...state.unboxedPeriods, periodId],
        })),

      unsubscribe: (reason, category) =>
        set((state) => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, renewed: false }
            : null,
          unsubscribes: [
            ...state.unsubscribes,
            {
              id: uid("un"),
              userId: state.currentUser?.id || "u_demo",
              reason,
              reasonCategory: category,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      resubscribe: () =>
        set((state) => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, renewed: true }
            : null,
        })),

      resetDemo: () =>
        set({
          products: SEED_PRODUCTS,
          boxPeriods: SEED_BOX_PERIODS,
          currentUser: SEED_USER,
          reviews: SEED_REVIEWS,
          unsubscribes: SEED_UNSUBSCRIBES,
          unboxedPeriods: [],
        }),

      addProduct: (product) =>
        set((state) => ({
          products: [
            ...state.products,
            { ...product, id: uid("p"), avgRating: 0, reviewCount: 0 },
          ],
        })),

      updateProduct: (id, patch) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...patch } : p,
          ),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
          boxPeriods: state.boxPeriods.map((bp) => ({
            ...bp,
            products: bp.products.filter((pid) => pid !== id),
            alternatives: bp.alternatives.filter((pid) => pid !== id),
          })),
        })),

      findPeriodsUsingProduct: (productId) => {
        const { boxPeriods } = get();
        return boxPeriods.filter(
          (bp) =>
            bp.products.includes(productId) ||
            bp.alternatives.includes(productId),
        );
      },

      createBoxPeriod: (period) =>
        set((state) => ({
          boxPeriods: [...state.boxPeriods, { ...period, id: uid("bp") }],
        })),

      updateBoxPeriod: (id, patch) =>
        set((state) => ({
          boxPeriods: state.boxPeriods.map((bp) =>
            bp.id === id ? { ...bp, ...patch } : bp,
          ),
        })),

      deleteBoxPeriod: (id) =>
        set((state) => ({
          boxPeriods: state.boxPeriods.filter((bp) => bp.id !== id),
        })),

      matchForUser: (period) => {
        const { products, currentUser } = get();
        const productMap = getProductMap(products);
        if (!currentUser) return { picked: [], explanations: [], filtered: [] };
        return matchProductsForUser(currentUser, period, productMap);
      },

      getAnalytics: () => {
        const { reviews, unsubscribes, products, boxPeriods } = get();
        return computeAnalytics(reviews, unsubscribes, products, boxPeriods);
      },
    }),
    {
      name: "blindbox-monthly-store",
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    },
  ),
);
