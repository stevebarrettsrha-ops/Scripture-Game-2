# The lands of the earth — one file per country

Every country in the game lives in its own file here. Edit a file, reload the
game, and the world rebuilds from it — no build step, nothing else to touch.

## What a country file looks like

```js
EARTH.country({
n:"Israel",                 // the name shown on the map and the shore
c:[0.176,0.263],            // centre [u,v] on the circle of the earth
p:[[[u,v],[u,v],...]],      // coastline rings (first point = last point)
verse:{ t:"the words shown the first time you come ashore here",
        ref:"BOOK 1:2" },   // OPTIONAL — omit it and a general greeting is used
site:[31.78,35.23],         // OPTIONAL [lat, lon] — put the village where you choose
beaches:[ ... ]             // OPTIONAL — this land's own shores (see below)
});
```

## The coordinate system

The world is the "circle of the earth": the north pole at the centre, the wall
of ice at the rim. A point at latitude/longitude becomes `[u,v]` by:

```
r = (90 - lat) / 180        // 0 at the pole, 1 at the rim
u = r * sin(lon * π/180)
v = r * cos(lon * π/180)
```

`1.0` of radius is 20,000 km; one game block is one kilometre.

## Common edits

- **Give a land its own verse** — add the `verse:{t,ref}` field. It appears the
  first time the player comes ashore there and is remembered in the ship's log.
- **Move the village** — add `site:[lat,lon]`. The village settles on the
  nearest spot of that land to the place you name (it prefers coasts otherwise).
- **Fix a coastline** — edit the `p` rings. Keep each ring closed (repeat the
  first point at the end) and keep the points in `[u,v]` form.
- **Add a land** — copy any file, change the fields, and add a
  `<script src="countries/your-file.js"></script>` line to `index.html`
  alongside the others. Order in `index.html` fixes the load order — new lands
  go at the END of the list so saved games keep their meaning.

## This land's own shores

Every coast in the world carries a **wading shelf** at its foot — a broad,
near-flat floor of sand a man can walk out across and a village can stand in,
before the ground falls away toward the shelf break at 200 m. A land may name
its own stretches of that shore and give each its character:

```js
beaches:[
  {n:"Bondi", lat:-33.89, lon:151.27, r:700, wadeM:2.5, wadeR:280, roll:1.1, sand:'gold'}
]
```

| field | what it does |
|-------|--------------|
| `n` | the beach's name |
| `lat` / `lon` | where it lies |
| `r` | how far its character reaches along the coast, in world units (6 units = 1 km on the chart) |
| `wadeM` | how deep the water is at the OUTER EDGE of the wading shelf, in metres. Everything shallower than this is paddling. |
| `wadeR` | how far that shelf reaches out from the strand, in world units. The whole shoal band is ~527. |
| `roll` | how much the wading floor rises and falls within itself, in metres — sandbars and runnels. `0` is a billiard table. |
| `sand` | `'pale'` (white coral sand, the default), `'gold'`, `'black'` (volcanic), `'shingle'` (grey stone), `'coral'` |

A named beach **eases into** the world's common shore across its radius, so
there is never a seam where one stops and the other begins. Leave any field
out and the common shore's value is used (2.2 m over 240 units).

Wide and shallow (`wadeM` low, `wadeR` high) gives a lagoon you can walk out
into for a long way; steep (`wadeM` high, `wadeR` low) gives a shingle bank
that drops away at the first step, as Chesil does.

## The rivers

The navigable rivers live in `../world/rivers.js` as chains of `[lat,lon]`
waypoints from mouth to source — same idea: edit, reload, sail up your river.
