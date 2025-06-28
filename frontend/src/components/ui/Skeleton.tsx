import { cn } from "../../utils/cn";

interface SkeletonProps {
  className?: string;
  variant?: "card" | "text" | "circle" | "button";
  lines?: number;
}

export const Skeleton = ({
  className,
  variant = "text",
  lines = 1,
}: SkeletonProps) => {
  const baseClasses =
    "skeleton-shimmer bg-gradient-to-r from-white/10 to-white/5 rounded";

  const variants = {
    card: "h-48 w-full skeleton-shimmer bg-gradient-to-r from-white/10 to-white/5 glass-card rounded-lg border border-white/10",
    text: "h-4 skeleton-shimmer bg-gradient-to-r from-white/10 to-white/5 glass-card rounded",
    circle:
      "h-12 w-12 skeleton-shimmer bg-gradient-to-r from-white/10 to-white/5 glass-card rounded-full",
    button:
      "h-10 skeleton-shimmer bg-gradient-to-r from-white/10 to-white/5 glass-card rounded-lg",
  };

  if (variant === "text" && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              i === lines - 1 ? "w-3/4" : "w-full",
              className
            )}
          />
        ))}
      </div>
    );
  }

  return <div className={cn(variants[variant], className)} />;
};

// Minimal, consistent skeletons (same as Quest/Rewards)
export const ReflectionCardSkeleton = () => (
  <div className="glass-card p-6 rounded-xl border border-white/10 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" variant="circle" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" variant="circle" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Skeleton className="h-8 w-8" variant="circle" />
    </div>
    <Skeleton lines={2} className="mb-4" />
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-16" />
    </div>
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-20" variant="button" />
      <Skeleton className="h-8 w-24" variant="button" />
    </div>
  </div>
);

export const StatWidgetSkeleton = () => (
  <div className="glass-card p-6 rounded-xl border border-white/10 animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <Skeleton className="h-10 w-10" variant="circle" />
      <div className="flex-1">
        <Skeleton className="h-4 w-20 mb-1" />
        <Skeleton className="h-6 w-12" />
      </div>
    </div>
    <Skeleton className="h-3 w-full rounded-full mb-2" />
    <div className="flex justify-between">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-12" />
    </div>
  </div>
);

export const QuickActionSkeleton = () => (
  <div className="glass-card p-6 rounded-xl border border-white/10 animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <Skeleton className="h-8 w-8" variant="circle" />
      <Skeleton className="h-4 w-24" />
    </div>
    <Skeleton className="h-3 w-full rounded-full mb-2" />
    <div className="flex justify-between">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-12" />
    </div>
  </div>
);

export const FilterSkeleton = () => (
  <div className="glass-card p-6 rounded-xl border border-white/10 animate-pulse">
    <Skeleton className="h-6 w-20 mb-2" />
    <Skeleton className="h-10 w-full" variant="button" />
  </div>
);

// Quest/Rewards skeletons remain unchanged
export const QuestCardSkeleton = () => (
  <div className="glass-card p-6 rounded-xl border border-white/10">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-6 w-6" variant="circle" />
          <Skeleton className="h-6 w-3/4" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" variant="circle" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <Skeleton className="h-8 w-8" variant="circle" />
    </div>
    <Skeleton lines={2} className="mb-4" />
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-16" />
    </div>
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-20" variant="button" />
      <Skeleton className="h-8 w-24" variant="button" />
    </div>
  </div>
);

export const QuestProgressSkeleton = () => (
  <div className="glass-card p-6 rounded-xl border border-white/10">
    <div className="flex items-center gap-3 mb-4">
      <Skeleton className="h-12 w-12" variant="circle" />
      <div className="flex-1">
        <Skeleton className="h-5 w-32 mb-1" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    <Skeleton className="h-3 w-full rounded-full mb-2" />
    <div className="flex justify-between">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-12" />
    </div>
  </div>
);

export const QuestStatsSkeleton = () => (
  <div className="space-y-4">
    <StatWidgetSkeleton />
    <StatWidgetSkeleton />
    <StatWidgetSkeleton />
    <StatWidgetSkeleton />
  </div>
);
