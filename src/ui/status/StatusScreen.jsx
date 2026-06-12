import { useEffect, useState } from 'react'
import { useStore } from '../../state/useStore'
import { statusData } from './statusData'
import { useNowPlaying } from './useNowPlaying'

/**
 * Monitor B: bento-grid status dashboard — now playing (Spotify), currently
 * reading, contact, and a live clock/status strip. Default export for React.lazy.
 */
export default function StatusScreen() {
  const active = useStore((s) => s.currentView === 'monitor2')
  const now = useNowPlaying(active)
  const { contact, reading, statusLine } = statusData

  return (
    <div className="bento">
      <NowPlayingTile now={now} />
      <ReadingTile reading={reading} />

      <a className="bento-tile bento-contact" href={`mailto:${contact.email}`}>
        <span className="bento-label">email</span>
        <span className="bento-handle">{contact.email}</span>
      </a>

      <a
        className="bento-tile bento-contact"
        href={contact.linkedinUrl}
        target="_blank"
        rel="noreferrer"
      >
        <span className="bento-label">linkedin</span>
        <span className="bento-handle">{contact.linkedinHandle}</span>
      </a>

      <StatusStrip line={statusLine} />
    </div>
  )
}

function NowPlayingTile({ now }) {
  return (
    <div className="bento-tile bento-now-playing">
      <div className="bento-label">
        <span className={'np-dot' + (now.isPlaying ? ' is-live' : '')} />
        {now.isPlaying ? 'now playing' : 'last played'}
      </div>
      <div className="np-body">
        {now.albumArt ? (
          <img className="np-art" src={now.albumArt} alt="" />
        ) : (
          <div className="np-art np-art-empty">♪</div>
        )}
        <div className="np-meta">
          <div className="np-track">
            {now.url ? (
              <a href={now.url} target="_blank" rel="noreferrer">{now.track}</a>
            ) : (
              now.track
            )}
          </div>
          <div className="np-artist">{now.artist}</div>
        </div>
      </div>
      <div className={'np-eq' + (now.isPlaying ? ' is-playing' : '')}>
        <span /><span /><span /><span /><span />
      </div>
    </div>
  )
}

function ReadingTile({ reading }) {
  const [coverFailed, setCoverFailed] = useState(false)
  const coverUrl = `https://covers.openlibrary.org/b/isbn/${reading.isbn}-M.jpg`

  return (
    <div className="bento-tile bento-reading">
      <div className="bento-label">currently reading</div>
      <div className="reading-body">
        {coverFailed ? (
          <div className="reading-cover reading-cover-fallback">
            <span>{reading.title}</span>
          </div>
        ) : (
          <img
            className="reading-cover"
            src={coverUrl}
            alt={`${reading.title} cover`}
            onError={() => setCoverFailed(true)}
          />
        )}
        <div className="reading-meta">
          <div className="reading-title">{reading.title}</div>
          <div className="reading-author">{reading.author}</div>
          <div className="reading-bar">
            <div className="reading-bar-fill" style={{ width: `${reading.progress * 100}%` }} />
          </div>
          <div className="reading-pct">{Math.round(reading.progress * 100)}%</div>
        </div>
      </div>
    </div>
  )
}

function StatusStrip({ line }) {
  const [time, setTime] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="bento-tile bento-strip">
      <span className="strip-clock">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
      <span className="strip-line">{line}</span>
    </div>
  )
}
