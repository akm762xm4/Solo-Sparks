import { toast } from "../components/ui/CustomToaster";

// Re-export toast functions for easy use
export { toast };

// Convenience functions for common toast types
export const showSuccess = (message: string) => {
  toast.success(message);
};

export const showError = (message: string) => {
  toast.error(message);
};

export const showWarning = (message: string) => {
  toast.warning(message);
};

export const showInfo = (message: string) => {
  toast.info(message);
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
