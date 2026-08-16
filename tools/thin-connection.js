/* THE THIN CONNECTION — the world served over http by a server that DROPS a
   named file, so that the manifest's promises can be seen kept rather than
   read in a comment.

     node tools/thin-connection.js          all six trials
     node tools/thin-connection.js 3        only the third

   ---- WHAT THIS IS FOR ----
   A player opened the game and got: "THE VOYAGE COULD NOT BEGIN — A file of
   the world could not be read: could not read creatures/jerboa.js". The file
   was there. It was committed, it parsed, it loaded on every machine here.
   It simply did not arrive that once — and the manifest appended all three
   hundred and sixty-five <script> tags in one go, so ONE onerror rejected
   the whole promise and a world of a hundred and seventy-six countries
   refused to start over one gerbil.

   The mending is in world/manifest.js: ordered batches, three askings per
   file, and a rule for what may be let go of. The rule has two halves and
   both must hold —

     A CREATURE OR A CITY is looked up by NAME. Losing one costs one beast or
     one town, so the voyage sails and says which.

     A COUNTRY OR A BLOCK is POSITIONAL: its id is the file's place in the
     manifest. Losing one would shift every id after it and build a different
     world under the same save file. That must stop the boot, and say why.

   Nothing here is moved on disk. The repository is served read-only and the
   dropping is done by the server, which is also nearer the truth: a phone on
   a thin connection, a scanner sitting on the disk, a proxy having a bad
   minute. It is not a rare event; it is a Tuesday.

   Acceptance test 36 keeps the cheap half of this (the ids still match their
   places) on every suite run. This is the dear half, and it is run by hand.
*/
const http=require('http'), fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..');
let chromium;
try{ ({chromium}=require('playwright')); }
catch(e){ ({chromium}=require(require('child_process')
  .execSync('npm root -g').toString().trim()+'/playwright')); }

const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css',
  '.png':'image/png','.svg':'image/svg+xml','.json':'application/json'};

/* THE SIX TRIALS. `drop` is how many times the file is refused before it is
   served; 99 means it never comes at all. `want` is what must happen. */
const TRIALS=[
  {n:1, say:'the whole world, nothing dropped',
   file:null, drop:0, page:'index.html', want:'stands', lost:0},
  {n:2, say:'a creature dropped twice and served the third time — the asking again',
   file:'creatures/jerboa.js', drop:2, page:'index.html', want:'stands', lost:0},
  {n:3, say:'a creature that never comes — one beast short, and the world sails',
   file:'creatures/jerboa.js', drop:99, page:'index.html', want:'stands', lost:1,
   says:/short one thing/},
  {n:4, say:'a block that never comes — positional, so the voyage must refuse',
   file:'blocks/stone.js', drop:99, page:'index.html', want:'refuses',
   says:/cannot stand without it/},
  {n:5, say:'a country that never comes — positional likewise',
   file:'countries/fiji.js', drop:99, page:'index.html', want:'refuses',
   says:/cannot stand without it/},
  {n:6, say:'SCRIPTURE UNFOLDS raises the same world short a creature',
   file:'creatures/jerboa.js', drop:99, page:'scripture-unfolds/index.html',
   want:'stands', lost:1},
];

function serve(target,drops,state){
  return http.createServer((req,res)=>{
    const rel=decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/,'')||'index.html';
    if(target&&rel===target){
      state.asked++;
      if(state.asked<=drops){ res.writeHead(503); res.end('dropped'); return; }
    }
    const f=path.join(ROOT,rel);
    if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){
      res.writeHead(404); res.end('no such file'); return; }
    res.writeHead(200,{'content-type':MIME[path.extname(f)]||'application/octet-stream'});
    fs.createReadStream(f).pipe(res);
  });
}

async function trial(t){
  const state={asked:0};
  const srv=serve(t.file,t.drop,state);
  await new Promise(r=>srv.listen(0,'127.0.0.1',r));
  const port=srv.address().port;
  const browser=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader',
    '--disable-gpu-sandbox','--no-sandbox','--ignore-gpu-blocklist']});
  const page=await browser.newPage({viewport:{width:1000,height:640}});
  const errs=[];
  page.on('pageerror',e=>errs.push(String(e&&e.message||e)));
  page.on('console',m=>{ if(m.type()==='error') errs.push(m.text()); });
  try{
    await page.goto('http://127.0.0.1:'+port+'/'+t.page);
    const r=await page.waitForFunction(()=>{
      const b=document.getElementById('boot');
      const txt=b&&getComputedStyle(b).display!=='none'?(b.textContent||''):'';
      if(/could not begin|could not be read/i.test(txt))
        return {refused:txt.replace(/\s+/g,' ').trim()};
      const m=document.getElementById('menu');
      if(m&&getComputedStyle(m).display!=='none') return {stood:true};
      const u=document.getElementById('u-list');
      if(u&&u.children.length) return {stood:true};
      return false;
    },null,{timeout:180000}).then(h=>h.jsonValue());

    const w=await page.evaluate(()=>({
      lost:(window.MANIFEST&&MANIFEST.lost)||[],
      countries:(window.EARTH&&EARTH.list.length)||0,
      blocks:(window.EARTH&&EARTH.blockList.length)||0,
      beasts:(window.EARTH&&EARTH.beastList.length)||0,
      cities:(window.EARTH&&EARTH.cityList.length)||0,
      said:(function(){ const e=document.getElementById('m-short');
        return e&&getComputedStyle(e).display!=='none'?e.textContent.replace(/\s+/g,' ').trim():''; })()
    })).catch(()=>({lost:[],countries:0,blocks:0,beasts:0,cities:0,said:''}));

    const faults=[];
    const did=r.refused?'refuses':'stands';
    if(did!==t.want) faults.push('it '+did+', and it was to '+t.want);
    if(t.lost!=null&&w.lost.length!==t.lost)
      faults.push('gave up on '+w.lost.length+' and was to give up on '+t.lost);
    /* it must SAY so — a silent loss is the fault this whole file is about */
    if(t.says){
      const heard=r.refused||w.said||'';
      if(!t.says.test(heard)) faults.push('said nothing of it: "'+heard.slice(0,80)+'"');
    }
    /* and whatever stands must be WHOLE but for what was declared */
    if(did==='stands'){
      if(w.countries!==176) faults.push('countries: '+w.countries);
      if(w.blocks!==42) faults.push('blocks: '+w.blocks);
      const shy=t.lost&&/^creatures\//.test(t.file||'')?1:0;
      if(w.beasts!==150-shy) faults.push('beasts: '+w.beasts+' of '+(150-shy));
    }
    /* the CDN cannot be reached from a sandbox and the page falls back to the
       shipped three.js; the dropped file's own 503s are the point of the run */
    const real=errs.filter(e=>!/ERR_TUNNEL|503|Service Unavailable/.test(e));
    if(real.length) faults.push('errors: '+real.slice(0,2).join(' | '));

    return {ok:!faults.length,
      got:'asked '+state.asked+'× · '+did+' · '+w.countries+' countries, '+w.blocks+
        ' blocks, '+w.beasts+' beasts, '+w.cities+' cities · lost '+
        (w.lost.length?w.lost.join(', '):'nothing')+
        (faults.length?'\n         '+faults.join('\n         '):'')};
  }catch(e){ return {ok:false, got:'the trial itself broke: '+(e&&e.message||e)}; }
  finally{ await browser.close(); srv.close(); }
}

(async()=>{
  const want=process.argv.slice(2).filter(a=>/^\d+$/.test(a)).map(Number);
  const run=TRIALS.filter(t=>!want.length||want.includes(t.n));
  let pass=0, fail=0;
  console.log('THE THIN CONNECTION — '+run.length+' trial'+(run.length===1?'':'s')+'\n');
  for(const t of run){
    const r=await trial(t);
    if(r.ok) pass++; else fail++;
    console.log((r.ok?'  ✓ ':'  ✗ ')+t.n+'. '+t.say+'\n       '+r.got+'\n');
  }
  console.log(pass+' kept · '+fail+' broken');
  process.exit(fail?1:0);
})();
