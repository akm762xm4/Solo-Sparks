import { api } from "./api";
import type { ApiResponse } from "../types";

export interface UserProfile {
  _id: string;
  user: string;
  mood: {
    general: string;
    frequency: "rarely" | "sometimes" | "often" | "always";
    triggers: string[];
    copingMechanisms: string[];
  };
  personalityTraits: {
    mbti: string;
    enneagram: string;
    bigFive: {
      openness: number;
      conscientiousness: number;
      extraversion: number;
      agreeableness: number;
      neuroticism: number;
    };
  };
  emotionalNeeds: {
    primary: string[];
    secondary: string[];
    unmetNeeds: string[];
    supportPreferences: string[];
  };
  selfPerception: {
    strengths: string[];
    weaknesses: string[];
    growthAreas: string[];
    values: string[];
  };
  questResponses: {
    pastChallenges: string[];
    copingStrategies: string[];
    futureGoals: string[];
    supportSystem: string[];
  };
  completedSteps: string[];
  isOnboardingComplete: boolean;
  lastUpdated: string;
  moodLog?: {
    date: string;
    general: string;
    frequency: string;
    triggers: string[];
    copingMechanisms: string[];
  }[];
}

export const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ApiResponse<UserProfile>, void>({
      query: () => "/profile",
      providesTags: ["Profile"],
    }),
    updateProfileStep: builder.mutation<
      ApiResponse<UserProfile>,
      { step: string; data: any }
    >({
      query: ({ step, data }) => ({
        url: `/profile/step/${step}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),
    skipProfileStep: builder.mutation<ApiResponse<UserProfile>, string>({
      query: (step) => ({
        url: `/profile/step/${step}/skip`,
        method: "POST",
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileStepMutation,
  useSkipProfileStepMutation,
} = profileApi;
