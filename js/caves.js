/* ============================================================
   THE CAVES OF THE EARTH — the hollow places, and what dwells in them
   ------------------------------------------------------------
   "He cutteth out rivers among the rocks; and his eye seeth every precious
    thing. He bindeth the floods from overflowing; and the thing that is hid
    bringeth he forth to light."   (Job 28:10–11)

   WHAT WAS HERE BEFORE. The word "cave" was used of the SLOT CANYONS of the
   secret ranges — winding clefts cut down into the rock, open to the sky the
   whole of their length. They are a fine thing and they stay; but they are not
   caves. Nothing was roofed, nothing was dark, and nothing lived underground.

   WHY A CAVE IS HARD HERE, AND HOW IT IS DONE. The ground of this world is a
   HEIGHT FIELD: every point of the earth carries one number, the height of the
   land there. Such a field cannot express an overhang — there is no way to say
   "rock here, then air beneath it, then rock again" — so a true cave cannot be
   cut into the ground itself. A cave is therefore BUILT: a hollow raised as
   its own geometry at a mouth in the hillside, exactly as a house or a bear's
   den is built, with its own floor, walls and roof. The height field gives the
   hill; this file gives the hollow inside it.

   ---- THE KINDS OF CAVE ----
   mouth   the plain cave in a mountainside: an arch of rock at the foot of a
           crag, a passage running back, and a chamber at the end of it.
   sink    a HOLE IN THE EARTH — a shaft opening straight down out of level
           ground, with the daylight falling in a shaft and the floor of it
           green where the light reaches. (The blue holes of the reef are its
           sisters, sunk in water instead of air.)
   lush    the overgrown cave: vines down the walls, moss on the floor, a
           pool of clear water and a fall running into it, and light enough
           from above to grow by.
   drip    the dripstone hall: spikes of stone hanging from the roof and
           standing up off the floor to meet them, and the sound of water.
   deep    the far dark, below everything: no light at all but what the
           traveller brings, and what glows of itself down there.

   ---- THE THREE DEPTHS ----
   Every cave is reckoned in three bands, because what lives underground lives
   by how far the light reaches:
     twilight  the entrance and the first of the passage. Light still falls
               here. Almost anything of the surface may come in — this is
               where the bear dens and the swallow nests.
     dark      past the reach of daylight, but the air still moves and water
               still runs in from above. The true cave-dwellers live here.
     deep      the sealed dark, where nothing of the surface ever comes, and
               everything that lives is blind, colourless, and slow.

   ---- A NOTE ON THE CREATURES ----
   These are REAL cave animals, not invented ones. The olm is the white blind
   salamander of the Balkan karst, and it lives a hundred years. The Mexican
   tetra is a river fish that, sealed in caves, lost its eyes and its colour in
   the dark. The cave cricket, the harvestman and the springtail are the small
   life of every cave floor on the earth. The glow-worm of Waitomo hangs its
   fishing lines of silk from the roof and lights them. All of them belong.
   ============================================================ */
(function(){
'use strict';

const KINDS={
  mouth:{ name:'Cave Mouth',      where:['rock','alpine','grass','tundra'], lit:0.35, wet:0.2, depth:'dark' },
  sink: { name:'Sinkhole',        where:['grass','savanna','tropic','rock'],lit:0.55, wet:0.3, depth:'dark' },
  lush: { name:'Lush Cave',       where:['tropic','grass'],                 lit:0.45, wet:0.9, depth:'dark' },
  drip: { name:'Dripstone Hall',  where:['rock','alpine','grass'],          lit:0.10, wet:0.6, depth:'deep' },
  deep: { name:'The Far Dark',    where:['rock','alpine'],                  lit:0.00, wet:0.3, depth:'deep' },
};

/* ---- WHAT DWELLS UNDERGROUND ----
   zone  — the band it keeps to: 'twilight', 'dark' or 'deep'
   n     — how many are met together
   size  — its true length in metres, as everything else in this world is kept
   glow  — true if it makes its own light (the only lamps the deep has)
   blind — true if it has no eyes at all, or none that serve
   in    — the kinds of cave it is found in ('any' = all of them) */
const FAUNA={
  bat:        {zone:'twilight', n:14, size:0.22, glow:false, blind:false, in:['any'],
               note:'hangs from the roof by day in its thousands and pours out at dusk'},
  swiftlet:   {zone:'twilight', n:8,  size:0.12, glow:false, blind:false, in:['mouth','sink'],
               note:'nests on the wall and finds its way in by clicking, as a bat does'},
  caveSpider: {zone:'twilight', n:4,  size:0.05, glow:false, blind:false, in:['any'],
               note:'sheet webs across the passage where the flies come in'},
  harvestman: {zone:'dark',     n:9,  size:0.04, glow:false, blind:false, in:['any'],
               note:'hangs in swaying clusters of a thousand legs on the cold wall'},
  caveCricket:{zone:'dark',     n:11, size:0.03, glow:false, blind:false, in:['any'],
               note:'long-legged and pale; it leaves the cave to feed and comes back'},
  springtail: {zone:'dark',     n:20, size:0.004,glow:false, blind:true,  in:['any'],
               note:'the whitest speck on the wet floor, and there are millions'},
  glowworm:   {zone:'dark',     n:26, size:0.02, glow:true,  blind:false, in:['lush','drip','deep'],
               note:'hangs its lines of silk from the roof and lights them to fish the dark'},
  olm:        {zone:'deep',     n:3,  size:0.28, glow:false, blind:true,  in:['drip','deep','lush'],
               note:'the white blind salamander of the karst; it lives a hundred years'},
  blindfish:  {zone:'deep',     n:7,  size:0.09, glow:false, blind:true,  in:['lush','drip','deep'],
               note:'a river fish sealed in the dark until it lost its eyes and its colour'},
  caveBeetle: {zone:'deep',     n:6,  size:0.02, glow:false, blind:true,  in:['any'],
               note:'long, pale and eyeless, walking the floor of the sealed dark'},
  isopod:     {zone:'deep',     n:8,  size:0.015,glow:false, blind:true,  in:['drip','deep'],
               note:'the white woodlouse of the cave pools'},
};

/* and the beasts of the SURFACE that come into the twilight band and no
   further — they are not cave creatures, but a cave is where they go */
const VISITORS={
  bear:      'dens in the mouth and sleeps the winter there',
  blackbear: 'the same, in the woods of the new world',
  badger:    'digs its sett into the floor of the entrance',
  hedgehog:  'winters under the leaf-drift at the door',
  viper:     'lies up in the cool of it through the heat of the day',
  scorpion:  'the same, and hunts the crickets at the threshold',
  lynx:      'lies up in a dry one to bear her kittens',
};

/* how dark it is at a given depth into the cave, 0 (full day) .. 1 (the
   sealed dark). `t` is how far in, 0 at the mouth and 1 at the far end. */
function darkAt(kind,t){
  const K=KINDS[kind]||KINDS.mouth;
  const day=Math.max(0,K.lit*(1-t*1.6));       /* the daylight fails fast going in */
  return Math.max(0,Math.min(1,1-day));
}
/* which band a point that far in belongs to */
function zoneAt(kind,t){
  if(t<0.30) return 'twilight';
  const K=KINDS[kind]||KINDS.mouth;
  return (t>0.72&&K.depth==='deep')?'deep':'dark';
}
/* everything that may be met in this kind of cave, in this band */
function dwellersOf(kind,zone){
  const out=[];
  for(const nm in FAUNA){ const F=FAUNA[nm];
    if(F.zone!==zone) continue;
    if(F.in.indexOf('any')<0&&F.in.indexOf(kind)<0) continue;
    out.push(nm); }
  return out;
}
/* which kinds of cave will open in this ground */
function kindsFor(ground){
  const out=[];
  for(const k in KINDS) if(KINDS[k].where.indexOf(ground)>=0) out.push(k);
  return out;
}

window.CAVES={
  KINDS, FAUNA, VISITORS,
  darkAt, zoneAt, dwellersOf, kindsFor,
  kindOf:k=>KINDS[k]||null,
  dwellerOf:n=>FAUNA[n]||null,
  /* the roll-call of every creature that lives underground, for the builder */
  all:()=>Object.keys(FAUNA),
};
})();
