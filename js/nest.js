/* ============================================================
   THE HOMES OF THE BEASTS — nest, den, burrow, holt and lair
   ------------------------------------------------------------
   "The birds of the air have nests, and the foxes have holes."

   THE FAULT THIS FILE MENDS. There was ONE home in the whole world — a ring
   of woven sticks — and it was put down at a flat three and a third blocks
   above the ground whether a tree stood there or not. So every nest on the
   earth either HUNG IN MID AIR over open field, or sat buried in the bole of
   whatever tree had grown up under it. And a hundred and thirty other kinds
   of creature — every fox, wolf, bear, badger, beaver, otter, meerkat, hare
   and penguin in the world — had nowhere to live at all.

   Now a home is asked for by the KIND that makes it, and it is put where that
   kind actually puts it: the crow's nest in the crown of a tree (at the true
   height of THAT tree, asked of the flora), the ostrich's scrape on bare
   ground, the fox's den in a bank with the spoil heaped outside it, the
   beaver's lodge standing in the water, the eagle's eyrie on a crag, the
   penguins' rookery in a colony on the ice.

   ---- WHAT IS HERE ----
   HOMES   the forms — how a den differs from a burrow from a lodge.
   KEEPS   which beast makes which, and where it will put it.
   The young that live in them are in js/chicks.js (the birds) and
   js/baby-animals.js (everything else).
   ============================================================ */
(function(){
'use strict';

const B=6;                     /* units to the block — a block is a metre */

/* ---- WHICH BEAST MAKES WHICH HOME ----
   form   the shape of it (see below)
   where  'tree'   in the crown of a tree, at that tree's own true height
          'ground' on the open ground
          'bank'   dug into a slope, with the spoil outside
          'water'  standing in or beside running water
          'crag'   on bare rock or the highest ground about
   n      how many young are reared in it, at most
   r      how big it is drawn, against its fellows of the same form */
const KEEPS={
  /* ---- THE NESTS OF THE BIRDS ---- */
  crow    :{form:'nest', where:'tree',   n:3},
  dove    :{form:'nest', where:'tree',   n:2, r:0.8},
  owl     :{form:'nest', where:'tree',   n:2, r:1.15},
  eagle   :{form:'eyrie',where:'crag',   n:2, r:1.4},
  gull    :{form:'scrape',where:'ground',n:3, r:0.9},
  puffin  :{form:'burrow',where:'bank',  n:1, r:0.7},
  /* ---- AND OF THE BIRDS THAT DO NOT FLY ---- */
  ostrich :{form:'scrape',where:'ground',n:6, r:1.6},
  emu     :{form:'scrape',where:'ground',n:5, r:1.4},
  cassowary:{form:'scrape',where:'ground',n:3, r:1.3},
  bustard :{form:'scrape',where:'ground',n:2, r:1.0},
  ptarmigan:{form:'scrape',where:'ground',n:6, r:0.8},
  kiwi    :{form:'burrow',where:'bank',  n:1, r:0.8},
  peacock :{form:'scrape',where:'ground',n:4, r:0.9},
  chicken :{form:'scrape',where:'ground',n:5, r:0.7},
  penguin :{form:'rookery',where:'ground',n:1,r:1.0},
  /* ---- THE DENS OF THE HUNTERS ----
     A den is a mouth in a bank with the earth thrown out in front of it, and
     bones about the door. It is where the cubs are, and it is why a vixen
     will come at anything that walks near. */
  fox     :{form:'den', where:'bank', n:4},
  arcticfox:{form:'den',where:'bank', n:5},
  jackal  :{form:'den', where:'bank', n:4},
  coyote  :{form:'den', where:'bank', n:4},
  dingo   :{form:'den', where:'bank', n:4},
  wolf    :{form:'den', where:'bank', n:5, r:1.2},
  arcticwolf:{form:'den',where:'bank',n:5, r:1.2},
  hyena   :{form:'den', where:'bank', n:3, r:1.15},
  /* ---- THE BEARS KEEP CAVES, AND SLEEP THE WINTER IN THEM ----
     A bear's den is not a hole in a bank but a CAVE in the rock, and it is
     where she lies from the first snow to the thaw. It is drawn big enough to
     walk into, so the traveller who finds one in winter may look in upon her
     asleep — which is the only way she is ever seen in that season. */
  bear    :{form:'cave',where:'bank', n:2, r:2.3, hib:true},
  blackbear:{form:'cave',where:'bank',n:2, r:2.1, hib:true},
  polarbear:{form:'den',where:'ground',n:2, r:1.5},   /* a chamber dug in the drift */
  wolverine:{form:'den',where:'bank', n:3, r:0.9},
  /* ---- THE LAIRS OF THE CATS ----
     Not dug: a shaded scrape under a rock or a thorn, with the grass beaten
     flat, and a bone or two. */
  lion    :{form:'lair', where:'ground', n:3, r:1.3},
  leopard :{form:'lair', where:'crag',   n:2},
  tiger   :{form:'lair', where:'ground', n:3, r:1.2},
  jaguar  :{form:'lair', where:'ground', n:2},
  cheetah :{form:'lair', where:'ground', n:4},
  cougar  :{form:'lair', where:'crag',   n:3},
  lynx    :{form:'lair', where:'crag',   n:3, r:0.85},
  caracal :{form:'lair', where:'crag',   n:3, r:0.8},
  snowleopard:{form:'lair',where:'crag', n:2, r:0.9},
  ermine  :{form:'burrow',where:'bank',  n:6, r:0.5},
  /* ---- THE BURROWS ----
     A hole and a heap. The meerkat's has a dozen mouths to it and a sentry
     standing over one of them; the rabbit's the same without the sentry. */
  hare    :{form:'burrow',where:'bank',  n:4, r:0.7},
  arctichare:{form:'burrow',where:'bank',n:5, r:0.75},
  meerkat :{form:'warren',where:'ground',n:4, r:1.0},
  jerboa  :{form:'burrow',where:'ground',n:3, r:0.45},
  lemming :{form:'burrow',where:'ground',n:6, r:0.4},
  badger  :{form:'warren',where:'bank',  n:3, r:1.1, hib:true},   /* the sett, dug for generations */
  wombat  :{form:'burrow',where:'bank',  n:1, r:0.9, hib:true},
  armadillo:{form:'burrow',where:'bank', n:4, r:0.7},
  warthog :{form:'burrow',where:'bank',  n:4, r:1.0},   /* it backs in, tusks out */
  aardvark:{form:'burrow',where:'bank',  n:1, r:1.0},
  marmot  :{form:'burrow',where:'bank',  n:4, r:0.7, hib:true},
  /* ---- THE WORKS OF THE WATER ---- */
  beaver  :{form:'lodge',where:'water', n:4, r:1.2},
  otter   :{form:'holt', where:'water', n:3, r:0.8},
  platypus:{form:'holt', where:'water', n:2, r:0.6},
  crocodile:{form:'mound',where:'water',n:8, r:1.2},    /* a heap of rotting weed */
  komodo  :{form:'mound',where:'ground',n:6, r:1.0},
  /* ---- AND THE REST ---- */
  boar    :{form:'lair', where:'ground', n:6, r:1.0},   /* a bed of bracken */
  deer    :{form:'lair', where:'ground', n:1, r:0.8},
  hedgehog:{form:'burrow',where:'bank',  n:4, r:0.5, hib:true},
  raccoon :{form:'nest', where:'tree',   n:4, r:0.9},
  redpanda:{form:'nest', where:'tree',   n:2, r:0.9},
  koala   :{form:'nest', where:'tree',   n:1, r:0.8},
  sloth   :{form:'nest', where:'tree',   n:1, r:0.7},
  gorilla :{form:'nest', where:'ground', n:1, r:1.4},   /* a fresh one every night */
  chimpanzee:{form:'nest',where:'tree',  n:1, r:1.1},
  orangutan:{form:'nest',where:'tree',   n:1, r:1.2},
  squirrel:{form:'nest', where:'tree',   n:3, r:0.7},
};
/* the beasts that need no home at all: they drop their young in the open and
   the young is up and running inside the hour. Every grazing herd beast. */
const OPEN=new Set(['zebra','wildebeest','gazelle','oryx','buffalo','waterbuffalo',
  'giraffe','elephant','mammoth','rhino','hippo','camel','llama','alpaca','yak',
  'bison','muskox','moose','reindeer','saiga','pronghorn','blackbuck','wildass',
  'addax','kangaroo','cow','sheep','goat','horse','donkey','ox','pig','okapi',
  'tapir','chamois','deer']);

/* ============================================================
   THE BUILDING — every form, in blocks
   `kit` is what the engine lends this file, the same one the flora uses:
   {G, emitBox, cross, shade, hash, M} where M names the grey materials.
   ============================================================ */
const STICK=[0.42,0.33,0.18], DARK=[0.26,0.20,0.13], EARTH=[0.44,0.32,0.21];
const DOWN=[0.86,0.82,0.72], STONE=[0.48,0.48,0.47], WEED=[0.34,0.46,0.24];
const SNOW=[0.94,0.95,0.96];

/* a ring of woven sticks — the thing everybody pictures when you say nest */
function ring(kit,x,y,z,r,col){
  const {emitBox,hash,M}=kit;
  for(let i=0;i<9;i++){ const a=i/9*6.283;
    const sx=x+Math.cos(a)*r, sz=z+Math.sin(a)*r;
    emitBox(kit.G, sx-r*0.34,y,sz-r*0.16, sx+r*0.34,y+r*0.34,sz+r*0.16,
            M.bark,M.bark,null, col); }
}

function emitHome(kit,K,x,z,yG){
  const {emitBox,cross,hash,M}=kit;
  const r=B*0.9*(K.r||1), F=K.form;

  if(F==='nest'){
    /* woven sticks with a lining, sitting IN the crown — the engine has
       already put yG at the true height of this tree */
    emitBox(kit.G, x-r*0.9,yG-B*0.14,z-r*0.9, x+r*0.9,yG,z+r*0.9, M.bark,M.bark,M.bark, DARK);
    ring(kit,x,yG,z,r*0.82,STICK);
    emitBox(kit.G, x-r*0.5,yG,z-r*0.5, x+r*0.5,yG+B*0.1,z+r*0.5, M.solid,M.solid,null, DOWN);
    return;
  }
  if(F==='eyrie'){
    /* the eagle's — a great platform of branches added to every year until
       it is bigger than the bird and heavy enough to break the bough */
    emitBox(kit.G, x-r*1.3,yG-B*0.4,z-r*1.3, x+r*1.3,yG,z+r*1.3, M.bark,M.bark,M.bark, DARK);
    for(let i=0;i<7;i++){ const a=hash(x*0.11+i,z*0.09-i)*6.283, d=r*(0.6+0.7*hash(x+i,z-i));
      const bx=x+Math.cos(a)*d, bz=z+Math.sin(a)*d;
      emitBox(kit.G, Math.min(x,bx),yG-B*0.06,Math.min(z,bz)-B*0.07,
                     Math.max(x,bx),yG+B*0.06,Math.max(z,bz)+B*0.07, M.bark,M.bark,null, STICK); }
    ring(kit,x,yG,z,r*1.0,STICK);
    emitBox(kit.G, x-r*0.6,yG,z-r*0.6, x+r*0.6,yG+B*0.12,z+r*0.6, M.solid,M.solid,null, DOWN);
    return;
  }
  if(F==='scrape'){
    /* a hollow kicked in the ground with a rim of what came out of it — and
       that is the whole of an ostrich's nest, for all it is the largest in
       the world */
    ring(kit,x,yG,z,r*0.9,EARTH);
    emitBox(kit.G, x-r*0.7,yG-B*0.05,z-r*0.7, x+r*0.7,yG+B*0.04,z+r*0.7, M.solid,M.solid,null, EARTH);
    return;
  }
  if(F==='rookery'){
    /* a colony: a ring of stones apiece, set close, and hundreds of them —
       the noise and the smell of one carries a mile downwind */
    for(let i=0;i<5;i++){ const a=i/5*6.283+hash(x,z)*3;
      const cx=x+Math.cos(a)*r*1.6, cz=z+Math.sin(a)*r*1.6;
      ring(kit,cx,yG,cz,r*0.45,STONE); }
    ring(kit,x,yG,z,r*0.5,STONE);
    return;
  }
  if(F==='den'){
    /* a mouth in a bank with the earth thrown out in front of it, worn
       smooth by going in and out, and a bone or two about the door */
    emitBox(kit.G, x-r*0.75,yG,z-r*0.75, x+r*0.75,yG+r*0.9,z+r*0.75, M.bark,M.bark,null, EARTH);
    emitBox(kit.G, x-r*0.42,yG,z+r*0.5, x+r*0.42,yG+r*0.62,z+r*1.1, M.solid,M.solid,null, [0.06,0.05,0.04]);
    /* the spoil heap */
    emitBox(kit.G, x-r*1.1,yG-B*0.05,z+r*0.9, x+r*1.1,yG+B*0.16,z+r*1.7, M.solid,M.solid,null, EARTH);
    for(let i=0;i<3;i++){ const bx=x+(hash(x+i*3.1,z)-0.5)*r*2.4, bz=z+r*1.2+hash(x,z+i*2.7)*r;
      emitBox(kit.G, bx-B*0.06,yG,bz-B*0.2, bx+B*0.06,yG+B*0.09,bz+B*0.2, M.solid,M.solid,null, [0.84,0.82,0.74]); }
    return;
  }
  if(F==='burrow'){
    /* a hole and a heap, and nothing else to see */
    emitBox(kit.G, x-r*0.5,yG-B*0.02,z-r*0.5, x+r*0.5,yG+r*0.5,z+r*0.5, M.bark,M.bark,null, EARTH);
    emitBox(kit.G, x-r*0.28,yG,z+r*0.3, x+r*0.28,yG+r*0.34,z+r*0.72, M.solid,M.solid,null, [0.06,0.05,0.04]);
    emitBox(kit.G, x-r*0.8,yG-B*0.04,z+r*0.6, x+r*0.8,yG+B*0.1,z+r*1.2, M.solid,M.solid,null, EARTH);
    return;
  }
  if(F==='warren'){
    /* many mouths to one work below — the meerkat's mound and the badger's
       sett are the same thing, and both are dug for generations */
    emitBox(kit.G, x-r*1.5,yG-B*0.06,z-r*1.5, x+r*1.5,yG+B*0.2,z+r*1.5, M.solid,M.solid,null, EARTH);
    for(let i=0;i<4;i++){ const a=i/4*6.283+hash(x,z)*2;
      const hx=x+Math.cos(a)*r*0.95, hz=z+Math.sin(a)*r*0.95;
      emitBox(kit.G, hx-r*0.3,yG-B*0.05,hz-r*0.3, hx+r*0.3,yG+r*0.42,hz+r*0.3, M.bark,M.bark,null, EARTH);
      emitBox(kit.G, hx-r*0.17,yG,hz-r*0.17, hx+r*0.17,yG+r*0.26,hz+r*0.17, M.solid,M.solid,null, [0.06,0.05,0.04]); }
    return;
  }
  if(F==='lair'){
    /* not dug at all: a shaded scrape under a rock or a thorn, with the grass
       beaten flat and a bone in it */
    emitBox(kit.G, x-r*1.2,yG-B*0.04,z-r*1.2, x+r*1.2,yG+B*0.06,z+r*1.2, M.solid,M.solid,null, [0.52,0.46,0.32]);
    emitBox(kit.G, x-r*1.0,yG,z-r*1.5, x+r*1.0,yG+r*1.0,z-r*0.8, M.bark,M.bark,M.bark, STONE);
    for(let i=0;i<2;i++){ const bx=x+(hash(x+i*5.3,z)-0.5)*r*1.6;
      emitBox(kit.G, bx-B*0.07,yG,z+r*0.3, bx+B*0.07,yG+B*0.1,z+r*0.8, M.solid,M.solid,null, [0.84,0.82,0.74]); }
    return;
  }
  if(F==='lodge'){
    /* THE BEAVER'S LODGE — a dome of gnawed sticks and mud standing in the
       water, with the way in underneath it where nothing else can follow */
    emitBox(kit.G, x-r*1.5,yG-B*0.3,z-r*1.5, x+r*1.5,yG+r*0.7,z+r*1.5, M.bark,M.bark,null, DARK);
    emitBox(kit.G, x-r*1.0,yG+r*0.7,z-r*1.0, x+r*1.0,yG+r*1.2,z+r*1.0, M.bark,M.bark,M.bark, STICK);
    emitBox(kit.G, x-r*0.5,yG+r*1.2,z-r*0.5, x+r*0.5,yG+r*1.45,z+r*0.5, M.bark,M.bark,M.bark, DARK);
    /* the sticks lying out from it, and the stumps it cut them off */
    for(let i=0;i<5;i++){ const a=hash(x*0.13+i*2.3,z*0.17-i)*6.283, d=r*(1.5+hash(x+i,z+i));
      const sx=x+Math.cos(a)*d, sz=z+Math.sin(a)*d;
      emitBox(kit.G, Math.min(x,sx),yG,Math.min(z,sz)-B*0.07,
                     Math.max(x,sx),yG+B*0.14,Math.max(z,sz)+B*0.07, M.bark,M.bark,null, STICK); }
    return;
  }
  if(F==='holt'){
    /* a hole under a root in the bank, above the water and below the flood */
    emitBox(kit.G, x-r*0.7,yG,z-r*0.5, x+r*0.7,yG+r*0.7,z+r*0.5, M.bark,M.bark,null, EARTH);
    emitBox(kit.G, x-r*0.3,yG,z+r*0.3, x+r*0.3,yG+r*0.4,z+r*0.8, M.solid,M.solid,null, [0.06,0.05,0.04]);
    for(const s of [1,-1]) emitBox(kit.G, x+s*r*0.55-B*0.08,yG,z-r*0.6, x+s*r*0.55+B*0.08,yG+r*0.8,z+r*0.6,
      M.bark,M.bark,null, STICK);
    return;
  }
  if(F==='cave'){
    /* ---- THE CAVE — where the bear sleeps the winter through ----
       A mouth in the rock big enough for a man to walk into: two jambs, a
       lintel over them, a swept floor of stone within, and a black chamber
       behind it. The bear is not gone in winter — she is IN HERE, and the
       traveller who walks up to the mouth may look in and see her lying.
       (The world's other "caves" are the slot canyons of the secret ranges,
       which are open to the sky. This is a roofed one, and it has a tenant.) */
    const w=r*1.9, h=r*2.0, dpt=r*2.6;
    /* the floor of the chamber, swept flat */
    emitBox(kit.G, x-w,yG-B*0.12,z-dpt, x+w,yG,z+r*0.5, M.solid,M.solid,M.solid, [0.30,0.28,0.26]);
    /* the two jambs of the mouth */
    for(const s of [-1,1])
      emitBox(kit.G, x+s*w-r*0.45,yG,z-r*0.1, x+s*w+r*0.45,yG+h,z+r*0.55,
              M.bark,M.bark,M.bark, STONE);
    /* the lintel across the top */
    emitBox(kit.G, x-w-r*0.45,yG+h,z-r*0.1, x+w+r*0.45,yG+h+r*0.5,z+r*0.55,
            M.bark,M.bark,M.bark, [0.42,0.42,0.41]);
    /* the walls and roof of the chamber running back into the hill */
    for(const s of [-1,1])
      emitBox(kit.G, x+s*w-r*0.4,yG,z-dpt, x+s*w+r*0.4,yG+h,z-r*0.1,
              M.bark,M.bark,null, [0.40,0.39,0.38]);
    emitBox(kit.G, x-w-r*0.4,yG+h,z-dpt, x+w+r*0.4,yG+h+r*0.5,z-r*0.1,
            M.bark,M.bark,null, [0.38,0.37,0.36]);
    /* the black at the back of it, which is what makes a cave read as deep */
    emitBox(kit.G, x-w+r*0.1,yG,z-dpt-r*0.3, x+w-r*0.1,yG+h,z-dpt+r*0.2,
            M.solid,M.solid,M.solid, [0.04,0.04,0.05]);
    /* the bed of dry leaves and bracken she lies on */
    emitBox(kit.G, x-w*0.7,yG,z-dpt*0.72, x+w*0.7,yG+B*0.16,z-dpt*0.18,
            M.leaf,M.leaf,null, [0.34,0.26,0.15]);
    /* a boulder or two fallen at the mouth */
    for(let i=0;i<3;i++){ const bx=x+(hash(x+i*4.7,z)-0.5)*w*2.6, bz=z+r*(0.7+hash(x,z+i*3.1)*0.8);
      const s2=r*(0.22+hash(x+i,z-i)*0.2);
      emitBox(kit.G, bx-s2,yG,bz-s2, bx+s2,yG+s2*1.4,bz+s2, M.bark,M.bark,M.bark, STONE); }
    return;
  }
  if(F==='mound'){
    /* the crocodile's — a heap of rotting weed she scrapes together, and the
       heat of it rotting is what hatches the eggs. She lies on it for months. */
    emitBox(kit.G, x-r*1.3,yG-B*0.06,z-r*1.3, x+r*1.3,yG+r*0.55,z+r*1.3, M.leaf,M.leaf,null, WEED);
    emitBox(kit.G, x-r*0.8,yG+r*0.55,z-r*0.8, x+r*0.8,yG+r*0.9,z+r*0.8, M.leaf,M.leaf,M.leaf, [0.30,0.38,0.20]);
    return;
  }
  /* ---- AND THE TERMITE MOUND ----
     Nobody's home but the termites', and it is the one thing standing on
     half the plains of the earth. A hard red chimney, taller than a man. */
  emitBox(kit.G, x-r*0.7,yG,z-r*0.7, x+r*0.7,yG+r*1.4,z+r*0.7, M.bark,M.bark,null, [0.55,0.28,0.17]);
  emitBox(kit.G, x-r*0.45,yG+r*1.4,z-r*0.45, x+r*0.45,yG+r*2.3,z+r*0.45, M.bark,M.bark,null, [0.50,0.25,0.15]);
  emitBox(kit.G, x-r*0.22,yG+r*2.3,z-r*0.22, x+r*0.22,yG+r*3.0,z+r*0.22, M.bark,M.bark,M.bark, [0.46,0.23,0.14]);
}

window.NEST={
  KEEPS, OPEN, emitHome,
  /* what home does this kind make, if any? */
  homeOf:kind=>KEEPS[kind]||null,
  /* and is that home one it SLEEPS THE WINTER in? (the bear's cave, the
     badger's sett, the hedgehog's burrow) */
  hibernatesIn:kind=>!!(KEEPS[kind]&&KEEPS[kind].hib),
  /* and does it rear its young in the open, needing none? */
  bearsInOpen:kind=>OPEN.has(kind),
  /* the snow-white den of the polar bear wants its own colour */
  SNOW,
};
})();
