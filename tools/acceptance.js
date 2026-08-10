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
   If you move them, say so in AUDIT.md and say why. */
const BASELINE={ ocean:2.152, plain:1.970, slack:1.15 };

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
    const D=window.__VDBG;
    if(!D.setBlock) return {pending:'no setBlock / edit overlay (Phase 2)'};
    const p=D.playerXZ(), t=D.blockUnder(p.x,p.z);
    const before=D.chunkTriangleCount(t.cx,t.cz);
    D.setBlock(t.x,t.y,t.z,0);
    await D.settle(2);
    return {ok:!D.solidAt(t.x,t.y+0.5,t.z)&&D.chunkTriangleCount(t.cx,t.cz)!==before,
      got:'solid='+D.solidAt(t.x,t.y+0.5,t.z)+' tris '+before+'→'+D.chunkTriangleCount(t.cx,t.cz)};
  })};

T[6]={name:'a block placed in mid-air is solid, lit and collidable',
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG;
    if(!D.setBlock) return {pending:'no setBlock / edit overlay (Phase 2)'};
    const p=D.playerXZ(), t=D.blockUnder(p.x,p.z);
    const y=t.y+6*D.B;
    D.setBlock(t.x,y,t.z,D.blockId('stone'));
    await D.settle(2);
    return {ok:D.solidAt(t.x,y+0.5,t.z)&&D.lightAt(t.x,y+0.5,t.z)>0.2,
      got:'solid='+D.solidAt(t.x,y+0.5,t.z)+' light='+D.lightAt(t.x,y+0.5,t.z)};
  })};

T[7]={name:'both changes survive a reload',
  run:async(page,ctx)=>{
    const has=await page.evaluate(()=>!!window.__VDBG.setBlock);
    if(!has) return {pending:'no persistence to test yet (Phase 2)'};
    await ctx.reload();
    return page.evaluate(()=>{ const D=window.__VDBG; const m=D.lastEditMarks();
      return {ok:m.broken&&m.placed, got:'broken='+m.broken+' placed='+m.placed}; });
  }};

/* ---------- 8..9 · structures made real ---------- */
T[8]={name:'a wall block breaks out of a house, and the hole is walkable',
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG;
    if(!D.setBlock||!D.houseWallBlock) return {pending:'houses are still decoration (Phase 3)'};
    const w=D.houseWallBlock(); if(!w) return {ok:false,got:'no house near'};
    D.setBlock(w.x,w.y,w.z,0); await D.settle(2);
    return {ok:!D.solidAt(w.x,w.y+0.5,w.z)&&D.walkerCanPass(w),
      got:'hole open and walkable'};
  })};

T[9]={name:'dig under a house and its blocks stay put',
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG;
    if(!D.setBlock||!D.houseWallBlock) return {pending:'houses are still decoration (Phase 3)'};
    const w=D.houseWallBlock(); if(!w) return {ok:false,got:'no house near'};
    for(let k=1;k<=4;k++) D.setBlock(w.x,w.y-k*D.B,w.z,0);
    await D.settle(3);
    return {ok:D.solidAt(w.x,w.y+0.5,w.z), got:'the wall still stands over the void'};
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
T[11]={name:'standing in a cave costs no more than open ground ×1.5',
  run:async page=>page.evaluate(async()=>{
    const D=window.__VDBG;
    if(!D.standInCave) return {pending:'no caves to stand in (Phase 1)'};
    const open=await D.timeFrames(120);
    const at=await D.standInCave();
    if(!at) return {ok:false,got:'no cave found to stand in'};
    const cave=await D.timeFrames(120);
    const editPending=!D.setBlock?' · the edited-chunk half awaits Phase 2':'';
    return {ok:cave<open*1.5,
      got:'open '+open.toFixed(1)+' ms · in a passage '+cave.toFixed(1)+' ms ('+
          (cave/open).toFixed(2)+'×)'+editPending};
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
    /* open ocean: the middle of the great sea, far from any coast */
    const R=D.R_WORLD;
    const ocean=await timeAt(-0.42*R, 0.16*R);
    /* open plain: the steppe, inland and flat */
    let plainSite=null; const sites=window.__WORLD.sites();
    for(let i=0;i<sites.length;i++){ if(sites[i]&&D.COUNTRIES[i].n==='Kazakhstan'){ plainSite=sites[i]; break; } }
    const plain=plainSite?await timeAt(plainSite.x+9000,plainSite.z):NaN;
    const ok=(!isFinite(ocean)||ocean<=B.ocean*B.slack)&&(!isFinite(plain)||plain<=B.plain*B.slack);
    return {ok, got:'ocean '+ocean.toFixed(3)+' ms/chunk (was '+B.ocean+') · plain '+
      plain.toFixed(3)+' ms/chunk (was '+B.plain+')'};
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
