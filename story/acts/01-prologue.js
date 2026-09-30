/* PART I — THE PROMISE. The Prologue, in the days of Yahshayahu.

   You are one of the prophet's "taught ones" — "Bind up the witness and seal
   the Torah among my taught ones" (Yashayahu 8:16) — and the scroll you copy
   his words into is the family scroll that comes down to the Galilean of the
   main story. Everything a named figure says is a passage of the Besorah,
   cited by `ref`; the words themselves live only in story/scripture.js.

   Who speaks: a verse is given to a figure only where the Besorah itself
   puts the words in his mouth (Aḥaz, 7:12; Yahshayahu, 7:13-14 and his own
   "I saw", 6:1); the rest is read as the Besorah, not voiced by anyone. */
STORY.act({
  id:'prologue', n:1, num:'I', title:'The Promise',
  sub:'Yahrushalayim · in the days of Yahshayahu (c. 740–701 BCE)',
  scenes:[

  /* ---------------- I.1 — THE VISION ---------------- */
  { id:'vision', title:'Yahrushalayim', date:'c. 740 BCE', place:'yahrushalayim', time:'dawn',
    player:{ at:[-10,26], hidden:true },
    glows:[ {id:'hekalLight', at:[6,10,-26], size:9, color:0xfff2c0, intensity:0, pulse:true, hidden:true} ],
    beats:[
      {t:'cam', from:[-70,40,70], look:[6,6,-30], dur:0.1},
      {t:'title', text:'THE FULLNESS OF TIME', sub:'Part I · The Promise'},
      {t:'cam', from:[-30,26,40], look:[6,8,-30], dur:6, wait:false},
      {t:'read', ref:'YASHAYAHU 1:1'},
      {t:'note', text:'Yahrushalayim, about 740 BCE. The words of Yahshayahu son of Amots span the reigns of four sovereigns of Yahuḏah — from the year Uzziyahu died, about 740, into the days of Ḥizqiyahu, to about 701.'},
      {t:'show', id:'hekalLight'},
      {t:'cam', from:[6,9,-2], look:[6,8,-28], dur:4},
      {t:'read', ref:'YASHAYAHU 6:1', whoName:'Yahshayahu'},
      {t:'hide', id:'hekalLight'},
      {t:'end'}
    ]},

  /* ---------------- I.2 — AT THE UPPER POOL ---------------- */
  { id:'upper-pool', title:'The upper pool', date:'c. 735 BCE', place:'yahrushalayim', time:'day',
    player:{ at:[-10,26], face:Math.PI },
    actors:[
      {id:'yah', name:'Yahshayahu', at:[-16,30], face:Math.PI, robe:0x4a3c33, cloth:0xb9ab8e, beard:0x6d6a66, staff:true},
      {id:'son', name:'She’ar-Yashuḇ', at:[-17.5,31], face:Math.PI, robe:0x8e6f4c, cloth:0xd8ceb4, small:true},
      {id:'ahaz', name:'Aḥaz', at:'ahaz', face:0, robe:0x5a2d6b, cloth:0xd4af37, sash:0xd4af37, beard:0x2c241f},
      {id:'guard1', at:[-66,69], face:0, robe:0x6b5a44, cloth:0x8a7a60},
      {id:'guard2', at:[-70,69.4], face:0, robe:0x6b5a44, cloth:0x8a7a60}
    ],
    things:[ {id:'board', kind:'box', at:[-12.5,29], w:0.6, h:0.12, d:0.45, y:0.8, color:0xc9b38a},
             {id:'boardRest', kind:'box', at:[-12.5,29], w:0.9, h:0.8, d:0.6, color:0x6e5238},
             {id:'writeStone', kind:'box', at:[-61.6,70.6], w:1.0, h:0.5, d:0.8, color:0x9c9486} ],
    beats:[
      {t:'read', ref:'YASHAYAHU 7:1'},
      {t:'read', ref:'YASHAYAHU 7:2'},
      {t:'note', text:'About 735 BCE. Aram and the northern kingdom have marched against Yahrushalayim to force Yahuḏah into their war against Ashshur. The city is afraid.'},
      {t:'read', ref:'YASHAYAHU 7:3'},
      {t:'witness', text:'Take up the writing-board — you keep the prophet’s words', items:['board'], verb:'Take up the writing-board', hold:0.6},
      {t:'hide', id:'board'},
      {t:'move', who:['yah','son'], to:['gateOut','gateOut'], wait:false},
      {t:'goal', text:'Go out of the gate with Yahshayahu and his son', goto:'gateOut'},
      {t:'move', who:['yah','son'], to:[[-60,72],[-59,73.4]], wait:false},
      {t:'goal', text:'Follow them along the highway of the Launderer’s Field to the upper pool', goto:'pool', r:4},
      {t:'face', who:'ahaz', to:'player'},
      {t:'cam', from:[-56,4.5,76], look:'ahaz', dur:2.5},
      {t:'read', ref:'YASHAYAHU 7:4'},
      {t:'read', ref:'YASHAYAHU 7:10'},
      {t:'read', ref:'YASHAYAHU 7:11'},
      {t:'say', who:'ahaz', ref:'YASHAYAHU 7:12'},
      {t:'cam', from:[-64.5,4.2,79.5], look:[-63.5,1.4,71], dur:2},
      {t:'say', who:'yah', ref:'YASHAYAHU 7:13'},
      {t:'say', who:'yah', ref:'YASHAYAHU 7:14'},
      {t:'cam', release:true},
      {t:'witness', text:'Write the sign on your board, word for word', items:['writeStone'], verb:'Write the words down', hold:1.4},
      {t:'collect', id:'y7-14'},
      {t:'choice', prompt:'You', options:[
        {text:'Keep the words exactly as he spoke them', reply:'You read the board over twice. Not one word of it is yours to change.'},
        {text:'Wonder when such a sign could come', reply:'You do not know. The words are kept; their hour will come.'} ]},
      {t:'end'}
    ]},

  /* ---------------- I.3 — AMONG THE TAUGHT ONES ---------------- */
  { id:'taught-ones', title:'Among the taught ones', date:'the years of Aḥaz and Ḥizqiyahu', place:'yahrushalayim', time:'dusk',
    player:{ at:'studyDoor', face:Math.PI },
    actors:[
      {id:'yah', name:'Yahshayahu', at:[-26,21.6], face:Math.PI, robe:0x4a3c33, cloth:0xb9ab8e, beard:0x6d6a66, staff:true},
      {id:'t1', at:[-33,23], face:Math.PI*0.5, robe:0x7c6a52, cloth:0xcfc4aa},
      {id:'t2', at:[-27,26], face:-Math.PI*0.6, robe:0x5f6a52, cloth:0xcfc4aa}
    ],
    things:[ {id:'scroll1', kind:'box', at:[-30,21.3], w:0.7, h:0.1, d:0.35, y:0.84, color:0xe9dfc2},
             {id:'scroll2', kind:'box', at:[-29.4,21.3], w:0.7, h:0.1, d:0.35, y:0.84, color:0xe9dfc2},
             {id:'scroll3', kind:'box', at:[-30.6,21.3], w:0.7, h:0.1, d:0.35, y:0.84, color:0xe9dfc2} ],
    beats:[
      {t:'read', ref:'YASHAYAHU 8:16'},
      {t:'goal', text:'Go in to the desk where the words are kept', goto:'studyDesk', r:2},
      {t:'say', who:'yah', ref:'YASHAYAHU 9:6-7'},
      {t:'witness', text:'Copy the words into your family scroll', items:['scroll1'], verb:'Copy the words', hold:1.6},
      {t:'collect', id:'y9-6'},
      {t:'note', text:'The years go by — the reign of Aḥaz ends, and Ḥizqiyahu his son reigns. The words go on being given, and the taught ones go on keeping them.'},
      {t:'time', to:'day'},
      {t:'say', who:'yah', ref:'YASHAYAHU 11:1-2'},
      {t:'witness', text:'Copy the words into your family scroll', items:['scroll2'], verb:'Copy the words', hold:1.4},
      {t:'collect', id:'y11-1'},
      {t:'say', who:'yah', ref:'YASHAYAHU 35:5-6'},
      {t:'witness', text:'Copy the words into your family scroll', items:['scroll3'], verb:'Copy the words', hold:1.4},
      {t:'collect', id:'y35-5'},
      {t:'time', to:'dusk'},
      {t:'say', who:'yah', ref:'YASHAYAHU 40:3'},
      {t:'witness', text:'Copy the words into your family scroll', items:['scroll1'], verb:'Copy the words', hold:1.4},
      {t:'collect', id:'y40-3'},
      {t:'time', to:'night'},
      {t:'say', who:'yah', ref:'YASHAYAHU 53:3-5'},
      {t:'witness', text:'Copy the words into your family scroll', items:['scroll2'], verb:'Copy the words', hold:1.6},
      {t:'collect', id:'y53-5'},
      {t:'time', to:'dawn'},
      {t:'say', who:'yah', ref:'YASHAYAHU 61:1-2'},
      {t:'witness', text:'Copy the words into your family scroll', items:['scroll3'], verb:'Copy the words', hold:1.4},
      {t:'collect', id:'y61-1'},
      {t:'choice', prompt:'You', options:[
        {text:'Roll up the scroll and bind it', reply:'Seven words, copied in your own hand. You tie the cord. Your children will keep it, and theirs after them.'},
        {text:'Read the seven words over once more', reply:'You read them in the dawn light, from the sign at the upper pool to the one who was pierced.'} ]},
      {t:'read', ref:'YASHAYAHU 8:17'},
      {t:'end'}
    ]}
  ]
});
