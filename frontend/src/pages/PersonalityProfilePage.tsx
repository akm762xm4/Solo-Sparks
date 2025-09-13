import { useState } from "react";
import {
  Brain,
  Star,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  LayoutDashboard,
  Edit,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { GlassCard } from "../components/ui/GlassCard";
import { NeonProgressBar } from "../components/ui/NeonProgressBar";
import { TabGroup } from "../components/ui/TabGroup";
import { useGetProfileQuery } from "../api/profileApi";
import { NeonGlowButton } from "../components/ui/NeonGlowButton";

interface MBTIType {
  type: string;
  title: string;
  description: string;
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  famousExamples: string[];
  completion: number;
}

interface EnneagramType {
  number: number;
  name: string;
  title: string;
  description: string;
  coreFear: string;
  coreDesire: string;
  strengths: string[];
  weaknesses: string[];
  growthPath: string;
  stressPath: string;
  completion: number;
}

export const PersonalityProfilePage = () => {
  const [activeTab, setActiveTab] = useState<"mbti" | "bigfive" | "enneagram">(
    "mbti"
  );
  const { data: profileData, isLoading, isError } = useGetProfileQuery();
  const navigate = useNavigate();

  // Static MBTI mapping (add all types as needed)
  const mbtiMap: Record<string, MBTIType> = {
    INFJ: {
      type: "INFJ",
      title: "The Advocate",
      description:
        "Quiet and mystical, yet very inspiring and tireless idealists. INFJs are creative nurturers with a strong sense of personal integrity and a drive to help others realize their potential.",
      traits: ["Introverted", "Intuitive", "Feeling", "Judging"],
      strengths: [
        "Creative and imaginative",
        "Insightful and inspiring",
        "Decisive and determined",
        "Passionate and idealistic",
        "Altruistic and principled",
      ],
      weaknesses: [
        "Sensitive to criticism",
        "Perfectionistic",
        "Always need to have a cause",
        "Can burn out easily",
        "Too private and reserved",
      ],
      famousExamples: [
        "Nelson Mandela",
        "Mother Teresa",
        "Martin Luther King Jr.",
        "Jane Goodall",
      ],
      completion: 85,
    },
    // ... add other MBTI types as needed ...
  };

  // Static Enneagram mapping (add all types as needed)
  const enneagramMap: Record<string, EnneagramType> = {
    "4": {
      number: 4,
      name: "The Individualist",
      title: "The Romantic",
      description:
        "Fours are self-aware, sensitive, and reserved. They are emotionally honest, creative, and personal, but can also be moody and self-conscious.",
      coreFear: "Being ordinary or having no identity",
      coreDesire: "To find themselves and their significance",
      strengths: [
        "Creative and artistic",
        "Self-aware and introspective",
        "Empathetic and compassionate",
        "Authentic and genuine",
        "Deep and meaningful relationships",
      ],
      weaknesses: [
        "Overly sensitive to criticism",
        "Can be moody and withdrawn",
        "Tendency toward self-pity",
        "Difficulty with routine tasks",
        "Can be overly dramatic",
      ],
      growthPath:
        "Type 1 - The Reformer (Become more principled and organized)",
      stressPath:
        "Type 2 - The Helper (Become more people-pleasing and dependent)",
      completion: 92,
    },
    // ... add other Enneagram types as needed ...
  };

  // Big Five trait static info
  const bigFiveTraitInfo = [
    {
      name: "Openness",
      key: "openness",
      description:
        "Openness to experience describes a dimension of personality that distinguishes imaginative, creative people from down-to-earth, conventional people.",
      highLevel: "Creative, curious, and open to new experiences",
      lowLevel: "Traditional, practical, and focused on facts",
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Conscientiousness",
      key: "conscientiousness",
      description:
        "Conscientiousness concerns the way in which we control, regulate, and direct our impulses.",
      highLevel: "Organized, responsible, and goal-directed",
      lowLevel: "Spontaneous, careless, and easily distracted",
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "Extraversion",
      key: "extraversion",
      description:
        "Extraversion is marked by pronounced engagement with the external world, versus being comfortable with your own company.",
      highLevel: "Outgoing, energetic, and sociable",
      lowLevel: "Reserved, quiet, and prefer solitude",
      color: "from-yellow-500 to-orange-500",
    },
    {
      name: "Agreeableness",
      key: "agreeableness",
      description:
        "Agreeableness reflects individual differences in concern with cooperation and social harmony.",
      highLevel: "Compassionate, trusting, and cooperative",
      lowLevel: "Competitive, challenging, and skeptical",
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Neuroticism",
      key: "neuroticism",
      description:
        "Neuroticism refers to the tendency to experience negative emotions, such as anger, anxiety, or depression.",
      highLevel: "Sensitive, anxious, and easily stressed",
      lowLevel: "Calm, stable, and emotionally secure",
      color: "from-red-500 to-pink-500",
    },
  ];

  // Loading/Error states
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto mt-12">
        <GlassCard className="p-8">
          <div className="animate-pulse h-8 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-6 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </GlassCard>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="max-w-4xl mx-auto mt-12">
        <GlassCard className="p-8 text-center text-red-500 font-semibold">
          Failed to load personality profile. Please try again.
        </GlassCard>
      </div>
    );
  }

  // Use backend data if available, fallback to mock/static
  const mbtiType = profileData?.data?.personalityTraits?.mbti || "INFJ";
  const mbtiProfile = mbtiMap[mbtiType] || mbtiMap["INFJ"];

  const bigFiveScores = profileData?.data?.personalityTraits?.bigFive || {
    openness: 78,
    conscientiousness: 82,
    extraversion: 45,
    agreeableness: 88,
    neuroticism: 32,
  };
  const bigFiveTraits = bigFiveTraitInfo.map((trait) => ({
    ...trait,
    score: bigFiveScores[trait.key as keyof typeof bigFiveScores] ?? 50,
    completion: bigFiveScores[trait.key as keyof typeof bigFiveScores] ?? 50,
  }));

  const enneagramType = (
    profileData?.data?.personalityTraits?.enneagram || "4"
  ).toString();
  const enneagramProfile = enneagramMap[enneagramType] || enneagramMap["4"];

  const tabs = [
    {
      id: "mbti",
      name: "MBTI",
      icon: Brain,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "bigfive",
      name: "Big Five",
      icon: BarChart3,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "enneagram",
      name: "Enneagram",
      icon: PieChart,
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-background-900 text-black dark:text-white p-4 lg:p-6 transition-colors duration-300">
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
              Personality Profile
            </h1>
            <p className="body-medium text-gray-600 dark:text-gray-300">
              Explore your unique personality insights
            </p>
          </div>
          <NeonGlowButton
            color="primary"
            className="mt-4 lg:mt-0 flex py-5 items-center"
            onClick={() => navigate("/personality/edit")}
          >
            <Edit className="w-6 h-6 mr-2" />
            Edit Personality Profile
          </NeonGlowButton>
        </div>
      </div>

      <div className="container-glass">
        <GlassCard className="mb-8 p-4 lg:p-6">
          <TabGroup
            tabs={tabs.map((tab) => ({
              id: tab.id,
              label: tab.name,
            }))}
            active={activeTab}
            onChange={(id) =>
              setActiveTab(id as "mbti" | "bigfive" | "enneagram")
            }
            className="mb-2"
          />
        </GlassCard>

        {/* MBTI Tab */}
        {activeTab === "mbti" && (
          <GlassCard className="mb-8 p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* MBTI Overview */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold text-primary-500">
                    {mbtiProfile.type}
                  </span>
                  <span className="text-lg text-black dark:text-white font-semibold">
                    {mbtiProfile.title}
                  </span>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <NeonProgressBar
                    value={mbtiProfile.completion}
                    color="primary"
                    className="w-32 ml-4"
                  />
                  <span className="ml-2 text-xs md:text-sm text-gray-600 dark:text-gray-300">
                    {mbtiProfile.completion}% complete
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {mbtiProfile.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {mbtiProfile.traits.map((trait) => (
                    <span
                      key={trait}
                      className="px-3 py-1 bg-white/10 text-primary-400 text-xs rounded-full"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <GlassCard className="p-4">
                    <h4 className="heading-4 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />{" "}
                      Strengths
                    </h4>
                    <ul className="list-disc ml-5 text-sm text-black dark:text-white">
                      {mbtiProfile.strengths.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </GlassCard>
                  <GlassCard className="p-4">
                    <h4 className="heading-4 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400" />{" "}
                      Weaknesses
                    </h4>
                    <ul className="list-disc ml-5 text-sm text-black dark:text-white">
                      {mbtiProfile.weaknesses.map((w) => (
                        <li key={w}>{w}</li>
                      ))}
                    </ul>
                  </GlassCard>
                </div>
                <div className="mb-2">
                  <h4 className="heading-4 mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" /> Famous Examples
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {mbtiProfile.famousExamples.map((ex) => (
                      <span
                        key={ex}
                        className="px-3 py-1 bg-white/10 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Big Five Tab */}
        {activeTab === "bigfive" && (
          <GlassCard className="mb-8 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bigFiveTraits.map((trait) => (
                <GlassCard key={trait.name} className="p-4">
                  <div className="flex items-center md:gap-4 gap-2 mb-4">
                    <span
                      className={`w-10 h-10 bg-gradient-to-br ${trait.color} rounded-lg flex items-center justify-center`}
                    >
                      <BarChart3 className="w-5 h-5 text-white" />
                    </span>
                    <span className="md:text-lg text-base font-semibold text-black dark:text-white">
                      {trait.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <NeonProgressBar
                      value={trait.completion}
                      color="primary"
                      className="w-24 ml-2"
                    />
                    <span className="ml-2 text-xs md:text-sm text-gray-600 dark:text-gray-300">
                      {trait.completion}%
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm">
                    {trait.description}
                  </p>
                  <div className="flex flex-col gap-1 text-xs">
                    <span className="text-green-400">
                      High: {trait.highLevel}
                    </span>
                    <span className="text-red-400">Low: {trait.lowLevel}</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Enneagram Tab */}
        {activeTab === "enneagram" && (
          <GlassCard className="mb-8 p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Enneagram Overview */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold text-accent-500">
                    {enneagramProfile.number}
                  </span>
                  <span className="text-lg text-black dark:text-white font-semibold">
                    {enneagramProfile.title}
                  </span>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <NeonProgressBar
                    value={enneagramProfile.completion}
                    color="accent"
                    className="w-32 ml-4"
                  />
                  <span className="ml-2 md:text-sm text-xs text-gray-600 dark:text-gray-300">
                    {enneagramProfile.completion}% complete
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-white/10 text-accent-400 text-xs rounded-full">
                    {enneagramProfile.name}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <GlassCard className="p-4">
                    <h4 className="heading-4 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />{" "}
                      Strengths
                    </h4>
                    <ul className="list-disc ml-5 text-sm text-black dark:text-white">
                      {enneagramProfile.strengths.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </GlassCard>
                  <GlassCard className="p-4">
                    <h4 className="heading-4 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400" />{" "}
                      Weaknesses
                    </h4>
                    <ul className="list-disc ml-5 text-sm text-black dark:text-white">
                      {enneagramProfile.weaknesses.map((w) => (
                        <li key={w}>{w}</li>
                      ))}
                    </ul>
                  </GlassCard>
                </div>
                <div className="mb-2">
                  <h4 className="heading-4 mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" /> Core Fear &
                    Desire
                  </h4>
                  <div className="flex flex-col gap-1 text-xs">
                    <span className="text-red-400">
                      Core Fear: {enneagramProfile.coreFear}
                    </span>
                    <span className="text-green-400">
                      Core Desire: {enneagramProfile.coreDesire}
                    </span>
                  </div>
                </div>
                <div className="mb-2">
                  <h4 className="heading-4 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-accent-400" /> Growth &
                    Stress Paths
                  </h4>
                  <div className="flex flex-col gap-1 text-xs">
                    <span className="text-accent-400">
                      Growth: {enneagramProfile.growthPath}
                    </span>
                    <span className="text-accent-200">
                      Stress: {enneagramProfile.stressPath}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
};
