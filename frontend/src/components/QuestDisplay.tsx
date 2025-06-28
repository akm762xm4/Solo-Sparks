import { useState, useCallback } from "react";
import { useGetTodayQuestQuery } from "../api/questApi";
import { GlassCard } from "./ui/GlassCard";
import { NeonGlowButton } from "./ui/NeonGlowButton";
import { SkipForward, ClipboardList } from "lucide-react";

const MAX_SKIPS_PER_WEEK = 2;

// Loading spinner component
const QuestLoading = () => (
  <GlassCard className="flex items-center justify-center h-40">
    <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent" />
  </GlassCard>
);

// Empty state component
const QuestEmpty = () => (
  <GlassCard borderColor="accent" className="text-center text-gray-500">
    <div className="flex flex-col items-center gap-2 py-8">
      <ClipboardList className="w-10 h-10 text-accent-500 drop-shadow-glow" />
      <span>No quest available.</span>
    </div>
  </GlassCard>
);

// Custom hook for skip logic (for future backend integration)
function useQuestSkips(maxSkips: number) {
  const [skipsLeft, setSkipsLeft] = useState(maxSkips);
  const skip = useCallback(() => {
    if (skipsLeft > 0) {
      setSkipsLeft((s) => s - 1);
      return true;
    }
    return false;
  }, [skipsLeft]);
  return { skipsLeft, skip };
}

/**
 * QuestDisplay shows the user's current quest, allows refresh and skip.
 * Styled with Nexus OS glassmorphism and neon glow buttons.
 */
export const QuestDisplay = () => {
  const { data, isLoading, isFetching, refetch } = useGetTodayQuestQuery();
  const { skipsLeft, skip } = useQuestSkips(MAX_SKIPS_PER_WEEK);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleSkip = useCallback(() => {
    if (skip()) {
      refetch(); // In real app, call skip endpoint
    }
  }, [skip, refetch]);

  if (isLoading || isFetching) return <QuestLoading />;
  if (!data?.data) return <QuestEmpty />;

  const quest = data.data;

  return (
    <GlassCard borderColor="primary" className=" mx-auto my-8">
      <div className="flex items-center gap-4 mb-4">
        <ClipboardList className="w-10 h-10 text-primary-500 drop-shadow-glow" />
        <h2 className="text-2xl font-bold text-primary-500 tracking-tight drop-shadow-glow">
          Your Current Quest
        </h2>
      </div>
      <div className="mb-4">
        <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {quest.title}
        </div>
        <div className="text-gray-700 dark:text-gray-200 mt-1">
          {quest.description}
        </div>
        <div className="mt-2 text-xs text-accent-400 font-mono">
          Type: {quest.type}
        </div>
      </div>
      <div className="flex gap-2 mt-6">
        <NeonGlowButton
          color="secondary"
          onClick={handleRefresh}
          type="button"
          aria-label="Refresh quest"
        >
          <span>Refresh</span>
        </NeonGlowButton>
        <NeonGlowButton
          color="accent"
          onClick={handleSkip}
          type="button"
          disabled={skipsLeft === 0}
          className="flex items-center gap-1"
          aria-label={`Skip quest, ${skipsLeft} skips left this week`}
        >
          <SkipForward className="w-5 h-5" />
          <span>Skip ({skipsLeft}/2)</span>
        </NeonGlowButton>
      </div>
    </GlassCard>
  );
};
