import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Target,
  TrendingUp,
  BookOpen,
  Plus,
  Clock,
  Flame,
  CheckCircle,
  Circle,
  ArrowRight,
  Star,
  BarChart3,
  Settings as SettingsIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { QuestDisplay } from "../components/QuestDisplay";
import { NeonGlowButton } from "../components/ui/NeonGlowButton";
import { GlassCard } from "../components/ui/GlassCard";
import { StatWidget } from "../components/ui/StatWidget";
import { NeonProgressBar } from "../components/ui/NeonProgressBar";
import { useGetUserPointsQuery } from "../api/rewardsApi";
import { useGetProfileQuery } from "../api/profileApi";
import { useGetReflectionsQuery } from "../api/reflectionApi";

export const DashboardPage = () => {
  const navigate = useNavigate();

  // Fetch real data from backend
  const {
    data: userPointsData,
    isLoading: isLoadingPoints,
    isError: isErrorPoints,
  } = useGetUserPointsQuery();
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    isError: isErrorProfile,
  } = useGetProfileQuery();
  const { data: reflections, isLoading: isLoadingReflections } =
    useGetReflectionsQuery();

  // Loading and error states
  if (isLoadingPoints || isLoadingProfile) {
    return (
      <div className="min-h-screen bg-white dark:bg-background-900 p-4 lg:p-6">
        <div className="container-glass mb-8 animate-pulse h-24 w-full rounded-xl bg-gray-200 dark:bg-white/10" />
        <div className="container-glass grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="h-32 rounded-xl bg-gray-200 dark:bg-white/10" />
          <div className="h-32 rounded-xl bg-gray-200 dark:bg-white/10" />
          <div className="h-32 rounded-xl bg-gray-200 dark:bg-white/10" />
        </div>
        <div className="container-glass mb-8 p-6 h-40 rounded-xl bg-gray-200 dark:bg-white/10" />
      </div>
    );
  }
  if (isErrorPoints || isErrorProfile) {
    return (
      <div className="min-h-screen bg-background-500 p-4 lg:p-6">
        <div className="container-glass mb-8 text-center text-red-500 font-semibold p-8 rounded-xl">
          Failed to load dashboard data. Please try again.
        </div>
      </div>
    );
  }

  // Real data
  const sparkPoints = userPointsData?.user?.sparkPoints ?? 0;
  const questsAssigned = userPointsData?.user?.questsAssigned ?? 0;
  const questsCompleted = userPointsData?.user?.questsCompleted ?? 0;
  const questProgress =
    questsAssigned > 0 ? (questsCompleted / questsAssigned) * 100 : 0;

  // Mood log and streak
  const moodLog = profileData?.data?.moodLog || [];
  // Calculate streak: count unique days with mood logs
  const streakSet = new Set(
    moodLog.map((entry: any) => new Date(entry.date).toDateString())
  );
  const currentStreak = streakSet.size;

  function filterByRange<T extends { date: string }>(data: T[], range: string) {
    if (range === "all") return data;
    const now = new Date();
    let days = 7;
    if (range === "30d") days = 30;
    if (range === "90d") days = 90;
    return data.filter((d) => {
      const date = new Date(d.date);
      return now.getTime() - date.getTime() <= days * 24 * 60 * 60 * 1000;
    });
  }

  // Mood data for the week (show last 7 days)
  // Prepare mood data
  let moodData: { date: string; mood: number }[] = [];
  if (profileData?.data?.moodLog) {
    moodData = profileData.data.moodLog.map((entry) => ({
      date: new Date(entry.date).toLocaleDateString(),
      mood: (() => {
        switch (entry.general) {
          case "Happy":
            return 9;
          case "Content":
            return 8;
          case "Neutral":
            return 6;
          case "Anxious":
            return 4;
          case "Sad":
            return 2;
          case "Stressed":
            return 3;
          case "Excited":
            return 10;
          case "Overwhelmed":
            return 3;
          default:
            return 5;
        }
      })(),
    }));
  }
  moodData = filterByRange(moodData, "all");

  // Reflection status: check if today's moodLog exists
  const todayStr = new Date().toDateString();
  const hasTodayReflection = moodLog.some(
    (entry: any) => new Date(entry.date).toDateString() === todayStr
  );
  const reflectionStatus = hasTodayReflection ? "completed" : "pending";

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="min-h-screen bg-white text-black dark:bg-background-900 dark:text-white p-4 lg:p-6 transition-colors duration-300">
      {/* Header */}
      <div className="container-glass mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="heading-1 text-4xl lg:text-5xl mb-2  pl-10 md:pl-0">
              Solo Sparks
            </h1>
            <p className="body-medium text-gray-500 dark:text-gray-300">
              Your personal growth journey continues...
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            <GlassCard
              borderColor="primary"
              className="px-4 py-2 flex items-center gap-2"
            >
              <Clock className="w-5 h-5 text-primary-500" />
              <span className="font-mono text-black dark:text-white text-sm md:text-base">
                {currentTime}
              </span>
            </GlassCard>
            <GlassCard
              borderColor="accent"
              className="px-4 py-2 flex items-center gap-2"
            >
              <Flame className="w-5 h-5 text-accent-500" />
              <span className="font-semibold text-black dark:text-white text-sm md:text-base">
                {currentStreak} days
              </span>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="container-glass">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Spark Points StatWidget */}
          <StatWidget
            icon={<Sparkles className="w-6 h-6 text-whi" />}
            label="Spark Points"
            value={sparkPoints}
            color="primary"
            className="!p-6"
          />

          {/* Quest Progress StatWidget */}
          <GlassCard borderColor="secondary" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-secondary-500 dark:text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-black dark:text-white">
                    Quest Progress
                  </h3>
                  <p className="text-gray-500 dark:text-gray-300 text-sm">
                    This week
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-secondary-500">
                  {questsCompleted}/{questsAssigned}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-300">
                  Completed
                </div>
              </div>
            </div>
            <NeonProgressBar
              value={questProgress}
              color="secondary"
              className="mb-2"
            />
            <p className="text-xs text-gray-500 dark:text-gray-300">
              {Math.round(questProgress)}% complete
            </p>
          </GlassCard>

          {/* Daily Reflection Status */}
          <GlassCard borderColor="accent" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-accent-500 dark:text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-black dark:text-white">
                    Daily Reflection
                  </h3>
                  <p className="text-gray-500 dark:text-gray-300 text-sm">
                    Today's status
                  </p>
                </div>
              </div>
              <div className="text-right">
                {reflectionStatus === "completed" ? (
                  <CheckCircle className="w-8 h-8 text-accent-500" />
                ) : (
                  <Circle className="w-8 h-8 text-gray-400" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span
                className={`text-sm font-medium ${
                  reflectionStatus === "completed"
                    ? "text-accent-500"
                    : "text-gray-500 dark:text-gray-300"
                }`}
              >
                {reflectionStatus === "completed" ? "Completed" : "Pending"}
              </span>
              <NeonGlowButton
                color="accent"
                className="text-sm py-2 px-4"
                onClick={() => navigate("/reflections")}
              >
                {reflectionStatus === "completed" ? "View" : "Start"}
              </NeonGlowButton>
            </div>
          </GlassCard>
        </div>

        {/* Mood Trends Chart */}
        <GlassCard className="flex flex-col gap-4 mb-8 md:p-6 p-3">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center md:gap-3 gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-500 dark:text-white" />
              </div>
              <h3 className="heading-3 text-lg md:text-base text-black dark:text-white">
                Mood Trends
              </h3>
            </div>
            <div></div>
            <Link
              to="/analytics"
              className="btn-ghost text-xs flex flex-col md:flex-row md:items-center md:text-sm text-black dark:text-white "
            >
              View Details <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          {/* Simple Mood Chart */}
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={moodData}
              margin={{ top: 10, right: 10, left: -40, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2226" />
              <XAxis dataKey="date" stroke="#E5E7EB" fontSize={12} />
              <YAxis domain={[0, 10]} stroke="#E5E7EB" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "#0D1117",
                  border: "1px solid #00FFFF",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#00FFFF"
                strokeWidth={3}
                dot={{ r: 5, fill: "#1DF2A4" }}
                activeDot={{ r: 8 }}
                animationDuration={1200}
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard className="mb-8 p-6">
          <h3 className="heading-3 mb-6 text-black dark:text-white">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NeonGlowButton
              color="primary"
              className="w-full flex flex-col items-start gap-2 glass-card-primary p-4 text-left group"
              onClick={() => navigate("/reflections")}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-accent-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5 text-primary-500 dark:text-white" />
                </div>
                <h4 className="font-semibold text-black dark:text-white">
                  Start Reflection
                </h4>
              </div>
              <p className="text-gray-500 dark:text-gray-300 text-sm">
                Record today's thoughts and feelings
              </p>
            </NeonGlowButton>

            <Link
              to="/quests"
              className="glass-card-secondary p-4 text-left hover:shadow-glow transition-all duration-300 group block"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Target className="w-5 h-5 text-secondary-500 dark:text-white" />
                </div>
                <h4 className="font-semibold text-black dark:text-white">
                  View Quests
                </h4>
              </div>
              <p className="text-gray-500 dark:text-gray-300 text-sm">
                Check your current and upcoming quests
              </p>
            </Link>

            <Link
              to="/rewards"
              className="glass-card-accent p-4 text-left hover:shadow-glow transition-all duration-300 group block"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-secondary-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Star className="w-5 h-5 text-accent-500 dark:text-white" />
                </div>
                <h4 className="font-semibold text-black dark:text-white">
                  Rewards
                </h4>
              </div>
              <p className="text-gray-500 dark:text-gray-300 text-sm">
                Redeem your spark points for rewards
              </p>
            </Link>

            <Link
              to="/analytics"
              className="glass-card p-4 text-left hover:shadow-glow transition-all duration-300 group block"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-5 h-5 text-primary-500 dark:text-white" />
                </div>
                <h4 className="font-semibold text-black dark:text-white">
                  Analytics
                </h4>
              </div>
              <p className="text-gray-500 dark:text-gray-300 text-sm">
                Visualize your mood, points, and quest trends
              </p>
            </Link>

            <Link
              to="/settings"
              className="glass-card p-4 text-left hover:shadow-glow transition-all duration-300 group block"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-accent-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <SettingsIcon className="w-5 h-5 text-secondary-500 dark:text-white" />
                </div>
                <h4 className="font-semibold text-black dark:text-white">
                  Settings
                </h4>
              </div>
              <p className="text-gray-500 dark:text-gray-300 text-sm">
                Manage your preferences and account
              </p>
            </Link>
          </div>
        </GlassCard>

        {/* Current Quest Display */}
        <QuestDisplay />

        {/* Recent Reflections */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h3 className="heading-3 text-black dark:text-white">
              Recent Reflections
            </h3>
            <Link
              to="/reflections"
              className="btn-ghost text-sm flex flex-col md:flex-row md:items-center"
            >
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          {isLoadingReflections ? (
            <div className="text-center py-8 text-primary-500">Loading...</div>
          ) : !reflections || reflections.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No reflections yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reflections.slice(0, 4).map((reflection) => (
                <GlassCard
                  key={reflection._id}
                  borderColor="secondary"
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 font-semibold text-secondary-500">
                      <BookOpen className="w-4 h-4" />
                      {reflection.questTitle}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-4 h-4" />
                      {new Date(reflection.createdAt).toLocaleString()}
                    </div>
                  </div>
                  {reflection.text && (
                    <div className=" text-gray-800 dark:text-white">
                      {reflection.text}
                    </div>
                  )}
                  {reflection.imageUrl && (
                    <div className="flex items-center gap-2">
                      <img
                        src={reflection.imageUrl}
                        alt="Reflection"
                        className="max-h-32 rounded shadow"
                      />
                    </div>
                  )}
                  {reflection.audioUrl &&
                    location.pathname == "/reflections" && (
                      <div className="flex items-center gap-2">
                        <audio
                          controls
                          src={reflection.audioUrl}
                          className="w-full"
                        />
                      </div>
                    )}
                  <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    Type: {reflection.questType}
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};
