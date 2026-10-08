/* THE SEVEN HUNDRED YEARS — the bridge between the promise and its keeping.

   A short passage over the city while the empires rise and fall, drawn to
   scale so the long Persian and Greek centuries read as the real wait they
   were. The dates are HISTORY and shown as history (the design document's
   own figures); the scripture is the Besorah's — the sovereign of Greece in
   Dani'al 8, the reign that is never destroyed in Dani'al 2, and the word
   the whole game is named for, Galatians 4:4. */
STORY.act({
  id:'bridge', n:2, num:'—', title:'The Seven Hundred Years',
  sub:'Ashshur · Baḇal (Baḇylon) · Persia · Greece · Rome',
  cast:{
    gabrial:{name:'Gaḇri’al', kind:'angel'},          /* "Gaḇri’al, make this man understand the vision" (8:16) */
    danial:{name:'Dani’al', kind:'man'},              /* to the sovereign of Baḇal, telling his dream (2:36) */
    returned:{name:'The people', key:'people', kind:'crowd', actor:'rp0', actors:['rp0','rp1','rp2','rp3','rp4','rp5','rp6','rp7']}
  },
  eras:[
    {name:'Ashshur', from:-740, to:-612, color:'#6d7fa6'},
    {name:'Baḇal',   from:-612, to:-539, color:'#b8744f'},
    {name:'Persia',  from:-539, to:-331, color:'#5f9a7e'},
    {name:'Greece',  from:-331, to:-63,  color:'#6a7a96'},
    {name:'Rome',    from:-63,  to:30,   color:'#a8566e'}
  ],
  /* ONE SCENE AN AGE, AT ITS OWN SEAT: the design document's montage ("a spinning globe,
     empires blooming and dying, the Temple falling and rising again, until Roman soldiers stand
     on the roads of Judea") is flown across the voyage's own earth — Rome a village of huts,
     Ninewĕh burning, the Hĕḵal burning, Baḇal taken, Macedon, and the legions at Yahrushalayim */
  scenes:[
  { id:'tiber', title:'Meanwhile, far to the west', date:'c. 753 BCE', place:'tiber', time:'day',
    player:{ at:[0,40], hidden:true },
    beats:[
      {t:'cam', from:[17,6,21], look:[-2,1.6,-3], dur:0.1},
      {t:'cam', from:[-15,5.5,19], look:[-2,1.6,-3], dur:18, wait:false},
      {t:'title', text:'The Seven Hundred Years', sub:'Ashshur · Baḇal · Persia · Greece · Rome'},
      {t:'note', text:'While Yahshayahu spoke in Yahrushalayim, far to the west a village of huts stood on a hill above the river Tiber. By its own reckoning it was founded in 753 BCE. Its name was Rome. In seven hundred years it will rule the world — and Yahuḏah with it.'},
      {t:'end'}
    ]},
  { id:'nineveh', title:'Ninewĕh', date:'612 BCE', place:'nineveh', time:'dusk',
    player:{ at:[0,60], hidden:true },
    beats:[
      {t:'cam', from:[34,16,46], look:[0,6,0], dur:0.1},
      {t:'cam', from:[-30,20,44], look:[0,6,-6], dur:16, wait:false},
      {t:'era', i:0, head:'612 BCE — Ashshur falls', text:'The empire that menaced the days of Yahshayahu is itself destroyed: Ninewĕh burns.'},
      {t:'end'}
    ]},
  { id:'fall', title:'Yahrushalayim', date:'586 BCE', place:'yahrushalayim', time:'dusk',
    player:{ at:[-10,26], hidden:true },
    glows:[0,1,2,3,4,5,6,7,8,9].map(k=>({id:'f'+k, at:[-30+k*7, 3+(k%3)*4, -50+(k%4)*16], size:7, color:0xff7a2a, intensity:k%3===0?1.2:0, pulse:true})),
    beats:[
      {t:'cam', from:[70,30,70], look:[0,6,-24], dur:0.1},
      {t:'cam', from:[-60,26,60], look:[0,6,-30], dur:16, wait:false},
      {t:'era', i:1, head:'586 BCE — the Hĕḵal destroyed', text:'Baḇal (Baḇylon) takes Yahrushalayim, burns the Hĕḵal, and carries Yahuḏah into exile.'},
      {t:'end'}
    ]},
  { id:'babel', title:'Baḇal', date:'539 BCE', place:'babel', time:'day',
    player:{ at:[0,60], hidden:true },
    beats:[
      {t:'cam', from:[26,8,56], look:[0,10,-10], dur:0.1},
      {t:'cam', from:[-24,14,52], look:[0,14,-26], dur:16, wait:false},
      {t:'era', i:2, head:'539 BCE — Koresh of Persia', text:'Koresh sovereign of Persia takes Baḇal and lets the exiles go home to build again.'},
      {t:'read', ref:'EZRA 1:1'},
      {t:'end'}
    ]},
  { id:'return', title:'Yahrushalayim', date:'c. 536 BCE', place:'yahrushalayim', period:'return', time:'dawn',
    player:{ at:[-10,26], hidden:true },
    /* the kohanim in their robes with trumpets, the Lĕwites with cymbals, the old men who had
       seen the first House, and the people (Ezra 3:10-12) */
    actors:[
      ...[0,1,2,3].map(k=>({id:'kh'+k, dress:'kohen', at:[1+k*3.2,-33.6], face:Math.PI, beard:[0x6d6a66,0x2c241f,0x3a2a1e,0x9a948a][k]})),
      ...[0,1,2].map(k=>({id:'lw'+k, dress:'levite', at:[17+k*1.6,-36+k*1.2], face:-Math.PI*0.6, beard:0x3a2a1e})),
      ...[0,1,2].map(k=>({id:'old'+k, kind:'oldman', at:[-6.4+k*1.4,-38.4-k*0.8], face:Math.PI*0.75, robe:[0x5c5040,0x6b5a44,0x4a4036][k], cloth:0xe8e2d2, beard:0xc8c4bc})),
      ...[0,1,2,3,4,5,6,7].map(k=>({id:'rp'+k, at:[-4+k*2.2,-28.6+(k%2)*1.6], face:Math.PI,
        robe:[0x7c6a52,0x5f6a52,0x8e6f4c,0x6b5a44,0x74604a,0x5c5040,0x8a7a60,0x6e5a70][k], cloth:[0xcfc4aa,0xe8e2d2,0xb9ab8e,0x3c3a44][k%4], beard:k%3===1?null:0x2c241f, kind:k%3===1?'woman':'man'}))
    ],
    beats:[
      {t:'cam', from:[-30,18,6], look:[6,2,-48], dur:0.1},
      {t:'cam', from:[24,7,-24], look:[6,1.6,-46], dur:14, wait:false},
      {t:'era', i:2, head:'536 BCE — the foundation laid', text:'The exiles come home to a city broken down and burnt. They build the altar again on its place, and in the second year they lay the foundation of the House.'},
      {t:'read', ref:'EZRA 3:10'},
      {t:'read', ref:'EZRA 3:11', voices:['returned']},
      {t:'cam', from:[-1,3,-34], look:[-5.4,1.8,-38.8], dur:2.5},
      {t:'read', ref:'EZRA 3:12'},
      {t:'read', ref:'EZRA 3:13'},
      {t:'end'}
    ]},
  { id:'greece', title:'Macedon', date:'331 BCE', place:'pella', time:'day',
    player:{ at:[0,40], hidden:true },
    glows:[ {id:'gabrial', malak:true, at:[0,14,26], size:5, color:0xfff4d6, intensity:0, pulse:true} ],
    beats:[
      {t:'cam', from:[24,8,34], look:[0,5,0], dur:0.1},
      {t:'cam', from:[-26,9,30], look:[0,5,0], dur:16, wait:false},
      {t:'era', i:3, head:'331 BCE — Greece', text:'Alexander of Macedon overthrows Persia; after him come the Greek kingdoms, and the struggle of the Maqqabim.'},
      {t:'read', ref:"DANI'AL 8:21", who:'gabrial'},
      {t:'end'}
    ]},
  { id:'rome', title:'Yahrushalayim', date:'63 BCE', place:'yahrushalayim', time:'day',
    player:{ at:[-10,26], hidden:true },
    actors:[0,1,2,3,4,5,6,7,8,9,10,11].map(k=>({id:'l'+k, folk:'roman', dress:k===0?'centurion':'legionary', name:k===0?'A captain':undefined,
      at:[-50+(k%3)*1.4, 68+Math.floor(k/3)*1.6], face:Math.PI*0.75, robe:0x8a2a22})),
    beats:[
      {t:'cam', from:[-38,4,58], look:[-48.6,1.5,70.4], dur:0.1},
      {t:'move', who:['l0','l1','l2','l3','l4','l5','l6','l7','l8','l9','l10','l11'],
        to:[0,1,2,3,4,5,6,7,8,9,10,11].map(k=>[-26+(k%3)*1.4, 52+Math.floor(k/3)*1.6]), speed:1.3, wait:false},
      {t:'cam', from:[-36,7,66], look:[-15,6.5,46], dur:14, wait:false},   /* the march on the city, below the panel */
      {t:'era', i:4, head:'63 BCE — Rome', text:'Rome takes Yahrushalayim. The village of huts on the Tiber is now the empire that will rule Yahuḏah when the child of the promise is born, and its soldiers stand on her roads.'},
      {t:'read', ref:"DANI'AL 2:44", who:'danial'},
      {t:'time', to:'dusk'},
      {t:'read', ref:'GALATIANS 4:4'},
      {t:'title', text:'Around 4 BCE', sub:'into this Roman world, the child of the promise is born'},
      {t:'end'}
    ]}
  ]
});
