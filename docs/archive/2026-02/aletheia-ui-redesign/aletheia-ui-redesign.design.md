# Design: Aletheia UI/UX Redesign

> PDCA Phase: Design
> Created: 2026-01-31
> Status: Draft
> Depends on: aletheia-ui-redesign.plan.md

---

## 1. Design System Specification

### 1.1 Brand Identity

#### Logo Design
**Primary Logo:** Geometric "A" mark representing revelation/truth
```
   ▲
  ╱ ╲
 ╱ ● ╲   ← Inner light/eye representing insight
╱─────╲
```

**Logo Variants:**
- Full: Symbol + "aletheia" wordmark
- Compact: Symbol only
- Dark: White on dark backgrounds
- Light: Primary on light backgrounds

#### Wordmark Typography
- Font: Geist (Variable)
- Weight: 500
- Letter-spacing: 0.02em
- Style: lowercase "aletheia"

### 1.2 Color System

```css
:root {
  /* Primary - Deep Indigo (Trust, Depth, Wisdom) */
  --primary-50: #eef2ff;
  --primary-100: #e0e7ff;
  --primary-200: #c7d2fe;
  --primary-300: #a5b4fc;
  --primary-400: #818cf8;
  --primary-500: #6366f1;
  --primary-600: #4f46e5;
  --primary-700: #4338ca;
  --primary-800: #3730a3;
  --primary-900: #312e81;
  --primary-950: #1e1b4b;

  /* Secondary - Soft Violet (Insight, Creativity) */
  --secondary-50: #faf5ff;
  --secondary-100: #f3e8ff;
  --secondary-200: #e9d5ff;
  --secondary-300: #d8b4fe;
  --secondary-400: #c084fc;
  --secondary-500: #a855f7;
  --secondary-600: #9333ea;
  --secondary-700: #7e22ce;
  --secondary-800: #6b21a8;
  --secondary-900: #581c87;
  --secondary-950: #3b0764;

  /* Accent - Warm Amber (Discovery, Enlightenment) */
  --accent-50: #fffbeb;
  --accent-100: #fef3c7;
  --accent-200: #fde68a;
  --accent-300: #fcd34d;
  --accent-400: #fbbf24;
  --accent-500: #f59e0b;
  --accent-600: #d97706;
  --accent-700: #b45309;
  --accent-800: #92400e;
  --accent-900: #78350f;

  /* Neutral - Slate */
  --neutral-50: #f8fafc;
  --neutral-100: #f1f5f9;
  --neutral-200: #e2e8f0;
  --neutral-300: #cbd5e1;
  --neutral-400: #94a3b8;
  --neutral-500: #64748b;
  --neutral-600: #475569;
  --neutral-700: #334155;
  --neutral-800: #1e293b;
  --neutral-900: #0f172a;
  --neutral-950: #020617;

  /* Semantic Colors */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
}

/* Dark Mode */
.dark {
  --bg-primary: var(--neutral-950);
  --bg-secondary: var(--neutral-900);
  --bg-tertiary: var(--neutral-800);
  --text-primary: var(--neutral-50);
  --text-secondary: var(--neutral-400);
  --border: var(--neutral-800);
}

/* Light Mode */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: var(--neutral-50);
  --bg-tertiary: var(--neutral-100);
  --text-primary: var(--neutral-900);
  --text-secondary: var(--neutral-600);
  --border: var(--neutral-200);
}
```

### 1.3 Typography Scale

```css
:root {
  /* Font Families */
  --font-display: 'Geist', 'Inter Tight', system-ui, sans-serif;
  --font-body: 'Pretendard', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Fluid Type Scale (using clamp) */
  --text-xs: clamp(0.75rem, 0.7rem + 0.1vw, 0.8rem);      /* 12-13px */
  --text-sm: clamp(0.8125rem, 0.775rem + 0.15vw, 0.875rem); /* 13-14px */
  --text-base: clamp(0.875rem, 0.825rem + 0.2vw, 1rem);    /* 14-16px */
  --text-lg: clamp(1rem, 0.925rem + 0.3vw, 1.125rem);      /* 16-18px */
  --text-xl: clamp(1.125rem, 1rem + 0.5vw, 1.25rem);       /* 18-20px */
  --text-2xl: clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem);      /* 20-24px */
  --text-3xl: clamp(1.5rem, 1.3rem + 0.8vw, 1.875rem);     /* 24-30px */
  --text-4xl: clamp(1.875rem, 1.5rem + 1.5vw, 2.5rem);     /* 30-40px */
  --text-5xl: clamp(2.5rem, 2rem + 2vw, 3.5rem);           /* 40-56px */

  /* Line Heights */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;

  /* Letter Spacing */
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
}
```

### 1.4 Spacing System

```css
:root {
  /* Base unit: 4px */
  --space-0: 0;
  --space-px: 1px;
  --space-0.5: 0.125rem;  /* 2px */
  --space-1: 0.25rem;     /* 4px */
  --space-1.5: 0.375rem;  /* 6px */
  --space-2: 0.5rem;      /* 8px */
  --space-2.5: 0.625rem;  /* 10px */
  --space-3: 0.75rem;     /* 12px */
  --space-3.5: 0.875rem;  /* 14px */
  --space-4: 1rem;        /* 16px */
  --space-5: 1.25rem;     /* 20px */
  --space-6: 1.5rem;      /* 24px */
  --space-7: 1.75rem;     /* 28px */
  --space-8: 2rem;        /* 32px */
  --space-9: 2.25rem;     /* 36px */
  --space-10: 2.5rem;     /* 40px */
  --space-12: 3rem;       /* 48px */
  --space-14: 3.5rem;     /* 56px */
  --space-16: 4rem;       /* 64px */
  --space-20: 5rem;       /* 80px */
  --space-24: 6rem;       /* 96px */
}
```

### 1.5 Shadow System

```css
:root {
  /* Elevation Levels (Multi-layer for depth) */
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);

  --shadow-sm:
    0 1px 2px 0 rgb(0 0 0 / 0.03),
    0 1px 3px 0 rgb(0 0 0 / 0.06);

  --shadow-md:
    0 2px 4px -1px rgb(0 0 0 / 0.04),
    0 4px 6px -1px rgb(0 0 0 / 0.08);

  --shadow-lg:
    0 4px 6px -2px rgb(0 0 0 / 0.03),
    0 10px 15px -3px rgb(0 0 0 / 0.08);

  --shadow-xl:
    0 8px 10px -3px rgb(0 0 0 / 0.04),
    0 20px 25px -5px rgb(0 0 0 / 0.08);

  --shadow-2xl:
    0 12px 20px -5px rgb(0 0 0 / 0.05),
    0 25px 50px -12px rgb(0 0 0 / 0.15);

  /* Glow Effects (for accent elements) */
  --glow-primary: 0 0 20px rgb(99 102 241 / 0.3);
  --glow-accent: 0 0 20px rgb(251 191 36 / 0.3);
  --glow-success: 0 0 20px rgb(16 185 129 / 0.3);
}
```

### 1.6 Animation System

```css
:root {
  /* Durations */
  --duration-instant: 50ms;
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-slower: 700ms;

  /* Easings (Spring-like feel) */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Keyframe Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: var(--glow-primary); }
  50% { box-shadow: 0 0 30px rgb(99 102 241 / 0.5); }
}
```

---

## 2. Component Specifications

### 2.1 Button Component

```typescript
// src/components/ui/Button/Button.tsx

interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

**Visual Specifications:**

| Variant | Background | Text | Border | Hover | Active |
|---------|-----------|------|--------|-------|--------|
| primary | gradient(primary-600→primary-700) | white | none | brightness(1.1) | scale(0.98) |
| secondary | secondary-100 | secondary-700 | none | secondary-200 | scale(0.98) |
| ghost | transparent | neutral-600 | none | neutral-100 | neutral-200 |
| outline | transparent | primary-600 | primary-300 | primary-50 | primary-100 |
| danger | error/10 | error | none | error/20 | scale(0.98) |

**Size Specifications:**

| Size | Height | Padding X | Font Size | Icon Size |
|------|--------|-----------|-----------|-----------|
| sm | 32px | 12px | text-sm | 14px |
| md | 40px | 16px | text-base | 16px |
| lg | 48px | 24px | text-lg | 20px |

**States:**
- Focus: `ring-2 ring-primary-500 ring-offset-2`
- Disabled: `opacity-50 cursor-not-allowed`
- Loading: Spinner icon replaces content

**Tailwind Classes:**
```tsx
const variants = {
  primary: `
    bg-gradient-to-br from-primary-600 to-primary-700
    text-white shadow-md
    hover:shadow-lg hover:brightness-110
    active:scale-[0.98]
    transition-all duration-150
  `,
  // ...
}
```

### 2.2 Card Component

```typescript
// src/components/ui/Card/Card.tsx

interface CardProps {
  variant: 'default' | 'elevated' | 'glass' | 'interactive';
  padding: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}
```

**Visual Specifications:**

| Variant | Background | Border | Shadow | Backdrop |
|---------|-----------|--------|--------|----------|
| default | bg-primary | border | shadow-sm | none |
| elevated | bg-primary | none | shadow-lg | none |
| glass | white/70 (dark: neutral-900/70) | white/20 | shadow-lg | blur-xl |
| interactive | bg-primary | border | shadow-md | none |

**Interactive States (hover: true):**
```css
.card-interactive:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
  border-color: var(--primary-200);
}
```

**Tailwind Classes:**
```tsx
const variants = {
  glass: `
    bg-white/70 dark:bg-neutral-900/70
    backdrop-blur-xl
    border border-white/20 dark:border-neutral-800/50
    shadow-lg
  `,
  interactive: `
    bg-white dark:bg-neutral-900
    border border-neutral-200 dark:border-neutral-800
    shadow-md
    hover:shadow-xl hover:-translate-y-0.5
    hover:border-primary-200 dark:hover:border-primary-800
    transition-all duration-200
  `,
}
```

### 2.3 Input Component

```typescript
// src/components/ui/Input/Input.tsx

interface InputProps {
  variant: 'default' | 'filled' | 'floating';
  size: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
}
```

**Visual Specifications:**

| Variant | Background | Border | Label |
|---------|-----------|--------|-------|
| default | transparent | border-neutral-300 | Above |
| filled | neutral-100 | border-transparent | Above |
| floating | transparent | border-neutral-300 | Animated inside |

**Floating Label Animation:**
```css
.input-floating:focus + label,
.input-floating:not(:placeholder-shown) + label {
  transform: translateY(-1.5rem) scale(0.85);
  color: var(--primary-600);
}
```

**States:**
- Focus: `border-primary-500 ring-2 ring-primary-500/20`
- Error: `border-error ring-2 ring-error/20`
- Disabled: `opacity-50 bg-neutral-100`

### 2.4 Modal Component

```typescript
// src/components/ui/Modal/Modal.tsx

interface ModalProps {
  size: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
}
```

**Visual Specifications:**
- Backdrop: `bg-neutral-900/60 backdrop-blur-sm`
- Container: `bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl`
- Animation: Scale + fade with spring easing

**Size Specifications:**

| Size | Max Width |
|------|-----------|
| sm | 400px |
| md | 500px |
| lg | 640px |
| xl | 800px |
| full | 100vw - 32px |

**Framer Motion Config:**
```tsx
const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 10
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.15 }
  }
}
```

### 2.5 Badge Component

```typescript
// src/components/ui/Badge/Badge.tsx

interface BadgeProps {
  variant: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
  size: 'sm' | 'md';
  dot?: boolean;
  glow?: boolean;
}
```

**Visual Specifications:**

| Variant | Background | Text | Glow (if enabled) |
|---------|-----------|------|-------------------|
| primary | primary-100 | primary-700 | glow-primary |
| secondary | secondary-100 | secondary-700 | none |
| success | success/10 | success | glow-success |
| warning | warning/10 | warning | none |
| danger | error/10 | error | none |

**Size:**

| Size | Padding | Font Size | Height |
|------|---------|-----------|--------|
| sm | 4px 8px | text-xs | 20px |
| md | 6px 12px | text-sm | 24px |

### 2.6 Tabs Component

```typescript
// src/components/ui/Tabs/Tabs.tsx

interface TabsProps {
  variant: 'underline' | 'pills' | 'boxed';
}
```

**Visual Specifications:**

| Variant | Indicator | Background |
|---------|-----------|------------|
| underline | Bottom border sliding | Transparent |
| pills | Pill background sliding | neutral-100 |
| boxed | Full background | Selected: white |

**Sliding Indicator Animation:**
```tsx
// layoutId를 사용한 Framer Motion 슬라이딩 인디케이터
<motion.div
  layoutId="tab-indicator"
  className="absolute bottom-0 h-0.5 bg-primary-600"
  transition={{ type: "spring", stiffness: 500, damping: 30 }}
/>
```

---

## 3. Layout Specifications

### 3.1 Header

**Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]     [Dashboard] [Fragments] [Decisions] [Values]  [User] │
└─────────────────────────────────────────────────────────────┘
```

**Visual:**
- Height: 64px
- Background: `bg-white/80 dark:bg-neutral-950/80`
- Backdrop: `backdrop-blur-lg backdrop-saturate-150`
- Border: `border-b border-neutral-200/50 dark:border-neutral-800/50`
- Position: Sticky top

**Navigation Item:**
- Default: `text-neutral-600`
- Hover: `text-neutral-900` + underline animation
- Active: `text-primary-600` + underline

**Mobile (< 768px):**
- Hamburger menu icon (top-right)
- Slide-in drawer from right
- Full-height overlay

### 3.2 Main Layout

**Desktop Grid:**
```
┌───────────────────────────────────────┐
│              Header (64px)            │
├───────────────────────────────────────┤
│                                       │
│           Content Area                │
│        max-w-7xl mx-auto             │
│        px-4 sm:px-6 lg:px-8          │
│                                       │
└───────────────────────────────────────┘
```

**Page Container:**
- Max width: 1280px (max-w-7xl)
- Padding: 16px (sm: 24px, lg: 32px)
- Vertical spacing: 24px (sm: 32px, lg: 48px)

### 3.3 Dashboard Layout (Bento Grid)

```
┌──────────────┬──────────────┬──────────┐
│              │              │          │
│   Quick Add  │   Radar      │  Stats   │
│   (span 1)   │   Chart      │  Card    │
│              │   (span 1)   │          │
├──────────────┼──────────────┴──────────┤
│              │                         │
│   Recent     │      Value Summary      │
│   Fragments  │         (span 2)        │
│   (span 1)   │                         │
└──────────────┴─────────────────────────┘
```

**Grid CSS:**
```css
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## 4. Icon System

### 4.1 Lucide Icons Usage

**Navigation Icons:**
| Purpose | Icon Name | Lucide Import |
|---------|-----------|---------------|
| Home/Dashboard | `LayoutDashboard` | `layout-dashboard` |
| Fragments | `BookOpen` | `book-open` |
| Decisions | `Scale` | `scale` |
| Values | `Gem` | `gem` |
| Settings | `Settings` | `settings` |
| User | `User` | `user` |
| Logout | `LogOut` | `log-out` |

**Action Icons:**
| Purpose | Icon Name |
|---------|-----------|
| Add | `Plus` |
| Edit | `Pencil` |
| Delete | `Trash2` |
| Search | `Search` |
| Filter | `Filter` |
| Sort | `ArrowUpDown` |
| Close | `X` |
| Check | `Check` |
| Warning | `AlertTriangle` |
| Info | `Info` |

### 4.2 Custom Mood Icons (SVG)

기존 이모지를 대체할 커스텀 SVG 아이콘:

| Mood | Visual Description |
|------|-------------------|
| Very Positive | 상승하는 곡선, 따뜻한 색상 |
| Positive | 부드러운 상승선 |
| Neutral | 수평선, 균형 |
| Negative | 부드러운 하강선 |
| Very Negative | 하강 곡선, 차가운 색상 |

**SVG Structure:**
```tsx
// src/components/brand/MoodIcon.tsx
const MoodIcon = ({ mood, size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={moodColors[mood]}
  >
    {/* Mood-specific path */}
  </svg>
);
```

---

## 5. Page Designs

### 5.1 Landing Page

**Hero Section:**
```
┌─────────────────────────────────────────┐
│                                         │
│           aletheia                      │
│                                         │
│    "AI는 결정하지 않습니다.             │
│     과거의 당신을 회상합니다."          │
│                                         │
│         [시작하기]  [더 알아보기]        │
│                                         │
│    ╭─────────────────────────────╮     │
│    │    App Preview/Animation    │     │
│    ╰─────────────────────────────╯     │
│                                         │
└─────────────────────────────────────────┘
```

**Features Section:**
- 3-column grid
- Icon + Title + Description
- Subtle hover animations

**CTA Section:**
- Full-width gradient background
- Centered content
- Single prominent button

### 5.2 Dashboard Page

**Layout:**
- Bento grid (3 columns desktop)
- Card-based widgets
- Quick action floating button (mobile)

**Widgets:**
1. **Quick Add** - FragmentInputForm (compact)
2. **Value Radar** - ValueRadarChart
3. **Recent Thoughts** - Latest 3 fragments
4. **Value Summary** - Top values, conflicts
5. **Pending Decisions** - Action required items

### 5.3 Fragments Page

**Layout:**
- Search bar (sticky)
- Filter pills (topic, mood, date)
- Masonry or list view toggle
- Infinite scroll

**Fragment Card (List View):**
```
┌────────────────────────────────────────┐
│ [Mood]  Content preview text...        │
│         that spans multiple lines      │
│                                        │
│ [Topic] [Topic]         2시간 전       │
└────────────────────────────────────────┘
```

### 5.4 Decisions Page

**Layout:**
- Pending decisions banner (top)
- Filter/sort controls
- Timeline or card view

**Decision Card:**
```
┌────────────────────────────────────────┐
│ 어떤 선택을 해야 할까?                  │
│                                        │
│ ┌────────────┐  ┌────────────┐        │
│ │  Option A  │  │  Option B  │        │
│ │    45%     │  │    55%     │        │
│ └────────────┘  └────────────┘        │
│                                        │
│ Priority: 성장  │  Created: 3일 전     │
└────────────────────────────────────────┘
```

### 5.5 Values Page

**Layout:**
- Tabs: Overview / Axes / Conflicts
- Large radar chart (centered)
- Interactive axis cards
- Conflict list with visual connections

**Axis Detail:**
```
┌────────────────────────────────────────┐
│ ◆ GROWTH                       +0.72   │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░          │
│                                        │
│ Related fragments: 24                  │
│ Recent trend: ↑ 상승                   │
└────────────────────────────────────────┘
```

---

## 6. Animation Specifications

### 6.1 Page Transitions

```tsx
// Using Next.js App Router + Framer Motion
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 }
  }
}
```

### 6.2 List Stagger

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
}
```

### 6.3 Micro-interactions

| Element | Trigger | Animation |
|---------|---------|-----------|
| Button | Hover | `brightness(1.05)` |
| Button | Click | `scale(0.98)` |
| Card | Hover | `translateY(-2px), shadow-xl` |
| Input | Focus | `ring` expansion |
| Tab | Click | Indicator slide |
| Modal | Open | Scale + fade in |
| Modal | Close | Scale + fade out |

---

## 7. Responsive Breakpoints

```css
/* Tailwind default breakpoints */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet portrait */
lg: 1024px  /* Tablet landscape / Small desktop */
xl: 1280px  /* Desktop */
2xl: 1536px /* Large desktop */
```

**Mobile-first approach:**
- Base styles for mobile
- Progressive enhancement for larger screens
- Touch-friendly tap targets (min 44px)

---

## 8. Accessibility Requirements

### 8.1 Color Contrast
- Text on background: minimum 4.5:1 (AA)
- Large text: minimum 3:1
- Interactive elements: minimum 3:1

### 8.2 Focus States
- All interactive elements must have visible focus
- Focus ring: `ring-2 ring-primary-500 ring-offset-2`
- Skip links for keyboard navigation

### 8.3 Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 8.4 ARIA
- Proper labels for all inputs
- Role attributes for custom components
- Live regions for dynamic content

---

## 9. File Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.variants.ts
│   │   │   └── index.ts
│   │   ├── Card/
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Badge/
│   │   ├── Tabs/
│   │   ├── Skeleton/
│   │   └── index.ts
│   ├── brand/
│   │   ├── Logo/
│   │   │   ├── Logo.tsx
│   │   │   ├── Wordmark.tsx
│   │   │   └── index.ts
│   │   ├── MoodIcon/
│   │   └── Icon/
│   ├── layout/
│   │   ├── Header/
│   │   ├── MobileNav/
│   │   ├── MainLayout/
│   │   └── PageTransition/
│   ├── fragments/
│   ├── decisions/
│   └── values/
├── styles/
│   ├── tokens/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   ├── shadows.ts
│   │   ├── animations.ts
│   │   └── index.ts
│   └── globals.css
└── lib/
    └── motion/
        ├── variants.ts
        └── index.ts
```

---

## 10. Implementation Order

1. **Phase 1: Foundation**
   - [ ] Design tokens 설정
   - [ ] Tailwind 설정 업데이트
   - [ ] 글로벌 스타일 적용
   - [ ] Framer Motion 설치

2. **Phase 2: Brand**
   - [ ] Logo 컴포넌트 생성
   - [ ] Wordmark 컴포넌트 생성
   - [ ] MoodIcon 컴포넌트 생성

3. **Phase 3: Core UI**
   - [ ] Button 리디자인
   - [ ] Card 리디자인
   - [ ] Input 리디자인
   - [ ] Modal 리디자인
   - [ ] Badge 리디자인
   - [ ] Tabs 리디자인

4. **Phase 4: Layout**
   - [ ] Header 리디자인
   - [ ] MobileNav 구현
   - [ ] MainLayout 업데이트
   - [ ] PageTransition 추가

5. **Phase 5: Domain Components**
   - [ ] FragmentCard 리디자인
   - [ ] MoodSelector 리디자인
   - [ ] DecisionCard 리디자인
   - [ ] ValueRadarChart 리디자인
   - [ ] ValueAxesGrid 리디자인

6. **Phase 6: Pages**
   - [ ] Landing page
   - [ ] Auth pages
   - [ ] Dashboard
   - [ ] Fragments page
   - [ ] Decisions page
   - [ ] Values page
   - [ ] Onboarding flow

---

## 11. Dependencies

```json
{
  "dependencies": {
    "framer-motion": "^11.x",
    "lucide-react": "^0.x",
    "@radix-ui/react-dialog": "^1.x",
    "@radix-ui/react-tabs": "^1.x",
    "@radix-ui/react-dropdown-menu": "^2.x"
  }
}
```

---

**Next Step:** 구현 시작 또는 `/pdca do aletheia-ui-redesign`
