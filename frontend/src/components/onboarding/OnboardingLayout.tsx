import type { ReactNode } from "react";
import { CheckCircle, Circle } from "lucide-react";

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
  onNext?: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  isNextDisabled?: boolean;
  isLoading?: boolean;
}

export const OnboardingLayout = ({
  children,
  currentStep,
  totalSteps,
  title,
  description,
  onNext,
  onBack,
  onSkip,
  isNextDisabled = false,
  isLoading = false,
}: OnboardingLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-background-900 dark:to-background-800 md:py-12 py-6 px-3 md:px-6 lg:px-8 transition-colors">
      <div className="max-w-3xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between px-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div key={index} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  {index < currentStep ? (
                    <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-indigo-600 dark:text-primary-400 drop-shadow-neon" />
                  ) : index === currentStep ? (
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-indigo-600 dark:bg-primary-500 flex items-center justify-center text-white text-xs md:text-sm font-medium shadow-neon-blue">
                      {index + 1}
                    </div>
                  ) : (
                    <Circle className="w-6 h-6 md:w-8 md:h-8 text-gray-300 dark:text-gray-700" />
                  )}
                </div>
                {index < totalSteps - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded-full transition-colors duration-300 ${
                      index < currentStep
                        ? "bg-indigo-600 dark:bg-primary-400 shadow-neon-blue"
                        : "bg-gray-200 dark:bg-background-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="glass-card-primary bg-white/90 dark:bg-background-800/80 rounded-xl shadow-xl border border-primary-500/20 dark:border-primary-500/40 overflow-hidden transition-colors">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="md:text-3xl text-2xl font-bold text-gray-900 dark:text-white gradient-text mb-2">
                {title}
              </h2>
              <p className="mt-2 md:text-lg text-md text-gray-600 dark:text-gray-300">
                {description}
              </p>
            </div>

            <div className="space-y-6">{children}</div>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200 dark:border-background-700">
              <div>
                {onBack && (
                  <button
                    type="button"
                    onClick={onBack}
                    className="btn-secondary"
                  >
                    Back
                  </button>
                )}
              </div>
              <div className="flex items-center space-x-4">
                {onSkip && (
                  <button
                    type="button"
                    onClick={onSkip}
                    className="btn-outline"
                  >
                    Skip this step
                  </button>
                )}
                {onNext && (
                  <button
                    type="button"
                    onClick={onNext}
                    disabled={isNextDisabled || isLoading}
                    className="btn-primary"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      "Continue"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
