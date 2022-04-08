# Contexte, animation et couleur de fond

WebGL est unebibliothèque qui nous permet d'accéder à la carte graphique depuis
le code Javascript d'une page Web.

Cette bibliothèque est accessible à travers un object appelé **WebGL2RenderingContext** que l'on récupère comme ceci:

<Code region="1">code</Code>

Il nous faut maintenant une fonction qui va remplir le canvas avec un couleur en fonction du temps.

<Code region="2">code</Code>

> Mais pourquoi deux fonctions pour remplir le fond avec une couleur ?
>
> La fonction qui effectue le remplissage est `gl.clear(gl.COLOR_BUFFER_BIT)`.
> Mais elle ne prend pas de couleur en argument.
> Elle utilise la couleur **courante** de remplissage. Et c'est la fonction `gl.clearColor(rouge, vert, blue, opacite)` qui définit cette couleur de remplissage.
>
> La grande majorité des fonctions de WebGL2 fonctionnent ainsi : elles ont besoin de plus de données que
> celles passées en argument. Ces données doivent avoir été définies plus tôt par d'autres fonctions.
>
> Cette complexification a pour but de gagner du temps.
> En effet, WebGL2 permet de communiquer avec la carte graphique (le GPU) qui doit être considéré comme une
> machine distincte de celle sur laquelle s'exécute le code Javascript. Et finalement, envoyer des données
> au GPU est parfois plus lent que d'afficher des millions de pixels.
>
> Si vous vouliez juste remplir l'écran de vert à chaque image (avant d'afficher qutre chose par dessus),
> il serait donc plus efficace d'appeler `gl.clearColor(0,1,0,1)` une fois et `gl.clear(gl.COLOR_BUFFER_BIT)`
> à chaque image.

----

Pour créer une animation, il faut afficher le plus d'images possible à intervalles rapprochés.
Javascript fournit une fonction pour ça : `window.requestAnimationFrame`.
La fonction passée en paramètre sera exécutée (avec le temps en millisecondes comme seul argument)
lorsque le navigateur sera prêt à afficher une image.
Cela permet d'afficher jusqu'à 60 images par secondes et aussi d'éviter l'affichage quand la page
n'est pas visible à l'écran.

Voici une fonction qui permet de gérer cette animation :

<Code region="3">code</Code>

