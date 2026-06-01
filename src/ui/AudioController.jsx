import { useEffect, useRef } from 'react'
import { useStore } from '../state/useStore'

/**
 * Owns the background-music <audio> element and registers it with the store so
 * enter()/toggleMusic() can control it. If the file is missing, play() simply
 * rejects and is swallowed — the rest of the app is unaffected.
 *
 * Provide the track at: public/audio/bg.mp3
 */
export function AudioController() {
  const ref = useRef(null)
  const registerAudio = useStore((s) => s.registerAudio)

  useEffect(() => {
    registerAudio(ref.current)
  }, [registerAudio])

  return <audio ref={ref} src="/audio/bg.mp3" loop preload="auto" />
}
