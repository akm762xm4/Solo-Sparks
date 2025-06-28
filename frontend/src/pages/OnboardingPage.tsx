import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../components/onboarding/OnboardingLayout";
import { MoodStep } from "../components/onboarding/MoodStep";
import { PersonalityStep } from "../components/onboarding/PersonalityStep";
import { EmotionalNeedsStep } from "../components/onboarding/EmotionalNeedsStep";
import { SelfPerceptionStep } from "../components/onboarding/SelfPerceptionStep";
import { QuestResponsesStep } from "../components/onboarding/QuestResponsesStep";
import {
  useGetProfileQuery,
  useUpdateProfileStepMutation,
  useSkipProfileStepMutation,
} from "../api/profileApi";

const steps = [
  {
    id: "mood",
    title: "Your Emotional State",
    description: "Help us understand your current emotional landscape",
  },
  {
    id: "personalityTraits",
    title: "Personality Profile",
    description: "Share your personality type and traits",
  },
  {
    id: "emotionalNeeds",
    title: "Emotional Needs",
    description: "Tell us about your emotional needs and support preferences",
  },
  {
    id: "selfPerception",
    title: "Self-Perception",
    description: "Reflect on your strengths, areas for growth, and values",
  },
  {
    id: "questResponses",
    title: "Your Journey",
    description: "Share your experiences and aspirations",
  },
];

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const { data: profileData, isLoading: isLoadingProfile } =
    useGetProfileQuery();
  const [updateStep, { isLoading: isUpdating }] =
    useUpdateProfileStepMutation();
  const [skipStep, { isLoading: isSkipping }] = useSkipProfileStepMutation();

  const handleNext = async (stepData: any) => {
    try {
      await updateStep({
        step: steps[currentStep].id,
        data: stepData,
      }).unwrap();

      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        // Onboarding complete, redirect to dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Failed to update step:", error);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = async () => {
    try {
      await skipStep(steps[currentStep].id).unwrap();

      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        // Onboarding complete, redirect to dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Failed to skip step:", error);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  const currentStepData =
    profileData?.data?.[steps[currentStep].id as keyof typeof profileData.data];

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <MoodStep
            initialData={currentStepData as any}
            onSubmit={handleNext}
            isLoading={isUpdating}
          />
        );
      case 1:
        return (
          <PersonalityStep
            initialData={currentStepData as any}
            onSubmit={handleNext}
            isLoading={isUpdating}
          />
        );
      case 2:
        return (
          <EmotionalNeedsStep
            initialData={currentStepData as any}
            onSubmit={handleNext}
            isLoading={isUpdating}
          />
        );
      case 3:
        return (
          <SelfPerceptionStep
            initialData={currentStepData as any}
            onSubmit={handleNext}
            isLoading={isUpdating}
          />
        );
      case 4:
        return (
          <QuestResponsesStep
            initialData={currentStepData as any}
            onSubmit={handleNext}
            isLoading={isUpdating}
          />
        );
      default:
        return null;
    }
  };

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={steps.length}
      title={steps[currentStep].title}
      description={steps[currentStep].description}
      onBack={currentStep > 0 ? handleBack : undefined}
      onSkip={handleSkip}
      isLoading={isUpdating || isSkipping}
    >
      {renderStep()}
    </OnboardingLayout>
  );
};
