import { useEffect } from 'react'
import { useStore } from '../../state/useStore'
import { statusData } from './statusData'

const POLL_MS = 45_000
const coverUrl = (isbn) => `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`

/**
 * Always mounted. When the monitor2 view becomes active — which happens the
 * moment it's clicked, i.e. while the camera is still flying in — it fetches the
 * Spotify track and preloads the images (album art + book cover) into the store,
 * so <StatusScreen> has everything ready by the time it reveals. This is why the
 * dashboard tiles appear fully loaded instead of popping in.
 *
 * Committing `nowPlaying` only after the album art has preloaded (and flipping
 * `coverReady` only after the cover loads) means the gate in StatusScreen never
 * shows half-loaded content — including on the 45s background refresh.
 */
export function NowPlayingController() {
  const active = useStore((s) => s.currentView === 'monitor2')

  useEffect(() => {
    if (!active) return
    let cancelled = false

    // Preload the currently-reading cover; treat an error as "ready" too so a
    // failed cover falls back to the CSS spine without holding up the reveal.
    const cover = new Image()
    cover.onload = cover.onerror = () => {
      if (!cancelled) useStore.getState().setCoverReady()
    }
    cover.src = coverUrl(statusData.reading.isbn)

    const commit = (data) => {
      if (cancelled) return
      if (data.albumArt) {
        const art = new Image()
        art.onload = art.onerror = () => {
          if (!cancelled) useStore.getState().setNowPlaying(data)
        }
        art.src = data.albumArt
      } else {
        useStore.getState().setNowPlaying(data)
      }
    }

    const fetchNow = async () => {
      let data = statusData.fallbackTrack
      try {
        const res = await fetch('/api/spotify-now-playing')
        if (res.ok) {
          const json = await res.json()
          if (json && json.track) data = json
        }
      } catch {
        /* keep fallback */
      }
      commit(data)
    }

    fetchNow()
    const id = setInterval(fetchNow, POLL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [active])

  return null
}
