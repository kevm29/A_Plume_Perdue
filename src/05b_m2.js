/* ------------------------------ MISSION 2 · VERDUN ------------------------------ */
LEVELS.push({w:1,name:"Le sentier",theme:'verdun',exit:'post',exitLabel:"BRAS-SUR-MEUSE",seed:61,
 rows:20,deep:2,deepFill:'#',mineDelay:.22,helmetAt:[263,17],dugout:[233,243],marks:[[243,19]],nestAt:[154,3],bedAt:[235,19],
 frontLeaves:[[158,4],[161,6],[154,4,'nest']],communeName:'VERDUN',
 zoneProps:{field:['fence'],wood:['stump','fern','fern'],mines:[],trench:[],monument:['bench','flowerbed']},
 zoneTh:{monument:{type:'gravel',floor:'#6a5a46',floorTop:'#cfc6b2'}},
 start:"Verdun ? Mais je connais ce lieu ! J'ai été enfermé toute une saison pour que ça refleurisse ainsi ?",
 hints:[["ARTICLE 13 — LA BOUE","Elle colle aux plumes : on n'y saute presque plus et on n'y bat plus des ailes, même un peu après. Avancer, toujours."],
        ["ARTICLE 14 — LA MINE","Ne pas s'y aventurer : un clic, et c'est l'explosion assurée."]],
 flyers:[{dy:30,amp:200,sp:1.7},{dy:-70,amp:125}],
 quips:["Un bois. Les arbres ont repoussé, et en couleurs. Chez nous, ils n'avaient plus une branche.",
        "Des panneaux « DANGER » plantés dans l'herbe. Le génie n'a pas fini son travail.",
        "Une tranchée. Tondue, propre, silencieuse. Qui a eu le temps de faire le ménage ?",
        "Un rat de tranchée. Eux, ils n'ont jamais quitté le front.",
        "Ce bois, derrière… On dirait le bois Fumin. Les arbres ont repoussé, mais le terrain, je le reconnais.",
        "Encore un chat. Ils ont donc des chats partout, à l'arrière ?",
        "Ils ont déjà érigé une stèle pour nos héros ?"],
 signs:["commune:VERDUN"],
 segs:[SEG_START_FLAT,
{z:'field',s:`
......................
...o....o....o........
.h..............8.....
####~~~~~~~~##########
######################`},
{z:'field',s:`
..............m.........................
........................................
...o.......o.......o.......o.......o....
.......1.......XX.......1...5...X.......
####################..##################
########################################`},
{z:'field',s:`
......................n.......................
........................o.....................
......o.....o.......o...XX...o......o.....o...
........|....1....k.....XX....|....5..1.......
###..###########################..############
##############################################`},
{z:'field',s:`
.....o....o...
..C....5......
##############
##############`},
{z:'wood',s:`
..................................................
......................=====.......................
..................................................
..........................=====...................
........................o.........................
.......................======.....................
.............o................o...................
............====..........======..................
......o...........o....o...................o......
...=====.......=====..=====.............=====.....
.o..........o................o........o...........
====......======..........=====.....=====.........
.....o...................o........................
...====........===.....====.............====......
.q.3...........3..........3.............3....o....
#######......#####.....########......#############
#######^^^^^^#####^^^^^########^^^^^^#############`},
{z:'mines',s:`
....................n...........................
....o......o....o......o...o.....o...o......o...
................................................
....2......2....2......2...2.....2...2......2...
.h,q..,...,..,.,.....,...,.....,...,......,...,.
#######.,.#######.,.########.,.#######.,.#######
################################################`},
{z:'trench',s:`
.......o..........................
qC#ff#########.......o............
###fffffffffffq......##..q......##
###fffffffffff..o4.o.##..o.o.#####`},
{z:'monument',s:`
........o....o............o.......o.....
.....q..Y.......q...6..........4....E...
########################################
########################################`}]});

/* 2-2 · Les éoliennes : champ éolien sous les rafales, passage de la Meuse sur trois péniches,
   meules à rats, tourbillon de foin entre les pales (mécaniques : 11f_meuse.js) */
LEVELS.push((()=>{
  const RW=300,RR=28,G0=24,GP=16;
  const g=Array.from({length:RR},()=>Array(RW).fill('.'));
  const fill=(c0,c1,top)=>{for(let c=c0;c<=c1;c++)for(let r=top;r<RR;r++)g[r][c]='#'};
  const put=(c,r,ch)=>{g[r][c]=ch};
  const run=(c0,c1,r,ch)=>{for(let c=c0;c<=c1;c++)g[r][c]=ch};
  const corn=(...cs)=>{for(const[c,r]of cs)g[r][c]='o'};
  // creux à ronces : on y fait tomber les sangliers qui chargent
  const pit=(c0,c1)=>{for(let c=c0;c<=c1;c++){g[G0][c]='.';g[G0+1][c]='.';g[G0+2][c]='^'}};
  fill(0,125,G0);fill(169,RW-1,G0);
  /* --- le champ éolien de Bras --- */
  put(2,23,'S');put(5,22,'g');put(11,23,'h');put(14,23,'q');
  corn([17,22],[19,22]);
  run(22,23,22,'X');run(22,23,23,'X');corn([22,20],[23,20]);
  put(28,23,'5');put(31,23,'8');put(36,23,'1');corn([36,21]);
  run(42,44,23,'D');corn([43,21]);
  pit(45,46);put(52,23,'k');put(60,23,'|');corn([49,22],[55,22],[45,21]);
  run(62,63,22,'X');run(62,63,23,'X');corn([62,20],[63,20]);
  run(66,70,24,'^');put(68,19,'n');corn([68,21]);
  put(74,23,'X');corn([74,21]);put(77,23,'C');
  put(82,23,'5');put(86,19,'m');corn([80,22],[84,22],[88,22]);put(92,23,'q');
  /* --- la rive droite : saules et ronces --- */
  run(98,114,23,'^');for(const c of[99,106,113])put(c,23,'3');
  run(99,101,22,'=');run(96,99,18,'=');run(99,101,15,'=');
  run(104,106,20,'=');run(106,108,18,'=');run(103,106,15,'=');
  run(111,113,21,'=');run(113,116,17,'=');
  corn([100,21],[97,17],[105,19],[107,17],[104,14],[112,20],[115,16]);
  put(117,23,'q');put(119,23,'4');put(121,23,'h');put(123,23,'C');
  /* --- la Meuse : trois couloirs de péniches (colonnes 133, 145, 157) --- */
  corn([129,21],[141,21],[153,21],[165,21],[136,22],[148,22],[160,22]);
  /* --- la rive gauche : grand saule (médaille) --- */
  put(171,23,'C');put(173,23,'q');
  run(177,190,23,'^');for(const c of[178,184,190])put(c,23,'3');
  run(178,180,22,'=');run(175,178,19,'=');
  run(182,184,20,'=');run(184,186,17,'=');run(182,184,14,'=');run(184,185,11,'=');
  run(188,190,21,'=');run(190,192,18,'=');
  put(185,10,'*');put(181,12,'m');
  corn([179,21],[176,18],[183,19],[185,16],[183,13],[189,20],[191,17]);
  put(193,23,'5');put(195,23,'4');
  /* --- les meules au pied de la côte --- */
  corn([197,22],[199,22]);
  put(209,23,'8');put(213,23,'1');corn([213,21],[216,21]);
  pit(215,216);put(225,23,'k');put(232,23,'|');corn([223,22],[202,21],[218,21],[228,21]);
  put(235,23,'C');put(237,23,'h');put(238,23,'q');
  /* --- le chaume, sous les éoliennes : tracteur, moyettes de blé, rats --- */
  put(250,23,'4');put(271,23,'4');put(279,23,'5');corn([248,22],[256,21],[269,22],[276,22],[284,21]);
  put(292,23,'E');
  const zones=[['field',0,95],['bank',96,125],['river',126,168],['bank2',169,195],['field2',196,243],['stubble',244,RW-1]];
  return {w:1,name:"Les éoliennes",theme:'meuse',exit:'post',exitLabel:"CHARNY-SUR-MEUSE",seed:67,rows:RR,
    gust:{period:6.5,dur:2.4,push:230,dir:-1},noHuntDemo:true,farTurbines:true,communeName:'BRAS-SUR-MEUSE',
    zoneProps:{field:['fence','molehill'],bank:[],river:[],bank2:[],field2:['fence','molehill','fence'],stubble:[]},
    zoneTh:{stubble:{floorTop:'#c4ab5e'}},
    meuse:{river:[126,168],lanes:[{c:133,name:'MARGOT',port:'GIVET',cargo:'hay'},{c:145,name:'LA COLOMBE',port:'SEDAN',cargo:'logs',secret:true},{c:157,name:'SAINT-MIHIEL',port:'COMMERCY',cargo:'beets'}],
      bales:[{c:203,rats:true},{c:219},{c:229,rats:true}],vortex:241,tractor:262,sheaves:[247,253,258,268,274,282,287],
      bgTurbines:[{x:420,z:9},{x:1150,z:5.5},{x:1900,z:13},{x:2550,z:7},{x:3350,z:16},{x:3900,z:10},{x:8150,z:12},{x:8900,z:7},{x:10350,z:14},{x:11300,z:9}]},
    start:"Le vent se lève et les moulins tournent. Au-delà des champs, la Meuse : il faudra la traverser.",
    hints:[["ARTICLE 15 — LA RAFALE","Quand les traînées de vent se multiplient, la rafale arrive et repousse tout. S'abriter et attendre."],
           ["ARTICLE 16 — LA PÉNICHE","Elles descendent la Meuse. Sauter quand l'une passe, sa cargaison coupe le vent."],
           ["ARTICLE 17 — LE TOURBILLON","Le vent arrache le foin et l'emporte en spirale, avec tout ce qui passe."]],
    quips:["Des moulins géants. Sans meunier, sans farine. Une arme secrète, forcément.",
           "Ça sent la vase et le gasoil. La Meuse n'est pas loin.",
           "Des péniches ! Ils sont fous de passer par ici en cette période. La Meuse, c'est la ligne de front !",
           "La rive d'en face, à pattes sèches. Le règlement ne dit rien des péniches : donc c'est autorisé.",
           "Le foin s'envole tout seul… Ce n'est plus du vent, c'est une tornade !"],
    signs:["commune:BRAS-SUR-MEUSE"],
    segs:zones.map(([z,a,b])=>({z,s:'\n'+g.map(r=>r.slice(a,b+1).join('')).join('\n')}))};
})());

/* 2-3 · La zone rouge : forêt de Verdun au début du soir, trous d'obus pleins d'eau, obus non explosés
   derrière les barbelés, arbres tombés, restes de tranchée, sangliers, et le drone (mécaniques : 11g_zonerouge.js) */
LEVELS.push((()=>{
  const RW=264,RR=20,G0=18;
  const g=Array.from({length:RR},()=>Array(RW).fill('.'));
  for(let c=0;c<RW;c++)for(let r=G0;r<RR;r++)g[r][c]='#';
  const put=(c,r,ch)=>{g[r][c]=ch};
  const run=(c0,c1,r,ch)=>{for(let c=c0;c<=c1;c++)g[r][c]=ch};
  const corn=(...cs)=>{for(const[c,r]of cs)g[r][c]='o'};
  const hole=(c0,c1)=>{for(let c=c0;c<=c1;c++){g[G0][c]='.';g[G0+1][c]='.'}};
  const uxo=(c0,c1)=>run(c0,c1,G0-1,'^');
  const log=(c0,c1,h)=>{for(let r=G0-h;r<G0;r++)run(c0,c1,r,'X')};
  /* --- la lisière : premiers trous d'obus, premier sanglier --- */
  put(2,17,'S');put(5,16,'g');put(10,17,'h');put(14,17,'q');
  uxo(18,21);corn([19,14],[20,14]);
  put(24,17,'q');hole(27,29);corn([28,15]);
  put(36,17,'k');corn([33,16],[39,16]);hole(42,44);corn([43,15]);
  put(46,12,'m');
  put(50,17,'3');run(50,52,15,'=');run(48,50,12,'=');corn([51,14],[49,11]);
  put(55,17,'C');put(58,17,'q');
  /* --- la forêt : arbres tombés, obus, la vieille souche ; le drone arrive au premier tiers --- */
  log(64,66,1);corn([65,15]);
  put(70,17,'3');run(70,73,15,'=');run(67,70,12,'=');run(70,72,9,'=');corn([71,14],[68,11],[71,8]);
  uxo(76,80);put(83,17,'3');run(80,83,15,'=');run(83,85,12,'=');corn([78,13],[84,11]);
  put(89,17,'h');put(90,17,'T');put(98,2,'Q');
  log(93,97,2);corn([95,14]);
  hole(100,102);put(106,17,'3');run(103,106,14,'=');run(106,108,11,'=');put(109,17,'k');hole(114,116);corn([101,15],[104,13],[107,10],[115,15]);
  put(119,17,'C');put(121,17,'q');log(123,125,1);
  put(127,17,'3');run(124,127,14,'=');corn([124,13],[126,16]);
  /* --- les restes d'une tranchée, avec un bout de sape couverte --- */
  put(131,17,'q');hole(133,152);run(141,146,G0,'X');put(138,19,'4');corn([136,19],[149,19],[143,16]);
  put(156,17,'C');
  /* --- la forêt profonde --- */
  uxo(163,169);put(166,17,'3');run(162,166,16,'=');run(166,170,14,'=');run(165,167,11,'=');corn([164,15],[168,13],[166,10]);
  log(175,177,1);corn([176,15]);
  hole(182,184);put(192,17,'3');run(189,192,14,'=');run(192,194,11,'=');put(190,17,'k');hole(197,199);corn([183,15],[190,13],[193,10],[198,15]);
  log(203,207,2);corn([205,14]);put(210,12,'n');
  put(211,17,'3');run(208,211,15,'=');corn([209,14]);
  hole(214,216);corn([215,15]);put(222,17,'C');put(225,17,'q');
  /* --- la clairière et l'abri allemand du Mort-Homme --- */
  uxo(229,231);corn([230,14]);hole(236,238);corn([237,15]);put(243,17,'q');
  put(246,17,'E');
  const zones=[['zr1',0,59],['wood',60,129],['trench',130,159],['wood',160,229],['zr2',230,RW-1]];
  return {w:1,name:"La zone rouge",theme:'zonerouge',exit:'blockhaus',seed:71,rows:RR,deep:2,deepFill:'#',
    zoneProps:{zr1:['stump','molehill'],wood:['stump','fern','fern'],trench:[],zr2:['stump','molehill']},
    stumpAt:[86,17],blockhaus:[244,257],exitGround:true,signs:["brown:ZONE ROUGE|Forêt domaniale · accès interdit"],
    start:"Le soir tombe sur Verdun. Des pancartes partout : « Zone rouge ». Rouge, je connais : c'est la couleur du front.",
    chaseQuip:"Un pigeon mécanique, avec une lanterne sous le ventre. Il fait sa ronde au-dessus des bois… Il m'a vu !",
    hints:[["ARTICLE 18 — LA ZONE ROUGE","Derrière les barbelés, des obus de la bataille n'ont jamais éclaté. On en voit dépasser le nez. Ils n'attendent qu'une patte."],
           ["ARTICLE 19 — L'ŒIL DU DRONE","Son projecteur fouille le sol. S'il vous garde dans sa lumière, il tire. Sous le feuillage d'un arbre ou dans une sape couverte, il ne vous voit plus."]],
    quips:["« Zone rouge ». On a déjà décidé que cette terre ne servirait plus à rien ? La guerre n'est même pas finie.",
           "Des trous d'obus pleins d'eau. Le ciel s'y reflète. C'est le seul endroit où il fait beau.",
           "Une forêt plantée sur le champ de bataille. D'en haut, au moins, on ne voit plus les trous.",
           "Des arbres couchés en travers. La tempête, ou l'artillerie : ici, on ne fait plus la différence.",
           "Une tranchée. Les parois tiennent encore. Les gars, eux, sont partis en permission. Tous.",
           "Du béton, là-bas, sous les arbres. Un abri !",
           "Un abri ennemi, en béton. Vide. Ils ont dû enfin reculer. Il était temps."],
    segs:zones.map(([z,a,b])=>({z,s:'\n'+g.map(r=>r.slice(a,b+1).join('')).join('\n')}))};
})());

/* 2-4 · L'abri du Mort-Homme : l'abri allemand, aménagé (en 2026) en musée franco-allemand de la Grande Guerre —
   mais Raymond ne le sait pas : rien ne dit « musée », il croit à de vrais soldats.
   Le soir : gardiens à lampe, draps, placards où se cacher, automates dans des scènes reconstituées, chat, rats,
   mites, chauves-souris ; puis les tranchées ; on s'envole par une meurtrière du mur du fond (mécaniques : 11h_musee.js) */
LEVELS.push((()=>{
  const RW=220,RR=15,G0=13;
  const g=Array.from({length:RR},()=>Array(RW).fill('.'));
  for(let c=0;c<RW;c++)for(let r=G0;r<RR;r++)g[r][c]='#';
  const put=(c,r,ch)=>{g[r][c]=ch};
  const run=(c0,c1,r,ch)=>{for(let c=c0;c<=c1;c++)g[r][c]=ch};
  const corn=(...cs)=>{for(const[c,r]of cs)g[r][c]='o'};
  const holes=[];const pit=(c0,c1)=>{for(let c=c0;c<=c1;c++){g[G0][c]='.';g[G0+1][c]='.';holes.push([c,15],[c,16])}};
  const trench=(c0,c1)=>{for(let c=c0;c<=c1;c++){g[G0][c]='.';g[G0+1][c]='.'}};
  /* --- l'abri-musée --- */
  put(2,12,'S');put(5,11,'g');for(const c of[6,30,58,88])put(c,3,'l');
  corn([8,11],[23,10]);
  put(22,12,'|');put(25,12,'&');put(28,12,'X');put(31,12,'G');put(34,12,'&');put(40,12,'|');corn([28,10],[31,9],[37,9]);
  put(44,8,'m');
  run(46,49,10,'=');run(51,54,8,'=');run(56,58,10,'=');put(46,12,'|');put(51,12,'k');put(57,12,'|');corn([47,9],[52,7],[57,9]);
  put(66,12,'Y');corn([64,10],[69,11]);
  pit(72,80);put(70,12,'|');put(71,12,'M');put(83,12,'|');corn([76,11]);
  // au-dessus du chariot : une dalle basse et des barbelés tendus — on ne vole pas ici, on attend le chariot
  for(let c=70;c<=82;c++){for(let r=0;r<=7;r++)put(c,r,'#');put(c,8,'^')}put(88,6,'n');
  put(86,12,'C');
  put(91,12,'X');put(91,11,'X');run(93,98,9,'=');
  put(99,12,'|');put(103,12,'G');put(106,12,'&');put(109,12,'|');put(104,6,'n');corn([102,9],[107,9]);
  /* --- les tranchées reconstituées --- */
  put(111,12,'q');put(112,11,'g');
  trench(115,140);put(116,14,'|');put(126,14,'&');put(129,14,'G');put(139,14,'|');corn([118,12],[130,12],[137,13]);
  put(142,12,'q');
  run(145,148,12,'^');pit(152,155);run(150,157,10,'=');run(160,163,12,'^');put(150,6,'n');put(165,8,'m');
  put(164,12,'|');put(168,12,'k');put(171,12,'|');
  corn([146,9],[153,9],[161,9]);put(167,12,'C');
  trench(172,196);put(173,14,'|');put(184,14,'G');put(187,14,'&');put(195,14,'|');put(192,14,'k');corn([178,12],[186,12],[194,13]);
  put(200,12,'Y');
  put(201,12,'|');put(204,12,'&');put(208,12,'G');put(212,12,'|');put(211,12,'q');corn([204,9],[210,10]);
  // le mur du fond, et sa meurtrière ouverte sur le soir : on y monte par les caisses, on s'envole dehors
  put(214,12,'X');put(215,12,'X');put(215,11,'X');corn([215,9]);
  for(let c=217;c<RW;c++)for(let r=0;r<G0;r++)if(r<7||r>8)put(c,r,'#');put(217,8,'E');
  const zones=[['musee',0,109],['trench',110,RW-1]];
  return {w:1,name:"L'abri du Mort-Homme",theme:'abri',exit:'embrasure',seed:73,rows:RR,deep:2,deepFill:'#',holes,
    zoneTh:{trench:{type:'earth',floor:'#4a3a2a',floorTop:'#5a4a30',x:'sandbag'}},
    zoneProps:{musee:['stanchions','crate','helmet','chair','stanchions'],trench:['shells','ammo','helmetPost']},
    flyers:[{kind:'moth'},{kind:'bat',amp:90},{kind:'bat',amp:80},{kind:'bat',amp:100},{kind:'moth'}],
    musee:{cupboards:[12,37,101,123,136,180],
      automata:[{c:17,side:'fr',task:'bandage',grp:1},{c:19.5,side:'fr',task:'wounded',grp:1},{c:62,side:'de',task:'phone',grp:2},{c:96,side:'de',task:'map',fiente:true},
        {c:119,side:'fr',task:'periscope',grp:3,trench:true},{c:133,side:'fr',task:'letter',grp:4,trench:true,search:true},{c:177,side:'de',task:'sentry',trench:true},{c:190,side:'de',task:'cook',trench:true}]},
    start:"Ce satané oiseau mécanique m'a forcé à rentrer chez l'ennemi. Un abri allemand… avec des lampes partout, et des soldats !",
    hints:[],
    quips:["Des tranchées… sous un toit. L'ennemi a même mis la guerre à l'abri.",
           "Le no man's land, en plus petit. Personne ne tire. Je n'aime pas ça du tout.",
           "Une meurtrière ouverte, là-haut ! L'air du soir. Je file avant que tout ce monde ne se réveille."],
    signs:["ABRI DU MORT-HOMME|Unterstand Toter Mann · 1916","TRANCHÉES|Schützengräben"],
    segs:zones.map(([z,a,b])=>({z,s:'\n'+g.map(r=>r.slice(a,b+1).join('')).join('\n')}))};
})());

