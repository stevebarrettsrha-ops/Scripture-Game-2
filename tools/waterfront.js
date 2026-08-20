/* ============================================================
   THE FRONT A FALL COMES DOWN IN — the number acceptance test 39 does not take
   ------------------------------------------------------------
     node tools/waterfront.js                 the three falls, as test 39 picks them
     node tools/waterfront.js --fall Angel    one fall by name

   WHY THIS EXISTS. Test 39 asks whether a fall POURS, STAYS and SETTLES, and
   those three are the flood's own symptoms — but A CURTAIN DOES ALL THREE. A
   spring that comes over the brink on a front eighty columns wide pours, stays
   inside its gorge and settles perfectly well; it is simply not a waterfall.
   The two faults this tool was built to measure both widen that front and
   neither moves the three questions test 39 asks:

     an air cell PULLS water into itself, going round the back of the
       shortest-way-down weights that make a stream a stream;
     a way down STOPS COUNTING as one the moment water stands in it, so a
       source whose own way down is occupied turns and feeds the lip instead.

   HOW IT MEASURES, and it is test 39's own method on purpose — the same three
   falls chosen BY FORM and not by name, the same heads out of
   WATERFALL.springs, the same WATER.step(0.25) beaten until the total stops
   moving, and the same attribution of every cell to the fall it is NEAREST to
   (with the springs live, the engine keeps a fall running wherever the
   traveller stands, and that water is nobody's business here).

   WATER.step(0.25) is exactly one tick with exactly the budget the game gives
   it, and the water does not need the mesher: blockAt answers procedurally
   whether a chunk is built or not. A fall that wants six hundred ticks to
   settle costs seconds instead of half an hour of software-rendered frames.
============================================================ */
const {open,sail}=require('./harness.js');

function arg(k,d){ const i=process.argv.indexOf('--'+k);
  return i>=0&&process.argv[i+1]!==undefined?process.argv[i+1]:d; }

(async()=>{
  const only=arg('fall',null);
  const {browser,page,errs}=await open({});
  try{
    await sail(page);
    const rows=await page.evaluate(async o=>{
      const D=window.__VDBG, B=D.B;
      if(!window.WATER||!window.WATERFALL) return [{err:'no falling water in this build'}];
      const list=window.WATERFALL.list();
      if(!list||!list.length) return [{err:'no falls in world/waterfalls.js'}];
      /* the same three test 39 takes, and for the same reasons: the tallest
         plunge (whose brink is not its origin), the widest cataract (the most
         heads), the tallest tiered stair (which lands and lands again) */
      const pick=(form,by)=>list.filter(f=>f.form===form).sort((a,b)=>by(b)-by(a))[0];
      const chosen=o.only
        ? list.filter(f=>f.n.toLowerCase().indexOf(String(o.only).toLowerCase())>=0)
        : [pick('plunge',f=>f.drop),pick('cataract',f=>f.half),
           pick('tiered',f=>f.drop)].filter(Boolean);
      const whose=(ix,iz)=>{ let best=null,bd=1e18;
        for(const g of list){ const d=(ix*B-g.x)**2+(iz*B-g.z)**2; if(d<bd){ bd=d; best=g; } }
        return best; };
      const out=[];
      for(const f of chosen){
        const wx=(u,v)=>f.x+(u*f.cs+v*f.sn)*B, wz=(u,v)=>f.z+(-u*f.sn+v*f.cs)*B;
        const ground=(u,v)=>{ const c=D.landAtWorld(wx(u,v),wz(u,v)); return c?c.h:null; };
        const lip=ground(0,-1)||0;
        const heads=[];
        for(const [x,z] of window.WATERFALL.springs(f)){
          const c=D.landAtWorld(x,z); if(!c) continue;
          const ix=Math.floor(x/B), iz=Math.floor(z/B);
          if(window.WATER.spill(ix,c.h,iz)) heads.push([ix,c.h,iz]);
        }
        if(!heads.length){ out.push({n:f.n,err:'no head could be laid'}); continue; }
        const mine=()=>window.WATER.serialise().filter(s=>{
          const p=s.slice(0,s.lastIndexOf(':')).split(',');
          return whose(+p[0],+p[2])===f; });
        /* beaten until the standing total stops moving — test 39's own
           tolerance, because a live flow is water arriving and water being
           taken at the same rate and the tip of a column flickers */
        let prev=-1, still=0, t=0;
        for(t=1;t<=6000;t++){
          window.WATER.step(0.25);
          if(t%50===0) await new Promise(r=>setTimeout(r,0));
          if(t%100===0){ const c=mine().length;
            if(prev>=0&&Math.abs(c-prev)<=Math.max(20,prev*0.02)) still++; else still=0;
            prev=c; if(still>=2) break; }
        }
        /* ---- THE CENSUS, AND THE FRONT IS THE POINT OF IT ---- */
        const standing=mine();
        const cols=new Set(); let u0=1e9,u1=-1e9, falling=0, far=0;
        for(const s of standing){
          const i=s.lastIndexOf(':'), p=s.slice(0,i).split(',');
          const ix=+p[0], iy=+p[1], iz=+p[2], lev=+s.slice(i+1);
          const dx=ix*B-f.x, dz=iz*B-f.z;
          const u=(dx*f.cs-dz*f.sn)/B;
          const d=Math.hypot(dx,dz)/B; if(d>far) far=d;
          /* THE FRONT is the falling water only: a wide pool at the foot is a
             plunge basin and is right, a wide sheet IN THE AIR is a curtain */
          if(lev===8){ falling++; cols.add(ix+','+iz);
            if(u<u0) u0=u; if(u>u1) u1=u; }
        }
        /* and that it still pours: water in the shaft between foot and lip */
        let shaft=0;
        const brink=Math.max(0,Math.floor(f.F.under*f.drop));
        for(let v=brink;v<=brink+4;v++) for(let u=-f.half;u<=f.half;u++){
          const ix=Math.floor(wx(u,v)/B), iz=Math.floor(wz(u,v)/B);
          for(let iy=lip-1;iy>lip-f.drop;iy--)
            if(window.WATER.levelAt(ix,iy,iz)!==null) shaft++;
        }
        /* ---- AND WHETHER IT IS REALLY AT REST, WHICH A COUNT CANNOT SAY ----
           main's whole design for the flow rests on one promise: "a settled
           fall costs nothing at all until a hand or the ground disturbs it".
           A count that has stopped moving does NOT prove that — a cell that is
           laid and taken up again every tick holds the total perfectly still
           while working the queue for ever. So the queue itself is read, and
           the laying and the drying counted over a hundred further ticks. */
        const s0=window.WATER.stats();
        for(let k=0;k<100;k++) window.WATER.step(0.25);
        const s1=window.WATER.stats();
        const churn={queue:s1.waiting, laid:s1.moved-s0.moved, dried:s1.dried-s0.dried};

        /* and it is taken up again, so the fall after this one is measured in
           a world this one did not leave wet */
        for(const h of heads) window.WATER.take(h[0],h[1],h[2]);
        for(let k=0;k<4000;k++){ window.WATER.step(0.25);
          if(k%50===0){ await new Promise(r=>setTimeout(r,0)); if(!mine().length) break; } }
        out.push({n:f.n, form:f.form, drop:f.drop, half:f.half, heads:heads.length,
                  held:standing.length, falling, cols:cols.size,
                  span:(cols.size?Math.round(u1-u0)+1:0), shaft,
                  far:Math.round(far), claim:Math.round(f.half+f.run+16),
                  ticks:t, churn, left:mine().length});
      }
      return out;
    },{only});
    console.log('');
    for(const r of rows){
      if(r.err){ console.log((r.n||'?')+' — '+r.err); continue; }
      console.log(r.n);
      console.log('   '+r.form+', drop '+r.drop+', half-lip '+r.half+', '+r.heads+' head'+(r.heads===1?'':'s'));
      console.log('   THE FRONT   '+r.cols+' columns of falling water, '+r.span+
                  ' blocks across the lip   ('+r.falling+' falling cells)');
      console.log('   standing    '+r.held+' cells · '+r.shaft+' in the shaft · furthest '+
                  r.far+' of a claim of '+r.claim);
      console.log('   settled in  '+r.ticks+' ticks · drained to '+r.left);
      console.log('   AT REST?    queue '+r.churn.queue+' · over 100 further ticks it laid '+
                  r.churn.laid+' and dried '+r.churn.dried);
      console.log('');
    }
    const bad=[...new Set(errs)].filter(e=>!/ERR_TUNNEL|favicon/i.test(e));
    if(bad.length) console.log('PAGE ERRORS: '+bad.slice(0,3).join(' | '));
  }finally{ await browser.close(); }
})().catch(e=>{ console.error(e); process.exit(1); });
