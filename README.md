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
| Battre des ailes (2 fois max) | Rappuyer en l'air | SAUT en l'air |
| Planer | Maintenir le saut en tombant | Maintenir SAUT |
| Pause | Échap ou P | ❚❚ |
| Revenir au dernier cartel | R | menu Pause |
| Couper le son | M | menu Pause |

La progression est sauvegardée dans le navigateur.

## Mécaniques

- **L'état de Raymond (5 crans).** Chaque chute l'abîme d'un cran et le renvoie au dernier cartel : paille qui dépasse, pansement, bandeau, puis un bouton à la place de l'œil. Chaque touffe de paille ramassée le répare d'un cran. Une chute de plus au cinquième cran, et il perd la tête.
- **Les vies.** Raymond commence sans aucune vie en réserve : la première médaille trouvée devient vite vitale. Chaque médaille trouvée en donne une de plus (une seule fois par niveau). Une chute le renvoie au dernier cartel, ou au début du niveau. Quand il perd la tête, une vie le ramène au début de la mission (ses 4 niveaux), recousu à neuf. Sans vie, tout recommence depuis l'introduction.
- **Après chaque niveau**, un court bilan. **La lettre ne se lit qu'à la fin de chaque mission** (ses quatre morceaux d'un coup), suivie du bilan de points de la mission : 10 par touffe de paille, 100 la médaille, 50 sans aucune chute, 15 de moins par chute.
- **Les épingles** gardent la paille de Raymond quand il s'y pique (à découvrir).
- **Les cartels** (panneaux « ART. » dehors) servent de points de sauvegarde.
- **À collecter** : des touffes de paille et une médaille cachée par niveau (la Croix du mérite colombophile).
- **Choisir un niveau** (écran d'accueil ou menu Pause) : les 20 niveaux sont accessibles directement, ainsi que l'introduction et la fin.
- **Mode vies illimitées (caché)** : sur l'écran d'accueil, cliquer sur l'œil fermé de Raymond, sous la cloche. Il fait un clin d'œil, et le compteur affiche ∞ : Raymond ne perd plus jamais la tête. Recliquer pour revenir au mode normal.

### Une mécanique par mission

Chaque mission a ses propres mécaniques et sa propre faune. Le niveau 3 est toujours un boss ; le niveau 4 est plus dur mais moins stressant.

| Mission | Mécaniques | Boss (niveau 3) |
|---|---|---|
| 1 · Vittoncourt | Gardien de nuit et sa lampe (se cacher sous les draps), étage plongé dans le noir où seuls les éclairs montrent le chemin, chat aux yeux brillants (ne plus bouger quand ils s'allument) | Le gardien au filet à papillons |
| 2 · Verdun | Boue qui enlise si on s'arrête, brouillard où seuls les coquelicots marquent le sol ferme, trous d'obus qui s'effondrent, rafales des éoliennes | Le drone, dans le brouillard |
| 3 · Reims | Auvents qui font rebondir, tramway dont le toit sert de perchoir, puis escalade de la cathédrale : volets qui s'ouvrent et se ferment, gargouilles qui crachent | La balayeuse municipale |
| 4 · L'A4 | Rafales de face (s'abriter derrière barrières et camions), toits des camions, foudre annoncée au sol | L'orage : l'écran avance tout seul |
| 5 · Villemareuil | Cloches qui se balancent (leur onde étourdit), chevaux de bois et ballons de la fête foraine | La buse empaillée, qui finit par prendre feu |

## Les 20 niveaux

| Mission | Niveaux |
|---|---|
| 1 · Vittoncourt, le musée | La vitrine · La galerie des insectes · L'étage du mammouth · La loge du gardien |
| 2 · Verdun | Les coquelicots · Les éoliennes · Le drone · La tranchée oubliée |
| 3 · Reims | La rue de Vesle · La gare · La place d'Erlon · La cathédrale |
| 4 · L'A4 sous l'orage | L'aire de repos · Les camions · L'orage · Le pont |
| 5 · Villemareuil | La route du village · Le clocher · La fête foraine · Le cimetière |

Le scénario complet, y compris la fin, est dans [`docs/histoire.md`](docs/histoire.md). **Attention, ce fichier divulgue toute l'histoire.**

## Technique

- HTML5 Canvas et JavaScript, sans dépendance. Seules les polices viennent de Google Fonts (IM Fell English, La Belle Aurore).
- Tous les graphismes sont dessinés par le code : plans en parallaxe, tuiles extrudées pour l'effet 3D, éclairage dynamique, grain de pellicule.
- La musique et les bruitages sont synthétisés en direct avec la Web Audio API : un morceau par lieu, plus un morceau de poursuite.
- Le code source est découpé dans `src/` (moteur, décors, personnages, niveaux, textes, musique). `./build.sh` les assemble dans `index.html`, qui reste le seul fichier à distribuer.
- Une version Windows (.exe, via Electron) est prévue dans un dossier `windows/`.
