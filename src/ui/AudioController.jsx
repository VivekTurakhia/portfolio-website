import { useEffect, useRef } from 'react'
import { useStore } from '../state/useStore'
import { tracks } from '../data/tracks'

/**
 * Owns the single <audio> element for the speaker playlist and reacts to the
 * store: while `musicOn`, it loads + plays the current shuffled track and
 * advances on end (cycling forever, never silent); when off, it pauses. The
 * first play() runs inside the speaker-click gesture, so autoplay is allowed.
 */
export function AudioController() {
  const ref = useRef(null)
  const loadedId = useRef(null)
  const musicOn = useStore((s) => s.musicOn)
  const order = useStore((s) => s.order)
  const trackIndex = useStore((s) => s.trackIndex)
  const nextTrack = useStore((s) => s.nextTrack)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!musicOn) {
      el.pause()
      return
    }
    const track = tracks[order[trackIndex]]
    if (!track) return
    if (loadedId.current !== track.id) {
      el.src = track.src // switching src resets playback to the start
      loadedId.current = track.id
    }
    el.play().catch(() => {})
  }, [musicOn, order, trackIndex])

  return <audio ref={ref} preload="auto" onEnded={nextTrack} />
}
