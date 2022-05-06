# Voronoi

Un diagramme de Voronoï affiche des **cellules**.
Chaque cellule a un centre et une couleur associée.
Un pixel de l'écran appartient à une cellule s'il est plus près de son centre que du centre
de n'importe quelle autre cellule.

```bb
M1(-2.2,-2.2) M2(-2.2,2.2) M3(2.2,2.2) M4(2.2,-2.2)
M12[M1M2] M34[M3M4] M23[M2M3] M14[M1M4]
#7w [M1M2M3M4M1] [M12M34] [M23M14]
A(-1,1) B(2,2) C(2,-2) D(-2,-2)
A1(-1.5,-0.2) B1(1.5,1)
%1 #20
[A1B] [A1C] [A1D]
[B1A] [B1C] [B1D]
%3 #30 [A1A] [B1B]
{ABCD A1B1}
```

Pour accélérer l'affichage d'un diagrame de Voronoï en WebGL2,
il faut calculer le moins de distances possibles pour chaque pixel.
On va donc imposer la contrainte suivante :

-   on découpe l'espace en lignes et colonnes et on place un, et un seul, centre de cellule par case.

Dans le schéma ci-dessus, on a 4 cases et les centres `A`, `B`, `C` et `D` sont chacun dans leur case.
Le pixel en `A1` est plus proche de `A`, et même s'il n'est pas dans la même case, il aura la même couleur.

```bb
A(-1,1) B(1,1) C(1,-1) D(-1,-1)
E[AB] F[BC] G[CD] H[DA] I[EG]
M1[AI] M2[BI] M3[CI] M4[DI]
A'(0,-0) B'(2,0) C'(2,2) D'(0,2)
E'[A'B'] F'[B'C'] G'[C'D'] H'[D'A'] I'[E'G']
M4'[D'I'] M2'[B'I'] M3'[C'I']
#17 [A'B'C'D'A'] [E'G'] [F'H']
#14 [ABCDA] [EG] [FH]
%2 #39 @M1 0.47 @M2 0.47 @M3 0.47 @M4 0.47
%2 #30 @M4' 0.47 @M2' 0.47 @M3' 0.47
#08 [M1M2M3M4]
```

On va donc utiliser une texture pour définir les cellules.
Les attributs X et Y serviront pour placer le centre dans la case,
et Z servira à définir la couleur de la cellule.

Le fragment shader va tester les pixels du carré bleu dans le diagramme ci-dessus.
Et il va déterminer lequel des quatre voisins est le plus proche pour en déduire la couleur du pixel.

Pour être sûr qu'il suffit de tester les 4 voisins, il faut que le centre se trouve dans un disque orange. Sinon, une case plus éloignée pourrait avoir son centre plus proche du pixel et notre affichage serait faussé.

```glsl
#version 300 es

precision mediump float;

uniform sampler2D uniTexCells;
uniform sampler2D uniTexColors;
uniform sampler2D uniTexElevations;
uniform float uniScale;

in vec2 varVoronoiUV;

out vec4 FragColor;

const float A = 1.0;

const float GRID = 24.0;
const float INV_GRID = 1.0 / GRID;

struct Cell {
    vec2 shift;
    float distance;
};

float dist(vec2 vec) {
  return vec.x * vec.x + vec.y * vec.y;
}

Cell best(Cell cell1, Cell cell2) {
  if (cell1.distance < cell2.distance) return cell1;
  return cell2;
}

Cell makeCell(vec2 uvI, vec2 uvF, float shiftX, float shiftY) {
  vec2 shift = vec2(shiftX, shiftY);
  vec2 origin = shift - vec2(0.5, 0.5) + texture(uniTexCells, uvI + INV_GRID * shift).xy - uvF;
  return Cell(shift, dist(origin));
}

void main() {
  vec2 integralUV = floor(varVoronoiUV * GRID) / GRID;
  vec2 fractionalUV = fract(varVoronoiUV * GRID);
  Cell cell1 = makeCell(integralUV, fractionalUV, 0.0, 0.0);
  Cell cell2 = makeCell(integralUV, fractionalUV, 1.0, 0.0);
  Cell cell3 = makeCell(integralUV, fractionalUV, 1.0, 1.0);
  Cell cell4 = makeCell(integralUV, fractionalUV, 0.0, 1.0);
  Cell cell = best(
      best(cell1, cell2),
      best(cell3, cell4)
  );
  vec2 elevationUV = (integralUV + cell.shift * INV_GRID) * uniScale;
  float height = texture(uniTexCells, elevationUV).z;
  vec3 color = texture(uniTexColors, vec2(height, 0.5)).rgb;
  FragColor = vec4(color, 1);
}
```
