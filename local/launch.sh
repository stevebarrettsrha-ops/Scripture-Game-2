#!/bin/sh
# THE VOYAGE, started on this computer (macOS and Linux). Called by Play-Mac.command,
# Play-Linux.sh and the desktop shortcuts:
#
#   local/launch.sh [voyage|story|unfolds] [--background]
#
# Serves the game folder on 127.0.0.1 with Python 3 (or Node.js when there is no Python) and
# opens it in the default browser. With neither, the page is opened straight from the folder,
# which plays too (three.js and every file the game needs are in it). --background is used by
# the desktop shortcuts: no window to keep open; the server stops itself after three idle hours.

PAGE=voyage; BG=0
for a in "$@"; do
  case "$a" in
    voyage|story|unfolds) PAGE=$a ;;
    --background) BG=1 ;;
    *) echo "usage: $0 [voyage|story|unfolds] [--background]"; exit 2 ;;
  esac
done
HERE=$(cd "$(dirname "$0")" && pwd)
ROOT=$(cd "$HERE/.." && pwd)
LOG="${TMPDIR:-/tmp}/scripture-game-server.log"

# a Python that is really there (on a Mac without the developer tools /usr/bin/python3 is
# only a stub that asks to install them; it is passed over rather than set off)
find_python() {
  for p in python3 python; do
    command -v "$p" >/dev/null 2>&1 || continue
    if [ "$(uname)" = Darwin ] && [ "$(command -v "$p")" = /usr/bin/python3 ] && ! xcode-select -p >/dev/null 2>&1; then continue; fi
    "$p" -c 'import sys, http.server; sys.exit(0 if sys.version_info >= (3, 7) else 1)' >/dev/null 2>&1 && { echo "$p"; return 0; }
  done
  return 1
}

run() {
  if [ "$BG" = 1 ]; then
    nohup "$@" --idle-minutes 180 >"$LOG" 2>&1 &
  else
    exec "$@"
  fi
}

if PY=$(find_python); then
  run "$PY" "$HERE/serve.py" "$PAGE"
elif command -v node >/dev/null 2>&1; then
  run node "$HERE/serve.js" "$PAGE"
else
  case "$PAGE" in voyage) F=index.html ;; story) F=story/index.html ;; unfolds) F=scripture-unfolds/index.html ;; esac
  echo "Neither Python 3 nor Node.js was found, so the game is opened straight from its folder."
  echo "(It plays the same; installing Python 3 lets the launcher serve it, which some browsers prefer.)"
  if [ "$(uname)" = Darwin ]; then open "$ROOT/$F"; else xdg-open "$ROOT/$F" >/dev/null 2>&1 || echo "Open this file in your browser: $ROOT/$F"; fi
fi
