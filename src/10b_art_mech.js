/* =========================================================
   DESSINS DES NOUVELLES MÉCANIQUES
   ========================================================= */
/* gardien de nuit du musée : casquette, moustache blanche, ventre, trousseau de clés */
function drawGuard(g,x,y,t,o){
  o=o||{};const f=o.f||1,walk=o.walk||0,ph=t*7;
  g.save();g.translate(x,y);g.scale(f,1);
  const st=Math.sin(ph)*walk;
  g.lineCap='round';g.lineJoin='round';
  // jambes
  for(const s of[-1,1]){const k=s*st;g.strokeStyle=s>0?'#1b2233':'#141a28';g.lineWidth=8;g.beginPath();g.moveTo(s*4,-30);g.lineTo(s*4+k*7,-14);g.lineTo(s*3+k*10,-3);g.stroke();
    g.fillStyle='#0d0e12';rr(g,s*3+k*10-6,-6,15,6,3);g.fill()}
  // manteau
  const cg=g.createLinearGradient(-14,-62,14,-24);cg.addColorStop(0,'#2e3a58');cg.addColorStop(1,'#1c2438');g.fillStyle=cg;
  g.beginPath();g.moveTo(-11,-60);g.quadraticCurveTo(-16,-40,-13,-24);g.lineTo(13,-24);g.quadraticCurveTo(18,-42,11,-60);g.closePath();g.fill();
  g.fillStyle='rgba(255,255,255,.08)';g.fillRect(4,-58,4,32);
  g.fillStyle='#c9a24a';for(const yy of[-52,-44,-36]){g.beginPath();g.arc(2,yy,1.5,0,7);g.fill()}
  g.fillStyle='#111';g.fillRect(-13,-31,26,4);g.fillStyle='#c9a24a';g.fillRect(-2,-31,4,4);
  // clés
  g.strokeStyle='#b8a46a';g.lineWidth=1.2;g.beginPath();g.arc(-12,-26,3,0,7);g.stroke();g.beginPath();g.moveTo(-12,-23);g.lineTo(-13,-18);g.moveTo(-11,-23);g.lineTo(-9,-18);g.stroke();
  // bras
  if(o.net){
    g.strokeStyle='#2e3a58';g.lineWidth=6;g.beginPath();g.moveTo(-6,-56);g.lineTo(6,-66);g.lineTo(14,-74);g.stroke();
    const sw=Math.sin(t*9)*.35;g.save();g.translate(14,-74);g.rotate(-.9+sw);
    g.strokeStyle='#8a6a3a';g.lineWidth=2.5;g.beginPath();g.moveTo(0,0);g.lineTo(0,-46);g.stroke();
    g.strokeStyle='#d8d0bc';g.lineWidth=1.5;g.beginPath();g.ellipse(0,-58,11,13,0,0,7);g.stroke();
    g.fillStyle='rgba(230,225,210,.35)';g.beginPath();g.ellipse(0,-58,11,13,0,0,7);g.fill();
    g.strokeStyle='rgba(230,225,210,.5)';g.lineWidth=.7;for(let k=-8;k<=8;k+=4){g.beginPath();g.moveTo(k,-70);g.lineTo(k*.6,-46);g.stroke()}
    g.restore();
  }else{
    g.strokeStyle='#2a3450';g.lineWidth=6;g.beginPath();g.moveTo(-8,-56);g.lineTo(-10-st*4,-40);g.lineTo(-8-st*4,-30);g.stroke();
    g.beginPath();g.moveTo(7,-56);g.lineTo(14,-44);g.lineTo(20,-44);g.stroke();
    g.fillStyle='#e0c8a8';g.beginPath();g.arc(-8-st*4,-29,3,0,7);g.fill();
    g.fillStyle='#3a3d44';rr(g,18,-48,14,7,2);g.fill();g.fillStyle='#fff3c0';g.fillRect(31,-47.5,2,6);
  }
  // tête
  g.save();g.translate(1,-68);g.rotate((o.look||0)*f);
  g.fillStyle='#e0c0a0';g.beginPath();g.ellipse(0,0,9,10,0,0,7);g.fill();
  g.fillStyle='#cfa68a';g.beginPath();g.ellipse(8,1,3,3.6,0,0,7);g.fill();
  g.fillStyle='#f0ece4';g.beginPath();g.moveTo(1,4);g.quadraticCurveTo(7,2,11,6);g.quadraticCurveTo(7,8,1,6);g.fill();
  g.fillStyle='#1a1a1a';g.beginPath();g.arc(5,-2,1.3,0,7);g.fill();
  g.strokeStyle='#d8d4cc';g.lineWidth=1.2;g.beginPath();g.moveTo(2,-5);g.lineTo(7,-6);g.stroke();
  // casquette
  g.fillStyle='#1c2438';g.beginPath();g.moveTo(-10,-5);g.quadraticCurveTo(-9,-15,1,-15);g.quadraticCurveTo(10,-15,10,-6);g.closePath();g.fill();
  g.fillStyle='#0f131d';g.beginPath();g.moveTo(4,-6);g.lineTo(15,-5);g.lineTo(13,-3);g.lineTo(3,-4);g.fill();
  g.fillStyle='#c9a24a';g.beginPath();g.arc(2,-10,2,0,7);g.fill();
  g.restore();
  g.restore();
}
/* faisceau de lampe torche, dans le monde */
function drawBeam(g,b,alert){
  g.save();const gr=g.createRadialGradient(b.ex,b.ey,4,b.ex,b.ey,b.len);
  gr.addColorStop(0,alert?'rgba(255,120,90,.42)':'rgba(255,240,180,.34)');gr.addColorStop(1,'rgba(255,240,180,0)');
  g.fillStyle=gr;g.beginPath();g.moveTo(b.ex,b.ey);g.arc(b.ex,b.ey,b.len,b.ang-b.half,b.ang+b.half);g.closePath();g.fill();g.restore();
}
/* chat assis aux yeux brillants (1, 2, 3, soleil) */
function drawWatchCat(g,w,t){
  const x=w.x,y=w.y;g.save();g.translate(x,y);
  g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(0,0,30,5,0,0,7);g.fill();
  const col='#1e1c22';g.fillStyle=col;
  g.beginPath();g.moveTo(-22,0);g.quadraticCurveTo(-26,-30,-10,-42);g.quadraticCurveTo(10,-46,18,-30);g.quadraticCurveTo(24,-12,20,0);g.closePath();g.fill();
  g.strokeStyle=col;g.lineWidth=6;g.lineCap='round';g.beginPath();g.moveTo(18,-4);g.quadraticCurveTo(36,-6+Math.sin(t*2)*3,34,-26+Math.sin(t*1.6)*4);g.stroke();
  g.beginPath();g.ellipse(0,-50,15,13,0,0,7);g.fill();
  const ear=w.state!=='closed'?-6:0;
  poly(g,[-14,-56,-10,-72+ear,-3,-60]);g.fill();poly(g,[14,-56,10,-72+ear,3,-60]);g.fill();
  g.fillStyle='#3a2a32';poly(g,[-12,-58,-10,-67+ear,-6,-60]);g.fill();poly(g,[12,-58,10,-67+ear,6,-60]);g.fill();
  // yeux
  for(const s of[-1,1]){const ex=s*6,ey=-51;
    if(w.open>0){const gl=g.createRadialGradient(ex,ey,0,ex,ey,12);gl.addColorStop(0,'rgba(200,255,120,'+(.55*w.open)+')');gl.addColorStop(1,'rgba(200,255,120,0)');g.fillStyle=gl;g.beginPath();g.arc(ex,ey,12,0,7);g.fill();
      g.fillStyle='#c8f060';g.beginPath();g.ellipse(ex,ey,4,3.2*w.open+.4,0,0,7);g.fill();g.fillStyle='#111';g.beginPath();g.ellipse(ex,ey,1,2.6*w.open+.2,0,0,7);g.fill()}
    else{g.strokeStyle='#5a5560';g.lineWidth=1.4;g.beginPath();g.moveTo(ex-4,ey);g.quadraticCurveTo(ex,ey+2.5,ex+4,ey);g.stroke()}}
  g.fillStyle='#d88a9a';poly(g,[-2,-45,2,-45,0,-43]);g.fill();
  g.strokeStyle='rgba(220,220,220,.4)';g.lineWidth=.7;for(const s of[-1,1])for(let k=0;k<3;k++){g.beginPath();g.moveTo(s*4,-44+k);g.lineTo(s*16,-46+k*3);g.stroke()}
  if(w.state==='closed'&&(t%2)<1.4){g.fillStyle='rgba(233,223,199,'+(.5-((t%2)/1.4)*.5)+')';g.font='italic 13px '+F_BODY;g.textAlign='left';g.fillText('Zzz',16,-64-((t%2)/1.4)*16)}
  g.restore();
}
/* balayeuse municipale */
function drawSweeper(g,K,t){
  const x=K.x,y=K.y,w=K.w,h=K.h,f=K.f||1;g.save();g.translate(x+w/2,y+h);g.scale(f,1);
  g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(0,0,w*.55,6,0,0,7);g.fill();
  g.fillStyle='#3c7a4a';rr(g,-w/2,-h+10,w*.62,h-22,8);g.fill();
  g.fillStyle='#4f9a5e';rr(g,w*.12-w/2+w*.5,-h+2,w*.38,h-14,8);g.fill();
  g.fillStyle='rgba(180,220,240,.7)';rr(g,w*.12,-h+8,w*.3,h*.32,4);g.fill();
  g.fillStyle='#e9e2d0';g.fillRect(-w/2+8,-h+20,w*.5,12);g.fillStyle='#2a5a36';g.font='bold 9px '+F_DISP;g.textAlign='center';g.fillText('PROPRETÉ',-w/2+8+w*.25,-h+29);
  g.fillStyle='#e0a030';g.beginPath();g.arc(w*.2,-h+2,5+Math.sin(t*10)*1,0,7);g.fill();
  for(const wx of[-w*.32,w*.3]){g.fillStyle='#111';g.beginPath();g.arc(wx,-9,9,0,7);g.fill();g.fillStyle='#777';g.beginPath();g.arc(wx,-9,3.5,0,7);g.fill()}
  // brosses rotatives
  g.save();g.translate(w*.5,-8);g.rotate(t*14);g.strokeStyle='#c9b070';g.lineWidth=2;for(let k=0;k<10;k++){g.rotate(Math.PI/5);g.beginPath();g.moveTo(0,0);g.lineTo(13,0);g.stroke()}g.restore();
  g.fillStyle='rgba(0,0,0,.25)';g.fillRect(w*.5-6,-16,16,4);
  g.restore();
}
/* plateformes mobiles supplémentaires */
function drawMechMover(g,m,t){
  if(m.kind==='tram'){
    const x=m.x,y=m.y,w=m.w;g.save();
    g.fillStyle='rgba(0,0,0,.3)';g.fillRect(x+6,y+86,w-12,6);
    const bg=g.createLinearGradient(0,y,0,y+80);bg.addColorStop(0,'#e8e2d4');bg.addColorStop(1,'#c4bcaa');g.fillStyle=bg;rr(g,x,y,w,80,12);g.fill();
    g.fillStyle='#8a2a3a';g.fillRect(x,y+56,w,10);g.fillStyle='#2a3a5a';g.fillRect(x+4,y+4,w-8,4);
    for(let k=0;k<6;k++){g.fillStyle='rgba(160,200,230,.65)';rr(g,x+12+k*(w-24)/6,y+16,(w-24)/6-8,26,4);g.fill();g.fillStyle='rgba(255,255,255,.25)';g.fillRect(x+14+k*(w-24)/6,y+18,4,22)}
    g.fillStyle='#2a2420';g.fillRect(x+w-30,y+14,18,40);
    for(const wx of[x+30,x+w-30]){g.fillStyle='#222';g.beginPath();g.arc(wx,y+84,8,0,7);g.fill()}
    g.strokeStyle='#555';g.lineWidth=2;g.beginPath();g.moveTo(x+w/2,y);g.lineTo(x+w/2+20,y-60);g.lineTo(x+w/2+40,y-60);g.stroke();
    g.fillStyle='#efe6d0';g.font='10px '+F_DISP;g.textAlign='center';g.fillText('LIGNE A · GARE',x+w/2,y+76);
    g.restore();return true}
  if(m.kind==='horse'){
    const x=m.x+m.w/2,y=m.y;g.save();
    g.strokeStyle='#d9a441';g.lineWidth=3;g.beginPath();g.moveTo(x,y-60);g.lineTo(x,y+60);g.stroke();
    g.fillStyle='#efe6d0';g.beginPath();g.ellipse(x,y+10,20,9,0,0,7);g.fill();
    g.beginPath();g.moveTo(x+12,y+6);g.quadraticCurveTo(x+22,y-12,x+18,y-16);g.lineTo(x+26,y-12);g.quadraticCurveTo(x+24,y+2,x+16,y+12);g.fill();
    g.fillStyle='#a8322d';g.beginPath();g.moveTo(x+14,y-12);g.lineTo(x+10,y-4);g.lineTo(x+14,y);g.fill();
    g.fillStyle='#3a6aa8';rr(g,x-10,y-1,18,8,3);g.fill();
    g.strokeStyle='#efe6d0';g.lineWidth=3;for(const s of[-1,1]){g.beginPath();g.moveTo(x+s*10,y+16);g.lineTo(x+s*14,y+28);g.stroke()}
    g.fillStyle='#111';g.beginPath();g.arc(x+21,y-12,1.2,0,7);g.fill();
    g.restore();return true}
  if(m.kind==='balloon'){
    const x=m.x+m.w/2,y=m.y;g.save();
    const col=['#c8302a','#3a6aa8','#e0b030','#5aa86a'][(m.c||0)%4];
    g.strokeStyle='rgba(220,220,220,.6)';g.lineWidth=1;g.beginPath();g.moveTo(x,y+30);g.quadraticCurveTo(x+6,y+60,x,y+90);g.stroke();
    const gr=g.createRadialGradient(x-6,y+6,2,x,y+12,24);gr.addColorStop(0,shade(col,.35));gr.addColorStop(1,col);g.fillStyle=gr;
    g.beginPath();g.ellipse(x,y+12,22,24,0,0,7);g.fill();g.fillStyle=col;poly(g,[x-3,y+35,x+3,y+35,x,y+30]);g.fill();
    g.restore();return true}
  if(m.kind==='bell'){
    g.save();g.translate(m.px,m.py);g.rotate(-m.theta);
    g.fillStyle='#3a2a1a';g.fillRect(-4,-6,8,14);
    const gr=g.createLinearGradient(-30,0,30,0);gr.addColorStop(0,'#6a4a1a');gr.addColorStop(.4,'#d4ad55');gr.addColorStop(1,'#5a3a14');g.fillStyle=gr;
    const L0=m.len;g.beginPath();g.moveTo(-14,L0-2);g.quadraticCurveTo(-18,L0+40,-36,L0+56);g.lineTo(36,L0+56);g.quadraticCurveTo(18,L0+40,14,L0-2);g.closePath();g.fill();
    g.fillStyle='#4a3010';g.fillRect(-38,L0+54,76,5);
    g.strokeStyle='#5a4628';g.lineWidth=3;g.beginPath();g.moveTo(0,0);g.lineTo(0,L0);g.stroke();
    g.fillStyle='#8a6a3a';rr(g,-31,L0-12,62,10,3);g.fill();g.fillStyle='rgba(255,230,190,.3)';g.fillRect(-31,L0-12,62,2);
    g.fillStyle='#3a2a10';g.beginPath();g.arc(0,L0+60,6,0,7);g.fill();
    g.restore();
    if(m.wave!=null&&m.wave<.38){const r=30+m.wave*170;g.strokeStyle='rgba(233,200,120,'+(1-m.wave/.38)+')';g.lineWidth=3;g.beginPath();g.arc(m.wx,m.wy,r,0,7);g.stroke()}
    return true}
  return false;
}
/* éléments dessinés derrière les personnages */
function drawMechBack(t){
  const vis=x=>x>cam.x-160&&x<cam.x+W+160;
  // sol qui s'effondre
  for(const k of L.crumbles){if(k.state==='gone'||!vis(k.c*T))continue;const x=k.c*T+(k.state==='shake'?Math.sin(t*70)*2:0),y=k.r*T;
    g0crumble(ctx,x,y,k.state==='shake'?k.t:0)}
  // volets
  for(const s of L.shutters){const x=s.c*T,y=s.r*T;if(!vis(x))continue;const open=shutterOpen(s.c),soon=shutterSoon(s.c);
    ctx.save();if(open){ctx.fillStyle=soon?'#4f6a5a':'#3a6a5a';rr(ctx,x,y,T,10,2);ctx.fill();ctx.fillStyle='rgba(255,255,255,.18)';ctx.fillRect(x,y,T,2);ctx.fillStyle='rgba(0,0,0,.3)';for(let k=6;k<T;k+=8)ctx.fillRect(x+k,y+2,1.5,7);
      ctx.fillStyle='#222';ctx.fillRect(x-3,y+2,4,4);if(soon){ctx.translate(x+T/2,y+5);ctx.rotate(Math.sin(t*40)*.03);ctx.translate(-x-T/2,-y-5)}}
    else{ctx.fillStyle='#2e5a4a';rr(ctx,x-2,y-30,8,40,2);ctx.fill();ctx.fillStyle='rgba(0,0,0,.25)';for(let k=0;k<5;k++)ctx.fillRect(x-1,y-26+k*8,6,1.5)}
    ctx.restore()}
  // braséros
  for(const f of L.fires){if(!vis(f.x))continue;drawFire(ctx,f.x,f.y,t)}
  // gardiens
  for(const gd of L.guards){if(!vis(gd.x))continue;if(gd.tangle>0)drawGuardTangled(ctx,gd,t);else drawGuard(ctx,gd.x+gd.w/2,gd.y+gd.h,t,{f:gd.dir,walk:gd.pause>0?0:1,look:gd.look})}
  // chats qui guettent (ou qui courent)
  for(const w of L.watchers){if(w.mode!=='sit'&&w.k){if(vis(w.k.x))drawWatchCatRun(ctx,w,t)}else if(vis(w.x))drawWatchCat(ctx,w,t)}
  // portillons, poignées, cachettes
  for(const gt of L.gates)if(vis(gt.c*T))drawGate(ctx,gt,t);
  for(const a of L.acts){if(!vis(a.x)||a.style==='backdoor')continue;if(a.kind==='lever')drawLever(ctx,a,t);else drawSecretProp(ctx,a,t)}
  // gargouilles
  for(const o of L.gargoyles){if(!vis(o.x))continue;drawGargoyle(ctx,o,t)}
}
function g0crumble(g,x,y,sh){
  g.save();g.fillStyle='#5a4632';rr(g,x+1,y+1,T-2,T-2,5);g.fill();g.fillStyle='#6f8a4a';rr(g,x+1,y,T-2,7,4);g.fill();
  g.strokeStyle='rgba(20,12,6,'+(.45+sh)+')';g.lineWidth=1.4;g.beginPath();g.moveTo(x+8,y+8);g.lineTo(x+16,y+20);g.lineTo(x+12,y+32);g.moveTo(x+16,y+20);g.lineTo(x+28,y+24);g.lineTo(x+32,y+36);g.stroke();
  g.fillStyle='rgba(0,0,0,.18)';g.fillRect(x+1,y+T-6,T-2,5);g.restore();
}
function drawFire(g,x,y,t){
  g.save();g.fillStyle='#2a2420';rr(g,x-16,y-30,32,30,4);g.fill();g.fillStyle='#4a3a30';g.fillRect(x-18,y-32,36,5);
  for(let k=0;k<5;k++){const fx=x-10+k*5,h=24+Math.sin(t*12+k*1.7)*8;const gr=g.createLinearGradient(0,y-32-h,0,y-30);gr.addColorStop(0,'rgba(255,230,120,0)');gr.addColorStop(.4,'#ffb040');gr.addColorStop(1,'#e0401a');g.fillStyle=gr;g.beginPath();g.moveTo(fx-5,y-30);g.quadraticCurveTo(fx-4,y-32-h*.5,fx+Math.sin(t*9+k)*3,y-32-h);g.quadraticCurveTo(fx+4,y-32-h*.5,fx+5,y-30);g.fill()}
  g.restore();
}
function drawGargoyle(g,o,t){
  g.save();g.translate(o.x,o.y);g.scale(o.dir,1);
  g.fillStyle='#6a6670';g.beginPath();g.moveTo(-16,-12);g.lineTo(6,-14);g.lineTo(18,-6);g.lineTo(22,0);g.lineTo(16,6);g.lineTo(-16,10);g.closePath();g.fill();
  g.fillStyle='#4a4650';poly(g,[-4,-14,0,-24,4,-14]);g.fill();g.fillStyle='#1a1820';g.beginPath();g.arc(8,-6,2,0,7);g.fill();
  g.fillStyle='#2a2830';poly(g,[14,2,22,1,16,5]);g.fill();
  if(o.state==='warn'){const d=((G.lt*3)%1);g.fillStyle='rgba(150,200,255,.8)';g.beginPath();g.arc(20,4+d*16,2.2,0,7);g.fill()}
  g.restore();
}
/* éléments dessinés devant les personnages */
function drawMechFront(t){
  const vis=x=>x>cam.x-300&&x<cam.x+W+300;
  // faisceaux des gardiens
  for(const gd of L.guards)if(vis(gd.x)&&!(gd.tangle>0))drawBeam(ctx,guardBeam(gd),gd.sees);
  if(L.chaser&&L.chaser.type==='guardnet'&&L.chaser.state!=='sleep'){const K=L.chaser;drawBeam(ctx,{ex:K.x+K.w/2+K.f*14,ey:K.y+20,ang:K.f>0?0:Math.PI,len:200,half:.3},false)}
  // cachettes : draps sur les meubles
  for(const c of L.covers){if(!vis(c.x))continue;const hid=!P.dead&&hiddenNow()&&P.x+P.w/2>c.x&&P.x+P.w/2<c.x+c.w;
    ctx.save();ctx.globalAlpha=hid?.82:1;
    const gr=ctx.createLinearGradient(c.x,c.y,c.x+c.w,c.y+c.h);gr.addColorStop(0,'#d8d2c2');gr.addColorStop(1,'#a8a090');ctx.fillStyle=gr;
    ctx.beginPath();ctx.moveTo(c.x+4,c.y+c.h);ctx.quadraticCurveTo(c.x-2,c.y+c.h*.4,c.x+10,c.y+8);ctx.quadraticCurveTo(c.x+c.w/2,c.y-6,c.x+c.w-10,c.y+8);ctx.quadraticCurveTo(c.x+c.w+2,c.y+c.h*.4,c.x+c.w-4,c.y+c.h);
    for(let k=6;k>=0;k--)ctx.lineTo(c.x+4+k*(c.w-8)/6,c.y+c.h-((k%2)?5:0));ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,.12)';ctx.lineWidth=1.5;for(let k=1;k<4;k++){ctx.beginPath();ctx.moveTo(c.x+k*c.w/4,c.y+12);ctx.quadraticCurveTo(c.x+k*c.w/4+4,c.y+c.h*.6,c.x+k*c.w/4-2,c.y+c.h-4);ctx.stroke()}
    ctx.restore()}
  // jets des gargouilles
  for(const o of L.gargoyles){if(o.state!=='jet'||!vis(o.x))continue;const x0=o.x+o.dir*20;ctx.save();ctx.strokeStyle='rgba(160,205,255,.75)';ctx.lineWidth=7;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x0,o.y+4);ctx.quadraticCurveTo(x0+o.dir*o.len*.6,o.y+2,x0+o.dir*o.len,o.y+8+o.len*.05);ctx.stroke();ctx.strokeStyle='rgba(235,245,255,.6)';ctx.lineWidth=2;ctx.stroke();ctx.restore()}
  // étourdi
  if(P.stun>0&&!P.dead){for(let k=0;k<3;k++){const a=t*6+k*2.1;ctx.fillStyle='#ffe080';ctx.beginPath();ctx.arc(P.x+P.w/2+Math.cos(a)*14,P.y-6+Math.sin(a)*4,2.4,0,7);ctx.fill()}}
  // brouillard : il cache le terrain au loin ; les coquelicots restent visibles
  if(L.def.fog){const fx=P.x+P.w/2;ctx.save();
    const gr=ctx.createLinearGradient(fx+120,0,fx+430,0);gr.addColorStop(0,'rgba(196,192,186,0)');gr.addColorStop(1,'rgba(196,192,186,.96)');ctx.fillStyle=gr;ctx.fillRect(fx+120,cam.y-50,1400,H+100);
    const gl=ctx.createLinearGradient(fx-200,0,fx-520,0);gl.addColorStop(0,'rgba(196,192,186,0)');gl.addColorStop(1,'rgba(196,192,186,.85)');ctx.fillStyle=gl;ctx.fillRect(fx-1600,cam.y-50,1400,H+100);
    ctx.restore();
    for(const p of L.poppies){if(!vis(p.x))continue;for(let k=-1;k<=1;k++){const px=p.x+k*11,py=p.y-6-Math.abs(k)*3+Math.sin(t*2+p.x+k)*1;ctx.strokeStyle='#3a5a30';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(px,p.y);ctx.lineTo(px,py);ctx.stroke();ctx.fillStyle='#d8302a';ctx.beginPath();ctx.arc(px,py-2,4,0,7);ctx.fill();ctx.fillStyle='#2a1a1a';ctx.beginPath();ctx.arc(px,py-2,1.2,0,7);ctx.fill()}}}
  // rafales : traînées de vent (rares pendant l'alerte, denses pendant la rafale)
  if(L.def.gust&&L.gust.state!=='calm'){const blow=L.gust.state==='blow',n=blow?34:10,dir=L.def.gust.dir||-1;ctx.save();
    for(let k=0;k<n;k++){const sp=blow?900:420,len=blow?60+(k%5)*14:30;const xx=cam.x+(((dir<0?-1:1)*G.lt*sp+k*137)%(W+200)+W+200)%(W+200)-100,yy=cam.y+20+((k*71)%(H-60));
      ctx.strokeStyle='rgba(235,240,250,'+(blow?.42:.22)+')';ctx.lineWidth=blow?1.6:1;ctx.beginPath();ctx.moveTo(xx,yy);ctx.quadraticCurveTo(xx-dir*len*.5,yy-3,xx-dir*len,yy+1);ctx.stroke()}
    ctx.restore()}
  // front d'orage (défilement forcé)
  if(L.auto&&L.auto.on){const x=L.auto.x;ctx.save();
    const gr=ctx.createLinearGradient(x-40,0,x+150,0);gr.addColorStop(0,'rgba(8,10,18,.97)');gr.addColorStop(1,'rgba(8,10,18,0)');ctx.fillStyle=gr;ctx.fillRect(x-200,cam.y-50,350,H+100);
    for(let k=0;k<14;k++){const yy=cam.y+((k*61+t*900)%(H+40))-20;ctx.strokeStyle='rgba(170,190,230,.35)';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x+30+(k*23)%90,yy);ctx.lineTo(x+22+(k*23)%90,yy+18);ctx.stroke()}
    if((G.lt%1.7)<.12){ctx.strokeStyle='rgba(235,240,255,.9)';ctx.lineWidth=3;ctx.beginPath();let lx=x+40,ly=cam.y;ctx.moveTo(lx,ly);while(ly<cam.y+H){ly+=26;lx+=Math.sin(ly*.2+G.lt*40)*16;ctx.lineTo(lx,ly)}ctx.stroke()}
    ctx.restore()}
}
/* maison Vasseur : la maison est là, le pigeonnier a laissé place à un garage */
function drawHouse(g,e,t){
  const x=e.x+6,gy=e.y+2*T;g.save();
  g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(x+40,gy+2,190,10,0,0,7);g.fill();
  // maison
  const wx=x-150,ww=200,wh=150;
  g.fillStyle='#cdb894';g.fillRect(wx,gy-wh,ww,wh);
  g.fillStyle='rgba(0,0,0,.08)';for(let k=0;k<12;k++)g.fillRect(wx,gy-wh+k*13,ww,1);
  g.fillStyle='#7a3a2a';g.beginPath();g.moveTo(wx-14,gy-wh);g.lineTo(wx+ww/2,gy-wh-70);g.lineTo(wx+ww+14,gy-wh);g.closePath();g.fill();
  g.fillStyle='rgba(0,0,0,.18)';for(let k=0;k<6;k++){g.beginPath();g.moveTo(wx-10+k*4,gy-wh-k*11);g.lineTo(wx+ww+10-k*4,gy-wh-k*11);g.lineWidth=1;g.strokeStyle='rgba(0,0,0,.2)';g.stroke()}
  g.fillStyle='#5a4a3a';g.fillRect(wx+ww-50,gy-wh-60,16,30);
  for(const[ox,oy]of[[24,-120],[130,-120],[24,-60]]){g.fillStyle='rgba(255,210,140,.75)';g.fillRect(wx+ox,gy+oy,36,40);g.fillStyle='#3a6a5a';g.fillRect(wx+ox-12,gy+oy,10,40);g.fillRect(wx+ox+38,gy+oy,10,40);g.fillStyle='#4a3a2a';g.fillRect(wx+ox+16,gy+oy,3,40);g.fillRect(wx+ox,gy+oy+18,36,3)}
  g.fillStyle='#5a3a24';rr(g,wx+128,gy-70,40,70,4);g.fill();g.fillStyle='#c9a24a';g.beginPath();g.arc(wx+160,gy-36,2.5,0,7);g.fill();
  g.fillStyle='#efe6d0';g.fillRect(wx+70,gy-24,40,12);g.fillStyle='#2a2420';g.font='8px '+F_DISP;g.textAlign='center';g.fillText('VASSEUR',wx+90,gy-15);
  // garage à la place du pigeonnier
  const gx=x+56;g.fillStyle='#b4aca0';g.fillRect(gx,gy-90,120,90);g.fillStyle='#8a8478';g.fillRect(gx-6,gy-96,132,8);
  g.fillStyle='#9aa0a8';g.fillRect(gx+12,gy-72,96,72);g.fillStyle='rgba(0,0,0,.18)';for(let k=0;k<8;k++)g.fillRect(gx+12,gy-70+k*9,96,2);
  g.fillStyle='#efe6d0';rr(g,gx+20,gy-88,80,12,2);g.fill();g.fillStyle='#a8322d';g.font='8px '+F_DISP;g.fillText('GARAGE · DÉFENSE DE STATIONNER',gx+60,gy-79);
  g.restore();
}
