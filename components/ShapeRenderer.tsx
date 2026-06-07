// ============================================================
// 🔷 ShapeRenderer.tsx - CSS로 도형을 그리는 컴포넌트
// ============================================================
// Props로 받은 shapeId에 따라 원, 삼각형, 사각형, 별, 하트, 마름모를
// CSS만으로 렌더링합니다. 상태(state)가 없는 순수 렌더링 컴포넌트이므로
// 'use client' 지시어가 필요하지 않습니다.
// ============================================================

import styles from './ShapeRenderer.module.css';

/**
 * ShapeRenderer 컴포넌트의 Props 타입
 * @property shapeId - 렌더링할 도형의 ID
 *   ('circle' | 'triangle' | 'square' | 'star' | 'heart' | 'diamond')
 */
interface ShapeRendererProps {
  shapeId: string;
}

/**
 * shapeId에 해당하는 CSS 클래스명을 반환하는 헬퍼 함수
 * @param shapeId - 도형 ID 문자열
 * @returns CSS Modules에서 가져온 클래스명
 */
function getShapeClass(shapeId: string): string {
  // 도형 ID와 CSS 클래스를 매핑하는 객체
  const shapeClassMap: Record<string, string> = {
    circle: styles.circle,
    triangle: styles.triangle,
    square: styles.square,
    star: styles.star,
    heart: styles.heart,
    diamond: styles.diamond,
  };

  // 매핑된 클래스가 있으면 반환, 없으면 빈 문자열
  return shapeClassMap[shapeId] || '';
}

/**
 * ShapeRenderer 컴포넌트
 * CSS만으로 도형을 렌더링합니다.
 *
 * 사용 예시:
 * <ShapeRenderer shapeId="circle" />  → 분홍색 원 렌더링
 * <ShapeRenderer shapeId="star" />    → 노란색 별 렌더링
 */
export default function ShapeRenderer({ shapeId }: ShapeRendererProps) {
  // 해당 도형의 CSS 클래스 가져오기
  const shapeClass = getShapeClass(shapeId);

  return (
    <div className={styles.shapeContainer}>
      {/* 도형을 그리는 div - shapeId에 따라 다른 CSS 적용 */}
      <div className={shapeClass} />
    </div>
  );
}
