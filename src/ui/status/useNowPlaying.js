import { useEffect, useState } from 'react'
import { statusData } from './statusData'

const POLL_MS = 45_000

/**
 * Polls the Vercel serverless endpoint for the current Spotify track — but only
 * while `active` (the monitor2 view is on screen), so an idle tab isn't pinging
 * the API. Falls back to statusData.fallbackTrack when the endpoint is missing
 * (local dev) or errors.
 */
export function useNowPlaying(active) {
  const [data, setData] = useState(statusData.fallbackTrack)

  useEffect(() => {
    if (!active) return
    let cancelled = false

    const fetchNow = async () => {
      try {
        const res = await fetch('/api/spotify-now-playing')
        if (!res.ok) throw new Error(String(res.status))
        const json = await res.json()
        if (!cancelled && json && json.track) setData(json)
      } catch {
        if (!cancelled) setData(statusData.fallbackTrack)
      }
    }

    fetchNow()
    const id = setInterval(fetchNow, POLL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [active])

  return data
}
