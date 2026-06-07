// ============================================================
// 📊 ProgressBar.tsx - 퀴즈 진행 상태 바 컴포넌트
// ============================================================
// 현재 문제 번호와 전체 문제 수를 받아서 진행률을 시각적으로
// 표시합니다. 상태(state)가 없는 순수 렌더링 컴포넌트입니다.
// ============================================================

import styles from './ProgressBar.module.css';

/**
 * ProgressBar 컴포넌트의 Props 타입
 * @property current - 현재 문제 번호 (1부터 시작)
 * @property total - 전체 문제 수
 */
interface ProgressBarProps {
  current: number;
  total: number;
}

/**
 * ProgressBar 컴포넌트
 * 그라데이션 배경의 진행 바와 "현재/전체" 텍스트를 표시합니다.
 *
 * 사용 예시:
 * <ProgressBar current={3} total={10} />
 */
export default function ProgressBar({ current, total }: ProgressBarProps) {
  // 진행률 퍼센트 계산 (0~100 사이)
  // 예: current=3, total=10 → 30%
  const progressPercent = Math.min((current / total) * 100, 100);

  // 완료된 별 이모지 (진행도에 따라 다른 이모지 표시)
  const starEmoji = current >= total ? '🎉' : '⭐';

  return (
    <div className={styles.progressWrapper}>
      {/* 현재 문제 번호 / 전체 문제 수 텍스트 */}
      <div className={styles.progressText}>
        {starEmoji} {current} / {total}
      </div>

      {/* 프로그래스 바 트랙 (배경) */}
      <div className={styles.progressTrack}>
        {/* 채워지는 바 (width를 % 단위로 동적 지정) */}
        <div
          className={styles.progressFill}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
