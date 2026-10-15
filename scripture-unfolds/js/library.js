/* ================= THE SCROLL LIBRARY, AND THE WHOLE BIBLE =================
   ROADMAP Phase F5. Every scroll of the voyage, in the order the Besorah tells them, from
   Berĕshith to Ḥazon, each under the age it belongs to: the ones gathered can be played, and the
   ones not gathered are shown all the same, as GAP CARDS that say where the scroll lies — or who,
   in which land, will give it for work done for them (Phase B's scrolls given by the townsfolk;
   whatever the scroll list names as its giver is read here, and nothing is assumed of it).

   PLAY THE WHOLE BIBLE plays every gathered scroll back to back, in that order: a title card for
   each age, the film of each scroll that has one, the scroll's own verse over its own land for one
   that has none yet, and a gap card where one is still missing. Each verse moves on by itself when
   its voice is done (js/story.js holds it while it is read). SPACE or → passes to the next, ESC
   leaves, and it can be begun again from the Library at any time.

   THE LIST IS WRITTEN OUT, because the order is the Besorah's and not the order the scrolls were
   added to the world; a scroll the list does not name (one added later, or given by a townsman)
   is still shown, set among the others by its book. A film opens when EVERY scroll it is filed
   under has been taken up; with no voyage at all, everything is open (js/unfold.js). */
window.LIBRARY=(function(){
  const AGES={
    beginnings:'THE BEGINNINGS', fathers:'THE FATHERS', out:'THE GOING OUT', land:'THE LAND',
    kings:'THE SOVEREIGNS', prophets:'THE PROPHETS', exile:'THE EXILE',
    besorah:'THE BESORAH OF YAHUSHA', assembly:'THE ASSEMBLY', hazon:'ḤAZON' };
  const AGE_LINE={
    beginnings:'Berĕshith — the making of the world, the garden, the days before the flood',
    fathers:'Aḇrahim, Yahtsḥaq and Ya‛aqoḇ, and Yosĕph in Mitsrayim',
    out:'the going out from Mitsrayim, the sea, the mountain and the wilderness',
    land:'the land of the promise, and its walls', kings:'Shaʼul, Dawiḏ and Shelomoh',
    prophets:'the naḇiʼim of Yasharal and Yahuḏah', exile:'Baḇel and Persia',
    besorah:'the birth, the immersion, and the tomb that was found empty',
    assembly:'the Ruach poured out, and the road to Damascus', hazon:'the renewed shamayim and the renewed earth' };
  const ENTRIES=[
    {film:'creation',   scrolls:['bereshith'],              age:'beginnings'},
    {film:'eden',       scrolls:['bereshith','adam-eve-1'], age:'beginnings'},
    {film:'after-eden', scrolls:['adam-eve-2'],             age:'beginnings'},
    {film:'chanok',     scrolls:['chanok'],                 age:'beginnings'},
    {film:'chanok-eth', scrolls:['chanok-eth'],             age:'beginnings'},
    {film:'yashar',     scrolls:['yashar'],                 age:'beginnings'},
    {film:'flood',      scrolls:['flood'],                  age:'beginnings'},
    {scroll:'babel',                                        age:'beginnings'},
    {scroll:'abram',                                        age:'fathers'},
    {scroll:'sedom',                                        age:'fathers'},
    {film:'moriyah',    scrolls:['moriyah'],                age:'fathers'},
    {film:'bethel',     scrolls:['bethel'],                 age:'fathers'},
    {scroll:'yoseph',                                       age:'fathers'},
    {film:'shamoth',    scrolls:['shamoth'],                age:'out'},
    {scroll:'red-sea',                                      age:'out'},
    {film:'yobelim',    scrolls:['yobelim'],                age:'out'},
    {scroll:'nebo',                                         age:'out'},
    {scroll:'yericho',                                      age:'land'},
    {film:'golyath',    scrolls:['golyath'],                age:'kings'},
    {scroll:'temple',                                       age:'kings'},
    {film:'karmel',     scrolls:['karmel'],                 age:'prophets'},
    {scroll:'yonah',                                        age:'prophets'},
    {film:'danial',     scrolls:['danial'],                 age:'exile'},
    {scroll:'ester',                                        age:'exile'},
    {film:'birth',      scrolls:['birth'],                  age:'besorah'},
    {film:'immersion',  scrolls:['immersion'],              age:'besorah'},
    {film:'tomb',       scrolls:['tomb'],                   age:'besorah'},
    {film:'shabuoth',   scrolls:['shabuoth'],               age:'assembly'},
    {film:'dammeseq',   scrolls:['dammeseq'],               age:'assembly'},
    {film:'hazon',      scrolls:['hazon'],                  age:'hazon'} ];

  /* the books in the Besorah's own order, and the age each belongs to — for a scroll the list
     does not name, so it is set among the others by its book */
  const BOOKS=[['bereshith','beginnings'],['adamandhawwah1','beginnings'],['adamandhawwah2','beginnings'],['hanok','beginnings'],
    ['hanokhabashiy','beginnings'],['yashar','beginnings'],['shamoth','out'],['yobelim','out'],['wayyiqra','out'],['bamidbar','out'],
    ['dabarim','out'],['yahusha','land'],['shophetim','land'],['ruth','land'],['1shamual','kings'],['2shamual','kings'],
    ['1malakim','kings'],['2malakim','prophets'],['1dibrehayamim','kings'],['2dibrehayamim','kings'],['iyob','fathers'],['tehillim','kings'],
    ['mishle','kings'],['qoheleth','kings'],['shirhashirim','kings'],['yashayahu','prophets'],['yirmayahu','prophets'],['ekah','exile'],
    ['yahazqal','exile'],['danial','exile'],['ezra','exile'],['nehemyah','exile'],['ester','exile'],['hoshea','prophets'],['yoal','prophets'],
    ['amos','prophets'],['obadyahu','prophets'],['yonah','prophets'],['mikah','prophets'],['nahum','prophets'],['habaqquq','prophets'],
    ['tsephanyahu','prophets'],['haggai','exile'],['zakaryahu','exile'],['malaki','exile'],['1maqqabim','exile'],['2maqqabim','exile'],
    ['mattithyahu','besorah'],['mark','besorah'],['luke','besorah'],['yahuchanon','besorah'],['acts','assembly'],['romans','assembly'],
    ['hazon','hazon']];
  const AGE_ORDER=Object.keys(AGES);
  const norm=t=>String(t||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
  const rankOf=book=>{ const n=norm(book); const i=BOOKS.findIndex(b=>b[0]===n); return i<0?BOOKS.length:i; };
  const scrolls=()=>(window.EARTH&&EARTH.scrollList)||[];
  const scrollById=id=>scrolls().find(s=>s.id===id)||null;

  /* WHERE A SCROLL IS TO BE HAD — the gap card's words, out of the scroll list and nothing else */
  function giver(sc){ return sc.givenBy||sc.given||sc.giver||null; }
  function where(sc){
    if(!sc) return 'not yet written into the world';
    const g=giver(sc);
    if(g){ if(typeof g==='string') return 'given by '+g+', for work done for them';
      const who=g.who||g.name||g.trade||g.role||'one of the townsfolk', town=g.town||g.place||g.at, land=g.land||g.country||sc.country;
      return 'given by '+(/^(a|an|the)\s/i.test(who)?who:'a '+who)+(town?' of '+town:'')+(land?', in '+land:'')+', for work done for them'; }
    const at=sc.at||{};
    if(at.mount) return 'it lies on the summit of '+at.mount;
    if(at.cave) return 'it lies in a dark cave'+(at.near?' in '+at.near:'')+', in '+sc.country+' — take a torch';
    if(at.landmark) return 'it lies beside '+at.landmark;
    if(at.town) return 'it lies near '+at.town+', in '+sc.country;
    return 'it lies in '+sc.country+', out beyond the town';
  }

  /* every entry, with the scrolls of the world the list does not name set in by their book */
  function entries(){
    const named=new Set(); for(const e of ENTRIES) for(const id of (e.scrolls||[e.scroll])) named.add(id);
    const out=ENTRIES.map(e=>Object.assign({},e,{scrolls:e.scrolls||[e.scroll]}));
    for(const sc of scrolls()){ if(named.has(sc.id)) continue;
      const r=rankOf(sc.book), age=(BOOKS[r]&&BOOKS[r][1])||'hazon';
      const e={scroll:sc.id,scrolls:[sc.id],age,film:window.STORY&&STORY.get(sc.id)?sc.id:undefined};
      let at=out.length;
      for(let i=out.length-1;i>=0;i--){ const s0=scrollById(out[i].scrolls[0]); if(s0&&rankOf(s0.book)<=r){ at=i+1; break; } if(i===0) at=0; }
      out.splice(at,0,e); }
    /* the age of an entry never runs backwards through the list */
    let ai=0; for(const e of out){ const k=AGE_ORDER.indexOf(e.age); if(k<ai) e.age=AGE_ORDER[ai]; else ai=k; }
    return out;
  }
  /* is an entry open, given the scrolls taken (a Set), or null for no voyage at all */
  function state(e,taken){
    const miss=taken?e.scrolls.filter(id=>!taken.has(id)):[];
    const film=e.film&&window.STORY&&STORY.get(e.film)?STORY.get(e.film):null;
    const sc=scrollById(e.scrolls[0]);
    return {open:!miss.length, miss, film, scroll:sc,
      title:film?film.name:(sc?sc.name:e.scrolls[0].toUpperCase()),
      where:miss.map(id=>{ const s=scrollById(id); return (s?s.name+': ':'')+where(s); })};
  }

  /* ================= PLAY THE WHOLE BIBLE ================= */
  let seq=null, at=-1, onEnd=null;
  const $=id=>document.getElementById(id);
  function sequence(taken){
    const out=[]; let age=null;
    for(const e of entries()){
      if(e.age!==age){ age=e.age; out.push({kind:'age',age}); }
      const s=state(e,taken);
      out.push({kind:!s.open?'gap':(s.film?'film':'verse'),e,s}); }
    out.push({kind:'end'});
    return out; }
  /* a card is a scene made as it is played: here, where the traveller already stands, with the
     world gone dark behind it, so no ground is laid for it */
  function darkStage(len){ return [
    { t:0, dark:1, light:0.15, sky:0x050403, sun:0, moon:0, stars:0.4, firm:0, land:1, sea:1, clouds:0,
      lifeSea:0, lifeAir:0, lifeLand:0, fogN:60, fogF:200, cd:200, cy:80, ca:0, cl:10, cfov:60, cut:true },
    { t:len, ca:0.02 } ]; }
  function card(item){
    const len=item.kind==='age'?6.5:item.kind==='end'?8:item.kind==='gap'?7.5:0;
    if(item.kind==='age') return { id:'bible-age-'+item.age, name:AGES[item.age], anchor:'here', music:'holy',
      stage:darkStage(len), fades:[{t:0,to:len,hold:len}],
      titles:[{t:0.7,to:len-0.6,text:AGES[item.age]}], cards:[{t:1.6,to:len-0.6,text:AGE_LINE[item.age]||''}], caps:[] };
    if(item.kind==='gap') return { id:'bible-gap-'+item.e.scrolls[0], name:item.s.title, anchor:'here', music:'night',
      stage:darkStage(len), fades:[{t:0,to:len,hold:len}],
      titles:[{t:0.6,to:len-0.5,text:item.s.title}],
      cards:[{t:1.4,to:len-0.5,text:'NOT YET GATHERED — '+item.s.where.join(' · ')}], caps:[] };
    if(item.kind==='end'){ const n=seq.filter(x=>x.kind==='film'||x.kind==='verse').length, g=seq.filter(x=>x.kind==='gap').length;
      return { id:'bible-end', name:'THE END', anchor:'here', music:'holy', stage:darkStage(len), fades:[{t:0,to:len,hold:len}],
        titles:[{t:0.8,to:len-0.6,text:'SO FAR AS IT IS GATHERED'}],
        cards:[{t:1.8,to:len-0.6,text:n+' scrolls played'+(g?' · '+g+' still to be found or earned':' · every scroll gathered')}], caps:[] }; }
    /* the verse alone, over the land its scroll lies in: a slow turn about the place, the scroll's
       name, and its one verse (the same verse the voyage shows as it is taken up) */
    const sc=item.s.scroll, v=sc&&sc.verse||{t:'',ref:''}, L=Math.max(13,Math.min(30,v.t.length/14+5));
    const W=window.__WORLD, list=W&&W.scrolls?W.scrolls():[], live=list.find(q=>q.id===sc.id)||sc;
    const anchor=live&&live.x!=null?{x:live.x,z:live.z}:'coast';
    return { id:'bible-verse-'+sc.id, name:sc.name, anchor, music:'holy',
      stage:[ { t:0, hour:16.5, dark:0, light:0.95, sky:0xa9c2da, sun:1, moon:0, stars:0, firm:0, land:1, sea:1, clouds:0.8,
        lifeSea:1, lifeAir:1, lifeLand:1, fogN:300, fogF:1100, cd:260, cy:90, ca:0, cl:12, cfov:58, cut:true },
        { t:L+2.5, ca:0.06, cd:220, cy:70 } ],
      fades:[{t:0,to:1.6,hold:0.6},{t:L+1.2,to:L+2.5+0.8,hold:0.6}],
      titles:[{t:0.6,to:3.6,text:sc.name}],
      caps:[{t:3.8,to:L+1.6,text:v.t,ref:v.ref,voice:'scroll:'+sc.id}] }; }
  function show(i){
    at=i; const item=seq[i];
    if(!item){ stop(); return; }
    const n=$('sc-bible'); if(n){ n.textContent='THE WHOLE BIBLE · '+(seq.slice(0,i+1).filter(x=>x.kind!=='age'&&x.kind!=='end').length)+' of '+seq.filter(x=>x.kind!=='age'&&x.kind!=='end').length; n.classList.add('on'); }
    const go=item.kind==='film'?STORY.play(item.s.film.id):STORY.playScene(card(item));
    Promise.resolve(go).then(ok=>{ if(!ok&&seq&&at===i) show(i+1); });
  }
  function start(taken,done){ seq=sequence(taken); onEnd=done||null; show(0); }
  function next(){ if(seq) show(at+1); }
  function stop(){ const f=onEnd; seq=null; at=-1; onEnd=null; const n=$('sc-bible'); if(n) n.classList.remove('on'); if(f) f(); }
  function running(){ return !!seq; }
  return {AGES,entries,state,where,sequence,start,next,stop,running,card,jump:i=>{ if(seq) show(i); },
    at:()=>at, seq:()=>seq};
})();
