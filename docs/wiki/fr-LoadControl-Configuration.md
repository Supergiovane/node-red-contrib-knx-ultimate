🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/LoadControl-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-LoadControl-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-LoadControl-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-LoadControl-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-LoadControl-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-LoadControl-Configuration)
<!-- NAV START -->
Navigation: [Home](/node-red-contrib-knx-ultimate/wiki/Home)  
Overview: [Changelog](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/CHANGELOG.md) • [FAQ](/node-red-contrib-knx-ultimate/wiki/FAQ-Troubleshoot) • [Security](/node-red-contrib-knx-ultimate/wiki/SECURITY) • [Docs: Language bar](/node-red-contrib-knx-ultimate/wiki/Docs-Language-Bar)  
KNX Device: [Gateway](/node-red-contrib-knx-ultimate/wiki/Gateway-configuration) • [Device](/node-red-contrib-knx-ultimate/wiki/Device) • [Protections](/node-red-contrib-knx-ultimate/wiki/Protections)  
Other KNX Nodes: [Scene Controller](/node-red-contrib-knx-ultimate/wiki/SceneController-Configuration) • [WatchDog](/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration) • [Logger](/node-red-contrib-knx-ultimate/wiki/Logger-Configuration) • [Global Context](/node-red-contrib-knx-ultimate/wiki/GlobalVariable) • [Alerter](/node-red-contrib-knx-ultimate/wiki/Alerter-Configuration) • [Load Control](/node-red-contrib-knx-ultimate/wiki/LoadControl-Configuration) • [Viewer](/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer) • [Auto Responder](/node-red-contrib-knx-ultimate/wiki/KNXAutoResponder) • [HA Translator](/node-red-contrib-knx-ultimate/wiki/HATranslator) • [IoT Bridge](/node-red-contrib-knx-ultimate/wiki/IoT-Bridge-Configuration)  
HUE: [Bridge](/node-red-contrib-knx-ultimate/wiki/HUE+Bridge+configuration) • [Light](/node-red-contrib-knx-ultimate/wiki/HUE+Light) • [Battery](/node-red-contrib-knx-ultimate/wiki/HUE+Battery) • [Button](/node-red-contrib-knx-ultimate/wiki/HUE+Button) • [Contact](/node-red-contrib-knx-ultimate/wiki/HUE+Contact+sensor) • [Device SW update](/node-red-contrib-knx-ultimate/wiki/HUE+Device+software+update) • [Light sensor](/node-red-contrib-knx-ultimate/wiki/HUE+Light+sensor) • [Motion](/node-red-contrib-knx-ultimate/wiki/HUE+Motion) • [Scene](/node-red-contrib-knx-ultimate/wiki/HUE+Scene) • [Tap Dial](/node-red-contrib-knx-ultimate/wiki/HUE+Tapdial) • [Temperature](/node-red-contrib-knx-ultimate/wiki/HUE+Temperature+sensor) • [Zigbee connectivity](/node-red-contrib-knx-ultimate/wiki/HUE+Zigbee+connectivity)  
Samples: [Logger](/node-red-contrib-knx-ultimate/wiki/Logger-Sample) • [Switch Light](/node-red-contrib-knx-ultimate/wiki/-Sample---Switch-light) • [Dimming](/node-red-contrib-knx-ultimate/wiki/-Sample---Dimming) • [RGB color](/node-red-contrib-knx-ultimate/wiki/-Sample---RGB-Color) • [RGBW color + White](/node-red-contrib-knx-ultimate/wiki/-Sample---RGBW-Color-plus-White) • [Command a scene actuator](/node-red-contrib-knx-ultimate/wiki/-Sample---Control-a-scene-actuator) • [Datapoint 213.x 4x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT213) • [Datapoint 222.x 3x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT222) • [Datapoint 237.x DALI diags](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT237) • [Datapoint 2.x 1 bit proprity](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT2) • [Datapoint 22.x RCHH Status](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT22) • [Datetime to BUS](/node-red-contrib-knx-ultimate/wiki/-Sample---DateTime-to-BUS) • [Read Status](/node-red-contrib-knx-ultimate/wiki/-Sample---Read-value-from-Device) • [Virtual Device](/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device) • [Subtype decoded](/node-red-contrib-knx-ultimate/wiki/-Sample---Subtype) • [Alexa](/node-red-contrib-knx-ultimate/wiki/-Sample---Alexa) • [Apple Homekit](/node-red-contrib-knx-ultimate/wiki/-Sample---Apple-Homekit) • [Google Home](/node-red-contrib-knx-ultimate/wiki/-Sample---Google-Assistant) • [Switch on/off POE port of Unifi switch](/node-red-contrib-knx-ultimate/wiki/-Sample---UnifiPOE) • [Set configuration by msg](/node-red-contrib-knx-ultimate/wiki/-Sample-setConfig) • [Scene Controller node](/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node) • [WatchDog node](/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog) • [Global Context node](/node-red-contrib-knx-ultimate/wiki/SampleGlobalContextNode) • [Alerter node](/node-red-contrib-knx-ultimate/wiki/SampleAlerter) • [Load control node](/node-red-contrib-knx-ultimate/wiki/SampleLoadControl) • [Viewer node](/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer) • [MySQL, InfluxDB, MQTT Sample](/node-red-contrib-knx-ultimate/wiki/Sample-KNX2MQTT-KNX2MySQL-KNX2InfluxDB)  
Contribute to Wiki: [Link](/node-red-contrib-knx-ultimate/wiki/Manage-Wiki)
<!-- NAV END -->
---
# Nœud de contrôle de charge KNX
<p> Avec le nœud de contrôle de charge, vous pouvez gérer automatiquement la déconnexion des charges (lave-linge, four, etc.) lorsque la consommation de courant dépasse un certain seuil.
Les appareils sont désactivés intelligemment, en vérifiant la consommation possible de l'appareil pour déterminer l'opportunité de le désactiver avec les autres.<br/>
Le nœud peut réactiver automatiquement les charges.<br/>
Le nœud désactive un périphérique (ou plusieurs appareils) à la fois, en fonction de l'ordre que vous avez sélectionné. <br/>
**Général**
| Propriété | Description |
|-|-|
|Passerelle |KNX Gateway.Il est également possible de ne sélectionner aucune passerelle;Dans ce cas, seuls les messages entrants au nœud seront pris en compte.|
|Surveiller WH |Adresse du groupe représentant la consommation totale de votre bâtiment.|
|Limite wh |Seuil maximum que votre compteur d'électricité peut résister.Lorsque ce seuil est dépassé, le nœud commence à éteindre les appareils.|
|Retarder l'éteint (s) |Exprimé en quelques secondes, indique la fréquence à laquelle le nœud évaluera la consommation et éteindra chaque appareil.|
|Retard Switch on (S) |Exprimé en quelques secondes, indique la fréquence à laquelle le nœud évaluera la consommation et allumera chaque dispositif qui a été désactivé.|
<br/>
**Contrôle de charge**
Ici, vous pouvez ajouter des appareils pour désactiver en cas de surcharge.<br/>
Choisissez l'appareil à éteindre.Entrez le nom du périphérique ou son adresse de groupe.<br/>
Entrez n'importe quelle adresse de groupe qui indique la consommation de l'appareil choisi dans la première ligne. **Il s'agit d'un paramètre facultatif** .Si l'appareil consomme plus qu'un certain nombre de watts, cela signifie qu'il est utilisé.S'il consomme moins, l'appareil sera considéré comme "non utilisé" et le ceci et le prochain seront désactivés en même temps. <br/>
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
## Détails```javascript
msg = {
  "topic": "Home Total Consumption", // Node Name
  "operation": "Increase Shedding" or "Decrease Shedding" or operation reflecting the input message (disable, enable, reset), // Operation
  "device": "Washing machine", // Device shedded
  "ga": "", // Group address of the shedded device
  "totalPowerConsumption": 3100, // Current power consumption
  "wattLimit": 3000, // Limit you set in the config window
  "payload": 1, // Current shedding stage
}
```# Échantillon
<a href = "/node-red-contrib-knx-ultimate/wiki/SampleLoadControl"> Cliquez ici pour l'exemple </a>
<br/>