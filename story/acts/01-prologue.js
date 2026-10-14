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
    hiz:{name:'Ḥizqiyahu', key:'hizqiyahu', kind:'man', actor:'hiz', actors:['hiz']},
    /* "one cried to another" (6:3): the seraphim, figures of light with their six wings (6:2) */
    seraph:{name:'The seraphim', key:'seraph', kind:'angel', glow:'ser1'}
  },
  scenes:[

  /* ---------------- I.1 — THE VISION ---------------- */
  { id:'vision', title:'Yahrushalayim', date:'c. 740 BCE', place:'yahrushalayim', time:'dawn',
    /* WHAT YAHSHAYAHU SAW (6:1-7), staged as the verses say it and no more. He is in the Hĕḵal of
       the earth at dawn; what he SEES is the house above it — the court of heaven, raised over the
       city above the clouds (`heaven`, and every place of the vision is written from it): a vault
       of golden light, a floor of cloud, the pillars of the heavenly house, the throne high and
       lifted up with the train of the robe filling the house, the seraphim over it, the altar from
       which the coal is taken. When the vision has been given he is in the Hĕḵal of stone again.
       He who sits on the throne is never drawn: the throne stands in its light and the light is on
       the seat. The seraphim are figures of light, each with his six wings — two over his face,
       two over his feet, two beating (6:2). In the earthly house, places are written along the
       house itself (`holyPlace>porchFront`), so they stand right in the small city and the true. */
    player:{ at:[-10,26], hidden:true },
    actors:[ {id:'yah', name:'Yahshayahu', at:['holyPlace>porchFront',0.44,0,'f'], face:Math.PI, robe:0x4a3c33, cloth:0xb9ab8e, beard:0x6d6a66, hidden:true} ],
    things:[
      {id:'heaven', kind:'heavenCourt', at:'holyPlace', y:220, pave:{w:16, d:20, z:-11}, hidden:true},
      {id:'throne', kind:'gloryThrone', at:['heaven',0,-14], y:220, s:2.4, lift:3, hidden:true},
      {id:'train', kind:'robeTrain', at:['heaven',0,-13.2], y:220, len:24, w0:3, w1:20, h0:6.4, hidden:true},
      {id:'altar', kind:'heavenAltar', at:['heaven',6,-4], y:220, s:1.3, hidden:true},
      /* "and the house was filled with smoke" (6:4) */
      {id:'smoke', kind:'smokeCloud', at:['heaven',0,-4], y:220, r:20, h:16, n:56, rest:0.16, hold:12, hidden:true} ],
    glows:[ {id:'hekalLight', at:[6,10,-26], size:9, color:0xfff2c0, intensity:0, pulse:true, hidden:true},
            /* the light on the seat, and the column of it over the throne */
            {id:'glory', at:['heaven',0,-14.6], y:220+8.2, size:6.5, color:0xfff6dc, intensity:1.8, pulse:true, hidden:true},
            {id:'gloryHigh', at:['heaven',0,-15.4], y:220+17, size:3.6, h:26, color:0xfffbe8, intensity:0, pulse:true, hidden:true},
            /* "above it stood seraphim": two who cry one to another, either side over the throne, and two more above */
            /* (the one at the right of the throne carries the tongs he takes the coal with, 6:6) */
            {id:'ser1', seraph:true, scale:2, at:['heaven',-6.5,-10], y:220+12, size:5, color:0xffc070, intensity:1.4, pulse:true, hidden:true},
            {id:'ser2', seraph:true, tongs:true, scale:2, at:['heaven',6.5,-10], y:220+12, size:5, color:0xffc070, intensity:1.4, pulse:true, hidden:true},
            {id:'ser3', seraph:true, scale:1.8, at:['heaven',-4.5,-17], y:220+19, size:4.5, color:0xffb860, intensity:0.9, pulse:true, hidden:true},
            {id:'ser4', seraph:true, scale:1.8, at:['heaven',4.5,-17], y:220+19, size:4.5, color:0xffb860, intensity:0.9, pulse:true, hidden:true},
            /* the live coal on the altar, taken with the tongs (6:6) */
            {id:'coal', at:['heaven',6,-4], y:220+1.9, size:1.1, color:0xff6a20, intensity:1.6, hidden:true} ],
    beats:[
      {t:'cam', from:[-70,40,70], look:[6,6,-30], dur:0.1},
      {t:'title', text:'THE FULLNESS OF TIME', sub:'Part I · The Promise'},
      {t:'cam', from:[-30,26,40], look:[6,8,-30], dur:6, wait:false},
      {t:'read', ref:'YASHAYAHU 1:1'},
      {t:'note', text:'Yahrushalayim, about 740 BCE. The words of Yahshayahu son of Amots span the reigns of four sovereigns of Yahuḏah — from the year Uzziyahu died, about 740, into the days of Ḥizqiyahu, to about 701.'},
      {t:'show', id:'hekalLight'},
      {t:'cam', from:[6,9,-2], look:[6,8,-28], dur:4},
      {t:'hide', id:'hekalLight'},
      /* in the Hĕḵal of stone, at dawn, the prophet before the veil */
      {t:'face', who:'yah', to:['holyPlace>porchFront',-0.42,0,'f']},
      {t:'show', id:'yah'},
      {t:'cam', from:['holyPlace>porchFront',0.62,1.2,'f'], fdy:1.9, look:{at:['holyPlace>porchFront',-0.30,0,'f'], dy:3.2}, dur:2.5},
      /* and the house of heaven is opened to him */
      {t:'fade', to:1, color:'#fff8e6', dur:1.4},
      {t:'place', who:'yah', at:['heaven',0,12], y:220, face:Math.PI},
      {t:'show', id:['heaven','throne','train','altar','glory','gloryHigh']},
      {t:'cam', from:['heaven',3,21], fy:220+2.6, look:{at:['heaven',0,-14], y:220+8}, dur:0.1},
      {t:'fade', to:0, color:'#fff8e6', dur:2.2},
      {t:'read', ref:'YASHAYAHU 6:1', who:'nabi'},
      {t:'show', id:['ser1','ser2','ser3','ser4']},
      /* close on one of them: his face covered, his feet covered, and with two he flies */
      {t:'cam', from:['heaven',-10,1.5], fy:220+8.6, look:{at:['heaven',-6.5,-10], y:220+12.2}, dur:3},
      {t:'read', ref:'YASHAYAHU 6:2', who:'nabi'},
      {t:'cam', from:['heaven',-10,1], fy:220+10, look:{at:['heaven',0,-12], y:220+12.5}, dur:2.5},
      {t:'read', ref:'YASHAYAHU 6:3', teller:'nabi', voices:['seraph']},
      /* "the posts of the door were shaken by the voice of him who cried out" */
      {t:'quake', s:2.6},
      {t:'show', id:'smoke'},
      {t:'cam', from:['heaven',-5,27], fy:220+5, look:{at:['heaven',0,-10], y:220+7}, dur:2.5},
      {t:'read', ref:'YASHAYAHU 6:4', who:'nabi'},
      /* "Woe to me, for I am undone!" — and he goes down on his knees */
      {t:'kneel', who:'yah'},
      {t:'cam', from:['heaven',-3.2,8], fy:220+1.6, look:'yah', dur:2},
      {t:'read', ref:'YASHAYAHU 6:5', who:'nabi', teller:'nabi'},
      /* one of the seraphim flies down to the altar, takes the coal in his tongs, and flies to him with it */
      {t:'show', id:'coal'},
      {t:'cam', from:['heaven',12,8], fy:220+4, look:{at:['heaven',4,0], y:220+3}, dur:2},
      {t:'drift', id:'ser2', toAt:['heaven',6,-6.2], y:220+3.4, dur:2.4},
      {t:'carry', id:'coal', by:'ser2'},
      /* he comes down before him, bows, and brings the tongs to his lips */
      {t:'drift', id:'ser2', toAt:['heaven',0,8.25], y:220+3.2, dur:3},
      {t:'cam', from:['heaven',-7,19.5], fy:220+2.6, look:{at:['heaven',0,9], y:220+3.6}, dur:1.6},
      {t:'read', ref:'YASHAYAHU 6:6', who:'nabi'},
      {t:'cam', from:['heaven',-5.2,13.6], fy:220+2.1, look:{at:['heaven',0,11], y:220+2.2}, dur:1.4},
      {t:'read', ref:'YASHAYAHU 6:7', teller:'nabi', voices:['seraph']},
      {t:'carry', id:'coal'},
      {t:'hide', id:'coal'},
      {t:'drift', id:'ser2', toAt:['heaven',6.5,-10], y:220+12, dur:2.6, wait:false},
      {t:'stand', who:'yah'},
      {t:'cam', from:['heaven',3,21], fy:220+2.6, look:{at:['heaven',0,-14], y:220+8}, dur:2.5},
      {t:'read', ref:'YASHAYAHU 6:8', teller:'nabi', voices:['yahuah','nabi']},
      {t:'read', ref:'YASHAYAHU 6:9', teller:'nabi', voices:['yahuah']},
      {t:'read', ref:'YASHAYAHU 6:10', who:'yahuah'},
      {t:'read', ref:'YASHAYAHU 6:11', teller:'nabi', voices:['nabi','yahuah']},
      {t:'read', ref:'YASHAYAHU 6:12', who:'yahuah'},
      {t:'read', ref:'YASHAYAHU 6:13', who:'yahuah'},
      /* and he is in the house of stone again, sent */
      {t:'fade', to:1, color:'#fff8e6', dur:1.4},
      {t:'hide', id:['heaven','throne','train','altar','glory','gloryHigh','ser1','ser2','ser3','ser4','smoke']},
      {t:'place', who:'yah', at:['holyPlace>porchFront',0.44,0,'f'], y:null, face:Math.PI},
      {t:'cam', from:['holyPlace>porchFront',0.62,-1.2,'f'], fdy:1.8, look:'yah', dur:0.1},
      {t:'fade', to:0, color:'#fff8e6', dur:1.8},
      {t:'end'}
    ]},

  /* ---------------- I.2 — AT THE UPPER POOL ---------------- */
  { id:'upper-pool', title:'The upper pool', date:'c. 735 BCE', place:'yahrushalayim', time:'day',
    player:{ at:[-10,26], face:Math.PI },
    actors:[
      /* (by the gate, measured from it: written in the small city's numbers, the boy was set in the true
         city on the top of its gate-tower, fourteen metres up, with no way down) */
      {id:'yah', name:'Yahshayahu', at:['gateIn>gateOut',0,2], face:'gateIn', robe:0x4a3c33, cloth:0xb9ab8e, beard:0x6d6a66, staff:true},
      {id:'son', name:'She’ar-Yashuḇ', at:['gateIn>gateOut',1,3.5], face:'gateIn', robe:0x8e6f4c, cloth:0xd8ceb4, small:true},
      {id:'ahaz', name:'Aḥaz', dress:'king', at:['ahaz',2.6,0.4], face:0, robe:0x5a2d6b, cloth:0xd4af37, sash:0xd4af37, beard:0x2c241f},
      {id:'guard1', at:[-64.2,69], face:0, robe:0x6b5a44, cloth:0x8a7a60},
      {id:'guard2', at:[-63.4,72.4], face:0, robe:0x6b5a44, cloth:0x8a7a60}
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
    player:{ at:['gateIn>gateOut',0,4], face:'gateOut' },
    actors:[
      ...[0,1,2,3,4].map(k=>({id:'w'+k, at:['gateIn>gateOut',2+(k%2),8-k*1.6], face:'gateOut', robe:[0x7c6a52,0x6b5a44,0x8e6f4c,0x5c5040,0x74604a][k], cloth:[0xcfc4aa,0xb9ab8e,0xd8ceb4,0xa89a7e,0xc1b394][k], beard:k%2?0x2c241f:0x3a2a1e})),
      {id:'alyaqim', name:'Alyaqim', at:['gateIn>gateOut',-2,2], face:'gateOut', robe:0x3f4a6a, cloth:0xe8e2d2, beard:0x2c241f, sash:0xb08d3c},
      {id:'shebnah', name:'Sheḇnah', dress:'scribe', at:['gateIn>gateOut',-1.4,0], face:'gateOut', robe:0x6a5a44, cloth:0xd8cfb8, beard:0x6d6a66},
      {id:'yoah', name:'Yo’aḥ', at:['gateIn>gateOut',-2,-2], face:'gateOut', robe:0x5a4a6a, cloth:0xd8ceb4, beard:0x3a2a1e},
      /* the people on the wall (Yashayahu 36:11), along its walk: on her own wall's top in the true city, which
         no one height will do for (they were thrown six hundred metres off, or stood in the air over a street) */
      ...[0,1,2,3,4,5].map(k=>({id:'p'+k, at:['wallTop>wallTopEnd',[0,2,4,8,10,12][k],0], y:'wallTopY', face:'pool', robe:[0x7c6a52,0x5f6a52,0x8e6f4c,0x6b5a44,0x74604a,0x6e5a70][k], cloth:[0xcfc4aa,0xe8e2d2,0xb9ab8e,0x3c3a44,0xd8ceb4,0xe6e0cf][k], kind:k%3===1?'woman':'man', beard:k%3===1?null:0x2c241f})),
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
      {t:'player', at:['wallTop>wallTopEnd',6,0], y:'wallTopY', lock:true, face:'pool'},
      {t:'show', id:['rab','a0','a1','a2','a3','a4','a5','a6','a7']},
      {t:'move', who:['rab','a0','a1','a2','a3','a4','a5','a6','a7'], to:[[-57,74.5],[-53.2,76],[-55,76.6],[-57,77],[-59,76.6],[-53,74.4],[-52.2,72.8],[-51.6,75],[-60.6,75.8]], speed:2.2, wait:false},   /* the lip of the hill; the army behind on the slope */
      {t:'cam', from:[-46,5,66], look:[-58,1.2,76], dur:3},
      {t:'read', ref:'YASHAYAHU 36:2'},
      {t:'move', who:['alyaqim','shebnah','yoah'], to:[[-58,70.2],[-60,70.6],[-56,70.4]], speed:2},
      {t:'face', who:'rab', to:'alyaqim'},
      {t:'read', ref:'YASHAYAHU 36:3'},
      {t:'cam', from:[-59.6,2.3,67.6], look:'rab', dur:2.5},     /* over Alyaqim's shoulder */
      {t:'say', who:'rab', ref:'YASHAYAHU 36:4', turn:false},
      {t:'face', who:'rab', to:'player'},
      {t:'cam', from:[-53.4,2.2,71.2], look:'rab', dur:2.5},       /* he turns to call up to the wall */
      {t:'say', who:'rab', ref:'YASHAYAHU 36:13', turn:false},
      {t:'say', who:'rab', ref:'YASHAYAHU 36:14', turn:false},
      {t:'say', who:'rab', teller:'rab', ref:'YASHAYAHU 36:15', turn:false},   /* his speech runs on from 36:14 */
      {t:'cam', on:'p2', shot:'back', toward:'rab', dur:2.5},                /* over the shoulders of the people on the wall */
      {t:'read', ref:'YASHAYAHU 36:21', voices:['hiz']},
      {t:'robe', who:'alyaqim', color:0x4a4036}, {t:'robe', who:'shebnah', color:0x4a4036}, {t:'robe', who:'yoah', color:0x4a4036},
      {t:'move', who:['alyaqim','shebnah','yoah'], to:[['gateIn>gateOut',0,0],['gateIn>gateOut',1,1.6],['gateIn>gateOut',1,-1.6]], speed:1.6, wait:false},
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
      {id:'hiz', name:'Ḥizqiyahu', dress:'king', at:'street', face:Math.PI, robe:0x4a4036, sash:0x3a3028, beard:0x2c241f, key:'hizqiyahu'},
      {id:'yah', name:'Yahshayahu', at:'studyDesk', face:Math.PI, robe:0x4a3c33, cloth:0xb9ab8e, beard:0x6d6a66, staff:true},
      {id:'k0', dress:'kohen', at:[2,-30], face:0, beard:0x6d6a66},
      ...[0,1,2,3,4,5,6,7].map(k=>({id:'a'+k, dress:'assyrian', at:[-50.4-(k%4)*3.3,71.6+Math.floor(k/4)*2.8], face:Math.PI*(k%2), robe:0x7a2a22, cloth:null, beard:0x14100e}))
    ],
    things:[ {id:'letter', kind:'box', at:[-30,22.6], w:0.5, h:0.08, d:0.3, y:0.84, color:0xe9dfc2},
             ...[0,1,2,3,4].map(k=>({id:'tent'+k, kind:'box', at:[-46.4-k*4.2,76.2-(k%2)*0.6], w:3.2, h:1.9, d:2.2, color:0xb8a888})) ],
    glows:[ {id:'malak', malak:true, at:[-34,13,70], size:12, color:0xfff6dc, intensity:2.2, pulse:true, hidden:true} ],
    beats:[
      {t:'cam', from:[12,4,-4], look:'hiz', dur:0.1},
      {t:'move', who:'hiz', to:['hekalView>hekal',4,0], speed:1.2, wait:false},     /* (up to the House: four metres on from where it is seen, toward it) */
      {t:'cam', from:[14,5,-14], look:[6,1.6,-26], dur:8, wait:false},
      {t:'read', ref:'YASHAYAHU 37:1'},
      {t:'read', ref:'YASHAYAHU 37:14'},
      {t:'read', ref:'YASHAYAHU 37:15'},
      {t:'face', who:'hiz', to:'hekal'},
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
      {t:'cam', from:[-30,10,48], look:[-54,1,74], dur:3},
      {t:'show', id:'malak'},
      {t:'drift', id:'malak', to:[-66,11,76], dur:4},
      {t:'read', ref:'YASHAYAHU 37:36'},
      {t:'hide', id:'malak'},
      {t:'time', to:'dawn'},
      {t:'read', ref:'YASHAYAHU 37:37'},
      {t:'cam', release:true},
      {t:'choice', prompt:'You', options:[
        {text:'Write it in the scroll with the other words', reply:'“He does not come into this city.” You add it beneath the rest, with the date. The scroll is heavier than it was.'},
        {text:'Go up on the wall and look at the empty road', reply:'The road to Laḵish is quiet. The springs you stopped will be opened again.'} ]},
      {t:'end'}
    ]},

  /* ---------------- I.6 — ḤIZQIYAHU'S SICKNESS, AND THE SHADOW ON THE STAIR ---------------- */
  { id:'sickness', title:'Yahrushalayim', date:'in those days', place:'yahrushalayim', time:'day',
    player:{ at:'palaceYard', face:Math.PI/2 },
    actors:[
      {id:'hiz', name:'Ḥizqiyahu', dress:'king', at:[29.2,-30.8], face:Math.PI/2, robe:0x4a4036, sash:0x3a3028, beard:0x2c241f, key:'hizqiyahu'},
      {id:'yah', name:'Yahshayahu', at:[18,-24], face:Math.PI/2, robe:0x4a3c33, cloth:0xb9ab8e, beard:0x6d6a66, staff:true}
    ],
    things:[ {id:'mat', kind:'box', at:[28,-30.8], w:2.2, h:0.12, d:1, color:0xb39a6a},
             {id:'figs', kind:'box', at:[20.6,-26.4], w:0.4, h:0.12, d:0.4, dy:0.02, color:0x6a3a4a},
             {id:'shade', kind:'box', at:[35.8,-23.85], w:1.9, h:0.02, d:0.85, dy:0.36, color:0x2a2622} ],
    beats:[
      {t:'lie', who:'hiz'},
      {t:'cam', from:[20,4.4,-20], look:[29,1.4,-28.6], dur:0.1},
      {t:'move', who:'yah', to:'palaceDoor', speed:1.2},
      {t:'move', who:'yah', to:'palaceIn', speed:1.2},
      {t:'move', who:'yah', to:[27.6,-29.4], speed:1},
      {t:'face', who:'yah', to:'hiz'},
      {t:'cam', from:[32.2,1.8,-26.6], look:[28.4,0.8,-30.4], dur:2},
      {t:'say', who:'yah', ref:'YASHAYAHU 38:1', turn:false},
      {t:'read', ref:'YASHAYAHU 38:2'},
      {t:'say', who:'hiz', ref:'YASHAYAHU 38:3', turn:false},
      {t:'move', who:'yah', to:'palaceIn', speed:1.1},
      {t:'move', who:'yah', to:'palaceDoor', speed:1.1},
      {t:'move', who:'yah', to:[19.6,-27], speed:1.1},
      {t:'cam', from:[16,2.6,-21.6], look:[19.6,1.6,-27], dur:2},
      {t:'read', ref:'YASHAYAHU 38:4'},
      {t:'read', ref:'YASHAYAHU 38:5', voices:['yahuah']},
      {t:'read', ref:'YASHAYAHU 38:6', who:'yahuah'},
      {t:'move', who:'yah', to:'palaceDoor', speed:1.3},
      {t:'move', who:'yah', to:'palaceIn', speed:1.3},
      {t:'move', who:'yah', to:[27.6,-29.4], speed:1},
      {t:'face', who:'yah', to:'hiz'},
      {t:'cam', from:[32.2,1.8,-26.6], look:[28.4,0.8,-30.4], dur:2},
      {t:'say', who:'yah', ref:'YASHAYAHU 38:7', turn:false},
      {t:'cam', from:'dialFoot', fy:3, look:[35.8,1.6,-27.6], dur:2.5},
      {t:'say', who:'yah', ref:'YASHAYAHU 38:8', turn:false},
      {t:'drift', id:'shade', by:[0,3.15,-8.1], dur:7},              /* ten steps back up the stair */
      {t:'note', text:'The “sundial of Aḥaz” is in the Hebrew the “steps (ma‛aloth) of Aḥaz” — a stair by the house of the sovereign on which the shadow fell, step by step, as the sun went down.'},
      {t:'witness', text:'Yahshayahu has called for a cake of figs — fetch it and bring it in', items:['figs'], verb:'Take the figs', hold:0.5, deliver:[27.4,-29.8], r:2.2, carryText:'Bring it to the sovereign'},
      {t:'say', who:'yah', ref:'YASHAYAHU 38:21', turn:false},
      {t:'say', who:'hiz', ref:'YASHAYAHU 38:22', turn:false},
      {t:'cam', release:true},
      {t:'choice', prompt:'You', options:[
        {text:'Go out and look at the stair again', reply:'The shadow lies where it lay this morning. You count the steps twice.'},
        {text:'Write it in the scroll', reply:'Fifteen years, and a sign on the stair of Aḥaz. You write it under the word about the city.'} ]},
      {t:'end'}
    ]},

  /* ---------------- I.7 — THE ENVOYS OF BAḆAL ---------------- */
  { id:'envoys', title:'Yahrushalayim', date:'at that time', place:'yahrushalayim', time:'day',
    player:{ at:[18.6,-31.6], face:Math.PI/2 },
    actors:[
      {id:'hiz', name:'Ḥizqiyahu', dress:'king', at:[23,-30.6], face:-Math.PI/2, robe:0x4a4036, sash:0xd4af37, cloth:0xd4af37, beard:0x2c241f, key:'hizqiyahu'},
      {id:'yah', name:'Yahshayahu', at:[10,-22], face:Math.PI/2, robe:0x4a3c33, cloth:0xb9ab8e, beard:0x6d6a66, staff:true},
      ...[0,1,2].map(k=>({id:'env'+k, name:k===0?'An envoy of Baḇal':undefined, dress:'rabshaqeh', at:[14-k*1.4,-25-k*1.2], face:Math.PI/2,
        robe:[0x2a4a8a,0x8a2a3a,0x3a6a5a][k], sash:[0xd4af37,0x2a2a6a,0x8a1a2a][k], beard:0x14100e}))
    ],
    things:[{"id": "tr0", "kind": "box", "at": [21.4, -33.6], "w": 0.7, "h": 0.5, "d": 0.5, "color": 13938487, "hidden": true}, {"id": "tr1", "kind": "box", "at": [22.8, -33.8], "w": 0.7, "h": 0.5, "d": 0.5, "color": 13158604, "hidden": true}, {"id": "tr2", "kind": "box", "at": [24.2, -33.6], "w": 0.7, "h": 0.5, "d": 0.5, "color": 13938487, "hidden": true}, {"id": "tr3", "kind": "box", "at": [21.8, -35], "w": 0.7, "h": 0.5, "d": 0.5, "color": 9071162, "hidden": true}, {"id": "tr4", "kind": "box", "at": [23.4, -35.2], "w": 0.7, "h": 0.5, "d": 0.5, "color": 11569754, "hidden": true}],
    beats:[
      {t:'cam', from:[14,4,-16], look:[22,1.4,-30], dur:0.1},
      {t:'move', who:['env0','env1','env2'], to:[[20.2,-29.2],[19,-28.2],[21.4,-28]], speed:1.3, wait:false},
      {t:'read', ref:'YASHAYAHU 39:1'},
      {t:'face', who:'hiz', to:'env0'},
      {t:'show', id:['tr0','tr1','tr2','tr3','tr4']},
      {t:'cam', from:[17.6,2.6,-36.2], look:[22.6,1,-33.4], dur:2.5},
      {t:'read', ref:'YASHAYAHU 39:2'},
      {t:'move', who:['env0','env1','env2'], to:[[14,-25],[12.6,-26.2],[11.2,-27.4]], speed:1.3, wait:false},
      {t:'move', who:'yah', to:[21,-29.4], speed:1.3},
      {t:'face', who:'yah', to:'hiz'}, {t:'face', who:'hiz', to:'yah'},
      {t:'cam', from:[17.4,2.2,-27.2], look:[22.2,1.5,-30.2], dur:2},
      {t:'read', ref:'YASHAYAHU 39:3', voices:['yah','hiz']},
      {t:'read', ref:'YASHAYAHU 39:4', voices:['yah','hiz']},
      {t:'say', who:'yah', ref:'YASHAYAHU 39:5', turn:false},
      {t:'say', who:'yah', ref:'YASHAYAHU 39:6', turn:false},
      {t:'say', who:'yah', ref:'YASHAYAHU 39:7', turn:false},
      {t:'read', ref:'YASHAYAHU 39:8', voices:['hiz','hiz']},
      {t:'cam', release:true},
      {t:'note', text:'A little over a hundred years later it came to pass: Baḇal took Yahrushalayim, carried off the treasures of the house of the sovereign and of the House of (YAHUAH) HWHY, and took the sons of the house of Dawiḏ into exile (2 Melaḵim 24-25; Dani’al 1:3).'},
      {t:'choice', prompt:'You', options:[
        {text:'Write the word about Baḇal in the scroll', reply:'Under the word about the city spared, the word about the city taken. Both from the same mouth, both true.'},
        {text:'Look at the gold still lying in the court', reply:'The servants are carrying it back in. Somewhere on the road east, the envoys are counting it in their heads.'} ]},
      {t:'end'}
    ]}

  ]
});
