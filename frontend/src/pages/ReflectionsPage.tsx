import { useState, useRef, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Trash2,
  Calendar,
  Target,
  ChevronDown,
  Star,
  Image,
  LayoutDashboard,
} from "lucide-react";
import { GlassCard } from "../components/ui/GlassCard";
import { NeonGlowButton } from "../components/ui/NeonGlowButton";
import { StatWidget } from "../components/ui/StatWidget";
import {
  useGetReflectionsQuery,
  useDeleteReflectionMutation,
} from "../api/reflectionApi";
import { ReflectionForm } from "../components/ReflectionForm";
import { Modal } from "../components/ui/Modal";
import { createPortal } from "react-dom";
import { EmptyState } from "../components/ui/EmptyState";
import {
  ReflectionCardSkeleton,
  StatWidgetSkeleton,
  QuickActionSkeleton,
  FilterSkeleton,
} from "../components/ui/Skeleton";
import { Link } from "react-router-dom";

// Portal-based dropdown menu
function PortalDropdown({
  anchorRef,
  open,
  children,
  onClose,
}: {
  anchorRef: React.RefObject<HTMLButtonElement>;
  open: boolean;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open && anchorRef.current && menuRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      menuRef.current.style.position = "absolute";
      menuRef.current.style.left = `${rect.left}px`;
      menuRef.current.style.top = `${rect.bottom + window.scrollY}px`;
      menuRef.current.style.width = `${rect.width}px`;
      menuRef.current.style.zIndex = "9999";
    }
  }, [open, anchorRef]);
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose?.();
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open, onClose, anchorRef]);
  if (!open) return null;
  return createPortal(
    <div
      ref={menuRef}
      className="dark:bg-background-900 bg-white rounded-lg shadow-lg border border-primary-100 animate-fade-in"
    >
      {children}
    </div>,
    document.body
  );
}

export function DropdownFilter({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: { value: string; label: string }[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="w-full ">
      <button
        ref={buttonRef}
        type="button"
        className="select-field flex items-center justify-between w-full px-4 py-2 rounded-lg bg-white/20 border border-white/10 focus:ring-2 focus:ring-primary-500 transition-all"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-black dark:text-white">
          {options.find((o) => o.value === selected)?.label || label}
        </span>
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>
      <PortalDropdown
        anchorRef={buttonRef as React.RefObject<HTMLButtonElement>}
        open={open}
        onClose={() => setOpen(false)}
      >
        {options.map((option: { value: string; label: string }) => (
          <div
            key={option.value}
            className={`px-4 py-2 cursor-pointer  rounded-lg ${
              selected === option.value ? " font-semibold" : ""
            }`}
            onClick={() => {
              onSelect(option.value);
              setOpen(false);
            }}
          >
            <span className="text-black dark:text-white">{option.label}</span>
          </div>
        ))}
      </PortalDropdown>
    </div>
  );
}

export const ReflectionsPage = () => {
  const [selectedQuestType, setSelectedQuestType] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("all");
  const [showNewReflection, setShowNewReflection] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reflectionToDelete, setReflectionToDelete] = useState<string | null>(
    null
  );

  // Fetch reflections from API
  const {
    data: reflections = [],
    isLoading,
    isError,
    refetch,
  } = useGetReflectionsQuery();

  const [deleteReflection] = useDeleteReflectionMutation();

  // Extract quest types and dates from reflections
  const questTypes = [...new Set(reflections.map((r) => r.questType))];
  const dates = [
    ...new Set(
      reflections.map((r) => new Date(r.createdAt).toISOString().split("T")[0])
    ),
  ];

  // Filtering by quest type and date
  const filteredReflections = reflections.filter((reflection) => {
    const questTypeMatch =
      selectedQuestType === "all" || reflection.questType === selectedQuestType;
    const dateStr = new Date(reflection.createdAt).toISOString().split("T")[0];
    const dateMatch = selectedDate === "all" || dateStr === selectedDate;
    return questTypeMatch && dateMatch;
  });

  // Stats (qualityScore, count) - only using backend data
  const stats = {
    totalReflections: reflections.length,
    averageQuality:
      reflections.length > 0
        ? Math.round(
            reflections.reduce((sum, r) => sum + (r.qualityScore || 0), 0) /
              reflections.length
          )
        : 0,
    totalMedia: reflections.reduce((sum, r) => {
      let count = 0;
      if (r.imageUrl) count++;
      if (r.audioUrl) count++;
      return sum + count;
    }, 0),
    questTypes: questTypes.length,
  };

  const handleDeleteReflection = async (id: string) => {
    setReflectionToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (reflectionToDelete) {
      try {
        await deleteReflection(reflectionToDelete).unwrap();
        refetch();
        setShowDeleteModal(false);
        setReflectionToDelete(null);
      } catch (err) {
        alert("Failed to delete reflection.");
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-white dark:bg-background-900">
        {/* <Sidebar /> */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="container-glass mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Reflections
                  </h1>
                  <p className="text-gray-300">
                    Track your thoughts and feelings
                  </p>
                </div>
                <NeonGlowButton
                  color="primary"
                  className="mt-4 lg:mt-0 flex py-5 items-center"
                  onClick={() => setShowNewReflection(true)}
                >
                  <Plus className="w-6 h-6 mr-2" />
                  Write New Reflection
                </NeonGlowButton>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Filters */}
                <div className="glass-card p-6 rounded-xl mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FilterSkeleton />
                    <FilterSkeleton />
                    <FilterSkeleton />
                  </div>
                </div>

                {/* Reflection Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <ReflectionCardSkeleton key={index} />
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Stats Skeleton */}
                <div className="glass-card p-6 rounded-xl">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Your Stats
                  </h2>
                  <div className="space-y-4">
                    <StatWidgetSkeleton />
                    <StatWidgetSkeleton />
                    <StatWidgetSkeleton />
                  </div>
                </div>

                {/* Quick Actions Skeleton */}
                <div className="glass-card p-6 rounded-xl">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Quick Actions
                  </h2>
                  <div className="space-y-3">
                    <QuickActionSkeleton />
                    <QuickActionSkeleton />
                    <QuickActionSkeleton />
                  </div>
                </div>
              </div>
            </div>
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
            <h1 className="heading-1 text-4xl lg:text-5xl mb-2">Reflections</h1>
            <p className="body-medium text-gray-500 dark:text-gray-300">
              Your journey of self-discovery and growth
            </p>
          </div>
          <NeonGlowButton
            color="primary"
            className="mt-4 lg:mt-0 flex py-5 items-center"
            onClick={() => setShowNewReflection(true)}
          >
            <Plus className="w-6 h-6 mr-2" />
            Write New Reflection
          </NeonGlowButton>
        </div>
      </div>
      <div className="container-glass">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-3">
            {isError ? (
              <EmptyState
                icon={BookOpen}
                title="Error Loading Reflections"
                description="Something went wrong while loading your reflections. Please try again."
              />
            ) : (
              <>
                {/* Filters */}
                <GlassCard className="mb-8 p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Quest Type Filter */}
                    <div className="lg:w-48">
                      <h3 className="heading-3 mb-4 flex items-center text-black dark:text-white">
                        Quest Type
                      </h3>
                      <DropdownFilter
                        label="All Types"
                        options={[
                          { value: "all", label: "All Types" },
                          ...questTypes.map((type) => ({
                            value: type,
                            label: type.charAt(0).toUpperCase() + type.slice(1),
                          })),
                        ]}
                        selected={selectedQuestType}
                        onSelect={setSelectedQuestType}
                      />
                    </div>
                    {/* Date Filter */}
                    <div className="lg:w-48">
                      <h3 className="heading-3 mb-4 flex items-center text-black dark:text-white">
                        Date
                      </h3>
                      <DropdownFilter
                        label="All Dates"
                        options={[
                          { value: "all", label: "All Dates" },
                          ...dates.map((d) => ({
                            value: d,
                            label: formatDate(d),
                          })),
                        ]}
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                      />
                    </div>
                  </div>
                </GlassCard>

                {/* Reflections Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {filteredReflections.map((reflection) => (
                    <GlassCard
                      key={reflection._id}
                      className="transition-all duration-300 hover:shadow-glow flex flex-col"
                      style={{ minHeight: "300px" }} // Fixed height for symmetry
                    >
                      {/* Reflection Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-black dark:text-white text-lg mb-1">
                            {reflection.questTitle}
                          </h3>
                          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 dark:text-gray-300">
                            <Calendar className="w-4 h-4" />
                            {formatDate(reflection.createdAt)}
                            <span className="text-gray-600 dark:text-gray-300">
                              •
                            </span>
                            <span className="text-gray-600 dark:text-gray-300">
                              {reflection.questTitle}
                            </span>
                          </div>
                        </div>
                        <NeonGlowButton
                          color="accent"
                          className="p-2"
                          onClick={() => handleDeleteReflection(reflection._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </NeonGlowButton>
                      </div>
                      {/* Content Preview */}
                      <div className="mb-4 flex-1">
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                          {reflection.text}
                        </p>
                      </div>
                      {/* Quality Score */}
                      {reflection.qualityScore && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <span>Quality Score:</span>
                            <span className="text-accent-500 font-semibold">
                              {reflection.qualityScore}%
                            </span>
                          </div>
                        </div>
                      )}
                      {/* Media Section */}
                      {(reflection.imageUrl || reflection.audioUrl) && (
                        <div className="mt-auto">
                          {reflection.imageUrl && (
                            <div className="w-full flex flex-col items-center">
                              <img
                                src={reflection.imageUrl}
                                alt="Reflection"
                                className="w-full max-w-xs md:max-w-sm lg:max-w-md rounded shadow mb-2 object-cover"
                                style={{ aspectRatio: "4/3" }}
                              />
                            </div>
                          )}
                          {reflection.audioUrl && (
                            <div className="w-full flex flex-col items-center">
                              <audio
                                controls
                                src={reflection.audioUrl}
                                className="w-full max-w-xs md:max-w-sm lg:max-w-md rounded custom-audio-player"
                                onError={(e) =>
                                  (e.currentTarget.style.display = "none")
                                }
                              >
                                Your browser does not support the audio element.
                              </audio>
                            </div>
                          )}
                        </div>
                      )}
                    </GlassCard>
                  ))}
                </div>

                {/* Empty State */}
                {filteredReflections.length === 0 && (
                  <EmptyState
                    icon={BookOpen}
                    title="No Reflections Found"
                    description="Try adjusting your filters or write your first reflection to get started on your journey of self-discovery."
                    action={{
                      label: "Write First Reflection",
                      onClick: () => setShowNewReflection(true),
                      icon: Plus,
                      color: "primary",
                    }}
                  />
                )}
              </>
            )}
          </div>

          {/* Stats Sidebar */}
          <div className="xl:col-span-1">
            <div className="space-y-6">
              {/* Overall Stats */}
              <GlassCard className="p-6">
                <h3 className="heading-3 mb-6 text-black dark:text-white ">
                  Your Stats
                </h3>
                <div className="space-y-4">
                  <StatWidget
                    icon={<BookOpen className="w-5 h-5 text-secondary" />}
                    label="Total Reflections"
                    value={reflections.length}
                    color="primary"
                  />
                  <StatWidget
                    icon={<Star className="w-5 h-5 text-secondary" />}
                    label="Quality Score"
                    value={`${stats.averageQuality}%`}
                    color="secondary"
                  />
                  <StatWidget
                    icon={<Image className="w-5 h-5 text-accent" />}
                    label="Total Media"
                    value={stats.totalMedia}
                    color="accent"
                  />
                  <StatWidget
                    icon={<Target className="w-5 h-5 text-purple-400" />}
                    label="Quest Types"
                    value={stats.questTypes}
                    color="secondary"
                  />
                </div>
              </GlassCard>

              {/* Quick Actions */}
              <GlassCard className="p-6">
                <h3 className="heading-3 mb-4 text-black dark:text-white">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <NeonGlowButton
                    color="primary"
                    className="w-full text-sm flex items-center py-5"
                    onClick={() => setShowNewReflection(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Reflection
                  </NeonGlowButton>
                  <NeonGlowButton
                    color="secondary"
                    className="w-full text-sm flex items-center py-5"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    <Link to="/analytics">View Analytics</Link>
                  </NeonGlowButton>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>

      {/* New Reflection Modal */}
      <Modal
        isOpen={showNewReflection}
        onClose={() => setShowNewReflection(false)}
        title="Write New Reflection"
        size="xl"
      >
        <ReflectionForm
          questTitle={
            selectedQuestType === "all" ? "General" : selectedQuestType
          }
          questType="daily"
          onSubmitted={() => {
            setShowNewReflection(false);
            refetch();
          }}
        />
      </Modal>

      {/* Delete Reflection Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Reflection"
        size="sm"
        actions={[
          {
            label: "Cancel",
            onClick: () => setShowDeleteModal(false),
            color: "secondary",
          },
          {
            label: "Delete",
            onClick: confirmDelete,
            color: "accent",
          },
        ]}
      >
        <p className="text-gray-600 dark:text-gray-300">
          Are you sure you want to delete this reflection? This action cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
};
