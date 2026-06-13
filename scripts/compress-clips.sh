#!/usr/bin/env bash
# One-time asset prep: re-encode the raw clips in "Movie Clips/" to web-friendly
# 720p MP4s in public/movies/. Originals are untouched (and gitignored).
set -euo pipefail
cd "$(dirname "$0")/.."

SRC="Movie Clips"
OUT="public/movies"
mkdir -p "$OUT"

encode() { # encode <input> <output-basename>
  local in="$1" out="$OUT/$2.mp4"
  if [ -f "$out" ]; then echo "skip (exists): $out"; return; fi
  ffmpeg -y -i "$in" \
    -vf "scale=-2:720" -c:v libx264 -crf 27 -preset slow -pix_fmt yuv420p \
    -c:a aac -b:a 128k -movflags +faststart \
    "$out" </dev/null
  echo "wrote: $out ($(du -h "$out" | cut -f1))"
}

encode "$SRC/Interstellar Murph Saves The World (Full Scene) Paramount Movies - Paramount Movies (1080p).mp4" interstellar
encode "$SRC/Inglourious Basterds (59) Movie CLIP - Go Out Speaking the King's (2009) HD - Movieclips (1080p).mp4" basterds
encode "$SRC/The Dark Knight (2008) - Some Men Just Want to Watch the World Burn Scene Movieclips - Movieclips (1080p).mp4" dark-knight
encode "$SRC/moneyball.mp4" moneyball
encode "$SRC/Gladiator (2000) - My Name is Maximus Scene Movieclips - Movieclips (1080p).mp4" gladiator

echo "done."; du -sh "$OUT"
