/* =========================================================
   ACTION « E » : poignées, cachettes secrètes, drap sur le gardien
   + progression conservée d'une tentative à l'autre
   ---------------------------------------------------------
   Caractères : e cachette secrète · z poignée · R portillon (fermé tant qu'on n'a pas tiré la poignée)
   Option de niveau : secretAt [colonne, ligne] (cachette posée sans toucher au dessin du niveau)
   ========================================================= */

/* ce que Raymond a déjà pris dans un niveau, pour toute la partie en cours :
   après une mort avec une vie, on ne reprend pas deux fois la même paille ni la même médaille */
function gotOf(li){if(!S.run.got)S.run.got={};return S.run.got[li]||(S.run.got[li]={c:[],m:false,s:false,d:0})}

const SECRET_STYLE={vitrine:'drawer',insectes:'case',mammouth:'drawer',loge:'mailbox',front:'crate',turbines:'crate',trench:'crate',
  roofs:'postbox',station:'locker',square:'postbox',cathedral:'chest',aire:'bin',road:'bin',storm:'phone',bridge:'bin',
  village:'mailbox',belfry:'chest',fete:'chest',cemetery:'vase'};
const SECRET_Q=["Une cachette ! Le règlement appelle ça « dépôt clandestin ». Moi, j'appelle ça un casse-croûte.",
  "De la paille, bien au chaud. Quelqu'un pensait à moi.","Une cachette. Je savais bien que le monde était plein de recoins.",
  "Personne n'aurait regardé là. Sauf un pigeon. C'est bien pour ça qu'on nous engage."];

function actPost(L){
  L.acts=L.acts||[];L.gates=[];
  // portillons : colonnes de R
  for(let c=0;c<L.w;c++){let r=0;while(r<ROWS){if(L.g[r][c]==='R'){let r1=r;while(r1+1<ROWS&&L.g[r1+1][c]==='R')r1++;L.gates.push({c,r0:r,r1,open:0,opening:false});r=r1+1}else r++}}
  for(const a of L.acts)if(a.kind==='lever'){let best=null,bd=1e9;for(const g of L.gates){const d=Math.abs(g.c*T-a.x);if(d<bd){bd=d;best=g}}a.gate=best}
  if(L.def.secretAt){const[c,r]=L.def.secretAt;L.acts.push({kind:'secret',x:c*T+T/2,y:(r+1)*T,open:0,t:0,used:false})}
  for(const a of L.acts)if(a.kind==='secret'){a.style=a.style||SECRET_STYLE[L.def.theme]||'crate';if(a.style==='case')a.locked=true}
}
/* à l'entrée d'un niveau : ce qui a déjà été pris disparaît */
function applyGot(i){
  const gt=gotOf(i);let n=0;
  for(const k of gt.c)if(L.corn[k]&&!L.corn[k].taken){L.corn[k].taken=true;n++}
  G.corn=n;
  if(gt.m&&L.medal){L.medal.taken=true;G.medal=true}
  if(gt.s)for(const a of L.acts)if(a.kind==='secret'||a.kind==='stash')a.used=true;
  G.secret=gt.s;G.key=false;
}

/* ---------- ce qui est à portée de bec ---------- */
function nearAct(){
  const pcx=P.x+P.w/2,pb=P.y+P.h;
  if(hiddenNow())for(const g of L.guards)if(!(g.tangle>0)&&Math.abs(g.x+g.w/2-pcx)<70&&Math.abs(g.y+g.h-pb)<34)return{type:'tangle',o:g};
  for(const a of L.acts){if(a.kind==='stash'||(a.kind==='lever'&&a.used))continue;if(Math.abs(a.x-pcx)<36&&Math.abs(a.y-pb)<40)return{type:a.kind,o:a}}
  return null;
}
function tryAct(){
  if(P.dead||G.cut||G.tombSeq||P.wake>0)return;
  P.peck=.28;
  const n=nearAct();if(!n)return;
  if(n.type==='tangle'){
    // le drap sous lequel on se cachait lui tombe dessus : Raymond est à découvert
    const g=n.o,c=coverHere();g.tangle=1.1;g.sweep=0;if(c){c.gone=true;c.on=g}
    if(!G.sim){SFX.flap();noise(.35,700,.25,'bandpass');bubble(g.x+g.w/2,g.y-16,'Hé ! Qui a éteint ?','#2a3a5a');if(!G.tangleSaid){G.tangleSaid=true;say("Le drap sur la tête. Il va être de très mauvaise humeur en sortant de là. Filer.",3.8)}}
    return;
  }
  const a=n.o;
  if(a.kind==='lever'){a.used=true;a.t=0;if(a.gate)a.gate.opening=true;if(!G.sim){SFX.check();if(L.def.leverQuip)say(L.def.leverQuip,3.6)}return}
  if(a.kind==='secret'){
    if(a.used){a.t=0;a.anim=1;if(!G.sim)say(pick(["Vide. J'ai déjà tout pris.","Plus rien là-dedans. Je repasserai à la prochaine guerre."]),2.6);return}
    if(a.locked&&!G.key){if(!G.sim){tone(220,.12,'square',.05);say("Fermé à clef. Le gardien a les clefs. Le gardien a toujours les clefs.",3.4)}return}
    a.anim=1;a.t=0;grantSecret(a,a.y-24);
  }
}
function grantSecret(a,py){
  a.used=true;gotOf(G.li).s=true;G.secret=true;
  if((S.run.wear||0)>0){S.run.wear--;P.sx=1.15;P.sy=1.15}
  save();
  if(!G.sim){SFX.secret();setTimeout(()=>SFX.straw(),180);parts.push({type:'tuftpop',x:a.x,y:py,life:0,max:1.3});puff(a.x,py+4,8,true);say(pick(a.q||SECRET_Q),3.8)}
}
/* le drap sous lequel se trouve Raymond */
function coverHere(){const cx=P.x+P.w/2,cy=P.y+P.h/2;for(const c of L.covers)if(!c.gone&&cx>c.x+4&&cx<c.x+c.w-4&&cy>c.y&&cy<c.y+c.h)return c;return null}
/* dans un faux mur (carton creux) */
function inFake(){const c=Math.floor((P.x+P.w/2)/T),r=Math.floor((P.y+P.h/2)/T);return tile(c,r)==='f'}
/* tuiles creuses : dessinées comme des blocs, mais on peut y entrer */
function buildTilesF(L){const fk=[];for(let r=0;r<ROWS;r++)for(let c=0;c<L.w;c++)if(L.g[r][c]==='f'){fk.push([r,c]);L.g[r][c]='D'}const t=buildTiles(L);for(const[r,c]of fk)L.g[r][c]='f';return t}

/* ---------- mise à jour ---------- */
function actStep(dt){
  for(const a of L.acts){
    a.t+=dt;
    if(a.kind==='lever')a.open=a.used?Math.min(1,a.t*4):0;
    else if(a.anim){a.open=a.t<.22?a.t/.22:a.t<1.5?1:Math.max(0,1-(a.t-1.5)*4);if(a.t>1.8)a.anim=0}
    else a.open=0;
    if(a.style==='backdoor'&&L.backDoor&&!G.cut)L.backDoor.open=a.open;
  }
  for(const g of L.gates)if(g.opening&&g.open<1){g.open=Math.min(1,g.open+dt*1.6);if(g.open>.55)for(let r=g.r0;r<=g.r1;r++)if(L.g[r][g.c]==='R')L.g[r][g.c]='.'}
  if(P.peck>0)P.peck-=dt;
  if(!P.dead)for(const a of L.acts)if(a.kind==='stash'&&!a.used&&Math.abs(a.x-(P.x+P.w/2))<22&&Math.abs(a.y-(P.y+P.h/2))<24)grantSecret(a,a.y-10);
}
/* au retour au cartel : les gardiens se démêlent, les chats retournent s'asseoir */
function actRespawn(){
  for(const g of L.guards){g.tangle=0;g.sweep=0;g.angry=false}
  for(const c of L.covers){c.gone=false;c.on=null}
  for(const w of L.watchers)watchReset(w);
}

/* ---------- le chat aux yeux brillants : il guette, puis bondit ---------- */
function watchReset(w){w.mode='sit';w.k=null;w.seen=false;w.t=0;w.state='closed';w.open=0}
function watchStep(w,dt,pcx,pcy){
  const onScreen=Math.abs(w.x-(cam.x+W/2))<W/2+30;
  if(w.mode==='sit'||!w.mode){
    w.mode='sit';
    // il ne commence à guetter qu'une fois entré dans le champ : yeux toujours fermés à l'arrivée
    if(!w.seen){w.state='closed';w.open=0;if(onScreen){w.seen=true;w.t=0}return}
    w.t+=dt;const cyc=w.t%5.6;w.state=cyc<3.1?'closed':cyc<3.8?'warn':'open';
    w.open=w.state==='open'?Math.min(1,(cyc-3.8)*6):w.state==='warn'?.18:0;
    const moving=Math.abs(P.vx)>35||!P.onGround;
    if(w.state==='open'&&w.open>.6&&!P.dead&&!G.cut&&moving&&Math.abs(w.x-pcx)<520&&Math.abs(w.y-pcy)<220&&!hiddenNow()){
      w.mode='chase';w.ct=0;w.k={x:w.x-22,y:w.y-26,w:44,h:26,vx:0,vy:-380,onGround:false,f:pcx>w.x?1:-1};
      if(!G.sim){SFX.hiss();setTimeout(()=>meow(1),200)}
    }
    return;
  }
  const k=w.k;w.ct+=dt;
  if(w.mode==='tangle'){k.vx=0;k.vy=Math.min(MAXFALL,k.vy+GRAV*dt);k.onGround=false;moveY(k,k.vy*dt);if(w.ct>1.3){w.mode='back';w.ct=0;if(w.cover){w.cover.on=null;w.cover.sheetX=k.x+k.w/2+20}}return}
  // caché sous un drap : le chat sait qu'on est dessous, il fonce dans le drap... et s'y emmêle
  const hid=w.mode==='chase'?coverHere():null;
  let target=w.mode==='chase'?(hid?hid.x+hid.w/2:pcx):w.x;
  const dist=target-(k.x+k.w/2),dir=Math.sign(dist)||1;
  if(hid&&Math.abs(dist)<18&&k.onGround){w.mode='tangle';w.ct=0;w.cover=hid;hid.gone=true;hid.on=w;if(!G.sim){SFX.hiss();noise(.3,800,.2,'bandpass')}return}
  if(w.mode==='chase'&&!hid&&(w.ct>6.5||Math.abs(dist)>640||P.dead)){w.mode='back';w.ct=0}
  if(w.mode==='back'&&Math.abs(dist)<8&&k.onGround){w.mode='sit';w.k=null;w.t=0;w.state='closed';w.open=0;return}
  const sp=w.mode==='chase'?clamp(220+(Math.abs(dist)-150)*.25,220,300):170;
  k.leapT=(k.leapT||0)-dt;if(!(k.leapT>0&&!k.onGround))k.vx=lerp(k.vx,dir*Math.min(sp,Math.abs(dist)*6+20),Math.min(1,dt*6));k.f=dir;
  k.vy=Math.min(MAXFALL,k.vy+GRAV*dt);
  moveX(k,k.vx*dt);k.onGround=false;moveY(k,k.vy*dt);
  if(k.onGround){
    const fx=dir>0?k.x+k.w+6:k.x-6,cf=Math.floor(fx/T),rf=Math.floor((k.y+k.h-2)/T);
    const la=dir>0?k.x+k.w+34:k.x-34,cl=Math.floor(la/T);
    const blocked=isSolid(cf,rf)||isSolid(cf,rf-1),gap=!groundAt(cl,rf+1)&&!isSolid(cl,rf),pins=tile(cl,rf)==='^'||tile(cf,rf)==='^',above=w.mode==='chase'&&!hid&&P.y+P.h<k.y-20&&Math.abs(dist)<110;
    if(blocked||gap||pins||above)chaserLeap(k,dir,rf);
  }
  if(k.y>ROWS*T+60){k.x=w.x-22;k.y=w.y-26;k.vy=0;w.mode='sit';w.k=null}
}

/* ---------- le gardien au filet : il dort sur sa chaise ---------- */
function guardnetNear(K,pcx){return Math.abs(pcx-(K.home.x+K.w/2))<56}
/* saut d'un poursuivant au sol : s'il y a un trou devant, il vise l'autre bord */
function chaserLeap(K,dir,rf,vy){
  K.vy=-(vy||820);
  const c0=Math.floor((dir>0?K.x+K.w:K.x)/T);let pitEnd=null;
  for(let k=1;k<=7;k++){const c=c0+dir*k;if(!groundAt(c,rf+1)&&!isSolid(c,rf)){let e=c;while(Math.abs(e-c)<8&&!groundAt(e+dir,rf+1)&&!isSolid(e+dir,rf))e+=dir;pitEnd=e+dir;break}if(isSolid(c,rf))break}
  if(pitEnd!=null){const tx=(dir>0?pitEnd*T+T*.6:(pitEnd+1)*T-T*.6)-(K.x+K.w/2);K.vx=clamp(tx/0.72,-340,340);if(Math.abs(K.vx)<180)K.vx=dir*180;K.leapT=.8}
  else{K.vx=dir*Math.max(Math.abs(K.vx),200);K.leapT=0}
}
/* un poursuivant tombé dans un trou revient par derrière, au sol, hors champ */
function chaserReenter(K){
  const fromLeft=P.vx>=0;let x=fromLeft?cam.x-K.w-30:cam.x+W+30;x=clamp(x,T,L.wpx-T-K.w);
  const c=Math.floor((x+K.w/2)/T);let r=Math.floor(P.y/T)-2;r=clamp(r,0,ROWS-1);
  while(r<ROWS-1&&!groundAt(c,r+1))r++;
  K.x=x;K.y=(r+1)*T-K.h;K.vx=0;K.vy=0;
}
