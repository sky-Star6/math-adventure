'use client';

// ============================================================
// 🔘 AnswerButton.tsx - 답안 선택 버튼 컴포넌트
// ============================================================
// 문제의 보기(선택지)를 표시하는 큰 버튼입니다.
// 클릭 이벤트와 상태(정답/오답)에 따라 색상과 애니메이션이 바뀝니다.
// 'use client' 필요: onClick 이벤트 핸들러 사용
// ============================================================

import styles from './AnswerButton.module.css';

/**
 * AnswerButton 컴포넌트의 Props 타입
 * @property label - 버튼에 표시할 텍스트 (보기 내용)
 * @property onClick - 버튼 클릭 시 실행할 함수
 * @property disabled - 버튼 비활성화 여부 (선택 후 다른 버튼 누르지 못하게)
 * @property state - 버튼의 현재 상태 ('default' | 'correct' | 'wrong')
 */
interface AnswerButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  state?: 'default' | 'correct' | 'wrong';
}

/**
 * AnswerButton 컴포넌트
 * 아이들이 쉽게 터치할 수 있는 큰 버튼으로, 선택 결과에 따라
 * 초록색(정답) 또는 빨간색(오답) 으로 변합니다.
 *
 * 사용 예시:
 * <AnswerButton label="3" onClick={handleClick} state="correct" />
 */
export default function AnswerButton({
  label,
  onClick,
  disabled = false,
  state = 'default',
}: AnswerButtonProps) {
  // 상태에 따라 추가 CSS 클래스를 결정
  // 'correct' → styles.correct (초록 bounce)
  // 'wrong' → styles.wrong (빨강 shake)
  const stateClass =
    state === 'correct'
      ? styles.correct
      : state === 'wrong'
        ? styles.wrong
        : '';

  return (
    <button
      className={`${styles.answerButton} ${stateClass}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {label}
    </button>
  );
}
