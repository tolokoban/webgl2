# Perspective basique

L'effet de perspective ci-dessus est réalisé grace aux shaders suivants (en fin d'article) et à ces attributs:

| No | attPos  | attUV  |
|----|---------|--------|
| 0  | (-1,-1) | (0, 1) |
| 1  | (+1,-1) | (1, 1) |
| 2  | (-1,+1) | (0, 0) |
| 3  | (+1,+1) | (1, 0) |

## Le traitement es coordonnées

Si vous cliquez sur la carte, vous verrez qu'il est possible de récupérer les
coordonnées dans l'espace de départ (la carte à plat).

Posons :

* `x` : coordonnée X de `attPos` (entre -1 et +1).
* `y` : coordonnée Y de `attPos` (entre -1 et +1).
* `Cx` : coordonnée X de `uniCenter`.
* `Cy` : coordonnée Y de `uniCenter`.
* `p` : la pente (`uniSlope`) positive mais < +1.
* `s` : l'échelle (`uniScale`).
* `r` : l'aspect ratio du canvas (`uniRatio`).
* `X` : coordonnée X finale du vertex.
* `Y` : coordonnée Y finale du vertex.

Ici, `X` et `Y` sont compris entre -1 (coin inférieur gauche) et +1 (coin supérieur droit).

D'après notre vertex shader, on a :

* `X = s.(x - Cx) / w`
* `Y = r.s.(y - Cy) / w`

Et la coordonnée `w` vaut : `w = 1 + p.r.s.(y - Cy)`

Ce qui nous donne les équations pour revenir dans l'espace de départ :

* `y = Cy + Y / (s.r.(1 - p.Y))`
* `x = Cx + X / s + X.r.p.(y - Cy)`

Attention à bien calculer `y` avant `x` car ce dernier dépend du premier.
