/* =========================================================
   DESSINS : cachettes, poignée, portillon, invite « E »,
   gardien endormi sur sa chaise, gardien emmêlé dans le drap
   ========================================================= */
function drawSecretProp(g,a,t){
  const x=a.x,y=a.y,o=a.open||0,st=a.style;
  g.save();g.translate(x,y);g.scale(1.25,1.25);g.lineJoin='round';
  g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(0,0,22,4,0,0,7);g.fill();
  const inner=()=>{g.fillStyle='#16110c'};
  if(st==='drawer'||st==='case'){
    // petit meuble de musée à tiroir (ou vitrine à papillons fermée à clef)
    g.fillStyle='#5a3a22';rr(g,-20,-40,40,40,4);g.fill();g.fillStyle='#6e4a2c';rr(g,-20,-40,40,6,3);g.fill();
    g.fillStyle='#3a2414';g.fillRect(-18,-4,4,4);g.fillRect(14,-4,4,4);
    if(st==='case'){g.fillStyle='rgba(190,215,225,.28)';rr(g,-16,-34,32,16,2);g.fill();g.strokeStyle='#c9a24a';g.lineWidth=1.2;rr(g,-16,-34,32,16,2);g.stroke();
      for(const bx of[-8,5]){g.fillStyle=bx<0?'#c45a2a':'#3a6aa8';g.beginPath();g.ellipse(bx-3,-26,3.5,2.5,-.4,0,7);g.ellipse(bx+3,-26,3.5,2.5,.4,0,7);g.fill()}
      if(a.locked&&!a.used){g.fillStyle='#c9a24a';rr(g,-3,-17,6,6,1.5);g.fill();g.strokeStyle='#c9a24a';g.beginPath();g.arc(0,-17,2.2,Math.PI,0);g.stroke()}}
    const dx=o*14;inner();g.fillRect(-15,-16,30,12);
    g.fillStyle='#8a6038';rr(g,-16+dx,-16,32,12,2);g.fill();g.fillStyle='#c9a24a';g.beginPath();g.arc(dx,-10,2,0,7);g.fill();
  }else if(st==='mailbox'||st==='postbox'){
    const col=st==='postbox'?'#d8b02a':'#6a4a2c',dk=st==='postbox'?'#a8841a':'#4a3220';
    g.fillStyle='#3a3430';g.fillRect(-2,-24,4,24);
    g.fillStyle=col;rr(g,-15,-50,30,28,5);g.fill();g.fillStyle=dk;g.fillRect(-15,-28,30,6);
    g.fillStyle='#1a1410';rr(g,-9,-44,18,3,1.5);g.fill();
    if(st==='postbox'){g.fillStyle='#2a3a6a';g.font='bold 6px '+F_DISP;g.textAlign='center';g.fillText('POSTES',0,-33)}
    // portillon de levée qui bascule
    g.save();g.translate(-15,-24);g.rotate(-o*1.3);g.fillStyle=dk;rr(g,0,-2,30,8,2);g.fill();g.restore();
    if(o>0){inner();g.fillRect(-13,-24,26,4*o)}
  }else if(st==='crate'||st==='chest'){
    const wood=st==='chest'?'#6a4426':'#5e5a3a',band=st==='chest'?'#c9a24a':'#3a3a2a';
    inner();g.fillRect(-18,-30,36,4);
    g.fillStyle=wood;rr(g,-19,-28,38,28,3);g.fill();g.fillStyle='rgba(0,0,0,.18)';for(let k=-12;k<18;k+=9)g.fillRect(-19,k-14,38,1.2);
    g.fillStyle=band;g.fillRect(-12,-28,3,28);g.fillRect(9,-28,3,28);
    if(st==='crate'){g.fillStyle='rgba(233,223,199,.55)';g.font='6px '+F_DISP;g.textAlign='center';g.fillText('MUNITIONS',0,-12)}
    g.save();g.translate(-19,-28);g.rotate(-o*1.1);g.fillStyle=shade(wood,.12);rr(g,0,-8,38,9,3);g.fill();g.fillStyle=band;g.fillRect(7,-8,3,9);g.fillRect(28,-8,3,9);g.restore();
  }else if(st==='locker'){
    g.fillStyle='#4a5a6a';rr(g,-16,-56,32,56,3);g.fill();g.fillStyle='rgba(0,0,0,.25)';for(let k=0;k<3;k++)g.fillRect(-10,-50+k*4,20,1.5);
    g.fillStyle='#d8d0b8';g.font='7px '+F_DISP;g.textAlign='center';g.fillText('CONSIGNE',0,-30);
    inner();if(o>0)g.fillRect(-14,-54,28,52);
    g.save();g.translate(-16,0);g.scale(1-o*.85,1);g.fillStyle='#55677a';rr(g,0,-56,32,56,3);g.fill();g.fillStyle='#c9a24a';g.fillRect(25,-30,3,6);g.restore();
  }else if(st==='bin'){
    g.fillStyle='#3a4a3a';g.beginPath();g.moveTo(-14,-34);g.lineTo(14,-34);g.lineTo(11,0);g.lineTo(-11,0);g.closePath();g.fill();
    g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=1.2;for(let k=-8;k<=8;k+=5){g.beginPath();g.moveTo(k,-32);g.lineTo(k*.8,-2);g.stroke()}
    g.save();g.translate(-15,-34);g.rotate(-o*1.2);g.fillStyle='#4a5a4a';rr(g,0,-4,30,5,2);g.fill();g.restore();
  }else if(st==='phone'){
    // borne d'appel d'urgence
    g.fillStyle='#d8702a';rr(g,-11,-62,22,62,4);g.fill();g.fillStyle='#e9dfc7';rr(g,-8,-56,16,12,2);g.fill();
    g.fillStyle='#2a2a2a';g.font='bold 6px '+F_DISP;g.textAlign='center';g.fillText('SOS',0,-47);
    g.fillStyle='#222';g.beginPath();g.arc(0,-34,4,0,7);g.fill();
    g.save();g.translate(-11,-26);g.scale(1-o*.8,1);g.fillStyle='#e08a3a';rr(g,0,-6,22,24,3);g.fill();g.restore();
  }else if(st==='vase'){
    g.fillStyle='#6a6a62';rr(g,-12,-6,24,6,2);g.fill();
    g.save();g.translate(0,-o*14);g.rotate(o*.35);
    g.fillStyle='#8a8a7e';g.beginPath();g.moveTo(-9,-6);g.quadraticCurveTo(-12,-22,-6,-28);g.lineTo(6,-28);g.quadraticCurveTo(12,-22,9,-6);g.closePath();g.fill();
    g.strokeStyle='#4a6a3a';g.lineWidth=1.4;for(const k of[-3,0,3]){g.beginPath();g.moveTo(k,-28);g.quadraticCurveTo(k*2,-38,k*3,-44);g.stroke()}
    for(const[k,c]of[[-9,'#c84a4a'],[0,'#e9dfc7'],[9,'#d8b04a']]){g.fillStyle=c;g.beginPath();g.arc(k,-44,3,0,7);g.fill()}
    g.restore();
  }
  g.restore();
}
/* poignée murale du portillon */
function drawLever(g,a,t){
  g.save();g.translate(a.x,a.y);g.scale(1.4,1.4);g.translate(0,12);
  g.fillStyle='#3a2a1c';rr(g,-8,-58,16,24,3);g.fill();g.fillStyle='#c9a24a';g.beginPath();g.arc(0,-46,2.5,0,7);g.fill();
  g.save();g.translate(0,-46);g.rotate(-.7+a.open*1.4);g.strokeStyle='#8a8a90';g.lineWidth=3;g.lineCap='round';g.beginPath();g.moveTo(0,0);g.lineTo(0,-18);g.stroke();
  g.fillStyle='#a8322d';g.beginPath();g.arc(0,-19,4,0,7);g.fill();g.restore();
  g.restore();
}
/* portillon de bois à barreaux : il remonte quand on tire la poignée */
function drawGate(g,gt,t){
  const x=gt.c*T,y0=gt.r0*T,h=(gt.r1-gt.r0+1)*T,lift=gt.open*h*.92;
  g.save();g.beginPath();g.rect(x-6,y0-4,T+12,h+4);g.clip();
  g.translate(0,-lift);
  g.fillStyle='#4a3020';rr(g,x+4,y0,T-8,h,3);g.fill();
  g.fillStyle='#6a4a2c';for(let k=0;k<3;k++)rr(g,x+8+k*10,y0+4,6,h-8,2),g.fill();
  g.fillStyle='#3a2416';g.fillRect(x+4,y0+12,T-8,5);g.fillRect(x+4,y0+h-18,T-8,5);
  g.fillStyle='#8a8a90';for(const yy of[y0+14,y0+h-16])for(const xx of[x+8,x+T-10]){g.beginPath();g.arc(xx,yy,1.6,0,7);g.fill()}
  g.restore();
  g.fillStyle='#2a1c12';g.fillRect(x-2,y0-6,T+4,6);
}
/* invite « E » au-dessus de ce qu'on peut attraper */
function drawActPrompt(t){
  if(P.dead||G.cut||G.tombSeq)return;
  const n=nearAct();if(!n)return;
  let x,y;if(n.type==='tangle'){x=P.x+P.w/2;y=P.y-30}else if(n.type==='secret'){return}else{x=n.o.x;y=n.o.y-74}
  const b=Math.sin(t*5)*2;
  ctx.save();ctx.translate(x,y+b);
  ctx.fillStyle='rgba(0,0,0,.35)';rr(ctx,-11,-9,24,24,5);ctx.fill();
  ctx.fillStyle='#ece3cc';rr(ctx,-12,-12,24,24,5);ctx.fill();ctx.strokeStyle='#2a2420';ctx.lineWidth=1.2;rr(ctx,-12,-12,24,24,5);ctx.stroke();
  ctx.fillStyle='#2a2420';ctx.font='16px '+F_DISP;ctx.textAlign='center';ctx.fillText('E',0,6);
  ctx.restore();
}
/* gardien endormi sur sa chaise (le gardien au filet, avant la poursuite) */
function drawGuardAsleep(g,x,y,t){
  g.save();g.translate(x,y);
  // chaise
  g.fillStyle='#4a2e1c';g.fillRect(-16,-28,32,5);g.fillRect(-15,-23,4,23);g.fillRect(11,-23,4,23);g.fillRect(-16,-62,5,36);
  g.fillStyle='#5a3a24';rr(g,-17,-64,7,30,2);g.fill();
  // le gardien assis, la tête penchée
  g.lineCap='round';g.strokeStyle='#1b2233';g.lineWidth=8;
  for(const s of[0,6]){g.beginPath();g.moveTo(-6+s,-30);g.lineTo(10+s,-30);g.lineTo(12+s,-6);g.stroke();g.fillStyle='#0d0e12';rr(g,8+s,-6,15,6,3);g.fill()}
  const cg=g.createLinearGradient(-14,-66,14,-28);cg.addColorStop(0,'#2e3a58');cg.addColorStop(1,'#1c2438');g.fillStyle=cg;
  g.beginPath();g.moveTo(-10,-66);g.quadraticCurveTo(-15,-46,-12,-28);g.lineTo(12,-28);g.quadraticCurveTo(16,-48,9,-66);g.closePath();g.fill();
  g.fillStyle='#c9a24a';for(const yy of[-58,-50,-42]){g.beginPath();g.arc(2,yy,1.5,0,7);g.fill()}
  // bras croisés sur le ventre
  g.strokeStyle='#2a3450';g.lineWidth=6;g.beginPath();g.moveTo(-8,-60);g.lineTo(-4,-44);g.lineTo(8,-44);g.stroke();
  // le filet posé contre la chaise
  g.save();g.translate(22,0);g.rotate(-.18);g.strokeStyle='#8a6a3a';g.lineWidth=2.5;g.beginPath();g.moveTo(0,0);g.lineTo(0,-60);g.stroke();
  g.strokeStyle='#d8d0bc';g.lineWidth=1.4;g.beginPath();g.ellipse(0,-72,10,12,0,0,7);g.stroke();g.restore();
  const nod=Math.sin(t*1.6)*.06;
  g.save();g.translate(1,-74);g.rotate(.45+nod);
  g.fillStyle='#e0c0a0';g.beginPath();g.ellipse(0,0,9,10,0,0,7);g.fill();
  g.fillStyle='#f0ece4';g.beginPath();g.moveTo(1,4);g.quadraticCurveTo(7,2,11,6);g.quadraticCurveTo(7,8,1,6);g.fill();
  g.strokeStyle='#1a1a1a';g.lineWidth=1.2;g.beginPath();g.moveTo(3,-2);g.quadraticCurveTo(5,-.5,7,-2);g.stroke();
  g.fillStyle='#1c2438';g.beginPath();g.moveTo(-10,-5);g.quadraticCurveTo(-9,-15,1,-15);g.quadraticCurveTo(10,-15,10,-6);g.closePath();g.fill();
  g.fillStyle='#0f131d';g.beginPath();g.moveTo(4,-6);g.lineTo(15,-5);g.lineTo(13,-3);g.lineTo(3,-4);g.fill();
  g.restore();
  const zt=t%2.4;if(zt<1.8){g.fillStyle='rgba(233,223,199,'+(.55-zt/1.8*.55)+')';g.font='italic 13px '+F_BODY;g.textAlign='left';g.fillText('Zzz',16,-92-zt*10)}
  g.restore();
}
/* gardien emmêlé dans le drap */
function drawGuardTangled(g,gd,t){
  const x=gd.x+gd.w/2,y=gd.y+gd.h,w=Math.sin(t*9)*3;
  g.save();g.translate(x,y);
  g.strokeStyle='#1b2233';g.lineWidth=8;g.lineCap='round';
  for(const s of[-1,1]){g.beginPath();g.moveTo(s*4,-28);g.lineTo(s*5+Math.sin(t*10+s)*4,-3);g.stroke();g.fillStyle='#0d0e12';rr(g,s*5-6,-6,14,6,3);g.fill()}
  g.fillStyle='#e6e0d2';g.beginPath();g.moveTo(-18+w,-24);g.quadraticCurveTo(-22,-60,-4,-82+w);g.quadraticCurveTo(12,-86,18,-64);g.quadraticCurveTo(24,-40,18-w,-22);
  for(let k=0;k<5;k++)g.lineTo(18-w-k*9,-22-(k%2?5:0));g.closePath();g.fill();
  g.strokeStyle='rgba(120,110,100,.35)';g.lineWidth=1.2;g.beginPath();g.moveTo(-8,-70);g.quadraticCurveTo(-4,-46,-10,-26);g.moveTo(6,-74);g.quadraticCurveTo(10,-50,6,-28);g.stroke();
  // les bras qui s'agitent sous le drap
  for(const sd of[-1,1]){const a=t*12+sd*1.7,bx=sd*(16+Math.sin(a)*5),by=-56+Math.cos(a)*10;g.fillStyle='#ece6d8';g.beginPath();g.ellipse(bx,by,8,6,a*.3,0,7);g.fill()}
  // la lampe allumée sous le drap
  const lg=g.createRadialGradient(6,-48,1,6,-48,16);lg.addColorStop(0,'rgba(255,240,180,.55)');lg.addColorStop(1,'rgba(255,240,180,0)');g.fillStyle=lg;g.beginPath();g.arc(6,-48,16,0,7);g.fill();
  g.restore();
}
/* le chat qui guettait, maintenant lancé à la poursuite */
function drawWatchCatRun(g,w,t){const k=w.k;drawCat(g,k.x+k.w/2,k.y+k.h,k.f||1,t,w.mode==='chase'?1.5:1,{size:1.3,col:'#1e1c22',rim:'#3a3842',eye:'#c8f060',mouth:w.mode==='chase'})}

/* grande armoire de loge : son dessus sert de perchoir */
function drawWardrobe(g,d){
  const x=d.x,y=d.y,w=d.w,h=d.floor-d.y;g.save();
  g.fillStyle='rgba(0,0,0,.3)';g.fillRect(x+8,y+10,w,h-10);
  const gr=g.createLinearGradient(x,0,x+w,0);gr.addColorStop(0,'#4a2e1a');gr.addColorStop(1,'#6a4428');g.fillStyle=gr;rr(g,x,y+4,w,h-4,3);g.fill();
  g.fillStyle='#7a5232';rr(g,x-4,y,w+8,8,2);g.fill();
  g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=1.5;g.strokeRect(x+5,y+14,w/2-8,h-30);g.strokeRect(x+w/2+3,y+14,w/2-8,h-30);
  g.fillStyle='#c9a24a';g.beginPath();g.arc(x+w/2-6,y+h/2,2,0,7);g.arc(x+w/2+6,y+h/2,2,0,7);g.fill();
  g.fillStyle='#3a2414';g.fillRect(x+4,d.floor-10,6,10);g.fillRect(x+w-10,d.floor-10,6,10);
  g.restore();
}
/* sous les draps : cinq meubles de réserve, tous un peu farfelus (même silhouette que le drap) */
function drawCoverFurniture(g,c,t){
  const k=c.kind%5,x=c.x+c.w/2,y=c.y+c.h;g.save();g.translate(x,y);
  if(k===0){// buste au regard qui louche, sur sa colonne
    g.fillStyle='#b8b0a0';g.fillRect(-12,-40,24,40);g.fillStyle='#cfc8b8';g.fillRect(-16,-44,32,6);
    g.beginPath();g.ellipse(0,-58,16,12,0,0,7);g.fill();g.beginPath();g.ellipse(0,-74,11,13,0,0,7);g.fill();
    g.fillStyle='#3a3530';for(const s of[-1,1]){g.beginPath();g.arc(s*4,-76,2.4,0,7);g.fill()}g.fillStyle='#fff';g.beginPath();g.arc(-3,-76,1,0,7);g.arc(3,-76,1,0,7);g.fill();
    g.fillStyle='#a8a090';g.beginPath();g.ellipse(1,-70,3,6,0,0,7);g.fill();g.strokeStyle='#3a3530';g.lineWidth=1.2;g.beginPath();g.moveTo(-5,-64);g.quadraticCurveTo(0,-61,5,-65);g.stroke();
  }else if(k===1){// statue de jardin, nue, une feuille de vigne très mal placée
    g.fillStyle='#c8c2b2';g.fillRect(-14,-10,28,10);
    g.beginPath();g.ellipse(0,-70,7,8,0,0,7);g.fill();g.fillRect(-9,-62,18,28);g.fillRect(-8,-34,7,24);g.fillRect(1,-34,7,24);
    g.strokeStyle='#c8c2b2';g.lineWidth=5;g.lineCap='round';g.beginPath();g.moveTo(-9,-58);g.lineTo(-14,-42);g.moveTo(9,-58);g.quadraticCurveTo(18,-66,14,-76);g.stroke();
    g.fillStyle='#5a7a3a';g.beginPath();g.moveTo(8,-30);g.quadraticCurveTo(14,-36,12,-26);g.quadraticCurveTo(16,-22,10,-22);g.closePath();g.fill();
    g.fillStyle='#6a6458';g.font='italic 7px '+F_BODY;g.textAlign='center';g.fillText('« Pudeur »',0,-2);
  }else if(k===2){// ours empaillé debout, en caleçon rayé
    g.fillStyle='#4a3020';g.beginPath();g.ellipse(0,-40,17,28,0,0,7);g.fill();g.beginPath();g.arc(0,-74,11,0,7);g.fill();g.beginPath();g.arc(-9,-83,4,0,7);g.arc(9,-83,4,0,7);g.fill();
    g.fillStyle='#c8a880';g.beginPath();g.ellipse(0,-70,5,4,0,0,7);g.fill();g.fillStyle='#111';g.beginPath();g.arc(-4,-76,1.4,0,7);g.arc(4,-76,1.4,0,7);g.arc(0,-71,1.6,0,7);g.fill();
    for(let i=0;i<4;i++){g.fillStyle=i%2?'#e8e0d0':'#b83a3a';g.fillRect(-16,-30+i*4,32,4)}
    g.fillStyle='#4a3020';g.fillRect(-14,-14,10,14);g.fillRect(4,-14,10,14);
  }else if(k===3){// horloge comtoise à moustache
    g.fillStyle='#6a4428';rr(g,-13,-88,26,88,4);g.fill();g.fillStyle='#e8dcc0';g.beginPath();g.arc(0,-70,10,0,7);g.fill();
    g.strokeStyle='#2a2420';g.lineWidth=1.4;g.beginPath();g.moveTo(0,-70);g.lineTo(0,-77);g.moveTo(0,-70);g.lineTo(5,-70);g.stroke();
    g.fillStyle='#2a2420';g.beginPath();g.moveTo(-8,-63);g.quadraticCurveTo(-4,-66,0,-64);g.quadraticCurveTo(4,-66,8,-63);g.quadraticCurveTo(4,-61,0,-62);g.quadraticCurveTo(-4,-61,-8,-63);g.fill();
    g.fillStyle='#c9a24a';g.beginPath();g.arc(Math.sin(t*2.5)*6,-28,5,0,7);g.fill();g.strokeStyle='#c9a24a';g.beginPath();g.moveTo(0,-52);g.lineTo(Math.sin(t*2.5)*6,-28);g.stroke();
  }else{// mannequin de couture en corset, coiffé d'un casque à pointe
    g.strokeStyle='#3a2a1c';g.lineWidth=3;g.beginPath();g.moveTo(0,0);g.lineTo(0,-24);g.moveTo(-12,0);g.lineTo(12,0);g.stroke();
    g.fillStyle='#d8c8a8';g.beginPath();g.moveTo(-14,-74);g.quadraticCurveTo(-18,-50,-10,-26);g.lineTo(10,-26);g.quadraticCurveTo(18,-50,14,-74);g.closePath();g.fill();
    g.fillStyle='#c86a8a';g.beginPath();g.moveTo(-13,-56);g.lineTo(13,-56);g.lineTo(10,-32);g.lineTo(-10,-32);g.closePath();g.fill();
    g.strokeStyle='#fff';g.lineWidth=.8;for(let i=0;i<5;i++){g.beginPath();g.moveTo(-3,-54+i*5);g.lineTo(3,-52+i*5);g.stroke()}
    g.fillStyle='#2a2a2a';g.beginPath();g.ellipse(0,-80,9,6,0,Math.PI,0);g.fill();g.fillRect(-1,-92,2,8);
  }
  g.restore();
}
/* drap tombé par terre, roulé en boule */
function drawFallenSheet(g,x,y){
  g.save();const gr=g.createLinearGradient(x-26,y-14,x+26,y);gr.addColorStop(0,'#d8d2c2');gr.addColorStop(1,'#a8a090');g.fillStyle=gr;
  g.beginPath();g.moveTo(x-28,y);g.quadraticCurveTo(x-24,y-14,x-8,y-12);g.quadraticCurveTo(x+4,y-20,x+16,y-10);g.quadraticCurveTo(x+28,y-8,x+30,y);g.closePath();g.fill();
  g.strokeStyle='rgba(0,0,0,.12)';g.lineWidth=1.2;g.beginPath();g.moveTo(x-12,y-2);g.quadraticCurveTo(x-6,y-10,x+2,y-4);g.moveTo(x+6,y-2);g.quadraticCurveTo(x+12,y-9,x+20,y-3);g.stroke();g.restore();
}
/* chat emmêlé dans le drap : une boule de tissu qui gigote */
function drawCatTangled(g,w,t){
  const k=w.k,x=k.x+k.w/2,y=k.y+k.h;g.save();g.translate(x,y);
  const b=Math.sin(t*14)*3,b2=Math.cos(t*11)*3;
  g.fillStyle='#e6e0d2';g.beginPath();g.moveTo(-26,0);g.quadraticCurveTo(-30+b,-26,-8,-36+b2);g.quadraticCurveTo(10,-40,24+b2,-22);g.quadraticCurveTo(30,-6,26,0);g.closePath();g.fill();
  g.fillStyle='#1e1c22';g.beginPath();g.moveTo(24,-6);g.quadraticCurveTo(40,-12+b,36,-28);g.lineTo(32,-26);g.quadraticCurveTo(34,-12,22,-2);g.fill();
  g.restore();
}
/* intérieur du carton creux, et paille cachée (visible seulement de près) */
function drawFakeAndStash(t){
  const pcx=P.x+P.w/2,pcy=P.y+P.h/2;
  for(let r=0;r<ROWS;r++)for(let c=Math.max(0,Math.floor(cam.x/T)-1);c<Math.min(L.w,Math.ceil((cam.x+W)/T)+1);c++){
    if(L.g[r][c]!=='f')continue;const x=c*T,y=r*T,d=Math.hypot(x+T/2-pcx,y+T/2-pcy),a=inFake()?clamp(1-(d-30)/30,0,1):0;if(a<=0)continue;
    ctx.save();ctx.globalAlpha=a;ctx.fillStyle='#1a1410';ctx.fillRect(x,y,T,T);ctx.fillStyle='rgba(255,210,140,.08)';ctx.fillRect(x,y+T-6,T,6);ctx.restore()}
  for(const a of L.acts){if(a.kind!=='stash'||a.used)continue;const c=Math.floor(a.x/T),r=Math.floor(a.y/T);
    const inside=L.g[r]&&L.g[r][c]==='f';if(inside&&!inFake())continue;
    ctx.save();const gl=ctx.createRadialGradient(a.x,a.y,2,a.x,a.y,26);gl.addColorStop(0,'rgba(255,220,120,.45)');gl.addColorStop(1,'rgba(255,220,120,0)');ctx.fillStyle=gl;ctx.beginPath();ctx.arc(a.x,a.y,26,0,7);ctx.fill();
    drawTuft(ctx,a.x,a.y+Math.sin(t*3)*2,t);ctx.restore()}
}
/* le gardien furieux : visage rouge et fumée */
function drawAngry(g,gd,t){
  const x=gd.x+gd.w/2,y=gd.y-4;g.save();
  for(let i=0;i<2;i++){const ph=(t*1.5+i*.5)%1;g.fillStyle='rgba(200,200,200,'+(.5*(1-ph))+')';g.beginPath();g.arc(x+(i?8:-8)+Math.sin(ph*6)*3,y-ph*22,3+ph*5,0,7);g.fill()}
  g.restore();
}
