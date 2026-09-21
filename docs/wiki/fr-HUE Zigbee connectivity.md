---
layout: wiki
title: "HUE Zigbee connectivity"
lang: fr
permalink: /wiki/fr-HUE%20Zigbee%20connectivity
---
## Mise à jour vers KNX Ultimate 8

La version 7 ajoute un petit bouton **Mettre à jour vers v8** en haut de chaque éditeur de nœud. Il sauvegarde les flux, installe les packages HUE/Matter requis, convertit les nœuds compatibles, effectue un Deploy complet, vérifie les flux enregistrés et installe la version 8. Redémarrez ensuite le service Node-RED comme demandé ; recharger uniquement le navigateur ne suffit pas. Les anciens nœuds KNX AI arrêtent l’opération automatique.

[Lire le guide complet de mise à jour](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-Upgrade-to-v8)

> **Obsolète :** ce nœud HUE dédié reste disponible pour les flows existants. Utilisez **HUE Controller** pour les nouveaux projets. Il est marqué `(deprecated)` dans la palette et sur le canevas, utilise une couleur plus claire que HUE Controller et son éditeur affiche un avis de migration en haut. Le bouton de migration orange à contraste élevé avec texte blanc convertit localement tous les nœuds HUE legacy ; il ouvre ensuite uniquement un brouillon d’e-mail modifiable. L’e-mail n’est jamais envoyé automatiquement. À la fin du processus, un message Node-RED fixe reste visible jusqu’à ce que vous cliquiez sur OK et propose un bouton de soutien facultatif ; la page de don ne s’ouvre qu’après un clic sur ce bouton. Avant de commencer, [regardez la vidéo explicative sur YouTube](https://youtu.be/f0Evf2QFI7c).

Ce nœud récupère l'état de connectivité ZigBee à partir d'un périphérique de teinte et l'expose à KNX. 

Commencez à taper le nom du périphérique KNX ou l'adresse de groupe dans le champ GA;Les suggestions apparaissent pendant que vous tapez.

**Général**

| Propriété | Description |
|-|-|
|KNX GW |KNX Gateway avait l'habitude de publier le statut.|
|Hue Bridge |Hue Bridge à la question.|
|Connectivité Hue Zigbee |Capteur / appareil Hue Fournissant les informations de connectivité ZigBee.Assomple automatique pendant la saisie.|

**Mappage**

| Propriété | Description |
|-|-|
|Statut |Adresse du groupe KNX qui reflète la connectivité zigbee.Devient _true_ lorsqu'il est connecté, sinon _false_.|
|Lire l'état au démarrage |Lit sur l'état actuel chez l'éditeur start / reconnection et émet à KNX.Par défaut: "Oui".|

### sorties

1. Sortie standard
: charge utile (booléen): état de connectivité.

### Détails

`msg.payload` porte l'état booléen (true / false). \
`msg.status` contient un statut textuel: l'un des **connectés, déconnectés, connectivité \ _issue, unidirectional \ _incoming** .
