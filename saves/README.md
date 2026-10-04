# Your saved progress

When THE VOYAGE is started from this computer — `Play-Windows.bat`, `Play-Mac.command`,
`Play-Linux.sh`, or the desktop shortcuts — everything the game keeps is written into this
folder:

| File | What it holds |
|---|---|
| `voyage~3astate.json` | the voyage: where the ship lies, the log, the scrolls found, the satchel |
| `fullness~3av1.json` | The Fullness of Time: the acts played, the choices made, the journal |
| `world/*.json` | every block dug or built, one file for each edited piece of the world |
| `world/blocks.json` | the table those files are read with |
| the other `.json` files | settings, the hints already shown, the voice choices |

- **Back up** your progress by copying this folder somewhere safe.
- **Move it to another computer** by copying this folder into the same place in the game
  folder there.
- **Start afresh** by deleting everything in this folder except this README (do it while the
  game is closed).
- It is the same progress in every browser on this computer.

Played online, or by opening `index.html` straight from the folder, the game keeps its progress
in the browser instead, as it always has.

These files are yours: they are never sent anywhere, and git leaves them out (see
`.gitignore`), so updating the game never touches them.
