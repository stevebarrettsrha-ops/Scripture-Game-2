/* THE CURTAIN, RE-ASKED OF TODAY'S WATER — §16's last debt, measured.
   ------------------------------------------------------------
     node tools/curtain.js                the three falls of test 39, both ways
     node tools/curtain.js --stride 2     one stride only
     node tools/curtain.js --fall Angel   one fall by name

   THE HISTORY THIS EXISTS TO RETIRE. "A head every other block was tried
   and taken back out — it gives the volume back and will not unwind — that
   is not understood yet." That sentence was written in the Round 57-58 era,
   and the water it was written about no longer exists: Round 65 rebuilt the
   falling rules end to end (falling holds by what is above, a settled fall's
   queue is EMPTY, the front narrowed 175 columns to 9). Nobody ever asked
   the new water the old question.

   So this asks it, arm against arm in one boot: the SAME fall, heads at the
   stride springs() lays today (half/3 — the seven threads) and heads every
   other block (the curtain), and for each arm the four numbers that decide:

     front     how many distinct columns hold water in the brink band —
               the curtain is the POINT, so this must widen
     standing  cells at rest, and the QUEUE at rest — Round 65's law says a
               settled fall costs NOTHING, and a curtain that keeps the queue
               alive is refused whatever it looks like
     still     laid+dried per 100 ticks at rest — the other face of the same law
     drain     the heads taken up: does it unwind to zero, and in how many
               ticks — "will not unwind" is the recorded fear, so it is the
               recorded measurement
============================================================ */
const {open,sail}=require('./harness.js');
function arg(k,d){ const i=process.argv.indexOf('--'+k);
  return i>=0&&process.argv[i+1]!==undefined?process.argv[i+1]:d; }
(async()=>{
  const only=arg('fall',null), strideOnly=arg('stride',null);
  const {browser,page}=await open({});
  try{
    await sail(page);
    const rows=await page.evaluate(async o=>{
      const D=window.__VDBG, B=D.B;
      if(!window.WATER||!window.WATERFALL) return [{err:'no falling water'}];
      const list=WATERFALL.list();
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
        const brinkV=Math.max(0,Math.floor(f.F.under*f.drop));
        const arms=o.strideOnly?[+o.strideOnly]
          :[Math.max(1,Math.round(f.half/3)), 2];
        const rep={n:f.n, form:f.form, half:f.half, drop:f.drop, arms:[]};
        for(const stride of arms){
          /* the heads, laid at this stride along the brink */
          const heads=[];
          for(let u=-f.half;u<=f.half;u+=stride){
            const x=wx(u,brinkV), z=wz(u,brinkV);
            const c=D.landAtWorld(x,z); if(!c) continue;
            const ix=Math.floor(x/B), iz=Math.floor(z/B);
            if(WATER.spill(ix,c.h,iz)) heads.push([ix,c.h,iz]);
          }
          const mine=()=>WATER.serialise().filter(s=>{
            const p=s.slice(0,s.lastIndexOf(':')).split(',');
            return whose(+p[0],+p[2])===f; });
          /* settled: beaten until the standing total stops moving */
          let prev=-1, still=0, t=0;
          for(;t<6000&&still<60;t++){ WATER.step(0.25);
            if(t%25===0){ const n=mine().length;
              still=(n===prev)?still+25:0; prev=n;
              await new Promise(r=>setTimeout(r,0)); } }
          const cells=mine();
          /* the front: distinct u-columns wet in the band at the wall */
          const cols=new Set();
          for(const s of cells){ const p=s.slice(0,s.lastIndexOf(':')).split(',');
            const dx=(+p[0]+0.5)*B-f.x, dz=(+p[2]+0.5)*B-f.z;
            const u=( dx*f.cs-dz*f.sn)/B, v=( dx*f.sn+dz*f.cs)/B;
            if(v>brinkV-1&&v<brinkV+4) cols.add(Math.round(u)); }
          /* stillness at rest: the queue, and the writes over 100 ticks */
          const s0=WATER.stats();
          for(let k=0;k<100;k++){ WATER.step(0.25);
            if(k%50===0) await new Promise(r=>setTimeout(r,0)); }
          const s1=WATER.stats();
          /* the drain: every head taken up, beaten until nothing stands */
          for(const h of heads) WATER.take(h[0],h[1],h[2]);
          let dt2=0;
          for(;dt2<8000&&mine().length;dt2++){ WATER.step(0.25);
            if(dt2%50===0) await new Promise(r=>setTimeout(r,0)); }
          const left=mine().length;
          rep.arms.push({stride, heads:heads.length,
            settled:cells.length, settleTicks:t,
            front:cols.size,
            queueAtRest:s0.waiting,
            laidPer100:s1.moved-s0.moved, driedPer100:s1.dried-s0.dried,
            drainedInTicks:left?null:dt2, LEFT:left});
        }
        out.push(rep);
      }
      return out;
    },{only,strideOnly});
    console.log(JSON.stringify(rows,null,1));
  } finally { await browser.close(); }
})();
