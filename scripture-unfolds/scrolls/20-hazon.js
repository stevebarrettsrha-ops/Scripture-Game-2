/* ============ THE TWENTIETH SCROLL: ḤAZON ============
   ḤAZON 1, 21–22 — Yahuchanon on the island called Patmos; a renewed shamayim
   and a renewed earth, and the sea no more; the set-apart city, renewed
   Yahrushalayim, coming down out of the shamayim from Aluahim, her light like
   a jasper stone clear as crystal; no need of the sun nor of the moon; and
   the river of water of life from the throne.

   THE LAST SCROLL OF THE SHELF, and the end of the whole Bible when it is
   played as one. PLAYED ON PATMOS, on the height of the island with the eye
   looking out over the sea, where Yahuchanon came to be "for the Word of
   Aluahim and for the witness of Yahusha Mashiach".

   ALUAHIM IS SHOWN AS LIGHT. The city is let down out of the air by its dial
   (`city`): foursquare, her walls clear as crystal and burning with a light
   not her own, three gates to a side; and as she comes the sun and the moon
   are taken out of the sky (21:23) and the light does not fail.

   (No recordings: read by caption alone, with the music under it.) */

STORY.scene({
  id:'hazon',
  name:'ḤAZON',
  book:'hazon',
  anchor:{ ll:[37.309,26.548], seek:'high', r:900, toward:[37.32,26.30] },
  music:'night',
  musicAt:[[26,'holy']],
  next:null,

  set:{ clear:[-20,-20,20,20] },

  cast:[
    { id:'yahuchanon', as:'elder', robe:0x6e5e4a, cloth:0xd8cdb4, seed:16,
      keys:[ {t:0,x:-1,z:-2,face:0.5}, {t:24,x:0,z:0,face:0.5,pose:'stand'}, {t:66,pose:'kneel'}, {t:104,pose:'arms'} ] },
  ],
  signs:{ city:{dist:900, size:380, high:1400, rest:-30}, glory:{x:0,z:900,h:320,r:900,foot:120,top:60,shaft:false} },

  stage:[
    /* the island at evening, the sea all about it */
    { t:  0, hour:18.6, dark:0.06, light:0.74, sky:0xc49478, sun:0.4, moon:0.4, stars:0.05, firm:0,
      land:1, sea:1, clouds:0.5, lifeSea:1, lifeAir:1, lifeLand:1, city:0, glory:0, far:0,
      fogN:500, fogF:2600, cd:120, cy:40, ca:0.04, cl:10, cfov:56, ox:0, oz:0, cut:true },
    { t: 24, cd:150, cy:44, ca:0.06 },
    /* ---- a renewed shamayim and a renewed earth ---- */
    { t: 26, hour:19.5, dark:0, light:1.0, sky:0xe8dcc0, sun:0, moon:0, stars:0.3, firm:0.25, clouds:0.2, sea:0, lifeSea:0, far:1,
      fogN:900, fogF:5200, cd:200, cy:60, cl:40, ox:0, oz:20, ca:0.02, cfov:60, cut:true },
    { t: 46, city:0.0, glory:0.3, cd:240, cy:60, cl:170, oz:30, ca:0.0 },
    { t: 68, city:0.55, glory:0.7, cd:260, cy:70, cl:190, ca:-0.01 },     /* coming down out of the shamayim from Aluahim */
    { t: 88, glory:1, cd:240, cy:60, cl:160, ca:-0.02 },
    { t:106, city:0.7, cd:220, cy:60, cl:140, ca:-0.02 },
    /* ---- to a great and high mountain ---- */
    { t:108, cd:400, cy:900, cl:950, ox:0, oz:60, ca:0.03, cut:true },
    { t:126, city:1, cd:460, cy:1000, cl:1000, ca:0.05 },
    { t:142, cd:500, cy:1040, cl:1040, ca:0.07 },
    { t:160, cd:300, cy:120, cl:150, ox:0, oz:20, ca:0.01, cut:true },
    { t:178, cd:340, cy:140, cl:170, ca:0.0 },
    { t:198, cd:420, cy:200, cl:230, ca:-0.02 },
  ],

  titles:[
    { t:  0.8, to:  4.6, text:'ḤAZON' },
  ],
  fades:[
    { t: 24.0, to: 28.0, hold:1.2 },
    { t:106.5, to:109.5, hold:0.6 },
    { t:158.5, to:161.5, hold:0.6 },
  ],
  caps:[
    { t:  5.0, to: 24.0, q:['hazon',1,9] },
    { t: 28.0, to: 46.0, q:['hazon',21,1] },
    { t: 46.0, to: 68.0, q:['hazon',21,2] },
    { t: 68.0, to: 88.0, q:['hazon',21,3] },
    { t: 88.0, to:106.0, q:['hazon',21,4] },
    { t:109.0, to:126.0, q:['hazon',21,10] },
    { t:126.0, to:142.0, q:['hazon',21,11] },
    { t:142.0, to:158.0, q:['hazon',21,23] },
    { t:161.0, to:178.0, q:['hazon',22,1] },
    { t:178.0, to:198.0, q:['hazon',22,5] },
  ],
});
