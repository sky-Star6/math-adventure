// ============================================================
// 🎲 questionGenerator.ts - 문제 자동 생성 모듈
// ============================================================
// 각 문제 유형에 맞는 랜덤 문제를 만들어주는 핵심 로직

import { Question, QuestionType, Difficulty, VisualData } from './types';
import {
  COUNTING_EMOJIS,
  DIFFICULTY_RANGES,
  OPERATION_RANGES,
  SHAPES,
} from './constants';

// ============================================================
// 🔧 유틸리티 함수들
// ============================================================

/**
 * 지정 범위에서 랜덤 정수 생성
 * @param min - 최소값 (포함)
 * @param max - 최대값 (포함)
 * @returns min ~ max 사이의 랜덤 정수
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 배열에서 랜덤으로 하나를 선택
 * @param array - 선택할 배열
 * @returns 랜덤으로 선택된 요소
 */
function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * 배열을 랜덤으로 섞기 (Fisher-Yates 알고리즘)
 * 원본 배열은 변경하지 않고 새 배열을 반환
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 정답과 겹치지 않는 오답 보기를 생성
 * @param correctAnswer - 정답 (숫자)
 * @param min - 최소값
 * @param max - 최대값
 * @param count - 오답 개수 (기본 3개, 총 4지선다)
 * @returns 오답 숫자 배열
 */
function generateWrongAnswers(
  correctAnswer: number,
  min: number,
  max: number,
  count: number = 3
): number[] {
  const wrongAnswers = new Set<number>();

  // 정답 근처의 숫자를 오답으로 선호 (헷갈리게 만들기)
  const nearbyRange = 3;
  let attempts = 0;

  while (wrongAnswers.size < count && attempts < 100) {
    let candidate: number;

    // 50% 확률로 정답 근처의 숫자를 선택
    if (attempts < count * 2) {
      candidate = correctAnswer + randomInt(-nearbyRange, nearbyRange);
    } else {
      candidate = randomInt(Math.max(0, min - 2), max + 2);
    }

    // 유효한 오답인지 확인 (정답과 다르고, 0 이상)
    if (candidate !== correctAnswer && candidate >= 0 && !wrongAnswers.has(candidate)) {
      wrongAnswers.add(candidate);
    }
    attempts++;
  }

  return Array.from(wrongAnswers);
}

// ============================================================
// 📝 문제 유형별 생성 함수
// ============================================================

/**
 * 🔢 숫자 세기 문제 생성
 * 귀여운 이모지를 랜덤 개수만큼 보여주고, 개수를 맞추는 문제
 */
function generateCountingQuestion(difficulty: Difficulty, id: number): Question {
  const range = DIFFICULTY_RANGES[difficulty];
  const count = randomInt(range.min, range.max);
  const emoji = randomChoice(COUNTING_EMOJIS);

  const wrongAnswers = generateWrongAnswers(count, range.min, range.max);
  const choices = shuffleArray([count, ...wrongAnswers]).map(String);

  return {
    id,
    type: 'counting',
    difficulty,
    questionTextKey: 'quiz.counting.question',
    visualData: { emoji, count },
    choices,
    correctAnswer: String(count),
  };
}

/**
 * ➕ 덧셈 문제 생성
 * 두 수를 더하는 문제 (한 자리 수)
 */
function generateAdditionQuestion(difficulty: Difficulty, id: number): Question {
  const range = OPERATION_RANGES[difficulty];
  const num1 = randomInt(range.min, range.max);
  const num2 = randomInt(range.min, range.max);
  const answer = num1 + num2;

  const wrongAnswers = generateWrongAnswers(answer, 0, range.max * 2);
  const choices = shuffleArray([answer, ...wrongAnswers]).map(String);

  return {
    id,
    type: 'addition',
    difficulty,
    questionTextKey: 'quiz.addition.question',
    visualData: {
      num1,
      num2,
      operator: '+',
      emoji: randomChoice(COUNTING_EMOJIS),
    },
    choices,
    correctAnswer: String(answer),
  };
}

/**
 * ➖ 뺄셈 문제 생성
 * 큰 수에서 작은 수를 빼는 문제 (결과가 항상 0 이상)
 */
function generateSubtractionQuestion(difficulty: Difficulty, id: number): Question {
  const range = OPERATION_RANGES[difficulty];
  // 큰 수에서 작은 수를 빼도록 정렬
  let num1 = randomInt(range.min, range.max);
  let num2 = randomInt(range.min, range.max);
  if (num1 < num2) [num1, num2] = [num2, num1]; // num1이 항상 크도록

  const answer = num1 - num2;

  const wrongAnswers = generateWrongAnswers(answer, 0, range.max);
  const choices = shuffleArray([answer, ...wrongAnswers]).map(String);

  return {
    id,
    type: 'subtraction',
    difficulty,
    questionTextKey: 'quiz.subtraction.question',
    visualData: {
      num1,
      num2,
      operator: '-',
      emoji: randomChoice(COUNTING_EMOJIS),
    },
    choices,
    correctAnswer: String(answer),
  };
}

/**
 * ⚖️ 크기 비교 문제 생성
 * 두 수를 비교하여 >, <, = 를 맞추는 문제
 */
function generateComparisonQuestion(difficulty: Difficulty, id: number): Question {
  const range = DIFFICULTY_RANGES[difficulty];
  const leftNum = randomInt(range.min, range.max);
  let rightNum = randomInt(range.min, range.max);

  // 가끔 같은 수가 나오도록 (= 비교를 위해)
  if (Math.random() < 0.2) {
    rightNum = leftNum;
  }

  let correctAnswer: string;
  if (leftNum > rightNum) correctAnswer = '>';
  else if (leftNum < rightNum) correctAnswer = '<';
  else correctAnswer = '=';

  const choices = ['>', '<', '='];

  return {
    id,
    type: 'comparison',
    difficulty,
    questionTextKey: 'quiz.comparison.question',
    visualData: { leftNum, rightNum },
    choices,
    correctAnswer,
  };
}

/**
 * 🔷 모양 인식 문제 생성
 * 도형을 보여주고 이름을 맞추는 문제
 */
function generateShapeQuestion(difficulty: Difficulty, id: number): Question {
  // 난이도에 따라 사용할 도형 수 조절
  const shapeCount = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : SHAPES.length;
  const availableShapes = SHAPES.slice(0, shapeCount);
  const correctShape = randomChoice(availableShapes);

  // 오답 보기: 다른 도형의 이름들
  const wrongShapes = availableShapes
    .filter(s => s.id !== correctShape.id)
    .slice(0, 3);

  // 보기 목록: 도형 ID를 사용 (렌더링 시 언어에 맞게 표시)
  const choices = shuffleArray([
    correctShape.id,
    ...wrongShapes.map(s => s.id),
  ]);

  return {
    id,
    type: 'shape',
    difficulty,
    questionTextKey: 'quiz.shape.question',
    visualData: { shapeName: correctShape.id },
    choices,
    correctAnswer: correctShape.id,
  };
}

/**
 * 🔗 순서 맞추기 문제 생성
 * 숫자 배열에서 빈칸에 들어갈 숫자를 맞추는 문제
 */
function generateSequenceQuestion(difficulty: Difficulty, id: number): Question {
  const range = DIFFICULTY_RANGES[difficulty];

  // 난이도에 따라 증가값 결정
  const step = difficulty === 'easy' ? 1 : difficulty === 'medium' ? randomChoice([1, 2]) : randomChoice([1, 2, 3]);

  // 시작 숫자 결정
  const seqLength = 5; // 항상 5개의 숫자 배열
  const maxStart = range.max - (step * (seqLength - 1));
  const startNum = randomInt(range.min, Math.max(range.min, maxStart));

  // 숫자 배열 생성
  const fullSequence: number[] = [];
  for (let i = 0; i < seqLength; i++) {
    fullSequence.push(startNum + step * i);
  }

  // 빈칸 위치 결정 (첫 번째와 마지막은 피함)
  const blankIndex = randomInt(1, seqLength - 2);
  const correctAnswer = fullSequence[blankIndex];

  // 빈칸을 null로 표시
  const numberSequence: (number | null)[] = fullSequence.map((num, idx) =>
    idx === blankIndex ? null : num
  );

  const wrongAnswers = generateWrongAnswers(correctAnswer, range.min, range.max + 5);
  const choices = shuffleArray([correctAnswer, ...wrongAnswers]).map(String);

  return {
    id,
    type: 'sequence',
    difficulty,
    questionTextKey: 'quiz.sequence.question',
    visualData: { numberSequence },
    choices,
    correctAnswer: String(correctAnswer),
  };
}

// ============================================================
// 🎯 문제 생성 메인 함수
// ============================================================

/**
 * 문제 유형에 따라 적절한 생성 함수를 선택하여 문제를 생성
 */
function generateSingleQuestion(
  type: Exclude<QuestionType, 'mixed'>,
  difficulty: Difficulty,
  id: number
): Question {
  switch (type) {
    case 'counting':
      return generateCountingQuestion(difficulty, id);
    case 'addition':
      return generateAdditionQuestion(difficulty, id);
    case 'subtraction':
      return generateSubtractionQuestion(difficulty, id);
    case 'comparison':
      return generateComparisonQuestion(difficulty, id);
    case 'shape':
      return generateShapeQuestion(difficulty, id);
    case 'sequence':
      return generateSequenceQuestion(difficulty, id);
    default:
      return generateCountingQuestion(difficulty, id);
  }
}

/**
 * 지정된 유형과 난이도로 여러 문제를 한꺼번에 생성
 * @param type - 문제 유형 (mixed일 경우 랜덤으로 섞음)
 * @param difficulty - 난이도
 * @param count - 문제 수
 * @returns 문제 배열
 */
export function generateQuestions(
  type: QuestionType,
  difficulty: Difficulty,
  count: number
): Question[] {
  const questions: Question[] = [];

  // 혼합 모드가 아닌 경우: 같은 유형으로 count개 생성
  if (type !== 'mixed') {
    for (let i = 0; i < count; i++) {
      questions.push(generateSingleQuestion(type, difficulty, i));
    }
    return questions;
  }

  // 🔀 혼합 모드: 6가지 유형을 골고루 섞어서 출제
  const allTypes: Exclude<QuestionType, 'mixed'>[] = [
    'counting', 'addition', 'subtraction', 'comparison', 'shape', 'sequence',
  ];

  for (let i = 0; i < count; i++) {
    const randomType = randomChoice(allTypes);
    questions.push(generateSingleQuestion(randomType, difficulty, i));
  }

  // 같은 유형이 연속으로 나오지 않도록 한 번 더 섞기
  return shuffleArray(questions).map((q, idx) => ({ ...q, id: idx }));
}
