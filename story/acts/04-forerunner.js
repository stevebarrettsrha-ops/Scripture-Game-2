/* ACT III — THE FORERUNNER. Yahuchanon the Immerser at the Yardĕn; the immersion of
   Yahusha and the Ruach descending like a dove; the forty days in the wilderness; and
   "See, the Lamb of Aluahim", the two taught ones who followed.

   THE WITNESS. The shepherd boy of Act II, a man now, past thirty, who comes down to the
   Yardĕn with the crowds from Yahuḏah — and at the end walks after Yahusha with Andri,
   which is how a man of Bĕyth Leḥem comes to be among the Galileans of Act IV. What he did
   not see — the forty days, the edge of the Qodash, the very high mountain — is shown as
   the Besorah tells it, and said to be so.

   THE ORDER is the harmonized one (Key Decision 2): the preaching and the immersion as
   Mattithyahu and Luke give them; the forty days (Mattithyahu 4:1-11); then the witness of
   Yahuchanon 1:19-42, which the Besorah sets after them ("the next day", 1:29, 1:35).

   WHO SPEAKS. Every quotation goes to the one the Besorah names, and the words outside the
   marks are the telling. Where a verse has more than one speaker, `voices` gives them in
   order ("Are you Aliyahu?" So he said, "I am not." — 1:21).

   REVERENT FRAMING (Key Decision 1). Yahusha has a body like every man of Yasharal, and
   His face is never shown: when He speaks the camera frames His body and hands, or looks
   over His shoulder from behind, and the engine keeps every camera from His face. The Ruach
   descends as a dove of light. The trier is drawn as Scripture-Game draws Satan and the
   fallen: a figure in a robe of deep violet-grey with a dark crimson mantle, a shadowed face,
   a dim violet light about him. The Codex lights 40:3 and 11:1-2. */
const TRIER={id:'trier', name:'The trier', fallen:true, key:'the devil'};
(function(){
const ADULT={robe:0x8a7454, cloth:0xd8cfb8, beard:0x3a2a1e, skin:0x86573a};
const YAHUCHANON={name:'Yahuchanon', robe:0x7b5a3a, cloth:0x2a2019, beard:0x2a2019, sash:0x3e2a1a, skin:0x7a4e30, key:'Yahuchanon'};
const YAHUSHA={name:'Yahusha', holy:true, kind:'yahusha', key:'Yahusha'};
const YAHSHAYAHU={robe:0x4a3c33, cloth:0xb9ab8e, beard:0x6d6a66};

/* the crowds from Yahrushalayim and all Yahuḏah (Mattithyahu 3:5), on the west bank */
let seed=7; const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const ROBES=[0x7c6a52,0x5f6a52,0x8e6f4c,0x6b5a44,0x74604a,0x5c5040,0x8a7a60,0x6e5a70,0x7a5040,0x5a6470];
const CLOTHS=[0xcfc4aa,0xd8ceb4,0xb9ab8e,0xe6e0cf,0xc1b394,0xa89a7e];
const crowd=[];
for(let k=0;k<16;k++){
  const x=-19+rnd()*10, z=-11+rnd()*23;
  if(Math.hypot(x+10.5,z-1.5)<2.2||Math.hypot(x+10,z+3.5)<2.2){ k--; continue; }
  const woman=k%4===1;
  crowd.push({id:'c'+k, at:[x,z], face:Math.PI/2+(rnd()-0.5)*0.8, robe:ROBES[k%ROBES.length], cloth:CLOTHS[(k*3)%CLOTHS.length],
    beard:!woman&&k%3!==0?[0x2c241f,0x3a2a1e,0x6d6a66][k%3]:null, kind:woman?'woman':k%5===0?'oldman':'man'});
}
const CROWD=crowd.map(c=>c.id);
const some=(n,off)=>crowd.slice(off||0,(off||0)+n);

STORY.act({
  id:'forerunner', n:4, num:'III', title:'The Forerunner',
  sub:'The Yardĕn · the wilderness of Yahuḏah · c. 28 CE',
  cast:{
    crowds:{name:'The crowds', kind:'crowd', actor:'c2', actors:CROWD},
    taxmen:{name:'Tax collectors', kind:'man', actor:'taxc', actors:['taxc','taxc2']},
    soldiers:{name:'Soldiers', kind:'man', actor:'soldier', actors:['soldier','soldier2']},
    /* "spoken of by the naḇi Yahshayahu, saying, “A voice …”" — his voice, as in the Prologue */
    nabi:{name:'Yahshayahu the naḇi', key:'Yahshayahu', kind:'oldman', look:YAHSHAYAHU},
    /* "a voice out of the shamayim, saying, “This is My Son …”" */
    voice:{name:'A voice out of the shamayim', key:'(YAHUAH) HWHY', kind:'divine'},
    trier:{name:'The trier', key:'the devil', kind:'dark', actor:'trier'},
    devil:{name:'The devil', key:'the devil', kind:'dark', actor:'trier'},
    sent:{name:'Those sent from Yahrushalayim', kind:'oldman', actor:'k1', actors:['k1','k2','l1']},
    taught:{name:'The two taught ones', kind:'man', actor:'andri', actors:['andri','other']}
  },
  scenes:[

  /* ---------------- III.1 — A VOICE IN THE WILDERNESS ---------------- */
  { id:'voice', title:'The Yardĕn', date:'c. 28 CE', place:'yarden', time:'day',
    player:{ at:'arrive', face:Math.PI/2.4, look:ADULT },
    actors:[
      Object.assign({id:'yahuchanon', at:'yahIn', face:-Math.PI/2},YAHUCHANON),
      ...crowd,
      {id:'cold', name:'A man with no cloak', at:[-12.6,8.4], face:Math.PI/2, robe:0xd9d1bc, cloth:0xcfc4aa, beard:0x3a2a1e},
      {id:'taxc', name:'A tax collector', at:[-13.5,-7.5], face:Math.PI/2, robe:0x3f4f6a, cloth:0xd8ceb4, sash:0xb08d3c},
      {id:'taxc2', at:[-14.6,-8.6], face:Math.PI/2, robe:0x4a4460, cloth:0xcfc4aa, beard:0x2c241f},
      {id:'soldier', name:'A soldier', at:[-16,5.5], face:Math.PI/2, robe:0x8a2a22, cloth:0x9a8a70, sash:0x6e5238},
      {id:'soldier2', at:[-17,6.8], face:Math.PI/2, robe:0x7a2620, cloth:0x9a8a70, sash:0x6e5238, beard:0x2c241f}
    ],
    beats:[
      {t:'cam', from:[-60,26,38], look:[0,0,0], dur:0.1},
      {t:'title', text:'Act III · The Forerunner', sub:'The Yardĕn · the wilderness of Yahuḏah'},
      {t:'cam', from:[-26,9,22], look:[2,0,0], dur:6, wait:false},
      {t:'note', text:'About 28 CE — "the fifteenth year of the reign of Tiberius Caesar" (Luke 3:1; the reckonings run from 26 to 29). The boy who ran up to the feeding trough that night in Bĕyth Leḥem is a man now, past thirty. The family scroll goes with him.'},
      {t:'read', ref:'LUKE 3:1-2'},
      {t:'cam', release:true},
      {t:'goal', text:'Go down to the Yardĕn, where the crowds are gathering', goto:'bank', r:3},
      {t:'cam', from:[-6.5,2.6,5.5], look:'yahuchanon', dur:2.5},
      {t:'read', ref:'MATTITHYAHU 3:1'},
      {t:'say', who:'yahuchanon', ref:'MATTITHYAHU 3:2'},
      {t:'choice', prompt:'You', options:[
        {text:'Take out the family scroll', reply:'Your hands find the place before your eyes do: the fifth of the seven words, in your father’s hand, and his father’s before him.'},
        {text:'Stand still and listen'} ]},
      {t:'read', ref:'MATTITHYAHU 3:3', who:'nabi'},
      {t:'fulfil', id:'y40-3'},
      {t:'cam', from:[-3.5,1.4,3.2], look:'yahuchanon', dur:2.5},
      {t:'read', ref:'MATTITHYAHU 3:4'},
      {t:'move', who:['c0','c1','c3','c4'], to:[[0.2,2.2],[0.8,-2],[-1.2,0.9],[-0.4,-1.1]], speed:1.4, wait:false},
      {t:'cam', from:[-12,5,10], look:[0,0,0], dur:3, wait:false},
      {t:'read', ref:'MATTITHYAHU 3:5-6'},
      {t:'cam', release:true},
      {t:'say', who:'crowds', ref:'LUKE 3:10'},
      {t:'say', who:'yahuchanon', ref:'LUKE 3:11', turn:false},
      {t:'witness', text:'The wind off the water is cold, and you have two garments. A man on the bank has none — give him one', items:['cold'], verb:'Give him your cloak', hold:1.0, reach:2.4},
      {t:'robe', who:'cold', color:0x8a7454},
      {t:'say', who:'taxmen', ref:'LUKE 3:12', turn:false},
      {t:'say', who:'yahuchanon', ref:'LUKE 3:13', turn:false},
      {t:'read', ref:'LUKE 3:14', voices:['soldiers','yahuchanon']},
      {t:'read', ref:'LUKE 3:15'},
      {t:'cam', from:[-4.5,2.2,4.5], look:'yahuchanon', dur:2.5},
      {t:'say', who:'yahuchanon', ref:'LUKE 3:16-17', turn:false},
      {t:'cam', release:true},
      {t:'read', ref:'LUKE 3:18'},
      {t:'choice', prompt:'You', options:[
        {text:'Go down into the water with the others', reply:'The Yardĕn is cold and brown with the earth of the hills. You go under, and come up into the light, among the others who are coming up confessing their sins.'},
        {text:'Stay on the bank and listen', reply:'You sit among the reeds. There is more here than you understand yet, and you mean to stay until you do.'} ]},
      {t:'end'}
    ]},

  /* ---------------- III.2 — THE IMMERSION ---------------- */
  { id:'immersion', title:'The Yardĕn', date:'in those days', place:'yarden', time:'day',
    player:{ at:'bank2', face:Math.PI/2, look:ADULT },
    actors:[
      Object.assign({id:'yahuchanon', at:'yahIn', face:-Math.PI/2},YAHUCHANON),
      Object.assign({id:'yahusha', at:'westRoad', face:Math.PI/2},YAHUSHA),
      ...some(9,4),
      {id:'old1', name:'An old man', at:[-4.6,2.8], face:-Math.PI/2, robe:0x6b5a44, cloth:0xe6e0cf, beard:0x6d6a66, kind:'oldman'},
      {id:'old2', name:'A widow', at:[-4.8,-3.6], face:-Math.PI/2, robe:0x3c3a44, cloth:0x2c2a30, kind:'woman'}
    ],
    things:[ {id:'dove', kind:'dove', at:[-9.5,-2.2], y:44, hidden:true} ],
    glows:[ {id:'open', at:[-9.5,40,-2.2], size:7, h:90, color:0xfff6dc, intensity:0, hidden:true} ],
    beats:[
      {t:'witness', text:'The bank at the ford is steep and slick with mud — give a hand to those coming up out of the water', items:['old1','old2'], verb:'Give a hand', hold:0.8, reach:2.4},
      {t:'move', who:['old1','old2'], to:[[-12,5.5],[-12.5,-7]], speed:1.2, wait:false},
      {t:'move', who:'yahusha', to:'jesusBank', speed:1.5, wait:false},
      {t:'cam', from:[-30,3.2,-12], look:[-8,1.4,-1.2], dur:0.1},
      {t:'cam', from:[-16,2.8,-4.4], look:[2.4,0.4,0.2], dur:9, wait:false},
      {t:'read', ref:'MATTITHYAHU 3:13'},
      {t:'move', who:'yahusha', to:'jesusBank', speed:1.5},
      {t:'cam', from:[-12.5,2.4,-3.2], look:'yahuchanon', dur:2},
      {t:'say', who:'yahuchanon', ref:'MATTITHYAHU 3:14', turn:false},
      {t:'face', who:'yahusha', to:'yahuchanon'},
      {t:'cam', on:'yahusha', shot:'back', toward:'yahuchanon', dur:1.8},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 3:15', turn:false},
      {t:'move', who:'yahusha', to:'jesusIn', speed:1.1},
      {t:'cam', from:[-14,4.5,-8], look:[-1,-0.4,-0.4], dur:2.5},
      {t:'wait', s:2.2},
      {t:'move', who:'yahusha', to:'jesusOut', speed:1.2},
      {t:'show', id:'open'},
      {t:'cam', from:[-18,2.8,5], look:[-9.5,4.2,-2.2], dur:2.5, wait:false},
      {t:'drift', id:'dove', to:[-9.5,2.7,-2.2], dur:5},
      {t:'read', ref:'MATTITHYAHU 3:16'},
      {t:'fulfil', id:'y11-1'},
      {t:'read', ref:'MATTITHYAHU 3:17', who:'voice'},
      {t:'hide', id:['open','dove']},
      {t:'cam', release:true},
      {t:'move', who:'yahusha', to:'wild', speed:1.6, wait:false},
      {t:'read', ref:'MARK 1:12'},
      {t:'choice', prompt:'You', options:[
        {text:'Watch Him until He is out of sight', reply:'He goes up into the bare hills, and you watch the place where you last saw Him long after there is nothing there to see.'},
        {text:'Ask the man beside you if he saw it too', reply:'He does not answer. He is still looking up.'} ]},
      {t:'end'}
    ]},

  /* ---------------- III.3 — THE FORTY DAYS ---------------- */
  { id:'forty', title:'The wilderness of Yahuḏah', date:'forty days', place:'wilderness', time:'dusk',
    player:{ at:[0,40], hidden:true },
    actors:[ Object.assign({id:'yahusha', at:'seat', face:0.4},YAHUSHA),
             Object.assign({at:[3.6,5.4], face:Math.PI+0.6, hidden:true},TRIER) ],
    beats:[
      {t:'cam', from:[-34,16,40], look:[0,1,0], dur:0.1},
      {t:'note', text:'What follows you did not see. No one did but He. It is shown as the Besorah tells it.'},
      {t:'cam', from:[-12,6,16], look:[0,1.2,0], dur:8, wait:false},
      {t:'read', ref:'MATTITHYAHU 4:1'},
      {t:'time', to:'night'}, {t:'wait', s:1.4}, {t:'time', to:'dawn'}, {t:'wait', s:1.2},
      {t:'time', to:'day'}, {t:'wait', s:1.2}, {t:'time', to:'dusk'}, {t:'wait', s:1.2}, {t:'time', to:'night'}, {t:'wait', s:1.2},
      {t:'time', to:'dawn'},
      {t:'read', ref:'MATTITHYAHU 4:2'},
      {t:'show', id:'trier'},
      {t:'face', who:'yahusha', to:'trier'},
      {t:'cam', from:[-4.6,1.8,8.4], look:[2.6,1,4], dur:3},
      {t:'say', who:'trier', ref:'MATTITHYAHU 4:3', turn:false},
      {t:'cam', on:'yahusha', shot:'back', toward:'trier', dur:1.8},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 4:4', turn:false},
      {t:'end'}
    ]},

  /* ---------------- III.4 — THE EDGE OF THE QODASH ---------------- */
  { id:'qodash', title:'Yahrushalayim', date:'the forty days', place:'yahrushalayim', time:'day',
    player:{ at:[-10,26], hidden:true },
    /* the wing of the Hĕḵal of Herodes' days, high over the court (the city's own mark) */
    actors:[ Object.assign({id:'yahusha', at:'pinnacle', y:'pinnacleY', face:0},YAHUSHA),
             Object.assign({at:['pinnacle',1.6,-0.7], y:'pinnacleY', face:-1.9},TRIER) ],
    beats:[
      {t:'cam', from:{rel:'yahusha',off:[16,-11,24]}, look:'yahusha', dur:0.1},
      {t:'read', ref:'MATTITHYAHU 4:5'},
      {t:'say', who:'devil', ref:'MATTITHYAHU 4:6', turn:false},
      {t:'face', who:'yahusha', to:'trier'},
      {t:'cam', on:'yahusha', shot:'back', toward:'trier', dur:1.8},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 4:7', turn:false},
      {t:'end'}
    ]},

  /* ---------------- III.5 — A VERY HIGH MOUNTAIN ---------------- */
  { id:'mountain', title:'A very high mountain', date:'the forty days', place:'mountain', time:'dusk',
    player:{ at:[0,60], hidden:true },
    actors:[ Object.assign({id:'yahusha', at:'summit', face:2.2},YAHUSHA),
             Object.assign({at:[2.6,-1.4], face:-1.0},TRIER) ],
    glows:[ {id:'a1', at:[3.6,2.6,2.2], size:1.8, color:0xfff6dc, intensity:0.5, pulse:true, hidden:true},
            {id:'a2', at:[-3.4,2.8,1.8], size:1.8, color:0xfff6dc, intensity:0, pulse:true, hidden:true},
            {id:'a3', at:[0.6,3.2,-3.6], size:1.8, color:0xfff6dc, intensity:0, pulse:true, hidden:true} ],
    beats:[
      {t:'cam', from:[-22,12,28], look:[0,0,0], dur:0.1},
      {t:'read', ref:'MATTITHYAHU 4:8'},
      {t:'show', id:[], kingdoms:true},
      {t:'cam', from:[-8,6,10], look:[140,-26,-120], dur:6},
      {t:'say', who:'devil', ref:'MATTITHYAHU 4:9', turn:false},
      {t:'face', who:'yahusha', to:'trier'},
      {t:'cam', on:'yahusha', shot:'back', toward:'trier', dur:1.8},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 4:10', turn:false},
      {t:'hide', id:'trier'},
      {t:'show', id:['a1','a2','a3'], kingdoms:false},
      {t:'time', to:'dawn'},
      {t:'read', ref:'MATTITHYAHU 4:11'},
      {t:'end'}
    ]},

  /* ---------------- III.6 — THE LAMB OF ALUAHIM ---------------- */
  { id:'lamb', title:'Bĕyth Anyah beyond the Yardĕn', date:'after the forty days', place:'yarden', time:'day',
    player:{ at:'bank', face:Math.PI/2, look:ADULT },
    actors:[
      Object.assign({id:'yahuchanon', at:'yahIn', face:-Math.PI/2},YAHUCHANON),
      {id:'k1', name:'Kohanim and Lĕwites', at:[-7.8,0.4], face:Math.PI/2, robe:0xe6e0cf, cloth:0xf2eee2, beard:0x6d6a66, sash:0x4a5a8a},
      {id:'k2', at:[-8.4,2.2], face:Math.PI/2, robe:0xd8d0bb, cloth:0xf2eee2, beard:0x2c241f, sash:0x4a5a8a},
      {id:'l1', at:[-8.2,-1.6], face:Math.PI/2, robe:0xcfc4aa, cloth:0xe6e0cf, beard:0x3a2a1e},
      {id:'andri', name:'Andri', at:[-11.5,5.5], face:Math.PI/2, robe:0x5a6a7a, cloth:0xd8ceb4, beard:0x3a2a1e, key:'Andri'},
      {id:'other', name:'Another taught one', at:[-12.6,6.4], face:Math.PI/2, robe:0x7a6a4a, cloth:0xcfc4aa},
      {id:'shimon', name:'Shim‛on', at:[-60,-30], face:Math.PI/2, robe:0x6e5238, cloth:0xb9ab8e, beard:0x3a2a1e, key:'Shim‛on Kĕpha', hidden:true},
      Object.assign({id:'yahusha', at:'westRoad', face:Math.PI/2, hidden:true},YAHUSHA),
      ...some(6,8)
    ],
    beats:[
      {t:'cam', from:[-15,3.2,9], look:[-4,1.4,0], dur:0.1},
      {t:'read', ref:'YAHUCHANON 1:19', who:'sent'},
      {t:'say', who:'yahuchanon', ref:'YAHUCHANON 1:20', turn:false},
      {t:'read', ref:'YAHUCHANON 1:21', voices:['sent','yahuchanon','sent','yahuchanon']},
      {t:'say', who:'sent', ref:'YAHUCHANON 1:22', turn:false},
      {t:'say', who:'yahuchanon', ref:'YAHUCHANON 1:23', turn:false},
      {t:'read', ref:'YAHUCHANON 1:24'},
      {t:'say', who:'sent', ref:'YAHUCHANON 1:25', turn:false},
      {t:'say', who:'yahuchanon', ref:'YAHUCHANON 1:26-27', turn:false},
      {t:'read', ref:'YAHUCHANON 1:28'},
      {t:'cam', release:true},
      {t:'move', who:['k1','k2','l1'], to:[[-40,-15],[-41,-17],[-39,-16.5]], speed:1.6, wait:false},
      {t:'title', text:'The next day', sub:'Bĕyth Anyah beyond the Yardĕn'},
      {t:'place', who:'yahuchanon', at:'edgeW', face:-Math.PI/2},
      {t:'show', id:'yahusha'},
      {t:'move', who:'yahusha', to:'lambWalk', speed:1.4, wait:false},
      {t:'cam', from:[-4.2,2.6,4.2], look:[-9,1.4,-6], dur:3},
      {t:'say', who:'yahuchanon', ref:'YAHUCHANON 1:29', turn:false},
      {t:'choice', prompt:'You', options:[
        {text:'Think of the lambs you carried to the fold, long ago', reply:'More than thirty years ago, on the night the mal’ak came, you carried three strayed lambs into the fold. You have not thought of it in years. You think of it now.'},
        {text:'Look at Him, and say nothing'} ]},
      {t:'say', who:'yahuchanon', ref:'YAHUCHANON 1:30-31', turn:false},
      {t:'say', who:'yahuchanon', ref:'YAHUCHANON 1:32-34', turn:false},
      {t:'move', who:'yahusha', to:'staying', speed:1.6, wait:false},
      {t:'title', text:'The following day', sub:'Bĕyth Anyah beyond the Yardĕn'},
      {t:'place', who:'yahusha', at:'westRoad', face:Math.PI/2},
      {t:'place', who:'yahuchanon', at:[-10.2,3.2], face:-2.2},
      {t:'place', who:'andri', at:[-11.2,4.6], face:-2.2},
      {t:'place', who:'other', at:[-9.4,4.8], face:-2.2},
      {t:'read', ref:'YAHUCHANON 1:35'},
      {t:'move', who:'yahusha', to:'passBy', speed:1.3, wait:false},
      {t:'cam', from:[-6,2.8,8], look:[-14,1.4,-6], dur:3},
      {t:'say', who:'yahuchanon', ref:'YAHUCHANON 1:36', turn:false},
      {t:'move', who:'yahusha', to:'followPt', speed:1.3, wait:false},
      {t:'read', ref:'YAHUCHANON 1:37'},
      {t:'cam', release:true},
      {t:'follow', who:['andri','other'], target:'yahusha'},
      {t:'goal', text:'Follow them', goto:'followMe', r:3.5},
      {t:'stop', who:['andri','other']},
      {t:'move', who:['andri','other'], to:[[-18.6,-11.2],[-17.8,-12.8]], speed:2},
      {t:'face', who:'yahusha', to:'andri'},
      {t:'face', who:'andri', to:'yahusha'}, {t:'face', who:'other', to:'yahusha'},
      {t:'cam', from:[-24.5,2.4,-9.5], look:[-18.4,1.5,-12.4], dur:2.5},
      {t:'read', ref:'YAHUCHANON 1:38', voices:['yahusha','taught','taught']},
      {t:'face', who:'yahusha', to:'andri'},
      {t:'cam', on:'yahusha', shot:'back', toward:'andri', dur:1.8},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 1:39', turn:false},
      {t:'choice', prompt:'You', options:[
        {text:'Go with them', reply:'No one sends you away. You walk behind the three of them up from the river, the scroll under your arm.'},
        {text:'Walk a little way behind', reply:'You keep a few paces back, as a stranger would. When they turn off the road, you turn too.'} ]},
      {t:'move', who:['yahusha','andri','other'], to:['staying',[-38.5,-22.5],[-39,-25.6]], speed:1.3, wait:false},
      {t:'read', ref:'YAHUCHANON 1:40'},
      {t:'show', id:'shimon'},
      {t:'place', who:'andri', at:[-35,-19]},
      {t:'move', who:'shimon', to:[-36,-21], speed:1.8, wait:false},
      {t:'cam', from:[-31,3,-20.5], look:[-39.5,1.4,-24.5], dur:2.5},
      {t:'say', who:'andri', ref:'YAHUCHANON 1:41', turn:false},
      {t:'face', who:'yahusha', to:'shimon'},
      {t:'face', who:'yahusha', to:'shimon'},
      {t:'cam', on:'yahusha', shot:'back', toward:'shimon', dur:1.8},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 1:42', turn:false},
      {t:'title', text:'The end of Act III', sub:'Next: Galil — “Follow Me” (Yahuchanon 1:43)'},
      {t:'end'}
    ]}
  ]
});
})();
