/* =========================================================
   5-2 · LES COMBLES — l'église de Crécy-la-Chapelle, sous le toit
   ---------------------------------------------------------
   Pas de plancher ni de fond : on avance de poutre en poutre, et dessous c'est le noir (et la nef).
   Planches vermoulues qui cèdent quand on s'y pose (mêmes poutres, fendues et trouées),
   toiles d'araignée qui engluent (toujours une planche tout en bas, dessous), rats, chauves-souris,
   pies, hiboux qui hululent puis fondent en piqué, écureuils, et les collègues : chieurs, mendiants,
   sauteurs, déplumés. La chambre des cloches : on monte en se servant des cloches.
   B : septembre 1914. Les poutres vermoulues d'aujourd'hui sont saines ; d'autres poutres, disparues
   depuis, existent (et sont vermoulues, elles) : elles mènent tout en haut à gauche. D'autres toiles.
   Le toit n'a pas encore de trou : on ne finit qu'en 2026.
   ========================================================= */
const CBW=212,CBR=24;
THEMES.combles=Object.assign({},BASE_IN,{far:'combles',wall:'#3a2e24',wall2:'#43352a',motif:'#4a3a2c',wains:'#2a2018',floor:'#4a3a2a',floorTop:'#7a6a52',type:'plank',fog:'#1a140e',dark:.3,
  x:'none',shelf:'beam',spike:'nails',walker:'rat',flyer:'bat',props:[],noFore:true});
const CB={};
(function(){
  const g=Array.from({length:CBR},()=>Array(CBW).fill('.'));
  const fill=(c0,c1,r0,r1,ch)=>{for(let c=c0;c<=c1;c++)for(let r=r0;r<=r1;r++)g[r][c]=ch};
  const put=(c,r,ch)=>{g[r][c]=ch};
  // les poutres : b = toujours là ; n = 2026 seulement ; r = saine en 2026, vermoulue en 1914 ; f = vermoulue en 2026, saine en 1914 ; o = 1914 seulement, vermoulue ; p = 1914 seulement, saine
  const B=[];const bm=(c0,c1,r,e)=>{B.push({c0,c1,r,e:e||'b'});if(!e||e==='b')for(let c=c0;c<=c1;c++)g[r][c]='='};
  // le toit, les pignons, le palier de l'escalier
  fill(0,CBW-1,0,0,'#');fill(0,1,0,CBR-1,'X');fill(CBW-3,CBW-1,0,CBR-1,'X');fill(2,4,20,CBR-1,'X');
  /* A · la nef, côté ouest */
  put(3,19,'S');
  bm(6,11,20);bm(13,19,18,'r');bm(23,25,15);bm(26,28,15,'f');bm(21,30,11);bm(23,27,7,'f');bm(30,34,16,'r');
  bm(19,24,22,'n');                                   // sous la toile W1
  bm(9,12,15,'o');bm(4,7,12,'o');bm(8,11,9,'o');bm(3,6,6,'o');bm(8,13,3,'p');   // 1914 : tout en haut à gauche
  put(8,19,'k');
  for(const[c,r]of[[15,17],[27,14],[26,10],[21,21],[10,14],[4,5],[10,2]])put(c,r,'o');
  /* B · la charpente : on monte */
  bm(36,39,17,'f');bm(41,44,14,'f');bm(46,48,11);bm(50,53,9,'p');bm(54,64,6);bm(59,62,3);   // la poutre 50-53 n'existe qu'en 1914 : passage obligé
  bm(43,48,22,'n');                                   // sous la toile W2
  bm(37,40,8,'o');bm(33,36,4,'p');                    // 1914 : un perchoir de plus
  put(52,8,'C');put(44,8,'m');
  for(const[c,r]of[[42,13],[56,5],[38,7],[34,3],[45,21]])put(c,r,'o');
  /* C · la descente */
  bm(66,69,10,'r');bm(71,75,14,'f');bm(77,82,18,'r');bm(84,92,20);
  bm(62,67,22,'r');bm(64,67,17,'o');                  // sous la toile W3 ; en 1914, une planche pour remonter                                   // sous la toile W3
  put(72,13,'k');put(70,11,'m');put(84,15,'n');put(91,19,'C');
  for(const[c,r]of[[67,9],[72,12],[80,17],[65,21],[66,16]])put(c,r,'o');
  /* D · la chambre des cloches (son plancher, troué) */
  fill(93,94,1,16,'X');fill(126,127,7,CBR-1,'X');fill(126,127,1,1,'X');
  bm(95,101,21);bm(104,107,21,'f');bm(111,118,21);bm(121,125,21);
  bm(96,99,17);put(102,11,'I');bm(105,107,10);put(110,5,'I');bm(113,116,7);put(119,1,'I');bm(122,125,4);bm(99,101,3);
  put(104,15,'m');put(116,12,'m');put(124,3,'C');
  for(const[c,r]of[[97,16],[106,9],[123,3],[122,20],[116,20]])put(c,r,'o');
  /* E · le comble du chœur */
  bm(128,134,5);bm(135,140,7,'f');bm(138,142,2,'r');bm(142,146,8);bm(150,155,7,'p');bm(151,155,2);bm(157,160,9,'r');bm(162,166,11,'n');bm(169,172,13,'f');   // 150-155 : 1914 seulement ; 162-166 : 2026 seulement
  bm(130,136,16,'r');bm(139,145,19);bm(156,161,18);bm(164,168,16);          // le chemin du bas, pour qui est tombé
  bm(146,151,22,'n');                                 // sous la toile W4
  put(158,8,'C');put(132,15,'k');put(164,10,'k');
  for(const[c,r]of[[131,4],[139,6],[152,6],[163,10],[133,15],[158,17],[148,21]])put(c,r,'o');
  /* F · vers le trou du toit */
  bm(175,178,10,'r');bm(180,182,8,'f');bm(184,188,6,'f');bm(189,193,2);bm(192,196,4);bm(199,203,3);
  bm(176,180,17);bm(184,191,15);bm(186,188,11,'r');
  bm(189,194,22,'r');bm(192,195,18,'o');              // sous la toile W5 ; en 1914, une planche pour remonter
  bm(197,201,19,'p');                                 // en 1914, tout en bas à droite : le canif
  put(178,15,'m');put(187,14,'k');
  for(const[c,r]of[[181,7],[193,3],[176,16],[187,10],[193,17],[200,18]])put(c,r,'o');
  // le trou dans le toit (2026)
  for(let c=200;c<=204;c++)g[0][c]='.';
  CB.segs=[g.map(r=>r.join('')).join('\n')];{const d=LEVELS.find(d=>d.combles);if(d)d.segs=CB.segs}
  CB.beams=B;
  CB.webs26=[[20,12.4,2.8,4],[44.6,5.6,2.4,3.2],[63.6,11.5,2.2,4],[147,3.5,2.8,5],[189.2,4.6,2.6,3.6]];
  /*v2*/ // en 2026, deux filets anti-pigeons tendus du plancher au toit : on ne passe qu'en 1914 (poutre 50-53, puis poutre 150-155)
  CB.nets26=[49,156];CB.netCells=[];for(const c of CB.nets26)for(let r=1;r<CBR;r++)if((g[r][c]==='.'||g[r][c]==='=')&&!B.some(b=>b.e!=='b'&&r===b.r&&c>=b.c0&&c<=b.c1))CB.netCells.push([c,r,g[r][c]]);
  CB.webs14=[[31,9,2.4,3.4],[79.4,12.2,2.4,3.6],[163.6,12.6,2.6,2.8],[177.6,12.4,2.2,3.6],[9.6,16.2,2.2,2.8]];
  CB.trusses=[];for(let c=6;c<CBW-4;c+=12)if(c<92||c>128)CB.trusses.push(c);
  CB.rays=[[11,46],[33,30],[57,60],[78,70],[87,34],[133,40],[148,52],[166,36],[185,44]];
})();

/* ---------- après lecture : les bêtes, l'époque ---------- */
function comblesPost(Lv){
  if(!Lv.def.combles)return;
  const C=Lv.cb={t:0,said:{},lum:1,end:null,drops:[],grace:0,era:26,flash:0,talk:null};
  for(const m of Lv.moths){const c=m.cx/T;if(Math.abs(c-70.5)<1||Math.abs(c-178.5)<1)m.kind='pie'}
  C.owls=[[60.5,3],[140.5,2],[191,2]].map(([c,r],i)=>({hx:c*T,hy:r*T,x:c*T,y:r*T,st:'perch',t:0,cool:1.2,f:-1,n:i}));
  C.squirrels=[{a:54.5*T,b:63.6*T,y:6*T,x:60*T,f:1,pause:0},{a:128.5*T,b:134.4*T,y:5*T,x:131*T,f:-1,pause:.8}];
  // les chieurs se tiennent au bout de leur poutre, la queue dans le vide
  C.chieurs=[{x:27.7*T,y:7*T,per:3.1,t:0},{x:101.7*T,y:3*T,per:2.7,t:1.2},{x:155.7*T,y:2*T,per:3.4,t:.6}].map(o=>Object.assign(o,{lift:0}));
  const pig=(k,a,b,y,o)=>Object.assign({k,a:a*T,b:b*T,y0:y*T,x:a*T,y:y*T,f:1,st:'walk',t:0,beg:0,home:(a+b)/2*T},o||{});
  C.pig=[pig('moignon',13.6,18.6,18),pig('deplume',77.3,82.6,18),pig('gros',84.5,89,20,{h:100}),pig('moignon',142.5,146,8),pig('gros',150.6,155,7,{h:80,t:2}),pig('deplume',184.3,191.6,15),pig('moignon',192.4,196,4)];
  C.webs=[];
  // chaque bête posée sur une poutre d'une seule époque n'existe qu'à cette époque ; chaque paille appartient à une époque
  const eraAt=(x,y)=>{const c=Math.floor(x/T),r=Math.round(y/T);for(const b of CB.beams)if(b.r===r&&c>=b.c0-1&&c<=b.c1+1)return b.e==='n'?26:(b.e==='o'||b.e==='p')?14:0;return 0};
  for(const o of Lv.rats)o.era=eraAt(o.x+o.w/2,o.y+o.h);for(const o of C.pig)o.era=eraAt(o.home,o.y0);for(const o of C.owls)o.era=eraAt(o.hx,o.hy);
  for(const o of C.squirrels)o.era=eraAt((o.a+o.b)/2,o.y);for(const o of C.chieurs)o.era=eraAt(o.x,o.y);
  C.all={rats:Lv.rats.slice(),pig:C.pig,owls:C.owls,squirrels:C.squirrels,chieurs:C.chieurs};
  {const free=[],n={14:0,26:0};for(const k of Lv.corn){const c=Math.floor(k.x/T),r=Math.floor(k.y/T);let e=null;
     for(const b of CB.beams)if(c>=b.c0-1&&c<=b.c1+1&&b.r>r&&b.r<=r+3&&(!e||b.r<e.r))e=b;
     k.era=e&&e.e==='n'?26:e&&(e.e==='o'||e.e==='p')?14:0;if(k.era)n[k.era]++;else free.push(k)}
   // les pailles des poutres communes : réparties pour que chaque époque en ait autant, en alternant le long du niveau
   free.sort((a,b)=>a.x-b.x);let need26=Math.max(0,Math.round(Lv.corn.length/2)-n[26]),i=0;
   for(const k of free){const left=free.length-i;k.era=(need26>=left||(need26>0&&i%2===0))?26:14;if(k.era===26)need26--;i++}}
  // les fanions : la moitié en 1914, la moitié en 2026
  for(const cp of Lv.cps){const c=Math.round(cp.x/T);cp.era=c<70?14:c<110?26:c<140?14:26}
  // les poutres qui changent avec l'époque
  // (les poutres vermoulues sont coupées en tronçons : chacun ne cède que si on s'y pose, l'un après l'autre)
  C.dyn=[];for(const b of CB.beams){if(b.e==='b')continue;const frag=b.e==='f'||b.e==='o'||b.e==='r',n=b.c1-b.c0+1,sz=!frag?n:n<=2?1:2;
    for(let c=b.c0;c<=b.c1;c+=sz)C.dyn.push(Object.assign({},b,{c0:c,c1:Math.min(b.c1,c+sz-1),st:'ok',t:0,deb:[],seg:frag&&n>1}))}
  Lv.acts=Lv.acts||[];
  C.bague={kind:'secret',style:'bague',x:124.4*T,y:21*T,open:0,t:0,used:false,q:["Un vieux nid. Et dedans, une bague de pigeon : « 1913 ». Un gars du colombier Vasseur. Il a fini ses jours ici, au calme. Il y a pire."]};
  C.graf={kind:'secret',style:'graffiti',x:122.6*T,y:4*T,open:0,t:0,used:false,q:["Gravé dans la poutre : « Lucien et Marguerite, 1913 ». Le petit Vasseur montait sonner les cloches. Je ne savais pas qu'il montait aussi pour ça."]};
  C.canif={kind:'secret',style:'canif',x:199.5*T,y:19*T,open:0,t:0,used:false,when:()=>L.cb.era===14,q:[/*v2*/"Un canif oublié sur une poutre, tout en bas. Un L gravé sur le manche. Lucien montait jusqu'ici, lui aussi. Il avait le vertige des sergents : aucun."]};
  Lv.acts.push(C.bague,C.graf,C.canif);
  // la médaille de la mission : en 1914, tout en haut à gauche
  Lv.medal={x:8.6*T,y:2.45*T,taken:false,era:14};
  C.motes=Array.from({length:70},(_,i)=>({r:i%CB.rays.length,u:(i*.137)%1,v:(i*.618)%1,s:.6+(i%5)*.3}));
  comblesApplyEra(Lv,26);
}
/* l'époque : quelles poutres, quelles toiles, le trou du toit */
function cbActive(b,era){return b.e==='r'||(era===26?(b.e==='n'||b.e==='f'):(b.e==='f'||b.e==='o'||b.e==='p'))}
function cbFragile(b,era){return era===26?b.e==='f':(b.e==='o'||b.e==='r')}
function comblesApplyEra(Lv,era){const C=Lv.cb;C.era=era;
  if(C.all){const f=a=>a.filter(o=>!o.era||o.era===era);Lv.rats=f(C.all.rats);C.pig=f(C.all.pig);C.owls=f(C.all.owls);C.squirrels=f(C.all.squirrels);C.chieurs=f(C.all.chieurs)}
  for(const b of C.dyn){b.st='ok';b.t=0;b.deb=[];for(let c=b.c0;c<=b.c1;c++)Lv.g[b.r][c]=cbActive(b,era)?'=':'.'}
  for(let c=200;c<=204;c++)Lv.g[0][c]=era===26?'.':'#';
  for(const[c,r,o]of CB.netCells||[])Lv.g[r][c]=era===26?'X':o;
  C.webs=(era===26?CB.webs26:CB.webs14).map(([x,y,w,h])=>({x:x*T,y:y*T,w:w*T,h:h*T,shake:0}))}
function comblesSwitch(){const C=L.cb;if(!C||P.dead||C.end)return;const era=C.era===26?14:26;
  // pas de retour en 2026 au beau milieu d'un filet
  if(era===26&&(CB.nets26||[]).some(c=>P.x+P.w>c*T-2&&P.x<(c+1)*T+2)){if(!G.sim)tone(150,.12,'square',.05);return}if(era===14)achB('combles');comblesApplyEra(L,era);MUS_OLD=era===14;C.flash=1;
  if(!G.sim){noise(.9,900,.18,'bandpass',0,.6);tone(era===14?392:523,.5,'sine',.05,era===14?262:784,.02)}
  if(era===14&&!C.said.v14){C.said.v14=1;say("Septembre 1914. La charpente sent le bois neuf… presque. Il y a des poutres que je ne connaissais pas.",4.2)}}
function comblesRespawn(){const C=L.cb;if(!C)return;{const e=(P.cp&&P.cp.era)||26;if(e!==C.era){comblesApplyEra(L,e);MUS_OLD=e===14}}C.drops=[];C.grace=1;C.talk=null;for(const o of C.owls){o.st='perch';o.x=o.hx;o.y=o.hy;o.cool=1.5}for(const p of C.pig)if(p.k==='deplume'){p.x=p.home;p.st='walk';p.chase=0;p.rt=0}
  for(const b of C.dyn)if(b.st!=='ok'){b.st='ok';b.deb=[];for(let c=b.c0;c<=b.c1;c++)L.g[b.r][c]=cbActive(b,C.era)?'=':'.'}}
/* la lumière : le soleil entre et sort des nuages */
function cbLum(t){return clamp(.62+.38*Math.sin(t*.21)+.18*Math.sin(t*.53+1.3),.15,1)}
function comblesStep(dt){const C=L.cb;if(!C)return;C.t+=dt;if(C.grace>0)C.grace-=dt;if(C.flash>0)C.flash-=dt*1.6;
  C.lum=cbLum(C.t);L.darkNow=(C.era===14?.5:.62)-.36*C.lum;
  const pcx=P.x+P.w/2,pcy=P.y+P.h/2,hb={x:P.x+3,y:P.y+4,w:P.w-6,h:P.h-6};let hit=null;
  // les planches vermoulues : on s'y pose, elles craquent, elles tombent ; elles reviennent plus tard
  for(const b of C.dyn){if(!cbActive(b,C.era)||!cbFragile(b,C.era))continue;
    if(b.st==='ok'){if(P.onGround&&!P.dead&&Math.abs(P.y+P.h-b.r*T)<3&&pcx>b.c0*T-4&&pcx<(b.c1+1)*T+4){b.st='shake';b.t=0;if(!G.sim)noise(.25,500,.06,'bandpass')}}
    else if(b.st==='shake'){b.t+=dt;if(b.t>.5){b.st='gone';b.t=0;for(let c=b.c0;c<=b.c1;c++)L.g[b.r][c]='.';b.deb=[];for(let c=b.c0;c<=b.c1;c++)for(let k=0;k<2;k++)b.deb.push({x:c*T+8+k*18,y:b.r*T,vx:(rnd()-.5)*60,vy:-40-rnd()*60,a:(rnd()-.5)*4,ra:0});if(!G.sim){noise(.4,300,.12,'lowpass');SFX.thud&&SFX.thud()}}}
    else if(b.st==='gone'){b.t+=dt;for(const d of b.deb){d.vy+=1400*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;d.ra+=d.a*dt}
      if(b.t>4.5&&!overlap({x:P.x,y:P.y,w:P.w,h:P.h},{x:b.c0*T,y:b.r*T-4,w:(b.c1-b.c0+1)*T,h:28})){b.st='ok';b.deb=[];for(let c=b.c0;c<=b.c1;c++)L.g[b.r][c]='='}}}
  // les toiles d'araignée : on s'y englue
  P.web=false;for(const w of C.webs){w.shake=Math.max(0,w.shake-dt*2);if(pcx>w.x&&pcx<w.x+w.w&&pcy>w.y&&pcy<w.y+w.h&&!P.dead){P.web=true;w.shake=1;
    P.vx=clamp(P.vx,-55,55);if(P.vy>45)P.vy=45;if(P.vy<-140)P.vy=-140;P.flaps=Math.max(P.flaps,1);
    if(!C.said.toile&&!G.sim){C.said.toile=1;say("Une toile d'araignée. Je colle. Un sergent qui colle, c'est mauvais pour le moral.",3.6)}}}
  // les hiboux : un hululement, les yeux qui s'ouvrent, une seconde, puis le piqué — un peu au-dessus ou un peu en dessous de Raymond
  for(const o of C.owls){o.t+=dt;o.cool-=dt;
    if(o.st==='perch'){o.x=o.hx;o.y=o.hy;const dx=pcx-o.hx,dy=pcy-o.hy;if(o.cool<=0&&!P.dead&&Math.abs(dx)<300&&dy>30&&dy<420){o.st='warn';o.t=0;o.f=dx>0?1:-1;o.n++;
        if(!G.sim){tone(330,.3,'sine',.05,300);setTimeout(()=>tone(290,.5,'sine',.05,262),360)}
        if(!G.sim)bubble(o.hx,o.hy-50,'Hou-hou…','#5a4a3a')}}
    else if(o.st==='warn'){if(o.t>1){o.st='dive';o.t=0;const off=(o.n%2?1:-1)*46;o.tx=pcx;o.ty=pcy+off;o.sx=o.hx;o.sy=o.hy;o.ex=pcx+o.f*260;o.ey=o.hy+40}}
    else if(o.st==='dive'){const u=Math.min(1,o.t/1.15),a=(1-u)*(1-u),b=2*(1-u)*u,c=u*u;
      const mx=2*o.tx-.5*(o.sx+o.ex),my=2*o.ty-.5*(o.sy+o.ey);o.x=a*o.sx+b*mx+c*o.ex;o.y=a*o.sy+b*my+c*o.ey;
      if(u>=1){o.st='back';o.t=0;o.bx=o.x;o.by=o.y}
      if(!P.dead&&C.grace<=0&&overlap(hb,{x:o.x-16,y:o.y-10,w:32,h:20}))hit='hibou'}
    else if(o.st==='back'){const u=Math.min(1,o.t/1.3),e=u*u*(3-2*u);o.x=lerp(o.bx,o.hx,e);o.y=lerp(o.by,o.hy,e)-Math.sin(u*Math.PI)*50;o.f=o.hx>o.bx?1:-1;if(u>=1){o.st='perch';o.cool=2.6}}}
  // les écureuils
  for(const s of C.squirrels){if(s.pause>0){s.pause-=dt;continue}s.x+=s.f*250*dt;if(s.x>s.b){s.x=s.b;s.f=-1;s.pause=.9}if(s.x<s.a){s.x=s.a;s.f=1;s.pause=.9}
    if(!P.dead&&C.grace<=0&&overlap(hb,{x:s.x-14,y:s.y-20,w:28,h:20}))hit='ecureuil'}
  // les chieurs : la queue au-dessus du vide, la fiente tombe jusqu'à la première poutre en dessous
  for(const o of C.chieurs){o.t+=dt;const u=o.t%o.per;o.lift=u>o.per-.7&&u<o.per-.2?1:0;if(u>=o.per-.3&&u-dt<o.per-.3)C.drops.push({x:o.x+13,y:o.y+2,vy:40,skip:Math.round(o.y/T)})}
  for(const d of C.drops){if(d.dead){d.life=(d.life||0)+dt;continue}d.vy=Math.min(700,d.vy+1500*dt);d.y+=d.vy*dt;const c=Math.floor(d.x/T),r=Math.floor(d.y/T);
    if(r>=CBR||(r!==d.skip&&d.y>r*T&&d.y<r*T+14&&'#X='.includes(tile(c,r)))){d.dead=1;d.y=Math.min(d.y,r*T);d.life=0}
    if(!d.dead&&!P.dead&&C.grace<=0&&Math.abs(d.x-pcx)<10&&d.y>P.y&&d.y<P.y+P.h)hit='fiente'}
  C.drops=C.drops.filter(d=>!d.dead||d.life<2.5);
  // les collègues : mendiants, sauteurs, déplumés
  for(const o of C.pig){o.t+=dt;
    if(o.k==='gros'){const cyc=6,u=o.t%cyc;
      if(u<1.6){o.st='walk';o.x=o.a+Math.sin(u*1.8)*10;o.y=o.y0;o.f=1}else if(u<3){o.st='fly';const v=(u-1.6)/1.4;o.x=lerp(o.a,o.b,v);o.y=o.y0-Math.sin(v*Math.PI)*o.h;o.f=1}
      else if(u<4.6){o.st='walk';o.x=o.b+Math.sin((u-3)*1.8)*10;o.y=o.y0;o.f=-1}else{o.st='fly';const v=(u-4.6)/1.4;o.x=lerp(o.b,o.a,v);o.y=o.y0-Math.sin(v*Math.PI)*o.h;o.f=-1}
      if(!P.dead&&C.grace<=0&&overlap(hb,{x:o.x-18,y:o.y-32,w:36,h:30}))hit='sauteur'}
    else if(o.k==='deplume'){const dx=pcx-o.x,see=Math.abs(dx)<300&&Math.abs(P.y+P.h-o.y0)<60&&!P.dead&&(o.chase||Math.sign(dx)===o.f);
      if(see){o.chase=1;o.rt=(o.rt||0)+dt;o.f=Math.sign(dx)||1;if((o.rt%2)<1){o.st='run';o.x+=o.f*190*dt}else o.st='stand'}else{o.chase=0;o.rt=0;o.st='walk';o.f=Math.sin(o.t*.5)>0?1:-1;o.x+=o.f*24*dt}
      o.x=clamp(o.x,o.a,o.b);if(o.st==='run'&&!o.cried&&!G.sim){o.cried=1;bubble(o.x,o.y0-40,'Krrr ! Rrou-wesh !','#6a4a4a');if(!C.said.genz){C.said.genz=1;setTimeout(()=>{if(L.cb===C)say("Ah, la génération Z. Génération zéro, oui. Pas un pli porté de leur vie, et ça vous fonce dessus.",4.4)},900)}}
      if(!P.dead&&C.grace<=0&&overlap(hb,{x:o.x-12,y:o.y-24,w:24,h:22}))hit='pigeonDeplume'}
    else{o.x+=o.f*22*dt;if(o.x<o.a){o.x=o.a;o.f=1}if(o.x>o.b){o.x=o.b;o.f=-1}o.y=o.y0;o.beg=Math.max(0,o.beg-dt);o.st=o.beg>1.4?'beg':'walk';
      if(Math.abs(pcx-o.x)<200&&Math.abs(pcy-o.y)<110&&o.beg<=0&&!G.sim&&!C.talk){o.beg=3.4;bubble(o.x,o.y-44,pick(["Rrrou… krr… rrou ?","Wesh… rrou-rrou…","Krr… miette… rrou ?","Rrou. Rrou. Krr.","Rrouuu… frérot…"]),'#6a5a48')}
      if(!P.dead&&C.grace<=0&&overlap(hb,{x:o.x-12,y:o.y-26,w:24,h:24}))hit='mendiant'}}
  if(hit)C.hit=hit;
  // Raymond essaie de parler aux collègues
  if(!C.said.parle&&!P.dead&&Math.abs(pcx-C.pig[0].x)<230&&Math.abs(pcy-C.pig[0].y)<120){C.said.parle=1;C.talk={t:0,k:0}}
  if(C.talk&&!G.sim){const k=C.talk;k.t+=dt;const o=C.pig[0];
    if(k.k===0){k.k=1;say("Pardon, camarade ! Le pigeonnier Vasseur, au bout du village… Vous savez ce qu'il est devenu ?",4)}
    else if(k.k===1&&k.t>4.1){k.k=2;bubble(o.x,o.y-44,"Rrrou… krr… wesh… rrou-rrou ?",'#6a5a48')}
    else if(k.k===2&&k.t>5.8){k.k=3;unlock('n25');say("On ne leur a même pas appris à parler correctement. On ne comprend rien à ce qu'ils disent.",4.2)}
    else if(k.k===3&&k.t>10.2)C.talk=null}
  // la sortie : le trou dans le toit (il n'existe pas en 1914)
  if(!C.end&&!P.dead&&C.era===26&&pcx>199.6*T&&pcx<205*T&&P.y<1.6*T){C.end={t:0,x0:P.x,y0:P.y,amb:0};P.vx=P.vy=0}
  // répliques
  const once=(k,c,txt,d)=>{if(!C.said[k]&&c&&!C.talk){C.said[k]=1;say(txt,d||3.8)}};
  once('ronge',pcx>24*T&&C.era===26,"Des planches vermoulues. Elles ont l'air solides. Elles l'ont l'air seulement.",3.6);
  once('poutres',pcx>35*T,"Pas de plancher, pas de fond. De poutre en poutre, comme les écureuils. Le règlement n'a rien prévu pour les écureuils.",4.4);
  once('soleil',pcx>66*T,"Le soleil passe entre les tuiles. Dans ses rayons, la poussière tombe comme la neige à une autre époque.",4);
  once('cloches',pcx>95*T,"La chambre des cloches. Elles sonnent pour quelqu'un. Pas pour moi, j'espère.",3.6);
  once('choeur',pcx>129*T,"Le comble du chœur. Ça monte encore. Il doit bien y avoir un trou dans ce toit.",3.6);
  once('trou',pcx>186*T&&C.era===26,"De la lumière, là-haut. Un trou dans la charpente. On sort toujours par le haut.",3.6);
  once('trou14',pcx>196*T&&C.era===14,"En 1914, le toit tenait encore. Qu'en est-il aujourd'hui ?",3.6);
}
function comblesAfterMove(){const C=L.cb;if(!C)return null;if(C.hit){const h=C.hit;C.hit=null;return h}if(P.y>CBR*T)return'voute';return null}
/* ---------- la fin : sur le toit, la commune, le bal ---------- */
function comblesEndStep(dt){const C=L.cb,e=C.end;e.t+=dt;P.vx=P.vy=0;P.facing=1;
  const u=Math.min(1,e.t/1.1);P.x=lerp(e.x0,202*T,u);P.y=lerp(e.y0,-2.2*T,u*u);P.flapT=u<1?.3:0;P.onGround=false;
  if(e.t>1.1&&!e.music){e.music=1;if(!G.sim){setSong('bal');SFX.flap()}}
  if(e.t>1.1&&!G.sim){e.amb-=dt;if(e.amb<=0){e.amb=.18+rnd()*.3;noise(.5+rnd()*.6,500+rnd()*700,.012+rnd()*.01,'bandpass');if(rnd()<.1)tone(880+rnd()*400,.08,'sine',.02,1100+rnd()*300)}}
  if(e.t>16.5||e.skip){C.end=null;winLevel()}
}
function comblesSkip(){const e=L.cb&&L.cb.end;if(!e||e.t<2.5)return;if(e.t<6.6)e.t=6.6;else if(e.t>8.4)e.skip=1}
/* la commune vue du toit : préparée une fois, animée par-dessus.
   On ne voit pas l'église (on est dessus) : au loin, la collégiale de La Chapelle et son clocher briard ;
   un seul bras du Grand Morin ; la mairie, et la fête sur la place devant elle. */
let CB_VIEW=null;
const CBV={roofY:432,hole:[300,500],mairie:[560,760,404],place:[430,820,416],carou:[505,412]};
function cbViewBuild(){
  const c=mk(W,H),g=c.getContext('2d'),R=mulberry(512);
  const sk=g.createLinearGradient(0,0,0,300);sk.addColorStop(0,'#6a98c8');sk.addColorStop(.7,'#b8d4e8');sk.addColorStop(1,'#f0ead8');g.fillStyle=sk;g.fillRect(0,0,W,H);
  for(let k=0;k<6;k++){const x=R()*W,y=40+R()*110,w=90+R()*140;g.fillStyle='rgba(255,255,255,.8)';g.beginPath();g.ellipse(x,y,w,14,0,0,7);g.ellipse(x-w*.3,y-10,w*.4,16,0,0,7);g.ellipse(x+w*.25,y-13,w*.3,17,0,0,7);g.fill()}
  // les coteaux de la vallée
  g.fillStyle='#93a690';g.beginPath();g.moveTo(0,232);for(let x=0;x<=W;x+=40)g.lineTo(x,222+Math.sin(x*.01)*12+R()*5);g.lineTo(W,H);g.lineTo(0,H);g.fill();
  g.fillStyle='#7a9272';g.beginPath();g.moveTo(0,262);for(let x=0;x<=W;x+=30)g.lineTo(x,254+Math.sin(x*.016+2)*9+R()*4);g.lineTo(W,H);g.lineTo(0,H);g.fill();
  for(let x=0;x<W;x+=12+R()*14){g.fillStyle=mix('#52724a','#3e5e3a',R());g.beginPath();g.arc(x,270+R()*8,8+R()*8,0,7);g.fill()}
  // la collégiale Notre-Dame de La Chapelle : longue nef, bas-côtés en appentis, contreforts, clocher carré à flèche d'ardoise
  {const x=110,b=318,w=200;g.fillStyle='#cfc6b2';g.fillRect(x,b-38,w,38);g.fillStyle='#bdb39c';g.fillRect(x-6,b-22,w+12,22);
    g.fillStyle='#8a5a40';poly(g,[x-10,b-22,x,b-34,x+w,b-34,x+w+10,b-22]);g.fill();
    g.fillStyle='#9a6248';poly(g,[x,b-38,x+w*.5,b-66,x+w,b-38]);g.fill();g.fillStyle='rgba(0,0,0,.12)';poly(g,[x+w*.5,b-66,x+w,b-38,x+w*.5,b-38]);g.fill();
    g.fillStyle='#d8d0bc';poly(g,[x-4,b-38,x+18,b-72,x+40,b-38]);g.fill();
    g.fillStyle='#b0a690';for(let k=0;k<7;k++){const bx=x+16+k*28;poly(g,[bx,b,bx+6,b,bx+6,b-30,bx+2,b-36]);g.fill()}
    g.fillStyle='#4a4a54';for(let k=0;k<6;k++){const bx=x+28+k*28;g.beginPath();g.moveTo(bx,b-12);g.lineTo(bx,b-22);g.arc(bx+3,b-22,3,Math.PI,0);g.lineTo(bx+6,b-12);g.fill()}
    const tx=x+w-36;g.fillStyle='#d2c9b4';g.fillRect(tx,b-104,30,104);g.fillStyle='rgba(0,0,0,.1)';g.fillRect(tx+20,b-104,10,104);
    g.fillStyle='#3a3a44';for(const yy of[b-92,b-70]){g.fillRect(tx+7,yy,5,14);g.fillRect(tx+18,yy,5,14)}
    g.fillStyle='#5a6070';poly(g,[tx-3,b-104,tx+15,b-158,tx+33,b-104]);g.fill();g.fillStyle='rgba(0,0,0,.15)';poly(g,[tx+15,b-158,tx+33,b-104,tx+15,b-104]);g.fill();
    g.strokeStyle='#3a3a3a';g.lineWidth=1.4;g.beginPath();g.moveTo(tx+15,b-158);g.lineTo(tx+15,b-168);g.moveTo(tx+11,b-164);g.lineTo(tx+19,b-164);g.stroke();
    for(let k=0;k<6;k++){g.fillStyle=mix('#4e6e48','#3a5a38',R());g.beginPath();g.arc(x-30+k*52+R()*20,b+2,12+R()*8,0,7);g.fill()}}
  // les toits du village
  const rowY=[316,336,358,384,408];
  const drawRow=(y,i)=>{const s=.5+i*.2;for(let x=-20;x<W+20;){const w=(40+R()*50)*s,h=(18+R()*12)*s;
    if(y<330&&x>90&&x<330){x+=w;continue}
    if(i>=2&&x>CBV.mairie[0]-30&&x<CBV.mairie[1]+20){x+=w*.6;continue}
    if(i>=3&&x>CBV.place[0]&&x<CBV.place[1]){x+=w*.6;continue}
    g.fillStyle=mix('#e8dcc4','#c8b89a',R());g.fillRect(x,y-h*.4,w,h*1.2);
    g.fillStyle=mix(mix('#b85a3a','#8a4a3a',R()),'#6a6a70',R()<.25?.7:0);poly(g,[x-3,y-h*.4,x+w*.5,y-h*1.25,x+w+3,y-h*.4]);g.fill();
    g.fillStyle='rgba(40,30,30,.35)';for(let k=0;k<2;k++)g.fillRect(x+w*(.2+k*.4),y,w*.14,h*.35);
    if(R()<.3){g.fillStyle='#8a6a5a';g.fillRect(x+w*.7,y-h*1.2,4*s,10*s)}
    x+=w+(2+R()*10)*s}
    for(let k=0;k<4;k++){const x=R()*W;if(x>CBV.place[0]-20&&x<CBV.mairie[1]+20&&i>=2)continue;g.fillStyle=mix('#3e6a3a','#2a4a2a',R());g.beginPath();g.arc(x,y-10*s,12*s+R()*8*s,0,7);g.fill()}};
  rowY.forEach((y,i)=>{if(i<3)drawRow(y,i)});
  // le seul bras du Grand Morin, avec son lavoir
  {const y=372;g.fillStyle='rgba(118,158,186,.95)';g.beginPath();g.moveTo(0,y);g.bezierCurveTo(240,y-6,420,y+8,W,y-2);g.lineTo(W,y+9);g.bezierCurveTo(420,y+17,240,y+3,0,y+9);g.closePath();g.fill();
    g.fillStyle='rgba(255,255,255,.4)';for(let x=10;x<W;x+=36)g.fillRect(x+R()*20,y+3,10,1.4);
    g.fillStyle='#7a5a3a';g.fillRect(250,y-6,64,8);g.fillStyle='#9a4a32';poly(g,[244,y-6,282,y-20,320,y-6]);g.fill()}
  rowY.forEach((y,i)=>{if(i>=3)drawRow(y,i)});
  // la mairie : grande façade claire, avant-corps à fronton et horloge, toit d'ardoise à lucarnes, drapeau
  {const[x0,x1,b]=CBV.mairie,w=x1-x0,h=70;g.fillStyle='#e6dcc6';g.fillRect(x0,b-h,w,h);g.fillStyle='#b85a3a';for(let k=0;k<3;k++)g.fillRect(x0,b-h+k*24,w,3);
    g.fillStyle='#5a6070';poly(g,[x0-6,b-h,x0+16,b-h-28,x1-16,b-h-28,x1+6,b-h]);g.fill();
    g.fillStyle='#e6dcc6';for(let k=0;k<4;k++){const lx=x0+30+k*(w-60)/3;poly(g,[lx-7,b-h-4,lx-7,b-h-18,lx,b-h-24,lx+7,b-h-18,lx+7,b-h-4]);g.fill();g.fillStyle='#3a4050';g.fillRect(lx-3,b-h-16,6,10);g.fillStyle='#e6dcc6'}
    const cx=(x0+x1)/2;g.fillStyle='#ece4d0';g.fillRect(cx-28,b-h-8,56,h+8);poly(g,[cx-32,b-h-8,cx,b-h-34,cx+32,b-h-8]);g.fill();
    g.fillStyle='#f6f2e6';g.beginPath();g.arc(cx,b-h-17,7,0,7);g.fill();g.strokeStyle='#2a2a2a';g.lineWidth=1.2;g.beginPath();g.moveTo(cx,b-h-17);g.lineTo(cx,b-h-22);g.moveTo(cx,b-h-17);g.lineTo(cx+4,b-h-16);g.stroke();
    g.strokeStyle='#3a3a3a';g.beginPath();g.moveTo(cx,b-h-34);g.lineTo(cx,b-h-58);g.stroke();for(const[k,col]of[[0,'#2a4a9a'],[1,'#f2f2f2'],[2,'#d8302a']]){g.fillStyle=col;g.fillRect(cx+1+k*6,b-h-58,6,11)}
    g.fillStyle='#3a3a44';g.font='bold 8px '+F_DISP;g.textAlign='center';g.fillText('MAIRIE',cx,b-h+6);
    g.fillStyle='#3a4458';for(let r=0;r<2;r++)for(let k=0;k<8;k++){const wx=x0+12+k*(w-24)/7.4;if(Math.abs(wx-cx)<26)continue;g.fillRect(wx,b-h+12+r*28,8,16)}
    g.fillStyle='#5a3a26';g.fillRect(cx-8,b-22,16,22);g.fillStyle='#c8c0ae';g.fillRect(cx-22,b-3,44,3)}
  // la place : pavés clairs, chalets de bois
  g.fillStyle='#c8bea4';g.fillRect(CBV.place[0],CBV.mairie[2],CBV.place[1]-CBV.place[0],CBV.roofY-CBV.mairie[2]);
  for(let k=0;k<5;k++){const x=CBV.place[0]+120+k*46+(k>1?90:0),y=CBV.place[2]+4;if(k===2)continue;g.fillStyle='#8a5a32';g.fillRect(x,y-16,32,16);g.fillStyle='#5a3a22';poly(g,[x-4,y-16,x+16,y-27,x+36,y-16]);g.fill();g.fillStyle='#f2e0a0';g.fillRect(x+5,y-12,22,5)}
  // le premier plan : le toit de l'église, tuiles plates en perspective, la gouttière, le trou d'où l'on sort
  {const y0=CBV.roofY;g.fillStyle='#4a2e20';g.fillRect(0,y0-4,W,H-y0+4);
    let y=y0,hh=5;for(let r=0;y<H;r++){const tw=hh*2.2;for(let x=-(r%2)*tw/2;x<W;x+=tw){const v=h01(x|0,r);g.fillStyle=mix('#9a5a3a','#6a3a28',v);rr(g,x+.5,y,tw-1,hh,Math.min(2,hh*.3));g.fill();if(v>.85){g.fillStyle='rgba(120,140,70,.5)';g.beginPath();g.ellipse(x+tw/2,y+hh/2,tw*.3,hh*.35,0,0,7);g.fill()}
      g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x+.5,y+hh-1.5,tw-1,1.5)}y+=hh*.82;hh*=1.13}
    g.fillStyle='#8a8e90';g.fillRect(0,y0-6,W,5);g.fillStyle='rgba(255,255,255,.4)';g.fillRect(0,y0-6,W,1)}
  {const[hx,hy]=CBV.hole;g.save();g.beginPath();g.moveTo(hx-62,hy+6);g.lineTo(hx-40,hy-14);g.lineTo(hx-8,hy-20);g.lineTo(hx+30,hy-16);g.lineTo(hx+60,hy-4);g.lineTo(hx+52,hy+16);g.lineTo(hx+18,hy+24);g.lineTo(hx-30,hy+22);g.closePath();
    g.fillStyle='#120c08';g.fill();g.clip();g.fillStyle='rgba(255,220,160,.12)';g.fillRect(hx-70,hy-30,140,60);
    g.fillStyle='#6a5038';g.fillRect(hx-70,hy-4,52,5);g.fillRect(hx+14,hy-4,60,5);g.fillRect(hx-70,hy+10,140,4);g.save();g.translate(hx-18,hy-2);g.rotate(.6);g.fillRect(0,-2,30,5);g.restore();
    g.fillStyle='#2a1c12';g.save();g.translate(hx+16,hy);g.rotate(1.45);g.fillRect(-40,-6,80,12);g.restore();g.restore();
    for(const[x,y,a]of[[hx-58,hy+2,.4],[hx-36,hy-16,-.3],[hx+40,hy-12,.3],[hx+58,hy+4,-.4],[hx-6,hy+22,.1],[hx+30,hy+20,-.2]]){g.save();g.translate(x,y);g.rotate(a);g.fillStyle='#8a4a30';g.fillRect(-11,-4,22,8);g.fillStyle='#5a2e1e';g.fillRect(-11,2,22,2);g.restore()}}
  return c}
function comblesOverlay(t){const C=L.cb;if(!C)return;
  if(!C.end||C.end.t<1.3){ctx.save();ctx.globalCompositeOperation='lighter';const lum=C.lum*(C.era===14?.7:1);
    const draw=(x0,w,a,len)=>{const sx=x0-cam.x,sy=-cam.y,dx=len*.42;if(sx+dx<-200||sx>W+200)return;
      const gr=ctx.createLinearGradient(sx,sy,sx+dx,sy+len);gr.addColorStop(0,'rgba(255,226,160,'+a+')');gr.addColorStop(.55,'rgba(255,214,140,'+(a*.45)+')');gr.addColorStop(1,'rgba(255,214,140,0)');
      ctx.fillStyle=gr;ctx.beginPath();ctx.moveTo(sx,sy+T);ctx.lineTo(sx+w,sy+T);ctx.lineTo(sx+w*1.8+dx,sy+len);ctx.lineTo(sx+dx-w*.4,sy+len);ctx.closePath();ctx.fill()};
    for(const[c,w]of CB.rays)draw(c*T,w,.13*lum,820);
    if(C.era===26)draw(200*T,5*T,.2+.14*lum,1100);
    for(const m of C.motes){const[c,w]=CB.rays[m.r];const v=(m.v+t*.02*m.s)%1,y=T+v*700,x=c*T+(y-T)*.42+m.u*w*(1+v*.8)+Math.sin(t*.7+m.u*9)*6;const sx=x-cam.x,sy=y-cam.y;if(sx<-10||sx>W+10)continue;
      ctx.fillStyle='rgba(255,236,190,'+(.35*lum*Math.sin(v*Math.PI))+')';ctx.fillRect(sx,sy,1.6*m.s,1.6*m.s)}
    ctx.restore();
    if(C.era===14){const fc=ferteFogTex();ctx.save();const ox=((t*14+cam.x*.15)%fc.fog.width+fc.fog.width)%fc.fog.width;ctx.globalAlpha=.75;ctx.drawImage(fc.fog,-ox,0,fc.fog.width,H);ctx.drawImage(fc.fog,fc.fog.width-ox,0,fc.fog.width,H);ctx.globalAlpha=1;ctx.drawImage(fc.vig,0,0,W,H);
      ctx.globalAlpha=.6;ctx.fillStyle='#efe5cc';ctx.font='italic 15px '+F_BODY;ctx.textAlign='left';ctx.fillText('Les combles · septembre 1914',20,H-20);ctx.restore()}
    if(C.flash>0){ctx.fillStyle='rgba(236,232,222,'+(Math.min(1,C.flash)*.85)+')';ctx.fillRect(0,0,W,H)}}
  const e=C.end;if(!e)return;
  if(e.t<1.3){ctx.fillStyle='rgba(255,250,235,'+clamp((e.t-.5)/.8,0,1)+')';ctx.fillRect(0,0,W,H);return}
  if(!CB_VIEW)CB_VIEW=cbViewBuild();
  ctx.drawImage(CB_VIEW,0,0);
  // le manège, les fanions, les gens sur la place
  {const[x,y]=CBV.carou;ctx.save();ctx.fillStyle='#e8d8b0';ctx.fillRect(x-26,y-20,52,20);for(let k=0;k<8;k++){const a=t*1.6+k*Math.PI/4,px=x+Math.cos(a)*22,s=Math.sin(a);if(s<0)continue;ctx.fillStyle=['#c8402a','#3a6aa8','#e0b030','#5aa86a'][k%4];ctx.fillRect(px-3,y-13+Math.sin(t*3+k)*2,6,7)}
    ctx.fillStyle='#c8402a';poly(ctx,[x-32,y-20,x,y-40,x+32,y-20]);ctx.fill();ctx.fillStyle='#f2ead8';for(let k=0;k<4;k++){poly(ctx,[x-32+k*16,y-20,x,y-40,x-24+k*16,y-20]);ctx.fill()}
    ctx.fillStyle='#e0b030';ctx.beginPath();ctx.arc(x,y-42,3,0,7);ctx.fill();
    for(let k=0;k<12;k++){const lx=x-28+k*5,on=(Math.floor(t*4)+k)%3;ctx.fillStyle=on?'rgba(255,230,140,.95)':'rgba(255,230,140,.3)';ctx.fillRect(lx,y-21,2,2)}ctx.restore()}
  {ctx.save();ctx.lineWidth=1;ctx.strokeStyle='rgba(60,50,40,.6)';const[mx0,mx1,mb]=CBV.mairie;for(const[a,b]of[[CBV.place[0]+20,(mx0+mx1)/2],[(mx0+mx1)/2,CBV.place[1]-20]]){const y=mb-60;ctx.beginPath();ctx.moveTo(a,y+(a<mx0?40:0));ctx.quadraticCurveTo((a+b)/2,y+30,b,y+(b>mx1?40:0));ctx.stroke();
    for(let k=1;k<12;k++){const u=k/12,fx=lerp(a,b,u),fy=(1-u)*(1-u)*(y+(a<mx0?40:0))+2*u*(1-u)*(y+30)+u*u*(y+(b>mx1?40:0));ctx.fillStyle=['#c8402a','#f2ead8','#3a6aa8','#e0b030'][k%4];poly(ctx,[fx-3,fy,fx+3,fy,fx+Math.sin(t*3+k),fy+7]);ctx.fill()}}ctx.restore()}
  {const R=mulberry(91);for(let k=0;k<54;k++){const bx=CBV.place[0]+10+R()*(CBV.place[1]-CBV.place[0]-20),by=CBV.place[2]+2+R()*12,ph=R()*7,dx=Math.sin(t*(.4+R()*.6)+ph)*12;ctx.fillStyle=['#3a3a4a','#8a2a2a','#2a4a6a','#e8e0d0','#5a6a3a'][k%5];ctx.fillRect(bx+dx,by-5,3,5);ctx.fillStyle='#d8b8a0';ctx.fillRect(bx+dx,by-7,3,2)}}
  for(let k=0;k<5;k++){const x=((t*40+k*90)%(W+200))-100,y=150+Math.sin(t*.8+k)*16+k*6;ctx.strokeStyle='rgba(50,50,60,.7)';ctx.lineWidth=1.4;const fl=Math.sin(t*12+k)*3;ctx.beginPath();ctx.moveTo(x-6,y-fl);ctx.lineTo(x,y);ctx.lineTo(x+6,y-fl);ctx.stroke()}
  // Raymond, posé sur le bord du trou, qui regarde la commune
  {const[hx,hy]=CBV.hole;drawRaymond(ctx,hx+44,hy-6,{f:1,t,walk:0,wear:S.run.wear||0,size:1.5,eyeClosed:false})}
  if(e.t<2.1){ctx.fillStyle='rgba(255,250,235,'+(1-(e.t-1.3)/.8)+')';ctx.fillRect(0,0,W,H)}
  if(e.t>7){const a=Math.min(1,(e.t-7)/1.1)*(e.t>15.5?Math.max(0,1-(e.t-15.5)):1);
    vxCard("Par le trou de la charpente, Raymond admira toute la commune.\nAu loin, sur la place, on donnait un bal.\nMarguerite avait toujours aimé les fêtes.",a,t)}
}
/* ---------- les tuiles : la charpente fixe, peinte une fois (les poutres qui changent avec l'époque sont dessinées à part) ---------- */
function cbBeam(g,x,y,len,lf,rt,fr,seed){const R=mulberry(seed|0),oak='#5a4028',oakL='#7a5a3a',oakD='#2e2014';
  g.fillStyle='rgba(0,0,0,.3)';g.fillRect(x+4,y+24,len,8);
  g.fillStyle=fr?'#5e4630':oak;g.fillRect(x,y,len,24);g.fillStyle=fr?'#7a6046':oakL;g.fillRect(x,y,len,5);g.fillStyle=oakD;g.fillRect(x,y+20,len,4);
  for(let x0=x;x0<x+len;x0+=T){g.strokeStyle='rgba(30,20,10,.5)';g.lineWidth=1;for(let k=0;k<2;k++){const yy=y+9+k*6+R()*2;g.beginPath();g.moveTo(x0,yy);g.bezierCurveTo(x0+12,yy+R()*3,x0+26,yy-R()*3,x0+T,yy);g.stroke()}
    if(R()<.25){g.fillStyle='#3a2a18';g.beginPath();g.arc(x0+T/2,y+13,2.6,0,7);g.fill()}
    if(fr){// vermoulue : fentes profondes, trous de vers, petits jours à travers le bois
      g.strokeStyle='#160e06';g.lineWidth=1.8;g.beginPath();g.moveTo(x0+2+R()*6,y+3);g.lineTo(x0+12+R()*6,y+10);g.lineTo(x0+8+R()*6,y+17);g.lineTo(x0+16+R()*6,y+23);g.stroke();
      g.lineWidth=1.2;g.beginPath();g.moveTo(x0+22+R()*6,y+1);g.lineTo(x0+28+R()*6,y+9);g.lineTo(x0+34+R()*4,y+12);g.stroke();
      for(let k=0;k<2;k++){const hx=x0+8+k*18+R()*8,hy=y+8+R()*9,hw=2.5+R()*2.5;g.fillStyle='#0a0604';g.beginPath();g.ellipse(hx,hy,hw*1.7,hw*.55,(R()-.5)*.3,0,7);g.fill();g.fillStyle='rgba(255,220,160,.16)';g.fillRect(hx-hw,hy-.5,hw*1.2,1)}
      g.fillStyle='rgba(20,12,6,.7)';for(let k=0;k<9;k++)g.fillRect(x0+R()*36,y+5+R()*14,1.4,1.4);
      g.fillStyle='#2a1c10';poly(g,[x0+14,y+24,x0+18,y+18,x0+23,y+24]);g.fill()}
    else if(R()<.15){g.fillStyle='rgba(20,12,6,.6)';for(let k=0;k<5;k++)g.fillRect(x0+R()*36,y+6+R()*14,1.5,1.5)}}
  if(lf){g.fillStyle='#2a1c10';poly(g,[x,y,x+6,y+3,x+3,y+9,x+7,y+15,x+2,y+24,x,y+24]);g.fill()}
  if(rt){g.fillStyle='#2a1c10';poly(g,[x+len,y,x+len-5,y+4,x+len-2,y+10,x+len-7,y+17,x+len-3,y+24,x+len,y+24]);g.fill()}}
function comblesTiles(){
  const wpx=L.wpx+DX+8,hpx=CBR*T+PAD,TR=Math.min(RS,1.5),{layer:c,g}=mkLayer(wpx*TR,hpx*TR);g.scale(TR,TR);c.rs=TR;g.translate(0,PAD);
  const R=mulberry(2026),oakD='#2e2014';
  // tout en bas : le noir. On devine à peine, très loin, le dos des voûtes
  {const gr=g.createLinearGradient(0,16*T,0,CBR*T);gr.addColorStop(0,'rgba(6,4,2,0)');gr.addColorStop(1,'rgba(6,4,2,.9)');g.fillStyle=gr;g.fillRect(0,16*T,L.wpx,8*T);
   g.fillStyle='rgba(120,100,80,.07)';for(let x=0;x<L.wpx;x+=6*T){g.beginPath();g.ellipse(x+3*T,CBR*T+30,3*T,46,0,Math.PI,0);g.fill()}}
  // les fermes, en élévation, derrière tout (bois plus sombre)
  for(const tc of CB.trusses){const x=tc*T+T/2;g.save();g.globalAlpha=.75;
    g.fillStyle=oakD;g.fillRect(x-9,T,18,15*T);
    g.save();g.translate(x,16*T);for(const s of[-1,1]){g.save();g.rotate(s*-.72);g.fillRect(-7,-12*T,14,12*T);g.restore()}g.restore();
    g.fillRect(x-5*T,16*T,10*T,16);g.fillRect(x-3*T,9*T,6*T,12);
    for(const s of[-1,1]){g.save();g.translate(x,12*T);g.rotate(s*.6);g.fillRect(-4,0,8,3.4*T);g.restore()}
    g.fillStyle='rgba(255,230,180,.06)';g.fillRect(x-9,T,3,15*T);
    g.fillStyle='#1e150c';for(const[px,py]of[[0,9.15*T],[0,16.2*T],[-4.4*T,16.2*T],[4.4*T,16.2*T]]){g.beginPath();g.arc(x+px,py+6,2.5,0,7);g.fill()}
    g.restore()}
  // le beffroi
  {g.save();g.globalAlpha=.8;g.fillStyle=oakD;for(const x of[95.5,104,112,120,125])g.fillRect(x*T-8,2*T,16,19*T);
    for(const y of[8,14,20])g.fillRect(95*T,y*T,30*T,14);
    g.strokeStyle=oakD;g.lineWidth=12;for(const[a,b]of[[95.5,104],[104,112],[112,120],[120,125]])for(const[y0,y1]of[[2,8],[8,14],[14,20]]){g.beginPath();g.moveTo(a*T,y0*T);g.lineTo(b*T,y1*T);g.moveTo(b*T,y0*T);g.lineTo(a*T,y1*T);g.stroke()}
    g.restore()}
  // le toit, vu de dessous : chevrons, liteaux, et le revers des tuiles plates
  {const H0=-PAD,H1=T+4;g.fillStyle='#3a2a1c';g.fillRect(0,H0,L.wpx,H1-H0);
    for(let y=H0+2,k=0;y<H1;y+=7,k++)for(let x=(k%2)*9;x<L.wpx;x+=18){g.fillStyle=h01(x,y)<.4?'#4a3424':'#523a28';g.fillRect(x,y,17,6)}
    g.fillStyle='#5a4430';for(const y of[6,20,34])g.fillRect(0,y,L.wpx,4);
    for(let x=0;x<L.wpx;x+=34){g.fillStyle='#2a1c12';g.fillRect(x,H0,12,H1-H0+2);g.fillStyle='rgba(255,230,180,.08)';g.fillRect(x,H0,2,H1-H0)}
    g.fillStyle='#2a1e14';g.fillRect(0,T-2,L.wpx,8);
    for(const[c0,w]of CB.rays){g.fillStyle='rgba(255,236,190,.5)';g.fillRect(c0*T+4,8,w*.6,3);g.fillStyle='rgba(255,236,190,.22)';g.fillRect(c0*T,6,w,8)}}
  // le trou de la sortie (2026) : tuiles cassées, liteaux rompus, un chevron qui tient encore ; dessinés à part (cbRoofHole)
  // les murs de pierre : pignons et clocher
  for(let cc=0;cc<L.w;cc++)for(let r=0;r<CBR;r++){if(L.g[r][cc]!=='X')continue;const x=cc*T,y=r*T;
    g.fillStyle='#6a6050';g.fillRect(x,y,T,T);g.strokeStyle='rgba(30,24,18,.5)';g.lineWidth=1.2;
    for(let k=0;k<2;k++){g.beginPath();g.moveTo(x,y+k*20);g.lineTo(x+T,y+k*20);g.stroke();const o=(r+k)%2?12:28;g.beginPath();g.moveTo(x+o,y+k*20);g.lineTo(x+o,y+k*20+20);g.stroke()}
    g.fillStyle='rgba(255,240,210,.06)';g.fillRect(x+2,y+2,T-4,4);g.fillStyle='rgba(0,0,0,'+(.1+R()*.12)+')';g.fillRect(x+R()*30,y+R()*30,8,6)}
  {g.fillStyle='#4a4236';g.beginPath();g.arc(94*T,17*T,2*T,Math.PI,0);g.fill();g.fillStyle='#5a5244';for(let k=0;k<7;k++){g.save();g.translate(94*T,17*T);g.rotate(Math.PI+k*Math.PI/6);g.fillRect(2*T-14,-5,16,10);g.restore()}}
  // les poutres de toujours
  for(const b of CB.beams)if(b.e==='b')cbBeam(g,b.c0*T,b.r*T,(b.c1-b.c0+1)*T,true,true,false,b.c0*31+b.r);
  for(const tc of CB.trusses)cobweb(g,tc*T+T/2+10,T+8,40+R()*30);
  g.save();g.globalCompositeOperation='source-atop';g.globalAlpha=.3;g.fillStyle=g.createPattern(paperC,'repeat');g.fillRect(0,-PAD,wpx,hpx);g.restore();
  return c}
/* le trou du toit, vu de dedans (2026) — mêmes tuiles plates, mêmes liteaux que dans la cinématique */
function cbRoofHole(g,t){const x0=199.6*T,x1=205.4*T;g.save();
  g.beginPath();g.moveTo(x0,T);g.lineTo(x0+14,4);g.lineTo(x0+40,-6);g.lineTo(x0+90,-18);g.lineTo(x1-60,-14);g.lineTo(x1-20,2);g.lineTo(x1,T);g.lineTo(x1-30,T-6);g.lineTo(x1-70,T+4);g.lineTo(x0+60,T-2);g.lineTo(x0+24,T+6);g.closePath();g.save();g.clip();
  const sk=g.createLinearGradient(0,-40,0,T+8);sk.addColorStop(0,'#78a6d6');sk.addColorStop(1,'#cfe2ee');g.fillStyle=sk;g.fillRect(x0,-60,x1-x0,T+70);
  g.fillStyle='rgba(255,255,255,.7)';g.beginPath();g.ellipse(x0+70+Math.sin(t*.1)*20,-6,40,7,0,0,7);g.fill();g.restore();
  // le chevron qui tient encore, en travers
  g.fillStyle='#2a1c12';g.save();g.translate(x0+130,T+4);g.rotate(-.12);g.fillRect(-7,-50,14,58);g.restore();
  // les liteaux rompus, dont un qui pend
  g.fillStyle='#6a5038';g.fillRect(x0,18,62,5);g.fillRect(x1-58,18,58,5);g.fillRect(x0,30,30,4);
  g.save();g.translate(x0+62,20);g.rotate(.7);g.fillRect(0,-2,40,5);g.restore();
  // des bouts de tuiles plates cassées sur les bords
  for(const[x,y,a]of[[x0+10,T-4,.3],[x0+34,T,-.2],[x1-34,T-2,.4],[x1-12,T-6,-.3],[x0+100,T,.1]]){g.save();g.translate(x,y);g.rotate(a);g.fillStyle='#8a4a30';g.fillRect(-10,-4,20,8);g.fillStyle='#5a2e1e';g.fillRect(-10,2,20,2);g.restore()}
  g.restore()}
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
  if(C.era===26)cbRoofHole(g,t);
  // les poutres de l'époque : saines, vermoulues (qui tremblent, qui tombent)
  for(const b of C.dyn){if(!cbActive(b,C.era))continue;const x=b.c0*T,len=(b.c1-b.c0+1)*T;if(x>cam.x+W+60||x+len<cam.x-60)continue;const fr=cbFragile(b,C.era);
    if(b.st==='gone'){for(const d of b.deb){g.save();g.translate(d.x,d.y);g.rotate(d.ra);g.fillStyle='#5e4630';g.fillRect(-9,-5,18,10);g.fillStyle='#2a1c10';g.fillRect(-9,3,18,2);g.restore()}continue}
    const sh=b.st==='shake'?Math.sin(b.t*70)*1.6:0;g.save();g.translate(sh,b.st==='shake'?b.t*4:0);cbBeam(g,x,b.r*T,len,true,true,fr,b.c0*31+b.r+(C.era===14?7:0));g.restore()}
  // les filets anti-pigeons de 2026 : une maille fine, tendue du plancher au toit, avec ses attaches
  if(C.era===26)for(const c of CB.nets26||[]){const x=c*T+T/2;if(!vis(x))continue;g.save();g.strokeStyle='rgba(30,34,38,.75)';g.lineWidth=1;
    for(let y=T;y<CBR*T;y+=9){g.beginPath();g.moveTo(x-T/2,y);g.lineTo(x+T/2,y+9);g.moveTo(x+T/2,y);g.lineTo(x-T/2,y+9);g.stroke()}
    g.strokeStyle='#2a2e32';g.lineWidth=3;g.beginPath();g.moveTo(x-T/2,T);g.lineTo(x-T/2,CBR*T);g.moveTo(x+T/2,T);g.lineTo(x+T/2,CBR*T);g.stroke();
    g.fillStyle='#c8c8c0';for(let y=T*2;y<CBR*T;y+=T*3){g.fillRect(x-T/2-3,y,6,4);g.fillRect(x+T/2-3,y,6,4)}g.restore();
    if(!C.said.filet&&!G.sim&&Math.abs(P.x+P.w/2-x)<160){C.said.filet=1;say(/*v2*/"Un filet anti-pigeons, du plancher jusqu'au toit. En 2026, on ne passe pas. En 1914, il n'y en avait pas.",4.2)}}
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
  {const a=C.canif;if(C.era===14&&vis(a.x)&&!a.used){g.save();g.translate(a.x,a.y-2);g.rotate(-.1);g.fillStyle='#6a4428';rr(g,-9,-3,12,5,2);g.fill();g.fillStyle='#c8ccd0';poly(g,[3,-2.5,13,-1.5,3,1.5]);g.fill();g.fillStyle='#e8d8a0';g.font='bold 4px '+F_DISP;g.fillText('L',-5,1);g.restore()}}
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
    const glow=o.st==='warn'||o.st==='dive',er=o.st==='warn'?3+Math.min(1,o.t)*3.2:o.st==='dive'?6:3;g.fillStyle=glow?'#ffcc33':'#e8a830';for(const ex of[-2.5,6.5]){g.beginPath();g.arc(ex,by-6,er,0,7);g.fill()}
    g.fillStyle='#111';for(const ex of[-2.5,6.5]){if(o.st==='perch'&&Math.sin(t*.7+o.hx)>.6)g.fillRect(ex-3,by-6.5,6,1.4);else{g.beginPath();g.arc(ex,by-6,er*.5,0,7);g.fill()}}
    g.fillStyle='#d8a040';poly(g,[2,by-3,4,by-3,3,by+1]);g.fill();
    g.strokeStyle='rgba(60,40,20,.5)';g.lineWidth=1;for(let k=0;k<4;k++){g.beginPath();g.arc(1,by+4+k*3,3,.3,2.8);g.stroke()}
    if(!fly){g.fillStyle='#c8a050';g.fillRect(-5,-2,3,3);g.fillRect(3,-2,3,3)}
    g.restore()}
}
