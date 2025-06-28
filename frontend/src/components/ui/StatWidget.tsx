import { ReactNode } from "react";

interface StatWidgetProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  color?: "primary" | "secondary" | "accent";
  className?: string;
}

export const StatWidget = ({
  icon,
  label,
  value,
  color = "primary",
  className = "",
}: StatWidgetProps) => {
  const colorClass =
    color === "primary"
      ? "text-primary-500"
      : color === "secondary"
      ? "text-secondary-500"
      : "text-accent-500";
  const bgClass =
    color === "primary"
      ? "bg-gradient-to-br from-primary-500 to-accent-500"
      : color === "secondary"
      ? "bg-gradient-to-br from-secondary-500 to-primary-500"
      : "bg-gradient-to-br from-accent-500 to-secondary-500";

  return (
    <div className={`glass-card flex items-center gap-4 p-4 ${className}`}>
      <div
        className={`w-12 h-12 ${bgClass} rounded-xl flex items-center justify-center`}
      >
        {icon}
      </div>
      <div>
        <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {label}
        </div>
        <div className={`text-2xl font-bold ${colorClass}`}>{value}</div>
      </div>
    </div>
  );
};
