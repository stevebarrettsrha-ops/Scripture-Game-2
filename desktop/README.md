# The Voyage — the desktop game (Linux and Windows)

The same game as the folder and the launchers, as a program of its own: it always draws on the
computer's real graphics card, gives the true earth the memory it wants, and keeps its saves in the
program's own data folder (Play › Open the saves folder).

## Getting it

- **From GitHub:** the *Desktop game* workflow builds it on every `v*` tag (and on demand from the
  Actions tab). Download from the Release (or the run's page):
  - Linux: `The-Voyage-…-linux-x86_64.AppImage` (one file) or `…-linux-x64.tar.gz`
  - Windows: `The-Voyage-…-windows-x64.exe` (installer) or `…-windows-x64.zip`

### Ubuntu

```sh
chmod +x The-Voyage-*-linux-x86_64.AppImage
./The-Voyage-*-linux-x86_64.AppImage
```

On Ubuntu 22.04 and later an AppImage wants `libfuse2` (`sudo apt install libfuse2`); or use the
`.tar.gz`: unpack it and run `./the-voyage`. The graphics card must have its own driver — for an
NVIDIA card, *Software & Updates › Additional Drivers*, or `sudo ubuntu-drivers install`.
**Play › What draws the game** shows whether the card is in use.

## Building it yourself

```sh
cd desktop
npm install
npm start               # play from the repository, no build
npm run dist:linux      # AppImage + tar.gz into desktop/dist
npm run dist:win        # Windows .zip (the installer wants Windows, or Wine on Linux)
```

`stage.js` copies the game's files (not the tools, the screenshots or anyone's saves) into
`desktop/game`, which the build carries as the program's resources.

Ctrl+1 the voyage · Ctrl+2 The Fullness of Time · Ctrl+3 Scripture Unfolds · F11 whole screen.
