# À Plume Perdue

*Une lettre, un pigeon empaillé, un siècle de retard.*

Jeu de plateforme 2D en diorama de papier découpé, avec de l'humour noir et absurde.

Raymond, pigeon voyageur tombé en mission le 3 juin 1916 puis empaillé, dort sous une cloche dans le petit musée communal de Vittoncourt, qui ferme faute de moyens. Une nuit d'orage, un voleur fait tomber un carton sur sa cloche, et un éclair le réveille. Raymond croit qu'on bombarde et qu'on est toujours en 1916. Une lettre de poilu est encore attachée à sa patte, et le règlement est formel : un pigeon ne quitte pas le service avant d'avoir remis son message. Il traverse Verdun, Reims et l'A4 jusqu'à Villemareuil, le village de Marguerite, sans savoir qu'il a cent dix ans de retard.

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

- **Les vies (la paille).** Raymond a 3 vies pour la première étape. Au début de chaque étape suivante, il gagne autant de vies que de médailles trouvées pendant l'étape précédente. S'il n'a plus de paille, l'étape recommence avec les vies qu'il avait en y entrant.
- **Rembourrage.** À chaque mort, Raymond se rafistole un peu plus : paille qui dépasse, pansements, puis un bouton à la place de l'œil. Chaque touffe de paille ramassée le rembourre d'un coup.
- **Les épingles.** Mourir sur des épingles y laisse un tas de paille, sur lequel on peut ensuite marcher.
- **Les cartels** (panneaux « ART. » dehors) servent de points de sauvegarde.
- **À collecter** : des touffes de paille et une médaille cachée par niveau (la Croix du mérite colombophile).
- **Mode vies illimitées (caché)** : sur l'écran d'accueil, cliquer sur l'œil fermé de Raymond, sous la cloche. Il fait un clin d'œil, et le compteur affiche ∞. Recliquer pour revenir au mode normal.
- **Poursuites** : le chat Bijou (1-4), le drone (2-3) et la buse empaillée (5-3).
- **L'A4** : camions dont on emprunte le toit pour franchir le verre brisé, et éclairs annoncés au sol.

## Les 20 niveaux

| Étape | Niveaux |
|---|---|
| 1 · Vittoncourt, le musée | La vitrine · La galerie des insectes · La salle du mammouth · La loge du gardien |
| 2 · Verdun | Les coquelicots · Les éoliennes · Le drone · La tranchée oubliée |
| 3 · Reims | Les toits · Les pics anti-pigeons · La gare · Le square |
| 4 · L'A4 sous l'orage | L'aire de repos · Les camions · L'orage · Le pont |
| 5 · Villemareuil | La fête du village · Le clocher · La buse · Le cimetière |

Le scénario complet, y compris la fin, est dans [`docs/histoire.md`](docs/histoire.md). **Attention, ce fichier divulgue toute l'histoire.**

## Technique

- HTML5 Canvas et JavaScript, sans dépendance. Seules les polices viennent de Google Fonts (IM Fell English, La Belle Aurore).
- Tous les graphismes sont dessinés par le code : plans en parallaxe, tuiles extrudées pour l'effet 3D, éclairage dynamique, grain de pellicule.
- La musique et les bruitages sont synthétisés en direct avec la Web Audio API : un morceau par lieu, plus un morceau de poursuite.
- Le code source est découpé dans `src/` (moteur, décors, personnages, niveaux, textes, musique). `./build.sh` les assemble dans `index.html`, qui reste le seul fichier à distribuer.
- Une version Windows (.exe, via Electron) est prévue dans un dossier `windows/`.
