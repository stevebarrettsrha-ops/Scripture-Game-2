/* ============================================================
   THE STORY PLAYED THROUGH — every act of THE FULLNESS OF TIME, end to end
   ------------------------------------------------------------
     node tools/storyplay.js                    every act on the road
     node tools/storyplay.js prologue passion   only these
     EARTH=1 node tools/storyplay.js            on the small map (the true earth is the default)
     GRAVITY=1 node tools/storyplay.js          and every thing and every soul held to the ground: what stands in the
                                                air, with nothing under it and no hand holding it, is named (scene#beat)

   WHY THIS EXISTS. The acceptance suite runs the acts with the engine's FAST hand, which sets the
   witness down on every mark and every figure down on his — so it can never meet a figure who
   does not arrive, or a mark nobody can walk to, and that is exactly how a player was once left
   in an act that could not be finished. This plays each act with the PLAYTEST hand
   (story/engine.js, playStep): the text is advanced as soon as it shows, but the witness WALKS
   to every mark by a way his feet could take, takes up and carries what the act gives him to
   carry, and every figure the story sends walks there on his own legs, in the game's own time.

   It reports, per act: whether it was finished, how long it took in game time, and everything
   the engine had to rescue (ST.stuck: a figure set on his mark after making no headway, the
   witness set on a mark there was no way to). A beat that holds for STALL seconds of game time
   is a STALL — the act could not have been finished — and is stepped past so the rest of the
   act is still played.
============================================================ */
const {open}=require('./harness.js');
const path=require('path');

const STALL=300;                 /* game seconds on one beat before it is called a stall */
const LIMIT=3600;                /* game seconds an act may take in all */
const DT=0.05;                   /* the step of game time each tick */

(async()=>{
  const fs=require('fs');
  const shell=fs.readFileSync(path.join(__dirname,'..','story','shell.js'),'utf8');
  const ROAD=[...shell.matchAll(/\{id:'([^']+)',\s*page:'([^']+)'/g)].map(m=>({id:m[1],page:m[2]}));
  const only=process.argv.slice(2);
  const acts=only.length?ROAD.filter(r=>only.includes(r.id)):ROAD;
  const inject={worldK:process.env.EARTH||'true'};
  const rows=[]; let bad=0;
  for(const A of acts){
    const t0=Date.now();
    let browser;
    try{
      const o=await open({page:'story/'+A.page,inject});
      browser=o.browser; const page=o.page, errs=o.errs;
      page.setDefaultTimeout(1200000);
      await page.waitForFunction(()=>window.__STORY&&window.__STORY.running,null,{timeout:1200000});
      /* played a slice at a time, so that the end of the act — which leaves the act's page for
         the road's — is seen, and what was rescued is read off as it happens */
      await page.evaluate(P=>{ const ST=window.__STORY.ST; ST.playtest=true; ST.simDt=P.DT; ST.stuck=[]; ST.walkWatch=true; ST.walkErr=[];
        try{ const s=JSON.parse(localStorage.getItem('fullness:v1')||'{}'); if(s.acts) delete s.acts[P.id]; localStorage.setItem('fullness:v1',JSON.stringify(s)); }catch(e){} },{DT,id:A.id});
      const res={done:null,sim:0,stuck:[],stalls:[],walk:[],at:''}, falls=new Map();
      let lastKey='', held=0;
      while(res.sim<LIMIT&&!res.done){
        let r;
        try{ r=await page.evaluate(P=>{ const S=window.__STORY, ST=S.ST;
            for(let k=0;k<P.N&&!ST.doneId;k++) window.__STAGE_TICK(P.DT);
            const st=ST.stuck.splice(0), we=(ST.walkErr||[]).splice(0); const b=S.beat||{};
            /* THE LAW OF THE FALL: a thing shown, held by no one, led by no one, carried by no one and not of the
               air (a dove, a vision, the glory and the court above), and a soul neither sitting, riding, aboard,
               nor lying, must have something under it — the ground, a floor, a table — within a hand's breadth */
            const fl=[];
            if(P.G){ const c=S.ctx(), T=window.THREE, bb=new T.Box3(), AIR=/^(dove|vision|gloryThrone|heavenCourt|smokeCloud|livingOne|boat|net|chain|robeTrain|heavenAltar|throne)$/;
              c.scene.updateMatrixWorld(); const inv=new T.Matrix4().copy(c.scene.matrixWorld).invert(), tops={};   /* (in the scene's own measure) */
              for(const id in c.things){ const o=c.things[id]; if(!o.visible) continue; const q=new T.Box3().setFromObject(o); if(isFinite(q.min.y)){ q.applyMatrix4(inv); tops[id]=q; } }
              for(const id in c.things){ const o=c.things[id], u=o.userData, t=u.thing; if(!t||!o.visible||u.crowd||u.heldBy||u.leadBy||u.following||u.goTo||u.bob||AIR.test(t.kind||'')) continue;
                bb.setFromObject(o); if(!isFinite(bb.min.y)) continue; bb.applyMatrix4(inv);
                const x=(bb.min.x+bb.max.x)/2, z=(bb.min.z+bb.max.z)/2; let g=c.groundY(x,z,bb.min.y+0.3);
                for(const j in tops){ const q=tops[j]; if(j!==id&&x>=q.min.x&&x<=q.max.x&&z>=q.min.z&&z<=q.max.z&&q.max.y<=bb.min.y+0.06&&q.max.y>g) g=q.max.y; }   /* (on a table or a rest that is itself a thing) */
                if(bb.min.y-g>0.12) fl.push({what:'thing '+id+(t.kind?' ('+t.kind+')':''),gap:+(bb.min.y-g).toFixed(2)}); }
              for(const id in c.actors){ const g0=c.actors[id], u=g0.userData; if(!g0.visible||u.sit||u.ride||u.aboard||u.lie||u.kneel||u.fly||u.ascend||u.fixedY!==undefined) continue;
                const p=g0.position, g=c.groundY(p.x,p.z,p.y+0.5), d=p.y-g; if(d>0.2) fl.push({what:'soul '+id,gap:+d.toFixed(2)}); } }
            return {fl,walkErr:we,done:ST.doneId||null,key:S.scene+'#'+S.beatIx+'|'+((document.getElementById('goal')||{}).textContent||''),stuck:st,beat:{scene:S.scene,beat:S.beatIx,t:b.t,who:b.who,goto:b.goto,text:b.text}}; },{DT,N:40,G:!!process.env.GRAVITY}); }
        catch(e){
          /* the act's page gave way to the road's: finished, if the save says so */
          await page.waitForLoadState('domcontentloaded').catch(()=>{});
          const done=await page.evaluate(id=>{ try{ return (JSON.parse(localStorage.getItem('fullness:v1')||'{}').acts||{})[id]==='done'; }catch(e){ return false; } },A.id).catch(()=>false);
          res.done=done?A.id:null; if(!done) res.at=lastKey+' (the page went away)'; break; }
        for(const f of r.fl||[]){ const k=r.beat.scene+' '+f.what; const q=falls.get(k); if(!q||f.gap>q.gap) falls.set(k,{gap:f.gap,at:r.beat.scene+'#'+r.beat.beat}); }
        res.sim+=40*DT; res.stuck.push(...r.stuck); res.walk.push(...r.walkErr); res.at=r.key;
        if(r.done){ res.done=r.done; break; }
        if(r.key===lastKey) held+=40*DT; else { held=0; lastKey=r.key; }
        if(held>STALL){ res.stalls.push(r.beat);
          await page.evaluate(P=>{ const ST=window.__STORY.ST; ST.fast=true; for(let k=0;k<3;k++) window.__STAGE_TICK(P.DT); ST.fast=false; },{DT});
          held=0; }
      }
      res.sim=Math.round(res.sim);
      const ok=res.done&&!res.stalls.length&&!res.walk.length&&!errs.length&&!falls.size;
      if(!ok) bad++;
      rows.push(A.id.padEnd(15)+(res.done?'FINISHED':'NOT FINISHED (at '+res.at+')')+
        '  '+res.sim+' s of play, '+Math.round((Date.now()-t0)/1000)+' s to run'+
        (res.stalls.length?'\n    STALLS: '+res.stalls.map(s=>JSON.stringify(s)).join('\n            '):'')+
        (res.stuck.length?'\n    rescued: '+res.stuck.map(s=>(s.who+' @'+s.scene+'#'+s.beat+(s.why?' ('+s.why+')':s.d!==undefined?' ('+s.d+' m short)':'')+(s.plan?' plan '+JSON.stringify(s.plan):''))).join(', '):'')+
        (res.walk.length?'\n    walking: '+res.walk.map(w=>w.who+' '+w.kind+' @'+w.scene+'#'+w.beat+' '+JSON.stringify(w.at)).join('\n             '):'')+
        (falls.size?'\n    IN THE AIR: '+[...falls].map(([k,v])=>k+' '+v.gap+' m over what is under it @'+v.at).join('\n                '):'')+
        (errs.length?'\n    page errors ('+errs.length+'): '+[...new Set(errs.map(e=>e.split('\n')[0]))].slice(0,6).join('\n                 '):''));
    }catch(e){ bad++; rows.push(A.id.padEnd(15)+'FAILED TO RUN: '+String(e.message||e).split('\n')[0]); }
    finally{ if(browser) await browser.close().catch(()=>{}); }
    console.log(rows[rows.length-1]);
  }
  console.log('\n'+(bad?bad+' of '+acts.length+' acts could not be played through cleanly':'every act played through, start to finish'));
  process.exit(bad?1:0);
})();
