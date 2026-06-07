// ============================================================
// 🏆 result/page.tsx - 채점 결과 화면
// ============================================================
// 퀴즈를 다 풀고 난 뒤 점수, 메달, 오답 리뷰를 보여주는 페이지입니다.
// sessionStorage에서 QuizResult를 읽어오고,
// localStorage에 학습 기록을 저장합니다.
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
// 타입 import
import type { QuizResult, Language } from '@/lib/types';
// 상수 import
import { SCORE_GRADES, QUESTION_TYPE_INFO, SHAPES } from '@/lib/constants';
// 다국어 텍스트 import
import { t } from '@/lib/i18n';
// 저장소 import
import { saveStudyRecord } from '@/lib/storage';
// 효과음 import
import { playCompleteSound, playClickSound } from '@/lib/sounds';
// CSS Module import
import styles from './page.module.css';

/**
 * 축하 이모지 목록 (결과 화면 배경에 떨어지는 효과)
 */
const CONFETTI_EMOJIS = ['🎉', '🎊', '⭐', '✨', '🌟', '💫', '🎈', '🎀', '🌈', '💎'];

/**
 * 문제 요약 텍스트를 생성하는 헬퍼 함수
 * 각 문제 유형에 맞게 간단한 요약 문자열을 만듭니다.
 */
function getQuestionSummary(
  question: QuizResult['answers'][0]['question'],
  lang: Language
): string {
  const { type, visualData } = question;

  switch (type) {
    case 'counting':
      // 숫자 세기: "🍎 × 3개" 형태
      return `${visualData.emoji || '🍎'} × ${visualData.count || '?'}${lang === 'ko' ? '개' : ''}`;
    case 'addition':
      // 덧셈: "3 + 5 = ?" 형태
      return `${visualData.num1} + ${visualData.num2} = ?`;
    case 'subtraction':
      // 뺄셈: "8 - 3 = ?" 형태
      return `${visualData.num1} - ${visualData.num2} = ?`;
    case 'comparison':
      // 크기 비교: "5 ? 3" 형태
      return `${visualData.leftNum} ? ${visualData.rightNum}`;
    case 'shape': {
      // 도형: 도형 이름 표시
      const shapeInfo = SHAPES.find((s) => s.id === visualData.shapeName);
      return `${QUESTION_TYPE_INFO.shape.emoji} ${shapeInfo ? (lang === 'ko' ? shapeInfo.nameKo : shapeInfo.nameEn) : visualData.shapeName}`;
    }
    case 'sequence': {
      // 순서: "1, 2, ?, 4, 5" 형태
      if (visualData.numberSequence) {
        return visualData.numberSequence
          .map((n) => (n === null ? '?' : String(n)))
          .join(', ');
      }
      return '?, ?, ?';
    }
    default:
      return lang === 'ko' ? '문제' : 'Question';
  }
}

/**
 * 답 표시용 텍스트를 반환하는 헬퍼 함수
 * shape 문제는 도형 ID를 이름으로 변환합니다.
 */
function getDisplayAnswer(
  answer: string,
  questionType: string,
  lang: Language
): string {
  if (questionType === 'shape') {
    const shapeInfo = SHAPES.find((s) => s.id === answer);
    if (shapeInfo) {
      return lang === 'ko' ? shapeInfo.nameKo : shapeInfo.nameEn;
    }
  }
  return answer;
}

/**
 * 🏆 결과 화면 컴포넌트
 * 점수, 메달, 등급 메시지, 오답 리뷰를 표시합니다.
 */
export default function ResultPage() {
  // Next.js 라우터
  const router = useRouter();

  // --------------------------------------------------
  // 📦 상태 관리
  // --------------------------------------------------

  /** 퀴즈 결과 데이터 */
  const [result, setResult] = useState<QuizResult | null>(null);

  /** 현재 언어 */
  const [language, setLanguage] = useState<Language>('ko');

  /** 축하 이모지 위치 배열 (배경 효과용) */
  const [confettiItems, setConfettiItems] = useState<
    { id: number; emoji: string; left: number; delay: number }[]
  >([]);

  /** 학습 기록 저장 여부 (중복 저장 방지) */
  const savedRef = useRef(false);

  // --------------------------------------------------
  // 🔄 초기 로딩: sessionStorage에서 결과 복원
  // --------------------------------------------------
  useEffect(() => {
    // 언어 복원
    const savedLang = sessionStorage.getItem('math_app_language');
    if (savedLang === 'ko' || savedLang === 'en') {
      setLanguage(savedLang);
    }

    // QuizResult 복원
    const resultStr = sessionStorage.getItem('quiz_result');
    if (!resultStr) {
      router.push('/');
      return;
    }

    try {
      const loadedResult: QuizResult = JSON.parse(resultStr);
      setResult(loadedResult);

      // 학습 기록 저장 (한 번만)
      if (!savedRef.current) {
        savedRef.current = true;
        saveStudyRecord(loadedResult);
      }

      // 축하 효과음 재생
      playCompleteSound();

      // 축하 이모지 배경 효과 생성
      const items = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        emoji: CONFETTI_EMOJIS[Math.floor(Math.random() * CONFETTI_EMOJIS.length)],
        left: Math.random() * 100, // 가로 위치 (0~100%)
        delay: Math.random() * 3, // 애니메이션 딜레이 (0~3초)
      }));
      setConfettiItems(items);
    } catch {
      router.push('/');
    }
  }, [router]);

  // --------------------------------------------------
  // 🔄 다시 풀기 (같은 설정으로)
  // --------------------------------------------------
  const handleRetry = () => {
    playClickSound();
    // config가 아직 sessionStorage에 있으므로 그대로 /quiz로 이동
    router.push('/quiz');
  };

  // --------------------------------------------------
  // 🏠 홈으로 이동
  // --------------------------------------------------
  const handleGoHome = () => {
    playClickSound();
    router.push('/');
  };

  // --------------------------------------------------
  // 📝 다른 문제 풀기 (홈으로 가서 새 설정)
  // --------------------------------------------------
  const handleDifferent = () => {
    playClickSound();
    router.push('/');
  };

  // --------------------------------------------------
  // ⏳ 로딩 중
  // --------------------------------------------------
  if (!result) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingEmoji}>📝</div>
        <div className={styles.loadingText}>
          {language === 'ko' ? '결과를 확인하고 있어요...' : 'Checking results...'}
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // 🏅 등급 결정 (SCORE_GRADES에서 찾기)
  // --------------------------------------------------
  const grade = SCORE_GRADES.find((g) => result.score >= g.minScore) || SCORE_GRADES[SCORE_GRADES.length - 1];

  // 오답 목록 필터링
  const wrongAnswers = result.answers.filter((a) => !a.isCorrect);

  // --------------------------------------------------
  // 🖥️ 화면 렌더링
  // --------------------------------------------------
  return (
    <div className={styles.container}>
      {/* 🎊 축하 배경 이모지 (떨어지는 애니메이션) */}
      {confettiItems.map((item) => (
        <span
          key={item.id}
          className={styles.confettiItem}
          style={{
            left: `${item.left}%`,
            animationDelay: `${item.delay}s`,
          }}
        >
          {item.emoji}
        </span>
      ))}

      {/* 📦 결과 카드 */}
      <div className={styles.resultCard}>
        {/* 🏅 점수 섹션 */}
        <div className={styles.scoreSection}>
          {/* 메달 이모지 */}
          <span className={styles.medal}>{grade.medal}</span>

          {/* 원형 점수 표시 */}
          <div className={styles.scoreCircle}>
            <div className={styles.scoreInner}>
              <span className={styles.scoreNumber}>{result.score}</span>
              <span className={styles.scoreUnit}>{t(language, 'result.score')}</span>
            </div>
          </div>

          {/* 등급 메시지 */}
          <div className={styles.gradeMessage}>
            {language === 'ko' ? grade.messageKo : grade.messageEn}
          </div>
        </div>

        {/* 📊 정답/오답 요약 */}
        <div className={styles.summarySection}>
          {/* 정답 개수 */}
          <div className={`${styles.summaryItem} ${styles.summaryCorrect}`}>
            <span className={`${styles.summaryCount} ${styles.summaryCountCorrect}`}>
              {result.correctCount}
            </span>
            <span className={styles.summaryLabel}>
              {t(language, 'result.correct')}
            </span>
          </div>

          {/* 오답 개수 */}
          <div className={`${styles.summaryItem} ${styles.summaryWrong}`}>
            <span className={`${styles.summaryCount} ${styles.summaryCountWrong}`}>
              {result.totalCount - result.correctCount}
            </span>
            <span className={styles.summaryLabel}>
              {t(language, 'result.wrong')}
            </span>
          </div>
        </div>

        {/* 📝 오답 리뷰 (오답이 있을 때만 표시) */}
        {wrongAnswers.length > 0 && (
          <div className={styles.reviewSection}>
            <h2 className={styles.reviewTitle}>
              {t(language, 'result.review')}
            </h2>
            <div className={styles.reviewList}>
              {wrongAnswers.map((record, index) => (
                <div key={index} className={styles.reviewCard}>
                  {/* 문제 요약 */}
                  <div className={styles.reviewQuestion}>
                    {`${index + 1}. `}
                    {getQuestionSummary(record.question, language)}
                  </div>
                  {/* 내 답 vs 정답 */}
                  <div className={styles.reviewAnswers}>
                    <span className={styles.reviewMyAnswer}>
                      {t(language, 'result.yourAnswer')}:{' '}
                      {getDisplayAnswer(record.selectedAnswer, record.question.type, language)}
                    </span>
                    <span className={styles.reviewCorrectAnswer}>
                      {t(language, 'result.correctAnswer')}:{' '}
                      {getDisplayAnswer(record.question.correctAnswer, record.question.type, language)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🔘 하단 버튼들 */}
        <div className={styles.buttonSection}>
          {/* 다시 풀기 */}
          <button className={styles.retryButton} onClick={handleRetry}>
            {t(language, 'result.retry')}
          </button>
          {/* 다른 문제 풀기 */}
          <button className={styles.differentButton} onClick={handleDifferent}>
            {t(language, 'result.different')}
          </button>
          {/* 홈으로 */}
          <button className={styles.homeButton} onClick={handleGoHome}>
            {t(language, 'result.home')}
          </button>
        </div>
      </div>
    </div>
  );
}
