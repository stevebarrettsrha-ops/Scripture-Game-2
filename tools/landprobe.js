/* ============================================================
   THE LAND PROBE — Phase D's own proof: "prices are compared by land"
   ------------------------------------------------------------
     node tools/landprobe.js                      the true earth: the table, then each land visited
     node tools/landprobe.js --shots <dir>        and the workshops and a stall photographed
     EARTH=1 node tools/landprobe.js              the same on the small map (quicker, for a first look)

   WHAT IT ASKS. Every land was the same land with another coast, and its
   market a throw of the dice: the purple of Tsor dearer in Tsor than in
   Norway, the cedar of Leḇanon cheaper on the rivers of Baḇal than under the
   trees. Phase D gave each land its own data (world/lands.js), its own yards
   (world/workshops.js) and its own prices (js/lands.js). This boots the game
   on the earth it is asked for, reads every market's asking price for the
   eight goods that tell the lands apart, and says plainly for each whether it
   is cheapest where it is made and dearest where it is wanted. Then it walks
   into a town of each land, as the traveller would, and reads off who lives
   there, what they work at, what is on the stalls, what is in the pens and
   which workshops stand at the edge — so a "Yoram" in Japan is seen, not
   assumed away.

   WHAT IT DOES NOT DO. It judges nothing about how a workshop LOOKS; that is
   what --shots is for, and the pictures must be looked at.
============================================================ */
const {open,holdClock}=require('./harness.js');
const fs=require('fs'), path=require('path');
function arg(k,d){ const i=process.argv.indexOf('--'+k); return i>=0&&process.argv[i+1]!==undefined?process.argv[i+1]:d; }
const LANDS=['Lebanon','Egypt','Yasharal','Iraq','Greece','Norway','Japan','Yemen'];
const GOODS=['dye','cedar','linen','glass','oil','copper','incense','bitumen'];
/* the pictures: a land, the workshop of it to stand in, and the file */
/* (each costs minutes of software-drawn frames on a loaded machine, so only these; --all for the rest) */
const SHOTS=[
  {land:'Lebanon',  shop:'dye-works',     file:'tsor-dye-works.png'},
  {land:'Lebanon',  stall:true,           file:'tsor-market-stall.png'},
  {land:'Lebanon',  shop:'glass-furnace', file:'tsidon-glass-furnace.png'},
  {land:'Lebanon',  shop:'cedar-camp',    file:'lebanon-cedar-camp.png', more:true},
  {land:'Egypt',    shop:'linen-works',   file:'mitsrayim-linen-works.png'},
  {land:'Egypt',    shop:'papyrus',       file:'mitsrayim-papyrus.png', more:true},
  {land:'Yasharal', shop:'olive-press',   file:'yasharal-olive-press.png'},
  {land:'Yasharal', shop:'wine-press',    file:'yasharal-wine-press.png', more:true},
  {land:'Iraq',     shop:'brick-kiln',    file:'babal-brick-kiln.png'},
  {land:'Iraq',     shop:'bitumen-pit',   file:'babal-bitumen-pit.png'},
  {land:'Yemen',    shop:'incense-store', file:'sheba-incense-store.png'},
  {land:'Yemen',    stall:true,           file:'sheba-market-stall.png', more:true}
].filter(s=>!s.more||process.argv.includes('--all'));

(async()=>{
  const shotDir=arg('shots',null), earth=process.env.EARTH||'true';
  if(shotDir) fs.mkdirSync(shotDir,{recursive:true});
  const T0=Date.now(), el=()=>((Date.now()-T0)/60000).toFixed(1)+' min';
  const {browser,page,errs}=await open({page:'index.html',inject:{worldK:earth},w:1280,h:720,gotoTimeout:1800000});
  try{
    page.setDefaultTimeout(3600000);
    await page.waitForFunction(()=>window.__VDBG&&document.getElementById('menu')&&
      getComputedStyle(document.getElementById('menu')).display!=='none',null,{timeout:3600000});
    await page.evaluate(()=>{ const b=document.getElementById('m-roam')||document.getElementById('m-new'); b.click();
      const c=document.getElementById('mc-anew'); if(c&&getComputedStyle(document.getElementById('m-confirm')).display!=='none') c.click(); });
    await page.waitForFunction(()=>window.__VDBG&&window.__VDBG.state&&window.__VDBG.state.begun!==false&&
      getComputedStyle(document.getElementById('boot')).display==='none',null,{timeout:3600000});
    await holdClock(page,'noon');
    console.log('the world stands ('+(earth==='true'?'the true earth':'the map at '+earth)+') after '+el());

    /* ---------------- 1 · THE PRICES, LAND BY LAND ---------------- */
    const T=await page.evaluate(({L,G})=>{ const D=window.__VDBG, C=window.EARTH.list, LA=window.LANDS;
      const rows=L.map(n=>{ const ci=C.findIndex(c=>c.n===n); const M=D.marketAt(ci);
        const by={}; for(const g of M.goods) by[g.k]=g.buy;
        const E=LA.of(n)||{};
        return {n,ci,old:LA.oldName(n),makes:E.makes||[],wants:E.wants||[],price:G.map(k=>by[k])}; });
      /* and each good asked of every land of the earth: where is it cheapest, where dearest */
      const all={}; for(const k of G){ let lo=null,hi=null;
        for(let ci=0;ci<C.length;ci++){ const p=D.marketAt(ci).goods.find(g=>g.k===k).buy;
          if(!lo||p<lo.p) lo={p,n:C[ci].n}; if(!hi||p>hi.p) hi={p,n:C[ci].n}; }
        all[k]={lo,hi}; }
      return {rows,all}; },{L:LANDS,G:GOODS});
    const pad=(s,n)=>String(s).padStart(n);
    console.log('\nWHAT EACH GOOD COSTS TO BUY, IN SHEKELS, LAND BY LAND (* made here, ! wanted here)');
    console.log(''.padEnd(26)+GOODS.map(k=>pad(k,9)).join(''));
    for(const r of T.rows) console.log((r.n+(r.old?' ('+r.old+')':'')).slice(0,25).padEnd(26)+
      r.price.map((p,j)=>pad(p+(r.makes.includes(GOODS[j])?'*':r.wants.includes(GOODS[j])?'!':' '),9)).join(''));
    /* the law, read off the table: every maker under every land that does not make it, every wanter over */
    const faults=[];
    for(let j=0;j<GOODS.length;j++){ const k=GOODS[j];
      const mk=T.rows.filter(r=>r.makes.includes(k)), wt=T.rows.filter(r=>r.wants.includes(k)), rest=T.rows.filter(r=>!r.makes.includes(k));
      for(const m of mk) for(const o of rest) if(m.price[j]>=o.price[j]) faults.push(k+': '+m.n+' makes it at '+m.price[j]+' yet '+o.n+' asks only '+o.price[j]);
      for(const w of wt) for(const o of T.rows) if(o!==w&&!o.wants.includes(k)&&w.price[j]<=o.price[j]) faults.push(k+': '+w.n+' wants it at '+w.price[j]+' yet '+o.n+' asks '+o.price[j]); }
    console.log('\nover the whole earth (all '+(await page.evaluate(()=>window.EARTH.list.length))+' lands):');
    for(const k of GOODS) console.log('  '+k.padEnd(8)+' cheapest '+T.all[k].lo.p+' in '+T.all[k].lo.n+', dearest '+T.all[k].hi.p+' in '+T.all[k].hi.n);
    const tr=T.rows, at=(n,k)=>tr.find(r=>r.n===n).price[GOODS.indexOf(k)];
    console.log('\nthe two faults the roadmap named:');
    console.log('  purple dye: Tsor '+at('Lebanon','dye')+' against Norway '+at('Norway','dye')+(at('Lebanon','dye')<at('Norway','dye')?'  — cheap where it is made':'  — STILL WRONG'));
    console.log('  cedar:      Leḇanon '+at('Lebanon','cedar')+' against Baḇal '+at('Iraq','cedar')+(at('Lebanon','cedar')<at('Iraq','cedar')?'  — dear where it is wanted':'  — STILL WRONG'));
    console.log(faults.length?'\nFAULTS ('+faults.length+'):\n  '+faults.join('\n  '):'\nno fault: in these lands every good is cheapest where it is made and dearest where it is wanted');

    /* ---------------- 2 · EACH LAND, WALKED INTO ---------------- */
    const taken=new Set();
    const shoot=async land=>{ for(const S of SHOTS.filter(s=>s.land===land&&!taken.has(s.file))){
        const r=await shotOf(S);
        if(r.none) continue;
        await page.screenshot({path:path.join(shotDir,S.file),timeout:600000}); taken.add(S.file);
        console.log('  shot '+S.file+' at '+r.at+' ('+r.secs+' s)'+(r.workers&&r.workers.length?' — '+r.workers.map(w=>w.n+' the '+w.role+' '+(w.abed?'abed':w.anim+', '+w.d+' from the work')).join('; '):'')); } };
    const visit=async(land,town,hour)=>page.evaluate(async({land,town,hour})=>{
      const D=window.__VDBG, K=window.__KIT, W=window.__WORLD, S=K.sites(), C=window.EARTH.list;
      const raf=()=>new Promise(r=>requestAnimationFrame(r));
      let idx=-1;
      if(town) idx=S.findIndex(s=>s&&(s.name===town));
      else idx=C.findIndex(c=>c.n===land);
      const site=S[idx]; if(!site) return {none:true};
      D.setLocalHour(hour,site.x,site.z);
      D.state.walk.x=site.x+K.B*6; D.state.walk.z=site.z+K.B*6; D.state.walk.feetY=undefined; D.state.walk.vy=0; D.setMode('walk');
      let vv=null, k=0;
      for(;k<9000;k++){ D.updateChunks(D.state.walk.x,D.state.walk.z,400); await raf();
        vv=W.villages().get(idx); if(vv&&!vv.building&&vv.people&&vv.people.length) break; }
      if(!vv||vv.building) return {none:true,frames:k};
      for(let f=0;f<4;f++) await raf();
      const adults=vv.people.filter(p=>!p.child), roles={};
      for(const p of adults) roles[p.role]=(roles[p.role]||0)+1;
      const kinds={}; for(const b of vv.beasts) kinds[b.kind]=(kinds[b.kind]||0)+1;
      const seen=new Set(), names=[];
      for(const p of vv.people){ if(seen.has(p.name)) continue; seen.add(p.name); if(names.length<8&&!p.child) names.push(p.name+' the '+p.role); }
      return {idx,frames:k,name:(site.name||((window.EARTH.cityList||[]).find(c=>c.country===land)||{}).name||land),
        people:vv.people.length,distinct:seen.size, names,roles,kinds,
        wares:window.LANDS.wares(land),
        shops:(vv.shops||[]).map(s=>({k:s.k,name:s.name,hands:s.hands.map(h=>{ const e=vv.people.find(p=>p.shop===h);
          return e?e.name+' the '+e.role+(e._abed?' (abed)':''):'?'; })})),
        mounts:(vv.mounts||[]).map(m=>m.kind).slice(0,3)}; },{land,town,hour});
    const shotOf=async(S)=>page.evaluate(async S=>{
      const D=window.__VDBG, K=window.__KIT, W=window.__WORLD, B=K.B;
      const raf=()=>new Promise(r=>requestAnimationFrame(r));
      let vv=null; for(const [,v] of W.villages()){ if(v.land!==S.land||!v.site||v.building) continue;
        if(S.shop?(v.shops||[]).some(s=>s.k===S.shop):(v.stalls||[]).length){ vv=v; break; } }
      if(!vv) return {none:true};
      let px,pz,tx,tz,dist=64,pitch=0.52;
      if(S.shop){ const s=vv.shops.find(q=>q.k===S.shop);
        const f=[[0,1],[1,0],[0,-1],[-1,0]][s.rot], half=(s.rot%2?s.w:s.d)/2;
        px=s.x+f[0]*(half+B*1.0); pz=s.z+f[1]*(half+B*1.0); tx=s.x; tz=s.z; dist=58; }
      else { const st=vv.stalls[0]; px=st.x; pz=st.z-B*3.4; tx=st.x; tz=st.z; dist=34; pitch=0.36; }
      /* stand there and let the ground under it be laid (standAt waits for the chunk queue), then hold the eye */
      const t0=performance.now();
      D.state.walk.vy=0; await D.standAt(px,pz);
      const aim=()=>{ D.state.walk.heading=Math.atan2(tx-px,tz-pz); D.state.camYaw=0.0; D.state.camPitch=pitch; D.state.camDist=dist;
        D.state.zoom=Math.log(dist/14)/Math.log(K.R_WORLD*1.75/14); };
      aim(); if(D.flushNow) D.flushNow();
      for(let k=0;k<24;k++){ aim(); await raf(); }
      const w=vv.people.filter(p=>p.shop&&S.shop&&vv.shops.find(q=>q.k===S.shop).hands.includes(p.shop))
        .map(p=>({n:p.name,role:p.role,anim:p.anim,abed:!!p._abed,d:Math.round(Math.hypot(p.m.position.x-p.work.x,p.m.position.z-p.work.z))}));
      return {at:[Math.round(px),Math.round(pz)],workers:w,secs:Math.round((performance.now()-t0)/1000)}; },S);

    for(const land of LANDS){
      const v=await visit(land,null,10.5);
      if(v.none){ console.log('\n'+land+': the town would not stand ('+(v.frames||0)+' frames)'); continue; }
      console.log('\n'+land.toUpperCase()+' — '+v.name+' ('+v.people+' souls, '+v.distinct+' names; raised in '+v.frames+' frames, '+el()+')');
      console.log('  folk:   '+v.names.join(', '));
      console.log('  trades: '+Object.entries(v.roles).sort((a,b)=>b[1]-a[1]).map(([r,n])=>r+' '+n).join(', '));
      console.log('  stalls: '+(v.wares?v.wares.join(', '):'(the old goods)')+'    pens: '+Object.entries(v.kinds).map(([k,n])=>k+' '+n).join(', ')+(v.mounts.length?'    rides: '+v.mounts.join(', '):''));
      console.log('  works:  '+(v.shops.length?v.shops.map(s=>s.name+' ('+s.hands.join('; ')+')').join(' · '):'none'));
      if(shotDir) await shoot(land);
    }
    /* Tsiḏon, the glass-house's own town — on the true earth a town of its own */
    { const v=await visit('Lebanon','Tsiḏon',10.5);
      if(v.none) console.log('\nTsiḏon: no town of that name stands on this earth (the glass-house is raised at Tsor)');
      else { console.log('\nTSIḎON ('+v.people+' souls): '+v.names.join(', ')+'\n  works:  '+v.shops.map(s=>s.name+' ('+s.hands.join('; ')+')').join(' · '));
        if(shotDir) await shoot('Lebanon'); } }
    if(shotDir) for(const S of SHOTS) if(!taken.has(S.file)) console.log('  NOT TAKEN: '+S.file+' (no such workshop stood where the probe walked)');
    console.log('\ndone in '+el());
    if(errs.length) console.log('PAGE ERRORS:',[...new Set(errs.map(e=>e.split('\n')[0]))].slice(0,10));
  } finally { await browser.close(); }
})().catch(e=>{ console.error(e); process.exit(1); });
