import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient, generateUserId } from '@/lib/api';
import type { OnboardingState, OnboardingStep } from '@/types';

interface UserState {
  userId: string | null;
  isInitialized: boolean;
  onboarding: OnboardingState;

  // Actions
  initializeUser: () => void;
  setUserId: (id: string) => void;
  clearUser: () => void;
  completeOnboardingStep: (step: OnboardingStep) => void;
  resetOnboarding: () => void;
}

const initialOnboarding: OnboardingState = {
  currentStep: 'welcome',
  completedSteps: [],
  isComplete: false,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userId: null,
      isInitialized: false,
      onboarding: initialOnboarding,

      initializeUser: () => {
        let { userId } = get();

        if (!userId) {
          userId = generateUserId();
        }

        apiClient.setUserId(userId);
        set({ userId, isInitialized: true });
      },

      setUserId: (id: string) => {
        apiClient.setUserId(id);
        set({ userId: id, isInitialized: true });
      },

      clearUser: () => {
        apiClient.clearUserId();
        set({
          userId: null,
          isInitialized: false,
          onboarding: initialOnboarding,
        });
      },

      completeOnboardingStep: (step: OnboardingStep) => {
        const { onboarding } = get();
        const completedSteps = [...onboarding.completedSteps, step];

        const stepOrder: OnboardingStep[] = ['welcome', 'first-thought', 'values', 'complete'];
        const currentIndex = stepOrder.indexOf(step);
        const nextStep = stepOrder[currentIndex + 1] || 'complete';
        const isComplete = nextStep === 'complete' || step === 'complete';

        set({
          onboarding: {
            currentStep: nextStep,
            completedSteps,
            isComplete,
          },
        });
      },

      resetOnboarding: () => {
        set({ onboarding: initialOnboarding });
      },
    }),
    {
      name: 'pros-user',
      partialize: (state) => ({
        userId: state.userId,
        onboarding: state.onboarding,
      }),
    }
  )
);
