/* =========================================================
   5-4 · LE CIMETIÈRE — le cimetière communal de Crécy-la-Chapelle, en pleine nuit, dans le brouillard
   ---------------------------------------------------------
   De gauche à droite, une seule traversée : dalles basses, croix de fer forgé sur gravier, vieilles stèles moussues,
   tombes de granit récentes (photos, fleurs), colonnes brisées, chapelles funéraires à grille entrouverte.
   Des fantômes errent entre les tombes : leurs jambes sont du brouillard ; chacun répète un souvenir, toutes les quatre
   secondes, dans sa bulle. Les toucher, c'est sentir une raideur et repartir du cartel.
     · les fantômes bas : on saute par-dessus ;
     · les fantômes hauts (le brouillard leur descend jusqu'au sol) : on passe par le haut des tombes,
       ou l'on se cache dans une chapelle le temps qu'ils passent.
   À mi-chemin, le monument aux morts : Raymond y lit le nom de Lucien (la caméra s'approche des noms).
   Hiboux dans les deux tilleuls, rats, chauves-souris ; en haut d'une stèle du fond, un pigeon fantôme qui regarde vers nous.
   Au bout, la tombe Garnier (la fin de niveau d'origine), et après la tombe, Marguerite et Joseph, main dans la main.
   ========================================================= */
const CMW=192,CMG=12,CMF=CMG*T;
const cmSh=(h,a)=>a<0?mix(h,"#000000",-a):mix(h,"#ffffff",a);
THEMES.cemetery=Object.assign(THEMES.cemetery,{far:'cimetiere',walker:'rat',flyer:'bat',props:[],noFore:true});
const CMX={
  // [genre, colonne de début, colonne de fin, rangée du haut (partie solide), options]
  graves:[['dalle',8,9],['croixfer',11,12],['stele',14,14,10],['dalle',17,18],['granit',19,22,9,{nom:'BERTIN'}],['stele',25,25,10],['chapelle',29,31,7,{nom:'DUVAL'}],
    ['dalle',33,34],['croix',36,36,10],['colonne',38,38,7],['dalle',41,42],['chapelle',46,48,7,{nom:'LEMAIRE'}],['croixfer',50,51],['stele',52,52,10],['granit',54,57,8,{nom:'ROUSSEAU',fleurs:1}],
    ['dalle',64,65],['stele',67,67,9],['croix',69,69,10],['dalle',71,72],['chapelle',74,76,7,{nom:'CHEVALIER'}],['colonne',78,78,7],['croixfer',81,82],['stele',84,84,10],['dalle',86,87],
    ['dalle',103,104],['granit',106,109,9,{nom:'PICARD',fleurs:1}],['stele',111,111,10],['croixfer',113,114],['chapelle',117,119,7,{nom:'DELAUNAY'}],['stele',121,121,9],['colonne',123,123,6],['dalle',127,128],['croix',130,130,10],
    ['dalle',140,141],['stele',143,143,10],['croixfer',145,146],['granit',148,151,9,{nom:'LECLERC',fleurs:1}],['dalle',153,154],['chapelle',157,159,7,{nom:'BOUCHER'}],['stele',161,161,9],['colonne',163,163,7],
    ['dalle',167,168],['croix',170,170,10],['stele',172,173,10]],
  trees:[{x:61.5,br:[[59,60,8],[63,64,6],[61,62,4]]},{x:176.5,br:[[174,175,8],[178,179,6],[176,177,3]]}],
  mem:{c0:89,c1:100,x:95*T},   // centré sur ses marches : le monument repose entièrement sur la marche haute
  tomb:181,
  // les fantômes : a, b (colonnes), haut ?, vitesse, allure, souvenir
  ghosts:[[15.5,27,0,46,'chignon',"Le facteur passait à midi. Je l'attendais tous les jours."],
    [40.4,53.6,1,64,'casquette',"Le Grand Morin avait gelé, l'hiver 56. On patinait jusqu'au lavoir."],
    [64.5,72.6,0,42,'fichu',"Ma vache s'appelait Rosette. Elle rentrait toute seule à l'étable."],
    [75.2,87,0,56,'beret',"J'ai gagné le concours de pêche, en 61. Une carpe de six livres !"],
    [103.6,110,0,44,'chauve',"Le pain sortait du four à cinq heures. Je sens encore l'odeur."],
    [112,126.4,1,66,'boucles',"Il m'a demandée en mariage sous le préau de l'école."],
    [140,150.6,0,50,'casquette',"Les Américains sont passés en août 44. Ils nous lançaient du chocolat."],
    [152.6,162.4,1,66,'fichu',"Mon Paulo est rentré d'Algérie. Il ne parlait plus beaucoup."],
    [165.6,174.2,0,40,'lunettes',"Ma petite-fille m'a montré la maison sur son téléphone. Vue du ciel !"]]
};
const CM_NAMES=[['ADAM','Raymond'],['BARBIER','André'],['BERTIN','Louis'],['BLONDEAU','Gaston'],['BOUCHER','Émile'],['CHAUVIN','Paul'],['COLLIN','Marcel'],['DELAUNAY','Jules'],['DUBOIS','Henri'],['FERRAND','Charles'],
  ['GAUTHIER','Albert'],['GIRARD','Fernand'],['HUBERT','Joseph'],['JOLY','Pierre'],['LAMBERT','Eugène'],['LECLERC','Maurice'],['LEROY','Georges'],['MARTIN','Alfred'],['MOREAU','Jean'],
  ['NOËL','René'],['PERRIN','Victor'],['PICARD','Édouard'],['RENARD','Léon'],['ROUSSEAU','Gustave'],['TISSIER','Arthur'],['VASSEUR','Lucien']];
(function(){const g=Array.from({length:15},()=>Array(CMW).fill('.'));for(let c=0;c<CMW;c++)for(let r=CMG;r<15;r++)g[r][c]='#';
  const d=LEVELS.find(d=>d.cm);if(d)d.segs=[g.map(r=>r.join('')).join('\n')]})();

/* ---------- au chargement du niveau ---------- */
function cmPost(Lv){
  if(!Lv.def.cm)return;
  const C=Lv.cm={t:0,said:{},seq:null,hit:null,hid:false},g=Lv.g;
  const plat=(c0,c1,r)=>{for(let c=c0;c<=c1;c++)g[r][c]='='},box=(c0,c1,r0,r1)=>{for(let c=c0;c<=c1;c++)for(let r=r0;r<=r1;r++)g[r][c]='X'};
  C.graves=CMX.graves.map(([k,c0,c1,r0,o],i)=>Object.assign({k,c0,c1,r0:r0||11,i},o||{}));
  for(const q of C.graves){
    if(q.k==='chapelle')plat(q.c0,q.c1,q.r0);
    else if(q.k==='granit'){box(q.c0,q.c1,11,11);box(q.c0+1,q.c1-1,q.r0,10)}
    else box(q.c0,q.c1,q.r0,11)}
  C.chapels=C.graves.filter(q=>q.k==='chapelle');
  for(const tr of CMX.trees)for(const[c0,c1,r]of tr.br)plat(c0,c1,r);
  // les marches du monument aux morts
  box(CMX.mem.c0,CMX.mem.c1,11,11);box(CMX.mem.c0+1,CMX.mem.c1-1,10,10);
  Lv.spawn={x:1.5*T,y:CMF};
  Lv.exit={x:CMX.tomb*T-6,y:10*T,w:T+12,h:2*T};
  Lv.cps=[[59.5,CMF],[101.5,CMF],[137.5,CMF]].map(([c,y])=>({x:c*T,y,on:false}));
  // la paille
  for(const[c,r]of[[8.5,10],[14,9],[20.5,8],[30,6],[38,6],[47,6],[55.5,7],[59.5,7],[63.5,5],[75,6],[78,6],[99.5,10],[107.5,8],[118,6],[121,8],[149.5,8],[158,6],[163,6],[172.5,9],[174.5,7],[178.5,5]])   /*v2*/ /* plus de paille sous un hibou : elles sont sur les branches voisines ou la stèle d'à côté */
    Lv.corn.push({x:(c+.5)*T,y:(r+.5)*T,taken:false,ph:c*.7+r});
  // le secret : le vase renversé au pied de la vieille croix
  Lv.acts=Lv.acts||[];
  Lv.acts.push({kind:'secret',style:'vase',x:130.5*T,y:10*T,open:0,t:0,used:false,
    q:["Un vase, au pied de la vieille croix. Dedans, de la paille, pour caler des fleurs fanées depuis longtemps. Elle, au moins, m'attendait."]});
  // les fantômes
  C.ghosts=CMX.ghosts.map(([a,b,hi,sp,kind,line],i)=>{const yb=hi?CMF-176:CMF-24;
    const gh={a:a*T,b:b*T,hi:!!hi,sp,kind,line,x:lerp(a,b,.3+.4*((i*.37)%1))*T,dir:i%2?-1:1,f:i%2?-1:1,pause:0,yb0:yb,y:yb,ph:i*1.37,t:i*.9,li:{x:0,y:0,r:hi?150:120,i:.5}};
    Lv.lights.push(gh.li);return gh});
  // les hiboux, dans les deux tilleuls
  C.owls=[{hx:61.5*T,hy:2.6*T},{hx:123.5*T,hy:6*T},{hx:176.5*T,hy:1.7*T}]/*v2*/ /* le troisième, perché sur la colonne brisée */.map(o=>Object.assign(o,{x:o.hx,y:o.hy,st:'perch',t:0,cool:1.2,f:-1,n:0}));
  // les rats, bornés par des butées
  Lv.rats=[];Lv.mark=new Set();
  for(const[a,b,x]of[[131,136,133]]){Lv.mark.add(a+',11');Lv.mark.add(b+',11');Lv.rats.push({kind:'rat',x:x*T-15,y:CMF-16,w:30,h:16,vx:95,vy:0,onGround:false,t:x*.37%9,sq:1+x%3,base:95})}
  // les chauves-souris
  Lv.moths=[[30.5,190,'h',90],[94.5,165,'h',120],[133.5,190,'h',80],[140.5,220,'h',70]].map(([c,y,ax,amp],i)=>({kind:'bat',cx:c*T,cy:y,axis:ax,amp,sp:2.2+(i%3)*.25,t:i*1.3,x:c*T,y,fl:0}));
  // la nuit : quelques lumignons, la lune sur le monument, la tombe
  Lv.darkNow=.5;
  for(const q of C.graves)if(q.k==='granit'||(q.k==='croix'&&q.c0%2===0))Lv.lights.push({x:(q.c0+q.c1+1)/2*T+(q.k==='granit'?-46:-18),y:CMF-24,r:110,i:.7,warm:1,flick:1});
  Lv.lights.push({x:CMX.mem.x,y:260,r:300,i:.8},{x:(CMX.tomb+.5)*T,y:400,r:260,i:.85},{x:3*T,y:330,r:200,i:.6});
}
function cmTiles(){const sv=[];for(let r=0;r<ROWS;r++)for(let c=0;c<L.w;c++){const ch=L.g[r][c];if(ch!=='#'&&ch!=='.'){sv.push([c,r,ch]);L.g[r][c]='.'}}
  for(let r=CMG;r<ROWS;r++){sv.push([0,r,L.g[r][0]],[L.w-1,r,L.g[r][L.w-1]]);L.g[r][0]=L.g[r][L.w-1]='#'}
  const t=buildTilesF(L);for(const[c,r,ch]of sv)L.g[r][c]=ch;return t}
/* Raymond est-il caché dans une chapelle ? */
function cmHidden(){const C=L.cm;if(!C||P.dead)return false;
  for(const q of C.chapels)if(P.x>=q.c0*T+10&&P.x+P.w<=(q.c1+1)*T-10&&P.y>=q.r0*T+6)return true;return false}

/* ---------- à chaque image ---------- */
function cmStep(dt){const C=L.cm;if(!C)return;C.t+=dt;
  const pcx=P.x+P.w/2,pcy=P.y+P.h/2,hb={x:P.x+3,y:P.y+4,w:P.w-6,h:P.h-6};let hit=null;
  const hid=C.hid=cmHidden();if(hid)for(const q of C.chapels)if(P.x>=q.c0*T+10&&P.x+P.w<=(q.c1+1)*T-10&&P.y>=q.r0*T+6)achChapel(q.nom||q.c0,C.chapels.length);
  // les fantômes errent, sans voir personne ; celui qui est dans une chapelle, ils passent devant sans le sentir
  for(const gh of C.ghosts){gh.t+=dt;
    if(gh.pause>0)gh.pause-=dt;
    else{gh.x+=gh.dir*gh.sp*dt;if(gh.x>gh.b){gh.x=gh.b;gh.dir=-1;gh.pause=1.3}if(gh.x<gh.a){gh.x=gh.a;gh.dir=1;gh.pause=1.3}}
    gh.f=gh.dir;gh.y=gh.yb0+Math.sin(C.t*1.6+gh.ph)*5;gh.li.x=gh.x;gh.li.y=gh.y-44;
    if(!P.dead&&!hid&&overlap(hb,{x:gh.x-14,y:gh.y-72,w:28,h:CMF-4-(gh.y-72)}))hit='fantome'}
  // les hiboux : un hululement, les yeux qui s'ouvrent, une seconde, puis le piqué
  for(const o of C.owls){o.t+=dt;o.cool-=dt;
    if(o.st==='perch'){o.x=o.hx;o.y=o.hy;const dx=pcx-o.hx,dy=pcy-o.hy;if(o.cool<=0&&!P.dead&&Math.abs(dx)<320&&dy>30&&dy<440){o.st='warn';o.t=0;o.f=dx>0?1:-1;o.n++;if(!G.sim){tone(330,.3,'sine',.05,300);setTimeout(()=>tone(290,.5,'sine',.05,262),360);bubble(o.hx,o.hy-50,'Hou-hou…','#5a4a3a')}}}
    else if(o.st==='warn'){if(o.t>1){o.st='dive';o.t=0;const off=(o.n%2?1:-1)*40;o.tx=pcx;o.ty=pcy+off;o.sx=o.hx;o.sy=o.hy;o.ex=pcx+o.f*280;o.ey=o.hy+60}}
    else if(o.st==='dive'){const u=Math.min(1,o.t/1.15),a=(1-u)*(1-u),b=2*(1-u)*u,c=u*u,mx=2*o.tx-.5*(o.sx+o.ex),my=2*o.ty-.5*(o.sy+o.ey);o.x=a*o.sx+b*mx+c*o.ex;o.y=a*o.sy+b*my+c*o.ey;
      if(u>=1){o.st='back';o.t=0;o.bx=o.x;o.by=o.y}if(!P.dead&&overlap(hb,{x:o.x-16,y:o.y-10,w:32,h:20}))hit='hibou'}
    else if(o.st==='back'){const u=Math.min(1,o.t/1.3),e=u*u*(3-2*u);o.x=lerp(o.bx,o.hx,e);o.y=lerp(o.by,o.hy,e)-Math.sin(u*Math.PI)*50;o.f=o.hx>o.bx?1:-1;if(u>=1){o.st='perch';o.cool=2.6}}}
  if(hit)C.hit=hit;
  // répliques
  const once=(k,c,txt,d)=>{if(!C.said[k]&&c){C.said[k]=1;say(txt,d||3.8)}};
  {const g0=C.ghosts[0];once('fant',!P.dead&&Math.abs(g0.x-pcx)<430,"Et voilà que je vois les morts, maintenant. Je perds la boule.",4)}
  once('chap',pcx>25.5*T,"Une chapelle, la grille entrouverte. Là-dedans, ils ne me verront pas.",3.8);
  once('haut',pcx>36.5*T,"Celui-là flotte trop haut pour que je saute par-dessus. Par le haut des tombes, alors. Ou bien je me cache.",4.4);
  once('noms',pcx>63*T,"Des noms, partout. Bertin, Rousseau, Chevalier. Tout le village est là.",3.8);
  once('brume',pcx>139*T,"Le brouillard monte. Elle est là, quelque part. Je le sens.",3.6);
  // le monument aux morts
  if(!C.said.mem&&!P.dead&&P.onGround&&pcx>93.6*T&&pcx<96*T){C.said.mem=1;C.seq={k:'mem',t:0};P.vx=0;G.quip=null;G.quipQ=[]}
}
function cmAfterMove(){const C=L.cm;if(!C)return null;if(C.hit){const h=C.hit;C.hit=null;return h}return null}
function cmRespawn(){const C=L.cm;if(!C)return;C.hit=null;for(const o of C.owls){o.st='perch';o.x=o.hx;o.y=o.hy;o.cool=1.5}}

/* ---------- le monument aux morts : on s'approche des noms ---------- */
const CM_MEM_LINES=[[0,"Le monument aux morts. « Hommage des enfants de Crécy à leurs aînés morts pour la patrie. »",4.6],
  [4.8,"Vasseur… Lucien…",3.2],[8.2,"Lucien. Son nom est gravé là, avec les autres. Lui non plus n'est jamais rentré. Mon pauvre Lucien…",4.4],[14.8,"Marguerite ne doit plus être très loin…",3]];
function cmNameXY(){// la place du nom de Lucien sur la plaque de droite
  const i=CM_NAMES.findIndex(n=>n[0]==='VASSEUR'),half=Math.ceil(CM_NAMES.length/2),j=i-half;return[CMX.mem.x+58,234+j*8.2]}
function cmSeqStep(dt){const C=L.cm,q=C.seq;q.t+=dt;G.lt+=dt;P.vx=0;P.vy=Math.min(MAXFALL,P.vy+GRAV*dt);P.onGround=false;moveY(P,P.vy*dt);P.facing=1;
  for(const[t0,txt,d]of CM_MEM_LINES)if(q.t>=t0&&!(q['l'+t0])){q['l'+t0]=1;say(txt,d)}
  const z=L.zoom||(L.zoom={z:1,fx:cam.x+W/2,fy:cam.y+H/2});const[nx,ny]=cmNameXY(),c0x=cam.x+W/2,c0y=cam.y+H/2;
  if(q.t<1.2){z.z=1;z.fx=c0x;z.fy=c0y}
  else if(q.t<12.8){const u=Math.min(1,(q.t-1.2)/2.6),k=u*u*(3-2*u);z.z=lerp(1,2.7,k);z.fx=lerp(c0x,nx-30,k);z.fy=lerp(c0y,ny,k)}
  else{const u=Math.min(1,(q.t-12.8)/1.8),k=u*u*(3-2*u);z.z=lerp(2.7,1,k);z.fx=lerp(nx-30,c0x,k);z.fy=lerp(ny,c0y,k)}
  if(q.t>14.8){C.seq=null;L.zoom=null}
}
function cmSkip(){const q=L.cm&&L.cm.seq;if(!q)return;for(const m of[4.8,8.2,12.8,14.8])if(q.t<m-.05&&q.t>.8){q.t=m;G.quip=null;G.quipQ=[];break}}

/* ---------- fond : le ciel de nuit, la collégiale, le mur du cimetière et les rangées du fond ---------- */
function cmFar(L,g,wpx,R){
  const gr=g.createLinearGradient(0,0,0,480);gr.addColorStop(0,'#05070f');gr.addColorStop(.6,'#121730');gr.addColorStop(1,'#2a2e4a');g.fillStyle=gr;g.fillRect(0,0,wpx,600);
  for(let k=0;k<wpx/6;k++){const y=R()*330;g.fillStyle='rgba(230,235,255,'+(.25+R()*.55)*(1-y/420)+')';g.fillRect(R()*wpx,y,R()<.1?1.8:1.1,R()<.1?1.8:1.1)}
  const mx=wpx*.36,my=110;{const hg=g.createRadialGradient(mx,my,10,mx,my,220);hg.addColorStop(0,'rgba(220,226,255,.32)');hg.addColorStop(1,'rgba(220,226,255,0)');g.fillStyle=hg;g.fillRect(mx-220,my-220,440,440)}
  g.fillStyle='#e8e6da';g.beginPath();g.arc(mx,my,26,0,7);g.fill();g.fillStyle='rgba(150,150,140,.35)';for(const[dx,dy,r]of[[-8,-6,6],[7,4,4],[-2,10,3.5],[9,-9,3]]){g.beginPath();g.arc(mx+dx,my+dy,r,0,7);g.fill()}
  for(let k=0;k<wpx/320;k++){const x=R()*wpx,y=150+R()*120,w=120+R()*180;g.fillStyle='rgba(60,66,96,.35)';g.beginPath();g.ellipse(x,y,w,10,0,0,7);g.ellipse(x-w*.3,y-7,w*.4,10,0,0,7);g.fill()}
  hills(g,wpx,400,26,'#1a1e30',R,.004);
  // le bourg endormi, quelques fenêtres, la collégiale
  for(let x=-20;x<wpx;){const w=40+R()*50,h=24+R()*24;g.fillStyle='#161a2a';g.fillRect(x,420-h,w,h);poly(g,[x-3,420-h,x+w/2,420-h-w*.4,x+w+3,420-h]);g.fill();
    if(R()<.3){g.fillStyle='rgba(255,200,120,.55)';g.fillRect(x+6+R()*(w-16),420-h+6+R()*8,5,6)}x+=w+2+R()*18}
  {const x=wpx*.7,b=420,c='#141828';g.fillStyle=c;g.fillRect(x,b-84,210,84);poly(g,[x-6,b-84,x+105,b-128,x+216,b-84]);g.fill();g.fillRect(x+166,b-168,38,168);poly(g,[x+162,b-168,x+185,b-226,x+208,b-168]);g.fill();
    g.fillStyle='rgba(255,210,140,.3)';for(let k=0;k<5;k++)g.fillRect(x+18+k*30,b-64,6,20)}
  for(let x=0;x<wpx;x+=26+R()*30){g.fillStyle='#0f1220';g.beginPath();g.arc(x,436-R()*10,16+R()*14,0,7);g.fill()}
  const hz=g.createLinearGradient(0,300,0,600);hz.addColorStop(0,'rgba(70,80,110,0)');hz.addColorStop(1,'rgba(70,80,110,.45)');g.fillStyle=hz;g.fillRect(0,300,wpx,300);
}
function cmMidLayer(L,g,wpx,R){const base=525;
  // les rangées du fond : cyprès, croix, stèles, toits de chapelles qui dépassent du mur
  for(let x=-20;x<wpx;){const k=R();
    if(k<.16){const h=150+R()*90,w=26+R()*14;g.fillStyle='#141c1c';g.beginPath();g.moveTo(x,base-30);g.quadraticCurveTo(x-w*.6,base-h*.5,x,base-h);g.quadraticCurveTo(x+w*.6,base-h*.5,x,base-30);g.fill();g.fillStyle='rgba(120,140,150,.08)';g.beginPath();g.moveTo(x-2,base-h+10);g.quadraticCurveTo(x-w*.45,base-h*.5,x-3,base-40);g.lineTo(x-1,base-40);g.fill();x+=40+R()*60}
    else if(k<.3){const w=56+R()*30,h=86+R()*40;g.fillStyle='#232838';g.fillRect(x,base-h,w,h);poly(g,[x-5,base-h,x+w/2,base-h-w*.32,x+w+5,base-h]);g.fill();g.fillStyle='#2e3446';g.fillRect(x+w/2-2,base-h-w*.32-16,4,16);g.fillRect(x+w/2-7,base-h-w*.32-11,14,3);
      g.fillStyle='#10131c';rr(g,x+w/2-9,base-h+22,18,h-22,8);g.fill();x+=w+20+R()*40}
    else if(k<.62){const h=30+R()*36,w=16+R()*14;g.fillStyle=pick2(R,['#2a3040','#262b38','#30364a']);g.beginPath();g.moveTo(x,base-34);g.lineTo(x,base-h);g.quadraticCurveTo(x+w/2,base-h-w*.5,x+w,base-h);g.lineTo(x+w,base-34);g.fill();x+=w+8+R()*22}
    else if(k<.85){const h=40+R()*34;g.fillStyle='#262c3c';g.fillRect(x+5,base-h,4,h-30);g.fillRect(x-2,base-h+9,18,4);x+=22+R()*26}
    else{g.strokeStyle='#1e2230';g.lineWidth=2;const h=46+R()*20;g.beginPath();g.moveTo(x+8,base-30);g.lineTo(x+8,base-h);g.moveTo(x,base-h+10);g.lineTo(x+16,base-h+10);g.stroke();g.beginPath();g.arc(x+8,base-h+10,5,0,7);g.stroke();x+=26+R()*24}}
  // le mur du cimetière, et son chaperon
  g.fillStyle='#2a2e3a';g.fillRect(0,base-34,wpx,34);g.fillStyle='#3a3f4e';g.fillRect(0,base-40,wpx,7);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(0,base-33,wpx,3);
  for(let x=0;x<wpx;x+=30+R()*20){g.fillStyle='rgba(0,0,0,.14)';g.fillRect(x,base-30+R()*14,24+R()*16,1.4)}
  for(let x=0;x<wpx;x+=90+R()*200){g.fillStyle='#1c2a22';g.beginPath();g.ellipse(x,base-34,20+R()*26,9,0,Math.PI,0);g.fill()}
}

/* ---------- au monde ---------- */
function drawCmBack(t,cx){const C=L.cm;if(!C)return;const g=ctx,vis=(a,b)=>b>cx-260&&a<cx+W+260;
  if(vis(0,9*T))fSpr(g,'cm-gate',360,320,20,300,2*T,CMF,g2=>cmGate(g2));
  for(let i=0;i<CMX.trees.length;i++){const tr=CMX.trees[i],x=tr.x*T;if(vis(x-320,x+320))fSpr(g,'cm-tree'+i,640,560,320,520,x,CMF,g2=>plTree(g2,tr,i+3,true))}
  // la stèle du fond où se tient le pigeon fantôme
  if(vis(125*T,133*T))fSpr(g,'cm-bgst',140,260,70,250,129*T,CMF-20,g2=>cmBackStele(g2));
  if(vis(CMX.mem.c0*T-80,(CMX.mem.c1+1)*T+80))fSpr(g,'cm-mem',440,420,220,400,CMX.mem.x,CMF,g2=>cmMemorial(g2));
  for(const q of C.chapels){const x=q.c0*T;if(vis(x-40,x+4*T))fSpr(g,'cm-chb'+q.i,140,240,10,220,x,CMF,g2=>cmChapelBack(g2,q))}
}
function drawCmMid(t){const C=L.cm;if(!C)return;const g=ctx,vis=(a,b)=>b>cam.x-220&&a<cam.x+W+220;
  for(const q of C.graves){if(q.k==='chapelle')continue;const x=q.c0*T,w=(q.c1-q.c0+1)*T;if(!vis(x-60,x+w+60))continue;fSpr(g,'cm-g'+q.i,w+80,280,40,260,x,CMF,g2=>cmGrave(g2,q,w))}
  if(vis(CMX.mem.c0*T,(CMX.mem.c1+1)*T))cmSteps(g);
  for(const o of C.owls)if(vis(o.x-40,o.x+40))plOwl(g,o,t);
}
function drawCmFront(t){const C=L.cm;if(!C)return;const g=ctx,vis=(a,b)=>b>cam.x-220&&a<cam.x+W+220;
  for(const q of C.chapels){const x=q.c0*T;if(vis(x-40,x+4*T))fSpr(g,'cm-chf'+q.i,180,300,30,280,x,CMF,g2=>cmChapelFront(g2,q))}
}

/* ---------- les dessins ---------- */
function cmStone(g,x,y,w,h,base,R,moss){// une pierre grenue, un peu de mousse en bas
  const gr=g.createLinearGradient(x,y,x+w,y+h);gr.addColorStop(0,cmSh(base,.12));gr.addColorStop(1,cmSh(base,-.18));g.fillStyle=gr;g.fillRect(x,y,w,h);
  for(let k=0;k<w*h/60;k++){g.fillStyle=R()<.5?'rgba(0,0,0,.12)':'rgba(255,255,255,.07)';g.fillRect(x+R()*w,y+R()*h,1.3,1.3)}
  if(moss)for(let k=0;k<w/5;k++){g.fillStyle=R()<.5?'rgba(80,110,60,.5)':'rgba(120,140,70,.35)';g.beginPath();g.arc(x+R()*w,y+h-R()*h*.35,1.5+R()*3,0,7);g.fill()}}
function cmGrave(g,q,w){const R=mulberry(q.c0*37+7),h=(CMG-q.r0)*T;g.save();
  if(q.k==='dalle'){// dalle basse : pierre usée en perspective, une croix gravée
    const old=R()<.6,base=old?pick2(R,['#7a786c','#6e6c62','#828074']):pick2(R,['#4a4a4e','#5a5650','#3e3c40']);
    g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(w/2+4,0,w/2+10,5,0,0,7);g.fill();
    cmStone(g,-2,-24,w+4,24,cmSh(base,-.1),R,old);
    g.fillStyle=cmSh(base,.08);poly(g,[4,-40,w-4,-40,w+2,-24,-2,-24]);g.fill();g.fillStyle='rgba(255,255,255,.12)';g.fillRect(4,-40,w-8,1.4);
    g.strokeStyle=old?'rgba(40,40,30,.45)':'rgba(220,200,140,.55)';g.lineWidth=1.6;g.beginPath();g.moveTo(w/2,-38);g.lineTo(w/2,-27);g.moveTo(w/2-7,-34);g.lineTo(w/2+7,-34);g.stroke();
    if(old)for(let k=0;k<8;k++){g.fillStyle='rgba(90,120,60,.5)';g.beginPath();g.arc(R()*w,-40+R()*4,2+R()*3,0,7);g.fill()}
    if(R()<.4){g.fillStyle='#6a6a62';rr(g,w-20,-50,12,10,2);g.fill();g.fillStyle='#8a2a2a';g.beginPath();g.arc(w-14,-52,4,0,7);g.fill()}}
  else if(q.k==='croixfer'){// tombe de gravier, bordure de pierre, croix de fer forgé à volutes
    g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(w/2+4,0,w/2+10,5,0,0,7);g.fill();
    const cx=w/2;g.strokeStyle='#2a2a2c';g.lineWidth=3;g.beginPath();g.moveTo(cx,-38);g.lineTo(cx,-150);g.moveTo(cx-24,-124);g.lineTo(cx+24,-124);g.stroke();
    g.lineWidth=1.6;for(const s of[-1,1]){g.beginPath();g.arc(cx+s*12,-124,6,0,7);g.stroke();g.beginPath();g.moveTo(cx+s*24,-124);g.quadraticCurveTo(cx+s*30,-130,cx+s*27,-136);g.stroke();
      g.beginPath();g.moveTo(cx,-70);g.quadraticCurveTo(cx+s*16,-80,cx+s*10,-96);g.stroke()}
    g.beginPath();g.arc(cx,-124,7,0,7);g.stroke();for(const[dx,dy]of[[0,-154],[-28,-124],[28,-124]]){g.fillStyle='#2a2a2c';poly(g,[cx+dx,dy-5,cx+dx+4,dy,cx+dx,dy+5,cx+dx-4,dy]);g.fill()}
    g.fillStyle='#d8d4c4';rr(g,cx-9,-108,18,12,2);g.fill();g.fillStyle='#6a6450';g.fillRect(cx-6,-104,12,1);g.fillRect(cx-5,-101,10,1);
    g.fillStyle='rgba(120,90,60,.4)';g.fillRect(cx+1,-150,1.4,110);
    cmStone(g,-2,-40,w+4,40,'#6e6a5e',R,true);
    g.fillStyle='#8a8476';g.fillRect(4,-36,w-8,30);for(let k=0;k<90;k++){g.fillStyle=pick2(R,['#a8a294','#787266','#c0baa8','#5e5a50']);g.fillRect(6+R()*(w-12),-35+R()*28,2,1.6)}
    g.fillStyle='rgba(255,255,255,.1)';g.fillRect(-2,-40,w+4,1.4)}
  else if(q.k==='stele'){// vieille stèle cintrée, lichen, inscription effacée, légèrement penchée
    const tilt=(R()-.5)*.05,base=pick2(R,['#8a8678','#7c786a','#948e7e']);g.translate(w/2,0);g.rotate(tilt);
    g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(4,0,w/2+10,5,0,0,7);g.fill();
    g.save();g.beginPath();g.moveTo(-w/2,0);g.lineTo(-w/2,-h+w*.3);g.quadraticCurveTo(0,-h-w*.15,w/2,-h+w*.3);g.lineTo(w/2,0);g.closePath();g.clip();cmStone(g,-w/2,-h-w*.2,w,h+w*.2,base,R,true);
    g.fillStyle='rgba(0,0,0,.18)';g.fillRect(w/2-5,-h,5,h);for(let k=0;k<6;k++){g.fillStyle=R()<.5?'rgba(200,190,120,.35)':'rgba(140,160,90,.35)';g.beginPath();g.arc(-w/2+R()*w,-h+R()*h*.6,3+R()*6,0,7);g.fill()}g.restore();
    g.fillStyle='rgba(40,38,30,.4)';g.fillRect(-4,-h+12,8,2);g.fillRect(-1,-h+8,2,9);for(let k=0;k<4;k++){const lw=w*.5-R()*w*.25;g.fillRect(-lw/2,-h+28+k*10,lw,1.6)}}
  else if(q.k==='croix'){// vieille croix de pierre sur son socle
    const cx=w/2,base='#86827a';g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(cx+4,0,w/2+10,5,0,0,7);g.fill();
    cmStone(g,cx-26,-h,52,h,base,R,true);g.fillStyle=cmSh(base,.15);g.fillRect(cx-29,-h,58,6);g.fillStyle='rgba(0,0,0,.2)';g.fillRect(cx-26,-h+6,52,2);
    cmStone(g,cx-6,-h-74,12,74,base,R,false);cmStone(g,cx-20,-h-58,40,11,base,R,false);
    g.fillStyle='rgba(140,160,90,.45)';for(let k=0;k<5;k++){g.beginPath();g.arc(cx-6+R()*12,-h-R()*70,2+R()*3,0,7);g.fill()}
    g.fillStyle='rgba(40,38,30,.4)';g.fillRect(cx-12,-h+18,24,2);g.fillRect(cx-9,-h+26,18,2)}
  else if(q.k==='colonne'){// colonne brisée sur son socle, du lierre qui monte
    const cx=w/2,base='#9a968a';g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(cx+4,0,36,5,0,0,7);g.fill();
    cmStone(g,cx-28,-56,56,56,cmSh(base,-.1),R,true);g.fillStyle=cmSh(base,.12);g.fillRect(cx-31,-60,62,6);g.fillRect(cx-31,-8,62,8);
    g.fillStyle='rgba(40,38,30,.45)';g.fillRect(cx-14,-38,28,2);g.fillRect(cx-10,-30,20,2);
    cmStone(g,cx-17,-h,34,h-60,base,R,false);for(let k=0;k<5;k++){g.fillStyle='rgba(0,0,0,.1)';g.fillRect(cx-14+k*7,-h,1.4,h-60)}
    g.fillStyle=cmSh(base,.1);poly(g,[cx-18,-h,cx-8,-h-6,cx-2,-h-1,cx+6,-h-7,cx+18,-h-2,cx+18,-h+3,cx-18,-h+3]);g.fill();
    g.strokeStyle='#2a4428';g.lineWidth=2;g.beginPath();g.moveTo(cx+10,-60);for(let y=-60;y>-h+30;y-=14)g.lineTo(cx+10+Math.sin(y*.15)*10,y);g.stroke();
    for(let y=-66;y>-h+34;y-=10){g.fillStyle=R()<.5?'#2e5030':'#3a5e36';g.beginPath();g.ellipse(cx+10+Math.sin(y*.15)*10+(R()-.5)*8,y,5,3.4,R()*3,0,7);g.fill()}}
  else if(q.k==='granit'){// tombe de famille récente : granit poli, lettres dorées, médaillons, fleurs
    const sw=w-2*T,sx=T,dark=pick2(R,['#2a2a30','#3a3438','#4a3a3c']),hl=cmSh(dark,.4);
    g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(w/2+4,0,w/2+12,6,0,0,7);g.fill();
    // la stèle
    const gr=g.createLinearGradient(sx,-h,sx+sw,0);gr.addColorStop(0,hl);gr.addColorStop(.5,dark);gr.addColorStop(1,cmSh(dark,-.2));g.fillStyle=gr;
    g.beginPath();g.moveTo(sx,-40);g.lineTo(sx,-h+6);g.quadraticCurveTo(sx+sw/2,-h-6,sx+sw,-h+6);g.lineTo(sx+sw,-40);g.closePath();g.fill();
    for(let k=0;k<160;k++){g.fillStyle=R()<.5?'rgba(255,255,255,.1)':'rgba(0,0,0,.2)';g.fillRect(sx+R()*sw,-h+R()*(h-40),1.1,1.1)}
    g.fillStyle='rgba(255,255,255,.14)';g.fillRect(sx+3,-h+10,2,h-52);
    g.textAlign='center';g.font='7.5px '+F_DISP;g.fillStyle='#d8b860';g.fillText('FAMILLE '+(q.nom||''),sx+sw/2,-h+22);g.fillRect(sx+sw/2-16,-h+25,32,.8);
    for(const[dx]of[[-16],[16]]){g.fillStyle='#c8b070';g.beginPath();g.ellipse(sx+sw/2+dx,-h+44,9,11,0,0,7);g.fill();g.fillStyle='#d8d0b8';g.beginPath();g.ellipse(sx+sw/2+dx,-h+44,7,9,0,0,7);g.fill();
      g.fillStyle='rgba(80,70,60,.6)';g.beginPath();g.arc(sx+sw/2+dx,-h+41,3,0,7);g.fill();g.fillRect(sx+sw/2+dx-4,-h+45,8,6)}
    g.font='5px '+F_DISP;g.fillStyle='#c8a850';g.fillText('À notre père, à notre mère',sx+sw/2,-h+66);
    // la dalle
    const tg=g.createLinearGradient(0,-40,0,0);tg.addColorStop(0,hl);tg.addColorStop(1,dark);g.fillStyle=tg;poly(g,[6,-40,w-6,-40,w+2,-22,-2,-22]);g.fill();
    g.fillStyle=cmSh(dark,-.1);g.fillRect(-2,-22,w+4,22);g.fillStyle='rgba(255,255,255,.18)';g.fillRect(6,-40,w-12,1.2);
    // plaques, fleurs
    g.fillStyle='#b8b0a0';poly(g,[w/2-30,-36,w/2-8,-36,w/2-6,-28,w/2-32,-28]);g.fill();g.fillStyle='#d8c890';rr(g,w/2+4,-38,22,8,2);g.fill();
    if(q.fleurs){for(const px of[12,w-14]){g.fillStyle='#8a4a2a';poly(g,[px-9,-40,px+9,-40,px+6,-24,px-6,-24]);g.fill();
        for(let k=0;k<7;k++){const a=-Math.PI*(.15+.7*k/6),r=10+R()*4;g.fillStyle=pick2(R,['#e8d8a0','#d86a8a','#efe6d0','#e0a040','#c8302a']);g.beginPath();g.arc(px+Math.cos(a)*r,-42+Math.sin(a)*r,4,0,7);g.fill()}
        g.fillStyle='#3a5a30';g.beginPath();g.arc(px,-44,6,0,7);g.fill()}
      g.fillStyle='#c8302a';rr(g,w/2-50,-50,10,12,2);g.fill();g.fillStyle='rgba(255,180,90,.9)';g.beginPath();g.ellipse(w/2-45,-47,2,3,0,0,7);g.fill()}}
  g.restore()}
function cmChapelBack(g,q){// l'intérieur de la chapelle : la pénombre, un petit autel, un vitrail
  const w=(q.c1-q.c0+1)*T,top=-(CMG-q.r0)*T;g.save();
  g.fillStyle='#14161e';g.fillRect(10,top+20,w-20,-top-20);
  g.fillStyle='#232634';g.fillRect(w/2-26,-38,52,38);g.fillStyle='#2e3242';g.fillRect(w/2-30,-42,60,5);
  g.fillStyle='#6a6050';g.fillRect(w/2-1.5,-62,3,20);g.fillRect(w/2-8,-55,16,3);
  const vg=g.createLinearGradient(0,top+40,0,top+110);vg.addColorStop(0,'rgba(120,140,220,.6)');vg.addColorStop(1,'rgba(200,90,120,.5)');g.fillStyle=vg;rr(g,w/2-12,top+40,24,70,12);g.fill();
  g.strokeStyle='#14161e';g.lineWidth=2;g.beginPath();g.moveTo(w/2,top+40);g.lineTo(w/2,top+110);g.moveTo(w/2-12,top+76);g.lineTo(w/2+12,top+76);g.stroke();
  g.fillStyle='rgba(255,200,120,.35)';g.beginPath();g.ellipse(w/2-18,-44,3,5,0,0,7);g.fill();
  g.restore()}
function cmChapelFront(g,q){// la façade : pilastres, entablement gravé, fronton, croix ; la grille de fer, un battant ouvert
  const w=(q.c1-q.c0+1)*T,R=mulberry(q.c0*13+1),base=pick2(R,['#8e8a7e','#9a9488','#86847c']),E=-(CMG-q.r0)*T,top=E+24;g.save();
  g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(w/2+4,0,w/2+18,6,0,0,7);g.fill();
  // pilastres
  for(const x of[-6,w-16]){cmStone(g,x,top,22,-top,base,R,true);g.fillStyle='rgba(0,0,0,.15)';g.fillRect(x+16,top,6,-top);g.fillStyle=cmSh(base,.15);g.fillRect(x-3,top,28,7);g.fillRect(x-3,-10,28,10)}
  // l'entablement (le toit plat où l'on peut se poser), le fronton
  cmStone(g,-12,E+2,w+24,22,cmSh(base,.06),R,false);g.fillStyle=cmSh(base,.2);g.fillRect(-14,E,w+28,4);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(-12,top,w+24,3);
  g.fillStyle='#2a2820';g.font='8px '+F_DISP;g.textAlign='center';g.fillText('FAMILLE '+(q.nom||''),w/2,E+17);
  g.fillStyle=cmSh(base,.1);poly(g,[w/2-30,E,w/2,E-20,w/2+30,E]);g.fill();g.fillStyle='rgba(0,0,0,.18)';poly(g,[w/2-20,E-2,w/2,E-14,w/2+20,E-2]);g.fill();
  cmStone(g,w/2-3,E-52,6,34,base,R,false);cmStone(g,w/2-11,E-42,22,6,base,R,false);
  // la grille : le battant gauche fermé, le droit ouvert vers l'intérieur
  g.strokeStyle='#1e1e22';g.lineWidth=2;const gx0=16,gx1=w-16,gm=(gx0+gx1)/2,gt=top+30;
  g.beginPath();for(let x=gx0+4;x<gm;x+=8){g.moveTo(x,-6);g.lineTo(x,gt)}g.moveTo(gx0,gt);g.lineTo(gm,gt);g.moveTo(gx0,-40);g.lineTo(gm,-40);g.moveTo(gx0,gt+40);g.lineTo(gm,gt+40);g.stroke();
  g.fillStyle='#1e1e22';for(let x=gx0+4;x<gm;x+=8)poly(g,[x-2.5,gt,x,gt-7,x+2.5,gt]),g.fill();
  g.beginPath();for(let k=0;k<4;k++){const x=gm+6+k*5;g.moveTo(x,-6);g.lineTo(x,gt-3)}g.moveTo(gm+6,gt);g.lineTo(gm+22,gt+4);g.moveTo(gm+6,-40);g.lineTo(gm+22,-38);g.stroke();
  // la marche
  cmStone(g,-4,-6,w+8,6,cmSh(base,-.05),R,true);
  g.restore()}
function cmSteps(g){const x0=CMX.mem.c0*T,x1=(CMX.mem.c1+1)*T,x2=(CMX.mem.c0+1)*T,x3=CMX.mem.c1*T,R=mulberry(91);g.save();
  cmStone(g,x0,CMF-40,x1-x0,40,'#8a867a',R,true);g.fillStyle='rgba(255,255,255,.12)';g.fillRect(x0,CMF-40,x1-x0,2);
  cmStone(g,x2,CMF-80,x3-x2,40,'#948f82',R,false);g.fillStyle='rgba(255,255,255,.14)';g.fillRect(x2,CMF-80,x3-x2,2);
  g.fillStyle='rgba(0,0,0,.2)';g.fillRect(x2,CMF-42,x3-x2,2);
  // une gerbe, au pied du monument
  const gx=CMX.mem.x+70;g.fillStyle='#2e4a2a';g.beginPath();g.ellipse(gx,CMF-86,18,9,0,0,7);g.fill();for(let k=0;k<6;k++){g.fillStyle=k%2?'#c8302a':'#e8e0d0';g.beginPath();g.arc(gx-12+k*5,CMF-90-Math.sin(k)*3,3.2,0,7);g.fill()}
  g.fillStyle='#2a4a8a';g.fillRect(gx-4,CMF-92,3,14);g.fillStyle='#f2ece0';g.fillRect(gx-1,CMF-92,3,14);g.fillStyle='#c8302a';g.fillRect(gx+2,CMF-92,3,14);
  g.restore()}
function cmMemorial(g){// le monument aux morts, d'après celui de Crécy : une haute stèle, l'inscription, les plaques de noms
  const R=mulberry(41),base='#a8a496';g.save();
  // ailes basses
  cmStone(g,-200,-160,400,80,cmSh(base,-.08),R,true);g.fillStyle=cmSh(base,.15);g.fillRect(-206,-166,412,8);
  // corps central
  cmStone(g,-120,-320,240,240,base,R,false);g.fillStyle='rgba(0,0,0,.14)';g.fillRect(104,-320,16,240);g.fillStyle='rgba(255,255,255,.08)';g.fillRect(-120,-320,5,240);
  g.fillStyle=cmSh(base,.18);g.fillRect(-128,-328,256,10);g.fillRect(-128,-90,256,10);
  // fronton et croix de guerre
  g.fillStyle=cmSh(base,.1);poly(g,[-124,-328,0,-372,124,-328]);g.fill();g.fillStyle='rgba(0,0,0,.15)';poly(g,[-100,-332,0,-364,100,-332]);g.fill();
  g.fillStyle='#8a7038';for(const[dx,dy]of[[0,-6],[0,6],[-6,0],[6,0]])poly(g,[dx*1,-350+dy*1,dx*2.6,-350+dy*2.6+(dx?3:0),dx*2.6+(dy?3:0),-350+dy*2.6]),g.fill();
  g.fillStyle='#b89848';g.beginPath();g.arc(0,-350,4,0,7);g.fill();
  g.strokeStyle='#5a6a3a';g.lineWidth=2;for(const s of[-1,1]){g.beginPath();g.arc(0,-350,14,s>0?-.4:Math.PI+.4,s>0?1.5:Math.PI-1.5,s<0);g.stroke()}
  // l'inscription
  const eng=(tx,y,f)=>{g.font=f;g.textAlign='center';g.fillStyle='rgba(255,255,255,.18)';g.fillText(tx,0,y+1);g.fillStyle='#3a3628';g.fillText(tx,0,y)};
  eng('HOMMAGE DES ENFANTS DE CRÉCY',-302,'11px '+F_DISP);eng('A LEURS AINÉS',-288,'9px '+F_DISP);eng('MORTS POUR LA PATRIE',-275,'9px '+F_DISP);
  eng('1914 – 1918',-102,'14px '+F_DISP);
  // les plaques de noms
  const half=Math.ceil(CM_NAMES.length/2);
  for(const s of[-1,1]){const px=s<0?-104:6,pw=98;g.fillStyle='#4a4840';rr(g,px,-262,pw,140,3);g.fill();g.fillStyle='#5a584e';rr(g,px+3,-259,pw-6,134,2);g.fill();
    g.font='6.4px '+F_DISP;g.textAlign='left';const list=s<0?CM_NAMES.slice(0,half):CM_NAMES.slice(half);
    list.forEach(([n,p],k)=>{const y=-246+k*8.2;g.fillStyle='rgba(0,0,0,.4)';g.fillText(n+' '+p,px+8,y+.8);g.fillStyle='#d8c890';g.fillText(n+' '+p,px+8,y)})}
  g.restore()}
// la date de fin, de l'autre côté du trait
function cmGate(g){// l'entrée : deux piliers, le portail ouvert, l'arc de fer forgé
  const R=mulberry(5),base='#8a867a';g.save();
  for(const x of[40,180]){cmStone(g,x-16,-210,32,210,base,R,true);g.fillStyle=cmSh(base,.15);g.fillRect(x-20,-214,40,8);g.fillStyle=cmSh(base,.08);g.beginPath();g.arc(x,-226,12,0,7);g.fill()}
  g.strokeStyle='#1e1e22';g.lineWidth=2.4;g.beginPath();g.moveTo(56,-196);g.quadraticCurveTo(110,-252,164,-196);g.stroke();g.beginPath();g.moveTo(56,-186);g.quadraticCurveTo(110,-236,164,-186);g.stroke();
  g.fillStyle='#1e1e22';g.font='9px '+F_DISP;g.textAlign='center';g.fillText('CIMETIÈRE',110,-206);
  // les battants ouverts, rabattus contre les piliers
  g.lineWidth=2;for(const[x,s]of[[56,1],[164,-1]]){g.beginPath();for(let k=0;k<5;k++){const xx=x+s*(4+k*4);g.moveTo(xx,-4);g.lineTo(xx,-150+k*3)}g.moveTo(x+s*4,-150);g.lineTo(x+s*20,-138);g.moveTo(x+s*4,-60);g.lineTo(x+s*20,-58);g.stroke()}
  // la plaque
  g.fillStyle='#2f3a4a';rr(g,8,-150,64,30,2);g.fill();g.fillStyle='#e9dfc7';g.font='7px '+F_DISP;g.fillText('CIMETIÈRE',40,-138);g.fillText('COMMUNAL',40,-128);
  g.restore()}
function cmBackStele(g){// une grande stèle de famille, au fond, à demi dans la brume
  const R=mulberry(77);g.save();g.globalAlpha=.75;
  cmStone(g,-34,-200,68,200,'#5a5c66',R,true);g.fillStyle='#646672';poly(g,[-40,-200,0,-226,40,-200]);g.fill();
  g.fillStyle='#4a4c56';g.fillRect(-40,-204,80,6);g.fillStyle='rgba(30,30,40,.5)';for(let k=0;k<5;k++)g.fillRect(-20,-170+k*12,40,1.6);
  g.restore()}

/* ---------- par-dessus tout : les fantômes, leurs bulles, le brouillard ---------- */
function cmGhostDraw(g,gh,t,a,talk){const x=gh.x,yb=gh.y,f=gh.f;g.save();
  {const gr=g.createRadialGradient(x,yb-46,6,x,yb-46,96);gr.addColorStop(0,'rgba(170,200,255,'+.2*a+')');gr.addColorStop(1,'rgba(170,200,255,0)');g.fillStyle=gr;g.fillRect(x-96,yb-142,192,192)}
  // les jambes : du brouillard qui flotte jusqu'au sol
  const Lg=CMF-yb,N=12,dxs=u=>Math.sin(t*1.3+u*4+gh.ph)*(2+u*11),wd=u=>17-u*7+Math.sin(t*2.2+u*7+gh.ph)*2.5;
  {const lg=g.createLinearGradient(0,yb-6,0,CMF);lg.addColorStop(0,'rgba(215,228,252,'+a*.52+')');lg.addColorStop(.7,'rgba(215,228,252,'+a*.16+')');lg.addColorStop(1,'rgba(215,228,252,0)');g.fillStyle=lg;
    g.beginPath();for(let k=0;k<=N;k++){const u=k/N;g.lineTo(x+dxs(u)-wd(u),yb-4+u*Lg)}for(let k=N;k>=0;k--){const u=k/N;g.lineTo(x+dxs(u)+wd(u),yb-4+u*Lg)}g.closePath();g.fill()}
  for(let k=0;k<4;k++){const u=(t*.22+k/4+gh.ph)%1,py=yb+u*Lg,px=x+dxs(u)+Math.sin(t+k*2)*6,r=12+u*16,pg=g.createRadialGradient(px,py,1,px,py,r);pg.addColorStop(0,'rgba(225,235,255,'+a*.28*(1-u)+')');pg.addColorStop(1,'rgba(225,235,255,0)');g.fillStyle=pg;g.fillRect(px-r,py-r,2*r,2*r)}
  {g.save();g.translate(x,CMF-3);g.scale(1,.28);const pg=g.createRadialGradient(0,0,2,0,0,46);pg.addColorStop(0,'rgba(215,228,252,'+a*.3+')');pg.addColorStop(1,'rgba(215,228,252,0)');g.fillStyle=pg;g.fillRect(-46,-46,92,92);g.restore()}
  const body='rgba(226,236,255,'+a*.66+')',edge='rgba(255,255,255,'+a*.5+')';
  // le corps, qui s'effiloche en bas
  g.fillStyle=body;g.beginPath();g.moveTo(x-14,yb-52);g.quadraticCurveTo(x-20,yb-30,x-20,yb);for(let k=0;k<=6;k++){const xx=x-20+k*40/6;g.lineTo(xx,yb+(k%2?7:0)+Math.sin(t*3+k+gh.ph)*2)}g.lineTo(x+20,yb);g.quadraticCurveTo(x+20,yb-30,x+14,yb-52);g.quadraticCurveTo(x,yb-60,x-14,yb-52);g.fill();
  g.strokeStyle=edge;g.lineWidth=1;g.stroke();
  // les bras
  g.strokeStyle='rgba(200,215,245,'+a*.6+')';g.lineWidth=4;g.lineCap='round';g.beginPath();g.moveTo(x+f*12,yb-46);g.quadraticCurveTo(x+f*18,yb-28,x+f*12,yb-14);g.moveTo(x-f*12,yb-46);g.quadraticCurveTo(x-f*16,yb-30,x-f*8,yb-16);g.stroke();
  // la tête
  const hx=x+f*2,hy=yb-68;g.fillStyle=body;g.beginPath();g.arc(hx,hy,13,0,7);g.fill();g.strokeStyle=edge;g.lineWidth=1;g.stroke();
  const hair='rgba(250,252,255,'+a*.8+')';g.fillStyle=hair;g.strokeStyle=hair;
  switch(gh.kind){
    case'chignon':g.beginPath();g.arc(hx-f*9,hy-6,6,0,7);g.fill();g.beginPath();g.arc(hx,hy-3,13,Math.PI*1.05,Math.PI*1.95);g.fill();break;
    case'lunettes':g.beginPath();g.arc(hx-f*8,hy-9,5,0,7);g.fill();g.beginPath();g.arc(hx,hy-3,13,Math.PI*1.05,Math.PI*1.95);g.fill();g.strokeStyle='rgba(60,70,100,'+a*.7+')';g.lineWidth=1;for(const s of[-4,4]){g.beginPath();g.arc(hx+f*3+s,hy-1,3.4,0,7);g.stroke()}break;
    case'casquette':g.beginPath();g.ellipse(hx,hy-9,14,6,0,Math.PI,0);g.fill();g.fillRect(hx+f*4-(f<0?14:0),hy-10,14,3);break;
    case'beret':g.beginPath();g.ellipse(hx-f,hy-10,15,6,f*.2,0,7);g.fill();g.fillRect(hx-1,hy-18,2,4);break;
    case'fichu':g.beginPath();g.moveTo(hx-15,hy+6);g.quadraticCurveTo(hx-16,hy-16,hx,hy-16);g.quadraticCurveTo(hx+16,hy-16,hx+15,hy+6);g.lineTo(hx+11,hy+4);g.quadraticCurveTo(hx,hy-12,hx-11,hy+4);g.closePath();g.fill();break;
    case'boucles':for(let k=0;k<6;k++){g.beginPath();g.arc(hx-11+k*4.4,hy-10+Math.abs(k-2.5)*1.5,4.4,0,7);g.fill()}break;
    case'chauve':g.fillStyle='rgba(250,252,255,'+a*.5+')';g.beginPath();g.arc(hx-f*10,hy+1,3.4,0,7);g.fill();break}
  // le visage : deux yeux sombres, une bouche qui remue quand il parle
  const ec='rgba(40,52,90,'+a*.85+')';g.fillStyle=ec;for(const s of[-4,4]){g.beginPath();g.ellipse(hx+f*3+s,hy-1,1.6,2.4,0,0,7);g.fill()}
  if(gh.kind==='chauve'||gh.kind==='casquette'){g.fillStyle=hair;g.beginPath();g.ellipse(hx+f*3,hy+5,6,2,0,0,7);g.fill()}
  g.fillStyle=ec;const mo=talk?1.2+Math.abs(Math.sin(t*9))*1.6:.7;g.beginPath();g.ellipse(hx+f*3,hy+7,2.2,mo,0,0,7);g.fill();
  g.restore()}
function cmBubble(g,x,y,text,a){g.save();g.globalAlpha=a;g.font='italic 13px '+F_BODY;
  const words=text.split(' '),lines=[];let cur='';for(const w of words){const n=cur?cur+' '+w:w;if(g.measureText(n).width>240&&cur){lines.push(cur);cur=w}else cur=n}lines.push(cur);
  const bw=Math.max(...lines.map(l=>g.measureText(l).width))+20,bh=lines.length*16+10,bx=x-bw/2,by=y-bh-12;
  g.fillStyle='rgba(222,230,248,.82)';rr(g,bx,by,bw,bh,9);g.fill();poly(g,[x-6,by+bh-1,x+6,by+bh-1,x,by+bh+9]);g.fill();
  g.strokeStyle='rgba(150,170,210,.6)';g.lineWidth=1;rr(g,bx,by,bw,bh,9);g.stroke();
  g.fillStyle='#2a3248';g.textAlign='center';lines.forEach((l,k)=>g.fillText(l,x,by+19+k*16));g.restore()}
function cmPigeonGhost(g,x,y,t){// un pigeon fantôme, de face, immobile : il nous regarde
  g.save();g.translate(x,y+Math.sin(t*1.1)*1.5);const a=.22;
  const gr=g.createRadialGradient(0,-14,2,0,-14,40);gr.addColorStop(0,'rgba(170,200,255,.07)');gr.addColorStop(1,'rgba(170,200,255,0)');g.fillStyle=gr;g.fillRect(-40,-54,80,80);
  g.fillStyle='rgba(220,232,255,'+a+')';g.beginPath();g.ellipse(0,-10,11,13,0,0,7);g.fill();g.beginPath();g.arc(0,-27,7,0,7);g.fill();
  for(let k=0;k<3;k++){g.fillStyle='rgba(205,220,248,'+a*.6*(1-k/3)+')';g.beginPath();g.ellipse(Math.sin(t+k)*2,2+k*5,9-k*2,3,0,0,7);g.fill()}
  const bl=Math.sin(t*.6)>.93;g.fillStyle='rgba(40,52,90,.55)';for(const s of[-3,3]){if(bl)g.fillRect(s-1.4,-28,2.8,.8);else{g.beginPath();g.arc(s,-28,1.4,0,7);g.fill()}}
  g.fillStyle='rgba(200,190,170,.4)';poly(g,[-1.5,-25,1.5,-25,0,-21]);g.fill();g.restore()}
function cmCouple(g,t,a){// Marguerite et Joseph, après la tombe : ils se tiennent la main et se regardent
  const x0=186*T,x1=187.3*T,yb=CMF-38+Math.sin(t*1.2)*3;
  const m={x:x0,y:yb,f:1,kind:'chignon',ph:0},j={x:x1,y:yb,f:-1,kind:'casquette',ph:1.3};
  cmGhostDraw(g,m,t,a,false);cmGhostDraw(g,j,t,a,false);
  g.save();g.strokeStyle='rgba(215,228,255,'+a*.7+')';g.lineWidth=4;g.lineCap='round';g.beginPath();g.moveTo(x0+12,yb-44);g.quadraticCurveTo((x0+x1)/2,yb-18,x1-12,yb-44);g.stroke();
  g.fillStyle='rgba(235,242,255,'+a*.8+')';g.beginPath();g.arc((x0+x1)/2,yb-28,4.5,0,7);g.fill();g.restore()}
function cmOverlay(t){const C=L.cm;if(!C)return;const cx=Math.round(cam.x),cy=Math.round(cam.y);
  const zm=L.zoom&&L.zoom.z>1.001?L.zoom:null;
  ctx.save();if(zm){ctx.translate(W/2,H/2);ctx.scale(zm.z,zm.z);ctx.translate(-W/2,-H/2);ctx.translate(-Math.round(zm.fx-W/2),-Math.round(zm.fy-H/2))}else ctx.translate(-cx,-cy);
  const x0v=zm?zm.fx-W/2/zm.z-120:cx-120,x1v=zm?zm.fx+W/2/zm.z+120:cx+W+120;
  // le nom de Lucien, sous les doigts de la lumière
  {const q=C.seq;if(q&&q.k==='mem'&&q.t>4.6){const[nx,ny]=cmNameXY(),k=Math.min(1,(q.t-4.6)/1.2)*(q.t>12.8?Math.max(0,1-(q.t-12.8)/1.2):1);ctx.save();ctx.globalCompositeOperation='lighter';
    const gr=ctx.createRadialGradient(nx-8,ny-3,2,nx-8,ny-3,46);gr.addColorStop(0,'rgba(255,220,140,'+.35*k+')');gr.addColorStop(1,'rgba(255,220,140,0)');ctx.fillStyle=gr;ctx.fillRect(nx-60,ny-50,104,100);ctx.restore();
    ctx.font='6.4px '+F_DISP;ctx.textAlign='left';ctx.fillStyle='rgba(255,236,170,'+k+')';ctx.fillText('VASSEUR Lucien',CMX.mem.x+14,ny)}}
  // le pigeon fantôme, en haut de la stèle du fond
  if(129*T>x0v&&129*T<x1v)cmPigeonGhost(ctx,129*T,CMF-20-226,t);
  // les fantômes
  for(const gh of C.ghosts){if(gh.x<x0v||gh.x>x1v)continue;const ph=(C.t+gh.ph*2.9)%7.1,talk=ph<3.1;  // 3,1 s de réplique, puis 4 s de silence
    cmGhostDraw(ctx,gh,t,.9,talk);
    if(talk&&!C.seq&&!G.tombSeq){const ba=Math.min(1,ph/.25,(3.1-ph)/.25);cmBubble(ctx,gh.x,gh.y-90,gh.line,ba)}}
  // Marguerite et Joseph
  {const pcx=P.x+P.w/2,a=G.tombSeq?.85:clamp((pcx-174*T)/(5*T),0,1)*.75;if(a>0)cmCouple(ctx,t,a)}
  ctx.restore();
  // le brouillard : un voile, des nappes qui traînent au ras du sol — peint en petit (un quart de la taille), puis agrandi :
  // c'est le même flou, pour seize fois moins de pixels à remplir
  {const F=4,fc=cmFogC||(cmFogC=mk(Math.ceil(W/F),Math.ceil(H/F))),g=fc.getContext('2d');g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,fc.width,fc.height);g.scale(1/F,1/F);
   g.fillStyle='rgba(120,132,165,.04)';g.fillRect(0,0,W,H);
   for(let k=0;k<7;k++){const x=((k*230-t*(8+k*3)-cx*.3)%(W+700)+W+700)%(W+700)-350,y=CMF-cy-20+(k%3)*18;const gr=g.createRadialGradient(x,y,10,x,y,300);gr.addColorStop(0,'rgba(170,182,210,.12)');gr.addColorStop(1,'rgba(170,182,210,0)');g.fillStyle=gr;g.save();g.translate(x,y);g.scale(1,.32);g.translate(-x,-y);g.fillRect(x-300,y-300,600,600);g.restore()}
   for(let k=0;k<4;k++){const x=((k*410-t*(5+k*2)-cx*.15)%(W+800)+W+800)%(W+800)-400,y=250+k*50-cy*.3;const gr=g.createRadialGradient(x,y,10,x,y,280);gr.addColorStop(0,'rgba(150,160,190,.1)');gr.addColorStop(1,'rgba(150,160,190,0)');g.fillStyle=gr;g.fillRect(x-280,y-280,560,560)}
   ctx.save();ctx.imageSmoothingEnabled=true;ctx.drawImage(fc,0,0,W,H);ctx.restore()}
}
let cmFogC=null;
