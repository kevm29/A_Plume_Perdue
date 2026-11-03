/* =========================================================
   4-2 · L'AIRE DE GUEUX — de nuit : la station-service et ses chiens errants, la boutique (porte automatique, étals,
   clients qui crient « Pigeon ! », la caissière qui tape), le couloir des machines à café, le self (bar à salades sous
   sa hotte hérissée, vitrines réfrigérées), la salle de restaurant (les dîneurs tapent sur la table), les toilettes,
   la fenêtre, le parking des camions (un chien, un gardien à la lampe, un autre chien), et le dernier camion.
   Secrets : la deuxième machine à café, la salade, la porte de la vitrine restée ouverte.
   ========================================================= */
THEMES.aireNuit={outdoor:true,far:'sky',horizon:'road',sky:['#04060d','#0c1222','#1a2236'],celestial:'moon',stars:true,fog:'#10141f',dark:.55,weather:'night',
  floor:'#2a2a2e',floorTop:'#4e4e56',type:'stone',x:'none',d:'drape',shelf:'girder',spike:'spikes',spikeCol:'#3a3e46',spikeBase:'#2a2c32',walker:'rat',flyer:'crow',awning:'#2f5a7a',props:[],noFore:true};
const AIN={IN0:2800,IN1:12480};   // l'intérieur du bâtiment

/* ---------- le décor (couche en cache) ---------- */
function aireBuild(Lv){
  const D=Lv.def.aire,wpx=Lv.wpx+40,hpx=ROWS*T+PAD,TR=Math.min(RS,1),{layer:c,g}=mkLayer(wpx*TR,hpx*TR);g.scale(TR,TR);c.rs=TR;g.translate(0,PAD);
  const R=mulberry(Lv.def.seed+3),GY=D.G0*T,CEIL=4*T;
  // dehors : talus, arbres, glissière, lampadaires
  const outside=(a,b)=>{g.fillStyle='#0c1018';g.fillRect(a,GY-130,b-a,130);for(let x=a;x<b;x+=22){g.fillStyle='#080b12';g.beginPath();g.ellipse(x,GY-130,14+R()*10,26+R()*40,0,Math.PI,0);g.fill()}
    for(let x=a+200;x<b;x+=560){g.fillStyle='#2a2c30';g.fillRect(x-3,GY-300,6,300);g.fillRect(x-3,GY-300,60,5);g.fillStyle='#ffc070';g.fillRect(x+40,GY-296,20,5)}};
  outside(0,AIN.IN0);outside(AIN.IN1,wpx);
  // la station : l'auvent (dalle grise, bandeau jaune), piliers carrés, pompes, l'oriflamme
  {const a=700,b=1500;g.fillStyle='#b8bcc0';g.fillRect(a,170,b-a,44);g.fillStyle='#e0c040';g.fillRect(a,214,b-a,28);g.fillStyle='#e8e8e4';g.fillRect(a,242,b-a,10);g.fillStyle='#9a9ea4';g.fillRect(a,252,b-a,14);
   for(const x of[760,1100,1440]){g.fillStyle='#c8ccd0';g.fillRect(x-16,266,32,GY-266);g.fillStyle='rgba(0,0,0,.15)';g.fillRect(x+6,266,10,GY-266)}
   for(const[p0,p1]of[[860,940],[1180,1260]]){g.fillStyle='#c8c4b8';g.fillRect(p0-10,GY-10,p1-p0+20,10);g.fillStyle='#e0c020';g.fillRect(p0+6,GY-80,30,64);g.fillStyle='#2a8a3a';g.fillRect(p0+40,GY-80,30,64);
     g.fillStyle='#1a1a1a';g.fillRect(p0+10,GY-74,22,12);g.fillRect(p0+44,GY-74,22,12);g.strokeStyle='#1a1a1a';g.lineWidth=3;g.beginPath();g.moveTo(p0+36,GY-60);g.quadraticCurveTo(p0+50,GY-30,p0+38,GY-20);g.stroke()}
   g.fillStyle='#2a2a2e';g.fillRect(1560,GY-180,4,180);g.fillStyle='#3a3020';poly(g,[1564,GY-178,1600,GY-160,1600,GY-90,1564,GY-80]);g.fill();g.fillStyle='#c8a050';g.beginPath();g.arc(1582,GY-128,10,0,7);g.fill()}
  // le parking : voitures garées, marquages
  for(const[x0,x1,col]of[[1950,2170,'#3a5a8a'],[2260,2480,'#8a2a2a']]){const top=GY-80;g.fillStyle=col;rr(g,x0,top+30,x1-x0,36,10);g.fill();poly(g,[x0+30,top+32,x0+60,top,x1-60,top,x1-24,top+32]);g.fill();g.fillStyle='#1c2430';poly(g,[x0+40,top+30,x0+64,top+6,x1-64,top+6,x1-34,top+30]);g.fill();
    for(const wx of[x0+40,x1-46]){g.fillStyle='#121214';g.beginPath();g.arc(wx,GY-14,16,0,7);g.fill()}}
  // le bâtiment : façade, enseigne, intérieur (mur du fond éclairé), plafond, cloisons
  g.fillStyle='#d8d0c0';g.fillRect(AIN.IN0-60,CEIL-60,AIN.IN1-AIN.IN0+80,GY-CEIL+60);
  g.fillStyle='#2a2e36';g.fillRect(AIN.IN0-60,CEIL-70,AIN.IN1-AIN.IN0+80,80);g.fillStyle='#e0c040';g.fillRect(AIN.IN0-60,CEIL-6,AIN.IN1-AIN.IN0+80,10);
  g.fillStyle='#fff';g.font='bold 22px '+F_DISP;g.textAlign='left';g.fillText('AIRE DE GUEUX — BOUTIQUE · CAFÉ · RESTAURANT',AIN.IN0+40,CEIL-26);
  g.fillStyle='#ece6d8';g.fillRect(AIN.IN0,CEIL+40,AIN.IN1-AIN.IN0,GY-CEIL-40);g.fillStyle='#cfc6b4';g.fillRect(AIN.IN0,GY-70,AIN.IN1-AIN.IN0,70);
  g.fillStyle='rgba(0,0,0,.05)';for(let x=AIN.IN0;x<AIN.IN1;x+=60)g.fillRect(x,CEIL+40,1,GY-CEIL-110);
  g.fillStyle='#8a8478';g.fillRect(AIN.IN0,CEIL,AIN.IN1-AIN.IN0,40);g.fillStyle='rgba(255,250,230,.9)';for(let x=AIN.IN0+60;x<AIN.IN1;x+=240)g.fillRect(x,CEIL+40,120,6);
  for(const x of[4760,5560,11000]){g.fillStyle='#b8b0a0';g.fillRect(x,CEIL,40,GY-CEIL-160);g.fillStyle='#5a4a3a';g.fillRect(x-4,GY-164,48,8)}
  // la porte automatique et son capteur ; vitrines de la façade
  g.fillStyle='rgba(120,160,190,.35)';g.fillRect(AIN.IN0-60,GY-200,30,200);g.fillStyle='#3a3e46';g.fillRect(2760,CEIL+40,80,GY-CEIL-200);
  {const[sx,sy]=D.sensor;g.fillStyle='#2a2c30';g.fillRect(sx-14,sy-8,28,12);g.fillStyle='#d83020';g.beginPath();g.arc(sx,sy+6,4,0,7);g.fill()}
  // les étals : produits colorés sur les étagères
  const stall=(a,b,h,kind)=>{const top=GY-h*T;g.fillStyle='#e8e0c8';g.fillRect(a,top,b-a,h*T);g.fillStyle='#c8bca0';g.fillRect(a,top,b-a,6);
    for(let y=top+14;y<GY-10;y+=34){g.fillStyle='#b8ac90';g.fillRect(a+4,y+26,b-a-8,4);for(let x=a+8;x<b-14;x+=14){g.fillStyle=['#c83a2a','#e0b020','#2a6ab8','#3a8a4a','#e8e8e0','#8a3a8a'][Math.floor(R()*6)];g.fillRect(x,y+(R()*6|0),10,24-(R()*6|0))}}
    if(kind)g.fillStyle='#2a2a2e',g.font='bold 11px '+F_DISP,g.textAlign='center',g.fillText(kind,(a+b)/2,top-8)};
  stall(3000,3300,3,'BISCUITS');stall(3420,3720,3,'BOISSONS');stall(3880,4180,3,'SOUVENIRS');
  {g.fillStyle='#e8ecf0';g.fillRect(3300,GY-80,120,80);g.fillStyle='#a8c8e8';g.fillRect(3306,GY-76,108,24);for(let x=3310;x<3410;x+=12){g.fillStyle=['#e86a8a','#f0d060','#8ac8f0','#f0f0e8'][(x/12|0)%4];g.fillRect(x,GY-72,8,16)}g.fillStyle='#2a6ab8';g.fillRect(3300,GY-46,120,12);g.fillStyle='#fff';g.font='bold 9px '+F_DISP;g.textAlign='center';g.fillText('GLACES',3360,GY-37)}
  {g.fillStyle='#5a4030';g.fillRect(3800,GY-200,80,200);for(let y=GY-190;y<GY-10;y+=30){g.fillStyle='#e8e4d8';g.fillRect(3806,y,68,22);g.fillStyle='#2a2a2e';g.fillRect(3810,y+4,40,3);g.fillRect(3810,y+10,56,2);g.fillStyle='#c83a2a';g.fillRect(3858,y+4,12,8)}}
  const till=(a,b,regA,dispA)=>{g.fillStyle='#c8a050';g.fillRect(a,GY-80,b-a,80);g.fillStyle='#e8dcc0';g.fillRect(a,GY-82,b-a,8);g.fillStyle='#2a2c30';g.fillRect(regA,GY-120,60,40);g.fillStyle='#4ab060';g.fillRect(regA+8,GY-114,30,10);
    g.fillStyle='#d83020';g.fillRect(dispA,GY-160,60,80);g.fillStyle='#fff';g.font='bold 10px '+F_DISP;g.textAlign='center';g.fillText('CONFISERIE',dispA+30,GY-120);g.fillStyle='#2a2a2e';g.font='bold 12px '+F_DISP;g.fillText('CAISSE',(a+b)/2,GY-50)};
  till(4320,4640,4340,4580);till(7600,7920,7620,7860);
  // le couloir : les machines à café
  for(const x of[4900,5300]){g.fillStyle='#3a2e28';g.fillRect(x,GY-160,80,160);g.fillStyle='#1a1410';g.fillRect(x+10,GY-150,60,50);g.fillStyle='#c8a050';g.font='bold 9px '+F_DISP;g.textAlign='center';g.fillText('CAFÉ',x+40,GY-122);
    g.fillStyle='#d8d0c0';for(let k=0;k<6;k++)g.fillRect(x+12+(k%3)*20,GY-94+(k/3|0)*14,12,8);g.fillStyle='#0e0a08';g.fillRect(x+24,GY-60,32,34);g.fillStyle='#e8e4d8';g.fillRect(x+32,GY-38,16,12)}
  // le self : bar à salades (bacs, vitre, hotte), vitrines réfrigérées
  {const[a,b]=D.hood;g.fillStyle='#b8b0a0';g.fillRect(a,GY-120,b-a,120);g.fillStyle='#9a9080';g.fillRect(a,GY-124,b-a,6);
   for(let x=a+20;x<b-40;x+=60){g.fillStyle='#e8e8e0';g.fillRect(x,GY-134,48,14);g.fillStyle=['#5aa040','#c83a2a','#e0b020','#8ac860'][(x/60|0)%4];g.fillRect(x+3,GY-138,42,8)}
   g.fillStyle='#8a8478';g.fillRect(a,7*T,b-a,T);g.fillStyle='rgba(180,210,230,.35)';poly(g,[a+10,8*T,a+60,8*T,a+40,GY-120,a-10,GY-120]);g.fill();poly(g,[b-60,8*T,b-10,8*T,b+10,GY-120,b-40,GY-120]);g.fill();
   g.fillStyle='#fff';g.font='bold 11px '+F_DISP;g.textAlign='center';g.fillText('SALADES EN LIBRE-SERVICE',(a+b)/2,7*T+24)}
  {const a=6300,b=7400;g.fillStyle='#e0c040';g.fillRect(a,5*T,b-a,3*T);g.fillStyle='#2a2a2e';g.font='bold 16px '+F_DISP;g.textAlign='center';g.fillText('FRAIS — SANDWICHS — DESSERTS',(a+b)/2,6*T+30);
   g.fillStyle='rgba(200,225,245,.55)';g.fillRect(a,8*T,b-a,GY-T-8*T);g.fillStyle='rgba(255,255,255,.3)';for(let x=a;x<b;x+=110)g.fillRect(x,8*T,3,GY-T-8*T);
   for(let y=8*T+30;y<GY-T-10;y+=46){g.fillStyle='#c8ccd0';g.fillRect(a+6,y+30,b-a-12,3);for(let x=a+14;x<b-20;x+=26){g.fillStyle=['#e8d0a0','#f0f0e8','#c83a2a','#8a5a3a','#5aa040'][Math.floor(R()*5)];g.fillRect(x,y+10,18,20)}}
   g.fillStyle='#c8ccd0';g.fillRect(a,GY-T,b-a,T);g.fillStyle='#e0c040';g.fillRect(a,GY-T,b-a,5)}
  // la salle de restaurant : tables, chaises ; le pilier ; les toilettes (lavabo, cabines, fenêtre)
  for(const x of D.tables){g.fillStyle='#8a6a4a';g.fillRect(x,GY-80,120,10);g.fillStyle='#5a4030';g.fillRect(x+54,GY-70,12,70);g.fillRect(x+30,GY-4,60,4);
    for(const cx of[x-34,x+128]){g.fillStyle='#6a5a4a';g.fillRect(cx,GY-44,30,6);g.fillRect(cx+(cx<x?2:22),GY-80,6,40);g.fillRect(cx+2,GY-38,4,38);g.fillRect(cx+24,GY-38,4,38)}
    g.fillStyle='#e8e4d8';g.fillRect(x+16,GY-88,22,8);g.fillRect(x+80,GY-88,22,8)}
  g.fillStyle='#b8b0a0';g.fillRect(8680,GY-200,40,200);
  {g.fillStyle='#d8e0e4';g.fillRect(11040,CEIL+40,AIN.IN1-11040,GY-CEIL-40);for(let y=CEIL+40;y<GY;y+=30)for(let x=11040;x<AIN.IN1;x+=30){g.fillStyle='rgba(0,0,0,.06)';g.fillRect(x,y,1,30);g.fillRect(x,y,30,1)}
   g.fillStyle='#f0f0ec';g.beginPath();g.ellipse(11320,GY-110,40,12,0,0,7);g.fill();g.fillStyle='#c8c8c4';g.fillRect(11312,GY-100,16,100);g.fillStyle='#a8a8a4';g.fillRect(11316,GY-140,8,24);
   for(let x=11600;x<12400;x+=200){g.fillStyle='#9aa0a8';g.fillRect(x,GY-200,196,200);g.fillStyle='#8a9098';g.fillRect(x+4,GY-196,188,180);g.fillStyle='#5a6068';g.fillRect(x+160,GY-110,12,6)}
   g.fillStyle='#1a2030';g.fillRect(12440,5*T,40,3*T);g.fillStyle='rgba(120,150,200,.25)';g.fillRect(12440,5*T,40,3*T);g.fillStyle='#b8b0a0';g.fillRect(12436,8*T,48,6)}
  // dehors, derrière : les camions garés
  for(const[a,b,col]of[[13400,13840,'#2a5a9a'],[15800,16240,'#c8302a']]){g.fillStyle='#d8d8d0';g.fillRect(a,GY-120,b-a-100,100);g.fillStyle=col;rr(g,b-96,GY-112,96,92,10);g.fill();g.fillStyle='#1c2430';g.fillRect(b-80,GY-102,56,34);
    for(const wx of[a+50,a+100,b-170,b-50]){g.fillStyle='#121214';g.beginPath();g.arc(wx,GY-12,15,0,7);g.fill()}}
  return c;
}

/* ---------- après lecture ---------- */
function airePost(Lv){const D=Lv.def.aire;if(!D)return;
  const S={dogs:D.dogs.map(([x,a,b],i)=>({home:x,x:x-30,y:D.G0*T-34,w:60,h:34,vx:0,vy:0,onGround:true,a,b,st:'sleep',t:0,f:-1,wakeOnJump:!!D.wake[i]})),
    doorOpen:0,jump:D.jumpers.map(([a,b,y,h],i)=>({a,b,y0:y,h,t:i*2.1,x:a,y,f:1,st:'walk',k:'gros'})),beg:{x:D.beggar[0],f:1,t:0,y:D.G0*T,k:'moignon',st:'walk',beg:0},
    cash:D.cashiers.map(([a,b,top])=>({a,b,top,x:(a+b)/2,st:'idle',t:0,f:-1,seen:false})),tables:D.tables.map(x=>({x,on:0,hit:0})),said:{},grace:0,coffee:0,fridgeOpen:1,trucksGo:0};
  Lv.aire=S;
  for(let r=10;r<=13;r++)Lv.g[r][Math.floor(D.door[0]/T)]='X';
  Lv.acts=Lv.acts||[];
  Lv.acts.push({kind:'secret',style:'coffee',x:D.coffee,y:D.G0*T-160,open:0,t:0,used:false,q:["Un coup de bec sur le bouton… et ça coule, ça coule. Le café de l'arrière n'a pas changé : on en renverse plus qu'on n'en boit."]});
  Lv.acts.push({kind:'secret',style:'salad',x:D.salad,y:D.G0*T-3*T,open:0,t:0,used:false,noStraw:false,q:["Une petite fiente dans la salade. Elle sera meilleure comme ça. Au front, on appelait ça l'assaisonnement de la ligne."]});
  Lv.acts.push({kind:'secret',style:'fridge',x:D.fridge,y:D.G0*T-T,open:0,t:0,used:false,q:["On ne laisse pas la porte du frigo ouverte. C'est dans le règlement de toutes les cuisines du monde."]});
}
function aireAct(a){const S=L.aire;if(!S)return false;
  if(a.style==='coffee'&&!a.used){S.coffee=1;grantSecret(a,a.y-60);return true}
  if(a.style==='salad'&&!a.used){grantSecret(a,a.y-20);if(!G.sim)noise(.2,500,.1,'lowpass');return true}
  if(a.style==='fridge'&&!a.used){S.fridgeOpen=0;grantSecret(a,a.y-40);if(!G.sim){noise(.15,300,.3,'lowpass');tone(140,.12,'sine',.08)}return true}
  return false}
function aireStep(dt){const S=L.aire;if(!S)return;const D=L.def.aire,GY=D.G0*T,hb={x:P.x+3,y:P.y+4,w:P.w-6,h:P.h-6},pcx=P.x+P.w/2,pcy=P.y+P.h/2;let hit=null;
  // la porte automatique : il faut sauter devant le capteur
  {const[sx,sy]=D.sensor,dc=Math.floor(D.door[0]/T);if(!P.onGround&&pcx>sx-160&&pcx<sx+10&&P.y<sy+90){if(S.doorOpen<=0&&!G.sim)tone(1200,.08,'sine',.05);S.doorOpen=3.5}
   if(S.doorOpen>0){S.doorOpen-=dt;for(let r=10;r<=13;r++)L.g[r][dc]='.'}else if(!(pcx>D.door[0]-10&&pcx<D.door[1]+10))for(let r=10;r<=13;r++)L.g[r][dc]='X';
   if(!S.said.porte&&!G.sim&&pcx>D.door[0]-260&&pcx<D.door[0]&&P.onGround){S.said.porte=1;say("Une porte qui s'ouvre toute seule… mais pas pour les pigeons. Le petit œil, là-haut : il faut qu'il me voie passer.",4.2)}}
  // les chiens errants : ils dorment ; un saut à proximité (ou la fenêtre) les réveille ; ils poursuivent sur leur terrain
  for(const d of S.dogs){d.t+=dt;const dx=pcx-(d.x+d.w/2);
    if(d.st==='sleep'){const near=Math.abs(dx)<300&&Math.abs(pcy-d.y)<200;
      if((d.wakeOnJump&&near&&!P.onGround&&P.vy<0)||(!d.wakeOnJump&&pcx>D.window+50&&pcx<d.b&&P.onGround)){d.st='wake';d.t=0;if(!G.sim){tone(220,.15,'sawtooth',.08);tone(180,.2,'sawtooth',.08,null,.18);bubble(d.x+d.w/2,d.y-20,'Ouaf ! Ouaf !','#4a3a2a')}}continue}
    if(d.st==='wake'){if(d.t>.6){d.st='chase';d.t=0}continue}
    if(d.st==='back'){const h=d.home-30-d.x;d.vx=clamp(h*3,-120,120);d.f=Math.sign(d.vx)||d.f;if(Math.abs(h)<4){d.st='sleep';d.vx=0}}
    else{const inT=pcx>d.a&&pcx<d.b,reach=P.y+P.h>d.y-110;d.f=Math.sign(dx)||1;
      if(!inT||(!reach&&d.t>3)){d.st='back';d.t=0;if(!G.sim)bubble(d.x+d.w/2,d.y-20,'Grrr…','#4a3a2a')}
      else{d.vx=d.f*265;if(reach)d.t=0;if(d.onGround&&Math.abs(dx)<130&&P.y+P.h<d.y+d.h-10&&P.y+P.h>d.y-110){d.vy=-620;d.onGround=false}}}
    d.vy=Math.min(MAXFALL,d.vy+GRAV*dt);const ox=d.x;moveX(d,d.vx*dt);d.x=clamp(d.x,d.a-20,d.b);d.onGround=false;moveY(d,d.vy*dt);
    if(d.st==='chase'&&Math.abs(d.x-ox)<.5&&d.onGround&&Math.abs(dx)>40){d.t+=dt*2}
    if(d.st!=='sleep'&&!P.dead&&overlap(hb,{x:d.x+6,y:d.y+4,w:d.w-12,h:d.h-6}))hit='chien'}
  if(!S.said.chiens&&!G.sim&&S.dogs.slice(0,2).some(d=>d.st==='chase')){S.said.chiens=1;say("Je les ai réveillés. Règlement, article 192 ter : en cas de chiens, courir plus vite que le plus lent des deux.",4)}
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
  for(const cx of D.customers){const near=Math.abs(pcx-cx)<110||S.jump.some(o=>o.st==='fly'&&Math.abs(o.x-cx)<120);const k='cu'+cx;
    if(near&&!(S[k]>0)&&!G.sim){S[k]=2.4;bubble(cx,GY-150,pick(['Pigeon !','Un pigeon ! Là !','Aaah, un pigeon !']),'#2a3a5a')}S[k]=Math.max(0,(S[k]||0)-dt);
    if(!P.dead&&overlap(hb,{x:cx-12,y:GY-(near?130:100),w:24,h:near?130:100}))hit='client'}
  // les caissières : elles tapent quand Raymond est sur le comptoir
  for(const w of S.cash){w.t+=dt;const on=pcx>w.a-80&&pcx<w.b+80&&P.y+P.h<=w.top+2&&P.y+P.h>w.top-90;
    if(on&&!w.seen){w.seen=true;if(!G.sim)bubble(w.x,w.top-100,"Pas sur mon comptoir, sale bête !",'#2a2420')}if(!on)w.seen=false;
    if(w.st==='idle'||w.st==='cool'){if(w.seen){const d=clamp(pcx,w.a,w.b)-w.x;w.x+=clamp(d,-190*dt,190*dt);if(Math.abs(d)>2)w.f=Math.sign(d)}if(w.st==='cool'&&w.t>.4){w.st='idle';w.t=0}
      if(w.st==='idle'&&w.seen&&Math.abs(w.x-pcx)<60){w.st='wind';w.t=0;if(!G.sim&&rnd()<.5)bubble(w.x,w.top-100,pick(["Ouste !","Dehors !","Ah non !"]),'#2a2420')}}
    else if(w.st==='wind'&&w.t>.28){w.st='strike';w.t=0;if(!G.sim)noise(.1,1500,.25,'bandpass')}
    else if(w.st==='strike'){if(!P.dead&&Math.abs(w.x+w.f*20-pcx)<44&&P.y+P.h<=w.top+2&&P.y+P.h>w.top-80)hit='caissiere';if(w.t>.15){w.st='cool';w.t=0}}}
  // la hotte du bar à salades : des pics anti-pigeons sur le dessus
  {const[a,b]=D.hood;if(!P.dead&&overlap(hb,{x:a,y:7*T-18,w:b-a,h:16}))hit='spikes'}
  // la salle : les dîneurs tapent sur la table où Raymond s'est posé ; on ne les touche pas non plus
  for(const tb of S.tables){const on=P.onGround&&pcx>tb.x&&pcx<tb.x+120&&Math.abs(P.y+P.h-(GY-2*T))<3;if(on){tb.on+=dt;if(tb.on>.55&&tb.hit<=0){tb.hit=.3;tb.on=0;if(!G.sim){noise(.12,400,.3,'lowpass');G.shake=Math.max(G.shake||0,2);bubble(tb.x+60,GY-150,pick(['Bam !','Dégage !','Sur la table ?!']),'#2a2420')}}}else tb.on=0;
    if(tb.hit>0){tb.hit-=dt;if(on&&!P.dead)hit='dineur'}
    for(const cx of[tb.x-20,tb.x+140])if(!P.dead&&overlap(hb,{x:cx-12,y:GY-84,w:24,h:84}))hit='dineur'}
  // la fenêtre des toilettes : le chien du parking se réveille
  if(!S.said.fenetre&&!G.sim&&pcx>D.window-200&&P.y<8*T){S.said.fenetre=1;say("La fenêtre des toilettes. La sortie des artistes, et des pigeons.",3.4)}
  if(!S.said.camion&&!G.sim&&pcx>15500){S.said.camion=1;say("Un camion qui chauffe son moteur. Si je suis dessus quand il part, je quitte l'aire.",3.8)}
  if(S.grace>0){S.grace-=dt;hit=null}
  if(hit)G.aireHit=hit;
}
function aireAfterMove(){if(G.aireHit){const k=G.aireHit;G.aireHit=null;return k}return null}
function aireRespawn(){const S=L.aire;if(!S)return;S.grace=1.6;for(const d of S.dogs){d.st='sleep';d.x=d.home-30;d.y=L.def.aire.G0*T-34;d.vx=d.vy=0}for(const w of S.cash){w.st='idle';w.seen=false}for(const tb of S.tables){tb.on=0;tb.hit=0}}
function aireLights(){const S=L.aire;if(!S)return[];const D=L.def.aire,GY=D.G0*T,out=[];
  for(let x=200;x<AIN.IN0;x+=560)out.push({x:x+50,y:GY-280,r:230,i:.75,warm:1});for(let x=AIN.IN1+200;x<L.wpx;x+=560)out.push({x:x+50,y:GY-280,r:230,i:.75,warm:1});
  for(let x=760;x<1500;x+=170)out.push({x,y:280,r:220,i:.9});
  for(let x=AIN.IN0+120;x<AIN.IN1;x+=240)out.push({x,y:300,r:330,i:1});
  out.push({x:16200,y:GY-60,r:200,i:.7});return out}

/* ---------- dessin ---------- */
function drawAireBack(t,cx){const ly=L.aireLayer;if(!ly)return;const tr=ly.rs||1,sx=Math.max(0,cx-30),sw=Math.min(W+80,ly.width/tr-sx);if(sw>0)blitLayer(ctx,ly,sx*tr,0,sw*tr,ly.height,sx,-PAD,sw,ly.height/tr)}
function drawAireMid(t){const S=L.aire;if(!S)return;const g=ctx,D=L.def.aire,GY=D.G0*T,a0=cam.x-200,a1=cam.x+W+200,vis=x=>x>a0&&x<a1;
  // le carrelage du sol, à l'intérieur
  {const a=Math.max(AIN.IN0,a0),b=Math.min(AIN.IN1,a1);if(b>a){g.fillStyle='#b8b0a0';g.fillRect(a,GY,b-a,6);g.fillStyle='rgba(0,0,0,.12)';for(let x=Math.floor(a/40)*40;x<b;x+=40)g.fillRect(x,GY,1,6)}}
  // la porte automatique
  if(vis(D.door[0])){const op=Math.min(1,Math.max(0,S.doorOpen)*2);g.fillStyle='rgba(150,190,220,.45)';g.fillRect(D.door[0],10*T,D.door[1]-D.door[0]-op*30,GY-10*T);g.strokeStyle='#3a3e46';g.lineWidth=3;g.strokeRect(D.door[0],10*T,D.door[1]-D.door[0],GY-10*T);
    const[sx,sy]=D.sensor;g.fillStyle=S.doorOpen>0?'#4ae060':'#d83020';g.beginPath();g.arc(sx,sy+6,4,0,7);g.fill()}
  // les ventilateurs du plafond
  for(let x=AIN.IN0+300;x<AIN.IN1-100;x+=520)if(vis(x)){g.fillStyle='#3a3a3e';g.fillRect(x-2,4*T+40,4,24);g.save();g.translate(x,4*T+66);g.scale(1,.22);g.rotate(t*9);g.fillStyle='#5a5048';for(let k=0;k<4;k++){g.rotate(Math.PI/2);g.fillRect(0,-6,62,12)}g.restore()}
  // chiens
  for(const d of S.dogs)if(vis(d.x))aireDog(g,d,t);
  // pigeons : mendiant, sauteurs
  if(vis(S.beg.x))drawUglyPigeon(g,S.beg,t);for(const o of S.jump)if(vis(o.x))drawUglyPigeon(g,o,t);
  // clients
  for(const[ci,cx]of D.customers.entries())if(vis(cx)){const up=(S['cu'+cx]||0)>0;aireHuman(g,cx,GY,t,{coat:ci%2?'#3a5a8a':'#6a3a5a',arms:up,f:cx<4000?-1:1})}
  // caissières
  for(const w of S.cash)if(vis(w.x)){aireHuman(g,w.x,GY-30,t,{coat:'#c83a2a',arms:w.st==='wind'||w.st==='strike',strike:w.st==='strike',f:w.f,short:1})}
  // dîneurs assis
  for(const tb of S.tables)if(vis(tb.x))for(const[cx,f]of[[tb.x-20,1],[tb.x+140,-1]])aireDiner(g,cx,GY,t,f,tb.hit>0,(tb.x/600|0)+cx);
  // le café qui coule
  if(S.coffee&&vis(D.coffee)){S.coffee=Math.min(1,S.coffee);g.fillStyle='#3a1e0e';g.fillRect(D.coffee-2,GY-60,4,58+Math.sin(t*20));g.beginPath();g.ellipse(D.coffee+10,GY-1,70,4,0,0,7);g.fill();g.fillStyle='rgba(255,230,200,.25)';g.fillRect(D.coffee-2,GY-60,1,58);g.fillStyle='rgba(240,230,220,.3)';for(let k=0;k<3;k++){const ph=(t*.5+k/3)%1;g.beginPath();g.arc(D.coffee-10+k*14,GY-10-ph*40,4+ph*6,0,7);g.fill()}}
  // les pics de la hotte
  {const[a,b]=D.hood;if(b>a0&&a<a1){g.fillStyle='#2a2c32';g.fillRect(a,7*T-4,b-a,4);g.strokeStyle='#c8ced6';g.lineWidth=1.4;for(let x=a+3;x<b;x+=5){g.beginPath();g.moveTo(x,7*T-4);g.lineTo(x+Math.sin(x)*2,7*T-18);g.stroke()}}}
  // la porte de la vitrine restée ouverte
  if(vis(D.fridge)){g.fillStyle='rgba(210,235,250,.65)';g.strokeStyle='#8a9098';g.lineWidth=2;if(S.fridgeOpen){poly(g,[D.fridge-50,8*T,D.fridge-50,GY-T,D.fridge+20,GY-T-20,D.fridge+20,8*T+20]);g.fill();g.stroke();g.fillStyle='rgba(200,230,255,.25)';for(let k=0;k<3;k++){const ph=(t*.4+k/3)%1;g.beginPath();g.arc(D.fridge-10+k*12,GY-T-10-ph*20,8,0,7);g.fill()}}}
  // le dernier camion : il chauffe, fume
  if(vis(16200))for(let k=0;k<4;k++){const ph=(t*.9+k/4)%1;g.fillStyle='rgba(160,160,160,'+(.35*(1-ph))+')';g.beginPath();g.arc(15790-ph*30,GY-30-ph*40,5+ph*12,0,7);g.fill()}
}
function aireDog(g,d,t){const x=d.x+d.w/2,y=d.y+d.h,f=d.f,run=d.st==='chase'||d.st==='back',sl=d.st==='sleep',ph=run?t*16:0;g.save();g.translate(x,y);g.scale(f,1);
  const fur='#8a6a4a',dark='#5a4030';
  if(sl){g.fillStyle=fur;g.beginPath();g.ellipse(0,-12,28,12,0,0,7);g.fill();g.beginPath();g.ellipse(22,-10,12,9,0,0,7);g.fill();g.fillStyle=dark;g.beginPath();g.ellipse(16,-18,6,4,.4,0,7);g.fill();
    g.strokeStyle=fur;g.lineWidth=4;g.beginPath();g.moveTo(-26,-8);g.quadraticCurveTo(-36,-2,-30,2);g.stroke();
    g.fillStyle='rgba(255,255,255,.7)';g.font='bold 12px '+F_DISP;g.textAlign='center';g.scale(f,1);g.fillText('z'+(Math.sin(t*2)>0?'z':''),f*10,-32);g.restore();return}
  g.strokeStyle=fur;g.lineWidth=5;g.lineCap='round';for(const[px,o]of[[-16,0],[-8,Math.PI],[12,Math.PI/2],[18,Math.PI*1.5]]){const s=run?Math.sin(ph+o)*8:0;g.beginPath();g.moveTo(px,-16);g.lineTo(px+s,-1);g.stroke()}
  g.fillStyle=fur;g.beginPath();g.ellipse(0,-22,24,11,0,0,7);g.fill();g.beginPath();g.ellipse(26,-30,11,9,-.3,0,7);g.fill();g.beginPath();g.ellipse(36,-27,8,5,0,0,7);g.fill();
  g.fillStyle=dark;poly(g,[20,-36,24,-48,28,-36]);g.fill();g.fillStyle='#111';g.beginPath();g.arc(42,-28,2.4,0,7);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(29,-32,2,0,7);g.fill();
  if(run){g.fillStyle='#f0f0e8';poly(g,[33,-24,36,-20,39,-24]);g.fill();g.fillStyle='#c83a3a';g.fillRect(34,-24,6,3)}
  g.strokeStyle=fur;g.lineWidth=4;g.beginPath();g.moveTo(-22,-26);g.quadraticCurveTo(-34,-36+Math.sin(t*12)*6,-36,-42);g.stroke();g.lineCap='butt';g.restore()}
function aireHuman(g,x,y,t,o){g.save();g.translate(x,y);g.scale(o.f||1,1);const sh=o.short?.75:1;
  if(!o.short){g.strokeStyle='#2a2c34';g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(-4,-46);g.lineTo(-5,-4);g.moveTo(4,-46);g.lineTo(5,-4);g.stroke()}
  g.fillStyle=o.coat;rr(g,-12,-94,24,52,8);g.fill();g.fillStyle='#e8c8a8';g.beginPath();g.arc(2,-104,10,0,7);g.fill();g.fillStyle='#3a2a1a';g.beginPath();g.arc(2,-108,10,Math.PI,0);g.fill();
  g.strokeStyle=o.coat;g.lineWidth=6;g.lineCap='round';
  if(o.strike){g.beginPath();g.moveTo(6,-86);g.lineTo(26,-72);g.stroke();g.fillStyle='#5a3a2a';g.fillRect(22,-80,16,10)}
  else if(o.arms){g.beginPath();g.moveTo(6,-86);g.lineTo(14,-124+Math.sin(t*14)*4);g.moveTo(-6,-86);g.lineTo(-14,-122-Math.sin(t*14)*4);g.stroke();g.fillStyle='#2a1a1a';g.beginPath();g.ellipse(8,-100,3,4,0,0,7);g.fill()}
  else{g.beginPath();g.moveTo(6,-86);g.lineTo(9,-56);g.moveTo(-6,-86);g.lineTo(-8,-56);g.stroke()}
  g.lineCap='butt';g.restore()}
function aireDiner(g,x,y,t,f,hit,seed){g.save();g.translate(x,y-40);g.scale(f,1);const col=['#3a6a4a','#6a3a3a','#3a4a7a','#7a6a3a'][seed%4];
  g.fillStyle=col;rr(g,-12,-48,24,46,8);g.fill();g.fillStyle='#2a2c34';g.fillRect(-10,-4,26,8);g.fillStyle='#e8c8a8';g.beginPath();g.arc(2,-58,10,0,7);g.fill();g.fillStyle=['#3a2a1a','#c8a060','#1a1a1a','#8a8a8a'][seed%4];g.beginPath();g.arc(2,-62,10,Math.PI,0);g.fill();
  g.strokeStyle=col;g.lineWidth=6;g.lineCap='round';g.beginPath();g.moveTo(6,-40);if(hit)g.lineTo(26,-46-Math.abs(Math.sin(t*30))*8);else g.lineTo(22,-32+Math.sin(t*2+seed)*2);g.stroke();
  if(hit){g.fillStyle='#e8c8a8';g.beginPath();g.arc(27,-46,5,0,7);g.fill()}g.lineCap='butt';g.restore()}
