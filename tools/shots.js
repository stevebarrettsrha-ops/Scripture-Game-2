/* THE SHOTS — the world seen from a few fixed stations, so that a change to
   the look of it can be set side by side with what stood before, and so
   that what it COSTS is measured and not guessed at.

     node tools/shots.js <outDir> [tag]

   Each station reports the mean and the worst frame over two hundred
   frames, standing still on the same ground at the same hour. Beauty that
   halves the frame rate is not beauty; this is where that is caught. */
const {open,sail,shot}=require('./harness.js');
const fs=require('fs'), path=require('path');
/* each station: a land to stand in, and what it is there to show */
const STATIONS=[
  {n:'village',  land:'Yasharal',        of:'a village at noon — cobble, plaster, thatch'},
  {n:'lebanon',  land:'Lebanon',         of:'the cedar coast and the terraces'},
  {n:'sahara',   land:'Algeria',         of:'open sand — the dullest ground in the world'},
  {n:'congo',    land:'Dem. Rep. Congo', of:'closed rain forest — the heaviest'},
  {n:'alps',     land:'Switzerland',     of:'rock, scree and snow on the heights'},
  {n:'iceland',  land:'Iceland',         of:'cold coast and open water'}
];
(async()=>{
  const out=process.argv[2]||'shots', tag=process.argv[3]||'';
  fs.mkdirSync(out,{recursive:true});
  const {browser,page,errs}=await open({});
  await sail(page,true);
  const report=[];
  for(const st of STATIONS){
    const res=await page.evaluate(async S=>{
      const D=window.__VDBG, W=window.__WORLD;
      const sites=W.sites();
      let site=null;
      for(let i=0;i<sites.length;i++){ if(sites[i]&&D.COUNTRIES[i].n===S.land){ site=sites[i]; break; } }
      if(!site) return null;
      /* the hour must be PINNED — left on 'live' the machine's own clock is
         read back every frame and the world is dark whenever the box is */
      const idx=D.DAYPARTS.findIndex(d=>d.k==='noon');
      if(idx>=0) D.state.dayIdx=idx;
      D.state.walk.x=site.x; D.state.walk.z=site.z-60; D.state.walk.heading=0;
      D.state.walk.feetY=undefined; D.state.walk.vy=0;
      D.setMode('walk');
      D.applyDayPart();                       /* noon HERE, wherever here is */
      for(let k=0;k<40;k++){ D.updateChunks(site.x,site.z,400); await new Promise(r=>requestAnimationFrame(r)); }
      /* and now stand still, and time two hundred frames of it */
      const t=[]; let last=performance.now();
      for(let k=0;k<200;k++){ await new Promise(r=>requestAnimationFrame(r));
        const now=performance.now(); t.push(now-last); last=now; }
      t.sort((a,b)=>a-b);
      const mean=t.reduce((a,b)=>a+b,0)/t.length;
      return { ms:+mean.toFixed(2), p95:+t[Math.floor(t.length*0.95)].toFixed(2),
        tris:D.renderer.info.render.triangles, calls:D.renderer.info.render.calls,
        textures:D.renderer.info.memory.textures };
    },st);
    if(!res){ report.push(st.n+': NO SITE'); continue; }
    await shot(page,path.join(out,st.n+(tag?'-'+tag:'')+'.png'));
    report.push(st.n.padEnd(9)+' '+String(res.ms).padStart(6)+' ms mean · '+
      String(res.p95).padStart(6)+' ms p95 · '+String(res.tris).padStart(7)+' tris · '+
      String(res.calls).padStart(5)+' calls   ('+st.of+')');
  }
  console.log(report.join('\n'));
  const tex=await page.evaluate(()=>window.__VDBG.renderer.info.memory.textures);
  console.log('textures resident: '+tex);
  if(errs.length) console.log('ERRORS:',[...new Set(errs)].slice(0,8));
  await browser.close();
})();
