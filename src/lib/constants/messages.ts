/**
 * UI message constants for consistent user communication
 */

export const MESSAGES = {
  // Error messages
  errors: {
    loadFragment: '기록을 불러오는데 실패했습니다.',
    loadDecision: '결정을 불러오는데 실패했습니다.',
    loadValue: '데이터를 불러오는데 실패했습니다.',
    loadExplanation: '설명을 불러오는데 실패했습니다.',
    loadExplanationTimeout: 'AI 분석에 시간이 오래 걸리고 있습니다. 잠시 후 다시 시도해주세요.',
    loadExplanationServer: '서버에서 분석 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
    loadSummary: '요약을 불러오는데 실패했습니다.',
    loadConflicts: '가치 긴장을 불러오는데 실패했습니다.',
    deleteFragment: '삭제에 실패했습니다.',
    submitFeedback: '피드백 제출에 실패했습니다.',
    notFound: '존재하지 않거나 삭제된 항목입니다.',
    invalidAxis: '존재하지 않는 가치축입니다.',
    invalidId: '잘못된 ID 형식입니다.',
  },

  // Empty state messages
  empty: {
    fragments: {
      title: '아직 기록이 없어요',
      description: '첫 번째 생각을 기록해보세요',
    },
    decisions: {
      title: '아직 의사결정이 없어요',
      description: '새로운 결정을 만들어보세요',
    },
    conflicts: {
      title: '발견된 긴장이 없어요',
      description: '더 많은 생각을 기록하면 가치 간 긴장을 분석해드려요',
    },
    relations: {
      description: '아직 발견된 관계가 없습니다. 더 많은 생각을 기록해보세요.',
    },
  },

  // Actions
  actions: {
    retry: '다시 시도',
    goBack: '목록으로 돌아가기',
    goToValues: '가치 지도로 돌아가기',
    showExplanation: '설명 보기',
    hide: '숨기기',
    cancel: '취소',
  },

  // Labels
  labels: {
    patternFit: '패턴 적합도',
    regretRisk: '후회 위험',
    averageEmotion: '평균 감정',
    recentTrend: '최근 트렌드',
    relatedRecords: '관련 기록',
    totalRecords: '총 기록 수',
    valueTension: '가치 긴장',
    emotionAnalysis: '감정 분석',
    similarRecords: '비슷한 과거 기록',
  },

  // Confirmations
  confirm: {
    hideRecord: {
      title: '기록 숨기기',
      message: '이 기록을 숨길까요?',
      warning: '숨긴 기록은 목록에서 보이지 않지만, 가치 분석에는 영향을 주지 않습니다.',
    },
  },

  // Info messages
  info: {
    notRecommendation: '이것은 추천이 아닙니다',
    patternAnalysis: '과거 당신의 패턴을 기반으로 한 적합도 분석입니다. 최종 결정은 당신의 몫입니다.',
    valueTensionNormal: '가치 간 긴장은 자연스러운 현상입니다. 사람은 누구나 여러 가치를 동시에 추구하며, 때로는 이들이 충돌하기도 합니다.',
    tensionNatural: '이것은 자연스러운 현상입니다. 많은 사람들이 비슷한 긴장을 경험합니다.',
    explanationGenerating: 'AI가 과거 기록을 분석하고 있습니다...',
    explanationWait: '30초에서 1분 정도 소요될 수 있습니다.',
  },
} as const;
