/* ============================================================
   THE STORY SET ON THE TRUE EARTH — does every scene agree with the ground it is played on?
   ------------------------------------------------------------
     node tools/storyaudit.js                    every act
     node tools/storyaudit.js prologue galil     only these
     EARTH=1 node tools/storyaudit.js            on the small map

   The playtest (tools/storyplay.js) asks whether an act can be FINISHED. This asks whether each
   scene, raised at its place on the true earth, is where the story says it is and stands on the
   ground there:

     PLACE    how far the scene was set from the place the story names (its latitude and longitude).
     WATER    a scene that lays its own lake or sea (ctx.lake) — how much of that water lies over the
              earth's own water, and how much of the dry stage beside it lies over the earth's water
              (a lake drawn on a hillside beside the true lake, a town standing in the true lake).
     SPOT     the witness, every figure and every thing where the scene sets them down, and every
              place a beat sends someone (a goal, a move, a place): IN A WALL (a body inside a
              block), ON A WALL (stood on something no wider than a wall), ON A ROOF (a room under
              his feet), IN WATER, OUTSIDE the scene's bounds.
     WAY      the witness's road through the scene, goal to goal and deed to deed, walked by the
              same rules as his feet (planWay): a step with no way is a scene that cannot be played
              without being carried.
     ERROR    anything the page threw while the scene was raised.

   Each scene is raised by the engine itself (__STORY.run) and measured the moment it stands,
   before a beat has moved anyone.
============================================================ */
const {open}=require('./harness.js');
const fs=require('fs'), path=require('path');

/* ---- the auditor, run inside the act's page (it must stand on its own: it is sent there) ---- */
function auditScene(P){
  const S=window.__STORY, K=window.__KIT, D=S.dbg;
  const act=S.ST.acts.find(q=>q.id===P.id), sc=act.scenes[P.si];
  S.ST.playtest=false; S.ST.fast=false;
  try{ S.run(P.id,P.si); }catch(e){ return {scene:sc.id,err:String(e&&e.message||e)}; }
  const ctx=S.ctx(), A=ctx.anchor, Sc=K.setScale, B=K.B;
  const out={scene:sc.id,spots:[],ways:[],notes:[]};
  const W=(x,z)=>[A.x+x*Sc,A.z+z*Sc];
  const natural=(x,z)=>{ const w=W(x,z), c=K.cell(Math.floor(w[0]/B),Math.floor(w[1]/B)); return c?(c.h*B-A.y)/Sc:null; };
  const earthWet=(x,z)=>{ const w=W(x,z), c=K.landAtWorld(w[0],w[1]); return !c||(c.lake!==undefined&&c.lake>c.h); };
  const solid=(x,y,z)=>{ const w=W(x,z); return K.solidAt(w[0],A.y+y*Sc,w[1]); };
  const wet=(x,y,z)=>{ const w=W(x,z); return K.waterAt(w[0],A.y+y*Sc,w[1]); };
  const f1=v=>Math.round(v*10)/10;
  /* PLACE: how far from the place the story names */
  try{ const def=window.STORYPLACES.list[sc.place];
    if(def&&def.lat!==undefined){ const p=K.llToWorld(def.lat,def.lon); out.where=sc.place+', '+Math.round(Math.hypot(p[0]-A.x,p[1]-A.z)/Sc)+' m from '+def.lat+','+def.lon; }
    else out.where=sc.place+(A.trueAt||A.markOff?' (the city, offset '+(A.markOff||[]).map(Math.round).join(',')+')':' (the city)'); }catch(e){}
  /* WATER: the lake or sea the scene draws (ctx.lake), else the water its set lays (api.water) */
  const lakeRect=(ctx.lake&&ctx.lake.rect)||(()=>{ const L=ctx.api&&ctx.api.waters; if(!L||!L.length) return null;
    let big=null, ba=0; for(const r of L){ const a=(r[2]-r[0])*(r[3]-r[1]); if(a>ba){ ba=a; big=r; } } return ba>400?big:null; })();
  if(lakeRect){ const r=lakeRect; let n=0,w=0,sn=0,sw=0;
    for(let x=r[0];x<=r[2];x+=6) for(let z=r[1];z<=r[3];z+=6){ n++; if(earthWet(x,z)) w++; }
    /* the dry stage: the ground the scene is played on beside its water (its bounds, else sixty metres about its middle) */
    const b=ctx.bounds||{x0:-60,x1:60,z0:-60,z1:60};
    for(let x=b.x0;x<=b.x1;x+=6) for(let z=b.z0;z<=b.z1;z+=6){ if(x>=r[0]-2&&x<=r[2]+2&&z>=r[1]-2&&z<=r[3]+2) continue; sn++; if(earthWet(x,z)) sw++; }
    out.water={lakeWet:Math.round(100*w/Math.max(1,n)),stageWet:sn?Math.round(100*sw/sn):null}; }
  /* SPOT: one place a man (or a thing) is set */
  const spot=(label,x,z,y,o)=>{ o=o||{};
    if(!isFinite(x)||!isFinite(z)) return;
    if(y===undefined||y===null) y=D.ground(x,z);
    if(!isFinite(y)) { out.spots.push(label+' has no ground under it'); return; }
    const b=ctx.bounds; if(b&&o.walker&&(x<b.x0||x>b.x1||z<b.z0||z>b.z1)) out.spots.push(label+' OUTSIDE the bounds ('+f1(x)+','+f1(z)+')');   /* (only the witness is held in them) */
    if(!o.thing&&(solid(x,y+0.9,z)||solid(x,y+1.5,z))) out.spots.push(label+' IN A WALL at ('+f1(x)+','+f1(z)+')');
    if(o.fixed) return;
    const nat=natural(x,z), raised=nat===null?0:y-nat;
    if(raised>2.2){
      /* a room under his feet: a roof */
      let air=0, run=0; for(let h=nat+0.3;h<y-0.3;h+=B/Sc){ if(!solid(x,h,z)){ run++; air=Math.max(air,run); } else run=0; }
      /* or something no wider than a wall: the ground falls away close on both sides */
      let drops=0; for(const [dx,dz] of [[1.6,0],[-1.6,0],[0,1.6],[0,-1.6]]){ const g=D.ground(x+dx,z+dz,y+0.5); if(isFinite(g)&&g<y-1.5) drops++; }
      if(air>=2) out.spots.push(label+' ON A ROOF, '+f1(raised)+' m over the land ('+f1(x)+','+f1(z)+')');
      else if(drops>=2) out.spots.push(label+' ON A WALL, '+f1(raised)+' m over the land ('+f1(x)+','+f1(z)+')'); }
    if(!o.thing&&wet(x,y+1.0,z)) out.spots.push(label+' IN WATER over the waist ('+f1(x)+','+f1(z)+')'); };
  const P0=S.player();
  if(P0&&!ctx.playerHidden) spot('the witness',P0.position.x,P0.position.z,P0.position.y,{fixed:ctx.playerY!==undefined,walker:true});
  for(const id in ctx.actors){ const g=ctx.actors[id], d=g.userData.def||{};
    spot('figure '+id,g.position.x,g.position.z,g.position.y,{fixed:g.userData.fixedY!==undefined||d.y!==undefined||!!g.userData.aboard}); }
  for(const id in ctx.things){ const o=ctx.things[id], t=o.userData.thing||{};
    if(t.kind==='boat'||!o.visible) continue;
    spot('thing '+id,o.position.x,o.position.z,o.position.y,{thing:true,fixed:t.y!==undefined}); }
  /* the places the beats send people, and the witness's own road through them */
  const pos=m=>{ try{ return D.pos(m); }catch(e){ return null; } };
  let cur={x:P0.position.x,y:P0.position.y,z:P0.position.z}, deck=ctx.playerY!==undefined;
  const widen=(m)=>{ const b=ctx.bounds; if(!b) return; const M=8;
    if(m[0]-M<b.x0) b.x0=m[0]-M; if(m[0]+M>b.x1) b.x1=m[0]+M; if(m[1]-M<b.z0) b.z0=m[1]-M; if(m[1]+M>b.z1) b.z1=m[1]+M; };
  const walk=(label,m,r)=>{ if(deck||!m) { if(m) cur={x:m[0],y:cur.y,z:m[1]}; return; } widen(m);
    const t0=performance.now(), way=D.planWay(m[0],m[1],Math.max(0.4,r),cur);
    if(!way) out.ways.push('no way to '+label+' (from '+f1(cur.x)+','+f1(cur.z)+' to '+f1(m[0])+','+f1(m[1])+', '+Math.round(Math.hypot(m[0]-cur.x,m[1]-cur.z))+' m)');
    else if(performance.now()-t0>4000) out.notes.push('the way to '+label+' took '+Math.round(performance.now()-t0)+' ms to find');
    const g=D.ground(m[0],m[1],cur.y+2.4); cur={x:m[0],y:isFinite(g)?g:cur.y,z:m[1]}; };
  sc.beats.forEach((b,i)=>{ const tag='#'+i+' '+b.t;
    if(b.t==='player'&&b.at){ const m=pos(b.at); if(m){ deck=b.y!==undefined&&b.y!==null; cur={x:m[0],y:deck?b.y:D.ground(m[0],m[1]),z:m[1]}; if(!deck) spot(tag+' the witness set',m[0],m[1]); } }
    if(b.t==='place'&&b.at){ const m=pos(b.at); if(m){ if(b.who==='player'){ deck=b.y!==undefined&&b.y!==null; cur={x:m[0],y:deck?0:D.ground(m[0],m[1]),z:m[1]}; }
      if(b.y===undefined||b.y===null) spot(tag+' '+b.who+' set',m[0],m[1]); } }
    if(b.t==='goal'){ const m=pos(b.goto); if(m){ spot(tag+' mark',m[0],m[1],undefined,{anyBounds:true}); walk(tag+' "'+(b.text||'').slice(0,40)+'"',m,(b.r||2.4)*0.6); } }
    if(b.t==='move'&&b.to){ const who=[].concat(b.who), tos=Array.isArray(b.who)||Array.isArray(b.to&&b.to[0])?[].concat(b.to):[b.to];
      who.forEach((w,k)=>{ const g=ctx.actors[w]; if(!g) return; const m=pos(tos[Math.min(k,tos.length-1)]); if(!m) return;
        const fixed=g.userData.fixedY!==undefined||!!g.userData.aboard;
        if(!fixed) spot(tag+' '+w+' sent to',m[0],m[1],undefined,{anyBounds:true}); }); }
    if(b.t==='witness'){ for(const id of b.items||[]){ const o=ctx.things[id]||ctx.actors[id]; if(!o) continue;
        walk(tag+' "'+id+'"',[o.position.x,o.position.z],(b.reach||2.2)*0.6);
        if(b.deliver){ const m=pos(b.deliver); if(m) walk(tag+' deliver "'+id+'"',m,(b.r||3)*0.6); } } } });
  return out;
}

(async()=>{
  const shell=fs.readFileSync(path.join(__dirname,'..','story','shell.js'),'utf8');
  const ROAD=[...shell.matchAll(/\{id:'([^']+)',\s*page:'([^']+)'/g)].map(m=>({id:m[1],page:m[2]}));
  const only=process.argv.slice(2);
  const acts=only.length?ROAD.filter(r=>only.includes(r.id)):ROAD;
  const inject={worldK:process.env.EARTH||'true'};
  let issues=0;
  for(const A of acts){
    let browser;
    try{
      const o=await open({page:'story/'+A.page,inject});
      browser=o.browser; const page=o.page, errs=o.errs;
      page.setDefaultTimeout(1800000);
      await page.waitForFunction(()=>window.__STORY&&window.__STORY.running,null,{timeout:1800000});
      const n=await page.evaluate(id=>window.__STORY.ST.acts.find(a=>a.id===id).scenes.length,A.id);
      console.log('== '+A.id+' ('+n+' scenes)');
      for(let si=0;si<n;si++){
        const e0=errs.length;
        let R;
        try{ R=await page.evaluate(auditScene,{id:A.id,si}); }
        catch(e){ R={scene:'#'+si,err:String(e.message||e).split('\n')[0]}; }
        const lines=[];
        if(R.err) lines.push('ERROR   could not be raised: '+R.err);
        let bad=0;
        if(R.water){ const off=R.water.lakeWet<70||(R.water.stageWet!==null&&R.water.stageWet>15); if(off) bad++;
          lines.push('WATER   its water over the earth\'s water '+R.water.lakeWet+'%; its dry stage over the earth\'s water '+(R.water.stageWet===null?'-':R.water.stageWet+'%')+(off?'   <-- does not agree':'')); }
        for(const p of R.spots||[]){ lines.push('SPOT    '+p); bad++; }
        for(const w of R.ways||[]){ lines.push('WAY     '+w); bad++; }
        for(const nt of R.notes||[]) lines.push('note    '+nt);
        for(const x of errs.slice(e0)){ lines.push('ERROR   '+x.split('\n')[0]); bad++; }
        if(R.err) bad++;
        issues+=bad;
        console.log('  '+String(R.scene).padEnd(16)+(bad?bad+' to look at':'ok')+(R.where?'   ['+R.where+']':''));
        for(const l of lines) console.log('      '+l);
      }
    }catch(e){ issues++; console.log('== '+A.id+' FAILED TO RUN: '+String(e.message||e).split('\n')[0]); }
    finally{ if(browser) await browser.close().catch(()=>{}); }
  }
  console.log('\n'+(issues?issues+' things to look at':'every scene agrees with its ground'));
  process.exit(issues?1:0);
})();
