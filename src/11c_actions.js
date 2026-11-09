/* =========================================================
   ACTION « E » : poignées, cachettes secrètes, drap sur le gardien
   + progression conservée d'une tentative à l'autre
   ---------------------------------------------------------
   Caractères : e cachette secrète · z poignée · R portillon (fermé tant qu'on n'a pas tiré la poignée)
   Option de niveau : secretAt [colonne, ligne] (cachette posée sans toucher au dessin du niveau)
   ========================================================= */

/* ce que Raymond a déjà pris dans un niveau, pour toute la partie en cours :
   après une mort avec une vie, on ne reprend pas deux fois la même paille ni la même médaille */
function gotOf(li){if(!S.run.got)S.run.got={};const g=S.run.got[li]||(S.run.got[li]={c:[],m:false,sec:[],d:0});if(!g.sec)g.sec=g.s?[0]:[];return g}
const isSecretAct=a=>a.kind==='secret'||a.kind==='stash'||a.kind==='carton';

const SECRET_STYLE={vitrine:'drawer',insectes:'case',mammouth:'drawer',loge:'mailbox',front:'crate',turbines:'crate',trench:'crate',
  roofs:'postbox',station:'locker',facade:'chest',square:'postbox',cathedral:'chest',aire:'bin',road:'bin',storm:'phone',bridge:'bin',
  village:'mailbox',belfry:'chest',fete:'chest',cemetery:'vase',ferte26:'bin',crecy:'bal',combles:'chest'};
const SECRET_Q=["Un secret ! Le règlement appelle ça « dépôt clandestin ». Moi, j'appelle ça un casse-croûte.",
  "De la paille, bien au chaud. Quelqu'un pensait à moi.","Un secret. Je savais bien que le monde était plein de recoins.",
  "Personne n'aurait regardé là. Sauf un pigeon. C'est bien pour ça qu'on nous engage."];

function actPost(L){
  L.acts=L.acts||[];L.gates=[];
  // mission 1 : un objet différent sous chaque drap (1-2 : 0 à 7, 1-4 : 8 à 12)
  if(L.covers&&L.covers.length&&L.def.sheetBase!=null)L.covers.forEach((c,j)=>c.kind=L.def.sheetBase+j);
  // portillons : colonnes de R
  for(let c=0;c<L.w;c++){let r=0;while(r<ROWS){if(L.g[r][c]==='R'){let r1=r;while(r1+1<ROWS&&L.g[r1+1][c]==='R')r1++;L.gates.push({c,r0:r,r1,open:0,opening:false});r=r1+1}else r++}}
  for(const a of L.acts)if(a.kind==='lever'){let best=null,bd=1e9;for(const g of L.gates){const d=Math.abs(g.c*T-a.x);if(d<bd){bd=d;best=g}}a.gate=best}
  {let k=0;const sq=L.def.stashQuips||[];for(const a of L.acts)if(a.kind==='stash'){a.q=sq[k]?[sq[k]]:null;k++}}
  if(L.def.helmetAt){const[c,r]=L.def.helmetAt;L.acts.push({kind:'secret',style:'helmet',x:c*T+T/2,y:(r+1)*T,open:0,t:0,used:false,q:["Le casque tombe. Et dedans, de la paille. Quelqu'un avait gardé un nid pour l'hiver."]})}
  if(L.def.bedAt){const[c,r]=L.def.bedAt;L.acts.push({kind:'secret',style:'bed',x:c*T+T/2,y:(r+1)*T,open:0,t:0,used:false,q:["Un abri, sous le parapet. Une couchette, une bougie… Et de la paille sous la couverture. Quelqu'un dormait ici."]})}
  if(L.def.nestAt){const[c,r]=L.def.nestAt;L.acts.push({kind:'secret',style:'nest',x:c*T+T/2,y:(r+1)*T,open:0,t:0,used:false,q:["Tiens, un nid. Quelle jolie paille… Ses propriétaires seront ravis de la partager avec un héros de la nation."]})}
  if(L.def.vaneAt){const[c,r]=L.def.vaneAt;L.acts.push({kind:'secret',style:'vane',x:c*T+T/2,y:(r+1)*T,open:0,t:0,used:false,ang:.6,av:0,
    q:["La girouette grince, tourne… et du pigeon d'or tombe une touffe de paille. Un collègue en métal précieux. Lui, au moins, on l'a mis sur un piédestal."]})}
  if(L.def.lingeAt){const[c,r]=L.def.lingeAt;L.acts.push({kind:'secret',style:'linge',x:c*T+T/2,y:(r+1)*T,open:0,t:0,used:false,
    q:["Un drap qui sèche au balcon. Et dans le pli, de la paille. Il faudrait peut-être revoir les méthodes pour laver le linge !"]})}
  if(L.def.poopAt){const[c,r]=L.def.poopAt;L.acts.push({kind:'secret',style:'poop',x:c*T+T/2,y:(r+1)*T,rx:200,open:0,t:0,used:false,noStraw:true,q:["Copains de toit. On ne se refait pas."]})}
  if(L.def.tiroirAt){const[c,r]=L.def.tiroirAt;L.acts.push({kind:'secret',style:'tiroir',x:c*T+T/2,y:(r+1)*T,open:0,t:0,used:false,
    q:["Un meuble d'entomologiste. Cent tiroirs de papillons épinglés… et un seul de paille. On dirait qu'on m'attendait."]})}
  if(L.def.secretAt){const[c,r]=L.def.secretAt;L.acts.push({kind:'secret',x:c*T+T/2,y:(r+1)*T,open:0,t:0,used:false})}
  for(const a of L.acts)if(a.kind==='secret'){a.style=a.style||SECRET_STYLE[L.def.theme]||'crate';if(a.style==='case')a.locked=true}
}
/* à l'entrée d'un niveau : ce qui a déjà été pris disparaît */
function applyGot(i){
  const gt=gotOf(i);let n=0;
  for(const k of gt.c)if(L.corn[k]&&!L.corn[k].taken){L.corn[k].taken=true;n++}
  G.corn=n;
  if(gt.m&&L.medal){L.medal.taken=true;G.medal=true}
  let k=0;for(const a of L.acts)if(isSecretAct(a)){a.sid=k++;if(gt.sec.includes(a.sid)){a.used=true;if(a.kind==='carton')a.step=3}}
  if(L.def.vaux){L.vfSid=k++;if(gt.sec.includes(L.vfSid))L.vfSecret=true}  // 4-3 : fienter sur un soldat allemand pendant le vol
  L.secretTotal=k;G.key=false;
}

/* ---------- ce qui est à portée de bec ---------- */
function nearAct(){
  const pcx=P.x+P.w/2,pb=P.y+P.h;
  if(hiddenNow()&&!P.hideIn)for(const g of L.guards)if(!(g.tangle>0)&&Math.abs(g.x+g.w/2-pcx)<70&&Math.abs(g.y+g.h-pb)<34)return{type:'tangle',o:g};
  for(const a of L.acts){if(a.kind==='stash'||(a.kind==='lever'&&a.used))continue;if(a.when&&!a.when())continue;
    if(a.style==='helmet'){if(!a.used&&!P.onGround&&Math.abs(a.x-pcx)<36&&Math.abs(P.y+P.h/2-(a.y-92))<52)return{type:'secret',o:a};continue}
    if(a.style==='wc'){if(!P.onGround&&Math.abs(a.x-pcx)<18&&Math.abs(a.hy-(P.y+P.h/2))<24)return{type:'secret',o:a};continue}
    if(a.style==='poop'){if(!a.used&&P.onGround&&Math.abs(a.x-pcx)<a.rx&&Math.abs(a.y-pb)<20)return{type:'secret',o:a};continue}
    if(a.style==='linge'){if(!a.used&&Math.abs(a.x-pcx)<a.rx&&Math.abs(a.y-pb)<24)return{type:'secret',o:a};continue}
    if(a.style==='lamp'){if(!P.onGround&&Math.abs(a.x-pcx)<34&&Math.abs(P.y+P.h/2-a.ly)<40)return{type:'secret',o:a};continue}if(a.kind==='carton'&&L.carton){a.x=L.carton.x}if(Math.abs(a.x-pcx)<36&&Math.abs(a.y-pb)<40)return{type:a.kind,o:a}}
  return null;
}
function tryAct(){
  if(P.dead||G.cut||G.tombSeq||P.wake>0)return;
  P.peck=.28;
  const n=nearAct();if(!n){dropMarble();return}
  if(n.type==='tangle'){
    // le drap sous lequel on se cachait lui tombe dessus : Raymond est à découvert
    const g=n.o,c=coverHere();g.tangle=1.1;g.sweep=0;if(c){c.gone=true;c.on=g;sheetSeen(c)}
    unlock('a53');if(!G.sim)achKey();
    if(!G.sim){SFX.flap();noise(.35,700,.25,'bandpass');bubble(g.x+g.w/2,g.y-16,'Hé ! Qui a éteint ?','#2a3a5a');if(!G.tangleSaid){G.tangleSaid=true;say("Le drap sur la tête. Il va être de très mauvaise humeur en sortant de là. FILER !!",3.8)}}
    return;
  }
  const a=n.o;
  if(a.kind==='carton'){
    // le carton FRAGILE qui a libéré Raymond : trois coups de bec pour l'ouvrir
    if(a.step>=3){if(!G.sim)say("Une enclume. Dans un carton FRAGILE. Le règlement ne prévoit pas ce cas.",3);return}
    a.step++;if(L.carton)L.carton.step=a.step;
    if(!G.sim){noise(.25,2600,.18,'highpass');if(a.step===1)say("Du scotch. Du bon scotch d'avant-guerre. Il résiste.",3);else if(a.step===2)say("Les rabats. Du papier journal froissé…",3)}
    if(a.step===3){grantSecret(a,a.y-40);if(!G.sim)sayQueue([['RAYMOND',"De la paille de calage. Et au fond… une enclume de cordonnier.",3.6],['RAYMOND',"Étiquetée « FRAGILE ». Voilà donc ce qui m'a libéré.",3.6]])}
    return}
  if(L.a4&&(a.kind==='beacon'||a.kind==='secret')&&a4Act(a))return;
  if(L.aire&&a.kind==='secret'&&aireAct(a))return;
  if(a.kind==='door'){winLevel();return}
  if(a.kind==='hide'){museeHide(a);return}
  if(a.kind==='lever'){a.used=true;a.t=0;unlock('a3');if(a.gate)a.gate.opening=true;if(!G.sim){SFX.check();if(L.def.leverQuip)say(L.def.leverQuip,3.6)}return}
  if(a.kind==='secret'){
    if(a.style==='poop'){if(!a.used)towerPoop(a);return}
    if(a.style==='vane'){a.av=(a.av>0?a.av:0)+9;if(!G.sim)noise(.3,1800,.08,'bandpass');if(a.used){if(!G.sim)say(pick(["Nord, sud, est, ouest. Il tourne, le pigeon d'or, mais il ne va nulle part. Je connais ça.","Le vent n'y est pour rien. C'est moi qui décide, ici."]),3);return}grantSecret(a,a.y-30);return}
    if(a.used){a.t=0;a.anim=1;if(!G.sim)say(pick(["Vide. J'ai déjà tout pris.","Plus rien là-dedans. Je repasserai à la prochaine guerre."]),2.6);return}
    if(a.locked&&!G.key){if(!G.sim){tone(220,.12,'square',.05);say(a.lockQ||"Fermé à clef. Le gardien a les clefs. Le gardien a toujours les clefs.",3.4)}return}
    a.anim=1;a.t=0;grantSecret(a,a.y-24);
  }
}
function grantSecret(a,py){
  a.used=true;{const gt=gotOf(G.li);if(!gt.sec.includes(a.sid))gt.sec.push(a.sid)}achSecret(G.li,a.sid);if(a.style==='backdoor')unlock('a2');
  if(!a.noStraw&&(S.run.wear||0)>0){S.run.wear--;P.sx=1.15;P.sy=1.15}
  save();
  if(!G.sim){SFX.secret();if(a.noStraw)noise(.25,3200,.2,'highpass');else{setTimeout(()=>SFX.straw(),180);parts.push({type:'tuftpop',x:a.x,y:py,life:0,max:1.3});puff(a.x,py+4,8,true)}say(pick(a.q||SECRET_Q),3.8)}
}
/* le drap sous lequel se trouve Raymond */
/* on a vu ce qu'il y avait sous ce drap (le chat ou le gardien l'a emporté) */
function sheetSeen(c){if(G.sim||L.def.sheetBase==null)return;S.sheets=S.sheets||{};if(!S.sheets[c.kind]){S.sheets[c.kind]=1;save();if(Object.keys(S.sheets).length>=13)unlock('a90')}}
function coverHere(){const cx=P.x+P.w/2,cy=P.y+P.h/2;for(const c of L.covers)if(!c.gone&&cx>c.x+4&&cx<c.x+c.w-4&&cy>c.y&&cy<c.y+c.h)return c;return null}
/* dans un faux mur (carton creux) */
function inFake(){const c=Math.floor((P.x+P.w/2)/T),r=Math.floor((P.y+P.h/2)/T);return tile(c,r)==='f'}
/* tuiles creuses : dessinées comme des blocs, mais on peut y entrer */
function buildTilesF(L){const fk=[],fw=[];for(const[c,r]of L.def.fakeWire||[])if(L.g[r][c]==='.'){fw.push([r,c]);L.g[r][c]='^'}for(let r=0;r<ROWS;r++)for(let c=0;c<L.w;c++)if(L.g[r][c]==='f'){fk.push([r,c]);let n='D';for(const[dr,dc]of[[0,-1],[0,1],[1,0],[-1,0],[0,-2],[0,2]]){const v=(L.g[r+dr]||[])[c+dc];if(v==='X'||v==='D'||v==='#'){n=v;break}}L.g[r][c]=n}const t=buildTiles(L);for(const[r,c]of fk)L.g[r][c]='f';for(const[r,c]of fw)L.g[r][c]='.';return t}

/* ---------- mise à jour ---------- */
function actStep(dt){
  for(const a of L.acts){
    a.t+=dt;
    if(a.style==='vane'){a.ang+=a.av*dt+Math.sin(a.t*.7)*.15*dt;a.av*=Math.exp(-dt*.9);continue}
    if(a.kind==='lever')a.open=a.used?Math.min(1,a.t*4):0;
    else if(a.anim){a.open=a.t<.22?a.t/.22:a.t<1.5?1:Math.max(0,1-(a.t-1.5)*4);if(a.t>1.8)a.anim=0}
    else a.open=0;
    if(a.style==='backdoor'&&L.backDoor&&!G.cut)L.backDoor.open=a.open;
    if(a.kind==='carton'&&L.carton)L.carton.step=a.step;
  }
  for(const g of L.gates)if(g.opening&&g.open<1){g.open=Math.min(1,g.open+dt*1.6);if(g.open>.55)for(let r=g.r0;r<=g.r1;r++)if(L.g[r][g.c]==='R')L.g[r][g.c]='.'}
  if(P.peck>0)P.peck-=dt;
  if(!P.dead)for(const a of L.acts)if(a.kind==='stash'&&!a.used&&Math.abs(a.x-(P.x+P.w/2))<22&&Math.abs(a.y-(P.y+P.h/2))<24)grantSecret(a,a.y-10);
}
/* au retour au cartel : les gardiens se démêlent, les chats retournent s'asseoir */
function actRespawn(){
  verdunRespawn();meuseRespawn();
  L.grenades=[];G.grenadeHit=false;if(L.chaser&&L.chaser.type==='drone'){L.chaser.sp='scan';L.chaser.lock=0;L.chaser.gt=0;L.chaser.hitP=false}
  L.rats=L.rats.filter(c=>!c.chase);for(const c of L.rats){c.spawned=false;c.charge=0}
  for(const m of L.mines){m.state='idle';m.t=0;m.boom=false}
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
  if(hid&&Math.abs(dist)<18&&k.onGround){w.mode='tangle';w.ct=0;w.cover=hid;hid.gone=true;hid.on=w;sheetSeen(hid);unlock('a54');if(!G.sim){SFX.hiss();noise(.3,800,.2,'bandpass')}return}
  if(w.mode==='chase'&&!hid&&(w.ct>6.5||Math.abs(dist)>640||P.dead)){w.mode='back';w.ct=0}
  // 5-1 : un chien dans son champ de vision, et le chat repart d'où il vient
  if(w.mode==='chase'&&L.crecy)for(const d of L.crecy.dogs){const dx=d.x-(k.x+k.w/2);if(Math.sign(dx)===(k.f||dir)&&Math.abs(dx)<360){w.mode='back';w.ct=0;if(!w.dogSaid&&!G.sim){w.dogSaid=1;say("Il a vu le chien. Demi-tour, la queue en l'air. Lui aussi sait lire les pancartes.",3.8)}break}}
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

/* ---------- la « fiente » : faute de mieux, une bille de verre ---------- */
const MARBLE_Q=["Oups. Le règlement n'en parle pas, donc ce n'est pas arrivé.","Pardon. C'est nerveux.","Bombardement de précision. Le génie serait fier de moi.",
 "Une bille ? J'ai pondu une bille ? Mais ils m'ont rempli de quoi, au juste ?","Une bille de verre. Le vétérinaire du régiment aura des comptes à me rendre.",
 "Ça rebondit. Ça ne devrait pas rebondir. Je ne suis pas médecin, mais ça ne devrait pas rebondir.","Soulagé. Enfin… plus léger. Enfin… bref.",
 "Pigeon un jour, pigeon toujours. On garde ses habitudes, même en mission."];
function elevated(){if(!P.onGround)return false;if(P.onMover)return true;const r=Math.floor((P.y+P.h+2)/T),c0=Math.floor((P.x+4)/T),c1=Math.floor((P.x+P.w-4)/T);for(let c=c0;c<=c1;c++){const ch=tile(c,r);if(ch&&ch!=='.'&&ch!=='#'&&ch!=='~')return true}return false}
function dropMarble(){
  if(L.musee&&museeFiente())return;
  if(!elevated()||G.cut||G.tombSeq)return;if(!L.marbles)L.marbles=[];if(L.marbles.length>2)return;
  L.marbles.push({x:P.x+P.w/2-P.facing*6,y:P.y+P.h-10,w:8,h:8,vx:-P.facing*30,vy:40,t:0,b:0,heard:false,col:pick(['#4a8ac8','#c84a4a','#4ac87a','#d8b04a'])});
  P.sx=1.12;P.sy=.9;
  if(!G.sim){noise(.08,1200,.08,'bandpass');G.marbleN=(G.marbleN||0)+1;const sq=L.gare&&gareStatueLine();if(sq){L.marbles[L.marbles.length-1].vx=-P.facing*120;setTimeout(()=>say(sq,4.2),350)}else if(G.marbleN===1||rnd()<.5)setTimeout(()=>say(pick(MARBLE_Q),3.6),350)}
}
function marbleStep(dt){
  if(!L.marbles)return;
  for(let i=L.marbles.length-1;i>=0;i--){const m=L.marbles[i];m.t+=dt;
    m.vy=Math.min(MAXFALL,m.vy+GRAV*dt);const vy0=m.vy;m.onGround=false;moveX(m,m.vx*dt);moveY(m,m.vy*dt);
    if(m.onGround&&vy0>120){m.vy=-vy0*.55;m.b++;m.vx*=.8;if(!G.sim)tone(1900+rnd()*500,.05,'sine',.06+.04/(m.b),null);if(!m.heard){m.heard=true;marbleHeard(m)}}
    else if(m.onGround){m.vy=0;m.vx*=Math.pow(.05,dt)}
    if(m.t>6||m.y>ROWS*T+40)L.marbles.splice(i,1)}
}
/* les bêtes entendent la bille : elles se tournent vers le bruit, et les chats qui somnolent bondissent */
function marbleHeard(m){
  const R2=320;
  for(const c of L.rats)if(Math.hypot(c.x+c.w/2-m.x,c.y-m.y)<R2){const d=Math.sign(m.x-(c.x+c.w/2))||1;c.vx=Math.abs(c.vx||c.base||95)*d;c.lastDir=d;c.lure=m.x}
  for(const g of L.guards)if(!(g.tangle>0)&&!(g.sweep>0)&&Math.hypot(g.x+g.w/2-m.x,g.y+g.h-m.y)<R2+80){g.dir=Math.sign(m.x-(g.x+g.w/2))||g.dir;g.pause=1.2;g.noFlip=true;if(!G.sim)bubble(g.x+g.w/2,g.y-14,'Hein ?','#2a3a5a')}
  if(L.meuse)meuseMarble(m);
  if(L.gare)gareMarble(m);
  for(const w of L.watchers)if((w.mode==='sit'||!w.mode)&&Math.hypot(w.x-m.x,w.y-m.y)<R2+120){w.seen=true;w.mode='chase';w.ct=0;w.k={x:w.x-22,y:w.y-26,w:44,h:26,vx:0,vy:-380,onGround:false,f:P.x>w.x?1:-1};if(!G.sim){SFX.hiss();setTimeout(()=>meow(1),200)}}
}
function drawMarbles(){if(!L.marbles)return;for(const m of L.marbles){const x=m.x+m.w/2,y=m.y+m.h/2;ctx.save();
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(x+2,m.y+m.h+1,4,1.5,0,0,7);ctx.fill();
  const gr=ctx.createRadialGradient(x-1.5,y-1.5,.5,x,y,4.5);gr.addColorStop(0,'#ffffff');gr.addColorStop(.35,m.col);gr.addColorStop(1,'#1a1a2a');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(x,y,4.2,0,7);ctx.fill();ctx.restore()}}

/* même plateforme : sol continu (ou boue) entre deux abscisses, sur la rangée r */
function samePlatform(x1,x2,r){let a=Math.floor(Math.min(x1,x2)/T),b=Math.floor(Math.max(x1,x2)/T);for(let c=a;c<=b;c++){if(!groundAt(c,r+1)||isSolid(c,r))return false}return true}
/* ---------- mines : un clic sous la patte, puis l'explosion ---------- */
function mineStep(dt){
  for(const m of L.mines){
    if(m.state==='idle'){if(!P.dead&&P.onGround&&Math.abs(P.x+P.w/2-m.x)<18&&Math.abs(P.y+P.h-m.y)<6){m.state='armed';m.t=0;if(!G.sim){tone(1400,.03,'square',.08);setTimeout(()=>tone(900,.03,'square',.06),60);if(!G.mineSaid){G.mineSaid=true;say("Clic. Oh non.",2)}}}}
    else if(m.state==='armed'){m.t+=dt;if(m.t>(L.def.mineDelay||1.0)){m.state='gone';m.boom=true;if(!G.sim){G.shake=14;noise(.9,260,.9,'lowpass');noise(.3,1400,.4,'bandpass');for(let i=0;i<26;i++){const a=-Math.PI*rnd(),sp=120+rnd()*320;parts.push({type:'dust',x:m.x,y:m.y-6,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:0,max:.8+rnd()*.6})}parts.push({type:'ring',x:m.x,y:m.y-10,life:0,max:.4})}
      for(const c of L.rats)if(c.chase&&Math.hypot(c.x+c.w/2-m.x,c.y-m.y)<80)c.dead=true}}
  }
}
function drawMines(t){
  for(const m of L.mines){if(m.x<cam.x-60||m.x>cam.x+W+60)continue;const x=m.x,y=m.y;ctx.save();
    // enterrées : on ne les devine qu'à deux pas (sauf une fois déclenchées)
    if(m.state==='idle'){const d=Math.hypot(P.x+P.w/2-x,P.y+P.h-y);ctx.globalAlpha=clamp(1-(d-30)/40,0,.85);if(ctx.globalAlpha<=0){ctx.restore();continue}}
    if(m.state==='gone'){ctx.fillStyle='rgba(20,14,8,.8)';ctx.beginPath();ctx.ellipse(x,y-1,20,5,0,0,7);ctx.fill();ctx.fillStyle='rgba(60,50,40,.6)';for(let k=-2;k<=2;k++){ctx.beginPath();ctx.arc(x+k*9,y-4-Math.abs(k),3,0,7);ctx.fill()}}
    else{ctx.fillStyle='#3a3a2e';ctx.beginPath();ctx.ellipse(x,y-2,13,6,0,Math.PI,0);ctx.fill();ctx.fillStyle='#55553e';ctx.beginPath();ctx.ellipse(x,y-5,9,3,0,0,7);ctx.fill();
      ctx.fillStyle='#6a6a50';ctx.fillRect(x-1.5,y-12,3,7);ctx.fillStyle='#2a2a20';ctx.fillRect(x-4,y-13,8,2);
      ctx.fillStyle='rgba(140,90,40,.5)';ctx.beginPath();ctx.arc(x+5,y-4,2,0,7);ctx.fill();
      if(m.state==='armed'&&Math.sin(t*30)>0){ctx.fillStyle='#ff4030';ctx.beginPath();ctx.arc(x,y-14,3,0,7);ctx.fill();const gl=ctx.createRadialGradient(x,y-14,1,x,y-14,14);gl.addColorStop(0,'rgba(255,80,50,.5)');gl.addColorStop(1,'rgba(255,80,50,0)');ctx.fillStyle=gl;ctx.beginPath();ctx.arc(x,y-14,14,0,7);ctx.fill()}}
    ctx.restore()}
}

/* ---------- le drone du 2-3 : projecteur, rafale, grenades, toit qu'il ne traverse pas, sprint final ---------- */
function roofAbove(c,yTop){for(let r=Math.floor(yTop/T)-1;r>=0;r--)if(isSolid(c,r))return r;return null}
function droneLOS(x1,y1,x2,y2){for(let k=1;k<12;k++){const x=x1+(x2-x1)*k/12,y=y1+(y2-y1)*k/12;if(isSolid(Math.floor(x/T),Math.floor(y/T)))return false}return true}
function droneStep(K,dt,pcx,pcy){
  if(K.state==='dead')return;
  if(K.state==='lure'){zrDroneLure(K,dt);return}
  K.gt=(K.gt||0)+dt;
  const fin=L.exit&&pcx>L.exit.x-640&&!P.dead;
  // cible : au-dessus de Raymond, mais jamais à travers un toit
  let tx=pcx-K.w/2+P.facing*(fin?0:30),ty=P.y-(fin?14:110);
  const roof=roofAbove(Math.floor(pcx/T),P.y);if(roof!=null&&!fin)ty=Math.min(ty,roof*T-70);
  const dx=tx-K.x,dy=ty-K.y,d=Math.hypot(dx,dy)||1,sp=fin?345:clamp(210+(d-150)*.5,210,320);
  const ox=K.x,oy=K.y;K.x+=dx/d*Math.min(sp*dt,d);K.y+=dy/d*Math.min(sp*dt,d)+Math.sin(K.t*6)*.4;K.f=dx>=0?1:-1;
  if(isSolid(Math.floor((K.x+K.w/2)/T),Math.floor((K.y+K.h)/T))){K.x=ox;K.y=Math.min(oy,K.y)-60*dt}
  if(fin&&!K.finSaid&&!G.sim){K.finSaid=true;say("Il accélère ! L'abri. Vite, l'abri !",2.6);tone(900,.3,'sawtooth',.05,1500)}
  // projecteur : balaie le sol ; si Raymond reste dans le faisceau, le drone vise puis tire une rafale
  const ex=K.x+K.w/2,ey=K.y+K.h;
  K.sp=K.sp||'scan';K.st=(K.st||0)+dt;
  if(K.sp==='aim')K.sa=Math.atan2(pcy-ey,pcx-ex);else K.sa=Math.PI/2+Math.sin(K.t*1.4)*.55;
  let a=Math.atan2(pcy-ey,pcx-ex)-K.sa;a=Math.atan2(Math.sin(a),Math.cos(a));
  const inCone=!P.dead&&!fin&&Math.abs(a)<.3&&Math.hypot(pcx-ex,pcy-ey)<340&&!hiddenNow()&&droneLOS(ex,ey,pcx,pcy);
  if(K.sp==='scan'){K.lock=inCone?(K.lock||0)+dt:Math.max(0,(K.lock||0)-dt*2);if(K.lock>.45){K.sp='aim';K.st=0;K.lock=0;if(!G.sim){tone(1500,.08,'square',.06);setTimeout(()=>tone(1500,.08,'square',.06),140)}}}
  else if(K.sp==='aim'){if(K.st>.75){K.sp='cool';K.st=0;K.fire=.25;if(!G.sim){for(let k=0;k<6;k++)setTimeout(()=>noise(.05,2400,.3,'highpass'),k*45)}if(inCone)K.hitP=true}}
  else if(K.sp==='cool'&&K.st>1.4){K.sp='scan';K.st=0}
  if(K.fire>0)K.fire-=dt;
  // grenades
  if(!fin&&K.sp!=='aim'&&K.gt>3.3&&!P.dead&&Math.abs(pcx-ex)<260&&!hiddenNow()){K.gt=0;(L.grenades=L.grenades||[]).push({x:ex-4,y:ey,w:8,h:8,vx:(pcx-ex)*.6,vy:-60,t:0,b:0});if(!G.sim)tone(600,.15,'sine',.04,300)}
}
function grenadeStep(dt){
  if(!L.grenades)return;
  for(let i=L.grenades.length-1;i>=0;i--){const n=L.grenades[i];n.t+=dt;n.vy=Math.min(MAXFALL,n.vy+GRAV*dt);const vy0=n.vy;n.onGround=false;moveX(n,n.vx*dt);moveY(n,n.vy*dt);
    if(n.onGround&&vy0>150){n.vy=-vy0*.45;n.vx*=.7;if(!G.sim)tone(500,.04,'square',.04)}else if(n.onGround){n.vx*=Math.pow(.02,dt)}
    if(n.t>1.5){L.grenades.splice(i,1);const gx=n.x+4,gy=n.y+4;if(Math.hypot(P.x+P.w/2-gx,P.y+P.h/2-gy)<72)G.grenadeHit=true;
      if(!G.sim){G.shake=10;noise(.6,300,.7,'lowpass');for(let k=0;k<18;k++){const a=rnd()*Math.PI*2,s2=100+rnd()*260;parts.push({type:'dust',x:gx,y:gy,vx:Math.cos(a)*s2,vy:Math.sin(a)*s2-60,life:0,max:.7+rnd()*.5})}parts.push({type:'ring',x:gx,y:gy,life:0,max:.35})}}
    else if(n.y>ROWS*T+40)L.grenades.splice(i,1)}
}
function drawDroneExtras(t){
  const K=L.chaser;
  if(L.grenades)for(const n of L.grenades){const x=n.x+4,y=n.y+4;ctx.save();ctx.fillStyle='#3a4a2a';ctx.beginPath();ctx.ellipse(x,y,5,6,0,0,7);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.4)';ctx.lineWidth=.8;for(let k=-1;k<=1;k++){ctx.beginPath();ctx.moveTo(x-5,y+k*2.5);ctx.lineTo(x+5,y+k*2.5);ctx.stroke()}
    ctx.fillStyle='#8a8a7a';ctx.fillRect(x-2,y-9,4,3);if(Math.sin(t*(10+n.t*20))>0){ctx.fillStyle='#ff5030';ctx.beginPath();ctx.arc(x,y-10,1.8,0,7);ctx.fill()}ctx.restore()}
  if(!K||K.type!=='drone'||K.state==='sleep'||K.state==='dead'||K.state==='lure')return;
  if(!isFinite(K.sa)||!isFinite(K.x))return;
  const ex=K.x+K.w/2,ey=K.y+K.h,red=K.sp==='aim';let len=340;for(let q=12;q<340;q+=8){if(isSolid(Math.floor((ex+Math.cos(K.sa)*q)/T),Math.floor((ey+Math.sin(K.sa)*q)/T))){len=q+10;break}}
  ctx.save();const gr=ctx.createRadialGradient(ex,ey,4,ex,ey,len);gr.addColorStop(0,red?'rgba(255,90,70,.45)':'rgba(240,245,255,.32)');gr.addColorStop(1,'rgba(240,245,255,0)');
  ctx.fillStyle=gr;ctx.beginPath();ctx.moveTo(ex,ey);ctx.arc(ex,ey,len,K.sa-.3,K.sa+.3);ctx.closePath();ctx.fill();
  if(K.fire>0){ctx.strokeStyle='rgba(255,220,120,'+(K.fire*3)+')';ctx.lineWidth=2;for(let k=0;k<4;k++){const aa=K.sa+(rnd()-.5)*.2;ctx.beginPath();ctx.moveTo(ex,ey);ctx.lineTo(ex+Math.cos(aa)*len,ey+Math.sin(aa)*len);ctx.stroke()}}
  ctx.restore();
}
