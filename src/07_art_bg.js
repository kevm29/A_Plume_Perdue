/* =========================================================
   ARRIÈRE-PLANS : intérieurs, ciels, horizons, plans moyens
   ========================================================= */
const layerCache={};
function damask(g,x,y,s){
  g.beginPath();g.moveTo(x,y-14*s);g.quadraticCurveTo(x+7*s,y-3*s,x,y+12*s);g.quadraticCurveTo(x-7*s,y-3*s,x,y-14*s);g.fill();
  g.lineWidth=1.6*s;
  for(const sx of[-1,1]){g.beginPath();g.moveTo(x,y+4*s);g.bezierCurveTo(x+sx*11*s,y-4*s,x+sx*18*s,y+6*s,x+sx*11*s,y+12*s);g.bezierCurveTo(x+sx*7*s,y+8*s,x+sx*9*s,y+5*s,x+sx*12*s,y+5*s);g.stroke();
    g.beginPath();g.moveTo(x,y-8*s);g.bezierCurveTo(x+sx*8*s,y-16*s,x+sx*14*s,y-12*s,x+sx*12*s,y-6*s);g.stroke()}
  g.beginPath();g.arc(x,y-19*s,2*s,0,7);g.arc(x,y+17*s,2*s,0,7);g.fill();
}
function butterfly(g,x,y,s,R){
  const cols=['#c9772f','#3f6fa8','#d9c25a','#8a3a5a','#5a9a7a','#e0e0d0','#b8402f'];
  const c=cols[Math.floor(R()*cols.length)],c2=cols[Math.floor(R()*cols.length)];
  g.fillStyle=c;g.beginPath();g.ellipse(x-5*s,y-3*s,6*s,4.5*s,-.5,0,7);g.ellipse(x+5*s,y-3*s,6*s,4.5*s,.5,0,7);g.fill();
  g.fillStyle=c2;g.beginPath();g.ellipse(x-4*s,y+4*s,4*s,3*s,.4,0,7);g.ellipse(x+4*s,y+4*s,4*s,3*s,-.4,0,7);g.fill();
  g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.arc(x-6*s,y-3*s,1.5*s,0,7);g.arc(x+6*s,y-3*s,1.5*s,0,7);g.fill();
  g.fillStyle='#1a1410';g.fillRect(x-.8*s,y-6*s,1.6*s,12*s);
}
function gilt(g,x,y,w,h){
  const gr=g.createLinearGradient(x,y,x+w,y+h);gr.addColorStop(0,'#b8913f');gr.addColorStop(.5,'#7a5a24');gr.addColorStop(1,'#a5823a');
  g.fillStyle=gr;g.fillRect(x-6,y-6,w+12,h+12);g.strokeStyle='rgba(255,230,160,.35)';g.lineWidth=1;g.strokeRect(x-4.5,y-4.5,w+9,h+9);
  g.strokeStyle='rgba(0,0,0,.4)';g.strokeRect(x-.5,y-.5,w+1,h+1);
}
function hangWire(g,x,y,w,rail){g.strokeStyle='rgba(20,15,10,.6)';g.lineWidth=1;g.beginPath();g.moveTo(x+w*.2,y-6);g.lineTo(x+w/2,rail);g.lineTo(x+w*.8,y-6);g.stroke();g.fillStyle='#8a6a2a';g.fillRect(x+w/2-3,rail-3,6,4)}
function portrait(g,x,y,R){
  const w=62,h=80;hangWire(g,x,y,w,64);
  g.save();const gr=g.createLinearGradient(x,y,x+w,y+h);gr.addColorStop(0,'#c09a46');gr.addColorStop(1,'#6e5020');g.fillStyle=gr;g.beginPath();g.ellipse(x+w/2,y+h/2,w/2+7,h/2+7,0,0,7);g.fill();
  g.fillStyle='#2a2018';g.beginPath();g.ellipse(x+w/2,y+h/2,w/2,h/2,0,0,7);g.fill();g.clip();
  const bg=g.createRadialGradient(x+w/2,y+h*.35,4,x+w/2,y+h/2,h*.6);bg.addColorStop(0,'#5a4a36');bg.addColorStop(1,'#1e1812');g.fillStyle=bg;g.fillRect(x,y,w,h);
  const skin=R()<.5?'#a8866a':'#b89878';
  g.fillStyle='#16120e';g.beginPath();g.ellipse(x+w/2,y+h+6,w*.48,h*.36,0,0,7);g.fill();
  g.fillStyle='#e9dfc7';poly(g,[x+w/2-8,y+h-14,x+w/2+8,y+h-14,x+w/2,y+h-4]);g.fill();
  g.fillStyle=skin;g.beginPath();g.ellipse(x+w/2,y+h*.42,11,14,0,0,7);g.fill();
  g.fillStyle='#2a1e14';g.beginPath();g.ellipse(x+w/2,y+h*.27,12,6,0,Math.PI,0);g.fill();
  const k=R();g.strokeStyle='#2a1e14';g.lineWidth=2.4;g.lineCap='round';g.beginPath();
  if(k<.6){g.moveTo(x+w/2-9,y+h*.5);g.quadraticCurveTo(x+w/2,y+h*.45,x+w/2+9,y+h*.5)}else{g.moveTo(x+w/2-6,y+h*.54);g.lineTo(x+w/2+6,y+h*.54)}
  g.stroke();if(k>.75){g.fillStyle='#2a1e14';g.beginPath();g.ellipse(x+w/2,y+h*.6,7,6,0,0,Math.PI);g.fill()}
  g.restore();
  g.fillStyle='#b8913f';g.fillRect(x+w/2-12,y+h+10,24,6);
}
function landscape(g,x,y,R){
  const w=96,h=66;hangWire(g,x,y,w,64);gilt(g,x,y,w,h);
  const sk=g.createLinearGradient(0,y,0,y+h);sk.addColorStop(0,R()<.5?'#c9b48a':'#8aa0a8');sk.addColorStop(1,'#d9c79a');g.fillStyle=sk;g.fillRect(x,y,w,h);
  g.fillStyle='#5a6a44';g.beginPath();g.moveTo(x,y+h*.6);g.quadraticCurveTo(x+w*.3,y+h*.35,x+w*.55,y+h*.6);g.quadraticCurveTo(x+w*.8,y+h*.42,x+w,y+h*.55);g.lineTo(x+w,y+h);g.lineTo(x,y+h);g.fill();
  g.fillStyle='#3e4a30';g.beginPath();g.moveTo(x,y+h*.8);g.quadraticCurveTo(x+w*.5,y+h*.62,x+w,y+h*.82);g.lineTo(x+w,y+h);g.lineTo(x,y+h);g.fill();
  if(R()<.6){g.fillStyle='#2e2a24';g.fillRect(x+w*.7,y+h*.38,3,h*.3);g.beginPath();g.arc(x+w*.7+1,y+h*.36,8,0,7);g.fill()}
}
function archWindow(g,x,y,w,h,noRad){
  g.fillStyle='#1b2630';g.beginPath();g.moveTo(x-8,y+h+8);g.lineTo(x-8,y+w/2);g.arc(x+w/2,y+w/2,w/2+8,Math.PI,0);g.lineTo(x+w+8,y+h+8);g.closePath();g.fill();
  const gr=g.createLinearGradient(0,y,0,y+h);gr.addColorStop(0,'#7f9db3');gr.addColorStop(1,'#3d5468');
  g.fillStyle=gr;g.beginPath();g.moveTo(x,y+h);g.lineTo(x,y+w/2);g.arc(x+w/2,y+w/2,w/2,Math.PI,0);g.lineTo(x+w,y+h);g.closePath();g.fill();
  g.fillStyle='rgba(230,240,250,.55)';g.beginPath();g.arc(x+w*.68,y+w*.42,w*.12,0,7);g.fill();
  g.strokeStyle='#1b2630';g.lineWidth=4;g.beginPath();g.moveTo(x+w/2,y);g.lineTo(x+w/2,y+h);for(let k=1;k<4;k++){g.moveTo(x,y+w/2+k*(h-w/2)/4);g.lineTo(x+w,y+w/2+k*(h-w/2)/4)}g.stroke();
  if(noRad)return;
  g.fillStyle='#4a1f20';for(const s of[-1,1]){const cx=s<0?x-10:x+w+10;g.beginPath();g.moveTo(cx-s*2,y-20);g.quadraticCurveTo(cx+s*20,y+h*.4,cx+s*6,y+h+14);g.lineTo(cx-s*16,y+h+14);g.quadraticCurveTo(cx-s*8,y+h*.4,cx-s*16,y-20);g.closePath();g.fill()}
  g.fillStyle='#2a1f18';g.fillRect(x-14,y+h+6,w+28,10);
  g.fillStyle='#3a3836';for(let k=0;k<Math.floor(w/9);k++){rr(g,x+4+k*9,y+h+26,7,60,3);g.fill()}g.fillRect(x+2,y+h+80,w-4,4);
}
/* ---------- intérieurs ---------- */
function buildInteriorFar(L,g,wpx,hpx,R){
  const th=L.th;
  if(th.far==='bunker'){bunkerFar(L,g,wpx,R);L.windows=[];return}
  g.fillStyle=th.wall;g.fillRect(0,0,wpx,hpx);
  if(th.far==='belfry'){
    for(let y=0;y<hpx;y+=34)for(let x=((y/34)%2)*30;x<wpx;x+=60){g.fillStyle=shade(th.wall,(R()-.5)*.12);g.fillRect(x+1,y+1,58,32)}
    L.windows=[];
    for(let x=140;x<wpx-80;x+=360+R()*120){
      g.fillStyle='#141a24';rr(g,x,120,46,170,22);g.fill();
      g.fillStyle='#3e5466';rr(g,x+8,128,30,154,15);g.fill();
      g.fillStyle='rgba(220,235,245,.6)';g.beginPath();g.arc(x+26,170,6,0,7);g.fill();
      for(let k=0;k<4;k++){g.fillStyle='#2a1e14';g.fillRect(x+4,150+k*34,38,5)}
      L.windows.push({x:x+8,y:128,w:30,h:154});
    }
    g.strokeStyle='#2a1e14';g.lineWidth=14;
    for(let x=60;x<wpx;x+=280){g.beginPath();g.moveTo(x,40);g.lineTo(x+200,420);g.stroke();g.beginPath();g.moveTo(x+200,40);g.lineTo(x,420);g.stroke()}
    g.fillStyle='#2a1e14';g.fillRect(0,30,wpx,18);g.fillRect(0,420,wpx,22);
    g.fillStyle=rgba(th.fog,.45);g.fillRect(0,0,wpx,hpx);
    return;
  }
  for(let x=0;x<wpx;x+=36){g.fillStyle=th.wall2;g.fillRect(x,0,18,hpx);g.fillStyle='rgba(0,0,0,.08)';g.fillRect(x+17,0,1,hpx)}
  g.fillStyle=th.motif;g.strokeStyle=th.motif;g.globalAlpha=.75;
  for(let y=100,k=0;y<420;y+=58,k++)for(let x=(k%2)*36;x<wpx;x+=72)damask(g,x+18,y,.8);
  g.globalAlpha=1;
  for(let k=0;k<wpx/220;k++){const x=R()*wpx,y=80+R()*300,r=40+R()*90;const gr=g.createRadialGradient(x,y,4,x,y,r);gr.addColorStop(0,'rgba(60,45,20,.26)');gr.addColorStop(.7,'rgba(60,45,20,.1)');gr.addColorStop(1,'rgba(60,45,20,0)');g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2)}
  for(let k=0;k<wpx/260;k++){const x=R()*wpx,y=60+R()*20;g.fillStyle='rgba(40,30,15,.16)';g.fillRect(x,y,2+R()*3,60+R()*200)}
  for(let k=0;k<wpx/500;k++){const x=R()*wpx,y=150+R()*200,w=30+R()*40,h=30+R()*50;
    g.fillStyle='#a8987a';g.beginPath();g.moveTo(x,y);for(let j=0;j<=6;j++)g.lineTo(x+j*w/6,y+(j%2?4:-2)+R()*3);g.lineTo(x+w,y+h);for(let j=6;j>=0;j--)g.lineTo(x+j*w/6,y+h+(j%2?-3:2));g.closePath();g.fill();
    g.fillStyle=shade(th.wall2,.1);poly(g,[x+w,y,x+w+14,y+h*.4,x+w,y+h*.6]);g.fill();g.fillStyle='rgba(0,0,0,.25)';poly(g,[x+w,y,x+w+3,y+h*.5,x+w,y+h*.6]);g.fill()}
  g.fillStyle=shade(th.wall,-.4);g.fillRect(0,0,wpx,30);
  g.fillStyle=shade(th.wall,.15);g.fillRect(0,30,wpx,4);
  g.fillStyle=shade(th.wall,-.25);for(let x=0;x<wpx;x+=14)g.fillRect(x,34,8,7);
  g.fillStyle=shade(th.wall,-.2);g.fillRect(0,41,wpx,4);
  g.fillStyle=shade(th.wall,-.3);g.fillRect(0,62,wpx,3);g.fillStyle=shade(th.wall,.12);g.fillRect(0,61,wpx,1);
  g.fillStyle=th.wains;g.fillRect(0,420,wpx,hpx-420);
  g.fillStyle=shade(th.wains,.22);g.fillRect(0,418,wpx,5);g.fillStyle=shade(th.wains,-.3);g.fillRect(0,423,wpx,3);
  for(let x=10;x<wpx;x+=120){g.strokeStyle=shade(th.wains,.18);g.lineWidth=2;g.beginPath();g.moveTo(x,560);g.lineTo(x,440);g.lineTo(x+100,440);g.stroke();g.strokeStyle=shade(th.wains,-.35);g.beginPath();g.moveTo(x+100,440);g.lineTo(x+100,560);g.lineTo(x,560);g.stroke()}
  L.windows=[];
  let x=120+R()*160;
  while(x<wpx-160){
    const kind=R();
    if(th.far==='hall'){
      g.fillStyle=shade(th.wall,-.25);g.fillRect(x-40,40,26,380);g.fillRect(x+194,40,26,380);
      g.fillStyle=shade(th.wall,-.1);g.fillRect(x-46,40,38,14);g.fillRect(x+188,40,38,14);g.fillRect(x-46,404,38,16);g.fillRect(x+188,404,38,16);
      archWindow(g,x+20,90,140,230);L.windows.push({x:x+20,y:90,w:140,h:230});
      g.fillStyle='#7a2a26';g.fillRect(x+236,50,40,150);poly(g,[x+236,200,x+256,186,x+276,200]);g.fill();
      g.fillStyle='#d9b45a';g.font='bold 18px '+F_DISP;g.textAlign='center';'MVSEE'.split('').forEach((ch,j)=>g.fillText(ch,x+256,76+j*24));
      if(R()<.6)portrait(g,x+300,150,R);
      x+=440+R()*160;continue;
    }
    if(kind<.32){archWindow(g,x,100,96,200);L.windows.push({x,y:100,w:96,h:200});x+=260+R()*200;continue}
    if(kind<.5){portrait(g,x,130,R);if(R()<.6)portrait(g,x+90,150,R);x+=220+R()*120;continue}
    if(kind<.62){landscape(g,x,140,R);x+=180+R()*120;continue}
    if(th.far==='insects'){
      for(let row=0;row<2;row++){const fx=x,fy=110+row*130;hangWire(g,fx,fy,110,64);gilt(g,fx,fy,110,84);g.fillStyle='#d8ccaa';g.fillRect(fx,fy,110,84);for(let i=0;i<6;i++)butterfly(g,fx+20+(i%3)*35,fy+24+Math.floor(i/3)*38,1.15,R);g.fillStyle='#2a2420';g.font='italic 7px '+F_BODY;g.textAlign='center';g.fillText('Lepidoptera · pl. '+(1+(x|0)%40),fx+55,fy+80)}
      x+=190+R()*120;continue;
    }
    if(th.far==='lodge'){
      const t=R();
      if(t<.5){// almanach des Postes accroché au mur, et le tableau des clefs du gardien
        g.fillStyle='#c7b48a';rr(g,x,170,46,62,2);g.fill();g.fillStyle='#4a6a7a';g.fillRect(x+5,175,36,26);g.fillStyle='#d9c79a';g.beginPath();g.arc(x+30,183,4,0,7);g.fill();g.fillStyle='#6a7a4a';g.fillRect(x+5,193,36,8);
        g.fillStyle='#2b2016';g.font='6px '+F_DISP;g.textAlign='center';g.fillText('ALMANACH',x+23,212);g.fillText('1916',x+23,222);g.fillStyle='#8a2a22';g.fillRect(x+21,164,4,7);
        g.fillStyle='#5a3a22';rr(g,x+70,180,60,44,3);g.fill();for(let i=0;i<4;i++)for(let j=0;j<2;j++){g.fillStyle='#c9a24a';g.beginPath();g.arc(x+80+i*13,190+j*18,1.6,0,7);g.fill();g.strokeStyle='#b8a46a';g.lineWidth=1.2;g.beginPath();g.moveTo(x+80+i*13,191+j*18);g.lineTo(x+80+i*13,199+j*18);g.stroke()}}
      else{g.fillStyle='#3a2a1c';g.fillRect(x,240,140,8);for(let i=0;i<5;i++){g.fillStyle=['#7a8a5a','#a8742f','#5a6a7a','#8a4a3a','#c9b27a'][i];rr(g,x+10+i*26,206,20,34,4);g.fill();g.fillStyle='rgba(233,223,199,.7)';g.fillRect(x+13+i*26,218,14,8)}}
      x+=200+R()*160;continue;
    }
    const n=2+Math.floor(R()*3);
    for(let i=0;i<n;i++){const bw=60+R()*50,bh=40+R()*40;g.fillStyle=shade('#8a6a44',-.2-R()*.2);g.fillRect(x+i*40,420-bh*(i%2?1.6:1),bw,bh*(i%2?1.6:1))}
    x+=300+R()*160;
  }
  g.fillStyle=rgba(th.fog,.45);g.fillRect(0,0,wpx,hpx);
  const vg=g.createLinearGradient(0,0,0,hpx);vg.addColorStop(0,'rgba(0,0,0,.4)');vg.addColorStop(.4,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.28)');
  g.fillStyle=vg;g.fillRect(0,0,wpx,hpx);
}
/* ---------- extérieurs ---------- */
function hills(g,wpx,base,amp,col,R,freq){
  g.fillStyle=col;g.beginPath();g.moveTo(0,600);
  const ph=R()*10,ph2=R()*10;
  for(let x=0;x<=wpx+20;x+=20)g.lineTo(x,base-Math.sin(x*freq+ph)*amp-Math.sin(x*freq*2.7+ph2)*amp*.35);
  g.lineTo(wpx+20,600);g.closePath();g.fill();
}
function deadTree(g,x,b,h,col){
  g.strokeStyle=col;g.lineCap='round';g.lineWidth=h*.06;g.beginPath();g.moveTo(x,b);g.lineTo(x+h*.05,b-h);g.stroke();
  g.lineWidth=h*.03;g.beginPath();g.moveTo(x+h*.02,b-h*.55);g.lineTo(x-h*.22,b-h*.8);g.moveTo(x+h*.04,b-h*.75);g.lineTo(x+h*.25,b-h*.95);g.moveTo(x+h*.03,b-h*.4);g.lineTo(x+h*.18,b-h*.52);g.stroke();
}
function poplar(g,x,b,h,col){g.fillStyle=col;g.beginPath();g.ellipse(x,b-h*.55,h*.12,h*.5,0,0,7);g.fill();g.fillRect(x-1.5,b-h*.1,3,h*.1)}
function roundTree(g,x,b,h,col){g.fillStyle=col;g.fillRect(x-2,b-h*.4,4,h*.4);g.beginPath();g.arc(x,b-h*.62,h*.3,0,7);g.arc(x-h*.18,b-h*.5,h*.22,0,7);g.arc(x+h*.2,b-h*.5,h*.22,0,7);g.fill()}
function cypress(g,x,b,h,col){g.fillStyle=col;g.beginPath();g.moveTo(x,b-h);g.quadraticCurveTo(x+h*.16,b-h*.5,x+h*.08,b);g.lineTo(x-h*.08,b);g.quadraticCurveTo(x-h*.16,b-h*.5,x,b-h);g.fill()}
function building(g,x,b,w,h,col,R,lit){
  g.fillStyle=col;g.fillRect(x,b-h,w,h);
  g.beginPath();g.moveTo(x-4,b-h);g.lineTo(x+w*.12,b-h-22);g.lineTo(x+w*.88,b-h-22);g.lineTo(x+w+4,b-h);g.fill();
  for(let k=0;k<2;k++){const cx=x+w*(.25+k*.5);g.fillRect(cx-5,b-h-36,10,16)}
  const cols=Math.floor(w/22),rows=Math.floor((h-20)/30);
  for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){const wx=x+8+i*22,wy=b-h+14+j*30;const on=lit&&R()<lit;g.fillStyle=on?'rgba(255,205,120,.85)':'rgba(0,0,0,.28)';g.fillRect(wx,wy,10,16);if(on){g.fillStyle='rgba(255,205,120,.15)';g.fillRect(wx-4,wy-4,18,24)}}
}
function cathedral(g,x,b,col,glow){
  g.fillStyle=col;
  g.fillRect(x,b-230,60,230);g.fillRect(x+110,b-230,60,230);g.fillRect(x+60,b-170,50,170);
  for(const tx of[x,x+110])for(let k=0;k<4;k++){poly(g,[tx+k*15,b-230,tx+k*15+7.5,b-252,tx+k*15+15,b-230]);g.fill()}
  poly(g,[x+60,b-170,x+85,b-205,x+110,b-170]);g.fill();
  g.fillRect(x+170,b-120,200,120);poly(g,[x+170,b-120,x+270,b-150,x+370,b-120]);g.fill();
  g.fillStyle=glow;g.beginPath();g.arc(x+85,b-120,16,0,7);g.fill();
  g.fillStyle='rgba(255,205,120,.5)';for(let k=0;k<3;k++){rr(g,x+16+k*14,b-200,6,26,3);g.fill();rr(g,x+126+k*14,b-200,6,26,3);g.fill()}
}
function church(g,x,b,col,glow){
  g.fillStyle=col;g.fillRect(x,b-90,120,90);poly(g,[x-6,b-90,x+60,b-130,x+126,b-90]);g.fill();
  g.fillRect(x+120,b-150,40,150);poly(g,[x+116,b-150,x+140,b-230,x+164,b-150]);g.fill();
  g.fillStyle=glow;rr(g,x+132,b-130,16,26,8);g.fill();g.fillRect(x+30,b-60,8,22);g.fillRect(x+80,b-60,8,22);
  g.strokeStyle=col;g.lineWidth=2;g.beginPath();g.moveTo(x+140,b-230);g.lineTo(x+140,b-246);g.moveTo(x+134,b-240);g.lineTo(x+146,b-240);g.stroke();
}
function house(g,x,b,w,h,wall,roof,R,lit){
  g.fillStyle=wall;g.fillRect(x,b-h,w,h);
  g.fillStyle=roof;poly(g,[x-6,b-h,x+w/2,b-h-w*.45,x+w+6,b-h]);g.fill();
  g.strokeStyle='rgba(40,25,15,.5)';g.lineWidth=2;g.strokeRect(x+2,b-h+2,w-4,h-4);g.beginPath();g.moveTo(x+w/2,b-h);g.lineTo(x+w/2,b);g.moveTo(x,b-h/2);g.lineTo(x+w,b-h/2);g.stroke();
  const on=lit&&R()<lit;g.fillStyle=on?'rgba(255,200,120,.85)':'rgba(0,0,0,.3)';g.fillRect(x+w*.2,b-h*.8,w*.18,h*.22);g.fillRect(x+w*.62,b-h*.8,w*.18,h*.22);
  g.fillStyle='rgba(40,25,15,.6)';g.fillRect(x+w*.4,b-h*.38,w*.2,h*.38);
}
function pylon(g,x,b,h,col){g.strokeStyle=col;g.lineWidth=2;g.beginPath();g.moveTo(x-h*.12,b);g.lineTo(x,b-h);g.lineTo(x+h*.12,b);g.moveTo(x-h*.2,b-h*.75);g.lineTo(x+h*.2,b-h*.75);g.moveTo(x-h*.14,b-h*.55);g.lineTo(x+h*.14,b-h*.55);g.moveTo(x-h*.09,b-h*.4);g.lineTo(x+h*.09,b-h*.25);g.moveTo(x+h*.09,b-h*.4);g.lineTo(x-h*.09,b-h*.25);g.stroke()}
function buildOutdoorFar(L,g,wpx,hpx,R){
  const th=L.th,sk=th.sky,hz=th.horizon;
  const gr=g.createLinearGradient(0,0,0,hpx*.75);gr.addColorStop(0,sk[0]);gr.addColorStop(.6,sk[1]);gr.addColorStop(1,sk[2]);
  g.fillStyle=gr;g.fillRect(0,0,wpx,hpx);
  if(th.stars){for(let k=0;k<wpx/6;k++){const a=.3+R()*.6;g.fillStyle='rgba(235,235,255,'+a+')';g.fillRect(R()*wpx,R()*300,R()<.1?2:1,R()<.1?2:1)}}
  if(th.celestial==='moon'){const mx=wpx*.32,my=110;const mg=g.createRadialGradient(mx,my,10,mx,my,140);mg.addColorStop(0,'rgba(220,230,255,.35)');mg.addColorStop(1,'rgba(220,230,255,0)');g.fillStyle=mg;g.fillRect(mx-140,my-140,280,280);g.fillStyle='#e8ecf2';g.beginPath();g.arc(mx,my,30,0,7);g.fill();g.fillStyle='rgba(150,160,180,.35)';g.beginPath();g.arc(mx-8,my-6,7,0,7);g.arc(mx+9,my+8,5,0,7);g.arc(mx+4,my-12,3,0,7);g.fill()}
  if(th.celestial==='sun'){const mx=wpx*.4,my=th.sunY||(hz==='turbines'?150:330);const mg=g.createRadialGradient(mx,my,10,mx,my,260);mg.addColorStop(0,'rgba(255,230,180,.6)');mg.addColorStop(1,'rgba(255,220,170,0)');g.fillStyle=mg;g.fillRect(mx-260,my-260,520,520);g.fillStyle='rgba(255,236,200,.9)';g.beginPath();g.arc(mx,my,34,0,7);g.fill()}
  for(let k=0;k<wpx/260;k++){const x=R()*wpx,y=60+R()*160,w=120+R()*200;g.fillStyle=th.weather==='rain'||th.weather==='storm'?'rgba(10,12,16,.35)':'rgba(255,255,255,.08)';g.beginPath();g.ellipse(x,y,w,14+R()*12,0,0,7);g.ellipse(x+w*.3,y-10,w*.5,12,0,0,7);g.fill()}
  const far=mix(sk[1],'#000000',.35),near=mix(sk[1],'#000000',.6);
  L.turbines=[];
  if(hz==='fields'){fieldsFar(L,g,wpx,R)}
  else if(hz==='front'||hz==='turbines'){
    hills(g,wpx,400,26,mix(sk[2],far,.6),R,.006);
    if(hz==='turbines'){for(let x=120;x<wpx;x+=230+R()*160){const h=180+R()*80;g.fillStyle=mix(sk[1],'#ffffff',.25);poly(g,[x-5,430,x-2,430-h,x+2,430-h,x+5,430]);g.fill();g.beginPath();g.arc(x,430-h,5,0,7);g.fill();L.turbines.push({x,y:430-h,r:h*.42,sp:.7+R()*.5,ph:R()*6})}}
    hills(g,wpx,450,20,far,R,.009);
    for(let x=0;x<wpx;x+=60+R()*120)deadTree(g,x,456+R()*10,40+R()*50,near);
    if(hz==='front'){g.fillStyle=near;const ox=wpx*.6;g.fillRect(ox,360,14,90);poly(g,[ox-4,360,ox+7,340,ox+18,360]);g.fill();g.fillRect(ox-60,430,134,26)}
    hills(g,wpx,500,14,near,R,.012);
  }else if(hz==='city'||hz==='station'||hz==='square'){
    for(let x=-20;x<wpx;){const w=60+R()*80,h=90+R()*90;building(g,x,470,w,h,far,R,.25);x+=w+R()*14}
    cathedral(g,wpx*.48,470,mix(far,'#000000',.15),'rgba(255,190,110,.55)');
    if(hz==='station'){g.strokeStyle=near;g.lineWidth=8;for(let x=0;x<wpx;x+=240){g.beginPath();g.arc(x+120,420,130,Math.PI,0);g.stroke()}g.fillStyle=near;g.fillRect(0,416,wpx,10);
      g.fillStyle='rgba(180,200,220,.12)';for(let x=0;x<wpx;x+=240){g.beginPath();g.arc(x+120,420,124,Math.PI,0);g.fill()}}
    if(hz==='square'){for(let x=20;x<wpx;x+=90+R()*60)roundTree(g,x,500,90+R()*40,near)}
    else for(let x=-20;x<wpx;){const w=50+R()*70,h=60+R()*60;building(g,x,520,w,h,near,R,.18);x+=w+R()*20}
  }else if(hz==='road'||hz==='bridge'){
    hills(g,wpx,430,18,far,R,.005);
    for(let x=80;x<wpx;x+=180+R()*80)pylon(g,x,440,110+R()*30,near);
    g.strokeStyle=near;g.lineWidth=1;for(let x=80;x<wpx;x+=200){g.beginPath();g.moveTo(x-20,340);g.quadraticCurveTo(x+80,360,x+180,340);g.stroke()}
    for(let x=0;x<wpx;x+=40+R()*40)poplar(g,x,470,60+R()*40,near);
    for(let k=0;k<wpx/80;k++){g.fillStyle='rgba(255,200,120,'+(.3+R()*.4)+')';g.fillRect(R()*wpx,440+R()*20,2,2)}
    if(hz==='bridge'){g.fillStyle=mix(sk[2],'#000000',.5);g.fillRect(0,480,wpx,120);g.strokeStyle='rgba(200,210,230,.12)';for(let k=0;k<wpx/30;k++){const x=R()*wpx,y=490+R()*90;g.beginPath();g.moveTo(x,y);g.lineTo(x+20+R()*30,y);g.stroke()}
      g.strokeStyle=near;g.lineWidth=5;for(let x=0;x<wpx;x+=160){g.beginPath();g.moveTo(x,470);g.lineTo(x+80,400);g.lineTo(x+160,470);g.stroke()}g.fillStyle=near;g.fillRect(0,396,wpx,8);g.fillRect(0,468,wpx,8)}
    else hills(g,wpx,500,8,near,R,.01);
  }else if(hz==='village'||hz==='cemetery'){
    hills(g,wpx,420,20,far,R,.005);
    for(let x=20;x<wpx;x+=70+R()*80)(hz==='cemetery'?cypress:poplar)(g,x,460,60+R()*50,mix(far,'#000000',.2));
    church(g,wpx*.55,470,near,th.weather==='dusk'?'rgba(255,190,110,.7)':'rgba(255,190,110,.45)');
    if(hz==='village'){for(let x=-10;x<wpx;){const w=50+R()*40,h=40+R()*30;if(Math.abs(x-wpx*.55)>120)house(g,x,500,w,h,mix(near,'#c9a878',.25),mix(near,'#8a3a2a',.25),R,.4);x+=w+10+R()*30}}
    else{g.fillStyle=near;g.fillRect(0,470,wpx,40);for(let x=10;x<wpx;x+=50+R()*40){g.fillRect(x,446,4,30);g.fillRect(x-8,454,20,4)}}
  }
  const hz2=g.createLinearGradient(0,300,0,hpx);hz2.addColorStop(0,rgba(th.fog,0));hz2.addColorStop(1,rgba(th.fog,.55));g.fillStyle=hz2;g.fillRect(0,300,wpx,hpx-300);
}
/* hauteur d'un plan de fond : le décor (dessiné pour 600 px) reste calé en bas */
/* voile de brume (autrefois peint à chaque image) cuit dans les calques */
function bakeFog(g,th,wpx,op){g.save();g.globalCompositeOperation=op;const fg=g.createLinearGradient(0,0,0,600);fg.addColorStop(0,rgba(th.fog,th.outdoor?.18:.32));fg.addColorStop(1,rgba(th.fog,.04));g.fillStyle=fg;g.fillRect(0,0,wpx,600);g.fillStyle=rgba(th.fog,th.outdoor?.18:.32);g.fillRect(0,-2000,wpx,2000);g.restore()}
function layerH(pf){return Math.max(600,Math.ceil((ROWS*T-H)*pf+H+8))}
function buildFar(L){
  if(L.th.far==='train'){L.windows=[];L.turbines=[];return{width:1,height:1,chunks:[],rs:1}}   // le paysage du train est dessiné à part (11i_train.js)
  const R=mulberry(L.def.seed);
  const wpx=Math.ceil((L.wpx-W)*PF_FAR+W)+60,hpx=layerH(PF_FAR),yOff=hpx-600;
  const BR=Math.min(RS,1),{layer:c,g}=mkLayer(wpx*BR,hpx*BR);g.scale(BR,BR);c.rs=BR;
  L.windows=[];L.turbines=[];
  if(yOff>0){const sk=g.createLinearGradient(0,0,0,yOff+60);const top=L.th.outdoor?L.th.sky[0]:shade(L.th.fog,-.1);sk.addColorStop(0,mix(top,'#000000',.25));sk.addColorStop(1,top);g.fillStyle=sk;g.fillRect(0,0,wpx,yOff+60);
    if(L.th.outdoor&&L.th.stars){const R2=mulberry(L.def.seed+77);g.fillStyle='rgba(255,255,255,.55)';for(let k=0;k<wpx*yOff/2500;k++)g.fillRect(R2()*wpx,R2()*yOff,1.2,1.2)}}
  g.translate(0,Math.max(0,yOff));
  if(L.th.far==='gareReims')gareFar(L,g,wpx,R);else if(L.th.far==='langlet')langletFar(L,g,wpx,R);else if(L.th.far==='facade')facadeFar(L,g,wpx,R);else if(L.th.outdoor)buildOutdoorFar(L,g,wpx,600,R);else buildInteriorFar(L,g,wpx,600,R);
  for(const tb of L.turbines)tb.y+=Math.max(0,yOff);
  bakeFog(g,L.th,wpx,'source-over');
  return c;
}
function buildMid(L){
  if(L.th.far==='train')return{width:1,height:1,chunks:[],rs:1};
  const th=L.th,R=mulberry(L.def.seed+5);
  const wpx=Math.ceil((L.wpx-W)*PF_MID+W)+60,hpx=layerH(PF_MID);
  const BR=Math.min(RS,1),{layer:c,g}=mkLayer(wpx*BR,hpx*BR);g.scale(BR,BR);c.rs=BR;g.translate(0,Math.max(0,hpx-600));
  const base=th.outdoor?mix(th.sky[1],'#000000',.68):shade(th.fog,.14),rim=th.outdoor?'rgba(200,210,230,.14)':'rgba(170,195,215,.2)';
  let x=40+R()*120;
  const hz=th.horizon;
  if(hz==='fields'){fieldsMid(L,g,wpx,R);x=wpx}
  if(th.far==='bunker'){bunkerMid(L,g,wpx,R);x=wpx}
  if(th.far==='gareReims'){gareMid(L,g,wpx,R);x=wpx}
  if(th.far==='langlet'||th.far==='facade')x=wpx;
  while(x<wpx){
    const k=R();
    g.fillStyle=base;g.strokeStyle=rim;g.lineWidth=2;
    if(!th.outdoor){
      if(k<.3){const w=120+R()*60,top=200+R()*60;g.fillRect(x,top,8,520-top);g.fillRect(x+w,top,8,520-top);for(let y=top;y<520;y+=70){g.fillRect(x,y,w+8,7);for(let j=0;j<w-14;j+=18+R()*10){const bh=18+R()*26;rr(g,x+10+j,y-bh,13,bh,4);g.fill()}}g.beginPath();g.moveTo(x,top);g.lineTo(x+w+8,top);g.stroke();x+=w+90+R()*140}
      else if(k<.55){const w=70+R()*50,h=150+R()*80;g.beginPath();g.moveTo(x,520);g.bezierCurveTo(x+5,520-h*.6,x+w*.2,520-h,x+w*.5,520-h);g.bezierCurveTo(x+w*.8,520-h,x+w-5,520-h*.6,x+w,520);for(let j=4;j>=0;j--)g.lineTo(x+j*w/4,520-(j%2?8:0));g.closePath();g.fill();x+=w+80+R()*120}
      else if(k<.75){const n=2+Math.floor(R()*3);let y=520;for(let i=0;i<n;i++){const w=60+R()*40,h=36+R()*30;g.fillRect(x+R()*16,y-h,w,h);g.strokeRect(x,y-h,w,h);y-=h}x+=150+R()*120}
      else if(k<.88){g.fillRect(x,210,7,310);g.fillRect(x+44,230,7,290);for(let y=240;y<520;y+=32)g.fillRect(x,y,50,5);x+=120+R()*120}
      else{const y=100+R()*80;g.fillRect(x-1,0,2,y);g.beginPath();g.moveTo(x-30,y+30);g.lineTo(x-12,y);g.lineTo(x+12,y);g.lineTo(x+30,y+30);g.closePath();g.fill();g.stroke();x+=140+R()*120}
      continue;
    }
    if(hz==='front'||hz==='turbines'){
      if(k<.45){deadTree(g,x,525,120+R()*90,base);x+=110+R()*120}
      else if(k<.75){for(let i=0;i<4;i++){g.fillRect(x+i*40,470,4,55)}g.strokeStyle=base;g.lineWidth=1.2;for(let j=0;j<3;j++){g.beginPath();for(let i=0;i<=12;i++)g.lineTo(x+i*10,480+j*12+Math.sin(i)*3);g.stroke()}x+=200+R()*100}
      else{g.beginPath();g.ellipse(x+60,525,70,22,0,Math.PI,0);g.fill();x+=180+R()*120}
    }else if(hz==='city'||hz==='station'||hz==='square'){
      const w=110+R()*90,h=180+R()*120;
      g.fillRect(x,525-h,w,h);
      const sign=R();if(sign<.25){g.fillStyle='#8a2a22';rr(g,x+w/2-14,525-h+60,28,40,6);g.fill();g.fillStyle='#e9dfc7';g.font='9px '+F_DISP;g.textAlign='center';g.fillText('TABAC',x+w/2,525-h+84)}
      else if(sign<.5){g.fillStyle='rgba(255,200,120,.6)';g.fillRect(x+10,505,w-20,20);g.fillStyle=base;g.font='12px '+F_DISP;g.textAlign='center';g.fillText(pick(['BOULANGERIE','BRASSERIE','CHAMPAGNE','PHARMACIE']),x+w/2,500)}
      for(let i=0;i<Math.floor(w/26);i++)for(let j=0;j<Math.floor((h-60)/40);j++){const on=R()<.22;g.fillStyle=on?'rgba(255,200,120,.55)':'rgba(0,0,0,.25)';g.fillRect(x+10+i*26,525-h+14+j*40,12,22);g.fillStyle=base;g.fillRect(x+6+i*26,525-h+36+j*40,20,3)}
      x+=w+30+R()*80;
    }else if(hz==='road'||hz==='bridge'){
      if(k<.4){g.fillRect(x,350,5,175);g.fillRect(x,350,40,5);g.fillStyle='rgba(255,220,150,.5)';g.fillRect(x+30,355,12,4);x+=220+R()*100}
      else if(k<.7){g.fillStyle='#1e3a6a';rr(g,x,380,120,60,4);g.fill();g.fillStyle='rgba(233,233,233,.8)';g.font='bold 14px '+F_DISP;g.textAlign='center';g.fillText(pick(['A4 · PARIS','A4 · METZ','SORTIE 18']),x+60,415);g.fillStyle=base;g.fillRect(x+20,440,5,85);g.fillRect(x+95,440,5,85);x+=260+R()*120}
      else{for(let i=0;i<8;i++)poplar(g,x+i*24,525,90+R()*40,base);x+=260+R()*120}
    }else{
      if(hz==='cemetery'){if(k<.5){cypress(g,x,525,130+R()*60,base);x+=80+R()*90}else{g.fillRect(x,470,60,55);poly(g,[x-4,470,x+30,440,x+64,470]);g.fill();g.fillRect(x+27,420,6,24);g.fillRect(x+20,428,20,5);x+=160+R()*100}}
      else{const w=90+R()*70,h=90+R()*50;g.fillRect(x,525-h,w,h);poly(g,[x-8,525-h,x+w/2,525-h-w*.45,x+w+8,525-h]);g.fill();const on=R()<.6;g.fillStyle=on?'rgba(255,200,120,.6)':'rgba(0,0,0,.25)';g.fillRect(x+w*.2,525-h*.7,16,20);g.fillRect(x+w*.65,525-h*.7,16,20);x+=w+40+R()*80}
    }
  }
  g.globalCompositeOperation='source-atop';g.fillStyle=rgba(th.fog,hz==='fields'?.14:th.outdoor?.3:.35);g.fillRect(0,-hpx,wpx,hpx*2);
  bakeFog(g,th,wpx,'source-atop');
  return c;
}
