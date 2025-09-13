import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../components/onboarding/OnboardingLayout";
import { PersonalityStep } from "../components/onboarding/PersonalityStep";
import {
  useGetProfileQuery,
  useUpdateProfileStepMutation,
} from "../api/profileApi";

export const PersonalityEditPage = () => {
  const navigate = useNavigate();
  const { data: profileData, isLoading: isLoadingProfile } =
    useGetProfileQuery();
  const [updateStep, { isLoading: isUpdating }] =
    useUpdateProfileStepMutation();

  const handleSubmit = async (stepData: any) => {
    try {
      await updateStep({
        step: "personalityTraits",
        data: stepData,
      }).unwrap();

      // Return to personality profile page after successful update
      navigate("/personality");
    } catch (error) {
      console.error("Failed to update personality profile:", error);
    }
  };

  const handleBack = () => {
    navigate("/personality");
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  const currentStepData = profileData?.data?.personalityTraits;

  return (
    <OnboardingLayout
      currentStep={1}
      totalSteps={1}
      title="Edit Personality Profile"
      description="Update your personality type and traits"
      onBack={handleBack}
      isLoading={isUpdating}
    >
      <PersonalityStep
        initialData={currentStepData as any}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </OnboardingLayout>
  );
};
