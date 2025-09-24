import { assetUrl } from './assetUrl'

let typingAudio: HTMLAudioElement | null = null
let primed = false
let primingPromise: Promise<void> | null = null

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
  if (primed) return
  if (primingPromise) return primingPromise

  const audio = getTypingSfx()
  const previousVolume = audio.volume

  const waitNextFrame = () =>
    new Promise<void>((resolve) => {
      if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(() => resolve())
      } else {
        setTimeout(() => resolve(), 0)
      }
    })

  primingPromise = (async () => {
    audio.volume = 0

    try {
      await audio.play()
      await waitNextFrame()

      const shouldSilentlyStop = audio.volume === 0

      if (shouldSilentlyStop) {
        try { audio.pause() } catch {}
        try { audio.currentTime = 0 } catch {}
        audio.volume = previousVolume
      }

      primed = true
    } catch {
      audio.volume = previousVolume
      // 播放仍未解锁，等待下一次手势再尝试
    } finally {
      primingPromise = null
    }
  })()

  return primingPromise
}
