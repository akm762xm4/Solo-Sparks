interface NeonProgressBarProps {
  value: number; // 0-100
  color?: "primary" | "secondary" | "accent";
  className?: string;
}

export const NeonProgressBar = ({
  value,
  color = "primary",
  className = "",
}: NeonProgressBarProps) => {
  const colorClass =
    color === "primary"
      ? "from-primary-500 to-accent-500 shadow-neon-blue"
      : color === "secondary"
      ? "from-secondary-500 to-primary-500 shadow-neon-purple"
      : "from-accent-500 to-secondary-500 shadow-neon-green";

  return (
    <div className={`w-full bg-white/10 rounded-full h-3 ${className}`}>
      <div
        className={`h-3 rounded-full bg-gradient-to-r ${colorClass} transition-all duration-500 animate-glow`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      ></div>
    </div>
  );
};
