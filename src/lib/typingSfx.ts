import { assetUrl } from './assetUrl'

let typingAudio: HTMLAudioElement | null = null
let primed = false
let primeInProgress = false

export function getTypingSfx(): HTMLAudioElement {
  if (!typingAudio) {
    const a = new Audio(assetUrl('Keyboard_Typing_02.wav'))
    a.loop = true
    a.preload = 'auto'
    a.volume = 0.12
    typingAudio = a
  }
  return typingAudio
}

// 在用户手势回调内调用，提前解锁 iOS 播放限制
export async function primeTypingSfx(): Promise<void> {
  if (primed || primeInProgress) return
  primeInProgress = true
  try {
    const a = getTypingSfx()
    try {
      // 静音预热：在用户手势内无声播放后立即暂停，避免首页出现敲击音
      const prevVol = a.volume
      a.volume = 0
      await a.play()
      a.pause()
      try { a.currentTime = 0 } catch {}
      a.volume = prevVol
      primed = true
    } catch {
      // 如果仍然失败，保留未 primed 状态，等待下一次手势再尝试
    }
  } finally {
    primeInProgress = false
  }
}
