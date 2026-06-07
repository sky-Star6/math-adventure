'use client';

// ============================================================
// 🔢 CountingQuestion.tsx - 숫자 세기 문제 컴포넌트
// ============================================================
// 이모지를 그리드로 배치하여 아이가 개수를 세고, 4개의 보기 중
// 정답을 선택하는 문제입니다.
// 'use client' 필요: 이벤트 핸들러(onAnswer), 상태 관리
// ============================================================

import { useState } from 'react';
import { Question, Language } from '../lib/types';
import { t } from '../lib/i18n';
import AnswerButton from './AnswerButton';
import styles from './CountingQuestion.module.css';

/**
 * CountingQuestion 컴포넌트의 Props 타입
 * @property question - 현재 문제 데이터
 * @property onAnswer - 사용자가 답을 선택했을 때 호출할 콜백
 * @property disabled - 답 선택 비활성화 여부
 * @property lang - 현재 선택된 언어 ('ko' | 'en')
 */
interface CountingQuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
  disabled: boolean;
  lang: Language;
}

/**
 * CountingQuestion 컴포넌트
 * 이모지를 count 개수만큼 보여주고, 아이가 개수를 세어 답을 고릅니다.
 *
 * 예: 🍎🍎🍎 → "몇 개일까요?" → [2] [3] [4] [5]
 */
export default function CountingQuestion({
  question,
  onAnswer,
  disabled,
  lang,
}: CountingQuestionProps) {
  // 사용자가 선택한 답 (아직 선택 안 했으면 null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // 문제의 시각적 데이터에서 이모지와 개수 가져오기
  const emoji = question.visualData.emoji || '⭐';
  const count = question.visualData.count || 0;

  /**
   * 보기 버튼 클릭 핸들러
   * @param choice - 사용자가 선택한 보기 값 (문자열)
   */
  const handleChoiceClick = (choice: string) => {
    // 이미 답을 선택했거나 비활성화 상태면 무시
    if (disabled || selectedAnswer !== null) return;

    // 선택한 답 기록
    setSelectedAnswer(choice);
    // 부모 컴포넌트에 답 전달
    onAnswer(choice);
  };

  /**
   * 각 보기 버튼의 상태를 결정하는 함수
   * 아직 선택 안 했으면 'default'
   * 선택한 답이 정답이면 해당 버튼 'correct'
   * 선택한 답이 오답이면 그 버튼 'wrong' + 정답 버튼 'correct'
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
        {t(lang, 'quiz.counting.question')}
      </div>

      {/* 이모지 그리드: emoji를 count 개수만큼 표시 */}
      <div className={styles.emojiGrid}>
        {Array.from({ length: count }, (_, index) => (
          <span
            key={index}
            className={styles.emojiItem}
            /* 각 이모지가 순차적으로 나타나도록 delay 설정 */
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            {emoji}
          </span>
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
