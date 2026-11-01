/* =========================================================
   3-2 · LA GARE — la gare de Reims, le parvis, le cours de la Gare, le square Colbert (un matin)
   ---------------------------------------------------------
   Quai : camionnette de vidange (obstacle), fourgonnette de ravitaillement lancée à toute allure (on saute dessus
   ou par-dessus ; chariots à bagages pour s'abriter), rats ; la file d'attente, puis les toits de la sandwicherie,
   du kiosque et du buffet (pics, corbeaux, auvent). Parvis : voyageurs à valises qui battent des bras si on les
   survole. Route : un camion d'un côté, une voiture de l'autre (on peut monter dessus). Square : la statue
   de Colbert (une bille au lieu d'une fiente), trois sortes de pigeons de ville ; la bille les fait tous fuir.
   ========================================================= */
THEMES.gare={outdoor:true,far:'gareReims',horizon:'gareReims',sky:['#78a8d8','#bcd4e8','#eee6d2'],celestial:'none',fog:'#c8d0d6',dark:0,weather:'none',
  floor:'#7a746a',floorTop:'#a8a090',type:'platform',x:'luggage',d:'drape',shelf:'girder',spike:'spikes',walker:'rat',flyer:'crow',awning:'#b8302a',
  props:['bench','clockPost','vending']};
const GR={FL:12*T};

/* ---------- plans de fond (en cache) ---------- */
function gareFX(L,col,pf){return (col*T-W/2)*pf+W/2}
function gareFar(L,g,wpx,R){
  const fx=c=>gareFX(L,c,PF_FAR),D=L.def.gare;
  // ciel du matin et nuages
  {const sk=g.createLinearGradient(0,0,0,460);sk.addColorStop(0,'#6e9fd2');sk.addColorStop(.7,'#bcd4e8');sk.addColorStop(1,'#eee6d2');g.fillStyle=sk;g.fillRect(0,-200,wpx,800)}
  for(let k=0;k<26;k++){const x=R()*wpx,y=30+R()*140,s=18+R()*30;g.fillStyle='rgba(255,252,244,.7)';for(let j=0;j<4;j++){g.beginPath();g.ellipse(x+(j-1.5)*s*.7,y,s*.8,s*.45,0,0,7);g.fill()}}
  // la verrière : piliers de fonte, arcs, vitrages, le quai d'en face et un train en attente
  {const a=fx(0)-60,b=fx(121)+20;g.fillStyle='#c8ccd0';g.fillRect(a,40,b-a,560);
    for(let x=a;x<b;x+=36){g.fillStyle='rgba(150,190,220,.55)';g.fillRect(x+2,40,32,180);g.fillStyle='rgba(255,255,255,.35)';g.fillRect(x+4,44,6,170)}
    g.strokeStyle='#4a5258';g.lineWidth=3;for(let x=a;x<b;x+=150){g.beginPath();g.moveTo(x,330);g.quadraticCurveTo(x+75,90,x+150,330);g.stroke();g.lineWidth=1.2;for(let k=1;k<6;k++){g.beginPath();g.moveTo(x+k*25,330-Math.sin(k/6*Math.PI)*160);g.lineTo(x+k*25,330);g.stroke()}g.lineWidth=3}
    g.fillStyle='#3a4248';g.fillRect(a,218,b-a,8);g.fillRect(a,326,b-a,6);
    g.fillStyle='#9a968c';g.fillRect(a,410,b-a,40);g.fillStyle='#e0c040';g.fillRect(a,410,b-a,3);
    for(let x=a+40;x<b;x+=230+R()*80){g.fillStyle=['#2a3a5a','#6a3a3a','#3a5a4a'][(x|0)%3];g.fillRect(x,384,8,26);g.fillStyle='#e0c0a0';g.beginPath();g.arc(x+4,378,5,0,7);g.fill()}
    // un TGV gris et bleu, à quai, au loin
    g.fillStyle='#d8dce0';rr(g,a+80,342,b-a-200,52,10);g.fill();g.fillStyle='#4a6a9a';g.fillRect(a+80,356,b-a-200,12);g.fillStyle='rgba(30,40,60,.6)';for(let x=a+100;x<b-140;x+=26)g.fillRect(x,358,16,8);
    for(let x=a+60;x<b;x+=150){g.fillStyle='#3a4248';g.fillRect(x-4,226,8,224)}
    // le tableau des départs et l'horloge
    {const x=fx(46);g.fillStyle='#1a1e24';g.fillRect(x-60,236,120,58);g.fillStyle='#e8c040';g.font='bold 7px '+F_DISP;g.textAlign='left';
      ['PARIS-EST    10:24  2','ÉPERNAY      10:31  4','CHÂLONS      10:40  1','CHARLEVILLE  10:52  3'].forEach((s,i)=>g.fillText(s,x-54,248+i*12));g.fillStyle='#2a2e36';g.fillRect(x-1,226,2,10)}
    {const x=fx(86),y=262;g.fillStyle='#f0ead8';g.beginPath();g.arc(x,y,18,0,7);g.fill();g.strokeStyle='#2a2a2a';g.lineWidth=2;g.stroke();g.beginPath();g.moveTo(x,y);g.lineTo(x,y-12);g.moveTo(x,y);g.lineTo(x+9,y+2);g.stroke();g.fillRect(x-1,226,2,18)}
    for(let k=0;k<5;k++){const x=a+60+k*170;g.fillStyle='#4a4e54';g.beginPath();g.ellipse(x,226,5,3,0,0,7);g.fill()}   // pigeons sur les poutres
    // le hall, et la porte SORTIE
    {const x=fx(117);g.fillStyle='#b8b0a0';g.fillRect(x,200,fx(122)-x+10,400);g.fillStyle='#2a3a5a';g.fillRect(x+6,250,46,16);g.fillStyle='#f0ead8';g.font='bold 9px '+F_DISP;g.textAlign='center';g.fillText('SORTIE ➜',x+29,261)}}
  // le bâtiment des voyageurs, vu du parvis (pavillon central, arcades, deux halles vitrées)
  {const c0=fx(119),c1=fx(162),cx=(c0+c1)/2,top=170,bot=440;
    for(const sd of[-1,1]){const hx=sd<0?c0-60:c1-80;g.fillStyle='rgba(180,200,210,.85)';g.beginPath();g.moveTo(hx,bot-120);g.quadraticCurveTo(hx+70,bot-190,hx+140,bot-120);g.closePath();g.fill();g.strokeStyle='#8a9098';g.lineWidth=1;for(let k=10;k<140;k+=14){g.beginPath();g.moveTo(hx+k,bot-120);g.lineTo(hx+k,bot-120-Math.sin(k/140*Math.PI)*62);g.stroke()}}
    g.fillStyle='#d8ccae';g.fillRect(c0,top+40,c1-c0,bot-top-40);g.fillStyle='#c8bc9e';g.fillRect(c0,top+40,c1-c0,10);
    g.fillStyle='#e0d4b6';g.fillRect(cx-60,top-10,120,bot-top+10);poly(g,[cx-66,top-10,cx,top-44,cx+66,top-10]);g.fill();g.fillStyle='#c8bc9e';g.fillRect(cx-66,top-12,132,6);
    g.fillStyle='#f4ecd8';g.beginPath();g.arc(cx,top-18,9,0,7);g.fill();g.strokeStyle='#3a3a3a';g.lineWidth=1;g.stroke();g.beginPath();g.moveTo(cx,top-18);g.lineTo(cx,top-24);g.moveTo(cx,top-18);g.lineTo(cx+4,top-17);g.stroke();
    g.fillStyle='#b8ac8e';g.fillRect(cx-6,top-60,12,18);g.fillStyle='#3a5a9a';g.fillRect(cx-2,top-78,2,18);g.fillStyle='#2a4a9a';g.fillRect(cx,top-78,5,6);g.fillStyle='#f0f0f0';g.fillRect(cx+5,top-78,5,6);g.fillStyle='#c8302a';g.fillRect(cx+10,top-78,5,6);
    for(let x=c0+10;x<c1-20;x+=34){g.fillStyle='#3a4a58';g.beginPath();g.moveTo(x,bot);g.lineTo(x,bot-58);g.arc(x+12,bot-58,12,Math.PI,0);g.lineTo(x+24,bot);g.closePath();g.fill();g.fillStyle='rgba(255,220,150,.3)';g.fillRect(x+3,bot-50,18,48);
      g.fillStyle='#3a4a58';g.fillRect(x+4,top+70,16,28)}
    g.fillStyle='#a89c80';g.fillRect(c0,bot-82,c1-c0,4);g.fillStyle='#2a3a5a';g.fillRect(cx-32,bot-108,64,14);g.fillStyle='#f0ead8';g.font='bold 9px '+F_DISP;g.textAlign='center';g.fillText('REIMS',cx,bot-98);
    for(let k=0;k<5;k++){const x=c0-30+k*((c1-c0+60)/4);g.fillStyle='#4a6a3a';g.beginPath();g.ellipse(x,bot-30,22,30,0,0,7);g.fill();g.fillStyle='#3a2a1a';g.fillRect(x-2,bot-6,4,10)}}
  // le boulevard Foch : façades crème, toits d'ardoise, balcons ; au loin, les tours de la cathédrale
  {const a=fx(160),b=wpx;g.fillStyle='rgba(140,150,170,.55)';const cx2=fx(232);g.fillRect(cx2-40,150,26,90);g.fillRect(cx2+14,150,26,90);g.fillRect(cx2-40,200,80,60);
    let x=a;while(x<b){const w=70+R()*40,h=150+R()*40,y=440-h;g.fillStyle=pick(['#e6dcc6','#ddd2ba','#e8e0cc','#d6c8ae']);g.fillRect(x,y,w,h);g.fillStyle='#5a6070';poly(g,[x-2,y,x+8,y-22,x+w-8,y-22,x+w+2,y]);g.fill();
      for(let fy=y+16;fy<440-30;fy+=30)for(let ffx=x+8;ffx<x+w-12;ffx+=18){g.fillStyle='#4a5a6a';g.fillRect(ffx,fy,9,16);g.fillStyle='#2a2a2a';g.fillRect(ffx-2,fy+16,13,2)}
      g.fillStyle='#8a5a3a';g.fillRect(x+6,440-28,w-12,24);x+=w+2}}
  g.fillStyle='rgba(200,208,214,.18)';g.fillRect(0,0,wpx,600);
}
function gareMid(L,g,wpx,R){
  const fx=c=>gareFX(L,c,PF_MID);
  // le TER arrivé tout à l'heure, à quai derrière nous ; colonnes de fonte
  {const a=fx(2),b=fx(116);g.fillStyle='#e8e4dc';rr(g,a,300,b-a,170,10);g.fill();g.fillStyle='#2f4a72';g.fillRect(a,330,b-a,70);g.fillStyle='#b8322c';g.fillRect(a,450,b-a,7);
    for(let x=a+40;x<b-60;x+=66){g.fillStyle='rgba(26,40,64,.7)';rr(g,x,340,48,50,7);g.fill();g.fillStyle='rgba(255,255,255,.18)';poly(g,[x+6,340,x+16,340,x+4,390,x,390]);g.fill()}
    for(let x=a+500;x<b;x+=640){g.fillStyle='#34363b';g.fillRect(x,320,40,150);g.fillStyle='#b8322c';g.fillRect(x-60,330,44,140);g.fillRect(x+56,330,44,140)}
    g.fillStyle='#24262a';g.fillRect(a,470,b-a,30);for(let x=a+50;x<b;x+=320){g.fillStyle='#1e2024';g.beginPath();g.arc(x,498,15,0,7);g.arc(x+44,498,15,0,7);g.fill()}
    for(let x=a+120;x<b;x+=360){g.fillStyle='#3a4248';g.fillRect(x,40,14,560);g.fillRect(x-10,40,34,10);g.fillStyle='#4a5258';g.fillRect(x-8,500,30,100)}}
  // le parvis : lampadaires, arceaux à vélos, l'arrêt de tram
  {const a=fx(122),b=fx(178);for(let x=a+30;x<b;x+=180){g.fillStyle='#2a2e34';g.fillRect(x,330,5,270);g.beginPath();g.ellipse(x+2,326,12,6,0,0,7);g.fill()}
    for(let x=a+100;x<b;x+=400){g.strokeStyle='#5a5e66';g.lineWidth=3;for(let k=0;k<4;k++){g.beginPath();g.arc(x+k*22,560,10,Math.PI,0);g.stroke()}}}
  // les grands arbres du square
  {const a=fx(176),b=wpx;for(let x=a;x<b;x+=150+R()*80){const h=200+R()*80;g.fillStyle='#4a3424';g.fillRect(x-6,600-h*.6,12,h*.6);for(let k=0;k<6;k++){g.fillStyle=pick(['#4a7a3a','#3e6a32','#5a8a42']);g.beginPath();g.ellipse(x+(R()-.5)*90,600-h+R()*70,50+R()*30,40+R()*20,0,0,7);g.fill()}}}
  g.fillStyle='rgba(200,208,214,.12)';g.fillRect(0,0,wpx,600);
}

/* ---------- après lecture ---------- */
function garePost(Lv){
  const D=Lv.def.gare;if(!D)return;const R=mulberry(Lv.def.seed+5);
  const mv=(kind,w,h)=>{const m={axis:'g',kind,x:-9999,y:99999,w,h:14,vh:h,dx:0,dy:0,t:0,speed:0,a0:0,a1:0,on:false,dir:-1};Lv.movers.push(m);return m};
  const S2={van:mv('van',168,82),truck:mv('truck2',214,116),car:mv('car',150,62),vanT:2.5,warn:0,truckT:1.2,carT:3.3,pass:[],pig:[],seeds:[],said:{},fled:false};
  Lv.gare=S2;
  // les voyageurs du parvis
  const kinds=['valise','sac','costume','touriste','valise'];
  for(let i=0;i<5;i++)S2.pass.push({x:(125+i*7.3)*T,dir:i%2?-1:1,sp:55+R()*30,k:kinds[i],wave:0,cool:0,ph:R()*6});
  // les pigeons du square
  for(const p of D.pigeons){const o=Object.assign({st:'walk',t:R()*2,f:1,vy:0,y:GR.FL,cool:0,beg:0},p);o.x=(p.a||p.c)*T;o.home=o.x;o.leg=0;S2.pig.push(o)}
  // la statue
  Lv.avoid.push(D.statue*T);
}
function gareVehicleSet(m,x,on){m.x=x;m.on=on;m.y=on?GR.FL-m.vh:99999}
function gareStep(dt){
  const S2=L.gare;if(!S2)return;const D=L.def.gare,pcx=P.x+P.w/2,F=GR.FL;
  const hb={x:P.x+3,y:P.y+4,w:P.w-6,h:P.h-6};
  const hitVeh=(m,kind,lim)=>{if(!m.on||P.dead||P.onMover===m)return;let x0=m.x+6,x1=m.x+m.w-6;if(lim){x0=Math.max(x0,lim[0]);x1=Math.min(x1,lim[1])}if(x1<=x0)return;const b={x:x0,y:m.y+8,w:x1-x0,h:m.vh-8};if(overlap(hb,b))G.gareHit=kind};
  // la fourgonnette de ravitaillement : elle arrive de la droite à toute allure
  {const m=S2.van,[a,b]=D.vanZone,px=m.x;
    if(m.on){m.x-=430*dt;if(m.x+m.w<(D.camion[1]+1)*T-10)gareVehicleSet(m,-9999,false)}
    else if(pcx>a*T&&pcx<b*T&&!P.dead){S2.vanT-=dt;if(S2.vanT<1&&!S2.warn){S2.warn=1;if(!G.sim){tone(440,.12,'square',.06);tone(440,.12,'square',.06,null,.18)}}
      if(S2.vanT<=0){gareVehicleSet(m,Math.max(cam.x+W+30,pcx+260),true);S2.vanT=4.5+rnd()*2.5;S2.warn=0;if(!G.sim)noise(.6,500,.18,'lowpass')}}
    m.dx=m.on?m.x-px:0;hitVeh(m,'fourgonnette');
    if(m.on&&!S2.said.van&&!G.sim&&m.x<pcx-200&&!P.dead){S2.said.van=1;say("Une voiture sur le quai, à fond de train ! Ils ne respectent plus rien.",3.4)}}
  // la route : un camion vers la gauche, une voiture vers la droite
  {const [r0,r1]=D.road,near=pcx>(r0-22)*T&&pcx<(r1+18)*T;
    for(const[m,dir,key,sp]of[[S2.truck,-1,'truckT',240],[S2.car,1,'carT',290]]){const px=m.x;
      if(m.on){m.x+=dir*sp*dt;if(dir<0?m.x+m.w<r0*T:m.x>(r1+1)*T)gareVehicleSet(m,-9999,false)}
      else if(near){S2[key]-=dt;if(S2[key]<=0){gareVehicleSet(m,dir<0?(r1+1)*T:r0*T-m.w,true);S2[key]=3.6+rnd()*1.8;if(!G.sim&&Math.abs(pcx-m.x)<900)noise(.5,dir<0?220:420,.12,'lowpass')}}
      m.dx=m.on?m.x-px:0;hitVeh(m,'voiture',[r0*T,(r1+1)*T])}}
  // les voyageurs à valise : ils vont et viennent ; si on les survole, ils battent des bras
  const [p0,p1]=[123*T,157*T];
  for(const p of S2.pass){p.x+=p.dir*p.sp*dt;if(p.x<p0){p.x=p0;p.dir=1}if(p.x>p1){p.x=p1;p.dir=-1}p.wave=Math.max(0,p.wave-dt);p.cool=Math.max(0,p.cool-dt);
    if(P.dead)continue;
    const body={x:p.x-12,y:F-104,w:24,h:104},bag={x:p.x-p.dir*30-11,y:F-40,w:22,h:40};
    if(overlap(hb,body)||(p.k!=='sac'&&overlap(hb,bag)))G.gareHit='passant';
    if(Math.abs(pcx-p.x)<44&&P.y+P.h<F-100&&P.y+P.h>F-230&&p.cool<=0){p.wave=.9;p.cool=1.4;if(!G.sim){bubble(p.x,F-150,pick(["Hé ! Sale bête !","Pas sur moi !","Ouste !","Beurk !"]),'#2a3a5a');if(!S2.said.wave){S2.said.wave=1;setTimeout(()=>say("Ils battent des bras comme des sémaphores. Il faut passer bien plus haut.",3.4),700)}}}
    if(p.wave>.15&&overlap(hb,{x:p.x-34,y:F-176,w:68,h:76}))G.gareHit='passant'}
  // les pigeons du square
  for(const o of S2.pig){o.t+=dt;o.cool=Math.max(0,o.cool-dt);
    if(o.st==='flee'){o.vy-=400*dt;o.y+=o.vy*dt;o.x+=o.f*160*dt;continue}
    const dx=pcx-o.x,near=Math.abs(dx);
    if(o.k==='gros'){// marche un peu, puis vole de A à B, toujours le même trajet
      const A=o.a*T,B=o.b*T,cyc=7,u=(o.t%cyc);
      if(u<2){o.st='walk';o.x=A+Math.sin(u*1.6)*14;o.y=F;o.f=1}else if(u<3.5){o.st='fly';const v=(u-2)/1.5;o.x=A+(B-A)*v;o.y=F-Math.sin(v*Math.PI)*150;o.f=1}
      else if(u<5.5){o.st='walk';o.x=B+Math.sin((u-3.5)*1.6)*14;o.y=F;o.f=-1}else{o.st='fly';const v=(u-5.5)/1.5;o.x=B+(A-B)*v;o.y=F-Math.sin(v*Math.PI)*150;o.f=-1}}
    else if(o.k==='deplume'){// court vers Raymond, ne vole pas
      if(near<320&&P.y+P.h>F-120){o.st='run';o.f=Math.sign(dx)||1;o.x+=o.f*205*dt}else{o.st='walk';o.f=Math.sin(o.t*.5)>0?1:-1;o.x+=o.f*25*dt}
      o.x=clamp(o.x,(D.park[0]+2)*T,(D.park[1]-2)*T);if(near<160&&!S2.said.dep&&!G.sim){S2.said.dep=1;bubble(o.x,F-40,'Kroûû !','#6a4a4a')}}
    else{// le pigeon aux moignons : il s'arrête et mendie ; si on le survole, il crache une graine
      if(near<130){o.st='beg';o.f=Math.sign(dx)||1;if(o.beg<=0&&!G.sim){o.beg=3;bubble(o.x,F-44,pick(["Une graine, pour un ancien combattant ?","Pitié, camarade…","Rien qu'une miette…"]),'#6a5a48')}}
      else{o.st='walk';o.f=Math.sin(o.t*.4)>0?1:-1;o.x+=o.f*14*dt;o.x=clamp(o.x,o.home-120,o.home+120)}
      o.beg=Math.max(0,o.beg-dt);
      if(near<30&&P.y+P.h<F-30&&!P.onGround&&o.cool<=0&&!P.dead){o.cool=2;S2.seeds.push({x:o.x,y:F-20});if(!G.sim){noise(.08,2600,.15,'bandpass');bubble(o.x,F-40,'Ptou !','#6a5a48')}}}
    if(!P.dead&&o.k!=='moignon'&&overlap(hb,{x:o.x-(o.k==='gros'?16:12),y:o.y-(o.k==='gros'?30:24),w:o.k==='gros'?32:24,h:o.k==='gros'?28:22}))G.gareHit=o.k==='gros'?'pigeonGros':'pigeonDeplume'}
  S2.pig=S2.pig.filter(o=>o.y>-200);
  // la graine crachée ne rate jamais sa cible
  for(let i=S2.seeds.length-1;i>=0;i--){const s=S2.seeds[i],tx=pcx,ty=P.y+P.h/2,d=Math.hypot(tx-s.x,ty-s.y)||1;s.x+=(tx-s.x)/d*520*dt;s.y+=(ty-s.y)/d*520*dt;
    if(d<10){S2.seeds.splice(i,1);if(!P.dead)G.gareHit='graine'}else if(P.dead)S2.seeds.splice(i,1)}
}
function gareAfterMove(){if(G.gareHit){const k=G.gareHit;G.gareHit=null;return k}return null}
/* la bille, au square : tous les pigeons s'envolent */
function gareMarble(m){
  const S2=L.gare,D=L.def.gare;if(!S2||S2.fled)return;if(m.x<D.park[0]*T||m.x>D.park[1]*T)return;
  S2.fled=true;for(const o of S2.pig){o.st='flee';o.vy=-120-rnd()*80;o.f=o.x<m.x?-1:1}
  if(!G.sim){for(let k=0;k<6;k++)setTimeout(()=>SFX.flap(),k*90);setTimeout(()=>say("Tous envolés au bruit de ma bille ! Il reste encore un peu de respect pour l'uniforme.",3.8),1400)}
}
function gareStatueLine(){
  const D=L.def.gare;if(!D)return null;const pcx=P.x+P.w/2;
  if(Math.abs(pcx-(D.statue*T+T/2))<30&&P.y+P.h<=6*T)return"Je n'y arrive plus ! Une bille, encore une bille… Pourtant, fienter sur les statues, c'est le premier devoir d'un pigeon.";
  return null;
}

/* ---------- dessin ---------- */
function drawGareMid(t){
  const S2=L.gare;if(!S2)return;const D=L.def.gare,g=ctx,F=GR.FL,vis=(a,b)=>b>cam.x-120&&a<cam.x+W+120;
  // la camionnette de vidange, son tuyau vers le train
  {const x0=D.camion[0]*T,x1=(D.camion[1]+1)*T;if(vis(x0,x1)){g.fillStyle='#e8e8e2';rr(g,x0,F-80,x1-x0,72,6);g.fill();g.fillStyle='#c8ccd0';rr(g,x0+50,F-74,x1-x0-60,52,20);g.fill();
    g.fillStyle='rgba(30,40,60,.7)';g.fillRect(x0+6,F-72,32,26);g.fillStyle='#2a6a4a';g.fillRect(x0,F-30,x1-x0,6);g.fillStyle='#2a2a2a';g.font='bold 8px '+F_DISP;g.textAlign='center';g.fillText('VIDANGE',x0+120,F-40);
    for(const wx of[x0+26,x1-30]){g.fillStyle='#1e1e22';g.beginPath();g.arc(wx,F-6,11,0,7);g.fill();g.fillStyle='#8a8e96';g.beginPath();g.arc(wx,F-6,4,0,7);g.fill()}
    const s=Math.sin(t*6)*2;g.strokeStyle='#3a5a3a';g.lineWidth=7;g.beginPath();g.moveTo(x1-10,F-50);g.quadraticCurveTo(x1+30,F-30+s,x1+20,F-110);g.stroke();
    g.fillStyle='#e8a020';g.fillRect(x0+40,F-86,10,6);if((t*3|0)%2){g.fillStyle='rgba(255,180,40,.5)';g.beginPath();g.arc(x0+45,F-84,10,0,7);g.fill()}}}
  // chariots à bagages (sur leurs cases)
  for(const[c0,c1]of D.cart){const x0=c0*T,x1=(c1+1)*T;if(!vis(x0,x1))continue;g.fillStyle='#3a3e46';g.fillRect(x0,F-82,x1-x0,6);g.fillRect(x0,F-16,x1-x0,6);g.fillRect(x0+4,F-82,4,70);
    for(let k=0;k<3;k++){g.fillStyle=['#6a3a2a','#2a4a6a','#8a6a3a'][k];rr(g,x0+8+k*22,F-76+k%2*6,22,60-k%2*6,4);g.fill();g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x0+12+k*22,F-70+k%2*6,14,3)}
    g.fillStyle='#1e1e22';for(const wx of[x0+12,x1-12]){g.beginPath();g.arc(wx,F-6,6,0,7);g.fill()}}
  // la file d'attente
  {const[a,b]=D.queue;if(vis(a*T,b*T)){[[80.4,'#3a4a6a','#e0c0a0'],[82.6,'#7a3a3a','#c89878'],[85.2,'#4a5a3a','#e8c8a8'],[87.3,'#2a2a30','#a87858']].forEach(([c,coat,skin],i)=>drawQueuer(g,c*T,F,coat,skin,t+i*1.7,i))}}
  // la sandwicherie, le kiosque, le buffet
  drawShop(g,D.shop,'SANDWICHS · BOISSONS','#2a5a4a',t);drawKiosk(g,D.kiosk,t);drawBuffet(g,D.resto,t);
  // les jardinières du parvis
  for(const c of[133,148]){const x=c*T;if(!vis(x,x+T))continue;g.fillStyle='#b8b0a0';g.fillRect(x-4,F-T,T+8,T);g.fillStyle='#a49c8c';g.fillRect(x-4,F-T,T+8,5);
    for(let k=0;k<5;k++){g.fillStyle=k%2?'#4a7a3a':'#3e6a32';g.beginPath();g.ellipse(x+4+k*8,F-T-6-(k%3)*4,10,12,0,0,7);g.fill()}}
  // le parvis : les voyageurs
  for(const p of S2.pass)if(vis(p.x-60,p.x+60))drawPassant(g,p,F,t);
  // la route : marquage, les véhicules, l'abri de tram et la haie qui les cachent
  {const[r0,r1]=D.road,a=r0*T,b=(r1+1)*T;if(vis(a,b)){g.fillStyle='#f0f0e8';for(let x=a+20;x<b-20;x+=60)g.fillRect(x,F-2,30,2);
      g.save();g.beginPath();g.rect(a,0,b-a,F+80);g.clip();for(const m of[S2.truck,S2.car])if(m.on)drawGareVehicle(g,m,t);g.restore();
      drawTramStop(g,(r0-2)*T,F,t);drawHedge(g,(r1-1)*T,F,t)}}
  if(S2.van.on)drawGareVehicle(g,S2.van,t);
  // la statue de Colbert
  {const x=D.statue*T+T/2;if(vis(x-300,x+300))drawColbert(g,x,F,t)}
  // les pigeons du square, les graines
  for(const o of S2.pig)if(vis(o.x-40,o.x+40))drawUglyPigeon(g,o,t);
  for(const s of S2.seeds){g.fillStyle='#c8a050';g.beginPath();g.ellipse(s.x,s.y,3,2,0,0,7);g.fill()}
  // l'annonce de la fourgonnette : gyrophare au bord de l'écran
  if(S2.warn&&!S2.van.on){const a=.5+.5*Math.sin(t*18);g.fillStyle='rgba(255,170,40,'+(.35*a)+')';g.beginPath();g.ellipse(cam.x+W,F-60,90,70,0,0,7);g.fill()}
}
function drawQueuer(g,x,F,coat,skin,t,i){
  const br=Math.sin(t*1.3)*1;g.fillStyle='#24262c';g.fillRect(x-8,F-50,7,50);g.fillRect(x+1,F-50,7,50);g.fillStyle=coat;rr(g,x-12,F-104+br,24,58,8);g.fill();
  g.fillStyle=skin;g.beginPath();g.arc(x,F-114+br,10,0,7);g.fill();g.fillStyle=['#3a2a1a','#d8d0c8','#6a3a1a','#1a1a1a'][i];g.beginPath();g.arc(x,F-118+br,10,Math.PI,0);g.fill();
  if(i===1){g.fillStyle='#1a1a1e';rr(g,x+8,F-92,6,10,2);g.fill()}if(i===3){g.fillStyle='#e8e4d8';g.fillRect(x+6,F-86,14,10)}
}
function drawShop(g,[c0,c1],label,col,t){
  const x0=c0*T,x1=(c1+1)*T,top=8*T,F=GR.FL;if(x1<cam.x-100||x0>cam.x+W+100)return;
  g.fillStyle='#e8dcc0';g.fillRect(x0,top,x1-x0,F-top);g.fillStyle=col;g.fillRect(x0-6,top-4,x1-x0+12,26);g.fillStyle='#f4ecd8';g.font='bold 11px '+F_DISP;g.textAlign='center';g.fillText(label,(x0+x1)/2,top+14);
  g.fillStyle='rgba(180,210,230,.6)';g.fillRect(x0+10,top+34,x1-x0-20,74);g.fillStyle='#c8a060';for(let k=0;k<7;k++){rr(g,x0+20+k*36,top+82,28,12,5);g.fill()}g.fillStyle='#8a5a3a';for(let k=0;k<6;k++){g.fillRect(x0+24+k*40,top+52,24,8)}
  g.fillStyle='#6a4a32';g.fillRect(x0,F-46,x1-x0,46);g.fillStyle='#2a2a2e';g.fillRect(x0+20,F-60,30,14);g.fillStyle='#f0ece0';for(let k=0;k<3;k++)poly(g,[x1-50+k*10,F-46,x1-48+k*10,F-56,x1-42+k*10,F-56,x1-40+k*10,F-46]),g.fill();
  g.fillStyle='#8a8e96';g.fillRect(x0-4,top-4,x1-x0+8,4);
}
function drawKiosk(g,[c0,c1],t){
  const x0=c0*T,x1=(c1+1)*T,top=7*T,F=GR.FL;if(x1<cam.x-100||x0>cam.x+W+100)return;
  g.fillStyle='#2a4a3a';g.fillRect(x0,top,x1-x0,F-top);g.fillStyle='#1e3a2c';g.fillRect(x0-8,top-6,x1-x0+16,24);g.fillStyle='#e8d070';g.font='bold 12px '+F_DISP;g.textAlign='center';g.fillText('PRESSE',(x0+x1)/2,top+11);
  const R=mulberry(c0);for(let row=0;row<3;row++)for(let k=0;k<5;k++){const x=x0+10+k*36,y=top+30+row*42;g.fillStyle=pick(['#ece8dc','#f0e0d0','#e0e8f0','#f4ecc8']);g.fillRect(x,y,28,36);g.fillStyle=pick(['#c8302a','#2a4a8a','#2a2a2a']);g.fillRect(x+2,y+2,24,6);g.fillStyle='rgba(40,40,40,.35)';for(let j=0;j<4;j++)g.fillRect(x+3,y+12+j*5,22,2)}
  g.fillStyle='#2a2a2a';g.font='bold 5px '+F_DISP;g.fillText("L'UNION",x0+24,top+36);g.fillStyle='#c8302a';g.fillRect(x0,F-34,x1-x0,6);
}
function drawBuffet(g,[c0,c1],t){
  const x0=c0*T,x1=(c1+1)*T,top=6*T,F=GR.FL;if(x1<cam.x-200||x0>cam.x+W+100)return;
  g.fillStyle='#d8c8a8';g.fillRect(x0,top,x1-x0,F-top);g.fillStyle='#5a3a26';g.fillRect(x0,top,x1-x0,24);g.fillStyle='#f0e0b0';g.font='bold 12px '+F_DISP;g.textAlign='center';g.fillText('BUFFET DE LA GARE',(x0+x1)/2,top+16);
  for(let x=x0+16;x<x1-40;x+=64){g.fillStyle='#3a2a20';g.fillRect(x,top+46,44,90);g.fillStyle='rgba(255,220,160,.55)';g.fillRect(x+4,top+50,36,82);g.strokeStyle='#3a2a20';g.lineWidth=2;g.beginPath();g.moveTo(x+22,top+50);g.lineTo(x+22,top+132);g.stroke()}
  g.fillStyle='#3a2a20';g.fillRect(x0,F-40,x1-x0,40);g.fillStyle='#b8302a';for(let k=0;k<(x1-x0)/40;k++)g.fillRect(x0+k*40,top+28,20,8);
  // la terrasse : tables, parasols, un client et son café
  for(const tx of[x1+60,x1+110]){g.fillStyle='#8a8e96';g.fillRect(tx-1,F-40,3,40);g.fillStyle='#e8e4d8';g.beginPath();g.ellipse(tx,F-40,20,4,0,0,7);g.fill();g.fillStyle='#f0ece4';g.fillRect(tx-6,F-48,6,8)}
  {const px=x1+80;g.fillStyle='#3a3e44';g.fillRect(px,F-170,4,170);g.fillStyle='#b8302a';poly(g,[px-64,F-150,px+2,F-176,px+68,F-150]);g.fill();g.fillStyle='#f0ece4';for(let k=-3;k<3;k++)poly(g,[px+k*22,F-150,px+k*22+11,F-158,px+k*22+22,F-150]),g.fill()}
}
function drawPassant(g,p,F,t){
  const x=p.x,f=p.dir,ph=t*7*p.sp/70+p.ph,st=Math.sin(ph);
  const coat={valise:'#7a3a4a',sac:'#3a5a7a',costume:'#2a2e3a',touriste:'#c8a040'}[p.k],skin={valise:'#e8c8a8',sac:'#c89878',costume:'#e0b896',touriste:'#f0d0b0'}[p.k];
  // la valise à roulettes, derrière
  if(p.k!=='sac'){const bx=x-f*30;g.strokeStyle='#2a2a2e';g.lineWidth=2;g.beginPath();g.moveTo(x-f*8,F-58);g.lineTo(bx,F-38);g.stroke();g.fillStyle=p.k==='costume'?'#1e1e24':p.k==='touriste'?'#3a8ac8':'#b84a3a';rr(g,bx-11,F-40,22,34,4);g.fill();g.fillStyle='#1a1a1a';g.beginPath();g.arc(bx-6,F-3,3,0,7);g.arc(bx+6,F-3,3,0,7);g.fill()}
  g.strokeStyle='#24262c';g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(x,F-50);g.lineTo(x+st*10,F-4);g.moveTo(x,F-50);g.lineTo(x-st*10,F-4);g.stroke();
  g.fillStyle=coat;rr(g,x-12,F-104,24,58,8);g.fill();if(p.k==='sac'){g.fillStyle='#4a6a3a';rr(g,x-f*16-8,F-98,14,34,5);g.fill()}
  g.fillStyle=skin;g.beginPath();g.arc(x+f*2,F-114,10,0,7);g.fill();g.fillStyle=p.k==='touriste'?'#e8e0c8':'#3a2a1a';g.beginPath();g.arc(x+f*2,F-118,10,Math.PI,0);g.fill();if(p.k==='touriste'){g.fillRect(x-12,F-121,26,3)}
  g.fillStyle='#111';g.beginPath();g.arc(x+f*7,F-115,1.3,0,7);g.fill();
  // les bras : le long du corps, ou qui moulinent en l'air
  g.strokeStyle=coat;g.lineWidth=6;
  if(p.wave>0){const w=Math.sin(t*22)*.6;for(const s of[-1,1]){g.beginPath();g.moveTo(x+s*8,F-96);g.lineTo(x+s*(18+Math.cos(w)*6),F-132-Math.sin(w*s)*10);g.lineTo(x+s*(10+w*12),F-166);g.stroke()}}
  else{g.beginPath();g.moveTo(x+f*6,F-96);g.lineTo(x+f*8+st*4,F-60);g.stroke()}
  g.lineCap='butt';
}
function drawGareVehicle(g,m,t){
  const x=m.x,w=m.w,h=m.vh,F=GR.FL,y=F-h;
  if(m.kind==='van'){// fourgonnette de ravitaillement, gyrophare orange, caisson
    g.fillStyle='#e8e4dc';rr(g,x+40,y,w-40,h-14,5);g.fill();g.fillStyle='#d8d4cc';rr(g,x,y+24,50,h-38,8);g.fill();g.fillStyle='rgba(30,40,60,.75)';g.fillRect(x+6,y+30,30,22);
    g.fillStyle='#c8302a';g.fillRect(x+40,y+h-36,w-40,6);g.fillStyle='#2a2a2a';g.font='bold 8px '+F_DISP;g.textAlign='center';g.fillText('RESTAURATION À BORD',x+40+(w-40)/2,y+28);
    g.fillStyle=(t*8|0)%2?'#ffb030':'#a86010';g.fillRect(x+60,y-6,10,6);g.fillStyle='rgba(255,200,120,.8)';g.beginPath();g.ellipse(x+2,y+h-28,4,3,0,0,7);g.fill();
    g.strokeStyle='rgba(255,255,255,.5)';g.lineWidth=1.5;for(let k=0;k<4;k++){g.beginPath();g.moveTo(x+w+6+k*10,y+18+k*12);g.lineTo(x+w+30+k*14,y+18+k*12);g.stroke()}}
  else if(m.kind==='truck2'){// camion de livraison (vers la gauche)
    g.fillStyle='#d8d4c4';g.fillRect(x+46,y,w-46,h-18);g.fillStyle='#2a5a8a';g.fillRect(x+46,y+h-46,w-46,8);g.fillStyle='#2a2a2a';g.font='bold 10px '+F_DISP;g.textAlign='center';g.fillText('LIVRAISONS CHAMPENOISES',x+46+(w-46)/2,y+30);
    g.fillStyle='#2a5a8a';rr(g,x,y+34,50,h-52,8);g.fill();g.fillStyle='rgba(30,40,60,.75)';g.fillRect(x+6,y+40,30,24)}
  else{// petite voiture rouge (vers la droite)
    g.fillStyle='#b8302a';rr(g,x,y+20,w,h-30,10);g.fill();g.beginPath();g.moveTo(x+30,y+22);g.quadraticCurveTo(x+60,y-2,x+100,y+2);g.lineTo(x+126,y+22);g.closePath();g.fill();
    g.fillStyle='rgba(30,40,60,.7)';poly(g,[x+44,y+20,x+64,y+6,x+96,y+6,x+116,y+20]);g.fill();g.fillStyle='#fff6d0';g.fillRect(x+w-6,y+30,6,6)}
  for(const wx of m.kind==='car'?[x+28,x+w-30]:[x+30,x+w-36]){g.fillStyle='#1a1a1e';g.beginPath();g.arc(wx,F-8,12,0,7);g.fill();g.fillStyle='#8a8e96';g.beginPath();g.arc(wx,F-8,4.5,0,7);g.fill()}
}
function drawTramStop(g,x,F,t){
  g.fillStyle='rgba(200,225,235,.5)';g.fillRect(x-10,F-150,90,140);g.strokeStyle='#4a5058';g.lineWidth=4;g.strokeRect(x-10,F-150,90,140);g.fillStyle='#4a5058';g.fillRect(x-20,F-158,110,10);
  g.fillStyle='#e8e0cc';g.fillRect(x+40,F-138,34,60);g.fillStyle='#8a3a5a';g.fillRect(x+44,F-134,26,40);g.fillStyle='#2a2a2a';g.font='bold 7px '+F_DISP;g.textAlign='center';g.fillText('GARE CENTRE',x+35,F-162);
  g.fillStyle='#3a3e44';g.fillRect(x,F-40,60,4);
}
function drawHedge(g,x,F,t){for(let k=0;k<6;k++){g.fillStyle=k%2?'#3e6a32':'#4a7a3a';g.beginPath();g.ellipse(x+10+k*14,F-40+((k*7)%3)*4,26,48,0,0,7);g.fill()}g.fillStyle='rgba(255,255,255,.12)';g.beginPath();g.ellipse(x+30,F-70,14,10,0,0,7);g.fill()}
function drawColbert(g,x,F,t){
  // marches (sur leurs cases), socle de pierre claire aux médaillons de bronze, la statue en bronze
  g.fillStyle='#b8b2a4';g.fillRect(x-260,F-40,520,40);g.fillStyle='#c8c2b4';g.fillRect(x-220,F-80,440,40);g.fillStyle='rgba(255,255,255,.3)';g.fillRect(x-260,F-40,520,3);g.fillRect(x-220,F-80,440,3);
  g.fillStyle='#d8d0bc';g.fillRect(x-140,F-160,280,80);g.fillStyle='#e8dfc4';g.beginPath();g.ellipse(x,F-160,140,10,0,0,7);g.fill();
  g.fillStyle='#e4d8b4';g.fillRect(x-100,F-240,200,80);g.fillStyle='#d0c49e';g.fillRect(x-108,F-246,216,10);g.fillRect(x-108,F-170,216,10);
  for(const mx of[x-48,x+48]){g.fillStyle='#6a5a3a';g.beginPath();g.arc(mx,F-205,20,0,7);g.fill();g.fillStyle='#8a7a4a';g.beginPath();g.arc(mx,F-205,15,0,7);g.fill()}
  g.fillStyle='#e8dcc0';g.fillRect(x-60,F-280,120,40);g.fillStyle='#3a3226';g.fillRect(x-60,F-284,120,6);
  // Colbert : grande perruque, manteau, la main posée sur une colonne de livres
  const b=F-280;g.fillStyle='#3a3428';g.fillRect(x-22,b-120,44,120);g.beginPath();g.moveTo(x-26,b);g.lineTo(x-34,b-60);g.lineTo(x-20,b-110);g.lineTo(x+20,b-110);g.lineTo(x+30,b-50);g.lineTo(x+24,b);g.closePath();g.fill();
  g.fillStyle='#2e2a20';g.fillRect(x+22,b-58,20,58);g.fillStyle='#4a4232';g.fillRect(x+20,b-62,24,6);
  g.fillStyle='#3a3428';g.beginPath();g.arc(x,b-122,14,0,7);g.fill();g.fillStyle='#2e2a20';g.beginPath();g.ellipse(x,b-118,19,22,0,Math.PI*.9,Math.PI*2.1);g.fill();
  g.strokeStyle='#4a4232';g.lineWidth=6;g.beginPath();g.moveTo(x+12,b-96);g.lineTo(x+30,b-64);g.stroke();
  g.fillStyle='rgba(120,160,120,.25)';g.fillRect(x-22,b-120,8,110);
}
function drawUglyPigeon(g,o,t){
  const x=o.x,y=o.y,f=o.f,k=o.k,fly=o.st==='fly'||o.st==='flee';g.save();g.translate(x,y);g.scale(f,1);
  const big=k==='gros'?1.4:k==='moignon'?.9:1,hb=o.st==='run'||o.st==='walk'?Math.sin(t*(o.st==='run'?24:12))*2:0;g.scale(big,big);
  if(fly){const fl=Math.sin(t*28)*10;g.fillStyle=k==='gros'?'#5a6070':'#8a8a8a';poly(g,[-4,-14,-16,-28-fl,4,-16]);g.fill()}
  // pattes : moignons ou pattes rouges
  if(!fly){g.strokeStyle='#b4454c';g.lineWidth=2;if(k==='moignon'){g.beginPath();g.moveTo(-2,-8);g.lineTo(-2,-3);g.moveTo(3,-8);g.lineTo(4+Math.max(0,Math.sin(t*3))*2,0);g.stroke();g.fillStyle='#b4454c';g.beginPath();g.arc(-2,-3,2,0,7);g.fill()}
    else{g.beginPath();g.moveTo(-2,-8);g.lineTo(-2+hb,0);g.moveTo(3,-8);g.lineTo(3-hb,0);g.stroke()}}
  // corps
  const body=k==='deplume'?'#c89a90':k==='gros'?'#5e6472':'#7a7e86';g.fillStyle=body;g.beginPath();g.ellipse(-1,-13,k==='moignon'?8:11,k==='gros'?9:7,0,0,7);g.fill();
  if(k==='deplume'){g.fillStyle='#7a7e8a';for(const[px,py]of[[-6,-17],[2,-10],[-2,-15]]){g.beginPath();g.ellipse(px,py,3,2,0,0,7);g.fill()}g.strokeStyle='rgba(120,60,60,.5)';g.lineWidth=.8;for(let i=0;i<5;i++){g.beginPath();g.arc(-6+i*3,-10,1,0,7);g.stroke()}}
  if(k==='moignon'){g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=.8;for(let i=0;i<4;i++){g.beginPath();g.moveTo(-6+i*3,-18);g.lineTo(-5+i*3,-8);g.stroke()}}
  g.fillStyle=k==='gros'?'#3e4250':'#5a5e66';poly(g,[-9,-15,-18,-17,-18,-11,-9,-10]);g.fill();
  // cou irisé, tête
  g.fillStyle=k==='deplume'?'#d8a8a0':'#4f8a7a';g.beginPath();g.ellipse(6,-18,4.5,5.5,.3,0,7);g.fill();
  const hx=9+(o.st==='beg'?Math.sin(t*3)*1:hb*.6),hy=o.st==='beg'?-22:-24;g.fillStyle=k==='deplume'?'#d8a8a0':k==='gros'?'#4e5462':'#8a8e96';g.beginPath();g.arc(hx,hy,5,0,7);g.fill();
  g.fillStyle='#3a3836';poly(g,[hx+4,hy-1,hx+8,hy+.5,hx+4,hy+1.5]);g.fill();
  g.fillStyle=k==='gros'?'#e83a1a':'#d97a2a';g.beginPath();g.arc(hx+1,hy-1,1.8,0,7);g.fill();g.fillStyle='#111';g.beginPath();g.arc(hx+1.3,hy-1,.8,0,7);g.fill();
  if(k==='gros'){g.strokeStyle='#111';g.lineWidth=1.2;g.beginPath();g.moveTo(hx-2,hy-4);g.lineTo(hx+3,hy-2.5);g.stroke()}
  if(k==='moignon'&&o.st==='beg'){g.fillStyle='rgba(150,190,230,.8)';g.beginPath();g.ellipse(hx+1,hy+3+(t*2%1)*4,1,1.6,0,0,7);g.fill()}
  g.restore();
}
