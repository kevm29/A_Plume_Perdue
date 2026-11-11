/* =========================================================
   ENTRÉES ET BOUCLE PRINCIPALE
   ========================================================= */
const keys=new Set(),pressed=new Set();
const KMAP={ArrowLeft:['left'],KeyA:['left'],ArrowRight:['right'],KeyD:['right'],ArrowUp:['jump','up'],KeyW:['jump','up'],KeyZ:['jump','up'],Space:['jump','ok'],ArrowDown:['down'],KeyS:['down'],KeyE:['act'],KeyB:['era'],KeyF:['act'],Enter:['ok'],NumpadEnter:['ok'],Escape:['esc'],KeyP:['esc'],Backspace:['back']};
addEventListener('keydown',e=>{
  ensureAudio();
  if(G.state==='settings'&&G.codeEntry&&codeKey(e))return;
  const a=KMAP[e.code];
  if(a){for(const k of a){if(!keys.has(k))pressed.add(k);keys.add(k)}e.preventDefault()}
  const k=(e.key||'').toLowerCase();
  if(!e.repeat){if(k==='m')toggleMute();if(k==='r')pressed.add('restart');if(k==='g')godSwap()}
});
addEventListener('keyup',e=>{const a=KMAP[e.code];if(a)for(const k of a)keys.delete(k)});
addEventListener('blur',()=>keys.clear());
function toLogical(ev){const r=cv.getBoundingClientRect();return{x:(ev.clientX-r.left-offX)/scale,y:(ev.clientY-r.top-offY)/scale}}
cv.addEventListener('pointerdown',e=>{ensureAudio();cv.focus();G.click=toLogical(e)});
cv.addEventListener('pointermove',e=>{G.mouse=toLogical(e)});
cv.addEventListener('pointerleave',()=>{G.mouse=null});
cv.addEventListener('wheel',e=>{if(G.state==='ach'){e.preventDefault();G.wheel=(G.wheel||0)+e.deltaY*(e.deltaMode===1?30:1)}},{passive:false});
function bindTouch(id,act){
  const el=document.getElementById(id);
  const on=e=>{e.preventDefault();ensureAudio();if(!keys.has(act))pressed.add(act);keys.add(act);el.classList.add('down');if(act==='jump')pressed.add('ok')};
  const off=e=>{e.preventDefault();keys.delete(act);el.classList.remove('down')};
  el.addEventListener('pointerdown',on);el.addEventListener('pointerup',off);el.addEventListener('pointercancel',off);el.addEventListener('pointerleave',off);
}
bindTouch('tl','left');bindTouch('tr','right');bindTouch('tj','jump');bindTouch('te','act');bindTouch('tb','era');
document.getElementById('tp').addEventListener('pointerdown',e=>{e.preventDefault();ensureAudio();pressed.add('esc')});
/*v2*/
/* ---------- manette (API Gamepad, disposition standard Xbox / PlayStation) ----------
   A sauter / valider · B retour · X action · Y époque · Start pause · Select dernier fanion · RB Super-Raymond / Dieu-Pigeon
   Stick gauche ou croix : se déplacer, choisir dans les menus. La manette marche toujours ; le réglage « Commandes »
   des paramètres ne change que les indications affichées. */
const PAD_BTN={0:['jump','ok'],1:['back'],2:['act'],3:['era'],9:['esc'],12:['up'],13:['down'],14:['left'],15:['right']};
const padHeld=new Set();let padPrev={};
function pollPad(){
  let gps=[];try{gps=navigator.getGamepads?navigator.getGamepads():[]}catch(e){return}
  const now=new Set(),edge={};
  for(const gp of gps){if(!gp||!gp.connected)continue;
    gp.buttons.forEach((b,i)=>{const on=b&&(b.pressed||b.value>.5);if(!on)return;if(PAD_BTN[i])for(const a of PAD_BTN[i])now.add(a);if(!padPrev[i])edge[i]=1;});
    const ax=gp.axes[0]||0,ay=gp.axes[1]||0;
    if(ax<-.4)now.add('left');if(ax>.4)now.add('right');if(ay<-.55)now.add('up');if(ay>.55)now.add('down');
    padPrev={};gp.buttons.forEach((b,i)=>{if(b&&(b.pressed||b.value>.5))padPrev[i]=1});break}
  if(!gps||![...gps].some(g=>g&&g.connected))padPrev={};
  if(now.size||Object.keys(edge).length)ensureAudio();
  for(const a of now){if(!keys.has(a))pressed.add(a);keys.add(a)}
  for(const a of padHeld)if(!now.has(a))keys.delete(a);
  padHeld.clear();for(const a of now)padHeld.add(a);
  if(edge[8])pressed.add('restart');if(edge[5])godSwap();
}
let touchUI=false;
function showTouch(){if(touchUI)return;touchUI=true;for(const id of['tl','tr','tj','tp','te'])document.getElementById(id).classList.add('on');syncTouchB()}
function syncTouchB(){if(touchUI)document.getElementById('tb').classList.toggle('on',eraKeyOn())}
if(matchMedia('(pointer: coarse)').matches)showTouch();
addEventListener('touchstart',showTouch,{passive:true});

let last=performance.now(),acc=0;
const STEP=1/120;
function update(dt){
  G.t+=dt;
  if(G.fade>0)G.fade=Math.max(0,G.fade-dt*2.2);
  if(G.shake>0)G.shake=Math.max(0,G.shake-dt*30);
  if(G.quip&&!(G.state==='play'&&G.hintI>=0)){G.quip.t+=dt;if(G.quip.t>G.quip.dur){G.quip=null;if(G.quipQ&&G.quipQ.length){const f=G.quipQ.shift();say(f[1],f[2]||4,f[0])}}}
  if(G.state!=='play')loopsOff();
  // l'orchestre de la 5-3 joue plus ou moins fort selon la distance à la scène : hors du niveau, volume normal
  if(G.state!=='play'&&G.state!=='pause'&&G.state!=='confirm'&&G.state!=='exiting'&&typeof mGain!=='undefined'&&mGain&&mGain.gain.value!==.1)mGain.gain.value=.1;
  switch(G.state){
    case'title':handleMenu();break;
    case'pause':if(pressed.has('esc')||pressed.has('back')||homeClick()){G.state='play';break}handleMenu();break;
    case'select':handleSelect();break;
    case'confirm':handleConfirm();break;
    case'ach':handleAch();break;
    case'scores':handleScores();break;
    case'settings':handleSettings();break;
    case'intro':handleCards(dt);break;
    case'levelend':handleLetter(dt);break;
    case'play':{
      if(pressed.has('esc')){G.state='pause';G.menuSel=0;break}
      if(homeClick()){G.state='pause';G.menuSel=0;break}
      if(vauxActive()){vauxUpdate(dt);break}
      if(svActive()){svUpdate(dt);break}
      if(rfActive()){rfUpdate(dt);break}
      if(!eraKeyOn())pressed.delete('era');if(touchUI&&!G.tbSync){G.tbSync=1;syncTouchB()}
      if(pressed.has('era')&&!G.cut&&L.ferte)ferteSwitch();
      if(pressed.has('era')&&!G.cut&&L.crecy)crecySwitch();
      if(pressed.has('era')&&!G.cut&&L.cb)comblesSwitch();
      if(pressed.has('era')&&!G.cut&&(L.s16||L.zr16))s16Switch();
      if(pressed.has('era')&&!G.cut&&L.fc)rfStart();
      if(L.cb&&L.cb.end&&(pressed.has('act')||pressed.has('jump')))comblesSkip();
      if(L.pl&&L.pl.seq&&(pressed.has('act')||pressed.has('jump')||pressed.has('ok')))placeSkip();
      if(L.cm&&L.cm.seq&&(pressed.has('act')||pressed.has('jump')||pressed.has('ok')))cmSkip();
      if(G.cut&&(pressed.has('ok')||pressed.has('restart')||G.click)&&G.cut.t>1)skipCut();
      if(pressed.has('restart')&&!P.dead&&!G.cut){resetPlayer();P.wake=.3;respawnChaserOnly();if(L.ferte)ferteRespawn();if(L.pl)placeRespawn();if(L.cm)cmRespawn();if(L.s16)s16Respawn()}
      if(pressed.has('jump')&&!G.cut)P.jumpBuf=.12;
      if(pressed.has('act')&&!G.cut){tryAct();if(L.s16)s16Act();if(L.zr)zrAct()}
      acc+=dt;let n=0;while(acc>=STEP&&n<12){stepPlay(STEP);acc-=STEP;n++;if(G.state!=='play')break}
      if(acc>STEP)acc=0;
      if(G.state==='play'){animalSounds(dt);updateCamera(dt)}
      updateParticles(dt);
      if(G.tickSnd){G.tickSnd=false;SFX.tick()}
      break}
    case'exiting':{
      G.exitT+=dt;updateParticles(dt);
      if(G.exitT>1.1){
        const li=G.li;S.unlocked=Math.min(19,Math.max(S.unlocked,li+1));
        if(G.medal)S.run.medals[li]=true;
        const gt=gotOf(li);if(G.replay&&G.replay.li===li){gt.d=Math.min(gt.d,G.replay.d);G.replay=null}
        S.run.stats[li]={corn:gt.c.length,cornTotal:G.cornTotal,medal:gt.m,hasMedal:!!L.medal,secFound:gt.sec.length,secTotal:L.secretTotal||0,deaths:gt.d};S.run.stats[li].points=levelPoints(S.run.stats[li]);S.run.stats[li].max=levelMax(S.run.stats[li]);
        const shown=null;
        const b=S.best[li]||{corn:0,medal:false,deaths:9999,points:0};S.best[li]={corn:Math.max(b.corn,gt.c.length),medal:b.medal||gt.m,secret:Math.max(b.secret||0,gt.sec.length),deaths:Math.min(b.deaths,gt.d),points:Math.max(b.points||0,S.run.stats[li].points)};save();achStraw();
        setSong('title');endOfLevel(li,shown);
      }
      break}
  }
  pressed.clear();G.click=null;
}
function respawnChaserOnly(){const K=L.chaser;if(!K)return;if(K.type==='cat'||P.cp.x<L.triggerX){K.state='sleep';K.x=K.home.x;K.y=K.home.y;K.vx=K.vy=0;G.chase=false;setSong(songKey(G.li))}else{K.x=P.x-460;K.y=P.y-220}}
function render(){
  ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#0b0a0c';ctx.fillRect(0,0,cv.width,cv.height);
  ctx.setTransform(dpr*scale,0,0,dpr*scale,dpr*offX,dpr*offY);
  ctx.save();ctx.beginPath();ctx.rect(0,0,W,H);ctx.clip();
  const t=G.t;
  switch(G.state){
    case'loading':ctx.fillStyle='#110e14';ctx.fillRect(0,0,W,H);ctx.fillStyle='rgba(233,223,199,.6)';ctx.font='italic 20px Georgia, serif';ctx.textAlign='center';ctx.fillText('On rembourre Raymond…',W/2,H/2);break;
    case'title':renderTitle(t);renderGrain();break;
    case'select':renderSelect(t);renderGrain();break;
    case'ach':renderAch(t);renderGrain();break;
    case'scores':renderScores(t);renderGrain();break;
    case'settings':renderSettings(t);renderGrain();break;
    case'intro':renderCards(t);renderGrain();break;
    case'levelend':renderLetter(t);renderGrain();break;
    case'play':case'pause':case'exiting':case'confirm':{
      if(vauxActive()){vauxRender(t);vauxOverlays();break}
      if(svActive()){svRender(t);drawQuip(66);vauxOverlays();break}
      if(rfActive()){rfRender(t);vauxOverlays();break}
      const sx=(rnd()-.5)*G.shake,sy=(rnd()-.5)*G.shake;
      let cx=Math.round(cam.x+sx),cy=Math.round(cam.y+sy);
      // zoom de cinématique (5-3) : centré sur un point du monde
      const zm=L.zoom&&L.zoom.z>1.001?L.zoom:null;if(zm){cx=Math.round(zm.fx-W/2);cy=Math.round(zm.fy-H/2);ctx.save();ctx.translate(W/2,H/2);ctx.scale(zm.z,zm.z);ctx.translate(-W/2,-H/2)}
      renderWorld(L,cx,cy,t);
      const extra=[{x:P.x+P.w/2,y:P.y+P.h/2,r:190,i:.8}];
      for(const cp of L.cps)if(cp.on)extra.push({x:cp.x,y:cp.y-46,r:150,i:.75,warm:1,flick:1});
      if(L.exit)extra.push({x:L.exit.x+26,y:L.exit.y+40,r:230,i:1,warm:L.def.exit==='door'||L.def.exit==='bunker'?1:0});
      if(medalVis())extra.push({x:L.medal.x,y:L.medal.y,r:70,i:.5});
      if(L.dome)extra.push({x:L.dome.x,y:L.dome.floor-90,r:170,i:.7,warm:1});
      if(G.cut&&G.cut.thief.state!=='out'&&G.cut.thief.state!=='gone')extra.push({x:G.cut.thief.x-40,y:L.dome.floor-60,r:200,i:.85,warm:1});
      for(const b of L.bolts)if(b.state==='strike')extra.push({x:b.x,y:13*T-60,r:260,i:1});
      for(const l of mechLights())extra.push(l);
      renderLighting(L,cx,cy,t,extra);
      if(zm)ctx.restore();
      renderWeather(L.th,cx,t);
      drawForeground(cx,L.def.seed,L.th);
      if(L.ferte)ferteOverlay(t);if(L.crecy)crecyOverlay(t);if(L.cb)comblesOverlay(t);if(L.pl)placeOverlay(t);if(L.cm)cmOverlay(t);if(L.s16)s16Overlay(t);
      renderGrain();
      if(!G.cut&&!(L.cb&&L.cb.end&&L.cb.end.t>1.2)&&!(L.pl&&L.pl.seq)&&!(L.cm&&L.cm.seq))renderHUD();else if(G.cut)drawQuip(66);
      if(G.cut){ctx.fillStyle='rgba(0,0,0,.88)';ctx.fillRect(0,0,W,46);ctx.fillRect(0,H-46,W,46);if(G.cut.t>1){ctx.font='italic 14px '+F_BODY;ctx.fillStyle='rgba(233,223,199,.45)';ctx.textAlign='right';ctx.fillText('appuyer pour passer',W-20,H-18)}}
      vauxOverlays();
      break}
  }
  if(G.fade>0){ctx.fillStyle='rgba(11,10,12,'+G.fade+')';ctx.fillRect(0,0,W,H)}
  renderToasts(G.dtLast||1/60);
  ctx.restore();
}
function vauxOverlays(){
  if(G.state==='pause'){ctx.fillStyle='rgba(10,8,14,.74)';ctx.fillRect(0,0,W,H);ctx.fillStyle='#efe5cc';ctx.font='44px '+F_DISP;ctx.textAlign='center';ctx.fillText('Pause',W/2,140);ctx.font='italic 17px '+F_BODY;ctx.fillStyle='rgba(233,223,199,.6)';ctx.fillText('Raymond en profite pour se gratter. Il ne sent rien.',W/2,172);drawMenu(W/2,236,48)}
  if(G.state==='confirm')renderConfirm();
  if(G.state==='exiting'){ctx.fillStyle='rgba(11,10,12,'+Math.min(1,G.exitT/1.1)+')';ctx.fillRect(0,0,W,H)}
}
/* le bouton maison du bandeau : la même chose qu'Échap (pause, puis reprise) */
function homeClick(){const b=G.homeBox;return !!(G.click&&b&&G.click.x>b.x&&G.click.x<b.x+b.w&&G.click.y>b.y&&G.click.y<b.y+b.h)}
function frame(now){
  const dt=Math.min(.05,(now-last)/1000);last=now;
  G.dtLast=dt;try{pollPad();update(dt);render()}catch(err){console.error(err)}
  requestAnimationFrame(frame);
}
applyMode();
async function boot(){
  try{await Promise.race([Promise.all([document.fonts.load('30px "IM Fell English SC"'),document.fonts.load('italic 20px "IM Fell English"'),document.fonts.load('20px "IM Fell English"'),document.fonts.load('30px "La Belle Aurore"')]),new Promise(r=>setTimeout(r,2500))])}catch(e){}
  ensureTitleLv();G.state='title';G.fade=1;setSong('title');
}
window.__drawMedal=(g,x,y,id,on,s)=>drawAchMedal(g,x,y,id,on,s);window.__apl={G,P,S,startLevel,stepPlay,render,renderWorld,renderLighting,renderWeather,renderGrain,renderHUD,update,get L(){return L},keys,pressed,cam,compileSong,LEVELS};
boot();requestAnimationFrame(frame);
