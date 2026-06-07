// ============================================================
// 📊 records/page.tsx - 학습 기록 화면
// ============================================================
// localStorage에 저장된 학습 기록을 카드 형태로 보여주는 페이지입니다.
// 기록 삭제 기능과 돌아가기 버튼이 있습니다.
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// 타입 import
import type { StudyRecord, Language } from '@/lib/types';
// 상수 import
import { QUESTION_TYPE_INFO } from '@/lib/constants';
// 저장소 import
import { getStudyRecords, clearStudyRecords } from '@/lib/storage';
// 다국어 import
import { t } from '@/lib/i18n';
// 효과음 import
import { playClickSound } from '@/lib/sounds';
// CSS Module import
import styles from './page.module.css';

/**
 * 날짜 포맷팅 함수
 * ISO 문자열을 보기 좋은 날짜로 변환합니다.
 * @param isoString - ISO 8601 날짜 문자열
 * @param lang - 현재 언어
 * @returns 포맷된 날짜 문자열 (예: "2024.12.25 오후 3:30")
 */
function formatDate(isoString: string, lang: Language): string {
  try {
    const date = new Date(isoString);
    if (lang === 'ko') {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

/**
 * 점수에 따른 CSS 클래스 반환
 * @param score - 점수 (0~100)
 * @returns CSS 클래스 이름
 */
function getScoreClass(score: number): string {
  if (score >= 80) return styles.scoreHigh;
  if (score >= 50) return styles.scoreMedium;
  return styles.scoreLow;
}

/**
 * 📊 학습 기록 화면 컴포넌트
 * localStorage에 저장된 모든 학습 기록을 보여줍니다.
 */
export default function RecordsPage() {
  // Next.js 라우터
  const router = useRouter();

  // --------------------------------------------------
  // 📦 상태 관리
  // --------------------------------------------------

  /** 학습 기록 배열 */
  const [records, setRecords] = useState<StudyRecord[]>([]);

  /** 현재 언어 */
  const [language, setLanguage] = useState<Language>('ko');

  /** 데이터 로딩 완료 여부 */
  const [loaded, setLoaded] = useState<boolean>(false);

  // --------------------------------------------------
  // 🔄 초기 로딩
  // --------------------------------------------------
  useEffect(() => {
    // 언어 복원
    const savedLang = sessionStorage.getItem('math_app_language');
    if (savedLang === 'ko' || savedLang === 'en') {
      setLanguage(savedLang);
    }

    // 학습 기록 불러오기
    const loadedRecords = getStudyRecords();
    setRecords(loadedRecords);
    setLoaded(true);
  }, []);

  // --------------------------------------------------
  // 🗑️ 기록 삭제
  // --------------------------------------------------
  const handleClear = () => {
    // 확인 대화상자 표시
    const confirmMessage = t(language, 'records.clearConfirm');
    if (window.confirm(confirmMessage)) {
      clearStudyRecords();
      setRecords([]);
      playClickSound();
    }
  };

  // --------------------------------------------------
  // ← 돌아가기
  // --------------------------------------------------
  const handleBack = () => {
    playClickSound();
    router.push('/');
  };

  // --------------------------------------------------
  // ⏳ 로딩 중
  // --------------------------------------------------
  if (!loaded) {
    return null;
  }

  // --------------------------------------------------
  // 🖥️ 화면 렌더링
  // --------------------------------------------------
  return (
    <div className={styles.container}>
      <div className={styles.mainCard}>
        {/* 📋 헤더: 제목 + 버튼 */}
        <div className={styles.header}>
          <h1 className={styles.title}>{t(language, 'records.title')}</h1>
          <div className={styles.headerButtons}>
            {/* 돌아가기 버튼 */}
            <button className={styles.backButton} onClick={handleBack}>
              {t(language, 'records.back')}
            </button>
            {/* 기록 삭제 버튼 (기록이 있을 때만 표시) */}
            {records.length > 0 && (
              <button className={styles.clearButton} onClick={handleClear}>
                {t(language, 'records.clear')}
              </button>
            )}
          </div>
        </div>

        {/* 기록이 없을 때 - 빈 상태 메시지 */}
        {records.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyEmoji}>📭</span>
            <p className={styles.emptyText}>
              {t(language, 'records.empty')}
            </p>
          </div>
        ) : (
          /* 📋 기록 카드 목록 */
          <div className={styles.recordList}>
            {records.map((record) => {
              // 문제 유형의 이모지와 이름 가져오기
              const typeInfo =
                QUESTION_TYPE_INFO[
                  record.questionType as keyof typeof QUESTION_TYPE_INFO
                ];

              return (
                <div
                  key={record.id}
                  className={styles.recordCard}
                >
                  {/* 문제 유형 이모지 */}
                  <span className={styles.recordEmoji}>
                    {typeInfo?.emoji || '📝'}
                  </span>

                  {/* 기록 상세 정보 */}
                  <div className={styles.recordInfo}>
                    {/* 플레이어 이름 */}
                    {record.playerName && (
                      <span className={styles.recordName}>
                        {record.playerName}
                      </span>
                    )}
                    {/* 문제 유형 이름 */}
                    <span className={styles.recordType}>
                      {t(language, `type.${record.questionType}`)}
                    </span>
                    {/* 메타 정보: 날짜, 난이도, 정답 수 */}
                    <span className={styles.recordMeta}>
                      <span>
                        {t(language, 'records.date')}:{' '}
                        {formatDate(record.completedAt, language)}
                      </span>
                      <span>
                        {t(language, `difficulty.${record.difficulty}`)}
                      </span>
                      <span>
                        {record.correctCount}/{record.totalCount}
                      </span>
                    </span>
                  </div>

                  {/* 점수 뱃지 */}
                  <div
                    className={`${styles.recordScore} ${getScoreClass(record.score)}`}
                  >
                    {record.score}{t(language, 'result.score')}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
