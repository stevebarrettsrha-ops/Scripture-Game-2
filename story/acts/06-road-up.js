/* ACT V — THE ROAD TO YAHRUSHALAYIM. From the springs of the Yardĕn under Ḥermon to the brow of
   the Mount of Olives: Shim‛on Kĕpha's confession, the high mountain, the three times He told
   them what was about to befall Him, the long road south through Shomeron and beyond the
   Yardĕn (Luke's journey, 9:51 to 19:28), Yahriḥo, and the descent toward the city. The design
   document: "The transfiguration; Kefa's confession; the passion predictions; the long
   journey south (Luke's travel narrative); the triumphal approach."

   THE WITNESS walks with the taught ones as he has since the Yardĕn. He is not on the
   mountain — only three were, "by themselves" (Mattithyahu 17:1), and that scene is told as
   they told it after He was raised. He brings the boy to Him at the mountain's foot, carries
   bread to the table of the tax collectors, makes a way for the children, goes to the blind
   man by the road, and spreads his own garment on the way. He never speaks in a named mouth,
   and nothing he does changes what the Besorah says happened.

   THE ORDER, harmonized: Caesarea Philippi (Mattithyahu 16:13-28); "after six days" the
   mountain (17:1-13, with Luke 9:30-32 — what Mosheh and Aliyahu spoke of); the boy at its
   foot and the second telling (Mark 9:14-32); Kephar Naḥum, the tax and the little child
   (Mattithyahu 17:24-18:5); "He set His face" and the village of Shomeron (Luke 9:51-62); the
   ten lepers between Shomeron and Galil (17:11-19); the one learned in the Torah (10:25-37);
   the lost sheep, the coin and the son (15); beyond the Yardĕn, the children and the rich man
   (Yahuchanon 10:40-42; Mark 10:13-31); going up, the third telling and the sons of Zaḇdai
   (Mark 10:32-45); Yahriḥo, Zakkai and Bartimai (Luke 19:1-10; Mark 10:46-52); and the
   Mount of Olives (Luke 19:28-44, with Mattithyahu 21:4-5). The entry into the city itself
   begins Act VI. Where the Besorah does not say where a thing was said (Luke 10, 15), it is
   set on the road, and a note says so.

   THE PEOPLE are of Yasharal, brown as the Besorah's people were; Shomeron's people are of the
   land too. Yahusha's face is never shown: when He speaks the camera frames His body or looks
   over His shoulder; on the mountain His garments shine and the light is seen from behind
   Him. The unclean ruach is the dim violet shadow Scripture-Game draws the fallen with. */
(function(){
const ADULT={robe:0x8a7454, cloth:0xd8cfb8, beard:0x3a2a1e, skin:0x86573a};
const YAHUSHA={name:'Yahusha', holy:true, kind:'yahusha', key:'Yahusha'};
/* the taught ones, each one person in every scene: the same name, the same voice, as in Act IV */
const T12={
  kepha:{name:'Shim‛on Kĕpha', key:'Shim‛on Kĕpha', robe:0x6e5238, cloth:0xb9ab8e, beard:0x3a2a1e, skin:0x6e4524},
  andri:{name:'Andri', key:'Andri', robe:0x5a6a7a, cloth:0xd8ceb4, beard:0x3a2a1e, skin:0x704a27},
  yaaqob:{name:'Ya‛aqoḇ', key:'Ya‛aqoḇ son of Zaḇdai', robe:0x7a3a2a, cloth:0xcfc4aa, beard:0x2c241f, skin:0x7a4e29},
  yahuchanon:{name:'Yahuchanon', key:'Yahuchanon son of Zaḇdai', robe:0x4a5a3a, cloth:0xe6e0cf, skin:0x855a33},
  philip:{name:'Philip', key:'Philip', robe:0x6a5a7a, cloth:0xd8ceb4, beard:0x2c241f, skin:0x7c5430},
  mattithyahu:{name:'Mattithyahu', key:'Mattithyahu', robe:0x4a5a6a, cloth:0xe6e0cf, beard:0x2c241f, skin:0x855a33},
  toma:{name:'T’oma', key:'T’oma', robe:0x7a6a4a, cloth:0xcfc4aa, beard:0x3a2a1e, skin:0x6e4524},
  yahudahQ:{name:'Yahuḏah from Qerioth', key:'Yahuḏah from Qerioth', robe:0x6e5a70, cloth:0xcfc4aa, beard:0x1e1814, skin:0x8a6038}
};
const T=(id,at,extra)=>Object.assign({id,at},T12[id],extra||{});
const NINE=['andri','philip','mattithyahu','toma','yahudahQ'];
let seed=23; const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
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
const hid=list=>list.map(a=>Object.assign({},a,{hidden:true}));

/* the crowds of each scene */
const FOOTCROWD=folk('f',14,[3,11,15,21],-Math.PI*0.75);                         /* at the mountain's foot (Mark 9:14) */
const VILLAGE=folk('v',8,[2,-6,8,-2],Math.PI/2);                                 /* the village of the Shomeronites (Luke 9:52) */
const LEPERS=[0,1,2,3,4,5,6,7,8,9].map(k=>({id:'lep'+k, at:[15.6+(k%5)*1.1,-37.8+Math.floor(k/5)*1.6+(k%2)*0.3], face:Math.PI,
  robe:[0x8a8478,0x7a7468,0x9a9484][k%3], cloth:[0xb8b0a0,0xa8a090][k%2], beard:k%3?0x3a2a1e:0x6d6a66, skin:0x8a6a52, kind:'man'}));
const LISTEN=folk('l',8,[-5,3,6,8],Math.PI);                                     /* on the road (Luke 10:25) */
const SINNERS=[[-5.2,5.6,0],[-3.6,5.6,0],[-2,5.6,0],[-5.2,8.4,Math.PI],[-3.6,8.4,Math.PI],[-2,8.4,Math.PI]]
  .map(([x,z,f],k)=>({id:'s'+k, at:[x,z], face:f, sit:true, robe:ROBES[(k*5+3)%ROBES.length], cloth:CLOTHS[k%CLOTHS.length], beard:k%3?0x2c241f:null, kind:k===4?'woman':'man'}));
const BANK=folk('b',16,[-22,-10,-14,10],Math.PI/2);                               /* beyond the Yardĕn (Yahuchanon 10:41) */
const ROADCROWD=folk('r',12,[62,-4,74,4],-Math.PI/2);                            /* those who followed, afraid (Mark 10:32) */
const STREET=folk('k',16,[-22,2.4,22,3.6],Math.PI).map(a=>a.at[0]>-7&&a.at[0]<5?Object.assign(a,{at:[a.at[0]+13,a.at[1]]}):a).concat(folk('j',14,[-22,-4.2,22,-2.4],0));   /* Yahriḥo's street */
const MULT=folk('u',18,[-6,-6,6,6],0);                                             /* the crowd of the taught ones (Luke 19:37) */

STORY.act({
  id:'road-up', n:6, num:'V', title:'The Road to Yahrushalayim',
  sub:'Shim‛on Kĕpha’s confession · the long road south',
  cast:{
    taught:{name:'The taught ones', kind:'crowd', actor:'andri', actors:['andri','philip','mattithyahu','toma','yahudahQ','kepha','yaaqob','yahuchanon']},
    three:{name:'The taught ones', kind:'crowd', actor:'yahuchanon', actors:['kepha','yaaqob','yahuchanon']},
    voice:{name:'A voice out of the cloud', key:'(YAHUAH) HWHY', kind:'divine', glow:'cloudV'},
    father:{name:'The father of the boy', key:'father of the boy', kind:'man', actor:'father'},
    taxmen:{name:'Those who received the tax', key:'those who received the tax', kind:'man', actor:'tx1', actors:['tx1','tx2']},
    sons:{name:'Ya‛aqoḇ and Yahuchanon', key:'sons of zabdai', kind:'man', actor:'yaaqob', actors:['yaaqob','yahuchanon']},
    lepers:{name:'Ten leprous men', key:'ten leprous men', kind:'crowd', actor:'lep0', actors:ids(LEPERS)},
    pharisees:{name:'The Pharisees', key:'the pharisees', kind:'man', actor:'ph1', actors:['ph1','ph2','sc1']},
    many:{name:'Many', key:'many beyond the yarden', kind:'crowd', actor:'b2', actors:ids(BANK)},
    crowd:{name:'The crowd', key:'the crowd', kind:'crowd', actor:'k2', actors:ids(STREET)},
    sent:{name:'The two who were sent', key:'two who were sent', kind:'man', actor:'sent1', actors:['sent1','sent2']},
    owners:{name:'The owners of the colt', key:'owners of the colt', kind:'man', actor:'own1', actors:['own1','own2']},
    multitude:{name:'The crowd of the taught ones', key:'crowd of the taught ones', kind:'crowd', actor:'u2', actors:ids(MULT)},
    psalmist:{name:'The naḇi', key:'the nabi', kind:'oldman'}
  },
  scenes:[

  /* ---------------- V.1 — CAESAREA PHILIPPI ---------------- */
  { id:'caesarea', title:'Caesarea Philippi', date:'c. 29 CE', place:'caesarea', time:'day',
    player:{ at:'path', face:Math.PI*1.25, look:ADULT },
    actors:[
      Object.assign({id:'yahusha', at:'here', face:0},YAHUSHA),
      T('kepha',[6.4,1.6],{face:Math.PI*0.8}), T('andri',[8,2.2],{face:Math.PI}), T('yaaqob',[9.6,1.8],{face:-Math.PI*0.85}),
      T('yahuchanon',[11,0.8],{face:-Math.PI*0.7}), T('philip',[5,0.4],{face:Math.PI*0.7}), T('mattithyahu',[11.8,-0.6],{face:-Math.PI*0.6}),
      T('toma',[4.6,-1],{face:Math.PI*0.6}), T('yahudahQ',[12.4,2.4],{face:-Math.PI*0.75})
    ],
    beats:[
      {t:'cam', from:[30,12,30], look:[0,5,-22], dur:0.1},
      {t:'title', text:'Act V · The Road to Yahrushalayim', sub:'Shim‛on Kĕpha’s confession · the long road south'},
      {t:'note', text:'Caesarea Philippi lay at the foot of Ḥermon, at the northern edge of the land, where one of the springs of the Yardĕn comes out of a cave in a face of rock. The Greeks had made the cave a shrine of Pan. Herodes the Great built a temple of white stone beside it for Caesar Augustus, and his son Philip rebuilt the town and named it for Caesar.'},
      {t:'cam', from:[20,5,14], look:[8,2,-4], dur:4, wait:false},
      {t:'goal', text:'Go up the path to where they have stopped, below the rock', goto:'here', r:6},
      {t:'cam', on:'yahusha', shot:'back', toward:'andri', dur:1.8},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 16:13', turn:false},
      {t:'say', who:'taught', ref:'MATTITHYAHU 16:14', turn:false},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 16:15', turn:false},
      {t:'cam', from:[4.2,1.8,4.6], look:'kepha', dur:2},
      {t:'say', who:'kepha', ref:'MATTITHYAHU 16:16', turn:false},
      {t:'face', who:'yahusha', to:'kepha'},
      {t:'cam', on:'yahusha', shot:'back', toward:'kepha', dur:1.8},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 16:17', turn:false},
      {t:'face', who:'yahusha', to:'rock'},
      {t:'cam', from:[9.4,2.2,7.4], look:[14,5,-22], dur:2.5},       /* behind them all, to the face of the rock */
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 16:18', turn:false},
      {t:'face', who:'yahusha', to:'kepha'},
      {t:'cam', on:'yahusha', shot:'back', toward:'kepha', dur:1.8},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 16:19', turn:false},
      {t:'read', ref:'MATTITHYAHU 16:20'},
      {t:'face', who:'yahusha', to:'andri'},
      {t:'cam', on:'yahusha', shot:'back', toward:'andri', dur:1.8},
      {t:'read', ref:'MATTITHYAHU 16:21'},
      {t:'move', who:['yahusha','kepha'], to:[[15,5],[14.2,6.4]], speed:1.1},
      {t:'face', who:'kepha', to:'yahusha'},
      {t:'cam', from:[11.4,1.8,9.6], look:'kepha', dur:2},
      {t:'say', who:'kepha', ref:'MATTITHYAHU 16:22', turn:false},
      {t:'face', who:'yahusha', to:'kepha'},
      {t:'cam', on:'yahusha', shot:'back', toward:'kepha', dur:1.4},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 16:23', turn:false},
      {t:'move', who:['yahusha','kepha'], to:['here',[6.4,1.6]], speed:1.1},
      {t:'face', who:'yahusha', to:'andri'},
      {t:'cam', on:'yahusha', shot:'back', toward:'andri', dur:1.8},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 16:24', turn:false},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 16:25', turn:false},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 16:26', turn:false},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 16:27', turn:false},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 16:28', turn:false},
      {t:'cam', release:true},
      {t:'choice', prompt:'You', options:[
        {text:'Look at the white house of Caesar, and then at Him', reply:'A temple to a man who rules the world, set before a cave the Greeks call holy. And here a man of Natsareth whom a fisherman has just called the Son of the living Aluahim.'},
        {text:'Think on “take up his stake”', reply:'Every man in the land knows what a stake means: the Romans set them up along the roads. You cannot make the words sit beside Him.'} ]},
      {t:'end'}
    ]},

  /* ---------------- V.2 — THE HIGH MOUNTAIN ---------------- */
  { id:'mountain', title:'A high mountain', date:'after six days', place:'mountain', time:'night',
    player:{ at:[0,60], hidden:true, look:ADULT },
    actors:[
      Object.assign({id:'yahusha', at:[0,-1], face:0},YAHUSHA),
      T('kepha',[-1.8,2.8],{face:Math.PI*0.9}), T('yaaqob',[0,3.4],{face:Math.PI}), T('yahuchanon',[1.8,2.8],{face:-Math.PI*0.9}),
      {id:'mosheh', name:'Mosheh', at:[-2.6,-1.8], face:Math.PI/2, robe:0xe8e4d8, cloth:0xf4f0e6, beard:0xd8d4cc, kind:'oldman', hidden:true},
      {id:'aliyahu', name:'Aliyahu', at:[2.6,-1.8], face:-Math.PI/2, dress:'camelhair', robe:0xd8ccb0, cloth:0xf0eadc, beard:0xbcb4a8, kind:'oldman', hidden:true}
    ],
    glows:[ {id:'shine', at:[0,1.3,-1.4], size:4.2, color:0xfffbe8, intensity:1.6, hidden:true},
            {id:'esteemM', at:[-2.6,1.2,-2.1], size:2.6, color:0xfff4d8, intensity:0.8, hidden:true},
            {id:'esteemA', at:[2.6,1.2,-2.1], size:2.6, color:0xfff4d8, intensity:0.8, hidden:true},
            {id:'cloud', at:[0,2.6,1], size:14, h:7, color:0xf4f6ff, intensity:1.4, hidden:true},
            /* the heart of the bright cloud, out of which the voice speaks (17:5) */
            {id:'cloudV', at:[0,3.6,0.6], size:4, color:0xfffdf4, intensity:0, pulse:true, hidden:true} ],
    beats:[
      {t:'cam', from:[-12,7,-10], look:[0,1,0], dur:0.1},
      {t:'note', text:'You were not on the mountain. He took three, by themselves; the rest of you waited below. The three kept what they saw to themselves, as He ordered them, until He was raised from the dead — and this is told as they told it.'},
      {t:'read', ref:'MATTITHYAHU 17:1'},
      {t:'sit', who:['kepha','yaaqob','yahuchanon']},
      {t:'cam', from:[1,2.4,-6.4], look:[0,1.2,2.4], dur:3},            /* from behind Him, to the three */
      {t:'robe', who:'yahusha', color:0xffffff},
      {t:'show', id:'shine'},
      {t:'read', ref:'MATTITHYAHU 17:2'},
      {t:'show', id:['mosheh','aliyahu','esteemM','esteemA']},
      {t:'read', ref:'LUKE 9:30-31'},
      {t:'read', ref:'LUKE 9:32'},
      {t:'stand', who:'kepha'},
      {t:'cam', from:[-4.4,1.9,6.4], look:'kepha', dur:2},
      {t:'say', who:'kepha', ref:'MATTITHYAHU 17:4', turn:false},
      {t:'show', id:['cloud','cloudV']},
      {t:'cam', from:[-9,5,9], look:[0,2,0], dur:2.5},
      {t:'read', ref:'MATTITHYAHU 17:5', who:'voice'},
      {t:'lie', who:['kepha','yaaqob','yahuchanon'], prone:true},
      {t:'read', ref:'MATTITHYAHU 17:6'},
      {t:'hide', id:['cloud','cloudV','mosheh','aliyahu','esteemM','esteemA']},
      {t:'move', who:'yahusha', to:[0,1.6], speed:0.8},
      {t:'cam', from:[1.2,2.2,-3.4], look:[0,0.6,3.2], dur:2},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 17:7', turn:false},
      {t:'stand', who:['kepha','yaaqob','yahuchanon']},
      {t:'hide', id:'shine'},
      {t:'robe', who:'yahusha', color:0xd6c9a8},
      {t:'read', ref:'MATTITHYAHU 17:8'},
      {t:'time', to:'dawn'},
      {t:'face', who:'yahusha', to:'kepha'},
      {t:'cam', on:'yahusha', shot:'back', toward:'kepha', dur:3},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 17:9', turn:false},
      {t:'say', who:'three', ref:'MATTITHYAHU 17:10', turn:false},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 17:11', turn:false},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 17:12', turn:false},
      {t:'read', ref:'MATTITHYAHU 17:13'},
      {t:'end'}
    ]},

  /* ---------------- V.3 — THE BOY AT THE MOUNTAIN'S FOOT ---------------- */
  { id:'foot', title:'At the foot of the mountain', date:'the next day', place:'caesarea', time:'day',
    player:{ at:[14.6,18.6], face:-Math.PI*0.8, look:ADULT },
    crowds:[ {id:'footcrowd', n:200, area:[-6,4,24,32], face:-Math.PI*0.75, jitter:0.9, dy:8} ],
    actors:[
      Object.assign({id:'yahusha', at:[26,-14], face:-Math.PI*0.7},YAHUSHA),
      T('kepha',[27.4,-15],{face:-Math.PI*0.7}), T('yaaqob',[27,-13.2],{face:-Math.PI*0.7}), T('yahuchanon',[28.4,-13.8],{face:-Math.PI*0.7}),
      T('andri',[7,13.4],{face:0.6}), T('philip',[8.4,12.6],{face:0.3}), T('mattithyahu',[6,14.8],{face:0.9}), T('toma',[9.6,13.2],{face:0}), T('yahudahQ',[7.4,11.6],{face:0.5}),
      {id:'sc1', name:'A scribe', dress:'scribe', at:[9,16.2], face:Math.PI*0.9, robe:0xe6e0cf, cloth:0x5a4a3a, beard:0x6d6a66, kind:'oldman'},
      {id:'sc2', name:'A scribe', dress:'scribe', at:[10.6,15.4], face:-Math.PI*0.85, robe:0xd8d0bb, cloth:0x3c3a44, beard:0x2c241f},
      {id:'father', name:'The father of the boy', at:[12.4,17.4], face:-Math.PI*0.8, robe:0x6b5a44, cloth:0xa89a7e, beard:0x3a2a1e},
      {id:'boyR', name:'His son', kind:'boy', small:true, at:[13.4,18.6], face:-Math.PI*0.8, robe:0x8a7454, cloth:0xd8cfb8},
      ...FOOTCROWD
    ],
    glows:[ {id:'shade', at:[13.4,1.3,18.6], size:2.6, color:0x785090, intensity:0} ],
    beats:[
      {t:'cam', from:[24,5,26], look:[9,1,14], dur:0.1},
      {t:'move', who:['yahusha','kepha','yaaqob','yahuchanon'], to:[[11,9],[12.6,8.4],[9.6,8.2],[13.6,9.6]], speed:1.4, wait:false},
      {t:'read', ref:'MARK 9:14'},
      {t:'follow', who:ids(FOOTCROWD).slice(0,7), target:'yahusha'},
      {t:'read', ref:'MARK 9:15'},
      {t:'stop', who:ids(FOOTCROWD).slice(0,7)},
      {t:'face', who:'yahusha', to:'sc1'},
      {t:'cam', on:'yahusha', shot:'back', toward:'sc1', dur:1.8},
      {t:'say', who:'yahusha', ref:'MARK 9:16', turn:false},
      {t:'cam', from:[15.6,1.9,13.4], look:'father', dur:2},
      {t:'say', who:'father', ref:'MARK 9:17', turn:false},
      {t:'say', who:'father', ref:'MARK 9:18', turn:false},
      {t:'face', who:'yahusha', to:'father'},
      {t:'cam', on:'yahusha', shot:'back', toward:'father', dur:1.8},
      {t:'say', who:'yahusha', ref:'MARK 9:19', turn:false},
      {t:'cam', release:true},
      {t:'goal', text:'You are nearest the boy — help his father bring him to Him', goto:'boyR', r:2.2},
      {t:'move', who:['father','boyR'], to:[[11.6,11.2],[11.2,10.4]], speed:1},
      {t:'show', id:'shade'},
      {t:'drift', id:'shade', to:[11.2,0.6,10.4], dur:0.6},
      {t:'lie', who:'boyR'},
      {t:'cam', from:[14.4,2,12.6], look:[11.2,0.3,10.4], dur:2},
      {t:'read', ref:'MARK 9:20'},
      {t:'face', who:'yahusha', to:'father'},
      {t:'cam', on:'yahusha', shot:'back', toward:'father', dur:1.8},
      {t:'say', voices:['yahusha','father'], ref:'MARK 9:21-22', turn:false},
      {t:'say', who:'yahusha', ref:'MARK 9:23', turn:false},
      {t:'cam', from:[14,1.8,12.8], look:'father', dur:1.6},
      {t:'say', who:'father', ref:'MARK 9:24', turn:false},
      {t:'face', who:'yahusha', to:'boyR'},
      {t:'cam', on:'yahusha', shot:'back', toward:'boyR', dur:1.6},
      {t:'say', who:'yahusha', ref:'MARK 9:25', turn:false},
      {t:'drift', id:'shade', to:[2,7,-8], dur:2.2, wait:false},
      {t:'read', ref:'MARK 9:26'},
      {t:'hide', id:'shade'},
      {t:'stand', who:'boyR'}, {t:'place', who:'boyR', at:[11.4,10.8], y:null, face:-Math.PI*0.5},
      {t:'read', ref:'MARK 9:27'},
      {t:'move', who:['yahusha','kepha','yaaqob','yahuchanon','andri','philip','mattithyahu','toma','yahudahQ'],
        to:[[25.6,19.6],[24.4,17.4],[24.6,20.8],[23.2,20],[22.8,18],[23,21.8],[21.6,19.2],[21.8,21],[22.2,17]], speed:1.3},
      {t:'say', who:'taught', ref:'MARK 9:28', turn:false},
      {t:'face', who:'yahusha', to:'andri'},
      {t:'cam', on:'yahusha', shot:'back', toward:'andri', dur:1.6},
      {t:'say', who:'yahusha', ref:'MARK 9:29', turn:false},
      {t:'cam', release:true},
      {t:'read', ref:'MARK 9:30'},
      {t:'say', who:'yahusha', ref:'MARK 9:31', turn:false},
      {t:'read', ref:'MARK 9:32'},
      {t:'choice', prompt:'You', options:[
        {text:'Think of the father’s words', reply:'“I believe Master, help my unbelief.” You have not heard a truer prayer. You find it is your own.'},
        {text:'Ask the others what He meant', reply:'No one answers you. They are afraid to ask Him, and so are you.'} ]},
      {t:'end'}
    ]},

  /* ---------------- V.4 — KEPHAR NAḤUM: THE TAX, AND THE LITTLE CHILD ---------------- */
  { id:'child', title:'Kephar Naḥum', date:'back in Galil', place:'galil', time:'day',
    player:{ at:[5,-2.4], face:-Math.PI/2, look:ADULT },
    actors:[
      Object.assign({id:'yahusha', at:'simonIn', face:Math.PI/2},YAHUSHA),
      T('kepha',[-0.6,0.8],{face:Math.PI/2}), T('andri',[-2.8,9.8],{face:-Math.PI/2}), T('yaaqob',[-1.6,4.6],{face:Math.PI}),
      T('yahuchanon',[-0.4,5.6],{face:Math.PI}), T('philip',[-2.6,11.4],{face:Math.PI}), T('toma',[-0.8,10.6],{face:-Math.PI/2}),
      {id:'tx1', name:'One who received the tax', at:[2.4,1.4], face:-Math.PI/2, robe:0x5a5040, cloth:0x8a7a60, beard:0x2c241f},
      {id:'tx2', at:[2.8,-0.2], face:-Math.PI/2, robe:0x6a5a44, cloth:0xb9ab8e, beard:0x6d6a66, kind:'oldman'},
      {id:'little', name:'A little child', kind:'boy', small:true, at:[1.6,15.4], face:Math.PI, robe:0x9a7a5a, cloth:0xd8cfb8},
      {id:'mother', name:'His mother', kind:'woman', at:[2.8,15.8], face:Math.PI, robe:0x6a4a5a, cloth:0x3c3a44}
    ],
    beats:[
      {t:'cam', from:[8,3.4,-6], look:[-2,1.2,2], dur:0.1},
      {t:'cam', from:[-3.8,1.8,-2.6], look:'kepha', dur:2},
      {t:'say', who:'taxmen', ref:'MATTITHYAHU 17:24', turn:false},
      {t:'move', who:'kepha', to:[-6.4,8], speed:1.2},
      {t:'move', who:'kepha', to:[-9.8,7.2], speed:1},
      {t:'face', who:'yahusha', to:'kepha'},
      {t:'cam', on:'yahusha', shot:'back', toward:'kepha', dur:1.6},
      {t:'say', voices:['kepha','yahusha'], ref:'MATTITHYAHU 17:25', turn:false},
      {t:'say', voices:['kepha','yahusha'], ref:'MATTITHYAHU 17:26', turn:false},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 17:27', turn:false},
      {t:'move', who:'kepha', to:[-6.4,8], speed:1.3},
      {t:'move', who:'kepha', to:'beach', speed:1.4, wait:false},
      {t:'cam', release:true},
      {t:'move', who:'yahusha', to:[-6.4,8], speed:1.1},
      {t:'move', who:'yahusha', to:[-5,7.8], speed:1},
      {t:'face', who:'yahusha', to:[0,7.8]},
      {t:'sit', who:'yahusha'},
      {t:'move', who:['andri','yaaqob','yahuchanon','philip','toma'], to:[[-2.8,6],[-2.4,7.4],[-2.4,8.8],[-3,10.2],[-3.4,5]], speed:1.2},
      {t:'goal', text:'Go round to the door of the house, where they are gathering', goto:'simonDoor', r:3.4},
      {t:'say', who:'taught', ref:'MATTITHYAHU 18:1', turn:false},
      {t:'move', who:'little', to:[-3.6,7.8], speed:1.3},
      {t:'face', who:'little', to:'yahusha'},
      {t:'cam', from:[-1,1.6,4.2], look:[-4.2,0.7,7.8], dur:2},
      {t:'read', ref:'MATTITHYAHU 18:2'},
      {t:'cam', on:'yahusha', shot:'back', toward:'andri', dur:1.6},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 18:3', turn:false},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 18:4', turn:false},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 18:5', turn:false},
      {t:'say', who:'yahusha', ref:'MATTITHYAHU 18:6', turn:false},
      {t:'cam', release:true},
      {t:'choice', prompt:'You', options:[
        {text:'Look at the child', reply:'He is not sure why he has been called. He stands there among the grown men in his small robe and waits to be told.'},
        {text:'Think of the question they asked', reply:'They walked the whole road from the mountain arguing it. Now nobody will meet anyone’s eyes.'} ]},
      {t:'end'}
    ]},

  /* ---------------- V.5 — HE SET HIS FACE ---------------- */
  { id:'setface', title:'A village of the Shomeronites', date:'the road south', place:'ginae', time:'day',
    player:{ at:[17,-58], face:Math.PI, look:ADULT },
    actors:[
      Object.assign({id:'yahusha', at:[14.2,-50], face:0},YAHUSHA),
      T('kepha',[15.6,-52.4],{face:0}), T('yaaqob',[13,-52.6],{face:0}), T('yahuchanon',[14.4,-54],{face:0}),
      T('andri',[13.4,-47.4],{face:0}), T('philip',[15,-47],{face:0}), T('toma',[16.4,-54.6],{face:0}), T('mattithyahu',[12.6,-55],{face:0}),
      {id:'elder1', name:'A man of the village', at:[11,0.4], face:Math.PI/2, robe:0x6e5a44, cloth:0xcfc4aa, beard:0x6d6a66, kind:'oldman'},
      {id:'elder2', at:[11,2.2], face:Math.PI/2, robe:0x5f6a52, cloth:0xb9ab8e, beard:0x2c241f},
      {id:'f1', name:'One on the way', at:[24,10], face:-Math.PI/2, robe:0x7a5a40, cloth:0xd8ceb4, beard:0x2c241f, key:'someone on the way'},
      {id:'f2', name:'Another', at:[23.8,20.6], face:-Math.PI/2, robe:0x5a6470, cloth:0xcfc4aa, beard:0x3a2a1e, key:'man called to follow'},
      {id:'f3', name:'Another', at:[26.2,27], face:-Math.PI/2, robe:0x6b5a44, cloth:0xb9ab8e, key:'another who would follow'},
      {id:'ploughman', name:'A ploughman', at:'plough', face:0, robe:0x8a7a60, cloth:0xa89a7e, beard:0x3a2a1e},
      ...VILLAGE
    ],
    things:[ {id:'plough', kind:'box', at:[30.4,25.4], w:0.25, h:0.7, d:1.6, color:0x6e5238} ],
    beats:[
      {t:'cam', from:[24,4,-62], look:[14,1.6,-50], dur:0.1},
      {t:'read', ref:'LUKE 9:51'},
      {t:'move', who:['andri','philip'], to:[[14.6,-2],[14.6,0.4]], speed:2, wait:false},
      {t:'cam', from:[20,6,-36], look:[10,1,0], dur:4, wait:false},
      {t:'read', ref:'LUKE 9:52'},
      {t:'face', who:'elder1', to:'andri'},
      {t:'cam', from:[19,2.2,-4.6], look:[11.6,1.4,1], dur:2},
      {t:'read', ref:'LUKE 9:53'},
      {t:'move', who:['andri','philip'], to:[[15.8,-45.6],[13.2,-45.8]], speed:2},
      {t:'cam', release:true},
      {t:'goal', text:'Go down the road to them', goto:[15,-48], r:4},
      {t:'face', who:'yahusha', to:'yaaqob'},
      {t:'cam', from:[17.6,1.8,-49.2], look:'yaaqob', dur:2},
      {t:'say', who:'sons', ref:'LUKE 9:54', turn:false},
      {t:'cam', on:'yahusha', shot:'back', toward:'yaaqob', dur:1.6},
      {t:'say', who:'yahusha', ref:'LUKE 9:55-56', turn:false},
      {t:'cam', release:true},
      {t:'move', who:['yahusha','kepha','yaaqob','yahuchanon','andri','philip','toma','mattithyahu'],
        to:[[20.6,8],[19.2,6],[21.8,5.6],[18.6,4],[21,3.4],[19.4,2.2],[22.2,2],[20.6,0.4]], speed:1.3, wait:false},
      {t:'goal', text:'They go on, past the village, by the road', goto:[21,-2], r:4},
      {t:'face', who:'yahusha', to:'f1'},
      {t:'cam', from:[19.6,2,4.6], look:'f1', dur:2},
      {t:'say', who:'f1', ref:'LUKE 9:57', turn:false},
      {t:'cam', on:'yahusha', shot:'back', toward:'f1', dur:1.6},
      {t:'say', who:'yahusha', ref:'LUKE 9:58', turn:false},
      {t:'move', who:['yahusha','kepha','yaaqob','yahuchanon'], to:[[21.6,19],[20.2,16.8],[22.6,16.4],[19.6,15]], speed:1.3},
      {t:'face', who:'yahusha', to:'f2'},
      {t:'cam', on:'yahusha', shot:'back', toward:'f2', dur:1.6},
      {t:'say', voices:['yahusha','f2'], ref:'LUKE 9:59', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 9:60', turn:false},
      {t:'move', who:'f3', to:[23.6,23], speed:1.2},
      {t:'cam', from:[19.8,1.9,20.8], look:'f3', dur:1.8},
      {t:'say', who:'f3', ref:'LUKE 9:61', turn:false},
      {t:'face', who:'yahusha', to:'f3'},
      {t:'cam', from:[22,2.6,14.6], look:[30.4,0.8,25], dur:2.5},       /* past them both, to the field */
      {t:'say', who:'yahusha', ref:'LUKE 9:62', turn:false},
      {t:'cam', release:true},
      {t:'choice', prompt:'You', options:[
        {text:'Look back up the road, the way you came', reply:'Galil is behind you, and the lake, and the boats. You turn round again.'},
        {text:'Think of the fire they wanted', reply:'Sons of thunder. Aliyahu called down fire on this same country once. He would not.'} ]},
      {t:'end'}
    ]},

  /* ---------------- V.6 — THE TEN LEPERS ---------------- */
  { id:'lepers', title:'Between Shomeron and Galil', date:'on the way', place:'ginae', time:'dusk',
    player:{ at:[17.4,-64], face:Math.PI, look:ADULT },
    actors:[
      Object.assign({id:'yahusha', at:[14.6,-62], face:0},YAHUSHA),
      T('kepha',[16.2,-64.4],{face:0}), T('yahuchanon',[13,-64.6],{face:0}), T('andri',[15,-66],{face:0}),
      ...LEPERS
    ],
    beats:[
      {t:'cam', from:[24,4,-70], look:[16,1.4,-44], dur:0.1},
      {t:'read', ref:'LUKE 17:11'},
      {t:'move', who:['yahusha','kepha','yahuchanon','andri'], to:['meetLepers',[16.8,-52],[12.6,-52.4],[15,-54]], speed:1.2, wait:false},
      {t:'goal', text:'Walk on with them toward the village', goto:[17,-55], r:4},
      {t:'cam', from:[12.6,2.2,-56], look:[17.6,1.2,-37], dur:2.5},
      {t:'read', ref:'LUKE 17:12'},
      {t:'say', who:'lepers', ref:'LUKE 17:13', turn:false},
      {t:'face', who:'yahusha', to:'lep2'},
      {t:'cam', on:'yahusha', shot:'back', toward:'lep2', dur:1.8},
      {t:'say', who:'yahusha', ref:'LUKE 17:14', turn:false},
      {t:'move', who:ids(LEPERS), to:LEPERS.map((l,k)=>[18.4+(k%3)*1.2,56+k*0.8]), speed:2.2, wait:false},
      {t:'wait', s:2.4},
      {t:'move', who:'lep0', to:[16.2,-47.8], speed:2.6},
      {t:'hide', id:ids(LEPERS).slice(1)},
      /* "seeing that he was healed": the grey of the leper gone from his garments */
      {t:'robe', who:'lep0', color:0xd8ccb0, mantle:0x7a6248},
      {t:'cam', from:[19.8,2,-45], look:'lep0', dur:2},
      {t:'read', ref:'LUKE 17:15'},
      {t:'face', who:'lep0', to:'yahusha'},
      {t:'lie', who:'lep0', prone:true},                                 /* "and fell on his face at His feet" */
      {t:'read', ref:'LUKE 17:16'},
      {t:'face', who:'yahusha', to:'kepha'},
      {t:'cam', on:'yahusha', shot:'back', toward:'kepha', dur:1.6},
      {t:'say', who:'yahusha', ref:'LUKE 17:17', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 17:18', turn:false},
      {t:'stand', who:'lep0'}, {t:'place', who:'lep0', at:[16.2,-48.2], y:null, face:Math.PI},
      {t:'face', who:'yahusha', to:'lep0'},
      {t:'cam', on:'yahusha', shot:'back', toward:'lep0', dur:1.6},
      {t:'say', who:'yahusha', ref:'LUKE 17:19', turn:false},
      {t:'cam', release:true},
      {t:'choice', prompt:'You', options:[
        {text:'Watch the nine go on up the road', reply:'They are running, shouting to each other, the cloths gone from their faces. They do not look back.'},
        {text:'Look at the one who came back', reply:'A Shomeronite, the one the others would not have eaten with. He is the only one of the ten still here.'} ]},
      {t:'end'}
    ]},

  /* ---------------- V.7 — WHO IS MY NEIGHBOUR ---------------- */
  { id:'neighbour', title:'On the way', date:'the road to Yahrushalayim', place:'road', time:'day',
    player:{ at:[-24,1], face:Math.PI/2, look:ADULT },
    actors:[
      Object.assign({id:'yahusha', at:[0,0], face:0},YAHUSHA),
      T('kepha',[-2.4,-1.6],{face:0.6}), T('andri',[2.6,-1.2],{face:-0.6}), T('yahuchanon',[-1.2,-2.6],{face:0.3}), T('philip',[1.6,-2.8],{face:-0.3}),
      {id:'lawyer', name:'One learned in the Torah', key:'learned one', dress:'scribe', at:[0.4,4.4], face:Math.PI, sit:true, robe:0xe6e0cf, cloth:0x3c3a44, beard:0x2c241f, sash:0x2f4f8a},
      ...LISTEN
    ],
    beats:[
      {t:'cam', from:[-18,4,10], look:[0,1.2,1], dur:0.1},
      {t:'note', text:'Luke tells this on the long road south, and does not say where on the road it was asked.'},
      {t:'goal', text:'Catch up with them where they have stopped', goto:[-5,0], r:3.4},
      {t:'stand', who:'lawyer'},
      {t:'cam', from:[-3,1.8,1.4], look:'lawyer', dur:2},
      {t:'say', who:'lawyer', ref:'LUKE 10:25', turn:false},
      {t:'cam', on:'yahusha', shot:'back', toward:'lawyer', dur:1.6},
      {t:'say', who:'yahusha', ref:'LUKE 10:26', turn:false},
      {t:'cam', from:[-3,1.8,1.4], look:'lawyer', dur:1.6},
      {t:'say', who:'lawyer', ref:'LUKE 10:27', turn:false},
      {t:'cam', on:'yahusha', shot:'back', toward:'lawyer', dur:1.6},
      {t:'say', who:'yahusha', ref:'LUKE 10:28', turn:false},
      {t:'say', who:'lawyer', ref:'LUKE 10:29', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 10:30', turn:false},
      {t:'cam', from:[6,3.2,-4], look:[-30,1,2], dur:3},                 /* down the road, as He tells it */
      {t:'say', who:'yahusha', ref:'LUKE 10:31', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 10:32', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 10:33', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 10:34', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 10:35', turn:false},
      {t:'cam', on:'yahusha', shot:'back', toward:'lawyer', dur:1.6},
      {t:'say', who:'yahusha', ref:'LUKE 10:36', turn:false},
      {t:'say', voices:['lawyer','yahusha'], ref:'LUKE 10:37', turn:false},
      {t:'cam', release:true},
      {t:'choice', prompt:'You', options:[
        {text:'Think of the road down to Yahriḥo', reply:'Everyone knows that road: steep, bare, and the robbers in the rocks. A man left there would die there.'},
        {text:'Think of who He made the hero', reply:'A Shomeronite — after a village of them shut its gate on Him. He told it anyway.'} ]},
      {t:'end'}
    ]},

  /* ---------------- V.8 — THE LOST SHEEP, THE LOST COIN, THE LOST SON ---------------- */
  { id:'lost', title:'At the table of the tax collectors', date:'on the way', place:'ginae', time:'dusk',
    player:{ at:[8,-6], face:-Math.PI*0.8, look:ADULT },
    actors:[
      Object.assign({id:'yahusha', at:[-0.4,7], face:-Math.PI/2, sit:true},YAHUSHA),
      T('kepha',[-6.6,7],{face:Math.PI/2, sit:true}), T('mattithyahu',[0.4,5.2],{face:-Math.PI*0.7, sit:true}),
      {id:'ph1', name:'A Pharisee', dress:'scribe', at:[3.6,2.6], face:-0.9, robe:0xe6e0cf, cloth:0x5a4a3a, beard:0x6d6a66, kind:'oldman'},
      {id:'ph2', name:'A Pharisee', dress:'scribe', at:[5,1.6], face:-0.9, robe:0xd8d0bb, cloth:0x2e2a30, beard:0x2c241f},
      {id:'sc1', name:'A scribe', dress:'scribe', at:[5.2,3.6], face:-1.1, robe:0xcfc4aa, cloth:0x3c3a44, beard:0x3a2a1e},
      ...SINNERS
    ],
    things:[ {id:'bread', kind:'basket', at:[3,-2.2], full:true} ],
    beats:[
      {t:'cam', from:[9,3.4,1], look:[-3,0.6,7], dur:0.1},
      {t:'note', text:'Luke sets this, too, on the road south without naming the town. To eat with a man was to own him as a friend; the Pharisees would not sit at such a table.'},
      {t:'read', ref:'LUKE 15:1'},
      {t:'witness', text:'Carry the bread to the table', items:['bread'], verb:'Lift the basket', hold:0.4, deliver:'table', r:2.4, carryText:'Set it on the table'},
      {t:'cam', from:[0.4,1.8,-1.4], look:'ph1', dur:2},
      {t:'say', who:'pharisees', ref:'LUKE 15:2', turn:false},
      {t:'face', who:'yahusha', to:'ph1'},
      {t:'cam', on:'yahusha', shot:'back', toward:'ph1', dur:1.6},
      {t:'read', ref:'LUKE 15:3'},
      {t:'say', who:'yahusha', ref:'LUKE 15:4', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 15:5', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 15:6', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 15:7', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 15:8', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 15:9', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 15:10', turn:false},
      {t:'cam', from:[3.8,2.2,11.6], look:[-3,0.6,7], dur:2.5},          /* across the table, the faces of those who sit at it */
      {t:'say', who:'yahusha', ref:'LUKE 15:11', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 15:12', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 15:13', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 15:14', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 15:15', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 15:16', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 15:17', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 15:18-19', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 15:20', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 15:21', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 15:22', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 15:23', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 15:24', turn:false},
      {t:'cam', on:'yahusha', shot:'back', toward:'ph1', dur:2},
      {t:'say', who:'yahusha', ref:'LUKE 15:25', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 15:26', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 15:27', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 15:28', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 15:29', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 15:30', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 15:31', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 15:32', turn:false},
      {t:'cam', release:true},
      {t:'choice', prompt:'You', options:[
        {text:'Look at the Pharisees', reply:'He left the story with the older brother standing outside the music, his father pleading. They are standing outside too.'},
        {text:'Look at the faces at the table', reply:'Nobody is eating. A tax collector beside you has his face in his hands.'} ]},
      {t:'end'}
    ]},

  /* ---------------- V.9 — BEYOND THE YARDĔN: THE CHILDREN, AND THE RICH MAN ---------------- */
  { id:'beyond', title:'Beyond the Yardĕn', date:'where Yahuchanon immersed at first', place:'yarden', time:'day',
    player:{ at:[-24,-12], face:Math.PI/2, look:ADULT },
    crowds:[ {id:'bankcrowd', n:220, area:[-46,-32,-12,32], face:Math.PI/2, jitter:0.8, minY:-0.3, dy:12} ],
    actors:[
      Object.assign({id:'yahusha', at:[-10,0], face:-Math.PI/2},YAHUSHA),
      T('kepha',[-8.8,2.8],{face:-Math.PI/2}), T('andri',[-8.8,-2.8],{face:-Math.PI/2}), T('yaaqob',[-9,4.4],{face:-Math.PI/2}),
      T('yahuchanon',[-9,-4.4],{face:-Math.PI/2}), T('philip',[-8.6,6],{face:-Math.PI/2}), T('toma',[-8.6,-6],{face:-Math.PI/2}),
      {id:'c0', name:'A little child', kind:'boy', small:true, at:[-21.4,-4.2], face:Math.PI/2, robe:0x9a7a5a, cloth:0xd8cfb8},
      {id:'c1', name:'A little girl', kind:'woman', small:true, at:[-21.8,0.4], face:Math.PI/2, robe:0x9a5a62, cloth:0xe0c27a},
      {id:'c2', name:'A little child', kind:'boy', small:true, at:[-21.2,4.4], face:Math.PI/2, robe:0x6a7a5a, cloth:0xe6e0cf},
      {id:'mom0', kind:'woman', at:[-21.6,-5.4], face:Math.PI/2, robe:0x5a4a6a, cloth:0x3c3a44},
      {id:'mom1', kind:'woman', at:[-21.8,1.6], face:Math.PI/2, robe:0x6a4a3a, cloth:0xe8e2d2},
      {id:'mom2', kind:'woman', at:[-21.6,5.6], face:Math.PI/2, robe:0x4f6a4f, cloth:0x8a6a5a},
      {id:'rich', name:'One who came running', key:'rich man', at:'westRoad', face:Math.PI*0.35, robe:0x6a2a4a, cloth:0xe6dcc0, sash:0xb08d3c, beard:0x2c241f, hidden:true},
      ...BANK
    ],
    beats:[
      {t:'cam', from:[6,6,-20], look:[-14,1,0], dur:0.1},
      {t:'read', ref:'YAHUCHANON 10:40'},
      {t:'cam', from:[-6,2.4,-9], look:[-16,1.2,0], dur:2.5},
      {t:'say', who:'many', ref:'YAHUCHANON 10:41', turn:false},
      {t:'read', ref:'YAHUCHANON 10:42'},
      {t:'move', who:['mom0','mom1','mom2'], to:[[-19.6,-6],[-19.8,1.6],[-19.4,6.4]], speed:1},
      {t:'read', ref:'MARK 10:13'},
      {t:'face', who:'kepha', to:'c1'}, {t:'face', who:'andri', to:'c0'},
      {t:'cam', on:'yahusha', shot:'back', toward:'c1', dur:1.8},
      {t:'say', who:'yahusha', ref:'MARK 10:14', turn:false},
      {t:'say', who:'yahusha', ref:'MARK 10:15', turn:false},
      {t:'cam', release:true},
      {t:'witness', text:'Make a way for the little ones through the crowd', items:['c0','c1','c2'], verb:'Lead the child through', hold:0.5, reach:2.2},
      {t:'move', who:['c0','c1','c2'], to:[[-11.2,-1],[-11.4,0.4],[-11.2,1.8]], speed:1.1},
      {t:'cam', from:[-15,1.6,-3], look:[-10.6,0.8,0.4], dur:2},
      {t:'read', ref:'MARK 10:16'},
      {t:'move', who:['c0','c1','c2'], to:[[-19,-5],[-19.4,1],[-19,5.6]], speed:1.1, wait:false},
      {t:'show', id:'rich'},
      {t:'move', who:'rich', to:[-12.2,-0.6], speed:3.4},
      {t:'sit', who:'rich'},
      {t:'cam', from:[-12.6,1.8,-4.4], look:'rich', dur:1.8},
      {t:'say', who:'rich', ref:'MARK 10:17', turn:false},
      {t:'face', who:'yahusha', to:'rich'},
      {t:'cam', on:'yahusha', shot:'back', toward:'rich', dur:1.6},
      {t:'say', who:'yahusha', ref:'MARK 10:18', turn:false},
      {t:'say', who:'yahusha', ref:'MARK 10:19', turn:false},
      {t:'stand', who:'rich'},
      {t:'say', who:'rich', ref:'MARK 10:20', turn:false},
      {t:'say', who:'yahusha', ref:'MARK 10:21', turn:false},
      {t:'move', who:'rich', to:'westRoad', speed:1},
      {t:'cam', from:[-9,2.4,-6], look:[-30,1,-12], dur:2.5},
      {t:'read', ref:'MARK 10:22'},
      {t:'hide', id:'rich'},
      {t:'face', who:'yahusha', to:'kepha'},
      {t:'cam', on:'yahusha', shot:'back', toward:'kepha', dur:1.6},
      {t:'say', who:'yahusha', ref:'MARK 10:23', turn:false},
      {t:'say', who:'yahusha', ref:'MARK 10:24', turn:false},
      {t:'say', who:'yahusha', ref:'MARK 10:25', turn:false},
      {t:'say', who:'taught', ref:'MARK 10:26', turn:false},
      {t:'say', who:'yahusha', ref:'MARK 10:27', turn:false},
      {t:'cam', from:[-12.4,1.8,4.6], look:'kepha', dur:1.6},
      {t:'say', who:'kepha', ref:'MARK 10:28', turn:false},
      {t:'cam', on:'yahusha', shot:'back', toward:'kepha', dur:1.6},
      {t:'say', who:'yahusha', ref:'MARK 10:29-30', turn:false},
      {t:'say', who:'yahusha', ref:'MARK 10:31', turn:false},
      {t:'cam', release:true},
      {t:'choice', prompt:'You', options:[
        {text:'Look down the road after the rich man', reply:'He walks slowly, as if he were carrying something heavy. “He loved him,” you think. You saw it.'},
        {text:'Think of what you left', reply:'A house in Bĕyth Leḥem, your father’s scroll, the trade you were taught. A hundredfold, He said — with persecutions.'} ]},
      {t:'end'}
    ]},

  /* ---------------- V.10 — GOING UP ---------------- */
  { id:'goingup', title:'Going up to Yahrushalayim', date:'the road from the Yardĕn', place:'yeriho', time:'day',
    player:{ at:[78,5], face:-Math.PI/2, look:ADULT },
    crowds:[ {id:'followers', n:140, area:[56,-14,100,14], face:-Math.PI/2, jitter:0.7, path:[[104,0],[40,0]], clear:1.8, dy:10} ],
    actors:[
      Object.assign({id:'yahusha', at:[58,0.4], face:-Math.PI/2},YAHUSHA),
      T('kepha',[61.4,-1],{face:-Math.PI/2}), T('andri',[62,1.2],{face:-Math.PI/2}), T('yaaqob',[63,-0.4],{face:-Math.PI/2}),
      T('yahuchanon',[63.4,1.6],{face:-Math.PI/2}), T('philip',[64.6,-1.2],{face:-Math.PI/2}), T('mattithyahu',[65,0.8],{face:-Math.PI/2}),
      T('toma',[66.2,-0.6],{face:-Math.PI/2}), T('yahudahQ',[66.4,1.4],{face:-Math.PI/2}),
      ...ROADCROWD.map(a=>Object.assign({},a,{at:[a.at[0]+8,a.at[1]]}))
    ],
    beats:[
      {t:'cam', from:[38,6,-14], look:[60,1,0], dur:0.1},
      {t:'move', who:'yahusha', to:[48,0.6], speed:1.2, wait:false},
      {t:'move', who:['kepha','andri','yaaqob','yahuchanon','philip','mattithyahu','toma','yahudahQ'],
        to:[[55,-1],[55.6,1.2],[56.6,-0.4],[57,1.6],[58.2,-1.2],[58.6,0.8],[59.8,-0.6],[60,1.4]], speed:1.1, wait:false},
      {t:'move', who:ids(ROADCROWD), to:ROADCROWD.map(a=>[a.at[0]+2,a.at[1]]), speed:1, wait:false},
      {t:'read', ref:'MARK 10:32'},
      {t:'move', who:'yahusha', to:[52,0.4], speed:1.2},
      {t:'face', who:'yahusha', to:'kepha'},
      {t:'goal', text:'Keep up with the Twelve', goto:[60,0], r:4},
      {t:'cam', on:'yahusha', shot:'back', toward:'kepha', dur:1.8},
      {t:'say', who:'yahusha', ref:'MARK 10:33-34', turn:false},
      {t:'move', who:['yaaqob','yahuchanon'], to:[[53.6,-1],[53.8,0.8]], speed:1},
      {t:'cam', from:[51.2,1.8,3.6], look:[54,1.2,0], dur:1.8},
      {t:'say', who:'sons', ref:'MARK 10:35', turn:false},
      {t:'face', who:'yahusha', to:'yaaqob'},
      {t:'cam', on:'yahusha', shot:'back', toward:'yaaqob', dur:1.4},
      {t:'say', who:'yahusha', ref:'MARK 10:36', turn:false},
      {t:'say', who:'sons', ref:'MARK 10:37', turn:false},
      {t:'say', who:'yahusha', ref:'MARK 10:38', turn:false},
      {t:'say', voices:['sons','yahusha'], ref:'MARK 10:39-40', turn:false},
      {t:'cam', from:[59,2.4,4], look:[55,1.2,0], dur:2},
      {t:'read', ref:'MARK 10:41'},
      {t:'move', who:['kepha','andri','philip','mattithyahu','toma','yahudahQ'], to:[[55.4,-2.2],[55.6,2.2],[56.6,-1.2],[56.8,1.4],[57.6,-2.4],[57.6,2.6]], speed:1.1},
      {t:'face', who:'yahusha', to:'philip'},
      {t:'cam', on:'yahusha', shot:'back', toward:'philip', dur:1.6},
      {t:'say', who:'yahusha', ref:'MARK 10:42', turn:false},
      {t:'say', who:'yahusha', ref:'MARK 10:43', turn:false},
      {t:'say', who:'yahusha', ref:'MARK 10:44', turn:false},
      {t:'say', who:'yahusha', ref:'MARK 10:45', turn:false},
      {t:'cam', release:true},
      {t:'choice', prompt:'You', options:[
        {text:'Look at the road climbing behind the city', reply:'Above Yahriḥo it goes up into the bare hills, a day’s climb, to Yahrushalayim. He is walking in front, and nobody walks beside Him.'},
        {text:'Think of “a ransom for many”', reply:'A ransom is the price paid to set a captive free. You have heard Him say He will be killed three times now. This is the first time He has said why.'} ]},
      {t:'end'}
    ]},

  /* ---------------- V.11 — YAHRIḤO: ZAKKAI, AND BARTIMAI ---------------- */
  { id:'yeriho', title:'Yahriḥo', date:'the city of palm trees', place:'yeriho', time:'day',
    player:{ at:[28,-1.4], face:-Math.PI/2, look:ADULT },
    crowds:[ {id:'yerihoCrowd', n:280, area:[-62,-18,46,18], path:[[46,0],[30,0],[0,0],[-33,0],[-46,-2]], clear:2.0, facePath:true} ],
    actors:[
      Object.assign({id:'yahusha', at:[30,0.4], face:-Math.PI/2},YAHUSHA),
      T('kepha',[32.4,-0.8],{face:-Math.PI/2}), T('andri',[32.6,1.2],{face:-Math.PI/2}), T('yahuchanon',[34,0.2],{face:-Math.PI/2}),
      {id:'zakkai', name:'Zakkai', key:'Zakkai', height:1.5, at:[16,-5.6], face:-Math.PI/2, robe:0x5a3a5a, cloth:0xe6dcc0, sash:0xb08d3c, beard:0x2c241f, skin:0x7a4e29},
      {id:'bartimai', name:'Bartimai', key:'Bartimai', at:'bartimai', face:Math.PI/2, sit:true, robe:0x6b5a44, cloth:0x8a7a60, beard:0x6d6a66, kind:'oldman', hidden:true},
      ...STREET
    ],
    things:[ {id:'cloak', kind:'box', at:[-41.6,-3.6], w:1, h:0.08, d:0.7, color:0x5a4a3a, hidden:true} ],
    beats:[
      {t:'cam', from:[44,8,12], look:[10,1,0], dur:0.1},
      {t:'move', who:['yahusha','kepha','andri','yahuchanon'], to:[[18,0.2],[20.4,-0.6],[20.6,1],[22,0.2]], speed:1, wait:false},
      {t:'read', ref:'LUKE 19:1'},
      {t:'cam', from:[12,2,-8.6], look:'zakkai', dur:2},
      {t:'read', ref:'LUKE 19:2'},
      {t:'read', ref:'LUKE 19:3'},
      {t:'move', who:'zakkai', to:[1.6,-5.4], speed:3},
      {t:'move', who:'zakkai', to:[1.2,3.4], speed:2.4},
      {t:'place', who:'zakkai', at:'limb', y:2.2, face:Math.PI},
      {t:'sit', who:'zakkai'},
      {t:'cam', from:[6,2.6,-4.4], look:[1.2,2.6,5], dur:2},
      {t:'read', ref:'LUKE 19:4'},
      {t:'move', who:['yahusha','kepha','andri','yahuchanon'], to:[[1.4,1.4],[4,0],[3.6,1.8],[5.4,0.8]], speed:1},
      {t:'face', who:'yahusha', to:'zakkai'},
      {t:'cam', on:'yahusha', shot:'back', toward:'zakkai', dur:1.8},
      {t:'say', who:'yahusha', ref:'LUKE 19:5', turn:false},
      {t:'stand', who:'zakkai'}, {t:'place', who:'zakkai', at:[0.2,3], y:null, face:Math.PI},
      {t:'move', who:'zakkai', to:[0.4,1.8], speed:1.6},
      {t:'read', ref:'LUKE 19:6'},
      {t:'move', who:['zakkai','yahusha'], to:[[8.6,5.6],[7.4,5]], speed:1.1},
      {t:'face', who:'zakkai', to:'k2'},
      {t:'cam', from:[3,2.2,-1.8], look:[8,1.3,5.4], dur:2},
      {t:'say', who:'crowd', ref:'LUKE 19:7', turn:false},
      {t:'face', who:'zakkai', to:'yahusha'},
      {t:'say', who:'zakkai', ref:'LUKE 19:8', turn:false},
      {t:'face', who:'yahusha', to:'zakkai'},
      {t:'cam', on:'yahusha', shot:'back', toward:'zakkai', dur:1.6},
      {t:'say', who:'yahusha', ref:'LUKE 19:9', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 19:10', turn:false},
      {t:'cam', release:true},
      {t:'choice', prompt:'You', options:[
        {text:'Watch Zakkai go in at his own door', reply:'This morning he was the most hated man in Yahriḥo. He holds the door open for Yahusha as if he were afraid it might close.'},
        {text:'Think of “what was lost”', reply:'A sheep, a coin, a son. And now a chief tax collector in a sycamore tree.'} ]},
      {t:'time', to:'dawn'},
      {t:'place', who:'yahusha', at:[-20,0.2], face:-Math.PI/2}, {t:'place', who:'kepha', at:[-17.6,-0.8], face:-Math.PI/2},
      {t:'place', who:'andri', at:[-17.4,1.2], face:-Math.PI/2}, {t:'place', who:'yahuchanon', at:[-16,0.2], face:-Math.PI/2},
      {t:'hide', id:'zakkai'}, {t:'show', id:'bartimai'},
      {t:'player', at:[-13,-1.6], face:-Math.PI/2},
      {t:'move', who:ids(STREET).slice(0,10), to:STREET.slice(0,10).map((a,k)=>[-14+k*0.9,(k%2?2.4:-2.4)]), speed:1.4, wait:false},
      {t:'move', who:['yahusha','kepha','andri','yahuchanon'], to:[[-30,0.2],[-27.6,-0.8],[-27.4,1.2],[-26,0.2]], speed:1, wait:false},
      {t:'follow', who:ids(STREET).slice(0,10), target:'yahusha'},
      {t:'cam', from:[-48,3,-10], look:[-30,1,0], dur:3},
      {t:'read', ref:'MARK 10:46'},
      {t:'cam', from:[-38.6,1.6,-6.6], look:'bartimai', dur:2},
      {t:'say', who:'bartimai', ref:'MARK 10:47', turn:false},
      {t:'say', who:'bartimai', ref:'MARK 10:48', turn:false},
      {t:'stop', who:ids(STREET).slice(0,10)},
      {t:'face', who:'yahusha', to:'bartimai'},
      {t:'cam', release:true},
      {t:'goal', text:'He has stopped. Go out to the blind man by the road', goto:'bartimai', r:2.4},
      {t:'cam', on:'yahusha', shot:'back', toward:'bartimai', dur:1.6},
      {t:'say', voices:['yahusha','crowd'], ref:'MARK 10:49', turn:false},
      {t:'show', id:'cloak'},
      {t:'stand', who:'bartimai'},
      {t:'move', who:'bartimai', to:[-31.6,-0.6], speed:1.3},
      {t:'face', who:'bartimai', to:'yahusha'},
      {t:'cam', from:[-34,1.8,3.8], look:'bartimai', dur:1.6},
      {t:'read', ref:'MARK 10:50'},
      {t:'cam', on:'yahusha', shot:'back', toward:'bartimai', dur:1.6},
      {t:'say', voices:['yahusha','bartimai'], ref:'MARK 10:51', turn:false},
      {t:'say', who:'yahusha', ref:'MARK 10:52', turn:false},
      /* "and immediately he saw": close on him, looking about him at the road, the crowd, the light — and at Him */
      {t:'cam', on:'yahusha', shot:'back', toward:'bartimai', back:1.6, lift:-0.5, dur:1.4},
      {t:'face', who:'bartimai', to:[-44,-9]},
      {t:'wait', s:0.9},
      {t:'face', who:'bartimai', to:[-36,8]},
      {t:'wait', s:0.9},
      {t:'face', who:'bartimai', to:'yahusha'},
      {t:'wait', s:0.8},
      {t:'follow', who:'bartimai', target:'yahusha'},
      {t:'move', who:['yahusha','kepha','andri','yahuchanon'], to:['roadW',[-61.6,-0.8],[-61.4,1.2],[-60,0.2]], speed:1.1, wait:false},
      {t:'cam', from:[-40,3,8], look:[-60,1.4,0], dur:3},
      {t:'end'}
    ]},

  /* ---------------- V.12 — THE DESCENT OF THE MOUNT OF OLIVES ---------------- */
  { id:'olives', title:'The Mount of Olives', date:'before the Pesach', place:'olivet', time:'day',
    player:{ at:'top', look:ADULT },
    crowds:[ {id:'disciples', n:300, area:[66,-80,172,-10], path:[['phagi',0,0],['wait',0,0],['top',0,0],['d0',0,0],['d1',0,0],['d2',0,0],['d3',0,0],['brow',0,0]], clear:2.2, facePath:true, dy:40} ],
    actors:[
      Object.assign({id:'yahusha', at:'wait'},YAHUSHA),
      T('kepha',['wait',1.6,1.2]), T('andri',['wait',-1.4,1.6]), T('yaaqob',['wait',2.2,-1]), T('yahuchanon',['wait',-1.8,-1.4]),
      T('philip',['wait',3.2,1.6]), T('toma',['wait',0.6,2.6]),
      {id:'sent1', name:'A taught one', at:['wait',2.4,2.6], robe:0x5f6a52, cloth:0xd8ceb4, beard:0x2c241f},
      {id:'sent2', name:'A taught one', at:['wait',-2.8,0.4], robe:0x74604a, cloth:0xcfc4aa, beard:0x3a2a1e},
      {id:'own1', name:'An owner of the colt', at:['colt',1.6,0.6], robe:0x6b5a44, cloth:0xa89a7e, beard:0x6d6a66, kind:'oldman'},
      {id:'own2', at:['colt',1.2,-1], robe:0x5c5040, cloth:0xb9ab8e, beard:0x2c241f},
      {id:'ph1', name:'A Pharisee', dress:'scribe', at:'pharisees', robe:0xe6e0cf, cloth:0x5a4a3a, beard:0x6d6a66, kind:'oldman'},
      {id:'ph2', name:'A Pharisee', dress:'scribe', at:['pharisees',1.2,0.8], robe:0xd8d0bb, cloth:0x2e2a30, beard:0x2c241f},
      ...MULT.map(a=>Object.assign({},a,{at:['crowdA',a.at[0]*0.5,a.at[1]*0.5]}))
    ],
    things:[ {id:'colt', kind:'donkey', at:'colt'} ]
      .concat([0,1,2,3,4,5].map(k=>({id:'gar'+k, kind:'box', at:['d'+Math.min(3,Math.floor(k/2)),(k%2?0.7:-0.7),(k%2?0.5:-0.5)], w:1, h:0.06, d:1.5,
        color:[0x7c6a52,0x5a6470,0x8e6f4c,0x6e5a70,0x7a5040,0x4f6a4f][k], hidden:true})))
      .concat([{id:'myGar', kind:'box', at:['d1',0,0], w:1, h:0.06, d:1.5, color:0x7a6a8e, hidden:true}]),
    beats:[
      {t:'face', who:'yahusha', to:'city'},
      {t:'cam', from:'top', fdy:6, look:'city', dur:0.1},
      {t:'read', ref:'LUKE 19:28'},
      {t:'read', ref:'LUKE 19:29'},
      {t:'face', who:'yahusha', to:'sent1'},
      {t:'cam', on:'yahusha', shot:'back', toward:'sent1', dur:1.8},
      {t:'say', who:'yahusha', ref:'LUKE 19:30-31', turn:false},
      {t:'move', who:['sent1','sent2'], to:[['colt',-1,0.6],['colt',-0.6,-1]], speed:1.8},
      {t:'read', ref:'LUKE 19:32'},
      {t:'face', who:'own1', to:'sent1'},
      {t:'cam', from:['colt',-4,2], fdy:1.8, look:'own1', dur:2},
      {t:'say', who:'owners', ref:'LUKE 19:33', turn:false},
      {t:'say', who:'sent', ref:'LUKE 19:34', turn:false},
      {t:'lead', id:'colt', by:'sent1'},
      {t:'move', who:['sent1','sent2'], to:[['wait',1.8,-1.8],['wait',3,-0.6]], speed:1.4},
      {t:'lead', id:'colt'},
      {t:'cam', release:true},
      {t:'face', who:'yahusha', to:'sent1'},
      {t:'cam', on:'yahusha', shot:'back', toward:'sent1', dur:1.8},
      {t:'read', ref:'LUKE 19:35'},
      {t:'ride', who:'yahusha', on:'colt'},
      {t:'cam', on:'yahusha', shot:'back', toward:'city', back:7, dur:1.8},
      {t:'read', ref:'MATTITHYAHU 21:4'},
      {t:'read', ref:'MATTITHYAHU 21:5', who:'psalmist'},
      {t:'move', who:'yahusha', to:'d0', speed:0.9, wait:false},
      {t:'follow', who:ids(MULT).slice(0,12).concat(['kepha','andri','yaaqob','yahuchanon','philip','toma']), target:'yahusha'},
      {t:'show', id:['gar0','gar1']},
      {t:'read', ref:'LUKE 19:36'},
      {t:'witness', text:'Spread your own garment on the way before Him', items:['myGar'], verb:'Lay down your garment', hold:0.8, reach:2.6, reveal:{myGar:'myGar'}},
      {t:'show', id:['gar2','gar3','gar4','gar5']},
      {t:'move', who:'yahusha', to:'d2', speed:0.9, wait:false},
      {t:'cam', on:'yahusha', shot:'back', toward:'city', back:8, dur:3},
      {t:'read', ref:'LUKE 19:37'},
      {t:'say', who:'multitude', ref:'LUKE 19:38', turn:false},
      {t:'move', who:'yahusha', to:'d3', speed:0.9},
      {t:'cam', from:['pharisees',2.6,2.6], fdy:1.8, look:'ph1', dur:2},
      {t:'say', who:'pharisees', ref:'LUKE 19:39', turn:false},
      {t:'face', who:'yahusha', to:'ph1'},
      {t:'cam', on:'yahusha', shot:'back', toward:'ph1', dur:1.6},
      {t:'say', who:'yahusha', ref:'LUKE 19:40', turn:false},
      {t:'move', who:'yahusha', to:'brow', speed:0.8},
      {t:'face', who:'yahusha', to:'city'},
      {t:'stop', who:ids(MULT).slice(0,12).concat(['kepha','andri','yaaqob','yahuchanon','philip','toma'])},
      {t:'cam', on:'yahusha', shot:'back', toward:'city', back:8, dur:3},        /* over Him, to the city across the Qidron */
      {t:'read', ref:'LUKE 19:41'},
      {t:'say', who:'yahusha', ref:'LUKE 19:42', turn:false},
      {t:'say', who:'yahusha', ref:'LUKE 19:43-44', turn:false},
      {t:'cam', release:true},
      {t:'choice', prompt:'You', options:[
        {text:'Look where He is looking', reply:'The whole city at once, across the Qidron: the walls, the roofs, the House of white and gold over them. Everyone around you is singing, and He is weeping.'},
        {text:'Pick up a stone from the hillside', reply:'You turn it over in your hand. If these were silent, He said. You put it back where it was.'} ]},
      {t:'title', text:'The end of Act V', sub:'Next: Passion Week'},
      {t:'end'}
    ]}

  ]
});
})();
