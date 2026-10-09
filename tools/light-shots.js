/* THE TWO GREAT LIGHTS, SEEN — the sun and the moon from the ground (facing each), from the air
   (Rise up), in the firmament view and over the whole earth.

     node tools/light-shots.js <outDir> [land] */
const {open,sail,holdClock}=require('./harness.js');
const fs=require('fs'), path=require('path');
(async()=>{
  const out=process.argv[2]||'light-shots', land=process.argv[3]||'Yasharal';
  fs.mkdirSync(out,{recursive:true});
  const {browser,page,errs}=await open({w:1100,h:640});
  const frames=n=>page.evaluate(async n=>{ for(let k=0;k<n;k++) await new Promise(r=>requestAnimationFrame(r)); },n);
  const snap=async n=>{ await page.screenshot({path:path.join(out,n+'.png')}); console.log(n); };
  try{
    await sail(page,true); await holdClock(page);
    await page.evaluate(async L=>{ const D=window.__VDBG, W=window.__WORLD, sites=W.sites();
      let site=null; for(let i=0;i<sites.length;i++) if(sites[i]&&D.COUNTRIES[i].n===L){ site=sites[i]; break; }
      D.state.walk.x=site.x+40; D.state.walk.z=site.z-300; D.state.walk.feetY=undefined; D.state.walk.vy=0;
      D.setMode('walk'); for(let k=0;k<40;k++){ D.updateChunks(D.state.walk.x,D.state.walk.z,400); await new Promise(r=>requestAnimationFrame(r)); } },land);
    /* the hour, then the eye turned toward one of the lights and lifted toward it */
    const look=async(h,which,pitch)=>page.evaluate(async([h,which,pitch])=>{ const D=window.__VDBG, K=window.__WORLD; D.setLocalHour(h);
      for(let k=0;k<3;k++) await new Promise(r=>requestAnimationFrame(r));
      const L=which==='sun'?K.sun:K.moon; let best=0, bv=-9; D.state.camPitch=pitch;
      for(let y=0;y<6.283;y+=0.1309){ D.state.camYaw=y; await new Promise(r=>requestAnimationFrame(r));
        const f=window.__camForward(), c=window.__camPos(), dx=L.position.x-c.x, dz=L.position.z-c.z;
        const v=(f.x*dx+f.z*dz)/Math.max(1e-6,Math.hypot(f.x,f.z)*Math.hypot(dx,dz)); if(v>bv){ bv=v; best=y; } }
      D.state.camYaw=best; for(let k=0;k<5;k++) await new Promise(r=>requestAnimationFrame(r)); },[h,which,pitch]);
    /* the hours where the day is a little after dawn, and night */
    const findHour=async(a,b,want)=>page.evaluate(async([a,b,want])=>{ const D=window.__VDBG, S=window.__SKYDOME; let best=a, bd=9;
      for(let h=a;h<=b;h+=0.1){ D.setLocalHour(h); for(let k=0;k<2;k++) await new Promise(r=>requestAnimationFrame(r));
        const d=Math.abs(S.dayF-want); if(d<bd){ bd=d; best=h; } } return best; },[a,b,want]);
    const dusk=await findHour(14,21.5,0.5);
    await look(dusk-0.6,'sun',0.02); await snap('ground-sun-afternoon');
    await look(dusk,'sun',-0.05); await snap('ground-sun-setting');
    /* the moon: the hour of the night when she stands highest over this place */
    const mh=await page.evaluate(async()=>{ const D=window.__VDBG, K=window.__WORLD; let best=0, by=-1e9;
      for(let h=0;h<24;h+=0.5){ D.setLocalHour(h); for(let k=0;k<2;k++) await new Promise(r=>requestAnimationFrame(r));
        if(window.__SKYDOME.dayF<0.05&&K.moon.position.y>by&&K.moon.material.opacity>0.2){ by=K.moon.position.y; best=h; } } return best; });
    await look(mh,'moon',-0.2); await snap('ground-moon-night');
    /* up into the air, toward the sun of the afternoon */
    await look(dusk-0.6,'sun',0.02);
    await page.evaluate(()=>document.getElementById('b-fly').click()); await page.waitForTimeout(6000);
    await page.evaluate(async()=>{ const D=window.__VDBG; if(D.state.fly) D.state.fly.y=(D.state.fly.y||0)+400; for(let k=0;k<20;k++) await new Promise(r=>requestAnimationFrame(r)); });
    await look(dusk-0.6,'sun',0.0); await snap('air-sun');
    await page.evaluate(()=>document.getElementById('b-fly').click()); await page.waitForTimeout(3000);
    /* the firmament, and the whole earth */
    await page.evaluate(()=>document.getElementById('b-firm').click()); await page.waitForTimeout(8000); await snap('firmament');
    await page.evaluate(()=>document.getElementById('b-firm').click()); await page.waitForTimeout(4000);
    await page.evaluate(()=>document.getElementById('b-map').click()); await page.waitForTimeout(8000); await snap('whole-earth');
  }finally{ console.log('ERRS',JSON.stringify(errs.slice(0,6).map(e=>e.slice(0,200)))); await browser.close(); }
})().catch(e=>{ console.error(e); process.exit(1); });
