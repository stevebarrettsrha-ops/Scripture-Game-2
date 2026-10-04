# Playing THE VOYAGE on your own computer

The whole game is in this folder: the world, three.js, *The Fullness of Time*, *Scripture
Unfolds*, the Besorah and every recorded voice. Once it is downloaded, nothing is fetched from the
internet. Your progress is kept in the [`saves/`](saves/README.md) folder inside it.

## 1. Download the game

**With Git** (easiest to update later):

```sh
git clone --depth 1 https://github.com/stevebarrettsrha-ops/Scripture-Game-2.git
```

**Without Git**: on the repository's GitHub page choose **Code → Download ZIP**, then unzip it
somewhere you will keep it, such as your Documents folder. Don't play it from inside the zip.
(If the repository is private, sign in to GitHub first.)

> Until the branch `claude/upbeat-maxwell-knw3wi` is merged into `main`, these launchers are on
> that branch only. Clone it with
> `git clone --depth 1 -b claude/upbeat-maxwell-knw3wi https://github.com/stevebarrettsrha-ops/Scripture-Game-2.git`,
> or download
> <https://github.com/stevebarrettsrha-ops/Scripture-Game-2/archive/refs/heads/claude/upbeat-maxwell-knw3wi.zip>.

The download is about 60 MB.

## 2. Play

| Computer | Double-click | Needs |
|---|---|---|
| **Windows** 10 / 11 | `Play-Windows.bat` | nothing; Windows PowerShell is built in |
| **macOS** | `Play-Mac.command` | nothing extra if Python 3 or Node.js is installed; otherwise it opens the game straight from the folder |
| **Linux** | `Play-Linux.sh` (or run `./Play-Linux.sh`) | Python 3 (almost always installed) or Node.js |

The game opens in your default browser. A small window stays open beside it, and that window is
the game's server on this computer. **Leave it open while you play, and close it to stop.**

To go straight to a part of the game, add its name:
`Play-Windows.bat story` (The Fullness of Time) or `Play-Windows.bat unfolds` (Scripture
Unfolds). The same works for the Mac and Linux launchers.

## 3. Put it on the desktop (optional)

| Computer | Double-click once | You get |
|---|---|---|
| Windows | `Install-Desktop-Shortcut-Windows.bat` | **The Voyage** and **The Fullness of Time** on the desktop and in the Start menu |
| macOS | `Install-Desktop-Shortcut-Mac.command` | the same two apps on the Desktop and in your Applications folder (Launchpad and Spotlight find them) |
| Linux | `Install-Desktop-Shortcut-Linux.sh` | the same two launchers on the desktop and in the applications menu |

A shortcut starts the server quietly, which on Windows means a minimized window, and opens the
game. If the game is already running, it opens another view of it. Left alone, the server stops
itself after three idle hours.

The shortcuts point at this folder. **If you move the folder, run the installer again.** To take
the shortcuts off, run the installer with `remove` on Windows (`Install-Desktop-Shortcut-Windows.bat remove`)
or `--remove` on macOS and Linux.

## Your progress: the `saves/` folder

Played this way, everything the game keeps is written into `saves/`: the voyage, the log and
scrolls, the story's acts and choices, the settings, and every block dug or built. That means:

- it survives clearing the browser's data;
- it is the same progress in every browser on the computer;
- you can **back it up** or **carry it to another computer** by copying the folder;
- you can **start afresh** by emptying it (keep its README), with the game closed.

The first time the game is played this way, any progress the browser was already keeping for it
is carried into the folder. See [`saves/README.md`](saves/README.md) for what each file is.

## First-time warnings

Files downloaded from the internet are marked as such, and the operating system may ask once:

- **Windows** may show "Windows protected your PC". Choose **More info → Run anyway**. (Or
  right-click the zip before unzipping, choose **Properties**, tick **Unblock**, then OK.)
- **macOS** may say the file "cannot be opened because it is from an unidentified developer".
  **Right-click** (or Control-click) the file, choose **Open**, then **Open** again. After the
  first time a double-click is enough. A clone made with `git` is not marked, and does not ask.
- **Linux**: if double-clicking opens the script in a text editor, run it from a terminal
  (`./Play-Linux.sh`) or allow "Run as a program" in the file's properties.

## Updating

With Git: `git pull` in the game folder. With a ZIP: download the new ZIP, unzip it, and copy your
old `saves/` folder into the new one. Your saves are never part of an update: Git leaves them
alone (see `.gitignore`).

## How it works

- `local/serve.ps1` (Windows), `local/serve.py` (Python 3) and `local/serve.js` (Node.js) are
  the same small web server written three times, so that every computer has one with nothing to
  install. Each one serves only this folder, and only to this computer (`localhost`, never the
  network). Each one always uses the same port, 8642, because the browser keeps a game's working
  storage per address. If that port is taken it tries the next one up.
- `local/saves.js` keeps the browser's storage and the `saves/` folder in step. Online, or when
  the page is opened straight from the folder, it does nothing, and the game saves in the
  browser as before.
- Played from this computer, the game takes the copy of three.js in this folder at once instead
  of asking the internet first.
- `local/launch.sh` picks Python 3, then Node.js, for macOS and Linux. If neither is installed
  it opens `index.html` straight from the folder, which also plays, but then progress is kept in
  the browser only.
- `local/install-shortcuts.ps1` and `local/install-shortcuts.sh` make the shortcuts. Their icon
  is drawn from `local/icon.svg` by `node local/make-icons.js`.
