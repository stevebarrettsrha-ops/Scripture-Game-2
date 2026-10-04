#!/bin/sh
# Puts THE VOYAGE on this computer's desktop: two shortcuts, "The Voyage" and "The Fullness of
# Time" (story mode), with the game's mark. Each starts the local server in the background
# (local/launch.sh --background) and opens the game in the default browser - no internet
# needed. The server stops itself after three idle hours.
#
#   macOS: app bundles on the Desktop and in ~/Applications (so Launchpad and Spotlight find them)
#   Linux: launchers on the Desktop and in the applications menu (~/.local/share/applications)
#
#   local/install-shortcuts.sh [--remove]
#
# The shortcuts point at this folder: if the folder is moved, run this again.
set -e
REMOVE=0
[ "$1" = "--remove" ] && REMOVE=1
HERE=$(cd "$(dirname "$0")" && pwd)
ROOT=$(cd "$HERE/.." && pwd)
chmod +x "$HERE/launch.sh" "$HERE/serve.py" "$HERE/serve.js" 2>/dev/null || true

# the two shortcuts: name | page | id
ITEMS='The Voyage|voyage|voyage
The Fullness of Time|story|fullness'

# a path made safe inside single quotes in a shell script
sq() { printf "'%s'" "$(printf '%s' "$1" | sed "s/'/'\\\\''/g")"; }

mac() {
  DESK="$HOME/Desktop"; APPS="$HOME/Applications"
  echo "$ITEMS" | while IFS='|' read -r NAME PAGE ID; do
    for DIR in "$DESK" "$APPS"; do
      APP="$DIR/$NAME.app"
      if [ $REMOVE = 1 ]; then [ -d "$APP" ] && rm -rf "$APP" && echo "Removed $APP"; continue; fi
      mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"
      cat > "$APP/Contents/Info.plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>CFBundleName</key><string>$NAME</string>
  <key>CFBundleDisplayName</key><string>$NAME</string>
  <key>CFBundleIdentifier</key><string>local.scripture-game.$ID</string>
  <key>CFBundleExecutable</key><string>launch</string>
  <key>CFBundleIconFile</key><string>icon</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>CFBundleShortVersionString</key><string>1.0</string>
  <key>LSApplicationCategoryType</key><string>public.app-category.games</string>
</dict></plist>
PLIST
      printf '#!/bin/sh\nexec /bin/sh %s %s --background\n' "$(sq "$ROOT/local/launch.sh")" "$PAGE" > "$APP/Contents/MacOS/launch"
      chmod +x "$APP/Contents/MacOS/launch"
      cp "$HERE/icon.icns" "$APP/Contents/Resources/icon.icns"
      touch "$APP"
      echo "Made $APP"
    done
  done
}

linux() {
  APPS="${XDG_DATA_HOME:-$HOME/.local/share}/applications"
  DESK=$(xdg-user-dir DESKTOP 2>/dev/null || true); [ -n "$DESK" ] || DESK="$HOME/Desktop"
  # a path inside a quoted Exec argument: \ " ` $ escaped (the desktop-entry rules)
  q=$(printf '%s' "$ROOT/local/launch.sh" | sed 's/[\\"`$]/\\\\&/g')
  echo "$ITEMS" | while IFS='|' read -r NAME PAGE ID; do
    for DIR in "$APPS" "$DESK"; do
      F="$DIR/scripture-game-$ID.desktop"
      if [ $REMOVE = 1 ]; then [ -f "$F" ] && rm -f "$F" && echo "Removed $F"; continue; fi
      [ "$DIR" = "$DESK" ] && [ ! -d "$DESK" ] && continue
      mkdir -p "$DIR"
      cat > "$F" <<DESKTOP
[Desktop Entry]
Type=Application
Version=1.0
Name=$NAME
Comment=Played offline from this computer
Exec=sh "$q" $PAGE --background
Icon=$ROOT/local/icon.png
Terminal=false
Categories=Game;Education;
StartupNotify=false
DESKTOP
      chmod +x "$F"
      command -v gio >/dev/null 2>&1 && gio set "$F" metadata::trusted true 2>/dev/null || true
      echo "Made $F"
    done
  done
  command -v update-desktop-database >/dev/null 2>&1 && update-desktop-database "$APPS" 2>/dev/null || true
}

case "$(uname)" in
  Darwin) mac ;;
  *) linux ;;
esac
echo
if [ $REMOVE = 1 ]; then echo "The shortcuts are removed. The game folder itself is untouched."
else echo "Done. Double-click \"The Voyage\" or \"The Fullness of Time\" on your desktop to play."; fi
