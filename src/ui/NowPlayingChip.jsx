import { useStore } from '../state/useStore'
import { tracks } from '../data/tracks'

/**
 * Minimal corner indicator shown while the speaker playlist is on: a small
 * glassy pill with animated equalizer bars + the current track. Non-interactive.
 */
export function NowPlayingChip() {
  const musicOn = useStore((s) => s.musicOn)
  const order = useStore((s) => s.order)
  const trackIndex = useStore((s) => s.trackIndex)

  if (!musicOn) return null
  const track = tracks[order[trackIndex]]
  if (!track) return null

  return (
    <div className="np-chip" aria-live="polite">
      <div className="np-chip-eq">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="np-chip-meta">
        <span className="np-chip-title">{track.title}</span>
        <span className="np-chip-artist">{track.artist}</span>
      </div>
    </div>
  )
}
