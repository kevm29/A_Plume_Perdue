/* =========================================================
   4-2 · L'AIRE DE GUEUX — de nuit : la station-service (un monsieur fait son plein ; une voiture garée, un chien
   endormi de chaque côté ; deux lampadaires de la station, leurs moustiques, et le toit de l'auvent), la boutique
   (porte automatique, étals, publicités, clients qui crient « Pigeon ! », la caissière qui tape), le couloir des
   machines à café (et le couloir de service), le self (bar à salades sous sa hotte hérissée, vitrines réfrigérées),
   la salle de restaurant, les toilettes (cabines, vasques, la fenêtre), puis le parking des camions.
   Secrets : la deuxième machine à café, la salade, la porte de la vitrine restée ouverte, la poignée du cabinet occupé.
   Chiens : un saut (une vraie pression sur « saut ») près d'eux les réveille ; ils ne grimpent nulle part : devant
   un obstacle, ils s'assoient et aboient tant qu'ils voient Raymond, puis retournent se coucher.
   ========================================================= */
THEMES.aireNuit={outdoor:true,far:'sky',horizon:'road',sky:['#04060d','#0c1222','#1a2236'],celestial:'moon',stars:true,fog:'#10141f',dark:.55,weather:'night',
  floor:'#2a2a2e',floorTop:'#4e4e56',type:'stone',x:'none',d:'drape',shelf:'girder',spike:'spikes',spikeCol:'#3a3e46',spikeBase:'#2a2c32',walker:'rat',flyer:'crow',awning:'#2f5a7a',props:[],noFore:true};
const AIN={IN0:2800,IN1:12480,
  // les pièces : boutique, couloir, self, salle, toilettes — chacune sa couleur
  ROOMS:[[2800,4780,'#ece4d0','#c6b89a','#2a6ab8'],[4780,5580,'#d6e4dc','#9ab4a6','#2a6a5a'],[5580,8040,'#f2e2bc','#cfa864','#c8501c'],[8040,11020,'#ecd8cc','#9a6a5a','#6a3a2a'],[11020,12480,'#dce8f0','#b0c4d4','#2a5a8a']],
  LAMPS:[[2120,8],[1880,5]],   // les deux lampadaires de la station : [x du mât, rangée du dessus de la lanterne]
  CAN:[680,1680],FANY:4*T+66,WC0:11600,WCW:100,WCN:8,WCBUSY:3};

/* ---------- petits dessins réutilisés ---------- */
/* une voiture de profil, aux vraies proportions : caisse, capot et coffre plongeants, pavillon, vitres, passages de roues */
function airCar(g,x0,x1,col,GY,o){o=o||{};const L4=x1-x0,dk=shade(col,-.32),lt=shade(col,.22),belt=GY-44,roof=GY-80,c0=x0+80,c1=x1-80;
  g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse((x0+x1)/2,GY+1,L4/2+6,5,0,0,7);g.fill();
  // la caisse
  g.fillStyle=col;g.beginPath();g.moveTo(x0+6,GY-14);g.lineTo(x0+2,belt+10);g.quadraticCurveTo(x0+2,belt-2,x0+18,belt-4);g.lineTo(c0-36,belt-6);
  g.lineTo(c0-6,roof+4);g.quadraticCurveTo(c0,roof,c0+12,roof);g.lineTo(c1-4,roof);g.quadraticCurveTo(c1+6,roof,c1+12,roof+6);g.lineTo(c1+40,belt-6);
  g.lineTo(x1-14,belt-2);g.quadraticCurveTo(x1-1,belt,x1-1,belt+12);g.lineTo(x1-4,GY-14);g.closePath();g.fill();
  // les vitres et les montants
  g.fillStyle='#16202c';poly(g,[c0-26,belt-8,c0-2,roof+7,(c0+c1)/2-3,roof+7,(c0+c1)/2-3,belt-8]);g.fill();poly(g,[(c0+c1)/2+4,belt-8,(c0+c1)/2+4,roof+7,c1+4,roof+7,c1+30,belt-8]);g.fill();
  g.fillStyle='rgba(150,180,220,.18)';poly(g,[c0-16,belt-9,c0-4,roof+9,c0+10,roof+9,c0-2,belt-9]);g.fill();
  g.fillStyle=dk;g.fillRect((c0+c1)/2-3,roof+6,7,belt-roof-12);
  // reflets, ligne de caisse, portes, poignées, rétroviseur
  g.fillStyle=lt;g.fillRect(x0+14,belt-3,L4-28,2);g.fillStyle=dk;g.fillRect(x0+4,GY-30,L4-8,3);
  g.strokeStyle=dk;g.lineWidth=1.2;g.beginPath();g.moveTo(c0-30,belt-6);g.lineTo(c0-30,GY-16);g.moveTo((c0+c1)/2,belt-6);g.lineTo((c0+c1)/2,GY-16);g.moveTo(c1+34,belt-6);g.lineTo(c1+30,GY-18);g.stroke();
  g.fillStyle=dk;g.fillRect(c0-18,belt+4,10,3);g.fillRect((c0+c1)/2+10,belt+4,10,3);g.fillRect(c1+26,belt-12,8,6);
  // phares, feux, pare-chocs, plaque
  g.fillStyle=o.lights?'#fff4c8':'#d8d4c0';g.fillRect(x1-8,belt+4,7,8);g.fillStyle='#c82a1a';g.fillRect(x0+1,belt+4,6,9);
  g.fillStyle='#2a2a2e';g.fillRect(x0-1,GY-26,12,8);g.fillRect(x1-11,GY-26,12,8);g.fillStyle='#e8e8e0';g.fillRect(x0-2,GY-36,3,9);
  // les roues dans leurs passages
  for(const wx of[x0+44,x1-46]){g.fillStyle='#0c0c0e';g.beginPath();g.arc(wx,GY-17,22,Math.PI,0);g.fill();g.fillStyle='#141416';g.beginPath();g.arc(wx,GY-17,17,0,7);g.fill();
    g.fillStyle='#8a8e96';g.beginPath();g.arc(wx,GY-17,8,0,7);g.fill();g.fillStyle='#5a5e66';for(let k=0;k<5;k++){const a=k*1.256;g.beginPath();g.arc(wx+Math.cos(a)*5,GY-17+Math.sin(a)*5,1.5,0,7);g.fill()}}}
/* une pompe : corps crème, bandeau, écran, deux pistolets dans leur étui, flexibles */
function airPump(g,x,GY,band){g.fillStyle='#d8d2c4';rr(g,x,GY-104,64,96,6);g.fill();g.fillStyle=band;g.fillRect(x,GY-104,64,16);g.fillStyle='rgba(0,0,0,.12)';g.fillRect(x+52,GY-88,12,80);
  g.fillStyle='#14181c';g.fillRect(x+8,GY-82,48,22);g.fillStyle='#7ae07a';g.font='bold 9px '+F_DISP;g.textAlign='right';g.fillText('42,80',x+52,GY-73);g.fillText('1,879',x+52,GY-64);
  g.fillStyle='#2a2c30';for(const[k,c]of[[0,'#e0c020'],[1,'#2a8a3a']]){g.fillRect(x+10+k*26,GY-54,16,22);g.fillStyle=c;g.fillRect(x+12+k*26,GY-52,12,6);g.fillStyle='#2a2c30'}
  g.fillStyle='#f0ece4';g.font='bold 6px '+F_DISP;g.textAlign='center';g.fillText(/*v2*/'GAZOLE',x+18,GY-24);g.fillText(/*v2*/'SP 95',x+44,GY-24);
  g.strokeStyle='#1a1a1a';g.lineWidth=3;g.beginPath();g.moveTo(x+60,GY-50);g.quadraticCurveTo(x+76,GY-20,x+64,GY-12);g.stroke();
  g.fillStyle='#8a8478';g.fillRect(x-8,GY-8,80,8)}
/* un camion garé de biais, au fond du parking (on voit le flanc et l'arrière de la remorque) */
function airAngledTruck(g,x,y,col,s){g.save();g.translate(x,y);g.scale(s,s);
  g.fillStyle='#14161c';poly(g,[0,0,170,-34,170,-112,0,-78]);g.fill();g.fillStyle='#b8b8b0';poly(g,[0,-6,166,-38,166,-110,0,-78]);g.fill();
  g.fillStyle='rgba(0,0,0,.18)';for(let k=1;k<6;k++){const u=k/6;g.fillRect(u*166,-8-u*32-70+u*0,2,70)}
  g.fillStyle='#d8d8d0';g.fillRect(-46,-78,46,72);g.fillStyle='#9a9a92';g.fillRect(-24,-76,2,68);g.fillStyle='#c82a1a';g.fillRect(-44,-16,8,6);g.fillRect(-10,-16,8,6);
  g.fillStyle=col;poly(g,[170,-34,206,-41,206,-104,176,-104,170,-112]);g.fill();g.fillStyle='#14181e';poly(g,[184,-96,204,-100,204,-76,184,-72]);g.fill();
  for(const wx of[-30,-12,150,196]){g.fillStyle='#0c0c0e';g.beginPath();g.ellipse(wx,wx<0?-2:-2-(wx/166)*32,9,12,0,0,7);g.fill()}g.restore()}
/* un lampadaire de parking : mât, crosse, lanterne (la lumière et son cône sont dessinés en direct) */
function airPolePark(g,x,GY){g.fillStyle='#2a2c30';g.fillRect(x-3,GY-232,6,232);g.fillRect(x-3,GY-232,58,5);g.fillStyle='#3a3c42';rr(g,x+34,GY-236,30,9,3);g.fill();g.fillStyle='#1e2024';g.fillRect(x-6,GY-14,12,14)}
const AIR_PARK_LAMPS=[160,12980,13900,14720,15560,16420];

/* ---------- le décor (couche en cache) ---------- */
function aireBuild(Lv){
  const D=Lv.def.aire,wpx=Lv.wpx+40,hpx=ROWS*T+PAD,TR=Math.min(RS,1),{layer:c,g}=mkLayer(wpx*TR,hpx*TR);g.scale(TR,TR);c.rs=TR;g.translate(0,PAD);
  const R=mulberry(Lv.def.seed+3),GY=D.G0*T,CEIL=4*T;
  // dehors : talus, arbres, glissière lointaine, parking du fond
  const outside=(a,b)=>{g.fillStyle='#0c1018';g.fillRect(a,GY-130,b-a,130);for(let x=a;x<b;x+=22){g.fillStyle='#080b12';g.beginPath();g.ellipse(x,GY-130,14+R()*10,26+R()*40,0,Math.PI,0);g.fill()}
    g.fillStyle='#1a1c22';g.fillRect(a,GY-40,b-a,40);g.fillStyle='#3a3e46';g.fillRect(a,GY-38,b-a,5)};
  outside(0,AIN.IN0);outside(AIN.IN1,wpx);
  // le parking des poids lourds, au fond : marquages en épi, camions garés en bataille
  {g.fillStyle='#16181e';g.fillRect(AIN.IN1+100,GY-60,wpx-AIN.IN1-100,24);g.strokeStyle='rgba(220,220,200,.25)';g.lineWidth=2;for(let x=AIN.IN1+120;x<wpx;x+=90){g.beginPath();g.moveTo(x,GY-36);g.lineTo(x+40,GY-60);g.stroke()}
   const cols=['#c8302a','#2a5a9a','#e0e0d8','#3a7a4a','#d8a020','#5a5a62'];let i=0;for(let x=AIN.IN1+260;x<wpx-200;x+=340+((i*97)%120)){if(i%4!==3)airAngledTruck(g,x,GY-40,mix(cols[i%6],'#0a0c14',.45),.62);i++}}
  for(const x of AIR_PARK_LAMPS)airPolePark(g,x,GY);
  // la station : le totem des prix
  {const x=560;g.fillStyle='#2a2e36';g.fillRect(x-4,GY-300,8,300);rr(g,x-34,GY-330,68,150,6);g.fill();g.fillStyle='#e0c040';g.fillRect(x-34,GY-330,68,22);
   g.fillStyle='#1a1a1a';g.font='bold 10px '+F_DISP;g.textAlign='center';g.fillText(/*v2*/'CARBURANTS',x,GY-315);
   for(const[k,lb,pr]of[[0,/*v2*/'GAZOLE','1,879'],[1,/*v2*/'SP 95','1,949'],[2,/*v2*/'SP 98','2,019']]){const y=GY-296+k*36;g.fillStyle='#f0ece4';g.font='bold 9px '+F_DISP;g.textAlign='left';g.fillText(lb,x-28,y+8);g.fillStyle='#ff9a30';g.font='bold 15px '+F_DISP;g.textAlign='right';g.fillText(pr,x+30,y+26)}}
  // l'auvent : dalle, bandeau blanc et jaune, sous-face éclairée, piliers habillés ; on peut marcher dessus
  {const[a,b]=AIN.CAN;g.fillStyle='#6a6e74';g.fillRect(a-6,78,b-a+12,10);g.fillStyle='#e8e8e2';g.fillRect(a,88,b-a,62);g.fillStyle='#e0b828';g.fillRect(a,108,b-a,22);g.fillStyle='#c89818';g.fillRect(a,128,b-a,3);
   g.fillStyle='#1a1a1a';g.font='bold 15px '+F_DISP;g.textAlign='center';for(const x of[a+220,b-220])g.fillText(/*v2*/'STATION — 24 h / 24',x,124);
   g.fillStyle='#9ea2a8';g.fillRect(a,150,b-a,20);g.fillStyle='rgba(255,252,235,.95)';for(let x=a+60;x<b-60;x+=150)g.fillRect(x,166,70,5);
   for(const x of[720,1130,1640]){g.fillStyle='#c8ccd0';g.fillRect(x-17,170,34,GY-170);g.fillStyle='rgba(0,0,0,.16)';g.fillRect(x+6,170,11,GY-170);g.fillStyle='#e0b828';g.fillRect(x-17,GY-60,34,8);g.fillStyle='#2a2c30';g.fillRect(x-17,GY-12,34,12)}
   g.fillStyle='#c83a2a';rr(g,1122,GY-150,16,30,4);g.fill();g.fillStyle='#2a2a2a';g.fillRect(1126,GY-156,8,6)}
  // les îlots et les pompes
  for(const[p0,band]of[[860,'#2a8a3a'],[1180,'#d8a020']]){g.fillStyle='#b8b4a8';g.fillRect(p0-40,GY-10,150,10);g.fillStyle='#e0b828';g.fillRect(p0-40,GY-12,150,3);airPump(g,p0,GY,band);
    g.fillStyle='#3a3c42';rr(g,p0-34,GY-46,10,36,3);g.fill();rr(g,p0+92,GY-46,10,36,3);g.fill();g.fillStyle='#e0b828';g.fillRect(p0-34,GY-40,10,4);g.fillRect(p0+92,GY-40,10,4)}
  // les voitures : celle qui fait le plein, celle qui est garée
  airCar(g,1280,1520,'#3a5a8a',GY,{lights:1});airCar(g,2240,2480,'#a82a22',GY);
  // les mâts des deux lampadaires de la station (la lanterne est dessinée en direct)
  for(const[x,r]of AIN.LAMPS){const top=r*T;g.fillStyle='#3a3e46';g.fillRect(x-4,top+16,8,GY-top-16);g.fillStyle='#2a2e36';g.fillRect(x-9,GY-26,18,26);g.fillStyle='#e0b828';g.fillRect(x-4,GY-120,8,4)}
  // le bâtiment : toiture, enseigne
  g.fillStyle='#2a2e36';g.fillRect(AIN.IN0-60,CEIL-70,AIN.IN1-AIN.IN0+100,70);g.fillStyle='#e0c040';g.fillRect(AIN.IN0-60,CEIL-6,AIN.IN1-AIN.IN0+100,8);
  g.fillStyle='#fff';g.font='bold 22px '+F_DISP;g.textAlign='left';g.fillText('AIRE DE GUEUX — BOUTIQUE · CAFÉ · RESTAURANT',AIN.IN0+40,CEIL-26);
  // les pièces : murs (une couleur par pièce), soubassement, plinthe, plafond et ses dalles lumineuses
  for(const[a,b,wall,dado,acc]of AIN.ROOMS){g.fillStyle=wall;g.fillRect(a,CEIL,b-a,GY-CEIL);g.fillStyle=dado;g.fillRect(a,GY-90,b-a,90);g.fillStyle=shade(dado,-.18);g.fillRect(a,GY-92,b-a,4);g.fillStyle=acc;g.fillRect(a,GY-12,b-a,12);
    g.fillStyle='rgba(0,0,0,.04)';for(let x=a;x<b;x+=60)g.fillRect(x,CEIL+40,1,GY-CEIL-132);
    g.fillStyle='#8a8478';g.fillRect(a,CEIL,b-a,40);g.fillStyle='rgba(0,0,0,.15)';g.fillRect(a,CEIL+36,b-a,4);g.fillStyle='rgba(255,250,230,.92)';for(let x=a+60;x<b-100;x+=240)g.fillRect(x,CEIL+40,120,6)}
  // les cloisons (jusqu'au plafond, ouvertes en bas) et la façade
  for(const x of[4760,5560,11000]){g.fillStyle='#b8b0a0';g.fillRect(x,CEIL,40,GY-CEIL-160);g.fillStyle='rgba(0,0,0,.12)';g.fillRect(x+30,CEIL,10,GY-CEIL-160);g.fillStyle='#5a4a3a';g.fillRect(x-4,GY-164,48,8)}
  // l'entrée : mur de façade, marquise, capteur ; la porte vitrée est dessinée en direct
  {g.fillStyle='#c8c0b0';g.fillRect(2740,CEIL-6,60,GY-CEIL-154);g.fillStyle='#a8a090';g.fillRect(2740,CEIL-6,8,GY-CEIL-154);g.fillStyle='#2a2e36';g.fillRect(2650,GY-170,150,10);g.fillStyle='#e0c040';g.fillRect(2650,GY-162,150,3);
   g.fillStyle='#3a3e46';g.fillRect(2792,GY-160,12,160);g.fillRect(2836,GY-160,10,160);g.fillStyle='#e8e4d8';g.font='bold 8px '+F_DISP;g.textAlign='center';g.fillText(/*v2*/'ENTRÉE',2722,GY-174);
   const[sx,sy]=D.sensor;g.fillStyle='#2a2c30';rr(g,sx-16,sy-8,32,14,4);g.fill()}
  // ---- la boutique ----
  // les publicités au mur
  const poster=(x,y,w,h,bg,draw)=>{g.fillStyle='rgba(0,0,0,.18)';g.fillRect(x+4,y+4,w,h);g.fillStyle='#2a2a2e';g.fillRect(x-3,y-3,w+6,h+6);g.fillStyle=bg;g.fillRect(x,y,w,h);draw(x,y,w,h)};
  const txt=(s,x,y,sz,col,al)=>{g.fillStyle=col;g.font='bold '+sz+'px '+F_DISP;g.textAlign=al||'center';g.fillText(s,x,y)};
  poster(2900,236,120,150,'#c8302a',(x,y,w,h)=>{g.fillStyle='#f4ead0';g.beginPath();g.ellipse(x+60,y+70,36,22,0,0,7);g.fill();g.fillStyle='#5a3418';g.beginPath();g.ellipse(x+60,y+64,30,10,0,0,7);g.fill();g.fillStyle='#f4ead0';g.fillRect(x+92,y+50,10,26);
    txt(/*v2*/'CAFÉ',x+60,y+26,18,'#fff');txt(/*v2*/'+ CROISSANT',x+60,y+112,11,'#fff');txt(/*v2*/'2,90 €',x+60,y+136,20,'#ffd040')});
  poster(3330,250,110,120,'#f0d8e0',(x,y,w,h)=>{for(let k=0;k<4;k++){g.fillStyle='#e890a8';rr(g,x+16+k*20,y+40-k*3,14,44,5);g.fill();g.fillStyle='rgba(255,255,255,.5)';g.fillRect(x+18+k*20,y+44-k*3,3,36)}
    txt(/*v2*/'BISCUITS ROSES',x+55,y+20,10,'#8a2a4a');txt(/*v2*/'de Reims',x+55,y+104,12,'#8a2a4a')});
  poster(4250,236,140,130,'#1e2a3a',(x,y,w,h)=>{g.fillStyle='#e8d890';g.beginPath();g.moveTo(x+70,y+20);g.lineTo(x+82,y+48);g.lineTo(x+78,y+96);g.lineTo(x+62,y+96);g.lineTo(x+58,y+48);g.closePath();g.fill();g.fillStyle='#c8a848';g.fillRect(x+66,y+12,8,10);
    for(let k=0;k<8;k++){g.fillStyle='rgba(255,240,180,.8)';g.beginPath();g.arc(x+52+(k*13)%40,y+40+k*6,1.5,0,7);g.fill()}txt(/*v2*/'CHAMPAGNE',x+70,y+114,13,'#e8d890');txt(/*v2*/'à prix routier',x+70,y+126,9,'#a8b0c0')});
  poster(4520,330,110,70,'#2a6ab8',(x,y,w,h)=>{txt(/*v2*/'CARTES',x+55,y+24,12,'#fff');txt(/*v2*/'ROUTIÈRES',x+55,y+40,12,'#fff');txt(/*v2*/'2026',x+55,y+60,14,'#ffd040')});
  // les gondoles : étagères, produits variés (bouteilles, boîtes, sachets), étiquettes de prix, fronton
  const prod=(x,y,k)=>{const cols=['#c83a2a','#e0b020','#2a6ab8','#3a8a4a','#e8e8e0','#8a3a8a','#e86a2a','#3ab0c8'],c1=cols[Math.floor(R()*8)];
    if(k==='bottle'){g.fillStyle=c1;rr(g,x,y-24,10,24,3);g.fill();g.fillRect(x+3,y-30,4,7);g.fillStyle='#f0ece4';g.fillRect(x+1,y-16,8,7);g.fillStyle='#2a2a2e';g.fillRect(x+3,y-32,4,3)}
    else if(k==='box'){g.fillStyle=c1;g.fillRect(x,y-22,14,22);g.fillStyle='rgba(255,255,255,.45)';g.fillRect(x+2,y-18,10,5);g.fillStyle='rgba(0,0,0,.15)';g.fillRect(x+11,y-22,3,22)}
    else if(k==='bag'){g.fillStyle=c1;g.beginPath();g.moveTo(x,y);g.lineTo(x+1,y-20);g.quadraticCurveTo(x+8,y-24,x+15,y-20);g.lineTo(x+16,y);g.closePath();g.fill();g.fillStyle='rgba(255,255,255,.5)';g.beginPath();g.arc(x+8,y-10,4,0,7);g.fill()}
    else{g.fillStyle='#f0ece4';rr(g,x,y-16,12,16,2);g.fill();g.fillStyle=c1;g.fillRect(x,y-12,12,5)}};
  const stall=(a,b,h,label,kinds)=>{const top=GY-h*T;g.fillStyle='#6a6e76';g.fillRect(a,top,b-a,h*T);g.fillStyle='#e8e4d8';g.fillRect(a+4,top+4,b-a-8,h*T-8);
    for(let y=top+40;y<=GY-6;y+=38){g.fillStyle='#b8b4a8';g.fillRect(a+4,y-2,b-a-8,4);g.fillStyle='#f0e050';for(let x=a+20;x<b-20;x+=64)g.fillRect(x,y+2,18,6);
      for(let x=a+10;x<b-18;){const k=kinds[Math.floor(R()*kinds.length)];prod(x,y-2,k);x+=k==='bottle'?14:k==='bag'?20:17}}
    g.fillStyle='#2a6ab8';g.fillRect(a,top-26,b-a,22);g.fillStyle='#fff';g.font='bold 12px '+F_DISP;g.textAlign='center';g.fillText(label,(a+b)/2,top-10)};
  stall(3000,3300,3,'BISCUITS',['box','bag','box']);stall(3420,3720,3,'BOISSONS',['bottle','bottle','box']);stall(3880,4180,3,'SOUVENIRS',['jar','box','bag']);
  // le congélateur à glaces (couvercle vitré coulissant)
  {g.fillStyle='#e8ecf0';rr(g,3300,GY-80,120,80,4);g.fill();g.fillStyle='#2a6ab8';g.fillRect(3300,GY-40,120,14);g.fillStyle='#fff';g.font='bold 9px '+F_DISP;g.textAlign='center';g.fillText('GLACES',3360,GY-30);
   g.fillStyle='#a8c8e0';g.fillRect(3304,GY-80,112,16);for(let x=3308;x<3410;x+=11){g.fillStyle=['#e86a8a','#f0d060','#8ac8f0','#f0f0e8','#8a5a3a'][(x/11|0)%5];rr(g,x,GY-77,9,12,2);g.fill()}
   g.fillStyle='rgba(255,255,255,.5)';g.fillRect(3304,GY-80,112,3);g.fillStyle='rgba(0,0,0,.15)';g.fillRect(3300,GY-6,120,6)}
  // le présentoir à journaux
  {g.fillStyle='#5a4030';g.fillRect(3800,GY-200,80,200);g.fillStyle='#4a3424';g.fillRect(3800,GY-200,6,200);for(let y=GY-192;y<GY-10;y+=30){g.fillStyle=['#e8e4d8','#d83a2a','#2a5a9a','#f0d060'][((y/30)|0)%4];g.fillRect(3808,y,64,24);g.fillStyle='rgba(20,20,20,.6)';g.fillRect(3812,y+4,44,4);g.fillRect(3812,y+11,56,2);g.fillRect(3812,y+15,50,2);g.fillStyle='rgba(255,255,255,.55)';g.fillRect(3852,y+14,16,8)}}
  // les caisses : comptoir boisé, caisse enregistreuse, terminal, présentoir à confiseries
  const till=(a,b,regA,dispA)=>{g.fillStyle='#a87a48';g.fillRect(a,GY-80,b-a,80);g.fillStyle='#8a5e34';for(let x=a+20;x<b;x+=40)g.fillRect(x,GY-74,2,64);g.fillStyle='#e8dcc0';g.fillRect(a-4,GY-84,b-a+8,8);
    g.fillStyle='#2a2c30';rr(g,regA,GY-120,60,36,4);g.fill();g.fillStyle='#4ab060';g.fillRect(regA+8,GY-114,30,10);g.fillStyle='#4a4c52';for(let k=0;k<6;k++)g.fillRect(regA+8+(k%3)*12,GY-100+(k/3|0)*7,9,5);
    g.fillStyle='#d83020';rr(g,dispA,GY-160,60,80,4);g.fill();for(let y=GY-150;y<GY-90;y+=18)for(let x=dispA+6;x<dispA+54;x+=12){g.fillStyle=['#f0d060','#e86a8a','#8ac8f0','#f0f0e8'][((x+y)/6|0)%4];g.fillRect(x,y,9,12)}
    g.fillStyle='#fff';g.font='bold 9px '+F_DISP;g.textAlign='center';g.fillText('CONFISERIE',dispA+30,GY-82+0);g.fillStyle='#2a2a2e';g.font='bold 12px '+F_DISP;g.fillText('CAISSE',(a+b)/2,GY-46)};
  till(4320,4640,4340,4580);till(7600,7920,7620,7860);
  // ---- le couloir : le couloir de service au fond (deux portes), les machines à café ----
  {const a=5000,b=5280,top=GY-250;g.fillStyle='#8aa498';g.fillRect(a,top,b-a,GY-top);
   g.fillStyle='#a8bcb0';poly(g,[a,top,a+60,top+50,a+60,GY-40,a,GY]);g.fill();poly(g,[b,top,b-60,top+50,b-60,GY-40,b,GY]);g.fill();
   g.fillStyle='#c8d4cc';g.fillRect(a+60,top+50,b-a-120,GY-top-90);g.fillStyle='#7a8a80';poly(g,[a,GY,a+60,GY-40,b-60,GY-40,b,GY]);g.fill();g.fillStyle='#e8f0e0';g.fillRect(a+90,top+52,100,4);
   for(const dx of[a+74,a+150]){g.fillStyle='#5a6a64';g.fillRect(dx,top+90,62,GY-40-top-90);g.fillStyle='#4a5852';g.fillRect(dx+4,top+94,54,GY-40-top-98);g.fillStyle='#c8c8c0';g.fillRect(dx+48,GY-110,8,3);
     g.fillStyle='#e8e4d8';g.fillRect(dx+12,top+110,38,14);g.fillStyle='#2a2a2e';g.font='bold 8px '+F_DISP;g.textAlign='center';g.fillText(/*v2*/'SERVICE',dx+31,top+120)}
   g.fillStyle='#2a8a3a';g.fillRect(a+118,top+58,46,14);g.fillStyle='#fff';g.font='bold 8px '+F_DISP;g.fillText(/*v2*/'SORTIE',a+141,top+68)}
  for(const x of[4900,5300]){g.fillStyle='#2a1e18';rr(g,x,GY-168,80,168,6);g.fill();g.fillStyle='#3a2a20';g.fillRect(x+70,GY-160,10,152);
    g.fillStyle='#c8a050';g.font='bold 10px '+F_DISP;g.textAlign='center';g.fillText('CAFÉ',x+40,GY-150);
    g.fillStyle='#0e0a08';g.fillRect(x+8,GY-142,64,58);for(let k=0;k<6;k++){const cx=x+12+(k%3)*20,cy=GY-138+(k/3|0)*28;g.fillStyle='#e8dcc8';rr(g,cx,cy,16,22,3);g.fill();g.fillStyle=['#5a3418','#8a5a30','#e8e0d0','#3a2010','#c88a50','#6a4020'][k];g.beginPath();g.ellipse(cx+8,cy+12,5,6,0,0,7);g.fill()}
    g.fillStyle='#1a2a30';g.fillRect(x+10,GY-78,38,12);g.fillStyle='#6ad0f0';g.font='bold 7px '+F_DISP;g.fillText('0,90 €',x+29,GY-69);g.fillStyle='#8a8a90';g.fillRect(x+56,GY-78,10,14);g.fillStyle='#1a1a1a';g.fillRect(x+60,GY-76,2,10);
    g.fillStyle='#0a0806';g.fillRect(x+20,GY-58,40,40);g.fillStyle='#3a3a3e';g.fillRect(x+20,GY-22,40,4);g.fillStyle='#e8e4d8';g.fillRect(x+33,GY-34,14,12)}
  // ---- le self : le bar à salades (vitre anti-postillons, bacs, rampe à plateaux, hotte éclairée) ----
  {const[a,b]=D.hood;g.fillStyle='#b8bcc0';g.fillRect(a,GY-120,b-a,120);g.fillStyle='#9ea2a8';for(let x=a+50;x<b;x+=50)g.fillRect(x,GY-110,2,96);g.fillStyle='#d8dce0';g.fillRect(a-10,GY-72,b-a+20,8);g.fillStyle='#8a8e94';g.fillRect(a-10,GY-64,b-a+20,4);
   g.fillStyle='#e8ecf0';g.fillRect(a-4,GY-124,b-a+8,6);
   for(let x=a+12;x<b-50;x+=56){g.fillStyle='#f4f4f0';rr(g,x,GY-140,48,18,4);g.fill();const c=['#5aa040','#c83a2a','#e0b020','#8ac860','#f0e8d0','#d86a2a','#4a8a3a'][(x/56|0)%7];g.fillStyle=c;g.beginPath();g.ellipse(x+24,GY-140,21,7,0,Math.PI,0);g.fill();
     g.fillStyle=shade(c,.25);for(let k=0;k<5;k++){g.beginPath();g.arc(x+8+k*8,GY-142-(k%2)*2,2.5,0,7);g.fill()}g.strokeStyle='#9a9ea4';g.lineWidth=2;g.beginPath();g.moveTo(x+38,GY-150);g.lineTo(x+44,GY-128);g.stroke()}
   g.fillStyle='rgba(190,215,235,.32)';poly(g,[a,8*T,b,8*T,b,GY-150,a,GY-150]);g.fill();g.fillStyle='rgba(255,255,255,.4)';g.fillRect(a,GY-152,b-a,3);for(let x=a+40;x<b;x+=130){g.fillStyle='rgba(255,255,255,.18)';poly(g,[x,8*T+6,x+18,8*T+6,x-10,GY-154,x-28,GY-154]);g.fill()}
   g.fillStyle='#c8ccd0';g.fillRect(a-6,7*T,b-a+12,T);g.fillStyle='#e8ecf0';g.fillRect(a-6,7*T,b-a+12,4);g.fillStyle='rgba(255,250,220,.95)';g.fillRect(a+20,8*T-4,b-a-40,4);
   g.fillStyle='#2a6a3a';g.font='bold 13px '+F_DISP;g.textAlign='center';g.fillText('SALADES EN LIBRE-SERVICE',(a+b)/2,7*T+26)}
  // ---- les vitrines réfrigérées : bandeau, portes vitrées et leurs poignées, étagères éclairées, produits étiquetés ----
  {const a=6300,b=7400;g.fillStyle='#2a2e36';g.fillRect(a,5*T,b-a,3*T);g.fillStyle='#e0c040';g.fillRect(a,5*T+14,b-a,62);g.fillStyle='#2a2a2e';g.font='bold 18px '+F_DISP;g.textAlign='center';g.fillText('FRAIS — SANDWICHS — DESSERTS',(a+b)/2,5*T+52);
   g.fillStyle='#1e2228';g.fillRect(a,8*T,b-a,GY-T-8*T);
   for(let y=8*T+44;y<GY-T-6;y+=48){g.fillStyle='rgba(220,240,255,.85)';g.fillRect(a+4,y-44,b-a-8,2);g.fillStyle='#c8ccd0';g.fillRect(a+4,y,b-a-8,4);
     for(let x=a+14;x<b-24;){const k=Math.floor(R()*4),c=['#e8d0a0','#f0f0e8','#c83a2a','#8a5a3a','#5aa040','#e0b020'][Math.floor(R()*6)];
       if(k===0){g.fillStyle='#e8d0a0';poly(g,[x,y,x+22,y,x+22,y-14]);g.fill();g.fillStyle='#5aa040';g.fillRect(x+4,y-4,14,2);x+=26}
       else if(k===1){g.fillStyle=c;rr(g,x,y-26,10,26,3);g.fill();g.fillStyle='#f0ece4';g.fillRect(x+1,y-18,8,6);x+=14}
       else if(k===2){g.fillStyle='rgba(240,240,232,.9)';rr(g,x,y-14,18,14,3);g.fill();g.fillStyle=c;g.fillRect(x+2,y-10,14,6);x+=22}
       else{g.fillStyle='#f0ece4';g.fillRect(x,y-18,16,18);g.fillStyle=c;g.fillRect(x+2,y-14,12,4);x+=20}}
     g.fillStyle='#f0e050';for(let x=a+30;x<b;x+=90)g.fillRect(x,y+4,22,7)}
   g.fillStyle='rgba(200,230,250,.18)';g.fillRect(a,8*T,b-a,GY-T-8*T);for(let x=a;x<=b;x+=110){g.fillStyle='#8a9098';g.fillRect(x-3,8*T,6,GY-T-8*T);if(x<b){g.fillStyle='#c8ccd2';g.fillRect(x+96,8*T+60,4,70)}}
   g.fillStyle='#c8ccd0';g.fillRect(a,GY-T,b-a,T);g.fillStyle='#e0c040';g.fillRect(a,GY-T,b-a,5);g.fillStyle='#8a9098';for(let x=a+20;x<b;x+=40)g.fillRect(x,GY-T+16,24,3)}
  // ---- la salle : cadres, suspensions, jardinières, tables nappées ----
  {const frame=(x,y,w,h,draw)=>{g.fillStyle='#6a4a30';g.fillRect(x-5,y-5,w+10,h+10);g.fillStyle='#f0e8d8';g.fillRect(x-2,y-2,w+4,h+4);g.fillStyle='#2a3448';g.fillRect(x,y,w,h);draw(x,y,w,h)};
   frame(8460,250,110,80,(x,y,w,h)=>{g.fillStyle='#e8c890';g.fillRect(x,y+h-24,w,24);g.fillStyle='#3a3020';poly(g,[x+30,y+h-24,x+30,y+20,x+38,y+8,x+46,y+20,x+46,y+h-24]);g.fill();poly(g,[x+64,y+h-24,x+64,y+20,x+72,y+8,x+80,y+20,x+80,y+h-24]);g.fill();g.fillRect(x+30,y+34,50,30)});
   frame(9160,240,130,90,(x,y,w,h)=>{g.fillStyle='#e0a050';g.fillRect(x,y,w,h*.45);g.fillStyle='#4a7a3a';for(let k=0;k<6;k++){g.beginPath();g.moveTo(x,y+h*.45+k*9);g.quadraticCurveTo(x+w/2,y+h*.4+k*9,x+w,y+h*.45+k*9);g.lineTo(x+w,y+h*.45+k*9+4);g.quadraticCurveTo(x+w/2,y+h*.4+k*9+4,x,y+h*.45+k*9+4);g.fill()}});
   frame(9820,250,100,80,(x,y,w,h)=>{g.fillStyle='#c8d8e8';g.fillRect(x,y,w,h);g.fillStyle='#2a5a8a';g.fillRect(x,y+h-20,w,20);g.fillStyle='#e8e4d8';g.fillRect(x+20,y+30,60,22);g.fillStyle='#c83a2a';g.fillRect(x+70,y+22,10,10)});
   frame(10420,240,120,90,(x,y,w,h)=>{g.fillStyle='#e8d890';g.fillRect(x,y,w,h);g.fillStyle='#c8a848';for(let k=0;k<4;k++){g.beginPath();g.moveTo(x+20+k*26,y+h-10);g.lineTo(x+26+k*26,y+30);g.lineTo(x+32+k*26,y+h-10);g.fill()}});
   for(const x of D.tables){const cx=x+60;g.strokeStyle='#3a3a3e';g.lineWidth=2;g.beginPath();g.moveTo(cx,CEIL+40);g.lineTo(cx,GY-230);g.stroke();g.fillStyle='#2a5a4a';g.beginPath();g.moveTo(cx-26,GY-206);g.quadraticCurveTo(cx,GY-246,cx+26,GY-206);g.closePath();g.fill();g.fillStyle='#ffe8a8';g.fillRect(cx-20,GY-208,40,3)}
   for(const x of[8560,9200,9800,10380]){g.fillStyle='#7a5a3a';rr(g,x-24,GY-60,48,60,5);g.fill();g.fillStyle='#5a3e26';g.fillRect(x-24,GY-60,48,6);
     for(let k=0;k<11;k++){const a=-Math.PI*.95+k*Math.PI*.09,l=60+(k%3)*18;g.strokeStyle=k%2?'#3a7a3a':'#4a8a40';g.lineWidth=7;g.beginPath();g.moveTo(x,GY-58);g.quadraticCurveTo(x+Math.cos(a)*l*.5,GY-60+Math.sin(a)*l*.9,x+Math.cos(a)*l,GY-58+Math.sin(a)*l*.7);g.stroke()}}
   for(const x of D.tables){g.fillStyle='#f0ece0';g.fillRect(x-4,GY-84,128,8);g.fillStyle='#e0d8c4';poly(g,[x-4,GY-76,x+124,GY-76,x+118,GY-56,x+2,GY-56]);g.fill();g.fillStyle='#c83a2a';g.fillRect(x-4,GY-78,128,2);
     g.fillStyle='#5a4030';g.fillRect(x+54,GY-56,12,56);g.fillRect(x+28,GY-5,64,5);
     for(const[dx,c]of[[18,'#c8a060'],[78,'#a8c8d8']]){g.fillStyle=c;rr(g,x+dx,GY-90,26,6,2);g.fill();g.fillStyle='#f4f2ec';g.beginPath();g.ellipse(x+dx+13,GY-91,10,3,0,0,7);g.fill()}g.fillStyle='rgba(220,230,240,.8)';g.fillRect(x+58,GY-98,6,12)}
   g.fillStyle='#c8b8a0';g.fillRect(8680,GY-200,40,200);g.fillStyle='#a89880';g.fillRect(8710,GY-200,10,200);g.fillStyle='#b0a088';g.fillRect(8676,GY-204,48,8)}
  // ---- les toilettes : faïence, miroirs, vasques en série, sèche-mains ; cabines (portes dessinées en direct) ; la fenêtre ----
  {for(let y=CEIL+40;y<GY;y+=24)for(let x=11040;x<AIN.IN1-40;x+=24){g.fillStyle='rgba(0,0,0,.05)';g.fillRect(x,y,1,24);g.fillRect(x,y,24,1)}
   g.fillStyle='#2a5a8a';g.fillRect(11040,GY-96,AIN.IN1-40-11040,8);
   g.fillStyle='#b8c4cc';g.fillRect(11150,GY-200,330,8);for(let k=0;k<3;k++){const x=11170+k*104;g.fillStyle='#8a98a4';g.fillRect(x-4,GY-196,92,74);g.fillStyle='#c8dce8';g.fillRect(x,GY-192,84,66);g.fillStyle='rgba(255,255,255,.4)';poly(g,[x+8,GY-190,x+22,GY-190,x+6,GY-130,x,GY-130]);g.fill()}
   g.fillStyle='#e8ecee';g.fillRect(11150,GY-122,330,12);g.fillStyle='#c8ccd0';g.fillRect(11150,GY-110,330,8);
   for(let k=0;k<3;k++){const x=11212+k*104;g.fillStyle='#f6f8f8';g.beginPath();g.ellipse(x,GY-122,30,8,0,0,7);g.fill();g.fillStyle='#d8dee2';g.beginPath();g.ellipse(x,GY-122,22,5,0,0,7);g.fill();
     g.fillStyle='#a8acb0';g.fillRect(x-3,GY-142,6,16);g.fillRect(x-3,GY-142,14,4);g.fillStyle='#8a8e94';g.fillRect(x-1,GY-102,3,102)}
   g.fillStyle='#d8dcdf';rr(g,11500,GY-170,36,46,5);g.fill();g.fillStyle='#8a8e94';g.fillRect(11510,GY-128,16,4);
   // les cabines : montants, imposte, rail du haut (on peut s'y poser)
   const{WC0:w0,WCW:ww,WCN:n}=AIN;g.fillStyle='#4a5a6a';g.fillRect(w0-6,GY-162,ww*n+12,8);g.fillStyle='#6a7a8a';g.fillRect(w0-6,GY-162,ww*n+12,2);
   for(let i=0;i<=n;i++){const x=w0+i*ww;g.fillStyle='#5a6a7a';g.fillRect(x-4,GY-154,8,142);g.fillStyle='#8a9098';g.fillRect(x-3,GY-12,6,12)}
   // la fenêtre : embrasure, appui, battant basculant entrouvert ; le mur extérieur, crépi
   {const x=12440,y0=5*T,y1=8*T;g.fillStyle='#c8ccd0';g.fillRect(x-8,y0-12,56,y1-y0+24);g.fillStyle='#14203a';g.fillRect(x,y0,40,y1-y0);g.fillStyle='rgba(150,180,220,.16)';g.fillRect(x,y0,40,y1-y0);
    g.fillStyle='#e8ecee';g.fillRect(x-12,y1,64,8);g.fillStyle='#8a9098';g.fillRect(x-2,y0-2,44,4);
    g.fillStyle='rgba(200,225,245,.45)';poly(g,[x+2,y0+4,x+38,y0+4,x+30,y0+50,x-6,y0+50]);g.fill();g.strokeStyle='#8a9098';g.lineWidth=3;g.beginPath();g.moveTo(x+2,y0+4);g.lineTo(x+38,y0+4);g.lineTo(x+30,y0+50);g.lineTo(x-6,y0+50);g.closePath();g.stroke();
    g.fillStyle='#a8a090';g.fillRect(AIN.IN1,CEIL-6,30,GY-CEIL+6);for(let k=0;k<60;k++){g.fillStyle='rgba(0,0,0,.08)';g.fillRect(AIN.IN1+R()*28,CEIL+R()*(GY-CEIL),3,2)}g.fillStyle='#6a6458';g.fillRect(AIN.IN1+26,CEIL-6,4,GY-CEIL+6)}}
  // ---- dehors, derrière : les deux camions garés (dessinés comme sur l'autoroute) ----
  for(const[a,b,col,lab]of[[13400,13840,'#2a5a9a',/*v2*/'FRIGORIFIQUE'],[15800,16240,'#c82a22','TRANSPORTS FONTAINE & FILS']])a4TruckBody(g,a,GY-120,b-a,120,col,lab,0,0);
  return c;
}

/* ---------- après lecture ---------- */
function airePost(Lv){const D=Lv.def.aire;if(!D)return;const GY=D.G0*T;
  const S={dogs:D.dogs.map(([x,a,b],i)=>({home:x,x:x-30,y:GY-34,w:60,h:34,vx:0,vy:0,onGround:true,a,b,st:'sleep',t:0,f:i%2?-1:1,f0:i%2?-1:1,lost:0,bark:0,win:!D.wake[i]})),
    doorOpen:0,jump:D.jumpers.map(([a,b,y,h],i)=>({a,b,y0:y,h,t:i*2.1,x:a,y,f:1,st:'walk',k:'gros'})),beg:{x:D.beggar[0],f:1,t:0,y:GY,k:'moignon',st:'walk',beg:0},
    cash:D.cashiers.map(([a,b,top],i)=>({a,b,top,x:(a+b)/2,st:'idle',t:0,f:-1,seen:false,p:fkMake(41+i,{fem:true,coat:'#c83a2a',hat:null,apron:null})})),
    cust:D.customers.map((x,i)=>({x,p:fkMake(7+i*3,{bag:i?'cabas':null})})),
    tables:D.tables.map((x,i)=>({x,on:0,hit:0,p:[fkMake(100+i*2,DINERS[i*2%DINERS.length]),fkMake(101+i*2,DINERS[(i*2+1)%DINERS.length])]})),
    pump:{x:1262,p:fkMake(77,{fem:false,old:false,coat:'#5a5a62',hat:'casquette',tie:null}),near:0},
    wc:{open:0,t:0,said:0},wcMan:fkMake(303,{fem:false,old:false,coat:'#e8e4d8',leg:'#2a3a5a',tie:'#8a2a2a',hat:null,glass:true}),
    said:{},grace:0,coffee:0,fridgeOpen:1,jn:0,mosq:[]};
  for(const[x,r]of AIN.LAMPS)for(let k=0;k<14;k++)S.mosq.push({lx:x,ly:r*T+22,ph:k*1.7,r:10+(k*7)%22,sp:2+(k%5)*.7});
  Lv.aire=S;
  for(let r=10;r<=13;r++)Lv.g[r][Math.floor(D.door[0]/T)]='X';
  Lv.acts=Lv.acts||[];
  Lv.acts.push({kind:'secret',style:'coffee',x:D.coffee,y:GY,open:0,t:0,used:false,q:["Un coup de bec sur le bouton… et ça coule, ça coule. Le café de l'arrière n'a pas changé : on en renverse plus qu'on n'en boit."]});
  Lv.acts.push({kind:'secret',style:'salad',x:D.salad,y:GY-3*T,open:0,t:0,used:false,noStraw:false,q:["Une petite fiente dans la salade. Elle sera meilleure comme ça. Au front, on appelait ça l'assaisonnement de la ligne."]});
  Lv.acts.push({kind:'secret',style:'fridge',x:D.fridge,y:GY-T,open:0,t:0,used:false,q:["On ne laisse pas la porte du frigo ouverte. C'est dans le règlement de toutes les cuisines du monde."]});
  // la poignée du cabinet occupé : on saute dessus (pas de touche d'action : l'acte est hors de portée de « E »)
  Lv.acts.push({kind:'secret',style:'wc',x:AIN.WC0+AIN.WCBUSY*AIN.WCW+80,y:-9999,open:0,t:0,used:false,q:[/*v2*/"Pardon, monsieur ! Je cherchais la sortie. Je n'ai rien vu : de toute façon, c'était flou."]});
}
/* les dîneurs : des tenues différentes (routier, costume, randonneuse, grand-mère, cuisinier en pause, ouvrier…) */
const DINERS=[{hat:'casquette',coat:'#3a5a3a'},{fem:true,coat:'#a84a6a',scarf:'#e0b020'},{tie:'#2a3a6a',coat:'#2a2e3a',glass:true},{fem:true,old:true,hat:'paille',coat:'#7a6a52'},
  {coat:'#f0ece4',hat:'toque',apron:null},{vest:true,hat:null,coat:'#3a4a6a'},{fem:true,coat:'#3a6a8a',hat:'bonnet'},{old:true,coat:'#5a4a3a',hat:'beret',must:true},{coat:'#b85a3a',hat:null},{fem:true,coat:'#6a4a7a',glass:true}];
function aireAct(a){const S=L.aire;if(!S)return false;
  if(a.style==='coffee'&&!a.used){S.coffee=1;grantSecret(a,a.y-60);return true}
  if(a.style==='salad'&&!a.used){grantSecret(a,a.y-20);if(!G.sim)noise(.2,500,.1,'lowpass');return true}
  if(a.style==='fridge'&&!a.used){S.fridgeOpen=0;grantSecret(a,a.y-40);if(!G.sim){noise(.15,300,.3,'lowpass');tone(140,.12,'sine',.08)}return true}
  if(a.style==='wc')return true;
  return false}
const aireInside=x=>x>AIN.IN0-20&&x<AIN.IN1;
function aireStep(dt){const S=L.aire;if(!S)return;const D=L.def.aire,GY=D.G0*T,hb={x:P.x+3,y:P.y+4,w:P.w-6,h:P.h-6},pcx=P.x+P.w/2,pcy=P.y+P.h/2;let hit=null;
  const jumped=(P.jumpN||0)!==S.jn;S.jn=P.jumpN||0;
  // la porte automatique : il faut sauter devant le capteur
  {const[sx,sy]=D.sensor,dc=Math.floor(D.door[0]/T);if(!P.onGround&&pcx>sx-160&&pcx<sx+10&&P.y<sy+90){if(S.doorOpen<=0&&!G.sim)tone(1200,.08,'sine',.05);S.doorOpen=3.5}
   if(S.doorOpen>0){S.doorOpen-=dt;for(let r=10;r<=13;r++)L.g[r][dc]='.'}else if(!(pcx>D.door[0]-10&&pcx<D.door[1]+10))for(let r=10;r<=13;r++)L.g[r][dc]='X';
   if(!S.said.porte&&!G.sim&&pcx>D.door[0]-260&&pcx<D.door[0]&&P.onGround){S.said.porte=1;say("Une porte qui s'ouvre toute seule… mais pas pour les pigeons. Le petit œil, là-haut : il faut qu'il me voie passer.",4.2)}}
  // les chiens : réveillés par un saut, ils courent ; devant un obstacle, ils s'assoient et aboient tant qu'ils voient Raymond
  for(const d of S.dogs){d.t+=dt;const dcx=d.x+d.w/2,dx=pcx-dcx;
    const sees=!P.dead&&pcx>d.a-120&&pcx<d.b+120&&Math.abs(dx)<640&&!aireInside(pcx)&&!(d.win&&pcx<D.window+40);
    if(d.st==='sleep'){const near=Math.abs(dx)<360&&Math.abs(pcy-d.y)<280&&sees;
      if((jumped&&near)||(d.win&&pcx>D.window+50&&pcx<d.b&&P.onGround)){d.st='wake';d.t=0;if(!G.sim){tone(220,.15,'sawtooth',.08);tone(180,.2,'sawtooth',.08,null,.18);bubble(dcx,d.y-20,'Ouaf ! Ouaf !','#4a3a2a')}}continue}
    if(d.st==='wake'){d.f=Math.sign(dx)||d.f;if(d.t>.6){d.st='chase';d.t=0}continue}
    if(sees)d.lost=0;else d.lost+=dt;
    if(d.st!=='back'&&d.lost>1.6){d.st='back';d.t=0;if(!G.sim)bubble(dcx,d.y-20,'Grrr…','#4a3a2a')}
    let want=0;
    if(d.st==='back'){const h=d.home-30-d.x;want=Math.abs(h)<4?0:Math.sign(h);if(!want){d.st='sleep';d.vx=0;d.f=d.f0;continue}if(sees&&jumped&&Math.abs(dx)<360){d.st='chase';d.lost=0}}
    else{const reach=P.y+P.h>GY-46;d.f=Math.sign(dx)||d.f;want=(Math.abs(dx)<(reach?6:26))?0:d.f;
      if(want&&((d.f>0&&d.x>=d.b-2)||(d.f<0&&d.x<=d.a-18)))want=0}
    const sp=d.st==='back'?120:265,ox=d.x;d.vx=want*sp;
    d.vy=Math.min(MAXFALL,d.vy+GRAV*dt);moveX(d,d.vx*dt);d.x=clamp(d.x,d.a-20,d.b);d.onGround=false;moveY(d,d.vy*dt);
    const moved=Math.abs(d.x-ox);d.run=want!==0&&moved>sp*dt*.4;
    if(d.st!=='back'){d.st=d.run?'chase':'sit';if(d.st==='sit'&&sees){d.bark-=dt;if(d.bark<=0){d.bark=1.1+rnd()*.4;d.nb=(d.nb||0)+1;if(!G.sim){tone(240,.1,'sawtooth',.06);if(d.nb%3===1)bubble(dcx+d.f*20,d.y-24,pick(['Ouaf !','Ouaf ! Ouaf !','Wouf !']),'#4a3a2a')}}}}
    if(d.st!=='sleep'&&!P.dead&&overlap(hb,{x:d.x+6,y:d.y+4,w:d.w-12,h:d.h-6}))hit='chien'}
  if(!S.said.chiens&&!G.sim&&S.dogs.slice(0,2).some(d=>d.st==='chase'||d.st==='sit')){S.said.chiens=1;say("Je les ai réveillés. Règlement, article 192 ter : en cas de chiens, courir plus vite que le plus lent des deux.",4)}
  // le monsieur qui fait son plein : on ne le touche pas
  {const pm=S.pump;pm.near=Math.abs(pcx-pm.x)<110&&P.y+P.h>GY-160?1:0;pm.p.surp=pm.near;
   if(pm.near&&!S.said.plein&&!G.sim){S.said.plein=1;bubble(pm.x,GY-150,/*v2*/'Ouste, toi ! Pas sur ma voiture !','#2a3a5a')}
   if(!P.dead&&overlap(hb,{x:pm.x-12,y:GY-120,w:24,h:120}))hit='pompiste'}
  // les lampadaires de la station : un saut depuis la voiture, puis de lanterne en lanterne jusqu'au toit de l'auvent
  if(!S.said.lampe&&!G.sim&&P.onGround&&P.y+P.h<=AIN.LAMPS[0][1]*T+2&&Math.abs(pcx-AIN.LAMPS[0][0])<60){S.said.lampe=1;say(/*v2*/"Les moustiques me prennent pour un des leurs. D'ici, je vois le toit de l'auvent… et quelque chose qui brille dessus.",4.4)}
  // le pigeon mendiant devant la boutique
  {const b=S.beg;b.t+=dt;b.x+=b.f*22*dt;if(b.x<D.beggar[0]){b.x=D.beggar[0];b.f=1}if(b.x>D.beggar[1]){b.x=D.beggar[1];b.f=-1}b.beg=Math.max(0,b.beg-dt);b.st=b.beg>1.6?'beg':'walk';
   if(Math.abs(pcx-b.x)<200&&b.beg<=0&&!G.sim){b.beg=3;bubble(b.x,GY-44,pick(["Une miette, camarade ?","Rien qu'une graine…","Pour un ancien de la route…"]),'#6a5a48')}
   if(!P.dead&&overlap(hb,{x:b.x-12,y:GY-26,w:24,h:24}))hit='mendiant'}
  // les pigeons sauteurs (étals, vitrines)
  for(const o of S.jump){o.t+=dt;const cyc=6.2,u=o.t%cyc;
    if(u<1.6){o.st='walk';o.x=o.a+Math.sin(u*1.8)*8;o.y=o.y0;o.f=1}else if(u<3.1){o.st='fly';const v=(u-1.6)/1.5;o.x=o.a+(o.b-o.a)*v;o.y=o.y0-Math.sin(v*Math.PI)*o.h;o.f=1}
    else if(u<4.7){o.st='walk';o.x=o.b+Math.sin((u-3.1)*1.8)*8;o.y=o.y0;o.f=-1}else{o.st='fly';const v=(u-4.7)/1.5;o.x=o.b+(o.a-o.b)*v;o.y=o.y0-Math.sin(v*Math.PI)*o.h;o.f=-1}
    if(!P.dead&&overlap(hb,{x:o.x-16,y:o.y-30,w:32,h:28}))hit='sauteur'}
  // les clients : ils lèvent les bras en criant « Pigeon ! » quand un pigeon (ou Raymond) passe près d'eux
  for(const cu of S.cust){const cx=cu.x,near=Math.abs(pcx-cx)<110||S.jump.some(o=>o.st==='fly'&&Math.abs(o.x-cx)<120);const k='cu'+cx;
    if(near&&!(S[k]>0)&&!G.sim){S[k]=2.4;bubble(cx,GY-150,pick(['Pigeon !','Un pigeon ! Là !','Aaah, un pigeon !']),'#2a3a5a')}S[k]=Math.max(0,(S[k]||0)-dt);
    if(!P.dead&&overlap(hb,{x:cx-12,y:GY-(near?130:116),w:24,h:near?130:116}))hit='client'}
  // les caissières : elles tapent quand Raymond est sur le comptoir
  for(const w of S.cash){w.t+=dt;const on=pcx>w.a-80&&pcx<w.b+80&&P.y+P.h<=w.top+2&&P.y+P.h>w.top-90;
    if(on&&!w.seen){w.seen=true;if(!G.sim)bubble(w.x,w.top-100,"Pas sur mon comptoir, sale bête !",'#2a2420')}if(!on)w.seen=false;
    if(w.st==='idle'||w.st==='cool'){if(w.seen){const d=clamp(pcx,w.a,w.b)-w.x;w.x+=clamp(d,-190*dt,190*dt);if(Math.abs(d)>2)w.f=Math.sign(d)}if(w.st==='cool'&&w.t>.4){w.st='idle';w.t=0}
      if(w.st==='idle'&&w.seen&&Math.abs(w.x-pcx)<60){w.st='wind';w.t=0;if(!G.sim&&rnd()<.5)bubble(w.x,w.top-100,pick(["Ouste !","Dehors !","Ah non !"]),'#2a2420')}}
    else if(w.st==='wind'&&w.t>.28){w.st='strike';w.t=0;if(!G.sim)noise(.1,1500,.25,'bandpass')}
    else if(w.st==='strike'){if(!P.dead&&Math.abs(w.x+w.f*20-pcx)<44&&P.y+P.h<=w.top+2&&P.y+P.h>w.top-80)hit='caissiere';if(w.t>.15){w.st='cool';w.t=0}}}
  // les ventilateurs du plafond : leurs pales coupent
  for(let x=AIN.IN0+300;x<AIN.IN1-100;x+=520)if(!P.dead&&Math.abs(pcx-x)<64&&Math.abs(pcy-AIN.FANY)<16)hit='ventilo';
  // la hotte du bar à salades : des pics anti-pigeons sur le dessus
  {const[a,b]=D.hood;if(!P.dead&&overlap(hb,{x:a,y:7*T-18,w:b-a,h:16}))hit='spikes'}
  // la salle : les dîneurs tapent sur la table où Raymond s'est posé ; et on ne les touche pas
  for(const tb of S.tables){const on=P.onGround&&pcx>tb.x&&pcx<tb.x+120&&Math.abs(P.y+P.h-(GY-2*T))<3;if(on){tb.on+=dt;if(tb.on>.55&&tb.hit<=0){tb.hit=.3;tb.on=0;if(!G.sim){noise(.12,400,.3,'lowpass');G.shake=Math.max(G.shake||0,2);bubble(tb.x+60,GY-150,pick(['Bam !','Dégage !','Sur la table ?!']),'#2a2420')}}}else tb.on=0;
    if(tb.hit>0){tb.hit-=dt;if(on&&!P.dead)hit='dineur'}
    for(const cx of[tb.x-20,tb.x+140])if(!P.dead&&overlap(hb,{x:cx-12,y:GY-104,w:24,h:104}))hit='dineur2'}
  // les toilettes : la poignée du cabinet occupé (on saute dessus) ouvre la porte
  {const w=S.wc,hx=AIN.WC0+AIN.WCBUSY*AIN.WCW+80,hy=GY-86;w.t+=dt;
   if(w.open>0){w.open=Math.max(0,w.open-dt/3.4);if(w.open<=0&&!G.sim)noise(.12,600,.25,'lowpass')}
   if(w.open<=0&&!P.onGround&&overlap(hb,{x:hx-8,y:hy-8,w:18,h:16})){w.open=1;w.t=0;
     if(!G.sim){noise(.1,1200,.2,'bandpass');bubble(hx-30,GY-190,pick([/*v2*/'Occupé !!!',/*v2*/'Fermez cette porte !',/*v2*/'Au secours ! Un pigeon !']),'#6a2a2a');tone(880,.3,'sawtooth',.06);tone(1040,.4,'sawtooth',.05,null,.12)}
     const a=L.acts.find(x=>x.style==='wc');if(a&&!a.used){grantSecret(a,hy-30);unlock('a72')}}}
  // la fenêtre des toilettes
  if(!S.said.fenetre&&!G.sim&&pcx>D.window-200&&P.y<8*T){S.said.fenetre=1;say("La fenêtre des toilettes. La sortie des artistes, et des pigeons.",3.4)}
  if(!S.said.camion&&!G.sim&&pcx>15500){S.said.camion=1;say("Un camion qui chauffe son moteur. Si je suis dessus quand il part, je quitte l'aire.",3.8)}
  if(S.grace>0){S.grace-=dt;hit=null}
  if(hit)G.aireHit=hit;
}
function aireAfterMove(){if(G.aireHit){const k=G.aireHit;G.aireHit=null;return k}return null}
function aireRespawn(){const S=L.aire;if(!S)return;S.grace=1.6;S.jn=P.jumpN||0;for(const d of S.dogs){d.st='sleep';d.x=d.home-30;d.y=L.def.aire.G0*T-34;d.vx=d.vy=0;d.lost=0}for(const w of S.cash){w.st='idle';w.seen=false}for(const tb of S.tables){tb.on=0;tb.hit=0}S.wc.open=0}
function aireLights(){const S=L.aire;if(!S)return[];const D=L.def.aire,GY=D.G0*T,out=[];
  for(const x of AIR_PARK_LAMPS)out.push({x:x+50,y:GY-226,r:240,i:.8,warm:1});
  for(let x=AIN.CAN[0]+90;x<AIN.CAN[1];x+=150)out.push({x,y:172,r:250,i:.95});
  for(const[x,r]of AIN.LAMPS)out.push({x,y:r*T+20,r:280,i:1,warm:1});
  for(let x=AIN.IN0+120;x<AIN.IN1;x+=240)out.push({x,y:300,r:330,i:1});
  for(const x of D.tables)out.push({x:x+60,y:GY-206,r:170,i:.6,warm:1});
  out.push({x:16200,y:GY-60,r:200,i:.7});return out}

/* ---------- dessin ---------- */
function drawAireBack(t,cx){const ly=L.aireLayer;if(!ly)return;const tr=ly.rs||1,sx=Math.max(0,cx-30),sw=Math.min(W+80,ly.width/tr-sx);if(sw>0)blitLayer(ctx,ly,sx*tr,0,sw*tr,ly.height,sx,-PAD,sw,ly.height/tr);
  // les lumières du dehors : cônes des lampadaires de parking ; les deux lampadaires de la station, leurs moustiques
  const g=ctx,GY=L.def.aire.G0*T,a0=cx-300,a1=cx+W+300;
  for(const x of AIR_PARK_LAMPS){if(x<a0||x>a1)continue;const gr=g.createLinearGradient(0,GY-228,0,GY);gr.addColorStop(0,'rgba(255,200,120,.3)');gr.addColorStop(1,'rgba(255,200,120,0)');g.fillStyle=gr;poly(g,[x+38,GY-228,x+62,GY-228,x+150,GY,x-50,GY]);g.fill();
    g.fillStyle='#ffd890';g.fillRect(x+38,GY-228,24,4);g.fillStyle='rgba(255,220,150,.35)';g.beginPath();g.ellipse(x+50,GY-224,24,8,0,0,7);g.fill()}
  for(const[x,r]of AIN.LAMPS){if(x<a0||x>a1)continue;const top=r*T;
    const gr=g.createLinearGradient(0,top+18,0,GY);gr.addColorStop(0,'rgba(240,250,255,.32)');gr.addColorStop(1,'rgba(240,250,255,0)');g.fillStyle=gr;poly(g,[x-36,top+18,x+36,top+18,x+150,GY,x-150,GY]);g.fill();
    g.fillStyle='#3a3e46';rr(g,x-42,top,84,16,4);g.fill();g.fillStyle='#5a5e66';g.fillRect(x-42,top,84,3);g.fillStyle='#f4fbff';g.fillRect(x-36,top+14,72,5);g.fillStyle='rgba(240,250,255,.4)';g.beginPath();g.ellipse(x,top+18,46,9,0,0,7);g.fill()}
  const S=L.aire;if(S)for(const m of S.mosq){if(m.lx<a0||m.lx>a1)continue;const a=t*m.sp+m.ph,mx=m.lx+Math.cos(a)*m.r*1.8,my=m.ly+Math.sin(a*1.7)*m.r*.5+6;g.fillStyle='rgba(30,30,30,.85)';g.fillRect(mx,my,2,2);g.fillStyle='rgba(255,255,255,.35)';g.fillRect(mx-1+Math.sin(t*60+m.ph),my-1,2,1)}}
function drawAireMid(t){const S=L.aire;if(!S)return;const g=ctx,D=L.def.aire,GY=D.G0*T,a0=cam.x-200,a1=cam.x+W+200,vis=x=>x>a0&&x<a1;
  // le carrelage du sol, à l'intérieur
  {const a=Math.max(AIN.IN0,a0),b=Math.min(AIN.IN1,a1);if(b>a){g.fillStyle='#b8b0a0';g.fillRect(a,GY,b-a,6);g.fillStyle='rgba(0,0,0,.12)';for(let x=Math.floor(a/40)*40;x<b;x+=40)g.fillRect(x,GY,1,6)}}
  // la porte automatique : deux vantaux vitrés qui coulissent
  if(vis(D.door[0])){const op=Math.min(1,Math.max(0,S.doorOpen)*2),[x0,x1]=D.door,w=x1-x0;g.fillStyle='rgba(150,190,220,.42)';g.fillRect(x0,GY-160,w-op*w*.8,160);g.strokeStyle='#3a3e46';g.lineWidth=3;g.strokeRect(x0,GY-160,w-op*w*.8,160);
    g.fillStyle='rgba(255,255,255,.3)';g.fillRect(x0+6,GY-150,3,120);g.fillStyle='#e8e4d8';g.fillRect(x0+4,GY-90,w-op*w*.8-8,3);
    const[sx,sy]=D.sensor;g.fillStyle=S.doorOpen>0?'#4ae060':'#d83020';g.beginPath();g.arc(sx,sy+6,4,0,7);g.fill()}
  // les ventilateurs du plafond
  for(let x=AIN.IN0+300;x<AIN.IN1-100;x+=520)if(vis(x)){g.fillStyle='#3a3a3e';g.fillRect(x-2,4*T+40,4,24);g.fillStyle='#2a2a2e';g.beginPath();g.ellipse(x,AIN.FANY,8,5,0,0,7);g.fill();g.save();g.translate(x,AIN.FANY);g.scale(1,.22);g.rotate(t*9);g.fillStyle='#5a5048';for(let k=0;k<4;k++){g.rotate(Math.PI/2);g.fillRect(0,-6,62,12)}g.restore()}
  // les toilettes : les portes des cabines (celle qui est occupée : on voit des pieds dessous ; ouverte, on voit tout… presque)
  {const{WC0:w0,WCW:ww,WCN:n,WCBUSY:bi}=AIN;if(w0+ww*n>a0&&w0<a1)for(let i=0;i<n;i++){const x=w0+i*ww,busy=i===bi,op=busy?Math.min(1,S.wc.open*3):0;
    if(busy&&op>0){// l'intérieur : la faïence, la cuvette, le monsieur assis de face, la pudeur pixelisée
      g.fillStyle='#b8c8d4';g.fillRect(x+4,GY-154,ww-8,154);g.fillStyle='#f4f6f6';rr(g,x+34,GY-76,32,30,5);g.fill();g.beginPath();g.ellipse(x+50,GY-40,22,8,0,0,7);g.fill();g.fillRect(x+40,GY-40,20,40);
      fkDraw(g,S.wcMan,x+50,GY-2,t,'toilet',{scream:true})}
    // la porte (pivote vers nous quand elle s'ouvre)
    const dw=(ww-8)*(1-op*.82),dx=x+4;g.fillStyle=busy?'#7a8a9a':'#8a9aaa';g.fillRect(dx,GY-154,dw,132);g.fillStyle='rgba(255,255,255,.08)';g.fillRect(dx+4,GY-150,4,124);
    if(op<.3){g.fillStyle='#c8ccd0';g.fillRect(x+74,GY-90,14,5);g.fillStyle=busy?'#d83020':'#3ab050';g.fillRect(x+76,GY-104,10,8)}
    if(busy&&op<=0){// les pieds sous la porte : chaussures, pantalon tombé
      g.fillStyle='#2a3a5a';rr(g,x+28,GY-14,44,9,3);g.fill();g.fillStyle='#1e1c1a';g.beginPath();g.ellipse(x+36,GY-3,9,3.5,0,0,7);g.ellipse(x+64,GY-3,9,3.5,0,0,7);g.fill()}}}
  // le monsieur qui fait son plein
  if(vis(S.pump.x))fkDraw(g,S.pump.p,S.pump.x,GY,t,'fill',{f:1,hose:-60});
  // chiens
  for(const d of S.dogs)if(vis(d.x))aireDog(g,d,t);
  // pigeons : mendiant, sauteurs
  if(vis(S.beg.x))drawUglyPigeon(g,S.beg,t);for(const o of S.jump)if(vis(o.x))drawUglyPigeon(g,o,t);
  // clients
  for(const cu of S.cust)if(vis(cu.x)){const up=(S['cu'+cu.x]||0)>0;fkDraw(g,cu.p,cu.x,GY,t,up?'up':'stand',{f:cu.x<4000?-1:1,hold:cu.p.bag?(g2,hx,hy)=>{g2.fillStyle='#3a6a4a';rr(g2,hx-8,hy,16,20,3);g2.fill()}:null})}
  // caissières (le classeur des tickets à la main)
  const binder=(g2,hx,hy)=>{g2.fillStyle='#2a4a8a';g2.save();g2.translate(hx,hy);g2.rotate(-.3);g2.fillRect(-4,-14,18,22);g2.fillStyle='#e8e4d8';g2.fillRect(-2,-12,3,18);g2.restore()};
  for(const w of S.cash)if(vis(w.x)){g.save();g.beginPath();g.rect(w.x-80,0,160,GY-84);g.clip();fkDraw(g,w.p,w.x,GY-26,t,w.st==='wind'?'wind':w.st==='strike'?'strike':'stand',{f:w.f,hold:w.st==='wind'||w.st==='strike'?binder:null});g.restore()}
  // dîneurs assis
  for(const tb of S.tables)if(vis(tb.x))tb.p.forEach((p,k)=>{const cx=k?tb.x+140:tb.x-20,f=k?-1:1;aireChair(g,cx,GY,f);fkDraw(g,p,cx,GY,t,tb.hit>0?'sitbang':'sit',{f,eat:1,hold:(g2,hx,hy)=>{g2.fillStyle='#c8a060';g2.fillRect(hx-2,hy-3,10,3)}})});
  // le café qui coule
  if(S.coffee&&vis(D.coffee)){g.fillStyle='#3a1e0e';g.fillRect(D.coffee-2,GY-60,4,58+Math.sin(t*20));g.beginPath();g.ellipse(D.coffee+10,GY-1,70,4,0,0,7);g.fill();g.fillStyle='rgba(255,230,200,.25)';g.fillRect(D.coffee-2,GY-60,1,58);g.fillStyle='rgba(240,230,220,.3)';for(let k=0;k<3;k++){const ph=(t*.5+k/3)%1;g.beginPath();g.arc(D.coffee-10+k*14,GY-10-ph*40,4+ph*6,0,7);g.fill()}}
  // les pics de la hotte
  {const[a,b]=D.hood;if(b>a0&&a<a1){g.fillStyle='#2a2c32';g.fillRect(a,7*T-4,b-a,4);g.strokeStyle='#c8ced6';g.lineWidth=1.4;for(let x=a+3;x<b;x+=5){g.beginPath();g.moveTo(x,7*T-4);g.lineTo(x+Math.sin(x)*2,7*T-18);g.stroke()}}}
  // la porte de la vitrine restée ouverte
  if(vis(D.fridge)){g.fillStyle='rgba(210,235,250,.65)';g.strokeStyle='#8a9098';g.lineWidth=2;if(S.fridgeOpen){poly(g,[D.fridge-50,8*T,D.fridge-50,GY-T,D.fridge+20,GY-T-20,D.fridge+20,8*T+20]);g.fill();g.stroke();g.fillStyle='rgba(200,230,255,.25)';for(let k=0;k<3;k++){const ph=(t*.4+k/3)%1;g.beginPath();g.arc(D.fridge-10+k*12,GY-T-10-ph*20,8,0,7);g.fill()}}}
  // le dernier camion : il chauffe, fume
  if(vis(16200))for(let k=0;k<4;k++){const ph=(t*.9+k/4)%1;g.fillStyle='rgba(160,160,160,'+(.35*(1-ph))+')';g.beginPath();g.arc(15790-ph*30,GY-30-ph*40,5+ph*12,0,7);g.fill()}
}
function aireChair(g,x,GY,f){g.save();g.translate(x,GY);g.scale(f,1);g.fillStyle='#4a3a2e';g.fillRect(-14,-36,30,6);g.fillRect(-14,-82,6,50);g.fillRect(-12,-30,4,30);g.fillRect(12,-30,4,30);g.fillStyle='#6a5444';g.fillRect(-16,-80,4,40);g.restore()}
/* un chien errant : endormi (roulé), assis qui aboie, ou qui court */
function aireDog(g,d,t){const x=d.x+d.w/2,y=d.y+d.h,f=d.f,run=d.st==='chase'||d.st==='back',sl=d.st==='sleep',sit=d.st==='sit'||d.st==='wake',ph=run?t*16:0;g.save();g.translate(x,y);g.scale(f,1);
  const fur='#8a6a4a',dark='#5a4030',light='#b89a72';
  g.fillStyle='rgba(0,0,0,.22)';g.beginPath();g.ellipse(0,0,30,4,0,0,7);g.fill();
  if(sl){g.fillStyle=fur;g.beginPath();g.ellipse(0,-12,28,12,0,0,7);g.fill();g.fillStyle=light;g.beginPath();g.ellipse(4,-8,18,5,0,0,7);g.fill();g.fillStyle=fur;g.beginPath();g.ellipse(22,-10,12,9,0,0,7);g.fill();g.fillStyle=dark;g.beginPath();g.ellipse(16,-18,6,4,.4,0,7);g.fill();
    g.strokeStyle='#2a1e14';g.lineWidth=1.2;g.beginPath();g.moveTo(24,-12);g.lineTo(29,-12);g.stroke();
    g.strokeStyle=fur;g.lineWidth=4;g.lineCap='round';g.beginPath();g.moveTo(-26,-8);g.quadraticCurveTo(-36,-2,-30,2);g.stroke();
    g.fillStyle='rgba(255,255,255,.7)';g.font='bold 12px '+F_DISP;g.textAlign='center';g.scale(f,1);g.fillText('z'+(Math.sin(t*2)>0?'z':''),f*10,-32);g.lineCap='butt';g.restore();return}
  if(sit){// assis : arrière-train au sol, pattes avant tendues, tête levée vers Raymond, la gueule qui s'ouvre
    const bk=Math.max(0,Math.sin(t*14))*(d.st==='sit'?1:0);g.fillStyle=fur;g.beginPath();g.ellipse(-10,-14,16,13,0,0,7);g.fill();g.beginPath();g.ellipse(4,-28,12,16,-.5,0,7);g.fill();
    g.strokeStyle=fur;g.lineWidth=5;g.lineCap='round';g.beginPath();g.moveTo(8,-24);g.lineTo(10,-2);g.moveTo(14,-24);g.lineTo(16,-2);g.stroke();
    g.save();g.translate(14,-40);g.rotate(-.35);g.fillStyle=fur;g.beginPath();g.ellipse(0,0,11,9,0,0,7);g.fill();g.beginPath();g.ellipse(10,2,8,5,0,0,7);g.fill();
    g.fillStyle='#c83a3a';if(bk>.2){g.fillStyle='#4a1a1a';poly(g,[6,4,18,2+bk*5,6,8]);g.fill()}g.fillStyle='#111';g.beginPath();g.arc(17,1,2.2,0,7);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(3,-3,2,0,7);g.fill();g.fillStyle='#111';g.beginPath();g.arc(3.6,-3,1,0,7);g.fill();
    g.fillStyle=dark;poly(g,[-6,-6,-4,-18,2,-6]);g.fill();g.restore();
    g.strokeStyle=fur;g.lineWidth=4;g.beginPath();g.moveTo(-24,-8);g.quadraticCurveTo(-36,-6+Math.sin(t*12)*4,-38,-14);g.stroke();g.lineCap='butt';g.restore();return}
  g.strokeStyle=fur;g.lineWidth=5;g.lineCap='round';for(const[px,o]of[[-16,0],[-8,Math.PI],[12,Math.PI/2],[18,Math.PI*1.5]]){const s=run?Math.sin(ph+o)*8:0;g.beginPath();g.moveTo(px,-16);g.lineTo(px+s,-1);g.stroke()}
  g.fillStyle=fur;g.beginPath();g.ellipse(0,-22,24,11,0,0,7);g.fill();g.fillStyle=light;g.beginPath();g.ellipse(2,-16,16,4,0,0,7);g.fill();g.fillStyle=fur;g.beginPath();g.ellipse(26,-30,11,9,-.3,0,7);g.fill();g.beginPath();g.ellipse(36,-27,8,5,0,0,7);g.fill();
  g.fillStyle=dark;poly(g,[20,-36,24,-48,28,-36]);g.fill();g.fillStyle='#111';g.beginPath();g.arc(42,-28,2.4,0,7);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(29,-32,2,0,7);g.fill();
  if(run){g.fillStyle='#f0f0e8';poly(g,[33,-24,36,-20,39,-24]);g.fill();g.fillStyle='#c83a3a';g.fillRect(34,-24,6,3)}
  g.strokeStyle=fur;g.lineWidth=4;g.beginPath();g.moveTo(-22,-26);g.quadraticCurveTo(-34,-36+Math.sin(t*12)*6,-36,-42);g.stroke();g.lineCap='butt';g.restore()}
