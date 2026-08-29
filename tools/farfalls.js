/* THE FAR FALLS — §16's owed question, measured before it is answered.

   "Five of the great plunges find no water within their claim and end in a
    basin. Whether they should reach further — a channel of a hundred blocks
    to the nearest river, with the grade that implies — is a question about
    how much ground a fall may be allowed to reshape, and it wants a picture
    before it wants a number."

   This is the number AND the picture. For every fall the outfall search
   left basin-bound, three things are read:

     1. HOW FAR the nearest water truly lies — the same raster answer the
        outfall search reads (river, sea, dry), swept in a full circle out
        to 400 blocks, so the verdict knows whether a channel would be a
        cut or a county.
     2. WHETHER THE BASIN HOLDS — the fall is sprung and beaten to
        stillness exactly as acceptance test 39 does, and the standing
        water is asked whether any cell of it lies outside the fall's own
        claim. A bounded basin is a lake; an unbounded one is a defect.
     3. THE PICTURE — the tallest far fall's foot, shot at noon.

   node tools/farfalls.js [out.png]
*/
const {open,sail,holdClock,shot}=require(__dirname+'/harness.js');
(async()=>{
  const {browser,page}=await open({});
  try{
    await sail(page,true);
    const out=await page.evaluate(async()=>{
      const D=window.__VDBG, B=D.B;
      if(!window.WATER||!window.WATERFALL) return {err:'no falling water'};
      const list=WATERFALL.list();
      const rep=[];
      /* a cell belongs to the fall it is nearest to — test 39's own rule */
      const whose=(ix,iz)=>{ let best=null,bd=1e18;
        for(const g of list){ const d=(ix*B-g.x)**2+(iz*B-g.z)**2; if(d<bd){ bd=d; best=g; } }
        return best; };
      for(const f of list){
        const o=WATERFALL.outfall(f);
        if(o){ rep.push({n:f.n,form:f.form,drop:f.drop,out:o.kind,d:o.d}); continue; }
        /* 1 · the nearest true water, full circle, out to 400 blocks */
        let near=null;
        for(let r=0;r<24;r++){
          const a=r/24*Math.PI*2, su=Math.sin(a), sv=Math.cos(a);
          for(let d=f.poolV+2;d<=400;d+=2){
            const u=su*d, v=sv*d;
            const x=f.x+(u*f.cs+v*f.sn)*B, z=f.z+(-u*f.sn+v*f.cs)*B;
            const w=D.outWater(Math.floor(x/B),Math.floor(z/B));
            if(!w) continue;
            if(!near||d<near.d) near={d,kind:w===1?'river':'sea'};
            break;
          }
        }
        /* 2 · sprung, settled, and asked whether the basin holds */
        const heads=[];
        for(const [x,z] of WATERFALL.springs(f)){
          const c=D.landAtWorld(x,z); if(!c) continue;
          const ix=Math.floor(x/B), iz=Math.floor(z/B);
          if(WATER.spill(ix,c.h,iz)) heads.push([ix,c.h,iz]);
        }
        const mine=()=>WATER.serialise().filter(s=>{
          const p=s.slice(0,s.lastIndexOf(':')).split(',');
          return whose(+p[0],+p[2])===f; });
        let prev=-1, still=0;
        for(let t=0;t<4000&&still<40;t++){ WATER.step(0.25);
          if(t%25===0){ const n=mine().length;
            still=(n===prev)?still+25:0; prev=n;
            await new Promise(r=>setTimeout(r,0)); } }
        let outside=0, farthest=0;
        const cells=mine();
        for(const s of cells){ const p=s.slice(0,s.lastIndexOf(':')).split(',');
          const dx=+p[0]*B-f.x, dz=+p[2]*B-f.z;
          const dd=Math.max(Math.abs(dx),Math.abs(dz));
          if(dd>farthest) farthest=dd;
          if(Math.abs(dx)>f.R||Math.abs(dz)>f.R) outside++; }
        rep.push({n:f.n,form:f.form,drop:f.drop,out:null,
          claimR:Math.round(f.R/B),
          nearest:near?near.d+' blocks ('+near.kind+')':'NONE within 400 blocks',
          standing:cells.length, outside,
          farthest:Math.round(farthest/B)+' blocks'});
        /* and the world left as found: the heads taken up, the water drained */
        for(const h of heads) WATER.take(h[0],h[1],h[2]);
        for(let t=0;t<4000&&mine().length;t++){ WATER.step(0.25);
          if(t%50===0) await new Promise(r=>setTimeout(r,0)); }
      }
      return {rep};
    });
    console.log(JSON.stringify(out,null,1));
    /* 3 · the picture: the tallest basin-bound fall's foot, at noon */
    const far=(out.rep||[]).filter(r=>!r.out).sort((a,b)=>b.drop-a.drop)[0];
    if(far){
      await page.evaluate(async name=>{
        const D=window.__VDBG, B=D.B;
        const f=WATERFALL.list().find(g=>g.n===name);
        /* stand a little downstream of the pool, looking back at the wall */
        const x=f.x+(0*f.cs+(f.poolV+9)*f.sn)*B, z=f.z+(-0*f.sn+(f.poolV+9)*f.cs)*B;
        D.setMode('walk'); D.state.walk.x=x; D.state.walk.z=z;
        D.state.walk.feetY=undefined; D.state.camYaw=Math.atan2(f.x-x,f.z-z)+Math.PI;
        for(let k=0;k<60;k++){ D.updateChunks(x,z,500);
          await new Promise(r=>requestAnimationFrame(r)); }
        D.updateFalls&&D.updateFalls(x,z);
        for(let k=0;k<600;k++) await new Promise(r=>requestAnimationFrame(r));
      },far.n);
      await holdClock(page,'noon');
      await page.waitForTimeout(1200);
      await shot(page, process.argv[2]||'farfall.png');
      console.log('shot: '+far.n+' -> '+(process.argv[2]||'farfall.png'));
    }
  } finally { await browser.close(); }
})();
