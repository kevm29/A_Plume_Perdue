/* =========================================================
   5-2 · LES COMBLES — l'église de Crécy-la-Chapelle, sous le toit
   ---------------------------------------------------------
   Pas de plancher : on avance de poutre en poutre, au-dessus de l'extrados des voûtes
   (troué par endroits : dessous, c'est la nef). Planches rongées qui cèdent (%),
   toiles d'araignée qui engluent, rats, chauves-souris, pies, hiboux qui fondent en piqué,
   écureuils sur les pannes, et tous les collègues : chieurs, mendiants, sauteurs, déplumés.
   Au milieu, la chambre des cloches (cases I) : on monte en se servant des cloches,
   leurs ondes repoussent. La lumière passe entre les tuiles, plus ou moins forte selon les nuages.
   Au bout : un trou dans la charpente, on sort sur le toit, on voit toute la commune,
   et on entend le bal. Carton de film muet, puis 5-3.
   ========================================================= */
const CBW=212,CBR=24,CVF=21;
THEMES.combles=Object.assign({},BASE_IN,{far:'combles',wall:'#3a2e24',wall2:'#43352a',motif:'#4a3a2c',wains:'#2a2018',floor:'#4a3a2a',floorTop:'#7a6a52',type:'plank',fog:'#1a140e',dark:.3,
  x:'none',shelf:'beam',spike:'nails',walker:'rat',flyer:'bat',props:[]});
const CB={};
(function(){
  const g=Array.from({length:CBR},()=>Array(CBW).fill('.'));
  const plat=(c0,c1,r,ch)=>{for(let c=c0;c<=c1;c++)g[r][c]=ch||'='};
  const fill=(c0,c1,r0,r1,ch)=>{for(let c=c0;c<=c1;c++)for(let r=r0;r<=r1;r++)g[r][c]=ch};
  const put=(c,r,ch)=>{g[r][c]=ch};
  const holes=[];const hole=(c0,c1)=>{fill(c0,c1,CVF,CBR-1,'.');holes.push([c0,c1])};
  // l'extrados des voûtes, le toit, les pignons
  fill(0,CBW-1,CVF,CBR-1,'#');
  fill(0,CBW-1,0,0,'#');
  fill(0,1,0,CBR-1,'X');fill(CBW-3,CBW-1,0,CBR-1,'X');
  /* A · la nef, côté ouest */
  put(4,20,'S');
  hole(12,14);hole(24,26);
  plat(9,17,17);                       // un entrait au-dessus du premier trou
  plat(23,27,19,'%');                  // planche rongée au-dessus du second
  plat(20,30,14);plat(22,28,9);        // la panne, et le chieur au-dessus
  for(const[c,r]of[[7,19],[10,16],[13,16],[16,16],[21,13],[24,13],[27,13],[25,18],[30,19],[33,19]])put(c,r,'o');
  put(7,20,'k');put(19,20,'k');
  /* B · la charpente : plus de sol, on monte */
  hole(38,44);hole(50,58);
  plat(36,39,17);plat(41,44,14);plat(46,48,11,'%');plat(50,53,9);plat(54,64,6);plat(59,62,3);
  put(52,8,'C');
  for(const[c,r]of[[37,16],[42,13],[44,13],[47,10],[51,8],[56,5],[60,5],[63,5],[48,19]])put(c,r,'o');
  put(44,8,'m');
  /* C · la descente */
  hole(63,74);
  plat(66,69,10);plat(71,74,14);plat(76,80,18);
  put(72,13,'k');put(70,11,'m');put(84,15,'n');
  for(const[c,r]of[[67,9],[68,9],[72,12],[77,17],[79,17],[82,19],[86,18],[90,19]])put(c,r,'o');
  put(91,20,'C');
  /* D · la chambre des cloches */
  fill(93,94,1,16,'X');fill(126,127,7,CBR-1,'X');fill(126,127,1,1,'X');
  hole(108,110);
  put(97,20,'h');
  plat(96,99,17);put(102,11,'I');plat(105,107,10);put(110,5,'I');plat(113,116,7);put(119,1,'I');plat(122,125,4);plat(99,101,3);
  put(104,15,'m');put(116,12,'m');
  put(124,3,'C');
  for(const[c,r]of[[97,16],[98,16],[102,9],[106,9],[110,3],[114,6],[115,6],[119,0],[123,3]])put(c,r,'o');
  /* E · le comble du chœur, tout en haut */
  hole(138,141);hole(158,161);
  plat(128,134,5);plat(135,140,7,'%');plat(138,142,2);plat(142,146,8);plat(150,155,7);plat(151,155,2);plat(157,160,9);put(158,8,'C');
  plat(162,166,11);plat(169,172,13);
  plat(130,136,16);plat(165,168,17);                // le chemin du bas, pour qui est tombé
  put(132,15,'k');put(164,10,'k');
  for(const[c,r]of[[129,4],[131,4],[133,4],[137,6],[139,6],[143,7],[145,7],[152,6],[154,6],[158,8],[163,10],[170,12],[133,15],[146,19],[166,16]])put(c,r,'o');
  /* F · vers le trou du toit */
  hole(180,183);hole(193,196);
  plat(175,178,10);plat(180,182,8,'%');plat(184,188,6);plat(189,193,2);plat(192,196,4);plat(199,203,3);
  plat(176,179,17);plat(184,191,15);plat(186,188,11);   // la montée de secours, depuis l'extrados
  put(178,15,'m');put(187,14,'k');
  for(const[c,r]of[[176,9],[178,9],[181,7],[185,5],[187,5],[193,3],[195,3],[200,2],[202,2],[186,10],[189,14]])put(c,r,'o');
  // le trou dans le toit
  for(let c=200;c<=204;c++)g[0][c]='.';
  CB.segs=[g.map(r=>r.join('')).join('\n')];{const d=LEVELS.find(d=>d.combles);if(d)d.segs=CB.segs}
  CB.holes=holes;
  // les fermes de la charpente (décor, en élévation) et les rayons de soleil entre les tuiles
  CB.trusses=[];for(let c=6;c<CBW-4;c+=12)if(c<92||c>128)CB.trusses.push(c);
  CB.rays=[[11,46],[33,30],[57,60],[78,70],[87,34],[133,40],[148,52],[166,36],[185,44]];
})();

/* ---------- après lecture : les bêtes ---------- */
function comblesPost(Lv){
  if(!Lv.def.combles)return;
  const C=Lv.cb={t:0,said:{},lum:1,end:null,drops:[],grace:0};
  for(const m of Lv.moths){const c=m.cx/T;if(Math.abs(c-70.5)<1||Math.abs(c-178.5)<1)m.kind='pie'}
  C.owls=[[60.5,3],[140.5,2],[191,2]].map(([c,r])=>({hx:c*T,hy:r*T,x:c*T,y:r*T,st:'perch',t:0,cool:1.2,f:-1}));
  C.squirrels=[{a:54.5*T,b:63.6*T,y:6*T,x:60*T,f:1,pause:0},{a:128.5*T,b:134.4*T,y:5*T,x:131*T,f:-1,pause:.8}];
  C.chieurs=[{x:25.5*T,y:9*T,per:3.1,t:0},{x:100.4*T,y:3*T,per:2.7,t:1.2},{x:153.5*T,y:2*T,per:3.4,t:.6}].map(o=>Object.assign(o,{lift:0}));
  const pig=(k,a,b,y,o)=>Object.assign({k,a:a*T,b:b*T,y0:y*T,x:a*T,y:y*T,f:1,st:'walk',t:0,beg:0,home:(a+b)/2*T},o||{});
  C.pig=[pig('moignon',27.5,33,CVF),pig('gros',80.5,88.5,CVF,{h:120}),pig('deplume',84,92,CVF),pig('moignon',142.5,146,8),pig('gros',150.6,155,7,{h:80,t:2}),pig('deplume',184.3,191.6,CVF),pig('moignon',192.4,196,4)];
  C.webs=[[18,15,2.8,4],[44.6,5.6,2.4,3.2],[63.6,11.5,2.2,4],[147,3.5,2.8,5],[189.2,4.6,2.6,3.6]].map(([x,y,w,h])=>({x:x*T,y:y*T,w:w*T,h:h*T,shake:0}));
  Lv.acts=Lv.acts||[];
  C.bague={kind:'secret',style:'bague',x:138.8*T,y:2*T,open:0,t:0,used:false,q:["Un vieux nid. Et dedans, une bague de pigeon : « 1913 ». Un gars du colombier Vasseur. Il a fini ses jours ici, au calme. Il y a pire."]};
  C.graf={kind:'secret',style:'graffiti',x:122.6*T,y:4*T,open:0,t:0,used:false,q:["Gravé dans la poutre : « Lucien et Marguerite, 1913 ». Le petit Garnier montait sonner les cloches. Je ne savais pas qu'il montait aussi pour ça."]};
  Lv.acts.push(C.bague,C.graf);
  C.motes=Array.from({length:70},(_,i)=>({r:i%CB.rays.length,u:(i*.137)%1,v:(i*.618)%1,s:.6+(i%5)*.3}));
}
function comblesRespawn(){const C=L.cb;if(!C)return;C.drops=[];C.grace=1;for(const o of C.owls){o.st='perch';o.x=o.hx;o.y=o.hy;o.cool=1.5}for(const p of C.pig)if(p.k==='deplume'){p.x=p.home;p.st='walk'}}
/* la lumière : le soleil entre et sort des nuages */
function cbLum(t){return clamp(.62+.38*Math.sin(t*.21)+.18*Math.sin(t*.53+1.3),.15,1)}

function comblesStep(dt){const C=L.cb;if(!C)return;C.t+=dt;if(C.grace>0)C.grace-=dt;
  C.lum=cbLum(C.t);L.darkNow=.62-.36*C.lum;
  const pcx=P.x+P.w/2,pcy=P.y+P.h/2,hb={x:P.x+3,y:P.y+4,w:P.w-6,h:P.h-6};let hit=null;
  // les toiles d'araignée : on s'y englue
  P.web=false;for(const w of C.webs){w.shake=Math.max(0,w.shake-dt*2);if(pcx>w.x&&pcx<w.x+w.w&&pcy>w.y&&pcy<w.y+w.h&&!P.dead){P.web=true;w.shake=1;
    P.vx=clamp(P.vx,-55,55);if(P.vy>45)P.vy=45;if(P.vy<-140)P.vy=-140;P.flaps=Math.max(P.flaps,1);
    if(!C.said.toile&&!G.sim){C.said.toile=1;say("Une toile d'araignée. Je colle. Un sergent qui colle, c'est mauvais pour le moral.",3.6)}}}
  // les hiboux : perchés, ils guettent ; quand Raymond passe dessous, un hululement, puis le piqué
  for(const o of C.owls){o.t+=dt;o.cool-=dt;
    if(o.st==='perch'){o.x=o.hx;o.y=o.hy;const dx=pcx-o.hx,dy=pcy-o.hy;if(o.cool<=0&&!P.dead&&Math.abs(dx)<300&&dy>30&&dy<420){o.st='warn';o.t=0;o.f=dx>0?1:-1;if(!G.sim){tone(330,.28,'sine',.05,300);setTimeout(()=>tone(300,.4,'sine',.05,270),330)}
        if(!C.said.hibou&&!G.sim){C.said.hibou=1;bubble(o.hx,o.hy-50,'Hou-hou…','#5a4a3a')}}}
    else if(o.st==='warn'){if(o.t>.7){o.st='dive';o.t=0;o.tx=pcx;o.ty=pcy;o.sx=o.hx;o.sy=o.hy;o.ex=pcx+o.f*240;o.ey=o.hy+40}}
    else if(o.st==='dive'){const u=Math.min(1,o.t/1.15),a=(1-u)*(1-u),b=2*(1-u)*u,c=u*u;
      // une courbe qui passe par la position de Raymond au début du piqué
      const mx=2*o.tx-.5*(o.sx+o.ex),my=2*o.ty-.5*(o.sy+o.ey);o.x=a*o.sx+b*mx+c*o.ex;o.y=a*o.sy+b*my+c*o.ey;
      if(u>=1){o.st='back';o.t=0;o.bx=o.x;o.by=o.y}
      if(!P.dead&&C.grace<=0&&overlap(hb,{x:o.x-18,y:o.y-14,w:36,h:26}))hit='hibou'}
    else if(o.st==='back'){const u=Math.min(1,o.t/1.3),e=u*u*(3-2*u);o.x=lerp(o.bx,o.hx,e);o.y=lerp(o.by,o.hy,e)-Math.sin(u*Math.PI)*50;o.f=o.hx>o.bx?1:-1;if(u>=1){o.st='perch';o.cool=2.6}}}
  // les écureuils : ils filent sur la panne, s'arrêtent, repartent
  for(const s of C.squirrels){if(s.pause>0){s.pause-=dt;continue}s.x+=s.f*250*dt;if(s.x>s.b){s.x=s.b;s.f=-1;s.pause=.9}if(s.x<s.a){s.x=s.a;s.f=1;s.pause=.9}
    if(!P.dead&&C.grace<=0&&overlap(hb,{x:s.x-14,y:s.y-20,w:28,h:20}))hit='ecureuil'}
  // les chieurs : la queue se relève, la fiente tombe jusqu'à la première poutre
  for(const o of C.chieurs){o.t+=dt;const u=o.t%o.per;o.lift=u>o.per-.7&&u<o.per-.2?1:0;if(u>=o.per-.3&&u-dt<o.per-.3)C.drops.push({x:o.x-8,y:o.y+2,vy:40})}
  for(const d of C.drops){if(d.dead){d.life=(d.life||0)+dt;continue}d.vy=Math.min(700,d.vy+1500*dt);d.y+=d.vy*dt;const c=Math.floor(d.x/T),r=Math.floor(d.y/T);
    if(r>=CBR||(d.y>r*T&&d.y<r*T+12&&('#X%'.includes(tile(c,r))||tile(c,r)==='='))){d.dead=1;d.y=Math.min(d.y,r*T);d.life=0}
    if(!d.dead&&!P.dead&&C.grace<=0&&Math.abs(d.x-pcx)<10&&d.y>P.y&&d.y<P.y+P.h)hit='fiente'}
  C.drops=C.drops.filter(d=>!d.dead||d.life<2.5);
  // les collègues : mendiants, sauteurs, déplumés
  for(const o of C.pig){o.t+=dt;
    if(o.k==='gros'){const cyc=6,u=o.t%cyc;
      if(u<1.6){o.st='walk';o.x=o.a+Math.sin(u*1.8)*10;o.y=o.y0;o.f=1}else if(u<3){o.st='fly';const v=(u-1.6)/1.4;o.x=lerp(o.a,o.b,v);o.y=o.y0-Math.sin(v*Math.PI)*o.h;o.f=1}
      else if(u<4.6){o.st='walk';o.x=o.b+Math.sin((u-3)*1.8)*10;o.y=o.y0;o.f=-1}else{o.st='fly';const v=(u-4.6)/1.4;o.x=lerp(o.b,o.a,v);o.y=o.y0-Math.sin(v*Math.PI)*o.h;o.f=-1}
      if(!P.dead&&C.grace<=0&&overlap(hb,{x:o.x-18,y:o.y-32,w:36,h:30}))hit='sauteur'}
    else if(o.k==='deplume'){const dx=pcx-o.x;if(Math.abs(dx)<300&&Math.abs(P.y+P.h-o.y0)<60&&!P.dead){o.st='run';o.f=Math.sign(dx)||1;o.x+=o.f*190*dt}else{o.st='walk';o.f=Math.sin(o.t*.5)>0?1:-1;o.x+=o.f*24*dt}
      o.x=clamp(o.x,o.a,o.b);if(o.st==='run'&&!o.cried&&!G.sim){o.cried=1;bubble(o.x,o.y0-40,'Kroûû !','#6a4a4a')}
      if(!P.dead&&C.grace<=0&&overlap(hb,{x:o.x-12,y:o.y-24,w:24,h:22}))hit='pigeonDeplume'}
    else{o.x+=o.f*22*dt;if(o.x<o.a){o.x=o.a;o.f=1}if(o.x>o.b){o.x=o.b;o.f=-1}o.y=o.y0;o.beg=Math.max(0,o.beg-dt);o.st=o.beg>1.4?'beg':'walk';
      if(Math.abs(pcx-o.x)<200&&Math.abs(pcy-o.y)<110&&o.beg<=0&&!G.sim){o.beg=3.2;bubble(o.x,o.y-44,pick(["Une miette, pour un vieux du clocher ?","Pitié, camarade…","Rien qu'une graine…","On n'a plus rien, là-haut…"]),'#6a5a48')}
      if(!P.dead&&C.grace<=0&&overlap(hb,{x:o.x-12,y:o.y-26,w:24,h:24}))hit='mendiant'}}
  if(hit&&!P.dead&&!G.sim)C.hit=hit;else if(hit)C.hit=hit;
  // la sortie : le trou dans le toit
  if(!C.end&&!P.dead&&pcx>199.6*T&&pcx<205*T&&P.y<1.6*T){C.end={t:0,x0:P.x,y0:P.y,amb:0};P.vx=P.vy=0}
  // répliques
  const once=(k,c,txt,d)=>{if(!C.said[k]&&c){C.said[k]=1;say(txt,d||3.8)}};
  once('ronge',pcx>21*T,"Des planches rongées. Les rats ont commencé, les vers ont fini le travail.",3.6);
  once('poutres',pcx>35*T,"Plus de plancher. De poutre en poutre, comme les écureuils. Le règlement n'a rien prévu pour les écureuils.",4.2);
  once('soleil',pcx>66*T,"Le soleil passe entre les tuiles. Dans ses rayons, la poussière tombe comme la neige de 1916.",4);
  once('collegues',pcx>79*T,"Des collègues. Enfin… Ceux-là n'ont jamais porté un pli de leur vie.",3.6);
  once('cloches',pcx>95*T,"La chambre des cloches. Elles sonnent pour quelqu'un. Pas pour moi, j'espère.",3.6);
  once('choeur',pcx>129*T,"Le comble du chœur. Ça monte encore. Il doit bien y avoir un trou dans ce toit.",3.6);
  once('trou',pcx>186*T,"De la lumière, là-haut. Un trou dans la charpente. On sort toujours par le haut.",3.6);
}
function comblesAfterMove(){const C=L.cb;if(!C)return null;if(C.hit){const h=C.hit;C.hit=null;return h}if(P.y>CBR*T)return'voute';return null}

/* ---------- la fin : sur le toit, la commune, le bal ---------- */
function comblesEndStep(dt){const C=L.cb,e=C.end;e.t+=dt;P.vx=P.vy=0;P.facing=1;
  const u=Math.min(1,e.t/1.1);P.x=lerp(e.x0,201.6*T,u);P.y=lerp(e.y0,-2.2*T,u*u);P.flapT=u<1?.3:0;P.onGround=false;
  if(e.t>1.1&&!e.music){e.music=1;if(!G.sim){setSong('bal');SFX.flap()}}
  if(e.t>1.1&&!G.sim){e.amb-=dt;if(e.amb<=0){e.amb=.18+rnd()*.3;noise(.5+rnd()*.6,500+rnd()*700,.012+rnd()*.01,'bandpass');if(rnd()<.1)tone(880+rnd()*400,.08,'sine',.02,1100+rnd()*300)}}
  if(e.t>16.5||e.skip){C.end=null;winLevel()}
}
function comblesSkip(){const e=L.cb&&L.cb.end;if(!e||e.t<2.5)return;if(e.t<6.6)e.t=6.6;else if(e.t>8.4)e.skip=1}
/* la commune vue du toit : préparée une fois, animée par-dessus */
let CB_VIEW=null;
function cbViewBuild(){
  const c=mk(W,H),g=c.getContext('2d'),R=mulberry(512);
  const sk=g.createLinearGradient(0,0,0,H*.62);sk.addColorStop(0,'#6a98c8');sk.addColorStop(.7,'#b8d4e8');sk.addColorStop(1,'#f0ead8');g.fillStyle=sk;g.fillRect(0,0,W,H);
  for(let k=0;k<7;k++){const x=R()*W,y=40+R()*120,w=90+R()*140;g.fillStyle='rgba(255,255,255,.8)';g.beginPath();g.ellipse(x,y,w,14,0,0,7);g.ellipse(x-w*.3,y-10,w*.4,16,0,0,7);g.ellipse(x+w*.25,y-13,w*.3,17,0,0,7);g.fill()}
  // les coteaux de la vallée du Grand Morin
  g.fillStyle='#8aa088';g.beginPath();g.moveTo(0,250);for(let x=0;x<=W;x+=40)g.lineTo(x,236+Math.sin(x*.01)*14+R()*6);g.lineTo(W,H);g.lineTo(0,H);g.fill();
  g.fillStyle='#6f8a68';g.beginPath();g.moveTo(0,270);for(let x=0;x<=W;x+=30)g.lineTo(x,262+Math.sin(x*.016+2)*10+R()*5);g.lineTo(W,H);g.lineTo(0,H);g.fill();
  for(let x=0;x<W;x+=14+R()*16){g.fillStyle=mix('#4e6e48','#3a5a38',R());g.beginPath();g.arc(x,276+R()*8,9+R()*9,0,7);g.fill()}
  // la collégiale de La Chapelle, au loin
  {const x=150,b=292;g.fillStyle='#a8a498';g.fillRect(x,b-34,90,34);poly(g,[x-3,b-34,x+45,b-54,x+93,b-34]);g.fill();g.fillRect(x+70,b-70,18,70);poly(g,[x+68,b-70,x+79,b-92,x+90,b-70]);g.fill()}
  // les toits du village, rangée après rangée
  const rowY=[300,322,348,380,420];
  rowY.forEach((y,i)=>{const s=.5+i*.22;for(let x=-20;x<W+20;){const w=(40+R()*50)*s,h=(18+R()*12)*s;
    if(i===2&&x>380&&x<720){x+=w*.6;continue}
    g.fillStyle=mix('#e8dcc4','#c8b89a',R());g.fillRect(x,y-h*.4,w,h*1.2);
    g.fillStyle=mix(mix('#b85a3a','#8a4a3a',R()),'#6a6a70',R()<.25?.7:0);poly(g,[x-3,y-h*.4,x+w*.5,y-h*1.25,x+w+3,y-h*.4]);g.fill();
    g.fillStyle='rgba(40,30,30,.35)';for(let k=0;k<2;k++)g.fillRect(x+w*(.2+k*.4),y,w*.14,h*.35);
    if(R()<.3){g.fillStyle='#8a6a5a';g.fillRect(x+w*.7,y-h*1.2,4*s,10*s)}
    x+=w+(2+R()*10)*s}
    // un bras du Grand Morin entre deux rangées, avec un lavoir
    if(i===1||i===3){g.fillStyle='rgba(120,160,190,.9)';g.fillRect(0,y+6,W,8+i*2);g.fillStyle='rgba(255,255,255,.35)';for(let x=0;x<W;x+=30)g.fillRect(x+R()*20,y+9,10,1.5);
      g.fillStyle='#7a5a3a';const lx=200+i*170;g.fillRect(lx,y-4,70,10);g.fillStyle='#9a4a32';poly(g,[lx-6,y-4,lx+35,y-20,lx+76,y-4]);g.fill()}
    // des arbres
    for(let k=0;k<5;k++){const x=R()*W;g.fillStyle=mix('#3e6a3a','#2a4a2a',R());g.beginPath();g.arc(x,y-10*s,12*s+R()*8*s,0,7);g.fill()}});
  // la place de la fête : un pré plus clair
  g.fillStyle='#b8b090';g.beginPath();g.ellipse(560,362,190,26,0,0,7);g.fill();
  // les chalets de bois
  for(let k=0;k<6;k++){const x=400+k*52+(k>2?40:0),y=368;g.fillStyle='#8a5a32';g.fillRect(x,y-18,34,18);g.fillStyle='#5a3a22';poly(g,[x-4,y-18,x+17,y-30,x+38,y-18]);g.fill();g.fillStyle='#f2e0a0';g.fillRect(x+6,y-13,22,6)}
  // le premier plan : le toit de l'église, tuiles plates
  g.save();poly(g,[0,H,0,440,W*.66,H]);g.clip();g.fillStyle='#6a3e2a';g.fillRect(0,400,W,H);
  for(let r=0;r<16;r++)for(let k=-2;k<30;k++){const y=436+r*9,x=k*24+(r%2)*12;g.fillStyle=mix('#9a5c3c','#6a3a28',R());rr(g,x,y,23,12,2);g.fill();g.fillStyle='rgba(0,0,0,.22)';g.fillRect(x,y+9,23,2.5);g.fillStyle='rgba(255,220,180,.08)';g.fillRect(x,y,23,1.5)}
  g.restore();g.strokeStyle='#3a2216';g.lineWidth=5;g.beginPath();g.moveTo(0,440);g.lineTo(W*.66,H);g.stroke();
  // le trou d'où l'on sort
  g.fillStyle='#1a120c';g.beginPath();g.ellipse(232,500,40,11,.36,0,7);g.fill();
  return c}
function comblesOverlay(t){const C=L.cb;if(!C)return;
  // les rayons de soleil (sur le monde)
  if(!C.end||C.end.t<1.3){ctx.save();ctx.globalCompositeOperation='lighter';const lum=C.lum;
    const draw=(x0,w,a,len)=>{const sx=x0-cam.x,sy=-cam.y,dx=len*.42;if(sx+dx<-200||sx>W+200)return;
      const gr=ctx.createLinearGradient(sx,sy,sx+dx,sy+len);gr.addColorStop(0,'rgba(255,226,160,'+a+')');gr.addColorStop(.55,'rgba(255,214,140,'+(a*.45)+')');gr.addColorStop(1,'rgba(255,214,140,0)');
      ctx.fillStyle=gr;ctx.beginPath();ctx.moveTo(sx,sy+T);ctx.lineTo(sx+w,sy+T);ctx.lineTo(sx+w*1.8+dx,sy+len);ctx.lineTo(sx+dx-w*.4,sy+len);ctx.closePath();ctx.fill()};
    for(const[c,w]of CB.rays)draw(c*T,w,.13*lum,820);
    draw(200*T,5*T,.2+.14*lum,1100);
    // la poussière dans les rayons
    for(const m of C.motes){const[c,w]=CB.rays[m.r];const v=(m.v+t*.02*m.s)%1,y=T+v*700,x=c*T+(y-T)*.42+m.u*w*(1+v*.8)+Math.sin(t*.7+m.u*9)*6;const sx=x-cam.x,sy=y-cam.y;if(sx<-10||sx>W+10)continue;
      ctx.fillStyle='rgba(255,236,190,'+(.35*lum*Math.sin(v*Math.PI))+')';ctx.fillRect(sx,sy,1.6*m.s,1.6*m.s)}
    ctx.restore()}
  const e=C.end;if(!e)return;
  // l'éblouissement de la sortie, puis la commune
  if(e.t<1.3){ctx.fillStyle='rgba(255,250,235,'+clamp((e.t-.5)/.8,0,1)+')';ctx.fillRect(0,0,W,H);return}
  if(!CB_VIEW)CB_VIEW=cbViewBuild();
  ctx.drawImage(CB_VIEW,0,0);
  // le manège qui tourne, les fanions, les gens sur la place
  {const x=560,y=352;ctx.save();ctx.fillStyle='#e8d8b0';ctx.fillRect(x-28,y-22,56,22);for(let k=0;k<8;k++){const a=t*1.6+k*Math.PI/4,px=x+Math.cos(a)*24,s=Math.sin(a);if(s<0)continue;ctx.fillStyle=['#c8402a','#3a6aa8','#e0b030','#5aa86a'][k%4];ctx.fillRect(px-3,y-14+Math.sin(t*3+k)*2,6,7)}
    ctx.fillStyle='#c8402a';poly(ctx,[x-34,y-22,x,y-44,x+34,y-22]);ctx.fill();ctx.fillStyle='#f2ead8';for(let k=0;k<4;k++){poly(ctx,[x-34+k*17,y-22,x,y-44,x-25+k*17,y-22]);ctx.fill()}
    ctx.fillStyle='#e0b030';ctx.beginPath();ctx.arc(x,y-46,3,0,7);ctx.fill();
    for(let k=0;k<12;k++){const lx=x-30+k*5.5,on=(Math.floor(t*4)+k)%3;ctx.fillStyle=on?'rgba(255,230,140,.95)':'rgba(255,230,140,.3)';ctx.fillRect(lx,y-23,2,2)}ctx.restore()}
  {ctx.save();ctx.lineWidth=1;ctx.strokeStyle='rgba(60,50,40,.6)';for(const[a,b,y]of[[380,520,344],[600,760,346]]){ctx.beginPath();ctx.moveTo(a,y);ctx.quadraticCurveTo((a+b)/2,y+12,b,y);ctx.stroke();
    for(let k=1;k<12;k++){const u=k/12,fx=lerp(a,b,u),fy=y+Math.sin(u*Math.PI)*12*1-0;ctx.fillStyle=['#c8402a','#f2ead8','#3a6aa8','#e0b030'][k%4];poly(ctx,[fx-3,fy,fx+3,fy,fx+Math.sin(t*3+k),fy+7]);ctx.fill()}}ctx.restore()}
  {const R=mulberry(91);for(let k=0;k<46;k++){const bx=400+R()*330,by=362+R()*16,ph=R()*7,dx=Math.sin(t*(.4+R()*.6)+ph)*14;ctx.fillStyle=['#3a3a4a','#8a2a2a','#2a4a6a','#e8e0d0','#5a6a3a'][k%5];ctx.fillRect(bx+dx,by-5,3,5);ctx.fillStyle='#d8b8a0';ctx.fillRect(bx+dx,by-7,3,2)}}
  // un vol de pigeons sur la vallée
  for(let k=0;k<5;k++){const x=((t*40+k*90)%(W+200))-100,y=150+Math.sin(t*.8+k)*16+k*6;ctx.strokeStyle='rgba(50,50,60,.7)';ctx.lineWidth=1.4;const fl=Math.sin(t*12+k)*3;ctx.beginPath();ctx.moveTo(x-6,y-fl);ctx.lineTo(x,y);ctx.lineTo(x+6,y-fl);ctx.stroke()}
  // Raymond, sur le bord du trou, qui regarde
  drawRaymond(ctx,262,486,{f:1,t,walk:0,wear:S.run.wear||0,size:1.6,eyeClosed:false});
  if(e.t<2.1){ctx.fillStyle='rgba(255,250,235,'+(1-(e.t-1.3)/.8)+')';ctx.fillRect(0,0,W,H)}
  // le carton du film muet
  if(e.t>7){const a=Math.min(1,(e.t-7)/1.1)*(e.t>15.5?Math.max(0,1-(e.t-15.5)):1);
    vxCard("Par le trou de la charpente, Raymond découvrit toute la commune.\nAu loin, sur la place, on donnait un bal.\nMarguerite avait toujours aimé les fêtes.",a,t)}
}

/* ---------- les tuiles : toute la charpente, peinte une fois ---------- */
function comblesTiles(){
  const wpx=L.wpx+DX+8,hpx=CBR*T+PAD,TR=Math.min(RS,1.5),{layer:c,g}=mkLayer(wpx*TR,hpx*TR);g.scale(TR,TR);c.rs=TR;g.translate(0,PAD);
  const R=mulberry(2026),oak='#5a4028',oakL='#7a5a3a',oakD='#2e2014';
  const holeAt=cc=>CB.holes.some(([a,b])=>cc>=a&&cc<=b);
  // les fermes, en élévation, derrière tout (bois plus sombre)
  for(const tc of CB.trusses){const x=tc*T+T/2;g.save();g.globalAlpha=.75;
    g.fillStyle=oakD;g.fillRect(x-9,T,18,15*T);                                     // le poinçon
    g.save();g.translate(x,16*T);for(const s of[-1,1]){g.save();g.rotate(s*-.72);g.fillRect(-7,-12*T,14,12*T);g.restore()}g.restore();   // les arbalétriers
    g.fillRect(x-5*T,16*T,10*T,16);g.fillRect(x-3*T,9*T,6*T,12);                    // entrait, faux-entrait
    for(const s of[-1,1]){g.save();g.translate(x,12*T);g.rotate(s*.6);g.fillRect(-4,0,8,3.4*T);g.restore()}   // contrefiches
    g.fillStyle='rgba(255,230,180,.06)';g.fillRect(x-9,T,3,15*T);
    g.fillStyle='#1e150c';for(const[px,py]of[[0,9.15*T],[0,16.2*T],[-4.4*T,16.2*T],[4.4*T,16.2*T]]){g.beginPath();g.arc(x+px,py+6,2.5,0,7);g.fill()}
    g.restore()}
  // le beffroi : la grande cage de chêne des cloches
  {g.save();g.globalAlpha=.8;g.fillStyle=oakD;for(const x of[95.5,104,112,120,125])g.fillRect(x*T-8,2*T,16,19*T);
    for(const y of[8,14,20])g.fillRect(95*T,y*T,30*T,14);
    g.strokeStyle=oakD;g.lineWidth=12;for(const[a,b]of[[95.5,104],[104,112],[112,120],[120,125]])for(const[y0,y1]of[[2,8],[8,14],[14,20]]){g.beginPath();g.moveTo(a*T,y0*T);g.lineTo(b*T,y1*T);g.moveTo(b*T,y0*T);g.lineTo(a*T,y1*T);g.stroke()}
    g.restore()}
  // l'extrados des voûtes : moellons noyés dans la chaux, bosses des voûtains, trous vers la nef
  for(let cc=0;cc<L.w;cc++){const x=cc*T;
    if(holeAt(cc)){const gr=g.createLinearGradient(0,CVF*T,0,CBR*T);gr.addColorStop(0,'#0c0806');gr.addColorStop(1,'#2a1a10');g.fillStyle=gr;g.fillRect(x,CVF*T,T,3*T);
      g.fillStyle='rgba(255,190,110,'+(.05+R()*.05)+')';g.fillRect(x+R()*30,CBR*T-20,3,12);continue}
    if(L.g[CVF][cc]!=='#')continue;
    const gr=g.createLinearGradient(0,CVF*T,0,CBR*T);gr.addColorStop(0,'#8a7a62');gr.addColorStop(.25,'#6a5c48');gr.addColorStop(1,'#2e261c');g.fillStyle=gr;g.fillRect(x,CVF*T,T,3*T);
    for(let k=0;k<6;k++){g.fillStyle=mix('#9a8a70','#5a4c3a',R());rr(g,x+R()*30,CVF*T+8+R()*80,8+R()*12,6+R()*7,3);g.fill()}
    g.fillStyle='#b4a68a';g.fillRect(x,CVF*T,T,3);g.fillStyle='rgba(220,210,180,.25)';for(let k=0;k<4;k++)g.fillRect(x+R()*38,CVF*T+3+R()*4,2+R()*4,1.5)}
  // les bosses des voûtains et les doubleaux
  for(let x=0;x<L.wpx;x+=6*T){g.fillStyle='rgba(0,0,0,.22)';g.fillRect(x-3,CVF*T,6,3*T);g.fillStyle='rgba(255,240,210,.08)';g.beginPath();g.ellipse(x+3*T,CVF*T+30,2.6*T,18,0,Math.PI,0);g.fill()}
  // les bords des trous : la voûte coupée, épaisse, déchiquetée
  for(const[a,b]of CB.holes)for(const[cx,s]of[[a*T,1],[(b+1)*T,-1]]){g.fillStyle='#4a3e30';g.beginPath();g.moveTo(cx,CVF*T);for(let y=0;y<=3*T;y+=8)g.lineTo(cx+s*(4+R()*9),CVF*T+y);g.lineTo(cx,CBR*T);g.closePath();g.fill();
    g.fillStyle='#b4a68a';g.fillRect(cx+(s<0?-8:0),CVF*T,8,3)}
  // le toit : la panne faîtière, les chevrons, les liteaux et le dessous des tuiles
  {g.fillStyle='#2a1e14';g.fillRect(0,0,L.wpx,T);g.fillStyle='#3e2c1c';for(let x=0;x<L.wpx;x+=26){g.fillRect(x,0,11,T+6)}
    g.fillStyle='#4e3a26';g.fillRect(0,T-4,L.wpx,12);g.fillStyle='rgba(255,230,180,.1)';g.fillRect(0,T-4,L.wpx,2);
    for(const[c,w]of CB.rays){g.fillStyle='rgba(255,236,190,.55)';g.fillRect(c*T+4,8,w*.6,5);g.fillStyle='rgba(255,236,190,.25)';g.fillRect(c*T,6,w,9)}
    // le trou de la sortie : le ciel, bleu
    const hx=200*T,hw=5*T;g.clearRect(hx,-PAD,hw,T+PAD+8);const sk=g.createLinearGradient(0,-PAD,0,T);sk.addColorStop(0,'#7aa8d8');sk.addColorStop(1,'#d8e8f2');g.fillStyle=sk;g.fillRect(hx,-PAD,hw,T+PAD+4);
    g.fillStyle='#2a1e14';for(let k=0;k<8;k++){const x=hx+k*hw/8;poly(g,[x,T+4,x+hw/8,T+4,x+hw/16+(R()-.5)*8,T-10-R()*20]);g.fill()}
    g.fillStyle='#3e2c1c';g.save();g.translate(hx+hw*.7,T);g.rotate(-.5);g.fillRect(-4,-36,9,46);g.restore()}
  // les murs de pierre : pignons et clocher
  for(let cc=0;cc<L.w;cc++)for(let r=0;r<CBR;r++){if(L.g[r][cc]!=='X')continue;const x=cc*T,y=r*T;
    g.fillStyle='#6a6050';g.fillRect(x,y,T,T);g.strokeStyle='rgba(30,24,18,.5)';g.lineWidth=1.2;
    for(let k=0;k<2;k++){g.beginPath();g.moveTo(x,y+k*20);g.lineTo(x+T,y+k*20);g.stroke();const o=(r+k)%2?12:28;g.beginPath();g.moveTo(x+o,y+k*20);g.lineTo(x+o,y+k*20+20);g.stroke()}
    g.fillStyle='rgba(255,240,210,.06)';g.fillRect(x+2,y+2,T-4,4);g.fillStyle='rgba(0,0,0,'+(.1+R()*.12)+')';g.fillRect(x+R()*30,y+R()*30,8,6)}
  // l'arc de la porte du clocher (passage du bas) et la baie du haut
  {g.fillStyle='#4a4236';g.beginPath();g.arc(94*T,17*T,2*T,Math.PI,0);g.fill();g.fillStyle='#5a5244';for(let k=0;k<7;k++){g.save();g.translate(94*T,17*T);g.rotate(Math.PI+k*Math.PI/6);g.fillRect(2*T-14,-5,16,10);g.restore()}}
  // les poutres où l'on marche : chêne équarri, fentes, chevilles, bouts rongés
  for(let r=0;r<CBR;r++)for(let cc=0;cc<L.w;cc++){if(L.g[r][cc]!=='=')continue;const x=cc*T,y=r*T,lf=L.g[r][cc-1]!=='=',rt=L.g[r][cc+1]!=='=';
    g.fillStyle='rgba(0,0,0,.3)';g.fillRect(x+4,y+24,T,8);
    g.fillStyle=oak;g.fillRect(x,y,T,24);g.fillStyle=oakL;g.fillRect(x,y,T,5);g.fillStyle=oakD;g.fillRect(x,y+20,T,4);
    g.strokeStyle='rgba(30,20,10,.5)';g.lineWidth=1;for(let k=0;k<2;k++){const yy=y+9+k*6+R()*2;g.beginPath();g.moveTo(x,yy);g.bezierCurveTo(x+12,yy+R()*3,x+26,yy-R()*3,x+T,yy);g.stroke()}
    if(R()<.25){g.fillStyle='#3a2a18';g.beginPath();g.arc(x+T/2,y+13,2.6,0,7);g.fill()}
    if(R()<.15){g.fillStyle='rgba(20,12,6,.6)';for(let k=0;k<5;k++)g.fillRect(x+R()*36,y+6+R()*14,1.5,1.5)}   // trous de vers
    if(lf){g.fillStyle='#2a1c10';poly(g,[x,y,x+6,y+3,x+3,y+9,x+7,y+15,x+2,y+24,x,y+24]);g.fill()}
    if(rt){g.fillStyle='#2a1c10';poly(g,[x+T,y,x+T-5,y+4,x+T-2,y+10,x+T-7,y+17,x+T-3,y+24,x+T,y+24]);g.fill()}}
  // les toiles du décor, dans les angles
  for(const tc of CB.trusses){cobweb(g,tc*T+T/2+10,T+8,40+R()*30)}
  g.save();g.globalCompositeOperation='source-atop';g.globalAlpha=.3;g.fillStyle=g.createPattern(paperC,'repeat');g.fillRect(0,-PAD,wpx,hpx);g.restore();
  return c}
/* une planche vermoulue (case %) */
function cbCrumble(g,x,y,sh){g.save();g.fillStyle='#6a5236';g.fillRect(x,y,T,14);g.fillStyle='#8a6e4a';g.fillRect(x,y,T,3);
  g.fillStyle='#2a1c10';poly(g,[x+8,y+14,x+12,y+8,x+16,y+14]);g.fill();poly(g,[x+26,y+14,x+29,y+10,x+33,y+14]);g.fill();
  g.strokeStyle='rgba(20,12,6,'+(.5+sh)+')';g.lineWidth=1.2;g.beginPath();g.moveTo(x+4,y+6);g.lineTo(x+18,y+7);g.lineTo(x+22,y+4);g.moveTo(x+24,y+9);g.lineTo(x+36,y+8);g.stroke();
  g.fillStyle='rgba(20,12,6,.55)';for(let k=0;k<6;k++)g.fillRect(x+3+((k*13)%34),y+5+(k*5)%7,1.5,1.5);g.restore()}

/* ---------- fond : le dessous des tuiles, au loin les autres fermes ---------- */
function comblesFar(L,g,wpx,R){
  const gr=g.createLinearGradient(0,0,0,600);gr.addColorStop(0,'#1e160e');gr.addColorStop(.5,'#2a2016');gr.addColorStop(1,'#120c08');g.fillStyle=gr;g.fillRect(0,-400,wpx,1000);
  // les liteaux et les tuiles, vus de dessous, avec des jours entre elles
  for(let y=-380;y<360;y+=16){g.fillStyle='rgba(70,50,32,.55)';g.fillRect(0,y,wpx,5);for(let x=(y/16%2)*12;x<wpx;x+=24){g.fillStyle='rgba(90,56,36,.35)';g.fillRect(x,y+5,22,10)}}
  for(let k=0;k<wpx/30;k++){const x=R()*wpx,y=-360+R()*700;g.fillStyle='rgba(255,226,170,'+(.15+R()*.3)+')';g.fillRect(x,y,2+R()*5,1.5)}
  // les fermes lointaines
  for(let x=60;x<wpx;x+=230){g.fillStyle='rgba(12,8,4,.35)';g.fillRect(x-6,-380,12,880);g.save();g.translate(x,420);for(const s of[-1,1]){g.save();g.rotate(s*-.72);g.fillRect(-5,-560,10,560);g.restore()}g.restore();g.fillRect(x-180,420,360,10)}
  const hz=g.createLinearGradient(0,380,0,600);hz.addColorStop(0,'rgba(0,0,0,0)');hz.addColorStop(1,'rgba(0,0,0,.6)');g.fillStyle=hz;g.fillRect(0,380,wpx,220);
}
function comblesMidLayer(L,g,wpx,R){
  for(let x=120;x<wpx;x+=300+R()*120){g.fillStyle='rgba(20,14,8,.85)';g.fillRect(x-7,-500,14,1000);g.fillRect(x-150,300,300,12);g.fillRect(x-90,120,180,10);
    g.save();g.translate(x,300);for(const s of[-1,1]){g.save();g.rotate(s*-.72);g.fillRect(-6,-520,12,520);g.restore()}g.restore()}
}

/* ---------- les bêtes et les détails, au-dessus des tuiles ---------- */
function drawComblesMid(t){const C=L.cb;if(!C)return;const g=ctx,vis=(x,y)=>x>cam.x-80&&x<cam.x+W+80;
  // toiles d'araignée qui engluent
  for(const w of C.webs){if(!vis(w.x)&&!vis(w.x+w.w))continue;const cx=w.x+w.w/2,cy=w.y+w.h/2,sh=Math.sin(t*30)*w.shake*3;g.save();
    g.strokeStyle='rgba(232,226,210,.55)';g.lineWidth=1;const n=9;
    for(let k=0;k<n;k++){const a=k/n*Math.PI*2;g.beginPath();g.moveTo(cx,cy+sh);g.lineTo(cx+Math.cos(a)*w.w*.55,cy+Math.sin(a)*w.h*.55);g.stroke()}
    for(let r=.12;r<.56;r+=.08){g.beginPath();for(let k=0;k<=n;k++){const a=k/n*Math.PI*2,x=cx+Math.cos(a)*w.w*r,y=cy+Math.sin(a)*w.h*r+sh*(1-r);if(k)g.quadraticCurveTo((x+cx)/2+Math.cos(a)*w.w*r*.5,(y+cy)/2+Math.sin(a)*w.h*r*.5,x,y);else g.moveTo(x,y)}g.stroke()}
    g.strokeStyle='rgba(232,226,210,.4)';g.beginPath();g.moveTo(cx,w.y-T);g.lineTo(cx,w.y+w.h*.2);g.stroke();
    // l'araignée, qui descend voir
    const sy=w.y+w.h*.2+Math.sin(t*.8+w.x)*10+w.shake*20;g.fillStyle='#1a1410';g.beginPath();g.ellipse(cx,sy,4,5,0,0,7);g.fill();g.strokeStyle='#1a1410';g.lineWidth=1;for(let k=0;k<4;k++)for(const s of[-1,1]){g.beginPath();g.moveTo(cx,sy);g.lineTo(cx+s*8,sy-4+k*3);g.lineTo(cx+s*11,sy+k*3);g.stroke()}
    g.restore()}
  // secrets : le nid (et sa bague), le graffiti dans la poutre
  {const a=C.bague;if(vis(a.x)){g.save();g.translate(a.x,a.y);g.fillStyle='#8a7048';g.beginPath();g.ellipse(0,-6,20,8,0,0,7);g.fill();g.strokeStyle='#5a4428';g.lineWidth=1.2;for(let k=0;k<9;k++){g.beginPath();g.moveTo(-20+k*4,-2);g.lineTo(-14+k*4,-12);g.stroke()}
    g.fillStyle='#3a2a18';g.beginPath();g.ellipse(0,-9,12,4,0,0,7);g.fill();if(!a.used){g.strokeStyle='#d8b450';g.lineWidth=1.6;g.beginPath();g.ellipse(4,-10,3,2,0,0,7);g.stroke()}g.restore()}}
  {const a=C.graf;if(vis(a.x)){g.save();g.strokeStyle=a.used?'rgba(255,230,180,.55)':'rgba(255,230,180,.22)';g.lineWidth=1;g.font='italic 8px '+F_BODY;g.fillStyle=g.strokeStyle;g.textAlign='center';g.fillText('L ♥ M 1913',a.x,a.y+15);g.restore()}}
  // pigeons
  for(const o of C.pig)if(vis(o.x))drawUglyPigeon(g,o,t);
  for(const o of C.chieurs){if(!vis(o.x))continue;g.save();g.translate(o.x,o.y);g.scale(-1,1);
    g.fillStyle='#6a7080';g.beginPath();g.ellipse(0,-10,11,8,0,0,7);g.fill();g.fillStyle='#565c6a';poly(g,[-8,-12,-20,-14-o.lift*8,-19,-7-o.lift*6,-8,-7]);g.fill();
    g.fillStyle='#4f8a7a';g.beginPath();g.ellipse(7,-15,4,5,.3,0,7);g.fill();g.fillStyle='#7a7e8a';g.beginPath();g.arc(10,-20,5,0,7);g.fill();g.fillStyle='#d97a2a';g.beginPath();g.arc(11.5,-21,1.6,0,7);g.fill();g.fillStyle='#111';g.beginPath();g.arc(11.8,-21,.7,0,7);g.fill();
    g.fillStyle='#c8a070';poly(g,[14,-20,18,-19,14,-18]);g.fill();g.restore()}
  for(const d of C.drops){if(!vis(d.x))continue;g.fillStyle='#eeeae0';if(d.dead){g.globalAlpha=Math.max(0,1-d.life/2.5);g.beginPath();g.ellipse(d.x,d.y-1,7,2.5,0,0,7);g.fill();g.globalAlpha=1}
    else{g.beginPath();g.ellipse(d.x,d.y,3,4.5,0,0,7);g.fill();g.fillStyle='#5a5446';g.beginPath();g.arc(d.x,d.y+1,1.4,0,7);g.fill()}}
  // écureuils
  for(const s of C.squirrels){if(!vis(s.x))continue;g.save();g.translate(s.x,s.y);g.scale(s.f,1);const run=s.pause>0?0:Math.sin(t*30);
    g.fillStyle='#a8562a';g.beginPath();g.moveTo(-6,-8);g.bezierCurveTo(-24,-10,-26,-30,-12,-32);g.bezierCurveTo(-4,-30,-10,-18,-4,-12);g.closePath();g.fill();
    g.fillStyle='#b8622e';g.beginPath();g.ellipse(0,-8,9,6,-.2,0,7);g.fill();g.beginPath();g.arc(8,-13,5,0,7);g.fill();poly(g,[6,-17,7,-23,10,-17]);g.fill();
    g.fillStyle='#f0d8b0';g.beginPath();g.ellipse(3,-6,4,3,0,0,7);g.fill();g.fillStyle='#111';g.beginPath();g.arc(10,-14,1.2,0,7);g.fill();
    g.strokeStyle='#8a4420';g.lineWidth=2;g.beginPath();g.moveTo(-4,-3);g.lineTo(-5+run*3,0);g.moveTo(5,-3);g.lineTo(6-run*3,0);g.stroke();g.restore()}
  // hiboux
  for(const o of C.owls){if(!vis(o.x))continue;g.save();g.translate(o.x,o.y);g.scale(o.f,1);const fly=o.st==='dive'||o.st==='back';
    if(fly){const fl=Math.sin(t*(o.st==='dive'?6:16))*.5;g.fillStyle='#7a5a3a';for(const s of[-1,1]){g.save();g.scale(1,s);g.rotate(-.25+fl*s*.3);g.beginPath();g.ellipse(-2,-12,26,8,-.3,0,7);g.fill();g.restore()}}
    const by=fly?0:-18;g.fillStyle='#8a6a44';g.beginPath();g.ellipse(0,by,13,17,0,0,7);g.fill();
    g.fillStyle='#e8d8b8';g.beginPath();g.ellipse(2,by-5,10,9,0,0,7);g.fill();
    g.fillStyle='#5a4028';poly(g,[-8,by-12,-6,by-22,-2,by-13]);g.fill();poly(g,[10,by-12,9,by-22,5,by-13]);g.fill();
    const glow=o.st==='warn'||o.st==='dive';g.fillStyle=glow?'#ffcc33':'#e8a830';for(const ex of[-2,6]){g.beginPath();g.arc(ex,by-6,3,0,7);g.fill()}
    g.fillStyle='#111';for(const ex of[-2,6]){if(o.st==='perch'&&Math.sin(t*.7+o.hx)>.6)g.fillRect(ex-3,by-6.5,6,1.4);else{g.beginPath();g.arc(ex,by-6,1.5,0,7);g.fill()}}
    g.fillStyle='#d8a040';poly(g,[2,by-3,4,by-3,3,by+1]);g.fill();
    g.strokeStyle='rgba(60,40,20,.5)';g.lineWidth=1;for(let k=0;k<4;k++){g.beginPath();g.arc(1,by+4+k*3,3,.3,2.8);g.stroke()}
    if(!fly){g.fillStyle='#c8a050';g.fillRect(-5,-2,3,3);g.fillRect(3,-2,3,3)}
    g.restore()}
}
