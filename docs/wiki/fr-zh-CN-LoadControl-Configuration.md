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
## détail```javascript
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
\ <a href = "/node-red-contrib-knx-ultimate/wiki/SampleLoadControl"> Cliquez ici par exemple </a>
<br/>