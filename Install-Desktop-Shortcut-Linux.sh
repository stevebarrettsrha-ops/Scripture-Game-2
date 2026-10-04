#!/bin/sh
# Puts "The Voyage" and "The Fullness of Time" on your desktop and in the applications menu:
# ./Install-Desktop-Shortcut-Linux.sh        (add --remove to take them off again)
cd "$(dirname "$0")" && exec sh local/install-shortcuts.sh "$@"
