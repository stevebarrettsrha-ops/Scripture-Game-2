/* ============ THE NINTH SCROLL: THE FLOOD ============
   BERĔSHITH 6–9 — the ark of gopher wood, the windows of the shamayim opened,
   the waters over the high mountains, and the ark come to rest on the
   mountains of Ararat, with the bow set in the cloud.

   THIS IS THE SCROLL THAT LIES ON ARARAT in the voyage (`flood`, at:{mount:
   'Mount Ararat'} in world/scrolls.js), and it is played THERE: on a level
   shoulder of the massif below the summit, with the eye set so the mountain
   stands behind the ark. The ark is laid on that ground at its true measure —
   three hundred cubits, a hundred and fifty-seven metres — and the waters
   (`flood`) are raised about it until it rides them, and let down again until
   it rests where it was laid: which is the whole of 8:4.

   FOUR MOVEMENTS. The word to Noaḥ in a grey day, and the going in. The rain
   and the waters rising, the darkest stretch of this film. The ruach passing
   over and the waters going down, the light coming back into the sky. And the
   evening of the dove and the morning of the bow.

   YAHUAH IS SHOWN ONLY AS LIGHT: when He speaks to Noaḥ a brightness stands
   over him, and nothing else. The flesh that was wiped off the earth (7:23)
   is not read here and is not drawn; what is drawn is the ark, alone. */

STORY.scene({
  id:'flood',
  name:'THE FLOOD',
  book:'bereshith',
  anchor:{ landmark:'Mount Ararat', off:[-2600,-5200], seek:'flat', r:900, toward:[39.70,44.30], snap:true },
  music:'night',
  musicAt:[[54,'storm'],[120,'eden'],[176,'holy']],
  next:null,

  /* the ground made ready: the shoulder levelled under the ark and the trees taken off it */
  set:{ clear:[-110,-40,110,70], level:[[-86,12,86,48,'dirt',10]] },

  cast:[
    { id:'noah', as:'elder', robe:0x6e5a44, seed:4,
      keys:[ {t:0,x:22,z:4,face:'eye'}, {t:22,x:24,z:6,pose:'reach',face:0.5}, {t:36,x:24,z:6,face:'eye'},
             {t:42,x:28,z:14}, {t:50,x:28,z:15}, {t:176,x:20,z:6,cut:true,face:'eye',pose:'arms'} ],
      on:[0,52] },
    { id:'noah2', as:'elder', robe:0x6e5a44, seed:4, x:20, z:6, pose:'arms', face:'eye', on:[176,240] },
    { id:'wife', as:'woman', robe:0x7a5040, seed:9,
      keys:[ {t:0,x:30,z:3,face:'eye'}, {t:38,x:30,z:3}, {t:46,x:28,z:15} ], on:[0,48] },
    { id:'shem', as:'man', seed:13, keys:[ {t:0,x:18,z:9,pose:'reach',face:0.5}, {t:38,x:18,z:9}, {t:47,x:28,z:15} ], on:[0,49] },
    { id:'ham',  as:'man', seed:17, keys:[ {t:0,x:34,z:8,pose:'reach',face:0.5}, {t:39,x:34,z:8}, {t:48,x:28,z:15} ], on:[0,50] },
    { id:'yepheth', as:'man', seed:21, keys:[ {t:0,x:12,z:5,face:0.25}, {t:40,x:12,z:5}, {t:49,x:28,z:15} ], on:[0,51] },
    /* and the household come out again, under the bow (8:18) */
    { id:'wife2', as:'woman', robe:0x7a5040, seed:9, x:24, z:5, face:'eye', on:[176,240] },
    { id:'shem2', as:'man', seed:13, x:16, z:7, face:'eye', pose:'arms', on:[176,240] },
    { id:'ham2',  as:'man', seed:17, x:27, z:8, face:'eye', on:[176,240] },
    { id:'yepheth2', as:'man', seed:21, x:13, z:4, face:'eye', on:[176,240] },
  ],
  /* the beasts going in two by two (7:9), and out again */
  herds:[
    { kind:'cow',  n:2, x0:36, z0:4, x1:40, z1:9,  on:[30,52] },
    { kind:'goat', n:2, x0:8,  z0:8, x1:12, z1:12, on:[30,52] },
    { kind:'sheep',n:2, x0:38, z0:10,x1:42, z1:13, on:[30,52] },
    { kind:'camel',n:2, x0:44, z0:4, x1:52, z1:10, on:[30,52] },
    { kind:'sheep',n:4, x0:30, z0:0, x1:44, z1:6,  on:[176,240] },
    { kind:'goat', n:3, x0:4,  z0:0, x1:12, z1:6,  on:[176,240] },
  ],
  props:[
    { k:'ark', x:0, z:30, turn:0.25, float:true, draft:5 },
    { k:'dove', x:24, z:14, h0:70, h1:13, dz:-60, on:[160,176] },
    { k:'altar', x:6, z:2, stones:10, on:[176,240] },
  ],
  signs:{ glory:{x:22,z:4,h:48,r:46,foot:6}, flood:{depth:64,below:4}, bow:{dist:900,r:430,sink:40} },

  stage:[
    /* a grey day on the shoulder of the mountain, the ark finished */
    { t:  0, hour:10.5, dark:0.10, light:0.78, sky:0x8e9aa4, sun:0.35, moon:0, stars:0, firm:0,
      land:1, sea:1, clouds:1, lifeSea:1, lifeAir:1, lifeLand:1, glory:0, rain:0, flood:0, bow:0, dove:0,
      fogN:500, fogF:2400, cd:820, cy:200, ca:0.00, cl:30, cfov:58, ox:0, oz:26, cut:true },
    { t:  6, glory:0.7 },                                   /* "and Aluahim said to Noaḥ" — light over him */
    { t: 18, cd:150, cy:40, cl:10, ox:22, oz:6, ca:0.02 },
    { t: 21, glory:0 },
    { t: 34, cd:240, cy:52, cl:14, ox:24, oz:10, ca:0.04 },  /* the rooms, the tar within and without */
    { t: 37, glory:0.6 },                                    /* "Come into the ark" */
    { t: 48, glory:0, cd:300, cy:60, cl:16, ox:26, oz:14, ca:0.06 },
    /* ---- the windows of the shamayim opened — in the dark between ---- */
    { t: 53 },
    { t: 56, hour:16, dark:0.48, light:0.40, sky:0x2e343a, sun:0, clouds:1, rain:1, flood:0.02,
      fogN:220, fogF:1300, cd:760, cy:150, cl:30, ox:0, oz:30, ca:0.10, cut:true },
    /* (the eye goes up with the waters, and looks where the ark rides: the face of the flood stands
       its dial times sixty-four metres over this ground, less four, and the ark five under that) */
    { t: 84, flood:0.40, cd:780, cy:300, cl:110, ca:0.13 },          /* forty days and forty nights */
    { t:102, flood:0.75, dark:0.54, light:0.34, sky:0x262b30, cd:820, cy:440, cl:255, ca:0.16 },
    { t:120, flood:1.0, cd:900, cy:600, cl:355, ca:0.19, fogN:160, fogF:1500 },
    /* ---- and Aluahim remembered Noaḥ — in the dark between ---- */
    { t:124 },
    { t:127, hour:9, dark:0.16, light:0.72, sky:0x8a9cac, sun:0.4, rain:0, flood:0.85,
      fogN:400, fogF:2200, cd:880, cy:540, cl:295, ca:0.22, cut:true },
    { t:142, flood:0.30, dark:0.06, light:0.86, sky:0x9cb4c8, sun:0.7, cd:840, cy:320, cl:70, ca:0.24 },
    { t:156, flood:0.0, dark:0, light:0.95, sky:0xa6c0d6, sun:0.9, cd:860, cy:260, cl:30, ca:0.26 },  /* rested on the mountains of Ararat */
    /* ---- the evening of the dove ---- */
    { t:158 },
    { t:160, hour:18.4, light:0.74, sky:0xc89a74, sun:0.5, cd:220, cy:60, cl:40, ox:24, oz:16, ca:0.28, dove:0, cut:true },
    { t:173, dove:1, cd:180, cy:56, cl:44, ca:0.29 },
    /* ---- and the morning of the bow ---- */
    { t:175 },
    { t:178, hour:8, light:0.95, sky:0x9cbcd8, sun:0.8, clouds:1, bow:0, cd:380, cy:60, cl:24, ox:18, oz:8, ca:0.31, cut:true },
    { t:184, bow:1 },
    { t:200, cd:520, cy:80, cl:40, ca:0.33 },
    { t:214, cd:560, cy:90, ca:0.34 },
  ],

  titles:[
    { t:  1.2, to:  5.4, text:'THE FLOOD' },
    { t: 53.2, to: 57.6, text:'AND THE RAIN WAS ON THE EARTH' },
    { t:124.2, to:128.0, text:'AND ALUAHIM REMEMBERED NOAḤ' },
  ],
  fades:[
    { t: 50.5, to: 57.0, hold:1.6 },
    { t:121.5, to:128.0, hold:1.4 },
    { t:156.5, to:161.0, hold:0.8 },
    { t:173.5, to:179.0, hold:0.8 },
  ],
  caps:[
    { t:  6.0, to: 21.0, q:['bereshith',6,13] },
    { t: 22.0, to: 35.0, q:['bereshith',6,14] },
    { t: 36.0, to: 50.0, q:['bereshith',7,1] },
    { t: 58.0, to: 74.0, q:['bereshith',7,11] },
    { t: 74.0, to: 84.0, q:['bereshith',7,12] },
    { t: 84.0, to:101.0, q:['bereshith',7,17] },
    { t:102.0, to:120.0, q:['bereshith',7,19] },
    { t:128.0, to:142.0, q:['bereshith',8,1] },
    { t:142.0, to:156.0, q:['bereshith',8,4] },
    { t:161.0, to:173.0, q:['bereshith',8,11] },
    { t:184.0, to:212.0, q:['bereshith',9,13] },
  ],
});
