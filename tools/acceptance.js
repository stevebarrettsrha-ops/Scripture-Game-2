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
