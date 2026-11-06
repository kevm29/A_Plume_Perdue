/* =========================================================
   4-3 · L'ORAGE — les gens du souvenir (1916), leurs bêtes, leurs véhicules
   ---------------------------------------------------------
   · vxHead : une tête de trois quarts, à toutes les tailles (les détails apparaissent quand on s'en approche) :
     yeux (blanc, iris, pupille, reflet, paupière), sourcils, nez, bouche, oreille, moustache, barbe, poils de barbe,
     cheveux, casque Adrian, casque allemand de 1916, casque à pointe sous sa housse, calot, képi.
   · vxSoldier : un soldat articulé (bassin, épaules, genoux, coudes) en capote bleu horizon ou en vareuse feldgrau,
     bandes molletières ou bottes, ceinturon et cartouchières, musette, bidon, sac, fusil (Lebel, Mauser), baïonnette.
   · vxHorse : un cheval de trait au trot, harnaché (collier, attelles, traits, avaloire, bride, œillères).
   · vxPigeon : Raymond vivant, en vol, ailes battantes, le tube rouge à la patte.
   ========================================================= */
const VXU={
  fr:{coat:'#8296ac',coat2:'#73879d',coatD:'#5f7288',trou:'#7d90a5',putt:'#6f8196',helm:'#71808e',helmD:'#56636f',leather:'#6e4a2a',boot:'#3c2a1a',tab:'#b8423a',btn:'#b9a879'},
  de:{coat:'#7a7c64',coat2:'#686a53',coatD:'#55573f',trou:'#6d6f5d',putt:'#24201a',helm:'#5f6454',helmD:'#474b3e',leather:'#3e2c1c',boot:'#1e1a16',tab:'#9a3a2a',btn:'#a8a090'},
  art:{coat:'#7a7c64',coat2:'#686a53',coatD:'#55573f',trou:'#6d6f5d',putt:'#24201a',helm:'#5f6454',helmD:'#474b3e',leather:'#3e2c1c',boot:'#1e1a16',tab:'#1a1a1a',btn:'#a8a090'},
  drv:{coat:'#8a8f86',coat2:'#787d74',coatD:'#646960',trou:'#7d90a5',putt:'#6f8196',helm:'#71808e',helmD:'#56636f',leather:'#6e4a2a',boot:'#3c2a1a',tab:'#b8423a',btn:'#b9a879'}
};
const VX_SKIN=['#e4bf9c','#d8ad86','#ebcaa8','#c99a72','#dcb48f','#e0b48c','#cfa27c'];
const VX_HAIR=['#3a2a1e','#5a3e26','#2a2018','#7a5a3a','#4a3a2c','#8a7a62','#1e1814'];

/* ---------- la tête (unité : la demi-hauteur de la tête ; tournée vers la droite, de trois quarts) ---------- */
function vxHeadPath(g){
  g.beginPath();g.moveTo(.3,1);g.quadraticCurveTo(-.15,.98,-.5,.62);g.quadraticCurveTo(-.8,.42,-.84,-.05);
  g.bezierCurveTo(-.92,-.78,-.3,-1.08,.32,-1.0);g.quadraticCurveTo(.8,-.9,.82,-.36);g.quadraticCurveTo(.9,-.16,.86,.06);
  g.quadraticCurveTo(.88,.36,.74,.62);g.quadraticCurveTo(.62,.96,.3,1);g.closePath();
}
function vxHead(g,o){
  const f=o.f||1,s=o.s||10,sk=o.skin||'#e2bc98',ex=o.ex||'neutral',lod=o.lod!=null?o.lod:s,hair=o.hair||'#4a3424',hm=o.helmet||'none';
  g.save();g.translate(o.x,o.y);if(o.tilt)g.rotate(o.tilt);g.scale(s*f,s);g.lineCap='round';g.lineJoin='round';
  const skD=shade(sk,-.2),skL=shade(sk,.16),ink=shade(sk,-.62);
  // le cou (et le col de la capote, dessiné par le corps)
  if(!o.noNeck){g.fillStyle=shade(sk,-.3);g.beginPath();g.moveTo(-.5,.4);g.lineTo(.34,.6);g.lineTo(.3,1.55);g.lineTo(-.56,1.5);g.closePath();g.fill()}
  // les cheveux de la nuque
  if(hm!=='none'||o.bald){g.fillStyle=hair;g.beginPath();g.moveTo(-.88,-.32);g.quadraticCurveTo(-.98,.16,-.72,.44);g.lineTo(-.5,.22);g.lineTo(-.52,-.36);g.closePath();g.fill()}
  // le visage
  const gr=g.createRadialGradient(.42,-.2,.1,.15,.05,1.25);gr.addColorStop(0,skL);gr.addColorStop(.65,sk);gr.addColorStop(1,skD);
  vxHeadPath(g);g.fillStyle=gr;g.fill();
  if(lod<3.2){// tout petit : une ombre, un œil, une moustache
    g.fillStyle='rgba(60,30,20,.25)';g.fillRect(-.8,.25,1.4,.2);
    if(ex!=='sleep'){g.fillStyle='#1e1612';g.beginPath();g.arc(.18,-.12,.16,0,7);g.fill()}
    if(o.stache||o.beard){g.fillStyle=o.beardCol||hair;g.fillRect(.18,.4,.55,.18)}
    if(o.beard){g.globalAlpha=.75;g.beginPath();g.moveTo(-.5,.35);g.quadraticCurveTo(-.2,1.08,.4,1.02);g.quadraticCurveTo(.75,.8,.76,.45);g.closePath();g.fill();g.globalAlpha=1}
    vxHelmet(g,hm,o,lod);g.restore();return}
  // les ombres du visage : sous la pommette, la tempe, le menton
  g.save();vxHeadPath(g);g.clip();
  g.fillStyle=rgba(mix(sk,'#000000',.35),.28);
  g.beginPath();g.ellipse(-.55,.1,.42,.8,0,0,7);g.fill();
  g.fillStyle='rgba(90,40,30,.12)';g.beginPath();g.ellipse(.36,.98,.42,.16,0,0,7);g.fill();
  // les joues (un peu de rouge, plus pour les jeunes)
  g.fillStyle='rgba(200,80,70,'+(o.young?.2:.12)+')';g.beginPath();g.ellipse(-.02,.32,.26,.16,0,0,7);g.fill();g.beginPath();g.ellipse(.7,.3,.12,.12,0,0,7);g.fill();
  // la barbe de trois jours
  if(o.stubble){g.fillStyle=rgba(o.beardCol||'#3a2a1e',.18*o.stubble);g.beginPath();g.moveTo(-.62,.3);g.quadraticCurveTo(-.3,1.05,.32,1.02);g.quadraticCurveTo(.78,.86,.8,.42);g.lineTo(.55,.44);g.quadraticCurveTo(.35,.72,.05,.5);g.closePath();g.fill();
    if(lod>9){const R=mulberry(o.seed||3);g.fillStyle=rgba(o.beardCol||'#2a2018',.35*o.stubble);for(let k=0;k<60;k++){const a=R(),b=R(),x=-.55+a*1.3,y=.35+b*.62;if(y>.5+.35*Math.sin(a*3.1)||x>.12&&x<.6&&y<.5)continue;g.fillRect(x,y,.025,.025)}}}
  g.restore();
  // l'oreille
  g.fillStyle=skD;g.beginPath();g.ellipse(-.56,.04,.17,.27,-.1,0,7);g.fill();
  if(lod>6){g.strokeStyle=rgba('#6a3a2a',.5);g.lineWidth=.05;g.beginPath();g.arc(-.54,.02,.1,-1.6,1.4);g.stroke()}
  // les cheveux, tête nue
  if(hm==='none'&&!o.bald){g.fillStyle=hair;g.beginPath();g.moveTo(-.86,.02);g.quadraticCurveTo(-.95,-.86,-.1,-1.08);g.quadraticCurveTo(.62,-1.12,.84,-.5);
    g.quadraticCurveTo(.7,-.66,.58,-.6);g.quadraticCurveTo(.44,-.72,.3,-.6);g.quadraticCurveTo(.12,-.72,-.06,-.58);g.quadraticCurveTo(-.3,-.62,-.4,-.4);g.quadraticCurveTo(-.5,-.2,-.62,-.18);g.lineTo(-.7,.1);g.closePath();g.fill();
    // une mèche, des reflets
    if(lod>6){g.strokeStyle=rgba(mix(hair,'#ffffff',.25),.6);g.lineWidth=.045;for(let k=0;k<4;k++){g.beginPath();g.moveTo(-.7+k*.28,-.82+Math.abs(k-2)*.06);g.quadraticCurveTo(-.52+k*.28,-.98,-.32+k*.28,-.92);g.stroke()}}
    g.fillStyle=hair;g.beginPath();g.moveTo(-.5,-.3);g.lineTo(-.4,.12);g.lineTo(-.34,-.28);g.closePath();g.fill()}
  // les sourcils
  const bw={neutral:[0,0],sad:[-.12,.02],angry:[.09,-.02],shout:[.08,-.04],surprise:[-.1,-.1],wince:[.1,0],sleep:[0,.03],smile:[-.02,-.02],worry:[-.14,0]}[ex]||[0,0];
  g.strokeStyle=o.browCol||shade(hair,-.1);g.lineWidth=lod>8?.085:.11;
  g.beginPath();g.moveTo(-.16,-.34+bw[1]);g.quadraticCurveTo(.04,-.42+bw[1],.25,-.36+bw[0]);g.stroke();
  g.beginPath();g.moveTo(.54,-.37+bw[0]);g.quadraticCurveTo(.68,-.42+bw[1],.78,-.34+bw[1]);g.stroke();
  // les yeux
  const lid={neutral:.18,sad:.46,angry:.32,shout:.2,surprise:0,wince:1,sleep:1,smile:.4,worry:.3}[ex];
  vxEye(g,.06,-.11,.2,.1,lid,o,lod,ex);vxEye(g,.66,-.13,.125,.085,lid,o,lod,ex);
  // le nez
  g.fillStyle=skL;g.beginPath();g.moveTo(.42,-.3);g.quadraticCurveTo(.52,-.02,.64,.26);g.quadraticCurveTo(.62,.36,.5,.36);g.quadraticCurveTo(.44,.4,.36,.34);g.quadraticCurveTo(.4,.1,.42,-.3);g.fill();
  g.strokeStyle=rgba('#5a2a1a',.5);g.lineWidth=.05;g.beginPath();g.moveTo(.43,-.22);g.quadraticCurveTo(.5,0,.62,.24);g.quadraticCurveTo(.64,.34,.52,.37);g.stroke();
  g.fillStyle=rgba('#4a1a10',.55);g.beginPath();g.ellipse(.47,.34,.05,.025,.2,0,7);g.fill();
  g.strokeStyle=rgba('#5a2a1a',.35);g.beginPath();g.moveTo(.33,.3);g.quadraticCurveTo(.3,.37,.38,.38);g.stroke();
  // la bouche
  vxMouth(g,ex,o,lod);
  // la moustache, la barbe
  const bc=o.beardCol||hair;
  if(o.beard){g.fillStyle=bc;g.beginPath();g.moveTo(-.56,.18);g.quadraticCurveTo(-.6,.7,-.2,.98);g.quadraticCurveTo(.3,1.2,.62,.92);g.quadraticCurveTo(.84,.66,.8,.4);
    g.quadraticCurveTo(.68,.5,.62,.56);g.quadraticCurveTo(.4,.82,.2,.56);g.quadraticCurveTo(.05,.5,-.2,.4);g.quadraticCurveTo(-.4,.3,-.46,.12);g.closePath();g.fill();
    if(lod>8){g.strokeStyle=rgba('#000000',.18);g.lineWidth=.04;for(let k=0;k<9;k++){g.beginPath();g.moveTo(-.4+k*.13,.5+Math.sin(k)*.08);g.lineTo(-.36+k*.13,.82+Math.sin(k*2)*.08);g.stroke()}}}
  if(o.stache){g.fillStyle=bc;g.beginPath();
    if(o.stache==='croc'){const half=(sx)=>{g.save();g.translate(.42,.47);g.scale(sx,1);g.beginPath();g.moveTo(0,-.04);g.quadraticCurveTo(.12,-.09,.24,-.05);g.quadraticCurveTo(.36,-.01,.42,-.08);
        g.quadraticCurveTo(.47,-.16,.43,-.24);g.quadraticCurveTo(.5,-.17,.48,-.06);g.quadraticCurveTo(.44,.07,.3,.07);g.quadraticCurveTo(.14,.07,.04,.05);g.quadraticCurveTo(0,.05,0,.03);g.closePath();g.fill();
        if(lod>8){g.strokeStyle=rgba(mix(bc,'#000000',.35),.5);g.lineWidth=.02;g.beginPath();for(let k=1;k<5;k++){g.moveTo(k*.07,-.04);g.lineTo(k*.07+.03,.05)}g.stroke()}g.restore()};
      half(-.78);half(.62);g.beginPath()}
    else if(o.stache==='1914'){g.moveTo(.13,.58);g.quadraticCurveTo(.08,.46,.2,.42);g.quadraticCurveTo(.32,.36,.42,.42);g.quadraticCurveTo(.56,.36,.7,.42);g.quadraticCurveTo(.82,.46,.86,.38);
      g.quadraticCurveTo(.88,.52,.74,.56);g.quadraticCurveTo(.6,.58,.5,.54);g.quadraticCurveTo(.42,.6,.32,.56);g.quadraticCurveTo(.2,.62,.13,.58);
      g.fill();g.beginPath();if(lod>8){g.strokeStyle=rgba(mix(bc,'#000000',.35),.55);g.lineWidth=.025;for(let k=0;k<7;k++){const x=.2+k*.09;g.moveTo(x,.43);g.lineTo(x+.03,.55)}g.stroke();g.beginPath()}}
    else if(o.stache==='walrus'){g.moveTo(.14,.56);g.quadraticCurveTo(.2,.4,.42,.42);g.quadraticCurveTo(.6,.38,.72,.52);g.quadraticCurveTo(.66,.66,.58,.6);g.quadraticCurveTo(.42,.52,.3,.58);g.quadraticCurveTo(.2,.66,.14,.56)}
    else if(o.stache==='up'){g.moveTo(.2,.48);g.quadraticCurveTo(.3,.4,.44,.44);g.quadraticCurveTo(.58,.4,.68,.46);g.quadraticCurveTo(.8,.42,.84,.3);g.quadraticCurveTo(.82,.5,.66,.54);g.quadraticCurveTo(.44,.5,.24,.56);g.quadraticCurveTo(.06,.5,.02,.38);g.quadraticCurveTo(.1,.48,.2,.48)}
    else{g.moveTo(.2,.5);g.quadraticCurveTo(.42,.4,.66,.48);g.quadraticCurveTo(.42,.5,.2,.53)}
    g.fill()}
  // une égratignure, du sang, de la boue
  if(o.mud){g.fillStyle='rgba(70,50,30,.35)';g.beginPath();g.ellipse(-.2,.6,.2,.1,.3,0,7);g.ellipse(.62,-.62,.12,.06,0,0,7);g.fill()}
  vxHelmet(g,hm,o,lod);
  g.restore();
}
function vxEye(g,x,y,rx,ry,lid,o,lod,ex){
  g.save();g.translate(x,y);
  if(lid>=1){g.strokeStyle=rgba('#3a1a10',.8);g.lineWidth=.055;g.beginPath();if(ex==='wince'){g.moveTo(-rx,-.02);g.lineTo(0,.03);g.lineTo(rx,-.03)}else{g.moveTo(-rx,0);g.quadraticCurveTo(0,ry*.9,rx,0)}g.stroke();
    if(lod>8&&ex==='sleep'){g.lineWidth=.025;for(const k of[-.5,0,.5]){g.beginPath();g.moveTo(k*rx,ry*.55);g.lineTo(k*rx*1.1,ry*.95);g.stroke()}}
    g.restore();return}
  // le creux de l'orbite
  g.fillStyle='rgba(110,60,50,.16)';g.beginPath();g.ellipse(0,-ry*.2,rx*1.25,ry*1.7,0,0,7);g.fill();
  g.beginPath();g.ellipse(0,0,rx,ry,0,0,7);g.save();g.clip();
  g.fillStyle='#f2ece0';g.fillRect(-rx,-ry,rx*2,ry*2);
  const lk=o.look||[.35,0],ix=lk[0]*rx*.55,iy=lk[1]*ry*.5,ir=ry*(ex==='surprise'?.72:.86);
  g.fillStyle=o.eye||'#5a4632';g.beginPath();g.arc(ix,iy,ir,0,7);g.fill();
  if(lod>7){g.fillStyle=rgba('#000000',.25);g.beginPath();g.arc(ix,iy,ir,Math.PI*1.05,Math.PI*1.95);g.fill()}
  g.fillStyle='#120c08';g.beginPath();g.arc(ix,iy,ir*.46,0,7);g.fill();
  if(lod>6){g.fillStyle='rgba(255,255,255,.85)';g.beginPath();g.arc(ix-ir*.35,iy-ir*.38,ir*.24,0,7);g.fill()}
  // la paupière supérieure
  if(lid>0){g.fillStyle=shade(o.skin||'#e2bc98',-.08);g.fillRect(-rx,-ry,rx*2,ry*2*lid)}
  g.restore();
  g.strokeStyle=rgba('#2a140c',.85);g.lineWidth=lod>8?.045:.06;g.beginPath();g.ellipse(0,0,rx,ry,0,Math.PI*1.04,Math.PI*1.96);g.stroke();
  if(lid>0){g.beginPath();g.moveTo(-rx,-ry+ry*2*lid*.95);g.quadraticCurveTo(0,-ry+ry*2*lid*1.05,rx,-ry+ry*2*lid*.95);g.stroke()}
  if(lod>8){g.strokeStyle=rgba('#6a3a2a',.3);g.lineWidth=.025;g.beginPath();g.ellipse(0,ry*.15,rx*.9,ry*1.05,0,.3,Math.PI-.3);g.stroke();
    // le pli de la paupière, les cernes (on dort peu au front)
    g.beginPath();g.ellipse(0,-ry*.25,rx*1.05,ry*1.3,0,Math.PI*1.1,Math.PI*1.9);g.stroke();
    if(o.tired){g.strokeStyle=rgba('#6a4a5a',.35);g.lineWidth=.04;g.beginPath();g.ellipse(0,ry*.5,rx*.85,ry*1.05,0,.35,Math.PI-.35);g.stroke()}}
  g.restore();
}
function vxMouth(g,ex,o,lod){
  const lip=o.lip||'#a8544a';g.save();
  if(ex==='shout'||ex==='surprise'||ex==='open'){const big=ex==='shout';
    g.fillStyle='#3a1212';g.beginPath();g.ellipse(.42,.66,big?.17:.09,big?.15:.1,0,0,7);g.fill();
    if(big){g.fillStyle='#ece4d6';g.fillRect(.29,.53,.26,.05);g.fillStyle='#b04a4a';g.beginPath();g.ellipse(.42,.76,.1,.04,0,0,7);g.fill()}
    g.strokeStyle=rgba(lip,.8);g.lineWidth=.04;g.beginPath();g.ellipse(.42,.66,big?.17:.09,big?.15:.1,0,0,7);g.stroke()}
  else if(ex==='wince'){g.fillStyle='#3a1212';g.beginPath();g.moveTo(.2,.62);g.quadraticCurveTo(.42,.56,.66,.6);g.quadraticCurveTo(.44,.74,.2,.62);g.fill();g.fillStyle='#ece4d6';g.fillRect(.26,.6,.36,.035)}
  else{const down={sad:.07,worry:.04,angry:.03,smile:-.08,sleep:0,neutral:.01}[ex]||0;
    g.strokeStyle=rgba('#4a1a14',.85);g.lineWidth=lod>8?.045:.06;g.beginPath();g.moveTo(.2,.6+down);g.quadraticCurveTo(.42,.6-down*1.2,.64,.6+down*.8);g.stroke();
    if(lod>7){g.fillStyle=rgba(lip,.55);g.beginPath();g.moveTo(.24,.62+down);g.quadraticCurveTo(.42,.72,.6,.62+down*.8);g.quadraticCurveTo(.42,.66,.24,.62+down);g.fill();
      g.strokeStyle=rgba('#7a3a2a',.25);g.lineWidth=.03;g.beginPath();g.moveTo(.38,.78);g.quadraticCurveTo(.44,.82,.5,.78);g.stroke()}
    if(ex==='sleep'){g.fillStyle='#4a1a14';g.beginPath();g.ellipse(.42,.64,.05,.03,0,0,7);g.fill()}}
  g.restore();
}
function vxHelmet(g,hm,o,lod){
  if(hm==='none')return;
  const U=o.side==='de'?VXU.de:VXU.fr;
  if(hm==='adrian'){const c=o.helmCol||U.helm,cd=shade(c,-.3),cl=shade(c,.24),cm=shade(c,-.14);
    // le casque Adrian (modèle 1915), d'après le vrai : une bombe haute et ronde, un cimier en crête du front à la nuque,
    // et un bord continu qui s'évase vers le bas tout autour — court devant (la visière), plus long et plus plongeant derrière (le couvre-nuque)
    // le bord, vu par-dessous puis par-dessus
    g.fillStyle=cd;g.beginPath();g.moveTo(-.86,-.46);g.quadraticCurveTo(-1.1,-.36,-1.33,-.17);g.quadraticCurveTo(-1.37,-.12,-1.3,-.12);
    g.quadraticCurveTo(-.5,-.18,.3,-.2);g.quadraticCurveTo(.95,-.22,1.32,-.15);g.quadraticCurveTo(1.37,-.2,1.31,-.25);g.quadraticCurveTo(1.08,-.4,.84,-.46);g.quadraticCurveTo(0,-.36,-.86,-.46);g.fill();
    g.fillStyle=cm;g.beginPath();g.moveTo(-.86,-.46);g.quadraticCurveTo(-1.1,-.36,-1.32,-.19);g.quadraticCurveTo(-.6,-.26,.3,-.27);g.quadraticCurveTo(.95,-.28,1.3,-.23);g.quadraticCurveTo(1.08,-.4,.84,-.46);g.quadraticCurveTo(0,-.36,-.86,-.46);g.fill();
    g.fillStyle=rgba(cl,.35);g.beginPath();g.moveTo(.5,-.38);g.quadraticCurveTo(.95,-.36,1.26,-.26);g.quadraticCurveTo(.9,-.32,.5,-.33);g.closePath();g.fill();
    // la bombe
    g.fillStyle=c;g.beginPath();g.moveTo(-.86,-.46);g.bezierCurveTo(-.92,-1.1,-.5,-1.46,.0,-1.46);g.bezierCurveTo(.5,-1.46,.9,-1.1,.84,-.46);g.quadraticCurveTo(0,-.36,-.86,-.46);g.fill();
    const hg=g.createRadialGradient(-.2,-1.15,.05,0,-.85,1.05);hg.addColorStop(0,'rgba(255,255,255,.26)');hg.addColorStop(1,'rgba(0,0,0,.16)');g.fillStyle=hg;g.fill();
    // le jonc qui ceinture la bombe
    g.strokeStyle=cd;g.lineWidth=.08;g.beginPath();g.moveTo(-.86,-.47);g.quadraticCurveTo(0,-.37,.84,-.47);g.stroke();g.strokeStyle=rgba(cl,.4);g.lineWidth=.03;g.beginPath();g.moveTo(-.84,-.52);g.quadraticCurveTo(0,-.42,.82,-.52);g.stroke();
    // le cimier : une crête rapportée, posée sur le dessus de la bombe, qui dépasse de sa silhouette, du front à la nuque
    g.fillStyle=c;g.beginPath();g.moveTo(.56,-.98);g.bezierCurveTo(.46,-1.6,-.36,-1.72,-.64,-1.14);g.quadraticCurveTo(-.66,-1.06,-.58,-1.06);g.bezierCurveTo(-.32,-1.5,.36,-1.46,.44,-.98);g.quadraticCurveTo(.5,-.9,.56,-.98);g.fill();
    g.fillStyle=cl;g.beginPath();g.moveTo(.53,-1.0);g.bezierCurveTo(.44,-1.56,-.34,-1.66,-.6,-1.12);g.lineTo(-.55,-1.1);g.bezierCurveTo(-.3,-1.56,.4,-1.5,.48,-1.0);g.closePath();g.fill();
    g.strokeStyle=cd;g.lineWidth=.03;g.beginPath();g.moveTo(.44,-.98);g.bezierCurveTo(.36,-1.46,-.32,-1.5,-.58,-1.06);g.stroke();
    if(lod>6){g.fillStyle=cd;g.beginPath();g.arc(.5,-.98,.035,0,7);g.arc(-.58,-1.08,.035,0,7);g.fill();
      // l'insigne : la grenade de l'infanterie, sur le devant, sous la pointe du cimier
      g.save();g.translate(.56,-.72);g.fillStyle=shade(c,.34);g.beginPath();g.arc(0,.04,.08,0,7);g.fill();g.beginPath();g.moveTo(-.035,-.03);g.quadraticCurveTo(-.06,-.14,0,-.24);g.quadraticCurveTo(.06,-.14,.035,-.03);g.fill();g.restore()}
    // la jugulaire de cuir : du bord, devant l'oreille, le long de la joue, sous le menton
    if(!o.noStrap){g.strokeStyle='#5a3a1e';g.lineWidth=lod>8?.075:.1;g.beginPath();g.moveTo(-.44,-.3);g.quadraticCurveTo(-.62,.66,.3,1.04);g.stroke();
      if(lod>8){g.strokeStyle='rgba(255,220,170,.25)';g.lineWidth=.025;g.beginPath();g.moveTo(-.42,-.28);g.quadraticCurveTo(-.6,.64,.3,1.02);g.stroke();g.fillStyle='#9a8a6a';g.fillRect(-.53,.22,.1,.12)}
      g.strokeStyle='#4a2e16';g.lineWidth=lod>8?.06:.08;g.beginPath();g.moveTo(.3,1.04);g.quadraticCurveTo(.66,.96,.75,.6);g.quadraticCurveTo(.88,.3,.84,-.24);g.stroke()}
    if(o.splat)vxSplat(g,.0,-1.42);
  }else if(hm==='stahl'){const c=o.helmCol||VXU.de.helm,cd=shade(c,-.3),cl=shade(c,.18);
    g.fillStyle=cd;g.beginPath();g.moveTo(-1.02,-.18);g.quadraticCurveTo(-1.1,.32,-.86,.42);g.lineTo(-.56,.18);g.lineTo(-.6,-.3);g.closePath();g.fill();
    g.fillStyle=c;g.beginPath();g.moveTo(-.98,-.12);g.bezierCurveTo(-1.08,-1.34,1.0,-1.36,.98,-.4);g.quadraticCurveTo(1.12,-.32,1.18,-.22);g.quadraticCurveTo(.7,-.3,.4,-.3);g.quadraticCurveTo(-.2,-.28,-.56,-.18);g.quadraticCurveTo(-.7,0,-.98,-.12);g.fill();
    const hg=g.createLinearGradient(-.6,-1.2,.6,-.3);hg.addColorStop(0,'rgba(255,255,255,.15)');hg.addColorStop(1,'rgba(0,0,0,.15)');g.fillStyle=hg;g.fill();
    if(lod>5){g.fillStyle=cl;g.beginPath();g.arc(-.42,-.55,.09,0,7);g.fill();g.strokeStyle=rgba('#000',.25);g.lineWidth=.03;g.beginPath();g.moveTo(-.56,-.18);g.quadraticCurveTo(-.2,-.3,.4,-.3);g.stroke();
      g.strokeStyle=o.helmCol?cd:'#2a2a22';g.lineWidth=.05;g.beginPath();g.moveTo(-.6,-.2);g.quadraticCurveTo(-.4,.5,.2,.96);g.stroke()}
    if(o.splat)vxSplat(g,.0,-1.12);
  }else if(hm==='pickel'){const c='#8a8a6e';
    g.fillStyle='#2a2a22';g.beginPath();g.ellipse(.15,-.36,1.0,.16,-.08,0,7);g.fill();
    g.fillStyle=c;g.beginPath();g.moveTo(-.88,-.36);g.bezierCurveTo(-.95,-1.2,.92,-1.2,.92,-.4);g.closePath();g.fill();
    g.fillStyle=shade(c,-.15);g.beginPath();g.moveTo(-.12,-1.02);g.lineTo(-.02,-1.6);g.lineTo(.12,-1.02);g.closePath();g.fill();
    if(lod>6){g.fillStyle='#4a2a1e';g.font='bold .3px serif';g.textAlign='center';g.fillText('', .4,-.6)}
    if(o.splat)vxSplat(g,0,-1.04);
  }else if(hm==='calot'){const c=o.helmCol||U.coat2;g.fillStyle=c;g.beginPath();g.moveTo(-.8,-.6);g.quadraticCurveTo(0,-1.3,.84,-.62);g.lineTo(.7,-.48);g.quadraticCurveTo(0,-.8,-.72,-.42);g.closePath();g.fill();g.fillStyle=shade(c,-.2);g.fillRect(-.72,-.56,1.5,.08)}
  else if(hm==='kepi'){g.fillStyle='#2a3044';g.beginPath();g.moveTo(-.86,-.42);g.lineTo(-.72,-1.62);g.lineTo(.82,-1.62);g.lineTo(.86,-.42);g.closePath();g.fill();
    g.fillStyle='#a8322d';g.beginPath();g.moveTo(-.74,-1.4);g.lineTo(-.72,-1.62);g.lineTo(.82,-1.62);g.lineTo(.83,-1.4);g.closePath();g.fill();g.fillStyle='#8a2a26';g.beginPath();g.ellipse(.05,-1.62,.77,.12,0,0,7);g.fill();
    g.strokeStyle='#c9a24a';g.lineWidth=.05;for(const y of[-.9,-1.02,-1.14]){g.beginPath();g.moveTo(-.82,y);g.lineTo(.84,y);g.stroke()}
    g.fillStyle='#141414';g.beginPath();g.moveTo(.2,-.5);g.quadraticCurveTo(.9,-.5,1.28,-.32);g.lineTo(1.2,-.26);g.quadraticCurveTo(.8,-.4,.2,-.4);g.closePath();g.fill();
    g.strokeStyle='#2a2a2a';g.lineWidth=.06;g.beginPath();g.moveTo(-.8,-.48);g.lineTo(.84,-.48);g.stroke()}
  else if(hm==='mutze'){g.fillStyle='#6a6c56';g.beginPath();g.ellipse(.05,-.82,.92,.32,0,0,7);g.fill();g.fillStyle='#9a3a2a';g.fillRect(-.82,-.74,1.7,.14);g.fillStyle='#d8d0b8';g.beginPath();g.arc(.5,-.68,.05,0,7);g.fill()}
}
function vxSplat(g,x,y){g.save();g.translate(x,y);g.fillStyle='#f4f2ea';g.beginPath();g.ellipse(0,0,.34,.14,0,0,7);g.fill();g.beginPath();g.ellipse(-.22,.14,.07,.18,0,0,7);g.ellipse(.18,.18,.06,.22,0,0,7);g.fill();g.fillStyle='#9a9a8a';g.beginPath();g.arc(.05,-.04,.07,0,7);g.fill();g.restore()}

/* ---------- le corps articulé ---------- */
/* angles comptés depuis la verticale descendante ; positifs = vers l'avant (le côté où il regarde) */
const VX_P={
  stand:{lean:0,lh:.06,lk:0,rh:-.06,rk:-.02,na1:.12,na2:.18,fa1:-.08,fa2:0},
  sit:{lean:-.06,lh:1.5,lk:.12,rh:1.42,rk:.04,na1:.55,na2:1.45,fa1:.4,fa2:1.4},
  kneel:{lean:.12,lh:1.45,lk:.05,rh:.18,rk:-1.42,na1:.5,na2:1.6,fa1:.3,fa2:1.4},
  aim:{lean:.12,lh:.16,lk:-.04,rh:-.2,rk:-.12,nT:{x:1.25,y:-4.55},fT:{x:3.95,y:-4.85},head:.22},
  point:{lean:-.06,lh:.08,lk:0,rh:-.12,rk:-.06,na1:2.5,na2:2.75,fa1:-.1,fa2:.15,head:-.3},
  binoc:{lean:-.04,lh:.06,lk:0,rh:-.08,rk:-.04,nT:{x:1.75,y:-5.9},fT:{x:1.45,y:-5.75},head:-.08},
  carry:{lean:.08,lh:.1,lk:0,rh:-.1,rk:-.04,nT:{x:1.9,y:-2.6},fT:{x:1.6,y:-2.8}},
  throwUp:{lean:-.12,lh:.04,lk:0,rh:-.1,rk:-.04,na1:2.6,na2:2.7,fa1:2.4,fa2:2.55,head:-.4}
};
function vxPoseMix(a,b,k){const o={};for(const n of new Set([...Object.keys(a),...Object.keys(b)])){const u=a[n],v=b[n];if((u&&typeof u==='object')||(v&&typeof v==='object')){const p=u||v,q=v||u;o[n]={x:lerp(p.x,q.x,k),y:lerp(p.y,q.y,k)}}else o[n]=lerp(u||0,v||0,k)}return o}
function vxWalk(t,amp){amp=amp==null?1:amp;const s=Math.sin(t),c=Math.cos(t);
  return{lean:.06,lh:.42*s*amp,lk:.42*s*amp-Math.max(0,-c)*.7*amp,rh:-.42*s*amp,rk:-.42*s*amp-Math.max(0,c)*.7*amp,na1:-.32*s*amp+.05,na2:-.2*s*amp+.25,fa1:.32*s*amp,fa2:.3*s*amp+.2,bob:Math.abs(c)*.25*amp}}
function vxIK(S,T,l1,l2,bend){const dx=T.x-S.x,dy=T.y-S.y,d=clamp(Math.hypot(dx,dy),.01,l1+l2-.001),a=Math.atan2(dx,dy),al=Math.acos(clamp((l1*l1+d*d-l2*l2)/(2*l1*d),-1,1)),a1=a+bend*al,ex=S.x+Math.sin(a1)*l1,ey=S.y+Math.cos(a1)*l1;return[a1,Math.atan2(T.x-ex,T.y-ey)]}
function vxRig(p){
  const seg=(a,b,l)=>({x:a.x+Math.sin(b)*l,y:a.y+Math.cos(b)*l}),TR=3.7,ln=p.lean||0;
  const H={x:0,y:0},sh={x:Math.sin(ln)*TR,y:-Math.cos(ln)*TR};
  const nk=seg(H,p.lh||0,3.3),na=seg(nk,p.lk||0,3.25),fk=seg({x:-.2,y:-.1},p.rh||0,3.3),fa=seg(fk,p.rk||0,3.25);
  const nsh={x:sh.x+Math.cos(ln)*.25,y:sh.y+Math.sin(ln)*.25+.25},fsh={x:sh.x-Math.cos(ln)*.45,y:sh.y-Math.sin(ln)*.45+.15};
  let na1=p.na1||0,na2=p.na2||0,fa1=p.fa1||0,fa2=p.fa2||0;
  if(p.nT)[na1,na2]=vxIK(nsh,p.nT,2.6,2.4,-1);if(p.fT)[fa1,fa2]=vxIK(fsh,p.fT,2.6,2.4,-1);
  const ne=seg(nsh,na1,2.6),nh=seg(ne,na2,2.4),fe=seg(fsh,fa1,2.6),fh=seg(fe,fa2,2.4);
  const hd={x:sh.x+Math.sin(ln+(p.head||0)*.4)*2.05+.14,y:sh.y-Math.cos(ln+(p.head||0)*.4)*2.05};
  return{H,sh,nk,na,fk,fa,nsh,fsh,ne,nh,fe,fh,hd};
}
function vxLimb(g,a,b,w,col){g.strokeStyle=col;g.lineWidth=w;g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke()}
function vxBoot(g,ank,ang,col,big){g.save();g.translate(ank.x,ank.y);g.rotate(-ang);g.fillStyle=col;g.beginPath();g.moveTo(-.55,-.35);g.lineTo(.45,-.4);g.quadraticCurveTo(1.35,-.25,1.38,.25);g.lineTo(1.4,.42);g.lineTo(-.62,.42);g.closePath();g.fill();
  g.fillStyle='rgba(0,0,0,.35)';g.fillRect(-.62,.3,2.02,.14);if(big){g.fillStyle='rgba(255,255,255,.08)';g.fillRect(.2,-.3,.9,.12)}g.restore()}
/* o : {x,y (sol, ou o.hip), s, f, side, pose, t, face, kit, lod} — renvoie les articulations (en pixels du monde) */
function vxSoldier(g,o){
  const s=o.s,f=o.f||1,U=VXU[o.side||'fr'],p=o.pose||VX_P.stand,R=vxRig(p),lod=s;
  g.save();
  if(o.hip)g.translate(o.hip.x,o.hip.y);
  else{const legY=Math.max(R.na.y,R.fa.y)+.42;g.translate(o.x,o.y-legY*s-(p.bob||0)*s)}
  g.scale(s*f,s);g.lineCap='round';g.lineJoin='round';
  if(o.rot)g.rotate(o.rot);
  const coat=o.coatCol||U.coat,coatF=shade(coat,-.18),trou=U.trou,trouF=shade(trou,-.2),capote=o.side==='fr'||o.side==='drv'||o.capote;
  const W1=1.5,W2=1.22,A1=1.18,A2=1.0;
  // le bras du fond
  vxLimb(g,R.fsh,R.fe,A1,coatF);vxLimb(g,R.fe,R.fh,A2,coatF);g.fillStyle=shade(o.face&&o.face.skin||'#e2bc98',-.25);g.beginPath();g.arc(R.fh.x,R.fh.y,.42,0,7);g.fill();
  // la jambe du fond
  vxLimb(g,R.H,R.fk,W1,trouF);vxLimb(g,R.fk,R.fa,W2,o.side==='fr'||o.side==='drv'?shade(U.putt,-.2):U.putt);vxBoot(g,R.fa,(p.rk||0),shade(U.boot,-.2));
  // le sac
  if(o.kit&&o.kit.pack){g.save();g.translate(R.H.x,R.H.y);g.rotate(p.lean||0);
    g.fillStyle=o.side==='de'?'#6a5a40':'#5a5040';rr(g,-2.1,-3.9,1.3,2.6,.25);g.fill();g.fillStyle='rgba(0,0,0,.2)';g.fillRect(-2.1,-2.6,1.3,.12);
    if(o.side==='de'){g.fillStyle='#6a6450';g.beginPath();g.ellipse(-1.4,-4.0,1.1,.38,0,0,7);g.fill()}else{g.fillStyle='#6a6a62';g.beginPath();g.ellipse(-1.45,-4.05,1.15,.42,0,0,7);g.fill();g.fillStyle='#b8b8b0';g.fillRect(-1.95,-4.72,.8,.5)}
    g.restore()}
  // la cuisse de devant (sous le pan de la capote)
  vxLimb(g,R.H,R.nk,W1,trou);
  // le torse (capote ou vareuse) et le pan de la capote
  {const ln=p.lean||0,c=Math.cos(ln),sn=Math.sin(ln),px=c,py=sn;// perpendiculaire (vers l'avant)
   const sb={x:R.sh.x-px*1.12,y:R.sh.y-py*1.12+.15},sf={x:R.sh.x+px*1.05,y:R.sh.y+py*1.05+.25},hb={x:-px*1.05,y:-py*1.05},hf={x:px*1.0,y:py*1.0};
   const mx=(R.nk.x+R.fk.x)/2,my=(R.nk.y+R.fk.y)/2,dl=Math.hypot(mx,my)||1,dx=mx/dl,dy=my/dl,len=capote?3.0:1.15;
   const bc={x:dx*len,y:dy*len},bw=capote?1.12:1.0,bf={x:bc.x+dy*bw,y:bc.y-dx*bw},bb={x:bc.x-dy*bw,y:bc.y+dx*bw};
   const f1=bf.x*f>bb.x*f?bf:bb,b1=f1===bf?bb:bf;
   g.fillStyle=capote?shade(coat,-.06):coat;g.beginPath();g.moveTo(hb.x-px*.05,hb.y);g.lineTo(hf.x+px*.1,hf.y);g.quadraticCurveTo((hf.x+f1.x)/2+px*.25,(hf.y+f1.y)/2,f1.x,f1.y);
   g.quadraticCurveTo(bc.x+dx*.25,bc.y+dy*.25,b1.x,b1.y);g.quadraticCurveTo((hb.x+b1.x)/2-px*.2,(hb.y+b1.y)/2,hb.x-px*.05,hb.y);g.closePath();g.fill();
   if(capote&&lod>5){g.strokeStyle=rgba('#000000',.2);g.lineWidth=.08;g.beginPath();g.moveTo(f1.x,f1.y);g.quadraticCurveTo(bc.x+dx*.25,bc.y+dy*.25,b1.x,b1.y);g.stroke()}
   if(capote&&lod>5){g.strokeStyle=rgba('#000000',.16);g.lineWidth=.07;g.beginPath();g.moveTo(bc.x*.15,bc.y*.15);g.lineTo(bc.x,bc.y);g.stroke();g.fillStyle=U.btn;g.beginPath();g.arc(bc.x*.5,bc.y*.5,.1,0,7);g.fill()}
   g.fillStyle=coat;g.beginPath();g.moveTo(hb.x,hb.y);g.quadraticCurveTo(sb.x-px*.2,(hb.y+sb.y)/2,sb.x,sb.y);g.quadraticCurveTo(R.sh.x,R.sh.y-.3,sf.x,sf.y);
   g.quadraticCurveTo(sf.x+px*.4,(sf.y+hf.y)/2-.3,hf.x,hf.y);g.closePath();g.fill();
   if(lod>4){const tg=g.createLinearGradient(hb.x,0,hf.x,0);tg.addColorStop(0,'rgba(0,0,0,.18)');tg.addColorStop(.6,'rgba(255,255,255,.05)');tg.addColorStop(1,'rgba(0,0,0,.08)');g.fillStyle=tg;g.fill()}
   // le col, les écussons (le numéro du régiment), les boutons, le ceinturon et ses cartouchières
   g.fillStyle=shade(coat,-.12);g.beginPath();g.moveTo(R.sh.x-px*.55,R.sh.y-py*.55-.1);g.lineTo(R.sh.x+px*.6,R.sh.y+py*.6+.05);g.lineTo(R.sh.x+px*.35+sn*.6,R.sh.y+py*.35+.6);g.lineTo(R.sh.x-px*.45+sn*.6,R.sh.y-py*.45+.55);g.closePath();g.fill();
   if(lod>7){g.fillStyle=U.tab;g.fillRect(R.sh.x+px*.05,R.sh.y+py*.05+.05,.4,.32);if(o.regt&&lod>14){g.fillStyle='#e8c060';g.font='bold .22px serif';g.textAlign='center';g.fillText(o.regt,R.sh.x+px*.25,R.sh.y+py*.25+.3)}
     g.fillStyle=U.btn;for(let k=0;k<(capote?4:5);k++){const u=.25+k*.17;g.beginPath();g.arc(lerp(sf.x,hf.x,u)-px*.22,lerp(sf.y,hf.y,u)-py*.22,.09,0,7);g.fill();if(capote){g.beginPath();g.arc(lerp(sf.x,hf.x,u)-px*.82,lerp(sf.y,hf.y,u)-py*.82,.09,0,7);g.fill()}}}
   const by={x:lerp(hb.x,sb.x,.1),y:lerp(hb.y,sb.y,.1)},bf2={x:lerp(hf.x,sf.x,.1),y:lerp(hf.y,sf.y,.1)};
   g.strokeStyle=U.leather;g.lineWidth=.32;g.beginPath();g.moveTo(by.x,by.y);g.lineTo(bf2.x+px*.15,bf2.y+py*.15);g.stroke();
   if(!o.noPouch){g.fillStyle=shade(U.leather,-.1);for(const u of[.45,.75]){const x=lerp(by.x,bf2.x,u),y=lerp(by.y,bf2.y,u);g.save();g.translate(x,y);g.rotate(ln);rr(g,-.3,-.42,.62,.62,.1);g.fill();g.restore()}}
   // la musette et le bidon (en bandoulière)
   if(o.kit&&o.kit.musette){g.strokeStyle=shade(U.coatD,-.2);g.lineWidth=.14;g.beginPath();g.moveTo(sf.x,sf.y);g.lineTo(hb.x-px*.2,hb.y+.8);g.stroke();g.fillStyle=o.side==='de'?'#7a7056':'#6e6a50';rr(g,hb.x-px*.9,hb.y+.3,1.3,1.1,.3);g.fill()}
   if(o.kit&&o.kit.bidon){g.fillStyle=o.side==='de'?'#5a5040':'#4a4a5a';g.beginPath();g.ellipse(hf.x-px*.2,hf.y+.75,.42,.62,0,0,7);g.fill()}
  }
  // le bas de la jambe de devant
  if(!capote)vxLimb(g,R.H,R.nk,W1,trou);
  const leg2=o.side==='fr'||o.side==='drv'?U.putt:U.putt;vxLimb(g,R.nk,R.na,W2,leg2);
  if((o.side==='fr'||o.side==='drv')&&lod>5){g.strokeStyle=rgba('#000000',.18);g.lineWidth=.07;for(let k=1;k<6;k++){const u=k/6,x=lerp(R.nk.x,R.na.x,u),y=lerp(R.nk.y,R.na.y,u);g.beginPath();g.moveTo(x-.55,y+.12);g.lineTo(x+.55,y-.18);g.stroke()}}
  else if(lod>5){g.fillStyle='rgba(255,255,255,.07)';g.beginPath();g.ellipse(lerp(R.nk.x,R.na.x,.4)+.15,lerp(R.nk.y,R.na.y,.4),.2,1,0,0,7);g.fill()}
  vxBoot(g,R.na,(p.lk||0),U.boot,true);
  // le fusil (sous la main de devant)
  if(o.rifle){const a=o.rifle.a!=null?o.rifle.a:Math.atan2(R.fh.y-R.nh.y,R.fh.x-R.nh.x),h=o.rifle.from==='near'?R.nh:R.fh,back=o.rifle.back!=null?o.rifle.back:4.4;
    vxRifle(g,h.x-Math.cos(a)*back,h.y-Math.sin(a)*back,a,o.side,o.rifle.bayo,lod,o.rifle.flash)}
  // la tête
  const fc=Object.assign({x:R.hd.x,y:R.hd.y,s:1.2,f:1,lod:lod*1.2,side:o.side==='drv'?'fr':o.side,tilt:(p.head||0)*.6},o.face||{});
  vxHead(g,fc);
  // le bras de devant
  vxLimb(g,R.nsh,R.ne,A1,coat);vxLimb(g,R.ne,R.nh,A2,coat);
  if(lod>5){g.fillStyle=shade(coat,-.15);g.save();g.translate(R.nh.x,R.nh.y);g.rotate(Math.atan2(R.nh.y-R.ne.y,R.nh.x-R.ne.x));g.fillRect(-.7,-.52,.3,1.04);g.restore()}
  g.fillStyle=o.face&&o.face.skin||'#e2bc98';g.beginPath();g.arc(R.nh.x,R.nh.y,.44,0,7);g.fill();
  if(lod>8){g.strokeStyle=rgba('#7a4a3a',.4);g.lineWidth=.05;g.beginPath();g.arc(R.nh.x,R.nh.y,.3,.3,1.6);g.stroke()}
  if(o.held)o.held(g,R);
  g.restore();
  // en pixels du monde
  const tx=o.hip?o.hip.x:o.x,ty=o.hip?o.hip.y:o.y-(Math.max(R.na.y,R.fa.y)+.42)*s-(p.bob||0)*s,W2P=q=>({x:tx+q.x*s*f,y:ty+q.y*s});
  return{head:W2P(R.hd),nh:W2P(R.nh),fh:W2P(R.fh),hip:W2P(R.H),sh:W2P(R.sh)};
}
function vxRifle(g,x,y,a,side,bayo,lod,flash){g.save();g.translate(x,y);g.rotate(a);
  const L=10.6;g.fillStyle=side==='de'?'#6a4426':'#7a4a28';g.beginPath();g.moveTo(0,-.45);g.lineTo(2.6,-.22);g.lineTo(7.4,-.12);g.lineTo(7.4,.16);g.lineTo(2.8,.24);g.lineTo(1.4,.62);g.lineTo(0,.5);g.closePath();g.fill();
  g.strokeStyle='#3a3a3c';g.lineWidth=.2;g.beginPath();g.moveTo(2.6,-.14);g.lineTo(L,-.06);g.stroke();
  if(lod>5){g.fillStyle='#5a5a5c';g.fillRect(3.1,-.32,.7,.24);g.fillRect(6.4,-.2,.16,.38);g.fillRect(8.6,-.16,.14,.3);g.strokeStyle='#2a2a2c';g.lineWidth=.08;g.beginPath();g.moveTo(3.4,-.3);g.lineTo(3.2,-.62);g.stroke()}
  if(bayo){g.strokeStyle='#c8ccd0';g.lineWidth=.12;g.beginPath();g.moveTo(L-.2,.12);g.lineTo(L+(side==='fr'?3.6:2.4),.08);g.stroke()}
  if(flash){g.fillStyle='rgba(255,230,140,'+flash+')';g.beginPath();g.moveTo(L,0);g.lineTo(L+2.6,-.8);g.lineTo(L+1.8,0);g.lineTo(L+2.8,.7);g.closePath();g.fill();g.fillStyle='rgba(255,255,230,'+flash+')';g.beginPath();g.arc(L+.4,0,.5,0,7);g.fill()}
  g.restore()}

/* ---------- le cheval de trait (au trot), harnaché ---------- */
function vxHorse(g,x,y,s,f,t,o){
  o=o||{};g.save();g.translate(x,y);g.scale(s*f,s);g.lineCap='round';g.lineJoin='round';
  const col=o.col||'#7a4a2a',dk=mix(col,'#000000',.3),lt=mix(col,'#ffffff',.18),mane=o.mane||'#1e1612',ph=t*(o.rate||9),far=o.far;
  const legCol=o.socks?'#e8e0d0':mix(col,'#000000',.45),dk2=mix(col,'#000000',.45);
  const leg=(hx,hy,a,b,fore,c,cs)=>{const k={x:hx+Math.sin(a)*30,y:hy+Math.cos(a)*30},h={x:k.x+Math.sin(b)*30,y:k.y+Math.cos(b)*30};
    g.strokeStyle=c;g.lineWidth=fore?11:13;g.beginPath();g.moveTo(hx,hy);g.lineTo(k.x,k.y);g.stroke();g.lineWidth=7.5;g.strokeStyle=cs;g.beginPath();g.moveTo(k.x,k.y);g.lineTo(h.x,h.y);g.stroke();
    // les fanons et le sabot
    g.fillStyle=mane;g.beginPath();g.ellipse(h.x-1,h.y-3,6,4,0,0,7);g.fill();g.fillStyle='#2a2420';g.beginPath();g.moveTo(h.x-6,h.y-1);g.lineTo(h.x+6,h.y-1);g.lineTo(h.x+7,h.y+5);g.lineTo(h.x-6,h.y+5);g.closePath();g.fill()};
  const tr=(k)=>{const sn=Math.sin(ph+k);return[.34*sn,.34*sn-Math.max(0,Math.cos(ph+k))*.9]};
  const [a1,b1]=tr(0),[a2,b2]=tr(Math.PI);
  // les jambes du fond
  leg(34,-62,a2*.9,b2*.9,true,dk,dk2);leg(-46,-64,-a1*.8,-a1*.8+Math.max(0,Math.cos(ph))*.6,false,dk,dk2);
  // la queue
  g.fillStyle=mane;g.beginPath();g.moveTo(-70,-92);g.quadraticCurveTo(-92,-80+Math.sin(ph*.5)*4,-88,-36);g.quadraticCurveTo(-80,-30,-74,-40);g.quadraticCurveTo(-80,-70,-64,-86);g.closePath();g.fill();
  // le corps
  const bg=g.createLinearGradient(0,-108,0,-48);bg.addColorStop(0,lt);bg.addColorStop(.5,col);bg.addColorStop(1,dk);g.fillStyle=bg;
  g.beginPath();g.moveTo(-62,-98);g.bezierCurveTo(-30,-106,16,-98,32,-104);g.bezierCurveTo(44,-108,54,-96,58,-84);g.bezierCurveTo(64,-70,58,-56,46,-52);
  g.bezierCurveTo(20,-46,-20,-46,-42,-52);g.bezierCurveTo(-58,-54,-74,-62,-76,-78);g.bezierCurveTo(-78,-92,-72,-98,-62,-98);g.closePath();g.fill();
  // l'épaule, la cuisse (modelé)
  g.fillStyle='rgba(255,230,200,.1)';g.beginPath();g.ellipse(36,-80,16,20,-.3,0,7);g.fill();g.beginPath();g.ellipse(-56,-80,16,18,.2,0,7);g.fill();
  g.strokeStyle='rgba(0,0,0,.15)';g.lineWidth=1.5;g.beginPath();g.moveTo(-40,-88);g.quadraticCurveTo(-50,-62,-44,-54);g.stroke();
  // l'encolure et la tête
  g.fillStyle=col;g.beginPath();g.moveTo(26,-102);g.bezierCurveTo(40,-128,60,-144,78,-152);g.lineTo(88,-146);g.bezierCurveTo(92,-128,82,-108,66,-88);g.bezierCurveTo(60,-80,56,-76,52,-74);g.closePath();g.fill();
  g.fillStyle=col;g.beginPath();g.moveTo(76,-154);g.bezierCurveTo(84,-160,94,-156,98,-148);g.bezierCurveTo(106,-132,114,-118,116,-108);g.bezierCurveTo(118,-98,110,-94,102,-96);
  g.bezierCurveTo(94,-100,88,-114,84,-122);g.bezierCurveTo(80,-130,76,-140,76,-154);g.closePath();g.fill();
  g.fillStyle=lt;g.beginPath();g.ellipse(102,-118,6,16,-.5,0,7);g.globalAlpha=.4;g.fill();g.globalAlpha=1;
  g.fillStyle=shade(col,-.15);g.beginPath();g.ellipse(88,-118,10,12,0,0,7);g.fill();
  if(o.blaze){g.fillStyle='#ece4d4';g.beginPath();g.moveTo(94,-150);g.quadraticCurveTo(108,-126,112,-104);g.lineTo(108,-104);g.quadraticCurveTo(100,-128,92,-148);g.closePath();g.fill()}
  // l'œil, le naseau, la bouche, les oreilles
  g.fillStyle='#1a1210';g.beginPath();g.ellipse(91,-140,2.6,2,-.3,0,7);g.fill();g.fillStyle='rgba(255,255,255,.7)';g.beginPath();g.arc(90.4,-140.6,.7,0,7);g.fill();
  g.fillStyle='#2a1a14';g.beginPath();g.ellipse(112,-106,2.4,3.4,-.4,0,7);g.fill();g.strokeStyle='rgba(30,20,16,.6)';g.lineWidth=1;g.beginPath();g.moveTo(104,-98);g.quadraticCurveTo(110,-99,113,-101);g.stroke();
  const ew=Math.sin(t*1.7+(o.ph||0))*.15;
  for(const k of[0,1]){g.save();g.translate(80+k*5,-154);g.rotate(-.3+ew+k*.15);g.fillStyle=k?dk:col;g.beginPath();g.moveTo(-3,0);g.quadraticCurveTo(-1,-14,2,-16);g.quadraticCurveTo(5,-8,4,0);g.closePath();g.fill();g.restore()}
  // la crinière, le toupet
  g.fillStyle=mane;g.beginPath();g.moveTo(24,-104);for(let k=0;k<=10;k++){const u=k/10,x=lerp(28,80,u),y=lerp(-104,-154,u)+Math.sin(u*7)*2;g.lineTo(x-4-Math.sin(ph*.5+k)*1.2,y-6-k*.2);g.lineTo(x+2,y+1)}
  g.lineTo(78,-150);g.lineTo(30,-98);g.closePath();g.fill();g.beginPath();g.moveTo(84,-152);g.quadraticCurveTo(96,-150,94,-138);g.quadraticCurveTo(88,-144,84,-152);g.fill();
  // le harnais : collier et attelles, sellette, sous-ventrière, avaloire, traits, bride et œillère
  const L2=o.leather||'#2a1c12',brass='#c9a24a';
  g.fillStyle=L2;g.save();g.translate(52,-96);g.rotate(-.42);g.beginPath();g.ellipse(0,0,11,25,0,0,7);g.fill();g.fillStyle='#4a3424';g.beginPath();g.ellipse(-2,0,6,20,0,0,7);g.fill();
  g.strokeStyle=brass;g.lineWidth=2.2;g.beginPath();g.moveTo(-6,-24);g.quadraticCurveTo(-12,0,-6,22);g.stroke();g.fillStyle=brass;g.beginPath();g.arc(-6,-27,3,0,7);g.fill();g.restore();
  g.fillStyle=L2;rr(g,0,-110,22,12,3);g.fill();g.fillRect(8,-100,6,48);g.fillStyle=brass;g.beginPath();g.arc(11,-104,2.2,0,7);g.fill();
  g.strokeStyle=L2;g.lineWidth=4;g.beginPath();g.moveTo(-50,-98);g.quadraticCurveTo(-80,-84,-66,-62);g.stroke();g.lineWidth=3;g.beginPath();g.moveTo(-28,-100);g.lineTo(-56,-72);g.stroke();
  g.lineWidth=3.2;g.beginPath();g.moveTo(44,-80);g.lineTo(o.traceTo?o.traceTo:-120,-74);g.stroke();
  g.lineWidth=2;g.beginPath();g.moveTo(78,-148);g.lineTo(100,-102);g.moveTo(84,-150);g.quadraticCurveTo(94,-152,96,-146);g.moveTo(96,-112);g.lineTo(114,-110);g.stroke();
  g.fillStyle=L2;rr(g,84,-148,10,10,2);g.fill();g.fillStyle=brass;g.beginPath();g.arc(104,-104,2.2,0,7);g.fill();
  // les jambes de devant
  leg(40,-60,a1,b1,true,col,legCol);leg(-50,-62,-a2*.8,-a2*.8+Math.max(0,Math.cos(ph+Math.PI))*.6,false,col,legCol);
  g.restore();
  return{bit:{x:x+104*s*f,y:y-104*s},collar:{x:x+44*s*f,y:y-80*s}};
}

/* ---------- Raymond vivant, en vol (1916) ---------- */
function vxPigeon(g,x,y,sz,f,t,o){
  o=o||{};g.save();g.translate(x,y);g.rotate(o.rot||0);g.scale(sz*f,sz);g.lineCap='round';g.lineJoin='round';
  const ph=o.flap!=null?o.flap:t*14,up=Math.sin(ph),fold=o.fold||0;
  // l'aile du fond
  const wing=(dy,col,k)=>{const u=lerp(up,-.2,fold);g.fillStyle=col;g.beginPath();g.moveTo(5,-3);g.quadraticCurveTo(-2,-3-u*14*k,-12,-4-u*22*k);
    for(let i=0;i<5;i++){const a=i/4;g.lineTo(-12-a*9,-4-u*(22-a*4)*k+a*6);g.lineTo(-16-a*9,-1-u*(18-a*4)*k+a*7)}
    g.quadraticCurveTo(-10,4,-2,3);g.closePath();g.fill();
    if(k>.8){g.strokeStyle='#23262e';g.lineWidth=1.4;g.beginPath();g.moveTo(-5,-1-u*6);g.lineTo(-8,3-u*4);g.moveTo(-9,-2-u*9);g.lineTo(-12,2-u*7);g.stroke()}};
  wing(0,'#5d6577',.75);
  // la queue
  g.fillStyle='#7b8496';g.beginPath();g.moveTo(-10,-2);g.lineTo(-26,-5);g.lineTo(-27,2);g.lineTo(-10,3);g.closePath();g.fill();g.fillStyle='#2c303b';g.fillRect(-27,-4.6,4,6.4);
  // les pattes repliées, le tube rouge
  g.strokeStyle='#b4454c';g.lineWidth=2;g.beginPath();g.moveTo(-3,4);g.lineTo(-10,7);g.moveTo(0,4);g.lineTo(-7,8);g.stroke();
  g.save();g.translate(-6,6.5);g.rotate(-.35);g.fillStyle='#a8322d';rr(g,-3.5,-2,7,4,1.4);g.fill();g.fillStyle='#e9dfc7';g.fillRect(3,-1.4,1.6,2.8);g.restore();
  // le corps
  const bg=g.createLinearGradient(0,-8,0,6);bg.addColorStop(0,'#a2abbc');bg.addColorStop(1,'#7b8496');g.fillStyle=bg;g.beginPath();g.ellipse(0,0,14,7,-.05,0,7);g.fill();
  g.fillStyle='rgba(255,255,255,.14)';g.beginPath();g.ellipse(2,3,8,2.6,0,0,7);g.fill();
  // le cou irisé, la tête, le bec, l'œil
  const ng=g.createLinearGradient(8,-8,14,2);ng.addColorStop(0,'#7a5d9e');ng.addColorStop(.6,'#4f9a7a');ng.addColorStop(1,'#8d96a8');g.fillStyle=ng;g.beginPath();g.ellipse(11,-2.5,6,5,.4,0,7);g.fill();
  g.fillStyle='#929bad';g.beginPath();g.arc(16,-5,5,0,7);g.fill();
  g.fillStyle='#3a3836';poly(g,[20.4,-6,25,-4.6,20.4,-3.4]);g.fill();g.fillStyle='#efe9df';g.beginPath();g.ellipse(20.6,-6,1.6,1.1,0,0,7);g.fill();
  if(o.closed){g.strokeStyle='#2a2830';g.lineWidth=1;g.beginPath();g.moveTo(15.3,-5.8);g.quadraticCurveTo(17.3,-4.6,19.2,-5.8);g.stroke()}
  else{g.fillStyle='#d97a2a';g.beginPath();g.arc(17.4,-6,2.3,0,7);g.fill();g.fillStyle='#f4ecd8';g.beginPath();g.arc(17.4,-6,1.5,0,7);g.fill();g.fillStyle='#111';g.beginPath();g.arc(18.1,-6.3,.95,0,7);g.fill()}
  if(o.blood){const b=o.blood;// la balle a frôlé le crâne : une entaille du front à la nuque, et le sang qui coule
    g.strokeStyle='#6a0c10';g.lineWidth=2.2;g.beginPath();g.moveTo(20,-8.6);g.quadraticCurveTo(16.5,-11.4,12,-9.4);g.stroke();g.strokeStyle='#c42228';g.lineWidth=1;g.beginPath();g.moveTo(19.5,-8.9);g.quadraticCurveTo(16.5,-11,12.6,-9.5);g.stroke();
    g.fillStyle='#9a1418';g.globalAlpha=Math.min(1,b);g.beginPath();g.moveTo(12.6,-9.4);g.quadraticCurveTo(10.4,-5,11,-1+b*3);g.quadraticCurveTo(11.6,1+b*4,10.4,2+b*5);g.lineTo(9.2,1.6+b*5);g.quadraticCurveTo(9.8,-2,10.4,-6);g.quadraticCurveTo(11,-8.6,12.6,-9.4);g.fill();
    g.beginPath();g.moveTo(15.5,-10.6);g.quadraticCurveTo(14.8,-8,15.4,-6.4+b);g.lineTo(14.6,-6.2+b);g.quadraticCurveTo(14.2,-8.4,15.5,-10.6);g.fill();g.globalAlpha=1}
  // l'aile de devant
  wing(0,'#727b8f',1);
  if(!o.noSeam){g.strokeStyle='rgba(233,223,199,.0)'}
  g.restore();
}
/* le panier colombophile en osier (couvercle, sangle, boucle, lucarne grillagée) */
function vxBasket(g,x,y,w,h,o){o=o||{};g.save();g.translate(x,y);
  g.fillStyle='#a8844e';rr(g,-w/2,-h,w,h,h*.16);g.fill();
  g.save();rr(g,-w/2,-h,w,h,h*.16);g.clip();
  for(let r=0;r<h/4;r++){const yy=-h+r*4+2;for(let c=-1;c<w/7+1;c++){const xx=-w/2+c*7+(r%2?3.5:0);g.fillStyle=(r+c)%2?'#bf9a5e':'#94723f';rr(g,xx,yy-1.6,6,3.4,1.4);g.fill()}}
  g.fillStyle='rgba(0,0,0,.18)';g.fillRect(-w/2,-6,w,6);g.restore();
  // la lucarne : barreaux de bois
  const lw=w*(o.big?.52:.36),lh=h*(o.big?.6:.46),lx=o.win!=null?o.win:w*.12;g.fillStyle='#2a1e14';rr(g,lx-lw/2,-h*.78,lw,lh,3);g.fill();
  if(o.inside)o.inside(g,lx,-h*.78+lh*.62);
  g.strokeStyle='#6a4a28';g.lineWidth=o.big?1.4:2;const nb=o.big?3:4;for(let k=1;k<nb;k++){g.beginPath();g.moveTo(lx-lw/2+k*lw/nb,-h*.78);g.lineTo(lx-lw/2+k*lw/nb,-h*.78+lh);g.stroke()}
  g.strokeStyle='#5a3a20';g.lineWidth=2.4;rr(g,lx-lw/2,-h*.78,lw,lh,3);g.stroke();
  // le couvercle, la sangle de cuir et sa boucle
  const sx=(o.win!=null&&o.win<0)?w*.24:-w*.3;g.fillStyle='#8a6a3a';rr(g,-w/2-3,-h-7,w+6,10,5);g.fill();g.fillStyle='#4a2e18';g.fillRect(sx,-h-8,7,h+8);g.fillStyle='#c9a24a';g.fillRect(sx-1,-h*.55,9,7);g.fillStyle='#4a2e18';g.fillRect(sx+1.5,-h*.55+2,4,3);
  g.strokeStyle='#4a2e18';g.lineWidth=3;g.beginPath();g.moveTo(-w*.25,-h-6);g.quadraticCurveTo(0,-h-26,w*.25,-h-6);g.stroke();
  g.restore()}

/* ---------- l'intertitre (cinéma muet) ---------- */
function vxCard(text,a,t,sub){
  ctx.save();ctx.globalAlpha=a;ctx.fillStyle='#0b0a0c';ctx.fillRect(0,0,W,H);const fl=.92+Math.sin(t*37)*.04+Math.sin(t*13)*.03;ctx.globalAlpha=a*fl;
  ctx.strokeStyle='#d9cfb4';ctx.lineWidth=2;ctx.strokeRect(70,46,W-140,H-92);ctx.lineWidth=1;ctx.strokeRect(80,56,W-160,H-112);
  for(const[x,y,sx,sy]of[[80,56,1,1],[W-80,56,-1,1],[80,H-56,1,-1],[W-80,H-56,-1,-1]]){ctx.beginPath();ctx.moveTo(x,y+sy*30);ctx.quadraticCurveTo(x+sx*4,y+sy*4,x+sx*30,y);ctx.moveTo(x+sx*8,y+sy*18);ctx.arc(x+sx*14,y+sy*14,5,0,7);ctx.stroke()}
  ctx.fillStyle='#ece3cc';ctx.textAlign='center';
  if(sub){ctx.font='18px '+F_DISP;ctx.fillText(sub,W/2,112)}
  ctx.font='italic 25px '+F_BODY;const lines=wrap(ctx,text,660);const y0=H/2-(lines.length-1)*17+8;lines.forEach((l,k)=>ctx.fillText(l,W/2,y0+k*34));
  for(let k=0;k<2;k++)if(rnd()<.3){ctx.fillStyle='rgba(230,220,200,'+(rnd()*.1)+')';ctx.fillRect(rnd()*W,0,1+rnd(),H)}
  ctx.restore()}
/* la touche E qui flotte au-dessus de Raymond */
function vxKeyE(x,y,t){const b=Math.sin(t*5)*2;ctx.save();ctx.translate(x,y+b);ctx.fillStyle='rgba(0,0,0,.35)';rr(ctx,-11,-9,24,24,5);ctx.fill();ctx.fillStyle='#ece3cc';rr(ctx,-12,-12,24,24,5);ctx.fill();
  ctx.strokeStyle='#2a2420';ctx.lineWidth=1.2;rr(ctx,-12,-12,24,24,5);ctx.stroke();ctx.fillStyle='#2a2420';ctx.font='16px '+F_DISP;ctx.textAlign='center';ctx.fillText('E',0,6);ctx.restore()}
/* un sac de terre : toile de jute bombée, oreille nouée, couture, ombre portée */
function vxSandbag(g,x,y,w,h,k){const R=mulberry((x*7+y*13)|0),col=mix(mix('#9a8660','#7a6644',R()),'#4a3a28',k||0),dk=mix(col,'#000000',.3),lt=mix(col,'#ffffff',.18),fl=R()<.5?1:-1;
  g.save();g.translate(x+w/2,y+h/2);g.rotate((R()-.5)*.08);
  g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(1,h*.42,w*.5,h*.16,0,0,7);g.fill();
  g.fillStyle=col;g.beginPath();g.moveTo(-w*.46,-h*.1);g.quadraticCurveTo(-w*.5,-h*.5,-w*.2,-h*.5);g.quadraticCurveTo(0,-h*.62,w*.24,-h*.5);g.quadraticCurveTo(w*.5,-h*.48,w*.47,-h*.05);
  g.quadraticCurveTo(w*.52,h*.42,w*.2,h*.48);g.quadraticCurveTo(0,h*.56,-w*.24,h*.48);g.quadraticCurveTo(-w*.52,h*.42,-w*.46,-h*.1);g.closePath();g.fill();
  const gr=g.createLinearGradient(0,-h*.55,0,h*.5);gr.addColorStop(0,rgba(lt,.5));gr.addColorStop(.5,rgba(lt,0));gr.addColorStop(1,rgba(dk,.5));g.fillStyle=gr;g.fill();
  // l'oreille nouée, la couture, le grain de la toile
  g.fillStyle=dk;g.beginPath();g.moveTo(fl*w*.44,-h*.18);g.quadraticCurveTo(fl*w*.62,-h*.32,fl*w*.6,-h*.02);g.quadraticCurveTo(fl*w*.56,h*.12,fl*w*.44,h*.08);g.closePath();g.fill();
  g.strokeStyle=rgba(dk,.7);g.lineWidth=Math.max(.6,h*.06);g.beginPath();g.moveTo(fl*w*.42,-h*.2);g.lineTo(fl*w*.42,h*.14);g.stroke();
  g.strokeStyle=rgba(dk,.4);g.lineWidth=Math.max(.5,h*.04);g.setLineDash([h*.12,h*.1]);g.beginPath();g.moveTo(-w*.38,h*.12);g.quadraticCurveTo(0,h*.22,w*.34,h*.1);g.stroke();g.setLineDash([]);
  if(h>8){g.fillStyle=rgba(dk,.22);for(let i=0;i<8;i++)g.fillRect((R()-.5)*w*.8,(R()-.5)*h*.7,1,1)}
  g.restore()}
/* des barbelés : piquets en croix de Saint-André, fils tendus et ronces */
function vxWire(g,x0,x1,yAt,h,col){g.save();g.strokeStyle=col||'#2a2420';const R=mulberry(x0|0);
  for(let x=x0;x<=x1;x+=46){const y=yAt(x);g.lineWidth=2;g.beginPath();g.moveTo(x-6,y);g.lineTo(x+6,y-h);g.moveTo(x+6,y);g.lineTo(x-6,y-h);g.stroke()}
  g.lineWidth=.8;for(let r=0;r<4;r++){g.beginPath();for(let x=x0;x<=x1;x+=4){const y=yAt(x)-h*(.2+r*.22)+Math.sin(x*.5+r*2)*1.2+(((x/46)%1)-.5)*3;x===x0?g.moveTo(x,y):g.lineTo(x,y)}g.stroke()}
  g.lineWidth=.6;for(let x=x0;x<=x1;x+=9){const y=yAt(x)-h*(.2+((x/9|0)%4)*.22);g.beginPath();g.moveTo(x-2,y-2);g.lineTo(x+2,y+2);g.moveTo(x+2,y-2);g.lineTo(x-2,y+2);g.stroke()}
  for(let k=0;k<(x1-x0)/70;k++){const cx=x0+R()*(x1-x0),y=yAt(cx);g.beginPath();for(let a=0;a<14;a+=.4)g.lineTo(cx+Math.cos(a)*7+a*1.2,y-h*.3+Math.sin(a)*h*.28);g.stroke()}
  g.restore()}
