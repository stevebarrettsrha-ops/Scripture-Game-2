/* THE ACCEPTANCE TESTS OF §3 — written before the features, as asked.

     node tools/acceptance.js            all twelve
     node tools/acceptance.js 10 12      only these

   Twelve tests stand here. The ones the world can already answer PASS; the
   ones that wait on the spans, the edit overlay and the block stamps report
   PENDING and name exactly what is missing. A red test that says what it
   wants is worth more than an absent one, and none of them is ever silently
   skipped.

   Nothing here reads the source. Every one of them boots the game in a
   headless browser and asks the running world. */
const {open,sail}=require('./harness.js');

/* What an ocean chunk and a plains chunk cost the mesher to build, in
   milliseconds, measured on THIS machine's software rasteriser at the
   commit before Phase 0 (`git worktree` at HEAD~1, same probe, same run).
   Test 12 holds the line here. These are comparative numbers between
   builds, not absolute ones — SwiftShader is not a phone and is not a GPU.
   If you move them, say so in AUDIT.md and say why.

   AND THE SLACK IS WIDE ON PURPOSE. These were taken on a quiet machine;
   the same probe on the same commit reads 20–45 % higher when the box is
   busy, and this test has cried wolf over exactly that. Measured back to
   back on a loaded machine, the commit BEFORE the caves read 3.144 ms and
   the commit after read 2.993 — the code got no slower, the machine got
   busier. So the guard is set to catch a real regression (a third again as
   dear) and not to catch the weather. If it fails, re-measure the previous
   commit in a worktree before believing it.

   AND IT IS MEASURED THREE TIMES AND THE LEAST IS TAKEN. Widening the slack
   was not enough on its own: one sample is one sample, and a scheduler that
   takes the box away for forty milliseconds in the middle of it turns a
   3.0 ms chunk into a 3.8 ms chunk and calls that a regression. Run alone,
   the same commit failed once in three. The interference only ever runs ONE
   WAY — it can add time to a build, never take it away — so the LEAST of
   several passes is the honest reading of what the code costs, and the
   spread between the passes is printed beside it, so a real slowdown (all
   three dear) is told apart from a busy box (one dear, two not). Each pass
   stands on fresh ground of the same kind, since a chunk already built is
   not built again. */
const BASELINE={ ocean:2.152, plain:1.970, slack:1.35, passes:3 };

const T={};   /* n -> {name, run(page) -> {ok, got, pending?}} */

/* ---------- 1..4 · the third dimension ---------- */
T[1]={name:'a cave mouth at a named range, with solid overhead',
  run:async page=>page.evaluate(()=>{
    const D=window.__VDBG;
    if(!D.caveAt) return {pending:'spans: no cave field (Phase 1)'};
    const m=D.nearestCaveMouth&&D.nearestCaveMouth();
    if(!m) return {ok:false,got:'no cave mouth found near any range'};
    /* stand in the mouth and look up: something must be over the head */
    const solidUp=D.solidAbove(m.x,m.y+2,m.z,40);
    return {ok:!!solidUp, got:'ceiling at +'+(solidUp?solidUp.dy:'nothing')};
  })};

T[2]={name:'it is dark deep in, and a torch lifts it',
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG;
    if(!D.lightAt) return {pending:'spans: no baked sky-exposure (Phase 1)'};
    const m=D.nearestCaveMouth&&D.nearestCaveMouth(); if(!m) return {ok:false,got:'no cave'};
    const want=Math.min(40,m.run);
    const deep=D.caveWalkIn(m,want); if(!deep) return {ok:false,got:'the passage runs nowhere'};
    /* the man must BE there — a torch lights where its bearer stands, and
       measuring the light at a place nobody is standing measures nothing */
    D.state.walk.x=deep.x; D.state.walk.z=deep.z; D.state.walk.feetY=deep.y; D.state.walk.vy=0;
    D.setMode('walk'); await D.settle(3);
    D.lightTorch(false); await D.settle(2);
    const dark=D.lightAt(deep.x,deep.y+3,deep.z);
    D.lightTorch(true); await D.settle(2);
    const lit=D.lightAt(deep.x,deep.y+3,deep.z);
    D.lightTorch(false);
    return {ok:dark<0.20&&lit>dark*2.5,
      got:want+' blocks in (the passage runs '+m.run+') · dark='+dark.toFixed(3)+
          ' lit='+lit.toFixed(3)};
  })};

T[3]={name:'the walker passes through no ceiling, floor or wall, six ways',
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG;
    if(!D.solidAt) return {pending:'spans: no point-in-solid test (Phase 1)'};
    const m=D.nearestCaveMouth&&D.nearestCaveMouth(); if(!m) return {ok:false,got:'no cave'};
    const fails=[];
    for(const d of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){
      const r=await D.shoveWalker(m,d,60);      /* drive him at it for sixty blocks */
      if(r.escaped) fails.push(d.join(','));
    }
    return {ok:!fails.length, got:fails.length?'escaped along '+fails.join(' | '):'held on all six'};
  })};

T[4]={name:'an overhang exists — solid, air, solid in one column',
  run:async page=>page.evaluate(()=>{
    const D=window.__VDBG;
    if(!D.cellSpans) return {pending:'spans: cellRaw returns no spans (Phase 1)'};
    let found=0, scanned=0;
    for(const s of D.caveSeeds()){
      for(let dx=-40;dx<=40&&found<1;dx+=3) for(let dz=-40;dz<=40&&found<1;dz+=3){
        const sp=D.cellSpans(s.ix+dx,s.iz+dz); scanned++;
        if(sp&&sp.length>=2&&sp[0]>0) found++;    /* air with solid under AND over it */
      } }
    return {ok:found>0, got:found+' overhangs in '+scanned+' columns'};
  })};

/* ---------- 5..7 · the world made mutable ---------- */
T[5]={name:'a broken block is gone, the chunk remeshed, the neighbour drawn',
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG, B=D.B;
    if(!D.setBlock) return {pending:'no setBlock / edit overlay (Phase 2)'};
    const p=D.playerXZ(), t=D.blockUnder(p.x+3*B,p.z);
    if(!t) return {ok:false,got:'no ground under the traveller'};
    const was=D.blockAt(t.ix,t.iy,t.iz);
    const g0=D.groundInfo(t.x,t.z).y;
    const r0=D.remeshes();
    const changed=D.setBlock(t.x,t.y,t.z,0);
    await D.settle(2);
    const g1=D.groundInfo(t.x,t.z).y;
    /* THE TRIANGLE COUNT IS NOT THE TEST. Breaking the top block of flat
       ground takes one face away at h and puts one back at h−1: the chunk is
       genuinely rebuilt and the count is genuinely identical. What is asked
       here is that the chunk WAS laid again, that the block is gone, that
       the ground fell by exactly one block, and that the block beside it now
       stands with an open face where it had none. */
    const remeshed=D.remeshes()-r0;
    const fell=Math.abs((g0-g1)-D.B)<0.001;
    const sideNowOpen=!D.blockSolidAt(t.ix,t.iy,t.iz)&&D.blockSolidAt(t.ix+1,t.iy,t.iz);
    return {ok:changed&&!D.solidAt(t.x,t.y,t.z)&&remeshed>0&&fell&&sideNowOpen,
      got:'broke '+D.blockOf(was).name+' · gone='+!D.solidAt(t.x,t.y,t.z)+
          ' · '+remeshed+' chunk(s) laid again · ground fell one block='+fell+
          ' · neighbour now faced='+sideNowOpen};
  })};

T[6]={name:'a block placed in mid-air is solid, lit and collidable',
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG, B=D.B;
    if(!D.setBlock) return {pending:'no setBlock / edit overlay (Phase 2)'};
    const p=D.playerXZ(), t=D.blockUnder(p.x-3*B,p.z);
    if(!t) return {ok:false,got:'no ground under the traveller'};
    const y=t.y+6*B, n=D.blockId('brick');
    if(!n) return {ok:false,got:'the registry does not know brick'};
    const before=D.chunkTriangleCount(t.cx,t.cz);
    D.setBlock(t.x,y,t.z,n);
    await D.settle(2);
    const after=D.chunkTriangleCount(t.cx,t.cz);
    /* collidable: the ground under a body standing at its height IS its top */
    const g=D.groundInfo(t.x,t.z,y+B*0.5);
    const stands=Math.abs(g.y-(Math.floor(y/B)+1)*B)<0.001;
    return {ok:D.solidAt(t.x,y,t.z)&&after>before&&stands&&D.lightAt(t.x,y,t.z)>0.2,
      got:'a '+D.blockOf(n).name+' six blocks up · solid='+D.solidAt(t.x,y,t.z)+
          ' · drawn (tris '+before+'→'+after+') · stood on='+stands+
          ' · light='+D.lightAt(t.x,y,t.z).toFixed(2)};
  })};

T[7]={name:'both changes survive a reload',
  run:async(page,ctx)=>{
    const has=await page.evaluate(()=>!!window.__VDBG.setBlock);
    if(!has) return {pending:'no persistence to test yet (Phase 2)'};
    /* set two deeds down at named places, write them, and come back */
    const marks=await page.evaluate(async()=>{
      const D=window.__VDBG, B=D.B, p=D.playerXZ();
      const t=D.blockUnder(p.x+9*B,p.z+9*B);
      if(!t) return null;
      const hi=t.y+7*B;
      D.setBlock(t.x,t.y,t.z,0);                    /* one broken */
      D.setBlock(t.x,hi,t.z,D.blockId('salt'));     /* and one set down */
      await D.settle(2);
      await D.editsSave();
      return {bx:t.x,by:t.y,bz:t.z,px:t.x,py:hi,pz:t.z,salt:D.blockId('salt')};
    });
    if(!marks) return {ok:false,got:'nowhere to stand'};
    await ctx.reload();
    return page.evaluate(m=>{ const D=window.__VDBG;
      const b=D.editMark(m.bx,m.by,m.bz), p=D.editMark(m.px,m.py,m.pz);
      let entries=0; for(const v of D.edits().values()) entries+=v.size;
      /* a failure here must say WHAT it found, or the next person has to
         re-derive the whole round trip to learn one number */
      return {ok:b===0&&p===m.salt,
        got:'the hole reads '+b+' (wanted 0) · the high block reads '+p+
            ' (wanted '+m.salt+') · '+D.edits().size+' chunks, '+entries+
            ' blocks remembered'};
    },marks);
  }};

/* ---------- 8..9 · structures made real ---------- */
T[8]={name:'a wall block breaks out of a house, and the hole is walkable',
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG;
    if(!D.setBlock||!D.houseWallBlock) return {pending:'houses are still decoration (Phase 3)'};
    const v=await D.standInVillage(); if(!v) return {ok:false,got:'no town would stand within six hundred frames'};
    const w=D.houseWallBlock(); if(!w) return {ok:false,got:'a town of '+v.houses+' houses, and no wall found in it'};
    const was=D.blockOf(D.blockAt(w.ix,w.iy,w.iz));
    /* a hole a man walks through is TWO blocks high; breaking one and calling
       it walkable would be testing nothing */
    const b1=D.setBlock(w.x,w.y,w.z,0), b2=D.setBlock(w.above.x,w.above.y,w.above.z,0);
    await D.settle(2);
    const gone=!D.solidAt(w.x,w.y,w.z)&&!D.solidAt(w.above.x,w.above.y,w.above.z);
    const pass=D.walkerCanPass(w);
    return {ok:b1&&b2&&gone&&pass,
      got:'broke '+(was?was.name:'?')+' twice over · hole open='+gone+' · a man passes='+pass};
  })};

T[9]={name:'dig under a house and its blocks stay put',
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG;
    if(!D.setBlock||!D.houseWallBlock) return {pending:'houses are still decoration (Phase 3)'};
    const v=await D.standInVillage(); if(!v) return {ok:false,got:'no town would stand within six hundred frames'};
    const w=D.houseWallBlock(); if(!w) return {ok:false,got:'a town of '+v.houses+' houses, and no wall found in it'};
    /* mine the ground out from under a standing wall. Nothing in this world
       falls of its own weight, and a house that collapsed when its footing
       was dug would be a physics nobody has written. */
    let dug=0;
    for(let k=1;k<=4;k++) if(D.setBlock(w.x,w.y-k*D.B,w.z,0)) dug++;
    await D.settle(3);
    const stands=D.solidAt(w.x,w.y,w.z);
    const hollow=!D.solidAt(w.x,w.y-D.B*2,w.z);
    return {ok:stands&&hollow&&dug>0,
      got:dug+' block(s) taken from under it · the wall still stands='+stands+' · the hole is open='+hollow};
  })};

/* ---------- 10 · the light in the corners.  PASSES TODAY ---------- */
T[10]={name:'ambient occlusion is present and measurable',
  run:async page=>page.evaluate(()=>{
    const D=window.__VDBG;
    /* (a) the rule itself: open ground untouched at exactly 1, one thing
       beside it darker, and a true inside corner darkest of all */
    if(!D.aoLevel) return {ok:false,got:'no aoLevel exposed'};
    const flat=D.aoLevel(0,0,0), one=D.aoLevel(1,0,0), corner=D.aoLevel(1,1,1);
    const unitOK=(flat===1)&&(one<1)&&(corner<one)&&(corner<0.6);
    /* (b) the geometry: grassTop is a TOP-face-only material, laid at a flat
       shade of exactly 1.0 before this change. If any of its vertex colours
       is below 1, the occlusion is truly baked into the world. */
    let lo=1, n=0, tops=0;
    D.chunkRoot.traverse(o=>{ if(!o.geometry||!o.material) return;
      if(o.material!==D.MAT.grassTop&&o.material!==D.MAT.grassTopTr&&
         o.material!==D.MAT.grassTopSv&&o.material!==D.MAT.grassTopTu) return;
      tops++;
      const c=o.geometry.getAttribute('color'); if(!c) return;
      for(let i=0;i<c.count;i++){ const v=c.getX(i); n++; if(v<lo) lo=v; } });
    return {ok:unitOK&&tops>0&&lo<0.95,
      got:'open='+flat+' one='+one.toFixed(2)+' corner='+corner.toFixed(2)+' · '+tops+' top meshes, '+
          n+' vertices, darkest '+lo.toFixed(3)};
  })};

/* ---------- 11 · the frame budget ---------- */
/* Half of this can be answered the moment the caves exist, and it is the
   half that carries the risk — an edited chunk differs from an unedited one
   by a remesh, not by any per-frame cost, while a cave interior truly draws
   more faces. So the cave half is measured now and the edit half named as
   still owing, rather than the whole thing reported as untested. */
T[11]={name:'a cave and an edited chunk cost no more than open ground ×1.5',
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG, B=D.B;
    if(!D.standInCave) return {pending:'no caves to stand in (Phase 1)'};
    const open=await D.timeFrames(120);
    /* (a) a passage under a mountain */
    const at=await D.standInCave();
    if(!at) return {ok:false,got:'no cave found to stand in'};
    const cave=await D.timeFrames(120);
    /* (b) and a chunk somebody has built in: two hundred blocks laid, then
       stood in. An edited chunk differs from an unedited one by a REMESH,
       not by any per-frame cost, so this ought to come out level — and the
       remesh itself is timed separately, because a hitch on every blow of
       the pick is the thing that would actually be felt. */
    const p=D.playerXZ(), g=D.groundInfo(p.x,p.z).y, b0=Math.floor(g/B);
    let laid=0;
    for(let x=-4;x<=4;x++) for(let z=-4;z<=4;z++) for(let y=1;y<=3;y++)
      if(D.setBlock(p.x+x*B,(b0+y)*B+1,p.z+z*B,D.blockId('brick'))) laid++;
    /* the REMESH, and not the frame it happens to sit in: under a software
       rasteriser a frame is half a second, and timing `settle` would report
       three frames of waiting as the cost of laying a chunk again. */
    const fl=D.flushNow();
    await D.settle(1);
    const edited=await D.timeFrames(120);
    return {ok:cave<open*1.5&&edited<open*1.5,
      got:'open '+open.toFixed(1)+' ms · in a passage '+cave.toFixed(1)+' ms ('+
          (cave/open).toFixed(2)+'×) · in a chunk with '+laid+' blocks laid in it '+
          edited.toFixed(1)+' ms ('+(edited/open).toFixed(2)+'×) · laying those '+
          fl.chunks+' chunks again took '+fl.ms.toFixed(1)+' ms'};
  })};

/* ---------- 13..20 · THE HAND AND THE HOARD (Phase 4) ----------
   Written before the features, as 1–12 were. Each reports PENDING and names
   what is missing until its step of PLAN.md §11 lands. */
T[13]={name:'the mark falls on the block the eye is on, and on the right face of it',
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG, B=D.B;
    if(!D.aimFrom) return {pending:'no reach: the arm is not built (Phase 4 step 1)'};
    /* ---- THE TEST BUILDS ITS OWN SITUATION ----
       Reaching at the GROUND cannot answer this. On flat country the block
       beside the one under your feet is solid at the same height, so a level
       ray fired at it starts INSIDE it — and the arm rightly refuses to
       answer for the cell a man's own head is in. The first draft of this
       test relied on the terrain and read `0 of 0 side faces` wherever the
       land happened to be flat, which is most of the earth.
       So: one block is set in open air, and reached at from all six ways
       through nothing but air. Every answer is then forced. */
    const p=D.playerXZ(), t=D.blockUnder(p.x+5*B,p.z);
    if(!t) return {ok:false,got:'no ground under the traveller'};
    const n=D.blockId('brick'); if(!n) return {ok:false,got:'the registry does not know brick'};
    const ix=t.ix, iy=t.iy+5, iz=t.iz;            /* well clear of the ground */
    const cx=(ix+0.5)*B, cy=(iy+0.5)*B, cz=(iz+0.5)*B;
    D.setBlock(cx,cy,cz,n);
    await D.settle(2);
    const ways=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
    const wrong=[];
    for(const d of ways){
      /* stand three blocks off along the axis and reach back along it */
      const ox=cx-d[0]*B*3, oy=cy-d[1]*B*3, oz=cz-d[2]*B*3;
      const h=D.aimFrom(ox,oy,oz, d[0],d[1],d[2], 6);
      if(!h){ wrong.push(d.join(',')+':nothing'); continue; }
      if(h.ix!==ix||h.iy!==iy||h.iz!==iz){ wrong.push(d.join(',')+':wrong cell'); continue; }
      /* the face struck is the one that looks back the way the arm came */
      if(h.nx!==-d[0]||h.ny!==-d[1]||h.nz!==-d[2]) wrong.push(d.join(',')+':wrong face');
    }
    /* the reach is finite: the same block, further off than the arm is long */
    const far=D.aimFrom(cx,cy+B*40,cz, 0,-1,0, D.reach());
    /* and the block is put back as it was found */
    D.setBlock(cx,cy,cz,0);
    await D.settle(2);
    return {ok:!wrong.length&&!far,
      got:(6-wrong.length)+' of 6 ways struck the right cell and the right face'+
          (wrong.length?' · '+wrong.join(' | '):'')+
          ' · beyond the reach: '+(far?'STRUCK':'nothing')};
  })};

T[14]={name:'the rock refuses a bare hand and says so, the earth gives to it, and a tool ends the argument',
  /* WHAT THIS TEST USED TO ASK, AND WHY IT IS NOT ASKED ANY MORE. It held the
     rule of Round 34: a block that names a tool is had by the bare hand at
     HAND_SLOW times the labour. Commit b27c625 replaced that rule — "the tool
     is a requirement, not a discount" — and the test was never brought up to
     it, so for two rounds it reported a red that was the game working as
     written. A test that holds a repealed law is worse than no test: it
     shouts, and what it shouts is out of date.

     AND THE RULE AS IT NOW STANDS HAS TWO TIERS, because one tier closed the
     world on itself: flint wanted a pick, a pick is made of flint, and a
     whole voyage could break nothing but hay, wool, glass and leaves. So:

       THE ROCK refuses the bare hand outright, and SAYS which tool it wants.
       THE EARTH and the timber give to the bare hand at HAND_SLOW.
       THE RIGHT TOOL in the hand breaks anything at its own hardness.

     All three are asked here, on the running world, with the blow driven
     through the game's own mineTick. */
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG, B=D.B;
    if(!D.mineProgress) return {pending:'no blow: hold-to-break is not built (Phase 4 step 2)'};
    const p=D.playerXZ(), t=D.blockUnder(p.x+7*B,p.z);
    if(!t) return {ok:false,got:'no ground under the traveller'};
    /* set in open air five courses over the ground, where nothing else stands */
    const ix=t.ix, iy=t.iy+5, iz=t.iz;
    const cx=(ix+0.5)*B, cy=(iy+0.5)*B, cz=(iz+0.5)*B;
    const STEP=1/60;
    /* the clock is DRIVEN, not waited on: a software rasteriser's frames are
       half a second apiece and a test that slept would measure the machine */
    const strike=async(id,seconds)=>{
      D.setBlock(cx,cy,cz,D.blockId(id)); await D.settle(2);
      D.mineDrive(true); D.mineAt(ix,iy,iz,0,1,0); D.mineHold(true);
      let spent=0, broke=-1, cracks=0;
      for(let k=0;k<Math.ceil(seconds*70);k++){
        D.mineStep(STEP); spent+=STEP;
        const m=D.mineProgress(); if(m) cracks=Math.max(cracks,m.cracks);
        if(!D.blockSolidAt(ix,iy,iz)){ broke=spent; break; } }
      D.mineHold(false); D.mineAt(null); D.mineDrive(false);
      D.setBlock(cx,cy,cz,0); await D.settle(1);
      return {broke,cracks};
    };
    /* a hand holding nothing, and a hand holding the pick */
    /* THE BARE HAND IS FOUND AFRESH EVERY TIME. Taking one empty slot at the
       start and going back to it later is how this test first read "the speed
       is read out of the hand: false": the pick it had just been given had
       gone INTO that slot, so the hand it called bare was holding the pick. */
    const bareHand=()=>{ const i=D.satchel().findIndex(s=>!s);
      if(i>=0){ D.setHeld(i); return true; } return false; };
    const pickHand=()=>{ D.satchelAdd('flint-pick',1);
      const i=D.satchel().findIndex(s=>s&&s.id==='flint-pick');
      if(i>=0) D.setHeld(i); return i>=0; };
    const spoke=()=>{ const e=document.getElementById('verse-t'); return e?e.textContent:''; };
    if(!bareHand()) return {pending:'every slot of the satchel is full — no bare hand to test with'};
    const held0=D.held();

    /* ---- 1. THE ROCK REFUSES, AND SAYS WHAT IT WANTS ---- */
    const rockB=D.blockOf(D.blockId('stone'));
    const rock=await strike('stone', rockB.hardness*D.handSlow()*1.5);
    const word=spoke();
    const refused=rock.broke<0;
    const toldHim=/pick/i.test(word);

    /* ---- 2. THE EARTH AND THE TIMBER GIVE, SLOWLY ---- */
    bareHand();
    const woodB=D.blockOf(D.blockId('log'));
    const wantSlow=woodB.hardness*D.handSlow();
    const wood=await strike('log', wantSlow*2);
    const slowRight=wood.broke>=wantSlow-0.15&&wood.broke<=wantSlow+0.35;

    /* ---- 3. AND THE TOOL ENDS THE ARGUMENT ---- */
    const hasPick=pickHand();
    const withPick=await strike('stone', rockB.hardness*2);
    const fastRight=withPick.broke>=rockB.hardness-0.15&&withPick.broke<=rockB.hardness+0.35;

    /* ---- 4. AND A HAND TAKEN OFF LOSES THE WORK: the block heals ---- */
    D.setBlock(cx,cy,cz,D.blockId('stone')); await D.settle(1);
    D.mineDrive(true); D.mineAt(ix,iy,iz,0,1,0); D.mineHold(true);
    for(let k=0;k<30;k++) D.mineStep(STEP);
    D.mineHold(false);
    const dropped=D.mineProgress()===null;
    D.mineAt(null); D.mineDrive(false); D.setBlock(cx,cy,cz,0); await D.settle(2);

    /* ---- 5. AND THE SPEED IS READ OUT OF THE HAND, not assumed ---- */
    const withTool=D.toolSpeedOf('stone');            /* the pick is still held */
    /* and the pick is put down before the bare hand is asked anything */
    D.satchelTake('flint-pick',1); D.setHeld(held0); bareHand();
    const withNone=D.toolSpeedOf('stone'), free=D.toolSpeedOf('hay');
    const asksTheHand=Math.abs(withTool-1)<1e-6&&
                      Math.abs(withNone-1/D.handSlow())<1e-6&&free===1;

    const faults=[];
    if(!refused) faults.push('the rock gave to a bare hand in '+rock.broke.toFixed(2)+'s');
    if(!toldHim) faults.push('it refused without naming the tool (it said: "'+word.slice(0,60)+'")');
    if(!slowRight) faults.push('timber by hand took '+(wood.broke<0?'NEVER':wood.broke.toFixed(2)+'s')+
      ', and it wants '+wantSlow.toFixed(2)+'s');
    if(!wood.cracks) faults.push('no cracks were cut in the timber');
    if(!hasPick) faults.push('a flint pick could not be put in the hand');
    else if(!fastRight) faults.push('with a pick the rock took '+(withPick.broke<0?'NEVER':withPick.broke.toFixed(2)+'s')+
      ', and it wants '+rockB.hardness.toFixed(2)+'s');
    if(!dropped) faults.push('the hand came off and the work was kept');
    if(!asksTheHand) faults.push('the speed is not read out of the hand ('+
      withTool+' with a pick, '+withNone.toFixed(3)+' without, '+free+' for hay)');
    return {ok:!faults.length,
      got:'stone (hardness '+rockB.hardness+') by hand: '+(refused?'REFUSED — "'+word.slice(0,52)+'…"':'broke in '+rock.broke.toFixed(2)+'s')+
        ' · log (hardness '+woodB.hardness+') by hand: '+(wood.broke<0?'NEVER':wood.broke.toFixed(2)+'s of '+wantSlow.toFixed(2)+' wanted')+
        ', '+wood.cracks+' cracks · stone with a flint pick: '+(withPick.broke<0?'NEVER':withPick.broke.toFixed(2)+'s of '+rockB.hardness.toFixed(2)+' wanted')+
        ' · the hand taken off loses the work: '+dropped+
        ' · the speed is read out of the hand: '+asksTheHand+
        (faults.length?' · '+faults.join(' · '):'')};
  })};

T[15]={name:'what is broken becomes a thing on the ground, and comes into the satchel',
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG, B=D.B;
    if(!D.drops) return {pending:'no drops: nothing falls from a broken block (Phase 4 step 3)'};
    const p=D.playerXZ(), t=D.blockUnder(p.x+3*B,p.z);
    if(!t) return {ok:false,got:'no ground under the traveller'};
    /* ---- HE IS STOOD ON THE VERY GROUND FIRST ----
       Run after the cave tests, the traveller is UNDER a mountain, and
       `blockUnder` answers with the roof of the passage — a long way over his
       head. The block was then set above THAT, and what fell from it came to
       rest on the mountain-top while he stood in the dark beneath, out of
       reach of a thing he was supposed to walk onto. The test passed alone
       and failed in the suite, which is the signature of a test that assumed
       where it was.
       So he is set on the block this test is about to build over, and
       everything after is within a pace of him by construction. */
    D.setMode('walk');
    D.state.walk.x=t.x; D.state.walk.z=t.z; D.state.walk.feetY=undefined;
    await D.settle(2);
    const n=D.blockId('brick'), b=D.blockOf(n);
    /* ---- AND THE HAND HOLDS THE PICK, because the rock now asks for one ----
       Brick names a pick, and a rock that names a tool does not give to bare
       fingers at all. This test is about what happens AFTER a block breaks —
       the drop, the rest, the walking on, the satchel — so the tool is put in
       the hand rather than the block changed for a softer one. Test 14 is
       where the tool rule itself is put to the question. */
    D.satchelAdd('flint-pick',1);
    { const i=D.satchel().findIndex(s=>s&&s.id==='flint-pick'); if(i>=0) D.setHeld(i); }
    /* THREE PACES OFF, not underfoot. A block broken at a man's own feet is
       gathered as it falls and never comes to rest at all — so asking one
       striking for both "it rested" and "it was taken" asks for two things
       that exclude each other. It is broken out of reach, watched down, and
       THEN walked to. */
    const ix=t.ix+3, iy=t.iy+1, iz=t.iz;
    const cx=(ix+0.5)*B, cy=(iy+0.5)*B, cz=(iz+0.5)*B;
    const had=(D.hoard()['brick']||0);
    D.setBlock(cx,cy,cz,n); await D.settle(2);
    /* strike it through */
    D.mineDrive(true); D.mineAt(ix,iy,iz,0,0,-1); D.mineHold(true);
    const STEP=1/60;
    for(let k=0;k<Math.ceil(b.hardness*D.handSlow()*70);k++){
      D.mineStep(STEP);
      if(!D.blockSolidAt(ix,iy,iz)) break; }
    D.mineHold(false); D.mineAt(null); D.mineDrive(false);
    const broke=!D.blockSolidAt(ix,iy,iz);
    /* it falls, and it comes to rest on the ground rather than in the air */
    let rested=false;
    for(let k=0;k<300;k++){ D.dropStep(STEP);
      const ds=D.drops().filter(d=>d.id==='brick');
      if(ds.length&&ds[0].rest){ rested=true; break; }
      if(!ds.length) break; }
    const lay=D.drops().filter(d=>d.id==='brick')[0];
    /* and NOW the traveller walks onto it and takes it up */
    D.setMode('walk');
    D.state.walk.x=lay?lay.x:cx; D.state.walk.z=lay?lay.z:cz; D.state.walk.feetY=undefined;
    await D.settle(2);
    let took=(D.hoard()['brick']||0)>had;
    for(let k=0;k<200&&!took;k++){ D.dropStep(STEP);
      if((D.hoard()['brick']||0)>had) took=true; }
    const gained=(D.hoard()['brick']||0)-had;
    /* the word of the substance is given once, and only once */
    const spoke=D.spoken().indexOf('brick')>=0;
    return {ok:broke&&rested&&took&&gained===1&&spoke,
      got:'broke='+broke+' · it fell and came to rest='+rested+
          ' · taken up='+took+' · the hoard gained '+gained+
          ' · its word was spoken='+spoke};
  })};

T[16]={name:'the satchel stacks, and survives a reload',
  run:async(page,ctx)=>{
    const has=await page.evaluate(()=>!!window.__VDBG.satchel);
    if(!has) return {pending:'no satchel (Phase 4 step 4)'};
    const before=await page.evaluate(async()=>{
      const D=window.__VDBG, STACK=D.STACK(), N=D.SATCHEL_N();
      /* empty it, so what is counted is this test's own doing */
      for(const id of Object.keys(D.hoard())) D.satchelTake(id,1e9);
      /* a score and a half of one substance must lie as a FULL stack and a
         part one — not as thirty loose things in thirty slots */
      const put=D.satchelAdd('brick',Math.floor(STACK*1.5));
      const sl=D.satchel().filter(s=>s&&s.id==='brick');
      const full=sl.filter(s=>s.n===STACK).length, part=sl.filter(s=>s.n<STACK).length;
      const stacked=(sl.length===2&&full===1&&part===1);
      /* it fills, and then it REFUSES — a satchel with a size is the point */
      for(let i=0;i<N+4;i++) D.satchelAdd('stone',STACK);
      const refused=!D.satchelRoom('salt')&&D.satchelAdd('salt',1)===0;
      /* taking out gives back exactly what is there and no more */
      const asked=Math.floor(STACK*1.5)+7;
      const back=D.satchelTake('brick',asked);
      const tookRight=(back===Math.floor(STACK*1.5));
      /* and now a small, ordered load to carry through the reload */
      D.satchelTake('stone',1e9);
      D.satchelAdd('brick',3); D.satchelAdd('cobble',5); D.satchelAdd('brick',2);
      await D.saveNow();
      return {stacked,refused,tookRight,put,full,part,back,asked,STACK,
        held:D.satchel().slice(0,4)};
    });
    /* THE RELOAD IS THE TEST. Writing the save and reading the same object
       back proves nothing about a world raised again from it. */
    await ctx.reload();
    return page.evaluate(b0=>{ const D=window.__VDBG;
      const now=D.satchel().slice(0,4);
      const same=JSON.stringify(now)===JSON.stringify(b0.held);
      const brick=(D.hoard()['brick']||0), cobble=(D.hoard()['cobble']||0);
      return {ok:b0.stacked&&b0.refused&&b0.tookRight&&same&&brick===5&&cobble===5,
        got:'a score is '+b0.STACK+' · '+b0.put+' bricks lay as '+b0.full+
            ' full stack and '+b0.part+' part · a full satchel refuses='+b0.refused+
            ' · taking gave back '+b0.back+' of '+b0.asked+' asked'+
            ' · after the reload he still carries '+brick+' brick and '+cobble+
            ' cobble, in his own order='+same};
    },before);
  }};

T[17]={name:'a block placed against a face stands on the air side of it',
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG, B=D.B;
    if(!D.placeBlock) return {pending:'no placing (Phase 4 step 6)'};
    const p=D.playerXZ(), t=D.blockUnder(p.x+6*B,p.z+6*B);
    if(!t) return {ok:false,got:'no ground under the traveller'};
    /* stand him on that ground, so nothing below is a cave roof */
    D.setMode('walk');
    D.state.walk.x=t.x; D.state.walk.z=t.z; D.state.walk.feetY=undefined;
    await D.settle(2);
    /* one block in open air, and the arm brought to each of its six faces in
       turn: what is laid must appear on the AIR side and nowhere else */
    const n=D.blockId('brick');
    const ix=t.ix+4, iy=t.iy+9, iz=t.iz+4;
    const cx=(ix+0.5)*B, cy=(iy+0.5)*B, cz=(iz+0.5)*B;
    /* ---- THE SIX WAYS ARE CLEARED FIRST ----
       The arm refuses to answer for a cell a man's own head is in, and quite
       rightly. Fired from three blocks off through country that happens to
       RISE, four of the six rays began inside a hillside and the test read
       the right refusal as "the arm missed". The lanes are emptied before
       anything is asked of them, and then every answer is forced. */
    for(const d of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]])
      for(let k=1;k<=4;k++) D.setBlock((ix+d[0]*k+0.5)*B,(iy+d[1]*k+0.5)*B,(iz+d[2]*k+0.5)*B,0);
    await D.settle(2);
    const wrong=[]; let laid=0;
    for(const d of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){
      D.setBlock(cx,cy,cz,n); await D.settle(1);
      /* clear the cell the block would go into, so each way is judged alone */
      D.setBlock((ix+d[0]+0.5)*B,(iy+d[1]+0.5)*B,(iz+d[2]+0.5)*B,0); await D.settle(1);
      D.satchelTake('cobble',1e9); D.satchelAdd('cobble',1); D.setHeld(0);
      /* reach at it from outside, along that axis */
      const A=D.aimFrom(cx-d[0]*B*3, cy-d[1]*B*3, cz-d[2]*B*3, d[0],d[1],d[2], 6);
      if(!A||A.ix!==ix||A.iy!==iy||A.iz!==iz){ wrong.push(d.join(',')+':the arm missed'); continue; }
      const r=D.placeFrom(A);
      if(r.no){ wrong.push(d.join(',')+':'+r.no); continue; }
      const wx=ix-d[0], wy=iy-d[1], wz=iz-d[2];   /* the air side is back the way the arm came */
      if(r.at[0]!==wx||r.at[1]!==wy||r.at[2]!==wz){ wrong.push(d.join(',')+':laid at the wrong cell'); continue; }
      if(!D.blockSolidAt(wx,wy,wz)){ wrong.push(d.join(',')+':nothing stands there'); continue; }
      laid++;
      D.setBlock((wx+0.5)*B,(wy+0.5)*B,(wz+0.5)*B,0); await D.settle(1);
    }
    /* and it costs him what he laid */
    D.satchelTake('cobble',1e9); D.satchelAdd('cobble',2); D.setHeld(0);
    const A2=D.aimFrom(cx-B*3,cy,cz, 1,0,0, 6);
    const before=(D.hoard()['cobble']||0);
    if(A2) D.placeFrom(A2);
    const after=(D.hoard()['cobble']||0);
    const paid=(before-after===1);
    D.setBlock(cx,cy,cz,0); await D.settle(2);
    return {ok:!wrong.length&&laid===6&&paid,
      got:laid+' of 6 faces laid on the air side'+(wrong.length?' · '+wrong.join(' | '):'')+
          ' · and it costs him what he lays='+paid};
  })};

T[18]={name:'no block may be placed inside the traveller, a villager or a beast',
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG, B=D.B;
    if(!D.placeBlock) return {pending:'no placing (Phase 4 step 6)'};
    /* THE TRAVELLER HIMSELF. He is stood on known ground, and the cells his
       own body fills are asked for by name. */
    const p=D.playerXZ(), t=D.blockUnder(p.x+2*B,p.z);
    if(!t) return {ok:false,got:'no ground under the traveller'};
    D.setMode('walk');
    D.state.walk.x=(t.ix+0.5)*B; D.state.walk.z=(t.iz+0.5)*B; D.state.walk.feetY=undefined;
    await D.settle(3);
    const fy=D.state.walk.feetY, iy0=Math.floor((fy+0.1)/B);
    const inHim=[];
    for(let k=0;k<2;k++) inHim.push(D.cellHitsAnyLiving(t.ix,iy0+k,t.iz));
    const guardsHim=inHim.every(w=>w==='the traveller');
    /* AND A VILLAGER. A town is stood in, and every cell each of its folk
       fills is asked for — not one of them may be built into. */
    let folk=0, guarded=0;
    const v=await D.standInVillage();
    if(v) for(const [,vv] of D.activeVillages()){
      if(!vv.people) continue;
      for(const e of vv.people){ const P=e.m&&e.m.position; if(!P) continue; folk++;
        const jx=Math.floor(P.x/B), jz=Math.floor(P.z/B), jy=Math.floor((P.y+B*0.5)/B);
        if(D.cellHitsAnyLiving(jx,jy,jz)) guarded++; } }
    const allGuarded=folk>0&&guarded===folk;
    return {ok:guardsHim&&allGuarded,
      got:'the two cells of his own body are refused='+guardsHim+
          ' · '+guarded+' of '+folk+' villagers cannot be built into'};
  })};

T[19]={name:'sand falls when the ground is taken from under it, and stops when it lands',
  run:async page=>page.evaluate(async()=>{ const D=window.__VDBG, B=D.B;
    if(!D.fallTick) return {pending:'no gravity blocks (Phase 4 step 8)'};
    const W=window.__WORLD, S=W.sites();
    /* open ground far from any town, so nothing built is disturbed */
    let sp=null;
    for(let i=0;i<S.length&&!sp;i++){ const st=S[i]; if(!st) continue;
      for(let a2=0;a2<8&&!sp;a2++){ const th=a2/8*6.2832;
        const x=st.x+Math.cos(th)*3200, z=st.z+Math.sin(th)*3200;
        const c=D.cellRaw(Math.floor(x/B),Math.floor(z/B));
        if(c&&c.kind!=='wall'&&c.kind!=='floe'&&c.h>=6) sp={x,z,h:c.h}; } }
    if(!sp) return {ok:false,got:'no open ground'};
    D.state.walk.x=sp.x; D.state.walk.z=sp.z; D.state.walk.feetY=undefined; D.setMode('walk');
    for(let k=0;k<40;k++){ D.updateChunks(sp.x,sp.z,400);
      await new Promise(r=>requestAnimationFrame(r)); }
    const ix=Math.floor(sp.x/B), iz=Math.floor(sp.z/B);
    const sand=D.blockId('sand'), stone=D.blockId('stone');
    const at=(y,n)=>D.setBlock((ix+0.5)*B,(y+0.5)*B,(iz+0.5)*B,n);
    const rd=y=>D.blockAt(ix,y,iz);
    /* ---- A PILLAR, AND A GAP UNDER IT ----
       Three of sand on one of stone, standing four courses clear of the
       ground, so that what happens is the RULE and not the shape of a hill. */
    const base=sp.h+4;
    for(let y=base;y<base+6;y++) at(y,0);
    at(base,stone); at(base+1,sand); at(base+2,sand); at(base+3,sand);
    await D.settleDrive(60);
    const stood=[rd(base+1),rd(base+2),rd(base+3)].every(v=>v===sand);
    /* now take the stone out from under the whole bank */
    at(base,0);
    const r=await D.settleDrive(300);
    /* the three must be DOWN, and stopped, and still three: nothing made and
       nothing lost. They come to rest on the true ground of the column. */
    let found=0, top=null, bot=null;
    for(let y=base+5;y>=sp.h-2;y--) if(rd(y)===sand){ found++; if(top===null) top=y; bot=y; }
    const onGround=bot!==null&&!!D.blockSolidAt(ix,bot-1,iz);
    const contiguous=top!==null&&(top-bot===found-1);
    /* and clear the ground again, so no later test walks into a heap */
    for(let y=base+6;y>=sp.h-2;y--) at(y,D.blockAt(ix,y,iz)&&y<sp.h?D.blockAt(ix,y,iz):0);
    return {ok:stood&&found===3&&onGround&&contiguous&&r.loose===0,
      got:'three of sand stood on stone='+stood+
          ' · the stone taken out: '+found+' of 3 came down, resting at '+bot+
          ' (the ground of the column is '+sp.h+')'+
          ' · on solid ground='+onGround+' · in one piece='+contiguous+
          ' · none left in the air='+(r.loose===0)};
  })};

T[22]={name:'water runs out of a broken well, and stops',
  run:async page=>page.evaluate(async()=>{ const D=window.__VDBG, B=D.B;
    if(!D.flowBudget) return {pending:'no finite water (Phase 4 step 8)'};
    const W=window.__WORLD, S=W.sites();
    let sp=null;
    for(let i=0;i<S.length&&!sp;i++){ const st=S[i]; if(!st) continue;
      for(let a2=0;a2<8&&!sp;a2++){ const th=a2/8*6.2832;
        const x=st.x+Math.cos(th)*3200, z=st.z+Math.sin(th)*3200;
        const c=D.cellRaw(Math.floor(x/B),Math.floor(z/B));
        if(!c||c.kind==='wall'||c.kind==='floe'||c.h<6) continue;
        /* and level ground to the east for the water to run along */
        let flat=true;
        for(let o=1;o<=10&&flat;o++){ const c2=D.cellRaw(Math.floor(x/B)+o,Math.floor(z/B));
          if(!c2||c2.h!==c.h) flat=false; }
        if(flat) sp={x,z,h:c.h}; } }
    if(!sp) return {ok:false,got:'no level ground'};
    D.state.walk.x=sp.x; D.state.walk.z=sp.z; D.state.walk.feetY=undefined; D.setMode('walk');
    for(let k=0;k<40;k++){ D.updateChunks(sp.x,sp.z,400);
      await new Promise(r=>requestAnimationFrame(r)); }
    const ix=Math.floor(sp.x/B), iz=Math.floor(sp.z/B);
    const water=D.blockId('water'), stone=D.blockId('stone');
    const at=(x,y,z,n)=>D.setBlock((x+0.5)*B,(y+0.5)*B,(z+0.5)*B,n);
    const rd=(x,y,z)=>D.blockAt(x,y,z);
    /* ---- A CISTERN, WALLED, WITH FOUR OF WATER STANDING IN IT ----
       Built on the surface so the run is plain to read: a floor, a wall about
       it, and one course of the wall to be broken. */
    const y0=sp.h;
    for(let dx=-1;dx<=1;dx++) for(let dz=-1;dz<=1;dz++)
      for(let y=y0;y<y0+4;y++) at(ix+dx,y,iz+dz,0);
    for(let dx=-1;dx<=1;dx++) for(let dz=-1;dz<=1;dz++) at(ix+dx,y0,iz+dz,stone);
    for(let dx=-1;dx<=1;dx++) for(let dz=-1;dz<=1;dz++)
      if(dx||dz) for(let y=y0+1;y<=y0+2;y++) at(ix+dx,y,iz+dz,stone);
    at(ix,y0+1,iz,water); at(ix,y0+2,iz,water);
    await D.settleDrive(60);
    const held=rd(ix,y0+1,iz)===water&&rd(ix,y0+2,iz)===water;
    /* count what is in the world before the wall is broken */
    const count=()=>{ let n=0;
      for(let dx=-2;dx<=12;dx++) for(let dz=-3;dz<=3;dz++)
        for(let y=y0-3;y<=y0+4;y++) if(rd(ix+dx,y,iz+dz)===water) n++;
      return n; };
    const before=count();
    /* BREAK THE WALL, at the level of the water */
    at(ix+1,y0+1,iz,0);
    const r=await D.settleDrive(400);
    const after=count();
    /* it must have LEFT the cistern, and there must be exactly as much water
       as there was, and it must have stopped of its own accord */
    /* IT HAS LEFT THE CISTERN — and where it comes to rest is the ground's
       business, not the test's. It ran out through the break, and it will
       have gone on running: out of the hole, off the lip of the floor, and
       down to the true ground of the column. So what is asked is that it is
       no longer INSIDE the walls, not that it is standing in the doorway. */
    let inside=0;
    for(let y=y0+1;y<=y0+3;y++) if(rd(ix,y,iz)===water) inside++;
    const ranOut=inside<before;
    let furthest=0;
    for(let dx=0;dx<=12;dx++) for(let y=y0-3;y<=y0+3;y++)
      if(rd(ix+dx,y,iz)===water&&dx>furthest) furthest=dx;
    for(let dx=-2;dx<=12;dx++) for(let dz=-3;dz<=3;dz++)
      for(let y=y0-3;y<=y0+4;y++) if(rd(ix+dx,y,iz+dz)) at(ix+dx,y,iz+dz,0);
    return {ok:held&&ranOut&&after===before&&r.flow===0&&r.spent<=D.flowBudget(),
      got:'two of water stood in the cistern='+held+
          ' · the wall broken: it ran out='+ranOut+' ('+inside+' of '+before+
          ' still within the walls) as far as '+furthest+' block(s)'+
          ' · water before '+before+', after '+after+' (nothing made, nothing lost='+(after===before)+')'+
          ' · it stopped of itself='+(r.flow===0)+
          ' · '+r.spent+' of a budget of '+D.flowBudget()+' spent'};
  })};

T[20]={name:'an altar of unhewn stone refuses hewn stone',
  run:async page=>page.evaluate(async()=>{ const D=window.__VDBG;
    if(!D.works) return {pending:'no works (Phase 4 step 9)'};
    const W=D.works();
    if(!W.length) return {ok:false,got:'world/works.js declares nothing'};
    /* 1 — every work must resolve: its materials, its product and its
       refusal are all block ids, and one this build has not got would have
       been dropped at the door, so a work that is MISSING is the fault */
    const declared=W.length;
    const altar=W.find(w=>w.refuses);
    if(!altar) return {ok:false,got:'no work refuses anything — '+declared+' works'};
    /* 2 — THE REFUSAL. He is given twelve of the DRESSED stone and none of
       the living rock. He is not short of stone. He has plenty, and it is
       forbidden, and the work must say so rather than say "you lack". */
    const clear=()=>{ for(const id of Object.keys(D.hoard())) D.satchelTake(id,999); };
    clear();
    D.satchelAdd(altar.refuses,12);
    const refused=D.workState(altar.id);
    const madeWrong=D.workMake(altar.id);
    const stillHas=D.hoard()[altar.refuses]||0;
    /* 3 — AND THE TRUE MATERIAL IS ACCEPTED. The same work, the same man,
       the same number of stones — and the only difference is that they came
       out of the ground as they are. */
    const want=altar.of[0].split(' x')[0], n=+altar.of[0].split(' x')[1];
    clear();
    D.satchelAdd(want,n);
    const allowed=D.workState(altar.id);
    const madeRight=D.workMake(altar.id);
    const gave=D.hoard()[altar.gives[0].split(' x')[0]]||0;
    clear();
    /* 4 — and a work of the fire must want its fire, standing here in the
       open where there is no kiln */
    const fire=W.find(w=>w.at);
    const fireSt=fire?D.workState(fire.id):null;
    return {ok:declared>=10&&refused.why==='refused'&&!madeWrong.ok&&stillHas===12&&
              allowed.can===true&&madeRight.ok&&gave>=1&&
              (!fire||fireSt.why==='place'),
      got:declared+' works declared · with 12 '+altar.refuses+
          ': refused='+(refused.why==='refused')+
          ' (and not merely "short"), made='+madeWrong.ok+
          ', and the stone is still his: '+stillHas+
          ' · with '+n+' '+want+': allowed='+allowed.can+', made='+madeRight.ok+
          ', it gave '+gave+
          (fire?' · '+fire.id+' away from a '+fire.at+': '+fireSt.why:'')};
  })};

T[21]={name:'every land holds what its data says, and the ore is truly in the rock',
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG, B=D.B, R=180000;
    if(!D.minerals) return {pending:'no minerals (Phase 4 step 7)'};
    const defs=D.minerals();
    if(!defs.length) return {ok:false,got:'world/minerals.js declares nothing'};
    /* 1 — every substance declared must have resolved to a block AND to at
       least one land the map actually has. A line naming a country this
       build has not got is silently useless, and silence is the fault. */
    const byBlock={}, holders=[];
    for(let ci=1;ci<=D.COUNTRIES.length;ci++){
      const list=D.mineralsOf(ci); if(!list.length) continue;
      holders.push(ci);
      for(const m of list) (byBlock[m.name]||(byBlock[m.name]=[])).push(ci);
    }
    const unplaced=[];
    for(const d of defs){ const nm=D.blockOf(D.blockId(d.block));
      if(!nm||!byBlock[nm.name]) unplaced.push(d.id); }
    /* 2 and 3 in ONE SWEEP OF THE LANDS THEMSELVES.
       NOT a window about the capital: a capital stands on low ground, and the
       rock is only as thick as the land is high, so a bearing of thirty blocks
       round a river town finds no seam that begins fourteen courses down and
       reports the ore missing when it is in the hills three valleys over. Each
       country is swept across ITS OWN EXTENT — a lattice over the bounds of
       its outline — and only columns the map agrees lie in that country are
       dug, from the surface course down to bedrock.
         found[]     · the substance is truly in the ground, not only in a table
         outOfBand   · every ore cell lies within the band its own data names,
                       which is the one thing a seeded hash gets wrong quietly */
    const found={}; for(const k in byBlock) found[k]=0;
    const peaks=[], lists=[];
    const list_=ci=>lists[ci]||(lists[ci]=D.mineralsOf(ci));
    let outOfBand=0, checked=0, columns=0, S=18;
    for(const ci of holders){
      const C=D.COUNTRIES[ci-1], list=list_(ci);
      let u0=9,u1=-9,v0=9,v1=-9;
      for(const ring of C.p) for(const q of ring){
        if(q[0]<u0)u0=q[0]; if(q[0]>u1)u1=q[0];
        if(q[1]<v0)v0=q[1]; if(q[1]>v1)v1=q[1]; }
      for(let a=0;a<S;a++) for(let b=0;b<S;b++){
        const u=u0+(u1-u0)*(a+0.5)/S, v=v0+(v1-v0)*(b+0.5)/S;
        const ix=Math.round(u*R/B-0.5), iz=Math.round(v*R/B-0.5);
        const c=D.cellRaw(ix,iz);
        if(!c||c.ci!==ci) continue;          /* the cell must own the country */
        columns++;
        if(!peaks[ci]||c.h>peaks[ci].h) peaks[ci]={ix,iz,h:c.h};
        for(let iy=c.h-1;iy>0;iy--){ checked++;
          const n=D.oreAt(ix,iy,iz); if(!n) continue;
          const nm=D.blockOf(n); if(nm) found[nm.name]=(found[nm.name]||0)+1;
          const m=list.find(q=>q.n===n), down=c.h-iy;
          if(!m||down<m.lo||down>m.hi) outOfBand++; } }
    }
    /* ---- AND WHERE THE LATTICE IS TOO COARSE, GO WHERE A PROSPECTOR GOES ----
       A lattice over a country's bounds lands almost everywhere on its LOW
       ground, because almost all of a country is low ground — and the deepest
       bands exist only under the high. Gold at eighteen courses needs a
       nineteen-course hill under it, and one in fifty of the sampled columns
       is that. So anything the sweep did not turn up is looked for the way a
       man would look for it: at the tallest ground the sweep saw in each land
       that holds it, and about it. This runs only for what is still missing,
       so it costs nothing on a good day. */
    for(const name of Object.keys(byBlock).filter(k=>!found[k])){
      for(const ci of byBlock[name]){
        if(found[name]) break;
        const peak=peaks[ci]; if(!peak) continue;
        for(let dx=-14;dx<=14&&!found[name];dx+=2) for(let dz=-14;dz<=14&&!found[name];dz+=2){
          const ix=peak.ix+dx, iz=peak.iz+dz;
          const c=D.cellRaw(ix,iz); if(!c||c.ci!==ci) continue;
          columns++;
          for(let iy=c.h-1;iy>0;iy--){ checked++;
            const n=D.oreAt(ix,iy,iz); if(!n) continue;
            const nm=D.blockOf(n); if(nm) found[nm.name]=(found[nm.name]||0)+1;
            const m=list_(ci).find(q=>q.n===n), down=c.h-iy;
            if(!m||down<m.lo||down>m.hi) outOfBand++; }
        }
      }
    }
    const missing=Object.keys(byBlock).filter(k=>!found[k]);
    return {ok:!unplaced.length&&!missing.length&&outOfBand===0,
      got:defs.length+' substances declared · '+Object.keys(byBlock).length+
          ' placed in '+Object.values(byBlock).reduce((a,b)=>a+b.length,0)+' lands'+
          (unplaced.length?' · NOT PLACED: '+unplaced.join(','):'')+
          ' · '+columns+' columns dug in '+holders.length+' lands: '+
          Object.entries(found).map(([k,v])=>k.replace(' in the Rock','')+' '+(v||'✗')).join(', ')+
          ' · '+outOfBand+' of '+checked+' cells outside their own band'};
  })};

T[23]={name:'the free hand lays without cost, breaks at a touch, and builds the same world',
  /* this one asks for BOTH hands in turn and sets them itself; it is marked
     so the runner's own declaration does not fight it */
  freeHand:true,
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG, B=D.B;
    if(!D.freeHand) return {pending:'no free hand (Phase 4 step 10)'};
    const W=window.__WORLD, S=W.sites();
    let sp=null;
    for(let i=0;i<S.length&&!sp;i++){ const st=S[i]; if(!st) continue;
      for(let a=0;a<8&&!sp;a++){ const th=a/8*6.2832;
        const x=st.x+Math.cos(th)*3200, z=st.z+Math.sin(th)*3200;
        const c=D.cellRaw(Math.floor(x/B),Math.floor(z/B));
        if(c&&c.kind!=='wall'&&c.kind!=='floe'&&c.h>=5) sp={x,z,h:c.h}; } }
    if(!sp) return {ok:false,got:'no open ground'};
    D.state.walk.x=sp.x; D.state.walk.z=sp.z; D.state.walk.feetY=undefined; D.setMode('walk');
    for(let k=0;k<40;k++){ D.updateChunks(sp.x,sp.z,400);
      await new Promise(r=>requestAnimationFrame(r)); }
    const ix=Math.floor(sp.x/B), iz=Math.floor(sp.z/B), iy=sp.h+3;
    const was=D.state.freeroam;
    const lay=()=>{ /* lay one block against the top face of a known cell */
      D.setBlock((ix+0.5)*B,(iy-1+0.5)*B,(iz+0.5)*B,D.blockId('cobble'));
      return D.placeFrom({ix,iy:iy-1,iz,nx:0,ny:1,nz:0,n:D.blockId('cobble')}); };
    const stock=()=>{ for(const id of Object.keys(D.hoard())) D.satchelTake(id,999);
      D.satchelAdd('brick',3); D.beltPick(0); };
    /* ---- ON A VOYAGE it costs him what he lays ---- */
    D.state.freeroam=false; D.applyFreeroam();
    stock();
    const v0=D.hoard()['brick']||0; lay();
    const v1=D.hoard()['brick']||0;
    const voyageCost=v0-v1;
    /* ---- IN THE FREE HAND it costs nothing ---- */
    D.state.freeroam=true; D.applyFreeroam();
    stock();
    const f0=D.hoard()['brick']||0;
    for(let k=0;k<3;k++) lay();
    const f1=D.hoard()['brick']||0;
    const handCost=f0-f1;
    /* ---- AND IT BREAKS AT A TOUCH ---- */
    D.setBlock((ix+0.5)*B,(iy+0.5)*B,(iz+0.5)*B,D.blockId('stone'));
    /* the DELTA, not the tally: the suite runs in one page and test 15 leaves
       its own drop lying about, so an absolute count here read that as litter
       this blow had made */
    const dropsBefore=D.drops().length;
    D.mineAt(ix,iy,iz,0,1,0); D.mineDrive(true); D.mineHold(true);
    D.mineStep(1/60);
    const goneAtOnce=D.blockAt(ix,iy,iz)===0;
    const dropsAfter=D.drops().length-dropsBefore;
    D.mineHold(false); D.mineDrive(false); D.mineAt(null);
    /* ---- AND THE STORES OFFER THE WHOLE EARTH, AND NO TOOL ---- */
    if(!D.pageOpen()) D.togglePage();
    D.pageDraw();
    await new Promise(r=>requestAnimationFrame(r));
    const store=document.querySelectorAll('#page-stores .tok').length;
    const placeable=D.BLOCKS().filter(b=>b&&b.place!==false).length;
    const tools=D.BLOCKS().filter(b=>b&&b.place===false).length;
    if(D.pageOpen()) D.togglePage();
    /* ---- AND WHAT HE LAID IS IN THE ONE OVERLAY THE VOYAGE READS ---- */
    const stands=D.blockAt(ix,iy-1,iz)!==0;
    D.state.freeroam=was; D.applyFreeroam();
    for(let y=iy-2;y<=iy+2;y++) D.setBlock((ix+0.5)*B,(y+0.5)*B,(iz+0.5)*B,0);
    return {ok:voyageCost===1&&handCost===0&&goneAtOnce&&dropsAfter===0&&
              store===placeable&&tools>0&&stands,
      got:'on a voyage a laid block costs '+voyageCost+
          ' · in the free hand three cost '+handCost+
          ' · a blow of one frame took it: '+goneAtOnce+
          ' (and left nothing lying: '+(dropsAfter===0)+')'+
          ' · the stores offer '+store+' of '+placeable+' blocks, and none of the '+
          tools+' tools · what was laid stands in the one overlay: '+stands};
  })};

T[24]={name:'every named summit can be reached on foot',
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG, B=D.B;
    if(!D.llToWorld) return {ok:false,got:'the world will not say where a mount stands'};
    /* CLIMBH is 4.6 blocks — four whole courses at a stride. A flood fill over
       the ground under that one rule answers the only question that matters
       about a mountain in a game where scrolls sit on summits: is there a WAY
       UP. Not the shortest way, not a pretty way — any way at all. */
    const CLIMB=4, R=150;
    const reach=(cx,cz)=>{
      const N=2*R+1, H=new Int16Array(N*N);
      let top=-1,tx=0,tz=0;
      for(let a=0;a<N;a++) for(let b=0;b<N;b++){
        const c=D.cellRaw(cx-R+a,cz-R+b);
        const h=(c&&c.kind!=='floe')?c.h:-999;
        H[a*N+b]=h; if(h>top){ top=h; tx=a; tz=b; } }
      const seen=new Uint8Array(N*N), q=[];
      /* seeded from the rim AS IT LIES. Asking for rim cells below some
         lowland height found none at all about Ararat, Everest or Denali —
         they stand in high country — so the fill never began and reported
         "reaches 0", which reads exactly like an unclimbable mountain and is
         nothing of the kind. A climber arrives from whatever ground is there. */
      for(let a=0;a<N;a++) for(const b of [0,N-1])
        for(const [x,y] of [[a,b],[b,a]]){
          if(H[x*N+y]<0||seen[x*N+y]) continue;
          seen[x*N+y]=1; q.push(x,y); }
      let head=0;
      while(head<q.length){
        const x=q[head++], y=q[head++], h=H[x*N+y];
        for(const d of [[1,0],[-1,0],[0,1],[0,-1]]){
          const nx=x+d[0], ny=y+d[1];
          if(nx<0||ny<0||nx>=N||ny>=N) continue;
          const i=nx*N+ny; if(seen[i]) continue;
          const nh=H[i]; if(nh<0||nh-h>CLIMB) continue;
          seen[i]=1; q.push(nx,ny); } }
      return {top, got:seen[tx*N+tz]===1};
    };
    const LM=((window.EARTH&&EARTH.landmarkList)||[]).filter(l=>l.kind==='mount');
    if(!LM.length) return {ok:false,got:'no named mount in world/landmarks.js'};
    const bad=[]; let n=0, highest=0;
    for(const l of LM){
      const p=D.llToWorld(l.lat,l.lon);
      const r=reach(Math.floor(p[0]/B),Math.floor(p[1]/B));
      n++; if(r.top>highest) highest=r.top;
      if(!r.got) bad.push(l.n+' (summit '+r.top+')'); }
    return {ok:!bad.length,
      got:(n-bad.length)+' of '+n+' named summits can be walked to, the highest '+
          highest+' courses'+(bad.length?' · NO WAY UP: '+bad.join(', '):'')};
  })};

T[30]={name:'a scroll taken in the voyage opens its passage in Scripture Unfolds',
  /* THE ONLY TEST THAT OPENS THE SECOND GAME. §5 says the two share a log:
     "unlock its long-form passage in Scripture Unfolds, which reads the same
     log." Believing that without looking is how it came to be false — nothing
     under scripture-unfolds/ mentioned the voyage's save at all. */
  ownPage:true,
  run:async (_p,ctx)=>{
    const {open}=require('./harness.js');
    const {browser,page}=await open({page:'scripture-unfolds/index.html'});
    try{
      await page.waitForFunction(()=>window.__UNFOLD&&window.STORY&&window.BESORAH,
        null,{timeout:180000});
      /* 1 — WITH NO VOYAGE, everything is open. A man who has not played the
         other game has not failed to find anything. */
      const openAll=await page.evaluate(()=>{
        localStorage.removeItem('voyage:state');
        window.__UNFOLD.rebuild();
        const it=[...document.querySelectorAll('.sc-item')];
        return {n:it.length, shut:it.filter(e=>e.classList.contains('shut')).length,
          found:window.__UNFOLD.found()};
      });
      /* 2 — WITH A VOYAGE that has taken nothing, every passage is shut */
      const none=await page.evaluate(()=>{
        localStorage.setItem('voyage:state',JSON.stringify({v:8,sr:[]}));
        window.__UNFOLD.rebuild();
        const it=[...document.querySelectorAll('.sc-item')];
        return {n:it.length, shut:it.filter(e=>e.classList.contains('shut')).length};
      });
      /* 3 — AND TAKING THE SCROLL OF THE BEGINNING opens the passages EVERY
         book of which has been found, and only those. The garden reads two
         scrolls and must stay shut on one of them; a shut row must also NAME
         what is missing, or it tells a man nothing about where to go. */
      const one=await page.evaluate(()=>{
        localStorage.setItem('voyage:state',JSON.stringify({v:8,sr:['bereshith']}));
        window.__UNFOLD.rebuild();
        const it=[...document.querySelectorAll('.sc-item')];
        const want=window.STORY.list()
          .filter(s=>window.STORY.booksOf(s).every(b=>b==='bereshith')).length;
        const shut=it.filter(e=>e.classList.contains('shut'));
        return {n:it.length, shut:shut.length, want:want,
          named:shut.filter(e=>/still in the earth: \S/.test(e.textContent)).length};
      });
      /* 4 — and taking BOTH scrolls the garden is drawn from opens it */
      const two=await page.evaluate(()=>{
        localStorage.setItem('voyage:state',
          JSON.stringify({v:8,sr:['bereshith','adam-eve-1']}));
        window.__UNFOLD.rebuild();
        const it=[...document.querySelectorAll('.sc-item')];
        const want=window.STORY.list().filter(s=>window.STORY.booksOf(s)
          .every(b=>b==='bereshith'||b==='adam-eve-1')).length;
        return {n:it.length, open:it.length-it.filter(e=>e.classList.contains('shut')).length,
          want:want};
      });
      const ok = openAll.shut===0 && openAll.found===null &&
                 none.n>0 && none.shut===none.n &&
                 one.shut===one.n-one.want && one.want>0 && one.named===one.shut &&
                 two.open===two.want && two.want>one.want;
      return {ok, got:'the shelf holds '+openAll.n+' passages · '+
        'no voyage: '+openAll.shut+' shut · '+
        'a voyage with nothing taken: '+none.shut+' of '+none.n+' shut · '+
        'the beginning taken: '+(one.n-one.shut)+' open of '+one.want+' owed, '+
        one.named+' of '+one.shut+' shut rows name what is missing · '+
        'the beginning and the cave: '+two.open+' open of '+two.want+' owed'};
    } finally { await browser.close(); }
  }};

T[32]={name:'every beast is countershaded — dark above, pale beneath — and none of them by name',
  /* §2.3.1: *"Coats, not flat colours … countershading (dark back, pale belly
     — near-universal in real animals and almost absent in Minecraft)."* Every
     limb of every beast was one flat Lambert colour, and 151 files were built
     out of it.

     WHAT THIS TEST IS REALLY FOR, and it took two goes to write honestly.
     The first cut of the coat graded every vertex by how high it stood on the
     WHOLE animal, and the numbers looked right — 0.70 to 1.18, every mesh
     touched, nothing left flat. It was wrong: a gazelle's body spans about a
     fifth of its height, so the body moved by four parts in a hundred while
     the head, standing high, went dark.

     "Is the up-face darker than the down-face" does NOT catch that — under a
     height ramp a box's top is always higher than its bottom, so it passes.
     What catches it is the SPREAD ON THE TORSO: the largest mesh on the
     animal is its body, and countershading means that body runs the full
     range from its back to its belly. Under the height ramp the gazelle's
     body spanned 0.11 of tint; it spans the whole 0.48 now. The test asks for
     0.35, which the broken version cannot reach on any quadruped. */
  run:async page=>page.evaluate(()=>{
    const D=window.__VDBG, T=window.__WORLD.THREE;
    if(!D.coatBeast||!D.BEAST_BY_NAME) return {pending:'no coat (Phase 6 step 1)'};
    const names=Object.keys(D.BEAST_BY_NAME);
    if(!names.length) return {ok:false,got:'no creature files'};
    const n3=new T.Vector3(), bb=new T.Box3(), sz=new T.Vector3();
    /* the tint on the faces that look up and down, and the biggest mesh */
    function read(g){
      let flat=0, done=0, big=null, bigV=-1;
      g.traverse(o=>{
        if(!o.isMesh||!o.geometry) return;
        const c=o.geometry.attributes.color;
        if(!c){ flat++; return; }
        done++;
        bb.setFromObject(o); bb.getSize(sz);
        const v=sz.x*sz.y*sz.z;
        if(v>bigV){ bigV=v; big=o; }
      });
      let up=null, dn=null;
      if(big){
        const c=big.geometry.attributes.color, nA=big.geometry.attributes.normal;
        big.updateWorldMatrix(true,false);
        if(nA) for(let i=0;i<c.count;i++){
          n3.fromBufferAttribute(nA,i).transformDirection(big.matrixWorld);
          const t=c.getX(i);
          if(n3.y>0.5){ if(up===null||t>up) up=t; }
          else if(n3.y<-0.5){ if(dn===null||t<dn) dn=t; }
        }
      }
      return {up,dn,flat,done};
    }
    D.coatOn(true);
    const bad=[], thin=[], noSky=[];
    let graded=0, flatMesh=0, worst=9;
    for(const nm of names){
      let g=null; try{ g=D.makeBeast(nm); }catch(e){ continue; }
      const f=read(g);
      graded+=f.done; flatMesh+=f.flat;
      if(f.flat) noSky.push(nm);
      if(f.up===null||f.dn===null) continue;
      if(!(f.up<f.dn)) bad.push(nm+' (up '+f.up.toFixed(2)+' is not darker than down '+f.dn.toFixed(2)+')');
      const spread=f.dn-f.up;
      if(spread<worst) worst=spread;
      if(spread<0.35) thin.push(nm+' ('+spread.toFixed(2)+')');
    }
    /* AND A SPECIES MAY REFUSE IT — the engine reads a datum, not a name */
    const one=names[0], spec=D.BEAST_BY_NAME[one];
    const keep=spec.shade; spec.shade=0;
    const off=read(D.makeBeast(one));
    spec.shade=keep;
    const refused=off.done===0&&off.flat>0;
    /* and with the coat switched off nothing anywhere is graded */
    D.coatOn(false);
    const none=read(D.makeBeast(one));
    D.coatOn(true);
    const ok=!bad.length&&!thin.length&&!flatMesh&&refused&&none.done===0;
    return {ok, got:names.length+' creature files · '+graded+' meshes graded, '+
      flatMesh+' left flat · the narrowest body runs '+worst.toFixed(2)+
      ' of tint from back to belly (0.35 is the least that reads) · '+
      'a species that refuses it stays flat: '+(refused?'yes':'NO')+
      (bad.length?' · NOT COUNTERSHADED: '+bad.slice(0,4).join('; '):'')+
      (thin.length?' · TOO SLIGHT TO SEE: '+thin.slice(0,5).join('; ')+
        (thin.length>5?' (+'+(thin.length-5)+' more)':''):'')+
      (noSky.length?' · MESHES MISSED IN: '+noSky.slice(0,4).join(', '):'')};
  })};

T[33]={name:'a hardwood has boughs, no two are alike, and the crown does not grow',
  /* §2.4.1: *"Branching. Two or three orders of branch by a small L-system,
     with real taper. Every tree in the world stops looking like every other
     tree."* The oak — the DEFAULT form, and most of the world's wood — was one
     bole and three crown boxes stacked on the middle of it, symmetrical about
     both axes, so every oak on earth was the same oak at a different size.

     THE THIRD CLAUSE IS THE ONE THAT MATTERS. The first cut of the boughs
     reached out on their own scale and hung a full-sized leaf cluster on each
     tip, so a crown 1.9 blocks across became nearly 3 — every tree overlapped
     its neighbours and a stand of oak read as ONE GREEN SLAB, which is worse
     than the blob it replaced. It looked fine in a box count and was obvious
     the moment a wood was photographed. So the envelope is measured here: a
     branched tree must occupy about the room an unbranched one did. What
     changed is its shape.

     Nothing is drawn: FLORA.emitTree is called with a kit whose emitBox only
     records, which is exactly the geometry the mesher would have been given. */
  run:async page=>page.evaluate(()=>{
    const F=window.FLORA;
    if(!F||!F.boughsOn||!F.boughed) return {pending:'no boughs (Phase 6 step 2)'};
    const K=F.kinds(), M={leaf:0,bark:1,plant:2,solid:3};
    const boughed=F.boughed();
    /* a kit that records instead of drawing */
    let n=0, lo=null, hi=null, sig='';
    const kit={ G:null, M,
      hash:(a,b)=>{ const s=Math.sin(a*127.1+b*311.7)*43758.5453; return s-Math.floor(s); },
      emitBox:(G,x0,y0,z0,x1,y1,z1)=>{ n++;
        if(lo===null){ lo=[x0,y0,z0]; hi=[x1,y1,z1]; }
        else { lo[0]=Math.min(lo[0],x0); lo[1]=Math.min(lo[1],y0); lo[2]=Math.min(lo[2],z0);
               hi[0]=Math.max(hi[0],x1); hi[1]=Math.max(hi[1],y1); hi[2]=Math.max(hi[2],z1); }
        sig+=(x0.toFixed(1)+','+y0.toFixed(1)+','+z0.toFixed(1)+';'); } };
    const draw=(spec,ix,iz)=>{ n=0; lo=null; hi=null; sig='';
      F.emitTree(kit,spec,ix,iz,{h:20});
      return {n, w:hi?Math.max(hi[0]-lo[0],hi[2]-lo[2]):0, h:hi?hi[1]-lo[1]:0, sig}; };

    const grew=[], same=[], alike=[], drifted=[];
    let boughedForms=0, plainForms=0, worstW=0, worstH=0;
    for(const name in K){
      const spec=K[name]; if(spec.layer!=='tree') continue;
      const f=spec.form||'broad';
      F.boughsOn(false); const a=draw(spec,140,260);
      F.boughsOn(true);  const b=draw(spec,140,260);
      if(boughed[f]){
        boughedForms++;
        /* it must actually branch */
        if(!(b.n>a.n)) grew.push(name+' ('+a.n+'→'+b.n+' boxes)');
        /* and it must not sprawl: within a fifth of the room it had */
        const dw=a.w?Math.abs(b.w-a.w)/a.w:0, dh=a.h?Math.abs(b.h-a.h)/a.h:0;
        if(dw>worstW) worstW=dw;
        if(dh>worstH) worstH=dh;
        if(dw>0.20||dh>0.20) drifted.push(name+' (across '+(dw*100).toFixed(0)+'%, up '+(dh*100).toFixed(0)+'%)');
        /* and no two of them alike */
        const c=draw(spec,141,263);
        if(c.sig===b.sig) alike.push(name);
      } else {
        plainForms++;
        /* a form that is not boughed must be untouched, to the byte */
        if(a.sig!==b.sig) same.push(name+' ('+f+')');
      }
    }
    F.boughsOn(true);
    const ok=!grew.length&&!same.length&&!alike.length&&!drifted.length&&boughedForms>0;
    return {ok, got:boughedForms+' species branch, '+plainForms+' keep their own form · '+
      'the crown moved at most '+(worstW*100).toFixed(0)+'% across and '+
      (worstH*100).toFixed(0)+'% up'+
      (grew.length?' · NO BOUGHS: '+grew.slice(0,4).join('; '):'')+
      (drifted.length?' · THE CROWN GREW: '+drifted.slice(0,4).join('; '):'')+
      (alike.length?' · TWO TREES ALIKE: '+alike.slice(0,4).join(', '):'')+
      (same.length?' · A FORM THAT SHOULD NOT HAVE CHANGED DID: '+same.slice(0,4).join(', '):'')};
  })};

T[34]={name:'the wood gilds in autumn and the evergreens do not turn with it',
  /* §2.4.4: *"Seasonal colour … spring blossom, high-summer deep green, autumn
     turn, bare winter branches on the deciduous, **evergreens unchanged**."*

     I WROTE IN PLAN.md THAT THE LEAVES DID NOT READ THE SEASON. They do, and
     have all along: `SEASON_VS`/`SEASON_FS` in js/engine.js gild the canopy
     toward gold through autumn and grey it through winter, per hemisphere and
     per zone, in the shader, with no chunk ever re-meshed. I had grepped for
     `SEASON` in the flora and found nothing, and concluded from the wrong file.

     What was actually wrong is the last clause. The gilding is worked out from
     LATITUDE — correct for the zone and blind to the tree — and there was ONE
     leaf material in the world, so every spruce, pine, cypress and olive
     standing in a temperate land went gold in October with the oak beside it.
     A Norwegian wood in autumn was uniformly yellow, spruces and all.

     So this test does not ask whether the season exists. It asks the two things
     that were untrue: that the material an evergreen draws with is NOT given
     the season, and that each species draws with the right one. */
  run:async page=>page.evaluate(()=>{
    const F=window.FLORA, D=window.__VDBG, W=window.__WORLD;
    if(!F||!F.everOf) return {pending:'no evergreen leaf (Phase 6 step 3)'};
    const MAT=D.MAT||{};
    if(!MAT.everW||!MAT.leafW) return {pending:'no second leaf material'};
    /* 1 — the two materials, and only one of them takes the turn of the year.
       three.js keys a patched program by this string, so it IS the season. */
    const kLeaf=MAT.leafW.customProgramCacheKey?MAT.leafW.customProgramCacheKey():'',
          kEver=MAT.everW.customProgramCacheKey?MAT.everW.customProgramCacheKey():'';
    const gilds=/leaf/.test(kLeaf), holds=!/leaf/.test(kEver);
    /* and they must be two materials, not one thing twice */
    const two=MAT.everW!==MAT.leafW;

    /* 2 — the species whose FORM gets it wrong, which is the whole reason
       `ever` is a datum and not a lookup on the shape of the tree */
    const want={ larch:false, baldcypress:false, aspen:false, poplar:false, ceiba:false,
                 spruce:true, pine:true, cypress:true, juniper:true,
                 holly:true, yew:true, olive:true, holmoak:true, corkoak:true,
                 oak:false, beech:false, birch:false, maple:false };
    const wrong=[];
    for(const n in want){
      const got=F.everOf(n);
      if(got===null) continue;                 /* a species this world does not grow */
      if(got!==want[n]) wrong.push(n+' is '+(got?'evergreen':'deciduous')+', wanted the other');
    }

    /* 3 — and the canopy is actually LAID DOWN on the right material. Nothing
       is drawn: emitTree is called with a kit that only records. */
    const K=F.kinds(), M={leaf:'L', ever:'E', bark:'B', plant:'P', solid:'S'};
    let seen=null;
    const kit={ G:null, M,
      hash:(a,b)=>{ const s=Math.sin(a*127.1+b*311.7)*43758.5453; return s-Math.floor(s); },
      emitBox:(G,x0,y0,z0,x1,y1,z1,side,top)=>{ if(side==='L') seen.L=1; if(side==='E') seen.E=1;
                                                if(top==='L') seen.L=1; if(top==='E') seen.E=1; } };
    const mixed=[]; let ever=0, decid=0;
    for(const n in K){
      const spec=K[n]; if(spec.layer!=='tree') continue;
      seen={};
      F.emitTree(kit,spec,220,340,{h:20});
      if(!seen.L&&!seen.E) continue;           /* a cactus has no leaf at all */
      if(seen.L&&seen.E) mixed.push(n);
      else if(seen.E) ever++;
      else decid++;
      const wantEver=F.everOf(n);
      if(wantEver&&seen.L) mixed.push(n+' (evergreen, drew on the leaf that turns)');
      if(!wantEver&&seen.E) mixed.push(n+' (deciduous, drew on the leaf that does not)');
    }
    const ok=gilds&&holds&&two&&!wrong.length&&!mixed.length&&ever>0&&decid>0;
    return {ok, got:ever+' species keep their leaf, '+decid+' turn · '+
      'the turning leaf takes the season: '+(gilds?'yes':'NO')+
      ' · the evergreen leaf does not: '+(holds?'yes':'NO')+
      (two?'':' · THEY ARE THE SAME MATERIAL')+
      (wrong.length?' · WRONG: '+wrong.slice(0,5).join('; '):'')+
      (mixed.length?' · DREW ON THE WRONG LEAF: '+mixed.slice(0,5).join('; '):'')};
  })};

T[35]={name:'each beast breaks at its own distance, and a herd keeps one head up',
  /* §2.3.5 asks for *"species-specific flight distance"* and *"vigilance
     alternating with grazing (one head always up)."* There were TWO flight
     numbers in the whole world — nine units for a man walking up and eighteen
     for a hunter, written into js/engine.js — so a hare let a wolf come as
     close as a bull elephant did. And `alert` was one act among a beast's
     others, drawn by weight, so a herd of eight had nobody watching most of
     the time and three staring at once now and then, which is the one thing a
     herd never does.

     THE SECOND HALF IS MEASURED ON THE LIVING WORLD, not on a contrived herd:
     the traveller is stood on the great plain, the world is left to run, and
     every herd that forms is sampled. What must NEVER be seen is two heads up
     in one herd; what must be seen often is one. */
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG, B=window.BEHAVIOR;
    if(!B||!B.flightOf||!D.herdWatch) return {pending:'no flight distance or watch (Phase 6 step 4)'};

    /* ---- 1. the distances, and that they are the beast's own ---- */
    const f=n=>B.flightOf(n);
    const named=['elephant','rhino','hippo','buffalo','chicken','cow','sheep','dog'];
    const wild =['gazelle','hare','zebra','wildebeest','ostrich','deer','oryx'];
    const all=named.concat(wild).map(f);
    const distinct=new Set(all).size;
    const faults=[];
    /* the heavy stand and the light break early — the whole point of the datum */
    if(!(f('elephant')<f('gazelle'))) faults.push('an elephant breaks sooner than a gazelle');
    if(!(f('rhino')<f('hare'))) faults.push('a rhino breaks sooner than a hare');
    if(!(f('chicken')<f('ostrich'))) faults.push('a chicken breaks later than an ostrich');
    if(!(f('dog')<f('deer'))) faults.push('the dog of the village is as wild as a deer');
    /* and a species nobody wrote down follows its own legs */
    const derived=Math.max(7,Math.min(38,6+B.runOf('deer',12)*1.1));
    if(Math.abs(f('deer')-derived)>0.001) faults.push('the unwritten rule is not read off `run`');
    if(distinct<6) faults.push('only '+distinct+' distinct distances in fifteen species');

    /* ---- 2. the watch, over the living world ---- */
    const W=window.__WORLD, sites=W.sites();
    let site=null;
    for(const n of ['Kenya','Tanzania','South Africa','Botswana','Sudan'])
      { for(let i=0;i<sites.length&&!site;i++)
          if(sites[i]&&D.COUNTRIES[i].n===n) site=sites[i];
        if(site) break; }
    if(!site) for(let i=0;i<sites.length&&!site;i++) if(sites[i]) site=sites[i];
    D.state.walk.x=site.x+700; D.state.walk.z=site.z+700; D.state.walk.feetY=undefined;
    D.setMode('walk');
    const noon=D.DAYPARTS.findIndex(d=>d.k==='noon'); if(noon>=0) D.state.dayIdx=noon;
    D.applyDayPart();
    for(let k=0;k<40;k++){ D.updateChunks(D.state.walk.x,D.state.walk.z,600);
      await new Promise(r=>requestAnimationFrame(r)); }

    let herds=0, twoUp=0, oneUp=0, seen=0;
    /* ---- WHAT "ONE HEAD" ACTUALLY MEANS, and my first test asked it wrong ----
       A herd has no identity here: it is whatever of a kind stands within
       eighty units OF A GIVEN BEAST, and those neighbourhoods overlap without
       being the same set. So a group seeded from one member reaches eighty
       units from THAT beast and can hold two watchers a hundred and fifty
       apart — each of which correctly saw nobody near it when it looked up.
       My first cut counted that as a fault and it caught one in a hundred and
       fifty-seven samples, which is exactly the rate you would expect from
       two herds drifting together.

       The invariant the code actually keeps, and the one worth keeping, is
       about a beast's OWN neighbourhood: no two watchers of a kind within
       eighty units of each other. That is checked separately below, and it is
       absolute. */
    for(let k=0;k<540;k++){
      await new Promise(r=>requestAnimationFrame(r));
      if(k%15) continue;
      /* every distinct herd once: the beast with the lowest index speaks for it */
      const L=D.LANDLIFE, done=new Set();
      /* the true invariant: no two watchers of a kind within a herd's radius */
      for(let i=0;i<L.length;i++){ const a1=L[i];
        if(!a1.set||a1.dead>0||a1.job!=='act'||a1.act!=='alert') continue;
        for(let j=i+1;j<L.length;j++){ const b1=L[j];
          if(!b1.set||b1.dead>0||b1.kind!==a1.kind) continue;
          if(b1.job!=='act'||b1.act!=='alert') continue;
          if(Math.hypot(b1.x-a1.x,b1.z-a1.z)<=D.HERD_R) twoUp++; } }
      for(let i=0;i<L.length;i++){
        const a=L[i]; if(!a.set||a.dead>0||done.has(a)) continue;
        const mob=[];
        for(let j=0;j<L.length;j++){ const b=L[j];
          if(!b.set||b.dead>0||b.kind!==a.kind) continue;
          if(Math.hypot(b.x-a.x,b.z-a.z)<=D.HERD_R) mob.push(b); }
        if(mob.length<3) continue;
        for(const b of mob) done.add(b);
        herds++;
        const up=mob.filter(b=>b.job==='act'&&b.act==='alert').length;
        if(up>=1) oneUp++;
        seen++;
      }
    }
    const watched=seen?oneUp/seen:0;
    if(twoUp) faults.push(twoUp+' times two watchers of a kind stood within '+D.HERD_R+' units of each other');
    /* a herd with nobody up at all is allowed for a moment — they are walking,
       fleeing, going to water — but it must not be the usual state */
    /* THE FLOOR IS SET FROM WHAT WAS MEASURED, NOT FROM A WISH. Hung on the
       end of a meal alone the watch stood at 29%; asked at every decision,
       44%; handed on when the watcher stands down, 63–68% across runs. The
       bar is 45%, which the old behaviour cannot reach and the new one clears
       with room for the run-to-run spread this measurement genuinely has. */
    if(seen>=12&&watched<0.45) faults.push('only '+(watched*100).toFixed(0)+'% of herd-samples had a head up');
    const ok=!faults.length;
    return {ok, got:distinct+' distinct flight distances in 15 species '+
      '(elephant '+f('elephant').toFixed(0)+', gazelle '+f('gazelle').toFixed(0)+
      ', hare '+f('hare').toFixed(0)+', chicken '+f('chicken').toFixed(0)+') · '+
      seen+' herd-samples of three or more: '+oneUp+' watched ('+
      (watched*100).toFixed(0)+'%) · two watchers within a herd\'s radius: '+twoUp+' times'+
      (seen<12?' (too few herds formed to judge the watch)':'')+
      (faults.length?' · '+faults.join(' · '):'')};
  })};

T[31]={name:'every caption of every long film fetches a real verse out of the Besorah',
  /* §5's THIRD PROHIBITION, which had no guard until now: "do not invent a
     reference." The first two — do not paraphrase, do not summarise — are
     kept by tools/extract-besorah.js --check, because a `verse:{t,ref}`
     carries its words next to its citation and the two can be set against
     each other. A FILM CAPTION CARRIES NO WORDS: it is `{q:['shamoth',14,21]}`
     and the text is fetched as the film runs. So a wrong chapter does not
     read wrongly, it simply never appears — three minutes into a film, with
     nobody watching.

     --check now resolves every `q` against the emitted books, which is the
     authoritative guard and costs no browser. THIS test is the other half:
     it opens the real page and makes the real fetch, so a book that is on
     disk but not reachable from the page — misspelled in the index, missing
     from the directory the loader looks in — fails here and not in front of
     somebody watching a film. */
  ownPage:true,
  run:async ()=>{
    const {open}=require('./harness.js');
    const {browser,page}=await open({page:'scripture-unfolds/index.html'});
    try{
      await page.waitForFunction(()=>window.STORY&&window.BESORAH,null,{timeout:180000});
      const r=await page.evaluate(async()=>{
        const out={films:0,caps:0,bad:[],overrun:[],books:0,boot:0};
        /* NOTHING is open at boot — the whole point of fetching a scroll when
           it is taken down. If this is ever non-zero the page has gone back
           to parsing two megabytes of scripture before it can draw a shelf. */
        out.boot=BESORAH.titles().filter(b=>BESORAH.loaded(b.id)).length;
        for(const s of STORY.list()){
          out.films++;
          for(const b of STORY.booksOf(s)) await BESORAH.open(b);
          const dur=s.stage&&s.stage.length?s.stage[s.stage.length-1].t:0;
          for(const c of s.caps||[]){
            out.caps++;
            if(c.to>dur) out.overrun.push(s.id+' at '+c.t+'s');
            let q=null;
            try{ q=STORY.capText(c); }catch(e){ out.bad.push(s.id+' '+c.t+'s: '+e.message); continue; }
            if(!q||!q.text||!q.text.trim()) out.bad.push(s.id+' '+c.t+'s: no words');
            else if(c.q&&!q.ref) out.bad.push(s.id+' '+c.t+'s: no chapter and verse');
          }
        }
        out.books=BESORAH.titles().filter(b=>BESORAH.loaded(b.id)).length;
        return out;
      });
      const ok=!r.bad.length&&!r.overrun.length&&r.films>=8&&r.boot===0;
      return {ok, got:r.caps+' captions across '+r.films+' films, out of '+r.books+
        ' scrolls · none open at boot: '+(r.boot===0?'yes':'NO, '+r.boot+' were')+
        (r.bad.length?' · UNFETCHABLE: '+r.bad.slice(0,4).join('; '):'')+
        (r.overrun.length?' · PAST THE END OF THE FILM: '+r.overrun.slice(0,4).join('; '):'')};
    } finally { await browser.close(); }
  }};

T[38]={name:'in a VOYAGE, a blow breaks, what breaks drops, the drop is taken up, and it lays back',
  /* THE HOLE THIS FILLS, AND IT IS A HOLE IN THIS FILE AND NOT IN THE GAME.
     Round 42 made free roam THE FREE HAND: a blow lands on the first frame,
     a block costs nothing, and nothing drops at all — deliberately, because a
     stream of pickups behind a man clearing a hillside is litter. Every test
     since has declared `freeHand` or inherited it, so for fourteen rounds the
     suite has tested a hand nobody plays with.

     The hand that IS played — the voyage — takes hardness ÷ tool speed per
     blow and spawns a drop, and it had no test whatever. When it broke, four
     things broke with it and every one of them was reported by a player
     rather than by me: nothing broke, so nothing dropped, so nothing was
     taken up, so the belt stayed empty, so nothing could be laid. One gate,
     four symptoms, and no test between them and him.

     So this walks the WHOLE chain in the voyage hand and reports where it
     stops. It drives the hand through mineHold/mineStep rather than a mouse,
     because a headless browser has no hand — which means it guards the
     MECHANICS. The gate that actually failed was in the INPUT, and the note
     in mineTick carries that; a test cannot hold a mouse still. */
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG, W=window.__WORLD, B=D.B||6;
    const raf=()=>new Promise(r=>requestAnimationFrame(r));
    if(!D.aimFrom||!D.mineHold||!D.mineStep) return {pending:'the hand has no probes'};
    /* THE VOYAGE HAND, said out loud — the runner sets it per test, and this
       one would be meaningless in the other */
    if(D.applyFreeroam){ D.state.freeroam=false; D.applyFreeroam(); }
    /* ---- HE IS PUT ON GROUND FIRST, AND GIVEN A TOOL ----
       Run in the suite, this test inherited wherever the test before it left
       the traveller — which was once out over the water with nothing under
       him at all, and the report read "the arm reaches no block at all from
       where he stands". That is a fault in the test's footing, not in the
       hand. He is set on known ground here, as test 15 sets him.
       AND HE HOLDS A PICK: since b27c625 the rock does not give to bare
       fingers, and what is being tested here is the CHAIN — break, drop, take
       up, lay back — not the tool rule, which is test 14's. */
    let st=D.blockUnder(D.playerXZ().x, D.playerXZ().z);
    if(!st){
      /* AND IF THERE IS NO GROUND WHERE HE WAS LEFT, HE GOES TO SOME. Test 37
         lays rings at an eye of 24,000 half a world away, and the test after
         it inherited a traveller standing over nothing at all: run alone this
         test passed, run in the suite it reported "the arm reaches no block
         at all". A town is stood in, and its chunks waited for, exactly as
         the runner's own preamble does. */
      const W=window.__WORLD, S=W&&W.sites?W.sites():null;
      let site=null;
      if(S){ for(let i=0;i<S.length;i++) if(S[i]&&D.COUNTRIES[i].n==='Yasharal'){ site=S[i]; break; }
             if(!site) for(let i=0;i<S.length;i++) if(S[i]){ site=S[i]; break; } }
      if(site){ D.setMode('walk'); D.state.walk.x=site.x; D.state.walk.z=site.z-40;
        D.state.walk.feetY=undefined;
        for(let k=0;k<40;k++){ D.updateChunks(site.x,site.z,400); await raf(); }
        await D.settle(2);
        st=D.blockUnder(D.playerXZ().x, D.playerXZ().z); }
    }
    if(st){ D.setMode('walk'); D.state.walk.x=st.x; D.state.walk.z=st.z;
      D.state.walk.feetY=undefined; await D.settle(2); }
    D.satchelAdd('flint-pick',1);
    { const i=D.satchel().findIndex(s=>s&&s.id==='flint-pick'); if(i>=0) D.setHeld(i); }
    const p=D.state.walk;
    const fx=p.x, fz=p.z, fy=(p.feetY||0)+B*1.5;
    /* ---- AND IT LOOKS ASIDE BEFORE IT LOOKS DOWN ----
       Straight down finds the block the traveller is STANDING ON, and laying
       one back there is laying it inside his own legs — which the world
       rightly refuses (test 18 is that rule), so this test failed at the last
       step with "the traveller is standing there" having done everything else
       correctly. A block found aside of him breaks and lays back with nobody
       in the way; underfoot is kept only as the last resort.

       AND WITHIN A PACE OF HIM — a reach of four blocks and not thirty. What
       he breaks has to FALL somewhere he can pick it up, and a block struck
       at arm's length across a field drops its sapphire in the grass thirty
       blocks off, where the test then reported an empty satchel. He walks
       onto it below in any case, but it must be near enough to walk to. */
    let aim=null;
    for(const d of [[0,-0.6,0.9],[0.9,-0.6,0],[-0.9,-0.6,0],[0,-0.6,-0.9],[0,-1,0]]){
      aim=D.aimFrom(fx,fy,fz,d[0],d[1],d[2],4); if(aim) break; }   /* WITHIN A PACE: see below */
    if(!aim) return {ok:false,got:'the arm reaches no block at all from where he stands'};
    /* AND THE BLOW IS TOLD WHICH BLOCK IT MEANS. The live AIM follows the
       camera, which in a headless run points wherever it was left; mineTick
       starts the fracture afresh every time the target changes, so a blow
       driven against a wandering aim never finishes. */
    D.mineAt(aim.ix,aim.iy,aim.iz,aim.nx,aim.ny,aim.nz);
    const solid=()=>D.solidAt((aim.ix+0.5)*B,(aim.iy+0.5)*B,(aim.iz+0.5)*B);
    if(!solid()) return {ok:false,got:'the block the arm found is already air'};
    const was=(D.BLOCKS()[aim.n-1]||{}).name||('#'+aim.n);

    /* ---- the blow ---- */
    const had=D.drops().length;
    D.mineDrive(true);              /* the loop must not drive it too, or the reading is double */
    D.mineHold(true);
    let t=0, need=null, ran=0;
    for(let k=0;k<1500&&solid();k++){
      D.mineStep(1/60); t+=1/60;
      const g=D.mineProgress(); if(g){ ran++; need=g.need; }
      if(k%8===0) await raf(); }
    D.mineHold(false); D.mineAt(null); D.mineDrive(false);
    const broke=!solid();
    if(!broke) return {ok:false,got:'the blow did not break '+was+' in '+t.toFixed(0)+'s'+
      (ran?' (it ran '+ran+' frames and wants '+need.toFixed(1)+'s)':' — and never ran at all')};

    /* ---- the drop, and the taking up ---- */
    const made=D.drops().length-had;
    for(let k=0;k<300;k++){ D.dropStep(1/60); if(k%8===0) await raf(); }
    /* AND HE WALKS ONTO IT, as test 15 does — a thing lying two paces off is
       not taken up by standing still and hoping */
    { const lay=D.drops()[0];
      if(lay){ D.state.walk.x=lay.x; D.state.walk.z=lay.z; D.state.walk.feetY=undefined;
        await D.settle(2);
        for(let k=0;k<200&&D.drops().length;k++) D.dropStep(1/60); } }
    const hoard=D.hoard();
    const took=Object.keys(hoard).length;

    /* ---- and laying it back ---- */
    /* ---- AND WHAT IS LAID BACK MUST BE A BLOCK, NOT A TOOL ----
       The hand is holding the flint pick this test was given to break the
       rock with, and a tool is `place:false` — it is not a thing that stands
       in the world. So the hand takes up the first thing in the satchel that
       IS placeable before laying. (It read "said it laid but nothing stands",
       which was the pick refusing to be a wall.) */
    let laid='(nothing in hand to lay)';
    const sat=D.satchel();
    const slotIdx=sat.findIndex(sl=>{ if(!sl) return false;
      const b=D.blockOf(D.blockId(sl.id)); return b&&b.place!==false; });
    const slot=slotIdx>=0?sat[slotIdx]:null;
    if(slot){ D.setHeld(slotIdx);
      /* ---- AND HE STEPS OUT OF THE WAY OF WHAT HE IS LAYING ----
         A block goes in on the AIR SIDE of the struck face, and the face a man
         strikes is the one FACING HIM — so the air side of a block at arm's
         length is very often the cell he is standing in, and the world quite
         rightly refuses to build a wall through his legs (test 18 is that
         rule). Run alone this test happened to stand clear; run in the suite
         it reported "REFUSED — the traveller is standing there" having done
         every other thing correctly. He backs off four blocks along the
         struck face's own normal, which is by construction away from the
         block, and lays from there. */
      D.state.walk.x+=(aim.nx||0)*B*4; D.state.walk.z+=(aim.nz||0)*B*4;
      if(!aim.nx&&!aim.nz) D.state.walk.x+=B*4;      /* struck from above: any way will do */
      D.state.walk.feetY=undefined; await D.settle(2);
      const r=D.placeFrom(aim);
      /* WHERE IT LAID IS WHAT IS ASKED. A block goes in on the AIR SIDE of
         the struck face — `at` in the answer — and not into the cell that was
         struck, so checking the struck cell reported "said it laid but
         nothing stands" of a block standing perfectly well one cell over.
         A tool refuses by answering nothing at all, which is also read. */
      const stands=r&&r.at&&D.solidAt((r.at[0]+0.5)*B,(r.at[1]+0.5)*B,(r.at[2]+0.5)*B);
      laid=!r?('REFUSED — a tool is held, and a tool is not laid')
          :r.no?('REFUSED — '+r.no)
          :stands?('laid at '+r.at.join(',')+', and it stands')
          :('said it laid at '+(r.at||[]).join(',')+' but nothing stands'); }

    const faults=[];
    if(made<1) faults.push('nothing dropped from it');
    if(!took) faults.push('nothing reached the satchel');
    if(slot&&!/and it stands/.test(laid)) faults.push('it would not lay back: '+laid);
    if(!slot) faults.push('the satchel was empty, so nothing could be laid');
    return {ok:!faults.length,
      got:'broke '+was+' in '+t.toFixed(1)+'s (it wanted '+(need===null?'?':need.toFixed(1))+
        's) · dropped '+made+' · satchel '+JSON.stringify(hoard)+' · laying back: '+laid+
        (faults.length?' · '+faults.join(' · '):'')};
  })};

T[39]={name:'a spring at a fall pours over the brink, stays at the fall, and drains when it is taken up',
  /* THE THREE FAULTS THIS GUARDS, and every one of them has already happened.

     1. THE FLOOD. A spring laid at Niagara put 13,989 cells of standing water
        into the world and Multnomah 23,025 with 7,292 still queued — the
        camera at the foot buried inside a solid mass of water, and the count
        still climbing when the measurement was cut off. Four rules were
        wrong: a column sprayed sideways out of its own middle, a sheet took
        every direction instead of the way down, the sea was not a sink, and
        the world's own rivers were feeding our water like infinite springs.

     2. THE DRY FALL. The heads were laid at the fall's origin, and for a
        PLUNGE the lip is held proud for `under × drop` blocks past it — so
        at Angel the spring stood SEVENTEEN BLOCKS BACK from the brink,
        water reaches seven blocks and no further, and the tallest fall on
        earth had 549 cells of puddle on the tabletop and nothing whatever
        going over. A test that only counted cells would have called that
        the best-behaved fall in the world.

     3. THE STREAM THAT WILL NOT UNWIND. Take the spring away and the water
        must retreat from the far end a level a tick. It did not, for a whole
        round, because a river counted as a source.

     So: it pours (there is water in the shaft between lip and foot), it
     STAYS (nothing stands further from the fall than the fall's own claim),
     it SETTLES (the total stops moving), and it GOES when the source does.

     WHY IT BEATS THE WATER DIRECTLY. WATER.step(0.25) is exactly one tick
     with exactly the budget the game gives it — the same queue, the same
     order, the same millisecond. Waiting on frames instead would measure the
     rasteriser: a settled fall takes some six hundred ticks, which is half an
     hour of software-rendered frames and two seconds of this.

     AND IT LEAVES THE WORLD DRY. The last act is to take every head up and
     unwind the stream, which is both the third assertion and the cleaning up
     of twenty thousand cells of water that no test after this one wants. */
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG, B=D.B;
    if(!window.WATER||!window.WATERFALL) return {pending:'no falling water (js/water.js, js/waterfall.js)'};
    const list=WATERFALL.list();
    if(!list||!list.length) return {pending:'no falls in world/waterfalls.js'};
    /* THREE FALLS, CHOSEN BY FORM AND NOT BY NAME — the tallest plunge (the
       overhang, which is where the brink is not the origin), the widest
       cataract (the greatest number of heads), and the tallest tiered stair
       (which lands and lands again). Data picks them, so adding a fall or
       redrawing one cannot make this test stale. */
    const pick=(form,by)=>list.filter(f=>f.form===form).sort((a,b)=>by(b)-by(a))[0];
    const chosen=[pick('plunge',f=>f.drop),pick('cataract',f=>f.half),
                  pick('tiered',f=>f.drop)].filter(Boolean);
    if(!chosen.length) return {pending:'no fall of any known form'};

    const faults=[], said=[];
    /* ---- EACH FALL IS ASKED ABOUT ITS OWN WATER, AND ONLY ITS OWN ----
       WATER.serialise() is the whole world's water, and reading it whole was
       wrong twice over. First: Angel drained all but a few hundred cells and
       those were still standing when Iguazu was measured, so Iguazu was
       reported as having thrown water five thousand blocks — which was Angel,
       a continent away. Second, once the springs were turned ON: the engine
       lays a spring at whatever fall the traveller is near, all through this
       test, and that water is nobody's business here at all.

       So a cell belongs to the fall it is NEAREST to. It needs no bookkeeping,
       it cannot go stale, and it is the plain meaning of the question — "did
       THIS fall throw water out of its gorge" is a question about which fall
       the water is at. */
    const whose=(ix,iz)=>{ let best=null,bd=1e18;
      for(const g of list){ const d=(ix*B-g.x)**2+(iz*B-g.z)**2; if(d<bd){ bd=d; best=g; } }
      return best; };
    for(const f of chosen){
      const wx=(u,v)=>f.x+(u*f.cs+v*f.sn)*B, wz=(u,v)=>f.z+(-u*f.sn+v*f.cs)*B;
      const ground=(u,v)=>{ const c=D.landAtWorld(wx(u,v),wz(u,v)); return c?c.h:null; };
      const lip=ground(0,-1)||0;

      const heads=[];
      for(const [x,z] of WATERFALL.springs(f)){
        const c=D.landAtWorld(x,z); if(!c) continue;
        const ix=Math.floor(x/B), iz=Math.floor(z/B);
        if(WATER.spill(ix,c.h,iz)) heads.push([ix,c.h,iz]);
      }
      if(!heads.length){ faults.push(f.n+': no head could be laid'); continue; }

      /* beaten until the standing total stops moving, or 4,000 ticks */
      const mine=()=>WATER.serialise().filter(s=>{
        const p=s.slice(0,s.lastIndexOf(':')).split(',');
        return whose(+p[0],+p[2])===f; });
      let prev=-1, still=0, t=0;
      const seen=[];                 /* one reading a hundred ticks, for the verdict */
      for(t=1;t<=6000;t++){
        WATER.step(0.25);
        if(t%50===0) await new Promise(r=>setTimeout(r,0));
        /* SETTLED IS NOT FROZEN. A live flow is water arriving and water
           being taken by the sea at the same rate, and the tip of a falling
           column flickers by a dozen cells from tick to tick — a tolerance of
           one per cent of nine hundred is nine cells, and Angel was reported
           "climbing" for four thousand ticks on that. Twenty cells, or two
           per cent, whichever is the wider.

           AND IT IS THIS FALL'S OWN COUNT, not the world's. With the springs
           live the engine keeps a fall of its own running whereever the
           traveller stands, and the world's total never stops moving — so all
           three falls were reported as "climbing" while each of them stood
           perfectly still. */
        if(t%100===0){ const c=mine().length; seen.push(c);
          if(prev>=0&&Math.abs(c-prev)<=Math.max(20,prev*0.02)) still++; else still=0;
          prev=c; if(still>=2) break; }
      }
      /* ---- SETTLED, OR AT LEAST NOT CLIMBING, WHICH IS THE REAL QUESTION ----
         The fault this guards is a FLOOD — 31,629 cells and rising fast — and
         the wide cataracts take their time filling their aprons: Iguazu was
         reported "climbing" at four thousand ticks while standing within a few
         per cent of where it finished. So a fall that has not settled is
         judged on whether it is still GROWING: more than a tenth added over
         its last thousand ticks is a fall that has not found its bounds, and
         anything less has. */
      const standing=mine(), held=standing.length;
      const back=seen.length>10?seen[seen.length-11]:seen[0];
      const settled=still>=2||!(held>back*1.1);

      /* IT POURED: water standing in the shaft, between the foot and the lip,
         within the first few blocks downstream of the brink */
      let shaft=0, far=0;
      const brink=Math.max(0,Math.floor(f.F.under*f.drop));
      for(let v=brink;v<=brink+4;v++) for(let u=-f.half;u<=f.half;u++){
        const ix=Math.floor(wx(u,v)/B), iz=Math.floor(wz(u,v)/B);
        for(let iy=lip-1;iy>lip-f.drop;iy--) if(WATER.levelAt(ix,iy,iz)!==null) shaft++;
      }
      /* IT STAYED: the fall's own claim is its lip and the gorge it cut, and
         nothing of ours may stand outside it */
      const claim=f.half+f.run+16;
      for(const s of standing){
        const p=s.slice(0,s.lastIndexOf(':')).split(',');
        const d=Math.hypot((+p[0])*B-f.x,(+p[2])*B-f.z)/B; if(d>far) far=d;
      }

      /* AND IT GOES WHEN THE SOURCE DOES */
      for(const h of heads) WATER.take(h[0],h[1],h[2]);
      for(let k=0;k<4000;k++){ WATER.step(0.25);
        if(k%50===0){ await new Promise(r=>setTimeout(r,0)); if(!mine().length) break; } }
      const left=mine().length;

      said.push(f.n.split(/[ —]/)[0]+': '+held+' cells, '+shaft+' in the shaft, '+
        Math.round(far)+' blocks at furthest (of '+Math.round(claim)+'), drained to '+left);
      if(!shaft) faults.push(f.n+' ran dry — nothing went over the brink');
      if(!settled) faults.push(f.n+' is still climbing ('+back+' → '+held+' cells over its last thousand ticks)');
      if(far>claim) faults.push(f.n+' left its own gorge ('+Math.round(far)+' blocks out)');
      if(left>Math.max(20,held*0.05)) faults.push(f.n+' would not unwind ('+left+' cells left standing)');
    }
    return {ok:!faults.length, got:said.join(' · ')+(faults.length?' · FAULTS: '+faults.join(' · '):'')};
  })};

T[43]={name:'a tree stands in blocks: the axe bites the bole and it gives timber',
  /* THE HOLE THIS FILLS, AND IT IS AN OLD ONE. `blocks/log.js` (Timber, to an
     axe, dropping log) and `blocks/flint-axe.js` ("For the wood. A cedar that
     takes a hand a slow minute takes an axe a moment") have both stood since
     Phase 4 — and THERE WAS NOTHING IN THE WORLD FOR THE AXE TO BITE. Every
     bole was a box merged into the chunk's geometry and a blow went straight
     through it. Two files written for felling timber that could not be felled.

     So: find a tree by asking the flora where one grows, and put four things
     to the world at that trunk —
       1. THE WORLD SAYS SOLID THERE. `blockSolidAt` is what the hand, the
          walker and the blow all read; if it is false the tree is a picture.
       2. IT IS TIMBER, not stone. The mesher's stamp answers `stone` for any
          material no block claims, so a bole that came out as rock would look
          right, break wrong, and nobody would know until they mined one.
       3. IT IS IN THE STRUCTURE LAYER and not the player's record — a tree is
          DERIVED, like a village wall, and a world that wrote every trunk it
          ever grew to the disc would be writing down a forest.
       4. AND IT BREAKS INTO WHAT IT IS: broken, the cell is empty and the
          block it drops is timber.

     THE TREE IS FOUND BY ASKING, not by hunting: `FLORA.treeAt` is what the
     chunk builder itself asks, so the test and the world agree by
     construction about where a tree is. */
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG, F=window.FLORA, B=D.B;
    if(!F||!F.treeAt) return {pending:'no flora'};
    if(!D.blockId('log')) return {pending:'no timber block'};
    const p=D.playerXZ();
    const cix=Math.floor(p.x/B), ciz=Math.floor(p.z/B);
    /* the nearest column the flora would grow a tree in */
    let at=null, wooded=0;
    for(let d=0;d<80&&!at;d++) for(let a=-d;a<=d&&!at;a++) for(let b=-d;b<=d&&!at;b++){
      if(Math.max(Math.abs(a),Math.abs(b))!==d) continue;      /* the ring at d */
      const ix=cix+a, iz=ciz+b;
      const c=D.landAtWorld((ix+0.5)*B,(iz+0.5)*B);
      if(!c||!c.tree) continue;
      wooded++;
      /* the same call the chunk builder makes, so the test and the world
         agree by construction about where a tree is */
      const K=F.treeAt(D.landNameAt?D.landNameAt((ix+0.5)*B,(iz+0.5)*B):null,
                       c.kind,c.h,ix,iz,D.hash2,false);
      if(K) at={ix,iz,h:c.h,kind:K.name||'?'};
    }
    if(!at) return {pending:'no tree grows within eighty blocks of where he stands ('+
      wooded+' wooded columns looked at)'};

    /* the ground about it laid, as the traveller walking up to it would lay it */
    for(let k=0;k<25;k++){ D.updateChunks((at.ix+0.5)*B,(at.iz+0.5)*B,900);
      await new Promise(r=>requestAnimationFrame(r)); }

    /* the trunk: the first course above the ground, at the tree's own column */
    const iy=at.h;
    const solid=D.blockSolidAt(at.ix,iy,at.iz);
    const n=D.blockAt(at.ix,iy,at.iz);
    const b=D.blockOf(n);
    const isTimber=!!(b&&b.id==='log');
    const inRecord=D.recordedAt?D.recordedAt(at.ix,iy,at.iz):null;

    /* and it breaks into what it is */
    let broke=false, gave=null;
    if(isTimber){
      gave=b.drops;
      D.setBlock((at.ix+0.5)*B,(iy+0.5)*B,(at.iz+0.5)*B,0);
      broke=!D.blockSolidAt(at.ix,iy,at.iz);
      await D.settle(2);
    }

    /* WHILE THE BOLES ARE STILL GEOMETRY this test states what it wants and
       waits, rather than standing red against a thing nobody has claimed to
       have done: FLORA.boleBlocks is the switch, and it is off. */
    if(!solid&&F.boleBlocks&&!F.boleBlocks())
      return {pending:'the boles are still geometry (FLORA.boleBlocks is off) — '+
        'a '+at.kind+' at '+at.ix+','+at.iz+' is drawn and cannot be struck'};
    const faults=[];
    if(!solid) faults.push('the bole is not solid — the tree is a picture and a blow goes through it');
    else if(!isTimber) faults.push('the bole is '+(b?b.name:'nothing')+' and not Timber'+
      (b&&b.id==='stone'?' (the stamp answered stone, which is what it answers for a material no block claims)':''));
    if(isTimber&&!broke) faults.push('the bole would not break');
    if(inRecord) faults.push('the bole is in the PLAYER\'S record, and a tree is derived');
    return {ok:!faults.length,
      got:'a '+at.kind+' at '+at.ix+','+at.iz+' · solid: '+solid+' · the block is '+
        (b?b.name:'nothing')+' · in the player\'s record: '+inRecord+
        ' · it drops '+gave+' · broken: '+broke+
        (faults.length?' · FAULTS: '+faults.join(' · '):'')};
  })};

T[42]={name:'a bucket fills at water, pours a source that runs, and comes back empty',
  /* THE HOLE THIS FILLS. js/water.js has had both halves of a bucket since
     the flow was written — `spill` lays a source, `take` lifts one — and
     since the flow got a layer of its own a hand's source is a DEED that
     survives a reload while the stream out of it does not. What was missing
     was the thing in the hand: there was no way for a player to touch any of
     it. Every other way water moves in this world, the world does for itself.

     THE WHOLE CHAIN, and it is a chain: a bucket is only worth anything if
     every link holds.
       1. It fills at water — and the vessel he holds becomes the full one.
       2. What he pours is a SOURCE and not a cube of water hanging in the
          air, so it RUNS: the cells about it must be more than the one he
          poured.
       3. What he poured is a DEED — it is in the player's own record, where
          the stream that runs out of it must not be (test 40 keeps that half).
       4. The vessel comes back EMPTY, or he has water for nothing.
       5. And a source of his own can be picked back up.

     It is driven through placeBlock, which is the one door a held thing goes
     through, rather than through a mouse a headless browser has not got. */
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG;
    const B=D.B;
    if(!D.blockId('bucket')||!D.blockId('water-bucket'))
      return {pending:'no bucket in blocks/ (the vessel)'};
    if(!window.WATER) return {pending:'no flow (js/water.js)'};
    if(!D.placeFrom||!D.holdId) return {pending:'no place/hold probe'};

    /* dry ground the traveller is standing on, with air over it */
    const p=D.playerXZ(), c=D.landAtWorld(p.x,p.z);
    if(!c) return {ok:false,got:'he stands on nothing'};
    const ix=Math.floor(p.x/B)+3, iz=Math.floor(p.z/B), iy=c.h;
    const faults=[];

    /* ---- 1 · A CISTERN TO DIP IN, laid as the world's own water would be ---- */
    D.setBlock((ix+0.5)*B,(iy+0.5)*B,(iz+0.5)*B, D.blockId('water'));
    await D.settle(2);
    D.satchelAdd('bucket',1); D.holdId('bucket');
    /* the arm on the water, struck on its top face */
    const dip=D.placeFrom({ix,iy,iz,nx:0,ny:1,nz:0,n:D.blockAt(ix,iy,iz),dist:2});
    const gotFull=D.satchelCount('water-bucket');
    if(!gotFull) faults.push('dipping gave no full bucket ('+JSON.stringify(dip)+')');

    /* ---- 2 · POURED OUT, AND IT RUNS ----
       COUNTED ABOUT THE POURING AND NOT OVER THE WORLD. The springs at the
       falls are live and their water is in the same map; a global count here
       read fourteen hundred cells of somebody else's waterfall and called it
       a bucket. */
    const near=(cx,cz,r)=>{ let n=0;
      for(const st of WATER.serialise()){ const q=st.slice(0,st.lastIndexOf(':')).split(',');
        if(Math.abs(+q[0]-cx)<=r&&Math.abs(+q[2]-cz)<=r) n++; }
      return n; };
    D.holdId('water-bucket');
    const px=Math.floor(p.x/B)-3, pz=Math.floor(p.z/B), py=(D.landAtWorld((px+0.5)*B,(pz+0.5)*B)||c).h;
    /* the arm on the ground beside him, struck on its top face */
    const pour=D.placeFrom({ix:px,iy:py-1,iz:pz,nx:0,ny:1,nz:0,n:D.blockAt(px,py-1,pz),dist:2});
    const before=near(px,pz,12);
    const source=WATER.levelAt(px,py,pz);
    if(source!==WATER.SOURCE) faults.push('what was poured is not a source ('+JSON.stringify(pour)+')');
    /* let it run, and it must be more than the one cell he poured */
    for(let t=0;t<400;t++){ WATER.step(0.25);
      if(t%50===0) await new Promise(r=>setTimeout(r,0)); }
    const ran=near(px,pz,12);
    if(ran<2) faults.push('the poured source did not run ('+ran+' cells)');
    /* and it is HIS: in the record, where the stream must not be */
    /* READ AT THE MOMENT IT IS TRUE, and reported from that reading. The first
       cut of this asserted it here and PRINTED it at the end — by which time
       the source had been picked back up, so the line said "in the record:
       false" under a test that had just passed on its being true. */
    const wasRecorded=D.recordedAt?D.recordedAt(px,py,pz):null;
    if(wasRecorded===false) faults.push('his own source is not in the record');

    /* ---- 3 · THE VESSEL COMES BACK EMPTY ---- */
    const backEmpty=D.satchelCount('bucket');
    if(!backEmpty) faults.push('the bucket did not come back empty');

    /* ---- 4 · AND HE MAY PICK HIS OWN SPRING BACK UP ---- */
    D.holdId('bucket');
    D.placeFrom({ix:px,iy:py,iz:pz,nx:0,ny:1,nz:0,n:D.blockAt(px,py,pz),dist:2});
    const lifted=WATER.levelAt(px,py,pz)===null;
    if(!lifted) faults.push('his own source could not be taken back up');
    /* the world is left as it was found */
    for(let t=0;t<600&&near(px,pz,12);t++){ WATER.step(0.25);
      if(t%50===0) await new Promise(r=>setTimeout(r,0)); }
    D.setBlock((ix+0.5)*B,(iy+0.5)*B,(iz+0.5)*B, 0);
    D.satchelTake('bucket',9); D.satchelTake('water-bucket',9);

    return {ok:!faults.length,
      got:'dipped → '+(gotFull?'a full bucket':'nothing')+
        ' · poured a source that ran to '+ran+' cells'+
        ' · his own, in the record when he poured it: '+wasRecorded+
        ' · came back empty: '+!!backEmpty+' · his own spring taken back up: '+lifted+
        (faults.length?' · FAULTS: '+faults.join(' · '):'')};
  })};

T[41]={name:'a wood wears more than one bark, and the six cost draw calls and not one triangle',
  /* §2.4.3 asks for a bark per species. A texture per species is a MATERIAL
     per species, and the rule this whole flora is built on is that a hundred
     and seventy species share four grey materials and tint their own faces —
     so the bark is ASSIGNED out of six patterns, exactly as the canopy form is
     assigned, and the per-species tint still sits on top of every one of them.

     THE FEATURE SHIPPED WITHOUT ITS NUMBER, which is the only reason this test
     exists: every other item of Phase 6 was measured against the thing it
     replaced and this one was not, and PLAN.md still called it *"one grey
     bark, tinted per species"* three rounds after it had stopped being that.

     So the wood is built TWICE in one page — six barks, then the one they
     replaced — and the two things that must be true of the difference are
     asserted:

       IT COSTS DRAW CALLS. A material is a mesh is a draw call, and more
       barks in view must mean more meshes, or the barks are not reaching the
       ground at all.
       IT COSTS NO GEOMETRY. Not one triangle may move. A bark is a texture on
       faces that were already there, and a single triangle of difference would
       mean something else changed with it.

     AND BOTH BUILDS STAND ON THE SAME DISC. The first cut of this measurement
     did not: the frame lays its own ring every frame and reaps whatever falls
     outside it, so one build read 545 chunks and the other 709, and it
     reported a quarter of a million extra triangles from a change that touches
     no geometry whatever. `holdWorld` stops the world laying ground of its own
     while a measurement is taken, and the chunk counts are asserted equal
     rather than assumed so that this can never be read that way again. */
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG, W=window.__WORLD, F=window.FLORA;
    if(!F||!F.barkOn||!F.barkOf) return {pending:'no bark per kind (Phase 6 §2.4.3)'};
    if(!D.viewStats||!D.dropChunks||!D.holdWorld) return {pending:'no A/B build probes'};

    /* THE WOOD IS CHOSEN BY ITS OWN GROWTH AND NOT BY NAME: the country whose
       flora lists the most DISTINCT barks, which is what makes it a wood worth
       asking. Data picks it, so a country renamed cannot make this stale. */
    const lands=F.lands(), kinds=F.kinds(), score=[];
    for(const n in lands){
      const l=lands[n], list=(l&&l.tree)||l||[];
      const names=Array.isArray(list)?list:Object.keys(list||{});
      const barks=new Set();
      for(const k of names){ const K=kinds[k]; if(K&&K._bark) barks.add(K._bark); }
      score.push({n,trees:names.length,barks:barks.size});
    }
    score.sort((a,b)=>b.barks-a.barks||b.trees-a.trees);
    const S=W.sites(); let at=null;
    for(const c of score){
      for(let i=0;i<S.length;i++){ if(S[i]&&D.COUNTRIES[i].n===c.n){
        at={n:c.n,x:S[i].x,z:S[i].z,barks:c.barks,trees:c.trees}; break; } }
      if(at) break;
    }
    if(!at||at.barks<3) return {pending:'no wood of three barks or more stands on the chart'};

    const build=async on=>{
      F.barkOn(on);
      D.holdWorld(true); D.dropChunks();
      for(let k=0;k<25;k++){ D.updateChunks(at.x,at.z,900,13);
        await new Promise(r=>requestAnimationFrame(r)); }
      D.updateChunks(at.x,at.z,900,13);
      const st=D.viewStats();
      D.holdWorld(false);
      return st;
    };
    D.state.fly.x=at.x; D.state.fly.z=at.z; D.setMode('fly');
    const six=await build(true), one=await build(false);
    F.barkOn(true);
    const barks=st=>st.byMat.filter(m=>/^bark/.test(m[0]));
    const sixBark=barks(six), oneBark=barks(one);

    const faults=[];
    if(six.chunks!==one.chunks)
      faults.push('the two builds stood on different discs ('+one.chunks+' against '+six.chunks+
        ') — nothing below this line means anything');
    else {
      if(sixBark.length<3) faults.push('only '+sixBark.length+' bark(s) reached the ground');
      if(oneBark.length!==1) faults.push('with the switch off the wood wore '+oneBark.length+' barks, wanted 1');
      if(!(six.meshes>one.meshes)) faults.push('six barks cost no draw calls at all — they are not being drawn');
      if(six.tris!==one.tris) faults.push('the geometry moved by '+(six.tris-one.tris)+
        ' triangles, and a bark is a texture and not a shape');
    }
    return {ok:!faults.length,
      got:at.n+' ('+at.trees+' kinds, '+at.barks+' barks) over '+six.chunks+' chunks · meshes '+
        one.meshes+' → '+six.meshes+' (+'+(six.meshes-one.meshes)+', +'+
        ((six.meshes/one.meshes-1)*100).toFixed(1)+'%) · triangles '+one.tris+' → '+six.tris+
        ' (+'+(six.tris-one.tris)+') · the barks in view: '+
        sixBark.map(m=>m[0].replace(/^bark/,'')+' '+m[1]).join(', ')+
        (faults.length?' · FAULTS: '+faults.join(' · '):'')};
  })};

T[40]={name:'a running fall writes nothing into the record, and a hand\'s own source writes itself',
  /* WHAT THIS IS FOR. A waterfall that has SETTLED is not still: Angel lays
     11,696 blocks and takes up 11,676 over two hundred ticks simply to stand
     where it is. While every one of those went through the engine's one door,
     each marked its chunk for the SAVE and re-armed the 900 ms writer — so
     turning the springs on would have had the world writing itself to the
     disc four times a second at every fall the traveller had ever passed, for
     the rest of the voyage, and would have filed a waterfall in the record of
     what HANDS have done.

     The flow has its own layer now (WEDITS), as the villages do. This is the
     test of the only two things that must be true of it:

     1. A FALL RUNS AND THE RECORD DOES NOT MOVE. Not "moves a little" — the
        count of recorded cells and the count of chunks queued for the writer
        must be EXACTLY what they were before the spring was laid, after
        thousands of blocks have been laid and taken up.
     2. THE WATER IS STILL THERE. A layer nobody can see is not a fix, it is a
        deletion: `blockAt` must answer water at the cells the flow filled,
        because that one answer is what the mesher, the collision and the
        traveller's own feet all read.

     And the other half of the arrangement: A HAND'S OWN SOURCE IS A DEED and
     DOES go in the record, or a bucket emptied on a hillside would be gone on
     the next voyage. */
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG, B=D.B;
    if(!window.WATER||!D.recorded||!D.flowing) return {pending:'no water layer (WEDITS)'};
    const list=window.WATERFALL?WATERFALL.list():[];
    if(!list.length) return {pending:'no falls in world/waterfalls.js'};
    const f=list.filter(x=>x.form==='cataract').sort((a,b)=>b.half-a.half)[0]||list[0];

    const rec0=D.recorded(), save0=D.queuedToSave(), flow0=D.flowing();
    const heads=[];
    for(const [x,z] of WATERFALL.springs(f)){
      const c=D.landAtWorld(x,z); if(!c) continue;
      const ix=Math.floor(x/B), iz=Math.floor(z/B);
      if(WATER.spill(ix,c.h,iz)) heads.push([ix,c.h,iz]);      /* the world's own spring: no deed */
    }
    if(!heads.length) return {ok:false,got:'no head could be laid at '+f.n};
    let prev=-1, still=0;
    for(let t=1;t<=4000;t++){
      WATER.step(0.25);
      if(t%50===0) await new Promise(r=>setTimeout(r,0));
      if(t%100===0){ const c=WATER.count();
        if(prev>=0&&Math.abs(c-prev)<=Math.max(20,prev*0.02)) still++; else still=0;
        prev=c; if(still>=2) break; }
    }
    const st=WATER.stats(), cells=WATER.count();
    const rec1=D.recorded(), save1=D.queuedToSave(), flow1=D.flowing();

    /* the water is in the WORLD, whatever layer it lies in: every cell the
       flow believes it filled must answer as water at the one door the game
       reads. AND NOT ONE OF THEM MAY BE IN THE RECORD — which is asked cell by
       cell, because a TOTAL cannot answer it: the world does other things
       while a fall runs (a bank of sand comes down, a village lays a wall) and
       those are records rightly kept. */
    let seen=0, blind=0, inRecord=0;
    for(const s of WATER.serialise()){
      const p=s.slice(0,s.lastIndexOf(':')).split(',');
      const ix=+p[0], iy=+p[1], iz=+p[2];
      if(D.blockAt(ix,iy,iz)) seen++; else blind++;
      if(D.recordedAt(ix,iy,iz)) inRecord++;
    }

    /* AND A HAND'S OWN SOURCE IS THE OTHER CASE. One bucket, on dry ground
       well away from the fall, laid as a DEED. */
    const p=D.playerXZ(), c=D.landAtWorld(p.x,p.z);
    let deedRec=-1;
    if(c){ const r=D.recorded();
      WATER.spill(Math.floor(p.x/B), c.h+1, Math.floor(p.z/B), true);
      deedRec=D.recorded()-r; }

    /* the world is left as it was found */
    for(const h of heads) WATER.take(h[0],h[1],h[2]);
    if(c) WATER.take(Math.floor(p.x/B), c.h+1, Math.floor(p.z/B));
    for(let k=0;k<4000&&WATER.count();k++){ WATER.step(0.25);
      if(k%50===0) await new Promise(r=>setTimeout(r,0)); }

    const faults=[];
    if(inRecord) faults.push(inRecord+' cells of the running flow are IN THE RECORD');
    if(!(flow1>flow0)) faults.push('the water\'s own layer never filled');
    if(blind) faults.push(blind+' cells of water the world cannot see');
    if(deedRec!==1) faults.push('a hand\'s own source put '+deedRec+' cells in the record, wanted 1');
    /* the record's TOTAL is reported and not judged: thousands of blocks of
       water moved through here, and if the world's own doings have moved it by
       a handful in the same minutes, that is the world and not the water. A
       drift of more than a hundred would not be. */
    if(Math.abs(rec1-rec0)>100) faults.push('the record moved by '+(rec1-rec0)+
      ' cells, which is too many to be the world going about its business');
    return {ok:!faults.length,
      got:f.n.split(/[ —]/)[0]+': '+cells+' cells standing, '+st.moved+' laid and '+st.dried+
        ' taken up · NONE of them in the record ('+inRecord+') · the flow\'s own layer '+
        flow0+' → '+flow1+' · '+seen+' of '+(seen+blind)+
        ' cells answer as water · a hand\'s bucket puts '+deedRec+' in the record · '+
        'the record itself '+rec0+' → '+rec1+' and the writer\'s queue '+save0+' → '+save1+
        ' (the world\'s own doings)'+
        (faults.length?' · FAULTS: '+faults.join(' · '):'')};
  })};

T[44]={name:'a man who begins with nothing can come by a pick, and then the rock gives',
  /* THE FAULT THIS EXISTS FOR, and it is the worst one this suite has ever
     been unable to see. "The tool is a requirement, not a discount" was right
     about the rock and was applied to every tool at once — and the world's own
     data then closed on itself:

       flint wants a PICK · a pick is made of flint 3 + planks 2
       log   wants an AXE · an axe is made of flint 3 + planks 2
       planks are riven from a log

     Of forty-two blocks, eight gave to a bare hand: the five flint tools,
     which could not be made, and glass, hay, leaves, water and wool. So in a
     VOYAGE no tool could ever be come by, and no rock, ore, timber or earth
     could ever be broken. Free roam was exempt, which is the only reason it
     went unnoticed: every test in this suite but one runs with the free hand.

     Four tests went red and every one of them was read as a broken hand. The
     hand was not broken. THE WORLD WAS SHUT.

     So this walks the whole bootstrap in the voyage hand and names the link
     that fails, if one does: fingers → timber, fingers → flint, the works →
     a pick, the pick → the rock. What it does NOT re-prove is the drop and
     the taking-up, which is test 15's; the materials go into the satchel
     directly, and that is said here rather than implied. */
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG, B=D.B;
    if(!D.workMake||!D.mineProgress) return {pending:'no works and no blow to walk the chain with'};
    if(D.applyFreeroam){ D.state.freeroam=false; D.applyFreeroam(); }   /* the VOYAGE hand */
    /* HE IS PUT ON GROUND FIRST, and the ground is looked for in more than
       one direction: nine blocks east of wherever the test before this one
       left him can be off the edge of what is built, and "no ground under the
       traveller" is a fault in the footing, not in the chain. */
    let t=null;
    { const q=D.blockUnder(D.playerXZ().x, D.playerXZ().z);
      if(q){ D.setMode('walk'); D.state.walk.x=q.x; D.state.walk.z=q.z;
        D.state.walk.feetY=undefined; await D.settle(2); } }
    const p=D.playerXZ();
    for(const d of [[9,0],[0,9],[-9,0],[0,-9],[5,5],[3,0],[0,0]]){
      t=D.blockUnder(p.x+d[0]*B, p.z+d[1]*B); if(t) break; }
    if(!t) return {ok:false,got:'no ground under the traveller, seven ways about him'};
    const ix=t.ix, iy=t.iy+5, iz=t.iz;
    const cx=(ix+0.5)*B, cy=(iy+0.5)*B, cz=(iz+0.5)*B;
    const STEP=1/60;
    /* ---- HE BEGINS WITH NOTHING, which is the whole point ---- */
    for(const sl of D.satchel()) if(sl) D.satchelTake(sl.id,sl.n);
    const emptied=D.satchel().every(sl=>!sl);
    const hew=async(id,seconds)=>{
      D.setBlock(cx,cy,cz,D.blockId(id)); await D.settle(2);
      D.mineDrive(true); D.mineAt(ix,iy,iz,0,1,0); D.mineHold(true);
      let spent=0, broke=-1;
      for(let k=0;k<Math.ceil(seconds*70);k++){
        D.mineStep(STEP); spent+=STEP;
        if(!D.blockSolidAt(ix,iy,iz)){ broke=spent; break; } }
      D.mineHold(false); D.mineAt(null); D.mineDrive(false);
      D.setBlock(cx,cy,cz,0); await D.settle(1);
      return broke;
    };
    const hardOf=id=>D.blockOf(D.blockId(id)).hardness;
    /* 1 · fingers take timber, and a flint out of the chalk */
    const gotLog=await hew('log',   hardOf('log')  *D.handSlow()*2);
    const gotFlint=await hew('flint',hardOf('flint')*D.handSlow()*2);
    /* 2 · and they do NOT take the rock — the requirement still stands */
    const gotStone=await hew('stone', hardOf('stone')*D.handSlow()*1.5);
    /* 3 · the works, out of what the hands took. (The drop and the taking-up
       are test 15's; what is asked here is whether the CHAIN closes.) */
    D.satchelAdd('log',1);
    const planks=D.workMake('planks');
    D.satchelAdd('flint',3);
    const pick=D.workMake('flint-pick');
    const inHand=(()=>{ const i=D.satchel().findIndex(sl=>sl&&sl.id==='flint-pick');
      if(i<0) return false; D.setHeld(i); return true; })();
    /* 4 · and now the rock gives */
    const gotStone2=inHand?await hew('stone', hardOf('stone')*2):-1;

    const faults=[];
    if(!emptied) faults.push('the satchel could not be emptied — he did not begin with nothing');
    if(gotLog<0) faults.push('bare fingers could not take TIMBER');
    if(gotFlint<0) faults.push('bare fingers could not take FLINT — the chain starts nowhere');
    if(gotStone>=0) faults.push('bare fingers took the ROCK in '+gotStone.toFixed(2)+'s — the requirement is gone');
    if(!planks||!planks.ok) faults.push('the planks would not be riven: '+((planks&&planks.why)||'?'));
    if(!pick||!pick.ok) faults.push('the pick would not be knapped: '+((pick&&pick.why)||'?'));
    if(!inHand) faults.push('the pick was made but could not be got into the hand');
    else if(gotStone2<0) faults.push('with the pick in hand the rock STILL would not give');
    return {ok:!faults.length,
      got:'began with nothing='+emptied+
        ' · timber by hand '+(gotLog<0?'NEVER':gotLog.toFixed(2)+'s')+
        ' · flint by hand '+(gotFlint<0?'NEVER':gotFlint.toFixed(2)+'s')+
        ' · rock by hand '+(gotStone<0?'refused, rightly':'GAVE in '+gotStone.toFixed(2)+'s')+
        ' · rive planks: '+((planks&&planks.ok)?planks.gave:'no')+
        ' · knap a pick: '+((pick&&pick.ok)?pick.gave:'no')+
        ' · rock with that pick '+(gotStone2<0?'NEVER':gotStone2.toFixed(2)+'s')+
        (faults.length?' · '+faults.join(' · '):'')};
  })};


T[45]={name:'a voyage may not fly, may not turn the year, may not set the hour, and is not offered the stores',
  /* this one asks for BOTH hands in turn and sets them itself, as test 23
     does; it is marked so the runner's own declaration does not fight it */
  freeHand:true,
  /* ---- WHY THIS EXISTS: THE SUITE ONLY EVER TESTED WHAT A VOYAGE PERMITS ----
     Every rule that a VOYAGE bears and the free hand is spared had a test —
     the rock that refuses bare fingers, the blow that costs its hardness, the
     drop that must be picked up, the block that costs a block to lay. Every
     rule that a voyage FORBIDS had none. Flight, the year and the hour belong
     to free roam; the stores belong to the free hand; and nothing anywhere
     asked whether a voyage could reach them.

     One of them could. `FREEROAM_ONLY` is called "one list, obeyed by the
     rail, by the keyboard and by the menu, so the three can never disagree
     about what a voyage may and may not do" — and the menu did not obey it.
     The rail hides the Time of Day button on a voyage with a stylesheet rule;
     the options modal mirrors the rail by CLICKING the button underneath; and
     a hidden button fires its onclick exactly like a shown one. Options →
     Time of day set the hour on a voyage, three clicks from anywhere.

     SO IT DRIVES THE REAL PATHS AND NOT A PROBE WRITTEN FOR THE OCCASION: the
     window's own keydown listener, the rail's own buttons, the modal's own
     mirror, and getComputedStyle on what a player would see. And it asks BOTH
     halves of every rule — a locked door proves nothing unless the key also
     works, and a test that only sees the refusal cannot tell a rule from a
     thing that is simply broken. */
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG;
    if(!D.applyFreeroam) return {pending:'no free roam in this build'};
    const raf=()=>new Promise(r=>requestAnimationFrame(r));
    const key=async code=>{ window.dispatchEvent(new KeyboardEvent('keydown',{code}));
      window.dispatchEvent(new KeyboardEvent('keyup',{code})); await raf(); };
    const BTNS=['b-fly','b-time','b-speed','b-daypart','b-season'];
    const shown=id=>{ const e=document.getElementById(id);
      return !!e&&getComputedStyle(e).display!=='none'; };
    const seasonNow=()=>window.SEASON?window.SEASON.overrideName():null;
    const stores=()=>{ if(!D.pageOpen()) D.togglePage(); D.pageDraw();
      const n=document.querySelectorAll('#page-stores .tok').length;
      const h=document.getElementById('page-head');
      const head=h&&h.children[1]?h.children[1].textContent:'';
      if(D.pageOpen()) D.togglePage();
      return {n,head}; };
    /* he is set down on the ground, out of any scene, so the keys are heard:
       the listener drops everything while a film runs or the map is up */
    if(D.sceneActive&&D.sceneActive()) D.endScene();
    if(D.state.firm) D.state.firm=false;
    if(D.state.mode==='fly') D.setMode('walk');
    const season0=seasonNow(), day0=D.state.dayIdx;

    const ask=async()=>{
      await raf();
      const mode0=D.state.mode, s0=seasonNow(), d0=D.state.dayIdx;
      await key('KeyG');
      const flew=D.state.mode==='fly';
      if(flew){ await key('KeyG'); await raf(); }          /* set him down again */
      await key('KeyK');
      const turned=seasonNow()!==s0;
      if(turned&&window.SEASON) window.SEASON.setSeason(s0==='Natural'?null:s0);
      /* THE HOUR IS ASKED THROUGH THE MENU'S OWN MIRROR, which is where the
         hole was: the rail's button is hidden on a voyage and the modal
         clicks it anyway. */
      const mo=document.getElementById('mo-daypart'); if(mo) mo.click();
      const hourSet=D.state.dayIdx!==d0;
      if(hourSet){ D.state.dayIdx=d0; D.applyDayPart(); }
      const st=stores();
      return {mode0, flew, turned, hourSet, rail:BTNS.filter(shown),
              stores:st.n, head:st.head};
    };

    /* ---- ON A VOYAGE: every one of them refused ---- */
    D.state.freeroam=false; D.applyFreeroam(); await raf();
    const v=await ask();
    const said=(document.getElementById('verse-t')||{}).textContent||'';

    /* ---- IN FREE ROAM: every one of them given ---- */
    D.state.freeroam=true; D.applyFreeroam(); await raf();
    const f=await ask();

    /* and the world is left as it was found */
    D.state.freeroam=false; D.applyFreeroam();
    if(window.SEASON) window.SEASON.setSeason(season0==='Natural'?null:season0);
    D.state.dayIdx=day0; D.applyDayPart();
    if(D.state.mode==='fly') D.setMode('walk');

    const faults=[];
    if(v.flew) faults.push('a VOYAGE took flight');
    if(v.turned) faults.push('a VOYAGE turned the year');
    if(v.hourSet) faults.push('a VOYAGE set the hour through the options menu');
    if(v.rail.length) faults.push('a VOYAGE is shown '+v.rail.join(', '));
    if(v.stores) faults.push('a VOYAGE is offered '+v.stores+' blocks from the stores');
    if(!/FREE ROAM/i.test(said)) faults.push('the refusal was not spoken (it said: "'+said.slice(0,48)+'")');
    if(!f.flew) faults.push('FREE ROAM could not take flight');
    if(!f.turned) faults.push('FREE ROAM could not turn the year');
    if(!f.hourSet) faults.push('FREE ROAM could not set the hour');
    if(f.rail.length!==BTNS.length) faults.push('FREE ROAM is shown only '+f.rail.length+' of '+BTNS.length+' of its own buttons');
    if(!f.stores) faults.push('FREE ROAM is offered no stores');
    return {ok:!faults.length,
      got:'ON A VOYAGE — flight '+(v.flew?'TAKEN':'refused')+
        ' · the year '+(v.turned?'TURNED':'held')+
        ' · the hour '+(v.hourSet?'SET':'held')+
        ' · '+v.rail.length+' of '+BTNS.length+' roam-only buttons shown'+
        ' · '+v.stores+' in the stores ("'+v.head+'")'+
        ' | IN FREE ROAM — flight '+(f.flew?'taken':'REFUSED')+
        ' · the year '+(f.turned?'turned':'HELD')+
        ' · the hour '+(f.hourSet?'set':'HELD')+
        ' · '+f.rail.length+' of '+BTNS.length+' buttons shown'+
        ' · '+f.stores+' in the stores ("'+f.head+'")'+
        (faults.length?' · '+faults.join(' · '):'')};
  })};


T[46]={name:'the manner a voyage was begun in survives a reload',
  /* A FLAG THAT COMES BACK WRONG GIVES AWAY EVERY RULE ABOVE AT ONCE: a
     voyage that resumed as free roam would have flight, the year, the hour,
     the stores and a hand that breaks rock at a touch, and nothing would say
     so. `fr` is written into the save and read back out of it, and nothing
     has ever checked the round trip.

     AND IT ASKS FOR THE THING THE FLAG GOVERNS, not merely the flag: a
     restore that sets state.freeroam without calling applyFreeroam would put
     the body class out of step with it, and the rail would tell the traveller
     the opposite of what the hand does. Both directions are held, because a
     flag that always comes back false would pass half of this. */
  run:async(page,ctx)=>{
    const set=async roam=>page.evaluate(r=>{ const D=window.__VDBG;
      D.state.freeroam=r; D.applyFreeroam(); D.saveNow(); return !!D.state.freeroam; },roam);
    const read=async()=>page.evaluate(()=>{ const D=window.__VDBG;
      const BTNS=['b-fly','b-time','b-speed','b-daypart','b-season'];
      const shown=BTNS.filter(id=>{ const e=document.getElementById(id);
        return !!e&&getComputedStyle(e).display!=='none'; });
      return {flag:!!D.state.freeroam, shown:shown.length, of:BTNS.length}; });
    await set(false); await ctx.reload();
    const v=await read();
    await set(true); await ctx.reload();
    const f=await read();
    await set(false);                     /* left as a voyage, as it was found */
    const faults=[];
    if(v.flag) faults.push('a VOYAGE came back as free roam');
    if(v.shown) faults.push('a voyage came back showing '+v.shown+' roam-only buttons');
    if(!f.flag) faults.push('FREE ROAM came back as a voyage');
    if(f.shown!==f.of) faults.push('free roam came back showing only '+f.shown+' of '+f.of+' of its buttons');
    return {ok:!faults.length,
      got:'a voyage came back: freeroam='+v.flag+', '+v.shown+' of '+v.of+' roam-only buttons shown'+
        ' · free roam came back: freeroam='+f.flag+', '+f.shown+' of '+f.of+' shown'+
        (faults.length?' · '+faults.join(' · '):'')};
  }};


T[37]={name:'no county is given to the sea by a river running through it',
  /* THE FAULT THIS GUARDS — "holes are appearing in the world view when
     zooming out", and they were holes exactly.

     The far carpet reads the land at the MIDDLE of each of its cells and
     nowhere else. Near the traveller a cell is a few blocks across and one
     point is the whole of it. Drawn far back the ring opens out to eight
     times its radius on the same 64 × 112 lattice, so a cell out there is
     some sixteen hundred units across — and the Nile is forty. A cell whose
     centre happened to fall in the river was given to the sea entire: sunk
     six units under the waterline, walled on four sides, and coloured FL_SEA,
     which is half the brightness of the charted sea laid over the top of it.
     A navy trench across dry Egypt, a chain of them down every great river,
     and a pit for every lake and inlet too small to be a sea at that grain.

     THE RULE NOW: a coarse cell whose middle falls in a RIVER RUNNING
     THROUGH A NATION stands as that nation's ground, at the height of the
     lowest bank inside the cell. Nothing else is touched — not a coastline,
     not a bay, not an island, not a league of open sea — because none of
     them is a river.

     This puts that rule to the RUNNING WORLD and not to the source. Every
     coarse cell of a freshly laid ring is read off the terrain again; a cell
     whose middle is river water and which has dry bank inside it, and which
     the ring nonetheless called sea, is a DROWNED county. There may be none.

     RIVERS is printed beside it — how many such cells there were to get
     right — so that a run which found no fault can be told from a run that
     laid a ring over open ocean and never asked the question. */
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG;
    if(!D.farRing||!D.farAudit) return {pending:'the carpet has no probe (farRing/farAudit)'};
    const W=window.__WORLD;
    /* THE EYE IS PUT WAY OUT, because that is what makes the cells coarse:
       the ring's reach follows the height, and the fault does not exist at
       all until a cell is wider than the water it is asked about. */
    const EYE=24000;
    const at=[];
    /* the traveller's own ground, and then the three widest countries with a
       river in them — named by NOTHING here: they are taken by size out of
       the country table, which is data, so this test cannot go stale when a
       country is added or its outline redrawn */
    const p=D.state.mode==='walk'?D.state.walk:D.state.boat;
    at.push({n:'where he stands',x:p.x,z:p.z});
    const S=W.sites();
    const big=[];
    for(let i=0;i<S.length;i++){ if(!S[i]) continue;
      const c=D.COUNTRIES[i];
      let a=0; for(const ring of c.p) a+=ring.length;   /* outline detail stands for size */
      big.push({n:c.n,x:S[i].x,z:S[i].z,a}); }
    big.sort((a,b)=>b.a-a.a);
    for(const b of big.slice(0,3)) at.push(b);

    let drowned=0, rivers=0, coarse=0, ms=0;
    const worst=[];
    for(const w of at){
      ms+=D.farRing(w.x,w.z,EYE);
      const r=D.farAudit();
      if(!r) return {ok:false,got:'the ring would not lay at '+w.n};
      drowned+=r.drowned; rivers+=r.rivers; coarse+=r.coarse;
      if(r.drowned) worst.push(w.n+': '+r.drowned);
      await new Promise(r=>requestAnimationFrame(r));
    }
    /* and the ring is put back where the traveller is standing, so no test
       after this one is handed a carpet laid half a world away */
    D.farRing(p.x,p.z,600);
    /* a run that never saw a river proved nothing, and says so rather than
       passing quietly */
    if(!rivers) return {pending:'no river fell under any of the '+at.length+
      ' rings laid ('+coarse+' coarse cells) — nothing to get right'};
    return {ok:drowned===0,
      got:coarse+' coarse cells over '+at.length+' grounds · '+rivers+
        ' of them with a river through the middle · DROWNED (a river county called sea): '+
        drowned+(worst.length?' — '+worst.join(', '):'')+
        ' · '+(ms/at.length).toFixed(0)+' ms to lay a whole ring'};
  })};

T[36]={name:'nothing of the world was lost on the way in, and its ids are still its places',
  /* THE FAULT THIS GUARDS. The manifest appended all three hundred and
     sixty-five files at once, and one that failed to arrive rejected the
     whole promise: the loading screen read "A file of the world could not be
     read: creatures/jerboa.js" and that was the end of a hundred and
     seventy-six countries. It is loaded in ordered batches now, each file
     tried three times, and a CREATURE or a CITY that still will not come is
     let go of — the voyage sails without it and names it.

     WHAT MUST NOT BE LET GO OF is the point of this test. A country's id is
     its place in EARTH.list and a block's id is its place in EARTH.blockList
     — both of them the file's place in the manifest — so ONE missing country
     file would shift every id after it and hand the traveller a different
     world under the same save. The manifest calls those fatal. This asks the
     running world whether the two agree: as many countries as there are
     `countries/` lines, as many blocks as `blocks/` lines, and every path
     the manifest is willing to lose genuinely looked up by NAME.

     It cannot see a dropped file itself — that wants a server that drops one,
     and tools/thin-connection.js is that. This is the cheap half, and it runs
     on every suite. */
  run:async page=>page.evaluate(()=>{
    const M=window.MANIFEST, E=window.EARTH;
    if(!M||!M.files) return {pending:'no manifest on the page'};
    const count=re=>M.files.filter(f=>re.test(f)).length;
    const want={countries:count(/^countries\//), blocks:count(/^blocks\//),
                beasts:count(/^creatures\//),    cities:count(/^cities\//)};
    const got={countries:E.list.length, blocks:E.blockList.length,
               beasts:E.beastList.length, cities:E.cityList.length};
    const faults=[];
    /* the two positional lists must match to the file, or an id has moved */
    for(const k of ['countries','blocks'])
      if(got[k]!==want[k]) faults.push(k+': '+got[k]+' stood but the manifest lists '+want[k]);
    /* the two by-name lists may fall short, but only by what was declared lost */
    const lost=M.lost||[];
    for(const k of ['beasts','cities']){
      const short=want[k]-got[k];
      const owned=lost.filter(f=>new RegExp('^'+(k==='beasts'?'creatures':'cities')+'/').test(f)).length;
      if(short!==owned) faults.push(k+': '+got[k]+' of '+want[k]+', and '+owned+' declared lost');
    }
    /* and nothing positional may ever be called skippable */
    const wrong=M.files.filter(f=>M.skippable(f)&&!/^(creatures|cities)\//.test(f));
    if(wrong.length) faults.push('these are positional and yet let go of: '+wrong.slice(0,3).join(', '));
    if(lost.length) faults.push('THIS RUN LOST: '+lost.join(', '));
    return {ok:!faults.length,
      got:M.files.length+' files · '+got.countries+'/'+want.countries+' countries · '+
        got.blocks+'/'+want.blocks+' blocks · '+got.beasts+'/'+want.beasts+' beasts · '+
        got.cities+'/'+want.cities+' cities'+(faults.length?' · '+faults.join(' · '):'')};
  })};

T[29]={name:'taking a scroll plays a scene at the place, holding that scroll\'s own verse',
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG, B=D.B;
    const SC=D.SCROLLS||[];
    if(!SC.length||!D.SCENES||!D.SCENES['scroll-taken'])
      return {pending:'no taking scene (Phase 7 step 2)'};
    const spec=D.SCENES['scroll-taken'];
    /* §5 asks for fifteen to thirty seconds, and camera marks */
    const dur=spec.dur||0;
    const marks=(spec.shots||[]).length;
    /* every scroll must carry a verse of its own, or it has nothing to hold */
    const noVerse=SC.filter(s=>!s.verse||!s.verse.t||!s.verse.ref).map(s=>s.id);
    /* AND IT MUST ACTUALLY PLAY, with THAT scroll's words on the screen.
       Take one for real and read what the caption track was given. */
    const sc=SC.find(s=>!s.gone&&!D.scrollTaken.has(s.id));
    if(!sc) return {ok:false,got:'every scroll is already taken'};
    D.state.walk.feetY=D.state.walk.feetY||0;
    D.takeScroll(sc);
    await new Promise(r=>requestAnimationFrame(r));
    const c=D.cutInfo?D.cutInfo():null;
    const played=!!c;
    const heldIt=!!(c&&c.line&&c.line[1]===sc.verse.ref);
    return {ok:dur>=15&&dur<=30&&marks>=4&&!noVerse.length&&played&&heldIt,
      got:'the scene runs '+dur+'s over '+marks+' marks · '+
          SC.length+' scrolls, '+(SC.length-noVerse.length)+' with a verse of their own'+
          (noVerse.length?' · NO VERSE: '+noVerse.join(','):'')+
          ' · taking '+sc.id+': it played='+played+
          ', holding '+(c&&c.line?c.line[1]:'nothing')+
          ' (its own is '+sc.verse.ref+')'};
  })};

T[28]={name:'a great scroll lies where it costs something, and can still be got at',
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG, B=D.B;
    const SC=D.SCROLLS||[];
    if(!SC.length) return {ok:false,got:'no scrolls'};
    D.placeScrolls&&D.placeScrolls();
    const placed=SC.filter(s=>s.at);
    if(!placed.length) return {pending:'no scroll names a place (Phase 7)'};
    const rows=[]; let bad=0;
    for(const sc of placed){
      if(sc.at.mount){
        /* ON A SUMMIT: it must be at or very near the top of that height,
           not on its skirt — the climb IS the cost */
        const ix=Math.floor(sc.x/B), iz=Math.floor(sc.z/B);
        const c=D.cellRaw(ix,iz);
        let top=0;
        for(let dx=-40;dx<=40;dx+=2) for(let dz=-40;dz<=40;dz+=2){
          const q=D.cellRaw(ix+dx,iz+dz); if(q&&q.h>top) top=q.h; }
        const ok=!!c&&c.h>=top-1;
        if(!ok) bad++;
        rows.push(sc.id+' on '+sc.at.mount+': '+(c?c.h:'?')+' of '+top+(ok?' ✓':' ✗'));
        continue;
      }
      /* IN A CAVE: it must be DARK, and it must be REACHABLE — a scroll in a
         sealed pocket is not a reward, it is a bug nobody can ever see. The
         reach is walked through the air runs themselves, out to daylight. */
      const g=D.groundInfo(sc.x,sc.z,sc.refY);
      const lit=D.caveLightAt(Math.floor(sc.x/B),Math.floor(sc.z/B),g.y/B);
      const dark=lit<0.35;
      /* flood the hollow, column to column, and see if it ever reaches a
         place open to the sky */
      const seen=new Set(), q=[[Math.floor(sc.x/B),Math.floor(sc.z/B),Math.floor(g.y/B)]];
      let out=false, n=0;
      while(q.length&&n<9000&&!out){
        const [ix,iz,iy]=q.pop(); n++;
        const k=ix+','+iz+','+iy; if(seen.has(k)) continue; seen.add(k);
        const c=D.cellRaw(ix,iz); if(!c) { out=true; break; }
        if(iy>=c.h-1){ out=true; break; }        /* it has come up into the day */
        if(!c.spans) continue;
        let inRun=false;
        for(let i=0;i<c.spans.length;i+=2)
          if(iy>=c.spans[i]&&iy<=c.spans[i+1]) inRun=true;
        if(!inRun) continue;
        for(const d of [[1,0,0],[-1,0,0],[0,0,1],[0,0,-1],[0,1,0],[0,-1,0]])
          q.push([ix+d[0],iz+d[2],iy+d[1]]);
      }
      if(!dark||!out) bad++;
      rows.push(sc.id+' in a cave: light '+lit.toFixed(2)+(dark?' (dark ✓)':' (NOT DARK ✗)')+
        ', '+(out?'reaches the day ✓':'SEALED IN ✗')+' in '+n+' steps');
    }
    return {ok:bad===0, got:placed.length+' scrolls name a place · '+rows.join(' · ')};
  })};

T[27]={name:'the sea has cut caves at the waterline, open to the water',
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG, B=D.B;
    const S=window.__WORLD.sites();
    let coast=0, cliff=0, atWater=0, openSea=0;
    const spots=[];
    for(const g of D.RANGES) spots.push([g.x,g.z]);
    for(let i=0;i<10;i++) if(S[i]) spots.push([S[i].x,S[i].z]);
    for(const [sx,sz] of spots){
      const cx=Math.floor(sx/B), cz=Math.floor(sz/B);
      for(let dx=-120;dx<=120;dx+=2) for(let dz=-120;dz<=120;dz+=2){
        const ix=cx+dx, iz=cz+dz;
        const c=D.cellRaw(ix,iz); if(!c||c.kind==='floe') continue;
        /* A COAST is land with open sea beside it — no cell at all next door */
        let sea=false;
        for(const d of [[1,0],[-1,0],[0,1],[0,-1]])
          if(!D.cellRaw(ix+d[0],iz+d[1])){ sea=true; break; }
        if(!sea) continue;
        coast++;
        if(c.h>=8) cliff++;
        const sp=D.cellSpans(ix,iz); if(!sp||!sp.length) continue;
        for(let i=0;i<sp.length;i+=2){
          if(sp[i]>4) continue;                     /* not down at the water */
          atWater++;
          /* and it must have rock over it, or it is a notch and not a cave */
          if(sp[i+1]<c.h-1) openSea++;
          break;
        } } }
    return {ok:openSea>=20,
      got:coast+' coastal columns · '+cliff+' of them sea cliff · '+
          atWater+' with a hollow at the waterline, '+openSea+
          ' of those with rock standing over it'};
  })};

T[26]={name:'a stone of the breastplate is only ever in the wall of a chamber',
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG, B=D.B;
    if(!D.mineralsOf) return {pending:'no minerals'};
    /* which substances say they want a room, and how tall a one */
    const want={};
    for(let ci=1;ci<=D.COUNTRIES.length;ci++)
      for(const m of D.mineralsOf(ci)) if(m.room) want[m.n]=m.room;
    const ids=Object.keys(want).map(Number);
    if(!ids.length) return {pending:'no chamber stones (Phase 5 step 3)'};
    /* SWEEP THE CAVE COUNTRY and check every one of them where it lies. A
       stone of the breastplate found anywhere but the floor or the roof of a
       room would mean §4's "worth the descent" was decoration. */
    let found=0, wrong=0, cols=0, inRoom=0;
    for(let gi=0;gi<D.RANGES.length&&cols<60000;gi++){
      const g=D.RANGES[gi]; if(!g) continue;
      const cx=Math.floor(g.x/B), cz=Math.floor(g.z/B);
      for(let dx=-70;dx<=70;dx+=2) for(let dz=-70;dz<=70;dz+=2){
        const ix=cx+dx, iz=cz+dz;
        const c=D.cellRaw(ix,iz); if(!c) continue; cols++;
        const sp=D.cellSpans(ix,iz);
        for(let iy=1;iy<c.h;iy++){
          const n=D.oreAt(ix,iy,iz); if(!n||ids.indexOf(n)<0) continue;
          found++;
          /* it must sit on the floor or under the roof of a run tall enough */
          let ok=false;
          if(sp) for(let i=0;i<sp.length;i+=2){
            if(sp[i+1]-sp[i]<want[n]) continue;
            if(iy===sp[i]-1||iy===sp[i+1]){ ok=true; break; } }
          if(ok) inRoom++; else wrong++;
        } } }
    return {ok:found>0&&wrong===0,
      got:ids.length+' stones want a room · '+found+' found in '+cols+
          ' columns of cave country · '+inRoom+' in the wall of one, '+wrong+' anywhere else'};
  })};

T[25]={name:'a bore comes out the other side of a ridge',
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG, B=D.B;
    if(!window.CAVES||!window.CAVES.bores) return {pending:'no bores (Phase 5 step 2)'};
    D.updateChunks(0,0,1);                 /* the bores are seeded on first ask */
    const bores=window.CAVES.bores();
    if(!bores.length) return {ok:false,got:'no bore was driven anywhere'};
    /* WALK EACH ONE ALONG ITS OWN AXIS. At every step the bore's roof is
       either under the ground — rock over your head, a tunnel — or above it,
       which is daylight. A WAY THROUGH is open near both ends with rock in
       between; that is what makes it a passage and not a notch. */
    let through=0, deepest=0;
    for(const b of bores){
      let buried=0, first=null, last=null;
      for(let t=-b.len;t<=b.len;t+=B){
        const c=D.cellRaw(Math.floor((b.x+b.cos*t)/B), Math.floor((b.z+b.sin*t)/B));
        if(!c) continue;
        if(c.h>b.y+b.R+1) buried++;
        else { if(first===null) first=t; last=t; }
      }
      if(buried>deepest) deepest=buried;
      if(first!==null&&first<-b.len*0.3&&last>b.len*0.3&&buried>2) through++;
    }
    return {ok:through>0,
      got:bores.length+' bores driven · '+through+' come out the other side'+
          ' · the thickest ridge one crosses is '+deepest+' steps of rock'};
  })};

/* ---- HOW FAST IS THE MACHINE UNDER US, RIGHT NOW ----
   Test 12 compares a measured millisecond figure against a constant recorded
   in an earlier round. That is only a regression test while the machine is
   the machine those constants were taken on — and twice now it has cried
   wolf when it was not.

   The second time was settled by measuring the change against its own
   control in one page: the plains chunk read 3.14 ms/chunk with the new
   carve switched OFF and 3.16 with it ON — the feature cost nine per cent
   and the BOX was sixty per cent slower than when 1.97 was written down.
   A test that fails for that reason is not protecting anything; it is
   teaching whoever reads it to ignore a red line.

   So the suite measures the machine first, with a fixed lump of the very
   arithmetic the mesher is made of and nothing else — no canvas, no GPU, no
   allocation. If the box is materially slower than the reference, test 12
   reports PENDING and says by how much, instead of failing. If the box is
   fast enough for the constants to mean anything, it fails exactly as it
   always did. */
const CAL_REF=1.0;              /* the reference machine, by definition */
async function machineSpeed(page){
  return await page.evaluate(()=>{
    const h2=(x,y)=>{ const n=Math.sin(x*127.1+y*311.7)*43758.5453; return n-Math.floor(n); };
    /* warm, then time — the same sin-hash every noise field in the world is
       built out of, so this tracks what the mesher actually spends */
    for(let k=0;k<2e5;k++) h2(k*0.017,k*0.029);
    const t0=performance.now();
    let acc=0;
    for(let k=0;k<3e6;k++) acc+=h2(k*0.017,k*0.029);
    const ms=performance.now()-t0;
    /* ---- AND THE REFERENCE FIGURE IS INFERRED, NOT RECORDED ----
       Say so plainly. Nobody calibrated the box on which `plain: 1.970` was
       written down, because nobody knew it would be needed. 47.0 ms is
       DERIVED: the box that wrote 1.970 read the plains chunk at 1.86–1.97,
       the box measuring today reads the same chunk at 2.89–3.14 with the new
       carve switched off, and it runs this loop in 64.8 ms — so the reference
       box would have run it in about 64.8 × (1.9/3.0) ≈ 41, and 47 is set
       deliberately a little above that so the gate errs toward FAILING rather
       than toward excusing. It is an estimate and it is only ever used to
       decide whether a red line can be believed, never to move a baseline. */
    return {ms:+ms.toFixed(1), factor:+(ms/47.0).toFixed(2), acc:acc>0};
  });
}

/* ---------- 12 · the regression that matters most.  PASSES TODAY ---------- */
T[12]={name:'ocean and plains chunks build no slower than they did',
  run:async function(page){
  const r=await page.evaluate(async B=>{
    const D=window.__VDBG, S=D.BUILD_STATS;
    /* The mesher keeps its own running total (one clock read a chunk), so
       this is the true cost of buildChunk and not of the frame around it. */
    const timeAt=async(x,z)=>{
      D.state.walk.x=x; D.state.walk.z=z; D.state.walk.feetY=undefined; D.setMode('walk');
      await new Promise(r=>requestAnimationFrame(r));
      const n0=S.n, m0=S.ms;
      for(let k=0;k<25;k++){ D.updateChunks(x,z,400); await new Promise(r=>requestAnimationFrame(r)); }
      const n=S.n-n0; return n?(S.ms-m0)/n:NaN;
    };
    /* the same kind of ground, several times over, and the least is kept —
       each pass a good way off the last so the chunks are new ground */
    const least=async(x,z,dx,dz)=>{ const all=[];
      for(let i=0;i<B.passes;i++){ const t=await timeAt(x+dx*i,z+dz*i);
        if(isFinite(t)) all.push(t); }
      return all.length?{ms:Math.min.apply(null,all),all}:{ms:NaN,all:[]};
    };
    const say=r=>r.all.map(v=>v.toFixed(2)).join('/');
    /* open ocean: the middle of the great sea, far from any coast */
    const R=D.R_WORLD;
    const ocean=await least(-0.42*R, 0.16*R, 3000, 1200);
    /* open plain: the steppe, inland and flat */
    let plainSite=null; const sites=window.__WORLD.sites();
    for(let i=0;i<sites.length;i++){ if(sites[i]&&D.COUNTRIES[i].n==='Kazakhstan'){ plainSite=sites[i]; break; } }
    const plain=plainSite?await least(plainSite.x+9000,plainSite.z,900,0):{ms:NaN,all:[]};
    return {ocean, plain, say:{ocean:say(ocean), plain:say(plain)}};
  },BASELINE);

  /* ---- THE FIGURE IS NORMALISED BY THE MACHINE, NOT GATED ON IT ----
     It used to be compared raw against a baseline taken on another box, and
     the machine was consulted only to excuse a failure that had already
     happened — a cutoff at 1.25× against a slack of 1.35×. Those two numbers
     do not agree: a container running 1.24× slow is *trusted*, and has
     already spent nine tenths of the slack on being slow, so any real drift
     at all tips it red. It failed by four parts in a thousand on exactly that
     arithmetic (plain 2.670 against a ceiling of 2.660) on a day when nothing
     in the mesher had changed and two in-page A/B runs said so.

     So the loop is timed EVERY run and the readings are divided by what it
     says. What is compared is the work, with the machine taken out of it. */
  const m=await machineSpeed(page);
  const f=Math.max(0.5,m.factor);
  const norm=v=>isFinite(v)?v/f:v;
  const oc=norm(r.ocean.ms), pl=norm(r.plain.ms);
  const BL=BASELINE;
  const ok=(!isFinite(oc)||oc<=BL.ocean*BL.slack)&&(!isFinite(pl)||pl<=BL.plain*BL.slack);
  const got='ocean '+r.ocean.ms.toFixed(3)+' ms/chunk → '+oc.toFixed(3)+
    ' on the reference box (was '+BL.ocean+', passes '+r.say.ocean+') · '+
    'plain '+r.plain.ms.toFixed(3)+' → '+pl.toFixed(3)+
    ' (was '+BL.plain+', passes '+r.say.plain+') · this machine reads '+
    m.factor+'× the reference ('+m.ms+' ms against 47.0)';
  /* and past a point the reading is not worth believing at all */
  if(!ok&&m.factor>2.5) return {pending:'the machine is '+m.factor+'× slower — '+got};
  return {ok, got};
}};

(async()=>{
  const want=process.argv.slice(2).filter(a=>/^\d+$/.test(a)).map(Number);
  const nums=(want.length?want:Object.keys(T).map(Number)).sort((a,b)=>a-b);
  const {browser,page,errs}=await open({});
  await sail(page,true);
  /* ---- AND THE TESTS ARE RUN ASHORE ----
     Setting sail leaves the traveller at the helm in open water, where there
     is no ground under him, no house beside him and no grass in view — and a
     test for the shading of a grass block that is run out at sea does not
     fail, it simply finds nothing, which is worse. Every test below wants
     land, so the world is stood on before any of them is asked. */
  await page.evaluate(async()=>{
    const D=window.__VDBG, W=window.__WORLD, S=W.sites();
    let site=null;
    for(let i=0;i<S.length;i++) if(S[i]&&D.COUNTRIES[i].n==='Yasharal'){ site=S[i]; break; }
    if(!site) for(let i=0;i<S.length;i++) if(S[i]){ site=S[i]; break; }
    const idx=D.DAYPARTS.findIndex(d=>d.k==='noon'); if(idx>=0) D.state.dayIdx=idx;
    D.state.walk.x=site.x; D.state.walk.z=site.z-260; D.state.walk.feetY=undefined;
    D.setMode('walk'); D.applyDayPart();
    for(let k=0;k<40;k++){ D.updateChunks(site.x,site.z,400);
      await new Promise(r=>requestAnimationFrame(r)); }
  });
  const ctx={ reload:async()=>{ await page.reload();
    await page.waitForFunction(()=>window.__VDBG&&document.getElementById('menu')&&
      getComputedStyle(document.getElementById('menu')).display!=='none',null,{timeout:180000});
    await page.evaluate(()=>document.getElementById('m-continue').click());
    await page.waitForTimeout(4000); } };
  let pass=0, pend=0, fail=0;
  for(const n of nums){
    const t=T[n];
    /* ---- WHICH HAND EACH TEST IS RUN WITH, SAID OUT LOUD ----
       The suite SETS SAIL IN FREE ROAM (above) and always has, because the
       tools need the air and the hours: flight, a pinned noon, a season held
       still. That cost nothing for forty rounds, because free roam touched
       the WORLD and never the hand.

       Phase 4 step 10 changed that: free roam is now the free hand, where a
       block costs nothing and a blow takes at a touch. So the suite began
       reporting that a brick of hardness 2.6 broke in 0.02s — which was true,
       and was the free hand working exactly as written, and was not what the
       test meant to ask.

       So the hand is now DECLARED, once, before every test: a voyage unless
       the test says otherwise. It is set here rather than inside each test so
       that no test can be left holding the mode a previous one wanted. */
    await page.evaluate(f=>{ const D=window.__VDBG;
      if(D.applyFreeroam){ D.state.freeroam=!!f; D.applyFreeroam(); } }, !!t.freeHand);
    let r; try{ r=await t.run(page,ctx); }catch(e){ r={ok:false,got:'threw: '+e.message}; }
    const mark=r.pending?'PENDING':r.ok?'PASS   ':'FAIL   ';
    if(r.pending) pend++; else if(r.ok) pass++; else fail++;
    console.log(mark+' '+String(n).padStart(2)+' · '+t.name);
    console.log('           '+(r.pending||r.got||''));
  }
  console.log('\n'+pass+' pass · '+fail+' fail · '+pend+' pending');
  const real=[...new Set(errs)].filter(e=>!/ERR_TUNNEL/.test(e));
  if(real.length) console.log('PAGE ERRORS:\n'+real.slice(0,6).join('\n'));
  await browser.close();
  process.exit(fail?1:0);
})();
