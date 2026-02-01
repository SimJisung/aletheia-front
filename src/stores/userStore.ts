import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient, authApi } from '@/lib/api';
import type { OnboardingState, OnboardingStep, User, AuthResponse } from '@/types';

interface UserState {
  // 인증 상태
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;

  // 온보딩 상태
  onboarding: OnboardingState;

  // Actions - 인증
  initializeAuth: () => Promise<void>;
  login: (response: AuthResponse) => void;
  logout: () => void;

  // Actions - 온보딩
  completeOnboardingStep: (step: OnboardingStep) => void;
  resetOnboarding: () => void;

  // Legacy - 기존 코드 호환
  userId: string | null;
  initializeUser: () => void;
  setUserId: (id: string) => void;
  clearUser: () => void;
}

const initialOnboarding: OnboardingState = {
  currentStep: 'welcome',
  completedSteps: [],
  isComplete: false,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // 인증 상태 초기값
      user: null,
      token: null,
      isAuthenticated: false,
      isInitialized: false,
      onboarding: initialOnboarding,

      // Legacy
      userId: null,

      /**
       * 앱 시작 시 인증 상태 초기화
       * - 서버에 토큰 유효성 검증
       * - 만료된 토큰은 자동 로그아웃
       * - 네트워크 에러 시 기존 상태 유지 (오프라인 모드)
       */
      initializeAuth: async () => {
        const token = apiClient.getToken();
        const { user } = get();

        if (!token) {
          // 토큰이 없으면 비인증 상태
          set({
            isAuthenticated: false,
            isInitialized: true,
          });
          return;
        }

        if (!user) {
          // 토큰만 있고 사용자 정보가 없으면 토큰 삭제
          apiClient.clearToken();
          set({
            token: null,
            isAuthenticated: false,
            isInitialized: true,
          });
          return;
        }

        // 서버에서 토큰 유효성 검증
        try {
          const verifiedUser = await authApi.me();
          // 토큰이 유효하면 서버에서 받은 최신 사용자 정보로 업데이트
          apiClient.setUserId(verifiedUser.id);
          set({
            user: verifiedUser,
            isAuthenticated: true,
            isInitialized: true,
            userId: verifiedUser.id,
          });
        } catch (error) {
          // 401/403 에러는 토큰 만료/무효 → 로그아웃
          if (error instanceof Error && 'status' in error) {
            const status = (error as { status: number }).status;
            if (status === 401 || status === 403) {
              console.warn('Token expired or invalid, logging out');
              apiClient.clearToken();
              apiClient.clearUserId();
              set({
                user: null,
                token: null,
                userId: null,
                isAuthenticated: false,
                isInitialized: true,
              });
              return;
            }
          }
          // 네트워크 에러 등은 기존 상태 유지 (오프라인 모드)
          console.warn('Failed to verify token, using cached state:', error);
          apiClient.setUserId(user.id);
          set({
            isAuthenticated: true,
            isInitialized: true,
            userId: user.id,
          });
        }
      },

      /**
       * 로그인 성공 시 호출
       */
      login: (response: AuthResponse) => {
        apiClient.setToken(response.token);
        apiClient.setUserId(response.user.id);
        set({
          user: response.user,
          token: response.token,
          userId: response.user.id,
          isAuthenticated: true,
          isInitialized: true,
        });
      },

      /**
       * 로그아웃
       */
      logout: () => {
        apiClient.clearToken();
        apiClient.clearUserId();
        set({
          user: null,
          token: null,
          userId: null,
          isAuthenticated: false,
          onboarding: initialOnboarding,
        });
      },

      /**
       * 온보딩 단계 완료
       */
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

      /**
       * 온보딩 초기화
       */
      resetOnboarding: () => {
        set({ onboarding: initialOnboarding });
      },

      // ============ Legacy Methods (기존 코드 호환) ============

      initializeUser: () => {
        // 새 인증 시스템으로 위임
        get().initializeAuth();
      },

      setUserId: (id: string) => {
        apiClient.setUserId(id);
        set({ userId: id, isInitialized: true });
      },

      clearUser: () => {
        get().logout();
      },
    }),
    {
      name: 'pros-user',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        userId: state.userId,
        onboarding: state.onboarding,
      }),
    }
  )
);

/**
 * 탭 간 인증 동기화
 * 다른 탭에서 로그아웃 시 현재 탭도 자동 로그아웃
 */
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'pros-user') {
      if (event.newValue === null) {
        // localStorage가 삭제됨 (로그아웃)
        useUserStore.getState().logout();
      } else {
        try {
          const newState = JSON.parse(event.newValue);
          const currentState = useUserStore.getState();

          // 다른 탭에서 로그아웃한 경우 (토큰이 null로 변경)
          if (newState.state?.token === null && currentState.token !== null) {
            useUserStore.getState().logout();
          }
          // 다른 탭에서 로그인한 경우 (토큰이 생성됨)
          else if (newState.state?.token && newState.state?.user && !currentState.token) {
            useUserStore.setState({
              user: newState.state.user,
              token: newState.state.token,
              userId: newState.state.userId,
              isAuthenticated: true,
              onboarding: newState.state.onboarding || currentState.onboarding,
            });
            apiClient.setToken(newState.state.token);
            apiClient.setUserId(newState.state.user.id);
          }
        } catch (e) {
          console.error('Failed to parse storage event:', e);
        }
      }
    }
  });
}
