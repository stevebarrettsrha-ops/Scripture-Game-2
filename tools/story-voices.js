/* STORY VOICES — every line that can be heard in The Fullness of Time, with its speaker and its
   recording key, for tools/voices/story-build.py to record (the way Scripture-Game's
   tools/voices/extract.js feeds its build.py).

     node tools/story-voices.js            → story/voices/lines.json

   It runs the story's own voice.js and acts — the same code the game plays them with — so
   each verse is cut at the same marks, each part given to the same speaker, and each key is
   the one the game will look for. The narrator reads the telling; each quotation is the
   one the Besorah says spoke it; the Voice of (YAHUAH) HWHY is his own. */
const fs=require('fs'), path=require('path'), vm=require('vm');
const DIR=path.join(__dirname,'..','story');
const win={};
vm.runInNewContext(fs.readFileSync(path.join(DIR,'voice.js'),'utf8'),
  {window:win,addEventListener(){},setInterval(){},localStorage:{getItem(){return null;},setItem(){}},performance:{now:()=>0},console});
const V=win.STORYVOICE;
const TEXT={}, acts=[];
const STORY={act:a=>acts.push(a),codex(){},scripture:t=>Object.assign(TEXT,t)};
vm.runInNewContext(fs.readFileSync(path.join(DIR,'scripture.js'),'utf8'),{STORY});
for(const f of fs.readdirSync(path.join(DIR,'acts')).sort()) if(f.endsWith('.js'))
  vm.runInNewContext(fs.readFileSync(path.join(DIR,'acts',f),'utf8'),{STORY,Math,Object,Array,console});

/* the name a person is cast by — the same names Scripture-Game's cast.json keeps, so one
   person has one voice in both games: the first name, without its marks (Gaḇri’al is
   gabrial). He whom this story follows is not the Yahusha son of Nun of the other
   books, and is cast by a name of His own. */
function castName(sp){
  if(sp.kind==='narrator') return 'narrator';
  if(sp.kind==='divine') return 'divine';
  if(sp.kind==='yahusha') return 'yahusha mashiach';
  const k=sp.key.replace(/^(the|a|an)\s+/,'');
  return /^(crowds?|shepherds|magi|heavenly|devil|trier|two|tax|soldiers|those|chief|kohanim|another|man|widow|old)\b/.test(k)?k:k.split(/[\s,]+/)[0];
}
const items=new Map(); let missing=0;
for(const a of acts) for(const sc of a.scenes||[]){
  const defs={}; for(const x of sc.actors||[]) defs[x.id]=x;
  for(const B of sc.beats||[]){
    if(!(B.t==='read'||B.t==='say')||!B.ref) continue;
    const e=TEXT[B.ref]; if(!e){ missing++; console.error('not emitted: '+B.ref); continue; }
    const segs=V.segs(e.t,B,s=>V.speaker(s,defs,a.cast)||{key:'unknown',kind:'man'},V.NARR);
    for(const g of segs){
      const kk=V.speakable(g.text,true); if(!/[A-Za-z]/.test(kk)) continue;
      const key=V.clipKey(g.sp,g.text); if(items.has(key)) continue;
      items.set(key,{key,kind:g.sp.kind,name:castName(g.sp),who:g.sp.name||g.sp.key,text:g.text,kk,where:a.id+'/'+sc.id+' '+B.ref});
    }
  }
}
const out=path.join(DIR,'voices','lines.json');
fs.mkdirSync(path.dirname(out),{recursive:true});
fs.writeFileSync(out,JSON.stringify({'story':{items:[...items.values()]}},null,1));
const by={}; for(const it of items.values()) by[it.name]=(by[it.name]||0)+1;
console.log(items.size+' lines to be heard'+(missing?' · '+missing+' passages not emitted':'')+'\n'+
  Object.entries(by).sort((a,b)=>b[1]-a[1]).map(([n,c])=>'  '+n+': '+c).join('\n'));
