---
layout: wiki
title: "zh-CN-HUE Light"
lang: fr
permalink: /wiki/fr-zh-CN-HUE%20Light
---
---
<p> Ce nœud vous permet de contrôler les lumières de tonalité Philips et les lumières groupées, et d'envoyer également l'état de cette lumière dans le bus KNX.</p>
**Général**
| Propriétés | Description |
|-|-|
| KNX GW | Sélectionnez le portail KNX à utiliser |
| Hua Bridge | Sélectionnez le pont de ton à utiliser |
| Nom | Lampe de teinte ou la lumière groupée par Hue.Les lumières et les groupes disponibles lorsque vous tapez commencent à apparaître. |
<br/>
**Options**
Ici, vous pouvez sélectionner l'adresse KNX que vous souhaitez lier aux lumières / statuts de tonalité disponibles.<br/>
Commencez à entrer dans le champ GA, le nom ou l'adresse de groupe du périphérique KNX et le périphérique disponible commence à s'afficher lors de l'entrée.
**changement**
| Propriétés | Description |
|-|-|
| Contrôle | Ce GA est utilisé pour allumer / éteindre la lumière de ton par la valeur booléenne KNX de True / False |
| Statut | Le lier à l'adresse du groupe d'état du commutateur de la lumière |
<br/>
**faible**
| Propriétés | Description |
|-|-|
| Contrôle DIM | Semballage relativement assombri.Vous pouvez définir la vitesse de gradation dans l'onglet \ *\* _Behavior_ **.|
| Control% | modifie la luminosité du ton absolu (0-100%) |
| Statut% | Linez-le à l'état de luminosité de la lumière du groupe KNX Adresse du groupe |
| Vitesse sombre (ms) | Petite vitesse en millisecondes.Cela fonctionne pour ** Light ** , ainsi que pour**Réglable White \* \ * Points de données planifiés.Il est calculé de 0% à 100%.|
| La dernière luminosité sombre | La luminosité la plus basse que la lumière peut atteindre.Par exemple, si vous souhaitez refuser la lumière, la lumière cesse de gradir à la luminosité spécifiée%.|
| Luminosité maximale DIM |Luminosité maximale que la lampe peut atteindre.Par exemple, si vous souhaitez ajuster la lumière, la lumière cessera de gradier à la luminosité spécifiée%. |
<br/>
**blanc réglable**
| Propriétés | Description |
|-|-|
| Contrôle DIM |Utilisez DPT 3.007 Semballage pour changer la température blanche de la lampe de ton.Vous pouvez définir la vitesse de gradation dans l'onglet \ *\* _Behavior_ \ *\*. |
| Contrôle% | Utilisez DPT 5.001 pour modifier la température de couleur blanche; 0 est chaud, 100 est froid |
| Statut% | Adresse du groupe d'état de température de couleur de lumière blanche (DPT 5.001; 0 = chaud, 100 = froid) |
| Contrôle Kelvin | **DPT 7.600: ** Set par KNX Range 2000-6535 K (Converti à Hue Mirek). <br/>**DPT 9.002:** Set par Hue Range 2000-6535 K (l'ambiance commence à partir de 2200 K).La conversion peut entraîner de légères déviations |
| Statut Kelvin | **DPT 7.600: ** Lire Kelvin (KNX 2000-6535, conversion).<br/>**DPT 9.002:** LIRE GAMME HUE 2000-6535 K; La conversion peut avoir de légères déviations |
| Inverser la direction sombre | Inverser la direction sombre.|
<br/>
\ *\* Rgb / hsv \ *\*
| Propriétés | Description |
|-|-|
| **Partie RGB** ||
| Contrôle RVB | Utilisez RVB Triples (R, G, B) pour modifier la couleur, y compris la correction de la gamme de couleurs. Envoyer la couleur s'allumer et régler la couleur / la luminosité;r, g, b = 0 éteignez la lumière |
| Statut RVB | Adresse du groupe d'état des couleurs lumineuses.Les points de données acceptés sont des triplets RVB (R, G, B) |
| **Partie HSV** ||
| Couleur H Teamage | Boucle sur la boucle HSV Hue en utilisant DPT 3.007; Vitesse dans **Comportement** Paramètres |
| État H% | État du cercle de couleur HSV. |
| Contrôle S Semballage |Utilisez DPT 3.007 pour changer la saturation; Vitesse dans **Comportement** Paramètres |
| État S% | Adresse du groupe d'état saturé léger. |
| Vitesse sombre (ms) |vitesse miniature du bas à l'échelle la plus élevée en millisecondes.|
CONSEIL: Pour le "V" (luminosité) du HSV, veuillez utiliser les contrôles standard de l'onglet **Dim** .
<br/>
**Effet**
_NE-HUE BASIC EFFETS_
| Propriétés | Description |
|-|-|
| Blink | _true_ clignote la lumière, _false_ arrête de clignoter. Des interrupteurs alternatifs, adaptés aux invites.Prend en charge toutes les lumières de la teinte.|
|Boucle de couleur | _true_ démarre la boucle, _false_ arrête la boucle.Changez la couleur au hasard à intervalles fixes, uniquement pour les lumières de teinte qui prennent en charge la lumière de la couleur.L'effet commence environ 10 secondes après la publication de la commande. |
_Hue Effet natif_
Dans le tableau des effets natifs **Hue** , mappez la valeur KNX aux effets pris en charge par le luminaire (par exemple, «bougie», `foyer», «prisme»).Chaque ligne associe une valeur KNX (booléen, numérique ou texte, selon le point de données sélectionné) avec un effet renvoyé par le pont.Ce sera:
- Envoyer des valeurs KNX mappées pour déclencher l'effet correspondant;
- (Facultatif) Configurer une adresse de groupe d'état: Lorsque le pont de teinte rapporte l'effet change, le nœud écrit la valeur de la carte; Si aucune carte n'est trouvée, le nom d'effet d'origine est envoyé (la classe de texte DPT est requise, par exemple 16.xxx).
<br/>
**Comportement**
| Propriétés | Description |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lire l'état au démarrage | Lisez l'état de la lumière des teintes dans le démarrage de Node-Red ou le déploiement complet de Node-Red, puis envoyez ce statut au bus KNX |
| Statut de luminosité KNX | Chaque fois que la lumière de ton est allumée / désactivée, l'état de l'adresse du groupe de luminosité KNX est mis à jour. L'option est **Envoyer 0% lorsque la teinte est désactivée. Lorsque la teinte est activée, restaurez les valeurs précédentes (comportement KNX par défaut) et ** * comme IS (comportement de la teinte par défaut)**. Si vous avez un gradateur KNX avec un statut de luminosité, tel que MDT, l'option recommandée est \* \ *\*, et lorsque la lumière de Hue est éteinte, envoyez 0%. Lorsque la tonalité est activée, restaurez la valeur précédente (comportement KNX par défaut) \ *\* \ * |
| Comportement ouvert | En cas, il définit le comportement de la lumière.Vous pouvez choisir parmi différents comportements.<br/> \ *\* Sélectionner la couleur: \ *\* La lumière sera activée en utilisant la couleur que vous avez sélectionnée.Pour modifier la couleur, cliquez simplement sur le sélecteur de couleur (fabriqué sous "Sélectionnez la beauté". <br/> \ *\* Sélectionnez Température et luminosité: ** La température (Kelvin) et la luminosité (0-100) que vous avez sélectionnées allumera la lumière. <br/> Aucun:** Aucun État de la température définie pendant la journée. |
| Éclairage nocturne | Il permet de régler des couleurs / luminosité lumineuses spécifiques la nuit. Les options sont les mêmes que pendant la journée. Vous pouvez choisir la température / la luminosité ou la couleur. La température confortable est de 2700 Kelvin et la luminosité est de 10% ou 20%, ce qui en fait un bon choix pour les veilleuses de la salle de bain. |
| Jour / nuit | Sélectionnez l'adresse de groupe pour définir un comportement de jour / nuit. La valeur d'adresse de groupe est \ _true \ _if Daytime, \ _false \ _if Nighttime. |
| Valeur de jour / nuit de pliage | Inversez la valeur de l'adresse du jour / de la nuit \ _GROUP. Valeur par défaut** Non sélectionné.|
| Lire l'état au démarrage |Lire l'état au démarrage et transmettre des événements au bus KNX au démarrage / reconnecter.(Par défaut "non") |
|Couvrir le mode nuit |Vous pouvez écraser le mode nocturne en changeant manuellement les lumières décrites ici: \ *\* Passez au mode jour en éteignant rapidement la ligth puis (cette lumière uniquement) (cette lumière uniquement) \ *\* effectuez l'action décrite et ne fonctionne que sur ce mode de la lumière pour passer au mode jour.\ *\* Passez en mode quotidien en fermant rapidement la ligth, puis en allumant (appliquant tous les nœuds lumineux).|
| Pin d'entrée / sortie de nœud | Masquer ou afficher la broche d'entrée / sortie.La broche d'entrée / sortie permet au nœud d'accepter l'entrée de trafic et d'envoyer la sortie MSG au trafic.Le MSG d'entrée doit se conformer à la norme API V.2 Hue.Voici un exemple de msg qui allume la lumière: <code> msg.on = {"on": true} </code>. Voir \ [Page officielle de l'API Hue](§Url0§) |
### Notes
La fonction de dégagements fonctionne en mode \ *\* knx \ `start \` \ `'' 'et st off' **. Pour commencer à graver, envoyez simplement un télégramme KNX "start".Pour arrêter de tuer, envoyez un télégramme KNX "stop".S'il vous plaît** N'oubliez pas \* \ *, lorsque vous configurez le mur, n'oubliez pas.
<br/>
<br/>
