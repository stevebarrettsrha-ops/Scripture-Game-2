#!/usr/bin/env node
/* THE VOYAGE, played from this computer — the same server as local/serve.py, for a machine
   that has Node.js but no Python. Serves the game's folder on 127.0.0.1 only (never the
   network), opens the default browser, and serves until this window is closed.

     node local/serve.js [voyage|story|unfolds] [--port 8642] [--idle-minutes 0] [--no-browser]

   The port stays the same so the browser keeps the same saves; a running instance is reused. */
const http=require('http'), fs=require('fs'), path=require('path'), {spawn}=require('child_process');
const ROOT=path.resolve(__dirname,'..'), SIGNATURE='scripture-game-local';
const PAGES={voyage:'index.html',story:'story/index.html',unfolds:'scripture-unfolds/index.html'};
const TYPES={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8',
  '.json':'application/json','.webm':'audio/webm','.ogg':'audio/ogg','.mp3':'audio/mpeg','.wav':'audio/wav',
  '.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon',
  '.woff2':'font/woff2','.txt':'text/plain; charset=utf-8','.md':'text/plain; charset=utf-8'};

/* THE SAVES FOLDER (local/saves.js): progress kept in files in saves/ beside the game, the edited
   pieces of the world in saves/world/. Only names of this shape are read or written. */
const SAVES=path.join(ROOT,'saves'), SAVE_NAME=/^(world\/)?[A-Za-z0-9._~-]{1,160}\.json$/, SAVE_MAX=64*1024*1024;
function saves(req,res,p){
  if(p==='/__saves'&&req.method==='GET'){ const files={};
    for(const sub of ['','world/']){ let list=[]; try{ list=fs.readdirSync(path.join(SAVES,sub)); }catch(e){}
      for(const f of list){ if(!SAVE_NAME.test(sub+f)) continue; try{ const fp=path.join(SAVES,sub,f); if(fs.statSync(fp).isFile()) files[sub+f]=fs.readFileSync(fp,'utf8'); }catch(e){} } }
    res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-cache'}); res.end(JSON.stringify({files})); return; }
  const name=p.slice('/__saves/'.length);
  if(!SAVE_NAME.test(name)){ res.writeHead(403).end('Forbidden'); return; }
  const f=path.join(SAVES,...name.split('/'));
  if(req.method==='DELETE'){ fs.rm(f,{force:true},()=>res.writeHead(200).end('removed')); return; }
  if(req.method!=='PUT'){ res.writeHead(405).end(); return; }
  const parts=[]; let n=0;
  req.on('data',d=>{ n+=d.length; if(n>SAVE_MAX){ req.destroy(); return; } parts.push(d); });
  req.on('end',()=>{ try{ fs.mkdirSync(path.dirname(f),{recursive:true}); fs.writeFileSync(f+'.tmp',Buffer.concat(parts)); fs.renameSync(f+'.tmp',f);
      res.writeHead(200).end('saved'); }catch(e){ fs.rm(f+'.tmp',{force:true},()=>{}); res.writeHead(500).end('not saved'); } }); }

const argv=process.argv.slice(2), opt={page:'voyage',port:8642,idle:0,browser:true};
for(let i=0;i<argv.length;i++){ const a=argv[i];
  if(a==='--port') opt.port=+argv[++i]; else if(a==='--idle-minutes') opt.idle=+argv[++i];
  else if(a==='--no-browser') opt.browser=false; else if(PAGES[a]) opt.page=a;
  else { console.error('usage: node local/serve.js [voyage|story|unfolds] [--port N] [--idle-minutes N] [--no-browser]'); process.exit(2); } }

function openBrowser(url){
  const [cmd,args]=process.platform==='win32'?['cmd',['/c','start','',url]]:process.platform==='darwin'?['open',[url]]:['xdg-open',[url]];
  try{ spawn(cmd,args,{stdio:'ignore',detached:true}).unref(); }catch(e){ console.log('Open this address in your browser: '+url); } }

function ours(port){ return new Promise(res=>{
  const r=http.get({host:'127.0.0.1',port,path:'/__scripture_game',timeout:1500},s=>{ let b=''; s.on('data',d=>b+=d); s.on('end',()=>res(b===SIGNATURE)); });
  r.on('error',()=>res(false)); r.on('timeout',()=>{ r.destroy(); res(false); }); }); }

let last=Date.now();
function handle(req,res){
  last=Date.now();
  let p; try{ p=decodeURIComponent(new URL(req.url,'http://x').pathname); }catch(e){ res.writeHead(400).end(); return; }
  if(p==='/__saves'||p.startsWith('/__saves/')){ saves(req,res,p); return; }
  if(p==='/__scripture_game'){ res.writeHead(200,{'Content-Type':'text/plain'}); res.end(SIGNATURE); return; }
  let f=path.join(ROOT,path.normalize(p));
  if(f!==ROOT&&!f.startsWith(ROOT+path.sep)){ res.writeHead(403).end(); return; }     /* never outside the game's folder */
  fs.stat(f,(e,st)=>{
    if(!e&&st.isDirectory()){ f=path.join(f,'index.html'); try{ st=fs.statSync(f); }catch(x){ e=x; } }
    if(e||!st.isFile()){ res.writeHead(404,{'Content-Type':'text/plain'}); res.end('Not found'); return; }
    const head={'Content-Type':TYPES[path.extname(f).toLowerCase()]||'application/octet-stream','Cache-Control':'no-cache','Accept-Ranges':'bytes'};
    const m=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range||'');
    if(m&&(m[1]||m[2])){ let a=m[1]?+m[1]:st.size-+m[2], b=m[1]&&m[2]?+m[2]:st.size-1;
      if(a>=st.size||a>b){ res.writeHead(416,{'Content-Range':'bytes */'+st.size}); res.end(); return; }
      res.writeHead(206,Object.assign(head,{'Content-Range':`bytes ${a}-${b}/${st.size}`,'Content-Length':b-a+1}));
      if(req.method==='HEAD') return res.end(); fs.createReadStream(f,{start:a,end:b}).pipe(res); return; }
    res.writeHead(200,Object.assign(head,{'Content-Length':st.size}));
    if(req.method==='HEAD') return res.end(); fs.createReadStream(f).pipe(res); }); }

(async()=>{
  for(let port=opt.port;port<opt.port+20;port++){
    const url=`http://127.0.0.1:${port}/${PAGES[opt.page]}`;
    if(await ours(port)){ console.log('THE VOYAGE is already running at '+url); if(opt.browser) openBrowser(url); return; }
    const srv=http.createServer(handle);
    const ok=await new Promise(r=>{ srv.once('error',()=>r(false)); srv.listen(port,'127.0.0.1',()=>r(true)); });
    if(!ok) continue;
    if(port!==opt.port) console.log(`Note: port ${opt.port} was busy, so ${port} is used. Saves made on one port are not seen on the other.`);
    console.log(`\n  THE VOYAGE is running on this computer at\n  ${url}\n\n  Leave this window open while you play. Close it (or press Ctrl+C) to stop.\n`);
    if(opt.browser) setTimeout(()=>openBrowser(url),400);
    if(opt.idle>0) setInterval(()=>{ if(Date.now()-last>opt.idle*60000) process.exit(0); },30000).unref();
    return; }
  console.error(`No free port between ${opt.port} and ${opt.port+19}.`); process.exit(1);
})();
