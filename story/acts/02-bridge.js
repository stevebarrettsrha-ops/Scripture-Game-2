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
  scenes:[
  { id:'years', title:'Seven hundred years', date:'740 BCE – c. 4 BCE', place:'yahrushalayim', time:'dusk',
    player:{ at:[-10,26], hidden:true },
    beats:[
      {t:'cam', from:[80,60,90], look:[0,4,-20], dur:0.1},
      {t:'cam', from:[-90,55,70], look:[0,4,-20], dur:40, wait:false},
      {t:'era', i:0, head:'612 BCE — Ashshur falls', text:'The empire that menaced the days of Yahshayahu is itself destroyed: Ninewĕh burns.'},
      {t:'time', to:'night'},
      {t:'era', i:1, head:'586 BCE — the Hĕḵal destroyed', text:'Baḇal (Baḇylon) takes Yahrushalayim, burns the Hĕḵal, and carries Yahuḏah into exile.'},
      {t:'time', to:'dawn'},
      {t:'era', i:2, head:'539 BCE — Koresh of Persia', text:'Koresh sovereign of Persia takes Baḇal and lets the exiles go home to build again.'},
      {t:'read', ref:'EZRA 1:1'},
      {t:'time', to:'day'},
      {t:'era', i:3, head:'331 BCE — Greece', text:'Alexander of Macedon overthrows Persia; after him come the Greek kingdoms, and the struggle of the Maqqabim.'},
      {t:'read', ref:"DANI'AL 8:21", who:'gabrial'},
      {t:'time', to:'dusk'},
      {t:'era', i:4, head:'63 BCE — Rome', text:'Rome takes Yahrushalayim. The empire that will rule Yahuḏah when the child of the promise is born now stands on its roads.'},
      {t:'read', ref:"DANI'AL 2:44", who:'danial'},
      {t:'time', to:'night'},
      {t:'read', ref:'GALATIANS 4:4'},
      {t:'title', text:'Around 4 BCE', sub:'into this Roman world, the child of the promise is born'},
      {t:'end'}
    ]}
  ]
});
