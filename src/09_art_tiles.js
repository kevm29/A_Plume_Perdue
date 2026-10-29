/* =========================================================
   TUILES (précalculées avec les objets du fond)
   ========================================================= */
const MAT={
  X:{carton:['#a9824f','#c79d63','#7f6038'],sandbag:['#8a7a5a','#a8987a','#6a5a40'],brick:['#7a3a2a','#9a5a3a','#5a2a1e'],luggage:['#6a3a2a','#8a5a3a','#4a2a1e'],
     bench:['#2f4a3a','#456a52','#1e3226'],barrier:['#9a968e','#b8b4ac','#78746c'],hay:['#c9a24a','#e0bc6a','#a8823a'],crate:['#6a4a2a','#8a6a44','#4a321a'],tomb:['#85857f','#a5a59f','#65655f']},
  D:{drape:['#d3cab5','#ebe4d2','#aaa18c'],hedge:['#3a5a2e','#4e7a3a','#2a4220'],stall:['#8a5a3a','#c8302a','#6a4028'],vault:['#7a7670','#9a968e','#5a5650']},
  '=':{shelf:['#7a5332','#9a6d44','#5a3c24'],duck:['#6a5236','#8a6e4a','#4a3a26'],gutter:['#5a6470','#7a8692','#3e4650'],girder:['#7a4a32','#9a6a4a','#5a3424'],
     table:['#6a5a44','#8a7a5a','#4a3e2e'],plank:['#7a5a3a','#9a7a52','#5a4028'],beam:['#5a3e26','#7a5a3a','#3e2a18']}
};
function faceTop(g,x,y,col){g.fillStyle=col;poly(g,[x,y,x+T,y,x+T+DX,y+DY,x+DX,y+DY]);g.fill()}
function faceSide(g,x,y,h,col){g.fillStyle=col;poly(g,[x+T,y,x+T+DX,y+DY,x+T+DX,y+h+DY,x+T,y+h]);g.fill()}
function matCols(ch,th){
  switch(ch){
    case'#':return[th.floor,th.floorTop,shade(th.floor,-.3)];
    case'W':return th.outdoor?[shade(th.floor,-.35),shade(th.floorTop,-.2),shade(th.floor,-.5)]:['#241a14','#33251c','#1a120d'];
    case'X':return MAT.X[th.x];
    case'D':return MAT.D[th.d];
    case'=':return MAT['='][th.shelf];
    case'B':return['#d6caae','#ece2cb','#a99c80'];
  }
  return null;
}
function buildTiles(L){
  const th=L.th,R=mulberry(L.def.seed+9);
  const wpx=L.wpx+DX+8,hpx=ROWS*T+PAD;
  const c=mk(wpx*RS,hpx*RS),g=c.getContext('2d');g.scale(RS,RS);g.translate(0,PAD);
  if(!th.outdoor){
    for(let x=60;x<L.wpx;x+=180+R()*260){if(R()<.6)cobweb(g,x,-4,40+R()*40);else{g.strokeStyle='rgba(120,100,80,.5)';g.lineWidth=1.5;g.beginPath();g.moveTo(x,-10);g.quadraticCurveTo(x+30,60+R()*40,x+70,-10);g.stroke()}}
    for(let r=11;r<ROWS;r++)for(let cc=0;cc<L.w;cc++)if(L.g[r][cc]==='#'&&!isSolid(cc,r-1)){g.fillStyle=shade(th.wains,-.1);g.fillRect(cc*T+DX,r*T+DY-9,T,9);g.fillStyle=shade(th.wains,.25);g.fillRect(cc*T+DX,r*T+DY-9,T,1.5)}
  }
  const list=th.props;let x=80+R()*120,pi=Math.floor(R()*list.length);
  while(x<L.wpx-120){
    const p=PROPS[list[pi%list.length]],w=p.w;
    const c0=Math.floor(x/T),c1=Math.floor((x+w)/T);let ok=true;
    for(let cc=c0;cc<=c1;cc++)if(tile(cc,13)!=='#'||isSolid(cc,12))ok=false;
    for(const a of L.avoid)if(a>x-50&&a<x+w+50)ok=false;
    if(ok){g.save();p.d(g,x+DX,13*T+DY,R);g.restore();pi++;x+=w+70+R()*200}else x+=40;
  }
  g.save();g.globalCompositeOperation='source-atop';g.fillStyle=rgba(th.fog,th.outdoor?.22:.28);g.fillRect(0,-PAD,wpx,hpx);g.restore();
  const sh=mk(wpx,hpx),sg=sh.getContext('2d');sg.translate(0,PAD);sg.fillStyle='#000';
  for(let r=0;r<ROWS;r++)for(let cc=0;cc<L.w;cc++){const ch=L.g[r][cc];if(SOLID.includes(ch))sg.fillRect(cc*T+10,r*T+12,T,T);else if(ch==='='||ch==='B')sg.fillRect(cc*T+10,r*T+12,T,12)}
  g.save();g.globalAlpha=th.outdoor?.38:.5;g.filter='blur(7px)';g.drawImage(sh,0,-PAD);g.restore();
  for(let r=0;r<ROWS;r++)for(let cc=0;cc<L.w;cc++){
    const ch=L.g[r][cc],x=cc*T,y=r*T,mc=matCols(ch,th);if(!mc)continue;
    if(ch==='='||ch==='B'){faceTop(g,x,y,mc[1]);if(tile(cc+1,r)!==ch)faceSide(g,x,y,12,mc[2]);continue}
    if(!isSolid(cc,r-1))faceTop(g,x,y,mc[1]);
    if(!isSolid(cc+1,r))faceSide(g,x,y,T,mc[2]);
  }
  for(let r=0;r<ROWS;r++)for(let cc=0;cc<L.w;cc++)drawTileFront(g,L.g[r][cc],cc*T,r*T,cc,r,th);
  // arête nette sous chaque face avant : rendu plus « carré »
  g.fillStyle='rgba(0,0,0,.35)';
  for(let r=0;r<ROWS;r++)for(let cc=0;cc<L.w;cc++){const ch=L.g[r][cc];if(SOLID.includes(ch)&&!isSolid(cc,r+1)&&r<ROWS-1)g.fillRect(cc*T,r*T+T-1.5,T,1.5)}
  g.save();g.globalCompositeOperation='source-atop';g.globalAlpha=.3;g.fillStyle=g.createPattern(paperC,'repeat');g.fillRect(0,-PAD,wpx,hpx);g.restore();
  return c;
}
function h01(a,b){return Math.abs((a*73856093)^(b*19349663))%1000/1000}
function drawFloor(g,x,y,cc,r,th,mc,topOpen){
  g.fillStyle=mc[0];g.fillRect(x,y,T,T);
  const t=th.type;
  if(t==='parquet'){
    g.strokeStyle='rgba(0,0,0,.28)';g.lineWidth=1;
    for(let k=0;k<4;k++){const yy=y+k*10+.5;g.beginPath();g.moveTo(x,yy);g.lineTo(x+T,yy);g.stroke();const j=((cc*37+r*11+k*23)%5)*8+4;g.beginPath();g.moveTo(x+j+.5,yy);g.lineTo(x+j+.5,yy+10);g.stroke();
      g.fillStyle='rgba(255,220,170,'+(((cc*7+k*3+r)%4)*.02)+')';g.fillRect(x,yy+1,T,9)}
  }else if(t==='stone'||t==='platform'){
    g.strokeStyle='rgba(0,0,0,.22)';g.lineWidth=1.2;
    for(let k=0;k<2;k++){const yy=y+k*20;g.strokeRect(x+((r+k)%2?-20:0)+.5,yy+.5,T,20);g.strokeRect(x+((r+k)%2?20:0)+.5,yy+.5,T,20)}
    if(t==='platform'&&topOpen){g.fillStyle='#d9b84a';g.fillRect(x,y+5,T,4)}
  }else if(t==='tomette'){
    for(let k=0;k<2;k++)for(let j=0;j<2;j++){g.fillStyle=shade(th.floor,((cc*3+r*5+k*7+j*11)%5-2)*.05);g.fillRect(x+j*20+1,y+k*20+1,18,18)}
  }else if(t==='earth'){
    g.fillStyle='rgba(0,0,0,.14)';for(let k=0;k<3;k++)g.fillRect(x,y+8+k*12+((cc+k)%3),T,2);
    for(let k=0;k<3;k++){const sx=x+h01(cc*3+k,r)*34,sy=y+6+h01(cc,r*5+k)*30;g.fillStyle='rgba(150,135,110,.35)';g.beginPath();g.ellipse(sx,sy,3+k,2,0,0,7);g.fill()}
    if(h01(cc,r)<.25){g.strokeStyle='rgba(30,20,10,.45)';g.lineWidth=1;g.beginPath();g.moveTo(x+10,y);g.quadraticCurveTo(x+16,y+14,x+8,y+26);g.stroke()}
  }else if(t==='zinc'){
    if(topOpen){g.fillStyle=mc[0];g.fillRect(x,y,T,T);g.fillStyle='rgba(255,255,255,.12)';for(let k=4;k<T;k+=10)g.fillRect(x+k,y,2,T);g.fillStyle='#3a4048';g.fillRect(x,y+T-4,T,4)}
    else{g.fillStyle=shade(th.floor,-.15);g.fillRect(x,y,T,T);g.fillStyle='rgba(0,0,0,.12)';g.fillRect(x,y+19,T,1);g.fillRect(x+((r%2)?20:0),y,1,20);g.fillRect(x+((r%2)?0:20),y+20,1,20);
      if(h01(cc,r)<.3){const lit=h01(r,cc)<.4;g.fillStyle=lit?'rgba(255,205,120,.75)':'rgba(15,18,28,.8)';g.fillRect(x+12,y+8,14,22);g.fillStyle=shade(th.floor,-.35);g.fillRect(x+10,y+30,18,3)}}
  }else if(t==='gravel'){
    for(let k=0;k<10;k++){g.fillStyle=k%2?'rgba(255,240,210,.12)':'rgba(0,0,0,.12)';g.fillRect(x+h01(cc*7+k,r)*38,y+h01(cc,r*3+k)*38,2,2)}
  }else if(t==='asphalt'||t==='deck'){
    if(topOpen){g.fillStyle=t==='deck'?'#8a8e96':'#9a968e';g.fillRect(x,y,T,7);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x,y+7,T,1.5)}
    g.fillStyle='rgba(255,255,255,.05)';for(let k=0;k<6;k++)g.fillRect(x+h01(cc*5+k,r)*38,y+10+h01(cc,r*7+k)*28,2,1);
    if(t==='deck'){g.fillStyle='rgba(0,0,0,.25)';for(let k=0;k<2;k++)for(let j=0;j<2;j++){g.beginPath();g.arc(x+8+j*24,y+14+k*16,1.6,0,7);g.fill()}g.fillRect(x+T-1,y,1,T)}
    else if(h01(cc,r)<.3){g.strokeStyle='rgba(0,0,0,.3)';g.lineWidth=1;g.beginPath();g.moveTo(x+6,y+12);g.lineTo(x+16,y+22);g.lineTo(x+12,y+34);g.stroke()}
  }else if(t==='cobble'){
    for(let k=0;k<3;k++)for(let j=0;j<3;j++){g.fillStyle=shade(th.floor,(h01(cc*3+j,r*3+k)-.5)*.18);rr(g,x+j*13+((k%2)?6:0)-3,y+k*13+1,12,11,4);g.fill()}
  }else if(t==='plank'){
    g.fillStyle='rgba(0,0,0,.25)';for(let k=0;k<4;k++)g.fillRect(x+k*10,y,1,T);g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.arc(x+5,y+6,1.2,0,7);g.arc(x+25,y+6,1.2,0,7);g.fill();
  }
  if(topOpen){
    if(t==='earth'){g.fillStyle=th.floorTop;g.fillRect(x,y,T,6);g.strokeStyle=th.floorTop;g.lineWidth=1.4;for(let k=0;k<8;k++){const gx=x+k*5+2;g.beginPath();g.moveTo(gx,y+4);g.lineTo(gx+(k%2?2:-1),y-4-(k%3)*2);g.stroke()}
      if(th.props.includes('poppies')&&h01(cc,r)<.35){g.fillStyle='#c8302a';g.beginPath();g.arc(x+h01(r,cc)*34+3,y-5,3,0,7);g.fill()}}
    else if(t!=='zinc'&&t!=='asphalt'&&t!=='deck'){g.fillStyle=mc[1];g.fillRect(x,y,T,4);g.fillStyle='rgba(255,240,210,.32)';g.fillRect(x,y,T,1);g.fillStyle='rgba(0,0,0,.28)';g.fillRect(x,y+4,T,1.5)}
  }
  if(r>=13&&th.type!=='zinc'){g.fillStyle='rgba(0,0,0,'+(r===14?.32:.12)+')';g.fillRect(x,y,T,T)}
}
function drawBlock(g,ch,x,y,cc,r,th,mc){
  const kind=ch==='X'?th.x:th.d;
  g.fillStyle=mc[0];g.fillRect(x,y,T,T);
  const below=tile(cc,r+1)===ch,above=tile(cc,r-1)===ch,left=tile(cc-1,r)===ch,right=tile(cc+1,r)===ch;
  switch(kind){
    case'carton':{
      g.fillStyle='rgba(0,0,0,.18)';g.fillRect(x,y,T,2);g.fillRect(x,y+T-2,T,2);g.fillRect(x,y,2,T);g.fillRect(x+T-2,y,2,T);
      g.fillStyle='rgba(230,210,160,.55)';g.fillRect(x+16,y,8,T);
      const v=(cc*31+r*17)%7;g.save();g.translate(x+T/2,y+T/2);
      if(v===0){g.rotate(-.18);g.fillStyle='rgba(160,40,30,.75)';g.font='bold 8px '+F_DISP;g.textAlign='center';g.fillText('FRAGILE',0,3)}
      else if(v===2){g.fillStyle='rgba(30,20,10,.6)';g.font='9px '+F_DISP;g.textAlign='center';g.fillText('↑ HAUT ↑',0,13)}
      else if(v===4){g.fillStyle='rgba(30,20,10,.55)';g.font='italic 10px '+F_BODY;g.textAlign='center';g.fillText('n° '+(10+cc%80),-1,-8)}
      else if(v===6){g.fillStyle='#e9dfc7';g.fillRect(-14,4,12,9)}
      g.restore();break}
    case'sandbag':case'hay':{
      for(let k=0;k<2;k++){const yy=y+k*20,off=((r+k)%2)?-10:10;for(let j=-1;j<2;j++){g.fillStyle=shade(mc[0],(h01(cc*3+j,r*2+k)-.5)*.16);rr(g,x+j*20+off+2,yy+2,18,17,kind==='hay'?3:7);g.fill();g.fillStyle='rgba(0,0,0,.18)';g.fillRect(x+j*20+off+2,yy+16,18,2)}}
      if(kind==='hay'){g.strokeStyle='rgba(120,80,20,.45)';g.lineWidth=1;for(let k=0;k<6;k++){g.beginPath();g.moveTo(x+k*7,y+2);g.lineTo(x+k*7+4,y+T-2);g.stroke()}g.fillStyle='#8a3a2a';g.fillRect(x,y+12,T,2);g.fillRect(x,y+28,T,2)}
      break}
    case'brick':{
      for(let k=0;k<4;k++){const yy=y+k*10;for(let j=-1;j<3;j++){g.fillStyle=shade(mc[0],(h01(cc*4+j,r*4+k)-.5)*.2);g.fillRect(x+j*20+((k%2)?10:0)+1,yy+1,18,8)}}
      if(!above){g.fillStyle='#4a4a4e';g.fillRect(x-2,y,T+4,5);g.fillStyle='#a85a3a';if(cc%2===0){g.fillRect(x+8,y-12,8,12);g.fillRect(x+22,y-9,8,9)}}
      break}
    case'luggage':{
      g.fillStyle=shade(mc[0],(h01(cc,r)-.5)*.3);rr(g,x+2,y+3,T-4,T-6,4);g.fill();g.fillStyle='#c9a35a';g.fillRect(x+16,y,8,4);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x+2,y+18,T-4,2);g.fillStyle='#e9dfc7';g.fillRect(x+6,y+8,8,6);break}
    case'bench':{
      g.fillStyle='#1e2a24';g.fillRect(x,y,T,T);g.fillStyle=mc[1];for(let k=0;k<4;k++)g.fillRect(x,y+2+k*10,T,6);break}
    case'barrier':{
      g.fillStyle=mc[0];g.fillRect(x,y,T,T);g.fillStyle='rgba(0,0,0,.15)';g.fillRect(x,y+T*.55,T,2);
      if(!above){g.fillStyle='#c8302a';for(let k=0;k<2;k++)g.fillRect(x+k*20+((cc%2)?10:0),y+6,10,6)}break}
    case'crate':{
      g.strokeStyle='#4a321a';g.lineWidth=3;g.strokeRect(x+2,y+2,T-4,T-4);g.beginPath();g.moveTo(x+3,y+3);g.lineTo(x+T-3,y+T-3);g.stroke();break}
    case'tomb':{
      g.fillStyle=mc[0];g.fillRect(x,y,T,T);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x+12,y+12,16,1.5);g.fillRect(x+10,y+18,20,1.5);g.fillRect(x+14,y+24,12,1.5);
      if(!above){g.fillStyle=mc[1];g.beginPath();g.ellipse(x+T/2,y,T/2,10,0,Math.PI,0);g.fill();g.fillStyle='#2a2a2e';g.fillRect(x+19,y-16,2,12);g.fillRect(x+15,y-12,10,2)}
      g.fillStyle='rgba(90,110,60,.35)';g.fillRect(x,y+T-6,T,6);break}
    case'drape':{
      for(let k=0;k<T;k+=2){const v=Math.sin((x+k)*.18)*.5+Math.sin((x+k)*.07)*.5;g.fillStyle=v>0?'rgba(255,255,255,'+(v*.12)+')':'rgba(60,50,30,'+(-v*.14)+')';g.fillRect(x+k,y,2,T)}
      if(!below){g.fillStyle='rgba(0,0,0,.18)';g.beginPath();g.moveTo(x,y+T-6);for(let k=0;k<=T;k+=8)g.quadraticCurveTo(x+k+4,y+T+3,x+k+8,y+T-4);g.lineTo(x+T,y+T);g.lineTo(x,y+T);g.closePath();g.fill()}
      break}
    case'hedge':{
      for(let k=0;k<7;k++){g.fillStyle=shade(mc[0],(h01(cc*7+k,r)-.5)*.3);g.beginPath();g.arc(x+h01(cc,k*3+r)*T,y+h01(k,cc+r)*T,7,0,7);g.fill()}
      if(!above){g.fillStyle=mc[1];g.fillRect(x,y,T,5)}break}
    case'stall':{
      g.fillStyle='#8a5a3a';g.fillRect(x,y,T,T);g.fillStyle='rgba(0,0,0,.25)';for(let k=0;k<4;k++)g.fillRect(x,y+k*10+8,T,1.5);
      if(!above){for(let k=0;k<4;k++){g.fillStyle=k%2?'#efe6d0':'#c8302a';g.fillRect(x+k*10,y,10,10)}g.fillStyle='rgba(0,0,0,.2)';for(let k=0;k<4;k++){g.beginPath();g.arc(x+k*10+5,y+10,5,0,Math.PI);g.fill()}
        if(cc%2===0){g.fillStyle='#a8322d';g.beginPath();g.arc(x+12,y+22,5,0,7);g.fill();g.fillStyle='#7a3a8a';g.beginPath();g.arc(x+26,y+24,4,0,7);g.fill()}}
      break}
    case'vault':{
      g.fillStyle='rgba(0,0,0,.12)';g.fillRect(x,y+19,T,1);g.fillRect(x+((r%2)?20:0),y,1,20);g.fillRect(x+((r%2)?0:20),y+20,1,20);
      if(!above&&!left){g.fillStyle=mc[1];poly(g,[x,y,x+T*1.5,y-30,x+T*3,y]);g.fill();g.fillStyle='#2a2a2e';g.fillRect(x+T*1.5-2,y-46,4,16);g.fillRect(x+T*1.5-8,y-40,16,3)}
      if(!below&&!left){g.fillStyle='#1e1e22';rr(g,x+T*1.5-12,y+T-34,24,34,8);g.fill()}
      break}
  }
}
function drawSpikes(g,ch,x,y,cc,r,th){
  const up=ch==='^',k=th.spike;const by=up?y+T-8:y;
  if(k==='pins'){
    g.fillStyle='#8a6a48';g.fillRect(x,by,T,8);
    const heads=['#b8302a','#efe6d3','#1d1a22','#b8302a','#d9a441'];
    for(let i=0;i<3;i++){const px=x+8+i*12,len=22+((cc+i*3+r)%3)*3;g.strokeStyle='#cfd3d6';g.lineWidth=1.4;g.beginPath();g.moveTo(px,up?by:by+8);g.lineTo(px,up?by-len:by+8+len);g.stroke();g.fillStyle=heads[(cc+i+r)%5];g.beginPath();g.arc(px,up?by-len:by+8+len,3.4,0,7);g.fill()}
  }else if(k==='wire'){
    const top=up?y+10:y,bot=up?y+T:y+30;
    if(up){g.fillStyle='#5a4632';g.fillRect(x+18,y+6,4,T-6)}
    g.strokeStyle='#7a7a72';g.lineWidth=1.2;
    for(let i=0;i<3;i++){g.beginPath();g.ellipse(x+7+i*13,(top+bot)/2,8,(bot-top)/2-2,0,0,7);g.stroke()}
    g.strokeStyle='#5a5a54';for(let i=0;i<8;i++){const bx=x+h01(cc*8+i,r)*T,byy=top+h01(r*8+i,cc)*(bot-top);g.beginPath();g.moveTo(bx-2,byy-2);g.lineTo(bx+2,byy+2);g.moveTo(bx+2,byy-2);g.lineTo(bx-2,byy+2);g.stroke()}
  }else if(k==='spikes'){
    g.fillStyle='#8a8e96';g.fillRect(x,by,T,5);g.strokeStyle='#c8ccd4';g.lineWidth=1.3;
    for(let i=0;i<9;i++){const px=x+3+i*4.3,a=(i-4)*.07;g.beginPath();g.moveTo(px,up?by:by+5);g.lineTo(px+Math.sin(a)*22*(up?1:-1),up?by-22:by+27);g.stroke()}
  }else if(k==='glass'){
    for(let i=0;i<5;i++){const px=x+4+i*8,h=8+((cc+i*5+r)%4)*4;g.fillStyle=i%2?'rgba(170,210,190,.75)':'rgba(200,225,235,.7)';poly(g,[px-4,y+T,px+(i%2?3:-2),y+T-h-6,px+5,y+T]);g.fill()}
    g.fillStyle='rgba(255,255,255,.5)';g.fillRect(x+12,y+T-12,1,6);
  }else if(k==='pickets'){
    g.fillStyle='#2a2a2e';g.fillRect(x,y+T-6,T,3);g.fillRect(x,y+T-22,T,2);
    for(let i=0;i<4;i++){const px=x+5+i*10;g.fillRect(px-1,y+8,3,T-8);poly(g,[px-4,y+10,px+.5,y+1,px+5,y+10]);g.fill()}
  }else if(k==='nails'){
    g.fillStyle='#6a4a2a';g.fillRect(x,by,T,8);g.strokeStyle='#9a9ea6';g.lineWidth=1.6;
    for(let i=0;i<4;i++){const px=x+6+i*9;g.beginPath();g.moveTo(px,up?by:by+8);g.lineTo(px+(i%2?1:-1),up?by-20:by+28);g.stroke()}
  }
}
function drawTileFront(g,ch,x,y,cc,r,th){
  const mc=matCols(ch,th);
  const topOpen=!isSolid(cc,r-1);
  if(ch==='#')drawFloor(g,x,y,cc,r,th,mc,topOpen);
  else if(ch==='W'){g.fillStyle=mc[0];g.fillRect(x,y,T,T);g.fillStyle='rgba(0,0,0,.3)';g.fillRect(x+8,y,2,T);g.fillRect(x+28,y,2,T)}
  else if(ch==='X'||ch==='D')drawBlock(g,ch,x,y,cc,r,th,mc);
  else if(ch==='='){
    g.fillStyle=mc[0];g.fillRect(x,y,T,12);g.fillStyle='rgba(255,230,190,.25)';g.fillRect(x,y,T,1.5);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x,y+10,T,2);
    const s=th.shelf;
    if(s==='duck'){g.fillStyle='rgba(0,0,0,.3)';for(let k=5;k<T;k+=8)g.fillRect(x+k,y,2,12)}
    else if(s==='gutter'){g.fillStyle='rgba(255,255,255,.18)';g.fillRect(x,y+3,T,2)}
    else if(s==='girder'){g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=1.5;g.beginPath();for(let k=0;k<T;k+=10){g.moveTo(x+k,y+2);g.lineTo(x+k+5,y+10);g.lineTo(x+k+10,y+2)}g.stroke();g.fillStyle='rgba(0,0,0,.4)';g.beginPath();g.arc(x+5,y+6,1.3,0,7);g.arc(x+35,y+6,1.3,0,7);g.fill()}
    else if(s==='table'){if(tile(cc-1,r)!=='='||tile(cc+1,r)!=='='){g.fillStyle=mc[2];const lx=tile(cc-1,r)!=='='?x+6:x+T-10;g.fillRect(lx,y+12,4,28)}}
    if(s==='shelf'||s==='plank'||s==='beam'){
      if(tile(cc-1,r)!=='='){g.fillStyle=mc[2];poly(g,[x+4,y+12,x+12,y+12,x+5,y+26]);g.fill()}
      if(tile(cc+1,r)!=='='){g.fillStyle=mc[2];poly(g,[x+T-12,y+12,x+T-4,y+12,x+T-5,y+26]);g.fill()}
    }
  }else if(ch==='B'){
    g.fillStyle=mc[0];rr(g,x-1,y+1,T+2,11,5);g.fill();g.fillStyle='rgba(255,255,255,.3)';g.fillRect(x,y+2,T,2);g.fillStyle=mc[2];g.fillRect(x+T/2-1,y+3,2,8);
    if(tile(cc-1,r)!=='B'||tile(cc+1,r)!=='B'){const ex=tile(cc-1,r)!=='B'?x+2:x+T-2;g.fillStyle=mc[0];g.beginPath();g.arc(ex,y+3,6,0,7);g.arc(ex,y+10,6,0,7);g.fill()}
  }else if(ch==='^'||ch==='v')drawSpikes(g,ch,x,y,cc,r,th);
  else if(ch==='p'){
    g.fillStyle='#b8862e';g.beginPath();g.moveTo(x-4,y+T);g.quadraticCurveTo(x+4,y+10,x+T/2,y+12);g.quadraticCurveTo(x+T-4,y+10,x+T+4,y+T);g.closePath();g.fill();
    g.lineWidth=1.2;
    for(let k=0;k<26;k++){const a=-Math.PI*((k*37%26)/26),l=6+(k*13%9);const sx=x+4+(k*17%32),sy=y+16+(k*11%20);g.strokeStyle=k%3?'#e6b955':'#a77826';g.beginPath();g.moveTo(sx,sy);g.lineTo(sx+Math.cos(a)*l,sy+Math.sin(a)*l);g.stroke()}
  }
}
