'use client';

// ============================================================
// ⚖️ ComparisonQuestion.tsx - 크기 비교 문제 컴포넌트
// ============================================================
// 두 숫자를 좌우로 배치하고, 각 숫자 아래에 크기를 시각화하는
// 블록 바를 표시합니다. 가운데에 >, <, = 버튼을 배치하여
// 아이가 두 수의 크기를 비교합니다.
// 'use client' 필요: 이벤트 핸들러, useState
// ============================================================

import { useState } from 'react';
import { Question, Language } from '../lib/types';
import { t } from '../lib/i18n';
import AnswerButton from './AnswerButton';
import styles from './ComparisonQuestion.module.css';

/**
 * ComparisonQuestion 컴포넌트의 Props 타입
 */
interface ComparisonQuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
  disabled: boolean;
  lang: Language;
}

/**
 * ComparisonQuestion 컴포넌트
 * 왼쪽과 오른쪽에 숫자를 크게 표시하고, 아래에 블록으로
 * 크기를 시각화합니다.
 *
 * 예:  5  VS  3  → [<] [=] [>]
 *     █████    ███
 */
export default function ComparisonQuestion({
  question,
  onAnswer,
  disabled,
  lang,
}: ComparisonQuestionProps) {
  // 사용자가 선택한 답
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // 문제 데이터에서 좌우 숫자 가져오기
  const leftNum = question.visualData.leftNum || 0;
  const rightNum = question.visualData.rightNum || 0;

  /**
   * 보기 버튼 클릭 핸들러
   */
  const handleChoiceClick = (choice: string) => {
    if (disabled || selectedAnswer !== null) return;
    setSelectedAnswer(choice);
    onAnswer(choice);
  };

  /**
   * 각 보기 버튼의 상태 결정 함수
   */
  const getButtonState = (choice: string): 'default' | 'correct' | 'wrong' => {
    if (selectedAnswer === null) return 'default';
    if (choice === question.correctAnswer) return 'correct';
    if (choice === selectedAnswer) return 'wrong';
    return 'default';
  };

  return (
    <div className={styles.questionContainer}>
      {/* 질문 텍스트 */}
      <div className={styles.questionText}>
        {t(lang, 'quiz.comparison.question')}
      </div>

      {/* 비교 영역: 왼쪽 숫자 - VS - 오른쪽 숫자 */}
      <div className={styles.comparisonArea}>
        {/* 왼쪽 숫자 카드 */}
        <div className={`${styles.numberCard} ${styles.leftCard}`}>
          {/* 큰 숫자 */}
          <div className={styles.bigNumber}>{leftNum}</div>
          {/* 블록 바: 숫자만큼 블록 표시 */}
          <div className={styles.blockBar}>
            {Array.from({ length: leftNum }, (_, i) => (
              <div
                key={`left-${i}`}
                className={`${styles.block} ${styles.leftBlock}`}
                style={{ animationDelay: `${i * 0.05}s` }}
              />
            ))}
          </div>
        </div>

        {/* 가운데 VS 텍스트 */}
        <div className={styles.vsText}>VS</div>

        {/* 오른쪽 숫자 카드 */}
        <div className={`${styles.numberCard} ${styles.rightCard}`}>
          {/* 큰 숫자 */}
          <div className={styles.bigNumber}>{rightNum}</div>
          {/* 블록 바: 숫자만큼 블록 표시 */}
          <div className={styles.blockBar}>
            {Array.from({ length: rightNum }, (_, i) => (
              <div
                key={`right-${i}`}
                className={`${styles.block} ${styles.rightBlock}`}
                style={{ animationDelay: `${i * 0.05}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 비교 연산자 버튼 (<, =, >) - 3개 가로 배치 */}
      <div className={styles.choicesGrid}>
        {question.choices.map((choice) => (
          <AnswerButton
            key={choice}
            label={choice}
            onClick={() => handleChoiceClick(choice)}
            disabled={disabled || selectedAnswer !== null}
            state={getButtonState(choice)}
          />
        ))}
      </div>
    </div>
  );
}
