# PDCA Design: Aletheia UI/UX Redesign v2.0

> PDCA Phase: Design
> Created: 2026-02-01
> Feature: ui-ux-redesign-v2
> Plan Reference: `docs/01-plan/features/ui-ux-redesign-v2.plan.md`

---

## 1. Design Overview

### 1.1 Design Philosophy
**"Aletheia - Truth Revealed Through Clarity"**

- **투명함**: Glassmorphism으로 레이어 간 시각적 연결
- **명확함**: 콘텐츠 중심의 미니멀 레이아웃
- **일관성**: 통합된 디자인 토큰 시스템
- **적응성**: Light/Dark/System 테마 자동 전환

### 1.2 Core Design Principles
1. **Dark Mode First** - 기본값은 Dark, Light도 동등하게 지원
2. **Glass as Depth** - 반투명으로 계층 구조 표현
3. **Motion with Purpose** - 의미 있는 애니메이션만 사용
4. **Accessible by Default** - WCAG 2.1 AA 기준 준수

---

## 2. Design Token System v2.0

### 2.1 Color Palette

#### Primary - Crystal Blue (진실/명확함)
```typescript
// tailwind.config.ts
primary: {
  50:  '#eff6ff',  // bg-primary-50
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',  // Main
  600: '#2563eb',
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',
  950: '#172554',
}
```

#### Secondary - Ethereal Violet (통찰/직관)
```typescript
secondary: {
  50:  '#faf5ff',
  100: '#f3e8ff',
  200: '#e9d5ff',
  300: '#d8b4fe',
  400: '#c084fc',
  500: '#a855f7',  // Main
  600: '#9333ea',
  700: '#7e22ce',
  800: '#6b21a8',
  900: '#581c87',
  950: '#3b0764',
}
```

#### Accent - Truth Gold (발견/계시)
```typescript
accent: {
  50:  '#fffbeb',
  100: '#fef3c7',
  200: '#fde68a',
  300: '#fcd34d',
  400: '#fbbf24',
  500: '#f59e0b',  // Main
  600: '#d97706',
  700: '#b45309',
  800: '#92400e',
  900: '#78350f',
  950: '#451a03',
}
```

#### Glass Colors (신규)
```typescript
glass: {
  // Light mode
  light: {
    subtle: 'rgba(255, 255, 255, 0.6)',
    medium: 'rgba(255, 255, 255, 0.75)',
    strong: 'rgba(255, 255, 255, 0.9)',
  },
  // Dark mode
  dark: {
    subtle: 'rgba(15, 23, 42, 0.6)',
    medium: 'rgba(15, 23, 42, 0.75)',
    strong: 'rgba(15, 23, 42, 0.9)',
  },
}
```

### 2.2 Semantic Colors (CSS Variables)

```css
/* globals.css */

/* ============================================
   LIGHT MODE (기본)
   ============================================ */
:root {
  /* Backgrounds */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8fafc;
  --color-bg-tertiary: #f1f5f9;
  --color-bg-elevated: #ffffff;

  /* Glass backgrounds */
  --color-glass-subtle: rgba(255, 255, 255, 0.6);
  --color-glass-medium: rgba(255, 255, 255, 0.75);
  --color-glass-strong: rgba(255, 255, 255, 0.9);
  --color-glass-border: rgba(255, 255, 255, 0.2);

  /* Text */
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-muted: #64748b;
  --color-text-disabled: #94a3b8;

  /* Borders */
  --color-border: #e2e8f0;
  --color-border-subtle: #f1f5f9;
  --color-border-focus: #3b82f6;

  /* Interactive */
  --color-hover: rgba(0, 0, 0, 0.04);
  --color-active: rgba(0, 0, 0, 0.08);
}

/* ============================================
   DARK MODE
   ============================================ */
.dark {
  /* Backgrounds */
  --color-bg-primary: #030712;
  --color-bg-secondary: #0f172a;
  --color-bg-tertiary: #1e293b;
  --color-bg-elevated: #1e293b;

  /* Glass backgrounds */
  --color-glass-subtle: rgba(15, 23, 42, 0.6);
  --color-glass-medium: rgba(15, 23, 42, 0.75);
  --color-glass-strong: rgba(15, 23, 42, 0.9);
  --color-glass-border: rgba(255, 255, 255, 0.1);

  /* Text */
  --color-text-primary: #f8fafc;
  --color-text-secondary: #cbd5e1;
  --color-text-muted: #94a3b8;
  --color-text-disabled: #64748b;

  /* Borders */
  --color-border: #334155;
  --color-border-subtle: #1e293b;
  --color-border-focus: #3b82f6;

  /* Interactive */
  --color-hover: rgba(255, 255, 255, 0.04);
  --color-active: rgba(255, 255, 255, 0.08);
}
```

### 2.3 Typography Scale

```css
/* Fluid Typography - 뷰포트에 따라 자동 조절 */
:root {
  --text-xs: clamp(0.75rem, 0.7rem + 0.1vw, 0.8rem);
  --text-sm: clamp(0.8125rem, 0.775rem + 0.15vw, 0.875rem);
  --text-base: clamp(0.875rem, 0.825rem + 0.2vw, 1rem);
  --text-lg: clamp(1rem, 0.925rem + 0.3vw, 1.125rem);
  --text-xl: clamp(1.125rem, 1rem + 0.5vw, 1.25rem);
  --text-2xl: clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem);
  --text-3xl: clamp(1.5rem, 1.3rem + 0.8vw, 1.875rem);
  --text-4xl: clamp(1.875rem, 1.5rem + 1.5vw, 2.5rem);
  --text-5xl: clamp(2.5rem, 2rem + 2vw, 3.5rem);
}
```

### 2.4 Spacing Scale

```typescript
// 기존 Tailwind 스케일 유지 + 추가
spacing: {
  '4.5': '1.125rem',  // 18px
  '13': '3.25rem',    // 52px
  '15': '3.75rem',    // 60px
  '18': '4.5rem',     // 72px
  '22': '5.5rem',     // 88px
}
```

### 2.5 Shadow System

```typescript
boxShadow: {
  // 기존 elevation 유지
  'elevation-xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  'elevation-sm': '0 1px 2px 0 rgb(0 0 0 / 0.03), 0 1px 3px 0 rgb(0 0 0 / 0.06)',
  'elevation-md': '0 2px 4px -1px rgb(0 0 0 / 0.04), 0 4px 6px -1px rgb(0 0 0 / 0.08)',
  'elevation-lg': '0 4px 6px -2px rgb(0 0 0 / 0.03), 0 10px 15px -3px rgb(0 0 0 / 0.08)',
  'elevation-xl': '0 8px 10px -3px rgb(0 0 0 / 0.04), 0 20px 25px -5px rgb(0 0 0 / 0.08)',
  'elevation-2xl': '0 12px 20px -5px rgb(0 0 0 / 0.05), 0 25px 50px -12px rgb(0 0 0 / 0.15)',

  // Glass shadows (신규)
  'glass-sm': '0 2px 8px -2px rgb(0 0 0 / 0.1), inset 0 1px 0 0 rgb(255 255 255 / 0.1)',
  'glass-md': '0 4px 16px -4px rgb(0 0 0 / 0.15), inset 0 1px 0 0 rgb(255 255 255 / 0.1)',
  'glass-lg': '0 8px 32px -8px rgb(0 0 0 / 0.2), inset 0 1px 0 0 rgb(255 255 255 / 0.1)',

  // Glow effects
  'glow-primary': '0 0 20px rgb(59 130 246 / 0.4)',
  'glow-accent': '0 0 20px rgb(251 191 36 / 0.4)',
  'glow-success': '0 0 20px rgb(16 185 129 / 0.4)',
}
```

---

## 3. Theme System Specification

### 3.1 Dependencies
```bash
npm install next-themes
```

### 3.2 ThemeProvider Component

**File**: `src/components/providers/ThemeProvider.tsx`

```tsx
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange={false}
      storageKey="aletheia-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
```

### 3.3 Root Layout Integration

**File**: `src/app/layout.tsx`

```tsx
import { ThemeProvider } from '@/components/providers/ThemeProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 3.4 ThemeToggle Component

**File**: `src/components/ui/ThemeToggle.tsx`

```tsx
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeOption {
  value: Theme;
  icon: React.ReactNode;
  label: string;
}

const themeOptions: ThemeOption[] = [
  { value: 'light', icon: <Sun size={16} />, label: 'Light' },
  { value: 'dark', icon: <Moon size={16} />, label: 'Dark' },
  { value: 'system', icon: <Monitor size={16} />, label: 'System' },
];

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[132px] h-9" />; // Skeleton placeholder
  }

  return (
    <div className="flex items-center p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800/50">
      {themeOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => setTheme(option.value)}
          className={`
            relative flex items-center justify-center gap-1.5 px-3 py-1.5
            rounded-lg text-sm font-medium transition-colors
            ${theme === option.value
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }
          `}
          aria-label={`Switch to ${option.label} theme`}
        >
          {theme === option.value && (
            <motion.div
              layoutId="theme-indicator"
              className="absolute inset-0 bg-white dark:bg-neutral-700 rounded-lg shadow-sm"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{option.icon}</span>
          <span className="relative z-10 hidden sm:inline">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
```

### 3.5 Theme Transition CSS

```css
/* globals.css */

/* 테마 전환 애니메이션 */
html {
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* 초기 로드 시 깜빡임 방지 */
html.transitioning * {
  transition: none !important;
}
```

---

## 4. Component Specifications

### 4.1 Card Component Enhancement

**File**: `src/components/ui/Card.tsx`

#### Variants
| Variant | Use Case | Visual |
|---------|----------|--------|
| `default` | 일반 카드 | 흰색 배경, 미묘한 border |
| `elevated` | 강조 카드 | 그림자 추가 |
| `glass` | 오버레이 카드 | 반투명 + blur |
| `glass-subtle` | 가벼운 glass | blur 약함 (8px) |
| `glass-strong` | 강한 glass | blur 강함 (24px) |
| `interactive` | 클릭 가능한 카드 | hover 효과 |

#### Props Interface
```typescript
interface CardProps {
  variant?: 'default' | 'elevated' | 'glass' | 'glass-subtle' | 'glass-strong' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  className?: string;
  children: React.ReactNode;
}
```

#### Glass Variant CSS
```css
/* Glass variants */
.card-glass {
  background: var(--color-glass-medium);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--color-glass-border);
  box-shadow: var(--shadow-glass-md);
}

.card-glass-subtle {
  background: var(--color-glass-subtle);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--color-glass-border);
  box-shadow: var(--shadow-glass-sm);
}

.card-glass-strong {
  background: var(--color-glass-strong);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--color-glass-border);
  box-shadow: var(--shadow-glass-lg);
}
```

### 4.2 Input Component - Floating Label

**File**: `src/components/ui/Input.tsx`

#### Variants
| Variant | Description |
|---------|-------------|
| `default` | 기존 스타일 (label 위에 고정) |
| `filled` | 채워진 배경 |
| `floating` | 플로팅 라벨 (신규) |

#### Floating Label Behavior
```
[비활성 상태 - 빈 입력]
┌─────────────────────────────┐
│  이름                       │   <- Label이 placeholder 위치
└─────────────────────────────┘

[활성 상태 또는 값이 있을 때]
┌─────────────────────────────┐
│  이름                       │   <- Label이 위로 이동, 크기 축소
│  홍길동                     │
└─────────────────────────────┘
```

#### Implementation
```tsx
interface InputProps {
  variant?: 'default' | 'filled' | 'floating';
  label?: string;
  error?: string;
  hint?: string;
  // ...existing props
}

// Floating label 구현
const FloatingInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const isFloating = isFocused || hasValue;

    return (
      <div className="relative">
        <input
          ref={ref}
          className={cn(
            'peer w-full px-4 pt-6 pb-2 rounded-xl',
            'bg-neutral-50 dark:bg-neutral-900',
            'border border-neutral-200 dark:border-neutral-700',
            'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
            'transition-all duration-200',
            className
          )}
          placeholder=" "
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            setHasValue(e.target.value !== '');
          }}
          {...props}
        />
        <label
          className={cn(
            'absolute left-4 transition-all duration-200 pointer-events-none',
            'text-neutral-500 dark:text-neutral-400',
            isFloating
              ? 'top-2 text-xs text-primary-600 dark:text-primary-400'
              : 'top-1/2 -translate-y-1/2 text-base'
          )}
        >
          {label}
        </label>
      </div>
    );
  }
);
```

### 4.3 Button Component Enhancement

**File**: `src/components/ui/Button.tsx`

#### New Variant: Glass
```typescript
const buttonVariants = {
  // 기존 variants 유지
  primary: '...',
  secondary: '...',
  outline: '...',
  ghost: '...',
  danger: '...',

  // 신규 Glass variant
  glass: cn(
    'bg-white/10 dark:bg-white/5',
    'backdrop-filter backdrop-blur-md',
    'border border-white/20 dark:border-white/10',
    'text-neutral-800 dark:text-neutral-100',
    'hover:bg-white/20 dark:hover:bg-white/10',
    'shadow-glass-sm hover:shadow-glass-md',
  ),
};
```

### 4.4 Modal Component Enhancement

**File**: `src/components/ui/Modal.tsx`

#### Glass Backdrop
```tsx
// Backdrop with stronger blur
<motion.div
  className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
/>

// Modal content with glass effect
<motion.div
  className={cn(
    'relative z-50',
    'bg-white/90 dark:bg-neutral-900/90',
    'backdrop-blur-xl',
    'border border-neutral-200/50 dark:border-neutral-700/50',
    'rounded-2xl shadow-glass-lg',
  )}
  // ...animations
>
```

---

## 5. Layout Specifications

### 5.1 BentoGrid Component (신규)

**File**: `src/components/ui/BentoGrid.tsx`

#### Grid Structure
```
Desktop (lg+):
┌──────────────┬───────┬───────┐
│              │       │       │
│    wide      │ small │ small │
│              │       │       │
├───────┬──────┴───────┼───────┤
│       │              │       │
│ small │    medium    │ tall  │
│       │              │       │
├───────┴──────────────┤       │
│                      │       │
│       wide           │       │
└──────────────────────┴───────┘

Mobile (sm):
┌─────────────────────┐
│        wide         │
├─────────────────────┤
│        small        │
├─────────────────────┤
│        small        │
└─────────────────────┘
```

#### Implementation
```tsx
interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

interface BentoCardProps {
  span?: 'default' | 'wide' | 'tall' | 'large';
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid gap-4',
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
        'auto-rows-[minmax(180px,auto)]',
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoCard({ span = 'default', children, className }: BentoCardProps) {
  const spanClasses = {
    default: '',
    wide: 'sm:col-span-2',
    tall: 'sm:row-span-2',
    large: 'sm:col-span-2 sm:row-span-2',
  };

  return (
    <Card
      variant="glass"
      className={cn(
        spanClasses[span],
        'overflow-hidden',
        className
      )}
    >
      {children}
    </Card>
  );
}
```

### 5.2 Header Enhancement

**File**: `src/components/layout/Header.tsx`

#### Scroll-aware Behavior
```tsx
const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 10);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

// Header classes
<header
  className={cn(
    'fixed top-0 left-0 right-0 z-50',
    'transition-all duration-300',
    scrolled
      ? 'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg shadow-sm'
      : 'bg-transparent'
  )}
>
```

#### ThemeToggle Placement
```tsx
// Desktop: Header 우측
<div className="hidden md:flex items-center gap-4">
  <ThemeToggle />
  <UserMenu />
</div>

// Mobile: Drawer 내부 또는 Settings 페이지
```

---

## 6. Page Specifications

### 6.1 Dashboard Page

**File**: `src/app/(main)/dashboard/page.tsx`

#### Bento Grid Layout
```tsx
<BentoGrid>
  {/* Quick Capture - Wide */}
  <BentoCard span="wide">
    <QuickCaptureForm />
  </BentoCard>

  {/* Value Radar - Tall */}
  <BentoCard span="tall">
    <ValueRadarChart />
  </BentoCard>

  {/* Quick Actions */}
  <BentoCard>
    <QuickActionCard
      icon={<PenLine />}
      title="기록하기"
      gradient="from-primary-500 to-primary-600"
    />
  </BentoCard>

  <BentoCard>
    <QuickActionCard
      icon={<Scale />}
      title="결정하기"
      gradient="from-secondary-500 to-secondary-600"
    />
  </BentoCard>

  {/* Recent Fragments - Wide */}
  <BentoCard span="wide">
    <RecentFragmentsList />
  </BentoCard>

  {/* Pending Decisions */}
  <BentoCard>
    <PendingDecisionsList />
  </BentoCard>
</BentoGrid>
```

### 6.2 Settings Page - Theme Section

**File**: `src/app/(main)/settings/page.tsx`

```tsx
<Card>
  <CardHeader>
    <CardTitle>테마 설정</CardTitle>
    <CardDescription>
      앱의 외관을 설정합니다
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium">테마 모드</p>
        <p className="text-sm text-neutral-500">
          Light, Dark 또는 시스템 설정을 따릅니다
        </p>
      </div>
      <ThemeToggle />
    </div>
  </CardContent>
</Card>
```

---

## 7. Animation Specifications

### 7.1 Theme Transition
```css
/* 테마 전환 시 */
html {
  transition:
    background-color 0.3s ease,
    color 0.2s ease;
}

/* 카드, 버튼 등 UI 요소 */
.card, .btn, .input {
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}
```

### 7.2 Glass Hover Effects
```tsx
// Framer Motion variants
const glassHoverVariants = {
  initial: {
    scale: 1,
    boxShadow: 'var(--shadow-glass-sm)',
  },
  hover: {
    scale: 1.01,
    boxShadow: 'var(--shadow-glass-md)',
    transition: { duration: 0.2 },
  },
};
```

### 7.3 Floating Label Animation
```tsx
// Label transition
const labelVariants = {
  default: {
    top: '50%',
    y: '-50%',
    fontSize: '1rem',
    color: 'var(--color-text-muted)',
  },
  floating: {
    top: '0.5rem',
    y: 0,
    fontSize: '0.75rem',
    color: 'var(--color-primary-500)',
  },
};
```

---

## 8. File Structure

```
src/
├── app/
│   ├── layout.tsx                    # ThemeProvider 추가
│   └── (main)/
│       ├── dashboard/
│       │   └── page.tsx              # Bento Grid 적용
│       └── settings/
│           └── page.tsx              # ThemeToggle 추가
│
├── components/
│   ├── providers/
│   │   └── ThemeProvider.tsx         # 신규
│   │
│   ├── ui/
│   │   ├── Button.tsx                # glass variant 추가
│   │   ├── Card.tsx                  # glass variants 추가
│   │   ├── Input.tsx                 # floating variant 추가
│   │   ├── Modal.tsx                 # glass backdrop 적용
│   │   ├── ThemeToggle.tsx           # 신규
│   │   ├── BentoGrid.tsx             # 신규
│   │   └── index.ts                  # exports 업데이트
│   │
│   └── layout/
│       └── Header.tsx                # scroll-aware, ThemeToggle 추가
│
├── lib/
│   └── motion/
│       └── variants.ts               # glass 애니메이션 추가
│
└── app/
    └── globals.css                   # CSS 변수 업데이트
```

---

## 9. Implementation Checklist

### Phase 1: Foundation
- [ ] `next-themes` 설치
- [ ] `ThemeProvider.tsx` 생성
- [ ] `layout.tsx`에 ThemeProvider 적용
- [ ] `globals.css` CSS 변수 업데이트 (Light/Dark 모두)
- [ ] `tailwind.config.ts` 확장 (glass colors, shadows)
- [ ] `ThemeToggle.tsx` 생성

### Phase 2: Core Components
- [ ] `Card.tsx` - glass variants 추가
- [ ] `Button.tsx` - glass variant 추가
- [ ] `Input.tsx` - floating variant 추가
- [ ] `Modal.tsx` - glass backdrop 적용

### Phase 3: Layout
- [ ] `Header.tsx` - scroll-aware, ThemeToggle 배치
- [ ] `BentoGrid.tsx` 생성

### Phase 4: Pages
- [ ] `Dashboard` - Bento Grid 적용
- [ ] `Settings` - ThemeToggle 섹션 추가

### Phase 5: Polish
- [ ] 테마 전환 애니메이션 테스트
- [ ] 모든 페이지 Light/Dark 모드 확인
- [ ] 접근성 검증 (색상 대비)

---

## 10. Acceptance Criteria Mapping

| Acceptance Criteria | Design Spec Reference |
|---------------------|----------------------|
| Theme System 동작 (Light/Dark/System) | Section 3: Theme System |
| 테마 설정 localStorage 저장 | Section 3.2: storageKey="aletheia-theme" |
| System 모드 OS 테마 자동 반영 | Section 3.2: enableSystem prop |
| Dark Mode 기본값 | Section 3.2: defaultTheme="dark" |
| 카드 Glassmorphism | Section 4.1: Card glass variants |
| Bento Grid Dashboard | Section 5.1, 6.1 |
| Input Floating label | Section 4.2 |
| ThemeToggle Header/Settings 배치 | Section 5.2, 6.2 |
| 테마 전환 transition | Section 7.1 |

---

## 11. Sign-off

| Role | Name | Date | Status |
|------|------|------|--------|
| Designer | Claude | 2026-02-01 | DRAFTED |
| Reviewer | - | - | PENDING |

---

**Next Step**: 구현 시작 또는 `/pdca do ui-ux-redesign-v2`
