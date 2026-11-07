/* =========================================================
   6-1 (provisoire) · LE MARCHÉ — Raymond vu de face, en selfie
   ---------------------------------------------------------
   Une caméra « go-pro » posée devant Raymond, à hauteur de pigeon, qui recule avec lui :
   il court vers nous, le décor défile. Gauche / droite pour se placer, saut (et un battement d'ailes en l'air).
   Les obstacles arrivent depuis la caméra et filent vers lui.
     · le marché : chalets (churros, charcuterie, bijoux…), jambes des passants (entre lesquelles on se faufile),
       gens qui traversent ou qui viennent en face, le chien qui aboie (on saute par-dessus), un landau ;
     · le comptoir de la charcuterie : la caisse empilée bouche le passage, on saute sur le comptoir ;
       la main du charcutier balaie le comptoir d'avant en arrière : on saute par-dessus ;
     · le manège : il tourne à l'envers, on avance moins vite ; poteaux et chevaux qui montent et descendent ;
     · les bancs, les gens assis (on saute par-dessus leurs pieds), un gamin qui court ;
     · la fontaine : la margelle, la vasque, et tout en haut, en sécurité.
   Coordonnées : x latéral (m), y hauteur (m), z le long de la rue (m), vers la caméra.
   ========================================================= */
let RN=null;
const RNF=2050,RNCD=5.2,RNHZ=232,RNV=4,RNX=.9,RNG=9.6,RNJ=3.3,RNFL=2.7,RNCAR=[63.5,88],RNCARV=2.2;
const RNCP=[0,39,61.5,90,117];
function runnerActive(){return L&&L.def&&L.def.runner&&RN}
function rnPing(u){u=((u%2)+2)%2;return u>1?2-u:u}
/* ---------- le parcours ---------- */
function rnBuild(){
  const O=[],R=mulberry(611);
  const legs=(x,z,o)=>O.push(Object.assign({k:'legs',x,z,x0:x,z0:z,mode:'stand',ph:R()*6,kid:false,col:pick2(R,['#2a4a7a','#1a1a22','#c8b48a','#6a2a2a','#4a5a3a','#3a3a48']),
    skirt:R()<.3?pick2(R,['#a8322d','#2a5a8a','#e0b030','#5a3a6a']):null,shoe:pick2(R,['#f2f0ea','#3a2a1a','#1a1a1a','#8a2a2a'])},o||{}));
  const box=(x0,x1,z0,z1,h,kind,draw,o)=>O.push(Object.assign({k:'box',x0,x1,z0,z1,h,kind,draw},o||{}));
  // le marché
  box(-.42,-.02,8,8.45,.32,'caisse','crate');
  legs(.22,12);legs(-.6,13.2);
  legs(-1.2,16.5,{mode:'cross',xa:-1.15,xb:1.15,sp:.32});
  legs(-.6,20.5);legs(0,20.6);legs(.6,20.4);
  legs(-.2,34,{mode:'toward',v:1.1});
  O.push({k:'dog',x0:-.35,x1:.35,z:31,h:.36,bark:0,said:false,xa:-.55,xb:.55,len:.7});
  box(.15,.55,36.5,37.2,.5,'landau','pram');legs(.35,36.2,{col:'#1a1a22'});
  legs(-.45,38.5,{mode:'cross',xa:-.9,xb:.2,sp:.45});
  // le comptoir de la charcuterie, et le mur de caisses qui bouche le reste de la rue
  box(-.95,.15,42,54,.75,'comptoir','counter');
  box(.15,1.0,41,55,1.05,'caisse','crates');
  O.push({k:'hand',x0:-.95,x1:.15,za:44.6,zb:51.4,per:1.7,y:.76});
  legs(-.1,57.5);legs(.55,58.6,{mode:'cross',xa:.6,xb:-.7,sp:.4});
  // le manège (il tourne à l'envers)
  box(-1.25,1.25,RNCAR[0],RNCAR[1],.14,null,'carousel',{plat:true});
  [-.5,.32,-.08,.58,-.62,.12].forEach((x,i)=>O.push({k:'horse',x,base:RNCAR[0]+2+i*4,ph:i*1.3,col:['#f2ead8','#3a2a1a','#c8a060','#f2ead8','#8a5a3a','#e0d0b0'][i]}));
  // les bancs, les gens assis, un gamin
  for(const[s,z]of[[-1,93],[1,97],[-1,101],[1,106],[-1,111]]){O.push({k:'bench',side:s,z});O.push({k:'seated',x:s*.84,z:z+.6,col:pick2(R,['#2a4a7a','#1a1a22','#6a2a2a','#c8b48a'])})}
  legs(.1,95.5,{mode:'cross',xa:-.8,xb:.8,sp:.5});
  legs(-.3,112,{mode:'toward',v:2.4,kid:true,col:'#2a6aa8',shoe:'#e0302a'});
  legs(.45,104);legs(-.35,108.5,{mode:'cross',xa:-.7,xb:.7,sp:.6});
  // la fontaine
  box(-1.3,1.3,119.7,120.0,.45,'fontaine','rim');
  O.push({k:'water',z0:120,z1:124.4});
  box(-.15,.95,121.3,122.9,1.0,'fontaine','tier');
  box(.12,.68,121.75,122.8,1.42,'fontaine','top',{goal:true});
  box(-1.3,1.3,124.4,124.7,.45,'fontaine','rim');
  // la paille
  for(const[x,y,z]of[[0,.1,5],[-.6,.1,10],[.5,.1,14],[0,.55,18],[-.3,.1,24],[.3,.1,27],[-.1,.6,31],[.6,.1,34],[-.4,.95,44],[-.4,.95,47.5],[-.4,.95,51],[.3,.1,58],
    [-.2,.3,67],[.4,.3,71],[-.5,.3,75],[0,.75,79],[.5,.3,83],[-.3,.1,94],[.4,.6,98],[0,.1,103],[-.5,.6,107],[.2,.1,114],[.4,1.2,121.6],[.4,1.7,122.3]])O.push({k:'corn',x,y,z,got:false});
  // le décor : chalets, guirlandes, réverbères, arbres
  const D=[];const names=['CHURROS','BIJOUX','FROMAGES','FLEURS','CRÊPES','MIEL','OLIVES','SAVONS','JOUETS','ÉPICES','NOUGAT','CAFÉ'];let ni=0;
  for(const s of[-1,1])for(let z=-40;z<60;z+=3.6){const nm=(s<0&&z>38&&z<56)?'CHARCUTERIE':names[(ni++)%names.length];D.push({k:'stall',s,z0:z,z1:z+3.2,name:nm,col:pick2(R,['#b84a3a','#3a6a8a','#5a8a4a','#c8902a','#8a4a6a']),wood:pick2(R,['#8a5a32','#7a4e2c','#9a6a3e'])})}
  for(let z=-40;z<130;z+=4.5)D.push({k:'garland',z});
  for(const s of[-1,1])for(let z=90;z<118;z+=7)D.push({k:'tree',s,z:z+2.5});
  for(const s of[-1,1])for(let z=-38;z<130;z+=11)D.push({k:'crowd',s,z,col:pick2(R,['#2a4a7a','#1a1a22','#6a2a2a','#c8b48a','#4a5a3a'])});
  return{O,D}}
function pick2(R,a){return a[Math.floor(R()*a.length)]}

/* ---------- état ---------- */
function runnerStart(){const b=rnBuild();
  RN={hz:RNHZ,cz:RNCD,z:0,x:0,y:0,vx:0,vy:0,onG:true,flap:1,t:0,ph:0,cp:0,inv:0,O:b.O,D:b.D,parts:[],bub:[],done:0,camx:0,camy:.28,said:{},head:0,lean:0,air:0};
  G.cornTotal=RN.O.filter(o=>o.k==='corn').length;G.corn=0;setSong('s6-1');G.quip=null;G.quipQ=[];say(L.def.start,4.4)}
function rnRespawn(){const z0=RNCP[RN.cp];RN.z=z0;RN.x=0;RN.y=z0>RNCAR[0]&&z0<RNCAR[1]?.14:0;RN.vx=RN.vy=0;RN.onG=true;RN.flap=1;RN.inv=1;RN.done=0;
  for(const o of RN.O){if(o.k==='legs'&&o.mode==='toward'){o.z=o.z0;o.go=false}if(o.k==='dog'){o.bark=0}}
  P.dead=false;P.wake=.3}
function rnBubble(o,text,col){RN.bub.push({o,text,t:0,max:Math.max(2.2,1+text.length*.05),col:col||'#2a2420'})}

/* ---------- mise à jour ---------- */
function runnerUpdate(dt){
  RN.t+=dt;const t=RN.t;
  {const u=clamp((RN.z-103)/9,0,1),e=u*u*(3-2*u);RN.cz=Math.max(RN.z+RNCD,lerp(RN.z+RNCD,127.6,e))}const base=.27+RN.y*.75,lift=clamp((RN.z-103)/9,0,1)*1.7;RN.camx+=(RN.x*.55-RN.camx)*Math.min(1,dt*7);RN.camy+=(base+lift-RN.camy)*Math.min(1,dt*4);RN.hz=RNHZ-(RN.camy-base)*RNF/Math.max(1,RN.cz-RN.z);
  for(let i=RN.parts.length-1;i>=0;i--){const p=RN.parts[i];p.life+=dt;if(p.life>p.max){RN.parts.splice(i,1);continue}p.vy+=500*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.rot+=p.vr*dt}
  for(let i=RN.bub.length-1;i>=0;i--){const b=RN.bub[i];b.t+=dt;if(b.t>b.max)RN.bub.splice(i,1)}
  if(pressed.has('restart')&&!P.dead&&!RN.done){rnRespawn();return}
  // les choses qui bougent
  for(const o of RN.O){
    if(o.k==='legs'){if(o.mode==='cross')o.x=o.xa+(o.xb-o.xa)*(.5-.5*Math.cos(t*o.sp*Math.PI));
      else if(o.mode==='toward'){if(!o.go&&o.z0-RN.z<15)o.go=true;if(o.go)o.z-=o.v*dt}}
    if(o.k==='dog'){const c=o.xa+(o.xb-o.xa)*(.5-.5*Math.cos(t*1.3));o.dir=c>(o.x0+o.x1)/2?1:-1;o.x0=c-o.len/2;o.x1=c+o.len/2;if(!o.said&&o.z-RN.z<5.5&&o.z>RN.z){o.said=true;rnBubble(o,'Ouaf ! Ouaf !','#a8322d');if(!G.sim){tone(220,.12,'square',.06,160);setTimeout(()=>tone(200,.14,'square',.06,140),180)}}
      if(o.z-RN.z<5.5&&o.z>RN.z-1)o.bark+=dt}
  }
  if(P.dead){P.deadT-=dt;if(P.deadT<=0){if(G.gameOverPending){G.gameOverPending=false;gameOver();return}rnRespawn()}return}
  if(RN.done){RN.done+=dt;RN.vx=0;if(RN.done>3.2&&G.state==='play')winLevel();return}
  if(RN.inv>0)RN.inv-=dt;
  // Raymond
  const left=keys.has('left'),right=keys.has('right');
  const tx=(right?1:0)-(left?1:0);RN.vx+=(tx*2.1-RN.vx)*Math.min(1,dt*9);
  const px=RN.x,pz=RN.z;
  let fwd=RNV;if(RN.z>118.8)fwd=RN.y>.9?1.1:1.7;const onCar=RN.onG&&RN.z>RNCAR[0]&&RN.z<RNCAR[1]&&RN.y>.1&&RN.y<.2;if(onCar)fwd-=RNCARV;
  RN.z+=fwd*dt;RN.x=clamp(RN.x+RN.vx*dt,-RNX,RNX);
  if(pressed.has('jump')){if(RN.onG){RN.vy=RNJ;RN.onG=false;RN.flap=1;if(!G.sim)SFX.jump&&SFX.jump()}else if(RN.flap>0){RN.flap=0;RN.vy=Math.max(RN.vy,RNFL);RN.air=.35;if(!G.sim)SFX.flap()}}
  RN.vy-=RNG*dt;RN.y+=RN.vy*dt;if(RN.air>0)RN.air-=dt;
  RN.ph+=dt*(RN.onG?(fwd*3.4):2);RN.head=Math.sin(RN.ph*2);RN.lean+=((RN.vx/2.1)*.18-RN.lean)*Math.min(1,dt*8);
  // les volumes : sol, marches, côtés
  const hw=.08,hd=.07;let sup=0,kill=null;
  for(const o of RN.O){if(o.k!=='box')continue;
    const inX=RN.x+hw>o.x0&&RN.x-hw<o.x1,inZ=RN.z+hd>o.z0&&RN.z-hd<o.z1;if(!inX||!inZ)continue;
    if(o.h<=RN.y+.16){sup=Math.max(sup,o.h);continue}
    // on rentre dedans : par le côté, on est repoussé ; par l'avant, on s'assomme
    const wasX=px+hw>o.x0&&px-hw<o.x1;if(!wasX){RN.x=px<o.x0?o.x0-hw-.001:o.x1+hw+.001;RN.vx=0}else kill=kill||o.kind||'mur'}
  if(RN.y<=sup){if(!RN.onG&&RN.vy<-2&&!G.sim)noise(.08,900,.04,'bandpass');RN.y=sup;RN.vy=0;RN.onG=true;RN.flap=1}else RN.onG=false;
  // ce qui tue
  const hb={x0:RN.x-hw,x1:RN.x+hw,z0:RN.z-hd,z1:RN.z+hd,y0:RN.y,y1:RN.y+.3};
  const hit=(x0,x1,z0,z1,y0,y1)=>hb.x1>x0&&hb.x0<x1&&hb.z1>z0&&hb.z0<z1&&hb.y1>y0&&hb.y0<y1;
  for(const o of RN.O){
    if(o.k==='legs'){const h=o.kid?.55:.88,sp=o.kid?.1:.15,st=rnStride(o,t);for(const s of[-1,1]){const lz=o.z+st*s*.12;if(hit(o.x+s*sp-.05,o.x+s*sp+.05,lz-.06,lz+.06,0,h))kill=kill||'jambes'}}
    else if(o.k==='dog'){if(hit(o.x0,o.x1,o.z-.12,o.z+.12,0,o.h))kill=kill||'chien'}
    else if(o.k==='hand'){const zh=rnHandZ(o,t);if(hit(o.x0,o.x1,zh-.09,zh+.09,o.y,o.y+.11))kill=kill||'main'}
    else if(o.k==='horse'){const z=rnHorseZ(o,t),yb=rnHorseY(o,t);if(hit(o.x-.035,o.x+.035,z-.04,z+.04,0,2.2))kill=kill||'manege';if(hit(o.x-.13,o.x+.13,z-.36,z+.36,yb,yb+.28))kill=kill||'manege'}
    else if(o.k==='seated'){if(hit(o.x-.2,o.x+.2,o.z-.08,o.z+.08,0,.42))kill=kill||'jambes'}
    else if(o.k==='water'){if(RN.z>o.z0&&RN.z<o.z1&&RN.y<.3)kill=kill||'eau'}
    else if(o.k==='corn'&&!o.got){if(Math.abs(o.x-RN.x)<.16&&Math.abs(o.z-RN.z)<.18&&Math.abs(o.y+.05-(RN.y+.15))<.25){o.got=true;G.corn++;if(!G.sim)SFX.pick&&SFX.pick()}}
  }
  if(kill&&RN.inv<=0)return rnDie(kill);
  // repères
  for(let i=RNCP.length-1;i>0;i--)if(RN.z>RNCP[i]&&RN.cp<i){RN.cp=i;if(!G.sim)tone(660,.12,'sine',.04,880);break}
  // en haut de la fontaine : en sécurité
  if(RN.onG&&RN.y>1.38){RN.done=.01;RN.vx=0;say("En sécurité. Enfin, en hauteur. Pour un pigeon, c'est la même chose.",3.6)}
  // répliques
  const once=(k,c,txt)=>{if(!RN.said[k]&&c){RN.said[k]=1;say(txt,3.8)}};
  once('comptoir',RN.z>37.5,"Les caisses bouchent tout. Il va falloir passer par le comptoir. Le règlement interdit les comptoirs. Le règlement n'a jamais eu faim.");
  once('manege',RN.z>60,"Le manège ! Il tourne dans le mauvais sens. Je cours, je cours, et j'avance à peine. Comme en 1916.");
  once('fontaine',RN.z>114,"La fontaine. Tout en haut, personne ne viendra me chercher.");
}
function rnStride(o,t){return o.mode==='stand'?Math.sin(t*1.2+o.ph)*.15:Math.sin(t*(o.kid?11:7)+o.ph)}
function rnHandZ(o,t){return o.za+(o.zb-o.za)*(.5-.5*Math.cos(t*Math.PI*2/o.per))}
function rnHorseZ(o,t){const len=RNCAR[1]-RNCAR[0];return RNCAR[0]+((((o.base-RNCAR[0])-RNCARV*t)%len)+len)%len}
function rnHorseY(o,t){return .33+.29*Math.sin(t*2.1+o.ph)}
function rnDie(kind){die(kind);
  for(let i=0;i<34;i++){const a=rnd()*Math.PI*2,s=80+rnd()*300;RN.parts.push({x:W/2+(RN.x-RN.camx)*RNF/RNCD,y:RN.hz+(RN.camy-RN.y-.15)*RNF/RNCD,vx:Math.cos(a)*s,vy:Math.sin(a)*s-200,life:0,max:.9+rnd(),rot:rnd()*6,vr:(rnd()-.5)*12,straw:i%3>0})}}

/* ---------- rendu ---------- */
let RN_SKY=null;
function rnSkyBuild(){const c=mk(W,RNHZ+40),g=c.getContext('2d'),R=mulberry(77);
  const sk=g.createLinearGradient(0,0,0,RNHZ);sk.addColorStop(0,'#7aa6d4');sk.addColorStop(1,'#f2e2c4');g.fillStyle=sk;g.fillRect(0,0,W,RNHZ+40);
  for(let k=0;k<5;k++){const x=R()*W,y=30+R()*80,w=80+R()*120;g.fillStyle='rgba(255,255,255,.75)';g.beginPath();g.ellipse(x,y,w,12,0,0,7);g.ellipse(x-w*.3,y-8,w*.4,13,0,0,7);g.fill()}
  // au bout de la rue, loin derrière Raymond : les maisons, le clocher
  for(let x=-10;x<W;){const w=40+R()*60,h=50+R()*60;g.fillStyle=mix('#d8ccb4','#b8a888',R());g.fillRect(x,RNHZ-h,w,h+40);g.fillStyle=mix('#9a5a3a','#6a6a72',R()<.3?.6:0);poly(g,[x-3,RNHZ-h,x+w/2,RNHZ-h-24,x+w+3,RNHZ-h]);g.fill();
    g.fillStyle='rgba(50,40,40,.35)';for(let k=0;k<3;k++)g.fillRect(x+8+k*(w-16)/3,RNHZ-h+14,7,10);x+=w}
  g.fillStyle='#cfc6b2';g.fillRect(W*.62,RNHZ-150,34,150);g.fillStyle='#5a6070';poly(g,[W*.62-3,RNHZ-150,W*.62+17,RNHZ-205,W*.62+37,RNHZ-150]);g.fill();
  return c}
function rnPc(x,y,z){return rnP(x,y,Math.min(z,RN.cz-.45))}
function rnP(x,y,z){const d=RN.cz-z;if(d<.3)return null;const s=RNF/d;return[W/2+(x-RN.camx)*s,RN.hz+(RN.camy-y)*s,s,d]}
function rnQuad(g,a,b,c,d){if(!a||!b||!c||!d)return false;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.lineTo(c[0],c[1]);g.lineTo(d[0],d[1]);g.closePath();return true}
function runnerRender(t){const g=ctx;
  if(!RN_SKY)RN_SKY=rnSkyBuild();
  g.fillStyle='#7aa6d4';g.fillRect(0,0,W,H);g.drawImage(RN_SKY,0,RN.hz-RNHZ);
  // le sol : pavés qui défilent
  {const gr=g.createLinearGradient(0,RN.hz,0,H);gr.addColorStop(0,'#a89c88');gr.addColorStop(1,'#7a6e5c');g.fillStyle=gr;g.fillRect(0,RN.hz,W,H-RN.hz);
    const z0=Math.floor(RN.cz-.4),onCarZ=z=>z>RNCAR[0]&&z<RNCAR[1];
    for(let z=z0;z>RN.z-40;z-=.25){const a=rnP(0,0,z),b=rnP(0,0,z-.25);if(!a||!b)continue;if(a[1]-b[1]<1.2)break;const row=Math.round(z*4);
      g.fillStyle='rgba(60,50,40,.28)';g.fillRect(0,b[1],W,Math.max(1,(a[1]-b[1])*.12));
      if(a[3]<14){const w=.22,off=(row%2)*w/2;for(let x=-2.6+off;x<2.6;x+=w){const p1=rnP(x,0,z),p2=rnP(x,0,z-.25);if(!p1||!p2)continue;g.fillStyle='rgba(60,50,40,.22)';g.fillRect(p1[0],b[1],Math.max(1,a[2]*.012),a[1]-b[1])}}}}
  // tout ce qui a une profondeur, du plus loin au plus près
  const L2=[];
  const zn=RN.cz-.45;for(const d of RN.D){if(d.k==='stall'&&d.z0>zn)continue;const z=d.k==='stall'?d.z0:d.z;const dd=RN.cz-z;if(dd<.4||dd>52)continue;L2.push({d:dd,o:d,big:d.k==='stall'})}
  for(const o of RN.O){if((o.k==='box'||o.k==='water')&&o.z0>zn)continue;if(o.k==='box'||o.k==='water'){const zz=clamp(RN.z,o.z0,Math.min(o.z1,zn)),dd=RN.cz-zz+.02;if(dd<=48)L2.push({d:dd,o,big:true,near:RN.cz-Math.min(o.z1,zn)});continue}let z=o.k==='box'?Math.min(o.z1,RN.cz-.45):o.k==='hand'?rnHandZ(o,t):o.k==='horse'?rnHorseZ(o,t):o.k==='water'?Math.min(o.z1,RN.cz-.45):o.z;if(o.k==='dog')z=o.z;const dd=RN.cz-z;if(dd<.35||dd>48)continue;if(o.k==='corn'&&o.got)continue;L2.push({d:dd,o})}
  L2.push({d:RN.cz-RN.z,o:{k:'raymond'}});
  L2.sort((a,b)=>b.d-a.d);
  for(const it of L2){const fa=it.big?(['rim','crates','tier','top','crate','pram'].includes(it.o.draw)&&it.near<1.8?clamp((it.near-.5)/1.3,0,1)*.65+.2:1):it.d<2.4?clamp((it.d-.9)/1.5,0,1):1;if(fa<=0)continue;g.save();g.globalAlpha=fa;rnDraw(g,it.o,t,it.d);g.restore()}
  // plumes, paille
  for(const p of RN.parts){g.save();g.globalAlpha=1-p.life/p.max;g.translate(p.x,p.y);g.rotate(p.rot);g.fillStyle=p.straw?'#d8b860':'#c8ccd6';g.fillRect(-6,-1.5,12,3);g.restore()}
  // bulles
  for(const b of RN.bub){const o=b.o,z=o.z!=null?o.z:0,p=rnP(o.x0!=null?(o.x0+o.x1)/2:o.x,.55,z);if(!p)continue;const a=Math.min(1,b.t*6,(b.max-b.t)*4);g.save();g.globalAlpha=a;g.font='bold 18px '+F_DISP;const w=g.measureText(b.text).width+18;
    g.fillStyle='#f6f0e0';rr(g,p[0]-w/2,p[1]-60,w,30,8);g.fill();g.fillStyle=b.col;g.textAlign='center';g.fillText(b.text,p[0],p[1]-39);g.restore()}
  if(RN.inv>0&&Math.floor(RN.inv*10)%2){}
  renderGrain();
  if(G.state==='play'||G.state==='exiting')renderHUD();
}
/* un pavé de bois ou de pierre */
function rnBox(g,o,col,top,side){const xc=RN.camx,yc=RN.camy,zn=RN.cz-.45;if(o.z0>=zn)return null;const z1=Math.min(o.z1,zn);
  const v=(x,y,z)=>rnP(x,y,z);
  if(xc<o.x0&&rnQuad(g,v(o.x0,0,o.z0),v(o.x0,0,z1),v(o.x0,o.h,z1),v(o.x0,o.h,o.z0))){g.fillStyle=side||shade(col,-.25);g.fill()}
  if(xc>o.x1&&rnQuad(g,v(o.x1,0,o.z0),v(o.x1,0,z1),v(o.x1,o.h,z1),v(o.x1,o.h,o.z0))){g.fillStyle=side||shade(col,-.25);g.fill()}
  if(yc>o.h&&rnQuad(g,v(o.x0,o.h,o.z0),v(o.x1,o.h,o.z0),v(o.x1,o.h,z1),v(o.x0,o.h,z1))){g.fillStyle=top||shade(col,.15);g.fill()}
  if(z1<o.z1)return null;
  const a=v(o.x0,0,o.z1),b=v(o.x1,o.h,o.z1);if(a&&b){g.fillStyle=col;g.fillRect(a[0],b[1],b[0]-a[0],a[1]-b[1]);return[a[0],b[1],b[0]-a[0],a[1]-b[1],a[2]]}return null}
function rnDraw(g,o,t,d){
  switch(o.k){
  case'raymond':{const p=rnP(RN.x,RN.y,RN.z),gs=rnP(RN.x,0,RN.z);if(!p)return;
    // ombre
    const sup=RN.y;g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(p[0],rnP(RN.x,RN.onG?RN.y:rnSupport(),RN.z)[1],p[2]*.13,p[2]*.03,0,0,7);g.fill();
    if(P.dead)return;if(RN.inv>0&&Math.floor(RN.inv*12)%2)return;
    rnPigeon(g,p[0],p[1],p[2],{ph:RN.ph,head:RN.head,lean:RN.lean,air:!RN.onG,flap:RN.air>0,t});break}
  case'box':{if(o.draw==='carousel'){rnCarousel(g,o,t);break}
    if(o.draw==='crate'){const r=rnBox(g,o,'#a8844e');if(r){g.strokeStyle='rgba(60,40,20,.6)';g.lineWidth=Math.max(1,r[4]*.01);for(let k=1;k<3;k++){g.beginPath();g.moveTo(r[0],r[1]+r[3]*k/3);g.lineTo(r[0]+r[2],r[1]+r[3]*k/3);g.stroke()}g.strokeRect(r[0],r[1],r[2],r[3])}}
    else if(o.draw==='crates'){const r=rnBox(g,o,'#9a7646','#b8945e');if(r){g.strokeStyle='rgba(60,40,20,.6)';g.lineWidth=Math.max(1,r[4]*.012);for(let k=1;k<3;k++){g.beginPath();g.moveTo(r[0],r[1]+r[3]*k/3);g.lineTo(r[0]+r[2],r[1]+r[3]*k/3);g.stroke()}for(let k=1;k<3;k++){g.beginPath();g.moveTo(r[0]+r[2]*k/3,r[1]);g.lineTo(r[0]+r[2]*k/3,r[1]+r[3]);g.stroke()}
        g.fillStyle='#e8d8b0';g.font='bold '+Math.max(6,r[4]*.07|0)+'px '+F_DISP;g.textAlign='center';g.fillText('POMMES',r[0]+r[2]/6,r[1]+r[3]/6+4);g.fillText('CHOUX',r[0]+r[2]*.5,r[1]+r[3]*.5+4)}}
    else if(o.draw==='pram'){const r=rnBox(g,o,'#2a3a5a');if(r){g.fillStyle='#1a1a1a';for(const k of[.2,.8]){g.beginPath();g.arc(r[0]+r[2]*k,r[1]+r[3],r[4]*.07,0,7);g.fill()}g.fillStyle='#3a4a6a';g.beginPath();g.arc(r[0]+r[2]/2,r[1],r[2]*.5,Math.PI,0);g.fill()}}
    else if(o.draw==='counter'){const r=rnBox(g,o,'#8a5a32','#d8cfc0');if(r){g.fillStyle='#c8402a';for(let k=0;k<6;k++)if(k%2)g.fillRect(r[0]+r[2]*k/6,r[1],r[2]/6,r[3]*.25)}
      // sur le comptoir : saucissons, jambon, la planche
      for(let z=o.z0+.6;z<o.z1;z+=1.4){const x=-.7,a=rnP(x,o.h,z),b=rnP(x+.18,o.h+.07,z);if(!a||!b)continue;g.fillStyle='#7a2a22';rr(g,a[0],b[1],b[0]-a[0],a[1]-b[1],(a[1]-b[1])/2);g.fill();g.fillStyle='rgba(255,255,255,.4)';for(let k=0;k<4;k++)g.fillRect(a[0]+(b[0]-a[0])*(k+.5)/4,b[1]+2,1.5,1.5)}}
    else if(o.draw==='tier'||o.draw==='top')rnVasque(g,o,t);
    else if(o.draw==='rim'){const r=rnBox(g,o,o.draw==='top'?'#bdb6a6':'#b0a896','#d0c8b6');
      if(r){g.strokeStyle='rgba(60,50,40,.35)';g.lineWidth=1;for(let k=1;k<4;k++){g.beginPath();g.moveTo(r[0]+r[2]*k/4,r[1]);g.lineTo(r[0]+r[2]*k/4,r[1]+r[3]);g.stroke()}}
}
    break}
  case'water':{{g.fillStyle='rgba(110,160,180,.85)';rnQuad(g,rnPc(-1.3,.28,o.z0),rnPc(1.3,.28,o.z0),rnPc(1.3,.28,o.z1),rnPc(-1.3,.28,o.z1));g.fill();
      g.strokeStyle='rgba(240,250,255,.5)';g.lineWidth=1.2;for(let k=0;k<8;k++){const z=o.z0+((k*.57+t*.3)%(o.z1-o.z0)),p=rnP(-1+((k*.37)%2),.28,z);if(p){g.beginPath();g.ellipse(p[0],p[1],p[2]*.15,p[2]*.02,0,0,7);g.stroke()}}}break}
  case'legs':rnLegs(g,o,t);break;
  case'seated':rnSeated(g,o,t);break;
  case'dog':rnDog(g,o,t);break;
  case'hand':rnHand(g,o,t);break;
  case'horse':rnHorse(g,o,t);break;
  case'corn':{const p=rnP(o.x,o.y+.05,o.z);if(p){const s=p[2]*.0016,b=Math.sin(t*3+o.z)*p[2]*.01;g.save();g.translate(p[0],p[1]+b);g.scale(s,s);g.fillStyle='rgba(255,230,140,.25)';g.beginPath();g.arc(0,0,22,0,7);g.fill();
      g.strokeStyle='#d8b450';g.lineWidth=3;for(let k=-3;k<=3;k++){g.beginPath();g.moveTo(0,14);g.lineTo(k*4,-14);g.stroke()}g.fillStyle='#a8322d';g.fillRect(-9,2,18,5);g.restore()}break}
  case'stall':rnStall(g,o,t);break;
  case'garland':rnGarland(g,o,t);break;
  case'tree':{const p=rnP(o.s*1.7,0,o.z);if(!p)break;const s=p[2];g.fillStyle='#6a4a2a';g.fillRect(p[0]-s*.06,p[1]-s*1.6,s*.12,s*1.6);g.fillStyle='#4e7a3a';for(const[dx,dy,r]of[[0,-2.2,.7],[-.4,-1.9,.5],[.45,-1.95,.5]]){g.beginPath();g.arc(p[0]+dx*s,p[1]+dy*s,r*s,0,7);g.fill()}
      g.fillStyle='#8a6a4a';g.fillRect(p[0]-s*.3,p[1]-s*.3,s*.6,s*.3);break}
  case'crowd':{for(let k=0;k<3;k++){const x=o.s*(1.05+k*.1),z=o.z+k*.7;rnLegs(g,{x,z,col:o.col,skirt:k===1?'#a8322d':null,shoe:'#2a2a2a',mode:'stand',ph:k+o.z,kid:false},t)}break}
  case'bench':{const x0=o.side<0?-1.45:.95,x1=x0+.5,p=rnP(o.side<0?x1:x0,.45,o.z+1.4),q=rnP(o.side<0?x0:x1,.45,o.z);if(!p||!q)break;
      rnQuad(g,rnP(x0,.45,o.z),rnP(x1,.45,o.z),rnP(x1,.45,o.z+1.6),rnP(x0,.45,o.z+1.6));g.fillStyle='#6a4a2a';g.fill();
      const f=rnP((x0+x1)/2,0,o.z+1.6),f2=rnP((x0+x1)/2,.45,o.z+1.6);if(f&&f2){g.fillStyle='#3a3a3a';g.fillRect(f[0]-f[2]*.25,f2[1],f[2]*.03,f[1]-f2[1]);g.fillRect(f[0]+f[2]*.22,f2[1],f[2]*.03,f[1]-f2[1])}
      const b1=rnP(o.side<0?x0:x1,.9,o.z+1.6),b0=rnP(o.side<0?x0:x1,.5,o.z);if(b1){rnQuad(g,rnP(o.side<0?x0:x1,.5,o.z),rnP(o.side<0?x0:x1,.5,o.z+1.6),rnP(o.side<0?x0:x1,.9,o.z+1.6),rnP(o.side<0?x0:x1,.9,o.z));g.fillStyle='#7a5432';g.fill()}break}
  }
}
function rnSupport(){let s=0;for(const o of RN.O)if(o.k==='box'&&RN.x>o.x0&&RN.x<o.x1&&RN.z>o.z0&&RN.z<o.z1&&o.h<=RN.y+.01)s=Math.max(s,o.h);return s}
/* Raymond, de face : poitrail gorge-de-pigeon, tête qui va et vient */
function rnPigeon(g,x,y,s,o){const u=s*.01;g.save();g.translate(x,y);g.rotate(o.lean);
  const step=Math.sin(o.ph),hb=o.head;
  // pattes
  if(!o.air){g.strokeStyle='#c84a3a';g.lineWidth=2.4*u;g.lineCap='round';for(const sd of[-1,1]){const lift=Math.max(0,sd*step)*4*u;g.beginPath();g.moveTo(sd*4*u,-6*u);g.lineTo(sd*4.5*u,-lift);g.stroke();g.beginPath();g.moveTo(sd*4.5*u-3*u,-lift+.5*u);g.lineTo(sd*4.5*u+3*u,-lift+.5*u);g.stroke()}}
  else{g.strokeStyle='#c84a3a';g.lineWidth=2.4*u;g.lineCap='round';for(const sd of[-1,1]){g.beginPath();g.moveTo(sd*4*u,-7*u);g.lineTo(sd*5*u,-3*u);g.stroke()}}
  // ailes
  const spread=o.air?(o.flap?Math.sin(o.t*30)*.5+.9:.8):0;
  for(const sd of[-1,1]){g.save();g.translate(sd*7*u,-20*u);g.rotate(sd*(.08+spread*1.1));g.fillStyle='#7f879a';g.beginPath();g.ellipse(sd*(2+spread*9)*u,5*u,(4.5+spread*10)*u,10*u,sd*.15,0,7);g.fill();
    g.fillStyle='#2a2a32';g.fillRect(sd>0?(1+spread*6)*u:-(4+spread*6)*u,5*u,3*u,1.4*u);g.fillRect(sd>0?(1+spread*6)*u:-(4+spread*6)*u,8.5*u,3*u,1.4*u);
    if(spread>.3){g.fillStyle='#3a3a44';for(let k=0;k<4;k++){g.beginPath();g.ellipse(sd*(14+spread*10+k*1.5)*u,(10+k*2.5)*u,4*u,1.6*u,sd*.6,0,7);g.fill()}}g.restore()}
  // corps et poitrail
  g.fillStyle='#8f97a8';g.beginPath();g.ellipse(0,-16*u,10*u,13*u,0,0,7);g.fill();
  const ir=g.createLinearGradient(-8*u,-30*u,8*u,-14*u);ir.addColorStop(0,'#4f8a7a');ir.addColorStop(.5,'#7a5a8a');ir.addColorStop(1,'#4f8a7a');g.fillStyle=ir;g.beginPath();g.ellipse(0,-22*u,8*u,7*u,0,0,7);g.fill();
  g.fillStyle='#a6adbb';g.beginPath();g.ellipse(0,-12*u,6.5*u,7*u,0,0,7);g.fill();
  g.strokeStyle='rgba(60,50,60,.35)';g.lineWidth=.6*u;g.beginPath();g.moveTo(-3*u,-6*u);g.lineTo(-2*u,-4*u);g.moveTo(3*u,-7*u);g.lineTo(2*u,-5*u);g.stroke();   // les coutures de l'empailleur
  // la tête, qui avance et recule
  const hs=1+hb*.13,hy=-31*u+hb*2.2*u;g.save();g.translate(0,hy);g.scale(hs,hs);
  g.fillStyle='#4f8a7a';g.beginPath();g.ellipse(0,4*u,4.5*u,4*u,0,0,7);g.fill();
  g.fillStyle='#9aa2b2';g.beginPath();g.arc(0,0,6*u,0,7);g.fill();
  for(const sd of[-1,1]){g.fillStyle='#e88a2a';g.beginPath();g.arc(sd*3.6*u,-1*u,1.9*u,0,7);g.fill();g.fillStyle='#111';g.beginPath();g.arc(sd*3.6*u,-1*u,.9*u,0,7);g.fill();g.fillStyle='#fff';g.fillRect(sd*3.6*u-.3*u,-1.8*u,.6*u,.6*u)}
  g.fillStyle='#e8e2d0';g.beginPath();g.ellipse(0,.6*u,1.8*u,1.2*u,0,0,7);g.fill();g.fillStyle='#3a3030';g.beginPath();g.moveTo(-1.3*u,1.5*u);g.lineTo(1.3*u,1.5*u);g.lineTo(0,4.2*u);g.closePath();g.fill();
  g.restore();g.restore()}
/* des jambes de passant */
function rnLegs(g,o,t){const h=o.kid?.55:.88,sp=o.kid?.1:.15,st=rnStride(o,t),walk=o.mode!=='stand';
  for(const sd of[1,-1]){const lz=o.z+st*sd*.12,lift=walk?Math.max(0,st*sd)*.06:0,p0=rnP(o.x+sd*sp,lift,lz),p1=rnP(o.x+sd*sp,h+.35,lz);if(!p0||!p1)continue;const s=p0[2],w=s*(o.kid?.075:.1);
    g.fillStyle=o.skirt?'#e0b89a':o.col;g.fillRect(p0[0]-w/2,p1[1],w,p0[1]-p1[1]-s*.05);
    if(!o.skirt){g.fillStyle='rgba(0,0,0,.15)';g.fillRect(p0[0]+w*.15,p1[1],w*.2,p0[1]-p1[1]-s*.05)}
    g.fillStyle=o.shoe;rr(g,p0[0]-w*.65,p0[1]-s*.07,w*1.3,s*.07,s*.02);g.fill()}
  if(o.skirt){const a=rnP(o.x,h*.62,o.z);if(a){const s=a[2];g.fillStyle=o.skirt;poly(g,[a[0]-s*.26,a[1],a[0]+s*.26,a[1],a[0]+s*.2,a[1]-s*.9,a[0]-s*.2,a[1]-s*.9]);g.fill()}}
  else{const a=rnP(o.x,h,o.z);if(a){const s=a[2];g.fillStyle=o.col;g.fillRect(a[0]-sp*s-s*.06,a[1]-s*.5,(sp*2+.12)*s,s*.52)}}
  // le haut du corps (on ne le voit que quand la caméra monte)
  {const top=o.kid?1.05:1.62,a=rnP(o.x,h+.3,o.z),b=rnP(o.x,top,o.z);if(a&&b&&b[1]>-60){const s=a[2],tc=o.top||(o.top=['#c8402a','#3a6a8a','#e8e0d0','#5a8a4a','#e0b030','#2a2a3a'][Math.floor(Math.abs(o.z*7+o.x*3))%6]);g.fillStyle=tc;rr(g,a[0]-s*.22,b[1]+s*.18,s*.44,a[1]-b[1]-s*.18,s*.08);g.fill();
    g.fillStyle='#e0b898';g.beginPath();g.arc(b[0],b[1]+s*.08,s*.1,0,7);g.fill();g.fillStyle=['#3a2a1a','#c8a060','#1a1a1a','#8a4a2a'][Math.floor(Math.abs(o.z*3))%4];g.beginPath();g.arc(b[0],b[1]+s*.04,s*.1,Math.PI,0);g.fill()}}}
function rnSeated(g,o,t){const p=rnP(o.x,.45,o.z);if(!p)return;const s=p[2];
  for(const sd of[-1,1]){const sw=Math.sin(t*1.5+o.z+sd)*s*.02,f=rnP(o.x+sd*.09,.04,o.z);g.fillStyle=o.col;g.fillRect(p[0]+sd*s*.09-s*.05+sw,p[1],s*.1,f[1]-p[1]-s*.04);g.fillStyle='#2a2a2a';rr(g,p[0]+sd*s*.09-s*.07+sw,f[1]-s*.06,s*.14,s*.06,s*.02);g.fill()}
  g.fillStyle=o.col;g.fillRect(p[0]-s*.2,p[1]-s*.5,s*.4,s*.52)}
function rnDog(g,o,t){const p=rnP((o.x0+o.x1)/2,0,o.z);if(!p)return;const s=p[2],bk=o.bark>0?Math.abs(Math.sin(o.bark*14)):0;g.save();g.translate(p[0],p[1]);g.scale(-(o.dir||1),1);
  const w=(o.x1-o.x0)*s,hh=o.h*s;g.fillStyle='#8a5a2a';
  for(const k of[-.35,-.2,.25,.38]){g.fillRect(k*w-s*.025,-hh*.55,s*.05,hh*.55)}
  g.beginPath();g.ellipse(0,-hh*.66,w*.42,hh*.22,0,0,7);g.fill();
  g.save();g.translate(-w*.45,-hh*.8-bk*s*.02);g.fillStyle='#8a5a2a';g.beginPath();g.ellipse(0,0,s*.09,s*.08,0,0,7);g.fill();g.beginPath();g.ellipse(-s*.08,s*.02,s*.07,s*.04+bk*s*.015,0,0,7);g.fill();
  g.fillStyle='#1a1a1a';g.beginPath();g.arc(-s*.14,s*.01,s*.015,0,7);g.fill();g.beginPath();g.arc(-s*.01,-s*.02,s*.012,0,7);g.fill();
  if(bk>.3){g.fillStyle='#5a1a1a';g.beginPath();g.ellipse(-s*.1,s*.06,s*.03,s*.02*bk,0,0,7);g.fill()}
  g.fillStyle='#6a4020';g.beginPath();g.ellipse(s*.03,-s*.02,s*.03,s*.07,.4,0,7);g.fill();g.restore();
  g.strokeStyle='#8a5a2a';g.lineWidth=s*.03;g.beginPath();g.moveTo(w*.42,-hh*.7);g.quadraticCurveTo(w*.55,-hh*1.1,w*.5+Math.sin(t*12)*s*.04,-hh*1.25);g.stroke();
  g.fillStyle='#c83a2a';g.fillRect(-w*.36,-hh*.85,s*.06,s*.02);g.restore()}
function rnHand(g,o,t){const zh=rnHandZ(o,t),a=rnP(-1.6,o.y+.05,zh),b=rnP(o.x1-.05,o.y+.05,zh);if(!a||!b)return;const s=b[2];
  g.strokeStyle='#f2f0ea';g.lineWidth=s*.11;g.lineCap='round';g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0]-s*.12,b[1]);g.stroke();
  g.fillStyle='#e8b898';g.beginPath();g.ellipse(b[0],b[1],s*.11,s*.055,0,0,7);g.fill();for(let k=0;k<4;k++){g.beginPath();g.ellipse(b[0]+s*.1,b[1]-s*.04+k*s*.027,s*.05,s*.013,0,0,7);g.fill()}
  g.fillStyle='#d8a888';g.beginPath();g.ellipse(b[0]-s*.02,b[1]-s*.06,s*.04,s*.02,-.6,0,7);g.fill()}
function rnHorse(g,o,t){const z=rnHorseZ(o,t),yb=rnHorseY(o,t),p0=rnP(o.x,0,z),p1=rnP(o.x,2.2,z);if(!p0||!p1)return;const s=p0[2];
  g.fillStyle='#d8b450';g.fillRect(p0[0]-s*.018,p1[1],s*.036,p0[1]-p1[1]);g.fillStyle='rgba(255,255,255,.4)';g.fillRect(p0[0]-s*.01,p1[1],s*.008,p0[1]-p1[1]);
  const b=rnP(o.x,yb,z);g.fillStyle=o.col;g.beginPath();g.ellipse(b[0],b[1]-s*.15,s*.13,s*.15,0,0,7);g.fill();
  g.fillStyle=shade(o.col,-.2);g.beginPath();g.ellipse(b[0],b[1]-s*.32,s*.06,s*.1,0,0,7);g.fill();
  g.fillStyle='#c8402a';g.fillRect(b[0]-s*.13,b[1]-s*.2,s*.26,s*.05);g.fillStyle='#e0b030';g.fillRect(b[0]-s*.13,b[1]-s*.15,s*.26,s*.015);
  g.strokeStyle='#5a3a2a';g.lineWidth=s*.02;for(const sd of[-1,1]){g.beginPath();g.moveTo(b[0]+sd*s*.08,b[1]-s*.05);g.lineTo(b[0]+sd*s*.1,b[1]+s*.12);g.stroke()}}
function rnCarousel(g,o,t){// le plancher qui défile à l'envers, le toit rayé, les lumières
  rnQuad(g,rnPc(o.x0,o.h,o.z0),rnPc(o.x1,o.h,o.z0),rnPc(o.x1,o.h,o.z1),rnPc(o.x0,o.h,o.z1));g.fillStyle='#8a5a3a';g.fill();
  const off=(RNCARV*t)%.5;for(let z=o.z1-off;z>o.z0;z-=.5){const a=rnPc(o.x0,o.h,z),b=rnPc(o.x1,o.h,z);if(a&&b){g.strokeStyle='rgba(40,20,10,.4)';g.lineWidth=1;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke()}}
  const f0=rnPc(o.x0,0,o.z1),f1=rnPc(o.x1,o.h,o.z1);if(f0&&f1){g.fillStyle='#c8402a';g.fillRect(f0[0],f1[1],f1[0]-f0[0],f0[1]-f1[1]);g.fillStyle='#e0b030';for(let k=0;k<12;k++)g.fillRect(f0[0]+(f1[0]-f0[0])*k/12,f1[1],(f1[0]-f0[0])/24,f0[1]-f1[1])}
  // le toit rayé, au-dessus
  for(let z=o.z1;z>o.z0;z-=1){const a=rnPc(-2.4,2.3,z),b=rnPc(2.4,2.3,z),c=rnPc(2.4,2.3,z-1),d=rnPc(-2.4,2.3,z-1);if(!rnQuad(g,a,b,c,d))continue;g.fillStyle=Math.round(z)%2?'#c8402a':'#f2ead8';g.fill()}
  for(let z=o.z1;z>o.z0;z-=.8){for(const x of[-2.3,2.3]){const p=rnPc(x,2.25,z);if(p){const on=(Math.floor(t*4+z))%3;g.fillStyle=on?'rgba(255,230,140,.95)':'rgba(255,230,140,.35)';g.beginPath();g.arc(p[0],p[1],p[2]*.025,0,7);g.fill()}}}
  // le pilier central, côté gauche : miroirs et dorures
  {const a=rnPc(-2,0,o.z0+2),b=rnPc(-2,2.3,o.z1-2);if(a&&b){rnQuad(g,rnPc(-1.9,0,o.z0),rnPc(-1.9,0,o.z1),rnPc(-1.9,2.3,o.z1),rnPc(-1.9,2.3,o.z0));g.fillStyle='#e0c890';g.fill()}}}
function rnStall(g,o,t){const xs=o.s*1.35,xb=o.s*3.2,h=2.3,v=(x,y,z)=>rnPc(x,y,z);
  // la façade qui donne sur la rue
  if(!rnQuad(g,v(xs,0,o.z0),v(xs,0,o.z1),v(xs,h,o.z1),v(xs,h,o.z0)))return;g.fillStyle=o.wood;g.fill();
  // les planches
  g.strokeStyle='rgba(40,25,10,.35)';g.lineWidth=1;for(let z=o.z0+.25;z<o.z1;z+=.25){const a=v(xs,0,z),b=v(xs,h,z);if(a&&b){g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke()}}
  // le guichet : l'intérieur, la marchandise
  if(rnQuad(g,v(xs,.85,o.z0+.3),v(xs,.85,o.z1-.3),v(xs,1.75,o.z1-.3),v(xs,1.75,o.z0+.3))){g.fillStyle='#2a1e16';g.fill();
    const R=mulberry(o.z0*7|0);for(let k=0;k<10;k++){const z=o.z0+.4+R()*(o.z1-o.z0-.8),p=v(xs,.95+R()*.2,z);if(!p)continue;g.fillStyle=o.name==='CHURROS'?'#d8a050':o.name==='BIJOUX'?'#f0d060':o.name==='FLEURS'?pick2(R,['#e04a5a','#f0c030','#c060c0']):o.name==='FROMAGES'?'#f0d890':o.name==='CHARCUTERIE'?'#8a2a22':pick2(R,['#c8a050','#a8402a','#5a8a4a','#e0c080']);g.beginPath();g.arc(p[0],p[1],p[2]*.05,0,7);g.fill()}
    if(o.name==='CHARCUTERIE'||o.name==='CHURROS'){for(let z=o.z0+.5;z<o.z1-.4;z+=.35){const a=v(xs,1.7,z),b=v(xs,1.35,z);if(a&&b){g.strokeStyle=o.name==='CHURROS'?'#d8a050':'#7a2a22';g.lineWidth=a[2]*.04;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke()}}}}
  // le comptoir, l'auvent rayé
  if(rnQuad(g,v(xs,.85,o.z0+.2),v(xs,.85,o.z1-.2),v(xs-o.s*.25,.85,o.z1-.2),v(xs-o.s*.25,.85,o.z0+.2))){g.fillStyle=shade(o.wood,.15);g.fill()}
  for(let k=0;k<6;k++){const z0=o.z0+k*(o.z1-o.z0)/6,z1=z0+(o.z1-o.z0)/6;if(rnQuad(g,v(xs,2.05,z0),v(xs,2.05,z1),v(xs-o.s*.45,1.8,z1),v(xs-o.s*.45,1.8,z0))){g.fillStyle=k%2?'#f2ead8':o.col;g.fill()}}
  // le pignon, la façade côté caméra
  if(rnQuad(g,v(xs,h,o.z1),v(xb,h,o.z1),v(xb,0,o.z1),v(xs,0,o.z1))){g.fillStyle=shade(o.wood,-.15);g.fill()}
  const r0=v(xs-o.s*.15,h,o.z1),r1=v((xs+xb)/2,h+.7,o.z1),r2=v(xb+o.s*.15,h,o.z1);if(r0&&r1&&r2){g.fillStyle='#6a3a26';poly(g,[r0[0],r0[1],r1[0],r1[1],r2[0],r2[1]]);g.fill()}
  // l'enseigne en drapeau, face à la caméra
  {const a=v(xs,2.35,o.z1-.15),b=v(xs-o.s*.85,2.05,o.z1-.15);if(a&&b){const x0=Math.min(a[0],b[0]),w=Math.abs(b[0]-a[0]),hh=b[1]-a[1];g.fillStyle='#efe5cc';rr(g,x0,a[1],w,hh,3);g.fill();g.strokeStyle='#5a3a26';g.lineWidth=Math.max(1,a[2]*.008);g.strokeRect(x0+2,a[1]+2,w-4,hh-4);
    g.fillStyle='#3a2418';g.textAlign='center';let fs=hh*.55;g.font='bold '+fs+'px '+F_DISP;while(fs>4&&g.measureText(o.name).width>w*.88){fs-=.5;g.font='bold '+fs+'px '+F_DISP}g.fillText(o.name,x0+w/2,a[1]+hh*.7)}}}
function rnGarland(g,o,t){const a=rnP(-1.4,2.6,o.z),b=rnP(1.4,2.6,o.z),m=rnP(0,2.25,o.z);if(!a||!b||!m)return;g.strokeStyle='rgba(40,30,20,.7)';g.lineWidth=Math.max(1,a[2]*.006);g.beginPath();g.moveTo(a[0],a[1]);g.quadraticCurveTo(m[0],m[1]*2-(a[1]+b[1])/2,b[0],b[1]);g.stroke();
  for(let k=1;k<12;k++){const u=k/12,x=(1-u)*(1-u)*a[0]+2*u*(1-u)*m[0]+u*u*b[0],y=(1-u)*(1-u)*a[1]+2*u*(1-u)*(m[1]*2-(a[1]+b[1])/2)+u*u*b[1];g.fillStyle=['#c8402a','#f2ead8','#3a6aa8','#e0b030'][k%4];const s=a[2]*.05;poly(g,[x-s*.6,y,x+s*.6,y,x,y+s*1.2]);g.fill()}}
/* les vasques de la fontaine : un pied de pierre, une coupe, de l'eau dedans, des jets */
function rnVasque(g,o,t){const zc=(o.z0+o.z1)/2,rx=(o.x1-o.x0)/2,xm=(o.x0+o.x1)/2,p=rnP(xm,o.h,zc),pf=rnP(xm,o.h,o.z1),pb=rnP(xm,o.h,o.z0),b=rnP(xm,.28,zc);if(!p||!pf||!pb||!b)return;const s=p[2],ry=Math.max(3,(pf[1]-pb[1])/2);
  // le pied
  g.fillStyle='#a8a090';g.fillRect(p[0]-s*.06,p[1]+s*.1,s*.12,b[1]-p[1]-s*.1);g.fillStyle='rgba(0,0,0,.15)';g.fillRect(p[0]+s*.02,p[1]+s*.1,s*.04,b[1]-p[1]-s*.1);
  // la coupe
  g.fillStyle='#b8b0a0';g.beginPath();g.ellipse(p[0],p[1],rx*s,ry,0,0,Math.PI);g.lineTo(p[0]+rx*s*.25,p[1]+s*.16);g.lineTo(p[0]-rx*s*.25,p[1]+s*.16);g.closePath();g.fill();
  g.fillStyle='#cfc8b8';g.beginPath();g.ellipse(p[0],p[1],rx*s,ry,0,0,7);g.fill();
  g.fillStyle='rgba(120,170,190,.9)';g.beginPath();g.ellipse(p[0],p[1],rx*s*.85,ry*.8,0,0,7);g.fill();
  g.strokeStyle='rgba(240,250,255,.6)';g.lineWidth=1;g.beginPath();g.ellipse(p[0],p[1],rx*s*.5+Math.sin(t*3)*3,ry*.45,0,0,7);g.stroke();
  // l'eau qui déborde
  g.strokeStyle='rgba(200,230,240,.55)';g.lineWidth=Math.max(1,s*.006);for(let k=-3;k<=3;k++){const x=p[0]+k*rx*s*.28;g.beginPath();g.moveTo(x,p[1]+ry*.6);g.lineTo(x+Math.sin(t*5+k)*2,p[1]+s*(o.h-.3)*.9);g.stroke()}
  if(o.draw==='top'){g.strokeStyle='rgba(220,240,250,.85)';g.lineWidth=Math.max(1.5,s*.012);for(let k=-2;k<=2;k++){g.beginPath();g.moveTo(p[0],p[1]-s*.02);g.quadraticCurveTo(p[0]+k*s*.08,p[1]-s*(.32+Math.sin(t*6+k)*.02),p[0]+k*s*.22,p[1]+s*.05);g.stroke()}}}

