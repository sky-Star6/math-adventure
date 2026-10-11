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
 * 난이도(레벨)별 숫자 범위 설정
 * 각 레벨에 따라 문제에 사용되는 숫자의 최소/최대값
 */
export const DIFFICULTY_RANGES: Record<Difficulty, { min: number; max: number }> = {
  easy: { min: 1, max: 5 },      // 레벨 1: 1~5 범위 (기초 숫자 세기)
  medium: { min: 1, max: 10 },   // 레벨 2: 1~10 범위 (10 이하의 수)
  hard: { min: 1, max: 20 },     // 레벨 3: 1~20 범위
};

/**
 * 덧셈/뺄셈에서 사용할 숫자 범위
 * 레벨에 맞추어 계산 가능한 적절한 범위 설정
 */
export const OPERATION_RANGES: Record<Difficulty, { min: number; max: number }> = {
  easy: { min: 1, max: 5 },      // 레벨 1: 1~5 범위 (합: 최대 10, 그림 보조 제공)
  medium: { min: 1, max: 9 },    // 레벨 2: 1~9 범위 (한 자리 수 연산, 그림 보조 제공)
  hard: { min: 1, max: 9 },      // 레벨 3: 1~9 범위 (그림 없이 순수 수식 연산)
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
  multiplication: { emoji: '✖️', colorFrom: '#FFA07A', colorTo: '#FF7675' },
  comparison: { emoji: '⚖️', colorFrom: '#FAD0C4', colorTo: '#FFD1FF' },
  shape: { emoji: '🔷', colorFrom: '#A18CD1', colorTo: '#FBC2EB' },
  sequence: { emoji: '🔗', colorFrom: '#FFECD2', colorTo: '#FCB69F' },
  mixed: { emoji: '🔀', colorFrom: '#84FAB0', colorTo: '#8FD3F4' },
} as const;

/**
 * 곱셈(구구단)에서 사용할 단(num1)과 곱하는 수(num2) 범위
 * - easy: 레벨 1 (2단, 5단, 1~5까지 곱하기, 묶음 그림 보조)
 * - medium: 레벨 2 (2단~5단, 1~9까지 곱하기, 묶음 그림 보조)
 * - hard: 레벨 3 (2단~9단 전체, 1~9까지 곱하기, 식만 풀기)
 */
export const MULTIPLICATION_RANGES: Record<Difficulty, { tables: number[]; maxMultiplier: number }> = {
  easy: { tables: [2, 5], maxMultiplier: 5 },
  medium: { tables: [2, 3, 4, 5], maxMultiplier: 9 },
  hard: { tables: [2, 3, 4, 5, 6, 7, 8, 9], maxMultiplier: 9 },
};

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
export const QUESTION_COUNT_OPTIONS = [5, 10, 15, 20];

/** localStorage 키 */
export const STORAGE_KEY = 'math_adventure_records';
