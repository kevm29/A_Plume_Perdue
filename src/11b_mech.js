/* =========================================================
   MÉCANIQUES PROPRES AUX MISSIONS
   ---------------------------------------------------------
   Caractères de niveau supplémentaires :
   ~ boue (on s'enfonce si on reste immobile)   % sol qui s'effondre
   & cachette (drap sur un meuble)              G gardien de nuit (ronde entre deux |)
   Y chat aux yeux brillants (1, 2, 3, soleil)  H gardien au filet (poursuite)
   A auvent rebondissant                        J volet (plateforme qui s'ouvre et se ferme)
   O gargouille (jet d'eau régulier)            L tramway (plateforme mobile, entre deux |)
   $ cheval de bois (monte et descend)          a ballon (rebondit)
   I cloche qui se balance                      F braséro (la buse y prend feu)
   P balayeuse municipale (poursuite)           + coquelicots (sol ferme dans le brouillard)
   Options de niveau : dark {base,period}, fog, gust {period,dur,push,dir}, auto {speed}
   ========================================================= */
function mechInit(L){
  Object.assign(L,{mines:[],guards:[],covers:[],watchers:[],crumbles:[],shutters:[],gargoyles:[],fires:[],poppies:[],bellsM:[],auto:null,darkNow:null,gust:{state:'calm',t:0}});
}
function mechParse(L,ch,c,r,x,y,cx,cy,movers){
  const def=L.def;
  switch(ch){
    case'&':L.covers.push({x:x-8,y:y-T,w:T+16,h:2*T,kind:(c*7+r)%5});return true;
    case'G':{const g={x:cx-12,y:y+T-60,w:24,h:60,r,c,dir:1,speed:84,pause:0,look:0,t:c*.3,a0:null,a1:null,sees:false};L.guards.push(g);return true}
    case'Y':L.watchers.push({x:cx,y:y+T,t:0,state:'closed',open:0,mode:'sit',seen:false});L.avoid.push(cx);return true;
    case'H':L.triggerX=Math.min(L.triggerX,cx);L.chaser={type:'guardnet',home:{x:cx-14,y:y+T-60},x:cx-14,y:y+T-60,w:28,h:60,vx:0,vy:0,state:'sleep',onGround:true,t:0,f:1,meowT:2};return true;
    case'P':L.chaser={type:'sweeper',home:{x:cx-60,y:y+T-64},x:cx-60,y:y+T-64,w:120,h:64,vx:0,vy:0,state:'sleep',onGround:true,t:0,f:1,meowT:2};return true;
    case'O':L.gargoyles.push({x:cx,y:cy,dir:def.gargoyleDir||(c%2?-1:1),ph:(c*.61)%3});return true;
    case'L':movers.push({c,r,axis:'h',w:6,kind:'tram'});return true;
    case'$':movers.push({c,r,axis:'s',w:1,kind:'horse'});return true;
    case'a':movers.push({c,r,axis:'s',w:1,kind:'balloon'});return true;
    case'I':movers.push({c,r,axis:'p',w:1,kind:'bell'});return true;
    case'F':L.fires.push({x:cx,y:y+T});L.lights.push({x:cx,y:y+T-30,r:200,i:.8,warm:2});return true;
    case'+':L.poppies.push({x:cx,y:y+T});return true;
    case'%':L.crumbles.push({c,r,state:'solid',t:0});return false;   // reste dans la grille
    case'J':L.shutters.push({c,r});return false;
    case'e':(L.acts=L.acts||[]).push({kind:'secret',x:cx,y:y+T,open:0,t:0,used:false});return true;
    case'z':(L.acts=L.acts||[]).push({kind:'lever',x:cx,y:y+T,open:0,t:0,used:false});return true;
    case'R':return false;
    case',':L.mines.push({x:cx,y:y+T,state:'idle',t:0});return true;
    case'f':return false;   // carton creux : dessiné comme un bloc, on peut y entrer
    case't':return false;   // planche invisible
    case's':{(L.acts=L.acts||[]).push({kind:'stash',x:cx,y:cy,open:0,t:0,used:false,q:L.def.stashQuips});const n=L.def.segsFake;L.g[r][c]=((L.def.fakeStash||[]).some(([a,b])=>a===c&&b===r)||L.g[r][c-1]==='f'||L.g[r][c+1]==='f'||(L.g[r-1]&&L.g[r-1][c]==='f')||(L.g[r+1]&&L.g[r+1][c]==='f'))?'f':'.';return false}
    case'x':{let fr=r+1;while(fr<ROWS&&L.g[fr][c]!=='#')fr++;{const ac={kind:'secret',style:'wardrobe',x:c*T+T,y:fr*T,open:0,t:0,used:false};(L.acts=L.acts||[]).push(ac);L.decor.push({t:'wardrobe',x:c*T,y:r*T,w:2*T,floor:fr*T,act:ac})}L.g[r][c]='=';if(L.g[r][c+1]==='.')L.g[r][c+1]='=';return false}
  }
  return false;
}
/* plateformes mobiles à trajectoire propre (manège, ballons, cloches) */
function mechMoverInit(L,m){
  if(m.kind==='horse'){m.bx=m.c*T-10;m.by=m.r*T;m.amp=26;m.per=3;m.ph=(m.c*.8)%6;m.w=T+20;m.h=12}
  else if(m.kind==='balloon'){m.bx=m.c*T-6;m.by=m.r*T;m.amp=7;m.per=2.2;m.ph=(m.c*.5)%6;m.w=T+12;m.h=10;m.bouncy=1}
  else if(m.kind==='bell'){m.px=m.c*T+T/2;m.py=m.r*T;m.len=86;m.amp=.58;m.per=3;m.ph=(m.c*.9)%6;m.w=60;m.h=10;m.rung=0}
  else return false;
  mechMoverStep(m,0);m.dx=m.dy=0;return true;
}
function mechMoverStep(m,dt){
  const px=m.x,py=m.y;m.t=(m.t||0)+dt;
  if(m.kind==='horse'){m.x=m.bx;m.y=m.by+Math.sin(m.t*Math.PI*2/m.per+m.ph)*m.amp}
  else if(m.kind==='balloon'){m.x=m.bx;m.y=m.by+Math.sin(m.t*Math.PI*2/m.per+m.ph)*m.amp}
  else if(m.kind==='bell'){
    const s=Math.sin(m.t*Math.PI*2/m.per+m.ph);m.theta=s*m.amp;
    m.x=m.px+Math.sin(m.theta)*m.len-m.w/2;m.y=m.py+Math.cos(m.theta)*m.len-10;
    // coup de cloche aux extrémités du balancement
    const atEnd=Math.abs(s)>.985;
    if(atEnd&&!m.rung){m.rung=1;m.wave=0;m.wx=m.px+Math.sin(m.theta)*(m.len+24);m.wy=m.py+Math.cos(m.theta)*(m.len+24);if(!G.sim&&Math.abs(m.wx-cam.x-W/2)<W)SFX.bell()}
    if(!atEnd)m.rung=0;
    if(m.wave!=null){m.wave+=dt;if(m.wave>.6)m.wave=null}
  }
  m.dx=m.x-px;m.dy=m.y-py;
}
function shutterOpen(c){return((G.lt+c*.45)%4)<2.5}
function shutterSoon(c){const p=(G.lt+c*.45)%4;return p>2.0&&p<2.5}
function crumbleAt(c,r){for(const k of L.crumbles)if(k.c===c&&k.r===r)return k;return null}

/* ---------- avant la physique du joueur ---------- */
function mechStep(dt,pcx,pcy){
  const def=L.def;
  // obscurité et éclairs réguliers
  if(def.dark){const per=def.dark.period||3.2,ph=(G.lt+.4)%per;const f=ph<.08?1:Math.max(0,1-(ph-.08)/.6);
    if(ph<dt*1.5&&!G.sim){G.flash=Math.max(G.flash,.55);setTimeout(()=>SFX.thunder(.45),220)}
    L.darkNow=def.dark.base*(1-f*.85)}
  // rafales de vent
  if(def.gust){const gs=def.gust,ph=G.lt%gs.period,wstart=gs.period-gs.dur;
    L.gust.state=ph>=wstart?'blow':ph>=wstart-.9?'warn':'calm';L.gust.k=L.gust.state==='blow'?Math.min(1,(ph-wstart)*4,(gs.period-ph)*4):0;
    if(L.gust.state==='blow'&&!G.sim&&!L.gust.snd){L.gust.snd=1;SFX.bag()}if(L.gust.state!=='blow')L.gust.snd=0}
  // défilement forcé (l'orage arrive par la gauche)
  if(L.auto&&L.auto.on&&!P.dead)L.auto.x=Math.min(L.wpx-W,L.auto.x+L.auto.speed*dt);
  // sol qui s'effondre
  for(const k of L.crumbles){
    if(k.state==='solid'){if(P.onGround&&!P.dead&&Math.floor((P.y+P.h+1)/T)===k.r&&P.x+P.w>k.c*T+2&&P.x<k.c*T+T-2){k.state='shake';k.t=0;if(!G.sim)noise(.2,300,.12,'lowpass')}}
    else if(k.state==='shake'){k.t+=dt;if(k.t>.5){k.state='gone';k.t=0;L.g[k.r][k.c]='.';for(let i=0;i<5;i++)parts.push({type:'dust',x:k.c*T+rnd()*T,y:k.r*T+rnd()*10,vx:(rnd()-.5)*60,vy:40+rnd()*60,life:0,max:.7})}}
    else{k.t+=dt;if(k.t>4.5){const over=P.x+P.w>k.c*T&&P.x<k.c*T+T&&P.y+P.h>k.r*T&&P.y<k.r*T+T;if(!over){k.state='solid';k.t=0;L.g[k.r][k.c]='%'}}}
  }
  // gardiens : ronde, pauses, faisceau
  for(const g of L.guards){
    g.t+=dt;
    if(g.tangle>0){g.tangle-=dt;g.sees=false;
      if(g.tangle<=0){g.sweep=1.4;g.sweepAng=g.dir>0?0:Math.PI;g.angry=true;const c=L.covers.find(c=>c.on===g);if(c){c.on=null;c.sheetX=g.x+g.w/2+22*g.dir}if(!G.sim){bubble(g.x+g.w/2,g.y-16,'Où il est, ce pigeon ?!','#a8322d');noise(.25,900,.2,'bandpass')}}
      continue}
    // il arrache le drap et balaie tout autour de lui avec sa lampe, furieux
    if(g.sweep>0){g.sweep-=dt;g.sweepAng+=dt*7.5;g.look=0;g.sees=!G.cut&&!P.dead&&guardSees(g,pcx,pcy);continue}
    if(g.pause>0){g.pause-=dt;g.look=Math.sin(g.t*3)*.18;if(g.pause<=0){if(g.noFlip)g.noFlip=false;else g.dir=-g.dir}}
    else{g.look=0;g.x+=g.dir*g.speed*(g.angry?2.3:1)*dt;
      if(g.dir>0&&g.x+g.w>=g.a1){g.x=g.a1-g.w;g.pause=1.1}
      else if(g.dir<0&&g.x<=g.a0){g.x=g.a0;g.pause=1.1}}
    g.sees=!G.cut&&!P.dead&&guardSees(g,pcx,pcy);
  }
  // le chat aux yeux brillants : fermés, puis prévient, puis ouverts
  for(const w of L.watchers)watchStep(w,dt,pcx,pcy);
  // gargouilles : goutte d'avertissement, puis jet
  for(const o of L.gargoyles){const cyc=(G.lt+o.ph)%3.2;o.state=cyc<1.6?'idle':cyc<2.2?'warn':'jet';o.len=o.state==='jet'?Math.min(170,(cyc-2.2)*900):0}
}
function guardBeam(g){const ex=g.x+g.w/2+g.dir*10,ey=g.y+20;if(g.sweep>0)return{ex,ey,ang:g.sweepAng,len:250,half:.32};const base=g.dir>0?0:Math.PI;return{ex,ey,ang:base+g.look+.12*(g.dir>0?1:-1),len:250,half:.32}}
function hiddenNow(){if(inFake())return true;return !!coverHere()}
function guardSees(g,pcx,pcy){
  const b=guardBeam(g),dx=pcx-b.ex,dy=pcy-b.ey,d=Math.hypot(dx,dy);
  if(d>b.len)return false;
  let a=Math.atan2(dy,dx)-b.ang;a=Math.atan2(Math.sin(a),Math.cos(a));if(Math.abs(a)>b.half)return false;
  if(hiddenNow())return false;
  for(let k=1;k<10;k++){const x=b.ex+dx*k/10,y=b.ey+dy*k/10,c=Math.floor(x/T),r=Math.floor(y/T);if(isSolid(c,r)||tile(c,r)==='f')return false}
  return true;
}
/* ---------- modificateurs de la physique du joueur ---------- */
function onMud(){if(!P.onGround)return false;const r=Math.floor((P.y+P.h+2)/T);const c0=Math.floor((P.x+3)/T),c1=Math.floor((P.x+P.w-3)/T);for(let c=c0;c<=c1;c++)if(tile(c,r)==='~')return true;return false}
function mechMods(){
  const m={run:RUN,jump:JUMPV,noInput:false};
  // la boue colle aux plumes : à peine un sautillement, plus de battement ni de vol plané, un moment encore après en être sorti
  if(onMud()){m.run=RUN*.42;m.jump=JUMPV*.36;P.mudCoat=1.4}
  if(P.mudCoat>0)m.noFly=true;
  if(P.stun>0)m.noInput=true;
  return m;
}
function sheltered(dir){
  // abri contre le vent : un mur plein du côté d'où il souffle, à moins de trois cases
  const r0=Math.floor((P.y+4)/T),r1=Math.floor((P.y+P.h-4)/T),c=Math.floor((P.x+P.w/2)/T);
  for(let k=1;k<=3;k++)for(let r=r0;r<=r1;r++)if(isSolid(c-dir*k,r))return true;
  for(const mv of L.movers)if(mv.kind==='truck'||mv.kind==='tram'){const sx=dir<0?mv.x:mv.x+mv.w;if(P.y+P.h>mv.y&&Math.abs((P.x+P.w/2)-sx)<120&&((dir<0&&P.x+P.w<=mv.x+4)||(dir>0&&P.x>=mv.x+mv.w-4)))return true}
  return false;
}
function mechAfterMove(dt,vyBefore){
  // rebond sur les auvents et les ballons
  if(P.onGround){
    const r=Math.floor((P.y+P.h+2)/T),c0=Math.floor((P.x+4)/T),c1=Math.floor((P.x+P.w-4)/T);
    let bounce=0;for(let c=c0;c<=c1;c++)if(tile(c,r)==='A')bounce=1020;
    if(P.onMover&&P.onMover.bouncy)bounce=940;
    if(bounce){P.vy=-bounce;P.onGround=false;P.onMover=null;P.flaps=0;P.sx=.8;P.sy=1.25;if(!G.sim)tone(240,.18,'triangle',.12,520)}
  }
  // enlisement dans la boue
  if(P.mudCoat>0&&!onMud())P.mudCoat-=dt;
  if(onMud()&&Math.abs(P.vx)<40){P.mud=(P.mud||0)+dt;if(P.mud>1.5)return'mud'}else P.mud=Math.max(0,(P.mud||0)-dt*2);
  // rafales
  if(L.def.gust&&L.gust.state==='blow'){const dir=L.def.gust.dir||-1;if(!sheltered(dir)){moveX(P,dir*L.def.gust.push*L.gust.k*(P.onGround?1:1.25)*dt)}}
  // étourdi par l'onde d'une cloche
  if(P.stun>0)P.stun-=dt;
  return null;
}
/* ---------- collisions mortelles ---------- */
function mechHit(hb){
  const pcx=hb.x+hb.w/2,pcy=hb.y+hb.h/2;
  for(const g of L.guards)if(g.sees){if(!G.sim){bubble(g.x+g.w/2,g.y-14,'Hé ! Toi !','#2a3a5a')}return'guard'}
  for(const w of L.watchers)if(w.mode==='chase'&&w.k&&!hiddenNow()&&overlap(hb,{x:w.k.x+5,y:w.k.y+4,w:w.k.w-10,h:w.k.h-4}))return'catwatch';
  for(const o of L.gargoyles)if(o.state==='jet'){const x0=o.dir>0?o.x+14:o.x-14-o.len;if(overlap(hb,{x:x0,y:o.y-2,w:o.len,h:12}))return'water'}
  for(const f of L.fires)if(overlap(hb,{x:f.x-14,y:f.y-44,w:28,h:44}))return'fire';
  for(const m of L.mines)if(m.boom){m.boom=false;if(Math.hypot(pcx-m.x,pcy-(m.y-10))<78)return'mine'}
  if(L.auto&&L.auto.on&&P.x<L.auto.x+4)return'storm';
  for(const m of L.movers)if(m.kind==='bell'&&m.wave!=null&&P.onMover!==m){const r=30+m.wave*170,d=Math.hypot(pcx-m.wx,pcy-m.wy);if(r<95&&Math.abs(d-r)<12&&!(P.stun>0)){P.stun=.3;P.vx=(pcx>m.wx?1:-1)*130;P.vy=Math.min(P.vy,-90);P.onGround=false;P.onMover=null;if(!G.sim)SFX.flap()}}
  return null;
}
/* ---------- poursuivants au sol (gardien au filet, balayeuse) ---------- */
function stepGroundChaser(K,dt,pcx,pcy){
  if(K.state==='wake'){K.wakeT-=dt;if(K.wakeT<=0)K.state='chase'}
  if(K.state!=='chase')return;
  const sweep=K.type==='sweeper';
  const dist=pcx-(K.x+K.w/2),dir=Math.sign(dist)||1;
  const sp=sweep?clamp(160+(Math.abs(dist)-220)*.2,160,240):clamp(205+(Math.abs(dist)-160)*.22,205,280);
  K.leapT=(K.leapT||0)-dt;if(!(K.leapT>0&&!K.onGround))K.vx=lerp(K.vx,dir*sp,Math.min(1,dt*(sweep?2:5)));K.f=dir;
  if(sweep){K.x+=K.vx*dt;K.y=K.home.y;if(!G.sim&&rnd()<.3)parts.push({type:'dust',x:K.x+(K.f>0?K.w:0),y:K.y+K.h-4,vx:-K.f*40,vy:-20,life:0,max:.5});return}
  K.vy=Math.min(MAXFALL,K.vy+GRAV*dt);
  moveX(K,K.vx*dt);K.onGround=false;moveY(K,K.vy*dt);
  if(K.onGround){
    const fx=dir>0?K.x+K.w+6:K.x-6,cf=Math.floor(fx/T),rf=Math.floor((K.y+K.h-2)/T);
    const la=dir>0?K.x+K.w+34:K.x-34,cl=Math.floor(la/T);
    const blocked=isSolid(cf,rf)||isSolid(cf,rf-1),gap=!groundAt(cl,rf+1)&&!isSolid(cl,rf),pins=tile(cl,rf)==='^'||tile(cf,rf)==='^',above=P.y+P.h<K.y-20&&Math.abs(dist)<110;
    if(blocked||gap||pins||above)chaserLeap(K,dir,rf);
  }
  if(K.y>ROWS*T+60)chaserReenter(K);
}
/* la buse traverse un braséro : elle prend feu */
function buseBurn(K,dt){
  if(K.state==='burn'){K.bt+=dt;K.vy=Math.min(500,(K.vy||0)+900*dt);K.x+=K.vx*dt*.4;K.y+=K.vy*dt;if(K.floor&&K.y+K.h>K.floor){K.y=K.floor-K.h;K.vy=0;K.vx*=.9}
    if(!G.sim&&rnd()<.6)parts.push({type:'dust',x:K.x+K.w/2+(rnd()-.5)*20,y:K.y,vx:(rnd()-.5)*40,vy:-60-rnd()*60,life:0,max:.9});
    if(K.bt>1.8){K.state='dead';G.chase=false;setSong(songKey(G.li));
      if(!G.sim)sayQueue([["RAYMOND","Elle a pris feu comme une botte de foin. Comme… de la paille ?",4.2],["RAYMOND","Les buses, ça ne brûle pas comme ça. Si ?",3.6]])}
    return true}
  if(K.state==='dead')return true;
  // quand Raymond dépasse le braséro, la buse fond sur lui... et plonge dans le feu
  if(!K.fireDive&&(K.state==='hover'||K.state==='warn'))for(const f of L.fires){const pcx=P.x+P.w/2;if(pcx>f.x+30&&pcx<f.x+420&&K.x+K.w/2<pcx){K.fireDive=true;K.state='dive';K.pt=0;const dx=f.x-(K.x+K.w/2),dy=(f.y-34)-(K.y+K.h/2),d=Math.hypot(dx,dy)||1;K.vx=dx/d*560;K.vy=dy/d*560;K.f=K.vx>=0?1:-1;if(!G.sim)SFX.screech();break}}
  if(K.state==='dive'||K.state==='hover'||K.state==='warn')for(const f of L.fires)if(Math.abs(K.x+K.w/2-f.x)<44&&K.y+K.h>f.y-90){K.state='burn';K.bt=0;K.vy=-120;K.floor=f.y;if(!G.sim){noise(1.2,900,.5,'bandpass');SFX.screech()}return true}
  return false;
}
/* ---------- répliques à plusieurs voix ---------- */
function sayQueue(list){G.quipQ=list.slice(1);const f=list[0];say(f[1],f[2]||4,f[0])}

/* ---------- lumières supplémentaires (faisceaux, yeux, feux) ---------- */
function mechLights(){
  const out=[];
  for(const g of L.guards){if(g.tangle>0)continue;const b=guardBeam(g);out.push({x:b.ex+Math.cos(b.ang)*110,y:b.ey+Math.sin(b.ang)*110,r:150,i:.85,warm:1})}
  if(L.chaser&&L.chaser.type==='guardnet'&&L.chaser.state!=='sleep'){const K=L.chaser;out.push({x:K.x+K.w/2+K.f*80,y:K.y+24,r:160,i:.8,warm:1})}
  for(const w of L.watchers)if(w.open>0)out.push({x:w.x+6,y:w.y-40,r:60,i:.5*w.open});
  for(const f of L.fires)out.push({x:f.x,y:f.y-30,r:180,i:.6,warm:2});
  return out;
}

/* après lecture du niveau : bornes des rondes, défilement forcé */
function mechPostParse(L){
  for(const g of L.guards){let a=g.c-4,b=g.c+4;for(let c=g.c-1;c>=0;c--)if(L.mark.has(c+','+g.r)){a=c+1;break}for(let c=g.c+1;c<L.w;c++)if(L.mark.has(c+','+g.r)){b=c;break}g.a0=a*T;g.a1=b*T}
  if(L.def.auto)L.auto={speed:L.def.auto.speed||110,on:false,x:0};
  actPost(L);
}
