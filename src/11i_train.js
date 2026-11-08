/* =========================================================
   3-1 · LE TRAIN — Raymond voyage sur le toit d'un train régional qui file vers Reims
   ---------------------------------------------------------
   Le train est immobile dans le monde : c'est le paysage qui défile (bandes en cache, décalées à chaque image).
   Pylônes caténaires (sauter), passerelle (rester au sol), voiture de voyageurs en coupe (bouteilles qui roulent
   au gré des secousses, voyageurs qui jettent des objets s'ils voient Raymond sauter devant eux, sac à dos rouge),
   voiture-bar (serveur qui frappe, paquet de chips), arrivée en gare et arrêt du train.
   ========================================================= */
THEMES.train={outdoor:true,far:'train',horizon:'train',sky:['#5f97cf','#b4d0e6','#f4dcae'],celestial:'none',fog:'#c8d4dc',dark:0,weather:'none',
  floor:'#5a5e66',floorTop:'#8a8e96',type:'zinc',x:'crate',d:'drape',shelf:'girder',spike:'elec',walker:'rat',flyer:'crow',props:[]};
const TRN={ROOF:7*T,FLOOR:12*T,BOT:13*T,RAIL:590,WIRE:60,VN:650,DEC:7.5};
const TR_LIV={body:'#e9e6de',band:'#2f4a72',band2:'#24395a',red:'#b8322c',roof:'#a9adb3',roof2:'#8a8e94',under:'#2c2e33',glass:'#20304a'};

/* ---------- après lecture du niveau ---------- */
function trainPost(Lv){
  if(Lv.def.theme!=='train')return;
  const D=Lv.def.train,R=mulberry(Lv.def.seed+3);
  const w3=D.wagons.find(w=>w.k==='seats'),w4=D.wagons.find(w=>w.k==='bar'),ws=D.wagons.filter(w=>w.k==='ext'),wl=D.wagons[D.wagons.length-1];
  const Tn={v:1,sFar:0,sMid:0,sNear:0,sBal:0,pyl:[],spawnT:3.2,warn:0,nextKind:'pylon',bridgeDone:false,w5:false,
    dir:1,joltT:3,bottles:[],proj:[],litter:[],pass:[],said:{},clickT:.4,door:{c:D.door,open:0,shut:true},
    waiter:{x:(D.counter[0]+3)*T,st:'idle',t:0,f:1,seen:false},w7:false,dt:0,stopped:false,stRem:0,
    zA:[0,(w3.c0-2)*T],zB:[(w4.c1+2)*T,(wl.c0-2)*T],b1:ws[4].c0*T,b2:ws[5].c0*T,loco:wl.c0*T,end:(wl.c1+1)*T,stAnchor:(wl.c0-29)*T,panto:(w3.c0+5)*T,ladder:(w4.c1+2)*T+T/2,
    in3:[(w3.c0+1)*T,w3.c1*T],in4:[(w4.c0+1)*T,w4.c1*T],cnt:[D.counter[0]*T,(D.counter[1]+1)*T]};
  Lv.train=Tn;
  // les sièges de la voiture 3 : un tous les deux pas, tournés vers l'avant
  D.seats.forEach((k,i)=>{const x=(w3.c0+2+i*2)*T+4;const pa={x,k,cool:0,shock:0,throwT:-1,ph:R()*6};Tn.pass.push(pa);
    if(k==='bagred'){pa.act={kind:'secret',style:'sac',x:x+30,y:TRN.FLOOR,open:0,t:0,used:false,
      q:["Un sac à dos rouge, sans personne. Dedans : un pull, un livre… et de la paille d'emballage. Réquisitionnée."]};Lv.acts.push(pa.act)}});
  for(const c of D.bottles)Tn.bottles.push({x:c*T,vx:(R()-.5)*120,rot:0,k:Tn.bottles.length%2?'can':'bottle'});
  // le paquet de chips : une cachette sans paille
  Lv.acts.push({kind:'secret',style:'chips',noStraw:true,x:D.chips*T,y:10*T,open:0,t:0,used:false,
    q:["Un paquet de chips. Pas un brin de paille dedans, mais ça craque comme le pain de guerre. Je le confisque."]});
  Tn.wheels=[];for(const w of D.wagons){const a=w.c0*T,b=(w.c1+1)*T;for(const bx of[a+70,b-70])Tn.wheels.push(bx-24,bx+24)}
  Lv.avoid.push(0);
}
const trIn=(Tn,r)=>{const pcx=P.x+P.w/2;return pcx>r[0]&&pcx<r[1]&&P.y>8*T-10}
function trainOnRoof(){return P.y+P.h<=TRN.ROOF+4}
function trainZone(x){const Tn=L.train;return x<Tn.zA[1]||(x>Tn.zB[0]&&x<Tn.zB[1])}

/* ---------- à chaque image ---------- */
function trainStep(dt){
  const Tn=L.train;if(!Tn)return;const pcx=P.x+P.w/2;
  // vitesse : ralentit jusqu'à l'arrêt à l'entrée en gare
  if(Tn.w7&&!Tn.stopped){Tn.dt+=dt;const u=Math.min(1,Tn.dt/TRN.DEC);Tn.v=(1-u)*(1-u);Tn.stRem=TRN.VN*TRN.DEC/3*Math.pow(1-u,3);
    if(u>=1){Tn.stopped=true;Tn.v=0;if(!G.sim){tone(150,.9,'sawtooth',.05,140);noise(.8,500,.15,'lowpass');say("Le train s'arrête. Le clocher n'est plus très loin : je finirai à tire-d'aile.",4)}}}
  const v=Tn.v;Tn.sFar+=v*22*dt;Tn.sMid+=v*170*dt;Tn.sNear+=v*TRN.VN*dt;Tn.sBal+=v*1150*dt;
  // le train vibre, les joints des rails claquent : ta-dam… ta-dam
  if(!G.sim){G.shake=Math.max(G.shake,.7*v);Tn.clickT-=dt*v;if(Tn.clickT<=0){Tn.clickT=.62;noise(.04,900,.12*v+.02,'bandpass',0,3);noise(.04,700,.1*v+.02,'bandpass',.13,3)}
    loopSet('wind',trainOnRoof()?.15*v:.03*v)}
  // les pylônes : sur les toits 1-2 et 5-6
  const roofish=P.y<9*T&&!P.dead;
  // aucun avertissement : un pylône (ou une passerelle) toutes les 2 à 5 secondes, à intervalles irréguliers
  if(pcx>Tn.b1&&!Tn.w5){Tn.w5=true;Tn.spawnT=Math.min(Tn.spawnT,2.5)}
  if(pcx>Tn.b2+3*T&&!Tn.bridgeDone){Tn.nextKind='bridge'}
  if(!Tn.w7&&roofish&&trainZone(pcx)){Tn.spawnT-=dt;
    if(Tn.spawnT<=0){const k=Tn.nextKind;Tn.pyl.push({k,x:Math.max(cam.x+W+70,pcx+560),said:false});if(k==='bridge')Tn.bridgeDone=true;
      Tn.spawnT=2+rnd()*3;Tn.nextKind=Tn.bridgeDone&&pcx>Tn.b2&&rnd()<.45?'bridge':'pylon'}}
  for(let i=Tn.pyl.length-1;i>=0;i--){const p=Tn.pyl[i];p.x-=TRN.VN*Math.max(v,.0)*dt;
    if(!p.said&&p.x<pcx-60&&!P.dead&&!P.carried&&trainOnRoof()&&!G.sim){p.said=true;
      if(p.k==='bridge'&&!Tn.said.bridge){Tn.said.bridge=1;say("Ce n'était pas un pylône : c'était un pont ! Heureusement que j'avais les pattes à plat.",3.8)}
      else if(p.k==='pylon'&&!Tn.said.pyl){Tn.said.pyl=1;say("Un pylône ! Ils ont planté les poteaux du télégraphe au milieu de la voie.",3.4)}}
    if(p.x<cam.x-420)Tn.pyl.splice(i,1)}
  // collisions avec un pylône ou une passerelle : Raymond est emporté
  if(!P.dead&&!P.carried){const hb={x:P.x+3,y:P.y+4,w:P.w-6,h:P.h-6};
    for(const p of Tn.pyl){
      const hit=p.k==='pylon'?(hb.x+hb.w>p.x-8&&hb.x<p.x+8&&hb.y<TRN.ROOF-16&&hb.y+hb.h>TRN.ROOF-31)
        :(hb.x+hb.w>p.x-62&&hb.x<p.x+62&&hb.y<TRN.ROOF-34&&hb.y+hb.h>TRN.ROOF-120);
      if(hit){P.carried={p,dx:P.x-p.x,y:Math.min(P.y,p.k==='pylon'?TRN.ROOF-30-P.h*.4:TRN.ROOF-34-P.h+4),k:p.k==='pylon'?'pylone':'passerelle'};P.vx=P.vy=0;
        if(!G.sim){G.shake=9;noise(.2,600,.5,'lowpass');tone(220,.15,'square',.08,90)}break}}
    if(!P.carried&&hb.y<TRN.WIRE+4&&hb.y+hb.h>TRN.WIRE-4&&(trainZone(pcx)||pcx>Tn.loco))G.trainHit='elec';}
  // secousses : tout ce qui roule part du même côté
  // à chaque secousse, tout ce qui roule part du même côté, chacun avec son élan ; puis ça ralentit
  Tn.joltT-=dt;if(Tn.joltT<=0){Tn.dir*=-1;Tn.joltT=1.8+rnd()*1.8;for(const b of Tn.bottles){const dw=Tn.dir>0?Tn.in3[1]-b.x:b.x-Tn.in3[0];b.vx=clamp(b.vx*.3+Tn.dir*(70+rnd()*110)*Math.max(v,.3)*clamp(dw/(10*T),.25,1),-170,170)}
    if(!G.sim&&(trIn(Tn,Tn.in3)||trIn(Tn,Tn.in4))){G.shake=Math.max(G.shake,3.5);noise(.12,400,.35,'lowpass')}}
  const [a3,b3]=Tn.in3;
  Tn.bottles.sort((p,q)=>p.x-q.x);for(let i=0;i+1<Tn.bottles.length;i++){const p=Tn.bottles[i],q=Tn.bottles[i+1];if(q.x-p.x<26){const m=(p.x+q.x)/2;p.x=m-13;q.x=m+13;const t2=p.vx;p.vx=q.vx*.8;q.vx=t2*.8}}
  for(const b of Tn.bottles){const f=40*dt;b.vx=Math.abs(b.vx)<=f?0:b.vx-Math.sign(b.vx)*f;b.x+=b.vx*dt;b.rot+=b.vx*dt/7;
    if(b.x<a3+8){b.x=a3+8;b.vx=Math.abs(b.vx)*.5}if(b.x>b3-8){b.x=b3-8;b.vx=-Math.abs(b.vx)*.5}
    if(!P.dead&&Math.abs(b.x-pcx)<12&&P.y+P.h>TRN.FLOOR-12&&P.y<TRN.FLOOR)G.trainHit='bouteille'}
  // les voyageurs : horrifiés s'ils voient Raymond sauter devant eux
  const inside3=trIn(Tn,Tn.in3);
  for(const pa of Tn.pass){pa.cool=Math.max(0,pa.cool-dt);pa.shock=Math.max(0,pa.shock-dt);
    if(pa.k==='empty'||pa.k==='sleep'||pa.k==='bagblue'||pa.k==='bagred')continue;
    const sees=inside3&&!P.dead&&!P.onGround&&P.y+P.h<TRN.FLOOR-34&&pcx>pa.x+18&&pcx<pa.x+86;
    if(sees&&pa.cool<=0){pa.shock=1.4;pa.cool=3.2;pa.throwT=.28;if(!G.sim){bubble(pa.x+24,TRN.FLOOR-112,pick(["Aaah ! Un pigeon !","Mais c'est dégoûtant !","Au secours !","Un pigeon dans le train !","Ouste, sale bête !"]),'#2a3a5a');
      if(!Tn.said.seen){Tn.said.seen=1;setTimeout(()=>say("Ils me prennent pour un pigeon des villes. Au ras du sol, ils ne me voient pas.",3.6),900)}}}
    if(pa.throwT>=0){pa.throwT-=dt;if(pa.throwT<0){const k=pa.k==='paper'?'news':pa.k==='suit'?'ball':pa.k==='student'||pa.k==='phone'?'can':'ball';
      const x0=pa.x+30,y0=TRN.FLOOR-80,tx=P.x+P.w/2,ty=P.y+P.h/2,d=Math.hypot(tx-x0,ty-y0)||1;Tn.proj.push({x:x0,y:y0,vx:(tx-x0)/d*480,vy:(ty-y0)/d*480-160,k,rot:0,t:0});if(!G.sim)noise(.12,1800,.12,'bandpass')}}}
  for(let i=Tn.proj.length-1;i>=0;i--){const o=Tn.proj[i];o.t+=dt;
    // ils visent bien : l'objet file droit sur Raymond tant qu'il est en l'air
    if(o.t<1.4&&!P.dead){const tx=pcx-o.x,ty=P.y+P.h/2-o.y,d=Math.hypot(tx,ty)||1,k=Math.min(1,dt*7);o.vx+=(tx/d*560-o.vx)*k;o.vy+=(ty/d*560-o.vy)*k}else o.vy+=1400*dt;
    o.x+=o.vx*dt;o.y+=o.vy*dt;o.rot+=dt*9;
    if(!P.dead&&Math.abs(o.x-pcx)<13&&Math.abs(o.y-(P.y+P.h/2))<15){G.trainHit='projectile';Tn.proj.splice(i,1);continue}
    if(o.y>=TRN.FLOOR-4||o.x<a3||o.x>b3){Tn.proj.splice(i,1);if(o.x>a3&&o.x<b3)Tn.litter.push({x:o.x,k:o.k,rot:o.rot});if(!G.sim)noise(.06,2400,.06,'highpass')}}
  // la porte automatique du soufflet
  {const d=Tn.door,dx=d.c*T+T/2,near=Math.abs(pcx-dx)<95&&P.y>8*T;d.open=clamp(d.open+(near?3:-1.6)*dt,0,1);
    const want=d.open>.55;if(want&&d.shut){d.shut=false;for(let r=9;r<=11;r++)L.g[r][d.c]='.';if(!G.sim)noise(.35,900,.1,'bandpass')}
    else if(!want&&!d.shut&&!(P.x+P.w>d.c*T&&P.x<d.c*T+T)){d.shut=true;for(let r=9;r<=11;r++)L.g[r][d.c]='D'}}
  // le serveur
  {const w=Tn.waiter,[c0,c1]=Tn.cnt,in4=trIn(Tn,Tn.in4)&&!P.dead;w.t+=dt;
    // il ne remarque Raymond qu'une fois sur le comptoir
    const onBar=in4&&pcx>c0&&pcx<c1&&P.y+P.h<=TRN.FLOOR-74&&P.y+P.h>TRN.FLOOR-170;
    if(onBar&&!w.seen){w.seen=true;if(!G.sim)bubble(w.x,TRN.FLOOR-140,"Hé ! Pas d'animaux sur mon comptoir !",'#2a2420')}
    if(!in4)w.seen=false;
    const tx=clamp(pcx,c0+26,c1-26);
    if(w.st==='idle'||w.st==='cool'){if(w.seen){const d=tx-w.x;w.x+=clamp(d,-175*dt,175*dt);if(Math.abs(d)>2)w.f=Math.sign(d)}else{w.x=clamp(w.x+Math.sin(G.lt*.6)*20*dt,c0+30,c1-30);w.f=Math.sin(G.lt*.6)>0?1:-1}
      if(w.st==='cool'&&w.t>.45){w.st='idle';w.t=0}
      if(w.st==='idle'&&w.seen&&Math.abs(w.x-pcx)<40&&P.y+P.h>TRN.FLOOR-150&&P.y+P.h<=TRN.FLOOR-70){w.st='wind';w.t=0;if(!G.sim){tone(500,.06,'square',.04);if(rnd()<.5)bubble(w.x,TRN.FLOOR-150,pick(["Ouste !","Dehors !","Sale bête !"]),'#2a2420')}}}
    else if(w.st==='wind'&&w.t>.3){w.st='strike';w.t=0;if(!G.sim){noise(.1,1500,.25,'bandpass');G.shake=Math.max(G.shake,2)}}
    else if(w.st==='strike'){if(!P.dead&&Math.abs(w.x+w.f*6-pcx)<30&&P.y+P.h>TRN.FLOOR-150&&P.y+P.h<=TRN.FLOOR-74)G.trainHit='serveur';if(w.t>.15){w.st='cool';w.t=0}}}
  // la motrice : carillon, annonce, freinage
  if(!Tn.w7&&pcx>Tn.loco&&!P.dead){Tn.w7=true;Tn.dt=0;if(!G.sim){[[659,0],[523,.32],[784,.64]].forEach(([f,d])=>tone(f,.5,'sine',.09,null,d));
      setTimeout(()=>bubble(Tn.loco+17*T,TRN.ROOF-40,"« …notre train entre en gare de R… »",'#3a4a6a'),1200);
      setTimeout(()=>say("En gare de quoi ? Le vent a mangé la moitié du nom.",3.4),3400)}}
}
/* au retour sur un cartel : un court répit, pas de pylône sur le nez */
function trainRespawn(){const Tn=L.train;Tn.grace=1.8;Tn.pyl=Tn.pyl.filter(p=>Math.abs(p.x-P.x)>900);Tn.spawnT=Math.max(Tn.spawnT,2.4);Tn.proj.length=0;
  for(const b of Tn.bottles)if(Math.abs(b.x-P.x)<90)b.x=clamp(P.x+(b.x<P.x?-1:1)*140,Tn.in3[0]+10,Tn.in3[1]-10)}
function trainAfterMove(dt){
  const Tn=L.train;if(!Tn)return null;
  if(Tn.grace>0){Tn.grace-=dt;G.trainHit=null}
  if(P.carried){const c=P.carried;P.x=c.p.x+c.dx;P.y=c.y;P.vx=P.vy=0;P.sx=.7;P.sy=1.2;
    if(P.x<cam.x-70){P.carried=null;return c.k}return null}
  if(G.trainHit){const k=G.trainHit;G.trainHit=null;return k}
  if(P.y>TRN.BOT+30&&!P.dead)return'rails';
  return null;
}
function trainExitOk(){return !L.train||L.train.stopped}

/* ---------- bandes de paysage (en cache) ---------- */
const TRC={};
function trStrip(key,w,h,fn){if(TRC[key])return TRC[key];const c=mk(w,h),g=c.getContext('2d');fn(g,w,h,mulberry(key.length*97+w));TRC[key]=c;return c}
function trTile(g,img,s,y,cx){const w=img.width;let x=-((s%w)+w)%w;for(;x<W+40;x+=w)g.drawImage(img,cx+x,y)}
function trFarStrip(){return trStrip('far',2400,170,(g,w,h,R)=>{
  // la Montagne de Reims : une longue crête boisée, ses vignes, ses villages, le phare de Verzenay
  g.fillStyle='#93a8b4';g.beginPath();g.moveTo(0,h);for(let x=0;x<=w;x+=40)g.lineTo(x,70+Math.sin(x/w*Math.PI*2)*18+Math.sin(x/w*Math.PI*6)*6);g.lineTo(w,h);g.closePath();g.fill();
  g.fillStyle='#7f98a0';g.beginPath();g.moveTo(0,h);for(let x=0;x<=w;x+=30)g.lineTo(x,104+Math.sin(x/w*Math.PI*4+1)*10);g.lineTo(w,h);g.closePath();g.fill();
  g.strokeStyle='rgba(70,100,80,.35)';g.lineWidth=1;for(let x=0;x<w;x+=6){g.beginPath();g.moveTo(x,112+Math.sin(x/w*Math.PI*4+1)*10);g.lineTo(x+14,h);g.stroke()}
  for(let k=0;k<6;k++){const vx=200+k*400+R()*100,vy=108;g.fillStyle='#b7a89a';for(let j=0;j<6;j++)g.fillRect(vx+j*9,vy-4-R()*5,8,8);g.fillStyle='#9a8a80';g.fillRect(vx+22,vy-24,4,18);poly(g,[vx+20,vy-24,vx+24,vy-34,vx+28,vy-24]);g.fill()}
  {const x=1500,y=78;g.fillStyle='#d8d4c8';g.fillRect(x-3,y-34,6,34);g.fillStyle='#b44a3a';g.fillRect(x-4,y-40,8,7);g.fillStyle='#e8e2d0';g.fillRect(x-14,y-2,28,6)}
  {const x=700,y=74;g.fillStyle='#8a7e70';g.fillRect(x-4,y-14,8,14);g.strokeStyle='#8a7e70';g.lineWidth=1.5;g.beginPath();g.moveTo(x-10,y-24);g.lineTo(x+10,y-4);g.moveTo(x+10,y-24);g.lineTo(x-10,y-4);g.stroke()}
})}
function trMidStrip(){return trStrip('mid',3200,230,(g,w,h,R)=>{
  // champagne crayeuse : parcelles de vignes en rangs, craie blanche, villages, peupliers, une maison de champagne
  g.fillStyle='#c9c2a6';g.fillRect(0,40,w,h-40);
  let x=0;while(x<w){const pw=160+R()*260,k=R();
    if(k<.5){g.fillStyle='#7a9a4a';g.fillRect(x,46,pw,h-46);g.strokeStyle='#3e5a2a';g.lineWidth=2.2;for(let y=52;y<h;y+=7+((y/40)|0)){g.beginPath();g.moveTo(x,y);g.lineTo(x+pw,y+2);g.stroke()}
      g.fillStyle='#d8d0b4';for(let y=55;y<h;y+=7+((y/40)|0))g.fillRect(x,y,pw,1)}
    else if(k<.75){g.fillStyle='#e2dcc6';g.fillRect(x,46,pw,h-46);g.fillStyle='rgba(160,150,120,.3)';for(let y=60;y<h;y+=14)g.fillRect(x,y,pw,2)}
    else{g.fillStyle='#b8b06a';g.fillRect(x,46,pw,h-46);g.fillStyle='rgba(120,110,50,.3)';for(let y=56;y<h;y+=10)g.fillRect(x,y,pw,3)}
    x+=pw}
  // peupliers, villages, une route, la maison Garnier, un enjambeur dans les vignes
  for(let k=0;k<14;k++){const px=R()*w;g.fillStyle='#4a6a3a';g.beginPath();g.ellipse(px,30,7,26,0,0,7);g.fill();g.fillStyle='#3a2a1a';g.fillRect(px-1,50,2,8)}
  for(let k=0;k<4;k++){const vx=300+k*780+R()*120;for(let j=0;j<7;j++){const hx=vx+j*24,hh=18+R()*8;g.fillStyle=R()<.5?'#e8e0cc':'#d8cdb4';g.fillRect(hx,46-hh+6,22,hh);g.fillStyle=R()<.6?'#a8503a':'#5a5a62';poly(g,[hx-2,46-hh+6,hx+11,46-hh-6,hx+24,46-hh+6]);g.fill();g.fillStyle='#4a4a52';g.fillRect(hx+6,46-hh+12,4,5)}
    g.fillStyle='#d8d0bc';g.fillRect(vx+70,6,12,40);g.fillStyle='#5a5a62';poly(g,[vx+68,6,vx+76,-26,vx+84,6]);g.fill()}
  {const x=1900;g.fillStyle='#ece4d0';g.fillRect(x,8,120,40);g.fillStyle='#4a4a52';poly(g,[x-6,8,x+60,-12,x+126,8]);g.fill();for(let j=0;j<5;j++){g.fillStyle='#3a4a5a';g.fillRect(x+10+j*22,20,10,14)}
    g.fillStyle='#2a3a5a';g.fillRect(x+130,0,150,36);g.fillStyle='#e8d8a8';g.textAlign='center';{let fs=15;g.font='bold '+fs+'px '+F_DISP;while(g.measureText('CHAMPAGNE BRUNEAU & FILS').width>138){fs-=.5;g.font='bold '+fs+'px '+F_DISP}g.fillText('CHAMPAGNE BRUNEAU & FILS',x+205,18)}g.font='9px '+F_DISP;g.fillText('maison fondée en 1921',x+205,30);g.fillStyle='#3a3a3a';g.fillRect(x+150,36,3,12);g.fillRect(x+258,36,3,12)}
  {const x=2700,y=110;g.fillStyle='#c83a2a';g.fillRect(x-14,y-40,28,14);g.fillStyle='#2a2a2a';g.fillRect(x-18,y-28,4,30);g.fillRect(x+14,y-28,4,30);g.beginPath();g.arc(x-16,y+2,6,0,7);g.arc(x+16,y+2,6,0,7);g.fill();g.fillStyle='#9ac0d8';g.fillRect(x-10,y-38,10,8)}
  g.fillStyle='#8a8478';g.fillRect(0,40,w,5);
})}
function trNearStrip(){return trStrip('near',2400,190,(g,w,h,R)=>{
  // le talus qui défile : herbes, buissons, clôture, bornes kilométriques, un signal, un passage à niveau
  const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#6a8a3a');gr.addColorStop(1,'#4a6a2a');g.fillStyle=gr;g.fillRect(0,30,w,h-30);
  g.fillStyle='#5a7a30';g.beginPath();g.moveTo(0,40);for(let x=0;x<=w;x+=8)g.lineTo(x,30+Math.sin(x*.05)*4+R()*6);g.lineTo(w,h);g.lineTo(0,h);g.closePath();g.fill();
  for(let k=0;k<40;k++){const bx=R()*w,bs=12+R()*26;g.fillStyle=R()<.5?'#3e5e26':'#4e6e2e';g.beginPath();g.ellipse(bx,40,bs,bs*.7,0,Math.PI,0);g.fill()}
  for(let k=0;k<30;k++){g.fillStyle=['#e8d040','#e86a5a','#f0f0e8','#a07ad8'][k%4];g.beginPath();g.arc(R()*w,50+R()*40,2,0,7);g.fill()}
  g.fillStyle='#8a7a62';for(let x=10;x<w;x+=60){g.fillRect(x,14,4,30)}g.strokeStyle='#8a8478';g.lineWidth=1;g.beginPath();g.moveTo(0,22);g.lineTo(w,22);g.moveTo(0,32);g.lineTo(w,32);g.stroke();
  for(let k=0;k<3;k++){const x=300+k*800;g.fillStyle='#f0ece0';g.fillRect(x,18,16,22);g.fillStyle='#2a2a2a';g.font='bold 9px '+F_DISP;g.textAlign='center';g.fillText(String(138+k*3),x+8,32)}
  {const x=1250;g.fillStyle='#2a2a2e';g.fillRect(x,-40,6,84);g.fillRect(x-8,-60,22,26);g.fillStyle='#3ad070';g.beginPath();g.arc(x+3,-52,4,0,7);g.fill();g.fillStyle='#401a1a';g.beginPath();g.arc(x+3,-42,4,0,7);g.fill()}
  {const x=1850;g.fillStyle='#3a3a3a';g.fillRect(x,0,8,44);g.save();g.translate(x+4,6);g.rotate(-1.35);for(let k=0;k<6;k++){g.fillStyle=k%2?'#f0f0f0':'#d8302a';g.fillRect(k*14,-3,14,6)}g.restore();g.fillStyle='#d8302a';g.beginPath();g.arc(x+4,-6,5,0,7);g.fill()}
})}
function trBallast(){return trStrip('bal',600,100,(g,w,h,R)=>{
  g.fillStyle='#6a645a';g.fillRect(0,0,w,h);for(let k=0;k<1400;k++){g.fillStyle=['#7a7468','#5a544c','#8a8478','#4a463e'][k%4];g.fillRect(R()*w,R()*h,2+R()*3,2+R()*2)}
  for(let x=0;x<w;x+=40){g.fillStyle='#5a4a3a';g.fillRect(x+4,6,26,12);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x+4,16,26,2)}
})}
function trClouds(){return trStrip('clouds',2400,160,(g,w,h,R)=>{
  for(let k=0;k<16;k++){const cx=R()*w,cy=30+R()*90,s=20+R()*40;g.fillStyle='rgba(255,252,244,'+(.55+R()*.3)+')';for(let j=0;j<5;j++){g.beginPath();g.ellipse(cx+(j-2)*s*.6,cy+(j%2)*s*.15,s*.7,s*.42,0,0,7);g.fill()}
    g.fillStyle='rgba(200,180,170,.18)';g.beginPath();g.ellipse(cx,cy+s*.25,s*1.6,s*.18,0,0,7);g.fill()}
})}

/* ---------- dessin : derrière le train ---------- */
function drawTrainBack(t){
  const Tn=L.train;if(!Tn)return;const g=ctx,cx=cam.x,cy=cam.y,HZ=262;
  const sk=g.createLinearGradient(0,cy,0,HZ);sk.addColorStop(0,'#5f97cf');sk.addColorStop(.65,'#b4d0e6');sk.addColorStop(1,'#f4dcae');g.fillStyle=sk;g.fillRect(cx,cy,W,HZ-cy+2);
  // soleil du matin, nuages
  {const sx=cx+140,sy=cy+150;const gl=g.createRadialGradient(sx,sy,8,sx,sy,170);gl.addColorStop(0,'rgba(255,244,210,.9)');gl.addColorStop(.12,'rgba(255,236,190,.55)');gl.addColorStop(1,'rgba(255,230,180,0)');g.fillStyle=gl;g.fillRect(sx-170,sy-170,340,340)}
  trTile(g,trClouds(),Tn.sFar*.6+t*4,cy+10,cx);
  // la cathédrale à l'horizon : elle grandit à mesure qu'on avance
  {const pr=clamp(P.x/Tn.end,0,1),s=.42+pr*.38+(Tn.w7?Math.min(1,Tn.dt/TRN.DEC)*.15:0),x=cx+W*.86-pr*40,y=HZ-34;g.save();g.translate(x,y);g.scale(s,s);g.fillStyle='rgba(120,130,150,.75)';
    g.fillRect(-60,-30,120,40);g.fillRect(-56,-78,26,60);g.fillRect(30,-78,26,60);poly(g,[-60,-30,0,-60,60,-30]);g.fill();g.fillRect(-8,-50,16,30);
    g.fillStyle='rgba(150,160,180,.6)';g.beginPath();g.arc(0,-20,9,0,7);g.fill();g.fillStyle='rgba(120,130,150,.75)';for(const tx of[-43,43]){poly(g,[tx-13,-78,tx,-90,tx+13,-78]);g.fill()}g.restore()}
  trTile(g,trFarStrip(),Tn.sFar,HZ-130,cx);
  trTile(g,trMidStrip(),Tn.sMid,HZ-48,cx);
  trTile(g,trNearStrip(),Tn.sNear*.85,TRN.BOT-40,cx);
  if(Tn.w7)drawStationBack(g,Tn,t);
  // le ballast et les rails
  g.fillStyle='#4a463e';g.fillRect(cx,TRN.RAIL-8,W,cy+H-TRN.RAIL+8);
  trTile(g,trBallast(),Tn.sBal,TRN.RAIL-6,cx);
  g.fillStyle='#9aa0a8';g.fillRect(cx,TRN.RAIL-6,W,4);g.fillStyle='#5a5e66';g.fillRect(cx,TRN.RAIL-2,W,4);
  g.fillStyle='rgba(0,0,0,.35)';g.fillRect(cx,TRN.RAIL-12,W,6);
  // mâts arrière des pylônes, piles arrière des passerelles
  for(const p of Tn.pyl){if(p.x<cx-300||p.x>cx+W+300)continue;if(p.k==='pylon')drawPylonBack(g,p.x+16,cy);else drawBridgeBack(g,p.x+20,cy)}
  // le fil de contact et la caténaire, de pylône en pylône
  g.strokeStyle='rgba(40,44,50,.75)';g.lineWidth=1.4;g.beginPath();g.moveTo(cx,TRN.WIRE);g.lineTo(cx+W,TRN.WIRE);g.stroke();
  g.lineWidth=1;g.beginPath();for(let x=-((Tn.sNear%160)+160)%160;x<W;x+=160){g.moveTo(cx+x,TRN.WIRE-40+Math.abs(((x+Tn.sNear)%640)/640-.5)*20);g.lineTo(cx+x+160,TRN.WIRE-40+Math.abs(((x+160+Tn.sNear)%640)/640-.5)*20)}g.stroke();
  g.strokeStyle='rgba(40,44,50,.5)';for(let x=-((Tn.sNear%40)+40)%40;x<W;x+=40){g.beginPath();g.moveTo(cx+x,TRN.WIRE-36);g.lineTo(cx+x,TRN.WIRE);g.stroke()}
  // les roues, derrière les bogies
  const ang=Tn.sBal/16;for(const wx of Tn.wheels){if(wx<cx-40||wx>cx+W+40)continue;drawTrainWheel(g,wx,TRN.RAIL-20,ang)}
}
function drawTrainWheel(g,x,y,a){g.fillStyle='#1e2024';g.beginPath();g.arc(x,y,17,0,7);g.fill();g.fillStyle='#4a4e56';g.beginPath();g.arc(x,y,13,0,7);g.fill();
  g.strokeStyle='#2a2c30';g.lineWidth=2;for(let k=0;k<3;k++){const b=a+k*Math.PI/3;g.beginPath();g.moveTo(x+Math.cos(b)*12,y+Math.sin(b)*12);g.lineTo(x-Math.cos(b)*12,y-Math.sin(b)*12);g.stroke()}
  g.fillStyle='#8a8e96';g.beginPath();g.arc(x,y,4,0,7);g.fill()}
function drawPylonBack(g,x,cy){
  // mât en treillis vert-de-gris, derrière la voie, avec sa console
  g.fillStyle='#5a6a62';g.fillRect(x-7,30,14,TRN.RAIL-30);g.strokeStyle='#44524a';g.lineWidth=1.2;g.beginPath();for(let y=36;y<TRN.RAIL;y+=16){g.moveTo(x-7,y);g.lineTo(x+7,y+16);g.moveTo(x+7,y);g.lineTo(x-7,y+16)}g.stroke();
  g.fillStyle='#4a5852';g.fillRect(x-30,30,60,9);g.fillRect(x-12,22,24,8);
}
function drawPylonFront(g,x){
  // la console qui pend au-dessus du toit : c'est elle qui fauche les pigeons
  const R=TRN.ROOF;g.fillStyle='#5a6a62';g.fillRect(x-3,34,6,R-62);
  g.strokeStyle='#5a6a62';g.lineWidth=3;g.beginPath();g.moveTo(x,60);g.lineTo(x+26,R-40);g.stroke();
  g.fillStyle='#6a4a3a';for(let k=0;k<4;k++){g.beginPath();g.ellipse(x,R-60+k*7,7,3,0,0,7);g.fill()}
  g.fillStyle='#46524c';rr(g,x-9,R-31,18,15,3);g.fill();g.fillStyle='#d8302a';g.fillRect(x-7,R-29,14,5);g.fillStyle='#f0ece0';g.fillRect(x-7,R-24,14,5);
  g.fillStyle='rgba(255,255,255,.25)';g.fillRect(x-9,R-31,18,2);
  // le mât de devant, flou de vitesse
  const fx=x-70;g.save();g.globalAlpha=.85;const gr=g.createLinearGradient(fx-28,0,fx+28,0);gr.addColorStop(0,'rgba(40,52,46,0)');gr.addColorStop(.3,'rgba(40,52,46,.95)');gr.addColorStop(.7,'rgba(40,52,46,.95)');gr.addColorStop(1,'rgba(40,52,46,0)');
  g.fillStyle=gr;g.fillRect(fx-28,-40,56,cam.y+H+60);g.restore();
}
function drawBridgeBack(g,x,cy){
  g.fillStyle='#8a8c88';g.fillRect(x-40,TRN.ROOF-34,20,TRN.RAIL-(TRN.ROOF-34));g.fillRect(x+20,TRN.ROOF-34,20,TRN.RAIL-(TRN.ROOF-34));
  // l'escalier qui descend vers le quai d'en face
  g.fillStyle='#7a7c78';for(let k=0;k<8;k++)g.fillRect(x+40+k*12,TRN.ROOF-34+k*14,14,6);
}
function drawBridgeFront(g,x,t){
  const b=TRN.ROOF-34;
  // le tablier en béton, garde-corps en treillis, un tag, un passant qui regarde passer le train
  g.fillStyle='#9a9c96';g.fillRect(x-64,b-40,128,40);g.fillStyle='#7e807a';g.fillRect(x-64,b-6,128,6);g.fillStyle='rgba(255,255,255,.2)';g.fillRect(x-64,b-40,128,3);
  g.strokeStyle='#3e5a52';g.lineWidth=2;g.strokeRect(x-62,b-78,124,38);g.lineWidth=1.2;g.beginPath();for(let k=0;k<124;k+=12){g.moveTo(x-62+k,b-78);g.lineTo(x-50+k,b-40);g.moveTo(x-50+k,b-78);g.lineTo(x-62+k,b-40)}g.stroke();
  g.fillStyle='#c84a8a';g.font='bold 13px '+F_DISP;g.textAlign='center';g.fillText('ZÉBU',x-20,b-14);g.fillStyle='#3a8ac8';g.fillText('★',x+24,b-14);
  g.fillStyle='#2a2a30';g.fillRect(x+6,b-104,10,26);g.fillStyle='#e0c0a0';g.beginPath();g.arc(x+11,b-110,6,0,7);g.fill();g.fillStyle='#c8302a';g.fillRect(x+4,b-96,14,12);
  const fx=x-90;g.save();g.globalAlpha=.85;const gr=g.createLinearGradient(fx-30,0,fx+30,0);gr.addColorStop(0,'rgba(90,92,88,0)');gr.addColorStop(.3,'rgba(90,92,88,.95)');gr.addColorStop(.7,'rgba(90,92,88,.95)');gr.addColorStop(1,'rgba(90,92,88,0)');
  g.fillStyle=gr;g.fillRect(fx-30,b,60,cam.y+H-b+60);g.restore();
}
/* la gare : derrière le train, le bâtiment et sa marquise ; devant, le bord du quai */
function drawStationBack(g,Tn,t){
  const ox=Tn.stAnchor+Tn.stRem;if(ox>cam.x+W+200)return;
  g.fillStyle='#d8ccb0';g.fillRect(ox,150,2600,TRN.RAIL-150);
  for(let k=0;k<20;k++){const x=ox+60+k*126;g.fillStyle='#3a4a5a';g.beginPath();g.moveTo(x,TRN.RAIL-40);g.lineTo(x,230);g.arc(x+30,230,30,Math.PI,0);g.lineTo(x+60,TRN.RAIL-40);g.closePath();g.fill();g.fillStyle='rgba(255,220,150,.35)';g.fillRect(x+6,240,48,TRN.RAIL-290)}
  g.fillStyle='#b8a888';g.fillRect(ox,140,2600,14);for(let x=ox;x<ox+2600;x+=60){g.fillStyle='#c8b898';g.fillRect(x,128,30,14)}
  g.fillStyle='#4a5a6a';g.fillRect(ox-20,170,2640,14);for(let x=ox;x<ox+2600;x+=90){g.fillStyle='#3a4a58';g.fillRect(x,184,6,TRN.RAIL-184)}
  g.fillStyle='#2a3a5a';g.fillRect(ox+1500,186,180,28);g.fillStyle='#f0ead8';g.font='bold 18px '+F_DISP;g.textAlign='center';g.fillText('REIMS',ox+1590,206);
  {const x=ox+1900,y=104;g.fillStyle='#e8e0cc';g.beginPath();g.arc(x,y,24,0,7);g.fill();g.strokeStyle='#2a2a2a';g.lineWidth=2;g.stroke();g.beginPath();g.moveTo(x,y);g.lineTo(x,y-16);g.moveTo(x,y);g.lineTo(x+11,y+3);g.stroke()}
  for(let k=0;k<13;k++){const x=ox+120+k*190+(k%3)*30;g.fillStyle=['#3a4a6a','#8a3a3a','#4a6a4a'][k%3];g.fillRect(x,TRN.RAIL-60,12,30);g.fillStyle='#e0c0a0';g.beginPath();g.arc(x+6,TRN.RAIL-66,6,0,7);g.fill()}
}
function drawStationFront(g,Tn){
  const ox=Tn.stAnchor+Tn.stRem;if(ox>cam.x+W+200)return;const y=TRN.BOT+16;
  g.fillStyle='#a8a296';g.fillRect(ox,y,2700,cam.y+H-y+10);g.fillStyle='#e8d040';g.fillRect(ox,y+6,2700,5);g.fillStyle='#c8c2b4';g.fillRect(ox,y,2700,4);
  for(let x=ox+80;x<ox+2700;x+=420){g.fillStyle='#5a4a3a';g.fillRect(x,y+18,70,6);g.fillRect(x+6,y+24,4,14);g.fillRect(x+60,y+24,4,14)}
  g.fillStyle='#2a3a5a';g.fillRect(ox+1700,y-70,6,80);g.fillRect(ox+1660,y-96,90,28);g.fillStyle='#f0ead8';g.font='bold 15px '+F_DISP;g.textAlign='center';g.fillText('REIMS',ox+1705,y-77);
}

/* ---------- dessin : dans les voitures (après le train en cache) ---------- */
function drawTrainMid(t){
  const Tn=L.train;if(!Tn)return;const g=ctx,F=TRN.FLOOR,vis=(a,b)=>b>cam.x-80&&a<cam.x+W+80;
  // étincelles sur la ligne haute tension des voitures 3-4
  if(vis(Tn.in3[0],Tn.in4[1])&&(t*7|0)%5===0){const sx=Tn.in3[0]+((t*1300)%(Tn.in4[1]-Tn.in3[0]));g.strokeStyle='rgba(170,210,255,.9)';g.lineWidth=1.5;g.beginPath();g.moveTo(sx,TRN.ROOF-22);g.lineTo(sx+5,TRN.ROOF-30);g.lineTo(sx-2,TRN.ROOF-36);g.stroke()}
  if(vis(Tn.in3[0],Tn.in3[1])){
    for(const pa of Tn.pass)drawPassenger(g,pa,t);
    for(const l of Tn.litter)drawTrainLitter(g,l.x,F,l.k,l.rot);
    for(const b of Tn.bottles)drawTrainBottle(g,b.x,F,b.k,b.rot);
    for(const o of Tn.proj){g.save();g.translate(o.x,o.y);g.rotate(o.rot);drawTrainThrown(g,o.k);g.restore()}
  }
  // la porte du soufflet
  {const d=Tn.door,x=d.c*T;if(vis(x,x+T)){const o=d.open*30;g.fillStyle='#8a929a';g.fillRect(x+2,8*T+2,T-4-o,4*T-2);g.fillStyle='#3a4a5a';g.fillRect(x+6,8*T+20,Math.max(0,T-12-o),50);g.fillStyle=d.open>.5?'#3ac070':'#c8a030';g.beginPath();g.arc(x+T/2,8*T+90,3,0,7);g.fill()}}
  if(vis(Tn.in4[0],Tn.in4[1]))drawBarMid(g,Tn,t);
}
const PAX={old:{hair:'#d8d4cc',coat:'#7a5a6a',skin:'#e8c8a8'},phone:{hair:'#4a2a1a',coat:'#3a6a8a',skin:'#d8a882'},sleep:{hair:'#2a2a2a',coat:'#5a5a3a',skin:'#c89878'},
  paper:{hair:'#8a6a4a',coat:'#5a4a3a',skin:'#e0b896'},student:{hair:'#1a1a1a',coat:'#8a3a3a',skin:'#a87858'},suit:{hair:'#3a3a3a',coat:'#2a2e3a',skin:'#e8c4a0'},knit:{hair:'#b8b0a8',coat:'#4a6a5a',skin:'#ecccae'}};
function drawPassenger(g,pa,t){
  const x=pa.x,F=TRN.FLOOR,k=pa.k;
  if(k==='bagblue'||k==='bagred'){if(k==='bagred'&&pa.act&&pa.act.used){g.fillStyle='#a8302a';rr(g,x+16,F-40,30,12,4);g.fill();g.fillStyle='#d8b850';for(let j=0;j<4;j++)g.fillRect(x+22+j*5,F-44-j%2*3,1.5,6);return}
    const c=k==='bagred'?'#c8302a':'#3a5a8a',o=pa.act?pa.act.open||0:0;g.fillStyle=c;rr(g,x+14,F-62,30,30,8);g.fill();g.fillStyle=shade(c,-.25);rr(g,x+18,F-50,22,14,4);g.fill();
    g.save();g.translate(x+14,F-62);g.rotate(-o*.8);g.fillStyle=shade(c,.12);rr(g,0,0,30,10,5);g.fill();g.restore();g.strokeStyle='#1a1a1a';g.lineWidth=2;g.beginPath();g.arc(x+29,F-62,6,Math.PI,0);g.stroke();return}
  if(k==='empty')return;
  const C=PAX[k],sh=pa.shock>0,thr=pa.throwT>=0||pa.shock>1.0,br=Math.sin(t*1.5+pa.ph)*.8,sl=k==='sleep';
  // jambes
  g.fillStyle=shade(C.coat,-.35);g.fillRect(x+16,F-38,30,10);g.fillRect(x+40,F-30,9,28);g.fillStyle='#1e1e22';rr(g,x+40,F-6,16,6,2);g.fill();
  // buste
  g.fillStyle=C.coat;g.save();g.translate(x+18,F-34);g.rotate(sl?-.12:sh?-.2:-.05);rr(g,-10,-52+br,22,54,7);g.fill();
  // tête
  const hy=-64+br;g.fillStyle=C.skin;g.beginPath();g.arc(2,hy,10,0,7);g.fill();
  g.fillStyle=C.hair;if(k==='old'){g.beginPath();g.arc(0,hy-4,10,Math.PI,0);g.fill();g.fillStyle='#6a3a5a';g.fillRect(-12,hy-12,26,4);g.fillRect(-6,hy-18,14,7)}
  else if(k==='student'){g.beginPath();g.arc(1,hy-3,10.5,Math.PI*1.05,Math.PI*2.05);g.fill();g.strokeStyle='#e8e8e8';g.lineWidth=3;g.beginPath();g.arc(2,hy,12,Math.PI*1.1,Math.PI*1.9);g.stroke();g.fillStyle='#e8e8e8';g.fillRect(-11,hy-3,5,8)}
  else if(k==='phone'){g.beginPath();g.arc(0,hy-3,11,Math.PI*1.05,Math.PI*2.05);g.fill();g.fillRect(-11,hy-3,7,16)}
  else if(k==='knit'){g.beginPath();g.arc(0,hy-3,10.5,Math.PI,Math.PI*2.05);g.fill();g.beginPath();g.arc(-6,hy-10,5,0,7);g.fill()}
  else{g.beginPath();g.arc(1,hy-4,10,Math.PI*1.08,Math.PI*1.95);g.fill()}
  // visage
  if(sh){g.fillStyle='#fff';g.beginPath();g.arc(7,hy-2,3.4,0,7);g.fill();g.fillStyle='#111';g.beginPath();g.arc(8,hy-2,1.4,0,7);g.fill();g.fillStyle='#4a1a1a';g.beginPath();g.ellipse(9,hy+5,2.2,3,0,0,7);g.fill()}
  else if(sl){g.strokeStyle='#2a2020';g.lineWidth=1;g.beginPath();g.moveTo(5,hy-1);g.lineTo(10,hy-1);g.stroke();g.fillStyle='#4a1a1a';g.beginPath();g.arc(9,hy+5,1.6,0,7);g.fill()}
  else{g.fillStyle='#111';g.beginPath();g.arc(8,hy-1,1.3,0,7);g.fill()}
  g.restore();
  // bras et ce qu'ils tiennent
  const hx=x+40,hyy=F-62+br;
  if(thr){g.strokeStyle=C.coat;g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(x+20,F-76);g.lineTo(x+12,F-104);g.stroke();g.lineCap='butt'}
  else if(k==='paper'){g.fillStyle='#ece8dc';g.fillRect(hx-6,hyy-30,26,34);g.fillStyle='rgba(40,40,40,.4)';for(let j=0;j<6;j++)g.fillRect(hx-3,hyy-26+j*5,20,1.5);g.fillStyle='#2a2a2a';g.font='bold 5px '+F_DISP;g.textAlign='left';g.fillText("L'UNION",hx-3,hyy-31)}
  else if(k==='phone'||k==='student'||k==='suit'){g.strokeStyle=C.coat;g.lineWidth=6;g.lineCap='round';g.beginPath();g.moveTo(x+20,F-74);g.lineTo(hx,hyy);g.stroke();g.lineCap='butt';
    if(k==='suit'){g.fillStyle='#4a4e56';g.fillRect(hx-6,hyy-2,26,3);g.save();g.translate(hx-4,hyy-2);g.rotate(-1.2);g.fillStyle='#9ab8d8';g.fillRect(0,0,22,2);g.fillStyle='#2a2e36';g.fillRect(0,-1,22,1);g.restore()}
    else{g.fillStyle='#1a1a1e';rr(g,hx-2,hyy-10,7,12,2);g.fill();g.fillStyle='rgba(150,200,255,.8)';g.fillRect(hx-1,hyy-9,5,9);const gl=g.createRadialGradient(hx,hyy-6,1,hx,hyy-6,22);gl.addColorStop(0,'rgba(150,200,255,.25)');gl.addColorStop(1,'rgba(150,200,255,0)');g.fillStyle=gl;g.fillRect(hx-22,hyy-28,44,44)}}
  else if(k==='knit'){g.strokeStyle=C.coat;g.lineWidth=6;g.lineCap='round';g.beginPath();g.moveTo(x+20,F-74);g.lineTo(hx,hyy+4);g.stroke();g.lineCap='butt';g.fillStyle='#c84a6a';g.beginPath();g.ellipse(hx+2,hyy+8,9,6,0,0,7);g.fill();
    g.strokeStyle='#d8c8a0';g.lineWidth=1.5;const s=Math.sin(t*6+pa.ph)*3;g.beginPath();g.moveTo(hx-6,hyy-6+s);g.lineTo(hx+10,hyy+10);g.moveTo(hx+8,hyy-6-s);g.lineTo(hx-4,hyy+10);g.stroke()}
  else if(k==='old'){g.fillStyle='#4a3a2a';rr(g,hx-10,hyy+6,20,14,3);g.fill()}
  if(sl&&((t+pa.ph)%3)<2){g.fillStyle='rgba(60,60,80,.6)';g.font='italic 11px '+F_BODY;g.textAlign='left';g.fillText('z',x+28,F-106-((t+pa.ph)%3)*6)}
}
function drawTrainBottle(g,x,F,k,rot){g.save();g.translate(x,F-6);g.rotate(rot);if(k==='can'){g.fillStyle='#c8302a';rr(g,-8,-5,16,10,3);g.fill();g.fillStyle='#d8d8d8';g.fillRect(-8,-5,2,10);g.fillRect(6,-5,2,10);g.fillStyle='#f0e8d0';g.fillRect(-3,-2,6,4)}
  else{g.fillStyle='rgba(90,150,110,.85)';rr(g,-11,-5,16,10,4);g.fill();g.fillRect(4,-2.5,8,5);g.fillStyle='#e8e4d8';g.fillRect(-6,-4,7,8);g.fillStyle='rgba(255,255,255,.4)';g.fillRect(-10,-4,14,2)}g.restore()}
function drawTrainThrown(g,k){if(k==='can'){g.fillStyle='#3a6ac8';rr(g,-5,-8,10,16,3);g.fill();g.fillStyle='#d8d8d8';g.fillRect(-5,-8,10,2)}
  else if(k==='news'){g.fillStyle='#ece8dc';g.fillRect(-10,-7,20,14);g.fillStyle='rgba(40,40,40,.4)';for(let j=0;j<3;j++)g.fillRect(-8,-4+j*4,16,1.5)}
  else{g.fillStyle='#f0ece0';g.beginPath();g.arc(0,0,6,0,7);g.fill();g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=.8;g.beginPath();g.moveTo(-4,-2);g.lineTo(2,3);g.moveTo(-1,-5);g.lineTo(3,-1);g.stroke()}}
function drawTrainLitter(g,x,F,k,rot){g.save();g.translate(x,F-2);if(k==='news'){g.fillStyle='#e0dccf';poly(g,[-12,0,-2,-6,12,-1,4,0]);g.fill()}else{g.fillStyle='#e8e4d8';g.beginPath();g.arc(0,-4,5,0,7);g.fill()}g.restore()}
/* la voiture-bar : le serveur derrière son comptoir, puis la façade du comptoir, puis les chips */
function drawBarMid(g,Tn,t){
  const F=TRN.FLOOR,[c0,c1]=Tn.cnt,w=Tn.waiter,top=10*T,x0=Tn.in4[0]-T;
  // des voyageurs debout qui mangent aux tables hautes
  [[x0+150,-1,'#5a3a4a','#e8c8a8',0],[x0+122,1,'#2a4a6a','#c89878',1],[x0+330,-1,'#4a5a3a','#e0b896',2]].forEach(([tx,f,coat,skin,i])=>{const x=tx+f*-30,b=Math.sin(t*1.4+i)*1;
    g.fillStyle='#24262c';g.fillRect(x-7,F-52,6,52);g.fillRect(x+1,F-52,6,52);g.fillStyle=coat;rr(g,x-12,F-108+b,24,58,8);g.fill();
    g.fillStyle=skin;g.beginPath();g.arc(x,F-118+b,10,0,7);g.fill();g.fillStyle=['#3a2a1a','#1a1a1a','#8a6a4a'][i];g.beginPath();g.arc(x,F-122+b,10,Math.PI,0);g.fill();
    const bite=((t*.7+i*.4)%2)<.4;g.strokeStyle=coat;g.lineWidth=6;g.lineCap='round';g.beginPath();g.moveTo(x-f*2,F-96);g.lineTo(x-f*14,bite?F-114:F-84);g.stroke();g.lineCap='butt';
    if(i===1){g.fillStyle='#f0ece4';g.fillRect(x-f*14-3,(bite?F-120:F-90),7,8)}else{g.fillStyle='#d8a860';rr(g,x-f*14-8,(bite?F-118:F-88),16,7,3);g.fill();g.fillStyle='#e8d8b0';g.fillRect(x-f*14-6,(bite?F-116:F-86),12,2)}
    if(bite){g.fillStyle='#111';g.fillRect(x-f*6-1,F-114+b,3,2)}});
  {const x=w.x,y=F,f=w.f;g.save();g.translate(x,y);
    g.fillStyle='#1e1e22';g.fillRect(-10,-62,8,62);g.fillRect(2,-62,8,62);g.fillStyle='#f4f2ec';rr(g,-14,-118,28,58,8);g.fill();g.fillStyle='#2a2a2e';g.fillRect(-14,-104,28,40);g.fillStyle='#f4f2ec';poly(g,[-6,-118,0,-104,6,-118]);g.fill();
    g.fillStyle='#e8eae4';g.fillRect(-15,-70,30,32);g.fillStyle='#e8c4a0';g.beginPath();g.arc(0,-130,12,0,7);g.fill();g.fillStyle='#2a1a12';g.beginPath();g.arc(0,-134,12,Math.PI*1.05,Math.PI*1.95);g.fill();
    g.fillStyle='#2a1a12';g.fillRect(f*2-6,-125,12,3);g.fillStyle='#111';g.beginPath();g.arc(f*6,-132,1.5,0,7);g.fill();
    const up=w.st==='wind'?Math.min(1,w.t/.22):w.st==='strike'?-.3:0;
    g.strokeStyle='#f4f2ec';g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(f*10,-110);const hx=f*(18-up*6),hy=-90-up*46+(w.st==='strike'?34:0);g.lineTo(hx,hy);g.stroke();g.lineCap='butt';
    g.fillStyle='#f0f0ea';g.save();g.translate(hx,hy);g.rotate(f*(.4+up));g.fillRect(-3,0,10,26);g.fillStyle='#c8302a';g.fillRect(-3,8,10,3);g.restore();
    g.restore()}
  // la façade du comptoir
  g.fillStyle='#6a4a32';g.fillRect(c0,top,c1-c0,F-top);g.fillStyle='#8a6a48';for(let x=c0+8;x<c1;x+=40)g.fillRect(x,top+12,32,F-top-24);g.fillStyle='#b8bcc2';g.fillRect(c0-4,top-4,c1-c0+8,6);g.fillStyle='rgba(255,255,255,.4)';g.fillRect(c0-4,top-4,c1-c0+8,1.5);
  g.fillStyle='#2a2a2e';g.fillRect(c0+6,F-8,c1-c0-12,8);
  // les chips, le terminal de paiement, les gobelets
  const ch=L.acts.find(a=>a.style==='chips');if(ch){const x=ch.x,o=ch.used?1:ch.open||0;g.fillStyle='#8a8e96';g.fillRect(x-22,top-34,44,3);g.fillRect(x-22,top-34,2,34);g.fillRect(x+20,top-34,2,34);
    const cols=['#e8b828','#c8302a','#3a7ac8','#e8b828'];for(let k=0;k<4;k++){if(k===1&&ch.used)continue;g.fillStyle=cols[k];g.save();g.translate(x-16+k*11,top-30+(k===1?-o*6:0));rr(g,0,0,10,16,2);g.fill();g.fillStyle='rgba(255,255,255,.6)';g.fillRect(2,4,6,4);g.restore()}}
  g.fillStyle='#2a2a2e';rr(g,c0+40,top-16,14,16,2);g.fill();g.fillStyle='#6ac0a0';g.fillRect(c0+42,top-14,10,5);
  for(let k=0;k<3;k++){g.fillStyle='#f0ece4';poly(g,[c1-60+k*12,top,c1-58+k*12,top-12,c1-50+k*12,top-12,c1-48+k*12,top]);g.fill()}
}

/* ---------- dessin : au premier plan ---------- */
function drawTrainFront(t){
  const Tn=L.train;if(!Tn)return;const g=ctx;
  for(const p of Tn.pyl){if(p.x<cam.x-300||p.x>cam.x+W+300)continue;if(p.k==='pylon')drawPylonFront(g,p.x);else drawBridgeFront(g,p.x,t)}
  if(Tn.w7)drawStationFront(g,Tn);
  // traînées de vent au-dessus des toits
  if(Tn.v>.2){g.strokeStyle='rgba(255,255,255,'+(.3*Tn.v)+')';g.lineWidth=1;for(let k=0;k<9;k++){const x=cam.x+((k*233-t*900*Tn.v)%(W+200)+W+200)%(W+200)-100,y=60+((k*61)%200);g.beginPath();g.moveTo(x,y);g.lineTo(x+70,y);g.stroke()}}
  // l'annonce : un pylône (ou autre chose) arrive
  if(false){const a=.6+.4*Math.sin(t*16),x=cam.x+W-46,y=TRN.ROOF-70;g.save();g.globalAlpha=a;g.fillStyle='#f0e6c8';rr(g,x-20,y-24,40,48,6);g.fill();g.strokeStyle='#a8322d';g.lineWidth=2.5;rr(g,x-20,y-24,40,48,6);g.stroke();
    g.fillStyle='#3a4a42';g.fillRect(x-2,y-16,4,28);g.fillRect(x-10,y-16,20,4);g.fillStyle='#a8322d';g.font='bold 16px '+F_DISP;g.textAlign='center';g.fillText('!',x+11,y+16);
    g.fillStyle='rgba(168,50,45,.9)';poly(g,[x-28,y-6,x-36,y,x-28,y+6]);g.fill();g.restore()}
}

/* ---------- le train en cache : caisses, toits, voitures en coupe ---------- */
function trainBuildTiles(Lv){
  const D=Lv.def.train,wpx=Lv.wpx+40,hpx=ROWS*T+PAD,TR=Math.min(RS,1.5),{layer:c,g}=mkLayer(wpx*TR,hpx*TR);g.scale(TR,TR);c.rs=TR;g.translate(0,PAD);
  const R=mulberry(Lv.def.seed+11),L0=Lv;
  for(const w of D.wagons)drawWagon(g,w,R,L0);
  // attelages, soufflets et échelle
  const ks=D.wagons.map(w=>w.k);for(const w of D.wagons){const x=(w.c1+1)*T;if(w.k==='loco')continue;const nx=ks[w.n]||'';
    g.fillStyle='#2a2c30';g.fillRect(x-4,TRN.FLOOR+10,88,10);g.fillStyle='#4a4e56';g.fillRect(x+30,TRN.FLOOR+6,20,18);
    if(nx==='seats'||w.k==='bar'){g.fillStyle='#5a5e66';g.fillRect(x,TRN.FLOOR,80,8);g.fillStyle='rgba(255,255,255,.2)';g.fillRect(x,TRN.FLOOR,80,1.5);g.fillStyle='rgba(0,0,0,.3)';for(let k=4;k<80;k+=8)g.fillRect(x+k,TRN.FLOOR+2,4,3)}
    if(w.k!=='seats'){// le soufflet en accordéon
      g.fillStyle='#34363b';rr(g,x+10,8*T+20,60,TRN.FLOOR-8*T-16,10);g.fill();g.strokeStyle='#4c4f56';g.lineWidth=3;for(let k=0;k<6;k++){g.beginPath();g.moveTo(x+16+k*9.5,8*T+24);g.lineTo(x+16+k*9.5,TRN.FLOOR);g.stroke()}
      g.fillStyle='rgba(0,0,0,.3)';g.fillRect(x+10,TRN.FLOOR-6,60,6)}}
  {const x=Lv.train.ladder;g.fillStyle='#e0b020';g.fillRect(x-14,8*T-4,3,TRN.FLOOR-8*T+4);g.fillRect(x+11,8*T-4,3,TRN.FLOOR-8*T+4);for(let r=8;r<=11;r++)g.fillRect(x-14,r*T,28,4)}
  // climatiseurs et ligne haute tension sur les toits
  for(let r=0;r<ROWS;r++)for(let cc=0;cc<Lv.w;cc++){const ch=Lv.g[r][cc],x=cc*T,y=r*T;
    if(ch==='X'){g.fillStyle='#b8bcc2';rr(g,x+1,y+12,T-2,T-12,4);g.fill();g.fillStyle='#8a8e96';for(let k=0;k<5;k++)g.fillRect(x+6,y+18+k*4,T-12,2);g.fillStyle='rgba(255,255,255,.4)';g.fillRect(x+2,y+12,T-4,2)}
    if(ch==='^'){g.fillStyle='#6a4a3a';for(let k=0;k<3;k++){g.beginPath();g.ellipse(x+20,y+T-6-k*5,6,2.4,0,0,7);g.fill()}g.fillStyle='#8a8e96';g.fillRect(x+18,y+T-22,4,6);g.fillStyle='#c8a030';g.fillRect(x,y+T-24,T,3)}}
  {// le pantographe de la voiture 3
    const x=Lv.train.panto,y=TRN.ROOF-6;g.strokeStyle='#3a3e44';g.lineWidth=3;g.beginPath();g.moveTo(x,y);g.lineTo(x+40,y-80);g.lineTo(x+10,TRN.WIRE+4);g.moveTo(x+70,y);g.lineTo(x+40,y-80);g.stroke();g.fillStyle='#3a3e44';g.fillRect(x-10,TRN.WIRE+2,46,4);g.fillStyle='#6a4a3a';g.fillRect(x-6,y-6,82,6)}
  return c;
}
function drawWagon(g,w,R,Lv){
  const x0=w.c0*T,x1=(w.c1+1)*T,top=TRN.ROOF,F=TRN.FLOOR,bot=TRN.BOT,L=TR_LIV;
  // châssis et bogies
  g.fillStyle=L.under;g.fillRect(x0+20,bot,x1-x0-40,22);for(let x=x0+150;x<x1-150;x+=90+R()*40){g.fillStyle='#3a3c42';g.fillRect(x,bot+4,50+R()*30,26)}
  for(const bx of[x0+70,x1-70]){g.fillStyle='#24262a';g.fillRect(bx-44,bot+12,88,16);g.fillStyle='#3a3e44';for(const s of[-24,24]){g.fillRect(bx+s-7,bot+20,14,24)}g.strokeStyle='#5a5e66';g.lineWidth=3;for(const s of[-12,12]){g.beginPath();for(let k=0;k<4;k++)g.ellipse(bx+s,bot+14+k*3,6,1.6,0,0,7);g.stroke()}}
  if(w.k==='ext'||w.k==='loco'){
    const xe=w.k==='loco'?x1-2*T:x1;
    // la caisse
    g.fillStyle=L.body;rr(g,x0,top,xe-x0,bot-top+6,10);g.fill();
    if(w.k==='loco'){g.fillStyle=L.body;g.beginPath();g.moveTo(xe-12,top);g.quadraticCurveTo(x1+6,top+20,x1+10,bot-30);g.lineTo(x1+14,bot+6);g.lineTo(xe-12,bot+6);g.closePath();g.fill();
      g.fillStyle=L.glass;g.beginPath();g.moveTo(xe+4,top+14);g.quadraticCurveTo(x1-6,top+26,x1+2,top+86);g.lineTo(xe+4,top+86);g.closePath();g.fill();
      g.fillStyle='rgba(255,255,255,.25)';poly(g,[xe+10,top+20,xe+24,top+20,xe+12,top+80,xe+6,top+80]);g.fill();
      g.fillStyle='#2a2a30';g.beginPath();g.arc(xe+30,top+66,9,0,7);g.fill();g.fillStyle='#e0c0a0';g.beginPath();g.arc(xe+30,top+56,6,0,7);g.fill();g.fillStyle='#2a3a5a';g.fillRect(xe+23,top+48,14,4);
      g.fillStyle='#fff6d0';g.beginPath();g.ellipse(x1+4,bot-24,6,5,0,0,7);g.fill();g.fillStyle=L.red;g.fillRect(xe-12,bot-14,x1-xe+24,10)}
    g.fillStyle=L.roof;g.fillRect(x0+4,top,xe-x0-8,12);g.fillStyle=L.roof2;g.fillRect(x0+4,top+10,xe-x0-8,3);g.fillStyle='rgba(255,255,255,.35)';g.fillRect(x0+6,top,xe-x0-12,2);
    g.fillStyle=L.band;g.fillRect(x0,top+36,xe-x0,82);g.fillStyle=L.band2;g.fillRect(x0,top+112,xe-x0,6);g.fillStyle=L.red;g.fillRect(x0,bot-30,xe-x0,8);
    // fenêtres : on voit le paysage à travers, des voyageurs en ombre
    for(let x=x0+70;x<xe-100;x+=74){g.save();g.globalCompositeOperation='destination-out';rr(g,x,top+46,56,58,8);g.fill();g.restore();
      g.fillStyle='rgba(26,40,64,.55)';rr(g,x,top+46,56,58,8);g.fill();g.fillStyle='rgba(255,255,255,.18)';poly(g,[x+8,top+46,x+22,top+46,x+6,top+104,x,top+104]);g.fill();
      if(R()<.55){g.fillStyle='rgba(10,14,24,.75)';g.beginPath();g.arc(x+20+R()*16,top+76,9,0,7);g.fill();g.fillRect(x+10+R()*10,top+86,24,18)}}
    // portes
    for(const dx of[x0+18,xe-62]){if(w.k==='loco'&&dx!==x0+18)continue;g.fillStyle=L.red;g.fillRect(dx,top+30,44,bot-top-30);g.fillStyle='rgba(0,0,0,.35)';g.fillRect(dx+21,top+30,2,bot-top-30);
      g.save();g.globalCompositeOperation='destination-out';g.fillRect(dx+6,top+44,13,44);g.fillRect(dx+25,top+44,13,44);g.restore();g.fillStyle='rgba(26,40,64,.55)';g.fillRect(dx+6,top+44,13,44);g.fillRect(dx+25,top+44,13,44);
      g.fillStyle='#e8c020';g.fillRect(dx-5,top+60,3,70);g.fillRect(dx+46,top+60,3,70);g.fillStyle='#3ac070';g.beginPath();g.arc(dx+22,top+120,3,0,7);g.fill()}
    g.fillStyle='#2a3a5a';g.font='bold 12px '+F_DISP;g.textAlign='left';g.fillText(String(w.n),x0+80,bot-40);g.font='8px '+F_DISP;g.fillText('TER · 2e classe',x0+96,bot-41);
    if(w.n===9){g.fillStyle='#d84a8a';g.font='bold 22px '+F_DISP;g.save();g.translate(x0+500,bot-50);g.rotate(-.08);g.fillText('ZÉBU',0,0);g.restore()}
    g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x0,bot,xe-x0,4);
    return}
  // voitures en coupe : on voit l'intérieur
  const inner=w.k==='bar'?'#e6dccb':'#dfe2e4';
  g.fillStyle=inner;g.fillRect(x0,top+40,x1-x0,F-top-40);
  g.fillStyle=w.k==='bar'?'#7a5236':'#9aa4ae';g.fillRect(x0,F-30,x1-x0,30);   // bas de paroi
  for(let x=x0+48;x<x1-60;x+=80){g.save();g.globalCompositeOperation='destination-out';rr(g,x,top+62,58,62,9);g.fill();g.restore();g.strokeStyle='#8a9098';g.lineWidth=4;rr(g,x,top+62,58,62,9);g.stroke();g.fillStyle='rgba(180,210,230,.12)';rr(g,x,top+62,58,62,9);g.fill()}
  // coupe du toit et du plancher (hachures papier)
  for(const[y0,h]of[[top,40],[F,bot-F]]){g.fillStyle=L.body;g.fillRect(x0,y0,x1-x0,h);g.fillStyle='#c8c2b2';g.fillRect(x0,y0+6,x1-x0,h-12);g.strokeStyle='rgba(120,110,90,.5)';g.lineWidth=1;g.beginPath();for(let x=x0;x<x1;x+=8){g.moveTo(x,y0+h-6);g.lineTo(x+8,y0+6)}g.stroke()}
  g.fillStyle=L.roof;g.fillRect(x0,top,x1-x0,5);g.fillStyle=L.red;g.fillRect(x0,bot-10,x1-x0,6);
  // éclairage au plafond, porte-bagages
  for(let x=x0+30;x<x1-30;x+=120){g.fillStyle='#fffbe8';g.fillRect(x,top+40,70,4);g.fillStyle='rgba(255,250,220,.15)';g.fillRect(x-10,top+44,90,30)}
  if(w.k==='seats'){g.fillStyle='#9aa0a8';g.fillRect(x0+20,top+52,x1-x0-40,4);for(let x=x0+40;x<x1;x+=60)g.fillRect(x,top+44,3,12);
    g.fillStyle='#5a6a7a';rr(g,x0+300,top+36,60,16,3);g.fill();g.fillStyle='#8a5a3a';rr(g,x0+760,top+34,46,18,3);g.fill();
    // un pictogramme « défense de fumer », le marteau brise-vitre
    g.fillStyle='#fff';g.beginPath();g.arc(x0+30,top+80,10,0,7);g.fill();g.strokeStyle='#c8302a';g.lineWidth=2;g.stroke();g.beginPath();g.moveTo(x0+23,top+73);g.lineTo(x0+37,top+87);g.stroke();g.fillStyle='#2a2a2a';g.fillRect(x0+24,top+79,12,3);
    g.fillStyle='#c8302a';g.fillRect(x1-30,top+70,10,22);g.fillStyle='#2a2a2a';g.fillRect(x1-28,top+74,6,8);
    // les sièges : dos, appui-tête, assise, pied
    for(let i=0;i<D_SEATS(Lv);i++){const x=(w.c0+2+i*2)*T+4;g.fillStyle='#2e4a7a';rr(g,x-4,F-86,14,66,5);g.fill();g.fillStyle='#f0ece4';rr(g,x-4,F-90,14,16,4);g.fill();
      g.fillStyle='#355489';rr(g,x+4,F-36,44,11,4);g.fill();g.fillStyle='rgba(255,255,255,.12)';for(let k=0;k<5;k++)g.fillRect(x+8+k*8,F-34,3,3);g.fillStyle='#3a3e44';g.fillRect(x+18,F-25,10,25);g.fillRect(x+10,F-3,26,3);
      g.fillStyle='#4a5a6a';g.fillRect(x+30,F-50,16,4)}}
  else{// la voiture-bar : étagères, machine à café, ardoise, sticker
    const bx=Lv.def.train.counter[0]*T;g.fillStyle='#5a3e2a';for(const y of[top+70,top+100])g.fillRect(bx,y,12*T,5);
    for(let k=0;k<20;k++){const x=bx+10+k*23;g.fillStyle=['#5a8a5a','#c8302a','#e8b828','#3a6ac8','#8a2a4a'][k%5];rr(g,x,top+50+(k%2)*30,9,20,3);g.fill();g.fillRect(x+3,top+46+(k%2)*30,3,5)}
    g.fillStyle='#2a2a2e';rr(g,bx+200,top+104,60,52,4);g.fill();g.fillStyle='#8a8e96';g.fillRect(bx+210,top+112,40,10);g.fillStyle='#c83a2a';g.beginPath();g.arc(bx+230,top+136,4,0,7);g.fill();
    g.fillStyle='#2a2e2a';g.fillRect(x0+60,top+52,170,70);g.strokeStyle='#8a6a48';g.lineWidth=3;g.strokeRect(x0+60,top+52,170,70);
    g.fillStyle='#f0ece0';g.font='bold 12px '+F_DISP;g.textAlign='center';g.fillText('VOITURE-BAR',x0+145,top+70);g.font='italic 9px '+F_BODY;
    ['Café ............ 9,20 €','Croissant ...... 7,60 €','Chips .......... 10,00 €','Jambon-beurre . 23,60 €'].forEach((s,i)=>g.fillText(s,x0+145,top+84+i*10));
    g.fillStyle='#fff';g.beginPath();g.arc(bx-24,top+86,11,0,7);g.fill();g.strokeStyle='#c8302a';g.lineWidth=2;g.stroke();g.fillStyle='#2a2a2a';g.fillRect(bx-31,top+84,12,5);g.fillRect(bx-31,top+89,2,4);g.fillRect(bx-21,top+89,2,4);g.beginPath();g.arc(bx-19,top+83,2.5,0,7);g.fill();
    g.strokeStyle='#c8302a';g.beginPath();g.moveTo(bx-32,top+78);g.lineTo(bx-16,top+94);g.stroke();
    // tables hautes et tabourets
    for(const tx of[x0+150,x0+330]){g.fillStyle='#8a8e96';g.fillRect(tx-2,F-70,4,70);g.fillRect(tx-14,F-3,28,3);g.fillStyle='#b8885a';rr(g,tx-30,F-76,60,7,3);g.fill();
      g.fillStyle='#f0ece4';poly(g,[tx-14,F-76,tx-12,F-86,tx-6,F-86,tx-4,F-76]);g.fill();for(const sx of[tx-46,tx+46]){g.fillStyle='#3a3e44';g.fillRect(sx-1,F-44,3,44);g.fillStyle='#c8302a';rr(g,sx-10,F-48,22,6,3);g.fill()}}
    g.fillStyle='#5a3a26';g.fillRect(bx,F-94,12*T,4)}
  // parois d'extrémité (avec leur porte ouverte)
  for(const[x,side]of[[x0,1],[x1-T,-1]]){g.fillStyle='#b8bcc2';g.fillRect(side>0?x:x+T-10,top+40,10,40);g.fillStyle='rgba(0,0,0,.15)';g.fillRect(side>0?x+8:x+T-10,top+80,2,F-top-80)}
}
function D_SEATS(Lv){return Lv.def.train.seats.length}
