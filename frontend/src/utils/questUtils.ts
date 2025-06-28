import type { BackendQuest, Quest } from "../api/questApi";

export type QuestCategory =
  | "emotional"
  | "productivity"
  | "social"
  | "physical"
  | "creative";
export type QuestDifficulty = "easy" | "medium" | "hard";
export type QuestStatus = "active" | "completed" | "locked";

// Category mapping based on quest title and description
export const getQuestCategory = (
  title: string,
  description: string
): QuestCategory => {
  const text = `${title} ${description}`.toLowerCase();

  if (
    text.includes("gratitude") ||
    text.includes("mindful") ||
    text.includes("emotion") ||
    text.includes("feel")
  ) {
    return "emotional";
  }
  if (
    text.includes("reach") ||
    text.includes("friend") ||
    text.includes("family") ||
    text.includes("message") ||
    text.includes("connection")
  ) {
    return "social";
  }
  if (
    text.includes("walk") ||
    text.includes("physical") ||
    text.includes("workout") ||
    text.includes("exercise")
  ) {
    return "physical";
  }
  if (
    text.includes("coping") ||
    text.includes("challenge") ||
    text.includes("organize") ||
    text.includes("task")
  ) {
    return "productivity";
  }
  if (
    text.includes("creative") ||
    text.includes("artistic") ||
    text.includes("draw") ||
    text.includes("paint") ||
    text.includes("write") ||
    text.includes("music")
  ) {
    return "creative";
  }

  return "emotional"; // default
};

// Difficulty mapping based on quest type
export const getQuestDifficulty = (
  type: "daily" | "weekly"
): QuestDifficulty => {
  switch (type) {
    case "daily":
      return "easy";
    case "weekly":
      return "medium";
    default:
      return "easy";
  }
};

// Reward points based on quest type and difficulty
export const getQuestReward = (
  type: "daily" | "weekly",
  difficulty: QuestDifficulty
): number => {
  const baseReward = type === "daily" ? 50 : 100;
  const difficultyMultiplier =
    difficulty === "easy" ? 1 : difficulty === "medium" ? 1.5 : 2;
  return Math.round(baseReward * difficultyMultiplier);
};

// Estimated time based on quest type
export const getEstimatedTime = (type: "daily" | "weekly"): string => {
  switch (type) {
    case "daily":
      return "15 min";
    case "weekly":
      return "30 min";
    default:
      return "20 min";
  }
};

// Generate due date based on quest type
export const getDueDate = (type: "daily" | "weekly"): string => {
  const now = new Date();
  if (type === "daily") {
    // Due by end of today
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay.toISOString();
  } else {
    // Due by end of week (Sunday)
    const endOfWeek = new Date(now);
    const daysUntilSunday = 7 - endOfWeek.getDay();
    endOfWeek.setDate(endOfWeek.getDate() + daysUntilSunday);
    endOfWeek.setHours(23, 59, 59, 999);
    return endOfWeek.toISOString();
  }
};

// Calculate quest status based on completion date and due date
export const getQuestStatus = (
  completedAt?: string,
  dueDate?: string
): QuestStatus => {
  if (completedAt) {
    return "completed";
  }

  if (!dueDate) {
    return "active";
  }

  const now = new Date();
  const due = new Date(dueDate);

  if (now > due) {
    return "locked"; // Past due
  }

  return "active";
};

// Calculate progress based on quest type and completion
export const getQuestProgress = (
  status: QuestStatus,
  type: "daily" | "weekly" = "daily"
): number => {
  if (status === "completed") {
    return 100;
  }

  if (status === "locked") {
    return 0;
  }

  // For active quests, calculate progress based on time elapsed
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  if (type === "daily") {
    const elapsed = now.getTime() - startOfDay.getTime();
    const total = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    return Math.min(Math.round((elapsed / total) * 100), 90); // Max 90% until completed
  } else {
    // Weekly quests start at 0% and can be completed anytime
    return 0;
  }
};

// Transform backend quest to frontend quest
export const transformBackendQuest = (
  backendQuest: BackendQuest,
  questId: string,
  completedAt?: string,
  createdAt?: string
): Quest => {
  const category = getQuestCategory(
    backendQuest.title,
    backendQuest.description
  );
  const difficulty = getQuestDifficulty(backendQuest.type);
  const reward = getQuestReward(backendQuest.type, difficulty);
  const estimatedTime = getEstimatedTime(backendQuest.type);
  const dueDate = getDueDate(backendQuest.type);
  const status = getQuestStatus(completedAt, dueDate);
  const progress = getQuestProgress(status, backendQuest.type);

  return {
    id: questId,
    title: backendQuest.title,
    description: backendQuest.description,
    category,
    status,
    progress,
    difficulty,
    reward,
    dueDate,
    estimatedTime,
    type: backendQuest.type,
    suggestedBy: backendQuest.suggestedBy,
    createdAt: createdAt || new Date().toISOString(),
    completedAt,
  };
};

// Generate a unique quest ID
export const generateQuestId = (title: string, createdAt: string): string => {
  const timestamp = new Date(createdAt).getTime();
  const titleHash = title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .substring(0, 10);
  return `${titleHash}-${timestamp}`;
};

// Get category icon and colors
export const getCategoryIcon = (category: QuestCategory) => {
  const icons = {
    emotional: "Heart",
    productivity: "Zap",
    social: "Brain",
    physical: "TrendingUp",
    creative: "Star",
  };
  return icons[category];
};

export const getCategoryColors = (category: QuestCategory) => {
  const colors = {
    emotional: "from-pink-500 to-red-500",
    productivity: "from-blue-500 to-cyan-500",
    social: "from-purple-500 to-pink-500",
    physical: "from-green-500 to-emerald-500",
    creative: "from-yellow-500 to-orange-500",
  };
  return colors[category];
};

export const getDifficultyColors = (difficulty: QuestDifficulty) => {
  const colors = {
    easy: "text-green-400",
    medium: "text-yellow-400",
    hard: "text-red-400",
  };
  return colors[difficulty];
};
