/* ------------------------------ MISSION 4 · L'A4 ------------------------------ */
/* 4-1 · L'autoroute de l'Est : de nuit, sur l'A4, à dos de camion sous trois ponts, l'embouteillage du péage de Thillois,
   les travaux, jusqu'à l'aire de Gueux — 11m_a4.js */
LEVELS.push((()=>{
  const RW=442,RR=16,G0=14,T0=40;
  const g=Array.from({length:RR},()=>Array(RW).fill('.'));
  for(let c=0;c<RW;c++)for(let r=G0;r<RR;r++)g[r][c]='#';
  const block=(x0,x1,h)=>{for(let c=Math.floor(x0/T0);c<=Math.floor((x1-1)/T0);c++)for(let r=G0-h;r<G0;r++)g[r][c]='X'};
  // l'embouteillage : [x0,x1,genre,hauteur en cases]
  // (calés sur la grille : la silhouette dessinée suit exactement les cases, pour qu'on ne marche pas dans le vide)
  const jam=[[9800,10040,'car',2],[10080,10360,'van',3],[10400,10640,'car',2],[10680,11120,'truck',4],[11160,11400,'car',2],[11440,11800,'bus',4],[11840,12000,'car',2],
             [12080,12240,'carB',2],[12280,12520,'carA',2]];
  for(const[x0,x1,k,h]of jam){block(x0,x1,h);const c0=x0/T0,c1=x1/T0-1,low=r=>{g[r][c0]='.'};
    if(k.startsWith('car')){for(const c of[c0,c1])g[G0-2][c]='.'}          // le capot et le coffre : une case de haut
    else if(k==='van')g[G0-3][c1]='.'}                                      // le nez de la camionnette : deux cases
  g[G0-1][Math.floor(12240/T0)]='X';                       // le moteur à nu de la voiture qui a percuté (on peut s'y poser)
  block(12640,12760,3);                                     // l'îlot de la cabine de péage
  // les travaux : plots, camionnettes, camion-benne (le châssis ; la benne est animée), cabine
  const cones=[13240,13280,13640,14240,15920,15960,16560];for(const x of cones)g[G0-1][Math.floor(x/T0)]='X';
  const vans=[[13800,14040],[16700,16940]];for(const[a,b]of vans)block(a,b,3);
  block(14400,14700,2);block(14700,14860,4);
  // rats, corbeaux, cartels, paille, médaille, départ, sortie
  for(const[c,a,b]of[[336,332,344],[402,398,407]]){g[G0-1][c]='k';g[G0-1][a]='|';g[G0-1][b]='|'}
  for(const[c,r,ch]of[[252,7,'m'],[268,5,'n'],[284,4,'m'],[300,6,'n']])g[r][c]=ch;   // (le corbeau au-dessus du car scolaire vole assez haut pour qu'on passe dessous)
  for(const c of[226,329,372,412])g[G0-1][c]='C';   // (celui du péage, après la barrière ; plus rien sous le camion-benne)   // pas de fanion après les ponts ; celui de l'embouteillage, avant le camion arrêté
  for(const[c,r]of[[20,7],[48,12],[90,12],[110,7],[150,12],[170,7],[214,12],[248,9],[262,10],[278,8],[306,10],[330,12],[349,9],[380,12],[396,12],[418,10],[428,12]])g[r][c]='o';
  g[7][289]='*';g[G0-1][3]='S';g[G0-1][434]='E';
  return {w:3,name:"L'autoroute vers l'Ouest",theme:'a4',exit:'post',exitLabel:"AIRE DE GUEUX",seed:131,rows:RR,camY:.38,
    a4:{G0,bridges:[[2400,2760],[4800,5160],[7200,7560]],jamX:9800,jam,booth:[12640,12760],canopy:[12420,13020],vans,cones,tar:{x0:14400,x1:14700,c1:14860},
        roller:[15020,15820],workers:[16300,16345,16392],tyre:4990,engine:12260,exitX:17360},
    start:"Sur le dos d'un camion, en pleine nuit, à toute allure vers l'ouest. Le règlement n'a rien prévu : c'est donc autorisé.",
    hints:[],quips:[],
    segs:[{z:'a4',s:'\n'+g.map(r=>r.join('')).join('\n')}]};
})());
/* 4-2 · L'aire de Gueux : de nuit, la station-service (chiens errants), la boutique, le couloir des machines à café,
   le self, la salle de restaurant, les toilettes, puis le parking des camions — 11n_aire.js */
LEVELS.push((()=>{
  const RW=416,RR=16,G0=14,T0=40;
  const g=Array.from({length:RR},()=>Array(RW).fill('.'));
  for(let c=0;c<RW;c++)for(let r=G0;r<RR;r++)g[r][c]='#';
  const C=x=>Math.floor(x/T0),block=(x0,x1,r0,r1)=>{for(let c=C(x0);c<=C(x1-1);c++)for(let r=r0;r<=r1;r++)g[r][c]='X'};
  const H=(x0,x1,h)=>block(x0,x1,G0-h,G0-1);
  // dehors : les îlots des pompes, les voitures garées
  H(1280,1520,1);H(1360,1440,2);H(2240,2480,1);H(2320,2400,2);   // la voiture au plein, la voiture garée ; capot et coffre : une case ; habitacle : deux
  // le toit de l'auvent (on y monte par les lanternes des deux lampadaires de la station, posées en escalier depuis la voiture garée)
  for(let c=17;c<=41;c++)g[2][c]='X';for(const[c,r]of[[52,8],[53,8],[46,5],[47,5]])g[r][c]='t';
  // le bâtiment : plafond, murs et cloisons (portes : celle de la boutique est automatique)
  block(2800,12480,3,3);block(2760,2840,4,9);block(4760,4800,4,9);block(5560,5600,4,9);block(11000,11040,4,9);
  for(let r=4;r<=13;r++)if(r<5||r>7)g[r][C(12440)]='X';
  // la boutique : étals, bac à glaces, présentoir à journaux, caisse (comptoir, caisse enregistreuse, présentoir)
  H(3000,3300,3);H(3300,3420,2);H(3420,3720,3);H(3800,3880,5);H(3880,4180,3);H(4320,4640,2);H(4340,4400,3);H(4580,4640,4);
  // le couloir : les deux machines à café
  // le self : le bar à salades (sa hotte au-dessus) ; les vitrines réfrigérées (le haut, le socle) ; la seconde caisse
  H(5700,6100,3);block(5700,6100,7,7);block(6300,7400,5,7);H(6300,7400,1);H(7600,7920,2);H(7620,7680,3);H(7860,7920,4);
  // la salle : tables (plateaux), un pilier ; les toilettes : lavabo, cabines
  for(const x of[8300,8900,9500,10100,10620])for(let c=C(x);c<C(x)+3;c++)g[G0-2][c]='t';
  H(8680,8720,5);for(let c=279;c<=286;c++)g[G0-3][c]='t';for(let c=290;c<=309;c++)g[10][c]='t';   // le plan des vasques ; le rail du haut des cabines
  // dehors, derrière : les deux camions
  H(13400,13840,3);H(15800,16240,3);
  // rats, gardien, cartels, paille, médaille, départ, sortie (sur le dernier camion)
  for(const[c,r,a,b]of[[77,10,75,82],[281,13,277,289],[300,9,291,309]]){g[r][c]='k';g[r][a]='|';g[r][b]='|'}
  g[G0-1][355]='G';g[G0-1][348]='|';g[G0-1][365]='|';
  for(const[c,r]of[[72,13],[141,13],[200,13],[276,13],[340,10],[372,13]])g[r][c]='C';
  for(const[c,r]of[[12,12],[30,12],[33,1],[60,12],[78,8],[90,8],[100,8],[110,10],[128,12],[135,12],[146,10],[150,10],[170,12],[176,12],[208,11],[223,11],[238,11],[266,11],[294,7],[306,7],[330,12],[345,10],[384,12],[392,12]])g[r][c]='o';
  g[1][24]='*';g[G0-1][2]='S';g[G0-4][400]='E';
  return {w:3,name:"L'aire de Gueux",theme:'aireNuit',exit:'none',exitLabel:"",seed:137,rows:RR,camY:.62,
    aire:{G0,door:[2800,2840],sensor:[2790,380],dogs:[[2190,0,2760],[2530,0,2760],[12660,12480,13400],[15100,14700,15700]],
      wake:[1,1,0,1],beggar:[2620,2760],jumpers:[[3150,3600,440,130],[6380,6700,520,110],[6650,7060,520,110]],
      customers:[3760,4220],cashiers:[[4400,4580,480],[7680,7860,480]],tables:[8300,8900,9500,10100,10620],
      coffee:5340,salad:5900,hood:[5700,6100],fridge:6850,window:12440},
    start:/*v2*/"L'aire de Gueux. Des lumières, des odeurs de gasoil et de café. Et, contre la voiture garée, deux chiens qui dorment. Marcher doucement pour ne pas les exciter !",
    hints:[],quips:[],
    segs:[{z:'aire',s:'\n'+g.map(r=>r.join('')).join('\n')}]};
})());
/* 4-3 · L'orage : la remorque sous l'orage, puis le souvenir — la route du fort de Vaux, la chambrée, la cour,
   le vol vers l'ouest au-dessus des lignes, la balle — et la sortie d'autoroute. Tout est dans 11p_vaux.js et 11q_vaux_vol.js. */
LEVELS.push({w:3,name:"L'orage",theme:'vaux',exit:'none',exitLabel:"",seed:109,vaux:true,start:'',hints:[],quips:[],signs:[],
 segs:[`
............
............
..S.........
############
############`]});

LEVELS.push({w:3,name:"La Marne",theme:'ferte26',exit:'none',exitLabel:"",seed:113,ferte:true,
 start:"La Marne, au petit matin. Un chemin de halage. En 1914, on se battait pour cet endroit !",
 quips:["La Ferté-sous-Jouarre, dit un panneau. Le nom me chatouille quelque part sous les plumes."],
 signs:[],
 hints:[["ARTICLE 20 — LES BRUMES","En appuyant sur B, on peut partir dans des brumes de souvenirs."]],
 segs:[],segs14:[]  // construits par 11r_ferte.js
});
