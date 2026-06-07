// ============================================================
// 🏠 page.tsx - 홈 화면 (메인 페이지)
// ============================================================
// 아이들이 처음 보는 화면입니다!
// 이름 입력, 문제 유형/난이도/문제 수 선택, 시작 버튼이 있습니다.
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// 타입 import
import type {
  QuestionType,
  Difficulty,
  Language,
  QuizConfig,
} from '@/lib/types';
// 상수 import
import {
  QUESTION_TYPE_INFO,
  QUESTION_COUNT_OPTIONS,
} from '@/lib/constants';
// 다국어 텍스트 함수 import
import { t } from '@/lib/i18n';
// 효과음 import
import { playClickSound } from '@/lib/sounds';
// CSS Module import
import styles from './page.module.css';

/**
 * 7가지 문제 유형 목록
 * - constants.ts의 QUESTION_TYPE_INFO 키와 동일
 */
const QUESTION_TYPES: QuestionType[] = [
  'counting',
  'addition',
  'subtraction',
  'comparison',
  'shape',
  'sequence',
  'mixed',
];

/**
 * 3가지 난이도 목록
 */
const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

/**
 * 🏠 홈 화면 컴포넌트
 * 퀴즈를 시작하기 전에 옵션을 선택하는 화면
 */
export default function HomePage() {
  // Next.js 라우터 - 페이지 이동에 사용
  const router = useRouter();

  // --------------------------------------------------
  // 📦 상태(State) 관리
  // --------------------------------------------------

  /** 플레이어 이름 (선택적 입력) */
  const [playerName, setPlayerName] = useState<string>('');

  /** 선택된 문제 유형 (기본값: 숫자 세기) */
  const [questionType, setQuestionType] = useState<QuestionType>('counting');

  /** 선택된 난이도 (기본값: 쉬움) */
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  /** 문제 수 (기본값: 5문제) */
  const [questionCount, setQuestionCount] = useState<number>(5);

  /** 현재 언어 (기본값: 한국어) */
  const [language, setLanguage] = useState<Language>('ko');

  // --------------------------------------------------
  // 🔄 언어 설정 복원 (페이지 로드 시)
  // --------------------------------------------------
  useEffect(() => {
    // sessionStorage에 저장된 언어 설정이 있으면 복원
    const savedLang = sessionStorage.getItem('math_app_language');
    if (savedLang === 'ko' || savedLang === 'en') {
      setLanguage(savedLang);
    }
  }, []);

  // --------------------------------------------------
  // 🌐 언어 전환 함수
  // --------------------------------------------------
  /**
   * 언어를 한국어 ↔ 영어로 전환합니다.
   * 전환 후 sessionStorage에 저장하여 다른 페이지에서도 유지됩니다.
   */
  const toggleLanguage = () => {
    const newLang: Language = language === 'ko' ? 'en' : 'ko';
    setLanguage(newLang);
    sessionStorage.setItem('math_app_language', newLang);
    playClickSound();
  };

  // --------------------------------------------------
  // 🚀 퀴즈 시작 함수
  // --------------------------------------------------
  /**
   * 선택한 옵션들로 QuizConfig를 만들어
   * sessionStorage에 저장한 후 /quiz 페이지로 이동합니다.
   */
  const handleStart = () => {
    // QuizConfig 객체 생성
    const config: QuizConfig = {
      playerName: playerName.trim(),
      questionType,
      difficulty,
      questionCount,
    };

    // sessionStorage에 JSON 문자열로 저장
    // (페이지 간 데이터 전달 목적)
    sessionStorage.setItem('quiz_config', JSON.stringify(config));

    // 효과음 재생 후 퀴즈 페이지로 이동
    playClickSound();
    router.push('/quiz');
  };

  // --------------------------------------------------
  // 📊 기록 보기 함수
  // --------------------------------------------------
  /**
   * 학습 기록 페이지로 이동합니다.
   */
  const handleViewRecords = () => {
    playClickSound();
    router.push('/records');
  };

  // --------------------------------------------------
  // 🖥️ 화면 렌더링
  // --------------------------------------------------
  return (
    <div className={styles.container}>
      {/* 🌐 언어 전환 버튼 (상단 우측 고정) */}
      <button className={styles.langButton} onClick={toggleLanguage}>
        {t(language, 'common.lang')}
      </button>

      {/* 📦 메인 카드 (글래스모피즘) */}
      <div className={styles.mainCard}>
        {/* 🎯 제목 영역 */}
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{t(language, 'home.title')}</h1>
          <p className={styles.subtitle}>{t(language, 'home.subtitle')}</p>
        </div>

        {/* 👤 이름 입력 (선택적) */}
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

        {/* 🎮 문제 유형 선택 */}
        <div className={styles.typeSection}>
          <h2 className={styles.sectionTitle}>
            {t(language, 'home.selectType')}
          </h2>
          <div className={styles.typeGrid}>
            {QUESTION_TYPES.map((type) => {
              // 각 유형의 아이콘과 그라데이션 색상 가져오기
              const info = QUESTION_TYPE_INFO[type];
              const isSelected = questionType === type;

              return (
                <button
                  key={type}
                  className={`${styles.typeCard} ${isSelected ? styles.typeCardSelected : ''}`}
                  style={{
                    background: `linear-gradient(135deg, ${info.colorFrom}, ${info.colorTo})`,
                  }}
                  onClick={() => {
                    setQuestionType(type);
                    playClickSound();
                  }}
                >
                  {/* 문제 유형 이모지 */}
                  <span className={styles.typeEmoji}>{info.emoji}</span>
                  {/* 문제 유형 이름 */}
                  <span className={styles.typeName}>
                    {t(language, `type.${type}`)}
                  </span>
                  {/* 문제 유형 설명 */}
                  <span className={styles.typeDesc}>
                    {t(language, `type.${type}.desc`)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ⚡ 난이도 선택 */}
        <div className={styles.difficultySection}>
          <h2 className={styles.sectionTitle}>
            {t(language, 'home.selectDifficulty')}
          </h2>
          <div className={styles.buttonGroup}>
            {DIFFICULTIES.map((diff) => {
              const isSelected = difficulty === diff;
              return (
                <button
                  key={diff}
                  className={`${styles.difficultyButton} ${isSelected ? styles.difficultyButtonSelected : ''}`}
                  onClick={() => {
                    setDifficulty(diff);
                    playClickSound();
                  }}
                >
                  {t(language, `difficulty.${diff}`)}
                </button>
              );
            })}
          </div>
        </div>

        {/* 🔢 문제 수 선택 */}
        <div className={styles.countSection}>
          <h2 className={styles.sectionTitle}>
            {t(language, 'home.selectCount')}
          </h2>
          <div className={styles.buttonGroup}>
            {QUESTION_COUNT_OPTIONS.map((count) => {
              const isSelected = questionCount === count;
              return (
                <button
                  key={count}
                  className={`${styles.countButton} ${isSelected ? styles.countButtonSelected : ''}`}
                  onClick={() => {
                    setQuestionCount(count);
                    playClickSound();
                  }}
                >
                  {count}{t(language, 'common.questions')}
                </button>
              );
            })}
          </div>
        </div>

        {/* 🚀 시작 & 기록 보기 버튼 */}
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
