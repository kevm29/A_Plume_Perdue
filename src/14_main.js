/* =========================================================
   ENTRÉES ET BOUCLE PRINCIPALE
   ========================================================= */
const keys=new Set(),pressed=new Set();
const KMAP={ArrowLeft:['left'],KeyA:['left'],ArrowRight:['right'],KeyD:['right'],ArrowUp:['jump','up'],KeyW:['jump','up'],KeyZ:['jump','up'],Space:['jump','ok'],ArrowDown:['down'],KeyS:['down'],Enter:['ok'],NumpadEnter:['ok'],Escape:['esc'],KeyP:['esc'],Backspace:['back']};
addEventListener('keydown',e=>{
  ensureAudio();
  const a=KMAP[e.code];
  if(a){for(const k of a){if(!keys.has(k))pressed.add(k);keys.add(k)}e.preventDefault()}
  const k=(e.key||'').toLowerCase();
  if(!e.repeat){if(k==='m')toggleMute();if(k==='r')pressed.add('restart')}
});
addEventListener('keyup',e=>{const a=KMAP[e.code];if(a)for(const k of a)keys.delete(k)});
addEventListener('blur',()=>keys.clear());
function toLogical(ev){const r=cv.getBoundingClientRect();return{x:(ev.clientX-r.left-offX)/scale,y:(ev.clientY-r.top-offY)/scale}}
cv.addEventListener('pointerdown',e=>{ensureAudio();cv.focus();G.click=toLogical(e)});
function bindTouch(id,act){
  const el=document.getElementById(id);
  const on=e=>{e.preventDefault();ensureAudio();if(!keys.has(act))pressed.add(act);keys.add(act);el.classList.add('down');if(act==='jump')pressed.add('ok')};
  const off=e=>{e.preventDefault();keys.delete(act);el.classList.remove('down')};
  el.addEventListener('pointerdown',on);el.addEventListener('pointerup',off);el.addEventListener('pointercancel',off);el.addEventListener('pointerleave',off);
}
bindTouch('tl','left');bindTouch('tr','right');bindTouch('tj','jump');
document.getElementById('tp').addEventListener('pointerdown',e=>{e.preventDefault();ensureAudio();pressed.add('esc')});
let touchUI=false;
function showTouch(){if(touchUI)return;touchUI=true;for(const id of['tl','tr','tj','tp'])document.getElementById(id).classList.add('on')}
if(matchMedia('(pointer: coarse)').matches)showTouch();
addEventListener('touchstart',showTouch,{passive:true});

let last=performance.now(),acc=0;
const STEP=1/120;
function update(dt){
  G.t+=dt;
  if(G.fade>0)G.fade=Math.max(0,G.fade-dt*2.2);
  if(G.shake>0)G.shake=Math.max(0,G.shake-dt*30);
  if(G.quip){G.quip.t+=dt;if(G.quip.t>G.quip.dur){G.quip=null;if(G.quipQ&&G.quipQ.length){const f=G.quipQ.shift();say(f[1],f[2]||4,f[0])}}}
  if(G.state!=='play')loopsOff();
  switch(G.state){
    case'title':handleMenu();break;
    case'pause':if(pressed.has('esc')){G.state='play';break}handleMenu();break;
    case'select':handleSelect();break;
    case'intro':handleCards(dt);break;
    case'levelend':handleLetter(dt);break;
    case'play':{
      if(pressed.has('esc')){G.state='pause';G.menuSel=0;break}
      if(G.cut&&(pressed.has('ok')||pressed.has('restart')||G.click)&&G.cut.t>1)skipCut();
      if(pressed.has('restart')&&!P.dead&&!G.cut){resetPlayer();P.wake=.3;respawnChaserOnly()}
      if(pressed.has('jump')&&!G.cut)P.jumpBuf=.12;
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
        const b=S.best[li]||{corn:0,medal:false,deaths:9999};S.best[li]={corn:Math.max(b.corn,G.corn),medal:b.medal||G.medal,deaths:Math.min(b.deaths,G.levelDeaths)};
        S.run.stats[li]={corn:G.corn,cornTotal:G.cornTotal,medal:G.medal,deaths:G.levelDeaths};S.run.stats[li].points=levelPoints(S.run.stats[li]);save();
        setSong('title');endOfLevel(li);
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
    case'intro':renderCards(t);renderGrain();break;
    case'levelend':renderLetter(t);renderGrain();break;
    case'play':case'pause':case'exiting':{
      const sx=(rnd()-.5)*G.shake,sy=(rnd()-.5)*G.shake;
      const cx=Math.round(cam.x+sx),cy=Math.round(cam.y+sy);
      renderWorld(L,cx,cy,t);
      const extra=[{x:P.x+P.w/2,y:P.y+P.h/2,r:190,i:.8}];
      for(const cp of L.cps)if(cp.on)extra.push({x:cp.x,y:cp.y-46,r:150,i:.75,warm:1,flick:1});
      if(L.exit)extra.push({x:L.exit.x+26,y:L.exit.y+40,r:230,i:1,warm:L.def.exit==='door'||L.def.exit==='bunker'?1:0});
      if(L.medal&&!L.medal.taken)extra.push({x:L.medal.x,y:L.medal.y,r:70,i:.5});
      if(L.dome)extra.push({x:L.dome.x,y:L.dome.floor-90,r:170,i:.7,warm:1});
      if(G.cut&&G.cut.thief.state!=='out'&&G.cut.thief.state!=='gone')extra.push({x:G.cut.thief.x-40,y:L.dome.floor-60,r:200,i:.85,warm:1});
      for(const b of L.bolts)if(b.state==='strike')extra.push({x:b.x,y:13*T-60,r:260,i:1});
      for(const l of mechLights())extra.push(l);
      renderLighting(L,cx,cy,t,extra);
      renderWeather(L.th,cx,t);
      drawForeground(cx,L.def.seed,L.th);
      renderGrain();
      if(!G.cut)renderHUD();else drawQuip(66);
      if(G.cut){ctx.fillStyle='rgba(0,0,0,.88)';ctx.fillRect(0,0,W,46);ctx.fillRect(0,H-46,W,46);if(G.cut.t>1){ctx.font='italic 14px '+F_BODY;ctx.fillStyle='rgba(233,223,199,.45)';ctx.textAlign='right';ctx.fillText('appuyer pour passer',W-20,H-18)}}
      if(G.state==='pause'){ctx.fillStyle='rgba(10,8,14,.74)';ctx.fillRect(0,0,W,H);ctx.fillStyle='#efe5cc';ctx.font='44px '+F_DISP;ctx.textAlign='center';ctx.fillText('Pause',W/2,140);ctx.font='italic 17px '+F_BODY;ctx.fillStyle='rgba(233,223,199,.6)';ctx.fillText('Raymond en profite pour se gratter. Il ne sent rien.',W/2,172);drawMenu(W/2,236,48)}
      if(G.state==='exiting'){ctx.fillStyle='rgba(11,10,12,'+Math.min(1,G.exitT/1.1)+')';ctx.fillRect(0,0,W,H)}
      break}
  }
  if(G.fade>0){ctx.fillStyle='rgba(11,10,12,'+G.fade+')';ctx.fillRect(0,0,W,H)}
  ctx.restore();
}
function frame(now){
  const dt=Math.min(.05,(now-last)/1000);last=now;
  try{update(dt);render()}catch(err){console.error(err)}
  requestAnimationFrame(frame);
}
async function boot(){
  try{await Promise.race([Promise.all([document.fonts.load('30px "IM Fell English SC"'),document.fonts.load('italic 20px "IM Fell English"'),document.fonts.load('20px "IM Fell English"'),document.fonts.load('30px "La Belle Aurore"')]),new Promise(r=>setTimeout(r,2500))])}catch(e){}
  ensureTitleLv();G.state='title';G.fade=1;setSong('title');
}
window.__apl={G,P,S,startLevel,stepPlay,get L(){return L},keys,pressed,cam,compileSong,LEVELS};
boot();requestAnimationFrame(frame);
