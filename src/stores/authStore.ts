import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient, authApi } from '@/lib/api';
import type { User, LoginRequest, RegisterRequest, OnboardingState, OnboardingStep } from '@/types';

interface AuthState {
  // 사용자 정보
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  // 온보딩 상태
  onboarding: OnboardingState;

  // 액션
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
  completeOnboardingStep: (step: OnboardingStep) => void;
  resetOnboarding: () => void;
}

const initialOnboarding: OnboardingState = {
  currentStep: 'welcome',
  completedSteps: [],
  isComplete: false,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      onboarding: initialOnboarding,

      login: async (data: LoginRequest) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login(data);
          apiClient.setToken(response.token);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterRequest) => {
        set({ isLoading: true });
        try {
          const response = await authApi.register(data);
          apiClient.setToken(response.token);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            onboarding: initialOnboarding, // 새 사용자는 온보딩 시작
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        const { token } = get();
        if (token) {
          authApi.logout(token).catch(() => {
            // 서버 로그아웃 실패해도 무시
          });
        }
        apiClient.clearToken();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          onboarding: initialOnboarding,
        });
      },

      initialize: async () => {
        const { token, isInitialized } = get();

        if (isInitialized) return;

        if (token) {
          try {
            apiClient.setToken(token);
            const user = await authApi.getCurrentUser(token);
            set({
              user,
              isAuthenticated: true,
              isInitialized: true,
            });
          } catch {
            // 토큰이 유효하지 않음
            apiClient.clearToken();
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isInitialized: true,
            });
          }
        } else {
          set({ isInitialized: true });
        }

        // 401 에러 시 자동 로그아웃 설정
        apiClient.setOnUnauthorized(() => {
          get().logout();
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
      name: 'pros-auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        onboarding: state.onboarding,
      }),
    }
  )
);
