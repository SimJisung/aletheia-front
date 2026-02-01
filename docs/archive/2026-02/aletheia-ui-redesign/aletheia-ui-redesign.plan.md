# Plan: Aletheia UI/UX Redesign

> PDCA Phase: Plan
> Created: 2026-01-31
> Status: Draft

---

## 1. Executive Summary

### 1.1 Project Name
**Aletheia UI/UX Complete Redesign**

### 1.2 Purpose
현재 "OLD"하게 느껴지는 UI/UX를 Awwwards 수상 수준의 트렌디하고 고객 친화적인 디자인으로 전면 개편합니다.

### 1.3 Background

**현재 문제점:**
- 로고가 "PROS"로 되어 있어 브랜드 정체성이 혼란됨 (실제 서비스명: Aletheia)
- 이모지 기반 아이콘 시스템 → 비전문적이고 시대에 뒤처진 느낌
- 기본적인 카드/버튼 디자인 → 깊이와 시각적 흥미 부족
- 그라디언트, 블러, 마이크로인터랙션 미활용
- 2018년 스타일의 플랫 디자인 → 현대적 감각 부재

**브랜드 정체성 재확립:**
- **Aletheia** (ἀλήθεια): 그리스어로 "진리", "숨겨진 것을 드러냄"
- **철학:** "AI는 결정하지 않습니다. 과거의 당신을 회상합니다."
- **핵심 가치:** 자기 발견, 성찰, 패턴 인식 (예측이 아닌)

---

## 2. Service Philosophy & Goals

### 2.1 Core Philosophy (변경 없음)
```
"AI doesn't decide, it recalls your past self."
```

- P(A|Me)는 성공 확률이 아닌 패턴 정렬도
- 가치 충돌을 해결하지 않고 보존
- 기록은 불변 (soft-delete only)
- 추천하지 않음, 과거 패턴을 표면화

### 2.2 Target User Experience

**사용자가 느껴야 할 감정:**
1. **신뢰감** - 내 데이터가 안전하게 관리되고 있다
2. **통찰력** - 내 패턴을 객관적으로 볼 수 있다
3. **평온함** - 판단받지 않는 안전한 공간
4. **명료함** - 복잡한 내면을 명확하게 정리

**디자인이 전달해야 할 메시지:**
- 미니멀하지만 풍부한 (Minimal yet Rich)
- 차분하지만 생동감 있는 (Calm yet Alive)
- 전문적이지만 접근하기 쉬운 (Professional yet Approachable)

---

## 3. Design Direction

### 3.1 Brand Identity - "Aletheia"

**로고 컨셉:**
- 그리스 문자 또는 진리를 상징하는 기하학적 형태
- 빛이 어둠을 밝히는 이미지 (계시, 발견)
- 거울/반사 메타포 (자기 성찰)

**컬러 팔레트:**
```
Primary:    Deep Indigo (#1e1b4b ~ #312e81)  → 깊이, 지성
Secondary:  Soft Violet (#a78bfa ~ #8b5cf6)  → 통찰, 창의성
Accent:     Warm Amber (#f59e0b ~ #fbbf24)   → 발견의 순간, 깨달음
Surface:    Pure White (#ffffff) / Soft Gray (#f8fafc)
Dark Mode:  Deep Navy (#0f172a) / Charcoal (#1e293b)
```

**타이포그래피:**
- Display: 기하학적이고 현대적인 서체 (Geist, Inter Tight)
- Body: Pretendard (한국어 최적화 유지)
- Mono: 코드/숫자에 JetBrains Mono

### 3.2 Design System Principles

**1. Depth & Dimension (깊이와 차원)**
- 다층 섀도우 (Multi-layer shadows)
- 글래스모피즘 (Glassmorphism with backdrop-blur)
- 미묘한 그라디언트 배경

**2. Purposeful Motion (목적 있는 움직임)**
- 모든 인터랙션에 미세한 피드백
- 의미 있는 전환 애니메이션
- GPU 가속 트랜스폼 사용

**3. Visual Hierarchy (시각적 계층)**
- 명확한 정보 구조
- 화이트스페이스 활용
- 타이포그래피 스케일 시스템

**4. Accessibility First (접근성 우선)**
- WCAG 2.1 AA 준수
- 모션 감소 옵션
- 키보드 네비게이션 완벽 지원

### 3.3 Awwwards-Level Design Elements

**트렌드 적용:**
1. **Variable Fonts** - 가중치를 부드럽게 전환
2. **CSS Clamp** - 뷰포트 반응형 타이포그래피
3. **Container Queries** - 컴포넌트 기반 반응형
4. **View Transitions API** - 페이지 전환 애니메이션
5. **Scroll-driven Animations** - 스크롤 기반 시각 효과

---

## 4. Component Redesign Scope

### 4.1 Brand & Navigation

| Component | Current | Redesign |
|-----------|---------|----------|
| Logo | 💡 + "PROS" 텍스트 | Aletheia SVG 로고 + 워드마크 |
| Header | 이모지 네비게이션 | Lucide 아이콘 + 호버 언더라인 |
| Mobile Nav | 하단 탭바 | 슬라이드 드로어 메뉴 |
| User Menu | 아이콘 드롭다운 | 프로필 카드 팝오버 |

### 4.2 Core UI Components

| Component | Current | Redesign |
|-----------|---------|----------|
| Button | 플랫, rounded-lg | 그라디언트, 섀도우, 스케일 효과 |
| Card | 기본 bordered/elevated | 글래스모픽, 다층 섀도우 |
| Input | 기본 테두리 | 플로팅 라벨, 아이콘 지원 |
| Badge | 단순 pill | 서브틀 그라디언트, 글로우 |
| Modal | 기본 오버레이 | 블러 배경, 스프링 애니메이션 |
| Tabs | 언더라인 | 슬라이딩 인디케이터, 배경 애니메이션 |

### 4.3 Domain Components

| Component | Redesign Focus |
|-----------|---------------|
| FragmentCard | 무드 시각화 개선, 호버 인터랙션 |
| MoodSelector | 이모지 → SVG 아이콘, 애니메이션 |
| DecisionCard | 확률 시각화 리디자인 |
| ValueRadarChart | 커스텀 SVG, 애니메이션 |
| ValueAxesGrid | 인터랙티브 바 차트 |

### 4.4 Pages

| Page | Redesign Focus |
|------|---------------|
| Landing | 히어로 섹션, 기능 쇼케이스, CTA |
| Onboarding | 스텝 인디케이터, 트랜지션 |
| Dashboard | 벤토 그리드 레이아웃, 위젯 스타일 |
| Fragments | 매거진 스타일 리스트 |
| Decisions | 타임라인 뷰 옵션 |
| Values | 인터랙티브 차트, 드릴다운 |

---

## 5. Technical Approach

### 5.1 Technology Stack (유지)
- Next.js 14+ App Router
- Tailwind CSS 4.0+
- Framer Motion (신규 추가)
- Lucide React Icons

### 5.2 Design Token System

```typescript
// 새로운 디자인 토큰 구조
tokens/
├── colors.ts      // 시맨틱 컬러 시스템
├── typography.ts  // 폰트 스케일
├── spacing.ts     // 간격 시스템
├── shadows.ts     // 다층 섀도우
├── animations.ts  // 트랜지션/키프레임
└── index.ts       // 통합 내보내기
```

### 5.3 Component Architecture

```
src/components/
├── ui/              # 리디자인된 프리미티브
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.variants.ts
│   │   └── index.ts
│   ├── Card/
│   ├── Input/
│   └── ...
├── brand/           # 신규: 브랜드 컴포넌트
│   ├── Logo/
│   ├── Icon/        # 커스텀 아이콘 세트
│   └── Wordmark/
└── motion/          # 신규: 애니메이션 래퍼
    ├── FadeIn/
    ├── SlideUp/
    └── Stagger/
```

---

## 6. Success Criteria

### 6.1 Quantitative Metrics
- [ ] Lighthouse Performance Score: 90+
- [ ] Lighthouse Accessibility Score: 100
- [ ] First Contentful Paint: < 1.5s
- [ ] Time to Interactive: < 3s
- [ ] Cumulative Layout Shift: < 0.1

### 6.2 Qualitative Criteria
- [ ] 로고가 "Aletheia"로 명확히 표시됨
- [ ] 이모지가 UI chrome에서 완전히 제거됨
- [ ] 모든 인터랙션에 미세한 피드백 존재
- [ ] 다크 모드 완벽 지원
- [ ] 모바일 UX가 데스크톱만큼 우수

### 6.3 Awwwards Checklist
- [ ] 독창적인 디자인 컨셉
- [ ] 완벽한 반응형 디자인
- [ ] 부드러운 애니메이션과 전환
- [ ] 우수한 타이포그래피
- [ ] 혁신적인 인터랙션
- [ ] 빠른 로딩 속도

---

## 7. Implementation Phases

### Phase 1: Foundation (기반)
1. 브랜드 토큰 시스템 구축
2. Aletheia 로고 및 아이콘 세트 생성
3. 새로운 컬러 팔레트 적용

### Phase 2: Core Components (핵심 컴포넌트)
1. Button, Card, Input 리디자인
2. Modal, Badge, Tabs 리디자인
3. 애니메이션 시스템 구축

### Phase 3: Layout & Navigation (레이아웃)
1. Header 리디자인
2. 모바일 네비게이션 개선
3. 페이지 레이아웃 템플릿

### Phase 4: Domain Components (도메인)
1. Fragment 관련 컴포넌트
2. Decision 관련 컴포넌트
3. Value 차트 및 시각화

### Phase 5: Pages (페이지)
1. Landing / Auth 페이지
2. Dashboard
3. 나머지 페이지

### Phase 6: Polish (마무리)
1. 마이크로인터랙션 추가
2. 로딩 상태 개선
3. 접근성 최종 점검

---

## 8. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| 성능 저하 (애니메이션) | High | GPU 가속 사용, will-change 최적화 |
| 접근성 저하 | High | prefers-reduced-motion 존중 |
| 브라우저 호환성 | Medium | Progressive enhancement |
| 구현 복잡도 | Medium | Framer Motion 라이브러리 활용 |

---

## 9. Out of Scope

- 백엔드 API 변경
- 새로운 기능 추가 (UI/UX 개선만)
- 콘텐츠 변경 (카피라이팅)
- SEO 최적화 (별도 프로젝트)

---

## 10. Approval

- [ ] 계획서 검토 완료
- [ ] 디자인 방향성 승인
- [ ] 구현 범위 합의

---

**Next Step:** `/pdca design aletheia-ui-redesign` 으로 상세 설계 진행
