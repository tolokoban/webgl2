# Attributs et primitives

WebGL2 a un nombre limité de **primitives** d'affichage, mais en les combinant, on peut faire des choses folles.

* `POINTS` : affiche des points carrés.
* `LINE_STRIP` : affiche une ligne continue.
* `LINE_LOOP` : affiche une ligne continue qui se referme sur elle-même. Le premier et le dernier points sont les mêmes.
* `LINES` : affiche des segments de droites par forcément connectés entre eux.
* `TRIANGLE_STRIP` : affiche une bande de triangles reliès par un côté.
* `TRIANGLE_FAN` : affiche une série de triangles reliés par un côté et avec un même sommet en commun pour tous.
* `TRIANGLES` : affiche des triangles non connectés.

Toutes ces primitives consomment des **vertex**. Ce sont des sortes de points avec un ensemble d'attributs.
Pour povoir afficher quoi que ce soit, WebGL2 a besoin d'un **vertex shader** qui est un programme qui lit
les attributs d'un vertex et retourne (au moins) les coordonnées de ce vertex.

Supposons que l'on souhaite afficher deux triangles. On va utiliser la primitive **TRIANGLES** qui consomme
3 vertex par triangle affiché. Il nous faut donc 6 vertex.
Puisqu'on veux positionner les sommets des triangles sur l'écran, il nous faudrait des attributs qui donnent
ces positions.
On va donc utiliser un attribute de type `vec2` (un vecteur à deux dimensions) qu'on va appeler `attPos`.

