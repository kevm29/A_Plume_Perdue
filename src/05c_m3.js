/* ------------------------------ MISSION 3 · LE CAP CÉLESTE ------------------------------ */
/* 3-1 · Le train : Raymond, trop las pour voler jusqu'au clocher, se pose sur le toit d'un train qui file vers lui.
   Sept voitures (de la queue vers la motrice) : toits 1-2 sous les pylônes, voiture 3 (voyageurs, en coupe),
   voiture 4 (voiture-bar), toits 5-6 (pylônes, un rat, une passerelle), motrice 7 qui entre en gare.
   Mécaniques et décor : 11i_train.js */
LEVELS.push((()=>{
  const RR=17,ROOF=7,FLOOR=12;
  // A1-A4 : toits ; S : voyageurs (en coupe) ; B : voiture-bar ; B1-B4 : toits ; M : motrice
  const spec=[['ext',30],['ext',30],['ext',30],['ext',30],['seats',32],['bar',32],['ext',30],['ext',30],['ext',30],['ext',30],['loco',30]];
  const wagons=[];{let c=1;spec.forEach(([k,n],i)=>{wagons.push({c0:c,c1:c+n-1,k,n:i+1});c+=n+2})}
  const RW=wagons[wagons.length-1].c1+2;   // la dernière colonne est un mur : on ne tombe pas devant la motrice
  const g=Array.from({length:RR},()=>Array(RW).fill('.'));
  const put=(c,r,ch)=>{g[r][c]=ch};
  const run=(c0,c1,r,ch)=>{for(let c=c0;c<=c1;c++)g[r][c]=ch};
  const corn=(...cs)=>{for(const[c,r]of cs)g[r][c]='o'};
  for(const w of wagons){
    if(w.k==='ext'||w.k==='loco'){for(let r=ROOF;r<=FLOOR;r++)run(w.c0,w.k==='loco'?w.c1-2:w.c1,r,'#');if(w.k==='loco')for(let r=ROOF+1;r<=FLOOR;r++)run(w.c1-1,w.c1,r,'#')}
    else{run(w.c0,w.c1,ROOF,'#');run(w.c0,w.c1,FLOOR,'#');put(w.c0,ROOF+1,'#');put(w.c1,ROOF+1,'#')}
  }
  const S=wagons[4],B=wagons[5],B1=wagons[6],M=wagons[10];
  // soufflet fermé entre les voyageurs et le bar ; porte automatique (D)
  run(S.c1+1,S.c1+2,ROOF,'#');run(S.c1+1,S.c1+2,ROOF+1,'#');run(S.c1+1,S.c1+2,FLOOR,'#');for(let r=9;r<=11;r++)put(S.c1,r,'D');
  const cnt=[B.c0+14,B.c0+25];for(let r=10;r<=11;r++)run(cnt[0],cnt[1],r,'#');
  run(S.c0,B.c1,ROOF-1,'^');                                    // ligne haute tension (pantographe)
  run(S.c0-2,S.c0-1,FLOOR,'t');run(B.c1+1,B.c1+2,FLOOR,'t');for(let r=8;r<=11;r++)put(B.c1+2,r,'t');   // attelages, échelle
  for(const w of wagons)if(w.k==='ext')for(const d of[11,12,21])put(w.c0+d+(w.n%2)*3,ROOF-1,'X');
  // rats et corbeaux
  // les rats courent entre deux climatiseurs, loin des cartels
  for(const[c,a,b]of[[wagons[1].c0+16,wagons[1].c0+13,wagons[1].c0+20],[wagons[3].c0+16,wagons[3].c0+13,wagons[3].c0+20],[B1.c0+19,B1.c0+16,B1.c0+23],[wagons[8].c0+19,wagons[8].c0+16,wagons[8].c0+23]]){put(c,ROOF-1,'k');put(a,ROOF-1,'|');put(b,ROOF-1,'|')}
  for(const[c,r]of[[24,3],[70,2],[104,4],[B1.c0+8,3],[wagons[7].c0+20,2],[wagons[9].c0+6,4]])put(c,r,'m');
  for(const w of wagons){if(w.k==='ext'||w.k==='loco')corn([w.c0+7,5],[w.c0+16,4],[w.c0+26,5])}
  corn([S.c0-1,11],[S.c0+7,11],[S.c0+15,10],[S.c0+23,11],[S.c1+1,11],[B.c0+5,10],[B.c0+19,9],[B.c1-3,11]);
  // cartels des toits : juste avant un climatiseur, à l'abri des rafales (loin du bord arrière)
  for(const[c,r]of[[wagons[1].c0+10,6],[wagons[3].c0+10,6],[S.c0+2,11],[B.c0+2,11],[B1.c0+13,6],[wagons[8].c0+13,6],[M.c0+6,6]])put(c,r,'C');
  put(4,6,'S');put(M.c1,7,'E');
  put(wagons[3].c1-5,6,'q');put(S.c0+5,11,'q');put(B.c0+1,11,'q');put(B1.c0+4,6,'q');
  return {w:2,name:"Le train",theme:'train',exit:'train',seed:79,rows:RR,camY:.55,
    gust:{period:5.3,dur:1.1,push:250,dir:-1},
    train:{wagons,seats:['old','empty','phone','sleep','bagblue','paper','empty','student','bagred','suit','sleep','phone','empty','knit'],
      bottles:[S.c0+6.5,S.c0+15.5,S.c0+25.2],door:S.c1,counter:cnt,chips:cnt[0]+5.5},
    start:"Je ne volerai jamais jusque là-bas d'une traite. Ce train file vers le clocher : je monte dessus.",
    hints:[],
    quips:["Je n'en peux plus. C'est trop dangereux, là-haut : je descends entre les wagons.",
           "Des voyageurs. Chacun regarde sa petite plaque lumineuse et personne ne se parle. Ils doivent être en deuil.",
           "« Interdit aux animaux. » Je suis un militaire, moi.",
           "Revoilà les pylônes. Et un rat clandestin. On voyage en bonne compagnie."],
    segs:[{z:'train',s:'\n'+g.map(r=>r.join('')).join('\n')}]};
})());
/* 3-2 · La gare : le quai sous la verrière (camionnette de vidange, fourgonnette lancée à toute allure, rats),
   la file devant la sandwicherie, les toits de la boutique, du kiosque et du buffet (pics, corbeaux) ;
   le parvis (voyageurs à valises), le cours de la Gare (un camion, une voiture), le square Colbert
   (sa statue, ses pigeons de ville) — mécaniques et décor : 11j_gare.js */
LEVELS.push((()=>{
  const RW=252,RR=15,G0=12;
  const g=Array.from({length:RR},()=>Array(RW).fill('.'));
  for(let c=0;c<RW;c++)for(let r=G0;r<RR;r++)g[r][c]='#';
  const put=(c,r,ch)=>{g[r][c]=ch};
  const box=(c0,c1,r0,r1,ch)=>{for(let c=c0;c<=c1;c++)for(let r=r0;r<=r1;r++)g[r][c]=ch};
  const corn=(...cs)=>{for(const[c,r]of cs)g[r][c]='o'};
  /* --- le quai --- */
  put(3,11,'S');put(8,11,'k');put(5,11,'|');put(13,11,'|');
  box(20,24,10,11,'X');                                  // la camionnette de vidange
  put(16,11,'C');   // à l'abri derrière la camionnette : la fourgonnette ne vient pas jusque-là
  box(40,41,10,11,'X');box(56,57,10,11,'X');box(70,71,10,11,'X');   // chariots à bagages : on s'y réfugie
  for(let c=53;c<=61;c++)put(c,6,'=');put(54,5,'^');put(55,5,'^');put(59,5,'^');put(60,5,'^');put(57,3,'v');   // une poutre de la verrière, ses pics anti-pigeons, le nid au milieu
  put(63,11,'k');put(60,11,'|');put(68,11,'|');
  corn([22,8],[33,10],[41,8],[49,10],[57,8],[65,10],[71,8],[76,10]);
  put(79,11,'C');   // après la zone de la fourgonnette
  /* --- la file, la sandwicherie, le kiosque, le buffet --- */
  put(81,11,'X');put(84,11,'X');box(86,86,10,11,'X');
  box(88,94,8,11,'X');put(90,7,'^');put(91,7,'^');put(93,5,'v');
  box(97,101,7,11,'X');put(99,6,'^');put(101,4,'v');
  put(103,11,'k');
  put(103,9,'A');put(104,9,'A');
  box(105,112,6,11,'X');put(108,5,'^');put(110,5,'^');put(111,2,'v');
  for(let c=114;c<=115;c++)put(c,10,'=');
  put(93,4,'m');put(113,5,'m');
  corn([82,9],[86,8],[92,6],[96,9],[99,4],[102,10],[104,6],[107,4],[111,4],[115,8]);
  put(104,2,'*');
  /* --- le parvis, la route, le square --- */
  put(123,11,'C');box(133,133,11,11,'X');box(148,148,11,11,'X');
  corn([128,10],[133,8],[140,9],[148,8],[155,10],[162,8],[167,7],[172,8]);
  put(181,11,'C');
  // la statue de Colbert : marches, socle, piédestal, la statue (on peut se percher sur sa tête)
  box(201,213,11,11,'X');box(202,212,10,10,'X');box(204,210,9,9,'X');box(205,209,7,8,'X');box(206,208,6,6,'X');box(207,207,3,5,'X');
  corn([186,9],[193,10],[204,7],[207,2],[217,9],[226,10],[233,9]);
  box(238,239,11,11,'X');box(243,243,11,11,'X');
  put(247,11,'E');
  for(const[c,r]of[[18,11],[80,11],[121,11],[157,11],[183,11],[200,11]])put(c,r,'q');
  const zones=[['quai',0,116],['hall',117,121],['parvis',122,158],['route',159,178],['parc',179,RW-1]];
  return {w:2,name:"La gare",theme:'gare',exit:'post',exitLabel:"PLACE D'ERLON",seed:83,rows:RR,
    zoneTh:{quai:{type:'platform',floor:'#7a746a',floorTop:'#a8a090',x:'none'},hall:{type:'stone',floor:'#8a8478',floorTop:'#b8b0a2'},
      parvis:{type:'stone',floor:'#9a9284',floorTop:'#cfc6b2',x:'none'},route:{type:'asphalt',floor:'#6a6c72',floorTop:'#7a7c82'},parc:{type:'earth',floor:'#5c4630',floorTop:'#6c9a38',x:'none'}},
    zoneProps:{quai:['bench','clockPost','vending','bench'],hall:[],parvis:['lampPost','binPark'],route:[],parc:['flowerbed','binPark','lampPost']},
    nestAt:[57,5],
    gare:{camion:[20,24],cart:[[40,41],[56,57],[70,71]],shop:[88,94],kiosk:[97,101],resto:[105,112],queue:[80,87],vanZone:[25,78],
      road:[159,178],park:[179,246],statue:207,
      pigeons:[{k:'gros',a:185,b:195},{k:'gros',a:217,b:230},{k:'deplume',c:191},{k:'deplume',c:228},{k:'moignon',c:188},{k:'moignon',c:222}]},
    start:"Une gare. Le clocher ne doit plus être bien loin. Je finis à pattes : je n'ai plus de souffle.",
    hints:[],
    quips:["Une voiture qui pompe le… Non. Je ne veux pas savoir ce qu'elle pompe.",
           "Une file d'attente pour du pain. Comme à l'arrière, chez nous. Partout la même guerre.",
           "Dehors. Des voyageurs qui tirent leurs malles sur des roulettes. Les malles ont des roues, maintenant.",
           "Des automobiles, des camions… et pas un seul cheval. Où sont passés les chevaux ?",
           "Un square. Et des pigeons… Quelle allure ! Ils ont fait la guerre, eux aussi ?",
           "Un monsieur en bronze, avec une perruque. Il a l'air de quelqu'un qui compte tout."],
    segs:zones.map(([z,a,b])=>({z,s:'\n'+g.map(r=>r.slice(a,b+1).join('')).join('\n')}))};
})());
/* 3-3 · Le cours Langlet : de l'immeuble à rotonde jusqu'au flanc de la cathédrale, façade après façade
   (d'après les relevés du cours Jean-Baptiste-Langlet, rue du Trésor, rue Guillaume-de-Machault) — 11k_langlet.js */
LEVELS.push((()=>{
  const RW=330,RR=21,G0=19;
  const g=Array.from({length:RR},()=>Array(RW).fill('.'));
  for(let c=0;c<RW;c++)for(let r=G0;r<RR;r++)g[r][c]='#';
  const put=(c,r,ch)=>{g[r][c]=ch};
  const run=(c0,c1,r,ch)=>{for(let c=c0;c<=c1;c++)if(g[r][c]==='.')g[r][c]=ch};
  const corn=(...cs)=>{for(const[c,r]of cs)g[r][c]='o'};
  const BR=k=>16-(k-1)*2;   // ligne d'un balcon posé au plancher de l'étage k
  const F=[
    {k:'rotonde',c0:4,c1:22},
    {k:'hotel',c0:22,c1:46},
    {k:'rue',c0:46,c1:52,dome:true,stop:true,endCol:'#cfc3aa',lcol:'#c8a890',rcol:'#b85a3e'},
    {c0:52,c1:62,mat:'brick',n:4,wn:3,bal:[2],dormers:3,chim:[30,330],gf:[{t:'door',x:20,w:44,col:'#3a4a5a'},{t:'win',x:90,w:60},{t:'win',x:200,w:60},{t:'win',x:300,w:60}]},
    {c0:62,c1:78,col:'#e6dcc4',n:4,wn:5,bal:[2,4],bay:[260,380],bayDome:true,dormers:3,chim:[40,110,520,590],dstyle:'pediment',lintel:'#d8ccb0',key:1,gf:[{t:'arch',x:20,w:60,col:'#5a3a22'},{t:'win',x:120,w:60},{t:'win',x:440,w:60},{t:'arch',x:540,w:60,col:'#3a2a1a'}]},
    {c0:78,c1:89,col:'#ddd0b4',n:5,wn:4,bal:[2,5],dormers:3,chim:[80,360],rails:1,lintel:'#cfc3aa',gf:[{t:'arch',x:20,w:56,col:'#2a2c30',glass:1},{t:'win',x:120,w:60},{t:'win',x:220,w:60},{t:'door',x:330,w:50}]},
    {k:'gothique',c0:89,c1:95},
    {c0:95,c1:106,col:'#ece6d6',n:4,wn:3,pil:[110,290],bal:[2,3],dormers:3,dstyle:'oeil',chim:[200],gf:[{t:'door',x:60,w:46,col:'#7a3a22',ped:1},{t:'win',x:160,w:60},{t:'shop',x:250,w:180,col:'#2a2a2e',label:'CAFÉ DU COURS'}]},
    {c0:106,c1:116,col:'#e2d8c2',n:4,wn:3,dormers:2,chim:[60,170,300],rails:1,gf:[{t:'shop',x:10,w:200,col:'#5a2a3a',label:'BOUTIQUE'},{t:'door',x:270,w:50}]},
    {c0:116,c1:122,mat:'brick',n:3,wn:2,mans:false,flatRoof:1,gf:[{t:'shop',x:6,w:228,col:'#1e1e22',label:'SALLE DE SPORT'}]},
    {k:'rue',c0:122,c1:129,cobble:true,endCol:'#d8ccb0',lcol:'#b85a3e',rcol:'#d98a4a'},
    {c0:129,c1:152,mat:'orange',n:4,wn:9,bal:[1,4],dormers:6,dstyle:'round',chim:[60,300,600,860],gf:[{t:'arch',x:30,w:80,col:'#2a2c30',glass:1},{t:'arch',x:160,w:80,col:'#2a2c30',glass:1},{t:'arch',x:300,w:80,col:'#2a2c30',glass:1},{t:'arch',x:440,w:80,col:'#2a2c30',glass:1},{t:'shop',x:580,w:150,col:'#2a3a6a',label:'PHARMACIE'},{t:'arch',x:780,w:80,col:'#2a2c30',glass:1}]},
    {k:'verre',c0:152,c1:157},
    {c0:157,c1:161,col:'#e6dcc6',n:5,wn:2,rails:1,dormers:1,mansH:70,gf:[{t:'door',x:20,w:40,col:'#5a3a22'},{t:'shop',x:80,w:76,col:'#6a2a2a',label:'IMMOBILIER'}]},
    {c0:161,c1:170,mat:'brick',n:4,wn:3,bal:[3],dormers:2,dstyle:'pediment',chim:[300],gf:[{t:'door',x:20,w:46,col:'#6a3a22'},{t:'shop',x:110,w:240,col:'#1e1e22',label:'BOUTIQUE DE MODE'}]},
    {k:'rue',c0:170,c1:176,endCol:'#e6e2d8',lcol:'#b85a3e',rcol:'#efebe0'},
    {k:'blanc',c0:176,c1:195},
    {k:'moderne',c0:195,c1:209},
    {c0:209,c1:218,col:'#d8ccb0',n:2,wn:3,dormers:3,dstyle:'round',chim:[40,320],gf:[{t:'win',x:30,w:60},{t:'door',x:150,w:50},{t:'win',x:260,w:60}]},
    {c0:218,c1:222,col:'#e2d6be',n:5,wn:1,bay:[30,130],rails:1,dormers:1,gf:[{t:'shop',x:6,w:148,col:'#3a5a2a',label:'ÉPICERIE FINE'}]},
    {k:'nouveau',c0:222,c1:236},
    {k:'rue',c0:236,c1:242,endCol:'#d8ccb0',lcol:'#ddd2bc',rcol:'#e2d6be'},
    {k:'cl',c0:242,c1:270},
    {c0:270,c1:277,col:'#d8ccb0',n:2,wn:3,dormers:2,chim:[180],gf:[{t:'win',x:20,w:56},{t:'door',x:110,w:40},{t:'win',x:190,w:56}]},
    {c0:277,c1:284,col:'#9a9282',n:2,wn:3,dormers:3,chim:[220],gf:[{t:'door',x:10,w:110,col:'#e8e4da'},{t:'door',x:140,w:40,col:'#c8c0a8'},{t:'win',x:200,w:60}]},
    {c0:284,c1:291,col:'#e2d8c2',n:2,wn:3,dormers:2,dstyle:'oeil',gf:[{t:'win',x:30,w:56},{t:'win',x:170,w:56}]},
    {c0:291,c1:303,col:'#d8ccb0',n:3,wn:4,bal:[1],dormers:4,dstyle:'round',chim:[60,260,420],sign:[150,'R. G.-DE-MACHAULT'],gf:[{t:'win',x:30,w:56},{t:'win',x:130,w:56},{t:'door',x:240,w:46,col:'#e8e4da'},{t:'win',x:340,w:56}]},
    {k:'cathedrale',c0:303,c1:RW}];
  // balcons de la rotonde (trois étages), balcons filants, balcons de l'angle Art nouveau
  for(const k of[1,2,3])run(4,11,BR(k),'t');
  for(const f of F)if(f.bal)for(const k of f.bal)run(f.c0,f.c1-1,BR(k),'t');
  run(223,226,BR(2),'t');for(const k of[1,2,3,4])run(234,235,BR(k),'t');
  // pics anti-pigeons sur quelques balcons
  for(const[c,r]of[[81,BR(5)-1],[82,BR(5)-1],[140,BR(4)-1],[141,BR(4)-1],[146,BR(1)-1],[66,BR(4)-1]])put(c,r,'^');
  // bannes des boutiques (auvents qui font rebondir)
  for(const[c0,c1]of[[13,16],[102,105],[117,120],[147,150],[164,168],[218,221]])for(let c=c0;c<=c1;c++)put(c,15,'A');
  // rats, cartels, paille, répliques
  for(const[c,a,b]of[[38,30,44],[138,133,148],[298,294,302]]){put(c,G0-1,'k');put(a,G0-1,'|');put(b,G0-1,'|')}
  for(const c of[48,124,172,238,292])put(c,G0-1,'C');
  corn([8,BR(1)-1],[9,BR(2)-1],[6,BR(3)-1],[30,17],[58,BR(2)-1],[70,BR(4)-1],[84,BR(5)-1],[100,BR(3)-1],[112,16],[135,BR(1)-1],[150,BR(4)-1],[166,BR(3)-1],[186,16],[205,17],[224,BR(2)-1],[235,BR(4)-1],[256,16],[280,17],[297,BR(1)-1]);
  put(2,G0-1,'S');put(322,G0-1,'E');
  for(const c of[14,244,300])put(c,G0-1,'q');
  return {w:2,name:"Le cours Langlet",theme:'langlet',exit:'post',exitLabel:"CATHÉDRALE",seed:97,rows:RR,camY:.6,
    nestAt:[6,11],
    awningCol:c=>['#2a5a8a','#8a2a2a','#2a6a4a','#c8a030','#5a3a6a','#2a4a3a'][Math.floor(c/30)%6],
    langlet:{facades:F,trees:[50,68,100,136,186,214,232,262,288],lamps:[30,92,150,200,256,296],bollards:[270,302],shelter:131,
      groups:[{c:72,a:64,b:100,n:6},{c:252,a:244,b:290,n:5}]},
    start:"Une grande rue toute droite, avec des rails. Je ne la reconnais pas : ici, il n'y avait que des ruelles et des chantiers.",
    hints:[],
    quips:["« Cours Jean-Baptiste Langlet. » Le maire ! Il doit être bien sûr de lui, pour donner son propre nom à une rue.",
           "Le Crédit Lyonnais, toujours debout. Les obus passent, les banques restent.",
           "La cathédrale. Je l'ai vue brûler, en 1914. Elle tient encore debout. Moi aussi, à peu près."],
    segs:[{z:'cours',s:'\n'+g.map(r=>r.join('')).join('\n')}]};
})());
LEVELS.push({w:2,name:"La cathédrale",theme:'cathedral',exit:'post',exitLabel:"TOUR NORD",seed:101,rows:30,
 start:"La cathédrale. D'en haut, je verrai tout l'ouest. Il suffit de monter.",
 hints:[["ARTICLE 16 — LE VOLET","Ouvert, on s'y pose. Il tremble juste avant de se refermer."],
        ["ARTICLE 17 — LA GARGOUILLE","Elle crache à intervalles réguliers. Une goutte prévient toujours avant le jet."]],
 quips:["Les gargouilles. Elles crachent sur tout le monde. Même sur les décorés.","D'ici, on voit jusqu'à la Marne. Le pigeonnier est par là. Je le sens."],
 signs:["brown:CATHÉDRALE NOTRE-DAME|Visite des tours"],
 segs:[full([
'........................................',
'........................................',
'........................................',
'......*.........o..o..E.................',
'..............XXXXXXXXXXX...............',
'........................................',
'......o.................................',
'....======..............................',
'........................................',
'.........XO...o.........................',
'.........XX..JJJJ.......................',
'........................................',
'......................o.q......n........',
'....................XXXXXX..............',
'...............................o........',
'...........................|..C..k.|....',
'............................=======.....',
'........................................',
'.........................o..............',
'........................JJJ.............',
'........................................',
'.................o....OX................',
'...............XXXXXX.XX................',
'...........m............................',
'.........q..h...........................',
'........======..........................',
'..........o.............................',
'.g.S..h.................................',
'########################################',
'########################################'])]});
