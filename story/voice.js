/* THE FULLNESS OF TIME — the spoken word, and whose words they are.

   Taken from the way Scripture-Game (stevebarrettsrha-ops/Scripture-Game, voice.js and face.js)
   gives every verse its voices:

   · A verse is read in PARTS. The telling is the narrator's (the Besorah); the words inside
     its quotation marks are spoken by the one the Besorah says spoke them — a mal'ak, a
     sovereign, a mother, the crowds, the voice out of the shamayim. A quotation inside a
     quotation (‘…’) stays with the one quoting it: when Yahuchanon says "as the naḇi
     Yahshayahu said", it is still Yahuchanon speaking.
   · Every line is RECORDED, in the voices of Scripture-Game's cast (Kokoro, offline): the
     narrator one warm voice; men, women, elders and a boy each their own; the Voice of
     (YAHUAH) HWHY the deepest, slow and low, given to no one else. Nothing is spoken by
     the device's own voices.
   · The one speaking moves the mouth with the words, vowel by vowel, and the face shows
     what the words carry (only joy turns a mouth up). With the voices off, the mouths keep
     the pace of reading instead, so a speaker is never seen silent.

   Nothing here changes a word. The parts are cut from the Besorah's text at its own marks,
   and put side by side they are that text, letter for letter. */
(function(){
'use strict';
const W=window;
const now=()=>(W.performance&&performance.now)?performance.now():Date.now();
const cl=(v,a,b)=>v<a?a:v>b?b:v;
const store={ get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } },
              set(k,v){ try{ localStorage.setItem(k,v); }catch(e){} } };
const V=W.STORYVOICE={ on:store.get('fullness:voices')!=='0', rate:1 };

/* ================= WHOSE WORDS: the quotation marks ================= */
/* the verse cut at its own marks: [{a,b,q}] — q is a quotation (depth one); a ‘…’ inside a
   “…” is part of the outer one. The same rule as Scripture-Game's quoteSpans. */
function quoteSpans(text){
  const out=[]; let depth=0, start=0;
  for(let i=0;i<text.length;i++){
    let ch=text[i];
    /* the Besorah sometimes opens a verse of a running speech with ” set hard against its
       first word ("… Yahusha. ”He shall be great"): that mark opens, it does not close */
    if(ch==='”'&&/[A-Za-zÀ-ɏḀ-ỿ]/.test(text[i+1]||'')&&(i===0||/\s/.test(text[i-1]))) ch='“';
    if(ch==='“'||(ch==='"'&&depth===0)){
      if(depth===0){ if(i>start) out.push({a:start,b:i,q:false}); start=i; }
      else if(depth===1&&ch==='“'){ const mid=text.slice(start+1,i);        /* a speech running on re-opens its mark */
        if((mid.match(/‘/g)||[]).length<=(mid.match(/’(?![A-Za-zÀ-ɏḀ-ỿ])/g)||[]).length) continue; }
      depth++; }
    else if(ch==='”'||(ch==='"'&&depth>0)){ if(depth>0&&--depth===0){ out.push({a:start,b:i+1,q:true}); start=i+1; } }
  }
  if(start<text.length) out.push({a:start,b:text.length,q:depth>0});
  return out;
}
/* A verse whose words run on from the verse before opens with no mark and closes one
   (“… and the rule is on His shoulder.”): its opening words are still a quotation. */
function parts(text){
  const sp=quoteSpans(text);
  const c=text.indexOf('”'), o=text.indexOf('“');
  if(sp.length&&!sp[0].q&&c>=0&&(o<0||c<o)){                    /* the tail of a speech begun before */
    const first={a:0,b:c+1,q:true}, rest=quoteSpans(text.slice(c+1)).map(s=>({a:s.a+c+1,b:s.b+c+1,q:s.q}));
    return [first,...rest].filter(s=>s.b>s.a);
  }
  return sp.filter(s=>s.b>s.a);
}
V.quoteSpans=quoteSpans; V.parts=parts;
/* WHO A SPEAKER IS: spec is a figure of the scene (actors: id → its definition), one of
   the act's cast, 'narrator', or a plain name. The key keeps one person one voice through
   the whole story; the kind is the sort of voice. */
const NARR=V.NARR={key:'narrator',kind:'narrator',name:'The Besorah'};
const keyOf=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[‘’ʼ'`´ʿʾ‛]/g,'').toLowerCase().trim();
V.nameKey=keyOf;
const kindOf=a=>a.kind||(a.fallen?'dark':a.holy?'yahusha':a.small?'boy':a.beard===0x6d6a66?'oldman':'man');
V.speaker=function(spec,actors,cast){
  if(spec&&typeof spec==='object') return Object.assign({kind:'man'},spec,{key:keyOf(spec.key||spec.name)});
  if(typeof spec!=='string') return null;
  if(spec==='narrator') return NARR;
  const a=actors&&actors[spec];
  if(a){ const name=a.name||''; return {id:spec,actor:spec,name,key:keyOf(a.key||name||spec),kind:kindOf(a),look:a}; }
  const c=cast&&cast[spec];
  if(c){ const look=c.actor&&actors&&actors[c.actor]?actors[c.actor]:c.look;
    return Object.assign({kind:'man'},c,{id:spec,key:keyOf(c.key||c.name),look}); }
  return {name:spec,key:keyOf(spec),kind:'man'};
};
/* THE PARTS OF A VERSE AND WHO SAYS EACH — one rule, used by the game as it plays and by
   tools/story-voices.js as it lists the lines to record, so the two can never disagree.
   B: the beat (who / whoName / voices / teller); who(spec) resolves a speaker; NARR the
   narrator. A verse with no marks given to one who speaks it (the naḇi's own words) is
   wholly theirs; `teller` gives the telling itself to the one whose book it is. */
V.segs=function(t,B,who,NARR){
  const P=parts(t), isQ=p=>p.q&&/[A-Za-zÀ-ɏḀ-ỿ]/.test(t.slice(p.a,p.b));
  const n=P.filter(isQ).length, list=B.voices||[], base=B.who||B.whoName, sps=[];
  for(let k=0;k<n;k++) sps.push(who(list.length?list[Math.min(k,list.length-1)]:base));
  const teller=B.teller?who(B.teller):NARR;
  if(!n&&base) return [{text:t,q:true,sp:who(base)}];
  let qi=0;
  return P.map(p=>{ const q=isQ(p); return {text:t.slice(p.a,p.b),q:q||teller!==NARR,sp:q?sps[qi++]:teller}; });
};
/* one line, one speaker, one recording: the key is the speaker's part and the words */
function fnv(s,seed){ let h=seed>>>0; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); } return h>>>0; }
V.clipKey=function(sp,text){
  const s=(sp.kind||'man')+':'+(sp.key||'')+'|'+String(text||'').replace(/\s+/g,' ').trim();
  return fnv(s,2166136261).toString(16).padStart(8,'0')+(fnv(s,0x811c9dc5^0x5bd1e995)&0xffff).toString(16).padStart(4,'0');
};
/* THE NARRATOR'S OTHER LINES — the titles, the notes on the history, the cards of the
   seven hundred years, and what follows your choices: all read in the narrator's voice,
   and all recorded. One rule for the game and the recorder. */
V.cardLines=function(B){
  if(B.t==='title') return [B.text+(B.sub?'. '+B.sub:'')];
  if(B.t==='note') return [B.text];
  if(B.t==='era') return [(B.head?B.head+'. ':'')+B.text];
  if(B.t==='choice') return (B.options||[]).filter(o=>o.reply).map(o=>o.reply);
  return [];
};
/* how many speakers a verse needs: one for each quotation in it */
V.quotes=t=>parts(t).filter(s=>s.q&&/[A-Za-zÀ-ɏḀ-ỿ]/.test(t.slice(s.a,s.b))).length;

/* ================= THE WORDS AS THEY ARE SAID ================= */
/* In plain English, as Scripture-Game says them: a name as its letters, the marks of the
   Hebrew vowels unsaid (Yardĕn is Yarden, Yaʿaqoḇ Yaaqob); ḥ and the ch of Ruach and Pesach
   a K; His Name, "(YAHUAH) HWHY", said once, as Yah-hoo-wah. */
const WORD_RE=/[A-Za-zÀ-ɏḀ-ỿ‘’‚‛ʻʼʹ׳'`´ʿʾ‛]+/g;
const GLOSS=/\s*\((?:Most Set Apart Place|Set Apart Ones|Set Apart One|Set Apart Place|Set Apart|Faithful|Sheol|which means[^)]*)\)/gi;
const HWHY=/\(\s*(YAHU[ĂA]H)\s*\)\s*HWHY/g;
const MARKS=/[‘’‚‛ʻʼʹ׳'`´ʿʾ‛]/g;
const HEB_CH={ruach:'ruahk',pesach:'pesahk',mashiach:'mashi-ahk',chen:'khen',baruch:'baruk',mizbeach:'miz-beh-ahk'};
/* the Besorah's names as they are said, spelled out for a voice that reads English
   (the hyphens keep a British voice from joining syllables with an r that is not there) */
const LEX={aluahim:'al-oo-ah-heem',yahusha:'yah-hoo-shah',yahuchanon:'yah-hoo-kah-nohn',yarden:'yar-den',
  yahrushalayim:'yah-roo-shah-lah-yeem',yahudah:'yah-hoo-dah',yahudim:'yah-hoo-deem',shamayim:'shah-mah-yeem',
  malak:'mahl-ahk',malakim:'mahl-ah-keem',yahshayahu:'yah-shah-yah-hoo',yashayahu:'yah-shah-yah-hoo',
  miryam:'meer-yahm',kepha:'kay-fah',shimon:'sheem-ohn',aliyahu:'ah-lee-yah-hoo',nabi:'nah-vee',
  haqadash:'hah-kah-dahsh',qadash:'kah-dahsh',qodash:'koh-dahsh',besorah:'beh-soh-rah',yasharal:'yah-shar-al',
  dawid:'dah-veed',gabrial:'gahv-ree-ahl',yoseph:'yoh-sef',natsareth:'nahts-ah-ret',galil:'gah-leel',
  beyth:'bayt',lehem:'leh-khem',immanual:'ee-mah-noo-ahl',hekal:'hay-kahl',zakaryahu:'zah-khar-yah-hoo',
  anyah:'ahn-yah',yahshai:'yah-shy',ahaz:'ah-khahz',ashshur:'ah-shoor',babal:'bah-vahl',babylon:'babylon',
  mitsrayim:'meets-rah-yeem',koresh:'koh-resh',danial:'dah-nee-ahl',kohanim:'koh-hah-neem',
  lewites:'lay-vites',andri:'ahn-dree',yonah:'yoh-nah',shalom:'shah-lohm',chen:'khen',torah:'toh-rah',
  mashiach:'mah-shee-ahk',ruach:'roo-ahk',pesach:'peh-sahk'};
const nameKey=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(MARKS,'').toLowerCase().trim();
function sayWord(w){
  const key=nameKey(w.replace(/[’'`´]s$/,''));
  if(key==='yahuah') return /[’'`´]s$/.test(w)?"Yah-hoo-wah's":'Yah-hoo-wah';
  if(LEX[key]) return LEX[key]+(/[’'`´]s$/.test(w)?'s':'');
  if(HEB_CH[key]) return HEB_CH[key];
  if(/^[A-Za-z]+[’'](s|t|re|ll|ve|d|m)$/i.test(w)) return w.replace(/[’`´]/,"'");
  let o=w.replace(/ḥ/g,'k').replace(/Ḥ/g,'K').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(MARKS,'');
  if(o.length>1&&o===o.toUpperCase()&&/[A-Z]/.test(o)) o=o.toLowerCase();       /* YASHAYAHU: a word, not letters */
  return o||w;
}
const ROMAN={I:'one',II:'two',III:'three',IV:'four',V:'five',VI:'six',VII:'seven',VIII:'eight'};
function speakable(text,rec){
  return String(text||'').replace(/\b(Act|Part) (VIII|VII|VI|IV|V|III|II|I)\b/g,(m,a,r)=>a+' '+ROMAN[r])
    .replace(/\bBCE\b/g,'B.C.E.').replace(/\bCE\b/g,'C.E.').replace(/\bc\.\s*(?=\d)/g,'about ').replace(/\bkm\b/g,'kilometres')
    .replace(GLOSS,'').replace(HWHY,'$1').replace(/\bHWHY\b/g,'YAHUAH')
    .replace(WORD_RE,w=>rec&&/^YAHUAH(?:[’']s)?$/.test(w)?w.replace(/[’']/,''):sayWord(w))
    .replace(/\s*[‐‑‒–—―−]+\s*|\s+-+\s*|-+(?![A-Za-z])/g,', ').replace(/…/g,', ').replace(/[;:]/g,',')
    .replace(/["`´“”‘’«»(){}\[\]<>|\\\/_~^*%#@$&+=§¶†‡•·✦]/g,' ')
    .replace(/\s+([,.!?])/g,'$1').replace(/([,.!?])(?:\s*[,.])+/g,'$1').replace(/^[\s,.]+/,'')
    .replace(/\s{2,}/g,' ').trim();
}
V.speakable=speakable;

/* ================= SPEAKING, AND THE MOUTH THAT MOVES WITH IT ================= */
/* V.talk: who is speaking now, and the words, and when they began — the mouths and the
   portrait read it. With the voices off, the same clock runs at the pace of reading, so
   the one speaking is still seen to speak. */
V.talk=null;
let gen=0, queue=[], onPart=null, onDone=null, dog=0;
const READ_CPS=15;
function stop(){ gen++; queue=[]; onPart=onDone=null; clearTimeout(dog); V.talk=null;
  if(playing){ try{ playing.pause(); playing.onended=playing.onerror=null; }catch(e){} playing=null; }
}
/* items: [{text, sp:{key,kind,id}}] in order; part(i) when each begins; done() at the end */
function play(items,part,done){
  stop(); const my=gen;
  queue=items.map((it,i)=>Object.assign({i},it)); onPart=part||null; onDone=done||null;
  next(my); }
function next(my){
  if(my!==gen) return;
  const q=queue.shift();
  if(!q){ V.talk=null; const d=onDone; onDone=null; if(d) d(); return; }
  if(onPart) onPart(q.i);
  const said=speakable(q.text);
  if(!said||!/[A-Za-z]/.test(said)){ next(my); return; }
  const clip=clipFor(q.sp,q.text);
  if(clip&&V.on&&!(W.STORY&&W.STORY.fast)&&!V.clipsBroken){ playClip(q,said,clip,my); return; }
  /* voices off, or a test running fast: the words keep the pace of reading, and the mouth
     with them. Every line the story says is RECORDED (tools/voices/story-build.py); there
     is no voice of the device's own. A line with no recording is a fault, and
     tools/extract-besorah.js --check fails on it. */
  const ms=(clip?clip.ms:said.length/READ_CPS*1000)/V.rate;
  V.talk={sp:q.sp,text:q.text,said,t0:now(),dur:ms};
  dog=setTimeout(()=>next(my),ms+250);
}
/* the recordings: story/voices/<key[:2]>/<key>.webm, listed with their lengths in
   story/voices/bank.js (window.STORY_VOICE_BANK), made by tools/voices/story-build.py with
   the voices of Scripture-Game's cast — the narrator's, the Voice of (YAHUAH) HWHY, and each
   person's own */
let canClip=null, playing=null;
function clipsOK(){ if(canClip===null){ try{ const a=document.createElement('audio'); canClip=!!(a.canPlayType&&a.canPlayType('audio/webm; codecs="opus"')); }catch(e){ canClip=false; } } return canClip; }
function clipFor(sp,text){
  const B=W.STORY_VOICE_BANK; if(!B||!B.k||!sp||!clipsOK()) return null;
  const k=V.clipKey(sp,text), ms=B.k[k]; if(!ms) return null;
  return {url:(B.base||'voices/')+k.slice(0,2)+'/'+k+'.webm',ms};
}
function playClip(q,said,clip,my){
  const a=new Audio(clip.url); playing=a; let done=false;
  const fin=ok=>{ if(done) return; done=true; clearTimeout(dog); a.onended=a.onerror=null; if(my!==gen) return; playing=null;
    if(ok) next(my); else { V.clipsBroken=true; queue.unshift(q); next(my); } };   /* a recording that will not play: the rest keep the pace of reading */
  a.onended=()=>fin(true); a.onerror=()=>fin(false);
  try{ a.playbackRate=V.rate; }catch(e){}
  V.talk={sp:q.sp,text:q.text,said,t0:now()+60,dur:Math.max(250,(clip.ms-220)/V.rate)};   /* the words lie between its short silences */
  dog=setTimeout(()=>fin(true),clip.ms/V.rate+4000);
  let p; try{ p=a.play(); }catch(e){ fin(false); return; }
  if(p&&p.catch) p.catch(err=>{ if(err&&err.name==='NotAllowedError'){ done=true; clearTimeout(dog); if(my!==gen) return;   /* no gesture yet: read at the pace of reading */
      V.talk={sp:q.sp,text:q.text,said,t0:now(),dur:clip.ms}; dog=setTimeout(()=>next(my),clip.ms+250); } else fin(false); });
}
V.fails=0; V.play=play; V.stop=stop;
addEventListener('visibilitychange',()=>{ if(document.hidden) stop(); });

/* how open the mouth of `key` is this moment (0 shut … 1 wide), or null if not speaking:
   the vowels of the words, laid over the time they take (Scripture-Game's V.mouth) */
V.mouth=function(key){
  const T=V.talk; if(!T||!T.sp||T.sp.key!==key||T.sp.kind==='narrator') return null;
  const f=(now()-T.t0)/T.dur; if(f<0||f>1) return 0;
  const s=T.said, pos=f*s.length, i=Math.floor(pos), ch=s[i]||' ', fr=pos-i;
  const v=/[aoAO]/.test(ch)?1:/[eE]/.test(ch)?.78:/[iIyY]/.test(ch)?.58:/[uUwW]/.test(ch)?.46:/[mbpMBP]/.test(ch)?0:/[fvFV]/.test(ch)?.16:/[a-zA-Z]/.test(ch)?.32:0;
  return v*(.45+.55*Math.sin(Math.PI*fr));
};
V.speaking=key=>!!(V.talk&&V.talk.sp&&V.talk.sp.key===key);
V.setOn=function(on){ V.on=!!on; store.set('fullness:voices',V.on?'1':'0'); if(!V.on) stop(); V.broken=false; V.fails=0; };

/* ================= WHAT A FACE SHOWS ================= */
/* from the words being said (Scripture-Game's face.js): only joy turns a mouth up */
const WORDS=[
  ['weep',  /\b(wept|weep|weeps|weeping|tears|wail\w*|mourn\w*|lament\w*)\b/i,3],
  ['sorrow',/\b(sorrow\w*|griev\w*|grief|woe|alas|forsaken|desolate|ashamed|despised|pierced|crushed|stricken|bruised)\b/i,2],
  ['fear',  /\b(afraid|fear\w*|terr\w+|trembl\w+|dread|troubled|flee)\b/i,2],
  ['stern', /\b(wrath|brood|adders|axe|fire|chaff|repent\w*|weary|intimidate|accuse|go, satan)\b/i,2],
  ['joy',   /\b(rejoic\w*|joy\w*|glad\w*|praise[ds]?|delight\w*|besorah|esteem|shalom|blessed|found)\b/i,2],
  ['awe',   /\b(see,|behold|glory|wonder\w*|marvel\w*|amazed|shamayim|most high|set apart|son of aluahim)\b/i,2]
];
V.expr=function(t){
  if(!t) return 'calm'; let best='calm', bs=0;
  for(const [e,re,w] of WORDS){ const m=String(t).match(new RegExp(re.source,'gi')); if(m&&m.length*w>bs){ bs=m.length*w; best=e; } }
  return best;
};
})();
