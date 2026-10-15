/* ================= TSOR IN THE HEART OF THE SEAS (ROADMAP Phase D4) =================
   "O you who dwell at the entrance of the sea, merchant of the peoples to many coastlands … your borders
   are in the heart of the seas" (Yeḥezqĕl 27:3-4). The island city of Ḥiram and of Ithobaal, as she stood
   when Sha'ul's ship put in there to unload (Ma'asei 21:3): her island some six hundred metres by eight
   hundred, a little off the coast of the land, with the mole Alexander threw out to her lying broadened
   by the sand into a neck of land. The earth's heights give the later peninsula only roughly, at a
   hundred and thirty metres to a sample, and her shore is drawn here as she had it:
     · the island, its walls rising sheer out of the sea all about it, highest on the east toward the land;
     · the Sidonian harbour on the north, its basin cut into the island and closed by two moles with the
       mouth between them, its ship-sheds along the quays; the Egyptian harbour on the south, its basin
       closed by breakwaters off the shore;
     · the mole from the island to the land, its road and its gate;
     · the agora by the north harbour, the house of Melqart with its two pillars, the one of gold and the
       other of emerald (as Herodotus saw them), the house of Ashtoreth, the palace of the kings by the
       south harbour, and her houses many storeys high, higher than Rome's (Strabo), close on narrow lanes;
     · on the land, the old town of Ushu at the landward end of the mole, and the strand south of it,
       where the dyers of the purple work (left clear for their vats and their heaps of shells). */
(function(){
/* the island (metres about her middle), the mole, and the line of the land's own coast she stands off */
const ISLE=[[-200,-385],[-40,-400],[30,-420],[170,-420],[200,-330],[245,-140],[245,90],[230,300],[130,420],[-110,430],[-270,335],[-340,120],[-345,-110],[-300,-290]];
const MOLE=[[235,-180],[400,-200],[400,-90],[235,-80]];
const COAST=[[-1400,-1200],[330,-1200],[330,-300],[365,0],[400,300],[450,600],[480,900],[500,1200],[-1400,1200]];
const NH=[[-40,-440],[170,-440],[170,-250],[-40,-250]];            /* the Sidonian harbour's basin */
const DEF={
  n:'Tsor', land:'Lebanon', lat:33.27287, lon:35.19161, base:3.6, coast:true,
  square:[0,-60], reach:900, folk:96, style:'levant',
  ground:{ sea:[COAST], land:[ISLE,MOLE], cut:[NH], level:[{x:-50,z:10,rx:310,rz:450,blend:1}] },
  plan:function*(api){ const K=ANCIENT_KIT(api,DEF), box=K.box, hsh=K.hsh, M=K.MPB;
    const HS='hewn-stone', ST='stone', PL='plaster', MB='mudbrick', CE='planks', GOLD='gold-leaf', MAR='marble';
    const SEA=-3.6;                                                       /* the face of the sea, over her base */
    const inIsle=(x,z)=>{ let c=false; for(let i=0,j=ISLE.length-1;i<ISLE.length;j=i++){ const a=ISLE[i], b=ISLE[j];
      if(((a[1]>z)!==(b[1]>z))&&(x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])) c=!c; } return c; };
    /* ================= HER WALLS OUT OF THE SEA ================= */
    { const cx=-40, cz=10, ring=ISLE.map(([x,z])=>{ const d=Math.hypot(x-cx,z-cz); return [x-(x-cx)/d*3.5,z-(z-cz)/d*3.5]; });
      ring.push(ring[0]);
      /* (the east wall, toward the land and the mole, the highest: Arrian has it a hundred and fifty feet) */
      const east=ring.slice(4,8), rest=[...ring.slice(7),...ring.slice(1,5)];
      K.wall(east,{m:HS,h:24,t:5,towers:50,tw:10,th:6,gates:[[242,-130,6,'gateMole']]});
      yield;
      K.wall(rest,{m:HS,h:16,t:4.5,towers:55,tw:9,th:5,gates:[[-40,425,5,'gateSouth'],[-330,0,4,'gateWest']]});
      api.mark('wallEast',260,0); }
    yield;
    /* ================= THE SIDONIAN HARBOUR ================= */
    { const [x0,z0,x1,z1]=[NH[0][0],NH[0][1],NH[1][0],NH[2][1]].map(K.sx);
      /* its quays of hewn stone about the basin, down to the water's floor */
      box(x0-2*M,SEA-5,z1,x1+2*M,0.6,z1+2*M,HS); box(x0-2*M,SEA-5,-380,x0,0.6,z1,HS); box(x1,SEA-5,-380,x1+2*M,0.6,z1,HS);
      /* its two moles out into the sea, the mouth between them */
      box(x0-2*M,SEA-6,-500,x0+4,SEA+5,-380,HS); box(x1-4,SEA-6,-500,x1+2*M,SEA+5,-380,HS);
      box(x0,SEA-6,-500,x0+70,SEA+5,-488,HS); box(x1-70,SEA-6,-500,x1,SEA+5,-488,HS);
      K.tower(x0+2,-494,9,9,14,HS,{solid:true}); K.tower(x1-2,-494,9,9,14,HS,{solid:true});
      /* the ship-sheds along its west quay, their roofs on piers, their slips down into the water */
      for(let z=z1-12;z>-390;z-=10){ box(x0-42,0,z-0.6,x0-4,6,z+0.6,HS); box(x0-42,6,z-5,x0-4,6.9,z+5,'roof-tile'); for(let k=0;k<4;k++) box(x0-4-k*2,-0.8-k*0.7,z-4,x0-2-k*2,-k*0.7,z+4,HS); }
      api.mark('harbourSidonian',(x0+x1)/2,z1+12); api.mark('harbourMouth',(x0+x1)/2,-520); }
    /* ================= THE EGYPTIAN HARBOUR ================= */
    { /* its breakwaters off the south shore, the basin between them and the island */
      box(-260,SEA-7,560,40,SEA+4.5,574,HS); box(-272,SEA-7,430,-258,SEA+4.5,574,HS); box(150,SEA-7,520,164,SEA+4.5,560,HS);
      K.tower(40,567,10,10,12,HS,{solid:true}); K.tower(157,520,10,10,12,HS,{solid:true});
      for(let x=-200;x<120;x+=4) box(x,SEA-4,K.sx(432),x+4,0.6,K.sx(432)+2*M,HS);           /* its quay along the island */
      api.mark('harbourEgyptian',-60,500); }
    /* ================= THE MOLE AND ITS ROAD ================= */
    K.street([[240,-135],[420,-135]],12,HS);
    for(const z of [-196,-86]) for(let x=236;x<400;x+=4) box(x,SEA-3,K.sx(z),x+4,0.4,K.sx(z)+(z<0?M:-M),ST);
    api.mark('mole',320,-135); api.mark('moleLand',430,-135);
    yield;

    /* ================= THE AGORA AND HER STREETS ================= */
    const SQ=DEF.square; api.top(SQ[0]-36,SQ[1]-30,SQ[0]+36,SQ[1]+30,HS); api.mark('square',SQ[0],SQ[1]); api.mark('agora',SQ[0],SQ[1]);
    K.cols(SQ[0]-36,SQ[1]-30,SQ[0]+36,SQ[1]-30,0,6,4,0.45,MAR); K.cols(SQ[0]-36,SQ[1]+30,SQ[0]+36,SQ[1]+30,0,6,4,0.45,MAR);
    K.street([[SQ[0]+36,-135],[238,-135]],10,HS); K.street([[-320,-60],[SQ[0]-36,-60]],8,HS);
    K.street([[60,-240],[60,SQ[1]-30]],8,HS); K.street([[-40,SQ[1]+30],[-40,420]],8,HS);
    /* ================= THE HOUSE OF MELQART ================= */
    { const cx=-80, cz=210, y=K.court(cx-55,cz-40,cx+55,cz+55,8,HS,{t:2,door:'n',pave:MAR});
      K.temple(cx,cz+18,34,20,{dir:'n',podium:2.6,colH:9,m:MAR,pro:true,rows:1});
      /* the two pillars before it, the one of gold, the other of emerald that shone by night */
      box(cx-6,y,cz-14,cx-4,y+9,cz-12,GOLD); box(cx+4,y,cz-14,cx+6,y+9,cz-12,'emerald');
      K.altar(cx,cz-28,5,1.6,HS);
      api.mark('templeMelqart',cx,cz-34); api.mark('pillarsMelqart',cx,cz-18); }
    /* ================= THE HOUSE OF ASHTORETH ================= */
    { const cx=-210, cz=-170; K.court(cx-35,cz-30,cx+35,cz+30,7,HS,{t:1.8,door:'e',pave:MAR});
      K.temple(cx-6,cz,24,15,{dir:'e',podium:2,colH:7,m:MAR,pro:true}); api.mark('templeAshtoreth',cx+42,cz); }
    /* ================= THE PALACE OF THE KINGS ================= */
    { const y=K.court(60,250,215,400,12,HS,{t:2.5,rooms:14,door:'n',pave:MAR});
      K.hall(110,300,170,350,15,HS,{y,doors:[[140,300,2.2,7]]}); for(const s of [-1,1]) box(140+s*4-0.8,y,296,140+s*4+0.8,y+10,298,CE);
      api.mark('palaceTsor',138,240); }
    yield;

    /* ================= HER HOUSES, STOREY ON STOREY ================= */
    const busy=[[SQ[0]-40,SQ[1]-34,SQ[0]+40,SQ[1]+34],[-140,165,-20,270],[-250,-205,-170,-135],[55,245,220,405],[NH[0][0]-46,NH[0][1],NH[1][0]+8,NH[2][1]+8]];
    const free=(x,z,m)=>{ m=m||0;
      if(!inIsle(x,z)||!inIsle(x+12,z)||!inIsle(x-12,z)||!inIsle(x,z+12)||!inIsle(x,z-12)) return false;
      if(Math.abs(z+135)<7+m&&x>SQ[0]||Math.abs(z+60)<6+m&&x<SQ[0]||Math.abs(x-60)<6+m&&z<SQ[1]||Math.abs(x+40)<6+m&&z>SQ[1]) return false;
      if(z>420||(z>380&&x>-200&&x<130)) return false;
      return !busy.some(b=>x>b[0]-5-m&&x<b[2]+5+m&&z>b[1]-5-m&&z<b[3]+5+m); };
    /* the houses of her folk about the agora */
    K.quarter(SQ[0]-130,SQ[1]-150,SQ[0]+150,SQ[1]+190,16,(x,z)=>free(x,z,1),{w:7,wv:3});
    yield;
    /* and the tall houses, four and five storeys, wall to wall on their lanes */
    let nm=0;
    for(let bx=-330;bx<240;bx+=40) for(let bz=-400;bz<430;bz+=34){
      const x0=bx+3, x1=bx+35, z0=bz+3, z1=bz+29;
      if(![[x0,z0],[x1,z0],[x0,z1],[x1,z1]].every(p=>free(p[0],p[1],1))) continue;
      if(Math.abs((x0+x1)/2-SQ[0])<150&&(z0+z1)/2>SQ[1]-160&&(z0+z1)/2<SQ[1]+200) continue;
      const h=K.sy(9+Math.floor(hsh(bx,bz)*3)*3.2);
      K.hall(x0,z0,x1,z1,h,hsh(bx,bz*2)<0.5?PL:HS,{courts:[[(x0+x1)/2,(z0+z1)/2,4,3.4]],doors:[[(x0+x1)/2,z0,0.9,2.6],[(x0+x1)/2,z1,0.9,2.6]]});
      /* a roof-room on some, where the households sleep in the summer */
      if(hsh(bz,bx)<0.4) K.hall(x0+3,z0+3,x0+11,z0+10,2.8,PL,{y:h+K.sy(K.g(x0,z0))});
      if(++nm%14===0) yield; }
    yield;

    /* ================= USHU ON THE LAND, AND THE STRAND OF THE DYERS ================= */
    K.street([[420,-135],[560,-135]],8,'path');
    K.quarter(440,-420,700,-170,24,(x,z)=>!(Math.abs(z+135)<10)&&x>430,{w:7,wv:3});
    api.mark('ushu',560,-300);
    /* (the strand south of the mole is kept for the dyers' vats and the mounds of their shells) */
    api.mark('dyeworks',470,120); api.mark('dyeStrand',440,250);
    for(let k=0;k<40;k++){ const x=480+hsh(k,1)*300, z=-700+hsh(k,2)*500; if(!(Math.abs(z+135)<14)) K.palm(x,z,7+hsh(k,3)*4); }
    api.townGround(ISLE);
  }
};
EARTH.ancient(DEF);
})();
