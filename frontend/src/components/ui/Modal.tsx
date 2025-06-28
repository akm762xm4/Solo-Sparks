import type { ReactNode } from "react";
import { X } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { NeonGlowButton } from "./NeonGlowButton";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
  actions?: {
    label: string;
    onClick: () => void;
    color?: "primary" | "secondary" | "accent";
    variant?: "solid" | "outline";
  }[];
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  actions = [],
}: ModalProps) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <GlassCard
        className={`${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="heading-3 text-black dark:text-white">{title}</h3>
          {showCloseButton && (
            <button
              title="Close"
              onClick={onClose}
              className="text-text-muted hover:text-text-primary transition-colors p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="mb-6 text-black dark:text-white">{children}</div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex gap-3 justify-end">
            {actions.map((action, index) => (
              <NeonGlowButton
                key={index}
                color={action.color || "primary"}
                onClick={action.onClick}
                className="flex-1 sm:flex-none"
              >
                {action.label}
              </NeonGlowButton>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
};
