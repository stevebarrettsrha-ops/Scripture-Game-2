/* SCRIPTURE UNFOLDS, SEEN — every scroll on the shelf played on the true earth and photographed
   in the middle of every caption, so the world can be set beside the words it was told to show.

     node tools/unfoldshots.js <outDir>                every scene
     node tools/unfoldshots.js <outDir> creation eden  only these

   For each scene: every caption's words are drawn from the Besorah (a caption that comes back
   empty is reported), the stage is put at the middle of the caption (STAGE.seek) and held while
   the world is drawn about the eye, and the screen is taken. Page errors are reported per scene.
   <outDir>/<scene>/NN-<ref>.png, and <outDir>/index.json with the captions and their words.
   REFS="1:20,1:27" for only those captions. EARTH=1 for the small map; the true earth is the default.

   THE FACE RULE, ON EVERY FRAME. While a film is played here, every frame the page draws asks
   the stage (STAGE.faceRule) whether a holy figure is on the stage, whether its face is blank to
   the last pixel, and how near the eye stands to it; a frame that breaks the rule is reported,
   with the scene and the time. (Yahusha's face is never drawn; the eye keeps its distance.)

   EVERY=n photographs every nth caption only; every film is still gone through end to end, a quarter
   of a second at a time, with the face rule asked at each moment (nothing drawn — see `sweep`).

   LIBRARY=1: and then the Scroll Library and the whole Bible — the Library with no voyage (all
   open), the Library with a voyage that has gathered some scrolls and not others (gap cards), and
   the whole Bible's title card of an age, a gap card, a verse card and a film coming on:
   <outDir>/library/*.png */
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
    /* the face rule, asked on every frame the page draws */
    await page.evaluate(()=>{ const F=window.__FACE={frames:0,holy:0,bad:[]};
      const st=window.__STAGE_TICK; window.__STAGE_TICK=function(dt){ st(dt);
        if(!STORY.playing()||!STAGE.faceRule) return; const r=STAGE.faceRule(); F.frames++;
        if(r.holy.some(h=>h.shown)) F.holy++;
        if(!r.ok&&F.bad.length<40) F.bad.push({scene:STORY.playing().id,t:+STAGE.elapsed().toFixed(1),holy:r.holy}); }; });
    const scenes=await page.evaluate(()=>STORY.list().map(s=>({id:s.id,name:s.name,dur:s.stage[s.stage.length-1].t})));
    for(const S of scenes){
      if(only.length&&!only.includes(S.id)) continue;
      const e0=errs.length;
      const f0=await page.evaluate(()=>({frames:__FACE.frames,holy:__FACE.holy,bad:__FACE.bad.length}));
      const caps=await page.evaluate(async id=>{
        STORY.end(true);
        const ok=await STORY.play(id); if(!ok) return {err:'the scroll could not be opened'};
        const s=STORY.get(id);
        return {caps:(s.caps||[]).map(c=>{ const q=STORY.capText(c); return {t:c.t,to:c.to,text:q.text,ref:q.ref}; })};
      },S.id);
      if(caps.err){ bad++; console.log(S.id+': '+caps.err); continue; }
      const dir=path.join(outDir,S.id); fs.mkdirSync(dir,{recursive:true});
      /* THE WHOLE FILM, END TO END, a quarter of a second at a time: every key, player, thing and
         sign set as it would be at that moment, and the face rule asked at each — nothing drawn, so
         the whole length of every film can be gone through where only its captions are photographed */
      const sweep=await page.evaluate(()=>{ const d=STAGE.dur(); let n=0, holy=0; const badT=[]; let err=null;
        try{ for(let t=0;t<d-0.05;t+=0.25){ STAGE.seek(t); STAGE.tick(0); const r=STAGE.faceRule(); n++;
          if(r.holy.some(h=>h.shown)) holy++; if(!r.ok&&badT.length<6) badT.push({t:+t.toFixed(2),holy:r.holy}); } }
        catch(e){ err=String(e&&e.stack||e).split('\n').slice(0,3).join(' | '); }
        STAGE.seek(0); return {n,holy,bad:badT,err}; });
      if(sweep.err){ bad++; console.log(S.id+': the film could not be gone through: '+sweep.err); }
      if(sweep.bad.length){ bad++; console.log(S.id+': THE FACE RULE BROKEN at '+JSON.stringify(sweep.bad)); }
      const empty=caps.caps.filter(c=>!c.text||!c.text.trim());
      if(empty.length){ bad++; console.log(S.id+': '+empty.length+' caption(s) came back with no words: '+empty.map(c=>c.ref||('@'+c.t)).join(', ')); }
      const REFS=(process.env.REFS||'').split(',').map(x=>x.trim()).filter(Boolean);   /* REFS="1:20,3:2": only the captions that open on that verse (3:2 finds 3:2-3, never 3:21) */
      const EVERY=+(process.env.EVERY||1);           /* EVERY=2: every other caption photographed (and the last) */
      for(let i=0;i<caps.caps.length;i++){ const c=caps.caps[i], mid=(c.t+c.to)/2;
        if(EVERY>1&&i%EVERY&&i!==caps.caps.length-1) continue;
        if(REFS.length&&!REFS.some(r=>new RegExp('\\s'+r.replace(/[.:]/g,'\\$&')+'(?:[-–][0-9:]+)?$').test(c.ref||''))) continue;
        await page.evaluate(async P=>{ STAGE.seek(P.mid);
          for(let k=0;k<P.FR;k++){ STAGE.seek(P.mid); await new Promise(r=>requestAnimationFrame(r)); } },{mid,FR});
        const file=path.join(dir,String(i+1).padStart(2,'0')+'-'+(c.ref||'t'+mid).replace(/[^A-Za-z0-9]+/g,'_')+'.png');
        await page.screenshot({path:file});
        const face=await page.evaluate(()=>STAGE.faceRule?STAGE.faceRule():null);
        index.push({scene:S.id,n:i+1,t:mid,ref:c.ref,text:c.text,file,face}); }
      const se=[...new Set(errs.slice(e0).map(e=>e.split('\n')[0]))];
      if(se.length){ bad++; console.log(S.id+': page errors:\n  '+se.join('\n  ')); }
      const f1=await page.evaluate(()=>({frames:__FACE.frames,holy:__FACE.holy,bad:__FACE.bad.length,last:__FACE.bad.slice(-3)}));
      const holyFrames=f1.holy-f0.holy, faceBad=f1.bad-f0.bad;
      if(faceBad){ bad++; console.log(S.id+': THE FACE RULE BROKEN on '+faceBad+' frame(s): '+JSON.stringify(f1.last)); }
      console.log(S.id.padEnd(14)+(se.length||empty.length||faceBad?'':'ok')+'  '+caps.caps.length+' captions, '+Math.round(S.dur)+' s'+
        '  · gone through end to end at '+sweep.n+' moments'+(sweep.holy?', He is on the stage at '+sweep.holy+' and His face is blank and kept at each':'')+
        (holyFrames?'  · and on '+holyFrames+' of '+(f1.frames-f0.frames)+' frames drawn':''));
    }
    await page.evaluate(()=>STORY.end(true));

    /* ================= THE LIBRARY, AND THE WHOLE BIBLE ================= */
    if(process.env.LIBRARY){
      const L=path.join(outDir,'library'); fs.mkdirSync(L,{recursive:true});
      const frames=async n=>page.evaluate(async n=>{ for(let k=0;k<n;k++) await new Promise(r=>requestAnimationFrame(r)); },n);
      const e0=errs.length;
      /* 1 — no voyage: everything open */
      const all=await page.evaluate(()=>{ localStorage.removeItem('voyage:state'); STORY.end(true);
        window.__STORY_DONE(); const l=__UNFOLD.library(); return {n:l.length,open:l.filter(e=>e.open).length,films:l.filter(e=>e.film).length}; });
      await frames(6); await page.screenshot({path:path.join(L,'01-library-all-open.png')});
      console.log('library       no voyage: '+all.open+' of '+all.n+' open, '+all.films+' with a film');
      /* 2 — a voyage that has gathered some, and not the rest */
      const GOT=['bereshith','adam-eve-1','flood','abram','moriyah','shamoth','yericho','golyath','birth','tomb','hazon'];
      const some=await page.evaluate(G=>{ localStorage.setItem('voyage:state',JSON.stringify({v:8,sr:G})); __UNFOLD.rebuild();
        const l=__UNFOLD.library(); return {n:l.length,open:l.filter(e=>e.open).length,gaps:l.filter(e=>!e.open).map(e=>e.title+' — '+e.where.join(' · '))}; },GOT);
      await frames(4); await page.screenshot({path:path.join(L,'02-library-gaps-top.png')});
      await page.evaluate(()=>{ const l=document.getElementById('shelf-list'); l.scrollTop=l.scrollHeight*0.45; }); await frames(3);
      await page.screenshot({path:path.join(L,'03-library-gaps-middle.png')});
      await page.evaluate(()=>{ const l=document.getElementById('shelf-list'); l.scrollTop=l.scrollHeight; }); await frames(3);
      await page.screenshot({path:path.join(L,'04-library-gaps-end.png')});
      console.log('library       a voyage with '+GOT.length+' scrolls taken: '+some.open+' of '+some.n+' open; the gaps say:');
      for(const g of some.gaps.slice(0,40)) console.log('                '+g);
      /* 3 — the whole Bible: its first card, a gap card, a verse card, and a film coming on */
      const seq=await page.evaluate(()=>{ __UNFOLD.bible(); return LIBRARY.seq().map(x=>x.kind+(x.age?':'+x.age:x.e?':'+x.e.scrolls[0]:'')); });
      console.log('whole Bible   '+seq.length+' pieces: '+seq.join(' '));
      const shoot=async(name,t)=>{ await page.evaluate(async t=>{ for(let k=0;k<8;k++){ STAGE.seek(t); await new Promise(r=>requestAnimationFrame(r)); } },t);
        const s=await page.evaluate(()=>({id:STORY.playing()&&STORY.playing().id,title:document.getElementById('sc-title').textContent,card:document.getElementById('sc-card').textContent,cap:document.getElementById('sc-cap-t').textContent,ref:document.getElementById('sc-cap-r').textContent,bible:document.getElementById('sc-bible').textContent}));
        await page.screenshot({path:path.join(L,name)}); console.log('  '+name.padEnd(28)+JSON.stringify(s)); };
      await shoot('05-bible-age-card.png',3.0);
      const go=async kind=>page.evaluate(async k=>{ const s=LIBRARY.seq(); let i=LIBRARY.at()+1; while(i<s.length&&s[i].kind!==k) i++;
        if(i>=s.length) return false; LIBRARY.jump(i);
        for(let n=0;n<600&&!(STORY.playing()&&LIBRARY.at()===i);n++) await new Promise(r=>setTimeout(r,50)); return LIBRARY.at()===i&&!!STORY.playing(); },kind);
      if(await go('gap')) await shoot('06-bible-gap-card.png',3.5);
      if(await go('verse')) await shoot('07-bible-verse-card.png',6.0);
      if(await go('film')) await shoot('08-bible-film-on.png',8.0);
      await page.evaluate(()=>STORY.skip('Escape')); await frames(10);
      const back=await page.evaluate(()=>({bible:LIBRARY.running(),shelf:document.getElementById('shelf').style.display}));
      console.log('ESC leaves the whole Bible: '+(back.bible?'NO, it runs on':'yes')+', and the Library is '+(back.shelf==='block'?'back':'NOT back'));
      if(back.bible||back.shelf!=='block') bad++;
      const se=[...new Set(errs.slice(e0).map(e=>e.split('\n')[0]))];
      if(se.length){ bad++; console.log('library: page errors:\n  '+se.join('\n  ')); }
    }
  } finally { await browser.close(); }
  fs.writeFileSync(path.join(outDir,'index.json'),JSON.stringify(index,null,1));
  console.log(bad?'\n'+bad+' problems':'\nevery scene played and every caption has its words');
  process.exit(bad?1:0);
})();
