/* =========================================================
   2-4 · L'ABRI DU MORT-HOMME — l'abri allemand, devenu (sans que Raymond le sache) un musée franco-allemand
   ---------------------------------------------------------
   Option de niveau musee {cupboards:[col…], automata:[{c,side:'fr'|'de',task,grp,trench,fiente}]}
   · placards : E pour s'y cacher (le gardien passe sans rien voir), on en ressort en bougeant
   · automates : soldats de cire qui rejouent leurs gestes ; Raymond les prend pour de vrais soldats
   · fiente : au-dessus de l'officier allemand, la seule vraie fiente du jeu (cachette)
   ========================================================= */
THEMES.abri=Object.assign({},BASE_IN,{far:'bunker',wall:'#3a3e38',wall2:'#40443e',motif:'#4a4e46',wains:'#2a2c28',floor:'#5c5a52',floorTop:'#8a877b',type:'stone',fog:'#1a1d1a',dark:.5,
  x:'crate',d:'drape',shelf:'plank',spike:'wire',walker:'rat',flyer:'moth',props:['stanchions','crate','helmet','chair']});

function museePost(Lv){
  const D=Lv.def.musee;if(!D)return;
  const floorAt=c=>{for(let r=3;r<Lv.g.length;r++){const ch=Lv.g[r][Math.floor(c)];if(ch==='#'||ch==='X')return r*T}return Lv.g.length*T};
  const M={autos:[],cups:[],said:{},seq:null,drop:null,splat:false};Lv.musee=M;
  for(const c of D.cupboards){const zt=zoneOfL(Lv,c)==='trench',b=floorAt(c),cup={x:c*T+T/2,b,style:zt?'niche':(c%2?'armoire':'spind'),open:0,anim:0};
    M.cups.push(cup);Lv.acts.push({kind:'hide',x:cup.x,y:b,open:0,t:0,used:false,cup});Lv.avoid.push(cup.x)}
  for(const o of D.automata){const a=Object.assign({x:o.c*T+T/2,b:floorAt(o.c),f:o.side==='fr'||o.task==='map'?1:-1,ph:o.c*.37},o);M.autos.push(a);Lv.avoid.push(a.x-40,a.x,a.x+40);
    if(a.task==='letter')Lv.lights.push({x:a.x+24,y:a.b-40,r:120,i:.7,warm:2});
    if(a.task==='cook')Lv.lights.push({x:a.x+26,y:a.b-12,r:150,i:.7,warm:2});
    if(a.task==='map'||a.task==='phone')Lv.lights.push({x:a.x,y:a.b-70,r:150,i:.6,warm:1});
    if(a.search){a.sact={kind:'secret',style:'autom',x:a.x-26,y:a.b,open:0,t:0,used:false,q:["Je fouille sa musette. Il ne bronche pas : il écrit. De la paille… et la photo d'une fiancée. Pardon, camarade, je ne prends que la paille."]};Lv.acts.push(a.sact)}
    if(a.fiente){a.act={kind:'secret',style:'fiente',x:a.x,y:a.b,open:0,t:0,used:false,q:["Je mériterais une promotion ! Mais ? J'ai enfin réussi à le faire !!!"]};a.act.when=()=>false;Lv.acts.push(a.act);M.fa=a}}
}
/* Raymond dans un placard */
function museeHide(a){
  const c=a.cup;c.anim=.5;
  if(P.hideIn===a){P.hideIn=null;if(!G.sim)tone(300,.08,'triangle',.05,220);return}
  P.hideIn=a;P.x=c.x-P.w/2;P.vx=P.vy=0;if(!G.sim){tone(220,.08,'triangle',.05,300);if(!L.musee.said.hide){L.musee.said.hide=1;say("Au placard. Le règlement appelle ça « se mettre à couvert ». Moi, j'appelle ça se cacher.",3.4)}}
}
const MUSEE_SEQ={
  1:[[0,'say',"Les gars ! Filez d'ici, il y a des Allemands dans l'abri, je les ai vus !",3],[2.7,'coo',"Rrrou ! Rou-rou-rou !"],[4.3,'say',"Ils ne comprennent pas le pigeon. On ne l'apprend jamais, à l'armée.",3.2]],
  2:[[0,'say',"Des Allemands ! Ils ne bougent presque pas. Et ils ont la peau en cire… La faim, sûrement.",3.4]],
  3:[[0,'say',"Repliez-vous ! L'ennemi est juste en face, dans l'autre tranchée !",3],[2.7,'coo',"ROU ! Rrrou-rou !"],[4.3,'say',"Rien. Ils ne bougent pas d'une plume. Des braves… ou des sourds.",3.2]],
  4:[[0,'say',"Celui-là écrit une lettre, à la bougie. Je connais ça : j'en porte une.",3.4]]};
function museeStep(dt){
  const M=L.musee;if(!M)return;const pcx=P.x+P.w/2,pfy=P.y+P.h;
  for(const c of M.cups){c.anim=Math.max(0,c.anim-dt);c.open=c.anim>0?Math.sin((1-c.anim/.5)*Math.PI):0}
  if(P.hideIn){P.vx=P.vy=0;P.x=P.hideIn.cup.x-P.w/2;if(pressed.has('left')||pressed.has('right')||pressed.has('jump'))museeHide(P.hideIn)}
  // les scènes : Raymond parle aux automates comme à de vrais soldats
  if(!G.sim&&!P.dead)for(const a of M.autos){if(!a.grp||M.said['g'+a.grp])continue;if(Math.abs(pcx-a.x)<170&&Math.abs(pfy-a.b)<90){M.said['g'+a.grp]=1;M.seq={t:0,i:0,list:MUSEE_SEQ[a.grp]}}}
  if(M.seq){const s=M.seq;s.t+=dt;while(s.i<s.list.length&&s.t>=s.list[s.i][0]){const e=s.list[s.i++];if(e[1]==='say')say(e[2],e[3]);else{bubble(P.x+P.w/2,P.y-14,e[2],'#a8322d');SFX.coo()}}if(s.i>=s.list.length)M.seq=null}
  // au-dessus de l'officier
  const fa=M.fa;if(fa&&!fa.act.used&&!M.said.fa&&!G.sim&&P.onGround&&Math.abs(pcx-fa.x)<34&&pfy<fa.b-110){M.said.fa=1;say("Il mériterait que je lui chie dessus.",3)}
  if(M.drop){const d=M.drop;d.vy+=GRAV*dt;d.y+=d.vy*dt;if(d.y>=fa.b-84){M.drop=null;M.splat=true;if(!G.sim){noise(.08,900,.12,'lowpass');puff(fa.x,fa.b-84,8,true)}grantSecret(fa.act,fa.b-96)}}
}
/* la bille devient, une fois dans le jeu, une vraie fiente : sur le casque de l'officier */
function museeFiente(){
  const M=L.musee,fa=M&&M.fa;if(!fa||fa.act.used||M.drop||!P.onGround)return false;const pcx=P.x+P.w/2;
  if(Math.abs(pcx-fa.x)>30||P.y+P.h>fa.b-110)return false;
  M.drop={x:pcx-P.facing*4,y:P.y+P.h-4,vy:60};P.sx=1.12;P.sy=.9;if(!G.sim)noise(.08,1200,.08,'bandpass');return true;
}

/* =========================================================
   DESSINS
   ========================================================= */
function drawMuseeMid(t){
  const M=L.musee;if(!M)return;const g=ctx,vis=x=>x>cam.x-120&&x<cam.x+W+120;
  for(const c of M.cups)if(vis(c.x))drawCupboard(g,c,t);
  for(const a of M.autos)if(vis(a.x))drawAutomate(g,a,t);
}
function drawMuseeFront(t){
  const M=L.musee;if(!M)return;
  if(M.drop){ctx.fillStyle='#f2f0e6';ctx.beginPath();ctx.ellipse(M.drop.x,M.drop.y,3,4.5,0,0,7);ctx.fill();ctx.fillStyle='#6a6458';ctx.beginPath();ctx.arc(M.drop.x+1,M.drop.y+1,1.3,0,7);ctx.fill()}
}
function drawCupboard(g,c,t){
  const x=c.x,b=c.b,w=58,h=86,o=c.open,hid=P.hideIn&&P.hideIn.cup===c;g.save();
  g.fillStyle='rgba(0,0,0,.3)';g.fillRect(x-w/2+6,b-h+6,w,h-6);
  if(c.style==='niche'){// une niche dans la paroi de la tranchée, fermée par une porte de planches
    g.fillStyle='#4a3622';rr(g,x-w/2-6,b-h-8,w+12,h+8,6);g.fill();g.fillStyle='#120c08';g.fillRect(x-w/2,b-h,w,h);
    const dw=w*(1-o*.85);g.fillStyle='#6a5034';g.fillRect(x-w/2,b-h,dw,h);g.fillStyle='rgba(0,0,0,.3)';for(let k=1;k<4;k++)g.fillRect(x-w/2+k*dw/4,b-h,1.5,h);
    g.fillStyle='#3a2a1a';g.fillRect(x-w/2,b-h+14,dw,5);g.fillRect(x-w/2,b-20,dw,5);g.fillStyle='rgba(0,0,0,.6)';g.fillRect(x-w/2+8,b-h+30,Math.max(0,dw-16),4)}
  else{const m=c.style==='spind',col=m?'#5a6252':'#6a4a2c',dk=m?'#3e4438':'#4a3220';
    g.fillStyle=col;rr(g,x-w/2,b-h,w,h,3);g.fill();g.fillStyle=dk;g.fillRect(x-w/2-3,b-h-5,w+6,7);g.fillRect(x-w/2+3,b-6,6,6);g.fillRect(x+w/2-9,b-6,6,6);
    g.fillStyle='#120c08';g.fillRect(x-w/2+4,b-h+6,w-8,h-14);
    const dw=(w-8)*(1-o*.85);g.fillStyle=shade(col,.06);g.fillRect(x-w/2+4,b-h+6,dw,h-14);
    if(m){g.fillStyle='rgba(0,0,0,.45)';for(let k=0;k<4;k++)g.fillRect(x-w/2+12,b-h+14+k*5,Math.max(0,dw-16),2)}
    else{g.strokeStyle='rgba(0,0,0,.3)';g.lineWidth=1.2;g.strokeRect(x-w/2+9,b-h+12,Math.max(0,dw-10),h-28);g.fillStyle='rgba(240,230,210,.45)';g.font='bold 6px '+F_DISP;g.textAlign='center';if(dw>30)g.fillText('HABILLEMENT',x-w/2+4+dw/2,b-h+30)}
    g.fillStyle='#c9a24a';if(dw>20){g.beginPath();g.arc(x-w/2+dw,b-h/2,2,0,7);g.fill()}}
  // caché dedans : deux yeux qui brillent par la fente
  if(hid&&o<.2&&Math.sin(t*1.3)>-.85){g.fillStyle='#e8a13a';g.beginPath();g.arc(x-5,b-h+18+(c.style==='niche'?14:0),1.8,0,7);g.arc(x+5,b-h+18+(c.style==='niche'?14:0),1.8,0,7);g.fill()}
  g.restore();
}
/* ---------- les automates : soldats de cire, clé de remontage dans le dos ---------- */
const AUTO_COL={fr:{coat:'#7d93b2',coat2:'#5f7593',helm:'#6f7f8f',leg:'#6a7f9e'},de:{coat:'#7a7c66',coat2:'#5c5e4a',helm:'#5a5e4e',leg:'#5c5e4a'}};
function autoHead(g,side,x,y,tilt){
  g.save();g.translate(x,y);g.rotate(tilt||0);
  g.fillStyle='#8a8a86';g.fillRect(-3,4,6,4);   // le cou : une rotule de métal
  g.fillStyle='#e2c4a6';g.beginPath();g.ellipse(0,0,7,8,0,0,7);g.fill();g.fillStyle='rgba(200,90,80,.35)';g.beginPath();g.arc(3,2,2.2,0,7);g.fill();
  g.fillStyle='#2a2018';g.fillRect(2,-2,2,2);g.fillStyle='#4a3424';g.fillRect(1,3,6,1.6);
  if(side==='fr'){g.fillStyle=AUTO_COL.fr.helm;g.beginPath();g.ellipse(0,-5,10,3,0,0,7);g.fill();g.beginPath();g.arc(0,-5,7.5,Math.PI,0);g.fill();g.fillStyle='#5a6a7a';g.beginPath();g.moveTo(-3,-12);g.quadraticCurveTo(0,-16,3,-12);g.fill();g.fillStyle='#c9a24a';g.beginPath();g.arc(0,-9,1.5,0,7);g.fill()}
  else{g.fillStyle=AUTO_COL.de.helm;g.beginPath();g.moveTo(-9,-1);g.quadraticCurveTo(-10,-14,0,-14);g.quadraticCurveTo(10,-14,9,-1);g.lineTo(11,3);g.lineTo(-11,3);g.closePath();g.fill();g.fillStyle='#4a4e40';g.beginPath();g.arc(-6,-5,1.6,0,7);g.arc(6,-5,1.6,0,7);g.fill()}
  g.restore();
}
function autoArm(g,sx,sy,a1,a2,col){
  const ex=sx+Math.sin(a1)*13,ey=sy+Math.cos(a1)*13,hx=ex+Math.sin(a2)*12,hy=ey+Math.cos(a2)*12;
  g.strokeStyle=col;g.lineWidth=5.5;g.lineCap='round';g.beginPath();g.moveTo(sx,sy);g.lineTo(ex,ey);g.lineTo(hx,hy);g.stroke();
  g.fillStyle='#9a9a94';g.beginPath();g.arc(ex,ey,1.8,0,7);g.fill();g.fillStyle='#e2c4a6';g.beginPath();g.arc(hx,hy,3,0,7);g.fill();return{x:hx,y:hy};
}
function autoStand(g,side,o){
  const C=AUTO_COL[side];
  g.fillStyle='#1e1a16';rr(g,-8,-5,7,5,2);g.fill();rr(g,1,-5,7,5,2);g.fill();
  g.fillStyle=C.leg;g.fillRect(-7,-30,6,26);g.fillRect(1,-30,6,26);g.fillStyle='rgba(0,0,0,.18)';for(let k=0;k<4;k++){g.fillRect(-7,-24+k*5,6,1.2);g.fillRect(1,-24+k*5,6,1.2)}
  g.fillStyle=C.coat;g.beginPath();g.moveTo(-11,-62);g.lineTo(11,-62);g.lineTo(side==='fr'?13:11,side==='fr'?-24:-30);g.lineTo(side==='fr'?-13:-11,side==='fr'?-24:-30);g.closePath();g.fill();
  g.fillStyle=C.coat2;g.fillRect(-11,-46,22,3);g.fillStyle='#c9a24a';for(const yy of[-58,-52,-46])g.fillRect(-1,yy,2,2);
  g.fillStyle='#c9a24a';g.fillRect(-15,-54,5,3);g.fillRect(-17,-56,2,7);   // la clé de remontage
}
function drawAutomate(g,a,t){
  const C=AUTO_COL[a.side],ph=t*1.6+a.ph,x=a.x,b=a.b;g.save();g.translate(x,b);
  if(!a.trench){// socle de musée et étiquette bilingue
    g.fillStyle='#3a2a1c';g.fillRect(-34,-6,68,6);g.fillStyle='#5a4430';g.fillRect(-34,-8,68,3);
    g.fillStyle='#e9e1cc';g.fillRect(-18,-4,36,8);g.fillStyle='#2a2420';g.textAlign='center';{const lb=a.side==='fr'?'SOLDAT FRANÇAIS':'SOLDAT ALLEMAND';let fs=5;g.font=fs+'px '+F_DISP;while(fs>3&&g.measureText(lb).width>32){fs-=.25;g.font=fs+'px '+F_DISP}g.fillText(lb,0,1.6)}g.translate(0,-8)}
  const f=a.f;g.scale(f,1);
  if(a.task==='wounded'){// le blessé sur son brancard : il lève parfois la main
    g.fillStyle='#6a5034';g.fillRect(-36,-14,72,4);g.fillRect(-40,-15,6,3);g.fillRect(34,-15,6,3);g.fillStyle='#c8bfa4';g.fillRect(-30,-18,60,5);
    g.fillStyle=C.coat;rr(g,-24,-28,38,11,5);g.fill();g.fillStyle=C.leg;g.fillRect(12,-25,18,7);
    g.save();g.translate(-28,-24);g.fillStyle='#e2c4a6';g.beginPath();g.ellipse(0,0,7,6,0,0,7);g.fill();g.fillStyle='#f4f0e6';g.fillRect(-7,-5,14,4);g.fillStyle='#b8302a';g.fillRect(-2,-5,4,4);g.restore();
    autoArm(g,-6,-26,Math.PI+.4+Math.max(0,Math.sin(ph*.5))*1.4,Math.PI+.2,C.coat2);g.restore();return}
  if(a.task==='bandage'){// agenouillé, il bande la tête du blessé
    g.fillStyle=C.leg;g.fillRect(-10,-14,18,8);g.fillRect(-12,-8,8,8);g.fillStyle='#1e1a16';g.fillRect(-14,-4,8,4);
    g.fillStyle=C.coat;g.beginPath();g.moveTo(-10,-44);g.lineTo(8,-44);g.lineTo(10,-12);g.lineTo(-12,-12);g.closePath();g.fill();
    g.fillStyle='#f4f0e6';g.fillRect(-10,-40,18,5);g.fillStyle='#b8302a';g.fillRect(-3,-40,5,5);   // brassard
    g.fillStyle='#c9a24a';g.fillRect(-15,-36,5,3);
    const s=Math.sin(ph*2);autoArm(g,6,-40,1.6+s*.25,2.3,C.coat2);autoArm(g,-4,-40,1.3-s*.25,2.4,C.coat);autoHead(g,'fr',2,-52,.25);
    g.fillStyle='#f4f0e6';g.fillRect(24,-30+s*2,8,3);g.restore();return}
  if(a.task==='phone'||a.task==='letter'){// assis sur une caisse
    g.fillStyle='#6a4a2c';g.fillRect(-14,-20,20,20);g.fillStyle='rgba(0,0,0,.2)';g.fillRect(-14,-11,20,2);
    g.fillStyle=C.leg;g.fillRect(-4,-26,18,7);g.fillRect(9,-26,6,26);g.fillStyle='#1e1a16';rr(g,8,-5,10,5,2);g.fill();
    g.fillStyle=C.coat;g.beginPath();g.moveTo(-8,-56);g.lineTo(10,-56);g.lineTo(12,-22);g.lineTo(-10,-22);g.closePath();g.fill();g.fillStyle='#c9a24a';g.fillRect(-13,-48,5,3);
    if(a.task==='phone'){// le central : casque d'écoute, manivelle
      g.fillStyle='#4a4234';g.fillRect(20,-34,26,22);g.fillStyle='#2a2620';g.fillRect(22,-30,22,4);g.fillStyle='#c9a24a';g.beginPath();g.arc(33,-20,3,0,7);g.fill();
      const cr=ph*3;g.strokeStyle='#2a2620';g.lineWidth=2;g.beginPath();g.moveTo(46,-22);g.lineTo(46+Math.cos(cr)*7,-22+Math.sin(cr)*7);g.stroke();
      autoArm(g,8,-52,2.2,2.6+Math.sin(ph*3)*.2,C.coat2);autoArm(g,-4,-52,Math.PI-.7,Math.PI+.9,C.coat);
      autoHead(g,'de',2,-64,Math.sin(ph*.8)*.12);g.strokeStyle='#2a2620';g.lineWidth=1.5;g.beginPath();g.arc(2,-64,9,Math.PI*1.1,Math.PI*1.9);g.stroke();g.fillStyle='#2a2620';g.fillRect(-9,-66,4,6);
      g.strokeStyle='#3a342a';g.lineWidth=1;g.beginPath();g.moveTo(-7,-60);g.quadraticCurveTo(10,-30,22,-28);g.stroke()}
    else{// la lettre, à la bougie
      g.fillStyle='#7a5a36';g.fillRect(18,-30,30,30);g.fillStyle='#ece3cc';g.save();g.translate(30,-31);g.rotate(-.08);g.fillRect(-8,-1,16,2);g.restore();
      g.fillStyle='#e8dcc0';g.fillRect(40,-42,4,11);const fl=.8+Math.sin(t*11+a.ph)*.12;g.fillStyle='rgba(255,200,110,'+fl+')';g.beginPath();g.ellipse(42,-45,2.4,4,0,0,7);g.fill();
      const s=Math.sin(ph*4);autoArm(g,8,-52,2.1,2.9+s*.25,C.coat2);autoArm(g,-4,-52,2.4,2.8,C.coat);autoHead(g,'fr',4,-64,.35+Math.sin(ph*.6)*.05);
      // sa musette, posée contre la caisse (on peut la fouiller)
      const op=a.sact?(a.sact.used?1:a.sact.open||0):0;g.save();g.translate(-26,-2);g.fillStyle='#6a6a4a';rr(g,-9,-16,18,16,4);g.fill();g.strokeStyle='#4a4a32';g.lineWidth=1.5;g.beginPath();g.moveTo(-7,-15);g.quadraticCurveTo(-14,-34,-2,-36);g.stroke();
      g.fillStyle='#5a5a3c';g.save();g.translate(-9,-16);g.rotate(-op*1.1);rr(g,0,0,18,8,3);g.fill();g.restore();if(op>0){g.fillStyle='#d8b850';for(let k=-2;k<=2;k++)g.fillRect(k*3-1,-19-Math.abs(k),1.4,5)}g.restore()}
    g.restore();return}
  autoStand(g,a.side,{});
  if(a.task==='map'){// l'officier à la table des cartes, il pointe
    g.restore();g.save();g.translate(x,b-8);
    g.fillStyle='#5a4028';g.fillRect(16,-40,60,5);g.fillRect(20,-35,4,35);g.fillRect(68,-35,4,35);g.fillStyle='#d8cca8';g.fillRect(20,-43,52,4);g.strokeStyle='rgba(120,60,40,.5)';g.lineWidth=1;g.beginPath();g.moveTo(26,-41);g.lineTo(44,-42);g.lineTo(60,-40);g.stroke();
    g.fillStyle='#3a3a30';g.fillRect(64,-60,3,18);g.fillStyle='rgba(255,210,130,.8)';g.beginPath();g.arc(65,-62,4,0,7);g.fill();
    const s=Math.sin(ph*.9);autoArm(g,9,-58,1.3+s*.3,1.5+s*.2,C.coat2);autoArm(g,-9,-58,-.2,.1,C.coat);autoHead(g,'de',0,-70,.12+s*.05);
    g.fillStyle='#2a2a26';g.fillRect(-8,-79,16,2);   // la visière de la casquette sous le casque…
    if(L.musee.splat){g.fillStyle='#f4f2ea';g.beginPath();g.ellipse(0,-82,6,2.6,0,0,7);g.fill();g.beginPath();g.ellipse(-3,-79,1.6,3.2,0,0,7);g.ellipse(4,-80,1.4,2.4,0,0,7);g.fill();g.fillStyle='#8a8a7a';g.beginPath();g.arc(1,-83,1.5,0,7);g.fill()}
    g.restore();return}
  if(a.task==='periscope'){// la sentinelle au périscope : il tourne lentement
    const s=Math.sin(ph*.5);g.fillStyle='#4a4e46';g.fillRect(14,-130,7,90);g.fillRect(14,-130,16,7);g.fillStyle='#6a7e8e';g.fillRect(27,-129,2,5);
    autoArm(g,9,-58,1.9,3.1,C.coat2);autoArm(g,-9,-58,1.7,2.9,C.coat);autoHead(g,'fr',6,-70,.1+s*.04)}
  else if(a.task==='sentry'){// la sentinelle, fusil à l'épaule, qui dodeline
    const s=Math.sin(ph*.7)*.06;g.rotate(s);g.strokeStyle='#4a3424';g.lineWidth=3;g.beginPath();g.moveTo(-12,-24);g.lineTo(-12,-92);g.stroke();g.strokeStyle='#3a3a3a';g.lineWidth=2;g.beginPath();g.moveTo(-12,-92);g.lineTo(-12,-104);g.stroke();
    autoArm(g,-9,-58,.3,-.2,C.coat);autoArm(g,9,-58,-.4,-.9,C.coat2);autoHead(g,'de',0,-70,Math.sin(ph*.4)*.15)}
  else if(a.task==='cook'){// la soupe, sur un brasero
    g.fillStyle='#2a2420';g.fillRect(16,-16,26,16);for(let k=0;k<3;k++){g.fillStyle='rgba(255,'+(120+k*30)+',50,.8)';g.beginPath();g.arc(22+k*7,-16,3+Math.sin(t*9+k)*1.2,0,7);g.fill()}
    g.fillStyle='#5a5a52';rr(g,14,-34,30,18,4);g.fill();g.fillStyle='#8a7a5a';g.fillRect(16,-34,26,3);
    for(let k=0;k<3;k++){const p2=(t*.5+k/3)%1;g.fillStyle='rgba(230,230,225,'+(.35*(1-p2))+')';g.beginPath();g.arc(28+Math.sin(p2*6+k)*4,-40-p2*40,3+p2*6,0,7);g.fill()}
    const r=ph*2.2,hx=29+Math.cos(r)*7;g.strokeStyle='#6a4a2c';g.lineWidth=2;g.beginPath();g.moveTo(hx,-30);g.lineTo(hx-4,-56);g.stroke();
    autoArm(g,9,-58,1.0+Math.cos(r)*.2,.9,C.coat2);autoArm(g,-9,-58,.5,.2,C.coat);autoHead(g,'de',2,-70,.2)}
  g.restore();
}
/* ---------- chariot suspendu (au-dessus de la fosse) ---------- */
function drawTrolley(g,m,t){
  const x=m.x,y=m.y,w=m.w;g.save();
  const ry=8*T+T+6;   // le rail, juste sous les barbelés de la dalle
  g.strokeStyle='#2a2a2a';g.lineWidth=3;g.beginPath();g.moveTo(m.a0-30,ry);g.lineTo(m.a1+w+30,ry);g.stroke();
  for(const sx of[x+10,x+w-10]){g.strokeStyle='#4a4a46';g.lineWidth=2;g.beginPath();g.moveTo(sx,ry);g.lineTo(sx,y);g.stroke();g.fillStyle='#3a3a36';g.beginPath();g.arc(sx,ry,5,0,7);g.fill()}
  g.fillStyle='#6a5a3a';g.fillRect(x,y,w,12);g.fillStyle='#4a3e28';g.fillRect(x,y+10,w,4);g.fillStyle='rgba(255,230,190,.25)';g.fillRect(x,y,w,1.5);
  g.fillStyle='#5a6252';rr(g,x+8,y-22,w-16,22,3);g.fill();g.fillStyle='rgba(240,230,210,.6)';g.font='bold 6px '+F_DISP;g.textAlign='center';g.fillText('MUNITION',x+w/2,y-9);
  g.restore();
}
/* ---------- plans de fond : béton coffré, salles d'exposition, panorama peint ---------- */
function bunkerFar(L,g,wpx,R){
  const th=L.th;g.fillStyle=th.wall;g.fillRect(0,0,wpx,600);
  const colOf=F=>Math.floor(((F-W/2)/PF_FAR+W/2)/T),zoneAt=F=>zoneOfL(L,colOf(F));
  for(let y=40;y<600;y+=22){g.fillStyle=(y/22)%2?'rgba(255,255,255,.025)':'rgba(0,0,0,.05)';g.fillRect(0,y,wpx,22);g.fillStyle='rgba(0,0,0,.12)';g.fillRect(0,y,wpx,1)}
  g.fillStyle='rgba(0,0,0,.35)';for(let x=20;x<wpx;x+=60)for(let y=60;y<420;y+=66){g.beginPath();g.arc(x+((y/66|0)%2)*30,y,2,0,7);g.fill()}
  // voûtes et câbles
  g.fillStyle=shade(th.wall,-.35);g.fillRect(0,0,wpx,40);for(let x=0;x<wpx;x+=260){g.beginPath();g.moveTo(x,40);g.quadraticCurveTo(x+130,-20,x+260,40);g.lineTo(x+260,60);g.quadraticCurveTo(x+130,0,x,60);g.closePath();g.fill()}
  g.strokeStyle='#22241f';g.lineWidth=4;g.beginPath();g.moveTo(0,70);g.lineTo(wpx,70);g.stroke();g.lineWidth=2;g.beginPath();g.moveTo(0,78);g.lineTo(wpx,78);g.stroke();
  let x=60;
  while(x<wpx-200){const z=zoneAt(x);
    if(z==='trench'){// le grand panorama peint : le no man's land au crépuscule
      const w0=Math.min(wpx-x-40,900),y0=100,h0=320;
      gilt(g,x,y0,w0,h0);
      const sk=g.createLinearGradient(0,y0,0,y0+h0);sk.addColorStop(0,'#3a3a52');sk.addColorStop(.55,'#9a6a5a');sk.addColorStop(1,'#5a4a3a');g.fillStyle=sk;g.fillRect(x,y0,w0,h0);
      g.fillStyle='#4a3e30';g.beginPath();g.moveTo(x,y0+h0);for(let k=0;k<=w0;k+=20)g.lineTo(x+k,y0+200+Math.sin(k*.02)*10+((k*7)%13));g.lineTo(x+w0,y0+h0);g.closePath();g.fill();
      for(let k=40;k<w0-20;k+=70+R()*60)deadTree(g,x+k,y0+210+R()*10,40+R()*60,'#2a241c');
      g.fillStyle='#3a3026';for(let k=30;k<w0;k+=90+R()*40){g.beginPath();g.ellipse(x+k,y0+260+R()*30,24+R()*20,6,0,0,7);g.fill()}
      g.strokeStyle='rgba(30,26,20,.8)';g.lineWidth=1.2;for(let k=10;k<w0;k+=34){g.beginPath();g.moveTo(x+k,y0+300);g.lineTo(x+k,y0+276);g.stroke()}
      g.fillStyle='rgba(220,200,180,.15)';for(let k=0;k<5;k++){g.beginPath();g.arc(x+R()*w0,y0+150+R()*60,30+R()*30,0,7);g.fill()}
      g.fillStyle='rgba(255,230,180,.08)';for(let k=0;k<w0;k+=220){g.beginPath();g.moveTo(x+k+40,40);g.lineTo(x+k+140,y0+h0);g.lineTo(x+k-60,y0+h0);g.closePath();g.fill()}
      x+=w0+120;continue}
    const k=R();
    if(k<.3){// photographies d'époque
      for(let i=0;i<3;i++){const fx=x+i*70,fy=150+(i%2)*30;g.fillStyle='#1e1c18';g.fillRect(fx-3,fy-3,56,46);g.fillStyle=mix('#b8a07a','#6a5a48',R()*.6);g.fillRect(fx,fy,50,40);g.fillStyle='rgba(40,30,20,.5)';for(let j=0;j<3;j++)g.fillRect(fx+6+j*14,fy+16+R()*8,8,18)}x+=260}
    else if(k<.55){// carte du front, bilingue
      g.fillStyle='#d8cca8';g.fillRect(x,130,180,120);g.strokeStyle='rgba(120,60,40,.6)';g.lineWidth=2;g.beginPath();g.moveTo(x+10,200);g.quadraticCurveTo(x+90,150,x+170,210);g.stroke();g.strokeStyle='rgba(40,60,120,.6)';g.beginPath();g.moveTo(x+10,215);g.quadraticCurveTo(x+90,170,x+170,225);g.stroke();
      g.fillStyle='#2a2420';g.font='8px '+F_DISP;g.textAlign='center';g.fillText('FRONT DE VERDUN · RIVE GAUCHE · 1916',x+90,144);x+=280}
    else if(k<.8){// bannières
      for(let i=0;i<2;i++){const bx=x+i*60;g.fillStyle=i?'#2f4a6a':'#5a2a26';g.fillRect(bx,90,40,180);poly(g,[bx,270,bx+20,256,bx+40,270]);g.fill();g.fillStyle='#e9e1cc';g.font='bold 11px '+F_DISP;g.textAlign='center';g.fillText('1916',bx+20,130);g.font='7px '+F_DISP;g.fillText(i?'VERDUN':'MORT-H.',bx+20,150)}x+=220}
    else{// panneau de texte et vitrine
      g.fillStyle='#e9e1cc';g.fillRect(x,140,110,150);g.fillStyle='rgba(40,36,30,.5)';for(let j=0;j<12;j++)g.fillRect(x+10,156+j*10,80+R()*14,2);g.fillStyle='#5a2a26';g.fillRect(x,140,110,8);x+=200}
  }
  g.fillStyle=th.wains;g.fillRect(0,440,wpx,160);g.fillStyle=shade(th.wains,.2);g.fillRect(0,438,wpx,4);
  g.fillStyle=rgba(th.fog,.4);g.fillRect(0,0,wpx,600);
  const vg=g.createLinearGradient(0,0,0,600);vg.addColorStop(0,'rgba(0,0,0,.45)');vg.addColorStop(.45,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.3)');g.fillStyle=vg;g.fillRect(0,0,wpx,600);
}
function bunkerMid(L,g,wpx,R){
  const base=shade(L.th.fog,.12),toWorld=mx=>(mx-W*.35)/PF_MID+W*.35;
  let x=40;while(x<wpx){const z=zoneOfL(L,Math.floor(toWorld(x)/T));g.fillStyle=base;
    if(z==='trench'){// sacs de terre et piquets de la reconstitution
      for(let k=0;k<6;k++)rr(g,x+k*22,500-((k%2)*12),24,14,6),g.fill();g.fillRect(x+150,430,4,90);g.strokeStyle=base;g.lineWidth=1;g.beginPath();g.moveTo(x+150,450);g.quadraticCurveTo(x+200,462,x+250,450);g.stroke();g.fillRect(x+250,430,4,90);x+=320+R()*120}
    else{// piliers, gaines d'aération
      g.fillRect(x,60,26,470);g.fillRect(x-8,60,42,14);g.fillRect(x+120,90,180,18);g.beginPath();g.arc(x+300,99,9,0,7);g.fill();g.fillRect(x+60,0,3,140);g.beginPath();g.moveTo(x+42,150);g.lineTo(x+61,130);g.lineTo(x+80,150);g.closePath();g.fill();x+=360+R()*140}}
}
