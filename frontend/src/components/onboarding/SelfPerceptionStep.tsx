import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const selfPerceptionSchema = z.object({
  strengths: z.array(z.string()).min(1, "Please add at least one strength"),
  weaknesses: z
    .array(z.string())
    .min(1, "Please add at least one area for improvement"),
  growthAreas: z
    .array(z.string())
    .min(1, "Please add at least one growth area"),
  values: z.array(z.string()).min(1, "Please add at least one core value"),
});

type SelfPerceptionFormData = z.infer<typeof selfPerceptionSchema>;

interface SelfPerceptionStepProps {
  initialData?: SelfPerceptionFormData;
  onSubmit: (data: SelfPerceptionFormData) => void;
  isLoading?: boolean;
}

interface InputListProps {
  label: string;
  placeholder: string;
  values: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  error?: string;
}

const InputList = ({
  label,
  placeholder,
  values,
  onAdd,
  onRemove,
  error,
}: InputListProps) => {
  const [newValue, setNewValue] = useState("");

  const handleAdd = () => {
    if (newValue.trim()) {
      onAdd(newValue.trim());
      setNewValue("");
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-black dark:text-white mb-2">
        {label}
      </label>
      <div className="flex space-x-2">
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="input-field"
          placeholder={placeholder}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <button type="button" onClick={handleAdd} className="btn-primary">
          Add
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.map((value, index) => (
          <span
            key={index}
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-background-800  dark:text-white text-black`}
          >
            {value}
            <button
              type="button"
              onClick={() => onRemove(index)}
              className={`ml-2 inline-flex items-center p-0.5 rounded-full text-indigo-600  focus:outline-none`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export const SelfPerceptionStep = ({
  initialData,
  onSubmit,
  isLoading = false,
}: SelfPerceptionStepProps) => {
  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<SelfPerceptionFormData>({
    resolver: zodResolver(selfPerceptionSchema),
    defaultValues: initialData || {
      strengths: [],
      weaknesses: [],
      growthAreas: [],
      values: [],
    },
  });

  const strengths = watch("strengths");
  const weaknesses = watch("weaknesses");
  const growthAreas = watch("growthAreas");
  const values = watch("values");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <InputList
        label="What are your personal strengths?"
        placeholder="Enter a strength"
        values={strengths}
        onAdd={(value) => setValue("strengths", [...strengths, value])}
        onRemove={(index) =>
          setValue(
            "strengths",
            strengths.filter((_, i) => i !== index)
          )
        }
        error={errors.strengths?.message}
      />

      <InputList
        label="What areas would you like to improve?"
        placeholder="Enter an area for improvement"
        values={weaknesses}
        onAdd={(value) => setValue("weaknesses", [...weaknesses, value])}
        onRemove={(index) =>
          setValue(
            "weaknesses",
            weaknesses.filter((_, i) => i !== index)
          )
        }
        error={errors.weaknesses?.message}
      />

      <InputList
        label="What are your key areas for personal growth?"
        placeholder="Enter a growth area"
        values={growthAreas}
        onAdd={(value) => setValue("growthAreas", [...growthAreas, value])}
        onRemove={(index) =>
          setValue(
            "growthAreas",
            growthAreas.filter((_, i) => i !== index)
          )
        }
        error={errors.growthAreas?.message}
      />

      <InputList
        label="What are your core values?"
        placeholder="Enter a value"
        values={values}
        onAdd={(value) => setValue("values", [...values, value])}
        onRemove={(index) =>
          setValue(
            "values",
            values.filter((_, i) => i !== index)
          )
        }
        error={errors.values?.message}
      />

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
