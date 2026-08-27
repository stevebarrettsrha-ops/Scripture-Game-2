/* ============================================================
   THE AUTHORED PLACES — Phase 8, and the format they are written in
   ------------------------------------------------------------
   "And Adawm carried him, his tears streaming down his face; and went to
    the Cave of Treasures, where he laid him, and wound him up with sweet
    spices and myrrh."                        — Adam and Ḥawwah II, 1:4

   EVERYTHING ELSE IN world/ IS A RULE. A country, a river, what grows where,
   which beast keeps which hours — every one of them is a law the whole earth
   obeys, and the engine knows no instance by name. **A place is the one thing
   that is not.** It is a particular arrangement of particular blocks, made by
   hand, standing in one spot on the earth and nowhere else. That is what
   Phase 8 asks for, and it is why the format needs writing down rather than
   inventing twice.

   ---- WHAT A PLACE IS, MECHANICALLY ----
   A place is A STAMP, and nothing more exotic. It goes through the same door
   `emitHouse` and `lmPyramid` go through — `stampBlock` into SEDITS — which
   settles three questions at once, and settles them the way this engine
   already answers them everywhere else:

     it is REGENERABLE     — never written to the save; re-stamped whenever
                             its ground is loaded, dropped when it is left
     it LOSES TO THE HAND  — the mesh order is procedural → stamps → player
                             edits, so a man may break the Cave of Treasures
                             open and HIS digging is what persists. An
                             authored place is scenery you are allowed to
                             quarry, which is the only kind worth having
     it COSTS NOTHING TO SAVE — a place of ten thousand blocks adds nothing
                             to the record until somebody touches it

   ---- THE FORMAT ----
     n     the name. Shown nowhere by itself; it is how a place is FOUND, and
           how the audit and the tests name it.
     at    the landmark it stands in, BY NAME, out of world/landmarks.js. A
           place does not carry its own latitude: it is put where the world
           has already decided that landmark goes, so if the chart moves the
           Zagros the cave moves with it and does not end up in the air.
     dx,dy,dz   where in that landmark, in BLOCKS, from the landmark's own
           site: dy is measured from the ground at the site, so a cave sunk
           into a hill is a negative dy.
     w,h,d the box, in blocks. x runs w, y runs h, z runs d.
     pal   the palette: block ids BY NAME — 'stone', 'cobble', 'hewn-stone',
           'gold-ore', 'planks', 'log', and the rest of blocks/ — never by
           number. A number is a place in a list and the list may grow; a
           name is what the block IS. (The first draft of this file wrote
           'rock' and 'timber', which are not block ids at all; they resolved
           to nought, which IS air, and the cave came out as a hole quarried
           in the mountain. Only the reading off the world showed it.)
           **Index 0 is the KEEP slot** — see `keep` — and index 1 onward are
           real blocks. 'air' at index 1 is honest air and CUTS.
     rle   the blocks, run-length encoded, as a flat array of
           [count, paletteIndex, count, paletteIndex, ...] in the order
           x-major, then z, then y — the same order `read` and `write` in
           js/engine.js walk, so a captured place and a hand-written one are
           the same file.
     keep  if true (the default), palette index 0 means LEAVE THE GROUND AS IT
           IS. That is what lets a chamber be cut into a hill without also
           quarrying a cube of sky above it. **KEEP AND AIR ARE NOT THE SAME
           THING**, and a cave needs both: keep for the rock it is buried in,
           air for the room itself. Written with one meaning for both, the
           room is never hollowed — which is what the first reading showed.
           Set `keep:false` and index 0 is honest air, which is what a thing
           standing free on open ground wants, and what a CAPTURE returns.

   ---- HOW ONE IS MADE ----
   By hand, in the world, with the free hand — and then CAPTURED. The capture
   reads the box you mark and writes the file, so the format above is not
   something anybody has to type: it is what comes out. See `__VDBG.capture`
   and tools/capture.js. That is the whole of Phase 8's "in-game capture
   tool", and the round trip is guarded by acceptance test 56: a place
   captured out of the world and stamped back into it is the same blocks.
   ============================================================ */

/* ---- THE CAVE OF TREASURES ----
   The scrolls have named it since Phase 7 — world/scrolls.js sends the
   traveller to "the Cave of Treasures, under the garden", and AUDIT Round 46
   refused to invent a hoard for the sea caves on the grounds that it "would
   have to be picked up and moved the day Phase 8 arrives". Phase 8 has
   arrived, and this is that hoard, put where the scroll says it is.

   It stands in the Zagros, which world/landmarks.js raised in Phase 7 for
   exactly this reason: "neither Iraq nor Ethiopia had a single hollow
   anywhere in it, so 'the Cave of Treasures in the Zagros' had nowhere to
   be." It is secret:1 there — no banner, no chart mark — and so is this.

   IT IS DELIBERATELY SMALL AND DELIBERATELY PLAIN. A chamber cut back into
   the rock, a floor laid, a low bench of hewn stone along the back wall
   where the bodies were laid, and gold in the wall of it. What it is NOT is
   a puzzle, a dungeon or a treasure-run: this round is the FORMAT, and a
   place large enough to be interesting would have hidden whether the format
   works. The room is the proof; the hoard can grow in its own round, and
   growing it costs one capture and no code at all — which is the point.

   `keep:true` — index 0 leaves the mountain alone, so the chamber is cut
   INTO the Zagros rather than standing in a cube of quarried sky.

   MEASURED, standing in the Zagros at 40917,39105: 128 cells of carved air,
   49 of hewn-stone floor, 14 of cobble bench, 5 of gold in the back wall and
   299 of stone shell — 495 cells, which is 9 × 5 × 11 exactly. */
EARTH.place({
  n:'The Cave of Treasures', at:'The Zagros',
  dx:0, dy:-3, dz:0,
  w:9, h:5, d:11, keep:true,
  /* ---- THE PALETTE, AND WHY INDEX 0 AND INDEX 1 ARE BOTH AIR ----
     They are not the same thing and the difference is the whole of `keep`.
     **Index 0 is KEEP** — leave whatever the mountain already had there —
     and its name is never read while `keep:true`. **Index 1 is AIR** — cut
     it out, whatever was there. A cave wants both: keep, for the rock the
     chamber is buried in, which must stay exactly as the Zagros made it; and
     air, for the chamber itself, which must be carved. Written with one
     meaning for both, as the first draft was, the room is never hollowed and
     the place is a solid block of nothing — which is what the first reading
     off the world showed. */
  pal:['air','air','stone','gold-ore','cobble','hewn-stone'],
  /* x-major, then z, then y — the order js/engine.js reads and writes. Built
     longhand and run-length encoded, so this file reads as a captured one does. */
  rle:(function(){
    const W=9,H=5,D=11;
    const KEEP=0, AIR=1, STONE=2, GOLD=3, COBBLE=4, HEWN=5;
    const at=(x,y,z)=>{
      const inRoom = x>0&&x<W-1 && z>0&&z<D-1 && y>0&&y<H-1;
      /* the mouth: a doorway two high in the -z wall, in the middle */
      if(z===0 && x>=W/2-1 && x<=W/2 && y>0 && y<3) return AIR;
      if(inRoom){
        if(y===1) return (z>=D-3)?COBBLE:HEWN;   /* the bench, and the floor */
        return AIR;                              /* and the chamber, carved */
      }
      /* the back wall carries gold showing in the rock */
      if(z===D-1 && y>=2 && y<=3 && x>=2 && x<=W-3 && (x+y)%2===0) return GOLD;
      /* the shell: laid as stone where the chamber is cut, so that a cave in
         soft ground is still a cave and not a hole in a sand dune */
      if(x===0||x===W-1||z===0||z===D-1||y===0||y===H-1) return STONE;
      return KEEP;
    };
    const out=[]; let run=0, cur=-1;
    for(let x=0;x<W;x++) for(let z=0;z<D;z++) for(let y=0;y<H;y++){
      const v=at(x,y,z);
      if(v===cur) run++;
      else { if(run) out.push(run,cur); cur=v; run=1; }
    }
    if(run) out.push(run,cur);
    return out;
  })()
});

/* ---- THE CELL OF ḤANOḴ ----
   The other debt the scrolls have carried since Phase 7. The scroll trail
   names "Ḥanoḵ in the Ethiopian highlands, reached through the ranges", and
   the Simien Mountains were raised in world/landmarks.js in the same breath
   as the Zagros, for the same reason: the scroll had nowhere to be.

   "And Ḥanoḵ walked with Aluahim, and he was no more, for Aluahim took him."
   The seventh from Adawm kept no palace and hoarded no gold; what is here is
   a hermit's cell cut into the high rock — a chamber, a stone floor, a bench
   where the scrolls would lie, and ALABASTER showing in the back wall where
   the Cave of Treasures carries gold: white stone for the man who walked
   with Aluahim, riches for the cave where the fathers were laid. The mouth
   opens the other way (+z) so the two places are not one room copied.

   Same discipline as the Cave: small, plain, `keep:true`, secret where its
   mountain is secret. This is also the SECOND place, which makes test 56's
   per-place loop run twice for the first time. */
EARTH.place({
  n:'The Cell of Ḥanoḵ', at:'The Simien Mountains',
  dx:0, dy:-3, dz:0,
  w:7, h:5, d:9, keep:true,
  pal:['air','air','stone','alabaster','cobble','hewn-stone'],
  rle:(function(){
    const W=7,H=5,D=9;
    const KEEP=0, AIR=1, STONE=2, ALAB=3, COBBLE=4, HEWN=5;
    const at=(x,y,z)=>{
      const inRoom = x>0&&x<W-1 && z>0&&z<D-1 && y>0&&y<H-1;
      /* the mouth: a doorway two high in the +z wall, in the middle */
      if(z===D-1 && x>=Math.floor(W/2)-1 && x<=Math.floor(W/2) && y>0 && y<3) return AIR;
      if(inRoom){
        if(y===1) return (z<=2)?COBBLE:HEWN;     /* the bench, and the floor */
        return AIR;                              /* and the chamber, carved */
      }
      /* alabaster in the back wall, where the Cave carries gold */
      if(z===0 && y>=2 && y<=3 && x>=2 && x<=W-3 && (x+y)%2===0) return ALAB;
      /* the shell, laid as stone */
      if(x===0||x===W-1||z===0||z===D-1||y===0||y===H-1) return STONE;
      return KEEP;
    };
    const out=[]; let run=0, cur=-1;
    for(let x=0;x<W;x++) for(let z=0;z<D;z++) for(let y=0;y<H;y++){
      const v=at(x,y,z);
      if(v===cur) run++;
      else { if(run) out.push(run,cur); cur=v; run=1; }
    }
    if(run) out.push(run,cur);
    return out;
  })()
});

/* ---- THE CASTAWAY'S CACHE — a schematic anchored by a RULE ----
   Round 46 carved 84 sea caves and shipped them empty on purpose: "the cave
   ships; what is in it waits for the phase whose whole job is putting things
   in places." This is that something, and it forced the one design question
   Phase 8 had left: THE SEA CAVES HAVE NO NAMES. They are procedural, found
   by census, and a place anchors to a landmark by name.

   The answer keeps the line the whole of world/ is built on, by splitting
   the format's two halves instead of blurring them. The SCHEMATIC — pal,
   rle, box, keep — stays authored, particular, exactly as the Cave of
   Treasures' is. The ANCHOR is what it truly is here: **a rule** — `in:
   'seacave', share:N` — *at the back of one sea cave in N, this stands.*
   No `at`, no dx/dy/dz: which caves, and which way the cache faces, is the
   engine's placement pass reading the world, not this file naming a spot.

   WHICH caves hold it is decided by a hash of the cave's own back cell —
   the same device the beasts' lie-up hour and the herd stations use — so
   the same cave answers the same way on every visit and every boot. Found
   by rowing in, which is what secret means here.

   THE SCHEMATIC'S OWN FRAME: w=1 — a sea cave is a notch, one column wide,
   and a one-wide schematic needs no rotation machinery, only a direction.
   z runs OUTWARD from the wall: z=0 is the rock one step beyond the back
   (the wall the silver is in), z=1 is the back column itself. y=0 is the
   hollow's floor. What stands: the timber of the wrecked skiff on the
   floor, salt crusted on it, and silver in the wall — the something the
   castaway never came back for. Four cells, three placed, one kept. */
EARTH.place({
  n:"The Castaway's Cache", in:'seacave', share:3,
  w:1, h:2, d:2, keep:true,
  pal:['keep','silver-ore','planks','salt'],
  /* walk order x, then z, then y — so: (z0,y0) keep, (z0,y1) silver-ore,
     (z1,y0) planks, (z1,y1) salt */
  rle:[1,0, 1,1, 1,2, 1,3]
});
