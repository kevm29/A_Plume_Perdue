/* =========================================================
   PERSONNAGES, CRÉATURES ET OBJETS ANIMÉS
   ========================================================= */
function drawRaymond(g,x,y,o){
  const d=o.wear||0,t=o.t||0,w=o.walk||0;
  g.save();g.translate(x,y);if(o.rot)g.rotate(o.rot);g.scale((o.f||1)*(o.sx||1),o.sy||1);
  if(o.size)g.scale(o.size,o.size);
  const step=Math.sin(t*15)*w,air=o.air;
  const hb=air?0:Math.sin(t*15)*2.6*w;
  const bob=air?0:Math.abs(Math.sin(t*15))*1.2*w;
  const breathe=air||w>.1?0:Math.sin(t*2.4)*.5;
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
  g.fillStyle=ng;g.beginPath();g.ellipse(7,-21,6,7,.3,0,7);g.fill();
  g.fillStyle='#929bad';g.beginPath();g.arc(9.5,-28,6,0,7);g.fill();
  if(d>=5){g.fillStyle='#ede4cf';g.save();g.translate(9,-32);g.rotate(-.3);rr(g,-6,-1.8,12,3.6,1.5);g.fill();g.restore()}
  g.fillStyle='#3a3836';poly(g,[14.5,-29.3,20,-27.6,14.5,-26.4]);g.fill();
  g.fillStyle='#efe9df';g.beginPath();g.ellipse(14.7,-29,1.9,1.3,0,0,7);g.fill();
  if(d>=7){g.fillStyle='#5a3a24';g.beginPath();g.arc(11,-29.5,2.8,0,7);g.fill();g.fillStyle='#2a1a10';for(const[a,b]of[[-1,-1],[1,-1],[-1,1],[1,1]]){g.beginPath();g.arc(11+a*.9,-29.5+b*.9,.5,0,7);g.fill()}g.strokeStyle='#e9dfc7';g.lineWidth=.6;g.beginPath();g.moveTo(10,-30.5);g.lineTo(12,-28.5);g.moveTo(12,-30.5);g.lineTo(10,-28.5);g.stroke()}
  else{g.fillStyle='#d97a2a';g.beginPath();g.arc(11,-29.5,2.7,0,7);g.fill();g.fillStyle='#f4ecd8';g.beginPath();g.arc(11,-29.5,1.7,0,7);g.fill();
    if(o.eyeClosed){g.strokeStyle='#2a2830';g.lineWidth=1.2;g.beginPath();g.moveTo(8.6,-29.2);g.quadraticCurveTo(11,-27.8,13.4,-29.2);g.stroke()}
    else{g.fillStyle='#111';g.beginPath();g.arc(12,-30.4,1.05,0,7);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(10.3,-30.6,.6,0,7);g.fill()}}
  g.restore();
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
  o=o||{};g.save();g.translate(x,y);g.scale(o.f||1,1);
  const st=Math.sin(t*(o.run?16:7))*(o.walk||0);
  g.strokeStyle='#1a1a22';g.lineWidth=7;g.lineCap='round';
  g.beginPath();g.moveTo(-5,-44);g.lineTo(-5+st*8,0);g.moveTo(5,-44);g.lineTo(5-st*8,0);g.stroke();
  g.fillStyle='#22242c';rr(g,-13,-92,26,52,8);g.fill();
  g.strokeStyle='#22242c';g.lineWidth=6;g.beginPath();g.moveTo(-10,-84);g.lineTo(o.reach?-4:-16,o.reach?-118:-56);g.moveTo(10,-84);g.lineTo(o.reach?14:22,o.reach?-116:-60);g.stroke();
  g.fillStyle='#c9a88a';g.beginPath();g.arc(0,-102,10,0,7);g.fill();
  g.fillStyle='#1a1a22';rr(g,-11,-116,22,12,5);g.fill();g.fillRect(-11,-108,22,3);
  g.fillStyle='#111';g.fillRect(-8,-103,16,4);g.fillStyle='#e9dfc7';g.fillRect(-6,-102,4,2);g.fillRect(2,-102,4,2);
  if(o.lamp){g.fillStyle='#3a3a3a';g.fillRect(18,-62,10,5)}
  g.restore();
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
    g.fillStyle='#9a968e';rr(g,x-24,y-10,T+48,2*T+10,8);g.fill();
    g.fillStyle='#b4b0a6';g.beginPath();g.ellipse(x+T/2,y-10,T/2+24,22,0,Math.PI,0);g.fill();
    g.fillStyle='#3a3a3e';g.fillRect(x+T/2-2,y-52,4,24);g.fillRect(x+T/2-10,y-46,20,4);
    g.fillStyle='rgba(30,30,34,.75)';g.font='10px '+F_DISP;g.textAlign='center';g.fillText('VASSEUR',x+T/2,y+20);g.font='italic 9px '+F_BODY;g.fillText('famille',x+T/2,y+32);
    for(let k=0;k<6;k++){g.fillStyle=['#c8302a','#e9dfc7','#d9a441'][k%3];g.beginPath();g.arc(x-14+k*13,y+2*T-4,4,0,7);g.fill()}
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
  }else if(d.t==='sign'){
    g.font='12px '+F_DISP;const w=g.measureText(d.text).width+28;
    g.strokeStyle='#2a221c';g.lineWidth=1;g.beginPath();g.moveTo(d.x-w/2+20,d.y-14);g.lineTo(d.x,d.y-60);g.lineTo(d.x+w/2-20,d.y-14);g.stroke();
    g.fillStyle='#24452f';rr(g,d.x-w/2,d.y-14,w,26,3);g.fill();g.strokeStyle='#e9dfc7';g.lineWidth=1;rr(g,d.x-w/2+3,d.y-11,w-6,20,2);g.stroke();
    g.fillStyle='#e9dfc7';g.textAlign='center';g.fillText(d.text,d.x,d.y+4);
  }else if(d.t==='board'){
    if(!d.text)return;
    g.font='11px '+F_DISP;const w=g.measureText(d.text).width+24;
    g.fillStyle='#4a3a2a';g.fillRect(d.x-w/2+10,d.y+6,4,2*T-6);g.fillRect(d.x+w/2-14,d.y+6,4,2*T-6);
    g.fillStyle='#e9dfc7';rr(g,d.x-w/2,d.y-14,w,24,2);g.fill();g.strokeStyle='#a8322d';g.lineWidth=2;rr(g,d.x-w/2+3,d.y-11,w-6,18,2);g.stroke();
    g.fillStyle='#2a2420';g.textAlign='center';g.fillText(d.text,d.x,d.y+2);
  }else if(d.t==='mammoth'){
    const x=d.x,y=d.y;g.save();
    g.strokeStyle='#cfc3a6';g.lineCap='round';
    g.lineWidth=9;for(const[lx,ty]of[[-170,80],[-130,40],[60,-20],[100,-40]]){g.beginPath();g.moveTo(x+lx,y+ty);g.lineTo(x+lx+6,y+108);g.stroke()}
    g.lineWidth=4;for(let k=0;k<9;k++){const rx=x-120+k*24,ry=y-50-k*14;g.beginPath();g.moveTo(rx,ry);g.quadraticCurveTo(rx+16,ry+60,rx+4,ry+86-k*4);g.stroke()}
    g.fillStyle='#d6caae';g.beginPath();g.ellipse(x+190,y-110,40,32,.3,0,7);g.fill();
    g.fillStyle='#3a2a28';g.beginPath();g.arc(x+200,y-118,7,0,7);g.fill();
    g.strokeStyle='#e8dfc6';g.lineWidth=10;g.beginPath();g.moveTo(x+210,y-90);g.bezierCurveTo(x+260,y-20,x+300,y-60,x+270,y-120);g.stroke();
    g.fillStyle='#e9dfc7';g.save();g.translate(x+120,y+20);g.rotate(.2);g.fillRect(-30,-9,60,18);g.fillStyle='#a8322d';g.font='9px '+F_DISP;g.textAlign='center';g.fillText('LOT N° 3',0,4);g.restore();
    g.restore();
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
    const x=d.x,y=d.y;g.fillStyle='#6a7a74';
    g.beginPath();g.ellipse(x,y-18,12,18,0,0,7);g.fill();g.beginPath();g.arc(x,y-44,9,0,7);g.fill();
    g.strokeStyle='#6a7a74';g.lineWidth=5;g.lineCap='round';g.beginPath();g.moveTo(x+8,y-30);g.lineTo(x+26,y-50);g.stroke();
    g.fillStyle='rgba(255,255,255,.18)';g.beginPath();g.ellipse(x-4,y-20,4,14,0,0,7);g.fill();
    g.fillStyle='#e9e9e4';g.beginPath();g.ellipse(x+2,y-53,6,3,0,0,7);g.fill();
  }else if(d.t==='garland'){
    g.strokeStyle='rgba(40,30,30,.7)';g.lineWidth=1.2;g.beginPath();for(let k=0;k<=20;k++){const xx=d.x+k*d.w/20;g.lineTo(xx,d.y+Math.sin(k/20*Math.PI)*40)}g.stroke();
    for(let k=1;k<20;k+=2){const xx=d.x+k*d.w/20,yy=d.y+Math.sin(k/20*Math.PI)*40;g.fillStyle=['#c8302a','#e0b030','#3a6aa8','#e9dfc7'][k%4];g.beginPath();g.ellipse(xx,yy+8,6,8,0,0,7);g.fill();g.fillStyle='rgba(255,220,150,.3)';g.beginPath();g.arc(xx,yy+8,12,0,7);g.fill()}
  }
}
