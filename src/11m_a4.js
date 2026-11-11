/* =========================================================
   4-1 · L'AUTOROUTE DE L'EST — l'A4 de nuit, de Reims vers l'ouest
   ---------------------------------------------------------
   Le monde est fixe ; les camions roulent vers la droite plus vite que Raymond. On commence sur le dos d'un camion.
   Trois ponts : trop bas pour rester sur le toit, un grand grillage anti-projection dessus — il faut se laisser tomber
   derrière le camion, passer dessous à pied, puis remonter sur le camion suivant : ses phares éclairent la route
   avant qu'il arrive ; il faut sauter à ce moment-là, sinon il écrase. Puis l'embouteillage du péage de Thillois,
   l'accident (deux conducteurs qui s'insultent et se jettent des objets), et les travaux jusqu'à l'aire de Gueux.
   Secrets : le pneu sous le deuxième pont (un hérisson), les deux gyrophares (coups de bec), le moteur fumant.
   ========================================================= */
THEMES.a4={outdoor:true,far:'sky',horizon:'road',sky:['#04060d','#0c1222','#1a2236'],celestial:'moon',stars:true,fog:'#10141f',dark:.58,weather:'night',
  floor:'#26262a',floorTop:'#4a4a52',type:'stone',x:'none',d:'drape',shelf:'girder',spike:'spikes',spikeCol:'#3a3e46',spikeBase:'#2a2c32',walker:'rat',flyer:'crow',crowCol:'#6e7380',awning:'#2f5a7a',props:[],noFore:true};
const A4={TRUCK_V:380,TW:470,TH:190,DECK:354,DTOP:298,FENCE:150,EVERY:5,CAB:14,CW:118};
const A4_TRW=A4.TW-A4.CW;   // remorque + attelage ; la cabine, un peu plus basse, est une plateforme à part
/* lampadaires : tous les 640 px, sauf là où ils gêneraient un panneau ou un pont ; un des lampadaires grésille */
function a4Lamps(Lv){if(Lv.a4LampList)return Lv.a4LampList;const D=Lv.def.a4,out=[];
  for(let x=300;x<Lv.wpx;x+=640){if(D.bridges.some(([a,b])=>x>a-160&&x<b+160||Math.abs(x-(a-1300+80))<300))continue;if(Math.abs(x-(D.exitX-160))<320)continue;out.push({x,blink:out.length===6})}
  return Lv.a4LampList=out}
function a4LampOn(l,t){return l.blink?((Math.sin(t*23)+Math.sin(t*7.3)+Math.sin(t*2.1))>.9?.12:1):1}
/* panneaux de direction, avant chaque pont */
const A4_SIGNS=[[/*v2*/'A4',/*v2*/'PARIS',/*v2*/'Château-Thierry'],[/*v2*/'Sortie 22',/*v2*/'Tinqueux',/*v2*/'Thillois'],[/*v2*/'A4',/*v2*/'PARIS',/*v2*/'Péage  2 km']];

/* ---------- le décor (couche en cache) ---------- */
function a4Build(Lv){
  const D=Lv.def.a4,wpx=Lv.wpx+40,hpx=ROWS*T+PAD,TR=Math.min(RS,1),{layer:c,g}=mkLayer(wpx*TR,hpx*TR);g.scale(TR,TR);c.rs=TR;g.translate(0,PAD);
  const R=mulberry(Lv.def.seed+7),GY=D.G0*T;
  // les champs et les bois, très sombres, la ligne des arbres
  g.fillStyle='#0c1018';g.fillRect(0,GY-150,wpx,150);for(let x=0;x<wpx;x+=18){const h=30+R()*50;g.fillStyle='#080b12';g.beginPath();g.ellipse(x,GY-150,14+R()*10,h,0,Math.PI,0);g.fill()}
  // l'autre chaussée, derrière la glissière (les véhicules y passent en direct)
  g.fillStyle='#15171c';g.fillRect(0,GY-120,wpx,74);g.fillStyle='rgba(230,230,220,.18)';for(let x=0;x<wpx;x+=120)g.fillRect(x,GY-64,50,3);
  // les panneaux de direction (portique bleu) avant les ponts
  D.bridges.forEach(([a,b],i)=>{const sx=a-1300,sg=A4_SIGNS[i%A4_SIGNS.length];
    g.fillStyle='#2a2c30';g.fillRect(sx-4,GY-300,7,300);g.fillRect(sx+168,GY-300,7,300);g.fillRect(sx-4,GY-306,179,6);
    g.fillStyle='#1e5aa8';rr(g,sx-20,GY-420,212,118,8);g.fill();g.strokeStyle='#f4f6fa';g.lineWidth=3;rr(g,sx-14,GY-414,200,106,6);g.stroke();
    g.textAlign='left';g.fillStyle='#d83020';rr(g,sx-4,GY-404,sg[0].length>2?92:44,24,4);g.fill();g.fillStyle='#fff';g.font='bold 15px '+F_DISP;g.fillText(sg[0],sx+4,GY-386);
    g.font='bold 24px '+F_DISP;g.fillText(sg[1],sx-2,GY-350);g.font='16px '+F_DISP;g.fillText(sg[2],sx-2,GY-322);
    g.font='bold 30px '+F_DISP;g.textAlign='right';g.fillText('↑',sx+178,GY-352)});
  // les ponts : un tablier mince, la chaussée du dessus et son grand grillage anti-projection (on ne passe ni dessus ni au travers)
  for(const[a,b]of D.bridges){
    g.fillStyle='#16181e';g.fillRect(a+40,A4.DECK,44,GY-A4.DECK);g.fillRect(b-84,A4.DECK,44,GY-A4.DECK);g.fillStyle='#1f2228';g.fillRect(a+40,A4.DECK,8,GY-A4.DECK);g.fillRect(b-84,A4.DECK,8,GY-A4.DECK);
    g.fillStyle='#4e5056';g.fillRect(a,A4.DTOP,b-a,A4.DECK-A4.DTOP);g.fillStyle='#5e6066';g.fillRect(a,A4.DECK-22,b-a,22);g.fillStyle='#34363c';g.fillRect(a,A4.DECK-3,b-a,3);
    g.fillStyle='#6a6e76';g.fillRect(a-6,A4.DTOP-8,b-a+12,10);
    // le grillage : poteaux, maille, lisse haute
    g.fillStyle='#3a3e46';for(let x=a;x<=b;x+=60)g.fillRect(x-2,A4.FENCE,5,A4.DTOP-A4.FENCE);g.fillRect(a-4,A4.FENCE-4,b-a+8,6);
    g.save();g.beginPath();g.rect(a,A4.FENCE,b-a,A4.DTOP-A4.FENCE);g.clip();g.strokeStyle='rgba(150,160,175,.32)';g.lineWidth=1;
    for(let k=-(A4.DTOP-A4.FENCE);k<b-a;k+=12){g.beginPath();g.moveTo(a+k,A4.DTOP);g.lineTo(a+k+(A4.DTOP-A4.FENCE),A4.FENCE);g.moveTo(a+k,A4.FENCE);g.lineTo(a+k+(A4.DTOP-A4.FENCE),A4.DTOP);g.stroke()}g.restore();
    g.fillStyle='#e8e8e0';g.font='bold 12px '+F_DISP;g.textAlign='center';g.fillText('3,50 m',(a+b)/2,A4.DECK-7)}
  Lv.a4Front=a4BuildFront(Lv);
  return c}
/* premier plan : ce qui est sur notre chaussée, devant la glissière (embouteillage, péage, travaux, aire de Gueux) */
function a4BuildFront(Lv){const D=Lv.def.a4,ox=D.jamX-200,wpx=Lv.wpx+40-ox,hpx=ROWS*T+PAD,TR=Math.min(RS,1),{layer:c,g}=mkLayer(wpx*TR,hpx*TR);g.scale(TR,TR);c.rs=TR;c.ox=ox;g.translate(-ox,PAD);
  const GY=D.G0*T;
  // l'embouteillage : voitures, camionnette, camion, car scolaire (feux stop allumés en direct)
  for(const[x0,x1,k,h]of D.jam)a4Vehicle(g,x0,x1,k,h,GY);
  // le péage de Thillois : la grande marquise, l'îlot et sa cabine, la barrière
  {const[a,b]=D.canopy;g.fillStyle='#2a2e36';g.fillRect(a,150,b-a,46);g.fillStyle='#d8d4c8';g.fillRect(a,150,b-a,6);g.fillStyle='#1e5aa8';g.fillRect(a+80,160,b-a-160,28);
   g.fillStyle='#fff';g.font='bold 16px '+F_DISP;g.textAlign='center';g.fillText('PÉAGE DE THILLOIS',(a+b)/2,180);
   for(const x of[a+40,b-40]){g.fillStyle='#3a3e46';g.fillRect(x-6,196,12,GY-196)}
   g.fillStyle='rgba(255,250,230,.8)';for(let x=a+30;x<b-20;x+=60)g.fillRect(x,196,30,4);
   a4Booth(g,D.booth,GY)}
  // les travaux : plots, camionnettes orange (gyrophares en direct), panneaux
  for(const x of D.cones){const cx=x+20,b=GY;g.fillStyle='#e8601c';poly(g,[cx-12,b-2,cx-4,b-38,cx+4,b-38,cx+12,b-2]);g.fill();g.fillStyle='#f0f0e8';g.fillRect(cx-8,b-26,16,6);g.fillStyle='#2a2a2a';g.fillRect(cx-16,b-4,32,4)}
  for(const[a,b]of D.vans)a4Van(g,a,b,GY);
  a4WorkSign(g,12990,GY);
  // le camion-benne : cabine et châssis (la benne est dessinée en direct)
  {const t=D.tar;const cx=t.x1,cw=t.c1-t.x1,ct=GY-160;g.fillStyle='#d8b818';rr(g,cx,ct,cw,136,12);g.fill();g.fillStyle='#b89810';g.fillRect(cx,ct+86,cw,50);g.fillStyle='rgba(255,255,255,.18)';g.fillRect(cx+8,ct+4,cw-20,5);
   g.fillStyle='#1c2430';rr(g,cx+60,ct+12,cw-70,48,6);g.fill();g.fillStyle='rgba(150,180,220,.22)';poly(g,[cx+70,ct+16,cx+86,ct+16,cx+74,ct+56,cx+64,ct+56]);g.fill();
   g.strokeStyle='rgba(0,0,0,.3)';g.lineWidth=2;g.strokeRect(cx+8,ct+10,46,108);g.fillStyle='#2a2a2e';g.fillRect(cx+42,ct+66,10,4);g.fillStyle='#2a2a2e';g.fillRect(cx-6,ct+20,6,30);
   g.fillStyle='rgba(0,0,0,.35)';for(let k=0;k<4;k++)g.fillRect(cx+cw-34,ct+76+k*8,28,4);g.fillStyle='#fff4c0';g.fillRect(cx+cw-8,ct+108,8,12);g.fillStyle='#2a2a2e';g.fillRect(cx+cw-12,ct+126,16,10);g.fillRect(cx+20,ct+128,30,6);
   g.fillStyle='#2a2c30';g.fillRect(cx+cw/2-12,ct-8,24,8);g.fillStyle='#ffa020';g.beginPath();g.arc(cx+cw/2,ct-10,9,Math.PI,0);g.fill();g.fillStyle='#2a2a2e';g.fillRect(t.x0,GY-80,t.x1-t.x0,34);g.fillStyle='#3a3a3e';g.fillRect(t.x0,GY-80,t.x1-t.x0,6);g.fillRect(t.x0,GY-52,t.c1-t.x0,16);g.fillStyle='#1a1a1c';for(let x=t.x0+30;x<t.x1;x+=60)g.fillRect(x,GY-74,8,28);
   for(const wx of[t.x0+60,t.x0+200,t.c1-60]){g.fillStyle='#141416';g.beginPath();g.arc(wx,GY-20,22,0,7);g.fill();g.fillStyle='#5a5a5e';g.beginPath();g.arc(wx,GY-20,9,0,7);g.fill()}}
  // le goudron frais sous le rouleau
  {const[a,b]=D.roller;g.fillStyle='#141416';g.fillRect(a-60,GY-4,b-a+120,6)}
  // l'aire de Gueux : le panneau bleu, la station au loin
  {const sx=D.exitX-260;g.fillStyle='#2a2c30';g.fillRect(sx,GY-250,6,250);g.fillRect(sx+200,GY-250,6,250);g.fillStyle='#1e5aa8';rr(g,sx-20,GY-330,246,92,8);g.fill();g.strokeStyle='#fff';g.lineWidth=3;rr(g,sx-14,GY-324,234,80,6);g.stroke();
   g.fillStyle='#fff';g.font='bold 20px '+F_DISP;g.textAlign='center';g.fillText('Aire de Gueux',sx+103,GY-290);g.font='bold 13px '+F_DISP;g.fillText('⛽  🍴   500 m',sx+103,GY-264);
   g.fillStyle='#1c2028';g.fillRect(D.exitX+60,GY-180,320,180);g.fillStyle='#d83020';g.fillRect(D.exitX+40,GY-200,360,26);g.fillStyle='rgba(255,240,200,.8)';g.fillRect(D.exitX+80,GY-150,120,60)}
  return c;
}
/* roues : jante, pneu, enjoliveur ; a = angle (immobile si le véhicule l'est) */
function a4Wheel(g,x,y,r,a){g.fillStyle='#0e0e10';g.beginPath();g.arc(x,y,r,0,7);g.fill();g.fillStyle='#55575d';g.beginPath();g.arc(x,y,r*.55,0,7);g.fill();
  g.save();g.translate(x,y);g.rotate(a||0);g.fillStyle='#2a2b30';for(let k=0;k<5;k++){g.rotate(Math.PI*2/5);g.fillRect(-1.2,r*.18,2.4,r*.32)}g.restore();g.fillStyle='#8a8c92';g.beginPath();g.arc(x,y,r*.14,0,7);g.fill()}
/* un véhicule à l'arrêt, calé sur ses cases : le haut dessiné = le haut des cases (voir 05d_m4) */
function a4Vehicle(g,x0,x1,k,h,GY){const w=x1-x0;
  const col={car:['#3a5a8a','#8a2a2a','#4a6a4a','#b8b4a8','#2a2a2e','#6a4a8a'][Math.floor(x0/97)%6],carB:'#7a2a2a',carA:'#2a4a7a',van:'#d8d8d0',truck:'#4a6a8a',bus:'#e8b020'}[k];
  const shade=(c,a)=>{g.fillStyle=c;g.globalAlpha=a};
  if(k.startsWith('car')){
    // caisse (hauteur une case), habitacle (deux cases, entre la première et la dernière case)
    g.fillStyle=col;rr(g,x0,GY-40,w,30,9);g.fill();
    g.beginPath();g.moveTo(x0+14,GY-38);g.lineTo(x0+40,GY-78);g.quadraticCurveTo(x0+42,GY-80,x0+48,GY-80);g.lineTo(x1-46,GY-80);g.quadraticCurveTo(x1-40,GY-80,x1-36,GY-76);g.lineTo(x1-12,GY-38);g.closePath();g.fill();
    g.fillStyle='rgba(255,255,255,.1)';g.fillRect(x0+6,GY-38,w-12,3);
    g.fillStyle='#1a2230';const mid=(x0+x1)/2;poly(g,[x0+24,GY-40,x0+44,GY-73,mid-4,GY-73,mid-4,GY-40]);g.fill();poly(g,[mid+4,GY-40,mid+4,GY-73,x1-48,GY-73,x1-22,GY-40]);g.fill();
    g.fillStyle='rgba(150,180,220,.18)';poly(g,[x0+30,GY-42,x0+46,GY-70,x0+56,GY-70,x0+40,GY-42]);g.fill();
    g.fillStyle='rgba(0,0,0,.25)';g.fillRect(mid-4,GY-40,8,28);g.fillRect(mid+20,GY-32,10,3);g.fillRect(x0+46,GY-32,10,3);
    g.fillStyle='#fff3c8';g.fillRect(x1-6,GY-34,6,7);g.fillStyle='#2a2a2e';g.fillRect(x0-2,GY-18,w+4,6);
    for(const wx of[x0+44,x1-44]){g.fillStyle='#0a0a0c';g.beginPath();g.arc(wx,GY-15,19,Math.PI,0);g.fill();a4Wheel(g,wx,GY-14,15,wx*.1)}
    if(k==='carB'){// le capot relevé, le moteur à nu devant
      g.fillStyle='#2a2a2e';g.fillRect(x1,GY-40,36,26);g.fillStyle='#5a5a5e';for(let i=0;i<3;i++)g.fillRect(x1+4+i*10,GY-36,6,14);g.fillStyle=col;poly(g,[x1-2,GY-40,x1+4,GY-92,x1+14,GY-90,x1+8,GY-40]);g.fill()}
    if(k==='carA'){g.strokeStyle='#121214';g.lineWidth=2;g.beginPath();g.moveTo(x0+2,GY-36);g.lineTo(x0+12,GY-28);g.lineTo(x0+4,GY-20);g.stroke()}}
  else if(k==='van'){// fourgon : caisse de trois cases, nez de deux
    g.fillStyle=col;rr(g,x0,GY-120,w-36,108,8);g.fill();rr(g,x1-48,GY-80,48,68,9);g.fill();
    g.beginPath();g.moveTo(x1-40,GY-120);g.lineTo(x1-12,GY-82);g.lineTo(x1-40,GY-82);g.closePath();g.fill();
    g.fillStyle='#1a2230';poly(g,[x1-40,GY-112,x1-18,GY-84,x1-40,GY-84]);g.fill();g.fillRect(x1-86,GY-104,38,30);
    g.fillStyle='rgba(0,0,0,.12)';g.fillRect(x0+(w-36)*.55,GY-118,2,100);g.fillStyle='#c83a2a';g.fillRect(x0+10,GY-60,w-60,6);
    g.fillStyle='#fff3c8';g.fillRect(x1-6,GY-44,6,8);g.fillStyle='#2a2a2e';g.fillRect(x0-2,GY-18,w+4,6);
    for(const wx of[x0+46,x1-50]){g.fillStyle='#0a0a0c';g.beginPath();g.arc(wx,GY-15,19,Math.PI,0);g.fill();a4Wheel(g,wx,GY-14,15,wx*.1)}}
  else if(k==='truck'){a4TruckBody(g,x0,GY-160,w,160,col,'TRANSPORTS',x0*.1)}
  else if(k==='bus'){// le car scolaire : jaune, bandes noires, pictogramme des enfants
    g.fillStyle=col;rr(g,x0,GY-160,w,146,12);g.fill();g.fillStyle='#1a1a1a';g.fillRect(x0,GY-60,w,5);g.fillRect(x0,GY-48,w,3);
    g.fillStyle='#1a2230';for(let x=x0+20;x<x1-70;x+=50)rr(g,x,GY-146,40,46,4),g.fill();rr(g,x1-58,GY-150,46,70,6);g.fill();
    g.fillStyle='rgba(150,180,220,.15)';for(let x=x0+24;x<x1-70;x+=50)g.fillRect(x,GY-142,8,38);
    g.fillStyle='#f4d020';g.fillRect(x0+20,GY-92,60,28);g.strokeStyle='#1a1a1a';g.lineWidth=2;g.strokeRect(x0+20,GY-92,60,28);
    g.fillStyle='#1a1a1a';for(const[cx,s]of[[x0+42,1],[x0+60,.85]]){g.beginPath();g.arc(cx,GY-84,3*s,0,7);g.fill();g.fillRect(cx-3*s,GY-80,6*s,10*s);g.fillRect(cx-3*s,GY-70,2,4);g.fillRect(cx+s,GY-70,2,4)}
    g.fillStyle='#fff3c8';g.fillRect(x1-6,GY-46,6,10);g.fillStyle='#2a2a2e';g.fillRect(x0-2,GY-20,w+4,7);
    for(const wx of[x0+60,x1-70]){g.fillStyle='#0a0a0c';g.beginPath();g.arc(wx,GY-16,22,Math.PI,0);g.fill();a4Wheel(g,wx,GY-15,17,wx*.1)}}}
/* un poids lourd (semi-remorque) de hauteur h, cabine aussi haute que la remorque */
function a4TruckBody(g,x,y,w,h,col,label,wa,cd0){const GY=y+h,cw=Math.min(118,w*.27),tw=w-cw-6,cd=cd0!=null?cd0:A4.CAB;
  // remorque : caisse claire, nervures, bandeau, inscription
  g.fillStyle='#dcdcd4';rr(g,x,y,tw,h-34,5);g.fill();g.fillStyle='rgba(0,0,0,.08)';for(let k=x+36;k<x+tw-10;k+=36)g.fillRect(k,y+4,2,h-42);
  g.fillStyle=col;g.fillRect(x,y+h-56,tw,8);g.fillStyle='rgba(0,0,0,.42)';g.font='bold '+Math.round(h*.085)+'px '+F_DISP;g.textAlign='center';g.fillText(label,x+tw/2,y+h*.36);
  g.fillStyle='#2a2a2e';g.fillRect(x,y+h-34,tw+cw,10);g.fillStyle='#ff3020';g.fillRect(x-2,y+h-52,6,12);
  // cabine : un peu plus basse que la remorque, pare-brise, rétroviseur, calandre
  const cx=x+tw+6;y+=cd;h-=cd;g.fillStyle=col;rr(g,cx,y,cw,h-18,10);g.fill();g.fillStyle='rgba(255,255,255,.12)';g.fillRect(cx+6,y+4,cw-12,4);
  g.fillStyle='#1a2230';rr(g,cx+cw*.42,y+h*.18,cw*.5,h*.26,6);g.fill();g.fillStyle='rgba(150,180,220,.2)';g.fillRect(cx+cw*.46,y+h*.2,6,h*.22);
  g.fillStyle='rgba(0,0,0,.25)';g.fillRect(cx+6,y+h*.2,cw*.3,h*.3);g.fillStyle='#2a2a2e';g.fillRect(cx+cw-4,y+h*.2,6,h*.16);
  g.fillStyle='rgba(0,0,0,.35)';for(let k=0;k<4;k++)g.fillRect(cx+cw-26,y+h*.56+k*8,22,4);
  g.fillStyle='#fff4c0';g.fillRect(cx+cw-7,y+h-46,7,12);g.fillStyle='#2a2a2e';g.fillRect(cx-4,y+h-22,cw+6,8);
  for(const wx of[x+50,x+104,x+tw-70,cx+cw-40]){g.fillStyle='#0a0a0c';g.beginPath();g.arc(wx,GY-17,22,Math.PI,0);g.fill();a4Wheel(g,wx,GY-15,16,wa)}}

/* la cabine de péage : socle bardé, guichet vitré éclairé (le péagiste dedans), auvent ; la borne automatique et sa barrière */
function a4Booth(g,[c0,c1],GY){const w=c1-c0;
  // le socle (on peut s'y poser) : panneaux de bardage, chevrons jaunes et noirs au pied
  g.fillStyle='#b8b6ae';g.fillRect(c0,GY-120,w,120);g.fillStyle='#a4a29a';for(let x=c0+30;x<c1;x+=30)g.fillRect(x,GY-114,2,90);
  g.fillStyle='#d4d2ca';g.fillRect(c0-4,GY-124,w+8,8);g.fillStyle='rgba(0,0,0,.18)';g.fillRect(c0,GY-116,w,4);
  g.fillStyle='#1a1a1a';g.fillRect(c0,GY-24,w,24);g.fillStyle='#e8b020';for(let x=c0-24;x<c1;x+=24){g.save();g.beginPath();g.rect(c0,GY-24,w,24);g.clip();poly(g,[x,GY,x+12,GY-24,x+24,GY-24,x+12,GY]);g.fill();g.restore()}
  // le guichet : montants, grande vitre éclairée, le péagiste, la tablette
  const y0=GY-232,y1=GY-124;g.fillStyle='#e8e6e0';g.fillRect(c0+6,y0,w-12,y1-y0);
  const gl=g.createLinearGradient(0,y0+14,0,y1-10);gl.addColorStop(0,'#f6dc9a');gl.addColorStop(1,'#d8a856');g.fillStyle=gl;g.fillRect(c0+14,y0+16,w-28,y1-y0-34);
  {const px=c0+w*.4,py=y1-18;g.save();g.beginPath();g.rect(c0+14,y0+16,w-28,y1-y0-34);g.clip();fkDraw(g,fkMake(12700,{fem:false,old:false,coat:'#3a4a6a',hat:null,tie:'#8a2a2a'}),px,y0+150,0,'stand',{f:1});g.restore();
   g.fillStyle='#2a2a2e';rr(g,px+18,py-30,20,14,2);g.fill();g.fillStyle='#7ac8e8';g.fillRect(px+20,py-28,16,9)}
  g.fillStyle='rgba(255,255,255,.28)';poly(g,[c0+20,y0+18,c0+40,y0+18,c0+24,y1-20,c0+16,y1-20]);g.fill();
  g.fillStyle='#8a8880';g.fillRect(c0+6,y0,6,y1-y0);g.fillRect(c1-12,y0,6,y1-y0);g.fillRect(c0+6,y1-18,w-12,6);g.fillStyle='#c8c6be';g.fillRect(c0+10,y1-20,w-20,4);
  // l'auvent : bandeau rouge et blanc, feu de voie vert
  g.fillStyle='#2a2e36';g.fillRect(c0-10,y0-18,w+20,18);g.fillStyle='#d83020';g.fillRect(c0-10,y0-4,w+20,6);g.fillStyle='#f0ece4';for(let x=c0-10;x<c1+10;x+=20)g.fillRect(x,y0-4,10,6);
  g.fillStyle='#14161a';rr(g,c0+w/2-14,y0-40,28,22,4);g.fill();g.fillStyle='#4ae070';g.beginPath();g.arc(c0+w/2,y0-29,7,0,7);g.fill();g.fillStyle='rgba(74,224,112,.25)';g.beginPath();g.arc(c0+w/2,y0-29,14,0,7);g.fill();
  // la borne automatique : écran, fente, bouton du ticket ; la barrière part d'elle
  const bx=c1+8;g.fillStyle='#3a5a8a';rr(g,bx,GY-150,30,150,6);g.fill();g.fillStyle='#2a4670';g.fillRect(bx+24,GY-146,6,146);
  g.fillStyle='#14161a';g.fillRect(bx+4,GY-140,22,16);g.fillStyle='#6ab0e0';g.fillRect(bx+6,GY-138,18,12);g.fillStyle='#e8c040';g.beginPath();g.arc(bx+15,GY-108,5,0,7);g.fill();
  g.fillStyle='#14161a';g.fillRect(bx+6,GY-94,18,3);g.fillRect(bx+6,GY-80,18,3);g.fillStyle='#f0ece4';g.font='bold 7px '+F_DISP;g.textAlign='center';g.fillText('TICKET',bx+15,GY-64);
  g.fillStyle='#2a2c30';g.fillRect(bx+30,GY-116,14,18);g.fillStyle='#d83020';g.fillRect(bx+44,GY-110,78,8);for(let x=bx+50;x<bx+120;x+=24){g.fillStyle='#fff';g.fillRect(x,GY-110,12,8)}
  g.fillStyle='#d83020';g.beginPath();g.arc(bx+122,GY-106,4,0,7);g.fill()}
/* le panneau de chantier : triangle à bord rouge sur fond jaune (signalisation temporaire), pictogramme du cantonnier, chevalet et lests */
function a4WorkSign(g,x,GY){const top=GY-170,s=46;
  g.strokeStyle='#4a4c52';g.lineWidth=4;g.beginPath();g.moveTo(x-30,GY-2);g.lineTo(x-6,top+70);g.moveTo(x+30,GY-2);g.lineTo(x+6,top+70);g.moveTo(x-24,GY-26);g.lineTo(x+24,GY-26);g.stroke();
  g.fillStyle='#5a4a32';for(const dx of[-34,26]){rr(g,x+dx-4,GY-12,16,12,4);g.fill()}
  g.lineJoin='round';g.fillStyle='#c8201a';poly(g,[x,top,x+s,top+80,x-s,top+80]);g.fill();g.fillStyle='#f2c820';poly(g,[x,top+13,x+s-12,top+73,x-s+12,top+73]);g.fill();
  g.fillStyle='#1a1a1a';g.beginPath();g.arc(x-4,top+36,4.5,0,7);g.fill();poly(g,[x-8,top+42,x+2,top+42,x+6,top+58,x+12,top+68,x+6,top+68,x,top+60,x-6,top+68,x-12,top+68,x-6,top+56]);g.fill();
  g.strokeStyle='#1a1a1a';g.lineWidth=2.4;g.beginPath();g.moveTo(x+1,top+46);g.lineTo(x+14,top+52);g.lineTo(x+20,top+68);g.stroke();g.fillRect(x+12,top+64,14,5);
  g.fillStyle='#1a1a1a';poly(g,[x+16,top+60,x+30,top+68,x+16,top+68]);g.fill();
  g.fillStyle='#2a2c30';g.fillRect(x-7,top-14,14,12);g.fillStyle='#ffa020';g.beginPath();g.arc(x,top-16,8,Math.PI,0);g.fill();g.lineJoin='miter'}
function a4Van(g,a,b,GY){const top=GY-3*T;g.fillStyle='#e8701c';rr(g,a,top,b-a-40,3*T-14,8);g.fill();rr(g,b-60,top+30,60,3*T-44,10);g.fill();g.fillStyle='#1c2430';g.fillRect(b-52,top+40,40,30);
  for(let x=a+6;x<b-60;x+=28){g.fillStyle=(x/28|0)%2?'#f0f0e8':'#d83020';poly(g,[x,GY-30,x+14,GY-30,x+28,GY-16,x+14,GY-16]);g.fill()}
  g.fillStyle='#1a1a1a';g.font='bold 12px '+F_DISP;g.textAlign='center';g.fillText('AUTOROUTES',a+(b-a-40)/2,top+40);
  for(const wx of[a+40,b-46]){g.fillStyle='#121214';g.beginPath();g.arc(wx,GY-14,16,0,7);g.fill()}}

/* ---------- après lecture ---------- */
function a4Post(Lv){const D=Lv.def.a4;if(!D)return;
  const S={trucks:[],spawnT:A4.EVERY,said:{},grace:0,objs:[],objT:1,insT:.5,bedA:0,roll:{x:D.roller[0],dir:1,pause:0},beacons:[{x:D.vans[0][0]+120,on:true},{x:D.vans[1][0]+120,on:true}],hog:null};Lv.a4=S;
  // le camion de départ, avec Raymond dessus
  const t0=a4Truck(Lv,60);S.trucks.push(t0);S.startTruck=t0;
  // les secrets : le pneu, les gyrophares (le second compte), le moteur
  Lv.acts=Lv.acts||[];
  Lv.acts.push({kind:'secret',style:'tyre',x:D.tyre,y:D.G0*T,open:0,t:0,used:false,noStraw:false,q:null});
  Lv.acts.push({kind:'beacon',style:'beacon',x:S.beacons[0].x,y:D.G0*T-3*T,i:0,open:0,t:0,used:false});
  Lv.acts.push({kind:'secret',style:'beacon',x:S.beacons[1].x,y:D.G0*T-3*T,i:1,open:0,t:0,used:false,noStraw:true,q:["Et de deux. La nuit redevient la nuit. Au génie, on appelait ça « camoufler les feux »."]});
  Lv.acts.push({kind:'secret',style:'engine',x:D.engine+10,y:D.G0*T-T,open:0,t:0,used:false,q:["Une bille dans le moteur… et de la paille qui sort. Ça fumait déjà : je viens de leur éviter un incendie. Personne ne dit merci, évidemment."]});
}
function a4Truck(Lv,x){const m={axis:'g',kind:'a4truck',wa:0,x,y:Lv.def.a4.G0*T-A4.TH,w:A4.TW,colW:A4_TRW,h:14,vh:A4.TH,dx:0,dy:0,v:A4.TRUCK_V,on:true,col:pick(['#c8302a','#2a5a9a','#e0e0d8','#3a7a4a','#d8a020'])};
  m.cab={axis:'g',kind:'a4cab',par:m,x:x+A4_TRW,y:m.y+A4.CAB,w:A4.CW,h:14,dx:0,dy:0,on:true};Lv.movers.push(m,m.cab);return m}
function a4Prune(){L.movers=L.movers.filter(m=>m.kind==='a4truck'?m.on:m.kind==='a4cab'?m.par.on:true)}
const a4Riding=m=>P.onMover===m||P.onMover===m.cab;
function a4PlaceOnTruck(m){P.x=m.x+m.w*.55;P.y=m.y-P.h;P.vx=P.vy=0;P.onGround=true;P.onMover=m;P.lastGY=P.y}
function a4Step(dt){const S=L.a4;if(!S)return;const D=L.def.a4,GY=D.G0*T,hb={x:P.x+3,y:P.y+4,w:P.w-6,h:P.h-6},pcx=P.x+P.w/2,pcy=P.y+P.h/2;let hit=null;
  if(!S.started){S.started=1;a4PlaceOnTruck(S.startTruck)}
  // les camions : ils roulent ; à l'embouteillage, ils s'arrêtent en file ; hors de vue, ils disparaissent
  {const vis=m=>m.x<cam.x+W+60&&m.x+m.w>cam.x-60;let lim=D.jamX-6;
   const order=S.trucks.filter(m=>m.on).sort((a,b)=>b.x-a.x);
   for(const m of order){const px=m.x;
     if(m.stopped){lim=m.x-40;m.dx=m.cab.dx=0;continue}
     if(m.x+m.w>lim-30){m.v=Math.max(0,m.v-900*dt);if(m.x+m.w>=lim){m.x=lim-m.w;m.v=0;m.stopped=1;lim=m.x-40}}
     m.x+=m.v*dt;m.dx=m.x-px;m.wa=(m.wa||0)+m.dx/15;m.cab.x=m.x+A4_TRW;m.cab.dx=m.dx;
     if(!m.stopped)lim=Math.min(lim,m.x-40)}
   for(const m of S.trucks){if(!m.on||a4Riding(m))continue;
     const gone=m.stopped?!vis(m):(m.x>cam.x+W+300||m.x+m.w<cam.x-1100-A4.TW);
     if(gone){m.on=false;m.y=99999}}
   S.trucks=S.trucks.filter(m=>m.on);a4Prune();
   for(const m of S.trucks)if(!P.dead&&!a4Riding(m)&&(overlap(hb,{x:m.x+8,y:m.y+A4.CAB+8,w:A4_TRW-8,h:m.vh-A4.CAB-8})||overlap(hb,{x:m.cab.x,y:m.cab.y+10,w:A4.CW-8,h:m.vh-A4.CAB-10})))hit='camion'}
  // de la cabine vers l'arrière : on remonte d'une marche sur la remorque (au lieu de tomber dedans)
  if(P.onMover&&P.onMover.kind==='a4cab'&&P.x+P.w/2<P.onMover.x+2){const m=P.onMover.par;P.onMover=m;P.y=m.y-P.h;P.vy=0;P.onGround=true}
  // les ponts : sur le toit d'un camion, on s'y écrase ; on ne peut pas sauter par-dessus (grillage)
  // (sur le toit, la tête touche le tablier : l'espace au-dessus du camion est plus petit qu'un pigeon ; sur la cabine aussi)
  for(const[a,b]of D.bridges)if(!P.dead&&pcx>a-8&&pcx<b+8&&(P.y+4<A4.DECK||(P.onMover&&P.onMover.kind==='a4cab'))){hit='pont';break}
  // un camion toutes les 3,5 s, derrière l'écran, jusqu'à l'approche de l'embouteillage
  {S.spawnT-=dt;if(S.spawnT<=0){S.spawnT=A4.EVERY;const sx=cam.x-520-A4.TW;
     if(pcx<D.jamX-1200&&S.grace<=0&&!S.trucks.some(m=>!m.stopped&&Math.abs(m.x-sx)<700)){const m=a4Truck(L,sx);S.trucks.push(m);
       const onRoad=!P.onMover&&P.y+P.h>=GY-2,passed=D.bridges.some(([a,b])=>pcx>b+40);
       if(onRoad&&passed&&!S.said.phares&&!G.sim){S.said.phares=1;say("Des phares, derrière ! Quand la lumière arrive sur moi, il faut sauter, sinon c'est le camion qui arrive.",4.2)}
       if(onRoad&&!G.sim){tone(70,1.4,'sawtooth',.03);noise(.9,300,.05,'lowpass')}}}}
  if(!S.said.pont&&!G.sim&&pcx>D.bridges[0][0]-900){S.said.pont=1;say(/*v2*/"Un pont ! Trop bas pour rester sur le toit, et son grillage est trop haut pour passer par-dessus. Descendre par l'arrière, et vite.",4.2)}
  // l'embouteillage, l'accident : les deux conducteurs s'insultent et se jettent des objets
  {const dB=12030,dA=12575;S.insT-=dt;if(S.insT<=0&&Math.abs(pcx-12300)<900&&!G.sim){S.insT=1.1+rnd()*.8;const left=rnd()<.5;bubble(left?dB:dA,GY-110,pick(['#!gr@%=','&*%$#!','@#!!*','%$&@#','#@!?$%']),'#6a2a2a')}
   S.objT-=dt;if(S.objT<=0&&Math.abs(pcx-12300)<1100){S.objT=1.25;S.objDir=-(S.objDir||1);const from=S.objDir>0?dB:dA,to=S.objDir>0?dA:dB;S.objs.push({x:from,y:GY-80,vx:(to-from)/1.4,vy:-520,k:pick(['shoe','bottle','atlas','apple','phone']),rot:0,b:0})}
   for(const o of S.objs){o.vy+=900*dt;o.x+=o.vx*dt;o.y+=o.vy*dt;o.rot+=dt*9;
     const c=Math.floor(o.x/T),r=Math.floor((o.y+6)/T);if(o.vy>0&&isSolid(c,r)&&o.b<2){o.y=r*T-6;o.vy=-(420+rnd()*200);o.vx=(rnd()-.5)*520;o.b++}
     if(!P.dead&&Math.abs(o.x-pcx)<14&&Math.abs(o.y-pcy)<16)hit='objet'}
   S.objs=S.objs.filter(o=>o.y<GY+40&&o.y>-200);
   if(!S.said.jam&&!G.sim&&pcx>D.jamX-300){S.said.jam=1;say("Tout le monde est arrêté. Le péage de Thillois ? Ils paient pour avancer ? Et ils n'avancent pas… Je ne comprends pas le but !",4)}
   if(!S.said.acc&&!G.sim&&pcx>11700){S.said.acc=1;say("Un accrochage, devant. Ils s'envoient leurs affaires à la figure. On se croirait dans une tranchée.",4)}}
  // le camion-benne : la benne se lève (et verse le goudron), redescend ; levée, elle barre le passage
  {const t=D.tar,u=G.lt%7,ang=u<2.2?0:u<3?(u-2.2)/.8:u<6.2?1:1-(u-6.2)/.8;S.bedA=ang;const up=ang>.25;
   const cols=[Math.floor((t.x1-140)/T),Math.floor((t.x1-100)/T),Math.floor((t.x1-60)/T)];
   for(let c=Math.floor(t.x0/T);c<Math.floor(t.x1/T);c++)L.g[D.G0-3][c]=up?'.':'X';
   // levée, la benne barre le passage jusqu'au châssis : plus de vide où se glisser dessous
   for(const c of cols)for(let r=4;r<=D.G0-3;r++)L.g[r][c]=up?'X':'.';
   if(up&&!P.dead&&pcx>t.x1-150&&pcx<t.x1-20&&P.y<(D.G0-3)*T&&P.y+P.h>4*T&&ang<.6)hit='benne';
   if(ang>.5&&!P.dead&&pcx>t.x0-40&&pcx<t.x0-6&&P.y+P.h>GY-150)hit='goudron';
   if(!S.said.travaux&&!G.sim&&pcx>13000){S.said.travaux=1;say("Des travaux, de nuit. Comme au front : on répare la route pendant que l'ennemi dort.",4)}}
  // le rouleau compresseur : il va et vient, vif, des pics anti-pigeons sur le dessus
  {const Rl=S.roll,[a,b]=D.roller;if(Rl.pause>0)Rl.pause-=dt;else{Rl.x+=Rl.dir*330*dt;if(Rl.x>b-150){Rl.x=b-150;Rl.dir=-1;Rl.pause=.35}if(Rl.x<a){Rl.x=a;Rl.dir=1;Rl.pause=.35}}
   if(!P.dead&&overlap(hb,{x:Rl.x+6,y:GY-112,w:138,h:112}))hit='rouleau'}
  // les ouvriers qui discutent : ils lèvent les bras quand on passe au-dessus
  for(const wx of D.workers){const up=Math.abs(pcx-wx)<70&&P.y+P.h<GY-40;if(up&&!G.sim&&!S.said.ouv){S.said.ouv=1;bubble(wx,GY-130,'Hé ! Un pigeon !','#2a3a5a')}
    if(!P.dead&&overlap(hb,{x:wx-11,y:GY-(up?118:96),w:22,h:up?118:96}))hit='ouvriers'}
  // le hérisson du pneu : il file sur l'autoroute, vers la gauche
  if(S.hog){S.hog.x-=200*dt;S.hog.t+=dt;if(S.hog.t>6)S.hog=null}
  if(S.grace>0){S.grace-=dt;hit=null}
  if(hit)G.a4Hit=hit;
}
function a4AfterMove(){if(G.a4Hit){const k=G.a4Hit;G.a4Hit=null;return k}return null}
function a4Respawn(){const S=L.a4;if(!S)return;const D=L.def.a4;S.grace=2.2;S.objs=[];S.spawnT=A4.EVERY;
  // avant le premier pont : on repart sur un camion ; ensuite, à pied (le camion suivant arrive à son rythme)
  if(P.cp.x<D.bridges[0][0]){for(const m of S.trucks){m.on=false;m.y=99999}S.trucks=[];const m=a4Truck(L,P.cp.x-A4.TW*.55);S.trucks.push(m);a4PlaceOnTruck(m)}
  else for(const m of S.trucks)if(Math.abs(m.x-P.x)<1100||m.stopped){m.on=false;m.y=99999}
  S.trucks=S.trucks.filter(m=>m.on);a4Prune()}
/* actions : les gyrophares, le pneu, le moteur */
function a4Act(a){const S=L.a4;if(!S)return false;
  if(a.style==='beacon'){const b=S.beacons[a.i];if(!b.on){if(!G.sim)say("Celui-là, c'est fait. J'en vois un autre au loin.",2.4);return true}
    b.on=false;if(!G.sim){tone(880,.06,'square',.05);noise(.15,2600,.1,'highpass')}const other=S.beacons[1-a.i];
    if(other.on){if(!G.sim)say(a.i===0?"Ah… Ça fait du bien aux yeux. J'ai failli faire une crise d'épilepsie.":"Un de moins. Il en reste un, là-bas, qui clignote encore.",3.8)}
    else{const sec=L.acts.find(x=>x.kind==='secret'&&x.style==='beacon');if(sec&&!sec.used)grantSecret(sec,sec.y-30)}
    return true}
  if(a.style==='tyre'){if(a.used)return false;grantSecret(a,a.y-30);S.hog={x:a.x-10,t:0};
    if(!G.sim){noise(.3,900,.12,'bandpass');setTimeout(()=>say("Un hérisson ! Non… non, pas par là ! Pas sur l'autoroute ! Vous faites tous la même connerie, et vous finissez en tapis sous les pneus !",4.6),500)}return true}
  if(a.style==='engine'){if(a.used)return false;S.drops=S.drops||[];grantSecret(a,a.y-30);if(!G.sim)noise(.25,500,.1,'lowpass');return true}
  return false}
function a4Lights(){const S=L.a4;if(!S)return[];const D=L.def.a4,GY=D.G0*T,out=[];
  for(const l of a4Lamps(L))out.push({x:l.x+50,y:GY-280,r:300,i:.95*a4LampOn(l,G.lt),warm:1});
  for(const m of S.trucks){out.push({x:m.x+m.w+180,y:GY-40,r:260,i:.95});out.push({x:m.x-10,y:GY-40,r:70,i:.6,warm:2})}
  for(const[x0,x1]of D.jam)out.push({x:x0+6,y:GY-50,r:70,i:.6,warm:2});
  out.push({x:(D.canopy[0]+D.canopy[1])/2,y:220,r:420,i:.9});
  for(const b of S.beacons)if(b.on)out.push({x:b.x,y:GY-3*T-14,r:330,i:.8+.2*Math.sin(G.lt*12),warm:2});
  out.push({x:D.exitX+200,y:GY-120,r:360,i:.9,warm:1});
  return out}
/* ---------- dessin ---------- */
function drawA4Back(t,cx){const Lv=L;if(!Lv.a4Layer)return;const ly=Lv.a4Layer,tr=ly.rs||1,sx=Math.max(0,cx-30),sw=Math.min(W+80,ly.width/tr-sx);if(sw>0)blitLayer(ctx,ly,sx*tr,0,sw*tr,ly.height,sx,-PAD,sw,ly.height/tr);
  try{a4BackLive(t,cx)}finally{const f=Lv.a4Front;if(f){const ox=f.ox,fx=Math.max(ox,cx-30),fw=Math.min(W+80,ox+f.width/tr-fx);if(fw>0)blitLayer(ctx,f,(fx-ox)*tr,0,fw*tr,f.height,fx,-PAD,fw,f.height/tr)}}}
function a4BackLive(t,cx){const Lv=L;
  const g=ctx,D=Lv.def.a4,GY=D.G0*T,a0=cx-300,a1=cx+W+300;
  // l'autre sens : voitures et camions qui filent vers la gauche, derrière la glissière
  for(let i=0;i<34;i++){const kind=i%5===2?'pl':i%5===4?'van':'car',sp=kind==='pl'?520:650+(i%3)*60,per=Lv.wpx+1600;
    const x=((i*1013+i*i*37)%per-t*sp)%per;const X=(x<0?x+per:x)-800;if(X<a0-400||X>a1)continue;a4Opp(g,X,GY-40,kind,i)}
  // les lampadaires (sodium), leur cône de lumière ; l'un d'eux grésille
  for(const l of a4Lamps(Lv)){if(l.x<a0-100||l.x>a1)continue;const on=a4LampOn(l,t),x=l.x;
    g.fillStyle='#2a2c30';g.fillRect(x-3,GY-300,6,300);g.fillRect(x-3,GY-300,60,5);
    const gr=g.createLinearGradient(0,GY-292,0,GY);gr.addColorStop(0,'rgba(255,200,120,'+(.3*on)+')');gr.addColorStop(1,'rgba(255,200,120,0)');g.fillStyle=gr;poly(g,[x+40,GY-292,x+60,GY-292,x+150,GY,x-50,GY]);g.fill();
    g.fillStyle=on>.5?'#ffd890':'#6a5a40';g.fillRect(x+40,GY-296,20,5);if(on>.5){g.fillStyle='rgba(255,220,150,.35)';g.beginPath();g.ellipse(x+50,GY-290,22,8,0,0,7);g.fill()}}
  // la glissière centrale, devant l'autre chaussée
  g.fillStyle='#1c1e24';g.fillRect(a0,GY-46,a1-a0,46);g.fillStyle='#5a5e66';g.fillRect(a0,GY-44,a1-a0,9);g.fillStyle='#7a7e86';g.fillRect(a0,GY-44,a1-a0,2);
  for(let x=Math.floor(a0/80)*80;x<a1;x+=80){g.fillStyle='#3a3c42';g.fillRect(x,GY-38,5,38);g.fillStyle='#e8a030';g.fillRect(x+1,GY-42,3,4)}
  // le pneu contre la glissière (derrière les camions) et le hérisson
  {const x=D.tyre,S=Lv.a4;if(x>a0&&x<a1){const a=Lv.acts.find(q=>q.style==='tyre'),u=a&&a.used,tx=x+(u?22:0),ang=u?-.35:-.12;
    g.save();g.translate(tx,GY-31);g.rotate(ang);g.fillStyle='#0e0e10';g.beginPath();g.ellipse(0,0,13,31,0,0,7);g.fill();
    g.strokeStyle='#26272b';g.lineWidth=2;for(let k=-26;k<=26;k+=6){g.beginPath();g.moveTo(-12,k);g.lineTo(-7,k+3);g.stroke()}
    g.fillStyle='#3a3b40';g.beginPath();g.ellipse(3,0,6,15,0,0,7);g.fill();g.fillStyle='#16161a';g.beginPath();g.ellipse(4,0,3,8,0,0,7);g.fill();g.restore()}
   if(S&&S.hog)a4Hog(g,S.hog.x,GY,t)}}
function a4Opp(g,X,B,kind,i){g.save();g.translate(X,B);g.scale(.72,.72);const x=0,base=0,c=['#3e4a56','#5a2e2e','#2e3a48','#5e5e58','#36422e'][i%5];g.globalAlpha=.7;
  if(kind==='pl'){g.fillStyle='#5e605c';rr(g,x+70,base-120,250,100,4);g.fill();g.fillStyle=c;rr(g,x,base-112,66,92,8);g.fill();g.fillStyle='#141a24';g.fillRect(x+6,base-100,30,26)}
  else if(kind==='van'){g.fillStyle=c;rr(g,x,base-74,150,56,7);g.fill();g.fillStyle='#141a24';g.fillRect(x+8,base-66,26,22)}
  else{g.fillStyle=c;rr(g,x,base-40,120,24,8);g.fill();poly(g,[x+20,base-40,x+36,base-62,x+86,base-62,x+104,base-40]);g.fill();g.fillStyle='#141a24';poly(g,[x+26,base-41,x+39,base-58,x+60,base-58,x+60,base-41]);g.fill()}
  // phares vers la gauche, feux arrière à droite
  g.globalAlpha=1;g.fillStyle='#fff6d0';g.fillRect(x-2,base-32,5,6);const gr=g.createLinearGradient(x,0,x-160,0);gr.addColorStop(0,'rgba(255,248,210,.3)');gr.addColorStop(1,'rgba(255,248,210,0)');g.fillStyle=gr;poly(g,[x,base-34,x-160,base-50,x-160,base-14,x,base-24]);g.fill();
  const xr=kind==='pl'?x+320:kind==='van'?x+150:x+120;g.fillStyle='#ff3020';g.fillRect(xr-4,base-34,5,7);g.restore()}
function drawA4Mid(t){const S=L.a4;if(!S)return;const g=ctx,D=L.def.a4,GY=D.G0*T,a0=cam.x-200,a1=cam.x+W+200;
  // le marquage au sol, qui défile sous les camions
  g.fillStyle='rgba(230,230,220,.55)';for(let x=Math.floor(a0/120)*120;x<a1;x+=120)g.fillRect(x,GY+8,60,4);
  // les faisceaux des phares, posés sur la route, avant le camion
  for(const m of S.trucks)if(m.on&&m.x<a1+600&&m.x+m.w>a0-600){const fx=m.x+m.w,gr=g.createLinearGradient(fx,0,fx+520,0);gr.addColorStop(0,'rgba(255,248,210,.55)');gr.addColorStop(1,'rgba(255,248,210,0)');
    g.fillStyle=gr;poly(g,[fx,GY-46,fx+520,GY-120,fx+520,GY+6,fx,GY-14]);g.fill()}
  for(const m of S.trucks)if(m.on&&m.x<a1&&m.x+m.w>a0)a4DrawTruck(g,m,t);
  // feux stop de l'embouteillage
  for(const[x0,x1,k,h]of D.jam)if(x1>a0&&x0<a1){g.fillStyle='rgba(255,40,30,'+(.75+.25*Math.sin(t*3+x0))+')';g.fillRect(x0-3,k==='bus'||k==='truck'?GY-62:k==='van'?GY-52:GY-34,6,10)}
  // la fumée du moteur
  {const x=D.engine+20;if(x>a0&&x<a1)for(let k=0;k<6;k++){const ph=(t*.6+k/6)%1;g.fillStyle='rgba(150,150,150,'+(.4*(1-ph))+')';g.beginPath();g.arc(x+Math.sin(ph*5+k)*10,GY-T-10-ph*120,6+ph*16,0,7);g.fill()}}
  // les conducteurs en colère et les objets lancés
  for(const[dx,f]of[[12030,1],[12575,-1]])if(dx>a0&&dx<a1)a4Driver(g,dx,GY,f,t);
  for(const o of S.objs)a4Obj(g,o);
  // la benne qui se lève et le goudron qui coule
  {const tr=D.tar;if(tr.x1>a0&&tr.x0<a1){const ang=S.bedA*.95,px=tr.x0,py=GY-2*T,L4=tr.x1-tr.x0-4;
      // le vérin, sous la benne levée
      if(ang>.02){const ex=px+L4*.62*Math.cos(ang),ey=py-L4*.62*Math.sin(ang);g.strokeStyle='#5a5a60';g.lineWidth=10;g.beginPath();g.moveTo(px+L4*.55,py);g.lineTo(ex,ey);g.stroke();g.strokeStyle='#c8ccd2';g.lineWidth=5;g.beginPath();g.moveTo(px+L4*.55,py);g.lineTo(px+L4*.55+(ex-px-L4*.55)*.55,py+(ey-py)*.55);g.stroke()}
      // la benne : caisse pleine, nervures, rebord, ridelle arrière, le goudron qui dépasse
      g.save();g.translate(px,py);g.rotate(-ang);
      g.fillStyle='#d8b818';g.fillRect(0,-40,L4,40);g.fillStyle='#b89810';for(let x=24;x<L4-10;x+=46)g.fillRect(x,-40,7,40);
      g.fillStyle='#e8cc30';g.fillRect(0,-40,L4,5);g.fillStyle='#a08010';g.fillRect(0,-6,L4,6);g.fillStyle='#8a7010';g.fillRect(-4,-44,8,44);
      g.fillStyle='#141416';g.beginPath();g.moveTo(6,-40);g.quadraticCurveTo(L4*.3,-48,L4*.5,-44);g.quadraticCurveTo(L4*.75,-50,L4-8,-40);g.closePath();g.fill();
      g.fillStyle='#2a2a2e';g.fillRect(L4-8,-56,10,56);g.restore();
      if(S.bedA>.5){g.fillStyle='#141416';const w=12+Math.sin(t*20)*2;g.fillRect(px-w,py-4,w,GY-py+4);g.beginPath();g.ellipse(px-20,GY-4,60,10,0,0,7);g.fill();g.fillStyle='rgba(200,200,200,.25)';for(let k=0;k<4;k++){const ph=(t*.8+k/4)%1;g.beginPath();g.arc(px-30+k*12,GY-20-ph*60,5+ph*10,0,7);g.fill()}}}}
  // le rouleau compresseur
  {const Rl=S.roll;if(Rl.x>a0-200&&Rl.x<a1)a4Roller(g,Rl.x,GY,t,Rl.dir)}
  // les ouvriers
  for(const wx of D.workers)if(wx>a0&&wx<a1){const P2=P.x+P.w/2,up=Math.abs(P2-wx)<70&&P.y+P.h<GY-40;a4Worker(g,wx,GY,t,up,wx)}
  // les gyrophares
  for(const b of S.beacons)if(b.x>a0&&b.x<a1){const y=GY-3*T;g.fillStyle='#2a2a2e';g.fillRect(b.x-12,y-8,24,8);g.fillStyle=b.on?'#ff8a10':'#6a4a2a';g.beginPath();g.arc(b.x,y-14,10,Math.PI,0);g.fill();g.fillRect(b.x-10,y-14,20,6);
    if(b.on){const an=t*7;g.fillStyle='rgba(255,150,30,.35)';poly(g,[b.x,y-14,b.x+Math.cos(an)*260,y-14+Math.sin(an)*60-30,b.x+Math.cos(an+.3)*260,y-14+Math.sin(an+.3)*60-30]);g.fill()}}
}
function a4DrawTruck(g,m,t){a4TruckBody(g,m.x,m.y,m.w,m.vh,m.col,'TRANSPORTS FONTAINE & FILS',m.wa)}
function a4Driver(g,x,GY,f,t){const k='a4d'+x;const p=L[k]||(L[k]=fkMake(x,{fem:false,old:false,coat:f>0?'#5a3a6a':'#3a5a3a',hat:null}));p.brow=-1.4;fkDraw(g,p,x,GY,t,'up',{f})}
function a4Obj(g,o){g.save();g.translate(o.x,o.y);g.rotate(o.rot);
  if(o.k==='shoe'){g.fillStyle='#3a2a1a';rr(g,-10,-4,20,8,3);g.fill();g.fillRect(-10,-9,8,6)}
  else if(o.k==='bottle'){g.fillStyle='rgba(120,200,160,.85)';rr(g,-4,-11,8,18,3);g.fill();g.fillRect(-2,-15,4,5)}
  else if(o.k==='atlas'){g.fillStyle='#d8a020';g.fillRect(-10,-7,20,14);g.fillStyle='#1e5aa8';g.fillRect(-10,-7,20,4)}
  else if(o.k==='apple'){g.fillStyle='#c82a2a';g.beginPath();g.arc(0,0,7,0,7);g.fill();g.fillStyle='#3a6a2a';g.fillRect(0,-10,2,4)}
  else{g.fillStyle='#1a1a1e';rr(g,-6,-10,12,20,2);g.fill();g.fillStyle='#4a7ab8';g.fillRect(-4,-8,8,14)}
  g.restore()}
function a4Roller(g,x,GY,t,dir){g.save();g.translate(x,GY);
  g.fillStyle='#e8c020';rr(g,20,-100,110,62,6);g.fill();g.fillStyle='#2a3440';g.fillRect(60,-92,40,30);g.fillStyle='#3a3a3e';g.fillRect(20,-104,110,6);
  // les pics anti-pigeons sur le toit
  g.strokeStyle='#c8ced6';g.lineWidth=1.4;for(let k=24;k<128;k+=4){g.beginPath();g.moveTo(k,-104);g.lineTo(k+Math.sin(k)*2,-118);g.stroke()}
  // les deux cylindres
  for(const[cx,r]of[[24,38],[124,30]]){g.fillStyle='#5a5c62';g.beginPath();g.arc(cx,-r,r,0,7);g.fill();g.save();g.translate(cx,-r);g.rotate(x*.05);g.strokeStyle='#3a3c42';g.lineWidth=2;for(let k=0;k<3;k++){g.rotate(Math.PI/3);g.beginPath();g.moveTo(-r+4,0);g.lineTo(r-4,0);g.stroke()}g.restore()}
  g.fillStyle='#ff8a10';g.beginPath();g.arc(80,-108,5,Math.PI,0);g.fill();g.restore()}
function a4Worker(g,x,GY,t,up,seed){const k='a4w'+x;const p=L[k]||(L[k]=fkMake(seed,{old:false,vest:true,hat:'casque',coat:'#2a3a6a',leg:'#2a3a6a',tie:null,scarf:null}));const f=(seed/45|0)%2?1:-1;
  fkDraw(g,p,x,GY,t,up?'up':'talk',{f,talk:!up&&Math.sin(t*.8+seed)>0})}
function a4Hog(g,x,GY,t){g.save();g.translate(x,GY);g.scale(-1,1);const b=Math.abs(Math.sin(t*20))*2;
  g.fillStyle='#5a4a3a';g.beginPath();g.ellipse(0,-10-b,14,9,0,Math.PI,0);g.fill();g.strokeStyle='#3a2a1a';g.lineWidth=1.2;for(let k=-12;k<12;k+=3){g.beginPath();g.moveTo(k,-10-b);g.lineTo(k-3,-19-b);g.stroke()}
  g.fillStyle='#c8a888';g.beginPath();g.ellipse(13,-7-b,6,4,0,0,7);g.fill();g.fillStyle='#111';g.beginPath();g.arc(18,-7-b,1.5,0,7);g.fill();g.restore()}
