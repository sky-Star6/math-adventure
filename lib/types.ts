// ============================================================
// 📘 types.ts - 앱 전체에서 사용하는 TypeScript 타입 정의
// ============================================================

/**
 * 문제 유형(QuestionType) 열거형
 * - counting: 숫자 세기 (아이콘 개수 맞추기)
 * - addition: 덧셈 (한 자리 수 더하기)
 * - subtraction: 뺄셈 (한 자리 수 빼기)
 * - comparison: 크기 비교 (더 큰 수, 더 작은 수)
 * - shape: 모양 인식 (도형 이름 맞추기)
 * - sequence: 순서 맞추기 (빈칸 채우기)
 * - mixed: 혼합 모드 (여러 유형을 섞어서 출제)
 */
export type QuestionType =
  | 'counting'
  | 'addition'
  | 'subtraction'
  | 'comparison'
  | 'shape'
  | 'sequence'
  | 'mixed';

/**
 * 난이도(Difficulty) 타입 - 연령별 난이도 구분
 * - easy: 5~6세 (유아 기초: 1~5 숫자 범위, 시각적 그림 보조 제공)
 * - medium: 7세 (예비 초등: 1~10 숫자 범위, 시각적 그림 보조 제공)
 * - hard: 8세 (초등 1학년: 1~20 숫자 범위, 더하기/빼기 시 그림 없이 수식만으로 연산)
 */
export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * 지원 언어(Language) 타입
 * - ko: 한국어
 * - en: 영어
 */
export type Language = 'ko' | 'en';

/**
 * 개별 문제(Question) 인터페이스
 * 각 문제의 모든 정보를 담고 있음
 */
export interface Question {
  /** 문제 고유 ID (0부터 시작) */
  id: number;
  /** 문제 유형 (mixed 제외) */
  type: Exclude<QuestionType, 'mixed'>;
  /** 해당 문제의 난이도 (연령대) */
  difficulty: Difficulty;
  /** 문제 텍스트 (한국어 키) */
  questionTextKey: string;
  /** 문제에 사용할 시각적 데이터 (이모지, 숫자 등) */
  visualData: VisualData;
  /** 선택할 수 있는 보기 목록 */
  choices: string[];
  /** 정답 (choices 배열 중 하나) */
  correctAnswer: string;
}

/**
 * 시각적 데이터(VisualData) - 문제 유형마다 다른 데이터를 가짐
 */
export interface VisualData {
  /** 숫자 세기: 표시할 이모지 */
  emoji?: string;
  /** 숫자 세기: 이모지 개수 */
  count?: number;
  /** 덧셈/뺄셈: 첫 번째 숫자 */
  num1?: number;
  /** 덧셈/뺄셈: 두 번째 숫자 */
  num2?: number;
  /** 덧셈/뺄셈: 연산 기호 */
  operator?: string;
  /** 크기 비교: 왼쪽 숫자 */
  leftNum?: number;
  /** 크기 비교: 오른쪽 숫자 */
  rightNum?: number;
  /** 모양 인식: 도형 종류 */
  shapeName?: string;
  /** 순서 맞추기: 숫자 배열 (null은 빈칸) */
  numberSequence?: (number | null)[];
}

/**
 * 사용자의 답안 기록
 */
export interface AnswerRecord {
  /** 문제 정보 */
  question: Question;
  /** 사용자가 선택한 답 */
  selectedAnswer: string;
  /** 정답 여부 */
  isCorrect: boolean;
}

/**
 * 퀴즈 세션 설정 - 퀴즈를 시작할 때 필요한 정보
 */
export interface QuizConfig {
  /** 사용자 이름 (선택적) */
  playerName: string;
  /** 문제 유형 */
  questionType: QuestionType;
  /** 난이도 */
  difficulty: Difficulty;
  /** 문제 수 (5, 10, 15) */
  questionCount: number;
}

/**
 * 퀴즈 결과 - 채점 후 결과 데이터
 */
export interface QuizResult {
  /** 퀴즈 설정 정보 */
  config: QuizConfig;
  /** 각 문제별 답안 기록 */
  answers: AnswerRecord[];
  /** 맞은 개수 */
  correctCount: number;
  /** 총 문제 수 */
  totalCount: number;
  /** 점수 (퍼센트, 0~100) */
  score: number;
  /** 퀴즈 완료 시간 (ISO 문자열) */
  completedAt: string;
}

/**
 * localStorage에 저장할 학습 기록
 */
export interface StudyRecord {
  /** 고유 ID */
  id: string;
  /** 플레이어 이름 */
  playerName: string;
  /** 문제 유형 */
  questionType: QuestionType;
  /** 난이도 */
  difficulty: Difficulty;
  /** 점수 */
  score: number;
  /** 맞은 개수 */
  correctCount: number;
  /** 총 문제 수 */
  totalCount: number;
  /** 완료 시간 */
  completedAt: string;
}

/**
 * 도형(Shape) 정보 인터페이스
 */
export interface ShapeInfo {
  /** 도형 ID */
  id: string;
  /** 한국어 이름 */
  nameKo: string;
  /** 영어 이름 */
  nameEn: string;
  /** CSS 클래스 이름 */
  cssClass: string;
  /** 도형 색상 */
  color: string;
}
