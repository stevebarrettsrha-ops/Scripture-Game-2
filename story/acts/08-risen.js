/* ACT VII — THE RISING. The design document: "Resurrection. The empty tomb; the road to Emmaus;
   the appearances to the disciples; the great commission; the ascension."

   THE WITNESS carries the spices to the garden with the women at dawn and is there when the
   stone is rolled back; runs after Kĕpha and Yahuchanon and stoops at the door of the tomb;
   stands at the gate of the kohen gadol while the watch is paid; walks the road to Amma’us
   behind the two and lights the lamp in the house; hands Him the broiled fish and the honeycomb
   in the upper room; is in the boat on the Sea of Kinnereth and carries the catch up to the fire;
   and stands with the eleven on the Mount of Olives. He never speaks in a named mouth, and
   nothing he does changes what the Besorah says happened.

   THE ORDER, as the four accounts are laid side by side: the women at the tomb at dawn — the
   earthquake, the mal’ak who rolled the stone back and sat on it, the watch like dead men
   (Mark 16:1-3; Mattithyahu 28:2-8); Miryam from Maḡdala runs to Kĕpha (Yahuchanon 20:2), and
   He meets the other women on the road (Mattithyahu 28:9-10); the watch paid (28:11-15); the
   women's report to the eleven (Luke 24:9-11); Kĕpha and Yahuchanon at the tomb, and Miryam in
   the garden (Yahuchanon 20:3-18); the road to Amma’us (Luke 24:13-33); that evening in the
   upper room (Luke 24:34-49; Yahuchanon 20:21-25); eight days after, T’oma (20:26-31); the
   shore of the Sea of Kinnereth (21); the mountain in Galil (Mattithyahu 28:16-20); the Mount of
   Olives and the cloud (Acts 1:3-12; Luke 24:50-52); the upper room, waiting (Acts 1:13-14;
   Luke 24:53).

   REVERENCE. Yahusha's face is never shown, risen as before: the camera is behind Him, or far
   off, or on those who see Him. A mal’ak is light, never a figure — the one on the stone, the
   two in the tomb, the two men in white. He is taken up in a cloud of light. */
(function(){
const ADULT={robe:0x8a7454, cloth:0xd8cfb8, beard:0x3a2a1e, skin:0x86573a};
const YAHUSHA={name:'Yahusha', holy:true, kind:'yahusha', key:'Yahusha'};
const T12={
  kepha:{name:'Shim‛on Kĕpha', key:'Shim‛on Kĕpha', robe:0x6e5238, cloth:0xb9ab8e, beard:0x3a2a1e, skin:0x6e4524},
  andri:{name:'Andri', key:'Andri', robe:0x5a6a7a, cloth:0xd8ceb4, beard:0x3a2a1e, skin:0x704a27},
  yaaqob:{name:'Ya‛aqoḇ', key:'Ya‛aqoḇ son of Zaḇdai', robe:0x7a3a2a, cloth:0xcfc4aa, beard:0x2c241f, skin:0x7a4e29},
  yahuchanon:{name:'Yahuchanon', key:'Yahuchanon son of Zaḇdai', robe:0x4a5a3a, cloth:0xe6e0cf, skin:0x855a33},
  philip:{name:'Philip', key:'Philip', robe:0x6a5a7a, cloth:0xd8ceb4, beard:0x2c241f, skin:0x7c5430},
  bartholomi:{name:'Bartholomi', key:'Bartholomi', robe:0x6a5a44, cloth:0xd8ceb4, beard:0x2c241f, skin:0x7a4e29},
  mattithyahu:{name:'Mattithyahu', key:'Mattithyahu', robe:0x4a5a6a, cloth:0xe6e0cf, beard:0x2c241f, skin:0x855a33},
  toma:{name:'T’oma', key:'T’oma', robe:0x7a6a4a, cloth:0xcfc4aa, beard:0x3a2a1e, skin:0x6e4524},
  yaaqobA:{name:'Ya‛aqoḇ the son of Alphai', key:'Ya‛aqoḇ the son of Alphai', robe:0x5a4a3a, cloth:0xd8ceb4, beard:0x1e1814, skin:0x704a27},
  shimonZ:{name:'Shim‛on the Ardent One', key:'Shim‛on the Ardent One', robe:0x7a3a2a, cloth:0xb9ab8e, beard:0x2c241f, skin:0x5c3a1f},
  yahudahY:{name:'Yahuḏah the son of Ya‛aqoḇ', key:'Yahuḏah the son of Ya‛aqoḇ', robe:0x5f6a52, cloth:0xe6e0cf, beard:0x3a2a1e, skin:0x7c5430},
  /* "Nethanĕ’l of Qanah in Galil" (Yahuchanon 21:2), as he was first seen under the fig tree */
  nethanel:{name:'Nethanĕ’l', key:'Nethanĕ’l', robe:0x8a6a3a, cloth:0xcfc4aa, beard:0x3a2a1e, skin:0x643f1c}
};
const T=(id,at,extra)=>Object.assign({id,at},T12[id],extra||{});
const ELEVEN=['kepha','andri','yaaqob','yahuchanon','philip','bartholomi','mattithyahu','toma','yaaqobA','shimonZ','yahudahY'];
const MIRYAM={name:'Miryam', key:'Miryam', robe:0x3f5a8a, cloth:0xe8e2d2, skin:0x8e5c3c, kind:'woman'};
const MAGDALA={name:'Miryam from Maḡdala', key:'Miryam from Magdala', kind:'woman', robe:0x6a3a4a, cloth:0x3c3a44, skin:0x7a4e30};
const OTHER={name:'The other Miryam', key:'Miryam the wife of Qlophah', kind:'woman', robe:0x5a5a3a, cloth:0x2e2a30, skin:0x7c5430};
const SHELOMAH={name:'Shelomah', key:'Shelomah', kind:'woman', robe:0x7a5a3a, cloth:0xe0d8c4, skin:0x845634};
const YOHANAH={name:'Yoḥanah', key:'Yohanah', kind:'woman', robe:0x5a3a6a, cloth:0xe8e2d2, skin:0x8a5a36, sash:0xb08d3c};
const LEGION=(id,at,face,extra)=>Object.assign({id,at,face,folk:'roman',dress:'legionary'},extra||{});
/* THE UPPER ROOM (story/settings.js, S.upperroom): the places about the low table, as at the supper */
const SEATS=[[14.4,28.7,0],[15.6,28.7,0],[16.8,28.7,0],[18,28.7,0],[19.2,28.7,0],
             [14.6,31.3,Math.PI],[15.8,31.3,Math.PI],[17,31.3,Math.PI],[18.2,31.3,Math.PI],[19.4,31.3,Math.PI],
             [13.6,30,Math.PI/2],[20.4,29.4,-Math.PI/2],[20.4,30.6,-Math.PI/2]];
/* He stands in the midst of them, on the south side of the table, facing it */
const ROOM=(ids,o)=>ids.map((id,k)=>T(id,[SEATS[k][0],SEATS[k][1]],Object.assign({face:SEATS[k][2], sit:true},o||{})));
const MIDST=[17,32.85];
const OVER=[17.2,5.15,33.0];                                                    /* just over and behind His head, under the roof-beams */
const F=2.85;                                                                 /* the upper room's floor */
/* THE LAKE'S FISHING BOAT (story/world.js, bigBoat), out on the water two hundred cubits from land */
const BX=52, BOAT_FLOOR=-0.52;
const BOAT_SEATS=(ids,seats)=>ids.map((id,k)=>T(id,[BX+seats[k][0],seats[k][1]],{face:-Math.PI/2, y:BOAT_FLOOR, sit:true}));
const ids=list=>list.map(a=>a.id);

STORY.act({
  id:'risen', n:8, num:'VII', title:'The Rising',
  sub:'The empty tomb · the road to Amma’us · the ascension',
  cast:{
    yahusha:Object.assign({},YAHUSHA),
    malak:{name:'A mal’ak of (YAHUAH) HWHY', kind:'angel', glow:'malak'},
    women:{name:'The women', key:'the women at the tomb', kind:'woman', actor:'qlophah', actors:['magdala','qlophah','shelomah']},
    kohanim:{name:'The chief kohanim and the elders', key:'chief kohanim and elders', kind:'oldman', actor:'kg1', actors:['kg1','kg2','el1','el2']},
    malakim:{name:'Two mal’akim in white', key:'two malakim in the tomb', kind:'angel', glow:'m1'},
    two:{name:'Qleophas and his companion', key:'the two on the road to Ammaus', kind:'man', actor:'qleophas', actors:['qleophas','friend']},
    eleven:{name:'The eleven and those with them', key:'the eleven', kind:'crowd', actor:'andri', actors:ELEVEN},
    taught:{name:'The taught ones', kind:'crowd', actor:'andri', actors:ELEVEN},
    whiteMen:{name:'Two men in white', key:'two men in white', kind:'angel', glow:'w1'}
  },
  scenes:[

  /* ---------------- VII.1 — THE FIRST DAY OF THE WEEK, AT DAWN ---------------- */
  { id:'dawn', title:'The garden', date:'the first day of the week, at dawn', place:'golgotha', time:'dawn',
    player:{ at:['roadBend',-1.2,20], face:Math.PI, look:ADULT },
    actors:[
      Object.assign({id:'magdala', at:['roadBend',1.4,21.4], face:Math.PI},MAGDALA),
      Object.assign({id:'qlophah', at:['roadBend',0.2,22.6], face:Math.PI},OTHER),
      Object.assign({id:'shelomah', at:['roadBend',-0.8,23.2], face:Math.PI},SHELOMAH),
      LEGION('guard1',['tombFront',0,-2.4],Math.PI/2), LEGION('guard2',['tombFront',0,2.4],Math.PI/2),
      Object.assign({id:'yahusha', at:['roadBend',1,10], face:Math.PI, hidden:true},YAHUSHA)
    ],
    things:[ {id:'stone', kind:'roundStone', at:'stoneShut', face:0, r:1.25},
             {id:'spices', kind:'jar', at:['roadBend',0.6,18.4]} ],
    glows:[ {id:'malak', at:['stone',0,0], dy:2.6, size:3.6, color:0xfff6dc, intensity:2.2, pulse:true, hidden:true},
            /* "his appearance was like lightning" (28:3) */
            {id:'flash', at:['tombOut',0,-1.4], dy:2.6, size:24, color:0xffffff, intensity:0, hidden:true} ],
    beats:[
      {t:'cam', from:['roadBend',7,28], fdy:3.4, look:['roadBend',0,20], dur:0.1},
      {t:'read', ref:'MARK 16:1'},
      {t:'read', ref:'MARK 16:2'},
      {t:'cam', release:true},
      {t:'follow', who:['magdala','qlophah','shelomah'], target:'player'},
      {t:'witness', text:'Carry the spices with the women to the garden', items:['spices'], verb:'Take up the spices', hold:0.6, deliver:'garden', r:3, carryText:'Carry them to the garden, to the tomb'},
      {t:'stop', who:['magdala','qlophah','shelomah']},
      {t:'move', who:['magdala','qlophah','shelomah'], to:[['garden',-1.2,-1.6],['garden',-0.4,-2.6],['garden',0.6,-1.8]], speed:1},
      {t:'face', who:'magdala', to:'tomb'}, {t:'face', who:'qlophah', to:'tomb'}, {t:'face', who:'shelomah', to:'tomb'},
      {t:'cam', from:['garden',2.4,1.6], fdy:2.2, look:['tombFront',0,0], dur:2},
      {t:'say', who:'women', ref:'MARK 16:3', turn:false},
      /* "And see, there was a great earthquake" */
      {t:'cam', from:['tombFront',7,-3.4], fdy:2.8, look:['tombOut',0,-1.4], dur:1.2},
      {t:'quake', s:3.2},
      {t:'show', id:'malak'},
      {t:'drift', id:'stone', by:[0,0,-3], dur:1.8, wait:false},
      {t:'read', ref:'MATTITHYAHU 28:2'},
      {t:'show', id:'flash'}, {t:'wait', s:0.4}, {t:'hide', id:'flash'},
      {t:'read', ref:'MATTITHYAHU 28:3'},
      {t:'lie', who:['guard1','guard2'], prone:true},
      {t:'read', ref:'MATTITHYAHU 28:4'},
      {t:'move', who:['magdala','qlophah','shelomah'], to:[['tombFront',-0.6,-1],['tombFront',-0.2,0.2],['tombFront',0.4,1.2]], speed:0.8},
      {t:'cam', from:['tombFront',3.4,2.6], fdy:2.0, look:'malak', dur:2},
      {t:'say', who:'malak', ref:'MATTITHYAHU 28:5', turn:false},
      {t:'say', who:'malak', ref:'MATTITHYAHU 28:6', turn:false},
      {t:'say', who:'malak', ref:'MATTITHYAHU 28:7', turn:false},
      {t:'hide', id:'malak'},
      {t:'read', ref:'MATTITHYAHU 28:8'},
      /* Miryam from Maḡdala runs to Kĕpha (Yahuchanon 20:2); the others go on toward the city */
      {t:'move', who:'magdala', to:['gateRoad',-6,0], speed:3.4, wait:false},
      {t:'move', who:['qlophah','shelomah'], to:[['roadBend',-0.6,6.4],['roadBend',0.8,6]], speed:1.5},
      {t:'show', id:'yahusha'},
      {t:'face', who:'yahusha', to:'qlophah'},
      {t:'face', who:'qlophah', to:'yahusha'}, {t:'face', who:'shelomah', to:'yahusha'},
      {t:'cam', on:'yahusha', shot:'back', toward:'qlophah', dur:2},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 28:9', turn:false},
      {t:'sit', who:['qlophah','shelomah']},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 28:10', turn:false},
      {t:'cam', release:true},
      {t:'choice', prompt:'You', options:[
        {text:'Look at the stone', reply:'You helped roll it across the door the day before yesterday. It lies back in its channel now, and the tomb is open to the morning.'},
        {text:'Look at the soldiers', reply:'They are getting up off the ground, slowly, the way men do who do not know what has happened to them. One of them is already running for the city.'} ]},
      {t:'end'}
    ]},

  /* ---------------- VII.2 — THE WATCH PAID ---------------- */
  { id:'watch', title:'The courtyard of the kohen gadol', date:'the same morning', place:'highpriest', time:'day',
    player:{ at:'hpPorch', face:-Math.PI/2, look:ADULT },
    actors:[
      {id:'kg1', name:'A chief kohen', dress:'kohen', at:['hall',-1.2,0], face:Math.PI*0.95, beard:0x6d6a66, kind:'oldman'},
      {id:'kg2', dress:'kohen', at:['hall',1.2,0.2], face:Math.PI*1.05, beard:0x2c241f},
      {id:'el1', name:'The elders', dress:'scribe', at:['hall',-3.4,0.4], face:Math.PI*0.9, beard:0x6d6a66, kind:'oldman'},
      {id:'el2', dress:'scribe', at:['hall',3.4,0.4], face:-Math.PI*0.9, beard:0x6d6a66, kind:'oldman'},
      LEGION('w1',['hpStreet',2,-1],-Math.PI/2), LEGION('w2',['hpStreet',3.2,0.6],-Math.PI/2), LEGION('w3',['hpStreet',4.4,-0.4],-Math.PI/2)
    ],
    things:[ {id:'silver', kind:'box', at:['fire',-1,-2.4], w:0.5, h:0.18, d:0.32, color:0xc8c8cc, hidden:true} ],
    beats:[
      {t:'cam', from:['fire',-3,3], fdy:3.2, look:['hall',0,0], dur:0.1},
      {t:'move', who:['w1','w2','w3'], to:[['fire',-1.6,-1.2],['fire',0,-1.6],['fire',1.6,-1.2]], speed:1.4, wait:false},
      {t:'read', ref:'MATTITHYAHU 28:11'},
      {t:'face', who:'w2', to:'kg1'},
      {t:'show', id:'silver'},
      {t:'read', ref:'MATTITHYAHU 28:12'},
      {t:'cam', from:['fire',2.6,2.4], fdy:2, look:'kg1', dur:2},
      {t:'say', who:'kohanim', ref:'MATTITHYAHU 28:13', turn:false},
      {t:'say', who:'kohanim', ref:'MATTITHYAHU 28:14', turn:false},
      {t:'hide', id:'silver'},
      {t:'move', who:['w1','w2','w3'], to:[['hpStreet',4,-1],['hpStreet',5,0.4],['hpStreet',6,-0.6]], speed:1.2, wait:false},
      {t:'cam', from:['hpGate',-2,2.4], fdy:2.4, look:'w2', dur:2.5},
      {t:'read', ref:'MATTITHYAHU 28:15'},
      {t:'choice', prompt:'The soldiers go past you at the gate, the silver in their hands. You', options:[
        {text:'Step aside and let them go', reply:'They do not look at you. One of them is still white in the face. You will hear their story in the market by evening, and you will know it is not true.'},
        {text:'Ask one of them what he saw', reply:'"We slept," he says, too quickly, and does not stop walking.'} ]},
      {t:'end'}
    ]},

  /* ---------------- VII.3 — THE WOMEN'S REPORT ---------------- */
  { id:'told', title:'The upper room', date:'the same morning', place:'upperroom', time:'day',
    player:{ at:[21,33], face:-Math.PI*0.75, look:ADULT },
    actors:[
      ...ROOM(ELEVEN),
      Object.assign({id:'magdala', at:'stairTop', face:-Math.PI/2},MAGDALA),
      Object.assign({id:'qlophah', at:['stairTop',0.4,1.2], face:-Math.PI/2},OTHER),
      Object.assign({id:'yohanah', at:['stairTop',0.8,-1.0], face:-Math.PI/2},YOHANAH)
    ],
    beats:[
      {t:'cam', from:[13,4.6,26.9], look:[18,3,31], dur:0.1},
      {t:'move', who:['magdala','qlophah','yohanah'], to:['roomIn',['roomIn',0.6,1.6],['roomIn',0.2,-1.2]], speed:1.2},
      {t:'read', ref:'LUKE 24:9'},
      {t:'read', ref:'LUKE 24:10'},
      {t:'read', ref:'LUKE 24:11'},
      {t:'face', who:'magdala', to:'kepha'},
      {t:'cam', from:[21.2,4.4,32.4], look:'kepha', dur:1.8},
      {t:'say', who:'magdala', ref:'YAHUCHANON 20:2', turn:false},
      {t:'stand', who:['kepha','yahuchanon']},
      {t:'read', ref:'YAHUCHANON 20:3'},
      {t:'move', who:['yahuchanon','kepha'], to:['stairFoot',['stairFoot',-1,-1]], speed:3.2, wait:false},
      {t:'cam', release:true},
      {t:'goal', text:'Run after them, to the tomb', goto:'roomDoor', r:1.8},
      {t:'end'}
    ]},

  /* ---------------- VII.4 — THE LINEN WRAPPINGS, AND MIRYAM IN THE GARDEN ---------------- */
  { id:'garden', title:'The garden', date:'the first day of the week', place:'golgotha', time:'day',
    player:{ at:['roadBend',-1.4,15], face:Math.PI, look:ADULT },
    actors:[
      T('yahuchanon',['roadBend',0.8,14],{face:Math.PI}),
      T('kepha',['roadBend',-0.2,16.4],{face:Math.PI}),
      Object.assign({id:'magdala', at:['roadBend',1,24], face:Math.PI},MAGDALA),
      Object.assign({id:'yahusha', at:['tombOut',3.4,0.6], face:-Math.PI/2, hidden:true},YAHUSHA)
    ],
    things:[ {id:'stone', kind:'roundStone', at:'stone', face:0, r:1.25},
             {id:'linen', kind:'box', at:['tombIn',0.2,0], w:1.7, h:0.16, d:0.42, color:0xe8e2d2},
             {id:'headcloth', kind:'box', at:['tombIn',-1.1,0.9], w:0.32, h:0.1, d:0.28, color:0xe0d8c4} ],
    glows:[ {id:'m1', at:['tombIn',-1.0,0], dy:0.9, size:1.9, color:0xfff6dc, intensity:1.4, pulse:true, hidden:true},
            {id:'m2', at:['tombIn',1.2,0], dy:0.9, size:1.9, color:0xfff6dc, intensity:1.4, pulse:true, hidden:true} ],
    beats:[
      {t:'cam', from:['garden',6,6], fdy:3, look:['tombOut',0,0], dur:0.1},
      {t:'move', who:'yahuchanon', to:'tombOut', speed:4.4, wait:false},
      {t:'move', who:'kepha', to:['tombOut',2.2,1.4], speed:3.4, wait:false},
      {t:'move', who:'magdala', to:['garden',0,2], speed:1.6, wait:false},
      {t:'read', ref:'YAHUCHANON 20:4'},
      {t:'cam', release:true},
      {t:'goal', text:'Run with them to the tomb', goto:'tombFront', r:3},
      {t:'face', who:'yahuchanon', to:'linen'},
      {t:'cam', from:['tombOut',1.8,1.8], fdy:1.5, look:['tombIn',0,0], dur:2},
      {t:'read', ref:'YAHUCHANON 20:5'},
      {t:'move', who:'kepha', to:['tombIn',1.4,-0.8], speed:1.4},
      {t:'read', ref:'YAHUCHANON 20:6'},
      {t:'read', ref:'YAHUCHANON 20:7'},
      {t:'move', who:'yahuchanon', to:['tombIn',1.6,0.8], speed:1.2},
      {t:'read', ref:'YAHUCHANON 20:8'},
      {t:'read', ref:'YAHUCHANON 20:9'},
      {t:'cam', release:true},
      {t:'witness', text:'Stoop down and look in at the door, as he did', items:['linen'], verb:'Look into the tomb', hold:0.8, reach:6.4},
      {t:'move', who:['kepha','yahuchanon'], to:[['roadBend',0,22],['roadBend',1,23]], speed:1.4, wait:false},
      {t:'read', ref:'YAHUCHANON 20:10'},
      {t:'move', who:'magdala', to:['tombOut',0.6,0], speed:1},
      {t:'face', who:'magdala', to:'linen'},
      {t:'cam', from:['tombOut',2.6,1.4], fdy:1.9, look:['tombIn',0,0], dur:2.5},
      {t:'read', ref:'YAHUCHANON 20:11'},
      {t:'show', id:['m1','m2']},
      {t:'read', ref:'YAHUCHANON 20:12'},
      {t:'say', voices:['malakim','magdala'], ref:'YAHUCHANON 20:13', turn:false},
      {t:'show', id:'yahusha'},
      {t:'face', who:'magdala', to:'yahusha'},
      {t:'face', who:'yahusha', to:'magdala'},
      {t:'read', ref:'YAHUCHANON 20:14'},
      {t:'cam', on:'yahusha', shot:'back', toward:'magdala', dur:2},
      {t:'say', voices:['yahusha','magdala'], ref:'YAHUCHANON 20:15', turn:false},
      {t:'say', voices:['yahusha','magdala'], ref:'YAHUCHANON 20:16', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 20:17', turn:false},
      {t:'hide', id:['m1','m2']},
      {t:'move', who:'magdala', to:['roadBend',0.4,20], speed:2.6, wait:false},
      {t:'cam', from:['garden',3,3], fdy:2.2, look:'magdala', dur:2.5},
      {t:'read', ref:'YAHUCHANON 20:18'},
      {t:'cam', release:true},
      {t:'choice', prompt:'You', options:[
        {text:'Look at the folded cloth', reply:'It lies by itself, folded, apart from the wrappings. Thieves do not fold things.'},
        {text:'Look for the gardener', reply:'There is no one in the garden but you now, and the bees in the flowers.'} ]},
      {t:'end'}
    ]},

  /* ---------------- VII.5 — THE ROAD TO AMMA’US ---------------- */
  { id:'emmaus', title:'Amma’us', date:'that same day', place:'emmaus', time:'day',
    player:{ at:['road1',1.6,1.4], face:-Math.PI/2, look:ADULT },
    actors:[
      {id:'qleophas', name:'Qleophas', key:'Qleophas', at:['road1',-1,-0.7], face:-Math.PI/2, robe:0x6b5a44, cloth:0xd8ceb4, beard:0x3a2a1e, skin:0x7a4e29},
      {id:'friend', name:'His companion', key:'the other going to Ammaus', at:['road1',-1.2,0.8], face:-Math.PI/2, robe:0x5a6470, cloth:0xcfc4aa, beard:0x2c241f, skin:0x6e4524},
      Object.assign({id:'yahusha', at:['road0',2,0], face:-Math.PI/2, hidden:true},YAHUSHA)
    ],
    things:[ {id:'lampT', kind:'box', at:'lamp', dy:1.4, w:0.18, h:0.12, d:0.28, color:0x8a6a40} ],
    glows:[ {id:'lampG', at:'lamp', dy:1.8, size:1.4, color:0xffc070, intensity:0.9, hidden:true} ],
    beats:[
      {t:'cam', from:['road1',8,9], fdy:3.4, look:['road1',0,0], dur:0.1},
      {t:'read', ref:'LUKE 24:13'},
      {t:'read', ref:'LUKE 24:14'},
      {t:'cam', release:true},
      {t:'move', who:['qleophas','friend'], to:[['road2',0,-0.7],['road2',0,0.7]], speed:1.1, wait:false},
      {t:'goal', text:'Walk on with the two of them toward Amma’us', goto:'road2', r:4},
      {t:'show', id:'yahusha'},
      {t:'move', who:'yahusha', to:['road2',1.8,0], speed:2},
      {t:'read', ref:'LUKE 24:15'},
      {t:'read', ref:'LUKE 24:16'},
      {t:'face', who:'yahusha', to:'qleophas'}, {t:'face', who:'qleophas', to:'yahusha'}, {t:'face', who:'friend', to:'yahusha'},
      {t:'cam', from:['road2',6.4,1.4], fdy:2.4, look:['road2',-0.6,0], dur:2},
      {t:'say', who:'yahusha', ref:'LUKE 24:17', turn:false},
      {t:'say', who:'qleophas', ref:'LUKE 24:18', turn:false},
      {t:'say', voices:['yahusha','two'], ref:'LUKE 24:19', turn:false},
      {t:'say', who:'two', ref:'LUKE 24:20', turn:false},
      {t:'say', who:'two', ref:'LUKE 24:21', turn:false},
      {t:'say', who:'two', ref:'LUKE 24:22', turn:false},
      {t:'say', who:'two', ref:'LUKE 24:23', turn:false},
      {t:'say', who:'two', ref:'LUKE 24:24', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 24:25', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 24:26', turn:false},
      {t:'move', who:['yahusha','qleophas','friend'], to:[['road3',0,0],['road3',0.8,-1],['road3',0.8,1]], speed:1, wait:false},
      {t:'cam', from:['road3',10,6], fdy:4, look:['road3',4,0], dur:5, wait:false},
      {t:'read', ref:'LUKE 24:27'},
      {t:'time', to:'dusk'},
      {t:'move', who:['qleophas','friend'], to:[['edge',0,-1],['edge',0,1]], speed:1.1, wait:false},
      {t:'move', who:'yahusha', to:['edge',-0.6,0], speed:1.1},
      {t:'cam', from:['edge',5,4], fdy:2.4, look:['edge',0,0], dur:2},
      {t:'move', who:'yahusha', to:['edge',-5,2.6], speed:0.9, wait:false},
      {t:'read', ref:'LUKE 24:28'},
      {t:'face', who:'qleophas', to:'yahusha'},
      {t:'say', who:'two', ref:'LUKE 24:29', turn:false},
      {t:'move', who:['yahusha','qleophas','friend'], to:['houseDoor',['houseDoor',1,-0.8],['houseDoor',1,0.8]], speed:1},
      {t:'move', who:['yahusha','qleophas','friend'], to:['seatH','seatA','seatB'], speed:0.9},
      {t:'face', who:'yahusha', to:'house'}, {t:'face', who:'qleophas', to:'house'}, {t:'face', who:'friend', to:'house'},
      {t:'sit', who:['yahusha','qleophas','friend']},
      {t:'time', to:'lamplit'},
      {t:'cam', release:true},
      {t:'goal', text:'Go in after them', goto:'houseIn', r:1.8},
      {t:'witness', text:'It is getting dark — light the lamp in its niche', items:['lampT'], verb:'Light the lamp', hold:0.8, reach:2.6},
      {t:'show', id:'lampG'},
      {t:'cam', from:{rel:'yahusha', off:[-0.6,1.6,-1.6]}, look:'qleophas', dur:2},
      {t:'read', ref:'LUKE 24:30'},
      /* "and He became invisible to them": the table seen whole from behind His place — and then
         from their side of it, His place empty and the bread broken on the table */
      {t:'cam', from:[-12.6,2.3,-5.6], look:[-10,0.7,-1.8], dur:1.6},
      {t:'wait', s:0.7},
      {t:'hide', id:'yahusha'},
      {t:'cam', from:[-10,1.7,0.9], look:[-10,0.5,-3.8], dur:2.2, wait:false},
      {t:'read', ref:'LUKE 24:31'},
      {t:'say', who:'two', ref:'LUKE 24:32', turn:false},
      {t:'stand', who:['qleophas','friend']},
      {t:'move', who:['qleophas','friend'], to:[['houseDoor',1.4,-0.6],['houseDoor',1.4,0.6]], speed:2.2, wait:false},
      {t:'read', ref:'LUKE 24:33'},
      {t:'choice', prompt:'You', options:[
        {text:'Look at His place at the table', reply:'The bread lies broken where He broke it. The cushion is still pressed down.'},
        {text:'Run after them, back to the city', reply:'Twelve kilometres, in the dark, uphill. None of you notices.'} ]},
      {t:'end'}
    ]},

  /* ---------------- VII.6 — THAT EVENING, THE DOORS SHUT ---------------- */
  { id:'evening', title:'The upper room', date:'the evening of the first day of the week', place:'upperroom', time:'lamplit',
    player:{ at:[21,33], face:-Math.PI*0.75, look:ADULT },
    actors:[
      ...ROOM(ELEVEN.filter(k=>k!=='toma')),
      {id:'qleophas', name:'Qleophas', key:'Qleophas', at:'stairTop', face:-Math.PI/2, robe:0x6b5a44, cloth:0xd8ceb4, beard:0x3a2a1e, skin:0x7a4e29},
      {id:'friend', name:'His companion', key:'the other going to Ammaus', at:['stairTop',0.6,1.2], face:-Math.PI/2, robe:0x5a6470, cloth:0xcfc4aa, beard:0x2c241f, skin:0x6e4524},
      T('toma','stairTop',{face:-Math.PI/2, hidden:true}),
      Object.assign({id:'yahusha', at:MIDST, face:Math.PI, hidden:true},YAHUSHA)
    ],
    things:[ {id:'fish', kind:'box', at:[21.3,32.2], y:F, w:0.42, h:0.08, d:0.16, color:0xa8784a},
             {id:'honey', kind:'box', at:[21.4,31.5], y:F, w:0.22, h:0.12, d:0.22, color:0xd8a030} ],
    beats:[
      {t:'cam', from:[13,4.6,26.9], look:[18,3,31], dur:0.1},
      {t:'move', who:['qleophas','friend'], to:[[19.4,32.7],[18.2,32.9]], speed:1.6},
      {t:'say', who:'eleven', ref:'LUKE 24:34', turn:false},
      {t:'read', ref:'LUKE 24:35'},
      /* "Yahusha Himself stood in the midst of them": the room seen from just over and behind where He stands */
      {t:'cam', from:OVER, look:[17,3.1,29.6], dur:1.6},
      {t:'show', id:'yahusha'},
      {t:'say', who:'yahusha', ref:'LUKE 24:36', turn:false},
      {t:'stand', who:ELEVEN.filter(k=>k!=='toma')},
      /* "they were startled and afraid": some shrink back down */
      {t:'sit', who:['bartholomi','yaaqobA','shimonZ']},
      {t:'lie', who:'mattithyahu'},
      {t:'read', ref:'LUKE 24:37'},
      {t:'cam', from:OVER, look:'kepha', dur:1.6},
      {t:'say', who:'yahusha', ref:'LUKE 24:38', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 24:39', turn:false},
      /* "He showed them His hands and His feet" */
      {t:'pose', who:'yahusha', arms:'out'},
      {t:'cam', from:[20.8,5,33.6], look:[16.8,3.1,31.8], dur:1.4},        /* from behind His right shoulder: the arms held out */
      {t:'read', ref:'LUKE 24:40'},
      {t:'stand', who:['bartholomi','yaaqobA','shimonZ','mattithyahu']},
      {t:'say', who:'yahusha', ref:'LUKE 24:41', turn:false},
      {t:'pose', who:'yahusha'},
      {t:'cam', release:true},
      {t:'witness', text:'Give Him the broiled fish and the honeycomb', items:['fish','honey'], verb:'Take it up', hold:0.4, deliver:'yahusha', r:1.8, carryText:'Give it to Him'},
      {t:'read', ref:'LUKE 24:42'},
      {t:'read', ref:'LUKE 24:43'},
      {t:'cam', from:OVER, look:'kepha', dur:1.6},
      {t:'say', who:'yahusha', ref:'LUKE 24:44', turn:false},
      {t:'read', ref:'LUKE 24:45'},
      {t:'say', who:'yahusha', ref:'LUKE 24:46', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 24:47', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 24:48', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 24:49', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 20:21', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 20:22', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 20:23', turn:false},
      {t:'hide', id:'yahusha'},
      /* T’oma comes in after */
      {t:'show', id:'toma'},
      {t:'move', who:'toma', to:'roomIn', speed:1.2},
      {t:'read', ref:'YAHUCHANON 20:24'},
      {t:'cam', from:[13.6,4.4,32.6], look:'toma', dur:1.8},
      {t:'say', voices:['taught','toma'], ref:'YAHUCHANON 20:25', turn:false},
      {t:'choice', prompt:'You', options:[
        {text:'Say nothing to T’oma', reply:'He looks round the room at all of them, then at you. You were there. You cannot make him see it.'},
        {text:'Show him the plate the fish was on', reply:'He looks at it a long time. "Anyone can eat a fish," he says, but more quietly than before.'} ]},
      {t:'end'}
    ]},

  /* ---------------- VII.7 — EIGHT DAYS AFTER: T’OMA ---------------- */
  { id:'toma', title:'The upper room', date:'eight days after', place:'upperroom', time:'lamplit',
    player:{ at:[21,33], face:-Math.PI*0.75, look:ADULT },
    actors:[
      ...ROOM(ELEVEN),
      Object.assign({id:'yahusha', at:MIDST, face:Math.PI, hidden:true},YAHUSHA)
    ],
    beats:[
      {t:'cam', from:[13,4.6,26.9], look:[18,3,31], dur:0.1},
      /* "the doors having been shut, Yahusha came and stood in the midst": seen from over and behind Him */
      {t:'cam', from:OVER, look:[17,3.1,29.6], dur:1.6},
      {t:'show', id:'yahusha'},
      {t:'stand', who:ELEVEN},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 20:26', turn:false},
      {t:'move', who:'toma', to:[16.1,32.1], speed:0.8},
      {t:'face', who:'toma', to:'yahusha'}, {t:'face', who:'yahusha', to:'toma'},
      {t:'cam', from:OVER, look:'toma', dur:1.8},
      {t:'pose', who:'yahusha', arms:'out'},                            /* "see My hands … and put it into My side" */
      {t:'cam', from:[20.6,5,33.6], look:[16.4,3.1,32.2], dur:1.4},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 20:27', turn:false},
      {t:'pose', who:'yahusha'},
      {t:'sit', who:'toma'},
      {t:'say', who:'toma', ref:'YAHUCHANON 20:28', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 20:29', turn:false},
      {t:'cam', from:[21.2,4.6,32.6], look:[16,3.2,30], dur:3},
      {t:'read', ref:'YAHUCHANON 20:30'},
      {t:'read', ref:'YAHUCHANON 20:31'},
      {t:'choice', prompt:'“Baruk are those who have not seen and have believed.” You', options:[
        {text:'Think of your family, at home', reply:'They have not seen. They will have only what you tell them, and the scroll.'},
        {text:'Think of the scroll', reply:'You have read the words all your life. You have seen them now. You do not know which is the harder.'} ]},
      {t:'end'}
    ]},

  /* ---------------- VII.8 — THE SHORE OF THE SEA OF KINNERETH ---------------- */
  { id:'shore', title:'The Sea of Kinnereth', date:'after this, in Galil', place:'tiberias', time:'night',
    player:{ at:[BX-0.55,-0.1], face:-Math.PI/2, look:ADULT },
    actors:[
      T('kepha',[BX-0.9,0.5],{face:-Math.PI/2, y:BOAT_FLOOR}),
      ...BOAT_SEATS(['yahuchanon','yaaqob','toma','nethanel','andri','philip'],
        [[0.9,1.65],[0,1.65],[-0.9,-1.35],[0,-1.35],[0.9,-1.35],[0,-2.75]]),
      Object.assign({id:'yahusha', at:['fire',-1.8,-0.6], face:Math.PI/2, hidden:true},YAHUSHA)
    ],
    things:[ {id:'boat', kind:'boat', big:true, at:[BX,0], y:-0.1},
             {id:'netPile', kind:'box', at:[BX+0.4,-0.4], y:BOAT_FLOOR, w:0.9, h:0.3, d:0.8, color:0xb8a882},
             {id:'net', kind:'net', at:[BX-2.6,0.6], y:-0.35, w:1.4, h:0.5, d:2.8, n:90, hidden:true},
             {id:'fishes', kind:'box', at:['water',-1.6,-2.6], w:0.7, h:0.14, d:0.42, color:0xc8ccd0, hidden:true} ],
    beats:[
      {t:'player', at:[BX-0.55,-0.1], y:BOAT_FLOOR, lock:true, face:-Math.PI/2},
      {t:'cam', from:[BX+12,5,-12], look:[BX,0.4,0], dur:0.1},
      {t:'read', ref:'YAHUCHANON 21:1'},
      {t:'read', ref:'YAHUCHANON 21:2'},
      {t:'say', voices:['kepha','taught'], ref:'YAHUCHANON 21:3', turn:false},
      {t:'time', to:'dawn'},
      {t:'show', id:'yahusha'},
      {t:'cam', on:'yahusha', shot:'back', toward:'kepha', back:4.4, dur:2.5},
      {t:'read', ref:'YAHUCHANON 21:4'},
      {t:'say', voices:['yahusha','taught'], ref:'YAHUCHANON 21:5', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 21:6', turn:false},
      {t:'cam', release:true},
      {t:'witness', text:'Throw the net over the right side of the boat', items:['netPile'], verb:'Throw the net', hold:0.8, reach:2.6},
      {t:'hide', id:'netPile'}, {t:'show', id:'net'}, {t:'fill', id:'net'},
      {t:'cam', from:[BX+4,2.6,-4.6], look:[BX-2,0,0.6], dur:2},
      {t:'say', who:'yahuchanon', ref:'YAHUCHANON 21:7', turn:false},
      /* he goes over the side, and swims for the shore */
      {t:'drift', id:'kepha', to:[BX-3.4,-1.0,0.4], dur:1.2},
      {t:'drift', id:'kepha', to:[23.2,-1.0,0.6], dur:7, wait:false},
      {t:'stand', who:['yahuchanon','yaaqob','toma','nethanel','andri','philip']},
      {t:'cam', from:[BX-8,3.4,-9], look:[BX-12,0,0], dur:2, wait:false},
      {t:'drift', id:['boat','yahuchanon','yaaqob','toma','nethanel','andri','philip','player','net'], by:[-24,0,0], dur:7},
      {t:'read', ref:'YAHUCHANON 21:8'},
      {t:'place', who:'kepha', at:['water',-1.4,1.2], y:null},
      {t:'place', who:'yahuchanon', at:['water',-1.6,2.2], y:null},
      {t:'place', who:'yaaqob', at:['water',-2,3.2], y:null},
      {t:'place', who:'toma', at:['water',-1.8,-2], y:null},
      {t:'place', who:'nethanel', at:['water',-2.4,-3], y:null},
      {t:'place', who:'andri', at:['water',-2.2,4.2], y:null},
      {t:'place', who:'philip', at:['water',-2.8,-0.8], y:null},
      {t:'player', at:['water',-2.2,0.2], lock:false},
      {t:'cam', from:['fire',4.4,4.4], fdy:2, look:['fire',0,0], dur:2},
      {t:'read', ref:'YAHUCHANON 21:9'},
      {t:'face', who:'yahusha', to:'kepha'},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 21:10', turn:false},
      {t:'drift', id:'net', to:[20.6,0.05,-1.4], dur:2.4},
      {t:'read', ref:'YAHUCHANON 21:11'},
      {t:'show', id:'fishes'},
      {t:'cam', release:true},
      {t:'witness', text:'Bring some of the fish you have caught up to the fire', items:['fishes'], verb:'Take up the fish', hold:0.5, deliver:'fire', r:2.4, carryText:'Carry them to the fire'},
      {t:'move', who:['kepha','yahuchanon','yaaqob','toma','nethanel','andri','philip'],
        to:[['fire',1.8,0.4],['fire',1.4,1.6],['fire',0.4,2.2],['fire',1.4,-1.4],['fire',0.2,-2.2],['fire',-0.8,2.2],['fire',-0.9,-2.1]], speed:1},
      {t:'face', who:'yahusha', to:'kepha'},
      {t:'say', voices:['yahusha','narrator'], ref:'YAHUCHANON 21:12', turn:false},
      {t:'sit', who:['kepha','yahuchanon','yaaqob','toma','nethanel','andri','philip']},
      {t:'read', ref:'YAHUCHANON 21:13'},
      {t:'read', ref:'YAHUCHANON 21:14'},
      {t:'cam', on:'yahusha', shot:'back', toward:'kepha', dur:2},
      {t:'say', voices:['yahusha','kepha','yahusha'], ref:'YAHUCHANON 21:15', turn:false},
      {t:'say', voices:['yahusha','kepha','yahusha'], ref:'YAHUCHANON 21:16', turn:false},
      {t:'say', voices:['yahusha','yahusha','kepha','yahusha'], ref:'YAHUCHANON 21:17', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 21:18', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 21:19', turn:false},
      {t:'stand', who:['kepha','yahuchanon']},
      {t:'move', who:['yahusha','kepha'], to:['walk1',['walk1',0.8,1]], speed:0.9, wait:false},
      {t:'move', who:'yahuchanon', to:['walk1',2.4,4], speed:0.9},
      {t:'face', who:'kepha', to:'yahuchanon'},
      {t:'cam', from:['walk1',-3,-3], fdy:2.2, look:'kepha', dur:2},
      {t:'read', ref:'YAHUCHANON 21:20', voices:['yahuchanon']},
      {t:'face', who:'kepha', to:'yahusha'}, {t:'face', who:'yahusha', to:'kepha'},
      {t:'cam', on:'yahusha', shot:'back', toward:'kepha', dur:1.6},
      {t:'say', who:'kepha', ref:'YAHUCHANON 21:21', turn:false},
      {t:'say', who:'yahusha', ref:'YAHUCHANON 21:22', turn:false},
      {t:'read', ref:'YAHUCHANON 21:23', voices:['yahusha']},
      {t:'cam', from:['fire',6,-4], fdy:3, look:['walk1',0,0], dur:3},
      {t:'read', ref:'YAHUCHANON 21:24'},
      {t:'read', ref:'YAHUCHANON 21:25'},
      {t:'choice', prompt:'You', options:[
        {text:'Count the fish', reply:'One hundred and fifty-three. You count them twice. The net has not torn.'},
        {text:'Sit by the fire', reply:'The coals are still warm. The last time you saw Kĕpha by a fire of coals, he was warming his hands in the courtyard of the kohen gadol.'} ]},
      {t:'end'}
    ]},

  /* ---------------- VII.9 — THE MOUNTAIN IN GALIL ---------------- */
  { id:'mountain', title:'Galil', date:'the mountain He had appointed', place:'galil', time:'day',
    player:{ at:['mountCrowd',2.4,3.4], face:-Math.PI/2, look:ADULT },
    actors:[
      ...ELEVEN.map((id,k)=>T(id,['mountCrowd',(k%4)*1.2-1.2,-4+Math.floor(k/4)*1.6+(k%4)*0.9],{face:-Math.PI/2})),
      Object.assign({id:'yahusha', at:'mountTop', face:Math.PI/2, hidden:true},YAHUSHA)
    ],
    beats:[
      {t:'cam', from:['mountCrowd',10,-8], fdy:4, look:['mount',0,0], dur:0.1},
      {t:'read', ref:'MATTITHYAHU 28:16'},
      {t:'move', who:ELEVEN, to:ELEVEN.map((id,k)=>['mount',2+(k%4)*1.1,-3.6+Math.floor(k/4)*2+(k%4)*0.5]), speed:1},
      {t:'show', id:'yahusha'},
      {t:'cam', on:'yahusha', shot:'back', toward:'kepha', back:4.6, lift:1, dur:2.5},
      {t:'sit', who:['kepha','andri','yaaqob','yahuchanon','bartholomi','mattithyahu','yaaqobA','shimonZ','yahudahY']},
      {t:'read', ref:'MATTITHYAHU 28:17'},
      {t:'move', who:'yahusha', to:['mount',-0.6,0], speed:0.8},
      {t:'stand', who:ELEVEN},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 28:18', turn:false},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 28:19', turn:false},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 28:20', turn:false},
      {t:'cam', release:true},
      {t:'choice', prompt:'“All the nations.” You', options:[
        {text:'Look down at the lake', reply:'Kephar Naḥum, the boats drawn up, the road west to the sea. Beyond the sea, the nations. It is a long way.'},
        {text:'Look at the eleven', reply:'Fishermen, a tax collector, a zealot. Some of them still doubt. He has given it to them anyway.'} ]},
      {t:'end'}
    ]},

  /* ---------------- VII.10 — THE MOUNT OF OLIVES: THE CLOUD ---------------- */
  { id:'olivet', title:'The Mount of Olives', date:'forty days after', place:'olivet', time:'day',
    player:{ at:['wait',-6,3], face:Math.PI/2, look:ADULT },
    actors:[
      ...ELEVEN.map((id,k)=>T(id,['wait',-3.2-(k%3)*1.2,(Math.floor(k/3)-1.5)*1.3],{face:Math.PI/2})),
      Object.assign({id:'yahusha', at:['wait',2.4,0], face:-Math.PI/2},YAHUSHA)
    ],
    glows:[ {id:'cloud', at:['wait',2.4,0], dy:3.0, size:8, color:0xfffaf0, intensity:2.4, pulse:true, hidden:true},
            {id:'w1', at:['wait',-1.6,3.2], dy:1.4, size:2.4, color:0xfff6dc, intensity:1.4, pulse:true, hidden:true},
            {id:'w2', at:['wait',-1.6,-3.2], dy:1.4, size:2.4, color:0xfff6dc, intensity:1.4, pulse:true, hidden:true} ],
    beats:[
      {t:'cam', from:['wait',-14,8], fdy:4, look:['wait',0,0], dur:0.1},
      {t:'read', ref:'ACTS 1:3'},
      {t:'cam', on:'yahusha', shot:'back', toward:'kepha', back:4.4, dur:2},
      {t:'say', who:'yahusha', ref:'ACTS 1:4', turn:false},
      {t:'say', who:'yahusha', ref:'ACTS 1:5', turn:false},
      {t:'say', who:'taught', ref:'ACTS 1:6', turn:false},
      {t:'say', who:'yahusha', ref:'ACTS 1:7', turn:false},
      {t:'say', who:'yahusha', ref:'ACTS 1:8', turn:false},
      {t:'pose', who:'yahusha', arms:'out'},
      {t:'read', ref:'LUKE 24:50'},
      /* "He was taken up and a cloud hid Him from their sight": seen from behind Him, over Him, on
         the eleven looking up */
      {t:'cam', from:['wait',10,0.8], fdy:2.6, look:['wait',-3,0], dur:2},
      ...ELEVEN.map(id=>({t:'face', who:id, to:'yahusha'})),             /* every one of them toward Him */
      {t:'show', id:'cloud'},
      {t:'drift', id:['yahusha','cloud'], by:[0,22,0], dur:9, wait:false, hold:true},
      /* the eye goes up with Him, from low behind Him */
      {t:'cam', from:['wait',9.4,1.4], fdy:0.9, look:[147.6,44,-41.4], dur:9, wait:false},
      {t:'read', ref:'LUKE 24:51'},
      {t:'read', ref:'ACTS 1:9'},
      {t:'hide', id:'yahusha'},
      /* "and as they were gazing into the heaven as He went up": from low behind the eleven, up to the cloud */
      {t:'cam', from:['wait',-17,1], fdy:1.2, look:[148,36,-41.4], dur:2.5},
      {t:'show', id:['w1','w2']},
      {t:'read', ref:'ACTS 1:10'},
      {t:'cam', from:['wait',-9,1.6], fdy:1.6, look:['wait',0,0], dur:2},
      {t:'say', who:'whiteMen', ref:'ACTS 1:11', turn:false},
      {t:'hide', id:['w1','w2','cloud']},
      {t:'sit', who:ELEVEN},
      {t:'read', ref:'LUKE 24:52'},
      {t:'stand', who:ELEVEN},
      {t:'move', who:ELEVEN, to:ELEVEN.map((id,k)=>['d1',(k%3)*1.2-1.2,(Math.floor(k/3)-1.5)*1.2]), speed:1.2, wait:false},
      {t:'cam', from:['brow',-4,6], fdy:3, look:'city', dur:4},
      {t:'read', ref:'ACTS 1:12'},
      {t:'choice', prompt:'You', options:[
        {text:'Keep looking up', reply:'There is only the sky, and the light going west over the city. "This same Yahusha … shall come in the same way."'},
        {text:'Go down with them', reply:'They are not weeping. That is the strange thing. They go down the mount as if they were going to a wedding.'} ]},
      {t:'end'}
    ]},

  /* ---------------- VII.11 — WAITING ---------------- */
  { id:'waiting', title:'The upper room', date:'the days after', place:'upperroom', time:'day',
    player:{ at:[21,33], face:-Math.PI*0.75, look:ADULT },
    actors:[
      ...ROOM(ELEVEN),
      Object.assign({id:'miryam', at:[21,29], face:-Math.PI/2, sit:true},MIRYAM),
      Object.assign({id:'magdala', at:[21,31.8], face:-Math.PI/2, sit:true},MAGDALA),
      Object.assign({id:'qlophah', at:[13.4,28.4], face:Math.PI/4, sit:true},OTHER),
      Object.assign({id:'yohanah', at:[13.4,31.8], face:Math.PI*0.75, sit:true},YOHANAH),
      {id:'brother', name:'His brothers', key:'the brothers of Yahusha', at:[16.8,33], face:Math.PI, sit:true, robe:0x6b5a44, cloth:0xd8ceb4, beard:0x2c241f, skin:0x7c5430},
      {id:'brother2', at:[18,33], face:Math.PI, sit:true, robe:0x5f6a52, cloth:0xcfc4aa, beard:0x3a2a1e, skin:0x704a27}
    ],
    beats:[
      {t:'cam', from:[13,4.6,26.9], look:[18,3,31], dur:0.1},
      {t:'read', ref:'ACTS 1:13'},
      {t:'cam', from:[21.4,4.4,26.8], look:[16.4,3.1,31.4], dur:4},
      {t:'read', ref:'ACTS 1:14'},
      {t:'read', ref:'LUKE 24:53'},
      {t:'choice', prompt:'You', options:[
        {text:'Pray with them', reply:'Ten days of it. You learn the eleven names, and the women\'s, and His mother\'s voice when she prays.'},
        {text:'Wait by the window', reply:'The city is filling up for the Festival of Weeks. Pilgrims from every nation under the heavens are coming up the roads.'} ]},
      {t:'title', text:'The end of Act VII', sub:'Next: To the End of the Earth'},
      {t:'end'}
    ]}

  ]
});
})();
