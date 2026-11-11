/* =========================================================
   NIVEAUX — 5 missions × 4 niveaux (niveaux longs, boss au niveau 3)
   Légende : # sol · X bloc · W mur · D gros bloc · = planche à sens unique · ^ pics · v pics au plafond
   o paille · * médaille · C cartel · E sortie · S départ · k marcheur · r petit marcheur (marcassin)
   m/n volants · M/V chariots · N camion · | butée · U courant d'air · ! foudre · T déclencheur
   K chat · Q drone · Z buse · h panneau d'aide · q réplique · l lampe · g enseigne · u cloche de Raymond
   w mammouth · c horloge · y poêle · b gamelle · j cloche d'église · i statue
   Nouveaux (voir 11b_mech.js) : ~ boue · % sol fragile · & drap-cachette · G gardien · Y chat qui guette
   H gardien au filet · A auvent · J volet · O gargouille · L tramway · $ cheval de bois · a ballon
   I cloche balancée · F braséro · P balayeuse · + coquelicots
   Les segments sont alignés en bas ; ceux de 15 lignes occupent toute la hauteur.
   ========================================================= */
const SEG_START_FLAT=`
.....g....
..S.......
##########
##########`;
const LEVELS=[];
const LETTERS_SRC=[
 /* recto : ce que Lucien veut que Marguerite croie */
 {date:"Fort de Vaux, le 2 juin 1916.",text:"Marguerite, je t'écris cette lettre pour te rassurer et te dire qu'ici, tout va bien.",comment:"Je l'ai vu l'écrire, cette lettre. Dire que tout va bien, c'est un doux euphémisme…"},
 {text:"Nous sommes en surnombre et nous repoussons les Allemands.",comment:"Il me semble pourtant les avoir survolés en partant !"},
 {text:"Je vois une issue à cette guerre sans fin…",comment:"Quel était son plan, pour dire cela ? La veille encore, le commandant disait que ça durerait !"},
 {text:"… mais je ne vois pas mon retour auprès de toi.",comment:"Mais… ?\nJe respecte le règlement : je ne lirai pas la suite !"},
 {text:"C'est fini entre nous. Je ne reviendrai pas à Crécy-la-Chapelle.",comment:"Par pigeon ? Il rompt par pigeon ? Moi qui pensais transporter des plans de bataille !"},
 {text:"Épouse le fils Garnier. Il a deux vaches, une charrette, et il a été réformé.",comment:"Il la quitte et il lui choisit son remplaçant. De quel droit ! Un réformé, en plus."},
 {text:"Si cela peut t'aider, brûle mes lettres, oublie mon nom…",comment:"Il ne l'a donc jamais aimée… Les hommes sont compliqués. Les pigeons, non."},
 {text:"… dis-toi que je n'ai jamais aimé ni ton rire au bal du 14 Juillet, ni tes robes bleues.",comment:"Il critique même ses toilettes. Je ne livre pas une lettre, je livre une gifle."},
 {text:"Ne garde rien de moi, pas même les photographies. Surtout pas les photographies.",comment:"Une goutte de pluie. Il ne devait plus être très étanche, le fort !",fx:'blot'},
 {text:"Ne pleure pas pour moi. Le fils Garnier saura te consoler. ~Ce n'est plus à moi de le faire.~",comment:"On ne raye pas une phrase qu'on ne pense pas."},
 {text:"Rends le chien à mon père et déménage…",comment:"Le chien ! Qu'est-ce qu'on en a à faire, du chien, quand tu la mets à la porte de chez elle ?"},
 {text:"… le fils Garnier a bien de quoi t'héberger.",comment:"Quel goujat ! Et qui va-t-il ramener à sa place ? J'avais tant de respect pour mon maître…"},
 {text:"Amuse-toi bien. Il saura sûrement mieux danser que moi.",comment:"Si la danse était un critère, le bal du dimanche serait désert !"},
 /* verso : l'humidité de l'orage (4-3) fait apparaître ce qui était écrit au dos */
 {pre:"Raymond retourne la lettre.\nL'humidité laisse entrevoir une suite à moitié effacée.",text:"Marguerite, tu te doutes bien que je ne te quitte pas parce que je ne t'aime plus.",comment:"Quel revirement de situation !",fx:'verso'},
 {text:"Mais je n'ai plus aucun espoir ici : nous sommes encerclés par les Allemands.",comment:"C'est bien ce que je pensais. J'espère qu'il a un plan pour s'en échapper.",fx:'verso'},
 {text:"Le commandant nous a dit que nous n'avions plus d'eau en réserve.",comment:"Le soldat Lafitte l'avait déjà dit, avant même d'arriver au fort de Vaux !",fx:'verso'},
 {text:"Les bombardements sont de plus en plus violents, et nous n'avons plus aucune nouvelle de l'extérieur du fort.",comment:"C'est donc pour ça qu'il m'a fait m'envoler, comme dans la Marne en 1914 !",fx:'verso'},
 {text:"Le commandant garde un pigeon pour l'urgence absolue, mais je te renvoie Raymond. Préviens la gendarmerie de notre situation.",comment:"Vaillant ! La gloire a toujours été pour lui ! J'aurais tant voulu être le dernier pigeon…",fx:'verso'},
 {text:"Donne une poignée de grain à ce brave Raymond, il l'a bien mérité.",comment:"Du grain ? Pour moi ? Il pensait à moi… J'ai toujours cru en toi, Lucien.",fx:'verso'},
 {text:"Je t'aime. Je t'ai toujours aimée.\nJe t'aimerai où que je sois.\nLucien",comment:"… Il ne me reste plus qu'à lui remettre le courrier.",fx:'verso',sign:true}
];
/* aide à l'écriture : un segment de 15 lignes à partir d'un tableau de lignes */
function full(lines){return '\n'+lines.join('\n')}

/* ------------------------------ MISSION 1 · VITTONCOURT ------------------------------ */
LEVELS.push({w:0,name:"La vitrine",theme:'vitrine',exit:'door',seed:11,
 stashQuips:["Un passage dans les cartons. Quelqu'un s'est creusé une cachette. Un rat, sûrement. Un rat qui aime la paille."],rows:20,deep:3,camY:.62,
 leverQuip:"Le portillon remonte. Le bec : l'outil le plus sous-estimé de l'armée française.",
 start:"Une remise. On m'a rangé dans une remise ! Le pigeonnier Vasseur, à Crécy-la-Chapelle : je connais le chemin !",
 hints:[["FIG. 1 — LA MARCHE","← → (ou Q / D). Le pigeon avance. Sans grâce, mais il avance."],
        ["FIG. 2 — LE SAUT","Espace, Z ou ↑. Le saut, inventé par les puces, perfectionné par personne."],
        ["FIG. 3 — LE BATTEMENT D'AILES","Rappuyer en l'air. Deux battements maximum : les ailes sont cousues. Chaque battement use l'aile ; posé, il lui faut une seconde par battement pour s'en remettre."],
        ["FIG. 4 — FANION DE SAUVEGARDE","Les fanions de sauvegarde retiennent tout. C'est leur seul talent."],
        ["FIG. 5 — LE BEC","E : Tirer une poignée, ouvrir un tiroir, chiper ce qui dépasse. Un pigeon a un bec : qu'il s'en serve."],
        ["FIG. 6 — LE VOL PLANÉ","Battre des ailes au plus haut, puis maintenir le saut en tombant. Planer use l'aile aussi : quand la jauge est vide, on tombe. Dignité non incluse."],
        ["FIG. 7 — LA MITE","Tineola bisselliella. Elle suit toujours le même trajet, au même rythme. C'est pour ça que j'aime les mites."]],
 quips:["Le plancher est défoncé. Un obus, sûrement. Ils tombent jusqu'ici, maintenant ?","Des meubles sous des draps. On a évacué en vitesse. L'ennemi doit être tout proche.","Une mite. Ça grignote les uniformes et les pigeons. Méfiance."],
 signs:["RÉSERVE|Accès interdit au public"],
 segs:[`
........l.....
..............
..............
..............
..............
..............
..............
.......u......
.........S.h..
##############
##############`,`
g...................
....................
.........o.....o....
....o...XX.....XX...
.......XXX....XXX...
....h..XXX...XXXX...
####################
####################`,`
..................
..........o.......
..........XX......
..........XX......
..........XX..o...
......h...XX......
##################
##################`,`
....................
...............o....
..........o...XXX...
.......ffXXX..XXX...
...o..XXffXX..XXX...
#####.XXXfsX..XXX.##
#####.XXXXXX..XXX.##`,`
...q..........
..............
.h..C.....o...
######...#####
##############`,full([
'..........W.........',
'..........W.........',
'..........W.........',
'..........W.........',
'..........W.........',
'..........W.........',
'..........W.........',
'..........W.........',
'..........W.........',
'..........W.........',
'..........W.........',
'..........R.........',
'..h....z..R...o..o..',
'####################',
'####################']),`
..........................
.....o.....o.....o........
..........................
..h.......................
####.............#########
####.............#########`,full([
'..................',
'..................',
'..................',
'..................',
'..................',
'..................',
'..................',
'..........*.......',
'.........====.....',
'..................',
'..................',
'..................',
'..................',
'...====...........',
'..................',
'..................',
'..o.....o.....o...',
'.XXq..............',
'##################',
'##################']),`
..................
..............o...
............====..
..................
....o.....m.......
.h........q.......
###....####...####
###....####...####`,`
..o.o.......
............
......E.....
############
############`]});

LEVELS.push({w:0,name:"La galerie des insectes",tiroirAt:[64,4],sheetBase:0,theme:'insectes',exit:'door',seed:23,
 start:"Des papillons épinglés par centaines. Et quelqu'un qui marche, là-bas, avec une lampe.",
 hints:[["FIG. 8 — LE GARDIEN DE NUIT","Il fait sa ronde avec sa lampe. Il ne va pas aimer s'il croise un pigeon dans le noir !"],
        ["FIG. 9 — L'ÉPINGLE","Redoutable. Le pigeon qui s'y frotte y laisse des plumes. Au sens propre."]],
 quips:["Une sentinelle. Il ne m'a pas vu. Les sentinelles ne voient jamais les pigeons.","Un plafond hérissé d'épingles. Interdiction de battre des ailes. Je déteste les règlements que je n'ai pas écrits.","Des mites. Encore des mites. Toujours des mites. Le musée se fait dévorer de l'intérieur, et moi avec."],
 stashQuips:["Un carton creux. Et de la paille dedans. Finalement, la réserve, c'est un peu chez moi."],
 signs:["GALERIE D'ENTOMOLOGIE|Don du docteur Laffont"],
 segs:[SEG_START_FLAT,`
....................
....................
.......o.......o....
|h.&...G.....&.....|
####################
####################`,`
................
.....o....o.....
....====..===...
................
.h....^^^^^.....
################
################`,`
.....................#
.....................#
.....................#
.....................#
...................o.#
######################
.vvvvvvvvvvvvvvvvvvvv.
......................
......................
.........o......o.....
.......===....===.....
......................
|..&..G...|q..G...&..|
######################
######################`,`
..........C...
.........====.
..............
....===.......
......o.o.....
...|...k...|..
##############
##############`,`
........................
..o.......o.......o.....
|...&..^^....G..&..^^..|
########################
########################`,`
..................
.....n............
..................
|..&...G.....&..q|
##################
##################`,`
..................
....o.......o.....
...====.m.====....
..................
.....m.......n....
..................
.q.......m........
##################
##################`,`
....................
............====....
.........DD.........
.........Df.........
.........Ds.........
|.......XDD|..G....|
####################
####################`,`
..o.o.......
............
......E.....
############
############`]});

LEVELS.push({w:0,name:"L'étage du mammouth",theme:'mammouth',exit:'door',seed:37,rows:21,camY:.72,
 stashCells:[[176,13]],fakeStash:[[176,13]],
 stashQuips:["Une planche cachée au-dessus du mammouth. Et de la paille. Quelqu'un a de l'humour, dans ce musée.","Un carton éventré. Le gardien n'a pas regardé dedans. Le gardien ne regarde jamais dans les cartons."],
 dark:{base:.9,period:3.4},
 start:"Un escalier. Là-haut, il fait noir comme dans un abri. Heureusement qu'il y a de l'orage.",
 chaseQuip:"Le gardien ! Il a pris un filet à papillons. Il me prend pour un papillon. COURIIIIR !",
 hints:[["FIG. 10 — L'ORAGE","Dans le noir, chaque éclair montre le chemin. Bien regarder, puis sauter."],
        ["FIG. 11 — LE DIABLE","Chariot de déménageur. Monter dessus. Ne pas lui demander où il va."]],
 quips:["Un éléphant en plâtre. L'arrière ne manque de rien, à ce que je vois.","Une étiquette sur l'éléphant : « Lot n° 3, adjugé ». Ils vendent tout. Il doit y avoir une guerre à payer.","Encore lui. La sentinelle ne dort donc jamais ?"],
 signs:["ESCALIER|Étage fermé au public","MAMMUTHUS PRIMIGENIUS|Reconstitution en plâtre"],
 segs:[SEG_START_FLAT,full([
'................',
'................',
'................',
'................',
'................',
'................',
'................',
'................',
'..............##',
'............####',
'..........######',
'........########',
'....h.##########',
'################',
'################']),full([
'......................',
'......................',
'......................',
'..........====........',
'..........o...........',
'....====........====..',
'...............o......',
'......................',
'#####........#########',
'#####........#########',
'#####........#########',
'#####........#########',
'#####........#########',
'#####........#########',
'#####........#########']),full([
'........................',
'........................',
'.............s..........',
'.............==.........',
'........................',
'........................',
'.............tt.........',
'........................',
'................o.......',
'..g.....................',
'............===.........',
'......====.........o....',
'..o.................q...',
'.....|....w...G.....|...',
'########################',
'########################',
'########################',
'########################',
'########################',
'########################',
'########################']),full([
'....................',
'....................',
'....................',
'....................',
'....................',
'...o...o...o........',
'....................',
'................C...',
'.............#######',
'.............#######',
'.............#######',
'.............#######',
'.............#######',
'.............#######',
'.............#######']),full([
'.......................',
'.......................',
'.........m.............',
'...............o.......',
'.....====.....====.....',
'.......................',
'..o..........o.......o.',
'..h....................',
'######|.....M.....|####',
'######.............####',
'######.............####',
'######.............####',
'######.............####',
'######.............####',
'######.............####']),full([
'................',
'................',
'................',
'................',
'................',
'................',
'.q..............',
'.H..........C...',
'################',
'################',
'################',
'################',
'################',
'################',
'################']),full([
'........................',
'........................',
'........................',
'........................',
'........................',
'..........o.....m.......',
'.....XX.........XX......',
'.....XX....o....XX..k...',
'#########...############',
'#########...############',
'#########...############',
'#########...############',
'#########...############',
'#########...############',
'#########...############']),full([
'........................',
'........................',
'........................',
'........................',
'..........====..........',
'....o.......n......o....',
'...XXX..............XX..',
'...XXX..k...o.......XX..',
'##########...###########',
'##########...###########',
'##########...###########',
'##########...###########',
'##########...###########',
'##########...###########',
'##########...###########']),full([
'............',
'............',
'............',
'............',
'............',
'............',
'............',
'.....E......',
'############',
'############',
'############',
'############',
'############',
'############',
'############'])]});

LEVELS.push({w:0,name:"La loge du gardien",sheetBase:8,theme:'loge',exit:'window',seed:53,
 dark:{base:.86,period:3.8},
 start:"Une loge de concierge. Ça sent la soupe froide et la croquette.",
 hints:[["FIG. 12 — LE CHAT DU GARDIEN","Il fait semblant de dormir. Quand ses yeux s'ouvrent, ne plus bouger d'une plume : s'il voit bouger, il bondit."]],
 quips:["La gamelle dit BIJOU. Rien de bon ne peut sortir d'un chat qui s'appelle Bijou.","Des yeux qui brillent dans le noir. Un chat. Ne pas bouger. Surtout ne pas bouger.","La fenêtre est ouverte. L'air frais. La liberté. Et… le vent !"],
 signs:["LOGE DU GARDIEN|Frapper fort"],
 segs:[`
....l...
........
........
........
........
........
........
....g...
..S..b..
########
########`,`
....................
....................
.....o..........o...
.h..q.......Y.......
####################
####################`,`
...........o..........
..........x...........
......................
......................
......................
|..&.....G.......&...|
######################
######################`,`
............
.....o.o....
.........C..
############
############`,`
.......................
.......................
..........o............
........====...........
....................o..
...====.......====.....
...........Y...........
###.......#####.....###
###.......#####.....###`,`
......................
......o.......o.......
|..&....G...|.k...|...
######################
######################`,`
......................
.........*............
.......====...........
......................
....q.......Y.........
###.....######...#####
###.....######...#####`,`
............
.....o.o....
C...........
############
############`,`
........................
........................
.....o......o.........o.
|..&.....G.....&...Y...|
########################
########################`,`
..........
..........
......E...
##########
##########`]});
