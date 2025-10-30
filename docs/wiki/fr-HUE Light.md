---
layout: wiki
title: "HUE Light"
lang: fr
permalink: /wiki/fr-HUE%20Light
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Light) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Light) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Light) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Light) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Light) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Light)

Ce nœud contrôle les lumières de Hue Philips (simple ou groupées) et mappe leurs commandes / états à KNX. 

**Général**

| Propriété | Description |
|-|-|
| KNX GW | Sélectionnez la passerelle KNX à utiliser |
| Hue Bridge | Sélectionnez le pont Hue à utiliser |
| Nom | Hue Light ou Lumière groupée à utiliser (Ambord d'auto-automatique pendant la frappe). |

**Localiser l’appareil**

Le bouton `Locate` (icône lecture) lance une session d’identification Hue pour la ressource sélectionnée. Lorsque la session est active, le bouton affiche l’icône stop et le pont fait clignoter la lampe — ou toutes les lampes du groupe — chaque seconde. Appuyez à nouveau pour l’arrêter immédiatement ; sinon la session s’arrête automatiquement au bout de 10 minutes.

**Options**

Ici, vous pouvez lier les adresses de groupe KNX aux commandes / états de Theaux disponibles. 

Commencer à taper le champ GA (nom ou adresse de groupe); Les suggestions apparaissent pendant que vous tapez.

**Changer**

| Propriété | Description |
|-|-|
| Contrôle | Ce GA est utilisé pour allumer / éteindre la lumière via une valeur booléenne KNX True / False |
| Statut | LIENDEZ CECI À L'Adresse du groupe d'état du commutateur de Light |

**Faible**

| Propriété | Description |
|-|-|
| Contrôle DIM | Dim relatif de la lumière de la teinte. Vous pouvez régler la vitesse de gradation dans l'onglet **comportement** . |
| Contrôle% | Modifie la luminosité de la lumière absolue (0-100%) |
| Statut% | LIGNEZ CECI À L'Adresse du groupe KNX du statut de luminosité de la lumière |
| Dim Speed ​​(MS) | Vitesse de gradation en millisecondes. S'applique à la fois à la luminosité lumineuse et aux points de données blancs de réglage. Calculé sur la plage de 0% → 100%. |
| Min DIM luminosité | La luminosité minimale que la lampe peut atteindre. Par exemple, si vous tuez la lumière vers le bas, la lumière s'arrêtera à la baisse à la luminosité spécifiée%. |
| Luminosité maximale de DIM | La luminosité maximale que la lampe peut atteindre. Par exemple, si vous tuez la lumière, la lumière s'arrêtera à la baisse à la luminosité spécifiée%. |

**Blanc accordable**

| Propriété | Description |
|-|-|
| Contrôle DIM | Changer la température blanche à l'aide de DPT 3.007 Semballage. La vitesse est définie dans l'onglet **comportement** . |
| Contrôle% | Changer la température blanche à l'aide de DPT 5.001. 0 = CHAUD CHAUD, 100 = CHARD complet. |
| Statut% | État de la température GA. DPT 5.001 Valeur absolue: 0 = Full Warm, 100 = Full Cold. |
| Contrôle Kelvin | **DPT 7.600: ** Réglez la température à Kelvin en utilisant la gamme KNX 2000-6535 (convertie en Hue Mirek). 
**DPT 9.002:** régler la température en utilisant la gamme Hue 2000-6535 K (l'ambiance commence à 2200 K). Les conversions peuvent introduire de petits écarts. |
| Statut Kelvin | **DPT 7.600: ** Température de lecture dans Kelvin en utilisant KNX Range 2000-6535 (converti à partir de Hue). 
**DPT 9.002:** Température de lecture en utilisant la gamme Hue 2000-6535 K (l'ambiance commence à 2200 K). Les conversions peuvent introduire de petits écarts. |
| Invertissant la direction sombre | Inverse la direction sombre. |

**RGB / HSV**

| Propriété | Description |
|-|-|
| **Section RVB** ||
| Contrôle RVB | Changer la couleur à l'aide du triplet RVB (R, G, B). La correction de la gamme est gérée. L'envoi d'une couleur allume la lumière et définit la couleur / la luminosité (perceptuelle). Envoi r, g, b = 0 éteint la lumière. |
| Status RVB | L'adresse du groupe d'état des couleurs de la lumière. DataPoint accepté est RVB Triplet (R, G, B) |
| **Section HSV** ||
| Couleur h dim | Cycle à travers la teinte HSV à l'aide de DPT 3.007 Semballage. La vitesse est définie dans l'onglet **comportement** . |
| Statut H% | Statut du cercle chromatique HSV. |
| Contrôle s dim | Modifie la saturation des couleurs de la lumière, en utilisant DPT 3.007 Semballage. Vous pouvez définir la vitesse de gradation dans l'onglet du comportement **_ _** . |
| Statut S% | L'adresse du groupe d'état de saturation des couleurs légères. |
| Dim Speed ​​(MS) | La vitesse de gradation, en millisecondes, du bas à l'échelle supérieure. |

Pour contrôler le HSV "V" (luminosité), utilisez les contrôles standard sous l'onglet **Dim** .

**Effets**

_NE-HUE BASIC EFFETS_

| Propriété | Description |
|-|-|
| Clignotement | _True_ clignote la lumière, _false_ arrête de clignoter. Clignote la lumière allumée et éteinte. Utile pour la signalisation. Fonctionne avec toutes les lumières Hue. |
| Cycle de couleur | _True_ Cycle de démarrage, _false_ Stop Cycle. Modifie au hasard la couleur de la lumière de la teinte à intervalle régulier. Fonctionne avec toutes les lumières Hue ayant des capacités de couleur. L'effet de couleur commencera 10 secondes après le jeu. |

_Hue Effets natifs_

Utilisez le tableau des effets natifs **Hue** pour cartographier vos valeurs KNX aux effets pris en charge par la lumière sélectionnée (par exemple «bougie», `foyer», «prisme»). Chaque ligne relie une valeur KNX (booléen, numérique ou textuelle, selon le point de données que vous choisissez) avec un effet de teinte. Du côté KNX, vous pouvez:

- Envoyez la valeur mappée pour activer cet effet;
- Fournir éventuellement une adresse de groupe d'état: le nœud émet la valeur mappée chaque fois que le pont de teinte rapporte un changement d'effet; Si aucun mappage n'existe, le nom de l'effet brut est envoyé (nécessite un DPT textuel tel que 16.xxx).

**Comportement**

| Propriété | Description |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lire l'état au démarrage | Lisez l'état de la lumière de Hue au démarrage de Node-Red ou le déploiement complet de Node-Red, et envoyez ce statut au bus KNX |
| Statut de luminosité KNX | Met à jour l'état de l'adresse du groupe de luminosité KNX, chaque fois que la lampe à teinte est allumée / désactivée. Les options sont **lorsque Hue Light est éteint Envoyer 0%. Lorsque Hue On, restaurez la valeur précédente (comportement KNX par défaut) ** et**Laissez tel quel (comportement de teinte par défaut) ** . Si vous avez un gradateur KNX avec un statut de luminosité, comme le MDT, l'option suggérée est _**lorsque la lumière de Hue est éteinte envoyez 0%. Lorsque Hue on, restaurez la valeur précédente (comportement KNX par défaut)** _ |
| Affoncher le comportement | Il définit le comportement de vos lumières lorsqu'il est allumé. Vous pouvez choisir parmi les différents comportements. 
 **Sélectionner la couleur: ** La lumière sera allumée avec la couleur de votre choix. Pour modifier la couleur, cliquez simplement sur le sélecteur de couleurs (sous le contrôle de couleur _Select). 
**Sélectionnez la température et la luminosité: ** La lumière sera allumée avec la température (Kelvin) et la luminosité (0-100) de votre choix. 
**Aucun:** La lumière conservera son dernier statut. Dans le cas où vous permettez l'éclairage nocturne, après la fin de la nuit, la lampe reprendra l'état de couleur / température / luminosité réglé pendant le jour. |
| Éclairage nocturne | Il permet de définir une couleur / luminosité claire particulière la nuit. Les options sont les mêmes que la journée. Vous pouvez sélectionner une température / une luminosité ou une couleur. Une température confortable de 2700 Kelvin, avec une luminosité de 10% ou 20%, est un bon choix pour la veilleuse de la salle de bain. |
| Jour / nuit | Sélectionnez l'adresse de groupe utilisée pour définir le comportement de jour / nuit. La valeur d'adresse du groupe est _true_ si le jour, _false_ si nocturne. |
| Valeur de jour / nuit inversée | Inversez les valeurs de l'adresse du groupe _day / night_. La valeur par défaut est **non contrôlée** . |
| Lire l'état au démarrage | Lisez l'état au démarrage et émettez l'événement dans le bus KNX au démarrage / reconnexion. (Par défaut "non") |
| Remplacez le mode nuit | Vous pouvez remplacer le mode nuit en changeant manuellement la lumière comme décrit ici: **Passez au mode jour en changeant rapidement la ligth puis sur (cette lumière uniquement) ** fait ce qui décrit et n'agit que sur cette lumière.**Passez au mode jour en changeant rapidement la ligth puis sur (appliquez tous vos nœuds légers)** agit sur tous les nœuds légers, en définissant l'adresse du groupe jour / nuit sur le mode jour. |
| Pinons d'entrée / sortie de nœud | Masquer ou afficher les broches d'entrée / sortie. Les broches d'entrée / sortie permettent au nœud d'accepter l'entrée MSG de l'écoulement et d'envoyer une sortie MSG à l'écoulement. Le MSG d'entrée doit suivre les normes de l'API Hue V.2. Ceci est un exemple de msg, qui allume la lumière: <code> msg.on = {"on": true} </code>. Veuillez vous référer à la [page officielle de l'API Hue](https://developers.meethue.com/develop/hue-api-v2/api-reference/#resource_light__id__put) |

### Note

La fonction de gradation fonctionne en mode **knx `start` et` `stop` ** . Pour commencer à tuer, envoyez un seul télégramme KNX "start". Pour arrêter de tuer, envoyez un télégramme KNX "stop". S'il vous plaît**N'oubliez pas cela** , lorsque vous définissez les propriétés de votre mur.
