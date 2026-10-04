#!/bin/sh
# Puts "The Voyage" and "The Fullness of Time" on your Desktop and in your Applications folder:
# double-click this file. (The first time, if macOS says it cannot be opened, right-click it
# and choose Open.) To take them off again, run it from Terminal with --remove.
cd "$(dirname "$0")" && sh local/install-shortcuts.sh "$@"
echo; echo "You can close this window."
