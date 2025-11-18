---
layout: wiki
title: "zh-CN-LoadControl-Configuration"
lang: fr
permalink: /wiki/fr-zh-CN-LoadControl-Configuration
---
---
# Nœud de contrôle de charge KNX
<p> À l'aide du nœud de contrôle de charge, vous pouvez gérer automatiquement la déconnexion de la charge (machine à laver, four, etc.) lorsque la consommation de courant dépasse un certain seuil.
L'appareil est intelligemment arrêté, vérifiant la consommation possible de l'appareil pour déterminer s'il est désactivé avec d'autres appareils.<br/>
Le nœud peut réactiver automatiquement la charge.<br/>
Ce nœud arrête un périphérique (ou périphériques) à la fois en fonction de l'ordre que vous choisissez.<br/>
**Général**
| Propriétés | Description |
|-|-|
| Gateway | KNX Portal. Il est également possible de ne sélectionner aucune passerelle.Dans ce cas, seuls les messages entrés dans le nœud seront pris en compte.|
| Surveillance Wh | L'adresse du groupe représente la consommation totale de votre bâtiment.|
| Limite wh | Seuil maximum que le compteur peut résister.Lorsque ce seuil est dépassé, le nœud commence à arrêter l'appareil.|
| Retardé (s) | Indique en quelques secondes, indiquant que le nœud évaluera la fréquence de consommation et d'arrêt de chaque périphérique.|
| Retard sur (s) | indique en secondes, indiquant que le nœud évalue la fréquence consommée et allume chaque dispositif fermé.|
<br/>
**Contrôle de charge**
Ici, vous pouvez ajouter l'appareil pour arrêter en cas de surcharge.<br/>
Sélectionnez l'appareil pour désactiver.Entrez le nom du périphérique ou son adresse de groupe.<br/>
Entrez n'importe quelle adresse de groupe indiquant la consommée par l'appareil sélectionné dans la première ligne. **Il s'agit d'un paramètre facultatif** .Si l'appareil consomme plus qu'une certaine quantité de watts, cela signifie qu'il est utilisé.Si elle est moins consommée, l'appareil sera considéré comme "non utilisé" et l'appareil sera immédiatement désactivé.<br/>
Si \ *Autorecovery \* est activé, le périphérique sera automatiquement réactivé lorsque le retard de réinitialisation expire.
## Entrer
| Propriétés | Description |
| - |- |
| `msg.readstatus = true` | Forcer le bus KNX de chaque appareil dans la liste pour lire la valeur. _ **Le nœud lui-même a effectué toutes les opérations** _, mais si nécessaire, vous pouvez utiliser cette commande pour forcer une reliure de la valeur actuelle dans Watt. | | |
|`msg.enable = true` | Activer le contrôle de charge. |
| `msg.disable = true` | Désactiver le contrôle de charge. |
| `msg.reset = true` | réinitialiser l'état du nœud et rouvrir tous les appareils. |
| `msg.shedding` | string._ """"Mée"" le plan "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" " "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" " "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" " "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" " "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" " "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" " Utilisez ce message pour forcer la chute des retombées pour démarrer / arrêter, ignorer l'adresse du groupe WH \ *\*. |
## Sortir
1. Sortie standard
: Charge utile (chaîne | objet): sortie standard de la commande.
## détail

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
\ <a href = "/node-red-contrib-knx-ultimate/wiki/SampleLoadControl"> Cliquez ici par exemple </a>
<br/>
