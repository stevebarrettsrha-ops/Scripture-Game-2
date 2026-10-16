/* ============ THE SEVENTEENTH SCROLL: THE TOMB THAT WAS FOUND EMPTY ============
   MATTITHYAHU 28 — toward dawn on the first day of the week, Miryam from
   Maḡdala and the other Miryam come to see the tomb; a great earthquake, a
   mal'ak of (YAHUAH) HWHY come down out of the shamayim to roll back the
   stone and sit on it, his appearance like lightning and his garments white
   as snow; the guards like dead men; and the word to the women: "He is not
   here, for He was raised, as He said."

   PLAYED IN THE GARDEN BY THE PLACE OF THE SKULL, outside the wall of
   Yahrushalayim as Herodes left her (the city of the voyage, at her true
   place): a tomb hewn out of the rock, its great round stone at the door.

   HE IS NOT HERE, and so He is not drawn: the film shows the stone rolled
   back and the place where the Master lay. The mal'ak is a brown man lit from
   within, without wings, coming down out of the light. The guards fall where
   they stand, and are not hurt. */

STORY.scene({
  id:'tomb',
  name:'HE IS NOT HERE',
  book:'mattithyahu',
  anchor:{ yahru:'golgothaTrue', off:[-40,70], seek:'flat', r:90, front:0, snap:true },
  music:'sorrow',
  musicAt:[[34,'tense'],[78,'holy'],[123,'eden']],
  next:null,

  set:{ clear:[-24,-16,24,20], level:[[-12,-12,12,10,'grass',6]] },

  cast:[
    { id:'miryam1', as:'woman', robe:0x5a4a6a, cloth:0x3a3a4a, seed:12,
      keys:[ {t:0,x:-26,z:-14}, {t:30,x:-5,z:-6,face:0.5}, {t:46,face:0.5,pose:'kneel'}, {t:78,pose:'stand',face:'malak'},
             {t:123,x:-5,z:-6}, {t:131,x:-28,z:-20} ], on:[0,134] },
    { id:'miryam2', as:'woman', robe:0x6a5a48, cloth:0x4a4038, seed:18,
      keys:[ {t:0,x:-28,z:-12}, {t:30,x:-7,z:-4.6,face:0.5}, {t:46,face:0.5,pose:'kneel'}, {t:78,pose:'stand',face:'malak'},
             {t:123,x:-7,z:-4.6}, {t:131,x:-30,z:-18} ], on:[0,134] },
    { id:'guard1', as:'soldier', seed:24, keys:[ {t:0,x:-3.4,z:-1.6,face:0}, {t:64,pose:'prone',face:0.5} ] },
    { id:'guard2', as:'soldier', seed:29, keys:[ {t:0,x:3.4,z:-1.2,face:0}, {t:64,pose:'prone',face:0.6} ] },
    /* a mal'ak of (YAHUAH) HWHY came down out of shamayim (28:2) — down out of the light, to the stone */
    { id:'malak', as:'malak', seed:37,
      keys:[ {t:34,x:1.6,z:1.2,y:40,face:0,glide:true}, {t:44,x:1.6,z:1.2,y:0,glide:true},
             {t:52,x:2.5,z:1.0,y:0.42,pose:'sit',face:0,cut:true} ], on:[34,200] },
  ],
  props:[ { k:'tomb', x:0, z:2.4 } ],
  signs:{ glory:{x:1.6,z:1.2,h:44,r:40,foot:4,top:2} },

  stage:[
    /* toward dawn on the first day of the week */
    { t:  0, hour:5.3, dark:0.22, light:0.56, sky:0x6a6a82, sun:0, moon:0.4, stars:0.3, firm:0,
      land:1, sea:1, clouds:0.5, lifeSea:1, lifeAir:1, lifeLand:1, glory:0, roll:0, shake:0,
      fogN:200, fogF:1100, cd:220, cy:50, ca:0.04, cl:6, cfov:56, ox:-8, oz:-4, cut:true },
    { t: 30, cd:150, cy:34, cl:8, ox:-2, oz:-1, ca:0.03 },
    /* ---- and see, there was a great earthquake ---- */
    { t: 34, shake:1, glory:0.9 },
    { t: 44, shake:0.6, roll:0, cd:160, cy:40, cl:16, ox:0, oz:1, ca:0.02 },
    { t: 50, roll:1, shake:0.2 },                                    /* and rolled back the stone from the door */
    { t: 52, shake:0, glory:0.3, cd:110, cy:30, cl:10, ox:1.6, oz:0, ca:0.04 },
    { t: 64, cd:130, cy:34, ca:0.05, glory:0 },                          /* the guards like dead men */
    { t: 78, cd:120, cy:30, cl:10, ox:-1, oz:-2, ca:-0.06, hour:5.9, dark:0.10, light:0.70, sky:0x9a8a98 },
    /* ---- "Come, see the place where the Master lay" — the door of the empty tomb ---- */
    { t: 94, cd:70, cy:18, cl:6, ox:0, oz:2.6, ca:0.0, cut:true },
    { t:106, cd:56, cy:16, cl:6, ca:0.01 },
    { t:123, hour:6.4, dark:0, light:0.86, sky:0xd0a890, sun:0.5, moon:0, stars:0, cd:240, cy:56, cl:8, ox:-6, oz:-6, ca:0.06, cut:true },
    { t:142, cd:300, cy:70, ca:0.08 },
  ],

  titles:[
    { t:  0.8, to:  4.6, text:'HE IS NOT HERE' },
  ],
  fades:[
    { t: 93.0, to: 95.0, hold:0.4 },
    { t:122.0, to:124.0, hold:0.4 },
  ],
  caps:[
    { t:  5.0, to: 30.0, q:['mattithyahu',28,1] },
    { t: 34.0, to: 52.0, q:['mattithyahu',28,2] },
    { t: 52.0, to: 64.0, q:['mattithyahu',28,3] },
    { t: 64.0, to: 78.0, q:['mattithyahu',28,4] },
    { t: 78.0, to: 94.0, q:['mattithyahu',28,5] },
    { t: 95.0, to:108.0, q:['mattithyahu',28,6] },
    { t:108.0, to:122.0, q:['mattithyahu',28,7] },
    { t:124.0, to:142.0, q:['mattithyahu',28,8] },
  ],
});
