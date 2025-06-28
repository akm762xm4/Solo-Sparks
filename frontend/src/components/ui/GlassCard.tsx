import type { ReactNode, HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  borderColor?: "primary" | "secondary" | "accent" | "default";
}

export const GlassCard = ({
  children,
  borderColor = "default",
  className = "",
  ...props
}: GlassCardProps) => {
  const borderClass =
    borderColor === "primary"
      ? "border-primary-500/30 shadow-neon-blue"
      : borderColor === "secondary"
      ? "border-secondary-500/30 shadow-neon-purple"
      : borderColor === "accent"
      ? "border-accent-500/30 shadow-neon-green"
      : "border-white/10 shadow-glass";

  return (
    <div
      className={`glass-card border-2 ${borderClass} p-6 rounded-2xl transition-all duration-300 
        bg-white/60 dark:bg-background-400 light:bg-white/80
        border-white/10 dark:border-white/30 light:border-black/10
        ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
