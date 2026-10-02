/* THE FULLNESS OF TIME — the people, as they were.

   Every person of the story is built here as a man or woman of their own day, in the blocks of
   the world but at a person's true proportions (the head about a seventh of the height, the
   hand reaching mid-thigh, a man about 1.70 m, a woman 1.58) and dressed as the finds and the
   writings of the time show them:

   · a MAN OF YASHARAL: a tunic of wool to the ankle (kethoneth), girded at the waist; a mantle
     (the tallith, the himation) over the shoulders and back, with a tassel at each of its four
     corners and in each a cord of blue ("make tassels on the corners of their garments … and
     put a cord of blue in the tassel", Bemiḏbar 15:38); sandals of leather; a cloth over the
     head against the sun; a beard;
   · a WOMAN: the tunic to the ankle, and the mantle drawn up over her head and hanging to the
     waist behind;
   · a KOHEN: white linen to the ankle, the long sash wound about the waist with its ends
     hanging, a wound turban;
   · a SCRIBE: the long mantle, the tassels long;
   · a KING (Aḥaz, Herodes): the tunic and a mantle of purple with a border of gold, a diadem;
   · a ROMAN SOLDIER: a red tunic to the knee, a shirt of mail with doubled shoulders, the
     belt with its apron of studded straps, the bronze helmet with cheek-pieces and neck-guard,
     the hob-nailed boot-sandal (caliga), the short sword at the right hip, clean-shaven; a
     CAPTAIN (centurion) with the crest set crosswise on his helmet, greaves, and the staff of
     vine-wood;
   · a SOLDIER OF HERODES: a tunic to the knee, a cuirass of leather, a sword;
   · the MAGI from the East: as the Persians and Parthians dressed — trousers, a coat with long
     sleeves to the knee, belted, a cloak, and the soft cap that leans forward;
   · YAHUCHANON the immerser: a garment of camel's hair and a leather belt about his waist
     (Mattithyahu 3:4);
   · a SHEPHERD: the short tunic, a cloak of fleece, the bag at his side, the staff;
   · CHILDREN at a child's proportions;
   · YAHUSHA: dressed as every man of Yasharal — tunic, girdle, sandals, the mantle with its
     tassels (the "fringe of His garment", Mattithyahu 9:20), the head-cloth — and His face never
     drawn at all;
   · THE FALLEN: as the sister game draws them — the dark robe, the crimson mantle, the violet
     light about them.

   The face is built of small blocks: the eyes (whites, the dark of the eye, the lids that
   blink), the brows, the nose, the mouth that opens with the words, the beard. The feeling
   is carried by the brows and the eyes — what Minecraft: Story Mode's blocky faces taught:
   its moving mouths read as wrong, its eyes and brows did not.

   Everything is returned in METRES, feet at the origin, facing +z. */
(function(){
'use strict';
const W=window.STORYWORLD;

/* ---- CLOTH, WOVEN: a small texture in the world's pixel manner ---- */
const TEX={};
function rgb(h,k){ k=k||1; return 'rgb('+Math.min(255,Math.round((h>>16&255)*k))+','+Math.min(255,Math.round((h>>8&255)*k))+','+Math.min(255,Math.round((h&255)*k))+')'; }
function rnd(i){ const s=Math.sin(i*127.1+311.7)*43758.5453; return s-Math.floor(s); }
function weave(hex,kind,extra){
  const key=hex+':'+(kind||'')+':'+(extra||''); if(TEX[key]) return TEX[key];
  const cv=document.createElement('canvas'); cv.width=cv.height=16; const g=cv.getContext('2d');
  g.fillStyle=rgb(hex); g.fillRect(0,0,16,16);
  for(let i=0;i<256;i++){ const v=0.9+rnd(i+hex%97)*0.18; g.fillStyle=rgb(hex,v); g.fillRect(i%16,i>>4,1,1); }
  if(kind==='folds'||kind==='clavi'||kind==='border'){ g.fillStyle='rgba(0,0,0,0.13)'; for(const x of [2,7,12]) g.fillRect(x,0,1,16); }
  if(kind==='clavi'){ g.fillStyle=rgb(extra||0x5a3a2a); g.fillRect(4,0,2,16); g.fillRect(10,0,2,16); }        /* the two stripes of a tunic */
  if(kind==='border'){ g.fillStyle=rgb(extra||0xd4af37); g.fillRect(0,13,16,3); g.fillRect(0,0,2,16); }         /* a hem of gold */
  if(kind==='mail'){ g.fillStyle='rgba(20,20,24,0.55)'; for(let y=0;y<16;y+=2) for(let x=(y/2)%2;x<16;x+=2) g.fillRect(x,y,1,1); }
  if(kind==='shaggy'){ for(let i=0;i<70;i++){ g.fillStyle=rgb(hex,rnd(i*3.3)<0.5?0.72:1.18); g.fillRect(Math.floor(rnd(i)*16),Math.floor(rnd(i+9)*16),1,2+Math.floor(rnd(i+4)*3)); } }
  if(kind==='fleece'){ for(let i=0;i<60;i++){ g.fillStyle=rgb(hex,rnd(i*5.1)<0.5?0.82:1.08); g.fillRect(Math.floor(rnd(i+2)*16),Math.floor(rnd(i+7)*16),2,2); } }
  if(kind==='leather'){ g.fillStyle='rgba(0,0,0,0.18)'; g.fillRect(0,7,16,1); g.fillRect(7,0,1,16); }
  if(kind==='sash'){ const C=[0x2f4f8a,0x6a2a6a,0xa02a2a,0xece6d6]; for(let y=0;y<16;y++){ g.fillStyle=rgb(C[Math.floor(y/2)%4]); g.fillRect(0,y,16,1); } }
  const t=new THREE.CanvasTexture(cv); t.magFilter=THREE.NearestFilter; t.minFilter=THREE.NearestFilter;
  return TEX[key]=t;
}
const MAT={};
function cloth(hex,kind,extra){ const k=hex+':'+(kind||'')+':'+(extra||''); return MAT[k]||(MAT[k]=new THREE.MeshLambertMaterial({map:weave(hex,kind,extra)})); }
function flat(hex){ const k='f'+hex; return MAT[k]||(MAT[k]=new THREE.MeshLambertMaterial({color:hex})); }
function basic(hex){ const k='b'+hex; return MAT[k]||(MAT[k]=new THREE.MeshBasicMaterial({color:hex})); }
const box=(w,h,d,m,x,y,z,parent)=>{ const q=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m); q.position.set(x||0,y||0,z||0); if(parent) parent.add(q); return q; };

/* ---- WHAT EACH ONE WEARS, from what the act says of them ---- */
function dressOf(o){
  if(o.dress) return o.dress;
  if(o.fallen) return 'fallen';
  if(o.holy) return 'yahusha';
  if(/^A captain$/.test(o.name||'')) return 'centurion';
  if(o.folk==='roman') return 'legionary';
  if(o.kind==='woman') return 'woman';
  return 'man';
}
/* ---- A PERSON ---- */
W.person=function(ctx,o){
  const def=o||{};
  o=Object.assign({},def);
  if(o.fallen) o=Object.assign(o,W.FALLEN,{kind:o.kind||'dark'});
  const dress=dressOf(o);
  if(dress==='yahusha') o=Object.assign(o,{robe:o.robe||0xd6c9a8, mantle:o.mantle||0xe9e2cf, cloth:o.cloth||0xe2d8c0, sash:o.sash||0x5a4632, skin:o.skin||0x704a27, beard:null});
  if(!o.skin) o.skin=W.skinFor(Object.assign({folk:dress==='legionary'||dress==='centurion'?'roman':o.folk},o));
  /* the one speaking is drawn in the verse box from the same look: written back to its definition */
  def.dress=dress; if(def.skin==null) def.skin=o.skin;
  const female=dress==='woman', child=!!o.small;
  const roman=dress==='legionary'||dress==='centurion';
  const ashshur=dress==='assyrian'||dress==='rabshaqeh';
  const g=new THREE.Group(), body=new THREE.Group(); g.add(body);
  /* proportions: a man 1.70, a woman 1.58, a child about 1.15 with a larger head for his size */
  const H=o.height||(child?1.15:female?1.58:1.70), k=H/1.70, hk=child?1.22:1;   /* `height`: a man small of stature (Luke 19:3) */
  body.scale.setScalar(k);
  const skin=flat(o.skin), skinD=flat(Math.max(0,(o.skin&0xfefefe)>>1)|0);
  const hairHex=o.hair||(roman?0x2a1e16:o.fallen?0x120a0a:0x1e1610);
  const robe=o.robe||0x9a8466;
  /* the tunic's cloth, by the dress */
  const tunicM=dress==='wrapped'?cloth(0xe8e0cc,'folds')
    :dress==='kohen'||dress==='levite'?cloth(o.robe||0xf0ece0,'folds')
    :dress==='camelhair'?cloth(o.robe||0x8a6a40,'shaggy')
    :roman?cloth(o.robe||0x8a2a22,'folds')
    :dress==='king'?cloth(robe,'folds')
    :cloth(robe,'clavi',Math.max(0,(robe&0xfefefe)>>1));
  const cloths=[];                                   /* the panels that swing */
  const hinge=(parent,w,h,d,m,x,y,z,axis,sign,light)=>{ const pv=new THREE.Group(); pv.position.set(x,y,z); parent.add(pv);
    box(w,h,d,m,0,-h/2,0,pv); cloths.push({pv,axis,sign,a:0,w:0,n:axis==='x'?[0,0,sign]:[sign,0,0],light:!!light}); return pv; };

  /* LEGS: thigh, knee, shin, the foot in its sandal */
  const hemY=female||dress==='kohen'||dress==='levite'||dress==='wrapped'||dress==='rabshaqeh'?0.07:dress==='assyrian'?0.48:roman||dress==='herodian'||dress==='camelhair'||dress==='shepherd'||child?0.50:0.10;
  const legM=dress==='magi'?cloth(o.under||0x6a3a2a,'folds'):skin;
  const footM=roman?cloth(0x5a3a22,'leather'):flat(0x5a4028);
  const mkLeg=(x)=>{ const L=new THREE.Group(); L.position.set(x,0.90,0); body.add(L);
    box(0.13,0.42,0.14,legM,0,-0.21,0,L);
    const K2=new THREE.Group(); K2.position.set(0,-0.42,0); L.add(K2); L.userData.knee=K2;
    box(0.11,0.40,0.12,legM,0,-0.20,0,K2);
    if(dress==='centurion') box(0.125,0.26,0.05,flat(0xb8bcc4),0,-0.2,0.055,K2);          /* greaves */
    box(0.105,0.065,0.25,footM,0,-0.43,0.045,K2);                                       /* the foot */
    box(0.115,0.02,0.26,flat(0x3a2818),0,-0.47,0.045,K2);                               /* the sole */
    if(!roman&&dress!=='magi') box(0.112,0.015,0.03,flat(0x4a3018),0,-0.40,0.07,K2);     /* the strap */
    if(roman) for(const yy of [-0.36,-0.32]) box(0.118,0.012,0.13,flat(0x3a2414),0,yy,0.0,K2);
    /* THE CLOTH ON THE LEG: under the hanging skirt the robe lies on the thigh and the shin
       down to its hem, and goes with the leg — forward in the stride, over the lap and down
       the shins when he sits — so a robe to the ankle never shows a bare knee */
    const tl=Math.min(0.42,0.90-hemY); if(tl>0.02) box(0.158,tl,0.168,tunicM,0,-tl/2+0.005,0,L);
    const sl=Math.min(0.40,0.48-hemY); if(sl>0.02) box(0.138,sl,0.148,tunicM,0,-sl/2,0.004,K2);
    return L; };
  const legL=mkLeg(0.085), legR=mkLeg(-0.085);
  /* THE ROBE OF ONE SEATED: the hanging skirt cannot sit, so when he sits it is put by and the
     robe is drawn as it falls on a seated man. It is not one board over the lap: each thigh
     has its own loose breadth, the cloth rounds over each knee, lies down each shin to a hem
     that spreads at the ankle, sags in a fold between the knees, and falls at either side
     from the thighs to the ground. The fold between the knees and the sides hang as cloth
     hangs — straight down — so they are drawn for the way he sits: knees drawn up on the
     ground (`pose` g), or thighs level on a bench (b). Full over the hips behind. */
  const drapes=[];
  { const dr=(m,pose)=>{ if(pose) m.userData.pose=pose; drapes.push(m); return m; };
    const shin=Math.min(0.46,0.50-hemY);
    for(const L of [legL,legR]){
      dr(box(0.20,0.44,0.20,tunicM,0,-0.21,0.012,L));                                    /* the thigh's breadth, loose */
      const kr=new THREE.Group(); kr.rotation.x=-0.72; L.userData.knee.add(kr);              /* half the knee's bend: the cloth rounds over it */
      dr(box(0.20,0.15,0.215,tunicM,0,0,0.012,kr));
      if(shin>0.04){ dr(box(0.19,shin,0.18,tunicM,0,-shin/2+0.02,0.022,L.userData.knee));   /* down the shin */
        dr(box(0.225,0.05,0.205,tunicM,0,-shin+0.045,0.02,L.userData.knee)); } }            /* the hem, spreading at the ankle */
    if(hemY<0.3){                                                                          /* a robe to the ankle (a working tunic to the knee falls no further) */
      /* on the ground, knees drawn up: the fold between the knees, and the sides falling to the ground */
      dr(box(0.14,0.34,0.03,tunicM,0,0.85,0.37,body),'g');
      for(const sx of [1,-1]){ dr(box(0.03,0.26,0.40,tunicM,sx*0.19,0.76,0.18,body),'g'); dr(box(0.03,0.11,0.16,tunicM,sx*0.19,0.945,0.30,body),'g'); }
      /* on a bench, thighs level: the fold between the knees falls toward the feet; the sides hang a hand's breadth */
      dr(box(0.14,0.36,0.03,tunicM,0,0.66,0.40,body),'b');
      for(const sx of [1,-1]) dr(box(0.03,0.16,0.42,tunicM,sx*0.19,0.78,0.20,body),'b');
    }
    dr(box(0.41,0.26,0.25,tunicM,0,0.86,-0.01,body));                                    /* over the hips behind */
    for(const d of drapes) d.visible=false; }
  /* THE TUNIC: the body from hip to shoulder, and its skirt hanging in four panels to the hem */
  box(0.38,0.48,0.22,tunicM,0,1.18,0,body);
  const skirtLen=0.98-hemY, sw=female?0.44:0.41;
  /* the front of the skirt in two lengths, folding at the knee: hanging straight when he
     stands, over the lap and falling from the knees when he sits */
  { const up=Math.min(skirtLen,0.44), front=hinge(body,sw,up,0.035,tunicM,0,0.98,0.10,'x',1);
    if(skirtLen>up+0.01){ const lo=new THREE.Group(); lo.position.set(0,-up,0); front.add(lo);
      box(sw,skirtLen-up,0.035,tunicM,0,-(skirtLen-up)/2,0,lo); cloths[cloths.length-1].low=lo; } }
  hinge(body,sw,skirtLen,0.035,tunicM,0,0.98,-0.10,'x',-1);
  hinge(body,0.035,skirtLen,0.19,tunicM,0.195,0.98,0,'z',1); hinge(body,0.035,skirtLen,0.19,tunicM,-0.195,0.98,0,'z',-1);
  /* the girdle */
  const beltM=dress==='kohen'?cloth(0,'sash'):dress==='camelhair'||roman||dress==='herodian'||dress==='shepherd'?cloth(0x4a3020,'leather'):cloth(o.sash||0x5a4632,'folds');
  box(0.40,0.07,0.24,beltM,0,0.975,0,body);
  if(dress==='kohen'){ box(0.06,0.42,0.02,beltM,0.08,0.74,0.125,body); box(0.06,0.36,0.02,beltM,0.15,0.77,0.12,body); }    /* the sash's ends */
  if(roman){ for(let s=-2;s<=2;s++){ box(0.035,0.24,0.02,cloth(0x3a2414,'leather'),s*0.05,0.82,0.125,body);                  /* the apron of straps */
      box(0.03,0.02,0.022,flat(0xc8a050),s*0.05,0.78,0.126,body); } }
  if(roman||dress==='herodian') box(0.05,0.36,0.05,flat(0x3a2a1a),-0.22,0.86,0.06,body).rotation.x=0.25;                    /* the sword at the right hip */
  if(dress==='shepherd') box(0.14,0.16,0.07,cloth(0x8a6a40,'leather'),0.22,0.86,0.04,body);                                     /* the bag */
  /* over the tunic: mail, or leather */
  if(roman){ const mail=cloth(0x8a8c90,'mail'); box(0.40,0.40,0.24,mail,0,1.21,0,body); box(0.44,0.08,0.26,mail,0,1.40,0,body); }
  /* ASHSHUR, as its own palace reliefs show its men: the soldier in a shirt of bronze scales over a
     tunic to the knee, a broad belt, a round shield and a spear; the Raḇshaqĕh, an officer of the
     sovereign, in a long robe bordered with fringe, a sash about it, a band about his brow */
  if(dress==='assyrian'){ const sc=cloth(0x9a7a40,'mail'); box(0.41,0.46,0.25,sc,0,1.17,0,body); box(0.42,0.1,0.26,flat(0x5a3a22),0,0.97,0,body);
    const sh=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.3,0.05,12),flat(0x8a6a3a)); sh.rotation.x=Math.PI/2; sh.position.set(0.3,1.05,0.16); body.add(sh);
    box(0.035,1.9,0.035,flat(0x6a4a2a),-0.3,1.0,0.12,body); box(0.06,0.14,0.06,flat(0xa8a8b0),-0.3,1.97,0.12,body); }
  if(dress==='rabshaqeh'){ const fr=flat(0xd4af37); box(0.46,0.05,0.26,fr,0,0.08,0,body); box(0.05,0.9,0.26,fr,0.2,0.5,0,body); box(0.42,0.12,0.26,cloth(o.sash||0x8a1a2a,'folds'),0,0.98,0,body); }
  if(dress==='herodian') box(0.40,0.36,0.24,cloth(0x7a5232,'leather'),0,1.21,0,body);
  /* the neck */
  box(0.09,0.09,0.09,skin,0,1.465,0.005,body);

  /* ARMS: the shoulder, the elbow, the hand; the sleeve to the elbow (to the wrist on the Magi) */
  const sleeveM=roman?tunicM:dress==='magi'?tunicM:tunicM;
  const mkArm=(x)=>{ const A=new THREE.Group(); A.position.set(x,1.39,0); body.add(A);
    box(0.10,0.30,0.11,sleeveM,0,-0.15,0,A);
    const E=new THREE.Group(); E.position.set(0,-0.30,0); A.add(E); A.userData.elbow=E;
    box(0.085,0.26,0.09,dress==='magi'||dress==='kohen'?sleeveM:skin,0,-0.13,0,E);
    const hand=box(0.08,0.09,0.06,skin,0,-0.31,0.005,E); A.userData.hand=hand; return A; };
  const armL=mkArm(0.245), armR=mkArm(-0.245);
  if(o.staff||dress==='shepherd'||dress==='centurion'){ const len=dress==='centurion'?0.95:1.7;
    box(0.035,len,0.035,flat(dress==='centurion'?0x5a3a20:0x7a5a30),0,-0.31+len*0.38,0.06,armR.userData.elbow); }
  if(o.carry) box(0.20,0.24,0.16,flat(o.carry),0,-0.42,0.08,armR.userData.elbow);

  /* THE MANTLE: over the back from both shoulders, its left end brought over the left shoulder
     to hang before; a tassel at each corner, a cord of blue in each */
  const mantled=!roman&&!ashshur&&dress!=='herodian'&&dress!=='camelhair'&&dress!=='magi'&&dress!=='levite'&&!child;
  if(mantled||dress==='shepherd'||dress==='magi'){
    const mHex=dress==='shepherd'?0xd8ccb0:o.mantle||(dress==='fallen'?o.sash:dress==='king'?0x5a2060:dress==='kohen'?0xf4f0e6:female?(o.cloth||0x6a5a7a):shade(robe,0.82));
    const mM=dress==='shepherd'?cloth(mHex,'fleece'):dress==='king'?cloth(mHex,'border',0xd4af37):cloth(mHex,'folds');
    const backLen=female?1.0:dress==='shepherd'?0.62:0.82;
    const back=hinge(body,0.46,backLen,0.035,mM,0,1.43,-0.135,'x',-1,true);
    box(0.47,0.05,0.30,mM,0,1.43,-0.01,body);                                           /* over the shoulders */
    if(mantled&&!female){ const front=hinge(body,0.13,0.78,0.03,mM,0.13,1.42,0.125,'x',1,true);
      if(dress==='man'||dress==='yahusha'||dress==='scribe'){ const tas=(p,x,y)=>{ box(0.02,0.09,0.02,flat(0xece6d6),x,y,0.01,p); box(0.008,0.07,0.024,basic(0x2a5aa8),x,y-0.005,0.012,p); };
        tas(back.children[0],0.21,-backLen/2-0.05); tas(back.children[0],-0.21,-backLen/2-0.05); tas(front.children[0],0,-0.44); } }
  }

  /* THE HEAD */
  const head=new THREE.Group(); head.position.set(0,1.61,0.005); head.scale.setScalar(hk); body.add(head);
  const hw=0.19, hh=0.22, hd=0.21, fz=hd/2+0.002;
  box(hw,hh,hd,skin,0,0,0,head);
  box(0.03,0.05,0.035,skin,hw/2+0.012,0,0,head); box(0.03,0.05,0.035,skin,-hw/2-0.012,0,0,head);     /* ears */
  const hairM=cloth(hairHex,'shaggy');
  const covered=dress==='woman'||dress==='kohen'||dress==='levite'||dress==='magi'||roman||(o.cloth!=null&&o.cloth!==null&&dress!=='herodian');
  /* hair: on the crown and behind; long on the immerser, short and close on a Roman. Under a
     head-cloth, a turban or a mantle only the cloth is seen behind (dress==='king' wears a diadem) */
  const veiled=covered||dress==='yahusha'||dress==='fallen';
  box(hw+0.02,0.06,hd+0.02,hairM,0,hh/2,0,head);
  if(!veiled){
    box(hw+0.02,dress==='camelhair'?0.30:roman?0.10:0.16,0.04,hairM,0,dress==='camelhair'?-0.09:-0.02,-hd/2-0.01,head);
    box(0.02,0.09,hd-0.04,hairM,hw/2+0.005,0.04,-0.01,head); box(0.02,0.09,hd-0.04,hairM,-hw/2-0.005,0.04,-0.01,head); }
  /* ONE WHO DIED, COME OUT: "bound feet and hands with wrappings, and his face was wrapped with
     a cloth" (Yahuchanon 11:44) — the whole head bound, bands about the body */
  if(dress==='wrapped'){ const lin=cloth(0xe8e0cc,'folds'), band=flat(0xc8bea6);
    box(hw+0.04,hh+0.04,hd+0.04,lin,0,0,0,head);
    for(const y of [1.32,1.16,0.98,0.80,0.60,0.40,0.22]) box(0.44,0.025,0.25,band,0,y,0,body); }
  /* THE FACE (never on Yahusha: His head is drawn with no face) */
  let F=null;
  if(dress!=='yahusha'&&dress!=='wrapped'){
    const eyeY=0.012, white=basic(0xeee8dc), dark=basic(0x1a120c);
    const eye=(x)=>{ const e=new THREE.Group(); e.position.set(x,eyeY,fz); head.add(e);
      box(0.042,0.022,0.006,white,0,0,0,e); box(0.018,0.022,0.008,dark,0,0,0.001,e);
      const lid=box(0.046,0.026,0.004,skinD,0,0.004,0.004,e); lid.scale.y=0.01; return {e,lid}; };
    const eL=eye(0.045), eR=eye(-0.045);
    const browM=basic(o.brow||(o.fallen?0x120a0a:Math.min(hairHex,0x2a1d14)));
    const browL=box(0.055,0.012,0.008,browM,0.045,0.045,fz+0.002,head), browR=box(0.055,0.012,0.008,browM,-0.045,0.045,fz+0.002,head);
    box(0.03,0.055,0.03,skin,0,-0.018,fz+0.012,head);                                         /* the nose */
    const mouth=new THREE.Group(); mouth.position.set(0,-0.065,fz); head.add(mouth);
    const mIn=box(0.055,1,0.006,basic(0x3a1810),0,0,0.002,mouth); mIn.scale.y=0.008;
    const cL=box(0.012,0.008,0.006,basic(0x5a2818),0.03,0,0.002,mouth), cR=box(0.012,0.008,0.006,basic(0x5a2818),-0.03,0,0.002,mouth);
    if(ashshur){ const bM=cloth(o.beard||0x14100e,'shaggy');                  /* the long squared beard, curled in rows */
      box(0.18,0.20,0.05,bM,0,-0.17,fz-0.005,head); box(0.035,0.14,0.12,bM,hw/2-0.01,-0.07,0.03,head); box(0.035,0.14,0.12,bM,-hw/2+0.01,-0.07,0.03,head);
      for(const y of [-0.12,-0.18,-0.24]) box(0.185,0.012,0.012,flat(0x2a2018),0,y,fz+0.022,head); }
    else if(o.beard!=null){ const bM=cloth(o.beard,'shaggy');
      box(0.17,0.08,0.05,bM,0,-0.105,fz-0.005,head); box(0.035,0.10,0.12,bM,hw/2-0.01,-0.06,0.03,head); box(0.035,0.10,0.12,bM,-hw/2+0.01,-0.06,0.03,head);
      box(0.08,0.014,0.01,bM,0,-0.047,fz+0.004,head);                                        /* the moustache */
      if(o.beard===0x6d6a66||dress==='kohen') box(0.12,0.08,0.04,bM,0,-0.16,fz-0.01,head); }    /* an old man's beard, long */
    F={eL,eR,browL,browR,mIn,cL,cR};
  }
  /* WHAT IS ON THE HEAD */
  if(dress==='assyrian'){ const br=flat(0xa88850);
    box(hw+0.035,0.08,hd+0.035,br,0,0.10,0,head); box(hw-0.03,0.07,hd-0.03,br,0,0.17,0,head); box(hw-0.1,0.07,hd-0.1,br,0,0.23,0,head); box(0.04,0.06,0.04,br,0,0.29,0,head); }
  else if(dress==='rabshaqeh'){ box(hw+0.03,0.035,hd+0.03,flat(0xd4af37),0,0.06,0,head); }
  if(roman){ const br=flat(0xb08848);
    box(hw+0.04,0.09,hd+0.04,br,0,0.10,0,head); box(hw+0.06,0.02,0.07,br,0,0.07,-hd/2-0.03,head);                 /* bowl, neck-guard */
    box(0.015,0.10,0.07,br,hw/2+0.02,-0.02,0.04,head); box(0.015,0.10,0.07,br,-hw/2-0.02,-0.02,0.04,head);       /* cheek-pieces */
    if(dress==='centurion') box(0.26,0.07,0.035,flat(0xa02020),0,0.18,0,head);                                     /* the crest, crosswise */
    else box(0.03,0.04,0.12,flat(0x7a1a1a),0,0.17,0,head); }
  else if(dress==='kohen'||dress==='levite'){ const tM=cloth(0xf4f0e6,'folds');
    box(hw+0.05,0.07,hd+0.05,tM,0,0.10,0,head); box(hw+0.02,0.05,hd+0.02,tM,0,0.15,0,head); }                     /* the wound turban */
  else if(dress==='magi'){ const cM=cloth(o.cloth||0x8a2a2a,'folds');
    box(hw+0.03,0.08,hd+0.03,cM,0,0.11,0,head); box(hw-0.03,0.07,hd-0.04,cM,0,0.17,0.03,head); box(hw-0.08,0.05,0.07,cM,0,0.20,0.08,head); }  /* the soft cap, leaning forward */
  else if(dress==='king'){ box(hw+0.025,0.03,hd+0.025,flat(0xd4af37),0,0.08,0,head); }                         /* the diadem */
  else if(covered||dress==='yahusha'||dress==='fallen'){
    const cHex=o.cloth!=null?o.cloth:female?0x6a5a7a:0xd9cfb6, cM=cloth(cHex,'folds');
    box(hw+0.035,0.05,hd+0.035,cM,0,hh/2+0.02,0,head);                                               /* over the crown */
    box(0.02,0.16,hd+0.02,cM,hw/2+0.02,0.0,-0.01,head); box(0.02,0.16,hd+0.02,cM,-hw/2-0.02,0.0,-0.01,head);
    if(dress!=='woman'&&dress!=='fallen'&&dress!=='yahusha'&&o.cord!==false) box(hw+0.045,0.02,hd+0.045,flat(0x4a3020),0,hh/2-0.005,0,head);   /* the cord about it */
    box(hw+0.03,hh+0.02,0.02,cM,0,0,-hd/2-0.012,head);                                               /* over the back of the head */
    hinge(head,hw+0.03,female?0.50:0.32,0.025,cM,0,hh/2+0.01,-hd/2-0.028,'x',-1,true);                     /* hanging behind */
  }
  if(dress==='woman'){ const cM=cloth(o.cloth!=null?o.cloth:0x6a5a7a,'folds'); box(0.04,0.30,0.18,cM,0.13,1.45,-0.02,body); box(0.04,0.30,0.18,cM,-0.13,1.45,-0.02,body); }

  /* the fallen: the violet light about them */
  if(o.fallen){ const G=W.glow({scene:g},0,1.0,0,3.4,0x785090,0); G.sprite.material.opacity=0.55; g.userData.aura=G;
    const sh=W.glow({scene:g},0,0.05,0,2.2,0x3a2244,0); sh.sprite.material.opacity=0.5; }

  /* THE FACE AS THE WORDS GO: the mouth opens; the brows and eyes carry the feeling */
  const setFace=(m,shut,ex)=>{ if(!F) return; const M=[0,0.5,1][m]||0;
    F.mIn.scale.y=0.008+M*0.035; F.mIn.position.y=-M*0.008;
    const up=ex==='joy'?0.006:(ex==='sorrow'||ex==='weep'||ex==='stern')?-0.006:0;
    F.cL.position.y=F.cR.position.y=up; F.cL.visible=F.cR.visible=up!==0||M>0;
    const tilt=ex==='stern'?0.32:(ex==='sorrow'||ex==='weep'||ex==='fear')?-0.28:0;
    F.browL.rotation.z=-tilt; F.browR.rotation.z=tilt;
    F.browL.position.y=F.browR.position.y=0.045+(ex==='awe'||ex==='fear'?0.012:ex==='stern'?-0.008:ex==='joy'?0.004:0);
    const open=shut?1:ex==='stern'?0.45:ex==='joy'?0.35:ex==='awe'||ex==='fear'?0:0.01;
    F.eL.lid.scale.y=F.eR.lid.scale.y=Math.max(0.01,open); F.eL.lid.position.y=F.eR.lid.position.y=0.013-open*0.009; };
  setFace(0,false,'calm');

  g.userData={legL,legR,armL,armR,cloth:cloths,drapes,head,headY:(1.61*k),setFace,aura:g.userData.aura,
    s:k,holy:dress==='yahusha',dress,phase:Math.random()*6,blink:2+Math.random()*4,
    tunicMeshes:(()=>{ const out=[]; g.traverse(q=>{ if(q.isMesh&&q.material===tunicM) out.push(q); }); return out; })()};
  ctx.scene.add(g); return g;
};
function shade(h,k){ return (Math.min(255,Math.round((h>>16&255)*k))<<16)|(Math.min(255,Math.round((h>>8&255)*k))<<8)|Math.min(255,Math.round((h&255)*k)); }
/* a robe made another colour (the 'robe' beat): the same weave, the new colour */
W.recolor=function(g,hex){ const m=cloth(hex,'clavi',shade(hex,0.5)); for(const q of g.userData.tunicMeshes||[]) q.material=m; };
})();
