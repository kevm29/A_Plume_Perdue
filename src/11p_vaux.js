/* =========================================================
   4-3 · L'ORAGE — la remorque, le souvenir, la sortie
   ---------------------------------------------------------
   Un niveau fait de scènes enchaînées, chacune avec son décor et sa caméra :
     van    : la nuit, sur l'A4, sous l'orage : Raymond dans la remorque d'une camionnette d'espaces verts, au milieu
              des outils. Un seul petit saut, l'aile tire, on ne peut pas sortir. Au 3e éclair, le brouillard ;
              au 5e, un grand éclair blanc… et le souvenir.
     cart   : fin mai 1916 : une voiture militaire tirée par deux chevaux, dans une forêt dense, sur une piste cahotante.
              Raymond est dans son panier, sur les genoux de Lucien. E : il lui pince le doigt.
     room   : fort de Vaux, nuit du 2 juin : la chambrée voûtée, les lits de fer à deux étages, la petite fenêtre
              où passent les éclairs des obus ; Lucien écrit à la bougie. E : Raymond roucoule qu'il veut sortir.
     yard   : 3 juin, avant l'aube : la cour du fort, la façade de la caserne. Lucien lance Raymond.
     flight : 11q_vaux_vol.js — le vol vers l'ouest, jusqu'à la balle.
     van2   : la camionnette arrêtée sur la bande d'arrêt d'urgence ; on peut sauter dehors ; elle repart ;
              à droite, le panneau de sortie.
   ========================================================= */
THEMES.vaux={outdoor:true,far:'train',horizon:'road',sky:['#04060d','#0c1222','#1a2236'],celestial:'none',fog:'#10141f',dark:0,weather:'none',
  floor:'#26262a',floorTop:'#4a4a52',type:'stone',x:'none',d:'drape',shelf:'girder',spike:'spikes',spikeCol:'#3a3e46',spikeBase:'#2a2c32',walker:'none',flyer:'none',awning:'#2f5a7a',props:[],noFore:true};
let V=null;
function vxSongOff(){curName='__off';CUR=null}
const VX_CARDS={
  cart:["SUR LA ROUTE DU FORT DE VAUX · FIN MAI 1916","Un cinquième éclair est tombé tout près. Raymond a perdu connaissance. Quand il a rouvert les yeux, il n'y avait plus d'autoroute : il y avait des arbres, des chevaux, et…"],
  room:["FORT DE VAUX · NUIT DU 2 JUIN 1916","Dehors, les obus tombaient sans arrêt. Cela faisait plusieurs jours, maintenant. Dans la chambrée, ceux qui pouvaient dormir dormaient. Lucien, lui, écrivait."],
  yard:["3 JUIN 1916 · AU PETIT MATIN","À l'aube, Lucien a sorti Raymond du panier. Raymond se souvient de ses mains : elles tremblaient un peu."],
  van2:["","Raymond s'est réveillé dans la remorque, trempé jusqu'aux os. Du bout de l'aile, il a cherché sa blessure. Il ne l'a pas trouvée. Il en a conclu qu'il avait rêvé, ce que le règlement interdit en service."]
};

/* ---------- état, enchaînement des scènes ---------- */
function vauxStart(){
  V={sc:null,t:0,fade:1,out:null,parts:[],bub:[],shake:0,flash:0};G.quip=null;G.quipQ=[];G.chase=false;G.hintI=-1;
  vxGo('van');
}
function vxGo(sc){V.sc=sc;V.t=0;V.s={};V.bub=[];V.parts=[];V.flash=0;V.shake=0;V.fade=1;G.quip=null;G.quipQ=[];
  if(sc==='van'){vanInit(false);setSong('vx-nuit')}
  else if(sc==='van2'){vanInit(true);setSong('vx-reveil')}
  else if(sc==='cart'){cartInit();setSong('vx-route')}
  else if(sc==='room'){roomInit();setSong('vx-chambree')}
  else if(sc==='yard'){yardInit();setSong('vx-aube')}
  else if(sc==='flight'){vfInit(true);setSong('vx-vol')}
}
function vxCardGo(key,next){const c=VX_CARDS[key];V.sc='card';V.t=0;V.card={sub:c[0],text:c[1],next};G.quip=null;G.quipQ=[];vxSongOff()}
function vxFadeTo(fn,dur){if(V.out)return;V.out={t:0,dur:dur||1,fn}}
function vxBubble(x,y,text,col,dur){V.bub.push({x,y,text,t:0,max:dur||Math.max(2.6,1.2+text.length*.05),col:col||'#2a2420',rot:(rnd()-.5)*.16})}
function vauxUpdate(dt){
  V.t+=dt;if(V.fade>0&&!V.out)V.fade=Math.max(0,V.fade-dt*1.6);V.shake=Math.max(0,V.shake-dt*30);V.flash=Math.max(0,V.flash-dt*1.8);
  if(V.out){V.out.t+=dt;if(V.out.t>=V.out.dur){const f=V.out.fn;V.out=null;V.fade=1;f()}}
  for(let i=V.bub.length-1;i>=0;i--){const b=V.bub[i];b.t+=dt;if(b.t>b.max)V.bub.splice(i,1)}
  for(let i=V.parts.length-1;i>=0;i--){const p=V.parts[i];p.life+=dt;if(p.life>=p.max){V.parts.splice(i,1);continue}p.vy+=(p.g!=null?p.g:600)*dt;p.vx*=1-dt*(p.drag||0);p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.rot!=null)p.rot+=(p.vr||0)*dt}
  const go=pressed.has('ok')||pressed.has('jump')||pressed.has('act')||G.click;
  switch(V.sc){
    case'card':if(!V.out&&((V.t>1.6&&go)||V.t>8.5))vxFadeTo(V.card.next,.6);break;
    case'van':case'van2':vanUpdate(dt);break;
    case'cart':cartUpdate(dt);break;
    case'room':roomUpdate(dt);break;
    case'yard':yardUpdate(dt);break;
    case'flight':case'shot':case'wound':vfUpdate(dt);break;
  }
}
function vauxRender(t){
  ctx.save();if(V.shake>0)ctx.translate((rnd()-.5)*V.shake,(rnd()-.5)*V.shake);
  switch(V.sc){
    case'van':case'van2':vanRender(t);break;
    case'cart':cartRender(t);break;
    case'room':roomRender(t);break;
    case'yard':yardRender(t);break;
    case'flight':case'shot':case'wound':vfRender(t);break;
    case'card':ctx.fillStyle='#0b0a0c';ctx.fillRect(0,0,W,H);break;
  }
  ctx.restore();
  if(V.sc==='card')vxCard(V.card.text,Math.min(1,V.t*1.6),t,V.card.sub);
  if(V.flash>0){ctx.fillStyle='rgba(235,240,255,'+Math.min(1,V.flash)+')';ctx.fillRect(0,0,W,H)}
  renderGrain();
  const cine=V.sc==='cart'||V.sc==='room'||V.sc==='yard'||V.sc==='wound'||V.sc==='shot';
  if(cine){ctx.fillStyle='rgba(0,0,0,.9)';ctx.fillRect(0,0,W,40);ctx.fillRect(0,H-40,W,40)}
  if(V.sc==='van'||V.sc==='van2')renderHUD();
  else if(V.sc==='flight'||V.sc==='shot')vxQuipBand();
  else{G.homeBox=null;if(V.sc!=='card')drawQuip(cine?52:20)}
  const fo=V.out?Math.min(1,V.out.t/V.out.dur):0,fa=Math.max(fo,V.fade);
  if(fa>0){ctx.fillStyle='rgba(11,10,12,'+fa+')';ctx.fillRect(0,0,W,H)}
}
function vxDrawBubbles(g){for(const b of V.bub){const a=Math.min(1,b.t*6,(b.max-b.t)*4);g.save();g.globalAlpha=a;g.translate(b.x,b.y-b.t*10);g.rotate(b.rot);g.font='15px '+F_DISP;const w=g.measureText(b.text).width+18;
  g.fillStyle='rgba(0,0,0,.28)';rr(g,-w/2+2,-10,w,24,5);g.fill();g.fillStyle='#ece3cc';rr(g,-w/2,-12,w,24,5);g.fill();
  g.beginPath();g.moveTo(-5,12);g.lineTo(0,20);g.lineTo(5,12);g.fill();g.fillStyle=b.col;g.textAlign='center';g.fillText(b.text,0,5);g.restore()}}
function vxParts(g){for(const p of V.parts){const a=1-p.life/p.max;
  if(p.k==='feather'){g.save();g.translate(p.x,p.y);g.rotate(p.rot||0);g.fillStyle=rgba('#9aa2b3',a);g.beginPath();g.ellipse(0,0,6,2.2,0,0,7);g.fill();g.strokeStyle=rgba('#6a7280',a);g.lineWidth=.6;g.beginPath();g.moveTo(-6,0);g.lineTo(6,0);g.stroke();g.restore()}
  else if(p.k==='dust'){g.fillStyle=rgba(p.col||'#cbbfa6',a*(p.a||.5));g.beginPath();g.arc(p.x,p.y,(p.r||3)+p.life*(p.grow||10),0,7);g.fill()}
  else if(p.k==='drop'){g.fillStyle=rgba(p.col||'#d8e4ee',a*.8);g.beginPath();g.arc(p.x,p.y,p.r||1.5,0,7);g.fill()}
  else if(p.k==='clod'){g.save();g.translate(p.x,p.y);g.rotate(p.rot||0);g.fillStyle=rgba(p.col||'#4a3a2a',Math.min(1,a*2));g.fillRect(-p.r,-p.r*.7,p.r*2,p.r*1.4);g.restore()}
  else if(p.k==='spark'){g.strokeStyle=rgba('#ffd890',a);g.lineWidth=1.4;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x-p.vx*.03,p.y-p.vy*.03);g.stroke()}
  else if(p.k==='smoke'){g.fillStyle=rgba(p.col||'#8a8a88',a*(p.a||.35));g.beginPath();g.arc(p.x,p.y,(p.r||6)+p.life*(p.grow||20),0,7);g.fill()}}}

/* =========================================================
   LA CAMIONNETTE (2026)
   ========================================================= */
const VAN={floor:392,board:36,x0:300,x1:560,road:432,rear:592,len:2500,sign:2290};
function vanInit(stopped){const s=V.s;Object.assign(s,{stopped,rx:stopped?400:440,ry:VAN.floor,vx:0,vy:0,f:1,on:true,flaps:0,scroll:0,cam:0,k:0,fog:stopped?.12:0,
  flashes:[3.2,7.4,11.6,15.4,19.2],white:0,vanX:0,vanV:0,out:false,leaveT:-1,gone:false,said:{},jumps:0,bolt:null,bump:0,spray:0,closed:false});
  if(stopped){s.said.start=1;setTimeout(()=>{},0);say("Les nôtres. Ce sont les nôtres qui m'ont tiré dessus.",4);sayQueueVx([["RAYMOND","Un rêve. Rien qu'un rêve. Et l'aile ne tire plus : je sors d'ici.",4]])}
  else say("Une remorque, une pelle, une pioche… et moi. On roule toujours vers l'ouest, sous l'orage.",4.4)}
function sayQueueVx(arr){G.quipQ=G.quipQ||[];for(const a of arr)G.quipQ.push(a)}
function vanTrailerX(){return V.s.vanX}
function vanUpdate(dt){
  const s=V.s,stopped=s.stopped,left=keys.has('left'),right=keys.has('right'),dir=(right?1:0)-(left?1:0);
  if(!stopped){s.scroll+=760*dt;s.bump+=dt;
    // les éclairs, le brouillard
    if(s.k<5&&V.t>=s.flashes[s.k]){s.k++;const big=s.k===5;V.flash=Math.max(V.flash,big?1.25:.75);s.bolt={x:120+rnd()*720,t:0,seed:(rnd()*1e6)|0};if(!G.sim)setTimeout(()=>SFX.thunder(big?1.3:.9),big?60:380);
      if(s.k===2)say("L'orage. Comme au fort. Je n'aime pas l'orage.",3.6);
      if(s.k===3)say("Du brouillard, maintenant. Sur une route. On n'y voit plus rien… comme là-bas.",4);
      if(s.k===4)say("Le tonnerre. On dirait le canon. Je reconnais ce bruit-là.",3.6);
      if(big){s.white=.01;s.closed=true}}
    if(s.k>=3)s.fog=Math.min(.78,s.fog+dt*.16);
    if(s.white>0){s.white+=dt*.9;if(s.white>=1&&!V.out)vxFadeTo(()=>vxCardGo('cart',()=>vxGo('cart')),.5)}
  }else{
    if(s.out&&s.leaveT>=0){s.leaveT+=dt;if(s.leaveT>1.1){s.vanV=Math.min(620,s.vanV+dt*260);s.vanX+=s.vanV*dt}}
    if(!s.gone&&s.vanX>0&&VAN.x0+s.vanX-s.cam>W+40)s.gone=true;
  }
  if(s.white>0)return;
  // Raymond
  const inTrailer=x=>x>VAN.x0+s.vanX+6&&x<VAN.x1+s.vanX-6;
  const acc=s.ry>=VAN.floor-1||s.ry>=VAN.road-1?2000:1400;
  if(dir){s.vx=clamp(s.vx+dir*acc*dt,-210,210);s.f=dir}else{const f=2400*dt;s.vx=Math.abs(s.vx)<=f?0:s.vx-Math.sign(s.vx)*f}
  const ground=inTrailer(s.rx)&&s.ry<=VAN.floor+1?VAN.floor:VAN.road,onG=Math.abs(s.ry-ground)<1&&s.vy>=0;
  if(pressed.has('jump')){
    if(onG){s.vy=stopped?-640:-310;s.flaps=0;SFX.jump();s.jumps++;
      if(!stopped&&!s.said.wing){s.said.wing=1;say("Mon aile me tire. Impossible de sortir de là-dedans.",3.8)}
      else if(!stopped&&s.jumps>3&&rnd()<.35)say(pick(["L'aile ne veut pas. Elle tire jusque dans l'épaule.","Un pigeon voyageur coincé dans une brouette géante. Le règlement n'a pas prévu ça.","Encore un bond de puce. C'est tout ce que j'ai."]),3.4)}
    else if(stopped&&s.flaps<2){s.vy=-FLAPV;s.flaps++;SFX.flap()}
    else if(!stopped&&!s.said.wing2){s.said.wing2=1;say("Non. L'aile tire. Je ne peux pas battre.",3)}}
  s.vy=Math.min(900,s.vy+GRAV*dt);
  const held=keys.has('jump');if(stopped&&held&&s.vy>0)s.vy=Math.min(s.vy,GLIDE);
  let nx=s.rx+s.vx*dt,ny=s.ry+s.vy*dt;
  // les ridelles : pleines jusqu'à leur bord ; on ne passe que par-dessus
  const top=VAN.floor-VAN.board,x0=VAN.x0+s.vanX+10,x1=VAN.x1+s.vanX-10;
  if(ny>top+2){if(s.rx>=x0-1&&s.rx<=x1+1){nx=clamp(nx,x0,x1)}else if(s.rx<x0&&nx>x0-22)nx=x0-22;else if(s.rx>x1&&nx<x1+22)nx=x1+22}
  // la camionnette elle-même : un mur, tant qu'elle est là
  if(!s.gone){const vr=VAN.rear+s.vanX-12;if(nx>vr)nx=vr}
  nx=clamp(nx,30,stopped?VAN.len:VAN.x1);
  const g2=(nx>=x0-1&&nx<=x1+1)?VAN.floor:VAN.road;
  if(ny>=g2&&s.ry<=g2+1){ny=g2;if(s.vy>260)SFX.land();s.vy=0}else if(ny>VAN.road){ny=VAN.road;s.vy=0}
  s.rx=nx;s.ry=ny;
  if(stopped){
    if(!s.out&&s.ry>=VAN.road-1&&s.vy===0){s.out=true;s.leaveT=0;if(!G.sim){noise(1.4,180,.25,'lowpass',.6);tone(60,1.6,'sawtooth',.03,90,.6)}}
    if(s.out&&s.leaveT>1.3&&!s.said.go){s.said.go=1;say("Elle repart sans moi. Tant mieux : je n'ai rien signé.",3.4)}
    s.cam=clamp(s.rx-380,0,VAN.len-W+80);
    if(s.gone&&!s.said.sign&&s.rx>VAN.sign-700){s.said.sign=1;say("Une sortie. Quitter cette route avant qu'elle me ramène là-bas.",4)}
    if(s.gone&&s.rx>VAN.sign-30&&!V.won){V.won=true;winLevel()}
  }
}
/* ---------- décor : l'autoroute la nuit, sous l'orage ---------- */
function vanSky(g,t,s){
  const sk=g.createLinearGradient(0,0,0,360);sk.addColorStop(0,'#05070e');sk.addColorStop(.6,'#11172a');sk.addColorStop(1,'#1e2436');g.fillStyle=sk;g.fillRect(0,0,W,380);
  const fl=Math.min(1,V.flash);
  // les nuages d'orage, en couches
  for(let k=0;k<3;k++){const R=mulberry(51+k),off=(s.scroll*(.01+k*.012)+s.cam*(.05+k*.04))%1400;
    for(let i=0;i<18;i++){const x=((R()*1400-off)%1400+1400)%1400-200,y=40+k*60+R()*70,w=140+R()*220,h=30+R()*40;
      g.fillStyle=k===0?'rgba(30,34,52,.85)':k===1?'rgba(22,26,40,.9)':'rgba(16,18,30,.95)';g.beginPath();g.ellipse(x,y,w,h,0,0,7);g.fill();
      if(fl>0){g.fillStyle='rgba(190,200,235,'+(fl*(.35-k*.08))+')';g.beginPath();g.ellipse(x,y-h*.35,w*.85,h*.5,0,0,7);g.fill()}}}
  // l'éclair lui-même
  if(s.bolt&&V.flash>.15){const R=mulberry(s.bolt.seed);let x=s.bolt.x,y=0;g.strokeStyle='rgba(235,240,255,'+Math.min(1,V.flash)+')';g.lineWidth=3;g.beginPath();g.moveTo(x,y);
    while(y<330){y+=18+R()*26;x+=(R()-.5)*50;g.lineTo(x,y);if(R()<.25){g.moveTo(x,y);g.lineTo(x+(R()-.5)*90,y+40);g.moveTo(x,y)}}g.stroke();g.lineWidth=10;g.strokeStyle='rgba(160,180,255,'+V.flash*.25+')';g.stroke()}
}
function vanLand(g,t,s){
  const p=(k)=>s.scroll*k+s.cam*k;
  // les collines, les éoliennes (feux rouges qui clignotent), les haies
  g.fillStyle='#0b0e16';g.beginPath();g.moveTo(0,380);for(let x=0;x<=W;x+=20){const u=x+p(.04);g.lineTo(x,318+Math.sin(u*.004)*14+Math.sin(u*.011)*6)}g.lineTo(W,380);g.fill();
  for(let i=-1;i<6;i++){const base=i*260-(p(.06)%260),x=base+60,y=312;g.fillStyle='#262a36';g.fillRect(x-1.5,y-80,3,80);
    g.save();g.translate(x,y-80);g.rotate(t*1.4+i);g.fillStyle='#2e3240';for(let k=0;k<3;k++){g.rotate(Math.PI*2/3);g.fillRect(-1.5,0,3,-44)}g.restore();
    if(Math.sin(t*3+i)>.2){g.fillStyle='rgba(255,40,30,.9)';g.beginPath();g.arc(x,y-82,2.4,0,7);g.fill();g.fillStyle='rgba(255,40,30,.2)';g.beginPath();g.arc(x,y-82,8,0,7);g.fill()}}
  g.fillStyle='#080a10';for(let i=-1;i<20;i++){const x=i*60-(p(.2)%60);const R=mulberry(i+Math.floor(p(.2)/60)*31);g.beginPath();g.ellipse(x,344,26+R()*20,10+R()*12,0,Math.PI,0);g.fill()}
  g.fillRect(0,340,W,14);
  // la chaussée d'en face : les phares qui arrivent, très vite
  g.fillStyle='#14161c';g.fillRect(0,352,W,18);
  for(let i=0;i<4;i++){const per=1700+i*370,x=W+200-((p(1.85)+i*900+t*(s.stopped?600:0))%per);if(x<-60||x>W+60)continue;
    g.fillStyle='rgba(255,250,225,.95)';g.beginPath();g.arc(x,362,2.4,0,7);g.arc(x+16,362,2.4,0,7);g.fill();
    const hg=g.createRadialGradient(x+8,362,1,x+8,362,60);hg.addColorStop(0,'rgba(255,245,210,.35)');hg.addColorStop(1,'rgba(255,245,210,0)');g.fillStyle=hg;g.fillRect(x-52,302,120,120)}
  // le terre-plein central : glissière, poteaux, catadioptres orange
  g.fillStyle='#1c1e24';g.fillRect(0,368,W,18);g.fillStyle='#565a62';g.fillRect(0,370,W,6);g.fillStyle='#7a7e86';g.fillRect(0,370,W,1.5);
  for(let x=-(p(.95)%48);x<W;x+=48){g.fillStyle='#34363c';g.fillRect(x,375,3,11);g.fillStyle='#e8a030';g.fillRect(x,372,3,3)}
  // le portique « PARIS » (une fois)
  {const gx=900+2600-p(.95);if(gx>-300&&gx<W+300){g.fillStyle='#2a2c30';g.fillRect(gx-4,190,8,190);g.fillRect(gx+330,190,8,190);g.fillRect(gx,196,334,6);
    g.fillStyle='#1e5aa8';rr(g,gx+20,204,290,70,6);g.fill();g.strokeStyle='#e8ecf4';g.lineWidth=2;rr(g,gx+25,209,280,60,4);g.stroke();
    g.fillStyle='#fff';g.font='bold 24px '+F_DISP;g.textAlign='left';g.fillText('PARIS',gx+44,248);g.fillStyle='#d83020';rr(g,gx+190,224,96,30,4);g.fill();g.fillStyle='#fff';g.font='bold 18px '+F_DISP;g.fillText('A 4',gx+214,246)}}
  // notre chaussée : mouillée, les tirets, la ligne de rive
  const rg=g.createLinearGradient(0,386,0,H);rg.addColorStop(0,'#24262c');rg.addColorStop(1,'#16171b');g.fillStyle=rg;g.fillRect(0,386,W,H-386);
  g.fillStyle='rgba(120,130,150,.08)';for(let i=0;i<10;i++){const x=((i*173-p(1))%1100+1100)%1100-100;g.fillRect(x,440+((i*37)%70),120+((i*53)%80),3)}
  g.fillStyle='rgba(230,230,220,.75)';for(let x=-(p(1)%160);x<W;x+=160)g.fillRect(x,404,70,5);
  g.fillRect(0,500,W,5);
  if(s.stopped){g.fillStyle='rgba(230,230,220,.55)';for(let x=-(p(1)%80);x<W;x+=80)g.fillRect(x,476,40,4)}
}
function vanRender(t){
  const s=V.s,cam=s.stopped?s.cam:0;
  vanSky(ctx,t,s);vanLand(ctx,t,s);
  const by=s.stopped?0:Math.sin(t*19)*1.1+Math.max(0,Math.sin(t*3.1))*1.4;
  ctx.save();ctx.translate(-cam,0);
  // la camionnette et sa remorque
  const ox=s.vanX;ctx.save();ctx.translate(ox,by);vanDraw(ctx,t,s);ctx.restore();
  ctx.save();ctx.translate(ox,by*1.4);trailerBack(ctx,t);ctx.restore();
  // Raymond
  const air=s.ry<VAN.floor-1&&s.ry<VAN.road-1;
  const inT=s.rx>VAN.x0+ox&&s.rx<VAN.x1+ox&&s.ry<=VAN.floor+1;
  drawRaymond(ctx,s.rx,s.ry+(inT?by*1.4:0),{f:s.f,t,walk:Math.min(1,Math.abs(s.vx)/200)*(air?0:1),air,flap:s.flaps&&s.vy<0?.2:0,glide:s.stopped&&keys.has('jump')&&s.vy>0,wear:wear(),size:1.5,eyeClosed:s.closed});
  ctx.save();ctx.translate(ox,by*1.4);trailerFront(ctx,t);ctx.restore();
  // la sortie
  if(s.stopped)vanSign(ctx,VAN.sign,t);
  ctx.restore();
  // la pluie, les éclaboussures, le brouillard
  ctx.save();ctx.strokeStyle='rgba(190,205,228,.36)';ctx.lineWidth=1.1;ctx.beginPath();
  for(const d of rainDrops){const sp=1000*d.s,x=((d.x-t*sp*.35-cam*.3)%W+W)%W,y=((d.y+t*sp)%(H+40))-20;ctx.moveTo(x,y);ctx.lineTo(x-d.l*.4,y+d.l*1.1)}ctx.stroke();
  for(let i=0;i<22;i++){const x=((i*97+t*(s.stopped?0:760)*.0)%W),ph=(t*3+i*.37)%1,y=392+((i*41)%140);ctx.strokeStyle='rgba(200,215,235,'+(.4*(1-ph))+')';ctx.beginPath();ctx.ellipse((x+i*53)%W,y,2+ph*6,1+ph*2,0,0,7);ctx.stroke()}ctx.restore();
  if(s.fog>0){ctx.fillStyle='rgba(150,156,168,'+(s.fog*.55)+')';ctx.fillRect(0,0,W,H);const fg=ctx.createLinearGradient(0,300,0,460);fg.addColorStop(0,'rgba(170,176,188,0)');fg.addColorStop(.5,'rgba(170,176,188,'+s.fog*.45+')');fg.addColorStop(1,'rgba(170,176,188,0)');ctx.fillStyle=fg;ctx.fillRect(0,300,W,160)}
  if(s.white>0){ctx.fillStyle='rgba(245,247,255,'+Math.min(1,s.white)+')';ctx.fillRect(0,0,W,H)}
}
/* la camionnette blanche d'un paysagiste : on voit l'arrière et le flanc, la cabine sort du cadre */
function vanDraw(g,t,s){
  const x0=VAN.rear,top=236,bot=402;
  // la caisse
  const bg=g.createLinearGradient(0,top,0,bot);bg.addColorStop(0,'#e8eae6');bg.addColorStop(.7,'#c8cbc6');bg.addColorStop(1,'#9a9e98');g.fillStyle=bg;
  g.beginPath();g.moveTo(x0,bot);g.lineTo(x0,top+16);g.quadraticCurveTo(x0,top,x0+16,top);g.lineTo(1120,top);g.lineTo(1120,bot);g.closePath();g.fill();
  g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=1.5;g.beginPath();g.moveTo(x0+6,top+6);g.lineTo(x0+6,bot-8);g.moveTo(780,top+10);g.lineTo(780,bot-30);g.moveTo(x0+6,330);g.lineTo(1120,330);g.stroke();
  // les feux arrière, le gyrophare éteint, le pare-chocs
  const haz=s.stopped&&!s.out?(Math.sin(t*8)>0):s.stopped&&s.leaveT<1.1&&Math.sin(t*8)>0;
  g.fillStyle='#6a1410';rr(g,x0-3,268,9,44,3);g.fill();g.fillStyle=s.stopped?'#8a2014':'#e83020';rr(g,x0-2,270,7,22,2);g.fill();g.fillStyle=haz?'#ffb030':'#7a5a20';rr(g,x0-2,294,7,10,2);g.fill();
  if(!s.stopped||haz){const lg=g.createRadialGradient(x0,288,2,x0,288,60);lg.addColorStop(0,haz?'rgba(255,170,40,.5)':'rgba(255,40,30,.4)');lg.addColorStop(1,'rgba(255,40,30,0)');g.fillStyle=lg;g.fillRect(x0-70,228,140,120)}
  g.fillStyle='#2a2c30';g.fillRect(x0-4,388,60,12);
  // l'inscription
  g.fillStyle='#2f6a3a';g.font='bold 22px '+F_DISP;g.textAlign='left';g.fillText('VERTS PAYSAGES',640,290);g.font='italic 14px '+F_BODY;g.fillStyle='#3a5a40';g.fillText('élagage · entretien · espaces verts',646,312);
  g.fillStyle='#4a8a4a';g.beginPath();g.ellipse(624,282,10,16,-.4,0,7);g.fill();g.strokeStyle='#2f6a3a';g.lineWidth=2;g.beginPath();g.moveTo(628,296);g.lineTo(618,268);g.stroke();
  // la boue, les gouttes
  g.fillStyle='rgba(70,60,50,.35)';for(let i=0;i<30;i++){const R=mulberry(i+9);g.beginPath();g.arc(x0+R()*500,bot-R()*30,1+R()*3,0,7);g.fill()}
  g.fillStyle='rgba(255,255,255,.35)';for(let i=0;i<40;i++){const R=mulberry(i+90),y=top+((R()*170+t*40*(1+R()))%170);g.fillRect(x0+10+R()*500,y,1.2,3)}
  // la vitre latérale de la cabine, le conducteur
  g.fillStyle='#1a1e26';g.beginPath();g.moveTo(860,252);g.lineTo(950,252);g.lineTo(950,322);g.lineTo(850,322);g.closePath();g.fill();
  g.fillStyle='rgba(120,160,200,.18)';g.fillRect(860,252,90,10);
  g.fillStyle='#0c0e12';g.beginPath();g.arc(905,292,16,0,7);g.fill();g.fillRect(886,300,40,26);g.fillStyle='#1e2a3a';g.beginPath();g.ellipse(905,280,18,7,0,Math.PI,0);g.fill();
  if(s.stopped){g.fillStyle='rgba(120,200,255,.35)';g.fillRect(916,300,8,12);g.fillStyle='rgba(120,200,255,.18)';g.beginPath();g.arc(915,296,14,0,7);g.fill()}
  g.fillStyle='#2a2c30';g.fillRect(952,282,14,24);
  // les passages de roue, les roues
  for(const wx of[700,980]){g.fillStyle='#1a1b1e';g.beginPath();g.arc(wx,bot,38,Math.PI,0);g.fill();
    const rot=(s.stopped?0:t*22)+s.vanX*.03;g.fillStyle='#121214';g.beginPath();g.arc(wx,bot+4,28,0,7);g.fill();g.fillStyle='#8a8e94';g.beginPath();g.arc(wx,bot+4,14,0,7);g.fill();
    g.strokeStyle='#4a4e54';g.lineWidth=2;for(let k=0;k<5;k++){const a=rot+k*1.2566;g.beginPath();g.moveTo(wx,bot+4);g.lineTo(wx+Math.cos(a)*12,bot+4+Math.sin(a)*12);g.stroke()}
    if(!s.stopped){for(let k=0;k<4;k++){const ph=(t*4+k*.25)%1;g.fillStyle='rgba(200,210,225,'+(.25*(1-ph))+')';g.beginPath();g.arc(wx-40-ph*90,bot+14-ph*20,6+ph*18,0,7);g.fill()}}}
  // l'attelage
  g.fillStyle='#2a2c30';g.fillRect(VAN.x1-4,396,x0-VAN.x1+20,8);g.fillStyle='#4a4e54';g.beginPath();g.arc(x0+4,400,6,0,7);g.fill();
}
const TRAIL_TOOLS=[['shovel',330,-.25],['rake',372,.18],['jerry',420,0],['pick',470,-.5],['broom',512,.32],['hose',398,0],['cone',535,0]];
function trailerBack(g,t){
  const y=VAN.floor,x0=VAN.x0,x1=VAN.x1,top=y-VAN.board;
  g.fillStyle='#2c2e32';g.fillRect(x0,top-4,x1-x0,VAN.board+4);
  // la ridelle du fond, ses outils qui dépassent
  g.fillStyle='#4a4e54';g.fillRect(x0,top-6,x1-x0,6);
  for(const[k,x,a]of TRAIL_TOOLS){g.save();g.translate(x,y);g.rotate(a);
    if(k==='shovel'){g.fillStyle='#8a6a42';g.fillRect(-2,-96,4,90);g.fillStyle='#3a3e44';g.fillRect(-7,-104,14,6);g.fillStyle='#6a7078';g.beginPath();g.moveTo(-12,-6);g.lineTo(12,-6);g.lineTo(9,-38);g.lineTo(-9,-38);g.closePath();g.fill()}
    else if(k==='rake'){g.fillStyle='#9a7a4a';g.fillRect(-2,-110,4,104);g.fillStyle='#5a5e66';g.fillRect(-18,-114,36,5);for(let i=0;i<9;i++)g.fillRect(-17+i*4,-110,2,9)}
    else if(k==='pick'){g.fillStyle='#7a5a36';g.fillRect(-2,-80,4,74);g.fillStyle='#4a4e56';g.beginPath();g.moveTo(-28,-78);g.quadraticCurveTo(0,-92,28,-78);g.lineTo(28,-74);g.quadraticCurveTo(0,-86,-28,-74);g.closePath();g.fill()}
    else if(k==='broom'){g.fillStyle='#a88a5a';g.fillRect(-2,-104,4,98);g.fillStyle='#c8a050';g.beginPath();g.moveTo(-10,-104);g.lineTo(10,-104);g.lineTo(14,-126);g.lineTo(-14,-126);g.closePath();g.fill();g.strokeStyle='#8a6a30';g.lineWidth=1;for(let i=-12;i<=12;i+=3){g.beginPath();g.moveTo(i*.7,-104);g.lineTo(i,-126);g.stroke()}}
    else if(k==='jerry'){g.fillStyle='#2f5a2a';rr(g,-12,-46,24,44,4);g.fill();g.fillStyle='#3e7036';g.fillRect(-10,-40,20,3);g.fillStyle='#1e3a1a';g.fillRect(-6,-52,8,7)}
    else if(k==='hose'){g.strokeStyle='#2a7a3a';g.lineWidth=4;for(let i=0;i<3;i++){g.beginPath();g.ellipse(0,-22,26-i*5,18-i*3,0,0,7);g.stroke()}}
    else if(k==='cone'){g.fillStyle='#e8601c';poly(g,[-10,-2,-3,-40,3,-40,10,-2]);g.fill();g.fillStyle='#f0f0e8';g.fillRect(-7,-24,14,5)}
    g.restore()}
}
function trailerFront(g,t){
  const y=VAN.floor,x0=VAN.x0,x1=VAN.x1,top=y-VAN.board;
  // la ridelle de devant : contreplaqué gris dans un cadre d'acier, boulons, catadioptres
  const pg=g.createLinearGradient(0,top,0,y+14);pg.addColorStop(0,'#5c6066');pg.addColorStop(1,'#3a3d42');g.fillStyle=pg;g.fillRect(x0,top,x1-x0,VAN.board+14);
  g.strokeStyle='#2a2c30';g.lineWidth=3;g.strokeRect(x0+1.5,top+1.5,x1-x0-3,VAN.board+11);g.fillStyle='#7a7e86';g.fillRect(x0,top,x1-x0,3);
  g.fillStyle='#8a8e94';for(let x=x0+12;x<x1;x+=40){g.beginPath();g.arc(x,top+8,1.6,0,7);g.arc(x,y+6,1.6,0,7);g.fill()}
  g.fillStyle='rgba(255,255,255,.06)';g.fillRect(x0+6,top+5,x1-x0-12,4);
  g.fillStyle='#e8901c';rr(g,x0+8,y-6,16,8,2);g.fill();rr(g,x1-24,y-6,16,8,2);g.fill();
  g.fillStyle='#6a1410';g.fillRect(x0-5,top+10,6,24);g.fillStyle='#d83020';g.fillRect(x0-4,top+12,4,10);
  g.fillStyle='rgba(255,255,255,.3)';for(let i=0;i<14;i++){const R=mulberry(i+300),yy=top+((R()*40+t*30*(1+R()))%46);g.fillRect(x0+6+R()*(x1-x0-12),yy,1,3)}
  // la roue et son garde-boue
  const wx=(x0+x1)/2;g.fillStyle='#121214';g.beginPath();g.arc(wx,y+20,24,0,7);g.fill();g.fillStyle='#7a7e86';g.beginPath();g.arc(wx,y+20,10,0,7);g.fill();
  g.fillStyle='#2a2c30';g.beginPath();g.arc(wx,y+18,30,Math.PI,0);g.lineTo(wx+30,y+20);g.lineTo(wx+26,y+20);g.arc(wx,y+18,26,0,Math.PI,true);g.closePath();g.fill();
}
function vanSign(g,x,t){const b=VAN.road;
  g.fillStyle='#2a2c30';g.fillRect(x-6,b-250,8,250);g.fillRect(x+190,b-250,8,250);
  g.fillStyle='#1e5aa8';rr(g,x-24,b-340,246,108,8);g.fill();g.strokeStyle='#f0f2f6';g.lineWidth=3;rr(g,x-18,b-334,234,96,6);g.stroke();
  g.fillStyle='#fff';g.font='bold 30px '+F_DISP;g.textAlign='center';g.fillText('SORTIE',x+80,b-280);
  g.save();g.translate(x+170,b-292);g.rotate(-.7);g.fillRect(-4,-4,8,30);poly(g,[-14,-2,0,-20,14,-2]);g.fill();g.restore();
  g.font='bold 15px '+F_DISP;g.fillText('↗  à 300 m',x+80,b-252);
  // le catadioptre et les reflets de pluie
  g.fillStyle='rgba(255,255,255,.12)';g.fillRect(x-18,b-334,234,10);
}

/* =========================================================
   LA VOITURE MILITAIRE DANS LA FORÊT (fin mai 1916)
   ========================================================= */
const CART={y:356,x0:96,x1:486,wb:300};
const CART_MEN=[// x (hanche), sens, visage, posture
  {x:146,f:1,face:{skin:VX_SKIN[3],hair:VX_HAIR[2],stache:'1914',helmet:'adrian',ex:'neutral',stubble:.6,look:[.6,.1]},pose:'smoke',kit:{musette:1}},
  {x:200,f:-1,face:{skin:VX_SKIN[1],hair:VX_HAIR[1],stache:'1914',helmet:'adrian',ex:'sleep',stubble:.8,beard:0},pose:'sleep',kit:{bidon:1}},
  {x:252,f:-1,face:{skin:VX_SKIN[4],hair:VX_HAIR[6],beard:1,helmet:'adrian',ex:'worry',look:[.8,0]},pose:'bread',kit:{musette:1}},
  {x:332,f:1,lucien:1,face:{skin:'#ecc8a6',hair:'#cfae6a',stache:'croc',beardCol:'#b8954e',helmet:'adrian',ex:'sad',young:1,stubble:.35,eye:'#3f78b8',tired:1,look:[.75,.3]},pose:'basket',kit:{}},
  {x:432,f:-1,face:{skin:VX_SKIN[0],hair:VX_HAIR[3],stache:'1914',helmet:'adrian',ex:'neutral',young:1,look:[.9,.2]},pose:'hum',kit:{bidon:1}}
];
function cartInit(){Object.assign(V.s,{u:0,zoom:1,pinch:-1,said:{},hoof:0,peck:0,wince:0,gaze:0})}
function cartRoad(x){let h=Math.sin(x*.012)*3+Math.sin(x*.031+1)*2+Math.sin(x*.07+2)*1.2;
  const k=Math.floor(x/230);for(const j of[k,k+1]){const R=mulberry(j*7+3),bx=j*230+R()*160,bh=4+R()*7;h-=bh*Math.exp(-(((x-bx)/16)**2))}return h}
function cartUpdate(dt){const s=V.s;s.u+=150*dt;s.hoof-=dt;
  if(s.hoof<=0){s.hoof=.19;if(!G.sim){noise(.05,900+rnd()*300,.18,'bandpass',0,3);if(rnd()<.06)noise(.3,300,.08,'lowpass')}}
  if(V.t>2.4)s.zoom=Math.min(s.pinch>=0?2.75:2.1,s.zoom+dt*(s.pinch>=0?.32:.19));
  if(!s.said.a&&V.t>1.2){s.said.a=1;vxBubble(170,196,"Il paraît qu'au fort, y a même plus d'eau.",'#2a3a5a',3.4)}
  if(!s.said.r&&V.t>4.7){s.said.r=1;vxBubble(440,200,/*v2*/'Tais-toi, Lafitte !','#2a3a5a',2.2)}
  if(!s.said.b&&V.t>7.1){s.said.b=1;vxBubble(440,200,'♪ … ♫ …','#2a3a5a',2.6)}
  if(!s.said.c&&V.t>9.2){s.said.c=1;vxBubble(520,206,'Allez, hue !','#4a3a2a',2.2)}
  if(pressed.has('act')&&s.pinch<0&&V.t>1){s.pinch=0;s.peck=.3;s.wince=.8;if(!G.sim){tone(1500,.05,'square',.04);SFX.coo()}{const h=s.lucHead||{x:340,y:230};vxBubble(h.x-6,h.y-34,'Aïe !','#a8322d',1.6)}}
  if(s.pinch>=0){s.pinch+=dt;s.peck=Math.max(0,s.peck-dt);s.wince=Math.max(0,s.wince-dt);s.gaze=Math.min(1,s.gaze+dt*2);
    if(!s.said.l&&s.pinch>1){s.said.l=1;say("Je sais, mon vieux… Ça ne me plaît pas plus qu'à toi, d'y monter.",4.4,'LUCIEN')}
    if(s.pinch>6.2)vxFadeTo(()=>vxCardGo('room',()=>vxGo('room')),1)}
}
/* les arbres de la forêt dense (couches en boucle) */
function cartTrees(g,t,s,k,col,trunkW,yb,dens,seed){
  const off=s.u*k,per=1400;g.save();
  for(let i=-1;i<Math.ceil((W+400)/per)+1;i++){const cell=(Math.floor(off/per)+i)|0,R=mulberry(seed+cell*13);const base=i*per-(off%per);
    for(let j=0;j<dens;j++){const x=base+R()*per,w=trunkW*(.6+R()*.8),lean=(R()-.5)*.06,br=R(),bry=R(),brl=R();if(x<-120||x>W+120)continue;
      const T=mulberry(seed*31+cell*977+j*17);
      g.fillStyle=col;g.beginPath();g.moveTo(x-w/2,yb);g.lineTo(x-w*.38+lean*-600,-20);g.lineTo(x+w*.38+lean*-600,-20);g.lineTo(x+w/2,yb);g.closePath();g.fill();
      if(trunkW>20){g.fillStyle='rgba(255,255,255,.05)';g.fillRect(x-w*.3,0,w*.18,yb);g.fillStyle='rgba(0,0,0,.18)';g.fillRect(x+w*.12,0,w*.25,yb);
        g.strokeStyle='rgba(0,0,0,.14)';g.lineWidth=1;for(let y=20;y<yb;y+=14+T()*10){g.beginPath();g.moveTo(x-w*.35,y);g.quadraticCurveTo(x,y+3,x+w*.3,y-2);g.stroke()}
        if(br<.5){g.fillStyle=col;g.save();g.translate(x,60+bry*120);g.rotate(brl<.5?-.9:.9);g.fillRect(0,-3,50+brl*40,6);g.restore()}}}}
  g.restore()}
function cartRender(t){
  const s=V.s,z=s.zoom,e=Math.min(1,(z-1)/1.1),e2=clamp((z-2.1)/.65,0,1),lh=s.lucHead||{x:345,y:240},fx=lerp(lerp(480,352,e),lh.x+18,e2),fy=lerp(lerp(270,262,e),lh.y+10,e2);
  ctx.fillStyle='#1a2018';ctx.fillRect(0,0,W,H);
  ctx.save();ctx.translate(W/2,H/2);ctx.scale(z,z);ctx.translate(-fx,-fy);
  // la lumière grise qui tombe des frondaisons
  const sk=ctx.createLinearGradient(0,-200,0,420);sk.addColorStop(0,'#9aa898');sk.addColorStop(.5,'#5a6a56');sk.addColorStop(1,'#2a3426');ctx.fillStyle=sk;ctx.fillRect(-400,-300,W+800,H+600);
  for(let k=0;k<5;k++){const x=((k*260-s.u*.1)%1300+1300)%1300-200;ctx.fillStyle='rgba(220,230,200,.06)';ctx.beginPath();ctx.moveTo(x,-200);ctx.lineTo(x+60,-200);ctx.lineTo(x+220,420);ctx.lineTo(x+100,420);ctx.closePath();ctx.fill()}
  cartTrees(ctx,t,s,.12,'#5e6a5a',14,300,26,11);
  ctx.fillStyle='rgba(150,165,140,.25)';ctx.fillRect(-400,150,W+800,170);
  cartTrees(ctx,t,s,.3,'#3e4a3a',24,320,14,23);
  // le feuillage d'en haut
  ctx.fillStyle='#24301f';for(let i=0;i<24;i++){const x=((i*90-s.u*.5)%2160+2160)%2160-300;ctx.beginPath();ctx.ellipse(x,-110+((i*37)%50),90,60,0,0,7);ctx.fill()}
  ctx.fillStyle='#2f3d29';for(let i=0;i<18;i++){const x=((i*120+40-s.u*.55)%2160+2160)%2160-300;ctx.beginPath();ctx.ellipse(x,-70+((i*53)%40),70,40,0,0,7);ctx.fill()}
  cartTrees(ctx,t,s,.6,'#2a3326',40,350,7,37);
  // les fougères, les ronces, la piste et ses ornières
  ctx.fillStyle='#2a3a22';for(let i=0;i<60;i++){const x=((i*41-s.u*.8)%2460+2460)%2460-300,y=340+((i*13)%14);ctx.beginPath();ctx.moveTo(x,y+12);for(let k=-3;k<=3;k++){ctx.quadraticCurveTo(x+k*6,y-6-Math.abs(k)*-2,x+k*9,y-18+Math.abs(k)*5)}ctx.closePath();ctx.fill()}
  const rg=ctx.createLinearGradient(0,350,0,560);rg.addColorStop(0,'#5a4a36');rg.addColorStop(1,'#2e261c');ctx.fillStyle=rg;
  ctx.beginPath();ctx.moveTo(-400,620);for(let x=-400;x<=W+400;x+=12)ctx.lineTo(x,CART.y+30+cartRoad(x+s.u));ctx.lineTo(W+400,620);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(30,22,14,.5)';ctx.lineWidth=3;for(const dy of[44,70]){ctx.beginPath();for(let x=-400;x<=W+400;x+=12)ctx.lineTo(x,CART.y+dy+cartRoad(x+s.u)*.6);ctx.stroke()}
  for(let i=0;i<40;i++){const R=mulberry(i*3+Math.floor((s.u)/1600)),x=((i*97-s.u)%1600+1600)%1600-300,y=CART.y+40+((i*29)%60);ctx.fillStyle=i%5===0?'rgba(150,170,180,.35)':'#6a5a46';ctx.beginPath();ctx.ellipse(x,y,i%5===0?22:3+R()*4,i%5===0?4:2+R()*2,0,0,7);ctx.fill()}
  // l'attelage : deux chevaux de trait, côte à côte
  const yR=cartRoad(CART.x0+60+s.u),yF=cartRoad(CART.x1-40+s.u),ang=Math.atan2(yF-yR,CART.wb)*.8,cy=CART.y+(yR+yF)/2;
  const hb1=cartRoad(760+s.u)*.6,hb2=cartRoad(782+s.u)*.6;
  vxHorse(ctx,738,CART.y+38+hb2-8,1.16,1,t+.13,{col:'#3a271e',mane:'#0e0a08',leather:'#160e08',rate:9.4,ph:1,traceTo:-150});
  const hz=vxHorse(ctx,712,CART.y+44+hb1,1.2,1,t,{col:'#8a5430',mane:'#1e1612',blaze:true,rate:9.4,traceTo:-150});
  // la voiture
  ctx.save();ctx.translate((CART.x0+CART.x1)/2,cy);ctx.rotate(ang);ctx.translate(-(CART.x0+CART.x1)/2,-cy);
  cartBody(ctx,t,s,cy,hz);
  ctx.restore();
  // les fougères du premier plan
  ctx.fillStyle='#141c12';for(let i=0;i<14;i++){const x=((i*170-s.u*1.5)%2380+2380)%2380-300;ctx.beginPath();ctx.moveTo(x,560);for(let k=-4;k<=4;k++)ctx.quadraticCurveTo(x+k*14,470+Math.abs(k)*8,x+k*22,440+Math.abs(k)*16);ctx.closePath();ctx.fill()}
  vxDrawBubbles(ctx);
  ctx.restore();
  // la brume
  ctx.fillStyle='rgba(160,175,155,.08)';ctx.fillRect(0,0,W,H);
}
function cartBody(g,t,s,cy,hz){
  const y=cy,x0=CART.x0,x1=CART.x1;
  // les roues (arrière grandes, avant plus petites), les rayons qui tournent
  const wheel=(wx,r)=>{const yy=y+40;g.fillStyle='#3a2a1a';g.beginPath();g.arc(wx,yy,r,0,7);g.fill();g.fillStyle='#5a4028';g.beginPath();g.arc(wx,yy,r-5,0,7);g.fill();
    g.strokeStyle='#2a1c10';g.lineWidth=4;g.beginPath();g.arc(wx,yy,r-2,0,7);g.stroke();g.strokeStyle='#7a5a36';g.lineWidth=4;const a0=-s.u/r;for(let k=0;k<12;k++){const a=a0+k*Math.PI/6;g.beginPath();g.moveTo(wx+Math.cos(a)*8,yy+Math.sin(a)*8);g.lineTo(wx+Math.cos(a)*(r-6),yy+Math.sin(a)*(r-6));g.stroke()}
    g.fillStyle='#2a2a2a';g.beginPath();g.arc(wx,yy,8,0,7);g.fill();g.fillStyle='#6a6a6a';g.beginPath();g.arc(wx,yy,3,0,7);g.fill()};
  // le fond de caisse, la ridelle du fond, les bancs
  g.fillStyle='#4a3420';g.fillRect(x0,y-62,x1-x0,62);g.fillStyle='#3a2816';for(let yy=y-62;yy<y;yy+=13)g.fillRect(x0,yy,x1-x0,2);
  // les soldats
  for(const m of CART_MEN)cartMan(g,t,s,m,y);
  // le siège du conducteur et le conducteur
  g.fillStyle='#5a3e24';g.fillRect(x1-10,y-38,64,10);g.fillRect(x1+40,y-60,8,40);g.fillStyle='#4a3420';g.fillRect(x1,y-30,60,30);
  const drv=vxSoldier(g,{hip:{x:x1+28,y:y-44},s:9.6,f:1,side:'drv',t,pose:Object.assign({},VX_P.sit,{lean:.12,nT:{x:4.6,y:-1.6},fT:{x:4.2,y:-1.2},head:.1}),
    face:{skin:VX_SKIN[5],hair:VX_HAIR[5],stache:'1914',beardCol:'#8a7a62',helmet:'adrian',ex:'neutral',stubble:.5},noPouch:1});
  g.strokeStyle='#2a1c12';g.lineWidth=1.6;g.beginPath();g.moveTo(drv.nh.x,drv.nh.y);g.quadraticCurveTo((drv.nh.x+hz.bit.x)/2,drv.nh.y+18,hz.bit.x,hz.bit.y);g.stroke();
  g.beginPath();g.moveTo(drv.fh.x,drv.fh.y);g.quadraticCurveTo((drv.fh.x+hz.bit.x)/2+20,drv.fh.y+14,hz.bit.x+20,hz.bit.y-8);g.stroke();
  // le fouet
  g.strokeStyle='#3a2a1a';g.lineWidth=2;g.beginPath();g.moveTo(x1+60,y-50);g.lineTo(x1+70,y-130);g.stroke();g.strokeStyle='#2a1c12';g.lineWidth=1;g.beginPath();g.moveTo(x1+70,y-130);g.quadraticCurveTo(x1+110,y-140+Math.sin(t*3)*6,x1+150,y-110);g.stroke();
  // la ridelle de devant : planches, ferrures, numéro peint
  const pg=g.createLinearGradient(0,y-40,0,y+8);pg.addColorStop(0,'#6a4a2a');pg.addColorStop(1,'#4a3218');g.fillStyle=pg;g.fillRect(x0,y-38,x1-x0,46);
  g.fillStyle='rgba(0,0,0,.22)';for(let yy=y-26;yy<y+8;yy+=12)g.fillRect(x0,yy,x1-x0,2);
  g.fillStyle='#2a2420';for(const x of[x0+6,x0+140,x0+270,x1-10]){g.fillRect(x,y-40,6,50);g.beginPath();g.arc(x+3,y-30,2,0,7);g.arc(x+3,y,2,0,7);g.fillStyle='#8a8a7a';g.fill();g.fillStyle='#2a2420'}
  g.fillStyle='rgba(230,220,190,.55)';g.font='bold 16px '+F_DISP;g.textAlign='left';g.fillText('142e R.I. · 6e Cie',x0+156,y-8);
  // le timon, les palonniers vers les chevaux
  g.fillStyle='#4a3218';g.fillRect(x1,y+16,170,7);
  wheel(x0+60,44);wheel(x1-40,36);
}
function cartMan(g,t,s,m,y){
  const R=mulberry(m.x),bob=cartRoad(m.x+s.u)*.6+Math.sin(t*9.4+m.x)*.6,hip={x:m.x,y:y-40+bob*.4};
  let p=Object.assign({},VX_P.sit),held=null;const sc=11.2;
  const face=Object.assign({},m.face);
  if(m.pose==='smoke'){p=Object.assign(p,{lean:.05,nT:{x:1.8,y:-4.2},fT:{x:3.2,y:-1.2},head:-.05});
    held=(g2,Rg)=>{const mx=Rg.hd.x+.5*1.2,my=Rg.hd.y+.64*1.2,bx=mx+1.0,by=my+.75;
      g2.strokeStyle='#2a1a10';g2.lineWidth=.2;g2.beginPath();g2.moveTo(mx-.05,my);g2.quadraticCurveTo(mx+.55,my+.05,bx-.18,by-.05);g2.stroke();
      g2.fillStyle='#5a3418';g2.beginPath();g2.moveTo(bx-.32,by-.42);g2.lineTo(bx+.34,by-.42);g2.quadraticCurveTo(bx+.36,by+.28,bx,by+.32);g2.quadraticCurveTo(bx-.34,by+.28,bx-.32,by-.42);g2.fill();
      g2.fillStyle='rgba(255,255,255,.12)';g2.fillRect(bx-.24,by-.3,.12,.5);g2.fillStyle='#1a0e08';g2.beginPath();g2.ellipse(bx+.01,by-.42,.31,.09,0,0,7);g2.fill();
      g2.fillStyle='rgba(255,'+(110+Math.sin(t*3)*40|0)+',40,.85)';g2.beginPath();g2.ellipse(bx+.01,by-.44,.17,.05,0,0,7);g2.fill()};
    if(Math.sin(t*1.3+m.x)>.6&&rnd()<.15)V.parts.push({k:'smoke',x:hip.x+m.f*24,y:hip.y-58,vx:20+rnd()*10,vy:-25,g:-8,life:0,max:2.4,r:2,grow:8,col:'#c8c8c0',a:.3})}
  else if(m.pose==='sleep'){p=Object.assign(p,{lean:-.22,head:-.9,nT:{x:2.4,y:-.8},fT:{x:2.8,y:-.6}});face.tilt=-.5}
  else if(m.pose==='bread'){p=Object.assign(p,{lean:.08,nT:{x:2.8,y:-3.2},fT:{x:3.4,y:-2.4},head:.25});
    held=(g2,Rg)=>{g2.fillStyle='#c89a5a';g2.beginPath();g2.ellipse(Rg.fh.x+.4,Rg.fh.y-.1,1.1,.7,.3,0,7);g2.fill();g2.fillStyle='#b8b8c0';g2.fillRect(Rg.nh.x,Rg.nh.y-.1,1.3,.18)}}
  else if(m.pose==='hum'){p=Object.assign(p,{lean:.02,nT:{x:3.0,y:-.6},fT:{x:3.4,y:-.4},head:-.12+Math.sin(t*1.6)*.06});face.ex=Math.sin(t*2)>0?'smile':'neutral'}
  else if(m.pose==='basket'){p=Object.assign(p,{lean:.1,nT:{x:4.1+(s.wince>0?-.5:0),y:-2.55+(s.wince>0?-.9:0)},fT:{x:2.5,y:-1.7},head:.5+s.gaze*.15});
    if(s.wince>0){face.ex='wince'}else if(s.pinch>=0){face.ex='sad';face.look=[.5,.6]}
    else face.look=[.8,.4+Math.sin(t*.7)*.2]}
  const kit=m.kit;
  const j=vxSoldier(g,{hip,s:sc,f:m.f,side:'fr',t,pose:p,face,kit,held,regt:'142'});if(m.lucien)s.lucHead=j.head;
  if(m.lucien){// le panier sur les genoux, Raymond dans la lucarne, l'index de Lucien posé sur le bord
    const bx=hip.x+24,by=hip.y-6;s.keyP={x:bx+8,y:by-30};
    vxBasket(g,bx,by,40,28,{win:6,big:1,inside:(g2,lx,ly)=>{g2.save();g2.beginPath();g2.rect(lx-10,ly-14,20,17);g2.clip();
      drawRaymond(g2,lx-9+(s.peck>0?4:0),ly+19,{f:1,t,wear:0,size:.78});g2.restore()}});
    const hx=bx+12,hy=by-28+(s.wince>0?-8:0);g.fillStyle=face.skin;g.beginPath();g.ellipse(hx,hy,4.4,3,.2,0,7);g.fill();
    g.save();g.translate(hx+3,hy+1);g.rotate(s.wince>0?-.6:.9);g.fillStyle=face.skin;rr(g,0,-1.3,8,2.6,1.3);g.fill();g.strokeStyle=rgba('#7a4a3a',.45);g.lineWidth=.5;g.beginPath();g.moveTo(3,-1);g.lineTo(3,1);g.moveTo(5.6,-1);g.lineTo(5.6,1);g.stroke();
    if(s.wince>0){g.fillStyle='rgba(200,40,40,.6)';g.beginPath();g.arc(7,0,1.2,0,7);g.fill()}g.restore()}
}

/* =========================================================
   LA CHAMBRÉE DU FORT DE VAUX (nuit du 2 juin 1916)
   ========================================================= */
const RM={F:430,cx:480,cy:250,camX:.25,camY:1.72,R:2.8,spring:1.75,z0:2.05,z1:13.5};
function rmP(x,y,z){return[RM.cx+(x-RM.camX)*RM.F/z,RM.cy-(y-RM.camY)*RM.F/z]}
let roomCache=null;
function roomInit(){Object.assign(V.s,{lampA:0,lampV:0,smoke:[{x:.3,y:.2,t:2,r:.4,v:.06},{x:.7,y:.4,t:3,r:.3,v:.05}],hit:0,flinch:0,zoom:1,boomT:2.2,win:0,chirp:-1,said:{},pen:0,write:0,lineN:0,dust:[],turn:0,snore:3,rat:-1})}
function roomUpdate(dt){const s=V.s;
  s.zoom=Math.min(s.chirp>=0?1.85:1.4,s.zoom+dt*(s.chirp>=0?.18:.05));
  s.boomT-=dt;if(s.boomT<=0){const near=rnd()<.4,pw=near?1:.55;s.boomT=(near?3.4:2)+rnd()*2.6;s.win=1;s.winX=rnd();s.hit=pw;s.flinch=near?1.1:.5;s.lampV+=(rnd()<.5?-1:1)*(near?2.4:1.2);if(near)s.haze=1;
    V.shake=Math.max(V.shake,near?13:6);if(!G.sim){noise(near?2.2:1.6,near?90:120,near?1:.6,'lowpass');noise(.5,500,near?.35:.18,'lowpass',.04);tone(36,1.4,'triangle',near?.4:.22,24);if(near)noise(1.2,2600,.06,'highpass',.15)}
    for(let k=0;k<(near?46:18);k++)s.dust.push({x:120+rnd()*720,y:-10-rnd()*60,vy:30+rnd()*70,vx:(rnd()-.5)*14,life:0,max:2+rnd()*2.4,r:.8+rnd()*(near?2.4:1.6)});
    for(let k=0;k<5;k++)s.smoke.push({x:rnd(),y:0,t:0,r:.2+rnd()*.3,v:.08+rnd()*.12});
    if(rnd()<.4)vxBubble(rmP(-2.3,1.1,6.3)[0],rmP(-2.3,1.1,6.3)[1],'Mmh…','#4a4a4a',1.6)}
  s.win=Math.max(0,s.win-dt*1.6);s.hit=Math.max(0,(s.hit||0)-dt*2.2);s.haze=Math.max(0,(s.haze||0)-dt*.3);s.flinch=Math.max(0,(s.flinch||0)-dt);
  s.lampV+=(-s.lampA*9-s.lampV*.6)*dt;s.lampA+=s.lampV*dt;
  for(const m of s.smoke){m.t+=dt;m.y+=m.v*dt}s.smoke=s.smoke.filter(m=>m.t<6);if(rnd()<dt*.8)s.smoke.push({x:rnd(),y:0,t:0,r:.2+rnd()*.3,v:.05+rnd()*.08});
  for(const d of s.dust){d.life+=dt;d.y+=d.vy*dt;d.x+=d.vx*dt}s.dust=s.dust.filter(d=>d.life<d.max);
  // le crayon : des mots, des pauses
  const writing=s.chirp<0||s.chirp>5.4;
  if(writing&&s.flinch<=0){s.write+=dt;if(s.pen&&!G.sim&&rnd()<dt*14)noise(.04+rnd()*.05,3800+rnd()*1500,.05,'highpass',0,1.2)}
  s.snore-=dt;if(s.snore<=0){s.snore=3.5+rnd()*3;const p=rmP(-2.25,.62,3.6);vxBubble(p[0]+30,p[1]-30,'Rrrr…','#5a5a5a',1.8);if(!G.sim)noise(.6,180,.06,'lowpass')}
  if(pressed.has('act')&&s.chirp<0&&V.t>1){s.chirp=0;if(!G.sim){SFX.coo();setTimeout(()=>SFX.coo(),380)}const p=rmBasketP();vxBubble(p[0],p[1]-60,'Rrrou ! Rrrou-rou !','#a8322d',2);say("Ouvrez ! Un pigeon, ça vole. Ça ne regarde pas écrire !",3.4)}
  if(s.chirp>=0){s.chirp+=dt;s.turn=s.chirp<5.2?Math.min(1,s.turn+dt*2.5):Math.max(0,s.turn-dt*2);
    if(!s.said.l&&s.chirp>.9){s.said.l=1;say("Oui, oui… Je vais te donner du grain, et tu t'envoleras bientôt pour rejoindre Marguerite, mon brave Raymond.",5.4,'LUCIEN')}
    if(s.chirp>9.4)vxFadeTo(()=>vxCardGo('yard',()=>vxGo('yard')),1.1)}
  if(s.rat<0&&V.t>6)s.rat=0;if(s.rat>=0)s.rat+=dt;
}
function rmBasketP(){return rmP(2.3,.765,3.15)}
function roomBuild(){
  const rs=Math.min(2.6,RS*1.35),c=mk(W*rs,H*rs),g=c.getContext('2d');g.scale(rs,rs);c.rs=rs;
  const P3=rmP,R=mulberry(2006);
  g.fillStyle='#1a1612';g.fillRect(0,0,W,H);
  const quad=(a,b,c2,d,col)=>{g.fillStyle=col;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.lineTo(c2[0],c2[1]);g.lineTo(d[0],d[1]);g.closePath();g.fill()};
  const zs=[];for(let z=RM.z0;z<RM.z1;z+=.5)zs.push(z);zs.push(RM.z1);
  // le sol de béton, la paille éparse
  for(let i=0;i<zs.length-1;i++){const a=zs[i],b=zs[i+1];quad(P3(-RM.R,0,a),P3(RM.R,0,a),P3(RM.R,0,b),P3(-RM.R,0,b),mix('#6a6258','#3a342c',i/zs.length))}
  for(let k=0;k<160;k++){const z=RM.z0+R()*(RM.z1-RM.z0),x=-RM.R+R()*RM.R*2,p=P3(x,0,z),l=10/z*(.6+R());g.strokeStyle=R()<.5?'rgba(216,180,90,.45)':'rgba(180,140,60,.4)';g.lineWidth=1;const a=R()*3;g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(p[0]+Math.cos(a)*l*6,p[1]+Math.sin(a)*l*1.4);g.stroke()}
  // les murs latéraux et la voûte en berceau : des moellons appareillés, assise par assise, joints décalés
  const block=(pts,col)=>{g.fillStyle=col;g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill();g.strokeStyle='rgba(36,30,24,.32)';g.lineWidth=.9;g.stroke()};
  const depth=z=>Math.min(1,(z-RM.z0)/(RM.z1-RM.z0)*.95);
  for(const sd of[-1,1])for(let y=0,row=0;y<RM.spring-.01;y+=.28,row++){const y1=Math.min(RM.spring,y+.28);let z=RM.z0-(row%2?.35:0);
    while(z<RM.z1){const z1=Math.min(RM.z1,z+.55+R()*.4),za=Math.max(RM.z0,z);if(z1>za){const base=mix(sd<0?'#8e8676':'#a29a88',R()<.5?'#7a7262':'#b4ac98',R()*.5),sm=y>1.2&&R()<.3?.18:0;
      block([P3(sd*RM.R,y,za),P3(sd*RM.R,y1,za),P3(sd*RM.R,y1,z1),P3(sd*RM.R,y,z1)],mix(mix(base,'#3a3226',sm),'#2a2620',depth((za+z1)/2)))}z=z1}}
  const NA=18,arc=(th,z)=>P3(Math.cos(th)*RM.R,RM.spring+Math.sin(th)*RM.R,z);
  for(let k=0;k<NA;k++){const t0=k/NA*Math.PI,t1=(k+1)/NA*Math.PI;let z=RM.z0-(k%2?.3:0);const lit=.88-Math.abs(k/NA-.5)*.25+(k<NA/2?.06:0),soot=Math.max(0,1-Math.abs(k/NA-.5)*4)*.25;
    while(z<RM.z1){const z1=Math.min(RM.z1,z+.5+R()*.45),za=Math.max(RM.z0,z);if(z1>za){const base=mix('#b8b0a0',R()<.5?'#a0988a':'#c8c0ae',R()*.6);
      block([arc(t0,za),arc(t1,za),arc(t1,z1),arc(t0,z1)],mix(mix(base,'#4a4234',soot),'#2a2620',Math.min(1,depth((za+z1)/2)+(1-lit))))}z=z1}}
  // des taches d'humidité, le salpêtre
  for(let k=0;k<26;k++){const th=R()*Math.PI,z=RM.z0+R()*8,p=P3(Math.cos(th)*RM.R,RM.spring+Math.sin(th)*RM.R,z),r=30/z*(1+R()*2);g.fillStyle=R()<.5?'rgba(60,50,30,.12)':'rgba(240,240,230,.08)';g.beginPath();g.ellipse(p[0],p[1],r*2,r,0,0,7);g.fill()}
  // l'arc doubleau et les piliers de renfort (ajoutés après 1888)
  for(const z of[5.2,9.4]){const pw=.25;for(const sd of[-1,1]){quad(P3(sd*RM.R,0,z),P3(sd*RM.R,RM.spring,z),P3(sd*(RM.R-pw),RM.spring,z),P3(sd*(RM.R-pw),0,z),mix('#a89e8c','#2a2620',z/RM.z1*.9))}
    g.strokeStyle=mix('#b0a694','#2a2620',z/RM.z1*.9);g.lineWidth=.35*RM.F/z;g.beginPath();for(let k=0;k<=NA;k++){const th=k/NA*Math.PI,p=P3(Math.cos(th)*(RM.R-.12),RM.spring+Math.sin(th)*(RM.R-.12),z);k?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1])}g.stroke()}
  // le mur du fond et sa petite fenêtre (en partie murée de sacs de terre)
  {const z=RM.z1;g.fillStyle='#4a443a';g.beginPath();const a=P3(-RM.R,0,z);g.moveTo(a[0],a[1]);for(let k=0;k<=NA;k++){const th=Math.PI-k/NA*Math.PI,p=P3(Math.cos(th)*RM.R,RM.spring+Math.sin(th)*RM.R,z);g.lineTo(p[0],p[1])}const b=P3(RM.R,0,z);g.lineTo(b[0],b[1]);g.closePath();g.fill();
   const w0=P3(-.66,1.1,z),w1=P3(.66,2.55,z);g.fillStyle='#0e1018';g.fillRect(w0[0],w1[1],w1[0]-w0[0],w0[1]-w1[1]);
   for(let r=0;r<4;r++)for(let k=0;k<5;k++){const p=P3(-.62+k*.27+(r%2)*.12,1.12+r*.13,z);vxSandbag(g,p[0]-9,p[1]-8,18,8,.55)}
   
   g.strokeStyle='#6a6254';g.lineWidth=3;g.strokeRect(w0[0],w1[1],w1[0]-w0[0],w0[1]-w1[1])}
  // les lits de fer à deux étages, le long du mur de gauche (du fond vers nous)
  const beds=[[11.0,12.9],[8.7,10.6],[6.4,8.3],[4.1,6.0]];
  for(const[z0,z1]of beds)rmBunk(g,z0,z1,R);
  // le râtelier d'armes, les patères du mur de droite : capotes, musettes, casques
  for(let z=5.6;z<12.5;z+=1.1){const p=P3(RM.R-.02,1.45,z),k=RM.F/z;g.fillStyle='#2a2018';g.fillRect(p[0]-1,p[1]-1,3,3);
    const R2=mulberry(z*10|0);const it=R2();if(it<.5){g.fillStyle=mix('#6f8399','#1a1612',z/RM.z1*.8);g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(p[0]-.18*k,p[1]+.95*k);g.lineTo(p[0]+.12*k,p[1]+1.0*k);g.closePath();g.fill()}
    else if(it<.8){g.fillStyle=mix('#6a6a4a','#1a1612',z/RM.z1*.8);rr(g,p[0]-.1*k,p[1]+.1*k,.18*k,.26*k,.04*k);g.fill();g.strokeStyle=g.fillStyle;g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(p[0]-.05*k,p[1]+.12*k);g.stroke()}
    else{g.fillStyle=mix('#71808e','#1a1612',z/RM.z1*.8);g.beginPath();g.ellipse(p[0]-.02*k,p[1]+.1*k,.16*k,.1*k,0,Math.PI,0);g.fill()}}
  for(let z=10.6;z<12.6;z+=.38){const a=P3(RM.R-.06,.15,z),b=P3(RM.R-.18,1.32,z+.05);g.strokeStyle='#3a2a1a';g.lineWidth=Math.max(1,.05*RM.F/z);g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke();g.strokeStyle='#5a5a5c';g.lineWidth=1;g.beginPath();g.moveTo(b[0],b[1]);g.lineTo(b[0],b[1]-.3*RM.F/z);g.stroke()}
  {const a=P3(RM.R-.06,.9,10.4),b=P3(RM.R-.06,.9,12.8);g.strokeStyle='#4a3a28';g.lineWidth=3;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke()}
  // la table de Lucien, contre le mur de droite, et son tabouret
  {const tz0=2.5,tz1=3.6,tx0=1.55,tx1=2.75,ty=.76;
   quad(P3(tx0,ty,tz0),P3(tx1,ty,tz0),P3(tx1,ty,tz1),P3(tx0,ty,tz1),'#6a4a2c');
   g.fillStyle='rgba(0,0,0,.25)';for(let k=1;k<5;k++){const a=P3(tx0,ty,tz0+k*.22),b=P3(tx1,ty,tz0+k*.22);g.fillRect(a[0],a[1],b[0]-a[0],1)}
   quad(P3(tx0,ty,tz0),P3(tx1,ty,tz0),P3(tx1,ty-.06,tz0),P3(tx0,ty-.06,tz0),'#4a3218');
   for(const[x,z]of[[tx0+.06,tz0+.05],[tx1-.06,tz0+.05],[tx0+.06,tz1-.05]]){const a=P3(x,ty-.06,z),b=P3(x,0,z);g.fillStyle='#3a2614';g.fillRect(a[0]-.03*RM.F/z,a[1],.06*RM.F/z,b[1]-a[1])}
   // dessus : le casque de Lucien, un quart, la gamelle
   {const p=P3(2.55,ty,3.35),k=RM.F/3.35;g.fillStyle='#71808e';g.beginPath();g.ellipse(p[0],p[1]-.02*k,.18*k,.05*k,0,0,7);g.fill();g.beginPath();g.ellipse(p[0],p[1]-.06*k,.13*k,.1*k,0,Math.PI,0);g.fill();g.fillStyle='#8a98a6';g.fillRect(p[0]-.12*k,p[1]-.13*k,.24*k,.012*k)}
   {const p=P3(1.75,ty,3.3),k=RM.F/3.3;g.fillStyle='#8a8a8c';rr(g,p[0]-.04*k,p[1]-.1*k,.08*k,.1*k,.01*k);g.fill()}
   // le tabouret
   {const a=P3(.78,.45,2.62),b=P3(1.18,.45,2.62),k=RM.F/2.62;g.fillStyle='#5a3e24';g.fillRect(a[0],a[1],b[0]-a[0],.05*k);g.fillStyle='#3a2614';g.fillRect(a[0]+4,a[1],.04*k,.45*k);g.fillRect(b[0]-.07*k,a[1],.04*k,.45*k)}}
  return c;
}
function rmBunk(g,z0,z1,R){const P3=rmP,x0=-RM.R+.04,x1=-RM.R+.9,lv=[.42,1.32],fade=k=>mix(k,'#1a1612',Math.min(.92,(z0-3)/10.5*.95));
  const k=RM.F/z0;
  // les montants
  for(const z of[z0,z1])for(const x of[x0,x1]){const a=P3(x,0,z),b=P3(x,1.62,z);g.strokeStyle=fade('#3a3c40');g.lineWidth=Math.max(1,.035*RM.F/z);g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke()}
  for(const y of lv){// le cadre, la paillasse, la couverture, le dormeur
    const q=(x,z)=>P3(x,y,z);g.strokeStyle=fade('#46484c');g.lineWidth=Math.max(1,.03*k);g.beginPath();const a=q(x0,z0),b=q(x1,z0),c=q(x1,z1),d=q(x0,z1);g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.lineTo(c[0],c[1]);g.lineTo(d[0],d[1]);g.closePath();g.stroke();
    const m=(x,z,yy)=>P3(x,y+yy,z);g.fillStyle=fade('#8a7a5a');g.beginPath();let p=m(x0,z0+.05,.08);g.moveTo(p[0],p[1]);p=m(x1,z0+.05,.08);g.lineTo(p[0],p[1]);p=m(x1,z1-.05,.08);g.lineTo(p[0],p[1]);p=m(x0,z1-.05,.08);g.lineTo(p[0],p[1]);g.closePath();g.fill();
    // la couverture grise et la bosse du dormeur
    g.fillStyle=fade(R()<.5?'#5a5a58':'#4e5250');g.beginPath();p=m(x0,z0+.5,.1);g.moveTo(p[0],p[1]);for(let u=0;u<=1;u+=.1){const pp=m(lerp(x0,x1,u),z0+.5,.1+Math.sin(u*Math.PI)*.18);g.lineTo(pp[0],pp[1])}
    p=m(x1,z1-.08,.1);g.lineTo(p[0],p[1]);for(let u=1;u>=0;u-=.1){const pp=m(lerp(x0,x1,u),z1-.08,.1+Math.sin(u*Math.PI)*.14);g.lineTo(pp[0],pp[1])}g.closePath();g.fill();
    // la tête sur le sac (le plus proche se voit bien ; on le dessine vivant)
    if(!(z0<5&&y<1)){const hp=m(x0+.42,z0+.3,.24),hs=.12*RM.F/(z0+.3);vxHead(g,{x:hp[0],y:hp[1],s:hs,f:1,skin:pick(VX_SKIN),hair:pick(VX_HAIR),ex:'sleep',helmet:'none',stache:R()<.5?'walrus':null,stubble:.6,tilt:-1.2,lod:hs})}
    // les brodequins qui dépassent
    const bp=m(x0+.45,z1-.02,.22);g.fillStyle=fade('#2a1c10');g.beginPath();g.ellipse(bp[0],bp[1],.08*RM.F/z1,.06*RM.F/z1,0,0,7);g.fill()}
  // sous le lit : la musette, un bidon
  const sp=P3(x0+.4,.12,(z0+z1)/2);g.fillStyle=fade('#5a5a40');rr(g,sp[0]-.1*RM.F/z0,sp[1]-.12*RM.F/z0,.2*RM.F/z0,.12*RM.F/z0,3);g.fill();
}
function roomRender(t){
  const s=V.s;if(!roomCache||roomCache.rsKey!==RS){roomCache=roomBuild();roomCache.rsKey=RS}
  const z=s.zoom,e=Math.min(1,(z-1)/.4),e2=clamp((z-1.4)/.45,0,1),fx=lerp(lerp(480,600,e),660,e2),fy=lerp(lerp(270,300,e),316,e2);
  const jx=(s.hit>0?(rnd()-.5)*s.hit*8:0),jy=(s.hit>0?(rnd()-.5)*s.hit*6:0);
  ctx.save();ctx.translate(W/2+jx,H/2+jy);ctx.rotate((s.hit>0?(rnd()-.5)*s.hit*.006:0));ctx.scale(z,z);ctx.translate(-fx,-fy);
  ctx.drawImage(roomCache,0,0,W,H);
  // l'éclair des obus dans la fenêtre du fond
  {const w0=rmP(-.66,1.1,RM.z1),w1=rmP(.66,2.55,RM.z1),ww=w1[0]-w0[0],wh=w0[1]-w1[1];
   ctx.save();ctx.beginPath();ctx.rect(w0[0],w1[1],ww,wh*.64);ctx.clip();
   // dehors : la nuit, la crête labourée, les lueurs rouges des obus, la fumée qui monte
   const sk=ctx.createLinearGradient(0,w1[1],0,w1[1]+wh*.64);sk.addColorStop(0,'#10141f');sk.addColorStop(1,'rgb('+(40+s.win*160|0)+','+(30+s.win*90|0)+','+(36+s.win*30|0)+')');ctx.fillStyle=sk;ctx.fillRect(w0[0],w1[1],ww,wh);
   ctx.fillStyle='#08080c';ctx.beginPath();ctx.moveTo(w0[0],w1[1]+wh*.64);for(let k=0;k<=8;k++)ctx.lineTo(w0[0]+ww*k/8,w1[1]+wh*(.5+((k*37)%7)*.012));ctx.lineTo(w1[0],w1[1]+wh*.64);ctx.fill();
   if(s.win>0){const gx=w0[0]+(s.winX||.5)*ww,gg=ctx.createRadialGradient(gx,w1[1]+wh*.56,1,gx,w1[1]+wh*.56,ww*.7);gg.addColorStop(0,'rgba(255,220,140,'+s.win+')');gg.addColorStop(.4,'rgba(255,120,40,'+s.win*.7+')');gg.addColorStop(1,'rgba(255,90,30,0)');ctx.fillStyle=gg;ctx.fillRect(w0[0],w1[1],ww,wh)}
   for(const m of s.smoke){const a=Math.min(1,m.t)*Math.max(0,1-m.t/6),x=w0[0]+m.x*ww+Math.sin(m.t+m.x*9)*3,y=w1[1]+wh*.58-m.y*wh*1.6,r=(m.r*.6+m.t*.06)*ww;
     ctx.fillStyle='rgba('+(110+s.win*130|0)+','+(100+s.win*80|0)+','+(100+s.win*30|0)+','+a*.85+')';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill()}
   ctx.restore();ctx.strokeStyle='#1e1a16';ctx.lineWidth=2.4;for(let k=1;k<5;k++){const x=w0[0]+ww*k/5;ctx.beginPath();ctx.moveTo(x,w1[1]);ctx.lineTo(x,w1[1]+wh*.64);ctx.stroke()}
   if(s.win>0){const a=Math.min(1,s.win);
    const gl=ctx.createRadialGradient((w0[0]+w1[0])/2,(w0[1]+w1[1])/2,4,(w0[0]+w1[0])/2,(w0[1]+w1[1])/2,260);gl.addColorStop(0,'rgba(255,220,170,'+a*.35+')');gl.addColorStop(1,'rgba(255,220,170,0)');ctx.fillStyle=gl;ctx.fillRect(0,0,W,H)}}
  // le dormeur du premier lit (il respire)
  {const hp=rmP(-RM.R+.46,.42+.24,4.4),hs=.12*RM.F/4.4,br=Math.sin(t*1.4)*.8;
   const bl=rmP(-RM.R+.5,.62,5.2);ctx.fillStyle='#4e5250';ctx.beginPath();ctx.ellipse(bl[0],bl[1]-br,56,18+br,-.12,0,7);ctx.fill();
   vxHead(ctx,{x:hp[0],y:hp[1]-br*.4,s:hs,f:1,skin:VX_SKIN[3],hair:VX_HAIR[2],ex:'sleep',helmet:'none',stache:'walrus',stubble:.8,tilt:-1.1,lod:hs*z});
   const ah=rmP(-RM.R+.75,.6,4.6);ctx.fillStyle='#6f8399';ctx.beginPath();ctx.ellipse(ah[0],ah[1],20,8,.3,0,7);ctx.fill();ctx.fillStyle=VX_SKIN[3];ctx.beginPath();ctx.arc(ah[0]+16,ah[1]+4,6,0,7);ctx.fill()}
  // la lampe-tempête pendue à la voûte, mèche baissée
  {const top=rmP(-1.2,RM.spring+Math.sqrt(RM.R*RM.R-1.44)-.02,6.2),k=RM.F/6.2,lp0=rmP(-1.2,2.55,6.2),L0=Math.hypot(lp0[0]-top[0],lp0[1]-top[1]),lp=[top[0]+Math.sin(s.lampA)*L0,top[1]+Math.cos(s.lampA)*L0];ctx.strokeStyle='#2a2420';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(top[0],top[1]);ctx.lineTo(lp[0],lp[1]-.2*k);ctx.stroke();
   ctx.fillStyle='#3a3630';ctx.fillRect(lp[0]-.07*k,lp[1]-.2*k,.14*k,.04*k);ctx.fillStyle='rgba(255,200,120,'+(.55+Math.sin(t*5)*.05)+')';ctx.beginPath();ctx.ellipse(lp[0],lp[1]-.08*k,.06*k,.1*k,0,0,7);ctx.fill();
   ctx.strokeStyle='#3a3630';ctx.beginPath();ctx.ellipse(lp[0],lp[1]-.08*k,.07*k,.11*k,0,0,7);ctx.stroke();ctx.fillStyle='#3a3630';ctx.fillRect(lp[0]-.08*k,lp[1]+.02*k,.16*k,.03*k);s.lamp=lp}
  // un rat, le long du mur
  if(s.rat>=0&&s.rat<5){const u=s.rat/5,z2=lerp(12,3,u),p=rmP(-RM.R+.15,0,z2),k=RM.F/z2;ctx.fillStyle='#2a2420';ctx.beginPath();ctx.ellipse(p[0],p[1]-.05*k,.12*k,.05*k,0,0,7);ctx.fill();ctx.strokeStyle='#2a2420';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p[0]-.12*k,p[1]-.04*k);ctx.quadraticCurveTo(p[0]-.25*k,p[1],p[0]-.32*k,p[1]-.06*k);ctx.stroke()}
  // la bougie, la lettre, le panier de Raymond
  const cp=rmP(2.45,.76,2.75),kk=RM.F/2.75;
  ctx.fillStyle='#e8dcc0';ctx.fillRect(cp[0]-.02*kk,cp[1]-.14*kk,.04*kk,.14*kk);ctx.fillStyle='#8a7a5a';ctx.beginPath();ctx.ellipse(cp[0],cp[1],.06*kk,.015*kk,0,0,7);ctx.fill();
  const fl=1+Math.sin(t*11)*.08+Math.sin(t*23)*.05+s.win*.3;ctx.fillStyle='rgba(255,190,90,.95)';ctx.beginPath();ctx.ellipse(cp[0]+Math.sin(t*7)*.6,cp[1]-.18*kk,.018*kk,.04*kk*fl,0,0,7);ctx.fill();ctx.fillStyle='rgba(255,250,220,.95)';ctx.beginPath();ctx.ellipse(cp[0],cp[1]-.17*kk,.008*kk,.02*kk,0,0,7);ctx.fill();
  // la feuille, et l'écriture qui avance ligne à ligne, de haut en bas, de gauche à droite
  const pp=[rmP(1.62,.765,2.42),rmP(1.98,.765,2.42),rmP(1.98,.765,2.98),rmP(1.62,.765,2.98)];ctx.fillStyle='#ece3cc';ctx.beginPath();pp.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(0,0,0,.12)';ctx.lineWidth=.6;ctx.stroke();
  const NL=7,LT=3.2,wt=s.write,li=Math.min(NL-1,Math.floor(wt/LT)),ph=wt>=NL*LT?1:(wt%LT)/LT,u=clamp(ph/.8,0,1),lz=k=>lerp(2.92,2.5,k/(NL-1)),X0=1.66,X1=1.92;
  ctx.strokeStyle='rgba(50,44,64,.7)';ctx.lineWidth=.7;
  for(let k=0;k<=li;k++){const e=k<li?1:u,z=lz(k);if(e<=0)continue;ctx.beginPath();for(let q=0;q<=e+1e-6;q+=.04){const p=rmP(lerp(X0,X1,q),.766,z);const wob=Math.sin(q*55+k*3)*.7+Math.sin(q*13+k)*.4;q?ctx.lineTo(p[0],p[1]+wob):ctx.moveTo(p[0],p[1]+wob)}ctx.stroke()}
  // la pointe du crayon : sur la ligne en cours ; entre deux lignes, le crayon se lève et revient à gauche
  let tip;if(ph<=.8){const p=rmP(lerp(X0,X1,u),.766,lz(li));tip=[p[0],p[1]+Math.sin(u*55+li*3)*.7]}
  else{const v=(ph-.8)/.2,a=rmP(X1,.766,lz(li)),b=rmP(X0,.766,lz(Math.min(NL-1,li+1)));tip=[lerp(a[0],b[0],v),lerp(a[1],b[1],v)-Math.sin(v*Math.PI)*7]}
  if(s.chirp>=0&&s.chirp<=5.4)tip=[tip[0]-4,tip[1]-6];
  s.pen=ph<=.8&&!(s.chirp>=0&&s.chirp<=5.4)?1:0;
  {const bp=rmBasketP();vxBasket(ctx,bp[0],bp[1],60,44,{win:-10,big:1,inside:(g2,lx,ly)=>{g2.save();g2.beginPath();g2.rect(lx-16,ly-22,32,27);g2.clip();drawRaymond(g2,lx+12,ly+30,{f:-1,t,wear:0,size:1.25});g2.restore()}})}
  // Lucien, assis, tête nue, qui écrit : la main suit la pointe du crayon
  const turn=s.turn,flc=Math.min(1,s.flinch*1.6),hip=rmP(1.0,.47,2.62),sc=.115*RM.F/2.62,hx=tip[0]-10,hy=tip[1]-5;
  const L1=vxSoldier(ctx,{hip:{x:hip[0],y:hip[1]},s:sc,f:1,side:'fr',t,regt:'142',noPouch:1,
    pose:Object.assign({},VX_P.sit,{lean:.3-turn*.1-flc*.12,head:.55-turn*.42-flc*.75,nT:{x:(hx-hip[0])/sc,y:(hy-hip[1])/sc},fT:{x:4.3,y:-3.1}}),
    face:{skin:'#ecc8a6',hair:'#cfae6a',stache:'croc',beardCol:'#b8954e',helmet:'none',ex:flc>.2?'worry':turn>.5?'smile':'neutral',young:1,stubble:.45,eye:'#3f78b8',tired:1,look:flc>.2?[-.2,-1]:turn>.5?[1,-.4]:[.7,1]}});
  // le crayon, tenu entre les doigts, la pointe sur le papier
  {const h=L1.nh;ctx.strokeStyle='#6a4a28';ctx.lineWidth=2.2;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(h.x-3,h.y-4);ctx.lineTo(tip[0],tip[1]);ctx.stroke();ctx.strokeStyle='#2a2a2a';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(lerp(h.x,tip[0],.85),lerp(h.y,tip[1],.85));ctx.lineTo(tip[0],tip[1]);ctx.stroke();
   ctx.fillStyle='#ecc8a6';ctx.beginPath();ctx.ellipse(h.x+2,h.y+1,4.2,3,.6,0,7);ctx.fill();ctx.strokeStyle=rgba('#7a4a3a',.5);ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(h.x,h.y-1);ctx.lineTo(h.x+5,h.y+3);ctx.stroke()}
  // la fumée qui entre par la fenêtre après un coup proche, et roule sous la voûte
  if(s.haze>0){const c=rmP(0,1.9,RM.z1),u=1-s.haze;for(let k=0;k<6;k++){const r=30+u*160+k*18,x=c[0]+Math.sin(k*2.1+u*2)*u*90,y=c[1]-u*60-k*6;ctx.fillStyle='rgba(120,112,104,'+(s.haze*.16)+')';ctx.beginPath();ctx.ellipse(x,y,r,r*.55,0,0,7);ctx.fill()}}
  // la poussière qui tombe de la voûte
  ctx.fillStyle='rgba(200,190,170,.5)';for(const d of s.dust){ctx.globalAlpha=1-d.life/d.max;ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,7);ctx.fill()}ctx.globalAlpha=1;
  vxDrawBubbles(ctx);
  ctx.restore();
  // l'obscurité : la bougie seule éclaire (et la fenêtre quand un obus tombe)
  vxDark([{x:W/2+(cp[0]-fx)*z,y:H/2+(cp[1]-.2*kk-fy)*z,r:340*z*(1+Math.sin(t*9)*.02),i:1,warm:1},{x:W/2+(s.lamp[0]-fx)*z,y:H/2+(s.lamp[1]-fy)*z,r:260*z,i:.55,warm:1},{x:W/2+(480-fx)*z,y:H/2+(250-fy)*z,r:150+s.win*380,i:.25+s.win*.6}],.86);
}
const vxDarkC=mk(W,H),vxDarkG=vxDarkC.getContext('2d');
function vxDark(lights,dark){const g=vxDarkG;g.globalCompositeOperation='source-over';g.clearRect(0,0,W,H);g.fillStyle='rgba(6,4,10,'+dark+')';g.fillRect(0,0,W,H);
  g.globalCompositeOperation='destination-out';for(const l of lights){const gr=g.createRadialGradient(l.x,l.y,0,l.x,l.y,l.r);gr.addColorStop(0,'rgba(0,0,0,'+l.i+')');gr.addColorStop(.55,'rgba(0,0,0,'+l.i*.55+')');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(l.x-l.r,l.y-l.r,l.r*2,l.r*2)}
  ctx.drawImage(vxDarkC,0,0,W,H);
  ctx.save();ctx.globalCompositeOperation='screen';for(const l of lights){if(!l.warm)continue;const gr=ctx.createRadialGradient(l.x,l.y,0,l.x,l.y,l.r*.6);gr.addColorStop(0,'rgba(255,170,80,.22)');gr.addColorStop(1,'rgba(255,170,80,0)');ctx.fillStyle=gr;ctx.fillRect(l.x-l.r,l.y-l.r,l.r*2,l.r*2)}ctx.restore()}

/* =========================================================
   LA COUR DU FORT DE VAUX (3 juin 1916, avant l'aube)
   ---------------------------------------------------------
   D'après le fort réel : la façade de la caserne (côté gorge), en moellons, ses ouvertures en plein cintre murées de
   sacs de terre, la carapace de béton spécial de 2,50 m posée dessus et couverte de terre labourée par les obus,
   la tourelle de 75 éclipsable et une cloche d'observation sur le dessus ; la cour, la boue, les entonnoirs, les
   caillebotis ; à gauche, le mur de gorge et son fossé.
   ========================================================= */
let yardCache=null;
const YD={g:470};
function yardInit(){Object.assign(V.s,{throwT:-1,said:{},bird:null,flares:[{x:240,y:60,vy:14,t:0}],booms:[],boomT:1.2,walk:0})}
function yardUpdate(dt){const s=V.s;s.walk+=dt;
  for(const f of s.flares){f.t+=dt;f.y+=f.vy*dt}
  if(s.flares.length<2&&rnd()<dt*.25)s.flares.push({x:80+rnd()*500,y:20,vy:12+rnd()*8,t:0});s.flares=s.flares.filter(f=>f.y<330);
  s.boomT-=dt;if(s.boomT<=0){s.boomT=1+rnd()*2.4;s.booms.push({x:rnd()*W,y:250+rnd()*60,t:0});if(!G.sim)noise(1.2,90+rnd()*60,.35,'lowpass')}
  for(const b of s.booms)b.t+=dt;s.booms=s.booms.filter(b=>b.t<1.4);
  if(!s.said.a&&V.t>1){s.said.a=1;say("Allez, Raymond. Tout droit vers l'ouest, et ne te retourne pas.",3.8,'LUCIEN')}
  if(!s.said.b&&V.t>5){s.said.b=1;say("Va chez Marguerite. Toi, au moins, tu pourras rentrer.",3.6,'LUCIEN')}
  if(s.throwT<0&&V.t>8.4){s.throwT=0}
  if(s.throwT>=0){s.throwT+=dt;
    if(!s.bird&&s.throwT>1.05){const h=s.hands||{x:420,y:300};s.bird={x:h.x,y:h.y,vx:-230,vy:-250,t:0};if(!G.sim){SFX.flap();setTimeout(()=>SFX.flap(),120)}for(let k=0;k<5;k++)V.parts.push({k:'feather',x:h.x,y:h.y,vx:(rnd()-.5)*120,vy:-rnd()*100,g:120,drag:2,life:0,max:1.6,rot:rnd()*6,vr:(rnd()-.5)*6})}
    if(s.bird){const b=s.bird;b.t+=dt;// lancé vers le ciel, il ralentit, ouvre les ailes, trouve l'air, puis file vers l'ouest au-dessus du rempart
      const tvx=b.t<.5?-230:-170,tvy=b.t<.35?-250:b.t<1.4?-40:-25;b.vx+=(tvx-b.vx)*dt*3;b.vy+=(tvy-b.vy)*dt*(b.t<.35?0:3.2);b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.t>2.9&&!V.out)vxFadeTo(()=>vxGo('flight'),.8)}}
}
function yardBuild(){
  const rs=Math.min(2,RS),c=mk(W*rs,H*rs),g=c.getContext('2d');g.scale(rs,rs);c.rs=rs;const R=mulberry(1916),gy=YD.g;
  // le ciel de l'aube, encore bleu de nuit en haut
  const sk=g.createLinearGradient(0,0,0,330);sk.addColorStop(0,'#141a30');sk.addColorStop(.45,'#3a3c5a');sk.addColorStop(.8,'#8a6a72');sk.addColorStop(1,'#c88a6a');g.fillStyle=sk;g.fillRect(0,0,W,H);
  for(let k=0;k<40;k++){g.fillStyle='rgba(255,255,255,'+(.2+R()*.3)+')';g.fillRect(R()*W,R()*110,1.2,1.2)}
  // les longues traînées de fumée
  for(let k=0;k<7;k++){g.fillStyle='rgba(60,50,60,'+(.18+R()*.2)+')';g.beginPath();g.ellipse(R()*W,150+R()*120,200+R()*200,10+R()*14,-.05,0,7);g.fill()}
  // la crête au loin : le bois Fumin réduit à des chicots
  g.fillStyle='#2a2430';g.beginPath();g.moveTo(0,330);for(let x=0;x<=W;x+=10)g.lineTo(x,300+Math.sin(x*.01)*8+Math.sin(x*.033)*4);g.lineTo(W,330);g.fill();
  g.strokeStyle='#221c26';for(let k=0;k<44;k++){const x=R()*W,h=10+R()*34;g.lineWidth=1.5+R()*2;g.beginPath();g.moveTo(x,306);g.lineTo(x+(R()-.5)*6,306-h);g.stroke();if(R()<.5){g.lineWidth=1;g.beginPath();g.moveTo(x,306-h*.6);g.lineTo(x+(R()-.5)*16,306-h*.8);g.stroke()}}
  // le rempart de terre au-delà de la gorge : talus labouré, piquets, barbelés, chicots
  g.fillStyle='#3a3028';g.beginPath();g.moveTo(0,gy);g.lineTo(0,322);for(let x=0;x<=380;x+=12)g.lineTo(x,318+Math.sin(x*.05)*5+((x*13)%7)+x*.04);g.lineTo(380,gy);g.closePath();g.fill();
  const tg=g.createLinearGradient(0,320,0,gy);tg.addColorStop(0,'rgba(200,140,110,.25)');tg.addColorStop(1,'rgba(0,0,0,.35)');g.fillStyle=tg;g.fillRect(0,318,380,gy-318);
  for(let k=0;k<16;k++){const x=R()*380,y=340+R()*100;g.fillStyle='#2a221c';g.beginPath();g.ellipse(x,y,14+R()*20,5+R()*5,0,0,7);g.fill();g.fillStyle='rgba(200,150,120,.12)';g.beginPath();g.ellipse(x,y-4,12+R()*14,2,0,0,7);g.fill()}
  g.strokeStyle='#201a16';g.lineWidth=2;for(let k=0;k<9;k++){const x=20+k*40+R()*10,y=322+x*.04;g.beginPath();g.moveTo(x,y+4);g.lineTo(x+2,y-20);g.stroke()}
  g.lineWidth=.8;for(let r=0;r<3;r++){g.beginPath();for(let x=20;x<380;x+=5)g.lineTo(x,310+x*.04+r*4+Math.sin(x*.8+r)*2.5);g.stroke()}
  vxWire(g,0,380,x=>322+x*.04,22,'#1e1814');vxWire(g,300,W+40,x=>gy-236+Math.sin(x*.05)*3,20,'#221c18');
  // le mur de gorge et son fossé, à gauche
  g.fillStyle='#3a3430';g.beginPath();g.moveTo(0,gy-120);g.lineTo(150,gy-110);g.lineTo(170,gy);g.lineTo(0,gy);g.closePath();g.fill();
  g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=1;for(let y=gy-110;y<gy;y+=12){g.beginPath();g.moveTo(0,y);g.lineTo(160,y+2);g.stroke()}
  // la caserne : façade en moellons, carapace de béton, terre au-dessus
  const fx0=360,fx1=W+40,ft=gy-180;
  g.fillStyle='#5a5042';g.beginPath();g.moveTo(fx0-60,ft-40);for(let x=fx0-60;x<=fx1;x+=14)g.lineTo(x,ft-62-Math.sin(x*.05)*6-((x*7)%13));g.lineTo(fx1,ft-30);g.closePath();g.fill();
  for(let k=0;k<9;k++){const x=fx0+R()*(fx1-fx0),y=ft-55;g.fillStyle='#3a3228';g.beginPath();g.ellipse(x,y,24+R()*20,8,0,Math.PI,0);g.fill()}
  g.strokeStyle='#2a2420';g.lineWidth=1.4;for(let k=0;k<10;k++){const x=fx0+R()*(fx1-fx0);g.beginPath();g.moveTo(x,ft-55);g.lineTo(x+(R()-.5)*8,ft-90);g.stroke();g.beginPath();for(let j=0;j<8;j++){g.lineTo(x+j*6,ft-82+Math.sin(j*2)*4)}g.stroke()}
  // la tourelle de 75 et la cloche d'observation
  g.fillStyle='#3a3c40';g.beginPath();g.ellipse(760,ft-60,46,14,0,Math.PI,0);g.fill();g.fillStyle='#4a4e54';g.beginPath();g.ellipse(760,ft-62,34,10,0,Math.PI,0);g.fill();
  g.fillStyle='#34363a';g.beginPath();g.ellipse(560,ft-58,16,14,0,Math.PI,0);g.fill();g.fillStyle='#0a0a0c';g.fillRect(552,ft-64,16,3);
  g.fillStyle='#8a8478';g.fillRect(fx0-20,ft-42,fx1-fx0+20,44);g.fillStyle='rgba(0,0,0,.2)';for(let x=fx0;x<fx1;x+=80)g.fillRect(x,ft-42,2,44);
  g.strokeStyle='rgba(30,26,22,.5)';g.lineWidth=1.2;for(let k=0;k<12;k++){const x=fx0+R()*(fx1-fx0);g.beginPath();g.moveTo(x,ft-42);g.lineTo(x+(R()-.5)*20,ft-20);g.lineTo(x+(R()-.5)*30,ft);g.stroke()}
  g.fillStyle='#6e6656';g.fillRect(fx0,ft,fx1-fx0,gy-ft);
  for(let y=ft;y<gy;y+=11){let x=fx0+((y/11|0)%2?0:12);while(x<fx1){const w=18+R()*14;g.fillStyle=mix('#7e7464','#5a5242',R());g.fillRect(x+1,y+1,w-2,9);x+=w}}
  // les ouvertures en plein cintre : murées de sacs, une porte entrouverte
  const ops=[[410,'bag'],[520,'door'],[630,'bag'],[740,'win'],[850,'bag']];
  for(const[x,k]of ops){const w=66,h=120,y=gy;g.fillStyle='#bab09c';g.beginPath();g.moveTo(x-w/2-8,y);g.lineTo(x-w/2-8,y-h+w/2);g.arc(x,y-h+w/2,w/2+8,Math.PI,0);g.lineTo(x+w/2+8,y);g.closePath();g.fill();
    g.fillStyle='#0c0a0a';g.beginPath();g.moveTo(x-w/2,y);g.lineTo(x-w/2,y-h+w/2);g.arc(x,y-h+w/2,w/2,Math.PI,0);g.lineTo(x+w/2,y);g.closePath();g.fill();
    for(let a=0;a<9;a++){const th=Math.PI+a/8*Math.PI;g.strokeStyle='rgba(60,50,40,.5)';g.lineWidth=1;g.beginPath();g.moveTo(x+Math.cos(th)*w/2,y-h+w/2+Math.sin(th)*w/2);g.lineTo(x+Math.cos(th)*(w/2+8),y-h+w/2+Math.sin(th)*(w/2+8));g.stroke()}
    if(k==='bag'){g.save();g.beginPath();g.moveTo(x-w/2,y);g.lineTo(x-w/2,y-h+w/2);g.arc(x,y-h+w/2,w/2,Math.PI,0);g.lineTo(x+w/2,y);g.closePath();g.clip();for(let r=0;r<10;r++)for(let j=-1;j<3;j++)vxSandbag(g,x-w/2+j*24+(r%2)*12,y-13-r*11.5,26,13,.15);g.restore()}
    else if(k==='door'){g.fillStyle='#3a2a1a';g.beginPath();g.moveTo(x-w/2,y);g.lineTo(x-w/2+18,y-6);g.lineTo(x-w/2+18,y-h+w/2+8);g.lineTo(x-w/2,y-h+w/2);g.closePath();g.fill();g.fillStyle='rgba(255,190,110,.25)';g.fillRect(x-w/2+20,y-90,w-24,90)}
    else{g.save();g.beginPath();g.rect(x-w/2,y-60,w,60);g.clip();for(let r=0;r<5;r++)for(let j=-1;j<3;j++)vxSandbag(g,x-w/2+j*24+(r%2)*12,y-13-r*11.5,26,13,.15);g.restore();g.strokeStyle='#2a2420';g.lineWidth=2.5;for(let k2=1;k2<4;k2++){g.beginPath();g.moveTo(x-w/2+k2*w/4,y-52);g.lineTo(x-w/2+k2*w/4,y-h+12);g.stroke()}}}
  // les traces des obus sur la façade
  for(let k=0;k<14;k++){const x=fx0+R()*(fx1-fx0),y=ft+R()*(gy-ft-40);g.fillStyle='rgba(30,26,22,.55)';g.beginPath();g.ellipse(x,y,6+R()*10,4+R()*6,R()*3,0,7);g.fill()}
  // la cour : la boue, les entonnoirs pleins d'eau, les pierres, les caillebotis
  const gg=g.createLinearGradient(0,gy-10,0,H);gg.addColorStop(0,'#4a3e30');gg.addColorStop(1,'#241c14');g.fillStyle=gg;g.fillRect(0,gy-4,W,H-gy+4);
  for(const[x,w]of[[120,90],[300,60],[690,110]]){g.fillStyle='#2a2018';g.beginPath();g.ellipse(x,gy+30,w,14,0,0,7);g.fill();const wg=g.createLinearGradient(0,gy+20,0,gy+40);wg.addColorStop(0,'#c88a6a');wg.addColorStop(1,'#4a3c50');g.fillStyle=wg;g.beginPath();g.ellipse(x,gy+31,w*.8,9,0,0,7);g.fill()}
  for(let k=0;k<60;k++){g.fillStyle=mix('#6a5a46','#3a3024',R());g.beginPath();g.ellipse(R()*W,gy+6+R()*60,2+R()*7,1.5+R()*3,R()*3,0,7);g.fill()}
  g.fillStyle='#5a4630';for(let k=0;k<7;k++){g.fillRect(400+k*44,gy+50,38,6);g.fillStyle='#3a2a1a';g.fillRect(400+k*44,gy+55,38,2);g.fillStyle='#5a4630'}
  // la roue de voiture brisée, les barbelés roulés, un mur de sacs à gauche
  g.strokeStyle='#3a2a1a';g.lineWidth=4;g.beginPath();g.arc(230,gy+8,30,Math.PI*1.1,Math.PI*2.1);g.stroke();g.lineWidth=3;for(let k=0;k<6;k++){const a=Math.PI*1.1+k*.33;g.beginPath();g.moveTo(230,gy+8);g.lineTo(230+Math.cos(a)*28,gy+8+Math.sin(a)*28);g.stroke()}
  g.strokeStyle='#3a3430';g.lineWidth=1;for(let k=0;k<14;k++){g.beginPath();g.ellipse(40+k*9,gy-8,9,12,0,0,7);g.stroke()}
  return c;
}
function yardRender(t){
  const s=V.s;if(!yardCache||yardCache.rsKey!==RS){yardCache=yardBuild();yardCache.rsKey=RS}
  const lift=0,zi=Math.min(1,V.t/6),zo=s.throwT>0?clamp((s.throwT-.3)/1.6,0,1):0,ez=zo*zo*(3-2*zo),z=lerp(lerp(1.25,1.7,zi*zi*(3-2*zi)),1.0,ez),fx=lerp(430,480,ez),fy=lerp(lerp(360,372,zi),270,ez);const hw=W/(2*z),hh=H/(2*z),cfx=clamp(fx,hw,W-hw),cfy=clamp(fy,hh,H-hh);
  ctx.save();ctx.translate(W/2,H/2);ctx.scale(z,z);ctx.translate(-cfx,-cfy);ctx.drawImage(yardCache,0,0,W,H);
  // les fusées éclairantes, les lueurs des obus au loin
  for(const f of s.flares){const gl=ctx.createRadialGradient(f.x,f.y,1,f.x,f.y,90);gl.addColorStop(0,'rgba(255,250,220,.3)');gl.addColorStop(1,'rgba(255,250,220,0)');ctx.fillStyle=gl;ctx.fillRect(f.x-90,f.y-90,180,180);
    ctx.fillStyle='#fffbe8';ctx.beginPath();ctx.arc(f.x,f.y,2.4,0,7);ctx.fill();ctx.strokeStyle='rgba(220,220,220,.25)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(f.x,f.y);ctx.lineTo(f.x+3,f.y-30);ctx.stroke()}
  for(const b of s.booms){const a=1-b.t/1.4;ctx.fillStyle='rgba(255,170,90,'+a*.4+')';ctx.beginPath();ctx.ellipse(b.x,b.y,40+b.t*40,14+b.t*10,0,0,7);ctx.fill();ctx.fillStyle='rgba(50,44,50,'+a*.5+')';ctx.beginPath();ctx.arc(b.x,b.y-20-b.t*40,10+b.t*30,0,7);ctx.fill()}
  const gy=YD.g;
  // la sentinelle, derrière son mur de sacs
  vxSoldier(ctx,{x:214,y:gy,s:8.6,f:-1,side:'fr',t,pose:Object.assign({},VX_P.aim,{lean:.1}),rifle:{from:'far',bayo:1},face:{skin:VX_SKIN[3],hair:VX_HAIR[0],stache:'walrus',helmet:'adrian',ex:'angry',stubble:.7,look:[1,0]},kit:{}});
  for(let r=0;r<4;r++)for(let j=0;j<4-(r>2?1:0);j++)vxSandbag(ctx,166+j*27+(r%2)*13,gy-15-r*13,29,15,0);
  // l'officier à la porte, aux jumelles ; le colombophile assis sur sa caisse
  vxSoldier(ctx,{x:532,y:gy,s:9,f:-1,side:'fr',t,pose:VX_P.binoc,face:{skin:VX_SKIN[0],hair:VX_HAIR[4],stache:'up',helmet:'kepi',ex:'neutral',look:[1,-.3]},kit:{}});
  {vxSoldier(ctx,{hip:{x:668,y:gy-34},s:9,f:-1,side:'fr',t,pose:Object.assign({},VX_P.sit,{lean:.15,head:.2,nT:{x:3.6,y:-1},fT:{x:3.2,y:-.8}}),face:{skin:VX_SKIN[4],hair:VX_HAIR[1],beard:1,helmet:'adrian',ex:'sad',look:[.5,.7]},kit:{musette:1}});
   ctx.fillStyle='#6a4a2a';ctx.fillRect(640,gy-34,56,34);ctx.fillStyle='rgba(0,0,0,.2)';ctx.fillRect(640,gy-20,56,3);vxBasket(ctx,626,gy,44,32,{win:-6})}
  // les brancardiers qui passent
  {const u=((s.walk*36)%1500)-200,x=W+140-u;for(const k of[0,1]){vxSoldier(ctx,{x:x+k*96,y:gy+14,s:8.6,f:-1,side:'fr',t,pose:Object.assign(vxWalk(s.walk*6+k*3,.7),{nT:{x:1.4,y:-1.2},fT:{x:1.2,y:-1.4}}),face:{skin:VX_SKIN[k+1],hair:VX_HAIR[k],stache:k?'walrus':null,helmet:'adrian',ex:'worry',stubble:.6},kit:{}})}
   ctx.fillStyle='#5a4a34';ctx.fillRect(x-20,gy-50,140,5);ctx.fillStyle='#c8bfa4';ctx.fillRect(x-6,gy-58,110,9);ctx.fillStyle='#8296ac';rr(ctx,x+20,gy-66,70,12,5);ctx.fill();
   vxHead(ctx,{x:x+8,y:gy-64,s:7.4,f:-1,skin:'#d8c0a8',hair:VX_HAIR[3],ex:'sleep',helmet:'none',tilt:1.5,stubble:.8});ctx.fillStyle='#f4f0e6';ctx.fillRect(x+2,gy-72,14,5);ctx.fillStyle='#a8322d';ctx.fillRect(x+7,gy-72,4,5)}
  // Lucien, au premier plan, qui tient Raymond contre lui… puis le lance
  const hold=Object.assign({},VX_P.stand,{nT:{x:2.5,y:-2.4},fT:{x:2.0,y:-2.7},head:.45}),crouch=Object.assign({},VX_P.stand,{lean:.22,lh:.32,lk:-.12,rh:.18,rk:-.2,nT:{x:2.2,y:-1.4},fT:{x:1.8,y:-1.6},head:.2}),
    up=Object.assign({},VX_P.throwUp,{nT:{x:2.4,y:-10.8},fT:{x:1.9,y:-10.6}}),tt=s.throwT;
  const pose=tt<0?hold:tt<.6?vxPoseMix(hold,crouch,Math.sin(tt/.6*Math.PI/2)):tt<1.05?vxPoseMix(crouch,up,Math.pow((tt-.6)/.45,1.5)):tt<2.4?up:vxPoseMix(up,hold,Math.min(1,(tt-2.4)/.8));const th=tt<.6?0:Math.min(1,(tt-.6)/.45);
  const j=vxSoldier(ctx,{x:412,y:512,s:15.5,f:-1,side:'fr',t,regt:'142',pose,kit:{musette:1,bidon:1},
    face:{skin:'#ecc8a6',hair:'#cfae6a',stache:'croc',beardCol:'#b8954e',helmet:'adrian',ex:th>.6?'worry':'sad',young:1,stubble:.45,eye:'#3f78b8',tired:1,look:th>.3?[.6,-1]:[.8,.7],mud:1}});
  s.hands={x:(j.nh.x+j.fh.x)/2,y:(j.nh.y+j.fh.y)/2};
  if(!s.bird){vxPigeon(ctx,s.hands.x-4,s.hands.y-2,1.15,-1,t,{fold:1,flap:-1.2});
    // les doigts de Lucien par-dessus l'aile
    ctx.fillStyle='#e8c6a4';for(let k=0;k<3;k++){rr(ctx,s.hands.x-16+k*7,s.hands.y-12+k,5,13,2.5);ctx.fill()}}
  else{const b=s.bird;vxPigeon(ctx,b.x,b.y,1.3,-1,t,{rot:clamp(b.vy/900,-.45,.2),flap:b.t*(b.t<.45?6:13),fold:b.t<.25?1-b.t*4:0});if(b.t<.6&&rnd()<.3)V.parts.push({k:'feather',x:b.x,y:b.y,vx:(rnd()-.5)*60,vy:-20,g:60,drag:2,life:0,max:1.8,rot:rnd()*6,vr:(rnd()-.5)*4})}
  vxParts(ctx);
  ctx.restore();
  vxDark([{x:540,y:300,r:300,i:.45},{x:480,y:330,r:420,i:.4}],.26);
}

/* en vol : les messages s'écrivent dans une bande en bas de l'écran, pour ne jamais cacher les obus qui tombent */
function vxQuipBand(){G.homeBox=null;const by=H-64;ctx.fillStyle='#0d0b0e';ctx.fillRect(0,by,W,64);ctx.fillStyle='rgba(233,223,199,.18)';ctx.fillRect(0,by,W,1);
  const q=G.quip;if(!q||!q.text)return;const a=Math.min(1,q.t*4,(q.dur-q.t)*3);if(a<=0)return;
  ctx.save();ctx.globalAlpha=a;const who=q.who||'RAYMOND',wc={RAYMOND:'#c84a42',LUCIEN:'#6a8ac0'}[who]||'#9a9a9a';
  ctx.font='italic 18px '+F_BODY;const lines=wrap(ctx,q.text,780).slice(0,2);
  ctx.fillStyle=wc;ctx.font='11px '+F_DISP;ctx.textAlign='left';ctx.fillText(who,40,by+(lines.length>1?22:30));
  ctx.fillStyle='#e8dec5';ctx.font='italic 18px '+F_BODY;lines.forEach((l,k)=>ctx.fillText(l,140,by+(lines.length>1?24:36)+k*22));ctx.restore()}
/* ---------- branchements dans le jeu ---------- */
function vauxActive(){return L&&L.def&&L.def.vaux&&V}
