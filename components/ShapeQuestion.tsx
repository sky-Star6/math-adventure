'use client';

// ============================================================
// 🔷 ShapeQuestion.tsx - 모양 인식 문제 컴포넌트
// ============================================================
// ShapeRenderer 컴포넌트로 도형을 표시하고, 도형의 이름을
// 4지선다로 맞추는 문제입니다.
// choices는 도형의 id로 들어오므로, SHAPES 상수에서 해당 언어의
// 이름(nameKo/nameEn)을 찾아서 표시합니다.
// 'use client' 필요: 이벤트 핸들러, useState
// ============================================================

import { useState } from 'react';
import { Question, Language } from '../lib/types';
import { SHAPES } from '../lib/constants';
import { t } from '../lib/i18n';
import AnswerButton from './AnswerButton';
import ShapeRenderer from './ShapeRenderer';
import styles from './ShapeQuestion.module.css';

/**
 * ShapeQuestion 컴포넌트의 Props 타입
 */
interface ShapeQuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
  disabled: boolean;
  lang: Language;
}

/**
 * 도형 ID를 현재 언어에 맞는 이름으로 변환하는 헬퍼 함수
 * @param shapeId - 도형 ID (예: 'circle', 'star')
 * @param lang - 현재 언어 ('ko' | 'en')
 * @returns 해당 언어의 도형 이름 (예: '원', 'Circle')
 */
function getShapeName(shapeId: string, lang: Language): string {
  // SHAPES 배열에서 해당 id의 도형 찾기
  const shape = SHAPES.find((s) => s.id === shapeId);
  if (!shape) return shapeId;

  // 언어에 따라 한국어 또는 영어 이름 반환
  return lang === 'ko' ? shape.nameKo : shape.nameEn;
}

/**
 * ShapeQuestion 컴포넌트
 * CSS로 렌더링된 도형을 보여주고, 이름을 맞추는 문제입니다.
 *
 * 예: (분홍색 원 표시) → [원] [삼각형] [사각형] [별]
 */
export default function ShapeQuestion({
  question,
  onAnswer,
  disabled,
  lang,
}: ShapeQuestionProps) {
  // 사용자가 선택한 답
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // 문제에서 표시할 도형의 ID 가져오기
  const shapeId = question.visualData.shapeName || 'circle';

  /**
   * 보기 버튼 클릭 핸들러
   * choices는 도형 id (예: 'circle')로 들어오므로 그대로 onAnswer에 전달
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
        {t(lang, 'quiz.shape.question')}
      </div>

      {/* 도형 표시 영역 */}
      <div className={styles.shapeDisplay}>
        <ShapeRenderer shapeId={shapeId} />
      </div>

      {/* 답안 보기 버튼 (2×2 그리드) */}
      {/* choices는 도형 id이므로 getShapeName()으로 이름 변환하여 표시 */}
      <div className={styles.choicesGrid}>
        {question.choices.map((choice) => (
          <AnswerButton
            key={choice}
            label={getShapeName(choice, lang)}
            onClick={() => handleChoiceClick(choice)}
            disabled={disabled || selectedAnswer !== null}
            state={getButtonState(choice)}
          />
        ))}
      </div>
    </div>
  );
}
