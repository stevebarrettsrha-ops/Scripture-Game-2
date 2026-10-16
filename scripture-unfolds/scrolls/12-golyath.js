/* ============ THE TWELFTH SCROLL: THE VALLEY OF ĔLAH ============
   1 SHAMU'AL 17 — the champion of the Philistines out of Gath, six cubits and
   a span, shouting across the valley to the armies of Yasharal; a shepherd
   with his staff and five smooth stones from the wadi; and the Philistine
   fallen on his face to the ground.

   PLAYED IN THE VALLEY ITSELF, between Sokoh and Azĕqah where the Philistines
   stood on the one hill and Yasharal on the other with the valley between
   them (17:1-3): the Philistine camp to the right of the picture, the camp of
   Yasharal to the left, and the open ground of the valley floor between,
   where the two come out to meet.

   VIOLENCE IS READ, NEVER DRAWN. Golyath carries nothing in his hands here,
   Dawiḏ his staff; no stone is seen to fly and nothing is seen to strike. At
   17:49 the champion simply falls on his face, and the caption says the rest.
   He is the voyage's own folk drawn half as tall again (six cubits and a
   span is near three metres), in bronze. */

STORY.scene({
  id:'golyath',
  name:'THE VALLEY OF ĔLAH',
  book:'1shamual',
  anchor:{ ll:[31.6955,34.9600], seek:'flat', r:500, front:0, snap:true },
  music:'tense',
  musicAt:[[130,'royal']],
  next:null,

  set:{ clear:[-70,-30,70,50], level:[[-40,-14,40,26,'sand',10]] },

  cast:[
    { id:'golyath', as:'giant', seed:5,
      keys:[ {t:0,x:46,z:14,face:0.75}, {t:18,x:20,z:8}, {t:22,face:0.75,pose:'arms'}, {t:40,pose:'stand'},
             {t:98,x:20,z:8,face:'dawid'}, {t:112,x:9,z:6}, {t:118,x:8.6,z:6,pose:'prone',face:0.75,glide:true,cut:true} ] },
    { id:'saul', as:'sovereign', seed:12, x:-40, z:4, face:0.25 },
    { id:'dawid', as:'boy', small:0.86, robe:0x8a7a52, staff:true, seed:19,
      keys:[ {t:0,x:-36,z:2,face:'saul'}, {t:42,x:-37,z:3,face:'saul'}, {t:58,x:-30,z:-6}, {t:62,pose:'kneel',face:0},
             {t:72,pose:'stand'}, {t:78,x:-14,z:4,face:'golyath'}, {t:98,x:-14,z:4}, {t:112,x:0,z:5}, {t:118,face:'golyath'},
             {t:132,x:2.4,z:5.0,face:'golyath'} ] },
  ],
  crowds:[
    /* the armies, each on its own side of the valley, lined up for battle (17:21) */
    { id:'phil', n:22, as:'soldier', robe:0x6a3a28, cloth:0x9a9a9a, x0:48, z0:-4, x1:64, z1:30, face:0.75, seed:41,
      poses:[[124,'stand']] },
    { id:'yash', n:22, as:['man','man','youth','man'], x0:-66, z0:-6, x1:-46, z1:26, face:0.25, seed:71,
      poses:[[132,'arms']] },
  ],
  props:[
    { k:'tent', x:70, z:22, col:0x6a4a3a }, { k:'tent', x:66, z:38, col:0x5a3a2a }, { k:'tent', x:78, z:8, col:0x6a4a3a },
    { k:'tent', x:-70, z:20 }, { k:'tent', x:-74, z:4 }, { k:'tent', x:-66, z:36 },
    { k:'reeds', x:-30, z:-8, len:16 },
  ],

  stage:[
    { t:  0, hour:9.5, dark:0, light:0.95, sky:0xa8c0d4, sun:0.9, moon:0, stars:0, firm:0,
      land:1, sea:1, clouds:0.8, lifeSea:1, lifeAir:1, lifeLand:1,
      fogN:500, fogF:1700, cd:520, cy:110, ca:0.00, cl:14, cfov:58, ox:12, oz:10, cut:true },
    { t: 20, cd:220, cy:44, cl:16, ox:20, oz:8, ca:0.03 },        /* the champion, and his shout */
    { t: 40, cd:200, cy:40, cl:16, ox:22, oz:8, ca:0.05 },
    /* ---- and Dawiḏ said to Sha'ul ---- */
    { t: 41 },
    { t: 44, cd:120, cy:28, cl:8, ox:-38, oz:3, ca:-0.04, cut:true },
    { t: 58, cd:150, cy:30, cl:6, ox:-30, oz:-5, ca:-0.02 },     /* five smooth stones from the wadi */
    { t: 78, cd:200, cy:34, cl:10, ox:-14, oz:4, ca:0.00 },
    { t: 98, cd:240, cy:38, cl:12, ox:3, oz:6, ca:0.02 },        /* the Name of (YAHUAH) HWHY of hosts */
    { t:112, cd:200, cy:36, cl:10, ox:5, oz:6, ca:0.03 },
    { t:118, cd:210, cy:40, cl:8, ox:6, oz:6, ca:0.04 },          /* and he fell on his face to the ground */
    { t:130, cd:420, cy:90, cl:10, ox:4, oz:8, ca:0.06 },
    { t:150, cd:560, cy:120, cl:12, ox:0, oz:10, ca:0.08 },
  ],

  titles:[
    { t:  0.8, to:  4.6, text:'THE VALLEY OF ĔLAH' },
  ],
  fades:[
    { t: 40.0, to: 44.5, hold:0.8 },
  ],
  caps:[
    { t:  5.0, to: 20.0, q:['1shamual',17,4] },
    { t: 20.0, to: 40.0, q:['1shamual',17,8] },
    { t: 44.5, to: 58.0, q:['1shamual',17,32] },
    { t: 58.0, to: 78.0, q:['1shamual',17,40] },
    { t: 78.0, to: 98.0, q:['1shamual',17,45] },
    { t: 98.0, to:112.0, q:['1shamual',17,48] },
    { t:112.0, to:130.0, q:['1shamual',17,49] },
    { t:130.0, to:150.0, q:['1shamual',17,50] },
  ],
});
