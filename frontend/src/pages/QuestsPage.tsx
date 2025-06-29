import React, { useState } from "react";
import {
  Target,
  Filter,
  CheckCircle,
  Clock,
  Star,
  Heart,
  Brain,
  Zap,
  Play,
  Award,
  TrendingUp,
  LayoutDashboard,
} from "lucide-react";
import { Link } from "react-router-dom";
import { GlassCard } from "../components/ui/GlassCard";
import { NeonGlowButton } from "../components/ui/NeonGlowButton";
import { NeonProgressBar } from "../components/ui/NeonProgressBar";
import { StatWidget } from "../components/ui/StatWidget";
import { Modal } from "../components/ui/Modal";
import { EmptyState } from "../components/ui/EmptyState";
import {
  QuestCardSkeleton,
  QuestProgressSkeleton,
  QuestStatsSkeleton,
} from "../components/ui/Skeleton";
import {
  useGetTodayQuestQuery,
  useGetQuestHistoryQuery,
  useStartQuestMutation,
  useCompleteQuestMutation,
  useGetActiveQuestsQuery,
  type Quest,
} from "../api/questApi";
import {
  transformBackendQuest,
  generateQuestId,
  getCategoryColors,
  getDifficultyColors,
} from "../utils/questUtils";
import { DropdownFilter } from "./ReflectionsPage";
import { toast } from "sonner";

const categoryIcons = {
  emotional: Heart,
  productivity: Zap,
  social: Brain,
  physical: TrendingUp,
  creative: Star,
};

export const QuestsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [reflectionText, setReflectionText] = useState("");

  // Fetch quest data from backend
  const { data: todayQuestData, isLoading: isLoadingTodayQuest } =
    useGetTodayQuestQuery();
  const { data: questHistory = [], isLoading: isLoadingHistory } =
    useGetQuestHistoryQuery();
  const { data: activeQuests = [], isLoading: isLoadingActive } =
    useGetActiveQuestsQuery();
  const [startQuest, { isLoading: isStarting }] = useStartQuestMutation();
  const [completeQuest, { isLoading: isCompleting }] =
    useCompleteQuestMutation();

  // Transform today's quest to frontend format
  const todayQuest = todayQuestData?.data
    ? transformBackendQuest(
        todayQuestData.data,
        generateQuestId(todayQuestData.data.title, new Date().toISOString()),
        undefined,
        new Date().toISOString()
      )
    : null;

  // Combine all quests
  const allQuests = [
    ...(todayQuest ? [todayQuest] : []),
    ...questHistory,
    ...activeQuests,
  ];

  // Remove duplicates based on title and creation date
  const uniqueQuests = allQuests.filter(
    (quest, index, self) =>
      index ===
      self.findIndex(
        (q) => q.title === quest.title && q.createdAt === quest.createdAt
      )
  );

  const categories = [
    { id: "all", name: "All Quests", icon: Target },
    { id: "emotional", name: "Emotional", icon: Heart },
    { id: "productivity", name: "Productivity", icon: Zap },
    { id: "social", name: "Social", icon: Brain },
    { id: "physical", name: "Physical", icon: TrendingUp },
    { id: "creative", name: "Creative", icon: Star },
  ];

  const statuses = [
    { id: "all", name: "All Statuses", icon: Target },
    { id: "active", name: "Active", icon: Clock },
    { id: "completed", name: "Completed", icon: CheckCircle },
    { id: "locked", name: "Locked", icon: Award },
  ];

  const filteredQuests = uniqueQuests.filter((quest) => {
    const categoryMatch =
      selectedCategory === "all" || quest.category === selectedCategory;
    const statusMatch =
      selectedStatus === "all" || quest.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  const handleStartQuest = async (quest: Quest) => {
    try {
      // Validate quest can be started
      if (quest.status === "locked") {
        toast.warning("🔒 Quest Locked", {
          description: "Complete prerequisite quests first",
        });
        return;
      }

      if (quest.status === "active") {
        toast.info("⏳ Already in Progress", {
          description: "This quest is already active",
        });
        return;
      }

      // Call backend to start quest
      await startQuest({ questId: quest.id }).unwrap();

      // Show success message
      toast.success("🚀 Quest Launched!", {
        description: `"${quest.title}" is now active. Good luck!`,
      });
    } catch (error) {
      console.error("Failed to start quest:", error);
      toast.error("❌ Failed to Start Quest", {
        description: "Please try again or contact support",
      });
    }
  };

  const handleCompleteQuest = (quest: Quest) => {
    setSelectedQuest(quest);
    setShowCompleteModal(true);
  };

  const confirmCompleteQuest = async () => {
    if (!selectedQuest) return;

    try {
      await completeQuest({
        questId: selectedQuest.id,
        reflectionText: reflectionText.trim() || undefined,
      }).unwrap();

      setShowCompleteModal(false);
      toast.success("Quest completed successfully!");
      setSelectedQuest(null);
      setReflectionText("");
    } catch (error) {
      console.error("Failed to complete quest:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-primary-500";
      case "completed":
        return "text-accent-500";
      case "locked":
        return "text-text-muted";
      default:
        return "text-text-secondary";
    }
  };

  const isLoading = isLoadingTodayQuest || isLoadingHistory || isLoadingActive;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-background-900 text-black dark:text-white p-4 lg:p-6">
        {/* Header */}
        <div className="container-glass mb-8">
          <Link
            to="/dashboard"
            className="glass-card-primary px-4 py-2 w-max flex items-center gap-2 hover:shadow-glow transition-all text-black dark:text-white ml-auto md:ml-0 mb-4"
          >
            <LayoutDashboard className="w-5 h-5 text-primary-500" />
            <span className="font-semibold">Back to Dashboard</span>
          </Link>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="heading-1 text-4xl lg:text-5xl mb-2 ">
                Quest Hub
              </h1>
              <p className="body-medium text-gray-500 dark:text-gray-300">
                Embark on your personal growth journey
              </p>
            </div>
            <div className="flex items-center gap-4 mt-4 lg:mt-0">
              <StatWidget
                icon={<Target className="w-5 h-5 text-primary-500" />}
                label="Active"
                value={0}
                color="primary"
              />
            </div>
          </div>
        </div>

        <div className="container-glass">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="xl:col-span-3">
              {/* Filters */}
              <GlassCard className="mb-8 p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-48">
                    <h3 className="heading-3 mb-4 flex items-center text-black dark:text-white">
                      <Filter className="w-5 h-5 mr-2" />
                      Category
                    </h3>
                    <div className="space-y-2">
                      {categories.slice(0, 3).map((category) => (
                        <div
                          key={category.id}
                          className="h-10 bg-white/5 rounded-lg animate-pulse"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="lg:w-48">
                    <h3 className="heading-3 mb-4 flex items-center text-black dark:text-white">
                      <Filter className="w-5 h-5 mr-2" />
                      Status
                    </h3>
                    <div className="space-y-2">
                      {statuses.slice(0, 3).map((status) => (
                        <div
                          key={status.id}
                          className="h-10 bg-white/5 rounded-lg animate-pulse"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Quest Cards Skeleton */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <QuestCardSkeleton key={index} />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Today's Quest Skeleton */}
              <QuestProgressSkeleton />

              {/* Stats Skeleton */}
              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
                  Quest Stats
                </h2>
                <QuestStatsSkeleton />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background-900 text-black dark:text-white p-4 lg:p-6">
      {/* Header */}
      <div className="container-glass mb-8">
        <Link
          to="/dashboard"
          className="glass-card-primary px-4 py-2 w-max flex items-center gap-2 hover:shadow-glow transition-all text-black dark:text-white ml-auto md:ml-0 mb-4"
        >
          <LayoutDashboard className="w-5 h-5 text-primary-500" />
          <span className="font-semibold">Back to Dashboard</span>
        </Link>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="heading-1 text-4xl lg:text-5xl mb-2  ">Quest Hub</h1>
            <p className="body-medium text-gray-500 dark:text-gray-300">
              Embark on your personal growth journey
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            <StatWidget
              icon={<Target className="w-5 h-5 text-secondary-500" />}
              label="Active"
              value={filteredQuests.filter((q) => q.status === "active").length}
              color="primary"
            />
          </div>
        </div>
      </div>

      <div className="container-glass">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-3">
            {/* Filters */}
            <GlassCard className="mb-8 p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Category Filter */}
                <div className="lg:w-48">
                  <h3 className="heading-3 mb-4 flex items-center text-black dark:text-white">
                    <Filter className="w-5 h-5 mr-2" />
                    Category
                  </h3>
                  <DropdownFilter
                    label="All Categories"
                    options={categories.map((category) => ({
                      value: category.id,
                      label: category.name,
                    }))}
                    selected={selectedCategory}
                    onSelect={setSelectedCategory}
                  />
                </div>
                {/* Status Filter */}
                <div className="lg:w-48">
                  <h3 className="heading-3 mb-4 flex items-center text-black dark:text-white">
                    <Filter className="w-5 h-5 mr-2" />
                    Status
                  </h3>
                  <DropdownFilter
                    label="All Statuses"
                    options={statuses.map((status) => ({
                      value: status.id,
                      label: status.name,
                    }))}
                    selected={selectedStatus}
                    onSelect={setSelectedStatus}
                  />
                </div>
              </div>
            </GlassCard>

            {/* Quests Grid */}
            {filteredQuests.length === 0 ? (
              <EmptyState
                icon={Target}
                title="No Quests Found"
                description="No quests match your current filters. Try adjusting your selection."
              />
            ) : (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {filteredQuests.map((quest) => (
                  <GlassCard
                    key={quest.id}
                    className="transition-all duration-300 hover:shadow-glow"
                  >
                    {/* Quest Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-6 h-6 rounded-full bg-gradient-to-r ${getCategoryColors(
                              quest.category || "emotional"
                            )} flex items-center justify-center`}
                          >
                            {React.createElement(
                              categoryIcons[quest.category || "emotional"],
                              {
                                className: "w-3 h-3 text-white",
                              }
                            )}
                          </div>
                          <h3 className="font-semibold text-black dark:text-white text-lg">
                            {quest.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
                          <span
                            className={getStatusColor(quest.status || "active")}
                          >
                            {(quest.status || "active")
                              .charAt(0)
                              .toUpperCase() +
                              (quest.status || "active").slice(1)}
                          </span>
                          <span className="text-text-secondary">•</span>
                          <span
                            className={getDifficultyColors(
                              quest.difficulty || "easy"
                            )}
                          >
                            {(quest.difficulty || "easy")
                              .charAt(0)
                              .toUpperCase() +
                              (quest.difficulty || "easy").slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-accent-500 font-semibold text-lg">
                          {quest.reward || 50} pts
                        </div>
                        <div className="text-text-muted text-sm">
                          {quest.estimatedTime || "15 min"}
                        </div>
                      </div>
                    </div>

                    {/* Quest Description */}
                    <p className="text-gray-500 dark:text-gray-300 text-sm leading-relaxed mb-4">
                      {quest.description || "No description available"}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-300 mb-1">
                        <span>Progress</span>
                        <span>{quest.progress || 0}%</span>
                      </div>
                      <NeonProgressBar value={quest.progress || 0} />
                    </div>

                    {/* Quest Actions */}
                    <div className="flex items-center justify-between">
                      <div className="text-xs md:text-sm text-text-muted">
                        {(quest.type || "daily").charAt(0).toUpperCase() +
                          (quest.type || "daily").slice(1)}{" "}
                        Quest
                      </div>
                      <div className="flex gap-2">
                        {(quest.status || "active") === "active" && (
                          <>
                            <NeonGlowButton
                              color="primary"
                              className="px-4 py-2 text-sm"
                              onClick={() => handleStartQuest(quest)}
                              disabled={isStarting}
                            >
                              {isStarting ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                              ) : (
                                <Play className="w-4 h-4 mr-1" />
                              )}
                              {isStarting ? "Starting..." : "Start"}
                            </NeonGlowButton>
                            <NeonGlowButton
                              color="accent"
                              className="px-4 py-2 text-sm"
                              onClick={() => handleCompleteQuest(quest)}
                              disabled={isCompleting}
                            >
                              {isCompleting ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                              ) : (
                                <CheckCircle className="w-4 h-4 mr-1" />
                              )}
                              {isCompleting ? "Completing..." : "Complete"}
                            </NeonGlowButton>
                          </>
                        )}
                        {(quest.status || "active") === "completed" && (
                          <div className="flex items-center gap-1 text-accent-500">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Completed
                            </span>
                          </div>
                        )}
                        {(quest.status || "active") === "locked" && (
                          <div className="flex items-center gap-1 text-text-muted">
                            <Award className="w-4 h-4" />
                            <span className="text-sm">Locked</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Quest */}
            {todayQuest && (
              <GlassCard className="p-6">
                <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
                  Today's Quest
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-r ${getCategoryColors(
                        todayQuest.category || "emotional"
                      )} flex items-center justify-center`}
                    >
                      {React.createElement(
                        categoryIcons[todayQuest.category || "emotional"],
                        {
                          className: "w-6 h-6 text-white",
                        }
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-black dark:text-white text-lg">
                        {todayQuest.title}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-300 text-sm">
                        {todayQuest.reward || 50} points •{" "}
                        {todayQuest.estimatedTime || "15 min"}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-500 dark:text-gray-300 text-sm leading-relaxed">
                    {todayQuest.description || "No description available"}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-300">
                      <span>Progress</span>
                      <span>{todayQuest.progress || 0}%</span>
                    </div>
                    <NeonProgressBar value={todayQuest.progress || 0} />
                  </div>
                  {(todayQuest.status || "active") === "active" && (
                    <NeonGlowButton
                      color="accent"
                      className="w-full"
                      onClick={() => handleCompleteQuest(todayQuest)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete Quest
                    </NeonGlowButton>
                  )}
                </div>
              </GlassCard>
            )}

            {/* Quest Stats */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
                Quest Stats
              </h2>
              <div className="space-y-4">
                <StatWidget
                  icon={<Target className="w-5 h-5 text-secondary-500" />}
                  label="Total Quests"
                  value={uniqueQuests.length}
                  color="primary"
                />
                <StatWidget
                  icon={<CheckCircle className="w-5 h-5 text-white-500" />}
                  label="Completed"
                  value={
                    uniqueQuests.filter(
                      (q) => (q.status || "active") === "completed"
                    ).length
                  }
                  color="accent"
                />
                <StatWidget
                  icon={<Clock className="w-5 h-5 text-yellow-500" />}
                  label="Active"
                  value={
                    uniqueQuests.filter(
                      (q) => (q.status || "active") === "active"
                    ).length
                  }
                  color="secondary"
                />
                <StatWidget
                  icon={<Award className="w-5 h-5 text-purple-500" />}
                  label="Total Points"
                  value={uniqueQuests
                    .filter((q) => (q.status || "active") === "completed")
                    .reduce((sum, q) => sum + (q.reward || 50), 0)}
                  color="accent"
                />
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Complete Quest Modal */}
      <Modal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        title="Complete Quest"
      >
        <div className="space-y-4">
          {selectedQuest && (
            <>
              <div className="p-4 bg-white/5 rounded-lg">
                <h3 className="font-semibold text-black dark:text-white mb-2">
                  {selectedQuest.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-300 text-sm">
                  {selectedQuest.description || "No description available"}
                </p>
                <div className="mt-2 text-accent-500 font-medium">
                  Reward: {selectedQuest.reward || 50} points
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Reflection (Optional)
                </label>
                <textarea
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  placeholder="Share your thoughts about completing this quest..."
                  className="w-full px-4 py-3 bg-white/5 dark:bg-background-800 border border-white/20 dark:border-background-700 rounded-xl text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-300 backdrop-blur-sm resize-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <NeonGlowButton
                  color="primary"
                  className="flex-1"
                  onClick={confirmCompleteQuest}
                  disabled={isCompleting}
                >
                  {isCompleting ? "Completing..." : "Complete Quest"}
                </NeonGlowButton>
                <NeonGlowButton
                  color="secondary"
                  className="flex-1"
                  onClick={() => setShowCompleteModal(false)}
                >
                  Cancel
                </NeonGlowButton>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
