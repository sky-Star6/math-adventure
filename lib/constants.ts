// ============================================================
// 📘 constants.ts - 앱 전체에서 사용하는 상수 정의
// ============================================================

import { ShapeInfo, Difficulty } from './types';

/**
 * 숫자 세기 문제에서 사용할 귀여운 이모지 목록
 * 아이들이 좋아하는 동물, 과일, 자연 아이콘
 */
export const COUNTING_EMOJIS = [
  '🍎', '🍊', '🍋', '🍇', '🍓', '🍑', '🍒',
  '⭐', '🌟', '💫', '🌸', '🌺', '🌻',
  '🐱', '🐶', '🐰', '🐻', '🦋', '🐠',
  '🎈', '❤️', '💎', '🎀', '🍬',
];

/**
 * 난이도별 숫자 범위 설정
 * 각 난이도에 따라 문제에 사용되는 숫자의 최소/최대값
 */
export const DIFFICULTY_RANGES: Record<Difficulty, { min: number; max: number }> = {
  easy: { min: 1, max: 5 },      // 쉬움: 1~5 범위
  medium: { min: 1, max: 10 },   // 보통: 1~10 범위
  hard: { min: 1, max: 20 },     // 어려움: 1~20 범위
};

/**
 * 덧셈/뺄셈에서 사용할 숫자 범위
 * 결과가 한 자리 수를 넘지 않도록 조절
 */
export const OPERATION_RANGES: Record<Difficulty, { min: number; max: number }> = {
  easy: { min: 1, max: 5 },      // 쉬움: 1~5 범위 (합: 최대 10)
  medium: { min: 1, max: 9 },    // 보통: 1~9 범위 (합: 최대 18)
  hard: { min: 1, max: 9 },      // 어려움: 1~9 범위 (합: 최대 18)
};

/**
 * 도형 정보 목록
 * CSS로 렌더링할 기본 도형들
 */
export const SHAPES: ShapeInfo[] = [
  { id: 'circle', nameKo: '원', nameEn: 'Circle', cssClass: 'shape-circle', color: '#FF6B9D' },
  { id: 'triangle', nameKo: '삼각형', nameEn: 'Triangle', cssClass: 'shape-triangle', color: '#4ECDC4' },
  { id: 'square', nameKo: '사각형', nameEn: 'Square', cssClass: 'shape-square', color: '#45B7D1' },
  { id: 'star', nameKo: '별', nameEn: 'Star', cssClass: 'shape-star', color: '#F7DC6F' },
  { id: 'heart', nameKo: '하트', nameEn: 'Heart', cssClass: 'shape-heart', color: '#FF6F91' },
  { id: 'diamond', nameKo: '마름모', nameEn: 'Diamond', cssClass: 'shape-diamond', color: '#A78BFA' },
];

/**
 * 문제 유형별 아이콘 & 색상
 */
export const QUESTION_TYPE_INFO = {
  counting: { emoji: '🔢', colorFrom: '#FF9A9E', colorTo: '#FECFEF' },
  addition: { emoji: '➕', colorFrom: '#A1C4FD', colorTo: '#C2E9FB' },
  subtraction: { emoji: '➖', colorFrom: '#D4FC79', colorTo: '#96E6A1' },
  comparison: { emoji: '⚖️', colorFrom: '#FAD0C4', colorTo: '#FFD1FF' },
  shape: { emoji: '🔷', colorFrom: '#A18CD1', colorTo: '#FBC2EB' },
  sequence: { emoji: '🔗', colorFrom: '#FFECD2', colorTo: '#FCB69F' },
  mixed: { emoji: '🔀', colorFrom: '#84FAB0', colorTo: '#8FD3F4' },
} as const;

/**
 * 점수에 따른 등급 & 메시지 (한국어/영어)
 */
export const SCORE_GRADES = [
  { minScore: 100, medal: '🏆', messageKo: '완벽해요! 천재!', messageEn: 'Perfect! You\'re a genius!' },
  { minScore: 80, medal: '🥇', messageKo: '대단해요! 최고!', messageEn: 'Amazing! You\'re the best!' },
  { minScore: 60, medal: '🥈', messageKo: '잘했어요! 훌륭해요!', messageEn: 'Great job! Well done!' },
  { minScore: 40, medal: '🥉', messageKo: '좋아요! 조금만 더 노력해봐요!', messageEn: 'Good! Keep trying!' },
  { minScore: 0, medal: '⭐', messageKo: '괜찮아요! 다시 도전해봐요!', messageEn: 'It\'s okay! Try again!' },
];

/**
 * 정답/오답 시 격려 메시지
 */
export const FEEDBACK_MESSAGES = {
  correct: {
    ko: ['정답이에요! 🎉', '맞았어요! 대단해! 🌟', '와! 잘했어요! 💪', '천재예요! ⭐'],
    en: ['Correct! 🎉', 'Right! Amazing! 🌟', 'Wow! Great job! 💪', 'Genius! ⭐'],
  },
  wrong: {
    ko: ['아쉬워요! 😊', '다음엔 맞출 수 있어요! 💪', '괜찮아요! 😄', '힘내요! 🌈'],
    en: ['Oops! 😊', 'You\'ll get it next time! 💪', 'It\'s okay! 😄', 'Keep going! 🌈'],
  },
};

/** 문제 개수 옵션 */
export const QUESTION_COUNT_OPTIONS = [5, 10, 15];

/** localStorage 키 */
export const STORAGE_KEY = 'math_adventure_records';
