import { useState } from "react";
import {
  useGetUserPointsQuery,
  useGetRewardsQuery,
  useRedeemRewardMutation,
  useGetRedemptionHistoryQuery,
  useGetActiveRedemptionsQuery,
  type Reward,
} from "../api/rewardsApi";
import { GlassCard } from "../components/ui/GlassCard";
import { NeonGlowButton } from "../components/ui/NeonGlowButton";
import { Modal } from "../components/ui/Modal";
import {
  Sparkles,
  Gift,
  History,
  Filter,
  Clock,
  Zap,
  BookOpen,
  Trophy,
  Palette,
  ShoppingBag,
  CheckCircle,
  AlertCircle,
  LayoutDashboard,
} from "lucide-react";
import { DropdownFilter } from "./ReflectionsPage";
import { Link } from "react-router-dom";

type RewardCategory =
  | "all"
  | "boost"
  | "content"
  | "achievement"
  | "cosmetic"
  | "feature";
type SortOption = "cost" | "cost-desc" | "new" | "popular";

const categoryIcons = {
  all: Sparkles,
  boost: Zap,
  content: BookOpen,
  achievement: Trophy,
  cosmetic: Palette,
  feature: ShoppingBag,
};

const categoryColors = {
  all: "from-blue-500 to-cyan-500",
  boost: "from-yellow-500 to-orange-500",
  content: "from-purple-500 to-pink-500",
  achievement: "from-amber-500 to-yellow-500",
  cosmetic: "from-pink-500 to-rose-500",
  feature: "from-emerald-500 to-teal-500",
};

const rarityColors = {
  common: "text-gray-400",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-amber-400",
};

export const RewardsPage = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<RewardCategory>("all");
  const [sortBy, setSortBy] = useState<SortOption>("cost");
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // API calls
  const { data: userPointsData } = useGetUserPointsQuery();
  const { data: rewardsData, isLoading: isLoadingRewards } = useGetRewardsQuery(
    { category: selectedCategory === "all" ? undefined : selectedCategory }
  );
  const { data: redemptionHistoryData } = useGetRedemptionHistoryQuery({
    limit: 10,
  });
  const { data: activeRedemptionsData } = useGetActiveRedemptionsQuery();
  const [redeemReward, { isLoading: isRedeeming }] = useRedeemRewardMutation();

  // Data processing
  const sparkPoints = userPointsData?.user?.sparkPoints ?? 0;
  const rewards = rewardsData || [];
  const redemptionHistory = redemptionHistoryData?.redemptions || [];
  const activeRedemptions = activeRedemptionsData?.activeRedemptions || [];

  // Sort rewards
  const sortedRewards = [...rewards].sort((a, b) => {
    switch (sortBy) {
      case "cost":
        return a.cost - b.cost;
      case "cost-desc":
        return b.cost - a.cost;
      case "new":
        return b.rarity.localeCompare(a.rarity); // Higher rarity first
      case "popular":
        return b.cost - a.cost; // Higher cost = more popular
      default:
        return 0;
    }
  });

  const handleRedeem = async (reward: Reward) => {
    setSelectedReward(reward);
    setShowRedeemModal(true);
  };

  const confirmRedeem = async () => {
    if (!selectedReward) return;

    try {
      const result = await redeemReward({
        rewardId: selectedReward.id,
      }).unwrap();
      setMessage({
        text: `🎉 Successfully redeemed ${selectedReward.name}! You now have ${result.remainingPoints} Spark Points remaining.`,
        type: "success",
      });
      setShowRedeemModal(false);
      setSelectedReward(null);

      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({
        text:
          err?.data?.message || "Failed to redeem reward. Please try again.",
        type: "error",
      });
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "⭐";
      case "epic":
        return "💎";
      case "rare":
        return "🔮";
      default:
        return "✨";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background-900 text-black dark:text-white p-4 lg:p-6 transition-colors duration-300">
      {/* Header with Spark Points */}
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
            <h1 className="heading-1 text-4xl lg:text-5xl mb-2">
              Rewards Store
            </h1>
            <p className="body-medium text-gray-600 dark:text-gray-300">
              Redeem your Spark Points for amazing rewards
            </p>
          </div>

          {/* Spark Points Display */}
          <div className="mt-4 lg:mt-0">
            <div className="glass-card-primary p-6 rounded-xl border border-primary-500/20">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
                  <div className="absolute inset-0 bg-amber-400/20 rounded-full animate-ping"></div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Spark Points
                  </div>
                  <div className="text-2xl font-bold text-amber-400">
                    {sparkPoints.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                Earn points by completing quests and reflections
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div
          className={`container-glass mb-6 p-4 rounded-xl border ${
            message.type === "success"
              ? "border-green-500/20 bg-green-500/10"
              : "border-red-500/20 bg-red-500/10"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            <span
              className={
                message.type === "success" ? "text-green-400" : "text-red-400"
              }
            >
              {message.text}
            </span>
          </div>
        </div>
      )}

      <div className="container-glass">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-3">
            {/* Filters and Sorting */}
            <GlassCard className="mb-6 p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Category Filter */}
                <div className="flex-1">
                  <h3 className="heading-3 mb-4 flex items-center text-black dark:text-white">
                    <Filter className="w-5 h-5 mr-2" />
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(categoryIcons).map(([category, Icon]) => (
                      <button
                        key={category}
                        onClick={() =>
                          setSelectedCategory(category as RewardCategory)
                        }
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                          selectedCategory === category
                            ? `bg-gradient-to-r ${
                                categoryColors[
                                  category as keyof typeof categoryColors
                                ]
                              } text-white shadow-glow`
                            : "bg-white/5 hover:bg-white/10 text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="capitalize">{category}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div className="lg:w-48">
                  <h3 className="heading-3 mb-4 flex items-center text-black dark:text-white">
                    Sort By
                  </h3>
                  <DropdownFilter
                    label="All Sort Options"
                    options={[
                      { value: "all", label: "All Sort Options" },
                      ...["cost", "cost-desc", "new", "popular"].map(
                        (type) => ({
                          value: type,
                          label: type.charAt(0).toUpperCase() + type.slice(1),
                        })
                      ),
                    ]}
                    selected={sortBy}
                    onSelect={(value) => setSortBy(value as SortOption)}
                  />
                </div>
              </div>
            </GlassCard>

            {/* Rewards Grid */}
            {isLoadingRewards ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="glass-card p-6 rounded-xl animate-pulse"
                  >
                    <div className="h-32 bg-white/10 rounded-lg mb-4"></div>
                    <div className="h-6 bg-white/10 rounded mb-2"></div>
                    <div className="h-4 bg-white/10 rounded mb-4 w-3/4"></div>
                    <div className="h-10 bg-white/10 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedRewards.map((reward) => (
                  <GlassCard
                    key={reward.id}
                    className="transition-all duration-300 hover:shadow-glow hover:scale-105 group"
                  >
                    {/* Reward Icon */}
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-16 h-16 rounded-xl bg-gradient-to-r ${
                          categoryColors[reward.category]
                        } flex items-center justify-center text-2xl`}
                      >
                        {reward.icon || "🎁"}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={rarityColors[reward.rarity]}>
                          {getRarityIcon(reward.rarity)}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            reward.type === "temporary"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : reward.type === "permanent"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {reward.type}
                        </span>
                      </div>
                    </div>

                    {/* Reward Info */}
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-white group-hover:text-primary-400 transition-colors">
                      {reward.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {reward.description}
                    </p>

                    {/* Cost and Duration */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="font-semibold text-amber-400">
                          {reward.cost}
                        </span>
                      </div>
                      {reward.duration && (
                        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                          <Clock className="w-3 h-3" />
                          {reward.duration}h
                        </div>
                      )}
                    </div>

                    {/* Redeem Button */}
                    <NeonGlowButton
                      color="accent"
                      className="w-full"
                      disabled={isRedeeming || sparkPoints < reward.cost}
                      onClick={() => handleRedeem(reward)}
                    >
                      <Gift className="w-4 h-4 mr-2" />
                      {sparkPoints < reward.cost
                        ? "Not Enough Points"
                        : "Redeem"}
                    </NeonGlowButton>
                  </GlassCard>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoadingRewards && sortedRewards.length === 0 && (
              <div className="text-center py-12">
                <Gift className="w-16 h-16 text-gray-600 dark:text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-white mb-2">
                  No Rewards Found
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Try adjusting your filters or check back later for new
                  rewards.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Active Redemptions */}
            {activeRedemptions.length > 0 && (
              <GlassCard className="p-6">
                <h2 className="text-xl font-semibold text-black dark:text-white mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-yellow-400" />
                  Active Rewards
                </h2>
                <div className="space-y-3">
                  {activeRedemptions.slice(0, 3).map((redemption) => (
                    <div
                      key={redemption.id}
                      className="p-3 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {redemption.rewardName}
                        </span>
                        {redemption.isExpired && (
                          <span className="text-xs text-red-400">Expired</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">
                        Redeemed {formatDate(redemption.redeemedAt)}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Recent Redemptions */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-black dark:text-white mb-4 flex items-center">
                <History className="w-5 h-5 mr-2 text-secondary-400" />
                Recent Redemptions
              </h2>
              {redemptionHistory.length === 0 ? (
                <div className="text-gray-600 dark:text-gray-300 text-sm">
                  No redemptions yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {redemptionHistory.slice(0, 5).map((redemption) => (
                    <div
                      key={redemption.id}
                      className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                    >
                      <div>
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {redemption.rewardName}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">
                          {formatDate(redemption.redeemedAt)}
                        </div>
                      </div>
                      <div className="text-xs text-amber-400 font-medium">
                        -{redemption.cost}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>

            {/* Stats */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
                Your Stats
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Total Redemptions
                  </span>
                  <span className="text-gray-600 dark:text-gray-300 font-medium">
                    {redemptionHistory.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Active Rewards
                  </span>
                  <span className="text-gray-600 dark:text-gray-300 font-medium">
                    {activeRedemptions.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Points Spent
                  </span>
                  <span className="text-amber-400 font-medium">
                    {redemptionHistory.reduce((sum, r) => sum + r.cost, 0)}
                  </span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Redeem Confirmation Modal */}
      <Modal
        isOpen={showRedeemModal}
        onClose={() => setShowRedeemModal(false)}
        title="Confirm Redemption"
      >
        {selectedReward && (
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${
                    categoryColors[selectedReward.category]
                  } flex items-center justify-center text-xl`}
                >
                  {selectedReward.icon || "🎁"}
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {selectedReward.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {selectedReward.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400 font-medium">
                    {selectedReward.cost} Spark Points
                  </span>
                </div>
                {selectedReward.duration && (
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                    <Clock className="w-3 h-3" />
                    {selectedReward.duration} hours
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>You currently have {sparkPoints} Spark Points</span>
              </div>
            </div>

            <div className="flex gap-3">
              <NeonGlowButton
                color="primary"
                className="flex-1"
                onClick={confirmRedeem}
                disabled={isRedeeming}
              >
                {isRedeeming ? "Redeeming..." : "Confirm Redemption"}
              </NeonGlowButton>
              <NeonGlowButton
                color="secondary"
                className="flex-1"
                onClick={() => setShowRedeemModal(false)}
              >
                Cancel
              </NeonGlowButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
