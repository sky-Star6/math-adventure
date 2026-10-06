// ============================================================
// 🌐 i18n.ts - 다국어 텍스트 (한국어/영어 전환)
// ============================================================

import { Language } from './types';

/**
 * 다국어 텍스트 사전(Dictionary)
 * 앱에서 사용하는 모든 텍스트를 한국어/영어로 정의
 */
const translations: Record<Language, Record<string, string>> = {
  ko: {
    // === 홈 화면 ===
    'home.title': '🧮 수학 모험!',
    'home.subtitle': '재미있는 수학 문제를 풀어봐요!',
    'home.nameLabel': '이름을 알려줘! (안 써도 돼요)',
    'home.namePlaceholder': '이름을 입력하세요',
    'home.selectType': '어떤 문제를 풀래?',
    'home.selectDifficulty': '나이를 골라봐!',
    'home.selectCount': '몇 문제 풀래?',
    'home.startButton': '🚀 시작하기!',
    'home.records': '📊 기록 보기',

    // === 문제 유형 이름 ===
    'type.counting': '숫자 세기',
    'type.addition': '덧셈',
    'type.subtraction': '뺄셈',
    'type.comparison': '크기 비교',
    'type.shape': '모양 인식',
    'type.sequence': '순서 맞추기',
    'type.mixed': '혼합 모드',

    // === 문제 유형 설명 ===
    'type.counting.desc': '귀여운 그림의 개수를 세어봐요!',
    'type.addition.desc': '두 수를 더해봐요!',
    'type.subtraction.desc': '두 수를 빼봐요!',
    'type.comparison.desc': '어떤 수가 더 큰지 비교해요!',
    'type.shape.desc': '도형의 이름을 맞춰봐요!',
    'type.sequence.desc': '빈칸에 들어갈 수를 찾아요!',
    'type.mixed.desc': '여러 가지 문제를 섞어서 풀어요!',

    // === 난이도 (연령별) ===
    'difficulty.easy': '🌱 5~6세',
    'difficulty.medium': '🌿 7세',
    'difficulty.hard': '🌳 8세 (초1)',

    // === 퀴즈 화면 ===
    'quiz.question': '문제',
    'quiz.of': '/',
    'quiz.counting.question': '그림이 몇 개일까요?',
    'quiz.addition.question': '답은 무엇일까요?',
    'quiz.subtraction.question': '답은 무엇일까요?',
    'quiz.comparison.question': '어떤 것이 맞을까요?',
    'quiz.shape.question': '이 도형의 이름은 무엇일까요?',
    'quiz.sequence.question': '빈칸(?)에 들어갈 숫자는?',

    // === 결과 화면 ===
    'result.title': '📝 채점 결과',
    'result.score': '점',
    'result.correct': '맞은 문제',
    'result.wrong': '틀린 문제',
    'result.review': '오답 확인',
    'result.yourAnswer': '내 답',
    'result.correctAnswer': '정답',
    'result.retry': '🔄 다시 풀기',
    'result.home': '🏠 홈으로',
    'result.different': '📝 다른 문제 풀기',

    // === 기록 화면 ===
    'records.title': '📊 학습 기록',
    'records.empty': '아직 기록이 없어요! 문제를 풀어봐요!',
    'records.clear': '🗑️ 기록 삭제',
    'records.clearConfirm': '정말 모든 기록을 삭제할까요?',
    'records.date': '날짜',
    'records.back': '← 돌아가기',

    // === 공통 ===
    'common.questions': '문제',
    'common.lang': '🌐 English',
  },
  en: {
    // === Home Screen ===
    'home.title': '🧮 Math Adventure!',
    'home.subtitle': 'Let\'s solve fun math problems!',
    'home.nameLabel': 'What\'s your name? (optional)',
    'home.namePlaceholder': 'Enter your name',
    'home.selectType': 'Choose a problem type!',
    'home.selectDifficulty': 'Pick an age!',
    'home.selectCount': 'How many problems?',
    'home.startButton': '🚀 Start!',
    'home.records': '📊 View Records',

    // === Question Type Names ===
    'type.counting': 'Counting',
    'type.addition': 'Addition',
    'type.subtraction': 'Subtraction',
    'type.comparison': 'Comparison',
    'type.shape': 'Shapes',
    'type.sequence': 'Sequence',
    'type.mixed': 'Mixed Mode',

    // === Question Type Descriptions ===
    'type.counting.desc': 'Count the cute pictures!',
    'type.addition.desc': 'Add two numbers!',
    'type.subtraction.desc': 'Subtract two numbers!',
    'type.comparison.desc': 'Compare which is bigger!',
    'type.shape.desc': 'Name the shapes!',
    'type.sequence.desc': 'Find the missing number!',
    'type.mixed.desc': 'Solve all kinds of problems!',

    // === Difficulty (By Age) ===
    'difficulty.easy': '🌱 Ages 5-6',
    'difficulty.medium': '🌿 Age 7',
    'difficulty.hard': '🌳 Age 8 (Grade 1)',

    // === Quiz Screen ===
    'quiz.question': 'Question',
    'quiz.of': '/',
    'quiz.counting.question': 'How many are there?',
    'quiz.addition.question': 'What is the answer?',
    'quiz.subtraction.question': 'What is the answer?',
    'quiz.comparison.question': 'Which one is correct?',
    'quiz.shape.question': 'What is this shape called?',
    'quiz.sequence.question': 'What number goes in the blank (?)?',

    // === Result Screen ===
    'result.title': '📝 Results',
    'result.score': 'pts',
    'result.correct': 'Correct',
    'result.wrong': 'Wrong',
    'result.review': 'Review Mistakes',
    'result.yourAnswer': 'Your Answer',
    'result.correctAnswer': 'Correct Answer',
    'result.retry': '🔄 Try Again',
    'result.home': '🏠 Home',
    'result.different': '📝 Different Problems',

    // === Records Screen ===
    'records.title': '📊 Study Records',
    'records.empty': 'No records yet! Solve some problems!',
    'records.clear': '🗑️ Clear Records',
    'records.clearConfirm': 'Are you sure you want to delete all records?',
    'records.date': 'Date',
    'records.back': '← Go Back',

    // === Common ===
    'common.questions': 'Questions',
    'common.lang': '🌐 한국어',
  },
};

/**
 * 다국어 텍스트를 가져오는 함수
 * @param lang - 현재 선택된 언어 ('ko' | 'en')
 * @param key - 텍스트 키 (예: 'home.title')
 * @returns 해당 언어의 텍스트 문자열
 */
export function t(lang: Language, key: string): string {
  return translations[lang]?.[key] || key;
}

/**
 * 모든 번역 데이터를 반환
 */
export function getTranslations(lang: Language): Record<string, string> {
  return translations[lang];
}
