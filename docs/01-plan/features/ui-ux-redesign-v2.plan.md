# PDCA Plan: Aletheia UI/UX Redesign v2.0

> PDCA Phase: Plan
> Created: 2026-02-01
> Feature: ui-ux-redesign-v2
> Status: IN_PROGRESS

---

## 1. Overview

### 1.1 Feature Description
Aletheia 프론트엔드의 UI/UX를 최신 2026 디자인 트렌드에 맞게 전면 개선합니다.
이전 v1.0 리디자인의 성과를 기반으로, 더욱 고객 친화적이고 세련된 경험을 제공합니다.

### 1.2 Core Concept: "Aletheia - Truth Revealed"
- **그리스어 의미**: "진실, 숨김없음, 드러남"
- **디자인 철학**: 밝고 투명하며, 깨끗하고 명확한 인터페이스
- **사용자 경험**: 복잡한 의사결정을 명확하게 시각화

### 1.3 Design Direction (Multi-style Fusion)
| Style | 적용 영역 | 특징 |
|-------|----------|------|
| **Minimal & Clean** | 전체 레이아웃 | 여백, 계층 구조, 콘텐츠 중심 |
| **Glassmorphism** | 카드, 모달, 오버레이 | 반투명, backdrop-blur, 깊이감 |
| **Soft Neumorphism** | 버튼, 입력 필드 (선택적) | 미묘한 inner shadow, 촉감 |
| **Dark Mode First** | 기본 테마 | 눈의 피로 감소, 배터리 절약, 집중도 향상 |

---

## 2. Problem Statement

### 2.1 Current State (v1.0 완료 상태)
- 기본적인 Aletheia 브랜드 아이덴티티 적용됨
- Indigo/Violet/Amber 컬러 팔레트 사용 중
- Framer Motion 애니메이션 시스템 구축됨
- 반응형 레이아웃 기본 구현

### 2.2 Identified Gaps (이전 보고서 + 신규 분석)

#### A. 디자인 시스템 개선 필요
| 항목 | 현재 상태 | 개선 방향 |
|------|----------|----------|
| Color Palette | Indigo 단일 중심 | Truth-inspired 팔레트 (Crystal Blue/Ethereal Silver) |
| Typography | 기본 설정 | Fluid typography 강화, 한글 최적화 |
| Dark Mode | 지원하나 기본 아님 | Dark Mode First 전환 |
| Glassmorphism | 기본 `.glass` 유틸리티 | 다층 Glass 효과, 컨텍스트별 블러 강도 |

#### B. 컴포넌트 UX 개선 필요
| 컴포넌트 | 현재 상태 | 개선 방향 |
|----------|----------|----------|
| Input | filled/default 2종 | Floating label, 포커스 애니메이션 강화 |
| Card | 4 variants | Bento Grid 스타일, hover parallax 효과 |
| Button | gradient primary | Glass button variant, 3D press 효과 |
| Navigation | 기본 responsive | Scroll-aware header, 스크롤 진행률 표시 |
| Empty State | 기본 구현 | Illustrated empty states, 애니메이션 |

#### C. 페이지별 UX 개선
| 페이지 | 현재 상태 | 개선 방향 |
|--------|----------|----------|
| Dashboard | 2-column grid | Bento Grid (다양한 크기 카드 조합) |
| Values | 기본 Radar Chart | Interactive radar, 드래그 탐색 |
| Decisions | 카드 리스트 | Timeline view 옵션, 확률 시각화 개선 |
| Fragments | 탭 기반 | 무한 스크롤, 감정 히트맵 |
| Onboarding | 단계별 폼 | Progress 애니메이션, 멀티스텝 마법사 |

---

## 3. Goals & Success Criteria

### 3.1 Primary Goals
1. **Theme System** - Light / Dark / System 3가지 모드 지원
2. **Dark Mode First** - 어두운 테마를 기본으로 설정
3. **Glassmorphism 2.0** - Apple Liquid Glass 스타일 적용
4. **Micro-interactions** - 모든 인터랙티브 요소에 피드백 애니메이션
5. **Bento Grid Dashboard** - 모던한 대시보드 레이아웃
6. **Floating Labels** - 입력 필드 UX 개선

### 3.2 Success Metrics
| Metric | Target |
|--------|--------|
| Gap Analysis Match Rate | >= 90% |
| Lighthouse Performance | >= 90 |
| Lighthouse Accessibility | >= 95 |
| First Contentful Paint | < 1.5s |
| Design Consistency Score | >= 95% |

### 3.3 Scope Definition

#### IN SCOPE
- [ ] **Theme System** (Light / Dark / System 모드 스위칭)
- [ ] Design Token System 2.0 (colors, typography, spacing)
- [ ] Dark Mode First 전환 (기본값 dark)
- [ ] Glassmorphism 컴포넌트 강화
- [ ] Dashboard Bento Grid 레이아웃
- [ ] Input Floating Label 구현
- [ ] 페이지 전환 애니메이션 개선
- [ ] Empty State 일러스트레이션
- [ ] Scroll-aware Header

#### OUT OF SCOPE
- 백엔드 API 변경
- 새로운 기능 추가 (순수 UI/UX 개선만)
- 3rd party 디자인 시스템 도입 (자체 구현 유지)

---

## 4. Design Reference & Inspiration

### 4.1 2026 UI/UX 트렌드 반영 사항

#### Glassmorphism (Source: [Design Studio UIX](https://www.designstudiouiux.com/blog/what-is-glassmorphism-ui-trend/))
> "Perfect for financial apps, SaaS, and corporate vibes where trust and cleanliness matter."
- 반투명 배경 + backdrop-blur
- 미묘한 보더와 그림자로 깊이감
- 중요한 요소 하이라이트에 전략적 사용

#### Minimalism with Personality (Source: [Pixelmatters](https://www.pixelmatters.com/insights/8-ui-design-trends-2025))
> "Gone are the days when minimalism meant sterile white spaces."
- 비대칭 레이아웃
- 전략적 컬러 포인트
- Playful micro-interactions

#### Dark Mode Evolution (Source: [DaydreamSoft](https://daydreamsoft.com/blog/ui-ux-trends-dark-mode-high-contrast-and-glass-neo-morphisms))
> "Dark Mode has evolved beyond a visual preference—it's now a default feature."
- 눈의 피로 감소
- OLED 배터리 절약
- 데이터 집중 인터페이스에 최적

### 4.2 참고 앱/사이트
| Reference | 적용 요소 |
|-----------|----------|
| **Linear** | 클린한 레이아웃, 키보드 중심 UX |
| **Stripe Dashboard** | Glass 카드, 그라데이션, 데이터 시각화 |
| **Vercel** | Dark mode, 미니멀 nav, 코드 블록 스타일 |
| **Notion** | 여백 활용, 블록 기반 콘텐츠 |
| **Apple Liquid Glass** | 2025 신규 Glassmorphism 스타일 |

---

## 5. Technical Approach

### 5.1 Design Token System 2.0

#### Color Palette Evolution
```
기존 (v1.0)              신규 (v2.0)
─────────────────       ─────────────────
primary: indigo         primary: crystal-blue (진실/명확함)
secondary: violet  -->  secondary: ethereal-violet (통찰)
accent: amber           accent: truth-gold (계시/발견)
                        glass: rgba layers (깊이)
                        surface: neutral-900/950 (Dark first)
```

#### Typography Scale
```css
/* Fluid Typography */
--text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
--text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
--text-lg: clamp(1.125rem, 1rem + 0.5vw, 1.375rem);
/* ... */
```

### 5.2 Theme System (Light / Dark / System)

#### Theme Modes
| Mode | 설명 | 동작 |
|------|------|------|
| **Light** | 밝은 테마 | 항상 라이트 모드 적용 |
| **Dark** | 어두운 테마 (기본값) | 항상 다크 모드 적용 |
| **System** | 시스템 설정 따름 | OS의 `prefers-color-scheme` 감지하여 자동 전환 |

#### Implementation Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                      ThemeProvider                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Context: { theme, setTheme, resolvedTheme }        │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│           ┌───────────────┼───────────────┐                │
│           ▼               ▼               ▼                │
│      'light'          'dark'         'system'              │
│           │               │               │                │
│           │               │       ┌───────┴───────┐        │
│           │               │       ▼               ▼        │
│           │               │   OS Light        OS Dark      │
│           │               │       │               │        │
│           └───────────────┴───────┴───────────────┘        │
│                           │                                 │
│                    <html class="dark">                     │
│                    or <html class="">                      │
└─────────────────────────────────────────────────────────────┘
```

#### Key Components
```tsx
// 1. ThemeProvider (Context + 로직)
<ThemeProvider
  defaultTheme="dark"           // 기본값: dark
  storageKey="aletheia-theme"   // localStorage 키
>
  <App />
</ThemeProvider>

// 2. ThemeToggle (UI 컴포넌트)
<ThemeToggle />
// - 3가지 옵션: Light (Sun) / Dark (Moon) / System (Monitor)
// - Dropdown 또는 Segmented Control 형태
// - 설정 페이지 또는 Header에 배치

// 3. useTheme Hook
const { theme, setTheme, resolvedTheme } = useTheme();
// theme: 'light' | 'dark' | 'system' (사용자 선택값)
// resolvedTheme: 'light' | 'dark' (실제 적용되는 테마)
```

#### Storage & Persistence
```typescript
// localStorage에 테마 설정 저장
localStorage.setItem('aletheia-theme', 'dark');

// 페이지 로드 시 우선순위
1. localStorage 저장값
2. 없으면 기본값 'dark' 적용
```

#### System Theme Detection
```typescript
// prefers-color-scheme 미디어 쿼리 감지
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

// 실시간 변경 감지
mediaQuery.addEventListener('change', (e) => {
  if (theme === 'system') {
    applyTheme(e.matches ? 'dark' : 'light');
  }
});
```

#### Transition Animation
```css
/* 테마 전환 시 부드러운 애니메이션 */
html {
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* 또는 View Transitions API (Progressive Enhancement) */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.3s;
}
```

### 5.3 Component Enhancement Plan

#### A. Glass System
```tsx
// Glass variants
<Card variant="glass-subtle">    // 가벼운 blur
<Card variant="glass-medium">    // 중간 blur (default)
<Card variant="glass-strong">    // 강한 blur (모달용)
```

#### B. Floating Input
```tsx
// Before
<Input label="이름" placeholder="이름을 입력하세요" />

// After
<Input variant="floating" label="이름" />
// Label이 placeholder 위치에서 시작, 포커스 시 위로 이동
```

#### C. Bento Grid
```tsx
// Dashboard layout
<BentoGrid>
  <BentoCard span="wide">Quick Capture</BentoCard>
  <BentoCard span="tall">Value Radar</BentoCard>
  <BentoCard>Recent Fragments</BentoCard>
  <BentoCard>Pending Decisions</BentoCard>
</BentoGrid>
```

### 5.3 Animation Strategy
| Element | Animation | Duration |
|---------|-----------|----------|
| Page transition | Fade + slide up | 300ms |
| Card hover | Y translate + shadow | 200ms |
| Button press | Scale 0.97 + brightness | 100ms |
| Input focus | Border glow + label float | 200ms |
| Modal enter | Scale + backdrop blur | 300ms (spring) |
| List items | Stagger fade in | 50ms delay each |

---

## 6. Implementation Order

### Phase 1: Foundation (Theme System + Design Tokens)
1. `ThemeProvider.tsx` - Theme Context 및 로직 구현
2. `useTheme.ts` - Theme Hook 구현
3. `ThemeToggle.tsx` - 테마 스위칭 UI 컴포넌트
4. `tailwind.config.ts` 컬러 팔레트 확장
5. `globals.css` CSS 변수 (Light/Dark 모두 최적화)
6. Glass utility classes 강화

### Phase 2: Core Components
7. `Button.tsx` - Glass variant, 3D press 효과
8. `Input.tsx` - Floating label 구현
9. `Card.tsx` - Glass variants 추가, hover parallax
10. `Modal.tsx` - Glass backdrop 강화

### Phase 3: Layout & Navigation
8. `Header.tsx` - Scroll-aware, 진행률 표시
9. `MainLayout.tsx` - 페이지 전환 개선
10. `BentoGrid.tsx` - 신규 레이아웃 컴포넌트

### Phase 4: Pages
11. `Dashboard` - Bento Grid 적용
12. `Fragments` - 감정 히트맵, 무한 스크롤
13. `Decisions` - Timeline view
14. `Values` - Interactive radar 개선
15. `Onboarding` - Progress 애니메이션

### Phase 5: Polish
16. Empty states 일러스트레이션
17. Loading states 개선
18. 접근성 검증 및 개선

---

## 7. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| 성능 저하 (blur 과다) | Medium | High | GPU 가속 활용, will-change 최적화 |
| 접근성 문제 (대비) | Low | High | WCAG 2.1 AA 기준 준수, 고대비 모드 |
| 브라우저 호환성 | Low | Medium | backdrop-filter fallback 준비 |
| 기존 코드 충돌 | Medium | Medium | 점진적 마이그레이션, 기존 variant 유지 |

---

## 8. Dependencies

### External
- Tailwind CSS 3.4+ (현재 사용 중)
- Framer Motion 10+ (현재 사용 중)
- Lucide React (현재 사용 중)
- **next-themes** (신규) - Next.js 테마 관리 라이브러리
  - SSR 지원, flash 방지
  - System theme 감지
  - localStorage 자동 관리

### Internal
- 기존 컴포넌트 호환성 유지 필요
- 기존 페이지 점진적 마이그레이션

---

## 9. Timeline Estimate

| Phase | Tasks |
|-------|-------|
| Phase 1 | Design Tokens 2.0 |
| Phase 2 | Core Components (4개) |
| Phase 3 | Layout & Navigation (3개) |
| Phase 4 | Pages (5개) |
| Phase 5 | Polish & QA |

---

## 10. Acceptance Criteria

### Must Have
- [ ] **Theme System 동작** (Light / Dark / System 3가지 모드)
- [ ] **테마 설정 localStorage 저장** 및 페이지 새로고침 시 유지
- [ ] **System 모드에서 OS 테마 변경 시 자동 반영**
- [ ] Dark Mode가 기본 테마로 설정됨
- [ ] 모든 카드 컴포넌트가 Glassmorphism 적용됨
- [ ] Dashboard가 Bento Grid 레이아웃 사용
- [ ] Input 컴포넌트에 Floating label 옵션 추가
- [ ] 빌드 오류 없음
- [ ] Gap Analysis >= 90%

### Should Have
- [ ] **ThemeToggle을 Header와 Settings 페이지에 배치**
- [ ] **테마 전환 시 부드러운 transition 애니메이션**
- [ ] Scroll-aware Header
- [ ] Empty state 일러스트레이션
- [ ] Loading skeleton 개선
- [ ] 페이지 전환 애니메이션 개선

### Nice to Have
- [ ] Interactive Value Radar (드래그)
- [ ] Fragments 감정 히트맵
- [ ] 키보드 네비게이션 강화

---

## 11. References

### Design Trends 2026
- [Bookmarkify - UI Design Trends 2026](https://www.bookmarkify.io/blog/inspiration-ui-design)
- [Tenet - 15 UI/UX Design Trends](https://www.wearetenet.com/blog/ui-ux-design-trends)
- [Design Studio UIX - Glassmorphism](https://www.designstudiouiux.com/blog/what-is-glassmorphism-ui-trend/)
- [DaydreamSoft - Dark Mode & Glass](https://daydreamsoft.com/blog/ui-ux-trends-dark-mode-high-contrast-and-glass-neo-morphisms)
- [Muzli - Dashboard Inspirations 2026](https://muz.li/blog/best-dashboard-design-examples-inspirations-for-2026/)

### Minimalist UI
- [Medium - Why Minimalist UI is Winning](https://medium.com/@design.sphere/why-minimalist-ui-is-winning-in-2025-a-guide-for-decision-makers-7924059efa2a)
- [Pixelmatters - UI Design Trends 2025](https://www.pixelmatters.com/insights/8-ui-design-trends-2025)

---

## 12. Sign-off

| Role | Name | Date | Status |
|------|------|------|--------|
| Requester | User | 2026-02-01 | REQUESTED |
| Planner | Claude | 2026-02-01 | DRAFTED |
| Reviewer | - | - | PENDING |

---

**Next Step**: `/pdca design ui-ux-redesign-v2`로 상세 설계 문서 작성
