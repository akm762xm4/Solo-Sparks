import { api } from "./api";

// Backend Quest Interface
export interface BackendQuest {
  title: string;
  description: string;
  type: "daily" | "weekly";
  suggestedBy: string;
}

// Frontend Quest Interface with enhanced fields
export interface Quest {
  id: string;
  title: string;
  description: string;
  category: "emotional" | "productivity" | "social" | "physical" | "creative";
  status: "active" | "completed" | "locked";
  progress: number;
  difficulty: "easy" | "medium" | "hard";
  reward: number;
  dueDate?: string;
  estimatedTime: string;
  type: "daily" | "weekly";
  suggestedBy: string;
  createdAt?: string;
  completedAt?: string;
}

// Quest completion request
export interface CompleteQuestRequest {
  questId: string;
  reflectionText?: string;
}

export const questApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTodayQuest: builder.query<
      { success: boolean; data: BackendQuest },
      void
    >({
      query: () => "/quests/today",
      providesTags: ["Quest"],
    }),

    // Get quest history for the user
    getQuestHistory: builder.query<Quest[], void>({
      query: () => "/quests/history",
      providesTags: ["Quest"],
    }),

    // Complete a quest
    completeQuest: builder.mutation<
      { success: boolean; data: Quest },
      CompleteQuestRequest
    >({
      query: (body) => ({
        url: "/quests/complete",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Quest", "User"],
    }),

    // Get current active quests
    getActiveQuests: builder.query<Quest[], void>({
      query: () => "/quests/active",
      providesTags: ["Quest"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTodayQuestQuery,
  useGetQuestHistoryQuery,
  useCompleteQuestMutation,
  useGetActiveQuestsQuery,
} = questApi;
