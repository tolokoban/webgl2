# Les instances, comment ça marche ?

Les instances permettent de dessiner plusieurs fois le même object en un seul appel de la fonction `gl.drawArraysInstanced()` ou `gl.drawElementsInstanced()`.

Par exemple, si je veux dessiner le petit avion simplifié avec 4 triangles,
je peux utiliser :

- un uniform pour la couleur (`vec3 uniColor`),
- un uniform pour sa position (`vec2 uniCenter`),
- un attribut pour definir un sommet de triangle en coordonnées polaires (`attVertexPolarCoords`) :
  - **x** : angle en degrés
  - **y** : distance par rapport au centre
  - **z** : luminosité (juste pour faire un petit effet)

Et voici les données pour 4 triangles (12 vertex) :

|         |   0 |   1 |   2 |   3 |    4 |   5 |   6 |    7 |   8 |   9 |  10 |  11 |
|---------|-----|-----|-----|-----|------|-----|-----|------|-----|-----|-----|-----|
| X (ang) |   0 |  90 | -90 |   0 |  120 | 180 |   0 | -120 | 180 |   0 |  60 | -60 |
| Y (dis) | 0.3 | 0.4 | 0.4 | 0.5 | 0.25 |   0 | 0.5 | 0.25 |   0 | 0.4 | 0.4 | 0.4 |
| Z (lum) |   0 |   1 |   1 |   2 |  0.1 |   1 |   2 |  0.1 |   1 |   1 |   2 |   2 |

Et si on veut en afficher 42, avec différentes couleurs et positions, il faut faire
une boucle et appeler `gl.drawArrays(gl.TRIANGLES, 0, 12)` 42 fois.

