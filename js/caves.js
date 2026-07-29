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

/* ============================================================
   THE BUILDING OF A CAVE
   `kit` is what the engine lends this file — the same one the flora and the
   homes use: {G, emitBox, hash, M}, where M names the shared grey materials.
   A cave is raised in three pieces:
     THE MOUTH     an arch of rock standing out of the hillside, wide and high
                   enough to walk into without stooping.
     THE PASSAGE   a level floor running back from it, with walls and a roof,
                   narrowing as it goes and getting darker.
     THE CHAMBER   the room at the end: wider than the passage, with whatever
                   the kind of cave calls for — a pool and a fall in a lush
                   one, stone spikes above and below in a dripstone hall, and
                   the black at the back of every one of them.
   The sinkhole is built the other way about: no mouth at all, but a shaft
   sunk straight down out of level ground with the day falling into it.
   ============================================================ */
const ROCK=[0.42,0.42,0.41], DARKROCK=[0.28,0.27,0.27], BLACK=[0.03,0.03,0.04];
const MOSS=[0.24,0.42,0.18], WATER=[0.18,0.44,0.62], DRIP=[0.56,0.50,0.44];
const LAMP=[0.62,0.98,0.78];

function emitCave(kit,kind,x,z,yG,B){
  const {emitBox,hash,M}=kit; B=B||6;
  const K=KINDS[kind]||KINDS.mouth;
  const w=B*2.6, h=B*2.4, len=B*11;          /* half-width, height, how far it runs back */

  if(kind==='sink'){
    /* ---- THE HOLE IN THE EARTH ----
       A round-ish shaft dropping out of flat ground, its lip broken and its
       floor green where the daylight lands. */
    const R=B*3.2, deep=B*5.5;
    for(let i=0;i<12;i++){ const a=i/12*6.283;
      const bx=x+Math.cos(a)*R, bz=z+Math.sin(a)*R;
      emitBox(kit.G, bx-B*0.7,yG-deep,bz-B*0.7, bx+B*0.7,yG+B*0.35,bz+B*0.7,
              M.bark,M.bark,M.bark, ROCK); }
    emitBox(kit.G, x-R,yG-deep-B*0.4,z-R, x+R,yG-deep,z+R, M.solid,M.solid,M.solid, DARKROCK);
    /* the green floor the light reaches, and a little water in the middle */
    emitBox(kit.G, x-R*0.66,yG-deep,z-R*0.66, x+R*0.66,yG-deep+B*0.12,z+R*0.66,
            M.leaf,M.leaf,null, MOSS);
    emitBox(kit.G, x-R*0.3,yG-deep,z-R*0.3, x+R*0.3,yG-deep+B*0.18,z+R*0.3,
            M.solid,M.solid,null, WATER);
    /* and a passage leading off the bottom into the true dark */
    emitBox(kit.G, x-B*1.2,yG-deep,z-R-B*4, x+B*1.2,yG-deep+B*2,z-R,
            M.bark,M.bark,null, DARKROCK);
    emitBox(kit.G, x-B*1.0,yG-deep,z-R-B*4.2, x+B*1.0,yG-deep+B*1.8,z-R-B*3.6,
            M.solid,M.solid,M.solid, BLACK);
    return;
  }

  /* ---- THE MOUTH ---- two jambs and a lintel over them */
  for(const s of [-1,1])
    emitBox(kit.G, x+s*w-B*0.6,yG,z-B*0.2, x+s*w+B*0.6,yG+h,z+B*0.8, M.bark,M.bark,M.bark, ROCK);
  emitBox(kit.G, x-w-B*0.6,yG+h,z-B*0.2, x+w+B*0.6,yG+h+B*0.7,z+B*0.8, M.bark,M.bark,M.bark, ROCK);
  /* boulders fallen at the door, so it does not read as a doorway */
  for(let i=0;i<4;i++){ const bx=x+(hash(x+i*4.7,z)-0.5)*w*2.6, bz=z+B*(0.9+hash(x,z+i*3.1)*1.1);
    const s2=B*(0.3+hash(x+i,z-i)*0.35);
    emitBox(kit.G, bx-s2,yG,bz-s2, bx+s2,yG+s2*1.3,bz+s2, M.bark,M.bark,M.bark, ROCK); }

  /* ---- THE PASSAGE ---- floor, two walls and a roof, narrowing as it runs */
  const STEP=B*1.6;
  for(let d=0; d<len; d+=STEP){
    const t=d/len, ww=w*(1-t*0.35), hh=h*(1-t*0.22);
    const z0=z-B*0.2-d, z1=z0-STEP;
    emitBox(kit.G, x-ww,yG-B*0.14,z1, x+ww,yG,z0, M.solid,M.solid,M.solid, DARKROCK);
    for(const s of [-1,1])
      emitBox(kit.G, x+s*ww-B*0.5,yG,z1, x+s*ww+B*0.5,yG+hh, z0, M.bark,M.bark,null, DARKROCK);
    emitBox(kit.G, x-ww-B*0.5,yG+hh,z1, x+ww+B*0.5,yG+hh+B*0.6,z0, M.bark,M.bark,null, DARKROCK);
    /* the dripstone hall grows its spikes down from the roof and up off the floor */
    if(kind==='drip'&&hash(d*0.7,x)>0.45){
      const px=x+(hash(d,z)-0.5)*ww*1.2, len2=B*(0.5+hash(d*2,z)*1.1);
      emitBox(kit.G, px-B*0.22,yG+hh-len2,z1+B*0.4, px+B*0.22,yG+hh,z1+B*0.9, M.bark,M.bark,M.bark, DRIP);
      emitBox(kit.G, px-B*0.26,yG,z1+B*0.2, px+B*0.26,yG+len2*0.7,z1+B*0.7, M.bark,M.bark,M.bark, DRIP); }
    /* the lush cave hangs vines and lays moss where the light still reaches */
    if(kind==='lush'&&t<0.6&&hash(d*1.3,z)>0.4){
      const px=x+(hash(d*3,x)-0.5)*ww*1.4;
      emitBox(kit.G, px-B*0.16,yG+hh-B*1.6,z1+B*0.3, px+B*0.16,yG+hh,z1+B*0.8, M.leaf,M.leaf,null, MOSS);
      emitBox(kit.G, x-ww*0.8,yG,z1, x+ww*0.8,yG+B*0.1,z0, M.leaf,M.leaf,null, MOSS); }
    /* and every cave has its glow-worms once the day has failed */
    if(t>0.45&&hash(d*5.1,z*0.3)>0.62){
      const px=x+(hash(d*7,z)-0.5)*ww*1.5;
      emitBox(kit.G, px-B*0.07,yG+hh-B*0.2,z1+B*0.5, px+B*0.07,yG+hh,z1+B*0.7,
              M.solid,M.solid,M.solid, LAMP); }
  }

  /* ---- THE CHAMBER at the end of it ---- */
  const cz=z-B*0.2-len, cw=w*1.9, ch=h*1.35;
  emitBox(kit.G, x-cw,yG-B*0.14,cz-B*7, x+cw,yG,cz, M.solid,M.solid,M.solid, DARKROCK);
  for(const s of [-1,1])
    emitBox(kit.G, x+s*cw-B*0.5,yG,cz-B*7, x+s*cw+B*0.5,yG+ch,cz, M.bark,M.bark,null, DARKROCK);
  emitBox(kit.G, x-cw-B*0.5,yG+ch,cz-B*7, x+cw+B*0.5,yG+ch+B*0.6,cz, M.bark,M.bark,null, DARKROCK);
  emitBox(kit.G, x-cw,yG,cz-B*7.4, x+cw,yG+ch,cz-B*6.9, M.solid,M.solid,M.solid, BLACK);
  if(kind==='lush'){
    /* the pool, and the fall coming into it out of the roof */
    emitBox(kit.G, x-cw*0.6,yG,cz-B*5.4, x+cw*0.6,yG+B*0.22,cz-B*1.6, M.solid,M.solid,null, WATER);
    emitBox(kit.G, x-B*0.7,yG+B*0.2,cz-B*5.6, x+B*0.7,yG+ch,cz-B*5.0, M.solid,M.solid,null, WATER);
    emitBox(kit.G, x-cw*0.8,yG,cz-B*6.4, x+cw*0.8,yG+B*0.1,cz-B*5.6, M.leaf,M.leaf,null, MOSS); }
  if(kind==='drip')
    for(let i=0;i<7;i++){ const px=x+(hash(i*3.7,x)-0.5)*cw*1.7, pz=cz-B*(1+hash(i,z)*5.5);
      const l2=B*(0.8+hash(i*2,z)*1.6);
      emitBox(kit.G, px-B*0.3,yG+ch-l2,pz-B*0.3, px+B*0.3,yG+ch,pz+B*0.3, M.bark,M.bark,M.bark, DRIP);
      emitBox(kit.G, px-B*0.34,yG,pz-B*0.34, px+B*0.34,yG+l2*0.6,pz+B*0.34, M.bark,M.bark,M.bark, DRIP); }
  /* the lamps of the deep, hung in the roof of the chamber */
  for(let i=0;i<9;i++){ const px=x+(hash(i*5.3,z)-0.5)*cw*1.7, pz=cz-B*(0.8+hash(i*1.7,x)*5.8);
    emitBox(kit.G, px-B*0.08,yG+ch-B*0.22,pz-B*0.08, px+B*0.08,yG+ch,pz+B*0.08,
            M.solid,M.solid,M.solid, LAMP); }
}

window.CAVES={
  KINDS, FAUNA, VISITORS, emitCave,
  darkAt, zoneAt, dwellersOf, kindsFor,
  kindOf:k=>KINDS[k]||null,
  dwellerOf:n=>FAUNA[n]||null,
  /* the roll-call of every creature that lives underground, for the builder */
  all:()=>Object.keys(FAUNA),
};
})();
