/* ================= THE VOICES, AND THE PIANO UNDER THEM =================
   Scripture-Game reads every verse aloud, the narrator the telling and each speaker his own words,
   with a soft piano underneath. Its recordings of the verses these films read were brought over by
   tools/import-voices.js (voices/bank.js and voices/<key>.webm); its piano is js/music.js, as it
   was. This is what plays them.

     VOICES.say(key)     read a caption's verses ("bereshith 1:3", "scroll:flood"): its recordings
                         one after another; nothing, and at once, if it has none
     VOICES.speaking()   is a verse still being read? (js/story.js holds the caption while it is)
     VOICES.stop()       silence the reading
     VOICES.mood(m)      the music under the film: eden · holy · night · sorrow · desert · royal ·
                         tense · storm (Scripture-Game's own moods)
     VOICES.toggle()     M — the sound off and on

   THE WORDS SHOWN ARE NEVER THE RECORDING'S. A caption shows the Besorah's own verse; the recording
   was matched to it word for word (the Name aside), and where the two part company the recording
   is simply not used. THE NEW TESTAMENT HAS NO RECORDINGS in Scripture-Game, and those films are
   read by caption alone, with the music under them.

   AND NOTHING IS EVER WAITED ON THAT CANNOT COME. A page opened with no gesture yet may not play a
   sound at all; a clip that will not load is not a reason to hold a film. Each reading is given its
   own length and a breath more, and is over then whatever the browser did with it.            */
(function(){
  const D=document;
  const KEY='unfolds:sound';
  let on=true; try{ on=localStorage.getItem(KEY)!=='0'; }catch(e){}

  /* ---- THE SOUND music.js plays through, as Scripture-Game's games make it ----
     A context and a master volume, made at the first touch or key (a browser will not make a sound
     before one); the music asked for before then begins the moment it can. */
  const Sound={ctx:null, master:null, enabled:on, mood:null};
  window.Sound=Sound;
  let wanted=null;
  function wake(){
    if(Sound.ctx) return;
    try{ const C=window.AudioContext||window.webkitAudioContext; if(!C) return;
      Sound.ctx=new C(); Sound.master=Sound.ctx.createGain(); Sound.master.gain.value=on?0.55:0;
      Sound.master.connect(Sound.ctx.destination);
      if(wanted&&Sound.ambient){ Sound.mood=null; Sound.ambient(wanted); }
    }catch(e){ Sound.ctx=null; }
  }
  for(const ev of ['pointerdown','keydown','touchstart']) addEventListener(ev,wake,{capture:true,passive:true});
  function mood(m){ wanted=m||null; if(Sound.ctx&&Sound.ambient&&on) Sound.ambient(wanted); }
  /* the music goes down under a voice, and back up after it */
  let unduck=0;
  function duck(down){ clearTimeout(unduck); const S=Sound; if(!S.ctx||!S.master||!on) return;
    const go=l=>{ try{ const g=S.master.gain, t=S.ctx.currentTime; g.cancelScheduledValues(t); g.setValueAtTime(g.value,t); g.linearRampToValueAtTime(l,t+(l<0.5?0.25:0.9)); }catch(e){} };
    if(down) go(0.3); else unduck=setTimeout(()=>go(0.55),450); }

  /* ---- THE READING ---- */
  const bank=()=>window.UNFOLD_VOICES||{v:{}};
  let gen=0, el=null, busy=false, until=0;
  function stop(){ gen++; busy=false; until=0;
    if(el){ try{ el.onended=el.onerror=null; el.pause(); }catch(e){} el=null; } duck(false); }
  function say(key){
    stop();
    const B=bank(), list=key&&B.v&&B.v[key];
    if(!on||!list||!list.length) return 0;
    const my=gen, total=list.reduce((s,c)=>s+(c[1]||0),0);
    busy=true; until=performance.now()+total+1500*list.length;
    duck(true);
    let i=0;
    const next=()=>{ if(my!==gen) return;
      if(i>=list.length){ busy=false; duck(false); return; }
      const [k]=list[i++], a=new Audio('voices/'+k+'.'+(B.ext||'webm')); el=a;
      a.onended=next; a.onerror=next;
      const p=a.play(); if(p&&p.catch) p.catch(()=>{ if(my===gen){ busy=false; duck(false); } });   /* not allowed to sound yet: the caption keeps its own time */
    };
    next();
    return total;
  }
  function speaking(){ if(busy&&performance.now()>until){ busy=false; duck(false); } return busy; }
  function toggle(){ on=!on; try{ localStorage.setItem(KEY,on?'1':'0'); }catch(e){}
    Sound.enabled=on;
    if(!on){ stop(); if(Sound.stopMusic) try{ Sound.stopMusic(); }catch(e){} Sound.mood=null; if(Sound.master) Sound.master.gain.value=0; }
    else { wake(); if(Sound.master) Sound.master.gain.value=0.55; mood(wanted); }
    const n=D.getElementById('sc-sound'); if(n) n.textContent=on?'M — sound off':'M — sound on';
    return on; }
  function has(key){ const B=bank(); return !!(key&&B.v&&B.v[key]&&B.v[key].length); }
  window.VOICES={say,stop,speaking,mood,toggle,has,on:()=>on};
})();
