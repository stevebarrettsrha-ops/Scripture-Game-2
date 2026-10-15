/* ============ THE ELEVENTH SCROLL: BĔYTH ʼĔL ============
   BERĔSHITH 28 — Ya‛aqoḇ on the road to Ḥaran, a stone of that place at his
   head, the ladder set up on the earth whose top reached to the shamayim, the
   mal'akim of Aluahim going up and coming down on it, and the stone set up in
   the morning as a standing column.

   PLAYED AT BĔYTH ʼĔL, on the ridge north of the city where the old town of
   Luz stood. It is the one film on this shelf told almost wholly by night,
   and the ladder is the light of it: a way of gold from the ground beside the
   sleeper up past the clouds, the mal'akim on it brown men lit from within
   and without wings, going up and coming down, and at its top — "and see,
   (YAHUAH) HWHY stood above it" (28:13) — a brightness and nothing more.

   The stone is the same stone throughout (`pillar`): lying at his head, and
   raised on its end by its dial when he rose early in the morning (28:18). */

STORY.scene({
  id:'bethel',
  name:'THE GATE OF THE SHAMAYIM',
  book:'bereshith',
  anchor:{ ll:[31.931,35.222], seek:'flat', r:300, front:0, snap:true },
  music:'night',
  musicAt:[[36,'holy'],[132,'eden']],
  next:null,

  set:{ clear:[-26,-30,26,26], level:[[-5,-4,5,5,'grass',6]] },

  cast:[
    { id:'yaaqob', as:'man', robe:0x7c6a52, cloth:0x8a6e4c, seed:23, staff:true,
      keys:[ {t:0,x:-24,z:-8}, {t:16,x:-1.6,z:-0.6}, {t:18,pose:'kneel',face:0.25},
             {t:26,x:1.5,z:0.0,y:0,pose:'lie',face:0.25,cut:true},
             {t:100,x:-0.4,z:-0.4,pose:'sit',face:0.5,cut:true}, {t:114,pose:'kneel',face:0.5}, {t:128,pose:'stand',face:0.5},
             {t:132,x:-1.6,z:-0.4,pose:'stand',face:0.25,cut:true}, {t:140,pose:'reach'}, {t:150,pose:'arms',face:0} ] },
    /* the mal'akim of Aluahim going up and coming down on it (28:12) */
    { id:'m1', as:'malak', seed:31, climb:{period:44,phase:0.05,dir:1,side:0}, on:[38,100] },
    { id:'m2', as:'malak', seed:37, climb:{period:44,phase:0.30,dir:-1,side:0}, on:[38,100] },
    { id:'m3', as:'malak', seed:41, climb:{period:44,phase:0.55,dir:1,side:0}, on:[38,100] },
    { id:'m4', as:'malak', seed:47, climb:{period:44,phase:0.80,dir:-1,side:0}, on:[38,100] },
    { id:'m5', as:'malak', seed:53, climb:{period:44,phase:0.18,dir:-1,side:0}, on:[38,100] },
    { id:'m6', as:'malak', seed:59, climb:{period:44,phase:0.68,dir:1,side:0}, on:[38,100] },
  ],
  props:[
    { k:'pillar', x:-0.75, z:-0.1, turn:0.25 },
    { k:'ladder', x:3.5, z:4, h:300, lean:0.22 },
  ],
  signs:{ glory:{x:3.5,z:70,h:300,r:150,foot:30,top:10,shaft:false} },

  stage:[
    /* the sun had set (28:11): the last of the light on the ridge */
    { t:  0, hour:18.7, dark:0.14, light:0.66, sky:0x8a6c5e, sun:0.25, moon:0.4, stars:0.15, firm:0,
      land:1, sea:1, clouds:0.5, lifeSea:1, lifeAir:1, lifeLand:1, ladder:0, glory:0, raise:0,
      fogN:220, fogF:1100, cd:210, cy:50, ca:0.00, cl:8, cfov:56, ox:-10, oz:-4, cut:true },
    { t: 16, cd:110, cy:30, cl:6, ox:-1, oz:0, ca:0.02, hour:19.4, light:0.5, sky:0x4a3e48, sun:0.05 },
    { t: 30, cd:90, cy:26, cl:4, ca:0.04, hour:21, dark:0.40, light:0.36, sky:0x161c30, stars:0.9, moon:0.6 },
    /* ---- AND HE DREAMED ---- */
    { t: 34 },
    { t: 38, ladder:1, cd:200, cy:24, cl:180, ox:2, oz:2, ca:0.08, cfov:62, cut:true },
    { t: 60, cd:260, cy:30, cl:420, ca:0.10, glory:0.4 },
    { t: 62, glory:1 },
    { t: 80, cd:320, cy:40, cl:900, ca:0.12, cfov:64 },
    { t: 98, cd:150, cy:40, cl:30, ca:0.13, ladder:1 },
    /* ---- and Ya‛aqoḇ awoke from his sleep ---- */
    { t:100, ladder:0, glory:0, hour:4.5, dark:0.32, light:0.42, sky:0x232a44, cd:110, cy:28, cl:8, ox:0, oz:0, ca:0.06, cut:true },
    { t:128, hour:5.4, dark:0.18, light:0.56, sky:0x6a6070, cd:120, cy:30, ca:0.05 },
    /* ---- the stone set up as a standing column ---- */
    { t:130 },
    { t:132, hour:6.4, dark:0, light:0.86, sky:0xc8a890, sun:0.6, moon:0, stars:0, raise:1, cd:90, cy:22, cl:7, ox:-1, oz:0, ca:0.04, cut:true },
    { t:150, cd:300, cy:70, cl:10, ca:0.08 },
    { t:166, cd:380, cy:90, ca:0.10 },
  ],

  titles:[
    { t:  0.8, to:  4.6, text:'THE GATE OF THE SHAMAYIM' },
    { t: 34.0, to: 38.0, text:'AND HE DREAMED' },
  ],
  fades:[
    { t: 31.0, to: 38.5, hold:2.0 },
    { t: 98.5, to:101.5, hold:0.6 },
    { t:129.0, to:133.0, hold:0.8 },
  ],
  caps:[
    { t:  5.0, to: 16.0, q:['bereshith',28,10] },
    { t: 16.0, to: 31.0, q:['bereshith',28,11] },
    { t: 39.0, to: 60.0, q:['bereshith',28,12] },
    { t: 60.0, to: 80.0, q:['bereshith',28,13] },
    { t: 80.0, to: 98.0, q:['bereshith',28,15] },
    { t:101.0, to:114.0, q:['bereshith',28,16] },
    { t:114.0, to:129.0, q:['bereshith',28,17] },
    { t:133.0, to:150.0, q:['bereshith',28,18] },
    { t:150.0, to:166.0, q:['bereshith',28,19] },
  ],
});
