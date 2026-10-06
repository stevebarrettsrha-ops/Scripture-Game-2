/* ACT VIII — TO THE END OF THE EARTH. The design document: "Shavuot and the coming of the Ruach
   ha'Qodesh; Kefa's sermon; the first assembly; Stephen; the conversion of Sha'ul (Paul); Philip
   and the Ethiopian official; Cornelius (the door opens to the nations); the missionary journeys —
   'Jerusalem, Judea, Samaria, and the ends of the earth' — ending in Rome. The final act closes the
   loop: the good news arrives in the very city that began as a muddy village in the prologue's
   montage."

   THE WITNESS is in the upper room when the sound comes, and goes down into the street with the
   eleven; breaks the bread at the table of the first assembly; stands at the edge of the crowd
   when Stephanos is stoned, and kneels with those who bury him; runs with Philip after the chariot
   and holds the horses at the water; leads Sha’ul by the hand into Damascus and brings him food;
   opens the tanner's gate at Yapho; draws water in the captain's house at Caesarea; carries the
   bundles of Barnaḇah and Sha’ul to the road at Antioch; reads the altar in Athens; throws the cargo
   into the sea off Crete and gathers sticks on Melite; and carries the scrolls into a rented house in
   Rome. He never speaks in a named mouth, and nothing he does changes what the Besorah says.

   THE ORDER is the Besorah's own (Acts 2-28), with the long speeches given in their beginnings and
   their ends.

   REVERENCE. Yahusha is not seen in this act. At Damascus He is light, and a voice; to Ḥananyah He
   is a voice in a vision. A mal’ak is light, never a figure. The stoning of Stephanos is read,
   never drawn: the camera is on Sha’ul and the garments at his feet. */
(function(){
const ADULT={robe:0x8a7454, cloth:0xd8cfb8, beard:0x3a2a1e, skin:0x86573a};
const T12={
  kepha:{name:'Shim‛on Kĕpha', key:'Shim‛on Kĕpha', robe:0x6e5238, cloth:0xb9ab8e, beard:0x6d6a66, skin:0x6e4524},
  andri:{name:'Andri', key:'Andri', robe:0x5a6a7a, cloth:0xd8ceb4, beard:0x3a2a1e, skin:0x704a27},
  yaaqob:{name:'Ya‛aqoḇ', key:'Ya‛aqoḇ son of Zaḇdai', robe:0x7a3a2a, cloth:0xcfc4aa, beard:0x2c241f, skin:0x7a4e29},
  yahuchanon:{name:'Yahuchanon', key:'Yahuchanon son of Zaḇdai', robe:0x4a5a3a, cloth:0xe6e0cf, beard:0x2c241f, skin:0x855a33},
  philip:{name:'Philip', key:'Philip', robe:0x6a5a7a, cloth:0xd8ceb4, beard:0x2c241f, skin:0x7c5430},
  bartholomi:{name:'Bartholomi', key:'Bartholomi', robe:0x6a5a44, cloth:0xd8ceb4, beard:0x2c241f, skin:0x7a4e29},
  mattithyahu:{name:'Mattithyahu', key:'Mattithyahu', robe:0x4a5a6a, cloth:0xe6e0cf, beard:0x2c241f, skin:0x855a33},
  toma:{name:'T’oma', key:'T’oma', robe:0x7a6a4a, cloth:0xcfc4aa, beard:0x3a2a1e, skin:0x6e4524},
  yaaqobA:{name:'Ya‛aqoḇ the son of Alphai', key:'Ya‛aqoḇ the son of Alphai', robe:0x5a4a3a, cloth:0xd8ceb4, beard:0x1e1814, skin:0x704a27},
  shimonZ:{name:'Shim‛on the Ardent One', key:'Shim‛on the Ardent One', robe:0x7a3a2a, cloth:0xb9ab8e, beard:0x2c241f, skin:0x5c3a1f},
  yahudahY:{name:'Yahuḏah the son of Ya‛aqoḇ', key:'Yahuḏah the son of Ya‛aqoḇ', robe:0x5f6a52, cloth:0xe6e0cf, beard:0x3a2a1e, skin:0x7c5430}
};
const T=(id,at,extra)=>Object.assign({id,at},T12[id],extra||{});
const ELEVEN=Object.keys(T12);
const MIRYAM={name:'Miryam', key:'Miryam', robe:0x3f5a8a, cloth:0xe8e2d2, skin:0x8e5c3c, kind:'woman'};
const MAGDALA={name:'Miryam from Maḡdala', key:'Miryam from Magdala', kind:'woman', robe:0x6a3a4a, cloth:0x3c3a44, skin:0x7a4e30};
const YOHANAH={name:'Yoḥanah', key:'Yohanah', kind:'woman', robe:0x5a3a6a, cloth:0xe8e2d2, skin:0x8a5a36, sash:0xb08d3c};
/* the new faces of the act */
const SHAUL={name:'Sha’ul', key:'Sha’ul of Tarsos', robe:0x5a4a6a, cloth:0xd8cfb8, beard:0x2c241f, skin:0x7a4e29};
const STEPHANOS={name:'Stephanos', key:'Stephanos', robe:0x6a5a3a, cloth:0xe6e0cf, beard:0x3a2a1e, skin:0x7c5430};
const PHILIP_E={name:'Philip', key:'Philip the proclaimer', robe:0x4a6a5a, cloth:0xd8ceb4, beard:0x2c241f, skin:0x7a4e29};
const KUSHI={name:'A man of Kush', key:'the eunuch of Kandake', robe:0x2a4a8a, cloth:0xd4af37, sash:0xd4af37, skin:0x3a2416};
const HANANYAH={name:'Ḥananyah', key:'Hananyah of Damascus', robe:0x6b5a44, cloth:0xe6e0cf, beard:0x6d6a66, skin:0x7a4e29, kind:'oldman'};
const BARNABAH={name:'Barnaḇah', key:'Barnabah', robe:0x5f6a52, cloth:0xcfc4aa, beard:0x3a2a1e, skin:0x7c5430};
const LEGION=(id,at,face,extra)=>Object.assign({id,at,face,folk:'roman',dress:'legionary'},extra||{});
let seed=53; const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
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
/* THE UPPER ROOM (story/settings.js, S.upperroom), its places about the low table */
const F=2.85;
const SEATS=[[14.4,28.7,0],[15.6,28.7,0],[16.8,28.7,0],[18,28.7,0],[19.2,28.7,0],
             [14.6,31.3,Math.PI],[15.8,31.3,Math.PI],[17,31.3,Math.PI],[18.2,31.3,Math.PI],[19.4,31.3,Math.PI],
             [13.6,30,Math.PI/2],[20.4,29.4,-Math.PI/2],[20.4,30.6,-Math.PI/2]];
const ROOM=(list,o)=>list.map((id,k)=>T(id,[SEATS[k][0],SEATS[k][1]],Object.assign({face:SEATS[k][2], sit:true},o||{})));
/* "divided tongues, as of fire, and settled on each one of them" (2:3) */
const TONGUES=ELEVEN.concat(['miryam','magdala','yohanah']).map((id,k)=>({id:'f'+k, on:id, dy:0.16, size:0.42, color:0xff8a2a, intensity:0.7, pulse:true, hidden:true}));   /* one on each (Acts 2:3) */
/* THE GRAIN SHIP OF ALEXANDRIA (27:6, 37): the lake's boat built two and a fifth times as large */
const SC=2.2, SX=110, SFLOOR=-0.1-0.42*SC;
const ABOARD=(id,dx,dz,o)=>Object.assign({id,at:[SX+dx,dz],y:SFLOOR},o||{});

STORY.act({
  id:'ends-of-earth', n:9, num:'VIII', title:'To the End of the Earth',
  sub:'The Festival of weeks · Sha’ul · Shomeron · Rome',
  cast:{
    nations:{name:'The crowd', key:'the crowd at the festival of weeks', kind:'crowd', actor:'n2', actors:['n0','n1','n2','n3','n4','n5']},
    mockers:{name:'Others, mocking', key:'others mocking', kind:'man', actor:'n4'},
    lame:{name:'A man lame from birth', key:'the lame man at the gate', kind:'man'},
    freedmen:{name:'Men put up to it', key:'men instigated against Stephanos', kind:'man', actor:'fr0', actors:['fr0','fr1']},
    witnesses:{name:'False witnesses', key:'false witnesses against Stephanos', kind:'man', actor:'fr1', actors:['fr0','fr1']},
    kohen:{name:'The kohen gadol', key:'Qayapha', kind:'oldman', actor:'kohenG'},
    malak:{name:'A mal’ak of (YAHUAH) HWHY', kind:'angel', glow:'malak'},
    ruach:{name:'The Ruach', key:'the ruach haqadash', kind:'divine'},
    master:{name:'Yahusha', key:'Yahusha', kind:'yahusha', glow:'light'},
    voice:{name:'A voice', key:'the voice to Kepha', kind:'divine', glow:'opened'},     /* out of the opened shamayim (10:11-13) */
    damascenes:{name:'All who heard', key:'those in the qahalim of damascus', kind:'crowd', actor:'dq0', actors:['dq0','dq1','dq2']},
    men:{name:'The men from Cornelius', key:'the men sent from Cornelius', kind:'man', actor:'sent0', actors:['sent0','sent1','sent2']},
    cornelius:{name:'Cornelius', key:'Cornelius', kind:'man', folk:'roman'},
    philosophers:{name:'Some of the philosophers', key:'the philosophers of athens', kind:'man', actor:'ph0', actors:['ph0','ph1','ph2']},
    athenians:{name:'The Athenians', key:'the athenians', kind:'crowd', actor:'ph2', actors:['ph0','ph1','ph2','ph3']},
    islanders:{name:'The islanders', key:'the islanders of melite', kind:'crowd', actor:'is0', actors:['is0','is1','is2','is3']},
    leaders:{name:'The leaders of the Yahuḏim', key:'the leaders of the yahudim at rome', kind:'oldman', actor:'ld0', actors:['ld0','ld1','ld2']}
  },
  scenes:[

  /* ---------------- VIII.1 — THE FESTIVAL OF WEEKS ---------------- */
  { id:'shavuot', title:'Yahrushalayim', date:'the Festival of weeks', place:'upperroom', time:'day',
    player:{ at:[21,33], face:-Math.PI*0.75, look:ADULT },
    crowds:[ {id:'pilgrims', n:340, area:[2,-8,40,23], look:['urHouse',0,0], keep:[[10,18,26,25.6]]} ],
    actors:[
      ...ROOM(ELEVEN),
      Object.assign({id:'miryam', at:[21,29], face:-Math.PI/2, sit:true},MIRYAM),
      Object.assign({id:'magdala', at:[21,31.8], face:-Math.PI/2, sit:true},MAGDALA),
      Object.assign({id:'yohanah', at:[13.4,31.8], face:Math.PI*0.75, sit:true},YOHANAH),
      ...folk('n',6,[8,14,26,20],0)
    ],
    glows:TONGUES,
    beats:[
      {t:'cam', from:[13,4.6,26.9], look:[18,3,31], dur:0.1},
      {t:'read', ref:'ACTS 2:1'},
      {t:'weather', wind:[5,2]},
      {t:'quake', s:1.4},
      {t:'read', ref:'ACTS 2:2'},
      {t:'show', id:ids(TONGUES)},
      {t:'read', ref:'ACTS 2:3'},
      /* "and settled on each one of them": close over their heads, a flame on each */
      {t:'cam', from:[13.4,5.2,27.4], look:[16.6,4.2,30], dur:2},
      {t:'quake', s:0.8},
      {t:'read', ref:'ACTS 2:4'},
      {t:'weather', wind:[0.6,0.2]},
      {t:'cam', from:['urHouse',-14,-20], fdy:10, look:['urHouse',0,-6], dur:2.5},
      {t:'read', ref:'ACTS 2:5'},
      {t:'read', ref:'ACTS 2:6'},
      {t:'say', who:'nations', ref:'ACTS 2:7', turn:false},
      {t:'say', who:'nations', ref:'ACTS 2:8', turn:false},
      {t:'say', who:'nations', ref:'ACTS 2:9-11', turn:false},
      {t:'say', who:'nations', ref:'ACTS 2:12', turn:false},
      {t:'say', who:'mockers', ref:'ACTS 2:13', turn:false},
      /* they go down into the street */
      {t:'hide', id:ids(TONGUES)},
      {t:'stand', who:ELEVEN},
      {t:'move', who:ELEVEN, to:ELEVEN.map((id,k)=>['urHouse',-5+k*1.0,-1.6-(k%2)*0.8]), speed:1.6},
      {t:'cam', release:true},
      {t:'goal', text:'Go down into the street with them', goto:['urHouse',3,-4], r:3},
      {t:'face', who:'kepha', to:'n2'},
      {t:'cam', from:['urHouse',-4,-9], fdy:2.4, look:'kepha', dur:2},
      {t:'say', who:'kepha', ref:'ACTS 2:14', turn:false},
      {t:'say', who:'kepha', ref:'ACTS 2:15', turn:false},
      {t:'say', who:'kepha', ref:'ACTS 2:16', turn:false},
      {t:'say', who:'kepha', ref:'ACTS 2:17', turn:false},
      {t:'say', who:'kepha', ref:'ACTS 2:21', turn:false},
      {t:'say', who:'kepha', ref:'ACTS 2:22', turn:false},
      {t:'say', who:'kepha', ref:'ACTS 2:23', turn:false},
      {t:'say', who:'kepha', ref:'ACTS 2:24', turn:false},
      {t:'say', who:'kepha', ref:'ACTS 2:32', turn:false},
      {t:'say', who:'kepha', ref:'ACTS 2:33', turn:false},
      {t:'say', who:'kepha', ref:'ACTS 2:36', turn:false},
      {t:'cam', from:['urHouse',4,-3], fdy:3.4, look:['urHouse',-2,-14], dur:2.4},
      {t:'say', who:'nations', ref:'ACTS 2:37', turn:false},
      {t:'say', who:'kepha', ref:'ACTS 2:38', turn:false},
      {t:'say', who:'kepha', ref:'ACTS 2:39', turn:false},
      {t:'read', ref:'ACTS 2:40', voices:['kepha']},
      {t:'read', ref:'ACTS 2:41'},
      {t:'choice', prompt:'You', options:[
        {text:'Listen for your own language', reply:'You hear it — the speech of your own village, from the mouth of a fisherman of Galil who has never been there.'},
        {text:'Go down to the pools with them', reply:'Three thousand. The pools below the House are full all day, and the steps are wet to the top.'} ]},
      {t:'end'}
    ]},

  /* ---------------- VIII.2 — THE FIRST ASSEMBLY ---------------- */
  { id:'assembly', title:'The upper room', date:'in those days', place:'upperroom', time:'lamplit',
    player:{ at:[21,33], face:-Math.PI*0.75, look:ADULT },
    actors:[
      ...ROOM(ELEVEN),
      Object.assign({id:'miryam', at:[21,29], face:-Math.PI/2, sit:true},MIRYAM),
      Object.assign({id:'magdala', at:[21,31.8], face:-Math.PI/2, sit:true},MAGDALA),
      ...folk('a',4,[13,32.6,20,33.2],Math.PI,{sit:true})
    ],
    things:[ {id:'loaf0', kind:'box', at:[15.6,30], y:F+0.38, w:0.32, h:0.12, d:0.22, color:0xd8c08a},
             {id:'loaf1', kind:'box', at:[17,30.1], y:F+0.38, w:0.32, h:0.12, d:0.22, color:0xd8c08a},
             {id:'loaf2', kind:'box', at:[18.4,29.9], y:F+0.38, w:0.32, h:0.12, d:0.22, color:0xd8c08a} ],
    beats:[
      {t:'cam', from:[13,4.6,26.9], look:[18,3,31], dur:0.1},
      {t:'read', ref:'ACTS 2:42'},
      {t:'cam', release:true},
      {t:'witness', text:'Break the bread and pass it round the table', items:['loaf0','loaf1','loaf2'], verb:'Break the bread', hold:0.6, reach:2.6},
      {t:'hide', id:['loaf0','loaf1','loaf2']},
      {t:'cam', from:[21.4,4.4,26.8], look:[16.4,3.1,31.4], dur:2},
      {t:'read', ref:'ACTS 2:43'},
      {t:'read', ref:'ACTS 2:44'},
      {t:'read', ref:'ACTS 2:45'},
      {t:'read', ref:'ACTS 2:46'},
      {t:'read', ref:'ACTS 2:47'},
      {t:'read', ref:'ACTS 4:32'},
      {t:'read', ref:'ACTS 4:33'},
      {t:'read', ref:'ACTS 4:34'},
      {t:'read', ref:'ACTS 4:35'},
      {t:'choice', prompt:'You', options:[
        {text:'Lay something at their feet', reply:'You have not much. You lay it down with the rest. A widow from Hebron takes bread from the same basket.'},
        {text:'Eat with them', reply:'Gladness and simplicity of heart. You had not known there was such a thing to eat with.'} ]},
      {t:'end'}
    ]},

  /* ---------------- VIII.3 — THE LOVELY GATE ---------------- */
  { id:'lame', title:'The courts of the House', date:'the ninth hour, the hour of prayer', place:'courts', time:'day',
    player:{ at:['womenCourt',-7,-5], face:Math.PI/2, look:ADULT },
    crowds:[ {id:'worshippers', n:240, area:[-30,-62,24,-30], look:'womenCourt', keep:[[-14,-44,8,-36]]} ],
    actors:[
      T('kepha',['southSteps',0,0],{face:Math.PI/2}), T('yahuchanon',['southSteps',-0.8,1.2],{face:Math.PI/2}),
      {id:'lameM', name:'A man lame from birth', key:'the lame man at the gate', at:['womenCourt',-5,-3], face:-Math.PI/2, sit:true, robe:0x6b5a44, cloth:0x8a7a60, beard:0x3a2a1e, skin:0x704a27}
    ],
    beats:[
      {t:'cam', from:['womenCourt',-14,-10], fdy:3.4, look:['womenCourt',-5,-3], dur:0.1},
      {t:'move', who:['kepha','yahuchanon'], to:[['womenCourt',-7.4,-3.4],['womenCourt',-7.6,-2.2]], speed:1, wait:false},
      {t:'read', ref:'ACTS 3:1'},
      {t:'read', ref:'ACTS 3:2'},
      {t:'read', ref:'ACTS 3:3'},
      {t:'face', who:'kepha', to:'lameM'}, {t:'face', who:'yahuchanon', to:'lameM'}, {t:'face', who:'lameM', to:'kepha'},
      {t:'cam', from:['womenCourt',-8.6,-5.6], fdy:2, look:'lameM', dur:1.8},
      {t:'say', who:'kepha', ref:'ACTS 3:4', turn:false},
      {t:'read', ref:'ACTS 3:5'},
      {t:'say', who:'kepha', ref:'ACTS 3:6', turn:false},
      {t:'stand', who:'lameM'},
      {t:'read', ref:'ACTS 3:7'},
      /* "and leaping up, he stood and walked … walking and leaping and praising Aluah" */
      {t:'drift', id:'lameM', by:[0,0.45,0], dur:0.28, hold:true}, {t:'drift', id:'lameM', by:[0,-0.45,0], dur:0.3},
      {t:'drift', id:'lameM', by:[0,0.45,0], dur:0.28}, {t:'drift', id:'lameM', by:[0,-0.45,0], dur:0.3},
      {t:'place', who:'lameM', at:'lameM', y:null},
      {t:'move', who:'lameM', to:['womenCourt',-2,-0.6], speed:3, wait:false},
      {t:'read', ref:'ACTS 3:8'},
      {t:'drift', id:'lameM', by:[0,0.45,0], dur:0.28, hold:true}, {t:'drift', id:'lameM', by:[0,-0.45,0], dur:0.3},
      {t:'drift', id:'lameM', by:[0,0.45,0], dur:0.28}, {t:'drift', id:'lameM', by:[0,-0.45,0], dur:0.3},
      {t:'drift', id:'lameM', by:[0,0.45,0], dur:0.28}, {t:'drift', id:'lameM', by:[0,-0.45,0], dur:0.3},
      {t:'place', who:'lameM', at:'lameM', y:null},
      {t:'move', who:'lameM', to:['womenCourt',0.4,2], speed:3, wait:false},
      {t:'move', who:['kepha','yahuchanon'], to:[['womenCourt',-0.6,1.2],['womenCourt',-1.2,2.4]], speed:1, wait:false},
      {t:'cam', from:['womenCourt',-9,-7], fdy:4, look:'lameM', dur:3},
      {t:'read', ref:'ACTS 3:9'},
      {t:'read', ref:'ACTS 3:10'},
      {t:'cam', release:true},
      {t:'choice', prompt:'You', options:[
        {text:'Look at his feet', reply:'You have walked past him every Pesach since you were a boy. You never once looked at his feet.'},
        {text:'Go in after them', reply:'He is still leaping. Nobody tells him to stop.'} ]},
      {t:'end'}
    ]},

  /* ---------------- VIII.4 — STEPHANOS BEFORE THE COUNCIL ---------------- */
  { id:'stephen', title:'The council', date:'in those days', place:'highpriest', time:'day',
    player:{ at:[15.4,33.6], face:-Math.PI*0.75, look:ADULT },
    actors:[
      Object.assign({id:'stephanos', at:'accused', face:Math.PI},STEPHANOS),
      {id:'kohenG', name:'The kohen gadol', key:'Qayapha', dress:'kohen', at:'qayapha', face:0, robe:0x3a3a6a, cloth:0xe8e0cc, beard:0x6d6a66, kind:'oldman', sit:true, bench:true},
      ...folk('o',10,[5.6,24.8,18.4,25.4],0,{dress:'scribe', kind:'oldman', sit:true, bench:true}),
      {id:'fr0', name:'Men put up to it', at:['accused',-2.4,1.4], face:Math.PI, robe:0x6a5a3a, cloth:0xcfc4aa, beard:0x2c241f},
      {id:'fr1', at:['accused',2.4,1.6], face:Math.PI, robe:0x5a4a3a, cloth:0xb9ab8e, beard:0x1e1814},
      Object.assign({id:'shaul', at:['fire',2.4,0.6], face:Math.PI*1.1},SHAUL),
      ...folk('h',6,[9,30,17,34],Math.PI)
    ],
    things:[ {id:'seatK', kind:'throne', style:'kohen', at:'qayapha', face:0} ],
    glows:[ {id:'face', at:['accused',0,0], dy:1.75, size:0.9, color:0xfff6dc, intensity:0.7, hidden:true},
            {id:'opened', at:['accused',0,-2], dy:9, size:10, color:0xfff6dc, intensity:2, pulse:true, hidden:true} ],
    beats:[
      {t:'cam', from:[20,4.4,35], look:[12,1.4,27], dur:0.1},
      {t:'read', ref:'ACTS 6:8'},
      {t:'read', ref:'ACTS 6:9'},
      {t:'read', ref:'ACTS 6:10'},
      {t:'say', who:'freedmen', ref:'ACTS 6:11', turn:false},
      {t:'read', ref:'ACTS 6:12'},
      {t:'say', who:'witnesses', ref:'ACTS 6:13', turn:false},
      {t:'say', who:'witnesses', ref:'ACTS 6:14', turn:false},
      {t:'show', id:'face'},
      {t:'cam', from:['accused',2.2,-2.4], fdy:1.8, look:'stephanos', dur:2},
      {t:'read', ref:'ACTS 6:15'},
      {t:'say', who:'kohen', ref:'ACTS 7:1', turn:false},
      {t:'say', who:'stephanos', ref:'ACTS 7:2', turn:false},
      {t:'note', text:'Stephanos tells them the whole history of their fathers — Aḇrahim, Yosĕph, Mosheh in the wilderness, the tent of witness, the house Shelomoh built. This is how he ends.'},
      {t:'say', who:'stephanos', ref:'ACTS 7:48', turn:false},
      {t:'say', who:'stephanos', ref:'ACTS 7:49-50', turn:false},
      {t:'say', who:'stephanos', ref:'ACTS 7:51', turn:false},
      {t:'say', who:'stephanos', ref:'ACTS 7:52', turn:false},
      {t:'say', who:'stephanos', ref:'ACTS 7:53', turn:false},
      {t:'cam', from:[20,4.4,35], look:[12,1.4,26], dur:2},
      {t:'read', ref:'ACTS 7:54'},
      {t:'show', id:'opened'},
      {t:'cam', from:['accused',1.6,2.6], fdy:1.4, look:'opened', dur:2.5},
      {t:'read', ref:'ACTS 7:55'},
      {t:'say', who:'stephanos', ref:'ACTS 7:56', turn:false},
      {t:'end'}
    ]},

  /* ---------------- VIII.5 — OUTSIDE THE CITY ---------------- */
  { id:'stoning', title:'Outside the city', date:'the same day', place:'olivet', time:'day',
    player:{ at:['qidron',6,6], face:-Math.PI*0.75, look:ADULT },
    crowds:[ {id:'mob', n:90, ring:['qidron',5,11], look:'qidron', dy:6} ],
    actors:[
      Object.assign({id:'stephanos', at:'cityPath', face:Math.PI/2},STEPHANOS),
      ...folk('m',8,[42,-61,46,-55],Math.PI/2),
      Object.assign({id:'shaul', at:['qidron',-3,-4], face:Math.PI*0.25},SHAUL),
      ...folk('d',3,[60,-54,64,-50],-Math.PI*0.75)
    ],
    things:[ {id:'cloaks', kind:'box', at:['qidron',-2.4,-3.2], w:1.1, h:0.24, d:0.8, color:0x7c6a52, hidden:true} ],
    beats:[
      {t:'cam', from:['qidron',10,6], fdy:4, look:['cityPath',0,0], dur:0.1},
      {t:'move', who:['stephanos','m0','m1','m2','m3','m4','m5','m6','m7'], to:['qidron',['qidron',-1.4,-1.6],['qidron',-1.6,1.4],['qidron',1.6,-1.6],['qidron',1.4,1.8],['qidron',2.6,0],['qidron',-2.6,0.2],['qidron',0.2,2.8],['qidron',0,-2.8]], speed:1.6, wait:false},
      {t:'read', ref:'ACTS 7:57'},
      {t:'show', id:'cloaks'},
      {t:'face', who:'shaul', to:'stephanos'},
      {t:'cam', from:['qidron',-6,-7], fdy:1.9, look:'shaul', dur:2.5},
      {t:'read', ref:'ACTS 7:58'},
      {t:'note', text:'What was done to Stephanos is told here as the Besorah tells it. It is not shown.'},
      {t:'say', who:'stephanos', ref:'ACTS 7:59', turn:false},
      {t:'sit', who:'stephanos'},
      {t:'say', who:'stephanos', ref:'ACTS 7:60', turn:false},
      {t:'lie', who:'stephanos'},
      {t:'move', who:['m0','m1','m2','m3','m4','m5','m6','m7'], to:ELEVEN.slice(0,8).map((id,k)=>['cityPath',-2+(k%3),-1.6+Math.floor(k/3)*1.4]), speed:1.4, wait:false},
      {t:'hide', id:'mob'},
      {t:'cam', from:['qidron',-5,-5.6], fdy:1.7, look:'shaul', dur:2},
      {t:'read', ref:'ACTS 8:1'},
      {t:'move', who:['d0','d1','d2'], to:[['qidron',1.2,1],['qidron',1.4,-0.8],['qidron',-1.2,1.2]], speed:0.8, wait:false},
      {t:'move', who:'shaul', to:['cityPath',0,0], speed:1.4, wait:false},
      {t:'cam', release:true},
      {t:'goal', text:'Go and kneel with the men who have come for him', goto:['qidron',0,1.6], r:2},
      {t:'sit', who:['d0','d1','d2']},
      {t:'cam', from:['qidron',4,4], fdy:2, look:['qidron',0,0], dur:2.5},
      {t:'read', ref:'ACTS 8:2'},
      {t:'read', ref:'ACTS 8:3'},
      {t:'read', ref:'ACTS 8:4'},
      {t:'choice', prompt:'You', options:[
        {text:'Remember the young man\'s face', reply:'Sha’ul. You heard someone call him that. He held the coats and watched it all, and did not look away once.'},
        {text:'Remember what Stephanos said last', reply:'"Do not hold this sin against them." You have heard those words before, on a hill outside another gate.'} ]},
      {t:'end'}
    ]},

  /* ---------------- VIII.6 — THE ROAD DOWN TO AZZAH ---------------- */
  { id:'ethiopian', title:'The road to Azzah', date:'"this is desert"', place:'gazaroad', time:'day',
    player:{ at:['hill',2.4,2], face:Math.PI/2, look:ADULT },
    actors:[
      Object.assign({id:'philipE', at:'hill', face:Math.PI/2},PHILIP_E),
      Object.assign({id:'kushi', at:'road0', face:-Math.PI/2},KUSHI),
      /* "he commanded the chariot to stand still" (8:38): his driver, a man of Kush in white linen */
      {id:'driver', name:'His driver', at:['road0',0,3], face:-Math.PI/2, robe:0xe8e0cc, cloth:0x9a1e1a, sash:0xd4af37, beard:0x1a1210, skin:0x3a2416}
    ],
    /* his carriage of state, canopied and gilded, room in it for him and a guest and the driver */
    things:[ {id:'chariot', kind:'chariot', at:'road0', face:-Math.PI/2} ],
    glows:[ {id:'malak', at:['hill',0,-2], dy:3.2, size:4, color:0xfff6dc, intensity:1.6, pulse:true, hidden:true},
            {id:'flash', at:'waterIn', dy:1.6, size:6, color:0xfff6dc, intensity:2.4, hidden:true} ],
    beats:[
      {t:'ride', who:'kushi', on:'chariot'},
      {t:'aboard', who:'driver', on:'chariot', at:[0,1.30,0.93]},
      {t:'cam', from:['hill',-6,-8], fdy:4, look:['hill',0,0], dur:0.1},
      {t:'show', id:'malak'},
      {t:'say', who:'malak', ref:'ACTS 8:26', turn:false},
      {t:'hide', id:'malak'},
      {t:'move', who:'kushi', to:'road2', speed:1.1, wait:false},
      {t:'cam', from:['road1',4,10], fdy:3, look:'kushi', dur:3},
      {t:'read', ref:'ACTS 8:27'},
      {t:'read', ref:'ACTS 8:28'},
      {t:'say', who:'ruach', ref:'ACTS 8:29', turn:false},
      {t:'move', who:'philipE', to:['road2',0.4,-2.6], speed:3.6, wait:false},
      {t:'cam', release:true},
      {t:'goal', text:'Run with Philip after the chariot', goto:['road2',2,-4], r:3.4},
      {t:'face', who:'philipE', to:'kushi'}, {t:'face', who:'kushi', to:'philipE'},
      {t:'cam', from:['road2',-3,-6], fdy:2.4, look:'kushi', dur:1.8},
      {t:'say', who:'philipE', ref:'ACTS 8:30', turn:false},
      {t:'say', who:'kushi', ref:'ACTS 8:31', turn:false},
      {t:'aboard', who:'philipE', on:'chariot', at:[0.38,0,-0.83]},          /* up beside him, on the bench */
      {t:'cam', from:{rel:'chariot', off:[4.2,2.6,-3.4]}, look:'kushi', dur:2},
      {t:'say', who:'kushi', ref:'ACTS 8:32', turn:false},
      {t:'say', who:'kushi', ref:'ACTS 8:33', turn:false},
      {t:'say', who:'kushi', ref:'ACTS 8:34', turn:false},
      {t:'read', ref:'ACTS 8:35'},
      {t:'fulfil', id:'y53-5'},
      {t:'move', who:'kushi', to:'stop', speed:1},
      {t:'face', who:'kushi', to:'water'},
      {t:'cam', from:['stop',4,-6], fdy:2.6, look:['water',0,0], dur:2},
      {t:'say', who:'kushi', ref:'ACTS 8:36', turn:false},
      {t:'say', voices:['philipE','kushi'], ref:'ACTS 8:37', turn:false},
      {t:'cam', release:true},
      {t:'witness', text:'He has commanded the chariot to stand still — hold the horses', items:['chariot'], verb:'Hold the horses', hold:1.2, reach:4},
      {t:'ride', who:'kushi', off:true},
      {t:'aboard', who:'philipE', off:true},
      {t:'move', who:['philipE','kushi'], to:[['waterIn',-0.8,0],['waterIn',0.8,0]], speed:1},
      {t:'cam', from:['bank',2,-3], fdy:1.8, look:['waterIn',0,0], dur:2},
      {t:'read', ref:'ACTS 8:38'},
      {t:'sit', who:'kushi'}, {t:'wait', s:1.2}, {t:'stand', who:'kushi'},
      {t:'show', id:'flash'},
      {t:'hide', id:'philipE'},
      {t:'read', ref:'ACTS 8:39'},
      {t:'hide', id:'flash'},
      {t:'move', who:'kushi', to:'stop', speed:1.4},
      {t:'ride', who:'kushi', on:'chariot'},
      {t:'face', who:'kushi', to:'roadW'},
      {t:'move', who:'kushi', to:'roadW', speed:1.2, wait:false},
      {t:'cam', from:['stop',6,4], fdy:3, look:['roadW',20,0], dur:4},
      {t:'read', ref:'ACTS 8:40'},
      {t:'choice', prompt:'You', options:[
        {text:'Watch the chariot go', reply:'South, toward Kush, at the edge of the world. He is singing. You can hear it a long way down the road.'},
        {text:'Look for Philip', reply:'There is no one at the water but you, and the reeds, and his footprints going in.'} ]},
      {t:'end'}
    ]},

  /* ---------------- VIII.7 — THE ROAD TO DAMASCUS ---------------- */
  { id:'damascusRoad', title:'Near Damascus', date:'about noon', place:'damascus', time:'day',
    player:{ at:['road0',-2,2.4], face:Math.PI/2, look:ADULT },
    actors:[
      Object.assign({id:'shaul', at:'road0', face:Math.PI/2},SHAUL),
      {id:'g0', at:['road0',-1.4,-1.4], face:Math.PI/2, robe:0x5a4a3a, cloth:0x6a5a44, beard:0x2c241f, sash:0x6e5238},
      {id:'g1', at:['road0',-2.4,0.4], face:Math.PI/2, robe:0x6a5a3a, cloth:0x7a6a54, beard:0x1e1814, sash:0x6e5238},
      {id:'g2', at:['road0',-1.2,1.6], face:Math.PI/2, robe:0x4a3a2a, cloth:0x9a8a70, beard:0x3a2a1e, sash:0x6e5238}
    ],
    glows:[ {id:'light', at:['light',0,0], dy:6, size:26, color:0xfffbea, intensity:3.2, pulse:true, hidden:true} ],
    beats:[
      {t:'cam', from:['road1',-6,10], fdy:3.4, look:['road0',0,0], dur:0.1},
      {t:'move', who:['shaul','g0','g1','g2'], to:['light',['light',-1.2,-1.4],['light',-2.2,0.4],['light',-1,1.6]], speed:1.2, wait:false},
      {t:'read', ref:'ACTS 9:1'},
      {t:'read', ref:'ACTS 9:2'},
      {t:'cam', from:['light',-10,8], fdy:3, look:['light',0,0], dur:2},
      {t:'show', id:'light'},
      {t:'quake', s:1.2},
      {t:'read', ref:'ACTS 9:3'},
      {t:'lie', who:'shaul', prone:true},
      {t:'cam', from:['light',-5,4], fdy:2.6, look:['light',0,0], dur:1.6},
      {t:'say', who:'master', ref:'ACTS 9:4', turn:false},
      {t:'say', voices:['shaul','master'], ref:'ACTS 9:5', turn:false},
      {t:'say', voices:['shaul','master'], ref:'ACTS 9:6', turn:false},
      {t:'read', ref:'ACTS 9:7'},
      {t:'hide', id:'light'},
      {t:'stand', who:'shaul'},
      {t:'read', ref:'ACTS 9:8'},
      {t:'cam', release:true},
      {t:'follow', who:'shaul', target:'player'},
      {t:'goal', text:'He cannot see — take his hand and lead him into Damascus', goto:'gateIn', r:3},
      {t:'stop', who:'shaul'},
      {t:'read', ref:'ACTS 9:9'},
      {t:'end'}
    ]},

  /* ---------------- VIII.8 — THE STREET CALLED STRAIGHT ---------------- */
  { id:'straight', title:'Damascus', date:'three days after', place:'damascus', time:'day',
    player:{ at:['straight',3,1.6], face:Math.PI/2, look:ADULT },
    actors:[
      Object.assign({id:'hananyah', at:'hananyah', face:0},HANANYAH),
      Object.assign({id:'shaul', at:'bed', face:-Math.PI/2, sit:true},SHAUL),
      ...folk('dq',3,[-14,-2,-6,2],Math.PI/2)
    ],
    things:[ {id:'food', kind:'basket', at:['straight',6,1.4], full:true} ],
    /* the Master in a vision: light, as on the road (the speaker's glow is 'light') */
    glows:[ {id:'light', at:['hananyah',0,-1.6], dy:2.4, size:2.6, color:0xfff6dc, intensity:1.2, pulse:true, hidden:true},
            /* "something like scales fell from his eyes" (9:18) */
            {id:'scales', at:['bed',-0.2,0], dy:1.2, size:0.9, color:0xfffbea, intensity:0.6, hidden:true} ],
    beats:[
      {t:'cam', from:['hananyah',-5,5], fdy:2.4, look:'hananyah', dur:0.1},
      {t:'show', id:'light'},
      {t:'say', voices:['master','hananyah'], ref:'ACTS 9:10', turn:false},
      {t:'say', who:'master', ref:'ACTS 9:11', turn:false},
      {t:'say', who:'master', ref:'ACTS 9:12', turn:false},
      {t:'say', who:'hananyah', ref:'ACTS 9:13', turn:false},
      {t:'say', who:'hananyah', ref:'ACTS 9:14', turn:false},
      {t:'say', who:'master', ref:'ACTS 9:15', turn:false},
      {t:'say', who:'master', ref:'ACTS 9:16', turn:false},
      {t:'hide', id:'light'},
      {t:'move', who:'hananyah', to:'yahudahDoor', speed:1.2},
      {t:'move', who:'hananyah', to:['bed',-1.4,0], speed:1},
      {t:'face', who:'hananyah', to:'shaul'},
      {t:'cam', from:['yahudahIn',0,-1.4], fdy:1.9, look:'shaul', dur:2},
      {t:'pose', who:'hananyah', arms:'out'},                            /* "and laying his hands on him" */
      {t:'say', who:'hananyah', ref:'ACTS 9:17', turn:false},
      {t:'show', id:'scales'}, {t:'wait', s:0.35}, {t:'hide', id:'scales'},
      {t:'pose', who:'hananyah'},
      {t:'stand', who:'shaul'},
      {t:'read', ref:'ACTS 9:18'},
      {t:'cam', release:true},
      {t:'witness', text:'He has not eaten for three days — bring him the bread', items:['food'], verb:'Take up the basket', hold:0.5, deliver:'bed', r:2.4, carryText:'Bring it to him'},
      {t:'read', ref:'ACTS 9:19'},
      {t:'move', who:['shaul','hananyah'], to:[['straight',-6,0],['straight',-5,1.4]], speed:1.2},
      {t:'face', who:'shaul', to:'dq1'},
      {t:'cam', from:['straight',-2,3], fdy:2.2, look:'shaul', dur:2},
      {t:'read', ref:'ACTS 9:20'},
      {t:'say', who:'damascenes', ref:'ACTS 9:21', turn:false},
      {t:'read', ref:'ACTS 9:22'},
      {t:'choice', prompt:'You', options:[
        {text:'Look at his eyes', reply:'Clear. The man who could not see three days ago is reading the scroll of Yahshayahu aloud in the qahal.'},
        {text:'Remember the coats', reply:'You knew him at once. He does not know you. You do not tell him.'} ]},
      {t:'end'}
    ]},

  /* ---------------- VIII.9 — THE HOUSE-TOP AT YAPHO ---------------- */
  { id:'yapho', title:'Yapho', date:'about the sixth hour', place:'yapho', time:'day',
    player:{ at:['gate',3,-3], face:Math.PI/2, look:ADULT },
    actors:[
      T('kepha','roof',{face:Math.PI/2, y:'roofY', sit:true}),
      {id:'tanner', name:'Shim‛on the tanner', key:'Shimon the tanner', at:['tannerIn',0,1.4], face:-Math.PI/2, robe:0x5a4030, cloth:0xcfc4aa, beard:0x6d6a66, kind:'oldman'},
      {id:'sent0', name:'The men from Cornelius', at:['street',-8,-1], face:Math.PI/2, robe:0x6a5a44, cloth:0xd8ceb4, beard:0x2c241f, skin:0xa87a50},
      {id:'sent1', at:['street',-9,0.6], face:Math.PI/2, robe:0x5a5a6a, cloth:0xcfc4aa, skin:0xb08060},
      LEGION('sent2',['street',-10,-0.4],Math.PI/2)
    ],
    /* the vessel like a great linen sheet (10:11-12), let down before him over the yard by its four
       corners on cords of light, out of the opened shamayim; it goes up and comes down three times (10:16) */
    things:[ {id:'sheet', kind:'vision', at:'sheet', y:35.2, n:7, hidden:true} ],
    glows:[ {id:'sheetG', at:[14.8,40.5,-3], size:4, color:0xfffbea, intensity:0.35, pulse:true, hidden:true},
            {id:'opened', at:[14.8,52,-3], size:22, color:0xfff4d8, intensity:2.2, pulse:true, hidden:true} ],
    beats:[
      {t:'cam', from:['tanner',-8,8], fdy:5, look:'kepha', dur:0.1},
      {t:'read', ref:'ACTS 10:9'},
      {t:'read', ref:'ACTS 10:10'},
      {t:'show', id:['opened']},
      {t:'cam', from:[6.4,5.4,-1.2], look:[14.8,30,-3], dur:2.5},
      {t:'show', id:['sheet','sheetG']},
      {t:'drift', id:['sheet','sheetG'], by:[0,-30,0], dur:7, wait:false},
      {t:'read', ref:'ACTS 10:11'},
      {t:'cam', from:[6.0,6.2,-0.6], look:[14.8,5.0,-3], dur:3},
      {t:'cam', from:[19.0,8.6,2.2], look:[14.8,4.4,-3], dur:3},
      {t:'cam', from:[19.6,7.8,-8.6], look:[14.6,4.3,-3.2], dur:12, wait:false},
      {t:'read', ref:'ACTS 10:12'},
      {t:'cam', from:[10.4,9.6,-9.2], look:[13.8,4.6,-2.6], dur:3},
      {t:'say', who:'voice', ref:'ACTS 10:13', turn:false},
      {t:'cam', from:[10.7,5.0,-1.4], look:'kepha', dur:2.5},
      {t:'say', who:'kepha', ref:'ACTS 10:14', turn:false},
      {t:'cam', from:[9.8,13,4.4], look:[13.6,4.6,-3], dur:3},
      {t:'say', who:'voice', ref:'ACTS 10:15', turn:false},
      /* and again, and a third time */
      {t:'drift', id:['sheet','sheetG'], by:[0,30,0], dur:4},
      {t:'drift', id:['sheet','sheetG'], by:[0,-30,0], dur:4},
      {t:'wait', s:1.5},
      {t:'drift', id:['sheet','sheetG'], by:[0,30,0], dur:4},
      {t:'drift', id:['sheet','sheetG'], by:[0,-30,0], dur:4},
      {t:'cam', from:[6.4,5.4,-1.2], look:[14.8,24,-3], dur:3, wait:false},
      {t:'drift', id:['sheet','sheetG'], by:[0,40,0], dur:6, wait:false},
      {t:'read', ref:'ACTS 10:16'},
      {t:'hide', id:['sheet','sheetG','opened']},
      {t:'move', who:['sent0','sent1','sent2'], to:[['gate',-1.6,-0.6],['gate',-1.8,0.6],['gate',-2.6,0]], speed:1.2, wait:false},
      {t:'read', ref:'ACTS 10:17'},
      {t:'read', ref:'ACTS 10:18'},
      {t:'say', who:'ruach', ref:'ACTS 10:19', turn:false},
      {t:'say', who:'ruach', ref:'ACTS 10:20', turn:false},
      {t:'cam', release:true},
      {t:'goal', text:'Go and open the gate to the men', goto:'gate', r:2},
      {t:'place', who:'kepha', at:'stairFoot', y:null, face:-Math.PI/2},
      {t:'stand', who:'kepha'},
      {t:'move', who:'kepha', to:['gate',1.2,0], speed:1.2},
      {t:'face', who:'kepha', to:'sent0'},
      {t:'cam', from:['gate',3,3], fdy:2, look:'sent0', dur:2},
      {t:'say', who:'kepha', ref:'ACTS 10:21', turn:false},
      {t:'say', who:'men', ref:'ACTS 10:22', turn:false},
      {t:'read', ref:'ACTS 10:23'},
      {t:'choice', prompt:'You', options:[
        {text:'Look at the soldier', reply:'A Roman, at a Yahudi gate, asking for a fisherman by name. Kĕpha takes him in and gives him a bed.'},
        {text:'Ask Kĕpha what he saw', reply:'He looks at the sky for a while. "Nothing that Aluahim has cleansed," he says at last, "is common."'} ]},
      {t:'end'}
    ]},

  /* ---------------- VIII.10 — THE HOUSE OF CORNELIUS ---------------- */
  { id:'cornelius', title:'Caesarea', date:'the following day', place:'caesareaM', time:'day',
    player:{ at:['inner',1.4,3], face:Math.PI/2, look:ADULT },
    actors:[
      {id:'cornelius', name:'Cornelius', key:'Cornelius', folk:'roman', dress:'centurion', at:['door',-1.6,0], face:Math.PI/2},
      ...folk('rel',10,[-8,-6,2,6],Math.PI/2,{folk:'roman', dress:'man'}),
      T('kepha',['street',8,0],{face:-Math.PI/2}),
      ...folk('br',4,[22,-2,26,2],-Math.PI/2)
    ],
    things:[ {id:'jarC', kind:'jar', at:['inner',0,-2.4]} ],
    /* "the Set-apart Spirit fell upon all those hearing the word" (10:44): a flame over each head of the
       household where they stand — the women a little lower — and over Cornelius */
    glows:[[0.22,0.85,0.64],[1.58,2.92,-0.91],[-0.91,2.1,2.58],[0.3,2.1,-5.87],[1.68,2.0,-4.66],[-2.51,2.1,-0.16],
           [-6.79,2.1,3.79],[-1.63,2.92,-0.29],[-6.85,2.1,1.98],[1.4,3.02,-1.65],[-2.4,2.2,1.4]]
      .map((p,k)=>({id:'r'+k, at:p, size:0.5, color:0xff9a3a, intensity:k%2?0.5:0.8, pulse:true, hidden:true})),
    beats:[
      {t:'cam', from:['porch',6,6], fdy:3, look:['door',0,0], dur:0.1},
      {t:'move', who:['kepha','br0','br1','br2','br3'], to:['porch',['porch',1.4,-1],['porch',1.6,1],['porch',2.6,-0.4],['porch',2.8,0.8]], speed:1.2, wait:false},
      {t:'read', ref:'ACTS 10:24'},
      {t:'move', who:'cornelius', to:['door',1.2,0], speed:1},
      {t:'lie', who:'cornelius', prone:true},
      {t:'read', ref:'ACTS 10:25'},
      {t:'stand', who:'cornelius'},
      {t:'face', who:'kepha', to:'cornelius'},
      {t:'cam', from:['door',3.6,3], fdy:2, look:'cornelius', dur:1.8},
      {t:'say', who:'kepha', ref:'ACTS 10:26', turn:false},
      {t:'move', who:['kepha','cornelius'], to:[['court',3,0],['court',1.6,1.4]], speed:1},
      {t:'read', ref:'ACTS 10:27'},
      {t:'face', who:'kepha', to:'rel3'},
      {t:'cam', from:['court',5.4,-3], fdy:2.2, look:'kepha', dur:2},
      {t:'say', who:'kepha', ref:'ACTS 10:28', turn:false},
      {t:'say', who:'kepha', ref:'ACTS 10:29', turn:false},
      {t:'say', who:'cornelius', ref:'ACTS 10:30', turn:false},
      {t:'say', who:'cornelius', ref:'ACTS 10:31', turn:false},
      {t:'say', who:'cornelius', ref:'ACTS 10:32', turn:false},
      {t:'say', who:'cornelius', ref:'ACTS 10:33', turn:false},
      {t:'say', who:'kepha', ref:'ACTS 10:34', turn:false},
      {t:'say', who:'kepha', ref:'ACTS 10:35', turn:false},
      {t:'say', who:'kepha', ref:'ACTS 10:36', turn:false},
      {t:'say', who:'kepha', ref:'ACTS 10:38', turn:false},
      {t:'say', who:'kepha', ref:'ACTS 10:39', turn:false},
      {t:'say', who:'kepha', ref:'ACTS 10:40', turn:false},
      {t:'say', who:'kepha', ref:'ACTS 10:41', turn:false},
      {t:'say', who:'kepha', ref:'ACTS 10:42', turn:false},
      {t:'say', who:'kepha', ref:'ACTS 10:43', turn:false},
      {t:'show', id:['r0','r1','r2','r3','r4','r5','r6','r7','r8','r9','r10']},
      {t:'cam', from:['court',4,4], fdy:3.2, look:['court',-3,0], dur:2.5},
      {t:'read', ref:'ACTS 10:44'},
      {t:'read', ref:'ACTS 10:45'},
      {t:'read', ref:'ACTS 10:46'},
      {t:'say', who:'kepha', ref:'ACTS 10:47', turn:false},
      {t:'cam', release:true},
      {t:'witness', text:'Fetch water for them to be immersed', items:['jarC'], verb:'Take up the water jar', hold:0.6, deliver:'court', r:2.4, carryText:'Carry it to Kĕpha'},
      {t:'hide', id:['r0','r1','r2','r3','r4','r5','r6','r7','r8','r9','r10']},
      {t:'read', ref:'ACTS 10:48'},
      {t:'choice', prompt:'You', options:[
        {text:'Look at the Romans', reply:'A captain of the Italian regiment, his soldiers, his slaves, his wife\'s brothers. The fire came on them as it came on the eleven in the upper room. Kĕpha cannot stop smiling.'},
        {text:'Remember the words in Galil', reply:'"Make taught ones of all the nations." Here is the first house of them.'} ]},
      {t:'end'}
    ]},

  /* ---------------- VIII.11 — ANTIOCH ---------------- */
  { id:'antioch', title:'Antioch', date:'some years after', place:'antioch', time:'day',
    player:{ at:['street',4,2], face:Math.PI/2, look:ADULT },
    crowds:[ {id:'citizens', n:220, area:[-50,-10,50,10], path:[[-50,0],[50,0]], clear:1.4, jitter:6.3} ],
    actors:[
      Object.assign({id:'barnabah', at:['houseIn',-3,-1], face:Math.PI/2},BARNABAH),
      Object.assign({id:'shaul', at:['houseIn',-3,1], face:Math.PI/2},SHAUL),
      ...folk('q',8,[-5,9,3,17],-Math.PI/2,{sit:true})
    ],
    things:[ {id:'bundle0', kind:'box', at:['houseIn',1,-2], w:0.6, h:0.4, d:0.45, color:0x8a6a40},
             {id:'bundle1', kind:'box', at:['houseIn',1.6,-2.4], w:0.5, h:0.36, d:0.4, color:0x7a5a3a} ],
    beats:[
      {t:'cam', from:['street',-30,6], fdy:4, look:['street',0,0], dur:0.1},
      {t:'read', ref:'ACTS 11:19'},
      {t:'read', ref:'ACTS 11:20'},
      {t:'read', ref:'ACTS 11:21'},
      {t:'read', ref:'ACTS 11:22'},
      {t:'read', ref:'ACTS 11:23'},
      {t:'read', ref:'ACTS 11:24'},
      {t:'read', ref:'ACTS 11:25'},
      {t:'read', ref:'ACTS 11:26'},
      {t:'cam', release:true},
      {t:'goal', text:'Go in to the qahal', goto:'houseIn', r:2},
      {t:'cam', from:['houseIn',2.4,3.4], fdy:2.2, look:'barnabah', dur:2},
      {t:'read', ref:'ACTS 13:1'},
      {t:'say', who:'ruach', ref:'ACTS 13:2', turn:false},
      {t:'sit', who:['barnabah','shaul']},
      {t:'read', ref:'ACTS 13:3'},
      {t:'stand', who:['barnabah','shaul']},
      {t:'cam', release:true},
      {t:'witness', text:'Carry their bundles out to the road for them', items:['bundle0','bundle1'], verb:'Take up the bundle', hold:0.5, deliver:'east', r:3, carryText:'Carry it to the road east'},
      {t:'move', who:['barnabah','shaul'], to:[['east',0,-1],['east',0,1]], speed:1.3},
      {t:'choice', prompt:'You', options:[
        {text:'Say the new name to yourself', reply:'Natsarim. The people of Natsareth\'s man. They meant it as a joke here. It has stuck.'},
        {text:'Ask where they are going', reply:'"Where the Ruach sends," Barnaḇah says. Sha’ul is already looking at the sea.'} ]},
      {t:'end'}
    ]},

  /* ---------------- VIII.12 — THE HILL OF ARES ---------------- */
  { id:'athens', title:'Athens', date:'the second journey', place:'athens', time:'day',
    player:{ at:['agora',-3,2], face:-Math.PI/2, look:ADULT },
    crowds:[ {id:'agoracrowd', n:160, area:[6,-14,44,22], jitter:6.3, keep:[[16,2,22,8]]},
             {id:'hearers', n:110, ring:['areopagus',3,10], look:'areopagus', dy:8, hidden:true} ],
    actors:[
      Object.assign({id:'shaul', at:['agora',2,-2], face:-Math.PI/2},SHAUL),
      {id:'ph0', name:'Some of the philosophers', at:['agora',-1,-4], face:Math.PI/2, robe:0xe6e0cf, cloth:0xd8cfb8, beard:0x6d6a66, kind:'oldman', skin:0xb08060},
      {id:'ph1', at:['agora',0.4,-4.6], face:Math.PI/2, robe:0xc8b89a, cloth:0xd8cfb8, beard:0x2c241f, skin:0xa87a50},
      {id:'ph2', at:['agora',-1.6,-3], face:Math.PI/2, robe:0x8a6a5a, cloth:0xe6e0cf, beard:0x6d6a66, skin:0xb08060},
      {id:'ph3', at:['agora',-0.4,-5.4], face:Math.PI/2, robe:0x6a5a7a, cloth:0xd8cfb8, skin:0xa87a50},
      {id:'dionusios', name:'Dionusios', key:'Dionusios the Areopagite', at:['arFoot',2,2], face:-Math.PI/2, robe:0xf0ece0, cloth:0xd8cfb8, beard:0x9a948a, kind:'oldman', skin:0xb08060},
      {id:'damaris', name:'Damaris', key:'Damaris', kind:'woman', at:['arFoot',2.4,3.4], face:-Math.PI/2, robe:0x8a5a6a, cloth:0xe8e2d2, skin:0xb07a58}
    ],
    things:[ {id:'altarT', kind:'box', at:'altarFront', w:0.1, h:0.1, d:0.1, color:0xd8cfb8, dy:0.9} ],
    beats:[
      {t:'cam', from:['idols',8,6], fdy:3, look:['idols',0,0], dur:0.1},
      {t:'read', ref:'ACTS 17:16'},
      {t:'read', ref:'ACTS 17:17'},
      {t:'cam', release:true},
      {t:'witness', text:'Read what is written on the altar in the market-place', items:['altarT'], verb:'Read the altar', hold:1.0, reach:2.6},
      {t:'note', text:'Cut in the stone: ΑΓΝΩΣΤΩ ΘΕΩ — "to an unknown god". Such altars stood in Athens; the traveller Pausanias saw them on the road from the harbour.'},
      {t:'face', who:'ph0', to:'shaul'},
      {t:'cam', from:['agora',3,-6], fdy:2.2, look:'ph0', dur:2},
      {t:'say', voices:['ph0','ph1'], ref:'ACTS 17:18', turn:false},
      {t:'move', who:['shaul','ph0','ph1','ph2','ph3'], to:['areopagus',['areopagus',3,-2],['areopagus',3.2,0],['areopagus',3,2],['areopagus',4,1]], speed:1.3},
      {t:'show', id:'hearers'},
      {t:'face', who:'shaul', to:'ph1'},
      {t:'say', who:'athenians', ref:'ACTS 17:19', turn:false},
      {t:'say', who:'athenians', ref:'ACTS 17:20', turn:false},
      {t:'read', ref:'ACTS 17:21'},
      {t:'cam', from:['areopagus',7,4], fdy:2.6, look:'shaul', dur:2.5},
      {t:'say', who:'shaul', ref:'ACTS 17:22', turn:false},
      {t:'say', who:'shaul', ref:'ACTS 17:23', turn:false},
      {t:'say', who:'shaul', ref:'ACTS 17:24', turn:false},
      {t:'say', who:'shaul', ref:'ACTS 17:25', turn:false},
      {t:'say', who:'shaul', ref:'ACTS 17:26', turn:false},
      {t:'say', who:'shaul', ref:'ACTS 17:27', turn:false},
      {t:'say', who:'shaul', ref:'ACTS 17:28', turn:false},
      {t:'cam', from:['areopagus',-6,6], fdy:4, look:'acropolis', dur:3, wait:false},
      {t:'say', who:'shaul', ref:'ACTS 17:29', turn:false},
      {t:'cam', from:['areopagus',7,4], fdy:2.6, look:'shaul', dur:2},
      {t:'say', who:'shaul', ref:'ACTS 17:30', turn:false},
      {t:'say', who:'shaul', ref:'ACTS 17:31', turn:false},
      {t:'say', who:'athenians', ref:'ACTS 17:32', turn:false},
      {t:'move', who:'shaul', to:['arFoot',1,0], speed:1},
      {t:'read', ref:'ACTS 17:33'},
      {t:'face', who:'dionusios', to:'shaul'},
      {t:'cam', from:['arFoot',5,4], fdy:2, look:'dionusios', dur:2},
      {t:'read', ref:'ACTS 17:34'},
      {t:'choice', prompt:'You', options:[
        {text:'Look up at the house of Athena', reply:'White marble, gold, the finest house ever built for a god, the Athenians say. "He does not dwell in dwellings made with hands."'},
        {text:'Look at the ones who stayed', reply:'A judge of the hill of Ares, a woman named Damaris, a few others. That is all. It is enough to begin with.'} ]},
      {t:'end'}
    ]},

  /* ---------------- VIII.13 — THE NORTHEASTER ---------------- */
  { id:'storm', title:'The Great Sea', date:'after the Fast, in the winter', place:'malta', time:'dusk',
    /* a grain ship of Alexandria under Crete, two hundred and seventy-six souls aboard (27:37) —
       the captain of the guard, the soldiers, the prisoners, the sailors, Sha’ul — caught by the
       Northeaster and driven fourteen days, until she runs aground in a bay on Melite */
    player:{ at:[SX+1.1,0.8], face:0, look:ADULT },
    actors:[
      ABOARD('shaul',0,1.4,Object.assign({face:Math.PI},SHAUL)),
      ABOARD('captain',-1.2,3.6,{name:'The captain', key:'the captain julius', folk:'roman', dress:'centurion', face:Math.PI}),
      ABOARD('pilot',0,-7.4,{name:'The pilot', key:'the pilot of the ship', face:0, robe:0x5a4a3a, cloth:0x8a7a60, beard:0x6d6a66, skin:0x8a6038, kind:'oldman'}),
      ABOARD('s0',1.4,-4,{face:0, robe:0x6a5a44, cloth:0x9a8a70, beard:0x2c241f, skin:0x9a6a40}),
      ABOARD('s1',-1.4,-3,{face:0, robe:0x5a4a3a, cloth:0x8a7a60, beard:0x1e1814, skin:0x8a5a36}),
      ABOARD('s2',1.2,6,{face:Math.PI, robe:0x6a4a3a, cloth:0x9a8a70, skin:0x9a6a40}),
      LEGION('l0',[SX-1.6,1],Math.PI/2,{y:SFLOOR}), LEGION('l1',[SX-1.6,-1.2],Math.PI/2,{y:SFLOOR}),
      ABOARD('p0',0.6,-1.6,{face:Math.PI/2, robe:0x5c5040, cloth:0xa89a7e, beard:0x3a2a1e, sit:true, ground:true}),
      ABOARD('p1',-0.4,-1.4,{face:-Math.PI/2, robe:0x4f6a4f, cloth:0xb9ab8e, beard:0x2c241f, sit:true, ground:true})
    ],
    things:[ {id:'ship', kind:'boat', big:true, scale:SC, at:[SX,0], y:-0.1},
             {id:'skiff', kind:'boat', at:[SX+5.2,-8], y:-0.25, face:0.2, hidden:true},
             {id:'w0', kind:'box', at:[SX+0.8,4.2], y:SFLOOR, w:0.8, h:0.5, d:0.55, color:0xc8b07a},
             {id:'w1', kind:'box', at:[SX-0.7,5.2], y:SFLOOR, w:0.8, h:0.5, d:0.55, color:0xc8b07a},
             {id:'w2', kind:'box', at:[SX+0.2,6.4], y:SFLOOR, w:0.8, h:0.5, d:0.55, color:0xc8b07a} ],
    beats:[
      {t:'player', at:[SX+1.1,0.8], y:SFLOOR, lock:true, face:0},
      {t:'weather', wind:[1.4,0.4], rough:1},
      {t:'cam', from:[SX+22,9,-20], look:[SX,2,0], dur:0.1},
      {t:'read', ref:'ACTS 27:9'},
      {t:'cam', from:[SX+1.6,1.6,4.4], look:[SX,0.2,1.4], dur:1.8},
      {t:'say', who:'shaul', ref:'ACTS 27:10', turn:false},
      {t:'read', ref:'ACTS 27:11'},
      {t:'read', ref:'ACTS 27:13'},
      /* the Northeaster */
      {t:'weather', wind:[6,-2.6], rough:7, storm:0.9},
      {t:'time', to:'darkness'},
      {t:'cam', from:[SX+18,6,-16], look:[SX,1,0], dur:3},
      {t:'read', ref:'ACTS 27:14'},
      {t:'read', ref:'ACTS 27:15'},
      {t:'read', ref:'ACTS 27:18'},
      {t:'cam', release:true},
      {t:'witness', text:'She is breaking up in the seas — help them throw the cargo overboard', items:['w0','w1','w2'], verb:'Heave it over the side', hold:0.6, reach:2.8},
      {t:'hide', id:['w0','w1','w2']},
      {t:'read', ref:'ACTS 27:19'},
      {t:'read', ref:'ACTS 27:20'},
      {t:'face', who:'shaul', to:'captain'},
      {t:'cam', from:[SX+1.4,1.4,-1.6], look:'shaul', dur:2},
      {t:'say', who:'shaul', ref:'ACTS 27:21', turn:false},
      {t:'say', who:'shaul', ref:'ACTS 27:22', turn:false},
      {t:'say', who:'shaul', ref:'ACTS 27:23', turn:false},
      {t:'say', who:'shaul', ref:'ACTS 27:24', turn:false},
      {t:'say', who:'shaul', ref:'ACTS 27:25', turn:false},
      {t:'say', who:'shaul', ref:'ACTS 27:26', turn:false},
      {t:'time', to:'night'},
      {t:'read', ref:'ACTS 27:27'},
      {t:'read', ref:'ACTS 27:29'},
      {t:'show', id:'skiff'},
      {t:'move', who:['s0','s1'], to:[[SX+1.6,-6.4],[SX+1.4,-5.4]], speed:1.4, wait:false},
      {t:'read', ref:'ACTS 27:30'},
      {t:'face', who:'shaul', to:'captain'},
      {t:'say', who:'shaul', ref:'ACTS 27:31', turn:false},
      {t:'drift', id:'skiff', by:[18,0,-10], dur:5, wait:false},
      {t:'read', ref:'ACTS 27:32'},
      {t:'hide', id:'skiff'},
      {t:'time', to:'dawn'},
      {t:'weather', wind:[4,-1.6], rough:3.4, storm:0.4},
      {t:'cam', from:[SX+1.4,1.4,-1.6], look:'shaul', dur:2},
      {t:'say', who:'shaul', ref:'ACTS 27:33', turn:false},
      {t:'say', who:'shaul', ref:'ACTS 27:34', turn:false},
      {t:'read', ref:'ACTS 27:35'},
      {t:'read', ref:'ACTS 27:36'},
      {t:'read', ref:'ACTS 27:37'},
      {t:'read', ref:'ACTS 27:39'},
      /* she runs for the beach, and strikes where two seas meet */
      {t:'cam', from:[SX-40,8,-30], look:[SX-50,0,0], dur:2},
      {t:'drift', id:['ship','shaul','captain','pilot','s0','s1','s2','l0','l1','p0','p1','player'], by:[-64,0,0], dur:9},
      {t:'read', ref:'ACTS 27:40'},
      {t:'quake', s:1.6},
      {t:'read', ref:'ACTS 27:41'},
      {t:'read', ref:'ACTS 27:42'},
      {t:'read', ref:'ACTS 27:43'},
      {t:'place', who:'shaul', at:['beach',-2,1], y:null},
      {t:'place', who:'captain', at:['beach',-3,-1.4], y:null},
      {t:'place', who:'pilot', at:['beach',-2.4,3.2], y:null},
      {t:'place', who:'s0', at:['beach',-1.2,-3.2], y:null},
      {t:'place', who:'s1', at:['beach',-3.6,2.2], y:null},
      {t:'place', who:'s2', at:['beach',-1.6,4.6], y:null},
      {t:'place', who:'l0', at:['beach',-4,-3.2], y:null},
      {t:'place', who:'l1', at:['beach',-4.4,0.2], y:null},
      {t:'place', who:'p0', at:['beach',-2.8,-4.6], y:null},
      {t:'place', who:'p1', at:['beach',-1,5.8], y:null},
      {t:'stand', who:['p0','p1']},
      {t:'player', at:['beach',-2.4,-0.4], lock:false},
      {t:'weather', wind:[2,-0.8], rough:1.6, storm:0.25},
      {t:'cam', from:['beach',6,8], fdy:3, look:['beach',-2,0], dur:2.5},
      {t:'read', ref:'ACTS 27:44'},
      {t:'end'}
    ]},

  /* ---------------- VIII.14 — MELITE ---------------- */
  { id:'melite', title:'Melite', date:'the same day', place:'malta', time:'day',
    player:{ at:['fire',3,-2], face:-Math.PI/2, look:ADULT },
    actors:[
      Object.assign({id:'shaul', at:['fire',2,1.6], face:-Math.PI*0.75},SHAUL),
      {id:'captain', name:'The captain', key:'the captain julius', folk:'roman', dress:'centurion', at:['fire',3,-3.4], face:-Math.PI/2},
      ...folk('is',8,[0,-5,6,6],Math.PI/2),
      ...folk('sh',6,[10,-8,15,8],-Math.PI/2)
    ],
    things:[ {id:'wreck', kind:'boat', big:true, scale:SC, at:[46,0], y:-0.5, face:0.3},
             {id:'sticks0', kind:'box', at:['sticks',0,0], w:0.9, h:0.18, d:0.3, color:0x5d4a36},
             {id:'sticks1', kind:'box', at:['sticks',1.4,1], w:0.8, h:0.16, d:0.3, color:0x5d4a36},
             {id:'viper', kind:'box', at:['fire',1.6,1.1], dy:0.95, w:0.5, h:0.06, d:0.06, color:0x3a3020, hidden:true} ],
    beats:[
      {t:'weather', wind:[2,-0.8], rough:1.6, storm:0.3},
      {t:'cam', from:['beach',8,8], fdy:4, look:['fire',0,0], dur:0.1},
      {t:'read', ref:'ACTS 28:1'},
      {t:'read', ref:'ACTS 28:2'},
      {t:'cam', release:true},
      {t:'witness', text:'Gather sticks for the fire', items:['sticks0','sticks1'], verb:'Take up the sticks', hold:0.5, deliver:'fire', r:2.2, carryText:'Lay them on the fire'},
      {t:'move', who:'shaul', to:['fire',1.4,0.9], speed:1},
      {t:'show', id:'viper'},
      {t:'cam', from:['fire',4,3], fdy:1.8, look:'shaul', dur:1.8},
      {t:'read', ref:'ACTS 28:3'},
      {t:'say', who:'islanders', ref:'ACTS 28:4', turn:false},
      /* "he shook off the creature into the fire" */
      {t:'cam', from:['fire',3.4,2.6], fdy:2.4, look:[8.8,0.2,2.6], dur:1.4},
      {t:'drift', id:'viper', to:[8.1,-0.1,2.1], dur:0.6, wait:false},
      {t:'read', ref:'ACTS 28:5'},
      {t:'hide', id:'viper'},
      {t:'read', ref:'ACTS 28:6'},
      {t:'choice', prompt:'You', options:[
        {text:'Count the ones on the beach', reply:'Two hundred and seventy-six. You count them twice, as you counted the fish in Galil. Not one is missing.'},
        {text:'Look out at the wreck', reply:'The stern is gone. The bow is still fast on the bank where the two seas meet, and the waves are taking her apart plank by plank.'} ]},
      {t:'end'}
    ]},

  /* ---------------- VIII.15 — ROME ---------------- */
  { id:'rome', title:'Rome', date:'the two years', place:'rome', time:'day',
    player:{ at:['street',6,2], face:-Math.PI/2, look:ADULT },
    crowds:[ {id:'romans', n:260, area:[-40,-8,44,8], path:[[-40,0],[46,0]], clear:1.3, jitter:6.3, dy:3},
             {id:'visitors', n:40, area:[1.6,6,9,17], look:'door', dy:2, hidden:true} ],
    actors:[
      Object.assign({id:'shaul', at:['bridge',4,0], face:-Math.PI/2},SHAUL),
      LEGION('guard',['bridge',5.4,1.4],-Math.PI/2),
      ...[0,1,2].map(k=>({id:'ld'+k, name:k?undefined:'The leaders of the Yahuḏim', key:'the leaders of the yahudim at rome', at:['street',-14+k*1.4,-2.6], face:Math.PI/2, dress:'scribe', kind:'oldman', robe:[0xe6e0cf,0x5a5a6a,0x6a4a3a][k], beard:[0x6d6a66,0x9a948a,0x2c241f][k]}))
    ],
    things:[ {id:'scroll0', kind:'box', at:['street',8,3], w:0.5, h:0.16, d:0.16, color:0xe6dcc0},
             {id:'scroll1', kind:'box', at:['street',8.6,3.6], w:0.5, h:0.16, d:0.16, color:0xd8cba8} ],
    beats:[
      {t:'cam', from:['palatine',14,18], fdy:6, look:['street',0,0], dur:0.1},
      {t:'note', text:'Rome. On the Palatine, where the prologue saw a palisade of huts above the Tiber in the year the Romans count from, the houses of the Caesars stand now. Into this city, eight hundred years on, a prisoner from Yahrushalayim is walking.'},
      {t:'read', ref:'ACTS 28:14'},
      {t:'read', ref:'ACTS 28:15'},
      {t:'move', who:['shaul','guard'], to:['doorOut',['doorOut',1,1.2]], speed:1.1, wait:false},
      {t:'cam', from:['street',10,-8], fdy:3, look:['bridge',0,0], dur:3},
      {t:'read', ref:'ACTS 28:16'},
      {t:'move', who:'shaul', to:'seat', speed:1},
      {t:'sit', who:'shaul'},
      {t:'cam', release:true},
      {t:'witness', text:'Carry the scrolls of the Torah and the Naḇi’im in to him', items:['scroll0','scroll1'], verb:'Take up the scroll', hold:0.5, deliver:'seat', r:2.6, carryText:'Carry it to Sha’ul'},
      {t:'move', who:['ld0','ld1','ld2'], to:[['houseIn',-1,-1],['houseIn',-1.6,0.6],['houseIn',-0.4,1.6]], speed:1},
      {t:'show', id:'visitors'},
      {t:'cam', from:['houseIn',1,2.6], fdy:2, look:'shaul', dur:2.5},
      {t:'read', ref:'ACTS 28:23'},
      {t:'read', ref:'ACTS 28:24'},
      {t:'move', who:['ld0','ld1','ld2'], to:[['street',-6,-2],['street',-7,-1],['street',-8,-2.4]], speed:1, wait:false},
      {t:'cam', from:['houseIn',-1,-2.4], fdy:1.8, look:'shaul', dur:3},
      {t:'read', ref:'ACTS 28:30'},
      {t:'read', ref:'ACTS 28:31'},
      {t:'cam', from:['palatine',8,10], fdy:12, look:['tiber',0,0], dur:6},
      {t:'choice', prompt:'You', options:[
        {text:'Think of your family\'s scroll', reply:'Seven hundred years ago a man of your family copied out the words of Yahshayahu in Yahrushalayim. You have seen every one of them come true, and now they are being read aloud in Rome.'},
        {text:'Go out into the city', reply:'"With all boldness, unhindered." The streets are full. There is a great deal of city.'} ]},
      {t:'title', text:'The end of Act VIII', sub:'From Bĕyth Leḥem to Rome — the promise, kept'},
      {t:'end'}
    ]}

  ]
});
})();
