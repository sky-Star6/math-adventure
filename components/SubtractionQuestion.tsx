'use client';

// ============================================================
// ➖ SubtractionQuestion.tsx - 뺄셈 문제 컴포넌트
// ============================================================
// "num1 - num2 = ?" 형태의 뺄셈 문제를 표시합니다.
// 이모지로 빠지는 수를 흐리게 표시하여 뺄셈 개념을 시각적으로
// 이해할 수 있도록 합니다.
// 'use client' 필요: 이벤트 핸들러, useState
// ============================================================

import { useState } from 'react';
import { Question, Language } from '../lib/types';
import { t } from '../lib/i18n';
import AnswerButton from './AnswerButton';
import styles from './SubtractionQuestion.module.css';

/**
 * SubtractionQuestion 컴포넌트의 Props 타입
 */
interface SubtractionQuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
  disabled: boolean;
  lang: Language;
}

/**
 * SubtractionQuestion 컴포넌트
 * 뺄셈 수식을 큰 글씨로 보여주고, 빠지는 이모지를 흐리게 표시합니다.
 *
 * 예: 🍎🍎🍎🍎🍎 에서 🍎🍎(흐리게) → 5 - 2 = ?
 */
export default function SubtractionQuestion({
  question,
  onAnswer,
  disabled,
  lang,
}: SubtractionQuestionProps) {
  // 사용자가 선택한 답
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // 문제 데이터에서 숫자 가져오기
  const num1 = question.visualData.num1 || 0;
  const num2 = question.visualData.num2 || 0;

  // 이모지 (기본값: 노란 원)
  const emoji = question.visualData.emoji || '🟡';

  // 뺄셈 결과 (남는 이모지 수)
  const remaining = num1 - num2;

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
        {t(lang, 'quiz.subtraction.question')}
      </div>

      {/* 수식 카드: 7 - 3 = ? */}
      <div className={styles.formulaCard}>
        <div className={styles.formula}>
          {num1}
          <span className={styles.operator}> - </span>
          {num2}
          <span className={styles.operator}> = </span>
          <span className={styles.questionMark}>?</span>
        </div>

        {/* 이모지 시각적 보조 */}
        <div className={styles.visualAid}>
          {/* 전체 이모지 그룹: 남는 것은 밝게, 빠지는 것은 흐리게 */}
          <div className={styles.emojiGroup}>
            {/* 남아있는 이모지 (밝게) */}
            {Array.from({ length: remaining }, (_, i) => (
              <span
                key={`remain-${i}`}
                className={styles.emojiRemaining}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                {emoji}
              </span>
            ))}
            {/* 빼지는 이모지 (흐리게 + 취소선) */}
            {Array.from({ length: num2 }, (_, i) => (
              <span
                key={`sub-${i}`}
                className={styles.emojiSubtracted}
                style={{ animationDelay: `${(remaining + i) * 0.06}s` }}
              >
                {emoji}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 답안 보기 버튼 (2×2 그리드) */}
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
