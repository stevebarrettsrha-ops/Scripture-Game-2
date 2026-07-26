# The living things — one to a file

Every beast of the sea has its own file here. Open one, change a number,
reload the game: that beast is rebuilt from the file. Nothing else needs
touching.

## What a file looks like

```js
EARTH.beast({
  name  : 'orca',
  realm : 'sea',
  metres: 8,          // the beast's TRUE adult length
  axis  : 'z',        // which way that length is measured (see below)
  build : function(T){ ... return group; }
});
```

## The fields

| field    | what it does |
|----------|--------------|
| `name`   | how the engine asks for this beast. Must be unique. |
| `realm`  | `'sea'` for now. (`'land'` and `'air'` will follow the same shape.) |
| `metres` | **The beast's true adult length in metres.** This is the one number to change if a creature looks too big or too small. The engine measures the model you build and scales the whole thing so it really is this long. You never have to keep the model's own numbers in proportion with anything else. |
| `axis`   | which way `metres` is measured across the model. `'z'` (default) = nose to tail. `'x'` = wingtip to wingtip — use this for rays and anything wider than it is long. |
| `build`  | draws the beast out of blocks and returns a `THREE.Group`. |

### Why `metres` is the only size number that matters

The world is built at **6 units to the metre** (a block is a metre, and the
traveller stands about two of them). A blue whale is 25 metres, so it must be
150 units from nose to fluke. Rather than ask you to get that right by hand,
`build` may use whatever numbers are convenient — the engine measures what you
made and scales it to `metres`. So:

- want bigger whales? change `metres` in `whale.js`. That is all.
- adding a new beast? build it at any size you like and just declare its metres.

## The toolkit (`T`)

`build` is handed a toolkit so the files need no imports:

| call | what it gives |
|------|---------------|
| `T.group()` | a new empty group to hang parts on |
| `T.box(w,h,d,colour)` | a solid coloured block |
| `T.faces(w,h,d,[px,nx,top,bottom,front,back])` | a block with a different material on each face. Order is +x, −x, top, bottom, +z (front), −z (back). |
| `T.mat(texture)` | a material wearing a pixel texture |
| `T.matc(colour)` | a plain coloured material |
| `T.glass(colour,opacity)` | a see-through material (jellyfish bells) |
| `T.tex(draw)` | a 16×16 pixel texture. `draw(g)` is given a 2D canvas context. |
| `T.speckle(g,rgbArray,amount[,altRgb,altChance])` | fills a texture with speckled noise |
| `T.jit(rgbArray,amount,seed)` → `[r,g,b]` | jitters a colour |
| `T.px(g,x,y,colourString)` | sets one pixel |
| `T.rgb(r,g,b)` → `'rgb(r,g,b)'` | a colour string |
| `T.hash(a,b)` | a repeatable 0..1 number — same every reload |
| `T.THREE` | the raw library, if you need something unusual |

## Moving parts

Anything the engine animates is handed back on `userData`:

- `tail` — a group the shark wags
- `tents` — the tentacles of a squid or jellyfish
- `wingL` / `wingR` — a ray's wings
- `flL` / `flR` — a turtle's front flippers

If you add a part with one of those names, it moves. If you don't, the beast
is simply still.

## Which way a beast faces

Build every beast **nose toward +z**, upright, centred on the origin. The
engine turns it to face where it swims.
