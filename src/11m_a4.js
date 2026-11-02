/* =========================================================
   4-1 · L'AUTOROUTE DE L'EST — l'A4 de nuit, de Reims vers l'ouest
   ---------------------------------------------------------
   Le monde est fixe ; les camions roulent vers la droite plus vite que Raymond. On commence sur le dos d'un camion.
   Trois ponts : trop bas pour rester sur le toit, trop épais pour sauter par-dessus — il faut se laisser tomber
   derrière le camion, passer dessous à pied, puis remonter sur le camion suivant : ses phares éclairent la route
   avant qu'il arrive ; il faut sauter à ce moment-là, sinon il écrase. Puis l'embouteillage du péage de Thillois,
   l'accident (deux conducteurs qui s'insultent et se jettent des objets), et les travaux jusqu'à l'aire de Gueux.
   Secrets : le pneu sous le deuxième pont (un hérisson), les deux gyrophares (coups de bec), le moteur fumant.
   ========================================================= */
THEMES.a4={outdoor:true,far:'sky',horizon:'road',sky:['#04060d','#0c1222','#1a2236'],celestial:'moon',stars:true,fog:'#10141f',dark:.58,weather:'night',
  floor:'#26262a',floorTop:'#4a4a52',type:'stone',x:'none',d:'drape',shelf:'girder',spike:'spikes',spikeCol:'#3a3e46',spikeBase:'#2a2c32',walker:'rat',flyer:'crow',awning:'#2f5a7a',props:[],noFore:true};
const A4={TRUCK_V:380,TW:440,TH:100,DECK:450};

/* ---------- le décor (couche en cache) ---------- */
function a4Build(Lv){
  const D=Lv.def.a4,wpx=Lv.wpx+40,hpx=ROWS*T+PAD,TR=Math.min(RS,1),{layer:c,g}=mkLayer(wpx*TR,hpx*TR);g.scale(TR,TR);c.rs=TR;g.translate(0,PAD);
  const R=mulberry(Lv.def.seed+7),GY=D.G0*T;
  // les champs et les bois, très sombres, la ligne des arbres
  g.fillStyle='#0c1018';g.fillRect(0,GY-150,wpx,150);for(let x=0;x<wpx;x+=18){const h=30+R()*50;g.fillStyle='#080b12';g.beginPath();g.ellipse(x,GY-150,14+R()*10,h,0,Math.PI,0);g.fill()}
  // le terre-plein central : la glissière grise, ses poteaux, ses catadioptres
  g.fillStyle='#1c1e24';g.fillRect(0,GY-46,wpx,46);g.fillStyle='#5a5e66';g.fillRect(0,GY-44,wpx,9);g.fillStyle='#7a7e86';g.fillRect(0,GY-44,wpx,2);
  for(let x=0;x<wpx;x+=80){g.fillStyle='#3a3c42';g.fillRect(x,GY-38,5,38);g.fillStyle='#e8a030';g.fillRect(x+1,GY-42,3,4)}
  // lampadaires (sodium)
  for(let x=300;x<wpx;x+=640){g.fillStyle='#2a2c30';g.fillRect(x-3,GY-300,6,300);g.fillRect(x-3,GY-300,60,5);g.fillStyle='#ffc070';g.fillRect(x+40,GY-296,20,5)}
  // les panneaux avant les ponts, et les ponts : tablier épais, route du dessus, piles dans le fond
  for(const[a,b]of D.bridges){
    {const sx=a-1300;g.fillStyle='#2a2c30';g.fillRect(sx,GY-260,6,260);g.fillRect(sx+150,GY-260,6,260);g.fillStyle='#1e5aa8';g.fillRect(sx-10,GY-300,180,56);g.strokeStyle='#e8ecf4';g.lineWidth=2;g.strokeRect(sx-6,GY-296,172,48);
     g.fillStyle='#fff';g.font='bold 15px '+F_DISP;g.textAlign='center';g.fillText('⚠ PONT  3,5 m',sx+80,GY-266)}
    g.fillStyle='#16181e';g.fillRect(a+40,A4.DECK,40,GY-A4.DECK);g.fillRect(b-80,A4.DECK,40,GY-A4.DECK);
    g.fillStyle='#4a4c52';g.fillRect(a,140,b-a,A4.DECK-140);g.fillStyle='#5a5c62';g.fillRect(a,A4.DECK-26,b-a,26);g.fillStyle='#34363c';g.fillRect(a,A4.DECK-4,b-a,4);
    g.fillStyle='rgba(0,0,0,.18)';for(let y=160;y<A4.DECK-30;y+=26)g.fillRect(a,y,b-a,2);
    g.fillStyle='#6a6e76';g.fillRect(a-8,130,b-a+16,16);for(let x=a;x<b;x+=24)g.fillRect(x,108,4,22);g.fillRect(a-8,104,b-a+16,6);
    g.fillStyle='#2a2c30';g.fillRect((a+b)/2-3,-40,6,150);g.fillStyle='#ffc070';g.fillRect((a+b)/2-12,-44,24,6);
    g.fillStyle='#e8e8e0';g.font='bold 12px '+F_DISP;g.textAlign='center';g.fillText('3,50 m',(a+b)/2,A4.DECK-9)}
  // l'embouteillage : voitures, camionnette, camion, autocar (feux stop allumés en direct)
  for(const[x0,x1,k,h]of D.jam)a4Vehicle(g,x0,x1,k,h,GY,R);
  // le péage de Thillois : la grande marquise, l'îlot et sa cabine, la barrière
  {const[a,b]=D.canopy;g.fillStyle='#2a2e36';g.fillRect(a,150,b-a,46);g.fillStyle='#d8d4c8';g.fillRect(a,150,b-a,6);g.fillStyle='#1e5aa8';g.fillRect(a+80,160,b-a-160,28);
   g.fillStyle='#fff';g.font='bold 16px '+F_DISP;g.textAlign='center';g.fillText('PÉAGE DE THILLOIS',(a+b)/2,180);
   for(const x of[a+40,b-40]){g.fillStyle='#3a3e46';g.fillRect(x-6,196,12,GY-196)}
   g.fillStyle='rgba(255,250,230,.8)';for(let x=a+30;x<b-20;x+=60)g.fillRect(x,196,30,4);
   const[c0,c1]=D.booth;g.fillStyle='#c8c4b8';g.fillRect(c0,GY-120,c1-c0,120);g.fillStyle='#e0a020';for(let y=GY-20;y<GY;y+=10)for(let x=c0;x<c1;x+=20)g.fillRect(x+((y/10|0)%2?10:0),y,10,10);
   g.fillStyle='#e8e4d8';g.fillRect(c0+10,GY-220,c1-c0-20,100);g.fillStyle='rgba(255,230,160,.85)';g.fillRect(c0+18,GY-210,c1-c0-36,50);g.fillStyle='#2a2e36';g.fillRect(c0+4,GY-232,c1-c0-8,14);
   g.fillStyle='#d83020';g.fillRect(c1-6,GY-110,90,8);for(let x=c1;x<c1+84;x+=24){g.fillStyle='#fff';g.fillRect(x,GY-110,12,8)}}
  // les travaux : plots, camionnettes orange (gyrophares en direct), panneaux
  for(const x of D.cones){const cx=x+20,b=GY;g.fillStyle='#e8601c';poly(g,[cx-12,b-2,cx-4,b-38,cx+4,b-38,cx+12,b-2]);g.fill();g.fillStyle='#f0f0e8';g.fillRect(cx-8,b-26,16,6);g.fillStyle='#2a2a2a';g.fillRect(cx-16,b-4,32,4)}
  for(const[a,b]of D.vans)a4Van(g,a,b,GY);
  {const sx=12900;g.fillStyle='#e8c020';poly(g,[sx,GY-150,sx+46,GY-70,sx-46,GY-70]);g.fill();g.fillStyle='#1a1a1a';g.font='bold 22px '+F_DISP;g.textAlign='center';g.fillText('!',sx,GY-84);g.fillStyle='#2a2c30';g.fillRect(sx-3,GY-70,6,70)}
  // le camion-benne : cabine et châssis (la benne est dessinée en direct)
  {const t=D.tar;g.fillStyle='#d8c020';rr(g,t.x1,GY-160,t.c1-t.x1,140,10);g.fill();g.fillStyle='#2a3440';g.fillRect(t.x1+70,GY-150,74,50);g.fillStyle='#3a3a3e';g.fillRect(t.x0,GY-60,t.c1-t.x0,30);
   for(const wx of[t.x0+60,t.x0+200,t.c1-60]){g.fillStyle='#141416';g.beginPath();g.arc(wx,GY-20,22,0,7);g.fill();g.fillStyle='#5a5a5e';g.beginPath();g.arc(wx,GY-20,9,0,7);g.fill()}}
  // le goudron frais sous le rouleau
  {const[a,b]=D.roller;g.fillStyle='#141416';g.fillRect(a-60,GY-4,b-a+120,6)}
  // l'aire de Gueux : le panneau bleu, la station au loin
  {const sx=D.exitX-260;g.fillStyle='#2a2c30';g.fillRect(sx,GY-250,6,250);g.fillRect(sx+200,GY-250,6,250);g.fillStyle='#1e5aa8';rr(g,sx-20,GY-330,246,92,8);g.fill();g.strokeStyle='#fff';g.lineWidth=3;rr(g,sx-14,GY-324,234,80,6);g.stroke();
   g.fillStyle='#fff';g.font='bold 20px '+F_DISP;g.textAlign='center';g.fillText('Aire de Gueux',sx+103,GY-290);g.font='bold 13px '+F_DISP;g.fillText('⛽  🍴   500 m',sx+103,GY-264);
   g.fillStyle='#1c2028';g.fillRect(D.exitX+60,GY-180,320,180);g.fillStyle='#d83020';g.fillRect(D.exitX+40,GY-200,360,26);g.fillStyle='rgba(255,240,200,.8)';g.fillRect(D.exitX+80,GY-150,120,60)}
  return c;
}
function a4Vehicle(g,x0,x1,k,h,GY,R){const top=GY-h*T,w=x1-x0,col={car:['#3a5a8a','#8a2a2a','#4a6a4a','#c8c4b8','#2a2a2e'][Math.floor(x0/97)%5],carB:'#7a2a2a',carA:'#2a4a7a',van:'#d8d8d0',truck:'#4a5a6a',bus:'#c8a030'}[k];
  if(k==='car'||k==='carA'||k==='carB'){g.fillStyle=col;rr(g,x0,top+30,w,h*T-44,10);g.fill();g.beginPath();g.moveTo(x0+30,top+32);g.lineTo(x0+60,top);g.lineTo(x1-60,top);g.lineTo(x1-24,top+32);g.closePath();g.fill();
    g.fillStyle='#1c2430';poly(g,[x0+40,top+30,x0+64,top+6,(x0+x1)/2-4,top+6,(x0+x1)/2-4,top+30]);g.fill();poly(g,[(x0+x1)/2+4,top+30,(x0+x1)/2+4,top+6,x1-64,top+6,x1-34,top+30]);g.fill();
    if(k==='carB'){// le capot relevé, le moteur à nu
      g.fillStyle='#2a2a2e';g.fillRect(x1-4,GY-T,T+8,T-14);g.fillStyle='#5a5a5e';for(let i=0;i<4;i++)g.fillRect(x1+2+i*10,GY-T+6,6,14);g.fillStyle=col;poly(g,[x1,GY-T,x1+6,GY-T-50,x1+16,GY-T-48,x1+10,GY-T]);g.fill()}
    if(k==='carA'){g.strokeStyle='#1a1a1a';g.lineWidth=2;g.beginPath();g.moveTo(x0+4,top+40);g.lineTo(x0+14,top+52);g.lineTo(x0+6,top+62);g.stroke()}}
  else if(k==='van'){g.fillStyle=col;rr(g,x0,top,w-50,h*T-14,8);g.fill();rr(g,x1-60,top+40,60,h*T-54,10);g.fill();g.fillStyle='#1c2430';g.fillRect(x1-52,top+48,40,32)}
  else if(k==='truck'){g.fillStyle=col;g.fillRect(x0,top,w-90,h*T-20);g.fillStyle='#8a1a1a';rr(g,x1-90,top+30,90,h*T-50,8);g.fill();g.fillStyle='#1c2430';g.fillRect(x1-74,top+40,54,40);
    g.fillStyle='rgba(255,255,255,.12)';g.font='bold 22px '+F_DISP;g.textAlign='center';g.fillText('TRANSPORTS',x0+(w-90)/2,top+h*T/2)}
  else if(k==='bus'){g.fillStyle=col;rr(g,x0,top,w,h*T-16,12);g.fill();g.fillStyle='#1c2430';for(let x=x0+20;x<x1-40;x+=56)g.fillRect(x,top+16,44,40);g.fillStyle='#2a2a2e';g.fillRect(x0,top+h*T-50,w,6)}
  for(const wx of[x0+40,x1-46]){g.fillStyle='#121214';g.beginPath();g.arc(wx,GY-14,16,0,7);g.fill();g.fillStyle='#4a4a4e';g.beginPath();g.arc(wx,GY-14,6,0,7);g.fill()}}
function a4Van(g,a,b,GY){const top=GY-3*T;g.fillStyle='#e8701c';rr(g,a,top,b-a-40,3*T-14,8);g.fill();rr(g,b-60,top+30,60,3*T-44,10);g.fill();g.fillStyle='#1c2430';g.fillRect(b-52,top+40,40,30);
  for(let x=a+6;x<b-60;x+=28){g.fillStyle=(x/28|0)%2?'#f0f0e8':'#d83020';poly(g,[x,GY-30,x+14,GY-30,x+28,GY-16,x+14,GY-16]);g.fill()}
  g.fillStyle='#1a1a1a';g.font='bold 12px '+F_DISP;g.textAlign='center';g.fillText('AUTOROUTES',a+(b-a-40)/2,top+40);
  for(const wx of[a+40,b-46]){g.fillStyle='#121214';g.beginPath();g.arc(wx,GY-14,16,0,7);g.fill()}}

/* ---------- après lecture ---------- */
function a4Post(Lv){const D=Lv.def.a4;if(!D)return;
  const S={trucks:[],spawnT:2.5,said:{},grace:0,objs:[],objT:1,insT:.5,bedA:0,roll:{x:D.roller[0],dir:1,pause:0},beacons:[{x:D.vans[0][0]+120,on:true},{x:D.vans[1][0]+120,on:true}],hog:null};Lv.a4=S;
  // le camion de départ, avec Raymond dessus
  const t0=a4Truck(Lv,60);S.trucks.push(t0);S.startTruck=t0;
  // les secrets : le pneu, les gyrophares (le second compte), le moteur
  Lv.acts=Lv.acts||[];
  Lv.acts.push({kind:'secret',style:'tyre',x:D.tyre,y:D.G0*T,open:0,t:0,used:false,noStraw:false,q:null});
  Lv.acts.push({kind:'beacon',style:'beacon',x:S.beacons[0].x,y:D.G0*T-3*T,i:0,open:0,t:0,used:false});
  Lv.acts.push({kind:'secret',style:'beacon',x:S.beacons[1].x,y:D.G0*T-3*T,i:1,open:0,t:0,used:false,noStraw:true,q:["Et de deux. La nuit redevient la nuit. Au génie, on appelait ça « camoufler les feux »."]});
  Lv.acts.push({kind:'secret',style:'engine',x:D.engine+10,y:D.G0*T-T,open:0,t:0,used:false,q:["Une bille dans le moteur… et de la paille qui sort. Ça fumait déjà : je viens de leur éviter un incendie. Personne ne dit merci, évidemment."]});
}
function a4Truck(Lv,x){const m={axis:'g',kind:'a4truck',x,y:Lv.def.a4.G0*T-A4.TH,w:A4.TW,h:14,vh:A4.TH,dx:0,dy:0,v:A4.TRUCK_V,on:true,col:pick(['#c8302a','#2a5a9a','#e0e0d8','#3a7a4a','#d8a020'])};Lv.movers.push(m);return m}
function a4PlaceOnTruck(m){P.x=m.x+m.w*.55;P.y=m.y-P.h;P.vx=P.vy=0;P.onGround=true;P.onMover=m;P.lastGY=P.y}
function a4Step(dt){const S=L.a4;if(!S)return;const D=L.def.a4,GY=D.G0*T,hb={x:P.x+3,y:P.y+4,w:P.w-6,h:P.h-6},pcx=P.x+P.w/2,pcy=P.y+P.h/2;let hit=null;
  if(!S.started){S.started=1;a4PlaceOnTruck(S.startTruck)}
  // les camions : ils roulent, s'arrêtent à l'embouteillage, disparaissent loin devant
  for(const m of S.trucks){if(!m.on)continue;const px=m.x;
    if(m.x+m.w>D.jamX-20){m.v=Math.max(0,m.v-900*dt);if(m.x+m.w>D.jamX-6){m.x=D.jamX-6-m.w;m.v=0;m.stopped=1}}
    m.x+=m.v*dt;m.dx=m.x-px;
    if(!m.stopped&&m.x>cam.x+W+500&&P.onMover!==m){m.on=false;m.y=99999;if(P.onMover===m)P.onMover=null}
    if(!P.dead&&P.onMover!==m&&overlap(hb,{x:m.x+8,y:m.y+10,w:m.w-16,h:m.vh-10}))hit='camion'}
  S.trucks=S.trucks.filter(m=>m.on||m.stopped);
  // les ponts : sur le toit d'un camion, on s'y écrase ; on ne peut pas sauter par-dessus
  for(const[a,b]of D.bridges)if(!P.dead&&pcx>a-8&&pcx<b+8&&P.y+4<A4.DECK){hit='pont';break}
  // un camion arrive par derrière : quand on est à pied sur la route, après un pont, et pas trop près du suivant
  {const onRoad=P.onGround&&!P.onMover&&P.y+P.h>=GY-2,passed=D.bridges.filter(([a,b])=>pcx>b+40),next=D.bridges.find(([a,b])=>a>pcx),limit=next?next[0]-700:D.jamX-900,
     active=S.trucks.some(m=>m.on&&!m.stopped&&m.x<pcx+400)||S.trucks.some(m=>m.stopped);
   // (seulement quand Raymond avance : immobile sur un cartel, rien ne vient)
   if(onRoad&&passed.length&&pcx<limit&&!active&&S.grace<=0&&P.vx>40){S.spawnT-=dt;if(S.spawnT<=0){const m=a4Truck(L,cam.x-480-A4.TW);S.trucks.push(m);S.spawnT=1.6;
       if(!S.said.phares&&!G.sim){S.said.phares=1;say("Des phares, derrière ! Quand la lumière arrive sur moi, il faut sauter, sinon c'est le camion qui arrive.",4.2)}
       if(!G.sim){tone(70,1.4,'sawtooth',.03);noise(.9,300,.05,'lowpass')}}}else S.spawnT=Math.max(S.spawnT,1.2)}
  if(!S.said.pont&&!G.sim&&pcx>D.bridges[0][0]-900){S.said.pont=1;say("Un pont ! Trop bas pour rester sur le toit, trop épais pour sauter par-dessus. Descendre par l'arrière, et vite.",4.2)}
  // l'embouteillage, l'accident : les deux conducteurs s'insultent et se jettent des objets
  {const dB=12030,dA=12575;S.insT-=dt;if(S.insT<=0&&Math.abs(pcx-12300)<900&&!G.sim){S.insT=1.1+rnd()*.8;const left=rnd()<.5;bubble(left?dB:dA,GY-110,pick(['#!gr@%=','&*%$#!','@#!!*','%$&@#','#@!?$%']),'#6a2a2a')}
   S.objT-=dt;if(S.objT<=0&&Math.abs(pcx-12300)<1100){S.objT=1.25;S.objDir=-(S.objDir||1);const from=S.objDir>0?dB:dA,to=S.objDir>0?dA:dB;S.objs.push({x:from,y:GY-80,vx:(to-from)/1.4,vy:-520,k:pick(['shoe','bottle','atlas','apple','phone']),rot:0,b:0})}
   for(const o of S.objs){o.vy+=900*dt;o.x+=o.vx*dt;o.y+=o.vy*dt;o.rot+=dt*9;
     const c=Math.floor(o.x/T),r=Math.floor((o.y+6)/T);if(o.vy>0&&isSolid(c,r)&&o.b<2){o.y=r*T-6;o.vy=-(420+rnd()*200);o.vx=(rnd()-.5)*520;o.b++}
     if(!P.dead&&Math.abs(o.x-pcx)<14&&Math.abs(o.y-pcy)<16)hit='objet'}
   S.objs=S.objs.filter(o=>o.y<GY+40&&o.y>-200);
   if(!S.said.jam&&!G.sim&&pcx>D.jamX-300){S.said.jam=1;say("Tout le monde est arrêté. Le péage de Thillois. Ils paient pour avancer, et ils n'avancent pas.",4)}
   if(!S.said.acc&&!G.sim&&pcx>11700){S.said.acc=1;say("Un accrochage, devant. Ils s'envoient leurs affaires à la figure. On se croirait dans une tranchée.",4)}}
  // le camion-benne : la benne se lève (et verse le goudron), redescend ; levée, elle barre le passage
  {const t=D.tar,u=G.lt%7,ang=u<2.2?0:u<3?(u-2.2)/.8:u<6.2?1:1-(u-6.2)/.8;S.bedA=ang;const up=ang>.25;
   const cols=[Math.floor((t.x1-140)/T),Math.floor((t.x1-100)/T),Math.floor((t.x1-60)/T)];
   for(const c of cols)for(let r=4;r<=D.G0-4;r++)L.g[r][c]=up?'X':'.';
   for(let c=Math.floor(t.x0/T);c<Math.floor(t.x1/T);c++)L.g[D.G0-3][c]=up?'.':'X';
   if(up&&!P.dead&&pcx>t.x1-150&&pcx<t.x1-20&&P.y<(D.G0-3)*T&&P.y+P.h>4*T&&ang<.6)hit='benne';
   if(ang>.5&&!P.dead&&pcx>t.x0-40&&pcx<t.x0-6&&P.y+P.h>GY-150)hit='goudron';
   if(!S.said.travaux&&!G.sim&&pcx>13000){S.said.travaux=1;say("Des travaux, de nuit. Comme au front : on répare la route pendant que l'ennemi dort.",4)}}
  // le rouleau compresseur : il va et vient, vif, des pics anti-pigeons sur le dessus
  {const Rl=S.roll,[a,b]=D.roller;if(Rl.pause>0)Rl.pause-=dt;else{Rl.x+=Rl.dir*330*dt;if(Rl.x>b-150){Rl.x=b-150;Rl.dir=-1;Rl.pause=.35}if(Rl.x<a){Rl.x=a;Rl.dir=1;Rl.pause=.35}}
   if(!P.dead&&overlap(hb,{x:Rl.x+6,y:GY-112,w:138,h:112}))hit='rouleau'}
  // les ouvriers qui discutent : ils lèvent les bras quand on passe au-dessus
  for(const wx of D.workers){const up=Math.abs(pcx-wx)<70&&P.y+P.h<GY-40;if(up&&!G.sim&&!S.said.ouv){S.said.ouv=1;bubble(wx,GY-130,'Hé ! Un pigeon !','#2a3a5a')}
    if(!P.dead&&overlap(hb,{x:wx-11,y:GY-(up?118:96),w:22,h:up?118:96}))hit='ouvriers'}
  // le hérisson du pneu : il file sur l'autoroute, vers la gauche
  if(S.hog){S.hog.x-=200*dt;S.hog.t+=dt;if(S.hog.t>6)S.hog=null}
  if(S.grace>0){S.grace-=dt;hit=null}
  if(hit)G.a4Hit=hit;
}
function a4AfterMove(){if(G.a4Hit){const k=G.a4Hit;G.a4Hit=null;return k}return null}
function a4Respawn(){const S=L.a4;if(!S)return;const D=L.def.a4;S.grace=2.2;S.objs=[];S.spawnT=2.5;
  // avant le premier pont : on repart sur un camion ; ensuite, à pied (le camion suivant arrive)
  if(P.cp.x<D.bridges[0][0]){for(const m of S.trucks){m.on=false;m.y=99999}S.trucks=[];const m=a4Truck(L,P.cp.x-A4.TW*.55);S.trucks.push(m);a4PlaceOnTruck(m)}
  else for(const m of S.trucks)if(!m.stopped&&Math.abs(m.x-P.x)<900){m.on=false;m.y=99999}}
/* actions : les gyrophares, le pneu, le moteur */
function a4Act(a){const S=L.a4;if(!S)return false;
  if(a.style==='beacon'){const b=S.beacons[a.i];if(!b.on){if(!G.sim)say("Celui-là, c'est fait.",2.4);return true}
    b.on=false;if(!G.sim){tone(880,.06,'square',.05);noise(.15,2600,.1,'highpass')}const other=S.beacons[1-a.i];
    if(other.on){if(!G.sim)say(a.i===0?"Ah… Ça fait du bien aux yeux. J'ai failli faire une crise d'épilepsie.":"Un de moins. Il en reste un, là-bas, qui clignote encore.",3.8)}
    else{const sec=L.acts.find(x=>x.kind==='secret'&&x.style==='beacon');if(sec&&!sec.used)grantSecret(sec,sec.y-30)}
    return true}
  if(a.style==='tyre'){if(a.used)return false;grantSecret(a,a.y-30);S.hog={x:a.x-10,t:0};
    if(!G.sim){noise(.3,900,.12,'bandpass');setTimeout(()=>say("Un hérisson ! Non… non, pas par là ! Pas sur l'autoroute ! Vous faites tous la même bêtise, et vous finissez en tapis sous les pneus !",4.6),500)}return true}
  if(a.style==='engine'){if(a.used)return false;S.drops=S.drops||[];grantSecret(a,a.y-30);if(!G.sim)noise(.25,500,.1,'lowpass');return true}
  return false}
function a4Lights(){const S=L.a4;if(!S)return[];const D=L.def.a4,GY=D.G0*T,out=[];
  for(let x=300;x<L.wpx;x+=640)out.push({x:x+50,y:GY-280,r:230,i:.75,warm:1});
  for(const m of S.trucks)if(m.on||m.stopped){out.push({x:m.x+m.w+180,y:GY-40,r:260,i:.95});out.push({x:m.x-10,y:GY-40,r:70,i:.6,warm:2})}
  for(const[x0,x1]of D.jam)out.push({x:x0+6,y:GY-50,r:70,i:.6,warm:2});
  out.push({x:(D.canopy[0]+D.canopy[1])/2,y:220,r:420,i:.9});
  for(const b of S.beacons)if(b.on)out.push({x:b.x,y:GY-3*T-14,r:330,i:.8+.2*Math.sin(G.lt*12),warm:2});
  out.push({x:D.exitX+200,y:GY-120,r:360,i:.9,warm:1});
  return out}

/* ---------- dessin ---------- */
function drawA4Back(t,cx){const Lv=L;if(!Lv.a4Layer)return;const ly=Lv.a4Layer,tr=ly.rs||1,sx=Math.max(0,cx-30),sw=Math.min(W+80,ly.width/tr-sx);if(sw>0)blitLayer(ctx,ly,sx*tr,0,sw*tr,ly.height,sx,-PAD,sw,ly.height/tr)}
function drawA4Mid(t){const S=L.a4;if(!S)return;const g=ctx,D=L.def.a4,GY=D.G0*T,a0=cam.x-200,a1=cam.x+W+200;
  // le marquage au sol, qui défile sous les camions
  g.fillStyle='rgba(230,230,220,.55)';for(let x=Math.floor(a0/120)*120;x<a1;x+=120)g.fillRect(x,GY+8,60,4);
  // les faisceaux des phares, posés sur la route, avant le camion
  for(const m of S.trucks)if((m.on||m.stopped)&&m.x<a1+600&&m.x+m.w>a0-600){const fx=m.x+m.w,gr=g.createLinearGradient(fx,0,fx+520,0);gr.addColorStop(0,'rgba(255,248,210,.55)');gr.addColorStop(1,'rgba(255,248,210,0)');
    g.fillStyle=gr;poly(g,[fx,GY-46,fx+520,GY-120,fx+520,GY+6,fx,GY-14]);g.fill()}
  for(const m of S.trucks)if((m.on||m.stopped)&&m.x<a1&&m.x+m.w>a0)a4DrawTruck(g,m,t);
  // feux stop de l'embouteillage
  for(const[x0,x1,k,h]of D.jam)if(x1>a0&&x0<a1){g.fillStyle='rgba(255,40,30,'+(.75+.25*Math.sin(t*3+x0))+')';g.fillRect(x0-2,GY-h*T+(k==='bus'||k==='truck'?30:36),6,10)}
  // la fumée du moteur
  {const x=D.engine+20;if(x>a0&&x<a1)for(let k=0;k<6;k++){const ph=(t*.6+k/6)%1;g.fillStyle='rgba(150,150,150,'+(.4*(1-ph))+')';g.beginPath();g.arc(x+Math.sin(ph*5+k)*10,GY-T-10-ph*120,6+ph*16,0,7);g.fill()}}
  // les conducteurs en colère et les objets lancés
  for(const[dx,f]of[[12030,1],[12575,-1]])if(dx>a0&&dx<a1)a4Driver(g,dx,GY,f,t);
  for(const o of S.objs)a4Obj(g,o);
  // la benne qui se lève et le goudron qui coule
  {const tr=D.tar;if(tr.x1>a0&&tr.x0<a1){const ang=S.bedA*.95,px=tr.x0,py=GY-3*T+2;g.save();g.translate(px,py);g.rotate(-ang);g.fillStyle='#c8b020';g.fillRect(0,-40,tr.x1-tr.x0-6,40);g.fillStyle='#a89018';for(let x=20;x<tr.x1-tr.x0-20;x+=50)g.fillRect(x,-40,6,40);
      g.fillStyle='#141416';g.fillRect(4,-46,tr.x1-tr.x0-16,8);g.restore();
      if(S.bedA>.5){g.fillStyle='#141416';const w=12+Math.sin(t*20)*2;g.fillRect(px-w,py,w,GY-py);g.beginPath();g.ellipse(px-20,GY-4,60,10,0,0,7);g.fill();g.fillStyle='rgba(200,200,200,.25)';for(let k=0;k<4;k++){const ph=(t*.8+k/4)%1;g.beginPath();g.arc(px-30+k*12,GY-20-ph*60,5+ph*10,0,7);g.fill()}}}}
  // le rouleau compresseur
  {const Rl=S.roll;if(Rl.x>a0-200&&Rl.x<a1)a4Roller(g,Rl.x,GY,t,Rl.dir)}
  // les ouvriers
  for(const wx of D.workers)if(wx>a0&&wx<a1){const P2=P.x+P.w/2,up=Math.abs(P2-wx)<70&&P.y+P.h<GY-40;a4Worker(g,wx,GY,t,up,wx)}
  // les gyrophares
  for(const b of S.beacons)if(b.x>a0&&b.x<a1){const y=GY-3*T;g.fillStyle='#2a2a2e';g.fillRect(b.x-12,y-8,24,8);g.fillStyle=b.on?'#ff8a10':'#6a4a2a';g.beginPath();g.arc(b.x,y-14,10,Math.PI,0);g.fill();g.fillRect(b.x-10,y-14,20,6);
    if(b.on){const an=t*7;g.fillStyle='rgba(255,150,30,.35)';poly(g,[b.x,y-14,b.x+Math.cos(an)*260,y-14+Math.sin(an)*60-30,b.x+Math.cos(an+.3)*260,y-14+Math.sin(an+.3)*60-30]);g.fill()}}
  // le pneu et le hérisson
  {const x=D.tyre;if(x>a0&&x<a1){const a=L.acts.find(q=>q.style==='tyre');g.fillStyle='#141416';g.beginPath();g.ellipse(x+(a&&a.used?18:0),GY-30,16,30,a&&a.used?-.3:-.12,0,7);g.fill();g.fillStyle='#3a3a3e';g.beginPath();g.ellipse(x+(a&&a.used?18:0),GY-30,8,16,-.12,0,7);g.fill()}}
  if(S.hog)a4Hog(g,S.hog.x,GY,t);
}
function a4DrawTruck(g,m,t){const x=m.x,y=m.y,w=m.w,h=m.vh,GY=y+h;g.save();
  // la remorque, la cabine, les roues
  g.fillStyle='#d8d8d0';g.fillRect(x,y,w-110,h-30);g.fillStyle='rgba(0,0,0,.12)';for(let k=x+40;k<x+w-110;k+=40)g.fillRect(k,y,2,h-30);
  g.fillStyle=m.col;g.fillRect(x,y+h-46,w-110,6);g.fillStyle='rgba(0,0,0,.4)';g.font='bold 14px '+F_DISP;g.textAlign='center';g.fillText('TRANSPORTS VASSEUR & FILS',x+(w-110)/2,y+44);
  g.fillStyle=m.col;rr(g,x+w-104,y+24,104,h-40,10);g.fill();g.fillStyle='#1c2430';g.fillRect(x+w-86,y+34,60,36);g.fillStyle='rgba(255,255,255,.18)';g.fillRect(x+w-84,y+36,10,32);
  g.fillStyle='#fff4c0';g.fillRect(x+w-6,y+h-40,6,10);g.fillStyle='#ff3020';g.fillRect(x,y+h-44,6,10);
  for(const wx of[x+50,x+100,x+w-170,x+w-50]){g.fillStyle='#121214';g.beginPath();g.arc(wx,GY-12,15,0,7);g.fill();g.save();g.translate(wx,GY-12);g.rotate(t*16);g.fillStyle='#4a4a4e';g.fillRect(-6,-1.5,12,3);g.restore()}
  g.restore()}
function a4Driver(g,x,GY,f,t){g.save();g.translate(x,GY);g.scale(f,1);const sh=Math.sin(t*9)*3;
  g.strokeStyle='#2a2c34';g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(-4,-46);g.lineTo(-6,-4);g.moveTo(4,-46);g.lineTo(6,-4);g.stroke();
  g.fillStyle=f>0?'#5a3a6a':'#3a5a3a';rr(g,-12,-94,24,52,8);g.fill();g.fillStyle='#e8c8a8';g.beginPath();g.arc(2,-104,10,0,7);g.fill();g.fillStyle='#3a2a1a';g.beginPath();g.arc(2,-108,10,Math.PI,0);g.fill();
  g.fillStyle='#c83a2a';g.beginPath();g.ellipse(9,-100,3,2+Math.abs(sh)*.4,0,0,7);g.fill();
  g.strokeStyle=f>0?'#5a3a6a':'#3a5a3a';g.lineWidth=6;g.beginPath();g.moveTo(6,-86);g.lineTo(18,-112+sh);g.moveTo(-6,-86);g.lineTo(-16,-108-sh);g.stroke();g.lineCap='butt';g.restore()}
function a4Obj(g,o){g.save();g.translate(o.x,o.y);g.rotate(o.rot);
  if(o.k==='shoe'){g.fillStyle='#3a2a1a';rr(g,-10,-4,20,8,3);g.fill();g.fillRect(-10,-9,8,6)}
  else if(o.k==='bottle'){g.fillStyle='rgba(120,200,160,.85)';rr(g,-4,-11,8,18,3);g.fill();g.fillRect(-2,-15,4,5)}
  else if(o.k==='atlas'){g.fillStyle='#d8a020';g.fillRect(-10,-7,20,14);g.fillStyle='#1e5aa8';g.fillRect(-10,-7,20,4)}
  else if(o.k==='apple'){g.fillStyle='#c82a2a';g.beginPath();g.arc(0,0,7,0,7);g.fill();g.fillStyle='#3a6a2a';g.fillRect(0,-10,2,4)}
  else{g.fillStyle='#1a1a1e';rr(g,-6,-10,12,20,2);g.fill();g.fillStyle='#4a7ab8';g.fillRect(-4,-8,8,14)}
  g.restore()}
function a4Roller(g,x,GY,t,dir){g.save();g.translate(x,GY);
  g.fillStyle='#e8c020';rr(g,20,-100,110,62,6);g.fill();g.fillStyle='#2a3440';g.fillRect(60,-92,40,30);g.fillStyle='#3a3a3e';g.fillRect(20,-104,110,6);
  // les pics anti-pigeons sur le toit
  g.strokeStyle='#c8ced6';g.lineWidth=1.4;for(let k=24;k<128;k+=4){g.beginPath();g.moveTo(k,-104);g.lineTo(k+Math.sin(k)*2,-118);g.stroke()}
  // les deux cylindres
  for(const[cx,r]of[[24,38],[124,30]]){g.fillStyle='#5a5c62';g.beginPath();g.arc(cx,-r,r,0,7);g.fill();g.save();g.translate(cx,-r);g.rotate(x*.05);g.strokeStyle='#3a3c42';g.lineWidth=2;for(let k=0;k<3;k++){g.rotate(Math.PI/3);g.beginPath();g.moveTo(-r+4,0);g.lineTo(r-4,0);g.stroke()}g.restore()}
  g.fillStyle='#ff8a10';g.beginPath();g.arc(80,-108,5,Math.PI,0);g.fill();g.restore()}
function a4Worker(g,x,GY,t,up,seed){g.save();g.translate(x,GY);const f=(seed/45|0)%2?1:-1;g.scale(f,1);
  g.strokeStyle='#2a3a6a';g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(-4,-46);g.lineTo(-5,-4);g.moveTo(4,-46);g.lineTo(5,-4);g.stroke();
  g.fillStyle='#e8701c';rr(g,-12,-94,24,52,8);g.fill();g.fillStyle='#e8f0d0';g.fillRect(-12,-76,24,4);g.fillRect(-12,-60,24,4);
  g.fillStyle='#d8b898';g.beginPath();g.arc(2,-104,10,0,7);g.fill();g.fillStyle='#f0d020';g.beginPath();g.arc(2,-108,11,Math.PI,0);g.fill();g.fillRect(-10,-109,24,3);
  g.strokeStyle='#e8701c';g.lineWidth=6;if(up){g.beginPath();g.moveTo(6,-86);g.lineTo(14,-124+Math.sin(t*14)*4);g.moveTo(-6,-86);g.lineTo(-14,-122-Math.sin(t*14)*4);g.stroke()}
  else{g.beginPath();g.moveTo(6,-86);g.lineTo(12+Math.sin(t*2+seed)*3,-66);g.moveTo(-6,-86);g.lineTo(-8,-58);g.stroke();g.fillStyle='#f0f0e8';g.fillRect(10,-70,5,7)}
  g.lineCap='butt';g.restore()}
function a4Hog(g,x,GY,t){g.save();g.translate(x,GY);g.scale(-1,1);const b=Math.abs(Math.sin(t*20))*2;
  g.fillStyle='#5a4a3a';g.beginPath();g.ellipse(0,-10-b,14,9,0,Math.PI,0);g.fill();g.strokeStyle='#3a2a1a';g.lineWidth=1.2;for(let k=-12;k<12;k+=3){g.beginPath();g.moveTo(k,-10-b);g.lineTo(k-3,-19-b);g.stroke()}
  g.fillStyle='#c8a888';g.beginPath();g.ellipse(13,-7-b,6,4,0,0,7);g.fill();g.fillStyle='#111';g.beginPath();g.arc(18,-7-b,1.5,0,7);g.fill();g.restore()}
