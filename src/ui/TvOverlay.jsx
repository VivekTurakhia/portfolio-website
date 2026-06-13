import { useEffect, useState } from 'react'
import { useStore } from '../state/useStore'
import { movieClips } from '../data/movieClips'

/**
 * DOM overlay shown only while the TV view is active. Cinematic lower-third
 * announces each clip and fades away; a control row advances the cycle. The
 * "favourite films" framing lives in a single faint corner label, per the
 * "subtle" requirement.
 */
export function TvOverlay() {
  const currentView = useStore((s) => s.currentView)
  const tvClipIndex = useStore((s) => s.tvClipIndex)
  const tvAdvance = useStore((s) => s.tvAdvance)
  const [showTitle, setShowTitle] = useState(true)

  // Re-show the lower-third on every clip change, then fade it out.
  useEffect(() => {
    setShowTitle(true)
    const t = setTimeout(() => setShowTitle(false), 4000)
    return () => clearTimeout(t)
  }, [tvClipIndex])

  if (currentView !== 'tv') return null
  const clip = movieClips[tvClipIndex]

  return (
    <div className="tv-overlay">
      <div className="tv-corner-label">
        Vivek&apos;s favourite films · {tvClipIndex + 1}/{movieClips.length}
      </div>

      <div className={'tv-lower-third' + (showTitle ? ' is-visible' : '')}>
        <div className="tv-title">
          {clip.title} <span className="tv-year">({clip.year})</span>
        </div>
        <div className="tv-line">“{clip.line}”</div>
      </div>

      <div className="tv-controls">
        <div className="tv-dots">
          {movieClips.map((c, i) => (
            <span key={c.id} className={'tv-dot' + (i === tvClipIndex ? ' is-active' : '')} />
          ))}
        </div>
        <button className="tv-next" onClick={() => tvAdvance(movieClips.length)}>
          Next film ▸
        </button>
      </div>
    </div>
  )
}
