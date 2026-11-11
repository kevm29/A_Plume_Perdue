/* =========================================================
   SUCCÈS — ceux retenus pour l'instant (les autres viendront plus tard)
   Catégories (pour le médaillon) : P progression · C collecte · D accrocs · E ennemis · S adresse · X curiosités
   ========================================================= */
const ACH=[
 ['a1','P','Matricule 7413, au rapport',"Terminer l'introduction."],
 ['a2','P','Finalement, on aurait pu sortir par là',"Ouvrir la porte par où le voleur est parti."],
 ['a3','P','Le bec, outil réglementaire',"Ouvrir le portillon du 1-1 en tirant la poignée."],
 ['a4','P',/*v2*/'Fini la remise',"Terminer la mission 1."],
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
 ['r14','P',/*v2*/"Sergent-chef",/*v2*/"Obtenir tous les autres succès."],
 ['a24','C','Rembourré à neuf',"Revenir à cinq crans pleins après être descendu au dernier."],
 ['a26','C','Bardé de décorations',/*v2*/"Trouver les six médailles dans une même partie."],
 ['a30','C',"Rien ne m'échappe","Trouver tous les secrets du jeu."],
 ['a35','C','Mission parfaite',"Tout trouver dans une mission."],
 ['n38','C',/*v2*/"Le grenier est plein",/*v2*/"Ramasser toute la paille du jeu."],
 ['a49','D','Recousu de travers',"Perdre la tête une première fois."],
 ['a50','D','Depuis la remise',"Perdre la tête en mode difficile et tout recommencer."],
 ['a53','E',/*v2*/'Le fantôme du musée',"Jeter un drap sur la tête d'un gardien."],
 ['a54','E',"Bijou s'emmêle","Faire s'emmêler le chat dans un drap."],
 ['a56','E',"Le papillon s'est envolé","Échapper au gardien au filet."],
 ['c1','E','Instinct de pie',"Chiper dix clefs aux gardiens."],
 ['a70','S','Terminus, tout le monde descend',"Au cours Langlet, monter sur un tramway après la rue Guillaume-de-Machault et rester sur son toit jusqu'au tout début de la rue."],
 ['n07','S',/*v2*/"Sous le feuillage",/*v2*/"Échapper au drone de la zone rouge sans jamais entrer dans son projecteur."],
 ['n23','S',/*v2*/"Attention au chien",/*v2*/"Semer le chat blanc jusqu'à la pancarte « Attention au chien »."],
 ['n33','S',/*v2*/"Ils ne m'ont pas vu",/*v2*/"Se cacher dans les cinq chapelles du cimetière."],
 ['r06','S',/*v2*/"Clandestin",/*v2*/"Traverser l'intérieur du train sans être vu par un voyageur."],
 ['a73','X',/*v2*/'Frères d\'armes',/*v2*/"Dans la cathédrale de Reims en feu, en 1914, sortir avec Flocon et Gaston sains et saufs."],
 ['a72','X',/*v2*/'Voyeur',/*v2*/"Sur l'aire de Gueux, ouvrir la porte d'un cabinet occupé."],
 ['a74','X',/*v2*/'Scheisse',/*v2*/"Fienter sur l'officier allemand de l'abri du Mort-Homme et sur un soldat allemand pendant le vol depuis le fort de Vaux, en 1916."],
 ['a75','X',/*v2*/'Planqué',/*v2*/"Dans l'abri du Mort-Homme, se cacher une fois dans chacun des six placards."],
 ['a76','X',/*v2*/'Mémoire de pigeon',/*v2*/"Revivre avec la touche B les huit souvenirs : 1916 au sentier (route, bois, tranchée), le gaz, la cathédrale en feu, la Marne, Crécy, les combles."],
 ['n11','X',/*v2*/"Tchao les nazes !",/*v2*/"Faire fuir tous les pigeons du parc en fientant sur la tête de Colbert."],
 ['n21','X',/*v2*/"Zzzip",/*v2*/"Faire rentrer les deux campeurs dans leur tente."],
 ['n25','X',/*v2*/"Génération Z",/*v2*/"Demander le chemin aux pigeons des combles."],
 ['r10','X',/*v2*/"Seul au bal",/*v2*/"Rester trente secondes sur la scène pendant que l'orchestre joue."],
 ['r16','X',/*v2*/"Wesh",/*v2*/"Se faire chasser d'un toit par les pigeons de la place."],
 ['r18','X',/*v2*/"Le trampoline",/*v2*/"Rebondir dix fois de suite sur le trampoline de Crécy."],
 ['a71','X','Tous en chieur',"En haut de la tour sud, faire comme les pigeons du toit."],
 ['a68','S',"L'aile qui se décroche","Vider complètement la robustesse de ses ailes."],
 ['a81','X',"Clin d'œil","Cliquer quatre fois sur l'œil de Raymond : de nouveaux modes apparaissent dans les paramètres."],
 ['a82','X','Rrrou… ?',"Rester immobile une minute : Raymond s'endort."],
 ['a90','E','Les dessous du musée',"Voir ce qui se cache sous les treize draps de la mission 1."],
 ['n47','E',/*v2*/"Dératisé",/*v2*/"Sauter par-dessus cinquante rats."],
 ['r17','E',/*v2*/"Bijou s'endort",/*v2*/"Traverser la loge sans réveiller le chat Bijou."],
];
const ACH_BY={};ACH.forEach((a,i)=>ACH_BY[a[0]]={i,cat:a[1],t:a[2],d:a[3]});
/* nombre total de secrets (1-1 : trois ; les autres niveaux : une) */
const SECRET_TOTAL=48;   // tous les secrets du jeu (vérifié niveau par niveau)
function achState(){if(!S.ach)S.ach={};if(!S.achStats)S.achStats={keys:0,secrets:{},letters:{}};return S.ach}
function unlock(id){
  if(G.sim||!ACH_BY[id])return;const st=achState();if(st[id])return;
  st[id]=Date.now();save();
  if(id!=='r14'&&ACH.every(a=>a[0]==='r14'||st[a[0]]))setTimeout(()=>unlock('r14'),1600);
  G.toasts=G.toasts||[];G.toasts.push({id,t:0});
  if(AC&&!S.muted){[523,659,784,1047].forEach((f,i)=>tone(f,.35,'triangle',.11,null,i*.09))}
}
function achSecret(li,sid){achState();S.achStats.secrets[li+':'+sid]=1;if(Object.keys(S.achStats.secrets).length>=SECRET_TOTAL)unlock('a30')}
function achScheisse(k){achState();const o=S.achStats.scheisse=S.achStats.scheisse||{};o[k]=1;save();if(o.musee&&o.vaux)unlock('a74')}
function achCup(i,n){achState();const o=S.achStats.cups=S.achStats.cups||{};o[i]=1;save();if(Object.keys(o).length>=n)unlock('a75')}
const B_SCENES=['route','bois','tr','gaz','reims','ferte','crecy','combles'];
function achB(k){if(G.sim)return;achState();const o=S.achStats.bScenes=S.achStats.bScenes||{};if(o[k])return;o[k]=1;save();if(B_SCENES.every(x=>o[x]))unlock('a76')}
/* la progression des succès qui se comptent : [fait, total] */
const ACH_PROG={
  a17:()=>[Object.keys(S.achStats.letters||{}).length,20],
  a26:()=>[Object.keys(S.run.medals||{}).length,6],
  a30:()=>[Object.keys(S.achStats.secrets||{}).length,SECRET_TOTAL],
  c1:()=>[S.achStats.keys||0,10],
  a90:()=>[Object.keys(S.sheets||{}).length,13],
  a75:()=>[Object.keys(S.achStats.cups||{}).length,6],
  a74:()=>[Object.keys(S.achStats.scheisse||{}).length,2],
  a76:()=>[B_SCENES.filter(x=>(S.achStats.bScenes||{})[x]).length,B_SCENES.length],
  n33:()=>[Object.keys(S.achStats.chap||{}).length,5],
  n38:()=>strawAll(),
  n47:()=>[S.achStats.rats||0,50],
  r10:()=>[Math.floor((S.achStats.best||{}).stage||0),30],
  r18:()=>[(S.achStats.best||{}).trampo||0,10],
  r14:()=>[ACH.filter(a=>a[0]!=='r14'&&S.ach&&S.ach[a[0]]).length,ACH.length-1]};
/* toute la paille du jeu : la meilleure récolte de chaque niveau, sur son total */
function strawAll(){let d=0,n=0;for(let i=0;i<LEVELS.length;i++){const t=levelTotals(i).corn,b=S.best[i];n+=t;d+=Math.min(t,b?b.corn:0)}return[d,n]}
function achStraw(){const[d,n]=strawAll();if(n&&d>=n)unlock('n38')}
function achRat(){if(G.sim)return;achState();S.achStats.rats=(S.achStats.rats||0)+1;save();if(S.achStats.rats>=50)unlock('n47')}
function achChapel(k,n){if(G.sim)return;achState();const o=S.achStats.chap=S.achStats.chap||{};if(o[k])return;o[k]=1;save();if(Object.keys(o).length>=n)unlock('n33')}
function achBest(k,v){achState();const o=S.achStats.best=S.achStats.best||{};if(v>(o[k]||0)){o[k]=v;save()}}
function achKey(){achState();S.achStats.keys=(S.achStats.keys||0)+1;save();if(S.achStats.keys>=10)unlock('c1')}
function achLetter(li){achState();S.achStats.letters[li]=1;if(Object.keys(S.achStats.letters).length>=20)unlock('a17')}
/* fin de mission (après la lettre) */
function achMission(w){
  unlock('a'+(4+w));
  let pts=0,mx=0,acc=0;for(let k=w*4;k<w*4+4;k++){const o=S.run.stats[k];if(o){pts+=o.points||0;mx+=o.max||1;acc+=o.deaths||0}else{acc+=99;mx+=1}}
  if(pts>=mx)unlock('a35');if(acc===0)unlock('a12');
  if(w===4){unlock('a9');if(!S.run.headLost&&!S.run.usedInf)unlock('a10');if(!S.run.anyAccroc&&!S.run.usedInf)unlock('a11')}
  if(Object.keys(S.run.medals||{}).length>=6)unlock('a26');   // cinq médailles de mission + celle de la tranchée de 1916 (2-1)
}

/* ---------- médailles : une par succès, dessinée une fois puis mise en cache ---------- */
const ACH_HINT={a1:"Tout commence par une nuit d'orage.",a2:"Le voleur n'est pas sorti par la fenêtre.",a3:"Un pigeon a un bec. Qu'il s'en serve.",a4:"Sortir du musée.",a5:/*v2*/"Traverser les champs fleuris",a6:/*v2*/"Atteindre le sommet du clocher le plus haut.",
 a7:"Survivre à la route sans fin.",a8:"Arriver au village.",a9:"Remettre la lettre.",a10:"Arriver au bout sans jamais avoir besoin d'un empailleur.",a11:"Arriver au bout sans perdre un seul brin.",a12:"Quatre niveaux d'affilée sans un accroc.",
 a13:"Lire ce qui est écrit au-dessus de la fête.",a15:"Aller jusqu'au bout de l'histoire.",a17:"Tout lire, morceau par morceau.",a24:"Toucher le fond, puis remonter à neuf.",a26:/*v2*/"Être multidécoré.",
 a30:"Fouiller partout. Vraiment partout.",a35:"Ne rien laisser derrière soi pendant toute une mission.",a49:"Perdre la tête.",a50:"Perdre la tête en mode difficile.",a53:/*v2*/"Voir un fantôme au musée.",a54:/*v2*/"Des griffes dans un drap.",
 a90:/*v2*/"Apprécier l'art.",a56:"Le filet n'attrape pas tout.",c1:/*v2*/"Que faire de toutes ces clefs ?",a68:"Trop forcer sur ses coutures.",a81:/*v2*/"Regarder Raymond droit dans l'œil.",a82:"Ne rien faire du tout, assez longtemps.",a70:/*v2*/"Faire du tourisme.",a73:/*v2*/"Sauver la fratrie.",a72:/*v2*/"Voir le petit oiseau.",a74:/*v2*/"Sus à l'ennemi !",a75:/*v2*/"Faire les placards.",a76:/*v2*/"Se souvenir de tout.",a71:/*v2*/"Se trouver une activité de groupe.",n07:/*v2*/"Les feuilles cachent mieux que la nuit.",n11:/*v2*/"Faire fuir les sans-dents.",n21:/*v2*/"Un coup de bec sur la toile.",n23:/*v2*/"Effrayer le chat.",n25:/*v2*/"Rrou… wesh…",n33:/*v2*/"Les grilles sont entrouvertes.",n38:/*v2*/"Tout. Partout.",n47:/*v2*/"Eviter les rongeurs.",r06:/*v2*/"Pile entre les sièges.",r10:/*v2*/"Marguerite adore la musique.",r14:/*v2*/"Tout. Absolument tout.",r16:/*v2*/"Ils ne partagent pas.",r17:/*v2*/"Pas un bruit.",r18:/*v2*/"Les jeux du fond du jardin."};
// forme, métal, ruban [couleurs de bandes], emblème
const ACH_MEDAL={
 a1:['round','bronze',['#2a3f6a','#e9dfc7','#2a3f6a']],a2:['shield','bronze',['#2f5a3a','#e9dfc7']],a3:['oval','bronze',['#a8322d','#c9a24a','#a8322d']],
 a4:['round','silver',['#22343a','#a8322d','#22343a']],a5:['cross','silver',['#c8302a','#2a1a1a','#c8302a']],a6:['rosette','silver',['#2a3f6a','#c9a24a','#2a3f6a']],
 a7:['oval','silver',['#1d4f9a','#f4f2ea','#1d4f9a']],a8:['shield','silver',['#6a4a2c','#e0b04e','#6a4a2c']],a9:['laurel','gold',['#a8322d','#f4f2ea','#2a3f6a']],
 a10:['star','gold',['#2a3f6a','#c9a24a','#a8322d','#c9a24a','#2a3f6a']],a11:['star','gold',['#e0b04e','#6a4a16','#e0b04e']],a12:['cross','bronze',['#4f7a5a','#e9dfc7','#4f7a5a']],
 a13:['rosette','bronze',['#2a4a8a','#efe6d0','#b8302a']],a15:['laurel','silver',['#3a3a48','#e9dfc7','#3a3a48']],a17:['oval','gold',['#c9a24a','#2a2420','#c9a24a']],
 a24:['round','silver',['#c86a8a','#e9dfc7','#c86a8a']],a26:['star','silver',['#2a3f6a','#a8322d','#c9a24a','#a8322d','#2a3f6a']],a30:['rosette','gold',['#6a3a6a','#c9a24a','#6a3a6a']],
 a35:['laurel','gold',['#4f7a5a','#c9a24a','#4f7a5a']],a49:['cross','bronze',['#3a3a48','#a8322d','#3a3a48']],a50:['round','bronze',['#1a1a1a','#6a6a6a','#1a1a1a']],
 a53:['shield','bronze',['#e6e0d2','#2e3a58','#e6e0d2']],a54:['oval','bronze',['#1e1c22','#c8f060','#1e1c22']],a56:['rosette','bronze',['#d8d0bc','#8a6a3a','#d8d0bc']],
 a90:['oval','silver',['#e6e0d2','#5a3a24','#e6e0d2']],c1:['shield','silver',['#1a1a1a','#e9dfc7','#2a3f6a']],a68:['cross','silver',['#727b8f','#e9dfc7','#727b8f']],a81:['round','gold',['#d97a2a','#efe9df','#d97a2a']],a82:['oval','silver',['#1c2438','#e9dfc7','#1c2438']],n07:["shield", "silver", ["#2f5a3a", "#e9dfc7", "#2f5a3a"]],n11:["round", "bronze", ["#2a3f6a", "#e9dfc7", "#2a3f6a"]],n21:["oval", "bronze", ["#2f5a3a", "#e9dfc7", "#2f5a3a"]],n23:["shield", "silver", ["#3a3a48", "#e9dfc7", "#3a3a48"]],n25:["oval", "bronze", ["#c86a8a", "#e9dfc7", "#c86a8a"]],n33:["shield", "silver", ["#1c2438", "#e9dfc7", "#1c2438"]],n38:["star", "gold", ["#c9a24a", "#2a2420", "#c9a24a"]],n47:["round", "bronze", ["#3a3a48", "#e9dfc7", "#3a3a48"]],r06:["shield", "silver", ["#1a1a1a", "#6a6a6a", "#1a1a1a"]],r10:["rosette", "silver", ["#c86a8a", "#e9dfc7", "#c86a8a"]],r14:["star", "gold", ["#2a4a8a", "#efe6d0", "#b8302a"]],r16:["shield", "bronze", ["#c86a8a", "#e9dfc7", "#c86a8a"]],r17:["oval", "silver", ["#1a1a1a", "#6a6a6a", "#1a1a1a"]],r18:["round", "bronze", ["#5a8ac0", "#f4f2ea", "#5a8ac0"]],a70:["oval", "bronze", ["#3a6a8a", "#e9dfc7", "#3a6a8a"]],a71:["rosette", "bronze", ["#5a5a66", "#f0ebe0", "#5a5a66"]],a72:["shield", "bronze", ["#c86a8a", "#f4f2ea", "#c86a8a"]],a73:["cross", "silver", ["#a8322d", "#1a1a1a", "#a8322d", "#1a1a1a", "#a8322d"]],a74:["cross", "bronze", ["#5a6a52", "#1a1a1a", "#e9dfc7", "#1a1a1a", "#5a6a52"]],a75:["shield", "bronze", ["#6a4a2c", "#c9a24a", "#6a4a2c"]],a76:["rosette", "gold", ["#6a3a6a", "#e9dfc7", "#c9a24a", "#e9dfc7", "#6a3a6a"]]};
const METAL={gold:['#fbeab0','#d6ad52','#8a6420','#4a3410'],silver:['#ffffff','#c8ccd4','#7c828c','#2e323a'],bronze:['#f6d0a4','#bd7e44','#7a4a22','#3a2210']};
const achCache={};
function drawAchMedal(g,x,y,id,on,s){
  const key=id+(on?'1':'0');let c=achCache[key];
  if(!c){c=mk(96*3,132*3);const k=c.getContext('2d');k.scale(3,3);k.translate(48,58);paintMedal(k,id,on);achCache[key]=c}
  g.save();g.translate(x,y);g.scale((s||1)*.5,(s||1)*.5);g.drawImage(c,-48,-58,96,132);g.restore();
}
function paintMedal(g,id,on){
  const sp=ACH_MEDAL[id]||['round','bronze',['#a8322d','#e9dfc7']],[shape,metal,rib]=sp,M=on?METAL[metal]:['#6a6a70','#4a4a52','#2e2e34','#18181c'];
  g.lineJoin='round';g.lineCap='round';
  // ruban plissé, à bandes, avec ombre portée
  g.save();g.fillStyle='rgba(0,0,0,.35)';g.fillRect(-15,-56,32,36);
  const n=rib.length,rw=30;g.beginPath();g.moveTo(-15,-58);g.lineTo(15,-58);g.lineTo(15,-22);g.lineTo(0,-28);g.lineTo(-15,-22);g.closePath();g.clip();
  for(let i=0;i<n;i++){g.fillStyle=on?rib[i]:(i%2?'#3a3a40':'#2a2a30');g.fillRect(-15+i*rw/n,-58,rw/n+.5,40)}
  g.fillStyle='rgba(255,255,255,.12)';for(let yy=-56;yy<-22;yy+=3)g.fillRect(-15,yy,30,.6);
  g.fillStyle='rgba(0,0,0,.25)';g.fillRect(-15,-58,30,4);const sh=g.createLinearGradient(-15,0,15,0);sh.addColorStop(0,'rgba(0,0,0,.25)');sh.addColorStop(.5,'rgba(255,255,255,.08)');sh.addColorStop(1,'rgba(0,0,0,.25)');g.fillStyle=sh;g.fillRect(-15,-58,30,40);
  g.restore();
  // anneau
  g.strokeStyle=M[2];g.lineWidth=2.4;g.beginPath();g.ellipse(0,-22,3.5,4.5,0,0,7);g.stroke();
  // forme
  const metalFill=(r)=>{const gr=g.createRadialGradient(-r*.35,-r*.4,1,0,0,r*1.15);gr.addColorStop(0,M[0]);gr.addColorStop(.45,M[1]);gr.addColorStop(1,M[2]);return gr};
  g.save();g.shadowColor='rgba(0,0,0,.45)';g.shadowOffsetX=1.5;g.shadowOffsetY=2.5;g.shadowBlur=3;
  if(shape==='star'){g.fillStyle=metalFill(28);g.beginPath();for(let i=0;i<16;i++){const a=i/16*Math.PI*2-Math.PI/2,r=i%2?17:28;g.lineTo(Math.cos(a)*r,Math.sin(a)*r)}g.closePath();g.fill()}
  else if(shape==='cross'){g.fillStyle=metalFill(27);g.beginPath();for(let q=0;q<4;q++){g.save();g.rotate(q*Math.PI/2);g.moveTo(-5,-6);g.lineTo(-11,-27);g.quadraticCurveTo(0,-23,11,-27);g.lineTo(5,-6);g.restore()}g.fill();
    g.beginPath();g.arc(0,0,9,0,7);g.fill()}
  else if(shape==='rosette'){g.fillStyle=metalFill(27);for(let i=0;i<12;i++){const a=i/12*Math.PI*2;g.beginPath();g.arc(Math.cos(a)*19,Math.sin(a)*19,8,0,7);g.fill()}}
  else if(shape==='shield'){g.fillStyle=metalFill(26);g.beginPath();g.moveTo(-21,-22);g.lineTo(21,-22);g.lineTo(21,0);g.quadraticCurveTo(20,18,0,27);g.quadraticCurveTo(-20,18,-21,0);g.closePath();g.fill()}
  else if(shape==='oval'){g.fillStyle=metalFill(26);g.beginPath();g.ellipse(0,0,20,26,0,0,7);g.fill()}
  else if(shape==='laurel'){g.fillStyle=metalFill(26);g.beginPath();g.arc(0,0,21,0,7);g.fill()}
  else{g.fillStyle=metalFill(25);g.beginPath();g.arc(0,0,23,0,7);g.fill()}
  g.restore();
  // médaillon central et bordures fines
  const R=shape==='oval'?0:shape==='shield'?0:17;
  if(shape==='round'){g.strokeStyle=M[3];g.globalAlpha=.5;g.lineWidth=.8;g.beginPath();g.arc(0,0,20,0,7);g.stroke();g.globalAlpha=1;
    g.fillStyle=M[2];for(let k=0;k<36;k++){const a=k/36*Math.PI*2;g.beginPath();g.arc(Math.cos(a)*21.6,Math.sin(a)*21.6,.8,0,7);g.fill()}}
  if(shape==='laurel'){for(const sd of[-1,1])for(let k=0;k<9;k++){const a=Math.PI/2+sd*(.35+k*.27),x=Math.cos(a)*24,y=Math.sin(a)*24;g.save();g.translate(x,y);g.rotate(a+sd*1.9);g.fillStyle=k%2?M[1]:M[0];g.beginPath();g.ellipse(0,0,2.2,5,0,0,7);g.fill();g.strokeStyle=M[2];g.lineWidth=.5;g.beginPath();g.moveTo(0,-4.5);g.lineTo(0,4.5);g.stroke();g.restore()}}
  if(shape==='oval'){g.strokeStyle=M[2];g.lineWidth=1;g.setLineDash([1.6,1.4]);g.beginPath();g.ellipse(0,0,17,23,0,0,7);g.stroke();g.setLineDash([])}
  if(shape==='shield'){g.strokeStyle=M[2];g.lineWidth=1;g.beginPath();g.moveTo(-17,-18);g.lineTo(17,-18);g.lineTo(17,0);g.quadraticCurveTo(16,14,0,22);g.quadraticCurveTo(-16,14,-17,0);g.closePath();g.stroke()}
  if(R){const gr=g.createRadialGradient(-5,-6,1,0,0,R);gr.addColorStop(0,M[1]);gr.addColorStop(1,M[2]);g.fillStyle=gr;g.beginPath();g.arc(0,0,R-2,0,7);g.fill();g.strokeStyle=M[0];g.globalAlpha=.6;g.lineWidth=.7;g.beginPath();g.arc(0,0,R-2,Math.PI*1.05,Math.PI*1.75);g.stroke();g.globalAlpha=1}
  // emblème
  g.save();
  if(!on){g.fillStyle='#8a8a92';g.font='bold 18px '+F_DISP;g.textAlign='center';g.fillText('?',0,6);g.restore();return}
  const ink=M[3],hi=M[0];g.strokeStyle=ink;g.fillStyle=ink;g.lineWidth=1.3;
  EMB[id]?EMB[id](g,ink,hi,M):null;
  g.restore();
  // reflet
  g.save();g.globalAlpha=.25;g.fillStyle='#fff';g.beginPath();g.ellipse(-9,-12,7,3,-.7,0,7);g.fill();g.restore();
}
const ACH_GEN={
 straw(g,i){g.strokeStyle='#e0b04e';g.lineWidth=1.3;for(const a of[-.35,-.12,.1,.3]){g.beginPath();g.moveTo(Math.sin(a)*2,10);g.lineTo(Math.sin(a)*14,-11);g.stroke()}g.strokeStyle=i;g.lineWidth=1.6;g.beginPath();g.moveTo(-6,3);g.lineTo(6,3);g.stroke()},
 letter(g,i){g.fillStyle='#efe6d0';g.fillRect(-11,-7,22,14);g.strokeStyle=i;g.lineWidth=.9;g.strokeRect(-11,-7,22,14);g.beginPath();g.moveTo(-11,-7);g.lineTo(0,1);g.lineTo(11,-7);g.stroke()},
 eye(g,i){g.fillStyle='#efe9df';g.beginPath();g.ellipse(0,0,11,6,0,0,7);g.fill();g.strokeStyle=i;g.lineWidth=1.2;g.stroke();g.fillStyle=i;g.beginPath();g.arc(0,0,3.6,0,7);g.fill()},
 ghost(g,i){g.fillStyle='#f0ebe0';g.beginPath();g.moveTo(-8,10);g.quadraticCurveTo(-10,-11,0,-11);g.quadraticCurveTo(10,-11,8,10);for(let k=4;k>=0;k--)g.lineTo(-8+k*4,10-(k%2?3:0));g.closePath();g.fill();g.fillStyle=i;g.beginPath();g.arc(-3,-3,1.5,0,7);g.arc(3,-3,1.5,0,7);g.fill()},
 rat(g,i){g.fillStyle=i;g.beginPath();g.ellipse(0,2,9,5,0,0,7);g.fill();g.beginPath();g.moveTo(8,1);g.lineTo(13,3);g.lineTo(8,5);g.fill();g.beginPath();g.arc(5,-3,2.4,0,7);g.fill();g.strokeStyle=i;g.lineWidth=1.2;g.beginPath();g.moveTo(-9,3);g.quadraticCurveTo(-14,0,-12,-6);g.stroke()},
 cat(g,i){g.fillStyle=i;g.beginPath();g.arc(0,2,8,0,7);g.fill();poly(g,[-7,-2,-6,-11,-2,-6]);g.fill();poly(g,[7,-2,6,-11,2,-6]);g.fill();g.fillStyle='#c8f060';g.beginPath();g.ellipse(-3,1,1.8,1.3,0,0,7);g.ellipse(3,1,1.8,1.3,0,0,7);g.fill()},
 owl(g,i){g.fillStyle=i;g.beginPath();g.ellipse(0,2,8,10,0,0,7);g.fill();poly(g,[-6,-6,-5,-12,-1,-7]);g.fill();poly(g,[6,-6,5,-12,1,-7]);g.fill();g.fillStyle='#ffcc33';g.beginPath();g.arc(-3,-2,2.6,0,7);g.arc(3,-2,2.6,0,7);g.fill()},
 bell(g,i){g.fillStyle=i;g.beginPath();g.moveTo(-9,7);g.quadraticCurveTo(-8,-10,0,-10);g.quadraticCurveTo(8,-10,9,7);g.closePath();g.fill();g.fillRect(-11,7,22,2.5);g.beginPath();g.arc(0,11,2.4,0,7);g.fill()},
 train(g,i){g.fillStyle=i;rr(g,-12,-7,24,13,3);g.fill();g.fillStyle='#efe6d0';g.fillRect(-9,-4,5,4);g.fillRect(-2,-4,5,4);g.fillRect(5,-4,4,4);g.fillStyle=i;g.beginPath();g.arc(-6,8,2.4,0,7);g.arc(6,8,2.4,0,7);g.fill()},
 car(g,i){g.fillStyle=i;rr(g,-12,-2,24,8,2);g.fill();poly(g,[-7,-2,-4,-8,5,-8,8,-2]);g.fill();g.fillStyle='#efe6d0';g.fillRect(-3,-7,6,4);g.fillStyle=i;g.beginPath();g.arc(-7,7,2.6,0,7);g.arc(7,7,2.6,0,7);g.fill()},
 umbrella(g,i){g.fillStyle=i;g.beginPath();g.arc(0,0,12,Math.PI,0);g.closePath();g.fill();g.strokeStyle=i;g.lineWidth=1.6;g.beginPath();g.moveTo(0,0);g.lineTo(0,10);g.arc(-2.5,10,2.5,0,Math.PI);g.stroke()},
 tomb(g,i){g.fillStyle=i;g.beginPath();g.moveTo(-8,11);g.lineTo(-8,-4);g.quadraticCurveTo(0,-14,8,-4);g.lineTo(8,11);g.closePath();g.fill();g.fillStyle='#efe6d0';g.fillRect(-1,-6,2,8);g.fillRect(-4,-3,8,2)},
 cross(g,i){g.fillStyle=i;g.fillRect(-2,-12,4,24);g.fillRect(-9,-6,18,4)},
 heart(g,i){g.fillStyle='#a8322d';g.beginPath();g.moveTo(0,10);g.bezierCurveTo(-14,0,-8,-12,0,-5);g.bezierCurveTo(8,-12,14,0,0,10);g.fill()},
 star(g,i){g.fillStyle=i;g.beginPath();for(let k=0;k<10;k++){const a=-Math.PI/2+k/10*Math.PI*2,r=k%2?4.5:11;g.lineTo(Math.cos(a)*r,Math.sin(a)*r)}g.closePath();g.fill()},
 wing(g,i){g.fillStyle=i;g.beginPath();g.moveTo(9,-2);g.quadraticCurveTo(2,-12,-12,-6);g.quadraticCurveTo(-14,0,-10,4);g.quadraticCurveTo(0,6,9,2);g.closePath();g.fill()},
 key(g,i){g.strokeStyle=i;g.lineWidth=2;g.beginPath();g.arc(-5,0,5,0,7);g.stroke();g.beginPath();g.moveTo(0,0);g.lineTo(12,0);g.moveTo(9,0);g.lineTo(9,4);g.moveTo(12,0);g.lineTo(12,4);g.stroke()},
 nest(g,i){g.fillStyle='#8a6a3a';g.beginPath();g.ellipse(0,4,12,6,0,0,Math.PI);g.fill();g.fillStyle='#efe6d0';for(const x of[-4,0,4]){g.beginPath();g.ellipse(x,2,2.6,3.2,0,0,7);g.fill()}},
 horse(g,i){g.fillStyle=i;g.beginPath();g.ellipse(0,2,9,4.5,0,0,7);g.fill();poly(g,[6,0,11,-8,13,-6,9,2]);g.fill();g.fillRect(-7,5,2,7);g.fillRect(5,5,2,7);g.strokeStyle='#e0b04e';g.lineWidth=1.4;g.beginPath();g.moveTo(0,-12);g.lineTo(0,-2);g.stroke()},
 drum(g,i){g.fillStyle='#a8322d';g.fillRect(-11,-5,22,12);g.fillStyle='#efe6d0';g.beginPath();g.ellipse(0,-5,11,3.4,0,0,7);g.fill();g.strokeStyle=i;g.lineWidth=1;for(let k=-2;k<=2;k++){g.beginPath();g.moveTo(k*5,-2);g.lineTo(k*5+2.5,7);g.stroke()}},
 tent(g,i){g.fillStyle=i;poly(g,[-12,9,0,-10,12,9]);g.fill();g.fillStyle='#efe6d0';poly(g,[-3,9,0,1,3,9]);g.fill()},
 bridge(g,i){g.strokeStyle=i;g.lineWidth=2;g.beginPath();g.moveTo(-13,0);g.lineTo(13,0);g.stroke();g.beginPath();g.arc(-6,8,6,Math.PI,0);g.arc(6,8,6,Math.PI,0);g.stroke()},
 clock(g,i){g.strokeStyle=i;g.lineWidth=1.6;g.beginPath();g.arc(0,0,10,0,7);g.stroke();g.beginPath();g.moveTo(0,0);g.lineTo(0,-7);g.moveTo(0,0);g.lineTo(5,2);g.stroke()},
 cup(g,i){g.fillStyle=i;poly(g,[-8,-4,6,-4,4,8,-6,8]);g.fill();g.strokeStyle=i;g.lineWidth=1.6;g.beginPath();g.arc(7,1,3.4,-1.4,1.4);g.stroke();g.strokeStyle='#efe6d0';g.lineWidth=1;g.beginPath();g.moveTo(-2,-7);g.quadraticCurveTo(0,-10,-2,-13);g.stroke()},
 lantern(g,i){g.fillStyle=i;g.fillRect(-5,-10,10,3);g.fillRect(-6,8,12,3);g.fillStyle='#ffcc55';g.fillRect(-4,-7,8,15);g.strokeStyle=i;g.lineWidth=1;g.strokeRect(-4,-7,8,15)},
 pigeon(g,i,h){g.fillStyle=i;g.beginPath();g.arc(0,-2,7,0,7);g.fill();poly(g,[6,-3,11,-1,6,0]);g.fill();g.fillStyle=h;g.beginPath();g.arc(2,-3,1.5,0,7);g.fill();g.fillStyle=i;g.beginPath();g.ellipse(-2,8,7,4,0,0,7);g.fill()}
};
const txt=t=>(g,i)=>{g.fillStyle=i;g.font='bold '+(t.length>2?8:t.length>1?11:t==='•'?30:18)+'px '+F_DISP;g.textAlign='center';g.textBaseline='middle';g.fillText(t,0,1);g.textBaseline='alphabetic'};
const EMB={
 a1(g,i){g.fillStyle=i;rr(g,-11,-7,22,13,3);g.globalAlpha=.25;g.fill();g.globalAlpha=1;g.strokeStyle=i;rr(g,-11,-7,22,13,3);g.stroke();g.beginPath();g.arc(-8,-4,1.2,0,7);g.fill();g.font='bold 7.5px '+F_DISP;g.textAlign='center';g.fillText('7413',1,2.8)},
 a2(g,i,h){g.fillStyle=i;g.fillRect(-7,-10,12,20);g.fillStyle=h;g.globalAlpha=.8;poly(g,[-7,-10,-1,-8,-1,12,-7,10]);g.fill();g.globalAlpha=1;g.strokeStyle=i;g.beginPath();g.moveTo(2,0);g.lineTo(11,0);g.moveTo(8,-3);g.lineTo(11,0);g.lineTo(8,3);g.stroke()},
 a3(g,i,h){g.fillStyle=i;poly(g,[-10,-2,6,-6,12,0,6,3,-10,2]);g.fill();g.fillStyle=h;g.beginPath();g.arc(-4,-1,1.4,0,7);g.fill();g.strokeStyle=i;g.lineWidth=1.6;g.beginPath();g.moveTo(-2,6);g.lineTo(4,12);g.stroke();g.beginPath();g.arc(5,13,2,0,7);g.fill()},
 a4(g,i,h){g.strokeStyle=i;g.lineWidth=1.4;g.beginPath();g.moveTo(-9,9);g.lineTo(-9,-3);g.arc(0,-3,9,Math.PI,0);g.lineTo(9,9);g.stroke();g.fillRect(-12,9,24,3);g.beginPath();g.moveTo(-3,-11);g.lineTo(0,-5);g.lineTo(-2,-1);g.lineTo(2,4);g.stroke()},
 a5(g){for(let k=0;k<5;k++){const a=k/5*Math.PI*2;g.fillStyle='#c8302a';g.beginPath();g.ellipse(Math.cos(a)*5,Math.sin(a)*5-2,6,4.5,a,0,7);g.fill()}g.fillStyle='#1a1010';g.beginPath();g.arc(0,-2,2.6,0,7);g.fill();g.strokeStyle='#3a5a30';g.lineWidth=1.4;g.beginPath();g.moveTo(0,3);g.quadraticCurveTo(2,9,0,13);g.stroke()},
 a6(g,i,h){g.fillStyle=i;g.fillRect(-11,-2,22,13);poly(g,[-11,-2,-7,-12,-3,-2]);g.fill();poly(g,[3,-2,7,-12,11,-2]);g.fill();poly(g,[-4,-2,0,-8,4,-2]);g.fill();g.fillStyle=h;g.beginPath();g.arc(0,3,3,0,7);g.fill();g.fillRect(-8,4,2,6);g.fillRect(6,4,2,6)},
 a7(g,i,h){g.fillStyle='#1d4f9a';rr(g,-11,-8,22,12,2);g.fill();g.strokeStyle='#f4f2ea';g.lineWidth=.8;rr(g,-10,-7,20,10,1.5);g.stroke();g.fillStyle='#f4f2ea';g.font='bold 7px '+F_DISP;g.textAlign='center';g.fillText('A4',0,-.5);g.fillStyle=i;g.fillRect(-1,4,2,9)},
 a8(g,i,h){g.fillStyle=i;poly(g,[-10,-2,0,-11,10,-2]);g.fill();g.fillRect(-8,-2,16,13);g.fillStyle=h;for(const[x,y]of[[-4,1],[4,1],[0,6]]){g.beginPath();g.arc(x,y,1.8,Math.PI,0);g.fill();g.fillRect(x-1.8,y,3.6,1.5)}},
 a9(g,i,h){g.fillStyle='#efe6d0';g.fillRect(-11,-7,22,14);g.strokeStyle=i;g.lineWidth=.9;g.strokeRect(-11,-7,22,14);g.beginPath();g.moveTo(-11,-7);g.lineTo(0,1);g.lineTo(11,-7);g.stroke();g.fillStyle='#a8322d';g.beginPath();g.arc(0,2,3.6,0,7);g.fill();g.fillStyle='#e07060';g.beginPath();g.arc(-1,1,1,0,7);g.fill()},
 a10(g,i,h){g.fillStyle=i;g.beginPath();g.arc(0,-2,6,0,7);g.fill();poly(g,[5,-3,10,-1,5,0]);g.fill();g.fillStyle=h;g.beginPath();g.arc(2,-3,1.3,0,7);g.fill();for(const sd of[-1,1])for(let k=0;k<4;k++){g.save();g.translate(sd*(7+k*.5),7-k*4);g.rotate(sd*(.6+k*.2));g.fillStyle=i;g.beginPath();g.ellipse(0,0,1.6,3.6,0,0,7);g.fill();g.restore()}},
 a11(g,i,h){g.strokeStyle='#e0b04e';g.lineWidth=1.6;g.beginPath();g.moveTo(-1,10);g.quadraticCurveTo(0,0,3,-10);g.stroke();g.strokeStyle=i;g.lineWidth=1.2;g.beginPath();g.arc(0,0,11,0,7);g.stroke();g.fillStyle=i;for(let k=0;k<5;k++){const a=-Math.PI/2+k/5*Math.PI*2;g.beginPath();g.arc(Math.cos(a)*11,Math.sin(a)*11,1.2,0,7);g.fill()}},
 a12(g,i){g.strokeStyle=i;g.lineWidth=2;g.beginPath();g.moveTo(-11,4);g.lineTo(10,-4);g.stroke();g.beginPath();g.moveTo(5,-7);g.lineTo(11,-4);g.lineTo(7,1);g.stroke();for(const x of[-8,-3,2])g.fillRect(x,6,2,2)},
 a13(g,i){g.fillStyle='#efe6d0';g.beginPath();g.moveTo(-12,-5);g.quadraticCurveTo(0,-2,12,-5);g.lineTo(12,4);g.quadraticCurveTo(0,7,-12,4);g.closePath();g.fill();g.fillStyle=i;g.font='bold 8px '+F_DISP;g.textAlign='center';g.fillText('110',0,3)},
 a15(g,i,h){g.fillStyle='#8a6a4a';poly(g,[-6,4,6,4,4,12,-4,12]);g.fill();for(let k=-2;k<=2;k++){g.fillStyle=['#d9a441','#efe6d0','#c8302a'][(k+2)%3];g.beginPath();g.arc(k*3.5,-1-Math.abs(k)*1.5,3,0,7);g.fill()}g.fillStyle='#efe6d0';poly(g,[-5,12,5,12,6,14,-6,14]);g.fill()},
 a17(g,i,h){g.fillStyle='#efe6d0';poly(g,[-12,-7,0,-5,0,9,-12,7]);g.fill();poly(g,[12,-7,0,-5,0,9,12,7]);g.fill();g.strokeStyle=i;g.lineWidth=.7;for(let k=0;k<3;k++){g.beginPath();g.moveTo(-10,-3+k*3);g.lineTo(-2,-2+k*3);g.moveTo(2,-2+k*3);g.lineTo(10,-3+k*3);g.stroke()}g.fillStyle=i;g.font='bold 5px '+F_DISP;g.textAlign='center';g.fillText('4 bis',-6,8)},
 a24(g,i,h){g.strokeStyle=h;g.lineWidth=1.6;g.beginPath();g.moveTo(-9,9);g.lineTo(8,-9);g.stroke();g.fillStyle=i;g.beginPath();g.ellipse(7,-8,1.6,2.6,.8,0,7);g.fill();g.strokeStyle='#c86a8a';g.lineWidth=1;g.beginPath();g.moveTo(7,-8);g.bezierCurveTo(14,0,-2,4,4,12);g.stroke()},
 a26(g){for(let k=0;k<5;k++){const a=Math.PI+.35+k*(Math.PI-.7)/4,x=Math.cos(a)*9,y=Math.sin(a)*9+5;g.fillStyle=['#a8322d','#2a3f6a','#c9a24a','#4f7a5a','#6a3a6a'][k];g.fillRect(x-1.5,y-8,3,4);g.fillStyle='#d6ad52';g.beginPath();g.arc(x,y,2.8,0,7);g.fill()}},
 a30(g,i,h){g.strokeStyle=i;g.lineWidth=2;g.beginPath();g.arc(-2,-2,7,0,7);g.stroke();g.lineWidth=3;g.beginPath();g.moveTo(3,3);g.lineTo(10,10);g.stroke();g.fillStyle='#e0b04e';g.beginPath();g.arc(-2,-2,3,0,7);g.fill()},
 a35(g,i){g.fillStyle=i;g.beginPath();for(let k=0;k<10;k++){const a=-Math.PI/2+k/10*Math.PI*2,r=k%2?4:10;g.lineTo(Math.cos(a)*r,Math.sin(a)*r)}g.closePath();g.fill()},
 a49(g,i,h){g.fillStyle=i;g.beginPath();g.arc(0,0,8,0,7);g.fill();g.strokeStyle=h;g.lineWidth=.9;g.beginPath();g.moveTo(-9,3);g.lineTo(9,-2);g.stroke();for(let k=-3;k<=3;k++){g.beginPath();g.moveTo(k*2.6,-2+k*-.3+1.5);g.lineTo(k*2.6+1,2-k*.3+1.5);g.stroke()}g.fillStyle=h;g.beginPath();g.arc(3,-3,1.4,0,7);g.fill()},
 a50(g,i){g.strokeStyle=i;g.lineWidth=1.8;g.beginPath();g.arc(0,0,9,.3,Math.PI*1.8);g.stroke();poly(g,[7,-8,11,-4,6,-3]);g.fill()},
 a53(g,i){g.fillStyle='#f0ebe0';g.beginPath();g.moveTo(-9,11);g.quadraticCurveTo(-11,-12,0,-12);g.quadraticCurveTo(11,-12,9,11);for(let k=4;k>=0;k--)g.lineTo(-9+k*4.5,11-(k%2?2:0));g.closePath();g.fill();g.fillStyle=i;g.beginPath();g.arc(-3,-4,1.4,0,7);g.arc(3,-4,1.4,0,7);g.fill();g.fillStyle='rgba(255,230,150,.9)';g.beginPath();g.arc(7,2,2,0,7);g.fill()},
 a54(g,i){g.fillStyle='#1e1c22';g.beginPath();g.arc(0,1,8,0,7);g.fill();poly(g,[-7,-3,-6,-11,-2,-6]);g.fill();poly(g,[7,-3,6,-11,2,-6]);g.fill();g.fillStyle='#c8f060';g.beginPath();g.ellipse(-3,0,1.8,1.3,0,0,7);g.ellipse(3,0,1.8,1.3,0,0,7);g.fill();g.fillStyle='#f0ebe0';g.beginPath();g.moveTo(-10,9);g.quadraticCurveTo(0,3,10,9);g.lineTo(10,12);g.lineTo(-10,12);g.closePath();g.fill()},
 a56(g,i,h){g.strokeStyle='#8a6a3a';g.lineWidth=1.6;g.beginPath();g.moveTo(-10,11);g.lineTo(-2,0);g.stroke();g.strokeStyle=i;g.lineWidth=1;g.beginPath();g.ellipse(2,-5,6,5,-.6,0,7);g.stroke();g.fillStyle='#c45a2a';g.beginPath();g.ellipse(7,-10,2.6,1.8,-.5,0,7);g.ellipse(10,-8,2.6,1.8,.5,0,7);g.fill()},
 c1(g,i,h){g.strokeStyle=i;g.lineWidth=1.4;g.beginPath();g.arc(0,-6,4,0,7);g.stroke();for(const[a,l]of[[-.5,12],[0,14],[.5,11]]){g.save();g.translate(0,-3);g.rotate(a);g.beginPath();g.moveTo(0,0);g.lineTo(0,l);g.stroke();g.fillRect(0,l-3,3,1.4);g.fillRect(0,l-1,2,1.4);g.restore()}},
 a68(g,i,h){g.fillStyle=i;g.beginPath();g.moveTo(8,-2);g.quadraticCurveTo(2,-12,-12,-6);g.quadraticCurveTo(-14,0,-10,4);g.quadraticCurveTo(0,6,8,2);g.closePath();g.fill();g.strokeStyle=h;g.lineWidth=.8;g.setLineDash([1.6,1.4]);g.beginPath();g.moveTo(7,1);g.quadraticCurveTo(-2,4,-10,2);g.stroke();g.setLineDash([]);g.strokeStyle='#e0b04e';for(let k=0;k<3;k++){g.beginPath();g.moveTo(-2+k*3,4);g.lineTo(-3+k*3,9+k);g.stroke()}},
 a81(g,i,h){g.fillStyle='#efe9df';g.beginPath();g.ellipse(-5,0,5,3.5,0,0,7);g.fill();g.fillStyle='#d97a2a';g.beginPath();g.arc(-5,0,2.6,0,7);g.fill();g.fillStyle='#111';g.beginPath();g.arc(-4.5,-.4,1.2,0,7);g.fill();g.strokeStyle=i;g.lineWidth=1.4;g.beginPath();g.moveTo(2,0);g.quadraticCurveTo(6,3,10,0);g.stroke()},
 a90(g,i){g.fillStyle='#f0ebe0';g.beginPath();g.moveTo(-10,10);g.quadraticCurveTo(-12,-12,0,-12);g.quadraticCurveTo(12,-12,10,10);g.closePath();g.fill();g.fillStyle='#2a2420';g.fillRect(-10,4,20,7);g.fillStyle=i;g.beginPath();g.arc(-4,-3,1.6,0,7);g.arc(4,-3,1.6,0,7);g.fill();g.fillStyle='#e05a6a';g.beginPath();g.ellipse(0,3,2.4,3.6,0,0,7);g.fill()},
 a82(g,i,h){g.fillStyle=h;g.beginPath();g.arc(-2,1,8,0,7);g.arc(1,-2,7,0,7,true);g.fill('evenodd');g.fillStyle=i;g.font='italic bold 6px '+F_BODY;g.textAlign='left';g.fillText('z',3,-3);g.font='italic bold 4.5px '+F_BODY;g.fillText('z',7,-7)},
 n07:ACH_GEN.eye,
 n11:txt('•'),
 n21:ACH_GEN.tent,
 n23:ACH_GEN.cat,
 n25:txt('Z'),
 n33:ACH_GEN.ghost,
 n38:ACH_GEN.straw,
 n47:ACH_GEN.rat,
 r06:ACH_GEN.train,
 r10:ACH_GEN.drum,
 r14:ACH_GEN.star,
 r16:ACH_GEN.pigeon,
 r17:ACH_GEN.cat,
 r18:txt('↑'),
 a70:ACH_GEN.train,
 a71:ACH_GEN.pigeon,
 a72:ACH_GEN.eye,
 a76:ACH_GEN.clock,

 // Frères d'armes : trois pigeons devant une flamme
 a73(g,i,h){g.fillStyle='#d8682a';g.beginPath();g.moveTo(0,12);g.quadraticCurveTo(-12,6,-6,-6);g.quadraticCurveTo(-4,0,-1,-2);g.quadraticCurveTo(-3,-10,2,-14);g.quadraticCurveTo(1,-6,6,-4);g.quadraticCurveTo(11,4,0,12);g.fill();
   g.fillStyle='#f4c860';g.beginPath();g.moveTo(0,10);g.quadraticCurveTo(-6,5,-2,-1);g.quadraticCurveTo(0,3,2,1);g.quadraticCurveTo(5,5,0,10);g.fill();
   for(const[x,y,c]of[[-7,6,i],[7,6,i],[0,8,'#f4f2ea']]){g.fillStyle=c;g.beginPath();g.ellipse(x,y,4,2.4,0,0,7);g.fill();g.beginPath();g.arc(x+3,y-2,1.8,0,7);g.fill()}},
 // Scheisse : le casque à pointe, et ce qui lui tombe dessus
 a74(g,i,h){g.fillStyle=i;g.beginPath();g.moveTo(-11,6);g.quadraticCurveTo(-11,-6,0,-7);g.quadraticCurveTo(11,-6,11,6);g.closePath();g.fill();g.fillRect(-13,5,26,2.5);g.beginPath();g.moveTo(-2,-7);g.lineTo(0,-14);g.lineTo(2,-7);g.fill();
   g.fillStyle='#f4f2ea';g.beginPath();g.moveTo(-6,-3);g.quadraticCurveTo(-3,-9,1,-5);g.quadraticCurveTo(5,-8,6,-2);g.quadraticCurveTo(7,2,4,1);g.lineTo(3,5);g.lineTo(1,1);g.quadraticCurveTo(-3,3,-6,-3);g.fill()},
 // Planqué : le placard entrouvert, un œil dans l'ombre
 a75(g,i,h){g.fillStyle=i;rr(g,-9,-12,18,24,2);g.fill();g.fillStyle=h;g.fillRect(-7,-10,6,20);g.fillStyle='#1a1410';g.fillRect(-1,-10,8,20);g.fillStyle=i;g.fillRect(3,-10,4,20);
   g.fillStyle='#efe9df';g.beginPath();g.ellipse(1.5,-1,2.2,1.4,0,0,7);g.fill();g.fillStyle='#d97a2a';g.beginPath();g.arc(1.8,-1,.9,0,7);g.fill();g.fillStyle=h;g.beginPath();g.arc(-3,0,1,0,7);g.fill()},

};
/* bandeau « succès débloqué » */
function renderToasts(dt){
  const q=G.toasts;if(!q||!q.length)return;const T0=q[0];T0.t+=dt;const a=ACH_BY[T0.id];
  // les succès montent du bas de l'écran, sous la ligne de jeu
  const k=Math.min(1,T0.t*4,(4-T0.t)*3),y=H-52+(1-k)*64,cx=W/2;
  ctx.save();ctx.globalAlpha=Math.max(0,k);ctx.font='15px '+F_DISP;const tw=Math.max(150,ctx.measureText(a.t).width)+70,x0=cx-tw/2;
  ctx.fillStyle='rgba(14,12,18,.9)';rr(ctx,x0,y,tw,40,8);ctx.fill();ctx.strokeStyle='rgba(201,162,74,.6)';ctx.lineWidth=1.2;rr(ctx,x0,y,tw,40,8);ctx.stroke();
  ctx.save();ctx.beginPath();ctx.rect(x0,y,tw,40);ctx.clip();drawAchMedal(ctx,x0+24,y+26,T0.id,true,.55);ctx.restore();
  ctx.textAlign='left';ctx.fillStyle='#d9a441';ctx.font='10px '+F_DISP;ctx.fillText('SUCCÈS',x0+48,y+15);
  ctx.fillStyle='#efe5cc';ctx.font='15px '+F_DISP;ctx.fillText(a.t,x0+48,y+32);
  ctx.restore();
  if(T0.t>4)q.shift();
}
/* écran des succès (depuis l'accueil, seulement si au moins un est débloqué) : molette pour défiler, survol pour un indice */
function openAch(){G.state='ach';G.fade=1;G.achY=0;G.achSel=0}
function achMaxY(){return Math.max(0,Math.ceil(ACH.length/2)*96+96-H+30)}
function handleAch(){
  const back=()=>{if(G.achFrom==='pause'){G.achFrom=null;G.state='pause';G.fade=0}else goTitle()};
  if(pressed.has('esc')||pressed.has('back')||(!pad()&&pressed.has('ok'))){back();return}
  if(pad()){/*v2*/ // à la manette : on choisit une fiche (elle s'éclaire et montre son indice), le défilement suit
    let s=G.achSel||0;const n=ACH.length;
    if(pressed.has('down'))s=Math.min(n-1,s+2);if(pressed.has('up'))s=Math.max(0,s-2);if(pressed.has('right')&&s%2===0&&s+1<n)s++;if(pressed.has('left')&&s%2===1)s--;
    G.achSel=s;const yy=86+Math.floor(s/2)*96-(G.achY||0);if(yy<80)G.achY=(G.achY||0)-(80-yy);if(yy+96>H-40)G.achY=(G.achY||0)+(yy+96-(H-40))}
  else{if(pressed.has('down'))G.achY=(G.achY||0)+84;if(pressed.has('up'))G.achY=(G.achY||0)-84}
  if(G.wheel){G.achY=(G.achY||0)+G.wheel;G.wheel=0}
  G.achY=clamp(G.achY||0,0,achMaxY());
  if(G.click){if(G.click.y>H-34||G.click.y<70)back();else G.achTap=G.click}
}
/* description d'un succès : retour à la ligne dans la case (2 lignes, police réduite si besoin) */
/* largeur prudente : selon le navigateur et le chargement des polices, measureText peut sous-estimer ; on prend aussi une estimation par caractère */
function achW(t,fs){return Math.max(ctx.measureText(t).width,t.length*fs*.41)}
function achWrap(text,maxW,fs){const out=[];let line='';for(const w of text.split(/[ \u00a0]+/)){const t=line?line+' '+w:w;if(achW(t,fs)>maxW&&line){out.push(line);line=w}else line=t}out.push(line);return out}
function achDesc(text,x,y,maxW){let fs=14,lines;
  for(;fs>=12;fs-=.5){ctx.font='italic '+fs+'px '+F_BODY;lines=achWrap(text,maxW,fs);if(lines.length<=2)break}
  if(lines.length>2){fs=11.5;ctx.font='italic 11.5px '+F_BODY;lines=achWrap(text,maxW,fs).slice(0,3)}   // texte long : trois lignes, sous un titre remonté
  const lh=fs+2.5,y0=lines.length>2?y-10:lines.length>1?y-lh/2+4:y;lines.forEach((l,k)=>ctx.fillText(l,x,y0+k*lh))}
function renderAch(t){
  ensureTitleLv();const prev=L;L=titleLv;renderWorld(titleLv,200,60,t,{noEntities:true});L=prev;
  ctx.fillStyle='rgba(12,10,16,.9)';ctx.fillRect(0,0,W,H);
  const st=achState(),n=ACH.filter(a=>st[a[0]]).length;
  ctx.save();ctx.beginPath();ctx.rect(0,74,W,H-110);ctx.clip();
  const cw=440,rh=96,x0=W/2-cw-6,y0=86-(G.achY||0),ms=G.mouse||{x:-1,y:-1};let tip=null;
  ACH.forEach((a,i)=>{const on=!!st[a[0]],c=i%2,r=Math.floor(i/2),x=x0+c*(cw+12),y=y0+r*rh;if(y<-rh||y>H)return;
    const hov=(pad()&&G.achSel===i)||ms.x>x&&ms.x<x+cw&&ms.y>y&&ms.y<y+rh-8&&ms.y>74&&ms.y<H-36,tap=G.achTap&&G.achTap.x>x&&G.achTap.x<x+cw&&G.achTap.y>y&&G.achTap.y<y+rh-8;
    ctx.fillStyle=on?(hov?'rgba(233,223,199,.11)':'rgba(233,223,199,.07)'):(hov?'rgba(233,223,199,.06)':'rgba(233,223,199,.025)');rr(ctx,x,y,cw,rh-8,8);ctx.fill();
    ctx.save();rr(ctx,x,y,cw,rh-8,8);ctx.clip();drawAchMedal(ctx,x+36,y+40,a[0],on,1.15);
    ctx.textAlign='left';ctx.fillStyle=on?'#efe5cc':'rgba(233,223,199,.45)';ctx.font='17px '+F_DISP;ctx.font='italic 14px '+F_BODY;const long=on&&achWrap(a[3],cw-74-16,12).length>2;ctx.font='17px '+F_DISP;ctx.fillText(on?a[2]:'Décoration secrète',x+74,y+(long?24:30));
    ctx.fillStyle=on?'rgba(233,223,199,.72)':'rgba(233,223,199,.32)';achDesc(on?padTxt(a[3]):(hov||tap?'':(pad()?/*v2*/'Choisir pour un indice':'Survoler pour un indice')),x+74,y+52,cw-74-16);
    const pr=ACH_PROG[a[0]];if(pr){let[d,n]=pr();if(on)d=n;d=Math.min(d,n);const k=n?d/n:0,bx=x+74,bw=cw-74-70,by=y+rh-17;
      ctx.fillStyle='rgba(233,223,199,.14)';rr(ctx,bx,by,bw,6,3);ctx.fill();if(k>0){ctx.fillStyle=on?'#d9a441':'rgba(217,164,65,.75)';rr(ctx,bx,by,Math.max(6,bw*k),6,3);ctx.fill()}
      ctx.textAlign='right';ctx.font='12px '+F_DISP;ctx.fillStyle=on?'#d9a441':'rgba(233,223,199,.6)';ctx.fillText(Math.floor(k*100)+' %',x+cw-14,by+7)}
    ctx.restore();if(!on&&(hov||tap))tip={x:x+74,y:y+52,w:cw-74-16,t:ACH_HINT[a[0]]||'…'}});
  if(tip){ctx.fillStyle='#d9a441';ctx.textAlign='left';achDesc('Indice : '+tip.t,tip.x,tip.y,tip.w)}
  ctx.restore();
  ctx.save();ctx.textAlign='center';ctx.fillStyle='#efe5cc';ctx.font='30px '+F_DISP;ctx.fillText('Décorations de Raymond',W/2,40);
  ctx.font='italic 15px '+F_BODY;ctx.fillStyle='rgba(233,223,199,.6)';ctx.fillText(`${n} sur ${ACH.length}`,W/2,62);
  const my=achMaxY();if(my>0){const k=(G.achY||0)/my;ctx.fillStyle='rgba(233,223,199,.15)';rr(ctx,W-14,80,4,H-120,2);ctx.fill();ctx.fillStyle='rgba(217,164,65,.7)';rr(ctx,W-14,80+(H-160)*k,4,40,2);ctx.fill()}
  ctx.font='italic 14px '+F_BODY;ctx.fillStyle='rgba(233,223,199,.5)';ctx.fillText(pad()?/*v2*/'stick ou croix pour choisir · B pour revenir':'molette ou ↑ ↓ pour défiler · Échap pour revenir',W/2,H-12);
  ctx.restore();
}
