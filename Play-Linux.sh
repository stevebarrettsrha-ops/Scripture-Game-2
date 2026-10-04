#!/bin/sh
# Play THE VOYAGE on this computer, with no internet needed. Run it from a terminal
# (./Play-Linux.sh) or double-click it and choose "Run in Terminal". Add `story` to go
# straight to The Fullness of Time, or `unfolds` for Scripture Unfolds.
cd "$(dirname "$0")" && exec sh local/launch.sh "$@"
