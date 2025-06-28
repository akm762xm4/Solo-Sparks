import type { ReactNode } from "react";

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TabGroupProps {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export const TabGroup = ({
  tabs,
  active,
  onChange,
  className = "",
}: TabGroupProps) => {
  return (
    <div className={`md:flex grid grid-cols-2 md:gap-2 gap-1 ${className}`}>
      {tabs?.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`relative md:text-base text-sm md:px-6 px-2 md:py-3 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200
            ${
              active === tab.id
                ? "text-primary-500 after:absolute after:left-4 after:right-4 after:-bottom-1 after:h-1 after:rounded-full after:bg-gradient-to-r after:from-primary-500 after:to-accent-500 after:shadow-neon-blue bg-white/10"
                : "text-gray-600 dark:text-gray-300 hover:text-primary-500 hover:bg-white/5"
            }
          `}
        >
          {tab.icon && <span className="w-5 h-5">{tab.icon}</span>}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};
