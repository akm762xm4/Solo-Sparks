import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const personalitySchema = z.object({
  mbti: z.string().min(4, "Please select your MBTI type"),
  enneagram: z.string().min(1, "Please select your Enneagram type"),
  bigFive: z.object({
    openness: z.number().min(0).max(100),
    conscientiousness: z.number().min(0).max(100),
    extraversion: z.number().min(0).max(100),
    agreeableness: z.number().min(0).max(100),
    neuroticism: z.number().min(0).max(100),
  }),
});

type PersonalityFormData = z.infer<typeof personalitySchema>;

interface PersonalityStepProps {
  initialData?: PersonalityFormData;
  onSubmit: (data: PersonalityFormData) => void;
  isLoading?: boolean;
}

const mbtiTypes = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
] as const;

const enneagramTypes = [
  "1 - The Reformer",
  "2 - The Helper",
  "3 - The Achiever",
  "4 - The Individualist",
  "5 - The Investigator",
  "6 - The Loyalist",
  "7 - The Enthusiast",
  "8 - The Challenger",
  "9 - The Peacemaker",
] as const;

type BigFiveKey = keyof PersonalityFormData["bigFive"];

const bigFiveTraits: Array<{
  key: BigFiveKey;
  label: string;
}> = [
  { key: "openness", label: "Openness to Experience" },
  { key: "conscientiousness", label: "Conscientiousness" },
  { key: "extraversion", label: "Extraversion" },
  { key: "agreeableness", label: "Agreeableness" },
  { key: "neuroticism", label: "Neuroticism" },
];

export const PersonalityStep = ({
  initialData,
  onSubmit,
  isLoading = false,
}: PersonalityStepProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PersonalityFormData>({
    resolver: zodResolver(personalitySchema),
    defaultValues: initialData || {
      bigFive: {
        openness: 50,
        conscientiousness: 50,
        extraversion: 50,
        agreeableness: 50,
        neuroticism: 50,
      },
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* MBTI Type */}
      <div>
        <label className="block text-sm font-medium text-black dark:text-white mb-2">
          What's your MBTI personality type?
        </label>
        <div className="grid grid-cols-4 gap-3">
          {mbtiTypes.map((type) => (
            <label
              key={type}
              className={`
                relative flex items-center justify-center p-4 rounded-lg border cursor-pointer bg-white dark:bg-background-800 md:text-sm text-xs
                ${
                  watch("mbti") === type
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-200"
                }
              `}
            >
              <input
                type="radio"
                className="sr-only"
                value={type}
                {...register("mbti")}
              />
              <span
                className={`text-sm font-medium text-black dark:text-white ${
                  watch("mbti") === type ? "text-indigo-600" : "text-gray-900"
                }`}
              >
                {type}
              </span>
            </label>
          ))}
        </div>
        {errors.mbti && (
          <p className="mt-1 text-sm text-red-600">{errors.mbti.message}</p>
        )}
      </div>

      {/* Enneagram Type */}
      <div>
        <label className="block text-sm font-medium text-black dark:text-white mb-2">
          What's your Enneagram type?
        </label>
        <div className="grid grid-cols-3 gap-3">
          {enneagramTypes.map((type) => (
            <label
              key={type}
              className={`
                relative flex items-center justify-center p-4 rounded-lg border cursor-pointer bg-white dark:bg-background-800 md:text-sm text-xs
                ${
                  watch("enneagram") === type
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-200"
                }
              `}
            >
              <input
                type="radio"
                className="sr-only"
                value={type}
                {...register("enneagram")}
              />
              <span
                className={`md:text-sm text-xs font-medium text-center text-black dark:text-white ${
                  watch("enneagram") === type
                    ? "text-indigo-600"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                {type}
              </span>
            </label>
          ))}
        </div>
        {errors.enneagram && (
          <p className="mt-1 text-sm text-red-600">
            {errors.enneagram.message}
          </p>
        )}
      </div>

      {/* Big Five Traits */}
      <div>
        <h3 className="text-lg font-medium text-black dark:text-white mb-4">
          Big Five Personality Traits
        </h3>
        <div className="space-y-6">
          {bigFiveTraits.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                {label}
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="input-field flex-1 h-2 bg-gray-200 dark:bg-background-700 rounded-lg appearance-none cursor-pointer"
                  {...register(`bigFive.${key}` as const, {
                    valueAsNumber: true,
                  })}
                />
                <span className="text-sm text-gray-500 dark:text-white w-12 text-right">
                  {watch(`bigFive.${key}` as const)}%
                </span>
              </div>
            </div>
          ))}
        </div>
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
