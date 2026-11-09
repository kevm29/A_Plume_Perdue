/* =========================================================
   3-4 · SOUVENIR — REIMS, 19 SEPTEMBRE 1914 : LA CATHÉDRALE EN FEU
   ---------------------------------------------------------
   Devant l'ange qui a perdu sa tête, la touche d'époque (seulement après le 4-4) ramène Raymond au 19 septembre 1914.
   Ce jour-là, les obus allemands mettent le feu à l'échafaudage de la tour nord (vers 15 h), puis aux lits de paille
   préparés dans la nef pour les blessés allemands ; vers 15 h 30, la charpente — la « forêt » — s'embrase, le plomb
   de la toiture fond et coule en ruisseaux sous les voûtes et par les gargouilles ; des vitraux éclatent.
   Raymond faisait la sieste dans les combles avec deux camarades du colombier militaire : Flocon (un pigeon blanc)
   et Gaston. On vole, en serpentant : les combles vers l'est (à gauche), le dessous des voûtes vers l'ouest, la nef
   haute vers l'est, la nef basse vers l'ouest, jusqu'au grand portail, en bas à droite.
   Des morceaux de charpente tombent (un repère en haut de l'écran, gros ou petit) ; le plomb fondu goutte ; la paille
   brûle. Les deux camarades suivent la trace de Raymond : ce qui le manque de justesse peut les toucher.
   Les sauver tous les deux donne un succès. Dehors, on se retourne : la cathédrale brûle.
   ========================================================= */
const RF={W:4200,H:1560,
  lanes:[{y0:40,y1:340,dir:-1,sx:3960,sy:190},{y0:420,y1:760,dir:1,sx:200,sy:560},{y0:830,y1:1160,dir:-1,sx:3980,sy:980},{y0:1190,y1:1500,dir:1,sx:200,sy:1300}],
  solid:[[0,0,60,1560],[4140,0,60,1290],[0,0,4200,40],[300,340,3840,80],[60,760,3840,70],[300,1160,3840,30],[0,1500,4200,60]],
  door:[4080,1290,4200,1500],
  bay:300,
  // les feux qui ne bougent pas : [x, y, largeur, hauteur] (en bas : depuis le sol de la bande ; en haut : pendus aux poutres)
  fires:[[3400,250,70,90],[3000,40,60,110],[2600,230,80,110],[2150,40,70,120],[1750,240,70,100],[1300,40,60,120],[900,220,90,120],
         [3300,1380,150,120],[2700,1400,200,100],[2050,1360,160,140],[1400,1390,180,110],[800,1370,140,130]],
  // le plomb fondu : [x de la goutte, bande, phase]
  lead:[[700,1,0],[1250,1,1.2],[1900,1,.4],[2500,1,2],[3150,1,.9],[3650,1,1.6]],
  chand:[[3500,2],[2700,2],[1900,2],[1100,2]],
  straws:[[3700,120],[2800,300],[1960,140],[1050,300],[420,560],[1400,700],[2300,470],[3300,720],[3500,1000],[2500,880],[1500,1100],[700,950],[1000,1250],[2350,1260],[3000,1300],[3800,1440]]};
let RFS=null;
function rfActive(){return!!(RFS&&L&&L.fc)}
/* l'entrée : devant l'ange au sourire, sur le portail, la touche d'époque (si on la connaît) */
function rfCanStart(){const pc=P.x+P.w/2;return L.fc&&!P.dead&&P.onGround&&pc<560&&P.y+P.h<FC.G-40}
function rfStart(){if(!rfCanStart()||RFS)return;
  RFS={t:0,lane:0,x:0,y:0,vx:0,vy:0,f:-1,fph:0,dead:0,fade:1,flash:1,hist:[],mates:[{n:/*v2*/'Flocon',d:.3,alive:true,pal:{w0:'#d8d8d2',w1:'#e8e8e2',tail:'#e4e4de',tailT:'#c8c8c0',b0:'#f6f6f0',b1:'#dcdcd4',n0:'#ecece6',n1:'#f2f2ec',n2:'#e8e8e2',head:'#f4f4ee',bar:'#c0c0b8',tube:false}},
    {n:/*v2*/'Gaston',d:.62,alive:true,pal:{w0:'#4a5262',w1:'#5e6678',tail:'#6a7282',b0:'#8a93a4',b1:'#6a7282',n0:'#5a7aa0',n1:'#3f8a6a',n2:'#7a8394',head:'#7a8394',tube:false}}],
    beams:[],debris:[],beamT:2.2,said:{},cp:null,out:null,smoke:[],embers:[],grace:1.2};
  rfSpawn(0);RFS.cp={lane:0,alive:[true,true]};
  G.quip=null;G.quipQ=[];MUS_OLD=true;if(!L.rfLayer)L.rfLayer=rfBuild();
  if(!G.sim){noise(.9,900,.18,'bandpass',0,.6);SFX.thunder&&SFX.thunder(.5)}
  say(/*v2*/"Le 19 septembre 1914. Je faisais la sieste dans les combles avec Flocon et Gaston, des camarades du colombier militaire… et tout brûle ! Je vais mourir ici !",5)}
function rfSpawn(lane){const s=RFS,l=RF.lanes[lane];s.lane=lane;s.x=l.sx;s.y=l.sy;s.vx=0;s.vy=0;s.f=l.dir;s.hist=[];s.beams=[];s.debris=[];s.grace=1;
  for(let k=0;k<60;k++)s.hist.push({x:s.x-l.dir*k*4,y:s.y})}
function rfSolidAt(x,y,r){for(const[a,b,w,h]of RF.solid)if(x+r>a&&x-r<a+w&&y+r>b&&y-r<b+h)return[a,b,w,h];return null}
function rfLaneOf(y){for(let i=0;i<4;i++){const l=RF.lanes[i];if(y>=l.y0-20&&y<=l.y1+20)return i}return-1}
function rfCrash(why){const s=RFS;if(s.dead>0||s.out)return;if(S.god){return}
  s.dead=1.4;s.dvy=-120;if(!G.sim){noise(.4,600,.2,'lowpass');SFX.land&&SFX.land()}
  G.levelDeaths++;gotOf(G.li).d++;S.run.anyAccroc=true;save()}
function rfMateDie(m,why){if(!m.alive)return;m.alive=false;m.fall={x:m.x,y:m.y,vy:-60,t:0};
  if(!G.sim){noise(.3,500,.2,'lowpass');tone(330,.5,'sawtooth',.04,200)}say(/*v2*/'Nooon '+m.n+' !',2.6)}
function rfUpdate(dt){const s=RFS;s.t+=dt;s.fade=Math.max(0,s.fade-dt*1.2);s.flash=Math.max(0,s.flash-dt*1.4);
  if(s.out){s.out.t+=dt;if(s.out.t>7.5&&!s.out.done){s.out.done=1;rfLeave()}if(pressed.has('act')||pressed.has('jump')||pressed.has('ok'))if(s.out.t>2&&!s.out.done){s.out.done=1;rfLeave()}return}
  rfAmbient(dt);
  if(s.dead>0){s.dead-=dt;s.dvy+=900*dt;s.y+=s.dvy*dt;if(s.dead<=0){const cp=s.cp;rfSpawn(cp.lane);s.mates.forEach((m,i)=>{m.alive=cp.alive[i];m.fall=null});say(pick([/*v2*/"Non… pas comme ça. Je me souviens mieux que ça.",/*v2*/"Recommencer. Le feu ne m'a pas eu, ce jour-là."]),3)}return}
  if(pressed.has('restart')){rfCrash('r');return}
  // le vol : on va où l'on veut ; on descend un peu si l'on ne bat pas des ailes
  const Lk=keys.has('left'),Rk=keys.has('right'),up=keys.has('up')||keys.has('jump'),dn=keys.has('down');
  const tvx=Lk?-300:Rk?300:0,tvy=up?-260:dn?300:45;s.vx+=(tvx-s.vx)*Math.min(1,dt*5);s.vy+=(tvy-s.vy)*Math.min(1,dt*(up||dn?7:3));
  if(Math.abs(s.vx)>20)s.f=Math.sign(s.vx);s.fph+=dt*(up?22:dn?6:14);if(s.grace>0)s.grace-=dt;
  // la pierre ne tue pas : on y rebondit
  const nx=s.x+s.vx*dt;if(rfSolidAt(nx,s.y,12)){s.vx*=-.35}else s.x=nx;
  const ny=s.y+s.vy*dt;if(rfSolidAt(s.x,ny,12)){s.vy*=-.3}else s.y=ny;
  // la sortie : le grand portail
  if(s.x>RF.door[0]&&s.y>RF.door[1]){s.out={t:0};const both=s.mates.every(m=>m.alive);if(both)unlock('a73');if(!G.sim)SFX.medal&&SFX.medal();return}
  // le point de reprise : l'entrée de chaque bande
  const li=rfLaneOf(s.y);if(li>s.cp.lane){s.cp={lane:li,alive:s.mates.map(m=>m.alive)};if(!s.said['l'+li]&&!G.sim){s.said['l'+li]=1;say([null,/*v2*/"Sous les voûtes, le plomb du toit fond et coule. Ne pas passer dessous quand ça goutte !",/*v2*/"La nef. La fumée descend. Flocon, Gaston : restez derrière moi !",/*v2*/"La paille des blessés brûle par terre. Le portail est ouvert, tout au bout. Vite !"][li],4)}}
  // la trace : les camarades volent dans le sillage de Raymond, avec un temps de retard
  s.hist.unshift({x:s.x,y:s.y,t:s.t});if(s.hist.length>200)s.hist.pop();
  for(const m of s.mates){if(!m.alive){if(m.fall){m.fall.t+=dt;m.fall.vy+=800*dt;m.fall.y+=m.fall.vy*dt}continue}
    const tt=s.t-m.d;let p=s.hist[s.hist.length-1];for(const h of s.hist)if(h.t<=tt){p=h;break}m.x=p.x+Math.sin(s.t*3+m.d*9)*4;m.y=p.y+Math.cos(s.t*2.6+m.d*7)*5;m.f=s.f}
  // les feux, le plomb, les poutres qui tombent
  const hit=(x,y,r,box)=>x+r>box[0]&&x-r<box[0]+box[2]&&y+r>box[1]&&y-r<box[1]+box[3];
  if(s.grace<=0)for(const[x,y,w,h]of RF.fires){const fl=Math.sin(s.t*3+x)*8;if(hit(s.x,s.y,9,[x+6,y+(y<300&&y<60?0:12)-fl*.3,w-12,h-8]))return rfCrash('feu')}
  for(const[x,l,ph]of RF.lead){const on=((s.t+ph)%3.2)<1.1,L1=RF.lanes[l];if(!on)continue;const box=[x-5,L1.y0,10,L1.y1-L1.y0];if(s.grace<=0&&hit(s.x,s.y,8,box))return rfCrash('plomb');for(const m of s.mates)if(m.alive&&hit(m.x,m.y,7,box))rfMateDie(m,'plomb')}
  for(const c of RF.chand){const L1=RF.lanes[c[1]],sw=Math.sin(s.t*.9+c[0])*.25,cx=c[0]+Math.sin(sw)*190,cy=L1.y0+Math.cos(sw)*190;if(s.grace<=0&&Math.hypot(s.x-cx,s.y-cy)<34)return rfCrash('lustre')}
  s.beamT-=dt;if(s.beamT<=0&&s.beams.length<3){const l=RF.lanes[s.lane],big=rnd()<.4,lead=big?1.05:.8,xt=clamp(s.x+s.vx*(lead+.38)+(rnd()-.5)*60,90,4100);
    s.beams.push({x:xt,w:big?150:56,big,t:-lead,T:.4,y0:l.y0,y1:l.y1,rot:(rnd()-.5)*.5,lane:s.lane});s.beamT=1.1+rnd()*.8;if(!G.sim)tone(big?260:420,.5,'sine',.03,big?180:300)}
  for(const b of s.beams){b.t+=dt;if(b.t<0)continue;const u=Math.min(1,b.t/b.T),y=lerp(b.y0,b.y1-24,u*u),box=[b.x-b.w/2,y-12,b.w,26];
    if(u<1){if(s.grace<=0&&hit(s.x,s.y,10,box))return rfCrash('poutre');for(const m of s.mates)if(m.alive&&hit(m.x,m.y,8,box))rfMateDie(m,'poutre')}
    if(u>=1&&!b.landed){b.landed=1;s.debris.push({x:b.x,w:b.w,y:b.y1,t:0,big:b.big});if(!G.sim){noise(b.big?.5:.3,b.big?300:600,.2,'lowpass');G.shake=Math.max(G.shake||0,b.big?6:3)}for(let k=0;k<14;k++)s.embers.push({x:b.x+(rnd()-.5)*b.w,y:b.y1-10,vx:(rnd()-.5)*120,vy:-60-rnd()*160,t:0,max:1+rnd()})}}
  s.beams=s.beams.filter(b=>!b.landed);for(const d of s.debris)d.t+=dt;s.debris=s.debris.filter(d=>d.t<3);
  for(const d of s.debris){const box=[d.x-d.w/2,d.y-34,d.w,34];if(s.grace<=0&&hit(s.x,s.y,9,box))return rfCrash('braise')}
  // les pailles
  for(const k of L.corn)if(k.rf&&!k.taken&&Math.abs(k.x-s.x)<22&&Math.abs(k.y-s.y)<24){k.taken=true;G.corn++;{const gt=gotOf(G.li),ix=L.corn.indexOf(k);if(!gt.c.includes(ix))gt.c.push(ix)}save();if(!G.sim)SFX.straw()}}
function rfAmbient(dt){const s=RFS;for(const e of s.embers){e.t+=dt;e.vy+=-30*dt;e.x+=e.vx*dt;e.y+=e.vy*dt}s.embers=s.embers.filter(e=>e.t<e.max);
  if(s.embers.length<120&&rnd()<dt*40){const c=(s.cam&&s.cam.x)||0,cy=(s.cam&&s.cam.y)||0;s.embers.push({x:c+rnd()*W,y:cy+H+10,vx:(rnd()-.5)*40,vy:-50-rnd()*80,t:0,max:3+rnd()*3})}}
function rfLeave(){const s=RFS;RFS=null;MUS_OLD=false;G.fade=1;
  const n=s.mates.filter(m=>m.alive).length;say(n===2?/*v2*/"On est sortis tous les trois. Derrière nous, la cathédrale brûlait comme une forge. Je ne l'ai jamais oubliée.":n===1?/*v2*/"On est sortis à deux. Derrière nous, la cathédrale brûlait. Je pense encore à celui qui est resté dedans.":/*v2*/"Je suis sorti seul. Derrière moi, la cathédrale brûlait, et mes camarades avec.",5)}

/* ---------- le décor (en cache) : la nef, les voûtes, la charpente, le portail ---------- */
function rfBuild(){const TR=Math.min(RS,1),{layer:c,g}=mkLayer(RF.W*TR,RF.H*TR);g.scale(TR,TR);c.rs=TR;const R=mulberry(1914),B=RF.bay;
  // la pierre, chaude de l'incendie
  const st=g.createLinearGradient(0,0,0,RF.H);st.addColorStop(0,'#2a1810');st.addColorStop(.3,'#4a3428');st.addColorStop(1,'#5a4434');g.fillStyle=st;g.fillRect(0,0,RF.W,RF.H);
  // la nef basse (bandes 3 et 4) : grandes arcades, piles à colonnettes, chapiteaux à feuillages, les bas-côtés sombres derrière
  for(let x=60;x<4140;x+=B){const ax=x+40,aw=B-80,top=900,bot=1500;
    g.fillStyle='#1e140e';g.beginPath();g.moveTo(ax,bot);g.lineTo(ax,top+90);g.quadraticCurveTo(ax,top,ax+aw/2,top-40);g.quadraticCurveTo(ax+aw,top,ax+aw,top+90);g.lineTo(ax+aw,bot);g.fill();
    g.fillStyle='rgba(120,150,200,.18)';rr(g,ax+aw/2-20,top+60,40,90,18);g.fill();
    g.fillStyle='#6a5444';g.fillRect(x-6,top-60,52,bot-top+60);for(const dx of[0,14,28,40])g.fillStyle=dx%28?'#7a6450':'#5e4a3a',g.fillRect(x-6+dx,top-60,8,bot-top+60);
    g.fillStyle='#8a7258';g.fillRect(x-14,top-74,68,16);for(let k=0;k<5;k++){g.fillStyle='#6a7a3a';g.beginPath();g.arc(x-6+k*13,top-66,6,0,7);g.fill()}
    g.strokeStyle='#7a6450';g.lineWidth=6;g.beginPath();g.moveTo(ax,top+90);g.quadraticCurveTo(ax,top,ax+aw/2,top-40);g.quadraticCurveTo(ax+aw,top,ax+aw,top+90);g.stroke()}
  // le triforium : petites arcatures, balustrade (bande pleine 760-830)
  g.fillStyle='#6e5846';g.fillRect(60,760,4080,70);for(let x=70;x<4140;x+=36){g.fillStyle='#2a1c14';g.beginPath();g.moveTo(x+6,826);g.lineTo(x+6,792);g.quadraticCurveTo(x+18,776,x+30,792);g.lineTo(x+30,826);g.fill()}
  g.fillStyle='#8a7258';g.fillRect(60,760,4080,8);g.fillRect(60,826,4080,6);
  // les fenêtres hautes (bande 2) : lancettes et petites roses, vitraux bleus et rouges
  for(let x=60;x<4140;x+=B){const cx=x+B/2;g.fillStyle='#6a5444';g.fillRect(x-6,420,48,340);
    for(const dx of[-46,6]){const wx=cx+dx,wy=500;g.fillStyle='#1a1430';rr(g,wx,wy,40,220,20);g.fill();for(let k=0;k<20;k++){g.fillStyle=['#2a4ab0','#b02a3a','#d8a020','#2a8a5a','#6a3aa0'][Math.floor(R()*5)];g.globalAlpha=.75;g.fillRect(wx+4+(k%3)*12,wy+14+(k/3|0)*28,10,24)}g.globalAlpha=1;g.strokeStyle='#4a3a2c';g.lineWidth=3;rr(g,wx,wy,40,220,20);g.stroke()}
    g.fillStyle='#2a1c30';g.beginPath();g.arc(cx-2,462,26,0,7);g.fill();for(let k=0;k<8;k++){g.fillStyle=['#2a4ab0','#b02a3a','#d8a020'][k%3];g.globalAlpha=.7;g.beginPath();g.moveTo(cx-2,462);g.arc(cx-2,462,22,k*.785,k*.785+.6);g.fill()}g.globalAlpha=1}
  // les voûtes vues d'en dessous (bande 340-420 : pleine) : ogives, clés de voûte
  g.fillStyle='#5a4636';g.fillRect(300,340,3840,80);for(let x=60;x<4140;x+=B){g.strokeStyle='#8a7258';g.lineWidth=5;g.beginPath();g.moveTo(x,430);g.quadraticCurveTo(x+B/2,330,x+B,430);g.stroke();g.fillStyle='#a88a60';g.beginPath();g.arc(x+B/2,382,7,0,7);g.fill()}
  // le trou brûlé à gauche, par lequel on descend
  g.fillStyle='#1a0c06';g.beginPath();g.ellipse(180,380,120,40,0,0,7);g.fill();g.fillStyle='#8a3a10';g.beginPath();g.ellipse(180,380,120,40,0,0,7);g.lineWidth=4;g.strokeStyle='#c86020';g.stroke();
  // les combles : la « forêt » de chêne — fermes, entraits, poinçons, chevrons, pannes ; les extrados des voûtes en bosses
  g.fillStyle='#120a06';g.fillRect(60,40,4080,300);
  for(let x=60;x<4140;x+=B)g.fillStyle='#4a3a2c',g.beginPath(),g.moveTo(x,340),g.quadraticCurveTo(x+B/2,280,x+B,340),g.fill();
  for(let x=90;x<4140;x+=150){g.strokeStyle='#3a2414';g.lineWidth=9;g.beginPath();g.moveTo(x-80,330);g.lineTo(x,44);g.lineTo(x+80,330);g.stroke();g.lineWidth=7;g.beginPath();g.moveTo(x-60,250);g.lineTo(x+60,250);g.moveTo(x,44);g.lineTo(x,250);g.moveTo(x,170);g.lineTo(x-40,250);g.moveTo(x,170);g.lineTo(x+40,250);g.stroke()}
  g.strokeStyle='#2e1c10';g.lineWidth=6;for(const y of[110,190,270]){g.beginPath();g.moveTo(60,y);g.lineTo(4140,y);g.stroke()}
  // la nef : le dallage, les lits de paille des blessés, les chaises renversées
  g.fillStyle='#6a5a48';g.fillRect(60,1500,4080,60);for(let x=60;x<4140;x+=60){g.fillStyle='rgba(0,0,0,.18)';g.fillRect(x,1500,2,60)}
  for(let x=200;x<4000;x+=130){g.fillStyle='#c8a040';rr(g,x,1478,100,22,6);g.fill();g.fillStyle='#a88030';for(let k=0;k<10;k++)g.fillRect(x+6+k*9,1480+(k%3)*4,8,2)}
  for(let x=260;x<4000;x+=230){g.fillStyle='#3a2414';g.save();g.translate(x,1500);g.rotate((R()-.5)*1.4);g.fillRect(-14,-30,28,5);g.fillRect(-12,-30,4,30);g.fillRect(8,-30,4,30);g.fillRect(-12,-56,4,26);g.restore()}
  // l'échafaudage intérieur (bande 1160-1190 : planches, perches jusqu'au sol)
  for(let x=320;x<4140;x+=120){g.fillStyle='#4a3420';g.fillRect(x,1160,8,340)}g.fillStyle='#7a5a36';g.fillRect(300,1160,3840,14);g.fillStyle='#5a4028';g.fillRect(300,1174,3840,16);for(let x=300;x<4140;x+=90){g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x,1160,2,30)}
  // le chœur, à gauche : l'autel, les cierges
  g.fillStyle='#8a7058';g.fillRect(80,1430,140,70);g.fillStyle='#e8dcc0';g.fillRect(84,1434,132,10);for(const x of[100,140,180,200])g.fillStyle='#f0e8d0',g.fillRect(x,1400,5,30);
  // le revers de la façade, à droite : la grande rose (bande 2-3), le grand portail ouvert (en bas)
  {const cx=3990,cy=640,r=130;g.fillStyle='#1a1028';g.beginPath();g.arc(cx,cy,r,0,7);g.fill();for(let k=0;k<24;k++){g.fillStyle=['#2a4ab0','#b02a3a','#d8a020','#2a8a5a','#6a3aa0','#3a6ac8'][k%6];g.globalAlpha=.8;g.beginPath();g.moveTo(cx,cy);g.arc(cx,cy,r-8,k*Math.PI/12,(k+.8)*Math.PI/12);g.fill()}g.globalAlpha=1;
   g.strokeStyle='#8a7258';g.lineWidth=6;g.beginPath();g.arc(cx,cy,r,0,7);g.stroke();g.beginPath();g.arc(cx,cy,40,0,7);g.stroke();for(let k=0;k<12;k++){g.beginPath();g.moveTo(cx+Math.cos(k*.5236)*40,cy+Math.sin(k*.5236)*40);g.lineTo(cx+Math.cos(k*.5236)*r,cy+Math.sin(k*.5236)*r);g.stroke()}}
  {const[x0,y0]=RF.door;g.fillStyle='#e8a050';g.fillRect(x0+60,y0,60,210);g.fillStyle='#5a3418';g.fillRect(x0,y0,60,210);g.fillStyle='#4a2810';for(let y=y0+20;y<1500;y+=40)g.fillRect(x0+6,y,48,4);
   g.strokeStyle='#8a7258';g.lineWidth=8;g.beginPath();g.moveTo(x0,1500);g.lineTo(x0,y0+60);g.quadraticCurveTo(x0+60,y0-30,x0+120,y0+60);g.stroke()}
  return c}

/* ---------- dessin ---------- */
function rfRender(t){const s=RFS,g=ctx;
  if(s.out){rfOutro(g,t,s);return}
  const tx=clamp(s.x-W/2+s.f*90,0,RF.W-W),ty=clamp(s.y-H*.5,0,RF.H-H);s.cam=s.cam||{x:tx,y:ty};const k=Math.min(1,G.dtLast*5||.1);s.cam.x+=(tx-s.cam.x)*k;s.cam.y+=(ty-s.cam.y)*k;
  const cx=Math.round(s.cam.x+(rnd()-.5)*(G.shake||0)),cy=Math.round(s.cam.y+(rnd()-.5)*(G.shake||0));G.shake=Math.max(0,(G.shake||0)-G.dtLast*12);
  g.fillStyle='#0a0604';g.fillRect(0,0,W,H);const ly=L.rfLayer;if(ly){const tr=ly.rs||1;blitLayer(g,ly,cx*tr,cy*tr,W*tr,H*tr,0,0,W,H)}
  g.save();g.translate(-cx,-cy);
  // la lumière de l'incendie, qui palpite
  g.globalCompositeOperation='lighter';
  for(const[x,y,w,h]of RF.fires){if(x<cx-200||x>cx+W+200)continue;const gl=g.createRadialGradient(x+w/2,y+h/2,10,x+w/2,y+h/2,220);gl.addColorStop(0,'rgba(255,140,40,'+(.35+Math.sin(t*7+x)*.08)+')');gl.addColorStop(1,'rgba(255,90,20,0)');g.fillStyle=gl;g.fillRect(x-200,y-200,w+400,h+400)}
  g.globalCompositeOperation='source-over';
  // les feux
  for(const[x,y,w,h]of RF.fires){if(x<cx-120||x>cx+W+120)continue;rfFlame(g,x,y,w,h,t,y<300&&y<60)}
  // le plomb fondu
  for(const[x,l,ph]of RF.lead){if(x<cx-50||x>cx+W+50)continue;const L1=RF.lanes[l],u=((t+ph)%3.2);g.fillStyle='#c8ccd2';
    if(u<1.1){const k2=Math.min(1,u*4);g.globalAlpha=.9;g.fillRect(x-3,L1.y0,6,(L1.y1-L1.y0)*k2);g.fillStyle='#f0f4f8';g.fillRect(x-1,L1.y0,2,(L1.y1-L1.y0)*k2);g.globalAlpha=1;g.fillStyle='rgba(220,225,232,.6)';g.beginPath();g.ellipse(x,L1.y1,18*k2,4,0,0,7);g.fill()}
    else if(u>2.4){const k2=(u-2.4)/.8;g.fillStyle='rgba(230,235,240,'+(.3+k2*.6)+')';g.beginPath();g.ellipse(x,L1.y0+4,4+k2*4,3+k2*5,0,0,7);g.fill()}}
  // les lustres qui se balancent
  for(const c of RF.chand){const L1=RF.lanes[c[1]],sw=Math.sin(t*.9+c[0])*.25,px=c[0],py=L1.y0-6,ex=px+Math.sin(sw)*190,ey=py+Math.cos(sw)*190;if(ex<cx-200||ex>cx+W+200)continue;
    g.strokeStyle='#2a2018';g.lineWidth=2;g.beginPath();g.moveTo(px,py);g.lineTo(ex,ey-20);g.stroke();g.fillStyle='#c8a050';g.beginPath();g.ellipse(ex,ey,30,9,0,0,7);g.fill();g.strokeStyle='#a88030';g.lineWidth=3;g.beginPath();g.moveTo(ex-28,ey);g.quadraticCurveTo(ex,ey+30,ex+28,ey);g.stroke();
    for(let k=-2;k<=2;k++){g.fillStyle='#f0e8d0';g.fillRect(ex+k*12-2,ey-14,4,10);rfFlame(g,ex+k*12-5,ey-28,10,16,t+k,false)}}
  // les pailles
  for(const k of L.corn)if(k.rf&&!k.taken&&k.x>cx-40&&k.x<cx+W+40)drawTuft(g,k.x,k.y,t+k.ph);
  // les poutres qui tombent, les braises au sol
  for(const b of s.beams){if(b.t<0)continue;const u=Math.min(1,b.t/b.T),y=lerp(b.y0,b.y1-24,u*u);rfBeam(g,b.x,y,b.w,b.rot*u,t,true)}
  for(const d of s.debris){rfBeam(g,d.x,d.y-12,d.w,.06,t,false);rfFlame(g,d.x-d.w/2+6,d.y-34,d.w-12,34*(1-d.t/3),t,false)}
  // les camarades, Raymond
  for(const m of s.mates){if(m.alive)vxPigeon(g,m.x,m.y,1,m.f,t+m.d*3,{pal:m.pal});else if(m.fall&&m.fall.t<2)vxPigeon(g,m.fall.x,m.fall.y,1,1,t,{pal:Object.assign({},m.pal,{b0:'#3a3430',b1:'#2a2420',w0:'#2a2420',w1:'#3a3430',head:'#3a3430'}),rot:m.fall.t*6,fold:1,closed:1})}
  if(s.dead>0)vxPigeon(g,s.x,s.y,1,s.f,t,{rot:(1.4-s.dead)*8,fold:1,closed:1});else vxPigeon(g,s.x,s.y,1.05,s.f,s.fph/14,{flap:s.fph});
  for(const m of s.mates)if(m.alive&&m.x>cx&&m.x<cx+W){g.fillStyle='rgba(240,230,210,.6)';g.font='italic 11px '+F_BODY;g.textAlign='center';g.fillText(m.n,m.x,m.y-20)}
  // les braises qui montent, la fumée
  for(const e of s.embers){const a=1-e.t/e.max;g.fillStyle='rgba(255,'+(140+(e.x*7%80|0))+',40,'+a+')';g.fillRect(e.x,e.y,2.4,2.4)}
  g.restore();
  for(let k=0;k<6;k++){const x=((k*260-t*30-cx*.3)%(W+400)+W+400)%(W+400)-200,y=30+k*20+Math.sin(t*.4+k)*20;g.fillStyle='rgba(30,22,18,.35)';g.beginPath();g.ellipse(x,y,240,60,0,0,7);g.fill()}
  // les repères en haut de l'écran : une poutre va tomber (gros repère : gros morceau)
  for(const b of s.beams){if(b.t>=0)continue;const sx=b.x-cx;if(sx<-60||sx>W+60)continue;const bl=Math.sin(t*18)>0,sz=b.big?22:13,yy=34;
    g.fillStyle=bl?'#ff7020':'#ffd060';g.beginPath();g.moveTo(sx,yy+sz);g.lineTo(sx-sz*.9,yy-sz*.4);g.lineTo(sx+sz*.9,yy-sz*.4);g.closePath();g.fill();g.fillStyle='#2a1008';g.font='bold '+(b.big?18:12)+'px '+F_DISP;g.textAlign='center';g.fillText('!',sx,yy+(b.big?4:2));
    g.strokeStyle='rgba(255,180,80,.35)';g.lineWidth=b.big?3:2;g.setLineDash([6,6]);g.beginPath();g.moveTo(sx-b.w/2,yy+sz+4);g.lineTo(sx+b.w/2,yy+sz+4);g.stroke();g.setLineDash([])}
  // le vignettage, la date
  const vg=g.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,H*.85);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(20,6,0,.6)');g.fillStyle=vg;g.fillRect(0,0,W,H);
  g.globalAlpha=.65;g.fillStyle='#efe5cc';g.font='italic 15px '+F_BODY;g.textAlign='left';g.fillText(/*v2*/'Reims · 19 septembre 1914',20,H-20);g.globalAlpha=1;
  // les camarades encore là
  s.mates.forEach((m,i)=>{g.fillStyle=m.alive?'rgba(240,232,210,.85)':'rgba(240,232,210,.3)';g.font='13px '+F_BODY;g.textAlign='right';g.fillText((m.alive?'':'✝ ')+m.n,W-20,H-38+i*18)});
  drawQuip(66);
  const f=Math.max(s.fade,s.flash*.85);if(f>0){g.fillStyle='rgba(255,236,210,'+f+')';g.fillRect(0,0,W,H)}}
function rfFlame(g,x,y,w,h,t,hang){const n=Math.max(2,Math.floor(w/14));for(let k=0;k<n;k++){const fx=x+(k+.5)*w/n,ph=t*9+k*1.7+x*.01,hh=h*(.7+.3*Math.sin(ph)),ww=w/n*.9;
    for(const[c,s]of[['rgba(200,60,10,.85)',1],['rgba(255,150,30,.9)',.72],['rgba(255,236,150,.95)',.4]]){g.fillStyle=c;g.beginPath();
      if(hang){g.moveTo(fx-ww*s,y);g.quadraticCurveTo(fx-ww*s*.6+Math.sin(ph)*4,y+hh*s*.6,fx+Math.sin(ph*1.3)*5,y+hh*s);g.quadraticCurveTo(fx+ww*s*.6,y+hh*s*.6,fx+ww*s,y)}
      else{const b=y+h;g.moveTo(fx-ww*s,b);g.quadraticCurveTo(fx-ww*s*.6+Math.sin(ph)*4,b-hh*s*.6,fx+Math.sin(ph*1.3)*5,b-hh*s);g.quadraticCurveTo(fx+ww*s*.6,b-hh*s*.6,fx+ww*s,b)}g.fill()}}}
function rfBeam(g,x,y,w,rot,t,falling){g.save();g.translate(x,y);g.rotate(rot);g.fillStyle='#3a2414';g.fillRect(-w/2,-12,w,24);g.fillStyle='#5a3820';g.fillRect(-w/2,-12,w,6);
  g.fillStyle='#1a0c06';for(let k=-w/2+8;k<w/2-8;k+=18)g.fillRect(k,-4,10,3);g.fillStyle='rgba(255,120,30,.8)';g.fillRect(-w/2,8,w,4);
  if(falling)rfFlame(g,-w/2+4,-40,w-8,28,t,false);g.restore()}
/* la sortie : on se retourne, la cathédrale brûle (d'après les photographies et les cartes postales de septembre 1914) */
function rfOutro(g,t,s){const u=s.out.t;
  const sk=g.createLinearGradient(0,0,0,H);sk.addColorStop(0,'#2a3a5a');sk.addColorStop(.5,'#8a6a5a');sk.addColorStop(1,'#d8905a');g.fillStyle=sk;g.fillRect(0,0,W,H);
  // la fumée
  for(let k=0;k<9;k++){const x=180+k*80+Math.sin(t*.3+k)*20,y=200-k*14-u*6;g.fillStyle='rgba(70,56,52,'+(.5-k*.03)+')';g.beginPath();g.ellipse(x,y,140,70,0,0,7);g.fill()}
  // la cathédrale, de flanc : la nef et ses arcs-boutants, les pinacles, les fenêtres hautes ; le toit en flammes ; les deux tours, la nord sous son échafaudage
  const by=470,stone='#5a4a42',dk='#3a2e28',lt='#7a665a';
  g.fillStyle=dk;g.fillRect(120,330,520,140);
  for(let x=130;x<640;x+=52){// contreforts, arcs-boutants, pinacles
    g.fillStyle=stone;g.fillRect(x-10,300,20,170);g.strokeStyle=stone;g.lineWidth=7;g.beginPath();g.moveTo(x,330);g.quadraticCurveTo(x+18,276,x+30,262);g.stroke();
    g.fillStyle=lt;poly(g,[x-10,300,x,236,x+10,300]);g.fill();g.fillStyle=stone;for(const k of[-6,6]){poly(g,[x+k-3,300,x+k,280,x+k+3,300]);g.fill()}
    g.fillStyle='#1e1614';rr(g,x+12,346,16,60,8);g.fill();g.fillStyle='rgba(255,150,60,.55)';rr(g,x+14,350,12,52,6);g.fill()}
  g.fillStyle=stone;g.fillRect(150,262,480,10);for(let x=150;x<630;x+=12){g.fillStyle=lt;g.fillRect(x,256,6,8)}
  g.fillStyle='#2a201c';poly(g,[146,262,170,210,610,210,634,262]);g.fill();
  for(let x=160;x<630;x+=7){const h=46+Math.sin(t*8+x)*18+((x*7)%34);g.fillStyle=x%14?'#ff8a20':'#ffd060';g.beginPath();g.moveTo(x-6,216);g.quadraticCurveTo(x-2,216-h*.6,x+1,216-h);g.quadraticCurveTo(x+4,216-h*.6,x+8,216);g.fill()}
  g.fillStyle='rgba(255,140,40,.12)';g.beginPath();g.ellipse(390,190,300,90,0,0,7);g.fill();
  // le chevet, à gauche
  g.fillStyle=dk;g.beginPath();g.moveTo(120,470);g.lineTo(120,330);g.quadraticCurveTo(70,340,60,400);g.lineTo(60,470);g.fill();
  // la façade : deux tours, la rose, les portails ; l'échafaudage de la tour nord brûle
  for(const[x0,sc]of[[650,1],[790,1]]){g.fillStyle=stone;g.fillRect(x0,120,120,350);g.fillStyle=lt;g.fillRect(x0,120,120,6);
    for(let k=0;k<4;k++){const cx=x0+16+k*30;poly(g,[cx-6,120,cx,96,cx+6,120]);g.fill()}
    for(const y of[150,250]){for(const dx of[16,64]){g.fillStyle='#1e1614';rr(g,x0+dx,y,36,80,18);g.fill();g.strokeStyle=lt;g.lineWidth=2;g.beginPath();g.moveTo(x0+dx+18,y);g.lineTo(x0+dx+18,y+80);g.stroke()}}}
  g.fillStyle=stone;g.fillRect(770,230,20,240);g.fillStyle='#1a1028';g.beginPath();g.arc(780,330,0,0,7);g.fill();
  g.fillStyle='#241a2a';g.beginPath();g.arc(720,350,0,0,7);g.fill();
  for(const x0 of[662,720,802]){g.fillStyle='#2a1c18';g.beginPath();g.moveTo(x0,470);g.lineTo(x0,420);g.quadraticCurveTo(x0+24,386,x0+48,420);g.lineTo(x0+48,470);g.fill();g.fillStyle='rgba(255,140,50,.6)';g.fillRect(x0+8,430,32,40)}
  g.strokeStyle='#6a5444';g.lineWidth=3;for(let y=130;y<320;y+=26){g.beginPath();g.moveTo(644,y);g.lineTo(776,y);g.stroke()}for(const x of[644,676,710,744,776]){g.beginPath();g.moveTo(x,110);g.lineTo(x,320);g.stroke()}
  for(let x=646;x<776;x+=9){const h=26+Math.sin(t*9+x)*10+((x*5)%14);g.fillStyle=x%18?'#ff9a30':'#ffe080';g.beginPath();g.moveTo(x-5,140);g.quadraticCurveTo(x,140-h,x+5,140);g.fill();g.beginPath();g.moveTo(x-4,250);g.quadraticCurveTo(x,250-h*.7,x+4,250);g.fill()}
  // le plomb fondu qui coule par les gargouilles
  for(let x=170;x<620;x+=104){const u2=((t*.8+x*.01)%1);g.fillStyle='rgba(220,226,232,.8)';g.fillRect(x+30,264,3,u2*60);g.beginPath();g.arc(x+31,264+u2*60,3,0,7);g.fill()}
  g.fillStyle='#2a2420';g.fillRect(0,by,W,H-by);for(let x=0;x<W;x+=60){g.fillStyle='#1e1a16';poly(g,[x,by,x+30,by-26-(x%90)*.6,x+60,by]);g.fill()}
  // les pigeons qui s'éloignent
  const n=1+s.mates.filter(m=>m.alive).length;for(let i=0;i<n;i++){const k=Math.min(1,u/6),x=lerp(830,150,k)+i*40,y=lerp(430,90,k)+i*22+Math.sin(t*3+i)*6;vxPigeon(g,x,y,1.5-k*.7,-1,t+i,i===0?{}:{pal:s.mates.filter(m=>m.alive)[i-1].pal})}
  g.globalAlpha=.7;g.fillStyle='#efe5cc';g.font='italic 15px '+F_BODY;g.textAlign='left';g.fillText(/*v2*/'Reims · 19 septembre 1914, le soir',20,H-20);g.globalAlpha=1;
  const f=u<1?1-u:u>6.6?(u-6.6)/.9:0;if(f>0){g.fillStyle='rgba(11,10,12,'+f+')';g.fillRect(0,0,W,H)}}
