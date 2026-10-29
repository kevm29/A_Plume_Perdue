# À Plume Perdue

*Une lettre, un pigeon empaillé, un siècle de retard.*

Jeu de plateforme 2D en diorama de papier découpé, avec de l'humour noir et absurde.

Raymond, pigeon voyageur tombé en mission le 3 juin 1916 puis empaillé, se réveille en 2026 dans un musée qui ferme. Une lettre de poilu est toujours attachée à sa patte. Le règlement des colombophiles militaires est formel : un pigeon ne quitte pas le service avant d'avoir remis son message. Il a cent dix ans de retard.

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

- **La paille.** Raymond ne peut pas vraiment mourir : il perd de la paille. À chaque mort, il se rafistole un peu plus (paille qui dépasse, pansements, puis un bouton à la place de l'œil).
- **Les épingles.** Mourir sur des épingles y laisse un tas de paille, sur lequel on peut ensuite marcher.
- **Les cartels de musée** servent de points de sauvegarde.
- **À collecter** : des grains de maïs et une médaille cachée par niveau (la Croix du mérite colombophile).

## Plan des 20 niveaux

| Monde | Niveaux | État |
|---|---|---|
| 1 · Le Musée en déménagement | La vitrine · La galerie des insectes · La salle du mammouth · La loge du gardien | jouable |
| 2 · Les champs de l'ancien front | Les coquelicots · Les éoliennes · Le drone · La tranchée oubliée | à venir |
| 3 · La ville moderne | Les toits · Les pics anti-pigeons · La gare · Le square | à venir |
| 4 · L'autoroute et l'orage | L'aire de repos · Les camions · L'orage · Le pont | à venir |
| 5 · Le village de Marguerite | La fête du village · Le clocher · La buse · Le cimetière | à venir |

Le scénario complet, y compris la fin, est dans [`docs/histoire.md`](docs/histoire.md). **Attention, ce fichier divulgue toute l'histoire.**

## Technique

- HTML5 Canvas et JavaScript, sans dépendance. Seules les polices viennent de Google Fonts (IM Fell English, La Belle Aurore).
- Tous les graphismes sont dessinés par le code : plans en parallaxe, tuiles extrudées pour l'effet 3D, éclairage dynamique, grain de pellicule.
- La musique et les bruitages sont synthétisés en direct avec la Web Audio API : un morceau par lieu, plus un morceau de poursuite.
- Une version Windows (.exe, via Electron) est prévue dans un dossier `windows/`.
