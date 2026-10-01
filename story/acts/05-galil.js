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
  nethanel:{name:'Nethanĕ’l', key:'Nethanĕ’l', robe:0x8a6a3a, cloth:0xcfc4aa, beard:0x3a2a1e, skin:0x643f1c}
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
const MOUNT=folk('m',30,[-34,-12,-22,24],-Math.PI/2,{sit:true});
const STREET=folk('k',10,[-4,-6,1.5,6],Math.PI/2);
const GROUPS=[[-14,-26],[-14,-12],[-14,2],[-14,16],[-14,30]];
const FIVE=[].concat(...GROUPS.map((g,i)=>folk('g'+i+'_',7,[g[0]-3,g[1]-3,g[0]+3,g[1]+3],-Math.PI/2,{sit:true})));
const LEADS=GROUPS.map((g,i)=>'g'+i+'_0');

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
    boatmen:{name:'The taught ones', kind:'crowd', actor:'andri', actors:['andri','yaaqob','yahuchanon','philip']}
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

  /* ---------------- IV.5 — ON THE MOUNTAIN ---------------- */
  { id:'mountain', title:'The mountain above the lake', date:'Galil', place:'galil', time:'day',
    player:{ at:[-18,8], face:-Math.PI/2, look:ADULT },
    actors:[
      Object.assign({id:'yahusha', at:'mountTop', face:Math.PI/2, sit:true},YAHUSHA),
      T('kepha',[-44,3.2],{face:-Math.PI/2,sit:true}), T('andri',[-43.4,5.4],{face:-Math.PI/2,sit:true}),
      T('yaaqob',[-43.6,8.2],{face:-Math.PI/2,sit:true}), T('yahuchanon',[-44.4,10],{face:-Math.PI/2,sit:true}),
      T('philip',[-42.6,1.2],{face:-Math.PI/2,sit:true}), T('nethanel',[-42.4,11.6],{face:-Math.PI/2,sit:true}),
      ...MOUNT
    ],
    beats:[
      {t:'cam', from:[-6,16,30], look:[-44,8,6], dur:0.1},
      {t:'goal', text:'Climb up after the crowds, and sit among them', goto:'mountCrowd', r:3},
      {t:'cam', from:[-32,8.4,14], look:[-48,10.2,6], dur:3},
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
      {t:'cam', from:[-24,7,-10], look:[-40,8,6], dur:3},
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
      {t:'move', who:['blind1','blind2'], to:[[7.6,13.6],[8.8,14.2]], speed:1.2, wait:false},
      {t:'goal', text:'Bring them to the house where He went in', goto:'houseDoor', r:3.4},
      {t:'cam', from:[13.6,2.4,15.6], look:[8.2,1.5,13], dur:2.5},
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
      {t:'title', text:'The end of Act IV', sub:'Next: The Road to Yahrushalayim'},
      {t:'end'}
    ]}
  ]
});
})();
