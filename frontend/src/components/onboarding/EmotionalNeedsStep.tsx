import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const emotionalNeedsSchema = z.object({
  primary: z
    .array(z.string())
    .min(1, "Please select at least one primary need"),
  secondary: z
    .array(z.string())
    .min(1, "Please select at least one secondary need"),
  unmetNeeds: z.array(z.string()),
  supportPreferences: z
    .array(z.string())
    .min(1, "Please select at least one support preference"),
});

type EmotionalNeedsFormData = z.infer<typeof emotionalNeedsSchema>;

interface EmotionalNeedsStepProps {
  initialData?: EmotionalNeedsFormData;
  onSubmit: (data: EmotionalNeedsFormData) => void;
  isLoading?: boolean;
}

const emotionalNeeds = {
  primary: [
    "Safety and Security",
    "Love and Belonging",
    "Self-esteem",
    "Personal Growth",
    "Purpose and Meaning",
    "Autonomy",
    "Connection",
    "Recognition",
  ],
  secondary: [
    "Achievement",
    "Creativity",
    "Adventure",
    "Knowledge",
    "Harmony",
    "Order",
    "Power",
    "Service to Others",
  ],
};

const supportPreferences = [
  "Active Listening",
  "Emotional Validation",
  "Practical Advice",
  "Shared Activities",
  "Space and Time",
  "Physical Comfort",
  "Verbal Affirmation",
  "Problem Solving",
];

export const EmotionalNeedsStep = ({
  initialData,
  onSubmit,
  isLoading = false,
}: EmotionalNeedsStepProps) => {
  const [newUnmetNeed, setNewUnmetNeed] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EmotionalNeedsFormData>({
    resolver: zodResolver(emotionalNeedsSchema),
    defaultValues: initialData || {
      primary: [],
      secondary: [],
      unmetNeeds: [],
      supportPreferences: [],
    },
  });

  const unmetNeeds = watch("unmetNeeds");

  const handleAddUnmetNeed = () => {
    if (newUnmetNeed.trim()) {
      setValue("unmetNeeds", [...unmetNeeds, newUnmetNeed.trim()]);
      setNewUnmetNeed("");
    }
  };

  const handleRemoveUnmetNeed = (index: number) => {
    setValue(
      "unmetNeeds",
      unmetNeeds.filter((_, i) => i !== index)
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Primary Needs */}
      <div>
        <label className="block text-sm font-medium text-black dark:text-white mb-2">
          What are your primary emotional needs? (Select all that apply)
        </label>
        <div className="grid grid-cols-2 gap-3">
          {emotionalNeeds.primary.map((need) => (
            <label
              key={need}
              className={`
                relative flex items-center p-4 rounded-lg border cursor-pointer bg-white dark:bg-background-800
                ${
                  watch("primary")?.includes(need)
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-200"
                }
              `}
            >
              <input
                type="checkbox"
                className="sr-only"
                value={need}
                {...register("primary")}
              />
              <span
                className={`text-sm font-medium text-black dark:text-white ${
                  watch("primary")?.includes(need)
                    ? "text-indigo-600"
                    : "text-gray-900"
                }`}
              >
                {need}
              </span>
            </label>
          ))}
        </div>
        {errors.primary && (
          <p className="mt-1 text-sm text-red-600">{errors.primary.message}</p>
        )}
      </div>

      {/* Secondary Needs */}
      <div>
        <label className="block text-sm font-medium text-black dark:text-white mb-2">
          What are your secondary emotional needs? (Select all that apply)
        </label>
        <div className="grid grid-cols-2 gap-3">
          {emotionalNeeds.secondary.map((need) => (
            <label
              key={need}
              className={`
                relative flex items-center p-4 rounded-lg border cursor-pointer bg-white dark:bg-background-800
                ${
                  watch("secondary")?.includes(need)
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-200"
                }
              `}
            >
              <input
                type="checkbox"
                className="sr-only"
                value={need}
                {...register("secondary")}
              />
              <span
                className={`text-sm font-medium text-black dark:text-white ${
                  watch("secondary")?.includes(need)
                    ? "text-indigo-600"
                    : "text-gray-900"
                }`}
              >
                {need}
              </span>
            </label>
          ))}
        </div>
        {errors.secondary && (
          <p className="mt-1 text-sm text-red-600">
            {errors.secondary.message}
          </p>
        )}
      </div>

      {/* Unmet Needs */}
      <div>
        <label className="block text-sm font-medium text-black dark:text-white mb-2">
          What emotional needs do you feel are currently unmet? (Optional)
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newUnmetNeed}
            onChange={(e) => setNewUnmetNeed(e.target.value)}
            className="input-field"
            placeholder="Enter an unmet need"
          />
          <button
            type="button"
            onClick={handleAddUnmetNeed}
            className="btn-primary"
          >
            Add
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {unmetNeeds.map((need, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-background-800  dark:text-white text-black"
            >
              {need}
              <button
                type="button"
                onClick={() => handleRemoveUnmetNeed(index)}
                className="ml-2 inline-flex items-center p-0.5 rounded-full text-indigo-600  focus:outline-none"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Support Preferences */}
      <div>
        <label className="block text-sm font-medium text-black dark:text-white mb-2">
          How do you prefer to receive emotional support? (Select all that
          apply)
        </label>
        <div className="grid grid-cols-2 gap-3">
          {supportPreferences.map((preference) => (
            <label
              key={preference}
              className={`
                relative flex items-center p-4 rounded-lg border cursor-pointer bg-white dark:bg-background-800
                ${
                  watch("supportPreferences")?.includes(preference)
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-200"
                }
              `}
            >
              <input
                type="checkbox"
                className="sr-only"
                value={preference}
                {...register("supportPreferences")}
              />
              <span
                className={`text-sm font-medium text-black dark:text-white ${
                  watch("supportPreferences")?.includes(preference)
                    ? "text-indigo-600"
                    : "text-gray-900"
                }`}
              >
                {preference}
              </span>
            </label>
          ))}
        </div>
        {errors.supportPreferences && (
          <p className="mt-1 text-sm text-red-600">
            {errors.supportPreferences.message}
          </p>
        )}
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex justify-center"
        >
          {isLoading ? "Saving..." : "Continue"}
        </button>
      </div>
    </form>
  );
};
