# À Plume Perdue

*Une lettre, un pigeon empaillé, un siècle de retard.*

Jeu de plateforme 2D en diorama de papier découpé, avec de l'humour noir et absurde.

Raymond, pigeon voyageur tombé en mission le 3 juin 1916 puis empaillé, dort sous une cloche dans le petit musée communal de Vittoncourt, qui ferme faute de moyens. Une nuit d'orage, un voleur fait tomber un carton sur sa cloche, et un éclair le réveille. Raymond croit qu'on bombarde et qu'on est toujours en 1916. Une lettre de poilu est encore attachée à sa patte, et le règlement est formel : un pigeon ne quitte pas le service avant d'avoir remis son message. Il traverse Verdun, Reims et l'A4 jusqu'à Villemareuil, le village de Marguerite. Il ne comprendra qu'à la fête du village qu'il a cent dix ans de retard, et devant la tombe de Marguerite ce qu'il est devenu.

## Jouer

Ouvrir `index.html` dans un navigateur récent. Le jeu tient dans un seul fichier, sans installation.

Pour le jouer en ligne, active GitHub Pages (Settings → Pages → branche `main`, dossier racine). Il sera alors disponible à l'adresse `https://kevm29.github.io/A_Plume_Perdue/`.

### Commandes

| Action | Clavier | Tactile |
|---|---|---|
| Se déplacer | ← → ou Q / D (A / D en QWERTY) | ◀ ▶ |
| Sauter | Espace, Z ou ↑ | SAUT |
| Battre des ailes (2 fois max, selon la robustesse) | Rappuyer en l'air | SAUT en l'air |
| Planer | Maintenir le saut en tombant | Maintenir SAUT |
| Attraper, tirer, ouvrir (le bec) | E ou F | E |
| Pause | Échap ou P | ❚❚ |
| Retour à l'accueil (perd l'avancement de la mission) | icône maison en haut à gauche, ou menu Pause | icône maison |
| Revenir au dernier cartel | R | menu Pause |
| Couper le son | M | menu Pause |

La progression est sauvegardée dans le navigateur.

## Succès

Un écran « Succès » apparaît sur l'accueil dès le premier débloqué. 28 succès pour l'instant (les autres seront choisis plus tard), chacun avec son médaillon et un bandeau à l'obtention.

## Mécaniques

- **L'état de Raymond (5 crans).** Chaque chute l'abîme d'un cran et le renvoie au dernier cartel : paille qui dépasse, pansement, bandeau, puis un bouton à la place de l'œil. Chaque touffe de paille ramassée le répare d'un cran. Une chute de plus au cinquième cran, et il perd la tête.
- **La robustesse des ailes.** Une petite jauge au-dessus de Raymond. Un battement coûte 30, planer 15 par seconde ; posé, elle remonte de 30 par seconde (une seconde par battement). Vidée, l'aile se « découd » : plus de battement ni de vol plané tant qu'elle n'est pas remontée à 60. Le saut simple reste toujours possible.
- **Les vies.** Raymond commence sans aucune vie en réserve. Il n'y a qu'**une médaille par mission** (au 1-1, puis au deuxième niveau de chaque mission) : chacune donne une vie. Une chute le renvoie au dernier cartel, ou au début du niveau. Quand il perd la tête, une vie le ramène au début de la mission (ses 4 niveaux), recousu à neuf. Sans vie, tout recommence depuis l'introduction.
- **Rien ne se prend deux fois.** Après une mort avec une vie, la paille, la médaille et la cachette déjà trouvées dans une partie ne réapparaissent pas : le score garde ce qui a été pris, et il ne reste à prendre que le reste.
- **Après chaque niveau**, un court bilan. **La lettre ne se lit qu'à la fin de chaque mission** (ses quatre morceaux d'un coup), suivie du bilan de points de la mission. **Le score d'un niveau, c'est ce qu'on y a trouvé** : 10 points par paille, par médaille et par cachette, affiché sur le total possible.
- **Les épingles** gardent la paille de Raymond quand il s'y pique (à découvrir).
- **Les cartels** (panneaux « ART. » dehors) servent de points de sauvegarde.
- **À collecter** : des touffes de paille, une médaille par mission (la Croix du mérite colombophile) et **une cachette secrète par niveau** : un meuble, une boîte aux lettres, une caisse ou un vase qui s'ouvre avec E et cache une touffe de paille. Le 1-1 en a trois : la porte par où le voleur est sorti, le carton FRAGILE tombé sur la cloche (trois coups de bec pour l'ouvrir : il contient de la paille de calage… et une enclume) et un passage creusé dans la pile de cartons. Au 1-2, il faut entrer dans le grand carton blanc par le milieu de son flanc droit ; au 1-3, une planche invisible sur la tête du mammouth mène à une planche qu'on ne voit que de là-haut. Le 2-2 en a deux : une bille lâchée sur le pont de *La Colombe* fait sortir le marinier, qui râle, regarde le ciel et rentre sans refermer sa porte ; et le tracteur garé dans le chaume, entre le tourbillon et la sortie, qu'on ne trouve qu'en revenant à pied depuis la sortie. Au 2-3, une vieille souche au milieu de la forêt cache de la paille, et la lanterne qui clignote au bout de l'abri allemand aussi (on l'attrape en sautant) : un corbeau s'envole… et le drone le prend en chasse. On entre dans l'abri par sa porte, avec E. Au 2-4, perché au-dessus de l'officier allemand de cire, Raymond lâche enfin une vraie fiente, la seule du jeu.
- **La bille.** Perché sur quelque chose, E sans rien à attraper : Raymond lâche… une bille de verre (il est empaillé). Elle rebondit ; les bêtes et les gardiens proches se tournent vers le bruit, et les chats qui somnolent bondissent.
- **Les cartels** s'affichent trois secondes ; pour relire, s'éloigner puis revenir.
- **L'action E** s'apprend au 1-1 (une poignée ouvre un portillon). Caché sous un drap, quand un gardien passe tout près, E lui jette le drap sur la tête (rien ne l'annonce dans le jeu) : il se débat une seconde, l'arrache, balaie toute la pièce de sa lampe, puis reprend sa ronde plus vite, furieux. Le drap reste par terre et découvre un meuble farfelu (buste qui louche, statue « Pudeur », ours en caleçon, comtoise à moustache, mannequin en corset) : la cachette est perdue jusqu'au prochain retour au cartel. Le chat aux yeux brillants s'y emmêle de la même façon s'il vous poursuit jusque sous un drap.
- **Choisir un niveau** (écran d'accueil ou menu Pause) : les niveaux déjà atteints, l'introduction, et la fin une fois le jeu terminé (tout est ouvert en mode caché).
- **Mode caché** : sur l'écran d'accueil, cliquer quatre fois de suite sur l'œil fermé de Raymond, sous la cloche. Il roucoule : vies illimitées (∞), invincibilité totale (une chute hors du niveau ramène au cartel), ailes inépuisables, et tous les niveaux ouverts dans « Choisir un niveau ». Quatre clics de plus pour revenir au mode normal.

### Une mécanique par mission

Chaque mission a ses propres mécaniques et sa propre faune. Le niveau 3 est toujours un boss ; le niveau 4 est plus dur mais moins stressant.

| Mission | Mécaniques | Boss (niveau 3) |
|---|---|---|
| 1 · Vittoncourt | Gardien de nuit et sa lampe (se cacher sous les draps), étage plongé dans le noir où seuls les éclairs montrent le chemin, chat aux yeux brillants (ne plus bouger quand ils s'allument, sinon il bondit et poursuit), gardien sous le mammouth (passer par-dessus) | Le gardien au filet à papillons, endormi sur sa chaise jusqu'à ce qu'on passe devant lui |
| 2 · Retour à la case départ | Chasseurs cachés dans les buissons qui tirent sur tout ce qui vole (traverser à pied), sangliers et marcassins (quand il charge, le sanglier ne voit pas les trous : un creux près de chacun), branches d'arbres, terrain miné où l'on se pose sur les panneaux DANGER, boue qui enlise si on s'arrête, brouillard où seuls les coquelicots marquent le sol ferme, trous d'obus qui s'effondrent, rafales qui repoussent (s'abriter derrière une meule, un tronc ou une cargaison), péniches qui descendent la Meuse dans la profondeur de l'écran, meules d'où sortent des rats, tourbillon de foin qui emporte Raymond entre les pales des éoliennes, obus non explosés derrière les barbelés, trous d'obus pleins d'eau où les sangliers qui chargent finissent leur course, feuillage qui cache du drone, placards où se cacher des gardiens, automates de soldats dans des scènes reconstituées, chariot suspendu sous les barbelés | Le drone, au-dessus de la zone rouge |
| 3 · Le cap céleste | Le train : pylônes caténaires à sauter, passerelle sous laquelle rester à plat, bouteilles qui roulent au gré des secousses, voyageurs qui jettent ce qu'ils ont sous la main s'ils voient Raymond sauter devant eux, serveur de la voiture-bar ; puis auvents qui font rebondir, tramway dont le toit sert de perchoir, puis escalade de la cathédrale : volets qui s'ouvrent et se ferment, gargouilles qui crachent | La balayeuse municipale |
| 4 · L'A4 | Rafales de face (s'abriter derrière barrières et camions), toits des camions, foudre annoncée au sol | L'orage : l'écran avance tout seul |
| 5 · Villemareuil | Cloches qui se balancent (leur onde étourdit), chevaux de bois et ballons de la fête foraine | La buse empaillée, qui finit par prendre feu |

## Les 20 niveaux

| Mission | Niveaux |
|---|---|
| 1 · Vittoncourt, le musée | La vitrine · La galerie des insectes · L'étage du mammouth · La loge du gardien |
| 2 · Retour à la case départ | Le sentier (champs, bois, terrain miné, tranchée, monument aux enfants de Verdun) · Les éoliennes (champ éolien de Bras, la Meuse sur trois péniches, saules et ronces, meules à rats, tourbillon de foin au-dessus du chaume) · La zone rouge (forêt de Verdun au début du soir, trous d'obus pleins d'eau, obus non explosés derrière les barbelés, arbres tombés, restes de tranchée, le drone, l'abri allemand du Mort-Homme) · L'abri du Mort-Homme (l'abri allemand — devenu musée, mais Raymond ne le sait pas — la nuit : gardiens, draps, placards, automates de soldats, tranchées, sortie en vol par une meurtrière) |
| 3 · Le cap céleste | Le train (toits, voiture de voyageurs en coupe, voiture-bar, arrivée en gare) · La gare · La place d'Erlon · La cathédrale |
| 4 · L'A4 sous l'orage | L'aire de repos · Les camions · L'orage · Le pont |
| 5 · Villemareuil | La route du village · Le clocher · La fête foraine · Le cimetière |

Le scénario complet, y compris la fin, est dans [`docs/histoire.md`](docs/histoire.md). **Attention, ce fichier divulgue toute l'histoire.**

## Technique

- HTML5 Canvas et JavaScript, sans dépendance. Seules les polices viennent de Google Fonts (IM Fell English, La Belle Aurore).
- Tous les graphismes sont dessinés par le code : plans en parallaxe, tuiles extrudées pour l'effet 3D, éclairage dynamique, grain de pellicule. Au 2-2, la Meuse, les péniches et les éoliennes du fond sont dessinées en vraie perspective, vers un point de fuite qui suit la caméra (`src/11f_meuse.js`).
- La musique et les bruitages sont synthétisés en direct avec la Web Audio API : un morceau par lieu, plus un morceau de poursuite.
- Le code source est découpé dans `src/` (moteur, décors, personnages, niveaux, textes, musique). `./build.sh` les assemble dans `index.html`, qui reste le seul fichier à distribuer.
- Une version Windows (.exe, via Electron) est prévue dans un dossier `windows/`.
