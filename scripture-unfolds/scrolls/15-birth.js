/* ============ THE FIFTEENTH SCROLL: THE BIRTH AT BĔYTH LEḤEM ============
   LUKE 2 — Yosĕph and Miryam come up to the city of Dawiḏ; the first-born Son
   wrapped up and laid in a feeding trough, because there was no room for them
   in a lodging place; shepherds living out in the fields keeping watch over
   their flock by night, a mal'ak of (YAHUAH) HWHY standing before them and the
   esteem of (YAHUAH) HWHY shining around them, the heavenly host praising, and
   the shepherds coming in haste to find the baby lying in the trough.

   THE FIRST OF THE BESORAH ON THIS SHELF, and the first film here in which
   YAHUSHA IS SEEN — so the first in which the face rule is kept by the stage
   itself: the child is made holy (`infant`), the front of His head the skin
   of a child and nothing drawn on it, and the eye is never let nearer to Him
   than the stage's GUARD, whatever a key below asks of it.

   PLAYED IN THE FIELDS EAST OF BĔYTH LEḤEM, below the ridge the town stands
   on, with the eye looking toward the town: the shepherds at their fire in
   the field, and a shelter for beasts against the rock at the field's edge,
   on the way up to the town, where the trough is.

   The mal'ak and the host are brown men lit from within, without wings; the
   esteem of (YAHUAH) HWHY is light, and only light.

   (THE NEW TESTAMENT HAS NO RECORDINGS in Scripture-Game, and this film is
   read by caption alone, with the music under it.) */

STORY.scene({
  id:'birth',
  name:'THE BIRTH AT BĔYTH LEḤEM',
  book:'luke',
  anchor:{ town:'Bĕyth Leḥem', off:[1250,-250], seek:'flat', r:260, toward:[31.7050,35.2024], snap:true },
  music:'night',
  musicAt:[[70,'holy'],[184,'eden']],
  next:null,

  set:{ clear:[-30,-26,56,40], level:[[-14,-10,14,14,'grass',8],[26,0,44,14,'path',6]] },

  cast:[
    { id:'yoseph', as:'man', robe:0x6e5a44, cloth:0x8a7a62, seed:27, staff:true,
      keys:[ {t:0,x:-6,z:-18}, {t:20,x:28,z:4}, {t:22,face:0.25}, {t:36,x:33.6,z:4.2,face:-0.1,cut:true},
             {t:186,x:33.4,z:3.6,face:0.1} ] },
    { id:'miryam', as:'woman', robe:0x4a5a7a, cloth:0x3a4a6a, seed:30,
      keys:[ {t:0,x:-8,z:-19}, {t:20,x:26,z:3}, {t:22,face:0.25}, {t:36,x:36.4,z:4.0,pose:'kneel',face:0.75,cut:true} ] },
    /* the child, wrapped up and laid in the trough — holy: His face is never drawn */
    { id:'yahusha', as:'infant', x:34.8, z:3.0, y:0.62, face:0.25, on:[36,240] },
    /* the shepherds, at their fire by night (2:8) */
    { id:'sh1', as:'shepherd', seed:51, keys:[ {t:0,x:-2.6,z:0.4,pose:'sit',face:[0,0.6]}, {t:72,pose:'kneel',face:0.5}, {t:170,pose:'stand',face:0.5},
                                              {t:172,x:-2.6,z:0.4}, {t:186,x:30,z:-1.4,cut:true,pose:'kneel',face:0.5} ] },
    { id:'sh2', as:'shepherd', seed:57, keys:[ {t:0,x:2.4,z:0.8,pose:'sit',face:[0,0.6]}, {t:72,pose:'prone',face:0.5}, {t:104,pose:'kneel',face:0.5},
                                              {t:170,pose:'stand'}, {t:186,x:32,z:-2.6,cut:true,pose:'kneel',face:0.5} ] },
    { id:'sh3', as:'shepherd', seed:63, keys:[ {t:0,x:0.6,z:2.8,pose:'stand',face:0}, {t:72,pose:'kneel',face:0.5}, {t:170,pose:'stand'},
                                              {t:186,x:35,z:-2.8,cut:true,pose:'kneel',face:0.5} ] },
    { id:'sh4', as:'boy', seed:69, robe:0x8a7a5a, keys:[ {t:0,x:-0.4,z:-2.4,pose:'sit',face:[0,0.6]}, {t:72,pose:'kneel',face:0.5}, {t:170,pose:'stand'},
                                              {t:186,x:37.4,z:-1.6,cut:true,pose:'kneel',face:0.5} ] },
    /* a mal'ak of (YAHUAH) HWHY stood before them (2:9) */
    { id:'malak', as:'malak', seed:71, keys:[ {t:72,x:0.4,z:8,y:2.4,face:0}, {t:132,x:0.4,z:8,y:3.4} ], on:[72,168] },
  ],
  crowds:[
    /* and suddenly with the mal'ak a crowd of the heavenly host (2:13) */
    { id:'host', n:26, as:'malak', x0:-34, z0:14, x1:34, z1:30, y:[10,34], face:0, seed:101, on:[134,168] },
  ],
  herds:[
    { kind:'sheep', n:12, x0:-14, z0:5, x1:12, z1:14 },
    { kind:'donkey', n:1, x:40, z:6.6, turn:0.3, on:[36,240] },
    { kind:'ox', n:1, x:41, z:2, turn:0.8, on:[36,240] },
  ],
  props:[
    { k:'fire', x:0, z:0.6, light:0.5 },
    { k:'stable', x:34.2, z:3.2 },
  ],
  signs:{ glory:{x:0.4,z:6,h:26,r:60,foot:22,top:6} },

  stage:[
    /* the road up from the north at the end of the day: Yosĕph and Miryam come to the city of Dawiḏ */
    { t:  0, hour:17.6, dark:0.06, light:0.78, sky:0xc8987a, sun:0.45, moon:0.3, stars:0.05, firm:0,
      land:1, sea:1, clouds:0.4, lifeSea:1, lifeAir:1, lifeLand:1, glory:0,
      fogN:300, fogF:1400, cd:260, cy:70, ca:0.02, cl:10, cfov:56, ox:10, oz:-6, cut:true },
    { t: 20, cd:160, cy:42, cl:8, ox:28, oz:3, ca:0.06, hour:18.3, light:0.62, sky:0x7a5a5a, sun:0.15 },
    /* ---- the days were filled for her to give birth ---- */
    { t: 34 },
    { t: 37, hour:22.8, dark:0.34, light:0.40, sky:0x141a30, sun:0, moon:0.8, stars:0.95,
      cd:70, cy:30, cl:4, ox:34.6, oz:3.4, ca:0.02, cut:true },
    { t: 52, cd:72, cy:28, ca:0.05 },
    /* ---- the shepherds in the field ---- */
    { t: 53 },
    { t: 56, cd:110, cy:34, cl:6, ox:0, oz:1, ca:-0.04, cut:true },
    { t: 70, cd:100, cy:30, ca:-0.02 },
    { t: 72, glory:1, light:0.80, dark:0.10 },                      /* the esteem of (YAHUAH) HWHY shone around them */
    { t: 88, cd:160, cy:30, cl:16, ox:0, oz:4, ca:0.52, cut:true },     /* from behind the shepherds: the mal'ak before them */
    { t:104, cd:180, cy:34, cl:18, ca:0.54 },
    { t:118, cd:200, cy:36, cl:20, ca:0.55 },
    { t:132, cd:220, cy:40, cl:24, ca:0.56 },
    { t:134, cd:420, cy:46, cl:130, ox:0, oz:16, ca:0.53, cfov:62, cut:true },   /* the heavenly host */
    { t:150, cd:460, cy:50, cl:150, ca:0.51 },
    { t:166, cd:480, cy:52, cl:150, ca:0.50 },
    { t:168, glory:0, light:0.40, dark:0.34, cd:150, cy:36, cl:8, ox:2, oz:0, ca:0.02, cfov:56, cut:true },
    /* ---- and they came in haste ---- */
    { t:184 },
    { t:187, hour:23.4, cd:120, cy:40, cl:6, ox:33, oz:1, ca:0.03, cut:true },
    { t:206, cd:150, cy:48, ca:0.06 },
  ],

  titles:[
    { t:  0.8, to:  4.6, text:'THE BIRTH AT BĔYTH LEḤEM' },
    { t: 53.0, to: 56.4, text:'AND IN THE SAME COUNTRY' },
    { t:184.0, to:187.4, text:'AND THEY CAME IN HASTE' },
  ],
  fades:[
    { t: 33.0, to: 37.5, hold:1.0 },
    { t: 52.0, to: 56.5, hold:1.0 },
    { t:183.0, to:187.5, hold:1.0 },
  ],
  caps:[
    { t:  5.0, to: 20.0, q:['luke',2,4] },
    { t: 20.0, to: 33.0, q:['luke',2,6] },
    { t: 38.0, to: 52.0, q:['luke',2,7] },
    { t: 57.0, to: 71.0, q:['luke',2,8] },
    { t: 72.0, to: 88.0, q:['luke',2,9] },
    { t: 88.0, to:104.0, q:['luke',2,10] },
    { t:104.0, to:118.0, q:['luke',2,11] },
    { t:118.0, to:132.0, q:['luke',2,12] },
    { t:134.0, to:150.0, q:['luke',2,13] },
    { t:150.0, to:166.0, q:['luke',2,14] },
    { t:168.0, to:183.0, q:['luke',2,15] },
    { t:188.0, to:206.0, q:['luke',2,16] },
  ],
});
