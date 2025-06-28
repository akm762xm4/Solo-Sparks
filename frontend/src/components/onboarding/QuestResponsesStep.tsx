import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const questResponsesSchema = z.object({
  pastChallenges: z
    .array(z.string())
    .min(1, "Please add at least one past challenge"),
  copingStrategies: z
    .array(z.string())
    .min(1, "Please add at least one coping strategy"),
  futureGoals: z
    .array(z.string())
    .min(1, "Please add at least one future goal"),
  supportSystem: z
    .array(z.string())
    .min(1, "Please add at least one support system element"),
});

type QuestResponsesFormData = z.infer<typeof questResponsesSchema>;

interface QuestResponsesStepProps {
  initialData?: QuestResponsesFormData;
  onSubmit: (data: QuestResponsesFormData) => void;
  isLoading?: boolean;
}

interface TextAreaListProps {
  label: string;
  description: string;
  placeholder: string;
  values: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  error?: string;
  chipColor?: string;
}

const TextAreaList = ({
  label,
  description,
  placeholder,
  values,
  onAdd,
  onRemove,
  error,
  chipColor = "indigo",
}: TextAreaListProps) => {
  const [newValue, setNewValue] = useState("");

  const handleAdd = () => {
    if (newValue.trim()) {
      onAdd(newValue.trim());
      setNewValue("");
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-black dark:text-white mb-1">
        {label}
      </label>
      <p className="text-sm text-black  dark:text-white mb-2">{description}</p>
      <div className="space-y-2">
        <textarea
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="input-field"
          placeholder={placeholder}
          rows={3}
        />
        <button type="button" onClick={handleAdd} className="btn-primary">
          Add Response
        </button>
      </div>
      <div className="mt-3 space-y-2">
        {values.map((value, index) => (
          <div
            key={index}
            className={`group relative rounded-lg p-4 bg-${chipColor}-50 dark:bg-background-800 border border-${chipColor}-200 dark:border-${chipColor}-800`}
          >
            <p className="text-sm text-gray-700 dark:text-white pr-8">
              {value}
            </p>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className={`absolute top-2 right-2 p-1 rounded-full text-${chipColor}-600 dark:text-${chipColor}-300 hover:bg-${chipColor}-100 dark:hover:bg-${chipColor}-900 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export const QuestResponsesStep = ({
  initialData,
  onSubmit,
  isLoading = false,
}: QuestResponsesStepProps) => {
  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<QuestResponsesFormData>({
    resolver: zodResolver(questResponsesSchema),
    defaultValues: initialData || {
      pastChallenges: [],
      copingStrategies: [],
      futureGoals: [],
      supportSystem: [],
    },
  });

  const pastChallenges = watch("pastChallenges");
  const copingStrategies = watch("copingStrategies");
  const futureGoals = watch("futureGoals");
  const supportSystem = watch("supportSystem");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <TextAreaList
        label="Past Challenges"
        description="Describe significant emotional or personal challenges you've faced."
        placeholder="Share a challenging experience and how it affected you..."
        values={pastChallenges}
        onAdd={(value) =>
          setValue("pastChallenges", [...pastChallenges, value])
        }
        onRemove={(index) =>
          setValue(
            "pastChallenges",
            pastChallenges.filter((_, i) => i !== index)
          )
        }
        error={errors.pastChallenges?.message}
        chipColor="rose"
      />

      <TextAreaList
        label="Coping Strategies"
        description="What strategies have you developed to handle difficult situations?"
        placeholder="Describe a coping strategy that works for you..."
        values={copingStrategies}
        onAdd={(value) =>
          setValue("copingStrategies", [...copingStrategies, value])
        }
        onRemove={(index) =>
          setValue(
            "copingStrategies",
            copingStrategies.filter((_, i) => i !== index)
          )
        }
        error={errors.copingStrategies?.message}
        chipColor="emerald"
      />

      <TextAreaList
        label="Future Goals"
        description="What personal growth goals would you like to achieve?"
        placeholder="Share a goal and why it's important to you..."
        values={futureGoals}
        onAdd={(value) => setValue("futureGoals", [...futureGoals, value])}
        onRemove={(index) =>
          setValue(
            "futureGoals",
            futureGoals.filter((_, i) => i !== index)
          )
        }
        error={errors.futureGoals?.message}
        chipColor="sky"
      />

      <TextAreaList
        label="Support System"
        description="Who or what provides you with emotional support?"
        placeholder="Describe an element of your support system..."
        values={supportSystem}
        onAdd={(value) => setValue("supportSystem", [...supportSystem, value])}
        onRemove={(index) =>
          setValue(
            "supportSystem",
            supportSystem.filter((_, i) => i !== index)
          )
        }
        error={errors.supportSystem?.message}
        chipColor="violet"
      />

      <div className="mt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex justify-center"
        >
          {isLoading ? "Saving..." : "Complete Onboarding"}
        </button>
      </div>
    </form>
  );
};
