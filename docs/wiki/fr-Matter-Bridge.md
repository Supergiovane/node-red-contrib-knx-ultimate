---
layout: wiki
title: "Matter-Bridge"
lang: fr
permalink: /wiki/fr-Matter-Bridge
---
# Expose KNX to Matter (BETA)

> Ce nœud est en **BETA** : il fonctionne, mais des détails peuvent encore changer entre les versions.

## Vue d'ensemble

Chaque nœud Expose KNX to Matter expose **un appareil KNX comme appareil Matter** : les contrôleurs appairés (Alexa, Google Home, Apple Home...) le voient, avec le nom que vous avez choisi, prêt pour le contrôle par app et à la voix. Pointez-le vers un nœud de configuration **Bridge Matter** (le bridge lui-même, appairé une seule fois - le QR d'appairage vit là-bas) et ajoutez autant de nœuds d'appareil que vous voulez, n'importe où dans vos flux.

C'est la direction opposée du nœud *Matter Device* : là-bas KNX contrôle un appareil Matter, ici les contrôleurs Matter contrôlent KNX.

## Configuration

|Champ|Description|
|--|--|
| Bridge Matter | Le nœud de configuration Bridge Matter auquel appartient cet appareil |
| GW KNX | Passerelle KNX utilisée pour les télégrammes. **Optionnel** : sans elle, l'appareil fonctionne en mode flow uniquement via les PIN du nœud. Sélectionnée automatiquement si le projet n'a qu'une passerelle |
| Nom | Ce qu'Alexa & Co. affichent et utilisent pour les commandes vocales |
| Type d'appareil | Le type d'appareil Matter (voir ci-dessous) ; il détermine quels champs d'adresse de groupe apparaissent |
| Lire l'état au démarrage | Envoie un `GroupValue_Read` aux GA d'état au démarrage, pour peupler les attributs Matter |

## Types d'appareil et adresses de groupe

|Type|Adresses de groupe|
|--|--|
| Lumière On/Off, Prise | GA commande On/Off, GA état On/Off (DPT 1.001) |
| Lumière variable | + GA commande/état variation % (DPT 5.001) |
| Lumière RGB (couleur) | + GA commande/état couleur RGB (DPT 232.600). La couleur Matter (hue/saturation ou XY, depuis la roue de couleur de l'app) est convertie depuis/vers le triplet RGB KNX |
| Lumière blanc dynamique | + GA commande/état température de couleur en Kelvin (DPT 7.600) |
| Volet / Store | Monter/Descendre (DPT 1.008), Stop (DPT 1.017), position % commande/état (DPT 5.001), inversion de position optionnelle |
| Thermostat (chauffage) | GA température actuelle, GA commande/état consigne (DPT 9.001) |
| Ventilateur / VMC | GA commande/état vitesse % (DPT 5.001) |
| Capteurs (température, humidité, lumière, présence, contact) | Une GA d'état chacun |
| Détecteur fumée/CO | GA état alarme fumée + GA état alarme CO optionnelle (DPT 1.005) : notifications critiques sur le téléphone |
| Détecteur de fuite d'eau | GA état fuite (DPT 1.005) |
| Capteur de qualité d'air (CO2) | GA état CO2 en ppm (DPT 9.008) ; la classe de qualité d'air (bonne/correcte/modérée/mauvaise...) est dérivée automatiquement |
| Robot aspirateur | **Flow uniquement** : pas d'adresses de groupe. Activez les PIN du nœud : les commandes de l'assistant (« lance le nettoyage », pause/reprendre/retour à la base) arrivent sur la sortie comme `rvcmode`/`rvccommand` ; renvoyez l'état avec `msg.payload = { function: "rvcstate", value: "running"\|"docked"\|"charging"\|"paused"\|"error" }` et le mode avec `function: "rvcmode", value: "cleaning"\|"idle"` |

- **GA de commande** : écrite sur le bus KNX quand l'assistant envoie une commande.
- **GA d'état** : lue depuis le bus pour tenir à jour les attributs Matter (et les apps).

## Compatibilité avancée

Ces options ne s'affichent que lorsqu'elles s'appliquent au type sélectionné. Les appareils variables peuvent ignorer la commande de luminosité que certains contrôleurs envoient juste après `On`. Les volets peuvent mettre à jour la position Matter de façon optimiste après une commande, puis la corriger quand la GA d'état KNX rapporte la position réelle.

## PIN du nœud

Si vous activez les PIN entrée/sortie du nœud :

- **Entrée** : mettez à jour l'état Matter depuis le flux, sans passer par le bus KNX : `msg.payload = { function: "onoff", value: true }` (`function` est l'une de `onoff`, `level`, `rgb`, `colortemp`, `position`, `temperature`, `humidity`, `illuminance`, `occupancy`, `contact`, `currenttemp`, `setpoint`, `fanspeed`, `smoke`, `co`, `leak`, `co2`, `rvcstate`, `rvcmode`). Utile pour exposer à Alexa & Co. des valeurs calculées dans le flux (ex. un capteur virtuel).
- **Sortie** : chaque commande reçue d'un contrôleur Matter est transmise au flux : `msg.topic` = nom de l'appareil, `msg.payload` = valeur, `msg.matter` = la commande brute. Un appareil sans GA de commande devient un **appareil flow uniquement**.

## Notes

- L'identité Matter de l'appareil est liée à ce nœud : supprimer le nœud et en créer un nouveau fait apparaître un tout nouvel appareil dans les apps.
- Les nœuds d'appareil ajoutés/renommés/supprimés sont pris en compte en quelques secondes, sans réappairer le bridge.
