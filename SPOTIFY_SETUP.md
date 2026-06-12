# Spotify "Now Playing" setup (one-time, ~10 minutes)

The status monitor shows your live Spotify track via `api/spotify-now-playing.js`
(a Vercel serverless function). It needs three env vars. Until they're set, the
site shows a graceful "Spotify not connected" fallback — nothing breaks.

## 1. Create a Spotify app
1. Go to https://developer.spotify.com/dashboard and click **Create app**.
2. Name: anything (e.g. `portfolio`). Redirect URI: `http://127.0.0.1:8888/callback`.
3. Copy the **Client ID** and **Client Secret**.

## 2. Get a refresh token
You authorize your own account once; the refresh token then works indefinitely.

1. Open this URL in a browser (replace `CLIENT_ID`):

   ```
   https://accounts.spotify.com/authorize?client_id=CLIENT_ID&response_type=code&redirect_uri=http://127.0.0.1:8888/callback&scope=user-read-currently-playing%20user-read-recently-played
   ```

2. Approve. You'll land on a dead page — copy the `code=...` value from the URL bar.

3. Exchange the code (replace CLIENT_ID, CLIENT_SECRET, CODE; runs in any shell):

   ```bash
   curl -s -X POST https://accounts.spotify.com/api/token \
     -H "Authorization: Basic $(printf 'CLIENT_ID:CLIENT_SECRET' | base64)" \
     -d grant_type=authorization_code -d code=CODE \
     -d redirect_uri=http://127.0.0.1:8888/callback
   ```

4. Copy the `refresh_token` from the JSON response.

## 3. Set Vercel env vars
In the Vercel project → Settings → Environment Variables, add:

| Name | Value |
|---|---|
| `SPOTIFY_CLIENT_ID` | from step 1 |
| `SPOTIFY_CLIENT_SECRET` | from step 1 |
| `SPOTIFY_REFRESH_TOKEN` | from step 2 |

Redeploy. The dashboard's "now playing" tile goes live (polls every 45s while
the status monitor is on screen; responses are edge-cached for 30s).

## Local dev
`vite dev` has no `/api` runtime, so locally you'll always see the fallback.
To test the function locally use `vercel dev` instead.
