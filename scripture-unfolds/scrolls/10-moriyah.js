/* ============ THE TENTH SCROLL: MORIYAH ============
   BERĔSHITH 22 — "Take your son, now, your only son Yahtsḥaq, whom you love",
   the two of them going up together with the wood and the fire, the altar
   built and the wood laid in order, the Mal'ak calling from the shamayim, and
   the ram caught in the thicket by its horns.

   ONE OF THE MOUNTAINS OF THE LAND OF MORIYAH. The House would stand on the
   one the Besorah names (2 Diḇrĕ Hayamim 3:1), and on the true earth the city
   of the great king stands there now, as Herodes left it. So the binding is
   played on a brow of the same hills a few kilometres to the west, with the
   eye set on the city's side looking AWAY from it, out over the hills as they
   were when there was no city at all.

   NO BLADE IS DRAWN. 22:10 is read over the father's back, and the knife is
   in the words and nowhere else. The Mal'ak of (YAHUAH) HWHY calls "from the
   shamayim" (22:11) and is shown as what was seen: light, from above. */

STORY.scene({
  id:'moriyah',
  name:'THE MOUNTAIN OF MORIYAH',
  book:'bereshith',
  anchor:{ ll:[31.766,35.168], seek:'high', r:500, away:[31.778,35.235], snap:true },
  music:'sorrow',
  musicAt:[[104,'holy']],
  next:null,

  set:{ clear:[-30,-34,30,24], level:[[-6,-6,6,6,'grass',6]] },

  cast:[
    { id:'avrahim', as:'elder', robe:0x6e5a44, cloth:0xd8cdb4, seed:6, staff:true,
      keys:[ {t:0,x:-4,z:-4,face:'eye'}, {t:22,x:-4,z:-4},
             {t:24,x:-14,z:-26,cut:true}, {t:40,x:-7,z:-12}, {t:42,face:'yahtsaq'}, {t:58,x:-7,z:-12}, {t:72,x:-2.4,z:-1.2},
             {t:74,face:0.25}, {t:92,x:-1.9,z:-1.1,face:0.25}, {t:104,pose:'arms',face:0}, {t:120,pose:'stand',face:0.25},
             {t:140,x:4.6,z:9}, {t:150,pose:'reach',face:0.4}, {t:160,x:-1.2,z:-2.2,face:0,pose:'arms'} ] },
    { id:'yahtsaq', as:'youth', robe:0x8a7454, seed:15,
      keys:[ {t:0,x:-11,z:-24}, {t:24,x:-12,z:-27,cut:true}, {t:40,x:-5.4,z:-11}, {t:42,face:'avrahim'}, {t:58,x:-5.4,z:-11},
             {t:72,x:0.4,z:-1.4}, {t:76,x:0.95,z:0.1,y:1.25,pose:'lie',face:0.25,cut:true},
             {t:120,x:0.6,z:-1.6,y:0,pose:'stand',face:'avrahim',cut:true}, {t:160,x:0.6,z:-1.8,pose:'arms',face:0} ],
      on:[22,200] },
  ],
  /* the ram caught in a thicket by its horns (22:13) */
  herds:[ { kind:'sheep', n:1, x:4.4, z:10.6, turn:0.6, on:[124,200] } ],
  props:[
    { k:'altar', x:0, z:0, stones:12, on:[74,200] },
    { k:'thicket', x:5, z:11.5 },
    { k:'fire', x:-6.2, z:-11.4, light:0.3, on:[40,72] },
  ],
  signs:{ glory:{x:0,z:3,h:44,r:52,foot:9} },

  stage:[
    /* the word, before the going: a grey dawn over the hills */
    { t:  0, hour:5.9, dark:0.10, light:0.70, sky:0x9c9aa8, sun:0.3, moon:0.3, stars:0.1, firm:0,
      land:1, sea:1, clouds:0.8, lifeSea:1, lifeAir:1, lifeLand:1, glory:0,
      fogN:300, fogF:1500, cd:150, cy:36, ca:0.00, cl:10, cfov:56, ox:-4, oz:-4, cut:true },
    { t:  5, glory:0.55 },
    { t: 21, glory:0, cd:120, cy:30, ca:0.02 },
    /* ---- and the two of them went together (the third day, 22:4) ---- */
    { t: 23 },
    { t: 26, hour:9.5, dark:0, light:0.92, sky:0xb0c4d4, sun:0.8, cd:260, cy:70, cl:12, ox:-9, oz:-16, ca:0.06, cut:true },
    { t: 40, cd:170, cy:44, cl:10, ox:-6, oz:-11, ca:0.08 },
    { t: 58, cd:150, cy:40, cl:10, ox:-6, oz:-11, ca:0.10 },
    { t: 72, cd:180, cy:46, cl:10, ox:-1, oz:-1, ca:0.12 },
    /* ---- the altar built, and the wood laid in order — in the dark between ---- */
    { t: 73 },
    { t: 76, hour:11, cd:160, cy:58, cl:8, ox:0, oz:0, ca:0.14, cut:true },
    { t: 92, cd:210, cy:70, cl:8, ca:0.62, cut:true },               /* over his back, and nothing in his hand */
    { t:104, cd:200, cy:64, cl:12, ca:0.60 },
    { t:105, glory:1 },                                                /* the Mal'ak called from the shamayim */
    { t:118, cd:170, cy:40, cl:26, ca:0.04, cut:true },
    { t:120, glory:0.7 },
    { t:138, glory:0, cd:200, cy:52, cl:10, ox:3, oz:6, ca:0.10 },
    { t:158, cd:220, cy:54, cl:10, ox:4, oz:8, ca:0.14 },
    /* ---- YAHUAH Yahreh: the place named, and the sun going down over the hills ---- */
    { t:159 },
    { t:162, hour:17.6, light:0.82, sky:0xd0a07a, sun:0.6, cd:420, cy:90, cl:14, ox:0, oz:0, ca:0.18, cut:true },
    { t:182, cd:520, cy:120, ca:0.22 },
  ],

  titles:[
    { t:  0.8, to:  4.6, text:'THE MOUNTAIN OF MORIYAH' },
    { t: 23.0, to: 26.6, text:'AND THE TWO OF THEM WENT TOGETHER' },
  ],
  fades:[
    { t: 21.5, to: 27.0, hold:1.4 },
    { t: 72.0, to: 76.5, hold:0.8 },
    { t:158.0, to:162.5, hold:0.8 },
  ],
  caps:[
    { t:  5.0, to: 21.0, q:['bereshith',22,2] },
    { t: 27.0, to: 40.0, q:['bereshith',22,6] },
    { t: 40.0, to: 58.0, q:['bereshith',22,7] },
    { t: 58.0, to: 71.5, q:['bereshith',22,8] },
    { t: 77.0, to: 91.5, q:['bereshith',22,9] },
    { t: 92.0, to:104.0, q:['bereshith',22,10] },
    { t:104.5, to:119.0, q:['bereshith',22,11] },
    { t:119.0, to:137.0, q:['bereshith',22,12] },
    { t:138.0, to:158.0, q:['bereshith',22,13] },
    { t:163.0, to:182.0, q:['bereshith',22,14] },
  ],
});
