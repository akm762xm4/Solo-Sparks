export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: "boost" | "content" | "achievement" | "cosmetic" | "feature";
  type: "instant" | "temporary" | "permanent";
  duration?: number; // in hours, for temporary rewards
  rarity: "common" | "rare" | "epic" | "legendary";
  icon?: string;
  color?: string;
}

export const REWARDS: Reward[] = [
  // Boosts
  {
    id: "productivity_boost",
    name: "Productivity Boost",
    description:
      "Get a 24-hour productivity boost with enhanced focus and motivation.",
    cost: 50,
    category: "boost",
    type: "temporary",
    duration: 24,
    rarity: "common",
    icon: "⚡",
    color: "blue",
  },
  {
    id: "mood_boost",
    name: "Mood Enhancement",
    description:
      "Experience improved mood and emotional well-being for 12 hours.",
    cost: 75,
    category: "boost",
    type: "temporary",
    duration: 12,
    rarity: "common",
    icon: "😊",
    color: "yellow",
  },
  {
    id: "energy_boost",
    name: "Energy Surge",
    description:
      "Feel energized and motivated for 8 hours of peak performance.",
    cost: 100,
    category: "boost",
    type: "temporary",
    duration: 8,
    rarity: "rare",
    icon: "🔥",
    color: "orange",
  },

  // Content
  {
    id: "exclusive_content",
    name: "Exclusive Content",
    description: "Unlock premium mental wellness content and guided sessions.",
    cost: 150,
    category: "content",
    type: "permanent",
    rarity: "rare",
    icon: "📚",
    color: "purple",
  },
  {
    id: "advanced_analytics",
    name: "Advanced Analytics",
    description: "Access detailed progress analytics and insights for 7 days.",
    cost: 200,
    category: "content",
    type: "temporary",
    duration: 168, // 7 days
    rarity: "epic",
    icon: "📊",
    color: "green",
  },
  {
    id: "personal_coach",
    name: "AI Personal Coach",
    description: "Get personalized coaching and recommendations for 24 hours.",
    cost: 300,
    category: "content",
    type: "temporary",
    duration: 24,
    rarity: "epic",
    icon: "🤖",
    color: "cyan",
  },

  // Achievements
  {
    id: "streak_master",
    name: "Streak Master",
    description:
      "Unlock the Streak Master achievement for consistent daily practice.",
    cost: 500,
    category: "achievement",
    type: "permanent",
    rarity: "legendary",
    icon: "🏆",
    color: "gold",
  },
  {
    id: "reflection_expert",
    name: "Reflection Expert",
    description: "Earn the Reflection Expert badge for deep self-awareness.",
    cost: 400,
    category: "achievement",
    type: "permanent",
    rarity: "epic",
    icon: "🧠",
    color: "indigo",
  },
  {
    id: "quest_champion",
    name: "Quest Champion",
    description: "Achieve Quest Champion status for completing many quests.",
    cost: 600,
    category: "achievement",
    type: "permanent",
    rarity: "legendary",
    icon: "⚔️",
    color: "red",
  },

  // Cosmetic
  {
    id: "custom_theme",
    name: "Custom Theme",
    description: "Unlock a beautiful custom theme for your app interface.",
    cost: 250,
    category: "cosmetic",
    type: "permanent",
    rarity: "rare",
    icon: "🎨",
    color: "pink",
  },
  {
    id: "profile_badge",
    name: "Profile Badge",
    description:
      "Display a special badge on your profile to show your achievements.",
    cost: 100,
    category: "cosmetic",
    type: "permanent",
    rarity: "common",
    icon: "🏅",
    color: "silver",
  },

  // Features
  {
    id: "priority_support",
    name: "Priority Support",
    description: "Get priority customer support for 30 days.",
    cost: 350,
    category: "feature",
    type: "temporary",
    duration: 720, // 30 days
    rarity: "epic",
    icon: "🎯",
    color: "violet",
  },
  {
    id: "export_data",
    name: "Data Export",
    description: "Export your progress data and reflections for backup.",
    cost: 150,
    category: "feature",
    type: "permanent",
    rarity: "rare",
    icon: "📤",
    color: "teal",
  },
];

// Helper functions
export const getRewardById = (id: string): Reward | undefined => {
  return REWARDS.find((reward) => reward.id === id);
};

export const getRewardsByCategory = (
  category: Reward["category"]
): Reward[] => {
  return REWARDS.filter((reward) => reward.category === category);
};

export const getRewardsByRarity = (rarity: Reward["rarity"]): Reward[] => {
  return REWARDS.filter((reward) => reward.rarity === rarity);
};

export const getAffordableRewards = (points: number): Reward[] => {
  return REWARDS.filter((reward) => reward.cost <= points);
};
