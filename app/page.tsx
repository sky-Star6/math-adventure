// ============================================================
// 🏠 app/page.tsx - 홈 화면 (메인 페이지)
// ============================================================
// 아이들이 앱을 켰을 때 가장 먼저 마주하는 홈 화면입니다.
// 이름 입력, 문제 유형 선택, 레벨(난이도) 선택, 문제 수 선택,
// 그리고 시작하기 버튼으로 구성되어 있습니다.
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// 타입(Type) 정의 가져오기
import type {
  QuestionType,
  Difficulty,
  Language,
  QuizConfig,
} from '@/lib/types';
// 상수(Constants) 정의 가져오기
import {
  QUESTION_TYPE_INFO,
  QUESTION_COUNT_OPTIONS,
} from '@/lib/constants';
// 다국어(i18n, Internationalization) 텍스트 함수 가져오기
import { t } from '@/lib/i18n';
// 효과음(Sound Effect) 함수 가져오기
import { playClickSound } from '@/lib/sounds';
// CSS 모듈(CSS Module) 가져오기
import styles from './page.module.css';

/**
 * 제공되는 8가지 문제 유형(Question Type) 목록
 * - 숫자 세기, 덧셈, 뺄셈, 곱셈, 크기 비교, 모양 인식, 순서 맞추기, 혼합 모드
 */
const QUESTION_TYPES: QuestionType[] = [
  'counting',
  'addition',
  'subtraction',
  'multiplication',
  'comparison',
  'shape',
  'sequence',
  'mixed',
];

/**
 * 3가지 레벨(Level / Difficulty) 목록
 * - easy: 레벨 1
 * - medium: 레벨 2
 * - hard: 레벨 3
 */
const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

/**
 * 홈 페이지 메인 컴포넌트(Component)
 */
export default function HomePage() {
  // Next.js 라우터(Router) - 페이지 이동에 사용
  const router = useRouter();

  // --------------------------------------------------
  // 📦 상태 관리 (State Management)
  // --------------------------------------------------

  /** 플레이어 이름 (선택적 입력) */
  const [playerName, setPlayerName] = useState<string>('');

  /** 선택된 문제 유형 (기본값: 숫자 세기) */
  const [questionType, setQuestionType] = useState<QuestionType>('counting');

  /** 선택된 레벨/난이도 (기본값: easy = 레벨 1) */
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  /** 문제 개수 (기본값: 5문제) */
  const [questionCount, setQuestionCount] = useState<number>(5);

  /** 현재 표시 언어 (기본값: 한국어 'ko') */
  const [language, setLanguage] = useState<Language>('ko');

  // --------------------------------------------------
  // 🔄 언어 설정 복원 (페이지 최초 로드 시)
  // --------------------------------------------------
  useEffect(() => {
    // 세션 저장소(sessionStorage)에 저장된 언어 설정이 있다면 복원
    const savedLang = sessionStorage.getItem('math_app_language');
    if (savedLang === 'ko' || savedLang === 'en') {
      setLanguage(savedLang);
    }
  }, []);

  // --------------------------------------------------
  // 🌐 언어 전환 함수
  // --------------------------------------------------
  /**
   * 한국어(ko)와 영어(en)를 상호 전환합니다.
   */
  const toggleLanguage = () => {
    const newLang: Language = language === 'ko' ? 'en' : 'ko';
    setLanguage(newLang);
    sessionStorage.setItem('math_app_language', newLang);
    playClickSound();
  };

  // --------------------------------------------------
  // ◀ ▶ 레벨(난이도) 세모 버튼 핸들러
  // --------------------------------------------------
  /**
   * 이전 레벨(더 쉬운 레벨)로 이동하는 함수
   */
  const handlePrevDifficulty = () => {
    const currentIndex = DIFFICULTIES.indexOf(difficulty);
    if (currentIndex > 0) {
      setDifficulty(DIFFICULTIES[currentIndex - 1]);
      playClickSound();
    }
  };

  /**
   * 다음 레벨(더 높은 레벨)로 이동하는 함수
   */
  const handleNextDifficulty = () => {
    const currentIndex = DIFFICULTIES.indexOf(difficulty);
    if (currentIndex < DIFFICULTIES.length - 1) {
      setDifficulty(DIFFICULTIES[currentIndex + 1]);
      playClickSound();
    }
  };

  // --------------------------------------------------
  // ◀ ▶ 문제 수 세모 버튼 핸들러
  // --------------------------------------------------
  /**
   * 이전 문제 수(더 적은 문제 수)로 이동하는 함수
   */
  const handlePrevCount = () => {
    const currentIndex = QUESTION_COUNT_OPTIONS.indexOf(questionCount);
    if (currentIndex > 0) {
      setQuestionCount(QUESTION_COUNT_OPTIONS[currentIndex - 1]);
      playClickSound();
    }
  };

  /**
   * 다음 문제 수(더 많은 문제 수)로 이동하는 함수
   */
  const handleNextCount = () => {
    const currentIndex = QUESTION_COUNT_OPTIONS.indexOf(questionCount);
    if (currentIndex < QUESTION_COUNT_OPTIONS.length - 1) {
      setQuestionCount(QUESTION_COUNT_OPTIONS[currentIndex + 1]);
      playClickSound();
    }
  };

  // --------------------------------------------------
  // 🚀 퀴즈 시작 함수
  // --------------------------------------------------
  /**
   * 선택된 옵션들을 묶어서 퀴즈 설정(QuizConfig) 객체를 생성하고,
   * 세션 저장소(sessionStorage)에 저장한 뒤 퀴즈 페이지(/quiz)로 이동합니다.
   */
  const handleStart = () => {
    const config: QuizConfig = {
      playerName: playerName.trim(),
      questionType,
      difficulty,
      questionCount,
    };

    // 페이지 간 데이터 전달을 위해 세션 저장소에 직렬화(JSON)하여 저장
    sessionStorage.setItem('quiz_config', JSON.stringify(config));

    // 클릭 효과음 재생 후 페이지 이동
    playClickSound();
    router.push('/quiz');
  };

  // --------------------------------------------------
  // 📊 학습 기록 페이지 이동 함수
  // --------------------------------------------------
  const handleViewRecords = () => {
    playClickSound();
    router.push('/records');
  };

  // --------------------------------------------------
  // 🖥️ UI 렌더링
  // --------------------------------------------------
  return (
    <div className={styles.container}>
      {/* 🌐 언어 전환 버튼 (상단 우측 고정) */}
      <button className={styles.langButton} onClick={toggleLanguage}>
        {t(language, 'common.lang')}
      </button>

      {/* 📱 메인 카드 컨테이너 */}
      <div className={styles.mainCard}>
        {/* 🏷️ 앱 제목 영역 */}
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{t(language, 'home.title')}</h1>
          <p className={styles.subtitle}>{t(language, 'home.subtitle')}</p>
        </div>

        {/* ✏️ 이름 입력 영역 (선택사항) */}
        <div className={styles.nameSection}>
          <label className={styles.nameLabel} htmlFor="playerName">
            {t(language, 'home.nameLabel')}
          </label>
          <input
            id="playerName"
            className={styles.nameInput}
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder={t(language, 'home.namePlaceholder')}
            maxLength={20}
          />
        </div>

        {/* 🧩 문제 유형 선택 그리드 */}
        <div className={styles.typeSection}>
          <h2 className={styles.sectionTitle}>
            {t(language, 'home.selectType')}
          </h2>
          <div className={styles.typeGrid}>
            {QUESTION_TYPES.map((type) => {
              const info = QUESTION_TYPE_INFO[type];
              const isSelected = questionType === type;

              return (
                <button
                  key={type}
                  className={`${styles.typeCard} ${isSelected ? styles.typeCardSelected : ''}`}
                  style={{
                    backgroundColor: isSelected ? info.colorFrom : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : 'var(--color-text)',
                    borderColor: isSelected ? info.colorFrom : 'transparent',
                  }}
                  onClick={() => {
                    setQuestionType(type);
                    playClickSound();
                  }}
                >
                  <span className={styles.typeEmoji}>{info.emoji}</span>
                  <span className={styles.typeName}>
                    {t(language, `type.${type}`)}
                  </span>
                  <span className={styles.typeDesc}>
                    {t(language, `type.${type}.desc`)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 🎚️ 레벨(난이도) 선택 - 좌우 세모(◀, ▶) 버튼 */}
        <div className={styles.stepperSection}>
          <h2 className={styles.sectionTitle}>
            {t(language, 'home.selectDifficulty')}
          </h2>
          <div className={styles.stepperContainer}>
            {/* 왼쪽 세모(◀) 버튼 */}
            <button
              type="button"
              className={`${styles.stepperArrow} ${styles.stepperArrowDifficulty}`}
              onClick={handlePrevDifficulty}
              disabled={DIFFICULTIES.indexOf(difficulty) === 0}
              aria-label="이전 레벨"
            >
              <svg className={styles.triangleIcon} viewBox="0 0 24 24">
                <polygon points="16,5 7,12 16,19" />
              </svg>
            </button>

            {/* 현재 레벨 표시 카드 */}
            <div className={`${styles.stepperCard} ${styles.stepperCardDifficulty}`}>
              <span className={styles.stepperCardValue}>
                {t(language, `difficulty.${difficulty}`)}
              </span>
              <span className={styles.stepperCardSub}>
                {difficulty === 'easy' && (language === 'ko' ? '기초 다지기 (숫자 1~5)' : 'Basic (1~5)')}
                {difficulty === 'medium' && (language === 'ko' ? '실력 쑥쑥 (숫자 1~10)' : 'Intermediate (1~10)')}
                {difficulty === 'hard' && (language === 'ko' ? '도전 문제 (식만 풀기)' : 'Challenge (Equations only)')}
              </span>
            </div>

            {/* 오른쪽 세모(▶) 버튼 */}
            <button
              type="button"
              className={`${styles.stepperArrow} ${styles.stepperArrowDifficulty}`}
              onClick={handleNextDifficulty}
              disabled={DIFFICULTIES.indexOf(difficulty) === DIFFICULTIES.length - 1}
              aria-label="다음 레벨"
            >
              <svg className={styles.triangleIcon} viewBox="0 0 24 24">
                <polygon points="8,5 17,12 8,19" />
              </svg>
            </button>
          </div>

          {/* 레벨 인디케이터 도트 */}
          <div className={styles.stepperDots}>
            {DIFFICULTIES.map((diff) => (
              <span
                key={diff}
                className={`${styles.stepperDot} ${difficulty === diff ? styles.stepperDotActive : ''}`}
              />
            ))}
          </div>
        </div>

        {/* 🔢 문제 개수 선택 - 좌우 세모(◀, ▶) 버튼 */}
        <div className={styles.stepperSection}>
          <h2 className={styles.sectionTitle}>
            {t(language, 'home.selectCount')}
          </h2>
          <div className={styles.stepperContainer}>
            {/* 왼쪽 세모(◀) 버튼 */}
            <button
              type="button"
              className={`${styles.stepperArrow} ${styles.stepperArrowCount}`}
              onClick={handlePrevCount}
              disabled={QUESTION_COUNT_OPTIONS.indexOf(questionCount) === 0}
              aria-label="문제 수 줄이기"
            >
              <svg className={styles.triangleIcon} viewBox="0 0 24 24">
                <polygon points="16,5 7,12 16,19" />
              </svg>
            </button>

            {/* 현재 문제 수 표시 카드 */}
            <div className={`${styles.stepperCard} ${styles.stepperCardCount}`}>
              <span className={styles.stepperCardValue}>
                {questionCount}{t(language, 'common.questions')}
              </span>
              <span className={styles.stepperCardSub}>
                {questionCount === 5 && (language === 'ko' ? '가볍게 한 판! ⏱️' : 'Quick round! ⏱️')}
                {questionCount === 10 && (language === 'ko' ? '추천 문제 수! 👍' : 'Recommended! 👍')}
                {questionCount === 15 && (language === 'ko' ? '집중해서 풀기! 🎯' : 'Focus round! 🎯')}
                {questionCount === 20 && (language === 'ko' ? '수학 마스터 도전! 🏆' : 'Master challenge! 🏆')}
              </span>
            </div>

            {/* 오른쪽 세모(▶) 버튼 */}
            <button
              type="button"
              className={`${styles.stepperArrow} ${styles.stepperArrowCount}`}
              onClick={handleNextCount}
              disabled={QUESTION_COUNT_OPTIONS.indexOf(questionCount) === QUESTION_COUNT_OPTIONS.length - 1}
              aria-label="문제 수 늘리기"
            >
              <svg className={styles.triangleIcon} viewBox="0 0 24 24">
                <polygon points="8,5 17,12 8,19" />
              </svg>
            </button>
          </div>

          {/* 문제 수 인디케이터 도트 */}
          <div className={styles.stepperDots}>
            {QUESTION_COUNT_OPTIONS.map((count) => (
              <span
                key={count}
                className={`${styles.stepperDot} ${styles.stepperDotCount} ${questionCount === count ? styles.stepperDotCountActive : ''}`}
              />
            ))}
          </div>
        </div>

        {/* 🚀 시작하기 및 기록 보기 버튼 영역 */}
        <div className={styles.startSection}>
          <button className={styles.startButton} onClick={handleStart}>
            {t(language, 'home.startButton')}
          </button>
          <button className={styles.recordsButton} onClick={handleViewRecords}>
            {t(language, 'home.records')}
          </button>
        </div>
      </div>
    </div>
  );
}
