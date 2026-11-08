/* =========================================================
   ÉCRANS : titre, itinéraire, intertitres, lettre, enchaînements
   ========================================================= */
let titleLv=null;
function ensureTitleLv(){
  computeRS();
  if(!titleLv||titleLv.rs!==RS){const tmp=parseLevel(0);const lay=loadLayers(0);const prev=L;L=tmp;tmp.far=lay.far;tmp.mid=lay.mid;tmp.windows=lay.windows;tmp.turbines=[];tmp.tiles=buildTiles(tmp);tmp.dome=null;L=prev;tmp.rs=RS;titleLv=tmp}
}
function newRun(){S.run={lives:START_LIVES,worldLives:[START_LIVES],medals:{},wear:0,stats:{},got:{}};save()}
function freshRun(){if(S.run.lives==null||S.run.lives<0)S.run.lives=START_LIVES}
function menuItems(){
  if(G.state==='title'){
    const it=[{label:'Nouvelle partie',act:()=>{newRun();startIntro()}}];
    if(S.unlocked>0)it.push({label:'Continuer',act:()=>{G.cutSeen=true;const li=Math.min(S.resume!=null?S.resume:S.unlocked,19);freshRun();startLevel(li)}});
    it.push({label:'Choisir un niveau',act:openSelect});
    if(Object.keys(achState()).length)it.push({label:'Succès',act:openAch});
    it.push({label:'Paramètres',act:openSettings});
    return it;
  }
  if(G.state==='pause')return[{label:'Reprendre',act:()=>G.state='play'},{label:'Recommencer le niveau',act:()=>{G.cutSeen=G.cutSeen||G.li>0;startLevel(G.li)}},{label:'Choisir un niveau',act:openSelect},{label:"Retour à l'accueil",act:askHome},{label:S.muted?'Son : coupé':'Son : activé',act:toggleMute}];
  return[];
}
function selectOpen(i){if(S.infinite)return true;if(i===100)return true;if(i===101)return !!S.finished;return i<=S.unlocked}
/* retour à l'accueil en pleine mission : l'avancement et les scores de la mission sont perdus */
function abandonMission(){const w=LEVELS[G.li].w;for(let k=w*4;k<w*4+4;k++){delete S.run.stats[k];if(S.run.got)delete S.run.got[k]}S.resume=w*4;save();G.chase=false;goTitle()}
function askHome(){G.confirm={prev:G.state,text:"Retourner à l'accueil ?",sub:"L'avancement et les points de cette mission seront perdus. Raymond reprendra au début de la mission."};G.state='confirm';G.confirmSel=0}
function handleConfirm(){
  const C=G.confirm,yes=()=>{G.confirm=null;abandonMission()},no=()=>{G.state=C.prev;G.confirm=null};
  if(pressed.has('esc')||pressed.has('back')){no();return}
  if(pressed.has('left')||pressed.has('right')||pressed.has('up')||pressed.has('down'))G.confirmSel=1-G.confirmSel;
  if(G.click&&G.confirmBoxes)for(const b of G.confirmBoxes)if(G.click.x>b.x&&G.click.x<b.x+b.w&&G.click.y>b.y&&G.click.y<b.y+b.h){b.i?yes():no();return}
  if(pressed.has('ok'))G.confirmSel?yes():no();
}
function renderConfirm(){
  const C=G.confirm;if(!C)return;ctx.fillStyle='rgba(10,8,14,.78)';ctx.fillRect(0,0,W,H);
  ctx.save();ctx.translate(W/2,H/2);ctx.fillStyle='#ece3cc';rr(ctx,-250,-100,500,200,8);ctx.fill();ctx.strokeStyle='rgba(42,36,32,.5)';rr(ctx,-243,-93,486,186,5);ctx.stroke();
  ctx.fillStyle='#2a2420';ctx.textAlign='center';ctx.font='26px '+F_DISP;ctx.fillText(C.text,0,-48);
  ctx.font='italic 16px '+F_BODY;wrap(ctx,C.sub,420).forEach((l,k)=>ctx.fillText(l,0,-16+k*21));
  G.confirmBoxes=[];[['Rester',0],["Retour à l'accueil",1]].forEach(([lb,i])=>{const bx=i?20:-200,by=46;const sel=G.confirmSel===i;ctx.fillStyle=sel?'#2a2420':'rgba(42,36,32,.12)';rr(ctx,bx,by,180,36,6);ctx.fill();ctx.fillStyle=sel?'#ece3cc':'#2a2420';ctx.font='17px '+F_DISP;ctx.fillText(lb,bx+90,by+24);G.confirmBoxes.push({x:W/2+bx,y:H/2+by,w:180,h:36,i})});
  ctx.restore();
}
function goTitle(){G.state='title';G.menuSel=0;G.fade=1;setSong('title');loopsOff()}
function openSelect(){G.state='select';G.sel=Math.min(S.unlocked,19);G.fade=1;setSong('title');loopsOff()}
function startIntro(){G.state='intro';G.cards=INTRO;G.card=0;G.cardT=0;G.cutSeen=false;G.cardsDone=()=>{unlock('a1');startLevel(0)};G.fade=1;setSong('title')}
function handleMenu(){
  const it=menuItems();if(!it.length)return;
  if(pressed.has('up'))G.menuSel=(G.menuSel-1+it.length)%it.length;
  if(pressed.has('down'))G.menuSel=(G.menuSel+1)%it.length;
  if(G.click){
    // l'œil de Raymond : quatre clics rapprochés, il roucoule, et les modes Super-Raymond et Dieu-Pigeon apparaissent dans les paramètres
    if(G.state==='title'){const ex=W*.3+11*3.2,ey=460-29.5*3.2;if(Math.hypot(G.click.x-ex,G.click.y-ey)<16){
      if(G.t-(G.eyeT||-9)>1.4)G.eyeN=0;G.eyeT=G.t;G.eyeN=(G.eyeN||0)+1;G.wink=.18;SFX.tick();
      if(G.eyeN>=4){G.eyeN=0;S.modesShown=true;save();SFX.coo();G.wink=.9;unlock('a81')}return}}
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
  ctx.restore();
  drawMenu(W*.66,268,46);
  ctx.save();ctx.font='italic 15px '+F_BODY;ctx.fillStyle='rgba(233,223,199,.55)';ctx.textAlign='center';
  ctx.fillText('© KikinatsetProduction - 2026',W*.66,H-24);
  ctx.restore();
}
function renderSelect(t){
  ensureTitleLv();const prev=L;L=titleLv;renderWorld(titleLv,200,60,t,{noEntities:true});L=prev;
  ctx.fillStyle='rgba(12,10,16,.84)';ctx.fillRect(0,0,W,H);
  ctx.save();ctx.textAlign='center';ctx.fillStyle='#efe5cc';ctx.font='30px '+F_DISP;ctx.fillText('Itinéraire de Raymond',W/2,46);
  G.boxes=[];
  const tile=(i,x,yy,w,h,top,bottom)=>{const sel=i===G.sel,open=selectOpen(i);
    ctx.save();if(!open)ctx.globalAlpha=.35;ctx.fillStyle=sel?'#efe5cc':'#d8cdb2';rr(ctx,x,yy,w,h,6);ctx.fill();
    if(sel){ctx.strokeStyle='#d9a441';ctx.lineWidth=3;rr(ctx,x-3,yy-3,w+6,h+6,8);ctx.stroke()}
    ctx.fillStyle='#2a2420';ctx.textAlign='left';
    if(bottom){ctx.font='12px '+F_DISP;ctx.fillText(top,x+10,yy+16);ctx.font='italic 15px '+F_BODY;ctx.fillText(bottom,x+10,yy+35)}
    else{ctx.font='italic 15px '+F_BODY;ctx.textAlign='center';ctx.fillText(top,x+w/2,yy+h/2+5)}
    ctx.restore();G.boxes.push({x,y:yy,w,h,i})};
  WORLDS.forEach((wd,wi)=>{
    const y=82+wi*64;ctx.textAlign='left';ctx.font='12px '+F_DISP;ctx.fillStyle='#d9a441';ctx.fillText(`MISSION ${wi+1} · ${wd.name.toUpperCase()}`,70,y+6);
    wd.levels.forEach((ln,lj)=>{
      const li=wi*4+lj,x=70+lj*210,yy=y+12;
      tile(li,x,yy,196,44,`${wi+1}–${lj+1}`,(li<=S.unlocked||S.best[li])?ln:'?????');
      const b=S.best[li];if(b){ctx.textAlign='right';ctx.font='11px '+F_DISP;ctx.fillStyle='#2a2420';ctx.fillText((b.medal?'✠ ':'')+`paille ${b.corn}`,x+188,yy+16)}
    });
  });
  tile(100,70,480,406,28,"Revoir l'introduction");
  tile(101,484,480,406,28,'Revoir la fin');
  ctx.textAlign='center';ctx.font='italic 14px '+F_BODY;ctx.fillStyle='rgba(233,223,199,.55)';ctx.fillText('Entrée pour lancer · Échap pour revenir',W/2,H-12);
  ctx.restore();
}
function handleSelect(){
  if(pressed.has('esc')||pressed.has('back')){goTitle();return}
  const s=G.sel;
  const NL=LEVELS.length;
  if(pressed.has('left'))G.sel=s===101?100:s<100?Math.max(0,s-1):s;
  if(pressed.has('right'))G.sel=s===100?101:s<100?Math.min(NL-1,s+1):s;
  if(pressed.has('up'))G.sel=s>=100?NL-1-((NL-1)%4)+(s===101?Math.min(3,(NL-1)%4):0):(s-4>=0?s-4:s);
  if(pressed.has('down'))G.sel=s<100?(s+4<NL?s+4:(s%4<2?100:101)):s;
  const go=li=>{
    if(!selectOpen(li)){tone(200,.1,'square',.04);return}
    if(li===100){startIntro();return}
    if(li===101){G.state='intro';G.cards=ENDING;G.card=0;G.cardT=0;G.fade=1;G.cardsDone=()=>openSelect();setSong('s5-4');return}
    G.cutSeen=li>0;S.run.wear=0;save();startLevel(li)};
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
function engrave(txt,x,y,font){ctx.font=font;ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillText(txt,x,y+1);ctx.fillStyle='rgba(255,255,255,.10)';ctx.fillText(txt,x,y-.6);ctx.fillStyle='#c8a75e';ctx.fillText(txt,x,y)}
function granite(x,y,w,h,c0,c1,seed){
  const gr=ctx.createLinearGradient(x,y,x+w,y+h);gr.addColorStop(0,c0);gr.addColorStop(1,c1);ctx.fillStyle=gr;ctx.fillRect(x,y,w,h);
  const R=mulberry(seed);for(let k=0;k<w*h/60;k++){ctx.fillStyle=R()<.5?'rgba(0,0,0,.14)':'rgba(255,255,255,.08)';ctx.fillRect(x+R()*w,y+R()*h,1.3,1.3)}
}
function drawFinaleCard(ct){
  const ease=u=>u<0?0:u>1?1:u*u*(3-2*u);
  const u=ease((ct-3.4)/6);
  const gy=330;                      // pied de la tombe
  const camX=lerp(-30,422,u),camY=lerp(gy-168,gy-16,u),zoom=lerp(1.3,3.2,u);
  ctx.fillStyle='#06060a';ctx.fillRect(0,0,W,H);
  ctx.save();ctx.translate(W/2,H/2);ctx.scale(zoom,zoom);ctx.translate(-camX,-camY);
  const R=mulberry(57);
  // ciel, lune, étoiles
  const sk=ctx.createLinearGradient(0,-120,0,gy-40);sk.addColorStop(0,'#0a0e1c');sk.addColorStop(1,'#2a3350');ctx.fillStyle=sk;ctx.fillRect(-900,-200,2200,gy+60);
  ctx.fillStyle='rgba(225,230,255,.07)';ctx.beginPath();ctx.arc(-300,-20,110,0,7);ctx.fill();ctx.fillStyle='rgba(225,230,255,.10)';ctx.beginPath();ctx.arc(-300,-20,55,0,7);ctx.fill();
  ctx.fillStyle='#dfe2ee';ctx.beginPath();ctx.arc(-300,-20,24,0,7);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.55)';for(let k=0;k<90;k++)ctx.fillRect(-900+R()*2200,-180+R()*260,1,1);
  // mur du cimetière, clocher au loin, cyprès, rangée de tombes
  ctx.fillStyle='#141824';ctx.fillRect(-900,gy-128,2200,60);ctx.fillStyle='#1a1f2c';ctx.fillRect(-900,gy-132,2200,6);
  ctx.fillStyle='#10131c';ctx.fillRect(560,gy-250,34,130);poly(ctx,[556,gy-250,598,gy-250,577,gy-300]);ctx.fill();
  for(const x of[-520,-380,470,720]){ctx.fillStyle='#0d1018';ctx.beginPath();ctx.ellipse(x,gy-150,22,90,0,0,7);ctx.fill()}
  for(let k=0;k<16;k++){const x=-860+k*130+R()*40;if(Math.abs(x)<260)continue;const h=36+R()*26,w=40+R()*16;ctx.fillStyle='#1c2130';
    ctx.fillRect(x-w/2,gy-68-h,w,h);ctx.fillStyle='#232a3a';ctx.fillRect(x-w/2-6,gy-70,w+12,12);
    if(R()<.5){ctx.fillStyle='#161a26';ctx.fillRect(x-2,gy-68-h-18,4,18);ctx.fillRect(x-8,gy-68-h-12,16,4)}}
  // allée de gravier
  const gv=ctx.createLinearGradient(0,gy-70,0,gy+140);gv.addColorStop(0,'#2a2c2c');gv.addColorStop(1,'#3e3f3a');ctx.fillStyle=gv;ctx.fillRect(-900,gy-70,2200,240);
  for(let k=0;k<900;k++){const x=-700+R()*1600,y=gy-66+R()*200;ctx.fillStyle=R()<.5?'rgba(255,255,255,.10)':'rgba(0,0,0,.25)';ctx.fillRect(x,y,1.6,1.1)}
  // --- la tombe Garnier, vue de face ---
  // ombre portée
  ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(10,gy+4,210,16,0,0,7);ctx.fill();
  // stèle (au fond)
  const sx0=-112,sx1=112,stTop=gy-300,stBot=gy-66;
  ctx.fillStyle='#45433f';poly(ctx,[sx1,stTop+30,sx1+12,stTop+38,sx1+12,stBot,sx1,stBot]);ctx.fill(); // tranche droite
  ctx.save();ctx.beginPath();ctx.moveTo(sx0,stBot);ctx.lineTo(sx0,stTop+30);ctx.quadraticCurveTo(0,stTop-14,sx1,stTop+30);ctx.lineTo(sx1,stBot);ctx.closePath();ctx.clip();
  granite(sx0,stTop-20,sx1-sx0,stBot-stTop+20,'#86837c','#5f5c57',11);
  ctx.fillStyle='rgba(255,255,255,.08)';ctx.fillRect(sx0,stTop-20,5,stBot-stTop+20);
  ctx.restore();
  ctx.strokeStyle='rgba(255,255,255,.15)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(sx0,stTop+30);ctx.quadraticCurveTo(0,stTop-14,sx1,stTop+30);ctx.stroke();
  // croix de bronze
  ctx.fillStyle='#3e4a44';ctx.fillRect(-4,stTop-50,8,46);ctx.fillRect(-17,stTop-38,34,7);ctx.fillStyle='rgba(160,200,180,.25)';ctx.fillRect(-4,stTop-50,2,46);
  // gravure dorée sur la face
  ctx.textAlign='center';
  engrave('FAMILLE GARNIER',0,stTop+50,'15px '+F_DISP);
  ctx.fillStyle='#c8a75e';ctx.fillRect(-40,stTop+58,80,1);
  engrave('Joseph GARNIER',0,stTop+88,'12px '+F_DISP);engrave('1893 – 1958',0,stTop+104,'10px '+F_DISP);
  engrave('Marguerite GARNIER',0,stTop+134,'12px '+F_DISP);engrave('née VASSEUR',0,stTop+148,'italic 9.5px '+F_BODY);engrave('1897 – 1989',0,stTop+164,'10px '+F_DISP);
  // plaque en porcelaine
  ctx.fillStyle='#d8d2c4';rr(ctx,-30,stTop+186,60,26,4);ctx.fill();ctx.strokeStyle='#8a7a52';ctx.lineWidth=1;rr(ctx,-28,stTop+188,56,22,3);ctx.stroke();
  ctx.fillStyle='#4a3e2e';ctx.font='italic 7px '+F_BODY;ctx.fillText('À nos parents',0,stTop+199);ctx.fillText('regrettés',0,stTop+207);
  // dalle : dessus en perspective + face avant
  const bk=gy-66,fr=gy-24;
  ctx.fillStyle='#4a4844';poly(ctx,[150,bk,170,fr,182,fr+6,182,gy,170,gy]);ctx.fill();
  const tg=ctx.createLinearGradient(0,bk,0,fr);tg.addColorStop(0,'#77746d');tg.addColorStop(1,'#99968e');ctx.fillStyle=tg;poly(ctx,[-150,bk,150,bk,170,fr,-170,fr]);ctx.fill();
  ctx.save();poly(ctx,[-150,bk,150,bk,170,fr,-170,fr]);ctx.clip();const R2=mulberry(23);for(let k=0;k<500;k++){ctx.fillStyle=R2()<.5?'rgba(0,0,0,.12)':'rgba(255,255,255,.08)';ctx.fillRect(-170+R2()*340,bk+R2()*44,1.3,1.3)}
  ctx.fillStyle='rgba(220,230,255,.10)';poly(ctx,[-120,bk+4,-40,bk+4,-60,fr-4,-150,fr-4]);ctx.fill();ctx.restore();
  ctx.fillStyle='rgba(255,255,255,.18)';ctx.fillRect(-170,fr-1,340,1.5);
  granite(-170,fr,340,gy-fr,'#6b6863','#55524d',31);
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(-170,gy-3,340,3);
  // lichen
  ctx.fillStyle='rgba(150,170,110,.25)';for(const[x,y,r]of[[-150,gy-8,5],[120,gy-14,4],[-100,stBot-6,6],[90,stTop+40,3]]){ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill()}
  // lettre de Lucien posée sur la dalle, Raymond couché dessus
  const ly=gy-46;
  ctx.save();ctx.translate(-8,ly);ctx.rotate(-.06);ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(-15,0,32,3);ctx.fillStyle='#e6dcc0';ctx.fillRect(-16,-5,32,6);ctx.fillStyle='#cfc3a3';ctx.fillRect(-16,-5,32,1.2);ctx.restore();
  ctx.save();ctx.beginPath();ctx.rect(-900,-300,2200,ly-2+300);ctx.clip();
  drawRaymond(ctx,-40,ly+16,{f:1,t:0,walk:0,wear:S.run.wear||0,size:1.6,eyeClosed:true,rot:.38,sy:.72});
  ctx.restore();
  ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(-40,ly,26,3.5,0,0,7);ctx.fill();
  // pot de chrysanthèmes posé au pied de la tombe, l'enveloppe coincée dessous
  const px=430,pb=gy+18;
  // l'enveloppe, posée à plat sous le pot (vue de biais), un coin dépasse
  ctx.save();ctx.translate(px-2,pb+1);ctx.scale(1,.6);ctx.rotate(-.32);
  ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(-56,-30,70,38);
  ctx.fillStyle='#e2d3a6';ctx.fillRect(-58,-34,70,38);
  ctx.strokeStyle='rgba(120,95,50,.35)';ctx.lineWidth=.8;ctx.strokeRect(-58,-34,70,38);
  ctx.fillStyle='rgba(110,80,40,.22)';ctx.beginPath();ctx.arc(-48,-6,7,0,7);ctx.fill();
  ctx.fillStyle='#2a2420';ctx.textAlign='left';ctx.font='italic 7px '+F_BODY;ctx.fillText('Au soldat',-53,-21);ctx.fillText('Lucien Marchal',-53,-12);ctx.fillText('142e R.I. — Verdun',-53,-3);
  ctx.restore();
  // pétales tombés
  for(const[x,y,c]of[[px-40,pb+8,'#c8302a'],[px+28,pb+6,'#d9a441'],[px-62,pb+3,'#efe6d0']]){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,3,1.3,.4,0,7);ctx.fill()}
  ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(px,pb,26,5,0,0,7);ctx.fill();
  const pg=ctx.createLinearGradient(px-20,0,px+20,0);pg.addColorStop(0,'#a3603a');pg.addColorStop(.6,'#8a4a2a');pg.addColorStop(1,'#6a3820');
  ctx.fillStyle=pg;ctx.beginPath();ctx.moveTo(px-22,pb-48);ctx.lineTo(px+22,pb-48);ctx.lineTo(px+16,pb);ctx.lineTo(px-16,pb);ctx.closePath();ctx.fill();
  ctx.fillStyle='#b06a40';ctx.fillRect(px-25,pb-54,50,9);ctx.fillStyle='rgba(255,255,255,.12)';ctx.fillRect(px-25,pb-54,50,2);
  ctx.strokeStyle='#2e4a28';ctx.lineWidth=2;for(let k=-3;k<=3;k++){ctx.beginPath();ctx.moveTo(px+k*4,pb-52);ctx.lineTo(px+k*9,pb-82-Math.abs(k)*2);ctx.stroke()}
  ctx.fillStyle='#3a5a30';for(let k=-3;k<=3;k++){ctx.beginPath();ctx.ellipse(px+k*7,pb-62,5,2.2,k*.4,0,7);ctx.fill()}
  for(let k=-3;k<=3;k++){const fx=px+k*9,fy=pb-86-Math.abs(k)*2+Math.sin(ct*.7+k)*.5;ctx.fillStyle=['#d9a441','#efe6d0','#c8302a'][(k+3)%3];for(let p=0;p<12;p++){const a=p/12*Math.PI*2;ctx.beginPath();ctx.ellipse(fx+Math.cos(a)*5,fy+Math.sin(a)*5,3.2,1.5,a,0,7);ctx.fill()}ctx.fillStyle='#8a5a1a';ctx.beginPath();ctx.arc(fx,fy,2.4,0,7);ctx.fill()}
  // brume rasante
  for(let k=0;k<7;k++){ctx.fillStyle='rgba(180,190,220,.05)';ctx.beginPath();ctx.ellipse(-600+k*240+Math.sin(ct*.12+k)*40,gy-30+(k%2)*24,220,16,0,0,7);ctx.fill()}
  ctx.restore();
  // lumière de lune, vignette, bandes cinéma, fondu
  const vg=ctx.createRadialGradient(W/2,H/2,H*.25,W/2,H/2,H*.85);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.72)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#000';ctx.fillRect(0,0,W,44);ctx.fillRect(0,H-44,W,44);
  if(ct<1.8){ctx.fillStyle='rgba(0,0,0,'+(1-ct/1.8)+')';ctx.fillRect(0,0,W,H)}
  if(ct>10){ctx.font='italic 14px '+F_BODY;ctx.fillStyle='rgba(233,223,199,'+Math.min(.45,(ct-10)*.3)+')';ctx.textAlign='right';ctx.fillText('appuyer pour continuer',W-24,H-16)}
}
/* carte : Raymond perd la tête. Il tremble, la couture du cou lâche, la tête saute,
   retombe et roule ; le corps reste debout un instant, puis s'effondre sur le côté. */
function drawHeadlessCard(ct){
  const fx=W/2-60,fy=290,sz=3.4,gyb=fy;
  ctx.save();
  // sol et ombre
  ctx.fillStyle='rgba(233,223,199,.06)';ctx.fillRect(150,gyb,W-300,1.5);
  ctx.fillStyle='rgba(0,0,0,.4)';ctx.beginPath();ctx.ellipse(fx,gyb+3,58,8,0,0,7);ctx.fill();
  const POP=1.1,tt=ct-POP;
  // tremblement avant
  const shake=tt<0?Math.sin(ct*48)*Math.min(1,ct)*1.6:0;
  // le corps : debout, puis bascule sur le côté (pivot aux pattes)
  const fallT=tt-1.5,fall=fallT>0?Math.min(1,fallT/.55):0,fe=fall*fall*(3-2*fall);
  const bounce=fall>=1?Math.sin(Math.min(1,(fallT-.55)/.25)*Math.PI)*.06:0;
  if(tt<0)drawRaymond(ctx,fx+shake,gyb,{f:1,t:0,walk:0,wear:4,size:sz,eyeClosed:false});
  else{const rr2=-fe*Math.PI+bounce;drawRaymond(ctx,fx,gyb-26*sz*Math.pow(Math.sin(rr2/2),2),{f:1,t:0,walk:0,wear:4,size:sz,noHead:true,straw:Math.min(1.6,.4+tt*2),rot:rr2})}
  // fil qui lâche
  if(tt<0&&ct>.6){ctx.strokeStyle='rgba(233,223,199,'+(ct-.6)*1.6+')';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(fx+22*sz/3.4*3,gyb-23*sz);ctx.lineTo(fx+30*sz/3.4*3,gyb-27*sz);ctx.stroke()}
  // la tête
  if(tt>=0){
    const hx0=fx+9.5*sz,hy0=gyb-28*sz,groundY=gyb-6*sz;
    let hx,hy,rot;
    if(tt<.62){const u=tt;hx=hx0+210*u;hy=hy0-(620*u-1700*u*u/2)*1;rot=u*9}
    else{const u0=.62,x1=hx0+210*u0,y1=Math.min(groundY,hy0-(620*u0-1700*u0*u0/2));const r=tt-u0,d=1-Math.exp(-r*2.6);
      const by=Math.abs(Math.sin(Math.min(r,.6)/.6*Math.PI))*Math.max(0,.6-r)*40;
      hx=x1+120*d;hy=Math.min(groundY,lerp(y1,groundY,Math.min(1,r*6)))-by;rot=lerp(u0*9,Math.PI*4+.3,d)}
    // arrêt : la tête finit posée, l'œil-bouton vers nous
    ctx.fillStyle='rgba(0,0,0,'+(tt>.62?.35:.15)+')';ctx.beginPath();ctx.ellipse(hx,groundY+6*sz,20,4,0,0,7);ctx.fill();
    drawRaymondHead(ctx,hx,hy,{wear:4,size:sz,rot});
    // brins de paille éjectés
    const R=mulberry(9);ctx.lineCap='round';
    for(let k=0;k<22;k++){const a=-Math.PI/2+(R()-.5)*1.4,v=160+R()*260,life=Math.min(tt,1.2),px=fx+6.4*sz+Math.cos(a)*v*life,py=gyb-23*sz+Math.sin(a)*v*life+700*life*life,rr=R()*6+tt*R()*8;
      const yy=Math.min(py,gyb-1);ctx.save();ctx.translate(px,yy);ctx.rotate(yy>=gyb-1?.1*k:rr);ctx.strokeStyle=k%3?'#e0b04e':'#b8862e';ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(-4,0);ctx.lineTo(4,0);ctx.stroke();ctx.restore()}
  }
  ctx.restore();
}
/* bilan de fin de mission : points par niveau */
function drawStatsCard(w,ct){
  const st=S.run.stats||{};
  ctx.save();ctx.textAlign='center';ctx.fillStyle='#d9a441';ctx.font='15px '+F_DISP;ctx.fillText(`BILAN DE LA MISSION ${w+1}`,W/2,104);
  ctx.fillStyle='#efe5cc';ctx.font='30px '+F_DISP;ctx.fillText(WORLDS[w].name,W/2,140);
  const cols=[120,440,530,620,710,820],hy=184;
  ctx.font='12px '+F_DISP;ctx.fillStyle='rgba(233,223,199,.55)';
  ['NIVEAU','PAILLE','MÉDAILLE','SECRET','ACCROCS','POINTS'].forEach((h,k)=>{ctx.textAlign=k?'center':'left';ctx.fillText(h,cols[k],hy)});
  ctx.fillStyle='rgba(233,223,199,.2)';ctx.fillRect(110,hy+10,750,1);
  let tot=0,totMax=0;
  for(let j=0;j<4;j++){const li=w*4+j,o=st[li],y=hy+48+j*44,a=Math.min(1,Math.max(0,(ct-.2-j*.25)*4));
    ctx.globalAlpha=a;ctx.textAlign='left';ctx.fillStyle='#efe5cc';ctx.font='italic 20px '+F_BODY;ctx.fillText(`${w+1}–${j+1}  ${WORLDS[w].levels[j]}`,cols[0],y);
    ctx.textAlign='center';ctx.font='18px '+F_DISP;
    if(o){ctx.fillText(`${o.corn} / ${o.cornTotal}`,cols[1],y);
      if(o.medal)drawMedal(ctx,cols[2],y-6,0);else{ctx.fillStyle='rgba(233,223,199,.35)';ctx.fillText(o.hasMedal?'—':'·',cols[2],y)}
      {const f=o.secFound||0,tt=o.secTotal||1;ctx.fillStyle=f?'#efe5cc':'rgba(233,223,199,.35)';ctx.fillText(`${f}/${tt}`,cols[3],y)}
      ctx.fillStyle='#efe5cc';ctx.fillText(String(o.deaths),cols[4],y);ctx.fillStyle='#d9a441';ctx.fillText(String(o.points),cols[5],y);tot+=o.points;totMax+=o.max||levelMax(o)}
    else{ctx.fillStyle='rgba(233,223,199,.35)';ctx.fillText('non joué',cols[1],y)}
    ctx.globalAlpha=1}
  const ty=hy+48+4*44;ctx.fillStyle='rgba(233,223,199,.2)';ctx.fillRect(110,ty-28,750,1);
  ctx.globalAlpha=Math.min(1,Math.max(0,(ct-1.3)*3));
  ctx.textAlign='left';ctx.fillStyle='#efe5cc';ctx.font='20px '+F_DISP;ctx.fillText('TOTAL DE LA MISSION',cols[0],ty);
  ctx.textAlign='center';ctx.fillStyle='#d9a441';ctx.font='26px '+F_DISP;ctx.fillText(totMax?`${tot} / ${totMax}`:String(tot),cols[5]-20,ty+2);
  ctx.globalAlpha=1;ctx.restore();
}
function drawBannerCard(t){
  ctx.save();ctx.translate(W/2,H/2);
  const sw=Math.sin(t*1.5)*3;
  ctx.fillStyle='#2a4a8a';ctx.fillRect(-380,-70+sw,760,10);ctx.fillStyle='#efe6d0';ctx.fillRect(-380,-60+sw,760,110);ctx.fillStyle='#b8302a';ctx.fillRect(-380,50+sw,760,10);
  ctx.fillStyle='#2a2420';ctx.textAlign='center';ctx.font='18px '+F_DISP;ctx.fillText('COMMUNE DE CRÉCY-LA-CHAPELLE',0,-26+sw);
  ctx.font='30px '+F_DISP;ctx.fillText('110e ANNIVERSAIRE DE LA BATAILLE DE VERDUN',0,12+sw);
  ctx.font='24px '+F_DISP;ctx.fillStyle='#a8322d';ctx.fillText('1916 – 2026',0,42+sw);
  ctx.strokeStyle='#4a3a2a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-380,-70+sw);ctx.lineTo(-420,-200);ctx.moveTo(380,-70+sw);ctx.lineTo(420,-200);ctx.stroke();
  ctx.restore();
}
function renderCards(t){
  const c=G.cards[G.card];const fl=.94+rnd()*.06;
  ctx.fillStyle='#0b0a0c';ctx.fillRect(0,0,W,H);
  ctx.save();
  // le cadre ne refait pas de fondu d'une carte à l'autre ; l'image non plus si elle ne change pas
  const fa=Math.min(1,G.cardT*2.2),prev=G.card>0?G.cards[G.card-1]:null,keepPic=prev&&prev.pic&&prev.pic===c.pic;
  ctx.globalAlpha=fl*(prev?1:fa);
  ctx.strokeStyle='#d9cfb4';ctx.lineWidth=2;ctx.strokeRect(70,46,W-140,H-92);ctx.lineWidth=1;ctx.strokeRect(80,56,W-160,H-112);
  for(const[x,y,sx,sy]of[[80,56,1,1],[W-80,56,-1,1],[80,H-56,1,-1],[W-80,H-56,-1,-1]]){ctx.beginPath();ctx.moveTo(x,y+sy*30);ctx.quadraticCurveTo(x+sx*4,y+sy*4,x+sx*30,y);ctx.moveTo(x+sx*8,y+sy*18);ctx.arc(x+sx*14,y+sy*14,5,0,7);ctx.stroke()}
  ctx.fillStyle='#ece3cc';ctx.textAlign='center';ctx.globalAlpha=fl*(keepPic?1:fa);
  if(c.pic==='finale'){ctx.restore();ctx.save();drawFinaleCard(G.cardT)}
  else if(c.pic==='tomb')drawTombCard(t);
  else if(c.pic==='banner')drawBannerCard(t);
  else{
    let y=c.pic?150:H/2-20;
    if(c.pic==='dome'){drawDome(ctx,W/2,226,.62,t);y=300}
    if(c.pic==='headless'){drawHeadlessCard(G.cardT);y=372}
    if(c.pic==='stats'){drawStatsCard(c.w,G.cardT);y=-999}
    ctx.globalAlpha=fl*fa;ctx.fillStyle='#ece3cc';
    if(c.title){ctx.font='34px '+F_DISP;ctx.fillText(c.title,W/2,c.pic?y:y-50);y+=c.pic?38:0}
    if(c.t){ctx.font='italic 25px '+F_BODY;const lines=wrap(ctx,c.t,680);const y0=c.pic?y:H/2-(lines.length-1)*17+(c.title?14:0);lines.forEach((l,k)=>ctx.fillText(l,W/2,y0+k*34))}
  }
  ctx.restore();
  if(c.pic!=='finale')for(let k=0;k<2;k++){if(rnd()<.3){ctx.fillStyle='rgba(230,220,200,'+(rnd()*.1)+')';ctx.fillRect(rnd()*W,0,1+rnd(),H)}}
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
  if(G.LE.mode==='short'){renderLevelDone(t);return}
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
    ctx.fillText(`MORCEAU ${LE.li-LE.last+4} SUR 4${LE.li<LE.last?'   ·   Raymond déplie le morceau suivant':''}`,190,H-36);
    if(LE.after>.8){ctx.font='italic 15px '+F_BODY;ctx.fillStyle='rgba(233,223,199,'+(.45+Math.sin(t*3)*.2)+')';ctx.textAlign='right';ctx.fillText('appuyer pour continuer ▸',W-24,H-12)}
    ctx.restore();
  }else{
    ctx.font='italic 15px '+F_BODY;ctx.fillStyle='rgba(233,223,199,.45)';ctx.textAlign='right';ctx.fillText(def.w===0?'Raymond vérifie que le courrier est lisible. Article 4 bis.':'Raymond lit la suite. L\'article 4 attendra.',W-24,H-16);
  }
}
/* fin de niveau : court bilan ; fin de mission : les quatre morceaux de lettre */
function endOfLevel(li){
  const def=LEVELS[li],st=S.run.stats[li]||{corn:G.corn,cornTotal:G.cornTotal,medal:G.medal,deaths:G.levelDeaths,points:0};
  const after=()=>{
    if(li%4!==3){G.state='levelend';G.LE={mode:'short',li,after:0,st};G.fade=1;SFX.page();return}
    const first=li-3,go=()=>{G.state='levelend';G.LE={mode:'letter',li:first,last:li,chars:0,done:false,after:0};G.fade=1;SFX.page()};
    const pre=def.w===0?TUBE:LETTER_CARDS[def.w];if(pre){G.state='intro';G.cards=pre;G.card=0;G.cardT=0;G.fade=1;G.cardsDone=go}else go();
  };
  if(li===18)unlock('a13');
  if(def.afterCards){G.state='intro';G.cards=def.afterCards;G.card=0;G.cardT=0;G.fade=1;G.cardsDone=after;if(def.afterSong)setSong(def.afterSong)}else after();
}
function handleLetter(dt){
  const LE=G.LE;const go=pressed.has('ok')||pressed.has('jump')||G.click;
  if(LE.mode==='short'){LE.after+=dt;if(go&&LE.after>.5){G.cutSeen=true;startLevel(LE.li+1)}return}
  const def=LEVELS[LE.li];
  const total=(def.letter.date||'').length+tokens((LE.li===0?'':'… ')+def.letter.text).reduce((s,t)=>s+t.w.length+1,0);
  if(!LE.done){const before=Math.floor(LE.chars);LE.chars+=dt*30;if(Math.floor(LE.chars)!==before&&Math.floor(LE.chars)%3===0)noise(.03,2600,.04,'highpass');if(go)LE.chars=total;if(LE.chars>=total){LE.done=true;LE.after=0;achLetter(LE.li)}}
  else{LE.after+=dt;if(go&&LE.after>.5){if(LE.li<LE.last){LE.li++;LE.chars=0;LE.done=false;LE.after=0;SFX.page()}else afterLetter(LE.last)}}
}
function renderLevelDone(t){
  const LE=G.LE,def=LEVELS[LE.li],st=LE.st;
  ctx.fillStyle='#1a120c';ctx.fillRect(0,0,W,H);
  ctx.save();ctx.globalAlpha=.22;ctx.fillStyle=ctx.createPattern(paperC,'repeat');ctx.fillRect(0,0,W,H);ctx.restore();
  const gl=ctx.createRadialGradient(W*.5,H*.4,40,W*.5,H*.4,520);gl.addColorStop(0,'rgba(255,200,120,.2)');gl.addColorStop(1,'rgba(0,0,0,.55)');ctx.fillStyle=gl;ctx.fillRect(0,0,W,H);
  const a=Math.min(1,LE.after*3);ctx.save();ctx.globalAlpha=a;
  // étiquette de musée
  ctx.save();ctx.translate(W/2,H/2-20);ctx.rotate(-.02);
  ctx.fillStyle='rgba(0,0,0,.4)';rr(ctx,-250,-120,510,250,6);ctx.fill();
  const pg=ctx.createLinearGradient(0,-130,0,120);pg.addColorStop(0,'#ece2c6');pg.addColorStop(1,'#d2c19a');ctx.fillStyle=pg;rr(ctx,-260,-130,510,250,6);ctx.fill();
  ctx.strokeStyle='rgba(120,90,50,.45)';ctx.lineWidth=1.5;rr(ctx,-248,-118,486,226,4);ctx.stroke();
  ctx.fillStyle='#8a5a2a';ctx.font='13px '+F_DISP;ctx.textAlign='center';ctx.fillText(`MISSION ${def.w+1} · NIVEAU ${LE.li%4+1} TRAVERSÉ`,-5,-88);
  ctx.fillStyle='#2a2420';ctx.font='32px '+F_DISP;ctx.fillText(def.name,-5,-48);
  ctx.fillStyle='rgba(42,36,32,.25)';ctx.fillRect(-180,-30,350,1);
  const rows=[['Paille ramassée',`${st.corn} / ${st.cornTotal}`]];if(st.hasMedal)rows.push(['Médaille',st.medal?'trouvée':'non trouvée']);rows.push([st.secTotal>1?'Secrets':'Secret',`${st.secFound||0} / ${st.secTotal||1}`],['Accrocs',String(st.deaths)],['Points',`${st.points} / ${st.max||levelMax(st)}`]);
  rows.forEach(([k,v],i)=>{const y=-8+i*25;ctx.textAlign='left';ctx.font='italic 18px '+F_BODY;ctx.fillStyle='#4a3e30';ctx.fillText(k,-170,y);ctx.textAlign='right';ctx.font='18px '+F_DISP;ctx.fillStyle=i===rows.length-1?'#a8322d':'#2a2420';ctx.fillText(v,160,y)});
  ctx.restore();
  drawRaymond(ctx,W/2-300,H-60,{f:1,t,walk:0,wear:wear(),size:1.6});
  if(LE.after>.6){ctx.font='italic 15px '+F_BODY;ctx.fillStyle='rgba(233,223,199,'+(.45+Math.sin(t*3)*.2)+')';ctx.textAlign='right';ctx.fillText('appuyer pour continuer ▸',W-24,H-16)}
  ctx.restore();
}
function afterLetter(li){
  G.cutSeen=true;
  if(li%4===3)achMission(LEVELS[li].w);
  if(li===19){S.finished=true;save();G.state='intro';G.cards=[{pic:'stats',w:4,minT:.8}].concat(ENDING);G.card=0;G.cardT=0;G.fade=1;G.cardsDone=()=>{unlock('a15');goTitle()};setSong('s5-4');return}
  if(li%4===3){
    const w=LEVELS[li].w;
    const cards=[{pic:'stats',w,minT:.8}].concat(WORLD_CARDS[w+1]);
    G.state='intro';G.cards=cards;G.card=0;G.cardT=0;G.fade=1;G.cardsDone=()=>startLevel(li+1);setSong('title');return;
  }
  startLevel(li+1);
}
