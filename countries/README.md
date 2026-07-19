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
site:[31.78,35.23]          // OPTIONAL [lat, lon] — put the village where you choose
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

## The rivers

The navigable rivers live in `../world/rivers.js` as chains of `[lat,lon]`
waypoints from mouth to source — same idea: edit, reload, sail up your river.
