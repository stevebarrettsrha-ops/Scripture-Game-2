/* ============================================================
   THE STORY PLAYED THROUGH — every act of THE FULLNESS OF TIME, end to end
   ------------------------------------------------------------
     node tools/storyplay.js                    every act on the road
     node tools/storyplay.js prologue passion   only these
     EARTH=1 node tools/storyplay.js            on the small map (the true earth is the default)

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
      const res={done:null,sim:0,stuck:[],stalls:[],walk:[],at:''};
      let lastKey='', held=0;
      while(res.sim<LIMIT&&!res.done){
        let r;
        try{ r=await page.evaluate(P=>{ const S=window.__STORY, ST=S.ST;
            for(let k=0;k<P.N&&!ST.doneId;k++) window.__STAGE_TICK(P.DT);
            const st=ST.stuck.splice(0), we=(ST.walkErr||[]).splice(0); const b=S.beat||{};
            return {walkErr:we,done:ST.doneId||null,key:S.scene+'#'+S.beatIx+'|'+((document.getElementById('goal')||{}).textContent||''),stuck:st,beat:{scene:S.scene,beat:S.beatIx,t:b.t,who:b.who,goto:b.goto,text:b.text}}; },{DT,N:40}); }
        catch(e){
          /* the act's page gave way to the road's: finished, if the save says so */
          await page.waitForLoadState('domcontentloaded').catch(()=>{});
          const done=await page.evaluate(id=>{ try{ return (JSON.parse(localStorage.getItem('fullness:v1')||'{}').acts||{})[id]==='done'; }catch(e){ return false; } },A.id).catch(()=>false);
          res.done=done?A.id:null; if(!done) res.at=lastKey+' (the page went away)'; break; }
        res.sim+=40*DT; res.stuck.push(...r.stuck); res.walk.push(...r.walkErr); res.at=r.key;
        if(r.done){ res.done=r.done; break; }
        if(r.key===lastKey) held+=40*DT; else { held=0; lastKey=r.key; }
        if(held>STALL){ res.stalls.push(r.beat);
          await page.evaluate(P=>{ const ST=window.__STORY.ST; ST.fast=true; for(let k=0;k<3;k++) window.__STAGE_TICK(P.DT); ST.fast=false; },{DT});
          held=0; }
      }
      res.sim=Math.round(res.sim);
      const ok=res.done&&!res.stalls.length&&!res.walk.length&&!errs.length;
      if(!ok) bad++;
      rows.push(A.id.padEnd(15)+(res.done?'FINISHED':'NOT FINISHED (at '+res.at+')')+
        '  '+res.sim+' s of play, '+Math.round((Date.now()-t0)/1000)+' s to run'+
        (res.stalls.length?'\n    STALLS: '+res.stalls.map(s=>JSON.stringify(s)).join('\n            '):'')+
        (res.stuck.length?'\n    rescued: '+res.stuck.map(s=>(s.who+' @'+s.scene+'#'+s.beat+(s.why?' ('+s.why+')':s.d!==undefined?' ('+s.d+' m short)':'')+(s.plan?' plan '+JSON.stringify(s.plan):''))).join(', '):'')+
        (res.walk.length?'\n    walking: '+res.walk.map(w=>w.who+' '+w.kind+' @'+w.scene+'#'+w.beat+' '+JSON.stringify(w.at)).join('\n             '):'')+
        (errs.length?'\n    page errors ('+errs.length+'): '+[...new Set(errs.map(e=>e.split('\n')[0]))].slice(0,6).join('\n                 '):''));
    }catch(e){ bad++; rows.push(A.id.padEnd(15)+'FAILED TO RUN: '+String(e.message||e).split('\n')[0]); }
    finally{ if(browser) await browser.close().catch(()=>{}); }
    console.log(rows[rows.length-1]);
  }
  console.log('\n'+(bad?bad+' of '+acts.length+' acts could not be played through cleanly':'every act played through, start to finish'));
  process.exit(bad?1:0);
})();
