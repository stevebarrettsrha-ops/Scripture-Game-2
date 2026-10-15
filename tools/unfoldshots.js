/* SCRIPTURE UNFOLDS, SEEN — every scroll on the shelf played on the true earth and photographed
   in the middle of every caption, so the world can be set beside the words it was told to show.

     node tools/unfoldshots.js <outDir>                every scene
     node tools/unfoldshots.js <outDir> creation eden  only these

   For each scene: every caption's words are drawn from the Besorah (a caption that comes back
   empty is reported), the stage is put at the middle of the caption (STAGE.seek) and held while
   the world is drawn about the eye, and the screen is taken. Page errors are reported per scene.
   <outDir>/<scene>/NN-<ref>.png, and <outDir>/index.json with the captions and their words.
   REFS="1:20,1:27" for only those captions. EARTH=1 for the small map; the true earth is the default. */
const {open}=require('./harness.js');
const fs=require('fs'), path=require('path');
(async()=>{
  const [outDir,...only]=process.argv.slice(2);
  if(!outDir){ console.log('usage: node tools/unfoldshots.js <outDir> [scene ...]'); process.exit(2); }
  fs.mkdirSync(outDir,{recursive:true});
  const FR=+(process.env.FRAMES||40);
  const {browser,page,errs}=await open({page:'scripture-unfolds/index.html',inject:{worldK:process.env.EARTH||'true'},w:1280,h:720});
  const index=[]; let bad=0;
  try{
    page.setDefaultTimeout(1800000);
    await page.waitForFunction(()=>window.STORY&&window.STAGE&&window.__UNFOLD&&document.getElementById('boot')&&document.getElementById('boot').style.display==='none',null,{timeout:1800000});
    const scenes=await page.evaluate(()=>STORY.list().map(s=>({id:s.id,name:s.name,dur:s.stage[s.stage.length-1].t})));
    for(const S of scenes){
      if(only.length&&!only.includes(S.id)) continue;
      const e0=errs.length;
      const caps=await page.evaluate(async id=>{
        STORY.end(true);
        const ok=await STORY.play(id); if(!ok) return {err:'the scroll could not be opened'};
        const s=STORY.get(id);
        return {caps:(s.caps||[]).map(c=>{ const q=STORY.capText(c); return {t:c.t,to:c.to,text:q.text,ref:q.ref}; })};
      },S.id);
      if(caps.err){ bad++; console.log(S.id+': '+caps.err); continue; }
      const dir=path.join(outDir,S.id); fs.mkdirSync(dir,{recursive:true});
      const empty=caps.caps.filter(c=>!c.text||!c.text.trim());
      if(empty.length){ bad++; console.log(S.id+': '+empty.length+' caption(s) came back with no words: '+empty.map(c=>c.ref||('@'+c.t)).join(', ')); }
      const REFS=(process.env.REFS||'').split(',').map(x=>x.trim()).filter(Boolean);   /* REFS="1:20,1:27": only the captions whose reference ends so */
      for(let i=0;i<caps.caps.length;i++){ const c=caps.caps[i], mid=(c.t+c.to)/2;
        if(REFS.length&&!REFS.some(r=>(c.ref||'').endsWith(' '+r))) continue;
        await page.evaluate(async P=>{ STAGE.seek(P.mid);
          for(let k=0;k<P.FR;k++){ STAGE.seek(P.mid); await new Promise(r=>requestAnimationFrame(r)); } },{mid,FR});
        const file=path.join(dir,String(i+1).padStart(2,'0')+'-'+(c.ref||'t'+mid).replace(/[^A-Za-z0-9]+/g,'_')+'.png');
        await page.screenshot({path:file});
        index.push({scene:S.id,n:i+1,t:mid,ref:c.ref,text:c.text,file}); }
      const se=[...new Set(errs.slice(e0).map(e=>e.split('\n')[0]))];
      if(se.length){ bad++; console.log(S.id+': page errors:\n  '+se.join('\n  ')); }
      console.log(S.id.padEnd(14)+(se.length||empty.length?'':'ok')+'  '+caps.caps.length+' captions, '+Math.round(S.dur)+' s');
    }
    await page.evaluate(()=>STORY.end(true));
  } finally { await browser.close(); }
  fs.writeFileSync(path.join(outDir,'index.json'),JSON.stringify(index,null,1));
  console.log(bad?'\n'+bad+' problems':'\nevery scene played and every caption has its words');
  process.exit(bad?1:0);
})();
