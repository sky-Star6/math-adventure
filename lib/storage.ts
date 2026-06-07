// ============================================================
// 💾 storage.ts - localStorage를 이용한 학습 기록 저장/불러오기
// ============================================================

import { StudyRecord, QuizResult } from './types';
import { STORAGE_KEY } from './constants';

/**
 * 모든 학습 기록을 localStorage에서 불러오기
 * @returns 학습 기록 배열 (최신순 정렬)
 */
export function getStudyRecords(): StudyRecord[] {
  // 서버 사이드 렌더링(SSR) 환경에서는 localStorage가 없으므로 빈 배열 반환
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    // JSON 문자열을 StudyRecord 배열로 변환
    const records: StudyRecord[] = JSON.parse(data);

    // 최신 기록이 위에 오도록 정렬
    return records.sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
  } catch (error) {
    console.error('학습 기록 불러오기 실패:', error);
    return [];
  }
}

/**
 * 퀴즈 결과를 학습 기록으로 저장
 * @param result - 퀴즈 결과 데이터
 */
export function saveStudyRecord(result: QuizResult): void {
  if (typeof window === 'undefined') return;

  try {
    // 기존 기록 불러오기
    const existingRecords = getStudyRecords();

    // 새 기록 생성 (고유 ID는 타임스탬프 + 랜덤 문자열)
    const newRecord: StudyRecord = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      playerName: result.config.playerName || '이름없음',
      questionType: result.config.questionType,
      difficulty: result.config.difficulty,
      score: result.score,
      correctCount: result.correctCount,
      totalCount: result.totalCount,
      completedAt: result.completedAt,
    };

    // 기존 기록에 새 기록 추가 (최대 50개까지 저장)
    const updatedRecords = [newRecord, ...existingRecords].slice(0, 50);

    // localStorage에 저장
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
  } catch (error) {
    console.error('학습 기록 저장 실패:', error);
  }
}

/**
 * 모든 학습 기록 삭제
 */
export function clearStudyRecords(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('학습 기록 삭제 실패:', error);
  }
}
