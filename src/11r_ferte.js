/* =========================================================
   4-4 · LE PONT — La Ferté-sous-Jouarre, la Marne, deux époques
   ---------------------------------------------------------
   Le niveau existe deux fois, à la même échelle : 2026 (la grille du def, segs)
   et septembre 1914 (segs14). B fait passer de l'une à l'autre dans un éclair brumeux.
   Les deux grilles sont analysées, chacune avec ses entités, ses calques et son thème ;
   on échange simplement les tableaux de L à chaque bascule.
   Ce qui barre le chemin d'une époque (bâtiment, rivière trop large) n'existe pas dans l'autre :
   il faut basculer pour passer, parfois en plein saut.
   ========================================================= */
const FW=334,FGR=12;
VXU.fr14={coat:'#4e5a72',coat2:'#46516a',coatD:'#3a445a',trou:'#a8322d',putt:'#2a2420',helm:'#4e5a72',helmD:'#3a445a',leather:'#5a3a22',boot:'#2a1e14',tab:'#a8322d',btn:'#c9a24a'};
VXU.uk={coat:'#7a6c48',coat2:'#6c5f3e',coatD:'#5a4e32',trou:'#75683f',putt:'#6a5c3a',helm:'#7a6c48',helmD:'#5a4e32',leather:'#6a4a2a',boot:'#3a2618',tab:'#2a4a8a',btn:'#b8a46a'};

THEMES.ferte26={outdoor:true,far:'ferte',horizon:'bridge',era:26,sky:['#466a92','#a9c4d8','#f2e2c2'],celestial:'sun',sunY:250,fog:'#8a9cae',dark:.1,weather:'clear',
  floor:'#5a4834',floorTop:'#6c8c3c',type:'earth',x:'hedge',d:'hedge',shelf:'deck',spike:'wire',walker:'rat',flyer:'pie',noFore:false,props:['fern','stump','fern']};
THEMES.ferte14={outdoor:true,far:'ferte',horizon:'bridge',era:14,sky:['#4e4a42','#9c927c','#d6c6a0'],celestial:'sun',sunY:270,fog:'#a89c80',dark:.2,weather:'clear',
  floor:'#56462f',floorTop:'#6c7a3e',type:'earth',x:'sandbag',d:'hedge',shelf:'plank',spike:'wire',walker:'none',flyer:'crow',props:['fern','stump']};

/* ---------- la construction des deux grilles ---------- */
const FERTE={};
(function(){
  const mkG=()=>Array.from({length:15},()=>Array(FW).fill('.'));
  const A=mkG(),B=mkG();   // A = 2026, B = 1914
  const ground=(g,c0,c1)=>{for(let c=c0;c<=c1;c++)for(let r=FGR;r<15;r++)g[r][c]='#'};
  const water=(g,c0,c1)=>{for(let c=c0;c<=c1;c++)for(let r=0;r<15;r++)g[r][c]='.'};
  const plat=(g,c0,c1,r,ch)=>{for(let c=c0;c<=c1;c++)g[r][c]=ch||'='};
  const put=(g,c,r,ch)=>{g[r][c]=ch};
  const blocks={26:[],14:[]};
  const block=(g,era,c0,c1,kind,r0)=>{r0=r0==null?3:r0;for(let c=c0;c<=c1;c++)for(let r=r0;r<FGR;r++)g[r][c]='X';blocks[era].push({c0,c1,r0,kind})};
  ground(A,0,FW-1);ground(B,0,FW-1);
  const ents={26:[],14:[]};
  /* départ : le chemin de halage */
  put(A,3,11,'S');put(A,8,11,'h');put(A,14,11,'q');
  for(const[c,r]of[[12,10],[17,9],[26,10]])put(A,c,r,'o');
  ents[26].push({k:'rat',c:22});
  /* deux bâtiments, chacun dans son époque */
  block(A,26,34,39,'aviron');put(B,36,10,'o');put(B,37,8,'o');
  block(B,14,46,51,'passeur');put(A,48,10,'o');
  /* la berge de 2026 (en 1914, la crue l'a emportée) */
  put(A,53,11,'C');put(B,53,11,'C');
  water(B,55,99);
  water(A,57,59);                                   // un trou dans la berge…
  ents[26].push({k:'boar',c:66});                   // …et un sanglier qui ne regarde pas où il charge
  for(const[c,r]of[[58,8],[64,9],[71,10]])put(A,c,r,'o');
  FERTE.trees=[{c:78,top:4}];                        // le tronc de l'écureuil
  put(A,78,6,'o');
  water(A,84,90);FERTE.fish=[{a:84.6,b:89.4,ph:0},{a:89.6,b:84.6,ph:1.35}];
  put(A,87,7,'o');
  put(A,95,8,'m');ents[26].push({k:'rat',c:97});put(A,93,10,'o');
  ground(B,100,101);
  /* le ponton du club : la berge de 2026 s'est effondrée, l'estacade de 1914 est rompue */
  water(A,101,140);water(B,102,140);
  plat(B,102,110,FGR,'=');plat(B,129,140,FGR,'=');
  plat(A,118,121,FGR,'=');
  put(B,106,10,'o');put(A,119,10,'o');put(B,134,10,'o');
  /* la rive : le mémorial britannique (2026) */
  put(A,143,11,'C');put(B,143,11,'C');
  put(A,150,10,'o');
  block(A,26,156,159,'chantier');put(B,157,10,'o');
  /* le pont : en 2026, tablier en travaux (seule la moitié ouest… est l'est) ; en 1914, le pont de bateaux des sapeurs */
  water(A,160,229);water(B,160,229);
  plat(B,160,171,FGR,'=');put(B,172,FGR,'|');put(B,173,FGR,'M');put(B,193,FGR,'|');plat(B,194,205,FGR,'=');
  plat(A,206,229,8,'=');
  for(const[c,r]of[[165,10],[180,9],[189,9],[199,10]])put(B,c,r,'o');
  for(const[c,r]of[[212,6],[221,6]])put(A,c,r,'o');
  FERTE.gerbes=[{c:179,ph:0},{c:188,ph:2.1},{c:214,ph:.8},{c:223,ph:2.9}];
  /* l'autre rive : la culée du pont et sa rampe (2026), le chemin, puis le camping ; la ferme barricadée (1914) */
  const SH=14;
  for(let c=230;c<=232;c++)for(let r=8;r<FGR;r++)A[r][c]='#';
  for(let k=0;k<3;k++)for(let c=233+k*3;c<=235+k*3;c++)for(let r=9+k;r<FGR;r++)A[r][c]='#';
  FERTE.masks={26:[],14:[]};for(let c=230;c<=241;c++)for(let r=8;r<FGR;r++)if(A[r][c]==='#')FERTE.masks[26].push([c,r]);
  for(let c=206;c<=229;c++)FERTE.masks[26].push([c,8]);
  put(A,231,7,'C');put(B,232,11,'C');
  put(A,236,8,'o');put(B,238,10,'o');
  ents[26].push({k:'rat',c:248});
  block(B,14,240+SH,245+SH,'ferme');put(A,242+SH,10,'o');
  water(A,250+SH,252+SH);ents[26].push({k:'boar',c:258+SH});put(A,251+SH,8,'o');
  put(A,247+SH,8,'m');
  block(A,26,264+SH,268+SH,'sanitaires');put(B,266+SH,10,'o');
  for(let c=271+SH;c<=274+SH;c++)put(B,c,11,'^');put(B,272+SH,8,'o');
  ents[26].push({k:'rat',c:276+SH});
  FERTE.fires=[{c:279+SH,era:26,ph:0},{c:284.35+SH,era:14,ph:1.4}];put(A,279+SH,8,'o');put(B,285+SH,8,'o');
  /* la guinguette (2026) ; on ne finit le niveau qu'en 2026 */
  put(A,291+SH,11,'C');put(B,291+SH,11,'C');
  block(A,26,298+SH,303+SH,'guinguette');
  put(A,310+SH,10,'o');put(B,307+SH,9,'o');
  put(A,315+SH,11,'E');
  /* le grand marronnier de 1914, au départ : des branches où grimper, de la paille tout en haut */
  for(const[c,r]of[[7,9],[8,9],[4,6],[5,6],[7,3],[8,3]]){B[r][c]='=';FERTE.masks[14].push([c,r])}
  put(B,8,2,'o');
  FERTE.segs=[A.map(r=>r.join('')).join('\n')];
  FERTE.segs14=[B.map(r=>r.join('')).join('\n')];
  FERTE.blocks=blocks;FERTE.ents=ents;
  const fd=LEVELS.find(d=>d.ferte);if(fd){fd.segs=FERTE.segs;fd.segs14=FERTE.segs14}
})();

/* ---------- analyse : la deuxième époque ---------- */
const FERTE_KEYS=['acts','g','th','rats','moths','cps','movers','mark','decor','lights','exit','hints','quips','bolts','updrafts','far','mid','tiles'];
function fertePost(Lv){
  const d=Lv.def;if(!d.ferte)return;
  const d14=Object.assign({},d,{theme:'ferte14',segs:d.segs14,signs:[],hints:[],quips:[],ferte:false,flyers:null,secretAt:null,seed:d.seed+7});
  const L14=parseLevel(Lv.i,d14);L14.def=d;
  for(const m of L14.movers)if(m.kind==='dolly'){m.kind='ponton';m.speed=80}
  for(const m of Lv.moths)m.kind='pie';
  // les bêtes de 2026
  for(const e of FERTE.ents[26]){const x=e.c*T+T/2,y=FGR*T;
    if(e.k==='boar')Lv.rats.push({kind:'boar',x:x-15,y:y-16,w:30,h:16,vx:95,vy:0,onGround:false,t:e.c%7,sq:1,base:95});
    else Lv.rats.push({kind:'rat',x:x-15,y:y-16,w:30,h:16,vx:95,vy:0,onGround:false,t:e.c%7,sq:1,base:95})}
  for(const k of Lv.corn)k.era=26;for(const k of L14.corn)k.era=14;
  const E={26:{},14:{}};for(const k of FERTE_KEYS){E[26][k]=Lv[k];E[14][k]=L14[k]}
  Lv.corn=Lv.corn.concat(L14.corn);
  const F=Lv.ferte={era:26,E,t:0,flash:0,flashC:0,cool:0,said:{},fogT:0,
    squirrels:FERTE.trees.map((tr,i)=>({x:tr.c*T+T/2,y0:tr.top*T+30,y1:FGR*T-8,y:tr.top*T+30,t:i*1.7,st:'top'})),
    fish:FERTE.fish.map(f=>({xa:f.a*T,xb:f.b*T,ph:f.ph,x:0,y:0,on:false})),
    gerbes:FERTE.gerbes.map(o=>({x:o.c*T+T/2,ph:o.ph,st:'idle',k:0,bg:!!o.bg})),
    fires:FERTE.fires.map(o=>({x:o.c*T+T/2,era:o.era,ph:o.ph,h:40})),
    cer:{on:false}};
  F.tent={kind:'secret',style:'tente',x:286*T,y:FGR*T,open:0,t:0,used:false,zipAt:null,
    q:["Deux têtes rentrent, zzzip, la tente se ferme. Et devant, sur le tapis de sol, de la paille. Le camping, c'est la tranchée sans les obus."]};Lv.acts.push(F.tent);
  F.seau={kind:'secret',style:'seau',x:27*T-26,y:FGR*T,open:0,t:0,used:false,q:["Dans le seau du pêcheur : trois gardons, et de la paille pour les garder au frais. Je prends la paille. Les gardons, ce n'est pas mon rayon."]};Lv.acts.push(F.seau);
}
function cornOn(k){return!(k.era&&L.ferte&&k.era!==L.ferte.era)}
/* les calques de 1914 (fond, plan moyen, tuiles) */
function ferteLayers(){
  const F=L.ferte;if(!F)return;
  F.E[26].far=L.far;F.E[26].mid=L.mid;F.E[26].tiles=L.tiles;
  const sg=L.g,st=L.th;L.g=F.E[14].g;L.th=F.E[14].th;
  F.E[14].far=buildFar(L);F.E[14].mid=buildMid(L);F.E[14].tiles=ferteTiles(14);
  L.g=sg;L.th=st;F.E[26].tiles=L.tiles=ferteTiles(26);
}
/* les bâtiments sont dessinés à part : on les retire des tuiles le temps de les cuire */
function ferteTiles(era){const sv=[];for(const b of FERTE.blocks[era])for(let c=b.c0;c<=b.c1;c++)for(let r=b.r0;r<FGR;r++){sv.push([c,r,L.g[r][c]]);L.g[r][c]='.'}
  for(const[c,r]of FERTE.masks[era]){sv.push([c,r,L.g[r][c]]);L.g[r][c]='.'}
  const t=buildTilesF(L);for(const[c,r,ch]of sv)L.g[r][c]=ch;return t}
function ferteSet(era){
  const F=L.ferte;if(!F||F.era===era)return;
  for(const k of FERTE_KEYS)F.E[F.era][k]=L[k];
  for(const k of FERTE_KEYS)L[k]=F.E[era][k];
  F.era=era;MUS_OLD=era===14;
}
function ferteFits(era){
  const F=L.ferte,g=F.E[era].g,hb={x:P.x+3,y:P.y+3,w:P.w-6,h:P.h-4};
  const c0=Math.floor(hb.x/T),c1=Math.floor((hb.x+hb.w)/T),r0=Math.max(0,Math.floor(hb.y/T)),r1=Math.min(14,Math.floor((hb.y+hb.h)/T));
  for(let r=r0;r<=r1;r++)for(let c=c0;c<=c1;c++){if(c<0||c>=L.w)return false;if(SOLID.includes(g[r][c]))return false}
  return true;
}
function ferteSwitch(){
  const F=L.ferte;if(!F||P.dead||F.cer.on)return;
  if(F.cool>0)return;
  const to=F.era===26?14:26;
  if(!ferteFits(to)){F.cool=.4;bubble(P.x+P.w/2,P.y-14,'…','#6a5a48');if(!F.said.block){F.said.block=1;say("Le souvenir résiste. De l'autre côté, quelque chose occupe déjà la place.",3.4)}SFX.bump&&SFX.bump();return}
  ferteSet(to);F.cool=.35;F.flash=1;F.flashC=to;
  P.onMover=null;P.onGround=false;
  if(!G.sim){noise(.9,900,.18,'bandpass',0,.6);noise(1.6,260,.22,'lowpass',.05);tone(to===14?392:523,.5,'sine',.05,to===14?262:784,.02);if(to===14)setTimeout(()=>SFX.thunder(.25),120)}
  for(let i=0;i<18;i++){const a=rnd()*Math.PI*2,s=40+rnd()*120;parts.push({type:'dust',x:P.x+P.w/2,y:P.y+P.h/2,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:0,max:.7+rnd()*.5})}
  if(to===14&&!F.said.first){F.said.first=1;say("Septembre 1914. La même rivière, mais l'air sent la poudre. J'y étais : soldat de 1re classe Raymond, matricule 7413. Ma première mission.",5)}
  else if(to===26&&!F.said.back){F.said.back=1;say("Retour au présent. Les camping-cars ont remplacé les fourgons. C'est un progrès, je suppose.",3.8)}
}
function ferteRespawn(){const F=L.ferte;if(!F)return;ferteSet(P.cp&&P.cp.era||26);F.flash=.6;F.flashC=F.era;for(const s of F.gerbes){s.st='idle'}F.grace=1.2}

/* ---------- la mise à jour ---------- */
function ferteStep(dt){
  const F=L.ferte;if(!F)return;
  if(F.tent.used&&F.tent.zipAt==null)F.tent.zipAt=F.t<.3?-99:F.t;
  F.t+=dt;F.cool=Math.max(0,F.cool-dt);F.flash=Math.max(0,F.flash-dt*1.4);F.grace=Math.max(0,(F.grace||0)-dt);
  if(P.cp&&P.cp!==F.cpRef){F.cpRef=P.cp;if(P.cp.era==null)P.cp.era=F.era}
  // l'écureuil : descend le tronc, fouille au pied, remonte, guette
  for(const s of F.squirrels){s.t+=dt;const cyc=s.t%6.4;
    if(cyc<1.6){s.st='top';s.y=s.y0}else if(cyc<2.9){s.st='down';s.y=lerp(s.y0,s.y1,(cyc-1.6)/1.3)}else if(cyc<4.6){s.st='bottom';s.y=s.y1}else{s.st='up';s.y=lerp(s.y1,s.y0,(cyc-4.6)/1.8)}}
  // les poissons : un saut d'un point à l'autre du bras d'eau
  for(const f of F.fish){const cyc=(F.t+f.ph)%2.7,u=cyc/1.15;f.on=u<1;if(f.on){f.x=lerp(f.xa,f.xb,u);f.y=FGR*T+18-Math.sin(u*Math.PI)*150;f.u=u;if(u<.05&&!f.sp){f.sp=1;if(!G.sim&&F.era===26&&Math.abs(f.x-P.x)<700)splashF(f.xa,FGR*T+18)}}else{if(f.sp){f.sp=0;if(!G.sim&&F.era===26&&Math.abs(f.x-P.x)<700)splashF(f.xb,FGR*T+18)}}}
  // les gerbes d'obus allemands sur le pont de bateaux (1914)
  for(const s of F.gerbes){const cyc=(F.t+s.ph)%4.2;const st=cyc<1.1?'warn':cyc<1.7?'boom':'idle';
    if(st==='boom'&&s.st!=='boom'&&F.era===14&&!G.sim&&Math.abs(s.x-P.x)<900){noise(.6,320,s.bg?.18:.35,'lowpass');if(!s.bg){G.shake=Math.max(G.shake,Math.abs(s.x-P.x)<300?9:4);splashF(s.x,FGR*T+12,true)}}
    if(!s.bg&&st==='warn'&&s.st==='idle'&&F.era===14&&!G.sim&&Math.abs(s.x-P.x)<700)tone(1400,.9,'sine',.025,500);
    s.st=st;s.k=cyc}
  // les feux de camp : ils couvent, puis une flambée monte (une bûche s'effondre)
  for(const f of F.fires){const cyc=(F.t+f.ph)%3.4;f.h=cyc<2.2?38+Math.sin(F.t*9+f.ph)*5:38+Math.sin(Math.min(1,(cyc-2.2)/1.2)*Math.PI)*90;f.flare=cyc>=2.2}
  // le mémorial : Raymond n'y comprend rien
  if(F.era===26&&!F.said.memo&&P.x>148*T){F.said.memo=1;say("« To the glory of God… » Je n'ai jamais compris d'autre langue que le français. Et encore.",4.2)}
  // la nomination (1914, à l'emplacement de la guinguette)
  // en 1914, Raymond se souvient de sa mission
  if(F.era===14&&!P.dead){
    if(!F.said.ordres&&P.x>150*T){F.said.ordres=1;say("Lucien m'a glissé un pli dans le tube : des ordres pour l'état-major du régiment, sans doute, cantonné près de Crécy-la-Chapelle. Je dois rentrer au colombier, chez Marguerite.",5)}
    if(!F.said.pli&&P.x>311*T){F.said.pli=1;say("Ce qu'il y a dans le pli ? Je n'en sais rien. Un pigeon ne lit pas le courrier. Il le porte.",4)}}
}
function splashF(x,y,big){for(let i=0;i<(big?26:10);i++){parts.push({type:'dust',x:x+(rnd()-.5)*(big?40:14),y,vx:(rnd()-.5)*(big?260:90),vy:-(big?260:120)-rnd()*(big?300:120),life:0,max:.6+rnd()*.5})}}
function ferteAfterMove(){
  const F=L.ferte;if(!F||F.grace>0)return null;
  const hb={x:P.x+3,y:P.y+4,w:P.w-6,h:P.h-6};
  for(const f of F.fires)if(f.era===F.era&&overlap(hb,{x:f.x-16,y:FGR*T-f.h,w:32,h:f.h}))return'fire';
  if(F.era===26){
    for(const s of F.squirrels)if(overlap(hb,{x:s.x-11,y:s.y-10,w:22,h:22}))return'ecureuil';
    for(const f of F.fish)if(f.on&&f.y<FGR*T+4&&overlap(hb,{x:f.x-12,y:f.y-7,w:24,h:14}))return'poisson';
  }else{
    for(const s of F.gerbes)if(s.st==='boom'&&!s.bg){const k=(s.k-1.1)/.6,h=150*Math.sin(Math.min(1,k*1.6)*Math.PI/2);if(Math.abs(P.x+P.w/2-s.x)<30&&P.y+P.h>FGR*T-h+10)return'gerbe'}
  }
  return null;
}
/* ---------- les décors ---------- */
function ferteFar(L,g,wpx,R){
  const th=L.th,sk=th.sky,e14=th.era===14;
  const gr=g.createLinearGradient(0,0,0,460);gr.addColorStop(0,sk[0]);gr.addColorStop(.62,sk[1]);gr.addColorStop(1,sk[2]);g.fillStyle=gr;g.fillRect(0,0,wpx,600);
  const mx=wpx*.42,my=th.sunY;const mg=g.createRadialGradient(mx,my,8,mx,my,260);mg.addColorStop(0,e14?'rgba(255,236,190,.5)':'rgba(255,240,200,.65)');mg.addColorStop(1,'rgba(255,230,180,0)');g.fillStyle=mg;g.fillRect(mx-260,my-260,520,520);
  g.fillStyle=e14?'#f2e2b6':'#fff3d6';g.beginPath();g.arc(mx,my,26,0,7);g.fill();
  for(let k=0;k<wpx/240;k++){const x=R()*wpx,y=50+R()*150,w=110+R()*200;g.fillStyle=e14?'rgba(240,226,196,.14)':'rgba(255,255,255,.22)';g.beginPath();g.ellipse(x,y,w,13+R()*10,0,0,7);g.ellipse(x+w*.3,y-9,w*.5,11,0,0,7);g.fill()}
  // 1914 : fumées d'incendie et éclatements au loin, vers le nord (les Allemands se retirent)
  if(e14){for(let x=150;x<wpx;x+=420+R()*380){const h=160+R()*120;for(let k=0;k<12;k++){const u=k/12;g.fillStyle='rgba(70,62,52,'+(.22*(1-u))+')';g.beginPath();g.ellipse(x+u*h*.9+Math.sin(k)*10,430-u*h,18+u*46,12+u*26,0,0,7);g.fill()}}
    for(let k=0;k<wpx/300;k++){const x=R()*wpx,y=330+R()*60;g.fillStyle='rgba(230,220,200,.35)';g.beginPath();g.arc(x,y,6+R()*8,0,7);g.arc(x+8,y-4,5+R()*6,0,7);g.fill()}}
  const far=mix(sk[1],'#000000',.3),near=mix(sk[1],'#000000',.5);
  hills(g,wpx,400,22,mix(sk[2],far,.55),R,.004);
  hills(g,wpx,430,16,far,R,.008);
  // La Ferté sur l'autre rive : toits, clocher, et (2026) château d'eau
  for(let x=-20;x<wpx;){const w=40+R()*50,h=26+R()*30;house(g,x,462,w,h,mix(near,'#d8c8a8',.22),mix(near,e14?'#7a4a3a':'#6a5a5a',.3),R,0);x+=w+6+R()*40}
  for(let x=300;x<wpx;x+=1500){g.save();g.translate(x,462);g.scale(.55,.55);church(g,0,0,mix(near,'#000000',.1),'rgba(0,0,0,.25)');g.restore()}
  for(let x=0;x<wpx;x+=34+R()*30)poplar(g,x,470,60+R()*40,mix(near,'#1e3020',.2));
  // la Marne
  const wy=470;const wg=g.createLinearGradient(0,wy,0,600);wg.addColorStop(0,mix(sk[2],'#5a6a6a',.4));wg.addColorStop(1,mix(sk[1],'#1a2a2a',.6));g.fillStyle=wg;g.fillRect(0,wy,wpx,130);
  g.strokeStyle=e14?'rgba(240,226,196,.18)':'rgba(255,250,235,.22)';g.lineWidth=1;for(let k=0;k<wpx/14;k++){const x=R()*wpx,y=wy+6+R()*120;g.beginPath();g.moveTo(x,y);g.lineTo(x+14+R()*36,y);g.stroke()}
  g.fillStyle='rgba(255,240,200,.18)';for(let k=0;k<40;k++){const y=wy+4+k*3;g.fillRect(mx-30-k*1.2+R()*8,y,60+k*2.4,1.2)}
  const hz2=g.createLinearGradient(0,300,0,600);hz2.addColorStop(0,rgba(th.fog,0));hz2.addColorStop(1,rgba(th.fog,e14?.6:.4));g.fillStyle=hz2;g.fillRect(0,300,wpx,300);
}
function ferteMidLayer(L,g,wpx,R){
  const th=L.th,e14=th.era===14,base=mix(th.sky[1],'#000000',.62),leaf=mix(base,'#2a4a24',.35);
  for(let x=20;x<wpx;){const k=R();
    if(k<.45){roundTree(g,x,528,110+R()*80,leaf);x+=70+R()*90}
    else if(k<.7){for(let i=0;i<5;i++)poplar(g,x+i*22,528,120+R()*50,leaf);x+=150+R()*80}
    else if(k<.85){ // une péniche (2026) / une barque de pêcheur renversée (1914)
      g.fillStyle=base;if(!e14){rr(g,x,500,150,20,4);g.fill();g.fillRect(x+110,484,30,18);g.fillStyle='rgba(255,220,160,.4)';g.fillRect(x+116,488,8,6)}else{g.beginPath();g.ellipse(x+40,512,44,10,0,Math.PI,0);g.fill()}x+=220+R()*120}
    else{ // une maison de bord de Marne
      house(g,x,528,70+R()*30,50+R()*30,mix(base,'#c8b898',.15),mix(base,'#6a3a2a',.2),R,e14?0:.3);x+=150+R()*100}
  }
}

/* l'eau de la Marne, devant le fond et derrière les tuiles */
function drawFerteBack(t,cx){
  const F=L.ferte;if(!F)return;const g=ctx,e14=F.era===14,y0=FGR*T+10,x0=cx-40,x1=cx+W+60;
  const wg=g.createLinearGradient(0,y0,0,ROWS*T+40);wg.addColorStop(0,e14?'#6a6c5c':'#557276');wg.addColorStop(1,e14?'#2e3028':'#1e3436');g.fillStyle=wg;g.fillRect(x0,y0,x1-x0,ROWS*T+60-y0);
  g.strokeStyle=e14?'rgba(230,220,190,.25)':'rgba(230,245,250,.28)';g.lineWidth=1.2;
  for(let k=0;k<26;k++){const xx=x0+((k*137+t*14*(k%3+1))%(x1-x0)),yy=y0+6+(k*23)%60;g.beginPath();g.moveTo(xx,yy);g.lineTo(xx+18+(k%5)*6,yy);g.stroke()}
  const vis=(a,b)=>b>cx-200&&a<cx+W+200;
  fDecor(g,t,F.era,vis);
  // les arbres (tronc de l'écureuil) et les bâtiments du fond
  if(!e14){for(const s of F.squirrels)if(vis(s.x-120,s.x+120))fTree(g,s.x,FGR*T,s.y0-40);
    ferteMemorial(g,146*T,FGR*T,vis);
    // le pont de 2026 : piles de béton sous le tablier, garde-corps
    if(vis(206*T,230*T)){g.fillStyle='#8a8c88';for(const c of[207,214,222,229]){g.fillRect(c*T+6,8*T+40,26,FGR*T+60-8*T-40);g.fillStyle='rgba(0,0,0,.18)';g.fillRect(c*T+24,8*T+40,8,FGR*T+60-8*T-40);g.fillStyle='#8a8c88'}
      fDeckBack(g,t);}
    if(vis(160*T,206*T)){g.fillStyle='rgba(120,122,118,.85)';for(const c of[166,182,198]){g.fillRect(c*T,9*T+20,30,FGR*T+60-9*T-20);g.fillStyle='#6a6c68';poly(g,[c*T-6,9*T+20,c*T+36,9*T+20,c*T+30,9*T+34,c*T,9*T+34]);g.fill();g.fillStyle='rgba(120,122,118,.85)'}
      g.strokeStyle='#e8a020';g.lineWidth=2;g.beginPath();g.moveTo(166*T+15,9*T+20);g.lineTo(166*T+15,9*T-60);g.stroke();}
    // le camping
    if(vis(255*T,275*T)){fCaravan(g,258*T,FGR*T,'#e8e4dc','#3a6a8a');fCaravan(g,268.2*T,FGR*T,'#ece6d6','#8a4a3a');fParasol(g,262.5*T,FGR*T,t)}
  }else{
    // le camp des fantassins (pantalon garance) là où sera le club d'aviron
    if(vis(28*T,46*T))fCamp14(g,t);
    // les bateaux du pont : coques sous les planches, sapeurs au travail
    if(vis(100*T,141*T)){for(const[a,b]of[[102,110],[129,140]])fPilings(g,a,b)}
    if(vis(158*T,232*T)){for(const[a,b]of[[160,171],[194,205]])fPontoons(g,a,b);fSappers(g,t)}
  }
}
/* au premier plan des tuiles : bâtiments, bêtes, gerbes */
function drawFerteMid(t){
  const F=L.ferte;if(!F)return;const g=ctx,vis=(a,b)=>b>cam.x-220&&a<cam.x+W+220;
  for(const b of FERTE.blocks[F.era])if(vis(b.c0*T,(b.c1+1)*T))fBlock(g,b,t,F.era);
  for(const f of F.fires)if(f.era===F.era&&vis(f.x-60,f.x+60))fFire(g,f,t);
  if(F.era===26){
    for(const s of F.squirrels)if(vis(s.x-30,s.x+30))fSquirrel(g,s,t);
    for(const f of F.fish)if(f.on&&vis(f.x-30,f.x+30))fFish(g,f);
    if(vis(156*T,160*T)){fSign(g,152*T,FGR*T,'PONT FERMÉ','travaux · déviation');}
    if(vis(204*T,244*T)){fDeck(g,t);fRamp(g)}
    if(vis(30*T,34*T))fSign(g,31*T,FGR*T,"CLUB D'AVIRON","de la Marne");
    if(vis(255*T,259*T))fSign(g,257.2*T,FGR*T,'CAMPING','municipal ★★');
  }else{
    for(const s of F.gerbes)if(!s.bg&&vis(s.x-80,s.x+80))fGerbe(g,s,t);
  }
}
function fSign(g,x,y,a,b){g.save();g.font='bold 10px '+F_DISP;const hw=Math.max(40,g.measureText(a).width/2+12);g.fillStyle='#4a3a2a';g.fillRect(x-2,y-62,4,62);g.fillStyle='#ece6d2';rr(g,x-hw,y-86,hw*2,30,3);g.fill();g.strokeStyle='#2a3a5a';g.lineWidth=1.5;rr(g,x-hw+3,y-83,hw*2-6,24,2);g.stroke();
  g.fillStyle='#2a3a5a';g.textAlign='center';g.font='bold 10px '+F_DISP;g.fillText(a,x,y-71);g.font='italic 8px '+F_BODY;g.fillText(b,x,y-62);g.restore()}
function fTree(g,x,b,top){g.save();const tg=g.createLinearGradient(x-14,0,x+14,0);tg.addColorStop(0,'#3e3022');tg.addColorStop(.5,'#5e4a34');tg.addColorStop(1,'#3a2c1e');g.fillStyle=tg;
  g.beginPath();g.moveTo(x-16,b+4);g.quadraticCurveTo(x-10,b-40,x-11,top+40);g.lineTo(x+11,top+40);g.quadraticCurveTo(x+10,b-40,x+18,b+4);g.closePath();g.fill();
  g.strokeStyle='rgba(20,14,8,.35)';g.lineWidth=1;for(let y=top+60;y<b;y+=22){g.beginPath();g.moveTo(x-8,y);g.quadraticCurveTo(x,y+4,x+7,y-2);g.stroke()}
  g.strokeStyle='#4a3a28';g.lineWidth=6;g.beginPath();g.moveTo(x,top+60);g.quadraticCurveTo(x-40,top+20,x-70,top+10);g.moveTo(x,top+50);g.quadraticCurveTo(x+40,top+20,x+64,top);g.stroke();
  for(const[dx,dy,r,c]of[[-60,0,46,'#3a5a2e'],[50,-10,50,'#46682f'],[0,-30,58,'#4e7434'],[-20,10,40,'#3a5e2c'],[30,20,38,'#527a38']]){g.fillStyle=c;g.beginPath();g.arc(x+dx,top+dy,r,0,7);g.fill()}
  g.fillStyle='rgba(255,240,180,.12)';g.beginPath();g.arc(x+10,top-50,30,0,7);g.fill();g.restore()}
function fSquirrel(g,s,t){g.save();const dn=s.st==='down',up=s.st==='up',bt=s.st==='bottom';g.translate(s.x+(bt?14:6),s.y);
  if(bt){g.rotate(0)}else g.rotate(dn?Math.PI/2:-Math.PI/2);
  const st=Math.sin(t*(dn||up?18:4));
  g.fillStyle='#b0582a';g.beginPath();g.moveTo(-8,0);g.quadraticCurveTo(-22,-4+st*2,-20,-20);g.quadraticCurveTo(-14,-30,-6,-22);g.quadraticCurveTo(-10,-10,-4,-2);g.fill();
  g.fillStyle='#c2652e';g.beginPath();g.ellipse(0,-4,9,6,0,0,7);g.fill();g.beginPath();g.arc(8,-8,5,0,7);g.fill();
  poly(g,[7,-12,9,-18,11,-12]);g.fill();g.fillStyle='#efe0c8';g.beginPath();g.ellipse(2,-1,5,2.5,0,0,7);g.fill();
  g.fillStyle='#111';g.beginPath();g.arc(10,-9,1.2,0,7);g.fill();
  g.strokeStyle='#8a4a22';g.lineWidth=2;g.lineCap='round';g.beginPath();g.moveTo(-4,1);g.lineTo(-5+st*2,4);g.moveTo(4,1);g.lineTo(5-st*2,4);g.stroke();
  if(bt){g.fillStyle='#7a5a2a';g.beginPath();g.ellipse(13,-4,3,3.6,0,0,7);g.fill()}
  g.restore()}
function fFish(g,f){g.save();g.translate(f.x,f.y);const dir=f.xb>f.xa?1:-1;g.scale(dir,1);g.rotate(Math.atan2(-Math.cos(f.u*Math.PI)*150*Math.PI,Math.abs(f.xb-f.xa)));
  g.fillStyle='#8a9a8a';g.beginPath();g.ellipse(0,0,14,5.5,0,0,7);g.fill();g.fillStyle='#c8d0c0';g.beginPath();g.ellipse(2,2,10,2.4,0,0,7);g.fill();
  g.fillStyle='#6a7a6a';poly(g,[-12,0,-22,-7,-20,0,-22,7]);g.fill();poly(g,[-2,-5,4,-10,6,-5]);g.fill();
  g.fillStyle='#111';g.beginPath();g.arc(9,-1.5,1.3,0,7);g.fill();g.restore();
  g.fillStyle='rgba(220,235,240,.5)';for(let k=0;k<3;k++){g.beginPath();g.arc(f.x-(f.xb-f.xa)*.02*k-8*k*Math.sign(f.xb-f.xa),f.y+4+k*3,1.6,0,7);g.fill()}}
function fCaravan(g,x,b,body,band){g.save();g.fillStyle='#2a2a2a';g.beginPath();g.arc(x+50,b-6,9,0,7);g.fill();g.fillStyle=body;rr(g,x,b-70,120,58,14);g.fill();g.fillStyle=band;g.fillRect(x,b-36,120,6);
  g.fillStyle='#6a8aa0';rr(g,x+12,b-60,30,18,4);g.fill();rr(g,x+76,b-60,30,18,4);g.fill();g.fillStyle='#d8d2c4';g.fillRect(x+52,b-62,18,46);g.fillStyle='#888';g.fillRect(x+120,b-20,20,3);g.restore()}
function fParasol(g,x,b,t){g.save();g.strokeStyle='#6a6a6a';g.lineWidth=2;g.beginPath();g.moveTo(x,b);g.lineTo(x,b-80);g.stroke();for(let k=0;k<6;k++){g.fillStyle=k%2?'#e8e2d0':'#c8402a';poly(g,[x,b-86,x-50+k*16.6,b-64,x-33.4+k*16.6,b-64]);g.fill()}
  g.fillStyle='#e0dcd0';g.fillRect(x-24,b-30,48,4);g.fillRect(x-20,b-26,3,26);g.fillRect(x+18,b-26,3,26);g.restore()}
function ferteMemorial(g,x,b,vis){if(!vis(x-60,x+300))return;g.save();
  // le mémorial britannique de La Ferté-sous-Jouarre : pavillon de pierre blanche, quatre piliers coiffés d'urnes
  const st='#d8d4c8',sd='#a8a498',w=260;g.fillStyle=sd;g.fillRect(x-10,b-16,w+20,16);g.fillStyle=st;g.fillRect(x,b-24,w,10);
  for(const px of[x+10,x+w-46]){g.fillStyle=st;g.fillRect(px,b-170,36,146);g.fillStyle=sd;g.fillRect(px+28,b-170,8,146);g.fillStyle=st;g.fillRect(px-4,b-178,44,10);
    g.fillStyle=sd;g.beginPath();g.ellipse(px+18,b-190,12,14,0,0,7);g.fill();g.fillRect(px+12,b-206,12,6);g.fillRect(px+8,b-180,20,4)}
  g.fillStyle='#e2ded2';g.fillRect(x+50,b-120,w-100,96);g.fillStyle=sd;g.fillRect(x+50,b-128,w-100,8);
  g.fillStyle='#5a564c';g.textAlign='center';g.font='bold 9px '+F_DISP;g.fillText('1914',x+w/2,b-104);g.font='7px '+F_DISP;
  g.fillText('TO THE GLORY OF GOD',x+w/2,b-90);g.fillText('AND TO THE ENDURING MEMORY',x+w/2,b-80);g.fillText('OF 3,740 OFFICERS AND MEN',x+w/2,b-70);g.fillText('OF THE BRITISH ARMY',x+w/2,b-60);
  g.fillStyle='#7a5a3a';g.beginPath();g.ellipse(x+w/2,b-34,22,6,0,0,7);g.fill();g.fillStyle='#b8302a';for(let k=-2;k<=2;k++){g.beginPath();g.arc(x+w/2+k*7,b-38,3.2,0,7);g.fill()}
  g.restore()}
function fBlock(g,b,t,era){const x0=b.c0*T,x1=(b.c1+1)*T,top=b.r0*T,base=FGR*T,w=x1-x0;g.save();
  if(b.kind==='aviron'){ // hangar à bateaux du club, bardage et grande porte
    g.fillStyle='#c8b896';g.fillRect(x0,top+30,w,base-top-30);g.fillStyle='#8a3a2a';poly(g,[x0-12,top+34,x0+w/2,top-14,x1+12,top+34]);g.fill();
    g.strokeStyle='rgba(90,70,40,.35)';g.lineWidth=1;for(let x=x0+8;x<x1;x+=10){g.beginPath();g.moveTo(x,top+34);g.lineTo(x,base);g.stroke()}
    g.fillStyle='#4a3a2a';g.fillRect(x0+30,base-150,w-60,150);g.strokeStyle='#6a5a44';g.lineWidth=2;for(let y=base-140;y<base;y+=20){g.beginPath();g.moveTo(x0+30,y);g.lineTo(x1-30,y);g.stroke()}
    g.fillStyle='#e8e2cc';g.fillRect(x0+w/2-70,top+50,140,22);g.fillStyle='#2a3a5a';g.font='bold 11px '+F_DISP;g.textAlign='center';g.fillText('AVIRON MARNOIS',x0+w/2,top+66);
    g.fillStyle='#d8dcd8';g.save();g.translate(x0+20,base-178);g.rotate(-.05);rr(g,0,0,w-40,10,5);g.fill();g.restore();
  }else if(b.kind==='chantier'){ // palissade de chantier, grue
    g.fillStyle='#e8e4dc';g.fillRect(x0,top+60,w,base-top-60);g.fillStyle='#d8302a';for(let y=top+70;y<base;y+=46)g.fillRect(x0,y,w,8);
    g.fillStyle='#2a3a5a';g.fillRect(x0+10,top+110,w-20,60);g.fillStyle='#ece6d2';g.font='bold 12px '+F_DISP;g.textAlign='center';g.fillText('PONT FERMÉ',x0+w/2,top+134);g.font='9px '+F_BODY;g.fillText('réfection du tablier',x0+w/2,top+150);g.fillText('fin des travaux : 2027',x0+w/2,top+163);
    g.strokeStyle='#e8a020';g.lineWidth=4;g.beginPath();g.moveTo(x0+w/2,top+60);g.lineTo(x0+w/2,top-80);g.lineTo(x0+w/2+320,top-80);g.moveTo(x0+w/2-60,top-80);g.lineTo(x0+w/2,top-80);g.stroke();
    g.lineWidth=1.4;for(let k=0;k<10;k++){g.beginPath();g.moveTo(x0+w/2+k*32,top-80);g.lineTo(x0+w/2+k*32+16,top-66);g.lineTo(x0+w/2+k*32+32,top-80);g.stroke()}
    g.strokeStyle='#333';g.lineWidth=1;const hx=x0+w/2+220+Math.sin(t*.4)*30;g.beginPath();g.moveTo(hx,top-80);g.lineTo(hx,top+10);g.stroke();g.fillStyle='#e8a020';g.fillRect(hx-6,top+10,12,8);
  }else if(b.kind==='sanitaires'){ // le bloc sanitaire du camping : bardage bois, toit à un pan, plaques émaillées
    const wt=top+80;g.fillStyle='#a8865a';g.fillRect(x0,wt,w,base-wt);
    g.strokeStyle='rgba(70,48,24,.35)';g.lineWidth=1;for(let y=wt+12;y<base;y+=12){g.beginPath();g.moveTo(x0,y);g.lineTo(x1,y);g.stroke()}
    g.fillStyle='#c8b896';g.fillRect(x0,base-34,w,34);g.fillStyle='rgba(0,0,0,.12)';g.fillRect(x0,base-34,w,3);
    g.fillStyle='#4a5a52';poly(g,[x0-14,wt+6,x1+14,wt-34,x1+14,wt-22,x0-14,wt+18]);g.fill();
    const door=(dx,lbl,ico)=>{g.fillStyle='#3e5a4e';g.fillRect(dx,base-112,44,112);g.strokeStyle='#2e443a';g.lineWidth=2;g.strokeRect(dx+4,base-106,36,46);g.strokeRect(dx+4,base-54,36,46);
      g.fillStyle='#d8c890';g.beginPath();g.arc(dx+36,base-56,2.2,0,7);g.fill();
      g.fillStyle='#1e3a6a';rr(g,dx-6,base-142,56,22,3);g.fill();g.strokeStyle='#e8e2d0';g.lineWidth=1;rr(g,dx-4,base-140,52,18,2);g.stroke();
      g.fillStyle='#e8e2d0';g.font='bold 9px '+F_DISP;g.textAlign='center';g.fillText(lbl,dx+22,base-127);ico(dx+22,base-84)};
    door(x0+20,'WC',(cx,cy)=>{g.fillStyle='rgba(232,226,208,.8)';g.beginPath();g.arc(cx-6,cy-12,3,0,7);g.arc(cx+6,cy-12,3,0,7);g.fill();g.fillRect(cx-8,cy-8,5,12);poly(g,[cx+3,cy+4,cx+6,cy-8,cx+9,cy+4]);g.fill()});
    door(x1-64,'DOUCHES',(cx,cy)=>{g.strokeStyle='rgba(232,226,208,.8)';g.lineWidth=2;g.beginPath();g.moveTo(cx-8,cy+6);g.lineTo(cx-8,cy-14);g.lineTo(cx+2,cy-14);g.stroke();g.fillStyle='rgba(232,226,208,.8)';for(let k=0;k<4;k++)g.fillRect(cx-1+k*3,cy-9+k*2,1.5,4)});
    g.strokeStyle='#6a4a2a';g.lineWidth=1;for(let x=x0+76;x<x1-70;x+=30){g.fillStyle='rgba(170,200,210,.7)';g.fillRect(x,wt+30,20,12);g.strokeRect(x,wt+30,20,12)}
    g.fillStyle='#4a7a3a';for(const px of[x0+4,x1-4]){g.beginPath();g.arc(px,base-14,14,0,7);g.arc(px+8,base-22,10,0,7);g.fill()}
    g.fillStyle='#e8402a';for(const px of[x0+2,x0+10,x1-6]){g.beginPath();g.arc(px,base-24,2.4,0,7);g.fill()}
  }else if(b.kind==='guinguette'){ // la guinguette des bords de Marne : colombages, véranda, store rayé, guirlande, enseigne peinte
    const wt=top+40,fl=base-150;g.fillStyle='#e8dcc0';g.fillRect(x0,wt,w,fl-wt);
    g.strokeStyle='#5a3a24';g.lineWidth=6;g.strokeRect(x0+3,wt+3,w-6,fl-wt-3);g.lineWidth=5;
    for(let k=1;k<4;k++){g.beginPath();g.moveTo(x0+k*w/4,wt);g.lineTo(x0+k*w/4,fl);g.stroke()}
    g.beginPath();g.moveTo(x0,wt+(fl-wt)*.5);g.lineTo(x1,wt+(fl-wt)*.5);g.stroke();
    g.lineWidth=4;for(let k=0;k<4;k++){const a=x0+k*w/4,c=a+w/4,m=wt+(fl-wt)*.5;g.beginPath();g.moveTo(a,k%2?m:wt);g.lineTo(c,k%2?wt:m);g.stroke()}
    // toit de tuiles et lucarne
    g.fillStyle='#9a4a32';poly(g,[x0-18,wt+4,x0+w*.5,wt-80,x1+18,wt+4]);g.fill();g.strokeStyle='rgba(60,24,14,.4)';g.lineWidth=1;for(let k=1;k<10;k++){const y=wt+4-k*8.4;const hw=(w/2+18)*(1-k/10.5);g.beginPath();g.moveTo(x0+w/2-hw,y);g.lineTo(x0+w/2+hw,y);g.stroke()}
    g.fillStyle='#e8dcc0';g.fillRect(x0+w/2-18,wt-44,36,30);g.fillStyle='#7a3a26';poly(g,[x0+w/2-24,wt-42,x0+w/2,wt-62,x0+w/2+24,wt-42]);g.fill();g.fillStyle='rgba(255,210,130,.75)';g.fillRect(x0+w/2-10,wt-38,20,20);
    // fenêtres de l'étage, volets verts, jardinières
    for(const wx of[x0+w*.18,x0+w*.68]){const wy=wt+(fl-wt)*.5-56;g.fillStyle='#4a6a4a';g.fillRect(wx-16,wy,12,44);g.fillRect(wx+28,wy,12,44);g.fillStyle='rgba(255,214,140,.8)';g.fillRect(wx-4,wy,32,44);g.strokeStyle='#5a3a24';g.lineWidth=2;g.strokeRect(wx-4,wy,32,44);g.beginPath();g.moveTo(wx+12,wy);g.lineTo(wx+12,wy+44);g.moveTo(wx-4,wy+20);g.lineTo(wx+28,wy+20);g.stroke();
      g.fillStyle='#6a4a2a';g.fillRect(wx-8,wy+44,40,8);for(let k=0;k<6;k++){g.fillStyle=k%2?'#d83a3a':'#e8e0d0';g.beginPath();g.arc(wx-4+k*6.5,wy+42,3.4,0,7);g.fill()}g.fillStyle='#4a7a3a';g.fillRect(wx-6,wy+43,36,3)}
    // l'enseigne peinte, au-dessus du store
    const sy=fl-34;g.fillStyle='#2a3a2a';rr(g,x0+14,sy-30,w-28,30,4);g.fill();g.strokeStyle='#c9a24a';g.lineWidth=1.6;rr(g,x0+18,sy-26,w-36,22,3);g.stroke();
    g.fillStyle='#f0e2b8';g.font='bold 14px '+F_DISP;g.textAlign='center';g.fillText('GUINGUETTE · BAL',x0+w/2,sy-10);
    // rez-de-chaussée : grandes baies éclairées, piliers, comptoir
    g.fillStyle='#5a3a24';g.fillRect(x0,fl,w,base-fl);
    for(let k=0;k<3;k++){const bx=x0+12+k*(w-24)/3,bw=(w-24)/3-10;g.fillStyle='rgba(255,206,120,.85)';g.fillRect(bx,fl+46,bw,base-fl-60);g.strokeStyle='#3a2414';g.lineWidth=2;g.strokeRect(bx,fl+46,bw,base-fl-60);
      for(let j=1;j<3;j++){g.beginPath();g.moveTo(bx+j*bw/3,fl+46);g.lineTo(bx+j*bw/3,base-14);g.stroke()}
      g.fillStyle='rgba(60,30,20,.55)';g.beginPath();g.arc(bx+bw*.35,base-40,7,0,7);g.fill();g.fillRect(bx+bw*.35-6,base-34,12,20);g.beginPath();g.arc(bx+bw*.7,base-44,7,0,7);g.fill();g.fillRect(bx+bw*.7-6,base-38,12,24)}
    g.fillStyle='#3a2414';g.fillRect(x0,base-14,w,14);
    // store rayé festonné
    const ay=fl+6;for(let k=0;k<12;k++){const ax=x0-14+k*(w+28)/12,aw=(w+28)/12;g.fillStyle=k%2?'#f2ece0':'#b8302a';g.beginPath();g.moveTo(ax,fl-6);g.lineTo(ax+aw,fl-6);g.lineTo(ax+aw+2,ay+20);g.quadraticCurveTo(ax+aw/2,ay+30,ax-2,ay+20);g.closePath();g.fill()}
    g.fillStyle='rgba(0,0,0,.15)';g.fillRect(x0-14,fl-6,w+28,4);
    // la guirlande, sous le store
    g.strokeStyle='#2a2a2a';g.lineWidth=1;const gy=ay+40;g.beginPath();for(let k=0;k<=4;k++){const ax=x0-10+k*(w+20)/4;if(k===0)g.moveTo(ax,gy);else g.quadraticCurveTo(ax-(w+20)/8,gy+16,ax,gy)}g.stroke();
    for(let k=0;k<16;k++){const u=k/16,seg=Math.floor(u*4),lu=u*4-seg,ax=x0-10+u*(w+20),ay2=gy+Math.sin(lu*Math.PI)*12;const on=.65+.35*Math.sin(t*3+k*1.7);g.fillStyle=['rgba(255,90,60,','rgba(255,210,80,','rgba(90,170,255,','rgba(120,230,120,'][k%4]+on+')';g.beginPath();g.arc(ax,ay2+3,3.2,0,7);g.fill()}
  }else if(b.kind==='passeur'){ // la maison du passeur : pierre et enduit à la chaux, toit de tuiles plates, cloche d'appel, avirons, filets
    const wt=top+56,mid=wt+(base-wt)*.48;
    // le soubassement de meulière, puis l'enduit
    g.fillStyle='#c9b994';g.fillRect(x0,wt,w,base-wt);
    g.fillStyle='rgba(120,100,70,.18)';for(let k=0;k<26;k++){const px=x0+((k*53)%w),py=wt+((k*97)%(base-wt-60));g.beginPath();g.ellipse(px,py,10+(k%4)*4,5+(k%3)*2,0,0,7);g.fill()}
    g.fillStyle='#8a7a5e';g.fillRect(x0,base-56,w,56);g.fillStyle='rgba(60,48,32,.35)';for(let y=base-52;y<base;y+=13)for(let x=x0+((y/13|0)%2)*10;x<x1;x+=22){rr(g,x+1,y,19,11,4);g.fill()}
    // chaînes d'angle en pierre de taille
    for(const cx of[x0,x1-16])for(let y=wt;y<base-56;y+=24){g.fillStyle='#ddd2b8';g.fillRect(cx+((y-wt)/24%2?0:0),y,(y-wt)/24%2?16:22-(cx>x0?6:0),22);g.fillStyle='rgba(0,0,0,.1)';g.fillRect(cx,y+21,16,1)}
    // le bandeau d'étage
    g.fillStyle='#b4a482';g.fillRect(x0-4,mid-4,w+8,8);
    // le toit de tuiles plates, ses rangs, la cheminée, la lucarne
    g.fillStyle='#8a4a34';poly(g,[x0-16,wt+6,x0+30,wt-92,x1-30,wt-92,x1+16,wt+6]);g.fill();
    g.strokeStyle='rgba(50,22,12,.35)';g.lineWidth=1;for(let k=1;k<11;k++){const y=wt+6-k*9,ix=46*k/10.6;g.beginPath();g.moveTo(x0-16+ix,y);g.lineTo(x1+16-ix,y);g.stroke();for(let x=x0-12+ix+((k%2)*6);x<x1+12-ix;x+=12){g.beginPath();g.moveTo(x,y);g.lineTo(x,y+9);g.stroke()}}
    g.fillStyle='#6a3a26';g.fillRect(x0+30,wt-94,w-60,6);
    g.fillStyle='#9a8a6a';g.fillRect(x1-62,wt-130,26,50);g.fillStyle='#7a6a4e';g.fillRect(x1-66,wt-134,34,6);g.fillStyle='rgba(200,190,170,.3)';g.beginPath();g.arc(x1-49,wt-146,9,0,7);g.arc(x1-42,wt-162,12,0,7);g.fill();
    g.fillStyle='#c9b994';g.fillRect(x0+w/2-22,wt-62,44,40);g.fillStyle='#8a4a34';poly(g,[x0+w/2-30,wt-60,x0+w/2,wt-84,x0+w/2+30,wt-60]);g.fill();g.fillStyle='#3a3a3a';g.fillRect(x0+w/2-12,wt-54,24,26);g.strokeStyle='#e8dcc0';g.lineWidth=1.5;g.strokeRect(x0+w/2-12,wt-54,24,26);g.beginPath();g.moveTo(x0+w/2,wt-54);g.lineTo(x0+w/2,wt-28);g.stroke();
    // les fenêtres : encadrement de pierre, petits carreaux, volets à planches
    const win=(wx,wy,open)=>{g.fillStyle='#ddd2b8';g.fillRect(wx-5,wy-5,46,62);g.fillStyle='#2a3036';g.fillRect(wx,wy,36,52);g.strokeStyle='#e8e0cc';g.lineWidth=2;g.strokeRect(wx,wy,36,52);g.beginPath();g.moveTo(wx+18,wy);g.lineTo(wx+18,wy+52);for(const yy of[17,34])g.moveTo(wx,wy+yy),g.lineTo(wx+36,wy+yy);g.stroke();
      g.fillStyle='rgba(180,200,210,.25)';g.fillRect(wx+2,wy+2,14,14);
      for(const sd of[-1,1]){const sx=sd<0?wx-22:wx+38;g.fillStyle='#4e6a52';g.fillRect(sx,wy-2,20,56);g.strokeStyle='rgba(20,30,20,.4)';g.lineWidth=1;for(let k=1;k<4;k++){g.beginPath();g.moveTo(sx+k*5,wy-2);g.lineTo(sx+k*5,wy+54);g.stroke()}g.fillStyle='#3a5040';g.fillRect(sx,wy+6,20,4);g.fillRect(sx,wy+42,20,4)}
      g.fillStyle='#ddd2b8';g.fillRect(wx-8,wy+56,52,6)};
    win(x0+36,wt+36);win(x1-72,wt+36);win(x1-72,mid+24);
    // la porte, ses marches, la lanterne
    const dx=x0+44;g.fillStyle='#ddd2b8';g.fillRect(dx-6,base-128,62,128);g.fillStyle='#5a3a24';g.fillRect(dx,base-122,50,108);g.strokeStyle='#3a2414';g.lineWidth=2;g.strokeRect(dx+5,base-116,40,42);g.strokeRect(dx+5,base-66,40,46);g.fillStyle='#c9a24a';g.beginPath();g.arc(dx+42,base-70,2.5,0,7);g.fill();
    g.fillStyle='#b4a482';g.fillRect(dx-10,base-14,70,8);g.fillRect(dx-16,base-6,82,6);
    g.strokeStyle='#2a2a2a';g.lineWidth=2;g.beginPath();g.moveTo(dx+60,base-118);g.lineTo(dx+74,base-118);g.stroke();g.fillStyle='#2a2a2a';g.fillRect(dx+68,base-118,10,4);g.fillStyle='rgba(255,210,130,.55)';rr(g,dx+66,base-114,14,18,3);g.fill();g.strokeStyle='#2a2a2a';g.lineWidth=1;rr(g,dx+66,base-114,14,18,3);g.stroke();
    // l'enseigne peinte et la cloche d'appel du bac
    g.fillStyle='#e8dcc0';rr(g,x0+w/2-62,mid-38,124,26,3);g.fill();g.strokeStyle='#5a3a24';g.lineWidth=1.5;rr(g,x0+w/2-58,mid-35,116,20,2);g.stroke();
    g.fillStyle='#5a2a1e';g.font='bold 11px '+F_DISP;g.textAlign='center';g.fillText('BAC · PASSEUR',x0+w/2,mid-20);
    g.strokeStyle='#3a2a1e';g.lineWidth=3;g.beginPath();g.moveTo(x1,mid+6);g.lineTo(x1+30,mid+6);g.stroke();g.fillStyle='#a8823a';g.beginPath();g.moveTo(x1+22,mid+8);g.quadraticCurveTo(x1+12,mid+12,x1+12,mid+26);g.lineTo(x1+32,mid+26);g.quadraticCurveTo(x1+32,mid+12,x1+22,mid+8);g.fill();g.strokeStyle='#6a5030';g.lineWidth=1;g.beginPath();g.moveTo(x1+22,mid+26);g.lineTo(x1+22,mid+60);g.stroke();
    // le repère de la crue de 1910
    g.fillStyle='#e8e2d2';rr(g,x1-60,base-96,40,18,2);g.fill();g.fillStyle='#2a3a5a';g.font='bold 6px '+F_DISP;g.fillText('CRUE',x1-40,base-89);g.fillText('1910',x1-40,base-81);g.fillStyle='#2a3a5a';g.fillRect(x1-62,base-78,44,2);
    // avirons contre le mur, filets qui sèchent, vigne vierge
    g.strokeStyle='#8a6a42';g.lineWidth=4;g.lineCap='round';g.beginPath();g.moveTo(x1-6,base-4);g.lineTo(x1+14,base-150);g.moveTo(x1+4,base-4);g.lineTo(x1+26,base-140);g.stroke();g.fillStyle='#8a6a42';g.save();g.translate(x1+14,base-150);g.rotate(.14);g.fillRect(-5,-34,10,34);g.restore();g.save();g.translate(x1+26,base-140);g.rotate(.15);g.fillRect(-5,-34,10,34);g.restore();
    g.strokeStyle='rgba(90,80,60,.6)';g.lineWidth=1;for(let k=0;k<7;k++){g.beginPath();g.moveTo(x0-30+k*5,base-150);g.quadraticCurveTo(x0-28+k*5,base-90,x0-34+k*6,base-50);g.stroke()}for(let y=base-140;y<base-56;y+=10){g.beginPath();g.moveTo(x0-32,y);g.lineTo(x0-2,y+4);g.stroke()}
    g.strokeStyle='#4a3424';g.lineWidth=3;g.beginPath();g.moveTo(x0-36,base);g.lineTo(x0-36,base-156);g.lineTo(x0,base-156);g.stroke();
    for(let k=0;k<22;k++){const vx=x0+((k*31)%(w*.4)),vy=base-60-((k*47)%200);g.fillStyle=k%3?'#5a7a3a':'#7a5a2a';g.beginPath();g.ellipse(vx,vy,6,4,k,0,7);g.fill()}
    g.strokeStyle='#4a5a2a';g.lineWidth=1.5;g.beginPath();g.moveTo(x0+6,base-56);g.quadraticCurveTo(x0+30,base-160,x0+10,base-260);g.stroke();
  }else if(b.kind==='ferme'){ // la ferme de bord de Marne, mise en défense : fenêtres condamnées, créneaux, sacs à terre
    const wt=top+70;g.fillStyle='#a8977a';g.fillRect(x0,wt,w,base-wt);
    g.fillStyle='rgba(80,64,44,.25)';for(let y=wt+6;y<base;y+=16)for(let x=x0+((y/16|0)%2)*14;x<x1-20;x+=28){rr(g,x+1,y,24,13,4);g.fill()}
    g.fillStyle='#6a3a2a';poly(g,[x0-16,wt+4,x0+w*.5,wt-70,x1+16,wt+4]);g.fill();g.strokeStyle='rgba(40,20,10,.35)';g.lineWidth=1;for(let k=1;k<9;k++){const y=wt+4-k*8;g.beginPath();g.moveTo(x0-16+k*11,y);g.lineTo(x1+16-k*11,y);g.stroke()}
    g.fillStyle='#8a7a62';g.fillRect(x0+w*.68,wt-80,18,46);g.fillStyle='rgba(200,190,170,.25)';g.beginPath();g.arc(x0+w*.68+9,wt-96,10,0,7);g.fill();
    for(const[wx,wy]of[[x0+26,wt+40],[x1-66,wt+40],[x0+26,wt+150],[x1-66,wt+150]]){g.fillStyle='#2a2018';g.fillRect(wx,wy,40,54);g.fillStyle='#7a5a36';for(let k=0;k<3;k++){g.save();g.translate(wx+20,wy+10+k*17);g.rotate((k%2?-1:1)*.12);g.fillRect(-24,-4,48,8);g.restore()}
      g.fillStyle='#120c08';g.fillRect(wx+16,wy+22,8,4)}
    g.fillStyle='#4a3424';g.fillRect(x0+w/2-26,base-96,52,96);g.fillStyle='#3a2818';for(let k=0;k<4;k++)g.fillRect(x0+w/2-26+k*13,base-96,2,96);
    for(let k=0;k<11;k++){const row=Math.floor(k/4),cx=x0-10+(k%4)*(w+20)/4+(row%2)*20;g.fillStyle=k%2?'#8a7a5a':'#7a6a4a';rr(g,cx,base-24-row*20,(w+20)/4+2,22,8);g.fill();g.fillStyle='rgba(0,0,0,.18)';g.fillRect(cx+4,base-10-row*20,(w+20)/4-6,2)}
    g.fillStyle='#e8dcc0';g.font='italic 10px '+F_BODY;g.textAlign='center';g.fillText('Ferme du Bac',x0+w/2,wt+24);
  }
  g.restore()}
/* 1914 */
function fCamp14(g,t){const b=FGR*T;
  g.fillStyle='#d8ccb0';poly(g,[29*T,b,30.5*T,b-80,32*T,b]);g.fill();g.fillStyle='rgba(0,0,0,.15)';poly(g,[30.5*T,b-80,32*T,b,30.8*T,b]);g.fill();
  g.strokeStyle='#5a4a3a';g.lineWidth=2;for(let k=0;k<5;k++){g.beginPath();g.moveTo(41*T+k*7,b);g.lineTo(42*T+k*3,b-44);g.stroke()}
  const fs=[{x:35*T,f:1,pose:'sit',sk:0},{x:38*T,f:-1,pose:'stand',sk:2},{x:43.5*T,f:-1,pose:'sit',sk:4}];
  for(const m of fs)if(m.pose==='sit'){g.fillStyle='#5a4a30';rr(g,m.x-30,b-40,46,40,3);g.fill();g.fillStyle='rgba(0,0,0,.2)';g.fillRect(m.x-30,b-28,46,2);g.fillStyle='#e8dcc0';g.font='7px '+F_DISP;g.textAlign='center';g.fillText('8 mm Lebel',m.x-7,b-14)}
  for(const m of fs){const p=m.pose==='sit'?Object.assign({},VX_P.sit,{lean:.1}):VX_P.stand;
    fSpr(g,'camp'+m.sk,200,230,100,215,m.x,b,g2=>vxSoldier(g2,{hip:m.pose==='sit'?{x:0,y:-44}:null,x:0,y:0,s:9.5,f:m.f,side:'fr14',capote:true,t:0,pose:p,noPouch:false,kit:{musette:1},
      face:{skin:VX_SKIN[m.sk],hair:VX_HAIR[m.sk],stache:m.sk===2?'walrus':'1914',helmet:'kepi',ex:'neutral',look:[m.f*.6,0]}}))}
  g.fillStyle='#2a2a2a';g.beginPath();g.ellipse(36.5*T,b-6,14,6,0,0,7);g.fill();g.fillStyle='rgba(200,190,170,.25)';for(let k=0;k<5;k++){g.beginPath();g.arc(36.5*T+Math.sin(t+k)*6,b-20-k*16-((t*20)%16),5+k*2,0,7);g.fill()}
}
function fPilings(g,a,b){const y=FGR*T;g.fillStyle='#4a3a2a';for(let c=a;c<=b;c+=2){g.fillRect(c*T+8,y+4,7,80)}g.strokeStyle='#3a2a1e';g.lineWidth=2;g.beginPath();g.moveTo(a*T,y+30);g.lineTo((b+1)*T,y+30);g.stroke();
  g.fillStyle='#3a2e22';const e=b===110?(b+1)*T:a*T;g.fillRect(e-4,y-10,8,70);for(let k=0;k<3;k++){g.save();g.translate(e+(b===110?10:-10),y+6+k*6);g.rotate(b===110?.6:-.6);g.fillRect(0,0,30,5);g.restore()}}
function fPontoons(g,a,b){const y=FGR*T;for(let c=a;c<=b;c+=3){g.fillStyle='#3a3026';g.beginPath();g.moveTo(c*T-6,y+8);g.lineTo(c*T+3*T-14,y+8);g.lineTo(c*T+3*T-22,y+30);g.lineTo(c*T+2,y+30);g.closePath();g.fill();
  g.fillStyle='rgba(0,0,0,.25)';g.fillRect(c*T,y+18,3*T-26,3);g.strokeStyle='#2a221a';g.lineWidth=1.5;g.beginPath();g.moveTo(c*T+T,y+30);g.lineTo(c*T+T-10,y+70);g.stroke()}
  g.fillStyle='#5a4a36';g.fillRect(a*T,y-14,4,14);g.fillRect((b+1)*T-4,y-14,4,14);g.strokeStyle='#8a7a5a';g.lineWidth=1.4;g.beginPath();g.moveTo(a*T,y-12);g.lineTo((b+1)*T,y-12);g.stroke()}
function fertePonton(g,m){const x=m.x,y=m.y;g.save();g.fillStyle='#3a3026';g.beginPath();g.moveTo(x-6,y+8);g.lineTo(x+m.w+6,y+8);g.lineTo(x+m.w-4,y+30);g.lineTo(x+4,y+30);g.closePath();g.fill();
  g.fillStyle='#8a6a44';g.fillRect(x-4,y,m.w+8,9);g.fillStyle='#6a4e30';for(let k=0;k<m.w;k+=12)g.fillRect(x+k,y,2,9);
  // les deux sapeurs qui le poussent à la gaffe, depuis la barque
  const dir=m.dx>=0?1:-1,bx=x+(dir>0?-46:m.w+46);g.fillStyle='#2e261e';g.beginPath();g.ellipse(bx,y+20,30,8,0,0,Math.PI);g.fill();
  fSpr(g,'pousse'+dir,200,230,100,215,bx,y+16,g2=>vxSoldier(g2,{x:0,y:0,s:7.5,f:dir,side:'uk',t:0,pose:Object.assign({},VX_P.stand,{lean:.3,nT:{x:4.2,y:1.4},fT:{x:3.4,y:1.8}}),noPouch:true,
    face:{skin:VX_SKIN[2],hair:VX_HAIR[3],stache:'thin',helmet:'tommy',ex:'worry'}}));
  g.strokeStyle='#6a4a2a';g.lineWidth=2.4;g.beginPath();g.moveTo(bx+dir*10,y-20);g.lineTo(bx+dir*60,y+40);g.stroke();
  g.restore()}
function fSappers(g,t){const y=FGR*T;
  const list=[{c:163,f:1,act:'hammer',sk:1},{c:169,f:-1,act:'rope',sk:5},{c:197,f:1,act:'hammer',sk:3},{c:203,f:-1,act:'look',sk:6}];
  for(const s of list){const x=s.c*T,fr=Math.floor(((t*(s.act==='hammer'?6:2)+s.c)/(Math.PI*2))*8)%8,ph=Math.sin((fr+.5)/8*Math.PI*2);
    const pose=s.act==='hammer'?Object.assign({},VX_P.kneel,{nT:{x:3.4,y:.4-Math.max(0,ph)*3.2},fT:{x:2.6,y:1.2}}):s.act==='rope'?Object.assign({},VX_P.stand,{lean:-.12,nT:{x:3.2,y:-.8+ph*.4},fT:{x:3.6,y:-.4+ph*.4}}):VX_P.binoc||VX_P.stand;
    fSpr(g,'sap'+s.c+'-'+(s.act==='look'?0:fr),200,230,100,215,x,y,g2=>vxSoldier(g2,{x:0,y:0,s:8.2,f:s.f,side:'uk',t:0,pose,noPouch:true,face:{skin:VX_SKIN[s.sk],hair:VX_HAIR[s.sk],stache:s.sk%2?'thin':null,helmet:'tommy',ex:s.act==='look'?'worry':'neutral'}}));}
  // au loin, sur la rive nord, les éclairs des fusils allemands
  for(let k=0;k<5;k++){const ph=(t*1.3+k*.77)%3;if(ph<.08){const fx=(170+k*11)*T+((k*53)%40);g.fillStyle='rgba(255,230,150,.9)';g.beginPath();g.arc(fx,7*T+((k*37)%60),3,0,7);g.fill()}}
}
function fGerbe(g,s,t){const y=FGR*T+10;
  if(s.st==='warn'){const u=s.k/1.1;g.strokeStyle='rgba(255,240,210,'+(.25+.5*u)+')';g.lineWidth=2;g.beginPath();g.ellipse(s.x,y,10+u*26,3+u*6,0,0,7);g.stroke();
    g.strokeStyle='rgba(255,240,210,'+(.15+.3*u)+')';g.setLineDash([4,6]);g.beginPath();g.moveTo(s.x,y-10);g.lineTo(s.x,y-160);g.stroke();g.setLineDash([])}
  else if(s.st==='boom'){const k=(s.k-1.1)/.6,h=150*Math.sin(Math.min(1,k*1.6)*Math.PI/2),a=1-Math.max(0,k-.6)/.4;
    g.fillStyle='rgba(225,232,226,'+(.85*a)+')';g.beginPath();g.moveTo(s.x-28,y);g.quadraticCurveTo(s.x-22,y-h*.6,s.x-8,y-h);g.quadraticCurveTo(s.x,y-h-14,s.x+8,y-h);g.quadraticCurveTo(s.x+22,y-h*.6,s.x+28,y);g.closePath();g.fill();
    g.fillStyle='rgba(120,110,90,'+(.45*a)+')';g.beginPath();g.ellipse(s.x,y-h*.4,10,h*.3,0,0,7);g.fill();
    g.fillStyle='rgba(236,240,232,'+(.8*a)+')';g.beginPath();g.ellipse(s.x,y+2,30+k*34,6+k*4,0,0,7);g.fill();
    g.fillStyle='rgba(90,100,90,'+(.5*a)+')';g.beginPath();g.ellipse(s.x,y+4,18+k*20,3+k*2,0,0,7);g.fill();
    for(let i=0;i<10;i++){const u=(i*37%10)/10,dx=(u-.5)*80*(.4+k),dy=-h*(.3+.6*((i*53%10)/10))*Math.sin(Math.min(1,k*1.3)*Math.PI);g.fillStyle='rgba(225,232,226,'+(.7*a)+')';g.beginPath();g.arc(s.x+dx,y+Math.min(0,dy+k*k*120),2.2,0,7);g.fill()}}}
/* en surimpression : la brume de 1914, l'éclair du passage */
function ferteOverlay(t){
  const F=L.ferte;if(!F)return;
  if(F.era===14){const fc=ferteFogTex();ctx.save();const ox=((t*14+cam.x*.15)%fc.fog.width+fc.fog.width)%fc.fog.width;
    ctx.drawImage(fc.fog,-ox,0,fc.fog.width,H);ctx.drawImage(fc.fog,fc.fog.width-ox,0,fc.fog.width,H);ctx.drawImage(fc.vig,0,0,W,H);
    ctx.globalAlpha=.6;ctx.fillStyle='#efe5cc';ctx.font='italic 15px '+F_BODY;ctx.textAlign='left';ctx.fillText('La Marne · septembre 1914',20,H-20);ctx.restore();
  }
  if(F.flash>0){const a=Math.min(1,F.flash);ctx.save();ctx.fillStyle='rgba(236,232,222,'+(a*.85)+')';ctx.fillRect(0,0,W,H);
    const px=P.x+P.w/2-cam.x,py=P.y+P.h/2-cam.y;for(let k=0;k<3;k++){const ang=k/8*6.28+t,r=60+(1-a)*400;const gr=ctx.createRadialGradient(px+Math.cos(ang)*r,py+Math.sin(ang)*r*.6,10,px+Math.cos(ang)*r,py+Math.sin(ang)*r*.6,180);gr.addColorStop(0,'rgba(250,248,240,'+(a*.5)+')');gr.addColorStop(1,'rgba(250,248,240,0)');ctx.fillStyle=gr;ctx.fillRect(0,0,W,H)}
    ctx.restore()}
}

/* ---------- le décor des berges : arbres, bancs, roseaux, campements ---------- */
const FD={26:[
  ['grand',1.5],['peuplier',6.5],['saule',11],['banc',15.5],['platane',18],['grand',21],['pecheur',27],['grand',31],['lampe',31.6],['canoes',41],['grand',45],['peuplier',49.5],['lampe',52],['roseaux',56],['roseaux',60.4],
  ['platane',64],['saule',70],['peuplier',74],['roseaux',83],['roseaux',91.2],['grand',95],['pecheur',99.4],['roseaux',100.6],['roseaux',141],['lampe',141.8],['grand',144],['platane',154],['roseaux',155.4],
  ['grand',244],['banc',246.5],['saule',251],['platane',255],['roseaux',263.4],['roseaux',267.2],['saule',271],['peuplier',275],['grand',284],['tente',286],['velo',297],
  ['grand',302],['lampe',306],['terrasse',309.3],['terrasse',319.7],['saule',326],['grand',331]],
 14:[
  ['saule',1],['marronnier',6],['grand',10.5],['meule',13.5],['peuplier',16.5],['fourgon',19],['grand',26.5],['platane',33.5],['grand',37.5],['faisceau',40],['peuplier',43.5],['saule',53],['roseaux',54.6],['roseaux',100.4],['roseaux',141],['grand',145],['platane',150],['caisses',153],['grand',157],
  ['roseaux',230.4],['grand',233],['peuplier',238],['grand',241],['brise',244],['platane',249],['meule',263],['saule',266],['platane',270],['faisceau',276],['grand',283],['platane',290],['bivouac',296],['peuplier',304],['grand',309],['grand',314],['brise',319],['platane',323],['saule',328],['grand',332]]};
function fDecor(g,t,era,vis){const b=FGR*T;
  fForest(g,era,vis,b);
  if(era===14&&vis(266*T-60,307*T+60))fPoleLine(g,[266,279,292,307].map(c=>c*T),b);
  for(const[k,c]of FD[era]){const x=c*T;if(!vis(x-160,x+160))continue;
    if(k==='platane')fPlane(g,x,b,era===14);else if(k==='grand'){g.save();g.translate(x,b);g.scale(1.5,1.5);fPlane(g,0,0,era===14);g.restore()}else if(k==='marronnier')fChestnut(g,b,t);else if(k==='saule')fWillow(g,x,b,t);else if(k==='peuplier'){for(let i=0;i<3;i++)fPoplarN(g,x+i*34-34,b,240+((c*7+i*13)%60))}
    else if(k==='brise')fPlane(g,x,b,true,true);
    else if(k==='roseaux')fReeds(g,x,b,t);else if(k==='banc')fBench(g,x,b);else if(k==='lampe')fLamp(g,x,b);
    else if(k==='pecheur')fFisher(g,x,b,t,c===27&&L.ferte?L.ferte.seau:null);else if(k==='canoes')fCanoes(g,x,b);else if(k==='tente')fTent(g,x,b,t,L.ferte&&L.ferte.tent);else if(k==='terrasse')fTerrace(g,x,b,t);else if(k==='velo')fBike(g,x,b);
    else if(k==='meule')fHay(g,x,b);else if(k==='fourgon')fWagon(g,x,b,t);else if(k==='faisceau')fRifles(g,x,b);else if(k==='caisses')fCrates(g,x,b);
    else if(k==='poteau')fPole(g,x,b);else if(k==='bivouac')fBivouac(g,x,b,t);}
}
function fPlane(g,x,b,old,broken){g.save();g.fillStyle='#6a6450';g.beginPath();g.moveTo(x-14,b+4);g.quadraticCurveTo(x-9,b-80,x-8,b-170);g.lineTo(x+8,b-170);g.quadraticCurveTo(x+9,b-80,x+15,b+4);g.closePath();g.fill();
  g.fillStyle='rgba(220,210,180,.35)';for(let k=0;k<7;k++){g.beginPath();g.ellipse(x-4+(k%3)*4,b-20-k*22,4,6,0,0,7);g.fill()}
  g.strokeStyle='#5a5444';g.lineWidth=5;g.lineCap='round';g.beginPath();g.moveTo(x,b-150);g.lineTo(x-46,b-200);g.moveTo(x,b-160);g.lineTo(x+40,b-214);g.stroke();
  if(broken){g.lineWidth=3;g.beginPath();g.moveTo(x-46,b-200);g.lineTo(x-60,b-196);g.moveTo(x+40,b-214);g.lineTo(x+52,b-226);g.stroke();g.fillStyle='#4a5a34';g.beginPath();g.arc(x+30,b-214,20,0,7);g.arc(x-34,b-206,16,0,7);g.fill();g.restore();return}
  const cs=old?['#56663a','#62723f','#4a5a34']:['#3e6a34','#4c7a3a','#36602e'];
  for(const[dx,dy,r,i]of[[-50,-210,46,0],[44,-224,50,1],[0,-250,58,2],[-14,-196,40,1],[30,-190,36,0],[-70,-232,32,2],[70,-236,30,2]]){g.fillStyle=cs[i];g.beginPath();g.arc(x+dx,b+dy,r,0,7);g.fill()}
  g.fillStyle='rgba(255,245,200,.12)';g.beginPath();g.arc(x+12,b-268,34,0,7);g.fill();g.restore()}
function fWillow(g,x,b,t){// saule pleureur : tronc noueux qui se divise, branches en arc, rideaux de rameaux feuillus
  const R=mulberry(4242);g.save();g.translate(x,b);g.lineCap='round';
  const limbs=[[-88,-196,-40,-170],[-30,-226,-14,-180],[34,-222,18,-178],[92,-190,46,-162]];   // [bout x, bout y, contrôle x, contrôle y] depuis la fourche
  const FX=4,FY=-112;
  const strands=[];for(let i=0;i<78;i++){const L0=limbs[i%4],u=.35+R()*.65,ex=FX+(L0[0]-FX)*u,ey=FY+(L0[1]-FY)*u-Math.sin(u*Math.PI)*16;const out=Math.sign(ex-FX)||1;
    strands.push({x0:ex+(R()-.5)*20,y0:ey+(R()-.5)*14,dx:out*(10+R()*26),y1:-18-R()*70,w:2+R()*1.6,col:R(),back:i%3===0,ph:R()*6})}
  const strand=(s,dark)=>{const sw=Math.sin((t||0)*1.1+s.ph)*3,ex=s.x0+s.dx+sw*2;
    g.strokeStyle=mix(dark?'#4e6a34':'#7a9c4a',dark?'#3a5428':'#9ab65a',s.col);g.lineWidth=s.w;g.beginPath();g.moveTo(s.x0,s.y0);g.quadraticCurveTo(s.x0+s.dx*.9,s.y0+10,ex,s.y1);g.stroke();
    g.lineWidth=s.w+2.4;g.setLineDash([3,4]);g.strokeStyle=mix(dark?'#45602e':'#86a852',dark?'#344c24':'#a8c46a',1-s.col);g.beginPath();g.moveTo(s.x0,s.y0+6);g.quadraticCurveTo(s.x0+s.dx*.9,s.y0+16,ex,s.y1);g.stroke();g.setLineDash([])};
  // rideau du fond (plus sombre)
  for(const s of strands)if(s.back)strand(s,1);
  // le tronc, l'écorce, la fourche
  g.fillStyle='#5a4a36';g.beginPath();g.moveTo(-20,4);g.quadraticCurveTo(-10,-50,-14,-100);g.quadraticCurveTo(-4,-118,FX,FY);g.quadraticCurveTo(14,-118,20,-100);g.quadraticCurveTo(12,-50,22,4);g.closePath();g.fill();
  g.fillStyle='#4a3c2c';g.beginPath();g.ellipse(0,2,28,6,0,0,7);g.fill();
  g.strokeStyle='rgba(30,22,14,.45)';g.lineWidth=1.4;for(let k=0;k<7;k++){const xx=-12+k*4;g.beginPath();g.moveTo(xx,0);g.quadraticCurveTo(xx+(R()-.5)*6,-50,xx*.5+2,-104);g.stroke()}
  g.strokeStyle='rgba(255,240,210,.12)';g.lineWidth=3;g.beginPath();g.moveTo(-14,-4);g.quadraticCurveTo(-8,-50,-10,-98);g.stroke();
  for(const L0 of limbs){g.strokeStyle='#5a4a36';g.lineWidth=9;g.beginPath();g.moveTo(FX,FY+6);g.quadraticCurveTo(L0[2],L0[3],L0[0],L0[1]);g.stroke();g.strokeStyle='#4a3c2c';g.lineWidth=4;g.beginPath();g.moveTo(L0[2]*.7,L0[3]*.95);g.quadraticCurveTo(L0[0]*.9,L0[1]-4,L0[0]*1.1,L0[1]+8);g.stroke()}
  // le houppier : des touffes de feuilles le long des branches, sans contour net
  for(let k=0;k<46;k++){const L0=limbs[k%4],u=.4+R()*.7,cx=FX+(L0[0]-FX)*u+(R()-.5)*30,cy=FY+(L0[1]-FY)*u-Math.sin(Math.min(1,u)*Math.PI)*16+(R()-.5)*22;
    g.fillStyle=mix('#5e7e3a','#8aac54',R());g.beginPath();g.ellipse(cx,cy,10+R()*12,6+R()*6,(R()-.5)*.8,0,7);g.fill()}
  // rideau de devant
  for(const s of strands)if(!s.back)strand(s,0);
  g.fillStyle='rgba(255,250,210,.1)';g.beginPath();g.ellipse(-20,-200,50,18,-.2,0,7);g.fill();
  g.restore()}
function fPoplarN(g,x,b,h){g.save();g.fillStyle='#5a4a36';g.fillRect(x-3,b-h*.3,6,h*.3);g.fillStyle='#3e6234';g.beginPath();g.ellipse(x,b-h*.6,h*.12,h*.42,0,0,7);g.fill();g.fillStyle='rgba(120,160,80,.25)';g.beginPath();g.ellipse(x+5,b-h*.65,h*.05,h*.3,0,0,7);g.fill();g.restore()}
function fReeds(g,x,b,t){g.save();g.lineCap='round';for(let k=0;k<9;k++){const xx=x-16+k*4,h=34+((k*37)%30),sw=Math.sin(t*1.6+k)*3;g.strokeStyle=k%3?'#6a7a3a':'#7a8a44';g.lineWidth=2;g.beginPath();g.moveTo(xx,b+6);g.quadraticCurveTo(xx+sw,b-h/2,xx+sw*2,b-h);g.stroke();
  if(k%3===0){g.fillStyle='#5a3a22';g.beginPath();g.ellipse(xx+sw*2,b-h-4,2.4,7,0,0,7);g.fill()}}g.restore()}
function fBench(g,x,b){g.save();g.fillStyle='#2e4a3a';g.fillRect(x-30,b-22,60,5);g.fillRect(x-30,b-40,60,4);g.fillRect(x-30,b-32,60,4);g.fillStyle='#222';g.fillRect(x-26,b-22,4,22);g.fillRect(x+22,b-22,4,22);g.fillRect(x-26,b-42,3,20);g.fillRect(x+23,b-42,3,20);g.restore()}
function fLamp(g,x,b){g.save();g.fillStyle='#2a3030';g.fillRect(x-2,b-150,4,150);g.fillRect(x-6,b-6,12,6);g.beginPath();g.moveTo(x,b-150);g.quadraticCurveTo(x,b-162,x+16,b-160);g.lineTo(x+16,b-156);g.quadraticCurveTo(x+4,b-158,x+2,b-150);g.fill();
  g.fillStyle='#e8e0c0';poly(g,[x+10,b-158,x+22,b-158,x+20,b-150,x+12,b-150]);g.fill();g.restore()}
function fFisher(g,x,b,t,a){g.save();// pêcheur assis sur son pliant, au bord de l'eau
  g.strokeStyle='#3a3a3a';g.lineWidth=2;g.beginPath();g.moveTo(x-12,b);g.lineTo(x+8,b-22);g.moveTo(x+8,b);g.lineTo(x-12,b-22);g.stroke();
  g.fillStyle='#4a5a3a';rr(g,x-12,b-62,22,40,8);g.fill();g.fillStyle='#2a3a5a';g.fillRect(x-4,b-26,24,8);g.fillRect(x+16,b-26,6,26);
  g.fillStyle='#e0b896';g.beginPath();g.arc(x+2,b-70,8,0,7);g.fill();g.fillStyle='#6a7a4a';g.beginPath();g.ellipse(x+2,b-76,12,4,0,0,7);g.fill();g.fillRect(x-5,b-84,14,8);
  g.strokeStyle='#2a2a2a';g.lineWidth=1.6;g.beginPath();g.moveTo(x+12,b-40);g.lineTo(x+70,b-110);g.stroke();g.strokeStyle='rgba(230,230,230,.6)';g.lineWidth=.7;const by=b+18+Math.sin(t*2)*2;g.beginPath();g.moveTo(x+70,b-110);g.lineTo(x+86,by);g.stroke();
  g.fillStyle='#e8402a';g.beginPath();g.arc(x+86,by,2.4,0,7);g.fill();g.fillStyle='#5a7a8a';g.beginPath();g.moveTo(x-37,b-17);g.lineTo(x-15,b-17);g.lineTo(x-17,b);g.lineTo(x-35,b);g.closePath();g.fill();g.fillStyle=a&&a.used?'#6a8a96':'#3a5a6a';g.beginPath();g.ellipse(x-26,b-17,11,3,0,0,7);g.fill();
  g.strokeStyle='#4a5a64';g.lineWidth=1.2;g.beginPath();g.arc(x-26,b-17,10,Math.PI,0);g.stroke();
  if(a&&a.open>0){const u=Math.min(1,a.t/.6);for(let k=0;k<2;k++){const fx=x-26+(k?1:-1)*u*18,fy=b-17-Math.sin(u*Math.PI)*26;g.fillStyle='#9aa8a0';g.beginPath();g.ellipse(fx,fy,6,2.4,(k?1:-1)*(u-.5)*2,0,7);g.fill()}}
  g.restore()}
function fCanoes(g,x,b){g.save();g.fillStyle='#4a3a2a';g.fillRect(x-40,b-70,4,70);g.fillRect(x+40,b-70,4,70);g.fillRect(x-42,b-40,88,4);g.fillRect(x-42,b-70,88,4);
  for(const[y,c]of[[b-46,'#d8402a'],[b-76,'#e8c040']]){g.fillStyle=c;g.beginPath();g.ellipse(x+2,y,62,7,0,0,7);g.fill();g.fillStyle='rgba(0,0,0,.2)';g.fillRect(x-40,y,84,2)}g.restore()}
function fTent(g,x,b,t,a){g.save();// deux campeurs sous la tente ; un coup de bec : les têtes rentrent et la tente se ferme
  const zt=a&&a.used?(a.zipAt==null||a.zipAt<0?99:(L.ferte.t-a.zipAt)):-1,hin=zt<0?0:Math.min(1,zt/.45),zip=zt<0?0:clamp((zt-.4)/1.1,0,1);
  g.fillStyle='#3a7a6a';poly(g,[x-70,b,x,b-70,x+70,b]);g.fill();g.fillStyle='#2e6a5a';poly(g,[x,b-70,x+70,b,x+24,b]);g.fill();
  g.strokeStyle='#5a5a5a';g.lineWidth=1;g.beginPath();g.moveTo(x-70,b);g.lineTo(x-90,b-6);g.moveTo(x+70,b);g.lineTo(x+92,b-6);g.moveTo(x,b-70);g.lineTo(x-4,b-78);g.stroke();
  g.fillStyle='#1e2a26';poly(g,[x-26,b,x,b-56,x+24,b]);g.fill();
  if(hin<1){g.save();g.beginPath();poly(g,[x-26,b,x,b-56,x+24,b]);g.clip();const dy=hin*26,sc=1-hin*.35;
    for(const[hx,hy,hair]of[[x-8,b-20,'#6a3a2a'],[x+9,b-18,'#d8b060']]){g.save();g.translate(hx,hy+dy);g.scale(sc,sc);g.fillStyle='#e8c09a';g.beginPath();g.arc(0,0,7,0,7);g.fill();g.fillStyle=hair;g.beginPath();g.arc(0,-5,7,Math.PI,0);g.fill();g.fillStyle='#111';g.fillRect(-3,-1,2,2);g.fillRect(2,-1,2,2);g.restore()}
    if(hin<.3){g.fillStyle='rgba(255,250,200,.7)';g.beginPath();g.arc(x-8,b-27+dy,2,0,7);g.fill()}
    g.restore()}
  if(!hin){g.fillStyle='rgba(255,250,200,.12)';poly(g,[x-8,b-27,x+60,b-40,x+60,b-10]);g.fill()}
  if(zip>0){// la porte remonte et se referme : les deux pans gagnent l'ouverture, la tirette au milieu
    const yz=b-56*zip,wz=(1-zip);g.fillStyle='#347466';poly(g,[x-26,b,x-26+26*zip*1.0,yz,x+24-24*zip*1.0,yz,x+24,b]);g.fill();
    g.strokeStyle='#1e3a32';g.lineWidth=1.2;g.setLineDash([2,2]);g.beginPath();g.moveTo(x-1,b);g.lineTo(x-1,yz);g.stroke();g.setLineDash([]);
    g.fillStyle='#c8c8c0';g.fillRect(x-3,yz-1,4,5);
    if(zip>=1&&((t*.6)%3)<1.6){g.fillStyle='rgba(30,40,36,.8)';g.font='italic 11px '+F_BODY;g.textAlign='left';g.fillText('Zzz…',x+18,b-60-((t*12)%10))}}
  g.fillStyle='#8a5a2a';g.beginPath();g.ellipse(x+40,b-14,10,8,0,0,7);g.fill();g.fillRect(x+44,b-40,4,26);
  g.fillStyle='#d8d0b8';rr(g,x-120,b-24,26,24,3);g.fill();g.fillStyle='#3a6aa0';g.fillRect(x-120,b-24,26,6);
  g.fillStyle='#5a7aa0';rr(g,x-50,b-4,100,5,2);g.fill();
  g.restore()}

function fBike(g,x,b){g.save();g.strokeStyle='#2a2a2a';g.lineWidth=2;g.beginPath();g.arc(x-18,b-13,13,0,7);g.arc(x+18,b-13,13,0,7);g.stroke();g.strokeStyle='#b8302a';g.lineWidth=3;g.beginPath();g.moveTo(x-18,b-13);g.lineTo(x-2,b-34);g.lineTo(x+14,b-34);g.lineTo(x+18,b-13);g.moveTo(x-2,b-34);g.lineTo(x+2,b-13);g.lineTo(x-18,b-13);g.stroke();g.fillStyle='#222';g.fillRect(x-6,b-38,10,3);g.restore()}
function fHay(g,x,b){g.save();g.fillStyle='#b89a50';g.beginPath();g.moveTo(x-46,b);g.quadraticCurveTo(x-48,b-60,x,b-84);g.quadraticCurveTo(x+48,b-60,x+46,b);g.closePath();g.fill();g.strokeStyle='rgba(120,90,40,.4)';g.lineWidth=1;for(let k=0;k<6;k++){g.beginPath();g.moveTo(x-44+k*6,b-10-k*10);g.quadraticCurveTo(x,b-20-k*12,x+44-k*6,b-10-k*10);g.stroke()}g.fillStyle='#8a7a3a';g.beginPath();g.ellipse(x,b-84,10,6,0,0,7);g.fill();g.restore()}
function fWagon(g,x,b,t){g.save();// fourgon du train régimentaire, attelé, au repos
  fSpr(g,'cheval',520,380,260,350,x+120,b,g2=>vxHorse(g2,0,0,1.05,1,0,{col:'#6a4428',rate:.3,traceTo:-70}));
  g.fillStyle='#5a4a30';g.fillRect(x-80,b-90,150,56);g.fillStyle='#d8ccae';g.beginPath();g.moveTo(x-84,b-90);g.quadraticCurveTo(x-5,b-150,x+74,b-90);g.closePath();g.fill();g.strokeStyle='rgba(90,70,40,.4)';for(let k=0;k<4;k++){g.beginPath();g.moveTo(x-60+k*40,b-90);g.quadraticCurveTo(x-55+k*40,b-130,x-50+k*40,b-136+Math.abs(k-1.5)*6);g.stroke()}
  for(const wx of[x-50,x+40]){g.strokeStyle='#2e2014';g.lineWidth=4;g.beginPath();g.arc(wx,b-26,26,0,7);g.stroke();g.lineWidth=2;for(let a=0;a<6.28;a+=.63){g.beginPath();g.moveTo(wx,b-26);g.lineTo(wx+Math.cos(a)*26,b-26+Math.sin(a)*26);g.stroke()}}
  g.fillStyle='#e8dcc0';g.font='8px '+F_DISP;g.textAlign='center';g.fillText('142e R.I. · T.R.',x-5,b-60);g.restore()}
function fRifles(g,x,b){g.save();g.strokeStyle='#5a3a22';g.lineWidth=3;for(const a of[-.32,0,.32]){g.beginPath();g.moveTo(x+Math.sin(a)*70,b);g.lineTo(x-Math.sin(a)*8,b-74);g.stroke()}g.strokeStyle='#b8bcc0';g.lineWidth=1.2;for(const a of[-.32,0,.32]){g.beginPath();g.moveTo(x-Math.sin(a)*8,b-74);g.lineTo(x-Math.sin(a)*14,b-96);g.stroke()}
  g.fillStyle='#6a5a40';rr(g,x-30,b-18,24,18,4);g.fill();rr(g,x+8,b-16,22,16,4);g.fill();g.restore()}
function fCrates(g,x,b){g.save();for(const[dx,dy]of[[-30,0],[10,0],[-10,-30]]){g.fillStyle='#6a5a36';g.fillRect(x+dx,b-30+dy,40,30);g.fillStyle='rgba(0,0,0,.2)';g.fillRect(x+dx+6,b-30+dy,3,30);g.fillRect(x+dx+31,b-30+dy,3,30);g.fillStyle='#e8dcc0';g.font='6px '+F_DISP;g.textAlign='center';g.fillText('R.E.',x+dx+20,b-12+dy)}g.restore()}
function fPoleLine(g,xs,b){g.save();g.strokeStyle='rgba(30,30,30,.6)';g.lineWidth=1;for(let i=0;i+1<xs.length;i++)for(const dx of[-20,-8,8,20]){g.beginPath();g.moveTo(xs[i]+dx,b-193);g.quadraticCurveTo((xs[i]+xs[i+1])/2+dx,b-160,xs[i+1]+dx,b-193);g.stroke()}g.restore();for(const x of xs)fPole(g,x,b,true)}
function fPole(g,x,b,noWire){g.save();g.fillStyle='#4a3a2a';g.fillRect(x-3,b-200,6,200);g.fillRect(x-24,b-190,48,4);g.fillStyle='#d8d8d0';for(const dx of[-20,-8,8,20]){g.beginPath();g.arc(x+dx,b-193,2.5,0,7);g.fill()}g.restore()}
function fBivouac(g,x,b,t){g.save();// deux fantassins autour du feu (le feu lui-même est un danger, dessiné devant)
  g.strokeStyle='#2a2018';g.lineWidth=3;g.beginPath();g.moveTo(x+90,b);g.lineTo(x+102,b-60);g.lineTo(x+114,b);g.moveTo(x+138,b);g.lineTo(x+126,b-60);g.lineTo(x+114,b);g.moveTo(x+102,b-58);g.lineTo(x+126,b-58);g.stroke();
  for(const m of[{x:x-6,f:1,sk:1},{x:x+190,f:-1,sk:4}]){g.fillStyle='#6a5a40';rr(g,m.x-24,b-36,40,36,4);g.fill();
    fSpr(g,'biv'+m.sk,200,230,100,215,m.x,b,g2=>vxSoldier(g2,{hip:{x:0,y:-40},s:9.2,f:m.f,side:'fr14',capote:true,t:0,pose:Object.assign({},VX_P.sit,{lean:.18,nT:{x:3.4,y:.2},fT:{x:3.0,y:.6}}),kit:{musette:1},
      face:{skin:VX_SKIN[m.sk],hair:VX_HAIR[m.sk],stache:'1914',helmet:'kepi',ex:'neutral',look:[.7,.3]}}))}
  g.restore()}
function fFire(g,f,t){const x=f.x,b=FGR*T,h=f.h;g.save();
  if(f.era===14){g.strokeStyle='#2a2018';g.lineWidth=2;g.beginPath();g.moveTo(x,b-74);g.lineTo(x,b-46);g.stroke();g.fillStyle='#2a2a2a';g.beginPath();g.moveTo(x-14,b-46);g.lineTo(x+14,b-46);g.lineTo(x+11,b-26);g.lineTo(x-11,b-26);g.closePath();g.fill()}
  else{g.fillStyle='#7a7a74';for(let k=0;k<7;k++){g.beginPath();g.arc(x-24+k*8,b-3,5,0,7);g.fill()}}
  g.strokeStyle='#3a2414';g.lineWidth=5;g.beginPath();g.moveTo(x-18,b-2);g.lineTo(x+16,b-10);g.moveTo(x+18,b-2);g.lineTo(x-14,b-10);g.stroke();
  const gr=90+h,gl=g.createRadialGradient(x,b-20,4,x,b-20,gr);gl.addColorStop(0,'rgba(255,180,80,.35)');gl.addColorStop(1,'rgba(255,140,40,0)');g.fillStyle=gl;g.beginPath();g.arc(x,b-20,gr,Math.PI,0);g.lineTo(x+gr,b);g.lineTo(x-gr,b);g.closePath();g.fill();
  for(let k=0;k<5;k++){const w=14-k*2,hh=h*(1-k*.13)*(.85+.15*Math.sin(t*14+k*2)),ox=Math.sin(t*7+k)*3;g.fillStyle=['#c83a1a','#e8601e','#f08a2a','#f8b840','#fde08a'][k];
    g.beginPath();g.moveTo(x-w+ox*.3,b-4);g.quadraticCurveTo(x-w*1.2,b-hh*.5,x+ox,b-hh);g.quadraticCurveTo(x+w*1.2,b-hh*.5,x+w+ox*.3,b-4);g.closePath();g.fill()}
  if(f.flare)for(let k=0;k<4;k++){g.fillStyle='rgba(255,200,90,.8)';g.beginPath();g.arc(x+Math.sin(t*5+k*3)*14,b-h-10-((t*90+k*30)%60),1.8,0,7);g.fill()}
  g.restore()}

/* la culée du pont de 2026, et l'escalier qui descend au camping */
function fAbutment(g){const tops=[[230,8],[231,8],[232,8],[233,8],[234,9],[235,10],[236,11]];g.save();
  for(const[c,r]of tops){const x=c*T,y=r*T,h=(FGR-r)*T+2;g.fillStyle='#a8a49a';g.fillRect(x,y,T,h);g.fillStyle='#bdb9ae';g.fillRect(x,y,T,6);
    g.strokeStyle='rgba(70,66,58,.35)';g.lineWidth=1;for(let yy=y+16;yy<y+h;yy+=16){g.beginPath();g.moveTo(x,yy);g.lineTo(x+T,yy);g.stroke();const o=((yy/16)|0)%2?T*.5:T*.15;g.beginPath();g.moveTo(x+o,yy-16);g.lineTo(x+o,yy);g.stroke()}}
  g.fillStyle='#4a4a46';g.fillRect(230*T,8*T-34,4*T,4);for(let c=230;c<=234;c++)g.fillRect(c*T,8*T-34,4,34);
  g.restore()}
function fTerrace(g,x,b,t){g.save();// une table nappée à carreaux, deux chaises, un parasol
  g.strokeStyle='#6a6a6a';g.lineWidth=2;g.beginPath();g.moveTo(x,b-30);g.lineTo(x,b-96);g.stroke();
  for(let k=0;k<5;k++){g.fillStyle=k%2?'#f2ece0':'#3a6a8a';poly(g,[x,b-104,x-46+k*18.4,b-84,x-27.6+k*18.4,b-84]);g.fill()}
  g.fillStyle='#e8e0d0';g.fillRect(x-22,b-34,44,5);g.fillStyle='#c83a3a';for(let k=0;k<6;k++)if(k%2)g.fillRect(x-22+k*7.3,b-34,7.3,5);g.fillStyle='#e8e0d0';poly(g,[x-22,b-29,x+22,b-29,x+18,b-20,x-18,b-20]);g.fill();
  g.strokeStyle='#3a3a3a';g.lineWidth=2;g.beginPath();g.moveTo(x-10,b-20);g.lineTo(x-14,b);g.moveTo(x+10,b-20);g.lineTo(x+14,b);g.stroke();
  for(const d of[-1,1]){const cx=x+d*34;g.strokeStyle='#2e4a3a';g.lineWidth=2.4;g.beginPath();g.moveTo(cx-8,b);g.lineTo(cx-8,b-18);g.lineTo(cx+8,b-18);g.lineTo(cx+8,b);g.moveTo(cx+d*8,b-18);g.lineTo(cx+d*8,b-38);g.stroke()}
  g.fillStyle='rgba(200,230,240,.7)';g.fillRect(x-8,b-44,5,10);g.fillStyle='#c8a030';g.fillRect(x+4,b-42,5,8);g.restore()}

/* ---------- performances : brume et vignette précalculées, personnages mis en cache ---------- */
let FFOG=null;
function ferteFogTex(){if(FFOG)return FFOG;
  const fog=mk(W*2,H),g=fog.getContext('2d');g.fillStyle='rgba(120,100,70,.12)';g.fillRect(0,0,W*2,H);
  for(let k=0;k<12;k++){for(const off of[0,W*2]){const x=k*160+40-off*0+(off?-W*2:0),y=110+(k*97)%340;const gr=g.createRadialGradient(x,y,10,x,y,300);gr.addColorStop(0,'rgba(232,222,198,.18)');gr.addColorStop(1,'rgba(232,222,198,0)');g.fillStyle=gr;g.fillRect(x-300,y-300,600,600);
    const x2=x+W*2;const g2=g.createRadialGradient(x2,y,10,x2,y,300);g2.addColorStop(0,'rgba(232,222,198,.18)');g2.addColorStop(1,'rgba(232,222,198,0)');g.fillStyle=g2;g.fillRect(x2-300,y-300,600,600)}}
  const vig=mk(W,H),v=vig.getContext('2d');const vg=v.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,H*.85);vg.addColorStop(0,'rgba(60,48,30,0)');vg.addColorStop(1,'rgba(60,48,30,.38)');v.fillStyle=vg;v.fillRect(0,0,W,H);
  return FFOG={fog,vig}}
const FSPR={};
function fSpr(g,key,w,h,ox,oy,x,y,fn){let c=FSPR[key];const rs=Math.max(1,RS);if(!c||c.rs!==rs){c=mk(Math.ceil(w*rs),Math.ceil(h*rs));const g2=c.getContext('2d');g2.scale(rs,rs);g2.translate(ox,oy);fn(g2);c.rs=rs;FSPR[key]=c}g.drawImage(c,x-ox,y-oy,w,h)}

/* ---------- le tablier du pont de 2026 et son chantier ---------- */
function fDeckBack(g,t){const x0=206*T,x1=230*T,y=8*T;g.save();// garde-corps du fond
  g.fillStyle='#5a5c5a';for(let x=x0+60;x<x1;x+=40)g.fillRect(x,y-34,3,34);g.fillRect(x0+50,y-36,x1-x0-50,4);g.fillRect(x0+50,y-20,x1-x0-50,2);
  // l'échafaudage contre la pile de l'extrémité ouest, et le filet orange
  g.strokeStyle='#8a8a86';g.lineWidth=3;for(const x of[x0-10,x0+30]){g.beginPath();g.moveTo(x,FGR*T+30);g.lineTo(x,y+30);g.stroke()}
  for(let yy=y+60;yy<FGR*T+20;yy+=50){g.beginPath();g.moveTo(x0-10,yy);g.lineTo(x0+30,yy);g.stroke();g.beginPath();g.moveTo(x0-10,yy);g.lineTo(x0+30,yy+50);g.stroke()}
  g.fillStyle='rgba(232,110,30,.35)';g.fillRect(x0-14,y+40,48,90);g.restore()}
function fDeck(g,t){const x0=206*T,x1=230*T,y=8*T;g.save();
  // le tablier : chaussée, rive, poutre, joints
  g.fillStyle='#a8a69e';g.beginPath();g.moveTo(x0+8,y);g.lineTo(x1+4,y);g.lineTo(x1+4,y+42);g.lineTo(x0+18,y+42);g.lineTo(x0+12,y+34);g.lineTo(x0+4,y+30);g.lineTo(x0+10,y+20);g.lineTo(x0,y+12);g.closePath();g.fill();
  g.fillStyle='#c4c2ba';g.fillRect(x0+8,y,x1-x0-4,6);g.fillStyle='#8e8c84';g.fillRect(x0+18,y+26,x1-x0-14,16);g.fillStyle='rgba(0,0,0,.18)';g.fillRect(x0+18,y+40,x1-x0-14,3);
  g.strokeStyle='rgba(60,58,52,.4)';g.lineWidth=1;for(let x=x0+160;x<x1;x+=160){g.beginPath();g.moveTo(x,y);g.lineTo(x,y+42);g.stroke()}
  // le bout coupé : ferraillage à nu
  g.strokeStyle='#6a4a34';g.lineWidth=2;for(let k=0;k<5;k++){g.beginPath();g.moveTo(x0+6,y+6+k*7);g.quadraticCurveTo(x0-10,y+4+k*7,x0-18-k*2,y+10+k*8);g.stroke()}
  // le chantier sur le tablier : barrières, cônes, panneau, baraque
  for(let k=0;k<3;k++){const bx=x0+44+k*46;g.fillStyle='#e8e4dc';rr(g,bx,y-30,40,26,3);g.fill();g.fillStyle='#d8302a';for(let j=0;j<4;j++)poly(g,[bx+j*10,y-30,bx+j*10+6,y-30,bx+j*10+2,y-4,bx+j*10-4,y-4]);g.fill();g.fillStyle='#444';g.fillRect(bx+4,y-4,6,4);g.fillRect(bx+30,y-4,6,4)}
  for(const cx of[x0+200,x0+236]){g.fillStyle='#e86a1a';poly(g,[cx-8,y,cx,y-24,cx+8,y]);g.fill();g.fillStyle='#f2ece0';g.fillRect(cx-5,y-14,10,4)}
  g.fillStyle='#e8c040';poly(g,[x0+262,y-6,x0+282,y-44,x0+302,y-6]);g.fill();g.fillStyle='#2a2a2a';poly(g,[x0+270,y-12,x0+282,y-34,x0+294,y-12]);g.fill();g.fillStyle='#e8c040';g.fillRect(x0+280,y-28,4,10);
  g.fillStyle='#e0dcd2';g.fillRect(x0+330,y-60,90,60);g.fillStyle='#3a6aa0';g.fillRect(x0+330,y-60,90,8);g.fillStyle='#8aa0b0';g.fillRect(x0+344,y-44,24,16);g.fillStyle='#6a6a66';g.fillRect(x0+386,y-44,18,44);
  g.fillStyle='#2a3a5a';g.font='bold 8px '+F_DISP;g.textAlign='center';g.fillText('CHANTIER',x0+375,y-53);
  g.fillStyle='#2a3a5a';rr(g,x0+440,y-74,74,40,3);g.fill();g.fillStyle='#ece6d2';g.font='bold 8px '+F_DISP;g.fillText('RÉFECTION',x0+477,y-58);g.fillText('DU TABLIER',x0+477,y-46);g.fillStyle='#5a5a5a';g.fillRect(x0+475,y-34,3,34);
  g.restore()}
/* la rampe à paliers qui descend de la culée au chemin de halage */
function fRamp(g){const land=[[230,233,8],[233,236,9],[236,239,10],[239,242,11]];g.save();
  const wallC='#a8a49a',capC='#c8c4b8';
  // le mur de quai côté rivière
  g.fillStyle=wallC;g.fillRect(230*T-6,8*T,12,ROWS*T-8*T);
  for(const[a,b,r]of land){const x=a*T,w=(b-a)*T,y=r*T,h=(FGR-r)*T;g.fillStyle=wallC;g.fillRect(x,y,w,h+4);
    g.strokeStyle='rgba(70,66,58,.3)';g.lineWidth=1;for(let yy=y+14;yy<FGR*T;yy+=14){g.beginPath();g.moveTo(x,yy);g.lineTo(x+w,yy);g.stroke();for(let xx=x+((yy/14|0)%2?10:30);xx<x+w;xx+=40){g.beginPath();g.moveTo(xx,yy-14);g.lineTo(xx,yy);g.stroke()}}
    g.fillStyle=capC;g.fillRect(x,y,w,6);g.fillStyle='rgba(0,0,0,.12)';g.fillRect(x,y+6,w,2);
    // trois petites marches au bout du palier
  }
  // la main courante qui suit la descente
  g.strokeStyle='#3a3a38';g.lineWidth=3;g.beginPath();g.moveTo(230*T,8*T-30);for(const[a,b,r]of land){g.lineTo(b*T-36,r*T-30);g.lineTo(b*T,(r+1)*T-30)}g.stroke();
  g.lineWidth=2;for(const[a,b,r]of land)for(const x of[a*T+8,b*T-40]){g.beginPath();g.moveTo(x,r*T);g.lineTo(x,r*T-30);g.stroke()}
  // des jardinières
  for(const[a,b,r]of land.slice(1)){g.fillStyle='#6a5a4a';g.fillRect(a*T+30,r*T-14,30,14);g.fillStyle='#4a7a3a';g.beginPath();g.arc(a*T+38,r*T-16,8,0,7);g.arc(a*T+52,r*T-18,9,0,7);g.fill();g.fillStyle='#d83a3a';g.beginPath();g.arc(a*T+44,r*T-22,2.5,0,7);g.fill()}
  g.restore()}
/* le grand marronnier de 1914 : ses branches portent Raymond */
function fChestnut(g,b,t){const x=6*T+22;g.save();
  for(const[dx,dy,r,c]of[[-80,-420,70,'#4a5a30'],[60,-440,80,'#52653a'],[0,-480,76,'#5a6c3c'],[-110,-340,56,'#46562e'],[110,-330,60,'#4e6034'],[-40,-260,50,'#4a5a30'],[90,-230,46,'#52653a']]){g.fillStyle=c;g.beginPath();g.arc(x+dx,b+dy,r,0,7);g.fill()}
  const tg=g.createLinearGradient(x-18,0,x+18,0);tg.addColorStop(0,'#3a2e22');tg.addColorStop(.5,'#5a4a36');tg.addColorStop(1,'#33281c');g.fillStyle=tg;
  g.beginPath();g.moveTo(x-26,b+4);g.quadraticCurveTo(x-14,b-160,x-12,b-420);g.lineTo(x+12,b-420);g.quadraticCurveTo(x+14,b-160,x+28,b+4);g.closePath();g.fill();
  g.strokeStyle='rgba(20,14,8,.35)';g.lineWidth=1;for(let y=b-30;y>b-400;y-=26){g.beginPath();g.moveTo(x-10,y);g.quadraticCurveTo(x,y+5,x+9,y-2);g.stroke()}
  // les branches praticables (dessus = haut de la case)
  const br=(x1,x2,y)=>{g.fillStyle='#4e3e2c';g.beginPath();g.moveTo(x1,y+16);g.quadraticCurveTo((x1+x2)/2,y+20,x2,y+8);g.lineTo(x2+6,y+2);g.lineTo(x2,y-1);g.quadraticCurveTo((x1+x2)/2,y-2,x1,y-4);g.closePath();g.fill();
    g.fillStyle='#6a5640';g.fillRect(Math.min(x1,x2),y-1,Math.abs(x2-x1),3);g.fillStyle='#5a6c3c';g.beginPath();g.arc(x2,y-8,14,0,7);g.arc(x2+(x2>x1?-16:16),y-12,10,0,7);g.fill()};
  br(x+10,9*T-2,9*T);br(x-10,4*T+2,6*T);br(x+10,9*T-2,3*T);
  g.restore()}

/* ---------- la forêt des berges : un rideau d'arbres serré derrière le chemin, dans les deux époques ---------- */
const FFOREST={};
function forestList(era){if(FFOREST[era])return FFOREST[era];const R=mulberry(era*31+7),gr=L.ferte.E[era].g,out=[];
  for(let row=0;row<2;row++){let c=.3+R();while(c<FW-1){const ci=Math.floor(c);const ok=gr[FGR][ci]==='#'&&gr[FGR][Math.min(FW-1,ci+1)]==='#'&&gr[FGR][Math.max(0,ci-1)]==='#';
    if(ok){const k=R();out.push({x:c*T+R()*20,row,v:k<.3?'grand':k<.5?'grand2':k<.68?'platane':k<.84?'peuplier':'saule',dy:row?0:-18-R()*14})}
    c+=row?1.6+R()*1.8:1.0+R()*1.1}}
  out.sort((a,b)=>a.row-b.row);return FFOREST[era]=out}
function fForest(g,era,vis,b){const list=forestList(era),e14=era===14;let veiled=false;
  for(const tr of list){if(tr.row===1&&!veiled){veiled=true;g.fillStyle=rgba(L.th.fog,e14?.45:.4);g.fillRect(cam.x-60,cam.y-60,W+120,b-cam.y+60+2)}
    if(!vis(tr.x-230,tr.x+230))continue;
    fSpr(g,'arbreB'+era+tr.v,460,520,230,505,tr.x,b+tr.dy,g2=>{
      if(tr.v==='grand'){g2.scale(1.5,1.5);fPlane(g2,0,0,e14)}else if(tr.v==='grand2'){g2.scale(1.25,1.3);fPlane(g2,0,0,e14)}else if(tr.v==='platane')fPlane(g2,0,0,e14);
      else if(tr.v==='peuplier'){fPoplarN(g2,-30,0,330);fPoplarN(g2,4,0,380);fPoplarN(g2,36,0,300)}else{g2.scale(1.3,1.3);fWillow(g2,0,0,0)}})}
  if(!veiled){}}
