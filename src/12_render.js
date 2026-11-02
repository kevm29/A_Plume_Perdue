/* =========================================================
   RENDU EN JEU
   ========================================================= */
const lightC=mk(W,H),lg=lightC.getContext('2d');
const vignC=(()=>{const c=mk(W,H),g=c.getContext('2d');const gr=g.createRadialGradient(W/2,H/2,H*.4,W/2,H/2,H*.98);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(5,3,10,.6)');g.fillStyle=gr;g.fillRect(0,0,W,H);return c})();
const rainDrops=Array.from({length:160},()=>({x:rnd()*W,y:rnd()*H,l:10+rnd()*16,s:.7+rnd()*.6}));
function drawLayer(img,px,py){
  const rs=img.rs||RS,sw=Math.min(W+40,img.width/rs-px);if(sw<=0)return;
  if(img.chunks)blitLayer(ctx,img,px*rs,py*rs,sw*rs,H*rs,0,0,sw,H);else ctx.drawImage(img,px*rs,py*rs,sw*rs,H*rs,0,0,sw,H);
}
function renderWorld(lv,cx,cy,t,opts){
  opts=opts||{};
  ctx.fillStyle='#0d0b10';ctx.fillRect(0,0,W,H);
  drawLayer(lv.far,Math.max(0,cx*PF_FAR),cy*PF_FAR);
  for(const tb of lv.turbines||[]){const x=tb.x-cx*PF_FAR,y=tb.y-cy*PF_FAR;if(x<-200||x>W+200)continue;ctx.save();ctx.translate(x,y);ctx.rotate(t*tb.sp+tb.ph);ctx.fillStyle=mix(lv.th.sky[1],'#ffffff',.3);for(let k=0;k<3;k++){ctx.rotate(Math.PI*2/3);ctx.beginPath();ctx.moveTo(-3,0);ctx.quadraticCurveTo(-5,-tb.r*.5,0,-tb.r);ctx.quadraticCurveTo(4,-tb.r*.5,3,0);ctx.fill()}ctx.restore()}
  drawLayer(lv.mid,Math.max(0,cx*PF_MID),cy*PF_MID);
  ctx.save();ctx.translate(-cx,-cy);
  if(lv.meuse&&!opts.noEntities)drawMeuseBack(t);
  if(lv.zr&&!opts.noEntities)drawZrBack(t);
  if(lv.train&&!opts.noEntities)drawTrainBack(t);
  if(lv.lgLayer)drawLangletBack(t,cx);
  if(lv.fcLayer)drawFacadeBack(t,cx,cy);
  if(lv.a4Layer)drawA4Back(t,cx);
  for(const d of lv.decor)if(d.x>cx-460&&d.x<cx+W+460)drawDecor(ctx,d,t);
  if(lv.backDoor)drawBackDoor(ctx,lv.backDoor.x,lv.dome.floor,lv.backDoor.open);
  if(lv.armoire)drawArmoire(ctx,lv.armoire.x,lv.dome.floor,lv.armoire.shake,lv.armoire.door);
  if(lv.tiles){const tr=lv.tiles.rs||RS,sx=Math.max(0,cx-30),sw=Math.min(W+80,lv.tiles.width/tr-sx);if(sw>0)blitLayer(ctx,lv.tiles,sx*tr,0,sw*tr,lv.tiles.height,sx,-PAD,sw,lv.tiles.height/tr)}
  if(lv.dome){const dg=domeGeom(lv.dome);drawPlinth(ctx,lv.dome.x,dg.top,lv.dome.floor);drawDome(ctx,lv.dome.x,dg.oy,DOME_S,t,{noBird:true,broken:lv.dome.broken})}
  for(const u of lv.updrafts||[]){if(u.x<cx-100||u.x>cx+W+100)continue;ctx.strokeStyle='rgba(235,240,250,.22)';ctx.lineWidth=1.5;for(let k=0;k<7;k++){const ph=((t*.9+k/7)%1),yy=u.bottom-ph*u.bottom,xx=u.x+10+((k*17)%(u.w-20))+Math.sin(t*3+k)*6;ctx.globalAlpha=Math.sin(ph*Math.PI);ctx.beginPath();ctx.moveTo(xx,yy);ctx.quadraticCurveTo(xx+6,yy-20,xx,yy-44);ctx.stroke()}ctx.globalAlpha=1}
  if(!opts.noEntities){if(lv.zr)drawZrMid(t);if(lv.musee)drawMuseeMid(t);if(lv.train)drawTrainMid(t);if(lv.gare)drawGareMid(t);if(lv.lg)drawLangletMid(t);if(lv.fc)drawFacadeMid(t);if(lv.a4)drawA4Mid(t);drawMechBack(t);drawVerdunBack(t);drawEntities(t);drawMarbles();drawMines(t);drawDroneExtras(t);drawMechFront(t);drawVerdunFront(t);drawMeuseFront(t);if(L.zr)drawZrFront(t);if(L.musee)drawMuseeFront(t);if(L.train)drawTrainFront(t);if(L.lg)drawLangletFront(t);drawActPrompt(t)}
  ctx.restore();
}
let rayC=null,rayG=null;
function drawEntities(t){
  const vis=x=>x>cam.x-120&&x<cam.x+W+120,th=L.th;
  for(const h of L.hints)if(vis(h.x)){const m=/(FIG\.|ARTICLE) (\d+)/.exec(L.def.hints[h.i][0]);drawEasel(ctx,h.x,h.y,m?m[2]:'§',th.outdoor)}
  for(const cp of L.cps)if(vis(cp.x))drawCartel(ctx,cp.x,cp.y,cp.on,t,th.outdoor);
  if(L.exit)drawExit(ctx,L.exit,L.def.exit,t,L.def.exitLabel);
  for(const m of L.movers)if(vis(m.x)||vis(m.x+m.w))drawMover(ctx,m);
  for(const k of L.corn)if(!k.taken&&vis(k.x))drawTuft(ctx,k.x,k.y,t+k.ph);
  if(L.medal&&!L.medal.taken)drawMedal(ctx,L.medal.x,L.medal.y,t);
  for(const b of L.bolts){if(!vis(b.x)||b.state==='idle')continue;const floor=13*T;
    if(b.state==='warn'){const a=.25+.25*Math.sin(t*20);ctx.fillStyle='rgba(200,220,255,'+a+')';ctx.beginPath();ctx.ellipse(b.x,floor-2,30,6,0,0,7);ctx.fill();ctx.strokeStyle='rgba(200,220,255,'+(a*.6)+')';ctx.lineWidth=1;ctx.setLineDash([4,6]);ctx.beginPath();ctx.moveTo(b.x,0);ctx.lineTo(b.x,floor);ctx.stroke();ctx.setLineDash([])}
    else{ctx.strokeStyle='rgba(235,245,255,.95)';ctx.lineWidth=4;ctx.beginPath();let x=b.x,y=-20;ctx.moveTo(x,y);const R=mulberry((G.lt*10|0)+b.x);while(y<floor){y+=30+R()*20;x=b.x+(R()-.5)*30;ctx.lineTo(x,Math.min(y,floor))}ctx.stroke();ctx.lineWidth=12;ctx.strokeStyle='rgba(160,190,255,.25)';ctx.stroke();ctx.fillStyle='rgba(235,245,255,.6)';ctx.beginPath();ctx.ellipse(b.x,floor,40,10,0,0,7);ctx.fill()}}
  if(L.carton&&L.carton.state!=='hold'&&L.carton.state)drawCarton(ctx,L.carton);
  else if(L.carton&&L.carton.state==='hold')drawCarton(ctx,L.carton);
  if(G.cut&&G.cut.thief.state!=='out'){const th2=G.cut.thief;if(th2.state!=='gone')drawThief(ctx,th2.x,L.dome.floor,G.t,{f:th2.f,head:th2.head,alpha:th2.alpha,pose:th2.state==='walk'?'walk':th2.state==='open'?'reach':th2.state==='oops'?'oops':th2.state==='look'?'look':th2.state==='sneak'||th2.state==='exit'?'sneak':'stand',lamp:th2.state!=='oops'})}
  ctx.save();if(L.train){ctx.shadowColor='rgba(0,0,0,.18)';ctx.shadowOffsetX=2;ctx.shadowOffsetY=2;ctx.shadowBlur=2}else{ctx.shadowColor='rgba(0,0,0,.4)';ctx.shadowOffsetX=6;ctx.shadowOffsetY=7;ctx.shadowBlur=0}
  for(const c of L.rats)if(vis(c.x)&&!inHiddenDugout(c))drawWalker(ctx,c.kind,c.x+c.w/2,c.y+c.h,Math.sign(c.vx)||1,c.t);
  const K=L.chaser;
  if(K){
    if(K.type==='bigrat'){if(K.state!=='sleep'&&K.state!=='dead')drawBigRat(ctx,K.x+K.w/2,K.y+K.h,K.f||1,K.t,K.state==='chase'||K.state==='gone')}
    else if(K.type==='cat'){if(K.state==='sleep')drawSleepingCat(ctx,K.home.x+K.w/2,K.home.y+K.h,t);
      else drawCat(ctx,K.x+K.w/2,K.y+K.h,K.f||1,K.t,K.state==='chase'?1.4:0,{size:1.45,col:'#c7742e',rim:'#e9a050',stripes:true,eye:'#9ad84a',mouth:K.meowT>1.6||K.state==='wake'})}
    else if(K.type==='drone'){if(K.state!=='dead'){if(K.rot){ctx.save();ctx.translate(K.x+K.w/2,K.y+K.h/2);ctx.rotate(K.rot);drawDrone(ctx,0,0,K.t,true);ctx.restore()}else drawDrone(ctx,K.x+K.w/2,K.y+K.h/2,K.t,K.state!=='sleep')}}
    else if(K.type==='guardnet'&&K.state==='sleep')drawGuardAsleep(ctx,K.home.x+K.w/2,K.home.y+K.h,t);
    else if(K.type==='guardnet')drawGuard(ctx,K.x+K.w/2,K.y+K.h,K.t,{f:K.f||1,walk:K.state==='chase'?1.4:0,net:true});
    else if(K.type==='sweeper')drawSweeper(ctx,K,K.t);
    else if(K.state==='dead'&&K.floor){const ax=K.x+K.w/2,ay=K.floor;ctx.save();ctx.fillStyle='#1d1814';ctx.beginPath();ctx.ellipse(ax,ay-3,22,6,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#3a2f27';ctx.beginPath();ctx.ellipse(ax-4,ay-6,12,5,-.2,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,120,40,'+(.35+.25*Math.sin(G.t*6))+')';ctx.beginPath();ctx.arc(ax+5,ay-5,2.5,0,Math.PI*2);ctx.arc(ax-9,ay-4,1.8,0,Math.PI*2);ctx.fill();
      for(let i=0;i<3;i++){const ph=(G.t*.5+i/3)%1;ctx.fillStyle='rgba(120,110,100,'+(.35*(1-ph))+')';ctx.beginPath();ctx.arc(ax+Math.sin(ph*6+i)*6,ay-10-ph*60,4+ph*10,0,Math.PI*2);ctx.fill()}ctx.restore()}
    else if(K.state!=='dead'){drawBuse(ctx,K.x+K.w/2,K.y+K.h/2,K.t,K.f||1,K.state==='dive'||K.state==='burn');if(K.state==='burn')drawFire(ctx,K.x+K.w/2,K.y+K.h+16,K.t*1.5)}
  }
  if(K&&K.type==='drone'&&K.sp==='aim'&&Math.sin(K.t*40)>0){ctx.save();const gx=K.x+K.w/2,gy=K.y+K.h/2+6;const gl=ctx.createRadialGradient(gx,gy,1,gx,gy,22);gl.addColorStop(0,'rgba(255,60,40,.8)');gl.addColorStop(1,'rgba(255,60,40,0)');ctx.fillStyle=gl;ctx.beginPath();ctx.arc(gx,gy,22,0,7);ctx.fill();ctx.restore()}
  ctx.restore();
  for(const m of L.moths)if(vis(m.x))drawFlyer(ctx,m.kind,m.x,m.y,m.t,m.dir||1);
  for(const p of parts){const a=1-p.life/p.max;
    if(p.type==='straw'){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.strokeStyle=rgba('#e0b04e',a);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-p.len/2,0);ctx.lineTo(p.len/2,0);ctx.stroke();ctx.restore()}
    else if(p.type==='feather'){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot*.3);ctx.fillStyle=rgba('#9aa2b3',a);ctx.beginPath();ctx.ellipse(0,0,5,2,0,0,7);ctx.fill();ctx.restore()}
    else if(p.type==='dust'){ctx.fillStyle=rgba('#cbbfa6',a*.6);ctx.beginPath();ctx.arc(p.x,p.y,3+p.life*10,0,7);ctx.fill()}
    else if(p.type==='drop'){ctx.fillStyle='rgba(225,240,248,'+a*.85+')';ctx.beginPath();ctx.arc(p.x,p.y,1.6+p.sz,0,7);ctx.fill()}
    else if(p.type==='glass'){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillStyle='rgba(215,232,242,'+(.6*Math.min(1,(p.max-p.life)/2))+')';poly(ctx,[-p.sz,0,0,-p.sz*.7,p.sz*.8,p.sz*.4]);ctx.fill();ctx.restore()}
    else if(p.type==='spark'){ctx.strokeStyle=rgba('#ffe7a0',a);ctx.lineWidth=2;const r=6+p.life*50;for(let k=0;k<6;k++){const an=k*Math.PI/3;ctx.beginPath();ctx.moveTo(p.x+Math.cos(an)*r*.5,p.y+Math.sin(an)*r*.5);ctx.lineTo(p.x+Math.cos(an)*r,p.y+Math.sin(an)*r);ctx.stroke()}}
    else if(p.type==='tuftpop'){ctx.save();ctx.globalAlpha=Math.min(1,(p.max-p.life)*3);drawTuft(ctx,p.x,p.y-Math.min(1,p.life*3)*26,G.t);ctx.restore()}
    else if(p.type==='ring'){ctx.strokeStyle=rgba('#e9dfc7',a*.7);ctx.lineWidth=3*a;ctx.beginPath();ctx.arc(p.x,p.y,8+p.life*120,0,7);ctx.stroke()}}
  if(!P.dead&&!P.hideIn){
    const C=G.cut;
    const walk=P.onGround&&!C?Math.min(1,Math.abs(P.vx)/RUN):0;
    const closed=(!!C&&(C.ray==='statue'||C.ray==='fly'||C.ray==='lie')&&!(C.blink>0))||P.idle>60;
    // Raymond est d'abord dessiné à part, puis posé d'un bloc : une seule ombre portée (sinon chaque pièce projette la sienne et il paraît dédoublé)
    const lift=P.spin?-30*Math.pow(Math.sin(P.spin/2),2):0;
    const sc=ctx.getTransform().a||1,SZ=200;if(!rayC||rayC.width!==Math.ceil(SZ*sc)){rayC=mk(Math.ceil(SZ*sc),Math.ceil(SZ*sc));rayG=rayC.getContext('2d')}
    rayG.setTransform(1,0,0,1,0,0);rayG.clearRect(0,0,rayC.width,rayC.height);rayG.setTransform(sc,0,0,sc,0,0);
    drawRaymond(rayG,SZ/2,SZ*.72,{f:P.facing,t:G.t,walk,air:!P.onGround&&!C,flap:P.flapT,glide:P.gliding||P.lift,wear:wear(),sx:P.sx,sy:P.sy,size:1.15,rot:P.spin,eyeClosed:closed});
    // dehors, pas d'ombre projetée sur le ciel : une ombre au sol, sous les pattes
    const outd=L.th.outdoor;
    if(outd&&P.onGround){ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(P.x+P.w/2,P.y+P.h+1,16,3.5,0,0,7);ctx.fill()}
    ctx.save();if(!outd){ctx.shadowColor='rgba(0,0,0,.4)';ctx.shadowOffsetX=6;ctx.shadowOffsetY=7;ctx.shadowBlur=0}
    ctx.drawImage(rayC,P.x+P.w/2-SZ/2,P.y+P.h+lift-SZ*.72,SZ,SZ);
    ctx.restore();
    // robustesse des ailes : petite jauge au-dessus de Raymond, seulement quand elle n'est pas pleine
    if(!C&&P.stam<STAM_MAX-.5){const bx=P.x+P.w/2-18,by=P.y-16,k=P.stam/STAM_MAX,al=Math.min(1,(STAM_MAX-P.stam)/10);
      ctx.save();ctx.globalAlpha=al;ctx.fillStyle='rgba(14,12,18,.65)';rr(ctx,bx-2,by-2,40,8,4);ctx.fill();
      ctx.fillStyle=P.torn?'rgba(200,48,42,'+(.6+.4*Math.sin(G.t*10))+')':(P.stam<STAM_FLAP?'#c8783a':'#d9a441');if(k>0){rr(ctx,bx,by,36*k,4,2);ctx.fill()}
      ctx.strokeStyle='rgba(233,223,199,.35)';ctx.lineWidth=.8;for(const t of[.3,.6]){ctx.beginPath();ctx.moveTo(bx+36*t,by-1);ctx.lineTo(bx+36*t,by+5);ctx.stroke()}
      if(P.torn){ctx.strokeStyle='#e9dfc7';ctx.lineWidth=1;ctx.setLineDash([2,2]);ctx.beginPath();ctx.moveTo(bx,by+2);ctx.lineTo(bx+36,by+2);ctx.stroke();ctx.setLineDash([])}
      ctx.restore()}
  }
  for(const b of G.bubbles){const a=Math.min(1,b.t*6,(b.max-b.t)*4);ctx.save();ctx.globalAlpha=a;ctx.translate(b.x,b.y-b.t*18);ctx.rotate(b.rot);ctx.font='14px '+F_DISP;const w=ctx.measureText(b.text).width+16;
    ctx.fillStyle='rgba(0,0,0,.25)';rr(ctx,-w/2+2,-10,w,22,4);ctx.fill();ctx.fillStyle='#ece3cc';rr(ctx,-w/2,-12,w,22,4);ctx.fill();
    ctx.fillStyle=b.col;ctx.textAlign='center';ctx.fillText(b.text,0,4);ctx.restore()}
}
function renderLighting(lv,cx,cy,t,extra){
  const th=lv.th;
  lg.globalCompositeOperation='source-over';lg.clearRect(0,0,W,H);
  lg.fillStyle='rgba(8,6,16,'+(lv.darkNow!=null?lv.darkNow:th.dark)+')';lg.fillRect(0,0,W,H);
  lg.globalCompositeOperation='destination-out';
  const lights=[];
  for(const l of lv.lights)lights.push(l);
  if(extra)for(const l of extra)lights.push(l);
  for(const l of lights){const x=l.x-cx,y=l.y-cy;if(x<-l.r||x>W+l.r)continue;const fl=l.flick?1+Math.sin(t*9+l.x)*.04:1;
    const gr=lg.createRadialGradient(x,y,0,x,y,l.r*fl);gr.addColorStop(0,'rgba(0,0,0,'+l.i+')');gr.addColorStop(1,'rgba(0,0,0,0)');lg.fillStyle=gr;lg.fillRect(x-l.r,y-l.r,l.r*2,l.r*2)}
  ctx.drawImage(lightC,0,0);
  ctx.save();ctx.globalCompositeOperation='screen';
  for(const l of lights){if(!l.warm)continue;const x=l.x-cx,y=l.y-cy;if(x<-l.r||x>W+l.r)continue;const gr=ctx.createRadialGradient(x,y,0,x,y,l.r*.7);gr.addColorStop(0,l.warm===2?'rgba(255,120,50,.22)':'rgba(255,200,120,.16)');gr.addColorStop(1,'rgba(255,190,110,0)');ctx.fillStyle=gr;ctx.fillRect(x-l.r,y-l.r,l.r*2,l.r*2)}
  for(const w of lv.windows||[]){const x=w.x-cx*PF_FAR,y=w.y-cy*PF_FAR;if(x<-500||x>W+100)continue;
    const gr=ctx.createLinearGradient(0,y,0,H);gr.addColorStop(0,'rgba(150,185,215,.15)');gr.addColorStop(1,'rgba(150,185,215,0)');
    ctx.fillStyle=gr;ctx.beginPath();ctx.moveTo(x+6,y+30);ctx.lineTo(x+w.w-6,y+30);ctx.lineTo(x+w.w+260,H+20);ctx.lineTo(x+120,H+20);ctx.closePath();ctx.fill()}
  if(!th.outdoor||th.weather==='night'||th.weather==='mist')for(const m of motes){const x=((m.x-cx*m.z*.4+t*6*m.z)%(W+20)+W+20)%(W+20)-10,y=((m.y-cy*m.z*.4+Math.sin(t*.5+m.ph)*12)%H+H)%H;
    ctx.fillStyle='rgba(230,215,180,'+(.1+.1*Math.sin(t*1.3+m.ph))*m.z+')';ctx.beginPath();ctx.arc(x,y,m.s*m.z,0,7);ctx.fill()}
  ctx.restore();
}
function renderWeather(th,cx,t){
  const w=th.weather;
  if(w==='rain'||w==='storm'){
    ctx.save();ctx.strokeStyle=w==='storm'?'rgba(190,205,225,.38)':'rgba(190,205,225,.3)';ctx.lineWidth=1.1;ctx.beginPath();
    for(const d of rainDrops){const sp=900*d.s,x=((d.x-cx*.2-t*sp*.25)%W+W)%W,y=((d.y+t*sp)%(H+40))-20;ctx.moveTo(x,y);ctx.lineTo(x-d.l*.25,y+d.l)}
    ctx.stroke();ctx.restore();
  }else if(w==='fog'||w==='mist'){
    ctx.save();for(let k=0;k<4;k++){const x=((k*380-t*(12+k*5)-cx*.15)%(W+600)+W+600)%(W+600)-300,y=w==='mist'?470:380+k*40;const gr=ctx.createRadialGradient(x,y,10,x,y,280);gr.addColorStop(0,rgba(th.fog==='#232a3a'?'#9aa4c0':'#c8ccc4',.12));gr.addColorStop(1,'rgba(200,200,200,0)');ctx.fillStyle=gr;ctx.fillRect(x-280,y-280,560,560)}ctx.restore();
  }else if(w==='wind'){
    ctx.save();ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=1;for(let k=0;k<14;k++){const x=((k*137-t*420)%(W+200)+W+200)%(W+200)-100,y=60+((k*71)%380)+Math.sin(t*2+k)*10;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+30,y-4,x+60,y);ctx.stroke()}
    for(let k=0;k<8;k++){const x=((k*211-t*300)%(W+100)+W+100)%(W+100)-50,y=100+((k*97)%360)+Math.sin(t*3+k)*20;ctx.fillStyle=th.windColor||'#c8302a';ctx.beginPath();ctx.ellipse(x,y,3,1.6,t*4+k,0,7);ctx.fill()}ctx.restore();
  }else if(w==='gale'){drawGaleWeather(t,cx)
  }else if(w==='leaves'){drawLeavesWeather(t,cx)
  }else if(w==='dusk'){
    ctx.save();for(let k=0;k<18;k++){const x=((k*97+Math.sin(t*.5+k)*40-cx*.3)%W+W)%W,y=200+((k*53)%280)+Math.sin(t*.8+k*2)*16;ctx.fillStyle='rgba(255,220,140,'+(.3+.3*Math.sin(t*3+k))+')';ctx.beginPath();ctx.arc(x,y,1.6,0,7);ctx.fill()}ctx.restore();
  }
  if(G.flash>0){ctx.fillStyle='rgba(225,235,255,'+(G.flash*.45)+')';ctx.fillRect(0,0,W,H)}
}
function drawForeground(cx,seed,th){
  if(th.far==='train'||th.far==='gareReims'||th.far==='langlet'||th.far==='facade'||th.noFore)return;
  const R=mulberry(seed);const pf=1.35;
  ctx.save();ctx.fillStyle=th.outdoor?mix(th.sky[0],'#000000',.75):'#07060a';
  for(let i=0;i<14;i++){
    const bx=((i*520+R()*300)-cx*pf);
    const kind=R();
    if(bx<-260||bx>W+60)continue;
    if(th.outdoor){if(kind<.6){ctx.beginPath();ctx.moveTo(bx,H+10);for(let k=0;k<9;k++)ctx.lineTo(bx+k*14,H-8-((k*7+i)%4)*7);ctx.lineTo(bx+130,H+10);ctx.fill()}continue}
    if(kind<.5){const w=120+R()*120,h=10+R()*12;ctx.save();ctx.translate(bx,H+4);ctx.rotate((R()-.5)*.1);ctx.fillRect(0,-h,w,h+20);ctx.restore()}
    else if(kind<.8){ctx.fillRect(bx,-10,6,40+R()*60);ctx.beginPath();ctx.ellipse(bx+3,30+R()*60,26,10,0,0,7);ctx.fill()}
    else ctx.fillRect(bx,-10,4,30+R()*30);
  }
  ctx.restore();
}
function strawIcon(x,y,a){ctx.save();ctx.translate(x,y);ctx.globalAlpha=a;ctx.strokeStyle='#e0b04e';ctx.lineWidth=1.6;ctx.lineCap='round';for(let k=-3;k<=3;k++){ctx.beginPath();ctx.moveTo(k*1.2,7);ctx.lineTo(k*2.2,-8);ctx.stroke()}ctx.fillStyle='#a8322d';ctx.fillRect(-5,0,10,3);ctx.restore()}
function lifeIcon(x,y){ctx.save();ctx.translate(x,y);ctx.fillStyle='#8e97a8';ctx.beginPath();ctx.arc(0,0,7,0,7);ctx.fill();ctx.fillStyle='#4f9a7a';ctx.beginPath();ctx.arc(-1,5,5,0,Math.PI);ctx.fill();
  ctx.fillStyle='#e9dfc7';poly(ctx,[6,-1,11,0,6,2]);ctx.fill();ctx.fillStyle='#e08a3a';ctx.beginPath();ctx.arc(2,-2,2.4,0,7);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.arc(2.4,-2,1.1,0,7);ctx.fill();ctx.restore()}
function renderHUD(){
  // étiquette du niveau
  ctx.save();
  const lbl=`${LEVELS[G.li].w+1}–${G.li%4+1} · ${L.def.name}`;
  ctx.font='17px '+F_DISP;const w=ctx.measureText(lbl).width+46;
  ctx.translate(18,16);
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.moveTo(3,4);ctx.lineTo(w+3,4);ctx.lineTo(w+3,38);ctx.lineTo(3,38);ctx.lineTo(13,21);ctx.closePath();ctx.fill();
  ctx.fillStyle='#ebe2ca';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(w,0);ctx.lineTo(w,34);ctx.lineTo(0,34);ctx.lineTo(10,17);ctx.closePath();ctx.fill();
  ctx.fillStyle='#2a2420';ctx.beginPath();ctx.arc(w-12,17,3.5,0,7);ctx.fill();
  ctx.textAlign='left';ctx.fillText(lbl,18,23);
  ctx.restore();
  // bouton maison : retour à l'accueil
  {const hx=18+w+30,hy=33;G.homeBox={x:hx-17,y:hy-17,w:34,h:34};ctx.save();ctx.fillStyle='rgba(14,12,18,.6)';ctx.beginPath();ctx.arc(hx,hy,16,0,7);ctx.fill();ctx.strokeStyle='rgba(233,223,199,.25)';ctx.stroke();
   ctx.fillStyle='#e9dfc7';ctx.beginPath();ctx.moveTo(hx-8,hy);ctx.lineTo(hx,hy-8);ctx.lineTo(hx+8,hy);ctx.closePath();ctx.fill();ctx.fillRect(hx-6,hy,12,8);ctx.fillStyle='rgba(14,12,18,.9)';ctx.fillRect(hx-2,hy+3,4,5);ctx.restore()}
  // compteurs : vies, état de Raymond, paille ramassée, médaille
  ctx.save();
  const bx=W-74,by=14;let x=bx;
  ctx.font='17px '+F_DISP;ctx.textAlign='right';
  const nl=Math.max(0,S.run.lives),wr=Math.min(MAX_WEAR,S.run.wear||0);
  const ctw=ctx.measureText(`${G.corn}/${G.cornTotal}`).width;
  const panelW=12+(L.medal?30:0)+ctw+12+22+12+MAX_WEAR*13+24+14+(S.infinite?48:Math.max(1,nl)*17+(nl===0?70:0))+8;
  ctx.fillStyle='rgba(14,12,18,.6)';rr(ctx,bx-panelW,by,panelW,36,8);ctx.fill();
  ctx.strokeStyle='rgba(233,223,199,.15)';ctx.lineWidth=1;rr(ctx,bx-panelW+.5,by+.5,panelW-1,35,8);ctx.stroke();
  x-=12;
  if(L.medal){ctx.save();ctx.globalAlpha=G.medal?1:.28;drawMedal(ctx,x-8,by+22,0);ctx.restore();x-=30}
  ctx.fillStyle='#e9dfc7';const ct=`${G.corn}/${G.cornTotal}`;ctx.fillText(ct,x,by+24);x-=ctx.measureText(ct).width+12;drawTuft(ctx,x,by+18,0);x-=22;
  ctx.fillStyle='rgba(233,223,199,.25)';ctx.fillRect(x,by+8,1,20);x-=12;
  // état : 5 crans, les crans restants sont pleins ; le dernier clignote quand il ne reste rien
  for(let k=0;k<=MAX_WEAR;k++){const cx=x-6-(MAX_WEAR-k)*13,full=k>=wr;const warn=wr>=MAX_WEAR&&k===MAX_WEAR;
    ctx.fillStyle=full?(warn?'rgba(200,48,42,'+(.6+.4*Math.sin(G.t*8))+')':'#d9a441'):'rgba(233,223,199,.18)';
    rr(ctx,cx-5,by+12,10,13,3);ctx.fill()}
  x-=MAX_WEAR*13+24;
  ctx.fillStyle='rgba(233,223,199,.25)';ctx.fillRect(x,by+8,1,20);x-=14;
  // vies : têtes de pigeon
  if(S.infinite){ctx.fillStyle='#d9a441';ctx.font='22px '+F_DISP;ctx.fillText('∞',x,by+26);x-=26;lifeIcon(x,by+19)}
  else{for(let k=0;k<nl;k++)lifeIcon(x-6-k*17,by+19);if(nl===0){ctx.fillStyle='#c8302a';ctx.font='italic 13px '+F_BODY;ctx.fillText('dernière vie',x,by+23)}}
  ctx.restore();
  // panneau d'aide puis réplique
  let qy=64;
  G.hintA=lerp(G.hintA,G.hintI>=0?1:0,.15);
  if(G.hintA>.02&&(G.hintI>=0||G.lastHint!=null)){
    if(G.hintI>=0)G.lastHint=G.hintI;
    const h=L.def.hints[G.lastHint];if(h){
      ctx.save();ctx.globalAlpha=G.hintA;ctx.font='italic 18px '+F_BODY;const lines=wrap(ctx,h[1],440);
      const bh=50+lines.length*23,bx2=W/2-250,by2=64;
      ctx.fillStyle='rgba(0,0,0,.3)';rr(ctx,bx2+5,by2+6,500,bh,6);ctx.fill();
      ctx.fillStyle='#ece3cc';rr(ctx,bx2,by2,500,bh,6);ctx.fill();ctx.strokeStyle='rgba(42,36,32,.6)';ctx.lineWidth=1;rr(ctx,bx2+6.5,by2+6.5,487,bh-13,4);ctx.stroke();
      ctx.fillStyle='#2a2420';ctx.font='15px '+F_DISP;ctx.textAlign='left';ctx.fillText(h[0],bx2+26,by2+32);
      ctx.font='italic 18px '+F_BODY;lines.forEach((l,k)=>ctx.fillText(l,bx2+26,by2+58+k*23));
      ctx.restore();
    }
  }
  // une seule bulle à la fois : le cartel passe devant la réplique (qui attend)
  if(G.hintA<.05)drawQuip(qy);
}
function drawQuip(qy){
  const q=G.quip;if(!q||!q.text)return;
  const a=Math.min(1,q.t*4,(q.dur-q.t)*3);if(a<=0)return;
  ctx.save();ctx.globalAlpha=a;ctx.font='italic 20px '+F_BODY;
  const lines=wrap(ctx,q.text,600);const lw=Math.max(...lines.map(l=>ctx.measureText(l).width));
  const bw=lw+70,bh=26+lines.length*25,bx=W/2-bw/2,by=qy;
  ctx.fillStyle='rgba(0,0,0,.3)';rr(ctx,bx+5,by+6,bw,bh,6);ctx.fill();
  ctx.fillStyle='#e8dec5';rr(ctx,bx,by,bw,bh,6);ctx.fill();
  const who=q.who||'RAYMOND',wc={RAYMOND:'#a8322d','LA BUSE':'#7a5a2a','LE GARDIEN':'#2a3a5a'}[who]||'#4a4a4a';
  ctx.fillStyle=wc;ctx.fillRect(bx,by+10,4,bh-20);
  ctx.font='12px '+F_DISP;ctx.textAlign='left';ctx.fillText(who,bx+20,by+18);
  ctx.fillStyle='#2a2420';ctx.font='italic 20px '+F_BODY;lines.forEach((l,k)=>ctx.fillText(l,bx+35,by+40+k*25));
  ctx.restore();
}
/* grain + vignette précalculés : une seule image plein écran par frame */
const grainFrames=[];
function renderGrain(){
  if(!grainFrames.length)for(let k=0;k<4;k++){const c=mk(W,H),g=c.getContext('2d');const pat=g.createPattern(grainC,'repeat');g.save();g.globalAlpha=.16;g.translate(k*67,k*131);g.fillStyle=pat;g.fillRect(-256,-256,W+512,H+512);g.restore();g.drawImage(vignC,0,0);grainFrames.push(c)}
  ctx.drawImage(grainFrames[((Math.floor(G.t*12)%4)+4)%4]||grainFrames[0],0,0);
}
