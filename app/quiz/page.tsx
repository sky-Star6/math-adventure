// ============================================================
// 🧩 quiz/page.tsx - 퀴즈(문제 풀이) 화면
// ============================================================
// 실제로 문제를 풀고 채점하는 핵심 페이지입니다.
// sessionStorage에서 QuizConfig를 읽어 문제를 생성하고,
// 답을 선택하면 정답/오답 피드백을 보여줍니다.
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
// 타입 import
import type {
  Question,
  Language,
  QuizConfig,
  QuizResult,
  AnswerRecord,
} from '@/lib/types';
// 문제 생성기 import
import { generateQuestions } from '@/lib/questionGenerator';
// 다국어 텍스트 import
import { t } from '@/lib/i18n';
// 효과음 import
import { playCorrectSound, playWrongSound } from '@/lib/sounds';
// 피드백 메시지 import
import { FEEDBACK_MESSAGES } from '@/lib/constants';
// 컴포넌트 import
import ProgressBar from '@/components/ProgressBar';
import FeedbackOverlay from '@/components/FeedbackOverlay';
import CountingQuestion from '@/components/CountingQuestion';
import AdditionQuestion from '@/components/AdditionQuestion';
import SubtractionQuestion from '@/components/SubtractionQuestion';
import ComparisonQuestion from '@/components/ComparisonQuestion';
import ShapeQuestion from '@/components/ShapeQuestion';
import SequenceQuestion from '@/components/SequenceQuestion';
// CSS Module import
import styles from './page.module.css';

/**
 * 🧩 퀴즈 화면 컴포넌트
 * 문제를 순서대로 보여주고, 답을 선택하면 채점합니다.
 */
export default function QuizPage() {
  // Next.js 라우터 - 페이지 이동에 사용
  const router = useRouter();

  // --------------------------------------------------
  // 📦 상태(State) 관리
  // --------------------------------------------------

  /** 퀴즈 설정 (sessionStorage에서 로드) */
  const [config, setConfig] = useState<QuizConfig | null>(null);

  /** 생성된 문제 배열 */
  const [questions, setQuestions] = useState<Question[]>([]);

  /** 현재 문제 인덱스 (0부터 시작) */
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  /** 답안 기록 배열 (채점 결과 저장용) */
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);

  /** 피드백 오버레이 표시 여부 */
  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  /** 현재 피드백이 정답인지 오답인지 */
  const [feedbackCorrect, setFeedbackCorrect] = useState<boolean>(false);

  /** 피드백 메시지 텍스트 */
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  /** 답변 비활성화 여부 (피드백 중에는 답 선택 불가) */
  const [disabled, setDisabled] = useState<boolean>(false);

  /** 현재 언어 설정 */
  const [language, setLanguage] = useState<Language>('ko');

  // --------------------------------------------------
  // 🔄 초기 로딩: sessionStorage에서 설정 복원
  // --------------------------------------------------
  useEffect(() => {
    // 언어 설정 복원
    const savedLang = sessionStorage.getItem('math_app_language');
    if (savedLang === 'ko' || savedLang === 'en') {
      setLanguage(savedLang);
    }

    // QuizConfig 복원
    const configStr = sessionStorage.getItem('quiz_config');
    if (!configStr) {
      // 설정이 없으면 홈으로 돌아가기
      router.push('/');
      return;
    }

    try {
      const loadedConfig: QuizConfig = JSON.parse(configStr);
      setConfig(loadedConfig);

      // 문제 생성
      const generatedQuestions = generateQuestions(
        loadedConfig.questionType,
        loadedConfig.difficulty,
        loadedConfig.questionCount
      );
      setQuestions(generatedQuestions);
    } catch {
      // JSON 파싱 실패 시 홈으로
      router.push('/');
    }
  }, [router]);

  // --------------------------------------------------
  // 🎯 답 선택 처리 함수
  // --------------------------------------------------
  /**
   * 사용자가 답을 선택했을 때 호출됩니다.
   * 1. 정답/오답 확인
   * 2. 효과음 재생
   * 3. 피드백 오버레이 표시
   * 4. 1.5초 후 다음 문제로 이동 (또는 결과 페이지로)
   */
  const handleAnswer = useCallback(
    (selectedAnswer: string) => {
      // 이미 답을 선택한 상태면 무시 (더블 클릭 방지)
      if (disabled || !questions.length) return;

      // 답변 선택 비활성화 (피드백 중 중복 선택 방지)
      setDisabled(true);

      // 현재 문제 가져오기
      const currentQuestion = questions[currentIndex];

      // 정답 여부 확인
      const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

      // 답안 기록 저장
      const newAnswer: AnswerRecord = {
        question: currentQuestion,
        selectedAnswer,
        isCorrect,
      };

      // 기존 답안 배열에 새 답안 추가
      const updatedAnswers = [...answers, newAnswer];
      setAnswers(updatedAnswers);

      // 효과음 재생
      if (isCorrect) {
        playCorrectSound();
      } else {
        playWrongSound();
      }

      // 피드백 메시지 랜덤 선택 (언어에 맞게)
      const messages = isCorrect
        ? FEEDBACK_MESSAGES.correct[language]
        : FEEDBACK_MESSAGES.wrong[language];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];

      // 피드백 오버레이 표시
      setFeedbackCorrect(isCorrect);
      setFeedbackMessage(randomMessage);
      setShowFeedback(true);
    },
    [disabled, questions, currentIndex, answers, language]
  );

  // --------------------------------------------------
  // ➡️ 피드백 완료 후 다음 문제로 이동
  // --------------------------------------------------
  /**
   * FeedbackOverlay의 onComplete 콜백으로 호출됩니다.
   * 피드백 애니메이션이 끝나면 다음 문제 또는 결과 화면으로 이동합니다.
   */
  const handleFeedbackComplete = useCallback(() => {
    setShowFeedback(false);
    setDisabled(false);

    const nextIndex = currentIndex + 1;

    // 마지막 문제인 경우 → 결과 화면으로 이동
    if (nextIndex >= questions.length && config) {
      // 최종 답안 배열 (현재 setAnswers에 의해 업데이트된 것이 아닌 로컬 계산)
      const finalAnswers = [...answers];
      // handleAnswer에서 이미 추가되었으므로 answers 상태는 최신
      // useCallback의 클로저 특성으로 인해 여기서는 업데이트된 answers를 사용합니다
      const correctCount = finalAnswers.filter((a) => a.isCorrect).length;

      // QuizResult 생성
      const result: QuizResult = {
        config,
        answers: finalAnswers,
        correctCount,
        totalCount: questions.length,
        score: Math.round((correctCount / questions.length) * 100),
        completedAt: new Date().toISOString(),
      };

      // sessionStorage에 결과 저장
      sessionStorage.setItem('quiz_result', JSON.stringify(result));

      // 결과 페이지로 이동
      router.push('/result');
    } else {
      // 다음 문제로 이동
      setCurrentIndex(nextIndex);
    }
  }, [currentIndex, questions, config, answers, router]);

  // --------------------------------------------------
  // 🖥️ 로딩 중이거나 설정이 없을 때
  // --------------------------------------------------
  if (!config || questions.length === 0) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingEmoji}>🧮</div>
        <div className={styles.loadingText}>
          {language === 'ko' ? '문제를 준비하고 있어요...' : 'Preparing questions...'}
        </div>
      </div>
    );
  }

  // 현재 문제 가져오기
  const currentQuestion = questions[currentIndex];

  // --------------------------------------------------
  // 🎮 문제 유형에 따른 컴포넌트 렌더링
  // --------------------------------------------------
  /**
   * 현재 문제 유형(type)에 맞는 질문 컴포넌트를 반환합니다.
   * 각 컴포넌트는 동일한 Props를 받습니다:
   * - question: 현재 문제 데이터
   * - onAnswer: 답 선택 콜백
   * - disabled: 답변 가능 여부
   * - lang: 현재 언어
   */
  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'counting':
        return (
          <CountingQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            disabled={disabled}
            lang={language}
          />
        );
      case 'addition':
        return (
          <AdditionQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            disabled={disabled}
            lang={language}
            difficulty={config.difficulty}
          />
        );
      case 'subtraction':
        return (
          <SubtractionQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            disabled={disabled}
            lang={language}
            difficulty={config.difficulty}
          />
        );
      case 'comparison':
        return (
          <ComparisonQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            disabled={disabled}
            lang={language}
          />
        );
      case 'shape':
        return (
          <ShapeQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            disabled={disabled}
            lang={language}
          />
        );
      case 'sequence':
        return (
          <SequenceQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            disabled={disabled}
            lang={language}
          />
        );
      default:
        return (
          <CountingQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            disabled={disabled}
            lang={language}
          />
        );
    }
  };

  // --------------------------------------------------
  // 🖥️ 화면 렌더링
  // --------------------------------------------------
  return (
    <div className={styles.container}>
      {/* 📊 상단: 진행 상황 표시 */}
      <div className={styles.header}>
        {/* 문제 번호 표시: "문제 1 / 5" */}
        <div className={styles.questionInfo}>
          {t(language, 'quiz.question')} {currentIndex + 1}{' '}
          {t(language, 'quiz.of')} {questions.length}
        </div>
        {/* 진행 바 */}
        <ProgressBar current={currentIndex + 1} total={questions.length} />
      </div>

      {/* 🎯 문제 카드 (유형에 맞는 컴포넌트 렌더링) */}
      {/* key를 사용하여 문제가 바뀔 때마다 애니메이션이 다시 재생되도록 함 */}
      <div className={styles.questionCard} key={currentIndex}>
        {renderQuestion()}
      </div>

      {/* 💬 정답/오답 피드백 오버레이 */}
      {showFeedback && (
        <FeedbackOverlay
          isCorrect={feedbackCorrect}
          message={feedbackMessage}
          onComplete={handleFeedbackComplete}
        />
      )}
    </div>
  );
}
