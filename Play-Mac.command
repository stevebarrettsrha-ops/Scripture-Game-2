#!/bin/sh
# Play THE VOYAGE on this Mac, with no internet needed: double-click this file.
# (The first time, if macOS says it cannot be opened, right-click it and choose Open.)
# Leave the Terminal window open while you play; close it to stop.
cd "$(dirname "$0")" && exec sh local/launch.sh "$@"
