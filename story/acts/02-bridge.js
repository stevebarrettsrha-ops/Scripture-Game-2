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
    danial:{name:'Dani’al', kind:'man'}               /* to the sovereign of Baḇal, telling his dream (2:36) */
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
  { id:'tiber', title:'Meanwhile, far to the west', date:'c. 753 BCE', place:'tiber', time:'dawn',
    player:{ at:[0,40], hidden:true },
    beats:[
      {t:'cam', from:[30,14,34], look:[0,1,0], dur:0.1},
      {t:'cam', from:[-26,10,30], look:[0,1,0], dur:18, wait:false},
      {t:'title', text:'The Seven Hundred Years', sub:'Ashshur · Baḇal · Persia · Greece · Rome'},
      {t:'note', text:'While Yahshayahu spoke in Yahrushalayim, far to the west a village of huts stood on a hill above the river Tiber. By its own reckoning it was founded in 753 BCE. Its name was Rome. In seven hundred years it will rule the world — and Yahuḏah with it.'},
      {t:'end'}
    ]},
  { id:'nineveh', title:'Ninewĕh', date:'612 BCE', place:'nineveh', time:'night',
    player:{ at:[0,60], hidden:true },
    beats:[
      {t:'cam', from:[34,16,46], look:[0,6,0], dur:0.1},
      {t:'cam', from:[-30,20,44], look:[0,6,-6], dur:16, wait:false},
      {t:'era', i:0, head:'612 BCE — Ashshur falls', text:'The empire that menaced the days of Yahshayahu is itself destroyed: Ninewĕh burns.'},
      {t:'end'}
    ]},
  { id:'fall', title:'Yahrushalayim', date:'586 BCE', place:'yahrushalayim', time:'night',
    player:{ at:[-10,26], hidden:true },
    glows:[0,1,2,3,4,5,6,7,8,9].map(k=>({id:'f'+k, at:[-30+k*7, 3+(k%3)*4, -50+(k%4)*16], size:7, color:0xff7a2a, intensity:k%3===0?1.2:0, pulse:true})),
    beats:[
      {t:'cam', from:[70,30,70], look:[0,6,-24], dur:0.1},
      {t:'cam', from:[-60,26,60], look:[0,6,-30], dur:16, wait:false},
      {t:'era', i:1, head:'586 BCE — the Hĕḵal destroyed', text:'Baḇal (Baḇylon) takes Yahrushalayim, burns the Hĕḵal, and carries Yahuḏah into exile.'},
      {t:'end'}
    ]},
  { id:'babel', title:'Baḇal', date:'539 BCE', place:'babel', time:'dawn',
    player:{ at:[0,60], hidden:true },
    beats:[
      {t:'cam', from:[26,8,56], look:[0,10,-10], dur:0.1},
      {t:'cam', from:[-24,14,52], look:[0,14,-26], dur:16, wait:false},
      {t:'era', i:2, head:'539 BCE — Koresh of Persia', text:'Koresh sovereign of Persia takes Baḇal and lets the exiles go home to build again.'},
      {t:'read', ref:'EZRA 1:1'},
      {t:'end'}
    ]},
  { id:'greece', title:'Macedon', date:'331 BCE', place:'pella', time:'day',
    player:{ at:[0,40], hidden:true },
    glows:[ {id:'gabrial', at:[0,14,26], size:5, color:0xfff4d6, intensity:0, pulse:true} ],
    beats:[
      {t:'cam', from:[24,8,34], look:[0,5,0], dur:0.1},
      {t:'cam', from:[-26,9,30], look:[0,5,0], dur:16, wait:false},
      {t:'era', i:3, head:'331 BCE — Greece', text:'Alexander of Macedon overthrows Persia; after him come the Greek kingdoms, and the struggle of the Maqqabim.'},
      {t:'read', ref:"DANI'AL 8:21", who:'gabrial'},
      {t:'end'}
    ]},
  { id:'rome', title:'Yahrushalayim', date:'63 BCE', place:'yahrushalayim', time:'dusk',
    player:{ at:[-10,26], hidden:true },
    actors:[0,1,2,3,4,5,6,7,8,9,10,11].map(k=>({id:'l'+k, folk:'roman', dress:k===0?'centurion':'legionary', name:k===0?'A captain':undefined,
      at:[-70+(k%3)*1.4, 96+Math.floor(k/3)*1.6], face:Math.PI*1.25, robe:0x8a2a22})),
    beats:[
      {t:'cam', from:[-36,4,62], look:[-62,1.5,88], dur:0.1},
      {t:'move', who:['l0','l1','l2','l3','l4','l5','l6','l7','l8','l9','l10','l11'],
        to:[0,1,2,3,4,5,6,7,8,9,10,11].map(k=>[-26+(k%3)*1.4, 52+Math.floor(k/3)*1.6]), speed:1.3, wait:false},
      {t:'cam', from:[-20,6,40], look:[-40,1.6,64], dur:14, wait:false},
      {t:'era', i:4, head:'63 BCE — Rome', text:'Rome takes Yahrushalayim. The village of huts on the Tiber is now the empire that will rule Yahuḏah when the child of the promise is born, and its soldiers stand on her roads.'},
      {t:'read', ref:"DANI'AL 2:44", who:'danial'},
      {t:'time', to:'night'},
      {t:'read', ref:'GALATIANS 4:4'},
      {t:'title', text:'Around 4 BCE', sub:'into this Roman world, the child of the promise is born'},
      {t:'end'}
    ]}
  ]
});
