/* THE SKY, SIDE BY SIDE — the old flat sky and the vault (js/engine.js, THE VAULT OF THE SKY),
   at the same place and hour, the eye turned toward the sun and then away from it.

     node tools/sky-shots.js <outDir> [land]

   The hours are not guessed: the sun's own height is read at the station, and dawn and dusk are
   the hours where the day is half come (dayF about 0.42) — the sun on the rim of the earth. */
const {open,sail,holdClock}=require('./harness.js');
const fs=require('fs'), path=require('path');
(async()=>{
  const out=process.argv[2]||'sky-shots', land=process.argv[3]||'Yasharal';
  fs.mkdirSync(out,{recursive:true});
  const {browser,page,errs}=await open({w:1100,h:640});
  try{
    await sail(page,true); await holdClock(page);
    await page.evaluate(async L=>{ const D=window.__VDBG, W=window.__WORLD, sites=W.sites();
      let site=null; for(let i=0;i<sites.length;i++) if(sites[i]&&D.COUNTRIES[i].n===L){ site=sites[i]; break; }
      D.state.walk.x=site.x+40; D.state.walk.z=site.z-300; D.state.walk.feetY=undefined; D.state.walk.vy=0;
      D.setMode('walk'); for(let k=0;k<40;k++){ D.updateChunks(D.state.walk.x,D.state.walk.z,400); await new Promise(r=>requestAnimationFrame(r)); } },land);
    const frames=n=>page.evaluate(async n=>{ for(let k=0;k<n;k++) await new Promise(r=>requestAnimationFrame(r)); },n);
    /* the hour where the day is `want` come, between a and b */
    const findHour=async(a,b,want)=>page.evaluate(async([a,b,want])=>{ const D=window.__VDBG, S=window.__SKYDOME; let best=a, bd=9;
      for(let h=a;h<=b;h+=0.1){ D.setLocalHour(h); for(let k=0;k<2;k++) await new Promise(r=>requestAnimationFrame(r));
        const d=Math.abs(S.dayF-want); if(d<bd){ bd=d; best=h; } } return best; },[a,b,want]);
    const dawn=await findHour(3,10,0.42), dusk=await findHour(14,21.5,0.42);
    const HOURS=[['dawn',dawn],['noon',12],['dusk',dusk],['dusk-later',dusk+0.35],['night',dusk+3.5]];
    console.log('hours',JSON.stringify(HOURS));
    for(const [n,h] of HOURS){
      for(const face of ['sun','away']){
        await page.evaluate(async([h,face])=>{ const D=window.__VDBG, S=window.__SKYDOME; D.setLocalHour(h);
          for(let k=0;k<3;k++) await new Promise(r=>requestAnimationFrame(r));
          /* turn the eye to the sun (or from it): try the yaws round and keep the one that looks most toward it */
          const sd=S.mesh.material.uniforms.uSunDir.value;
          let best=0, bv=-9; D.state.camPitch=0.12;
          for(let y=0;y<6.283;y+=0.2618){ D.state.camYaw=y; await new Promise(r=>requestAnimationFrame(r));
            const f=window.__camForward();
            const v=(f.x*sd.x+f.z*sd.z)/Math.max(1e-6,Math.hypot(f.x,f.z)*Math.hypot(sd.x,sd.z))*(face==='sun'?1:-1); if(v>bv){ bv=v; best=y; } }
          D.state.camYaw=best; for(let k=0;k<4;k++) await new Promise(r=>requestAnimationFrame(r)); },[h,face]);
        for(const mode of ['old','vault']){
          await page.evaluate(m=>{ window.__SKYDOME.off=(m==='old'); },mode);
          await frames(3);
          await page.screenshot({path:path.join(out,`${n}-${face}-${mode}.png`)});
          console.log(n,face,mode,'h',h.toFixed(2)); } } }
    await page.evaluate(()=>{ window.__SKYDOME.off=false; });
  }finally{ console.log('ERRS',JSON.stringify(errs.slice(0,6).map(e=>e.slice(0,200)))); await browser.close(); }
})().catch(e=>{ console.error(e); process.exit(1); });
