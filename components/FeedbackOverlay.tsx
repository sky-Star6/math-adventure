'use client';

// ============================================================
// 🎉 FeedbackOverlay.tsx - 정답/오답 피드백 오버레이 컴포넌트
// ============================================================
// 사용자가 답을 선택하면 화면 중앙에 큰 이모지와 격려 메시지를
// 표시합니다. 1.5초 후 자동으로 사라지며, 사라질 때 onComplete
// 콜백을 호출하여 다음 문제로 넘어갑니다.
// 'use client' 필요: useEffect 타이머 사용
// ============================================================

import { useEffect } from 'react';
import styles from './FeedbackOverlay.module.css';

/**
 * FeedbackOverlay 컴포넌트의 Props 타입
 * @property isCorrect - 정답 여부 (true면 정답, false면 오답)
 * @property message - 표시할 격려 메시지
 * @property onComplete - 오버레이가 사라질 때 호출할 콜백 함수
 */
interface FeedbackOverlayProps {
  isCorrect: boolean;
  message: string;
  onComplete: () => void;
}

/**
 * FeedbackOverlay 컴포넌트
 * 정답이면 🎉 + 초록색, 오답이면 💪 + 주황색으로 표시됩니다.
 *
 * 사용 예시:
 * <FeedbackOverlay isCorrect={true} message="정답이에요!" onComplete={goNext} />
 */
export default function FeedbackOverlay({
  isCorrect,
  message,
  onComplete,
}: FeedbackOverlayProps) {
  // --------------------------------------------------
  // 1.5초 후 자동으로 onComplete 호출 (다음 문제로)
  // --------------------------------------------------
  useEffect(() => {
    // 1500ms(1.5초) 후에 onComplete 함수 실행
    const timer = setTimeout(() => {
      onComplete();
    }, 1500);

    // 컴포넌트가 사라질 때(unmount) 타이머 정리
    // 메모리 누수 방지를 위해 반드시 clearTimeout 호출
    return () => clearTimeout(timer);
  }, [onComplete]);

  // 정답/오답에 따른 이모지 선택
  const emoji = isCorrect ? '🎉' : '💪';

  // 정답/오답에 따른 CSS 클래스 조합
  const overlayClass = `${styles.overlay} ${
    isCorrect ? styles.correctOverlay : styles.wrongOverlay
  }`;
  const cardClass = `${styles.feedbackCard} ${
    isCorrect ? styles.correctCard : styles.wrongCard
  }`;
  const messageClass = `${styles.message} ${
    isCorrect ? styles.correctMessage : styles.wrongMessage
  }`;

  return (
    <div className={overlayClass}>
      {/* 정답일 때 반짝이는 별 장식들 */}
      {isCorrect && (
        <div className={styles.sparkles}>
          <span className={styles.sparkle}>⭐</span>
          <span className={styles.sparkle}>🌟</span>
          <span className={styles.sparkle}>✨</span>
          <span className={styles.sparkle}>💫</span>
          <span className={styles.sparkle}>🌈</span>
          <span className={styles.sparkle}>🎀</span>
        </div>
      )}

      {/* 피드백 카드 */}
      <div className={cardClass}>
        {/* 큰 이모지 */}
        <span className={styles.emoji}>{emoji}</span>
        {/* 격려 메시지 */}
        <p className={messageClass}>{message}</p>
      </div>
    </div>
  );
}
