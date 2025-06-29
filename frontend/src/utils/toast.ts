import { toast } from "../components/ui/CustomToaster";

// Re-export toast functions for easy use
export { toast };

// Convenience functions for common toast types
export const showSuccess = (message: string, description?: string) => {
  toast.success(message, {
    description,
  });
};

export const showError = (message: string, description?: string) => {
  toast.error(message, {
    description,
  });
};

export const showWarning = (message: string, description?: string) => {
  toast.warning(message, {
    description,
  });
};

export const showInfo = (message: string, description?: string) => {
  toast.info(message, {
    description,
  });
};

// Special toast for quest completions
export const showQuestComplete = (questTitle: string, points: number) => {
  toast.success(`🎉 Quest Complete: ${questTitle}`, {
    description: `You earned ${points} Spark Points!`,
  });
};

// Special toast for reflection submissions
export const showReflectionSubmitted = (points: number) => {
  toast.success("📝 Reflection Submitted", {
    description: `You earned ${points} Spark Points for your reflection!`,
  });
};

// Special toast for reward redemptions
export const showRewardRedeemed = (rewardName: string) => {
  toast.success("🎁 Reward Redeemed", {
    description: `You've successfully redeemed: ${rewardName}`,
  });
};
