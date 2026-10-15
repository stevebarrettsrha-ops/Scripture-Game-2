/* THE STORY SEEN — a scene of THE FULLNESS OF TIME photographed at the verses named.

     node tools/storyshot.js <act> <scene> <outDir> "<REF>" ["<REF>" ...]
     node tools/storyshot.js prologue vision shots "YASHAYAHU 6:1" "YASHAYAHU 6:3"

   The scene is run by the engine's own fast hand up to each verse named (ST.stopAt), held there
   while the world is drawn about the eye, and photographed as the player sees it, the verse on
   the screen. EARTH=1 for the small map; the true earth is the default. */
const {open}=require('./harness.js');
const fs=require('fs'), path=require('path');
(async()=>{
  const [act,scene,outDir,...refs]=process.argv.slice(2);
  if(!act||!scene||!outDir||!refs.length){ console.log('usage: node tools/storyshot.js <act> <scene> <outDir> "<REF>" ...'); process.exit(2); }
  fs.mkdirSync(outDir,{recursive:true});
  const shell=fs.readFileSync(path.join(__dirname,'..','story','shell.js'),'utf8');
  const R=[...shell.matchAll(/\{id:'([^']+)',\s*page:'([^']+)'/g)].find(m=>m[1]===act);
  if(!R){ console.log('no such act: '+act); process.exit(2); }
  const {browser,page,errs}=await open({page:'story/'+R[2],inject:{worldK:process.env.EARTH||'true'},w:1280,h:720});
  try{
    page.setDefaultTimeout(1800000);
    await page.waitForFunction(()=>window.__STORY&&window.__STORY.running,null,{timeout:1800000});
    await page.evaluate(P=>{ const S=window.__STORY, a=S.ST.acts.find(q=>q.id===P.act);
      const si=a.scenes.findIndex(s=>s.id===P.scene); if(si<0) throw new Error('no scene '+P.scene);
      S.run(P.act,si); },{act,scene});
    for(let i=0;i<refs.length;i++){
      const ok=await page.evaluate(async P=>{ const S=window.__STORY, ST=S.ST;
        ST.stopAt=b=>b.ref===P.ref; ST.fast=true;
        if(P.i>0) S.advance();
        for(let k=0;k<4000&&ST.fast;k++) await new Promise(r=>requestAnimationFrame(r));
        const there=!ST.fast&&S.beat&&S.beat.ref===P.ref; ST.fast=false; ST.stopAt=null;
        /* let the eye settle and the ground about it be built */
        for(let k=0;k<90;k++) await new Promise(r=>requestAnimationFrame(r));
        return there; },{ref:refs[i],i});
      const file=path.join(outDir,act+'-'+scene+'-'+String(i+1).padStart(2,'0')+'-'+refs[i].replace(/[^A-Za-z0-9]+/g,'_')+'.png');
      await page.screenshot({path:file});
      console.log((ok?'':'(did not reach the verse) ')+file);
    }
    if(errs.length) console.log('page errors:\n  '+[...new Set(errs.map(e=>e.split('\n')[0]))].join('\n  '));
  } finally { await browser.close(); }
})();
