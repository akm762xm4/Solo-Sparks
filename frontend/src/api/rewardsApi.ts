import { api } from "./api";

export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: "boost" | "content" | "achievement" | "cosmetic" | "feature";
  type: "instant" | "temporary" | "permanent";
  duration?: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  icon?: string;
  color?: string;
}

export interface Redemption {
  id: string;
  rewardId: string;
  rewardName: string;
  rewardDescription: string;
  cost: number;
  redeemedAt: string;
  status: "active" | "expired" | "used";
  expiresAt?: string;
  isExpired?: boolean;
}

export interface UserPoints {
  sparkPoints: number;
  questsAssigned: number;
  questsCompleted: number;
}

export const rewardsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRewards: builder.query<Reward[], { category?: string }>({
      query: (params) => ({
        url: "/rewards",
        params,
      }),
      providesTags: ["Rewards"],
    }),

    getUserPoints: builder.query<{ success: boolean; user: UserPoints }, void>({
      query: () => "/rewards/points",
      providesTags: ["User", "Rewards"],
    }),

    getRedemptionHistory: builder.query<
      { success: boolean; redemptions: Redemption[] },
      { status?: string; limit?: number }
    >({
      query: (params) => ({
        url: "/rewards/history",
        params,
      }),
      providesTags: ["Redemptions"],
    }),

    getActiveRedemptions: builder.query<
      { success: boolean; activeRedemptions: Redemption[] },
      void
    >({
      query: () => "/rewards/active",
      providesTags: ["Redemptions"],
    }),

    redeemReward: builder.mutation<
      {
        success: boolean;
        reward: Reward;
        remainingPoints: number;
        redemptionId: string;
      },
      { rewardId: string }
    >({
      query: (body) => ({
        url: "/rewards/redeem",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Rewards", "Redemptions"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRewardsQuery,
  useGetUserPointsQuery,
  useGetRedemptionHistoryQuery,
  useGetActiveRedemptionsQuery,
  useRedeemRewardMutation,
} = rewardsApi;
