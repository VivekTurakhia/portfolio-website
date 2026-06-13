/**
 * Vercel serverless function: returns the user's currently-playing Spotify
 * track, falling back to the most recently played one. Secrets live in Vercel
 * env vars (see SPOTIFY_SETUP.md) — nothing sensitive ships to the browser.
 *
 * Response: { isPlaying, track, artist, albumArt, url }
 */
const TOKEN_URL = 'https://accounts.spotify.com/api/token'
const NOW_PLAYING_URL = 'https://api.spotify.com/v1/me/player/currently-playing'
const RECENTLY_PLAYED_URL = 'https://api.spotify.com/v1/me/player/recently-played?limit=1'

async function getAccessToken() {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) return null

  const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  })
  if (!res.ok) return null
  const json = await res.json()
  return json.access_token ?? null
}

function shape(item, isPlaying) {
  return {
    isPlaying,
    track: item.name,
    artist: item.artists.map((a) => a.name).join(', '),
    albumArt: item.album?.images?.[1]?.url ?? item.album?.images?.[0]?.url ?? null,
    url: item.external_urls?.spotify ?? null,
  }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60')

  const token = await getAccessToken()
  if (!token) return res.status(503).json({ error: 'spotify not configured' })
  const auth = { headers: { Authorization: `Bearer ${token}` } }

  // Currently playing (204 = nothing playing right now)
  const nowRes = await fetch(NOW_PLAYING_URL, auth)
  if (nowRes.status === 200) {
    const json = await nowRes.json()
    if (json?.item) return res.status(200).json(shape(json.item, json.is_playing === true))
  }

  // Fall back to the last played track
  const recentRes = await fetch(RECENTLY_PLAYED_URL, auth)
  if (recentRes.ok) {
    const json = await recentRes.json()
    const item = json?.items?.[0]?.track
    if (item) return res.status(200).json(shape(item, false))
  }

  return res.status(502).json({ error: 'spotify unavailable' })
}
