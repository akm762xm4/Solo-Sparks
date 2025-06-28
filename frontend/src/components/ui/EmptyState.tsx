import type { LucideIcon } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { NeonGlowButton } from "./NeonGlowButton";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
    color?: "primary" | "secondary" | "accent";
  };
  className?: string;
  iconClassName?: string;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className = "",
  iconClassName = "",
}: EmptyStateProps) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <GlassCard className="p-8 max-w-md mx-auto">
        <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
          <Icon className={`w-12 h-12 text-white ${iconClassName}`} />
        </div>
        <h3 className="heading-3 mb-3 text-text-primary">{title}</h3>
        <p className="text-text-secondary mb-6 leading-relaxed">
          {description}
        </p>
        {action && (
          <NeonGlowButton
            color={action.color || "primary"}
            onClick={action.onClick}
            className="flex items-center mx-auto"
          >
            {action.icon && <action.icon className="w-5 h-5 mr-2" />}
            {action.label}
          </NeonGlowButton>
        )}
      </GlassCard>
    </div>
  );
};
