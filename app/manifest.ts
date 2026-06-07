// ============================================================
// 📱 manifest.ts - PWA(Progressive Web App) 매니페스트 설정
// ============================================================
// 이 파일이 있으면 웹사이트를 앱처럼 설치할 수 있어요!
// 폰/태블릿에서 "홈 화면에 추가"하면 앱 아이콘이 생깁니다.

import type { MetadataRoute } from 'next';

/**
 * PWA 매니페스트 설정 함수
 * Next.js가 자동으로 /manifest.webmanifest 파일을 생성합니다
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    // 앱 이름 (홈 화면에 표시)
    name: '🧮 수학 모험! - Math Adventure',
    // 짧은 이름 (아이콘 아래에 표시)
    short_name: '수학 모험',
    // 앱 설명
    description:
      '초등학교 입학 전 아이들을 위한 재미있는 수학 문제 풀이 앱!',
    // 시작 URL (앱 열면 이 페이지로)
    start_url: '/',
    // 표시 모드: standalone = 브라우저 주소창 없이 앱처럼 보임
    display: 'standalone',
    // 배경색 (앱 로딩 중 표시)
    background_color: '#f5f7fa',
    // 테마색 (상태 바 색상)
    theme_color: '#6C63FF',
    // 화면 방향 (세로/가로 모두 지원)
    orientation: 'any',
    // 앱 아이콘 설정
    icons: [
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
