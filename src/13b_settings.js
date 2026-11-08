/* =========================================================
   PARAMÈTRES : volumes, mode de jeu, touches
   ---------------------------------------------------------
   Modes : facile, normal, difficile (toujours visibles) ; Super-Raymond et Dieu-Pigeon n'apparaissent
   qu'après les quatre clics sur l'œil de Raymond, et ne s'ouvrent qu'avec leur code (on ne garde
   ici que l'empreinte des codes, jamais les codes eux-mêmes).
   ========================================================= */
const MODES=[
  {k:'facile',n:'Facile',d:"Perdre la tête ramène au début du niveau."},
  {k:'normal',n:'Normal',d:"Perdre la tête ramène au début de la mission."},
  {k:'difficile',n:'Difficile',d:"Perdre la tête, c'est tout recommencer depuis la remise."},
  {k:'super',n:'Super-Raymond',d:"Paille illimitée : Raymond ne perd jamais la tête. Tous les niveaux sont ouverts.",hidden:1,h:419132830826481},
  {k:'dieu',n:'Dieu-Pigeon',d:"Rien ne l'atteint. Tous les niveaux sont ouverts.",hidden:1,h:4784510863132940}];
function modeHash(s,seed=7413){let h1=0xdeadbeef^seed,h2=0x41c6ce57^seed;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);h1=Math.imul(h1^c,2654435761);h2=Math.imul(h2^c,1597334677)}
  h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909);h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909);return 4294967296*(2097151&h2)+(h1>>>0)}
function applyMode(){if(!MODES.some(m=>m.k===S.mode))S.mode='normal';S.infinite=S.mode==='super'||S.mode==='dieu';S.god=S.mode==='dieu'}
function modesVisible(){return MODES.filter(m=>!m.hidden||S.modesShown||S.mode===m.k)}
/* la touche B (changer d'époque) n'existe qu'une fois le 4-3 terminé */
function eraKeyOn(){return S.unlocked>=15}
function openSettings(){G.state='settings';G.setSel=0;G.codeEntry=null;G.setMsg=null;G.fade=1}
function setVol(k,d){S[k]=clamp((S[k]==null?8:S[k])+d,0,10);applyVolumes();save();if(k==='vSfx')SFX.tick()}
function setMode(d){const vis=modesVisible();let i=vis.findIndex(m=>m.k===(G.setPick||S.mode));if(i<0)i=0;i=(i+d+vis.length)%vis.length;const m=vis[i];G.setPick=m.k;G.setMsg=null;
  if(m.hidden&&!(S.codes&&S.codes[m.k]))return;S.mode=m.k;G.setPick=null;applyMode();save()}
function settingsRows(){return['mus','sfx','mode','back']}
function handleSettings(){
  const C=G.codeEntry;if(C)return; // la saisie du code passe par le clavier (voir 14_main)
  const rows=settingsRows();
  if(pressed.has('esc')||pressed.has('back')){G.setPick=null;goTitle();return}
  if(pressed.has('up'))G.setSel=(G.setSel-1+rows.length)%rows.length;
  if(pressed.has('down'))G.setSel=(G.setSel+1)%rows.length;
  const r=rows[G.setSel],dx=pressed.has('left')?-1:pressed.has('right')?1:0;
  if(dx){if(r==='mus')setVol('vMus',dx);else if(r==='sfx')setVol('vSfx',dx);else if(r==='mode')setMode(dx)}
  if(G.click&&G.setBoxes)for(const b of G.setBoxes)if(G.click.x>b.x&&G.click.x<b.x+b.w&&G.click.y>b.y&&G.click.y<b.y+b.h){G.setSel=rows.indexOf(b.r);
    if(b.d){if(b.r==='mus')setVol('vMus',b.d);else if(b.r==='sfx')setVol('vSfx',b.d);else if(b.r==='mode')setMode(b.d)}
    else if(b.r==='back'){G.setPick=null;goTitle()}else if(b.r==='code')askCode();return}
  if(pressed.has('ok')){if(r==='back'){G.setPick=null;goTitle()}else if(r==='mode'&&pendingLocked())askCode()}
}
function pendingLocked(){const m=MODES.find(m=>m.k===G.setPick);return m&&m.hidden&&!(S.codes&&S.codes[m.k])?m:null}
function askCode(){const m=pendingLocked();if(m){G.codeEntry={k:m.k,txt:''};G.setMsg=null}}
/* appelée par le clavier pendant la saisie du code */
function codeKey(e){const C=G.codeEntry;if(!C)return false;e.preventDefault();
  if(e.key==='Escape'){G.codeEntry=null;return true}
  if(e.key==='Backspace'){C.txt=C.txt.slice(0,-1);return true}
  if(e.key==='Enter'||e.key==='NumpadEnter'){const m=MODES.find(m=>m.k===C.k);
    if(m&&modeHash(C.txt)===m.h){S.codes=S.codes||{};S.codes[m.k]=1;S.mode=m.k;G.setPick=null;applyMode();save();G.setMsg={t:m.n+' : activé.',ok:1};SFX.coo()}
    else{G.setMsg={t:'Ce n\'est pas le bon code.',ok:0};tone(200,.12,'square',.04)}
    G.codeEntry=null;return true}
  if(e.key&&e.key.length===1&&C.txt.length<16){C.txt+=e.key;SFX.tick()}
  return true}
function renderSettings(t){
  ensureTitleLv();const prev=L;L=titleLv;renderWorld(titleLv,200,60,t,{noEntities:true});L=prev;
  ctx.fillStyle='rgba(12,10,16,.86)';ctx.fillRect(0,0,W,H);
  ctx.save();ctx.textAlign='center';ctx.fillStyle='#efe5cc';ctx.font='32px '+F_DISP;ctx.fillText('Paramètres',W/2,52);
  G.setBoxes=[];const rows=settingsRows(),L0=170,R0=W/2+10;
  const label=(r,txt,y)=>{const sel=rows[G.setSel]===r;ctx.textAlign='right';ctx.font=(sel?'21px ':'19px ')+F_DISP;ctx.fillStyle=sel?'#f2e8cf':'rgba(233,223,199,.65)';ctx.fillText(txt,W/2-30,y);
    if(sel){ctx.fillStyle='#d9a441';ctx.save();ctx.translate(W/2-30-ctx.measureText(txt).width-16,y-7);ctx.rotate(-.5);ctx.beginPath();ctx.ellipse(0,0,8,3,0,0,7);ctx.fill();ctx.restore()}};
  const arrows=(r,y,w)=>{ctx.font='20px '+F_DISP;ctx.fillStyle='#d9a441';ctx.textAlign='center';ctx.fillText('◂',R0,y);ctx.fillText('▸',R0+w,y);
    G.setBoxes.push({r,d:-1,x:R0-16,y:y-22,w:32,h:30},{r,d:1,x:R0+w-16,y:y-22,w:32,h:30})};
  // volumes
  [['mus','Musique','vMus',100],['sfx','Sons','vSfx',140]].forEach(([r,lb,k,y])=>{label(r,lb,y);arrows(r,y,250);const v=S[k]==null?8:S[k];
    for(let i=0;i<10;i++){ctx.fillStyle=i<v?'#d9a441':'rgba(233,223,199,.16)';rr(ctx,R0+22+i*21,y-17,15,18,3);ctx.fill()}
    if(v===0){ctx.textAlign='left';ctx.font='italic 15px '+F_BODY;ctx.fillStyle='rgba(233,223,199,.6)';ctx.fillText('coupée',R0+272,y-2)}
    G.setBoxes.push({r,x:W/2-200,y:y-24,w:170,h:32})});
  // mode
  {const y=190;label('mode','Mode de jeu',y);arrows('mode',y,250);const k=G.setPick||S.mode,m=MODES.find(m=>m.k===k)||MODES[1],locked=m.hidden&&!(S.codes&&S.codes[m.k]);
    ctx.textAlign='center';ctx.font='20px '+F_DISP;ctx.fillStyle=locked?'rgba(233,223,199,.5)':'#efe5cc';ctx.fillText(m.n,R0+125,y);
    ctx.font='italic 15px '+F_BODY;ctx.fillStyle='rgba(233,223,199,.7)';ctx.fillText(m.d,W/2,y+26);
    if(G.codeEntry){ctx.fillStyle='#ece3cc';rr(ctx,W/2-150,y+40,300,34,6);ctx.fill();ctx.fillStyle='#2a2420';ctx.font='18px '+F_DISP;ctx.fillText((G.codeEntry.txt||'')+(Math.sin(t*6)>0?'|':' '),W/2,y+63);
      ctx.font='italic 13px '+F_BODY;ctx.fillStyle='rgba(233,223,199,.6)';ctx.fillText('Taper le code puis Entrée · Échap pour annuler',W/2,y+92)}
    else if(locked){ctx.font='italic 15px '+F_BODY;ctx.fillStyle='#d9a441';ctx.fillText('Verrouillé · Entrée (ou clic ici) pour saisir le code',W/2,y+52);G.setBoxes.push({r:'code',x:W/2-200,y:y+34,w:400,h:26})}
    else if(G.setMsg){ctx.font='italic 15px '+F_BODY;ctx.fillStyle=G.setMsg.ok?'#9fd19f':'#e08a80';ctx.fillText(G.setMsg.t,W/2,y+52)}
    G.setBoxes.push({r:'mode',x:W/2-200,y:y-24,w:170,h:32})}
  // touches
  {let y=318;ctx.textAlign='center';ctx.font='15px '+F_DISP;ctx.fillStyle='#d9a441';ctx.fillText('TOUCHES',W/2,y);y+=24;
    const K=[['← →  ou  Q D','marcher'],['Espace, ↑ ou Z','sauter ; en l\'air, battre des ailes ; maintenu, planer'],['E ou F','donner un coup de bec'],['↓ ou S','descendre, en vol']];
    if(eraKeyOn())K.push(['B','changer d\'époque']);K.push(['R','revenir au cartel'],['Échap ou P','pause'],['M','couper le son']);
    ctx.font='15px '+F_BODY;for(const[a,b]of K){ctx.textAlign='right';ctx.fillStyle='#efe5cc';ctx.fillText(a,W/2-20,y);ctx.textAlign='left';ctx.fillStyle='rgba(233,223,199,.7)';ctx.fillText(b,W/2+4,y);y+=19}}
  // retour
  {const y=H-28,sel=rows[G.setSel]==='back';ctx.textAlign='center';ctx.font=(sel?'21px ':'19px ')+F_DISP;ctx.fillStyle=sel?'#f2e8cf':'rgba(233,223,199,.65)';ctx.fillText('Retour',W/2,y);G.setBoxes.push({r:'back',x:W/2-60,y:y-24,w:120,h:32})}
  ctx.restore();
}
