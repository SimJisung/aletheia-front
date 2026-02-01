/**
 * Value Graph 타입 정의
 * aletheia-core의 ValueGraph 도메인 모델과 매핑
 */

// 8개의 고정된 가치축
export type ValueAxis =
  | 'GROWTH'
  | 'STABILITY'
  | 'FINANCIAL'
  | 'AUTONOMY'
  | 'RELATIONSHIP'
  | 'ACHIEVEMENT'
  | 'HEALTH'
  | 'MEANING';

export type ValueTrend = 'RISING' | 'FALLING' | 'NEUTRAL';

export type EdgeType = 'SUPPORT' | 'CONFLICT';

export interface ValueNode {
  axis: ValueAxis;
  displayName: string;
  avgValence: number; // -1.0 ~ +1.0
  recentTrend: ValueTrend;
  fragmentCount: number;
}

export interface ValueEdge {
  fromAxis: ValueAxis;
  toAxis: ValueAxis;
  edgeType: EdgeType;
  weight: number; // 0.0 ~ 1.0
}

export interface ValueGraph {
  nodes: ValueNode[];
  edges: ValueEdge[];
}

export interface ValueAxisDefinition {
  name: ValueAxis;
  displayNameKo: string;
  displayNameEn: string;
  description: string;
}

export interface ValueConflict {
  axis1: string; // ValueAxis name (백엔드와 일치)
  axis2: string; // ValueAxis name
  strength: number; // 0.0 ~ 1.0 (백엔드: weight → strength)
  description: string;
}

export interface ValueSummary {
  topPositiveValues: string[]; // ValueAxis names (e.g., ["GROWTH", "HEALTH"])
  topNegativeValues: string[]; // ValueAxis names
  dominantTrend: ValueTrend;
  conflictCount: number;
  totalFragments: number; // Backend uses 'totalFragments', not 'totalFragmentCount'
}

// 가치 중요도 설정 (1-10 척도)
// 백엔드는 Map<String, Double> 형태로 axis name을 키로 사용
export interface ValueImportance {
  importance: Record<string, number>; // axis name (e.g., "GROWTH") -> importance (1-10)
  version: number;
  updatedAt: string;
}

export interface SetValueImportanceRequest {
  importance: Record<string, number>; // axis name -> importance (1-10)
}

// 가치축 메타데이터 (UI용)
export const VALUE_AXIS_META: Record<
  ValueAxis,
  {
    icon: string;
    color: string;
    displayNameKo: string;
    description: string;
  }
> = {
  GROWTH: {
    icon: '🌱',
    color: '#10b981',
    displayNameKo: '성장/학습',
    description: '개인 발전, 새로운 것을 배우는 것',
  },
  STABILITY: {
    icon: '🏠',
    color: '#6366f1',
    displayNameKo: '안정/안전',
    description: '보안, 예측 가능성, 안전함',
  },
  FINANCIAL: {
    icon: '💰',
    color: '#f59e0b',
    displayNameKo: '경제적 여유',
    description: '돈, 경제적 안정, 재정적 자유',
  },
  AUTONOMY: {
    icon: '🦅',
    color: '#8b5cf6',
    displayNameKo: '자율성',
    description: '독립성, 자유, 자기 결정권',
  },
  RELATIONSHIP: {
    icon: '👥',
    color: '#ec4899',
    displayNameKo: '관계',
    description: '사회적 연결, 소속감, 사랑',
  },
  ACHIEVEMENT: {
    icon: '🏆',
    color: '#f97316',
    displayNameKo: '성취감',
    description: '성공, 목표 달성, 인정받음',
  },
  HEALTH: {
    icon: '💚',
    color: '#22c55e',
    displayNameKo: '건강',
    description: '신체적/정신적 웰빙',
  },
  MEANING: {
    icon: '✨',
    color: '#a855f7',
    displayNameKo: '의미/목적',
    description: '목적의식, 중요성, 의미 있는 삶',
  },
};

// 트렌드를 아이콘으로 변환
export function trendToIcon(trend: ValueTrend): string {
  switch (trend) {
    case 'RISING':
      return '📈';
    case 'FALLING':
      return '📉';
    case 'NEUTRAL':
      return '➡️';
  }
}

// valence를 색상 강도로 변환 (그래프용)
export function valenceToColorIntensity(valence: number): number {
  return Math.abs(valence);
}

// 모든 가치축 목록
export const ALL_VALUE_AXES: ValueAxis[] = [
  'GROWTH',
  'STABILITY',
  'FINANCIAL',
  'AUTONOMY',
  'RELATIONSHIP',
  'ACHIEVEMENT',
  'HEALTH',
  'MEANING',
];
