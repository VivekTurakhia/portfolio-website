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
Client ID: f1001f25f17b4e0690b0b8fb06a2c7c8

Client Secret: 9f7b30c5ece942bda76328092a5c512c

URL:
http://127.0.0.1:8888/callback?code=AQAKz2BiBOOTpAjxHHJiUHKUKD1ajWKvuJAsjdrkk4yc0QCtSI7yrdtH2KC5DrfOC-4odZSVC0biiw9h2Kr9-hb2eTsUd4fhEW1c3XrclBaMaPgBHncCPDiZ-uofY_-9xje7-2wFziFciJwdASZq1qn9SE7nDfPEa-DdSnAbEi3D8HvvUZNmRgn2IsmXgS971pkXqSk3j_XViVJVhV2uk9CZAkBwzCoqtuLAatQgv5meFEzZa63D94eq
2. Approve. You'll land on a dead page — copy the `code=...` value from the URL bar.

3. Exchange the code (replace CLIENT_ID, CLIENT_SECRET, CODE; runs in any shell):

   ```bash
   curl -s -X POST https://accounts.spotify.com/api/token \
     -H "Authorization: Basic $(printf 'f1001f25f17b4e0690b0b8fb06a2c7c8:9f7b30c5ece942bda76328092a5c512c' | base64)" \
     -d grant_type=authorization_code -d code=AQAKz2BiBOOTpAjxHHJiUHKUKD1ajWKvuJAsjdrkk4yc0QCtSI7yrdtH2KC5DrfOC-4odZSVC0biiw9h2Kr9-hb2eTsUd4fhEW1c3XrclBaMaPgBHncCPDiZ-uofY_-9xje7-2wFziFciJwdASZq1qn9SE7nDfPEa-DdSnAbEi3D8HvvUZNmRgn2IsmXgS971pkXqSk3j_XViVJVhV2uk9CZAkBwzCoqtuLAatQgv5meFEzZa63D94eq \
     -d redirect_uri=http://127.0.0.1:8888/callback
   ```

4. Copy the `refresh_token` from the JSON response.

{"access_token":"BQCwzH17IZ4zE3y8zQSv-8XpMSv6b9_BTwPclf4pjM_hvwlP02Q1e5miWLCnRE3uDn-U_nrr6ZMoPmajAurlYoqck4pFZUY4hcrcyT-XnRrufmTYfdcu1Rmvs1ZvSJA86NpDQiKvXdrks46qbUwNbHtNacnfW8xhAiNKAJmUj1WVjznP79DBYzu3xTvvFGw0YP2NEn_FHUljC2BhvfyvIA1LWF18uAnd0YuuFL6c9H_RTv4IE6HBD2eKXc_0","token_type":"Bearer","expires_in":3600,"refresh_token":"AQB-lvNkELqti7EBMJ_elKRkEfTZdmsp2zPbgojSq3V3nfemLmKXLj_YkkiBLtXFZLoH_YoprvzbmzVCsiIKYdVAnlc5kU9JDyaRUY0l5AF7gzoDwIqM3_Ug3DG4Ytv3lrw","scope":"user-read-currently-playing user-read-recently-played"}

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
