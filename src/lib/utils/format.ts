import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 날짜 포맷팅 유틸리티
 */

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'yyyy년 M월 d일', { locale: ko });
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'yyyy년 M월 d일 a h:mm', { locale: ko });
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (isToday(d)) {
    return formatDistanceToNow(d, { addSuffix: true, locale: ko });
  }

  if (isYesterday(d)) {
    return '어제';
  }

  return format(d, 'M월 d일', { locale: ko });
}

export function formatShortDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'M/d', { locale: ko });
}

/**
 * 숫자 포맷팅
 */
export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function formatValence(valence: number): string {
  const sign = valence >= 0 ? '+' : '';
  return `${sign}${valence.toFixed(1)}`;
}
