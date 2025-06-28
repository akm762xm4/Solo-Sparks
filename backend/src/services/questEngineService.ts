import UserProfile from "../models/userProfileModel";
import User from "../models/userModel";

export interface Quest {
  title: string;
  description: string;
  type: "daily" | "weekly";
  suggestedBy: string;
}

// Example quest templates
const questTemplates: Quest[] = [
  {
    title: "Gratitude Journal",
    description: "Write down three things you are grateful for today.",
    type: "daily",
    suggestedBy: "system",
  },
  {
    title: "Reach Out",
    description:
      "Send a message to a friend or family member you haven't spoken to in a while.",
    type: "daily",
    suggestedBy: "system",
  },
  {
    title: "Mindful Walk",
    description: "Take a 10-minute walk and focus on your surroundings.",
    type: "daily",
    suggestedBy: "system",
  },
  {
    title: "Reflect on a Challenge",
    description: "Write about a recent challenge and how you handled it.",
    type: "weekly",
    suggestedBy: "system",
  },
  {
    title: "Try a New Coping Mechanism",
    description:
      "Pick a coping mechanism you haven't tried before and use it today.",
    type: "weekly",
    suggestedBy: "system",
  },
];

// Simple rules-based quest selection
export async function getPersonalizedQuest(userId: string): Promise<Quest> {
  // Increment questsAssigned
  await User.findByIdAndUpdate(userId, { $inc: { questsAssigned: 1 } });
  const profile = await UserProfile.findOne({ user: userId });
  if (!profile) {
    // Default quest if no profile
    return questTemplates[0];
  }

  // Example: If user is often stressed, suggest a mindfulness quest
  if (
    profile.mood?.general === "Stressed" ||
    profile.mood?.frequency === "often" ||
    profile.mood?.copingMechanisms?.length < 2
  ) {
    return (
      questTemplates.find((q) => q.title === "Mindful Walk") ||
      questTemplates[0]
    );
  }

  // Example: If user values connection, suggest Reach Out
  if (profile.emotionalNeeds?.primary?.includes("Connection")) {
    return (
      questTemplates.find((q) => q.title === "Reach Out") || questTemplates[0]
    );
  }

  // Example: If user is working on gratitude, suggest Gratitude Journal
  if (profile.selfPerception?.growthAreas?.includes("Gratitude")) {
    return (
      questTemplates.find((q) => q.title === "Gratitude Journal") ||
      questTemplates[0]
    );
  }

  // Otherwise, rotate quests by week/day
  const day = new Date().getDate();
  return questTemplates[day % questTemplates.length];
}
