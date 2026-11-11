/* =========================================================
   SOUVENIRS DE 1916 — 2-1 (Le sentier) et 2-3 (La zone rouge)
   ---------------------------------------------------------
   À quelques endroits, Raymond se souvient de mars 1916 : il n'était pas libre, il était dans son panier,
   porté par Lucien. Ces souvenirs sont des vignettes comme au 4-3 (on ne bouge pas ; l'action fait réagir Lucien) :
     · route  (2-1, les champs) : la montée vers Bras, sous la pluie, avec les copains de Lucien ;
     · bois   (2-1, le bois)    : un barrage dans le bois ; Lucien couvre le panier de sa capote ;
     · gaz    (2-3, la tranchée) : alerte aux gaz au Mort-Homme ; Lucien met son masque et couvre le panier d'un linge mouillé.
   Et la tranchée de 2-1, en mars 1916, se joue : Raymond s'échappe du panier (action), passe par les sapes en sautant
   et en volant pour que Lucien ne le remette pas au panier, fouille deux musettes (des graines : le secret ; la médaille),
   puis le dernier soldat sort un petit filet : un intertitre, et l'on revient en 2026.
   Ces souvenirs ne se voient qu'avec la touche d'époque (B), donc seulement une fois le 4-4 fait : rien ne se déclenche tout seul.
   ========================================================= */
const LUC_FACE={skin:'#ecc8a6',hair:'#cfae6a',stache:'croc',beardCol:'#b8954e',helmet:'adrian',ex:'sad',young:1,stubble:.35,eye:'#3f78b8',tired:1,look:[.75,.3]};
const S16_MATES=[{skin:VX_SKIN[3],hair:VX_HAIR[0],stache:'walrus',helmet:'adrian',ex:'neutral',stubble:.7},{skin:VX_SKIN[1],hair:VX_HAIR[4],stache:'up',helmet:'adrian',ex:'neutral',stubble:.5,beard:1},{skin:VX_SKIN[5],hair:VX_HAIR[2],helmet:'adrian',ex:'neutral',stubble:.8}];

/* ---------- les vignettes ---------- */
const SV16={
  route:{place:/*v2*/'Sur la route de Bras · mars 1916',
    lines:[[1,/*v2*/"Il pèse lourd, ton panier, Vasseur ?"],[0,/*v2*/"Moins que le sac. Et lui, au moins, il ne se plaint pas."],[2,/*v2*/"On dit que ça tape dur, du côté du Mort-Homme."],[0,/*v2*/"Tiens bon, Raymond. On arrive bientôt."]],
    peck:/*v2*/"Oui, oui, je sais. Toi aussi, tu voudrais marcher.",
    end:/*v2*/"Lucien me portait sur cette route-là, dans mon panier. Je n'avais jamais vu tant d'hommes marcher dans le même sens."},
  bois:{place:/*v2*/'Le bois · mars 1916',
    lines:[[1,/*v2*/"Baissez-vous ! Ça arrive !"],[0,/*v2*/"Je le tiens. Ça ira."],[2,/*v2*/"Tu parles à ton pigeon plus qu'à nous, Vasseur."],[0,/*v2*/"Lui, il m'écoute."]],
    peck:/*v2*/"Chut… pas maintenant, mon vieux.",
    end:/*v2*/"Le bois tremblait. Lucien avait mis sa capote sur mon panier. Je n'entendais plus que son cœur."},
  gaz:{place:/*v2*/'Le Mort-Homme · avril 1916',
    lines:[[1,/*v2*/"Les gaz ! Les gaz ! Masques !"],[0,/*v2*/"Le linge, vite, le linge mouillé ! Pour le pigeon !"],[2,/*v2*/"Il a un masque, lui aussi, ton pigeon ?"],[0,/*v2*/"Il a moi."]],
    peck:/*v2*/"Ne bouge pas, Raymond. Respire doucement.",
    end:/*v2*/"Le linge sentait le vinaigre. Dehors, tout était jaune. Lucien ne m'a pas lâché une seconde."}
};
const SV_GAZ_CARDS=[
  {t:/*v2*/"Avril 1916. Sur la colline du Mort-Homme, au nord-ouest de Verdun, les Allemands attaquent sans relâche. Avec les obus ordinaires, ils tirent des obus à gaz.",minT:1.2},
  {t:/*v2*/"Le gaz est plus lourd que l'air : il coule par-dessus le parapet et reste au fond des tranchées. Quand une sentinelle le voit venir, elle frappe une douille d'obus pendue à un piquet.",minT:1.2},
  {t:/*v2*/"Les hommes ont un masque. Les pigeons n'en ont pas : il faut un linge mouillé sur le panier. Raymond se souvient que, ce jour-là, Lucien a pensé au panier avant de penser à lui-même.",minT:1.2}];
let SV=null;
function svActive(){return!!(SV&&L&&(L.s16||L.zr16))}
function svStart(k){achB(k);SV={k,t:0,i:0,next:1.4,bub:[],fade:1,out:null,peckT:0,peckCool:0,rain:[]};G.quip=null;G.quipQ=[];MUS_OLD=true;
  if(!G.sim){noise(.9,900,.18,'bandpass',0,.6);tone(392,.5,'sine',.05,262,.02)}}
function svUpdate(dt){const s=SV,d=SV16[s.k];s.t+=dt;s.fade=Math.max(0,s.fade-dt*1.5);s.peckT=Math.max(0,s.peckT-dt);s.peckCool-=dt;
  for(const b of s.bub)b.t+=dt;s.bub=s.bub.filter(b=>b.t<b.max);
  if(s.i<d.lines.length&&s.t>=s.next){const[w,txt]=d.lines[s.i];s.bub.push({who:w,text:txt,t:0,max:Math.max(2.8,1.4+txt.length*.055)});s.next=s.t+Math.max(3,1.6+txt.length*.06);s.i++;
    if(s.k==='bois'&&s.i===1&&!G.sim){SFX.thunder&&SFX.thunder(.6);s.boom=1}}
  if(s.boom>0)s.boom-=dt*1.5;
  if(s.k==='gaz'&&s.t<6&&!G.sim){s.gong=(s.gong||0)-dt;if(s.gong<=0){s.gong=.45;tone(620,.35,'triangle',.05,600)}}
  if(pressed.has('act')&&s.peckCool<=0&&!s.out){s.peckT=.5;s.peckCool=3;if(!G.sim)noise(.08,2200,.12,'bandpass');s.bub.push({who:0,text:d.peck,t:0,max:3})}
  if(s.i>=d.lines.length&&s.t>s.next+.6&&!s.out)s.out={t:0};
  if(s.out){s.out.t+=dt;if(s.out.t>1){const e=d.end;SV=null;MUS_OLD=false;G.fade=1;if(L.s16)L.s16.flash=1;say(e,4.6)}}}
function svRender(t){const s=SV,g=ctx;g.save();
  if(s.k==='route')svRoute(g,t,s);else if(s.k==='bois')svBois(g,t,s);else svGaz(g,t,s);
  // les bulles
  for(const b of s.bub){const p=s.who[b.who];if(!p)continue;const a=Math.min(1,b.t*6,(b.max-b.t)*4);g.save();g.globalAlpha=a;g.font='italic 17px '+F_BODY;const lines=wrap(g,b.text,250);const w=Math.max(...lines.map(l=>g.measureText(l).width))+26,h=lines.length*21+16;
    const bx=clamp(p.x-w/2,10,W-w-10),by=p.y-h-14-b.t*4;g.fillStyle='#f4ecd8';rr(g,bx,by,w,h,10);g.fill();g.beginPath();g.moveTo(p.x-8,by+h);g.lineTo(p.x+2,by+h+12);g.lineTo(p.x+10,by+h);g.fill();
    g.fillStyle='#2a2420';g.textAlign='left';lines.forEach((l,k)=>g.fillText(l,bx+13,by+24+k*21));g.restore()}
  // sépia, vignettage, le lieu et la date
  g.fillStyle='rgba(120,90,50,.16)';g.fillRect(0,0,W,H);const vg=g.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.85);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.55)');g.fillStyle=vg;g.fillRect(0,0,W,H);
  g.globalAlpha=.7;g.fillStyle='#efe5cc';g.font='italic 15px '+F_BODY;g.textAlign='left';g.fillText(SV16[s.k].place,20,H-20);g.globalAlpha=1;
  const f=Math.max(s.fade,s.out?Math.min(1,s.out.t):0);if(f>0){g.fillStyle='rgba(236,232,222,'+f+')';g.fillRect(0,0,W,H)}
  g.restore()}
/* Lucien et son panier : la main proche tient l'anse ; Raymond regarde par la lucarne */
function svLucien(g,t,s,x,y,pose,o){o=o||{};const peck=s.peckT>0;
  const face=Object.assign({},LUC_FACE,{look:peck?[.6,.8]:LUC_FACE.look,ex:peck?'smile':o.ex||'sad'},o.face||{});
  const j=vxSoldier(g,{x,y,hip:o.hip,s:o.sc||9.4,f:1,side:'fr',t,pose,face,kit:o.kit||{musette:1,bidon:1,pack:o.pack},regt:'142'});
  const bx=o.bx!=null?o.bx(j):j.nh.x+4,by=o.by!=null?o.by(j):j.nh.y+30;
  vxBasket(g,bx,by,o.bw||40,o.bh||28,{win:6,big:1,inside:(g2,lx,ly)=>{g2.save();g2.beginPath();g2.rect(lx-10,ly-14,20,17);g2.clip();drawRaymond(g2,lx-9+(peck?4:0),ly+19,{f:1,t,wear:0,size:.78});g2.restore()}});
  return j}
function svMate(g,t,i,x,y,pose,o){o=o||{};return vxSoldier(g,{x,y,hip:o.hip,s:o.sc||9.2,f:o.f||1,side:'fr',t,pose,face:Object.assign({},S16_MATES[i],o.face||{}),kit:{musette:1,bidon:1,pack:1},rifle:o.rifle})}
function svRoute(g,t,s){const u=t*46;
  const sk=g.createLinearGradient(0,0,0,H);sk.addColorStop(0,'#5a5a58');sk.addColorStop(1,'#8a8478');g.fillStyle=sk;g.fillRect(0,0,W,H);
  // au loin : arbres hachés, poteaux, une colonne qui monte
  for(let k=0;k<14;k++){const x=((k*97-u*.25)%1100+1100)%1100-70;g.strokeStyle='#4a4640';g.lineWidth=4;g.beginPath();g.moveTo(x,330);g.lineTo(x+4,250+(k%3)*20);g.stroke();g.lineWidth=2;g.beginPath();g.moveTo(x+2,290);g.lineTo(x+16,276);g.stroke()}
  g.fillStyle='#6a6458';g.fillRect(0,330,W,40);for(let k=0;k<30;k++){const x=((k*41-u*.4)%1000+1000)%1000-20;g.fillStyle='#3e3a34';g.fillRect(x,322,5,12);g.beginPath();g.arc(x+2,318,4,0,7);g.fill()}
  // la route boueuse, ses ornières et ses flaques
  g.fillStyle='#5a4630';g.fillRect(0,370,W,H-370);g.fillStyle='#4a3a28';for(let k=0;k<4;k++)g.fillRect(0,400+k*34,W,6);
  for(let k=0;k<8;k++){const x=((k*173-u)%1200+1200)%1200-100;g.fillStyle='rgba(150,160,170,.35)';g.beginPath();g.ellipse(x,470+(k%3)*20,50,7,0,0,7);g.fill()}
  // les hommes en marche ; Lucien porte le panier
  s.who=[];const gy=470,wk=t*5.2;
  const m1=svMate(g,t,1,170,gy,vxWalk(wk+1.7,.7),{rifle:{a:-1.2,from:'far',back:1}});s.who[1]={x:170,y:m1.head.y-30};
  const L1=svLucien(g,t,s,410,gy,Object.assign(vxWalk(wk,.7),{nT:{x:2.6,y:-1.2},fT:{x:1.2,y:-1.4}}),{pack:1,bx:j=>j.nh.x+6,by:j=>j.nh.y+26});s.who[0]={x:410,y:L1.head.y-30};
  const m2=svMate(g,t,2,640,gy,vxWalk(wk+3.1,.7),{rifle:{a:-1.2,from:'far',back:1}});s.who[2]={x:640,y:m2.head.y-30};
  svMate(g,t,0,840,gy+6,vxWalk(wk+.6,.7),{sc:8.6,rifle:{a:-1.2,from:'far',back:1}});
  // la pluie
  g.strokeStyle='rgba(210,215,225,.35)';g.lineWidth=1;for(let k=0;k<90;k++){const x=(k*53+t*60)%W,y=(k*97+t*620)%H;g.beginPath();g.moveTo(x,y);g.lineTo(x-4,y+14);g.stroke()}}
function svBois(g,t,s){const fl=Math.max(0,s.boom||0)+Math.max(0,Math.sin(t*1.7))*.15*(Math.sin(t*5.3)>.8?1:0);
  g.fillStyle=mix('#14161a','#c8a070',Math.min(1,fl*.6));g.fillRect(0,0,W,H);
  for(let k=0;k<11;k++){const x=k*95+20;g.fillStyle='#0c0d0e';g.fillRect(x,40+(k%3)*30,10+(k%2)*6,330);g.strokeStyle='#0c0d0e';g.lineWidth=4;g.beginPath();g.moveTo(x+6,150);g.lineTo(x+40,120+(k%4)*10);g.stroke()}
  // le trou d'obus : on s'y tasse
  g.fillStyle='#2a221a';g.beginPath();g.ellipse(W/2,500,420,120,0,Math.PI,0);g.fill();g.fillStyle='#3a2e22';g.fillRect(0,440,W,H-440);g.fillStyle='#241c16';g.beginPath();g.ellipse(W/2,470,330,60,0,0,7);g.fill();
  s.who=[];const gy=486;
  const m1=svMate(g,t,1,250,gy,Object.assign({},VX_P.kneel,{lean:.35,head:.4}),{});s.who[1]={x:250,y:m1.head.y-30};
  const L1=svLucien(g,t,s,0,0,Object.assign({},VX_P.sit,{lean:.32,head:.55,nT:{x:3.4,y:-1.4},fT:{x:3.8,y:-1.0}}),{hip:{x:470,y:gy-40},bx:j=>j.hip.x+28,by:j=>j.hip.y-2});s.who[0]={x:480,y:L1.head.y-30};
  // la capote jetée sur le panier pendant le barrage
  if(s.i>=2){g.fillStyle='#73879d';g.beginPath();g.moveTo(476,gy-70);g.quadraticCurveTo(512,gy-90,548,gy-56);g.lineTo(540,gy-30);g.lineTo(482,gy-34);g.closePath();g.fill()}
  const m2=svMate(g,t,2,700,gy,Object.assign({},VX_P.sit,{lean:.2,head:-.2}),{hip:{x:700,y:gy-40},f:-1});s.who[2]={x:700,y:m2.head.y-30};
  if(fl>.3){g.fillStyle='rgba(255,220,160,'+(fl*.25)+')';g.fillRect(0,0,W,H)}
  for(let k=0;k<30;k++){const ph=(t*.3+k/30)%1;g.fillStyle='rgba(40,30,20,.6)';g.fillRect((k*67)%W,ph*H,3,3)}}
function svGaz(g,t,s){const gz=Math.min(1,s.t/3);
  // le ciel sale, les éclatements au loin ; le nuage jaune-vert qui arrive par la gauche et passe le parapet
  const sk=g.createLinearGradient(0,0,0,150);sk.addColorStop(0,'#4a4a44');sk.addColorStop(1,'#7a7462');g.fillStyle=sk;g.fillRect(0,0,W,150);
  for(let k=0;k<4;k++){const ph=((t*.4+k*.27)%1),x=((k*260+80)%W);g.fillStyle='rgba(60,56,50,'+(.6*(1-ph))+')';g.beginPath();g.arc(x,90-ph*40,14+ph*30,0,7);g.fill()}
  for(let k=0;k<10;k++){const x=-200+gz*(W+200)*.9-k*90+Math.sin(t*.7+k)*16,y=70+(k%3)*22;const cg=g.createRadialGradient(x,y,6,x,y,90);cg.addColorStop(0,'rgba(196,196,90,'+(.55*gz)+')');cg.addColorStop(1,'rgba(196,196,90,0)');g.fillStyle=cg;g.beginPath();g.arc(x,y,90,0,7);g.fill()}
  // les barbelés et leurs piquets, sur le parapet
  for(let x=10;x<W;x+=110){g.strokeStyle='#2a2620';g.lineWidth=4;g.beginPath();g.moveTo(x,124);g.lineTo(x+6,74);g.stroke()}
  g.strokeStyle='rgba(40,36,30,.9)';g.lineWidth=1.4;for(const y0 of[84,100,114]){g.beginPath();for(let x=0;x<=W;x+=14)g.lineTo(x,y0+Math.sin(x*.2)*4);g.stroke()}
  // la paroi de la tranchée : sacs de terre, clayonnage, piquets
  for(let x=-10;x<W;x+=46){g.fillStyle=(x/46|0)%2?'#8a7a56':'#7a6a4a';rr(g,x,118,44,24,8);g.fill();g.fillStyle=(x/46|0)%2?'#7a6a4a':'#8a7a56';rr(g,x+22,96,44,24,8);g.fill()}
  g.fillStyle='#4a3a28';g.fillRect(0,142,W,318);
  for(let y=150;y<450;y+=10){g.strokeStyle=(y/10|0)%2?'#5e4a32':'#3e3020';g.lineWidth=7;g.beginPath();for(let x=0;x<=W;x+=36)g.lineTo(x,y+((x/36|0)%2?3:-3));g.stroke()}
  for(let x=20;x<W;x+=130){g.fillStyle='#2e2216';g.fillRect(x,140,10,320)}
  // la banquette de tir, une niche à munitions, les masques pendus au clou, les fusils appuyés
  g.fillStyle='#5a4630';g.fillRect(0,400,W,60);g.fillStyle='#6a5438';g.fillRect(0,400,W,6);
  g.fillStyle='#1e1810';g.fillRect(800,300,110,90);for(const[x,w]of[[808,40],[852,48]]){g.fillStyle='#6a4e30';g.fillRect(x,350,w,40);g.strokeStyle='#4a3420';g.lineWidth=2;g.strokeRect(x+2,352,w-4,36)}
  for(const x of[330,360,610,640]){g.fillStyle='#2a2018';g.beginPath();g.arc(x,186,3,0,7);g.fill();g.fillStyle='#6e6a50';rr(g,x-9,190,18,24,4);g.fill();g.strokeStyle='#4a4632';g.lineWidth=1.5;g.beginPath();g.moveTo(x,186);g.lineTo(x,192);g.stroke()}
  for(const x of[560,575,590]){g.save();g.translate(x,456);g.rotate(-.14);g.fillStyle='#4a3020';g.fillRect(-3,-150,6,90);g.fillStyle='#2a2a2a';g.fillRect(-1.5,-176,3,60);g.fillStyle='#5a3a24';g.fillRect(-4,-62,8,62);g.restore()}
  // le gong d'alerte : une douille d'obus pendue à un piquet, qu'une sentinelle frappe
  {const gx=96,gy=210,sw=Math.sin(t*14)*(s.t<6?.18:.04);g.strokeStyle='#3a2a1a';g.lineWidth=6;g.beginPath();g.moveTo(40,456);g.lineTo(40,170);g.lineTo(gx+10,170);g.stroke();
   g.save();g.translate(gx,170);g.rotate(sw);g.strokeStyle='#2a2018';g.lineWidth=1.5;g.beginPath();g.moveTo(0,0);g.lineTo(0,24);g.stroke();
   const bg=g.createLinearGradient(-12,0,12,0);bg.addColorStop(0,'#8a6a2a');bg.addColorStop(.5,'#e0c060');bg.addColorStop(1,'#7a5a20');g.fillStyle=bg;rr(g,-12,24,24,70,4);g.fill();g.fillStyle='#5a4418';g.fillRect(-13,86,26,8);g.restore();
   const hit=s.t<6&&Math.sin(t*14)>.6;if(hit){g.strokeStyle='rgba(255,240,180,.7)';g.lineWidth=2;for(let k=0;k<3;k++){g.beginPath();g.arc(gx,gy+20,22+k*8,-.6,.6);g.stroke()}}}
  // au fond, d'autres hommes mettent leur masque
  for(const[x,i]of[[720,0],[860,2]]){g.save();g.globalAlpha=.55;const m=svMate(g,t,i,x,440,Object.assign({},VX_P.stand,{nT:{x:2.6,y:-4.4},fT:{x:2.4,y:-4.2},head:-.1}),{sc:6.6});if(s.t>1.5)svMask(g,m.head);g.restore()}
  // le gaz coule par-dessus le parapet et descend dans la tranchée
  for(let k=0;k<12;k++){const x=((k*90+t*22)%(W+200))-100,yy=120+Math.min(1,gz*1.3)*(140+Math.sin(t*.8+k)*30);const cg=g.createRadialGradient(x,yy,6,x,yy,80);cg.addColorStop(0,'rgba(200,196,96,'+(.35*gz)+')');cg.addColorStop(1,'rgba(200,196,96,0)');g.fillStyle=cg;g.beginPath();g.arc(x,yy,80,0,7);g.fill()}
  g.fillStyle='#5a4630';g.fillRect(0,460,W,H-460);g.fillStyle='#6a5a3e';for(let x=0;x<W;x+=60)g.fillRect(x,456,50,8);
  s.who=[];const gy=470,masked=s.i>=1;
  const fm=Object.assign({},S16_MATES[1]);
  const m1=svMate(g,t,1,200,gy,Object.assign({},VX_P.point,{head:-.2}),{});s.who[1]={x:200,y:m1.head.y-30};
  if(masked)svMask(g,m1.head);
  const L1=svLucien(g,t,s,460,gy,Object.assign({},VX_P.carry,{nT:{x:2.4,y:-1.6},fT:{x:2.8,y:-1.2}}),{bx:j=>j.nh.x+6,by:j=>j.nh.y+24});s.who[0]={x:460,y:L1.head.y-30};
  if(masked)svMask(g,L1.head);
  if(s.i>=2){const bx=L1.nh.x+6,by=L1.nh.y+24;g.fillStyle='rgba(230,226,210,.92)';g.beginPath();g.moveTo(bx-26,by-34);g.quadraticCurveTo(bx,by-48,bx+26,by-34);g.lineTo(bx+24,by+2);g.lineTo(bx-24,by+2);g.closePath();g.fill();g.strokeStyle='rgba(120,110,90,.5)';g.lineWidth=1;for(let k=0;k<3;k++){g.beginPath();g.moveTo(bx-20,by-26+k*9);g.lineTo(bx+20,by-26+k*9);g.stroke()}}
  const m2=svMate(g,t,2,740,gy,Object.assign({},VX_P.stand,{head:.2}),{f:-1});s.who[2]={x:740,y:m2.head.y-30};if(masked)svMask(g,m2.head);
  // la nappe jaune qui descend dans la tranchée
  g.fillStyle='rgba(200,190,80,'+(.28*gz)+')';for(let k=0;k<7;k++){const x=((k*170+t*30)%(W+300))-150;g.beginPath();g.ellipse(x,180+Math.sin(t+k)*20+gz*120,160,50,0,0,7);g.fill()}
  g.fillStyle='rgba(190,180,90,'+(.18*gz)+')';g.fillRect(0,0,W,H)}
function svMask(g,h){g.fillStyle='#8a8a7a';g.beginPath();g.ellipse(h.x+4,h.y+6,15,13,0,0,7);g.fill();g.fillStyle='#2a2a2a';g.beginPath();g.arc(h.x+10,h.y+2,4,0,7);g.arc(h.x-2,h.y+2,4,0,7);g.fill();g.fillStyle='#6a6a5a';g.fillRect(h.x+2,h.y+14,8,10)}

/* ---------- 2-1 : les endroits du souvenir ; la tranchée de mars 1916, jouable ---------- */
const S16={route:[44,56],bois:[140,150],tr:[247,258],
  W0:228,W1:265,          // la tranchée de 1916 : murs pleins de part et d'autre
  // trois étages : la tranchée (sol rangée 13), la sape haute avec la cagna (sol 17), la sape basse (sol 21)
  F:[13,17,21],X:[[233.5,259.6],[234.5,258.5],[241.5,257.5]],
  lad:[[239,253],[246,256]],   // les échelles : tranchée ↔ sape haute, sape haute ↔ sape basse (centre, en colonnes)
  cage:{c:237,r:17},luc:{c:236.1}};
const S16_KEYS=['g','th','rats','moths','cps','movers','mark','decor','lights','exit','hints','quips','bolts','updrafts','far','mid','tiles'];
function s16Grid(Lv){
  const g=Lv.g.map(r=>r.slice()),R=g.length;const fill=(c0,c1,r0,r1,ch)=>{for(let c=c0;c<=c1;c++)for(let r=r0;r<=r1;r++)if(r>=0&&r<R)g[r][c]=ch};
  for(let c=S16.W0-6;c<=S16.W1+6;c++)for(let r=0;r<R;r++)g[r][c]='.';
  fill(S16.W0,S16.W0+3,0,R-1,'#');fill(S16.W1-3,S16.W1,0,R-1,'#');   // les murs
  fill(S16.W0+4,S16.W1-4,8,R-1,'#');                                  // la terre
  fill(233,260,8,12,'.');                                             // la tranchée, à ciel ouvert
  fill(232,261,7,7,'^');                                              // les barbelés, sur le parapet
  fill(234,258,14,16,'.');                                            // la sape haute : la cagna de Lucien à gauche, puis la galerie
  fill(241,257,18,20,'.');                                            // la sape basse
  for(const c of S16.lad[0])fill(c-1,c,13,13,'.');                   // les trous des échelles
  for(const c of S16.lad[1])fill(c-1,c,17,17,'.');
  return g.map(r=>r.join('')).join('\n')}
function s16Post(Lv){
  const d=Lv.def;if(d.zr16){Lv.zr16={done:{}};return}
  if(!d.sentier)return;
  const S=Lv.s16={era:26,done:{},said:{},flash:0,E:null,caged:false,luc:null,mus:[],net:null};
  const d16=Object.assign({},d,{theme:'trench',segs:[{z:'t16',s:'\n'+s16Grid(Lv)}],rows:Lv.g.length,deep:0,signs:[],hints:[],quips:[],sentier:false,flyers:[],secretAt:null,helmetAt:null,dugout:null,marks:null,nestAt:null,bedAt:null,frontLeaves:null,zoneProps:{t16:[]},zoneTh:null,medalOn:false,seed:d.seed+16});
  const L16=parseLevel(Lv.i,d16);L16.def=d;
  const E={26:{},16:{}};for(const k of S16_KEYS){E[26][k]=Lv[k];E[16][k]=L16[k]}S.E=E;
  // le secret (des graines dans une musette) : un acte hors de portée de l'action, accordé à la main
  S.seeds={kind:'secret',style:'graines16',x:-9999,y:-9999,open:0,t:0,used:false,q:[/*v2*/"Dans la musette du gars qui dort : des graines ! Du chènevis, du vrai. Pour moi ? Je ne demanderai pas."]};Lv.acts.push(S.seeds);
  // la médaille de la mission 2 : dans l'autre musette (on la note comme une médaille ramassée)
  Lv.medal={x:-99999,y:-99999,taken:false,s16:1};
  S.mus=[{x:249.5*T,y:21*T,k:'seeds',open:0},{x:250.6*T,y:13*T,k:'medal',open:0}];
  // les actes de 2026 ne répondent pas en 1916
  for(const a of Lv.acts){const w=a.when;a.when=()=>L.s16&&L.s16.era===16?false:(w?w():true)}}
function s16Swap(era){const S=L.s16;if(S.era===era)return;for(const k of S16_KEYS)S.E[S.era][k]=L[k];for(const k of S16_KEYS)L[k]=S.E[era][k];S.era=era;MUS_OLD=era===16;
  L.camZone=era===16?()=>[S16.W0*T+T*2,(S16.W1-1)*T]:null;S.flash=1;P.onMover=null}
function s16Layers(){const S=L.s16;if(!S)return;const sg=L.g,st=L.th;L.g=S.E[16].g;L.th=S.E[16].th;S.E[16].far=buildFar(L);S.E[16].mid=buildMid(L);S.E[16].tiles=buildTilesF(L);L.g=sg;L.th=st}
function s16Cage(){const S=L.s16;S.caged=true;P.x=S16.cage.c*T+T/2-P.w/2;P.y=S16.cage.r*T-P.h-8;P.vx=P.vy=0;P.onGround=true;P.facing=-1;P.lastGY=P.y;
  S.luc={x:S16.luc.c*T,y:17*T,vx:0,vy:0,st:'sit',f:1,t:0,lvl:1,climb:0}}
function s16Enter(){achB('tr');const S=L.s16;s16Swap(16);S.done.tr=1;s16Cage();cam.x=clamp(P.x-W/2,S16.W0*T+80,(S16.W1-1)*T-W);cam.y=clamp(P.y-H*.55,0,ROWS*T-H);S.net=null;
  if(!G.sim){noise(.9,900,.18,'bandpass',0,.6);noise(1.6,260,.22,'lowpass',.05);setTimeout(()=>SFX.thunder&&SFX.thunder(.25),120)}
  say(/*v2*/"Mars 1916. La tranchée, avant qu'on la tonde. Et moi dans mon panier, à côté de Lucien. Le loquet est mal fermé…",4.2)}
function s16Leave(){const S=L.s16;s16Swap(26);S.caged=false;S.luc=null;P.x=250*T;P.y=18*T-P.h;P.vx=P.vy=0;P.onGround=false;P.lastGY=P.y;G.state='play';G.fade=1;
  say(/*v2*/"Le filet, les mains de Lucien, le panier. Il avait eu plus peur que moi.",4)}
function s16Step(dt){
  if(L.zr16)return;
  const S=L.s16;if(!S)return;if(S.flash>0)S.flash-=dt*1.6;const pc=P.x+P.w/2;
  if(S.era===26)return;
  // ---- 1916 ----
  const lu=S.luc;
  if(S.caged){P.x=S16.cage.c*T+T/2-P.w/2;P.y=S16.cage.r*T-P.h-8;P.vx=P.vy=0}
  // Lucien : il court après Raymond, à tous les étages ; il prend l'échelle la plus proche pour changer d'étage
  if(lu){lu.t+=dt;
    const pb=P.y+P.h,pl=pb<=S16.F[0]*T+4?0:pb<=S16.F[1]*T+4?1:2;
    if(lu.st==='rise'&&lu.t>.9)lu.st='chase';
    if(lu.st==='chase'&&!S.net){let tx=pc;
      if(pl!==lu.lvl){const up=pl<lu.lvl,set=S16.lad[up?lu.lvl-1:lu.lvl];let best=set[0];for(const c of set)if(Math.abs(c*T-lu.x)<Math.abs(best*T-lu.x))best=c;tx=best*T;
        if(Math.abs(lu.x-tx)<6){lu.x=tx;lu.st=up?'up':'down';lu.t=0;lu.to=up?lu.lvl-1:lu.lvl+1}}
      if(lu.st==='chase'){const[lo,hi]=S16.X[lu.lvl],dx=clamp(tx,lo*T,hi*T)-lu.x;lu.vx=Math.abs(dx)<4?0:Math.sign(dx)*150;lu.x+=lu.vx*dt;if(lu.vx)lu.f=Math.sign(lu.vx)}}
    if(lu.st==='up'||lu.st==='down'){const to=S16.F[lu.to]*T;lu.y+=Math.sign(to-lu.y)*170*dt;if(Math.abs(lu.y-to)<4){lu.y=to;lu.lvl=lu.to;lu.st='chase'}}
    // il attrape Raymond : retour au panier (sans accroc)
    if(!S.caged&&!P.dead&&!S.net&&(lu.st==='chase'||lu.st==='up'||lu.st==='down')&&overlap({x:P.x+3,y:P.y+4,w:P.w-6,h:P.h-6},{x:lu.x-24,y:lu.y-118,w:48,h:118})){
      if(!G.sim){bubble(lu.x,lu.y-130,pick([/*v2*/'Pas si vite, mon vieux !',/*v2*/'Je te tiens !',/*v2*/'Au panier !']),'#3a4a6a');noise(.15,900,.2,'bandpass')}s16Cage()}}
  // le dernier soldat sort un petit filet
  if(!S.net&&!S.caged&&!P.dead&&pc>256.5*T&&P.y+P.h<=13*T+4){S.net={t:0};if(!G.sim){bubble(259*T,13*T-130,/*v2*/"Attends, Vasseur, je l'ai !",'#3a4a6a');noise(.3,700,.15,'bandpass')}}
  if(S.net){S.net.t+=dt;P.vx*=.8;if(S.net.t>.5){P.vx=0;P.vy=Math.min(P.vy,60);P.x+=(258*T-P.x)*Math.min(1,dt*4)}
    if(S.net.t>1.6&&G.state==='play'){G.state='intro';G.cards=S16_NET_CARDS;G.card=0;G.cardT=0;G.fade=1;G.cardsDone=()=>s16Leave()}}}
const S16_NET_CARDS=[
  {t:/*v2*/"Lucien était venu en courant. Raymond se souvient qu'il tremblait en le remettant au panier, et qu'il n'avait rien dit pendant longtemps.",minT:1.2},
  {t:/*v2*/"Raymond comprend, ce jour-là, que Lucien avait eu peur de le perdre. Il s'était dit que Raymond serait son dernier message pour Marguerite.",minT:1.2},
  {t:/*v2*/"Il avait déjà perdu Fernand, son deuxième pigeon, quelque part au-dessus de la Meuse. Fernand, que Raymond avait salué au pigeonnier, en 1914.",minT:1.2}];
/* l'action en 1916 : ouvrir le loquet du panier ; fouiller une musette (rien n'est affiché à l'écran) */
function s16Act(){const Q=L.s16;if(!Q||Q.era!==16||P.dead)return;const lu=Q.luc,pc=P.x+P.w/2;
  if(Q.caged){Q.caged=false;P.vy=-380;P.onGround=false;if(lu){lu.st='rise';lu.t=0;if(!G.sim){noise(.12,1600,.2,'bandpass');bubble(lu.x,lu.y-130,/*v2*/'Raymond ! Reviens ici !','#3a4a6a')}}return}
  for(const m of Q.mus){if(m.open||Math.abs(pc-m.x)>34||Math.abs(P.y+P.h-m.y)>48)continue;m.open=1;
    if(m.k==='seeds'){if(!Q.seeds.used)grantSecret(Q.seeds,m.y-30)}
    else{const md=L.medal;if(md&&!md.taken){md.taken=true;G.medal=true;gotOf(G.li).m=true;medalLife();SFX.medal();S.run.medals[G.li]=true;save();say(/*v2*/"Dans la musette de Castagnet, sous le tabac : une médaille. Il me la prête, dit-il. Je la lui rendrai après la guerre.",4.4)}}}}
function s16Respawn(){const S=L.s16;if(!S||S.era!==16)return;s16Cage();S.net=null}
function s16Switch(){if(P.dead||SV)return;const pc=P.x+P.w/2;
  if(L.zr16){if(pc>133*T&&pc<153*T){G.state='intro';G.cards=SV_GAZ_CARDS;G.card=0;G.cardT=0;G.fade=1;G.cardsDone=()=>{G.state='play';svStart('gaz')}}return}
  const S=L.s16;if(!S)return;
  if(S.era===26){if(pc>S16.route[0]*T&&pc<S16.route[1]*T)return svStart('route');if(pc>S16.bois[0]*T&&pc<S16.bois[1]*T)return svStart('bois');if(pc>S16.tr[0]*T-80&&pc<S16.tr[1]*T)return s16Enter()}}
/* dessin de la tranchée de 1916 : planches, étais, sacs, la cagna, les musettes, les soldats, Lucien, le panier, le filet */
/* le fond, derrière les tuiles : tout est sous terre — la paroi de la tranchée, la terre et le boisage des sapes */
function drawS16Back(t){const S=L.s16;if(!S||S.era!==16)return;
  // peint une fois dans une image (les 160 mottes de terre et les planches ne bougent pas)
  if(!S.backC){const c=mk(30*T,15*T),g2=c.getContext('2d');g2.translate(-232*T,-7.6*T);drawS16BackPaint(g2);S.backC=c}
  ctx.drawImage(S.backC,232*T,7.6*T)}
function drawS16BackPaint(g){const R=mulberry(1916);
  // la terre, partout derrière (on ne voit plus le paysage à travers la sape)
  g.fillStyle='#2a2018';g.fillRect(232*T,7.6*T,30*T,15*T);
  for(let k=0;k<160;k++){g.fillStyle=k%3?'rgba(70,52,36,.5)':'rgba(20,14,10,.5)';g.beginPath();g.ellipse(232*T+R()*30*T,8*T+R()*14*T,3+R()*8,2+R()*5,R()*3,0,7);g.fill()}
  // la paroi de la tranchée : un clayonnage de branches tressées entre des piquets, des sacs de terre en haut
  g.fillStyle='#4a3a28';g.fillRect(233*T,8*T,28*T,5*T);
  for(let y=8*T+6;y<13*T;y+=9){g.strokeStyle=(y/9|0)%2?'#5e4a32':'#3e3020';g.lineWidth=6;g.beginPath();for(let x=233*T;x<=261*T;x+=40)g.lineTo(x,y+((x/40|0)%2?3:-3));g.stroke()}
  for(let x=233*T;x<261*T;x+=80){g.fillStyle='#3a2a1a';g.fillRect(x,8*T-10,9,5*T+10)}
  for(let x=233*T;x<261*T;x+=34){g.fillStyle=(x/34|0)%2?'#8a7a5a':'#7a6a4c';rr(g,x,8*T-14,32,16,6);g.fill();g.fillStyle='rgba(0,0,0,.18)';g.fillRect(x+4,8*T-4,24,2)}
  // la banquette de tir le long de la paroi
  g.fillStyle='#5a4630';g.fillRect(233*T,12.4*T,28*T,.6*T);g.fillStyle='#6a5438';g.fillRect(233*T,12.4*T,28*T,5);
  // les sapes : parois en planches, cadres de boisage (montants et chapeaux), plafond de rondins
  for(const[x0,x1,r0]of[[234,259,14],[241,258,18]]){g.fillStyle='#3a2c1e';g.fillRect(x0*T,r0*T,(x1-x0)*T,3*T);
    for(let y=r0*T+8;y<(r0+3)*T;y+=16){g.fillStyle=(y/16|0)%2?'#4a3826':'#42321f';g.fillRect(x0*T,y,(x1-x0)*T,14);g.fillStyle='rgba(0,0,0,.25)';for(let x=x0*T+((y/16|0)%2)*30;x<x1*T;x+=60)g.fillRect(x,y,2,14)}
    for(let x=x0*T;x<=x1*T;x+=24){g.fillStyle='#2e2016';g.beginPath();g.arc(x+12,r0*T+8,10,0,7);g.fill();g.fillStyle='#4e3a26';g.beginPath();g.arc(x+12,r0*T+8,6,0,7);g.fill()}
    for(let x=x0*T+6;x<x1*T;x+=120){g.fillStyle='#5a4228';g.fillRect(x,r0*T+12,14,3*T-12);g.fillStyle='#6a5032';g.fillRect(x,r0*T+12,4,3*T-12);g.fillStyle='#4a3420';g.fillRect(x-14,r0*T+12,42,10)}}
  // la cloison de la cagna (planches plus claires, un rideau de toile à l'entrée)
  g.fillStyle='#5a4430';g.fillRect(234*T,14*T+16,6*T,3*T-16);for(let x=234*T;x<240*T;x+=20){g.fillStyle='rgba(0,0,0,.2)';g.fillRect(x,14*T+16,2,3*T-16)}
  g.fillStyle='#7a6e50';g.beginPath();g.moveTo(240*T-2,14*T+14);g.quadraticCurveTo(240*T+14,15.5*T,240*T+4,17*T);g.lineTo(240*T-6,17*T);g.closePath();g.fill()}
function s16Ladder(g,x,y0,y1){g.fillStyle='#6a5032';g.fillRect(x-14,y0,5,y1-y0);g.fillRect(x+9,y0,5,y1-y0);g.fillStyle='#7a6040';for(let y=y0+10;y<y1;y+=16)g.fillRect(x-12,y,24,4)}
function drawS16Mid(t){const S=L.s16;if(!S||S.era!==16)return;const g=ctx;
  // les caillebotis de la tranchée et des sapes
  for(const[x0,x1,r]of[[233,261,13],[234,259,17],[241,258,21]])for(let x=x0*T;x<x1*T;x+=36){const hole=S16.lad.some((l,i)=>(r===(i?17:13))&&l.some(c=>x+30>(c-1)*T&&x<(c+1)*T));if(hole)continue;g.fillStyle='#6a5236';g.fillRect(x,r*T-6,30,6);g.fillStyle='#4a3826';g.fillRect(x+4,r*T-6,3,6);g.fillRect(x+22,r*T-6,3,6)}
  // les échelles
  for(const c of S16.lad[0])s16Ladder(g,c*T,13*T-34,17*T);
  for(const c of S16.lad[1])s16Ladder(g,c*T,17*T-34,21*T);
  // ---- la tranchée : fusils contre la paroi, un périscope, un seau, la caisse où l'on s'assoit
  for(const x of[235.2,236,254.6]){g.save();g.translate(x*T,13*T-6);g.rotate(-.18);g.fillStyle='#4a3020';g.fillRect(-3,-96,6,60);g.fillStyle='#2a2a2a';g.fillRect(-1.5,-110,3,50);g.fillStyle='#5a3a24';g.fillRect(-4,-40,8,40);g.restore()}
  g.fillStyle='#3a3a36';g.fillRect(242.4*T,8*T-44,8,90);g.fillRect(242.4*T,8*T-44,18,8);g.fillStyle='#8ab0c0';g.fillRect(242.4*T+14,8*T-42,3,5);
  g.fillStyle='#5a5a54';rr(g,257.2*T,13*T-26,22,22,3);g.fill();g.strokeStyle='#3a3a36';g.lineWidth=2;g.beginPath();g.arc(257.2*T+11,13*T-26,10,Math.PI,0);g.stroke();
  g.fillStyle='#6a4e30';g.fillRect(247.5*T-18,13*T-34,36,34);g.fillStyle='#7a5c3a';g.fillRect(247.5*T-18,13*T-34,36,6);g.fillStyle='#3a2a1a';g.font='bold 8px '+F_BODY;g.textAlign='center';g.fillText('8mm',247.5*T,13*T-14);
  // ---- la cagna : la couchette (paille, couverture), le tabouret de Lucien, l'étagère, la lampe, la photo, le casque au clou
  {const x0=234.1*T,fl=17*T;g.fillStyle='#5a4028';g.fillRect(x0,fl-34,62,6);g.fillRect(x0,fl-34,5,34);g.fillRect(x0+57,fl-34,5,34);g.fillStyle='#c8a860';g.fillRect(x0+4,fl-40,54,7);g.fillStyle='#6a6a4a';rr(g,x0+16,fl-46,44,10,4);g.fill();g.fillStyle='#8a8a6a';g.fillRect(x0+18,fl-45,40,3);g.fillStyle='#d8d0b8';rr(g,x0+2,fl-48,16,9,4);g.fill();
   g.fillStyle='#6a4a2e';g.fillRect(S16.luc.c*T-14,fl-38,28,6);g.fillRect(S16.luc.c*T-11,fl-32,4,32);g.fillRect(S16.luc.c*T+7,fl-32,4,32);
   g.fillStyle='#5a4028';g.fillRect(234.2*T,14.9*T,70,5);for(const[dx,c]of[[4,'#8a8a90'],[16,'#8a8a90'],[30,'#5a6a3a'],[46,'#c8b890']])g.fillStyle=c,g.fillRect(234.2*T+dx,14.9*T-12,10,12);
   g.fillStyle='#e8e0c8';g.fillRect(236.6*T,15.2*T,14,18);g.fillStyle='#6a5a4a';g.fillRect(236.6*T+3,15.2*T+3,8,10);
   g.fillStyle='#4a5a6a';g.beginPath();g.ellipse(238.2*T,15.3*T,13,7,0,Math.PI,0);g.fill();g.fillStyle='#2a2a2a';g.beginPath();g.arc(238.2*T,15.3*T-3,1.5,0,7);g.fill();
   const lx=236*T,ly=14*T+24;g.strokeStyle='#2a2a2a';g.lineWidth=1;g.beginPath();g.moveTo(lx,14*T+10);g.lineTo(lx,ly);g.stroke();g.fillStyle='#4a4a40';g.fillRect(lx-5,ly,10,4);g.fillStyle='rgba(255,220,140,'+(.85+Math.sin(t*9)*.1)+')';g.beginPath();g.ellipse(lx,ly+10,4,6,0,0,7);g.fill();
   const gl=g.createRadialGradient(lx,ly+10,4,lx,ly+10,120);gl.addColorStop(0,'rgba(255,200,120,.22)');gl.addColorStop(1,'rgba(255,200,120,0)');g.fillStyle=gl;g.fillRect(lx-120,ly-110,240,240)}
  // ---- la sape haute : la table de cartes, deux tabourets, la bougie, le poêle et son tuyau, les caisses, le râtelier
  {const fl=17*T,tx=243.5*T;g.fillStyle='#6a4a2e';g.fillRect(tx-34,fl-42,68,6);g.fillRect(tx-30,fl-36,5,36);g.fillRect(tx+25,fl-36,5,36);
   for(const dx of[-52,52]){g.fillRect(tx+dx-10,fl-24,20,5);g.fillRect(tx+dx-8,fl-19,3,19);g.fillRect(tx+dx+5,fl-19,3,19)}
   g.fillStyle='#e8e0d0';for(let k=0;k<4;k++)g.fillRect(tx-20+k*9,fl-45,7,3);g.fillStyle='#d8c890';g.fillRect(tx+18,fl-58,5,13);g.fillStyle='rgba(255,210,120,.9)';g.beginPath();g.ellipse(tx+20.5,fl-62,2.5,4,0,0,7);g.fill();
   const gl=g.createRadialGradient(tx+20,fl-62,2,tx+20,fl-62,90);gl.addColorStop(0,'rgba(255,200,120,.2)');gl.addColorStop(1,'rgba(255,200,120,0)');g.fillStyle=gl;g.fillRect(tx-70,fl-150,180,180);
   const sx=249.4*T;g.fillStyle='#2a2826';rr(g,sx-14,fl-46,28,46,4);g.fill();g.fillStyle='rgba(255,120,40,'+(.6+Math.sin(t*6)*.2)+')';g.fillRect(sx-8,fl-22,16,8);g.fillStyle='#3a3836';g.fillRect(sx-4,14*T,8,3*T-46);
   for(const[x,w,h]of[[250.8,34,26],[251.7,30,22],[257.3,36,30]]){g.fillStyle='#6a4e30';g.fillRect(x*T,fl-h,w,h);g.strokeStyle='#4a3420';g.lineWidth=2;g.strokeRect(x*T+2,fl-h+2,w-4,h-4)}
   g.fillStyle='#4a3420';g.fillRect(254.4*T,14.8*T,60,5);for(let k=0;k<4;k++){g.fillStyle='#3a2414';g.fillRect(254.4*T+6+k*14,14.8*T+5,5,70)}}
  // ---- la sape basse : le lit du gars qui dort, une lanterne, des sacs, un tonneau
  {const fl=21*T,bx=243.2*T;g.fillStyle='#5a4028';g.fillRect(bx-10,fl-26,96,6);g.fillRect(bx-10,fl-26,5,26);g.fillRect(bx+81,fl-26,5,26);g.fillRect(bx-10,fl-44,5,18);g.fillStyle='#c8a860';g.fillRect(bx-6,fl-31,88,6);g.fillStyle='#6a6a4a';rr(g,bx+14,fl-34,66,8,3);g.fill();
   g.fillStyle='#6a4a30';rr(g,252*T,fl-34,26,34,6);g.fill();g.fillStyle='#4a3420';g.fillRect(252*T,fl-26,26,3);g.fillRect(252*T,fl-10,26,3);
   for(const x of[254,254.7]){g.fillStyle='#8a7a5a';rr(g,x*T,fl-22,26,22,8);g.fill()}
   g.fillStyle='#3a3a36';g.fillRect(251*T,18*T+18,8,10);g.fillStyle='rgba(255,210,130,.85)';g.fillRect(251*T+2,18*T+20,4,6)}
  // la caisse et le panier
  g.fillStyle='#7a5a3a';g.fillRect(S16.cage.c*T+2,S16.cage.r*T-8,36,8);
  if(S.caged)vxBasket(g,S16.cage.c*T+T/2,S16.cage.r*T-8,40,28,{win:6,big:1,inside:(g2,lx,ly)=>{g2.save();g2.beginPath();g2.rect(lx-10,ly-14,20,17);g2.clip();drawRaymond(g2,lx-9,ly+19,{f:1,t,wear:0,size:.78});g2.restore()}});
  else vxBasket(g,S16.cage.c*T+T/2,S16.cage.r*T-8,40,28,{win:6,big:1});
  // le gars qui dort sur son lit, dans la sape basse, et sa musette ; le soldat assis sur sa caisse dans la tranchée, et la sienne
  vxSoldier(g,{hip:{x:244.4*T,y:21*T-36},s:8,f:1,side:'fr',t,pose:Object.assign({},VX_P.sit,{lean:-1.25,head:-.6}),face:Object.assign({},S16_MATES[2],{ex:'sleep',tilt:-.5}),kit:{}});
  vxSoldier(g,{hip:{x:247.5*T,y:13*T-40},s:9,f:1,side:'fr',t,pose:Object.assign({},VX_P.sit,{lean:.1,head:.15,nT:{x:2.6,y:-2},fT:{x:3,y:-1.6}}),face:S16_MATES[0],kit:{bidon:1}});
  for(const m of S.mus){g.fillStyle='#6e6a50';g.save();g.translate(m.x,m.y-34);g.rotate(m.open?.3:0);rr(g,-12,0,24,20,5);g.fill();g.fillStyle='#5a5640';g.fillRect(-12,0,24,7);g.strokeStyle='#4a4632';g.lineWidth=2;g.beginPath();g.moveTo(-8,0);g.lineTo(0,-14);g.lineTo(8,0);g.stroke();g.restore();g.fillStyle='#3a2a1c';g.beginPath();g.arc(m.x,m.y-48,2.5,0,7);g.fill()}
  // le dernier soldat (et son filet)
  {const x=259.4*T,y=13*T,n=S.net;vxSoldier(g,{x,y,s:9.2,f:-1,side:'fr',t,pose:n?Object.assign({},VX_P.throwUp,{head:.1}):Object.assign({},VX_P.stand,{head:.1}),face:S16_MATES[1],kit:{musette:1}});
    if(n){const k=Math.min(1,n.t/.5),cx=lerp(x-20,P.x+P.w/2,k),cy=lerp(y-120,P.y+P.h/2,k);g.strokeStyle='#5a4a32';g.lineWidth=2;g.beginPath();g.moveTo(x-10,y-100);g.lineTo(cx,cy);g.stroke();
      g.strokeStyle='rgba(220,210,180,.8)';g.lineWidth=1;for(let i=-3;i<=3;i++){g.beginPath();g.moveTo(cx-24,cy+i*7);g.lineTo(cx+24,cy+i*7);g.stroke();g.beginPath();g.moveTo(cx+i*7,cy-24);g.lineTo(cx+i*7,cy+24);g.stroke()}}}
  // Lucien
  const lu=S.luc;if(lu){const run=lu.st==='chase'&&Math.abs(lu.vx)>1,climb=lu.st==='up'||lu.st==='down';
    let pose=lu.st==='sit'?Object.assign({},VX_P.sit,{lean:.1,head:.3,nT:{x:2.6,y:-1.6},fT:{x:3,y:-1.2}}):climb?Object.assign({},VX_P.stand,{na1:2.6,na2:2.7,fa1:2.4,fa2:2.5,head:-.3}):run?Object.assign(vxWalk(t*11,1),{nT:{x:3.2,y:-3.4},fT:{x:3.4,y:-3}}):Object.assign({},VX_P.stand,{nT:{x:3,y:-4.6},fT:{x:2.6,y:-4.4},head:-.2});
    const face=Object.assign({},LUC_FACE,{ex:lu.st==='sit'?'sad':'angry',look:[.8,-.2]});
    if(lu.st==='sit')vxSoldier(g,{hip:{x:lu.x,y:lu.y-40},s:9,f:1,side:'fr',t,pose,face,kit:{musette:1,bidon:1},regt:'142'});
    else vxSoldier(g,{x:lu.x,y:lu.y,s:9,f:lu.f,side:'fr',t,pose,face,kit:{musette:1,bidon:1},regt:'142'})}}
function s16Overlay(t){const S=L.s16;if(!S)return;if(S.era===16){const fc=ferteFogTex();ctx.save();const ox=((t*14+cam.x*.15)%fc.fog.width+fc.fog.width)%fc.fog.width;ctx.globalAlpha=.7;ctx.drawImage(fc.fog,-ox,0,fc.fog.width,H);ctx.drawImage(fc.fog,fc.fog.width-ox,0,fc.fog.width,H);ctx.globalAlpha=1;ctx.drawImage(fc.vig,0,0,W,H);
    ctx.globalAlpha=.6;ctx.fillStyle='#efe5cc';ctx.font='italic 15px '+F_BODY;ctx.textAlign='left';ctx.fillText(/*v2*/'La tranchée · mars 1916',20,H-20);ctx.restore()}
  if(S.flash>0){ctx.fillStyle='rgba(236,232,222,'+(Math.min(1,S.flash)*.85)+')';ctx.fillRect(0,0,W,H)}}
