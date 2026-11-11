/* =========================================================
   LES GENS — un seul dessin pour tous les personnages modernes (même niveau de détail qu'à la fête du village) :
   visage de profil de la fête (plFace : œil qui cligne, sourcil, nez, bouche selon l'humeur), chapeaux (plHat),
   et des poses : debout, marche, bras levés, frappe, assis, à la pompe, de face, de dos, sur les toilettes.
   fkMake(graine,{...}) fabrique quelqu'un ; fkDraw(g,p,x,sol,t,pose,o) le dessine les pieds sur « sol ».
   ========================================================= */
const FK_COAT=['#3a4a6a','#8a3a3a','#4a6a4a','#c8a040','#6a4a7a','#2a2e3a','#b85a3a','#5a7a9a','#7a6a52','#2a5a5a','#a84a6a','#3a6a8a','#5a5a62','#8a6a4a'];
const FK_LEG=['#2a2c34','#3a3a4a','#4a3a2a','#2a3a5a','#5a4a3a','#1e2026','#3a4a6a'];
const FK_HAIR=['#3a2a1a','#6a4a2a','#c8a060','#8a8a8a','#e8e4dc','#1a1410','#9a5a2a'];
const FK_SKIN=['#f0d0b0','#e8c0a0','#d8a880','#c08860','#8a5a3a','#f4dcc4'];
function fkMake(seed,o){o=o||{};const R=mulberry((seed|0)*7919+13),pk=a=>a[Math.floor(R()*a.length)];
  const fem=o.fem!=null?o.fem:R()<.5,old=o.old!=null?o.old:R()<.16;
  const p={fem,old,kid:false,ph:R()*9,mood:R(),brow:(R()-.5)*1.6,must:!fem&&R()<.3,glass:old||R()<.14,
    h:o.h||(old?104+R()*8:106+R()*18),coat:o.coat||pk(FK_COAT),leg:o.leg||pk(FK_LEG),hair:o.hair||(old?pk(['#8a8a8a','#e8e4dc','#b8b4ac']):pk(FK_HAIR)),skin:o.skin||pk(FK_SKIN),
    hat:o.hat!==undefined?o.hat:(old&&R()<.6?'beret':R()<.15?pk(['casquette','bonnet']):null),vest:!!o.vest,apron:o.apron||null,tie:o.tie||(!fem&&R()<.2?pk(['#8a2a2a','#2a3a6a']):null),
    scarf:o.scarf||(R()<.18?pk(['#c83a2a','#e0b020','#3a6a8a']):null),bag:o.bag||null,surp:0};
  return p}
/* un chapeau de plus que la fête : le casque de chantier, la toque, le calot */
function fkHat(g,p,back){
  if(p.hat==='casque'){g.fillStyle='#f0c820';g.beginPath();g.arc(1,-120,12.5,Math.PI,0);g.fill();g.fillRect(-13,-121,back?26:32,3);g.fillStyle='rgba(255,255,255,.35)';g.fillRect(-3,-131,4,9);return}
  if(p.hat==='toque'){g.fillStyle='#f4f2ec';g.fillRect(-9,-136,20,14);g.beginPath();g.arc(-4,-136,7,0,7);g.arc(6,-137,7,0,7);g.fill();return}
  if(p.hat==='calot'){g.fillStyle=p.coat;poly(g,[-11,-121,13,-121,9,-128,-7,-128]);g.fill();return}
  if(p.hat)plHat(g,p,0,back)}
function fkShoes(g,a,b){g.fillStyle='#1e1c1a';g.beginPath();g.ellipse(a,-2,7,3.5,0,0,7);g.ellipse(b,-2,7,3.5,0,0,7);g.fill()}
/* le buste de profil (manteau, gilet, tablier, cravate, écharpe) */
function fkTorso(g,p){const c=p.coat;g.fillStyle=c;
  if(p.fem){poly(g,[-12,-98,12,-98,17,-42,-17,-42]);g.fill();rr(g,-12,-104,24,30,8);g.fill()}else{rr(g,-13,-104,26,58,8);g.fill()}
  g.fillStyle='rgba(255,255,255,.1)';g.fillRect(-11,-100,4,48);g.fillStyle='rgba(0,0,0,.12)';g.fillRect(-13,-58,26,3);
  if(p.vest){g.fillStyle='#e8701c';rr(g,-13,-102,26,46,6);g.fill();g.fillStyle='#e8f0d0';g.fillRect(-13,-80,26,4);g.fillRect(-13,-66,26,4)}
  if(p.apron){g.fillStyle=p.apron;rr(g,-2,-96,15,52,4);g.fill();g.strokeStyle=p.apron;g.lineWidth=1.5;g.beginPath();g.moveTo(2,-96);g.lineTo(-6,-104);g.stroke()}
  if(p.tie&&!p.vest){g.fillStyle='#f0ece4';poly(g,[6,-104,13,-104,12,-94]);g.fill();g.fillStyle=p.tie;poly(g,[10,-102,13,-98,12,-80,9,-84]);g.fill()}
  if(p.scarf){g.fillStyle=p.scarf;rr(g,-8,-108,20,7,3);g.fill();g.fillRect(-9,-104,6,14)}}
/* la tête de profil */
function fkHead(g,p,t,talk){const sk=p.skin,hr=p.hair;
  g.fillStyle=sk;g.fillRect(-1,-106,7,6);g.beginPath();g.arc(2,-114,11,0,7);g.fill();
  g.fillStyle=hr;if(p.fem){g.beginPath();g.arc(1,-117,12,Math.PI*.92,Math.PI*1.95);g.fill();g.beginPath();g.ellipse(-7,-108,6,11,0,0,7);g.fill()}
  else if(p.old&&!p.hat){g.beginPath();g.ellipse(-6,-114,5,7,0,0,7);g.fill()}
  else{g.beginPath();g.moveTo(10,-121);g.quadraticCurveTo(2,-129,-8,-121);g.quadraticCurveTo(-11,-114,-8,-108);g.lineTo(-4,-110);g.quadraticCurveTo(-3,-118,6,-120);g.closePath();g.fill()}
  plFace(g,p,t,0,talk);fkHat(g,p,false)}
/* un bras de profil, de l'épaule (6,-96) vers (x,y) ; la main au bout */
function fkArm(g,p,x,y,bend){g.strokeStyle=p.coat;g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(6,-96);if(bend)g.quadraticCurveTo(bend[0],bend[1],x,y);else g.lineTo(x,y);g.stroke();
  g.fillStyle=p.skin;g.beginPath();g.arc(x,y,3.6,0,7);g.fill()}
/* pose : 'stand','walk','talk','up','strike','sit','sitbang','fill','front','back','toilet' ; o.w = phase de marche, o.f = sens, o.hold = objet tenu */
function fkDraw(g,p,x,base,t,pose,o){o=o||{};const s=(p.h||116)/120,f=o.f||1;g.save();g.translate(x,base);g.scale(f*s,s);g.lineCap='round';
  if(pose==='front'||pose==='toilet'){fkFront(g,p,t,pose,o);g.restore();return}
  if(pose==='back'){fkBack(g,p,t,o);g.restore();return}
  const sit=pose==='sit'||pose==='sitbang'||pose==='sithand',walk=pose==='walk'?Math.sin(o.w||0):0;
  // les jambes
  g.strokeStyle=p.leg;g.lineWidth=8;
  if(sit){const hy=-30;g.beginPath();g.moveTo(-2,hy);g.lineTo(18,hy);g.lineTo(20,-4);g.moveTo(2,hy+1);g.lineTo(22,hy+1);g.lineTo(26,-4);g.stroke();fkShoes(g,24,30);g.translate(0,18)}
  else{g.beginPath();g.moveTo(-3,-48);g.lineTo(-3+walk*12,-4);g.moveTo(3,-48);g.lineTo(3-walk*12,-4);g.stroke();fkShoes(g,1+walk*12,7-walk*12)}
  if(p.old&&!sit&&pose!=='up'){g.strokeStyle='#5a3a22';g.lineWidth=3;g.beginPath();g.moveTo(16,-62);g.lineTo(22,0);g.stroke()}
  // le bras de derrière
  g.strokeStyle=shade(p.coat,-.25);g.lineWidth=7;g.beginPath();g.moveTo(-6,-96);
  if(pose==='up'){g.lineTo(-14,-124-Math.sin(t*14+p.ph)*4)}else if(sit){g.lineTo(8,-66)}else g.lineTo(-8-walk*6,-60);g.stroke();
  fkTorso(g,p);
  if(pose==='up')p.surp=1;fkHead(g,p,t,pose==='talk'||o.talk);if(pose==='up')p.surp=0;if(o.after)o.after(g);
  // le bras de devant, et ce qu'il tient
  if(o.noFront){}
  else if(pose==='up'){fkArm(g,p,14,-126+Math.sin(t*14+p.ph)*4)}
  else if(pose==='hand'||pose==='sithand'){fkArm(g,p,o.hx,o.hy,o.bend);if(o.hold)o.hold(g,o.hx,o.hy)}
  else if(pose==='strike'){fkArm(g,p,28,-76);if(o.hold)o.hold(g,28,-76)}
  else if(pose==='wind'){fkArm(g,p,8,-128);if(o.hold)o.hold(g,8,-128)}
  else if(pose==='fill'){fkArm(g,p,26,-74,[18,-92]);g.fillStyle='#1a1a1a';rr(g,22,-80,16,8,2);g.fill();g.fillRect(36,-78,10,3);g.strokeStyle='#1a1a1a';g.lineWidth=3;g.beginPath();g.moveTo(24,-74);g.quadraticCurveTo(10,-40,o.hose||-30,-60);g.stroke()}
  else if(pose==='sitbang'){const b=Math.abs(Math.sin(t*30))*12;fkArm(g,p,30,-86-b,[20,-100])}
  else if(sit&&o.table){const e=o.eat?Math.max(0,Math.sin(t*1.4+p.ph)):0;fkArm(g,p,24-e*6,-92-e*16,[18,-84]);if(o.hold)o.hold(g,24-e*6,-92-e*16)}
  else if(sit){fkArm(g,p,20,-66,[16,-80]);if(o.hold)o.hold(g,20,-66)}
  else if(pose==='talk'){const gs=Math.sin(t*2.6+p.ph);fkArm(g,p,20+gs*3,-90-Math.max(0,gs)*8,[16,-82])}
  else{fkArm(g,p,9+walk*6,-60);if(o.hold)o.hold(g,9+walk*6,-60)}
  g.restore()}
/* de dos */
function fkBack(g,p,t,o){g.strokeStyle=p.leg;g.lineWidth=8;g.beginPath();g.moveTo(-5,-48);g.lineTo(-6,-4);g.moveTo(5,-48);g.lineTo(6,-4);g.stroke();
  g.fillStyle='#1e1c1a';g.beginPath();g.ellipse(-6,-2,5,3.5,0,0,7);g.ellipse(6,-2,5,3.5,0,0,7);g.fill();
  g.fillStyle=p.coat;rr(g,-15,-104,30,60,9);g.fill();g.fillStyle='rgba(0,0,0,.12)';g.fillRect(-.6,-100,1.2,54);
  g.strokeStyle=p.coat;g.lineWidth=7;g.beginPath();g.moveTo(-12,-96);g.lineTo(-15,-62);g.moveTo(12,-96);g.lineTo(15,-62);g.stroke();
  g.fillStyle=p.skin;g.fillRect(-4,-106,8,6);g.beginPath();g.ellipse(-11,-114,2.4,3.4,0,0,7);g.ellipse(11,-114,2.4,3.4,0,0,7);g.fill();
  g.fillStyle=p.hair;g.beginPath();g.arc(0,-115,11,0,7);g.fill();if(p.fem){rr(g,-11,-116,22,18,6);g.fill()}fkHat(g,p,true)}
/* de face : debout, ou assis sur les toilettes (pantalon aux chevilles, il crie, la pudeur est floutée) */
function fkFront(g,p,t,pose,o){const sk=p.skin,toil=pose==='toilet',scream=toil&&o.scream;
  if(toil){// les cuisses vers nous, les genoux, les tibias, le pantalon tombé sur les chaussures
    g.fillStyle=sk;rr(g,-16,-44,14,16,5);g.fill();rr(g,2,-44,14,16,5);g.fill();g.strokeStyle=sk;g.lineWidth=8;g.beginPath();g.moveTo(-10,-30);g.lineTo(-11,-8);g.moveTo(10,-30);g.lineTo(11,-8);g.stroke();
    g.fillStyle=p.leg;rr(g,-20,-12,40,10,4);g.fill();g.fillStyle='rgba(0,0,0,.2)';g.fillRect(-18,-8,36,2);fkShoes(g,-11,11);
    // la pudeur : une mosaïque de gros pixels, qui scintille un peu
    const R=mulberry((t*6|0)+7);for(let i=0;i<4;i++)for(let j=0;j<3;j++){g.fillStyle=mix(sk,R()<.5?'#8a5a4a':'#f0d8c8',.25+R()*.35);g.fillRect(-12+i*6,-48+j*6,6,6)}}
  else{g.strokeStyle=p.leg;g.lineWidth=8;g.beginPath();g.moveTo(-6,-48);g.lineTo(-7,-4);g.moveTo(6,-48);g.lineTo(7,-4);g.stroke();fkShoes(g,-8,8)}
  const dy=toil?16:0;g.translate(0,dy);
  // le buste
  g.fillStyle=p.coat;rr(g,-16,-104,32,toil?52:60,9);g.fill();g.fillStyle='rgba(255,255,255,.1)';g.fillRect(-13,-100,4,44);
  if(p.tie){g.fillStyle='#f0ece4';poly(g,[-4,-104,4,-104,0,-96]);g.fill();g.fillStyle=p.tie;poly(g,[-2,-100,2,-100,3,-80,0,-76,-3,-80]);g.fill()}
  // les bras : de face ils pendent ; aux toilettes, les mains aux joues quand il crie
  g.strokeStyle=p.coat;g.lineWidth=7;g.beginPath();
  if(scream){g.moveTo(-14,-96);g.lineTo(-20,-108);g.lineTo(-12,-114);g.moveTo(14,-96);g.lineTo(20,-108);g.lineTo(12,-114);g.stroke();g.fillStyle=sk;g.beginPath();g.arc(-12,-114,4,0,7);g.arc(12,-114,4,0,7);g.fill()}
  else if(toil){g.moveTo(-14,-96);g.lineTo(-14,-62);g.moveTo(14,-96);g.lineTo(14,-62);g.stroke();g.fillStyle='#ece8dc';g.fillRect(-12,-70,24,16);g.fillStyle='rgba(40,40,40,.4)';for(let k=0;k<3;k++)g.fillRect(-9,-66+k*4,18,1.5)}
  else{g.moveTo(-14,-96);g.lineTo(-16,-60);g.moveTo(14,-96);g.lineTo(16,-60);g.stroke()}
  // la tête de face : oreilles, cheveux, yeux, sourcils, bouche
  g.fillStyle=sk;g.fillRect(-4,-106,8,6);g.beginPath();g.arc(0,-116,11,0,7);g.fill();g.beginPath();g.ellipse(-11,-115,2.4,3.4,0,0,7);g.ellipse(11,-115,2.4,3.4,0,0,7);g.fill();
  g.fillStyle=p.hair;if(p.fem){g.beginPath();g.arc(0,-119,12,Math.PI*.95,Math.PI*2.05);g.fill();g.fillRect(-12,-120,5,18);g.fillRect(7,-120,5,18)}else{g.beginPath();g.arc(0,-119,11.5,Math.PI*1.02,Math.PI*1.98);g.fill()}
  const sur=scream||p.surp>0;for(const ex of[-4.5,4.5]){g.fillStyle='#f6f2ea';g.beginPath();g.ellipse(ex,-117,2.4,sur?3.2:2,0,0,7);g.fill();g.fillStyle='#2a1a14';g.beginPath();g.arc(ex,-117,1.2,0,7);g.fill()}
  g.strokeStyle=p.hair;g.lineWidth=1.3;g.beginPath();g.moveTo(-7,-121-(sur?3:0));g.lineTo(-2.5,-122-(sur?3:0));g.moveTo(2.5,-122-(sur?3:0));g.lineTo(7,-121-(sur?3:0));g.stroke();
  g.fillStyle=shade(sk,-.15);g.fillRect(-1,-116,2,5);
  if(scream){g.fillStyle='#4a1a1a';g.beginPath();g.ellipse(0,-108,3.4,4.4+Math.sin(t*30),0,0,7);g.fill()}
  else{g.strokeStyle='#6a3028';g.lineWidth=1;g.beginPath();g.moveTo(-2.5,-108);g.quadraticCurveTo(0,p.mood>.5?-106:-108,2.5,-108);g.stroke()}
  if(p.must){g.fillStyle=p.hair;g.beginPath();g.ellipse(0,-110,4,1.5,0,0,7);g.fill()}
  if(p.glass){g.strokeStyle='#3a3a3a';g.lineWidth=.8;g.beginPath();g.arc(-4.5,-117,3.2,0,7);g.moveTo(-1.3,-117);g.lineTo(1.3,-117);g.arc(4.5,-117,3.2,Math.PI,Math.PI*3);g.stroke()}
  fkHat(g,p,true)}
