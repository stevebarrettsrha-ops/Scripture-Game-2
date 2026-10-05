/* ACT II — THE COMING. The first vertical slice (the design document's own
   decision: lead with the Nativity, because it fulfils 7:14 and 9:6 up front).

   THE WITNESS. You are a shepherd boy of Bĕyth Leḥem — the invented witness
   of the design document, the same one who will follow Yahusha as a grown
   man. You were in the fields that night, and you went up with the shepherds.
   What you did NOT see — the account of Natsareth, the dream of Yosĕph,
   Herodes' court — is shown as the Besorah tells it, and said to be so.

   Reverent framing (Key Decision 1): the mal'ak is light; the Child has a body, swaddled
   in the feeding trough, and His face is never shown (the engine keeps every camera from
   it). */
const MIRYAM={robe:0x3f5a8a, cloth:0xe8e2d2, skin:0x8e5c3c, kind:'woman'};
const ZAKAR={name:'Zaḵaryahu', key:'Zaḵaryahu', dress:'kohen', kind:'oldman', robe:0xf0ece0, beard:0xb8b4ac, skin:0x7c5430};
const ALISHEBA={name:'Alisheḇa', key:'Alisheḇa', kind:'woman', robe:0x6a5a4a, cloth:0xd8d0c0, skin:0x7c5430};
/* the people at prayer in the court at the hour of incense (Luke 1:10), and in the courts at Pesach */
const COURT=[0,1,2,3,4,5,6,7,8,9].map(k=>({id:'cp'+k, at:[-1+(k%5)*3.1,-38.6+Math.floor(k/5)*1.2], face:Math.PI,
  robe:[0x7c6a52,0x5f6a52,0x8e6f4c,0x6b5a44,0x74604a,0x5c5040,0x8a7a60,0x6e5a70,0x7a5040,0x5a6470][k],
  cloth:[0xcfc4aa,0xe8e2d2,0xb9ab8e,0x3c3a44,0xd8ceb4][k%5], beard:k%3===1?null:[0x2c241f,0x3a2a1e,0x6d6a66][k%3], kind:k%3===1?'woman':'man'}));
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
    byNabi:{name:'(YAHUAH) HWHY, through the naḇi', key:'(YAHUAH) HWHY', kind:'divine'},
    /* "as it has been written in the Torah of (YAHUAH) HWHY" */
    torah:{name:'The Torah of (YAHUAH) HWHY', key:'(YAHUAH) HWHY', kind:'divine'},
    neighbours:{name:'Her neighbours and relatives', key:'the neighbours', kind:'crowd', actor:'nb0', actors:['nb0','nb1','nb2','nb3','nb4','nb5']},
    /* the Child at twelve speaks in a boy's voice, not the man's */
    boyY:{name:'Yahusha', key:'the boy Yahusha', kind:'boy', actor:'boy', holy:true}
  },
  scenes:[
  /* ---------------- II.0 — ZAḴARYAHU IN THE DWELLING PLACE ---------------- */
  { id:'zakaryahu', title:'Yahrushalayim', date:'in the days of Herodes', place:'yahrushalayim', time:'day',
    player:{ at:[10.6,-37.6], face:Math.PI, look:BOY },
    actors:[ Object.assign({id:'zek', at:[10.8,-44.4], face:Math.PI},ZAKAR), ...COURT ],
    glows:[ {id:'gabrial', at:[7.6,6.4,-56.6], size:3.8, color:0xfff4d6, intensity:1.6, pulse:true, hidden:true},
            {id:'smoke', at:[6,5.9,-56.8], size:0.9, color:0xffd9a0, intensity:0.5, hidden:true} ],
    beats:[
      {t:'cam', from:[16,9,-28], look:[6,9,-50], dur:0.1},
      {t:'title', text:'Act II · The Coming', sub:'Yahrushalayim · Natsareth · Bĕyth Leḥem'},
      {t:'note', text:'What follows first you did not see with your own eyes. It is shown as the Besorah tells it — the accounts kept by those who were there (Luke 1:2).'},
      {t:'read', ref:'LUKE 1:5'},
      {t:'read', ref:'LUKE 1:6'},
      {t:'read', ref:'LUKE 1:7'},
      {t:'read', ref:'LUKE 1:8'},
      {t:'read', ref:'LUKE 1:9'},
      {t:'move', who:'zek', to:[6,-45.2], speed:1},             /* round the altar of burnt offering, and in */
      {t:'move', who:'zek', to:'incense', speed:1},
      {t:'face', who:'zek', to:'incenseAltar'},
      {t:'show', id:'smoke'},
      {t:'cam', from:[11,6.6,-34], look:[5,5.8,-40], dur:2.5},
      {t:'read', ref:'LUKE 1:10'},
      {t:'note', text:'Twice a day, morning and evening, a kohen chosen by lot went alone into the Set Apart Place and burned incense on the golden altar before the veil, while the people prayed outside. Many kohanim never had the lot fall to them in their whole lives.'},
      {t:'cam', from:[8.8,6.4,-51.2], look:[6.4,5.8,-56.6], dur:2.5},
      {t:'show', id:'gabrial'},
      {t:'read', ref:'LUKE 1:11'},
      {t:'read', ref:'LUKE 1:12'},
      {t:'say', who:'gabrial', ref:'LUKE 1:13'},
      {t:'say', who:'gabrial', ref:'LUKE 1:14'},
      {t:'say', who:'gabrial', ref:'LUKE 1:15'},
      {t:'say', who:'gabrial', ref:'LUKE 1:16'},
      {t:'say', who:'gabrial', ref:'LUKE 1:17'},
      {t:'say', who:'zek', ref:'LUKE 1:18', turn:false},
      {t:'say', who:'gabrial', ref:'LUKE 1:19'},
      {t:'say', who:'gabrial', ref:'LUKE 1:20'},
      {t:'hide', id:'gabrial'},
      {t:'cam', from:[11,6.6,-34], look:[6,5.8,-44], dur:2.5},
      {t:'read', ref:'LUKE 1:21'},
      {t:'move', who:'zek', to:[6,-45.2], speed:0.9},
      {t:'move', who:'zek', to:[10.8,-44.4], speed:0.9},
      {t:'face', who:'zek', to:'cp2'},
      {t:'read', ref:'LUKE 1:22'},
      {t:'cam', release:true},
      {t:'choice', prompt:'You', options:[
        {text:'Ask your father what happened to the old kohen', reply:'“He has seen something in there,” your father says, “and it has taken his voice.”'},
        {text:'Keep praying with the people', reply:'The smoke of the incense is still going up from the doorway. You finish the prayer.'} ]},
      {t:'read', ref:'LUKE 1:23'},
      {t:'end'}
    ]},

  /* ---------------- II.1 — THE ACCOUNT OF NATSARETH ---------------- */
  { id:'natsareth', title:'Natsareth, in Galil', date:'c. 5 BCE', place:'natsareth', time:'day',
    player:{ at:[0,20], hidden:true },
    actors:[ Object.assign({id:'miryam', name:'Miryam', at:'miryam', face:0},MIRYAM),
             Object.assign({id:'yoseph', name:'Yosĕph', at:'yoseph', face:0},YOSEPH) ],
    glows:[ {id:'gabrial', at:[-4,2.4,-2.2], size:4.5, color:0xfff4d6, intensity:1.6, pulse:true, hidden:true},
            {id:'dream', at:[14,2.6,2.6], size:3.4, color:0xfff4d6, intensity:1.2, pulse:true, hidden:true} ],
    beats:[
      {t:'cam', from:[20,14,26], look:[0,1,-4], dur:0.1},
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

  /* ---------------- II.1b — MIRYAM IN THE HILL COUNTRY ---------------- */
  { id:'visit', title:'The hill country of Yahuḏah', date:'in those days', place:'hillcountry', time:'day',
    player:{ at:[9,4], face:-Math.PI*0.6, look:BOY },
    actors:[ Object.assign({id:'alisheba', at:'zyard', face:Math.PI*0.75},ALISHEBA),
             Object.assign({id:'zek', at:[1,3.6], face:Math.PI/2},ZAKAR,{dress:'man', robe:0x6a5a44, cloth:0xe8e2d2}),
             Object.assign({id:'miryam', name:'Miryam', key:'Miryam', at:'pathUp', face:-Math.PI*0.75},MIRYAM) ],
    things:[ {id:'jarV', kind:'jar', at:'spring'} ],
    beats:[
      {t:'cam', from:[16,4,10], look:[3,1.4,1], dur:0.1},
      {t:'read', ref:'LUKE 1:24'},
      {t:'say', who:'alisheba', ref:'LUKE 1:25', turn:false},
      {t:'title', text:'In the sixth month', sub:'the hill country of Yahuḏah'},
      {t:'read', ref:'LUKE 1:39'},
      {t:'move', who:'miryam', to:[8.4,2.6], speed:1.4},
      {t:'read', ref:'LUKE 1:40'},
      {t:'face', who:'alisheba', to:'miryam'}, {t:'face', who:'miryam', to:'alisheba'},
      {t:'cam', from:[8.6,2.2,6.6], look:[6.6,1.3,1.8], dur:2},
      {t:'read', ref:'LUKE 1:41'},
      {t:'say', who:'alisheba', ref:'LUKE 1:42', turn:false},
      {t:'say', who:'alisheba', ref:'LUKE 1:43', turn:false},
      {t:'say', who:'alisheba', ref:'LUKE 1:44', turn:false},
      {t:'say', who:'alisheba', ref:'LUKE 1:45', turn:false},
      {t:'cam', from:[4.6,2.2,4.8], look:[8.4,1.4,2.6], dur:2},
      {t:'say', who:'miryam', ref:'LUKE 1:46', turn:false},
      {t:'say', who:'miryam', ref:'LUKE 1:47', turn:false},
      {t:'say', who:'miryam', ref:'LUKE 1:48', turn:false},
      {t:'say', who:'miryam', ref:'LUKE 1:49', turn:false},
      {t:'say', who:'miryam', ref:'LUKE 1:50', turn:false},
      {t:'say', who:'miryam', ref:'LUKE 1:51', turn:false},
      {t:'say', who:'miryam', ref:'LUKE 1:52', turn:false},
      {t:'say', who:'miryam', ref:'LUKE 1:53', turn:false},
      {t:'say', who:'miryam', ref:'LUKE 1:54', turn:false},
      {t:'say', who:'miryam', ref:'LUKE 1:55', turn:false},
      {t:'cam', release:true},
      {t:'witness', text:'There is a guest in the house — draw water at the spring and carry it up', items:['jarV'], verb:'Fill the jar', hold:0.8, deliver:'zdoor', r:2.6, carryText:'Carry the water up to the house'},
      {t:'read', ref:'LUKE 1:56'},
      {t:'end'}
    ]},

  /* ---------------- II.1c — HIS NAME IS YAHUCHANON ---------------- */
  { id:'naming', title:'The hill country of Yahuḏah', date:'the eighth day', place:'hillcountry', time:'day',
    player:{ at:[9,4.6], face:-Math.PI*0.6, look:BOY },
    actors:[ Object.assign({id:'alisheba', at:[5.4,0.6], face:Math.PI/2},ALISHEBA),
             Object.assign({id:'zek', at:[6.2,-2.6], face:0.3},ZAKAR,{dress:'man', robe:0x6a5a44, cloth:0xe8e2d2}),
             ...[0,1,2,3,4,5].map(k=>({id:'nb'+k, name:k===0?'A neighbour':undefined, at:[8.6+(k%3)*1.5,-1.6+Math.floor(k/3)*2.6], face:-Math.PI/2,
               robe:[0x7c6a52,0x5f6a52,0x8e6f4c,0x6b5a44,0x74604a,0x6e5a70][k], cloth:[0xcfc4aa,0xe8e2d2,0xb9ab8e][k%3], beard:k%2?null:0x3a2a1e, kind:k%2?'woman':'man'})) ],
    things:[ {id:'babyY', kind:'infant', at:[5.6,0.2], y:1.05, holy:false, face:Math.PI/2},
             {id:'tablet', kind:'box', at:[-2,-3], w:0.4, h:0.04, d:0.3, y:0.8, color:0xc9b38a} ],
    beats:[
      {t:'cam', from:[13,3.2,6], look:[6.4,1.3,-0.4], dur:0.1},
      {t:'read', ref:'LUKE 1:57'},
      {t:'read', ref:'LUKE 1:58'},
      {t:'read', ref:'LUKE 1:59'},
      {t:'say', who:'alisheba', ref:'LUKE 1:60', turn:false},
      {t:'say', who:'neighbours', ref:'LUKE 1:61', turn:false},
      {t:'face', who:'nb0', to:'zek'},
      {t:'read', ref:'LUKE 1:62'},
      {t:'witness', text:'He is asking for something to write on — fetch the writing tablet from the house', items:['tablet'], verb:'Take the tablet', hold:0.5, deliver:[6.8,-1.6], r:2.4, carryText:'Give it to Zaḵaryahu'},
      {t:'cam', from:[9.6,2,-3.6], look:[6.2,1.3,-2.6], dur:2},
      {t:'read', ref:'LUKE 1:63', voices:['narrator']},
      {t:'read', ref:'LUKE 1:64'},
      {t:'read', ref:'LUKE 1:65'},
      {t:'read', ref:'LUKE 1:66', voices:['neighbours']},
      {t:'cam', from:[3.4,2.2,1.6], look:[6.2,1.5,-2.6], dur:2},
      {t:'read', ref:'LUKE 1:67'},
      {t:'say', who:'zek', ref:'LUKE 1:68', turn:false},
      {t:'say', who:'zek', ref:'LUKE 1:69', turn:false},
      {t:'say', who:'zek', ref:'LUKE 1:70', turn:false},
      {t:'say', who:'zek', ref:'LUKE 1:71', turn:false},
      {t:'say', who:'zek', ref:'LUKE 1:72', turn:false},
      {t:'say', who:'zek', ref:'LUKE 1:73', turn:false},
      {t:'say', who:'zek', ref:'LUKE 1:74', turn:false},
      {t:'say', who:'zek', ref:'LUKE 1:75', turn:false},
      {t:'face', who:'zek', to:'babyY'},
      {t:'say', who:'zek', ref:'LUKE 1:76', turn:false},
      {t:'say', who:'zek', ref:'LUKE 1:77', turn:false},
      {t:'say', who:'zek', ref:'LUKE 1:78', turn:false},
      {t:'say', who:'zek', ref:'LUKE 1:79', turn:false},
      {t:'cam', release:true},
      {t:'read', ref:'LUKE 1:80'},
      {t:'choice', prompt:'You', options:[
        {text:'Look at the child', reply:'He is asleep. Nobody in this village has a name for what he will be, only the one his father wrote.'},
        {text:'Remember the old kohen in the court', reply:'You were there the day he came out of the Dwelling Place and could not speak. Now he has not stopped.'} ]},
      {t:'end'}
    ]},

  /* ---------------- II.2 — THE DECREE, AND THE ROAD ---------------- */
  { id:'road', title:'The road to Yahuḏah', date:'c. 5–4 BCE', place:'road', time:'day',
    player:{ at:[0,30], hidden:true },
    /* the two keep to the road across the level ground of the set (its pad is 30 m about the
       middle; beyond it the hills of Shomeron rise in their own terraces) */
    actors:[ Object.assign({id:'miryam', name:'Miryam', at:[-24,-2.2], face:Math.PI/2},MIRYAM),
             Object.assign({id:'yoseph', name:'Yosĕph', at:[-22.6,-3.2], face:Math.PI/2},YOSEPH) ],
    beats:[
      {t:'cam', from:[-15,2.4,3.4], look:[-23,1.3,-2.6], dur:0.1},
      {t:'read', ref:'LUKE 2:1'},
      {t:'read', ref:'LUKE 2:2-3'},
      {t:'move', who:['yoseph','miryam'], to:[[2,0.4],[0.4,1.3]], speed:1.4, wait:false},
      {t:'cam', from:[6.5,2.1,5.2], look:[-1,1.3,0.2], dur:12, wait:false},
      {t:'read', ref:'LUKE 2:4-5'},
      {t:'note', text:'From Natsareth to Bĕyth Leḥem is about 150 km — some days on foot, down the Yarden valley or through the hills of Shomeron, and up into the hill country of Yahuḏah.'},
      {t:'end'}
    ]},

  /* ---------------- II.3 — THE FIELDS BY NIGHT ---------------- */
  { id:'fields', title:'The fields by night', date:'near Bĕyth Leḥem', place:'fields', time:'night',
    player:{ at:[8,10], face:Math.PI, look:BOY },
    actors:[
      {id:'sh1', name:'A shepherd', dress:'shepherd', at:'s1', face:-2.4, robe:0x6b5a44, cloth:0xb3a58a, beard:0x6d6a66, staff:true},
      {id:'sh2', name:'A shepherd', dress:'shepherd', at:'s2', face:2.2, robe:0x5c5040, cloth:0xa89a7e, beard:0x2c241f, staff:true},
      {id:'sh3', name:'A shepherd', dress:'shepherd', at:'s3', face:3.3, robe:0x74604a, cloth:0xc1b394}
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
      {id:'sh1', name:'A shepherd', dress:'shepherd', at:[-3,35], face:Math.PI, robe:0x6b5a44, cloth:0xb3a58a, beard:0x6d6a66, staff:true},
      {id:'sh2', name:'A shepherd', dress:'shepherd', at:[-1,36], face:Math.PI, robe:0x5c5040, cloth:0xa89a7e, beard:0x2c241f, staff:true},
      {id:'sh3', name:'A shepherd', dress:'shepherd', at:[1,35.5], face:Math.PI, robe:0x74604a, cloth:0xc1b394}
    ],
    things:[ {id:'lamp', kind:'box', at:[5.6,1.4], w:0.28, h:0.3, d:0.28, color:0xb0703a},
             {id:'infant', kind:'infant', at:[7,-1], y:0.7} ],
    glows:[ {id:'child', at:[6.6,1.9,-0.4], size:1.3, color:0xffd9a0, intensity:0.9},
            {id:'lampLight', at:[5.6,1.9,1.4], size:1.6, color:0xffc070, intensity:0.8, hidden:true},
            {id:'l1', at:[-1,2.2,1.2], size:1.4, color:0xffc070, intensity:0},
            {id:'l2', at:[12.9,2.1,6], size:1.4, color:0xffc070, intensity:0} ],
    beats:[
      {t:'follow', who:['sh1','sh2','sh3']},
      {t:'goal', text:'Find the sign you were told of: a baby wrapped up, lying in a feeding trough', goto:'troughView', r:3.2},
      {t:'move', who:['sh1','sh2','sh3'], to:['sh1','sh2','sh3'], wait:false},
      {t:'read', ref:'LUKE 2:16'},
      {t:'cam', from:[7.6,2.3,4.6], look:[6.8,0.8,-0.8], dur:3},
      {t:'read', ref:'LUKE 2:7'},
      {t:'fulfil', id:'y9-6'},
      {t:'cam', release:true},
      {t:'witness', text:'Hold up the lamp so the men can see', items:['lamp'], verb:'Hold up the lamp', hold:1.0},
      {t:'show', id:'lampLight'},
      {t:'read', ref:'LUKE 2:17'},
      {t:'read', ref:'LUKE 2:18'},
      {t:'cam', from:[3.4,2.1,3.8], look:'miryam', dur:2.5},
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

  /* ---------------- II.4b — SHIM‛ON AND ḤANNAH ---------------- */
  { id:'presentation', title:'Yahrushalayim', date:'the fortieth day', place:'yahrushalayim', time:'day',
    player:{ at:[9.6,-37.4], face:Math.PI*1.2, look:BOY },
    crowds:[ {id:'worshippers', n:180, area:[-16,-58,26,-28], jitter:6.3, keep:[[1,-39.4,17,-35.6],[10,-49,14,-45]]} ],
    actors:[ Object.assign({id:'miryam', name:'Miryam', key:'Miryam', at:[4.2,-37.6], face:Math.PI},MIRYAM),
             Object.assign({id:'yoseph', name:'Yosĕph', key:'Yosĕph', at:[2.8,-37.2], face:Math.PI},YOSEPH),
             {id:'shimon', name:'Shim‛on', key:'the righteous Shim‛on', at:[12,-47], face:-Math.PI*0.8, kind:'oldman', robe:0x6a5a4a, cloth:0xe8e2d2, beard:0xc8c4bc, skin:0x7c5430},
             {id:'hannah', name:'Ḥannah', key:'Ḥannah', kind:'woman', at:[15.6,-40.4], face:-Math.PI/2, robe:0x4a3a4a, cloth:0x3c3a44, skin:0x6e4524},
             {id:'seller', name:'A seller of doves', at:[-2.6,-37.2], face:Math.PI/2, robe:0x74604a, cloth:0xb9ab8e, beard:0x2c241f},
             ...COURT.slice(0,6).map((c,k)=>Object.assign({},c,{at:[[-2,-38.6],[-0.4,-40.4],[11,-40.6],[12.6,-39],[14.2,-40.8],[-2.4,-41.2]][k]})) ],
    things:[ {id:'child', kind:'infant', at:[4.5,-37.3], y:5.72, face:Math.PI/2},
             {id:'doves', kind:'box', at:[-1.8,-37.2], w:0.5, h:0.32, d:0.36, color:0xb08a5a} ],
    beats:[
      {t:'cam', from:[12,7,-30], look:[5,5.6,-40], dur:0.1},
      {t:'read', ref:'LUKE 2:22'},
      {t:'read', ref:'LUKE 2:23', voices:['torah']},
      {t:'read', ref:'LUKE 2:24', voices:['torah']},
      {t:'note', text:'A pair of turtledoves or two young pigeons was the offering the Torah allowed to those who could not afford a lamb (Wayyiqra 12:8).'},
      {t:'witness', text:'Buy a pair of doves from the seller and bring them to Yosĕph', items:['doves'], verb:'Take the doves', hold:0.6, deliver:[3.4,-36.8], r:2.4, carryText:'Bring the doves to Yosĕph'},
      {t:'read', ref:'LUKE 2:25'},
      {t:'read', ref:'LUKE 2:26'},
      {t:'move', who:'shimon', to:[5.6,-38.9], speed:1},
      {t:'face', who:'shimon', to:'miryam'},
      {t:'read', ref:'LUKE 2:27'},
      {t:'drift', id:'child', to:[5.5,5.72,-38.4], dur:2},
      {t:'cam', from:[8.6,6.4,-35.6], look:[5.4,5.6,-38.6], dur:2},
      {t:'read', ref:'LUKE 2:28'},
      {t:'say', who:'shimon', ref:'LUKE 2:29', turn:false},
      {t:'say', who:'shimon', ref:'LUKE 2:30', turn:false},
      {t:'say', who:'shimon', ref:'LUKE 2:31', turn:false},
      {t:'say', who:'shimon', ref:'LUKE 2:32', turn:false},
      {t:'read', ref:'LUKE 2:33'},
      {t:'drift', id:'child', to:[4.5,5.72,-37.3], dur:2},
      {t:'say', who:'shimon', ref:'LUKE 2:34', turn:false},
      {t:'say', who:'shimon', ref:'LUKE 2:35', turn:false},
      {t:'move', who:'hannah', to:[7,-37.8], speed:0.8, wait:false},
      {t:'read', ref:'LUKE 2:36'},
      {t:'read', ref:'LUKE 2:37'},
      {t:'face', who:'hannah', to:'child'},
      {t:'read', ref:'LUKE 2:38'},
      {t:'cam', release:true},
      {t:'choice', prompt:'You', options:[
        {text:'Think of the night in the fields', reply:'Forty days ago you saw this Child in a feeding trough. Now an old man in the courts of the House has called Him the deliverance of Aluahim.'},
        {text:'Watch Ḥannah', reply:'She goes from one group to the next across the court, telling everyone who will stop.'} ]},
      {t:'end'}
    ]},

  /* ---------------- II.5 — HERODES, AND THE MAGI ---------------- */
  { id:'herodes', title:'Yahrushalayim', date:'some time after', place:'yahrushalayim', time:'day',
    player:{ at:[-10,26], hidden:true },
    actors:[
      {id:'herodes', name:'Herodes', dress:'king', at:[15,26.7], face:0, robe:0x6a2440, cloth:0xd4af37, sash:0xd4af37, beard:0x2c241f, sit:true, bench:true},
      {id:'k1', name:'The chief kohanim and scribes', dress:'kohen', at:[20,29], face:-1.2, robe:0xe6e0cf, cloth:0x6b5a44},
      {id:'k2', dress:'scribe', at:[21,30.5], face:-1.2, robe:0xd8d0bb, cloth:0x5c5040},
      {id:'m1', name:'Magi from the East', dress:'magi', at:[14,33], face:Math.PI, robe:0x2f4f6f, cloth:0xd4af37},
      {id:'m2', dress:'magi', at:[16,33.5], face:Math.PI, robe:0x6f3f2f, cloth:0xe6d6a8},
      {id:'m3', dress:'magi', at:[12,33.4], face:Math.PI, robe:0x3f6a4a, cloth:0xcfc4aa}
    ],
    things:[ {id:'dais', kind:'box', at:[15,26.2], w:4, h:0.02, d:2.4, color:0x6a2440},
             {id:'seat', kind:'throne', style:'king', at:[15,26.7], face:0} ],
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
      {id:'m1', name:'Magi from the East', dress:'magi', at:[4,19], face:0, robe:0x2f4f6f, cloth:0xd4af37},
      {id:'m2', dress:'magi', at:[7,19.4], face:0, robe:0x6f3f2f, cloth:0xe6d6a8},
      {id:'m3', dress:'magi', at:[10,19], face:0, robe:0x3f6a4a, cloth:0xcfc4aa}
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
      {t:'cam', from:[6,2.4,9], look:[11.4,1.4,6], dur:0.1},
      {t:'show', id:'dream'},
      {t:'say', who:'dreamMalak', ref:'MATTITHYAHU 2:13'},
      {t:'hide', id:['dream','child']},
      {t:'move', who:['yoseph','miryam'], to:[[-2,40],[-3,41]], speed:1.8, wait:false},
      {t:'cam', from:[-9,3,30], look:[-2.4,1.3,38], dur:8, wait:false},
      {t:'read', ref:'MATTITHYAHU 2:14-15', who:'byNabi'},
      {t:'end'}
    ]},

  /* ---------------- II.7 — THE BOY IN THE HOUSE OF HIS FATHER ---------------- */
  { id:'boy', title:'Yahrushalayim', date:'twelve years later, at the Pesach', place:'yahrushalayim', time:'day',
    player:{ at:[18,-52], face:Math.PI/2, look:{robe:0x8a7454, cloth:0xd8cfb8, beard:0x3a2a1e, skin:0x86573a} },
    crowds:[ {id:'pilgrims', n:240, area:[-4,-74,44,-38], jitter:6.3, keep:[[29,-64,38,-54]]} ],
    actors:[ Object.assign({id:'miryam', name:'Miryam', key:'Miryam', at:[10,-50.6], face:Math.PI/2},MIRYAM),
             Object.assign({id:'yoseph', name:'Yosĕph', key:'Yosĕph', at:[9.6,-49.2], face:Math.PI/2},YOSEPH,{beard:0x5a5048}),
             {id:'boy', name:'Yahusha', holy:true, kind:'yahusha', small:true, at:[31.6,-60], face:Math.PI/2, sit:true},
             ...[0,1,2,3,4].map(k=>({id:'tc'+k, name:k===0?'A teacher':undefined, dress:k%2?'scribe':'kohen', kind:'oldman',
               at:[[34.2,-57.6],[34.4,-62.4],[35.8,-59],[35.8,-61.2],[33,-56.6]][k], face:-Math.PI/2, sit:true,
               robe:[0xf0ece0,0xd8d0bb,0xe6e0cf,0xcfc4aa,0xf2eee2][k], beard:[0xb8b4ac,0x6d6a66,0xc8c4bc,0x2c241f,0x9a948a][k]}))
           ],
    beats:[
      {t:'cam', from:[14,9,-36], look:[24,5,-58], dur:0.1},
      {t:'read', ref:'LUKE 2:39'},
      {t:'read', ref:'LUKE 2:40'},
      {t:'title', text:'Twelve years later', sub:'the Festival of the Pesach'},
      {t:'read', ref:'LUKE 2:41'},
      {t:'read', ref:'LUKE 2:42'},
      {t:'read', ref:'LUKE 2:43'},
      {t:'read', ref:'LUKE 2:44'},
      {t:'read', ref:'LUKE 2:45'},
      {t:'cam', release:true},
      {t:'goal', text:'Help them look for Him through the courts — try the porch on the east side', goto:[28.4,-58.6], r:3.4},
      {t:'move', who:['miryam','yoseph'], to:[[28.6,-59.6],[28.4,-61]], speed:1.6},
      {t:'face', who:'boy', to:'tc2'},
      {t:'cam', from:[29.6,5.6,-64.8], look:[34,4.2,-59.6], dur:2},
      {t:'read', ref:'LUKE 2:46'},
      {t:'read', ref:'LUKE 2:47'},
      {t:'face', who:'miryam', to:'boy'},
      {t:'cam', from:[28.2,5.4,-56.4], look:[29.4,4.6,-60.2], dur:2},
      {t:'say', who:'miryam', ref:'LUKE 2:48', turn:false},
      {t:'stand', who:'boy'}, {t:'face', who:'boy', to:'miryam'},
      {t:'cam', on:'boy', shot:'back', toward:'miryam', dur:1.8},
      {t:'say', who:'boyY', ref:'LUKE 2:49', turn:false},
      {t:'read', ref:'LUKE 2:50'},
      {t:'cam', release:true},
      {t:'move', who:['miryam','boy','yoseph'], to:[[14,-50.4],[14.6,-51.6],[13.4,-49.4]], speed:1.2, wait:false},
      {t:'read', ref:'LUKE 2:51'},
      {t:'read', ref:'LUKE 2:52'},
      {t:'choice', prompt:'You', options:[
        {text:'Look back at the teachers', reply:'They are still sitting where He left them, not talking yet.'},
        {text:'Think of the trough in Bĕyth Leḥem', reply:'Twelve years. You were a boy in the fields. Now He is the boy, and you are the one watching.'} ]},
      {t:'title', text:'The end of Act II', sub:'Next: The Forerunner — Yahuchanon the Immerser in the wilderness'},
      {t:'end'}
    ]}
  ]
});
