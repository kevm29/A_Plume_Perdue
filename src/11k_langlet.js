/* =========================================================
   3-3 · LE COURS LANGLET — de l'angle à la rotonde jusqu'au flanc de la cathédrale, façade après façade
   ---------------------------------------------------------
   Les façades sont peintes à l'échelle du jeu, dans une couche en cache derrière les tuiles ; balcons et
   corniches sont des planches invisibles (t), les bannes des boutiques des auvents (A). Le tramway passe sur
   la chaussée (on peut monter sur son toit), des groupes de touristes s'arrêtent pour photographier, des rats.
   ========================================================= */
THEMES.langlet={outdoor:true,far:'langlet',horizon:'langlet',sky:['#9fb2c6','#cfd6dc','#e8e6e0'],celestial:'none',fog:'#d0d4d8',dark:0,weather:'none',
  floor:'#8a8478',floorTop:'#b8b2a4',type:'stone',x:'none',d:'drape',shelf:'girder',spike:'spikes',spikeCol:'#3a3e46',spikeBase:'#2a2c32',walker:'rat',flyer:'crow',awning:'#2f5a7a',props:[]};
const LG={BASE:19*T,GF:120,FH:80};

/* ---------- ciel couvert de Reims, toits lointains ---------- */
function langletFar(L,g,wpx,R){
  const sk=g.createLinearGradient(0,0,0,460);sk.addColorStop(0,'#98aabd');sk.addColorStop(.6,'#cfd5da');sk.addColorStop(1,'#e6e3dc');g.fillStyle=sk;g.fillRect(0,-200,wpx,800);
  for(let k=0;k<40;k++){const x=R()*wpx,y=20+R()*200,s=30+R()*50;g.fillStyle='rgba(245,245,242,'+(.5+R()*.3)+')';for(let j=0;j<5;j++){g.beginPath();g.ellipse(x+(j-2)*s*.7,y+(j%2)*8,s,s*.45,0,0,7);g.fill()}
    g.fillStyle='rgba(150,160,175,.25)';g.beginPath();g.ellipse(x,y+s*.35,s*2,s*.2,0,0,7);g.fill()}
  // toits gris lointains, cheminées
  g.fillStyle='rgba(120,128,140,.45)';let x=0;while(x<wpx){const w=60+R()*80,h=60+R()*50;g.fillRect(x,440-h,w,h);poly(g,[x,440-h,x+8,440-h-16,x+w-8,440-h-16,x+w,440-h]);g.fill();if(R()<.6)g.fillRect(x+R()*w,440-h-28,8,14);x+=w}
}

/* ---------- petits outils de dessin ---------- */
const LGC={stone:'#ddd2bc',stone2:'#cfc3aa',cream:'#e9e1cf',brick:'#b85a3e',brick2:'#a44e36',slate:'#5c6370',slate2:'#4c525e',render:'#b9beb2',white:'#ece8de'};
function lgAshlar(g,x0,y0,x1,y1,col,R){g.fillStyle=col;g.fillRect(x0,y0,x1-x0,y1-y0);g.strokeStyle='rgba(0,0,0,.06)';g.lineWidth=1;for(let y=y0+12;y<y1;y+=12){g.beginPath();g.moveTo(x0,y);g.lineTo(x1,y);g.stroke();for(let x=x0+((y/12|0)%2?14:0);x<x1;x+=28){g.beginPath();g.moveTo(x,y-12);g.lineTo(x,y);g.stroke()}}}
function lgBrick(g,x0,y0,x1,y1,R){g.fillStyle=LGC.brick;g.fillRect(x0,y0,x1-x0,y1-y0);for(let y=y0;y<y1;y+=5){const off=((y-y0)/5|0)%2?6:0;for(let x=x0-off;x<x1;x+=12){g.fillStyle=R()<.5?'rgba(120,40,24,.18)':'rgba(255,200,170,.08)';g.fillRect(Math.max(x0,x),y,Math.min(11,x1-Math.max(x0,x)),4)}}
  g.fillStyle='rgba(240,225,200,.25)';for(let y=y0+4;y<y1;y+=5)g.fillRect(x0,y,x1-x0,1)}
function lgWin(g,x,y,w,h,o){o=o||{};
  if(o.arch){g.fillStyle=o.frame||'#efe8d8';g.beginPath();g.moveTo(x-3,y+h+3);g.lineTo(x-3,y+w/2);g.arc(x+w/2,y+w/2,w/2+3,Math.PI,0);g.lineTo(x+w+3,y+h+3);g.closePath();g.fill();
    g.fillStyle=o.glass||'#4e5c6c';g.beginPath();g.moveTo(x,y+h);g.lineTo(x,y+w/2);g.arc(x+w/2,y+w/2,w/2,Math.PI,0);g.lineTo(x+w,y+h);g.closePath();g.fill()}
  else{g.fillStyle=o.frame||'#efe8d8';g.fillRect(x-3,y-3,w+6,h+6);g.fillStyle=o.glass||'#4e5c6c';g.fillRect(x,y,w,h)}
  g.fillStyle='rgba(255,255,255,.14)';g.fillRect(x+2,y+2,3,h-4);g.strokeStyle='#e8e4da';g.lineWidth=1.4;g.beginPath();g.moveTo(x+w/2,y+(o.arch?w/2:0));g.lineTo(x+w/2,y+h);g.moveTo(x,y+h*.42);g.lineTo(x+w,y+h*.42);g.stroke();
  if(o.blind){g.fillStyle='#e6e0d2';g.fillRect(x,y,w,h*o.blind);g.fillStyle='rgba(0,0,0,.08)';for(let k=3;k<h*o.blind;k+=3)g.fillRect(x,y+k,w,1)}
  if(o.lintel){g.fillStyle=o.lintel;g.fillRect(x-5,y-8,w+10,6);if(o.key){g.fillRect(x+w/2-4,y-10,8,9)}}
  if(o.rail){g.strokeStyle='#26282c';g.lineWidth=1.2;g.strokeRect(x-4,y+h-14,w+8,14);for(let k=x;k<x+w+4;k+=4){g.beginPath();g.moveTo(k,y+h-14);g.lineTo(k,y+h);g.stroke()}}
  if(o.sill!==false){g.fillStyle=o.sillCol||'#d8cfbc';g.fillRect(x-5,y+h+3,w+10,4)}
}
function lgBalcony(g,x0,x1,y,kind){// balcon filant sur une planche (y = niveau du sol du balcon)
  if(kind==='stone'){g.fillStyle='#d4c9b2';g.fillRect(x0,y-4,x1-x0,8);g.fillStyle='#c4b89e';for(let x=x0+4;x<x1-4;x+=9){g.fillRect(x,y-18,5,14);g.beginPath();g.ellipse(x+2.5,y-12,3.5,4,0,0,7);g.fill()}g.fillRect(x0,y-22,x1-x0,5);g.fillStyle='rgba(0,0,0,.18)';g.fillRect(x0,y+4,x1-x0,3)}
  else if(kind==='orange'){g.fillStyle='#c9c4b4';g.fillRect(x0,y-4,x1-x0,8);g.fillStyle='#d8763c';for(let x=x0+4;x<x1-4;x+=8){g.fillRect(x,y-18,5,14)}g.fillStyle='#c9c4b4';g.fillRect(x0,y-22,x1-x0,5)}
  else{g.fillStyle='#bcb3a0';g.fillRect(x0,y-3,x1-x0,6);g.strokeStyle='#202226';g.lineWidth=1.2;g.beginPath();g.moveTo(x0,y-20);g.lineTo(x1,y-20);g.moveTo(x0,y-17);g.lineTo(x1,y-17);g.stroke();
    for(let x=x0+3;x<x1;x+=5){g.beginPath();g.moveTo(x,y-20);g.lineTo(x,y-3);g.stroke()}for(let x=x0+10;x<x1-6;x+=20){g.beginPath();g.arc(x,y-11,4,0,7);g.stroke()}}
}
function lgMansard(g,x0,x1,y,h,o){o=o||{};// toit à la Mansart, ardoise, lucarnes
  g.fillStyle=LGC.slate;poly(g,[x0-6,y,x0+10,y-h,x1-10,y-h,x1+6,y]);g.fill();g.fillStyle='rgba(255,255,255,.06)';for(let k=0;k<h;k+=6)g.fillRect(x0+4,y-k,x1-x0-8,1);
  g.fillStyle=LGC.slate2;g.fillRect(x0+10,y-h-6,x1-x0-20,6);
  const n=o.dormers||0;for(let i=0;i<n;i++){const dx=x0+(i+.5)*(x1-x0)/n-14,dy=y-h+10;g.fillStyle=o.dcol||'#e2d8c2';
    if(o.style==='oeil'){g.beginPath();g.ellipse(dx+14,dy+22,13,15,0,0,7);g.fill();g.fillStyle='#4e5c6c';g.beginPath();g.ellipse(dx+14,dy+22,8,10,0,0,7);g.fill()}
    else{g.fillRect(dx,dy+8,28,h-14);if(o.style==='round'){g.beginPath();g.arc(dx+14,dy+8,14,Math.PI,0);g.fill()}else{poly(g,[dx-4,dy+10,dx+14,dy-6,dx+32,dy+10]);g.fill()}
      g.fillStyle='#4e5c6c';g.fillRect(dx+6,dy+12,16,h-24);g.strokeStyle='#e8e4da';g.lineWidth=1;g.beginPath();g.moveTo(dx+14,dy+12);g.lineTo(dx+14,dy+h-12);g.stroke()}}
  for(const cx of o.chim||[]){g.fillStyle=o.chimCol||'#a8644a';g.fillRect(cx-9,y-h-34,18,34);g.fillStyle='#8a4e38';g.fillRect(cx-11,y-h-36,22,5);g.fillStyle='#6a6a6a';g.fillRect(cx-5,y-h-42,4,7);g.fillRect(cx+2,y-h-41,4,6)}
}
function lgShop(g,x0,x1,col,label,o){o=o||{};const b=LG.BASE,top=b-LG.GF+14;
  g.fillStyle=col;g.fillRect(x0,top,x1-x0,24);g.fillStyle=o.txt||'#f4efe2';g.textAlign='center';let fs=11;g.font='bold '+fs+'px '+F_DISP;while(fs>6&&g.measureText(label).width>x1-x0-10){fs-=.5;g.font='bold '+fs+'px '+F_DISP}g.fillText(label,(x0+x1)/2,top+16);
  g.fillStyle='rgba(50,62,76,.85)';g.fillRect(x0+4,top+28,x1-x0-8,b-top-30);g.fillStyle='rgba(255,236,200,.28)';g.fillRect(x0+8,top+34,x1-x0-16,b-top-42);
  g.fillStyle=col;g.fillRect(x0,top+24,4,b-top-24);g.fillRect(x1-4,top+24,4,b-top-24);if(o.door){g.fillStyle='rgba(20,26,34,.85)';g.fillRect(o.door-12,top+34,24,b-top-36)}
  if(o.goods){for(let k=0;k<6;k++){g.fillStyle=o.goods[k%o.goods.length];g.fillRect(x0+14+k*((x1-x0-28)/6),b-30,10,18)}}
}

/* ---------- les façades, de l'angle à la rotonde jusqu'à la cathédrale ---------- */
function lgRotonde(g,c0,c1,R){// l'immeuble vert-de-gris à rotonde : trois balcons courbes aux balustres orange, dôme d'ardoise et lanterneau
  const x0=c0*T,x1=c1*T,b=LG.BASE,xr=x0+7*T,top=b-LG.GF-4*LG.FH;
  g.fillStyle='#a9b0a4';g.fillRect(x0,top,x1-x0,b-top);g.fillStyle='rgba(255,255,255,.06)';g.fillRect(x0,top,xr-x0,b-top);
  // la rotonde : ombre de rondeur
  const gr=g.createLinearGradient(x0,0,xr,0);gr.addColorStop(0,'rgba(0,0,0,.18)');gr.addColorStop(.45,'rgba(255,255,255,.08)');gr.addColorStop(1,'rgba(0,0,0,.12)');g.fillStyle=gr;g.fillRect(x0,top,xr-x0,b-top);
  for(let k=1;k<=3;k++){const y=b-LG.GF-(k-1)*LG.FH;g.fillStyle='#9aa196';g.beginPath();g.ellipse((x0+xr)/2,y+4,(xr-x0)/2+12,12,0,0,Math.PI);g.fill();lgBalcony(g,x0-8,xr+8,y,'orange');
    for(const wx of[x0+40,x0+120,x0+200])if(wx<xr-20)lgWin(g,wx,y-70,24,46,{frame:'#c8cbc0',glass:'#5a6878',blind:.3,sill:false})}
  g.fillStyle='#9aa196';g.fillRect(xr-6,top,12,b-top);   // le pilastre d'angle
  // le dôme et son lanterneau
  const dy=top;g.fillStyle='#9aa196';g.beginPath();g.ellipse((x0+xr)/2,dy,(xr-x0)/2+18,14,0,0,7);g.fill();
  g.fillStyle=LGC.slate;g.beginPath();g.moveTo(x0+6,dy);g.quadraticCurveTo(x0+10,dy-70,(x0+xr)/2,dy-92);g.quadraticCurveTo(xr-10,dy-70,xr-6,dy);g.closePath();g.fill();
  g.fillStyle='#d8dcd2';g.fillRect((x0+xr)/2-34,dy-58,68,34);g.beginPath();g.arc((x0+xr)/2,dy-58,34,Math.PI,0);g.fill();g.fillStyle='#5a6878';g.fillRect((x0+xr)/2-22,dy-56,18,28);g.fillRect((x0+xr)/2+4,dy-56,18,28);
  g.strokeStyle='#3a3e44';g.lineWidth=2;g.beginPath();g.moveTo((x0+xr)/2,dy-92);g.lineTo((x0+xr)/2,dy-118);g.stroke();
  // l'aile : fenêtres, frise de briques orange, lucarnes
  for(let k=1;k<=4;k++){const y=b-LG.GF-(k-1)*LG.FH;g.fillStyle='#c8673e';g.fillRect(xr+6,y-6,x1-xr-6,3);for(let wx=xr+30;wx<x1-30;wx+=58){lgWin(g,wx,y-66,24,48,{frame:'#c8cbc0',glass:'#5a6878',blind:k===2?.5:0});if(k===2)lgBalcony(g,wx-6,wx+30,y-14,'iron');
      g.fillStyle='#c8673e';g.fillRect(wx+6,y-76,12,5)}}
  lgMansard(g,xr,x1,top,62,{dormers:3,style:'pediment',dcol:'#b9beb2'});
  // rez-de-chaussée : portes cintrées vertes, deux boutiques
  for(const dx of[x0+30,x0+130]){g.fillStyle='#8a9188';g.beginPath();g.moveTo(dx-6,b);g.lineTo(dx-6,b-90);g.arc(dx+30,b-90,36,Math.PI,0);g.lineTo(dx+66,b);g.closePath();g.fill();
    g.fillStyle='#1e4a6a';g.beginPath();g.moveTo(dx,b);g.lineTo(dx,b-90);g.arc(dx+30,b-90,30,Math.PI,0);g.lineTo(dx+60,b);g.closePath();g.fill();g.strokeStyle='#4ac04a';g.lineWidth=2;g.strokeRect(dx+6,b-84,22,80);g.strokeRect(dx+32,b-84,22,80)}
  lgShop(g,xr+30,xr+170,'#244a72','ATELIER',{door:xr+100});lgShop(g,xr+190,x1-10,'#f2f0ea','BOUTIQUE',{txt:'#2a2a2a',door:x1-60});
  // la plaque de la rue, bleue
  g.fillStyle='#2a4a8a';rr(g,xr+10,b-LG.GF-30,108,22,3);g.fill();g.strokeStyle='#e8ecf4';g.lineWidth=1.2;rr(g,xr+12,b-LG.GF-28,104,18,2);g.stroke();
  g.fillStyle='#f0f2f6';g.font='bold 7px '+F_DISP;g.textAlign='center';g.fillText('COURS',xr+64,b-LG.GF-21);g.fillText('JEAN-BAPTISTE LANGLET',xr+64,b-LG.GF-13);
}
function lgImm(g,o,R){// immeuble générique : pierre, brique, pilastres, balcons, lucarnes, boutiques, arcades
  const x0=o.c0*T,x1=o.c1*T,b=LG.BASE,n=o.n||4,top=b-LG.GF-n*LG.FH;
  if(o.mat==='brick'){lgBrick(g,x0,top,x1,b-LG.GF,R);lgAshlar(g,x0,b-LG.GF,x1,b,LGC.stone,R);g.fillStyle=LGC.stone;g.fillRect(x0,top,12,b-top);g.fillRect(x1-12,top,12,b-top);for(let k=0;k<n;k++){const y=b-LG.GF-k*LG.FH;g.fillRect(x0,y-6,x1-x0,6)}}
  else if(o.mat==='orange'){lgAshlar(g,x0,top,x1,b,LGC.stone,R);for(let k=0;k<n;k++){const y=b-LG.GF-k*LG.FH;g.fillStyle='#d98a4a';g.fillRect(x0+14,y-LG.FH+8,x1-x0-28,LG.FH-16)}}
  else lgAshlar(g,x0,top,x1,b,o.col||LGC.stone,R);
  for(const px of o.pil||[]){g.fillStyle='#c8502e';g.fillRect(x0+px,top+10,22,b-LG.GF-top-10);g.fillStyle='rgba(0,0,0,.08)';for(let y=top+14;y<b-LG.GF;y+=5)g.fillRect(x0+px,y,22,1)}
  g.fillStyle='rgba(0,0,0,.08)';g.fillRect(x0,b-LG.GF-4,x1-x0,4);
  const wn=o.wn||Math.max(2,Math.floor((x1-x0)/70)),step=(x1-x0)/wn;
  for(let k=1;k<=n;k++){const y=b-LG.GF-(k-1)*LG.FH;g.fillStyle='rgba(0,0,0,.07)';g.fillRect(x0,y-3,x1-x0,3);
    for(let i=0;i<wn;i++){const wx=x0+step*(i+.5)-12;if(o.skipWin&&o.skipWin(i,k))continue;lgWin(g,wx,y-68,24,50,{frame:o.frame||'#efe8d8',arch:o.arch&&k===n,blind:(i+k)%4===0?.45:0,lintel:o.lintel,key:o.key,rail:o.rails&&!(o.bal||[]).includes(k)})}
    if((o.bal||[]).includes(k))lgBalcony(g,x0+8,x1-8,y,o.balKind||'iron')}
  if(o.bay){const bx0=x0+o.bay[0],bx1=x0+o.bay[1];g.fillStyle='rgba(0,0,0,.12)';g.fillRect(bx1,top+20,8,b-LG.GF-top-20);g.fillStyle=o.col||LGC.stone;g.fillRect(bx0,top+20,bx1-bx0,b-LG.GF-top-20);
    for(let k=1;k<=n;k++){const y=b-LG.GF-(k-1)*LG.FH;lgWin(g,(bx0+bx1)/2-14,y-68,28,50,{frame:'#efe8d8'});lgWin(g,bx0+4,y-64,8,44,{frame:'#efe8d8',sill:false});lgWin(g,bx1-12,y-64,8,44,{frame:'#efe8d8',sill:false})}
    if(o.bayDome){g.fillStyle=LGC.slate;g.beginPath();g.moveTo(bx0-6,top+20);g.quadraticCurveTo((bx0+bx1)/2,top-60,bx1+6,top+20);g.closePath();g.fill();g.fillStyle='#e2d8c2';g.beginPath();g.ellipse((bx0+bx1)/2,top-6,10,13,0,0,7);g.fill();g.fillStyle='#4e5c6c';g.beginPath();g.ellipse((bx0+bx1)/2,top-6,6,8,0,0,7);g.fill()}}
  g.fillStyle=o.cornice||'#cfc3aa';g.fillRect(x0-4,top-8,x1-x0+8,10);g.fillStyle='rgba(0,0,0,.12)';g.fillRect(x0-4,top+2,x1-x0+8,3);
  if(o.mans!==false)lgMansard(g,x0,x1,top-8,o.mansH||64,{dormers:o.dormers||Math.max(1,wn-1),style:o.dstyle||'pediment',chim:(o.chim||[]).map(c=>x0+c),dcol:o.dcol});
  else if(o.flatRoof){g.fillStyle='#8a8478';g.fillRect(x0,top-14,x1-x0,6)}
  // rez-de-chaussée
  const gf=o.gf||[];for(const s of gf){const a=x0+s.x,e=x0+s.x+s.w;
    if(s.t==='shop')lgShop(g,a,e,s.col,s.label,{door:s.door!=null?x0+s.door:null,goods:s.goods,txt:s.txt});
    else if(s.t==='arch'){g.fillStyle='#c8bca2';g.beginPath();g.moveTo(a-6,b);g.lineTo(a-6,b-80);g.arc((a+e)/2,b-80,(e-a)/2+6,Math.PI,0);g.lineTo(e+6,b);g.closePath();g.fill();
      g.fillStyle=s.col||'#2a2c30';g.beginPath();g.moveTo(a,b);g.lineTo(a,b-80);g.arc((a+e)/2,b-80,(e-a)/2,Math.PI,0);g.lineTo(e,b);g.closePath();g.fill();if(s.glass){g.fillStyle='rgba(255,230,190,.25)';g.fillRect(a+6,b-74,e-a-12,70)}}
    else if(s.t==='door'){g.fillStyle='#c8bca2';g.fillRect(a-6,b-100,e-a+12,100);g.fillStyle=s.col||'#6a3a22';g.fillRect(a,b-94,e-a,94);g.fillStyle='rgba(0,0,0,.2)';g.fillRect((a+e)/2-1,b-94,2,94);if(s.ped){g.fillStyle='#c8bca2';poly(g,[a-12,b-100,(a+e)/2,b-124,e+12,b-100]);g.fill()}}
    else if(s.t==='win'){lgWin(g,a,b-96,e-a,62,{frame:'#e2d8c2',glass:'#3e4a58'});g.strokeStyle='#202226';g.lineWidth=1.5;for(let x=a+4;x<e;x+=6){g.beginPath();g.moveTo(x,b-96);g.lineTo(x,b-34);g.stroke()}}
    else if(s.t==='glass'){g.fillStyle='rgba(60,74,90,.9)';g.fillRect(a,b-110,e-a,108);g.fillStyle='rgba(200,220,235,.25)';for(let x=a+4;x<e;x+=26)g.fillRect(x,b-104,20,96);if(s.label){g.fillStyle=s.col||'#2a4a8a';g.fillRect(a+6,b-124,e-a-12,14);g.fillStyle='#f0f0f0';g.font='bold 8px '+F_DISP;g.textAlign='center';g.fillText(s.label,(a+e)/2,b-114)}}}
  if(o.sign){g.fillStyle='#2a4a8a';rr(g,x0+o.sign[0],b-LG.GF-26,96,18,3);g.fill();g.fillStyle='#f0f2f6';g.font='bold 7px '+F_DISP;g.textAlign='center';g.fillText(o.sign[1],x0+o.sign[0]+48,b-LG.GF-14)}
}
function lgHotelBrique(g,c0,c1,R){// l'hôtel en brique et pierre, en retrait derrière sa petite place : toit Mansart, lucarnes à fronton
  const x0=c0*T+10,x1=c1*T-10,b=LG.BASE-22,s=.86,H=LG.GF+2*LG.FH,top=b-H*s;
  // retours des murs voisins et sol de la place
  g.fillStyle='#b8ae98';poly(g,[c0*T,LG.BASE-LG.GF-3*LG.FH,x0,top-40,x0,b,c0*T,LG.BASE]);g.fill();g.fillStyle='rgba(0,0,0,.18)';poly(g,[c0*T,LG.BASE-LG.GF-3*LG.FH,x0,top-40,x0,b,c0*T,LG.BASE]);g.fill();
  g.fillStyle='#c8bea8';poly(g,[c1*T,LG.BASE-LG.GF-4*LG.FH,x1,top-40,x1,b,c1*T,LG.BASE]);g.fill();g.fillStyle='rgba(0,0,0,.1)';poly(g,[c1*T,LG.BASE-LG.GF-4*LG.FH,x1,top-40,x1,b,c1*T,LG.BASE]);g.fill();
  g.fillStyle='#d6cebd';poly(g,[c0*T,LG.BASE,x0,b,x1,b,c1*T,LG.BASE]);g.fill();g.strokeStyle='rgba(0,0,0,.06)';for(let k=1;k<6;k++){const u=k/6;g.beginPath();g.moveTo(c0*T+(x0-c0*T)*u,LG.BASE-(LG.BASE-b)*u);g.lineTo(c1*T+(x1-c1*T)*u,LG.BASE-(LG.BASE-b)*u);g.stroke()}
  // la façade : brique rouge, chaînes d'angle et encadrements de pierre
  lgBrick(g,x0,top,x1,b,R);g.fillStyle='#d8ccb0';g.fillRect(x0,b-28,x1-x0,28);
  const pw=(x1-x0);for(const fx of[0,.2,.4,.6,.8,1]){const px=x0+pw*fx-8;g.fillStyle='#ddd0b4';for(let y=top;y<b;y+=14){g.fillRect(px,y,16,7);g.fillRect(px-4,y+7,24,7)}}
  g.fillStyle='#d8ccb0';g.fillRect(x0,top+H*s*.45,x1-x0,8);g.fillRect(x0-6,top-8,x1-x0+12,10);
  // l'avant-corps à gauche, plus haut, avec son balcon de pierre
  const ax1=x0+pw*.22;g.fillStyle='rgba(0,0,0,.1)';g.fillRect(ax1,top-14,6,b-top+14);
  for(let i=0;i<8;i++){const fx=x0+pw*(i+.5)/8-11;for(const fy of[top+20,top+H*s*.5+16]){g.fillStyle='#ddd0b4';g.fillRect(fx-5,fy-5,32,60);lgWin(g,fx,fy,22,48,{frame:'#e8e2d4',glass:'#4a5868',blind:(i+fy|0)%3===0?.4:0,sill:false})}}
  lgBalcony(g,x0+8,ax1-8,top+H*s*.5+70,'stone');
  // rez-de-chaussée : deux grandes portes cochères en arc à gauche, fenêtres à barreaux, porte à fronton à droite
  for(const ax of[x0+20,x0+78]){g.fillStyle='#d8ccb0';g.beginPath();g.moveTo(ax-6,b);g.lineTo(ax-6,b-64);g.arc(ax+24,b-64,30,Math.PI,0);g.lineTo(ax+54,b);g.closePath();g.fill();g.fillStyle='#1e1e22';g.beginPath();g.moveTo(ax,b);g.lineTo(ax,b-64);g.arc(ax+24,b-64,24,Math.PI,0);g.lineTo(ax+48,b);g.closePath();g.fill()}
  for(let i=0;i<5;i++){const wx=x0+pw*.32+i*pw*.1;lgWin(g,wx,b-80,22,50,{frame:'#ddd0b4',glass:'#3a4654'});g.strokeStyle='#18191c';g.lineWidth=1.4;for(let x=wx+3;x<wx+22;x+=4){g.beginPath();g.moveTo(x,b-80);g.lineTo(x,b-30);g.stroke()}}
  {const dx=x0+pw*.82;g.fillStyle='#ddd0b4';g.fillRect(dx-6,b-90,40,90);poly(g,[dx-12,b-90,dx+14,b-108,dx+40,b-90]);g.fill();g.fillStyle='#1e1e22';g.fillRect(dx,b-82,28,82)}
  lgMansard(g,x0,x1,top-8,52*s/.86,{dormers:9,style:'pediment',dcol:'#ddd0b4',chim:[x0+40,x1-30]});
  // la place : bancs, arbres en grille, corbeilles, bornes
  for(const bx of[x0+pw*.28,x0+pw*.62]){g.fillStyle='#2a2c30';g.fillRect(bx,LG.BASE-30,70,5);g.fillRect(bx+4,LG.BASE-25,4,18);g.fillRect(bx+62,LG.BASE-25,4,18);g.fillRect(bx,LG.BASE-40,70,4)}
  for(const tx of[x0+pw*.45,x0+pw*.9]){g.strokeStyle='#4a3a2c';g.lineWidth=4;g.beginPath();g.moveTo(tx,LG.BASE);g.lineTo(tx,LG.BASE-150);g.stroke();g.lineWidth=1.5;for(let k=0;k<8;k++){const y=LG.BASE-60-k*12;g.beginPath();g.moveTo(tx,y);g.lineTo(tx+(k%2?1:-1)*(20+k*3),y-24);g.stroke()}
    g.fillStyle='rgba(200,150,60,.55)';for(let k=0;k<14;k++){g.beginPath();g.arc(tx+(R()-.5)*60,LG.BASE-110-R()*60,3,0,7);g.fill()}}
  for(const px of[c0*T+30,c1*T-40]){g.fillStyle='#2a2c30';g.fillRect(px,LG.BASE-140,6,140)}
}
function lgGothique(g,c0,c1,R){// la maison étroite néo-gothique au pignon pointu
  const x0=c0*T,x1=c1*T,b=LG.BASE,top=b-LG.GF-2*LG.FH;lgAshlar(g,x0,top,x1,b,'#e2d9c6',R);
  g.fillStyle='#e2d9c6';poly(g,[x0,top,(x0+x1)/2,top-110,x1,top]);g.fill();g.strokeStyle='#c8bca2';g.lineWidth=5;g.beginPath();g.moveTo(x0-4,top+2);g.lineTo((x0+x1)/2,top-114);g.lineTo(x1+4,top+2);g.stroke();
  g.fillStyle=LGC.slate;poly(g,[x1,top,x1+30,top-40,x1+30,top]);g.fill();
  lgWin(g,(x0+x1)/2-14,top-60,28,50,{arch:true,frame:'#d8ccb0'});lgBalcony(g,(x0+x1)/2-22,(x0+x1)/2+22,top-8,'stone');
  for(let k=1;k<=2;k++){const y=b-LG.GF-(k-1)*LG.FH;lgWin(g,x0+20,y-66,26,50,{frame:'#d8ccb0',arch:k===2});lgWin(g,x1-46,y-66,26,50,{frame:'#d8ccb0'})}
  g.fillStyle='#c8bca2';g.beginPath();g.moveTo(x0+26,b);g.lineTo(x0+26,b-84);g.arc(x0+50,b-84,24,Math.PI,0);g.lineTo(x0+74,b);g.closePath();g.fill();g.fillStyle='#7a3a22';g.beginPath();g.moveTo(x0+32,b);g.lineTo(x0+32,b-84);g.arc(x0+50,b-84,18,Math.PI,0);g.lineTo(x0+68,b);g.closePath();g.fill();
  lgWin(g,x1-80,b-90,46,60,{arch:true,frame:'#d8ccb0'});
}
function lgVerre(g,c0,c1){// l'immeuble vitré entre deux façades anciennes
  const x0=c0*T,x1=c1*T,b=LG.BASE,top=b-LG.GF-3*LG.FH;g.fillStyle='#5a6a7a';g.fillRect(x0,top,x1-x0,b-top);g.fillStyle='rgba(200,215,230,.35)';for(let y=top+4;y<b-LG.GF;y+=26)for(let x=x0+4;x<x1-4;x+=30)g.fillRect(x,y,26,22);
  g.fillStyle='rgba(255,255,255,.2)';poly(g,[x0+10,top,x0+40,top,x0+10,b-LG.GF,x0-10,b-LG.GF]);g.fill();g.fillStyle='#2a3a4a';g.fillRect(x0,b-LG.GF,x1-x0,6);
  lgShop(g,x0+4,x1-4,'#2a3a4a','AGENCE',{door:(x0+x1)/2})}
function lgModerne(g,c0,c1){// l'immeuble moderne aux balcons filants vitrés
  const x0=c0*T,x1=c1*T,b=LG.BASE,top=b-LG.GF-4*LG.FH;g.fillStyle='#e2dccc';g.fillRect(x0,top,x1-x0,b-top);g.fillStyle='#d4cdbb';g.fillRect(x0,top-30,x1-x0-40,30);g.strokeStyle='#8a8e96';g.lineWidth=1.2;g.strokeRect(x0+4,top-48,x1-x0-48,18);
  for(let k=1;k<=4;k++){const y=b-LG.GF-(k-1)*LG.FH;g.fillStyle='rgba(60,74,90,.75)';g.fillRect(x0+40,y-70,x1-x0-60,58);g.fillStyle='#e8e2d4';for(let x=x0+40;x<x1-20;x+=46)g.fillRect(x,y-70,6,58);
    g.fillStyle='#ece8dc';g.fillRect(x0+30,y-12,x1-x0-40,10);g.strokeStyle='#8a8e96';g.lineWidth=1;g.beginPath();g.moveTo(x0+30,y-30);g.lineTo(x1-10,y-30);g.stroke();for(let x=x0+34;x<x1-10;x+=8){g.beginPath();g.moveTo(x,y-30);g.lineTo(x,y-12);g.stroke()}
    lgWin(g,x0+8,y-66,16,46,{frame:'#e8e2d4'})}
  g.fillStyle='rgba(70,90,110,.85)';g.fillRect(x0+4,b-LG.GF+6,x1-x0-8,LG.GF-8);g.fillStyle='rgba(220,230,240,.3)';for(let x=x0+10;x<x1-10;x+=40)g.fillRect(x,b-LG.GF+12,32,LG.GF-20);
  g.fillStyle='#2a4a8a';g.fillRect(x0+(x1-x0)/2-50,b-LG.GF+10,100,12);g.fillStyle='#fff';g.font='bold 8px '+F_DISP;g.textAlign='center';g.fillText('BANQUE',x0+(x1-x0)/2,b-LG.GF+19)}
function lgBanqueBlanche(g,c0,c1,R){// le grand immeuble blanc à l'angle arrondi et au fronton cintré, colonnes au rez-de-chaussée
  const x0=c0*T,x1=c1*T,b=LG.BASE,n=4,top=b-LG.GF-n*LG.FH;lgAshlar(g,x0,top,x1,b,'#efebe0',R);
  const cx=x0+80;g.fillStyle='rgba(0,0,0,.1)';const gr=g.createLinearGradient(x0,0,cx,0);gr.addColorStop(0,'rgba(0,0,0,.16)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(x0,top,cx-x0,b-top);
  g.fillStyle='#efebe0';g.beginPath();g.moveTo(x0+10,top);g.lineTo(x0+10,top-40);g.quadraticCurveTo(x0+30,top-80,x0+80,top-62);g.quadraticCurveTo(x0+60,top-40,x0+70,top);g.closePath();g.fill();
  for(let k=1;k<=n;k++){const y=b-LG.GF-(k-1)*LG.FH;for(let wx=x0+30;wx<x1-30;wx+=56)lgWin(g,wx,y-66,22,48,{frame:'#f4f0e6',glass:'#4a5868'});g.fillStyle='rgba(0,0,0,.06)';g.fillRect(x0,y-3,x1-x0,3)}
  lgMansard(g,x0+90,x1,top-6,60,{dormers:7,style:'pediment',dcol:'#efebe0',chim:[x0+120,x1-60],chimCol:'#b0583e'});
  g.fillStyle='#e4e0d4';g.fillRect(x0,b-LG.GF,x1-x0,LG.GF);g.fillStyle='#efebe0';g.fillRect(x0+6,b-LG.GF,26,LG.GF);g.fillStyle='rgba(0,0,0,.1)';g.fillRect(x0+26,b-LG.GF,6,LG.GF);
  for(const[s,e]of[[x0+50,x0+200],[x0+220,x0+370]]){g.fillStyle='rgba(50,64,80,.9)';g.fillRect(s,b-LG.GF+10,e-s,LG.GF-12);g.fillStyle='rgba(220,230,240,.25)';for(let x=s+6;x<e-6;x+=30)g.fillRect(x,b-LG.GF+16,24,LG.GF-24);g.fillStyle='#2a4a8a';g.fillRect(s+20,b-62,e-s-40,12);g.fillStyle='#fff';g.font='bold 8px '+F_DISP;g.textAlign='center';g.fillText('BANQUE',(s+e)/2,b-53)}
  g.fillStyle='#4a5868';g.beginPath();g.ellipse(x0+400,b-80,14,22,0,0,7);g.fill();g.fillStyle='#6a5a4a';g.fillRect(x0+440,b-90,30,90)}
function lgArtNouveau(g,c0,c1,R){// l'immeuble Art nouveau à l'angle : balcons galbés, fer forgé, rez-de-chaussée en arcades
  const x0=c0*T,x1=c1*T,b=LG.BASE,n=4,top=b-LG.GF-n*LG.FH;lgAshlar(g,x0,top,x1,b,'#ddd2bc',R);
  for(let k=1;k<=n;k++){const y=b-LG.GF-(k-1)*LG.FH;for(const wx of[x0+40,x0+120,x0+200,x0+280])if(wx<x1-60)lgWin(g,wx,y-66,26,50,{frame:'#e8dcc4',arch:k===2||k===3,rail:k!==2});
    if(k===2){lgBalcony(g,x0+30,x0+170,y,'iron');g.fillStyle='#d4c8ae';g.beginPath();g.ellipse(x0+100,y+4,74,10,0,0,Math.PI);g.fill()}
    // l'angle arrondi à balcons galbés
    g.fillStyle='rgba(0,0,0,.1)';g.fillRect(x1-70,top,70,b-top);lgWin(g,x1-50,y-64,22,46,{frame:'#e8dcc4'});g.fillStyle='#c8bca2';g.beginPath();g.ellipse(x1-38,y+2,40,10,0,0,Math.PI);g.fill();lgBalcony(g,x1-74,x1-2,y,'iron')}
  g.fillStyle='#ddd2bc';g.beginPath();g.moveTo(x0,top);g.bezierCurveTo(x0+60,top-26,x0+140,top-10,x0+200,top-30);g.bezierCurveTo(x0+260,top-50,x1-60,top-20,x1,top-60);g.lineTo(x1,top);g.closePath();g.fill();
  g.fillStyle='#e8e2d4';for(let x=x0+20;x<x1-20;x+=14){g.fillRect(x,top-8,6,8)}g.fillStyle='#ece6d6';g.beginPath();g.arc(x1-30,top-60,22,Math.PI,0);g.fill();
  // rez-de-chaussée : porte sculptée, grande arcade d'angle
  g.fillStyle='#c8bca2';g.beginPath();g.moveTo(x0+120,b);g.lineTo(x0+120,b-90);g.arc(x0+150,b-90,30,Math.PI,0);g.lineTo(x0+180,b);g.closePath();g.fill();g.fillStyle='#1e2226';g.beginPath();g.moveTo(x0+126,b);g.lineTo(x0+126,b-90);g.arc(x0+150,b-90,24,Math.PI,0);g.lineTo(x0+174,b);g.closePath();g.fill();
  g.strokeStyle='#5a5e66';g.lineWidth=1;for(let k=0;k<5;k++){g.beginPath();g.arc(x0+150,b-90,6+k*4,Math.PI,0);g.stroke()}
  g.fillStyle='#c8bca2';g.beginPath();g.moveTo(x1-190,b);g.lineTo(x1-190,b-60);g.arc(x1-110,b-60,80,Math.PI,0);g.lineTo(x1-30,b);g.closePath();g.fill();g.fillStyle='rgba(60,70,80,.9)';g.beginPath();g.moveTo(x1-182,b);g.lineTo(x1-182,b-60);g.arc(x1-110,b-60,72,Math.PI,0);g.lineTo(x1-38,b);g.closePath();g.fill();
  lgShop(g,x0+10,x0+100,'#2a4a3a','LIBRAIRIE',{door:x0+55})}
function lgCreditLyonnais(g,c0,c1,R){// l'ancienne banque : rotonde d'angle à dôme, façade classique, inscription gravée, colonnes, balustres
  const x0=c0*T,x1=c1*T,b=LG.BASE,n=3,top=b-LG.GF-n*LG.FH-20,xr=x0+5*T;lgAshlar(g,x0,top,x1,b,'#e2d6be',R);
  // bossages du rez-de-chaussée
  g.strokeStyle='rgba(0,0,0,.12)';g.lineWidth=2;for(let y=b-LG.GF+10;y<b;y+=14){g.beginPath();g.moveTo(x0,y);g.lineTo(x1,y);g.stroke()}
  // la rotonde et son dôme à écailles
  const gr=g.createLinearGradient(x0,0,xr,0);gr.addColorStop(0,'rgba(0,0,0,.18)');gr.addColorStop(.5,'rgba(255,255,255,.1)');gr.addColorStop(1,'rgba(0,0,0,.1)');g.fillStyle=gr;g.fillRect(x0,top,xr-x0,b-top);
  for(let k=1;k<=n;k++){const y=b-LG.GF-(k-1)*LG.FH;lgWin(g,x0+30,y-70,26,52,{frame:'#ece2cc',lintel:'#d4c8ae',key:1});lgWin(g,x0+120,y-70,26,52,{frame:'#ece2cc',lintel:'#d4c8ae',key:1})}
  g.fillStyle='#8a9aa6';g.beginPath();g.moveTo(x0-4,top);g.quadraticCurveTo(x0+2,top-90,(x0+xr)/2,top-118);g.quadraticCurveTo(xr-2,top-90,xr+4,top);g.closePath();g.fill();
  g.strokeStyle='rgba(60,70,80,.4)';g.lineWidth=1;for(let k=1;k<6;k++){g.beginPath();g.ellipse((x0+xr)/2,top,(xr-x0)/2*(1-k*.12),118*(1-k*.16),0,Math.PI,0);g.stroke()}
  g.fillStyle='#d8ccb0';g.fillRect((x0+xr)/2-8,top-140,16,24);g.beginPath();g.arc((x0+xr)/2,top-140,10,Math.PI,0);g.fill();
  g.fillStyle='#d4c8ae';g.fillRect(x0-6,top-6,x1-x0+12,8);g.fillStyle='rgba(0,0,0,.12)';g.fillRect(x0-6,top+2,x1-x0+12,3);
  lgMansard(g,xr,x1,top-6,40,{dormers:6,style:'oeil',dcol:'#e2d6be'});
  // la façade : avant-corps central à colonnes, fronton, inscription
  const mx=(xr+x1)/2;g.fillStyle='#d8ccb0';g.fillRect(mx-140,top-40,280,40);g.fillStyle='#e6dac2';g.fillRect(mx-130,top-34,260,26);g.fillStyle='#6a5a44';g.font='bold 15px '+F_DISP;g.textAlign='center';g.fillText('CRÉDIT LYONNAIS',mx,top-15);
  g.fillStyle='#d8ccb0';poly(g,[mx-70,top-40,mx,top-70,mx+70,top-40]);g.fill();g.fillStyle='#c8bca2';g.beginPath();g.arc(mx,top-50,10,0,7);g.fill();
  for(const cx of[mx-100,mx-34,mx+34,mx+100]){g.fillStyle='#e8dcc4';g.fillRect(cx-8,top+4,16,b-LG.GF-top-4);g.fillStyle='rgba(0,0,0,.08)';for(let k=-6;k<8;k+=4)g.fillRect(cx+k,top+4,1,b-LG.GF-top-4);g.fillStyle='#d4c8ae';g.fillRect(cx-12,top,24,8)}
  for(let k=1;k<=n;k++){const y=b-LG.GF-(k-1)*LG.FH;for(const wx of[mx-80,mx-12,mx+56,xr+30,xr+90,x1-150,x1-90])lgWin(g,wx-12,y-70,26,52,{frame:'#ece2cc',lintel:'#d4c8ae',key:1});
    if(k===2)for(const bx of[mx-90,mx-22,mx+46])lgBalcony(g,bx,bx+46,y,'stone')}
  for(const ox of[xr+60,x1-60]){g.strokeStyle='#4a4e54';g.lineWidth=2;g.beginPath();g.ellipse(ox,b-LG.GF-30,12,16,0,0,7);g.stroke()}
  // rez-de-chaussée : cinq portes bleues, la lanterne de fer forgé
  for(let i=0;i<5;i++){const dx=xr+40+i*((x1-xr-80)/5);g.fillStyle='#d4c8ae';g.fillRect(dx-6,b-96,52,96);g.fillStyle='#1e3a8a';g.fillRect(dx,b-90,40,90);g.fillStyle='rgba(200,220,240,.3)';g.fillRect(dx+6,b-84,12,70);g.fillRect(dx+22,b-84,12,70)}
  for(const lx of[xr+20,x1-30]){g.strokeStyle='#2a2c30';g.lineWidth=2;g.beginPath();g.moveTo(lx,b-LG.GF-10);g.quadraticCurveTo(lx+16,b-LG.GF-30,lx+24,b-LG.GF-14);g.stroke();g.fillStyle='#2a2c30';g.fillRect(lx+18,b-LG.GF-14,12,16);g.fillStyle='rgba(255,230,170,.7)';g.fillRect(lx+20,b-LG.GF-12,8,10)}
}
function lgCathedrale(g,c0,c1,R){// le flanc nord de la cathédrale : bas-côté, contreforts à pinacles et anges dans leurs niches, arcs-boutants, fenêtres hautes, toit d'ardoise ; devant, le vieux mur à arcades
  const x0=c0*T+50,x1=c1*T+400,b=LG.BASE,stone='#cdbd98',stone2='#bba984',dark='#3a4250';
  // le vaisseau central : fenêtres hautes, balustrade, toit et sa crête
  const nt=-40,nb=300;g.fillStyle=stone;g.fillRect(x0+60,nt,x1-x0,b-nt);g.fillStyle='rgba(0,0,0,.06)';for(let y=nt;y<b;y+=9)g.fillRect(x0+60,y,x1-x0,1);
  g.fillStyle=LGC.slate;poly(g,[x0+40,nt,x0+80,nt-140,x1,nt-140,x1,nt]);g.fill();g.fillStyle='#8a7a5a';for(let x=x0+90;x<x1;x+=14)g.fillRect(x,nt-150,4,12);
  g.fillStyle=stone2;g.fillRect(x0+60,nt-6,x1-x0,10);for(let x=x0+64;x<x1;x+=10)g.fillRect(x,nt-20,4,14);g.fillRect(x0+60,nt-22,x1-x0,4);
  for(let x=x0+120;x<x1;x+=150){g.fillStyle=dark;g.beginPath();g.moveTo(x,nb-10);g.lineTo(x,nt+70);g.lineTo(x+30,nt+30);g.lineTo(x+60,nt+70);g.lineTo(x+60,nb-10);g.closePath();g.fill();
    g.strokeStyle='#9a8a66';g.lineWidth=2;g.beginPath();g.moveTo(x+30,nt+34);g.lineTo(x+30,nb-10);g.moveTo(x,nt+150);g.lineTo(x+60,nt+150);g.stroke();g.beginPath();g.arc(x+30,nt+90,12,0,7);g.stroke()}
  // le bas-côté, ses fenêtres
  const at=nb;g.fillStyle=stone2;g.fillRect(x0,at,x1-x0,b-at);g.fillStyle=LGC.slate2;poly(g,[x0,at,x0+30,at-40,x1,at-40,x1,at]);g.fill();
  for(let x=x0+60;x<x1;x+=150){g.fillStyle=dark;g.beginPath();g.moveTo(x,b-60);g.lineTo(x,at+70);g.lineTo(x+24,at+36);g.lineTo(x+48,at+70);g.lineTo(x+48,b-60);g.closePath();g.fill();g.strokeStyle='#9a8a66';g.lineWidth=1.5;g.beginPath();g.moveTo(x+24,at+40);g.lineTo(x+24,b-60);g.stroke()}
  // les contreforts, leurs pinacles, l'ange dans sa niche, l'arc-boutant
  for(let x=x0+10;x<x1;x+=150){g.fillStyle='#c2b08a';g.fillRect(x,at-120,40,b-at+120);g.fillStyle='rgba(0,0,0,.12)';g.fillRect(x+32,at-120,8,b-at+120);
    g.fillStyle='#b4a27c';g.fillRect(x+4,at-180,32,60);poly(g,[x,at-180,x+20,at-260,x+40,at-180]);g.fill();g.fillStyle=dark;g.fillRect(x+12,at-170,16,40);g.fillStyle='#ddd0b0';g.beginPath();g.arc(x+20,at-158,4,0,7);g.fill();g.fillRect(x+16,at-154,8,18);g.fillStyle='rgba(220,210,180,.8)';poly(g,[x+16,at-150,x+8,at-160,x+16,at-142]);g.fill();
    for(let k=0;k<5;k++){g.fillStyle='#a8966e';g.fillRect(x+18-1,at-260+k*14-2,4,4)}
    g.strokeStyle='#b4a27c';g.lineWidth=12;g.beginPath();g.moveTo(x+36,at-150);g.quadraticCurveTo(x+80,at-200,x+120,nt+120);g.stroke();g.strokeStyle='rgba(0,0,0,.12)';g.lineWidth=3;g.beginPath();g.moveTo(x+36,at-142);g.quadraticCurveTo(x+80,at-192,x+120,nt+128);g.stroke()}
  // le vieux mur à arcades, en moellons
  const wx0=c0*T,wx1=wx0+360;g.fillStyle='#9a8a6c';g.fillRect(wx0,b-160,wx1-wx0,160);g.fillStyle='rgba(0,0,0,.12)';for(let k=0;k<160;k++)g.fillRect(wx0+R()*(wx1-wx0),b-160+R()*160,8,5);
  for(let i=0;i<5;i++){const ax=wx0+30+i*64;g.fillStyle='#5a5444';g.beginPath();g.moveTo(ax,b-20);g.lineTo(ax,b-90);g.arc(ax+24,b-90,24,Math.PI,0);g.lineTo(ax+48,b-20);g.closePath();g.fill()}
  g.fillStyle='#7a6a4c';g.fillRect(wx0-4,b-166,wx1-wx0+8,8);g.fillStyle=LGC.slate2;poly(g,[wx0-4,b-166,wx0+20,b-190,wx1-20,b-190,wx1+4,b-166]);g.fill();
}
/* une rue transversale qui s'enfonce entre deux immeubles */
function lgRue(g,c0,c1,o){
  const a=c0*T,e=c1*T,b=LG.BASE,vx=(a+e)/2,HZ=b-70,top=b-LG.GF-4*LG.FH;
  const sk=g.createLinearGradient(0,top,0,HZ);sk.addColorStop(0,'#a8b6c4');sk.addColorStop(1,'#dad8d0');g.fillStyle=sk;g.fillRect(a,top-60,e-a,HZ-top+62);
  // au bout de la rue
  g.fillStyle=o.endCol||'#cfc3aa';g.fillRect(vx-40,HZ-90,80,92);g.fillStyle=LGC.slate;poly(g,[vx-44,HZ-90,vx-36,HZ-106,vx+36,HZ-106,vx+44,HZ-90]);g.fill();
  if(o.dome){g.fillStyle='#7a8a96';g.beginPath();g.arc(vx+20,HZ-106,16,Math.PI,0);g.fill()}
  for(let r=0;r<3;r++)for(let k=0;k<4;k++){g.fillStyle='#5a6878';g.fillRect(vx-34+k*18,HZ-80+r*24,8,14)}
  for(const sd of[-1,1]){const xn=sd<0?a:e,xf=vx+sd*44;const yt=u=>top-40+(HZ-130-(top-40))*u,yb=u=>b+(HZ-b)*u;
    g.fillStyle=sd<0?(o.lcol||'#d8ccb4'):(o.rcol||'#c8b89c');poly(g,[xn,top-40,xf,HZ-130,xf,HZ,xn,b]);g.fill();g.fillStyle='rgba(0,0,0,.12)';poly(g,[xn,top-40,xf,HZ-130,xf,HZ,xn,b]);g.fill();
    for(let k=0;k<7;k++){const u0=1-1/(1+k*.5),u1=1-1/(1+(k+.55)*.5),x0=xn+(xf-xn)*u0,x1=xn+(xf-xn)*u1;for(let f=0;f<5;f++){const v0=.1+f*.16,v1=v0+.09;g.fillStyle='rgba(70,82,98,.8)';poly(g,[x0,yt(u0)+(yb(u0)-yt(u0))*v0,x1,yt(u1)+(yb(u1)-yt(u1))*v0,x1,yt(u1)+(yb(u1)-yt(u1))*v1,x0,yt(u0)+(yb(u0)-yt(u0))*v1]);g.fill()}}
    g.fillStyle='#c8c2b4';poly(g,[xn,b,xf,HZ,xf-sd*8,HZ,xn-sd*30,b]);g.fill()}
  g.fillStyle=o.cobble?'#8a8478':'#6e7076';poly(g,[a+30,b,vx-36,HZ,vx+36,HZ,e-30,b]);g.fill();
  if(o.cobble){g.strokeStyle='rgba(0,0,0,.12)';g.lineWidth=1;for(let k=1;k<10;k++){const u=1-1/(1+k*.4),y=b+(HZ-b)*u,hw=(e-a-60)/2*(1-u)+36*u;g.beginPath();g.moveTo(vx-hw,y);g.lineTo(vx+hw,y);g.stroke()}}
  for(let k=0;k<3;k++){const u=1-1/(1+(k+1)*.6),y=b+(HZ-b)*u,s=1-u;g.fillStyle=['#e8e8e8','#5a6a7a','#a8302a'][k];rr(g,vx-10+(k-1)*14*s,y-18*s,26*s,16*s,3*s);g.fill()}
  if(o.stop){g.fillStyle='#c8302a';g.beginPath();for(let k=0;k<8;k++){const an=k/8*Math.PI*2+Math.PI/8;g.lineTo(e-24+Math.cos(an)*14,b-104+Math.sin(an)*14)}g.fill();g.fillStyle='#fff';g.font='bold 7px '+F_DISP;g.textAlign='center';g.fillText('STOP',e-24,b-101);g.fillStyle='#5a5e66';g.fillRect(e-25,b-90,3,90)}
}

/* ---------- la couche des façades (en cache) ---------- */
function langletBuild(Lv){
  const wpx=Lv.wpx+40,hpx=ROWS*T+PAD,TR=Math.min(RS,1),{layer:c,g}=mkLayer(wpx*TR,hpx*TR);g.scale(TR,TR);c.rs=TR;g.translate(0,PAD);const R=mulberry(Lv.def.seed+21);
  const D=Lv.def.langlet;for(const f of D.facades){g.save();
    if(f.k==='rotonde')lgRotonde(g,f.c0,f.c1,R);else if(f.k==='hotel')lgHotelBrique(g,f.c0,f.c1,R);else if(f.k==='rue')lgRue(g,f.c0,f.c1,f);else if(f.k==='gothique')lgGothique(g,f.c0,f.c1,R);
    else if(f.k==='verre')lgVerre(g,f.c0,f.c1);else if(f.k==='moderne')lgModerne(g,f.c0,f.c1);else if(f.k==='blanc')lgBanqueBlanche(g,f.c0,f.c1,R);else if(f.k==='nouveau')lgArtNouveau(g,f.c0,f.c1,R);
    else if(f.k==='cl')lgCreditLyonnais(g,f.c0,f.c1,R);else if(f.k==='cathedrale')lgCathedrale(g,f.c0,f.c1,R);else lgImm(g,f,R);g.restore()}
  // mobilier du trottoir : arbres en grille, lampadaires, potelets, l'arrêt du tram
  for(const tx of D.trees){const x=tx*T;g.strokeStyle='#4a3a2c';g.lineWidth=4;g.beginPath();g.moveTo(x,LG.BASE);g.lineTo(x,LG.BASE-170);g.stroke();g.lineWidth=1.5;for(let k=0;k<9;k++){const y=LG.BASE-70-k*12;g.beginPath();g.moveTo(x,y);g.lineTo(x+(k%2?1:-1)*(16+k*3),y-26);g.stroke()}
    g.fillStyle='#3a3c40';g.fillRect(x-22,LG.BASE-4,44,4)}
  for(const lx of D.lamps){const x=lx*T;g.fillStyle='#2a2c30';g.fillRect(x-2,LG.BASE-200,5,200);g.fillStyle='#3a3e44';rr(g,x-10,LG.BASE-214,22,16,4);g.fill();g.fillStyle='rgba(255,240,200,.6)';g.fillRect(x-6,LG.BASE-200,14,3)}
  for(let x=D.bollards[0]*T;x<D.bollards[1]*T;x+=36){g.fillStyle='#2a2c30';g.fillRect(x,LG.BASE-28,5,28)}
  {const x=D.shelter*T;g.fillStyle='rgba(200,220,230,.4)';g.fillRect(x,LG.BASE-140,150,130);g.strokeStyle='#4a5058';g.lineWidth=3;g.strokeRect(x,LG.BASE-140,150,130);g.fillStyle='#4a5058';g.fillRect(x-10,LG.BASE-150,170,10);
    g.fillStyle='#e8e2d4';g.fillRect(x+96,LG.BASE-130,46,80);g.fillStyle='#6a3a8a';g.fillRect(x+100,LG.BASE-126,38,60);g.fillStyle='#2a2a2a';g.font='bold 8px '+F_DISP;g.textAlign='center';g.fillText('LANGLET',x+75,LG.BASE-154)}
  return c;
}

/* ---------- après lecture : le tramway, les touristes ---------- */
function langletPost(Lv){
  const D=Lv.def.langlet;if(!D)return;
  const tram={axis:'g',kind:'tram3',x:-9999,y:99999,w:520,h:14,vh:118,dx:0,dy:0,t:0,speed:0,a0:0,a1:0,on:false,dir:-1,col:'#c8302a'};Lv.movers.push(tram);
  const S3={tram,tramT:6,warn:0,groups:[],said:{}};Lv.lg=S3;
  for(const gr of D.groups){const n=gr.n||5;const m=[];for(let i=0;i<n;i++)m.push({dx:i*30-(n-1)*15,k:i===0?'guide':['photo','sac','chapeau','enfant','photo'][i%5],ph:i*1.3});S3.groups.push({x:gr.c*T,a:gr.a*T,b:gr.b*T,dir:1,st:'walk',t:0,m})}
}
function lgTramSet(m,x,on){m.x=x;m.on=on;m.y=on?LG.BASE-m.vh:99999;if(!on&&P.onMover===m){P.onMover=null;P.onGround=false}}
function langletStep(dt){
  const S3=L.lg;if(!S3)return;const pcx=P.x+P.w/2,F=LG.BASE,m=S3.tram,hb={x:P.x+3,y:P.y+4,w:P.w-6,h:P.h-6};
  // le tramway : il sonne, puis traverse tout l'écran ; on peut monter sur son toit
  const px=m.x;if(m.on){m.x+=m.dir*240*dt;if((m.dir<0&&m.x+m.w<cam.x-300)||(m.dir>0&&m.x>cam.x+W+300))lgTramSet(m,-9999,false)}
  else{S3.tramT-=dt;if(S3.tramT<1.6&&!S3.warn){S3.warn=1;S3.ndir=rnd()<.5?-1:1;if(!G.sim){tone(1320,.18,'triangle',.08);tone(1320,.18,'triangle',.08,null,.25);bubble(S3.ndir<0?cam.x+W-60:cam.x+60,F-150,'Ding ding !','#2a3a5a')}}
    if(S3.tramT<=0){m.dir=S3.ndir||-1;m.col=pick(['#c8302a','#2a6ab8','#e0a020','#5aa040','#8a3a9a']);lgTramSet(m,m.dir<0?cam.x+W+40:cam.x-m.w-40,true);S3.tramT=9+rnd()*6;S3.warn=0;
      if(!S3.said.tram&&!G.sim){S3.said.tram=1;setTimeout(()=>say("Un tramway sans chevaux ni fil, qui sonne comme une cloche de vache. Et il roule sur la chaussée, comme chez lui.",4),1500)}}}
  m.dx=m.on?m.x-px:0;
  if(m.on&&!P.dead&&P.onMover!==m&&overlap(hb,{x:m.x+10,y:m.y+10,w:m.w-20,h:m.vh-10}))G.lgHit='tram';
  // les groupes de touristes : ils avancent derrière leur guide, s'arrêtent pour photographier
  for(const gp of S3.groups){gp.t+=dt;
    if(gp.st==='walk'){gp.x+=gp.dir*28*dt;if(gp.x<gp.a){gp.x=gp.a;gp.dir=1}if(gp.x>gp.b){gp.x=gp.b;gp.dir=-1}if(gp.t>5+((gp.a/T)%3)){gp.st='photo';gp.t=0;if(!G.sim&&Math.abs(gp.x-pcx)<700)noise(.05,4000,.06,'highpass')}}
    else if(gp.t>2.6){gp.st='walk';gp.t=0}
    if(!P.dead)for(const mb of gp.m){const x=gp.x+mb.dx*gp.dir,h=mb.k==='enfant'?64:94;if(overlap(hb,{x:x-10,y:F-h,w:20,h})){G.lgHit='touristes';break}}
    if(!S3.said.tour&&Math.abs(gp.x-pcx)<380&&!G.sim){S3.said.tour=1;say("Une troupe en civil derrière un chef qui lève un parapluie. Ils mitraillent les façades avec de petites boîtes.",4)}}
}
function langletAfterMove(){if(G.lgHit){const k=G.lgHit;G.lgHit=null;return k}return null}
function langletRespawn(){const S3=L.lg;if(!S3)return;if(S3.tram.on)lgTramSet(S3.tram,-9999,false);S3.tramT=Math.max(S3.tramT,4);S3.warn=0;for(const gp of S3.groups)if(Math.abs(gp.x-P.cp.x)<260)gp.x=clamp(P.cp.x+(gp.x<P.cp.x?-1:1)*320,gp.a,gp.b)}

/* ---------- dessin ---------- */
function drawLangletBack(t,cx){const Lv=L;if(!Lv.lgLayer)return;const tr=Lv.lgLayer.rs||1,sx=Math.max(0,cx-30),sw=Math.min(W+80,Lv.lgLayer.width/tr-sx);if(sw>0)blitLayer(ctx,Lv.lgLayer,sx*tr,0,sw*tr,Lv.lgLayer.height,sx,-PAD,sw,Lv.lgLayer.height/tr)}
function drawLangletMid(t){
  const S3=L.lg;if(!S3)return;const g=ctx,F=LG.BASE;
  // les rails du tram, encastrés dans le pavé
  g.fillStyle='#6a6a68';g.fillRect(cam.x-20,F+3,W+40,3);g.fillRect(cam.x-20,F+14,W+40,3);g.fillStyle='rgba(255,255,255,.25)';g.fillRect(cam.x-20,F+3,W+40,1);g.fillRect(cam.x-20,F+14,W+40,1);
  for(const gp of S3.groups)if(gp.x>cam.x-300&&gp.x<cam.x+W+300)for(const mb of gp.m)drawTouriste(g,gp.x+mb.dx*gp.dir,F,gp.dir,mb,gp.st,t);
  if(S3.tram.on)drawTram3(g,S3.tram,t);
}
function drawTouriste(g,x,F,f,mb,st,t){
  const k=mb.k,small=k==='enfant',s=small?.68:1,walk=st==='walk'?Math.sin(t*6+mb.ph):0;g.save();g.translate(x,F);g.scale(f*s,s);
  const coat={guide:'#c8302a',photo:'#3a6a9a',sac:'#5a7a3a',chapeau:'#e0c060',enfant:'#e07a3a'}[k]||'#5a5a5a';
  g.strokeStyle='#2a2c34';g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(0,-46);g.lineTo(walk*10,-4);g.moveTo(0,-46);g.lineTo(-walk*10,-4);g.stroke();
  g.fillStyle=coat;rr(g,-12,-94,24,52,8);g.fill();if(k==='sac'){g.fillStyle='#3a4a2a';rr(g,-22,-88,12,30,4);g.fill()}
  g.fillStyle='#e8c8a8';g.beginPath();g.arc(2,-104,10,0,7);g.fill();g.fillStyle=k==='chapeau'?'#f0ece0':'#3a2a1a';
  if(k==='chapeau'){g.fillRect(-12,-112,28,4);g.fillRect(-6,-122,16,10)}else{g.beginPath();g.arc(2,-108,10,Math.PI,0);g.fill()}
  g.fillStyle='#111';g.beginPath();g.arc(7,-105,1.3,0,7);g.fill();
  g.strokeStyle=coat;g.lineWidth=6;
  if(k==='guide'){g.beginPath();g.moveTo(6,-86);g.lineTo(14,-120);g.stroke();g.strokeStyle='#2a2a2a';g.lineWidth=2;g.beginPath();g.moveTo(14,-120);g.lineTo(14,-150);g.stroke();g.fillStyle='#f0d040';poly(g,[14,-150,36,-144,14,-136]);g.fill()}
  else if((k==='photo'||k==='chapeau')&&st==='photo'){g.beginPath();g.moveTo(6,-86);g.lineTo(14,-102);g.stroke();g.fillStyle='#1a1a1e';g.fillRect(10,-110,14,10);if(Math.sin(t*9+mb.ph)>.92){g.fillStyle='rgba(255,255,240,.9)';g.beginPath();g.arc(24,-106,8,0,7);g.fill()}}
  else{g.beginPath();g.moveTo(6,-86);g.lineTo(8+walk*4,-56);g.stroke()}
  g.lineCap='butt';g.restore();
}
function drawTram3(g,m,t){// le tram de Reims : nez arrondi en tulipe, couleur vive, caisse blanche, larges vitres
  const x=m.x,w=m.w,h=m.vh,F=LG.BASE,y=F-h,f=m.dir;g.save();
  g.fillStyle='#ecebe6';rr(g,x+30,y,w-60,h-16,8);g.fill();g.fillStyle='rgba(0,0,0,.08)';g.fillRect(x+30,y+h-30,w-60,14);
  g.fillStyle='#3a4a5a';for(let k=0;k<7;k++){const wx=x+60+k*62;if(wx>x+w-90)break;rr(g,wx,y+22,46,44,5);g.fill();g.fillStyle='rgba(255,255,255,.18)';g.fillRect(wx+4,y+24,8,40);g.fillStyle='#3a4a5a'}
  for(const dx of[x+150,x+330]){g.fillStyle='#9aa0a8';g.fillRect(dx,y+20,40,h-36);g.fillStyle='rgba(30,40,50,.7)';g.fillRect(dx+3,y+24,16,h-48);g.fillRect(dx+21,y+24,16,h-48)}
  g.fillStyle='#2a2c30';g.fillRect(x+w/2-2,y+8,4,h-24);   // l'articulation
  for(const sd of[-1,1]){const nx=sd<0?x+30:x+w-30;g.fillStyle=m.col;g.beginPath();g.moveTo(nx,y);g.quadraticCurveTo(nx+sd*40,y+4,nx+sd*30,y+h-16);g.lineTo(nx,y+h-16);g.closePath();g.fill();
    g.fillStyle='#22303e';g.beginPath();g.moveTo(nx,y+10);g.quadraticCurveTo(nx+sd*28,y+12,nx+sd*22,y+60);g.lineTo(nx,y+62);g.closePath();g.fill();
    g.fillStyle='#fff6d0';g.beginPath();g.ellipse(nx+sd*24,y+h-30,4,3,0,0,7);g.fill()}
  g.fillStyle=m.col;g.fillRect(x+30,y+h-34,w-60,6);g.fillStyle='#2a2c30';g.fillRect(x+30,y+h-16,w-60,6);
  g.fillStyle='#1e1e22';for(const bx of[x+70,x+w/2-40,x+w/2+40,x+w-70]){g.fillRect(bx-16,F-12,32,10)}
  g.fillStyle='#f0f0e8';g.font='bold 9px '+F_DISP;g.textAlign='center';g.fillText(f<0?'NEUFCHÂTEL':'HÔPITAL DEBRÉ',x+w/2,y+14);
  g.restore();
}
