import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DropdownFilter } from "../../pages/ReflectionsPage";

const moodSchema = z.object({
  general: z.string().min(1, "Please select your general mood"),
  frequency: z.enum(["rarely", "sometimes", "often", "always"]),
  triggers: z.array(z.string()).min(1, "Please add at least one trigger"),
  copingMechanisms: z
    .array(z.string())
    .min(1, "Please add at least one coping mechanism"),
});

type MoodFormData = z.infer<typeof moodSchema>;

interface MoodStepProps {
  initialData?: MoodFormData;
  onSubmit: (data: MoodFormData) => void;
  isLoading?: boolean;
}

const moodOptions = [
  "Happy",
  "Content",
  "Neutral",
  "Anxious",
  "Sad",
  "Stressed",
  "Excited",
  "Overwhelmed",
];

const frequencyOptions = [
  { value: "rarely", label: "Rarely" },
  { value: "sometimes", label: "Sometimes" },
  { value: "often", label: "Often" },
  { value: "always", label: "Always" },
];

export const MoodStep = ({
  initialData,
  onSubmit,
  isLoading = false,
}: MoodStepProps) => {
  const [newTrigger, setNewTrigger] = useState("");
  const [newCoping, setNewCoping] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MoodFormData>({
    resolver: zodResolver(moodSchema),
    defaultValues: initialData || {
      triggers: [],
      copingMechanisms: [],
    },
  });

  const triggers = watch("triggers");
  const copingMechanisms = watch("copingMechanisms");

  const handleAddTrigger = () => {
    if (newTrigger.trim()) {
      setValue("triggers", [...triggers, newTrigger.trim()]);
      setNewTrigger("");
    }
  };

  const handleAddCoping = () => {
    if (newCoping.trim()) {
      setValue("copingMechanisms", [...copingMechanisms, newCoping.trim()]);
      setNewCoping("");
    }
  };

  const handleRemoveTrigger = (index: number) => {
    setValue(
      "triggers",
      triggers.filter((_, i) => i !== index)
    );
  };

  const handleRemoveCoping = (index: number) => {
    setValue(
      "copingMechanisms",
      copingMechanisms.filter((_, i) => i !== index)
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* General Mood */}
      <div>
        <label className="block text-sm font-medium text-black dark:text-white mb-2">
          How would you describe your general mood?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {moodOptions.map((mood) => (
            <label
              key={mood}
              className={`
                relative flex items-center justify-center p-4 rounded-lg border cursor-pointer bg-white dark:bg-background-800
                ${
                  watch("general") === mood
                    ? "border-indigo-600 bg-indigo-50 "
                    : "border-gray-200 hover:border-indigo-200"
                }
              `}
            >
              <input
                type="radio"
                className="sr-only"
                value={mood}
                {...register("general")}
              />
              <span
                className={`text-sm font-medium text-black dark:text-white ${
                  watch("general") === mood
                    ? "text-indigo-600"
                    : "text-gray-900 "
                }`}
              >
                {mood}
              </span>
            </label>
          ))}
        </div>
        {errors.general && (
          <p className="mt-1 text-sm text-red-600">{errors.general.message}</p>
        )}
      </div>

      {/* Frequency */}
      <div>
        <label className="block text-sm font-medium text-black dark:text-white mb-2">
          How often do you experience this mood?
        </label>
        <DropdownFilter
          label="All Frequencies"
          options={[
            { value: "all", label: "All Frequencies" },
            ...frequencyOptions.map((type) => ({
              value: type.value,
              label: type.label,
            })),
          ]}
          selected={watch("frequency")}
          onSelect={(value) =>
            setValue(
              "frequency",
              value as "rarely" | "sometimes" | "often" | "always"
            )
          }
        />
        {errors.frequency && (
          <p className="mt-1 text-sm text-red-600">
            {errors.frequency.message}
          </p>
        )}
      </div>

      {/* Triggers */}
      <div>
        <label className="block text-sm font-medium text-black dark:text-white mb-2">
          What triggers this mood? (Add as many as you'd like)
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newTrigger}
            onChange={(e) => setNewTrigger(e.target.value)}
            className="input-field"
            placeholder="Enter a trigger"
          />
          <button
            type="button"
            onClick={handleAddTrigger}
            className="btn-primary"
          >
            Add
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {triggers.map((trigger, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-background-800  dark:text-white text-black"
            >
              {trigger}
              <button
                type="button"
                onClick={() => handleRemoveTrigger(index)}
                className="ml-2 inline-flex items-center p-0.5 rounded-full text-indigo-600    focus:outline-none"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        {errors.triggers && (
          <p className="mt-1 text-sm text-red-600">{errors.triggers.message}</p>
        )}
      </div>

      {/* Coping Mechanisms */}
      <div>
        <label className="block text-sm font-medium text-black dark:text-white mb-2">
          What helps you cope with this mood? (Add as many as you'd like)
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newCoping}
            onChange={(e) => setNewCoping(e.target.value)}
            className="input-field"
            placeholder="Enter a coping mechanism"
          />
          <button
            type="button"
            onClick={handleAddCoping}
            className="btn-primary"
          >
            Add
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {copingMechanisms.map((mechanism, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-background-800  dark:text-white text-black"
            >
              {mechanism}
              <button
                type="button"
                onClick={() => handleRemoveCoping(index)}
                className="ml-2 inline-flex items-center p-0.5 rounded-full text-indigo-600  focus:outline-none"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        {errors.copingMechanisms && (
          <p className="mt-1 text-sm text-red-600">
            {errors.copingMechanisms.message}
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
