---
layout: wiki
title: "zh-CN-HUE Battery"
lang: fr
permalink: /wiki/fr-zh-CN-HUE%20Battery
---
---
<p> Ce nœud synchronise le niveau de batterie du périphérique Hue sur KNX et déclenche un événement lorsque la valeur change.</p>
Entrez le nom du périphérique KNX ou l'adresse de groupe dans le champ GA pour terminer automatiquement; Cliquez sur le bouton Rafraîchissement à côté du "capteur Hue" pour recharger la liste des périphériques Hue.
**conventionnel**
| Propriétés | Description |
|-|-|
| KNX GW | La passerelle KNX pour libérer la puissance (les paramètres de mappage KNX ne seront affichés qu'après la sélection).|
| Hue Bridge | Bridge Hue utilisé. |
| Capteur de teinte |Dispositif / capteur Hue qui fournit des informations d'alimentation (prend en charge l'achèvement automatique et la rafraîchissement).|
**Mappage**
| Propriétés | Description |
|-|-|
| Batterie | Adresse du groupe KNX du pourcentage de batterie (0-100%), DPT recommandé: <b> 5.001 </b>. |
**Comportement**
| Propriétés |Description |
|-|-|
| Lire l'état au démarrage | Lisez la puissance actuelle pendant le déploiement / reconnexion et publiez sur KNX.Valeur par défaut: "Oui".|
| Pin de sortie de nœud | Afficher ou masquer la sortie du nœud-rouge.Lorsque la passerelle KNX n'est pas sélectionnée, la broche de sortie reste activée pour garantir que l'événement Hue peut toujours entrer dans le processus.|
> ℹ️ Lorsque la passerelle KNX n'est pas sélectionnée, le champ de mappage KNX est automatiquement caché pour faciliter l'utilisation des nœuds comme des sources d'événements purs → Node-rouge.
