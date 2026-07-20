# The great cities — one file per flagship coastal city

The major coastal trading cities each live in their own file here. A land with
a city file grows a **large city** (paved plaza, wells of water, market and
fish stalls, lamp-lit streets, and rows of homes — one house per resident).
Every other land keeps its small village. Edit a file, reload, and the city
rebuilds from it — no build step.

## What a city file looks like

```js
EARTH.city({
country:"Egypt",      // the land this city belongs to — must match a country name exactly
name:"No-Amon",       // the city's name, shown on the shore ("NO-AMON — EGYPT")
houses:13,            // how many homes (each is one resident's own house)
size:3,               // overall scale, 1 (modest) .. 3 (grand): plaza size, wells, stalls
market:true,          // a row of market stalls off the plaza
fishStall:true,       // a fishmonger's stall by the pier
streets:true,         // paved/dirt streets on a grid
wells:2               // how many wells of water
});
```

## Common edits

- **Rename the city** — change `name`.
- **Make it bigger/smaller** — change `houses` and `size`.
- **Add or drop a feature** — set `market` / `fishStall` / `streets` true or false,
  or change `wells`.
- **Move a city to another land** — change `country` to another country's exact name
  (see `../countries/`), then add a matching `<script src="cities/yourfile.js">` line
  in `index.html` if it's a new file.

## Add a new city

1. Copy any file here, change the fields, save it as `cities/<name>.js`.
2. Add `<script src="cities/<name>.js"></script>` in `index.html` next to the
   other city files (order doesn't matter for cities).
3. Reload. That land now grows a city instead of a village.

The residents each own one of the houses and head home when the sun goes down.
Everything is procedural from these fields — you tune the look and feel here,
the generator lays out the streets, plaza, stalls and homes.
