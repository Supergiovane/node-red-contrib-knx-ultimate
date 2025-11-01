---
layout: wiki
title: "LoadControl-Configuration"
lang: fr
permalink: /wiki/fr-LoadControl-Configuration/
---
# Nœud de contrôle de charge KNX

 Avec le nœud de contrôle de charge, vous pouvez gérer automatiquement la déconnexion des charges (lave-linge, four, etc.) lorsque la consommation de courant dépasse un certain seuil.

Les appareils sont désactivés intelligemment, en vérifiant la consommation possible de l'appareil pour déterminer l'opportunité de le désactiver avec les autres.

Le nœud peut réactiver automatiquement les charges.

Le nœud désactive un périphérique (ou plusieurs appareils) à la fois, en fonction de l'ordre que vous avez sélectionné. 

**Général**

| Propriété | Description |
|-|-|
|Passerelle |KNX Gateway.Il est également possible de ne sélectionner aucune passerelle;Dans ce cas, seuls les messages entrants au nœud seront pris en compte.|
|Surveiller WH |Adresse du groupe représentant la consommation totale de votre bâtiment.|
|Limite wh |Seuil maximum que votre compteur d'électricité peut résister.Lorsque ce seuil est dépassé, le nœud commence à éteindre les appareils.|
|Retarder l'éteint (s) |Exprimé en quelques secondes, indique la fréquence à laquelle le nœud évaluera la consommation et éteindra chaque appareil.|
|Retard Switch on (S) |Exprimé en quelques secondes, indique la fréquence à laquelle le nœud évaluera la consommation et allumera chaque dispositif qui a été désactivé.|

**Contrôle de charge**

Ici, vous pouvez ajouter des appareils pour désactiver en cas de surcharge.

Choisissez l'appareil à éteindre.Entrez le nom du périphérique ou son adresse de groupe.

Entrez n'importe quelle adresse de groupe qui indique la consommation de l'appareil choisi dans la première ligne. **Il s'agit d'un paramètre facultatif** .Si l'appareil consomme plus qu'un certain nombre de watts, cela signifie qu'il est utilisé.S'il consomme moins, l'appareil sera considéré comme "non utilisé" et le ceci et le prochain seront désactivés en même temps. 

Si _Automatic Recovery_ est activé, le périphérique est automatiquement réactivé lorsque le "délai de réinitialisation" expire.

## Entrées

| Propriété | Description |
|-|-|
|`msg.readstatus = true` |Forcer la lecture des valeurs du bus KNX de chaque appareil dans la liste._ **Le nœud fait déjà tout seul** _, mais si nécessaire, il est possible d'utiliser cette commande pour forcer une relecture des valeurs actuelles dans Watt. |
|`msg.enable = true` |Activer le contrôle de charge. |
|`msg.disable = true` |Désactivez le contrôle de charge. |
|`msg.reset = true` |Réinitialisez les états du nœud et rallumez tous les appareils. |
|`msg.shedding` |Chaîne._Shed_ pour démarrer la séquence de décharge de formulaire, _unshed_ pour commencer la perte inversée.Utilisez ce msg pour forcer la temporisation de déchets à démarrer / arrêter, en ignorant l'adresse du groupe **Monitor Wh ** .Définissez _Auto_ pour activer à nouveau le moniteur**Monitor Wh** Group Address Surveillant.|

## sorties

1. Sortie standard
: charge utile (chaîne | objet): la sortie standard de la commande.

## Détails

```javascript

msg = {
  "topic": "Home Total Consumption", // Node Name
  "operation": "Increase Shedding" or "Decrease Shedding" or operation reflecting the input message (disable, enable, reset), // Operation
  "device": "Washing machine", // Device shedded
  "ga": "", // Group address of the shedded device
  "totalPowerConsumption": 3100, // Current power consumption
  "wattLimit": 3000, // Limit you set in the config window
  "payload": 1, // Current shedding stage
}

```

# Échantillon

<a href = "https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/SampleLoadControl"> Cliquez ici pour l'exemple </a>
