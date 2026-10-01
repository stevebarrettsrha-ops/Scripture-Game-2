/* PART I — THE PROMISE. The Prologue, in the days of Yahshayahu.

   You are one of the prophet's "taught ones" — "Bind up the witness and seal
   the Torah among my taught ones" (Yashayahu 8:16) — and the scroll you copy
   his words into is the family scroll that comes down to the Galilean of the
   main story. Everything a named figure says is a passage of the Besorah,
   cited by `ref`; the words themselves live only in story/scripture.js.

   Who speaks: every quotation is given to the one the Besorah says spoke it —
   (YAHUAH) HWHY to Yahshayahu (7:3-4) and to Aḥaz (7:11), the word brought to
   the house of Dawiḏ (7:2), Aḥaz (7:12), Yahshayahu (7:13-14). Where the book
   is the naḇi's own telling ("I saw", 6:1; "my taught ones", 8:16; "I shall
   wait", 8:17, and the words he was given to speak) the whole verse is his.
   The rest is the Besorah's telling, in the narrator's voice. */
STORY.act({
  id:'prologue', n:1, num:'I', title:'The Promise',
  sub:'Yahrushalayim · in the days of Yahshayahu (c. 740–701 BCE)',
  cast:{
    yahuah:{name:'(YAHUAH) HWHY', kind:'divine'},
    nabi:{name:'Yahshayahu', kind:'oldman', look:{robe:0x4a3c33, cloth:0xb9ab8e, beard:0x6d6a66}},
    report:{name:'Those who brought word', kind:'man'},
    people:{name:'The people', key:'people', kind:'crowd', actor:'w1', actors:['w1','w2','w3','w4']},
    rab:{name:'The Raḇshaqĕh', key:'rabshaqeh', kind:'man', actor:'rab', actors:['rab']},
    hiz:{name:'Ḥizqiyahu', key:'hizqiyahu', kind:'man', actor:'hiz', actors:['hiz']}
  },
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
      {t:'read', ref:'YASHAYAHU 6:1', who:'nabi'},
      {t:'hide', id:'hekalLight'},
      {t:'end'}
    ]},

  /* ---------------- I.2 — AT THE UPPER POOL ---------------- */
  { id:'upper-pool', title:'The upper pool', date:'c. 735 BCE', place:'yahrushalayim', time:'day',
    player:{ at:[-10,26], face:Math.PI },
    actors:[
      {id:'yah', name:'Yahshayahu', at:[-16,30], face:Math.PI, robe:0x4a3c33, cloth:0xb9ab8e, beard:0x6d6a66, staff:true},
      {id:'son', name:'She’ar-Yashuḇ', at:[-17.5,31], face:Math.PI, robe:0x8e6f4c, cloth:0xd8ceb4, small:true},
      {id:'ahaz', name:'Aḥaz', dress:'king', at:'ahaz', face:0, robe:0x5a2d6b, cloth:0xd4af37, sash:0xd4af37, beard:0x2c241f},
      {id:'guard1', at:[-66,69], face:0, robe:0x6b5a44, cloth:0x8a7a60},
      {id:'guard2', at:[-70,69.4], face:0, robe:0x6b5a44, cloth:0x8a7a60}
    ],
    things:[ {id:'board', kind:'box', at:[-12.5,29], w:0.6, h:0.12, d:0.45, y:0.8, color:0xc9b38a},
             {id:'boardRest', kind:'box', at:[-12.5,29], w:0.9, h:0.8, d:0.6, color:0x6e5238},
             {id:'writeStone', kind:'box', at:[-61.6,70.6], w:1.0, h:0.5, d:0.8, color:0x9c9486} ],
    beats:[
      {t:'read', ref:'YASHAYAHU 7:1'},
      {t:'read', ref:'YASHAYAHU 7:2', who:'report'},
      {t:'note', text:'About 735 BCE. Aram and the northern kingdom have marched against Yahrushalayim to force Yahuḏah into their war against Ashshur. The city is afraid.'},
      {t:'read', ref:'YASHAYAHU 7:3', who:'yahuah'},
      {t:'witness', text:'Take up the writing-board — you keep the prophet’s words', items:['board'], verb:'Take up the writing-board', hold:0.6},
      {t:'hide', id:'board'},
      {t:'move', who:['yah','son'], to:['gateOut','gateOut'], wait:false},
      {t:'goal', text:'Go out of the gate with Yahshayahu and his son', goto:'gateOut'},
      {t:'move', who:['yah','son'], to:[[-60,72],[-59,73.4]], wait:false},
      {t:'goal', text:'Follow them along the highway of the Launderer’s Field to the upper pool', goto:'pool', r:4},
      {t:'face', who:'ahaz', to:'player'},
      {t:'cam', from:[-56,4.5,76], look:'ahaz', dur:2.5},
      {t:'read', ref:'YASHAYAHU 7:4', who:'yahuah'},
      {t:'read', ref:'YASHAYAHU 7:10'},
      {t:'read', ref:'YASHAYAHU 7:11', who:'yahuah'},
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
      {t:'say', who:'yah', ref:'YASHAYAHU 8:16'},
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
      {t:'say', who:'yah', teller:'yah', ref:'YASHAYAHU 40:3'},
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
      {t:'say', who:'yah', ref:'YASHAYAHU 8:17'},
      {t:'end'}
    ]},

  /* ---------------- I.4 — SANḤĔRIḆ AT THE GATES ---------------- */
  { id:'siege', title:'Yahrushalayim', date:'c. 701 BCE', place:'yahrushalayim', time:'day',
    player:{ at:[-18,30], face:0 },
    actors:[
      ...[0,1,2,3,4].map(k=>({id:'w'+k, at:[-22+k*1.6,32+(k%2)], face:0, robe:[0x7c6a52,0x6b5a44,0x8e6f4c,0x5c5040,0x74604a][k], cloth:[0xcfc4aa,0xb9ab8e,0xd8ceb4,0xa89a7e,0xc1b394][k], beard:k%2?0x2c241f:0x3a2a1e})),
      {id:'alyaqim', name:'Alyaqim', at:[-16,28], face:0, robe:0x3f4a6a, cloth:0xe8e2d2, beard:0x2c241f, sash:0xb08d3c},
      {id:'shebnah', name:'Sheḇnah', dress:'scribe', at:[-14,28.6], face:0, robe:0x6a5a44, cloth:0xd8cfb8, beard:0x6d6a66},
      {id:'yoah', name:'Yo’aḥ', at:[-12,28], face:0, robe:0x5a4a6a, cloth:0xd8ceb4, beard:0x3a2a1e},
      ...[0,1,2,3,4,5].map(k=>({id:'p'+k, at:[-34+k*4.6,38], y:7.2, face:0, robe:[0x7c6a52,0x5f6a52,0x8e6f4c,0x6b5a44,0x74604a,0x6e5a70][k], cloth:[0xcfc4aa,0xe8e2d2,0xb9ab8e,0x3c3a44,0xd8ceb4,0xe6e0cf][k], kind:k%3===1?'woman':'man', beard:k%3===1?null:0x2c241f})),
      {id:'rab', name:'The Raḇshaqĕh', dress:'rabshaqeh', at:[-48,110], face:Math.PI, robe:0x2a3a6a, sash:0x8a1a2a, beard:0x14100e, cloth:null, hidden:true, key:'rabshaqeh'},
      ...[0,1,2,3,4,5,6,7].map(k=>({id:'a'+k, dress:'assyrian', at:[-44-(k%4)*2,112+Math.floor(k/4)*2], face:Math.PI, robe:0x7a2a22, cloth:null, beard:0x14100e, hidden:true}))
    ],
    things:[ {id:'rock1', kind:'box', at:[-30,58], w:0.5, h:0.4, d:0.5, color:0x9c9486},
             {id:'rock2', kind:'box', at:[-34,61], w:0.55, h:0.42, d:0.45, color:0x8d8272},
             {id:'rock3', kind:'box', at:[-38,57.6], w:0.45, h:0.38, d:0.5, color:0x9c9486} ],
    beats:[
      {t:'cam', from:[-30,18,96], look:[-14,6,36], dur:0.1},
      {t:'title', text:'The fourteenth year of Ḥizqiyahu', sub:'c. 701 BCE'},
      {t:'read', ref:'YASHAYAHU 36:1'},
      {t:'note', text:'About 701 BCE. Sanḥĕriḇ’s own annals, found at Ninewĕh, boast of taking forty-six walled cities of Yahuḏah and of shutting Ḥizqiyahu up in Yahrushalayim “like a bird in a cage” — but they do not claim the city. His palace walls show the siege of Laḵish.'},
      {t:'cam', release:true},
      {t:'read', ref:'2 DIḆRĔ HAYAMIM 32:2'},
      {t:'read', ref:'2 DIḆRĔ HAYAMIM 32:3'},
      {t:'say', who:'people', ref:'2 DIḆRĔ HAYAMIM 32:4'},
      {t:'move', who:['w0','w1','w2','w3','w4'], to:[[-14,48],[-24,56],[-36,62],[-50,68],[-60,70]], speed:2, wait:false},
      {t:'goal', text:'Go out of the gate with the men to stop the springs outside the city', goto:'gateOut', r:4},
      {t:'witness', text:'Carry stones to stop the outlet of the waters', items:['rock1','rock2','rock3'], verb:'Lift the stone', hold:0.6, deliver:'poolEnd', r:4, carryText:'Carry the stone to the outlet of the waters'},
      {t:'read', ref:'2 DIḆRĔ HAYAMIM 32:30'},
      {t:'note', text:'The channel he cut is there still: 533 metres through the rock beneath the City of Dawiḏ, from the spring of Giḥon to the pool of Shiloaḥ. An inscription found in it in 1880 tells how the two crews of hewers, cutting from either end, heard each other’s picks through the rock and met.'},
      {t:'goal', text:'Go back into the city and up onto the wall — the army of Ashshur is coming', goto:'gateIn', r:4},
      {t:'player', at:[-22,38.2], y:7.2, lock:true, face:0},
      {t:'show', id:['rab','a0','a1','a2','a3','a4','a5','a6','a7']},
      {t:'move', who:['rab','a0','a1','a2','a3','a4','a5','a6','a7'], to:[[-62,78],[-58,84],[-60,85],[-62,86],[-64,85.4],[-66,86],[-68,85],[-56,86.4],[-70,84]], speed:2.2, wait:false},
      {t:'cam', from:[-24,10,35], look:[-58,1.5,78], dur:3},
      {t:'read', ref:'YASHAYAHU 36:2'},
      {t:'move', who:['alyaqim','shebnah','yoah'], to:[[-60,73],[-62,72.4],[-58,72.6]], speed:2},
      {t:'face', who:'rab', to:'alyaqim'},
      {t:'read', ref:'YASHAYAHU 36:3'},
      {t:'cam', from:[-55,3,70], look:'rab', dur:2.5},
      {t:'say', who:'rab', ref:'YASHAYAHU 36:4', turn:false},
      {t:'face', who:'rab', to:[-22,38]},
      {t:'cam', from:[-25,9,34], look:'rab', dur:2.5},
      {t:'say', who:'rab', ref:'YASHAYAHU 36:13', turn:false},
      {t:'say', who:'rab', ref:'YASHAYAHU 36:14', turn:false},
      {t:'say', who:'rab', teller:'rab', ref:'YASHAYAHU 36:15', turn:false},   /* his speech runs on from 36:14 */
      {t:'cam', from:[-30,8.6,34], look:[-24,7.8,38], dur:2.5},
      {t:'read', ref:'YASHAYAHU 36:21', voices:['hiz']},
      {t:'robe', who:'alyaqim', color:0x4a4036}, {t:'robe', who:'shebnah', color:0x4a4036}, {t:'robe', who:'yoah', color:0x4a4036},
      {t:'move', who:['alyaqim','shebnah','yoah'], to:[[-14,30],[-15.6,31],[-12.4,31]], speed:1.6, wait:false},
      {t:'read', ref:'YASHAYAHU 36:22'},
      {t:'player', lock:false},
      {t:'choice', prompt:'You', options:[
        {text:'Keep silent, as the sovereign commanded', reply:'You hold your tongue on the wall with the others. Below, the army of Ashshur waits.'},
        {text:'Think of the sign given at this same pool', reply:'Thirty years ago, here at the upper pool, the naḇi gave a sign to Aḥaz. You still have the board you wrote it on.'} ]},
      {t:'end'}
    ]},

  /* ---------------- I.5 — THE DELIVERANCE ---------------- */
  { id:'deliverance', title:'Yahrushalayim', date:'c. 701 BCE', place:'yahrushalayim', time:'day',
    player:{ at:'studyIn', face:0 },
    actors:[
      {id:'hiz', name:'Ḥizqiyahu', dress:'king', at:[2,4], face:Math.PI, robe:0x4a4036, sash:0x3a3028, beard:0x2c241f, key:'hizqiyahu'},
      {id:'yah', name:'Yahshayahu', at:'studyDesk', face:Math.PI, robe:0x4a3c33, cloth:0xb9ab8e, beard:0x6d6a66, staff:true},
      {id:'k0', dress:'kohen', at:[2,-30], face:0, beard:0x6d6a66},
      ...[0,1,2,3,4,5,6,7].map(k=>({id:'a'+k, dress:'assyrian', at:[-48-(k%4)*3.4,90+Math.floor(k/4)*4], face:Math.PI*(k%2), robe:0x7a2a22, cloth:null, beard:0x14100e}))
    ],
    things:[ {id:'letter', kind:'box', at:[-30,22.6], w:0.5, h:0.08, d:0.3, y:0.84, color:0xe9dfc2},
             ...[0,1,2,3,4].map(k=>({id:'tent'+k, kind:'box', at:[-44-k*5,96+(k%2)*3], w:3.2, h:1.9, d:2.6, color:0xb8a888})) ],
    glows:[ {id:'malak', at:[-30,14,90], size:12, color:0xfff6dc, intensity:2.2, pulse:true, hidden:true} ],
    beats:[
      {t:'cam', from:[12,4,-4], look:'hiz', dur:0.1},
      {t:'move', who:'hiz', to:[6,-26], speed:1.2, wait:false},
      {t:'cam', from:[14,5,-14], look:[6,1.6,-26], dur:8, wait:false},
      {t:'read', ref:'YASHAYAHU 37:1'},
      {t:'read', ref:'YASHAYAHU 37:14'},
      {t:'read', ref:'YASHAYAHU 37:15'},
      {t:'face', who:'hiz', to:[6,-50]},
      {t:'sit', who:'hiz'},
      {t:'time', to:'dusk'},
      {t:'cam', from:[10.6,2.6,-20.4], look:'hiz', dur:2.5},
      {t:'say', who:'hiz', ref:'YASHAYAHU 37:16', turn:false},
      {t:'say', who:'hiz', ref:'YASHAYAHU 37:20', turn:false},
      {t:'cam', release:true},
      {t:'witness', text:'Yahshayahu has written a word for the sovereign. Take it from his hand', items:['letter'], verb:'Take the word', hold:0.8},
      {t:'hide', id:'letter'},
      {t:'goal', text:'Carry it up through the city to the House, where the sovereign is', goto:'hekalView', r:5},
      {t:'stand', who:'hiz'}, {t:'face', who:'hiz', to:'player'},
      {t:'cam', from:[9,2.4,-18], look:'hiz', dur:2.5},
      {t:'say', who:'yah', ref:'YASHAYAHU 37:21', turn:false},
      {t:'say', who:'yah', ref:'YASHAYAHU 37:33', turn:false},
      {t:'say', who:'yah', ref:'YASHAYAHU 37:34', turn:false},
      {t:'say', who:'yah', ref:'YASHAYAHU 37:35', turn:false},
      {t:'time', to:'night'},
      {t:'lie', who:['a0','a1','a2','a3','a4','a5','a6','a7']},
      {t:'cam', from:[-22,12,40], look:[-50,1,92], dur:3},
      {t:'show', id:'malak'},
      {t:'drift', id:'malak', to:[-70,12,96], dur:4},
      {t:'read', ref:'YASHAYAHU 37:36'},
      {t:'hide', id:'malak'},
      {t:'time', to:'dawn'},
      {t:'read', ref:'YASHAYAHU 37:37'},
      {t:'cam', release:true},
      {t:'choice', prompt:'You', options:[
        {text:'Write it in the scroll with the other words', reply:'“He does not come into this city.” You add it beneath the rest, with the date. The scroll is heavier than it was.'},
        {text:'Go up on the wall and look at the empty road', reply:'The road to Laḵish is quiet. The springs you stopped will be opened again.'} ]},
      {t:'end'}
    ]}

  ]
});
