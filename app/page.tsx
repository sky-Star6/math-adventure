// ============================================================
// ?룧 page.tsx - ???붾㈃ (硫붿씤 ?섏씠吏)
// ============================================================
// ?꾩씠?ㅼ씠 泥섏쓬 蹂대뒗 ?붾㈃?낅땲??
// ?대쫫 ?낅젰, 臾몄젣 ?좏삎/?쒖씠??臾몄젣 ???좏깮, ?쒖옉 踰꾪듉???덉뒿?덈떎.
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// ???import
import type {
  QuestionType,
  Difficulty,
  Language,
  QuizConfig,
} from '@/lib/types';
// ?곸닔 import
import {
  QUESTION_TYPE_INFO,
  QUESTION_COUNT_OPTIONS,
} from '@/lib/constants';
// ?ㅺ뎅???띿뒪???⑥닔 import
import { t } from '@/lib/i18n';
// ?④낵??import
import { playClickSound } from '@/lib/sounds';
// CSS Module import
import styles from './page.module.css';

/**
 * 7媛吏 臾몄젣 ?좏삎 紐⑸줉
 * - constants.ts??QUESTION_TYPE_INFO ?ㅼ? ?숈씪
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
 * 3媛吏 ?쒖씠??紐⑸줉
 */
const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

/**
 * ?룧 ???붾㈃ 而댄룷?뚰듃
 * ?댁쫰瑜??쒖옉?섍린 ?꾩뿉 ?듭뀡???좏깮?섎뒗 ?붾㈃
 */
export default function HomePage() {
  // Next.js ?쇱슦??- ?섏씠吏 ?대룞???ъ슜
  const router = useRouter();

  // --------------------------------------------------
  // ?벀 ?곹깭(State) 愿由?
  // --------------------------------------------------

  /** ?뚮젅?댁뼱 ?대쫫 (?좏깮???낅젰) */
  const [playerName, setPlayerName] = useState<string>('');

  /** ?좏깮??臾몄젣 ?좏삎 (湲곕낯媛? ?レ옄 ?멸린) */
  const [questionType, setQuestionType] = useState<QuestionType>('counting');

  /** ?좏깮???쒖씠??(湲곕낯媛? ?ъ?) */
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  /** 臾몄젣 ??(湲곕낯媛? 5臾몄젣) */
  const [questionCount, setQuestionCount] = useState<number>(5);

  /** ?꾩옱 ?몄뼱 (湲곕낯媛? ?쒓뎅?? */
  const [language, setLanguage] = useState<Language>('ko');

  // --------------------------------------------------
  // ?봽 ?몄뼱 ?ㅼ젙 蹂듭썝 (?섏씠吏 濡쒕뱶 ??
  // --------------------------------------------------
  useEffect(() => {
    // sessionStorage????λ맂 ?몄뼱 ?ㅼ젙???덉쑝硫?蹂듭썝
    const savedLang = sessionStorage.getItem('math_app_language');
    if (savedLang === 'ko' || savedLang === 'en') {
      setLanguage(savedLang);
    }
  }, []);

  // --------------------------------------------------
  // ?뙋 ?몄뼱 ?꾪솚 ?⑥닔
  // --------------------------------------------------
  /**
   * ?몄뼱瑜??쒓뎅?????곸뼱濡??꾪솚?⑸땲??
   * ?꾪솚 ??sessionStorage????ν븯???ㅻⅨ ?섏씠吏?먯꽌???좎??⑸땲??
   */
  const toggleLanguage = () => {
    const newLang: Language = language === 'ko' ? 'en' : 'ko';
    setLanguage(newLang);
    sessionStorage.setItem('math_app_language', newLang);
    playClickSound();
  };

  // --------------------------------------------------
  // ?? ?댁쫰 ?쒖옉 ?⑥닔
  // --------------------------------------------------
  /**
   * ?좏깮???듭뀡?ㅻ줈 QuizConfig瑜?留뚮뱾??
   * sessionStorage????ν븳 ??/quiz ?섏씠吏濡??대룞?⑸땲??
   */
  const handleStart = () => {
    // QuizConfig 媛앹껜 ?앹꽦
    const config: QuizConfig = {
      playerName: playerName.trim(),
      questionType,
      difficulty,
      questionCount,
    };

    // sessionStorage??JSON 臾몄옄?대줈 ???
    // (?섏씠吏 媛??곗씠???꾨떖 紐⑹쟻)
    sessionStorage.setItem('quiz_config', JSON.stringify(config));

    // ?④낵???ъ깮 ???댁쫰 ?섏씠吏濡??대룞
    playClickSound();
    router.push('/quiz');
  };

  // --------------------------------------------------
  // ?뱤 湲곕줉 蹂닿린 ?⑥닔
  // --------------------------------------------------
  /**
   * ?숈뒿 湲곕줉 ?섏씠吏濡??대룞?⑸땲??
   */
  const handleViewRecords = () => {
    playClickSound();
    router.push('/records');
  };

  // --------------------------------------------------
  // ?뼢截??붾㈃ ?뚮뜑留?
  // --------------------------------------------------
  return (
    <div className={styles.container}>
      {/* ?뙋 ?몄뼱 ?꾪솚 踰꾪듉 (?곷떒 ?곗륫 怨좎젙) */}
      <button className={styles.langButton} onClick={toggleLanguage}>
        {t(language, 'common.lang')}
      </button>

      {/* ?벀 硫붿씤 移대뱶 (湲?섏뒪紐⑦뵾利? */}
      <div className={styles.mainCard}>
        {/* ?렞 ?쒕ぉ ?곸뿭 */}
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{t(language, 'home.title')}</h1>
          <p className={styles.subtitle}>{t(language, 'home.subtitle')}</p>
        </div>

        {/* ?뫀 ?대쫫 ?낅젰 (?좏깮?? */}
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

        {/* ?렜 臾몄젣 ?좏삎 ?좏깮 */}
        <div className={styles.typeSection}>
          <h2 className={styles.sectionTitle}>
            {t(language, 'home.selectType')}
          </h2>
          <div className={styles.typeGrid}>
            {QUESTION_TYPES.map((type) => {
              // 媛??좏삎???꾩씠肄섍낵 洹몃씪?곗씠???됱긽 媛?몄삤湲?
              const info = QUESTION_TYPE_INFO[type];
              const isSelected = questionType === type;

              return (
                <button
                  key={type}
                  className={`${styles.typeCard} ${isSelected ? styles.typeCardSelected : ''}`}
                  style={{ backgroundColor: isSelected ? info.colorFrom : "white", color: isSelected ? "white" : "var(--color-text)", borderColor: isSelected ? info.colorFrom : "transparent" }}
                  onClick={() => {
                    setQuestionType(type);
                    playClickSound();
                  }}
                >
                  {/* 臾몄젣 ?좏삎 ?대え吏 */}
                  <span className={styles.typeEmoji}>{info.emoji}</span>
                  {/* 臾몄젣 ?좏삎 ?대쫫 */}
                  <span className={styles.typeName}>
                    {t(language, `type.${type}`)}
                  </span>
                  {/* 臾몄젣 ?좏삎 ?ㅻ챸 */}
                  <span className={styles.typeDesc}>
                    {t(language, `type.${type}.desc`)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ???쒖씠???좏깮 */}
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

        {/* ?뵢 臾몄젣 ???좏깮 */}
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

        {/* ?? ?쒖옉 & 湲곕줉 蹂닿린 踰꾪듉 */}
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


