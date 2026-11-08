/* =========================================================
   TEXTES — Raymond se croit toujours en 1916
   ========================================================= */
const DEATH_Q={
  camion:["Écrasé par un semi-remorque. Il ne m'a même pas vu. Personne ne regarde jamais les pigeons.","Le camion est arrivé avant que je saute. Il fallait sauter à la lumière."],
  pont:["Le pont m'a raboté. On ne reste pas sur un toit de camion sous un pont : c'est écrit sur le panneau.","Aplati sous le tablier. 3,50 m, ils disaient. Pas pour un pigeon debout sur un camion."],
  objet:["Une chaussure en pleine tête. Ce n'est même pas à moi qu'elle était destinée.","Pris entre deux feux. Les civils sont pires que les artilleurs."],
  benne:["La benne s'est levée sur moi. Il fallait attendre qu'elle redescende.","Renversé par la benne. Le règlement dit d'attendre son tour."],
  goudron:["Englué dans le goudron chaud. Plumé, goudronné… il ne manque que les plumes.","Une coulée de goudron. Ça colle, ça brûle, et ça ne pardonne pas."],
  rouleau:["Aplani par le rouleau. Lisse comme la route.","Le rouleau est revenu plus vite que prévu. Il fallait sauter au bon moment."],
  ouvriers:["Les cantonniers m'ont attrapé au vol. Ils discutaient, pourtant.","Un coup de casque d'ouvrier. Ils ne plaisantent pas, sur les chantiers."],
  bigrat:["Le gros rat blanc m'a rattrapé. Il avait les dents plus longues que mes ambitions.","Mordu par le roi des rats du cours Langlet. Il fallait courir, pas flâner."],
  sauteur:["Un pigeon de parvis m'a sauté dessus. Ils sont chez eux, ici, et ils le font savoir.","Percuté en plein vol par un costaud du parvis."],
  chien:["Les chiens de l'aire ont le sommeil léger. Et les dents longues.","Rattrapé par un chien errant. Il fallait marcher, pas sauter.","Un chien m'a eu. Il n'avait pas mangé depuis l'Argonne, lui non plus."],
  client:["Un client m'a vu. Il a crié « Pigeon ! » et il a balancé son sandwich.","Pris dans les bras d'un voyageur affolé. Pas de quoi être fier."],
  caissiere:["La caissière a frappé avec le classeur des tickets. Fin de la discussion.","Pas sur son comptoir. Elle l'avait bien dit."],
  dineur:["Bam, sur la table. J'étais dessous la main.","Les dîneurs n'aiment pas les pigeons au milieu du plat du jour."],
  mendiant:["Il m'a demandé une miette. J'ai voulu passer. Il s'est accroché à mes plumes.","Bousculé par un mendiant. Il n'avait rien, et maintenant moi non plus."],
  crachat:["Une gargouille m'a craché dessus. Huit cents ans de pratique.","Douché par une gargouille. On apprend l'humilité, à Reims."],
  jetPierre:["Pris dans le jet d'une grande gargouille. Elle balaie comme un tuyau d'arrosage.","Le jet m'a balayé de la corniche. Il fallait attendre qu'il passe."],
  fiente:["Une fiente, en plein sur la tête. Le comble, pour un pigeon.","Bombardé par un collègue. Aucune solidarité dans ce clocher."],
  any:["Encore de la paille. D'où sort toute cette paille ?","Ça ne fait pas mal. C'est justement ça qui m'inquiète.","Je me sens plus léger. Pour un pigeon de mon grade, ce n'est pas bon signe.","Si quelqu'un demande, c'était volontaire.","Bizarre. J'aurais juré que c'était grave.","Article 7 : un pigeon ne meurt pas en service. Il y a sûrement un article 7 bis."],
  pins:["Épinglé comme un papillon. Et cette paille qui sort de nulle part…","Une épingle. On m'a pris pour un papillon. Vexant.","Aïe. Enfin, « aïe » de principe. Je ne sens rien. C'est nouveau."],
  wire:["Les barbelés. Ça, au moins, je connais.","Le barbelé garde ma paille. Le barbelé garde tout.","Accroché au barbelé. Comme la semaine dernière, devant le fort."],
  spikes:["Des pics anti-pigeons. Je vais écrire au ministère de la Guerre.","On décore les pigeons, et après on les empale. Belle reconnaissance."],
  glass:["Du verre partout. Ils ne balaient plus, à l'arrière ?"],
  pickets:["Une grille en fer forgé. Jolie. Pointue, surtout."],
  nails:["Des clous. Le charpentier n'a pas fini son travail."],
  rat:["Mordu par un rat. Il cherchait du grain, il s'est contenté de moi.","Un rat. Même ici, la vermine a ses entrées."],
  grenade:["Une grenade. Lâchée par un pigeon de métal. La guerre a bien changé.","Boum. Le règlement disait de se jeter à plat ventre. Je l'ai fait. Trop tard."],
  hunter:["Du plomb dans l'aile. Au sens propre.","Tiré comme un faisan. Moi, un pigeon militaire !","Je ne suis pas du gibier. Je suis du courrier."],
  bramble:["Des ronces. Ça pique.","Pris dans les ronces. Pas très glorieux."],
  mole:["Mordu par une taupe. Elle n'a même pas regardé : elle ne voit rien.","Une taupe. Le génie souterrain a toujours eu l'avantage de la surprise."],
  mine:["Elle a fait clic, puis boum. Dans cet ordre, au moins.","Une mine. On ne marche pas sur une mine. Je le savais, pourtant."],
  piglet:["Rattrapé par un marcassin. Je ne le dirai à personne.","Les marcassins courent plus vite que la gloire."],
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
  guard:["Repéré. Le gardien m'a ramené au cartel, avec des pincettes.","Pris dans la lumière, comme un lapin. Un lapin décoré.","Il m'a vu. Il n'a pas eu l'air surpris de voir un pigeon se promener dans un musée en pleine nuit. Bizarre."],
  catwatch:["Il m'a vu bouger. Un chat, ça voit tout, même les yeux fermés.","J'ai bougé. Erreur de débutant."],
  guardnet:["Pris au filet comme un papillon. Le docteur Laffont aurait été ravi.","Le filet. Vexant."],
  mud:["La boue d'ici. Elle ne rend jamais rien.","Englouti. Il fallait avancer, ne jamais s'arrêter."],
  water:["Une gargouille m'a craché dessus. Même les statues m'en veulent."],
  fire:["Trop près du feu. La paille, ça n'aime pas ça."],
  storm:["L'orage m'a rattrapé. Il ne fallait pas traîner."],
  sweeper:["Aspiré par la balayeuse. Classé avec les mégots.","Ramassé par la voirie. Comme un vieux journal."],
  blade:["Coupé net par un moulin. Le meunier ne s'est même pas excusé.","Fauché par une aile de moulin. Ma paille vole en trois morceaux.","Haché menu, comme du tabac de troupe."],
  obus:["Un vieil obus qui dépassait à peine. Il attendait quelqu'un depuis longtemps. Il n'a pas raté son tour.","Le nez d'un obus. Il a suffi d'une patte. Le génie aurait dû passer avant moi.","Boum. Un vieux de la vieille, qui n'avait pas dit son dernier mot."],
  trou:["Tombé dans un trou d'obus. L'eau y croupit depuis des années, et moi avec.","Un trou d'obus plein d'eau. Le ciel s'y reflétait si bien que je n'ai pas vu le fond."],
  fourgonnette:["Renversé par la fourgonnette du ravitaillement. Livré avec les sandwichs.","Une voiture sur un quai. Je ne l'avais pas prévue, celle-là."],
  voiture:["Écrasé sur le cours de la Gare. Il fallait monter dessus, pas passer devant.","Une automobile. Même pas un cheval pour avoir pitié."],
  passant:["Un voyageur m'a balayé du revers de la main. Comme une miette.","Pris dans les roulettes d'une valise. Quelle fin."],
  pigeonGros:["Un gros pigeon de ville. Il m'a regardé de haut, puis de très près.","Bousculé par un costaud du square. Aucune camaraderie."],
  pigeonDeplume:["Rattrapé par un déplumé. Il court plus vite qu'il n'a l'air.","Ce pigeon tout nu m'a mis à terre. Je n'en parlerai à personne."],
  graine:["Une graine, crachée en plein bec. Il visait bien, le vieux.","Je l'ai survolé : il m'a craché sa graine. Il fallait passer devant lui."],
  tram:["Renversé par le tramway. Il a sonné, pourtant. Deux fois.","Le tramway ne s'arrête pas pour les pigeons. Ni pour personne, d'ailleurs."],
  touristes:["Piétiné par une troupe de touristes. Ils m'ont pris en photo, au moins.","Bousculé par un visiteur qui regardait en l'air."],
  pylone:["Un pylône en pleine figure. Le train, lui, ne s'est même pas arrêté.","Emporté par un poteau. Je ne savais pas que les poteaux voyageaient.","Le pylône m'a cueilli comme une prune. Il fallait sauter."],
  passerelle:["Un pont. J'ai sauté pile dedans. Il fallait rester à plat.","La passerelle m'a ramassé au vol. Ce n'était pas un pylône, c'était pire."],
  bouteille:["Une canette m'a fauché les pattes. Abattu par un soda.","Une bouteille qui roule. Le bowling, version pigeon."],
  projectile:["Touché par un voyageur. Ils visent mieux que les artilleurs.","Un journal en pleine tête. Au moins, j'aurai lu les nouvelles."],
  serveur:["Un coup de torchon. Le serveur n'aime pas les pigeons au comptoir.","Chassé du bar comme un client sans le sou."],
  rails:["Tombé sous le train. Le règlement ne prévoit même pas ce cas.","Entre les wagons, il n'y a que les rails. Et maintenant moi."],
  elec:["Une décharge ! Ma paille fume. Ça sent le foin grillé.","Le fil de fer était chargé comme un canon. Je le saurai."],
  chien:["Le chien. La chaîne était plus longue que je ne pensais. Ou c'est moi qui suis plus court.","Mordu. Il fallait regarder où l'herbe est usée : c'est là qu'il peut aller."],
  chat:["Un coup de patte. Le chat ne bouge pas de son mur ; il attend les pigeons qui passent trop près.","Le chat m'a fauché. Il n'a même pas ouvert les deux yeux."],
  heron:["Le héron. Il m'a pris pour un gardon. Vexant.","Un coup de bec de héron. Il frappe à intervalles réguliers, comme un mortier."],
  ballon:["Un ballon en pleine tête. Lucarne. But.","Le ballon. Ils ont tiré au ras du sol, cette fois."],
  enfant:["Bousculé par un gamin. Il ne m'a même pas vu.","Un enfant m'a percuté. Ils courent partout, ces petits."],
  velo:["Le vélo. Il avait sonné, pourtant. Deux fois.","Écrasé par un vélo. Le casque, c'était pour lui, pas pour moi."],
  tondeuse:["La tondeuse toute seule. Une machine qui tond sans personne. Tout fout le camp.","Happé par la tondeuse automatique. Je n'ai pas compris qui la conduisait."],
  ecureuil:["Un écureuil m'est tombé dessus. Il descendait chercher une noisette. Je n'étais pas une noisette.","Percuté par un écureuil pressé. Il fallait passer quand il remontait."],
  poisson:["Un poisson m'a sauté au bec. On n'attend pas d'un poisson qu'il vole. Lui non plus, sans doute.","Fauché par une carpe en plein saut. La Marne a de l'humour."],
  foule:["Piétiné. Toute la commune m'est passée dessus, et personne ne s'est excusé.","Une forêt de jambes. Je m'y suis perdu, et elles ne regardaient pas où elles marchaient.","Bousculé par la foule. Pour eux, un pigeon, c'est un pavé qui bouge."],
  chienLaisse:["Le chien en laisse. La laisse était plus longue que prévu. Une laisse à enrouleur : on n'arrête pas le progrès.","Happé par un toutou. Sa maîtresse a crié « Lâche ça, c'est sale ! ». Je ne suis pas sale. Je suis décoré."],
  mouette:["Une mouette, à Crécy. Elle visait le poissonnier, elle a eu le pigeon.","Fauché par une mouette en piqué. Elle n'a même pas freiné."],
  grill:["Les flammes du barbecue. Je sens la merguez, maintenant.","Grillé. Le cuisinier a eu plus peur que moi, et c'est lui qui tenait les pinces."],
  abeille:["Une abeille. Elle allait aux fleurs ; j'étais sur son chemin.","Piqué par une abeille. Elle ne s'en remettra pas, paraît-il. Moi non plus, sur le moment."],
  chatToit:["Le chat sur le toit du crêpier. Un coup de patte, sans même se lever.","Fauché par le chat. Il gardait les crêpes. Ou il m'attendait."],
  chatRue:["Un chat errant. Pour lui, la fête, c'était moi.","Le chat s'est ramassé, puis il a bondi. Dans cet ordre. J'aurais dû regarder."],
  pigeonsToit:["Les pigeons du toit. Ils sont chez eux, et ils me l'ont fait comprendre.","Chassé par toute une bande. Pas un pour reconnaître un sergent."],
  hibou:["Un hibou. Il fond sans un bruit sur tout ce qui bouge. J'ai bougé.","Emporté par un hibou. Il m'a pris pour un mulot. C'est vexant, pour un sergent."],
  voute:["Tombé dans le noir, entre deux poutres. Tout en bas, la voûte. Et dessous, la nef.","Pas de fond, dans ces combles. Enfin si : la voûte, très dure, très loin."],
  pie:["La pie. Elle vole tout ce qui brille. Visiblement, aussi les pigeons.","Bousculée par une pie. Elle jacasse encore."],
  gerbe:["Une gerbe d'obus. La Marne s'est levée d'un coup et m'a retourné.","Un obus dans l'eau. Il fallait regarder où la rivière frémissait."],
  drown:["De l'eau partout. Je coule comme une pierre. D'habitude, un pigeon, ça flotte. Bizarre."]
};
const TUFT_Q=["De la paille. Bizarre, je me sens tout de suite plus épais.","Tiens, de la paille. Je ne sais pas pourquoi, ça me fait du bien.","Encore de la paille. Je ne comprends pas, mais je ne me plains pas."];
const MEDAL_Q=["Une médaille du mérite colombophile. On me reconnaît enfin.","Une médaille. Je l'épinglerai à côté de l'autre. J'en avais une autre, non ?","Décoré. Le règlement prévoit un grain de maïs en plus. Je le réclamerai."];

const INTRO=[
  {t:"Vittoncourt, Moselle. Octobre 2026.\nLe petit musée communal n'a plus les moyens d'ouvrir."},
  {t:"Liquidation : le mammouth en plâtre et les papillons partent aux enchères.\nCe qui ne se vend pas finit à la benne."},
  {t:"… comme lui.",pic:'dome'},
  {title:"RAYMOND",t:"Sergent Raymond, pigeon voyageur, matricule 7413.\nTombé en service au fort de Vaux, juin 1916.\nEmpaillé avec les honneurs.\nLot n° 212 : invendu.",pic:'dome'},
  {t:"Un message est toujours attaché à sa patte.\nPersonne ne l'a jamais ouvert."},
  {t:"Cette nuit-là, il y a de l'orage.\nEt un visiteur qui n'a pas acheté de billet."}
];
/* cartes jouées entre les missions, après la dernière lettre de la mission */
const WORLD_CARDS=[
  null,
  [{t:"Raymond s'échappe par la fenêtre de la loge.\nIl vole mal. Il vole quand même."},
   {t:"Direction l'ouest : le pigeonnier Vasseur, à Crécy-la-Chapelle.\nIl connaît le chemin. Il l'a toujours connu."},
   {t:"Il a décidé de livrer la gifle.\nLe règlement est le règlement, même pour les goujats."},
   {title:"MISSION 2 · RETOUR À LA CASE DÉPART",t:"Des champs rouges à perte de vue.\nRaymond a l'impression d'être déjà passé par là."}],
  [{t:"Raymond doit rentrer au pigeonnier Vasseur, à Crécy-la-Chapelle.\nMais il ne reconnaît plus le pays."},
   {t:"Des forêts ont poussé sur le front, des moulins géants sur les champs.\nCette végétation étonnante le gêne : il n'a plus un seul repère."},
   {t:"Au loin, il aperçoit un clocher, le plus haut de la région.\nRaymond se souvient de l'avoir déjà croisé, en 1915."},
   {title:"MISSION 3 · LE CAP CÉLESTE",t:"Raymond décide de mettre le cap sur ce clocher. Il ne sait pas où il se trouve.\nC'est Reims."}],
  [{t:"Les ratures ont rendu Raymond silencieux.\nLes pigeons de Reims, eux, ne se taisent jamais."},
   {t:"Du haut de la cathédrale, Raymond aperçoit un grand axe qui file vers l'ouest.\nAu loin, il reconnaît les paysages."},
   {t:"Il décide d'y filer. Une route immense, sans chevaux ni soldats,\noù des lumières roulent toute la nuit."},
   {title:"MISSION 4 · L'A4",t:"C'est l'A4. Il fait nuit, et les camions roulent vite."}],
  [{t:"L'orage est passé. La lettre est trempée,\net Raymond sait maintenant ce qui est écrit au dos."},
   {title:"MISSION 5 · CRÉCY-LA-CHAPELLE",t:"Le village est en fête.\nPersonne n'attend de pigeon."}]
];
const ENDING=[
  {t:"Cent dix ans. Aucun pigeon ne vit cent dix ans."},
  {t:"« Alors qu'est-ce que je suis ? »\nIl regarde sa patte. Une couture. Un brin de paille qui dépasse."},
  {t:"La paille qui s'envolait à chaque chute. La buse qui a flambé comme une botte de foin.\nTout s'explique, d'un coup."},
  {t:"Il n'est pas un pigeon qui a survécu.\nIl est ce qu'il en reste."},
  {t:"Il voudrait pleurer.\nÀ l'empaillage, on lui a retiré ça aussi."},
  {t:"Il dépose la lettre sur la pierre. Mission accomplie.\nLe pigeonnier Vasseur n'existe plus. Il n'a nulle part où rentrer."},
  {t:"Alors il reste là, sur la tombe.\nIl ferme les yeux. De son plein gré, cette fois."},
  {pic:'finale',minT:10},
  {title:"FIN",t:"À Plume Perdue\nMerci d'avoir porté le courrier."}
];
/* la fête foraine (fin du niveau 5-3) : Raymond apprend la date */
const DATE_CARDS=[
  {pic:'banner'},
  {t:"Raymond fait le calcul. Deux fois.\n« 2026. »"},
  {t:"Cent dix ans. La guerre est finie depuis longtemps.\nLucien, le capitaine, les gars du 142e : tout le monde."},
  {t:"Au milieu des flonflons, Raymond s'effondre.\nPersonne ne remarque un pigeon par terre."}
];
/* intertitres muets avant les morceaux de lettre d'une mission (la mission 1 a TUBE) */
const LETTER_CARDS={
  1:[{t:"Raymond n'a pas croisé Lucien.\nNi dans les champs, ni sous les bois, ni dans l'abri."},
     {t:"Hormis cet abri, Raymond en conclut que les Allemands ont été repoussés plus loin.\nPour lui, Lucien Vasseur doit y être, en première ligne."},
     {t:"Raymond l'a déjà vu à l'œuvre : à ses yeux, Lucien est un brave, un héros.\nMais il le trouve si goujat…"},
     {t:"L'article 4 interdit de lire le courrier. Raymond le connaît par cœur.\nMais il ne comprend pas le comportement de son maître."},
     {t:"La curiosité l'emporte : Raymond déplie la suite."}]
};
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
  {name:"Retour à la case départ",levels:["Le sentier","Les éoliennes","La zone rouge","L'abri du Mort-Homme"]},
  {name:"Le cap céleste",levels:["Le train","La gare","Le cours Langlet","La cathédrale"]},
  {name:"L'A4 sous l'orage",levels:["L'autoroute de l'Est","L'aire de Gueux","L'orage","La Marne"]},
  {name:"Crécy-la-Chapelle",levels:["Le pigeonnier","Les combles","Elle aimait les fêtes","Le cimetière"]}
];
