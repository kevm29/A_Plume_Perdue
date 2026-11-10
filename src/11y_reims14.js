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
  fires:[[3300,680,80,80],[2250,690,90,70],[1150,680,80,80],[3400,250,70,90],[3000,40,60,110],[2600,230,80,110],[2150,40,70,120],[1750,240,70,100],[1300,40,60,120],[900,220,90,120],
         [3000,1080,90,80],[2250,1070,100,90],[1550,1085,80,75],[950,1075,90,85],
         [3300,1380,150,120],[2700,1400,200,100],[2050,1360,160,140],[1400,1390,180,110],[800,1370,140,130]],
  // le plomb fondu : [x de la goutte, bande, phase]
  chand:[[3500,2],[2700,2],[1900,2],[1100,2]],
  straws:[[3700,120],[2800,300],[1960,140],[1050,300],[420,560],[1400,700],[2300,470],[3000,600],[3200,960],[2500,880],[1500,1100],[700,950],[1000,1250],[2350,1260],[3000,1300],[3800,1440]]};
let RFS=null;
function rfActive(){return!!(RFS&&L&&L.fc)}
/* l'entrée : devant l'ange au sourire, sur le portail, la touche d'époque (si on la connaît) */
function rfCanStart(){const pc=P.x+P.w/2;return L.fc&&!P.dead&&P.onGround&&Math.abs(pc-FC.AX)<64&&Math.abs(P.y+P.h-fcY(43))<6}
function rfStart(){if(!rfCanStart()||RFS||G.state!=='play')return;G.state='intro';G.cards=RF_CARDS_IN;G.card=0;G.cardT=0;G.fade=1;G.cardsDone=()=>{G.state='play';rfBegin()}}
function rfBegin(){achB('reims');
  RFS={t:0,lane:0,x:0,y:0,vx:0,vy:0,f:-1,fph:0,dead:0,fade:1,flash:1,hist:[],mates:[{n:/*v2*/'Flocon',d:.3,alive:true,pal:{w0:'#d8d8d2',w1:'#e8e8e2',tail:'#e4e4de',tailT:'#c8c8c0',b0:'#f6f6f0',b1:'#dcdcd4',n0:'#ecece6',n1:'#f2f2ec',n2:'#e8e8e2',head:'#f4f4ee',bar:'#c0c0b8',tube:false}},
    {n:/*v2*/'Gaston',d:.62,alive:true,pal:{w0:'#4a5262',w1:'#5e6678',tail:'#6a7282',b0:'#8a93a4',b1:'#6a7282',n0:'#5a7aa0',n1:'#3f8a6a',n2:'#7a8394',head:'#7a8394',tube:false}}],
    beams:[],debris:[],beamT:4,said:{},cp:null,out:null,smoke:[],embers:[],grace:1.2,col:null};
  rfSpawn(0);RFS.cp={lane:0,alive:[true,true]};
  G.quip=null;G.quipQ=[];MUS_OLD=true;if(!L.rfLayer)L.rfLayer=rfBuild();
  if(!G.sim){noise(.9,900,.18,'bandpass',0,.6);SFX.thunder&&SFX.thunder(.5)}
  say(/*v2*/"Le 19 septembre 1914. Je faisais la sieste dans les combles avec Flocon et Gaston, des camarades du colombier militaire… et tout brûle ! Je vais mourir ici !",5)}
function rfSpawn(lane){const s=RFS,l=RF.lanes[lane];s.lane=lane;s.x=l.sx;s.y=l.sy;s.vx=0;s.vy=0;s.f=l.dir;s.hist=[];s.beams=[];s.debris=[];s.grace=1;s.beamT=lane?2.4:4;s.col=null;
  for(let k=0;k<60;k++)s.hist.push({x:s.x-l.dir*k*4,y:s.y})}
/* les effondrements : le plancher de l'étage d'au-dessus (voûte, triforium, poutres) s'ouvre ; les poutres du toit passent par les trous */
/* la poutre arrive déjà lancée : elle vient du toit, traverse les étages du dessus (sans rien casser) et tombe dans celui de Raymond */
function rfBeamY(b){const D=b.y1-24-b.y0,v0=D*.4/b.T;if(b.t<0)return b.y0+v0*b.t;const u=Math.min(1,b.t/b.T);return b.y0+D*(.4*u+.6*u*u)}
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
  const li=rfLaneOf(s.y);if(li>s.cp.lane){s.lane=li;s.beamT=Math.max(s.beamT,1.6);s.cp={lane:li,alive:s.mates.map(m=>m.alive)};if(!s.said['l'+li]&&!G.sim){s.said['l'+li]=1;say([null,/*v2*/"Sous les voûtes. Les poutres du toit tombent à travers tous les étages, jusqu'ici !",/*v2*/"La nef. La fumée descend. Flocon, Gaston : restez derrière moi !",/*v2*/"La paille des blessés brûle par terre. Le portail est ouvert, tout au bout. Vite !"][li],4)}}
  // la trace : les camarades volent dans le sillage de Raymond, avec un temps de retard
  s.hist.unshift({x:s.x,y:s.y,t:s.t});if(s.hist.length>200)s.hist.pop();
  for(const m of s.mates){if(!m.alive){if(m.fall){m.fall.t+=dt;m.fall.vy+=800*dt;m.fall.y+=m.fall.vy*dt}continue}
    const tt=s.t-m.d;let p=s.hist[s.hist.length-1];for(const h of s.hist)if(h.t<=tt){p=h;break}m.x=p.x+Math.sin(s.t*3+m.d*9)*4;m.y=p.y+Math.cos(s.t*2.6+m.d*7)*5;m.f=s.f}
  // les feux, le plomb, les poutres qui tombent
  const hit=(x,y,r,box)=>x+r>box[0]&&x-r<box[0]+box[2]&&y+r>box[1]&&y-r<box[1]+box[3];
  if(s.grace<=0)for(const[x,y,w,h]of RF.fires){const fl=Math.sin(s.t*3+x)*8;if(hit(s.x,s.y,9,[x+6,y+(y<300&&y<60?0:12)-fl*.3,w-12,h-8]))return rfCrash('feu')}
  for(const c of RF.chand){const L1=RF.lanes[c[1]],sw=Math.sin(s.t*.9+c[0])*.25,cx=c[0]+Math.sin(sw)*190,cy=L1.y0-6+Math.cos(sw)*190;if(s.grace<=0&&Math.abs(s.x-cx)<30+8&&s.y>cy-30-6&&s.y<cy+16+6)return rfCrash('lustre')}
  s.beamT-=dt;if(s.beamT<=0&&s.beams.length<3){const l=RF.lanes[s.lane],big=rnd()<.4,lead=big?1.55:1.3,xt=clamp(s.x+s.vx*(lead+.38)+(rnd()-.5)*60,90,4100);
    if(Math.abs(xt-l.sx)>320||s.cp.lane!==s.lane)s.beams.push({x:xt,w:big?122:56,big,t:-lead,T:.4/.9,y0:l.y0,y1:l.y1,rot:(rnd()-.5)*.5,lane:s.lane});s.beamT=1.1+rnd()*.8;if(!G.sim)tone(big?260:420,.5,'sine',.03,big?180:300)}
  for(const b of s.beams){b.t+=dt;if(b.t<0)continue;const u=Math.min(1,b.t/b.T),y=rfBeamY(b),box=[b.x-b.w/2,y-12,b.w,26];
    if(u<1){if(s.grace<=0&&hit(s.x,s.y,10,box))return rfCrash('poutre');if(!b.col)for(const m of s.mates)if(m.alive&&hit(m.x,m.y,8,box))rfMateDie(m,'poutre')}
    if(u>=1&&!b.landed){b.landed=1;s.debris.push({x:b.x,w:b.w,y:b.y1,t:0,big:b.big});if(!G.sim){noise(b.big?.5:.3,b.big?300:600,.2,'lowpass');G.shake=Math.max(G.shake||0,b.big?6:3)}for(let k=0;k<14;k++)s.embers.push({x:b.x+(rnd()-.5)*b.w,y:b.y1-10,vx:(rnd()-.5)*120,vy:-60-rnd()*160,t:0,max:1+rnd()})}}
  s.beams=s.beams.filter(b=>!b.landed);for(const d of s.debris)d.t+=dt;s.debris=s.debris.filter(d=>d.t<3);
  for(const d of s.debris){const box=[d.x-d.w/2,d.y-34,d.w,34];if(s.grace<=0&&hit(s.x,s.y,9,box))return rfCrash('braise')}
  // les pailles
  for(const k of L.corn)if(k.rf&&!k.taken&&Math.abs(k.x-s.x)<22&&Math.abs(k.y-s.y)<24){k.taken=true;G.corn++;{const gt=gotOf(G.li),ix=L.corn.indexOf(k);if(!gt.c.includes(ix))gt.c.push(ix)}save();if(!G.sim)SFX.straw()}}
function rfAmbient(dt){const s=RFS;for(const e of s.embers){e.t+=dt;e.vy+=-30*dt;e.x+=e.vx*dt;e.y+=e.vy*dt}s.embers=s.embers.filter(e=>e.t<e.max);
  if(s.embers.length<120&&rnd()<dt*40){const c=(s.cam&&s.cam.x)||0,cy=(s.cam&&s.cam.y)||0;s.embers.push({x:c+rnd()*W,y:cy+H+10,vx:(rnd()-.5)*40,vy:-50-rnd()*80,t:0,max:3+rnd()*3})}}
function rfLeave(){const s=RFS;RFS=null;MUS_OLD=false;
  const n=s.mates.filter(m=>m.alive).length,line=n===2?/*v2*/"On est sortis tous les trois. Derrière nous, la cathédrale brûlait comme une forge. Je ne l'ai jamais oubliée.":n===1?/*v2*/"On est sortis à deux. Derrière nous, la cathédrale brûlait. Je pense encore à celui qui est resté dedans.":/*v2*/"Je suis sorti seul. Derrière moi, la cathédrale brûlait, et mes camarades avec.";
  G.state='intro';G.cards=RF_CARDS_OUT.concat([{t:rfOutCard(s.mates),minT:1.2}]);G.card=0;G.cardT=0;G.fade=1;G.cardsDone=()=>{G.state='play';G.fade=1;say(line,5)}}
const RF_CARDS_IN=[
  {t:/*v2*/"Reims, le 19 septembre 1914. Depuis le matin, l'artillerie allemande bombarde la ville. Dans la nef de la cathédrale, on a étendu de la paille pour coucher des blessés allemands faits prisonniers.",minT:1.2},
  {t:/*v2*/"Vers trois heures de l'après-midi, les obus mettent le feu au toit. La charpente, une forêt de vieux chênes, s'embrase ; puis la paille de la nef prend feu à son tour.",minT:1.2},
  {t:/*v2*/"Raymond faisait la sieste dans les combles avec deux camarades du colombier militaire, Flocon et Gaston. Il se souvient de la chaleur qui l'a réveillé, et du bruit des poutres.",minT:1.2}];
function rfOutCard(ms){const al=ms.filter(m=>m.alive);
  if(al.length===2)return/*v2*/"Raymond, Flocon et Gaston se posent sur un toit de la rue et regardent brûler la cathédrale jusqu'à la nuit. Raymond se dit qu'ils s'en sont sortis tous les trois, et que ça tient du miracle.";
  if(al.length===1){const v=al[0].n,d=ms.find(m=>!m.alive).n;return/*v2*/"Raymond et "+v+/*v2*/" se posent sur un toit de la rue, les plumes noires de suie. Ils regardent brûler la cathédrale sans un roucoulement. Raymond pense à "+d+/*v2*/", resté sous les poutres."}
  return/*v2*/"Raymond se pose seul sur un toit de la rue et regarde brûler la cathédrale. Il pense à Flocon et à Gaston, restés sous les poutres."}
const RF_CARDS_OUT=[
  {t:/*v2*/"La charpente a brûlé jusqu'à la nuit. Le plomb du toit a fondu, les vitraux ont éclaté, les statues de la façade ont été calcinées. L'ange au sourire y a perdu sa tête.",minT:1.2},
  {t:/*v2*/"La cathédrale en feu a fait le tour du monde. Il a fallu près de vingt ans de travaux pour la relever : elle a été rendue au culte en 1938.",minT:1.2},];

/* ---------- le décor (en cache) : la nef, les voûtes, la charpente, le portail ---------- */
function rfBuild(){const TR=Math.min(RS,1),{layer:c,g}=mkLayer(RF.W*TR,RF.H*TR);g.scale(TR,TR);c.rs=TR;const R=mulberry(1914),B=RF.bay;RF.deco=[];
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
  for(let x=240;x<4100;x+=300){RF.deco.push([x,286,60,52]);RF.deco.push([x+150,140,40,46])}
  for(let x=90;x<4140;x+=150){RF.deco.push([x-50,206,44,44]);if(R()<.6)RF.deco.push([x+10,64,30,50])}
  g.strokeStyle='#2e1c10';g.lineWidth=6;for(const y of[110,190,270]){g.beginPath();g.moveTo(60,y);g.lineTo(4140,y);g.stroke()}
  // la nef : le dallage, les lits de paille des blessés, les chaises renversées
  g.fillStyle='#6a5a48';g.fillRect(60,1500,4080,60);for(let x=60;x<4140;x+=60){g.fillStyle='rgba(0,0,0,.18)';g.fillRect(x,1500,2,60)}
  // les bancs de la nef, brûlés (rangées de chaises et de bancs carbonisés) ; quelques bottes de paille des blessés
  for(let x=180;x<4020;x+=92){const tilt=(R()-.5)*(R()<.3?.6:.08),burn=R();g.save();g.translate(x+40,1500);g.rotate(tilt);
    g.fillStyle=burn<.5?'#1a0e08':'#2e1c10';g.fillRect(-40,-24,80,7);g.fillRect(-36,-24,6,24);g.fillRect(30,-24,6,24);g.fillRect(-40,-52,6,30);g.fillRect(-40,-50,80,6);g.fillRect(-40,-40,80,4);
    g.fillStyle='rgba(200,80,20,.35)';for(let k=0;k<2;k++)g.fillRect(-38+R()*74,-24+R()*4,6+R()*6,2);g.fillStyle='#0c0604';g.fillRect(-40+R()*60,-52,12+R()*16,6);g.restore();
    if(burn>.55)RF.deco.push([x+10+R()*30,1474,40,26])}
  for(const x of[520,1240,1960,2680,3400]){g.fillStyle='#8a6a28';rr(g,x,1484,90,16,6);g.fill();g.fillStyle='#5a3e18';for(let k=0;k<10;k++)g.fillRect(x+6+k*8,1486+(k%3)*4,7,2);RF.deco.push([x+6,1460,80,30])}
  // le bois sur les piliers : les lambris au pied des piles, les chevrons tombés appuyés contre elles — tout ça brûle
  // les grosses poutres tombées de la charpente, coincées en travers entre les piles (la bande 1160-1190)
  for(let x=300;x<4140;x+=B/2){const w=B/2+30,tl=(R()-.5)*.03;g.save();g.translate(x+w/2-15,1175);g.rotate(tl);
    g.fillStyle='#2a1a0e';g.fillRect(-w/2,-16,w,32);g.fillStyle='#3e2614';g.fillRect(-w/2,-16,w,8);g.fillStyle='#0e0604';for(let k=-w/2+6;k<w/2-10;k+=14+R()*10)g.fillRect(k,-8,8+R()*6,3);
    g.fillStyle='rgba(200,80,20,.35)';for(let k=0;k<3;k++)g.fillRect(-w/2+R()*w,2+R()*8,6+R()*8,2);g.restore();
    if(R()<.5)RF.deco.push([x+20+R()*60,1128,60,34])}
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
  // le bois qui brûle sur les piles, les bancs, les poutres (le décor : ces flammes-là sont derrière)
  if(RF.deco){g.globalCompositeOperation='lighter';for(const[x,y,w,h]of RF.deco){if(x<cx-150||x>cx+W+150||y<cy-150||y>cy+H+150)continue;const gl=g.createRadialGradient(x+w/2,y+h,4,x+w/2,y+h,130);gl.addColorStop(0,'rgba(255,120,30,.22)');gl.addColorStop(1,'rgba(255,80,20,0)');g.fillStyle=gl;g.fillRect(x+w/2-130,y+h-130,260,260)}g.globalCompositeOperation='source-over';g.globalAlpha=.8;for(const[x,y,w,h]of RF.deco){if(x<cx-100||x>cx+W+100||y<cy-100||y>cy+H+100)continue;rfFlame(g,x,y,w,h,t*.9+x*.003,false)}g.globalAlpha=1}
  // la fumée noire qui s'accumule sous les voûtes et sous le toit, qui roule
  for(let l=0;l<4;l++){const L1=RF.lanes[l];if(L1.y0>cy+H||L1.y0+120<cy)continue;const sg=g.createLinearGradient(0,L1.y0,0,L1.y0+110);sg.addColorStop(0,'rgba(8,5,4,.85)');sg.addColorStop(1,'rgba(8,5,4,0)');g.fillStyle=sg;g.fillRect(cx,L1.y0,W,110);
    for(let k=0;k<9;k++){const x=cx+((k*157+t*(l%2?40:-40)*1.0+l*300)%(W+300)+W+300)%(W+300)-150,y=L1.y0+20+Math.sin(t*.7+k)*10;g.save();g.translate(x,y);g.scale(1,.32);const sg2=g.createRadialGradient(0,0,10,0,0,120);sg2.addColorStop(0,'rgba(10,6,5,.75)');sg2.addColorStop(1,'rgba(10,6,5,0)');g.fillStyle=sg2;g.beginPath();g.arc(0,0,120,0,7);g.fill();g.restore()}}
  // la fumée qui monte des feux
  for(const[x,y,w,h]of RF.fires){if(x<cx-200||x>cx+W+200)continue;const bot=y<300&&y<60;if(bot)continue;for(let k=0;k<5;k++){const ph=(t*.35+k*.2+x*.001)%1,px=x+w/2+Math.sin(t+k*2)*20*ph,py=y-ph*220,r=16+ph*50;const sg=g.createRadialGradient(px,py,r*.1,px,py,r);sg.addColorStop(0,'rgba(16,10,8,'+(.6*(1-ph))+')');sg.addColorStop(1,'rgba(16,10,8,0)');g.fillStyle=sg;g.beginPath();g.arc(px,py,r,0,7);g.fill()}}
  // les feux
  for(const[x,y,w,h]of RF.fires){if(x<cx-120||x>cx+W+120)continue;rfFlame(g,x,y,w,h,t,y<300&&y<60)}
  // les lustres qui se balancent
  for(const c of RF.chand){const L1=RF.lanes[c[1]],sw=Math.sin(s.t*.9+c[0])*.25,px=c[0],py=L1.y0-6,ex=px+Math.sin(sw)*190,ey=py+Math.cos(sw)*190;if(ex<cx-200||ex>cx+W+200)continue;
    g.strokeStyle='#2a2018';g.lineWidth=2;g.beginPath();g.moveTo(px,py);g.lineTo(ex,ey-20);g.stroke();g.fillStyle='#c8a050';g.beginPath();g.ellipse(ex,ey,30,9,0,0,7);g.fill();g.strokeStyle='#a88030';g.lineWidth=3;g.beginPath();g.moveTo(ex-28,ey);g.quadraticCurveTo(ex,ey+30,ex+28,ey);g.stroke();
    for(let k=-2;k<=2;k++){g.fillStyle='#f0e8d0';g.fillRect(ex+k*12-2,ey-14,4,10);rfFlame(g,ex+k*12-5,ey-28,10,16,t+k,false)}}
  // les pailles
  for(const k of L.corn)if(k.rf&&!k.taken&&k.x>cx-40&&k.x<cx+W+40)drawTuft(g,k.x,k.y,t+k.ph);
  // les poutres qui tombent, les braises au sol
  for(const b of s.beams){if(b.t<-.35)continue;const u=clamp(b.t/b.T,0,1),y=rfBeamY(b);rfBeam(g,b.x,y,b.w,b.rot*u,t,true)}
  for(const d of s.debris){rfFlame(g,d.x-d.w/2+8,d.y-24-38*(1-d.t/3),d.w-16,38*(1-d.t/3)+14,t+d.x*.01,false,1);rfBeam(g,d.x,d.y-12,d.w,.06,t,false)}
  // les camarades, Raymond
  for(const m of s.mates){if(m.alive)vxPigeon(g,m.x,m.y,1,m.f,t+m.d*3,{pal:m.pal});else if(m.fall&&m.fall.t<2)vxPigeon(g,m.fall.x,m.fall.y,1,1,t,{pal:Object.assign({},m.pal,{b0:'#3a3430',b1:'#2a2420',w0:'#2a2420',w1:'#3a3430',head:'#3a3430'}),rot:m.fall.t*6,fold:1,closed:1})}
  if(s.dead>0)vxPigeon(g,s.x,s.y,1,s.f,t,{rot:(1.4-s.dead)*8,fold:1,closed:1});else vxPigeon(g,s.x,s.y,1.05,s.f,s.fph/14,{flap:s.fph});
  for(const m of s.mates)if(m.alive&&m.x>cx&&m.x<cx+W){g.fillStyle='rgba(240,230,210,.6)';g.font='italic 11px '+F_BODY;g.textAlign='center';g.fillText(m.n,m.x,m.y-20)}
  // les braises qui montent, la fumée
  for(const e of s.embers){const a=1-e.t/e.max;g.fillStyle='rgba(255,'+(140+(e.x*7%80|0))+',40,'+a+')';g.fillRect(e.x,e.y,2.4,2.4)}
  g.restore();
  for(let k=0;k<6;k++){const x=((k*260-t*30-cx*.3)%(W+400)+W+400)%(W+400)-200,y=30+k*20+Math.sin(t*.4+k)*20;rfPuff(g,x,y,240,60,'20,14,12',.5)}
  // les vagues de fumée noire, au premier plan : elles roulent d'un bord à l'autre de l'écran
  {const per=7,u=(t%per)/per,dir=Math.floor(t/per)%2?1:-1,wx=dir>0?lerp(-700,W+700,u):lerp(W+700,-700,u),wy=H*(.3+.4*((Math.floor(t/per)*.618)%1));
   for(let k=0;k<16;k++){const ox=(k-8)*48+Math.sin(k*2.1)*30,oy=Math.sin(k*1.7+t*.8)*90,r=70+(k*37%60);const sg=g.createRadialGradient(wx+ox,wy+oy,r*.2,wx+ox,wy+oy,r);sg.addColorStop(0,'rgba(6,4,3,.7)');sg.addColorStop(1,'rgba(6,4,3,0)');g.fillStyle=sg;g.beginPath();g.arc(wx+ox,wy+oy,r,0,7);g.fill()}}
  // la fumée basse, toujours là, qui défile devant
  for(let k=0;k<5;k++){const x=((k*300+t*55)%(W+500)+W+500)%(W+500)-250,y=H-30-k*12+Math.sin(t*.6+k)*14;rfPuff(g,x,y,200,50,'10,6,5',.6)}
  // les repères en haut de l'écran : une poutre va tomber (gros repère : gros morceau)
  for(const b of s.beams){if(b.t>=0)continue;const sx=b.x-cx;if(sx<-60||sx>W+60)continue;const near=b.t>-.5,bl=Math.sin(t*(near?30:12))>0,sz=b.big?22:13,yy=34,k=clamp(1+b.t/1.3,0,1);
    g.fillStyle=near?(bl?'#ff1a10':'#a00800'):(bl?mix('#ffd060','#ff5020',k):'#ffd060');g.beginPath();g.moveTo(sx,yy+sz);g.lineTo(sx-sz*.9,yy-sz*.4);g.lineTo(sx+sz*.9,yy-sz*.4);g.closePath();g.fill();g.fillStyle='#2a1008';g.font='bold '+(b.big?18:12)+'px '+F_DISP;g.textAlign='center';g.fillText('!',sx,yy+(b.big?4:2));
    g.strokeStyle='rgba(255,180,80,.35)';g.lineWidth=b.big?3:2;g.setLineDash([6,6]);g.beginPath();g.moveTo(sx-b.w/2,yy+sz+4);g.lineTo(sx+b.w/2,yy+sz+4);g.stroke();g.setLineDash([])}
  // le vignettage, la date
  const vg=g.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,H*.85);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(20,6,0,.6)');g.fillStyle=vg;g.fillRect(0,0,W,H);
  g.globalAlpha=.65;g.fillStyle='#efe5cc';g.font='italic 15px '+F_BODY;g.textAlign='left';g.fillText(/*v2*/'Reims · 19 septembre 1914',20,H-20);g.globalAlpha=1;
  // les camarades encore là
  s.mates.forEach((m,i)=>{g.fillStyle=m.alive?'rgba(240,232,210,.85)':'rgba(240,232,210,.3)';g.font='13px '+F_BODY;g.textAlign='right';g.fillText((m.alive?'':'✝ ')+m.n,W-20,H-38+i*18)});
  drawQuip(66);
  const f=Math.max(s.fade,s.flash*.85);if(f>0){g.fillStyle='rgba(255,236,210,'+f+')';g.fillRect(0,0,W,H)}}
function rfPuff(g,x,y,rx,ry,c,a){g.save();g.translate(x,y);g.scale(1,ry/rx);const sg=g.createRadialGradient(0,0,rx*.1,0,0,rx);sg.addColorStop(0,'rgba('+c+','+a+')');sg.addColorStop(1,'rgba('+c+',0)');g.fillStyle=sg;g.beginPath();g.arc(0,0,rx,0,7);g.fill();g.restore()}
function rfFlame(g,x,y,w,h,t,hang,v){const n=Math.max(2,Math.floor(w/(v?11:14)));for(let k=0;k<n;k++){const fx=x+(k+.5)*w/n+(v?Math.sin(k*7.3)*4:0),ph=t*9+k*1.7+x*.01,hh=h*(v?(.45+.55*Math.abs(Math.sin(k*2.39+x*.07)))*(.75+.25*Math.sin(ph)):(.7+.3*Math.sin(ph))),ww=w/n*(v?1.25:.9);
    for(const[c,s]of[['rgba(200,60,10,.85)',1],['rgba(255,150,30,.9)',.72],['rgba(255,236,150,.95)',.4]]){g.fillStyle=c;g.beginPath();
      if(hang){g.moveTo(fx-ww*s,y);g.quadraticCurveTo(fx-ww*s*.6+Math.sin(ph)*4,y+hh*s*.6,fx+Math.sin(ph*1.3)*5,y+hh*s);g.quadraticCurveTo(fx+ww*s*.6,y+hh*s*.6,fx+ww*s,y)}
      else{const b=y+h;g.moveTo(fx-ww*s,b);g.quadraticCurveTo(fx-ww*s*.6+Math.sin(ph)*4,b-hh*s*.6,fx+Math.sin(ph*1.3)*5,b-hh*s);g.quadraticCurveTo(fx+ww*s*.6,b-hh*s*.6,fx+ww*s,b)}g.fill()}}}
function rfBeam(g,x,y,w,rot,t,falling){g.save();g.translate(x,y);g.rotate(rot);if(falling)rfFlame(g,-w/2+6,-44,w-12,40,t+x*.01,false,1);g.fillStyle='#3a2414';g.fillRect(-w/2,-12,w,24);g.fillStyle='#5a3820';g.fillRect(-w/2,-12,w,6);
  g.fillStyle='#1a0c06';for(let k=-w/2+8;k<w/2-8;k+=18)g.fillRect(k,-4,10,3);g.fillStyle='rgba(255,120,30,.8)';g.fillRect(-w/2,8,w,4);
g.restore()}
/* la sortie : on se retourne, la cathédrale brûle — d'après la carte postale coloriée de septembre 1914 :
   à gauche le chevet et la flèche de l'ange, puis la façade du transept nord et sa rose, la nef hérissée de pinacles
   devant le toit en flammes, à droite la tour nord ; au premier plan, les toits de Reims */
const RFO={base:430};
function rfOutLayers(){const mkc=()=>{const c=mk(Math.ceil(W*RS),Math.ceil(H*RS)),g=c.getContext('2d');g.scale(RS,RS);return[c,g]};
  const R=mulberry(1919),st='#7e6a5c',sh='#5a4a40',dk='#3a2e28',lt='#a08a74',hole='#1a1210',B=RFO.base;
  // A : le corps de la cathédrale
  const[ca,a]=mkc();
  // le chevet : chapelles rayonnantes, abside, toit déjà tombé ; la flèche de l'ange
  a.fillStyle=sh;a.fillRect(0,300,236,B-300);a.fillStyle=st;a.fillRect(0,250,236,60);
  for(let x=8;x<230;x+=38){a.fillStyle=hole;rr(a,x+8,262,14,42,7);a.fill();a.fillStyle='rgba(255,130,40,.55)';rr(a,x+10,266,10,36,5);a.fill();
    a.fillStyle=st;a.beginPath();a.moveTo(x,B);a.lineTo(x,350);a.quadraticCurveTo(x+18,326,x+36,350);a.lineTo(x+36,B);a.fill();a.fillStyle=hole;rr(a,x+12,360,12,40,6);a.fill()}
  a.fillStyle=lt;a.fillRect(0,246,236,6);for(let x=0;x<236;x+=8)a.fillRect(x,240,4,7);
  {const x=168;a.fillStyle=dk;poly(a,[x-10,212,x,60,x+10,212]);a.fill();a.fillStyle=st;a.fillRect(x-14,196,28,30);a.fillStyle=hole;for(const dx of[-9,3])rr(a,x+dx,201,6,18,3),a.fill();
   a.strokeStyle=lt;a.lineWidth=1.4;for(let y=80;y<200;y+=14){const w=(y-60)/152*10;a.beginPath();a.moveTo(x-w,y);a.lineTo(x-w-3,y-3);a.moveTo(x+w,y);a.lineTo(x+w+3,y-3);a.stroke()}a.fillStyle='#c8a050';a.beginPath();a.arc(x,58,3,0,7);a.fill()}
  // la façade du transept nord : pignon ajouré, deux tourelles, galerie, la rose, les lancettes
  {const x0=236,x1=388,cx=(x0+x1)/2;a.fillStyle=st;a.fillRect(x0,190,x1-x0,B-190);
   a.fillStyle=lt;poly(a,[x0+6,196,cx,100,x1-6,196]);a.fill();a.fillStyle=hole;poly(a,[x0+28,192,cx,124,x1-28,192]);a.fill();
   a.strokeStyle=lt;a.lineWidth=3;for(const dx of[-30,-10,10,30]){a.beginPath();a.moveTo(cx+dx,192);a.lineTo(cx+dx*.5,192-(40-Math.abs(dx))*1.4);a.stroke()}
   a.fillStyle='rgba(255,140,50,.55)';poly(a,[x0+34,190,cx,132,x1-34,190]);a.fill();a.strokeStyle=lt;a.lineWidth=2.5;a.beginPath();a.arc(cx,166,13,0,7);a.stroke();
   a.fillStyle=lt;a.fillRect(x0,192,x1-x0,8);for(let x=x0+4;x<x1;x+=8)a.fillStyle=lt,a.fillRect(x,200,3,14);a.fillRect(x0,212,x1-x0,4);
   a.fillStyle=sh;a.beginPath();a.moveTo(cx-56,354);a.lineTo(cx-56,282);a.quadraticCurveTo(cx-56,226,cx,218);a.quadraticCurveTo(cx+56,226,cx+56,282);a.lineTo(cx+56,354);a.fill();
   const rc=[cx,290],r=44;a.fillStyle=hole;a.beginPath();a.arc(rc[0],rc[1],r,0,7);a.fill();
   for(let k=0;k<16;k++){a.fillStyle=['#c02a20','#2a4aa0','#e0a030','#a03a80'][k%4];a.globalAlpha=.85;a.beginPath();a.moveTo(rc[0],rc[1]);a.arc(rc[0],rc[1],r-5,k*Math.PI/8+.04,(k+1)*Math.PI/8-.04);a.fill()}a.globalAlpha=1;
   a.strokeStyle=lt;a.lineWidth=3;a.beginPath();a.arc(rc[0],rc[1],r,0,7);a.stroke();a.beginPath();a.arc(rc[0],rc[1],14,0,7);a.stroke();for(let k=0;k<16;k++){a.lineWidth=1.6;a.beginPath();a.moveTo(rc[0]+Math.cos(k*Math.PI/8)*14,rc[1]+Math.sin(k*Math.PI/8)*14);a.lineTo(rc[0]+Math.cos(k*Math.PI/8)*r,rc[1]+Math.sin(k*Math.PI/8)*r);a.stroke()}
   for(let k=0;k<5;k++){const x=cx-50+k*20;a.fillStyle=hole;rr(a,x+3,350,14,62,7);a.fill();a.fillStyle='rgba(230,100,40,.5)';rr(a,x+5,354,10,54,5);a.fill()}
   // les tourelles d'angle, octogonales, coiffées d'une pointe
   for(const tx of[x0-6,x1-16]){a.fillStyle=sh;a.fillRect(tx,140,22,B-140);a.fillStyle=st;a.fillRect(tx+4,140,8,B-140);a.fillStyle=hole;for(let y=150;y<230;y+=40)rr(a,tx+7,y,8,30,4),a.fill();
     a.fillStyle=lt;a.fillRect(tx-2,136,26,6);a.fillStyle=dk;poly(a,[tx,138,tx+11,92,tx+22,138]);a.fill();a.strokeStyle=lt;a.lineWidth=1.2;for(let y=104;y<136;y+=8){const w=(y-92)/46*11;a.beginPath();a.moveTo(tx+11-w,y);a.lineTo(tx+8-w,y-3);a.moveTo(tx+11+w,y);a.lineTo(tx+14+w,y-3);a.stroke()}}}
  // la nef : le mur haut (fenêtres où l'on voit le feu), la corniche ; les bas-côtés
  a.fillStyle=sh;a.fillRect(388,330,384,B-330);a.fillStyle=st;a.fillRect(388,206,384,128);
  for(let i=0;i<9;i++){const x=396+i*42;a.fillStyle=hole;a.beginPath();a.moveTo(x+6,320);a.lineTo(x+6,236);a.quadraticCurveTo(x+19,214,x+32,236);a.lineTo(x+32,320);a.fill();
    a.fillStyle='rgba(255,'+(110+R()*60|0)+',40,.75)';a.beginPath();a.moveTo(x+9,318);a.lineTo(x+9,238);a.quadraticCurveTo(x+19,220,x+29,238);a.lineTo(x+29,318);a.fill();
    a.strokeStyle=dk;a.lineWidth=2;a.beginPath();a.moveTo(x+19,226);a.lineTo(x+19,318);a.stroke();a.beginPath();a.arc(x+19,244,6,0,7);a.stroke();
    a.fillStyle=hole;rr(a,x+12,366,14,46,7);a.fill()}
  a.fillStyle=lt;a.fillRect(388,202,384,6);for(let x=390;x<772;x+=9)a.fillRect(x,194,4,9);a.fillRect(388,192,384,3);
  a.fillStyle=dk;poly(a,[388,334,772,334,772,346,388,346]);a.fill();
  // la tour nord : sans flèche ; deux hautes baies ajourées, tourelles d'angle, galerie au sommet
  {const x0=772,x1=900;a.fillStyle=st;a.fillRect(x0,250,x1-x0,B-250);a.fillStyle=sh;a.fillRect(x0+16,96,x1-x0-32,160);
   for(const bx of[x0+24,x0+66]){a.fillStyle=hole;a.beginPath();a.moveTo(bx,250);a.lineTo(bx,128);a.quadraticCurveTo(bx+19,96,bx+38,128);a.lineTo(bx+38,250);a.fill();
     a.strokeStyle=lt;a.lineWidth=2.4;a.beginPath();a.moveTo(bx+19,108);a.lineTo(bx+19,250);a.moveTo(bx,190);a.lineTo(bx+38,190);a.stroke();a.beginPath();a.arc(bx+10,128,7,0,7);a.arc(bx+28,128,7,0,7);a.stroke();
     a.strokeStyle=st;a.lineWidth=4;a.beginPath();a.moveTo(bx,250);a.lineTo(bx,128);a.quadraticCurveTo(bx+19,96,bx+38,128);a.lineTo(bx+38,250);a.stroke()}
   for(const tx of[x0,x1-20]){a.fillStyle=st;a.fillRect(tx,70,20,186);a.fillStyle=lt;a.fillRect(tx+3,70,5,186);a.fillStyle=hole;for(let y=88;y<240;y+=52)rr(a,tx+8,y,7,40,3.5),a.fill();
     a.fillStyle=lt;for(const dx of[2,10,18])poly(a,[tx+dx-3,70,tx+dx,52,tx+dx+3,70]),a.fill()}
   a.fillStyle=lt;a.fillRect(x0+18,88,x1-x0-36,8);for(let x=x0+20;x<x1-20;x+=8)a.fillRect(x,80,3,9);a.fillRect(x0+18,78,x1-x0-36,3);
   for(const px of[x0+40,x0+64,x0+88])a.fillStyle=lt,poly(a,[px-3,80,px,62,px+3,80]),a.fill();
   a.fillStyle=lt;a.fillRect(x0,250,x1-x0,6);for(let k=0;k<3;k++){const bx=x0+6+k*40;a.fillStyle=hole;a.beginPath();a.moveTo(bx+6,B);a.lineTo(bx+6,300);a.quadraticCurveTo(bx+17,280,bx+28,300);a.lineTo(bx+28,B);a.fill()}
   a.fillStyle=sh;for(const bx of[x0-6,x0+42,x0+82,x1-6])a.fillRect(bx,262,12,B-262)}
  // B : devant le feu — les culées, les arcs-boutants, les pinacles à statue de la nef ; les pinacles du chevet et du transept
  const[cb,b]=mkc();
  const pin=(x,top,base,w)=>{b.fillStyle=sh;b.fillRect(x-w/2,top+28,w,base-top-28);b.fillStyle=st;b.fillRect(x-w/2+2,top+28,w/2-2,base-top-28);
    b.fillStyle=hole;rr(b,x-w/2+3,top+34,w-6,16,4);b.fill();b.fillStyle='#d8c8a8';b.fillRect(x-1.5,top+37,3,11);
    b.fillStyle=dk;poly(b,[x-w/2,top+30,x,top,x+w/2,top+30]);b.fill();b.strokeStyle=lt;b.lineWidth=1;for(let y=top+8;y<top+30;y+=6){const k=(y-top)/30*w/2;b.beginPath();b.moveTo(x-k,y);b.lineTo(x-k-2,y-2);b.moveTo(x+k,y);b.lineTo(x+k+2,y-2);b.stroke()}};
  for(let i=0;i<10;i++){const x=392+i*42;b.strokeStyle=st;b.lineWidth=6;b.beginPath();b.moveTo(x+4,292);b.quadraticCurveTo(x+4,256,x+26,232);b.stroke();b.lineWidth=5;b.beginPath();b.moveTo(x+4,330);b.quadraticCurveTo(x+4,300,x+24,286);b.stroke();
    b.strokeStyle=sh;b.lineWidth=2;b.beginPath();b.moveTo(x+6,288);b.quadraticCurveTo(x+7,258,x+26,236);b.stroke();
    pin(x,150+(i%2)*8,B,14)}
  for(let x=14;x<230;x+=30)pin(x,176+((x*7)%20),300,10);
  pin(236,148,200,10);pin(388,148,200,10);
  // les gargouilles
  for(let i=0;i<9;i++){const x=410+i*42;b.fillStyle=dk;poly(b,[x,200,x+14,196,x+16,202,x,206]);b.fill()}
  // C : les toits de Reims, au premier plan
  const[cc,c]=mkc();
  c.fillStyle='#3a3040';poly(c,[0,446,40,412,250,412,300,446]);c.fill();c.fillStyle='#5a3a30';poly(c,[-10,470,30,430,170,430,210,470]);c.fill();
  c.fillStyle='#d8c8a8';c.fillRect(0,446,300,94);c.fillStyle='#4a3a30';c.fillRect(-10,470,220,70);for(let x=0;x<210;x+=14){c.fillStyle='rgba(0,0,0,.2)';c.fillRect(x,470,2,70)}
  c.fillStyle='#4a2a24';for(const x of[60,150,250])c.fillRect(x,380,16,40),c.fillStyle='#6a3a30',c.fillRect(x-2,376,20,6),c.fillStyle='#4a2a24';
  c.fillStyle='#5e5468';poly(c,[300,540,300,430,380,372,960,372,960,540]);c.fill();c.fillStyle='#4a4254';poly(c,[300,430,380,372,960,372,960,382,384,382,312,434]);c.fill();
  for(let y=388;y<520;y+=12){c.fillStyle='rgba(0,0,0,.12)';c.fillRect(310,y,650,2)}
  c.fillStyle='#e8dcc0';c.fillRect(300,500,660,40);
  for(const x of[520,610,700,790,880]){c.fillStyle='#e8dcc0';c.fillRect(x,434,46,50);c.fillStyle='#5e5468';poly(c,[x-6,436,x+23,410,x+52,436]);c.fill();c.fillStyle='#3a3048';c.fillRect(x+8,444,30,36);c.strokeStyle='#e8dcc0';c.lineWidth=2;c.beginPath();c.moveTo(x+23,444);c.lineTo(x+23,480);c.moveTo(x+8,462);c.lineTo(x+38,462);c.stroke()}
  for(const x of[440,486]){c.fillStyle='#8a4a3a';c.fillRect(x,340,22,60);c.fillStyle='#6a3a2c';c.fillRect(x-3,336,28,7)}
  c.fillStyle='#7a7480';c.fillRect(470,354,6,40);
  return{a:ca,b:cb,c:cc}}
function rfOutro(g,t,s){const u=s.out.t,B=RFO.base;if(!s.outL)s.outL=rfOutLayers();const Ly=s.outL;
  // le ciel : bleu en haut à droite, mangé à gauche par la fumée
  const sk=g.createLinearGradient(W,0,0,H);sk.addColorStop(0,'#6a90b0');sk.addColorStop(.35,'#a89080');sk.addColorStop(.7,'#c0603a');sk.addColorStop(1,'#5a2a1c');g.fillStyle=sk;g.fillRect(0,0,W,H);
  // la fumée, poussée vers la gauche, éclairée par-dessous
  const puff=(k,back)=>{const ph=(t*.06+k*.137)%1,x0=380+((k*97)%400),x=x0-ph*520-(back?60:0),y=220-ph*260-((k*53)%60),r=40+ph*110+(k%5)*8;
    const gl=g.createRadialGradient(x,y+r*.4,r*.2,x,y,r);const o=back?.55:.38;gl.addColorStop(0,'rgba('+(200-ph*120|0)+','+(110-ph*50|0)+',60,'+o+')');gl.addColorStop(1,'rgba(60,46,44,0)');g.fillStyle=gl;g.beginPath();g.arc(x,y,r,0,7);g.fill()};
  for(let k=0;k<12;k++){const x=((k*130-t*14)%1300+1300)%1300-200,y=40+((k*37)%90)+Math.sin(t*.3+k)*8,r=110+(k%3)*40;const dg=g.createRadialGradient(x,y,r*.2,x,y,r);dg.addColorStop(0,'rgba(48,38,38,.75)');dg.addColorStop(1,'rgba(60,46,44,0)');g.fillStyle=dg;g.beginPath();g.arc(x,y,r,0,7);g.fill()}
  for(let k=0;k<34;k++)puff(k,true);
  const gl=g.createRadialGradient(560,210,20,560,210,420);gl.addColorStop(0,'rgba(255,150,50,.55)');gl.addColorStop(1,'rgba(255,90,20,0)');g.fillStyle=gl;g.fillRect(0,0,W,H);
  // les colonnes de fumée noire qui sortent du toit, poussées vers la gauche (derrière)
  const smoke=(x0,k,front)=>{const ph=(t*.09+k*.173)%1,x=x0-ph*ph*420+Math.sin(t*.5+k)*10,y=200-ph*330,r=26+ph*120;const sg=g.createRadialGradient(x,y,r*.15,x,y,r);const a=(front?.55:.8)*(1-ph*.6);
    sg.addColorStop(0,'rgba(18,14,14,'+a+')');sg.addColorStop(.6,'rgba(28,22,22,'+(a*.7)+')');sg.addColorStop(1,'rgba(30,24,24,0)');g.fillStyle=sg;g.beginPath();g.arc(x,y,r,0,7);g.fill()};
  for(const x0 of[430,520,610,700,120,190])for(let k=0;k<7;k++)smoke(x0,k+x0*.01,false);
  g.drawImage(Ly.a,0,0,W,H);
  // la fumée qui sort par les fenêtres hautes de la nef et par la rose du transept
  for(let i=0;i<9;i++){const x=415+i*42;for(let k=0;k<3;k++){const ph=(t*.5+k*.33+i*.17)%1,yy=280-ph*90,r=6+ph*22;g.fillStyle='rgba(24,18,18,'+(.55*(1-ph))+')';g.beginPath();g.arc(x-ph*20,yy,r,0,7);g.fill()}}
  for(let k=0;k<4;k++){const ph=(t*.4+k*.25)%1;g.fillStyle='rgba(24,18,18,'+(.5*(1-ph))+')';g.beginPath();g.arc(312-ph*30,290-ph*120,14+ph*30,0,7);g.fill()}
  // le toit qui brûle : la nef, le chevet ; la charpente noire dans les flammes
  const fl=(x0,x1,base,hh,step)=>{for(let x=x0;x<x1;x+=step){const h=hh*(.6+.4*Math.sin(t*7+x*.7))+((x*13)%30);
    for(const[c,k]of[['rgba(200,50,10,.9)',1],['rgba(255,140,30,.95)',.75],['rgba(255,230,140,.95)',.42]]){g.fillStyle=c;g.beginPath();g.moveTo(x-step*.9*k,base);g.quadraticCurveTo(x-step*.4+Math.sin(t*5+x)*4,base-h*k*.6,x+Math.sin(t*6+x*.3)*6,base-h*k);g.quadraticCurveTo(x+step*.5,base-h*k*.5,x+step*.9*k,base);g.fill()}}};
  fl(392,772,206,150,11);fl(6,232,252,95,11);
  g.strokeStyle='rgba(30,14,8,.85)';g.lineWidth=3;for(let x=400;x<770;x+=34){g.beginPath();g.moveTo(x,206);g.lineTo(x+16,150+((x*3)%20));g.lineTo(x+32,206);g.stroke()}
  g.lineWidth=2;g.beginPath();g.moveTo(396,168);g.lineTo(700,160);g.stroke();
  g.drawImage(Ly.b,0,0,W,H);
  // de temps en temps, un pan de toit s'effondre : une gerbe d'étincelles monte
  {const per=2.6,k=Math.floor(t/per),u=(t%per)/per,bx=420+((k*137)%330);if(u<.5){const a=1-u*2;g.fillStyle='rgba(255,220,140,'+(a*.5)+')';g.beginPath();g.ellipse(bx,200,60*(1-a)+20,26,0,0,7);g.fill();
    for(let i=0;i<26;i++){const an=-Math.PI/2+(i/26-.5)*1.6,d=u*2*(90+(i*37%60));g.fillStyle='rgba(255,'+(160+(i%3)*30)+',60,'+a+')';g.fillRect(bx+Math.cos(an)*d,200+Math.sin(an)*d+u*u*60,2.5,2.5)}}}
  // la fumée noire, devant aussi
  for(const x0 of[470,640])for(let k=0;k<5;k++)smoke(x0,k*1.3+7,true);
  // la fumée devant, les braises
  for(let k=0;k<14;k++)puff(k+40,false);
  for(let k=0;k<50;k++){const ph=(t*.25+k*.071)%1,x=360+((k*61)%420)-ph*180,y=210-ph*200;g.fillStyle='rgba(255,'+(150+(k%4)*20)+',50,'+(1-ph)+')';g.fillRect(x,y,2,2)}
  g.drawImage(Ly.c,0,0,W,H);
  // la lueur rouge sur les toits
  g.fillStyle='rgba(255,110,40,'+(.1+Math.sin(t*5)*.03)+')';g.fillRect(0,370,W,170);
  // les pigeons qui s'éloignent, au premier plan
  const al=s.mates.filter(m=>m.alive),n=1+al.length;for(let i=0;i<n;i++){const k=Math.min(1,u/6),x=lerp(860,180,k)+i*46,y=lerp(500,120,k)+i*26+Math.sin(t*3+i)*6;vxPigeon(g,x,y,1.8-k*.9,-1,t+i,i===0?{}:{pal:al[i-1].pal})}
  g.globalAlpha=.7;g.fillStyle='#efe5cc';g.font='italic 15px '+F_BODY;g.textAlign='left';g.fillText(/*v2*/'Reims · 19 septembre 1914, le soir',20,H-20);g.globalAlpha=1;
  const f=u<1?1-u:u>6.6?(u-6.6)/.9:0;if(f>0){g.fillStyle='rgba(11,10,12,'+f+')';g.fillRect(0,0,W,H)}}
