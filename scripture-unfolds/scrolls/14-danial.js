/* ============ THE FOURTEENTH SCROLL: THE DEN OF LIONS ============
   DANI'AL 6 — the writing signed, and Dani'al on his knees three times a day
   with his windows open toward Yahrushalayim; thrown into the den, the stone
   laid on its mouth and sealed with the signet of the sovereign; and at first
   light the sovereign at the den, and the answer from inside it: "My Al has
   sent His mal'ak and has shut the lions' mouths."

   PLAYED IN BAḆEL, a little way from Etemenanki, with the eye set so the
   tower stands behind the den. The den is walls of stone about a floor, open
   above, so the eye can look down into it; the stone laid on its mouth is the
   den's own dial (`seal`).

   THE MAL'AK IS A BROWN MAN LIT FROM WITHIN, without wings, standing among
   the lions beside Dani'al — the only light in the den by night. The lions
   lie as the world's own lions lie, and nothing in this film is hurt. */

STORY.scene({
  id:'danial',
  name:'THE DEN OF LIONS',
  book:'danial',
  anchor:{ landmark:'Baḇal (Baḇylon) — Etemenanki', off:[0,-260], seek:'dry', r:400, toward:[32.54,44.42], snap:true },
  music:'night',
  musicAt:[[70,'tense'],[100,'holy']],
  next:null,

  set:{ clear:[-30,-30,30,24], level:[[-24,-14,24,14,'path',8]] },

  cast:[
    { id:'danial', as:'elder', robe:0x5a4a3a, cloth:0xd8cdb4, seed:14,
      keys:[ {t:0,x:-17,z:3,pose:'kneelpray',face:0.5},
             {t:28,x:-9,z:-2,pose:'stand',face:0.25,cut:true}, {t:40,x:-5.6,z:-1}, {t:44,x:-0.6,z:-0.4,cut:true,face:0},
             {t:100,x:-0.8,z:-0.6,face:0}, {t:124,x:-5.8,z:-1.4,cut:true,face:0.25}, {t:140,x:-12,z:-3,face:'sovereign'} ] },
    { id:'sovereign', as:'sovereign', seed:22,
      keys:[ {t:28,x:-12,z:-4,face:0.25}, {t:44,x:-6.4,z:-3.2,face:0.25},
             {t:66,x:-22,z:-10,cut:true}, {t:72,x:-22,z:-10}, {t:82,x:-6.2,z:-1.6,face:0.25}, {t:140,x:-12.6,z:-4,face:'danial'} ],
      on:[28,200] },
    { id:'guard1', as:'soldier', seed:33, keys:[ {t:28,x:-10,z:-0.4,face:0.25}, {t:40,x:-6.4,z:0.2} ], on:[28,66] },
    { id:'guard2', as:'soldier', seed:39, keys:[ {t:28,x:-11,z:1.4,face:0.25}, {t:40,x:-6.6,z:1.6} ], on:[28,66] },
    /* His mal'ak, who shut the lions' mouths */
    { id:'malak', as:'malak', seed:43, x:1.6, z:0.6, face:'danial', on:[50,124] },
  ],
  /* the lions, lying in the den */
  herds:[ { kind:'lion', n:4, x0:-3.2, z0:-3.2, x1:3.4, z1:3.4 } ],
  props:[
    { k:'den', x:0, z:0, w:9, d:9, h:3.4 },
    { k:'court', x:-18, z:3, w:7, d:6, h:2.4, on:[0,27] },
  ],

  stage:[
    /* his upper room, at evening, the windows toward Yahrushalayim */
    { t:  0, hour:18.2, dark:0.08, light:0.72, sky:0xc49a7a, sun:0.4, moon:0.3, stars:0.05, firm:0,
      land:1, sea:1, clouds:0.4, lifeSea:1, lifeAir:1, lifeLand:1, seal:0,
      fogN:300, fogF:1500, cd:70, cy:92, ca:0.04, cl:2, cfov:56, ox:-17, oz:3, cut:true },
    { t: 26, cd:66, cy:96, ca:0.06 },
    /* ---- and they threw him into the den of lions ---- */
    { t: 27 },
    { t: 30, hour:20.2, dark:0.30, light:0.42, sky:0x2a2c44, sun:0, moon:0.8, stars:0.7, cd:200, cy:70, cl:6, ox:-4, oz:0, ca:0.08, cut:true },
    { t: 48, cd:140, cy:90, cl:0, ox:0, oz:0, ca:0.10 },
    { t: 50, seal:1 },                                              /* a stone laid on the mouth of the den */
    { t: 66, cd:180, cy:100, ca:0.12, dark:0.44, light:0.32, sky:0x161a30 },
    /* ---- very early in the morning ---- */
    { t: 68 },
    { t: 71, hour:5.6, dark:0.18, light:0.60, sky:0x8a7a88, moon:0.2, stars:0.1, cd:220, cy:60, cl:8, ox:-12, oz:-6, ca:0.06, cut:true },
    { t: 82, seal:0, cd:160, cy:60, cl:6, ox:-4, oz:-1, ca:0.08 },
    /* ---- inside the den: the mal'ak, and the lions' mouths shut ---- */
    { t:100, hour:6.0, light:0.66, sky:0xa88a82, cd:66, cy:84, cl:0, ox:0, oz:0, ca:0.10, cut:true },
    { t:122, cd:72, cy:90, ca:0.13 },
    { t:124, hour:6.8, light:0.86, sky:0xc8b098, sun:0.5, cd:200, cy:60, cl:8, ox:-6, oz:-1, ca:0.08, cut:true },
    { t:144, cd:280, cy:80, cl:12, ca:0.10 },
  ],

  titles:[
    { t:  0.8, to:  4.6, text:'THE DEN OF LIONS' },
    { t: 68.0, to: 71.6, text:'VERY EARLY IN THE MORNING' },
  ],
  fades:[
    { t: 26.0, to: 31.0, hold:1.0 },
    { t: 66.5, to: 72.0, hold:1.4 },
    { t: 99.0, to:101.0, hold:0.4 },
    { t:123.0, to:125.0, hold:0.4 },
  ],
  caps:[
    { t:  5.0, to: 26.0, q:['danial',6,10] },
    { t: 31.0, to: 50.0, q:['danial',6,16] },
    { t: 50.0, to: 66.0, q:['danial',6,17] },
    { t: 72.0, to: 82.0, q:['danial',6,19] },
    { t: 82.0, to: 99.0, q:['danial',6,20] },
    { t:101.0, to:123.0, q:['danial',6,22] },
    { t:125.0, to:144.0, q:['danial',6,23] },
  ],
});
