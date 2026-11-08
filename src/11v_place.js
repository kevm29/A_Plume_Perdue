/* =========================================================
   5-3 · ELLE AIMAIT LES FÊTES — la place du marché de Crécy-la-Chapelle, jour de fête
   ---------------------------------------------------------
   Deux allers-retours de la même place, séparés par une courte ellipse (un intertitre) :
   1 · gauche → droite, en journée : la foule (on passe par les toits des maisonnettes), chiens en laisse,
       mouettes du poissonnier, un rat, écureuils, abeilles du nid aux fleurs, grillades qui crachent leurs flammes,
       l'orchestre sur la scène, réverbères à pics anti-pigeons, et le manège qui tourne (ses chevaux montent et descendent).
   2 · droite → gauche, l'après-midi : moins de monde, un chat, des toits pris par les pigeons du coin
       (ils chassent Raymond, et sautent pour le toucher s'il passe au-dessus) : il faut redescendre dans la rue.
   3 · gauche → droite, le soir, sous la pluie : Raymond, alourdi, ne saute plus aussi haut et ne bat qu'une fois des ailes ;
       les boutiques ferment, la scène est vide, le manège éteint ; chats errants, corbeaux, le hibou, des rats.
   4 · droite → gauche, la nuit, dans le brouillard : il ne reste que le manège éteint et la scène vide.
       Sur la scène, Raymond lit enfin la banderole.
   ========================================================= */
const PLW=140,PLG=12,PLF=PLG*T;
THEMES.place={outdoor:true,far:'place',horizon:'village',sky:['#5f90c6','#a9cde8','#f0efe2'],celestial:'sun',sunY:140,fog:'#c4cfd8',dark:0,weather:'clear',
  floor:'#6e6254',floorTop:'#a09482',type:'cobble',x:'crate',d:'stall',shelf:'plank',spike:'spikes',walker:'rat',flyer:'crow',props:[],noFore:true};
const PLX={
  chalets:[{c:4,k:'fromages',n:'FROMAGES',w:'#b88a5a'},{c:13,k:'miel',n:'MIEL',w:'#a87a4a'},{c:19,k:'charcut',n:'CHARCUTERIE',w:'#9a6a40'},{c:30,k:'crepes',n:'CRÊPES',w:'#b48a58'},
    {c:36,k:'poisson',n:'POISSONNERIE',w:'#8a6a4a'},{c:44,k:'primeur',n:'PRIMEUR',w:'#a8824e'},{c:49,k:'pain',n:'BOULANGERIE',w:'#b08050'},{c:86,k:'vins',n:'VINS & CIDRE',w:'#8a5a3a'},
    {c:92,k:'bonbons',n:'CONFISERIE',w:'#b8885a'},{c:98,k:'jouets',n:'JOUETS',w:'#a07448'},{c:109,k:'fleurs',n:'FLEURS',w:'#b8905e'}],
  // réverbères : perch = case du perchoir (sur la lanterne) ; sp = cases des pics, sous le bras
  lamps:[{x:10.5,perch:10},{x:18,sp:[17,18]},{x:35,sp:[34,35]},{x:41.5,perch:41},{x:60.5,perch:60},{x:91,sp:[90,91]},{x:96.5,perch:96},{x:114.5,perch:114}],
  trees:[{x:25.5,br:[[24,24,8],[26,28,6],[24,25,3]]},{x:82.5,br:[[79,81,7],[83,85,5],[81,82,2]]},{x:104.5,br:[[102,103,7],[105,107,5],[103,104,3]],nest:[107.5,5.1]}],
  benches:[27,81],
  stage:{c0:63,c1:77},bbq:{c0:54,c1:57},
  car:{cx:124.5*T,R:250,c0:116,c1:132}
};
const PL_CARDS={2:"Marguerite n'était pas sur la place.\nRaymond en refit le tour, dans l'autre sens.",3:"Le soir tombait. Il se mit à pleuvoir.\nRaymond chercha encore.",4:"La nuit était venue.\nLa place s'était vidée."};
const PL_END=["Raymond a cherché Marguerite toute la journée.\nAu marché, au bal, sous la pluie, jusqu'à la nuit. Elle n'était nulle part.",
  "Verdun. Raymond y était, en 1916, avec Lucien.\nUn cent-dixième anniversaire… Il refait le calcul, une fois, deux fois.",
  "1916 – 2026.\nIl a mis cent dix ans à rentrer.",
  "Marguerite avait dix-neuf ans quand Lucien lui a écrit.\nElle en aurait cent vingt-neuf aujourd'hui.",
  "Raymond sait maintenant où la trouver."];
const PL_START={2:"Pas de Marguerite. Elle est peut-être repartie de ce côté. Je refais le tour.",
  3:"Cette pluie… je me sens lourd. Lourd comme un sac de sable mouillé. Je ne monterai plus sur les toits, et un seul battement d'ailes, c'est tout ce que j'ai.",
  4:"Plus personne. Il ne reste que le manège et la scène. Un dernier tour, jusqu'à la scène."};
(function(){const g=Array.from({length:15},()=>Array(PLW).fill('.'));for(let c=0;c<PLW;c++)for(let r=PLG;r<15;r++)g[r][c]='#';
  PLX.segs=[g.map(r=>r.join('')).join('\n')];const d=LEVELS.find(d=>d.place);if(d)d.segs=PLX.segs})();

/* ---------- au chargement du niveau ---------- */
function placePost(Lv){
  if(!Lv.def.place)return;
  const S2=Lv.pl={pass:1,t:0,said:{},seq:null,beat:0,mus:.1};Lv.spawn={x:1.5*T,y:PLF};
  // la paille de chaque passage (on ne voit que celle du passage en cours)
  const corn={1:[[10,4],[17.5,7],[24,7],[27,5],[24.5,2],[34.5,7],[41,4],[55,7],[60,4],[70,3],[80,6],[84,4],[90.5,7],[96,4],[103,6],[106,4],[114,4],[121,8],[124.5,3],[128,8]],
    2:[[124.5,3],[114,4],[106,4],[100,10],[96,4],[88,7],[81.5,1],[70,9],[57,7],[46,10],[41,4],[32,7],[27,5],[21,10],[10,4],[5.5,6]],
    3:[[9,9],[15.5,9],[27.5,10],[34.5,8],[44,10],[53,10],[70,9],[84,10],[88,9],[99,9],[112.5,9],[121,8],[127,8]],
    4:[[129,8],[114,4],[106,4],[101,9],[96,4],[82,6],[81.5,10],[80.5,10]]};
  for(const p in corn)for(const[c,r]of corn[p])Lv.corn.push({x:(c+.5)*T,y:(r+.5)*T,taken:false,ph:c*.7+r,pass:+p});
  Lv.acts=Lv.acts||[];
  S2.drum={kind:'secret',style:'grossecaisse',x:72.5*T,y:10*T,open:0,t:0,used:false,when:()=>L.pl&&L.pl.pass>=3,
    q:["La grosse caisse de l'orchestre, sous sa bâche. Et dedans, pour étouffer le son : de la paille. Bizarre, rien qu'à la voir, je me sens mieux."]};
  Lv.acts.push(S2.drum);
  plSetPass(Lv,1);
}
/* ---------- un passage : la grille, les bêtes, les gens ---------- */
function plSetPass(Lv,n){
  const S2=Lv.pl;S2.pass=n;S2.rain=n===3;S2.t=0;S2.said={};
  const g=Lv.g,put=(c,r,ch)=>{g[r][c]=ch},plat=(c0,c1,r,ch)=>{for(let c=c0;c<=c1;c++)g[r][c]=ch||'='},box=(c0,c1,r0,r1)=>{for(let c=c0;c<=c1;c++)for(let r=r0;r<=r1;r++)g[r][c]='X'};
  for(let r=0;r<PLG;r++)for(let c=1;c<PLW-1;c++)g[r][c]='.';
  S2.props=[];const prop=(k,c0,c1,r0,o)=>{S2.props.push(Object.assign({k,c0,c1,r0},o||{}));if(k==='bench'||k==='horseDeck')plat(c0,c1,r0);else box(c0,c1,r0,PLG-1)};
  // ce qui est là à chaque passage : les arbres, les réverbères, la scène, les bancs, le plancher du manège
  for(const tr of PLX.trees)for(const[c0,c1,r]of tr.br)plat(c0,c1,r);
  for(const l of PLX.lamps){if(l.perch!=null)put(l.perch,5,'=');if(l.sp)for(const c of l.sp)put(c,5,'v')}
  for(const b of PLX.benches)prop('bench',b,b+1,11);
  box(PLX.stage.c0,PLX.stage.c1,10,11);plat(PLX.stage.c0,PLX.stage.c1,4);
  plat(PLX.car.c0,PLX.car.c1,11);plat(120,128,4);
  // les toits des maisonnettes : praticables aux deux premiers passages (la pluie empêche ensuite d'y monter)
  S2.chalets=n<=3?PLX.chalets.map(c=>Object.assign({},c,{closing:n===3&&['primeur','vins','fleurs'].includes(c.k)})):[];
  if(n<=2){for(const c of PLX.chalets)plat(c.c,c.c+3,8);plat(54,56,8);box(63,64,8,9);box(76,77,8,9)}
  const P1=n===1,P2=n===2,P3=n===3,P4=n===4;
  if(P1){prop('crate',2,2,10);prop('barrel',3,3,11)}
  if(P2){prop('crate',17,17,10);prop('crate',22,22,11);prop('crate',45,45,11);prop('basket',48,48,11);prop('crate',97,97,11);prop('crate',100,100,11)}
  if(P3){prop('crate',9,9,11,{tomates:1});prop('table',15,16,11);prop('crate',21,21,11);prop('crate',34,35,10);prop('crate',41,41,11);prop('crate',45,45,11);prop('crate',46,46,10);prop('van',49,53,9);prop('crate',58,58,11);prop('crate',88,88,11,{tomates:1});prop('crate',99,99,11);prop('pallet',112,113,11)}
  if(P4){prop('bin',12,12,11);prop('bin',47,47,11);prop('crate',101,101,11);prop('crate',118,118,11)}
  // les cartels du passage
  const cp={1:[[42.3,PLF],[66,10*T],[106.5,PLF]],2:[[106.5,PLF],[74,10*T],[42.3,PLF]],3:[[42.3,PLF],[66,10*T],[106.5,PLF]],4:[[106.5,PLF],[90.5,PLF]]}[n];
  Lv.cps=cp.map(([c,y])=>({x:c*T,y,on:false}));S2.start={x:(n%2?1.5:134)*T,y:PLF};
  S2.dir=n%2?1:-1;S2.endX=n===1||n===3?135.5*T:n===2?3.5*T:78.7*T;
  // les gens
  const R=mulberry(300+n*17);S2.crowd=[];
  const crowd=(a,b,k,o)=>{const nn=o&&o.n||Math.max(1,Math.round((b-a)*.9));for(let i=0;i<nn;i++){const x=((a+(b-a)*(nn===1?.5:i/(nn-1)))*T)+(R()-.5)*14,p=plPerson(R,k,x,Object.assign({},o||{},{a:a*T,b:b*T}));
    // à l'étal : certains parlent au marchand (de dos), les autres bavardent deux par deux, face à face
    if(k==='buy'||k==='eat'){p.back=R()<.42;p.f=i%2?-1:1}if(k==='dance')p.f=i%2?-1:1;if(k==='kid'){p.back=true;p.f=1}
    S2.crowd.push(p)}};
  if(P1){crowd(5.3,8.4,'buy',{n:4});crowd(12.6,17.4,'buy',{n:5});crowd(18.6,22.6,'buy',{n:4});crowd(29.7,33.6,'buy',{n:4});crowd(35.7,40.1,'buy',{n:5});crowd(44.3,47.6,'buy',{n:4});crowd(48.7,52.8,'buy',{n:4});
    crowd(53.7,56.3,'eat',{n:3});crowd(59.7,62.2,'dance',{n:4});crowd(78.4,79.2,'dance',{n:2});crowd(85.7,89.6,'buy',{n:4});crowd(91.7,95.6,'buy',{n:5});crowd(97.7,101.6,'buy',{n:4});crowd(108.7,112.6,'buy',{n:4});
    crowd(113.2,115.8,'buy',{n:3});crowd(117,132,'kid',{n:11})}
  if(P2){crowd(4.8,8.2,'buy',{n:3});crowd(12.8,15.5,'buy',{n:3});crowd(30,33.2,'buy',{n:2});crowd(36,39.8,'buy',{n:3});crowd(49,52.6,'buy',{n:3});crowd(53.9,56.2,'eat',{n:2});crowd(59.8,62,'dance',{n:3});
    crowd(86,89.4,'buy',{n:3});crowd(92.2,95.2,'buy',{n:2});crowd(109.3,110.8,'buy',{n:2});crowd(43.2,48.6,'walk',{n:1,item:'caisse'});crowd(18.2,23.2,'walk',{n:1})}
  if(P3){crowd(10.8,14.3,'walk',{n:1,item:'parapluie',sp:34});crowd(47.3,48.7,'walk',{n:1,item:'caisse',sp:40});crowd(89.3,95.6,'walk',{n:1,item:'parapluie',sp:34});for(const p of S2.crowd)if(p.item==='parapluie')p.h=104}
  // les chiens en laisse (le maître marche, le chien bondit au bout de sa laisse)
  S2.dogs=[];const dog=(a,b,col)=>{const o=plPerson(R,'owner',a*T,{a:a*T,b:b*T});S2.crowd.push(o);S2.dogs.push({o,x:a*T+40,y:PLF,vy:0,f:1,st:'walk',t:0,cool:0,col,bark:0})};
  if(P1){dog(23.6,26.6,'#c8a070');dog(79.4,84.4,'#3a3a3a')}
  if(P2)dog(79.6,84.6,'#c8a070');
  // les mouettes du poissonnier
  S2.gulls=[];if(P1||P2){const ng=P1?5:3;for(let i=0;i<ng;i++)S2.gulls.push({a:i*Math.PI*2/ng,x:38*T,y:110,st:'circle',t:0,cool:1+i*.7,f:1})}
  S2.diveCool=0;
  // abeilles : du nid (dans le premier platane) aux fleurs, et retour
  S2.bees=[];if(P1||P2)for(const[per,ph,path]of[[5.2,0,PL_BEE1],[5.2,.5,PL_BEE1],[6.4,.25,PL_BEE2]])S2.bees.push({path,per,ph,x:0,y:0,f:1});
  // écureuils
  S2.squirrels=[];if(P1||P2)for(const[i,col,ph]of[[0,'roux',0],[1,'gris',.5],[2,'roux',.25]])S2.squirrels.push({x:PLX.trees[i].x*T,top:PLF-292,bot:PLF-70,y:PLF-70-ph*200,d:-1,pause:ph,col,side:i%2?-1:1});
  // les grillades
  S2.grill={t:0,on:P1||P2};
  // le chat sur le toit des fleurs (2e passage) : un coup de patte si l'on passe trop près
  S2.roofCat=P2?{x:13.4*T,y:8*T,sw:0,cool:0}:null;
  // les toits pris par les pigeons (2e passage)
  S2.flocks=[];if(P2)for(const c0 of[19,44,98]){const fl={c0,c1:c0+3,birds:[]};const ks=['gros','moignon','deplume','gros','moignon','deplume'];
    for(let i=0;i<6;i++)fl.birds.push({k:ks[(i+c0)%6],hx:(c0+.85+i*.45)*T,x:(c0+.85+i*.45)*T,y:8*T,y0:8*T,vy:0,f:i%2?1:-1,st:'walk',t:i*.7,cool:i*.35,beg:0});S2.flocks.push(fl)}
  // chats errants (3e et 4e passages)
  S2.cats=[];const cat=(c,col,o)=>S2.cats.push(Object.assign({x:c*T,y:PLF,f:c%2?1:-1,t:c,col,eye:0,sw:0,cool:0,rr:0},o||{}));
  if(P3){cat(23.2,'#2a2a2e');cat(103.2,'#c87a3a',{stripes:true})}
  if(P4){cat(115.6,'#e8e2d8');cat(103.2,'#2a2a2e');cat(84.4,'#9a8a7a',{stripes:true})}
  // le hibou (3e passage), dans le troisième platane
  S2.owl=P3?{hx:104.5*T,hy:3*T,x:104.5*T,y:3*T,st:'perch',t:0,cool:1.2,f:-1,n:0}:null;
  // les rats (gérés par le moteur), bornés par des butées
  Lv.rats=[];Lv.mark=new Set();const rat=(a,b,x)=>{Lv.mark.add(a+',11');Lv.mark.add(b+',11');Lv.rats.push({kind:'rat',x:x*T-15,y:PLF-16,w:30,h:16,vx:95,vy:0,onGround:false,t:x*.37%9,sq:1+x%3,base:95})};
  if(P1)rat(78,86,82);
  if(P3){rat(10,26,18);rat(78,92,84);rat(110,133,122)}
  if(P4){rat(107,133,124);rat(91,105,98);rat(78,90,85);rat(110,133,116)}
  // les corbeaux du soir
  Lv.moths=[];S2.roofRat=P3?{a:86.3*T,b:89.6*T,x:87*T,f:1,pause:0}:null;
  // le manège : il tourne aux deux premiers passages, puis s'arrête
  S2.car={a:P3||P4?.9:0,w:P1||P2?Math.PI*2/11:0,on:P1||P2};
  Lv.movers=Lv.movers.filter(m=>m.kind!=='plh');for(let k=0;k<8;k++)Lv.movers.push({axis:'s',kind:'plh',k,x:-9999,y:0,w:44,h:10,t:0,dx:0,dy:0});
  S2.riders=P1||P2?[1,4,6]:[];
  plCarPlace(Lv,0);
  // la lumière
  Lv.darkNow=[0,0,.04,.34,.6][n];
  Lv.lights=[];
  if(P3||P4){for(const l of PLX.lamps){const lx=l.x*T;if(l.sp){Lv.lights.push({x:lx-36,y:170,r:P4?230:180,i:P4?.95:.75,warm:1},{x:lx+36,y:170,r:P4?230:180,i:P4?.95:.75,warm:1})}else Lv.lights.push({x:lx,y:216,r:P4?260:200,i:P4?.98:.8,warm:1})}
    if(P3)for(const c of S2.chalets)if(c.closing)Lv.lights.push({x:(c.c+2)*T,y:380,r:150,i:.7,warm:1});
    if(P4)Lv.lights.push({x:70*T,y:250,r:200,i:.6,warm:1})}
  S2.fog=P4;
}
/* ---------- une personne de la foule ---------- */
const PL_COAT=['#3a4a6a','#8a3a3a','#4a6a4a','#c8a040','#6a4a7a','#2a2e3a','#b85a3a','#5a7a9a','#e0d8c8','#7a6a52','#2a5a5a','#a84a6a','#d8c060','#3a6a8a'];
const PL_LEG=['#2a2c34','#3a3a4a','#4a3a2a','#2a3a5a','#5a4a3a','#1e2026'];
const PL_HAIR=['#3a2a1a','#6a4a2a','#c8a060','#8a8a8a','#e8e4dc','#1a1410','#9a5a2a'];
const PL_SKIN=['#f0d0b0','#e8c0a0','#d8a880','#c08860','#8a5a3a','#f4dcc4'];
function plPerson(R,kind,x,o){
  const kid=kind==='kid',fem=R()<.5,old=!kid&&R()<.18;
  const p={kind,x,x0:x,a:o.a,b:o.b,f:R()<.5?1:-1,ph:R()*9,sp:o.sp||(30+R()*25),amp:10+R()*10,swing:.6+R()*1,st:'stand',next:2+R()*7,wph:R()*6,back:false,
    must:!fem&&!kid&&R()<.3,glass:old||R()<.12,mood:R(),brow:(R()-.5)*1.6,
    h:kid?56+R()*12:old?104+R()*10:108+R()*20,fem,old,kid,coat:pick2(R,PL_COAT),leg:pick2(R,PL_LEG),hair:pick2(R,PL_HAIR),skin:pick2(R,PL_SKIN),
    hat:R()<.3?pick2(R,['beret','casquette','paille','foulard','bonnet']):null,item:o.item||(kind==='buy'?pick2(R,['panier','cabas','none','none','baguette','sac']):kind==='kid'?pick2(R,['ballon','glace','none','none']):kind==='eat'?'sandwich':null),
    walk:kind==='walk'||kind==='owner',dir:R()<.5?1:-1,bal:pick2(R,['#e83a3a','#3a8ae8','#e8c83a','#5ac85a','#e86ab0'])};
  if(old&&!p.hat)p.hat='beret';if(p.kind==='pack')p.item='caisse';
  return p}
function pick2(R,a){return a[Math.floor(R()*a.length)]}
const PL_BEE1=[[107.5,6.2],[108.2,6.9],[108.9,8.1],[109.6,9.6],[110.2,10.6],[110.9,10.8],[110.8,10.1],[109.9,8.7],[108.9,7.3],[108,6.5]].map(([c,r])=>[c*T,r*T]);
const PL_BEE2=[[107.5,6.2],[108.4,7.4],[109.1,9.1],[109.8,10.6],[110.6,10.9],[110.2,9.8],[109.3,8.1],[108.3,6.7]].map(([c,r])=>[c*T,r*T]);

/* ---------- le manège : 8 chevaux sur un cercle vu de biais ---------- */
function plCarAng(S2,k){return S2.car.a+k*Math.PI/4}
function plCarPlace(Lv,dt){const S2=Lv.pl,C=PLX.car;S2.car.a+=S2.car.w*dt;
  for(const m of Lv.movers){if(m.kind!=='plh')continue;const th=plCarAng(S2,m.k),z=Math.sin(th),px=m.x,py=m.y;
    const bob=S2.car.on?Math.sin(S2.car.a*3.2+m.k*1.7)*20:Math.sin(.9*3.2+m.k*1.7)*20;
    m.cx=C.cx-Math.cos(th)*C.R;m.z=z;m.bob=bob;m.sy=440-62+bob+z*16;
    const ride=z>.3&&!S2.riders.includes(m.k);
    if(ride){m.x=m.cx-m.w/2;m.y=m.sy;m.dx=px<-9000?0:m.x-px;m.dy=px<-9000?0:m.y-py}
    else{if(P.onMover===m&&Lv===L){P.onMover=null;P.onGround=false}m.x=-9999;m.y=0;m.dx=m.dy=0}}}

/* ---------- à chaque image ---------- */
function placeStep(dt){const S2=L.pl;if(!S2)return;S2.t+=dt;S2.beat+=dt;
  const pcx=P.x+P.w/2,pcy=P.y+P.h/2,hb={x:P.x+3,y:P.y+4,w:P.w-6,h:P.h-6},low=P.y+P.h>300;let hit=null;
  plCarPlace(L,dt);
  // la musique de l'orchestre : plus fort près de la scène
  if(typeof mGain!=='undefined'&&mGain){const tg=S2.pass<=2?.05+.08*clamp(1-Math.abs(pcx-70*T)/2600,0,1):.1;S2.mus=lerp(S2.mus,tg,Math.min(1,dt*2));mGain.gain.value=S2.mus}
  // la foule
  for(const p of S2.crowd){p.t=(p.t||0)+dt;
    if(p.walk){p.x+=p.dir*p.sp*dt;p.wph+=dt*p.sp*.16;if(p.x>p.b){p.x=p.b;p.dir=-1}if(p.x<p.a){p.x=p.a;p.dir=1}p.f=p.dir}
    else if(p.kind==='buy'||p.kind==='eat'){
      // debout, puis de temps en temps quelques pas (dans le sens de la marche), puis on se retourne vers l'étal ou vers quelqu'un
      if(p.st==='stand'){p.next-=dt;if(p.next<=0){const tx=clamp(p.x0+(rnd()*2-1)*p.amp*1.6,p.a,p.b);if(Math.abs(tx-p.x)>10){p.st='step';p.tx=tx;p.f=tx>p.x?1:-1;p.back=false}else p.next=1+rnd()*2}}
      else{const d=p.tx-p.x,v=38*dt;if(Math.abs(d)<=v){p.x=p.tx;p.st='stand';p.next=3+rnd()*6;p.back=rnd()<.45;if(!p.back&&rnd()<.5)p.f=-p.f}else{p.x+=Math.sign(d)*v;p.wph+=dt*38*.16}}}
    else if(p.kind==='dance'){p.x=p.x0+Math.sin(S2.beat*2.6+p.ph)*3}
    if(p.item==='parapluie'){p.dip=Math.max(0,(p.dip||0)-dt*2.4);p.surp=Math.max(0,(p.surp||0)-dt);const s=p.h/120,ux=p.x+p.f*14*s,uy=PLF-152*s+(p.dip||0)*8*s,fb=P.y+P.h;
      if(!P.dead&&P.vy>0&&P.x+P.w-4>ux-44&&P.x+4<ux+44&&fb>=uy-6&&fb-P.vy*dt<=uy+12){P.y=uy-P.h;P.vy=-640;P.jumping=false;P.onGround=false;P.flaps=0;p.dip=1;p.surp=1.4;P.sx=.8;P.sy=1.2;if(!G.sim){tone(220,.12,'triangle',.06,520);bubble(p.x,PLF-p.h-50,pick(['Oh !','Hé !','Mais…!']),'#3a3a4a')}}}
    if(!p.safe&&!P.dead&&low&&overlap(hb,{x:p.x-(p.kid?9:11),y:PLF-p.h+8,w:p.kid?18:22,h:p.h-8}))hit='foule'}
  // les chiens en laisse
  for(const d of S2.dogs){const o=d.o;d.t+=dt;d.cool-=dt;d.bark-=dt;
    const near=!P.dead&&Math.abs(pcx-d.x)<230&&P.y+P.h>290&&Math.abs(pcx-o.x)<330;
    if(d.st==='walk'){const tx=o.x+o.dir*46;d.x+=clamp(tx-d.x,-140*dt,140*dt);d.f=o.dir;if(near&&d.cool<=0){d.st='lunge';d.t=0;d.f=pcx>d.x?1:-1;if(!G.sim){tone(240,.1,'square',.05,170);bubble(d.x,PLF-60,'Wouf !','#6a3a22')}}}
    else if(d.st==='lunge'){const tx=clamp(pcx,o.x-160,o.x+160);d.x+=clamp(tx-d.x,-300*dt,300*dt);d.f=tx>d.x?1:-1;
      if(Math.abs(pcx-d.x)<56&&d.y>=PLF-.5&&P.y+P.h<PLF-20){d.st='leap';d.vy=-620;if(!G.sim)tone(300,.08,'square',.05,200)}
      if(d.t>2.4||!near){d.st='walk';d.cool=.6}}
    if(d.st==='leap'){d.vy+=1800*dt;d.y+=d.vy*dt;if(d.y>=PLF){d.y=PLF;d.vy=0;d.st='walk';d.cool=1}}
    if(!P.dead&&overlap(hb,{x:d.x-22,y:d.y-38,w:44,h:36}))hit='chienLaisse'}
  // les mouettes : elles tournent au-dessus du poissonnier, et piquent sur l'étal quand on passe
  S2.diveCool-=dt;const fx=38*T;
  for(const m of S2.gulls){m.t+=dt;m.cool-=dt;
    if(m.st==='circle'){m.a+=dt*.9;const nx=fx+Math.cos(m.a)*190,ny=96+Math.sin(m.a)*34;m.f=nx>m.x?1:-1;m.x=nx;m.y=ny;
      if(Math.abs(pcx-fx)<430&&m.cool<=0&&S2.diveCool<=0&&!P.dead){m.st='hover';m.t=0;m.hx=m.x;m.hy=m.y;S2.diveCool=1.9;if(!G.sim)gullCry(Math.abs(m.x-pcx)<500?1:.5)}}
    else if(m.st==='hover'){m.x=m.hx+Math.sin(m.t*30)*1.2;m.y=m.hy+Math.sin(m.t*14)*2;m.f=fx>m.x?1:-1;if(m.t>=.5){m.st='dive';m.t=0;m.sx=m.x;m.sy=m.y;m.tx=fx-50+((m.a*97)%100);m.ty=414;m.ex=m.x+(m.x<fx?380:-380);m.ey=130}}
    else if(m.st==='dive'){const u=Math.min(1,m.t/1.35),a=(1-u)*(1-u),b=2*(1-u)*u,c=u*u,mx=2*m.tx-.5*(m.sx+m.ex),my=2*m.ty-.5*(m.sy+m.ey),px=m.x;
      m.x=a*m.sx+b*mx+c*m.ex;m.y=a*m.sy+b*my+c*m.ey;m.f=m.x>px?1:-1;if(u>=1){m.st='back';m.t=0;m.bx=m.x;m.by=m.y}
      if(!P.dead&&overlap(hb,{x:m.x-16,y:m.y-8,w:32,h:16}))hit='mouette'}
    else if(m.st==='back'){const u=Math.min(1,m.t/1.6);const nx=fx+Math.cos(m.a)*190,ny=96+Math.sin(m.a)*34;m.a+=dt*.9;const px=m.x;m.x=lerp(m.bx,nx,u);m.y=lerp(m.by,ny,u);m.f=m.x>px?1:-1;if(u>=1){m.st='circle';m.cool=2.4}}}
  // les abeilles
  for(const b of S2.bees){const u=(S2.t/b.per+b.ph)%1,[x,y]=cwAt(b.path,u),[x2]=cwAt(b.path,(u+.01)%1);b.f=x2>=x?1:-1;b.x=x+Math.sin(S2.t*9+b.ph*20)*4;b.y=y+Math.sin(S2.t*13+b.ph*30)*3;
    if(!P.dead&&overlap(hb,{x:b.x-6,y:b.y-5,w:12,h:10}))hit='abeille'}
  // les écureuils
  for(const s of S2.squirrels){if(s.pause>0)s.pause-=dt;else{s.y+=s.d*165*dt;if(s.y<s.top){s.y=s.top;s.d=1;s.pause=.9}if(s.y>s.bot){s.y=s.bot;s.d=-1;s.pause=1.1}}
    if(!P.dead&&overlap(hb,{x:s.x-11,y:s.y-15,w:22,h:30}))hit='ecureuil'}
  // les grillades : ça grésille, puis les flammes jaillissent
  {const gr=S2.grill;if(gr.on){gr.t+=dt;const u=gr.t%3.1;gr.ph=u<1.5?'idle':u<2.1?'warn':u<2.9?'burst':'idle';
    if(gr.ph==='burst'&&gr.last!=='burst'&&!G.sim&&Math.abs(pcx-56*T)<900){noise(.6,2600,.07,'bandpass');noise(.35,5200,.04,'highpass',.08)}
    // le cuisinier ne crie qu'une fois les flammes bien hautes
    if(gr.ph==='burst'&&u>2.35&&!gr.yelled){gr.yelled=1;if(!G.sim&&Math.abs(pcx-56*T)<900)bubble(56.9*T,PLF-160,pick(['Oh là !','Au feu !','Mes merguez !','Pas encore !']),'#2a2420')}
    if(gr.ph!=='burst')gr.yelled=0;
    if(gr.ph==='warn'&&gr.last!=='warn'&&!G.sim&&Math.abs(pcx-56*T)<900)noise(.5,4200,.03,'highpass');
    gr.last=gr.ph;if(gr.ph==='burst'&&!P.dead){const k=Math.min(1,(u-2.1)/.25);if(overlap(hb,{x:57*T+4,y:PLF-70-k*190,w:1.6*T-8,h:70+k*190-30}))hit='grill'}}}
  // le chat du toit
  {const k=S2.roofCat;if(k){k.cool-=dt;if(k.sw>0)k.sw-=dt;if(k.cool<=0&&Math.abs(pcx-k.x)<70&&P.y<k.y+20&&P.y>k.y-110){k.sw=.45;k.cool=1.5;if(!G.sim)noise(.15,2400,.06,'bandpass')}
    if(k.sw>0&&k.sw<.3&&!P.dead&&overlap(hb,{x:k.x-44,y:k.y-42,w:88,h:42}))hit='chatToit'}}
  // les pigeons des toits : ils chassent qui s'y pose, et sautent au passage de qui les survole
  for(const fl of S2.flocks){const x0=fl.c0*T,x1=(fl.c1+1)*T,over=pcx>x0-40&&pcx<x1+40&&P.y+P.h<=8*T+4&&!P.dead,onRoof=P.onGround&&!P.dead&&Math.abs(P.y+P.h-8*T)<3&&pcx>x0-6&&pcx<x1+6;
    if(onRoof&&!fl.angry){fl.angry=1.6;if(!G.sim){SFX.coo();bubble((x0+x1)/2,8*T-60,pick(['Krrr ! Dégage !','Rrou ! Chez nous !','Wesh ! Pas ici !']),'#6a4a4a')}}
    if(fl.angry>0)fl.angry-=dt;
    for(const b of fl.birds){b.t+=dt;b.cool-=dt;
      if(b.st==='hop'){b.vy+=1500*dt;b.y+=b.vy*dt;if(b.y>=b.y0){b.y=b.y0;b.vy=0;b.st='walk';b.cool=1.4}}
      else if(fl.angry>0){b.st='run';b.f=pcx>b.x?1:-1;b.x+=b.f*200*dt}
      else{b.st='walk';b.x+=b.f*22*dt;if(Math.abs(b.x-b.hx)>24)b.f=b.x>b.hx?-1:1}
      b.x=clamp(b.x,x0+30,x1-36);
      if(b.st!=='hop'&&pcx>x0+20&&pcx<x1-20&&P.vy<80&&over&&!onRoof&&b.cool<=0&&Math.abs(pcx-b.x)<64&&P.y+P.h<b.y0-10&&P.y+P.h>b.y0-200){b.st='hop';b.vy=-680;b.cool=1.6;if(!G.sim)SFX.flap()}
      if(!P.dead&&overlap(hb,{x:b.x-12,y:b.y-24,w:24,h:22}))hit='pigeonsToit'}}
  // les chats errants : ils dorment roulés en boule, ouvrent les yeux quand on approche, griffent qui s'arrête à côté
  for(const c of S2.cats){c.t+=dt;const dx=pcx-c.x,near=Math.abs(dx);
    c.eye=lerp(c.eye,!P.dead&&near<170&&P.y+P.h>PLF-200?1:0,Math.min(1,dt*(near<170?5:1.5)));c.cool-=dt;c.rr-=dt;if(c.sw>0)c.sw-=dt;
    if(c.eye<.3&&near<260&&c.rr<=0&&!G.sim){bubble(c.x,c.y-34,'rrrr…','#8a6a4a');c.rr=2.2}
    if(c.eye>.8&&c.cool<=0&&near<50&&P.y+P.h>PLF-46&&!P.dead){c.sw=.55;c.cool=1.6;c.f=dx>0?1:-1;if(!G.sim)SFX.hiss()}
    if(!P.dead&&(overlap(hb,{x:c.x-20,y:c.y-20,w:40,h:20})||(c.sw>0&&c.sw<.3&&overlap(hb,{x:c.x+c.f*12-34,y:c.y-34,w:68,h:34}))))hit='chatRue'}
  {const r=S2.roofRat;if(r){if(r.pause>0)r.pause-=dt;else{r.x+=r.f*70*dt;if(r.x>r.b){r.x=r.b;r.f=-1;r.pause=1.2}if(r.x<r.a){r.x=r.a;r.f=1;r.pause=1.5}}}}
  // le hibou : un hululement, les yeux qui s'ouvrent, une seconde, puis le piqué
  {const o=S2.owl;if(o){o.t+=dt;o.cool-=dt;
    if(o.st==='perch'){o.x=o.hx;o.y=o.hy;const dx=pcx-o.hx,dy=pcy-o.hy;if(o.cool<=0&&!P.dead&&Math.abs(dx)<320&&dy>30&&dy<440){o.st='warn';o.t=0;o.f=dx>0?1:-1;o.n++;if(!G.sim){tone(330,.3,'sine',.05,300);setTimeout(()=>tone(290,.5,'sine',.05,262),360);bubble(o.hx,o.hy-50,'Hou-hou…','#5a4a3a')}}}
    else if(o.st==='warn'){if(o.t>1){o.st='dive';o.t=0;const off=(o.n%2?1:-1)*40;o.tx=pcx;o.ty=pcy+off;o.sx=o.hx;o.sy=o.hy;o.ex=pcx+o.f*280;o.ey=o.hy+60}}
    else if(o.st==='dive'){const u=Math.min(1,o.t/1.15),a=(1-u)*(1-u),b=2*(1-u)*u,c=u*u,mx=2*o.tx-.5*(o.sx+o.ex),my=2*o.ty-.5*(o.sy+o.ey);o.x=a*o.sx+b*mx+c*o.ex;o.y=a*o.sy+b*my+c*o.ey;
      if(u>=1){o.st='back';o.t=0;o.bx=o.x;o.by=o.y}if(!P.dead&&overlap(hb,{x:o.x-16,y:o.y-10,w:32,h:20}))hit='hibou'}
    else if(o.st==='back'){const u=Math.min(1,o.t/1.3),e=u*u*(3-2*u);o.x=lerp(o.bx,o.hx,e);o.y=lerp(o.by,o.hy,e)-Math.sin(u*Math.PI)*50;o.f=o.hx>o.bx?1:-1;if(u>=1){o.st='perch';o.cool=2.6}}}}
  // la pluie goutte des plumes
  if(S2.rain&&!G.sim&&!P.dead&&rnd()<dt*6)parts.push({type:'drop',x:P.x+P.w/2+(rnd()-.5)*16,y:P.y+P.h-6,vx:(rnd()-.5)*30,vy:20,life:0,max:.5,sz:.4});
  if(hit)S2.hit=hit;
  // répliques
  const once=(k,c,txt,d)=>{if(!S2.said[k]&&c){S2.said[k]=1;say(txt,d||3.8)}};
  if(S2.pass===1){once('foule',pcx>5*T,"Du monde partout. Par les toits, ce sera plus sûr. Et de là-haut, je la verrai mieux.",3.8);
    once('pics',pcx>15.5*T,"Des pics sur les réverbères. Contre les pigeons. Sauter là-dessous, ce serait s'embrocher.",3.8);
    once('mouettes',pcx>33*T,"Des mouettes, si loin de la mer. Elles ont flairé le poissonnier.",3.6);
    once('grill',pcx>51*T,"Des grillades. Le cuisinier a plus peur de son feu que moi.",3.4);
    once('bal',pcx>61*T,"Un orchestre ! Lucien dansait si mal. Marguerite riait si fort.",3.8);
    once('manege',pcx>112*T,"Des chevaux de bois ! Comme à la foire de Coulommiers. Ils tournent, ils montent, ils descendent.",4)}
  if(S2.pass===2){once('pig',pcx<110*T,"Les pigeons du coin ont pris les toits. Ils ne partagent pas.",3.4);once('chat',pcx<19*T,"Un chat sur le toit du marchand de miel. Article 3 : en cas de chat… le contourner, par le haut.",4)}
  if(S2.pass===3){once('vide',pcx>58*T,"Les musiciens sont partis. Les marchands remballent. Et toujours pas de Marguerite.",3.8);once('hibou',pcx>98*T,"Un hibou. Il a l'œil sur moi. Les deux yeux, même.",3.4)}
  // fin du passage
  if(!S2.seq&&!P.dead&&(S2.dir>0?pcx>S2.endX:pcx<S2.endX)){if(S2.pass<4)S2.seq={k:'pass',t:0,next:S2.pass+1};else S2.seq={k:'end',t:0,x0:P.x};P.vx=0;G.quip=null;G.quipQ=[]}
}
function gullCry(v){for(let k=0;k<3;k++){const f0=1250-k*60+rnd()*80;formantCry({delay:k*.17,d:.15+(k===2?.08:0),v:.42*(v||1),wave:'sawtooth',f:[[0,f0*.82],[.18,f0*1.12],[.55,f0],[1,f0*.7]],vib:[34,40],
  formants:[[[[0,1500],[.3,2300],[1,1500]],3.5,1],[[[0,3100],[.3,3600],[1,2700]],6,.45]]})}}
function placeAfterMove(){const S2=L.pl;if(!S2)return null;if(S2.hit){const h=S2.hit;S2.hit=null;return h}return null}
function placeRespawn(){const S2=L.pl;if(!S2)return;S2.hit=null;
  for(const d of S2.dogs){d.st='walk';d.y=PLF;d.vy=0;d.cool=1.2}
  for(const m of S2.gulls){m.st='circle';m.cool=1.5}S2.diveCool=1.2;
  for(const c of S2.cats){c.sw=0;c.cool=1;c.eye=0}
  for(const fl of S2.flocks){fl.angry=0;for(const b of fl.birds){b.st='walk';b.y=b.y0;b.x=b.hx;b.cool=1}}
  if(S2.owl){const o=S2.owl;o.st='perch';o.x=o.hx;o.y=o.hy;o.cool=1.5}
  if(S2.roofCat)S2.roofCat.cool=1;
  if(S2.grill)S2.grill.t=0;
}
function placeTiles(){const sv=[];for(let r=0;r<ROWS;r++)for(let c=0;c<L.w;c++){const ch=L.g[r][c];if(ch!=='#'&&ch!=='.'){sv.push([c,r,ch]);L.g[r][c]='.'}}
  for(let r=PLG;r<ROWS;r++){sv.push([0,r,L.g[r][0]],[L.w-1,r,L.g[r][L.w-1]]);L.g[r][0]=L.g[r][L.w-1]='#'}
  const t=buildTilesF(L);for(const[c,r,ch]of sv)L.g[r][c]=ch;return t}

/* ---------- les ellipses entre les passages, et la fin ---------- */
function placeSeqStep(dt){const S2=L.pl,q=S2.seq;q.t+=dt;G.lt+=dt;P.vx=0;
  if(q.k==='pass'){P.vy=Math.min(MAXFALL,P.vy+GRAV*dt);P.onGround=false;moveY(P,P.vy*dt);
    if(q.t>=1.1&&!q.done){q.done=1;placeGoPass(q.next)}
    if(q.t>5.4)S2.seq=null;
    return}
  if(q.k==='end'){const e=q;P.onGround=false;P.vy=Math.min(MAXFALL,P.vy+GRAV*dt);
    // il fait encore quelques pas vers la scène, puis s'arrête
    P.facing=-1;moveY(P,P.vy*dt);
    const z=L.zoom||(L.zoom={z:1,fx:P.x+P.w/2,fy:P.y});const rx=P.x+P.w/2,ry=P.y+P.h/2-10,bx=70.5*T,by=226;
    // intertitre, zoom sur Raymond, il lève la tête, la caméra monte jusqu'à la banderole ; puis le noir et les intertitres, sans revenir à l'image
    if(e.t<6.6){z.z=1;z.fx=cam.x+W/2;z.fy=cam.y+H/2}
    else if(e.t<10.2){const u=Math.min(1,(e.t-6.6)/2.2),k=u*u*(3-2*u);z.z=lerp(1,2.3,k);z.fx=lerp(cam.x+W/2,rx,k);z.fy=lerp(cam.y+H/2,ry,k)}
    else if(e.t<15.6){const u=Math.min(1,(e.t-10.2)/2.4),k=u*u*(3-2*u);z.z=lerp(2.3,1.95,k);z.fx=lerp(rx,bx,k);z.fy=lerp(ry,by,k)}
    P.spin=e.t>8.4&&e.t<15.6?-.38*Math.min(1,(e.t-8.4)/.5):0;
    if(e.t>33.8){S2.seq=null;L.zoom=null;P.spin=0;winLevel()}
  }
}
function placeSkip(){const q=L.pl&&L.pl.seq;if(!q)return;if(q.k==='pass'){if(q.t>1.6&&q.t<4.6)q.t=4.6}
  else if(q.k==='end'){const marks=[1.4,6.6,10.2,15.2,20.4,24.6,29.2,33.8];for(const m of marks)if(q.t<m-.05&&q.t>1){q.t=m;break}}}
function placeGoPass(n){const S2=L.pl;plSetPass(L,n);
  P.cp={x:S2.start.x,y:S2.start.y};resetPlayer();P.facing=S2.dir;P.wake=0;
  cam.x=clamp(P.x+P.w/2-W/2+P.facing*70,0,L.wpx-W);
  setSong(n===2?'pl-java':'silence');G.quip=null;G.quipQ=[];G.bubbles=[];parts.length=0;
  setTimeout(()=>{if(L&&L.pl===S2&&S2.pass===n)say(PL_START[n],5)},4500)}

/* ---------- fond : le ciel, les maisons de la place, la mairie ---------- */
const PLACE_BG={win:[],ridge:[]};
function placeFar(L,g,wpx,R){
  const sk=L.th.sky,gr=g.createLinearGradient(0,0,0,480);gr.addColorStop(0,sk[0]);gr.addColorStop(.62,sk[1]);gr.addColorStop(1,sk[2]);g.fillStyle=gr;g.fillRect(0,0,wpx,600);
  const sx=wpx*.42;const sg=g.createRadialGradient(sx,140,6,sx,140,240);sg.addColorStop(0,'rgba(255,250,225,.8)');sg.addColorStop(1,'rgba(255,250,225,0)');g.fillStyle=sg;g.fillRect(sx-240,-100,480,480);g.fillStyle='#fffbe8';g.beginPath();g.arc(sx,140,24,0,7);g.fill();
  for(let k=0;k<wpx/200;k++){const x=R()*wpx,y=50+R()*140,w=80+R()*150;g.fillStyle='rgba(255,255,255,.78)';g.beginPath();g.ellipse(x,y,w,15,0,0,7);g.ellipse(x-w*.3,y-11,w*.42,18,0,0,7);g.ellipse(x+w*.25,y-15,w*.34,20,0,0,7);g.fill();g.fillStyle='rgba(200,214,232,.5)';g.beginPath();g.ellipse(x+6,y+7,w*.9,6,0,0,7);g.fill()}
  const far=mix(sk[1],'#5a6a6a',.5),near=mix(sk[1],'#3a4a40',.62);
  hills(g,wpx,392,22,mix(sk[2],far,.55),R,.005);
  // au loin : les toits du bourg, la collégiale de La Chapelle et son clocher
  for(let x=-20;x<wpx;){const w=40+R()*46,h=26+R()*22;g.fillStyle=mix(far,'#e8dcc8',.35);g.fillRect(x,410-h,w,h);g.fillStyle=mix(far,'#9a5a44',.35);poly(g,[x-3,410-h,x+w/2,410-h-w*.38,x+w+3,410-h]);g.fill();x+=w+2+R()*16}
  {const x=wpx*.66,b=410,c=mix(far,'#9a988a',.3);g.fillStyle=c;g.fillRect(x,b-80,200,80);poly(g,[x-6,b-80,x+100,b-122,x+206,b-80]);g.fill();g.fillRect(x+160,b-160,36,160);poly(g,[x+156,b-160,x+178,b-214,x+200,b-160]);g.fill();g.fillStyle='rgba(0,0,0,.15)';for(let k=0;k<5;k++)g.fillRect(x+16+k*30,b-62,7,24)}
  for(let x=0;x<wpx;x+=24+R()*26){g.fillStyle=mix(near,'#000000',R()*.12);g.beginPath();g.arc(x,424-R()*12,16+R()*14,0,7);g.fill()}
  const hz=g.createLinearGradient(0,300,0,600);hz.addColorStop(0,rgba(L.th.fog,0));hz.addColorStop(1,rgba(L.th.fog,.4));g.fillStyle=hz;g.fillRect(0,300,wpx,300);
}
/* les maisons qui bordent la place : deux ou trois étages, volets, lucarnes, cheminées, commerces au rez-de-chaussée ; la mairie au milieu */
function placeMidLayer(L,g,wpx,R){const rec=!PLACE_BG.win.length,base=525;
  const MX=1884,MW=440;
  const shop=['BOULANGERIE','CAFÉ DE LA PLACE','PHARMACIE','TABAC','BOUCHERIE','QUINCAILLERIE','LIBRAIRIE','COIFFURE','BAR DES SPORTS','CRÉDIT AGRICOLE','FLEURISTE','AUTO-ÉCOLE','PRESSE','OPTIQUE'];
  let si=0;
  for(let x=-30;x<wpx;){
    if(x+260>MX-MW/2-20&&x<MX+MW/2+10){x=MX+MW/2+14;continue}
    const fl=2+(R()<.45?1:0),w=150+R()*90,h=fl*68+40,wall=pick2(R,['#efe6d2','#e8dcc0','#f2ece0','#e2d2b4','#ece0cc','#dcd0bc','#f0e2c8']),
      sh=pick2(R,['#7a8a9a','#5a7a8a','#8a9aa0','#6a7a6a','#9a8a7a','#a8b0b4']),roof=R()<.6?'#5a6070':'#9a5a3e';
    plTownHouse(g,x,base,w,h,fl,wall,sh,roof,R,shop[si++%shop.length],rec);
    x+=w+(R()<.3?0:2+R()*6)}
  plMairie(g,MX,base,MW,rec);
}
function plTownHouse(g,x,b,w,h,fl,wall,sh,roof,R,sign,rec){
  const top=b-h;g.fillStyle=wall;g.fillRect(x,top,w,h);
  g.fillStyle='rgba(0,0,0,.06)';g.fillRect(x+w-6,top,6,h);g.fillStyle='rgba(255,255,255,.1)';g.fillRect(x,top,4,h);
  // le bandeau entre les étages, le soubassement
  g.fillStyle=shade(wall,-.08);for(let k=1;k<=fl;k++)g.fillRect(x,b-40-k*68+64,w,4);g.fillStyle=shade(wall,-.18);g.fillRect(x,b-12,w,12);
  // la toiture : un brisis, des lucarnes, des cheminées
  const rh=34+R()*18;g.fillStyle=roof;poly(g,[x-6,top,x+10,top-rh,x+w-10,top-rh,x+w+6,top]);g.fill();
  g.fillStyle='rgba(0,0,0,.12)';for(let y=top-rh+6;y<top;y+=6)g.fillRect(x,y,w,1);g.fillStyle=shade(roof,-.25);g.fillRect(x-6,top-2,w+12,4);
  if(rec)PLACE_BG.ridge.push({x0:x+16,x1:x+w-16,y:top-rh});
  const nd=Math.max(1,Math.floor((w-40)/70));for(let k=0;k<nd;k++){const dx=x+30+k*((w-60)/Math.max(1,nd-1||1))-(nd===1?-(w-60)/2+12:0),dy=top-rh+8;
    g.fillStyle=wall;g.fillRect(dx-11,dy,22,rh-10);g.fillStyle=roof;poly(g,[dx-15,dy+2,dx,dy-12,dx+15,dy+2]);g.fill();g.fillStyle='#3a4250';g.fillRect(dx-6,dy+5,12,rh-18)}
  for(let k=0;k<1+(R()<.5?1:0);k++){const cx=x+20+R()*(w-40);g.fillStyle='#a8705a';g.fillRect(cx-8,top-rh-24,16,26);g.fillStyle='#7a4a3a';g.fillRect(cx-10,top-rh-26,20,4);g.fillStyle='#9a6a5a';g.fillRect(cx-5,top-rh-30,4,5);g.fillRect(cx+2,top-rh-30,4,5)}
  // les fenêtres et leurs volets
  const nw=Math.max(2,Math.floor(w/52));for(let f=0;f<fl;f++)for(let k=0;k<nw;k++){const wx=x+(w/nw)*(k+.5)-11,wy=b-40-(f+1)*68+14;
    g.fillStyle='#3a4454';g.fillRect(wx,wy,22,34);g.strokeStyle='#f4f0e6';g.lineWidth=1.6;g.strokeRect(wx,wy,22,34);g.beginPath();g.moveTo(wx+11,wy);g.lineTo(wx+11,wy+34);g.moveTo(wx,wy+15);g.lineTo(wx+22,wy+15);g.stroke();
    g.fillStyle='rgba(255,255,255,.18)';g.fillRect(wx+2,wy+2,7,10);
    if(R()<.85){g.fillStyle=sh;g.fillRect(wx-10,wy-1,9,36);g.fillRect(wx+23,wy-1,9,36);g.fillStyle='rgba(0,0,0,.18)';for(let j=0;j<5;j++){g.fillRect(wx-10,wy+3+j*7,9,1);g.fillRect(wx+23,wy+3+j*7,9,1)}}
    if(f===0&&R()<.4){g.fillStyle='#2a2a2a';g.fillRect(wx-4,wy+30,30,3);for(let j=0;j<6;j++)g.fillRect(wx-3+j*5,wy+24,1.5,8);for(let j=0;j<4;j++){g.fillStyle=pick2(R,['#d83a3a','#e86aa0','#f2f0e8']);g.beginPath();g.arc(wx+j*7,wy+23,3,0,7);g.fill()}}
    if(rec)PLACE_BG.win.push({x:wx,y:wy,w:22,h:34,on:R()<.45,warm:R()})}
  // le commerce
  {const sy=b-40,sx=x+8,sw=w-16;g.fillStyle=shade(wall,-.35);g.fillRect(sx,sy-8,sw,48);g.fillStyle='#2a3440';g.fillRect(sx+6,sy+4,sw*.55,32);g.fillRect(sx+sw*.66,sy+4,sw*.26,36);
    g.fillStyle='rgba(255,255,255,.2)';g.fillRect(sx+8,sy+6,sw*.2,12);
    g.fillStyle=shade(wall,-.5);g.fillRect(sx,sy-22,sw,16);g.fillStyle='#f2ecd8';g.font='bold 10px '+F_DISP;g.textAlign='center';fitText(g,sign,x+w/2,sy-10,sw-10,10);
    if(sign==='PHARMACIE'){g.fillStyle='#2aa84a';g.fillRect(x+w-14,sy-46,6,18);g.fillRect(x+w-20,sy-40,18,6)}
    if(sign==='TABAC'){g.fillStyle='#c8302a';poly(g,[x+w-12,sy-48,x+w-4,sy-40,x+w-12,sy-32,x+w-20,sy-40]);g.fill()}
    if(R()<.5){g.fillStyle=pick2(R,['#c8402a','#2a6a4a','#3a5a8a','#a8862a']);for(let k=0;k<Math.floor(sw/14);k++){g.fillStyle=k%2?'#f2ece0':g.fillStyle;poly(g,[sx+k*14,sy-6,sx+k*14+14,sy-6,sx+k*14+12,sy+4,sx+k*14+2,sy+4]);g.fill();g.fillStyle=pick2(R,['#c8402a','#2a6a4a','#3a5a8a'])}}}
}
function plMairie(g,cx,b,w,rec){const x=cx-w/2,h=250,top=b-h;
  g.fillStyle='#ece4d0';g.fillRect(x,top,w,h);g.fillStyle='#d8ccb0';for(let k=0;k<7;k++)g.fillRect(x,top+18+k*34,w,3);
  g.fillStyle='rgba(0,0,0,.07)';g.fillRect(x,top,10,h);g.fillRect(x+w-10,top,10,h);
  // toit d'ardoise à lucarnes, campanile
  g.fillStyle='#4e5466';poly(g,[x-12,top,x+30,top-70,x+w-30,top-70,x+w+12,top]);g.fill();g.fillStyle='rgba(0,0,0,.12)';for(let y=top-64;y<top;y+=7)g.fillRect(x-6,y,w+12,1);
  for(let k=0;k<5;k++){const lx=x+50+k*(w-100)/4;if(k===2)continue;g.fillStyle='#ece4d0';poly(g,[lx-12,top-6,lx-12,top-38,lx,top-50,lx+12,top-38,lx+12,top-6]);g.fill();g.fillStyle='#3a4050';g.fillRect(lx-6,top-34,12,24)}
  if(rec)PLACE_BG.ridge.push({x0:x+40,x1:x+w-40,y:top-70});
  // l'avant-corps central : fronton, horloge, campanile, drapeaux
  const aw=130;g.fillStyle='#f2ead8';g.fillRect(cx-aw/2,top-30,aw,h+30);poly(g,[cx-aw/2-8,top-30,cx,top-84,cx+aw/2+8,top-30]);g.fill();
  g.strokeStyle='#c8bca0';g.lineWidth=2;poly(g,[cx-aw/2-8,top-30,cx,top-84,cx+aw/2+8,top-30]);g.stroke();
  g.fillStyle='#f8f4e8';g.beginPath();g.arc(cx,top-48,16,0,7);g.fill();g.strokeStyle='#2a2a2a';g.lineWidth=1.6;g.beginPath();g.arc(cx,top-48,16,0,7);g.stroke();
  g.beginPath();g.moveTo(cx,top-48);g.lineTo(cx,top-59);g.moveTo(cx,top-48);g.lineTo(cx+8,top-46);g.stroke();
  g.fillStyle='#5a6070';g.fillRect(cx-14,top-122,28,38);poly(g,[cx-20,top-122,cx,top-150,cx+20,top-122]);g.fill();g.fillStyle='#2a2e36';g.beginPath();g.arc(cx,top-102,7,Math.PI,0);g.fill();g.fillRect(cx-7,top-102,14,12);
  g.strokeStyle='#3a3a3a';g.lineWidth=1.4;g.beginPath();g.moveTo(cx,top-150);g.lineTo(cx,top-166);g.stroke();
  for(const s of[-1,1]){const fx=cx+s*40;g.strokeStyle='#3a3a3a';g.lineWidth=1.6;g.beginPath();g.moveTo(fx,top+20);g.lineTo(fx+s*26,top-8);g.stroke();for(const[k,col]of[[0,'#2a4a9a'],[1,'#f4f4f4'],[2,'#d8302a']]){g.fillStyle=col;g.save();g.translate(fx+s*26,top-8);g.rotate(s*.35);g.fillRect(s>0?k*7:-21+k*7,0,7,14);g.restore()}}
  g.fillStyle='#2a2e3a';g.font='bold 15px '+F_DISP;g.textAlign='center';g.fillText('MAIRIE',cx,top-6);
  g.font='italic 8px '+F_BODY;g.fillStyle='#4a4e5a';g.fillText('Liberté · Égalité · Fraternité',cx,top+10);
  // fenêtres hautes, porte, perron
  for(let r=0;r<2;r++)for(let k=0;k<8;k++){const wx=x+22+k*(w-44)/7-12;if(Math.abs(wx+12-cx)<aw/2+6)continue;const wy=top+34+r*82;
    g.fillStyle='#3a4454';g.fillRect(wx,wy,24,52);g.strokeStyle='#f6f2e8';g.lineWidth=1.6;g.strokeRect(wx,wy,24,52);g.beginPath();g.moveTo(wx+12,wy);g.lineTo(wx+12,wy+52);g.moveTo(wx,wy+18);g.lineTo(wx+24,wy+18);g.moveTo(wx,wy+36);g.lineTo(wx+24,wy+36);g.stroke();
    g.fillStyle='#e8dcc4';g.fillRect(wx-3,wy-6,30,5);if(rec)PLACE_BG.win.push({x:wx,y:wy,w:24,h:52,on:r===0&&k%3===0,warm:.5})}
  for(let r=0;r<2;r++){const wy=top+30+r*82;g.fillStyle='#3a4454';rr(g,cx-16,wy,32,58,14);g.fill();g.strokeStyle='#f6f2e8';g.lineWidth=1.6;rr(g,cx-16,wy,32,58,14);g.stroke()}
  g.fillStyle='#5a3a26';rr(g,cx-20,b-74,40,62,16);g.fill();g.fillStyle='#c8b070';g.beginPath();g.arc(cx+10,b-44,2.4,0,7);g.fill();
  g.fillStyle='#d4c8ae';g.fillRect(cx-46,b-12,92,6);g.fillRect(cx-56,b-6,112,6);
}

/* ---------- au monde : derrière la rue ---------- */
function drawPlaceBack(t,cx){const S2=L.pl;if(!S2)return;const g=ctx,cy=cam.y,n=S2.pass,vis=(a,b)=>b>cx-260&&a<cx+W+260;
  // la lumière du moment : après-midi, soir de pluie, nuit
  const tint=[null,null,'rgba(255,170,90,.13)','rgba(48,54,76,.58)','rgba(6,10,26,.8)'][n];
  if(tint){g.fillStyle=tint;g.fillRect(cx-4,cy-4,W+8,H+8)}
  if(n===3){const gr=g.createLinearGradient(0,cy,0,cy+260);gr.addColorStop(0,'rgba(90,96,120,.55)');gr.addColorStop(1,'rgba(170,120,110,0)');g.fillStyle=gr;g.fillRect(cx-4,cy-4,W+8,264)}
  // fenêtres allumées (le soir, la nuit) et oiseaux sur les toits
  if(n>=3){for(const w of PLACE_BG.win){if(!(w.on||(n===4&&w.warm>.7)))continue;const x=w.x+cx*.4,y=w.y+cy*.4;if(x<cx-40||x>cx+W+40)continue;g.fillStyle=n===4?'rgba(255,196,110,.82)':'rgba(255,206,130,.6)';g.fillRect(x+1,y+1,w.w-2,w.h-2);g.fillStyle='rgba(60,40,20,.5)';g.fillRect(x+w.w/2-.8,y,1.6,w.h);g.fillRect(x,y+w.h*.44,w.w,1.6)}}
  if(n<=3)for(let i=0;i<PLACE_BG.ridge.length;i++){const r=PLACE_BG.ridge[i];const y=r.y+cy*.4;for(let k=0;k<3;k++){if((i*7+k*3)%5>1)continue;const bx=lerp(r.x0,r.x1,((i*.37+k*.29)%1))+cx*.4;if(bx<cx-30||bx>cx+W+30)continue;plRoofBird(g,bx,y,t+i*1.7+k,(i+k)%2?1:-1,n===3)}}
  // les platanes, les réverbères
  for(let i=0;i<PLX.trees.length;i++){const tr=PLX.trees[i],x=tr.x*T;if(!vis(x-320,x+320))continue;fSpr(g,'pl-tree'+i+(n===4?'n':''),640,560,320,520,x,PLF,g2=>plTree(g2,tr,i,n===4))}
  // la scène, ses musiciens
  if(vis(62*T,79*T))plStageBack(g,n,t);
  // les maisonnettes
  for(const c of S2.chalets){const x=c.c*T;if(!vis(x-40,x+4*T+40))continue;const st=n<=2?'o':c.closing?'p':'f';fSpr(g,'pl-ch'+c.k+st,220,260,30,226,x,PLF,g2=>plChalet(g2,c,st));plVendor(g,c,st,t)}
  if(n<=2&&vis(52*T,60*T))plGrillStand(g,t);
  // les passants abrités, sur le trottoir, derrière la rue
  for(const p of S2.crowd)if(p.safe&&vis(p.x-40,p.x+40)){g.save();g.translate(0,-10);plPersonDraw(g,p,t,S2);g.restore()}
  for(const l of PLX.lamps){const x=l.x*T;if(!vis(x-80,x+80))continue;fSpr(g,'pl-lamp'+(l.sp?'2':'1'),120,360,60,340,x,PLF,g2=>plLamp(g2,l));plLampGlass(g,l,n>=3,t)}
  // le manège, moitié arrière
  if(vis(115*T,134*T))plCarousel(g,t,false);
}
/* ---------- au monde : dans la rue ---------- */
function drawPlaceMid(t){const S2=L.pl;if(!S2)return;const g=ctx,vis=(a,b)=>b>cam.x-220&&a<cam.x+W+220,n=S2.pass;
  if(vis(115*T,134*T))plCarousel(g,t,true);
  if(n===3)for(const[c,w]of[[7,60],[24,90],[47,70],[61,50],[93,80],[117,110],[133,60]])if(vis(c*T-60,c*T+60))plPuddle(g,c*T,w,t);
  for(const p of S2.props)if(vis(p.c0*T-40,(p.c1+1)*T+40))plProp(g,p);
  if(n>=3&&vis(70*T,75*T))plDrum(g);
  if(n<=2&&vis(54*T,60*T))plGrillFlames(g,t);
  for(const p of S2.crowd)if(!p.safe&&vis(p.x-40,p.x+40))plPersonDraw(g,p,t,S2);
  for(const d of S2.dogs)if(vis(d.x-60,d.x+60))plDog(g,d,t);
  for(const c of S2.cats)if(vis(c.x-40,c.x+40))plCat(g,c,t);
  {const r=S2.roofRat;if(r&&vis(r.x-30,r.x+30))plRoofRat(g,r,t)}
  {const k=S2.roofCat;if(k&&vis(k.x-60,k.x+60))cCat(g,{x:k.x,y:k.y,sw:k.sw,cool:k.cool,col:'#2a2a2e',str:'#f2f0ea',bw:1},t)}
  for(const fl of S2.flocks)for(const b of fl.birds)if(vis(b.x-20,b.x+20))drawUglyPigeon(g,{x:b.x,y:b.y,f:b.f,k:b.k,st:b.st==='hop'?'fly':b.st==='run'?'run':'walk'},t+b.t);
  for(const s of S2.squirrels)if(vis(s.x-30,s.x+30))plSquirrel(g,s,t);
  if(n===1||n===2){const[nx,ny]=PLX.trees[2].nest;if(vis(nx*T-30,nx*T+30))plNest(g,nx*T,ny*T+24)}
  for(const b of S2.bees)if(vis(b.x-20,b.x+20))plBee(g,b,t);
  for(const m of S2.gulls)if(vis(m.x-30,m.x+30))drawFlyer(g,'gull',m.x,m.y,m.st==='hover'?t*3.4+m.a:t*1.2+m.a,m.f);
  if(S2.owl&&vis(S2.owl.x-40,S2.owl.x+40))plOwl(g,S2.owl,t);
}

/* ---------- les dessins ---------- */
function plTree(g,tr,i,night){// un platane : tronc moucheté, grosses charpentières qui portent tout le feuillage, branches basses sous chaque perchoir
  const X=tr.x*T;const tx=a=>a*T-X,ty=r=>r*T-PLF;g.save();
  const R=mulberry(77+i*13),leaf=night?['#2a3424','#33402a','#3a4630']:['#6a8a3a','#7a9a40','#a8a03a','#c8962e','#8a9a3a','#b88a2a'],bark='#8a8268',barkD='#6a6450';
  // les charpentières : elles partent du haut du tronc et vont porter la couronne
  const limbs=[];for(let k=0;k<6;k++){const a=-Math.PI*(.12+.76*k/5)+(R()-.5)*.18,len=140+R()*90;limbs.push({x0:(k<3?-6:6),y0:-262-R()*30,x1:Math.cos(a)*len*1.35,y1:-300+Math.sin(a)*len*.9,w:13-k%2*3})}
  limbs.push({x0:0,y0:-280,x1:(R()-.5)*30,y1:-470,w:12});
  const pt=(l,u)=>{const mx=(l.x0+l.x1)/2+(l.x1>0?-20:20),my=(l.y0+l.y1)/2-30;return[(1-u)*(1-u)*l.x0+2*(1-u)*u*mx+u*u*l.x1,(1-u)*(1-u)*l.y0+2*(1-u)*u*my+u*u*l.y1]};
  // feuillage du fond, accroché aux charpentières
  for(const l of limbs)for(let k=0;k<4;k++){const[x,y]=pt(l,.45+k*.18);g.fillStyle=mix(leaf[(k+i)%leaf.length],'#1a2410',.38);g.beginPath();g.arc(x+(R()-.5)*30,y+(R()-.5)*24,42+R()*26,0,7);g.fill()}
  // le tronc : écorce de platane, plaques claires
  g.fillStyle=bark;g.beginPath();g.moveTo(-20,4);g.quadraticCurveTo(-14,-140,-13,-292);g.lineTo(13,-292);g.quadraticCurveTo(14,-140,22,4);g.closePath();g.fill();
  for(let k=0;k<22;k++){g.fillStyle=pick2(R,['#c8c0a0','#a8a080','#d8d0b4','#6a6450']);g.beginPath();g.ellipse(-12+R()*24,-R()*286,3+R()*6,5+R()*9,R(),0,7);g.fill()}
  g.fillStyle='rgba(0,0,0,.18)';g.beginPath();g.moveTo(6,4);g.quadraticCurveTo(10,-140,10,-292);g.lineTo(13,-292);g.quadraticCurveTo(14,-140,22,4);g.closePath();g.fill();
  // les charpentières, de l'écorce du tronc jusque dans les feuilles
  g.lineCap='round';for(const l of limbs){for(let s=0;s<3;s++){g.strokeStyle=s===0?bark:s===1?'#9a9278':'rgba(0,0,0,.12)';g.lineWidth=s===0?l.w:s===1?l.w*.35:l.w*.3;g.beginPath();g.moveTo(l.x0,l.y0);const[mx,my]=pt(l,.5);g.quadraticCurveTo(mx*2-(l.x0+l.x1)/2,my*2-(l.y0+l.y1)/2,l.x1,l.y1);g.stroke()}
    for(let k=0;k<2;k++){const[x,y]=pt(l,.55+k*.25),a=(R()-.5)*2;g.strokeStyle=barkD;g.lineWidth=3;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a-1.6)*34,y+Math.sin(a-1.6)*30);g.stroke()}}
  // les branches basses : une vraie branche sous chaque perchoir, et ses feuilles posées dessus
  for(const[c0,c1,r]of tr.br){const y=ty(r),xa=tx(c0),xb=tx(c1+1),side=(xa+xb)/2<0?-1:1,root=side<0?xb:xa,tip=side<0?xa:xb;
    g.strokeStyle=bark;g.lineWidth=16;g.beginPath();g.moveTo(0,y+40);g.quadraticCurveTo(root*.4,y+14,root,y+6);g.stroke();
    g.fillStyle=bark;rr(g,xa-6,y-2,xb-xa+12,14,7);g.fill();g.fillStyle='#a8a080';g.fillRect(xa,y-2,xb-xa,3);
    g.strokeStyle=barkD;g.lineWidth=5;g.beginPath();g.moveTo(tip,y+4);g.quadraticCurveTo(tip+side*18,y-4,tip+side*30,y-22);g.stroke();
    g.lineWidth=2.4;g.beginPath();g.moveTo(tip+side*18,y-6);g.lineTo(tip+side*34,y+4);g.stroke();
    for(let k=0;k<4;k++){const lx=tip+side*(14+k*7),ly=y-10-k*5;g.fillStyle=pick2(R,leaf);g.beginPath();g.arc(lx,ly,12+R()*7,0,7);g.fill()}
    g.fillStyle=pick2(R,leaf);g.beginPath();g.arc(tip+side*36,y+4,11,0,7);g.fill()}
  // la couronne : grappes de feuilles sur chaque charpentière
  for(const l of limbs)for(let k=0;k<5;k++){const[x,y]=pt(l,.5+k*.13),rad=24+R()*20;g.fillStyle=pick2(R,leaf);g.beginPath();g.arc(x+(R()-.5)*22,y+(R()-.5)*18,rad,0,7);g.fill();
    if(!night){g.fillStyle='rgba(255,240,180,.12)';g.beginPath();g.arc(x-8,y-10,rad*.5,0,7);g.fill()}}
  g.restore()}
function plLamp(g,l){// réverbère de fonte noire : socle mouluré, fût cannelé, crosse et lanterne ; ou bras double garni de pics
  const k='#1c1e22',hi='#3a3e46';g.save();
  g.fillStyle=k;g.beginPath();g.moveTo(-16,0);g.lineTo(-14,-10);g.quadraticCurveTo(-8,-14,-8,-30);g.lineTo(8,-30);g.quadraticCurveTo(8,-14,14,-10);g.lineTo(16,0);g.closePath();g.fill();
  g.fillRect(-11,-40,22,10);g.fillStyle=hi;g.fillRect(-11,-40,22,2);g.fillStyle=k;
  const top=l.sp?-284:-246;
  g.beginPath();g.moveTo(-5,-40);g.lineTo(-3,top+18);g.lineTo(3,top+18);g.lineTo(5,-40);g.closePath();g.fill();g.fillStyle=hi;for(let y=-60;y>top+30;y-=26)g.fillRect(-4,y,8,2);
  g.fillStyle=k;g.beginPath();g.arc(0,-130,6,0,7);g.fill();
  if(l.sp){// le bras double, ses volutes, deux lanternes, et dessous la rangée de pics
    g.translate(0,-40);
    g.fillRect(-42,-244,84,6);g.strokeStyle=k;g.lineWidth=3;for(const s of[-1,1]){g.beginPath();g.moveTo(0,-222);g.quadraticCurveTo(s*30,-226,s*30,-238);g.stroke();g.beginPath();g.arc(s*16,-230,5,0,7);g.stroke()}
    for(const s of[-1,1]){const lx=s*36;g.fillStyle=k;g.fillRect(lx-8,-250,16,6);poly(g,[lx-10,-250,lx-7,-280,lx+7,-280,lx+10,-250]);g.fill();g.fillStyle='rgba(240,232,200,.75)';poly(g,[lx-7,-252,lx-5,-277,lx+5,-277,lx+7,-252]);g.fill();
      g.fillStyle=k;poly(g,[lx-11,-280,lx,-292,lx+11,-280]);g.fill();g.fillRect(lx-1,-298,2,6)}
    g.fillStyle='#16181c';g.fillRect(-43,-240,86,5);for(let x=-40;x<=40;x+=5){g.fillStyle='#16181c';poly(g,[x-2,-236,x+2,-236,x,-213]);g.fill();g.fillStyle='rgba(190,198,210,.7)';poly(g,[x-.4,-235,x+.8,-235,x,-217]);g.fill()}}
  else{// la crosse et sa lanterne (on peut s'y percher)
    g.fillStyle=k;g.fillRect(-9,-232,18,5);poly(g,[-12,-232,-8,-266,8,-266,12,-232]);g.fill();g.fillStyle='rgba(240,232,200,.75)';poly(g,[-9,-234,-6,-264,6,-264,9,-234]);g.fill();
    g.strokeStyle=k;g.lineWidth=1.4;g.beginPath();g.moveTo(0,-234);g.lineTo(0,-264);g.stroke();g.fillStyle=k;poly(g,[-14,-266,0,-280,14,-266]);g.fill();g.fillRect(-15,-268,30,3);g.beginPath();g.arc(0,-282,3,0,7);g.fill()}
  g.restore()}
function plLampGlass(g,l,lit,t){if(!lit)return;const x=l.x*T;g.save();g.globalCompositeOperation='lighter';
  const pts=l.sp?[[x-36,-305],[x+36,-305]]:[[x,-249]];for(const[px,py]of pts){const y=PLF+py,gr=g.createRadialGradient(px,y,2,px,y,40);gr.addColorStop(0,'rgba(255,220,150,.9)');gr.addColorStop(1,'rgba(255,200,120,0)');g.fillStyle=gr;g.fillRect(px-40,y-40,80,80);g.fillStyle='rgba(255,236,190,.9)';g.fillRect(px-4,y-10,8,20)}
  g.restore()}
/* une maisonnette de bois : bardage vertical, comptoir, auvent relevé sur deux béquilles, enseigne, marchandise */
function plChalet(g,c,st){const w=4*T,R=mulberry(c.c*31),wood=c.w,dk=shade(wood,-.3),lt=shade(wood,.18);
  // le toit (deux pans vus de face : on marche sur le faîtage, à 320)
  g.fillStyle=dk;g.fillRect(-6,-164,w+12,8);
  g.fillStyle=st==='f'?'#5a4a3a':'#7a4a30';poly(g,[-12,-136,0,-162,w,-162,w+12,-136]);g.fill();
  g.fillStyle='rgba(0,0,0,.18)';for(let k=0;k<5;k++)g.fillRect(-10+k*2,-160+k*5,w+20-k*4,1.5);
  g.fillStyle='rgba(255,255,255,.12)';g.fillRect(0,-162,w,3);
  // le bardage
  g.fillStyle=wood;g.fillRect(4,-136,w-8,136);g.strokeStyle='rgba(40,25,10,.35)';g.lineWidth=1;for(let x=10;x<w-4;x+=10){g.beginPath();g.moveTo(x,-136);g.lineTo(x,0);g.stroke()}
  g.fillStyle=lt;g.fillRect(4,-136,w-8,3);g.fillStyle='rgba(0,0,0,.2)';g.fillRect(4,-6,w-8,6);
  // l'enseigne
  g.fillStyle='#f2e6c8';rr(g,18,-130,w-36,18,3);g.fill();g.strokeStyle=dk;g.lineWidth=1.5;rr(g,18,-130,w-36,18,3);g.stroke();
  g.fillStyle='#3a2a1a';g.textAlign='center';fitText(g,c.n,w/2,-117,w-44,11);
  if(st==='f'){// fermée : volet de planches rabattu, cadenas
    g.fillStyle=shade(wood,-.12);g.fillRect(14,-106,w-28,64);g.strokeStyle='rgba(40,25,10,.4)';for(let x=22;x<w-14;x+=12){g.beginPath();g.moveTo(x,-106);g.lineTo(x,-42);g.stroke()}
    g.strokeStyle=dk;g.lineWidth=3;g.beginPath();g.moveTo(14,-100);g.lineTo(w-14,-48);g.stroke();g.fillStyle='#8a8a8a';g.fillRect(w/2-4,-76,8,8);return}
  // la fenêtre de vente, l'auvent relevé
  g.fillStyle='#2a1e14';g.fillRect(14,-106,w-28,58);
  g.fillStyle=shade(wood,-.06);poly(g,[8,-106,w-8,-106,w+2,-124,-2,-124]);g.fill();g.strokeStyle=dk;g.lineWidth=1;for(let x=4;x<w;x+=12){g.beginPath();g.moveTo(x,-124);g.lineTo(x+4,-106);g.stroke()}
  g.strokeStyle=dk;g.lineWidth=3;g.beginPath();g.moveTo(14,-48);g.lineTo(6,-122);g.moveTo(w-14,-48);g.lineTo(w-6,-122);g.stroke();
  if(st==='o'){// guirlande d'ampoules sous l'auvent
    g.strokeStyle='#2a2a2a';g.lineWidth=1;g.beginPath();g.moveTo(10,-104);g.quadraticCurveTo(w/2,-90,w-10,-104);g.stroke()}
  // le comptoir et la marchandise
  g.fillStyle=dk;g.fillRect(8,-50,w-16,8);g.fillStyle=lt;g.fillRect(8,-50,w-16,2);
  plGoods(g,c.k,w,R,st);
}
function plGoods(g,k,w,R,st){const y=-50;
  if(k==='fromages'){for(let i=0;i<5;i++){const x=26+i*24;g.fillStyle=['#f0d880','#e8c860','#f4e8b0','#d8b050','#f0e0a0'][i];g.beginPath();g.ellipse(x,y-6,11,6,0,0,7);g.fill();g.fillRect(x-11,y-6,22,6);g.fillStyle='rgba(0,0,0,.15)';g.fillRect(x-11,y-1,22,1)}
    g.fillStyle='#f4e8b0';poly(g,[60,y-20,80,y-12,60,y-12]);g.fill();for(let i=0;i<4;i++){g.fillStyle='#e8d8a0';g.beginPath();g.arc(40+i*24,-98+((i*7)%9),6,0,7);g.fill()}}
  else if(k==='miel'){for(let i=0;i<8;i++){const x=22+i*15;g.fillStyle='#d8901e';rr(g,x-5,y-16,10,16,2);g.fill();g.fillStyle=['#e8e0d0','#c8402a','#3a6a3a'][i%3];g.fillRect(x-6,y-19,12,4);g.fillStyle='rgba(255,230,150,.5)';g.fillRect(x-3,y-13,2,8)}
    g.fillStyle='#c8a050';for(let i=0;i<3;i++){g.beginPath();g.ellipse(36+i*40,-96,10,13,0,0,7);g.fill();g.strokeStyle='#8a6a2a';g.lineWidth=1;for(let j=0;j<4;j++){g.beginPath();g.ellipse(36+i*40,-96,10,13-j*3,0,0,Math.PI);g.stroke()}}}
  else if(k==='charcut'){for(let i=0;i<9;i++){const x=22+i*14;g.strokeStyle='#e8e0d0';g.lineWidth=1;g.beginPath();g.moveTo(x,-106);g.lineTo(x,-96);g.stroke();g.fillStyle=i%2?'#8a3a2a':'#a84a3a';rr(g,x-4,-96,8,26+(i%3)*6,4);g.fill();g.fillStyle='rgba(255,255,255,.3)';g.fillRect(x-2,-92,1.5,14)}
    for(let i=0;i<4;i++){g.fillStyle='#c86a5a';g.beginPath();g.ellipse(30+i*30,y-6,13,7,0,0,7);g.fill();g.fillStyle='#f0c0b0';g.beginPath();g.ellipse(34+i*30,y-6,6,5,0,0,7);g.fill()}}
  else if(k==='fleurs'){for(let i=0;i<6;i++){const x=24+i*22;g.fillStyle=['#3a6a8a','#8a5a3a','#3a6a3a'][i%3];rr(g,x-8,y-14,16,14,2);g.fill();for(let j=0;j<5;j++){g.strokeStyle='#3a7a3a';g.lineWidth=1.2;g.beginPath();g.moveTo(x,y-14);g.lineTo(x-6+j*3,y-30-R()*10);g.stroke();g.fillStyle=['#e83a5a','#f2e04a','#f2f0e8','#b06ae0','#f28a3a'][(i+j)%5];g.beginPath();g.arc(x-6+j*3,y-32-R()*8,3.5,0,7);g.fill()}}
    // et des seaux de fleurs devant, sur les pavés (là où vont les abeilles)
    for(let i=0;i<4;i++){const x=20+i*38;g.fillStyle='#8a9aa8';poly(g,[x-12,0,x+12,0,x+14,-22,x-14,-22]);g.fill();for(let j=0;j<7;j++){g.strokeStyle='#3a7a3a';g.lineWidth=1.2;g.beginPath();g.moveTo(x,-22);g.lineTo(x-12+j*4,-40-R()*12);g.stroke();g.fillStyle=['#e83a5a','#f2e04a','#f6f2ea','#e86aa0','#f28a3a'][(i*2+j)%5];g.beginPath();g.arc(x-12+j*4,-42-R()*10,4.5,0,7);g.fill()}}}
  else if(k==='poisson'){g.fillStyle='#d8eaf0';g.fillRect(12,y-10,w-24,10);for(let i=0;i<14;i++){g.fillStyle='rgba(255,255,255,.8)';g.beginPath();g.arc(16+i*10,y-9,3,0,7);g.fill()}
    for(let i=0;i<6;i++){const x=24+i*20;g.save();g.translate(x,y-12);g.rotate(-.15+(i%2)*.3);g.fillStyle=['#8a9aa8','#c8ccd0','#d08a6a'][i%3];g.beginPath();g.ellipse(0,0,10,4,0,0,7);g.fill();poly(g,[8,0,14,-4,14,4]);g.fill();g.fillStyle='#111';g.beginPath();g.arc(-6,-1,1,0,7);g.fill();g.restore()}
    g.fillStyle='#e8402a';for(let i=0;i<3;i++){g.beginPath();g.ellipse(40+i*36,-96,9,5,0,0,7);g.fill()}g.fillStyle='#f2f0e8';g.textAlign='center';fitText(g,'ARRIVAGE DU JOUR',w/2,-60,w-40,7)}
  else if(k==='primeur'){for(let i=0;i<4;i++){const x=16+i*34;g.fillStyle='#a8784a';g.fillRect(x,y-14,30,14);g.fillStyle='rgba(0,0,0,.2)';g.fillRect(x,y-8,30,2);const col=['#d83a2a','#f0a020','#7ab83a','#e8d83a'][i];for(let j=0;j<6;j++){g.fillStyle=col;g.beginPath();g.arc(x+5+(j%3)*10,y-16-Math.floor(j/3)*6,5,0,7);g.fill()}}
    g.fillStyle='#4a8a3a';for(let i=0;i<3;i++){g.beginPath();g.arc(40+i*40,-98,9,0,7);g.fill()}g.fillStyle='#f2f0e8';rr(g,w-40,-74,26,14,2);g.fill();g.fillStyle='#2a2a2a';g.textAlign='center';fitText(g,'2€ LE KG',w-27,-64,22,7)}
  else if(k==='pain'){for(let i=0;i<6;i++){g.save();g.translate(24+i*20,y-6);g.rotate(-.3);g.fillStyle='#c8862e';rr(g,-14,-4,28,8,4);g.fill();g.strokeStyle='#8a5a1a';g.lineWidth=1;for(let j=-8;j<10;j+=6){g.beginPath();g.moveTo(j,-3);g.lineTo(j+3,2);g.stroke()}g.restore()}
    for(let i=0;i<4;i++){g.fillStyle='#d89a3e';g.beginPath();g.arc(32+i*30,-96,9,0,7);g.arc(32+i*30,-104,6,0,7);g.fill()}}
  else if(k==='vins'){for(let i=0;i<10;i++){const x=20+i*12;g.fillStyle=i%3===2?'#c8a030':'#3a1a2a';rr(g,x-4,y-26,8,26,3);g.fill();g.fillRect(x-1.5,y-34,3,8);g.fillStyle='#f2ead0';g.fillRect(x-4,y-16,8,6)}
    g.fillStyle='#8a5a32';g.beginPath();g.ellipse(w/2,-90,22,16,0,0,7);g.fill();g.strokeStyle='#4a3a2a';g.lineWidth=2;g.beginPath();g.ellipse(w/2,-90,22,16,0,0,7);g.moveTo(w/2-22,-94);g.lineTo(w/2+22,-94);g.moveTo(w/2-22,-86);g.lineTo(w/2+22,-86);g.stroke()}
  else if(k==='bonbons'){for(let i=0;i<6;i++){const x=22+i*20;g.fillStyle='rgba(220,236,240,.6)';rr(g,x-8,y-22,16,22,4);g.fill();for(let j=0;j<6;j++){g.fillStyle=['#e83a5a','#3ae8a0','#f2e04a','#e86ae0'][(i+j)%4];g.beginPath();g.arc(x-4+(j%2)*8,y-4-Math.floor(j/2)*6,2.6,0,7);g.fill()}}
    for(let i=0;i<3;i++){g.strokeStyle='#f2ead8';g.lineWidth=2;g.beginPath();g.moveTo(36+i*40,-62);g.lineTo(36+i*40,-84);g.stroke();g.fillStyle=['#f6b8d0','#c8e0f8','#f6b8d0'][i];g.beginPath();g.arc(36+i*40,-94,13,0,7);g.arc(30+i*40,-88,9,0,7);g.arc(42+i*40,-88,9,0,7);g.fill()}}
  else if(k==='jouets'){for(let i=0;i<5;i++){const x=24+i*26;g.fillStyle=['#c8402a','#3a6aa8','#e0b030','#5aa86a','#a84aa8'][i];rr(g,x-9,y-16,18,16,3);g.fill();g.fillStyle='#f2f0e8';g.beginPath();g.arc(x,y-8,3,0,7);g.fill()}
    g.fillStyle='#8a6a4a';g.fillRect(28,-104,18,22);g.fillStyle='#d8b890';g.beginPath();g.arc(37,-108,7,0,7);g.fill();g.fillStyle='#3a6aa8';g.fillRect(w-50,-100,24,30);g.fillStyle='#e8d0a0';g.beginPath();g.arc(w-38,-106,7,0,7);g.fill()}
  else if(k==='crepes'){g.fillStyle='#3a3a3e';g.fillRect(24,y-8,44,8);g.fillRect(w-68,y-8,44,8);g.fillStyle='#e8c070';g.beginPath();g.ellipse(46,y-9,18,4,0,0,7);g.ellipse(w-46,y-9,18,4,0,0,7);g.fill();
    g.fillStyle='#f2ead8';rr(g,w/2-30,-100,60,30,3);g.fill();g.fillStyle='#3a2a1a';g.textAlign='center';fitText(g,'SUCRE 3€',w/2,-88,52,7);fitText(g,'NUTELLA 4€',w/2,-78,52,7)}
}
function plVendor(g,c,st,t){if(st==='f')return;const x=c.c*T+80,b=PLF-50;g.save();
  const R=mulberry(c.c*7),coat=pick2(R,['#f2f0ea','#3a5a7a','#8a3a3a','#4a6a4a']),skin=pick2(R,PL_SKIN),hair=pick2(R,PL_HAIR),fem=R()<.45,must=!fem&&R()<.5,ph=c.c*.37;
  if(st==='p'){// il remballe : penché sur une caisse, on le voit de dos
    const bend=Math.abs(Math.sin(t*1.5))*6;g.fillStyle=coat;rr(g,x-14,b-30+bend,28,32,8);g.fill();g.fillStyle=hair;g.beginPath();g.arc(x+12,b-26+bend,8,0,7);g.fill();g.restore();return}
  const bob=Math.sin(t*2+c.c)*1.2,hy=b-56+bob;
  // le corps, le tablier
  g.fillStyle=coat;rr(g,x-14,b-44+bob,28,46,8);g.fill();
  if(['poisson','charcut','pain','crepes','fromages'].includes(c.k)){g.fillStyle='#f6f4ee';rr(g,x-10,b-36+bob,20,38,4);g.fill();g.strokeStyle='#d8d4cc';g.lineWidth=1;g.beginPath();g.moveTo(x-8,b-36+bob);g.lineTo(x,b-46+bob);g.lineTo(x+8,b-36+bob);g.stroke()}
  // regarde-t-il Raymond, ou ses clients ?
  const pc=P.x+P.w/2,near=Math.abs(pc-x)<260,look=near?clamp((pc-x)/120,-1,1):Math.sin(t*.4+ph),lookY=near?clamp((P.y-hy)/160,-1,1)*.8:0;
  const talk=Math.sin(t*.7+ph*3)>-.1,laugh=Math.sin(t*.23+ph)>.93,surprise=near&&Math.abs(pc-x)<70;
  // les bras : il tend la marchandise, il montre du doigt
  const gst=Math.sin(t*2.2+ph);g.strokeStyle=coat;g.lineWidth=6;g.lineCap='round';g.beginPath();g.moveTo(x-11,b-36+bob);g.lineTo(x-20,b-8);g.moveTo(x+11,b-36+bob);
  if(talk){g.quadraticCurveTo(x+22,b-30,x+24+gst*3,b-40-Math.max(0,gst)*10)}else g.lineTo(x+20,b-8);g.stroke();
  g.fillStyle=skin;g.beginPath();g.arc(x-20,b-7,3.4,0,7);g.arc(talk?x+24+gst*3:x+20,talk?b-42-Math.max(0,gst)*10:b-7,3.4,0,7);g.fill();
  // la tête, de face
  g.fillStyle=skin;g.fillRect(x-4,hy+8,8,6);g.beginPath();g.ellipse(x,hy,11,12,0,0,7);g.fill();g.fillStyle=shade(skin,-.1);g.beginPath();g.ellipse(x-11,hy+1,2.4,3.4,0,0,7);g.ellipse(x+11,hy+1,2.4,3.4,0,0,7);g.fill();
  g.fillStyle=hair;if(fem){g.beginPath();g.arc(x,hy-3,12.5,Math.PI*.95,Math.PI*2.05);g.fill();g.beginPath();g.arc(x,hy-15,6,0,7);g.fill()}else{g.beginPath();g.arc(x,hy-3,11.5,Math.PI*1.05,Math.PI*1.95);g.fill();g.fillRect(x-11,hy-6,3,6);g.fillRect(x+8,hy-6,3,6)}
  if(c.k==='crepes'||c.k==='pain'){g.fillStyle='#f6f4ee';g.fillRect(x-10,hy-22,20,11);g.beginPath();g.arc(x-6,hy-22,6,0,7);g.arc(x+1,hy-24,7,0,7);g.arc(x+7,hy-22,5,0,7);g.fill()}
  else if(c.k==='poisson'){g.fillStyle='#2a4a7a';g.beginPath();g.arc(x,hy-6,11.5,Math.PI,0);g.fill();g.fillRect(x-14,hy-7,16,3)}
  // les yeux : blanc, iris qui suit, paupière qui cligne
  const blink=((t+ph)%3.7)<.12,er=surprise?2.8:2.3;
  for(const s of[-1,1]){const ex=x+s*4.4,ey=hy-1;if(blink){g.strokeStyle='#2a1a14';g.lineWidth=1;g.beginPath();g.moveTo(ex-2.4,ey);g.lineTo(ex+2.4,ey);g.stroke();continue}
    g.fillStyle='#f6f2ea';g.beginPath();g.ellipse(ex,ey,2.8,er,0,0,7);g.fill();g.fillStyle='#3a2a1a';g.beginPath();g.arc(ex+look*1.2,ey+lookY,1.35,0,7);g.fill()}
  // les sourcils : levés quand le pigeon passe tout près
  g.strokeStyle=hair;g.lineWidth=1.4;g.lineCap='round';const br=surprise?-2.6:0;g.beginPath();g.moveTo(x-7,hy-5+br);g.lineTo(x-2.4,hy-5.6+br);g.moveTo(x+2.4,hy-5.6+br);g.lineTo(x+7,hy-5+br);g.stroke();
  // le nez, la moustache, la bouche (elle parle, elle sourit, elle rit, elle s'étonne)
  g.strokeStyle=shade(skin,-.28);g.lineWidth=1;g.beginPath();g.moveTo(x,hy+1);g.quadraticCurveTo(x+2,hy+4.5,x-.5,hy+5);g.stroke();
  if(must){g.fillStyle=hair;g.beginPath();g.ellipse(x-3,hy+7,3.6,1.5,.15,0,7);g.ellipse(x+3,hy+7,3.6,1.5,-.15,0,7);g.fill()}
  const my=hy+9.2;
  if(surprise){g.fillStyle='#5a2020';g.beginPath();g.ellipse(x,my,2,2.6,0,0,7);g.fill()}
  else if(laugh){g.fillStyle='#5a2020';g.beginPath();g.moveTo(x-4,my-1);g.quadraticCurveTo(x,my+5,x+4,my-1);g.closePath();g.fill();g.fillStyle='#f6f2ea';g.fillRect(x-3,my-1,6,1.2)}
  else if(talk){const o=Math.max(0,Math.sin(t*14+ph*5));g.fillStyle='#5a2020';g.beginPath();g.ellipse(x,my,2.6,.5+o*1.8,0,0,7);g.fill()}
  else{g.strokeStyle='#6a3028';g.lineWidth=1.1;g.beginPath();g.moveTo(x-3.4,my-.6);g.quadraticCurveTo(x,my+2,x+3.4,my-.6);g.stroke()}
  if(fem){g.fillStyle='rgba(230,110,110,.22)';g.beginPath();g.arc(x-6.5,hy+4,2.4,0,7);g.arc(x+6.5,hy+4,2.4,0,7);g.fill()}
  g.restore()}
/* le stand des grillades : sa toile, son barbecue, et le cuisinier qui a peur des flammes */
function plGrillStand(g,t){const x0=54*T,x1=57*T,b=PLF,gr=L.pl.grill;g.save();
  // la tente des grillades (son toit est praticable), sa table, ses assiettes
  for(const px of[x0+4,x1-8]){g.fillStyle='#5a5a5a';g.fillRect(px,b-160,4,160)}
  g.fillStyle='#c8302a';poly(g,[x0-8,b-136,x0+6,b-162,x1-6,b-162,x1+8,b-136]);g.fill();g.fillStyle='#f2ece0';for(let k=0;k<6;k++){poly(g,[x0-8+k*22,b-136,x0+4+k*21,b-162,x0+14+k*21,b-162,x0+4+k*22,b-136]);if(k%2)g.fill()}
  for(let k=0;k<6;k++){g.fillStyle=k%2?'#c8302a':'#f2ece0';g.beginPath();g.arc(x0-2+k*22+11,b-136,11,0,Math.PI);g.fill()}
  g.fillStyle='#f2e6c8';rr(g,x0+12,b-128,x1-x0-24,16,3);g.fill();g.fillStyle='#3a2a1a';g.textAlign='center';fitText(g,'GRILLADES',(x0+x1)/2,b-116,x1-x0-32,10);
  g.fillStyle='#e8e2d4';g.fillRect(x0+8,b-60,x1-x0-16,6);g.fillStyle='#8a6a42';g.fillRect(x0+12,b-54,4,54);g.fillRect(x1-16,b-54,4,54);
  for(let k=0;k<4;k++){g.fillStyle='#f6f2ea';g.beginPath();g.ellipse(x0+24+k*20,b-62,7,2,0,0,7);g.fill();g.fillStyle='#a8502a';rr(g,x0+19+k*20,b-65,10,3,1.5);g.fill()}
  // le barbecue, dehors, à droite de la tente, rien au-dessus : cuve sur pieds, grille, saucisses, fumée
  const gx=57*T+2,gw=1.6*T-4,gy=b-48;g.strokeStyle='#2a2a2a';g.lineWidth=3;g.beginPath();g.moveTo(gx+8,gy+6);g.lineTo(gx+3,b);g.moveTo(gx+gw-8,gy+6);g.lineTo(gx+gw-3,b);g.moveTo(gx+gw/2,gy+10);g.lineTo(gx+gw/2,b);g.stroke();
  g.fillStyle='#2a2a2e';g.beginPath();g.moveTo(gx,gy-10);g.lineTo(gx+gw,gy-10);g.quadraticCurveTo(gx+gw-6,gy+12,gx+gw/2,gy+12);g.quadraticCurveTo(gx+6,gy+12,gx,gy-10);g.fill();
  g.fillStyle='rgba(255,90,30,'+(.5+.3*Math.sin(t*9))+')';g.fillRect(gx+5,gy-12,gw-10,3);
  for(let k=0;k<4;k++){g.fillStyle=k%2?'#8a3a2a':'#a8502a';rr(g,gx+8+k*13,gy-17,11,5,2.5);g.fill()}
  for(let k=0;k<4;k++){const ph=(t*.35+k/4)%1;g.fillStyle='rgba(220,220,220,'+(.26*(1-ph))+')';g.beginPath();g.arc(gx+gw/2+Math.sin(ph*5+k)*14,gy-30-ph*150,10+ph*24,0,7);g.fill()}
  // le cuisinier, entre sa tente et son grill, pince à la main ; il recule et lève les bras quand ça flambe
  const u=gr.t%3.1,k=gr.ph==='burst'?Math.min(1,(u-2.1)/.25):0,fear=k>.5?1:0,cx=x1-6-fear*14,sh=fear?Math.sin(t*40)*2:0;
  g.fillStyle='#2a2c34';g.fillRect(cx-7,b-50,5,50);g.fillRect(cx+2,b-50,5,50);
  g.fillStyle='#f6f4ee';rr(g,cx-13+sh,b-104,26,56,8);g.fill();g.fillStyle='#e8c0a0';g.beginPath();g.arc(cx+sh,b-114,11,0,7);g.fill();
  g.fillStyle='#f6f4ee';g.fillRect(cx-10+sh,b-138-fear*4,20,15);g.beginPath();g.arc(cx-5+sh,b-138-fear*4,6,0,7);g.arc(cx+2+sh,b-140-fear*4,7,0,7);g.arc(cx+7+sh,b-138-fear*4,5,0,7);g.fill();
  // son visage, tourné vers le grill
  g.fillStyle='#f6f2ea';g.beginPath();g.ellipse(cx+5+sh,b-117,2.6,fear?2.8:2,0,0,7);g.fill();g.fillStyle='#2a1a14';g.beginPath();g.arc(cx+6+sh,b-117,1.3,0,7);g.fill();
  g.strokeStyle='#5a3a22';g.lineWidth=1.3;g.beginPath();g.moveTo(cx+2+sh,b-121-fear*2);g.lineTo(cx+8+sh,b-122-fear*3);g.stroke();
  g.fillStyle='#e8c0a0';g.beginPath();g.moveTo(cx+10+sh,b-118);g.quadraticCurveTo(cx+15+sh,b-113,cx+10+sh,b-112);g.fill();
  if(fear){g.fillStyle='#4a1a1a';g.beginPath();g.ellipse(cx+8+sh,b-108,2.4,3.4,0,0,7);g.fill();g.strokeStyle='#f6f4ee';g.lineWidth=5;g.lineCap='round';g.beginPath();g.moveTo(cx-8,b-96);g.lineTo(cx-18,b-128);g.moveTo(cx+8,b-96);g.lineTo(cx+16,b-130);g.stroke();
    g.fillStyle='rgba(120,190,255,.8)';g.beginPath();g.ellipse(cx-6,b-122,1.6,3,0,0,7);g.fill()}
  else{g.strokeStyle='#6a3028';g.lineWidth=1;g.beginPath();g.moveTo(cx+6+sh,b-108);g.lineTo(cx+10+sh,b-108.5);g.stroke();g.strokeStyle='#f6f4ee';g.lineWidth=5;g.lineCap='round';g.beginPath();g.moveTo(cx+8,b-94);g.lineTo(cx+18,b-80);g.stroke();g.strokeStyle='#8a8a8a';g.lineWidth=2;g.beginPath();g.moveTo(cx+18,b-80);g.lineTo(cx+36,b-66);g.stroke()}
  g.restore()}
function plGrillFlames(g,t){const gr=L.pl.grill;if(!gr.on)return;const gx=57*T+2,gw=1.6*T-4,gy=PLF-60,u=gr.t%3.1;
  let hgt=gr.ph==='warn'?20+Math.sin(t*30)*8:gr.ph==='burst'?70+Math.min(1,(u-2.1)/.25)*190:8+Math.sin(t*12)*3;
  if(gr.ph==='idle'&&u>2.9)hgt=70*(1-(u-2.9)/.2);
  g.save();
  for(let k=0;k<7;k++){const fx=gx+6+k*(gw-12)/6,fh=hgt*(.65+.35*Math.sin(t*17+k*1.7)),w=9+(gr.ph==='burst'?7:0);
    const gg=g.createLinearGradient(0,gy,0,gy-fh);gg.addColorStop(0,'rgba(255,214,90,.95)');gg.addColorStop(.35,'rgba(250,120,30,.9)');gg.addColorStop(.75,'rgba(210,50,15,.6)');gg.addColorStop(1,'rgba(160,30,10,0)');g.fillStyle=gg;
    g.beginPath();g.moveTo(fx-w,gy);g.quadraticCurveTo(fx-w*.6+Math.sin(t*21+k)*6,gy-fh*.5,fx+Math.sin(t*13+k)*8,gy-fh);g.quadraticCurveTo(fx+w*.6+Math.sin(t*19+k)*6,gy-fh*.5,fx+w,gy);g.fill()}
  // le cœur des flammes, plus clair
  for(let k=0;k<5;k++){const fx=gx+10+k*(gw-20)/4,fh=hgt*.45*(.7+.3*Math.sin(t*23+k));g.fillStyle='rgba(255,246,190,.85)';g.beginPath();g.moveTo(fx-4,gy);g.quadraticCurveTo(fx+Math.sin(t*19+k)*3,gy-fh*.6,fx,gy-fh);g.quadraticCurveTo(fx+4,gy-fh*.5,fx+4,gy);g.fill()}
  if(gr.ph==='burst')for(let k=0;k<12;k++){const ph=(t*1.8+k/12)%1;g.fillStyle='rgba(255,170,60,'+(1-ph)+')';g.fillRect(gx+gw*((k*.37)%1),gy-ph*hgt*1.1,2,2)}
  g.restore()}
/* la scène : plancher, toile de fond, auvent, banderole ; l'orchestre (deux airs), puis plus personne */
function plStageBack(g,n,t){const x0=63*T,x1=78*T,fl=10*T,top=4*T;g.save();
  // la toile de fond
  g.fillStyle='#2a1e34';g.fillRect(x0+10,top+20,x1-x0-20,fl-top-20);
  for(let x=x0+14;x<x1-14;x+=18){g.fillStyle='rgba(255,255,255,.04)';g.fillRect(x,top+20,8,fl-top-20)}
  g.fillStyle='#8a2a3a';for(const s of[0,1]){const sx=s?x1-70:x0+10;g.beginPath();g.moveTo(sx,top+20);g.lineTo(sx+60,top+20);g.quadraticCurveTo(s?sx+50:sx+10,fl-120,s?sx+56:sx+4,fl);g.lineTo(s?sx+60:sx,fl);g.lineTo(s?sx+60:sx,top+20);g.fill()}
  g.fillStyle='#f2e6c8';g.font='italic 13px '+F_BODY;g.textAlign='center';g.fillText('Comité des fêtes de Crécy-la-Chapelle',(x0+x1)/2,fl-130);
  // les poteaux, l'auvent (on peut marcher dessus), ses festons
  g.fillStyle='#4a4a52';g.fillRect(x0+2,top,10,fl-top);g.fillRect(x1-12,top,10,fl-top);
  g.fillStyle='#e8e0cc';g.fillRect(x0-6,top-4,x1-x0+12,14);g.fillStyle='#c8302a';g.fillRect(x0-6,top-4,x1-x0+12,4);
  for(let x=x0-6;x<x1+6;x+=24){g.fillStyle=((x-x0)/24|0)%2?'#2a4a9a':'#c8302a';g.beginPath();g.arc(x+12,top+10,12,0,Math.PI);g.fill()}
  // la banderole, tendue sous l'auvent, au-dessus des musiciens
  plBanner(g,(x0+x1)/2,top+38,t);
  // les enceintes, les pupitres, les musiciens (deux premiers passages)
  if(n<=2){for(const sx of[63*T,76*T]){g.fillStyle='#1a1a1e';rr(g,sx+2,8*T,2*T-4,2*T,3);g.fill();g.fillStyle='#3a3a40';for(const[cy,r]of[[8*T+22,13],[8*T+56,18]]){g.beginPath();g.arc(sx+T,cy,r,0,7);g.fill();g.fillStyle='#1a1a1e';g.beginPath();g.arc(sx+T,cy,r*.4,0,7);g.fill();g.fillStyle='#3a3a40'}}
    plMusicians(g,t,n)}
  // le plancher
  g.fillStyle='#6a4a2e';g.fillRect(x0,fl,x1-x0,PLF-fl);g.fillStyle='#8a6a46';g.fillRect(x0,fl,x1-x0,5);g.fillStyle='rgba(0,0,0,.25)';for(let x=x0;x<x1;x+=30)g.fillRect(x,fl+5,1.5,PLF-fl-5);
  g.fillStyle='#2a4a9a';g.fillRect(x0,fl+10,x1-x0,22);g.fillStyle='#f2f0ea';g.fillRect(x0,fl+32,x1-x0,22);g.fillStyle='#c8302a';g.fillRect(x0,fl+54,x1-x0,22);
  for(let x=x0;x<x1;x+=40){g.fillStyle='rgba(0,0,0,.12)';g.beginPath();g.moveTo(x,fl+10);g.quadraticCurveTo(x+20,fl+40,x+40,fl+10);g.fill()}
  g.restore()}
function plBanner(g,cx,y,t){const w=470,h=46;g.save();
  g.strokeStyle='#5a4a3a';g.lineWidth=1.4;g.beginPath();g.moveTo(cx-w/2,y);g.lineTo(cx-w/2-20,y-30);g.moveTo(cx+w/2,y);g.lineTo(cx+w/2+20,y-30);g.stroke();
  const sw=Math.sin(t*.8)*1.5;g.fillStyle='#f4eedc';g.beginPath();g.moveTo(cx-w/2,y);g.lineTo(cx+w/2,y);g.lineTo(cx+w/2,y+h+sw);g.lineTo(cx-w/2,y+h-sw);g.closePath();g.fill();
  g.strokeStyle='#2a4a9a';g.lineWidth=3;g.strokeRect(cx-w/2+4,y+4,w-8,h-8);
  g.fillStyle='#2a4a9a';g.fillRect(cx-w/2,y,10,h);g.fillStyle='#c8302a';g.fillRect(cx+w/2-10,y,10,h);
  g.fillStyle='#2a2a3a';g.textAlign='center';g.font='bold 15px '+F_DISP;g.fillText('110e ANNIVERSAIRE DE LA BATAILLE DE VERDUN',cx,y+21);
  g.font='italic 11px '+F_BODY;g.fillStyle='#6a3a2a';g.fillText('Crécy-la-Chapelle se souvient de ses enfants · fête communale',cx,y+36);
  g.restore()}
function plMusicians(g,t,n){const fl=10*T,beat=(L.pl.beat*(n===2?2.9:2.4)),bt=Math.sin(beat*Math.PI);
  const body=(x,coat,f,hair)=>{g.fillStyle='#2a2c34';g.fillRect(x-8,fl-48,6,48);g.fillRect(x+2,fl-48,6,48);g.fillStyle=coat;rr(g,x-13,fl-100+Math.abs(bt)*2,26,56,8);g.fill();
    g.save();g.translate(x,fl+4+Math.abs(bt)*2);g.scale(f,1);g.fillStyle='#e8c4a0';g.fillRect(-1,-106,7,6);g.beginPath();g.arc(2,-114,11,0,7);g.fill();
    g.fillStyle=hair;g.beginPath();g.moveTo(10,-121);g.quadraticCurveTo(2,-129,-8,-121);g.quadraticCurveTo(-11,-114,-8,-108);g.lineTo(-4,-110);g.quadraticCurveTo(-3,-118,6,-120);g.closePath();g.fill();
    plFace(g,{skin:'#e8c4a0',hair,ph:x*.01,brow:.3,mood:.8,must:hair==='#8a8a8a',glass:false,fem:false,kid:false},t,0,false);g.restore()};
  // l'accordéoniste (béret, le soufflet qui s'ouvre et se ferme)
  {const x=66.5*T;body(x,'#3a3a46',1,'#8a8a8a');g.fillStyle='#2a2a2e';g.fillRect(x-12,fl-124,26,5);g.beginPath();g.ellipse(x+1,fl-124,13,5,0,0,7);g.fill();
    const op=10+Math.sin(beat*Math.PI)*8;g.fillStyle='#c8302a';g.fillRect(x-4,fl-92,10,30);g.fillStyle='#2a2a2a';g.fillRect(x+6+op,fl-92,10,30);g.fillStyle='#f2ead8';for(let k=0;k<5;k++){g.fillStyle=k%2?'#f2ead8':'#c8302a';g.fillRect(x+6+k*op/5,fl-90,op/5+.5,26)}}
  // la clarinette
  {const x=69.5*T;body(x,'#5a3a2a',1,'#3a2a1a');g.save();g.translate(x+10,fl-104);g.rotate(.9+Math.sin(beat*Math.PI*.5)*.08);g.fillStyle='#1a1a1a';g.fillRect(0,-2,40,4);g.fillStyle='#c8c8c8';for(let k=1;k<5;k++)g.fillRect(k*8,-2.5,2,5);g.beginPath();g.moveTo(40,-2);g.lineTo(48,-5);g.lineTo(48,5);g.lineTo(40,2);g.fill();g.restore()}
  // la contrebasse
  {const x=72.5*T;body(x,'#2a3a4a',-1,'#6a4a2a');g.save();g.translate(x+16,fl-6);g.rotate(-.12);g.fillStyle='#8a4a22';g.beginPath();g.ellipse(0,-40,18,24,0,0,7);g.ellipse(0,-76,14,18,0,0,7);g.fill();g.fillStyle='#3a1a0a';g.fillRect(-2,-150,4,90);g.fillRect(-4,-160,8,12);
    g.strokeStyle='rgba(240,230,200,.7)';g.lineWidth=.8;for(let k=-1;k<=1;k++){g.beginPath();g.moveTo(k*2,-148);g.lineTo(k*3,-28);g.stroke()}g.fillStyle='#1a0a04';g.beginPath();g.ellipse(-6,-58,2,6,0,0,7);g.ellipse(6,-58,2,6,0,0,7);g.fill();g.restore();
    g.strokeStyle='#e8c4a0';g.lineWidth=5;g.lineCap='round';g.beginPath();g.moveTo(x+6,fl-88);g.lineTo(x+14+bt*3,fl-60);g.stroke()}
  // la batterie
  {const x=75*T-10;body(x,'#7a2a2a',-1,'#c8a060');g.fillStyle='#e8e0d0';g.beginPath();g.ellipse(x-20,fl-36,16,20,0,0,7);g.fill();g.fillStyle='#c8302a';g.fillRect(x-36,fl-40,32,8);g.fillStyle='#c8b060';g.beginPath();g.ellipse(x-34,fl-72,14,3,0,0,7);g.fill();g.fillStyle='#2a2a2a';g.fillRect(x-35,fl-72,2,70);
    g.strokeStyle='#d8b890';g.lineWidth=2;g.beginPath();g.moveTo(x-8,fl-80);g.lineTo(x-28,fl-60-Math.max(0,bt)*14);g.moveTo(x+4,fl-80);g.lineTo(x-20,fl-74+Math.max(0,-bt)*10);g.stroke()}
  // des notes qui s'envolent
  for(let k=0;k<5;k++){const ph=(L.pl.beat*.4+k/5)%1;g.fillStyle='rgba(42,42,58,'+(.7*(1-ph))+')';const nx=65*T+k*90+Math.sin(ph*6+k)*14,ny=fl-150-ph*100;g.beginPath();g.ellipse(nx,ny,4,3,-.4,0,7);g.fill();g.fillRect(nx+3,ny-14,1.4,14)}
}
function plDrum(g){const x=72.5*T,b=10*T,a=L.pl.drum;g.save();
  g.fillStyle='#4a5a3a';g.beginPath();g.moveTo(x-34,b);g.quadraticCurveTo(x-40,b-56,x,b-62);g.quadraticCurveTo(x+40,b-56,x+34,b);g.closePath();g.fill();
  g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=1.2;g.beginPath();g.moveTo(x-20,b-50);g.lineTo(x-26,b);g.moveTo(x+12,b-56);g.lineTo(x+20,b);g.stroke();
  if(a.used||a.open>0){g.fillStyle='#e8e0d0';g.beginPath();g.ellipse(x+22,b-30,12,18,-.2,0,7);g.fill();g.fillStyle='#c8302a';g.fillRect(x+12,b-34,6,10)}
  g.fillStyle='#2a2a2a';g.fillRect(x+40,b-40,3,40);g.fillStyle='#c8b060';g.beginPath();g.ellipse(x+41,b-40,12,3,0,0,7);g.fill();g.restore()}
/* le manège : plancher elliptique, mât à miroirs, chapiteau rayé à lambrequins, chevaux de bois sur leurs barres torsadées */
function plCarousel(g,t,front){const S2=L.pl,C=PLX.car,cx=C.cx,R=C.R,deck=440,on=S2.car.on,rimY=186;g.save();
  const horses=L.movers.filter(m=>m.kind==='plh').map(m=>{const th=plCarAng(S2,m.k);return{m,th,z:Math.sin(th),x:C.cx-Math.cos(th)*R,k:m.k}}).sort((a,b)=>a.z-b.z);
  if(!front){
    // le plancher (moitié arrière visible derrière le mât)
    const DR=R+46,DY=432;g.fillStyle='#8a6a42';g.beginPath();g.ellipse(cx,DY,DR,26,0,0,7);g.fill();
    g.fillStyle='#7a5a36';g.beginPath();g.ellipse(cx,DY,DR*.55,14,0,0,7);g.fill();
    g.strokeStyle='rgba(60,40,20,.42)';g.lineWidth=1;for(let k=0;k<24;k++){const a=k/24*Math.PI*2+S2.car.a;g.beginPath();g.moveTo(cx-Math.cos(a)*DR*.2,DY+Math.sin(a)*5);g.lineTo(cx-Math.cos(a)*(DR-2),DY+Math.sin(a)*25);g.stroke()}
    g.strokeStyle='#e8c860';g.lineWidth=2;g.beginPath();g.ellipse(cx,DY,DR-3,24,0,0,7);g.stroke();
    // le dessous du chapiteau (vu par-dessous, à l'arrière)
    g.fillStyle=on?'#4a2a3a':'#2a1e26';g.beginPath();g.ellipse(cx,rimY+4,R+40,26,0,Math.PI,0);g.fill();
    // les chevaux de derrière
    for(const h of horses)if(h.z<=0)plHorse(g,h,t,deck,rimY,on);
    // le mât central : miroirs, peintures, ampoules
    const mw=64;g.fillStyle='#c8a050';g.fillRect(cx-mw/2,rimY,mw,deck-rimY);
    for(let k=0;k<4;k++){const py=rimY+20+k*58;g.fillStyle=k%2?'#2a5a8a':'#8a2a3a';g.fillRect(cx-mw/2+6,py,mw-12,44);
      g.fillStyle='rgba(200,230,250,'+(on?.45+.25*Math.sin(t*3+k):.25)+')';rr(g,cx-mw/2+12,py+6,mw-24,32,10);g.fill();g.strokeStyle='#e8c860';g.lineWidth=2;rr(g,cx-mw/2+12,py+6,mw-24,32,10);g.stroke()}
    g.fillStyle='#e8c860';for(let k=0;k<9;k++){const py=rimY+8+k*30;g.beginPath();g.arc(cx-mw/2+3,py,2.5,0,7);g.arc(cx+mw/2-3,py,2.5,0,7);g.fill()}
  }else{
    // les chevaux de devant
    for(const h of horses)if(h.z>0)plHorse(g,h,t,deck,rimY,on);
    // la bordure du plancher, devant, et sa marche
    {const DR=R+46,DY=432;g.fillStyle='#c8302a';g.beginPath();g.moveTo(cx-DR,DY);g.ellipse(cx,DY,DR,26,0,Math.PI,0,true);g.lineTo(cx+DR,DY+22);g.ellipse(cx,DY+22,DR,26,0,0,Math.PI);g.closePath();g.fill();
      g.strokeStyle='#e8c860';g.lineWidth=2.5;g.beginPath();g.ellipse(cx,DY,DR,26,0,0,Math.PI);g.stroke();g.strokeStyle='#8a1e1a';g.lineWidth=2;g.beginPath();g.ellipse(cx,DY+22,DR,26,0,0,Math.PI);g.stroke();
      for(let k=0;k<18;k++){const a=Math.PI*(k+.5)/18,x=cx+Math.cos(a)*DR,y=DY+11+Math.sin(a)*26,lit=on&&((k+Math.floor(t*4))%3!==0);g.fillStyle=lit?'#fff2c0':'#c8a050';g.beginPath();g.arc(x,y,3,0,7);g.fill();if(lit){g.fillStyle='rgba(255,236,170,.3)';g.beginPath();g.arc(x,y,6,0,7);g.fill()}}}
    // le chapiteau : toit conique rayé, lambrequins, fanion, ampoules
    const cr=R+50,ap=150;
    for(let k=0;k<16;k++){const a0=Math.PI+k*Math.PI/16,a1=a0+Math.PI/16,xA=cx+Math.cos(a0)*cr,xB=cx+Math.cos(a1)*cr;g.fillStyle=k%2?'#f2ece0':'#c8302a';poly(g,[cx,ap,xA,rimY,xB,rimY]);g.fill()}
    g.fillStyle='rgba(0,0,0,.12)';poly(g,[cx,ap,cx+cr,rimY,cx+cr*.3,rimY]);g.fill();
    g.fillStyle='#e8c860';g.fillRect(cx-cr,rimY-4,cr*2,10);
    for(let k=0;k<22;k++){const x=cx-cr+k*(cr*2/22);g.fillStyle=k%2?'#2a4a9a':'#c8302a';g.beginPath();g.moveTo(x,rimY+6);g.lineTo(x+cr*2/22,rimY+6);g.lineTo(x+cr/22,rimY+26);g.closePath();g.fill();g.fillStyle='#e8c860';g.beginPath();g.arc(x+cr/22,rimY+26,2,0,7);g.fill()}
    for(let k=0;k<26;k++){const x=cx-cr+6+k*((cr*2-12)/25),lit=on&&((k+Math.floor(t*5))%3!==0);g.fillStyle=lit?'#fff2c0':'#8a8268';g.beginPath();g.arc(x,rimY+1,2.6,0,7);g.fill();if(lit){g.fillStyle='rgba(255,236,170,.35)';g.beginPath();g.arc(x,rimY+1,6,0,7);g.fill()}}
    g.fillStyle='#e8c860';g.beginPath();g.arc(cx,ap-2,6,0,7);g.fill();g.strokeStyle='#3a3a3a';g.lineWidth=1.6;g.beginPath();g.moveTo(cx,ap-6);g.lineTo(cx,ap-36);g.stroke();
    g.fillStyle='#c8302a';const fl=on?Math.sin(t*4)*4:0;poly(g,[cx,ap-36,cx+28,ap-30+fl,cx,ap-24]);g.fill();
    // l'enseigne
    g.fillStyle='#2a4a9a';rr(g,cx-84,rimY+30,168,20,6);g.fill();g.strokeStyle='#e8c860';g.lineWidth=2;rr(g,cx-84,rimY+30,168,20,6);g.stroke();g.fillStyle='#f6eed8';g.font='bold 12px '+F_DISP;g.textAlign='center';g.fillText('CHEVAUX DE BOIS',cx,rimY+45);
    if(!on){g.fillStyle='rgba(30,30,40,.25)';poly(g,[cx,ap,cx-cr,rimY,cx+cr,rimY]);g.fill()}
  }
  g.restore()}
const PL_HORSE_COL=[['#f4f0e6','#c8302a','#e8c060'],['#3a2a20','#2a5a9a','#e8c060'],['#e8d8b8','#2a7a4a','#c8302a'],['#a86a3a','#e8c060','#2a4a9a'],['#f4f0e6','#7a3aa8','#e8c060'],['#5a5a62','#c8302a','#f2ece0'],['#e8c890','#2a5a9a','#c8302a'],['#f4f0e6','#2a7a4a','#e8c060']];
function plHorse(g,h,t,deck,rimY,on){const m=h.m,z=h.z,s=.82+.24*(z+1)/2,x=h.x,sy=m.sy,dark=z<0?.38:0,cols=PL_HORSE_COL[h.k];
  // la barre torsadée, du chapiteau au plancher
  const py0=rimY+8+z*-4,py1=432+z*22;g.fillStyle=mix('#d8b450','#2a2010',dark);g.fillRect(x-2.5*s,py0,5*s,py1-py0);g.strokeStyle=mix('#f8e8a0','#2a2010',dark);g.lineWidth=1.2;for(let y=py0;y<py1;y+=8){g.beginPath();g.moveTo(x-2.5*s,y);g.lineTo(x+2.5*s,y+5);g.stroke()}
  const key='pl-horse'+h.k+(z<0?'b':'');const dir=Math.sin(h.th)>0?1:-1;
  g.save();g.translate(x,sy+22);g.scale(s*dir,s);fSpr(g,key,120,90,60,60,0,0,g2=>plHorseArt(g2,cols,dark));g.restore();
  if(L.pl.riders.includes(h.k)){g.save();g.translate(x,sy);g.scale(s,s);const R=mulberry(h.k*11);g.fillStyle=mix(pick2(R,PL_COAT),'#000000',dark);rr(g,-9,-34,18,26,6);g.fill();g.fillStyle=mix(pick2(R,PL_SKIN),'#000000',dark);g.beginPath();g.arc(0,-42,8,0,7);g.fill();g.fillStyle=mix(pick2(R,PL_HAIR),'#000000',dark);g.beginPath();g.arc(0,-45,8,Math.PI,0);g.fill();
    g.strokeStyle=mix('#2a2c34','#000000',dark);g.lineWidth=4;g.lineCap='round';g.beginPath();g.moveTo(-4,-10);g.lineTo(-8,6);g.moveTo(4,-10);g.lineTo(8,6);g.stroke();if(on&&z>0){g.strokeStyle=mix(pick2(R,PL_SKIN),'#000000',dark);g.lineWidth=3;g.beginPath();g.moveTo(6,-30);g.lineTo(16,-44-Math.sin(t*6+h.k)*4);g.stroke()}g.restore()}}
function plHorseArt(g,c,dark){const[coat,saddle,gold]=c.map(v=>mix(v,'#000000',dark));const dk=shade(coat,-.25);
  g.lineCap='round';g.lineJoin='round';
  // les pattes, au galop
  g.strokeStyle=dk;g.lineWidth=6;g.beginPath();g.moveTo(-22,0);g.quadraticCurveTo(-36,8,-44,2);g.moveTo(-16,2);g.quadraticCurveTo(-26,14,-34,14);g.moveTo(18,0);g.quadraticCurveTo(30,-4,36,8);g.moveTo(22,2);g.quadraticCurveTo(30,8,26,18);g.stroke();
  g.fillStyle=gold;for(const[hx,hy]of[[-44,2],[-34,14],[36,8],[26,18]]){g.beginPath();g.arc(hx,hy,3,0,7);g.fill()}
  // le corps, l'encolure, la tête
  g.fillStyle=coat;g.beginPath();g.ellipse(0,-6,30,13,0,0,7);g.fill();
  g.beginPath();g.moveTo(18,-14);g.quadraticCurveTo(26,-34,34,-40);g.lineTo(42,-34);g.quadraticCurveTo(34,-22,30,-4);g.closePath();g.fill();
  g.beginPath();g.moveTo(32,-42);g.quadraticCurveTo(46,-44,52,-32);g.quadraticCurveTo(50,-26,44,-28);g.quadraticCurveTo(38,-30,36,-26);g.closePath();g.fill();
  poly(g,[33,-42,34,-52,38,-43]);g.fill();
  g.fillStyle='#1a1a1a';g.beginPath();g.arc(42,-36,1.8,0,7);g.fill();g.beginPath();g.arc(50,-30,1.2,0,7);g.fill();
  // la crinière dorée, la queue
  g.fillStyle=gold;g.beginPath();g.moveTo(20,-16);g.quadraticCurveTo(22,-38,34,-46);g.quadraticCurveTo(28,-32,26,-14);g.closePath();g.fill();
  for(let k=0;k<4;k++){g.beginPath();g.ellipse(24+k*3,-22-k*6,3,6,.6,0,7);g.fill()}
  g.beginPath();g.moveTo(-28,-10);g.quadraticCurveTo(-46,-12,-50,4);g.quadraticCurveTo(-42,-2,-30,-2);g.closePath();g.fill();
  // la selle, la bride, les rênes, les ornements
  g.fillStyle=saddle;g.beginPath();g.ellipse(-2,-18,13,5,0,0,7);g.fill();rr(g,-12,-18,20,14,4);g.fill();g.fillStyle=gold;g.fillRect(-12,-6,20,2);g.beginPath();g.arc(-2,-12,3,0,7);g.fill();
  g.strokeStyle=saddle;g.lineWidth=2;g.beginPath();g.moveTo(36,-40);g.lineTo(48,-30);g.moveTo(40,-28);g.quadraticCurveTo(20,-26,8,-20);g.stroke();
  g.strokeStyle=gold;g.lineWidth=1.5;g.beginPath();g.moveTo(-26,-2);g.quadraticCurveTo(0,6,26,-2);g.stroke();for(let k=0;k<5;k++){g.fillStyle=gold;g.beginPath();g.arc(-20+k*10,1+Math.sin(k)*1.5,1.8,0,7);g.fill()}
  g.fillStyle='rgba(255,255,255,.18)';g.beginPath();g.ellipse(-4,-12,20,4,0,0,7);g.fill()}
/* les obstacles de la rue */
function plProp(g,p){const x=p.c0*T,w=(p.c1-p.c0+1)*T,y=p.r0*T,h=PLF-y;g.save();
  if(p.k==='crate'){const R=mulberry(p.c0*13+p.r0);for(let r=p.r0;r<PLG;r++)for(let c=p.c0;c<=p.c1;c++)plCrate(g,c*T+(r===p.r0&&p.r0<PLG-1?2:0),r*T,R,r===p.r0,p.tomates)}
  else if(p.k==='pallet'){const R=mulberry(p.c0*7);for(let c=p.c0;c<=p.c1;c++){const bx=c*T;for(let k=0;k<3;k++){g.fillStyle=mix('#b89a68','#8a6a42',R());g.fillRect(bx+1,y+4+k*13,T-2,5);g.fillStyle='rgba(255,255,255,.14)';g.fillRect(bx+1,y+4+k*13,T-2,1.2)}
    g.fillStyle='#7a5a36';for(const px of[bx+3,bx+T/2-3,bx+T-9])g.fillRect(px,y+9,6,h-9);g.fillStyle='rgba(0,0,0,.35)';for(const px of[bx+9,bx+T/2+3])g.fillRect(px,y+9,T/2-12,h-9)}}
  else if(p.k==='barrel'){// tonneau : douelles bombées, trois cercles de fer, fond cerclé
    const cx=x+w/2,bw=w-8;g.fillStyle='#7a4a26';g.beginPath();g.moveTo(cx-bw/2+3,y+4);g.quadraticCurveTo(cx-bw/2-4,y+h/2,cx-bw/2+3,PLF);g.lineTo(cx+bw/2-3,PLF);g.quadraticCurveTo(cx+bw/2+4,y+h/2,cx+bw/2-3,y+4);g.closePath();g.fill();
    g.strokeStyle='rgba(40,20,8,.45)';g.lineWidth=1;for(let k=-2;k<=2;k++){g.beginPath();g.moveTo(cx+k*6,y+4);g.quadraticCurveTo(cx+k*7.6,y+h/2,cx+k*6,PLF);g.stroke()}
    g.fillStyle='rgba(255,220,170,.14)';g.beginPath();g.moveTo(cx-10,y+5);g.quadraticCurveTo(cx-14,y+h/2,cx-10,PLF-2);g.lineTo(cx-5,PLF-2);g.quadraticCurveTo(cx-8,y+h/2,cx-5,y+5);g.fill();
    for(const hy of[y+8,y+h/2,PLF-6]){const bul=hy===y+h/2?4:1;g.fillStyle='#3a3a40';g.fillRect(cx-bw/2-bul+2,hy-2,bw+bul*2-4,4);g.fillStyle='rgba(200,200,210,.45)';g.fillRect(cx-bw/2-bul+3,hy-2,bw+bul*2-6,1)}
    g.fillStyle='#8a5a32';g.beginPath();g.ellipse(cx,y+4,bw/2-3,4,0,0,7);g.fill();g.strokeStyle='#3a3a40';g.lineWidth=1.6;g.beginPath();g.ellipse(cx,y+4,bw/2-3,4,0,0,7);g.stroke();
    g.strokeStyle='rgba(40,20,8,.4)';g.lineWidth=1;g.beginPath();g.moveTo(cx-bw/2+6,y+4);g.lineTo(cx+bw/2-6,y+4);g.stroke()}
  else if(p.k==='basket'){g.fillStyle='#b8925a';poly(g,[x+3,y+6,x+w-3,y+6,x+w-7,y+h,x+7,y+h]);g.fill();g.strokeStyle='rgba(80,50,20,.5)';g.lineWidth=1;for(let k=0;k<5;k++){g.beginPath();g.moveTo(x+4,y+10+k*6);g.lineTo(x+w-4,y+10+k*6);g.stroke()}for(let k=0;k<5;k++){g.fillStyle='#d83a2a';g.beginPath();g.arc(x+8+k*6,y+5,4,0,7);g.fill()}}
  else if(p.k==='table'){g.fillStyle='#d8d0c0';g.fillRect(x,y+2,w,6);g.strokeStyle='#8a8a8a';g.lineWidth=2;g.beginPath();g.moveTo(x+8,y+8);g.lineTo(x+w-8,PLF);g.moveTo(x+w-8,y+8);g.lineTo(x+8,PLF);g.stroke();g.fillStyle='#b8925a';g.fillRect(x+10,y-10,24,12);g.fillRect(x+w-36,y-10,24,12)}
  else if(p.k==='bin'){g.fillStyle='#3a5a3a';rr(g,x+6,y+6,w-12,h-6,4);g.fill();g.fillStyle='#2a4a2a';g.fillRect(x+3,y+2,w-6,7);g.fillStyle='rgba(255,255,255,.1)';g.fillRect(x+10,y+12,4,h-18)}
  else if(p.k==='van')plVan(g,x,PLF,w,PLF-y);
  else if(p.k==='bench'){g.fillStyle='#2e4a3a';g.fillRect(x+2,y+4,w-4,6);g.fillRect(x+2,y-18,w-4,5);g.fillRect(x+2,y-8,w-4,5);g.fillStyle='#222';for(const lx of[x+8,x+w-12]){g.fillRect(lx,y+10,4,h-10);g.fillRect(lx,y-20,3,24)}}
  g.restore()}
function plCrate(g,bx,by,R,top,tom){// cagette de marché : lattes, montants d'angle, pointes, étiquette, et ce qu'il y a dedans
  const wood=mix('#d0aa72','#a8804c',R());g.save();
  g.fillStyle='#3a2816';g.fillRect(bx+2,by+2,T-4,T-2);
  if(top){const col=tom?'#d8302a':pick2(R,['#d83a2a','#f0a020','#7ab83a','#e8d83a','#a8302a']);for(let k=0;k<5;k++){g.fillStyle=shade(col,(k%2)*-.12);g.beginPath();g.arc(bx+7+k*6.5,by+5-(k%2)*2,5,0,7);g.fill();g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.arc(bx+5.5+k*6.5,by+3-(k%2)*2,1.4,0,7);g.fill()}
    if(tom){g.fillStyle='#3a7a2a';for(let k=0;k<5;k++)poly(g,[bx+5+k*6.5,by+1-(k%2)*2,bx+7+k*6.5,by-2-(k%2)*2,bx+9+k*6.5,by+1-(k%2)*2]);g.fill()}
    if(col==='#7ab83a'){g.strokeStyle='#4a7a2a';g.lineWidth=1.2;for(let k=0;k<3;k++){g.beginPath();g.moveTo(bx+10+k*9,by+2);g.lineTo(bx+8+k*9,by-6);g.stroke()}}}
  for(let k=0;k<3;k++){const sy=by+6+k*11.5;g.fillStyle=shade(wood,k%2?-.06:.04);g.fillRect(bx+2,sy,T-4,8);g.fillStyle='rgba(255,255,255,.16)';g.fillRect(bx+2,sy,T-4,1.4);g.fillStyle='rgba(0,0,0,.18)';g.fillRect(bx+2,sy+7,T-4,1)}
  g.fillStyle=shade(wood,-.2);g.fillRect(bx+2,by+2,5,T-2);g.fillRect(bx+T-7,by+2,5,T-2);g.fillStyle='rgba(255,255,255,.12)';g.fillRect(bx+2,by+2,1.4,T-2);g.fillRect(bx+T-7,by+2,1.4,T-2);
  g.fillStyle='#4a4a4a';for(const yy of[9,20.5,32]){g.fillRect(bx+4,by+yy,1.5,1.5);g.fillRect(bx+T-5.5,by+yy,1.5,1.5)}
  if(R()<.65){g.fillStyle='#f2ead2';g.fillRect(bx+10,by+18,T-20,9);const c2=pick2(R,['#c8302a','#2a5a9a','#2a6a3a']);g.fillStyle=c2;g.fillRect(bx+10,by+18,T-20,2.2);g.fillRect(bx+13,by+22.5,T-26,1.2);g.fillRect(bx+15,by+24.6,T-30,1)}
  g.fillStyle='rgba(0,0,0,.25)';g.fillRect(bx+2,by+T-2,T-4,2);g.restore()}
function plVan(g,x,b,w,h){// la camionnette des primeurs Garnier : cabine à droite, porte arrière ouverte côté marchand, cagettes dedans ; son toit porte
  g.save();const top=b-h;
  g.fillStyle='rgba(0,0,0,.28)';g.beginPath();g.ellipse(x+w/2,b,w/2+8,7,0,0,7);g.fill();
  // la caisse et la cabine
  g.fillStyle='#e8e4dc';rr(g,x,top,w-56,h-22,6);g.fill();g.fillStyle='rgba(0,0,0,.08)';g.fillRect(x,top+h-34,w-56,12);
  g.fillStyle='#d8d4cc';poly(g,[x+w-58,top+14,x+w-22,top+26,x+w-4,top+62,x+w-4,b-22,x+w-58,b-22]);g.fill();
  g.fillStyle='rgba(40,50,70,.8)';poly(g,[x+w-52,top+22,x+w-26,top+32,x+w-12,top+60,x+w-52,top+60]);g.fill();g.fillStyle='rgba(255,255,255,.18)';poly(g,[x+w-48,top+24,x+w-40,top+27,x+w-46,top+56,x+w-52,top+56]);g.fill();
  g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=1;g.strokeRect(x+w-52,top+64,24,b-22-top-70);g.fillStyle='#8a8e96';g.fillRect(x+w-32,top+82,6,2);
  g.fillStyle='#3a3a40';g.fillRect(x+w-8,b-40,8,10);g.fillStyle='#f6f0c8';g.fillRect(x+w-6,b-52,5,8);
  // l'enseigne peinte
  g.fillStyle='#2a6a4a';g.fillRect(x+4,top+h*.52,w-64,8);g.fillStyle='#2a4a2a';g.textAlign='center';fitText(g,'PRIMEURS GARNIER',x+(w-56)/2,top+30,w-76,12);
  g.font='italic 9px '+F_BODY;g.fillText('Crécy-la-Chapelle',x+(w-56)/2,top+44);
  // la porte arrière ouverte, côté gauche, avec des cagettes dedans
  g.fillStyle='#2a2a2e';g.fillRect(x+2,top+8,34,h-38);g.fillStyle='#b8925a';for(let k=0;k<3;k++){g.fillRect(x+5,b-56-k*22,28,18);g.fillStyle='rgba(60,40,20,.5)';g.fillRect(x+5,b-48-k*22,28,1.5);g.fillStyle='#b8925a'}
  g.fillStyle='#d8d4cc';g.fillRect(x-22,top+6,22,h-36);g.strokeStyle='rgba(0,0,0,.2)';g.strokeRect(x-22,top+6,22,h-36);
  // le toit, les roues
  g.fillStyle='#c8c4bc';g.fillRect(x-2,top-3,w-52,5);
  for(const wx of[x+36,x+w-36]){g.fillStyle='#1a1a1e';g.beginPath();g.arc(wx,b-12,14,0,7);g.fill();g.fillStyle='#8a8e96';g.beginPath();g.arc(wx,b-12,5.5,0,7);g.fill()}
  g.restore()}
function plPuddle(g,x,w,t){g.save();g.fillStyle='rgba(150,160,190,.35)';g.beginPath();g.ellipse(x,PLF+6,w,6,0,0,7);g.fill();g.strokeStyle='rgba(220,230,250,.4)';g.lineWidth=1;
  for(let k=0;k<3;k++){const ph=(t*1.4+k/3+x*.01)%1;g.globalAlpha=1-ph;g.beginPath();g.ellipse(x-w*.4+((k*37+x)%w)*.8,PLF+6,3+ph*14,1+ph*3,0,0,7);g.stroke()}g.restore()}
/* une personne : de profil (visage : œil, sourcil, nez, bouche qui parle, oreille), ou de dos quand elle parle au marchand */
function plFace(g,p,t,dark,talk){const sk=mix(p.skin,'#2a2020',dark*.6),hr=mix(p.hair,'#000000',dark);
  // oreille, nez
  g.fillStyle=shade(sk,-.12);g.beginPath();g.ellipse(-1.5,-113,2.6,3.4,0,0,7);g.fill();
  g.fillStyle=sk;g.beginPath();g.moveTo(11.5,-118);g.quadraticCurveTo(16,-112.5,12,-111);g.closePath();g.fill();
  g.strokeStyle=shade(sk,-.25);g.lineWidth=.8;g.beginPath();g.moveTo(13.5,-113.5);g.quadraticCurveTo(15,-111.6,12.2,-111.2);g.stroke();
  // l'œil (il cligne), le sourcil
  const sur=(p.surp||0)>0,blink=!sur&&((t*.9+p.ph*1.7)%4.2)<.13;
  if(blink){g.strokeStyle='#2a1a14';g.lineWidth=1;g.beginPath();g.moveTo(5.6,-115.6);g.lineTo(9.4,-115.6);g.stroke()}
  else{g.fillStyle='#f6f2ea';g.beginPath();g.ellipse(7.6,-116,2.5,sur?3:2,0,0,7);g.fill();g.fillStyle='#2a1a14';g.beginPath();g.arc(8.6,-116,1.25,0,7);g.fill();g.fillStyle='rgba(255,255,255,.8)';g.fillRect(8.8,-116.9,.6,.6)}
  g.strokeStyle=hr;g.lineWidth=1.3;g.lineCap='round';g.beginPath();g.moveTo(5,-119.6+p.brow*.4-(sur?2.4:0));g.lineTo(10,-120.4-p.brow*.5-(sur?3:0));g.stroke();
  if(p.glass){g.strokeStyle='#3a3a3a';g.lineWidth=.8;g.beginPath();g.arc(7.8,-116,3.2,0,7);g.moveTo(4.6,-116);g.lineTo(-.5,-115);g.stroke()}
  // la bouche : elle parle, sourit, ou reste neutre selon l'humeur
  const mx=10.2,my=-107.6;
  if(sur){g.fillStyle='#4a1a1a';g.beginPath();g.ellipse(mx,my+.6,1.6,2.4,0,0,7);g.fill()}
  else if(talk){const o=Math.max(0,Math.sin(t*15+p.ph*3));g.fillStyle='#5a2020';g.beginPath();g.ellipse(mx,my,1.8,.5+o*1.5,0,0,7);g.fill()}
  else if(p.mood>.55){g.strokeStyle='#6a3028';g.lineWidth=1;g.beginPath();g.moveTo(mx-2.2,my-.6);g.quadraticCurveTo(mx-.2,my+1.6,mx+1.8,my-.9);g.stroke()}
  else{g.strokeStyle='#6a3028';g.lineWidth=1;g.beginPath();g.moveTo(mx-1.8,my);g.lineTo(mx+1.4,my-.2);g.stroke()}
  if(p.must){g.fillStyle=hr;g.beginPath();g.ellipse(10.4,-110,3.2,1.4,-.1,0,7);g.fill()}
  if(p.fem||p.kid){g.fillStyle='rgba(230,110,110,.25)';g.beginPath();g.arc(6.5,-110.5,2.4,0,7);g.fill()}}
function plPersonDraw(g,p,t,S2){const F=PLF,x=p.x,f=p.f,s=p.h/120,dark=S2.pass===3?.25:0;g.save();
  // les danseurs font un tour sur eux-mêmes, de temps en temps
  let spin=1;if(p.kind==='dance'){const c=(S2.beat*.9+p.ph)%7;if(c<.7)spin=Math.cos(c/.7*Math.PI*2)}
  const kidHop=p.kind==='kid'?Math.max(0,Math.sin(p.t*5+p.ph))**3*-4:0,danceBob=p.kind==='dance'?-Math.abs(Math.sin(S2.beat*2.6+p.ph))*3:0;
  g.translate(x,F+kidHop+danceBob);g.scale((p.back?1:f)*s*(Math.abs(spin)<.15?.15*Math.sign(spin||1):spin),s);
  const moving=p.walk||p.st==='step',walk=moving?Math.sin(p.wph):p.kind==='dance'?Math.sin(S2.beat*2.6+p.ph)*.35:0;
  const coat=mix(p.coat,'#1a1c24',dark),leg=mix(p.leg,'#000000',dark),skin=mix(p.skin,'#2a2020',dark*.6),hair=mix(p.hair,'#000000',dark);
  // parle-t-on ? (deux voisins face à face se répondent ; de dos, on parle au marchand)
  const talk=p.kind==='buy'&&p.st==='stand'&&Math.sin(t*.55+p.ph*2.1)>.15;
  if(p.back){// ---- de dos ----
    g.strokeStyle=leg;g.lineWidth=8;g.lineCap='round';g.beginPath();g.moveTo(-5,-48);g.lineTo(-6,-4);g.moveTo(5,-48);g.lineTo(6,-4);g.stroke();
    g.fillStyle='#1e1c1a';g.beginPath();g.ellipse(-6,-2,5,3.5,0,0,7);g.ellipse(6,-2,5,3.5,0,0,7);g.fill();
    g.fillStyle=coat;if(p.fem){poly(g,[-13,-98,13,-98,19,-38,-19,-38]);g.fill();rr(g,-14,-104,28,30,8);g.fill()}else{rr(g,-15,-104,30,60,9);g.fill()}
    g.fillStyle='rgba(0,0,0,.12)';g.fillRect(-.6,-100,1.2,54);
    // les bras : l'un montre la marchandise, ou tient le panier
    const gest=talk?Math.sin(t*3+p.ph)*.5:0;g.strokeStyle=coat;g.lineWidth=7;g.beginPath();g.moveTo(-12,-96);g.lineTo(-15,-62);g.moveTo(12,-96);
    if(talk){g.lineTo(18+gest*4,-118-gest*10)}else g.lineTo(15,-62);g.stroke();
    if(talk){g.fillStyle=skin;g.beginPath();g.arc(18+gest*4,-120-gest*10,3.5,0,7);g.fill()}
    if(p.item==='panier'){g.fillStyle='#b8925a';poly(g,[-26,-66,-6,-66,-9,-48,-23,-48]);g.fill();g.strokeStyle='#8a6a3a';g.lineWidth=1.6;g.beginPath();g.arc(-16,-66,9,Math.PI,0);g.stroke()}
    else if(p.item==='cabas'){g.fillStyle=mix('#3a6a4a','#000000',dark);rr(g,-26,-64,16,22,3);g.fill()}
    else if(p.item==='ballon'){g.strokeStyle='#eaeaea';g.lineWidth=1;g.beginPath();g.moveTo(-14,-60);g.lineTo(-10+Math.sin(p.t*1.3)*4,-140);g.stroke();g.fillStyle=p.bal;g.beginPath();g.ellipse(-10+Math.sin(p.t*1.3)*4,-152,11,14,0,0,7);g.fill()}
    // la tête de dos : cheveux, oreilles, nuque ; elle hoche quand on parle
    const nod=talk?Math.sin(t*4+p.ph)*1.2:0;g.translate(0,nod);
    g.fillStyle=skin;g.fillRect(-4,-106,8,6);g.beginPath();g.ellipse(-11,-114,2.4,3.4,0,0,7);g.ellipse(11,-114,2.4,3.4,0,0,7);g.fill();
    g.fillStyle=hair;g.beginPath();g.arc(0,-115,11,0,7);g.fill();if(p.fem){rr(g,-11,-116,22,18,6);g.fill()}
    plHat(g,p,dark,true);g.restore();return}
  // ---- de profil ----
  g.strokeStyle=leg;g.lineWidth=8;g.lineCap='round';g.beginPath();g.moveTo(-3,-48);g.lineTo(-3+walk*12,-4);g.moveTo(3,-48);g.lineTo(3-walk*12,-4);g.stroke();
  g.fillStyle='#1e1c1a';g.beginPath();g.ellipse(1+walk*12,-2,7,3.5,0,0,7);g.ellipse(7-walk*12,-2,7,3.5,0,0,7);g.fill();
  g.fillStyle=coat;if(p.fem){poly(g,[-12,-98,12,-98,18,-38,-18,-38]);g.fill();rr(g,-12,-104,24,30,8);g.fill()}else{rr(g,-13,-104,26,60,8);g.fill()}
  g.fillStyle='rgba(255,255,255,.1)';g.fillRect(-11,-100,4,50);
  if(p.old){g.strokeStyle='#5a3a22';g.lineWidth=3;g.beginPath();g.moveTo(14,-60);g.lineTo(22,0);g.stroke()}
  // la tête
  g.fillStyle=skin;g.fillRect(-1,-106,7,6);g.beginPath();g.arc(2,-114,11,0,7);g.fill();
  g.fillStyle=hair;if(p.fem){g.beginPath();g.arc(1,-117,12,Math.PI*.92,Math.PI*1.95);g.fill();g.beginPath();g.ellipse(-7,-108,6,11,0,0,7);g.fill()}
  else{g.beginPath();g.moveTo(10,-121);g.quadraticCurveTo(2,-129,-8,-121);g.quadraticCurveTo(-11,-114,-8,-108);g.lineTo(-4,-110);g.quadraticCurveTo(-3,-118,6,-120);g.closePath();g.fill()}
  plFace(g,p,t,dark,talk&&!p.back);
  plHat(g,p,dark,false);
  // bras, et ce qu'on tient
  g.strokeStyle=coat;g.lineWidth=7;
  if(p.kind==='dance'){const a=Math.sin(S2.beat*2.6+p.ph);g.beginPath();g.moveTo(-6,-96);g.lineTo(-16,-122-a*8);g.moveTo(6,-96);g.lineTo(18,-120+a*8);g.stroke()}
  else if(p.item==='parapluie'){// tenu bas, juste au-dessus du chapeau ; il plie un peu quand un pigeon tombe dessus
    const dp=(p.dip||0)*8;g.beginPath();g.moveTo(6,-96);g.lineTo(13,-110+dp*.5);g.stroke();g.strokeStyle='#2a2a2a';g.lineWidth=2;g.beginPath();g.moveTo(14,-108+dp*.5);g.lineTo(14,-150+dp);g.stroke();
    g.beginPath();g.moveTo(14,-112+dp*.5);g.quadraticCurveTo(20,-108+dp*.5,18,-104+dp*.5);g.stroke();
    const uc=mix(p.bal,'#000000',.2);g.fillStyle=uc;g.beginPath();g.moveTo(-32,-132+dp);g.quadraticCurveTo(14,-170+dp*1.6,60,-132+dp);for(let k=0;k<4;k++)g.quadraticCurveTo(48-k*23,-138+dp,37-k*23,-132+dp);g.closePath();g.fill();
    g.strokeStyle=shade(uc,-.3);g.lineWidth=1;for(const k of[-.6,0,.6]){g.beginPath();g.moveTo(14,-153+dp*1.3);g.quadraticCurveTo(14+k*30,-148+dp,14+k*46,-133+dp);g.stroke()}
    g.fillStyle='#2a2a2a';g.fillRect(13,-158+dp*1.3,2,6)}
  else if(p.item==='caisse'){g.beginPath();g.moveTo(6,-96);g.lineTo(18,-74);g.stroke();g.fillStyle='#b8925a';g.fillRect(8,-86,34,24);g.strokeStyle='rgba(60,40,20,.6)';g.lineWidth=1.2;g.strokeRect(8,-86,34,24);for(let k=0;k<4;k++){g.fillStyle=['#d83a2a','#7ab83a','#f0a020','#e8d83a'][(k+(p.x0|0))%4];g.beginPath();g.arc(14+k*8,-88,4,0,7);g.fill()}}
  else if(p.item==='sandwich'){const e=Math.max(0,Math.sin(p.t*1.6+p.ph));g.beginPath();g.moveTo(6,-96);g.lineTo(14,-90-e*14);g.stroke();g.fillStyle='#d8a050';rr(g,10,-100-e*14,18,7,3);g.fill()}
  else if(talk){const gst=Math.sin(t*2.6+p.ph);g.beginPath();g.moveTo(6,-96);g.quadraticCurveTo(16,-82,20+gst*3,-90-Math.max(0,gst)*8);g.stroke();g.fillStyle=skin;g.beginPath();g.arc(21+gst*3,-92-Math.max(0,gst)*8,3.4,0,7);g.fill()}
  else{g.beginPath();g.moveTo(6,-96);g.lineTo(9+walk*6,-60);g.stroke();
    if(p.item==='panier'){g.fillStyle='#b8925a';poly(g,[0,-66,22,-66,19,-48,3,-48]);g.fill();g.strokeStyle='#8a6a3a';g.lineWidth=1.6;g.beginPath();g.arc(11,-66,10,Math.PI,0);g.stroke();g.fillStyle='#d83a2a';g.beginPath();g.arc(7,-68,3,0,7);g.arc(14,-68,3,0,7);g.fill();g.fillStyle='#4a8a3a';g.beginPath();g.arc(11,-70,3,0,7);g.fill()}
    else if(p.item==='cabas'){g.fillStyle=mix('#3a6a4a','#000000',dark);rr(g,2,-64,18,22,3);g.fill()}
    else if(p.item==='baguette'){g.fillStyle='#c8862e';g.save();g.translate(10,-62);g.rotate(-.9);rr(g,-3,-28,6,40,3);g.fill();g.restore()}
    else if(p.item==='sac'){g.fillStyle=mix('#6a3a2a','#000000',dark);rr(g,-16,-70,12,14,3);g.fill()}
    else if(p.item==='ballon'){g.strokeStyle='#eaeaea';g.lineWidth=1;g.beginPath();g.moveTo(9,-60);g.lineTo(12+Math.sin(p.t*1.3)*4,-150);g.stroke();g.fillStyle=p.bal;g.beginPath();g.ellipse(12+Math.sin(p.t*1.3)*4,-164,12,15,0,0,7);g.fill();g.fillStyle='rgba(255,255,255,.4)';g.beginPath();g.arc(8+Math.sin(p.t*1.3)*4,-170,3,0,7);g.fill()}
    else if(p.item==='glace'){g.fillStyle='#d8a860';poly(g,[6,-62,12,-62,9,-50]);g.fill();g.fillStyle='#f6c8d8';g.beginPath();g.arc(9,-65,4,0,7);g.fill()}}
  if(p.kind==='owner'){g.strokeStyle=coat;g.lineWidth=6;g.beginPath();g.moveTo(6,-96);g.lineTo(18,-66);g.stroke()}
  g.restore()}
function plHat(g,p,dark,back){const c=v=>mix(v,'#000000',dark);
  if(p.hat==='beret'){g.fillStyle=c('#1e2230');g.beginPath();g.ellipse(1,-124,13,5,-.1,0,7);g.fill();g.fillRect(0,-131,2,4)}
  else if(p.hat==='casquette'){g.fillStyle=c('#3a5a8a');g.beginPath();g.arc(1,-120,11.5,Math.PI,0);g.fill();if(!back)g.fillRect(4,-122,15,3)}
  else if(p.hat==='paille'){g.fillStyle=c('#e0c880');g.fillRect(-14,-124,30,3);g.fillRect(-7,-134,16,11);g.fillStyle=c('#c8302a');g.fillRect(-7,-127,16,3)}
  else if(p.hat==='foulard'){g.fillStyle=c('#c8402a');g.beginPath();g.arc(1,-117,12.5,Math.PI*.85,Math.PI*2.1);g.fill()}
  else if(p.hat==='bonnet'){g.fillStyle=c('#2a6a8a');g.beginPath();g.arc(1,-120,11.5,Math.PI,0);g.fill();g.beginPath();g.arc(1,-133,4,0,7);g.fill()}}
function plDog(g,d,t){const o=d.o,b=d.y,x=d.x;g.save();
  // la laisse, de la main du maître au collier
  const hx=o.x+o.f*18*(o.h/120),hy=PLF-66*(o.h/120);g.strokeStyle='#c8302a';g.lineWidth=1.6;g.beginPath();g.moveTo(hx,hy);const sag=d.st==='lunge'||d.st==='leap'?2:22;g.quadraticCurveTo((hx+x)/2,Math.max(hy,b-20)+sag,x+d.f*20,b-28);g.stroke();
  g.translate(x,b);g.scale(d.f,1);const run=d.st!=='walk'?1:.4,ph=Math.sin(t*(d.st==='walk'?9:18));
  g.fillStyle=d.col;g.beginPath();g.ellipse(0,-20,22,10,d.st==='leap'?-.35:0,0,7);g.fill();
  g.strokeStyle=d.col;g.lineWidth=5;g.lineCap='round';for(const[lx,s]of[[-14,1],[-7,-1],[9,-1],[15,1]]){g.beginPath();g.moveTo(lx,-14);g.lineTo(lx+ph*s*6*run,-1);g.stroke()}
  g.lineWidth=4;g.beginPath();g.moveTo(-20,-24);g.quadraticCurveTo(-30,-34,-28,-40+Math.sin(t*14)*3);g.stroke();
  g.fillStyle=d.col;g.beginPath();g.arc(22,-30,10,0,7);g.fill();g.beginPath();g.ellipse(31,-27,8,5.5,0,0,7);g.fill();g.fillStyle=shade(d.col,-.3);g.beginPath();g.ellipse(17,-36,4.5,9,-.5,0,7);g.fill();
  g.fillStyle='#111';g.beginPath();g.arc(38,-29,2.4,0,7);g.arc(24,-33,1.6,0,7);g.fill();
  if(d.st!=='walk'){g.fillStyle='#8a2a2a';g.beginPath();g.moveTo(29,-23);g.lineTo(40,-22);g.lineTo(33,-18);g.closePath();g.fill();g.fillStyle='#f2f0ea';g.fillRect(32,-25,2,2);g.fillRect(36,-25,2,2)}
  g.fillStyle='#c8302a';g.fillRect(13,-27,7,3.5);g.restore()}
function plCat(g,c,t){// chat roulé en boule qui dort ; les yeux s'entrouvrent quand on approche ; coup de patte si on s'arrête à côté
  const x=c.x,y=c.y,col=c.col,rim=shade(col,.2),br=Math.sin(t*1.6+c.t)*.8,swp=c.sw>0?Math.sin((1-c.sw/.55)*Math.PI):0;g.save();g.translate(x,y);g.scale(c.f,1);
  g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(0,0,24,4,0,0,7);g.fill();
  // la queue qui fait le tour, le corps en boule qui respire
  g.strokeStyle=col;g.lineWidth=6;g.lineCap='round';g.beginPath();g.moveTo(-16,-5);g.quadraticCurveTo(-4,4,14,-1);g.stroke();
  g.fillStyle=col;g.beginPath();g.ellipse(-2,-11,21,11+br,0,0,7);g.fill();
  if(c.stripes){g.strokeStyle='rgba(90,40,10,.55)';g.lineWidth=2.2;for(let k=-14;k<10;k+=6){g.beginPath();g.moveTo(k,-21);g.quadraticCurveTo(k+2,-15,k+1,-6);g.stroke()}}
  g.strokeStyle=rim;g.lineWidth=1;g.beginPath();g.ellipse(-2,-11,21,11+br,0,Math.PI*1.1,Math.PI*1.9);g.stroke();
  // la patte qui griffe
  if(swp>0){g.strokeStyle=col;g.lineWidth=5;g.beginPath();g.moveTo(10,-10);g.lineTo(16+swp*16,-14-swp*12);g.stroke();g.strokeStyle='#f2f0ea';g.lineWidth=1;for(let k=-1;k<=1;k++){g.beginPath();g.moveTo(18+swp*16,-15-swp*12+k*2);g.lineTo(23+swp*16,-17-swp*12+k*3);g.stroke()}}
  // la tête posée sur les pattes, les oreilles
  const hy=-10-c.eye*5;g.fillStyle=col;g.beginPath();g.ellipse(14,hy,9,7.5,0,0,7);g.fill();poly(g,[8,hy-5,9,hy-13,13,hy-6]);g.fill();poly(g,[14,hy-6,18,hy-13,20,hy-4]);g.fill();
  g.fillStyle='#e8a0a0';poly(g,[9.5,hy-6,10,hy-10.5,12.5,hy-6.5]);g.fill();
  // les yeux : deux traits qui dorment, puis deux fentes jaunes qui s'ouvrent
  if(c.eye<.15){g.strokeStyle='#1a1410';g.lineWidth=1.2;for(const ex of[12,18]){g.beginPath();g.arc(ex,hy-1,2.2,.2,Math.PI-.2);g.stroke()}}
  else{const o=c.eye*2.6;for(const ex of[12,18]){g.fillStyle='#d8e04a';g.beginPath();g.ellipse(ex,hy-1,2.6,o,0,0,7);g.fill();g.fillStyle='#111';g.beginPath();g.ellipse(ex+.4,hy-1,.8,o*.9,0,0,7);g.fill()}}
  g.fillStyle='#d88a8a';poly(g,[21.5,hy+1,23,hy+2,21.5,hy+3]);g.fill();
  if(c.sw>0){g.strokeStyle='#f2f0ea';g.lineWidth=.8;g.beginPath();g.moveTo(20,hy+4);g.lineTo(22,hy+6);g.lineTo(24,hy+4);g.stroke()}
  g.restore()}
function plRoofRat(g,r,t){g.save();g.translate(r.x,8*T-2);g.scale(r.f,1);const run=r.pause>0?0:Math.sin(t*22);
  g.strokeStyle='#8a6a6a';g.lineWidth=1.6;g.beginPath();g.moveTo(-10,-4);g.quadraticCurveTo(-22,-2,-26,-8+Math.sin(t*4)*2);g.stroke();
  g.fillStyle='#4a4448';g.beginPath();g.ellipse(0,-6,11,6,0,0,7);g.fill();g.beginPath();g.ellipse(10,-7,6,4,.2,0,7);g.fill();g.fillStyle='#d8a0a0';g.beginPath();g.arc(7,-11,2.4,0,7);g.fill();
  g.fillStyle='#111';g.beginPath();g.arc(12,-8,1,0,7);g.fill();g.strokeStyle='#3a3438';g.lineWidth=1.6;g.beginPath();g.moveTo(-5,-1);g.lineTo(-5+run*3,1);g.moveTo(5,-1);g.lineTo(5-run*3,1);g.stroke();g.restore()}
function plRoofBird(g,x,y,t,f,wet){const hop=Math.max(0,Math.sin(t*1.3))**30*4;g.save();g.translate(x,y-hop);g.scale(f*.6,.6);
  g.fillStyle=wet?'#4a4e5a':'#6a6e7a';g.beginPath();g.ellipse(0,-7,8,5,0,0,7);g.fill();g.beginPath();g.arc(7,-11,3.6,0,7);g.fill();g.fillStyle='#d97a2a';poly(g,[10,-11,13,-10,10,-9]);g.fill();g.fillStyle='#4a4e5a';poly(g,[-6,-8,-13,-10,-12,-5]);g.fill();g.restore()}
function plNest(g,x,y){g.save();g.strokeStyle='#5a4a30';g.lineWidth=2;g.beginPath();g.moveTo(x,y-28);g.lineTo(x,y-14);g.stroke();g.fillStyle='#c8a050';g.beginPath();g.ellipse(x,y,12,16,0,0,7);g.fill();
  g.strokeStyle='#8a6a2a';g.lineWidth=1;for(let k=0;k<5;k++){g.beginPath();g.ellipse(x,y,12-k*.5,16-k*3,0,0,Math.PI);g.stroke()}g.fillStyle='#3a2a10';g.beginPath();g.arc(x,y+6,3,0,7);g.fill();g.restore()}
function plBee(g,b,t){g.save();g.translate(b.x,b.y);g.scale(b.f,1);const fl=Math.abs(Math.sin(t*44));
  g.fillStyle='rgba(235,245,255,.6)';g.save();g.scale(1,.3+fl*.7);g.beginPath();g.ellipse(-1,-5,4,5,-.4,0,7);g.ellipse(2,-5,4,5,.4,0,7);g.fill();g.restore();
  g.fillStyle='#f0b820';g.beginPath();g.ellipse(-1,0,6,4,0,0,7);g.fill();g.fillStyle='#1a1410';g.fillRect(-4,-3.5,1.8,7);g.fillRect(-.5,-3.8,1.8,7.6);g.beginPath();g.arc(5,-.5,2.6,0,7);g.fill();g.restore()}
function plSquirrel(g,s,t){// il court le long du tronc, tête vers le haut ou vers le bas, la queue en panache
  g.save();g.translate(s.x+s.side*4,s.y);g.rotate(s.d<0?-Math.PI/2:Math.PI/2);g.scale(1,s.side*(s.d<0?1:-1));
  const run=s.pause>0?0:Math.sin(t*30),c=s.col==='gris'?['#8a8a8a','#9a9a9e','#ecebe6','#6a6a6e']:['#a8562a','#b8622e','#f0d8b0','#8a4420'];
  g.fillStyle=c[0];g.beginPath();g.moveTo(-6,-8);g.bezierCurveTo(-24,-10,-26,-30,-12,-32);g.bezierCurveTo(-4,-30,-10,-18,-4,-12);g.closePath();g.fill();
  if(s.col==='gris'){g.strokeStyle='rgba(240,240,236,.6)';g.lineWidth=1.4;g.beginPath();g.moveTo(-8,-10);g.bezierCurveTo(-22,-12,-23,-28,-12,-30);g.stroke()}
  g.fillStyle=c[1];g.beginPath();g.ellipse(0,-8,9,6,-.2,0,7);g.fill();g.beginPath();g.arc(8,-13,5,0,7);g.fill();poly(g,[6,-17,7,-23,10,-17]);g.fill();
  g.fillStyle=c[2];g.beginPath();g.ellipse(3,-6,4,3,0,0,7);g.fill();g.fillStyle='#111';g.beginPath();g.arc(10,-14,1.3,0,7);g.fill();g.fillStyle='rgba(255,255,255,.7)';g.fillRect(10.2,-14.8,.6,.6);
  g.strokeStyle=c[3];g.lineWidth=2;g.beginPath();g.moveTo(-4,-3);g.lineTo(-5+run*3,0);g.moveTo(5,-3);g.lineTo(6-run*3,0);g.stroke();g.restore()}
function plOwl(g,o,t){g.save();g.translate(o.x,o.y);g.scale(o.f,1);const fly=o.st==='dive'||o.st==='back';
  if(fly){const fl=Math.sin(t*(o.st==='dive'?6:16))*.5;g.fillStyle='#7a5a3a';for(const s of[-1,1]){g.save();g.scale(1,s);g.rotate(-.25+fl*s*.3);g.beginPath();g.ellipse(-2,-12,26,8,-.3,0,7);g.fill();g.restore()}}
  const by=fly?0:-18;g.fillStyle='#8a6a44';g.beginPath();g.ellipse(0,by,13,17,0,0,7);g.fill();g.fillStyle='#e8d8b8';g.beginPath();g.ellipse(2,by-5,10,9,0,0,7);g.fill();
  g.fillStyle='#5a4028';poly(g,[-8,by-12,-6,by-22,-2,by-13]);g.fill();poly(g,[10,by-12,9,by-22,5,by-13]);g.fill();
  const glow=o.st==='warn'||o.st==='dive',er=o.st==='warn'?3+Math.min(1,o.t)*3.2:o.st==='dive'?6:3;g.fillStyle=glow?'#ffcc33':'#e8a830';for(const ex of[-2.5,6.5]){g.beginPath();g.arc(ex,by-6,er,0,7);g.fill()}
  g.fillStyle='#111';for(const ex of[-2.5,6.5]){if(o.st==='perch'&&Math.sin(t*.7)>.6)g.fillRect(ex-3,by-6.5,6,1.4);else{g.beginPath();g.arc(ex,by-6,er*.5,0,7);g.fill()}}
  g.fillStyle='#d8a040';poly(g,[2,by-3,4,by-3,3,by+1]);g.fill();g.restore()}

/* ---------- par-dessus tout : les guirlandes, la pluie, le brouillard, les intertitres ---------- */
const PL_GARL=(()=>{const a=[];const anch=[[0,230],[10.5*T,226],[18*T,174],[25.5*T,250],[35*T,174],[41.5*T,226],[52*T,240],[60.5*T,226],[63.2*T,176],[77.8*T,176],[82.5*T,240],[91*T,174],[96.5*T,226],[104.5*T,250],[114.5*T,226],[118*T,182],[131*T,182],[PLW*T,230]];
  for(let i=0;i<anch.length-1;i++){const[x0,y0]=anch[i],[x1,y1]=anch[i+1];if(i===8)continue;a.push([x0,y0,x1,y1,30+Math.abs(x1-x0)*.06])}
  a.push([63.2*T,192,77.8*T,192,40],[63.2*T,178,77.8*T,178,26,'flag']);return a})();
function placeOverlay(t){const S2=L.pl;if(!S2)return;const n=S2.pass,cx=Math.round(cam.x),cy=Math.round(cam.y);
  const zm=L.zoom&&L.zoom.z>1.001?L.zoom:null;
  ctx.save();if(zm){ctx.translate(W/2,H/2);ctx.scale(zm.z,zm.z);ctx.translate(-W/2,-H/2);ctx.translate(-Math.round(zm.fx-W/2),-Math.round(zm.fy-H/2))}else ctx.translate(-cx,-cy);
  const x0v=zm?zm.fx-W/2/zm.z-20:cx-20,x1v=zm?zm.fx+W/2/zm.z+20:cx+W+20;
  // les guirlandes d'ampoules et de fanions (deux premiers passages)
  if(n<=2){for(const[a,ya,b,yb,sag,kind]of PL_GARL){if(b<x0v||a>x1v)continue;const pt=u=>[lerp(a,b,u),lerp(ya,yb,u)+Math.sin(u*Math.PI)*sag];
    ctx.strokeStyle='rgba(30,30,30,.8)';ctx.lineWidth=1.2;ctx.beginPath();for(let k=0;k<=20;k++){const[x,y]=pt(k/20);k?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke();
    const len=Math.hypot(b-a,yb-ya),nb=Math.floor(len/(kind==='flag'?24:22));
    for(let k=1;k<nb;k++){const u=k/nb,[x,y]=pt(u);if(kind==='flag'){ctx.fillStyle=['#c8302a','#f2ece0','#2a4a9a','#e8c040','#3a8a4a'][k%5];poly(ctx,[x-7,y,x+7,y,x+Math.sin(t*3+k),y+16]);ctx.fill()}
      else{const on=((k+Math.floor(t*(n===2?3:2)))%4)!==0,col=['#ffe8a0','#ff7a5a','#8ae0a0','#8ab8ff','#ffd040'][k%5];ctx.fillStyle='#2a2a2a';ctx.fillRect(x-1.5,y,3,3);ctx.fillStyle=on?col:'rgba(120,110,90,.8)';ctx.beginPath();ctx.ellipse(x,y+6,3,4.4,0,0,7);ctx.fill();
        if(on){ctx.fillStyle=rgba(col.length===7?col:'#ffe8a0',.22);ctx.beginPath();ctx.arc(x,y+6,8,0,7);ctx.fill()}}}}}
  ctx.restore();
  // la pluie (3e passage) : des traits obliques, des éclaboussures sur les pavés
  if(n===3){ctx.save();ctx.strokeStyle='rgba(200,212,232,.32)';ctx.lineWidth=1.1;ctx.beginPath();for(const d of rainDrops){const sp=900*d.s,x=((d.x-cx*.25-t*sp*.22)%W+W)%W,y=((d.y+t*sp)%(H+40))-20;ctx.moveTo(x,y);ctx.lineTo(x-d.l*.22,y+d.l)}ctx.stroke();
    ctx.strokeStyle='rgba(220,230,250,.45)';for(let k=0;k<26;k++){const ph=(t*2.2+k*.137)%1,x=((k*173.3+Math.floor(t*2.2+k*.137)*61)%W),y=PLF-cy+2;ctx.globalAlpha=1-ph;ctx.beginPath();ctx.ellipse(x,y,2+ph*8,1+ph*2,0,Math.PI,0);ctx.stroke()}ctx.restore()}
  // le brouillard (4e passage)
  if(S2.fog){ctx.save();ctx.fillStyle='rgba(150,160,185,.13)';ctx.fillRect(0,0,W,H);for(let k=0;k<6;k++){const x=((k*260-t*(10+k*4)-cx*.2)%(W+700)+W+700)%(W+700)-350,y=300+k*36-cy*.3;const gr=ctx.createRadialGradient(x,y,10,x,y,320);gr.addColorStop(0,'rgba(170,180,205,.2)');gr.addColorStop(1,'rgba(170,180,205,0)');ctx.fillStyle=gr;ctx.fillRect(x-320,y-320,640,640)}
    ctx.globalCompositeOperation='lighter';for(const l of PLX.lamps){const lx=l.x*T-cx,ly=PLF-250-cy;if(lx<-200||lx>W+200)continue;const gr=ctx.createRadialGradient(lx,ly,4,lx,ly,150);gr.addColorStop(0,'rgba(255,214,150,.22)');gr.addColorStop(1,'rgba(255,214,150,0)');ctx.fillStyle=gr;ctx.fillRect(lx-150,ly-150,300,300)}ctx.restore()}
  // les intertitres
  const q=S2.seq;if(!q)return;
  if(q.k==='pass'){const a=q.t<1.1?q.t/1.1:q.t<4.4?1:Math.max(0,1-(q.t-4.4));vxCard(PL_CARDS[q.next],a,t)}
  if(q.k==='end'){const card=(t0,t1,txt)=>{if(q.t<t0||q.t>t1)return;const a=Math.min(1,(q.t-t0)/.6,(t1-q.t)/.6);vxCard(txt,a,t)};
    card(1.4,6.6,PL_END[0]);
    // à partir d'ici, le noir ne se lève plus : les intertitres s'enchaînent
    if(q.t>15.2){ctx.fillStyle='rgba(11,10,12,'+Math.min(1,(q.t-15.2)/.5)+')';ctx.fillRect(0,0,W,H)}
    card(15.6,20.4,PL_END[1]);card(20.4,24.6,PL_END[2]);card(24.6,29.2,PL_END[3]);card(29.2,33.8,PL_END[4])}
}
