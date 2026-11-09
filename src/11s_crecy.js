/* =========================================================
   5-1 · LE PIGEONNIER — Crécy-la-Chapelle, la « Venise briarde », en plein jour
   ---------------------------------------------------------
   Les bras du Grand Morin, les lavoirs couverts et les passerelles ; le moulin et sa roue
   (les pales sont des plateformes qui tournent) ; les sentiers du bord de l'eau (pierres de gué,
   le héron, la cane et ses petits) ; puis le quartier pavillonnaire : barrières, jardinets,
   voitures, le chat sur son mur, le chien à la chaîne, deux gamins qui jouent au foot,
   un troisième qui dévale la rue à vélo, une tondeuse robot, un trampoline, un étendoir.
   Au bout : l'adresse Fontaine, et un garage à la place du pigeonnier.
   ========================================================= */
const CW=262,CGR=12;
THEMES.crecy={outdoor:true,far:'crecy',horizon:'bridge',sky:['#5e8cc0','#a8cce6','#eef2e6'],celestial:'sun',sunY:150,fog:'#b8cad8',dark:0,weather:'clear',
  floor:'#5a4a34',floorTop:'#6aa040',type:'earth',x:'hedge',d:'hedge',shelf:'plank',spike:'wire',walker:'none',flyer:'crow',props:['fern','fern']};
const CRECY={};
(function(){
  const g=Array.from({length:15},()=>Array(CW).fill('.'));
  for(let c=0;c<CW;c++)for(let r=CGR;r<15;r++)g[r][c]='#';
  const water=(c0,c1)=>{for(let c=c0;c<=c1;c++)for(let r=0;r<15;r++)g[r][c]='.'};
  const plat=(c0,c1,r,ch)=>{for(let c=c0;c<=c1;c++)g[r][c]=ch||'='};
  const put=(c,r,ch)=>{g[r][c]=ch};
  const blocks=[];
  const block=(c0,c1,r0,kind,o)=>{for(let c=c0;c<=c1;c++)for(let r=(kind==='voiture'&&(c===c0||c===c1))?r0+1:r0;r<CGR;r++)g[r][c]='X';blocks.push(Object.assign({c0,c1,r0,kind},o||{}))};
  /* l'entrée du village et la Venise briarde */
  put(3,11,'S');
  for(const[c,r]of[[9,10],[13,9],[18,10],[24,7],[30,9],[34,8]])put(c,r,'o');
  water(12,15);plat(12,15,CGR,'=');                 // passerelle de fer
  water(21,27);plat(21,27,CGR,'=');plat(20,28,9,'=');put(22,5,'m');put(27,4,'m');put(28,4,'o');                    // le lavoir couvert : on passe par son toit
  water(33,35);
  put(38,11,'C');
  /* le moulin : la roue, puis le moulin lui-même (trop haut sans la roue) */
  water(42,50);
  block(51,57,4,'moulin');
  for(const[c,r]of[[46,5],[53,2],[56,2]])put(c,r,'o');
  put(60,11,'C');
  /* les sentiers du Grand Morin */
  water(66,70);plat(66,67,CGR,'=');
  put(68,9,'o');put(74,9,'o');
  water(78,90);put(84,8,'o');put(81,9,'o');put(87,9,'o');
  water(94,95);put(94,9,'o');
  put(100,11,'C');
  /* le quartier */
  block(104,104,11,'barriere');put(107,10,'o');
  block(110,112,9,'muret');put(111,6,'o');put(111,8,'Y');put(107,11,'T');
  block(117,117,11,'barriere');
  block(122,126,10,'voiture',{col:'#c8402a'});put(124,6,'o');   // au-dessus du chat, hors de portée de sa patte
  put(131,9,'o');put(135,10,'o');
  block(139,139,11,'barriere',{chien:1});
  put(141,11,'C');
  block(143,143,11,'haie');
  for(const[c,r]of[[148,8],[152,6],[156,8]])put(c,r,'o');
  block(164,164,11,'barriere');
  plat(171,174,5,'=');put(172,4,'o');put(173,4,'o');   // la branche du chêne (trampoline)
  put(176,10,'o');
  block(179,179,11,'barriere');
  put(182,11,'C');
  block(186,186,11,'poubelles');put(189,10,'o');
  block(192,196,10,'voiture',{col:'#3a6a9a'});put(194,6,'o');
  plat(204,209,8,'=');put(206,7,'o');put(208,7,'o');   // l'étendoir
  put(212,10,'o');
  put(215,11,'C');
  block(213,214,9,'bambou');put(213,6,'o');
  block(226,226,11,'barriere');
  put(230,10,'o');put(236,10,'o');
  block(240,240,11,'barriere');
  put(244,10,'o');
  put(254,11,'E');
  CRECY.segs=[g.map(r=>r.join('')).join('\n')];{const d=LEVELS.find(d=>d.crecy);if(d)d.segs=CRECY.segs}CRECY.blocks=blocks;
  CRECY.masks=[];for(const[c0,c1,r]of[[12,15,CGR],[21,27,CGR],[20,28,9],[66,67,CGR],[171,174,5],[204,209,8]])for(let c=c0;c<=c1;c++)CRECY.masks.push([c,r]);
})();

function crecyPost(Lv){
  if(!Lv.def.crecy)return;
  const C=Lv.crecy={t:0,said:{}};
  // la roue du moulin : 8 pales qui tournent (dans le sens des aiguilles : côté gauche qui monte)
  C.wheel={cx:46.5*T,cy:11*T,R:132,a:0,w:.42};
  for(let k=0;k<8;k++)Lv.movers.push({axis:'s',kind:'pale',k,x:0,y:0,w:46,h:10,t:0,dx:0,dy:0});
  // le trampoline
  Lv.movers.push({axis:'s',kind:'trampo',x:166.2*T,y:CGR*T-26,w:76,h:10,t:0,dx:0,dy:0,bouncy:1});
  // la cane et ses canetons
  Lv.movers.push({axis:'h',kind:'cane',x:79*T,y:CGR*T+4,w:50,h:12,a0:79*T,a1:88.5*T,t:0,dx:0,dy:0,speed:46});
  C.dogs=[{kx:133*T,R:170,x:133*T+40,f:-1,st:0,bark:0,size:1},{kx:232*T,R:120,x:232*T-30,f:1,st:0,bark:0,size:.62}];
  C.cats=[{x:124.5*T,y:10*T,sw:0,cool:0,col:'#e0883a',str:'#b8682a'},{x:194.5*T,y:10*T,sw:0,cool:.7,col:'#2a2a2e',str:'#f2f0ea',bw:1}];
  C.heron={x:74.5*T,strike:0,cool:1.5,side:1};
  C.foot={k1:145.5*T,k2:159.5*T,ball:{x:0,y:0,on:false},t:0,x1:145.5*T,x2:159.5*T};
  C.bike={x:214*T,dir:-1,on:true,warn:0,pause:1.2};
  C.mower={x:169*T,dir:1};
  wheelPlace(C.wheel,Lv.movers,0);
  C.era=26;C.flash=0;C.exit0=Lv.exit;
  Lv.acts=Lv.acts||[];
  C.nain={kind:'secret',style:'nain',x:114*T,y:CGR*T,open:0,t:0,used:false,q:["Il est tombé. Il était creux, et plein de paille. Les nains de jardin, c'est comme les sergents : tout dans l'apparence."]};
  C.linge={kind:'secret',style:'linge',x:207*T,rx:3*T,y:8*T,open:0,t:0,used:false,q:["En plein sur le linge propre. J'ai honte. Mais qu'est-ce que j'adorais faire ça, quand j'étais jeune."]};
  C.grain={kind:'secret',style:'grain',x:251.5*T,y:CGR*T,open:0,t:0,used:false,when:()=>L.crecy&&L.crecy.era===14,q:["Le sac de grain du père Vasseur. Il en laissait toujours tomber un peu exprès, pour nous. Je m'en souviens comme si c'était ce matin."]};
  C.niche={kind:'secret',style:'niche',x:133*T,y:CGR*T,open:0,t:0,used:false,q:["La niche de Rex. Une couverture, un os, une balle mâchouillée… et de la paille. Ce chien a des goûts de sergent."]};
  Lv.acts.push(C.nain,C.linge,C.grain,C.niche);
  for(const w of Lv.watchers)w.white=true;
  // deux guêpiers : sous l'avant-toit du moulin (vers la jardinière du drapeau) et dans le platane près du n° 26 (vers le rosier)
  C.nests=[{x:51*T+16,y:4*T+26},{x:97*T+16,y:CGR*T-232}];
  C.wasps=[{path:CW_PATH1,per:5.2,ph:0},{path:CW_PATH1,per:5.2,ph:.5},{path:CW_PATH2,per:6.4,ph:0},{path:CW_PATH2,per:6.4,ph:.5}].map(o=>Object.assign(o,{x:0,y:0,f:1}));
  C.doves=Array.from({length:9},(_,i)=>({a:i*.7,r:60+(i%3)*30,sp:.9+(i%4)*.18,y:-(150+(i%5)*24)}));
}
function wheelPlace(W0,movers,dt){W0.a+=W0.w*dt;
  for(const m of movers)if(m.kind==='pale'){const a=W0.a+m.k*Math.PI/4,px=m.x,py=m.y;m.x=W0.cx+Math.cos(a)*W0.R-m.w/2;m.y=W0.cy+Math.sin(a)*W0.R;m.dx=m.x-px;m.dy=m.y-py}}
function crecyStep(dt){const C=L.crecy;if(!C)return;C.t+=dt;C.flash=Math.max(0,C.flash-dt*1.4);
  L.exit=C.era===14?null:C.exit0;
  if(C.era===14&&P.x+P.w/2<240.6*T)crecySet(26,true);
  crecyPigStep();
  {const tb=document.getElementById('tb');if(tb)tb.classList.toggle('ferte',P.x>241*T)}
  wheelPlace(C.wheel,L.movers,dt);
  // une pale qui plonge sous l'eau emporte Raymond
  if(P.onMover&&P.onMover.kind==='pale'&&P.onMover.y>CGR*T+16){P.onMover=null;P.onGround=false}
  const px=P.x+P.w/2;
  // les chiens
  for(const d of C.dogs){if(C.era===14&&d.kx>230*T)continue;const tx=clamp(px,d.kx-d.R,d.kx+d.R),inRange=Math.abs(px-d.kx)<d.R+160&&P.y>8*T,sees=Math.sign(px-d.x)===d.f||Math.abs(px-d.x)<26;d.alert=Math.max(0,(d.alert||0)-dt);if(inRange&&(sees||d.alert>0)&&!P.dead)d.alert=1.4;const near=d.alert>0&&inRange;
    const goal=near?tx:d.kx+Math.sin(C.t*.32+d.kx)*d.R*.8;const sp=near?260:46,mv=clamp(goal-d.x,-sp*dt,sp*dt);d.x+=mv;if(Math.abs(mv)>.02)d.f=Math.sign(mv);d.run=Math.abs(mv)>.02;   // il se retourne pour aller et venir (plus de marche arrière)
    if(near){d.bark-=dt;if(d.bark<=0){d.bark=.55;if(!G.sim){tone(d.size<1?620:260,.09,'square',.05,d.size<1?480:180);bubble(d.x+d.f*20,CGR*T-60*d.size,'Wouf !','#6a3a22')}}}}
  // le chat sur son muret : un coup de patte quand on passe trop près
  for(const k of C.cats){k.cool-=dt;if(k.sw>0)k.sw-=dt;if(k.cool<=0&&Math.abs(px-k.x)<70&&P.y<k.y+20){k.sw=.45;k.cool=1.4;if(!G.sim)noise(.15,2400,.06,'bandpass')}}
  // le héron : un coup de bec régulier
  {const h=C.heron;h.cool-=dt;if(h.strike>0)h.strike-=dt;if(h.cool<=0){h.side=-h.side;h.strike=.5;h.cool=1.35;if(!G.sim&&Math.abs(P.x-h.x)<700)noise(.06,1800,.05,'highpass')}}
  // le football : lobs (vols planés) et tirs à ras de terre, alternés
  {const f=C.foot;f.t+=dt;const per=2.2,cyc=f.t%(per*2),leg=cyc<per?0:1,u=(cyc%per)/per;
    f.x1=145.5*T+Math.sin(f.t*1.3)*40;f.x2=159.5*T+Math.sin(f.t*1.1+1)*40;
    const a=leg?f.x2:f.x1,b=leg?f.x1:f.x2,lob=Math.floor(f.t/(per*2))%2===0;
    f.ball.on=u>.08&&u<.92;const v=(u-.08)/.84;f.ball.x=lerp(a,b,v);f.ball.y=CGR*T-10-Math.sin(v*Math.PI)*(lob?210:24)-(lob?0:Math.abs(Math.sin(v*Math.PI*3))*16);f.ball.spin=(f.ball.spin||0)+dt*9;f.leg=leg;f.u=u;
    if(u<.08&&!f.kicked){f.kicked=1;if(!G.sim&&Math.abs(px-a)<800)noise(.08,500,.12,'lowpass')}if(u>.5)f.kicked=0}
  // le vélo : un gamin casqué qui dévale la rue, de droite à gauche
  {const b=C.bike;if(b.pause>0){b.pause-=dt;if(b.pause<=0&&!G.sim&&Math.abs(px-b.x)<900){tone(1760,.08,'sine',.05);setTimeout(()=>tone(1760,.08,'sine',.05),140)}}
    else{b.x+=b.dir*380*dt;if(b.x<181*T){b.x=181*T;b.dir=1;b.pause=1.1}if(b.x>214*T){b.x=214*T;b.dir=-1;b.pause=1.1}}}
  // la tondeuse robot
  {const m=C.mower;m.x+=m.dir*55*dt;if(m.x>177.6*T){m.dir=-1}if(m.x<167.8*T+60){m.dir=1}}
  if(C.linge.used&&C.linge.sx==null)C.linge.sx=clamp(P.x+P.w/2,204*T+10,210*T-10);
  // les guêpes : un circuit fermé, toujours le même
  for(const w of C.wasps){const u=(C.t/w.per+w.ph)%1,[x,y]=cwAt(w.path,u),[x2]=cwAt(w.path,(u+.01)%1);w.f=x2>=x?1:-1;w.x=x+Math.sin(C.t*9+w.ph*20)*4;w.y=y+Math.sin(C.t*13+w.ph*30)*3}
  // répliques
  if(!C.said.moulin&&px>40*T){C.said.moulin=1;say("Le moulin. Sa roue tourne toujours. Elle me montera plus haut que mes ailes.",3.8)}
  if(!C.said.chatb&&px>104*T){C.said.chatb=1;say("Un chat blanc sur le muret. Il fait semblant de dormir, comme Bijou. Quand ses yeux s'allument, ne plus bouger d'une plume.",4.4)}
  if(!C.said.quartier&&px>101*T){C.said.quartier=1;say("Des maisons neuves partout. Le pigeonnier Vasseur était au bout du village… je crois. Je le sens par là.",4.2)}
  if(!C.said.foot&&px>142*T){C.said.foot=1;say("Deux gamins qui jouent à la balle. Leur ballon vole mieux que moi.",3.2)}
  if(!C.said.velo&&px>183*T){C.said.velo=1;say("Un casque de tranchée sur la tête d'un enfant, à vélo. On mobilise jeune, ici.",3.8)}
}
function crecyAfterMove(){const C=L.crecy;if(!C)return null;
  const hb={x:P.x+3,y:P.y+4,w:P.w-6,h:P.h-6};
  // les pattes dans l'eau (une pale de la roue qui plonge, un saut trop court) : noyé
  {const feet=P.y+P.h,c=Math.floor((P.x+P.w/2)/T);if(feet>CGR*T+8&&(!P.onMover||P.onMover.kind==='pale')&&L.g[CGR]&&L.g[CGR][c]!=='#'&&L.g[CGR][c]!=='=')return'drown'}
  for(const d of C.dogs){if(C.era===14&&d.kx>230*T)continue;const s=d.size;if(overlap(hb,{x:d.x-22*s,y:CGR*T-34*s,w:44*s,h:34*s}))return'chien'}
  for(const k of C.cats)if(k.sw>0&&overlap(hb,{x:k.x-50,y:k.y-46,w:100,h:46}))return'chat';
  {const h=C.heron;if(h.strike>0&&h.strike<.35&&overlap(hb,{x:h.side>0?h.x+10:h.x-70,y:CGR*T-60,w:60,h:40}))return'heron'}
  {const f=C.foot;if(f.ball.on&&overlap(hb,{x:f.ball.x-11,y:f.ball.y-11,w:22,h:22}))return'ballon';for(const kx of[f.x1,f.x2])if(overlap(hb,{x:kx-14,y:CGR*T-70,w:28,h:70}))return'enfant'}
  {const b=C.bike;if(overlap(hb,{x:b.x-40,y:CGR*T-74,w:80,h:74}))return'velo'}
  {const m=C.mower;if(overlap(hb,{x:m.x-22,y:CGR*T-18,w:44,h:18}))return'tondeuse'}
  for(const w of C.wasps)if(overlap(hb,{x:w.x-7,y:w.y-6,w:14,h:12}))return'wasp';
  return null}
function crecyTiles(){const sv=[];for(const b of CRECY.blocks)for(let c=b.c0;c<=b.c1;c++)for(let r=b.r0;r<CGR;r++){sv.push([c,r,L.g[r][c]]);L.g[r][c]='.'}
  for(const[c,r]of CRECY.masks){sv.push([c,r,L.g[r][c]]);L.g[r][c]='.'}
  const t=buildTilesF(L);for(const[c,r,ch]of sv)L.g[r][c]=ch;return t}

/* ---------- fond : le ciel de jour, la collégiale, les toits ---------- */
function crecyFar(L,g,wpx,R){
  const sk=L.th.sky;const gr=g.createLinearGradient(0,0,0,470);gr.addColorStop(0,sk[0]);gr.addColorStop(.6,sk[1]);gr.addColorStop(1,sk[2]);g.fillStyle=gr;g.fillRect(0,0,wpx,600);
  const sx=wpx*.3;const sg=g.createRadialGradient(sx,150,6,sx,150,220);sg.addColorStop(0,'rgba(255,250,225,.75)');sg.addColorStop(1,'rgba(255,250,225,0)');g.fillStyle=sg;g.fillRect(sx-220,-70,440,440);g.fillStyle='#fffbe8';g.beginPath();g.arc(sx,150,24,0,7);g.fill();
  for(let k=0;k<wpx/220;k++){const x=R()*wpx,y=60+R()*130,w=90+R()*150;g.fillStyle='rgba(255,255,255,.75)';g.beginPath();g.ellipse(x,y,w,16,0,0,7);g.ellipse(x-w*.3,y-12,w*.4,18,0,0,7);g.ellipse(x+w*.25,y-16,w*.35,20,0,0,7);g.fill()}
  const far=mix(sk[1],'#3a5a4a',.45),near=mix(sk[1],'#2a4030',.62);
  hills(g,wpx,400,26,mix(sk[2],far,.5),R,.004);hills(g,wpx,428,18,far,R,.008);
  for(let x=0;x<wpx;x+=26+R()*22){g.fillStyle=mix(near,'#000000',R()*.15);g.beginPath();g.arc(x,440-R()*14,18+R()*16,0,7);g.fill()}
  // la collégiale de La Chapelle-sur-Crécy, au loin : nef haute, contreforts, clocher
  for(let x=700;x<wpx;x+=2600){const b=450,c=mix(near,'#8a8a80',.3);g.fillStyle=c;g.fillRect(x,b-90,220,90);poly(g,[x-6,b-90,x+110,b-140,x+226,b-90]);g.fill();
    for(let k=0;k<6;k++){poly(g,[x+10+k*38,b,x+18+k*38,b-100,x+24+k*38,b]);g.fill()}g.fillRect(x+180,b-170,40,170);poly(g,[x+176,b-170,x+200,b-220,x+224,b-170]);g.fill();
    g.fillStyle='rgba(0,0,0,.2)';for(let k=0;k<5;k++)g.fillRect(x+22+k*38,b-70,8,30)}
  for(let x=-30;x<wpx;){const w=46+R()*50,h=30+R()*24;house(g,x,474,w,h,mix(near,'#e8dcc8',.55),mix(near,'#a8503a',.55),R,0);x+=w+4+R()*30}
  const hz=g.createLinearGradient(0,300,0,600);hz.addColorStop(0,rgba(L.th.fog,0));hz.addColorStop(1,rgba(L.th.fog,.45));g.fillStyle=hz;g.fillRect(0,300,wpx,300);
}
function crecyMidLayer(L,g,wpx,R){const base=mix(L.th.sky[1],'#20381e',.62);
  for(let x=10;x<wpx;){const k=R();if(k<.5){roundTree(g,x,528,120+R()*80,base);x+=60+R()*70}else if(k<.75){for(let i=0;i<4;i++)poplar(g,x+i*22,528,130+R()*50,base);x+=120+R()*60}
    else{house(g,x,528,80+R()*40,56+R()*30,mix(base,'#e8dcc8',.45),mix(base,'#b0583a',.4),R,0);x+=140+R()*80}}}

/* ---------- au monde : l'eau, les maisons du fond, les arbres ---------- */
const CRECY_BG=[
  ['saule',1],['maisonEau',7],['saule',17],['maisonEau',30],['grand',37],['peuplier',61],['saule',64],['grand',72],['saule',77],['peuplier',92],['grand',97],
  ['pavillon',104],['pavillon',118],['chene',128],['pavillon',134],['grand',145],['peuplier',157],['palmier',156.5],['pavillon',150],['chene',161],['pavillon',171],['chene',172],['pavillon',186],['pavillon',200],['grand',212],['pavillon',219],['lilas',224],['pavillon',232],['grand',241]];
const CRECY_FG=[['panneau',6],['fleurs',11],['fleurs',17],['lampe',19],['banc',30],['fleurs',37],['roses',104.45],['roses',118.45],['boite',128],['niche',133],['rosier',146],['buissons',162],['bacs',181],['boite',199],['rosier',213],['bacs',225],['nain',229],['roses',238]];
function drawCrecyBack(t,cx){const C=L.crecy;if(!C)return;const g=ctx,vis=(a,b)=>b>cx-260&&a<cx+W+260;
  // le Grand Morin
  const y0=CGR*T+8;const wg=g.createLinearGradient(0,y0,0,ROWS*T+40);wg.addColorStop(0,'#5a8a86');wg.addColorStop(1,'#25403c');g.fillStyle=wg;g.fillRect(cx-40,y0,W+100,ROWS*T+60-y0);
  g.strokeStyle='rgba(235,250,245,.35)';g.lineWidth=1.2;for(let k=0;k<30;k++){const xx=cx-40+((k*131+t*20*(k%3+1))%(W+100)),yy=y0+6+(k*19)%60;g.beginPath();g.moveTo(xx,yy);g.lineTo(xx+16+(k%5)*5,yy);g.stroke()}
  const b=CGR*T;
  const e14=C.era===14;
  for(const[k,c]of CRECY_BG){const x=c*T;if(!vis(x-200,x+260))continue;if(e14&&c>=230&&k==='pavillon')continue;
    if(k==='saule')fSpr(g,'cr-saule2',460,520,230,505,x,b,g2=>{g2.scale(1.35,1.35);fWillow(g2,0,0,0)});
    else if(k==='grand')fSpr(g,'cr-grand',340,520,170,505,x,b,g2=>{g2.scale(1.5,1.5);fPlane(g2,0,0,false)});
    else if(k==='chene')fSpr(g,'cr-chene',380,520,190,505,x,b,g2=>cOak(g2));
    else if(k==='peuplier'){fPoplarN(g,x-30,b,320);fPoplarN(g,x,b,380);fPoplarN(g,x+32,b,300)}
    else if(k==='palmier')cPalm(g,x,b,t);else if(k==='lilas')cLilac(g,x,b);
    else if(k==='maisonEau')cRiverHouse(g,x,b,c);else if(k==='pavillon')cPavillon(g,x,b,c)}
  // le lavoir couvert (poteaux, toit, pierres à laver), la passerelle de fer
  if(vis(19*T,29*T))cLavoir(g);
  if(vis(11*T,17*T))cFootbridge(g,12*T,16*T);
  if(vis(41*T,58*T))cMillBack(g,t);
  for(const[k,c]of CRECY_FG){const x=c*T;if(!vis(x-120,x+120))continue;if(e14&&c>=236)continue;
    if(k==='panneau')cEntrySign(g,x,b);else if(k==='fleurs')cFlowerRail(g,x,b);else if(k==='lampe')fLamp(g,x,b);else if(k==='banc')fBench(g,x,b);
    else if(k==='roses'||k==='rosier')cRoses(g,x,b,k==='rosier');else if(k==='nain')cGnome(g,x,b);else if(k==='boite')cMailbox(g,x,b,c===128?'MOREL':'DUVAL');
    else if(k==='niche')cKennel(g,x,b);else if(k==='buissons')cBushes(g,x,b);else if(k==='bacs')cPlanters(g,x,b)}
  if(vis(165*T,180*T))cLawn(g,165*T,179*T);
  if(vis(129*T,138*T))cWornLawn(g,C.dogs[0]);
  if(vis(228*T,236*T))cWornLawn(g,C.dogs[1]);
  if(vis(244*T,262*T))cFontaine(g,t);
}
function drawCrecyMid(t){const C=L.crecy;if(!C)return;const g=ctx,vis=(a,b)=>b>cam.x-220&&a<cam.x+W+220;
  for(const b of CRECY.blocks)if(vis(b.c0*T-40,(b.c1+1)*T+40))cBlock(g,b,t);
  if(vis(40*T,53*T))cWheel(g,C.wheel,t);
  if(vis(64*T,71*T))cBoat(g,67*T,CGR*T,t);
  if(vis(170*T,176*T))cBranch(g);
  if(vis(203*T,211*T))cLaundry(g,t);
  cSecrets(g,t);
  if(vis(19*T,30*T))cLavoirRoof(g);
  if(vis(165*T,169*T))cTrampo(g,t);
  {const h=C.heron;if(vis(h.x-60,h.x+120))cHeron(g,h,t)}
  for(const k of C.cats)if(vis(k.x-60,k.x+60))cCat(g,k,t);
  for(const d of C.dogs)if(!(C.era===14&&d.kx>230*T)&&vis(d.kx-d.R-60,d.kx+d.R+60))cDog(g,d,t);
  {const f=C.foot;if(vis(140*T,165*T)){cKid(g,f.x1,CGR*T,1,t,'#d8402a','#4a2a1a',f.leg===0&&f.u<.15);cKid(g,f.x2,CGR*T,-1,t,'#2a6ab0','#d8b060',f.leg===1&&f.u<.15);if(f.ball.on)cBall(g,f.ball)}}
  {const b=C.bike;if(vis(b.x-60,b.x+60))cBike(g,b.x,CGR*T,t,b.dir,b.pause>0)}
  {const m=C.mower;if(vis(m.x-40,m.x+40))cMower(g,m,t)}
  for(const n of C.nests)if(vis(n.x-30,n.x+30))cNest(g,n.x,n.y);
  for(const w of C.wasps)if(vis(w.x-20,w.x+20))cWasp(g,w,t);
}
/* ---------- les dessins ---------- */
function cOak(g){g.fillStyle='#4a3a28';g.beginPath();g.moveTo(-24,4);g.quadraticCurveTo(-16,-120,-14,-200);g.lineTo(14,-200);g.quadraticCurveTo(16,-120,26,4);g.closePath();g.fill();
  g.strokeStyle='#4a3a28';g.lineWidth=9;g.lineCap='round';g.beginPath();g.moveTo(0,-180);g.quadraticCurveTo(-60,-230,-110,-250);g.moveTo(0,-190);g.quadraticCurveTo(60,-240,120,-250);g.stroke();
  for(const[dx,dy,r,c]of[[-110,-270,58,'#3a5a26'],[110,-276,60,'#43662c'],[0,-320,78,'#4a6e30'],[-60,-300,60,'#3e6028'],[60,-300,58,'#466a2e'],[-140,-230,40,'#3a5a26'],[140,-232,40,'#43662c'],[0,-250,52,'#3e6028']]){g.fillStyle=c;g.beginPath();g.arc(dx,dy,r,0,7);g.fill()}
  g.fillStyle='rgba(255,250,200,.13)';g.beginPath();g.arc(-20,-350,40,0,7);g.fill()}
function cPalm(g,x,b,t){g.save();g.strokeStyle='#7a6448';g.lineWidth=12;g.beginPath();g.moveTo(x,b);g.quadraticCurveTo(x+16,b-90,x+6,b-200);g.stroke();g.strokeStyle='rgba(60,40,20,.4)';g.lineWidth=1;for(let y=b-10;y>b-200;y-=10){g.beginPath();g.moveTo(x-4+(b-y)*.02,y);g.lineTo(x+10+(b-y)*.02,y-3);g.stroke()}
  for(let k=0;k<9;k++){const a=-Math.PI+k/8*Math.PI+Math.sin(t*1.2+k)*.04,len=80;g.strokeStyle=k%2?'#3a7a3a':'#4a8a40';g.lineWidth=4;g.beginPath();g.moveTo(x+6,b-200);g.quadraticCurveTo(x+6+Math.cos(a)*len*.6,b-200+Math.sin(a)*len*.6-24,x+6+Math.cos(a)*len,b-200+Math.sin(a)*len*.4+20);g.stroke()}g.restore()}
function cLilac(g,x,b){g.save();g.strokeStyle='#5a4a36';g.lineWidth=5;for(const dx of[-20,0,18]){g.beginPath();g.moveTo(x,b);g.lineTo(x+dx,b-90);g.stroke()}
  for(let k=0;k<14;k++){const dx=-60+((k*37)%120),dy=-80-((k*53)%90);g.fillStyle='#4a7a3a';g.beginPath();g.arc(x+dx,b+dy,20,0,7);g.fill()}
  for(let k=0;k<11;k++){const dx=-56+((k*41)%112),dy=-90-((k*29)%86);g.fillStyle=k%2?'#b07ac8':'#c896d8';g.beginPath();g.ellipse(x+dx,b+dy,7,13,.2,0,7);g.fill()}g.restore()}
function cRiverHouse(g,x,b,c){g.save();const w=180,h=170,col=['#e8dcc4','#d8c8a8','#efe6d2'][c%3];g.fillStyle=col;g.fillRect(x-w/2,b-h,w,h);
  cChimney(g,x+46,b-h-84,b-h,22);cRoofTiles(g,[x-w/2-12,b-h,x,b-h-70,x+w/2+12,b-h],'#a84a32',null);
  for(const[ox,oy]of[[-60,-140],[20,-140],[-60,-80],[20,-80]]){g.fillStyle='#4a5a6a';g.fillRect(x+ox,b+oy,30,40);g.strokeStyle='#efe6d2';g.lineWidth=2;g.strokeRect(x+ox,b+oy,30,40);g.fillStyle='#5a8a6a';g.fillRect(x+ox-10,b+oy,8,40);g.fillRect(x+ox+32,b+oy,8,40);
    g.fillStyle='#6a4a2a';g.fillRect(x+ox-4,b+oy+40,38,6);for(let k=0;k<5;k++){g.fillStyle=['#e83a5a','#f2f0e8','#e86aa0'][k%3];g.beginPath();g.arc(x+ox-1+k*8,b+oy+39,3.5,0,7);g.fill()}}
  g.restore()}
function cPavillon(g,x,b,c){g.save();const w=230,h=150,cols=['#efe2c8','#e8d4b4','#f2ece0','#dcd2c2'],col=cols[c%4];
  g.fillStyle=col;g.fillRect(x-w/2,b-h,w,h);if(c%2)cChimney(g,x-w/2+64,b-h-100,b-h-40,20);else cChimney(g,x+w/2-70,b-h-96,b-h-40,18);
  cRoofTiles(g,[x-w/2-14,b-h,x-w/2+40,b-h-74,x+w/2-40,b-h-74,x+w/2+14,b-h],['#a84a32','#6a6a70','#b8603a'][c%3],[x-w/2+40,x+w/2-40,b-h-74]);
  if(c%2){g.fillStyle='#8a8a8a';g.beginPath();g.ellipse(x+w/2-50,b-h-40,11,8,-.4,0,7);g.fill();g.fillStyle='#5a5a5a';g.fillRect(x+w/2-51,b-h-34,2,10)}
  for(const ox of[-w/2+22,w/2-62]){g.fillStyle='#5a7088';g.fillRect(x+ox,b-h+26,40,40);g.strokeStyle='#f6f2ea';g.lineWidth=2;g.strokeRect(x+ox,b-h+26,40,40);g.beginPath();g.moveTo(x+ox+20,b-h+26);g.lineTo(x+ox+20,b-h+66);g.stroke();
    g.fillStyle='rgba(240,236,226,.9)';g.fillRect(x+ox,b-h+26,40,12);for(let k=0;k<5;k++)g.fillRect(x+ox+k*9,b-h+38,4,6)}
  g.fillStyle='#e8e4dc';g.fillRect(x-w/2+20,b-80,76,80);g.fillStyle='rgba(0,0,0,.12)';for(let k=1;k<8;k++)g.fillRect(x-w/2+20,b-80+k*10,76,2);
  g.fillStyle='#7a4a2a';rr(g,x+w/2-60,b-74,36,74,3);g.fill();g.fillStyle='#d8c890';g.beginPath();g.arc(x+w/2-30,b-38,2.5,0,7);g.fill();cHouseNo(g,x+w/2-42,b-60,String(2+c%40));
  g.restore()}
function cLavoir(g){const x0=20.5*T,x1=28*T,top=9*T+6,y=CGR*T;g.save();
  // les deux piles de pierre, sur les berges
  for(const px of[20*T,27*T+14]){g.fillStyle='#a8a090';g.fillRect(px,y,26,ROWS*T-y);g.fillStyle='rgba(60,50,40,.25)';for(let yy=y+10;yy<ROWS*T;yy+=16)g.fillRect(px,yy,26,2)}
  // le plancher du lavoir et sa poutre de rive
  g.fillStyle='#6a4e32';g.fillRect(20*T,y,9*T,10);g.fillStyle='#8a6a46';g.fillRect(20*T,y,9*T,3);g.fillStyle='rgba(0,0,0,.25)';for(let x=20*T;x<29*T;x+=18)g.fillRect(x,y,1.5,10);
  g.fillStyle='#4a3424';g.fillRect(20*T,y+10,9*T,6);
  // les pierres à laver, inclinées vers l'eau, un baquet, une planche à laver
  g.fillStyle='#b8b0a0';for(let k=0;k<5;k++){const px=21*T+10+k*50;poly(g,[px,y,px+34,y,px+38,y-9,px+4,y-14]);g.fill();g.fillStyle='rgba(0,0,0,.15)';g.fillRect(px,y-2,34,2);g.fillStyle='#b8b0a0'}
  g.fillStyle='#8a5a32';rr(g,25*T,y-22,30,22,3);g.fill();g.strokeStyle='#4a4a4a';g.lineWidth=2;g.beginPath();g.moveTo(25*T,y-16);g.lineTo(25*T+30,y-16);g.moveTo(25*T+2,y-6);g.lineTo(25*T+28,y-6);g.stroke();
  g.save();g.translate(23*T,y-2);g.rotate(-.3);g.fillStyle='#a8845a';g.fillRect(0,-30,18,30);g.strokeStyle='rgba(60,40,20,.5)';g.lineWidth=1;for(let k=0;k<6;k++){g.beginPath();g.moveTo(2,-26+k*4);g.lineTo(16,-26+k*4);g.stroke()}g.restore();
  // les poteaux : du plancher jusqu'à la panne, avec leurs liens en écharpe
  for(const px of[x0,x0+110,x0+220,x1]){g.fillStyle='#5a4028';g.fillRect(px-5,top,10,y-top);g.fillStyle='rgba(255,230,190,.12)';g.fillRect(px-5,top,2,y-top);
    g.strokeStyle='#5a4028';g.lineWidth=5;g.beginPath();if(px>x0){g.moveTo(px,top+30);g.lineTo(px-30,top+2)}if(px<x1){g.moveTo(px,top+30);g.lineTo(px+30,top+2)}g.stroke()}
  g.restore()}
function cFootbridge(g,x0,x1){const y=CGR*T;g.save();g.fillStyle='#4a5a5a';g.fillRect(x0,y,x1-x0,8);g.fillStyle='#3a4646';g.fillRect(x0,y+8,x1-x0,6);
  g.strokeStyle='#3a4a4a';g.lineWidth=2;g.beginPath();g.moveTo(x0,y-36);g.lineTo(x1,y-36);g.moveTo(x0,y-18);g.lineTo(x1,y-18);g.stroke();for(let x=x0;x<=x1;x+=16){g.beginPath();g.moveTo(x,y);g.lineTo(x,y-36);g.stroke()}
  for(let k=0;k<6;k++){g.fillStyle=['#e83a5a','#f6f2ea','#e86aa0','#b83ac8'][k%4];g.beginPath();g.arc(x0+10+k*((x1-x0-20)/5),y-40,5,0,7);g.fill()}g.fillStyle='#4a7a3a';g.fillRect(x0,y-38,x1-x0,3);g.restore()}
function cMillBack(g,t){// le bief et la vanne
  g.save();g.fillStyle='#8a8478';g.fillRect(41*T,CGR*T-6,10,80);g.fillRect(51*T-10,CGR*T-6,10,80);g.fillStyle='rgba(230,245,240,.35)';for(let k=0;k<6;k++){g.fillRect(42*T+((t*60+k*70)%(9*T)),CGR*T+20+k*3,30,2)}g.restore()}
function cWheel(g,W0,t){g.save();const{cx,cy,R}=W0;
  // l'arbre de la roue, jusqu'au palier scellé dans le mur du moulin
  {const mx=51*T;g.fillStyle='#4a3622';g.fillRect(cx,cy-9,mx-cx+6,18);g.fillStyle='rgba(255,230,190,.15)';g.fillRect(cx,cy-9,mx-cx+6,3);g.fillStyle='#3a3a38';for(const bx of[cx+30,cx+(mx-cx)/2,mx-20])g.fillRect(bx,cy-10,5,20);
   g.fillStyle='#9a9078';g.fillRect(mx-18,cy-22,22,44);g.fillStyle='#7a705c';g.fillRect(mx-18,cy+18,22,4);g.fillStyle='#3a3a38';g.beginPath();g.arc(mx-7,cy,6,0,7);g.fill()}
  // l'axe, les rais, la jante
  g.strokeStyle='#4a3a28';g.lineWidth=10;g.beginPath();g.arc(cx,cy,R-26,0,7);g.stroke();g.lineWidth=6;g.beginPath();g.arc(cx,cy,R-60,0,7);g.stroke();
  for(let k=0;k<8;k++){const a=W0.a+k*Math.PI/4+Math.PI/8;g.lineWidth=7;g.beginPath();g.moveTo(cx,cy);g.lineTo(cx+Math.cos(a)*(R-20),cy+Math.sin(a)*(R-20));g.stroke()}
  for(let k=0;k<8;k++){const a=W0.a+k*Math.PI/4;const ex=cx+Math.cos(a)*R,ey=cy+Math.sin(a)*R;g.strokeStyle='#5a4630';g.lineWidth=5;g.beginPath();g.moveTo(cx+Math.cos(a)*(R-26),cy+Math.sin(a)*(R-26));g.lineTo(ex,ey);g.stroke();
    g.fillStyle='#6a523a';g.fillRect(ex-23,ey-2,46,10);g.fillStyle='#8a6e4e';g.fillRect(ex-23,ey-2,46,3);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(ex-23,ey+6,46,2);
    if(ey>CGR*T+4){g.fillStyle='rgba(230,245,240,.5)';g.beginPath();g.ellipse(ex,CGR*T+10,26,4,0,0,7);g.fill()}}
  g.fillStyle='#3a2a1c';g.beginPath();g.arc(cx,cy,16,0,7);g.fill();g.fillStyle='#6a6a66';g.beginPath();g.arc(cx,cy,6,0,7);g.fill();
  // sous l'eau, la roue se trouble
  {const wl=CGR*T+8;g.save();g.beginPath();g.rect(cx-R-40,wl,2*R+80,R+60);g.clip();const wg=g.createLinearGradient(0,wl,0,cy+R+30);wg.addColorStop(0,'rgba(80,128,124,.55)');wg.addColorStop(1,'rgba(40,70,66,.85)');g.fillStyle=wg;g.fillRect(cx-R-40,wl,2*R+80,R+60);
   g.strokeStyle='rgba(230,248,244,.35)';g.lineWidth=1.2;for(let k=0;k<9;k++){const xx=cx-R+((k*53+t*24)%(2*R)),yy=wl+6+(k*17)%50;g.beginPath();g.moveTo(xx,yy);g.lineTo(xx+20,yy);g.stroke()}g.restore()}
  // l'eau qui ruisselle des pales
  g.strokeStyle='rgba(220,240,240,.55)';g.lineWidth=1.5;for(let k=0;k<8;k++){const a=W0.a+k*Math.PI/4;const ex=cx+Math.cos(a)*R,ey=cy+Math.sin(a)*R;if(Math.sin(a)<-.2&&Math.cos(a)>-.4){for(let j=0;j<3;j++){g.beginPath();g.moveTo(ex-16+j*14,ey+8);g.lineTo(ex-16+j*14,ey+18+((t*80+j*7)%18));g.stroke()}}}
  g.restore()}
function cStone(g,x,y){g.save();g.fillStyle='#8a8478';g.beginPath();g.ellipse(x+20,y+4,24,8,0,0,7);g.fill();g.fillStyle='#a8a296';g.beginPath();g.ellipse(x+18,y+1,20,5,0,0,7);g.fill();g.fillStyle='rgba(60,90,40,.6)';g.fillRect(x+4,y+6,30,2);g.restore()}
function cBranch(g){const y=5*T;g.save();g.fillStyle='#4a3a28';g.beginPath();g.moveTo(172*T-30,y+30);g.quadraticCurveTo(173*T,y+18,175*T+6,y+6);g.lineTo(175*T+6,y-2);g.quadraticCurveTo(173*T,y-2,171*T-10,y+4);g.closePath();g.fill();g.fillStyle='#6a5640';g.fillRect(171*T,y-1,4*T,3);
  g.fillStyle='#4a6e30';g.beginPath();g.arc(175*T+10,y-8,16,0,7);g.arc(171*T+4,y-10,12,0,7);g.fill();g.restore()}
function cLaundry(g,t){const x0=204*T,x1=210*T,y=8*T;g.save();g.fillStyle='#8a8a86';g.fillRect(x0-6,y-4,6,CGR*T-y+4);g.fillRect(x1,y-4,6,CGR*T-y+4);
  g.strokeStyle='#ececec';g.lineWidth=1.5;g.beginPath();g.moveTo(x0,y);g.quadraticCurveTo((x0+x1)/2,y+4,x1,y);g.stroke();
  const items=[[x0+14,'#f2f0ea',46,44],[x0+66,'#e8a0b0',30,36],[x0+102,'#5a8ac8',34,40],[x0+142,'#f2e8a0',26,22],[x0+176,'#f2f0ea',50,50]];
  for(const[ix,c,w,h]of items){const sw=Math.sin(t*2+ix)*3;g.fillStyle=c;g.beginPath();g.moveTo(ix,y+2);g.lineTo(ix+w,y+2);g.lineTo(ix+w+sw,y+2+h);g.lineTo(ix+sw,y+2+h);g.closePath();g.fill();g.fillStyle='#d8b060';g.fillRect(ix+3,y-2,3,8);g.fillRect(ix+w-6,y-2,3,8)}
  g.restore()}
function cTrampo(g,t){const m=L.movers.find(m=>m.kind==='trampo');if(!m)return;const x=m.x,y=m.y,sq=P.onMover===m?4:0;g.save();
  g.strokeStyle='#2a2a2a';g.lineWidth=3;for(const lx of[x+6,x+m.w-6]){g.beginPath();g.moveTo(lx,y+4);g.lineTo(lx-6,CGR*T);g.moveTo(lx,y+4);g.lineTo(lx+6,CGR*T);g.stroke()}
  g.fillStyle='#1a1a1a';g.beginPath();g.ellipse(x+m.w/2,y+3+sq,m.w/2,6,0,0,7);g.fill();g.strokeStyle='#2a7ac8';g.lineWidth=4;g.beginPath();g.ellipse(x+m.w/2,y+2,m.w/2+2,7,0,0,7);g.stroke();
  g.strokeStyle='rgba(40,40,40,.4)';g.lineWidth=1;for(let k=0;k<4;k++){g.beginPath();g.moveTo(x+6+k*20,y-60);g.lineTo(x+6+k*20,y);g.stroke()}g.beginPath();g.moveTo(x,y-60);g.lineTo(x+m.w,y-60);g.stroke();
  g.restore()}
function cHeron(g,h,t){const x=h.x,b=CGR*T;g.save();g.translate(x,0);g.scale(h.side||1,1);g.translate(-x,0);const st=h.strike>0?Math.sin((1-h.strike/.5)*Math.PI):0;
  g.strokeStyle='#5a5a5a';g.lineWidth=3;g.beginPath();g.moveTo(x-6,b);g.lineTo(x-4,b-40);g.moveTo(x+6,b);g.lineTo(x+4,b-40);g.stroke();
  g.fillStyle='#9aa2a8';g.beginPath();g.ellipse(x,b-56,26,16,-.25,0,7);g.fill();g.fillStyle='#7a828a';g.beginPath();g.moveTo(x-20,b-60);g.quadraticCurveTo(x-44,b-52,x-50,b-40);g.quadraticCurveTo(x-30,b-48,x-10,b-48);g.fill();
  const nx=x+18+st*44,ny=b-100+st*58;g.strokeStyle='#c8ccd0';g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(x+16,b-64);g.quadraticCurveTo(x+6+st*20,b-92+st*20,nx,ny);g.stroke();
  g.fillStyle='#e8ecee';g.beginPath();g.arc(nx,ny,7,0,7);g.fill();g.fillStyle='#1a1a1a';g.fillRect(nx-6,ny-5,12,3);g.fillStyle='#e8c040';poly(g,[nx+5,ny-2,nx+28,ny+st*6,nx+5,ny+3]);g.fill();g.fillStyle='#111';g.beginPath();g.arc(nx+2,ny-1,1.4,0,7);g.fill();
  g.restore()}
function cCat(g,k,t){// un chat assis, tourné vers la droite : il cligne, il guette, et sa patte fauche
  const x=k.x,y=k.y,sw=k.sw>0?Math.sin((1-k.sw/.45)*Math.PI):0,alert=(k.cool>0&&k.cool<1.4)||sw>0?1:0,col=k.col||'#e0883a',dk=mix(col,'#000000',.32),lt=mix(col,'#ffffff',.22),wh=k.bw?'#f2f0ea':mix(col,'#fff4e0',.55);
  g.save();g.translate(x,y);
  g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(0,0,26,4,0,0,7);g.fill();
  // la queue : elle part derrière et s'enroule, le bout bat la mesure
  const tw=Math.sin(t*2.4)*.5;g.strokeStyle=dk;g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(-14,-6);g.bezierCurveTo(-34,-4,-36,-24+tw*6,-26,-34+tw*8);g.stroke();
  g.strokeStyle=col;g.lineWidth=5;g.beginPath();g.moveTo(-14,-6);g.bezierCurveTo(-33,-5,-35,-24+tw*6,-26,-34+tw*8);g.stroke();
  if(k.bw){g.strokeStyle=wh;g.lineWidth=5;g.beginPath();g.moveTo(-27,-31+tw*8);g.lineTo(-25,-35+tw*8);g.stroke()}
  // le corps assis : dos rond, cuisse, poitrail
  const bg=g.createLinearGradient(0,-40,0,0);bg.addColorStop(0,lt);bg.addColorStop(1,dk);g.fillStyle=bg;
  g.beginPath();g.moveTo(-18,0);g.bezierCurveTo(-26,-14,-20,-34,-2,-38);g.bezierCurveTo(10,-40,18,-30,18,-18);g.bezierCurveTo(19,-8,16,-2,14,0);g.closePath();g.fill();
  g.fillStyle=col;g.beginPath();g.ellipse(-8,-10,13,10,-.2,0,7);g.fill();
  g.fillStyle=wh;g.beginPath();g.moveTo(8,-30);g.bezierCurveTo(18,-26,18,-10,14,-2);g.lineTo(6,-2);g.bezierCurveTo(8,-12,4,-22,8,-30);g.fill();
  if(!k.bw){g.strokeStyle=k.str||dk;g.lineWidth=2;g.lineCap='round';for(let i=0;i<4;i++){g.beginPath();g.moveTo(-14+i*6,-34+i*.5);g.quadraticCurveTo(-12+i*6,-28,-15+i*6,-22);g.stroke()}
    g.beginPath();g.arc(-8,-10,7,-2.4,-.6);g.stroke()}
  // la patte posée
  g.fillStyle=wh;g.beginPath();g.ellipse(10,-2,5,3,0,0,7);g.fill();g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=.8;g.beginPath();g.moveTo(9,-3);g.lineTo(9,-1);g.moveTo(12,-3);g.lineTo(12,-1);g.stroke();
  // la tête
  const hx=12,hy=-42+(alert?-2:0)+Math.sin(t*1.7)*.6;
  g.fillStyle=col;g.beginPath();g.ellipse(hx,hy,13,11,0,0,7);g.fill();
  for(const s of[-1,1]){const ex=hx+s*7,ey=hy-8,tilt=alert?0:s*.25;g.save();g.translate(ex,ey);g.rotate(tilt);g.fillStyle=col;poly(g,[-6,2,s*1,-12,6,2]);g.fill();g.fillStyle='#e8a0a8';poly(g,[-3,1,s*.6,-8,3,1]);g.fill();g.restore()}
  g.fillStyle=wh;g.beginPath();g.ellipse(hx+3,hy+5,7,5,0,0,7);g.fill();
  if(!k.bw){g.strokeStyle=k.str||dk;g.lineWidth=1.4;for(const dx of[-3,0,3]){g.beginPath();g.moveTo(hx+dx,hy-10);g.lineTo(hx+dx*.6,hy-5);g.stroke()}}
  // les yeux : mi-clos au repos, grands ouverts (pupille fendue) quand il guette ou frappe
  for(const s of[-1,1]){const ex=hx-1+s*5.5,ey=hy-1;g.fillStyle=alert?'#b8d838':'#a8b040';g.beginPath();g.ellipse(ex,ey,3.4,alert?3.2:1.4,0,0,7);g.fill();
    g.fillStyle='#111';g.beginPath();g.ellipse(ex+.6,ey,alert?.9:1.6,alert?2.8:.8,0,0,7);g.fill();
    if(!alert){g.fillStyle=col;g.fillRect(ex-4,ey-3.2,8,2.4)}g.fillStyle='rgba(255,255,255,.7)';g.beginPath();g.arc(ex-1,ey-1,.7,0,7);g.fill()}
  g.fillStyle='#d87a8a';poly(g,[hx+2,hy+3,hx+5,hy+3,hx+3.5,hy+5]);g.fill();
  g.strokeStyle='#5a3a3a';g.lineWidth=.9;g.beginPath();g.moveTo(hx+3.5,hy+5);g.quadraticCurveTo(hx+2,hy+7,hx,hy+6);g.moveTo(hx+3.5,hy+5);g.quadraticCurveTo(hx+5,hy+7,hx+7,hy+6);g.stroke();
  g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=.6;for(const s of[-1,1])for(let i=0;i<3;i++){g.beginPath();g.moveTo(hx+3+s*4,hy+5+i);g.lineTo(hx+3+s*16,hy+3+i*3);g.stroke()}
  // la patte qui fauche, griffes sorties
  const px=16+sw*30,py=-20-sw*16;g.strokeStyle=dk;g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(8,-22);g.quadraticCurveTo(14+sw*10,-30-sw*10,px,py);g.stroke();
  g.strokeStyle=col;g.lineWidth=5;g.beginPath();g.moveTo(8,-22);g.quadraticCurveTo(14+sw*10,-30-sw*10,px,py);g.stroke();
  g.fillStyle=wh;g.beginPath();g.arc(px,py,4,0,7);g.fill();
  if(sw>.3){g.strokeStyle='#f6f2ea';g.lineWidth=1.2;for(let j=-1;j<=1;j++){g.beginPath();g.moveTo(px+3,py+j*2.6);g.lineTo(px+8,py+j*3.4+1.5);g.stroke()}
    g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=2;g.beginPath();g.arc(px-8,py+6,20,-1.2,.2);g.stroke()}
  g.restore()}
function cDog(g,d,t){const s=d.size,b=CGR*T,x=d.x;g.save();
  // la chaîne, du collier au piquet de la niche
  {const mx=(d.kx+x)/2,sag=Math.max(0,d.R-Math.abs(x-d.kx))*.12,ex=x-d.f*10*s,ey=b-26*s;   // la chaîne : maillons sombres et reflets, bien visible jusque dans l'herbe
   g.strokeStyle='#2a2a2e';g.lineWidth=4;g.beginPath();g.moveTo(d.kx,b-8);g.quadraticCurveTo(mx,b-4+sag*.2,ex,ey);g.stroke();
   g.strokeStyle='#c8ccd2';g.lineWidth=2.2;g.setLineDash([5,3]);g.beginPath();g.moveTo(d.kx,b-8);g.quadraticCurveTo(mx,b-4+sag*.2,ex,ey);g.stroke();g.setLineDash([]);
   g.fillStyle='#3a3a3e';g.fillRect(d.kx-3,b-14,6,14);g.fillStyle='#c8ccd2';g.beginPath();g.arc(d.kx,b-10,3,0,7);g.fill()}
  g.translate(x,b);g.scale(d.f*s,s);const run=d.run?Math.sin(t*16):0;
  g.fillStyle=s<1?'#e8d8b8':'#6a4a2a';g.beginPath();g.ellipse(0,-22,24,12,0,0,7);g.fill();
  g.strokeStyle=g.fillStyle;g.lineWidth=6;g.lineCap='round';for(const[lx,ph]of[[-16,0],[-8,Math.PI],[10,Math.PI],[17,0]]){g.beginPath();g.moveTo(lx,-16);g.lineTo(lx+Math.sin(t*16+ph)*(d.run?7:0),-2);g.stroke()}
  g.lineWidth=5;g.beginPath();g.moveTo(-22,-26);g.quadraticCurveTo(-34,-38-run*4,-30,-46);g.stroke();
  g.beginPath();g.arc(24,-34,11,0,7);g.fill();g.beginPath();g.ellipse(34,-31,9,6,0,0,7);g.fill();g.fillStyle='#1a1a1a';g.beginPath();g.arc(42,-33,2.6,0,7);g.fill();g.beginPath();g.arc(26,-38,1.8,0,7);g.fill();
  g.fillStyle=s<1?'#c8a878':'#4a321c';g.beginPath();g.ellipse(18,-40,5,10,-.5,0,7);g.fill();
  if(d.bark>.3){g.fillStyle='#8a2a2a';g.beginPath();g.moveTo(32,-27);g.lineTo(44,-26);g.lineTo(36,-21);g.closePath();g.fill();g.fillStyle='#f2f0ea';g.fillRect(35,-28,2,2);g.fillRect(39,-28,2,2)}
  g.fillStyle='#c83a2a';g.fillRect(14,-30,8,4);
  g.restore()}
function cWornLawn(g,d){g.save();g.fillStyle='rgba(120,96,60,.45)';g.beginPath();g.ellipse(d.kx,CGR*T+2,d.R+14,7,0,Math.PI,0);g.fill();g.restore()}
function cKennel(g,x,b){g.save();g.fillStyle='#8a5a32';g.fillRect(x-30,b-50,60,50);g.fillStyle='#6a3a22';poly(g,[x-38,b-48,x,b-80,x+38,b-48]);g.fill();g.fillStyle='#2a1a10';g.beginPath();g.arc(x,b-18,16,Math.PI,0);g.fill();g.fillRect(x-16,b-18,32,18);
  g.fillStyle='#efe6d0';g.fillRect(x-18,b-64,36,10);g.fillStyle='#4a2a1a';g.font='bold 7px '+F_DISP;g.textAlign='center';fitText(g,'REX',x,b-56,32,7);g.fillStyle='#6a6a6a';g.fillRect(x-2,b-8,4,8);g.restore()}
function cKid(g,x,b,f,t,shirt,hair,kick){g.save();g.translate(x,b);g.scale(f,1);const r=Math.sin(t*10+x);
  g.strokeStyle='#e8c0a0';g.lineWidth=6;g.lineCap='round';g.beginPath();g.moveTo(-4,-30);g.lineTo(-6+r*6,-4);g.moveTo(4,-30);g.lineTo(kick?20:6-r*6,kick?-14:-4);g.stroke();
  g.fillStyle='#2a2a3a';g.fillRect(-9,-38,18,12);g.fillStyle='#f2f2f2';g.fillRect(-9-1+r*6,-6,12,5);g.fillRect(kick?16:2-r*6,kick?-18:-6,12,5);
  g.fillStyle=shirt;rr(g,-11,-64,22,28,5);g.fill();g.fillStyle='rgba(255,255,255,.85)';g.font='bold 9px '+F_DISP;g.textAlign='center';g.save();g.scale(f,1);g.fillText('10',0,-46);g.restore();
  g.strokeStyle='#e8c0a0';g.lineWidth=5;g.beginPath();g.moveTo(-9,-58);g.lineTo(-16-r*4,-40);g.moveTo(9,-58);g.lineTo(16+r*4,-42);g.stroke();
  g.fillStyle='#ecc8a6';g.beginPath();g.arc(2,-76,12,0,7);g.fill();g.fillStyle=hair;g.beginPath();g.arc(1,-80,12,Math.PI*.95,Math.PI*2.1);g.fill();
  g.fillStyle='#1a1a1a';g.beginPath();g.arc(7,-77,1.6,0,7);g.fill();g.strokeStyle='#8a3a2a';g.lineWidth=1.4;g.beginPath();g.arc(7,-71,3,.2,2.6);g.stroke();
  g.restore()}
function cBall(g,b){g.save();g.translate(b.x,b.y);g.rotate(b.spin||0);g.fillStyle='#f6f6f2';g.beginPath();g.arc(0,0,10,0,7);g.fill();g.fillStyle='#1a1a1a';g.beginPath();for(let k=0;k<5;k++){const a=k/5*Math.PI*2;g.moveTo(Math.cos(a)*6+2.5,Math.sin(a)*6);g.arc(Math.cos(a)*6,Math.sin(a)*6,2.5,0,7)}g.fill();g.beginPath();g.arc(0,0,3,0,7);g.fill();g.restore();
  g.fillStyle='rgba(0,0,0,.18)';g.beginPath();g.ellipse(b.x,CGR*T+1,10,3,0,0,7);g.fill()}
function cBike(g,x,b,t,dir,stop){dir=dir||-1;g.save();g.translate(x,b);g.scale(dir,1);const sp=stop?0:t*24;
  for(const wx of[-26,26]){g.strokeStyle='#1a1a1a';g.lineWidth=3;g.beginPath();g.arc(wx,-16,15,0,7);g.stroke();g.lineWidth=1;for(let k=0;k<6;k++){const a=sp+k*Math.PI/3;g.beginPath();g.moveTo(wx,-16);g.lineTo(wx+Math.cos(a)*15,-16+Math.sin(a)*15);g.stroke()}}
  g.strokeStyle='#e8c020';g.lineWidth=4;g.beginPath();g.moveTo(-26,-16);g.lineTo(-6,-40);g.lineTo(18,-40);g.lineTo(26,-16);g.moveTo(-6,-40);g.lineTo(0,-16);g.lineTo(-26,-16);g.moveTo(18,-40);g.lineTo(22,-52);g.stroke();g.strokeStyle='#1a1a1a';g.lineWidth=3;g.beginPath();g.moveTo(16,-54);g.lineTo(28,-52);g.stroke();
  const pd=Math.sin(sp*.5);g.strokeStyle='#2a3a6a';g.lineWidth=6;g.lineCap='round';g.beginPath();g.moveTo(-6,-46);g.lineTo(0+pd*6,-28);g.lineTo(0+pd*8,-14);g.moveTo(-6,-46);g.lineTo(2-pd*6,-30);g.lineTo(-2-pd*8,-16);g.stroke();
  g.fillStyle='#2a9a5a';rr(g,-14,-74,20,30,6);g.fill();g.strokeStyle='#e8c0a0';g.lineWidth=5;g.beginPath();g.moveTo(2,-68);g.lineTo(22,-54);g.stroke();
  g.fillStyle='#ecc8a6';g.beginPath();g.arc(2,-84,11,0,7);g.fill();
  g.fillStyle='#e83a2a';g.beginPath();g.arc(0,-88,13,Math.PI,0);g.fill();g.fillRect(-13,-89,28,4);g.fillStyle='#f6f2ea';g.fillRect(-6,-99,3,8);g.fillRect(2,-99,3,8);g.strokeStyle='#1a1a1a';g.lineWidth=1;g.beginPath();g.moveTo(-8,-86);g.lineTo(-2,-74);g.stroke();
  g.fillStyle='#1a1a1a';g.beginPath();g.arc(8,-84,1.6,0,7);g.fill();g.strokeStyle='#8a3a2a';g.lineWidth=1.4;g.beginPath();g.arc(8,-78,3,0,Math.PI);g.stroke();
  g.restore();if(!stop){g.strokeStyle='rgba(160,160,160,.5)';g.lineWidth=2;for(let k=0;k<3;k++){g.beginPath();g.moveTo(x-dir*(40+k*10),b-30-k*12);g.lineTo(x-dir*(70+k*14),b-30-k*12);g.stroke()}}}
function cMower(g,m,t){g.save();g.translate(m.x,CGR*T);g.fillStyle='#2a2a2a';g.beginPath();g.arc(-14,-5,5,0,7);g.arc(14,-5,5,0,7);g.fill();g.fillStyle='#d8dcd8';g.beginPath();g.ellipse(0,-12,24,12,0,Math.PI,0);g.fill();g.fillRect(-24,-12,48,6);
  g.fillStyle='#3aa04a';g.fillRect(-24,-10,48,3);g.fillStyle=((t*2)%1)<.5?'#3ad04a':'#1a6a2a';g.beginPath();g.arc(m.dir*12,-18,2.5,0,7);g.fill();
  g.fillStyle='rgba(90,160,60,.6)';for(let k=0;k<4;k++){g.fillRect(-m.dir*(26+k*6),-4-((t*40+k*5)%10),2,3)}g.restore()}
function cEntrySign(g,x,b){g.save();g.fillStyle='#6a6a6a';g.fillRect(x-40,b-90,4,90);g.fillRect(x+36,b-90,4,90);g.fillStyle='#f6f4ee';rr(g,x-60,b-120,120,44,4);g.fill();g.strokeStyle='#c8302a';g.lineWidth=4;rr(g,x-56,b-116,112,36,3);g.stroke();
  g.fillStyle='#1a1a1a';g.font='bold 11px '+F_DISP;g.textAlign='center';g.fillText('CRÉCY-',x,b-101);g.fillText('LA-CHAPELLE',x,b-88);g.fillStyle='#2a5aa0';g.font='italic 8px '+F_BODY;g.fillText('la Venise briarde',x,b-64);g.restore()}
function cFlowerRail(g,x,b){g.save();g.fillStyle='#2a4a3a';g.fillRect(x-24,b-34,48,3);g.fillRect(x-24,b-16,48,2);for(let k=0;k<5;k++)g.fillRect(x-24+k*12,b-34,2,34);g.fillStyle='#6a4a2a';g.fillRect(x-22,b-44,44,10);
  for(let k=0;k<7;k++){g.fillStyle=['#e83a5a','#f2f0e8','#e86aa0','#f0a030'][k%4];g.beginPath();g.arc(x-18+k*6,b-46-((k*7)%5),4,0,7);g.fill()}g.fillStyle='#4a7a3a';g.fillRect(x-22,b-46,44,3);g.restore()}
function cRoses(g,x,b,big){g.save();const n=big?9:6;for(let k=0;k<n;k++){g.fillStyle='#3e6a2e';g.beginPath();g.arc(x-26+((k*19)%52),b-14-((k*13)%(big?40:22)),12,0,7);g.fill()}
  for(let k=0;k<n;k++){g.fillStyle=k%3?'#d8304a':'#f2a0b0';g.beginPath();g.arc(x-22+((k*23)%46),b-18-((k*17)%(big?42:24)),4.5,0,7);g.fill()}g.restore()}
function cGnome(g,x,b){g.save();g.fillStyle='#2a5aa0';g.fillRect(x-8,b-20,16,16);g.fillStyle='#ecc8a6';g.beginPath();g.arc(x,b-26,6,0,7);g.fill();g.fillStyle='#f6f6f2';poly(g,[x-7,b-24,x,b-12,x+7,b-24]);g.fill();g.fillStyle='#d8302a';poly(g,[x-8,b-28,x+2,b-48,x+8,b-28]);g.fill();g.fillStyle='#4a3a2a';g.fillRect(x-8,b-4,6,4);g.fillRect(x+2,b-4,6,4);g.restore()}
function cMailbox(g,x,b,name){g.save();// boîte aux lettres sur pied, toutes du même modèle : vert bouteille, toit arrondi, porte-nom
  g.fillStyle='#3a3a3a';g.fillRect(x-2,b-50,4,50);g.fillRect(x-8,b-3,16,3);
  g.fillStyle='#2e5a46';g.beginPath();g.moveTo(x-17,b-50);g.lineTo(x-17,b-74);g.quadraticCurveTo(x,b-88,x+17,b-74);g.lineTo(x+17,b-50);g.closePath();g.fill();
  g.fillStyle='rgba(0,0,0,.2)';g.fillRect(x+11,b-74,6,24);g.fillStyle='#1a2a22';g.fillRect(x-11,b-72,22,3);
  g.fillStyle='#f2efe6';g.fillRect(x-13,b-64,26,10);g.strokeStyle='#c9a24a';g.lineWidth=1;g.strokeRect(x-13,b-64,26,10);
  g.fillStyle='#1a1a1a';g.textAlign='center';fitText(g,name,x,b-57,23,6);g.fillStyle='#c9a24a';g.beginPath();g.arc(x+9,b-52,1.6,0,7);g.fill();
  g.restore()}
function cHouseNo(g,x,y,n){g.save();g.fillStyle='#1e3a7a';rr(g,x-13,y-10,26,20,3);g.fill();g.strokeStyle='#f2efe6';g.lineWidth=1.4;rr(g,x-11,y-8,22,16,2);g.stroke();
  g.fillStyle='#f2efe6';g.font='bold 13px '+F_DISP;g.textAlign='center';g.fillText(n,x,y+5);g.restore()}
function cBushes(g,x,b){g.save();for(let k=0;k<6;k++){g.fillStyle=k%2?'#3e6a2e':'#4a7a36';g.beginPath();g.arc(x-40+k*16,b-12-(k%3)*6,16,0,7);g.fill()}g.restore()}
function cPlanters(g,x,b){g.save();for(const dx of[-24,18]){g.fillStyle='#b86a3a';poly(g,[x+dx-12,b-24,x+dx+12,b-24,x+dx+9,b,x+dx-9,b]);g.fill();g.fillStyle='#4a7a36';g.beginPath();g.arc(x+dx,b-30,12,0,7);g.fill();g.fillStyle='#f2c030';g.beginPath();g.arc(x+dx-4,b-34,3,0,7);g.arc(x+dx+5,b-30,3,0,7);g.fill()}g.restore()}
function cLawn(g,x0,x1){g.save();g.fillStyle='rgba(120,190,80,.35)';for(let x=x0;x<x1;x+=24)g.fillRect(x,CGR*T-2,12,4);g.restore()}
function cBlock(g,b,t){const x0=b.c0*T,x1=(b.c1+1)*T,top=b.r0*T,base=CGR*T,w=x1-x0;g.save();
  if(b.kind==='barriere'){// barrière de bois blanche, piquets pointus
    g.fillStyle='#f2efe6';for(let x=x0+2;x<x1;x+=10){poly(g,[x,base,x,top+6,x+3.5,top,x+7,top+6,x+7,base]);g.fill()}g.fillRect(x0-6,top+12,w+12,4);g.fillRect(x0-6,top+28,w+12,4);g.fillStyle='rgba(0,0,0,.12)';g.fillRect(x0-6,top+16,w+12,1);
    if(b.chien){g.fillStyle='#f2e040';rr(g,x0-14,top-6,w+28,18,2);g.fill();g.fillStyle='#1a1a1a';g.font='bold 6px '+F_DISP;g.textAlign='center';g.fillText('ATTENTION',x0+w/2,top+2);g.fillText('AU CHIEN',x0+w/2,top+9)}}
  else if(b.kind==='muret'){g.fillStyle='#c8bca4';g.fillRect(x0,top,w,base-top);g.save();g.beginPath();g.rect(x0,top,w,base-top);g.clip();g.fillStyle='rgba(90,80,60,.3)';for(let y=top+4;y<base;y+=16)for(let x=x0-14+((y/16|0)%2)*14;x<x1;x+=28){rr(g,x+1,y,25,13,3);g.fill()}g.restore();
    g.fillStyle='#a89c84';g.fillRect(x0-4,top-4,w+8,8);cIvy(g,x0,x1,top,base)}
  else if(b.kind==='voiture'){// capot et coffre à hauteur d'une case, habitacle à deux : on se pose où l'on voit la tôle
    const c=b.col,hood=top+T,roof=top,c0=x0+T,c1=x1-T;g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(x0+w/2,base+2,w/2+4,6,0,0,7);g.fill();
    g.fillStyle=c;g.beginPath();g.moveTo(x0+4,base-14);g.lineTo(x0,hood+14);g.quadraticCurveTo(x0,hood,x0+16,hood);g.lineTo(x1-12,hood);g.quadraticCurveTo(x1,hood+2,x1,hood+14);g.lineTo(x1-4,base-14);g.closePath();g.fill();
    g.beginPath();g.moveTo(c0-22,hood+1);g.lineTo(c0+6,roof+4);g.quadraticCurveTo(c0+10,roof,c0+18,roof);g.lineTo(c1-8,roof);g.quadraticCurveTo(c1,roof,c1+4,roof+6);g.lineTo(c1+16,hood+1);g.closePath();g.fill();
    g.fillStyle='#9ac0d8';poly(g,[c0-12,hood,c0+10,roof+6,x0+w/2-3,roof+6,x0+w/2-3,hood]);g.fill();poly(g,[x0+w/2+3,hood,x0+w/2+3,roof+6,c1-2,roof+6,c1+8,hood]);g.fill();
    g.fillStyle='rgba(255,255,255,.35)';poly(g,[c0+6,roof+8,c0+18,roof+8,c0+4,hood-2,c0-6,hood-2]);g.fill();g.fillStyle='rgba(255,255,255,.25)';g.fillRect(x0+10,hood+2,w-20,2);
    g.fillStyle=shade(c,-.25);g.fillRect(x0,hood+20,w,4);g.fillRect(x0+w/2-1,hood+4,2,28);
    for(const wx of[x0+34,x1-34]){g.fillStyle='#1a1a1a';g.beginPath();g.arc(wx,base-14,16,0,7);g.fill();g.fillStyle='#b8bcc0';g.beginPath();g.arc(wx,base-14,7,0,7);g.fill()}
    g.fillStyle='#f6f2c8';g.fillRect(x1-5,hood+8,5,8);g.fillStyle='#d83a2a';g.fillRect(x0,hood+8,5,8);g.fillStyle='#f2f2f2';g.fillRect(x0+w/2-20,base-28,40,9);g.fillStyle='#1a1a1a';g.textAlign='center';fitText(g,'KM-201-89',x0+w/2,base-21,36,6)}
  else if(b.kind==='haie'){g.fillStyle='#3e6a2e';rr(g,x0-8,top-6,w+16,base-top+6,10);g.fill();g.fillStyle='rgba(120,180,80,.3)';for(let k=0;k<6;k++){g.beginPath();g.arc(x0+(k*13)%w,top+4+(k*7)%30,6,0,7);g.fill()}}
  else if(b.kind==='poubelles'){for(const[dx,c]of[[-6,'#3a6a3a'],[20,'#e8c040']]){g.fillStyle=c;rr(g,x0+dx,top+4,28,base-top-4,3);g.fill();g.fillStyle=shade(c,-.25);g.fillRect(x0+dx-2,top,32,7);g.fillStyle='#1a1a1a';g.beginPath();g.arc(x0+dx+6,base-3,3,0,7);g.fill()}}
  else if(b.kind==='bambou'){for(let k=0;k<9;k++){const x=x0-6+k*11;g.fillStyle=k%2?'#7a9a3a':'#8aaa48';g.fillRect(x,top-30-(k%3)*14,6,base-top+30+(k%3)*14);g.fillStyle='rgba(60,80,30,.5)';for(let y=top-20;y<base;y+=24)g.fillRect(x,y,6,2)}
    for(let k=0;k<18;k++){g.fillStyle='#5a8a2e';g.save();g.translate(x0-10+(k*11)%(w+20),top-30+(k*23)%120);g.rotate((k%2?-1:1)*.6);g.beginPath();g.ellipse(0,0,12,3,0,0,7);g.fill();g.restore()}}
  else if(b.kind==='moulin'){// le moulin : pierre, galerie de bois au sommet, grand toit derrière
    // la cheminée, le toit de tuiles (rangs et joints rognés au toit), une lucarne à poulie pour monter les sacs
    cChimney(g,x0+52,top-150,top,26);
    const roofP=[x0-30,top+2,x0+w*.3,top-110,x1-20,top-110,x1+30,top+2];g.fillStyle='#9a4a32';poly(g,roofP);g.fill();
    g.save();poly(g,roofP);g.clip();g.strokeStyle='rgba(60,20,10,.32)';g.lineWidth=1;for(let y=top-104;y<top+2;y+=9){g.beginPath();g.moveTo(x0-40,y);g.lineTo(x1+40,y);g.stroke();for(let x=x0-40+((y/9|0)%2)*7;x<x1+40;x+=14){g.beginPath();g.moveTo(x,y);g.lineTo(x,y+9);g.stroke()}}
    g.fillStyle='rgba(255,255,255,.06)';g.fillRect(x0-30,top-110,w*.6,112);g.restore();
    g.fillStyle='#7a3a26';g.fillRect(x0+w*.3-4,top-114,x1-20-x0-w*.3+8,6);
    const lx=x0+w*.62;g.fillStyle='#c8bc9c';g.fillRect(lx-26,top-80,52,60);g.fillStyle='#8a3e2a';poly(g,[lx-34,top-78,lx,top-104,lx+34,top-78]);g.fill();g.fillStyle='#4a3424';g.fillRect(lx-16,top-68,32,48);g.strokeStyle='#3a2a1a';g.lineWidth=2;g.beginPath();g.moveTo(lx,top-104);g.lineTo(lx,top-120);g.lineTo(lx+40,top-120);g.stroke();
    g.strokeStyle='#5a4a36';g.lineWidth=1;g.beginPath();g.moveTo(lx+36,top-120);g.lineTo(lx+36,top-56);g.stroke();g.fillStyle='#c8b080';rr(g,lx+28,top-58,16,20,4);g.fill();
    // la façade de pierre, rognée au mur ; chaînes d'angle ; bandeau ; soubassement mouillé
    g.fillStyle='#c8bc9c';g.fillRect(x0,top,w,base-top+40);
    g.save();g.beginPath();g.rect(x0,top,w,base-top+40);g.clip();
    g.fillStyle='rgba(110,96,70,.22)';for(let y=top+8;y<base+40;y+=18)for(let x=x0-16+((y/18|0)%2)*16;x<x1;x+=32){rr(g,x+1,y,29,15,4);g.fill()}
    g.fillStyle='rgba(60,90,80,.25)';g.fillRect(x0,base-30,w,70);g.restore();
    for(const cx of[x0,x1-18])for(let y=top+4;y<base;y+=26){g.fillStyle='#ddd2b8';g.fillRect(cx,y,18,22);g.fillStyle='rgba(0,0,0,.08)';g.fillRect(cx,y+20,18,2)}
    g.fillStyle='#b4a888';g.fillRect(x0-3,top+118,w+6,6);
    for(const[wx,wy]of[[x0+30,top+60],[x0+150,top+60],[x0+30,top+170],[x0+150,top+170]]){g.fillStyle='#ddd2b8';g.fillRect(wx-5,wy-5,50,66);g.fillStyle='#3a4448';g.fillRect(wx,wy,40,56);g.strokeStyle='#efe8d6';g.lineWidth=2;g.strokeRect(wx,wy,40,56);g.beginPath();g.moveTo(wx+20,wy);g.lineTo(wx+20,wy+56);g.moveTo(wx,wy+28);g.lineTo(wx+40,wy+28);g.stroke()}
    cMillDoor(g,x0+118,base);g.fillStyle='#efe6d2';rr(g,x0+60,top+130,120,22,3);g.fill();g.fillStyle='#5a2a1e';g.font='bold 11px '+F_DISP;g.textAlign='center';g.fillText('LE MOULIN',x0+120,top+146);
    // la galerie de bois praticable
    g.fillStyle='#7a5a3a';g.fillRect(x0-6,top-2,w+12,10);g.fillStyle='#5a4028';for(let x=x0;x<=x1;x+=20)g.fillRect(x,top-34,4,32);g.fillRect(x0-6,top-36,w+12,4);
    g.fillStyle='#c8302a';g.beginPath();for(let k=0;k<6;k++){g.arc(x0+20+k*42,top-40,4,0,7)}g.fill();
  }
  g.restore()}
function cFontaine(g,t){if(L.crecy.era===14){cFontaine14(g,t);return}const b=CGR*T,x=246*T;g.save();
  // la maison : enduit, volets neufs, une voiture devant ; à droite, le garage là où était le pigeonnier
  const w=260,h=190;g.fillStyle='#e8dcc4';g.fillRect(x,b-h,w,h);cChimney(g,x+w-62,b-h-118,b-h-50,24);
  cRoofTiles(g,[x-16,b-h,x+40,b-h-90,x+w-40,b-h-90,x+w+16,b-h],'#a84a32',[x+40,x+w-40,b-h-90]);
  for(const[ox,oy]of[[30,-160],[150,-160],[30,-80]]){g.fillStyle='#4a6070';g.fillRect(x+ox,b+oy,44,54);g.strokeStyle='#f6f2ea';g.lineWidth=2;g.strokeRect(x+ox,b+oy,44,54);g.beginPath();g.moveTo(x+ox+22,b+oy);g.lineTo(x+ox+22,b+oy+54);g.stroke();
    g.fillStyle='#4a8ab0';g.fillRect(x+ox-14,b+oy,12,54);g.fillRect(x+ox+46,b+oy,12,54)}
  g.fillStyle='#3a5a7a';rr(g,x+158,b-96,46,96,3);g.fill();g.fillStyle='#d8c890';g.beginPath();g.arc(x+196,b-48,2.5,0,7);g.fill();
  cHouseNo(g,x+181,b-112,'12');
  // le garage (béton, porte basculante) à la place du pigeonnier
  const gx=x+w+20;g.fillStyle='#c8c2b6';g.fillRect(gx,b-130,170,130);g.fillStyle='#a8a296';g.fillRect(gx-6,b-138,182,10);g.fillStyle='#d8dcdc';g.fillRect(gx+18,b-104,134,104);g.fillStyle='rgba(0,0,0,.12)';for(let k=1;k<10;k++)g.fillRect(gx+18,b-104+k*10,134,2);
  cMailbox(g,x-28,b,'GARNIER');
  g.restore()}

function cLavoirRoof(g){const x0=19.5*T,x1=29*T+10,y=9*T;g.save();g.fillStyle='#5a4028';g.fillRect(x0,y,x1-x0,10);
  cRoofTiles(g,[x0-14,y+2,x0+30,y-46,x1-30,y-46,x1+14,y+2],'#a84a32',[x0+30,x1-30,y-46]);
  g.fillStyle='#efe6d2';rr(g,(x0+x1)/2-34,y-36,68,14,2);g.fill();g.fillStyle='#5a2a1e';g.font='bold 8px '+F_DISP;g.textAlign='center';g.fillText('LAVOIR',(x0+x1)/2,y-26);g.restore()}
function cDuck(g,m){const t=G.t,x=m.x,y=m.y;if(Math.abs(m.dx)>.01)m.dir=m.dx>0?1:-1;const dir=m.dir||1;g.save();
  const tr=m.trail||(m.trail=[]);if(!tr.length||Math.abs(tr[0]-(x+m.w/2))>2){tr.unshift(x+m.w/2);if(tr.length>80)tr.pop()}
  for(let k=1;k<=3;k++){const i=6+k*8,ok=i<tr.length,kx0=ok?tr[i]:x+m.w/2-dir*(14+k*16),dir_=ok?(Math.sign(tr[i-1]-tr[i])||dir):dir,kx=clamp(kx0,79*T+14,89.5*T+20),ky=y+6+Math.sin(t*6+k)*1.5;g.fillStyle='#d8c860';g.beginPath();g.ellipse(kx,ky,7,4,0,0,7);g.fill();g.beginPath();g.arc(kx+dir_*6,ky-5,3.5,0,7);g.fill();g.fillStyle='#e8902a';g.fillRect(kx+dir_*9-(dir_<0?3:0),ky-5,3,1.6)}
  g.translate(x+m.w/2,y);g.scale(dir,1);g.fillStyle='#8a6a48';g.beginPath();g.ellipse(0,4,26,9,0,0,7);g.fill();g.fillStyle='#6a4e34';g.beginPath();g.ellipse(-4,1,16,5,0,0,7);g.fill();
  g.fillStyle='#7a5c3e';g.beginPath();g.arc(20,-8,8,0,7);g.fill();g.fillStyle='#e8902a';poly(g,[26,-9,36,-7,26,-5]);g.fill();g.fillStyle='#1a1a1a';g.beginPath();g.arc(22,-10,1.4,0,7);g.fill();
  g.fillStyle='rgba(230,245,240,.5)';g.beginPath();g.ellipse(0,12,32,3,0,0,7);g.fill();g.restore()}

/* ---------- le souvenir : la maison Fontaine en 1914, le pigeonnier, les pigeons ---------- */
function crecySet(era,quiet){const C=L.crecy;if(C.era===era)return;C.era=era;
  for(const[c,r]of CRECY_PIGEONNIER)L.g[r][c]=era===14?'t':'.';MUS_OLD=era===14;C.flash=quiet?.5:1;
  if(!G.sim&&!quiet){noise(.9,900,.18,'bandpass',0,.6);tone(era===14?392:523,.5,'sine',.05,era===14?262:784,.02)}
  if(era===14&&!C.said.v14){C.said.v14=1;say("Le pigeonnier ! Il est là, tout blanc, et les copains tournent autour. Septembre 1914 : je rentre de la Marne avec le pli de Lucien.",5)}}
/* le pigeonnier de 1914 : deux cordons et la planche d'envol, où l'on peut se poser */
const CRECY_PIGEONNIER=[[253,10],[254,10],[255,10],[256,10],[253,8],[254,8],[255,8],[256,8],[254,6],[255,6]];
const CRECY_PIG_CARDS=[
  {t:/*v2*/"Raymond se souvient. En septembre 1914, il était rentré de la Marne avec, roulés dans sa bague, les plans des lignes allemandes. Ces plans devaient parvenir aux Anglais.",minT:1.2},
  {t:/*v2*/"C'est ici, sur cette planche d'envol, que Marguerite les lui avait retirés de la patte. Elle les avait portés aussitôt au père de Lucien, le gendarme Vasseur, qui faisait remonter les messages du pigeonnier jusqu'à l'état-major.",minT:1.2},
  {t:/*v2*/"Raymond se dit que c'est ce jour-là qu'il avait gagné son premier grade.",minT:1}];
function crecyPigStep(){const C=L.crecy;if(!C||C.era!==14||G.sim)return;const px=P.x+P.w/2;
  if(!C.said.noms&&px>249*T){C.said.noms=1;say(/*v2*/"Fernand ! Pâquerette ! Vous êtes là-haut, les anciens… Attendez-moi, je monte !",4)}
  if(!C.said.haut&&P.onGround&&!P.dead&&Math.abs(P.y+P.h-6*T)<3&&px>254*T&&px<256*T){C.said.haut=1;G.quip=null;G.quipQ=[];
    G.state='intro';G.cards=CRECY_PIG_CARDS;G.card=0;G.cardT=0;G.fade=1;G.cardsDone=()=>{G.state='play';G.fade=1}}}
function crecySwitch(){const C=L.crecy;if(!C||P.dead)return;if(P.x<241*T&&C.era===26)return;crecySet(C.era===26?14:26)}
function crecyOverlay(t){const C=L.crecy;if(!C)return;
  if(C.era===14){const fc=ferteFogTex();ctx.save();const ox=((t*14+cam.x*.15)%fc.fog.width+fc.fog.width)%fc.fog.width;ctx.drawImage(fc.fog,-ox,0,fc.fog.width,H);ctx.drawImage(fc.fog,fc.fog.width-ox,0,fc.fog.width,H);ctx.drawImage(fc.vig,0,0,W,H);
    ctx.globalAlpha=.6;ctx.fillStyle='#efe5cc';ctx.font='italic 15px '+F_BODY;ctx.textAlign='left';ctx.fillText('Crécy · septembre 1914',20,H-20);ctx.restore()}
  if(C.flash>0){ctx.fillStyle='rgba(236,232,222,'+(Math.min(1,C.flash)*.85)+')';ctx.fillRect(0,0,W,H)}}
function cFontaine14(g,t){const b=CGR*T,x=246*T,C=L.crecy;g.save();
  // la ferme : même maison, plus vieille ; volets de bois, vigne, banc ; une charrette dans la cour
  const w=260,h=190;g.fillStyle='#d8c8a4';g.fillRect(x,b-h,w,h);g.fillStyle='rgba(120,100,70,.15)';for(let k=0;k<20;k++){g.beginPath();g.ellipse(x+(k*53)%w,b-h+(k*37)%h,12,6,0,0,7);g.fill()}
  cChimney(g,x+w-62,b-h-118,b-h-50,24,1);cRoofTiles(g,[x-16,b-h,x+40,b-h-90,x+w-40,b-h-90,x+w+16,b-h],'#8a4a34',[x+40,x+w-40,b-h-90],1);
  g.fillStyle='rgba(200,190,170,.3)';g.beginPath();g.arc(x+w-59,b-h-124,10,0,7);g.arc(x+w-50,b-h-140,13,0,7);g.fill();
  for(const[ox,oy]of[[30,-160],[150,-160],[30,-80]]){g.fillStyle='#2a3036';g.fillRect(x+ox,b+oy,44,54);g.strokeStyle='#e8e0cc';g.lineWidth=2;g.strokeRect(x+ox,b+oy,44,54);g.fillStyle='#6a5a3a';g.fillRect(x+ox-14,b+oy,12,54);g.fillRect(x+ox+46,b+oy,12,54);g.fillStyle='rgba(0,0,0,.2)';for(let k=1;k<4;k++){g.fillRect(x+ox-14+k*3,b+oy,1,54);g.fillRect(x+ox+46+k*3,b+oy,1,54)}}
  g.fillStyle='#5a3a24';rr(g,x+158,b-96,46,96,3);g.fill();
  for(let k=0;k<30;k++){g.fillStyle=k%3?'#5a7a3a':'#6a8a40';g.beginPath();g.ellipse(x+4+(k*13)%60,b-10-((k*29)%170),7,5,k,0,7);g.fill()}
  g.fillStyle='#6a4a2a';g.fillRect(x+90,b-24,50,5);g.fillRect(x+94,b-19,4,19);g.fillRect(x+132,b-19,4,19);
  // le pigeonnier, à la place du garage : tour carrée enduite, toit à quatre pans, boulins, plage d'envol, girouette
  const px=x+w+30,pw=150,ph=230;g.fillStyle='#ece2c8';g.fillRect(px,b-ph,pw,ph);g.fillStyle='rgba(120,100,70,.12)';g.fillRect(px+pw-22,b-ph,22,ph);
  g.fillStyle='#d8ccb0';for(const cx of[px,px+pw-16])for(let y=b-ph;y<b;y+=26)g.fillRect(cx,y,16,22);
  g.fillStyle='#b8ac90';g.fillRect(px-6,b-ph+70,pw+12,8);g.fillRect(px-6,b-ph+150,pw+12,8);
  for(const row of[b-ph+40,b-ph+116])for(let k=0;k<4;k++){const bx=px+22+k*30;g.fillStyle='#2a2a2a';g.beginPath();g.arc(bx,row,8,Math.PI,0);g.fill();g.fillRect(bx-8,row,16,8);g.fillStyle='#c8bc9c';g.fillRect(bx-12,row+8,24,4)}
  g.fillStyle='#5a3a24';rr(g,px+pw/2-22,b-80,44,80,3);g.fill();
  g.fillStyle='#8a4a34';poly(g,[px-20,b-ph,px+pw/2,b-ph-110,px+pw+20,b-ph]);g.fill();g.fillStyle='rgba(0,0,0,.15)';poly(g,[px+pw/2,b-ph-110,px+pw+20,b-ph,px+pw/2+10,b-ph]);g.fill();
  g.fillStyle='#e8dcc0';g.fillRect(px+pw/2-20,b-ph-36,40,26);g.fillStyle='#2a2a2a';g.fillRect(px+pw/2-12,b-ph-30,24,20);g.fillStyle='#b8ac90';g.fillRect(px+pw/2-32,b-ph-10,64,6);
  g.strokeStyle='#3a3a3a';g.lineWidth=2;g.beginPath();g.moveTo(px+pw/2,b-ph-110);g.lineTo(px+pw/2,b-ph-150);g.stroke();const vv=Math.sin(t*.7)*.4;g.fillStyle='#3a3a3a';g.save();g.translate(px+pw/2,b-ph-146);g.rotate(vv);poly(g,[-18,0,14,-3,18,0,14,3]);g.fill();g.restore();
  // les pigeons posés sur la plage d'envol et le faîtage, et ceux qui tournent autour
  for(let k=0;k<4;k++)if(k!==1&&k!==2)cPig(g,px+pw/2-26+k*16,b-ph-10,k%2?1:-1,t+k,false);
  for(let k=0;k<3;k++)cPig(g,px+30+k*40,b-ph+66,k%2?1:-1,t+k*2,false);
  for(const d of C.doves){d.a+=d.sp*1/60;const cx=px+pw/2+Math.cos(d.a)*(d.r+60),cy=b-ph-120+d.y*.3+Math.sin(d.a*1.3)*40;cPig(g,cx,cy,Math.sin(d.a)>0?-1:1,t*3+d.r,true)}
  // la cour : le sac de grain (secret), une auge
  g.fillStyle='#6a5a3a';g.fillRect(px-80,b-14,50,14);g.fillStyle='#8a7a4a';g.fillRect(px-78,b-12,46,4);
  g.restore()}
function cPig(g,x,y,f,t,fly){g.save();g.translate(x,y);g.scale(f,1);g.fillStyle='#8a8e9a';g.beginPath();g.ellipse(0,0,8,5,0,0,7);g.fill();g.fillStyle='#4f8a7a';g.beginPath();g.arc(6,-3,3.2,0,7);g.fill();g.fillStyle='#8a8e9a';g.beginPath();g.arc(8,-5,3,0,7);g.fill();
  g.fillStyle='#2a2a2a';poly(g,[11,-5,14,-4,11,-3]);g.fill();g.fillStyle='#5a5e6a';poly(g,[-7,-1,-14,-3,-14,2]);g.fill();
  if(fly){const w=Math.sin(t*14)*8;g.fillStyle='#a8acb6';poly(g,[-2,-2,-6,-10-w,4,-3]);g.fill();poly(g,[0,-1,4,-11-w*.6,8,-2]);g.fill()}else{g.fillStyle='#c84a3a';g.fillRect(-2,4,1.5,3);g.fillRect(2,4,1.5,3)}
  g.restore()}
/* les secrets du niveau, dessinés à la main */
function cSecrets(g,t){const C=L.crecy;if(!C)return;
  if(C.era===26)cMailbox(g,229*T+20,CGR*T,'BLANC');   // (le secret est maintenant dans la boîte des Garnier)
  {const a=C.nain,x=a.x,b=a.y;g.save();if(a.used){const u=Math.min(1,a.t/.35);g.translate(x,b);g.rotate(u*Math.PI/2*.94);g.translate(-x,-b)}cGnome(g,x,b);g.restore()}
  {const a0=C.linge,a={x:a0.sx!=null?a0.sx-6:a0.x,y:a0.y,t:a0.t,used:a0.used};if(a.used){const u=Math.min(1,a.t/.5);if(u<1){g.fillStyle='#f2f0e6';g.beginPath();g.arc(a.x+6,a.y+6+u*26,3,0,7);g.fill()}else{g.fillStyle='rgba(240,240,230,.95)';g.beginPath();g.arc(a.x+8,a.y+34,6,0,7);g.arc(a.x+12,a.y+38,4,0,7);g.arc(a.x+4,a.y+40,3,0,7);g.fill();g.fillStyle='rgba(120,110,80,.5)';g.beginPath();g.arc(a.x+9,a.y+35,2,0,7);g.fill()}}}
  if(C.era===14){const a=C.grain,x=a.x,b=a.y;g.save();g.fillStyle='#c8b080';g.beginPath();g.moveTo(x-16,b);g.quadraticCurveTo(x-20,b-30,x-10,b-40);g.lineTo(x+10,b-40);g.quadraticCurveTo(x+20,b-30,x+16,b);g.closePath();g.fill();g.strokeStyle='#8a6a3a';g.lineWidth=1.5;g.beginPath();g.moveTo(x-10,b-38);g.lineTo(x+10,b-38);g.stroke();
    g.fillStyle='#5a4a2a';g.font='bold 6px '+F_DISP;g.textAlign='center';g.fillText('VASSEUR',x,b-20);if(!a.used){g.fillStyle='#d8b860';for(let k=0;k<6;k++){g.beginPath();g.arc(x+18+k*4,b-2,1.5,0,7);g.fill()}}g.restore()}
}

/* ---------- cheminées et toits : la cheminée est peinte avant le toit, qui en cache le pied ---------- */
function cChimney(g,cx,top,bot,w,old){w=w||22;g.save();const x=cx-w/2,col=old?'#9a8a72':'#b0603e';
  g.fillStyle=col;g.fillRect(x,top,w,bot-top);g.fillStyle='rgba(0,0,0,.18)';g.fillRect(x+w*.62,top,w*.38,bot-top);
  g.strokeStyle='rgba(60,30,20,.35)';g.lineWidth=1;for(let y=top+6,k=0;y<bot;y+=6,k++){g.beginPath();g.moveTo(x,y);g.lineTo(x+w,y);g.stroke();for(let j=(k%2)*5;j<w;j+=10){g.beginPath();g.moveTo(x+j,y-6);g.lineTo(x+j,y);g.stroke()}}
  g.fillStyle='#8a8478';g.fillRect(x-3,top-5,w+6,6);g.fillStyle='#6a665c';g.fillRect(x-3,top,w+6,2);
  g.fillStyle='#b8603a';for(const dx of[w*.28,w*.68]){rr(g,x+dx-3,top-14,6,10,1);g.fill()}g.fillStyle='#6a3a26';for(const dx of[w*.28,w*.68])g.fillRect(x+dx-3,top-14,6,2);
  g.restore()}
function cRoofTiles(g,pts,col,ridge,old){g.save();poly(g,pts);g.fillStyle=col;g.fill();g.clip();
  let y0=1e9,y1=-1e9,xa=1e9,xb=-1e9;for(let i=0;i<pts.length;i+=2){xa=Math.min(xa,pts[i]);xb=Math.max(xb,pts[i]);y0=Math.min(y0,pts[i+1]);y1=Math.max(y1,pts[i+1])}
  for(let y=y1-8,k=0;y>y0-8;y-=8,k++){for(let x=xa-(k%2)*7;x<xb;x+=14){const h=h01(x|0,y|0);g.fillStyle=h<.3?'rgba(0,0,0,.08)':h>.8?'rgba(255,220,180,.1)':'rgba(0,0,0,0)';g.fillRect(x,y,13,8)}
    g.fillStyle='rgba(50,18,8,.28)';g.fillRect(xa,y+6.5,xb-xa,1.6);g.fillStyle='rgba(50,18,8,.16)';for(let x=xa-(k%2)*7;x<xb;x+=14)g.fillRect(x,y,1,7)}
  const gr=g.createLinearGradient(xa,y0,xa,y1);gr.addColorStop(0,'rgba(255,240,210,.12)');gr.addColorStop(1,'rgba(0,0,0,.12)');g.fillStyle=gr;g.fillRect(xa,y0,xb-xa,y1-y0);
  if(old){g.fillStyle='rgba(90,110,60,.18)';for(let k=0;k<14;k++){const h=h01(k,xa|0);g.beginPath();g.ellipse(xa+h*(xb-xa),y0+((k*37)%Math.max(1,y1-y0)),10,4,0,0,7);g.fill()}}
  g.restore();g.save();
  // le faîtage (tuiles faîtières), la planche de rive et la gouttière
  if(ridge){const[ra,rb,ry]=ridge;g.fillStyle=shade(col,-.3);rr(g,ra-6,ry-5,rb-ra+12,8,3);g.fill();g.fillStyle=shade(col,-.12);for(let x=ra-4;x<rb+4;x+=14){g.beginPath();g.arc(x+7,ry-2,5,Math.PI,0);g.fill()}}
  else{const i=pts.length/2|0;g.fillStyle=shade(col,-.3);g.beginPath();g.arc(pts[2],pts[3],5,0,7);g.fill()}
  const ex0=pts[0],ey=pts[1],ex1=pts[pts.length-2];g.fillStyle='#4a3020';g.fillRect(ex0,ey,ex1-ex0,4);
  if(!old){g.fillStyle='#9aa2a6';rr(g,ex0+2,ey+3,ex1-ex0-4,5,2);g.fill();g.fillStyle='rgba(255,255,255,.4)';g.fillRect(ex0+4,ey+4,ex1-ex0-8,1)}
  g.restore()}
/* ---------- lierre ---------- */
function cIvy(g,x0,x1,top,base){g.save();g.lineCap='round';const leaf=(x,y,s,a,c)=>{g.save();g.translate(x,y);g.rotate(a);g.scale(s,s);g.fillStyle=c;g.beginPath();g.moveTo(0,0);g.lineTo(-5,-3);g.lineTo(-4,-7);g.lineTo(-1.5,-6);g.lineTo(0,-10);g.lineTo(1.5,-6);g.lineTo(4,-7);g.lineTo(5,-3);g.closePath();g.fill();g.strokeStyle='rgba(220,240,180,.35)';g.lineWidth=.6;g.beginPath();g.moveTo(0,0);g.lineTo(0,-7);g.stroke();g.restore()};
  for(let k=0;k<6;k++){const sx=x0+6+k*(x1-x0-12)/5,len=40+((k*37)%60),sw=(k%2?1:-1)*14;
    g.strokeStyle='#4a3a22';g.lineWidth=1.6;g.beginPath();g.moveTo(sx,top-2);g.bezierCurveTo(sx+sw,top+len*.3,sx-sw,top+len*.7,sx+sw*.4,top+len);g.stroke();
    for(let j=0;j<9;j++){const u=j/8,ux=(1-u)**3*sx+3*(1-u)**2*u*(sx+sw)+3*(1-u)*u*u*(sx-sw)+u**3*(sx+sw*.4),uy=top-2+len*u;leaf(ux,uy,.9+((j*7+k)%3)*.2,(j%2?1:-1)*(.9+u*.4),(j+k)%3?'#3e6a2e':'#4e7e36')}}
  for(let k=0;k<10;k++)leaf(x0+4+k*(x1-x0-8)/9,top+1,1,Math.PI+((k%3)-1)*.5,k%2?'#4e7e36':'#3e6a2e');
  g.restore()}
/* ---------- la barque amarrée le long de la berge : on la voit par l'arrière, la proue qui file vers le fond ---------- */
function cBoat(g,x,y,t){const bob=Math.sin(t*2)*1.5,rk=Math.sin(t*1.3)*.02;g.save();g.translate(x,y+bob);g.rotate(rk);
  // l'amarre, jusqu'à l'anneau scellé dans la berge
  g.strokeStyle='#d8cca8';g.lineWidth=1.5;g.beginPath();g.moveTo(-34,-4);g.quadraticCurveTo(-46,8,-58,-2);g.stroke();g.fillStyle='#5a5a5a';g.beginPath();g.arc(-60,-2,3,0,7);g.fill();
  const hull=['#3e5a6a','#4a6a7a'];
  // la coque qui file vers le fond : vue d'un peu au-dessus, elle s'amincit en s'éloignant
  g.fillStyle='#3e5a6a';g.beginPath();g.moveTo(-40,-6);g.quadraticCurveTo(-34,-22,-12,-28);g.quadraticCurveTo(0,-31,12,-28);g.quadraticCurveTo(34,-22,40,-6);g.closePath();g.fill();
  g.fillStyle='#9a7a52';g.beginPath();g.moveTo(-34,-8);g.quadraticCurveTo(-29,-20,-10,-25);g.quadraticCurveTo(0,-27,10,-25);g.quadraticCurveTo(29,-20,34,-8);g.closePath();g.fill();
  g.strokeStyle='rgba(60,40,20,.35)';g.lineWidth=1;for(let k=1;k<4;k++){g.beginPath();g.moveTo(-34+k*4,-8-k*4);g.quadraticCurveTo(0,-8-k*5.5,34-k*4,-8-k*4);g.stroke()}
  g.fillStyle='#b8946a';g.fillRect(-28,-15,56,4);g.fillRect(-16,-23,32,3);g.fillStyle='rgba(0,0,0,.2)';g.fillRect(-28,-11,56,1.5);
  g.strokeStyle='#8a6a46';g.lineWidth=2.5;g.beginPath();g.moveTo(-24,-10);g.lineTo(20,-24);g.stroke();g.fillStyle='#8a6a46';g.beginPath();g.ellipse(23,-25,6,2.5,-.3,0,7);g.fill();
  // le plat-bord, puis le tableau arrière (on se pose dessus)
  g.strokeStyle='#d8d0b8';g.lineWidth=3;g.beginPath();g.moveTo(-40,-6);g.quadraticCurveTo(-34,-22,-12,-28);g.quadraticCurveTo(0,-31,12,-28);g.quadraticCurveTo(34,-22,40,-6);g.stroke();
  g.fillStyle=hull[1];g.beginPath();g.moveTo(-40,-6);g.lineTo(40,-6);g.quadraticCurveTo(36,14,24,20);g.lineTo(-24,20);g.quadraticCurveTo(-36,14,-40,-6);g.closePath();g.fill();
  g.fillStyle='#d8d0b8';g.fillRect(-40,-8,80,4);g.fillStyle='rgba(255,255,255,.12)';g.fillRect(-36,-3,72,2);
  g.fillStyle='#f2ead8';g.font='bold 8px '+F_DISP;g.textAlign='center';g.fillText('MARGOT',0,8);g.font='5px '+F_DISP;g.fillText('CRÉCY',0,15);
  g.restore();
  // l'eau qui lèche la coque
  g.fillStyle='rgba(90,140,136,.55)';g.fillRect(x-48,y+10,96,14);g.fillStyle='rgba(235,250,245,.45)';g.beginPath();g.ellipse(x,y+10+bob,46,2.5,0,0,7);g.fill()}
function cMillDoor(g,x,b){// la porte du moulin : encadrement de pierre en arc, deux vantaux cloutés, pentures, une marche
  g.save();const w=60,h=104;
  g.fillStyle='#a89a7a';g.beginPath();g.moveTo(x-w/2-10,b);g.lineTo(x-w/2-10,b-h+20);g.arc(x,b-h+20,w/2+10,Math.PI,0);g.lineTo(x+w/2+10,b);g.closePath();g.fill();
  g.strokeStyle='rgba(60,50,40,.45)';g.lineWidth=1;for(let k=0;k<=8;k++){const a=Math.PI+k*Math.PI/8;g.beginPath();g.moveTo(x+Math.cos(a)*(w/2),b-h+20+Math.sin(a)*(w/2));g.lineTo(x+Math.cos(a)*(w/2+10),b-h+20+Math.sin(a)*(w/2+10));g.stroke()}
  for(let yy=b-h+28;yy<b;yy+=16){g.beginPath();g.moveTo(x-w/2-10,yy);g.lineTo(x-w/2,yy);g.moveTo(x+w/2,yy);g.lineTo(x+w/2+10,yy);g.stroke()}
  g.fillStyle='#c8b890';g.beginPath();g.moveTo(x-6,b-h-6);g.lineTo(x+6,b-h-6);g.lineTo(x+4,b-h+4);g.lineTo(x-4,b-h+4);g.closePath();g.fill();
  g.save();g.beginPath();g.moveTo(x-w/2,b);g.lineTo(x-w/2,b-h+20);g.arc(x,b-h+20,w/2,Math.PI,0);g.lineTo(x+w/2,b);g.closePath();g.clip();
  const wd=g.createLinearGradient(x-w/2,0,x+w/2,0);wd.addColorStop(0,'#4a3020');wd.addColorStop(.5,'#6a4630');wd.addColorStop(1,'#4a3020');g.fillStyle=wd;g.fillRect(x-w/2,b-h-12,w,h+12);
  g.strokeStyle='rgba(30,18,10,.55)';g.lineWidth=1.2;for(let k=1;k<6;k++){const px=x-w/2+k*w/6;g.beginPath();g.moveTo(px,b-h-12);g.lineTo(px,b);g.stroke()}
  g.strokeStyle='#1e1612';g.lineWidth=2;g.beginPath();g.moveTo(x,b-h-12);g.lineTo(x,b);g.stroke();
  g.fillStyle='#2a2420';for(const yy of[b-h+30,b-24])for(const s of[-1,1]){g.fillRect(s<0?x-w/2:x+4,yy,w/2-4,4);g.beginPath();g.arc(s<0?x-w/2+w/2-8:x+8,yy+2,3,0,7);g.fill()}
  g.fillStyle='#8a8a86';for(let k=0;k<6;k++)for(const yy of[b-h+31,b-23]){g.beginPath();g.arc(x-w/2+5+k*10,yy+1.5,1,0,7);g.fill()}
  g.fillStyle='#1a1410';rr(g,x+6,b-h+42,14,10,2);g.fill();g.strokeStyle='#5a5a5a';g.lineWidth=1;for(let k=0;k<3;k++){g.beginPath();g.moveTo(x+9+k*4,b-h+42);g.lineTo(x+9+k*4,b-h+52);g.stroke()}
  g.restore();
  g.fillStyle='#c9a24a';g.beginPath();g.arc(x-7,b-50,2.6,0,7);g.fill();g.strokeStyle='#c9a24a';g.lineWidth=1.5;g.beginPath();g.arc(x-7,b-44,4,0,Math.PI);g.stroke();
  g.fillStyle='#b8aa88';g.fillRect(x-w/2-14,b-4,w+28,6);g.fillStyle='rgba(0,0,0,.2)';g.fillRect(x-w/2-14,b+1,w+28,2);
  g.restore()}
/* ---------- les guêpes et leurs guêpiers ---------- */
const CW_PATH1=[[2050,196],[1950,250],[1800,266],[1640,300],[1494,402],[1546,410],[1700,330],[1900,262]];
const CW_PATH2=[[3896,252],[3990,166],[4140,140],[4250,200],[4232,330],[4180,414],[4110,400],[3990,320]];
function cwAt(p,u){const n=p.length,f=u*n,i=Math.floor(f)%n,k=f-Math.floor(f),a=p[(i-1+n)%n],b=p[i],c=p[(i+1)%n],d=p[(i+2)%n];
  const cr=(a,b,c,d)=>.5*(2*b+(-a+c)*k+(2*a-5*b+4*c-d)*k*k+(-a+3*b-3*c+d)*k*k*k);return[cr(a[0],b[0],c[0],d[0]),cr(a[1],b[1],c[1],d[1])]}
function cNest(g,x,y){g.save();g.strokeStyle='#6a5a40';g.lineWidth=2;g.beginPath();g.moveTo(x,y-18);g.lineTo(x,y-10);g.stroke();
  g.fillStyle='#b8ac94';g.beginPath();g.ellipse(x,y+4,13,17,0,0,7);g.fill();g.strokeStyle='rgba(90,76,56,.55)';g.lineWidth=1.2;for(let k=0;k<6;k++){g.beginPath();g.ellipse(x,y-10+k*5,12-Math.abs(k-2.5)*1.4,2.6,0,0,Math.PI);g.stroke()}
  g.fillStyle='#2a2218';g.beginPath();g.ellipse(x,y+19,4,2.5,0,0,7);g.fill();g.restore()}
function cWasp(g,w,t){g.save();g.translate(w.x,w.y);g.scale(w.f,1);const fl=Math.sin(t*70);
  g.fillStyle='rgba(230,240,250,.7)';g.beginPath();g.ellipse(-1,-5-fl*1.5,5,2.5,-.5,0,7);g.ellipse(2,-5+fl*1.5,4,2,-.3,0,7);g.fill();
  g.fillStyle='#f2c418';g.beginPath();g.ellipse(-2,0,6,3.6,0,0,7);g.fill();g.fillStyle='#1a1a1a';g.fillRect(-4,-3.4,1.8,6.8);g.fillRect(-1,-3.4,1.8,6.8);g.beginPath();g.moveTo(-8,0);g.lineTo(-11,.6);g.lineTo(-8,1.4);g.fill();
  g.beginPath();g.arc(5,-.4,2.8,0,7);g.fill();g.restore()}
/* un texte qui tient toujours dans son panneau */
function fitText(g,txt,x,y,maxW,size){let s=size;g.font='bold '+s+'px '+F_DISP;while(s>3&&g.measureText(txt).width>maxW){s-=.5;g.font='bold '+s+'px '+F_DISP}g.fillText(txt,x,y)}
