/* =========================================================
   2-3 · LA ZONE ROUGE — forêt de Verdun au début du soir
   ---------------------------------------------------------
   Trous d'obus pleins d'eau (repérés tout seuls : sol creusé sur deux cases, hors tranchée),
   obus non explosés (^) derrière des barbelés posés automatiquement autour de chaque champ d'obus,
   arbres tombés (X), restes de tranchée (zone 'trench'), sangliers qui chargent sans voir les trous,
   feuillage qui cache du drone, vieille souche (cachette, option stumpAt).
   ========================================================= */
THEMES.zonerouge={outdoor:true,far:'sky',horizon:'fields',sky:['#2c3a64','#a8706e','#f2b47a'],celestial:'sun',sunY:330,fog:'#b48c84',dark:.2,weather:'dusk',
  floor:'#4c3a28',floorTop:'#56763a',type:'earth',x:'log',d:'hedge',shelf:'branch',spike:'obus',walker:'boar',flyer:'bat',props:['stump','fern','molehill']};
MAT.X.log=['#5a4432','#7a6046','#3a2a1e'];

function zrPost(Lv){
  if(Lv.def.theme!=='zonerouge')return;
  const G0=gRow(Lv),Z={holes:[],wires:[],said:{}};Lv.zr=Z;
  // trous d'obus : deux cases creusées sous la surface (pas dans la tranchée)
  for(let c=1;c<Lv.w-1;c++){if(Lv.g[G0][c]!=='.'||Lv.g[G0+1][c]!=='.'||zoneOfL(Lv,c)==='trench')continue;let e=c;while(Lv.g[G0][e+1]==='.'&&Lv.g[G0+1][e+1]==='.')e++;
    for(let cc=c;cc<=e;cc++)for(let r=G0+2;r<Lv.g.length;r++)Lv.g[r][cc]='.';   // sans fond : l'eau descend jusqu'en bas
    Z.holes.push({x0:c*T,x1:(e+1)*T,top:G0*T,wy:G0*T+30,bot:Lv.g.length*T,seed:c});c=e}
  // barbelés autour de chaque champ d'obus (un trou d'une case, l'arbre, ne coupe pas le champ)
  for(let c=1;c<Lv.w-1;c++){if(Lv.g[G0-1][c]!=='^')continue;let e=c;while(Lv.g[G0-1][e+1]==='^'||(Lv.g[G0-1][e+1]==='.'&&Lv.g[G0-1][e+2]==='^'))e++;
    Z.wires.push({x0:c*T-14,x1:(e+1)*T+14,b:G0*T});c=e}
  if(Lv.def.stumpAt){const[c,r]=Lv.def.stumpAt;Lv.acts.push({kind:'secret',style:'stump',x:c*T+T/2,y:(r+1)*T,open:0,t:0,used:false,
    q:["Une vieille souche, creuse comme une cagna. Et dedans, de la paille bien sèche. Quelqu'un y a fait son nid avant moi."]});Lv.avoid.push(c*T)}
  // troncs couchés (blocs X) et rondins de la sape (X dans la tranchée) : dessinés comme des objets
  Z.logs=[];Z.rondins=[];{const seen=new Set();for(let r=0;r<Lv.g.length;r++)for(let c=0;c<Lv.w;c++){if(Lv.g[r][c]!=='X'||seen.has(c+','+r))continue;
    let e=c;while(Lv.g[r][e+1]==='X')e++;let b=r;while(b+1<Lv.g.length&&Lv.g[b+1][c]==='X'&&Lv.g[b+1][e]==='X')b++;
    for(let rr=r;rr<=b;rr++)for(let cc=c;cc<=e;cc++)seen.add(cc+','+rr);
    (zoneOfL(Lv,c)==='trench'?Z.rondins:Z.logs).push({x0:c*T,x1:(e+1)*T,top:r*T,bot:(b+1)*T,seed:c*7+r})}}
  // l'abri allemand du Mort-Homme : un long blockhaus, une rangée de lanternes ; la dernière clignote (cachette)
  if(Lv.def.blockhaus){const[c0,c1]=Lv.def.blockhaus,x0=c0*T,x1=(c1+1)*T,b=G0*T;Z.bh={x0,x1,b,lamps:[]};
    for(let x=x0+44;x<x1-120;x+=78){const l={x,y:b-80,r:130,i:.75,warm:1};Z.bh.lamps.push(l);Lv.lights.push(l)}
    const a={kind:'secret',style:'lamp',x:Z.bh.lamps[0].x,y:b,open:0,t:0,used:false,q:["Un nid de paille dans la lanterne : voilà pourquoi elle clignotait. Et le locataire s'en va !"]};Z.lampAct=a;Lv.acts.push(a);
    for(let x=x0;x<=x1;x+=40)Lv.avoid.push(x)}
  for(const h of Z.holes)Lv.avoid.push(h.x0-30,h.x1+30);
  for(const w of Z.wires)Lv.avoid.push(w.x0,(w.x0+w.x1)/2,w.x1);
}
function zrHole(x){for(const h of L.zr.holes)if(x>h.x0&&x<h.x1)return h;return null}
/* sous le feuillage d'un arbre, le drone ne voit plus Raymond */
function zrLeaf(){const pcx=P.x+P.w/2,pcy=P.y+P.h/2;for(const d of L.decor)if(d.t==='tree'&&Math.abs(pcx-d.x)<78&&pcy>treeTop(d)*T-40)return true;return false}
function zrStep(dt){
  const Z=L.zr;if(!Z)return;
  // les bêtes qui tombent dans un trou d'obus n'en ressortent pas
  for(const c of L.rats){if(c.dead)continue;const h=zrHole(c.x+c.w/2);if(h&&c.y+c.h>h.wy+4){c.dead=true;if(!G.sim){splash(c.x+c.w/2,h.wy);
    if(c.kind==='boar'&&!Z.said.boar){Z.said.boar=1;say("Plouf. Le sanglier a pris le trou d'obus pour une souille. Il y restera.",3.4)}}}}
  if(Z.bh){const l0=Z.bh.lamps[0],used=Z.lampAct.used;l0.i=used?.75:(((G.lt*7)%5<2.2||(G.lt*13)%7<1)?.75:0);
    if(used&&Z.lampAct.anim&&!Z.decoy){Z.decoy={x:l0.x,y:Z.bh.b-96,t:0};if(!G.sim){SFX.caw();bubble(l0.x,Z.bh.b-120,'KRA !','#2a2420')}
      const K=L.chaser;if(K&&K.type==='drone'&&K.state==='chase'){K.state='lure';if(!G.sim)setTimeout(()=>say("Le pigeon de fer part après le corbeau ! Il nous confond. Les corbeaux, eux, ne disent jamais merci.",3.6),500)}}}
  if(Z.decoy){const d=Z.decoy;d.t+=dt;d.x-=560*dt;d.y-=Math.min(80,40+d.t*30)*dt;if(d.x<cam.x-900)Z.decoy=null}
  const K=L.chaser;
  if(K&&K.type==='drone'&&K.state==='chase'&&!Z.said.leaf&&!P.dead&&zrLeaf()&&!G.sim){Z.said.leaf=1;say("Sous les feuilles, il ne me voit plus. Les arbres ont toujours été du côté des pigeons.",3.4)}
}
function zrAfterMove(){
  if(!L.zr||P.dead)return null;const pcx=P.x+P.w/2,h=zrHole(pcx);
  if(h&&P.y+P.h>h.wy+8){splash(pcx,h.wy);if(S.infinite){resetPlayer();return null}return'trou'}
  return null;
}
/* ---------- dessins ---------- */
function drawZrBack(t){
  const Z=L.zr;if(!Z)return;const g=ctx,vis=(a,b)=>b>cam.x-60&&a<cam.x+W+60;
  for(const h of Z.holes){if(!vis(h.x0,h.x1))continue;const w=h.x1-h.x0;
    // la paroi du trou, l'eau croupie qui reflète le ciel du soir
    const cx=(h.x0+h.x1)/2,gw=g.createLinearGradient(0,h.top-16,0,h.wy);gw.addColorStop(0,'#7e6446');gw.addColorStop(.4,'#5a4430');gw.addColorStop(1,'#20170f');g.fillStyle=gw;
    g.beginPath();g.moveTo(h.x0-40,h.top+1);g.quadraticCurveTo(cx,h.top-30,h.x1+40,h.top+1);g.lineTo(h.x1,h.top+2);g.quadraticCurveTo(h.x1-4,h.wy-8,h.x1-16,h.wy+1);g.lineTo(h.x0+16,h.wy+1);g.quadraticCurveTo(h.x0+4,h.wy-8,h.x0,h.top+2);g.closePath();g.fill();
    g.fillStyle='rgba(0,0,0,.25)';for(let k=0;k<w/9;k++)g.fillRect(h.x0+k*9+(k*7%5),h.top-8+(k*13%22),3,2);
    // le bord du fond du cratère, avec son herbe
    g.strokeStyle='#6a5238';g.lineWidth=6;g.beginPath();g.moveTo(h.x0-40,h.top);g.quadraticCurveTo(cx,h.top-32,h.x1+40,h.top);g.stroke();
    g.strokeStyle='#56763a';g.lineWidth=1.4;for(let k=0;k<=12;k++){const u=k/12,px=(1-u)*(1-u)*(h.x0-40)+2*u*(1-u)*cx+u*u*(h.x1+40),py=(1-u)*(1-u)*h.top+2*u*(1-u)*(h.top-32)+u*u*h.top-3;g.beginPath();g.moveTo(px,py);g.lineTo(px+(k%2?2:-2),py-5-(k%3)*2);g.stroke()}
    const sk=L.th.sky,gr=g.createLinearGradient(0,h.wy,0,h.bot);gr.addColorStop(0,mix(sk[2],'#5a6a62',.35));gr.addColorStop(.25,mix(sk[1],'#3a4a46',.55));gr.addColorStop(1,'#1e2624');
    g.fillStyle=gr;g.fillRect(h.x0,h.wy,w,h.bot-h.wy);
    g.fillStyle='rgba(255,236,200,.55)';g.fillRect(h.x0,h.wy,w,1.5);
    // berges en pente et terre rejetée sur le bord : un cratère, pas une boîte
    g.fillStyle='#4a3826';for(const[ex,sd]of[[h.x0,1],[h.x1,-1]]){g.beginPath();g.moveTo(ex,h.top-2);g.quadraticCurveTo(ex+sd*4,h.wy-12,ex+sd*18,h.wy+1);g.lineTo(ex,h.wy+1);g.closePath();g.fill();
      g.fillStyle='#5a4430';g.beginPath();g.ellipse(ex-sd*10,h.top-1,20,7,0,Math.PI,0);g.fill();g.fillStyle='#56763a';g.fillRect(ex-sd*10-14,h.top-7,28,2);g.fillStyle='#4a3826'}
    g.strokeStyle='rgba(255,230,190,.35)';g.lineWidth=1;for(let k=0;k<3;k++){const xx=h.x0+12+((t*14+k*37+h.seed*11)%(w-24));g.beginPath();g.moveTo(xx,h.wy+5+k*4);g.lineTo(xx+10,h.wy+5+k*4);g.stroke()}
    for(let k=0;k<3;k++){const lx=h.x0+10+((h.seed*29+k*41)%(w-20));g.fillStyle=['#b8782a','#c9a83a','#8a4a2a'][k];g.beginPath();g.ellipse(lx+Math.sin(t*.7+k)*3,h.wy+2,4,1.6,k,0,7);g.fill()}
    // un piquet rouillé qui dépasse, des joncs sur les bords
    g.fillStyle='#5a3a26';g.save();g.translate(h.x0+w*.7,h.wy+4);g.rotate(.4);g.fillRect(-1.5,-26,3,30);g.restore();
    for(const[ex,sd]of[[h.x0+4,1],[h.x1-4,-1]]){g.strokeStyle='#5a6a2e';g.lineWidth=1.5;for(let k=0;k<5;k++){g.beginPath();g.moveTo(ex+sd*k*2,h.wy+2);g.quadraticCurveTo(ex+sd*(k*2+4),h.wy-14,ex+sd*(k*3+2)+Math.sin(t*2+k)*2,h.wy-24-k*3);g.stroke()}}
  }
  for(const w of Z.wires)if(vis(w.x0,w.x1))drawWireFence(g,w,t);
  if(Z.bh)drawBlockhaus(g,Z.bh,t);
}
function drawWireFence(g,w,t){
  const b=w.b+DY*.6,dx=DX*.6,posts=[];for(let x=w.x0;x<w.x1+1;x+=Math.max(40,(w.x1-w.x0)/Math.max(1,Math.round((w.x1-w.x0)/70))))posts.push(x);
  // piquets « queue de cochon » et trois rangs de barbelé, un peu détendus
  g.strokeStyle='#4a3a2c';g.lineWidth=3;for(const x of posts){g.beginPath();g.moveTo(x+dx,b);g.lineTo(x+dx,b-50);g.stroke();g.lineWidth=1.6;g.beginPath();for(let k=0;k<3;k++)g.arc(x+dx+3,b-50-k*4,3,Math.PI*.5,Math.PI*2.3);g.stroke();g.lineWidth=3}
  g.strokeStyle='rgba(110,96,84,.95)';g.lineWidth=1;
  for(let i=0;i+1<posts.length;i++)for(const hy of[14,27,40]){const x1=posts[i]+dx,x2=posts[i+1]+dx,sag=4+((i+hy)%3);g.beginPath();g.moveTo(x1,b-hy);g.quadraticCurveTo((x1+x2)/2,b-hy+sag,x2,b-hy);g.stroke();
    for(let k=1;k<4;k++){const bx=x1+(x2-x1)*k/4,by=b-hy+sag*.75;g.beginPath();g.moveTo(bx-2.5,by-2.5);g.lineTo(bx+2.5,by+2.5);g.moveTo(bx+2.5,by-2.5);g.lineTo(bx-2.5,by+2.5);g.stroke()}}
  // la plaque de danger, accrochée au premier rang
  const px=posts[0]+dx+16,py=b-44;g.save();g.translate(px,py);g.rotate(-.06);g.fillStyle='#c8302a';rr(g,-15,-11,30,20,2);g.fill();g.strokeStyle='#f0e6d0';g.lineWidth=1.2;rr(g,-13,-9,26,16,2);g.stroke();
  g.fillStyle='#f4ecdc';g.font='bold 6px '+F_DISP;g.textAlign='center';g.fillText('DANGER',0,-1);g.font='4.5px '+F_DISP;g.fillText('MUNITIONS',0,5);g.restore();
}
/* obus non explosés : leur nez rouillé dépasse de la terre */
function drawObus(g,x,y,cc,r){
  const b=y+T,R=mulberry(cc*13+r);g.fillStyle='rgba(60,44,30,.6)';g.beginPath();g.ellipse(x+T/2,b-1,T*.55,5,0,Math.PI,0);g.fill();
  const n=1+(cc%2);for(let k=0;k<n;k++){const sx=x+10+k*18+R()*6,h=16+R()*12,a=(R()-.5)*.7,w=6+R()*2.5;g.save();g.translate(sx,b-2);g.rotate(a);
    const gr=g.createLinearGradient(-w,0,w,0);gr.addColorStop(0,'#5a3c26');gr.addColorStop(.45,'#8a6038');gr.addColorStop(1,'#4a2e1c');g.fillStyle=gr;
    g.beginPath();g.moveTo(-w,0);g.lineTo(-w,-h*.45);g.quadraticCurveTo(-w*.9,-h,0,-h-4);g.quadraticCurveTo(w*.9,-h,w,-h*.45);g.lineTo(w,0);g.closePath();g.fill();
    g.fillStyle='#a8642a';g.fillRect(-w,-h*.32,w*2,2.5);g.fillStyle='#3a2a1e';g.beginPath();g.arc(0,-h-2.5,2,0,7);g.fill();
    g.fillStyle='rgba(160,90,40,.55)';g.beginPath();g.ellipse(-w*.4,-h*.6,2,3,0,0,7);g.fill();g.restore()}
  g.strokeStyle='#5a7a34';g.lineWidth=1.3;for(let k=0;k<5;k++){const gx=x+4+k*8;g.beginPath();g.moveTo(gx,b);g.lineTo(gx+(k%2?2:-2),b-6-(k%3)*3);g.stroke()}
}
/* tronc d'arbre couché */
function drawLogBlock(g,x,y,cc,r,mc){
  const L0=tile(cc-1,r)!=='X',R0=tile(cc+1,r)!=='X',up=tile(cc,r-1)!=='X',dn=tile(cc,r+1)!=='X';
  const top=up?y+3:y,bot=dn?y+T-1:y+T;g.fillStyle=mc[0];g.fillRect(x+(L0?6:0),top,T-(L0?6:0)-(R0?6:0),bot-top);
  g.strokeStyle='rgba(30,20,12,.45)';g.lineWidth=1.2;for(let k=0;k<4;k++){const yy=top+5+k*9+((cc+k)%3);g.beginPath();g.moveTo(x+(L0?7:0),yy);g.quadraticCurveTo(x+20,yy+2-(k%2)*4,x+T-(R0?7:0),yy);g.stroke()}
  if(up){g.fillStyle='#4f6a2a';for(let k=0;k<5;k++){g.beginPath();g.ellipse(x+5+k*8,top+1,5,2.4,0,0,7);g.fill()}}
  for(const[on,ex]of[[L0,x+6],[R0,x+T-6]])if(on){g.fillStyle='#c8a26e';g.beginPath();g.ellipse(ex,(top+bot)/2,6,(bot-top)/2,0,0,7);g.fill();
    g.strokeStyle='rgba(110,70,40,.6)';g.lineWidth=1;for(const k of[.35,.65])g.beginPath(),g.ellipse(ex,(top+bot)/2,6*k,(bot-top)/2*k,0,0,7),g.stroke()}
  if(R0&&(cc*7+r)%2===0){g.strokeStyle='#3a2a1e';g.lineWidth=2;g.beginPath();g.moveTo(x+T-8,top+6);g.lineTo(x+T+6,top-10);g.stroke()}
}
/* la vieille souche (cachette) */
function drawOldStump(g,a,t){
  const x=a.x,b=a.y,o=a.open||0;g.save();g.translate(x,b);
  g.fillStyle='rgba(0,0,0,.28)';g.beginPath();g.ellipse(4,0,46,7,0,0,7);g.fill();
  g.fillStyle='#4a3626';for(const[rx,sd]of[[-30,-1],[30,1]]){g.beginPath();g.moveTo(rx*.6,-14);g.quadraticCurveTo(rx,-6,rx+sd*12,0);g.lineTo(rx*.4,0);g.closePath();g.fill()}
  const gr=g.createLinearGradient(-28,0,28,0);gr.addColorStop(0,'#5e4632');gr.addColorStop(.4,'#7a5c40');gr.addColorStop(1,'#3e2c1e');g.fillStyle=gr;
  g.beginPath();g.moveTo(-26,0);g.lineTo(-24,-48);g.lineTo(-12,-54);g.lineTo(-4,-46);g.lineTo(8,-58);g.lineTo(16,-50);g.lineTo(25,-52);g.lineTo(27,0);g.closePath();g.fill();
  g.strokeStyle='rgba(20,12,6,.4)';g.lineWidth=1.2;for(let k=-18;k<24;k+=8){g.beginPath();g.moveTo(k,-4);g.quadraticCurveTo(k+3,-26,k-1,-46);g.stroke()}
  g.fillStyle='#4f6a2a';for(let k=0;k<7;k++){g.beginPath();g.ellipse(-20+k*6,-50+(k%3)*3,4,2.5,0,0,7);g.fill()}
  // le trou dans le bois : on n'y voit rien… tant qu'on n'a pas fouillé
  g.fillStyle='#1a120a';g.beginPath();g.ellipse(-2,-22,7,10,0,0,7);g.fill();
  if(o>0){g.fillStyle='#6a4e34';g.save();g.translate(-9,-30);g.rotate(-o*1.2);g.fillRect(0,0,14,22);g.restore()}
  // champignons
  g.fillStyle='#c8a070';for(const[mx,my]of[[18,-14],[23,-10]]){g.fillRect(mx-1,my,2,6);g.beginPath();g.ellipse(mx,my,5,3,0,Math.PI,0);g.fill()}
  g.restore();
}

/* devant les tuiles : bords arrondis des cratères et terre rejetée autour */
function drawZrMid(t){
  const Z=L.zr;if(!Z)return;const g=ctx;
  for(const o of Z.logs)if(o.x1>cam.x-120&&o.x0<cam.x+W+120)drawFallenLog(g,o,t);
  for(const o of Z.rondins)if(o.x1>cam.x-60&&o.x0<cam.x+W+60)drawRondins(g,o);
  for(const h of Z.holes){if(h.x1<cam.x-80||h.x0>cam.x+W+80)continue;
    for(const[ex,sd]of[[h.x0,-1],[h.x1,1]]){
      g.fillStyle='#35271a';g.beginPath();g.moveTo(ex+sd*22,h.top-1);g.quadraticCurveTo(ex+sd*4,h.top+2,ex,h.top+30);g.lineTo(ex,h.top-1);g.closePath();g.fill();
      g.fillStyle='#5a4430';g.beginPath();g.moveTo(ex+sd*58,h.top+1);g.quadraticCurveTo(ex+sd*40,h.top-14,ex+sd*22,h.top-1);g.closePath();g.fill();
      g.strokeStyle='#56763a';g.lineWidth=1.4;for(let k=0;k<6;k++){const gx=ex+sd*(26+k*5);g.beginPath();g.moveTo(gx,h.top-4-(k>1&&k<5?5:0));g.lineTo(gx+(k%2?2:-2),h.top-11-(k%3)*2-(k>1&&k<5?5:0));g.stroke()}
      g.fillStyle='rgba(0,0,0,.25)';for(let k=0;k<4;k++)g.fillRect(ex+sd*(30+k*6),h.top-3+(k%2)*2,3,2)}}
}

/* le drone poursuit le corbeau leurre et disparaît avec lui */
function zrDroneLure(K,dt){
  const d=L.zr&&L.zr.decoy,tx=d?d.x:K.x-600,ty=d?d.y:K.y-100,dx=tx-K.x,dy=ty-K.y,dd=Math.hypot(dx,dy)||1;
  K.x+=dx/dd*560*dt;K.y+=dy/dd*560*dt;K.f=dx>=0?1:-1;K.sp='scan';K.sa=Math.PI/2;
  if(K.x<cam.x-300||!d){K.state='dead';G.chase=false;setSong(songKey(G.li));loopSet('drone',0)}
}
function drawZrFront(t){
  const Z=L.zr;if(!Z||!Z.decoy)return;const d=Z.decoy,fl=Math.sin(t*30)*7;ctx.save();ctx.translate(d.x,d.y);ctx.rotate(-.12);
  ctx.fillStyle='#16161c';ctx.beginPath();ctx.ellipse(0,0,13,6,0,0,7);ctx.fill();ctx.beginPath();ctx.moveTo(2,-1);ctx.lineTo(-8,-12-fl);ctx.lineTo(-14,-2);ctx.fill();ctx.beginPath();ctx.moveTo(-2,1);ctx.lineTo(-6,10+fl);ctx.lineTo(-12,2);ctx.fill();
  ctx.beginPath();ctx.moveTo(11,0);ctx.lineTo(18,-3);ctx.lineTo(18,3);ctx.fill();ctx.beginPath();ctx.arc(-10,-2,4.5,0,7);ctx.fill();ctx.fillStyle='#2a2a2a';ctx.beginPath();ctx.moveTo(-14,-2);ctx.lineTo(-21,0);ctx.lineTo(-14,1);ctx.fill();ctx.restore();
}
/* tronc couché : écorce ronde, mousse, chicot de branche ; souche arrachée à gauche, coupe à la scie à droite */
function drawFallenLog(g,o,t){
  const x0=o.x0,x1=o.x1,top=o.top,bot=o.bot,d=bot-top,R=mulberry(o.seed),cy=(top+bot)/2,big=d>=70;
  g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse((x0+x1)/2+6,bot,(x1-x0)/2+12,6,0,0,7);g.fill();
  if(big){// galette de racines, encore pleine de terre
    g.fillStyle='#4a3828';g.beginPath();for(let k=0;k<=14;k++){const a=k/14*Math.PI*2,r=d*.62+R()*d*.14;g.lineTo(x0+4+Math.cos(a)*r*.42,cy+Math.sin(a)*r)}g.closePath();g.fill();
    g.strokeStyle='#5a4230';g.lineWidth=3;for(let k=0;k<7;k++){const a=-Math.PI*.5+k*.45;g.beginPath();g.moveTo(x0+4,cy);g.quadraticCurveTo(x0-10+Math.cos(a)*20,cy+Math.sin(a)*d*.5,x0-14+Math.cos(a)*d*.3,cy+Math.sin(a)*d*.7);g.stroke()}
    g.fillStyle='#8a8478';for(let k=0;k<5;k++){g.beginPath();g.ellipse(x0-4+R()*16,top+R()*d,3+R()*3,2.4,0,0,7);g.fill()}}
  const gr=g.createLinearGradient(0,top,0,bot);gr.addColorStop(0,'#86684a');gr.addColorStop(.35,'#6a5038');gr.addColorStop(1,'#3a2a1c');
  g.fillStyle=gr;rr(g,x0+(big?6:2),top+1,x1-x0-(big?6:2)-4,d-1,d*.42);g.fill();
  g.strokeStyle='rgba(30,20,12,.4)';g.lineWidth=1.3;for(let k=0;k<Math.floor(d/9);k++){const yy=top+6+k*9;g.beginPath();g.moveTo(x0+10,yy);for(let x=x0+10;x<x1-10;x+=26)g.quadraticCurveTo(x+13,yy+((x/26|0)%2?3:-3),x+26,yy);g.stroke()}
  g.fillStyle='rgba(255,230,190,.12)';g.fillRect(x0+12,top+4,x1-x0-24,3);
  g.fillStyle='#4f6a2a';for(let k=0;k<(x1-x0)/14;k++){g.beginPath();g.ellipse(x0+12+k*14+R()*6,top+3+R()*3,5+R()*3,2.6,0,0,7);g.fill()}
  if(x1-x0>=100){const sx=x0+(x1-x0)*.55;g.fillStyle='#5a4230';poly(g,[sx-5,top+4,sx+5,top+4,sx+10,top-16,sx+6,top-18]);g.fill()}
  if(!big){g.fillStyle='#d8b484';poly(g,[x0+2,top+4,x0-5,top+d*.3,x0+1,top+d*.5,x0-4,top+d*.75,x0+3,bot-2,x0+8,cy]);g.fill()}
  // la coupe à la scie, ronde, avec ses cernes
  const ex=x1-4;g.fillStyle='#c8a070';g.beginPath();g.ellipse(ex,cy,d*.2,d*.48,0,0,7);g.fill();g.strokeStyle='rgba(110,70,40,.55)';g.lineWidth=1;for(const k of[.3,.55,.8]){g.beginPath();g.ellipse(ex,cy,d*.2*k,d*.48*k,0,0,7);g.stroke()}
  g.strokeStyle='#5a4230';g.lineWidth=2;g.beginPath();g.ellipse(ex,cy,d*.2,d*.48,0,0,7);g.stroke();
}
/* rondins de la sape : posés en travers de la tranchée, on voit leurs bouts ronds */
function drawRondins(g,o){
  const n=Math.floor((o.x1-o.x0)/17);g.fillStyle='#3a2a1c';g.fillRect(o.x0,o.top+4,o.x1-o.x0,o.bot-o.top-4);
  g.fillStyle='#5a4430';g.fillRect(o.x0-4,o.top-3,o.x1-o.x0+8,8);g.fillStyle='#56763a';g.fillRect(o.x0-4,o.top-4,o.x1-o.x0+8,2);
  for(let row=0;row<2;row++)for(let k=0;k<n;k++){const x=o.x0+9+k*17+(row?8:0),y=o.top+14+row*15;if(x>o.x1-6)continue;
    g.fillStyle='#4a3424';g.beginPath();g.arc(x,y,8.5,0,7);g.fill();g.fillStyle='#b88e60';g.beginPath();g.arc(x,y,7,0,7);g.fill();g.strokeStyle='rgba(110,70,40,.6)';g.lineWidth=.8;g.beginPath();g.arc(x+.5,y-.5,3.5,0,7);g.stroke()}
}
/* l'abri allemand du Mort-Homme (1916) : béton, terre et herbe par-dessus, lanternes sur la façade */
function drawBlockhaus(g,B,t){
  if(B.x1<cam.x-200||B.x0>cam.x+W+200)return;const x0=B.x0,x1=B.x1,b=B.b,h=118,ex=L.exit?L.exit.x+6:x1-80;
  // la butte de terre qui le recouvre
  g.fillStyle='#4a3a28';g.beginPath();g.moveTo(x0-90,b);g.quadraticCurveTo(x0-40,b-h-40,x0+60,b-h-34);g.lineTo(x1-40,b-h-30);g.quadraticCurveTo(x1+50,b-h-30,x1+100,b);g.closePath();g.fill();
  g.strokeStyle='#56763a';g.lineWidth=4;g.beginPath();g.moveTo(x0-80,b-6);g.quadraticCurveTo(x0-40,b-h-38,x0+60,b-h-32);g.lineTo(x1-40,b-h-28);g.quadraticCurveTo(x1+50,b-h-28,x1+94,b-4);g.stroke();
  for(const[bx,s]of[[x0+70,.8],[x0+300,1],[x1-110,.7]])drawLeafMass(g,bx,b-h-44,s*.55,(bx|0)%9);
  // la façade de béton, tachée par cent hivers
  const gr=g.createLinearGradient(0,b-h,0,b);gr.addColorStop(0,'#a29c90');gr.addColorStop(1,'#7c776c');g.fillStyle=gr;g.fillRect(x0,b-h,x1-x0,h);
  g.fillStyle='#b4aea2';g.fillRect(x0-8,b-h-14,x1-x0+16,16);g.fillStyle='rgba(0,0,0,.18)';g.fillRect(x0-8,b-h+2,x1-x0+16,3);
  const R=mulberry(57);for(let k=0;k<(x1-x0)/26;k++){const sx=x0+R()*(x1-x0);g.fillStyle='rgba(40,36,30,'+(.06+R()*.1)+')';g.fillRect(sx,b-h,3+R()*7,30+R()*70)}
  g.strokeStyle='rgba(0,0,0,.1)';g.lineWidth=1;for(let y=b-h+28;y<b;y+=30){g.beginPath();g.moveTo(x0,y);g.lineTo(x1,y);g.stroke()}
  g.fillStyle='rgba(80,110,50,.55)';for(let k=0;k<(x1-x0)/18;k++){g.beginPath();g.ellipse(x0+k*18+R()*8,b-3,7+R()*6,4,0,0,7);g.fill()}
  // un coin éclaté, fers rouillés
  g.fillStyle='#5e5a52';poly(g,[x0,b-h,x0+34,b-h,x0+22,b-h+18,x0+8,b-h+30,x0,b-h+26]);g.fill();g.strokeStyle='#8a4a22';g.lineWidth=1.6;for(let k=0;k<3;k++){g.beginPath();g.moveTo(x0+6+k*9,b-h+6);g.quadraticCurveTo(x0+2+k*9,b-h-6,x0-4+k*11,b-h-14);g.stroke()}
  // meurtrières
  for(const mx of[x0+150,x0+330]){g.fillStyle='#1a1814';g.fillRect(mx,b-h+40,70,10);g.fillStyle='#6a6458';g.fillRect(mx-4,b-h+36,78,4);g.fillStyle='rgba(120,60,30,.6)';g.fillRect(mx+4,b-h+50,62,2)}
  // le nom laissé à la peinture, presque effacé
  g.fillStyle='rgba(30,28,24,.32)';g.font='bold 15px '+F_DISP;g.textAlign='center';g.fillText('TOTER MANN',x0+240,b-h+28);
  // plaque de l'ONF
  g.fillStyle='#7a4b2a';rr(g,ex-170,b-58,110,30,2);g.fill();g.strokeStyle='#f4ede0';g.lineWidth=1;rr(g,ex-167,b-55,104,24,2);g.stroke();g.fillStyle='#f4ede0';g.font='bold 7px '+F_DISP;g.fillText('ABRI ALLEMAND 1916',ex-115,b-45);g.font='italic 6px '+F_BODY;g.fillText('Le Mort-Homme · zone rouge',ex-115,b-36);
  // la porte : marches, porte d'acier entrouverte, lumière dedans
  g.fillStyle='#2a2620';g.fillRect(ex-6,b-78,T+12,78);const lg=g.createLinearGradient(0,b-78,0,b);lg.addColorStop(0,'rgba(255,200,120,.5)');lg.addColorStop(1,'rgba(255,170,90,.25)');g.fillStyle=lg;g.fillRect(ex,b-72,T,72);
  g.fillStyle='#4a4e4c';poly(g,[ex+T,b-72,ex+T+14,b-76,ex+T+14,b+2,ex+T,b]);g.fill();g.fillStyle='#6a6e6a';g.fillRect(ex-10,b-84,T+20,8);
  // lanternes
  B.lamps.forEach((l,k)=>{const on=l.i>.1;g.fillStyle='#2a2a2a';g.fillRect(l.x-1.5,l.y-14,3,10);g.fillRect(l.x-6,l.y-18,12,4);
    g.fillStyle=on?'#ffd88a':'#5a5040';rr(g,l.x-5,l.y-4,10,13,2);g.fill();g.strokeStyle='#2a2a2a';g.lineWidth=1.4;g.strokeRect(l.x-5,l.y-4,10,13);
    if(on){const gl=g.createRadialGradient(l.x,l.y+3,1,l.x,l.y+3,34);gl.addColorStop(0,'rgba(255,210,130,.45)');gl.addColorStop(1,'rgba(255,210,130,0)');g.fillStyle=gl;g.beginPath();g.arc(l.x,l.y+3,34,0,7);g.fill()}
    if(k===0&&!L.zr.lampAct.used){g.strokeStyle='#e0b04e';g.lineWidth=1;for(let j=0;j<3;j++){g.beginPath();g.moveTo(l.x-4+j*4,l.y-18);g.lineTo(l.x-5+j*4+(j%2)*3,l.y-24);g.stroke()}}});
}
