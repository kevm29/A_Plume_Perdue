/* =========================================================
   ÉTAT DU JEU, VIES, PHYSIQUE, ENNEMIS, SCÈNE D'OUVERTURE
   ========================================================= */
const G={state:'loading',t:0,li:0,levelDeaths:0,corn:0,cornTotal:0,medal:false,quip:null,hintI:-1,hintA:0,lastHint:null,fade:1,shake:0,menuSel:0,click:null,boxes:[],
  card:0,cardT:0,cards:null,cardsDone:null,LE:null,chase:false,exitT:0,sel:0,cut:null,cutSeen:false,bubbles:[],flash:0,flashT:5,lt:0,tuftSaid:false,gameOverPending:false};
const P={x:0,y:0,w:24,h:28,vx:0,vy:0,onGround:false,onMover:null,coyote:0,jumpBuf:0,flaps:0,facing:1,jumping:false,gliding:false,flapT:0,sx:1,sy:1,dead:false,deadT:0,wake:0,cp:null,spin:0,lift:0};
const cam={x:0,y:0};
const parts=[];
const motes=[];
for(let i=0;i<70;i++)motes.push({x:rnd()*W,y:rnd()*H,z:.3+rnd()*.9,s:.6+rnd()*1.6,ph:rnd()*9});
const GRAV=2200,MAXFALL=900,GLIDE=190,RUN=290,ACC=2400,AIRACC=1700,FRIC=2600,JUMPV=730,FLAPV=560,MAXFLAPS=2;
const BOLT_PERIOD=3.0;
/* robustesse des ailes : un battement coûte 30, planer 15 par seconde ; au sol elle revient à 30 par seconde
   (une seconde par battement). Vidée, l'aile est « décousue » : plus de battement ni de vol plané avant 60. */
const STAM_MAX=100,STAM_FLAP=30,STAM_GLIDE=15,STAM_REGEN=30,STAM_RESUME=60;

/* toute parole reste au moins 3 s (plus si elle est longue) ; une nouvelle parole attend que la précédente ait été lue */
function say(text,dur,who){if(!text)return;const d=Math.max(3,dur||3,1.2+text.length*.045);
  if(G.quip&&G.quip.t<3&&G.quip.text!==text&&G.state==='play'){G.quipQ=G.quipQ||[];if(!G.quipQ.some(q=>q[1]===text)){G.quipQ.push([who||'RAYMOND',text,d]);if(G.quipQ.length>3)G.quipQ.shift()}return}
  G.quip={text,t:0,dur:d,who:who||'RAYMOND'}}
function bubble(x,y,text,col){G.bubbles.push({x,y,text,t:0,max:Math.max(3,1.2+text.length*.035),col:col||'#a8322d',rot:(rnd()-.5)*.25})}
function wear(){return S.run.wear||0}
function loadLayers(i){
  const key=i+':'+RS;
  for(const k in layerCache)if(k!==key&&!k.startsWith('0:'))delete layerCache[k];
  if(!layerCache[key]){const tmp=parseLevel(i);const prev=L;L=tmp;layerCache[key]={far:buildFar(tmp),mid:buildMid(tmp),windows:tmp.windows,turbines:tmp.turbines};L=prev}
  return layerCache[key];
}
function computeRS(){RS=Math.min(2,Math.max(1,Math.round(scale*dpr*2)/2))}
function songKey(i){const d=LEVELS[i];return's'+(d.w+1)+'-'+(i%4+1)}
function startLevel(i){
  computeRS();
  G.li=i;L=parseLevel(i);const lay=loadLayers(i);L.far=lay.far;L.mid=lay.mid;L.windows=lay.windows;L.turbines=lay.turbines;L.tiles=buildTilesF(L);L.lgLayer=L.def.langlet?langletBuild(L):null;L.fcLayer=L.def.facade?facadeBuild(L):null;L.a4Layer=L.def.a4?a4Build(L):null;L.aireLayer=L.def.aire?aireBuild(L):null;
  G.levelDeaths=0;G.corn=0;G.cornTotal=L.corn.length;G.medal=false;G.chase=false;G.bubbles=[];G.flash=0;G.flashT=3+rnd()*4;G.lt=0;
  setSong(songKey(i));loopsOff();
  P.cp={x:L.spawn.x,y:L.spawn.y};resetPlayer();
  parts.length=0;G.quip=null;G.quipQ=[];G.hintShow=-1;G.hintI=-1;G.lastHint=null;G.state='play';G.fade=1;G.t=0;G.cut=null;G.tombSeq=null;L.carton=null;
  if(L.dome){
    const dg=domeGeom(L.dome);L.armoire={x:L.dome.x+92,shake:0,door:0};L.backDoor={x:L.dome.x-170,open:0};
    L.acts.push({kind:'secret',style:'backdoor',x:L.backDoor.x+6,y:L.dome.floor,open:0,t:0,used:false});
    L.acts.push({kind:'carton',x:L.dome.x-62,y:L.dome.floor,open:0,t:0,used:false,step:0});
    if(!G.cutSeen){
      G.cut={t:0,ray:'statue',lieT:0,thief:{x:L.dome.x+760,state:'out',t:0,f:-1,head:1,alpha:1},flashes:[.6],blink:0,ev:{}};
      L.carton={x:L.armoire.x-6,y:L.dome.floor-218,vx:0,vy:0,rot:0,vr:0,state:'hold'};
      P.x=L.dome.x-P.w/2;P.y=dg.feet-P.h;P.facing=1;
    }else{L.dome.broken=true;L.carton={x:L.dome.x-62,y:L.dome.floor-20,rot:-.1,state:'rest'};L.armoire.door=1;say(L.def.start,5)}
  }else say(L.def.start,5);
  applyGot(i);if(S.infinite)S.run.usedInf=true;
  cam.x=clamp(P.x-W*.35,0,L.wpx-W);cam.y=ROWS*T-H;
  V=null;if(L.def.vaux)vauxStart();
}
function resetPlayer(){
  P.x=P.cp.x-P.w/2;P.y=P.cp.y-P.h;P.vx=P.vy=0;P.flaps=0;P.dead=false;P.onGround=false;P.onMover=null;P.jumping=false;P.sx=P.sy=1;P.jumpBuf=0;P.coyote=0;P.facing=1;P.spin=0;P.stam=STAM_MAX;P.torn=false;P.lastGY=null;P.idle=0;P.ride=null;P.lift=0;P.hideIn=null;P.carried=null;
}
function puff(x,y,n,straw){
  for(let i=0;i<n;i++){const a=rnd()*Math.PI*2,s=60+rnd()*260;parts.push({type:straw?'straw':'feather',x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-120,life:0,max:.9+rnd()*1.1,rot:rnd()*6,vr:(rnd()-.5)*14,len:4+rnd()*7})}
}
function obusBoom(x,y){if(G.sim)return;if(G.lt-(G.boomT||-9)<.4)return;G.boomT=G.lt;G.shake=18;noise(.9,240,.9,'lowpass');noise(.3,1400,.4,'bandpass');for(let i=0;i<24;i++){const a=-Math.PI*rnd(),sp=120+rnd()*320;parts.push({type:'dust',x,y:y-6,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:0,max:.8+rnd()*.5})}parts.push({type:'ring',x,y:y-10,life:0,max:.4});G.flash=Math.max(G.flash,.35)}
function die(kind,tiles){
  if(P.dead)return;
  if(kind==='obus'){obusBoom(P.x+P.w/2,P.y+P.h);tiles=null}if(kind==='elec')tiles=null;
  if(G.sim){P.dead=true;return}
  // mode caché : rien ne tue Raymond ; une chute hors du niveau le ramène simplement au cartel
  if(S.infinite){if(P.y>ROWS*T)resetPlayer();return}
  P.dead=true;P.deadT=1.25;G.levelDeaths++;gotOf(G.li).d++;S.run.anyAccroc=true;
  // chaque chute abîme Raymond d'un cran ; au-delà du 5e état, il perd la tête
  if((S.run.wear||0)>=MAX_WEAR&&!S.infinite)G.gameOverPending=true;
  else{S.run.wear=Math.min(MAX_WEAR,(S.run.wear||0)+1);if(S.run.wear>=MAX_WEAR)S.run.wasLow=true}
  save();
  G.shake=10;SFX.death();
  const cx=P.x+P.w/2,cy=P.y+P.h/2;
  puff(cx,cy,30,true);puff(cx,cy,10,false);parts.push({type:'ring',x:cx,y:cy,life:0,max:.45});
  if(kind==='cat'){meow(.9,true);}
  if(tiles&&tiles.length){for(const[c,r]of tiles)L.g[r][c]='p';L.tiles=buildTilesF(L)}
  const spec=DEATH_Q[kind];say(spec&&rnd()<.65?pick(spec):pick(DEATH_Q.any),3.6);
}
const TORN_Q=["Mon aile gauche vient de déposer un préavis de grève.","Ça craque aux coutures. Des coutures ? Depuis quand j'ai des coutures, moi ?","Elle se décroche ! Non. Si. Presque. Ne plus bouger d'une plume.",
 "Une aile cousue au fil de 1916. Il a de la bouteille, le fil.","Si je perds une aile, je deviens un pigeon de salon. Quelle déchéance.","Repos, l'aile. C'est un ordre. Elle n'obéit plus à personne.",
 "J'entends un petit « crac ». J'espère que c'est le plancher.","Pour un oiseau voyageur, je voyage beaucoup à pied, ces temps-ci."];
function wingTorn(){P.torn=true;P.stam=0;if(G.sim)return;unlock('a68');tone(140,.25,'sawtooth',.05,90);parts.push({type:'straw',x:P.x+P.w/2,y:P.y+10,vx:-40,vy:-60,life:0,max:.8,rot:0,vr:6,len:6});
  if(!G.tornSaid){G.tornSaid=true;G.tornT=G.t;say("L'aile tire sur ses coutures. Si je force encore, elle se décroche. Me poser, et attendre.",4)}
  else if(G.t-(G.tornT||0)>8&&rnd()<.6){G.tornT=G.t;say(pick(TORN_Q),3.6)}}
function winLevel(){if(G.sim){G.simWin=true;return}if(G.li===2)unlock('a56');G.state='exiting';G.exitT=0;SFX.win();loopsOff()}

/* ---------- scène d'ouverture : nuit d'orage, voleur, armoire, carton ---------- */
function cutFlash(v,thunder){G.flash=Math.max(G.flash,v);if(!G.sim)setTimeout(()=>SFX.thunder(thunder),thunder>1?120:600)}
function stepCut(dt){
  const C=G.cut,dg=domeGeom(L.dome),k=L.carton,A=L.armoire,th=C.thief,BD=L.backDoor;C.t+=dt;
  for(let i=0;i<C.flashes.length;i++)if(C.flashes[i]!==null&&C.t>=C.flashes[i]){C.flashes[i]=null;cutFlash(.75,.6)}
  if(C.blink>0)C.blink-=dt;
  const once=(key,cond,fn)=>{if(!C.ev[key]&&cond){C.ev[key]=1;fn()}};
  // le voleur
  th.t+=dt;
  if(th.state==='out'&&C.t>1.4){th.state='walk';th.t=0}
  if(th.state==='walk'){th.x-=200*dt;if(th.x<=A.x+58){th.x=A.x+58;th.state='open';th.t=0}}
  else if(th.state==='open'){A.door=Math.min(1,th.t*2.5);A.shake=Math.sin(th.t*30)*.03*Math.min(1,th.t*2);if(th.t>.9&&k.state==='hold'){k.state='fall';k.vx=-270;k.vy=-60;k.vr=-3;if(!G.sim)SFX.whistle()}if(th.t>1.5){th.state='oops';th.t=0;bubble(th.x,L.dome.floor-140,'!','#2a2420')}}
  else if(th.state==='oops'){A.shake*=.9;if(th.t>1.0){th.state='look';th.t=0}}
  else if(th.state==='look'){
    // il regarde la cloche, puis à droite, puis à gauche
    th.head=th.t<.7?1:th.t<1.3?-1:th.t<1.9?1:-1;th.f=-1;
    once('dots',th.t>.4,()=>bubble(th.x,L.dome.floor-140,'…','#2a2420'));
    if(th.t>2.5){th.state='sneak';th.t=0;th.head=1;bubble(th.x,L.dome.floor-140,'Ni vu, ni connu…','#2a2420')}}
  else if(th.state==='sneak'){
    th.x-=62*dt;th.f=-1;
    // coups d'œil par-dessus l'épaule
    const c=th.t%1.6;th.head=c>1.1&&c<1.45?-1:1;
    if(th.x<=BD.x+40){BD.open=Math.min(1,BD.open+dt*3)}
    if(th.x<=BD.x+4){th.state='exit';th.t=0;if(!G.sim)SFX.squeak()}}
  else if(th.state==='exit'){th.x-=50*dt;th.alpha=Math.max(0,1-th.t*2.2);if(th.t>.6){BD.open=Math.max(0,BD.open-dt*2.5)}if(th.t>1.1&&BD.open<=0){th.state='gone';th.t=0;if(!G.sim)SFX.land()}}
  else if(th.state==='gone'){}
  // le carton
  if(k.state==='fall'){k.vy+=2600*dt;k.x+=k.vx*dt;k.y+=k.vy*dt;k.rot+=k.vr*dt;
    if(k.y+20>=dg.domeTop&&Math.abs(k.x-L.dome.x)<60){
      k.state='fly';k.vx=-160;k.vy=-300;k.vr=-6;L.dome.broken=true;if(!G.sim)SFX.crash();G.shake=18;
      for(let i=0;i<46;i++){const a=-Math.PI*rnd(),s=120+rnd()*380;parts.push({type:'glass',x:L.dome.x+(rnd()-.5)*50,y:dg.domeTop+30+rnd()*40,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:0,max:40,rot:rnd()*6,vr:(rnd()-.5)*20,sz:2+rnd()*5,floor:L.dome.floor-2})}
      C.ray='fly';P.vx=120;P.vy=-430;
    }else if(k.y+20>=L.dome.floor){k.y=L.dome.floor-20;k.state='rest'}}
  if(k.state==='fly'){k.vy+=2600*dt;k.x+=k.vx*dt;k.y+=k.vy*dt;k.rot+=k.vr*dt;if(k.x<L.dome.x-120){k.x=L.dome.x-120;k.vx=-k.vx*.3}
    if(k.y+20>=L.dome.floor){k.y=L.dome.floor-20;k.state='rest';k.rot=-.1;if(!G.sim)SFX.land();G.shake=6}}
  // Raymond : immobile tant que le voleur est là, se réveille pendant sa fuite
  if(C.ray==='fly'){P.vy+=GRAV*dt;moveX(P,P.vx*dt);P.onGround=false;moveY(P,P.vy*dt);P.spin+=dt*13;
    if(P.onGround){C.ray='lie';C.lieT=0;P.vx=0;P.spin=Math.PI;if(!G.sim)SFX.land();puff(P.x+P.w/2,P.y+P.h,12,true)}}
  else if(C.ray==='lie'){C.lieT+=dt;
    const sneaking=th.state==='sneak'||th.state==='exit'||th.state==='gone';
    once('w1',sneaking&&th.t>1.2&&th.state==='sneak',()=>{cutFlash(.7,.7);C.blink=.15;P.sx=1.06;P.sy=.94});
    once('w2',(th.state==='sneak'&&th.t>3.3)||th.state==='exit'||th.state==='gone',()=>{cutFlash(.8,.85);C.blink=1.1;bubble(P.x+P.w/2,P.y-14,'Rrrou… ?','#6a5a48')});
    if(th.state==='gone'&&th.t>1.0)once('w3',true,()=>{cutFlash(1,1.2);jolt()});
  }
  else if(C.ray==='jolt'){C.jt+=dt;P.spin=Math.PI*(1+Math.min(1,C.jt/.35));if(C.jt>.35)P.spin=0;
    if(C.jt>1.0&&!C.b2){C.b2=1;bubble(P.x+P.w/2,P.y-14,'Tous aux abris !','#a8322d')}
    if(C.jt>2.6&&!C.b3){C.b3=1;P.facing=1;bubble(P.x+P.w/2,P.y-14,'Matricule 7413, au rapport !','#a8322d')}
    if(C.jt>4.4)endCut()}
}
function jolt(){const C=G.cut;if(!C)return;if(C.ray!=='lie'){C.ray='lie';P.spin=Math.PI}C.ray='jolt';C.jt=0;P.vy=-200;bubble(P.x+P.w/2,P.y-14,'Tir de barrage !','#a8322d')}
function endCut(){G.cut=null;G.cutSeen=true;P.spin=0;P.cp={x:L.spawn.x,y:L.spawn.y};say(L.def.start,5)}
function skipCut(){
  L.dome.broken=true;if(L.backDoor)L.backDoor.open=0;L.carton={x:L.dome.x-62,y:L.dome.floor-20,rot:-.1,state:'rest'};L.armoire.door=1;L.armoire.shake=0;
  P.x=L.dome.x+60-P.w/2;P.y=L.dome.floor-P.h;P.vx=P.vy=0;endCut();
}

/* ---------- mise à jour du jeu ---------- */
const TOMB_LINES=["Vasseur… Marguerite. 1897 – 1989. Elle a vécu jusqu'à quatre-vingt-douze ans.",
  "Mariée au fils Garnier. Toute une vie sans jamais recevoir la lettre. Sans savoir.",
  "J'ai une lettre pour elle. Le règlement ne prévoit pas les tombes. Tant pis pour le règlement."];
function stepTomb(dt){
  const S2=G.tombSeq;S2.t+=dt;P.vx=0;P.vy=Math.min(MAXFALL,P.vy+GRAV*dt);P.onGround=false;moveY(P,P.vy*dt);
  const lines=L.def.exitLines||TOMB_LINES,k=Math.floor(S2.t/4.2);
  if(k!==S2.i&&k<lines.length){S2.i=k;const ln=lines[k];if(Array.isArray(ln))say(ln[1],4.1,ln[0]);else say(ln,4.1)}
  if(S2.t>4.2*lines.length+.3){G.tombSeq=null;G.quip=null;winLevel()}
}
function stepPlay(dt){
  if(G.tombSeq){stepTomb(dt);return}
  G.lt+=dt;
  for(const m of L.movers){
    if(m.axis==='s'||m.axis==='p'){mechMoverStep(m,dt);continue}
    if(m.axis==='g')continue;   // véhicules de la gare : déplacés par gareStep
    const px=m.x,py=m.y;m.t+=dt;const span=Math.abs(m.a1-m.a0)||1;
    let u=(m.t*m.speed/span)%2;u=u>1?2-u:u;u=u*u*(3-2*u);
    if(m.axis==='h')m.x=m.a0+(m.a1-m.a0)*u;else m.y=m.a0+(m.a1-m.a0)*u;
    m.dx=m.x-px;m.dy=m.y-py;
  }
  const pcx=P.x+P.w/2,pcy=P.y+P.h/2;
  // volants : trajets réguliers, toujours identiques
  for(const m of L.moths){
    m.t+=dt;const px=m.x;
    if(m.axis==='h'){m.x=m.cx+Math.sin(m.t*m.sp)*m.amp;m.y=m.cy+Math.sin(m.t*m.sp*2)*10}
    else{m.x=m.cx+Math.sin(m.t*m.sp*2)*8;m.y=m.cy+Math.sin(m.t*m.sp)*m.amp}
    if(m.kind==='crow'){
      // le corbeau hésite (vol irrégulier) et se laisse attirer par le pigeon quand il passe près
      m.x+=Math.sin(m.t*1.3+m.cx)*26+Math.sin(m.t*2.9+m.cy)*12;m.y+=Math.cos(m.t*1.7+m.cx)*16+Math.sin(m.t*3.7)*6;
      const near=!P.dead&&!G.cut&&Math.hypot(pcx-m.x,pcy-m.y)<240;m.att=clamp((m.att||0)+(near?dt*1.1:-dt*.7),0,1);
      const k=m.att*m.att*.6;m.x+=(pcx-m.x)*k;m.y+=(pcy-8-m.y)*k;
    }
    m.dir=m.x>=px?1:-1;
    m.near=!P.dead&&!G.cut&&Math.hypot(pcx-m.x,pcy-m.y)<200;
  }
  for(const c of L.rats){
    c.t+=dt;c.vy=Math.min(MAXFALL,c.vy+GRAV*dt);
    if(c.kind==='boar'){
      // le sanglier voit Raymond sur SA plateforme : il charge, et ses marcassins sortent de derrière lui
      const dx=pcx-(c.x+c.w/2),dir=Math.sign(c.vx)||1;
      const same=!P.dead&&!G.cut&&P.onGround&&Math.abs((P.y+P.h)-(c.y+c.h))<8&&samePlatform(c.x+c.w/2,pcx,Math.floor((c.y+c.h-2)/T));
      if(same&&Math.abs(dx)<420&&(Math.sign(dx)===dir||Math.abs(dx)<300)){if(Math.sign(dx)!==dir){c.vx=-c.vx}if(!(c.charge>0)&&!G.sim)SFX.grunt();c.charge=1.6;
        if(!c.spawned){c.spawned=true;for(let k=0;k<2;k++)L.rats.push({kind:'piglet',chase:true,x:c.x+c.w/2-dir*(18+k*16),y:c.y+c.h-12,w:22,h:12,vx:0,vy:-200-k*80,onGround:false,t:k,sq:1,delay:.35+k*.3,base:230});if(!G.sim&&!G.boarSaid){G.boarSaid=true;say("Des marcassins ! Ils me prennent pour un gland. Un gland décoré.",3.4)}}}
      c.charge=Math.max(0,(c.charge||0)-dt);
      const d2=Math.sign(c.vx)||1;c.vx=d2*(c.base||95)*(c.charge>0?2:1);
    }
    if(c.runner){
      c.vx=c.dir*(c.base||230);const blocked=moveX(c,c.vx*dt);c.onGround=false;moveY(c,c.vy*dt);
      if(blocked||c.y>ROWS*T||c.x<cam.x-160||c.x>cam.x+W+160)c.dead=true;
      continue;
    }
    if(c.chase){
      // marcassin lancé : il fonce vers Raymond, sans voir les trous
      c.delay=(c.delay||0)-dt;const d=Math.sign(pcx-(c.x+c.w/2))||1;c.vx=c.delay>0?0:d*230;
      moveX(c,c.vx*dt);c.onGround=false;moveY(c,c.vy*dt);
      const ch=tile(Math.floor((c.x+c.w/2)/T),Math.floor((c.y+c.h-2)/T));
      if(c.y>ROWS*T||ch==='^'){c.dead=true;if(!G.sim&&ch==='^')puff(c.x+c.w/2,c.y,6,false)}
      continue;
    }
    if(c.kind==='rat'){
      // le rat voit le pigeon devant lui : il fonce
      const dx=pcx-(c.x+c.w/2),dy=Math.abs(pcy-(c.y+c.h/2)),dir=Math.sign(c.vx)||1;
      const sees=!P.dead&&!G.cut&&dy<70&&Math.abs(dx)<320&&Math.sign(dx)===dir;
      // il voit le pigeon : un sprint d'une seconde, puis il se calme (et ne repart pas tout de suite)
      c.cool=Math.max(0,(c.cool||0)-dt);c.alert=Math.max(0,(c.alert||0)-dt);
      if(sees&&c.cool<=0){c.alert=1.1;c.cool=4;if(!G.sim)SFX.squeak()}
      c.vx=dir*(c.base||95)*(c.alert>0?2.2:1);
    }
    const spd=Math.abs(c.vx)||95;
    if(moveX(c,c.vx*dt))c.vx=-(c.lastDir||1)*spd;
    c.lastDir=Math.sign(c.vx)||c.lastDir||1;
    c.onGround=false;moveY(c,c.vy*dt);
    if(c.onGround){
      const dir=Math.sign(c.vx)||1,fx=dir>0?c.x+c.w+2:c.x-2,cf=Math.floor(fx/T),rf=Math.floor((c.y+c.h-2)/T);
      // un sanglier qui charge ne regarde pas où il met les pattes (option boarsFall)
      const blind=c.kind==='boar'&&c.charge>0&&!groundAt(cf,rf+1);
      if(!blind&&(!groundAt(cf,rf+1)||tile(cf,rf)==='^'||L.mark.has(cf+','+rf))){c.vx=-c.vx;c.lastDir=Math.sign(c.vx)}
    }
  }
  for(const c of L.rats){if(c.dead||c.runner)continue;const ch=tile(Math.floor((c.x+c.w/2)/T),Math.floor((c.y+c.h-2)/T));if(c.y>ROWS*T+40||ch==='^'){c.dead=true;if(!G.sim&&ch==='^'){puff(c.x+c.w/2,c.y,8,false);if(L.th.spike==='obus')obusBoom(c.x+c.w/2,c.y+c.h)}}}
  if(L.rats.some(c=>c.dead))L.rats=L.rats.filter(c=>!c.dead);
  for(const b of L.bolts){const cyc=(G.lt+b.ph)%BOLT_PERIOD;const st=cyc>=2.6&&cyc<2.85?'strike':cyc>=1.6?'warn':'idle';if(st==='strike'&&b.state!=='strike'&&!G.sim){SFX.zap();G.flash=Math.max(G.flash,.7);setTimeout(()=>SFX.thunder(.5),150)}b.state=st}
  mechStep(dt,pcx,pcy);meuseStep(dt);zrStep(dt);museeStep(dt);trainStep(dt);gareStep(dt);langletStep(dt);facadeStep(dt);a4Step(dt);aireStep(dt);actStep(dt);marbleStep(dt);mineStep(dt);grenadeStep(dt);hunterStep(dt);moleStep(dt);
  const K=L.chaser;
  if(K)stepChaser(K,dt,pcx,pcy);
  if(G.cut){stepCut(dt);return}
  if(P.dead){P.deadT-=dt;if(P.deadT<=0){if(G.gameOverPending){G.gameOverPending=false;gameOver();return}respawn()}return}
  if(P.wake>0){P.wake-=dt;P.vy+=GRAV*dt;P.onGround=false;moveY(P,P.vy*dt);return}
  if(P.onMover){const m=P.onMover;moveX(P,m.dx);P.y=m.y-P.h}
  const left=keys.has('left'),right=keys.has('right'),held=keys.has('jump');
  // immobile une minute : Raymond s'endort
  if(!left&&!right&&!held&&P.onGround&&!G.sim){P.idle=(P.idle||0)+dt;if(P.idle>60){unlock('a82');if(((P.idle-60)%2.6)<dt)bubble(P.x+P.w/2+14,P.y-10,'Zzz','#6a5a48')}}else P.idle=0;
  if(S.run.wasLow&&(S.run.wear||0)===0){S.run.wasLow=false;unlock('a24')}
  const MD=mechMods();
  if(S.infinite){P.stam=STAM_MAX;P.torn=false;P.mudCoat=0;MD.noFly=false}
  const dir=MD.noInput?0:(right?1:0)-(left?1:0);
  if(dir)P.facing=dir;
  if(dir){P.vx+=dir*(P.onGround?ACC:AIRACC)*dt;P.vx=clamp(P.vx,-MD.run,MD.run)}
  else{const f=(P.onGround?FRIC:FRIC*.35)*dt;P.vx=Math.abs(P.vx)<=f?0:P.vx-Math.sign(P.vx)*f}
  P.coyote=P.onGround?.1:P.coyote-dt;P.jumpBuf-=dt;
  if(P.jumpBuf>0&&!MD.noInput){
    if(P.coyote>0){P.vy=-MD.jump;P.coyote=0;P.jumpBuf=0;P.onGround=false;P.onMover=null;P.jumping=true;P.sx=.82;P.sy=1.2;SFX.jump()}
    else if(P.flaps<MAXFLAPS&&!P.torn&&!MD.noFly&&P.stam>=STAM_FLAP){P.vy=-FLAPV;P.flaps++;P.stam-=STAM_FLAP;P.jumpBuf=0;P.flapT=.3;P.jumping=false;SFX.flap();puff(P.x+P.w/2-P.facing*8,P.y+12,3,false);if(P.stam<=0)wingTorn()}
    else if(P.flaps<MAXFLAPS&&!G.sim){P.jumpBuf=0;P.strain=.5;tone(160,.08,'triangle',.05)}
  }
  if(P.jumping&&!held&&P.vy<0){P.vy*=.5;P.jumping=false}
  P.vy+=GRAV*dt;
  P.gliding=held&&P.vy>0&&!P.onGround&&!P.torn&&!MD.noFly&&P.stam>0;
  if(P.gliding){P.vy=Math.min(P.vy,GLIDE);P.stam-=STAM_GLIDE*dt;if(P.stam<=0){P.stam=0;wingTorn()}}
  if(P.onGround&&!(P.mudCoat>0)){P.stam=Math.min(STAM_MAX,P.stam+STAM_REGEN*dt);if(P.torn&&P.stam>=STAM_RESUME)P.torn=false}
  if(P.strain>0)P.strain-=dt;
  // courants d'air ascendants
  P.lift=0;
  if(!P.onGround)for(const u of L.updrafts)if(P.x+P.w>u.x+4&&P.x<u.x+u.w-4&&P.y+P.h<=u.bottom+6&&P.y>-200){P.vy-=(held?3600:2700)*dt;if(P.vy<-330)P.vy=-330;P.lift=1;P.flaps=Math.min(P.flaps,1)}
  if(P.vy>MAXFALL)P.vy=MAXFALL;
  if(P.flapT>0)P.flapT-=dt;
  moveX(P,P.vx*dt);
  const wasG=P.onGround,vyBefore=P.vy,prevB=P.y+P.h;
  P.onGround=false;P.onMover=null;
  moveY(P,P.vy*dt);
  if(P.y<0){P.y=0;if(P.vy<0)P.vy=0}
  if(P.vy>=0&&!P.onGround){
    for(const m of L.movers){const b=P.y+P.h;if(P.x+P.w>m.x+2&&P.x<m.x+(m.kind==='truck'?m.w-40:m.w)-2&&prevB<=m.y+Math.max(0,-m.dy)+1.5&&b>=m.y){P.y=m.y-P.h;P.vy=0;P.onGround=true;P.onMover=m;break}}
  }
  if(P.onGround){P.flaps=0;P.jumping=false;if(!wasG&&vyBefore>280){P.sx=1.2;P.sy=.8;SFX.land();for(let i=0;i<5;i++)parts.push({type:'dust',x:P.x+P.w/2+(rnd()-.5)*20,y:P.y+P.h,vx:(rnd()-.5)*80,vy:-rnd()*40,life:0,max:.5})}}
  {const mk=mechAfterMove(dt,vyBefore);if(mk)return die(mk)}
  if(P.carried)return;   // emporté par un pylône : rien d'autre ne le touche en route
  if(P.hideIn){P.sx=P.sy=1;return}   // dans un placard : rien ne touche Raymond
  P.sx=lerp(P.sx,1,Math.min(1,dt*12));P.sy=lerp(P.sy,1,Math.min(1,dt*12));
  const hb={x:P.x+3,y:P.y+4,w:P.w-6,h:P.h-6};
  const c0=Math.floor(hb.x/T),c1=Math.floor((hb.x+hb.w)/T),r0=Math.floor(hb.y/T),r1=Math.floor((hb.y+hb.h)/T);
  const hit=[];
  for(let r=r0;r<=r1;r++)for(let c=c0;c<=c1;c++){const ch=tile(c,r);
    if(ch==='^'&&overlap(hb,{x:c*T+5,y:r*T+T*.42,w:T-10,h:T*.58}))hit.push([c,r]);
    if(ch==='v'&&overlap(hb,{x:c*T+5,y:r*T,w:T-10,h:T*.58}))hit.push([c,r]);}
  if(hit.length){const up=hit.filter(([c,r])=>tile(c,r)==='^');let best=null,bd=1e9;for(const[c,r]of up){const d=Math.abs((c+.5)*T-(P.x+P.w/2));if(d<bd){bd=d;best=[c,r]}}return die(L.th.spike,best?[best]:[])}
  for(const c of L.rats)if(overlap(hb,{x:c.x+3,y:c.y+3,w:c.w-6,h:c.h-3}))return die(c.kind);
  for(const m of L.moths)if(overlap(hb,{x:m.x-10,y:m.y-8,w:20,h:16}))return die(m.kind);
  for(const b of L.bolts)if(b.state==='strike'&&Math.abs(b.x-pcx)<24)return die('bolt');
  {const mh=mechHit(hb);if(mh)return die(mh)}
  if(K&&K.state!=='sleep'&&K.state!=='wake'&&K.state!=='burn'&&K.state!=='dead'&&K.state!=='lure'&&K.state!=='gone'&&overlap(hb,{x:K.x+6,y:K.y+5,w:K.w-12,h:K.h-6}))return die(K.type);
  if(P.y>ROWS*T+40)return die(L.th.horizon==='bridge'?'drown':'fall');
  const pc={x:pcx,y:P.y+P.h/2};
  for(const k of L.corn)if(!k.taken&&Math.abs(k.x-pc.x)<20&&Math.abs(k.y-pc.y)<22){k.taken=true;G.corn++;{const gt=gotOf(G.li),ix=L.corn.indexOf(k);if(!gt.c.includes(ix))gt.c.push(ix)}SFX.straw();parts.push({type:'spark',x:k.x,y:k.y,life:0,max:.4});
    if((S.run.wear||0)>0){S.run.wear--;save();P.sx=1.15;P.sy=1.15;puff(pc.x,pc.y,6,true);if(!G.tuftSaid){G.tuftSaid=true;say(pick(TUFT_Q),3.4)}}}
  if(L.medal&&!L.medal.taken&&Math.abs(L.medal.x-pc.x)<22&&Math.abs(L.medal.y-pc.y)<24){L.medal.taken=true;G.medal=true;gotOf(G.li).m=true;SFX.medal();if(!S.run.medals[G.li]&&!S.infinite){S.run.medals[G.li]=true;S.run.lives++;save();say(pick(MEDAL_Q)+' (Une vie de plus.)',4.2)}else say(pick(MEDAL_Q),3.6)}
  for(const cp of L.cps)if(!cp.on&&Math.abs(cp.x-pc.x)<22&&Math.abs(cp.y-P.y-P.h)<60){cp.on=true;P.cp={x:cp.x,y:cp.y};SFX.check()}
  for(const q of L.quips)if(!q.fired&&pc.x>q.x){q.fired=true;say(L.def.quips[q.i],4.4)}
  // un cartel s'affiche trois secondes ; pour le relire, il faut s'en éloigner puis revenir
  let hn=-1;for(const h of L.hints)if(Math.abs(h.x-pc.x)<90&&Math.abs(h.y-(P.y+P.h))<120)hn=h.i;
  // un cartel s'affiche 3 s pleines, même si on s'en éloigne
  if(hn!==G.hintNear){G.hintNear=hn;G.hintT=0;if(hn>=0){G.hintShow=hn;G.hintShowT=0}}G.hintT=(G.hintT||0)+dt;G.hintShowT=(G.hintShowT||0)+dt;G.hintI=G.hintShow!=null&&G.hintShow>=0&&G.hintShowT<3?G.hintShow:-1;
  if(K&&K.state==='sleep'&&(K.type==='guardnet'?guardnetNear(K,pc.x):pc.x>L.triggerX+T))wakeChaser(K);
  if(L.auto&&!L.auto.on&&pc.x>L.triggerX+T){L.auto.on=true;L.auto.x=cam.x;G.chase=true;setSong('chase');if(L.def.chaseQuip)say(L.def.chaseQuip,3.6)}
  if(L.exit&&!L.def.exitByAct&&(!L.def.exitGround||P.onGround)&&trainExitOk()&&overlap(hb,L.exit)){if((L.def.exit==='tomb'||L.def.exitLines)&&!G.sim){if(!G.tombSeq){G.tombSeq={t:0,i:-1};P.vx=0;P.facing=1}}else winLevel()}
}
function wakeChaser(K){
  G.chase=true;setSong('chase');
  if(K.type==='cat'){K.state='wake';K.wakeT=.9;K.meowT=2.4;if(!G.sim){SFX.hiss();setTimeout(()=>meow(1),250)}say("Bijou est réveillé. Règlement, article 3 : en cas de chat, courir.",3.4)}
  else if(K.type==='guardnet'){K.state='wake';K.wakeT=1.1;if(!G.sim)SFX.whistle();bubble(K.x+K.w/2,K.y-16,'Un papillon ! Un gros !','#2a3a5a');say(L.def.chaseQuip||'',3.6)}
  else if(K.type==='sweeper'){K.state='wake';K.wakeT=.8;if(!G.sim)SFX.honk();say(L.def.chaseQuip||'',3.6)}
  else if(K.type==='bigrat'){K.state='wake';K.wakeT=.8;if(!G.sim){noise(.35,1400,.18,'bandpass');tone(180,.25,'sawtooth',.05)}say(L.def.chaseQuip||'',3.8)}
  else if(K.type==='buse'){K.state='hover';K.pt=-2.2;if(!G.sim)SFX.screech();sayQueue(L.def.chaseLines||[['RAYMOND',L.def.chaseQuip||'',3.6]])}
  else{K.state='chase';K.pt=0;K.meowT=1.5;say(L.def.chaseQuip||'',3.6)}
}
function stepChaser(K,dt,pcx,pcy){
  K.t+=dt;
  if(K.type==='guardnet'||K.type==='sweeper'){stepGroundChaser(K,dt,pcx,pcy);return}
  if(K.type==='bigrat'&&(K.state==='gone'||K.state==='dead')){if(K.state==='gone'){K.x-=380*dt;K.f=-1;if(K.x<cam.x-200)K.state='dead'}return}
  if(K.type==='bigrat'&&K.state==='chase'&&L.def.chaseEnd&&pcx>L.def.chaseEnd){K.state='gone';G.chase=false;setSong(songKey(G.li));if(!G.sim)say(L.def.chaseEndQuip||'',3.8);return}
  if(K.type==='cat'||K.type==='bigrat'){
    if(K.state==='wake'){K.wakeT-=dt;if(K.wakeT<=0)K.state='chase'}
    if(K.state!=='chase')return;
    const dist=pcx-(K.x+K.w/2),dir=Math.sign(dist)||1;
    const sp=K.type==='bigrat'?clamp(272+(Math.abs(dist)-260)*.35,272,340):clamp(205+(Math.abs(dist)-160)*.25,205,300);
    K.leapT=(K.leapT||0)-dt;if(!(K.leapT>0&&!K.onGround))K.vx=lerp(K.vx,dir*sp,Math.min(1,dt*6));K.f=dir;
    K.vy=Math.min(MAXFALL,K.vy+GRAV*dt);
    moveX(K,K.vx*dt);K.onGround=false;moveY(K,K.vy*dt);
    if(K.onGround){
      const fx=dir>0?K.x+K.w+6:K.x-6,cf=Math.floor(fx/T),rf=Math.floor((K.y+K.h-2)/T);
      const la=dir>0?K.x+K.w+34:K.x-34,cl=Math.floor(la/T);
      const blocked=isSolid(cf,rf)||isSolid(cf,rf-1),gap=!groundAt(cl,rf+1)&&!isSolid(cl,rf),pins=tile(cl,rf)==='^'||tile(cf,rf)==='^',above=P.y+P.h<K.y-20&&Math.abs(dist)<110;
      if(blocked||gap||pins||above)chaserLeap(K,dir,rf,K.type==='bigrat'?(above?960:880):undefined);
    }
    if(K.y>ROWS*T+60)chaserReenter(K);
    return;
  }
  if(K.state==='sleep'){K.y=K.home.y+Math.sin(K.t*2)*4;return}
  if(K.type==='buse'&&buseBurn(K,dt))return;
  if(K.type==='drone'){droneStep(K,dt,pcx,pcy);return}
  // buse : plane derrière, prévient, puis pique
  K.pt+=dt;
  if(K.state==='hover'){
    const tx=pcx-170*P.facing-K.w/2,ty=Math.max(-20,P.y-140),dx=tx-K.x,dy=ty-K.y,d=Math.hypot(dx,dy)||1,sp=Math.min(330,d*3);
    K.x+=dx/d*sp*dt;K.y+=dy/d*sp*dt;K.f=pcx>K.x?1:-1;
    if(K.pt>3.0&&!P.dead){K.state='warn';K.pt=0;if(!G.sim)SFX.screech();}
  }else if(K.state==='warn'){K.y-=40*dt;if(K.pt>.6){K.state='dive';K.pt=0;const dx=pcx-(K.x+K.w/2),dy=pcy-(K.y+K.h/2),d=Math.hypot(dx,dy)||1;K.vx=dx/d*520;K.vy=dy/d*520;K.f=K.vx>=0?1:-1}}
  else if(K.state==='dive'){K.x+=K.vx*dt;K.y+=K.vy*dt;if(K.pt>.9||K.y>ROWS*T-60){K.state='hover';K.pt=0}}
}
function respawn(){
  resetPlayer();P.wake=.35;if(L.gare)gareRespawn();if(L.train)trainRespawn();if(L.lg)langletRespawn();if(L.fc)facadeRespawn();if(L.a4)a4Respawn();if(L.aire)aireRespawn();
  const K=L.chaser;
  if(K){
    if(K.state==='dead'){}
    else if(K.type==='cat'||P.cp.x<L.triggerX){K.state='sleep';K.x=K.home.x;K.y=K.home.y;K.vx=K.vy=0;G.chase=false;setSong(songKey(G.li))}
    else if(K.type==='guardnet'||K.type==='sweeper'||K.type==='bigrat'){K.x=P.x-(K.type==='sweeper'?520:440);K.y=P.y+P.h-K.h;K.vx=K.vy=0;K.state='chase'}
    else{K.x=P.x-460;K.y=P.y-220;K.state=K.type==='buse'?'hover':'chase';K.pt=0}
  }
  if(L.auto&&L.auto.on){L.auto.x=Math.max(0,P.x-300);cam.x=L.auto.x}
  P.stun=0;P.mud=0;actRespawn();
  parts.push({type:'ring',x:P.x+P.w/2,y:P.y+P.h/2,life:0,max:.4});
}
function gameOver(){
  // Raymond a perdu la tête : une vie le ramène au début de la mission, sinon tout recommence
  loopsOff();G.chase=false;
  const w=LEVELS[G.li].w,first=w*4,hasLife=S.run.lives>0;
  unlock('a49');S.run.headLost=true;if(!hasLife)unlock('a50');
  if(hasLife){S.run.lives--;S.run.wear=0;save()}
  const tail=hasLife
    ?{t:`Un empailleur de passage lui recoud la tête, un peu de travers.\n${S.run.lives?`Il reste ${S.run.lives} vie${S.run.lives>1?'s':''}.`:'Plus de vie en réserve : la prochaine fois sera la dernière.'} Retour au début de la mission : ${WORLDS[w].name}.`}
    :{title:"PLUS AUCUNE VIE",t:"Le règlement est formel : tout recommencer depuis le début.\nDepuis la remise de Vittoncourt."};
  G.state='intro';G.cards=GAMEOVER.concat([tail]);G.card=0;G.cardT=0;G.fade=1;
  G.cardsDone=hasLife?()=>{G.cutSeen=true;startLevel(first)}:()=>{newRun();S.unlocked=0;save();startIntro()};
  setSong('s5-4');
}
/* sons des bêtes et ambiances, une fois par image */
const WALK_CRY={rat:['kwik !',()=>SFX.squeak()],boar:[null,()=>SFX.grunt()],piglet:[null,()=>SFX.grunt(true)],pigeon:['rou-rou',()=>SFX.coo()],hedgehog:['snif snif',()=>noise(.08,3000,.12,'bandpass',0,3)],goose:['KWAAK !',()=>SFX.honk()]};
const FLY_CRY={crow:['KRA !',()=>SFX.caw()],gull:['KYAA',()=>tone(1500,.3,'sawtooth',.06,900)],bag:['frrt',()=>SFX.bag()],wasp:['bzzz',()=>SFX.buzz()],bat:['tsiii',()=>tone(4200,.12,'sine',.05,3600)],moth:[null,()=>SFX.flutter()]};
function animalSounds(dt){
  const pcx=P.x+P.w/2,pcy=P.y+P.h/2;
  for(const c of L.rats){c.sq-=dt;const d=Math.hypot(c.x-pcx,c.y-pcy);if(d<420&&c.sq<=0){const cr=WALK_CRY[c.kind];if(cr)cr[1]();c.sq=2.2+rnd()*2.6}}
  for(const m of L.moths){m.fl-=dt;if(m.near&&m.fl<=0){const cr=FLY_CRY[m.kind];if(cr)cr[1]();m.fl=m.kind==='moth'?.32:1.6+rnd()}}
  for(const b of L.bells){b.ring=Math.max(0,b.ring-dt*.5);b.ph+=dt;if(Math.abs(b.x-pcx)<420&&b.ring<=0&&rnd()<dt*.25){SFX.bell();b.ring=1}}
  const K=L.chaser,th=L.th;
  if(K){
    const d=Math.hypot(K.x+K.w/2-pcx,K.y-pcy);
    if(K.type==='cat'){
      if(K.state==='sleep'){loopSet('purr',clamp(1-d/420,0,1)*.5*(.7+.3*Math.sin(G.t*2.2)));K.rrT-=dt;if(d<260&&K.rrT<=0){bubble(K.home.x+K.w/2+20,K.home.y-6,'rrrr…','#c7742e');K.rrT=1.8}}
      else loopSet('purr',0);
      if(K.state==='chase'&&!P.dead){K.meowT-=dt;if(K.meowT<=0){if(rnd()<.3)SFX.hiss();else meow(.8);K.meowT=2+rnd()*1.6}}
    }else if(K.type==='drone')loopSet('drone',K.state==='chase'?clamp(1-d/700,.05,1)*.2:K.state==='lure'?clamp(1-d/1100,0,1)*.24:0);
  }
  const rain=0; // son de pluie retiré à la demande : seule la pluie visuelle reste
  loopSet('rain',rain);if(L.train){if(L.gust&&L.gust.state==='blow'&&trainOnRoof())loopSet('wind',.24)}else loopSet('wind',L.def.gust&&L.gust&&L.gust.state==='blow'?.2:th.weather==='wind'||th.weather==='gale'?.06:th.weather==='storm'?.1:0);
  // éclairs d'orage
  if(th.weather==='storm'||th.weather==='rain'||th.far==='storage'){G.flashT-=dt;if(G.flashT<=0){G.flash=th.weather==='storm'?1:.7;const v=th.weather==='storm'?1:.6;setTimeout(()=>SFX.thunder(v),300+rnd()*700);G.flashT=th.weather==='storm'?3.5+rnd()*3.5:9+rnd()*7}}
}
function updateParticles(dt){
  for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.life+=dt;if(p.life>=p.max){parts.splice(i,1);continue}
    if(p.type==='straw'||p.type==='feather'){p.vy+=(p.type==='feather'?300:900)*dt;p.vx*=1-dt*(p.type==='feather'?3:1.2);if(p.type==='feather')p.vy=Math.min(p.vy,60);p.x+=p.vx*dt;p.y+=p.vy*dt;p.rot+=p.vr*dt}
    else if(p.type==='dust'){p.x+=p.vx*dt;p.y+=p.vy*dt}
    else if(p.type==='drop'){p.vy+=1500*dt;p.x+=p.vx*dt;p.y+=p.vy*dt}
    else if(p.type==='tuftpop'){}
    else if(p.type==='glass'){if(!p.rest){p.vy+=1800*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.rot+=p.vr*dt;if(p.y>=p.floor-2){p.y=p.floor-2;if(Math.abs(p.vy)<120){p.rest=true}else{p.vy*=-.3;p.vx*=.5;p.vr*=.5}}}}}
  for(let i=G.bubbles.length-1;i>=0;i--){const b=G.bubbles[i];b.t+=dt;if(b.t>b.max)G.bubbles.splice(i,1)}
  G.flash=Math.max(0,G.flash-dt*2.4);
}
function updateCamera(dt){
  if(P.carried)return;   // emporté par un pylône : la caméra reste où elle est
  let tx=clamp(P.x+P.w/2-W/2+P.facing*70,0,L.wpx-W);
  // vertical : la caméra suit le dernier sol touché, pas les sauts (on ne voit pas ce qui est au-dessus en sautant)
  if(P.onGround||P.lastGY==null)P.lastGY=P.y;
  if(L.auto&&L.auto.on){tx=Math.max(L.auto.x,Math.min(tx,L.auto.x+120));cam.x=Math.max(cam.x,L.auto.x)}
  if(L.camZone){const z=L.camZone(P.x+P.w/2);if(z)tx=clamp(tx,z[0],z[1]-W)}
  let ty=P.lastGY-H*(L.def.camYAt?L.def.camYAt(P.x):(L.def.camY||.5));
  if(P.y-ty<40)ty=P.y-40;if(P.y+P.h-ty>H-50)ty=P.y+P.h-H+50;
  if(P.ride)ty=P.y-H*.42;
  ty=clamp(ty,0,ROWS*T-H);
  const k=1-Math.exp(-dt*5);cam.x+=(tx-cam.x)*k;cam.y+=(ty-cam.y)*k;
}
