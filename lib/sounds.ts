// ============================================================
// 🔊 sounds.ts - Web Audio API를 이용한 효과음 모듈
// ============================================================
// 별도 파일 없이 코드만으로 귀여운 효과음을 생성합니다!

/**
 * AudioContext를 안전하게 생성하는 헬퍼 함수
 * 브라우저 호환성을 위해 webkitAudioContext도 시도
 */
function createAudioContext(): AudioContext | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    return new AudioCtx();
  } catch {
    // AudioContext를 지원하지 않는 환경에서는 null 반환
    return null;
  }
}

/**
 * 단일 음을 재생하는 헬퍼 함수
 * @param ctx - AudioContext 인스턴스
 * @param frequency - 주파수 (Hz) - 높을수록 높은 음
 * @param startTime - 시작 시간 (초)
 * @param duration - 재생 시간 (초)
 * @param volume - 볼륨 (0~1)
 * @param type - 파형 타입 (sine: 부드러운, square: 전자음, triangle: 따뜻한)
 */
function playNote(
  ctx: AudioContext,
  frequency: number,
  startTime: number,
  duration: number,
  volume: number = 0.3,
  type: OscillatorType = 'sine'
) {
  // 오실레이터(Oscillator): 소리를 만드는 장치
  const oscillator = ctx.createOscillator();
  // 게인(Gain): 볼륨을 조절하는 장치
  const gainNode = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);

  // 볼륨을 부드럽게 줄여서 "딱" 끊기는 소리 방지
  gainNode.gain.setValueAtTime(volume, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

  // 오실레이터 → 게인 → 스피커 연결
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

/**
 * 🎉 정답 효과음 - 밝고 경쾌한 "띠리링~" 멜로디
 * 도-미-솔 3음을 연속으로 재생
 */
export function playCorrectSound(): void {
  const ctx = createAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 도(C5) → 미(E5) → 솔(G5) 상승 멜로디
  playNote(ctx, 523.25, now, 0.15, 0.3, 'triangle');       // 도
  playNote(ctx, 659.25, now + 0.12, 0.15, 0.3, 'triangle'); // 미
  playNote(ctx, 783.99, now + 0.24, 0.25, 0.3, 'triangle'); // 솔

  // 짧은 시간 후 AudioContext 정리
  setTimeout(() => ctx.close(), 1000);
}

/**
 * 😅 오답 효과음 - 부드러운 "뿌웅~" 하강 소리
 * 너무 슬프지 않게, 격려하는 느낌으로
 */
export function playWrongSound(): void {
  const ctx = createAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 부드러운 하강음
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.linearRampToValueAtTime(250, now + 0.3);

  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.4);

  setTimeout(() => ctx.close(), 1000);
}

/**
 * 🎊 퀴즈 완료 효과음 - 팡파르(fanfare) 멜로디
 * 모든 문제를 다 풀었을 때 재생
 */
export function playCompleteSound(): void {
  const ctx = createAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 도-미-솔-도(한 옥타브 위) 팡파르
  playNote(ctx, 523.25, now, 0.2, 0.25, 'triangle');        // 도
  playNote(ctx, 659.25, now + 0.15, 0.2, 0.25, 'triangle');  // 미
  playNote(ctx, 783.99, now + 0.30, 0.2, 0.25, 'triangle');  // 솔
  playNote(ctx, 1046.50, now + 0.45, 0.4, 0.3, 'triangle');  // 높은 도

  setTimeout(() => ctx.close(), 1500);
}

/**
 * 🖱️ 버튼 클릭 효과음 - 짧은 "딱" 소리
 */
export function playClickSound(): void {
  const ctx = createAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  playNote(ctx, 800, now, 0.05, 0.15, 'sine');

  setTimeout(() => ctx.close(), 500);
}
