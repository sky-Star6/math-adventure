'use client';

// ============================================================
// ➕ AdditionQuestion.tsx - 덧셈 문제 컴포넌트
// ============================================================
// "num1 + num2 = ?" 형태의 덧셈 문제를 표시합니다.
// 큰 수식과 함께 이모지로 시각적 보조를 제공하여 아이가
// 직관적으로 덧셈을 이해할 수 있도록 합니다.
// 'use client' 필요: 이벤트 핸들러, useState
// ============================================================

import { useState } from 'react';
import { Question, Language, Difficulty } from '../lib/types';
import { t } from '../lib/i18n';
import AnswerButton from './AnswerButton';
import styles from './AdditionQuestion.module.css';

/**
 * AdditionQuestion 컴포넌트의 Props 타입
 * @property question - 현재 문제 데이터 (num1, num2, operator, difficulty 포함)
 * @property onAnswer - 사용자가 답을 선택했을 때 호출할 콜백
 * @property disabled - 답 선택 비활성화 여부
 * @property lang - 현재 선택된 언어
 * @property difficulty - (선택) 난이도/연령 설정. 지정되지 않으면 question.difficulty 사용
 */
interface AdditionQuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
  disabled: boolean;
  lang: Language;
  difficulty?: Difficulty;
}

/**
 * AdditionQuestion 컴포넌트
 * 덧셈 수식을 큰 글씨로 보여줍니다.
 * - 5~6세(easy), 7세(medium): 이모지 그림 보조(visualAid)를 함께 표시하여 직관적 이해를 돕습니다.
 * - 8세 초등 1학년(hard): 그림 보조를 제거하고 수식만으로 직접 연산하도록 합니다.
 */
export default function AdditionQuestion({
  question,
  onAnswer,
  disabled,
  lang,
  difficulty,
}: AdditionQuestionProps) {
  // 사용자가 선택한 답 (아직 선택 안 했으면 null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // 문제의 시각적 데이터에서 숫자 가져오기
  const num1 = question.visualData.num1 || 0;
  const num2 = question.visualData.num2 || 0;

  // 이모지 시각적 보조에 사용할 이모지 (문제에 emoji가 있으면 사용, 없으면 기본 이모지)
  const emoji = question.visualData.emoji || '🟡';

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

  // 현재 적용할 난이도 (props로 전달받았거나 문제 자체에 기록된 난이도)
  const currentDifficulty = difficulty ?? question.difficulty;
  // 8세 초등 1학년(hard) 난이도인지 확인: hard인 경우 하단 이모지 그림을 삭제합니다.
  const isHardDifficulty = currentDifficulty === 'hard';

  return (
    <div className={styles.questionContainer}>
      {/* 질문 텍스트 */}
      <div className={styles.questionText}>
        {t(lang, 'quiz.addition.question')}
      </div>

      {/* 수식 카드: 3 + 5 = ? */}
      <div className={styles.formulaCard}>
        <div className={styles.formula}>
          {num1}
          <span className={styles.operator}> + </span>
          {num2}
          <span className={styles.operator}> = </span>
          <span className={styles.questionMark}>?</span>
        </div>

        {/* 이모지 시각적 보조: 8세(hard) 난이도가 아닐 때만(5~6세, 7세) 표시 */}
        {!isHardDifficulty && (
          <div className={styles.visualAid}>
            {/* 첫 번째 숫자 이모지 그룹 */}
            <div className={styles.emojiGroup}>
              {Array.from({ length: num1 }, (_, i) => (
                <span
                  key={`a-${i}`}
                  className={styles.emojiItem}
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  {emoji}
                </span>
              ))}
            </div>

            {/* + 기호 */}
            <span className={styles.operatorSymbol}>+</span>

            {/* 두 번째 숫자 이모지 그룹 */}
            <div className={styles.emojiGroup}>
              {Array.from({ length: num2 }, (_, i) => (
                <span
                  key={`b-${i}`}
                  className={styles.emojiItem}
                  style={{ animationDelay: `${(num1 + i) * 0.06}s` }}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        )}
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
