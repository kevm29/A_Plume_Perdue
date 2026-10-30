/* =========================================================
   PERSONNAGES, CRÉATURES ET OBJETS ANIMÉS
   ========================================================= */
function drawRaymond(g,x,y,o){
  const d=[0,2,3,5,7][Math.max(0,Math.min(4,o.wear||0))],t=o.t||0,w=o.walk||0;
  g.save();g.translate(x,y);if(o.rot)g.rotate(o.rot);g.scale((o.f||1)*(o.sx||1),o.sy||1);
  if(o.size)g.scale(o.size,o.size);
  const step=Math.sin(t*15)*w,air=o.air;
  const hb=air?0:Math.sin(t*15)*2.6*w;
  const bob=air?0:Math.abs(Math.sin(t*15))*1.2*w;
  const breathe=air||w>.1||o.eyeClosed?0:Math.sin(t*2.4)*.5;
  g.lineCap='round';g.lineJoin='round';
  const leg=(hx,fx,fy)=>{g.strokeStyle='#b4454c';g.lineWidth=2.4;g.beginPath();g.moveTo(hx,-9-bob);g.lineTo(fx,fy);g.stroke();g.lineWidth=1.6;g.beginPath();g.moveTo(fx-2.5,fy);g.lineTo(fx+4,fy);g.moveTo(fx,fy);g.lineTo(fx+2.5,fy-1.2);g.stroke()};
  const f1=air?-4:-3+step*4,f2=air?3:3-step*4,fy=air?-3:0;
  leg(-2,f1,fy);leg(3,f2,fy);
  g.save();g.translate((3+f2)/2+1.5,-6.5-bob/2);g.rotate(.2);
  g.fillStyle='#a8322d';rr(g,-2.8,-4,5.6,8,1.6);g.fill();g.fillStyle='#e9dfc7';g.fillRect(-1.6,-6,3.2,2.4);g.fillStyle='rgba(255,255,255,.35)';g.fillRect(-2,-3,1.2,5);
  g.restore();
  g.translate(0,-bob-breathe);
  g.fillStyle='#525a6c';poly(g,[-9,-17,-22,-21,-23,-13,-9,-11]);g.fill();
  g.fillStyle='#2c303b';poly(g,[-19,-20.2,-23,-21,-23.6,-13.2,-19.4,-13.6]);g.fill();
  const bg=g.createLinearGradient(0,-24,0,-6);bg.addColorStop(0,'#9ca5b6');bg.addColorStop(1,'#7b8496');
  g.fillStyle=bg;g.beginPath();g.ellipse(-1,-15,12,8.6,-.08,0,7);g.fill();
  g.fillStyle='rgba(255,255,255,.14)';g.beginPath();g.ellipse(2,-11,7,3.5,0,0,7);g.fill();
  const RR=mulberry(77);
  g.lineWidth=1.3;
  for(let i=0;i<Math.min(d*2,16);i++){const a=RR()*Math.PI*2,px=-1+Math.cos(a)*11,py=-15+Math.sin(a)*7.5,l=4+RR()*5;g.strokeStyle=i%3?'#e0b04e':'#b8862e';g.beginPath();g.moveTo(px,py);g.lineTo(px+Math.cos(a+RR()-.5)*l,py+Math.sin(a+RR()-.5)*l);g.stroke()}
  g.save();g.translate(-1,-18);
  let wa=0;if(o.flap>0)wa=-.4-Math.sin(o.flap*40)*.9;else if(o.glide)wa=-.55;
  g.rotate(wa);
  g.fillStyle='#727b8f';g.beginPath();g.moveTo(6,0);g.quadraticCurveTo(2,-6,-10,-3);g.quadraticCurveTo(-15,1,-14,4);g.quadraticCurveTo(-4,7,6,3);g.closePath();g.fill();
  g.strokeStyle='#23262e';g.lineWidth=1.8;g.beginPath();g.moveTo(-3,-1);g.quadraticCurveTo(-5,2,-4,5);g.moveTo(-7,-1.5);g.quadraticCurveTo(-9,2,-8,5);g.stroke();
  g.strokeStyle='rgba(233,223,199,.7)';g.lineWidth=.8;g.setLineDash([1.6,1.8]);g.beginPath();g.moveTo(5,2.5);g.quadraticCurveTo(-4,6.5,-13,3.5);g.stroke();g.setLineDash([]);
  g.restore();
  if(d>=3){g.save();g.translate(-4,-12);g.rotate(.5);g.fillStyle='#ede4cf';rr(g,-6,-2,12,4,1.5);g.fill();g.rotate(-1.1);rr(g,-5,-2,10,4,1.5);g.fill();g.fillStyle='rgba(168,50,45,.5)';g.fillRect(-1,-1,2,2);g.restore()}
  g.save();g.translate(hb,0);
  const ng=g.createLinearGradient(4,-28,10,-16);ng.addColorStop(0,'#7a5d9e');ng.addColorStop(.55,'#4f9a7a');ng.addColorStop(1,'#8d96a8');
  if(o.noHead){
    // cou tranché net : moignon recousu, paille qui s'échappe
    g.save();g.beginPath();g.rect(-30,-23,60,40);g.clip();g.fillStyle=ng;g.beginPath();g.ellipse(7,-21,6,7,.3,0,7);g.fill();g.restore();
    g.fillStyle='#d8c08a';g.beginPath();g.ellipse(6.4,-23,5.6,1.8,.15,0,7);g.fill();
    g.strokeStyle='rgba(233,223,199,.8)';g.lineWidth=.7;g.setLineDash([1.2,1.2]);g.beginPath();g.ellipse(6.4,-23,5.6,1.8,.15,0,7);g.stroke();g.setLineDash([]);
    const st=o.straw==null?1:o.straw;g.lineCap='round';
    for(let k=0;k<9;k++){const ax=2.5+k*1,ang=-Math.PI/2+(k-4)*.22,l=(3+((k*7)%5))*st;g.strokeStyle=k%3?'#e0b04e':'#b8862e';g.lineWidth=1.1;g.beginPath();g.moveTo(ax,-23);g.lineTo(ax+Math.cos(ang)*l,-23+Math.sin(ang)*l);g.stroke()}
  }else{
    g.fillStyle=ng;g.beginPath();g.ellipse(7,-21,6,7,.3,0,7);g.fill();
    raymondHead(g,d,o);
  }
  g.restore();
  g.restore();
}
/* la tête de Raymond (dans le repère du corps) */
function raymondHead(g,d,o){
  g.fillStyle='#929bad';g.beginPath();g.arc(9.5,-28,6,0,7);g.fill();
  if(d>=5){g.fillStyle='#ede4cf';g.save();g.translate(9,-32);g.rotate(-.3);rr(g,-6,-1.8,12,3.6,1.5);g.fill();g.restore()}
  g.fillStyle='#3a3836';poly(g,[14.5,-29.3,20,-27.6,14.5,-26.4]);g.fill();
  g.fillStyle='#efe9df';g.beginPath();g.ellipse(14.7,-29,1.9,1.3,0,0,7);g.fill();
  if(d>=7){g.fillStyle='#5a3a24';g.beginPath();g.arc(11,-29.5,2.8,0,7);g.fill();g.fillStyle='#2a1a10';for(const[a,b]of[[-1,-1],[1,-1],[-1,1],[1,1]]){g.beginPath();g.arc(11+a*.9,-29.5+b*.9,.5,0,7);g.fill()}g.strokeStyle='#e9dfc7';g.lineWidth=.6;g.beginPath();g.moveTo(10,-30.5);g.lineTo(12,-28.5);g.moveTo(12,-30.5);g.lineTo(10,-28.5);g.stroke()}
  else{g.fillStyle='#d97a2a';g.beginPath();g.arc(11,-29.5,2.7,0,7);g.fill();g.fillStyle='#f4ecd8';g.beginPath();g.arc(11,-29.5,1.7,0,7);g.fill();
    if(o.eyeClosed){g.strokeStyle='#2a2830';g.lineWidth=1.2;g.beginPath();g.moveTo(8.6,-29.2);g.quadraticCurveTo(11,-27.8,13.4,-29.2);g.stroke()}
    else{g.fillStyle='#111';g.beginPath();g.arc(12,-30.4,1.05,0,7);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(10.3,-30.6,.6,0,7);g.fill()}}
}
/* la tête seule, détachée : centrée sur (x,y), avec un bout de cou et de la paille */
function drawRaymondHead(g,x,y,o){
  o=o||{};const d=[0,2,3,5,7][Math.max(0,Math.min(4,o.wear||0))];
  g.save();g.translate(x,y);g.rotate(o.rot||0);g.scale((o.f||1)*(o.size||1),o.size||1);g.translate(-9.5,28);
  g.lineCap='round';
  for(let k=0;k<7;k++){const ax=6+k*1.2,ang=Math.PI/2+(k-3)*.3;g.strokeStyle=k%2?'#e0b04e':'#b8862e';g.lineWidth=1.1;g.beginPath();g.moveTo(ax,-23);g.lineTo(ax+Math.cos(ang)*4,-23+Math.sin(ang)*4);g.stroke()}
  const ng=g.createLinearGradient(4,-28,10,-16);ng.addColorStop(0,'#7a5d9e');ng.addColorStop(.55,'#4f9a7a');ng.addColorStop(1,'#8d96a8');
  g.save();g.beginPath();g.rect(-30,-40,60,17);g.clip();g.fillStyle=ng;g.beginPath();g.ellipse(7,-21,6,7,.3,0,7);g.fill();g.restore();
  raymondHead(g,d,o);
  g.restore();
}
function drawCat(g,x,y,f,t,walk,o){
  o=o||{};const s=o.size||1,col=o.col||'#1b1a20',rim=o.rim||'#3d3b4c';
  g.save();g.translate(x,y);g.scale(f*s,s);
  const st=Math.sin(t*12)*walk;
  g.strokeStyle=col;g.lineCap='round';g.lineWidth=4;
  g.beginPath();g.moveTo(-10,-8);g.lineTo(-10+st*5,0);g.moveTo(-5,-8);g.lineTo(-5-st*5,0);g.moveTo(8,-8);g.lineTo(8-st*5,0);g.moveTo(12,-8);g.lineTo(12+st*5,0);g.stroke();
  g.lineWidth=4.5;g.beginPath();g.moveTo(-15,-14);g.quadraticCurveTo(-28,-16+Math.sin(t*3)*4,-24,-30+Math.sin(t*2.3)*5);g.stroke();
  g.fillStyle=col;g.beginPath();g.ellipse(0,-13,16,8,0,0,7);g.fill();
  if(o.stripes){g.strokeStyle='rgba(90,40,10,.6)';g.lineWidth=2.4;for(let k=-8;k<10;k+=6){g.beginPath();g.moveTo(k,-20);g.lineTo(k+2,-9);g.stroke()}}
  g.fillStyle=col;g.beginPath();g.arc(16,-19,8,0,7);g.fill();
  poly(g,[10,-24,12,-33,17,-26]);g.fill();poly(g,[17,-26,22,-33,23,-23]);g.fill();
  g.fillStyle='#e8a0a0';poly(g,[11.5,-25.5,12.5,-30.5,15,-26.5]);g.fill();poly(g,[18.5,-26.5,21.5,-30.5,21.8,-24.5]);g.fill();
  g.strokeStyle=rim;g.lineWidth=1;g.beginPath();g.ellipse(0,-13,16,8,0,Math.PI*1.1,Math.PI*1.9);g.stroke();
  g.fillStyle='#f2ead8';g.beginPath();g.ellipse(18,-15,5,3,0,0,Math.PI);g.fill();
  g.fillStyle=o.eye||'#d8c94a';g.beginPath();g.ellipse(14,-20,2.4,1.8,0,0,7);g.ellipse(20,-20,2.4,1.8,0,0,7);g.fill();
  g.fillStyle='#000';g.fillRect(13.6,-21.6,.9,3.2);g.fillRect(19.6,-21.6,.9,3.2);
  if(o.mouth){g.fillStyle='#5a1a1a';g.beginPath();g.ellipse(21,-14.5,3,2.2,0,0,7);g.fill();g.fillStyle='#fff';g.fillRect(19.2,-16,1,1.6);g.fillRect(22,-16,1,1.6)}
  g.fillStyle='#d98a8a';g.beginPath();g.arc(23.5,-17.5,1.2,0,7);g.fill();
  g.strokeStyle='rgba(230,230,230,.5)';g.lineWidth=.6;g.beginPath();g.moveTo(22,-16.5);g.lineTo(30,-18);g.moveTo(22,-16);g.lineTo(30,-15);g.stroke();
  g.restore();
}
function drawSleepingCat(g,x,y,t){
  g.save();g.translate(x,y);
  g.fillStyle='#8a6a3a';g.beginPath();g.ellipse(0,-6,32,10,0,0,7);g.fill();
  g.strokeStyle='#5e4626';g.lineWidth=1.2;for(let k=-28;k<=28;k+=6){g.beginPath();g.moveTo(k,-14);g.lineTo(k+3,2);g.stroke()}
  g.fillStyle='#a8322d';g.beginPath();g.ellipse(0,-12,26,5,0,0,7);g.fill();
  const br=1+Math.sin(t*2.2)*.045;
  g.fillStyle='#c7742e';g.beginPath();g.ellipse(0,-17,24*br,12*br,0,0,7);g.fill();
  g.strokeStyle='rgba(110,50,15,.55)';g.lineWidth=3;for(let k=-14;k<16;k+=7){g.beginPath();g.moveTo(k,-28);g.quadraticCurveTo(k+3,-19,k,-9);g.stroke()}
  g.strokeStyle='#c7742e';g.lineWidth=6;g.lineCap='round';g.beginPath();g.moveTo(-20,-12);g.quadraticCurveTo(-10,-2,14,-8);g.stroke();
  g.fillStyle='#c7742e';g.beginPath();g.arc(18,-15,9,0,7);g.fill();poly(g,[12,-21,13,-29,19,-23]);g.fill();poly(g,[19,-23,25,-29,26,-18]);g.fill();
  g.strokeStyle='#3a2210';g.lineWidth=1.3;g.beginPath();g.moveTo(14,-15);g.quadraticCurveTo(16,-13,18,-15);g.moveTo(20,-15);g.quadraticCurveTo(22,-13,24,-15);g.stroke();
  g.fillStyle='#8a5a2a';rr(g,-12,-4,24,8,2);g.fill();g.fillStyle='#e9dfc7';g.font='7px '+F_DISP;g.textAlign='center';g.fillText('BIJOU',0,2.5);
  g.fillStyle='rgba(233,223,199,.8)';g.font='italic 16px '+F_BODY;g.textAlign='left';
  for(let k=0;k<3;k++){const ph=(t*.6+k/3)%1;g.globalAlpha=Math.sin(ph*Math.PI)*.9;g.fillText('z',30+ph*18,-30-ph*36)}
  g.globalAlpha=1;g.restore();
}
/* marcheurs */
function drawWalker(g,kind,x,y,f,t){
  g.save();g.translate(x,y);g.scale(f,1);
  const st=Math.sin(t*(kind==='hedgehog'?10:kind==='goose'?14:22));
  if(kind==='rat'){
    g.strokeStyle='#c98a8a';g.lineWidth=1.8;g.lineCap='round';g.beginPath();g.moveTo(-12,-6);g.quadraticCurveTo(-24,-4+st*3,-30,-10+Math.sin(t*5)*4);g.stroke();
    g.strokeStyle='#4a3e36';g.lineWidth=2.2;g.beginPath();g.moveTo(-6,-4);g.lineTo(-6+st*3,0);g.moveTo(6,-4);g.lineTo(6-st*3,0);g.stroke();
    g.fillStyle='#6a5c52';g.beginPath();g.ellipse(-1,-8,13,7,0,0,7);g.fill();
    g.beginPath();g.moveTo(8,-12);g.quadraticCurveTo(18,-10,20,-6);g.quadraticCurveTo(14,-3,7,-4);g.closePath();g.fill();
    g.fillStyle='#d99a9a';g.beginPath();g.arc(20,-6,1.6,0,7);g.fill();g.fillStyle='#c98a8a';g.beginPath();g.arc(9,-13,2.6,0,7);g.fill();
    g.fillStyle='#111';g.beginPath();g.arc(14,-9,1.3,0,7);g.fill();
  }else if(kind==='boar'){
    g.strokeStyle='#2a1e16';g.lineWidth=3.4;g.lineCap='round';g.beginPath();g.moveTo(-8,-6);g.lineTo(-8+st*3,0);g.moveTo(8,-6);g.lineTo(8-st*3,0);g.stroke();
    g.fillStyle='#4a3a2c';g.beginPath();g.ellipse(-1,-12,16,10,0,0,7);g.fill();
    g.fillStyle='#3a2c20';for(let k=-12;k<10;k+=4)g.fillRect(k,-23,2,5);
    g.fillStyle='#4a3a2c';poly(g,[10,-18,24,-10,22,-4,10,-6]);g.fill();g.fillStyle='#6a5444';g.fillRect(21,-10,4,5);
    g.fillStyle='#efe6d3';poly(g,[19,-6,23,-10,21,-5]);g.fill();g.fillStyle='#111';g.beginPath();g.arc(14,-14,1.4,0,7);g.fill();
    g.fillStyle='#3a2c20';poly(g,[9,-18,12,-24,14,-17]);g.fill();
  }else if(kind==='piglet'){
    // marcassin : petit, roux, rayé comme un pyjama
    g.strokeStyle='#3a2a1e';g.lineWidth=2.4;g.lineCap='round';g.beginPath();g.moveTo(-5,-4);g.lineTo(-5+st*2,0);g.moveTo(5,-4);g.lineTo(5-st*2,0);g.stroke();
    g.fillStyle='#8a5e3a';g.beginPath();g.ellipse(-1,-8,10,6.5,0,0,7);g.fill();
    g.fillStyle='#d8b688';for(const yy of[-12,-9,-6]){g.beginPath();g.ellipse(-2,yy,8,.9,0,0,7);g.fill()}
    g.fillStyle='#8a5e3a';poly(g,[6,-12,15,-7,14,-3,6,-4]);g.fill();g.fillStyle='#b07a5a';g.fillRect(13,-7,3,3.4);
    g.fillStyle='#111';g.beginPath();g.arc(9,-9,1.1,0,7);g.fill();
    g.fillStyle='#6a4428';poly(g,[5,-12,7,-16,9,-12]);g.fill();
    g.strokeStyle='#6a4428';g.lineWidth=1.2;g.beginPath();g.moveTo(-10,-9);g.quadraticCurveTo(-14,-11,-13,-14+Math.sin(t*9)*1.5);g.stroke();
  }else if(kind==='pigeon'){
    g.strokeStyle='#b4454c';g.lineWidth=2;g.beginPath();g.moveTo(-2,-8);g.lineTo(-2+st*3,0);g.moveTo(3,-8);g.lineTo(3-st*3,0);g.stroke();
    g.fillStyle='#7a8496';g.beginPath();g.ellipse(-1,-13,11,7.5,0,0,7);g.fill();g.fillStyle='#525a6c';poly(g,[-9,-15,-19,-18,-19,-11,-9,-10]);g.fill();
    const ng=g.createLinearGradient(4,-24,8,-14);ng.addColorStop(0,'#7a5d9e');ng.addColorStop(1,'#4f9a7a');g.fillStyle=ng;g.beginPath();g.ellipse(6,-18,5,6,.3,0,7);g.fill();
    const hb=Math.sin(t*14)*3;g.fillStyle='#8a94a6';g.beginPath();g.arc(9+hb,-24,5,0,7);g.fill();g.fillStyle='#3a3836';poly(g,[13+hb,-25,17+hb,-23.5,13+hb,-22.5]);g.fill();
    g.fillStyle='#d97a2a';g.beginPath();g.arc(10+hb,-25,1.8,0,7);g.fill();g.fillStyle='#111';g.beginPath();g.arc(10.3+hb,-25,.8,0,7);g.fill();
    g.strokeStyle='#22252c';g.lineWidth=1.4;g.beginPath();g.moveTo(-6,-15);g.lineTo(-3,-10);g.moveTo(-2,-16);g.lineTo(1,-11);g.stroke();
  }else if(kind==='hedgehog'){
    g.fillStyle='#4a3a2a';g.beginPath();g.ellipse(0,-9,14,9,0,Math.PI,0);g.fill();
    g.strokeStyle='#2a2018';g.lineWidth=1.4;for(let a=Math.PI*1.05;a<Math.PI*1.95;a+=.16){g.beginPath();g.moveTo(Math.cos(a)*10,-9+Math.sin(a)*7);g.lineTo(Math.cos(a)*17,-9+Math.sin(a)*13);g.stroke()}
    g.fillStyle='#a8886a';g.beginPath();g.ellipse(12,-6,7,5,.2,0,7);g.fill();g.fillStyle='#111';g.beginPath();g.arc(18,-6,1.6,0,7);g.arc(12,-8,1.1,0,7);g.fill();
    g.fillStyle='#6a5444';g.fillRect(-6,-2+st,3,2);g.fillRect(4,-2-st,3,2);
  }else if(kind==='goose'){
    g.strokeStyle='#e08a2a';g.lineWidth=2.4;g.beginPath();g.moveTo(-3,-10);g.lineTo(-3+st*4,0);g.moveTo(3,-10);g.lineTo(3-st*4,0);g.stroke();
    g.fillStyle='#efeae0';g.beginPath();g.ellipse(-2,-16,15,9,-.1,0,7);g.fill();g.fillStyle='#d8d2c6';poly(g,[-14,-18,-22,-24,-16,-12]);g.fill();
    const nk=Math.sin(t*6)*2;g.strokeStyle='#efeae0';g.lineWidth=6;g.lineCap='round';g.beginPath();g.moveTo(8,-18);g.quadraticCurveTo(14+nk,-26,12+nk,-36);g.stroke();
    g.fillStyle='#efeae0';g.beginPath();g.arc(13+nk,-37,5,0,7);g.fill();g.fillStyle='#e08a2a';poly(g,[17+nk,-38,24+nk,-35,17+nk,-34]);g.fill();
    g.fillStyle='#111';g.beginPath();g.arc(14+nk,-38.5,1.2,0,7);g.fill();g.strokeStyle='#5a3a1a';g.lineWidth=1.4;g.beginPath();g.moveTo(11+nk,-40);g.lineTo(15+nk,-41);g.stroke();
  }
  g.restore();
}
/* volants */
function drawFlyer(g,kind,x,y,t,dir){
  g.save();g.translate(x,y);if(dir<0)g.scale(-1,1);
  if(kind==='moth'){
    const fl=Math.abs(Math.sin(t*24));g.fillStyle='rgba(220,200,150,.12)';g.beginPath();g.arc(0,0,16,0,7);g.fill();
    g.fillStyle='#cdbb92';g.save();g.scale(1,.35+fl*.65);g.beginPath();g.ellipse(-7,-3,9,6.5,-.5,0,7);g.ellipse(7,-3,9,6.5,.5,0,7);g.fill();g.fillStyle='#a8946b';g.beginPath();g.ellipse(-5,4,5.5,4,.4,0,7);g.ellipse(5,4,5.5,4,-.4,0,7);g.fill();g.restore();
    g.fillStyle='#4a3b26';g.beginPath();g.ellipse(0,0,2.5,7.5,0,0,7);g.fill();
    g.strokeStyle='#4a3b26';g.lineWidth=.8;g.beginPath();g.moveTo(-1,-6);g.quadraticCurveTo(-4,-12,-8,-13);g.moveTo(1,-6);g.quadraticCurveTo(4,-12,8,-13);g.stroke();
  }else if(kind==='crow'||kind==='bat'||kind==='gull'){
    const fl=Math.sin(t*(kind==='bat'?20:12)),col=kind==='crow'?'#1a1a20':kind==='bat'?'#2a2230':'#e8e8e4',wing=kind==='gull'?'#b8bcc4':col;
    g.fillStyle=wing;g.beginPath();g.moveTo(-4,-2);g.quadraticCurveTo(-12,-6-fl*12,-20,-2-fl*14);g.quadraticCurveTo(-12,0,-4,3);g.fill();
    g.beginPath();g.moveTo(4,-2);g.quadraticCurveTo(10,-6-fl*12,18,-2-fl*14);g.quadraticCurveTo(10,0,4,3);g.fill();
    if(kind==='bat'){g.fillStyle=col;g.beginPath();g.ellipse(0,0,5,6,0,0,7);g.fill();poly(g,[-3,-5,-4,-10,-1,-6]);g.fill();poly(g,[3,-5,4,-10,1,-6]);g.fill();g.fillStyle='#d8302a';g.fillRect(-2.5,-3,1.5,1.5);g.fillRect(1,-3,1.5,1.5)}
    else{g.fillStyle=col;g.beginPath();g.ellipse(0,1,10,5,0,0,7);g.fill();g.beginPath();g.arc(9,-1,4.5,0,7);g.fill();g.fillStyle=kind==='gull'?'#e0b030':'#2a2a2a';poly(g,[12,-2,19,0,12,1.5]);g.fill();g.fillStyle=kind==='gull'?'#111':'#e9dfc7';g.beginPath();g.arc(10,-2,1,0,7);g.fill();g.fillStyle=col;poly(g,[-9,0,-16,-3,-15,4]);g.fill()}
  }else if(kind==='bag'){
    const s=Math.sin(t*5);g.rotate(s*.3);g.fillStyle='rgba(230,232,236,.85)';g.beginPath();g.moveTo(-10,-12);g.quadraticCurveTo(-14+s*3,2,-8,12);g.quadraticCurveTo(0,15+s*2,9,11);g.quadraticCurveTo(13,0,9,-12);g.quadraticCurveTo(6,-6,3,-12);g.quadraticCurveTo(0,-6,-3,-12);g.quadraticCurveTo(-6,-6,-10,-12);g.fill();
    g.strokeStyle='rgba(150,155,165,.6)';g.lineWidth=.8;g.beginPath();g.moveTo(-6,-2);g.lineTo(5,3);g.moveTo(-4,6);g.lineTo(6,-4);g.stroke();
    g.fillStyle='rgba(60,90,160,.6)';g.font='bold 6px '+F_DISP;g.textAlign='center';g.fillText('MERCI',0,4);
  }else if(kind==='wasp'){
    const fl=Math.abs(Math.sin(t*40));g.fillStyle='rgba(230,240,255,.5)';g.save();g.scale(1,.3+fl*.7);g.beginPath();g.ellipse(-3,-6,5,7,-.4,0,7);g.ellipse(3,-6,5,7,.4,0,7);g.fill();g.restore();
    g.fillStyle='#e0b020';g.beginPath();g.ellipse(-3,0,7,4.5,0,0,7);g.fill();g.fillStyle='#1a1410';for(let k=-8;k<2;k+=4)g.fillRect(k,-4,2,8);g.beginPath();g.arc(5,-1,3.4,0,7);g.fill();poly(g,[-10,0,-14,1,-10,2]);g.fill();
  }
  g.restore();
}
function drawDrone(g,x,y,t,active){
  g.save();g.translate(x,y);
  g.fillStyle='#2a2e36';rr(g,-12,-4,24,8,3);g.fill();g.strokeStyle='#2a2e36';g.lineWidth=2;g.beginPath();g.moveTo(-12,-2);g.lineTo(-20,-6);g.moveTo(12,-2);g.lineTo(20,-6);g.stroke();
  for(const sx of[-20,20]){g.fillStyle='rgba(180,190,200,.35)';g.beginPath();g.ellipse(sx,-8,9,1.6+Math.abs(Math.sin(t*50))*1.2,0,0,7);g.fill()}
  g.fillStyle=active&&(t*4|0)%2?'#e8302a':'#5a1a1a';g.beginPath();g.arc(0,3,2.2,0,7);g.fill();
  g.fillStyle='#111';g.beginPath();g.arc(6,4,3,0,7);g.fill();g.fillStyle='#4a6a9a';g.beginPath();g.arc(6,4,1.4,0,7);g.fill();
  g.restore();
}
function drawBuse(g,x,y,t,f,dive){
  g.save();g.translate(x,y);g.scale(f,1);if(dive)g.rotate(.5);
  const fl=dive?-.3:Math.sin(t*6);
  g.fillStyle='#6a4a2a';g.beginPath();g.moveTo(-6,-2);g.quadraticCurveTo(-18,-12-fl*14,-34,-6-fl*18);g.quadraticCurveTo(-22,2,-6,6);g.fill();
  g.beginPath();g.moveTo(6,-2);g.quadraticCurveTo(14,-12-fl*14,30,-6-fl*18);g.quadraticCurveTo(18,2,6,6);g.fill();
  g.fillStyle='#8a6a42';g.beginPath();g.ellipse(0,2,14,8,0,0,7);g.fill();g.fillStyle='#d9c79a';g.beginPath();g.ellipse(2,5,8,4,0,0,7);g.fill();
  g.fillStyle='#6a4a2a';poly(g,[-12,0,-24,-2,-22,8]);g.fill();
  g.fillStyle='#7a5a36';g.beginPath();g.arc(13,-3,6,0,7);g.fill();g.fillStyle='#e0b030';poly(g,[18,-4,24,-1,18,1]);g.fill();
  g.fillStyle='#f4ecd8';g.beginPath();g.arc(15,-5,2,0,7);g.fill();g.fillStyle='#111';g.beginPath();g.arc(15.6,-5,1,0,7);g.fill();
  g.strokeStyle='rgba(233,223,199,.6)';g.lineWidth=.8;g.setLineDash([1.5,1.5]);g.beginPath();g.moveTo(-8,4);g.lineTo(8,4);g.stroke();g.setLineDash([]);
  g.restore();
}
function drawThief(g,x,y,t,o){
  // cambrioleur : bonnet, loup, pull rayé, sac sur l'épaule, lampe torche
  o=o||{};const pose=o.pose||'stand';
  g.save();g.translate(x,y);g.globalAlpha*=o.alpha==null?1:o.alpha;g.scale(o.f||1,1);
  let crouch=0,lean=0,ph=0,stride=0,lift=0;
  if(pose==='walk'){ph=t*9;stride=1;lean=.05}
  else if(pose==='sneak'){ph=t*5;stride=1.15;crouch=13;lean=.26;lift=1}
  else if(pose==='oops'){crouch=-3;lean=-.12}
  else if(pose==='look'){crouch=5;lean=.08}
  else if(pose==='reach'){lean=-.06}
  const hipY=-46+crouch;
  const pant='#1d2029',shoe='#0e0f13';
  // jambes (arrière puis avant)
  const leg=(p,back)=>{
    const sn=Math.sin(p),cs=Math.cos(p);
    const fx=sn*13*stride,fy=-Math.max(0,cs)*(lift?11:4)*stride;
    const kx=fx*.45+6+crouch*.35,ky=(hipY+fy)/2-crouch*.15;
    g.strokeStyle=back?'#15171e':pant;g.lineWidth=9;g.lineCap='round';g.lineJoin='round';
    g.beginPath();g.moveTo(0,hipY);g.lineTo(kx,ky);g.lineTo(fx,fy-4);g.stroke();
    g.fillStyle=shoe;rr(g,fx-6,fy-7,lift&&cs>0?14:16,7,3);g.fill();
  };
  leg(ph+Math.PI,true);leg(ph,false);
  g.save();g.translate(0,hipY);g.rotate(lean);
  // sac de butin dans le dos
  g.save();g.translate(-17,-34);g.rotate(-.25+Math.sin(ph)*.05);
  g.fillStyle='#5e4a33';g.beginPath();g.ellipse(0,4,13,16,0,0,7);g.fill();
  g.fillStyle='#4a3a28';g.beginPath();g.ellipse(-3,8,8,10,0,0,7);g.fill();
  g.fillStyle='#7a6448';g.fillRect(-4,-12,8,5);g.fillStyle='#8c7656';rr(g,-5,2,9,7,2);g.fill();
  g.restore();
  // torse : pull rayé
  g.save();rr(g,-13,-44,26,46,9);g.clip();
  g.fillStyle='#1f2433';g.fillRect(-14,-46,28,50);
  g.fillStyle='#d9d0bb';for(let yy=-40;yy<2;yy+=8)g.fillRect(-14,yy,28,3.5);
  g.fillStyle='rgba(0,0,0,.18)';g.fillRect(4,-46,10,50);
  g.restore();
  g.fillStyle='#14161d';rr(g,-13,-4,26,7,3);g.fill();
  // bras
  const arm=(sx,sy,ex,ey,hx,hy,lamp)=>{
    g.strokeStyle='#1f2433';g.lineWidth=7;g.beginPath();g.moveTo(sx,sy);g.lineTo(ex,ey);g.lineTo(hx,hy);g.stroke();
    g.strokeStyle='#d9d0bb';g.lineWidth=2;g.beginPath();g.moveTo((sx+ex)/2-2,(sy+ey)/2);g.lineTo((sx+ex)/2+2,(sy+ey)/2+2);g.stroke();
    g.fillStyle='#2a2a2e';g.beginPath();g.arc(hx,hy,4.2,0,7);g.fill();
    if(lamp){g.save();g.translate(hx,hy);g.rotate(lamp);g.fillStyle='#4a4d55';rr(g,-2,-3,13,6,2);g.fill();g.fillStyle='#f3e6b0';g.fillRect(10,-3,2,6);
      const gr=g.createLinearGradient(12,0,130,0);gr.addColorStop(0,'rgba(255,240,190,.35)');gr.addColorStop(1,'rgba(255,240,190,0)');
      g.fillStyle=gr;g.beginPath();g.moveTo(12,-2);g.lineTo(130,-26);g.lineTo(130,26);g.lineTo(12,2);g.closePath();g.fill();g.restore()}
  };
  const sw=Math.sin(ph)*stride;
  if(pose==='reach'){arm(-6,-38,4,-58,8,-76,0);arm(7,-38,16,-58,20,-74,0)}
  else if(pose==='oops'){arm(-8,-38,-20,-50,-18,-66,0);arm(8,-38,22,-50,22,-66,0)}
  else if(pose==='sneak'){arm(-4,-36,10,-30,13,-40,0);arm(8,-36,20,-28,24,-38,o.lamp?.35:0);g.fillStyle='#2a2a2e';for(const hx of[13,24]){g.beginPath();g.moveTo(hx-2,-37);g.lineTo(hx+3,-30);g.lineTo(hx+5,-31);g.closePath();g.fill()}}
  else if(pose==='look'){arm(-6,-38,-2,-22,4,-12,0);arm(7,-38,16,-26,26,-30,o.lamp?(o.head<0?Math.PI*.9:.1):0)}
  else{arm(-6,-38,-6-sw*6,-22,-4-sw*10,-8,0);arm(7,-38,10+sw*6,-22,18+sw*6,-14,o.lamp?.12:0)}
  // tête
  const hd=o.head||1;
  g.save();g.translate(1,-54+(pose==='sneak'?3:0));
  g.fillStyle='#1f2433';g.fillRect(-5,6,10,6);
  g.fillStyle='#c9a080';g.beginPath();g.ellipse(0,0,11,12,0,0,7);g.fill();
  g.fillStyle='rgba(60,40,30,.28)';g.beginPath();g.ellipse(2*hd,6,8,5,0,0,Math.PI);g.fill(); // barbe de trois jours
  g.fillStyle='#c9a080';g.beginPath();g.ellipse(9*hd,2,3.5,4,0,0,7);g.fill(); // nez
  g.fillStyle='#b8705a';g.beginPath();g.ellipse(10.5*hd,2.5,2,2.4,0,0,7);g.fill();
  // loup noir
  g.fillStyle='#0f1014';rr(g,-11,-5,22,7,3);g.fill();
  g.fillStyle='#efe6d0';const ex=pose==='oops'?2.6:1.9;
  for(const k of[2,7]){g.beginPath();g.ellipse(k*hd,-1.5,ex,ex*(pose==='oops'?1.2:.8),0,0,7);g.fill()}
  g.fillStyle='#111';for(const k of[2,7]){g.beginPath();g.arc(k*hd+hd*.7,-1.4,1,0,7);g.fill()}
  if(pose==='oops'){g.fillStyle='#5a2a24';g.beginPath();g.ellipse(4*hd,8,2.4,3,0,0,7);g.fill()}
  else{g.strokeStyle='#5a3a30';g.lineWidth=1.2;g.beginPath();g.moveTo(2*hd,8);g.quadraticCurveTo(5*hd,pose==='sneak'?6:9,8*hd,7);g.stroke()}
  // bonnet
  g.fillStyle='#16181f';g.beginPath();g.moveTo(-12,-5);g.quadraticCurveTo(-11,-19,0,-19);g.quadraticCurveTo(11,-19,12,-5);g.closePath();g.fill();
  g.fillStyle='#22252e';rr(g,-12.5,-8,25,5,2);g.fill();
  g.fillStyle='#16181f';g.beginPath();g.arc(-3,-20,3,0,7);g.fill();
  g.restore();
  g.restore();
  g.restore();
}
function drawBackDoor(g,x,floor,open){
  // porte de service, à gauche de la remise
  const w=46,h=98,top=floor-h;
  g.fillStyle='#2a1f18';g.fillRect(x-w/2-6,top-6,w+12,h+6);
  g.fillStyle='#07060a';g.fillRect(x-w/2,top,w,h);
  if(open>0){const gr=g.createLinearGradient(x-w/2,0,x+w/2,0);gr.addColorStop(0,'rgba(90,110,140,.18)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(x-w/2,top,w,h)}
  const lw=w*(1-open*.78);
  g.fillStyle='#5a3f2c';g.fillRect(x-w/2,top,lw,h);
  if(lw>10){g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=1.5;g.strokeRect(x-w/2+5,top+8,lw-10,h*.38);g.strokeRect(x-w/2+5,top+h*.5,lw-10,h*.42);
    g.fillStyle='#c9a24a';g.beginPath();g.arc(x-w/2+lw-7,top+h*.52,2.4,0,7);g.fill()}
  g.fillStyle='rgba(0,0,0,.3)';g.fillRect(x-w/2+lw-3,top,3,h);
  // panneau SORTIE
  g.fillStyle='#1d6b45';rr(g,x-24,top-28,48,15,2);g.fill();
  g.fillStyle='rgba(120,255,170,.18)';rr(g,x-30,top-33,60,25,6);g.fill();
  g.fillStyle='#e9f5ea';g.font='bold 10px '+F_BODY;g.textAlign='center';g.fillText('SORTIE',x,top-17);
}
function drawTuft(g,x,y,t){
  g.save();g.translate(x,y+Math.sin(t*3)*2.5);g.rotate(Math.sin(t*2)*.18);
  g.strokeStyle='#b8862e';g.lineWidth=1.6;g.lineCap='round';
  for(let k=-4;k<=4;k++){g.beginPath();g.moveTo(k*1.2,7);g.quadraticCurveTo(k*1.6,0,k*2.4,-9+Math.abs(k));g.stroke()}
  g.strokeStyle='#e6c060';g.lineWidth=1.2;for(let k=-3;k<=3;k+=2){g.beginPath();g.moveTo(k,6);g.lineTo(k*2.2,-8);g.stroke()}
  g.fillStyle='#a8322d';g.fillRect(-5,0,10,3);
  g.fillStyle='rgba(255,230,160,.25)';g.beginPath();g.arc(0,-1,12,0,7);g.fill();
  g.restore();
}
function drawMedal(g,x,y,t){
  g.save();g.translate(x,y+Math.sin(t*2.4)*3);
  g.fillStyle='#2f7a3e';g.fillRect(-7,-20,14,13);g.fillStyle='#b8302a';for(let k=-5;k<=5;k+=3.4)g.fillRect(k,-20,1.6,13);
  g.scale(Math.cos(t*2),1);
  g.fillStyle='#b07a3a';
  for(let a=0;a<4;a++){g.save();g.rotate(a*Math.PI/2);poly(g,[-3,0,3,0,6,-10,-6,-10]);g.fill();g.restore()}
  g.fillStyle='#d9a85a';g.beginPath();g.arc(0,0,4,0,7);g.fill();g.fillStyle='#8a5a22';g.beginPath();g.arc(0,0,2,0,7);g.fill();
  g.restore();
}
function drawCartel(g,x,y,on,t,outdoor){
  g.save();g.translate(x,y);
  if(outdoor){
    g.fillStyle='#4a3a2a';g.fillRect(-2,-56,4,56);
    const wv=Math.sin(t*4)*3;g.fillStyle=on?'#c8302a':'#7a7068';poly(g,[2,-56,26,-50+wv*.3,24+wv,-42,2,-40]);g.fill();
    if(on){g.fillStyle='rgba(255,210,130,.9)';g.beginPath();g.arc(0,-60,3,0,7);g.fill()}
    g.restore();return;
  }
  g.fillStyle='#3a2a1c';g.fillRect(-2,-30,4,30);g.fillRect(-10,-3,20,3);
  g.save();g.translate(0,-34);g.rotate(-.12);
  g.fillStyle='#e9dfc7';g.fillRect(-16,-10,32,20);g.strokeStyle='#2a2420';g.lineWidth=1;g.strokeRect(-14.5,-8.5,29,17);
  g.fillStyle='#2a2420';g.fillRect(-11,-4,22,1.2);g.fillRect(-11,0,16,1.2);g.fillRect(-11,4,19,1.2);
  if(on){g.strokeStyle='#a8322d';g.lineWidth=2.2;g.beginPath();g.moveTo(5,-1);g.lineTo(9,4);g.lineTo(16,-8);g.stroke()}
  g.restore();
  g.fillStyle='#8a6a3a';g.beginPath();g.moveTo(-5,-48);g.lineTo(5,-48);g.lineTo(3,-54);g.lineTo(-3,-54);g.closePath();g.fill();
  if(on){g.fillStyle='rgba(255,210,130,'+(.75+Math.sin(t*6)*.1)+')';g.beginPath();g.arc(0,-46,3.5,0,7);g.fill()}
  else{g.fillStyle='#4a4038';g.beginPath();g.arc(0,-46,3,0,7);g.fill()}
  g.restore();
}
function drawEasel(g,x,y,label,outdoor){
  g.save();g.translate(x,y);
  if(outdoor){
    g.fillStyle='#5a4632';g.fillRect(-2,-50,4,50);g.fillStyle='#8a6a44';rr(g,-20,-62,40,26,3);g.fill();g.strokeStyle='#4a3626';g.lineWidth=1.5;g.strokeRect(-17.5,-59.5,35,21);
    g.fillStyle='#efe6d0';g.font='9px '+F_DISP;g.textAlign='center';g.fillText('ART.',0,-50);g.font='11px '+F_DISP;g.fillText(label,0,-41);g.restore();return;
  }
  g.strokeStyle='#4a3524';g.lineWidth=3;g.beginPath();g.moveTo(-12,0);g.lineTo(0,-46);g.lineTo(12,0);g.moveTo(0,-46);g.lineTo(2,0);g.stroke();
  g.fillStyle='#e9dfc7';g.save();g.rotate(.04);g.fillRect(-16,-42,32,24);g.strokeStyle='#2a2420';g.lineWidth=1;g.strokeRect(-14.5,-40.5,29,21);
  g.fillStyle='#2a2420';g.font='10px '+F_DISP;g.textAlign='center';g.fillText('FIG.',0,-30);g.font='12px '+F_DISP;g.fillText(label,0,-21);g.restore();
  g.restore();
}
function drawExit(g,e,style,t,label){
  const x=e.x+6,y=e.y;
  if(style==='house'){drawHouse(g,e,t);return}
  g.save();
  if(style==='window'){
    g.fillStyle='#1b2630';g.beginPath();g.moveTo(x-12,y+86);g.lineTo(x-12,y-40);g.arc(x+20,y-40,32,Math.PI,0);g.lineTo(x+52,y+86);g.closePath();g.fill();
    const gr=g.createLinearGradient(0,y-70,0,y+80);gr.addColorStop(0,'#c8dcea');gr.addColorStop(1,'#6a8aa4');
    g.fillStyle=gr;g.beginPath();g.moveTo(x-4,y+78);g.lineTo(x-4,y-40);g.arc(x+20,y-40,24,Math.PI,0);g.lineTo(x+44,y+78);g.closePath();g.fill();
    g.fillStyle='#f4f2e6';g.beginPath();g.arc(x+26,y-30,9,0,7);g.fill();
    g.strokeStyle='#1b2630';g.lineWidth=3;g.beginPath();g.moveTo(x+20,y-64);g.lineTo(x+20,y+78);g.stroke();
    g.fillStyle='#e9dfc7';g.font='13px '+F_DISP;g.textAlign='center';g.fillText('DEHORS',x+20,y+102);
  }else if(style==='door'){
    g.fillStyle='#2a1c12';g.fillRect(x-6,y-6,T+12,2*T+6);
    const gr=g.createLinearGradient(x,y,x+T,y);gr.addColorStop(0,'#ffd9a0');gr.addColorStop(1,'#f0a860');
    g.fillStyle=gr;g.fillRect(x,y,T,2*T);
    g.fillStyle='#5a3a24';poly(g,[x,y,x-14,y+6,x-14,y+2*T+6,x,y+2*T]);g.fill();
    g.fillStyle='#d9a441';g.beginPath();g.arc(x-9,y+44,2,0,7);g.fill();
    g.fillStyle='#2f5a3a';g.fillRect(x-4,y-26,T+8,16);g.fillStyle='#e9dfc7';g.font='12px '+F_DISP;g.textAlign='center';g.fillText('SORTIE',x+T/2,y-14);
  }else if(style==='bunker'){
    g.fillStyle='#5a5a52';poly(g,[x-30,y+2*T,x-20,y-10,x+T+20,y-10,x+T+30,y+2*T]);g.fill();
    g.fillStyle='#1a1a18';rr(g,x-2,y+10,T+4,2*T-10,6);g.fill();
    g.fillStyle='rgba(255,200,120,.5)';g.fillRect(x+4,y+30,T-8,2*T-30);
    g.fillStyle='#e9dfc7';g.font='11px '+F_DISP;g.textAlign='center';g.fillText(label||'ABRI',x+T/2,y-16);
  }else if(style==='tomb'){
    // la même tombe que dans la fin : stèle de granit gravée de face, dalle, pot de chrysanthèmes
    const cx=x+T/2,gy=y+2*T,st=gy-150,sb=gy-16;
    g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(cx+6,gy,96,8,0,0,7);g.fill();
    g.fillStyle='#45433f';poly(g,[cx+52,st+14,cx+58,st+18,cx+58,sb,cx+52,sb]);g.fill();
    g.save();g.beginPath();g.moveTo(cx-52,sb);g.lineTo(cx-52,st+14);g.quadraticCurveTo(cx,st-8,cx+52,st+14);g.lineTo(cx+52,sb);g.closePath();g.clip();
    const gr=g.createLinearGradient(cx-52,st,cx+52,sb);gr.addColorStop(0,'#86837c');gr.addColorStop(1,'#5f5c57');g.fillStyle=gr;g.fillRect(cx-52,st-10,104,sb-st+10);
    const R=mulberry(11);for(let k=0;k<140;k++){g.fillStyle=R()<.5?'rgba(0,0,0,.14)':'rgba(255,255,255,.08)';g.fillRect(cx-52+R()*104,st-8+R()*(sb-st+8),1.2,1.2)}
    g.fillStyle='rgba(255,255,255,.08)';g.fillRect(cx-52,st-10,3,sb-st+10);g.restore();
    g.fillStyle='#3e4a44';g.fillRect(cx-2.5,st-26,5,24);g.fillRect(cx-9,st-19,18,4);
    const eg=(tx,yy,f)=>{g.font=f;g.fillStyle='rgba(0,0,0,.55)';g.fillText(tx,cx,yy+1);g.fillStyle='#c8a75e';g.fillText(tx,cx,yy)};
    g.textAlign='center';
    eg('FAMILLE GARNIER',st+24,'8px '+F_DISP);g.fillStyle='#c8a75e';g.fillRect(cx-20,st+28,40,.8);
    eg('Joseph GARNIER',st+44,'6.5px '+F_DISP);eg('1893 – 1958',st+53,'5.5px '+F_DISP);
    eg('Marguerite GARNIER',st+70,'6.5px '+F_DISP);eg('née VASSEUR',st+78,'italic 5.5px '+F_BODY);eg('1897 – 1989',st+87,'5.5px '+F_DISP);
    g.fillStyle='#d8d2c4';rr(g,cx-15,st+98,30,13,2);g.fill();
    // dalle
    const tg=g.createLinearGradient(0,sb-14,0,sb);tg.addColorStop(0,'#77746d');tg.addColorStop(1,'#99968e');g.fillStyle=tg;poly(g,[cx-68,sb-14,cx+68,sb-14,cx+78,sb,cx-78,sb]);g.fill();
    g.fillStyle='#625f5a';g.fillRect(cx-78,sb,156,gy-sb);g.fillStyle='rgba(255,255,255,.18)';g.fillRect(cx-78,sb-1,156,1.2);
    // pot de chrysanthèmes à droite
    const px=cx+104;g.fillStyle='#8a4a2a';poly(g,[px-11,gy-24,px+11,gy-24,px+8,gy,px-8,gy]);g.fill();g.fillStyle='#b06a40';g.fillRect(px-12,gy-27,24,5);
    g.strokeStyle='#2e4a28';g.lineWidth=1.4;for(let k=-2;k<=2;k++){g.beginPath();g.moveTo(px+k*2,gy-26);g.lineTo(px+k*5,gy-40);g.stroke()}
    for(let k=-2;k<=2;k++){g.fillStyle=['#d9a441','#efe6d0','#c8302a'][(k+2)%3];g.beginPath();g.arc(px+k*5,gy-42-Math.abs(k),3.6,0,7);g.fill()}
  }else{
    g.fillStyle='#5a4632';g.fillRect(x+T/2-3,y-20,6,2*T+20);
    g.fillStyle='#e9dfc7';const w=Math.max(70,(label||'').length*8+20);poly(g,[x+T/2-6,y-30,x+T/2-6+w,y-30,x+T/2+w+8,y-16,x+T/2-6+w,y-2,x+T/2-6,y-2]);g.fill();
    g.strokeStyle='#2a2420';g.lineWidth=1;g.stroke();
    g.fillStyle='#2a2420';g.font='11px '+F_DISP;g.textAlign='left';g.fillText(label||'',x+T/2+2,y-12);
    g.fillStyle='rgba(255,210,130,.85)';g.beginPath();g.arc(x+T/2,y-36,4,0,7);g.fill();
  }
  g.restore();
}
function drawMover(g,m){
  if(drawMechMover(g,m,G.t))return;
  g.save();
  if(m.kind==='truck'){
    const x=m.x,y=m.y,w=m.w,base=y+118;
    g.fillStyle='#1e2228';g.fillRect(x,y,w-40,110);
    const gr=g.createLinearGradient(0,y,0,y+110);gr.addColorStop(0,'#c8ccd2');gr.addColorStop(1,'#8a8e96');g.fillStyle=gr;g.fillRect(x+2,y+2,w-44,100);
    g.fillStyle='#2a4a8a';g.font='bold 18px '+F_DISP;g.textAlign='center';g.fillText('TRANSPORTS',x+(w-40)/2,y+48);g.font='12px '+F_DISP;g.fillText('MARNE · 51',x+(w-40)/2,y+68);
    g.fillStyle='#a8322d';rr(g,x+w-40,y+38,40,72,6);g.fill();g.fillStyle='rgba(180,210,230,.7)';g.fillRect(x+w-30,y+46,22,22);
    g.fillStyle='rgba(255,230,160,.95)';g.fillRect(x+w-6,y+90,6,8);
    for(const wx of[x+24,x+62,x+w-24]){g.fillStyle='#111';g.beginPath();g.arc(wx,base-6,12,0,7);g.fill();g.fillStyle='#555';g.beginPath();g.arc(wx,base-6,5,0,7);g.fill()}
    g.fillStyle='#e9e9e9';g.fillRect(x,y,w-40,3);
    g.restore();return;
  }
  if(m.axis==='v'){g.strokeStyle='#5a4a3a';g.lineWidth=2;g.beginPath();g.moveTo(m.x+6,m.y);g.lineTo(m.x+6,-20);g.moveTo(m.x+m.w-6,m.y);g.lineTo(m.x+m.w-6,-20);g.stroke()}
  g.fillStyle='#9a6d44';poly(g,[m.x,m.y,m.x+m.w,m.y,m.x+m.w+DX,m.y+DY,m.x+DX,m.y+DY]);g.fill();
  g.fillStyle='#6e4a2c';g.fillRect(m.x,m.y,m.w,m.h);
  g.fillStyle='rgba(0,0,0,.25)';for(let k=20;k<m.w;k+=20)g.fillRect(m.x+k,m.y,1.5,m.h);
  g.fillStyle='rgba(255,230,190,.3)';g.fillRect(m.x,m.y,m.w,1.5);
  if(m.axis==='h'){const sp=(m.x*.12);for(const wx of[m.x+12,m.x+m.w-12]){g.fillStyle='#222';g.beginPath();g.arc(wx,m.y+m.h+4,5,0,7);g.fill();g.strokeStyle='#888';g.lineWidth=1;g.beginPath();g.moveTo(wx,m.y+m.h+4);g.lineTo(wx+Math.cos(sp)*4,m.y+m.h+4+Math.sin(sp)*4);g.stroke()}}
  g.restore();
}
/* statue de bronze du square : un notable en redingote, tourné vers l'ouest */
function drawStatue(g,x,y,t){
  const B='#4d6b61',BL='#7c9e8e',BD='#2e443e',V='#9cc2ae';
  g.save();g.lineJoin='round';g.lineCap='round';
  // plaque du socle
  g.fillStyle='#6a5a3a';rr(g,x-26,y+18,52,22,2);g.fill();g.fillStyle='#8a7a52';rr(g,x-23,y+21,46,16,1);g.fill();
  g.fillStyle='#3a2e1a';g.font='6px '+F_DISP;g.textAlign='center';g.fillText('À NOTRE BIENFAITEUR',x,y+28);g.fillText('1841 – 1907',x,y+35);
  // dalle
  g.fillStyle='#8c8a82';g.fillRect(x-30,y-8,60,8);g.fillStyle='#a8a69e';g.fillRect(x-30,y-8,60,2);
  g.translate(x,y-8);
  const sh=(c,pts)=>{g.fillStyle=c;poly(g,pts);g.fill()};
  // jambe arrière, jambe avant
  sh(BD,[-9,-44,-1,-44,-3,-6,-12,-6]);
  sh(B,[0,-44,9,-44,10,-6,1,-6]);
  g.fillStyle=BD;rr(g,-14,-7,12,7,3);g.fill();g.fillStyle=B;rr(g,0,-7,15,7,3);g.fill();
  // bras arrière tenant le chapeau haut-de-forme
  sh(BD,[-12,-84,-6,-82,-12,-52,-18,-54]);
  g.fillStyle=BD;rr(g,-24,-56,13,15,2);g.fill();g.fillRect(-27,-43,19,3);
  // redingote
  g.fillStyle=B;g.beginPath();g.moveTo(-12,-88);g.lineTo(12,-88);g.lineTo(15,-60);g.quadraticCurveTo(18,-42,13,-34);g.lineTo(2,-40);g.lineTo(-3,-34);g.quadraticCurveTo(-18,-38,-17,-56);g.closePath();g.fill();
  g.fillStyle=BL;g.beginPath();g.moveTo(8,-88);g.lineTo(12,-88);g.lineTo(15,-60);g.lineTo(11,-60);g.closePath();g.fill();
  g.strokeStyle=BD;g.lineWidth=1.2;g.beginPath();g.moveTo(3,-86);g.lineTo(5,-64);g.lineTo(2,-40);g.stroke();
  g.fillStyle=BD;for(const yy of[-78,-70,-62]){g.beginPath();g.arc(6,yy,1.3,0,7);g.fill()}
  // col
  sh(BL,[-5,-90,5,-90,7,-84,0,-80,-7,-84]);
  // bras avant replié, main sur la poitrine avec un rouleau
  g.strokeStyle=B;g.lineWidth=7;g.beginPath();g.moveTo(8,-84);g.lineTo(14,-68);g.lineTo(4,-70);g.stroke();
  g.fillStyle=BL;g.save();g.translate(3,-72);g.rotate(-.5);rr(g,-3,-12,6,20,3);g.fill();g.fillStyle=BD;g.fillRect(-3,-12,6,2);g.restore();
  g.fillStyle=B;g.beginPath();g.arc(6,-70,3.6,0,7);g.fill();
  // tête de profil, favoris, regard vers la droite
  g.fillStyle=B;g.beginPath();g.ellipse(1,-99,8,9.5,0,0,7);g.fill();
  sh(B,[7,-102,12,-97,7,-95]);
  g.fillStyle=BD;g.beginPath();g.ellipse(-3,-95,4,6,0,0,7);g.fill();
  g.fillStyle=BD;g.beginPath();g.ellipse(0,-106,8,4,0,Math.PI,0);g.fill();
  g.fillStyle=BL;g.beginPath();g.ellipse(4,-102,3,4,0,0,7);g.fill();
  g.strokeStyle=BD;g.lineWidth=1;g.beginPath();g.moveTo(4,-100);g.lineTo(7,-100);g.stroke();
  // coulures de vert-de-gris
  g.strokeStyle='rgba(156,194,174,.55)';g.lineWidth=1.5;for(const[xx,y0,l]of[[-8,-80,24],[10,-56,14],[-2,-92,10],[12,-30,18]]){g.beginPath();g.moveTo(xx,y0);g.lineTo(xx+.5,y0+l);g.stroke()}
  // fientes
  g.fillStyle='#ecebe4';for(const[xx,yy,l]of[[-6,-108,5],[1,-109,7],[9,-88,8],[-11,-86,4]]){g.beginPath();g.ellipse(xx,yy,2.4,1.4,0,0,7);g.fill();g.fillRect(xx-.7,yy,1.4,l)}
  // un pigeon vivant, perché sur la tête
  g.save();g.translate(1,-110);const bob=Math.sin(t*2.2)>0.85?-1.5:0;
  g.fillStyle='#8a92a2';g.beginPath();g.ellipse(0,-5,7,4.5,0,0,7);g.fill();
  g.fillStyle='#6a7282';poly(g,[-6,-6,-13,-8,-12,-3,-6,-3]);g.fill();
  g.fillStyle='#9aa2b2';g.beginPath();g.arc(-5+0,-10+bob,3.4,0,7);g.fill();
  g.fillStyle='#4f8a7a';g.beginPath();g.arc(-4,-7.5,2.5,0,Math.PI);g.fill();
  g.fillStyle='#e8a050';poly(g,[-8.2,-10+bob,-11,-9.4+bob,-8.2,-8.8+bob]);g.fill();
  g.fillStyle='#111';g.beginPath();g.arc(-6,-10.6+bob,.8,0,7);g.fill();
  g.strokeStyle='#b4454c';g.lineWidth=1;g.beginPath();g.moveTo(-1,-1);g.lineTo(-1,1);g.moveTo(2,-1);g.lineTo(2,1);g.stroke();
  g.restore();
  g.restore();
}
/* mammouth laineux en plâtre peint (reconstitution de musée) */
function drawMammoth(g,x,floor,t){
  const fy=floor-24,R=mulberry(313);
  g.save();
  // socle
  g.fillStyle='#3a2416';g.fillRect(x-230,fy,470,24);g.fillStyle='#5a3a24';g.fillRect(x-238,fy-6,486,8);
  g.fillStyle='rgba(255,230,180,.12)';g.fillRect(x-238,fy-6,486,2);
  g.fillStyle='#d9cfb4';rr(g,x-70,fy+4,140,15,2);g.fill();g.fillStyle='#3a2a20';g.font='8px '+F_BODY;g.textAlign='center';
  g.fillText('MAMMOUTH LAINEUX · reconstitution, plâtre, 1931',x,fy+14);
  const fur='#5e3f27',furL='#7d5636',furD='#3f2918',far='#4a311e';
  // pattes du fond
  const leg=(lx,c)=>{g.fillStyle=c;g.beginPath();g.moveTo(lx-22,fy-130);g.lineTo(lx+22,fy-130);g.lineTo(lx+20,fy-8);g.quadraticCurveTo(lx,fy+2,lx-20,fy-8);g.closePath();g.fill();
    g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(lx,fy-4,19,5,0,0,7);g.fill();
    g.fillStyle='#cdbf9e';for(let k=-2;k<=2;k++){g.beginPath();g.ellipse(lx+k*7,fy-5,3,2.2,0,0,7);g.fill()}};
  leg(x-120,far);leg(x+95,far);
  // défense du fond
  g.fillStyle='#bfb294';g.beginPath();g.moveTo(x+150,fy-168);g.bezierCurveTo(x+215,fy-140,x+262,fy-175,x+252,fy-235);g.lineTo(x+244,fy-232);g.bezierCurveTo(x+246,fy-185,x+210,fy-160,x+148,fy-180);g.closePath();g.fill();
  // corps
  const body=new Path2D();
  body.moveTo(x-178,fy-118);
  body.bezierCurveTo(x-200,fy-160,x-190,fy-215,x-150,fy-228);
  body.bezierCurveTo(x-80,fy-250,x-10,fy-268,x+50,fy-276);
  body.bezierCurveTo(x+95,fy-300,x+150,fy-292,x+165,fy-262);
  body.bezierCurveTo(x+182,fy-232,x+186,fy-200,x+176,fy-176);
  body.bezierCurveTo(x+168,fy-150,x+140,fy-130,x+120,fy-120);
  body.bezierCurveTo(x+40,fy-100,x-90,fy-98,x-178,fy-118);
  const gr=g.createLinearGradient(0,fy-290,0,fy-100);gr.addColorStop(0,furL);gr.addColorStop(.55,fur);gr.addColorStop(1,furD);
  g.fillStyle=gr;g.fill(body);
  g.save();g.clip(body);
  // mèches de fourrure
  g.lineCap='round';
  for(let i=0;i<190;i++){const px=x-185+R()*370,py=fy-280+R()*170,l=8+R()*16;g.strokeStyle=R()<.5?'rgba(40,24,12,.35)':'rgba(150,108,70,.28)';g.lineWidth=1.4+R()*1.6;g.beginPath();g.moveTo(px,py);g.quadraticCurveTo(px+3,py+l*.6,px+1,py+l);g.stroke()}
  // ombre du ventre, lumière du dos
  g.fillStyle='rgba(20,10,4,.25)';g.beginPath();g.ellipse(x-10,fy-102,200,26,0,0,7);g.fill();
  g.fillStyle='rgba(255,220,170,.10)';g.beginPath();g.ellipse(x,fy-262,150,18,-.12,0,7);g.fill();
  g.restore();
  // frange de poils sous le ventre
  for(let i=0;i<60;i++){const px=x-170+i*5.2+R()*3,py=fy-112+Math.sin(i*.3)*6,l=12+R()*18;g.strokeStyle=i%3?fur:furD;g.lineWidth=3;g.beginPath();g.moveTo(px,py-6);g.quadraticCurveTo(px+2,py+l*.5,px-1+Math.sin(t*.8+i)*.6,py+l);g.stroke()}
  // pattes de devant
  leg(x-70,fur);leg(x+140,fur);
  for(const lx of[x-70,x+140])for(let k=0;k<7;k++){g.strokeStyle=furD;g.lineWidth=2.6;g.beginPath();const px=lx-18+k*6;g.moveTo(px,fy-128);g.quadraticCurveTo(px+2,fy-100,px-1,fy-78-R()*10);g.stroke()}
  // une écaille de plâtre sur la patte
  g.fillStyle='#e6dcc4';poly(g,[x-80,fy-60,x-66,fy-66,x-62,fy-52,x-74,fy-48]);g.fill();
  // queue
  g.strokeStyle=furD;g.lineWidth=4;g.beginPath();g.moveTo(x-182,fy-170);g.quadraticCurveTo(x-200,fy-140,x-196,fy-118);g.stroke();
  g.fillStyle=furD;g.beginPath();g.ellipse(x-196,fy-114,5,9,0,0,7);g.fill();
  // oreille, oeil
  g.fillStyle=furD;g.beginPath();g.ellipse(x+108,fy-222,16,22,.25,0,7);g.fill();
  g.fillStyle='#1a1008';g.beginPath();g.ellipse(x+146,fy-226,4.5,3.5,.2,0,7);g.fill();
  g.fillStyle='rgba(255,240,210,.85)';g.beginPath();g.arc(x+147.5,fy-227.5,1.3,0,7);g.fill();
  g.strokeStyle='rgba(30,16,6,.5)';g.lineWidth=1.5;g.beginPath();g.arc(x+146,fy-226,8,Math.PI*1.1,Math.PI*1.8);g.stroke();
  // trompe
  g.strokeStyle=fur;g.lineWidth=22;g.lineCap='round';g.beginPath();g.moveTo(x+172,fy-185);g.bezierCurveTo(x+192,fy-140,x+178,fy-90,x+190,fy-56);g.stroke();
  g.lineWidth=14;g.beginPath();g.moveTo(x+190,fy-60);g.quadraticCurveTo(x+196,fy-34,x+212,fy-40);g.stroke();
  g.strokeStyle='rgba(30,16,6,.35)';g.lineWidth=1.4;for(let k=0;k<9;k++){const yy=fy-170+k*13;g.beginPath();g.moveTo(x+170+k*1.6,yy);g.lineTo(x+192+k*.4,yy+3);g.stroke()}
  // défense de devant (ivoire)
  const ig=g.createLinearGradient(x+150,fy-180,x+270,fy-260);ig.addColorStop(0,'#cfc2a0');ig.addColorStop(.5,'#efe6cf');ig.addColorStop(1,'#d8cdb0');
  g.fillStyle=ig;g.beginPath();g.moveTo(x+158,fy-160);g.bezierCurveTo(x+235,fy-120,x+300,fy-160,x+284,fy-246);g.lineTo(x+274,fy-244);g.bezierCurveTo(x+282,fy-176,x+228,fy-146,x+156,fy-178);g.closePath();g.fill();
  g.strokeStyle='rgba(90,70,40,.35)';g.lineWidth=1;g.stroke();
  // étiquette d'enchères pendue à la défense
  g.strokeStyle='#8a7a5a';g.lineWidth=1;g.beginPath();g.moveTo(x+262,fy-150);g.lineTo(x+262,fy-128);g.stroke();
  g.save();g.translate(x+262,fy-116);g.rotate(Math.sin(t*1.3)*.08);g.fillStyle='#e9dfc7';rr(g,-22,-10,44,20,2);g.fill();
  g.fillStyle='#a8322d';g.font='8px '+F_DISP;g.textAlign='center';g.fillText('LOT N° 3',0,3);g.restore();
  g.restore();
}
/* la cloche de Raymond, identique sur l'écran-titre et dans la réserve */
function drawDome(g,x,y,s,t,o){
  o=o||{};
  g.save();g.translate(x,y);
  g.fillStyle='#3a2416';rr(g,-90*s,0,180*s,26*s,6*s);g.fill();g.fillStyle='#5a3a24';rr(g,-100*s,-10*s,200*s,14*s,5*s);g.fill();
  g.fillStyle='rgba(255,220,170,.18)';g.fillRect(-98*s,-9*s,196*s,2*s);
  g.fillStyle='#e9dfc7';g.fillRect(-74*s,6*s,148*s,14*s);g.fillStyle='#2a2420';g.font='italic '+(9.5*s)+'px '+F_BODY;g.textAlign='center';g.fillText('Columba livia · Raymond · 1916',0,16*s);
  if(!o.noBird)drawRaymond(g,0,-10*s,{f:1,t,walk:0,wear:0,size:3.2*s,eyeClosed:!o.eyeOpen});
  g.lineWidth=Math.max(1,2*s);
  if(o.broken){
    g.fillStyle='rgba(190,215,230,.12)';g.strokeStyle='rgba(220,235,245,.45)';
    poly(g,[-80*s,-10*s,-80*s,-70*s,-64*s,-42*s,-52*s,-96*s,-36*s,-30*s,-20*s,-10*s]);g.fill();g.stroke();
    poly(g,[80*s,-10*s,80*s,-54*s,66*s,-88*s,58*s,-40*s,44*s,-62*s,30*s,-10*s]);g.fill();g.stroke();
  }else{
    g.fillStyle='rgba(190,215,230,.08)';g.strokeStyle='rgba(220,235,245,.35)';
    g.beginPath();g.moveTo(-80*s,-10*s);g.lineTo(-80*s,-130*s);g.arc(0,-130*s,80*s,Math.PI,0);g.lineTo(80*s,-10*s);g.closePath();g.fill();g.stroke();
    g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=5*s;g.beginPath();g.arc(0,-130*s,66*s,Math.PI*1.12,Math.PI*1.45);g.stroke();
    g.lineWidth=3*s;g.beginPath();g.moveTo(-64*s,-120*s);g.lineTo(-64*s,-40*s);g.stroke();
  }
  g.restore();
}
const DOME_S=0.36,PLINTH_H=46;
function domeGeom(d){const top=d.floor-PLINTH_H;const oy=top-26*DOME_S;return{top,oy,feet:oy-10*DOME_S,domeTop:oy-210*DOME_S}}
function drawPlinth(g,x,top,floor){
  g.fillStyle='#bfb6a2';g.fillRect(x-20,top+6,40,floor-top-12);
  g.fillStyle='#d6cdb8';g.fillRect(x-26,top,52,7);g.fillRect(x-26,floor-7,52,7);
  g.fillStyle='rgba(0,0,0,.15)';g.fillRect(x+8,top+6,12,floor-top-12);g.fillStyle='rgba(255,255,255,.15)';g.fillRect(x-18,top+6,3,floor-top-12);
}
function drawArmoire(g,x,floor,shake,doorOpen){
  g.save();g.translate(x,floor);g.rotate(shake);
  g.fillStyle='#4a2e1a';g.fillRect(-36,-190,72,190);g.fillStyle='#5a3a22';g.fillRect(-40,-198,80,10);g.fillRect(-38,-8,76,8);
  g.fillStyle='#3a2414';g.fillRect(-32,-180,30,166);g.fillRect(2,-180,30,166);
  g.strokeStyle='rgba(255,220,170,.15)';g.lineWidth=2;g.strokeRect(-28,-172,22,70);g.strokeRect(6,-172,22,70);g.strokeRect(-28,-96,22,70);g.strokeRect(6,-96,22,70);
  g.fillStyle='#c9a35a';g.beginPath();g.arc(-5,-100,2.5,0,7);g.arc(5,-100,2.5,0,7);g.fill();
  if(doorOpen){g.fillStyle='#3a2414';poly(g,[2,-180,30+doorOpen*18,-176,30+doorOpen*18,-18,2,-14]);g.fill()}
  g.restore();
}
function drawCarton(g,c){
  g.save();g.translate(c.x,c.y);g.rotate(c.rot);
  g.fillStyle='#b08a5a';g.fillRect(-24,-20,48,40);g.fillStyle='#c9a06b';poly(g,[-24,-20,24,-20,30,-26,-18,-26]);g.fill();
  g.fillStyle='rgba(230,210,160,.6)';g.fillRect(-4,-20,8,40);
  g.save();g.rotate(-.15);g.fillStyle='rgba(160,40,30,.85)';g.font='bold 9px '+F_DISP;g.textAlign='center';g.fillText('FRAGILE',0,4);g.restore();
  g.restore();
}
/* décors */
function drawDecor(g,d,t){
  if(d.t==='lamp'){
    g.strokeStyle='#2a221c';g.lineWidth=1.5;g.beginPath();g.moveTo(d.x,-30);g.lineTo(d.x,d.y-10);g.stroke();
    g.fillStyle='#6a5a3a';poly(g,[d.x-18,d.y+6,d.x-6,d.y-10,d.x+6,d.y-10,d.x+18,d.y+6]);g.fill();
    g.fillStyle='#a88a4a';g.fillRect(d.x-18,d.y+4,36,3);
    g.fillStyle='rgba(255,225,160,.95)';g.beginPath();g.arc(d.x,d.y+10,5,0,7);g.fill();
  }else if(d.t==='lantern'){
    g.fillStyle='#4a3a2a';g.fillRect(d.x-2,d.y-4,4,13*T-d.y+4);g.fillRect(d.x-2,d.y-6,16,3);
    g.strokeStyle='#2a2420';g.lineWidth=1;g.beginPath();g.moveTo(d.x+12,d.y-4);g.lineTo(d.x+12,d.y+2);g.stroke();
    g.fillStyle='#2a2420';rr(g,d.x+5,d.y+2,14,18,3);g.fill();g.fillStyle='rgba(255,210,130,'+(.85+Math.sin(t*9+d.x)*.08)+')';g.fillRect(d.x+8,d.y+5,8,12);
  }else if(d.t==='sign'||d.t==='board'){
    if(!d.text)return;
    // titre en grand, précision en petit dessous
    const [main,sub]=d.text.split('|');const sign=d.t==='sign';
    g.font=(sign?'13px ':'12px ')+F_DISP;const w1=g.measureText(main).width;
    g.font='italic 10px '+F_BODY;const w2=sub?g.measureText(sub).width:0;
    const w=Math.max(w1,w2)+26,h=sub?34:24,top=d.y-14;
    if(sign){g.strokeStyle='#2a221c';g.lineWidth=1;g.beginPath();g.moveTo(d.x-w/2+18,top);g.lineTo(d.x,top-44);g.lineTo(d.x+w/2-18,top);g.stroke();
      g.fillStyle='#24452f';rr(g,d.x-w/2,top,w,h,3);g.fill();g.strokeStyle='rgba(233,223,199,.85)';g.lineWidth=1;rr(g,d.x-w/2+3,top+3,w-6,h-6,2);g.stroke();g.fillStyle='#e9dfc7'}
    else{g.fillStyle='#4a3a2a';g.fillRect(d.x-w/2+10,top+h,4,2*T-h+14);g.fillRect(d.x+w/2-14,top+h,4,2*T-h+14);
      g.fillStyle='#e9dfc7';rr(g,d.x-w/2,top,w,h,2);g.fill();g.strokeStyle='#a8322d';g.lineWidth=2;rr(g,d.x-w/2+3,top+3,w-6,h-6,2);g.stroke();g.fillStyle='#2a2420'}
    g.textAlign='center';g.font=(sign?'13px ':'12px ')+F_DISP;g.fillText(main,d.x,top+(sub?15:16));
    if(sub){g.font='italic 10px '+F_BODY;g.globalAlpha*=.85;g.fillText(sub,d.x,top+27);g.globalAlpha/=.85}
  }else if(d.t==='mammoth'){
    drawMammoth(g,d.x,d.floor||d.y+100,t);
  }else if(d.t==='clock'){
    const x=d.x,y=d.y;g.fillStyle='#5a3a22';rr(g,x-30,y-30,60,140,8);g.fill();
    g.fillStyle='#efe6d0';g.beginPath();g.arc(x,y,22,0,7);g.fill();g.strokeStyle='#2a2420';g.lineWidth=1.5;g.stroke();
    g.fillStyle='#2a2420';for(let k=0;k<12;k++){const a=k*Math.PI/6;g.fillRect(x+Math.cos(a)*17-1,y+Math.sin(a)*17-1,2,2)}
    g.lineWidth=2;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(t*.05)*12,y+Math.sin(t*.05)*12);g.moveTo(x,y);g.lineTo(x+Math.cos(t*.6)*16,y+Math.sin(t*.6)*16);g.stroke();
    const sw=Math.sin(t*3)*.35;g.save();g.translate(x,y+30);g.rotate(sw);g.strokeStyle='#c9a35a';g.lineWidth=2;g.beginPath();g.moveTo(0,0);g.lineTo(0,58);g.stroke();g.fillStyle='#d9b45a';g.beginPath();g.arc(0,62,8,0,7);g.fill();g.restore();
    if(Math.sin(t*3)*Math.sin((t-.016)*3)<0)G.tickSnd=true;
  }else if(d.t==='stove'){
    const x=d.x,y=d.y;g.fillStyle='#22201f';rr(g,x-26,y-70,52,70,6);g.fill();g.fillRect(x-6,-30,12,y-30);
    const f=.7+Math.sin(t*9)*.15+Math.sin(t*23)*.08;g.fillStyle='rgba(255,'+(110+f*60|0)+',40,'+f+')';rr(g,x-14,y-44,28,18,4);g.fill();
    g.fillStyle='#3a3836';g.fillRect(x-30,y-74,60,6);
    g.fillStyle='#5a5a5a';rr(g,x-14,y-86,28,12,3);g.fill();g.fillStyle='rgba(220,220,220,.15)';for(let k=0;k<3;k++){const ph=(t*.4+k/3)%1;g.globalAlpha=1-ph;g.beginPath();g.arc(x+Math.sin(ph*6+k)*6,y-92-ph*50,4+ph*8,0,7);g.fill()}g.globalAlpha=1;
  }else if(d.t==='bowl'){
    const x=d.x,y=d.y;g.fillStyle='#a8322d';g.beginPath();g.moveTo(x-16,y-12);g.lineTo(x+16,y-12);g.lineTo(x+12,y);g.lineTo(x-12,y);g.closePath();g.fill();
    g.fillStyle='#6a3a1a';g.beginPath();g.ellipse(x,y-12,15,3,0,0,7);g.fill();
    g.fillStyle='#e9dfc7';g.font='7px '+F_DISP;g.textAlign='center';g.fillText('BIJOU',x,y-3);
  }else if(d.t==='bell'){
    const sw=Math.sin(t*2.2+d.ph)*.18*(1+d.ring*2);g.save();g.translate(d.x,d.y-100);
    g.fillStyle='#3a2a1a';g.fillRect(-60,-8,120,12);g.rotate(sw);
    const gr=g.createLinearGradient(-40,0,40,0);gr.addColorStop(0,'#6a4a1a');gr.addColorStop(.4,'#c9a24a');gr.addColorStop(1,'#5a3a14');g.fillStyle=gr;
    g.beginPath();g.moveTo(-14,10);g.quadraticCurveTo(-22,40,-34,90);g.lineTo(34,90);g.quadraticCurveTo(22,40,14,10);g.closePath();g.fill();
    g.fillStyle='#3a2a14';g.fillRect(-36,86,72,6);g.beginPath();g.arc(0,96,7,0,7);g.fill();g.restore();
  }else if(d.t==='statue'){
    drawStatue(g,d.x,d.y,t);
  }else if(d.t==='garland'){
    g.strokeStyle='rgba(40,30,30,.7)';g.lineWidth=1.2;g.beginPath();for(let k=0;k<=20;k++){const xx=d.x+k*d.w/20;g.lineTo(xx,d.y+Math.sin(k/20*Math.PI)*40)}g.stroke();
    for(let k=1;k<20;k+=2){const xx=d.x+k*d.w/20,yy=d.y+Math.sin(k/20*Math.PI)*40;g.fillStyle=['#c8302a','#e0b030','#3a6aa8','#e9dfc7'][k%4];g.beginPath();g.ellipse(xx,yy+8,6,8,0,0,7);g.fill();g.fillStyle='rgba(255,220,150,.3)';g.beginPath();g.arc(xx,yy+8,12,0,7);g.fill()}
  }
}
