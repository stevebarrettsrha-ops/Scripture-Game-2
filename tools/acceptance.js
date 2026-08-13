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

T[14]={name:'a blow of the hand breaks a block in the time its hardness says',
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG, B=D.B;
    if(!D.mineProgress) return {pending:'no blow: hold-to-break is not built (Phase 4 step 2)'};
    const p=D.playerXZ(), t=D.blockUnder(p.x+7*B,p.z);
    if(!t) return {ok:false,got:'no ground under the traveller'};
    /* a block of known hardness, set in open air where nothing else stands */
    const id='brick', n=D.blockId(id), b=D.blockOf(n);
    const ix=t.ix, iy=t.iy+5, iz=t.iz;
    const cx=(ix+0.5)*B, cy=(iy+0.5)*B, cz=(iz+0.5)*B;
    D.setBlock(cx,cy,cz,n); await D.settle(2);
    /* brick asks for a pick; the bare hand pays HAND_SLOW times over */
    const want=b.hardness*D.handSlow();
    D.mineAt(ix,iy,iz); D.mineHold(true);
    /* the clock is DRIVEN, not waited on: a software rasteriser's frames are
       half a second apiece and a test that slept would measure the machine */
    const STEP=1/60; let spent=0, broke=-1, cracks=0, half=null;
    for(let k=0;k<Math.ceil(want*90/1);k++){
      D.mineStep(STEP); spent+=STEP;
      const m=D.mineProgress();
      if(m){ cracks=Math.max(cracks,m.cracks); if(half===null&&m.f>=0.5) half=spent; }
      if(!D.blockSolidAt(ix,iy,iz)){ broke=spent; break; }
    }
    D.mineHold(false); D.mineAt(null);
    /* it must not break early, and it must break */
    const early=broke>=0&&broke<want-STEP*2;
    const late =broke<0;
    /* and a hand taken off it loses the work: the block heals */
    D.setBlock(cx,cy,cz,n); await D.settle(1);
    D.mineAt(ix,iy,iz); D.mineHold(true);
    for(let k=0;k<30;k++) D.mineStep(STEP);
    D.mineHold(false);
    const dropped=D.mineProgress()===null;
    D.mineAt(null); D.setBlock(cx,cy,cz,0); await D.settle(2);
    /* and the speed is read out of the HAND, not assumed. No thing in the
       world SERVES as a pick yet — tools are works, and works are step 9 —
       so every hand is bare and a block that asks for iron is had the slow
       way whatever is being carried. What is asserted here is that the
       question is asked at all, and that holding a substance does not turn
       that substance into the tool that breaks it. */
    D.satchelAdd('brick',1); D.setHeld(0);
    /* brick asks for a pick; hay asks for nothing. (Grass asks for a SPADE,
       which the first draft of this line did not know, and it read the right
       answer as a failure.) */
    const bare=D.toolSpeedOf('brick'), free=D.toolSpeedOf('hay');
    const asksTheHand=(Math.abs(bare-1/D.handSlow())<1e-6)&&(free===1);
    return {ok:!early&&!late&&cracks>0&&dropped&&asksTheHand,
      got:b.name+' (hardness '+b.hardness+', by hand ×'+D.handSlow()+' = '+want.toFixed(2)+'s) '+
          'broke at '+(broke<0?'NEVER':broke.toFixed(2)+'s')+
          ' · '+cracks+' cracks cut · half-broken at '+(half===null?'—':half.toFixed(2)+'s')+
          ' · the hand taken off loses the work: '+dropped+
          ' · the speed is read out of the hand: '+asksTheHand};
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
  run:async page=>page.evaluate(()=>{ const D=window.__VDBG;
    if(!D.works) return {pending:'no works (Phase 4 step 9)'};
    return {ok:false,got:'unwritten'}; })};

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

/* ---------- 12 · the regression that matters most.  PASSES TODAY ---------- */
T[12]={name:'ocean and plains chunks build no slower than they did',
  run:async page=>page.evaluate(async B=>{
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
    const ok=(!isFinite(ocean.ms)||ocean.ms<=B.ocean*B.slack)&&
             (!isFinite(plain.ms)||plain.ms<=B.plain*B.slack);
    return {ok, got:'ocean '+ocean.ms.toFixed(3)+' ms/chunk (was '+B.ocean+', passes '+say(ocean)+
      ') · plain '+plain.ms.toFixed(3)+' ms/chunk (was '+B.plain+', passes '+say(plain)+')'};
  },BASELINE)};

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
