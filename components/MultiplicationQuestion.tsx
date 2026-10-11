'use client';

// ============================================================
// ✖️ MultiplicationQuestion.tsx - 곱셈(구구단) 문제 컴포넌트
// ============================================================
// "num1 × num2 = ?" 형태의 곱셈 문제를 표시합니다.
// - 레벨 1(easy), 레벨 2(medium): "num1개씩 num2묶음" 형태로
//   각 묶음 상자(Box) 안에 이모지를 담아 시각적으로 곱셈 개념을 이해하도록 돕습니다.
// - 레벨 3(hard): 시각적 묶음 보조를 숨기고 순수 수식만으로 암산하도록 합니다.
// 'use client' 필요: 사용자 선택 이벤트 핸들러 및 상태(useState) 관리
// ============================================================

import { useState } from 'react';
import { Question, Language, Difficulty } from '../lib/types';
import { t } from '../lib/i18n';
import AnswerButton from './AnswerButton';
import styles from './MultiplicationQuestion.module.css';

/**
 * MultiplicationQuestion 컴포넌트의 속성(Props) 인터페이스
 * @property question - 현재 문제 데이터 (num1, num2, emoji, 난이도 등 포함)
 * @property onAnswer - 사용자가 보기를 선택했을 때 부모에게 전달하는 콜백 함수
 * @property disabled - 답안 선택 버튼 비활성화 여부
 * @property lang - 현재 선택된 언어 (ko | en)
 * @property difficulty - (선택사항) 현재 적용 중인 난이도/레벨
 */
interface MultiplicationQuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
  disabled: boolean;
  lang: Language;
  difficulty?: Difficulty;
}

/**
 * 곱셈(구구단) 문제 컴포넌트
 */
export default function MultiplicationQuestion({
  question,
  onAnswer,
  disabled,
  lang,
  difficulty,
}: MultiplicationQuestionProps) {
  // 사용자가 클릭한 보기 값 (선택 전에는 null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // 문제 데이터에서 곱셈 인자 가져오기 (num1단 × num2배)
  const num1 = question.visualData.num1 || 2;
  const num2 = question.visualData.num2 || 1;

  // 시각화에 사용할 이모지 (기본값: 사과 🍎)
  const emoji = question.visualData.emoji || '🍎';

  /**
   * 보기 버튼 클릭 처리 핸들러(Handler)
   */
  const handleChoiceClick = (choice: string) => {
    if (disabled || selectedAnswer !== null) return;
    setSelectedAnswer(choice);
    onAnswer(choice);
  };

  /**
   * 보기 버튼의 정답/오답 상태 결정 함수
   */
  const getButtonState = (choice: string): 'default' | 'correct' | 'wrong' => {
    if (selectedAnswer === null) return 'default';
    if (choice === question.correctAnswer) return 'correct';
    if (choice === selectedAnswer) return 'wrong';
    return 'default';
  };

  // 현재 적용 난이도 확인: 레벨 3(hard)인 경우 시각적 묶음 그림을 숨깁니다.
  const currentDifficulty = difficulty ?? question.difficulty;
  const isHardDifficulty = currentDifficulty === 'hard';

  return (
    <div className={styles.questionContainer}>
      {/* 🏷️ 질문 타이틀 */}
      <div className={styles.questionText}>
        {t(lang, 'quiz.multiplication.question')}
      </div>

      {/* 🧮 큰 수식 카드 (예: 2 × 3 = ?) */}
      <div className={styles.formulaCard}>
        <div className={styles.formula}>
          {num1}
          <span className={styles.operator}> × </span>
          {num2}
          <span className={styles.operator}> = </span>
          <span className={styles.questionMark}>?</span>
        </div>

        {/* 🎨 시각적 묶음 보조 자료 (레벨 1, 레벨 2에서만 제공) */}
        {!isHardDifficulty && (
          <div className={styles.visualAid}>
            <div className={styles.groupExplanation}>
              {lang === 'ko'
                ? `💡 ${num1}개씩 ${num2}묶음이에요!`
                : `💡 ${num2} groups of ${num1}!`}
            </div>

            {/* 묶음 상자(GroupBox) 리스트 */}
            <div className={styles.groupBoxList}>
              {Array.from({ length: num2 }, (_, groupIndex) => (
                <div
                  key={`group-${groupIndex}`}
                  className={styles.groupBox}
                  style={{ animationDelay: `${groupIndex * 0.08}s` }}
                >
                  <span className={styles.groupIndexBadge}>
                    {groupIndex + 1}
                  </span>
                  <div className={styles.groupEmojis}>
                    {Array.from({ length: num1 }, (_, itemIndex) => (
                      <span
                        key={`item-${itemIndex}`}
                        className={styles.emojiItem}
                      >
                        {emoji}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 🔘 4지선다 답안 선택 버튼 그리드 */}
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
