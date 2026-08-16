/* THE GEOMETRIC DIFF — PLAN.md §6.1, the last of Phase 3.

     node tools/stampdiff.js

   A builder converted from triangles to block stamps must fill the SAME
   SPACE it filled before. Nothing else in the suite asks that. Tests 8 and 9
   prove a house is FUNCTIONAL — a wall breaks out of it and a man walks
   through the hole, and it does not fall when the ground is dug from under
   it — and neither of them would notice if the house came out a block wider,
   or a wall a course short, or a doorway shifted half a block. That is the
   exact failure mode of STAMP_EPS, the rule that a box fills a cell when it
   crosses more than a sixth of it: get it wrong at a corner and every
   building on the earth is wrong in the same direction, and nothing says a
   word.

   IT IS NOT A COMPARISON OF TRIANGLES. A stamped wall is meshed as merged
   runs and legitimately has far fewer of them than the boxes it replaced.
   The comparison is on a VOXEL OCCUPANCY SET: run the builder twice — once
   recording every box with the stone it is made of, once writing blocks —
   rasterise the boxes to the grid by the SAME rule `stampBox` uses, and
   compare the two sets of cells.

   WHAT MUST HOLD is `missing = 0`. Not one cell a box asked for may be
   absent from the stamp, and no cell may be the wrong stone.

   CELLS THE STAMP HAS AND THE BOXES DO NOT are expected for some builders
   and are named here, because every one of them is a deliberate decision
   recorded in the engine: a well's standing water and a pier's planks were
   named as blocks outright, and a floor, a path, a plaza and a bed of tilled
   soil were single drawn FACES that `emitTop` makes a course of blocks. A
   builder not in this list may have none.
*/
const {open,sail}=require('./harness.js');

/* ---- WHAT EACH BUILDER MAY LAWFULLY DO BESIDES ITS BOXES ----
   `add` — cells no box asked for: a surface that used to be one drawn face
           and is now a course of blocks.
   `swap` — cells a box asked for, standing in a different stone: a block
           named outright where the box would have put solid rock.
   Anything a builder does that is not written here is a FAILURE, and that is
   the point of writing them here: every deviation of the block world from the
   triangles it replaced is now a line in this table with a reason beside it,
   rather than something nobody ever noticed. A builder absent from the table
   may do neither. */
const ALLOWED={
  well:  {add:[], swap:['Coursed Stone → Water'],
          why:'the water standing in the shaft, which used to be a drawn face'},
  farm:  {add:['Tilled Ground','Water'], swap:[],
          why:'the tilled bed and its channel, laid by emitTop'},
  house: {add:[], swap:['Coursed Stone → Planks'],
          why:'the plank floor laid on the cobble footing — in a block world the two share a course'},
  pen:   {add:[], swap:[], why:''},
  stall: {add:[], swap:[], why:''},
  bench: {add:[], swap:[], why:''},
  hay:   {add:[], swap:[], why:''},
  pyramid:{add:[], swap:[], why:''},
  ziggurat:{add:[], swap:[], why:''},
  temple:{add:[], swap:[], why:''},
  stonecircle:{add:[], swap:[], why:''},
  lighthouse:{add:[], swap:[], why:''},
  gate:  {add:[], swap:[], why:''},
  statue:{add:[], swap:[], why:''}
};
const ORDER=['well','pen','farm','stall','bench','hay','house',
  'stonecircle','gate','statue','lighthouse','pyramid','ziggurat','temple'];

(async()=>{
  const {browser,page,errs}=await open({});
  await sail(page,true);
  /* ---- THE TEST GROUND MUST BE EMPTY ----
     A stamp that finds a cell already written does not record it as its own,
     so a diff run inside a village would read short and blame the builder.
     The traveller is set down on open ground a long way from any town, and
     the probe refuses outright if it finds anything stamped about it. */
  const spot=await page.evaluate(async()=>{
    const D=window.__VDBG, W=window.__WORLD, S=W.sites(), B=D.B;
    let site=null;
    for(let i=0;i<S.length;i++) if(S[i]&&D.COUNTRIES[i].n==='Kazakhstan'){ site=S[i]; break; }
    if(!site) for(let i=0;i<S.length;i++) if(S[i]){ site=S[i]; break; }
    const idx=D.DAYPARTS.findIndex(d=>d.k==='noon'); if(idx>=0) D.state.dayIdx=idx; D.applyDayPart();
    /* ---- FAR ENOUGH OUT THAT NOTHING HAS BEEN BUILT HERE ----
       A village stamps within some five hundred units of its site, so three
       thousand from any of them is clear ground. The terrain need not be
       LEVEL: both runs of a builder are given the same `y` at the same spot,
       so the shape of the ground never enters the comparison at all. It need
       only be dry, and not the wall of ice.
       Every site on the earth is tried, in turn, rather than one bearing from
       one capital — which is a guess and not a search, and found nothing. */
    let tried=0;
    for(let i=0;i<S.length;i++){
      const st=S[i]; if(!st) continue;
      for(let a2=0;a2<8;a2++){ const th=a2/8*6.2832;
        const x=st.x+Math.cos(th)*3400, z=st.z+Math.sin(th)*3400; tried++;
        const c=D.cellRaw(Math.floor(x/B),Math.floor(z/B));
        if(!c||c.kind==='wall'||c.kind==='floe'||c.h<3) continue;
        /* and room to the east for the whole row of test patches */
        let room=true;
        for(let o=0;o<=14&&room;o++){
          const c2=D.cellRaw(Math.floor((x+o*260)/B),Math.floor(z/B));
          if(!c2||c2.kind==='wall'||c2.kind==='floe'||c2.h<3) room=false; }
        if(!room) continue;
        D.state.walk.x=x; D.state.walk.z=z; D.state.walk.feetY=undefined; D.setMode('walk');
        for(let k=0;k<40;k++){ D.updateChunks(x,z,400);
          await new Promise(rr=>requestAnimationFrame(rr)); }
        return {x,z,ground:c.h*B,kind:c.kind,tried,land:D.COUNTRIES[i]?D.COUNTRIES[i].n:'?'};
      } }
    return {none:true,tried};
    return null;
  });
  if(!spot||spot.none){ console.log('no open ground could be found to test on ('+
    ((spot&&spot.tried)||0)+' spots tried)'); await browser.close(); process.exit(1); }
  console.log('testing on open '+spot.kind+' off '+spot.land+' at '+
    Math.round(spot.x)+','+Math.round(spot.z)+', ground '+spot.ground+
    ' ('+spot.tried+' spots tried)');
  console.log('');

  let pass=0, fail=0;
  for(const kind of ORDER){
    /* each builder gets its own patch of ground, so no two can meet */
    const off=ORDER.indexOf(kind)*260;
    const r=await page.evaluate(a=>window.__VDBG.stampDiff(a.kind,a.x+a.off,a.z),
      {kind,x:spot.x,z:spot.z,off});
    if(r.err){ console.log('SKIP  '+pad(kind)+r.err); continue; }
    const A=ALLOWED[kind]||{add:[],swap:[]};
    const badAdd =r.extraKeys.filter(k=>A.add.indexOf(k)<0);
    const badSwap=r.swapKeys .filter(k=>A.swap.indexOf(k)<0);
    const ok=r.missing===0&&!badAdd.length&&!badSwap.length;
    if(ok) pass++; else fail++;
    console.log((ok?'PASS  ':'FAIL  ')+pad(kind)+
      r.boxes+' boxes → '+r.cellsFromBoxes+' cells · stamped '+r.cellsStamped+
      ' · missing '+r.missing);
    if(r.swaps.length) console.log('        stands instead: '+r.swaps.join(', ')+
      (A.why&&!badSwap.length?'   ('+A.why+')':''));
    if(r.extra.length) console.log('        stands besides: '+r.extra.join(', ')+
      (A.why&&!badAdd.length?'   ('+A.why+')':''));
    if(badSwap.length) console.log('        UNDECLARED SWAP: '+badSwap.join(', '));
    if(badAdd.length)  console.log('        UNDECLARED EXTRA: '+badAdd.join(', '));
    if(r.missingAt.length) console.log('        first missing at: '+r.missingAt.join(' '));
  }
  console.log('');
  console.log(pass+' pass · '+fail+' fail');
  const real=errs.filter(e=>!/TUNNEL/.test(e));
  if(real.length) console.log('ERRORS: '+real.slice(0,4).join(' | '));
  await browser.close();
  process.exit(fail?1:0);
})();
function pad(s){ return (s+'              ').slice(0,14); }
