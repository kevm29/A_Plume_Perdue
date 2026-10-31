/* =========================================================
   2-2 · LES ÉOLIENNES — la Meuse et ses péniches, meules à rats,
   tourbillon de foin entre les pales, tracteur
   ---------------------------------------------------------
   Option de niveau : meuse {river:[c0,c1], lanes:[{c,name,port,cargo,secret}], bales:[col…],
     vortex:col, tractor:col, bgTurbines:[{x,z}]}
   Perspective : ce qui est derrière le plan de jeu (profondeur z > 0, en cases) est projeté
   vers un point de fuite fixe à l'écran, en haut un peu à droite (comme l'extrusion des tuiles) :
   la Meuse, les péniches et les éoliennes du fond suivent donc la caméra en vrai relief.
   Les péniches descendent la Meuse vers nous : seule la tranche qui traverse le plan de jeu
   porte Raymond (pont, cargaison, timonerie : planches invisibles « t » posées à chaque image).
   ========================================================= */
const MZ_D=16,MZ_HZ=300,MZ_VX=.6,MZ_ZF=36;
const MV={x:0,y:0};
function mzSet(){MV.x=cam.x+W*MZ_VX;MV.y=cam.y+MZ_HZ}
function ms(z){return MZ_D/(MZ_D+z)}
function mp(x,y,z){const s=MZ_D/(MZ_D+z);return[MV.x+(x-MV.x)*s,MV.y+(y-MV.y)*s]}
function mq(g,a,b,c,d){g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.lineTo(c[0],c[1]);g.lineTo(d[0],d[1]);g.closePath()}
function mFog(z){return clamp((z-5)/(MZ_ZF-3),0,.92)}
function mCol(c,z){return mix(c,L.th.fog,mFog(z))}

/* une péniche Freycinet (stylisée) : 30 cases de long, 5 de large ; cargaison à tribord, timonerie à l'arrière */
const BARGE={v:1.8,len:30,C:38,beam:5,cab:{z0:23.5,z1:28.5,c0:2,c1:5,h:2}};
const CARGO={hay:[{z0:3,z1:9,h:2},{z0:9,z1:16,h:1},{z0:16,z1:23,h:2}],
  logs:[{z0:3,z1:13,h:1},{z0:13,z1:23,h:2}],
  beets:[{z0:3,z1:10,h:1},{z0:10,z1:17,h:2},{z0:17,z1:23,h:1}]};

function meusePost(Lv){
  const D=Lv.def.meuse;if(!D)return;
  const gTop=c=>{for(let r=0;r<Lv.g.length;r++)if(Lv.g[r][c]==='#')return r;return Lv.g.length};
  const rG=gTop(D.river[0]-1),yG=rG*T,rD=rG+1,yD=rD*T,yW=yD+24,rP=gTop(D.vortex+3),yP=rP*T;
  const M={xL:D.river[0]*T,xR:(D.river[1]+1)*T,yG,yD,yW,rD,yP,lanes:[],bales:[],shelters:[],stat:[],turbines:[],hay:[],trees:[],ducks:[],said:{}};
  Lv.meuse=M;
  /* les péniches : chaque couloir suit le précédent de 7 secondes (on passe de l'une à l'autre à mesure qu'elles arrivent) */
  D.lanes.forEach((d,i)=>{
    const ln=Object.assign({i,x0:d.c*T,x1:(d.c+BARGE.beam)*T,cx:(d.c+BARGE.beam/2)*T,v:BARGE.v,len:BARGE.len,C:BARGE.C,ph:11-i*BARGE.C/3,U:0,n:0,zl:0,in:false,ev:{n:-99,t:0}},d);
    ln.parts=CARGO[d.cargo].map(s=>Object.assign({c0:3,c1:5,kind:d.cargo},s)).concat([Object.assign({kind:'cab'},BARGE.cab)]);
    ln.partsDesc=ln.parts.slice().sort((a,b)=>b.z0-a.z0);
    M.lanes.push(ln);
    if(d.secret){
      const a={kind:'secret',style:'barge',x:(d.c+BARGE.cab.c0)*T+23,y:yD,open:0,t:0,used:false,lane:ln,
        lockQ:"Fermé. Un marinier ne laisse jamais sa porte ouverte aux pigeons. Sauf s'il a une bonne raison de sortir.",
        q:["Une cabine de marinier : un poêle, une couchette… et de la paille sur l'oreiller. Merci, camarade."]};
      a.when=()=>ln.in&&ln.zl>=BARGE.cab.z0&&ln.zl<BARGE.cab.z1;M.door=a;Lv.acts.push(a);
    }
  });
  /* meules rondes (des rats en sortent) : leur dessus porte Raymond, et elles coupent le vent */
  for(const c of D.bales||[]){const x=c*T;M.bales.push({x,armed:true,shake:0});M.stat.push({x0:x-40,x1:x+40,y:yG-80});Lv.g[rG-2][c-1]='t';Lv.g[rG-2][c]='t';Lv.avoid.push(x-60,x,x+60)}
  /* le tourbillon : une demi-ellipse aplatie, de la meule au pied de la côte jusqu'au plateau */
  const vx0=D.vortex*T+T/2,a=900,b=600;
  M.vt={x0:vx0,y0:yG-40,y1:yP-40,a,b,p:.7,base:yG};
  Lv.avoid.push(vx0-60,vx0,vx0+60);
  [vx0+a-330,vx0+a+30,vx0+a+390].forEach((x,k)=>{const p=vPathOf(M.vt,vThOf(M.vt,x));M.turbines.push({x,hy:p.y+118,R:150,w:.75,ph:[0,1.15,2.3][k]})});
  M.fl0=M.turbines[0].x-250;M.fl1=M.turbines[2].x+240;M.thF0=vThOf(M.vt,M.fl0);M.thF1=vThOf(M.vt,M.fl1);
  for(const x of[M.turbines[0].x-205,M.turbines[0].x+180,M.turbines[1].x+180,M.turbines[2].x+205]){const p=vPathOf(M.vt,vThOf(M.vt,x));Lv.corn.push({x:p.x,y:p.y,taken:false,ph:x*.01})}
  {const R=mulberry(77);for(let k=0;k<120;k++)M.hay.push({th:R()*Math.PI,sp:.16+R()*.2,off:6+R()*36,ph:R()*6.28,len:4+R()*6,rot:R()*6,vr:(R()-.5)*8,c:['#e0b04e','#c9962e','#f0d27a'][k%3]})}
  /* le tracteur, garé au bord de la côte, et sa botte */
  if(D.tractor!=null){const tx=D.tractor*T;
    M.tractor={x:tx,y:yP,bx:tx-80};
    const ad={kind:'secret',style:'tractor',x:tx+46,y:yP,open:0,t:0,used:false,q:["Sur le siège du tracteur, une botte entamée. Le conducteur fait la sieste dans le foin, je parie. Je me sers."]};
    M.tdoor=ad;Lv.acts.push(ad);
    Lv.g[rP-3][D.tractor]='t';Lv.g[rP-3][D.tractor+1]='t';Lv.g[rP-2][D.tractor-3]='t';Lv.g[rP-2][D.tractor-2]='t';
    M.stat.push({x0:tx,x1:tx+156,y:yP-120},{x0:tx-120,x1:tx-40,y:yP-80});Lv.avoid.push(tx-80,tx,tx+80,tx+160)}
  /* les troncs des arbres coupent le vent : on s'abrite juste à leur gauche */
  for(const d of Lv.decor)if(d.t==='tree')M.stat.push({x0:d.x-20,x1:d.x+20,y:-9999});
  /* éoliennes au loin, saules des berges, canards */
  M.bg=(D.bgTurbines||[]).map((o,k)=>({x:o.x,z:o.z,y:o.x>vx0?yP:yG,h:380,R:150,w:.5+(k%3)*.09,ph:k*1.7})).sort((p,q)=>q.z-p.z);
  {const R=mulberry(91);
    for(const z of[3.5,10,17,26])M.trees.push({x:M.xL-60-R()*150,z,h:170+R()*90,seed:Math.floor(R()*999)});
    for(const z of[5,12.5,21,30])M.trees.push({x:M.xR+50+R()*170,z,h:170+R()*90,seed:Math.floor(R()*999)});
    M.trees.sort((p,q)=>q.z-p.z);
    for(const x of[M.xL+150,M.xL+620,M.xL+1100,M.xL+1580])M.ducks.push({x,z0:R()*28,ph:R()*6})}
}
function vPathOf(V,th){const s=Math.max(0,Math.sin(th));return{x:V.x0+V.a*(1-Math.cos(th)),y:V.y0+(V.y1-V.y0)*th/Math.PI-V.b*Math.pow(s,V.p)}}
function vThOf(V,x){return Math.acos(clamp((V.x0+V.a-x)/V.a,-1,1))}
function bladeAng(tb){return tb.ph+G.lt*tb.w}
function bladeHit(tb,cx,cy){
  const dx=cx-tb.x,dy=cy-tb.hy;if(dx*dx+dy*dy>(tb.R+24)*(tb.R+24))return false;if(dx*dx+dy*dy<22*22)return true;
  const a0=bladeAng(tb);
  for(let k=0;k<3;k++){const a=a0+k*2.0944,ux=Math.sin(a),uy=-Math.cos(a),pr=dx*ux+dy*uy;if(pr<tb.R*.08||pr>tb.R+6)continue;
    const pe=Math.abs(dx*uy-dy*ux),hw=pr<tb.R*.3?11:11-6*(pr-tb.R*.3)/(tb.R*.7);if(pe<hw+8)return true}
  return false;
}
function laneDoorOpen(ln){return ln.ev.n===ln.n&&ln.ev.t>.35}

/* ---------- à chaque image, avant la physique ---------- */
function meuseStep(dt){
  const M=L.meuse;if(!M)return;
  const t=G.lt,pcx=P.x+P.w/2,pfy=P.y+P.h;
  M.shelters.length=0;for(const s of M.stat)M.shelters.push(s);
  for(const ln of M.lanes){
    for(let c=ln.c;c<ln.c+BARGE.beam;c++)for(let r=M.rD-2;r<=M.rD;r++)L.g[r][c]='.';
    ln.U=t*ln.v+ln.ph;ln.n=Math.floor(ln.U/ln.C);ln.zl=ln.U-ln.n*ln.C;ln.in=ln.zl<ln.len;
    if(ln.ev.n===ln.n){ln.ev.t+=dt;marinierStep(ln)}
    if(!ln.in)continue;
    for(let c=ln.c;c<ln.c+BARGE.beam;c++)L.g[M.rD][c]='t';
    for(const s of ln.parts)if(ln.zl>=s.z0&&ln.zl<s.z1){for(let c=ln.c+s.c0;c<ln.c+s.c1;c++)L.g[M.rD-s.h][c]='t';M.shelters.push({x0:(ln.c+s.c0)*T,x1:(ln.c+s.c1)*T,y:(M.rD-s.h)*T})}
    if(!M.said.barge&&!P.dead&&P.onGround&&pcx>ln.x0&&pcx<ln.x1&&!G.sim){M.said.barge=1;say("Passager clandestin d'une péniche qui descend la Meuse… vers nous. Le règlement ne prévoit pas ce cas.",3.6)}
  }
  if(M.door)M.door.locked=!laneDoorOpen(M.door.lane);
  // meules à rats : on s'approche trop, ils sortent
  for(const b of M.bales){b.shake=Math.max(0,b.shake-dt*2.5);
    if(b.armed&&!P.dead&&!G.cut&&Math.abs(pcx-b.x)<150&&Math.abs(pfy-M.yG)<100){b.armed=false;b.shake=1;const d=Math.sign(pcx-b.x)||1;
      L.rats.push({kind:'rat',fromBale:true,x:b.x-15+d*22,y:M.yG-18,w:30,h:16,vx:d*95,vy:-320,onGround:false,t:0,sq:.2,base:95,alert:1.1,cool:4});
      L.rats.push({kind:'rat',fromBale:true,x:b.x-15-d*18,y:M.yG-18,w:30,h:16,vx:-d*95,vy:-460,onGround:false,t:.5,sq:1.2,base:95});
      if(!G.sim){SFX.squeak();setTimeout(()=>SFX.squeak(),160);puff(b.x,M.yG-50,12,true);if(!M.said.bale){M.said.bale=1;say("Des rats dans la meule ! Même à l'arrière, ils réquisitionnent le foin.",3.4)}}}}
  // une bille qui tombe dans la Meuse
  if(L.marbles)for(let i=L.marbles.length-1;i>=0;i--){const m=L.marbles[i],mx=m.x+m.w/2;if(mx>M.xL&&mx<M.xR&&m.y>M.yW){if(!G.sim){for(let k=0;k<6;k++)parts.push({type:'drop',x:mx,y:M.yW,vx:(rnd()-.5)*80,vy:-80-rnd()*120,life:0,max:.5,sz:0});tone(900,.06,'sine',.05,500)}L.marbles.splice(i,1)}else if(m.onGround&&!m.mz&&mx>M.xL&&mx<M.xR&&Math.abs(m.y+m.h-M.yD)<4)meuseMarble(m)}
  // le foin emporté par le tourbillon
  for(const h of M.hay){h.th+=h.sp*dt*(h.th<1.2?1.7:1);h.rot+=h.vr*dt;if(h.th>Math.PI)h.th-=Math.PI}
  // le tracteur
  if(M.tractor&&!M.said.tractor&&!P.dead&&P.onGround&&Math.abs(pcx-(M.tractor.x+70))<230&&Math.abs(pfy-M.tractor.y)<30&&!G.sim){M.said.tractor=1;say("Un tracteur. Une charrette sans cheval, qui sent le pétrole. Le génie agricole ne recule devant rien.",3.8)}
}
/* le marinier sort, râle, regarde le ciel… et rentre sans fermer la porte */
function marinierZ(ln,bow){const cz=bow+BARGE.cab.z0;return{cz,z:Math.max(0,cz-1.4),xd:(ln.c+BARGE.cab.c0)*T+23,xo:ln.x0+30}}
function marinierStep(ln){
  const ev=ln.ev;if(G.sim)return;
  const once=(k,c,f)=>{if(!ev[k]&&c){ev[k]=1;f()}};
  mzSet();const bow=ln.n*ln.C-ln.U,m=marinierZ(ln,bow),hd=mp(m.xo,L.meuse.yD-96,m.z);
  once('b1',ev.t>.95,()=>{bubble(hd[0],hd[1],"Qui c'est qui me bombarde ?!",'#2a3a5a');tone(220,.18,'sawtooth',.04,160)});
  once('b2',ev.t>2.3,()=>bubble(hd[0],hd[1],'Un pigeon ! En novembre !','#2a3a5a'));
  once('b3',ev.t>3.5,()=>noise(.15,900,.12,'bandpass'));
  once('q',ev.t>4.6&&!L.meuse.door.used,()=>say("Il a laissé la porte ouverte. Un marinier, ça ne ferme jamais rien : ça vit dehors.",3.6));
}
/* une bille tombe sur le pont d'une péniche */
function meuseMarble(m){
  const M=L.meuse;if(!M||m.mz)return;m.mz=true;const mx=m.x+m.w/2;
  for(const ln of M.lanes){if(!ln.in||mx<ln.x0||mx>ln.x1)continue;
    if(ln.secret){if(ln.zl<BARGE.cab.z1-.8&&ln.ev.n!==ln.n)ln.ev={n:ln.n,t:0}}
    else if(!G.sim){mzSet();const cz=Math.max(0,BARGE.cab.z0-ln.zl),s=mp((ln.c+3.5)*T,M.yD-96,cz);bubble(s[0],s[1],ln.i===0?'Ouaf ! Ouaf !':'Hé ! Ho !','#6a5a48')}
    break}
}
/* abri contre la rafale : se tenir devant ou juste à gauche d'une meule, d'une cargaison, d'une timonerie */
function meuseShelter(dir){
  const M=L.meuse,cx=P.x+P.w/2,fy=P.y+P.h;
  for(const s of M.shelters){if(fy<=s.y+3)continue;if(dir<0?(cx<s.x1&&cx>s.x0-3*T):(cx>s.x0&&cx<s.x1+3*T))return true}
  return false;
}
function splash(x,y){if(G.sim)return;for(let k=0;k<26;k++)parts.push({type:'drop',x:x+(rnd()-.5)*24,y:y-2,vx:(rnd()-.5)*260,vy:-180-rnd()*380,life:0,max:.7+rnd()*.5,sz:rnd()*2});parts.push({type:'ring',x,y,life:0,max:.45});noise(.5,700,.4,'lowpass');noise(.25,2600,.2,'bandpass',.05)}

/* ---------- après la physique : tourbillon, pales, noyade ---------- */
function meuseAfterMove(dt){
  const M=L.meuse,V=M.vt;
  if(P.ride){
    const R=P.ride;R.t+=dt;
    const fl=R.th>=M.thF0&&R.th<=M.thF1;let v;
    if(fl){const d=(keys.has('right')?1:0)-(keys.has('left')?1:0);v=d>0?235:d<0?-95:80;if(d)P.facing=d;
      if(!M.said.float&&!G.sim){M.said.float=1;say("Je vole sans battre des ailes ! Entre des moulins qui coupent tout. ← → pour choisir le moment.",3.6)}}
    else v=R.th<M.thF0?360:300;
    const a=vPathOf(V,R.th),b=vPathOf(V,R.th+.001),dl=Math.hypot(b.x-a.x,b.y-a.y)/.001||1;
    R.th+=v*dt/dl;if(fl&&R.th<M.thF0)R.th=M.thF0;
    if(R.th>=Math.PI){P.ride=null;P.vx=150;P.vy=-60;P.spin=0;P.facing=1;P.lift=0;return null}
    const q=vPathOf(V,R.th);let x=q.x-P.w/2,y=q.y-P.h/2+Math.sin(R.t*5)*(fl?3.5:1);
    if(R.k<1){R.k=Math.min(1,R.k+dt*3);const e=R.k*R.k*(3-2*R.k);x=lerp(R.sx,x,e);y=lerp(R.sy,y,e)}
    P.x=x;P.y=y;P.vx=P.vy=0;P.onGround=false;P.onMover=null;P.flaps=0;P.gliding=false;P.jumping=false;P.lift=1;P.stam=STAM_MAX;P.torn=false;
    // monté de force : il tourne sur lui-même pendant l'ascension, se stabilise là-haut
    P.spin=R.th<M.thF0?Math.min(1,R.th/M.thF0)*Math.PI*4:0;
    if(!G.sim&&rnd()<dt*14)parts.push({type:'straw',x:P.x+P.w/2+(rnd()-.5)*40,y:P.y+P.h/2+(rnd()-.5)*30,vx:-60-rnd()*80,vy:-40+rnd()*60,life:0,max:.6,rot:rnd()*6,vr:8,len:5});
    const cx=P.x+P.w/2,cy=P.y+P.h/2;
    for(const tb of M.turbines)if(bladeHit(tb,cx,cy))return'blade';
    return null;
  }
  if(P.dead)return null;
  const pcx=P.x+P.w/2,pcy=P.y+P.h/2;
  // les pales tournent aussi pour ceux qui sautent trop haut sur le plateau
  for(const tb of M.turbines)if(bladeHit(tb,pcx,pcy))return'blade';
  // la meule qui se délite : le tourbillon emporte Raymond
  if(Math.abs(pcx-V.x0)<44&&P.y+P.h>V.base-170&&P.y+P.h<=V.base+2){
    P.ride={th:0,t:0,k:0,sx:P.x,sy:P.y};
    if(!G.sim){SFX.flap();noise(1.2,500,.3,'bandpass');puff(pcx,P.y+P.h,12,true);if(!M.said.ride){M.said.ride=1;say("Le vent m'arrache ! Je n'ai rien demandé !",2.6)}}
    return null}
  // la Meuse
  if(pcx>M.xL&&pcx<M.xR&&P.y+P.h>M.yW+8){splash(pcx,M.yW);if(S.infinite){resetPlayer();return null}return'drown'}
  return null;
}
function meuseRespawn(){const M=L.meuse;if(!M)return;for(const b of M.bales){b.armed=true;b.shake=0}L.rats=L.rats.filter(c=>!c.fromBale)}

/* =========================================================
   DESSINS
   ========================================================= */
function drawMeuseBack(t){
  const M=L.meuse;if(!M)return;mzSet();const g=ctx;
  for(const b of M.bg)drawBgTurbine(g,b,t);
  drawRiver(g,t);
  for(const tr of M.trees)if(tr.z>=12)drawBankTree(g,tr);
  drawBarges(g,t);
  for(const tr of M.trees)if(tr.z<12)drawBankTree(g,tr);
  drawAquarium(g,t);
  for(const tb of M.turbines)drawTowerInPlane(g,tb,t);
  drawVortexGround(g,t);
  drawHay(g,t,false);
  for(const b of M.bales)if(b.x>cam.x-80&&b.x<cam.x+W+80)drawRoundBale(g,b.x,M.yG,b.shake,t,{hole:true});
  if(M.tractor&&M.tractor.x>cam.x-300&&M.tractor.x<cam.x+W+200){drawRoundBale(g,M.tractor.bx,M.tractor.y,0,t,{});drawTractor(g,M.tractor,t)}
}
function drawMeuseFront(t){
  const M=L.meuse;if(!M)return;
  for(const tb of M.turbines){if(tb.x<cam.x-200||tb.x>cam.x+W+200)continue;drawRotor(ctx,tb.x,tb.hy,tb.R,bladeAng(tb),1,'#f4f4f0',true)}
  drawHay(ctx,t,true);
}
/* --- éoliennes --- */
function drawRotor(g,hx,hy,R,ang,s,col,hi){
  g.save();g.translate(hx,hy);
  const blade=()=>{g.beginPath();g.moveTo(-3*s,-R*.07);g.quadraticCurveTo(-14*s,-R*.2,-8*s,-R*.48);g.quadraticCurveTo(-4*s,-R*.82,0,-R);g.quadraticCurveTo(3*s,-R*.62,6*s,-R*.24);g.quadraticCurveTo(7*s,-R*.11,3*s,-R*.07);g.closePath()};
  if(hi){g.globalAlpha=.13;g.fillStyle=col;for(const d of[-.07,-.14])for(let k=0;k<3;k++){g.save();g.rotate(ang+d+k*2.0944);blade();g.fill();g.restore()}g.globalAlpha=1}
  for(let k=0;k<3;k++){g.save();g.rotate(ang+k*2.0944);g.fillStyle=col;blade();g.fill();
    if(hi){g.save();blade();g.clip();g.fillStyle='rgba(60,70,80,.16)';g.fillRect(0,-R,10*s,R);g.fillStyle='#c8302a';g.fillRect(-15*s,-R*.97,30*s,R*.05);g.fillRect(-15*s,-R*.87,30*s,R*.05);g.restore();
      g.strokeStyle='rgba(40,40,50,.25)';g.lineWidth=1;blade();g.stroke()}
    g.restore()}
  g.fillStyle=col;g.beginPath();g.arc(0,0,9*s,0,7);g.fill();g.fillStyle='rgba(0,0,0,.12)';g.beginPath();g.arc(2*s,2*s,6*s,0,7);g.fill();
  g.restore();
}
function drawBgTurbine(g,b,t){
  const s=ms(b.z),base=mp(b.x,b.y,b.z),hub=mp(b.x,b.y-b.h,b.z),R=b.R*s;
  if(hub[0]<cam.x-R-30||hub[0]>cam.x+W+R+30)return;
  const col=mCol('#f3f3ee',b.z),sh=mCol('#b8bec4',b.z),w0=12*s,w1=6*s;
  const gr=g.createLinearGradient(base[0]-w0,0,base[0]+w0,0);gr.addColorStop(0,sh);gr.addColorStop(.42,col);gr.addColorStop(1,sh);
  g.fillStyle=gr;g.beginPath();g.moveTo(base[0]-w0,base[1]);g.lineTo(hub[0]-w1,hub[1]);g.lineTo(hub[0]+w1,hub[1]);g.lineTo(base[0]+w0,base[1]);g.closePath();g.fill();
  g.fillStyle=sh;rr(g,hub[0]-8*s,hub[1]-11*s,40*s,20*s,7*s);g.fill();
  drawRotor(g,hub[0],hub[1],R,b.ph+t*b.w,s,col,false);
}
function drawTowerInPlane(g,tb,t){
  if(tb.x<cam.x-220||tb.x>cam.x+W+220)return;const b=L.meuse.yP,x=tb.x;
  g.fillStyle='rgba(0,0,0,.18)';g.beginPath();g.ellipse(x+8,b-1,40,6,0,0,7);g.fill();
  g.fillStyle='#a29e94';rr(g,x-28,b-10,56,12,3);g.fill();g.fillStyle='#bdb9ae';g.fillRect(x-28,b-10,56,3);
  const gr=g.createLinearGradient(x-16,0,x+16,0);gr.addColorStop(0,'#c2c5c4');gr.addColorStop(.38,'#f7f7f3');gr.addColorStop(1,'#a3a8ab');
  g.fillStyle=gr;g.beginPath();g.moveTo(x-16,b-8);g.lineTo(x-8,tb.hy+8);g.lineTo(x+8,tb.hy+8);g.lineTo(x+16,b-8);g.closePath();g.fill();
  g.fillStyle='rgba(0,0,0,.06)';for(let y=b-60;y>tb.hy+20;y-=46)g.fillRect(x-14,y,28,1.2);
  g.fillStyle='#8a8f93';rr(g,x-7,b-38,14,28,5);g.fill();g.fillStyle='#6a6e72';g.fillRect(x-10,b-11,20,3);
  g.fillStyle='#d8302a';g.fillRect(x-7,b-48,14,3);
  // nacelle, en relief vers le fond (le rotor est dessiné devant Raymond)
  g.fillStyle='#d8d8d2';rr(g,x-12+DX,tb.hy-15+DY,50,28,9);g.fill();g.fillStyle='#ecece6';rr(g,x-12,tb.hy-15,48,26,9);g.fill();
  g.fillStyle='rgba(0,0,0,.1)';g.fillRect(x-6,tb.hy+4,40,3);
  if(Math.sin(t*2.6+tb.ph*3)>.55){g.fillStyle='#ff3a2a';g.beginPath();g.arc(x+26,tb.hy-17,3,0,7);g.fill();const gl=g.createRadialGradient(x+26,tb.hy-17,1,x+26,tb.hy-17,18);gl.addColorStop(0,'rgba(255,60,40,.5)');gl.addColorStop(1,'rgba(255,60,40,0)');g.fillStyle=gl;g.beginPath();g.arc(x+26,tb.hy-17,18,0,7);g.fill()}
}
/* --- la Meuse : berges, eau, roseaux, canards --- */
function drawRiver(g,t){
  const M=L.meuse,xL=M.xL,xR=M.xR,yW=M.yW,yG=M.yG,Z=MZ_ZF,fog=L.th.fog;
  const nL=mp(xL,yW,0),nR=mp(xR,yW,0),fL=mp(xL,yW,Z),fR=mp(xR,yW,Z);
  if(Math.max(nR[0],fR[0])<cam.x-60||Math.min(nL[0],fL[0])>cam.x+W+60)return;
  const wall=(x,col)=>{const a=mp(x,yG,0),b=mp(x,yG,Z),c=mp(x,yW,Z),d=mp(x,yW,0);
    const gr=g.createLinearGradient(0,d[1],0,b[1]);gr.addColorStop(0,shade(col,-.15));gr.addColorStop(.35,col);gr.addColorStop(1,fog);g.fillStyle=gr;mq(g,a,b,c,d);g.fill();
    g.strokeStyle=mix('#6c9a38',fog,.25);g.lineWidth=4;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke();
    // terre et cailloux du talus
    g.fillStyle='rgba(0,0,0,.12)';for(let k=1;k<12;k++){const z=k*k*.24,p=mp(x,(yG+yW)/2+((k*13)%20)-10,z),s=ms(z);g.beginPath();g.ellipse(p[0],p[1],4*s,2*s,0,0,7);g.fill()}};
  if(MV.x>xL)wall(xL,'#6a5236');if(MV.x<xR)wall(xR,'#5a4630');
  const gr=g.createLinearGradient(0,nL[1],0,fL[1]);gr.addColorStop(0,'#4a7c88');gr.addColorStop(.35,'#6f9ba6');gr.addColorStop(.75,'#a6c2c8');gr.addColorStop(1,fog);
  g.fillStyle=gr;mq(g,nL,nR,fR,fL);g.fill();
  g.save();mq(g,nL,nR,fR,fL);g.clip();
  // reflet du ciel, puis rides qui descendent le courant vers nous
  {const a=mp(MV.x-60,yW,8),b=mp(MV.x+80,yW,30);g.fillStyle='rgba(235,245,250,.10)';g.beginPath();g.moveTo(a[0]-60,a[1]);g.lineTo(a[0]+60,a[1]);g.lineTo(b[0]+20,b[1]);g.lineTo(b[0]-20,b[1]);g.closePath();g.fill()}
  for(let k=0;k<56;k++){const z=((k*7.3-t*1.25)%Z+Z)%Z,lx=xL+((k*397)%1000)/1000*(xR-xL-60),w=26+(k*13)%50,a=mp(lx,yW,z),b=mp(lx+w,yW,z),s=ms(z);
    g.strokeStyle='rgba(236,246,250,'+(.42*(1-z/Z))+')';g.lineWidth=Math.max(.6,1.7*s);g.beginPath();g.moveTo(a[0],a[1]);g.quadraticCurveTo((a[0]+b[0])/2,a[1]-2.5*s,b[0],b[1]);g.stroke()}
  for(const d of M.ducks)drawDuck(g,d,t);
  g.restore();
  // roseaux d'automne au pied des berges
  for(const[x,sd]of[[xL,1],[xR,-1]])for(let k=0;k<14;k++){const z=1+k*2.3+((k*7)%3)*.4;if(z>Z-4)break;const p=mp(x+sd*6,yW,z),s=ms(z);if(p[0]<cam.x-40||p[0]>cam.x+W+40)continue;
    g.strokeStyle=mCol(k%2?'#a89a5a':'#7a8a3a',z);g.lineWidth=Math.max(.7,1.6*s);for(let j=0;j<5;j++){const bx=p[0]+(j-2)*4*s;g.beginPath();g.moveTo(bx,p[1]);g.quadraticCurveTo(bx-4*s,p[1]-18*s,bx-8*s-Math.sin(t*2+k+j)*3*s,p[1]-(30+j*4)*s);g.stroke()}
    g.fillStyle=mCol('#6a4428',z);g.fillRect(p[0]-1.5*s-8*s,p[1]-38*s,3*s,9*s)}
}
function drawDuck(g,d,t){
  const z=((d.z0-t*.85)%28+28)%28+2,x=d.x+Math.sin(t*.7+d.ph)*30,p=mp(x,L.meuse.yW,z),s=ms(z)*1.1;
  if(p[0]<cam.x-30||p[0]>cam.x+W+30)return;
  g.save();g.translate(p[0],p[1]);g.scale(s,s);g.globalAlpha=1-mFog(z)*.8;
  g.strokeStyle='rgba(235,245,250,.5)';g.lineWidth=1;g.beginPath();g.ellipse(0,1,16,3,0,0,7);g.stroke();
  g.fillStyle='#7a6450';g.beginPath();g.ellipse(0,-4,11,6,0,0,7);g.fill();g.fillStyle='#4a3a2c';g.beginPath();g.moveTo(-11,-6);g.lineTo(-16,-9);g.lineTo(-10,-2);g.fill();
  g.fillStyle='#2e6a3a';g.beginPath();g.arc(8,-11,4.5,0,7);g.fill();g.fillStyle='#efe6d0';g.fillRect(5,-7.5,6,1.5);g.fillStyle='#e0b030';poly(g,[12,-12,17,-10.5,12,-9.5]);g.fill();
  g.restore();
}
function drawBankTree(g,tr){
  const b=mp(tr.x,L.meuse.yG,tr.z),s=ms(tr.z);if(b[0]<cam.x-220||b[0]>cam.x+W+220)return;
  autumnTree(g,b[0],b[1]+2,tr.h*s,mulberry(tr.seed),Math.min(.85,mFog(tr.z)*1.1));
}
/* --- les péniches --- */
function drawBarges(g,t){
  const M=L.meuse;
  const lanes=M.lanes.slice().sort((a,b)=>Math.abs(b.cx-MV.x)-Math.abs(a.cx-MV.x));
  for(const ln of lanes){const U=ln.U,n0=Math.ceil((U-ln.len)/ln.C),n1=Math.floor((U+MZ_ZF)/ln.C);
    for(let n=n1;n>=n0;n--){const bow=n*ln.C-U;if(bow+ln.len<=0||bow>=MZ_ZF)continue;drawBarge(g,ln,n,bow,t)}}
}
function mBox(g,x0,x1,yT,yB,za,zb,top,side,front,art){
  const zm=Math.min(MZ_ZF,(za+zb)/2);
  if(MV.x>x1){g.fillStyle=mCol(side,zm);mq(g,mp(x1,yT,za),mp(x1,yT,zb),mp(x1,yB,zb),mp(x1,yB,za));g.fill()}
  else if(MV.x<x0){g.fillStyle=mCol(side,zm);mq(g,mp(x0,yT,za),mp(x0,yT,zb),mp(x0,yB,zb),mp(x0,yB,za));g.fill()}
  if(MV.y<yT){g.fillStyle=mCol(top,zm);mq(g,mp(x0,yT,za),mp(x1,yT,za),mp(x1,yT,zb),mp(x0,yT,zb));g.fill()}
  const s=ms(za),p=mp(x0,yT,za),w=x1-x0,h=yB-yT;g.save();g.translate(p[0],p[1]);g.scale(s,s);
  g.fillStyle=front;g.fillRect(0,0,w,h);if(art)art(g,w,h);
  const f=mFog(za);if(f>.01){g.fillStyle=rgba(L.th.fog,f);g.fillRect(0,0,w,h)}
  g.restore();
}
function drawBarge(g,ln,n,bow,t){
  const M=L.meuse,x0=ln.x0,x1=ln.x1,yD=M.yD,yW=M.yW,za=Math.max(0,bow),zb=Math.min(MZ_ZF+6,bow+ln.len);
  {const a=mp(x0,yD-90,za),b=mp(x1,yW,za),c=mp(x1,yD-90,zb);if(Math.max(b[0],c[0])<cam.x-40||Math.min(a[0],mp(x0,yD,zb)[0])>cam.x+W+40)return}
  g.save();g.globalAlpha=clamp((MZ_ZF-za)/7,0,1);
  // vague d'étrave et sillage sur l'eau
  if(bow>0){const s=ms(bow);g.strokeStyle='rgba(240,248,250,'+(.75*(1-mFog(bow)))+')';g.lineWidth=Math.max(1,2.2*s);
    for(const[xa,sd]of[[x0,-1],[x1,1]]){const a=mp(xa,yW,bow+.2),b=mp(xa+sd*26,yW,bow+2.5),c=mp(xa+sd*58,yW,bow+6);g.beginPath();g.moveTo(a[0],a[1]);g.quadraticCurveTo(b[0],b[1]+2*s,c[0],c[1]);g.stroke()}
    const a=mp(x0,yW,bow),b=mp(x1,yW,bow);g.fillStyle='rgba(240,248,250,.55)';g.beginPath();g.ellipse((a[0]+b[0])/2,a[1]+2*s,(b[0]-a[0])/2+6*s,4*s,0,0,7);g.fill()}
  {const st=bow+ln.len;if(st>0&&st<MZ_ZF){g.strokeStyle='rgba(240,248,250,.4)';g.lineWidth=1.4*ms(st);for(const[xa,sd]of[[x0+30,-1],[x1-30,1]]){const a=mp(xa,yW,st),c=mp(xa+sd*40,yW,st+8);g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(c[0],c[1]);g.stroke()}}}
  // la coque
  mBox(g,x0,x1,yD-5,yW+3,za,zb,'#4b4036','#1d1f25','#25272d',(g2,w,h)=>{
    g2.fillStyle='#d9d3c0';g2.fillRect(0,0,w,3);g2.fillStyle='#8a2a24';g2.fillRect(0,h-7,w,4);
    g2.fillStyle='rgba(255,255,255,.06)';for(let k=12;k<w;k+=24)g2.fillRect(k,4,1,h-12);
    if(bow>=0){g2.fillStyle='#ece6d2';g2.textAlign='center';g2.font='bold 11px '+F_DISP;g2.fillText(ln.name,w/2,16);g2.font='6px '+F_DISP;g2.fillText(ln.port,w/2,24);
      g2.fillStyle='#0c0c0e';for(const hx of[22,w-22]){g2.beginPath();g2.arc(hx,10,3.2,0,7);g2.fill()}}
    g2.fillStyle='#111';for(const fx of[3,w-3]){g2.beginPath();g2.ellipse(fx,h-10,4,7,0,0,7);g2.fill()}});
  // côté de la coque : bandeau clair et pneus
  {const xs=MV.x>x1?x1:MV.x<x0?x0:null;if(xs!=null){g.strokeStyle=mCol('#d9d3c0',(za+zb)/2);g.lineWidth=1.6*ms(za);const a=mp(xs,yD-3,za),b=mp(xs,yD-3,Math.min(zb,MZ_ZF));g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke();
    g.fillStyle='#111';for(let z=Math.ceil(za/4)*4+2;z<Math.min(zb,MZ_ZF);z+=4){const p=mp(xs,yD+10,z),s=ms(z);g.beginPath();g.ellipse(p[0],p[1],2.5*s,6*s,0,0,7);g.fill()}}}
  // guindeau sur le pont avant
  if(bow+1.6>0)mBox(g,x0+60,x1-100,yD-16,yD-5,Math.max(0,bow+.6),bow+1.6,'#5a5248','#3a342e','#4a443c',null);
  // cargaison et timonerie, du fond vers nous
  for(const s of ln.partsDesc){const pa=bow+s.z0,pb=bow+s.z1;if(pb<=0||pa>=MZ_ZF)continue;
    const bx0=x0+s.c0*T,bx1=x0+s.c1*T,yT=yD-s.h*T;
    if(s.kind==='cab'){mBox(g,bx0,bx1,yT,yD-5,Math.max(0,pa),pb,'#5a4a3e','#cfc8b4','#ece5d2',(g2,w,h)=>drawCabin(g2,w,h,ln,n,t));
      if(ln.secret&&ln.ev.n===n)drawMarinierAt(g,ln,bow,t)}
    else mBox(g,bx0,bx1,yT,yD-5,Math.max(0,pa),pb,s.kind==='hay'?'#e8c672':s.kind==='logs'?'#6a4a30':'#c49a78',s.kind==='hay'?'#b08a3a':s.kind==='logs'?'#4a3422':'#8a6a4e',s.kind==='hay'?'#d8b45a':s.kind==='logs'?'#3a2a1c':'#6a5038',(g2,w,h)=>drawCargoFace(g2,w,h,s.kind,s.h,n))}
  g.restore();
}
function drawCargoFace(g,w,h,kind,hr,seed){
  if(kind==='hay'){for(let j=0;j<hr;j++)for(let i=0;i<2;i++){const x=i*40,y=j*40;g.fillStyle=(i+j+seed)%2?'#d8b45a':'#cfa94e';g.fillRect(x+1,y+1,38,38);
      g.strokeStyle='rgba(140,95,30,.5)';g.lineWidth=1;for(let k=0;k<8;k++){g.beginPath();g.moveTo(x+4+k*4.4,y+3);g.lineTo(x+3+k*4.4+(k%3)-1,y+37);g.stroke()}
      g.strokeStyle='rgba(255,236,170,.45)';for(let k=0;k<5;k++){g.beginPath();g.moveTo(x+6+k*7,y+5);g.lineTo(x+8+k*7,y+15);g.stroke()}
      g.fillStyle='#8a3a2a';g.fillRect(x+11,y+1,2,38);g.fillRect(x+27,y+1,2,38)}
    g.strokeStyle='rgba(240,210,120,.85)';g.lineWidth=1.2;for(let k=0;k<10;k++){g.beginPath();g.moveTo(3+k*8,1);g.lineTo(1+k*8,-5-(k%3)*2);g.stroke()}}
  else if(kind==='logs'){const r=9.5;for(let row=0;row*17<h-6;row++)for(let i=0;i<4;i++){const cx=11+i*19+(row%2)*8,cy=h-11-row*17;if(cx>w-6)continue;
      g.fillStyle='#5a3e26';g.beginPath();g.arc(cx,cy,r+1.5,0,7);g.fill();g.fillStyle='#d8b07a';g.beginPath();g.arc(cx,cy,r,0,7);g.fill();
      g.strokeStyle='rgba(120,80,40,.55)';g.lineWidth=1;for(const k of[3,6])g.beginPath(),g.arc(cx+.5,cy-.5,k,0,7),g.stroke();g.fillStyle='#8a5a2a';g.beginPath();g.arc(cx+.5,cy-.5,1.3,0,7);g.fill()}}
  else{for(let k=0;k<hr*22;k++){const x=4+((k*37+seed*11)%72),y=h-5-((k*23)%Math.max(8,h-8)),rb=5+(k%3);g.fillStyle=k%4?'#e8d8c4':'#d8b8a8';g.beginPath();g.ellipse(x,y,rb,rb*.85,0,0,7);g.fill();g.fillStyle='rgba(120,60,90,.35)';g.beginPath();g.ellipse(x,y-rb*.5,rb*.8,rb*.35,0,0,7);g.fill()}
    g.fillStyle='#4a7a2e';for(let k=0;k<7;k++){g.beginPath();g.ellipse(6+k*11,-2,4,2,k,0,7);g.fill()}}
}
function drawCabin(g,w,h,ln,n,t){
  g.fillStyle='#2f5a3a';g.fillRect(0,h-12,w,12);g.fillStyle='rgba(0,0,0,.1)';g.fillRect(0,h-13,w,1.5);
  g.fillStyle='#5a4a3e';g.fillRect(-5,-7,w+10,9);g.fillStyle='#e9e3d0';g.fillRect(-5,-8,w+10,2);
  // fenêtres à rideaux à carreaux
  for(const wx of[52,84]){g.fillStyle='#2a3a44';rr(g,wx,15,24,24,3);g.fill();g.fillStyle='rgba(190,222,236,.55)';g.fillRect(wx+3,17,18,9);g.fillStyle='#b8302a';g.fillRect(wx+2,16,5,22);g.fillRect(wx+17,16,5,22);g.fillStyle='rgba(255,255,255,.5)';for(let k=0;k<5;k++){g.fillRect(wx+2,18+k*4,5,1);g.fillRect(wx+17,18+k*4,5,1)}}
  // bouée
  g.strokeStyle='#e9e3d0';g.lineWidth=5;g.beginPath();g.arc(w-12,h-26,7,0,7);g.stroke();g.strokeStyle='#c8302a';g.setLineDash([3.5,3.5]);g.beginPath();g.arc(w-12,h-26,7,0,7);g.stroke();g.setLineDash([]);
  // la porte
  const open=ln.secret&&ln.ev.n===n&&ln.ev.t>.35,dr=L.meuse.door;
  if(open){const gl=g.createLinearGradient(0,22,0,h-12);gl.addColorStop(0,'#3a2a1a');gl.addColorStop(1,'#1a1208');g.fillStyle=gl;rr(g,8,22,30,h-34,3);g.fill();
    g.fillStyle='rgba(255,200,110,.35)';g.fillRect(10,h-26,26,12);g.fillStyle='#6a4a2c';g.fillRect(12,h-22,22,6);
    if(dr&&!dr.used)drawTuft(g,23,h-28,t);
    g.fillStyle='#3a6a4a';poly(g,[8,22,1,19,1,h-9,8,h-12]);g.fill()}
  else{g.fillStyle='#3a6a4a';rr(g,8,22,30,h-34,3);g.fill();g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=1;rr(g,11,25,24,h-40,2);g.stroke();
    g.fillStyle='#a8c4cc';g.beginPath();g.arc(23,33,5,0,7);g.fill();g.strokeStyle='#c9a24a';g.lineWidth=1.5;g.stroke();g.fillStyle='#c9a24a';g.beginPath();g.arc(33,h-30,1.8,0,7);g.fill()}
  // géraniums sur le toit, tuyau de poêle qui fume (le vent rabat la fumée vers l'arrière)
  for(let k=0;k<3;k++){const px=10+k*22;g.fillStyle='#a85a34';poly(g,[px,-8,px+12,-8,px+10,-18,px+2,-18]);g.fill();g.fillStyle='#3a6a2a';g.beginPath();g.arc(px+6,-21,5,0,7);g.fill();g.fillStyle='#d8302a';for(const[dx,dy]of[[-2,-24],[3,-26],[7,-22]]){g.beginPath();g.arc(px+6+dx,dy,2.2,0,7);g.fill()}}
  g.fillStyle='#2a2a2a';g.fillRect(w-26,-34,6,28);g.fillRect(w-28,-36,10,3);
  for(let i=0;i<4;i++){const ph=(t*.55+i/4)%1;g.fillStyle='rgba(225,228,230,'+(.4*(1-ph))+')';g.beginPath();g.arc(w-23-ph*46+Math.sin(ph*7+i)*3,-40-ph*26,4+ph*9,0,7);g.fill()}
  if(ln.i===2){g.fillStyle='#2a4a8a';g.fillRect(w-6,-58,6,10);g.fillStyle='#efe6d0';g.fillRect(w,-58,6,10);g.fillStyle='#c8302a';g.fillRect(w+6,-58,6,10);g.fillStyle='#3a3a3a';g.fillRect(w-7,-60,1.5,54)}
  if(ln.i===0){g.strokeStyle='#5a5a5a';g.lineWidth=.8;g.beginPath();g.moveTo(-4,-12);g.quadraticCurveTo(30,-4,64,-14);g.stroke();for(const[px,c]of[[8,'#d8302a'],[22,'#efe6d0'],[38,'#3a6aa8'],[52,'#e0b030']]){g.fillStyle=c;g.fillRect(px+Math.sin(t*6+px)*1.5,-11,9,11)}}
}
function drawMarinierAt(g,ln,bow,t){
  const ev=ln.ev,tt=ev.t;if(tt<.35||tt>4.1)return;
  const m=marinierZ(ln,bow);let z=m.z,x=m.xo,al=1,pose='fist';
  if(tt<.9){const k=(tt-.35)/.55;z=lerp(m.cz,m.z,k);x=lerp(m.xd,m.xo,k);al=Math.min(1,k*3);pose='walk'}
  else if(tt<2.2)pose='fist';else if(tt<3.4)pose='look';else{const k=(tt-3.4)/.7;z=lerp(m.z,m.cz,k);x=lerp(m.xo,m.xd,k);al=1-k*k;pose='walk'}
  const p=mp(x,L.meuse.yD-5,Math.max(0,z)),s=ms(Math.max(0,z));
  g.save();g.globalAlpha*=al;g.translate(p[0],p[1]);g.scale(s,s);drawMarinier(g,pose,t);g.restore();
}
function drawMarinier(g,pose,t){
  // casquette de marinier, bleu de travail, moustache, foulard rouge
  const sw=pose==='walk'?Math.sin(t*12)*3:0;
  g.fillStyle='#1a1a1e';rr(g,-9+sw,-8,8,8,2);g.fill();rr(g,1-sw,-8,8,8,2);g.fill();
  g.fillStyle='#2e4a7a';g.fillRect(-8,-34,16,27);g.fillStyle='rgba(0,0,0,.18)';g.fillRect(-1,-30,1.5,23);
  g.fillStyle='#34548a';rr(g,-11,-60,22,30,5);g.fill();g.fillStyle='#c8302a';poly(g,[-6,-60,6,-60,0,-52]);g.fill();
  g.strokeStyle='#34548a';g.lineWidth=6;g.lineCap='round';
  if(pose==='fist'){const sh=Math.sin(t*16)*3;g.beginPath();g.moveTo(-9,-54);g.lineTo(-18,-44);g.stroke();g.beginPath();g.moveTo(9,-54);g.lineTo(15,-70);g.lineTo(13+sh,-82);g.stroke();g.fillStyle='#e0b08a';g.beginPath();g.arc(13+sh,-85,4.5,0,7);g.fill()}
  else if(pose==='look'){g.beginPath();g.moveTo(-9,-54);g.lineTo(-13,-42);g.lineTo(-8,-36);g.stroke();g.beginPath();g.moveTo(9,-54);g.lineTo(12,-66);g.lineTo(2,-72);g.stroke();g.fillStyle='#e0b08a';g.beginPath();g.arc(1,-73,3.5,0,7);g.fill()}
  else{g.beginPath();g.moveTo(-9,-54);g.lineTo(-11+sw,-36);g.stroke();g.beginPath();g.moveTo(9,-54);g.lineTo(11-sw,-36);g.stroke()}
  const up=pose==='look'?-.35:0;g.save();g.translate(0,-68);g.rotate(up);
  g.fillStyle='#e0b08a';g.beginPath();g.ellipse(0,0,8,9,0,0,7);g.fill();
  g.fillStyle='#5a3a24';g.beginPath();g.moveTo(-6,3);g.quadraticCurveTo(0,6,6,3);g.quadraticCurveTo(0,1,-6,3);g.fill();
  g.fillStyle='#1a1a1a';g.fillRect(-4,-2,2,2);g.fillRect(2,-2,2,2);
  g.fillStyle='#1e2638';g.beginPath();g.ellipse(0,-7,10,4,0,0,7);g.fill();g.fillRect(-8,-11,16,5);g.fillStyle='#0e1420';g.fillRect(-11,-6,22,2.5);g.fillStyle='#c9a24a';g.fillRect(-2,-10,4,2);
  g.restore();
}
/* --- la Meuse « en coupe » au plan de jeu : eau, lit de la rivière, coques --- */
function drawAquarium(g,t){
  const M=L.meuse,x0=Math.max(M.xL,cam.x-10),x1=Math.min(M.xR,cam.x+W+10);if(x1<=x0)return;
  const y0=M.yW,y1=ROWS*T;
  const gr=g.createLinearGradient(0,y0,0,y1);gr.addColorStop(0,'#5e8e96');gr.addColorStop(.3,'#3e6a74');gr.addColorStop(1,'#1c3440');g.fillStyle=gr;g.fillRect(x0,y0,x1-x0,y1-y0);
  g.save();g.beginPath();g.rect(x0,y0,x1-x0,y1-y0);g.clip();
  g.globalAlpha=.09;g.strokeStyle='#eaf6f2';g.lineWidth=5;for(let x=Math.floor(x0/90)*90;x<x1+60;x+=90){g.beginPath();g.moveTo(x+Math.sin(t*.8+x)*10,y0+2);g.lineTo(x-26+Math.sin(t*1.1+x)*16,y1);g.stroke()}g.globalAlpha=1;
  // herbes aquatiques, poissons
  for(let x=Math.floor(x0/70)*70+20;x<x1;x+=70){const hh=20+(x*7%23);g.strokeStyle='#3a6a3a';g.lineWidth=2;g.beginPath();g.moveTo(x,y1-8);g.quadraticCurveTo(x+Math.sin(t*1.5+x)*8,y1-8-hh*.6,x+Math.sin(t*1.2+x*.3)*10,y1-8-hh);g.stroke()}
  for(let k=0;k<3;k++){const fx=M.xL+((t*(30+k*12)+k*600)%(M.xR-M.xL)),fy=y0+30+k*16+Math.sin(t*2+k)*4;if(fx<x0-20||fx>x1+20)continue;g.fillStyle='rgba(150,170,160,.7)';g.beginPath();g.ellipse(fx,fy,9,3.5,0,0,7);g.fill();poly(g,[fx-8,fy,fx-14,fy-4,fx-14,fy+4]);g.fill()}
  // le lit : sable, galets… un casque, une bouteille
  g.fillStyle='#5a5038';g.beginPath();g.moveTo(x0,y1);for(let x=Math.floor(x0/20)*20;x<=x1+20;x+=20)g.lineTo(x,y1-10-Math.sin(x*.013)*4);g.lineTo(x1+20,y1);g.closePath();g.fill();
  g.fillStyle='rgba(200,190,160,.35)';for(let x=Math.floor(x0/23)*23;x<x1;x+=23){g.beginPath();g.ellipse(x+(x*3%11),y1-5-(x%7),3+(x%3),2,0,0,7);g.fill()}
  {const hx=M.xL+380;if(hx>x0-40&&hx<x1+40)drawAdrian(g,hx,y1-9,.5)}
  {const bx=M.xL+1180;if(bx>x0-30&&bx<x1+30){g.save();g.translate(bx,y1-10);g.rotate(1.2);g.fillStyle='rgba(90,140,90,.75)';rr(g,-4,-18,8,18,3);g.fill();g.fillRect(-2,-24,4,7);g.restore()}}
  // coques des péniches, sous la ligne de flottaison
  for(const ln of M.lanes)if(ln.in){g.fillStyle='#1a1c22';rr(g,ln.x0,y0-6,ln.x1-ln.x0,38,12);g.fill();g.fillStyle='#7a2622';g.fillRect(ln.x0+6,y0+6,ln.x1-ln.x0-12,22);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(ln.x0+6,y0+22,ln.x1-ln.x0-12,6)}
  g.restore();
  // la surface
  g.fillStyle='rgba(236,246,250,.7)';g.fillRect(x0,y0-1,x1-x0,2);
  g.strokeStyle='rgba(236,246,250,.45)';g.lineWidth=1.2;for(let x=Math.floor(x0/34)*34;x<x1;x+=34){g.beginPath();g.moveTo(x,y0+1);g.quadraticCurveTo(x+8,y0-3+Math.sin(t*3+x)*1.5,x+16,y0+1);g.stroke()}
}
/* --- meules, tourbillon, tracteur --- */
function drawRoundBale(g,x,b,shake,t,o){
  const r=40,sx=shake?Math.sin(t*45)*shake*2.5:0;g.save();g.translate(x+sx,b-2);
  g.fillStyle='rgba(0,0,0,.22)';g.beginPath();g.ellipse(6,0,52,7,0,0,7);g.fill();
  // le corps du rouleau, qui part vers le fond
  g.fillStyle='#a8822e';g.beginPath();g.arc(DX,-r+DY,r,0,7);g.fill();g.fillRect(0,-r*2,DX,r*2);
  g.strokeStyle='rgba(240,230,210,.5)';g.lineWidth=1;for(const k of[-.7,0,.7]){g.beginPath();g.moveTo(Math.cos(Math.PI/2+k)*r,-r-Math.sin(Math.PI/2+k)*r);g.lineTo(Math.cos(Math.PI/2+k)*r+DX,-r-Math.sin(Math.PI/2+k)*r+DY);g.stroke()}
  // la face ronde : la spirale de paille
  const gr=g.createRadialGradient(-10,-r-12,4,0,-r,r);gr.addColorStop(0,'#f0cf72');gr.addColorStop(1,'#cfa448');g.fillStyle=gr;g.beginPath();g.arc(0,-r,r,0,7);g.fill();
  g.strokeStyle='rgba(150,100,30,.55)';g.lineWidth=1.2;g.beginPath();for(let a=0;a<Math.PI*10;a+=.2){const rr2=2+a*1.22;g.lineTo(Math.cos(a)*rr2,-r+Math.sin(a)*rr2)}g.stroke();
  g.strokeStyle='rgba(255,240,190,.5)';for(let k=0;k<14;k++){const a=k*.45,d=8+(k*7)%28;g.beginPath();g.moveTo(Math.cos(a)*d,-r+Math.sin(a)*d);g.lineTo(Math.cos(a)*(d+5),-r+Math.sin(a)*(d+5));g.stroke()}
  g.strokeStyle='#e0b04e';g.lineWidth=1.3;for(let k=0;k<9;k++){const a=-Math.PI*.15-k*.32;g.beginPath();g.moveTo(Math.cos(a)*r,-r+Math.sin(a)*r);g.lineTo(Math.cos(a)*(r+7),-r+Math.sin(a)*(r+7)-2);g.stroke()}
  if(o.hole){g.fillStyle='#2a1c10';g.beginPath();g.ellipse(-18,-9,9,6,0,0,7);g.fill();g.strokeStyle='#e0b04e';g.lineWidth=1;for(let k=0;k<5;k++){g.beginPath();g.moveTo(-26+k*4,-14);g.lineTo(-27+k*4,-18);g.stroke()}}
  g.restore();
}
function drawVortexGround(g,t){
  const V=L.meuse.vt,x=V.x0,b=V.base;if(x<cam.x-200||x>cam.x+W+200)return;
  // l'herbe couchée en cercle, la meule à moitié défaite
  g.save();g.strokeStyle='rgba(70,100,30,.55)';g.lineWidth=2;for(let k=0;k<3;k++){g.beginPath();g.ellipse(x,b-2,40+k*16,4+k*1.5,0,t*2+k,t*2+k+4);g.stroke()}g.restore();
  g.save();g.beginPath();g.rect(x-70,b-46,140,60);g.clip();drawRoundBale(g,x,b+28,0,t,{});g.restore();
  g.strokeStyle='#e0b04e';g.lineWidth=1.5;for(let k=0;k<12;k++){const a=t*5+k*.52,h=12+((t*60+k*13)%40);g.beginPath();g.moveTo(x-30+k*5,b-44);g.lineTo(x-30+k*5+Math.cos(a)*8,b-44-h);g.stroke()}
}
function drawHay(g,t,front){
  const M=L.meuse,V=M.vt;if(V.x0+2*V.a<cam.x-100||V.x0>cam.x+W+100)return;
  g.save();g.lineCap='round';g.lineWidth=1.6;
  for(const h of M.hay){const sw=Math.sin(t*3.2+h.ph);if((sw>0)!==front)continue;const p=vPathOf(V,h.th),off=h.off*(1-h.th/Math.PI*.55),x=p.x+Math.cos(t*3.2+h.ph)*off,y=p.y+sw*off*.4;
    if(x<cam.x-20||x>cam.x+W+20||y<cam.y-20||y>cam.y+H+20)continue;g.strokeStyle=h.c;g.globalAlpha=h.th>2.6?(Math.PI-h.th)/.54:1;
    const c=Math.cos(h.rot)*h.len,s=Math.sin(h.rot)*h.len;g.beginPath();g.moveTo(x-c,y-s);g.lineTo(x+c,y+s);g.stroke()}
  // la colonne qui tourbillonne au-dessus de la meule
  g.globalAlpha=1;for(let k=0;k<30;k++){const hh=((t*.7+k/30)%1),a=t*6+k*1.3,sn=Math.sin(a);if((sn>0)!==front)continue;const x=V.x0+Math.cos(a)*(14+hh*46),y=V.base-36-hh*210;
    g.strokeStyle=k%3?'#e0b04e':'#f0d27a';g.beginPath();g.moveTo(x-4,y);g.lineTo(x+4,y-2+sn*3);g.stroke()}
  g.restore();
}
function drawTractor(g,tr,t){
  const x=tr.x,b=tr.y,a=L.meuse.tdoor,o=a?a.open:0;g.save();
  g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(x+84,b-1,96,7,0,0,7);g.fill();
  // châssis, capot, pot d'échappement
  g.fillStyle='#262626';g.fillRect(x+30,b-50,122,14);
  g.fillStyle='#3e7a3a';rr(g,x+76,b-82,80,40,7);g.fill();g.fillStyle='#4e9446';g.fillRect(x+80,b-82,72,5);
  g.fillStyle='rgba(0,0,0,.25)';for(let k=0;k<5;k++)g.fillRect(x+100+k*9,b-72,5,2);
  g.fillStyle='#242a24';rr(g,x+150,b-78,8,32,2);g.fill();g.fillStyle='#e8e2c8';g.fillRect(x+151,b-76,5,6);
  g.fillStyle='#3a3a3a';g.fillRect(x+118,b-118,6,38);g.fillStyle='#2a2a2a';g.fillRect(x+116,b-120,10,4);
  for(let i=0;i<3;i++){const ph=(t*.8+i/3)%1;g.fillStyle='rgba(120,120,120,'+(.25*(1-ph))+')';g.beginPath();g.arc(x+121-ph*30,b-126-ph*24,3+ph*7,0,7);g.fill()}
  // cabine vitrée
  g.fillStyle='#2e4a2c';g.fillRect(x+8,b-122,82,6);g.fillRect(x+8,b-118,5,72);g.fillRect(x+85,b-118,5,72);g.fillRect(x+46,b-118,4,72);
  g.fillStyle='#3e7a3a';rr(g,x+4,b-126,90,8,3);g.fill();
  g.fillStyle='rgba(170,205,220,.42)';g.fillRect(x+50,b-116,35,66);
  // intérieur : siège, volant… et la paille
  g.fillStyle='#1e1e1e';rr(g,x+20,b-78,22,22,4);g.fill();g.fillRect(x+30,b-60,6,12);
  g.strokeStyle='#1e1e1e';g.lineWidth=3;g.beginPath();g.moveTo(x+60,b-70);g.lineTo(x+52,b-86);g.stroke();g.beginPath();g.ellipse(x+52,b-88,9,3,-.4,0,7);g.stroke();
  if(a&&!a.used){g.strokeStyle='#e0b04e';g.lineWidth=1.3;for(let k=0;k<9;k++){g.beginPath();g.moveTo(x+20+k*2.6,b-78);g.lineTo(x+18+k*2.6+(k%2)*4,b-88-(k%3)*2);g.stroke()}}
  // la porte de la cabine (elle s'ouvre vers nous)
  g.save();g.translate(x+13,b-116);g.scale(1-o*.82,1);g.fillStyle='rgba(170,205,220,.5)';g.fillRect(0,0,33,66);g.strokeStyle='#2e4a2c';g.lineWidth=2;g.strokeRect(0,0,33,66);g.fillStyle='#c9a24a';g.fillRect(27,32,4,3);g.restore();
  g.fillStyle='#2e4a2c';g.fillRect(x+20,b-50,4,10);g.fillRect(x+14,b-42,16,3);
  // roues (jantes jaunes, crampons)
  const wheel=(cx,cy,r)=>{g.fillStyle='#1c1c1c';g.beginPath();g.arc(cx,cy,r,0,7);g.fill();g.strokeStyle='#0c0c0c';g.lineWidth=3;for(let k=0;k<14;k++){const a=k/14*Math.PI*2;g.beginPath();g.moveTo(cx+Math.cos(a)*(r-5),cy+Math.sin(a)*(r-5));g.lineTo(cx+Math.cos(a+.15)*r,cy+Math.sin(a+.15)*r);g.stroke()}
    g.fillStyle='#d8b02a';g.beginPath();g.arc(cx,cy,r*.55,0,7);g.fill();g.fillStyle='#b8901a';g.beginPath();g.arc(cx,cy,r*.22,0,7);g.fill();g.fillStyle='rgba(90,70,40,.5)';g.beginPath();g.arc(cx-r*.3,cy+r*.5,r*.25,0,7);g.fill()};
  wheel(x+44,b-44,44);wheel(x+132,b-26,26);
  g.restore();
}

/* météo du 2-2 : feuilles et brins de paille emportés vers l'arrière, beaucoup plus vite pendant la rafale */
function drawGaleWeather(t,cx){
  const k=L.gust&&L.gust.state==='blow'?L.gust.k:0,warn=L.gust&&L.gust.state==='warn'?1:0;
  G.galeX=(G.galeX||0)+(1/60)*(70+k*620+warn*80);
  ctx.save();
  for(let i=0;i<22;i++){const sp=.7+(i%5)*.12,x=((i*173-G.galeX*sp-cx*.3)%(W+120)+W+120)%(W+120)-60,y=((i*97+t*(30+i%4*8)))%(H+40)-20+Math.sin(t*2+i)*16;
    ctx.save();ctx.translate(x,y);ctx.rotate(t*(3+k*6)+i);ctx.fillStyle=i%6===0?'#e0b04e':['#c9a83a','#d8a83a','#b8782a','#6a9a3c','#d8b04a'][i%5];
    if(i%6===0){ctx.fillRect(-5,-.7,10,1.4)}else{ctx.beginPath();ctx.ellipse(0,0,4.5,2.2,0,0,7);ctx.fill()}ctx.restore()}
  if(k<.1){ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=1;for(let i=0;i<6;i++){const x=((i*211-t*260-cx*.2)%(W+200)+W+200)%(W+200)-100,y=80+((i*83)%320)+Math.sin(t*1.5+i)*10;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+30,y-3,x+70,y);ctx.stroke()}}
  ctx.restore();
}
