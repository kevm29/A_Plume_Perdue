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
  for(const[c,a,b]of[[wagons[1].c0+15,wagons[1].c0+9,wagons[1].c0+24],[wagons[3].c0+15,wagons[3].c0+8,wagons[3].c0+26],[B1.c0+17,B1.c0+12,B1.c0+27],[wagons[8].c0+14,wagons[8].c0+8,wagons[8].c0+26]]){put(c,ROOF-1,'k');put(a,ROOF-1,'|');put(b,ROOF-1,'|')}
  for(const[c,r]of[[24,3],[70,2],[104,4],[B1.c0+8,3],[wagons[7].c0+20,2],[wagons[9].c0+6,4]])put(c,r,'m');
  for(const w of wagons){if(w.k==='ext'||w.k==='loco')corn([w.c0+7,5],[w.c0+16,4],[w.c0+26,5])}
  corn([S.c0-1,11],[S.c0+7,11],[S.c0+15,10],[S.c0+23,11],[S.c1+1,11],[B.c0+5,10],[B.c0+19,9],[B.c1-3,11]);
  for(const[c,r]of[[wagons[1].c0+2,6],[wagons[3].c0+2,6],[S.c0+2,11],[B.c0+2,11],[B1.c0+2,6],[wagons[8].c0+2,6],[M.c0+2,6]])put(c,r,'C');
  put(4,6,'S');put(M.c1,7,'E');
  put(wagons[3].c1-5,6,'q');put(S.c0+5,11,'q');put(B.c0+1,11,'q');put(B1.c0+4,6,'q');
  return {w:2,name:"Le train",theme:'train',exit:'train',seed:79,rows:RR,camY:.55,
    gust:{period:5.3,dur:1.1,push:250,dir:-1},
    train:{wagons,seats:['old','empty','phone','sleep','bagblue','paper','empty','student','bagred','suit','sleep','phone','empty','knit'],
      bottles:[S.c0+5.5,S.c0+12.5,S.c0+19.5,S.c0+26.2],door:S.c1,counter:cnt,chips:cnt[0]+5.5},
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
  put(3,11,'S');put(14,11,'k');put(10,11,'|');put(18,11,'|');
  box(20,24,10,11,'#');                                  // la camionnette de vidange
  put(28,11,'C');
  box(40,41,10,11,'X');box(56,57,10,11,'X');box(70,71,10,11,'X');   // chariots à bagages : on s'y réfugie
  for(let c=54;c<=60;c++)put(c,8,'=');                   // une poutre de la verrière
  put(63,11,'k');put(60,11,'|');put(68,11,'|');
  corn([22,8],[33,10],[41,8],[49,10],[57,6],[65,10],[71,8],[76,10]);
  put(77,11,'C');
  /* --- la file, la sandwicherie, le kiosque, le buffet --- */
  put(81,11,'X');put(84,11,'X');box(86,86,10,11,'X');
  box(88,94,8,11,'#');put(90,7,'^');put(91,7,'^');
  box(97,101,7,11,'#');put(99,6,'^');
  put(103,11,'k');
  put(103,9,'A');put(104,9,'A');
  box(105,112,6,11,'#');put(108,5,'^');put(110,5,'^');
  for(let c=114;c<=115;c++)put(c,10,'=');
  put(93,4,'m');put(113,5,'m');
  corn([82,9],[86,8],[92,6],[96,9],[99,4],[102,10],[104,6],[107,4],[111,4],[115,8]);
  put(104,2,'*');
  put(117,11,'C');
  /* --- le parvis, la route, le square --- */
  put(123,11,'C');box(133,133,11,11,'X');box(148,148,11,11,'X');
  corn([128,10],[133,8],[140,9],[148,8],[155,10],[162,8],[167,7],[172,8]);
  put(181,11,'C');
  // la statue de Colbert : marches, socle, piédestal, la statue (on peut se percher sur sa tête)
  box(201,213,11,11,'#');box(202,212,10,10,'#');box(204,210,8,9,'#');box(205,209,6,7,'#');box(206,208,5,5,'#');box(207,207,2,4,'X');
  corn([186,9],[193,10],[204,6],[207,1],[217,9],[226,10],[233,9]);
  box(238,239,11,11,'X');box(243,243,11,11,'X');
  put(247,11,'E');
  for(const[c,r]of[[17,11],[79,11],[121,11],[157,11],[183,11],[200,11]])put(c,r,'q');
  const zones=[['quai',0,116],['hall',117,121],['parvis',122,158],['route',159,178],['parc',179,RW-1]];
  return {w:2,name:"La gare",theme:'gare',exit:'post',exitLabel:"PLACE D'ERLON",seed:83,rows:RR,
    zoneTh:{quai:{type:'platform',floor:'#7a746a',floorTop:'#a8a090'},hall:{type:'stone',floor:'#8a8478',floorTop:'#b8b0a2'},
      parvis:{type:'stone',floor:'#9a9284',floorTop:'#cfc6b2',x:'barrier'},route:{type:'asphalt',floor:'#3a3c40',floorTop:'#55575c'},parc:{type:'earth',floor:'#5c4630',floorTop:'#6c9a38',x:'hedge'}},
    zoneProps:{quai:['bench','clockPost','vending','bench'],hall:[],parvis:['lampPost','binPark'],route:[],parc:['flowerbed','binPark','lampPost']},
    nestAt:[57,7],
    gare:{camion:[20,24],cart:[[40,41],[56,57],[70,71]],shop:[88,94],kiosk:[97,101],resto:[105,112],queue:[80,87],vanZone:[25,78],
      road:[159,178],park:[179,246],statue:207,
      pigeons:[{k:'gros',a:186,b:197},{k:'gros',a:216,b:230},{k:'deplume',c:192},{k:'deplume',c:228},{k:'moignon',c:198},{k:'moignon',c:221}]},
    start:"Une gare. Le clocher ne doit plus être bien loin. Je finis à pattes : je n'ai plus de souffle.",
    hints:[],
    quips:["Une voiture qui pompe le… Non. Je ne veux pas savoir ce qu'elle pompe.",
           "Une file d'attente pour du pain. Comme en 1917. Certaines choses ne changent pas.",
           "Dehors. Des voyageurs qui tirent leurs malles sur des roulettes. Les malles ont des roues, maintenant.",
           "Des automobiles, des camions… et pas un seul cheval. Où sont passés les chevaux ?",
           "Un square. Et des pigeons… Quelle allure ! Ils ont fait la guerre, eux aussi ?",
           "Un monsieur en bronze, avec une perruque. Il a l'air de quelqu'un qui compte tout."],
    segs:zones.map(([z,a,b])=>({z,s:'\n'+g.map(r=>r.slice(a,b+1).join('')).join('\n')}))};
})());
LEVELS.push({w:2,name:"La place d'Erlon",theme:'square',exit:'post',exitLabel:"CATHÉDRALE",seed:97,
 start:"Une grande place. Une vieille dame jette du pain. Je refuse. J'ai ma fierté. Bon, une miette.",
 chaseQuip:"Une machine verte qui avale tout ce qui traîne par terre. Ne pas traîner par terre !",
 hints:[],
 quips:["Elle aspire les mégots, les feuilles et les pigeons. Le progrès.","La statue regarde vers l'ouest. Moi aussi. On a au moins ça en commun."],
 signs:["street:PLACE DROUET-D'ERLON"],
 segs:[SEG_START_FLAT,`
..................
...o.....o........
.P........T...q...
##################
##################`,`
........................
.......o........o.......
....AA......XX......AA..
............XX..........
########################
########################`,`
......................
..........o...........
........=====.........
......................
...XX.........XXX.....
...XX.........XXX.....
######################
######################`,`
..........................
......o.........o.........
..AA.......AAA.......AA...
..........................
##########################
##########################`,`
................
.....o..o.......
..C.............
################
################`,`
......................
.........*............
........===...........
.....i................
....XXX......AAA......
....XXX...............
....XXX...............
######################
######################`,`
........................
.....o.......o.......o..
...XX......XX......XX...
...XX......XX......XX...
########################
########################`,`
....................
....................
.........===........
.....AA.........E...
####################
####################`]});

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
