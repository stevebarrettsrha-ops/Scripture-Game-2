/* ============ THE EIGHTEENTH SCROLL: THE FESTIVAL OF WEEKS ============
   ACTS 2 — the taught ones all with one mind in one place; a sound from the
   shamayim as of a rushing mighty ruach filling all the house where they were
   sitting; divided tongues as of fire settling on each one of them; and the
   crowd of every nation under the shamayim come together, every one hearing
   them speak in his own language.

   PLAYED IN YAHRUSHALAYIM, in the house of the taught ones that stands in the
   lower city by the square (world/yahrushalayim-true.js — the city of the
   voyage as Herodes left her, at her true place): its walls open to the sky,
   so the eye looks down on them sitting together, and its door on the street
   where the crowd comes.

   THE RUACH IS SHOWN AS THE VERSE SHOWS IT: a sound (the eye shaken, the
   light come upon the house), and tongues AS OF FIRE on each head (`tongues`,
   on each player that carries one) — and nothing else is drawn for it.

   (No recordings: read by caption alone, with the music under it.) */

const SHAB_SEATED=[];
{ const names=['kepha','yaaqob','yahuchanan','andrew','philip','bartholomai','toma','mattithyahu','yaaqob2','shimon','yahudah','mattithyah','miryam','woman2'];
  for(let k=0;k<14;k++){ const a=k/14*Math.PI*2, x=-2+2.6*Math.sin(a), z=-0.7+2.5*Math.cos(a), w=k>=12;
    SHAB_SEATED.push({ id:names[k], as:w?'woman':(k%5===2?'youth':'man'), seed:200+k*7, tongue:true,
      keys:[ {t:0,x,z,pose:'sit',face:[-2,-0.7]}, {t:58,pose:'arms',face:[-2,-0.7]}, {t:78,x:-2+(k-6.5)*0.85,z:-6.6,pose:'stand',face:0,cut:true} ] }); } }

STORY.scene({
  id:'shabuoth',
  name:'THE FESTIVAL OF WEEKS',
  book:'acts',
  anchor:{ yahru:'studyIn', front:0, snap:true },
  music:'holy',
  musicAt:[[22,'storm'],[40,'holy'],[78,'royal']],
  next:null,

  cast:SHAB_SEATED,
  crowds:[
    /* Yahuḏim, dedicated men from every nation under the shamayim (2:5) */
    { id:'nations', n:34, as:'mixed', x0:-16, z0:-22, x1:10, z1:-10, face:0.5, seed:301, on:[78,240], poses:[[112,'kneel']] },
  ],
  signs:{ glory:{x:-2,z:-0.5,h:40,r:44,foot:9,top:3} },

  stage:[
    /* all with one mind in one place: the eye over the walls, looking down on them */
    { t:  0, hour:9.0, dark:0, light:0.95, sky:0xb0c4d6, sun:0.9, moon:0, stars:0, firm:0,
      land:1, sea:1, clouds:0.6, lifeSea:1, lifeAir:1, lifeLand:1, glory:0, tongues:0, shake:0,
      fogN:400, fogF:1500, cd:70, cy:120, ca:0.04, cl:0, cfov:58, ox:-2, oz:-0.6, cut:true },
    { t: 20, cd:76, cy:126, ca:0.07 },
    /* ---- and suddenly there came a sound from the shamayim ---- */
    { t: 22, shake:0.7, glory:0.5, clouds:1 },
    { t: 38, shake:0.2, glory:0.8, cd:80, cy:120, ca:0.10 },
    { t: 40, shake:0, tongues:1, cd:60, cy:96, cl:4, ca:0.12 },       /* divided tongues, as of fire */
    { t: 58, cd:66, cy:100, ca:0.15 },
    { t: 76, glory:0.3, cd:70, cy:104, ca:0.17 },
    /* ---- the crowd come together at the door ---- */
    { t: 77 },
    { t: 80, glory:0, tongues:0.6, cd:220, cy:60, cl:10, ox:-3, oz:-10, ca:0.02, cut:true },
    { t: 94, cd:180, cy:52, cl:10, ox:-3, oz:-8, ca:0.04 },
    { t:112, cd:300, cy:110, cl:6, ox:-3, oz:-12, ca:0.06 },
    { t:130, cd:380, cy:140, ca:0.08 },
  ],

  titles:[
    { t:  0.8, to:  4.6, text:'THE FESTIVAL OF WEEKS' },
  ],
  fades:[
    { t: 76.0, to: 80.5, hold:0.8 },
  ],
  caps:[
    { t:  5.0, to: 21.0, q:['acts',2,1] },
    { t: 22.0, to: 40.0, q:['acts',2,2] },
    { t: 40.0, to: 58.0, q:['acts',2,3] },
    { t: 58.0, to: 76.0, q:['acts',2,4] },
    { t: 81.0, to: 94.0, q:['acts',2,5] },
    { t: 94.0, to:112.0, q:['acts',2,6] },
    { t:112.0, to:130.0, q:['acts',2,41] },
  ],
});
