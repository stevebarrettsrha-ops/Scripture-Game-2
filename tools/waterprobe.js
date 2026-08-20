/* ============================================================
   THE WATER PROBE — what a spring at a fall actually puts into the world
   ------------------------------------------------------------
   The springs at the falls have stood switched off since a spring at
   Niagara's lip put 13,989 cells of standing water into the world and one at
   Multnomah 23,025. Five fixes have gone in since that reading — the sheer
   wall, the sea's sink, the river's sink, the three faults in the level rule,
   and the block of grace at the plunge pool — and not one of them was ever
   measured. This is the instrument that measures them.

     node tools/waterprobe.js                      the whole matrix
     node tools/waterprobe.js --fall Niagara       one fall, both ways twice
     node tools/waterprobe.js --fall Angel --evap 0 --heads 1 --secs 60

   WHAT IT ASKS, AND WHY EACH ONE. A number that is small at ten seconds and
   larger at sixty is a flood that has not arrived yet, so nothing here is
   reported as a single figure: every case is read at 10, 30 and 60 seconds of
   the water's own clock, and the verdict is STEADY or CLIMBING.

     total    every cell of spilled water standing in the world
     wall     of those, the ones on the fall's own wall — a fall that has no
              water above its foot is not a fall, however tidy its total
     pool     what stands at the foot, inside the fall's claim
     far      what has got away from the fall altogether: the flood, if any

   IT DRIVES THE GAME'S OWN LAYING. `__VDBG.layFall` calls the same laySpring
   updateFalls calls, so what is measured is the shipped path.
============================================================ */
const {open,sail}=require('./harness.js');

const FALLS=['Angel','Niagara','Multnomah'];
const MARKS=[10,30,60];           /* seconds of the water's own clock */

function arg(k,d){ const i=process.argv.indexOf('--'+k);
  return i>=0&&process.argv[i+1]!==undefined?process.argv[i+1]:d; }

/* ---- ONE CASE: one fall, one evaporation setting, one head count ---- */
async function measure(page,name,evap,heads,secs){
  /* stand at the lip and lay the spring through the engine's own path */
  const set=await page.evaluate(async o=>{
    const D=window.__VDBG;
    window.WATERFALL.setHeads(o.heads);
    window.WATER.setEvap(o.evap);
    D.setSprings(true); D.unspring();
    const f=D.fallNamed(o.name);
    if(!f) return {err:'no fall named '+o.name};
    D.state.walk.x=f.x; D.state.walk.z=f.z; D.state.walk.feetY=undefined;
    D.setMode('walk');
    let laid=0,frames=0;
    while(frames<900&&laid<=0){
      D.updateChunks(D.state.walk.x,D.state.walk.z,400);
      await new Promise(r=>requestAnimationFrame(r));
      const r=D.layFall(o.name); laid=r?r.laid:0; frames++;
    }
    /* ---- THE LIP AND THE FOOT, READ OFF THE GROUND AND NOT ASSUMED ----
       lip − drop is not the floor of the gorge: the builder sets the foot at
       `max(2, h−2)` of the LAND, and the land at Angel stands a block or two
       over the sea. Taking the difference as the foot put every cell standing
       on the gorge floor into the "wall" column of this report, which is the
       one number the whole question turns on. So both are measured: the lip
       is the ground behind the crest, and the foot is the lowest ground
       anywhere down the fall's own centre line. */
    const lipC=D.landAtWorld(f.x-f.sn*D.B*2, f.z-f.cs*D.B*2);
    let foot=1e9;
    for(let v=0;v<=f.run;v+=Math.max(1,Math.round(f.run/40))){
      const c=D.landAtWorld(f.x+f.sn*D.B*v, f.z+f.cs*D.B*v);
      if(c&&c.h<foot) foot=c.h;
    }
    return {laid,frames,lip:lipC?lipC.h:null,foot:(foot<1e9?foot:null),
            drop:f.drop,half:f.half,form:f.form,name:f.n};
  },{name,evap,heads});
  if(set.err||set.laid<=0) return {err:set.err||'the spring would not lay ('+set.frames+' frames)'};

  /* let the world run, and read it at each mark of the water's own clock */
  const out=[];
  for(const s of secs){
    const r=await page.evaluate(async o=>{
      const D=window.__VDBG, B=D.B;
      /* ---- THE WATER'S OWN CLOCK, AND WHY IT IS DRIVEN AND NOT WAITED ON ----
         The frame loop caps dt at a fiftieth of a second, so on a software
         rasteriser running two frames a second the game's clock crawls at a
         tenth of real time: sixty seconds of water would want ten minutes of
         waiting, and twelve cases of it two hours. WATER.step(TICK) is the
         same tick the loop calls, with the same 1.2 ms budget on the queue,
         so driving it advances exactly the same simulation — and a frame is
         let through every twenty-five ticks so the world still builds and
         meshes around the water. */
      const want=o.secs*4;                       /* the water ticks four times a second */
      let guard=0;
      while(window.WATER.stats().ticks<want&&guard++<want*4){
        window.WATER.step(0.25);
        if((guard&31)===0) await new Promise(r=>requestAnimationFrame(r));
      }
      /* AND AN EMPTY QUEUE IS THE STRONGEST ANSWER OF ALL. The tick returns
         without counting itself when there is nothing waiting, so a clock
         that will not advance means the water has nowhere left to go: it is
         not merely steady at this moment, it is AT REST and can only be moved
         by a hand. (With the air on it never rests — a standing cell wakes
         itself every tick until it dries.) */
      const atRest=window.WATER.waiting()===0;
      /* the census: every standing cell, placed in the fall's own frame */
      const f=D.fallNamed(o.name);
      const footY=o.foot;
      let total=0,wall=0,pool=0,far=0,col=0,maxV=0;
      const stack=new Map();          /* how many cells stand in each column */
      /* ---- AND THE SHAPE OF IT, NOT ONLY THE SIZE ----
         A total that climbs says nothing about WHY. These two say it: how
         many cells stand at each LEVEL (a mass of 8s is falling water, a mass
         of 1s is a sheet running out of a landing, a mass of 7s is a spread
         that has reached its limit), and how many stand in each ten-block
         BAND above the gorge floor (a fall is a thin line through every band;
         a flood is a slab in the lowest one). */
      const byLevel=[0,0,0,0,0,0,0,0,0], byBand=[];
      /* and WHERE the falling water is: a fall is one column, or as many
         columns as there are heads; anything wider is a curtain, and a
         curtain nobody asked for is a fault with a shape */
      const fallCols=new Set(); let fu0=1e9,fu1=-1e9,fv0=1e9,fv1=-1e9;
      for(const s of window.WATER.serialise()){
        const i=s.lastIndexOf(':'), p=s.slice(0,i).split(',');
        const ix=+p[0], iy=+p[1], iz=+p[2], lev=+s.slice(i+1);
        total++;
        if(lev>=0&&lev<=8) byLevel[lev]++;
        const band=Math.max(0,Math.floor((iy-o.foot)/10));
        byBand[band]=(byBand[band]||0)+1;
        const dx=(ix+0.5)*B-f.x, dz=(iz+0.5)*B-f.z;
        const u=(dx*f.cs-dz*f.sn)/B, v=(dx*f.sn+dz*f.cs)/B;
        if(lev===8){ fallCols.add(ix+','+iz);
          if(u<fu0) fu0=u; if(u>fu1) fu1=u;
          if(v<fv0) fv0=v; if(v>fv1) fv1=v; }
        if(Math.abs(u)<=f.half+6&&v>=-6&&v<=f.run){
          if(iy>footY+1){
            wall++;
            /* THE COLUMN: the tallest stack of water standing anywhere on the
               wall. A total that looks tidy while nothing stands above the
               foot is a puddle at the bottom of a dry cliff, not a fall. */
            const k=ix+','+iz, n=(stack.get(k)||0)+1;
            stack.set(k,n); if(n>col) col=n;
          }
          else pool++;
          if(v>maxV) maxV=Math.round(v);
        } else far++;
      }
      const st=window.WATER.stats();
      return {total,wall,pool,far,col,maxV,atRest,byLevel,
              fallCols:fallCols.size,
              fu:[Math.round(fu0),Math.round(fu1)],fv:[Math.round(fv0),Math.round(fv1)],
              byBand:byBand.map(v=>v||0),ticks:st.ticks,waiting:st.waiting,
              moved:st.moved,dried:st.dried,evaporated:st.evaporated,
              secs:+(st.ticks/4).toFixed(1)};
    },{secs:s,name,lip:set.lip,foot:set.foot,wall:Math.max(40,s*3)});
    out.push(r);
    process.stdout.write('      '+String(r.secs).padStart(5)+'s  total '+
      String(r.total).padStart(6)+'   wall '+String(r.wall).padStart(4)+
      '   pool '+String(r.pool).padStart(5)+'   far '+String(r.far).padStart(6)+
      '   run '+String(r.maxV).padStart(4)+
      '   queued '+String(r.waiting).padStart(5)+
      (r.atRest?'   AT REST':'')+
      (r.evaporated?('   air '+r.evaporated):'')+'\n');
  }
  const b0=out[out.length-1];
  process.stdout.write('      by level  '+b0.byLevel.map((n,i)=>
      (i===0?'src':i===8?'fall':String(i))+' '+n).join('  ')+'\n');
  process.stdout.write('      by band   '+b0.byBand.map((n,i)=>
      (i*10)+'+ '+n).join('  ')+'\n');
  process.stdout.write('      falling in '+b0.fallCols+' columns · across the lip u '+
      b0.fu[0]+'..'+b0.fu[1]+' · downstream v '+b0.fv[0]+'..'+b0.fv[1]+'\n');
  const a=out[out.length-2]||out[0], b=out[out.length-1];
  /* AND WATER AT REST IS NOT CLIMBING, whatever the marks say. A fall that
     has emptied its queue has nothing left to move: the growth between two
     marks was it FILLING — a hundred-block column takes a hundred ticks to
     reach the ground — and the last mark is the end of it, not a stage of it. */
  const climbing=!b.atRest&&b.total>a.total*1.05+5;
  return {set,marks:out,climbing,last:b};
}

/* ---- AND THE PICTURE, BECAUSE THE FLOOD WAS FIRST SEEN IN ONE ----
   The reading that turned the springs off came with a photograph of the
   camera at the foot of Niagara buried inside a solid mass of water. A total
   that has come down proves the flood is gone; only the picture proves there
   is a waterfall standing where it was. */
async function photograph(page,name,file){
  await page.evaluate(async o=>{
    const D=window.__VDBG, B=D.B, f=D.fallNamed(o.name);
    if(!f) return;
    const idx=D.DAYPARTS.findIndex(d=>d.k==='noon');
    if(idx>=0){ D.state.dayIdx=idx; D.applyDayPart(); }
    /* ---- WHERE TO STAND TO SEE A FALL ----
       Nine tenths of the drop downstream is right for a cataract six blocks
       high and hopeless for a plunge a hundred and nine: the first photograph
       of Angel was taken from inside the gorge wood a hundred blocks back,
       with a thread of blue between the trees. The station is the far lip of
       the PLUNGE POOL instead — past the wall, past the pool, looking back up
       — which is where a man stands to look at any fall in the world. */
    const set=f.F.under*f.drop;
    const wallEnd=Math.max(1,Math.round(f.drop*(1-f.F.steep))+1);
    const poolR=Math.max(2,f.half*f.F.pool);
    const v=set+wallEnd+poolR+3;
    D.state.walk.x=f.x+f.sn*B*v; D.state.walk.z=f.z+f.cs*B*v;
    D.state.walk.feetY=undefined; D.state.walk.vy=0;
    D.state.walk.heading=Math.atan2(-f.sn,-f.cs);
    D.setMode('walk');
    for(let k=0;k<60;k++){ D.updateChunks(D.state.walk.x,D.state.walk.z,400);
      await new Promise(r=>requestAnimationFrame(r)); }
  },{name});
  await page.screenshot({path:file});
  return file;
}

/* ---- AND WHAT IT COSTS TO LOOK AT, WHICH IS THE OTHER HALF ----
   "Beauty that halves the frame rate is not beauty" — tools/shots.js has held
   that line since Round 24, and a fall of six thousand water boxes has to
   answer it too. The same station is timed twice: the fall standing dry, and
   the fall running. Nothing else about the two differs. */
async function cost(page,name){
  const stand=async()=>page.evaluate(async o=>{
    const D=window.__VDBG, B=D.B, f=D.fallNamed(o.name);
    const idx=D.DAYPARTS.findIndex(d=>d.k==='noon');
    if(idx>=0){ D.state.dayIdx=idx; D.applyDayPart(); }
    const v=f.drop*0.9+8;
    D.state.walk.x=f.x+f.sn*B*v; D.state.walk.z=f.z+f.cs*B*v;
    D.state.walk.feetY=undefined; D.state.walk.vy=0;
    D.state.walk.heading=Math.atan2(-f.sn,-f.cs);
    D.setMode('walk');
    for(let k=0;k<50;k++){ D.updateChunks(D.state.walk.x,D.state.walk.z,400);
      await new Promise(r=>requestAnimationFrame(r)); }
    /* and the LEAST of the passes is the honest reading, as test 12 keeps:
       interference only ever adds time to a frame, it never takes it away */
    const t=[]; let last=performance.now();
    for(let k=0;k<120;k++){ await new Promise(r=>requestAnimationFrame(r));
      const now=performance.now(); t.push(now-last); last=now; }
    t.sort((a,b)=>a-b);
    return {mean:+(t.reduce((a,b)=>a+b,0)/t.length).toFixed(1),
            best:+t[0].toFixed(1), worst:+t[t.length-1].toFixed(1),
            cells:window.WATER.count()};
  },{name});
  const dry=await stand();
  await page.evaluate(async o=>{
    const D=window.__VDBG;
    D.setSprings(true); D.unspring();
    const f=D.fallNamed(o.name);
    D.state.walk.x=f.x; D.state.walk.z=f.z; D.state.walk.feetY=undefined;
    D.setMode('walk');
    let laid=0,frames=0;
    while(frames<900&&laid<=0){
      D.updateChunks(D.state.walk.x,D.state.walk.z,400);
      await new Promise(r=>requestAnimationFrame(r));
      const r=D.layFall(o.name); laid=r?r.laid:0; frames++; }
    let guard=0;
    while(window.WATER.waiting()&&guard++<2400){
      window.WATER.step(0.25);
      if((guard&63)===0) await new Promise(r=>requestAnimationFrame(r)); }
  },{name});
  const wet=await stand();
  return {dry,wet};
}

(async()=>{
  const only=arg('fall',null);
  const evaps=arg('evap',null)!==null?[+arg('evap')]:[0,14];
  const headSet=arg('heads',null)!==null?[+arg('heads')]:[1,0];
  const secs=arg('secs',null)!==null?String(arg('secs')).split(',').map(Number):MARKS;
  const falls=only?[only]:FALLS;
  const rows=[];
  /* --cost: what the water costs to look at, and nothing else */
  if(process.argv.includes('--cost')){
    for(const name of falls){
      const {browser,page}=await open({});
      try{
        await sail(page);
        const c=await cost(page,name);
        console.log(name.padEnd(12)+' dry '+c.dry.mean+' ms (best '+c.dry.best+
          ', worst '+c.dry.worst+')  ·  running '+c.wet.mean+' ms (best '+c.wet.best+
          ', worst '+c.wet.worst+') with '+c.wet.cells+' cells  ·  '+
          (c.wet.best/c.dry.best).toFixed(2)+'× on the best frame');
      }finally{ await browser.close(); }
    }
    return;
  }
  for(const name of falls){
    for(const heads of headSet){
      for(const evap of evaps){
        const tag=name+'  heads='+(heads===1?'one':'line')+'  evap='+(evap?evap:'off');
        console.log('\n=== '+tag+' ===');
        const {browser,page,errs}=await open({});
        try{
          await sail(page);
          const r=await measure(page,name,evap,heads,secs);
          if(r.err){ console.log('   ✗ '+r.err); rows.push({tag,err:r.err}); }
          else{
            console.log('   '+(r.climbing?'CLIMBING':(r.last.atRest?'AT REST':'steady'))+
              '  ·  lip h='+r.set.lip+'  foot h='+r.set.foot+'  drop='+r.set.drop+'  heads laid='+r.set.laid+
              '  ·  column '+r.last.col+' of '+r.set.drop);
            rows.push({tag,total:r.last.total,wall:r.last.wall,pool:r.last.pool,
                       far:r.last.far,col:r.last.col,drop:r.set.drop,
                       climbing:r.climbing,rest:r.last.atRest});
          }
          const dir=arg('shot',null);
          if(dir&&!r.err){ require('fs').mkdirSync(dir,{recursive:true});
            const file=dir+'/'+name.toLowerCase()+'-heads'+heads+'-evap'+evap+'.png';
            await photograph(page,name,file);
            console.log('   photographed: '+file); }
          const bad=errs.filter(e=>!/favicon/i.test(e));
          if(bad.length) console.log('   console errors: '+bad.slice(0,3).join(' | '));
        }finally{ await browser.close(); }
      }
    }
  }
  console.log('\n================ THE READING ================');
  for(const r of rows) console.log(r.err?(r.tag+'  ✗ '+r.err):
    (r.tag.padEnd(38)+'total '+String(r.total).padStart(6)+
     '   wall '+String(r.wall).padStart(4)+'   far '+String(r.far).padStart(6)+
     '   column '+r.col+'/'+r.drop+'   '+(r.climbing?'CLIMBING':(r.rest?'at rest':'steady'))));
})().catch(e=>{ console.error(e); process.exit(1); });
