/* ============================================================
   THE FLOOR OF THE WOOD — one file, and it is all data
   ------------------------------------------------------------
   "And the earth brought forth grass... and God saw that it was good."

   THE FAULT THIS FILE MENDS. Between the boles of every wood on the earth
   there was LAWN. The grass file clothed the open ground with blades and
   flowers, the flora file stood herbs and saplings up out of it, and under
   the closed canopy of a German oakwood, a Norwegian spruce forest and the
   floor of the Congo you got the same short green turf, unchanged, because
   nothing in the world had ever been told that a forest floor is not a field.
   A wood is not a field with trees in it. It is dead leaf a foot deep, needle
   mat that nothing grows through, moss on the cold side of every step, logs
   lying where they fell, and fungi in the damp. Minecraft has none of it
   either — this is §2.4.5, and it is the one item in that section that the
   game it is measured against does not attempt at all.

   ---- THE THREE FILES OF THE GROUND, AND WHICH IS WHICH ----
   js/grass.js   THE SWARD — the blade a beast eats and a lion hides in. It
                 stands UP out of the ground and is a thing with a height.
   js/flora.js   everything WOODY and everything BEARING — the herb, the bush,
                 the sapling, the tree.
   js/ground.js  this file. THE FLOOR ITSELF — what LIES ON the ground and
                 has no height to speak of: litter, needle mat, moss, lichen,
                 deadfall, fungus. It is the bottom layer, it is drawn under
                 everything else, and it takes no cell away from either of the
                 other two: the sward may stand in the litter, and does.

   ---- IT COSTS NO DRAW CALL, AND THAT IS ON PURPOSE ----
   A mat is ONE upward face in the mesher's existing `solidW`, tinted; a log
   is one box in the existing `barkW`; a mushroom is two small boxes in
   `solidW`. So the whole floor of the earth is triangles merged into the
   chunk that was going to be built anyway, with not one new material and not
   one new draw call. Whether the triangles are affordable is a question for
   a measurement and not for an opinion — `GROUND.on(false)` sets the world
   without a floor beside the world with one, in the same page, on the same
   chunks. AUDIT Round 67 carries the numbers.

   ---- AND THE COLOUR OF THE LITTER IS THE TREE'S OWN LEAF ----
   Nothing here knows the name of a single species. The engine hands this file
   the KIND that grows on the cell — the same one the mesher would have built
   a tree from — and the litter is that tree's own leaf, turned; the deadfall
   is that tree's own bole, silvered. So an oakwood floor is oak-brown, a
   spruce floor is needle-rust, and adding a species to world/flora.js gives
   its wood a floor of the right colour with nothing whatever written here.

   ---- WHAT YOU MAY CHANGE ----
   FLOOR     the table below: how much of each ground bears each thing.
   Change a number, reload the game.
   ============================================================ */
(function(){
'use strict';

/* the same little noise the world is built with, kept here so this file
   stands on its own — exactly as js/grass.js keeps its own copy */
function hash2(x,y){ const n=Math.sin(x*127.1+y*311.7)*43758.5453; return n-Math.floor(n); }
function vnoise(x,y){ const xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi;
  const a=hash2(xi,yi), b=hash2(xi+1,yi), c=hash2(xi,yi+1), d=hash2(xi+1,yi+1);
  const fx=xf*xf*(3-2*xf), fy=yf*yf*(3-2*yf);
  return a+(b-a)*fx+(c-a)*fy+(a-b-c+d)*fx*fy; }
function fbm(x,y){ return vnoise(x,y)*0.55+vnoise(x*2.13,y*2.13)*0.3+vnoise(x*4.7,y*4.7)*0.15; }

const B=6;                     /* units to the block — a block is a metre walked */

/* ---- HOW CLOSED THE CANOPY IS OVER THIS CELL ----
   There is no leaf litter in a glade, because no leaf fell there. The engine
   gathers its woods into groves and thins the trees by one broad field, and
   THIS IS THAT FIELD — not a copy of it. `cellRaw` reads it from here to
   decide how many trees stand on a cell, and this file reads it to decide how
   much has fallen off them, so the carpet thins out exactly where the wood
   does. A second copy would drift the day either was touched, which is the
   one way a forest floor can look wrong: dead leaf a foot deep in an open
   glade. There is one. */
function closure(ix,iz){
  const grove=fbm(ix*0.035-17, iz*0.035+29);
  return Math.max(0, Math.min(1, (grove-0.36)/0.38));
}

/* ---- WHAT EACH GROUND OF THE EARTH BEARS ON ITS FLOOR ----
     litter  fallen leaf and needle — the carpet, and it needs a canopy
     moss    the damp and the shade
     lichen  the rock and the cold, and it needs no canopy at all
     fungus  the damp under the wood
     dead    a fallen bole lying where it came down
   A ground not named here has a bare floor: the sand, the ice, the sea.
   The shares are of the WHOLE ground, before the canopy and the damp and the
   shade have had their say below — a closed tropic floor reaches most of
   them, a Sahara wadi almost none. */
const FLOOR={
  /* the deciduous wood of the temperate north: leaf a foot deep */
  grass   :{ litter:0.80, moss:0.16, lichen:0,    fungus:0.030, dead:0.012 },
  /* the rain forest, where everything rots as fast as it falls */
  tropic  :{ litter:0.88, moss:0.34, lichen:0,    fungus:0.050, dead:0.020 },
  /* the shoulders of the range — needle mat, and the stone showing through */
  alpine  :{ litter:0.40, moss:0.20, lichen:0.14, fungus:0.014, dead:0.012 },
  /* beyond the trees: this is the reindeer's pasture and it is nearly all
     lichen, which is the truest thing in this whole table */
  tundra  :{ litter:0.05, moss:0.26, lichen:0.34, fungus:0.005, dead:0.003 },
  /* THE BARE ROCK, WHICH BORE NOTHING AT ALL. The sward file does not know
     this ground and never clothed one inch of it, so every scree, every crag
     and every mountain shoulder in the world was clean grey stone. Lichen on
     the rock is §2.4.5's own last clause and it is the one that shows most. */
  rock    :{ litter:0,    moss:0.07, lichen:0.38, fungus:0,     dead:0     },
  /* and there is lichen on the stones that show above the snow */
  snow    :{ litter:0,    moss:0,    lichen:0.09, fungus:0,     dead:0     },
  /* the plain: thorn scrub sheds little, and what it sheds the sun takes */
  savanna :{ litter:0.16, moss:0,    lichen:0,    fungus:0.002, dead:0.005 },
  desert  :{ litter:0.02, moss:0,    lichen:0,    fungus:0,     dead:0.001 },
  badlands:{ litter:0.01, moss:0,    lichen:0.06, fungus:0,     dead:0.001 },
  sand    :{ litter:0,    moss:0,    lichen:0,    fungus:0,     dead:0     },
};

/* how much more of it there is in the damp, and in the shade. Moss on the
   shaded side is the brief's own phrase; what makes a side shaded is the
   engine's business and is handed in. */
const DAMP_FUNGUS=2.6, DAMP_MOSS=1.8, SHADE_MOSS=2.2, SHADE_LICHEN=1.35;
/* and no one thing may take more than this much of a ground, or a damp shaded
   jungle floor comes up solid moss and the litter is never seen */
const MOST=0.52;

/* THE SWITCH. A floor is triangles, and triangles are measured. */
let ON=true;

/* ---- THE ONE DECISION ----
   What lies on this cell. `wild` is how far the ground is from a settled
   place, the same number the sward takes — a village sweeps its own paths,
   but it does not sweep them bare. `closed` is the canopy overhead, `damp`
   whether running water is within a bowshot, `shaded` whether a step stands
   over this cell on the side the sun never comes from.
   Each thing is drawn against its OWN share of one number, in order, so the
   five of them never fight over a cell and the commonest — the litter — takes
   what the others have left. */
function at(ix,iz,ground,wild,closed,damp,shaded){
  if(!ON) return null;
  const F=FLOOR[ground]; if(!F) return null;
  if(wild===undefined) wild=1;
  if(closed===undefined) closed=closure(ix,iz);
  const w=0.45+0.55*wild;                       /* swept, not scoured */
  /* the floor's OWN draw, seeded away from the sward's and the herb's, so
     what lies on the ground and what stands up out of it are independent */
  const j=hash2(ix*3.37+51.3, iz*2.11-27.9);
  const s=hash2(ix*1.93-9.7,  iz*4.07+3.3);     /* and its second, for size and sort */
  let p=0;
  /* a fallen bole first: it is the rarest and it lies OVER everything */
  if(j<(p+=(F.dead||0)*closed*w))                              return {m:'dead',   s};
  if(j<(p+=(F.fungus||0)*closed*(damp?DAMP_FUNGUS:1)*w))       return {m:'fungus', s};
  if(j<(p+=Math.min(MOST,(F.moss||0)*(0.35+0.65*closed)
                        *(shaded?SHADE_MOSS:1)*(damp?DAMP_MOSS:1))*w)) return {m:'moss', s};
  if(j<(p+=Math.min(MOST,(F.lichen||0)*(shaded?SHADE_LICHEN:1))*w))    return {m:'lichen', s};
  /* THE LITTER LAST, and it is handed HOW THICK THE FALL IS as well as the
     fact of it, because a mat of dead leaf is not the same thing in a closed
     wood and at its edge, and drawing it as though it were is what made the
     first cut of this a chessboard. See `emit` below. */
  const fall=(F.litter||0)*closed*w;
  if(j<(p+=fall))                                              return {m:'litter', s, f:Math.min(1,fall)};
  return null;
}
/* does the floor of this cell want to know what tree stands over it? Only
   the litter and the deadfall take their colour from the wood; asking the
   flora for a species on a mossy stone would be work done for nothing. */
function needsWood(m){ return m==='litter'||m==='dead'; }

/* ============================================================
   THE COLOURS
   ============================================================ */
const _t=[0,0,0];                    /* one scratch triple; the mesher copies it at once */
function tint(r,g,b){ _t[0]=r; _t[1]=g; _t[2]=b; return _t; }
function hexT(h,k){ const f=(k===undefined?1:k);
  return tint(((h>>16)&255)/255*f, ((h>>8)&255)/255*f, (h&255)/255*f); }
/* ---- THE LEAF, TURNED ----
   Dead leaf is not green gone dark; it is green gone BROWN. Every litter in
   the world is the tree's own leaf pulled most of the way to the colour of
   the forest floor and then taken down, which keeps a beech floor pale, an
   oak floor red-brown and a spruce floor rust, without one species being
   named. `k` is how far it has turned — a needle mat has turned all the way
   and lies for years; a leaf mat is this autumn's. */
function turned(leaf,k,dark){
  const r=((leaf>>16)&255)/255, g=((leaf>>8)&255)/255, b=(leaf&255)/255;
  const R=0.52, G=0.37, Bl=0.18;                /* the colour of the forest floor */
  const d=dark===undefined?1:dark;
  return tint((r+(R-r)*k)*d, (g+(G-g)*k)*d, (b+(Bl-b)*k)*d);
}
/* which floor a FORM lays down. A conifer sheds needles that lie for years
   and go rust; a broadleaf sheds a leaf a year that goes brown; a jungle
   floor is neither — it is dark and half rotted before it lands. */
const NEEDLE={conifer:1, column:1};
const ROTS  ={jungle:1, mangrove:1, banana:1, fern:1, palm:1};
/* AND NO TWO CELLS OF IT ARE THE SAME BROWN. One tint for a whole wood laid
   the floor down as a sheet of painted lino: dead leaf is a year's worth of
   it, rotted at different rates, and a tenth either way is all it takes to
   stop a carpet reading as a single flat thing. `s` is the cell's own draw,
   so the same square is the same brown every time it is built. */
function litterTint(K,s){
  const v=0.90+(s===undefined?0.5:s)*0.20;
  if(!K) return hexT(0x8a6a44,v);                     /* a wood with no name to it */
  const leaf=K.leaf||0x4a7a30;
  if(NEEDLE[K.form]) return turned(leaf,0.90,0.80*v); /* the needle mat, and it is dark */
  if(ROTS[K.form])   return turned(leaf,0.84,0.66*v); /* the jungle floor, darker still */
  return turned(leaf,0.78,1.00*v);                    /* leaf litter under the broadwood */
}
/* a fallen log is not the colour of a standing one: the bark comes off it and
   what is under goes grey */
function deadTint(K){
  const bole=(K&&K.bole)||0x6b4a2a;
  const r=((bole>>16)&255)/255, g=((bole>>8)&255)/255, b=(bole&255)/255;
  const m=(r+g+b)/3;
  return tint((r+(m-r)*0.6)*0.82, (g+(m-g)*0.6)*0.82, (b+(m-b)*0.6)*0.82);
}
/* the moss and the lichen are NAMED PLANTS of this world — world/flora.js
   gives both of them a colour — so the floor takes it from there rather than
   keeping a second one that drifts. The fallbacks are for a world loaded
   without a flora at all, which is what the tests do. */
let KINDS=null;
function load(kinds){ KINDS=kinds||null; }
function ofKind(name,dflt){ const K=KINDS&&KINDS[name]; return (K&&K.leaf)||dflt; }

/* ============================================================
   THE BUILDING — and every one of them is small
   `kit` is what the engine lends this file, the same kit the flora takes,
   with one thing added: `mat`, a single upward face. A floor is a floor and
   has no sides; drawn as a box it would cost six faces to show one.
   ============================================================ */
/* how far a mat is lifted off the ground it lies on. Coplanar it would fight
   the top face of the block for the depth buffer and flicker at every range;
   lifted a hand's breadth it would float. Two and a half centimetres of a
   metre block is under the eye and over the fight. */
const LIFT=0.15;

/* ---- AND NOTHING ON THIS FLOOR IS LAID ON THE GRID ----
   THE FAULT THIS MENDS, and it was plain in the first photographs taken of
   it: a patch centred on its own cell, on a third of the cells, gives a
   forest floor and a lichened crag a CHESSBOARD — brown square, green square,
   brown square, all the way to the trees — which is the one pattern neither
   of them can have. The SHARE was right and the shape was wrong.
   So every patch is shifted off the middle of its cell and is a different
   size and a different squareness from its neighbour. It never leaves its own
   cell, which matters: a mat that overhung the next cell would hang in the air
   wherever the ground steps down, and the ground steps down everywhere. */
function patch(kit,ix,iz,x,z,y,rx,rz,tint){
  const ox=(kit.hash(ix*7.7+2.2,iz*5.1-3.3)-0.5)*2*Math.max(0,B*0.5-rx);
  const oz=(kit.hash(ix*4.3-6.6,iz*8.9+1.1)-0.5)*2*Math.max(0,B*0.5-rz);
  kit.mat(kit.G,kit.M.solid, x+ox-rx,z+oz-rz, x+ox+rx,z+oz+rz, y, tint);
}
function emit(kit,g,ix,iz,yT,K){
  const G=kit.G, x0=ix*B, z0=iz*B, x=x0+B/2, z=z0+B/2, s=g.s;
  const y=yT+LIFT;
  switch(g.m){
    case 'litter': {
      /* the fall is laid two ways by how thick it is. Under a closed canopy
         nearly every cell bears one and they go down EDGE TO EDGE: that is a
         carpet, and a carpet with a few bare places worn through it is what
         the floor of a beechwood looks like. Toward the edge of the wood,
         where only some cells bear, each is a patch of its own — see above. */
      if(g.f===undefined||g.f>=0.70){
        kit.mat(G,kit.M.solid, x0,z0,x0+B,z0+B, y, litterTint(K,s)); return; }
      const r=B*(0.20+g.f*0.30);
      patch(kit,ix,iz,x,z,y, r, r*(0.78+s*0.44), litterTint(K,s));
      return; }
    case 'moss':
      /* moss does not tile a square: it lies in a patch with the ground
         showing round it, and no two patches the same */
      patch(kit,ix,iz,x,z,y, B*(0.20+s*0.24), B*(0.18+(1-s)*0.26),
            hexT(ofKind('moss',0x4a8a4a),0.80+s*0.16));
      return;
    case 'lichen':
      /* and lichen in a smaller, paler one — it is a crust on the stone */
      patch(kit,ix,iz,x,z,y, B*(0.13+s*0.22), B*(0.12+(1-s)*0.23),
            hexT(ofKind('lichen',0xb8c0a8),0.88+s*0.14));
      return;
    case 'fungus': {
      /* a stalk and a cap, and a second one beside it half the time, because
         mushrooms come up in company. Small: the cap is a third of a block. */
      const cap=s<0.42?0xa8402c:(s<0.74?0x8a6a3a:0xd8ccb4);
      const one=(cx,cz,k)=>{
        const hh=B*0.16*k, r=B*0.055*k, cr=B*0.15*k;
        kit.emitBox(G, cx-r,yT,cz-r, cx+r,yT+hh,cz+r, kit.M.solid,kit.M.solid,null, hexT(0xd8cfc0,0.92));
        kit.emitBox(G, cx-cr,yT+hh,cz-cr, cx+cr,yT+hh+B*0.07*k,cz+cr, kit.M.solid,kit.M.solid,null, hexT(cap));
      };
      one(x+B*(s-0.5)*0.4, z+B*(0.5-s)*0.4, 0.8+s*0.5);
      if(s>0.5) one(x-B*0.22, z+B*0.18, 0.55+s*0.3);
      return; }
    case 'dead': {
      /* A FALLEN BOLE, lying where it came down. It is the one thing on this
         floor with a shape you can see from across a glade, which is why a
         hundredth of the cells is enough of it. It lies along one of the two
         axes — a log at an angle would want its own box orientation, and six
         faces turned forty degrees is a different and dearer thing.
         AND IT IS DRAWN IN `solid`, NOT IN `bark`, which is not a detail. It
         was written with the bark first, and the measurement said at once
         that `barkW` — the grey master the six barks of §2.4.3 left unused —
         was not in that wood at all, so a log lying in the leaves brought a
         whole new material and NINETY-THREE new meshes with it, one per
         chunk, for a thing you meet once in a hundred cells. It is the right
         colour for it anyway: a bole that has been down a season has lost its
         bark, and what is under the bark goes grey. */
      const t=B*(0.22+s*0.16), len=B*(1.4+s*1.6);
      const T=deadTint(K);
      if(s<0.5) kit.emitBox(G, x-len,yT,z-t, x+len,yT+t*2,z+t, kit.M.solid,kit.M.solid,null, T);
      else      kit.emitBox(G, x-t,yT,z-len, x+t,yT+t*2,z+len, kit.M.solid,kit.M.solid,null, T);
      return; }
  }
}

window.GROUND={
  FLOOR, LIFT, load, at, emit, closure, needsWood,
  /* the switch that sets the world with a floor beside the world without one
     in ONE page, on the same chunks — geometry is measured, not asserted */
  on:v=>{ if(v!==undefined) ON=!!v; return ON; },
  /* what the floor of this ground can bear at all, for the suite */
  bears:ground=>!!FLOOR[ground],
};
})();
