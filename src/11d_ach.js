/* =========================================================
   SUCCÈS — ceux retenus pour l'instant (les autres viendront plus tard)
   Catégories (pour le médaillon) : P progression · C collecte · D accrocs · E ennemis · S adresse · X curiosités
   ========================================================= */
const ACH=[
 ['a1','P','Matricule 7413, au rapport',"Terminer l'introduction."],
 ['a2','P','Finalement, on aurait pu sortir par là',"Ouvrir la porte par où le voleur est parti."],
 ['a3','P','Le bec, outil réglementaire',"Ouvrir le portillon du 1-1 en tirant la poignée."],
 ['a4','P','Fin de la remise',"Terminer la mission 1."],
 ['a5','P','Retour au front',"Terminer la mission 2."],
 ['a6','P','Le sacre',"Terminer la mission 3."],
 ['a7','P','Route nationale',"Terminer la mission 4."],
 ['a8','P',"Le pigeonnier n'existe plus","Terminer la mission 5."],
 ['a9','P','Courrier distribué',"Finir le jeu."],
 ['a10','P',"Facteur d'élite","Finir le jeu sans jamais perdre la tête."],
 ['a11','P','Pas un brin',"Finir le jeu sans perdre une seule paille."],
 ['a12','P',"Tout d'une traite","Finir une mission sans un seul accroc."],
 ['a13','P','Cent dix ans de retard',"Lire la banderole de la fête foraine."],
 ['a15','P','Le pot de fleurs',"Voir la fin du jeu."],
 ['a17','P','Article 4 bis',"Lire les vingt morceaux de la lettre."],
 ['a24','C','Rembourré à neuf',"Revenir à cinq crans pleins après être descendu au dernier."],
 ['a26','C','Bardé de décorations',"Trouver les cinq médailles dans une même partie."],
 ['a30','C',"Rien ne m'échappe","Trouver toutes les cachettes du jeu."],
 ['a35','C','Mission parfaite',"Faire 4000 points sur une mission."],
 ['a49','D','Recousu de travers',"Perdre la tête une première fois."],
 ['a50','D','Depuis la remise',"Perdre sa dernière vie et tout recommencer."],
 ['a53','E','Fantôme du musée',"Jeter un drap sur la tête d'un gardien."],
 ['a54','E',"Bijou s'emmêle","Faire s'emmêler le chat dans un drap."],
 ['a56','E',"Le papillon s'est envolé","Échapper au gardien au filet."],
 ['c1','E','Instinct de pie',"Chiper dix clefs aux gardiens."],
 ['a68','S',"L'aile qui se décroche","Vider complètement la robustesse de ses ailes."],
 ['a81','X',"Clin d'œil","Cliquer quatre fois sur l'œil de Raymond et l'entendre roucouler."],
 ['a82','X','Rrrou… ?',"Rester immobile une minute : Raymond s'endort."]
];
const ACH_BY={};ACH.forEach((a,i)=>ACH_BY[a[0]]={i,cat:a[1],t:a[2],d:a[3]});
/* nombre total de cachettes (1-1 : trois ; les autres niveaux : une) */
const SECRET_TOTAL=22;
function achState(){if(!S.ach)S.ach={};if(!S.achStats)S.achStats={keys:0,secrets:{},letters:{}};return S.ach}
function unlock(id){
  if(G.sim||!ACH_BY[id])return;const st=achState();if(st[id])return;
  st[id]=Date.now();save();
  G.toasts=G.toasts||[];G.toasts.push({id,t:0});
  if(AC&&!S.muted){[523,659,784,1047].forEach((f,i)=>tone(f,.35,'triangle',.11,null,i*.09))}
}
function achSecret(li,sid){achState();S.achStats.secrets[li+':'+sid]=1;if(Object.keys(S.achStats.secrets).length>=SECRET_TOTAL)unlock('a30')}
function achKey(){achState();S.achStats.keys=(S.achStats.keys||0)+1;save();if(S.achStats.keys>=10)unlock('c1')}
function achLetter(li){achState();S.achStats.letters[li]=1;if(Object.keys(S.achStats.letters).length>=20)unlock('a17')}
/* fin de mission (après la lettre) */
function achMission(w){
  unlock('a'+(4+w));
  let pts=0,acc=0;for(let k=w*4;k<w*4+4;k++){const o=S.run.stats[k];if(o){pts+=o.points||0;acc+=o.deaths||0}else acc+=99}
  if(pts>=4000)unlock('a35');if(acc===0)unlock('a12');
  if(w===4){unlock('a9');if(!S.run.headLost&&!S.run.usedInf)unlock('a10');if(!S.run.anyAccroc&&!S.run.usedInf)unlock('a11')}
  if(Object.keys(S.run.medals||{}).length>=5)unlock('a26');
}

/* ---------- médaillon d'un succès ---------- */
const ACH_RIBBON={P:['#a8322d','#e9dfc7'],C:['#c9a24a','#5a3a1a'],D:['#3a3a48','#a8322d'],E:['#2a3f6a','#e9dfc7'],S:['#4f7a5a','#e9dfc7'],X:['#6a3a6a','#c9a24a']};
function drawAchMedal(g,x,y,cat,on,s){
  s=s||1;g.save();g.translate(x,y);g.scale(s,s);
  const rb=ACH_RIBBON[cat]||ACH_RIBBON.P;
  g.globalAlpha=on?1:.35;
  g.fillStyle=rb[0];g.fillRect(-9,-34,18,18);g.fillStyle=rb[1];g.fillRect(-3,-34,6,18);
  poly(g,[-9,-16,9,-16,6,-12,-6,-12]);g.fillStyle='rgba(0,0,0,.25)';g.fill();
  const gr=g.createRadialGradient(-6,-6,2,0,0,22);
  if(on){gr.addColorStop(0,'#f6e3a0');gr.addColorStop(.55,'#c9a24a');gr.addColorStop(1,'#6a4a16')}else{gr.addColorStop(0,'#8a8a8a');gr.addColorStop(1,'#3a3a3a')}
  g.fillStyle=gr;g.beginPath();g.arc(0,0,18,0,7);g.fill();
  g.strokeStyle=on?'rgba(70,46,10,.6)':'rgba(0,0,0,.4)';g.lineWidth=1.4;g.beginPath();g.arc(0,0,14.5,0,7);g.stroke();
  // dentelure du bord
  g.fillStyle=on?'#a8822e':'#4a4a4a';for(let k=0;k<20;k++){const a=k/20*Math.PI*2;g.beginPath();g.arc(Math.cos(a)*18,Math.sin(a)*18,1.4,0,7);g.fill()}
  g.strokeStyle=on?'#4a3410':'#222';g.fillStyle=g.strokeStyle;g.lineWidth=1.8;g.lineCap='round';g.lineJoin='round';
  if(cat==='P'){g.strokeRect(-8,-5,16,11);g.beginPath();g.moveTo(-8,-5);g.lineTo(0,1.5);g.lineTo(8,-5);g.stroke()}
  else if(cat==='C'){for(let k=-3;k<=3;k++){g.beginPath();g.moveTo(k*1.1,7);g.quadraticCurveTo(k*2.2,0,k*3,-8+Math.abs(k));g.stroke()}g.beginPath();g.moveTo(-5,4);g.lineTo(5,4);g.stroke()}
  else if(cat==='D'){g.beginPath();g.moveTo(-7,8);g.lineTo(5,-6);g.stroke();g.beginPath();g.arc(6,-7,3,0,7);g.fill()}
  else if(cat==='E'){g.fillRect(-9,-2.5,9,5);g.globalAlpha=(on?1:.35)*.55;poly(g,[0,-4,9,-8,9,8,0,4]);g.fill()}
  else if(cat==='S'){g.beginPath();g.moveTo(-9,5);g.quadraticCurveTo(-3,-9,9,-6);g.quadraticCurveTo(2,-1,5,5);g.quadraticCurveTo(-1,2,-9,5);g.fill()}
  else{g.beginPath();g.ellipse(0,0,9,5.5,0,0,7);g.stroke();g.beginPath();g.arc(0,0,2.8,0,7);g.fill()}
  if(on){g.globalAlpha=.35;g.fillStyle='#fff';g.beginPath();g.ellipse(-7,-8,5,2.5,-.6,0,7);g.fill()}
  g.restore();
}
/* bandeau « succès débloqué » */
function renderToasts(dt){
  const q=G.toasts;if(!q||!q.length)return;const T0=q[0];T0.t+=dt;const a=ACH_BY[T0.id];
  const k=Math.min(1,T0.t*4,(4-T0.t)*3),y=H-70+(1-k)*80;
  ctx.save();ctx.globalAlpha=Math.max(0,k);
  ctx.fillStyle='rgba(14,12,18,.88)';rr(ctx,W/2-210,y-26,420,58,10);ctx.fill();ctx.strokeStyle='rgba(201,162,74,.6)';ctx.lineWidth=1.2;rr(ctx,W/2-210,y-26,420,58,10);ctx.stroke();
  drawAchMedal(ctx,W/2-176,y+8,a.cat,true,.85);
  ctx.textAlign='left';ctx.fillStyle='#d9a441';ctx.font='12px '+F_DISP;ctx.fillText('SUCCÈS',W/2-146,y-6);
  ctx.fillStyle='#efe5cc';ctx.font='18px '+F_DISP;ctx.fillText(a.t,W/2-146,y+16);
  ctx.restore();
  if(T0.t>4)q.shift();
}
/* écran des succès (depuis l'accueil, seulement si au moins un est débloqué) */
function openAch(){G.state='ach';G.fade=1;G.achScroll=0}
function handleAch(){if(pressed.has('esc')||pressed.has('back')||pressed.has('ok')||G.click)goTitle();if(pressed.has('down'))G.achScroll=Math.min(G.achScroll+1,3);if(pressed.has('up'))G.achScroll=Math.max(0,G.achScroll-1)}
function renderAch(t){
  ensureTitleLv();const prev=L;L=titleLv;renderWorld(titleLv,200,60,t,{noEntities:true});L=prev;
  ctx.fillStyle='rgba(12,10,16,.88)';ctx.fillRect(0,0,W,H);
  const st=achState(),n=ACH.filter(a=>st[a[0]]).length;
  ctx.save();ctx.textAlign='center';ctx.fillStyle='#efe5cc';ctx.font='30px '+F_DISP;ctx.fillText('Décorations de Raymond',W/2,44);
  ctx.font='italic 15px '+F_BODY;ctx.fillStyle='rgba(233,223,199,.6)';ctx.fillText(`${n} sur ${ACH.length}`,W/2,66);
  const cols=2,cw=430,rh=58,x0=W/2-cw-5,y0=88;
  ACH.forEach((a,i)=>{const on=!!st[a[0]],c=i%cols,r=Math.floor(i/cols),x=x0+c*(cw+10),y=y0+r*rh-G.achScroll*rh*2;if(y<70||y>H-40)return;
    ctx.fillStyle=on?'rgba(233,223,199,.07)':'rgba(233,223,199,.025)';rr(ctx,x,y,cw,rh-6,6);ctx.fill();
    drawAchMedal(ctx,x+30,y+30,a[1],on,.78);
    ctx.textAlign='left';ctx.fillStyle=on?'#efe5cc':'rgba(233,223,199,.4)';ctx.font='16px '+F_DISP;ctx.fillText(a[2],x+60,y+21);
    ctx.font='italic 13px '+F_BODY;ctx.fillStyle=on?'rgba(233,223,199,.7)':'rgba(233,223,199,.32)';ctx.fillText(a[3],x+60,y+39)});
  ctx.textAlign='center';ctx.font='italic 14px '+F_BODY;ctx.fillStyle='rgba(233,223,199,.5)';ctx.fillText('↑ ↓ défiler · appuyer pour revenir',W/2,H-12);
  ctx.restore();
}
