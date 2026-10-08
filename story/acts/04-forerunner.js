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
const YAHUCHANON={name:'Yahuchanon', dress:'camelhair', robe:0x8a6a42, cloth:null, beard:0x2a2019, sash:0x3e2a1a, skin:0x7a4e30, key:'Yahuchanon'};
const YAHUSHA={name:'Yahusha', holy:true, kind:'yahusha', key:'Yahusha'};
const YAHSHAYAHU={robe:0x4a3c33, cloth:0xb9ab8e, beard:0x6d6a66};
/* the taught ones as Act IV draws them: the same faces, the same voices */
const SHIMON={name:'Shim‛on Kĕpha', key:'Shim‛on Kĕpha', robe:0x6e5238, cloth:0xb9ab8e, beard:0x3a2a1e, skin:0x6e4524};
const PHILIP={name:'Philip', key:'Philip', robe:0x6a5a7a, cloth:0xd8ceb4, beard:0x2c241f, skin:0x7c5430};
const NETHANEL={name:'Nethanĕ’l', key:'Nethanĕ’l', robe:0x8a6a3a, cloth:0xcfc4aa, beard:0x3a2a1e, skin:0x643f1c};

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
    voice:{name:'A voice out of the shamayim', key:'(YAHUAH) HWHY', kind:'divine', glow:'shamayim'},
    trier:{name:'The trier', key:'the devil', kind:'dark', actor:'trier'},
    devil:{name:'The devil', key:'the devil', kind:'dark', actor:'trier'},
    sent:{name:'Those sent from Yahrushalayim', kind:'oldman', actor:'k1', actors:['k1','k2','l1']},
    taught:{name:'The two taught ones', kind:'man', actor:'andri', actors:['andri','other']},
    hisTaught:{name:'Taught ones of Yahuchanon', key:'two taught ones of Yahuchanon', kind:'man', actor:'jt1', actors:['jt1','jt2']},
    disciples:{name:'The taught ones', key:'the taught ones', kind:'crowd', actor:'kepha', actors:['kepha','andri','philip','nethanel','yahuchanonZ']},
    shomeronites:{name:'The Shomeronites', key:'the shomeronites', kind:'crowd', actor:'sh0', actors:['sh0','sh1','sh2','sh3','sh4','sh5','sh6','sh7']}
  },
  scenes:[

  /* ---------------- III.1 — A VOICE IN THE WILDERNESS ---------------- */
  { id:'voice', title:'The Yardĕn', date:'c. 28 CE', place:'yarden', time:'day',
    player:{ at:'arrive', face:Math.PI/2.4, look:ADULT },
    crowds:[ {id:'yardencrowd', n:200, area:[-44,-34,-8,36], look:'yahIn', minY:-0.3, dy:12} ],
    actors:[
      Object.assign({id:'yahuchanon', at:'yahIn', face:-Math.PI/2},YAHUCHANON),
      ...crowd,
      {id:'cold', name:'A man with no cloak', at:[-12.6,8.4], face:Math.PI/2, robe:0xd9d1bc, cloth:0xcfc4aa, beard:0x3a2a1e},
      {id:'taxc', name:'A tax collector', at:[-13.5,-7.5], face:Math.PI/2, robe:0x3f4f6a, cloth:0xd8ceb4, sash:0xb08d3c},
      {id:'taxc2', at:[-14.6,-8.6], face:Math.PI/2, robe:0x4a4460, cloth:0xcfc4aa, beard:0x2c241f},
      {id:'soldier', name:'A soldier', dress:'herodian', at:[-16,5.5], face:Math.PI/2, robe:0x8a2a22, cloth:0x9a8a70, sash:0x6e5238},
      {id:'soldier2', dress:'herodian', at:[-17,6.8], face:Math.PI/2, robe:0x7a2620, cloth:0x9a8a70, sash:0x6e5238, beard:0x2c241f}
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
    crowds:[ {id:'yardencrowd', n:220, area:[-44,-34,-8,36], look:'yahIn', minY:-0.3, dy:12} ],
    actors:[
      Object.assign({id:'yahuchanon', at:'yahIn', face:-Math.PI/2},YAHUCHANON),
      Object.assign({id:'yahusha', at:'westRoad', face:Math.PI/2},YAHUSHA),
      ...some(9,4),
      {id:'old1', name:'An old man', at:[-4.6,2.8], face:-Math.PI/2, robe:0x6b5a44, cloth:0xe6e0cf, beard:0x6d6a66, kind:'oldman'},
      {id:'old2', name:'A widow', at:[-4.8,-3.6], face:-Math.PI/2, robe:0x3c3a44, cloth:0x2c2a30, kind:'woman'}
    ],
    things:[ {id:'dove', kind:'dove', at:[-9.5,-2.2], y:44, hidden:true} ],
    glows:[ {id:'open', at:[-9.5,40,-2.2], size:7, h:90, color:0xfff6dc, intensity:0, hidden:true},
            /* the opened shamayim over Him, from which the voice comes (3:17) */
            {id:'shamayim', at:[-9.5,30,-2.2], size:16, color:0xfffaea, intensity:0, pulse:true, hidden:true} ],
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
      /* "and see, the shamayim were opened": the eye goes up to them, and comes down with the dove */
      {t:'show', id:'open'},
      {t:'cam', from:[-3.2,1.6,2.6], look:[-9.5,34,-2.2], dur:2.5},     /* from behind Him, on the water */
      {t:'show', id:'dove'},
      {t:'drift', id:'dove', to:[-9.5,2.7,-2.2], dur:8, wait:false},
      {t:'cam', from:[-3.6,2.2,2.4], look:[-9.5,3.2,-2.2], dur:8, wait:false},
      {t:'read', ref:'MATTITHYAHU 3:16'},
      {t:'fulfil', id:'y11-1'},
      {t:'show', id:'shamayim'},
      {t:'cam', from:[-3,1.8,2.8], look:[-9.5,9,-2.2], dur:2.5, wait:false},
      {t:'read', ref:'MATTITHYAHU 3:17', who:'voice'},
      {t:'hide', id:['open','dove','shamayim']},
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
            {id:'a2', at:[-3.4,2.8,1.8], size:1.8, color:0xfff6dc, intensity:0.5, pulse:true, hidden:true},
            {id:'a3', at:[0.6,3.2,-3.6], size:1.8, color:0xfff6dc, intensity:0.5, pulse:true, hidden:true} ],
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
      /* "and see, mal'akim came and attended Him": from behind and above Him, the lights about Him */
      {t:'cam', from:[-5.6,6.4,4.4], look:[0.6,1.4,-0.6], dur:3},
      {t:'read', ref:'MATTITHYAHU 4:11'},
      {t:'end'}
    ]},

  /* ---------------- III.6 — THE LAMB OF ALUAHIM ---------------- */
  { id:'lamb', title:'Bĕyth Anyah beyond the Yardĕn', date:'after the forty days', place:'yarden', time:'day',
    player:{ at:'bank', face:Math.PI/2, look:ADULT },
    actors:[
      Object.assign({id:'yahuchanon', at:'yahIn', face:-Math.PI/2},YAHUCHANON),
      {id:'k1', name:'Kohanim and Lĕwites', dress:'kohen', at:[-7.8,0.4], face:Math.PI/2, robe:0xe6e0cf, cloth:0xf2eee2, beard:0x6d6a66, sash:0x4a5a8a},
      {id:'k2', dress:'kohen', at:[-8.4,2.2], face:Math.PI/2, robe:0xd8d0bb, cloth:0xf2eee2, beard:0x2c241f, sash:0x4a5a8a},
      {id:'l1', dress:'levite', at:[-8.2,-1.6], face:Math.PI/2, robe:0xcfc4aa, cloth:0xe6e0cf, beard:0x3a2a1e},
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
      {t:'end'}
    ]},

  /* ---------------- III.7 — PHILIP, AND NETHANĔ'L UNDER THE FIG TREE ---------------- */
  { id:'figtree', title:'Bĕyth Anyah beyond the Yardĕn', date:'the following day', place:'yarden', time:'day',
    player:{ at:[-38.6,-19.4], face:Math.PI, look:ADULT },
    actors:[
      Object.assign({id:'yahusha', at:[-37.4,-23.6], face:Math.PI*0.75},YAHUSHA),
      Object.assign({id:'kepha'},SHIMON,{at:[-39.4,-24.6], face:Math.PI*0.6}),
      {id:'andri', name:'Andri', key:'Andri', at:[-36.2,-25.4], face:-Math.PI*0.6, robe:0x5a6a7a, cloth:0xd8ceb4, beard:0x3a2a1e},
      Object.assign({id:'philip', at:[-34.2,-20.6], face:-Math.PI*0.75},PHILIP),
      Object.assign({id:'nethanel', at:'figSeat', face:-Math.PI*0.8, sit:true},NETHANEL)
    ],
    beats:[
      {t:'cam', from:[-41.6,3,-17.6], look:[-35.6,1.4,-23], dur:0.1},
      {t:'face', who:'yahusha', to:'philip'},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 1:43', turn:false},
      {t:'read', ref:'YAHUCHANON 1:44'},
      {t:'move', who:'philip', to:[-28.6,-31.6], speed:1.6, wait:false},
      {t:'goal', text:'Go with Philip to the fig tree', goto:[-28.4,-30.2], r:3},
      {t:'face', who:'philip', to:'nethanel'},
      {t:'cam', from:[-26.2,1.9,-29.6], look:[-29.4,1.0,-32.6], dur:2},
      {t:'say', who:'philip', ref:'YAHUCHANON 1:45', turn:false},
      {t:'read', ref:'YAHUCHANON 1:46', voices:['nethanel','philip']},
      {t:'stand', who:'nethanel'},
      {t:'move', who:['nethanel','philip'], to:[[-35.2,-25.6],[-34,-24.8]], speed:1.3},
      {t:'face', who:'yahusha', to:'nethanel'},
      {t:'cam', on:'yahusha', shot:'back', toward:'nethanel', dur:1.8},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 1:47', turn:false},
      {t:'read', ref:'YAHUCHANON 1:48', voices:['nethanel','yahusha']},
      {t:'say', who:'nethanel', ref:'YAHUCHANON 1:49', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 1:50', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 1:51', turn:false},
      {t:'cam', release:true},
      {t:'choice', prompt:'You', options:[
        {text:'Look back at the fig tree', reply:'Nobody could have seen him under it from the road. You looked yourself, and you could not.'},
        {text:'Ask Philip how he knew', reply:'“I didn’t,” he says. “I only said, come and see.”'} ]},
      {t:'end'}
    ]},

  /* ---------------- III.8 — NAḴDIMON BY NIGHT ---------------- */
  { id:'naqdimon', title:'Yahrushalayim', date:'at the Pesach, by night', place:'yahrushalayim', time:'night',
    player:{ at:[11.2,26], face:Math.PI*0.25, look:ADULT },
    actors:[
      Object.assign({id:'yahusha', at:[13.4,29.6], face:Math.PI/2, sit:true},YAHUSHA),
      {id:'naq', name:'Naḵdimon', key:'Naḵdimon', dress:'scribe', at:[19.4,34.6], face:-Math.PI*0.75, robe:0x3a3a5a, cloth:0xe8e2d2, beard:0x6d6a66, sash:0xb08d3c, kind:'oldman'},
      Object.assign({id:'kepha'},SHIMON,{at:[10.6,32.6], face:Math.PI/2}),
      {id:'andri', name:'Andri', key:'Andri', at:[10.4,28.4], face:Math.PI/2, robe:0x5a6a7a, cloth:0xd8ceb4, beard:0x3a2a1e}
    ],
    things:[ {id:'lampStand', kind:'box', at:[14.9,30.9], w:0.3, h:0.8, d:0.3, color:0x6e5238} ],
    glows:[ {id:'lampLow', at:[14.9,0.98,30.9], size:0.8, color:0xffb060, intensity:0.6},
            {id:'lampHigh', at:[14.9,1.0,30.9], size:1.4, color:0xffc070, intensity:1.6, hidden:true} ],
    beats:[
      {t:'lie', who:['kepha','andri']},
      {t:'cam', from:[9.6,3.2,24.4], look:[15,1,31], dur:0.1},
      {t:'read', ref:'YAHUCHANON 3:1'},
      {t:'move', who:'naq', to:[16.4,30.2], speed:1.1},
      {t:'face', who:'naq', to:'yahusha'}, {t:'sit', who:'naq'},
      {t:'cam', on:'yahusha', shot:'back', toward:'naq', dur:1.8},
      {t:'say', who:'naq', ref:'YAHUCHANON 3:2', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 3:3', turn:false},
      {t:'say', who:'naq', ref:'YAHUCHANON 3:4', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 3:5', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 3:6', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 3:7', turn:false},
      {t:'weather', wind:[2.2,0.8]},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 3:8', turn:false},
      {t:'weather', wind:[0.6,0.2]},
      {t:'say', who:'naq', ref:'YAHUCHANON 3:9', turn:false},
      {t:'cam', release:true},
      {t:'witness', text:'The lamp is burning low — trim the wick', items:['lampStand'], verb:'Trim the lamp', hold:1, reach:2.4},
      {t:'hide', id:'lampLow'}, {t:'show', id:'lampHigh'},
      {t:'cam', on:'yahusha', shot:'back', toward:'naq', side:-1, dur:1.8},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 3:10', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 3:11', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 3:12', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 3:13', turn:false},
      {t:'note', text:'In the wilderness, when the people were bitten by serpents, Mosheh made a serpent of bronze and set it on a pole, and whoever looked at it lived (Bemidbar 21:8-9).'},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 3:14', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 3:15', turn:false},
      {t:'cam', from:[12,4.4,25.6], look:[15,1,30.6], dur:3},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 3:16', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 3:17', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 3:18', turn:false},
      {t:'cam', on:'yahusha', shot:'back', toward:'naq', dur:1.8},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 3:19', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 3:20', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 3:21', turn:false},
      {t:'cam', release:true},
      {t:'choice', prompt:'You', options:[
        {text:'Watch Naḵdimon go', reply:'He pulls his mantle up over his head before he steps out of the lamplight. He does not hurry.'},
        {text:'Look at the lamp', reply:'You trimmed it once tonight. It is still burning.'} ]},
      {t:'end'}
    ]},

  /* ---------------- III.9 — HE MUST INCREASE ---------------- */
  { id:'increase', title:'Ayin near Salim', date:'in the land of Yahuḏah', place:'yarden', time:'day',
    player:{ at:'bank', face:Math.PI/2, look:ADULT },
    actors:[
      Object.assign({id:'yahuchanon', at:'yahIn', face:-Math.PI/2},YAHUCHANON),
      {id:'jt1', name:'A taught one of Yahuchanon', at:[-7.8,-1.4], face:Math.PI/2, robe:0x7b5a3a, cloth:0x2a2019, beard:0x2a2019},
      {id:'jt2', at:[-8.6,0.6], face:Math.PI/2, robe:0x6e5238, cloth:0x2a2019, beard:0x3a2a1e},
      {id:'yahudi', name:'A Yahuḏite', dress:'scribe', at:[-16,-6], face:Math.PI/2, robe:0xcfc4aa, cloth:0x4a4a5a, beard:0x6d6a66},
      ...some(6,2)
    ],
    beats:[
      {t:'cam', from:[-15,3.2,9], look:[-2,1.2,0], dur:0.1},
      {t:'read', ref:'YAHUCHANON 3:22'},
      {t:'read', ref:'YAHUCHANON 3:23'},
      {t:'read', ref:'YAHUCHANON 3:24'},
      {t:'note', text:'Herodes Antipas, tetrarch of Galil and Perea, would put Yahuchanon in chains in his fortress of Machaerus, above the Salt Sea, because he had said it was not right for him to have his brother’s wife (Mark 6:17-18).'},
      {t:'move', who:'yahudi', to:[-9.6,-3], speed:1.4},
      {t:'face', who:'jt1', to:'yahudi'}, {t:'face', who:'jt2', to:'yahudi'},
      {t:'cam', from:[-12.6,2.2,2.4], look:[-8.8,1.4,-1.6], dur:2},
      {t:'read', ref:'YAHUCHANON 3:25'},
      {t:'move', who:['jt1','jt2'], to:[[-1.6,-1.2],[-1.8,1.4]], speed:1.4},
      {t:'move', who:'yahuchanon', to:'yahBank', speed:1},
      {t:'move', who:'yahuchanon', to:[0.6,0.2], speed:1},
      {t:'face', who:'yahuchanon', to:'jt1'}, {t:'face', who:'jt1', to:'yahuchanon'}, {t:'face', who:'jt2', to:'yahuchanon'},
      {t:'cam', from:[-4.6,2.1,2.8], look:[0.6,1.5,0.2], dur:2},
      {t:'say', who:'hisTaught', ref:'YAHUCHANON 3:26', turn:false},
      {t:'say', who:'yahuchanon', ref:'YAHUCHANON 3:27', turn:false},
      {t:'say', who:'yahuchanon', ref:'YAHUCHANON 3:28', turn:false},
      {t:'say', who:'yahuchanon', ref:'YAHUCHANON 3:29', turn:false},
      {t:'say', who:'yahuchanon', ref:'YAHUCHANON 3:30', turn:false},
      {t:'cam', release:true},
      {t:'choice', prompt:'You', options:[
        {text:'Think of the voice in the wilderness', reply:'He said he was only a voice. You have heard it now for a long time, and it has never once spoken of itself.'},
        {text:'Look at the water', reply:'The river runs on down to the Salt Sea, as it always has. The people keep coming down to it.'} ]},
      {t:'end'}
    ]},

  /* ---------------- III.10 — THE WOMAN AT YA‛AQOḆ'S FOUNTAIN ---------------- */
  { id:'well', title:'Sheḵem in Shomeron', date:'about the sixth hour', place:'shekem', time:'day',
    player:{ at:[-6.6,-5.6], face:Math.PI*0.3, look:ADULT },
    actors:[
      Object.assign({id:'yahusha', at:[-12,-9.6], face:Math.PI*0.3},YAHUSHA),
      Object.assign({id:'kepha'},SHIMON,{at:[-13.6,-10.8], face:Math.PI*0.3}),
      {id:'andri', name:'Andri', key:'Andri', at:[-14,-8.6], face:Math.PI*0.3, robe:0x5a6a7a, cloth:0xd8ceb4, beard:0x3a2a1e},
      Object.assign({id:'philip', at:[-15.4,-10.4], face:Math.PI*0.3},PHILIP),
      Object.assign({id:'nethanel', at:[-15.6,-8.2], face:Math.PI*0.3},NETHANEL),
      {id:'yahuchanonZ', name:'Yahuchanon', key:'Yahuchanon son of Zaḇdai', at:[-12.8,-12.2], face:Math.PI*0.3, robe:0x4a5a3a, cloth:0xe6e0cf, skin:0x855a33},
      {id:'wom', name:'A woman of Shomeron', key:'the woman of Shomeron', kind:'woman', at:[22,9], face:-Math.PI*0.7, robe:0x6a4a3a, cloth:0x8a5a4a, skin:0x7c5430, hidden:true},
      ...[0,1,2,3,4,5,6,7].map(k=>({id:'sh'+k, name:k===0?'A man of Sheḵem':undefined, at:[16.6+(k%3)*1.4,11+Math.floor(k/3)*1.6], face:-Math.PI*0.7,
        robe:[0x7c6a52,0x5f6a52,0x8e6f4c,0x6b5a44,0x74604a,0x5c5040,0x8a7a60,0x6e5a70][k], cloth:[0xcfc4aa,0xd8ceb4,0xb9ab8e,0xe6e0cf][k%4],
        beard:k%3===1?null:[0x2c241f,0x3a2a1e,0x6d6a66][k%3], kind:k%3===1?'woman':'man', hidden:true}))
    ],
    things:[ {id:'jug', kind:'jar', at:[1.2,1.2], hidden:true} ],
    beats:[
      {t:'cam', from:[-20,7,-22], look:[0,1,0], dur:0.1},
      {t:'read', ref:'YAHUCHANON 4:1'},
      {t:'read', ref:'YAHUCHANON 4:2'},
      {t:'read', ref:'YAHUCHANON 4:3'},
      {t:'read', ref:'YAHUCHANON 4:4'},
      {t:'move', who:['yahusha','kepha','andri','philip','nethanel','yahuchanonZ'], to:[[-1.6,-0.6],[-3.4,-2.4],[-4,-0.2],[-5.2,-2.8],[-5.6,-0.8],[-3,-4]], speed:1.3},
      {t:'read', ref:'YAHUCHANON 4:5'},
      {t:'face', who:'yahusha', to:[2,1.2]}, {t:'sit', who:'yahusha'},
      {t:'note', text:'Ya‛aqoḇ’s fountain is a well cut deep into the rock at the foot of Mount Gerizim; it is still drawn from today. The sixth hour is about noon — the heat of the day, when no one comes to draw water.'},
      {t:'read', ref:'YAHUCHANON 4:6'},
      {t:'move', who:['kepha','andri','philip','nethanel','yahuchanonZ'], to:[[20,8],[20.6,9.6],[21.4,7.4],[22,9],[19.6,10.4]], speed:1.5, wait:false},
      {t:'show', id:'wom'},
      {t:'move', who:'wom', to:[1.6,1.4], speed:1.2},
      {t:'face', who:'wom', to:'yahusha'},
      {t:'cam', on:'yahusha', shot:'back', toward:'wom', dur:1.8},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 4:7', turn:false},
      {t:'read', ref:'YAHUCHANON 4:8'},
      {t:'hide', id:['kepha','andri','philip','nethanel','yahuchanonZ']},
      {t:'say', who:'wom', ref:'YAHUCHANON 4:9', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 4:10', turn:false},
      {t:'say', who:'wom', ref:'YAHUCHANON 4:11', turn:false},
      {t:'say', who:'wom', ref:'YAHUCHANON 4:12', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 4:13', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 4:14', turn:false},
      {t:'say', who:'wom', ref:'YAHUCHANON 4:15', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 4:16', turn:false},
      {t:'read', ref:'YAHUCHANON 4:17', voices:['wom','yahusha']},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 4:18', turn:false},
      {t:'say', who:'wom', ref:'YAHUCHANON 4:19', turn:false},
      {t:'cam', from:[-3.8,2.2,-4.4], look:'gerizim', dur:2.5},
      {t:'say', who:'wom', ref:'YAHUCHANON 4:20', turn:false},
      {t:'cam', on:'yahusha', shot:'back', toward:'wom', side:-1, dur:1.8},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 4:21', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 4:22', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 4:23', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 4:24', turn:false},
      {t:'say', who:'wom', ref:'YAHUCHANON 4:25', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 4:26', turn:false},
      {t:'show', id:['kepha','andri','philip','nethanel','yahuchanonZ']},
      {t:'move', who:['kepha','andri','philip','nethanel','yahuchanonZ'], to:[[-3.4,-2.4],[-4,-0.2],[-5.2,-2.8],[-5.6,-0.8],[-3,-4]], speed:1.6},
      {t:'cam', from:[6.4,2.4,-4], look:[-3.4,1.3,-1.8], dur:2},
      {t:'read', ref:'YAHUCHANON 4:27', voices:['narrator','narrator']},     /* what no one said, the telling says */
      {t:'show', id:'jug'},
      {t:'move', who:'wom', to:[20.6,9.6], speed:1.6, wait:false},
      {t:'read', ref:'YAHUCHANON 4:28'},
      {t:'show', id:['sh0','sh1','sh2','sh3','sh4','sh5','sh6','sh7']},
      {t:'cam', from:[12.6,3,2.4], look:[21,1.4,10.4], dur:2.5},
      {t:'say', who:'wom', ref:'YAHUCHANON 4:29', turn:false},
      {t:'read', ref:'YAHUCHANON 4:30'},
      {t:'move', who:['sh0','sh1','sh2','sh3','sh4','sh5','sh6','sh7'], to:[[11,5],[11.6,6.6],[12.4,4.6],[12.8,6.2],[13.6,5],[13.8,6.8],[14.6,5.6],[15,7.2]], speed:1.3, wait:false},
      {t:'cam', from:[-6.8,2.2,-3.4], look:[-3.4,1.3,-1.4], dur:2},
      {t:'say', who:'disciples', ref:'YAHUCHANON 4:31', turn:false},
      {t:'face', who:'yahusha', to:'kepha'},
      {t:'cam', on:'yahusha', shot:'back', toward:'kepha', dur:1.8},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 4:32', turn:false},
      {t:'say', who:'disciples', ref:'YAHUCHANON 4:33', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 4:34', turn:false},
      {t:'stand', who:'yahusha'}, {t:'face', who:'yahusha', to:'sh3'},
      {t:'cam', on:'yahusha', shot:'back', toward:'sh3', dur:2},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 4:35', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 4:36', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 4:37', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 4:38', turn:false},
      {t:'cam', release:true},
      {t:'witness', text:'Go out on the road to the people of Sheḵem and bring them to Him', items:['sh0','sh2','sh4'], verb:'Greet them', hold:0.5, reach:2.4},
      {t:'move', who:['sh0','sh1','sh2','sh3','sh4','sh5','sh6','sh7'], to:[[2.6,-1.2],[3.4,0.6],[2.8,2.6],[1,3.4],[-0.6,3.4],[4.4,-2.6],[4.6,2],[3.6,4.2]], speed:1.4},
      {t:'read', ref:'YAHUCHANON 4:39', voices:['wom']},
      {t:'read', ref:'YAHUCHANON 4:40'},
      {t:'read', ref:'YAHUCHANON 4:41'},
      {t:'cam', from:[-5.2,2.3,-3.6], look:[2.6,1.4,1.4], dur:2},
      {t:'say', who:'shomeronites', ref:'YAHUCHANON 4:42', turn:false},
      {t:'cam', release:true},
      {t:'choice', prompt:'You', options:[
        {text:'Look at the jug she left by the well', reply:'She came out at noon so that nobody would see her. She went back into the town to tell everybody.'},
        {text:'Look at the fields', reply:'White for harvest. Coming through the wheat on the road, more of them, and more.'} ]},
      {t:'title', text:'The end of Act III', sub:'Next: Galil — Qanah, “the beginning of the signs” (Yahuchanon 2:11)'},
      {t:'end'}
    ]}
  ]
});
})();
