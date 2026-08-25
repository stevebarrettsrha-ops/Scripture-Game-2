/* THE CAPTURE TOOL — Phase 8's other half
   ------------------------------------------------------------
   A place is made BY HAND, in the world, and then captured. This is the
   capturing. It boots the world in the same headless browser everything else
   in tools/ uses, walks to a spot, reads the box you name, and prints a
   complete `EARTH.place({...})` — paste it into world/places.js and the place
   stands.

   The format is therefore never typed by anybody: it is what comes out. That
   is the whole point of having a capture at all, and it is why world/places.js
   can say "growing the hoard costs one capture and no code".

     node tools/capture.js --at "The Zagros" --w 9 --h 5 --d 11 --dy -3
     node tools/capture.js --x 40917 --z 39105 --y 40 --w 16 --h 8 --d 16
     node tools/capture.js --at "The Zagros" --w 9 --h 5 --d 11 --n "The Cave"

   --at NAME     a landmark out of world/landmarks.js; the box is read at its
                 site, and the emitted place is anchored to it by name so it
                 travels if the chart ever moves.
   --x --z --y   or plain world coordinates instead (--y in BLOCKS; omitted,
                 the ground at that spot is used).
   --dx --dy --dz  the offset from the anchor, in blocks. dy is from the
                 ground, so a chamber sunk into a hill is negative.
   --w --h --d   the box, in blocks. Default 9 × 5 × 11.
   --n NAME      what to call it in the emitted file.
   --keep        emit `keep:true` AND make the slot for it: a keep entry is
                 inserted at palette 0 and everything moves up one. A capture's
                 own index 0 is genuinely AIR — it read air — so simply
                 flipping the flag would turn every captured air cell into
                 "leave the ground", and the chamber would stamp as a solid
                 hill. Nothing uses the new slot until you hand-edit cells
                 into it, which is the only way keep is ever meaningfully
                 used. The default is false: honest air, which is what a
                 capture of a thing standing on open ground wants.

   WHAT IT READS is `blockAt`, which is the procedural ground THROUGH the
   structure stamps AND through the hand's own edits. So what you capture is
   what you SEE — the only rule a capture tool may have. Build it with the
   free hand, stand back, capture it.
*/
const {open,sail}=require('./harness.js');

function arg(k,dflt){ const i=process.argv.indexOf('--'+k);
  return i>0&&process.argv[i+1]!==undefined?process.argv[i+1]:dflt; }
function has(k){ return process.argv.indexOf('--'+k)>0; }

(async()=>{
  const at=arg('at',null), name=arg('n','A place');
  const w=+arg('w',9), h=+arg('h',5), d=+arg('d',11);
  const dx=+arg('dx',0), dy=+arg('dy',0), dz=+arg('dz',0);
  const keep=has('keep');
  const px=arg('x',null), pz=arg('z',null), py=arg('y',null);
  if(!at&&px===null){
    console.error('capture: name a landmark with --at, or a spot with --x --z.');
    process.exit(2);
  }
  const {browser,page,errs}=await open({w:400,h:300});
  await sail(page,true);
  const out=await page.evaluate(async o=>{
    const D=window.__VDBG, B=D.B;
    if(!D.capture||!D.placeSource) return {err:'this build has no capture (Phase 8)'};
    let wx,wz,li=-1;
    if(o.at){
      for(let i=0;i<D.LANDMARKS.length;i++) if(D.LANDMARKS[i].n===o.at){ li=i; break; }
      if(li<0) return {err:'no landmark is called "'+o.at+'"'};
      const ll=D.llToWorld(D.LANDMARKS[li].lat,D.LANDMARKS[li].lon);
      wx=ll[0]; wz=ll[1];
    } else { wx=+o.px; wz=+o.pz; }
    /* stand there and let the world lay its ground — and, if it is a
       landmark, spawn whatever already stands in it */
    D.state.walk.x=wx; D.state.walk.z=wz; D.state.walk.feetY=undefined; D.setMode('walk');
    for(let f=0;f<90;f++){ D.updateChunks(wx,wz,900);
      await new Promise(r=>requestAnimationFrame(r)); }
    let ax=wx, az=wz;
    if(li>=0){ const A=D.activeLandmarks.get(li);
      if(!A||A.none) return {err:'"'+o.at+'" found no site to stand on'};
      ax=A.x; az=A.z; }
    const gc=D.landAtWorld(ax,az);
    const ix0=Math.floor(ax/B)+o.dx, iz0=Math.floor(az/B)+o.dz;
    const iy0=(o.py!==null&&o.py!==undefined?+o.py:(gc?gc.h:0))+o.dy;
    const cap=D.capture(ix0,iy0,iz0,o.w,o.h,o.d);
    /* ---- --keep NEEDS A SLOT MADE FOR IT, NOT A FLAG FLIPPED ----
       A capture's palette index 0 is genuinely AIR: it read air and recorded
       air. Emitting `keep:true` over that palette would turn every one of
       those cells into "leave the ground as it is", and the chamber the man
       just captured would never carve — it would stamp as a solid hill. So
       asking for keep INSERTS the keep slot at 0 and moves everything up one,
       which is exactly the shape the hand-written places have. Nothing uses
       the new slot yet; it is there for the man to hand-edit cells INTO,
       which is the only way keep is ever meaningfully used. */
    if(o.keep){ cap.pal=['keep'].concat(cap.pal);
      for(let i=1;i<cap.rle.length;i+=2) cap.rle[i]++; }
    cap.keep=!!o.keep;
    /* what was found, so the man capturing can see it is what he built */
    const tally={};
    for(let i=0;i<cap.rle.length;i+=2) tally[cap.pal[cap.rle[i+1]]]=(tally[cap.pal[cap.rle[i+1]]]||0)+cap.rle[i];
    return {src:D.placeSource(cap,{n:o.name,at:o.at||'',dx:o.dx,dy:o.dy,dz:o.dz}),
      where:Math.round(ax)+','+Math.round(az)+' at y '+iy0,
      tally:Object.keys(tally).sort((a,b)=>tally[b]-tally[a]).map(k=>k+' '+tally[k]).join(', '),
      runs:cap.rle.length/2};
  },{at,name,w,h,d,dx,dy,dz,keep,px,pz,py});
  await browser.close();
  if(out.err){ console.error('capture: '+out.err); process.exit(1); }
  console.error('/* captured at '+out.where+' — '+out.tally+' · '+out.runs+' runs */');
  console.log(out.src);
  const real=[...new Set(errs)].filter(e=>!/ERR_TUNNEL/.test(e));
  if(real.length) console.error('PAGE ERRORS:\n'+real.slice(0,4).join('\n'));
})();
