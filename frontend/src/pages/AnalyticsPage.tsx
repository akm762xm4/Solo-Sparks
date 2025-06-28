import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { TrendingUp, Sparkles, Target, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { GlassCard } from "../components/ui/GlassCard";
import { useGetProfileQuery } from "../api/profileApi";
import { useGetUserPointsQuery } from "../api/rewardsApi";
import { useGetQuestHistoryQuery } from "../api/questApi";
import { Skeleton } from "../components/ui/Skeleton";

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

export const AnalyticsPage = () => {
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    isError: isErrorProfile,
  } = useGetProfileQuery();
  const {
    data: userPointsData,
    isLoading: isLoadingPoints,
    isError: isErrorPoints,
  } = useGetUserPointsQuery();
  const {
    data: questHistory,
    isLoading: isLoadingQuests,
    isError: isErrorQuests,
  } = useGetQuestHistoryQuery();

  const isLoading = isLoadingProfile || isLoadingPoints || isLoadingQuests;
  const isError = isErrorProfile || isErrorPoints || isErrorQuests;

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

  // Prepare spark points data (approximate growth over time)
  let sparkPointsData: { date: string; points: number }[] = [];
  const totalPoints = userPointsData?.user?.sparkPoints ?? 0;
  if (moodData.length > 0) {
    const pointsPerEntry = totalPoints / moodData.length;
    sparkPointsData = moodData.map((entry, i) => ({
      date: entry.date,
      points: Math.round(pointsPerEntry * (i + 1)),
    }));
  }

  // Prepare quest completion data
  let questCompletionData: {
    date: string;
    completed: number;
    assigned: number;
  }[] = [];
  if (questHistory) {
    const map: Record<string, { completed: number; assigned: number }> = {};
    questHistory.forEach((q) => {
      if (q.completedAt) {
        const date = new Date(q.completedAt).toLocaleDateString();
        if (!map[date]) map[date] = { completed: 0, assigned: 0 };
        map[date].completed += 1;
      }
      if (q.createdAt) {
        const date = new Date(q.createdAt).toLocaleDateString();
        if (!map[date]) map[date] = { completed: 0, assigned: 0 };
        map[date].assigned += 1;
      }
    });
    questCompletionData = Object.entries(map).map(([date, v]) => ({
      date,
      ...v,
    }));
    questCompletionData = filterByRange(questCompletionData, "all");
    questCompletionData.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-background-900 text-black dark:text-white p-4 lg:p-6">
        <div className="container-glass mb-8">
          <Skeleton className="h-12 w-1/2 mb-4" />
          <Skeleton className="h-8 w-1/3" />
        </div>
        <div className="container-glass grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Skeleton className="h-72 w-full rounded-xl" />
          <Skeleton className="h-72 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl lg:col-span-2" />
        </div>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="min-h-screen bg-white dark:bg-background-900 text-black dark:text-white p-4 lg:p-6">
        <div className="container-glass mb-8 text-center">
          <div className="text-red-500 font-semibold mb-4">
            Failed to load analytics data. Please try again.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background-900 text-black dark:text-white p-4 lg:p-6 transition-colors duration-300">
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
            <h1 className="heading-1 text-4xl lg:text-5xl mb-2 ">Analytics</h1>
            <p className="body-medium text-gray-600 dark:text-gray-300">
              Visualize your growth and progress over time
            </p>
          </div>
        </div>
      </div>

      <div className="container-glass grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Mood Trends Chart */}
        <GlassCard className="md:p-6 p-4 animate-float overflow-x-auto">
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="heading-3 text-black dark:text-white md:text-base text-lg">
                Mood Trends
              </h3>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={moodData}
              margin={{ top: 10, right: 20, left: -35, bottom: 0 }}
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

        {/* Spark Points Growth Chart */}
        <GlassCard className="md:p-6 p-4 animate-float overflow-x-auto">
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-primary-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="heading-3 text-black dark:text-white md:text-base text-lg">
                Spark Points Growth
              </h3>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={sparkPointsData}
              margin={{ top: 10, right: 20, left: -35, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2226" />
              <XAxis dataKey="date" stroke="#E5E7EB" fontSize={12} />
              <YAxis stroke="#E5E7EB" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "#0D1117",
                  border: "1px solid #1DF2A4",
                  color: "#fff",
                }}
              />
              <Bar
                dataKey="points"
                fill="#1DF2A4"
                radius={[8, 8, 0, 0]}
                animationDuration={1200}
              />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Quest Completion Trends Chart */}
        <GlassCard className="md:p-6 p-4 animate-float lg:col-span-2 overflow-x-auto">
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="heading-3 text-black dark:text-white md:text-base text-lg">
                Quest Completion
              </h3>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={questCompletionData}
              margin={{ top: 10, right: 20, left: -35, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2226" />
              <XAxis dataKey="date" stroke="#E5E7EB" fontSize={12} />
              <YAxis stroke="#E5E7EB" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "#0D1117",
                  border: "1px solid #B388EB",
                  color: "#fff",
                }}
              />

              <Legend iconType="circle" iconSize={6} />
              <Bar
                dataKey="assigned"
                fill="#B388EB"
                radius={[8, 8, 0, 0]}
                name="Assigned"
                animationDuration={1200}
              />
              <Bar
                dataKey="completed"
                fill="#00FFFF"
                radius={[8, 8, 0, 0]}
                name="Completed"
                animationDuration={1200}
              />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </div>
  );
};
