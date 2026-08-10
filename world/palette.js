/* ============================================================
   THE PALETTE — every colour in the world, named once

   The look of this earth used to live in a hundred and forty loose
   triples scattered through the mesher, and every one of them had been
   chosen to sit beside Minecraft's own: a grass of 124,178,86, a stone of
   flat 125,125,125, a sand of 219,207,163. Those are video-game primaries
   — high in chroma, all of one saturation, all of one value — and they
   are not the colours of the country this game is set in.

   What is written here instead are PIGMENTS: the earths and stones men
   actually ground to paint with in the ancient world. Ochre and umber out
   of the ground, terre verte off a green rock, madder from a root, lapis
   out of a mountain in the east, bone burnt white, lamp black off a wick.
   They are duller than a game palette and far more various in value, and
   that is exactly the point — a world made of them reads as HEWN and
   PAINTED and WEATHERED, not as rendered.

   Every texture in js/engine.js draws its colour from this file and from
   nowhere else. So the whole earth may be re-graded from here in an
   afternoon: change `ochre` and every sand, every mud brick, every desert
   flank in a hundred and seventy-seven countries moves with it.

   Nothing here knows what a block is, what a chunk is or what three.js
   is. It is a paint box, and it is only a paint box.
   ============================================================ */
(function(){
'use strict';

/* ---------------- THE PIGMENTS ----------------
   Named as a painter of that world would have named them, and set down in
   plain 0..255. These are the ONLY raw triples in the project. */
const P = {
  /* --- the whites and the greys: burnt bone, chalk cliff, wood ash, soot --- */
  chalk:      [238,236,226],
  bone:       [230,223,206],
  lime:       [220,215,200],
  alabaster:  [226,219,201],
  salt:       [236,238,236],
  ash:        [166,162,152],
  slate:      [104,104,106],
  charcoal:   [ 52, 49, 46],
  lampblack:  [ 26, 25, 24],
  bitumen:    [ 34, 31, 29],          /* the slime pits of Siddim */

  /* --- the earths: what is dug out of the ground and burnt --- */
  ochre:      [198,163, 92],          /* yellow ochre — the commonest earth of them all */
  darkOchre:  [166,132, 70],
  rawSienna:  [176,128, 70],
  burntSienna:[146, 84, 52],
  rawUmber:   [124,100, 70],
  burntUmber: [ 92, 63, 44],
  redOchre:   [152, 76, 54],
  clay:       [168,118, 82],
  terracotta: [186,112, 74],

  /* --- the greens: a green rock, a copper gone green, a leaf in shade --- */
  terreVerte: [116,130, 90],          /* green earth — the olive-grey of the Levant */
  olivine:    [124,134, 80],
  malachite:  [ 74,128, 86],
  verdigris:  [ 76,134,118],
  sap:        [ 96,124, 62],          /* sap green — the one true leaf colour */

  /* --- the blues: ground lapis, ground azurite, vat indigo --- */
  lapis:      [ 48, 74,140],
  azurite:    [ 52,106,148],
  indigo:     [ 40, 52, 82],
  teal:       [ 46,102,128],          /* the colour of clear water over sand */

  /* --- the reds and the purples: a root, a mineral, a shellfish --- */
  madder:     [156, 56, 62],
  cinnabar:   [190, 64, 46],
  tyrian:     [ 96, 48, 90],          /* the purple of the veil */
  scarlet:    [176, 52, 46],

  /* --- the yellows --- */
  saffron:    [222,176, 70],
  orpiment:   [214,178, 74],

  /* --- the stones of the country --- */
  limestone:  [146,138,122],          /* the stone of that world; NOT granite grey */
  sandstone:  [190,163,120],
  basalt:     [ 76, 74, 72],
  flint:      [ 92, 92, 96],
  marble:     [214,210,198],

  /* --- the metals, for the works of §4 --- */
  gold:       [212,170, 74],
  silver:     [192,194,198],
  copper:     [170,104, 60],
  bronze:     [152,114, 58],
  iron:       [110,110,114],
  tin:        [176,178,182],
  lead:       [ 96, 98,104],

  /* --- the stones of the breastplate --- */
  onyx:       [ 60, 56, 58],
  sapphire:   [ 44, 68,146],
  jasper:     [156, 74, 56],
  topaz:      [206,164, 68],
  emerald:    [ 42,120, 82],
  sardius:    [150, 50, 42],

  /* --- ice, and the cold light in it --- */
  glacier:    [156,186,222],
  rime:       [212,228,246],
  snow:       [236,242,248]
};

/* ---------------- MIXING ----------------
   A pigment is rarely used neat. These are the three things a painter does
   with one: thin it toward another, drive it down toward black, and lift it
   toward the light. Every one returns a NEW triple — nothing here is ever
   handed back a shared array to be written over. */
function clamp(v){ return v<0?0:v>255?255:Math.round(v); }
function mix(a,b,t){ return [clamp(a[0]+(b[0]-a[0])*t),
                             clamp(a[1]+(b[1]-a[1])*t),
                             clamp(a[2]+(b[2]-a[2])*t)]; }
function shade(c,f){ return [clamp(c[0]*f),clamp(c[1]*f),clamp(c[2]*f)]; }
function lift(c,t){ return mix(c,[255,255,255],t); }
/* and one more, which matters more here than any of them: pull a colour
   toward the warm or the cold WITHOUT changing how bright it is. The whole
   difference between a limestone country and a granite one is this. */
function warm(c,t){ return [clamp(c[0]+t*26),clamp(c[1]+t*6),clamp(c[2]-t*22)]; }

/* ---------------- THE BLOCKS OF THE EARTH ----------------
   Each entry is what one texture is painted with: `b` the body of it, `a`
   the alternate grain speckled through it, and where a thing has a drawn
   feature — a mortar line, a plank seam, a growth ring — the colour of that
   too. The names are the mesher's own texture names, so the two files can
   be read side by side.

   The comment on each line is what the colour WAS, before this file: the
   record of the re-grade, kept where it can be checked. */
const B = {
  /* --- the swards. Olive and dust, not an English lawn --- */
  grassTop:    { b: mix(P.terreVerte, P.olivine, 0.35),        // was 124,178,86
                 a: shade(mix(P.terreVerte,P.rawUmber,0.22),0.86) },
  grassTopTr:  { b: shade(mix(P.sap,P.malachite,0.45),0.94),   // was 96,190,92 — rainforest reads DARK
                 a: shade(mix(P.sap,P.burntUmber,0.24),0.80) },
  grassTopTu:  { b: mix(P.olivine, P.ash, 0.34),               // was 136,148,96
                 a: shade(mix(P.olivine,P.rawUmber,0.3),0.86) },
  grassTopSv:  { b: mix(P.ochre, P.darkOchre, 0.18),           // was 190,166,96 — already right
                 a: shade(P.darkOchre,0.92) },
  /* --- the cut side of the sward: dirt below, a lip of green above --- */
  grassSide:   { b: mix(P.rawUmber, P.clay, 0.30),             // was 134,96,67
                 a: shade(mix(P.rawUmber,P.burntUmber,0.5),0.94),
                 lip: mix(P.terreVerte,P.olivine,0.30) },
  grassSideSv: { b: mix(P.clay, P.redOchre, 0.28),             // was 142,102,64
                 a: shade(mix(P.clay,P.burntUmber,0.4),0.92),
                 lip: mix(P.ochre,P.darkOchre,0.22) },
  dirt:        { b: mix(P.rawUmber, P.clay, 0.24),             // was 134,96,67
                 a: shade(P.burntUmber,1.02) },
  path:        { b: mix(P.darkOchre, P.ash, 0.30),             // was 148,124,82 — trodden, pale
                 a: shade(mix(P.darkOchre,P.rawUmber,0.4),0.94) },
  soil:        { b: shade(P.burntUmber,0.92),                  // was 96,66,42
                 a: shade(P.burntUmber,0.74), furrow: shade(P.burntUmber,0.62) },

  /* --- sand: warmer and browner than the old bleached bone --- */
  sand:        { b: mix(P.sandstone, P.ochre, 0.26),           // was 219,207,163
                 a: shade(mix(P.sandstone,P.darkOchre,0.3),0.94) },

  /* --- the stone of that world is LIMESTONE, and it is warm --- */
  stone:       { b: P.limestone,                               // was flat 125,125,125
                 a: shade(mix(P.limestone,P.rawUmber,0.18),0.88),
                 vein: lift(P.limestone,0.16) },
  cobble:      { b: mix(P.limestone, P.ash, 0.18),             // was 92,92,92 — hewn, not crushed
                 a: lift(P.limestone,0.10),
                 mortar: shade(mix(P.limestone,P.rawUmber,0.4),0.62) },

  /* --- the cold end of the world --- */
  snow:        { b: P.snow, a: shade(P.snow,0.96) },
  ice:         { b: P.glacier, a: shade(P.glacier,0.94), glint: P.rime },

  /* --- water. Teal-leaning, as clear sea over sand truly is; not cobalt --- */
  water:       { b: P.teal,                                    // was 52,94,168
                 a: shade(mix(P.teal,P.indigo,0.3),0.94),
                 sheen: lift(mix(P.teal,P.azurite,0.5),0.42) },
  surf:        { b: lift(P.teal,0.86) },

  /* --- the timber. Wood is not one colour; see WOOD below for the species --- */
  planks:      { b: mix(P.rawSienna, P.ochre, 0.34),           // was 168,134,80
                 a: shade(mix(P.rawSienna,P.rawUmber,0.3),0.94),
                 seam: shade(P.burntUmber,0.86) },
  roof:        { b: mix(P.burntSienna, P.rawUmber, 0.36),      // was 122,88,54 — fired clay tile
                 a: shade(mix(P.burntSienna,P.burntUmber,0.4),0.92),
                 seam: shade(P.burntUmber,0.66) },
  logSide:     { b: mix(P.rawUmber, P.burntUmber, 0.34),       // was 104,82,50
                 a: shade(P.burntUmber,0.94), fissure: shade(P.burntUmber,0.68) },
  logTop:      { b: mix(P.rawUmber, P.ochre, 0.20),            // was 104,82,50
                 rings:[ lift(P.ochre,0.24), P.ochre, P.rawSienna, shade(P.rawUmber,0.92) ] },
  benchTop:    { b: mix(P.rawSienna, P.ochre, 0.34), a: shade(P.rawSienna,0.92),
                 groove: shade(P.burntUmber,0.86), inlay: mix(P.ochre,P.bone,0.4) },
  benchSide:   { b: mix(P.rawSienna, P.ochre, 0.34), a: shade(P.rawSienna,0.92),
                 seam: shade(P.burntUmber,0.86), iron: P.iron },
  door:        { b: mix(P.rawUmber,P.rawSienna,0.35), frame: shade(P.burntUmber,0.86),
                 panel: mix(P.rawSienna,P.ochre,0.28), sunk: shade(P.burntUmber,0.72),
                 glass: mix(P.indigo,P.slate,0.4), handle: P.bronze },

  /* --- the leaf. Deeper and greyer; every species tints its own from here --- */
  leaves:      { b: mix(P.sap, P.terreVerte, 0.42) },          // was 64,120,44
  leavesTr:    { b: mix(P.sap, P.malachite, 0.42) },           // was 52,138,52
  acacia:      { b: mix(P.terreVerte, P.ash, 0.22) },          // was 104,126,66 — thin, grey-green
  cherry:      { b: mix(P.madder, P.chalk, 0.66),              // was 244,170,205
                 pale: mix(P.madder, P.chalk, 0.82) },

  /* --- the sward's blades, and what flowers in it --- */
  tallgrass:   { b: mix(P.terreVerte, P.sap, 0.34) },
  savgrass:    { b: mix(P.ochre, P.bone, 0.20), seed: shade(P.darkOchre,0.94) },
  flowerR:     { b: P.cinnabar, pale: lift(P.cinnabar,0.24),
                 stem: mix(P.sap,P.terreVerte,0.4), eye: P.charcoal },
  flowerY:     { b: P.saffron, pale: lift(P.saffron,0.28), stem: mix(P.sap,P.terreVerte,0.4) },
  crop:        { b: mix(P.sap, P.ochre, 0.34) },

  /* --- the harvest, the fleece, the glass --- */
  haySide:     { b: mix(P.ochre, P.saffron, 0.26), a: shade(P.darkOchre,0.98),
                 band: shade(P.darkOchre,0.72) },
  hayTop:      { b: mix(P.ochre, P.saffron, 0.30), twine: shade(P.darkOchre,0.74) },
  wool:        { b: P.bone, a: shade(P.bone,0.94) },
  glass:       { b: mix(P.verdigris,P.chalk,0.72) },

  /* --- the badlands: banded clay, the tan wastes of the map --- */
  badTop:      { b: mix(P.terracotta, P.burntSienna, 0.30), a: shade(P.burntSienna,0.94) },
  badSide:     { bands:[ mix(P.terracotta,P.burntSienna,0.30), shade(P.burntSienna,0.88),
                         mix(P.sandstone,P.ochre,0.30),        mix(P.bone,P.sandstone,0.40),
                         shade(P.redOchre,1.02) ] },

  /* --- the two great lights --- */
  sun:         { rim: mix(P.saffron,P.bone,0.36), mid: lift(P.saffron,0.62), core: lift(P.bone,0.6) },
  moon:        { rim: mix(P.slate,P.chalk,0.66), mid: mix(P.slate,P.chalk,0.80), mare: mix(P.slate,P.glacier,0.5) },
  clouds:      { b: [255,255,255] }
};

/* ---------------- THE WOODS OF SCRIPTURE ----------------
   Cedar of Lebanon, acacia (shittim), olive, fir, gopher, almug, oak,
   sycamore, palm. Each has its own plank and its own bark, so a cedar hall
   and an olive-wood press are not the same building in two sizes. Phase 4
   draws its planks from here; the flora may tint its bark from here today. */
const WOOD = {
  cedar:    { plank: mix(P.burntSienna,P.rawSienna,0.42), bark: mix(P.burntUmber,P.redOchre,0.22) },
  acacia:   { plank: mix(P.ochre,P.rawSienna,0.30),       bark: mix(P.rawUmber,P.ash,0.20) },
  olive:    { plank: mix(P.bone,P.ochre,0.34),            bark: mix(P.ash,P.rawUmber,0.34) },
  fir:      { plank: mix(P.ochre,P.bone,0.30),            bark: mix(P.burntUmber,P.charcoal,0.24) },
  gopher:   { plank: mix(P.rawUmber,P.ochre,0.26),        bark: shade(P.burntUmber,0.94) },
  almug:    { plank: mix(P.redOchre,P.rawSienna,0.40),    bark: shade(P.redOchre,0.72) },
  oak:      { plank: mix(P.rawSienna,P.darkOchre,0.34),   bark: mix(P.rawUmber,P.slate,0.20) },
  sycamore: { plank: mix(P.bone,P.rawSienna,0.42),        bark: mix(P.ash,P.bone,0.30) },
  palm:     { plank: mix(P.darkOchre,P.bone,0.28),        bark: mix(P.rawUmber,P.ochre,0.34) }
};

/* ---------------- THE PEOPLE OF THE LANDS ----------------
   The traveller and the villagers were painted in loose triples too. Their
   cloth is now named out of the same box as the world they walk in — and
   named out of the materials the tabernacle was hung with: blue, purple,
   scarlet and fine linen, and gold upon the hem. */
const FOLK = {
  skin:      [199,140, 95],
  hair:      mix(P.burntUmber, P.lampblack, 0.42),
  robe:      mix(P.indigo, P.lapis, 0.30),          /* the blue */
  robeDeep:  shade(mix(P.indigo, P.lapis, 0.30), 0.86),
  trim:      mix(P.gold, P.darkOchre, 0.22),        /* gold upon the hem */
  clasp:     shade(mix(P.gold, P.darkOchre, 0.22), 0.80),
  eye:       mix(P.tyrian, P.lapis, 0.44),
  nose:      [160,105, 70],
  mouth:     shade([160,105,70], 0.70),
  leg:       mix(P.indigo, P.slate, 0.24)
};

/* ---------------- THE HAZE OF EACH COUNTRY ----------------
   Minecraft's distance fog is one colour everywhere on the earth, taken
   straight off the sky. But haze is not sky — it is what hangs in the air of
   THAT place: dust off a desert, moisture off a rain forest, ice-crystal off
   a polar plain, the pale burn off a limestone country at noon. Naming them
   here is what lets a traveller know what land he stands in with his eyes
   shut to everything but the horizon. Each is the colour the far distance
   takes; HOW STRONGLY it is taken is the engine's business, not the paint
   box's. */
const HAZE = {
  grass:    mix(P.terreVerte, P.chalk,     0.66),   /* temperate: a soft green-grey */
  tropic:   mix(P.malachite,  P.chalk,     0.60),   /* rain forest: green-grey and heavy */
  savanna:  mix(P.ochre,      P.chalk,     0.54),   /* the plain: dust and dry gold */
  desert:   mix(P.ochre,      P.sandstone, 0.42),   /* warm ochre — the whole waste is in the air */
  sand:     mix(P.sandstone,  P.chalk,     0.52),   /* the strand: pale and salt-bright */
  badlands: mix(P.terracotta, P.bone,      0.56),
  tundra:   mix(P.ash,        P.glacier,   0.46),
  rock:     mix(P.limestone,  P.chalk,     0.52),
  alpine:   mix(P.limestone,  P.glacier,   0.44),
  snow:     mix(P.glacier,    P.chalk,     0.52),
  wall:     mix(P.glacier,    P.rime,      0.50),   /* cold blue on the wall of ice */
  floe:     mix(P.glacier,    P.rime,      0.50)
};

/* ---------------- THE HEWN EDGE ----------------
   How dark the rim drawn round every solid block face is, and how far it
   reaches in. This one number is most of the difference between a game cube
   and a dressed stone, so it lives here with the colours and not in the
   mesher. */
const EDGE = { dark: 0.74, light: 1.10, px: 1 };

window.PALETTE = {
  pigment: P, block: B, wood: WOOD, folk: FOLK, haze: HAZE, edge: EDGE,
  mix, shade, lift, warm,
  rgb(c){ return 'rgb('+c[0]+','+c[1]+','+c[2]+')'; }
};
})();
