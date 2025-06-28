import { Loader2 } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner = ({
  size = "md",
  text = "Loading...",
  className = "",
  fullScreen = false,
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        <Loader2
          className={`${sizeClasses[size]} text-primary-500 animate-spin drop-shadow-glow`}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full blur-sm opacity-30 animate-pulse"></div>
      </div>
      {text && (
        <p className="text-text-secondary mt-3 text-sm font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background-500 flex items-center justify-center z-50">
        <GlassCard className="p-8">{spinner}</GlassCard>
      </div>
    );
  }

  return <GlassCard className="p-6">{spinner}</GlassCard>;
};
