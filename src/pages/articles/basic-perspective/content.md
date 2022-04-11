# Perspective basique

L'effet de perspective ci-dessus est réalisé grace aux shaders suivants et à ces attributs:

| No | attPos  | attUV  |
|----|---------|--------|
| 0  | (-1,-1) | (0, 1) |
| 1  | (+1,-1) | (1, 1) |
| 2  | (-1,+1) | (0, 0) |
| 3  | (+1,+1) | (1, 0) |

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

D'après notre vertex shader, on a :

* `X = s.(x - Cx) / w`
* `Y = r.s.(y - Cy) / w`

Et la coordonnée `w` vaut : `w = 1 + p.y`



