/* ACT II — THE COMING. The first vertical slice (the design document's own
   decision: lead with the Nativity, because it fulfils 7:14 and 9:6 up front).

   THE WITNESS. You are a shepherd boy of Bĕyth Leḥem — the invented witness
   of the design document, the same one who will follow Yahusha as a grown
   man. You were in the fields that night, and you went up with the shepherds.
   What you did NOT see — the account of Natsareth, the dream of Yosĕph,
   Herodes' court — is shown as the Besorah tells it, and said to be so.

   Reverent framing (Key Decision 1): the mal'ak is light and the Child is
   light; neither is given a figure or a face. */
const MIRYAM={robe:0x3f5a8a, cloth:0xe8e2d2, skin:0x8e5c3c, kind:'woman'};
const YOSEPH={robe:0x6e5238, cloth:0xcfc4aa, beard:0x3a2a1e, skin:0x86573a};
const BOY={small:true, robe:0x8a7454, cloth:0xd8cfb8};
STORY.act({
  id:'coming', n:3, num:'II', title:'The Coming',
  sub:'Natsareth · the road · Bĕyth Leḥem · c. 5–4 BCE',
  /* who speaks, where the one speaking is light or many: each quotation goes to the one the
     Besorah names, and a mal'ak's light swells with the words */
  cast:{
    gabrial:{name:'Gaḇri’al', kind:'angel', glow:'gabrial'},
    dreamMalak:{name:'A mal’ak of (YAHUAH) HWHY', kind:'angel', glow:'dream'},
    malak:{name:'The mal’ak', kind:'angel', glow:'malak'},
    host:{name:'The heavenly host', kind:'angel'},
    shepherds:{name:'The shepherds', kind:'man', actor:'sh1', actors:['sh1','sh2','sh3']},
    magi:{name:'Magi from the East', kind:'man', actor:'m1', actors:['m1','m2','m3']},
    kohanim:{name:'The chief kohanim and scribes', kind:'oldman', actor:'k1', actors:['k1','k2']},
    /* "what was spoken by (YAHUAH) HWHY through the naḇi" */
    byNabi:{name:'(YAHUAH) HWHY, through the naḇi', key:'(YAHUAH) HWHY', kind:'divine'}
  },
  scenes:[

  /* ---------------- II.1 — THE ACCOUNT OF NATSARETH ---------------- */
  { id:'natsareth', title:'Natsareth, in Galil', date:'c. 5 BCE', place:'natsareth', time:'day',
    player:{ at:[0,20], hidden:true },
    actors:[ Object.assign({id:'miryam', name:'Miryam', at:'miryam', face:0},MIRYAM),
             Object.assign({id:'yoseph', name:'Yosĕph', at:'yoseph', face:0},YOSEPH) ],
    glows:[ {id:'gabrial', at:[-4,2.4,-2.2], size:4.5, color:0xfff4d6, intensity:1.6, pulse:true, hidden:true},
            {id:'dream', at:[14,2.6,2.6], size:3.4, color:0xfff4d6, intensity:1.2, pulse:true, hidden:true} ],
    beats:[
      {t:'cam', from:[20,14,26], look:[0,1,-4], dur:0.1},
      {t:'title', text:'Act II · The Coming', sub:'Natsareth · Bĕyth Leḥem'},
      {t:'note', text:'What follows first you did not see with your own eyes. It is shown as the Besorah tells it — the account Miryam kept (Luke 2:19).'},
      {t:'cam', from:[4,5,6], look:'miryam', dur:4},
      {t:'read', ref:'LUKE 1:26'},
      {t:'read', ref:'LUKE 1:27'},
      {t:'show', id:'gabrial'},
      {t:'say', who:'gabrial', ref:'LUKE 1:28'},
      {t:'read', ref:'LUKE 1:29'},
      {t:'say', who:'gabrial', ref:'LUKE 1:30-33'},
      {t:'say', who:'miryam', ref:'LUKE 1:34', turn:false},
      {t:'say', who:'gabrial', ref:'LUKE 1:35-37'},
      {t:'say', who:'miryam', ref:'LUKE 1:38', turn:false},
      {t:'hide', id:'gabrial'},
      {t:'cam', from:[18,4,8], look:'yoseph', dur:4},
      {t:'read', ref:'MATTITHYAHU 1:18'},
      {t:'read', ref:'MATTITHYAHU 1:19'},
      {t:'show', id:'dream'},
      {t:'say', who:'dreamMalak', ref:'MATTITHYAHU 1:20-21'},
      {t:'hide', id:'dream'},
      {t:'read', ref:'MATTITHYAHU 1:22-23', voices:['byNabi','narrator']},     /* "which translated, means, “Al with us.”" is the telling's own gloss */
      {t:'fulfil', id:'y7-14'},
      {t:'read', ref:'MATTITHYAHU 1:24'},
      {t:'end'}
    ]},

  /* ---------------- II.2 — THE DECREE, AND THE ROAD ---------------- */
  { id:'road', title:'The road to Yahuḏah', date:'c. 5–4 BCE', place:'road', time:'day',
    player:{ at:[0,30], hidden:true },
    actors:[ Object.assign({id:'miryam', name:'Miryam', at:[-58,0.6], face:Math.PI/2},MIRYAM),
             Object.assign({id:'yoseph', name:'Yosĕph', at:[-56,-0.4], face:Math.PI/2},YOSEPH) ],
    beats:[
      {t:'cam', from:[-40,9,22], look:[-56,1,0], dur:0.1},
      {t:'read', ref:'LUKE 2:1'},
      {t:'read', ref:'LUKE 2:2-3'},
      {t:'move', who:['yoseph','miryam'], to:[[36,2.2],[34,3.2]], speed:1.6, wait:false},
      {t:'cam', from:[10,14,26], look:[0,1,0], dur:14, wait:false},
      {t:'read', ref:'LUKE 2:4-5'},
      {t:'note', text:'From Natsareth to Bĕyth Leḥem is about 150 km — some days on foot, down the Yarden valley or through the hills of Shomeron, and up into the hill country of Yahuḏah.'},
      {t:'end'}
    ]},

  /* ---------------- II.3 — THE FIELDS BY NIGHT ---------------- */
  { id:'fields', title:'The fields by night', date:'near Bĕyth Leḥem', place:'fields', time:'night',
    player:{ at:[8,10], face:Math.PI, look:BOY },
    actors:[
      {id:'sh1', name:'A shepherd', at:'s1', face:-2.4, robe:0x6b5a44, cloth:0xb3a58a, beard:0x6d6a66, staff:true},
      {id:'sh2', name:'A shepherd', at:'s2', face:2.2, robe:0x5c5040, cloth:0xa89a7e, beard:0x2c241f, staff:true},
      {id:'sh3', name:'A shepherd', at:'s3', face:3.3, robe:0x74604a, cloth:0xc1b394}
    ],
    things:[ {id:'lamb1', kind:'lamb', at:'lamb1'}, {id:'lamb2', kind:'lamb', at:'lamb2'}, {id:'lamb3', kind:'lamb', at:'lamb3'} ],
    glows:[ {id:'malak', at:[2,7,-8], size:9, color:0xfff6dc, intensity:2.6, pulse:true, hidden:true} ],
    host:{ at:[2,-8], y:6, h:14, r:26, n:70 },
    beats:[
      {t:'title', text:'The fields by night', sub:'near Bĕyth Leḥem, the city of Dawiḏ'},
      {t:'read', ref:'LUKE 2:8'},
      {t:'note', text:'You are a shepherd boy of Bĕyth Leḥem, out with the men and the flock. Your family keeps an old scroll of the words of Yahshayahu.'},
      {t:'witness', text:'Three lambs have strayed — find them and carry them to the fold', items:['lamb1','lamb2','lamb3'],
        verb:'Lift the lamb', hold:0.5, deliver:'foldIn', r:5, carryText:'Carry the lamb into the fold', reach:2.6},
      {t:'goal', text:'Come back to the fire and sit with the shepherds', goto:'sit', r:2.2},
      {t:'choice', prompt:'You', options:[
        {text:'Say over the old words from your family’s scroll', reply:'You say them quietly, the way your father taught you. The fire cracks. The men are silent.'},
        {text:'Watch the fire, and the stars' } ]},
      {t:'show', id:'malak'},
      {t:'cam', from:[8,2.4,12], look:[2,6,-8], dur:2.5},
      {t:'read', ref:'LUKE 2:9'},
      {t:'say', who:'malak', ref:'LUKE 2:10'},
      {t:'say', who:'malak', ref:'LUKE 2:11'},
      {t:'say', who:'malak', ref:'LUKE 2:12'},
      {t:'show', id:[], host:true},
      {t:'cam', from:[10,1.8,16], look:[2,11,-10], dur:3},
      {t:'read', ref:'LUKE 2:13'},
      {t:'say', who:'host', ref:'LUKE 2:14'},
      {t:'hide', id:'malak', host:false},
      {t:'cam', release:true},
      {t:'say', who:'shepherds', ref:'LUKE 2:15'},
      {t:'follow', who:['sh1','sh2','sh3']},
      {t:'goal', text:'Go up in haste to Bĕyth Leḥem with the shepherds', goto:'villageRoad', r:5},
      {t:'end'}
    ]},

  /* ---------------- II.4 — THE FEEDING TROUGH ---------------- */
  { id:'trough', title:'Bĕyth Leḥem', date:'the same night', place:'beythlehem', time:'night',
    player:{ at:'enter', face:Math.PI, look:BOY },
    actors:[
      Object.assign({id:'miryam', name:'Miryam', at:[5.3,-0.4], face:0.6},MIRYAM),
      Object.assign({id:'yoseph', name:'Yosĕph', at:[8.8,-0.1], face:-0.6},YOSEPH),
      {id:'sh1', name:'A shepherd', at:[-3,35], face:Math.PI, robe:0x6b5a44, cloth:0xb3a58a, beard:0x6d6a66, staff:true},
      {id:'sh2', name:'A shepherd', at:[-1,36], face:Math.PI, robe:0x5c5040, cloth:0xa89a7e, beard:0x2c241f, staff:true},
      {id:'sh3', name:'A shepherd', at:[1,35.5], face:Math.PI, robe:0x74604a, cloth:0xc1b394}
    ],
    things:[ {id:'lamp', kind:'box', at:[5.6,1.4], w:0.28, h:0.3, d:0.28, color:0xb0703a} ],
    glows:[ {id:'child', at:[7,1.0,-1], size:2.2, color:0xfff3d0, intensity:1.1, pulse:true},
            {id:'lampLight', at:[5.6,1.9,1.4], size:1.6, color:0xffc070, intensity:0.8, hidden:true},
            {id:'l1', at:[-1,2.2,1.2], size:1.4, color:0xffc070, intensity:0},
            {id:'l2', at:[12.9,2.1,6], size:1.4, color:0xffc070, intensity:0} ],
    beats:[
      {t:'follow', who:['sh1','sh2','sh3']},
      {t:'goal', text:'Find the sign you were told of: a baby wrapped up, lying in a feeding trough', goto:'troughView', r:3.2},
      {t:'move', who:['sh1','sh2','sh3'], to:['sh1','sh2','sh3'], wait:false},
      {t:'read', ref:'LUKE 2:16'},
      {t:'cam', from:[7,2.6,3.6], look:[7,0.8,-1], dur:3},
      {t:'read', ref:'LUKE 2:7'},
      {t:'fulfil', id:'y9-6'},
      {t:'cam', release:true},
      {t:'witness', text:'Hold up the lamp so the men can see', items:['lamp'], verb:'Hold up the lamp', hold:1.0},
      {t:'show', id:'lampLight'},
      {t:'read', ref:'LUKE 2:17'},
      {t:'read', ref:'LUKE 2:18'},
      {t:'cam', from:[4.2,2.2,2.6], look:'miryam', dur:2.5},
      {t:'read', ref:'LUKE 2:19'},
      {t:'cam', release:true},
      {t:'choice', prompt:'You', options:[
        {text:'Think of the words in your family’s scroll', reply:'The words your fathers copied come back to you, one by one. Tonight you have seen the child they spoke of.'},
        {text:'Stay a while, and say nothing' } ]},
      {t:'stop', who:['sh1','sh2','sh3']},
      {t:'move', who:['sh1','sh2','sh3'], to:[[-3,30],[-1,31],[1,30.5]], speed:1.4, wait:false},
      {t:'read', ref:'LUKE 2:20'},
      {t:'end'}
    ]},

  /* ---------------- II.5 — HERODES, AND THE MAGI ---------------- */
  { id:'herodes', title:'Yahrushalayim', date:'some time after', place:'yahrushalayim', time:'day',
    player:{ at:[-10,26], hidden:true },
    actors:[
      {id:'herodes', name:'Herodes', at:[15,27], face:0, robe:0x6a2440, cloth:0xd4af37, sash:0xd4af37, beard:0x2c241f},
      {id:'k1', name:'The chief kohanim and scribes', at:[20,29], face:-1.2, robe:0xe6e0cf, cloth:0x6b5a44},
      {id:'k2', at:[21,30.5], face:-1.2, robe:0xd8d0bb, cloth:0x5c5040},
      {id:'m1', name:'Magi from the East', at:[14,33], face:Math.PI, robe:0x2f4f6f, cloth:0xd4af37},
      {id:'m2', at:[16,33.5], face:Math.PI, robe:0x6f3f2f, cloth:0xe6d6a8},
      {id:'m3', at:[12,33.4], face:Math.PI, robe:0x3f6a4a, cloth:0xcfc4aa}
    ],
    things:[ {id:'dais', kind:'box', at:[15,26.2], w:4, h:0.02, d:2.4, color:0x6a2440},
             {id:'seat', kind:'box', at:[15,26.1], w:1.2, h:1.5, d:0.5, color:0x8a6a3a} ],
    beats:[
      {t:'note', text:'Again you are not there: this is the account, as the Besorah gives it.'},
      {t:'cam', from:[31,4.5,33], look:[16,1.4,30], dur:0.1},
      {t:'read', ref:'MATTITHYAHU 2:1'},
      {t:'say', who:'magi', ref:'MATTITHYAHU 2:2', turn:false},
      {t:'read', ref:'MATTITHYAHU 2:3-4'},
      {t:'say', who:'kohanim', ref:'MATTITHYAHU 2:5-6', turn:false},
      {t:'read', ref:'MATTITHYAHU 2:7'},
      {t:'say', who:'herodes', ref:'MATTITHYAHU 2:8', turn:false},
      {t:'end'}
    ]},

  /* ---------------- II.6 — THE STAR OVER THE HOUSE ---------------- */
  { id:'star', title:'Bĕyth Leḥem', date:'the same days', place:'beythlehem', time:'dusk',
    player:{ at:'well', face:0.5, look:BOY },
    actors:[
      {id:'m1', name:'Magi from the East', at:[4,19], face:0, robe:0x2f4f6f, cloth:0xd4af37},
      {id:'m2', at:[7,19.4], face:0, robe:0x6f3f2f, cloth:0xe6d6a8},
      {id:'m3', at:[10,19], face:0, robe:0x3f6a4a, cloth:0xcfc4aa}
    ],
    things:[ {id:'camel1', kind:'camel', at:[3,23], face:1.2}, {id:'camel2', kind:'camel', at:[7,24.5], face:1.4}, {id:'camel3', kind:'camel', at:[11,23], face:1.7} ],
    glows:[ {id:'window', at:[12.6,1.6,6], size:1.6, color:0xfff3d0, intensity:0.7, pulse:true} ],
    star:{ at:[16,6], y:34, size:18 },
    beats:[
      {t:'title', text:'The star', sub:'Bĕyth Leḥem'},
      {t:'read', ref:'MATTITHYAHU 2:9'},
      {t:'cam', from:[-6,4,44], look:[16,16,6], dur:3},
      {t:'read', ref:'MATTITHYAHU 2:10'},
      {t:'cam', release:true},
      {t:'witness', text:'The strangers’ camels are thirsty — draw water at the well and give each a drink', items:['camel1','camel2','camel3'], verb:'Water the camel', hold:1.0, reach:3.2},
      {t:'move', who:['m1','m2','m3'], to:[[11,5],[11,7],[11.2,3.6]], speed:1.8},
      {t:'cam', from:[8.5,2.8,9.6], look:[12.6,1.4,6], dur:3},
      {t:'read', ref:'MATTITHYAHU 2:11'},
      {t:'read', ref:'MATTITHYAHU 2:12'},
      {t:'cam', release:true},
      {t:'end'}
    ]},

  /* ---------------- II.7 — THE FLIGHT ---------------- */
  { id:'flight', title:'Bĕyth Leḥem', date:'by night', place:'beythlehem', time:'night',
    player:{ at:[2,14], hidden:true },
    actors:[ Object.assign({id:'yoseph', name:'Yosĕph', at:[11.8,6.6], face:-1.6},YOSEPH),
             Object.assign({id:'miryam', name:'Miryam', at:[11.8,5.2], face:-1.6},MIRYAM) ],
    glows:[ {id:'dream', at:[10.4,2.8,6.4], size:3.4, color:0xfff4d6, intensity:1.2, pulse:true, hidden:true},
            {id:'child', at:[11.6,1.3,5.6], size:1.4, color:0xfff3d0, intensity:0.6, pulse:true} ],
    beats:[
      {t:'cam', from:[2,4,14], look:[11.8,1.4,6], dur:0.1},
      {t:'show', id:'dream'},
      {t:'say', who:'dreamMalak', ref:'MATTITHYAHU 2:13'},
      {t:'hide', id:['dream','child']},
      {t:'move', who:['yoseph','miryam'], to:[[-2,40],[-3,41]], speed:1.8, wait:false},
      {t:'cam', from:[6,8,30], look:[0,1,26], dur:8, wait:false},
      {t:'read', ref:'MATTITHYAHU 2:14-15', who:'byNabi'},
      {t:'title', text:'The end of Act II', sub:'Next: The Forerunner — Yahuchanon the Immerser in the wilderness'},
      {t:'end'}
    ]}
  ]
});
