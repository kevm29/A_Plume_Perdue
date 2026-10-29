/* =========================================================
   TEXTES — Raymond se croit toujours en 1916
   ========================================================= */
const DEATH_Q={
  any:["Encore de la paille. D'où sort toute cette paille ?","Ça ne fait pas mal. C'est justement ça qui m'inquiète.","Je me sens plus léger. Pour un pigeon de mon grade, ce n'est pas bon signe.","Si quelqu'un demande, c'était volontaire.","Bizarre. J'aurais juré que c'était grave.","Article 7 : un pigeon ne meurt pas en service. Il y a sûrement un article 7 bis."],
  pins:["Épinglé comme un papillon. Et cette paille qui sort de nulle part…","Une épingle. On m'a pris pour un papillon. Vexant.","Aïe. Enfin, « aïe » de principe. Je ne sens rien. C'est nouveau."],
  wire:["Les barbelés. Ça, au moins, je connais.","Le barbelé garde ma paille. Le barbelé garde tout.","Accroché au barbelé. Comme la semaine dernière, devant le fort."],
  spikes:["Des pics anti-pigeons. Je vais écrire au ministère de la Guerre.","On décore les pigeons, et après on les empale. Belle reconnaissance."],
  glass:["Du verre partout. Ils ne balaient plus, à l'arrière ?"],
  pickets:["Une grille en fer forgé. Jolie. Pointue, surtout."],
  nails:["Des clous. Le charpentier n'a pas fini son travail."],
  rat:["Mordu par un rat. Il cherchait du grain, il a trouvé de la paille.","Un rat. Même ici, la vermine a ses entrées."],
  boar:["Un sanglier. Il ne m'a même pas vu. C'est presque pire.","Les sangliers ont pris le front. Personne ne les a arrêtés."],
  pigeon:["Bousculé par un pigeon de la ville. Aucune solidarité entre collègues.","Il m'a donné un coup de bec. Moi, un décoré !"],
  hedgehog:["Un hérisson. Je l'ai pris pour un tas de barbelés. Erreur de débutant."],
  goose:["Une oie. Plus dangereuse qu'un régiment de uhlans.","L'oie a gagné. L'oie gagne toujours."],
  cat:["Le chat. Toujours le chat.","Il m'a recraché. Même Bijou me trouve fade.","Note pour le règlement : ajouter un article sur les chats."],
  moth:["Les mites m'ont grignoté la cuisse. Elles appellent ça un buffet.","Tineola bisselliella. Petit nom, gros appétit."],
  crow:["Un corbeau. Ils ont toujours été du côté de l'ennemi.","Le corbeau m'a pris pour son déjeuner. Il a été déçu."],
  gull:["Une mouette. À Reims. Elle s'est perdue, ou c'est moi."],
  bag:["Assommé par un sac qui vole. Je ne sais même pas en quoi il est fait."],
  wasp:["Piqué par une guêpe. Elle visait la tarte, je crois."],
  bat:["Une chauve-souris. Elle voit dans le noir, pas moi. Ce n'est pas juste."],
  drone:["Le pigeon mécanique m'a rattrapé. Il ne transpire même pas.","Battu par une machine. Je proteste officiellement."],
  buse:["La buse. Elle a toujours voulu ma place. Elle l'a presque.","Rattrapé par une voisine de vitrine. L'humiliation est totale."],
  bolt:["La foudre. Comme au fort. Je… je me souviens d'un éclair.","Frappé par la foudre. Ma paille sent le roussi."],
  fall:["J'avais oublié de battre des ailes. Détail technique.","Il y avait un trou. Je l'ai trouvé.","Chute libre. La liberté, on ne me l'a jamais demandée."],
  drown:["De l'eau partout. Un pigeon empaillé, ça flotte mal."]
};
const TUFT_Q=["De la paille. Bizarre, je me sens tout de suite plus épais.","Tiens, de la paille. Je ne sais pas pourquoi, ça me fait du bien.","Encore de la paille. Je ne comprends pas, mais je ne me plains pas."];
const MEDAL_Q=["Une médaille du mérite colombophile. On me reconnaît enfin.","Une médaille. Je l'épinglerai à côté de l'autre. J'en avais une autre, non ?","Décoré. Le règlement prévoit un grain de maïs en plus. Je le réclamerai."];

const INTRO=[
  {t:"Vittoncourt, Moselle. Octobre 2026.\nLe petit musée communal n'a plus les moyens d'ouvrir."},
  {t:"Liquidation : le mammouth en plâtre et les papillons partent aux enchères.\nCe qui ne se vend pas finit à la benne."},
  {t:"… comme lui.",pic:'dome'},
  {title:"RAYMOND",t:"Pigeon voyageur, matricule 7413.\nTombé en service au fort de Vaux, juin 1916.\nEmpaillé avec les honneurs.\nLot n° 212 : invendu.",pic:'dome'},
  {t:"Un message est toujours attaché à sa patte.\nPersonne ne l'a jamais ouvert."},
  {t:"Cette nuit-là, il y a de l'orage.\nEt un visiteur qui n'a pas acheté de billet."}
];
/* cartes jouées entre les missions, après la dernière lettre de la mission */
const WORLD_CARDS=[
  null,
  [{t:"Raymond s'échappe par la fenêtre de la loge.\nIl vole mal. Il vole quand même."},
   {t:"Direction l'ouest : le pigeonnier Vasseur, à Villemareuil.\nIl connaît le chemin. Il l'a toujours connu."},
   {t:"Il a décidé de livrer la gifle.\nLe règlement est le règlement, même pour les goujats."},
   {title:"MISSION 2 · VERDUN",t:"Les champs de l'ancien front.\nRaymond trouve qu'on a beaucoup nettoyé."}],
  [{t:"Raymond quitte Verdun avec un trou de mémoire\nde la taille d'un fort."},
   {title:"MISSION 3 · REIMS",t:"Il s'oriente aux clochers, et la cathédrale de Reims est le plus gros de la région.\nC'est un détour. Il ne l'admettra jamais."}],
  [{t:"Les ratures ont rendu Raymond silencieux.\nLes pigeons de Reims, eux, ne se taisent jamais."},
   {title:"MISSION 4 · L'A4",t:"Une route immense, toute droite vers l'ouest, sans chevaux ni soldats.\nCette nuit, il pleut des cordes."}],
  [{t:"L'orage est passé. La lettre est trempée,\net Raymond sait maintenant ce qui est écrit au dos."},
   {title:"MISSION 5 · VILLEMAREUIL",t:"Le village est en fête.\nPersonne n'attend de pigeon."}]
];
const ENDING=[
  {pic:'tomb'},
  {t:"Le fils Garnier s'appelait Joseph. Elle l'a épousé, comme Lucien le voulait.\nElle n'a jamais reçu la lettre."},
  {pic:'banner'},
  {t:"Raymond fait le calcul. Deux fois.\n« 2026. Je suis… légèrement en retard. »"},
  {t:"Il voudrait pleurer.\nÀ l'empaillage, on lui a retiré ça aussi."},
  {t:"Il dépose la lettre sur la pierre. Mission accomplie.\nLe pigeonnier Vasseur n'existe plus. Il n'a nulle part où rentrer."},
  {t:"Alors il reste là, sur la tombe.\nIl ferme les yeux. De son plein gré, cette fois."},
  {pic:'finale',minT:10},
  {title:"FIN",t:"À Plume Perdue\nMerci d'avoir porté le courrier."}
];
/* intertitres muets avant la toute première lettre : pourquoi Raymond la lit */
const TUBE=[
  {t:"Dans la chute, le petit tube fixé à sa patte s'est fendu.\nLe papier dépasse, froissé, taché d'humidité."},
  {t:"Article 4 : un pigeon militaire ne lit jamais le courrier.\nArticle 4 bis : si le courrier est abîmé, il vérifie qu'il est lisible.\nRaymond vérifie. Un morceau à la fois, par discrétion."}
];
const GAMEOVER=[
  {pic:'headless',minT:3.2,t:"Raymond a perdu la tête.\nAu sens propre."}
];
const WORLDS=[
  {name:"Vittoncourt · le musée",levels:["La vitrine","La galerie des insectes","La salle du mammouth","La loge du gardien"]},
  {name:"Verdun",levels:["Les coquelicots","Les éoliennes","Le drone","La tranchée oubliée"]},
  {name:"Reims",levels:["Les toits","Les pics anti-pigeons","La gare","Le square"]},
  {name:"L'A4 sous l'orage",levels:["L'aire de repos","Les camions","L'orage","Le pont"]},
  {name:"Villemareuil",levels:["La fête du village","Le clocher","La buse","Le cimetière"]}
];
