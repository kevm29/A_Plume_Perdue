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
const FW=320,FGR=12;
VXU.fr14={coat:'#4e5a72',coat2:'#46516a',coatD:'#3a445a',trou:'#a8322d',putt:'#2a2420',helm:'#4e5a72',helmD:'#3a445a',leather:'#5a3a22',boot:'#2a1e14',tab:'#a8322d',btn:'#c9a24a'};
VXU.uk={coat:'#7a6c48',coat2:'#6c5f3e',coatD:'#5a4e32',trou:'#75683f',putt:'#6a5c3a',helm:'#7a6c48',helmD:'#5a4e32',leather:'#6a4a2a',boot:'#3a2618',tab:'#2a4a8a',btn:'#b8a46a'};

THEMES.ferte26={outdoor:true,far:'ferte',horizon:'bridge',era:26,sky:['#466a92','#a9c4d8','#f2e2c2'],celestial:'sun',sunY:250,fog:'#8a9cae',dark:.1,weather:'clear',
  floor:'#5a4834',floorTop:'#6c8c3c',type:'earth',x:'hedge',d:'hedge',shelf:'deck',spike:'wire',walker:'rat',flyer:'pie',noFore:false,props:['fern','stump','fern']};
THEMES.ferte14={outdoor:true,far:'ferte',horizon:'bridge',era:14,sky:['#4e4a42','#9c927c','#d6c6a0'],celestial:'sun',sunY:270,fog:'#a89c80',dark:.2,weather:'mist',
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
  FERTE.gerbes=[{c:166,ph:0},{c:184,ph:1.6},{c:200,ph:.8},{c:214,ph:2.3}];
  /* l'autre rive : le camping (2026), la ferme barricadée (1914) */
  put(A,232,11,'C');put(B,232,11,'C');
  ents[26].push({k:'rat',c:237});
  block(B,14,240,244,'ferme');put(A,242,10,'o');
  water(A,250,252);ents[26].push({k:'boar',c:258});put(A,251,8,'o');
  put(A,247,8,'m');
  block(A,26,264,268,'sanitaires');put(B,266,10,'o');
  for(let c=271;c<=274;c++)put(B,c,11,'^');put(B,272,8,'o');
  ents[26].push({k:'rat',c:276});
  block(A,26,280,282,'kiosque');block(B,14,285,287,'charrette');put(A,286,10,'o');put(B,281,10,'o');
  /* la guinguette (2026) ; en 1914, à sa place, le capitaine et sa nomination */
  put(A,291,11,'C');put(B,291,11,'C');
  block(A,26,298,303,'guinguette');
  FERTE.cer={c:300};
  put(A,310,10,'o');put(B,307,9,'o');
  put(A,315,11,'E');put(B,315,11,'E');
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
    gerbes:FERTE.gerbes.map(o=>({x:o.c*T+T/2,ph:o.ph,st:'idle',k:0})),
    cer:{x:FERTE.cer.c*T,on:false,done:false,t:0,ev:{}}};
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
  const t=buildTilesF(L);for(const[c,r,ch]of sv)L.g[r][c]=ch;return t}
function ferteSet(era){
  const F=L.ferte;if(!F||F.era===era)return;
  for(const k of FERTE_KEYS)F.E[F.era][k]=L[k];
  for(const k of FERTE_KEYS)L[k]=F.E[era][k];
  F.era=era;
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
  if(to===14&&!F.said.first){F.said.first=1;say("La même rivière, les mêmes peupliers. Mais l'air sent la poudre, et c'est septembre 1914. J'y étais.",4.6)}
  else if(to===26&&!F.said.back){F.said.back=1;say("Retour au présent. Les camping-cars ont remplacé les fourgons. C'est un progrès, je suppose.",3.8)}
}
function ferteRespawn(){const F=L.ferte;if(!F)return;ferteSet(P.cp&&P.cp.era||26);F.flash=.6;F.flashC=F.era;for(const s of F.gerbes){s.st='idle'}F.grace=1.2}

/* ---------- la mise à jour ---------- */
function ferteStep(dt){
  const F=L.ferte;if(!F)return;
  F.t+=dt;F.cool=Math.max(0,F.cool-dt);F.flash=Math.max(0,F.flash-dt*1.4);F.grace=Math.max(0,(F.grace||0)-dt);
  if(P.cp&&P.cp!==F.cpRef){F.cpRef=P.cp;if(P.cp.era==null)P.cp.era=F.era}
  // l'écureuil : descend le tronc, fouille au pied, remonte, guette
  for(const s of F.squirrels){s.t+=dt;const cyc=s.t%6.4;
    if(cyc<1.6){s.st='top';s.y=s.y0}else if(cyc<2.9){s.st='down';s.y=lerp(s.y0,s.y1,(cyc-1.6)/1.3)}else if(cyc<4.6){s.st='bottom';s.y=s.y1}else{s.st='up';s.y=lerp(s.y1,s.y0,(cyc-4.6)/1.8)}}
  // les poissons : un saut d'un point à l'autre du bras d'eau
  for(const f of F.fish){const cyc=(F.t+f.ph)%2.7,u=cyc/1.15;f.on=u<1;if(f.on){f.x=lerp(f.xa,f.xb,u);f.y=FGR*T+18-Math.sin(u*Math.PI)*150;f.u=u;if(u<.05&&!f.sp){f.sp=1;if(!G.sim&&F.era===26&&Math.abs(f.x-P.x)<700)splashF(f.xa,FGR*T+18)}}else{if(f.sp){f.sp=0;if(!G.sim&&F.era===26&&Math.abs(f.x-P.x)<700)splashF(f.xb,FGR*T+18)}}}
  // les gerbes d'obus allemands sur le pont de bateaux (1914)
  for(const s of F.gerbes){const cyc=(F.t+s.ph)%4.2;const st=cyc<1.1?'warn':cyc<1.7?'boom':'idle';
    if(st==='boom'&&s.st!=='boom'&&F.era===14&&!G.sim&&Math.abs(s.x-P.x)<900){noise(.6,320,.35,'lowpass');G.shake=Math.max(G.shake,Math.abs(s.x-P.x)<300?9:4);splashF(s.x,FGR*T+12,true)}
    if(st==='warn'&&s.st==='idle'&&F.era===14&&!G.sim&&Math.abs(s.x-P.x)<700)tone(1400,.9,'sine',.025,500);
    s.st=st;s.k=cyc}
  // la nomination (1914, à l'emplacement de la guinguette)
  const C=F.cer;
  if(!C.done&&!C.on&&F.era===14&&P.x+P.w/2>C.x-40&&!P.dead){C.on=true;C.t=0;C.ev={};P.vx=0;keys.delete('left');keys.delete('right')}
}
function splashF(x,y,big){for(let i=0;i<(big?26:10);i++){parts.push({type:'dust',x:x+(rnd()-.5)*(big?40:14),y,vx:(rnd()-.5)*(big?260:90),vy:-(big?260:120)-rnd()*(big?300:120),life:0,max:.6+rnd()*.5})}}
function ferteAfterMove(){
  const F=L.ferte;if(!F||F.grace>0)return null;
  const hb={x:P.x+3,y:P.y+4,w:P.w-6,h:P.h-6};
  if(F.era===26){
    for(const s of F.squirrels)if(overlap(hb,{x:s.x-11,y:s.y-10,w:22,h:22}))return'ecureuil';
    for(const f of F.fish)if(f.on&&f.y<FGR*T+4&&overlap(hb,{x:f.x-12,y:f.y-7,w:24,h:14}))return'poisson';
  }else{
    for(const s of F.gerbes)if(s.st==='boom'){const k=(s.k-1.1)/.6,h=150*Math.sin(Math.min(1,k*1.6)*Math.PI/2);if(Math.abs(P.x+P.w/2-s.x)<30&&P.y+P.h>FGR*T-h+10)return'gerbe'}
  }
  return null;
}
/* la scène de la nomination : Raymond figé, le capitaine parle */
const FERTE_CER=[
  [.8,'LE CAPITAINE',"Matricule 7413. Premier message porté sous le feu, de la Marne jusqu'au colombier.",4.6],
  [5.6,'LE CAPITAINE',"Pour ce fait, le pigeon 7413 est nommé soldat de 1re classe. Rompez.",4.2],
  [10.0,'LE SAPEUR',"Well done, little chap. Good show.",3.0],
  [13.2,'RAYMOND',"Soldat de 1re classe. Il m'a fallu deux ans pour finir sergent. Et cent douze pour repasser par ici.",4.8]];
function ferteCerUpdate(dt){
  const F=L.ferte,C=F.cer;C.t+=dt;P.vx=0;P.facing=1;
  if(!P.onGround){P.vy=Math.min(MAXFALL,P.vy+GRAV*dt);P.onGround=false;moveY(P,P.vy*dt)}
  for(let i=0;i<FERTE_CER.length;i++){const e=FERTE_CER[i];if(C.t>=e[0]&&!C.ev[i]){C.ev[i]=1;G.quip=null;G.quipQ=[];say(e[2],e[3],e[1]);if(i===1&&!G.sim){tone(523,.25,'square',.04);tone(659,.25,'square',.04,null,.28);tone(784,.5,'square',.04,null,.56)}}}
  if(C.t>1.5&&(pressed.has('ok')||pressed.has('jump')||G.click)){const n=Object.keys(C.ev).length;C.t=n<FERTE_CER.length?Math.max(C.t,FERTE_CER[n][0]):99}
  if(C.t>18){C.on=false;C.done=true}
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
  if(!e14){for(let x=900;x<wpx;x+=2100){g.fillStyle=near;poly(g,[x-7,462,x-4,380,x+4,380,x+7,462]);g.fill();poly(g,[x-24,382,x-16,356,x+16,356,x+24,382]);g.fill();g.fillRect(x-17,352,34,5)}}
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
  // les arbres (tronc de l'écureuil) et les bâtiments du fond
  if(!e14){for(const s of F.squirrels)if(vis(s.x-120,s.x+120))fTree(g,s.x,FGR*T,s.y0-40);
    ferteMemorial(g,146*T,FGR*T,vis);
    // le pont de 2026 : piles de béton sous le tablier, garde-corps
    if(vis(206*T,230*T)){g.fillStyle='#8a8c88';for(const c of[206,214,222,229]){g.fillRect(c*T+6,9*T,26,FGR*T+60-9*T);g.fillStyle='rgba(0,0,0,.18)';g.fillRect(c*T+24,9*T,8,FGR*T+60-9*T);g.fillStyle='#8a8c88'}
      g.fillStyle='#9a9c98';g.fillRect(206*T,8*T+14,24*T,16);}
    if(vis(160*T,206*T)){g.fillStyle='rgba(120,122,118,.85)';for(const c of[166,182,198]){g.fillRect(c*T,9*T+20,30,FGR*T+60-9*T-20);g.fillStyle='#6a6c68';poly(g,[c*T-6,9*T+20,c*T+36,9*T+20,c*T+30,9*T+34,c*T,9*T+34]);g.fill();g.fillStyle='rgba(120,122,118,.85)'}
      g.strokeStyle='#e8a020';g.lineWidth=2;g.beginPath();g.moveTo(166*T+15,9*T+20);g.lineTo(166*T+15,9*T-60);g.stroke();}
    // le camping
    if(vis(232*T,262*T)){fCaravan(g,234*T,FGR*T,'#e8e4dc','#3a6a8a');fCaravan(g,254*T+20,FGR*T,'#ece6d6','#8a4a3a');fParasol(g,246*T,FGR*T,t)}
  }else{
    // le camp des fantassins (pantalon garance) là où sera le club d'aviron
    if(vis(28*T,46*T))fCamp14(g,t);
    // les bateaux du pont : coques sous les planches, sapeurs au travail
    if(vis(100*T,141*T)){for(const[a,b]of[[102,110],[129,140]])fPilings(g,a,b)}
    if(vis(158*T,232*T)){for(const[a,b]of[[160,171],[194,205]])fPontoons(g,a,b);fSappers(g,t)}
    if(vis(238*T,250*T)){}
    if(vis(292*T,312*T))fCerGroup(g,t,F.cer);
  }
}
/* au premier plan des tuiles : bâtiments, bêtes, gerbes */
function drawFerteMid(t){
  const F=L.ferte;if(!F)return;const g=ctx,vis=(a,b)=>b>cam.x-220&&a<cam.x+W+220;
  for(const b of FERTE.blocks[F.era])if(vis(b.c0*T,(b.c1+1)*T))fBlock(g,b,t,F.era);
  if(F.era===26){
    for(const s of F.squirrels)if(vis(s.x-30,s.x+30))fSquirrel(g,s,t);
    for(const f of F.fish)if(f.on&&vis(f.x-30,f.x+30))fFish(g,f);
    if(vis(156*T,160*T)){fSign(g,152*T,FGR*T,'PONT FERMÉ','travaux · déviation');}
    if(vis(30*T,34*T))fSign(g,31*T,FGR*T,"CLUB D'AVIRON","de la Marne");
    if(vis(228*T,232*T))fSign(g,229*T,FGR*T,'CAMPING','municipal ★★');
  }else{
    for(const s of F.gerbes)if(vis(s.x-80,s.x+80))fGerbe(g,s,t);
  }
}
function fSign(g,x,y,a,b){g.save();g.fillStyle='#4a3a2a';g.fillRect(x-2,y-62,4,62);g.fillStyle='#ece6d2';rr(g,x-40,y-86,80,30,3);g.fill();g.strokeStyle='#2a3a5a';g.lineWidth=1.5;rr(g,x-37,y-83,74,24,2);g.stroke();
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
  }else if(b.kind==='sanitaires'){ // le bloc sanitaire du camping
    g.fillStyle='#d8d2c0';g.fillRect(x0,top+50,w,base-top-50);g.fillStyle='#6a7a7a';g.fillRect(x0-8,top+40,w+16,14);
    g.fillStyle='#3a6a8a';g.fillRect(x0+18,base-110,40,110);g.fillRect(x1-58,base-110,40,110);g.fillStyle='#ece6d2';g.font='bold 14px '+F_DISP;g.textAlign='center';g.fillText('WC',x0+38,base-80);g.fillText('DOUCHES',x1-38,base-120);
    g.fillStyle='rgba(120,160,180,.6)';for(let x=x0+16;x<x1-20;x+=34)g.fillRect(x,top+70,22,14);
  }else if(b.kind==='kiosque'){ // le kiosque à glaces
    g.fillStyle='#e8dcc0';g.fillRect(x0,top+90,w,base-top-90);g.fillStyle='#e05a7a';for(let k=0;k<6;k++){g.fillStyle=k%2?'#f2ece0':'#e05a7a';g.fillRect(x0-10+k*(w+20)/6,top+70,(w+20)/6,26)}
    g.fillStyle='#3a3a3a';g.fillRect(x0+10,top+120,w-20,70);g.fillStyle='#f2ece0';g.font='bold 12px '+F_DISP;g.textAlign='center';g.fillText('GLACES',x0+w/2,top+108);
  }else if(b.kind==='guinguette'){ // la guinguette, lampions
    g.fillStyle='#b89a6a';g.fillRect(x0,top+60,w,base-top-60);g.fillStyle='#5a7a4a';poly(g,[x0-16,top+64,x0+w/2,top+10,x1+16,top+64]);g.fill();
    g.fillStyle='#2a1e14';g.fillRect(x0+20,base-130,60,130);g.fillStyle='rgba(255,210,130,.8)';g.fillRect(x0+110,base-140,w-140,60);
    g.fillStyle='#efe6d2';g.fillRect(x0+w/2-80,top+76,160,24);g.fillStyle='#8a2a22';g.font='bold 13px '+F_DISP;g.textAlign='center';g.fillText('GUINGUETTE · BAL',x0+w/2,top+93);
    for(let k=0;k<9;k++){const lx=x0-20+k*(w+40)/8,ly=top+68+Math.sin(k/8*Math.PI)*18;g.fillStyle=['#e8402a','#e8c040','#40a0e0'][k%3];g.beginPath();g.arc(lx,ly,6,0,7);g.fill()}
  }else if(b.kind==='passeur'){ // la maison du passeur (1914), volets clos
    g.fillStyle='#a89a7c';g.fillRect(x0,top+50,w,base-top-50);g.fillStyle='#6a4a3a';poly(g,[x0-14,top+54,x0+w/2,top-10,x1+14,top+54]);g.fill();
    g.strokeStyle='rgba(60,40,20,.25)';g.lineWidth=1;for(let y=top+60;y<base;y+=14){g.beginPath();g.moveTo(x0,y);g.lineTo(x1,y);g.stroke()}
    g.fillStyle='#5a6a4a';for(const[wx,wy]of[[x0+30,top+90],[x1-70,top+90],[x0+30,top+200],[x1-70,top+200]])g.fillRect(wx,wy,40,52);
    g.fillStyle='#3a2a1e';g.fillRect(x0+w/2-24,base-100,48,100);g.fillStyle='#e8dcc0';g.font='italic 10px '+F_BODY;g.textAlign='center';g.fillText('Passeur · Bac',x0+w/2,top+76);
  }else if(b.kind==='ferme'){ // la ferme barricadée : charrettes, sacs, matelas aux fenêtres
    g.fillStyle='#9a8a6a';g.fillRect(x0,top+40,w,base-top-40);g.fillStyle='#5a3a2a';poly(g,[x0-10,top+44,x0+w/2,top,x1+10,top+44]);g.fill();
    g.fillStyle='#d8ccb0';for(const wy of[top+80,top+180])g.fillRect(x0+20,wy,w-40,40);g.strokeStyle='#8a7a5a';g.lineWidth=2;for(const wy of[top+80,top+180]){g.beginPath();g.moveTo(x0+20,wy+20);g.lineTo(x1-20,wy+20);g.stroke()}
    for(let k=0;k<6;k++){g.fillStyle=k%2?'#8a7a5a':'#7a6a4a';rr(g,x0-6+(k%3)*w/3,base-30-Math.floor(k/3)*24,w/3+4,26,8);g.fill()}
    g.strokeStyle='#4a3020';g.lineWidth=5;g.beginPath();g.arc(x0+w/2,base-80,30,0,7);g.stroke();for(let a=0;a<6.28;a+=.8){g.beginPath();g.moveTo(x0+w/2,base-80);g.lineTo(x0+w/2+Math.cos(a)*30,base-80+Math.sin(a)*30);g.stroke()}
  }else if(b.kind==='charrette'){ // la charrette de munitions renversée et son chargement
    g.fillStyle='#6a4a2a';g.save();g.translate(x0+w/2,base-140);g.rotate(-1.2);g.fillRect(-80,-30,160,60);g.restore();
    g.strokeStyle='#3a2414';g.lineWidth=6;g.beginPath();g.arc(x0+w/2,top+80,40,0,7);g.stroke();for(let a=0;a<6.28;a+=.63){g.beginPath();g.moveTo(x0+w/2,top+80);g.lineTo(x0+w/2+Math.cos(a)*40,top+80+Math.sin(a)*40);g.stroke()}
    for(let k=0;k<10;k++){g.fillStyle=k%2?'#7a6a3a':'#5a5a3a';rr(g,x0-8+(k%2)*w/2,base-26-Math.floor(k/2)*30,w/2+8,28,4);g.fill();g.fillStyle='rgba(0,0,0,.2)';g.fillRect(x0-4+(k%2)*w/2,base-14-Math.floor(k/2)*30,w/2,2)}
  }
  g.restore()}
/* 1914 */
function fCamp14(g,t){const b=FGR*T;
  g.fillStyle='#d8ccb0';poly(g,[29*T,b,30.5*T,b-80,32*T,b]);g.fill();g.fillStyle='rgba(0,0,0,.15)';poly(g,[30.5*T,b-80,32*T,b,30.8*T,b]);g.fill();
  g.strokeStyle='#5a4a3a';g.lineWidth=2;for(let k=0;k<5;k++){g.beginPath();g.moveTo(41*T+k*7,b);g.lineTo(42*T+k*3,b-44);g.stroke()}
  const fs=[{x:35*T,f:1,pose:'sit',sk:0},{x:38*T,f:-1,pose:'stand',sk:2},{x:43.5*T,f:-1,pose:'sit',sk:4}];
  for(const m of fs)if(m.pose==='sit'){g.fillStyle='#5a4a30';rr(g,m.x-30,b-40,46,40,3);g.fill();g.fillStyle='rgba(0,0,0,.2)';g.fillRect(m.x-30,b-28,46,2);g.fillStyle='#e8dcc0';g.font='7px '+F_DISP;g.textAlign='center';g.fillText('8 mm Lebel',m.x-7,b-14)}
  for(const m of fs){const p=m.pose==='sit'?Object.assign({},VX_P.sit,{lean:.1}):VX_P.stand;
    vxSoldier(g,{hip:m.pose==='sit'?{x:m.x,y:b-44}:null,x:m.x,y:b,s:9.5,f:m.f,side:'fr14',capote:true,t,pose:p,noPouch:false,kit:{musette:1},
      face:{skin:VX_SKIN[m.sk],hair:VX_HAIR[m.sk],stache:m.sk===2?'walrus':'1914',helmet:'kepi',ex:'neutral',look:[m.f*.6,0]}})}
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
  const t=G.t;vxSoldier(g,{x:bx,y:y+16,s:7.5,f:dir,side:'uk',t,pose:Object.assign({},VX_P.stand,{lean:.3,nT:{x:4.2,y:1.4},fT:{x:3.4,y:1.8}}),noPouch:true,
    face:{skin:VX_SKIN[2],hair:VX_HAIR[3],stache:'thin',helmet:'tommy',ex:'worry'}});
  g.strokeStyle='#6a4a2a';g.lineWidth=2.4;g.beginPath();g.moveTo(bx+dir*10,y-20);g.lineTo(bx+dir*60,y+40);g.stroke();
  g.restore()}
function fSappers(g,t){const y=FGR*T;
  const list=[{c:163,f:1,act:'hammer',sk:1},{c:169,f:-1,act:'rope',sk:5},{c:197,f:1,act:'hammer',sk:3},{c:203,f:-1,act:'look',sk:6}];
  for(const s of list){const x=s.c*T,ph=Math.sin(t*(s.act==='hammer'?6:2)+s.c);
    const pose=s.act==='hammer'?Object.assign({},VX_P.kneel,{nT:{x:3.4,y:.4-Math.max(0,ph)*3.2},fT:{x:2.6,y:1.2}}):s.act==='rope'?Object.assign({},VX_P.stand,{lean:-.12,nT:{x:3.2,y:-.8+ph*.4},fT:{x:3.6,y:-.4+ph*.4}}):VX_P.binoc||VX_P.stand;
    vxSoldier(g,{x,y,s:8.2,f:s.f,side:'uk',t,pose,noPouch:true,face:{skin:VX_SKIN[s.sk],hair:VX_HAIR[s.sk],stache:s.sk%2?'thin':null,helmet:'tommy',ex:s.act==='look'?'worry':'neutral'}});}
  // au loin, sur la rive nord, les éclairs des fusils allemands
  for(let k=0;k<5;k++){const ph=(t*1.3+k*.77)%3;if(ph<.08){const fx=(170+k*11)*T+((k*53)%40);g.fillStyle='rgba(255,230,150,.9)';g.beginPath();g.arc(fx,7*T+((k*37)%60),3,0,7);g.fill()}}
}
function fGerbe(g,s,t){const y=FGR*T+10;
  if(s.st==='warn'){const u=s.k/1.1;g.strokeStyle='rgba(255,240,210,'+(.25+.5*u)+')';g.lineWidth=2;g.beginPath();g.ellipse(s.x,y,10+u*26,3+u*6,0,0,7);g.stroke();
    g.strokeStyle='rgba(255,240,210,'+(.15+.3*u)+')';g.setLineDash([4,6]);g.beginPath();g.moveTo(s.x,y-10);g.lineTo(s.x,y-160);g.stroke();g.setLineDash([])}
  else if(s.st==='boom'){const k=(s.k-1.1)/.6,h=150*Math.sin(Math.min(1,k*1.6)*Math.PI/2),a=1-Math.max(0,k-.6)/.4;
    g.fillStyle='rgba(225,232,226,'+(.85*a)+')';g.beginPath();g.moveTo(s.x-28,y);g.quadraticCurveTo(s.x-22,y-h*.6,s.x-8,y-h);g.quadraticCurveTo(s.x,y-h-14,s.x+8,y-h);g.quadraticCurveTo(s.x+22,y-h*.6,s.x+28,y);g.closePath();g.fill();
    g.fillStyle='rgba(120,110,90,'+(.5*a)+')';g.beginPath();g.ellipse(s.x,y-h*.4,10,h*.3,0,0,7);g.fill()}}
function fCerGroup(g,t,C){const b=FGR*T,x=C.x;
  // le capitaine (képi, capote), le caporal colombophile et son panier, un officier sapeur britannique
  const talk=C.on?Math.sin(t*9)*.5+.5:0;
  vxSoldier(g,{x:x+70,y:b,s:9.8,f:-1,side:'fr14',capote:true,t,pose:Object.assign({},VX_P.stand,{nT:C.on&&C.t>5.6&&C.t<9?{x:3.2,y:-2.2}:{x:.6,y:2.6}}),noPouch:true,
    face:{skin:VX_SKIN[2],hair:'#5a5a5a',stache:'walrus',helmet:'kepi',ex:talk>.5?'open':'neutral',look:[-.8,.1]}});
  vxSoldier(g,{x:x+130,y:b,s:9.4,f:-1,side:'fr14',capote:true,t,pose:Object.assign({},VX_P.stand,{nT:{x:2.8,y:1.6},fT:{x:2.4,y:1.8}}),kit:{musette:1},
    face:{skin:VX_SKIN[5],hair:VX_HAIR[1],stache:'1914',helmet:'kepi',ex:'neutral',look:[-.6,.2]}});
  vxBasket(g,x+104,b-58,44,30,{});
  vxSoldier(g,{x:x+190,y:b,s:9.6,f:-1,side:'uk',t,pose:VX_P.stand,noPouch:true,face:{skin:VX_SKIN[0],hair:VX_HAIR[3],stache:'thin',helmet:'tommy',ex:'neutral',look:[-.7,0]}});
}
/* en surimpression : la brume de 1914, l'éclair du passage */
function ferteOverlay(t){
  const F=L.ferte;if(!F)return;
  if(F.era===14){
    ctx.save();ctx.fillStyle='rgba(120,100,70,.12)';ctx.fillRect(0,0,W,H);
    for(let k=0;k<6;k++){const x=((k*260-t*(10+k*4))%(W+700)+W+700)%(W+700)-350,y=120+k*70+Math.sin(t*.3+k)*20;const gr=ctx.createRadialGradient(x,y,10,x,y,320);gr.addColorStop(0,'rgba(232,222,198,.2)');gr.addColorStop(1,'rgba(232,222,198,0)');ctx.fillStyle=gr;ctx.fillRect(x-320,y-320,640,640)}
    const vg=ctx.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,H*.85);vg.addColorStop(0,'rgba(60,48,30,0)');vg.addColorStop(1,'rgba(60,48,30,.38)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
    ctx.globalAlpha=.6;ctx.fillStyle='#efe5cc';ctx.font='italic 15px '+F_BODY;ctx.textAlign='left';ctx.fillText('La Marne · septembre 1914',20,H-20);ctx.restore();
  }
  if(F.flash>0){const a=Math.min(1,F.flash);ctx.save();ctx.fillStyle='rgba(236,232,222,'+(a*.85)+')';ctx.fillRect(0,0,W,H);
    const px=P.x+P.w/2-cam.x,py=P.y+P.h/2-cam.y;for(let k=0;k<8;k++){const ang=k/8*6.28+t,r=60+(1-a)*400;const gr=ctx.createRadialGradient(px+Math.cos(ang)*r,py+Math.sin(ang)*r*.6,10,px+Math.cos(ang)*r,py+Math.sin(ang)*r*.6,180);gr.addColorStop(0,'rgba(250,248,240,'+(a*.5)+')');gr.addColorStop(1,'rgba(250,248,240,0)');ctx.fillStyle=gr;ctx.fillRect(0,0,W,H)}
    ctx.restore()}
  if(F.cer.on){ctx.fillStyle='rgba(0,0,0,.85)';ctx.fillRect(0,0,W,40);ctx.fillRect(0,H-40,W,40)}
}
