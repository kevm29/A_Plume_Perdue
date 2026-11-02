/* =========================================================
   3-4 · LA CATHÉDRALE — l'escalade de la façade occidentale de Notre-Dame de Reims, au soleil couchant
   ---------------------------------------------------------
   Toute la façade est peinte une fois, dans une couche en cache (statues, rosaces, gâbles, pinacles à crochets,
   croix, la galerie des rois, les tours). Les plateformes sont des planches invisibles (t) posées sur les corniches,
   les consoles et les dais des statues : le dessin place une corniche exactement au sommet de chaque planche.
   Dangers, en direct :
     · les pigeons sauteurs (vol en cloche d'un point à l'autre) et les pigeons mendiants (aller-retour) ;
     · les gargouilles de pierre n°1 : elles crachent droit sur la console du dessous ;
     · les gargouilles de pierre n°2 : leur jet balaie, de proche en proche, plusieurs dais ;
     · les pigeons « chieurs » : chacun lâche sa fiente sur ce qui est dessous, pas tous en même temps ;
     · les rats (cases k), sur le faîte du gâble et sur la galerie des rois.
   ========================================================= */
THEMES.facade={outdoor:true,far:'facade',horizon:'facade',sky:['#26315e','#b77a8c','#f2b27a'],celestial:'none',fog:'#d89a7a',dark:0,weather:'none',
  floor:'#6e6058',floorTop:'#b49a84',type:'stone',x:'none',d:'drape',shelf:'girder',spike:'spikes',spikeCol:'#3a3e46',spikeBase:'#2a2c32',walker:'rat',flyer:'crow',awning:'#2f5a7a',props:[]};

/* la géométrie de la façade (en pixels du monde) */
const FC={AX:940,ED:700,OB:540,IB:220,G:56*T};
const FCC={lit:'#ead0a8',mid:'#c6a37a',sh:'#8c6c52',deep:'#4c3e48',dark:'#2a2230',glass:'#28304e',gl2:'#3a2a4a',warm:'rgba(255,178,110,'};
const fcY=r=>r*T;   // sommet d'une planche de la ligne r

/* ---------- ciel du soir, toits de Reims au loin ---------- */
function facadeFar(L,g,wpx,R){
  const sk=g.createLinearGradient(0,-1400,0,600);sk.addColorStop(0,'#1c2550');sk.addColorStop(.45,'#4a4a7a');sk.addColorStop(.72,'#b77a8c');sk.addColorStop(.88,'#f0a476');sk.addColorStop(1,'#f8cf90');
  g.fillStyle=sk;g.fillRect(0,-1400,wpx,2000);
  // le soleil couchant, derrière nous : seulement son halo sur les nuages
  for(let k=0;k<26;k++){const x=R()*wpx,y=-200+R()*620,s=40+R()*70;g.fillStyle='rgba(255,'+(170+R()*50|0)+','+(130+R()*40|0)+','+(.18+R()*.22)+')';
    for(let j=0;j<4;j++){g.beginPath();g.ellipse(x+(j-1.5)*s*.8,y+(j%2)*6,s,s*.22,0,0,7);g.fill()}}
  g.fillStyle='rgba(255,240,220,.6)';for(let k=0;k<30;k++)g.fillRect(R()*wpx,-1300+R()*700,1.3,1.3);
  // toits de la ville, au loin, qui s'allument
  let x=0;while(x<wpx){const w=40+R()*70,h=30+R()*50;g.fillStyle='rgba(70,52,72,.55)';g.fillRect(x,560-h,w,h+40);poly(g,[x,560-h,x+8,560-h-12,x+w-8,560-h-12,x+w,560-h]);g.fill();
    if(R()<.5){g.fillStyle='rgba(255,200,120,.55)';g.fillRect(x+R()*(w-8),566-h+R()*20,4,5)}x+=w}
}

/* ---------- outils de sculpture ---------- */
function fcStone(g,x0,y0,x1,y1,R,col){g.fillStyle=col||FCC.mid;g.fillRect(x0,y0,x1-x0,y1-y0);g.fillStyle='rgba(60,40,30,.07)';for(let y=y0+14;y<y1;y+=14){g.fillRect(x0,y,x1-x0,1);for(let x=x0+((y/14|0)%2?18:0);x<x1;x+=36)g.fillRect(x,y-14,1,14)}
  for(let k=0;k<(x1-x0)*(y1-y0)/900;k++){g.fillStyle=R()<.5?'rgba(90,64,48,.08)':'rgba(255,230,190,.07)';g.fillRect(x0+R()*(x1-x0),y0+R()*(y1-y0),6+R()*10,3)}}
// arc brisé : chemin du contour d'une ogive de largeur w, du sol (yb) au sommet (yb-h)
function fcOgive(g,x,yb,w,h){const r=w*.85,sp=yb-h+Math.sqrt(r*r-(r-w/2)*(r-w/2));g.moveTo(x-w/2,yb);g.lineTo(x-w/2,sp);
  g.arc(x-w/2+r,sp,r,Math.PI,Math.PI+Math.acos((r-w/2)/r));g.arc(x+w/2-r,sp,r,-Math.acos((r-w/2)/r),0);g.lineTo(x+w/2,yb);g.closePath()}
function fcOgivePath(g,x,yb,w,h){g.beginPath();fcOgive(g,x,yb,w,h)}
// crochets : les petits « picots » feuillus le long d'un rampant ou d'une flèche
function fcCrockets(g,xa,ya,xb,yb,step,side,col){const L2=Math.hypot(xb-xa,yb-ya),n=Math.floor(L2/step),ux=(xb-xa)/L2,uy=(yb-ya)/L2,nx=uy*side,ny=-ux*side;g.fillStyle=col||FCC.lit;
  for(let i=1;i<n;i++){const x=xa+ux*i*step,y=ya+uy*i*step;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+nx*7-ux*2,y+ny*7-uy*2,x+nx*5+ux*4,y+ny*5+uy*4);g.quadraticCurveTo(x+nx*2+ux*3,y+ny*2+uy*3,x+ux*2,y+uy*2);g.fill()}}
// fleuron au sommet d'une flèche ou d'un gâble
function fcFinial(g,x,y,s,col){g.fillStyle=col||FCC.lit;s=s||1;g.beginPath();g.ellipse(x,y-6*s,3*s,6*s,0,0,7);g.fill();g.beginPath();g.ellipse(x-4*s,y-3*s,4*s,2*s,-.4,0,7);g.fill();g.beginPath();g.ellipse(x+4*s,y-3*s,4*s,2*s,.4,0,7);g.fill();g.fillRect(x-1*s,y-2*s,2*s,4*s)}
function fcCross(g,x,y,s,col){g.fillStyle=col||'#3a2e2a';s=s||1;g.fillRect(x-1.6*s,y-26*s,3.2*s,26*s);g.fillRect(x-8*s,y-20*s,16*s,3.2*s);g.fillStyle='rgba(255,210,150,.6)';g.fillRect(x-1.6*s,y-26*s,1.2*s,26*s);
  for(const[dx,dy]of[[0,-27],[-8.5,-18.5],[8.5,-18.5]]){g.fillStyle=col||'#3a2e2a';g.beginPath();g.arc(x+dx*s,y+dy*s,2.4*s,0,7);g.fill()}}
// pinacle : fût, gâblets, flèche à crochets, fleuron
function fcPinnacle(g,x,yb,w,h,R){const sh=h*.42,yt=yb-sh;g.fillStyle=FCC.mid;g.fillRect(x-w/2,yt,w,sh);g.fillStyle='rgba(0,0,0,.18)';g.fillRect(x+w/6,yt,w/3,sh);
  g.fillStyle=FCC.deep;fcOgivePath(g,x-w/4,yb-sh*.25,w/3.4,sh*.55);g.fill();fcOgivePath(g,x+w/4,yb-sh*.25,w/3.4,sh*.55);g.fill();
  g.fillStyle=FCC.lit;poly(g,[x-w/2-2,yt+2,x,yt-w*.7,x+w/2+2,yt+2]);g.fill();
  g.fillStyle=FCC.mid;poly(g,[x-w*.38,yt,x,yb-h,x+w*.38,yt]);g.fill();g.fillStyle='rgba(0,0,0,.15)';poly(g,[x,yt,x,yb-h,x+w*.38,yt]);g.fill();
  fcCrockets(g,x-w*.38,yt,x,yb-h,9,1);fcCrockets(g,x+w*.38,yt,x,yb-h,9,-1,FCC.sh);fcFinial(g,x,yb-h+2,w/14)}
// gâble à crochets avec, au tympan, un trilobe ou un relief, et une croix ou un fleuron
function fcGable(g,x0,x1,yb,h,o){o=o||{};const cx=(x0+x1)/2,yt=yb-h;g.fillStyle=FCC.mid;poly(g,[x0,yb,cx,yt,x1,yb]);g.fill();g.fillStyle='rgba(0,0,0,.12)';poly(g,[cx,yb,cx,yt,x1,yb]);g.fill();
  g.strokeStyle=FCC.lit;g.lineWidth=5;g.beginPath();g.moveTo(x0-3,yb+2);g.lineTo(cx,yt-4);g.lineTo(x1+3,yb+2);g.stroke();g.strokeStyle=FCC.sh;g.lineWidth=1.5;g.beginPath();g.moveTo(x0+6,yb);g.lineTo(cx,yt+8);g.lineTo(x1-6,yb);g.stroke();
  fcCrockets(g,x0,yb,cx,yt,11,1);fcCrockets(g,x1,yb,cx,yt,11,-1);
  if(o.trefoil){const ty=yb-h*.42,r=Math.min(h,(x1-x0))*.12;g.fillStyle=FCC.deep;for(const[dx,dy]of[[0,-r],[-r*.9,r*.4],[r*.9,r*.4]]){g.beginPath();g.arc(cx+dx,ty+dy,r,0,7);g.fill()}}
  if(o.cross)fcCross(g,cx,yt-4,o.cross);else fcFinial(g,cx,yt-2,1.2)}
// statue debout dans sa niche : socle, robe à plis, manteau, bras, tête, couronne / auréole / mitre / ailes, dais au-dessus
function fcStatue(g,x,yb,h,o,R){o=o||{};const s=h/100;g.save();g.translate(x,yb);g.scale(s,s);
  if(o.niche!==false){g.fillStyle=FCC.deep;fcOgivePath(g,0,6,56,128);g.fill();g.fillStyle='rgba(255,170,110,.07)';g.fillRect(-28,-80,10,86)}
  // socle sculpté
  g.fillStyle=FCC.mid;g.fillRect(-20,0,40,8);g.fillStyle=FCC.sh;g.beginPath();g.moveTo(-16,8);g.lineTo(16,8);g.lineTo(8,20);g.lineTo(-8,20);g.closePath();g.fill();
  g.fillStyle=FCC.lit;for(let k=-12;k<=12;k+=6){g.beginPath();g.arc(k,12,2,0,7);g.fill()}
  if(o.wings){g.fillStyle=FCC.mid;g.beginPath();g.moveTo(-6,-78);g.quadraticCurveTo(-34,-90,-30,-40);g.quadraticCurveTo(-20,-56,-8,-58);g.closePath();g.fill();g.beginPath();g.moveTo(6,-78);g.quadraticCurveTo(34,-90,30,-40);g.quadraticCurveTo(20,-56,8,-58);g.closePath();g.fill();
    g.strokeStyle=FCC.sh;g.lineWidth=1;for(let k=0;k<4;k++){g.beginPath();g.moveTo(-10,-70+k*6);g.lineTo(-26,-74+k*10);g.stroke();g.beginPath();g.moveTo(10,-70+k*6);g.lineTo(26,-74+k*10);g.stroke()}}
  // robe : longue, évasée, plis verticaux ; le manteau en écharpe
  const lean=(o.lean||0)*4;g.fillStyle=FCC.lit;g.beginPath();g.moveTo(-10+lean,-80);g.quadraticCurveTo(-16,-40,-17,-1);g.quadraticCurveTo(0,3,17,-1);g.quadraticCurveTo(16,-40,10+lean,-80);g.closePath();g.fill();
  g.fillStyle='rgba(120,86,60,.38)';poly(g,[2,-80,17,-1,10,0,-2,-60]);g.fill();
  g.strokeStyle='rgba(110,76,54,.6)';g.lineWidth=1.2;for(const k of[-11,-6,-1,4,9,13]){g.beginPath();g.moveTo(k*.6+lean*.5,-56);g.quadraticCurveTo(k*1.1,-26,k*1.25,-2);g.stroke()}
  g.strokeStyle='rgba(100,70,50,.55)';g.lineWidth=1.6;g.beginPath();g.moveTo(-11,-64);g.quadraticCurveTo(0,-50,12,-58);g.stroke();g.beginPath();g.moveTo(-12,-44);g.quadraticCurveTo(0,-34,13,-40);g.stroke();
  g.fillStyle=FCC.lit;g.beginPath();g.ellipse(0,1,16,3,0,0,7);g.fill();g.fillStyle=FCC.sh;g.beginPath();g.ellipse(-5,1,3,2,0,0,7);g.fill();g.beginPath();g.ellipse(5,1,3,2,0,0,7);g.fill();
  // bras, mains, attribut
  g.fillStyle=FCC.mid;g.beginPath();g.ellipse(-9,-58,4,12,.25,0,7);g.fill();g.beginPath();g.ellipse(9,-58,4,12,-.25,0,7);g.fill();g.fillStyle=FCC.lit;g.beginPath();g.arc(-6,-48,3,0,7);g.fill();g.beginPath();g.arc(6,-48,3,0,7);g.fill();
  const at=o.attr||'book';g.fillStyle=FCC.sh;
  if(at==='book'){g.fillRect(-7,-54,12,9);g.fillStyle=FCC.lit;g.fillRect(-6,-53,5,7)}
  else if(at==='sceptre'){g.fillRect(7,-92,2,46);fcFinial(g,8,-92,.6)}
  else if(at==='staff'){g.fillRect(-9,-96,2,96);g.strokeStyle=FCC.sh;g.lineWidth=2;g.beginPath();g.arc(-4,-96,5,Math.PI,Math.PI*2.4);g.stroke()}
  else if(at==='sword'){g.fillRect(-1,-62,2,44);g.fillRect(-6,-60,12,2)}
  else if(at==='key'){g.fillRect(6,-70,2,22);g.beginPath();g.arc(7,-72,3,0,7);g.fill()}
  // cou et tête, visage (côté éclairé, côté ombre), barbe, cheveux
  g.fillStyle=FCC.lit;g.fillRect(-3,-84,6,6);g.beginPath();g.ellipse(0,-90,7,8.5,0,0,7);g.fill();g.fillStyle='rgba(120,86,60,.35)';g.beginPath();g.ellipse(3,-90,4,8,0,-1.4,1.4);g.fill();
  g.fillStyle='rgba(70,50,40,.55)';g.fillRect(-3.5,-91,2,1.2);g.fillRect(1.5,-91,2,1.2);g.fillRect(-.6,-90,1.2,4);
  if(o.smile){g.strokeStyle='rgba(70,50,40,.7)';g.lineWidth=1;g.beginPath();g.arc(0,-87,3,.2,Math.PI-.2);g.stroke()}else g.fillRect(-2,-86,4,1);
  if(o.beard){g.fillStyle=FCC.mid;g.beginPath();g.moveTo(-6,-87);g.quadraticCurveTo(0,-74,6,-87);g.closePath();g.fill()}
  g.fillStyle=FCC.mid;g.beginPath();g.arc(0,-93,7.5,Math.PI*1.05,Math.PI*1.95);g.fill();g.fillRect(-7.5,-94,2.5,9);g.fillRect(5,-94,2.5,9);
  if(o.crown){g.fillStyle='#d8b070';g.fillRect(-7,-101,14,4);for(const k of[-6,-2,2,6]){poly(g,[k-2,-101,k,-107,k+2,-101]);g.fill()}g.fillStyle='rgba(255,220,150,.8)';g.fillRect(-7,-100,14,1)}
  else if(o.mitre){g.fillStyle=FCC.lit;poly(g,[-7,-97,0,-114,7,-97]);g.fill();g.strokeStyle=FCC.sh;g.lineWidth=1;g.beginPath();g.moveTo(0,-112);g.lineTo(0,-97);g.stroke()}
  else if(o.halo){g.strokeStyle=FCC.lit;g.lineWidth=2.5;g.beginPath();g.arc(0,-92,13,0,7);g.stroke();g.fillStyle='rgba(255,200,140,.18)';g.beginPath();g.arc(0,-92,13,0,7);g.fill()}
  // le dais : un petit édicule à arcatures, créneaux et clochetons
  if(o.canopy!==false){const cy=-122;g.fillStyle=FCC.mid;g.fillRect(-24,cy,48,16);g.fillStyle=FCC.deep;for(const k of[-16,0,16]){fcOgivePath(g,k,cy+16,10,14);g.fill()}
    if(o.flat){g.fillStyle=FCC.sh;g.fillRect(-28,cy-9,56,9);g.restore();return}
    g.fillStyle=FCC.lit;g.fillRect(-26,cy-4,52,5);for(let k=-24;k<=20;k+=8)g.fillRect(k,cy-9,4,5);g.fillStyle=FCC.mid;poly(g,[-12,cy-4,0,cy-26,12,cy-4]);g.fill();fcCrockets(g,-12,cy-4,0,cy-26,6,1);fcCrockets(g,12,cy-4,0,cy-26,6,-1,FCC.sh);fcFinial(g,0,cy-24,.55);
    for(const k of[-22,22]){g.fillStyle=FCC.mid;g.fillRect(k-2,cy-16,4,12);poly(g,[k-3,cy-16,k,cy-24,k+3,cy-16]);g.fill()}}
  g.restore()}
// fenêtre en lancette : ébrasements, meneau, deux lancettes et un oculus ; abat-sons pour le beffroi
function fcLancet(g,x,yb,w,h,o){o=o||{};g.fillStyle=FCC.sh;fcOgivePath(g,x,yb,w+16,h+12);g.fill();g.fillStyle=FCC.mid;fcOgivePath(g,x,yb,w+8,h+6);g.fill();
  g.fillStyle=o.louver?FCC.dark:FCC.glass;fcOgivePath(g,x,yb,w,h);g.fill();
  g.save();fcOgivePath(g,x,yb,w,h);g.clip();
  if(o.louver){g.fillStyle='rgba(150,110,80,.55)';for(let y=yb-h+w*.6;y<yb;y+=11){g.fillRect(x-w/2,y,w,4)}g.fillStyle='rgba(0,0,0,.4)';for(let y=yb-h+w*.6;y<yb;y+=11)g.fillRect(x-w/2,y+4,w,2)}
  else{g.fillStyle='rgba(200,120,150,.22)';for(let k=0;k<12;k++)g.fillRect(x-w/2+(k*13)%w,yb-h+((k*37)%h),5,6);g.fillStyle='rgba(255,180,110,.18)';g.fillRect(x-w/2,yb-h,w*.3,h)}
  g.restore();
  // remplage : deux lancettes et un oculus à quadrilobe
  g.strokeStyle=FCC.lit;g.lineWidth=3;g.beginPath();g.moveTo(x,yb);g.lineTo(x,yb-h*.62);g.stroke();
  g.lineWidth=2;g.beginPath();fcOgive(g,x-w/4,yb-h*.02,w/2-4,h*.66);g.stroke();g.beginPath();fcOgive(g,x+w/4,yb-h*.02,w/2-4,h*.66);g.stroke();
  const oy=yb-h*.8,orr=w*.22;g.beginPath();g.arc(x,oy,orr,0,7);g.stroke();g.lineWidth=1.2;for(let k=0;k<4;k++){const a=k*Math.PI/2+Math.PI/4;g.beginPath();g.arc(x+Math.cos(a)*orr*.45,oy+Math.sin(a)*orr*.45,orr*.42,0,7);g.stroke()}
  g.fillStyle=FCC.lit;g.fillRect(x-w/2-8,yb-2,w+16,5)}
// la grande rose : couronnes, pétales rayonnants, lobes, cœur ; verre sombre et quelques éclats
function fcRose(g,cx,cy,R0,n){g.fillStyle=FCC.sh;g.beginPath();g.arc(cx,cy,R0+16,0,7);g.fill();g.fillStyle=FCC.lit;g.beginPath();g.arc(cx,cy,R0+9,0,7);g.fill();
  g.fillStyle=FCC.glass;g.beginPath();g.arc(cx,cy,R0,0,7);g.fill();
  const cols=['rgba(70,90,180,.55)','rgba(170,50,70,.5)','rgba(200,150,60,.45)','rgba(60,120,110,.45)'];
  for(let i=0;i<n*3;i++){const a=i/(n*3)*Math.PI*2,r=R0*(.35+((i*7)%10)/16);g.fillStyle=cols[i%4];g.beginPath();g.arc(cx+Math.cos(a)*r,cy+Math.sin(a)*r,R0*.06,0,7);g.fill()}
  g.strokeStyle=FCC.lit;g.lineCap='round';
  for(let i=0;i<n;i++){const a=i/n*Math.PI*2,a2=(i+.5)/n*Math.PI*2,ca=Math.cos(a),sa=Math.sin(a);
    g.lineWidth=4;g.beginPath();g.moveTo(cx+ca*R0*.3,cy+sa*R0*.3);g.lineTo(cx+ca*R0*.98,cy+sa*R0*.98);g.stroke();
    // les pétales : lancette à tête trilobée entre deux rayons
    const pr=R0*.66,px=cx+Math.cos(a2)*pr,py=cy+Math.sin(a2)*pr;g.lineWidth=2;g.beginPath();g.arc(px,py,R0*.12,0,7);g.stroke();
    g.beginPath();g.arc(cx+Math.cos(a2)*R0*.86,cy+Math.sin(a2)*R0*.86,R0*.08,0,7);g.stroke();
    g.lineWidth=1.2;for(const d of[-1,1]){const b=a2+d*.09;g.beginPath();g.moveTo(cx+Math.cos(b)*R0*.36,cy+Math.sin(b)*R0*.36);g.lineTo(cx+Math.cos(b)*R0*.54,cy+Math.sin(b)*R0*.54);g.stroke()}}
  g.lineWidth=5;g.beginPath();g.arc(cx,cy,R0*.3,0,7);g.stroke();g.lineWidth=2;g.beginPath();g.arc(cx,cy,R0*.18,0,7);g.stroke();
  for(let k=0;k<6;k++){const a=k/6*Math.PI*2;g.beginPath();g.arc(cx+Math.cos(a)*R0*.12,cy+Math.sin(a)*R0*.12,R0*.06,0,7);g.stroke()}
  g.lineCap='butt';g.fillStyle='rgba(255,190,120,.12)';g.beginPath();g.arc(cx-R0*.3,cy-R0*.3,R0*.5,0,7);g.fill()}
// voussures : bandeaux d'arc peuplés de petites figures
function fcArchivolts(g,x,yb,w,h,bands,R){for(let b=bands;b>=0;b--){const ww=w+b*22,hh=h+b*18;g.fillStyle=b%2?FCC.mid:FCC.sh;fcOgivePath(g,x,yb,ww,hh);g.fill();
    if(b>0){// les figurines des voussures, le long de l'arc
      const r=ww*.85,sp=yb-hh+Math.sqrt(r*r-(r-ww/2)*(r-ww/2));const pts=[];for(let y=yb-14;y>sp;y-=22)pts.push([x-ww/2+6,y],[x+ww/2-6,y]);
      const a0=Math.acos((r-ww/2)/r);for(let k=1;k<7;k++){const t=k/7*a0;pts.push([x-ww/2+r-Math.cos(t)*(r-6),sp-Math.sin(t)*(r-6)],[x+ww/2-r+Math.cos(t)*(r-6),sp-Math.sin(t)*(r-6)])}
      for(const[px,py]of pts){g.fillStyle=FCC.lit;g.beginPath();g.ellipse(px,py+2,3.2,6,0,0,7);g.fill();g.beginPath();g.arc(px,py-6,2.4,0,7);g.fill();g.fillStyle='rgba(80,56,40,.5)';g.fillRect(px+1,py-2,1.5,8)}}}
}
// gargouille : une bête qui sort du mur, gueule ouverte
/* gargouille : une bête de pierre grise, plus sombre et plus verdie que la façade (lichens, coulures), qui s'agrippe à
   son corbeau, ailes repliées, cornes, oreilles pointues, gueule ouverte sur un tuyau de plomb ; jaw = ouverture de la mâchoire */
const FGC={a:'#8a8478',b:'#6c675e',c:'#4e4a44',d:'#2c2826',moss:'rgba(104,122,70,.55)',wet:'rgba(40,52,66,.35)'};
function fcMouth(x,y,f,s){return[x+f*s*33,y+s*1]}
function fcGargoyle(g,x,y,f,s,jaw){jaw=jaw||0;g.save();g.translate(x,y);g.scale(f*s,s);g.lineJoin='round';
  // le corbeau de pierre qui la porte, scellé dans le mur
  g.fillStyle=FGC.b;poly(g,[-26,-4,-8,-4,-12,14,-26,14]);g.fill();g.fillStyle=FGC.c;for(let k=0;k<3;k++)g.fillRect(-26,-2+k*6,16,1.5);
  // la queue enroulée
  g.strokeStyle=FGC.b;g.lineWidth=4;g.beginPath();g.moveTo(-16,2);g.quadraticCurveTo(-30,10,-24,20);g.quadraticCurveTo(-20,24,-16,18);g.stroke();
  // le corps, écailles et côtes, l'aile repliée
  g.fillStyle=FGC.a;g.beginPath();g.moveTo(-18,-6);g.bezierCurveTo(-10,-16,8,-16,18,-10);g.quadraticCurveTo(24,-8,26,-4);g.lineTo(22,4);g.bezierCurveTo(10,10,-6,10,-18,6);g.closePath();g.fill();
  g.fillStyle=FGC.c;g.beginPath();g.moveTo(-18,6);g.bezierCurveTo(-6,10,10,10,22,4);g.lineTo(21,7);g.bezierCurveTo(8,13,-8,13,-18,9);g.closePath();g.fill();
  g.strokeStyle='rgba(40,36,32,.55)';g.lineWidth=.8;for(let k=-12;k<14;k+=4){g.beginPath();g.arc(k,-4,2.5,0,Math.PI);g.stroke()}for(let k=-8;k<16;k+=5){g.beginPath();g.moveTo(k,2);g.lineTo(k-1,8);g.stroke()}
  g.fillStyle=FGC.b;g.beginPath();g.moveTo(-10,-12);g.quadraticCurveTo(-2,-30,10,-24);g.quadraticCurveTo(4,-18,6,-12);g.closePath();g.fill();
  g.strokeStyle=FGC.c;g.lineWidth=1;for(let k=0;k<4;k++){g.beginPath();g.moveTo(-6+k*3,-13);g.quadraticCurveTo(-2+k*3,-22,4+k*2,-24+k);g.stroke()}
  // pattes griffues sur le corbeau
  g.fillStyle=FGC.b;g.beginPath();g.ellipse(-6,8,3.5,6,.3,0,7);g.fill();g.beginPath();g.ellipse(10,7,3,6,-.3,0,7);g.fill();
  g.fillStyle=FGC.d;for(const[cx,cy]of[[-8,14],[-5,14],[-2,13],[8,13],[11,13],[13,12]]){poly(g,[cx-1,cy,cx+1,cy,cx,cy+3]);g.fill()}
  // la tête : crâne, cornes, oreilles, arcade sourcilière, mâchoire qui s'ouvre, crocs, le tuyau de plomb
  g.fillStyle=FGC.a;g.beginPath();g.moveTo(16,-12);g.quadraticCurveTo(24,-17,31,-9);g.lineTo(34,-3);g.lineTo(18,-1);g.closePath();g.fill();
  g.fillStyle=FGC.b;poly(g,[19,-14,15,-25,22,-15]);g.fill();poly(g,[24,-14,27,-22,27,-12]);g.fill();
  g.fillStyle=FGC.c;g.save();g.translate(19,0);g.rotate(jaw*.45);g.beginPath();g.moveTo(0,0);g.lineTo(14,-1);g.lineTo(12,5);g.quadraticCurveTo(4,7,0,4);g.closePath();g.fill();
   g.fillStyle='#d8d0c0';for(const k of[4,8,11]){poly(g,[k,-1,k+1.5,-1,k+.7,2]);g.fill()}g.restore();
  g.fillStyle=FGC.d;g.beginPath();g.moveTo(20,-2);g.lineTo(34,-3);g.lineTo(32,1+jaw*5);g.lineTo(20,1+jaw*3);g.closePath();g.fill();
  g.fillStyle='#d8d0c0';for(const k of[24,28,31]){poly(g,[k,-3,k+1.5,-3,k+.7,0]);g.fill()}
  g.fillStyle='#7a7c80';g.fillRect(29,-2.5,6,3);g.fillStyle='#3a3c40';g.beginPath();g.ellipse(35,-1,1.4,1.8,0,0,7);g.fill();
  g.fillStyle=FGC.d;g.beginPath();g.ellipse(25,-9,2.4,1.6,0,0,7);g.fill();g.fillStyle='#c84020';g.beginPath();g.arc(25.4,-9,.9,0,7);g.fill();
  g.strokeStyle=FGC.c;g.lineWidth=1.2;g.beginPath();g.moveTo(21,-12);g.lineTo(28,-11);g.stroke();
  // lichens, traînées d'humidité, lumière du couchant sur le dos
  g.fillStyle=FGC.moss;for(const[mx,my,r]of[[-8,-8,3],[4,-12,2.5],[12,-6,2],[-14,2,2.5],[28,-12,1.6]]){g.beginPath();g.arc(mx,my,r,0,7);g.fill()}
  g.fillStyle=FGC.wet;g.fillRect(30,0,2,8);g.fillStyle='rgba(255,190,130,.35)';g.beginPath();g.moveTo(-14,-9);g.bezierCurveTo(-6,-15,8,-15,18,-11);g.lineTo(16,-9);g.bezierCurveTo(6,-12,-6,-12,-14,-7);g.closePath();g.fill();
  g.restore()}
// corniche saillante dont le dessus est exactement la planche : tablette éclairée, moulure, corbeaux
function fcLedge(g,x0,x1,y,o){o=o||{};g.fillStyle='rgba(30,20,30,.28)';g.fillRect(x0+2,y+12,x1-x0,6);g.fillStyle=FCC.lit;g.fillRect(x0-3,y,x1-x0+6,5);g.fillStyle=FCC.mid;g.fillRect(x0-2,y+5,x1-x0+4,6);
  g.fillStyle=FCC.sh;for(let x=x0+3;x<x1-4;x+=9){g.beginPath();g.moveTo(x,y+11);g.lineTo(x+6,y+11);g.lineTo(x+4,y+17);g.lineTo(x+2,y+17);g.closePath();g.fill()}
  if(o.leaf){g.fillStyle=FCC.lit;for(let x=x0+6;x<x1-4;x+=12){g.beginPath();g.ellipse(x,y+8,3,2,0,0,7);g.fill()}}}
// balustrade ajourée de trilobes
function fcBalustrade(g,x0,x1,y,h){g.fillStyle=FCC.mid;g.fillRect(x0,y-h,x1-x0,h);g.fillStyle=FCC.lit;g.fillRect(x0-2,y-h-4,x1-x0+4,5);g.fillStyle=FCC.deep;
  for(let x=x0+6;x<x1-14;x+=20){fcOgivePath(g,x+7,y-3,12,h-8);g.fill();g.beginPath();g.arc(x+7,y-h+9,3,0,7);g.fill()}}

/* ---------- la couche de la façade ---------- */
function facadeBuild(Lv){
  const wpx=Lv.wpx+40,hpx=ROWS*T+PAD,TR=Math.min(RS,1),{layer:c,g}=mkLayer(wpx*TR,hpx*TR);g.scale(TR,TR);c.rs=TR;g.translate(0,PAD);const R=mulberry(Lv.def.seed+31);
  const AX=FC.AX,X0=AX-FC.ED,X1=AX+FC.ED,GY=FC.G,oL=AX-FC.OB,oR=AX+FC.OB,iL=AX-FC.IB,iR=AX+FC.IB;
  const LT=[350,765],RT=[1115,1530],TT=fcY(9);   // les deux tours et le haut de leurs beffrois
  /* --- les masses --- */
  fcStone(g,X0,fcY(26),X1,GY,R);
  fcStone(g,LT[0],TT,LT[1],fcY(26),R);fcStone(g,RT[0],TT,RT[1],fcY(26),R);fcStone(g,LT[1],fcY(17),RT[0],fcY(26),R,FCC.sh);
  // le pignon central entre les tours, son groupe sculpté et sa croix
  fcGable(g,LT[1]-10,RT[0]+10,fcY(17)+6,230,{cross:1.6});
  for(const[k,dx]of[[-1,-60],[0,0],[1,60]]){fcStatue(g,AX+dx,fcY(17)-30-(k?0:20),k?54:66,{niche:false,canopy:false,halo:k===0,crown:k!==0,attr:k?'sceptre':'book'},R)}
  /* --- les contreforts, de bas en haut --- */
  for(const bx of[oL,iL,iR,oR]){const w=bx===oL||bx===oR?100:90;g.fillStyle=FCC.mid;g.fillRect(bx-w/2,fcY(26),w,GY-fcY(26));g.fillStyle='rgba(0,0,0,.16)';g.fillRect(bx+w/2-14,fcY(26),14,GY-fcY(26));g.fillStyle='rgba(255,190,130,.08)';g.fillRect(bx-w/2,fcY(26),10,GY-fcY(26))}
  /* --- les tours : beffrois à grandes baies jumelles, statues à la base, tourelles d'angle, pinacles --- */
  for(const[a,b]of[LT,RT]){const cx=(a+b)/2;
    for(const dx of[-95,95])fcLancet(g,cx+dx,fcY(20)-24,74,470,{louver:true});
    g.fillStyle=FCC.mid;g.fillRect(cx-12,fcY(9),24,fcY(20)-fcY(9));
    // tourelles d'angle ajourées et leurs flèches
    for(const tx of[a+22,b-22]){g.fillStyle=FCC.sh;g.fillRect(tx-22,fcY(4),44,fcY(20)-fcY(4));g.fillStyle=FCC.deep;for(let y=fcY(6);y<fcY(19);y+=150){fcOgivePath(g,tx,y+130,18,120);g.fill()}
      g.fillStyle=FCC.lit;g.fillRect(tx-22,fcY(4),5,fcY(20)-fcY(4));fcPinnacle(g,tx,fcY(4)+4,40,170,R)}
    // couronnement : balustrade et petits pinacles, gâblets
    fcBalustrade(g,a,b,TT,26);for(let x=a+60;x<b-40;x+=56)fcPinnacle(g,x,TT-24,18,80,R);
    for(const dx of[-95,95])fcGable(g,cx+dx-52,cx+dx+52,fcY(20)-480,120,{trefoil:1});
  }
  // la croix du faîte et les deux grands pinacles du pignon
  for(const px of[LT[1]+12,RT[0]-12])fcPinnacle(g,px,fcY(17)+6,30,180,R);
  /* --- la galerie des rois : niches trilobées, rois couronnés --- */
  {const y=fcY(29),top=y-160;g.fillStyle=FCC.sh;g.fillRect(X0+20,top,X1-X0-40,160);g.fillStyle='rgba(0,0,0,.18)';g.fillRect(X0+20,top,X1-X0-40,8);
    let k=0;for(let x=X0+70;x<X1-40;x+=62){const crown=1;fcStatue(g,x,y-4,118,{crown,beard:k%2===0,attr:k%3===0?'sceptre':k%3===1?'sword':'book',lean:((k*7)%3-1)*.6},R);k++}
    g.fillStyle='rgba(30,20,30,.3)';g.fillRect(X0+20,y,X1-X0-40,10);
    for(let x=X0+70;x<X1-40;x+=62)fcGable(g,x-31,x+31,top+4,46,{});}
  /* --- arcatures aveugles sous la galerie des rois, et dans le retrait entre les tours --- */
  {const y0=fcY(29)+14,y1=fcY(33)-30;g.fillStyle=FCC.sh;g.fillRect(X0+20,y0,X1-X0-40,4);for(let x=X0+40;x<X1-40;x+=34){g.fillStyle=FCC.deep;fcOgivePath(g,x,y1,22,y1-y0-10);g.fill();g.fillStyle=FCC.lit;g.fillRect(x-14,y1,4,0);g.fillStyle='rgba(255,200,140,.18)';g.fillRect(x-11,y0+8,2,y1-y0-10)}
   g.fillStyle=FCC.lit;g.fillRect(X0+20,y1,X1-X0-40,5);g.fillStyle=FCC.sh;g.fillRect(X0+20,y1+5,X1-X0-40,4)}
  {const a=LT[1],b=RT[0],y0=fcY(17)+12,y1=fcY(26)-4;for(let x=a+30;x<b-20;x+=58){fcLancet(g,x+14,y1,34,y1-y0-30,{})}
   g.fillStyle=FCC.lit;g.fillRect(a,y1,b-a,5)}
  // colonnettes et cordons sur les contreforts
  for(const bx of[oL,iL,iR,oR]){const w=bx===oL||bx===oR?100:90;g.fillStyle='rgba(255,210,160,.18)';for(const dx of[-w/2+8,w/2-12])g.fillRect(bx+dx,fcY(26),3,GY-fcY(26)-60);
    g.fillStyle=FCC.lit;for(const y of[fcY(33),fcY(40),fcY(47)])g.fillRect(bx-w/2-4,y,w+8,5)}
  /* --- l'étage de la rose : la grande rose, les baies des tours, les grandes statues sous dais --- */
  {const cy=fcY(39)+30;g.fillStyle=FCC.sh;fcOgivePath(g,AX,fcY(43)-4,380,470);g.fill();g.fillStyle=FCC.mid;fcOgivePath(g,AX,fcY(43)-4,350,440);g.fill();fcRose(g,AX,cy,150,12);
    // remplage sous la rose
    g.fillStyle=FCC.deep;for(let k=-3;k<=3;k++){fcOgivePath(g,AX+k*44,fcY(43)-8,32,64);g.fill()}g.strokeStyle=FCC.lit;g.lineWidth=2;for(let k=-3;k<=3;k++){g.beginPath();fcOgive(g,AX+k*44,fcY(43)-8,32,64);g.stroke()}
    for(const cx of[(LT[0]+LT[1])/2,(RT[0]+RT[1])/2])fcLancet(g,cx,fcY(43)-10,150,360,{})}
  // grandes statues des contreforts (étage de la rose) : sous leur dais, dont le sommet est la plateforme
  for(const bx of[oL,iL,iR,oR])fcStatue(g,bx,fcY(36)+131*1.5,150,{halo:bx===iL||bx===iR,mitre:bx===oL,crown:bx===oR,attr:bx===oL?'staff':'book',beard:true,flat:1},R);
  /* --- la coursière au-dessus des portails : balustrade continue --- */
  /* --- les portails : voussures peuplées, gâbles à crochets, roses des tympans, statues des ébrasements, portes --- */
  const portals=[[(X0+100+iL-45)/2,170,true],[AX,240,false],[(iR+45+X1-100)/2,170,true]];
  // le soubassement à arcatures aveugles (interrompu par les portes)
  g.fillStyle=FCC.sh;g.fillRect(X0,GY-60,X1-X0,60);for(let x=X0+8;x<X1-20;x+=26){g.fillStyle=FCC.deep;fcOgivePath(g,x+10,GY-6,16,44);g.fill()}g.fillStyle=FCC.lit;g.fillRect(X0,GY-62,X1-X0,4);
  for(const[px,pw,side]of portals){const yb=GY-60,ah=side?300:360;
    // le gâble au-dessus du portail
    if(side)fcGable(g,px-pw/2-50,px+pw/2+50,yb-ah-40,170,{trefoil:1,cross:1});
    else{const yb=fcY(44)+62,yt=fcY(43);g.fillStyle=FCC.mid;poly(g,[AX-185,yb,AX-60,yt,AX+60,yt,AX+185,yb]);g.fill();g.fillStyle='rgba(0,0,0,.12)';poly(g,[AX,yb,AX,yt,AX+60,yt,AX+185,yb]);g.fill();
      g.fillStyle=FCC.deep;for(const[dx,dy]of[[0,-20],[-18,8],[18,8]]){g.beginPath();g.arc(AX+dx,yb-50+dy,17,0,7);g.fill()}
      // les rampants : tuiles de pierre, crochets, le bord sur lequel on glisse
      g.strokeStyle=FCC.lit;g.lineWidth=6;g.beginPath();g.moveTo(AX-188,yb+2);g.lineTo(AX-60,yt);g.lineTo(AX+60,yt);g.lineTo(AX+188,yb+2);g.stroke();
      g.strokeStyle='rgba(90,64,48,.45)';g.lineWidth=1.2;for(let k=1;k<6;k++){g.beginPath();g.moveTo(AX-185+k*8,yb);g.lineTo(AX-60+k*3,yt+k*7);g.stroke();g.beginPath();g.moveTo(AX+185-k*8,yb);g.lineTo(AX+60-k*3,yt+k*7);g.stroke()}
      fcCrockets(g,AX-185,yb-4,AX-60,yt-4,13,1);fcCrockets(g,AX+185,yb-4,AX+60,yt-4,13,-1);
      // le groupe sculpté du couronnement, sur le replat du sommet
      for(const[dx,h,o]of[[-32,96,{crown:1,attr:'sceptre'}],[0,108,{halo:1,crown:1,attr:'book'}],[32,96,{halo:1,attr:'book'}]])fcStatue(g,AX+dx,yt-4,h,Object.assign({niche:false,canopy:false},o),R);
      // les pics anti-pigeons, posés sur les têtes : une réglette de métal hérissée de fines aiguilles
      for(const[dx,hy]of[[-32,FC_SPK.y+25],[0,FC_SPK.y+13],[32,FC_SPK.y+25]]){const x=AX+dx;g.fillStyle='#3a3c42';g.fillRect(x-15,hy,30,3);g.strokeStyle='#aeb4bc';g.lineWidth=1;
        for(let k=0;k<9;k++){const bx=x-13+k*3.2,a=(k-4)*.13;g.beginPath();g.moveTo(bx,hy);g.lineTo(bx+Math.sin(a)*14,hy-Math.cos(a)*14);g.stroke()}g.fillStyle='rgba(255,220,180,.5)';g.fillRect(x-15,hy,30,1)}}
    fcArchivolts(g,px,yb,pw,ah,4,R);
    // le tympan ajouré d'une rose (comme à Reims), la porte
    g.fillStyle=FCC.mid;fcOgivePath(g,px,yb,pw,ah);g.fill();fcRose(g,px,yb-ah*.62,pw*.3,side?8:10);
    g.fillStyle=FCC.lit;g.fillRect(px-pw/2,yb-ah*.36,pw,10);
    g.fillStyle='#5a3424';g.fillRect(px-pw/2+10,yb-ah*.35+10,pw-20,ah*.35+60-10);g.fillStyle='rgba(0,0,0,.3)';g.fillRect(px-2,yb-ah*.35+10,4,ah*.35+50);
    g.strokeStyle='#2a1a14';g.lineWidth=2;for(let y=yb-ah*.3;y<GY;y+=30){g.beginPath();g.moveTo(px-pw/2+14,y);g.quadraticCurveTo(px-pw/4,y-6,px-6,y);g.moveTo(px+6,y);g.quadraticCurveTo(px+pw/4,y-6,px+pw/2-14,y);g.stroke()}
    // le trumeau et sa statue
    g.fillStyle=FCC.mid;g.fillRect(px-9,yb-ah*.35,18,ah*.35+60);fcStatue(g,px,yb-ah*.35-6,62,{niche:false,halo:true,attr:side?'book':'sceptre'},R);
    // les statues des ébrasements, de part et d'autre
    for(const sd of[-1,1])for(let k=0;k<3;k++){const sx=px+sd*(pw/2+18+k*26),smile=side&&px<AX&&sd>0&&k===1;fcStatue(g,sx,GY-70,96,{halo:k!==1||smile,wings:smile,smile,beard:!smile&&k===2,attr:['book','key','staff'][k],niche:false,canopy:k===0},R)}}
  // dais et niches des contreforts au niveau des portails ; gargouilles
  for(const bx of[oL,iL,iR,oR]){fcStatue(g,bx,GY-150,84,{halo:true,attr:'staff'},R);fcPinnacle(g,bx,fcY(48)-6,40,150,R)}
  // les gargouilles n°2 : au pied de la rose et au sommet des tours
  // le contrefort d'angle de droite et ses consoles
  {const x=1560;g.fillStyle=FCC.sh;g.fillRect(x-30,fcY(30),70,GY-fcY(30));g.fillStyle='rgba(0,0,0,.2)';g.fillRect(x+24,fcY(30),16,GY-fcY(30));fcPinnacle(g,x,fcY(30)+4,50,200,R)}
  for(let r=0;r<ROWS;r++){let c=0;while(c<Lv.w){if(Lv.g[r][c]==='t'){let e=c;while(e+1<Lv.w&&Lv.g[r][e+1]==='t')e++;const x0=c*T,x1=(e+1)*T,y=r*T,mx=(x0+x1)/2;
      if(r===20||r===21){if(!(c===32&&r===20))fcStatue(g,mx,y+131*.9+2,90,{halo:(c%3)===0,crown:(c%3)===1,mitre:(c%3)===2,beard:c%2===0,attr:['book','sceptre','staff'][c%3],flat:1},R)}
      else if(r===43&&x1-x0<=80)fcBalustrade(g,x0-6,x1+6,y,22);
      c=e+1}else c++}}
  if(Lv.w>46)towerBuild(g,R);
  /* --- les corniches : une par planche (sa tablette = l'endroit où l'on se pose) --- */
  for(let r=0;r<ROWS;r++){let c=0;while(c<Lv.w){if(Lv.g[r][c]==='t'){let e=c;while(e+1<Lv.w&&Lv.g[r][e+1]==='t')e++;fcLedge(g,c*T,(e+1)*T,r*T,{leaf:(c+r)%2===0});c=e+1}else c++}}
  // la fenêtre de la tour sud, entrouverte et dorée : c'est par là qu'on entre
  {const wx=32*T+20,wy=fcY(20);g.fillStyle=FCC.sh;fcOgivePath(g,wx,wy,44,86);g.fill();g.fillStyle='#1e1418';fcOgivePath(g,wx,wy,34,78);g.fill();
    g.fillStyle='rgba(255,190,90,.75)';fcOgivePath(g,wx-6,wy,18,74);g.fill();g.fillStyle='#5a3424';poly(g,[wx+2,wy,wx+2,wy-60,wx+17,wy-52,wx+17,wy]);g.fill()}
  // la lumière du couchant : chaude sur la pierre, violette dans les creux ; ombre portée des tours
  {const gr=g.createLinearGradient(0,0,0,GY);gr.addColorStop(0,'rgba(255,170,90,.22)');gr.addColorStop(.6,'rgba(255,150,90,.12)');gr.addColorStop(1,'rgba(90,60,110,.25)');g.save();g.globalCompositeOperation='source-atop';g.fillStyle=gr;g.fillRect(0,0,wpx,GY);
   const gx=g.createLinearGradient(X0,0,X1,0);gx.addColorStop(0,'rgba(255,200,140,.12)');gx.addColorStop(1,'rgba(60,40,90,.16)');g.fillStyle=gx;g.fillRect(0,0,wpx,GY);g.restore()}
  return c;
}
/* positions des gargouilles n°2 [x, y, sens] : deux au pied de la rose, une au sommet de chaque tour */
const FC_G2=[[850,fcY(33),-1],[1030,fcY(33),1],[557,fcY(10),1],[1322,fcY(10),-1]];

/* ---------- après lecture : les bêtes et les jets ---------- */
function facadePost(Lv){if(!Lv.def.facade)return;
  const S={pig:[],g1:[],g2:[],shit:[],drops:[],said:{},grace:0};Lv.fc=S;
  const pig=(k,a,b,y,h,ph)=>S.pig.push({k,a,b,y0:y,h:h||130,t:ph||0,x:a,y,f:1,st:'walk',beg:0});
  // sur le parvis : pigeons sauteurs et pigeons mendiants
  pig('gros',430,740,FC.G,130,0);pig('gros',480,780,FC.G,130,3.5);pig('gros',960,1260,FC.G,130,1.7);pig('gros',1150,1450,FC.G,130,5.1);
  pig('moignon',510,700,FC.G,0,0);pig('moignon',1210,1390,FC.G,0,2);
  // sur la coursière : un mendiant par corniche
  pig('moignon',370,430,fcY(43),0,1);pig('moignon',690,750,fcY(43),0,3);pig('moignon',1130,1190,fcY(43),0,.5);pig('moignon',1450,1510,fcY(43),0,2.4);
  // sur la galerie des rois : un sauteur
  pig('gros',760,1080,fcY(29),90,2.2);
  // les gargouilles n°1 : elles crachent droit sur la console du dessous
  for(const[cx,r]of[[400,53],[720,53],[1160,52],[1480,51]]){const f=cx<FC.AX?1:-1,s=1.3,gx=cx-f*s*33,gy=fcY(48)+8,[mx,my]=fcMouth(gx,gy,f,s);S.g1.push({gx,gy,f,s,x:mx,y:my,yb:fcY(r),ph:(cx*.013)%3.4,st:'idle'})}
  // les gargouilles n°2 : le jet passe d'une cible à l'autre
  const tg=(c,r)=>[c*T+T/2,fcY(r)-12];
  S.rose={seq:[[1,tg(28.5,36)],[0,tg(17.5,36)]],t:0,i:-1,blob:null,warn:-1,splash:null};
  S.g2.push({g:FC_G2[2],tg:[tg(10.5,20),tg(13,21),tg(15,21),tg(17,20)],ph:1});S.g2.push({g:FC_G2[3],tg:[tg(29,21),tg(31,21),tg(33,21),tg(35.5,20)],ph:3});
  // les pigeons chieurs : sur les plateformes du haut ; chacun à son rythme
  for(const[x,r,ph]of[[505,28,0],[760,29,1.3],[1120,29,2.6],[1385,29,.7]])S.shit.push({x,y:fcY(r),ph,t:ph,lift:0,per:4.2});
  // la tour sud : la caméra reste dans la tour une fois qu'on y est ; deux cloches ; quatre pigeons sur le parapet du toit, chacun son rythme
  Lv.camZone=cx=>cx<FT.X0-200?[0,46*T]:[FT.CAM,Lv.wpx];
  S.bells=[{x:FT.B1,tDown:0,tUp:2.35,th:0},{x:FT.B2,tDown:2.0,tUp:.35,th:Math.PI}];S.waves=[];
  for(const[c,ph,per]of[[67,.3,2.7],[69,1.1,3.6],[72,2.0,2.3],[74,.6,4.7]])S.shit.push({x:c*T+T/2,y:FT.ROOF,ph,t:ph,lift:0,per,roof:1});
}
function fcJetPts(o,ang){const[gx,gy,f]=o.g,[mx,my]=fcMouth(gx,gy,f,1.7);const tgs=o.tg,n=tgs.length;
  // position de la cible le long du parcours (aller-retour entre les cibles, avec un temps d'arrêt sur chacune)
  const seg=ang,i=Math.min(n-2,Math.floor(seg)),u=Math.max(0,Math.min(1,(seg-i)*1.5-.25)),tx=tgs[i][0]+(tgs[i+1][0]-tgs[i][0])*u,ty=tgs[i][1]+(tgs[i+1][1]-tgs[i][1])*u;
  const pts=[];for(let k=0;k<=16;k++){const v=k/16,cx=mx+f*60;pts.push([ (1-v)*(1-v)*mx+2*(1-v)*v*cx+v*v*tx,(1-v)*(1-v)*my+2*(1-v)*v*(my-40)+v*v*ty])}return pts}
function facadeStep(dt){const S=L.fc;if(!S)return;const hb={x:P.x+3,y:P.y+4,w:P.w-6,h:P.h-6},pcx=P.x+P.w/2,pcy=P.y+P.h/2;let hit=null;
  // pigeons
  for(const o of S.pig){o.t+=dt;
    if(o.k==='gros'){const cyc=6.4,u=o.t%cyc;
      if(u<1.7){o.st='walk';o.x=o.a+Math.sin(u*1.8)*10;o.y=o.y0;o.f=1}else if(u<3.2){o.st='fly';const v=(u-1.7)/1.5;o.x=o.a+(o.b-o.a)*v;o.y=o.y0-Math.sin(v*Math.PI)*o.h;o.f=1}
      else if(u<4.9){o.st='walk';o.x=o.b+Math.sin((u-3.2)*1.8)*10;o.y=o.y0;o.f=-1}else{o.st='fly';const v=(u-4.9)/1.5;o.x=o.b+(o.a-o.b)*v;o.y=o.y0-Math.sin(v*Math.PI)*o.h;o.f=-1}
      if(!P.dead&&overlap(hb,{x:o.x-16,y:o.y-30,w:32,h:28}))hit='sauteur'}
    else{o.x+=o.f*24*dt;if(o.x<o.a){o.x=o.a;o.f=1}if(o.x>o.b){o.x=o.b;o.f=-1}o.st=o.beg>1.4?'beg':'walk';o.y=o.y0;o.beg=Math.max(0,o.beg-dt);
      if(Math.abs(pcx-o.x)<200&&Math.abs(pcy-o.y)<120&&o.beg<=0&&!G.sim){o.beg=3.2;bubble(o.x,o.y-44,pick(["Une miette, pour un vieux du clocher ?","Pitié, camarade…","Rien qu'une graine…","Pour mes petits, là-haut…"]),'#6a5a48')}
      if(!P.dead&&overlap(hb,{x:o.x-12,y:o.y-26,w:24,h:24}))hit='mendiant'}}
  // gargouilles n°1 : goutte d'avertissement, puis crachat vertical jusqu'à la console
  for(const o of S.g1){const u=(G.lt+o.ph)%3.4;o.st=u<1.9?'idle':u<2.5?'warn':'spit';o.len=o.st==='spit'?Math.min(o.yb-o.y,(u-2.5)*900):0;
    if(o.st==='spit'&&!P.dead&&overlap(hb,{x:o.x-8,y:o.y,w:16,h:o.len}))hit='crachat'}
  // gargouilles n°2 : un jet qui balaie ses cibles de proche en proche ; il s'arrête un moment après chaque passage
  for(const o of S.g2){const n=o.tg.length,per=(n-1)*1.3,cyc=per*2+2.4,u=(G.lt+o.ph)%cyc;
    if(u<per*2){o.on=true;const p=u<per?u/1.3:(per*2-u)/1.3;o.pts=fcJetPts(o,Math.min(n-1-1e-3,p))}else{o.on=false;o.pts=null;o.warn=u>cyc-.8}
    if(o.on&&!P.dead)for(const[x,y]of o.pts)if(Math.abs(x-pcx)<12+P.w/2-4&&Math.abs(y-pcy)<12+P.h/2-6){hit='jetPierre';break}}
  // la gargouille de la rose : un jet d'eau à la fois, comme les autres gargouilles : plateforme de droite, puis plateforme de gauche ;
  // un temps de repos entre deux jets, puis une pause après les trois
  {const Ro=S.rose,ON=1.0,GAP=1.7,PAUSE=2.2,n=Ro.seq.length,cyc=n*(ON+GAP)+PAUSE,u=(G.lt+.5)%cyc,i=Math.floor(u/(ON+GAP)),v=u-i*(ON+GAP);Ro.pts=null;Ro.warn=-1;Ro.jaw=0;Ro.gi=-1;
   if(i<n){const[gi,tgt]=Ro.seq[i],[gx,gy,f]=FC_G2[gi];Ro.gi=gi;
     if(v<ON){const[mx,my]=fcMouth(gx,gy,f,1.7),grow=Math.min(1,v/.25),pts=[];const cx2=mx+f*50,cy2=my-50;
       for(let k=0;k<=16;k++){const w=k/16*grow;pts.push([(1-w)*(1-w)*mx+2*(1-w)*w*cx2+w*w*tgt[0],(1-w)*(1-w)*my+2*(1-w)*w*cy2+w*w*tgt[1]])}
       Ro.pts=pts;Ro.reach=grow>=1;Ro.jaw=1;
       if(!P.dead)for(const[x,y]of pts)if(Math.abs(x-pcx)<12+P.w/2-4&&Math.abs(y-pcy)<12+P.h/2-6){hit='jetPierre';break}}
     else if(v>ON+GAP-.7){if(i<n-1){Ro.warn=Ro.seq[i+1][0];Ro.jaw=.3}}}
   else if(u>cyc-.7){Ro.warn=Ro.seq[0][0];Ro.jaw=.3}}
  // les pics anti-pigeons du groupe sculpté
  if(!P.dead&&overlap(hb,{x:FC_SPK.x0,y:FC_SPK.y-2,w:FC_SPK.x1-FC_SPK.x0,h:30}))hit='spikes';
  // pigeons chieurs : chacun lâche sa fiente à son tour ; elle tombe jusqu'à ce qu'elle touche quelque chose
  for(const o of S.shit){o.t+=dt;const P2=o.per,u=o.t%P2;o.lift=u>P2-.8&&u<P2-.4?1:0;if(u>=P2-.6&&u-dt<P2-.6)S.drops.push({x:o.x+(o.roof?-8:6),y:o.roof?o.y+14:o.y-6,vy:60})}
  for(const d of S.drops){d.vy=Math.min(700,d.vy+1400*dt);d.y+=d.vy*dt;const c=Math.floor(d.x/T),r=Math.floor(d.y/T);if(r>=ROWS||'t#'.includes(tile(c,r))&&d.y>r*T&&d.y<r*T+10){d.dead=1;d.splat=.6}
    if(!d.dead&&!d.own&&!P.dead&&Math.abs(d.x-pcx)<10&&d.y>P.y&&d.y<P.y+P.h)hit='fiente'}
  S.drops=S.drops.filter(d=>!d.dead||((d.splat-=dt)>0));
  towerStep(dt,S,hb,pcx,pcy,h=>{hit=h});
  if(S.grace>0){S.grace-=dt;hit=null}
  if(hit)G.fcHit=hit;
  // répliques
  const say1=(k,cond,txt,d)=>{if(!S.said[k]&&cond&&!G.sim){S.said[k]=1;say(txt,d||4.2)}};
  say1('door',P.onGround&&Math.abs(pcx-FC.AX)<70&&P.y+P.h>FC.G-10,"Fermée. Évidemment : toute une journée de route pour arriver à l'heure où l'on ferme. Pas un sacristain, pas une âme. Bon… il reste la façade. On grimpe.",5);
  say1('ange',P.onGround&&pcx<520&&P.y+P.h<FC.G-40,"L'ange qui sourit. En 1914, l'incendie lui a fait tomber la tête. On la lui a recollée. On a ça en commun.");
  say1('rose',P.onGround&&P.y+P.h<=fcY(43)+2,"La grande rose. Quand la charpente a brûlé, les vitraux ont fondu comme du sucre. Ceux-là sont neufs, ou presque.");
  say1('rois',P.onGround&&P.y+P.h<=fcY(29)+2&&pcx>700&&pcx<1180,"La galerie des rois. Cinquante-six gaillards couronnés qui regardent passer les siècles. Et maintenant, un pigeon.");
  say1('tour',P.onGround&&P.y+P.h<=fcY(21)+2&&pcx>1150,"La tour sud. Une fenêtre entrouverte, juste là… Ça sent le bronze et la corde de cloche.");
}
/* les rampants du gâble central : on s'y pose, mais on glisse doucement vers le vide ; en marchant vers le haut on résiste à peine
   (on recule encore un peu) : il faut sautiller pour monter */
const FC_SPK={x0:FC.AX-48,x1:FC.AX+48,y:fcY(43)-128};   // les aiguilles au-dessus du replat du gâble : un petit saut passe dessous, un grand saut s'y pique
const FC_SLOPES=[{xa:FC.AX-185,ya:fcY(44)+62,xb:FC.AX-60,yb:fcY(43)},{xa:FC.AX+60,ya:fcY(43),xb:FC.AX+185,yb:fcY(44)+62}];
function fcSlope(dt){const S=L.fc;if(!S)return;const cx=P.x+P.w/2,feet=P.y+P.h,pf=S.pf==null?feet:S.pf;S.onSlope=null;
  if(!P.dead&&P.vy>=0&&!P.onMover)for(const sl of FC_SLOPES){if(cx<sl.xa||cx>sl.xb)continue;const ys=sl.ya+(sl.yb-sl.ya)*(cx-sl.xa)/(sl.xb-sl.xa);
    if(pf<=ys+8&&feet>=ys-2){const down=sl.yb>sl.ya?1:-1;   // sens de la pente vers le bas (en x)
      const up=keys.has(down>0?'left':'right'),dn=keys.has(down>0?'right':'left');
      if(up){P.x-=P.vx*dt;P.x+=down*22*dt}else if(!dn){P.x-=P.vx*dt;P.x+=down*75*dt}else P.x+=down*30*dt;
      const c2=P.x+P.w/2;if(c2>=sl.xa&&c2<=sl.xb){P.y=sl.ya+(sl.yb-sl.ya)*(c2-sl.xa)/(sl.xb-sl.xa)-P.h;P.vy=0;P.onGround=true;S.onSlope=sl}break}}
  S.pf=P.y+P.h}
function facadeAfterMove(dt){if(L.fc)fcSlope(dt||1/60);if(G.fcHit){const k=G.fcHit;G.fcHit=null;return k}return null}
function facadeRespawn(){const S=L.fc;if(!S)return;S.grace=1.2;S.drops=[];S.waves=[];S.stun=0;G.fcHit=null}

/* ---------- dessin ---------- */
function drawFacadeBack(t,cx,cy){const Lv=L;if(!Lv.fcLayer)return;const ly=Lv.fcLayer,tr=ly.rs||1,sx=Math.max(0,cx-30),sw=Math.min(W+80,ly.width/tr-sx),sy=Math.max(0,cy+PAD-30),sh=Math.min(H+80,ly.height/tr-sy);
  if(sw>0&&sh>0)blitLayer(ctx,ly,sx*tr,sy*tr,sw*tr,sh*tr,sx,sy-PAD,sw,sh)}
function drawFacadeMid(t){const S=L.fc;if(!S)return;const g=ctx,vis=(x,y)=>x>cam.x-120&&x<cam.x+W+120&&y>cam.y-200&&y<cam.y+H+200;
  // crachats des gargouilles n°1
  for(const o of S.g1){if(!vis(o.x,o.y))continue;fcGargoyle(g,o.gx,o.gy,o.f,o.s,o.st==='spit'?1:o.st==='warn'?.3:0);
    if(o.st==='warn'){const k=(G.lt*3)%1;g.fillStyle='rgba(170,210,250,.85)';g.beginPath();g.ellipse(o.x,o.y+4+k*20,2.2,3.4,0,0,7);g.fill()}
    if(o.st==='spit'){g.strokeStyle='rgba(160,205,255,.8)';g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(o.x,o.y);g.quadraticCurveTo(o.x+o.f*6,o.y+4,o.x+o.f*4+Math.sin(G.lt*20)*1.5,o.y+Math.min(o.len,14));g.lineTo(o.x+o.f*3+Math.sin(G.lt*20)*1.5,o.y+o.len);g.stroke();g.strokeStyle='rgba(240,248,255,.7)';g.lineWidth=2;g.stroke();g.lineCap='butt';
      if(o.len>=o.yb-o.y-1){g.fillStyle='rgba(200,225,255,.6)';for(let k=0;k<5;k++){g.beginPath();g.arc(o.x+(k-2)*6+Math.sin(G.lt*30+k)*2,o.yb-4-Math.abs(Math.sin(G.lt*25+k))*8,2,0,7);g.fill()}}}}
  // jets des gargouilles n°2
  // la gargouille de la rose : deux bêtes au pied de la rose, un jet à la fois
  {const Ro=S.rose;for(const[gi,[gx,gy,f]]of[[0,FC_G2[0]],[1,FC_G2[1]]]){if(!vis(gx,gy))continue;fcGargoyle(g,gx,gy,f,1.7,(Ro.gi===gi||Ro.warn===gi)?Ro.jaw:0);
     if(Ro.warn===gi){const[mx,my]=fcMouth(gx,gy,f,1.7),k=(G.lt*3)%1;g.fillStyle='rgba(170,210,250,.85)';g.beginPath();g.ellipse(mx,my+4+k*14,2.4,3.6,0,0,7);g.fill()}}
   if(Ro.pts){g.strokeStyle='rgba(150,200,255,.75)';g.lineWidth=9;g.lineCap='round';g.beginPath();g.moveTo(Ro.pts[0][0],Ro.pts[0][1]);for(const[x,y]of Ro.pts)g.lineTo(x+Math.sin(G.lt*18+y*.05)*1.2,y);g.stroke();
     g.strokeStyle='rgba(245,250,255,.75)';g.lineWidth=3;g.stroke();g.lineCap='butt';if(Ro.reach){const[ex,ey]=Ro.pts[16];g.fillStyle='rgba(210,230,255,.6)';for(let k=0;k<6;k++){g.beginPath();g.arc(ex+(k-2.5)*5,ey+8-Math.abs(Math.sin(G.lt*22+k))*10,2.2,0,7);g.fill()}}}}
  for(const o of S.g2){const[gx,gy,f]=o.g;if(vis(gx,gy))fcGargoyle(g,gx,gy,f,1.7,o.on?1:o.warn?.3:0);if(!vis(gx,gy)&&!(o.pts&&vis(o.pts[16][0],o.pts[16][1])))continue;
    if(o.warn){const[mx,my]=fcMouth(gx,gy,f,1.7);g.fillStyle='rgba(170,210,250,.8)';const k=(G.lt*3)%1;g.beginPath();g.ellipse(mx,my+4+k*16,2.4,3.6,0,0,7);g.fill()}
    if(o.on&&o.pts){g.strokeStyle='rgba(150,200,255,.75)';g.lineWidth=9;g.lineCap='round';g.beginPath();g.moveTo(o.pts[0][0],o.pts[0][1]);for(const[x,y]of o.pts)g.lineTo(x+Math.sin(G.lt*18+y*.05)*1.2,y);g.stroke();
      g.strokeStyle='rgba(245,250,255,.75)';g.lineWidth=3;g.stroke();g.lineCap='butt';const[ex,ey]=o.pts[16];g.fillStyle='rgba(210,230,255,.6)';for(let k=0;k<6;k++){g.beginPath();g.arc(ex+(k-2.5)*5,ey+8-Math.abs(Math.sin(G.lt*22+k))*10,2.2,0,7);g.fill()}}}
  drawTowerMid(g,S,t);
  // pigeons
  for(const o of S.pig)if(vis(o.x,o.y))drawUglyPigeon(g,o,t);
  // pigeons chieurs : assis, la queue qui se relève avant de lâcher
  for(const o of S.shit){if(!vis(o.x,o.y))continue;g.save();g.translate(o.x,o.y);g.scale(-1,1);
    g.fillStyle='#6a7080';g.beginPath();g.ellipse(0,-10,11,8,0,0,7);g.fill();g.fillStyle='#565c6a';poly(g,[-8,-12,-20,-14-o.lift*8,-19,-7-o.lift*6,-8,-7]);g.fill();
    g.fillStyle='#4f8a7a';g.beginPath();g.ellipse(7,-15,4,5,.3,0,7);g.fill();g.fillStyle='#7a7e8a';g.beginPath();g.arc(10,-20,5,0,7);g.fill();g.fillStyle='#d97a2a';g.beginPath();g.arc(11.5,-21,1.6,0,7);g.fill();g.fillStyle='#111';g.beginPath();g.arc(11.8,-21,.7,0,7);g.fill();
    g.fillStyle='#c8a070';poly(g,[14,-20,18,-19,14,-18]);g.fill();g.fillStyle='rgba(255,255,255,.5)';g.beginPath();g.arc(13,-22,1.2,0,7);g.fill();g.restore()}
  for(const d of S.drops){if(!vis(d.x,d.y))continue;g.fillStyle='#eeeae0';if(d.dead){g.beginPath();g.ellipse(d.x,d.y-1,7,2.5,0,0,7);g.fill();g.fillStyle='#5a5446';g.beginPath();g.arc(d.x+1,d.y-2,1.6,0,7);g.fill()}
    else{g.beginPath();g.ellipse(d.x,d.y,3,4.5,0,0,7);g.fill();g.fillStyle='#5a5446';g.beginPath();g.arc(d.x,d.y+1,1.4,0,7);g.fill()}}
}

/* =========================================================
   LA TOUR SUD — l'intérieur du beffroi (même niveau, à droite de la façade) : on y entre par la fenêtre entrouverte
   (écran noir), on grimpe de mur en mur en évitant les ondes des cloches qui assomment et font retomber, les pics
   sous les consoles, les fientes des quatre pigeons du toit ; on sort sur la tourelle de gauche, où attend une lanterne.
   ========================================================= */
const FT={X0:66*T,X1:76*T,CAM:56*T,FLOOR:56*T,ROOF:26*T,TUR:24*T,BEAM:48*T+6,B1:69*T,B2:73*T};
// pics anti-pigeons : sous les consoles (ils piquent par en dessous) et sur le toit [x0,x1,y,sens]
const FT_SPK=[[66*T,68*T,44*T,1],[66*T,68*T,38*T,1],[66*T,68*T,32*T,1],[74*T,76*T,41*T,1],[74*T,76*T,35*T,1],[74*T,76*T,29*T,1],
  [66*T,67*T,26*T,-1],[70*T,72*T,26*T,-1],[62*T,63*T,24*T,-1],[65*T,66*T,24*T,-1],[76*T,77*T,24*T,-1],[78*T,80*T,24*T,-1]];
function ftBellAngle(b,t){const C=4,u=((t%C)+C)%C,ease=v=>.5-.5*Math.cos(Math.PI*v),inW=(a,e)=>{const d=((e-a)%C+C)%C;const k=((u-a)%C+C)%C;return k<d?k/d:-1};
  const rU=inW(b.tUp-1,b.tUp);if(rU>=0)return Math.PI*ease(rU);const rD=inW(b.tDown-1,b.tDown);if(rD>=0)return Math.PI*(1-ease(rD));
  const aU=((u-b.tUp)%C+C)%C,aD=((u-b.tDown)%C+C)%C;return aU<aD?Math.PI:0}
function towerStep(dt,S,hb,pcx,pcy,setHit){if(!S.bells)return;
  // la fenêtre entrouverte de la tour sud : on entre ; écran noir, puis l'intérieur du beffroi
  if(!S.inTower&&!P.dead&&overlap(hb,{x:32*T,y:19*T-30,w:T,h:70})){S.inTower=1;P.x=67*T+8;P.y=FT.FLOOR-P.h;P.vx=P.vy=0;P.onGround=true;P.cp={x:P.x+P.w/2,y:FT.FLOOR};P.lastGY=P.y;
    cam.x=FT.CAM;cam.y=clamp(P.y-H*.55,0,ROWS*T-H);G.fade=1;S.grace=1;
    if(!G.sim)setTimeout(()=>say("Le beffroi. Ça sent le bronze, la poussière et la fiente. Il faudra monter jusqu'au toit… sans prendre une cloche sur la tête.",4.6),900)}
  if(P.x>FT.CAM)S.inTower=1;
  const t=G.lt;
  // les cloches : elles tournent ; arrivées en bas, BAM (grande onde) ; arrivées en haut, bam (petite onde)
  for(const b of S.bells){const th=ftBellAngle(b,t),prev=b.th;b.th=th;
    const hitBottom=prev>.05&&th<=.001,hitTop=prev<Math.PI-.05&&th>=Math.PI-.001;
    if(hitBottom||hitTop){const cy=FT.BEAM+(hitBottom?44:-44);S.waves.push({x:b.x,y:cy,r:10,max:hitBottom?210:120,big:hitBottom});
      if(!G.sim&&S.inTower&&P.x>FT.CAM){if(hitBottom){tone(98,1.6,'sine',.18);tone(196,1.2,'triangle',.06);tone(147,1.4,'sine',.08)}else{tone(220,.9,'sine',.1);tone(330,.7,'triangle',.04)}}}}
  for(const w of S.waves){w.r+=(w.big?230:190)*dt;w.dead=w.r>w.max;
    if(!P.dead&&!(S.stun>0)&&Math.abs(Math.hypot(pcx-w.x,pcy-w.y)-w.r)<12){S.stun=.7;P.vx=(pcx>w.x?1:-1)*150;P.vy=Math.max(P.vy,320);P.onGround=false;P.onMover=null;P.flaps=MAXFLAPS;if(!G.sim)SFX.flap()}}
  S.waves=S.waves.filter(w=>!w.dead);
  // assommé : on ne contrôle plus rien, on retombe
  if(S.stun>0){S.stun-=dt;P.jumpBuf=0;P.vy=Math.max(P.vy,120);P.flaps=MAXFLAPS}
  // les pics
  if(!P.dead)for(const[x0,x1,y,d]of FT_SPK){const box=d>0?{x:x0,y:y+6,w:x1-x0,h:14}:{x:x0,y:y-16,w:x1-x0,h:14};if(overlap(hb,box)){setHit('spikes');break}}
  // en arrivant sur le toit
  if(!S.said.toit&&!G.sim&&P.onGround&&P.x>FT.X0&&P.y+P.h<=FT.ROOF+2){S.said.toit=1;say("Vous abusez, les gars… Mais à force de vous regarder, ça donne envie. Je me soulagerais bien, moi aussi.",4.6)}
}
/* le secret du toit : Raymond fait comme les copains */
function towerPoop(a){const FS=L.fc;if(!FS)return;
  FS.drops.push({x:P.x+P.w/2-P.facing*10,y:P.y+P.h-4,vy:40,own:1});
  grantSecret(a,a.y-30);unlock('a71');
  const roof=FS.shit.filter(o=>o.roof);
  roof.forEach((o,i)=>setTimeout(()=>{if(G.sim)return;bubble(o.x,o.y-30,'Copaiiiin !','#5a6a3a');parts.push({type:'tuftpop',x:o.x,y:o.y-14,life:0,max:1.3});if((S.run.wear||0)>0){S.run.wear--;P.sx=1.12;P.sy=1.12}SFX.straw()},300+i*380));
  if(!G.sim){noise(.3,600,.12,'lowpass');setTimeout(()=>say("Ah… Ça soulage. Et voilà qu'on m'offre de la paille. Les copains de toit, il n'y a que ça de vrai.",4.4),1900)}}

/* ---------- le décor de la tour (dans la couche de la façade) ---------- */
function towerBuild(g,R){const X0=FT.X0,X1=FT.X1,F=FT.FLOOR,RO=FT.ROOF,TU=FT.TUR,L0=FT.CAM,R1=82*T;
  // les murs épais du beffroi, en coupe ; dehors, à gauche et à droite, la pierre de la tour
  fcStone(g,L0,TU,X0,F,R,'#9a7a5c');fcStone(g,X1,TU,R1,F,R,'#9a7a5c');g.fillStyle='rgba(40,24,30,.35)';g.fillRect(X0-60,TU,60,F-TU);g.fillRect(X1,TU,60,F-TU);
  for(const[a,b]of[[L0,X0-60],[X1+60,R1]]){for(let y=TU+80;y<F-60;y+=260){g.fillStyle=FCC.deep;fcOgivePath(g,(a+b)/2,y+200,46,190);g.fill();g.strokeStyle=FCC.lit;g.lineWidth=2;g.beginPath();fcOgive(g,(a+b)/2,y+200,46,190);g.stroke()}}
  // le mur du fond : pierre dans l'ombre, la grande baie à abat-sons qui laisse voir le ciel du soir
  fcStone(g,X0,RO,X1,F,R,'#6e5648');g.fillStyle='rgba(20,10,20,.3)';g.fillRect(X0,RO,X1-X0,F-RO);
  {const cx=(X0+X1)/2,yb=F-300,w=150,h=840;g.fillStyle='#4a3a3a';fcOgivePath(g,cx,yb,w+30,h+20);g.fill();
   const sk=g.createLinearGradient(0,yb-h,0,yb);sk.addColorStop(0,'#3a4278');sk.addColorStop(.6,'#c07c86');sk.addColorStop(1,'#f0a878');g.fillStyle=sk;fcOgivePath(g,cx,yb,w,h);g.fill();
   g.save();fcOgivePath(g,cx,yb,w,h);g.clip();for(let y=yb-h+60;y<yb;y+=26){g.fillStyle='#3a2a26';g.fillRect(cx-w/2,y,w,10);g.fillStyle='rgba(255,190,120,.25)';g.fillRect(cx-w/2,y+10,w,2)}g.fillStyle='#3a2a26';g.fillRect(cx-5,yb-h,10,h);g.restore();
   g.strokeStyle='#8a6e58';g.lineWidth=4;g.beginPath();fcOgive(g,cx,yb,w,h);g.stroke()}
  // le beffroi de charpente : poteaux, contrefiches en croix, la poutre où tournent les cloches
  {const a=FT.B1-90,b=FT.B2+90,y=FT.BEAM;g.strokeStyle='#5a3a22';g.lineCap='round';g.lineWidth=14;g.beginPath();g.moveTo(a-20,F);g.lineTo(a,y);g.lineTo(b,y);g.lineTo(b+20,F);g.stroke();
   g.lineWidth=8;g.beginPath();g.moveTo(a-10,F-10);g.lineTo((a+b)/2,y+30);g.lineTo(b+10,F-10);g.moveTo(a,y+30);g.lineTo((a+b)/2,F-10);g.lineTo(b,y+30);g.stroke();
   g.strokeStyle='rgba(255,190,120,.25)';g.lineWidth=2;g.beginPath();g.moveTo(a,y-6);g.lineTo(b,y-6);g.stroke();g.lineCap='butt';
   g.fillStyle='#4a3020';g.fillRect(a-30,F-8,b-a+60,8)}
  // le plancher, les consoles de pierre (leur dessus = la planche) et les pics anti-pigeons
  g.fillStyle='#5a4030';g.fillRect(X0,F-4,X1-X0,4);for(let x=X0;x<X1;x+=34){g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x,F-4,1,4)}
  for(const[x0,x1,y,d]of FT_SPK)ftNeedles(g,x0,x1,y,d);
  // le toit : parapets ajourés, tourelles d'angle à pinacles ; la lanterne qui attend Raymond
  fcBalustrade(g,X0,X1,RO,26);fcLedge(g,X0,X1,RO);
  for(const[a,b]of[[62*T,X0],[X1,80*T]]){fcStone(g,a,TU,b,TU+70,R);fcLedge(g,a,b,TU);for(const px of[a+8,b-8])fcPinnacle(g,px,TU-14,22,110,R)}
  {const lx=63*T+20,ly=TU;g.strokeStyle='#2a2420';g.lineWidth=2;g.beginPath();g.moveTo(lx,ly-34);g.lineTo(lx,ly-46);g.stroke();g.beginPath();g.arc(lx,ly-48,4,0,7);g.stroke();
   g.fillStyle='#2a2420';poly(g,[lx-12,ly-34,lx+12,ly-34,lx+9,ly-6,lx-9,ly-6]);g.fill();g.fillStyle='rgba(255,200,110,.95)';poly(g,[lx-8,ly-31,lx+8,ly-31,lx+6,ly-9,lx-6,ly-9]);g.fill();
   g.fillStyle='#2a2420';g.fillRect(lx-12,ly-6,24,6);poly(g,[lx-14,ly-34,lx,ly-44,lx+14,ly-34]);g.fill();g.fillStyle='#ffe7a8';g.beginPath();g.ellipse(lx,ly-20,2.5,5,0,0,7);g.fill()}
}
function ftNeedles(g,x0,x1,y,d){g.fillStyle='#3a3c42';g.fillRect(x0+2,d>0?y+5:y-3,x1-x0-4,3);g.strokeStyle='#aeb4bc';g.lineWidth=1;
  for(let x=x0+5;x<x1-4;x+=4){const a=((x/4|0)%5-2)*.12;g.beginPath();if(d>0){g.moveTo(x,y+8);g.lineTo(x+Math.sin(a)*13,y+8+Math.cos(a)*13)}else{g.moveTo(x,y-3);g.lineTo(x+Math.sin(a)*13,y-3-Math.cos(a)*13)}g.stroke()}}
/* ---------- la tour, en direct : cloches, ondes, lueur de la lanterne ---------- */
function drawTowerMid(g,S,t){if(!S.bells||cam.x<FT.CAM-400)return;
  for(const b of S.bells){g.save();g.translate(b.x,FT.BEAM);g.rotate(b.th);
    // le joug de bois au-dessus de l'axe, la cloche de bronze en dessous (elle passe au-dessus en tournant)
    g.fillStyle='#6a4428';g.fillRect(-34,-26,68,20);g.fillRect(-18,-40,36,16);g.fillStyle='rgba(255,190,120,.25)';g.fillRect(-34,-26,68,3);
    g.fillStyle='#3a3a3e';g.beginPath();g.arc(0,0,6,0,7);g.fill();
    const gr=g.createLinearGradient(-36,0,36,0);gr.addColorStop(0,'#8a6420');gr.addColorStop(.35,'#e8b848');gr.addColorStop(.6,'#c8922c');gr.addColorStop(1,'#6a4818');g.fillStyle=gr;
    g.beginPath();g.moveTo(-16,0);g.quadraticCurveTo(-22,30,-30,62);g.quadraticCurveTo(-38,74,-40,80);g.lineTo(40,80);g.quadraticCurveTo(38,74,30,62);g.quadraticCurveTo(22,30,16,0);g.closePath();g.fill();
    g.fillStyle='#b8862a';g.fillRect(-40,76,80,6);g.fillStyle='#7a5418';g.fillRect(-24,30,48,3);g.fillRect(-30,54,60,3);
    g.fillStyle='#4a3010';g.beginPath();g.arc(0,74,7,0,7);g.fill();g.strokeStyle='#4a3010';g.lineWidth=3;g.beginPath();g.moveTo(0,4);g.lineTo(Math.sin(t*3)*3,70);g.stroke();g.restore()}
  for(const w of S.waves){const a=1-w.r/w.max;g.strokeStyle='rgba(255,230,140,'+(.65*a)+')';g.lineWidth=w.big?8:5;g.beginPath();g.arc(w.x,w.y,w.r,0,7);g.stroke();g.strokeStyle='rgba(255,250,220,'+(.4*a)+')';g.lineWidth=2;g.beginPath();g.arc(w.x,w.y,w.r-6,0,7);g.stroke()}
  if(S.stun>0){const x=P.x+P.w/2,y=P.y-6;for(let k=0;k<3;k++){const an=t*8+k*2.1;g.fillStyle='#ffe070';g.beginPath();g.arc(x+Math.cos(an)*12,y+Math.sin(an)*4,2.4,0,7);g.fill()}}
  const lx=63*T+20,ly=FT.TUR-20,gl=g.createRadialGradient(lx,ly,2,lx,ly,60);gl.addColorStop(0,'rgba(255,210,120,'+(.35+.08*Math.sin(t*5))+')');gl.addColorStop(1,'rgba(255,210,120,0)');g.fillStyle=gl;g.beginPath();g.arc(lx,ly,60,0,7);g.fill()}
