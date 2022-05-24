#version 300 es

precision mediump float;

uniform sampler2D uniTexCells;
uniform sampler2D uniTexColors;
uniform float uniGrid;
uniform float uniInvGrid;

in vec2 varVoronoiUV;
in float varScale;

out vec4 FragColor;

struct Cell {
    vec4 color;
    float distance;
};

float dist(vec2 vec) {
  return vec.x * vec.x + vec.y * vec.y;
}

Cell best(Cell cell1, Cell cell2) {
  if (cell1.distance < cell2.distance) return cell1;
  return cell2;
}

/**
 * uvI: Coordonnées du coin inférieur gauche de la case.
 * uvF: Coordonnées du pixel dans la case.
 * shiftX, shiftY: décallage de la case courante.
 */
Cell makeCell(vec2 uvI, vec2 uvF, float shiftX, float shiftY) {
  vec2 shift = vec2(shiftX, shiftY);
  vec2 uv = uvI + uniInvGrid * shift;
  vec2 origin = shift - vec2(0.5, 0.5) + texture(uniTexCells, uv).xy - uvF;
  return Cell(texture(uniTexColors, uv * varScale + 0.5 * vec2(1.0 - varScale)), dist(origin));
}

void main() {
  vec2 integralUV = floor(varVoronoiUV * uniGrid) * uniInvGrid;
  vec2 fractionalUV = fract(varVoronoiUV * uniGrid);
  Cell cell1 = makeCell(integralUV, fractionalUV, 0.0, 0.0);
  Cell cell2 = makeCell(integralUV, fractionalUV, 1.0, 0.0);
  Cell cell3 = makeCell(integralUV, fractionalUV, 1.0, 1.0);
  Cell cell4 = makeCell(integralUV, fractionalUV, 0.0, 1.0);
  Cell cell = best(
      best(cell1, cell2),
      best(cell3, cell4)
  );
  FragColor = cell.color;
}