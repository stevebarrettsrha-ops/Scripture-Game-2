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
   goes out on the road to Lod for Kĕpha and calls the widows back up to Taḇitha; opens the tanner's
   gate at Yapho; draws water in the captain's house at Caesarea; goes down with Rhode to the gate of
   Miryam's house; carries the bundles of Barnaḇah and Sha’ul to the road at Antioch; runs to tell them
   of the kohen of Zeus at Lustra, and goes out to Sha’ul where he lies outside the city; carries
   Ludia's purple home and brings the jailer at Philippi his light; stands in the door at Ephesos so
   Sha’ul cannot go into the theatre; reads the altar in Athens; throws the cargo
   into the sea off Crete and gathers sticks on Melite; and carries the scrolls into a rented house in
   Rome. He never speaks in a named mouth, and nothing he does changes what the Besorah says.

   THE ORDER is the Besorah's own (Acts 2-28), with the long speeches given in their beginnings and
   their ends.

   REVERENCE. Yahusha is not seen in this act. At Damascus He is light, and a voice; to Ḥananyah He
   is a voice in a vision. A mal’ak is seen: a man, dark of skin and robed in white, within a light. The stoning of Stephanos is read,
   never drawn: the camera is on Sha’ul and the garments at his feet. So with the sword that killed
   Ya‛aqoḇ, the stones at Lustra and the rods at Philippi: each is read, and the camera is elsewhere. */
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
const SILA={name:'Sila', key:'Sila', robe:0x6a5a44, cloth:0xd8cfb8, beard:0x3a2a1e, skin:0x7c5430};
/* the widows about Taḇitha's mat in her upper room at Yapho (Acts 9:39): [x, z, facing] */
const WIDOWS=[[-10.2,22.6,0],[-9,22.8,0.3],[-10.2,25.4,Math.PI],[-8.8,25.2,Math.PI-0.3]];
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
  sub:'The Festival of weeks · Sha’ul · Yapho · Lustra · Philippi · Ephesos · Rome',
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
    leaders:{name:'The leaders of the Yahuḏim', key:'the leaders of the yahudim at rome', kind:'oldman', actor:'ld0', actors:['ld0','ld1','ld2']},
    gathered:{name:'Those gathered', key:'those gathered at the house of miryam', kind:'crowd', actor:'pr2', actors:['pr0','pr1','pr2','pr3','pr4','pr5','pr6','pr7','pr8','miryamM']},
    lukaonians:{name:'The crowds', key:'the crowds of lustra', kind:'crowd', actor:'ly0', actors:['ly0','ly1','ly2','ly3','ly4','ly5','ly6','ly7']},
    /* "the emissaries … crying out and saying" (Acts 14:14-15); "and they said" (16:31): Sha’ul's voice for both */
    emissaries:{name:'Sha’ul and his companion', key:'Sha’ul of Tarsos', kind:'man', actor:'shaul', actors:['shaul','barnabah','sila']},
    masters:{name:'Her masters', key:'the masters of the slave girl', kind:'man', actor:'ms0', actors:['ms0','ms1']},
    craftsmen:{name:'The craftsmen', key:'the craftsmen of ephesos', kind:'crowd', actor:'cr0', actors:['cr0','cr1','cr2','cr3','cr4','cr5']},
    ephesians:{name:'The crowd in the theatre', key:'the crowd in the theatre', kind:'crowd', actor:'cr1', actors:['cr0','cr1']}
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
    glows:[ {id:'malak', malak:true, at:['hill',0,-2], dy:3.2, size:4, color:0xfff6dc, intensity:1.6, pulse:true, hidden:true},
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

  /* ---------------- VIII.9 — TAḆITHA ---------------- */
  /* Yapho: the woman "filled with good works" laid in the upper room of her house; the widows with the
     garments she made; Kĕpha sends them out, kneels, and calls her by her name (Acts 9:36-43) */
  { id:'tabitha', title:'Yapho', date:'in those days', place:'yapho', time:'day',
    player:{ at:'tabStreet', face:-Math.PI/2, look:ADULT },
    actors:[
      {id:'tabitha', name:'Taḇitha', key:'Tabitha', kind:'woman', at:[-10.5,24], y:'tabY', face:Math.PI/2, robe:0x8a6a5a, cloth:0xe8e2d2, skin:0x86573a},
      ...WIDOWS.map(([x,z,f],k)=>({id:'wd'+k, name:k?undefined:'The widows', key:'the widows of yapho', kind:'woman', at:[x,z], y:'tabY', face:f,
        robe:[0x3c3a44,0x4a3a3a,0x3a3a2e,0x44403a][k], cloth:[0x3c3a44,0x5a4a44,0x2e2c30,0x6a5a4a][k], skin:[0x7a4e30,0x86573a,0x704a27,0x7c5430][k]})),
      {id:'m0', name:'Two men', key:'the two men sent to kepha', at:['tabStreet',-1,-1.2], face:-Math.PI/2, robe:0x6b5a44, cloth:0xd8ceb4, beard:0x2c241f},
      {id:'m1', at:['tabStreet',-1.4,0.4], face:-Math.PI/2, robe:0x5a6470, cloth:0xcfc4aa, beard:0x3a2a1e},
      T('kepha',['lodRoad',-16,0],{face:Math.PI/2})
    ],
    /* the garments she made (9:39), held up by the widows */
    things:[ {id:'coat0', kind:'garment', at:[WIDOWS[0][0],WIDOWS[0][1]], color:0xe6dcc0, hem:true, hidden:true},
             {id:'coat1', kind:'garment', at:[WIDOWS[1][0],WIDOWS[1][1]], color:0x8a5a3a, h:1.0, hidden:true},
             {id:'coat2', kind:'garment', at:[WIDOWS[2][0],WIDOWS[2][1]], color:0x5a6a7a, w:0.56, h:0.85, hidden:true} ],
    beats:[
      {t:'lie', who:'tabitha'}, {t:'mood', who:'tabitha', ex:'sleep'},
      {t:'mood', who:['wd0','wd1','wd2','wd3'], ex:'weep'},
      {t:'cam', from:['tabStreet',8,-6], fdy:5, look:['tabRoom',0,0], dur:0.1},
      {t:'read', ref:'ACTS 9:36'},
      {t:'cam', from:[-5.4,4.9,26.6], look:[-10.4,3.2,24], dur:2.5},
      {t:'read', ref:'ACTS 9:37'},
      {t:'move', who:['m0','m1'], to:[['lodRoad',0,-0.8],['lodRoad',0,0.8]], speed:1.5, wait:false},
      {t:'cam', from:['tabStreet',3,4], fdy:2.2, look:'m0', dur:2},
      {t:'read', ref:'ACTS 9:38'},
      {t:'cam', release:true},
      {t:'goal', text:'Go out on the road toward Lod to meet Kĕpha', goto:'lodRoad', r:3},
      {t:'face', who:'kepha', to:'player'},
      {t:'move', who:['kepha','m0','m1'], to:[['tabStair',0,0],['tabStair',-0.6,-1.4],['tabStair',0.8,-1.2]], speed:1.4, wait:false},
      {t:'cam', from:['tabStreet',4,-4], fdy:2.4, look:['tabStair',0,0], dur:2},
      {t:'wait', s:2.5},
      /* up the stair and in */
      {t:'place', who:'kepha', at:[-6,24.4], y:'tabY', face:-Math.PI/2},
      {t:'place', who:'m0', at:['tabStreet',0,-1.4], y:null}, {t:'place', who:'m1', at:['tabStreet',-0.6,1], y:null},
      {t:'face', who:'wd0', to:'kepha'}, {t:'face', who:'wd1', to:'kepha'}, {t:'face', who:'wd2', to:'kepha'},
      {t:'hold', id:'coat0', who:'wd0'}, {t:'hold', id:'coat1', who:'wd1'}, {t:'hold', id:'coat2', who:'wd2'},   /* "showing the inner garments and outer garments" */
      {t:'cam', from:[-6.6,4.7,21.2], look:[-10,3.7,24.4], dur:2},
      {t:'read', ref:'ACTS 9:39'},
      /* "Kĕpha sent them all out" */
      {t:'hold', id:['coat0','coat1','coat2']},
      {t:'hide', id:['coat0','coat1','coat2']},
      {t:'move', who:['wd0','wd1','wd2','wd3'], to:[[-5.8,23.2],[-5.4,24.2],[-5.8,25.2],[-6.4,24]], speed:1},
      {t:'hide', id:['wd0','wd1','wd2','wd3']},
      {t:'move', who:'kepha', to:[-11.2,22.7], speed:0.9},
      {t:'face', who:'kepha', to:'tabitha'},
      {t:'sit', who:'kepha'},
      {t:'cam', from:[-7.6,4.3,21.4], look:[-11,3.3,23.4], dur:2.5},
      {t:'pose', who:'kepha', arms:'up'}, {t:'wait', s:2}, {t:'pose', who:'kepha'},
      {t:'cam', from:[-9.2,3.9,22.6], look:[-11.6,3.2,24], dur:2},
      {t:'say', who:'kepha', ref:'ACTS 9:40', turn:false},
      {t:'mood', who:'tabitha', ex:'awe'},
      {t:'sit', who:'tabitha'},
      {t:'stand', who:'kepha'},
      {t:'pose', who:'kepha', arms:'out'},
      {t:'wait', s:0.8},
      {t:'stand', who:'tabitha'},
      {t:'pose', who:'kepha'},
      {t:'mood', who:'tabitha', ex:'joy'},
      {t:'cam', release:true},
      {t:'goal', text:'Go down and call the widows and the set-apart ones', goto:'tabStreet', r:2.6},
      /* they come up again */
      ...WIDOWS.map(([x,z,f],k)=>({t:'place', who:'wd'+k, at:[x+1.4,z], y:'tabY', face:f})),
      {t:'show', id:['wd0','wd1','wd2','wd3']},
      {t:'mood', who:['wd0','wd1','wd2','wd3'], ex:'joy'},
      {t:'cam', from:[-5.4,4.9,26.6], look:[-10,3.4,24], dur:2},
      {t:'read', ref:'ACTS 9:41'},
      {t:'cam', from:['tabStreet',14,-12], fdy:8, look:['tabRoom',0,0], dur:3},
      {t:'read', ref:'ACTS 9:42'},
      {t:'cam', from:['tanner',-6,10], fdy:4, look:['tanner',0,0], dur:3},
      {t:'read', ref:'ACTS 9:43'},
      {t:'choice', prompt:'You', options:[
        {text:'Look at the widows', reply:'They are holding the coats up again, but now to her — this one you made me, and this one. Taḇitha is laughing at them.'},
        {text:'Think of the house in Kephar Naḥum', reply:'"Talitha, qumi," He said to the little girl, and put everyone out of the room. Kĕpha was one of the three He let stay. He has done just as he saw done.'} ]},
      {t:'end'}
    ]},

  /* ---------------- VIII.10 — THE HOUSE-TOP AT YAPHO ---------------- */
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

  /* ---------------- VIII.11 — THE HOUSE OF CORNELIUS ---------------- */
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

  /* ---------------- VIII.12 — THE PRISON OF HERODES ---------------- */
  /* Kĕpha asleep between two soldiers, bound with two chains; a mal'ak — a man in white within a light — and
     a light in the building; the chains fall, the guard posts are passed, the iron gate opens of
     itself (Acts 12:1-12). The killing of Ya‛aqoḇ is read, never drawn. */
  { id:'prison', title:'Yahrushalayim', date:'the Days of Unleavened Bread', place:'prison', time:'night',
    player:{ at:'street', face:Math.PI, look:ADULT, hidden:true },
    actors:[
      T('kepha',[-31.1,-71.25],{face:Math.PI/2}),
      LEGION('sl0',[-32.0,-72.3],Math.PI/2,{sit:true, ground:true}), LEGION('sl1',[-32.0,-69.95],Math.PI/2,{sit:true, ground:true}),
      LEGION('gd0',['post1',-1.2,0],Math.PI), LEGION('gd1',['post1',1.2,0],Math.PI),
      LEGION('gd2',['post2',-1.4,0.4],Math.PI), LEGION('gd3',['post2',1.4,0.4],Math.PI)
    ],
    /* "bound with two chains between two soldiers" (12:6): each of his wrists to a soldier's */
    things:[ {id:'ch0', kind:'chain', at:'cell', from:['kepha','L'], to:['sl0','R']},
             {id:'ch1', kind:'chain', at:'cell', from:['kepha','R'], to:['sl1','L']},
             {id:'grate', kind:'box', at:'cellGate', w:1.6, h:3.1, d:0.08, color:0x2e2c2a},
             {id:'iron', kind:'box', at:['palaceDoor',0,-0.9], w:2.4, h:3.2, d:0.12, color:0x3a3836} ],
    glows:[ {id:'malak', malak:true, at:['cell',0.6,0.6], dy:1.7, size:2.4, color:0xfff6dc, intensity:1.4, pulse:true, hidden:true},
            {id:'shone', at:['cell',0,2], dy:2.6, size:6, color:0xfff4d8, intensity:0.55, hidden:true} ],
    beats:[
      {t:'lie', who:'kepha'}, {t:'mood', who:['kepha','sl0','sl1'], ex:'sleep'},
      {t:'cam', from:['pavement',8,8], fdy:4, look:['palaceDoor',0,0], dur:0.1},
      {t:'read', ref:'ACTS 12:1'},
      {t:'read', ref:'ACTS 12:2'},
      {t:'read', ref:'ACTS 12:3'},
      {t:'cam', from:['post2',2.2,1.4], fdy:2.3, look:'gd0', dur:2},
      {t:'read', ref:'ACTS 12:4'},
      {t:'read', ref:'ACTS 12:5'},
      {t:'cam', from:['cell',2.6,2.2], fdy:2.2, look:'sleeper', dur:2.5},
      {t:'read', ref:'ACTS 12:6'},
      /* "a mal'ak of (YAHUAH) HWHY stood by and a light shone in the building" */
      {t:'show', id:['shone','malak']},
      {t:'say', who:'malak', ref:'ACTS 12:7', turn:false},
      {t:'loose', id:['ch0','ch1']},                                                 /* "and his chains fell off his hands" */
      {t:'mood', who:'kepha', ex:'awe'},
      {t:'sit', who:'kepha'}, {t:'wait', s:0.6}, {t:'stand', who:'kepha'},
      {t:'say', who:'malak', ref:'ACTS 12:8', turn:false},
      /* out past the first guard post and the second, the light going before */
      {t:'drift', id:'grate', by:[1.7,0,0], dur:1.2, wait:false},
      {t:'drift', id:'malak', by:[-0.6,0,3.4], dur:3, wait:false},
      {t:'move', who:'kepha', to:['post1',0,0.4], speed:0.9, wait:false},
      {t:'cam', from:['post2',-2.2,1.2], fdy:2.0, look:'kepha', dur:3},
      {t:'read', ref:'ACTS 12:9'},
      {t:'drift', id:'iron', by:[2.6,0,0], dur:1.6, wait:false},
      {t:'drift', id:'malak', by:[0,0,7.6], dur:4, wait:false},
      {t:'move', who:'kepha', to:'pavement', speed:1},
      {t:'cam', from:['street',5,3], fdy:2.6, look:'kepha', dur:2.5, wait:false},
      {t:'drift', id:'malak', by:[6,0,10], dur:4, wait:false},
      {t:'move', who:'kepha', to:['street',1,1], speed:1, wait:false},
      {t:'read', ref:'ACTS 12:10'},
      {t:'hide', id:['malak','shone']},
      {t:'mood', who:'kepha'},
      {t:'cam', from:['street',3,3], fdy:1.9, look:'kepha', dur:2},
      {t:'say', who:'kepha', ref:'ACTS 12:11', turn:false},
      {t:'read', ref:'ACTS 12:12'},
      {t:'end'}
    ]},

  /* ---------------- VIII.13 — AT THE DOOR OF THE GATE ---------------- */
  /* the house of Miryam the mother of Yahuchanon Marqos, many gathered praying; Rhode at the gate
     too glad to open it (Acts 12:12-19) */
  { id:'rhode', title:'The house of Miryam', date:'the same night', place:'upperroom', time:'lamplit',
    player:{ at:[20.2,31.4], face:-Math.PI/2, look:ADULT },
    actors:[
      ...SEATS.slice(0,9).map((s,k)=>Object.assign({id:'pr'+k, at:[s[0],s[1]], face:s[2], sit:true,
        robe:ROBES[(k*5)%ROBES.length], cloth:k%3===1?0xe8e2d2:CLOTHS[k%CLOTHS.length], beard:k%3===1?null:[0x2c241f,0x3a2a1e,0x6d6a66][k%3], kind:k%3===1?'woman':'man'},
        k===0?{name:'Those gathered', key:'those gathered at the house of miryam'}:{})),
      {id:'miryamM', name:'Miryam', key:'Miryam the mother of Mark', kind:'woman', at:[SEATS[10][0],SEATS[10][1]], face:SEATS[10][2], sit:true, robe:0x6a4a5a, cloth:0xe8e2d2, skin:0x86573a},
      {id:'rhode', name:'Rhode', key:'Rhode', kind:'woman', at:[19.6,30.8], face:Math.PI, robe:0x8a7a60, cloth:0xd8cfb8, skin:0x8a5a36},
      T('kepha',[12,22.6],{face:Math.PI/2})
    ],
    /* the gate of the court where the stair comes down, its leaf shut */
    things:[ {id:'gpost0', kind:'box', at:[21.8,24.4], w:0.3, h:2.4, d:0.3, color:0xd8cfb8},
             {id:'gpost1', kind:'box', at:[23.8,24.4], w:0.3, h:2.4, d:0.3, color:0xd8cfb8},
             {id:'leaf', kind:'box', at:[22.8,24.4], w:1.7, h:2.2, d:0.1, color:0x6e5238},
             /* the wall of the court, the lower house's door within it */
             {id:'cwallW', kind:'box', at:[16.8,24.4], w:9.7, h:2.4, d:0.3, color:0xc8bea6},
             {id:'cwallE', kind:'box', at:[24.8,24.4], w:1.7, h:2.4, d:0.3, color:0xc8bea6},
             {id:'cwallS', kind:'box', at:[25.6,29.2], w:0.3, h:2.4, d:9.6, color:0xc8bea6} ],
    glows:[ {id:'gl', at:[22.8,25.8], dy:2.3, size:1.2, color:0xffc070, intensity:0.6} ],
    beats:[
      {t:'cam', from:['table',3.2,2.4], fdy:1.7, look:'pr2', dur:0.1},
      {t:'note', text:'The house of Miryam was the gathering place of the Natsarim in Yahrushalayim; her son Yahuchanon, who was also called Mark, would set out with Barnaḇah and Sha’ul (Acts 12:25). Rhode is a Greek name: "rose".'},
      {t:'move', who:'kepha', to:[22.8,22.9], speed:1.2, wait:false},
      {t:'cam', from:['stairFoot',-1.3,-2.25], fdy:1.7, look:'kepha', dur:2},   /* beside the gate, before his face as he knocks */
      {t:'face', who:'kepha', to:'leaf'},
      {t:'read', ref:'ACTS 12:13'},
      {t:'cam', release:true},
      {t:'goal', text:'Go down the stair with Rhode to the gate', goto:'stairFoot', r:2.4},
      {t:'place', who:'rhode', at:[22.8,25.5], y:null, face:Math.PI},
      {t:'mood', who:'rhode', ex:'joy'},
      {t:'cam', from:[20.6,2.0,26.6], look:'rhode', dur:1.6},
      {t:'read', ref:'ACTS 12:14'},
      {t:'place', who:'rhode', at:[19.8,30.6], face:Math.PI},
      {t:'cam', from:['table',3,2.2], fdy:1.7, look:'rhode', dur:1.4},
      {t:'face', who:'pr2', to:'rhode'},
      {t:'say', who:'gathered', ref:'ACTS 12:15', turn:false},
      /* he goes on knocking; they come down and open */
      {t:'stand', who:['pr0','pr1','pr2','pr5','miryamM']},
      {t:'place', who:'pr0', at:[21.6,25.8], y:null, face:Math.PI}, {t:'place', who:'pr1', at:[23.8,25.9], y:null, face:Math.PI},
      {t:'place', who:'pr2', at:[22.4,26.8], y:null, face:Math.PI}, {t:'place', who:'pr5', at:[23.6,27.2], y:null, face:Math.PI},
      {t:'place', who:'miryamM', at:[21.2,26.6], y:null, face:Math.PI}, {t:'place', who:'rhode', at:[22.4,25.6], y:null, face:Math.PI},
      {t:'hide', id:'leaf'},
      {t:'mood', who:['pr0','pr1','pr2','pr5','miryamM'], ex:'awe'},
      {t:'cam', from:[21.2,2.1,28.2], look:[22.8,1.6,23.2], dur:2},
      {t:'read', ref:'ACTS 12:16'},
      {t:'pose', who:'kepha', arms:'up'},
      {t:'say', who:'kepha', ref:'ACTS 12:17', turn:false},
      {t:'pose', who:'kepha'},
      {t:'move', who:'kepha', to:[6,21.6], speed:1.3, wait:false},
      {t:'cam', from:[24,3,20], look:'kepha', dur:3},
      {t:'hide', id:'kepha'},
      {t:'note', text:'Ya‛aqoḇ here is the brother of the Master (Galatians 1:19), not the son of Zaḇdai, whom Herodes had killed.'},
      {t:'read', ref:'ACTS 12:18'},
      {t:'read', ref:'ACTS 12:19'},
      {t:'choice', prompt:'You', options:[
        {text:'Look at Rhode', reply:'She left him standing in the street. She will hear about it for the rest of her life, and she does not mind at all.'},
        {text:'Look up the street', reply:'He has gone already. "Another place," he said, and no one asks where; the less they know, the less Herodes can make them tell.'} ]},
      {t:'end'}
    ]},

  /* ---------------- VIII.14 — ANTIOCH ---------------- */
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

  /* ---------------- VIII.15 — LUSTRA ---------------- */
  /* the man lame from his mother's womb made to stand; the crowds crying that the mighty ones have
     come down; the kohen of Zeus at the gate with oxen and garlands; and then the stoning, which is
     read and never drawn — the camera stays on the gate (Acts 14:8-20) */
  { id:'lystra', title:'Lustra', date:'the first journey', place:'lystra', time:'day',
    player:{ at:['square',-2,3.4], face:Math.PI/2, look:ADULT },
    crowds:[ {id:'lyc', n:120, area:[-6,-5.4,26,5.4], look:'speak', keep:[[-1,-6,12,2.6],[-7,-1.6,-3,1.6]], hidden:true} ],
    actors:[
      Object.assign({id:'shaul', at:'speak', face:-Math.PI*0.8},SHAUL),
      Object.assign({id:'barnabah', at:['speak',1.4,0.8], face:-Math.PI*0.75},BARNABAH),
      {id:'lameL', name:'A man disabled in his feet', key:'the lame man of lustra', at:'lame', face:0.4, sit:true, ground:true, robe:0x6b5a44, cloth:0x8a7a60, beard:0x3a2a1e, skin:0x9a6a44},
      ...[[2,2.2],[5,2.6],[9,2.4],[12,-1],[13,1.8],[0.6,-1.6],[-0.6,1.4],[10.6,-3.4]].map(([dx,dz],k)=>Object.assign({id:'ly'+k, at:['square',dx-6,dz], face:Math.atan2(-dx+6-0,-dz-1.2+0)+(k%3-1)*0.3,
        folk:'greek', robe:ROBES[(k*7+3)%ROBES.length], cloth:k%3===1?0xe8e2d2:CLOTHS[(k*5)%CLOTHS.length], beard:k%3!==1&&k%4!==0?0x3a2a1e:null, kind:k%3===1?'woman':'man'},
        k===0?{name:'The crowds', key:'the crowds of lustra'}:{})),
      {id:'kz', name:'The kohen of Zeus', key:'the kohen of zeus', folk:'greek', at:['templeSteps',0,0.6], face:0, robe:0xf0ece0, cloth:0xe8e0cc, sash:0x8a2a22, beard:0x9a948a, kind:'oldman'},
      {id:'at0', at:['templeSteps',-1.6,2.4], face:0, folk:'greek', robe:0xd8cfb8, cloth:0xc1b394},
      {id:'at1', at:['templeSteps',1.6,2.4], face:0, folk:'greek', robe:0xd8cfb8, cloth:0xc1b394},
      ...[0,1,2].map(k=>({id:'yd'+k, name:k?undefined:'Yahuḏim from Antioch and Ikonion', key:'yahudim from antioch', at:['road',-k*1.4,(k%2?1:-1)*0.8], face:Math.PI/2, robe:[0x5a4a3a,0x3a3a5a,0x6a5a3a][k], cloth:[0xe6e0cf,0xcfc4aa,0xd8ceb4][k], beard:[0x2c241f,0x6d6a66,0x1e1814][k], hidden:true})),
      ...[0,1,2].map(k=>({id:'tg'+k, at:['square',16+k*1.2,-3+k], face:Math.PI*1.4, robe:ROBES[(k*3+1)%ROBES.length], cloth:CLOTHS[k], beard:k===1?null:0x2c241f, kind:k===1?'woman':'man', folk:'greek'}))
    ],
    things:[ {id:'ox0', kind:'beast', beast:'ox', at:['templeSteps',-1.6,3.8], face:0},
             {id:'ox1', kind:'beast', beast:'ox', at:['templeSteps',1.6,3.8], face:0},
             {id:'wr0', kind:'wreath', at:['templeSteps',0,1.6]} ],
    beats:[
      {t:'cam', from:['gateIn',6,10], fdy:5, look:['square',0,-2], dur:0.1},
      {t:'show', id:'lyc'},
      {t:'cam', from:['lame',3.4,3], fdy:1.6, look:'lameL', dur:2.2},
      {t:'read', ref:'ACTS 14:8'},
      {t:'face', who:'shaul', to:'lameL'},
      {t:'cam', from:['lame',-2.6,3.6], fdy:2, look:'shaul', dur:2},
      {t:'read', ref:'ACTS 14:9'},
      {t:'say', who:'shaul', ref:'ACTS 14:10', turn:false},
      {t:'stand', who:'lameL'},
      {t:'mood', who:'lameL', ex:'joy'},
      {t:'move', who:'lameL', to:['lame',2.6,2.2], speed:1.6},
      {t:'move', who:'lameL', to:['lame',-1.6,2.8], speed:1.8},
      {t:'mood', who:['ly0','ly1','ly2','ly3','ly4','ly5'], ex:'awe'},
      {t:'cam', from:['square',-6,7], fdy:2.6, look:'ly0', dur:2},
      {t:'say', who:'lukaonians', ref:'ACTS 14:11', turn:false},
      {t:'read', ref:'ACTS 14:12'},
      /* the kohen of Zeus, out of the house before the city, with the oxen and the garlands */
      {t:'lead', id:'ox0', by:'at0'}, {t:'lead', id:'ox1', by:'at1'}, {t:'hold', id:'wr0', who:'kz'},
      {t:'move', who:['kz','at0','at1'], to:[['gateOut',-1,0],['gateOut',-3.4,-1.4],['gateOut',-3.4,1.4]], speed:1.1, wait:false},
      {t:'cam', from:['templeSteps',8,6], fdy:3, look:'kz', dur:3},
      {t:'read', ref:'ACTS 14:13'},
      {t:'move', who:['kz','at0','at1'], to:[['square',-4.4,0],['square',-6.6,-1.4],['square',-6.6,1.4]], speed:1.1, wait:false},
      {t:'move', who:['shaul','barnabah'], to:[['square',14,-1],['square',15,0.6]], speed:1.2, wait:false},
      {t:'cam', release:true},
      {t:'goal', text:'Run and tell Barnaḇah and Sha’ul what the kohen of Zeus is doing', goto:['square',14,0], r:3},
      {t:'face', who:'shaul', to:'kz'}, {t:'face', who:'barnabah', to:'kz'},
      {t:'mood', who:['shaul','barnabah'], ex:'sorrow'},
      {t:'cam', from:['square',8,5], fdy:2.4, look:'shaul', dur:2},
      {t:'read', ref:'ACTS 14:14'},
      {t:'move', who:['shaul','barnabah'], to:[['square',-1.6,-0.6],['square',-1,1.2]], speed:2.4},
      {t:'face', who:'shaul', to:'kz'}, {t:'mood', who:['shaul','barnabah']},
      {t:'cam', from:['square',-6.4,4.6], fdy:2.2, look:'shaul', dur:2},
      {t:'say', who:'emissaries', ref:'ACTS 14:15', turn:false},
      {t:'say', who:'emissaries', ref:'ACTS 14:16', turn:false},
      {t:'say', who:'emissaries', ref:'ACTS 14:17', turn:false},
      {t:'read', ref:'ACTS 14:18'},
      /* those from Antioch and Ikonion; and the stoning, read with the camera on the gate */
      {t:'show', id:['yd0','yd1','yd2']},
      {t:'move', who:['yd0','yd1','yd2'], to:[['square',-3,-3],['square',-2,3],['square',0,-3.4]], speed:1.4, wait:false},
      {t:'cam', from:['gateIn',3,5], fdy:2.2, look:'yd0', dur:3},
      {t:'mood', who:['ly0','ly1','ly2','ly3','ly4','ly5','ly6','ly7'], ex:'stern'},
      {t:'cam', from:['road',8,10], fdy:5, look:['gate',0,0], dur:2.5},
      {t:'hide', id:['shaul','lyc']},
      {t:'read', ref:'ACTS 14:19'},
      {t:'hide', id:['yd0','yd1','yd2','kz','at0','at1','ox0','ox1','wr0']},
      {t:'place', who:'shaul', at:'outside', face:Math.PI/2},
      {t:'lie', who:'shaul'}, {t:'mood', who:'shaul', ex:'sleep'}, {t:'show', id:'shaul'},
      {t:'place', who:'barnabah', at:['outside',1.6,1.6], face:-Math.PI*0.75},
      {t:'place', who:'tg0', at:['outside',-1.4,1.6], face:Math.PI*0.75}, {t:'place', who:'tg1', at:['outside',0.4,-1.8], face:0}, {t:'place', who:'tg2', at:['outside',2.4,-0.6], face:-Math.PI/2},
      {t:'mood', who:['barnabah','tg0','tg1','tg2'], ex:'weep'},
      {t:'cam', release:true},
      {t:'goal', text:'Go out to him, outside the city', goto:'outside', r:3},
      {t:'cam', from:['outside',3.4,3.4], fdy:1.8, look:['outside',0.6,0], dur:2},
      {t:'mood', who:'shaul'}, {t:'wait', s:1},
      {t:'sit', who:'shaul'}, {t:'wait', s:0.8}, {t:'stand', who:'shaul'},
      {t:'mood', who:['barnabah','tg0','tg1','tg2'], ex:'joy'},
      {t:'read', ref:'ACTS 14:20'},
      {t:'move', who:['shaul','barnabah'], to:[['gateIn',0,-0.8],['gateIn',0,0.8]], speed:1},
      {t:'read', ref:'ACTS 14:21'},
      {t:'read', ref:'ACTS 14:22'},
      {t:'choice', prompt:'You', options:[
        {text:'Look at the man who was lame', reply:'He is walking up and down outside the gate, as if he means to wear the road out. He will not let anyone carry anything for him now.'},
        {text:'Think of the coats in Yahrushalayim', reply:'He kept the garments of those who stoned Stephanos. Now he has been dragged out of a city for dead himself — and he has got up, and walked back in.'} ]},
      {t:'end'}
    ]},

  /* ---------------- VIII.16 — BY THE RIVER ---------------- */
  /* Philippi, a colony: on the Shabbath outside the gate by the river, where there used to be
     prayer; the women who met there, and Ludia, a seller of purple from Thyatira (Acts 16:12-15) */
  { id:'ludia', title:'Philippi', date:'the second journey, on the Shabbath', place:'philippi', time:'day',
    player:{ at:['way',-4,2], face:-Math.PI/2, look:ADULT },
    actors:[
      Object.assign({id:'shaul', at:['gateOut',-1,-0.8], face:-Math.PI/2},SHAUL),
      Object.assign({id:'sila', at:['gateOut',-1.4,0.8], face:-Math.PI/2},SILA),
      {id:'ludia', name:'Ludia', key:'Ludia', kind:'woman', folk:'greek', at:[-52.2,15.6], face:-Math.PI*0.6, sit:true, robe:0x5a1a5a, cloth:0xe8e2d2, sash:0xb08d3c, skin:0xa87a50},
      ...[[-53.4,12.2,-Math.PI*0.4],[-54,17.4,-Math.PI*0.7],[-51.4,11,-Math.PI*0.3]].map(([x,z,f],k)=>({id:'lw'+k, kind:'woman', folk:'greek', at:[x,z], face:f, sit:true,
        robe:[0x6a5a44,0x4f6a4f,0x8a6a5a][k], cloth:[0xe8e2d2,0x3c3a44,0xd8cfb8][k], skin:[0xa87a50,0xb08060,0x9a6a44][k]})),
      ...[0,1,2].map(k=>({id:'lh'+k, at:[-46+k*1.2,22+k], face:-Math.PI/2, folk:'greek', kind:k===1?'woman':'man', robe:[0x7a5040,0x5a6470,0x6b5a44][k], cloth:[0xcfc4aa,0xe8e2d2,0xd8ceb4][k], beard:k===0?0x2c241f:null, hidden:true}))
    ],
    things:[ {id:'purple0', kind:'box', at:[-51,16.6], w:0.7, h:0.22, d:0.4, color:0x5a1a5a},
             {id:'purple1', kind:'box', at:[-50.6,17.2], w:0.6, h:0.2, d:0.36, color:0x6a2a6a} ],
    beats:[
      {t:'cam', from:['bank',10,-12], fdy:5, look:['river',0,0], dur:0.1},
      {t:'read', ref:'ACTS 16:11'},
      {t:'read', ref:'ACTS 16:12'},
      {t:'move', who:['shaul','sila'], to:[['prayer',0.4,-1.4],['prayer',1.4,-0.4]], speed:1.2, wait:false},
      {t:'cam', release:true},
      {t:'goal', text:'Go down to the river, where there used to be prayer', goto:'prayer', r:3.4},
      {t:'face', who:'shaul', to:'ludia'},
      {t:'sit', who:['shaul','sila']},
      {t:'cam', from:['prayer',3,4], fdy:1.6, look:'shaul', dur:2},
      {t:'read', ref:'ACTS 16:13'},
      {t:'note', text:'Thyatira, in Asia, was a city of dyers: inscriptions found there name its guild of purple-dyers. The purple was dear, and those who sold it were not poor.'},
      {t:'mood', who:'ludia', ex:'awe'},
      {t:'cam', from:['prayer',-2.4,3.4], fdy:1.4, look:'ludia', dur:2.5},
      {t:'wait', s:1.5},
      /* she and her household immersed in the river */
      {t:'show', id:['lh0','lh1','lh2']},
      {t:'stand', who:['shaul','ludia']},
      {t:'move', who:['lh0','lh1','lh2'], to:[['bank',0,2],['bank',0.6,3.2],['bank',-0.4,4]], speed:1.4, wait:false},
      {t:'move', who:['shaul','ludia'], to:[['riverIn',-0.6,-0.6],['riverIn',-0.6,0.8]], speed:1},
      {t:'cam', from:['bank',2.4,-3.4], fdy:1.6, look:'ludia', dur:2},
      {t:'sit', who:'ludia'}, {t:'wait', s:1.2}, {t:'stand', who:'ludia'},
      {t:'mood', who:'ludia', ex:'joy'},
      {t:'move', who:['shaul','ludia'], to:[['bank',0,-0.8],['bank',0.4,0.8]], speed:1},
      {t:'face', who:'ludia', to:'shaul'},
      {t:'cam', from:['bank',3,2], fdy:1.7, look:'ludia', dur:2},
      {t:'say', who:'ludia', ref:'ACTS 16:15', turn:false},
      {t:'cam', release:true},
      {t:'witness', text:'Carry the bolts of purple to Ludia’s house in the city', items:['purple0','purple1'], verb:'Take up the purple', hold:0.5, deliver:'ludia', r:2.6, carryText:'Carry it to her door'},
      {t:'choice', prompt:'You', options:[
        {text:'Look back at the river', reply:'A few women on the stones by the water, as on every Shabbath. No qahal of ten men in Philippi — and the first house of Makedonia to believe is a woman\'s.'},
        {text:'Feel the cloth', reply:'Heavy, and dyed so deep it is almost black until the sun is on it. A king\'s colour, carried through a Roman colony by a woman of Asia.'} ]},
      {t:'end'}
    ]},

  /* ---------------- VIII.17 — THE JAILER ---------------- */
  /* the slave girl with the ruach of Puthon; her masters drag Sha’ul and Sila to the captains; the
     rods (read, never drawn); the inner prison and the stocks; at midnight the songs, the earthquake,
     the doors open; the jailer and his household (Acts 16:16-34) */
  { id:'jail', title:'Philippi', date:'many days after', place:'philippi', time:'day',
    player:{ at:['way',6,2.6], face:-Math.PI/2, look:ADULT },
    crowds:[ {id:'forumc', n:90, area:[-2,-15,26,-3], look:'bemaFront', keep:[[5,-15,15,-8]], hidden:true} ],
    actors:[
      Object.assign({id:'shaul', at:['way',-2,-0.8], face:-Math.PI/2},SHAUL),
      Object.assign({id:'sila', at:['way',-2.4,0.8], face:-Math.PI/2},SILA),
      {id:'girl', name:'A slave girl', key:'the slave girl of philippi', kind:'woman', folk:'greek', at:['way',4,-2.6], face:-Math.PI/2, robe:0x8a7a60, cloth:0x6a5a4a, skin:0xa87a50, small:true},
      {id:'ms0', name:'Her masters', key:'the masters of the slave girl', folk:'roman', dress:'man', at:['gateIn',2,-3], face:-Math.PI/2, robe:0xe6e0cf, cloth:0xd8cfb8, sash:0x5a1a5a},
      {id:'ms1', folk:'roman', dress:'man', at:['gateIn',2.6,-1.8], face:-Math.PI/2, robe:0x8a5a3a, cloth:0xd8cfb8, beard:0x2c241f},
      {id:'cp0', name:'The captains', key:'the captains of philippi', folk:'roman', dress:'herodian', at:['bema',-1.2,0], face:0, robe:0xf0ece0, cloth:0xe8e0cc, sash:0x6a1a3a, kind:'oldman'},
      {id:'cp1', folk:'roman', dress:'herodian', at:['bema',1.2,0], face:0, robe:0xf0ece0, cloth:0xe8e0cc, sash:0x6a1a3a},
      LEGION('lc0',['bemaFront',-3,-1],0), LEGION('lc1',['bemaFront',3,-1],0),
      {id:'jailer', name:'The jailer', key:'the jailer of philippi', folk:'roman', dress:'man', at:['prisonDoor',-1.2,1.6], face:-Math.PI/2, robe:0x6a4a3a, cloth:0xb9ab8e, sash:0x3a2a1a, beard:0x3a2a1e},
      ...[[10,7.6,0],[10.6,14.6,Math.PI],[12.4,7.4,0]].map(([x,z,f],k)=>({id:'pz'+k, at:[x,z], face:f, sit:true, ground:true, robe:[0x5c5040,0x4f6a4f,0x6b5a44][k], cloth:[0xa89a7e,0x8a7a60,0x9a8a70][k], beard:[0x3a2a1e,0x2c241f,0x6d6a66][k], skin:[0x9a6a40,0x8a5a36,0xa87a50][k]})),
      ...[0,1,2].map(k=>({id:'jh'+k, at:['jailerIn',k*1.2-1.2,1], face:-Math.PI/2, folk:'roman', kind:k===0?'woman':'man', dress:k===0?'woman':'man', small:k===2, robe:[0x7a5040,0x5a6470,0x8a7a60][k], cloth:[0xe8e2d2,0xcfc4aa,0xd8ceb4][k]}))
    ],
    things:[ {id:'door1', kind:'box', at:[8.25,11], w:0.14, h:2.2, d:2.0, color:0x5d4a36, hidden:true},
             {id:'door2', kind:'box', at:[14.05,11], w:0.14, h:2.2, d:2.0, color:0x5d4a36, hidden:true},
             {id:'lampP', kind:'box', at:'lampAt', dy:0.7, w:0.24, h:0.12, d:0.14, color:0xc89a5a},
             /* the prisoners chained to rings in the walls, "and all the chains came loose" (16:26) */
             {id:'pc0', kind:'chain', at:'prisonIn', from:['pz0','R'], to:{at:[10,6.62], y:1.0}},
             {id:'pc1', kind:'chain', at:'prisonIn', from:['pz1','L'], to:{at:[10.6,15.38], y:1.0}},
             {id:'pc2', kind:'chain', at:'prisonIn', from:['pz2','L'], to:{at:[12.4,6.62], y:1.0}} ],
    glows:[ {id:'lampG', at:'lampAt', dy:1.0, size:0.5, color:0xffb050, intensity:0.6, pulse:true},
            {id:'inLamp', at:['inner',0.4,-2.4], dy:1.8, size:0.6, color:0xffa040, intensity:0.45, hidden:true},
            /* the lamp in its niche on the east wall, the side the two face */
            {id:'inLamp2', at:[19.2,13.6], dy:1.7, size:0.5, color:0xffb050, intensity:0.5, hidden:true} ],
    beats:[
      {t:'follow', who:'girl', target:'shaul'},
      {t:'move', who:['shaul','sila'], to:[['way',-14,-0.8],['way',-14.4,0.8]], speed:1, wait:false},
      {t:'cam', from:['way',-6,6], fdy:2.4, look:'girl', dur:2},
      {t:'read', ref:'ACTS 16:16'},
      {t:'mood', who:'girl', ex:'fear'},
      {t:'say', who:'girl', ref:'ACTS 16:17', turn:false},
      {t:'face', who:'shaul', to:'girl'},
      {t:'mood', who:'shaul', ex:'stern'},
      {t:'cam', from:['way',-10,3.4], fdy:1.8, look:'shaul', dur:2},
      {t:'say', who:'shaul', ref:'ACTS 16:18', turn:false},
      {t:'move', who:'girl', to:['way',-8,3.2], speed:0.8, wait:false},
      {t:'mood', who:'girl'}, {t:'mood', who:'shaul'},
      {t:'move', who:['ms0','ms1'], to:[['way',-11,-1.8],['way',-11.4,1.6]], speed:2.2},
      {t:'mood', who:['ms0','ms1'], ex:'stern'},
      {t:'read', ref:'ACTS 16:19'},
      /* the market-place: the captains on their seat */
      {t:'show', id:'forumc'},
      {t:'place', who:'shaul', at:['bemaFront',-0.8,1.4], face:Math.PI}, {t:'place', who:'sila', at:['bemaFront',0.8,1.4], face:Math.PI},
      {t:'place', who:'ms0', at:['bemaFront',-2,0.4], face:Math.PI}, {t:'place', who:'ms1', at:['bemaFront',2,0.6], face:Math.PI},
      {t:'place', who:'girl', at:['way',-12,3], face:Math.PI/2},
      {t:'cam', from:['bemaFront',4,6], fdy:2.6, look:'cp0', dur:0.1},
      {t:'say', who:'masters', ref:'ACTS 16:20', turn:false},
      {t:'say', who:'masters', ref:'ACTS 16:21', turn:false},
      {t:'mood', who:['cp0','cp1'], ex:'stern'},
      {t:'cam', from:['bemaFront',-5,-1.6], fdy:2.8, look:'cp1', dur:2},
      {t:'read', ref:'ACTS 16:22'},
      {t:'cam', from:['prisonDoor',-5,-2], fdy:2.2, look:'jailer', dur:2},
      {t:'read', ref:'ACTS 16:23'},
      {t:'hide', id:'forumc'},
      {t:'place', who:'shaul', at:[17.2,10.45], face:Math.PI/2}, {t:'place', who:'sila', at:[17.2,11.55], face:Math.PI/2},
      {t:'sit', who:['shaul','sila']},
      {t:'show', id:['door1','door2','inLamp','inLamp2']},
      {t:'cam', from:[19.25,1.45,11], look:[17.2,0.95,11], dur:0.1},
      {t:'read', ref:'ACTS 16:24'},
      /* midnight */
      {t:'time', to:'night'},
      {t:'place', who:'jailer', at:['prisonDoor',-1.4,1.8], face:-Math.PI/2},
      {t:'sit', who:'jailer'}, {t:'mood', who:'jailer', ex:'sleep'},
      {t:'player', at:['street',-6,0]},
      {t:'pose', who:['shaul','sila'], arms:'up'},
      {t:'mood', who:['pz0','pz1','pz2'], ex:'awe'}, {t:'mood', who:['shaul','sila'], ex:'joy'},
      {t:'cam', from:[19.25,1.35,11.4], look:[17.2,1.0,11], dur:2.5},
      {t:'read', ref:'ACTS 16:25'},
      {t:'pose', who:['shaul','sila']}, {t:'mood', who:['shaul','sila']},
      {t:'quake', s:3},
      {t:'drift', id:'door1', by:[0,0,-1.95], dur:0.8, wait:false},
      {t:'drift', id:'door2', by:[0,0,-1.95], dur:0.8, wait:false},
      {t:'loose', id:['pc0','pc1','pc2']},
      {t:'cam', from:['prisonDoor',-5,3], fdy:2.4, look:['prisonDoor',1.2,0], dur:1.5},
      {t:'read', ref:'ACTS 16:26'},
      {t:'mood', who:'jailer', ex:'fear'},
      {t:'stand', who:'jailer'},
      {t:'face', who:'jailer', to:'prisonIn'},
      {t:'cam', from:['prisonDoor',-3.4,-1.6], fdy:1.8, look:'jailer', dur:1.6},
      {t:'read', ref:'ACTS 16:27'},
      {t:'stand', who:['shaul','sila']},
      {t:'cam', from:[19.25,1.7,11.1], look:[17.2,1.55,10.5], dur:1.4},
      {t:'say', who:'shaul', ref:'ACTS 16:28', turn:false},
      {t:'cam', release:true},
      {t:'witness', text:'He is calling for a light — bring him the lamp', items:['lampP'], verb:'Take up the lamp', hold:0.5, deliver:'prisonDoor', r:2.4, carryText:'Bring it to the jailer'},
      {t:'hide', id:'lampG'},
      {t:'move', who:'jailer', to:['inner',0,0], speed:2},
      {t:'lie', who:'jailer', prone:true},
      {t:'cam', from:[15.0,2.0,13.6], look:[16.8,0.6,11], dur:1.6},
      {t:'read', ref:'ACTS 16:29'},
      {t:'stand', who:'jailer'},
      {t:'move', who:['jailer','shaul','sila'], to:[['prisonDoor',-1.6,0],['prisonDoor',-2.6,-1.2],['prisonDoor',-2.6,1.2]], speed:1},
      {t:'face', who:'jailer', to:'shaul'}, {t:'face', who:'shaul', to:'jailer'},
      {t:'cam', from:['prisonDoor',-4.6,3.4], fdy:1.9, look:'jailer', dur:2},
      {t:'say', who:'jailer', ref:'ACTS 16:30', turn:false},
      {t:'say', who:'emissaries', ref:'ACTS 16:31', turn:false},
      {t:'mood', who:'jailer'},
      {t:'move', who:['jh0','jh1','jh2'], to:[['jailerDoor',-1.2,-1.6],['jailerDoor',-1.8,-0.4],['jailerDoor',-1.2,0.8]], speed:1.2, wait:false},
      {t:'read', ref:'ACTS 16:32'},
      /* the wounds washed at the trough, and he immersed, he and all his */
      {t:'move', who:['jailer','shaul','sila','jh0','jh1','jh2'], to:[['trough',-0.4,0.4],['trough',-1.8,0.6],['trough',0.9,0.6],['trough',-2.6,1.8],['trough',-0.8,2],['trough',1.4,2]], speed:1},
      {t:'cam', from:['trough',3.4,3.4], fdy:1.8, look:'jailer', dur:2},
      {t:'read', ref:'ACTS 16:33'},
      {t:'move', who:['jailer','shaul','sila','jh0','jh1','jh2'], to:[[24.3,9.4],[28.1,9.4],[28.1,10.8],[24.3,10.8],[26.2,8.2],[26.2,12]], speed:1},
      ...['jailer','shaul','sila','jh0','jh1','jh2'].map(w=>({t:'face', who:w, to:'tableC'})),
      {t:'sit', who:['shaul','sila','jailer','jh0','jh1','jh2']},
      {t:'mood', who:['jailer','jh0','jh1','jh2'], ex:'joy'},
      {t:'cam', from:[23.0,2.3,7.0], look:[26.6,0.9,10.6], dur:2},
      {t:'read', ref:'ACTS 16:34'},
      {t:'choice', prompt:'You', options:[
        {text:'Look at their backs', reply:'He washed them himself, with the water from the trough, with the same hands that fastened their feet in the stocks at dusk.'},
        {text:'Listen to the city', reply:'Dogs barking all over Philippi since the shaking. In this one house they are eating bread at the third watch, and laughing.'} ]},
      {t:'end'}
    ]},

  /* ---------------- VIII.18 — THE HILL OF ARES ---------------- */
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

  /* ---------------- VIII.19 — THE THEATRE AT EPHESOS ---------------- */
  /* Demetrios and the silversmiths; "Great is Artemis of the Ephesians!"; the whole city rushing into
     the theatre with Gaios and Aristarchos; Sha’ul held back by the taught ones; two hours of
     shouting, and the city clerk who quiets it (Acts 19:23-41) */
  { id:'ephesos', title:'Ephesos', date:'the third journey', place:'ephesos', time:'day',
    player:{ at:['lodgingDoor',2.4,1.6], face:Math.PI/2, look:ADULT },
    crowds:[ {id:'mob', n:70, area:[6,-5.6,40,-1.6], look:'shopFront', hidden:true},
             {id:'theatrec', n:300, area:[-29,-55,29,-27], look:'orchestra', dy:20, top:21, keep:[[-11,-36,11,-24],[-31,-58,-19,-44],[19,-58,31,-44]], hidden:true} ],
    actors:[
      {id:'demetrios', name:'Demetrios', key:'Demetrios', folk:'greek', at:['shopFront',0,-0.6], face:Math.PI, robe:0x6a5a7a, cloth:0xd8cfb8, sash:0x8a6a3a, beard:0x6d6a66, kind:'oldman'},
      ...[[-2.6,-3.6],[-1,-4.4],[1,-4.4],[2.6,-3.6],[-3.6,-3.0],[3.6,-3.0]].map(([dx,dz],k)=>Object.assign({id:'cr'+k, at:['shopFront',dx,dz], face:Math.atan2(-dx,-0.6-dz), folk:'greek',
        robe:[0x5a4a3a,0x6b5a44,0x7a5040,0x4f6a4f,0x8a6a5a,0x5a6470][k], cloth:CLOTHS[k%CLOTHS.length], beard:k%2?0x2c241f:0x3a2a1e},
        k===0?{name:'The craftsmen', key:'the craftsmen of ephesos'}:{})),
      Object.assign({id:'shaul', at:['lodging',1.2,0], face:Math.PI/2},SHAUL),
      {id:'tg0', name:'The taught ones', at:['lodging',2.4,-1.6], face:-Math.PI/2, folk:'greek', robe:0x6e5a70, cloth:0xcfc4aa, beard:0x2c241f},
      {id:'tg1', at:['lodging',2.6,1.8], face:-Math.PI/2, folk:'greek', robe:0x5f6a52, cloth:0xd8ceb4},
      {id:'gaios', name:'Gaios', key:'Gaios', at:['street',-8,0.8], face:Math.PI/2, folk:'greek', robe:0x7a6a4a, cloth:0xcfc4aa, beard:0x3a2a1e},
      {id:'aristarchos', name:'Aristarchos', key:'Aristarchos', at:['street',-9,-0.6], face:Math.PI/2, folk:'greek', robe:0x4a5a6a, cloth:0xe6e0cf, beard:0x2c241f},
      {id:'messenger', name:'From the officials of Asia', key:'a messenger from the asiarchs', at:['street',-40,0], face:Math.PI/2, folk:'greek', robe:0xf0ece0, cloth:0xd8cfb8, sash:0x6a1a3a, hidden:true},
      {id:'alexander', name:'Alexander', key:'Alexander', at:['parodosIn',2,1.4], face:-Math.PI/2, robe:0x5a4a3a, cloth:0xe6e0cf, beard:0x6d6a66, hidden:true},
      {id:'clerk', name:'The city clerk', key:'the city clerk of ephesos', folk:'greek', at:['stage',0,-0.7], y:2.4, face:Math.PI, robe:0xf0ece0, cloth:0xe8e0cc, sash:0x6a1a3a, beard:0x9a948a, kind:'oldman', hidden:true}
    ],
    beats:[
      {t:'cam', from:['street',-20,8], fdy:6, look:['shop',0,0], dur:0.1},
      {t:'read', ref:'ACTS 19:23'},
      {t:'cam', from:['shopFront',-1.8,1.4], fdy:1.8, look:[19,1.8,10.8], dur:2.5},
      {t:'read', ref:'ACTS 19:24'},
      {t:'cam', from:['shopFront',2,-6.4], fdy:2.2, look:'demetrios', dur:2},
      {t:'say', who:'demetrios', ref:'ACTS 19:25', turn:false},
      {t:'say', who:'demetrios', ref:'ACTS 19:26', turn:false},
      {t:'say', who:'demetrios', ref:'ACTS 19:27', turn:false},
      {t:'mood', who:['cr0','cr1','cr2','cr3','cr4','cr5','demetrios'], ex:'stern'},
      {t:'pose', who:['cr1','cr2','cr4'], arms:'up'},
      {t:'cam', from:['shopFront',-3,-7.4], fdy:2.2, look:'cr1', dur:1.6},
      {t:'say', who:'craftsmen', ref:'ACTS 19:28', turn:false},
      {t:'pose', who:['cr1','cr2','cr4']},
      /* the city into the theatre, dragging Sha’ul's companions */
      {t:'show', id:'mob'},
      {t:'move', who:['cr0','cr1','gaios','aristarchos'], to:[['street',-6,0],['street',-6.4,-1.2],['street',-6,1.6],['street',-7.4,0.2]], speed:2.2, wait:false},
      {t:'cam', from:['street',4,6], fdy:3, look:'gaios', dur:2},
      {t:'read', ref:'ACTS 19:29'},
      {t:'hide', id:'mob'}, {t:'show', id:'theatrec'},
      {t:'place', who:'gaios', at:['orchestra',-1.2,1.6], face:Math.PI}, {t:'place', who:'aristarchos', at:['orchestra',1.2,1.8], face:Math.PI},
      {t:'place', who:'cr0', at:['orchestra',-2.6,0.4], face:Math.PI*0.75}, {t:'place', who:'cr1', at:['orchestra',2.8,0.2], face:-Math.PI*0.75},
      {t:'mood', who:['gaios','aristarchos'], ex:'fear'},
      {t:'cam', from:[0,20,-50], look:[0,2,-21], dur:0.1},
      {t:'wait', s:2.5},
      /* at the lodging: "the taught ones did not allow him" */
      {t:'cam', from:['lodgingDoor',5,4], fdy:2.4, look:'shaul', dur:0.1},
      {t:'move', who:'shaul', to:['lodgingDoor',-1.6,0], speed:1.3, wait:false},
      {t:'cam', release:true},
      {t:'goal', text:'Stand in the doorway — do not let Sha’ul go into the theatre', goto:'lodgingDoor', r:1.4},
      {t:'face', who:'shaul', to:'player'},
      {t:'move', who:['tg0','tg1'], to:[['lodgingDoor',-2.2,-1],['lodgingDoor',-2.2,1]], speed:1.4},
      {t:'cam', from:['lodgingDoor',3,-2.4], fdy:1.9, look:'shaul', dur:2},
      {t:'read', ref:'ACTS 19:30'},
      {t:'show', id:'messenger'},
      {t:'move', who:'messenger', to:['lodgingDoor',2,1.2], speed:2.4},
      {t:'face', who:'messenger', to:'shaul'},
      {t:'read', ref:'ACTS 19:31'},
      /* the theatre */
      {t:'cam', from:[14,9,-44], look:[0,1.6,-22], dur:0.1},
      {t:'read', ref:'ACTS 19:32'},
      {t:'show', id:'alexander'},
      {t:'move', who:'alexander', to:['orchestra',0,-0.6], speed:1.2},
      {t:'face', who:'alexander', to:['cavea',0,0]},
      {t:'pose', who:'alexander', arms:'out'},
      {t:'cam', from:['orchestra',0,5.4], fdy:2.2, look:'alexander', dur:2},
      {t:'read', ref:'ACTS 19:33'},
      {t:'pose', who:'alexander'},
      {t:'cam', from:[0,4,-15.2], look:[0,10,-44], dur:3},
      {t:'say', who:'ephesians', ref:'ACTS 19:34', turn:false},
      {t:'hide', id:'alexander'},
      {t:'note', text:'The theatre at Ephesos was cut into the side of Mount Pion and held, by the reckoning of those who have dug there, some twenty-four thousand.'},
      {t:'show', id:'clerk'},
      {t:'cam', from:['orchestra',3.4,-5], fdy:2.8, look:'clerk', dur:2},
      {t:'say', who:'clerk', ref:'ACTS 19:35', turn:false},
      {t:'say', who:'clerk', ref:'ACTS 19:36', turn:false},
      {t:'say', who:'clerk', ref:'ACTS 19:37', turn:false},
      {t:'say', who:'clerk', ref:'ACTS 19:38', turn:false},
      {t:'say', who:'clerk', ref:'ACTS 19:39', turn:false},
      {t:'say', who:'clerk', ref:'ACTS 19:40', turn:false},
      {t:'mood', who:['gaios','aristarchos']},
      {t:'cam', from:[20,14,-52], look:[0,3,-22], dur:3, wait:false},
      {t:'read', ref:'ACTS 19:41'},
      {t:'hide', id:'theatrec'},
      {t:'choice', prompt:'You', options:[
        {text:'Look at the silver shrines', reply:'Little houses of Artemis, each the size of a hand, with the goddess inside. A whole street lives by them, and this year they are not selling.'},
        {text:'Look at Sha’ul', reply:'Still angry at being kept in. "Gaios and Aristarchos were in there for me," he says. They come up the street at last, and he holds them a long time.'} ]},
      {t:'end'}
    ]},

  /* ---------------- VIII.20 — THE NORTHEASTER ---------------- */
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

  /* ---------------- VIII.21 — MELITE ---------------- */
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

  /* ---------------- VIII.22 — ROME ---------------- */
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
