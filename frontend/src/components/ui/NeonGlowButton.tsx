import type { ButtonHTMLAttributes, ReactNode } from "react";

interface NeonGlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  color?: "primary" | "secondary" | "accent";
}

export const NeonGlowButton = ({
  children,
  color = "primary",
  className = "",
  ...props
}: NeonGlowButtonProps) => {
  const colorClass =
    color === "primary"
      ? "bg-gradient-to-r from-primary-500 to-primary-600 shadow-neon-blue hover:shadow-glow"
      : color === "secondary"
      ? "bg-gradient-to-r from-secondary-500 to-secondary-600 shadow-neon-purple hover:shadow-glow"
      : "bg-gradient-to-r from-accent-500 to-accent-600 shadow-neon-green hover:shadow-glow";

  return (
    <button
      className={`rounded-xl md:px-6 px-4 md:py-3 py-2 font-semibold text-white transition-all duration-300 text-sm md:text-base  focus:outline-none focus:ring-2 focus:ring-primary-500/50 
        dark:text-white light:text-black
        ${colorClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
