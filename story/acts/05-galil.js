/* ACT IV — GALIL. The first signs, the word read in Natsareth, the fishers called, the
   unclean ruach rebuked, the teaching on the mountain, the captain's belief, the blind who
   see, the five loaves, and the walking on the sea. The Codex lights Yashayahu 61:1-2 (read
   aloud by Him in the qahal of Natsareth) and 35:5-6 (the blind see, the lame walk).

   THE WITNESS. The man of Bĕyth Leḥem who followed from the Yardĕn walks in among the
   taught ones (the design document: "the player walks in among them"). He fills the jars at
   Qanah, hauls the net in the partners' boat, leads the blind to the house, gives out the
   bread and gathers the broken pieces, and is in the boat in the fourth watch. He never
   speaks in a named mouth, and nothing he does changes what the Besorah says happened.

   THE ORDER, harmonized: Qanah first ("the beginning of the signs", Yahuchanon 2:11); the
   reading in Natsareth as Luke sets it at the start (4:16-30); the calling by the lake (Luke
   5:1-11), then the qahal of Kephar Naḥum as Mark follows it (1:21-28); the teaching on the
   mountain (Mattithyahu 5); the captain (8:5-13); the blind and the messengers of Yahuchanon
   (9:27-31, 11:2-6); the loaves and the sea (Yahuchanon 6:1-14, Mattithyahu 14:22-33).
   El‛azar is raised at Bĕyth Anyah near Yahrushalayim (Yahuchanon 11), and is told on the
   road there, in Act V.

   THE PEOPLE are of Yasharal and Galil — brown, as the Besorah's people were, and as
   Scripture-Game draws them; the captain is a Roman, and drawn as one. An unclean ruach is
   shown as Scripture-Game shows the fallen: a dim violet shadow upon the man, which leaves
   him when it is rebuked. Yahusha has a body like every man of Yasharal, and His face is
   never shown: when He speaks the camera frames His body, arms and hands, or looks over His
   shoulder from behind (`cam` with on:'yahusha'), and the engine keeps every other camera,
   the player's included, from His face. */
(function(){
const ADULT={robe:0x8a7454, cloth:0xd8cfb8, beard:0x3a2a1e, skin:0x86573a};
const YAHUSHA={name:'Yahusha', holy:true, kind:'yahusha', key:'Yahusha'};
const MIRYAM={name:'Miryam', robe:0x3f5a8a, cloth:0xe8e2d2, skin:0x8e5c3c, kind:'woman', key:'Miryam'};
/* the taught ones, each one person in every scene: the same name, the same voice */
const T12={
  kepha:{name:'Shim‛on Kĕpha', key:'Shim‛on Kĕpha', robe:0x6e5238, cloth:0xb9ab8e, beard:0x3a2a1e, skin:0x6e4524},
  andri:{name:'Andri', key:'Andri', robe:0x5a6a7a, cloth:0xd8ceb4, beard:0x3a2a1e, skin:0x704a27},
  yaaqob:{name:'Ya‛aqoḇ', key:'Ya‛aqoḇ son of Zaḇdai', robe:0x7a3a2a, cloth:0xcfc4aa, beard:0x2c241f, skin:0x7a4e29},
  yahuchanon:{name:'Yahuchanon', key:'Yahuchanon son of Zaḇdai', robe:0x4a5a3a, cloth:0xe6e0cf, skin:0x855a33},
  philip:{name:'Philip', key:'Philip', robe:0x6a5a7a, cloth:0xd8ceb4, beard:0x2c241f, skin:0x7c5430},
  nethanel:{name:'Nethanĕ’l', key:'Nethanĕ’l', robe:0x8a6a3a, cloth:0xcfc4aa, beard:0x3a2a1e, skin:0x643f1c},
  /* and those named with them on the mountain (Luke 6:14-16) */
  bartholomi:{name:'Bartholomi', key:'Bartholomi', robe:0x6a5a44, cloth:0xd8ceb4, beard:0x2c241f, skin:0x7a4e29},
  mattithyahu:{name:'Mattithyahu', key:'Mattithyahu', robe:0x4a5a6a, cloth:0xe6e0cf, beard:0x2c241f, skin:0x855a33},
  toma:{name:'T’oma', key:'T’oma', robe:0x7a6a4a, cloth:0xcfc4aa, beard:0x3a2a1e, skin:0x6e4524},
  yaaqobA:{name:'Ya‛aqoḇ the son of Alphai', key:'Ya‛aqoḇ the son of Alphai', robe:0x5a4a3a, cloth:0xd8ceb4, beard:0x1e1814, skin:0x704a27},
  shimonZ:{name:'Shim‛on the Ardent One', key:'Shim‛on the Ardent One', robe:0x7a3a2a, cloth:0xb9ab8e, beard:0x2c241f, skin:0x5c3a1f},
  yahudahY:{name:'Yahuḏah the son of Ya‛aqoḇ', key:'Yahuḏah the son of Ya‛aqoḇ', robe:0x5f6a52, cloth:0xe6e0cf, beard:0x3a2a1e, skin:0x7c5430},
  yahudahQ:{name:'Yahuḏah from Qerioth', key:'Yahuḏah from Qerioth', robe:0x6e5a70, cloth:0xcfc4aa, beard:0x1e1814, skin:0x8a6038}
};
const T=(id,at,extra)=>Object.assign({id,at},T12[id],extra||{});
/* people of a place: unnamed, each a face of its own (their skin is their people's — world.js) */
let seed=11; const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const ROBES=[0x7c6a52,0x5f6a52,0x8e6f4c,0x6b5a44,0x74604a,0x5c5040,0x8a7a60,0x6e5a70,0x7a5040,0x5a6470,0x8a5a3a,0x4f6a4f];
const CLOTHS=[0xcfc4aa,0xd8ceb4,0xb9ab8e,0xe6e0cf,0xc1b394,0xa89a7e];
function folk(pre,n,area,face,o){
  const out=[];
  for(let k=0;k<n;k++){ const woman=k%3===1;
    out.push(Object.assign({id:pre+k, at:[area[0]+rnd()*(area[2]-area[0]), area[1]+rnd()*(area[3]-area[1])],
      face:face+(rnd()-0.5)*0.9, robe:ROBES[(k*7+pre.length)%ROBES.length], cloth:woman?[0xe8e2d2,0x3c3a44,0x8a6a5a][k%3]:CLOTHS[(k*5)%CLOTHS.length],
      beard:!woman&&k%4!==0?[0x2c241f,0x3a2a1e,0x6d6a66,0x1e1814][k%4]:null, kind:woman?'woman':'man'},o||{})); }
  return out;
}
const ids=list=>list.map(a=>a.id);

/* the crowds of each scene */
const WEDDING=folk('w',12,[-7,-6,7,1.5],0);
const QAHAL_N=folk('n',14,[-8,-31,6,-21.5],Math.PI,{});
const SHOREFOLK=folk('s',16,[12,-12,20,14],Math.PI/2);
const QAHAL_K=folk('q',12,[-13,-9.5,-4,-2.5],Math.PI/2);
const MOUNT=folk('m',30,[-27,-12,-14,24],-Math.PI/2,{sit:true});
const STREET=folk('k',10,[-4,-6,1.5,6],Math.PI/2);
const GROUPS=[[-14,-26],[-14,-12],[-14,2],[-14,16],[-14,30]];
const FIVE=[].concat(...GROUPS.map((g,i)=>folk('g'+i+'_',7,[g[0]-3,g[1]-3,g[0]+3,g[1]+3],-Math.PI/2,{sit:true})));
const LEADS=GROUPS.map((g,i)=>'g'+i+'_0');
const TABLE=folk('t',8,[8,6,13,13],-Math.PI/2,{sit:true});            /* tax collectors and sinners at the table */
const BEACH=folk('b',18,[13,-10,19.5,10],Math.PI/2);                   /* the crowd on the beach */
const MOURN=folk('y',10,[-1,0,6,12],-Math.PI/2);                               /* the Yahuḏim come to comfort the sisters */
const SISTER_M={name:'Miryam', key:'Miryam of Bĕyth Anyah', kind:'woman', robe:0x5a4a6a, cloth:0x3c3a44, skin:0x7a4e30};

STORY.act({
  id:'galil', n:5, num:'IV', title:'Galil',
  sub:'Qanah · Natsareth · Kephar Naḥum · the Sea of Galil',
  cast:{
    guests:{name:'Those in the qahal', kind:'crowd', actor:'n1', actors:ids(QAHAL_N)},
    /* "a man in their qahal with an unclean ruach and he cried out" — the ruach's words, in the
       man's mouth (Mark 1:23-24) */
    unclean:{name:'An unclean ruach', key:'an unclean ruach', kind:'dark', actor:'possessed', actors:['possessed']},
    amazed:{name:'Those in the qahal', key:'kephar nahum', kind:'crowd', actor:'q1', actors:ids(QAHAL_K)},
    blind:{name:'Two blind men', kind:'man', actor:'blind1', actors:['blind1','blind2']},
    messengers:{name:'Two taught ones of Yahuchanon', kind:'man', actor:'mess1', actors:['mess1','mess2']},
    men:{name:'The men', kind:'crowd', actor:'g2_1', actors:ids(FIVE)},
    boatmen:{name:'The taught ones', kind:'crowd', actor:'andri', actors:['andri','yaaqob','yahuchanon','philip']},
    pharisees:{name:'The Pharisees', key:'the pharisees', kind:'man', actor:'ph1', actors:['ph1','ph2']},
    psalmist:{name:'The naḇi', key:'the nabi', kind:'oldman'},
    sisters:{name:'The sisters', key:'Martha', kind:'woman', actor:'martha', actors:['martha','miryamB']},
    mourners:{name:'The Yahuḏim', key:'the yahudim', kind:'crowd', actor:'y1', actors:ids(MOURN)}
  },
  scenes:[

  /* ---------------- IV.1 — THE WEDDING IN QANAH ---------------- */
  { id:'qanah', title:'Qanah of Galil', date:'c. 28 CE', place:'qanah', time:'dusk',
    player:{ at:'lane', face:Math.PI, look:ADULT },
    actors:[
      Object.assign({id:'yahusha', at:'yahusha', face:Math.PI*0.9},YAHUSHA),
      Object.assign({id:'miryam', at:'miryam', face:0.6},MIRYAM),
      {id:'master', name:'The master of the feast', at:'master', face:0, robe:0x6a2a3a, cloth:0xe8e2d2, beard:0x6d6a66, sash:0xb08d3c, kind:'oldman'},
      {id:'groom', name:'The bridegroom', at:[3.6,-1.4], face:-1.2, robe:0xe6dcc0, cloth:0xb08d3c, beard:0x2c241f, sash:0xb08d3c},
      T('andri',[-3.2,4.6],{face:Math.PI*0.8}), T('kepha',[-0.4,4.8],{face:Math.PI*1.1}), T('philip',[1,4.2],{face:Math.PI*1.2}),
      {id:'servant1', name:'A servant', at:[-6.5,3.8], face:0, robe:0xcfc4aa, cloth:0xe6e0cf},
      {id:'servant2', at:[-5.2,6.6], face:0, robe:0xd8d0bb, cloth:0xcfc4aa, beard:0x2c241f},
      ...WEDDING
    ],
    things:[1,2,3,4,5,6].map(k=>({id:'jar'+k, kind:'jar', at:[-8.6+k*0.95,5.4]})).concat([
      {id:'cup', kind:'box', at:[-6.6,6.4], w:0.22, h:0.24, d:0.22, y:0, color:0xa0703f} ]),
    beats:[
      {t:'cam', from:[14,10,22], look:[0,1,0], dur:0.1},
      {t:'title', text:'Act IV · Galil', sub:'Qanah · Natsareth · Kephar Naḥum · the Sea of Galil'},
      {t:'note', text:'You went north with them from the Yardĕn into Galil. The hill villages here are a day’s walk from the lake; Qanah lies a few miles north of Natsareth.'},
      {t:'cam', from:[6,4.5,12], look:[0,1.2,0], dur:4, wait:false},
      {t:'read', ref:'YAHUCHANON 2:1'},
      {t:'read', ref:'YAHUCHANON 2:2'},
      {t:'cam', release:true},
      {t:'goal', text:'Go in at the gate to the wedding', goto:'gate', r:3},
      {t:'cam', from:[-1.6,2.6,7.6], look:'miryam', dur:2.5},
      {t:'say', who:'miryam', ref:'YAHUCHANON 2:3', turn:false},
      {t:'face', who:'yahusha', to:'miryam'},
      {t:'cam', on:'yahusha', shot:'back', toward:'miryam', dur:1.8},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 2:4', turn:false},
      {t:'say', who:'miryam', ref:'YAHUCHANON 2:5', turn:false},
      {t:'cam', from:[-3,2.2,9], look:[-5.5,0.8,5.4], dur:2.5},
      {t:'read', ref:'YAHUCHANON 2:6'},
      {t:'face', who:'yahusha', to:'servant1'},
      {t:'cam', on:'yahusha', shot:'back', toward:'servant1', dur:1.8},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 2:7', turn:false},
      {t:'cam', release:true},
      {t:'goal', text:'You are nearest the gate — go down to the well and draw water', goto:'well', r:2.6},
      {t:'witness', text:'Fill the six stone water-jugs to the brim', items:['jar1','jar2','jar3','jar4','jar5','jar6'], verb:'Pour in the water', hold:0.7, reach:1.8,
        reveal:{jar1:'jar1',jar2:'jar2',jar3:'jar3',jar4:'jar4',jar5:'jar5',jar6:'jar6'}},
      {t:'face', who:'yahusha', to:'servant1'},
      {t:'cam', on:'yahusha', shot:'back', toward:'servant1', dur:1.8},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 2:8', turn:false},
      {t:'fill', id:['jar1','jar2','jar3','jar4','jar5','jar6'], color:0x6a1a2a},
      {t:'witness', text:'Draw out and take it to the master of the feast', items:['cup'], verb:'Draw out a cup', hold:0.6,
        deliver:'master', r:2.2, carryText:'Take the cup to the master of the feast'},
      {t:'cam', from:[4.6,2,-2.4], look:'master', dur:2.5},
      {t:'read', ref:'YAHUCHANON 2:9'},
      {t:'say', who:'master', ref:'YAHUCHANON 2:10', turn:false},
      {t:'cam', release:true},
      {t:'read', ref:'YAHUCHANON 2:11'},
      {t:'choice', prompt:'You', options:[
        {text:'Look again at the jars you filled', reply:'You carried that water up from the well yourself, jar after jar. You know what you poured in.'},
        {text:'Say nothing, and keep it', reply:'The servants who drew the water knew. You were one of them.'} ]},
      {t:'end'}
    ]},

  /* ---------------- IV.2 — THE QAHAL OF NATSARETH ---------------- */
  { id:'natsareth', title:'Natsareth', date:'the Shabbath', place:'natsareth', time:'day',
    player:{ at:'qahalDoor', face:Math.PI, look:ADULT },
    actors:[
      Object.assign({id:'yahusha', at:[-0.4,-23.6], face:Math.PI},YAHUSHA),
      {id:'attendant', name:'The attendant', at:[1.6,-27.6], face:Math.PI/2+0.4, robe:0xe6e0cf, cloth:0x5a4a3a, beard:0x6d6a66, kind:'oldman'},
      ...QAHAL_N
    ],
    things:[ {id:'scroll', kind:'box', at:[-2,-27.8], w:0.7, h:0.16, d:0.2, y:1.3, color:0xe9dfc2} ],
    beats:[
      {t:'cam', from:[-14,9,6], look:[-2,2,-26], dur:0.1},
      {t:'read', ref:'LUKE 4:14-15'},
      {t:'read', ref:'LUKE 4:16'},
      {t:'cam', release:true},
      {t:'goal', text:'Go into the qahal and sit among them', goto:'qahalSeat', r:2.2},
      {t:'move', who:'yahusha', to:'reader', speed:1.2},
      {t:'face', who:'yahusha', to:[-2,-20]},
      {t:'cam', from:[-2,2.6,-17.5], look:[-2,1.6,-27], dur:2.5},
      {t:'read', ref:'LUKE 4:17'},
      {t:'hide', id:'scroll'},
      {t:'face', who:'yahusha', to:'n3'},
      {t:'cam', on:'yahusha', shot:'back', toward:'n3', dur:1.8},
      {t:'say', who:'yahusha', ref:'LUKE 4:18-19', turn:false},
      {t:'read', ref:'LUKE 4:20'},
      {t:'face', who:'yahusha', to:'n5'},
      {t:'cam', on:'yahusha', shot:'back', toward:'n5', dur:1.8},
      {t:'say', who:'yahusha', ref:'LUKE 4:21', turn:false},
      {t:'fulfil', id:'y61-1'},
      {t:'say', who:'guests', ref:'LUKE 4:22', turn:false},
      {t:'face', who:'yahusha', to:'n3'},
      {t:'cam', on:'yahusha', shot:'back', toward:'n3', dur:1.8},
      {t:'say', who:'yahusha', ref:'LUKE 4:23', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 4:24', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 4:25-26', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 4:27', turn:false},
      {t:'choice', prompt:'You', options:[
        {text:'Feel for your family’s scroll', reply:'The sixth of the seven words. Your father’s fathers copied them in Yahrushalayim, and you have just heard them read — and filled.'},
        {text:'Watch the faces around you', reply:'They have known Him since He was a boy. You see the warmth go out of them.'} ]},
      {t:'move', who:ids(QAHAL_N).slice(0,8).concat(['yahusha']), to:[[50,-56],[51,-58],[52,-55],[53,-57],[50,-59],[54,-60],[52,-61],[49,-57],[57,-62]], speed:2.6, wait:false},
      {t:'cam', from:[42,27,-45], look:[54,19,-59], dur:4, wait:false},
      {t:'read', ref:'LUKE 4:28-29'},
      {t:'cam', from:[44,25,-48], look:[55,19,-60], dur:2},
      {t:'move', who:'yahusha', to:[38,-40], speed:1.1, wait:false},
      {t:'read', ref:'LUKE 4:30'},
      {t:'end'}
    ]},

  /* ---------------- IV.3 — BY THE LAKE: THE CATCH ---------------- */
  { id:'catch', title:'The Lake of Gennĕsar', date:'by Kephar Naḥum', place:'galil', time:'dawn',
    player:{ at:'beach', face:Math.PI/2, look:ADULT },
    actors:[
      Object.assign({id:'yahusha', at:[19.5,2], face:Math.PI/2},YAHUSHA),
      T('kepha',[21,6.5],{face:Math.PI}), T('andri',[21.2,8],{face:Math.PI}),
      T('yaaqob',[21,-4.5],{face:0}), T('yahuchanon',[20.6,-6],{face:0}),
      {id:'zabdai', name:'Zaḇdai', at:[20,-7.4], face:0.3, robe:0x6b5a44, cloth:0xe6e0cf, beard:0x6d6a66, kind:'oldman'},
      ...SHOREFOLK
    ],
    things:[ {id:'boat1', kind:'boat', at:[23.6,4], y:-0.2},
             {id:'boat2', kind:'boat', at:[24.2,-6], y:-0.2},
             {id:'net1', kind:'net', at:[25.4,4.6], y:-0.3, w:1.4, h:0.5, d:2.4, n:60},
             {id:'net2', kind:'net', at:[22.4,-6.2], y:-0.2, w:1.2, h:0.4, d:1.6, n:40} ],
    beats:[
      {t:'cam', from:[4,6,18], look:[24,0.5,0], dur:0.1},
      {t:'read', ref:'LUKE 5:1'},
      {t:'read', ref:'LUKE 5:2'},
      {t:'cam', release:true},
      {t:'goal', text:'Go down to the shore, where the crowd is pressing to hear', goto:'beach', r:3},
      {t:'place', who:'kepha', at:[23.6,5.6], y:-0.42}, {t:'place', who:'yahusha', at:[23.6,3.2], y:-0.42, face:Math.PI/2},
      {t:'drift', id:['boat1','kepha','yahusha','net1'], by:[3.4,0,0], dur:2.5, wait:false},
      {t:'cam', from:[15,3.2,10], look:[26,0.6,4], dur:2.5},
      {t:'read', ref:'LUKE 5:3'},
      {t:'face', who:'yahusha', to:'kepha'},
      {t:'cam', on:'yahusha', shot:'back', toward:'kepha', dur:1.8},
      {t:'say', who:'yahusha', ref:'LUKE 5:4', turn:false},
      {t:'say', who:'kepha', ref:'LUKE 5:5', turn:false},
      {t:'place', who:'andri', at:[27.4,6.8], y:-0.42},
      {t:'drift', id:['boat1','kepha','yahusha','andri','net1'], by:[16,0,0], dur:5, wait:false},
      {t:'cam', from:[24,7,18], look:[40,0,2], dur:5},
      {t:'fill', id:'net1'},
      {t:'read', ref:'LUKE 5:6-7'},
      /* you are in the partners' boat: they motion to you to come and help */
      {t:'place', who:'yaaqob', at:[24.6,-4.4], y:-0.42}, {t:'place', who:'yahuchanon', at:[23.8,-7.4], y:-0.42},
      {t:'player', at:[24.4,-6.2], y:-0.4, lock:true, face:Math.PI/2},
      {t:'drift', id:['boat2','yaaqob','yahuchanon','player','net2'], by:[18,0,4.8], dur:5},
      {t:'cam', from:[38,3.2,-9], look:[43,0.2,3], dur:2},
      {t:'witness', text:'Haul on the net with them — it is breaking', items:['net1'], verb:'Haul on the net', hold:2.2, reach:8},
      {t:'fill', id:'net2'},
      {t:'cam', from:[46.5,2.4,-3.4], look:'kepha', dur:2.5},
      {t:'say', who:'kepha', ref:'LUKE 5:8', turn:false},
      {t:'read', ref:'LUKE 5:9'},
      {t:'face', who:'yahusha', to:'kepha'},
      {t:'cam', on:'yahusha', shot:'back', toward:'kepha', dur:1.8},
      {t:'say', who:'yahusha', ref:'LUKE 5:10', turn:false},
      {t:'drift', id:['boat1','kepha','yahusha','andri','net1'], by:[-19,0,0], dur:5, wait:false},
      {t:'drift', id:['boat2','yaaqob','yahuchanon','player','net2'], by:[-21,0,-4.8], dur:5},
      {t:'player', at:'beach', lock:false},
      {t:'read', ref:'LUKE 5:11'},
      {t:'choice', prompt:'You', options:[
        {text:'Leave the fish where they lie, and go with them', reply:'Two boats full, the best catch the lake has given in years, and they walk away from it. So do you.'},
        {text:'Help Zaḇdai with the boat first', reply:'The old man waves you off. "Go," he says. You go.'} ]},
      {t:'end'}
    ]},

  /* ---------------- IV.4 — THE QAHAL OF KEPHAR NAḤUM ---------------- */
  { id:'unclean', title:'Kephar Naḥum', date:'the Shabbath', place:'galil', time:'day',
    player:{ at:'qahalDoor', face:-Math.PI/2, look:ADULT },
    actors:[
      Object.assign({id:'yahusha', at:'qahalIn', face:-Math.PI/2},YAHUSHA),
      T('kepha',[-1.6,-2.6],{face:-Math.PI/2}), T('andri',[-1.4,-9.6],{face:-Math.PI/2}),
      T('yaaqob',[-2.2,-8.4],{face:-Math.PI/2}), T('yahuchanon',[-2.4,-3.6],{face:-Math.PI/2}),
      {id:'possessed', name:'A man of the qahal', at:[-9.6,-3], face:Math.PI/2, robe:0x5c5040, cloth:0x8a7a60, beard:0x2c241f},
      ...QAHAL_K
    ],
    glows:[ {id:'shade', at:[-9.6,1.4,-3], size:3.4, color:0x785090, intensity:0} ],
    beats:[
      {t:'read', ref:'MARK 1:21'},
      {t:'goal', text:'Go into the qahal', goto:'qahalIn', r:3.5},
      {t:'read', ref:'MARK 1:22'},
      {t:'cam', from:[-4,2.4,-0.6], look:'possessed', dur:2.5},
      {t:'say', who:'unclean', ref:'MARK 1:23-24', turn:false},
      {t:'face', who:'yahusha', to:'possessed'},
      {t:'cam', on:'yahusha', shot:'back', toward:'possessed', dur:1.8},
      {t:'say', who:'yahusha', ref:'MARK 1:25', turn:false},
      {t:'drift', id:'shade', to:[-14,6,2], dur:2.2, wait:false},
      {t:'read', ref:'MARK 1:26'},
      {t:'hide', id:'shade'},
      {t:'say', who:'amazed', ref:'MARK 1:27', turn:false},
      {t:'cam', release:true},
      {t:'read', ref:'MARK 1:28'},
      {t:'end'}
    ]},


  /* ---------------- IV.4b — THE TAX OFFICE ---------------- */
  { id:'tax', title:'Kephar Naḥum', date:'by the lake road', place:'galil', time:'day',
    player:{ at:[17,8], face:-Math.PI*0.8, look:ADULT },
    actors:[
      Object.assign({id:'yahusha', at:[20,-10], face:-0.2},YAHUSHA),
      T('kepha',[21.2,-12],{face:-0.2}), T('andri',[19,-12.4],{face:-0.2}),
      Object.assign({},T('mattithyahu',[14.2,-4.9],{face:Math.PI/2,sit:true})),
      {id:'ph1', name:'The Pharisees', dress:'scribe', at:[22,2], face:-Math.PI/2, robe:0xd8d0bb, cloth:0x3a3a4a, beard:0x2c241f},
      {id:'ph2', dress:'scribe', at:[22.6,3.8], face:-Math.PI/2, robe:0xcfc4aa, cloth:0x4a4a5a, beard:0x6d6a66},
      ...TABLE
    ],
    things:[ {id:'booth', kind:'box', at:[14.8,-4], w:1.4, h:0.8, d:2.2, color:0x6e5238},
             {id:'coins', kind:'box', at:[14.8,-4.2], w:0.5, h:0.05, d:0.4, y:0.8, color:0xb8a060},
             {id:'table', kind:'box', at:[10.6,9.6], w:1.4, h:0.5, d:5.2, color:0x7a5a3e},
             {id:'bread1', kind:'basket', at:[17.6,3.6], full:true}, {id:'bread2', kind:'basket', at:[18.4,4.6], full:true}, {id:'bread3', kind:'basket', at:[16.8,4.8], full:true} ],
    beats:[
      {t:'note', text:'Kephar Naḥum stood on the road along the lake, at the edge of the land of Herodes Antipas, tetrarch of Galil. Tolls on the goods that came along it were gathered here.'},
      {t:'cam', from:[19,3,4], look:[14.6,1.2,-4.6], dur:0.1},
      {t:'move', who:['yahusha','kepha','andri'], to:[[16.2,-6],[17.4,-7.6],[16,-8.2]], speed:1.5},
      {t:'face', who:'yahusha', to:'mattithyahu'},
      {t:'cam', on:'yahusha', shot:'back', toward:'mattithyahu', dur:1.8},
      {t:'read', ref:'MATTITHYAHU 9:9', who:'yahusha'},
      {t:'stand', who:'mattithyahu'},
      {t:'move', who:'mattithyahu', to:[15,-7], speed:1.4},
      {t:'cam', release:true},
      {t:'witness', text:'There is to be a meal at the house. Carry the bread to the table', items:['bread1','bread2','bread3'], verb:'Lift the basket', hold:0.4, deliver:[11.6,9.6], r:3, carryText:'Take the bread to the table'},
      {t:'place', who:'yahusha', at:[11.6,7.2], face:Math.PI/2}, {t:'place', who:'mattithyahu', at:[9.4,7.4], face:Math.PI/2},
      {t:'place', who:'kepha', at:[11.6,12.2], face:-Math.PI/2}, {t:'place', who:'andri', at:[9.6,12.2], face:-Math.PI/2},
      {t:'sit', who:['yahusha','mattithyahu','kepha','andri']},
      {t:'cam', from:[16,3,11], look:[10.6,1,9.6], dur:2.5},
      {t:'read', ref:'MATTITHYAHU 9:10'},
      {t:'move', who:['ph1','ph2'], to:[[14,6.4],[14.6,8.4]], speed:1.3},
      {t:'face', who:'ph1', to:'mattithyahu'},
      {t:'cam', from:[8.2,2.3,5.6], look:[14.2,1.5,7.2], dur:2.5},
      {t:'say', who:'pharisees', ref:'MATTITHYAHU 9:11', turn:false},
      {t:'face', who:'yahusha', to:'ph1'},
      {t:'cam', on:'yahusha', shot:'back', toward:'ph1', dur:1.8},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 9:12', turn:false},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 9:13', turn:false},
      {t:'cam', release:true},
      {t:'choice', prompt:'You', options:[
        {text:'Sit down at the table with them', reply:'You sit between a fisherman and a tax collector. The bread is passed along to you like to anyone.'},
        {text:'Look at Mattithyahu', reply:'This morning he sat behind the toll-table. Now he is the one pouring out for the others.'} ]},
      {t:'end'}
    ]},

  /* ---------------- IV.4c — THE TWELVE ---------------- */
  { id:'twelve', title:'The mountain above the lake', date:'at daybreak', place:'galil', time:'night',
    player:{ at:[-18,0], face:-Math.PI/2, look:ADULT },
    actors:[
      Object.assign({id:'yahusha', at:'mountTop', face:-Math.PI/2, sit:true},YAHUSHA),
      ...['kepha','andri','yaaqob','yahuchanon','philip','bartholomi','mattithyahu','toma','yaaqobA','shimonZ','yahudahY','yahudahQ']
        
        .map((id,k)=>T(id,[-17-(k%4)*1.6,-8+Math.floor(k/4)*2.4+(k%2)*0.6],{face:-Math.PI/2}))
    ],
    beats:[
      {t:'cam', from:[-24,3.4,12], look:[-35,6.4,6], dur:0.1},
      {t:'read', ref:'LUKE 6:12'},
      {t:'time', to:'dawn'},
      {t:'face', who:'yahusha', to:'kepha'},
      {t:'stand', who:'yahusha'},
      {t:'cam', from:[-40,9,10], look:[-29,1.4,4], dur:3},
      {t:'read', ref:'LUKE 6:13'},
      {t:'move', who:['kepha','andri','yaaqob','yahuchanon','philip','bartholomi'], to:[[-32.4,1.6],[-31.4,3.2],[-30.6,4.8],[-30.2,6.6],[-30.4,8.4],[-31,10]], speed:1.6, wait:false},
      {t:'read', ref:'LUKE 6:14'},
      {t:'move', who:['mattithyahu','toma','yaaqobA','shimonZ'], to:[[-29,1.2],[-28.2,3],[-27.8,5],[-27.8,7]], speed:1.6, wait:false},
      {t:'read', ref:'LUKE 6:15'},
      {t:'move', who:['yahudahY','yahudahQ'], to:[[-28,9],[-28.8,10.8]], speed:1.6},
      {t:'read', ref:'LUKE 6:16'},
      {t:'time', to:'day'},
      {t:'cam', release:true},
      {t:'choice', prompt:'You', options:[
        {text:'Say their names over to yourself', reply:'Shim‛on, Andri, Ya‛aqoḇ, Yahuchanon, Philip, Bartholomi, Mattithyahu, T’oma, Ya‛aqoḇ, Shim‛on, Yahuḏah, Yahuḏah. Twelve, like the tribes.'},
        {text:'Stay at the edge of the crowd and watch'} ]},
      {t:'end'}
    ]},


  /* ---------------- IV.5 — ON THE MOUNTAIN ---------------- */
  { id:'mountain', title:'The mountain above the lake', date:'Galil', place:'galil', time:'day',
    player:{ at:[-18,8], face:-Math.PI/2, look:ADULT },
    actors:[
      Object.assign({id:'yahusha', at:'mountTop', face:Math.PI/2, sit:true},YAHUSHA),
      T('kepha',[-32,3.2],{face:-Math.PI/2,sit:true}), T('andri',[-31.4,5.4],{face:-Math.PI/2,sit:true}),
      T('yaaqob',[-31.6,8.2],{face:-Math.PI/2,sit:true}), T('yahuchanon',[-32.4,10],{face:-Math.PI/2,sit:true}),
      T('philip',[-30.6,1.2],{face:-Math.PI/2,sit:true}), T('nethanel',[-30.4,11.6],{face:-Math.PI/2,sit:true}),
      ...MOUNT
    ],
    beats:[
      {t:'cam', from:[-4,8,28], look:[-32,4,6], dur:0.1},
      {t:'goal', text:'Climb up after the crowds, and sit among them', goto:'mountCrowd', r:3},
      {t:'cam', from:[-20,4.6,14], look:[-34,4.4,6], dur:3},
      {t:'read', ref:'MATTITHYAHU 5:1-2'},
      {t:'face', who:'yahusha', to:'m10'},
      {t:'cam', on:'yahusha', shot:'back', toward:'m10', dur:1.8},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 5:3-6', turn:false},
      {t:'face', who:'yahusha', to:'m4'},
      {t:'cam', on:'yahusha', shot:'back', toward:'m4', dur:1.8},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 5:7-10', turn:false},
      {t:'face', who:'yahusha', to:'m20'},
      {t:'cam', on:'yahusha', shot:'back', toward:'m20', side:-1, dur:1.8},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 5:11-12', turn:false},
      {t:'cam', from:[-12,4,-10], look:[-26,2,6], dur:3},
      {t:'read', ref:'MATTITHYAHU 7:28-29'},
      {t:'cam', release:true},
      {t:'choice', prompt:'You', options:[
        {text:'Stay sitting a while after the crowd has gone', reply:'The grass is warm. Below you the lake is very still. You go over the words again, so as not to lose any.'},
        {text:'Go down with the others', reply:'Everyone on the path is saying the words again to one another.'} ]},
      {t:'end'}
    ]},

  /* ---------------- IV.6 — THE CAPTAIN ---------------- */
  { id:'captain', title:'Kephar Naḥum', date:'Galil', place:'galil', time:'day',
    player:{ at:[2,7], face:Math.PI*0.75, look:ADULT },
    actors:[
      Object.assign({id:'yahusha', at:[6,1], face:Math.PI/2},YAHUSHA),
      T('kepha',[4.2,-1],{face:Math.PI/2}), T('yahuchanon',[3.8,3],{face:Math.PI/2}),
      /* a captain (a centurion) of Rome: a Roman, and drawn as one */
      {id:'captain', name:'A captain', at:[19,0], face:-Math.PI/2, folk:'roman', robe:0x8a2a22, cloth:0x9a9a9a, sash:0x5a4a3a, key:'the captain'},
      {id:'legio1', at:[20.4,2], face:-Math.PI/2, folk:'roman', robe:0x7a2620, cloth:0x9a9a9a, sash:0x5a4a3a},
      ...STREET
    ],
    beats:[
      {t:'move', who:'captain', to:[9.6,0.8], speed:1.6, wait:false},
      {t:'move', who:'legio1', to:[11.2,2.6], speed:1.6, wait:false},
      {t:'cam', from:[2.6,2.6,7.4], look:[9.6,1.5,0.8], dur:3},
      {t:'say', who:'captain', ref:'MATTITHYAHU 8:5-6', turn:false},
      {t:'face', who:'yahusha', to:'captain'},
      {t:'cam', on:'yahusha', shot:'back', toward:'captain', dur:1.8},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 8:7', turn:false},
      {t:'say', who:'captain', ref:'MATTITHYAHU 8:8', turn:false},
      {t:'say', who:'captain', ref:'MATTITHYAHU 8:9', turn:false},
      {t:'face', who:'yahusha', to:'kepha'},
      {t:'cam', on:'yahusha', shot:'back', toward:'kepha', dur:1.8},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 8:10', turn:false},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 8:11-12', turn:false},
      {t:'face', who:'yahusha', to:'captain'},
      {t:'cam', on:'yahusha', shot:'back', toward:'captain', dur:1.8},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 8:13', turn:false},
      {t:'cam', release:true},
      {t:'move', who:['captain','legio1'], to:[[30,-30],[31,-28]], speed:1.6, wait:false},
      {t:'choice', prompt:'You', options:[
        {text:'Watch the Roman go', reply:'A soldier of the empire, and he believed. You think of the scroll under your arm, and of who it was written for.'},
        {text:'Ask Kĕpha what this means'} ]},
      {t:'end'}
    ]},

  /* ---------------- IV.7 — THE BLIND SEE ---------------- */
  { id:'blind', title:'Kephar Naḥum', date:'Galil', place:'galil', time:'dusk',
    player:{ at:[-8,16], face:Math.PI*0.6, look:ADULT },
    actors:[
      Object.assign({id:'yahusha', at:[-2,6], face:Math.PI/2},YAHUSHA),
      T('kepha',[-0.6,7.6],{face:Math.PI/2}), T('andri',[-0.8,4.4],{face:Math.PI/2}),
      {id:'blind1', name:'A blind man', at:[-10.6,14.4], face:Math.PI/2, robe:0x6b5a44, cloth:0x8a7a60, beard:0x3a2a1e},
      {id:'blind2', name:'A blind man', at:[-11.4,15.8], face:Math.PI/2, robe:0x5c5040, cloth:0xa89a7e, beard:0x6d6a66, kind:'oldman'},
      {id:'mess1', name:'A taught one of Yahuchanon', at:[-40,30], face:Math.PI/4, robe:0x7b5a3a, cloth:0x2a2019, beard:0x2a2019, hidden:true},
      {id:'mess2', at:[-41.4,31.2], face:Math.PI/4, robe:0x6e5238, cloth:0x2a2019, beard:0x3a2a1e, hidden:true},
      ...folk('h',8,[-4,14,8,22],-Math.PI/2)
    ],
    beats:[
      {t:'say', who:'blind', ref:'MATTITHYAHU 9:27', turn:false},
      {t:'move', who:'yahusha', to:'houseDoor', speed:1.2, wait:false},
      {t:'witness', text:'They cannot see the way — take them by the hand and lead them to the house', items:['blind1','blind2'], verb:'Take his hand', hold:0.6, reach:2.2},
      {t:'move', who:['blind1','blind2'], to:[[8.2,6.4],[9.6,7]], speed:1.2, wait:false},
      {t:'goal', text:'Bring them to the house where He went in', goto:'houseDoor', r:3.4},
      {t:'place', who:'yahusha', at:[8.8,10.6], face:Math.PI},
      {t:'cam', from:[10,2.5,15.6], look:[8.9,1.4,6.8], dur:2.5},
      {t:'read', ref:'MATTITHYAHU 9:28', voices:['yahusha','blind']},
      {t:'face', who:'yahusha', to:'blind1'},
      {t:'cam', on:'yahusha', shot:'back', toward:'blind1', dur:1.8},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 9:29', turn:false},
      {t:'read', ref:'MATTITHYAHU 9:30', who:'yahusha'},
      {t:'read', ref:'MATTITHYAHU 9:31'},
      {t:'cam', release:true},
      {t:'title', text:'In those days', sub:'Yahuchanon is in prison'},
      {t:'show', id:['mess1','mess2']},
      {t:'move', who:['mess1','mess2'], to:[[3.6,11.4],[4.6,12.6]], speed:2, wait:false},
      {t:'place', who:'yahusha', at:[7.4,10.6], face:Math.PI},
      {t:'cam', from:[0.6,2.6,16], look:[6,1.5,11], dur:3},
      {t:'say', who:'messengers', ref:'MATTITHYAHU 11:2-3', turn:false},
      {t:'face', who:'yahusha', to:'mess1'},
      {t:'cam', on:'yahusha', shot:'back', toward:'mess1', dur:1.8},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 11:4-6', turn:false},
      {t:'fulfil', id:'y35-5'},
      {t:'cam', release:true},
      {t:'end'}
    ]},


  /* ---------------- IV.7b — THE SOWER ---------------- */
  { id:'sower', title:'By the Sea of Galil', date:'on that day', place:'galil', time:'day',
    player:{ at:[14,12], face:Math.PI/2, look:ADULT },
    actors:[
      Object.assign({id:'yahusha', at:[6,-2], face:Math.PI/2},YAHUSHA),
      T('kepha',[23,-2.6],{face:-Math.PI/2}), T('andri',[22.6,1.6],{face:-Math.PI/2}),
      ...BEACH
    ],
    things:[ {id:'boat1', kind:'boat', at:[25.6,0], y:-0.2, face:Math.PI/2} ],
    beats:[
      {t:'cam', from:[8,6,18], look:[18,0.5,0], dur:0.1},
      {t:'read', ref:'MATTITHYAHU 13:1'},
      {t:'move', who:'yahusha', to:[21.4,0], speed:1.5},
      {t:'read', ref:'MATTITHYAHU 13:2'},
      {t:'place', who:'yahusha', at:[25.6,0.4], y:0.05, face:-Math.PI/2},
      {t:'sit', who:'yahusha'},
      {t:'goal', text:'Find a place to stand on the beach among the crowd', goto:[16,4], r:3},
      {t:'cam', on:'yahusha', shot:'back', toward:'b6', dur:1.8},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 13:3', turn:false},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 13:4', turn:false},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 13:5', turn:false},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 13:6', turn:false},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 13:7', turn:false},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 13:8', turn:false},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 13:9', turn:false},
      {t:'cam', on:'yahusha', shot:'back', toward:'b12', side:-1, dur:1.8},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 13:31', turn:false},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 13:32', turn:false},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 13:33', turn:false},
      {t:'cam', release:true},
      {t:'read', ref:'MATTITHYAHU 13:34'},
      {t:'read', ref:'MATTITHYAHU 13:35', who:'psalmist'},
      {t:'choice', prompt:'You', options:[
        {text:'Ask yourself which ground you are', reply:'The wayside, the rock, the thorns, the good soil. You do not say it aloud.'},
        {text:'Look at the fields on the hills above the lake', reply:'Somebody up there is sowing even now, and the birds are following him.'} ]},
      {t:'end'}
    ]},


  /* ---------------- IV.8 — FIVE LOAVES AND TWO FISH ---------------- */
  { id:'loaves', title:'Across the Sea of Galil', date:'the Pesach near', place:'galilEast', time:'day',
    player:{ at:[2,2], face:-Math.PI/2, look:ADULT },
    actors:[
      Object.assign({id:'yahusha', at:'seat', face:Math.PI/2},YAHUSHA),
      T('philip',[-27,-3],{face:Math.PI*0.7}), T('andri',[-27.4,3.4],{face:-Math.PI*0.7}),
      T('kepha',[-26,5.6],{face:-Math.PI/2}), T('yaaqob',[-26,-5.8],{face:-Math.PI/2}), T('yahuchanon',[-25.4,8.2],{face:-Math.PI/2}),
      {id:'boy', name:'A boy', at:[-24.4,1.8], face:-Math.PI/2, small:true, robe:0x8a7454, cloth:0xd8cfb8, kind:'boy'},
      ...FIVE
    ],
    things:GROUPS.map((g,i)=>({id:'bread'+i, kind:'basket', at:[g[0]+3.4,g[1]], full:true, hidden:true}))
      .concat([0,1,2].map(k=>({id:'frag'+k, kind:'basket', at:[-10+k*1.4,-2]}))),
    beats:[
      {t:'cam', from:[18,12,26], look:[-24,4,0], dur:0.1},
      {t:'read', ref:'YAHUCHANON 6:1-2'},
      {t:'read', ref:'YAHUCHANON 6:3-4'},
      {t:'face', who:'yahusha', to:'philip'},
      {t:'cam', on:'yahusha', shot:'back', toward:'philip', dur:1.8},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 6:5', turn:false},
      {t:'read', ref:'YAHUCHANON 6:6'},
      {t:'say', who:'philip', ref:'YAHUCHANON 6:7', turn:false},
      {t:'say', who:'andri', ref:'YAHUCHANON 6:8-9', turn:false},
      {t:'face', who:'yahusha', to:'andri'},
      {t:'cam', on:'yahusha', shot:'back', toward:'andri', dur:1.8},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 6:10', turn:false},
      {t:'cam', release:true},
      {t:'read', ref:'YAHUCHANON 6:11'},
      {t:'witness', text:'Take the bread and the fish to each company sitting on the grass', items:LEADS, verb:'Give out the bread', hold:0.7, reach:3.4,
        reveal:Object.fromEntries(LEADS.map((l,i)=>[l,'bread'+i]))},
      {t:'face', who:'yahusha', to:'andri'},
      {t:'cam', on:'yahusha', shot:'back', toward:'andri', dur:1.8},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 6:12', turn:false},
      {t:'witness', text:'Gather the broken pieces, so that none is wasted', items:['frag0','frag1','frag2'], verb:'Fill the basket', hold:0.8, reach:1.8,
        reveal:{frag0:'frag0',frag1:'frag1',frag2:'frag2'}},
      {t:'read', ref:'YAHUCHANON 6:13'},
      {t:'say', who:'men', ref:'YAHUCHANON 6:14', turn:false},
      {t:'choice', prompt:'You', options:[
        {text:'Count the baskets', reply:'Twelve, heaped. You filled three of them yourself, and you started with five loaves.'},
        {text:'Think of the bread of your childhood', reply:'Bĕyth Leḥem: the house of bread. You have not thought of the name that way before.'} ]},
      {t:'end'}
    ]},

  /* ---------------- IV.9 — THE FOURTH WATCH ---------------- */
  { id:'sea', title:'The Sea of Galil', date:'the fourth watch of the night', place:'galilSea', time:'night',
    player:{ at:[58.6,-1.6], face:0, look:ADULT },
    actors:[
      T('kepha',[60.2,2.4],{face:0, y:-0.6}), T('andri',[59.4,-0.4],{face:0, y:-0.6}), T('yaaqob',[60.6,-2.2],{face:0, y:-0.6}),
      T('yahuchanon',[59.2,1.2],{face:0, y:-0.6}), T('philip',[60.6,0.4],{face:0.4, y:-0.6}),
      Object.assign({id:'yahusha', at:[60,46], face:Math.PI, y:-0.35, hidden:true},YAHUSHA)
    ],
    things:[ {id:'boat', kind:'boat', at:[60,0], y:-0.35} ],
    beats:[
      {t:'player', at:[58.6,-1.6], y:-0.6, lock:true, face:0},
      {t:'cam', from:[48,6,-14], look:[60,0,0], dur:0.1},
      {t:'read', ref:'MATTITHYAHU 14:22-23'},
      {t:'cam', from:[54,3,-8], look:[60,0.4,2], dur:4, wait:false},
      {t:'read', ref:'MATTITHYAHU 14:24'},
      {t:'show', id:'yahusha'},
      {t:'move', who:'yahusha', to:[60,9], speed:1.6, wait:false},
      {t:'cam', from:[58.4,1.6,-4.6], look:[60,0.8,20], dur:3},
      {t:'read', ref:'MATTITHYAHU 14:25'},
      {t:'say', who:'boatmen', ref:'MATTITHYAHU 14:26', turn:false},
      {t:'face', who:'yahusha', to:'andri'},
      {t:'cam', on:'yahusha', shot:'back', toward:'andri', dur:1.8},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 14:27', turn:false},
      {t:'say', who:'kepha', ref:'MATTITHYAHU 14:28', turn:false},
      {t:'face', who:'yahusha', to:'kepha'},
      {t:'cam', on:'yahusha', shot:'back', toward:'kepha', dur:1.8},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 14:29', turn:false},
      {t:'drift', id:'kepha', to:[60,-0.35,5.4], dur:2.4},
      {t:'cam', from:[63.6,1.4,1.4], look:[60,0.6,6.6], dur:2},
      {t:'drift', id:'kepha', to:[60,-1.15,6.4], dur:2.4, wait:false},
      {t:'say', who:'kepha', ref:'MATTITHYAHU 14:30', turn:false},
      {t:'drift', id:'kepha', to:[60,-0.35,7.4], dur:1.2},
      {t:'face', who:'yahusha', to:'kepha'},
      {t:'cam', on:'yahusha', shot:'back', toward:'kepha', dur:1.8},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 14:31', turn:false},
      {t:'drift', id:['yahusha','kepha'], by:[0,0,-5.4], dur:3},
      {t:'weather', wind:[0.2,0.1], rough:0.4},
      {t:'read', ref:'MATTITHYAHU 14:32'},
      {t:'cam', from:[56.4,1.4,-4.2], look:[60,0.6,3], dur:2.5},
      {t:'say', who:'boatmen', ref:'MATTITHYAHU 14:33', turn:false},
      {t:'end'}
    ]},

  /* ---------------- IV.10 — AL‛AZAR ---------------- */
  { id:'elazar', title:'Bĕyth Anyah', date:'near Yahrushalayim', place:'bethanyah', time:'day',
    player:{ at:[20,-2], face:-Math.PI/2, look:ADULT },
    actors:[
      Object.assign({id:'yahusha', at:'road', face:-Math.PI/2},YAHUSHA),
      T('kepha',[28,-7.6],{face:-Math.PI/2}), T('yahuchanon',[28.4,-4.6],{face:-Math.PI/2}), T('toma',[30,-6],{face:-Math.PI/2}),
      {id:'martha', name:'Martha', kind:'woman', at:[-2.4,4.6], face:Math.PI/2, robe:0x6a4a3a, cloth:0x2e2a30, skin:0x7c5430, key:'Martha'},
      Object.assign({id:'miryamB', at:[-3.4,7.2], face:Math.PI/2, sit:true},SISTER_M),
      {id:'elazar', name:'Al‛azar', dress:'wrapped', at:'tombIn', face:Math.PI/2, hidden:true, skin:0x7a4e29},
      ...MOURN
    ],
    things:[ {id:'stone', kind:'roundStone', at:'stone', face:0, r:1.3} ],
    beats:[
      {t:'title', text:'Bĕyth Anyah', sub:'near Yahrushalayim'},
      {t:'cam', from:[6,4,14], look:[-3,1.2,6], dur:0.1},
      {t:'read', ref:'YAHUCHANON 11:1'},
      {t:'say', who:'sisters', ref:'YAHUCHANON 11:3'},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 11:4', turn:false},
      {t:'read', ref:'YAHUCHANON 11:5'},
      {t:'read', ref:'YAHUCHANON 11:6'},
      {t:'move', who:['yahusha','kepha','yahuchanon','toma'], to:['meet',[17.6,-6.4],[17.8,-3],[19.4,-5]], speed:1.5, wait:false},
      {t:'read', ref:'YAHUCHANON 11:17'},
      {t:'read', ref:'YAHUCHANON 11:18'},
      {t:'read', ref:'YAHUCHANON 11:19'},
      {t:'move', who:'martha', to:[11.2,-3.6], speed:1.8},
      {t:'read', ref:'YAHUCHANON 11:20'},
      {t:'face', who:'yahusha', to:'martha'},
      {t:'cam', on:'yahusha', shot:'back', toward:'martha', dur:1.8},
      {t:'say', who:'martha', ref:'YAHUCHANON 11:21', turn:false},
      {t:'say', who:'martha', ref:'YAHUCHANON 11:22', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 11:23', turn:false},
      {t:'say', who:'martha', ref:'YAHUCHANON 11:24', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 11:25', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 11:26', turn:false},
      {t:'say', who:'martha', ref:'YAHUCHANON 11:27', turn:false},
      {t:'move', who:'martha', to:[-2.6,6.4], speed:1.8, wait:false},
      {t:'say', who:'martha', ref:'YAHUCHANON 11:28'},
      {t:'stand', who:'miryamB'},
      {t:'move', who:['miryamB','martha'], to:[[11.4,-3.8],[11,-1.8]], speed:2},
      {t:'follow', who:['y1','y2','y3','y4','y5'], target:'miryamB'},
      {t:'sit', who:'miryamB'},
      {t:'say', who:'miryamB', ref:'YAHUCHANON 11:32', turn:false},
      {t:'read', ref:'YAHUCHANON 11:33'},
      {t:'say', voices:['yahusha','mourners'], ref:'YAHUCHANON 11:34', turn:false},
      {t:'stand', who:'miryamB'},
      {t:'cam', from:[13.6,2.2,-2], look:'yahusha', dur:2.5},
      {t:'read', ref:'YAHUCHANON 11:35'},
      {t:'say', who:'mourners', ref:'YAHUCHANON 11:36'},
      {t:'stop', who:['y1','y2','y3','y4','y5']},
      {t:'move', who:['yahusha','martha','miryamB','kepha','yahuchanon','toma','y1','y2','y3','y4','y5'],
        to:['tombFront',[-13.6,-5.4],[-13,-4],[-12.4,-10.6],[-11.6,-9],[-11,-11.6],[-9.6,-4.4],[-9.4,-6.4],[-9.2,-8.6],[-9,-10.6],[-8.6,-12.4]], speed:1.4},
      {t:'face', who:'yahusha', to:'stone'},
      {t:'cam', from:[-12,3,-1], look:[-20.6,1.2,-8], dur:2.5},
      {t:'read', ref:'YAHUCHANON 11:38'},
      {t:'say', voices:['yahusha','martha'], ref:'YAHUCHANON 11:39', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 11:40', turn:false},
      {t:'cam', release:true},
      {t:'witness', text:'Put your shoulder to the stone with the others', items:['stone'], verb:'Roll the stone aside', hold:1.6, reach:3, send:'stoneAside'},
      {t:'cam', from:[-11,2.6,-2.6], look:[-21,1.4,-8], dur:2.5},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 11:41-42', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 11:43', turn:false},
      {t:'show', id:'elazar'},
      {t:'move', who:'elazar', to:'tombOut', speed:0.5},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 11:44', turn:false},
      {t:'move', who:['martha','miryamB'], to:[[-16.4,-6.6],[-16.6,-9.4]], speed:1.8},
      {t:'read', ref:'YAHUCHANON 11:45'},
      {t:'cam', release:true},
      {t:'choice', prompt:'You', options:[
        {text:'Help loosen the wrappings', reply:'The linen is stiff with spices. Under your hands it gives, turn by turn, and a man who was dead four days stands up straight.'},
        {text:'Stand still and watch the sisters', reply:'Martha is laughing and weeping at once. Miryam has not let go of her brother’s hand.'} ]},
      {t:'title', text:'The end of Act IV', sub:'Next: The Road to Yahrushalayim'},
      {t:'end'}
    ]}

  ]
});
})();
