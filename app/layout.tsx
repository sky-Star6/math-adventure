// ============================================================
// 🏠 layout.tsx - 루트 레이아웃 (앱 전체를 감싸는 껍데기)
// ============================================================
// Next.js App Router에서 가장 바깥쪽 레이아웃 파일입니다.
// 모든 페이지에 공통으로 적용되는 폰트, 메타데이터, 스타일을 설정합니다.

import type { Metadata } from 'next';
// Google Fonts에서 폰트를 불러옵니다
import { Geist, Geist_Mono } from 'next/font/google';
// Noto Sans KR: 한국어 지원 폰트 (아이들이 읽기 쉬운 깔끔한 글씨체)
import { Noto_Sans_KR } from 'next/font/google';
// 글로벌 CSS (디자인 시스템) 불러오기
import './globals.css';

/**
 * Geist 폰트 설정 (영문 기본 폰트)
 * - variable: CSS 변수로 사용할 이름
 * - subsets: 사용할 문자 세트 (라틴 문자)
 */
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

/**
 * Geist Mono 폰트 설정 (코드용 고정폭 폰트)
 */
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

/**
 * Noto Sans KR 폰트 설정 (한국어 폰트)
 * - weight: 사용할 폰트 두께 (일반, 중간, 굵은)
 * - subsets: 라틴 문자 세트 포함
 * - variable: CSS 변수로 사용할 이름
 * - display: swap으로 설정하여 폰트 로딩 전에도 텍스트가 보이도록
 */
const notoSansKR = Noto_Sans_KR({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
});

/**
 * 📝 페이지 메타데이터 설정
 * - 브라우저 탭 제목과 검색 엔진에 표시되는 설명
 * - PWA 관련 아이콘 및 Apple 터치 아이콘 설정
 */
export const metadata: Metadata = {
  title: '🧮 수학 모험! - Math Adventure',
  description:
    '초등학교 입학 전 아이들을 위한 재미있는 수학 문제 풀이 앱! 숫자 세기, 덧셈, 뺄셈, 크기 비교, 도형, 순서 맞추기를 놀이처럼 배워요!',
  // PWA: Apple 기기에서 앱처럼 표시하기 위한 설정
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '수학 모험!',
  },
  // 앱 아이콘 설정
  icons: {
    icon: '/icon-512.png',
    apple: '/icon-512.png',
  },
};

/**
 * 📱 뷰포트(Viewport) 설정
 * - 모바일 기기에서 적절한 크기로 표시되도록 설정
 * - themeColor: 상태 바 색상 (보라색)
 */
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#6C63FF',
};

/**
 * 🏗️ 루트 레이아웃 컴포넌트
 * 모든 페이지의 최상위 래퍼(wrapper) 역할을 합니다.
 *
 * @param children - 각 페이지의 콘텐츠가 이곳에 들어갑니다
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // html lang="ko"로 설정하여 한국어 페이지임을 브라우저에 알림
    // 모든 폰트의 CSS 변수를 className으로 적용
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansKR.variable}`}
      suppressHydrationWarning
    >
      {/* body에 Noto Sans KR 폰트 클래스를 직접 적용하여 기본 한국어 폰트로 사용 */}
      <body className={notoSansKR.className}>{children}</body>
    </html>
  );
}
