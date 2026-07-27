# The living things — one to a file

Every beast of the sea AND of the field has its own file here. Open one,
change a number, reload the game: that beast is rebuilt from the file.
Nothing else needs touching.

Which lands each beast of the field actually walks in — and what ground it
will set foot on — is not here. That is `world/fauna.js`, and it is all data
too: one line to a nation.

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
| `realm`  | `'sea'` for the beasts of the water, `'land'` for the beasts of the field. It decides two things: the scale the model is drawn at (see below), and which system asks for it — a `'land'` beast is what `makeAnimal` builds when the wildlife of a country calls for it. |
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

**The beasts of the sea are drawn at their true stature; the beasts of the
field at half of it.** Always declare the honest length either way. The world's
cattle, sheep and horses were built by hand long before any of this, at about
half life-size, mob-fashion — so a zebra dropped in beside them at TRUE size
would stand three times the cow in the next field, and would not fit the pens,
byres and folds already standing in every village on the earth. One scale for
the whole herd, and the engine applies it (`LAND_U_PER_M` in `js/engine.js`).

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
| `T.legs4(g,x,z,h,colour[,thick])` | four legs under a body — the thing every beast of the field wants. `x`/`z` are how far out from the middle they stand, `h` how long they are. Pivoted at the HIP (so a leg swings from the shoulder, not the hoof) and enrolled on `userData.legs`, which is what the engine walks. |
| `T.THREE` | the raw library, if you need something unusual |

## Moving parts

Anything the engine animates is handed back on `userData`:

- `legs` — the legs a beast of the field walks on (`T.legs4` fills this in;
  add limbs of your own to it and they swing too — the gorilla's knuckle-arms
  are in this list). Give each one a `userData.ph` of `0` or `Math.PI` so the
  diagonals swing against each other.
- `head` — a head the engine dips when the beast digs or roots
- `jaw` — a jaw the engine snaps shut on a strike
- `tail` — a group the shark wags
- `tents` — the tentacles of a squid or jellyfish
- `wingL` / `wingR` — a ray's wings
- `flL` / `flR` — a turtle's front flippers

If you add a part with one of those names, it moves. If you don't, the beast
is simply still.

## Which way a beast faces

Build every beast **nose toward +z**, upright, centred on the origin. The
engine turns it to face where it swims.

## Which way a beast of the field faces, and where its feet are

The same as everything else: **nose toward +z, upright** — and, for a land
beast, **standing on y = 0**. The engine sets the model down on the ground at
its own origin, so a beast built around the origin sinks to the waist in it.
`T.legs4` already does the right thing; build the body above the legs.

## Adding a beast of the field, from nothing

1. write `creatures/<name>.js`, `realm:'land'`, feet at y=0, nose toward +z;
2. add a line to `keeps` in `world/fauna.js` saying what ground it stands on;
3. name it in whichever lands bear it, in `lands`;
4. add a `<script>` tag for the file in `index.html`.

That is the whole of it. It will be placed, it will graze or hunt, it will
herd, flee, bed down at night and keep out of the countries it does not
belong to, and no line of the engine had to change to have it walk the earth.
