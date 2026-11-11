/*v2*/
/* ---------- tableau des scores (depuis l'accueil) ----------
   Pour chaque niveau déjà réussi : la meilleure récolte (paille, médaille, secrets), le moins d'accrocs et le score sur le maximum.
   Les records viennent de S.best, qui garde le meilleur de toutes les parties. */
// secrets par niveau (vérifié niveau par niveau ; la somme fait SECRET_TOTAL)
const SEC_TOT=[3,2,2,2,4,2,2,2,2,1,2,2,3,4,2,3,5,3,1,1];
function openScores(){G.state='scores';G.fade=1}
function handleScores(){if(pressed.has('esc')||pressed.has('back')||pressed.has('ok')||G.click){goTitle()}}
/* petites icônes du compte : brin de paille, secret (un trou de serrure), médaille */
function iconStraw(g,x,y,s){g.save();g.translate(x,y);g.scale(s,s);g.strokeStyle='#b8862e';g.lineWidth=1.6;g.lineCap='round';
  for(let k=-2;k<=2;k++){g.beginPath();g.moveTo(k*1.4,7);g.lineTo(k*2.6,-7);g.stroke()}g.strokeStyle='#7a5a1e';g.lineWidth=2;g.beginPath();g.moveTo(-4,2);g.lineTo(4,2);g.stroke();g.restore()}
function iconSecret(g,x,y,s,col){g.save();g.translate(x,y);g.scale(s,s);g.fillStyle=col||'#2a2420';g.beginPath();g.arc(0,-2.5,3.6,0,7);g.fill();
  g.beginPath();g.moveTo(-2.2,-1);g.lineTo(2.2,-1);g.lineTo(3.4,7);g.lineTo(-3.4,7);g.closePath();g.fill();g.restore()}
function scoreOf(li){const b=S.best[li];if(!b)return null;const t=levelTotals(li),sec=SEC_TOT[li]||0;
  const corn=Math.min(b.corn||0,t.corn),secret=Math.min(b.secret||0,sec);
  return{corn,cornT:t.corn,medal:!!b.medal,hasMedal:t.medal,secret,secT:sec,deaths:b.deaths,pts:10*(corn+(b.medal?1:0)+secret),max:10*(t.corn+(t.medal?1:0)+sec)}}
function renderScores(t){
  ensureTitleLv();const prev=L;L=titleLv;renderWorld(titleLv,200,60,t,{noEntities:true});L=prev;
  ctx.fillStyle='rgba(12,10,16,.9)';ctx.fillRect(0,0,W,H);
  ctx.save();ctx.textAlign='center';ctx.fillStyle='#efe5cc';ctx.font='30px '+F_DISP;ctx.fillText('Scores de Raymond',W/2,40);
  const C={name:96,straw:470,medal:560,sec:640,acc:730,pts:850};
  let y=70;ctx.font='12px '+F_DISP;ctx.fillStyle='rgba(233,223,199,.55)';
  ctx.textAlign='center';ctx.fillText('Paille',C.straw,y);ctx.fillText('Médaille',C.medal,y);ctx.fillText('Secrets',C.sec,y);ctx.fillText('Accrocs',C.acc,y);ctx.fillText('Score',C.pts,y);
  ctx.fillStyle='rgba(233,223,199,.15)';ctx.fillRect(70,y+7,W-140,1);y+=10;
  let tot=0,totMax=0;
  WORLDS.forEach((wd,wi)=>{
    y+=16;ctx.textAlign='left';ctx.font='11px '+F_DISP;ctx.fillStyle='#d9a441';ctx.fillText(`MISSION ${wi+1} · ${wd.name.toUpperCase()}`,70,y);
    wd.levels.forEach((ln,lj)=>{const li=wi*4+lj,s=scoreOf(li);y+=16;
      ctx.textAlign='left';ctx.font='13px '+F_DISP;ctx.fillStyle=s?'#efe5cc':'rgba(233,223,199,.3)';ctx.fillText(`${wi+1}–${lj+1}`,70,y);
      ctx.font='italic 14px '+F_BODY;ctx.fillText(s?ln:'?????',C.name,y);
      if(!s)return;tot+=s.pts;totMax+=s.max;
      ctx.textAlign='center';ctx.font='13px '+F_DISP;
      const full=(a,b)=>a>=b?'#d9a441':'#efe5cc';
      ctx.fillStyle=full(s.corn,s.cornT);ctx.fillText(`${s.corn}/${s.cornT}`,C.straw,y);
      if(s.hasMedal){ctx.save();ctx.translate(C.medal,y-5);ctx.scale(.5,.5);if(!s.medal)ctx.filter='brightness(0) opacity(.5)';drawMedal(ctx,0,0,0);ctx.restore()}else{ctx.fillStyle='rgba(233,223,199,.3)';ctx.fillText('—',C.medal,y)}
      ctx.fillStyle=full(s.secret,s.secT);ctx.fillText(`${s.secret}/${s.secT}`,C.sec,y);
      ctx.fillStyle='#efe5cc';ctx.fillText(s.deaths>=9999?'—':String(s.deaths),C.acc,y);
      ctx.fillStyle=full(s.pts,s.max);ctx.fillText(`${s.pts}/${s.max}`,C.pts,y)})});
  y+=8;ctx.fillStyle='rgba(233,223,199,.15)';ctx.fillRect(70,y,W-140,1);y+=17;
  ctx.textAlign='left';ctx.font='14px '+F_DISP;ctx.fillStyle='#efe5cc';ctx.fillText('Total',70,y);
  ctx.textAlign='center';ctx.fillStyle=totMax&&tot>=totMax?'#d9a441':'#efe5cc';ctx.fillText(`${tot}/${totMax}`,C.pts,y);
  ctx.font='italic 14px '+F_BODY;ctx.fillStyle='rgba(233,223,199,.5)';ctx.fillText(pad()?'B pour revenir':'Échap pour revenir',W/2,H-12);
  ctx.restore();
}
/* ---------- un cartel en grand : le jeu attend qu'on l'ait lu (« Compris ») ---------- */
function hintPopText(){const h=(L.hintTexts||L.def.hints||[])[G.hintPop];return h?[h[0],padTxt(h[1])]:['','']}
function handleHintPop(dt){G.hintPopT=(G.hintPopT||0)+dt;const b=G.hintBtn;
  const clicked=G.click&&b&&G.click.x>b.x&&G.click.x<b.x+b.w&&G.click.y>b.y&&G.click.y<b.y+b.h;
  if(G.hintPopT>.45&&(clicked||pressed.has('ok')||pressed.has('act')||pressed.has('back')||pressed.has('esc')||pressed.has('jump'))){G.state='play';G.hintPop=null;keys.delete('jump');P.jumpBuf=0;SFX.tick()}}
function renderHintPop(t){const[title,body]=hintPopText();const a=Math.min(1,(G.hintPopT||0)/.25);ctx.save();
  ctx.fillStyle='rgba(8,7,10,'+(.55*a)+')';ctx.fillRect(0,0,W,H);ctx.globalAlpha=a;
  ctx.font='italic 20px '+F_BODY;const lines=wrap(ctx,body,520);const bw=600,bh=132+lines.length*27,bx=W/2-bw/2,by=H/2-bh/2-10;
  ctx.fillStyle='rgba(0,0,0,.35)';rr(ctx,bx+6,by+8,bw,bh,8);ctx.fill();ctx.fillStyle='#ece3cc';rr(ctx,bx,by,bw,bh,8);ctx.fill();
  ctx.strokeStyle='rgba(42,36,32,.6)';ctx.lineWidth=1;rr(ctx,bx+8.5,by+8.5,bw-17,bh-17,5);ctx.stroke();
  ctx.fillStyle='#2a2420';ctx.textAlign='left';ctx.font='17px '+F_DISP;ctx.fillText(title,bx+34,by+40);ctx.fillStyle='rgba(42,36,32,.3)';ctx.fillRect(bx+34,by+50,bw-68,1);
  ctx.font='italic 20px '+F_BODY;ctx.fillStyle='#2a2420';lines.forEach((l,k)=>ctx.fillText(l,bx+34,by+80+k*27));
  const lbl=pad()?/*v2*/'Compris  (A)':/*v2*/'Compris',bw2=150,bx2=W/2-bw2/2,by2=by+bh-50;G.hintBtn={x:bx2,y:by2,w:bw2,h:34};
  const ms=G.mouse||{x:-1,y:-1},hov=ms.x>bx2&&ms.x<bx2+bw2&&ms.y>by2&&ms.y<by2+34;
  ctx.fillStyle=hov?'#c8902e':'#2a2420';rr(ctx,bx2,by2,bw2,34,6);ctx.fill();ctx.fillStyle='#efe5cc';ctx.textAlign='center';ctx.font='17px '+F_DISP;ctx.fillText(lbl,W/2,by2+23);
  ctx.restore()}
