/* =========================================================
   ÉCRANS : titre, itinéraire, intertitres, lettre, enchaînements
   ========================================================= */
let titleLv=null;
function ensureTitleLv(){
  computeRS();
  if(!titleLv||titleLv.rs!==RS){const tmp=parseLevel(0);const lay=loadLayers(0);const prev=L;L=tmp;tmp.far=lay.far;tmp.mid=lay.mid;tmp.windows=lay.windows;tmp.turbines=[];tmp.tiles=buildTiles(tmp);tmp.dome=null;L=prev;tmp.rs=RS;titleLv=tmp}
}
function newRun(){S.run={lives:START_LIVES,worldLives:[START_LIVES],medals:{},wear:0};save()}
function menuItems(){
  if(G.state==='title'){
    const it=[{label:'Nouvelle partie',act:()=>{newRun();startIntro()}}];
    if(S.unlocked>0)it.push({label:'Continuer',act:()=>{G.cutSeen=true;const li=Math.min(S.unlocked,19);if(S.run.lives<0)S.run.lives=S.run.worldLives[LEVELS[li].w]||START_LIVES;startLevel(li)}});
    it.push({label:'Choisir un niveau',act:openSelect});
    it.push({label:S.muted?'Son : coupé':'Son : activé',act:toggleMute});
    return it;
  }
  if(G.state==='pause')return[{label:'Reprendre',act:()=>G.state='play'},{label:'Recommencer le niveau',act:()=>{G.cutSeen=G.cutSeen||G.li>0;startLevel(G.li)}},{label:'Choisir un niveau',act:openSelect},{label:'Menu principal',act:()=>goTitle()},{label:S.muted?'Son : coupé':'Son : activé',act:toggleMute}];
  return[];
}
function goTitle(){G.state='title';G.menuSel=0;G.fade=1;setSong('title');loopsOff()}
function openSelect(){G.state='select';G.sel=Math.min(S.unlocked,19);G.fade=1;setSong('title');loopsOff()}
function startIntro(){G.state='intro';G.cards=INTRO;G.card=0;G.cardT=0;G.cutSeen=false;G.cardsDone=()=>startLevel(0);G.fade=1;setSong('title')}
function handleMenu(){
  const it=menuItems();if(!it.length)return;
  if(pressed.has('up'))G.menuSel=(G.menuSel-1+it.length)%it.length;
  if(pressed.has('down'))G.menuSel=(G.menuSel+1)%it.length;
  if(G.click){
    if(G.state==='title'){const ex=W*.3+11*3.2,ey=460-29.5*3.2;if(Math.hypot(G.click.x-ex,G.click.y-ey)<16){S.infinite=!S.infinite;save();SFX.secret();G.wink=.7;return}}
    for(const b of G.boxes)if(G.click.x>b.x&&G.click.x<b.x+b.w&&G.click.y>b.y&&G.click.y<b.y+b.h){G.menuSel=b.i;it[b.i].act();return}
  }
  if(pressed.has('ok'))it[G.menuSel].act();
}
function drawMenu(cx,y,gap){
  const it=menuItems();G.boxes=[];G.menuSel=Math.min(G.menuSel,it.length-1);
  ctx.save();ctx.textAlign='center';
  it.forEach((m,i)=>{const sel=i===G.menuSel;ctx.font=(sel?'26px ':'23px ')+F_DISP;const w=ctx.measureText(m.label).width;
    const yy=y+i*gap;G.boxes.push({x:cx-w/2-30,y:yy-26,w:w+60,h:36,i});
    ctx.fillStyle=sel?'#f2e8cf':'rgba(233,223,199,.62)';ctx.fillText(m.label,cx,yy);
    if(sel){ctx.fillStyle='#d9a441';ctx.save();ctx.translate(cx-w/2-22,yy-8);ctx.rotate(-.5);ctx.beginPath();ctx.ellipse(0,0,9,3.4,0,0,7);ctx.fill();ctx.restore()}});
  ctx.restore();
}
function renderTitle(t){
  ensureTitleLv();
  const prev=L;L=titleLv;
  const cx=(Math.sin(t*.05)*.5+.5)*(titleLv.wpx-W)*.4;
  renderWorld(titleLv,cx,60,t,{noEntities:true});
  renderLighting(titleLv,cx,60,t,[{x:cx+W*.3,y:300,r:300,i:.9,warm:1}]);
  L=prev;
  ctx.fillStyle='rgba(10,8,14,.35)';ctx.fillRect(0,0,W,H);
  if(G.wink>0)G.wink-=1/60;
  drawDome(ctx,W*.3,470,1,t,{eyeOpen:G.wink>0});
  ctx.save();ctx.textAlign='center';
  ctx.fillStyle='rgba(0,0,0,.45)';ctx.font='78px '+F_DISP;ctx.fillText('À Plume Perdue',W*.66+3,150+4);
  ctx.fillStyle='#efe5cc';ctx.fillText('À Plume Perdue',W*.66,150);
  ctx.font='italic 20px '+F_BODY;ctx.fillStyle='#d9a441';ctx.fillText("Une lettre, un pigeon empaillé, un siècle de retard.",W*.66,186);
  ctx.restore();
  drawMenu(W*.66,268,46);
  ctx.save();ctx.font='italic 15px '+F_BODY;ctx.fillStyle='rgba(233,223,199,.55)';ctx.textAlign='center';
  ctx.fillText('← → se déplacer · Espace sauter, rappuyer pour battre des ailes, maintenir pour planer',W*.66,H-46);
  ctx.fillText('Échap pause · R revenir au cartel · M couper le son',W*.66,H-24);
  ctx.restore();
}
function renderSelect(t){
  ensureTitleLv();const prev=L;L=titleLv;renderWorld(titleLv,200,60,t,{noEntities:true});L=prev;
  ctx.fillStyle='rgba(12,10,16,.84)';ctx.fillRect(0,0,W,H);
  ctx.save();ctx.textAlign='center';ctx.fillStyle='#efe5cc';ctx.font='32px '+F_DISP;ctx.fillText('Itinéraire de Raymond',W/2,52);
  ctx.font='italic 15px '+F_BODY;ctx.fillStyle='rgba(233,223,199,.6)';ctx.fillText('Vittoncourt → Verdun → Reims → A4 → Villemareuil',W/2,74);
  G.boxes=[];
  WORLDS.forEach((wd,wi)=>{
    const y=96+wi*86;ctx.textAlign='left';ctx.font='13px '+F_DISP;ctx.fillStyle=wi*4<=S.unlocked?'#d9a441':'rgba(233,223,199,.35)';ctx.fillText(`ÉTAPE ${wi+1} · ${wd.name.toUpperCase()}`,70,y+6);
    wd.levels.forEach((ln,lj)=>{
      const li=wi*4+lj,x=70+lj*210,yy=y+14,w=196,h=52;const open=li<=S.unlocked;const sel=li===G.sel;
      ctx.fillStyle=open?(sel?'#efe5cc':'#d8cdb2'):'rgba(233,223,199,.07)';rr(ctx,x,yy,w,h,6);ctx.fill();
      if(sel){ctx.strokeStyle='#d9a441';ctx.lineWidth=3;rr(ctx,x-3,yy-3,w+6,h+6,8);ctx.stroke()}
      ctx.fillStyle=open?'#2a2420':'rgba(233,223,199,.32)';ctx.font='13px '+F_DISP;ctx.fillText(`${wi+1}–${lj+1}`,x+10,yy+18);
      ctx.font='italic 16px '+F_BODY;ctx.fillText(ln,x+10,yy+40);
      const b=S.best[li];if(b){ctx.textAlign='right';ctx.font='12px '+F_DISP;ctx.fillText((b.medal?'✠ ':'')+`paille ${b.corn}`,x+w-8,yy+18);ctx.textAlign='left'}
      if(open)G.boxes.push({x,y:yy,w,h,i:li});
    });
  });
  ctx.textAlign='center';ctx.font='italic 15px '+F_BODY;ctx.fillStyle='rgba(233,223,199,.55)';ctx.fillText('Entrée pour partir · Échap pour revenir'+(S.infinite?' · paille illimitée':''),W/2,H-12);
  ctx.restore();
}
function handleSelect(){
  if(pressed.has('esc')||pressed.has('back')){goTitle();return}
  const max=Math.min(S.unlocked,19);
  if(pressed.has('left'))G.sel=Math.max(0,G.sel-1);
  if(pressed.has('right'))G.sel=Math.min(max,G.sel+1);
  if(pressed.has('up'))G.sel=Math.max(0,G.sel-4);
  if(pressed.has('down'))G.sel=Math.min(max,G.sel+4);
  const go=li=>{G.cutSeen=true;S.run.lives=S.run.worldLives[LEVELS[li].w]||START_LIVES;startLevel(li)};
  if(G.click)for(const b of G.boxes)if(G.click.x>b.x&&G.click.x<b.x+b.w&&G.click.y>b.y&&G.click.y<b.y+b.h){go(b.i);return}
  if(pressed.has('ok'))go(G.sel);
}
/* intertitres façon cinéma muet */
function drawTombCard(t){
  ctx.save();ctx.translate(W/2,H/2+20);
  ctx.fillStyle='#8a867e';rr(ctx,-170,-150,340,250,14);ctx.fill();ctx.fillStyle='#a19d94';ctx.beginPath();ctx.ellipse(0,-150,170,60,0,Math.PI,0);ctx.fill();
  ctx.fillStyle='rgba(0,0,0,.15)';for(let k=0;k<30;k++)ctx.fillRect(-160+((k*53)%320),-190+((k*37)%280),2,2);
  ctx.fillStyle='#2e2e32';ctx.fillRect(-3,-200,6,40);ctx.fillRect(-16,-188,32,6);
  ctx.fillStyle='rgba(30,30,34,.85)';ctx.textAlign='center';ctx.font='26px '+F_DISP;ctx.fillText('FAMILLE GARNIER',0,-104);
  ctx.fillRect(-60,-92,120,1.5);
  ctx.font='22px '+F_DISP;ctx.fillText('Joseph GARNIER',0,-60);ctx.font='18px '+F_DISP;ctx.fillText('1893 – 1958',0,-36);
  ctx.font='22px '+F_DISP;ctx.fillText('Marguerite GARNIER',0,6);ctx.font='italic 17px '+F_BODY;ctx.fillText('née Vasseur',0,28);ctx.font='18px '+F_DISP;ctx.fillText('1897 – 1989',0,52);
  for(let k=0;k<9;k++){ctx.fillStyle=['#c8302a','#e9dfc7','#d9a441'][k%3];ctx.beginPath();ctx.arc(-140+k*35,96,7,0,7);ctx.fill()}
  ctx.restore();
}
/* dernier plan : Raymond s'est éteint sur la tombe, travelling vers le pot de fleurs */
function drawFinaleCard(ct){
  const ease=u=>u<0?0:u>1?1:u*u*(3-2*u);
  const u=ease((ct-3.2)/5.5);
  const camX=lerp(300,680,u),zoom=lerp(1.45,2.3,u),gy=380;
  ctx.fillStyle='#07070b';ctx.fillRect(0,0,W,H);
  ctx.save();ctx.translate(W/2,H/2+30);ctx.scale(zoom,zoom);ctx.translate(-camX,-lerp(300,345,u));
  // ciel de nuit et lune voilée
  const sk=ctx.createLinearGradient(0,-200,0,gy);sk.addColorStop(0,'#0c1020');sk.addColorStop(1,'#26304a');ctx.fillStyle=sk;ctx.fillRect(-600,-300,2000,gy+300);
  ctx.fillStyle='rgba(230,235,255,.08)';ctx.beginPath();ctx.arc(120,40,90,0,7);ctx.fill();ctx.fillStyle='#d8dcea';ctx.beginPath();ctx.arc(120,40,26,0,7);ctx.fill();
  const R=mulberry(91);ctx.fillStyle='rgba(255,255,255,.6)';for(let k=0;k<60;k++)ctx.fillRect(-500+R()*1800,-250+R()*380,1.2,1.2);
  // tombes au loin, cyprès
  for(let k=0;k<14;k++){const x=-500+k*140+R()*60,h=30+R()*30;ctx.fillStyle='#161a26';if(R()<.5){ctx.fillRect(x-3,gy-h-24,6,h+24);ctx.fillRect(x-14,gy-h-12,28,6)}else{ctx.beginPath();ctx.moveTo(x-16,gy);ctx.lineTo(x-16,gy-h);ctx.arc(x,gy-h,16,Math.PI,0);ctx.lineTo(x+16,gy);ctx.fill()}}
  ctx.fillStyle='#10131c';for(const x of[-260,910,1180]){ctx.beginPath();ctx.ellipse(x,gy-90,26,95,0,0,7);ctx.fill()}
  ctx.fillStyle='#1a2018';ctx.fillRect(-600,gy,2000,200);ctx.fillStyle='#232b20';ctx.fillRect(-600,gy,2000,6);
  // la tombe Garnier : stèle et dalle
  const top=gy-46;
  ctx.fillStyle='#6f6c66';rr(ctx,96,gy-190,62,190,8);ctx.fill();ctx.fillStyle='#86837c';rr(ctx,100,gy-186,54,8,3);ctx.fill();
  ctx.fillStyle='#2e2e32';ctx.fillRect(125,gy-232,4,46);ctx.fillRect(115,gy-222,24,4);
  ctx.fillStyle='rgba(30,30,34,.8)';ctx.font='9px '+F_DISP;ctx.textAlign='center';ctx.fillText('FAMILLE',127,gy-160);ctx.fillText('GARNIER',127,gy-148);
  ctx.font='6px '+F_DISP;ctx.fillText('JOSEPH',127,gy-124);ctx.fillText('1893 – 1958',127,gy-116);ctx.fillText('MARGUERITE',127,gy-100);ctx.fillText('née VASSEUR',127,gy-92);ctx.fillText('1897 – 1989',127,gy-84);
  ctx.fillStyle='#5a5852';ctx.fillRect(150,top,470,46);ctx.fillStyle='#7c7972';ctx.fillRect(146,top-8,478,10);
  ctx.fillStyle='rgba(255,255,255,.07)';ctx.fillRect(146,top-8,478,2);
  ctx.fillStyle='rgba(0,0,0,.12)';for(let k=0;k<40;k++)ctx.fillRect(150+R()*466,top+R()*44,2,2);
  // la lettre de Lucien, posée sur la pierre
  ctx.save();ctx.translate(390,top-9);ctx.rotate(-.08);ctx.fillStyle='#e6dcc0';ctx.fillRect(-16,-6,32,6);ctx.fillStyle='#cfc3a3';ctx.fillRect(-16,-6,32,1.5);ctx.strokeStyle='#a8322d';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,-6);ctx.lineTo(0,0);ctx.stroke();ctx.restore();
  // Raymond, couché sur la dalle, l'œil fermé
  ctx.save();ctx.beginPath();ctx.rect(-600,-300,2000,top-8+300);ctx.clip();
  drawRaymond(ctx,330,top-8+18,{f:1,t:0,walk:0,wear:S.run.wear||0,size:1.9,eyeClosed:true,rot:.38,sy:.72});
  ctx.restore();
  // pot de chrysanthèmes au pied de la tombe
  const vx=650;
  ctx.fillStyle='#8a4a2a';ctx.beginPath();ctx.moveTo(vx-22,gy-50);ctx.lineTo(vx+22,gy-50);ctx.lineTo(vx+16,gy);ctx.lineTo(vx-16,gy);ctx.closePath();ctx.fill();
  ctx.fillStyle='#a05a34';ctx.fillRect(vx-24,gy-54,48,8);ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(vx+6,gy-46,10,46);
  ctx.strokeStyle='#2e4a28';ctx.lineWidth=2;for(let k=-3;k<=3;k++){ctx.beginPath();ctx.moveTo(vx+k*4,gy-52);ctx.lineTo(vx+k*9,gy-82-Math.abs(k)*2);ctx.stroke()}
  for(let k=-3;k<=3;k++){const fx=vx+k*9,fy=gy-86-Math.abs(k)*2+Math.sin(ct*.8+k)*.6;ctx.fillStyle=['#d9a441','#e9dfc7','#c8302a'][(k+3)%3];for(let p=0;p<10;p++){const a=p/10*Math.PI*2;ctx.beginPath();ctx.ellipse(fx+Math.cos(a)*5,fy+Math.sin(a)*5,3.2,1.6,a,0,7);ctx.fill()}ctx.fillStyle='#8a5a1a';ctx.beginPath();ctx.arc(fx,fy,2.6,0,7);ctx.fill()}
  // l'enveloppe jaunie, appuyée contre le pot, jamais envoyée
  ctx.save();ctx.translate(vx+44,gy);ctx.rotate(-.16);
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(-30,-2,62,4);
  ctx.fillStyle='#e2d3a8';ctx.fillRect(-31,-40,62,40);ctx.fillStyle='#d1bf8f';poly(ctx,[-31,-40,31,-40,0,-22]);ctx.fill();
  ctx.fillStyle='rgba(120,90,40,.22)';ctx.beginPath();ctx.arc(-18,-10,8,0,7);ctx.fill();ctx.beginPath();ctx.arc(22,-6,5,0,7);ctx.fill();
  ctx.fillStyle='#b8302a';ctx.fillRect(19,-37,9,11);ctx.strokeStyle='rgba(40,30,20,.5)';ctx.lineWidth=.6;ctx.beginPath();ctx.arc(17,-31,6,0,7);ctx.stroke();
  ctx.fillStyle='#2a2420';ctx.font='italic 4.9px '+F_BODY;ctx.textAlign='left';
  ctx.fillText('Au soldat Lucien Marchal',-26,-16);ctx.fillText("151e régiment d'infanterie",-26,-9);ctx.fillText('Verdun',-26,-2.5);
  ctx.restore();
  // brume au sol
  ctx.fillStyle='rgba(180,190,220,.06)';for(let k=0;k<6;k++){ctx.beginPath();ctx.ellipse(-200+k*260+Math.sin(ct*.15+k)*30,gy-6,200,18,0,0,7);ctx.fill()}
  ctx.restore();
  // vignette et fondu d'entrée
  const vg=ctx.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,H*.9);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.7)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#000';ctx.fillRect(0,0,W,40);ctx.fillRect(0,H-40,W,40);
  if(ct<1.6){ctx.fillStyle='rgba(0,0,0,'+(1-ct/1.6)+')';ctx.fillRect(0,0,W,H)}
  if(ct>10){ctx.font='italic 14px '+F_BODY;ctx.fillStyle='rgba(233,223,199,'+Math.min(.45,(ct-10)*.3)+')';ctx.textAlign='right';ctx.fillText('appuyer pour continuer',W-24,H-16)}
}
function drawBannerCard(t){
  ctx.save();ctx.translate(W/2,H/2);
  const sw=Math.sin(t*1.5)*3;
  ctx.fillStyle='#2a4a8a';ctx.fillRect(-380,-70+sw,760,10);ctx.fillStyle='#efe6d0';ctx.fillRect(-380,-60+sw,760,110);ctx.fillStyle='#b8302a';ctx.fillRect(-380,50+sw,760,10);
  ctx.fillStyle='#2a2420';ctx.textAlign='center';ctx.font='18px '+F_DISP;ctx.fillText('COMMUNE DE VILLEMAREUIL',0,-26+sw);
  ctx.font='30px '+F_DISP;ctx.fillText('110e ANNIVERSAIRE DE LA BATAILLE DE VERDUN',0,12+sw);
  ctx.font='24px '+F_DISP;ctx.fillStyle='#a8322d';ctx.fillText('1916 – 2026',0,42+sw);
  ctx.strokeStyle='#4a3a2a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-380,-70+sw);ctx.lineTo(-420,-200);ctx.moveTo(380,-70+sw);ctx.lineTo(420,-200);ctx.stroke();
  ctx.restore();
}
function renderCards(t){
  const c=G.cards[G.card];const fl=.94+rnd()*.06;
  ctx.fillStyle='#0b0a0c';ctx.fillRect(0,0,W,H);
  ctx.save();
  ctx.globalAlpha=fl*Math.min(1,G.cardT*2.2);
  ctx.strokeStyle='#d9cfb4';ctx.lineWidth=2;ctx.strokeRect(70,46,W-140,H-92);ctx.lineWidth=1;ctx.strokeRect(80,56,W-160,H-112);
  for(const[x,y,sx,sy]of[[80,56,1,1],[W-80,56,-1,1],[80,H-56,1,-1],[W-80,H-56,-1,-1]]){ctx.beginPath();ctx.moveTo(x,y+sy*30);ctx.quadraticCurveTo(x+sx*4,y+sy*4,x+sx*30,y);ctx.moveTo(x+sx*8,y+sy*18);ctx.arc(x+sx*14,y+sy*14,5,0,7);ctx.stroke()}
  ctx.fillStyle='#ece3cc';ctx.textAlign='center';
  if(c.pic==='finale'){ctx.restore();ctx.save();drawFinaleCard(G.cardT)}
  else if(c.pic==='tomb')drawTombCard(t);
  else if(c.pic==='banner')drawBannerCard(t);
  else{
    let y=c.pic?150:H/2-20;
    if(c.pic==='dome'){drawDome(ctx,W/2,250,.62,t);y=330}
    ctx.fillStyle='#ece3cc';
    if(c.title){ctx.font='34px '+F_DISP;ctx.fillText(c.title,W/2,c.pic?y:y-50);y+=c.pic?38:0}
    if(c.t){ctx.font='italic 25px '+F_BODY;const lines=wrap(ctx,c.t,680);const y0=c.pic?y:H/2-(lines.length-1)*17+(c.title?14:0);lines.forEach((l,k)=>ctx.fillText(l,W/2,y0+k*34))}
  }
  ctx.restore();
  for(let k=0;k<2;k++){if(rnd()<.3){ctx.fillStyle='rgba(230,220,200,'+(rnd()*.1)+')';ctx.fillRect(rnd()*W,0,1+rnd(),H)}}
  if(G.cardT>.8&&c.pic!=='finale'){ctx.font='italic 14px '+F_BODY;ctx.fillStyle='rgba(233,223,199,'+(.4+Math.sin(t*3)*.2)+')';ctx.textAlign='right';ctx.fillText('appuyer pour continuer · Échap pour passer',W-90,H-22)}
}
function handleCards(dt){
  G.cardT+=dt;
  if(pressed.has('esc')){finishCards();return}
  if((pressed.has('ok')||pressed.has('jump')||G.click)&&G.cardT>(G.cards[G.card].minT||.35)){G.card++;G.cardT=0;SFX.page();if(G.card>=G.cards.length)finishCards()}
}
function finishCards(){const f=G.cardsDone;G.cardsDone=null;f&&f()}
/* lettre de Lucien */
function tokens(text){return text.split(' ').map(w=>{const s=/^~.*~[.,]?$/.test(w);return{w:w.replace(/~/g,''),s}})}
function renderLetter(t){
  const LE=G.LE,def=LEVELS[LE.li],fx=def.letter.fx;
  ctx.fillStyle='#1a120c';ctx.fillRect(0,0,W,H);
  ctx.save();ctx.globalAlpha=.22;ctx.fillStyle=ctx.createPattern(paperC,'repeat');ctx.fillRect(0,0,W,H);ctx.restore();
  for(let k=0;k<12;k++){ctx.fillStyle='rgba(0,0,0,.12)';ctx.fillRect(0,k*48,W,2)}
  const gl=ctx.createRadialGradient(W*.45,H*.35,40,W*.45,H*.35,560);gl.addColorStop(0,'rgba(255,200,120,.22)');gl.addColorStop(1,'rgba(0,0,0,.5)');ctx.fillStyle=gl;ctx.fillRect(0,0,W,H);
  ctx.save();ctx.translate(W/2-10,200);ctx.rotate(-.025);
  const pw=620,ph=280,verso=fx==='verso';
  ctx.fillStyle='rgba(0,0,0,.45)';ctx.fillRect(-pw/2+10,-ph/2+12,pw,ph);
  const pg=ctx.createRadialGradient(0,0,80,0,0,380);pg.addColorStop(0,verso?'#e2d5b2':'#eadfc2');pg.addColorStop(1,verso?'#bca878':'#c9b386');ctx.fillStyle=pg;
  ctx.beginPath();ctx.moveTo(-pw/2,-ph/2);for(let x=-pw/2;x<=pw/2;x+=15)ctx.lineTo(x,-ph/2+((x*13)%4)-1);ctx.lineTo(pw/2,ph/2);for(let x=pw/2;x>=-pw/2;x-=15)ctx.lineTo(x,ph/2+((x*7)%4)-1);ctx.closePath();ctx.fill();
  ctx.save();ctx.clip();ctx.globalAlpha=.35;ctx.fillStyle=ctx.createPattern(paperC,'repeat');ctx.fillRect(-pw/2,-ph/2,pw,ph);ctx.restore();
  if(verso){ctx.save();ctx.scale(-1,1);ctx.globalAlpha=.1;ctx.fillStyle='#2a2f5a';ctx.font='26px '+F_HAND;for(let k=0;k<5;k++)ctx.fillText('Marguerite, je t\'écris pour te dire',-pw/2+40,-ph/2+60+k*40);ctx.restore();
    ctx.fillStyle='rgba(60,60,70,.55)';ctx.font='italic 13px '+F_BODY;ctx.textAlign='right';ctx.fillText('(au dos, au crayon, à demi effacé par la pluie)',pw/2-30,ph/2-14);ctx.textAlign='left';
    ctx.fillStyle='rgba(90,110,140,.12)';for(let k=0;k<7;k++){ctx.beginPath();ctx.ellipse(-pw/2+60+k*80,-ph/2+40+((k*53)%180),18,30,0,0,7);ctx.fill()}}
  ctx.strokeStyle='rgba(120,90,50,.25)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,-ph/2);ctx.lineTo(0,ph/2);ctx.moveTo(-pw/2,0);ctx.lineTo(pw/2,0);ctx.stroke();
  ctx.strokeStyle='rgba(60,70,120,.12)';ctx.lineWidth=1;for(let y=-ph/2+70;y<ph/2-20;y+=40){ctx.beginPath();ctx.moveTo(-pw/2+30,y);ctx.lineTo(pw/2-30,y);ctx.stroke()}
  const ink=verso?'#4a4a56':'#2a2f5a';
  ctx.fillStyle=ink;ctx.strokeStyle=ink;ctx.textAlign='left';
  let y=-ph/2+52;
  const head=def.letter.date||'';
  ctx.font='26px '+F_HAND;
  let budget=Math.floor(LE.chars);
  if(head){ctx.textAlign='right';ctx.fillText(head.slice(0,budget),pw/2-40,y);budget-=head.length;ctx.textAlign='left';y+=44}
  const toks=tokens((LE.li===0?'':'… ')+def.letter.text);
  ctx.font='29px '+F_HAND;
  let x=-pw/2+44,ci=0;const maxX=pw/2-40,sp=ctx.measureText(' ').width;
  for(const tk of toks){
    if(budget<=0)break;
    const full=ctx.measureText(tk.w).width;
    if(x+full>maxX){x=-pw/2+44;y+=40}
    const s=tk.w.slice(0,Math.max(0,budget));
    if(fx==='shaky'){let xx=x;for(const ch of s){const j=Math.sin(ci*7.3+t*14)*1.6;ctx.fillText(ch,xx+j*.5,y+j);xx+=ctx.measureText(ch).width;ci++}}
    else ctx.fillText(s,x,y);
    if(tk.s&&budget>=tk.w.length){ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-2,y-9);ctx.lineTo(x+full+2,y-11);ctx.moveTo(x-1,y-6);ctx.lineTo(x+full+1,y-8);ctx.stroke()}
    budget-=tk.w.length+1;x+=full+sp;
  }
  if(fx==='blot'&&LE.done){ctx.fillStyle='rgba(42,47,90,.5)';ctx.beginPath();for(let k=0;k<=20;k++){const a=k/20*Math.PI*2,r=26+Math.sin(k*3.7)*7;ctx.lineTo(70+Math.cos(a)*r,-30+Math.sin(a)*r*.8)}ctx.fill();ctx.fillStyle='rgba(42,47,90,.18)';ctx.beginPath();ctx.arc(70,-30,48,0,7);ctx.fill()}
  ctx.restore();
  if(LE.done){
    const a=Math.min(1,LE.after*1.6);
    ctx.save();ctx.globalAlpha=a;
    drawRaymond(ctx,128,H-44,{f:1,t,walk:0,wear:wear(),size:1.6});
    ctx.font='italic 20px '+F_BODY;ctx.fillStyle='#ece3cc';ctx.textAlign='left';
    if(def.letter.silent){ctx.fillStyle='rgba(233,223,199,.55)';ctx.fillText('Raymond ne dit rien.',190,H-115)}
    else{const lines=wrap(ctx,def.letter.comment,620);lines.forEach((l,k)=>ctx.fillText(l,190,H-140+k*25))}
    ctx.font='14px '+F_DISP;ctx.fillStyle='#d9a441';
    ctx.fillText(`PAILLE RAMASSÉE ${LE.corn} / ${LE.cornTotal}   ·   MÉDAILLE ${LE.medal?'TROUVÉE':'NON TROUVÉE'}   ·   CHUTES : ${LE.deaths}`,190,H-36);
    if(LE.after>.8){ctx.font='italic 15px '+F_BODY;ctx.fillStyle='rgba(233,223,199,'+(.45+Math.sin(t*3)*.2)+')';ctx.textAlign='right';ctx.fillText('appuyer pour continuer ▸',W-24,H-12)}
    ctx.restore();
  }else{
    ctx.font='italic 15px '+F_BODY;ctx.fillStyle='rgba(233,223,199,.45)';ctx.textAlign='right';ctx.fillText('Raymond lit le courrier. Ce n\'est pas réglementaire.',W-24,H-16);
  }
}
function handleLetter(dt){
  const LE=G.LE,def=LEVELS[LE.li];
  const total=(def.letter.date||'').length+tokens((LE.li===0?'':'… ')+def.letter.text).reduce((s,t)=>s+t.w.length+1,0);
  const go=pressed.has('ok')||pressed.has('jump')||G.click;
  if(!LE.done){const before=Math.floor(LE.chars);LE.chars+=dt*30;if(Math.floor(LE.chars)!==before&&Math.floor(LE.chars)%3===0)noise(.03,2600,.04,'highpass');if(go)LE.chars=total;if(LE.chars>=total){LE.done=true;LE.after=0}}
  else{LE.after+=dt;if(go&&LE.after>.5)afterLetter(LE.li)}
}
function afterLetter(li){
  G.cutSeen=true;
  if(li===19){S.finished=true;save();G.state='intro';G.cards=ENDING;G.card=0;G.cardT=0;G.fade=1;G.cardsDone=()=>goTitle();setSong('s5-4');return}
  if(li%4===3){
    const w=LEVELS[li].w;let bonus=0;for(let k=w*4;k<w*4+4;k++)if(S.run.medals[k])bonus++;
    S.run.lives=Math.max(0,S.run.lives)+bonus;S.run.worldLives[w+1]=S.run.lives;save();
    const cards=WORLD_CARDS[w+1].slice();
    cards.splice(cards.length-1,0,{title:"RAVITAILLEMENT",t:bonus?`Médailles trouvées pendant cette étape : ${bonus}.\nRaymond gagne ${bonus} poignée${bonus>1?'s':''} de paille de réserve.`:"Aucune médaille pendant cette étape.\nPas de paille de réserve en plus. Le règlement est sévère."});
    G.state='intro';G.cards=cards;G.card=0;G.cardT=0;G.fade=1;G.cardsDone=()=>startLevel(li+1);setSong('title');return;
  }
  startLevel(li+1);
}
