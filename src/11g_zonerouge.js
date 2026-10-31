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
    const gw=g.createLinearGradient(0,h.top,0,h.wy);gw.addColorStop(0,'#3e2e20');gw.addColorStop(1,'#241a12');g.fillStyle=gw;g.fillRect(h.x0,h.top,w,h.wy-h.top);
    g.fillStyle='rgba(0,0,0,.25)';for(let k=0;k<w/9;k++)g.fillRect(h.x0+k*9+(k*7%5),h.top+6+(k*13%18),3,2);
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
  for(const h of Z.holes){if(h.x1<cam.x-80||h.x0>cam.x+W+80)continue;
    for(const[ex,sd]of[[h.x0,-1],[h.x1,1]]){
      g.fillStyle='#35271a';g.beginPath();g.moveTo(ex+sd*22,h.top-1);g.quadraticCurveTo(ex+sd*4,h.top+2,ex,h.top+30);g.lineTo(ex,h.top-1);g.closePath();g.fill();
      g.fillStyle='#5a4430';g.beginPath();g.moveTo(ex+sd*58,h.top+1);g.quadraticCurveTo(ex+sd*40,h.top-14,ex+sd*22,h.top-1);g.closePath();g.fill();
      g.strokeStyle='#56763a';g.lineWidth=1.4;for(let k=0;k<6;k++){const gx=ex+sd*(26+k*5);g.beginPath();g.moveTo(gx,h.top-4-(k>1&&k<5?5:0));g.lineTo(gx+(k%2?2:-2),h.top-11-(k%3)*2-(k>1&&k<5?5:0));g.stroke()}
      g.fillStyle='rgba(0,0,0,.25)';for(let k=0;k<4;k++)g.fillRect(ex+sd*(30+k*6),h.top-3+(k%2)*2,3,2)}}
}
