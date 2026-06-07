'use client';

// ============================================================
// 🔗 SequenceQuestion.tsx - 순서 맞추기 문제 컴포넌트
// ============================================================
// 숫자 배열을 카드 형태로 가로 배치하고, null인 위치에 "?" 카드를
// 표시합니다. 아이가 빈칸에 들어갈 숫자를 4지선다로 선택합니다.
// 'use client' 필요: 이벤트 핸들러, useState
// ============================================================

import { useState } from 'react';
import { Question, Language } from '../lib/types';
import { t } from '../lib/i18n';
import AnswerButton from './AnswerButton';
import styles from './SequenceQuestion.module.css';

/**
 * SequenceQuestion 컴포넌트의 Props 타입
 */
interface SequenceQuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
  disabled: boolean;
  lang: Language;
}

/**
 * SequenceQuestion 컴포넌트
 * 숫자 배열에서 빈칸(null)에 들어갈 숫자를 맞추는 문제입니다.
 *
 * 예: [1] → [2] → [?] → [4] → [5]
 *     정답: 3
 */
export default function SequenceQuestion({
  question,
  onAnswer,
  disabled,
  lang,
}: SequenceQuestionProps) {
  // 사용자가 선택한 답
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // 문제 데이터에서 숫자 배열 가져오기 (null은 빈칸)
  const sequence = question.visualData.numberSequence || [];

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
        {t(lang, 'quiz.sequence.question')}
      </div>

      {/* 숫자 카드 나열 */}
      <div className={styles.sequenceRow}>
        {sequence.map((num, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* 숫자 카드 또는 빈칸 카드 */}
            <div
              className={`${styles.numberCard} ${
                num === null ? styles.emptyCard : styles.filledCard
              }`}
              /* 순차 등장 애니메이션 딜레이 */
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {num === null ? '?' : num}
            </div>

            {/* 카드 사이 화살표 (마지막 카드 뒤에는 표시 안 함) */}
            {index < sequence.length - 1 && (
              <span className={styles.arrow}>→</span>
            )}
          </div>
        ))}
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
