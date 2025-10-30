🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/SceneController-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-SceneController-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-SceneController-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-SceneController-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-SceneController-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-SceneController-Configuration)
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
# Contrôleur de scène
Ce nœud est cohérent avec le contrôleur de scène KNX: la scène peut être enregistrée et rappelée.
Paramètres de nœud ##
| Propriétés | Description |
|-|-|
| Passerelle | Gateway KNX sélectionné. |
| Rappel de scène | **DataPoint ** et**Valeur de déclenchement** . L'adresse de groupe utilisée pour rappeler le scénario (comme `0/0 / 1`).Le nœud rappelle la scène lorsque le message est reçu par cette GA.DPT est le type de rappel GA;La valeur de déclenchement est la valeur requise pour déclencher le rappel.CONSEIL: Si vous êtes déclenché en mode DIM, veuillez définir la valeur de l'objet de gradin correct (ajustement up par `{de diminuant: 1, données: 5}` et ajustement en bas par `{de diminuer: 0, données: 5}`).|
| Scene sauve | **DataPoint ** et**Valeur de déclenchement** . L'adresse de groupe utilisée pour enregistrer la scène (comme `0/0 / 2`).Lorsqu'un nœud reçoit un message, il enregistre la valeur actuelle de tous les appareils dans la scène (stockage non volatile).DPT est le type pour sauver GA; La valeur de déclenchement déclenche des sauvegardes (Dim supra).|
| Nom du nœud | Nom du nœud (écrivez "Rappel:… / Save:…"). |
| Sujet |Le sujet du nœud. |
## Configuration du scénario
Comme un vrai contrôleur de scène KNX, ajoutez des appareils à la scène; Chaque ligne représente un appareil.
Une fois qu'une nouvelle valeur est reçue du bus, le nœud enregistrera automatiquement la dernière valeur de l'actionneur de la scène.
| Propriétés | Description |
|-|-|
| Ajouter le bouton | Ajoutez une nouvelle ligne.|
| Champ de ligne | 1) Adresse du groupe 2) Datapoint 3) Valeur de scène par défaut (peut être écrasée par Scene Save).Le nom de l'appareil est ci-dessous.<br/> Insérer une pause: remplissez **attendre ** dans la première colonne, et remplissez la dernière colonne pour la durée (millisecondes), comme «2000».<br/>**Wait** prend également en charge les secondes / minute / heure: `12S`,` 5M`, `1H`.|
| Supprimer | Supprimer cette ligne d'appareil.|
## sortie de nœud```javascript
msg = {
  topic: "Scene Controller",
  recallscene: true|false,
  savescene: true|false,
  savevalue: true|false,
  disabled: true|false
}
```---
## Message d'entrée (entrée)
Le nœud repose principalement sur les messages KNX pour rappeler / sauver la scène; Il peut également être contrôlé via des messages.Les commandes du bus peuvent être désactivées et seuls les messages de traitement peuvent être acceptés.
**Scénario de rappel** ```javascript
msg.recallscene = true; return msg;
``` **Enregistrer la scène** ```javascript
msg.savescene = true; return msg;
``` **Enregistrer la valeur actuelle d'un ga**
Bien que la scène suit automatiquement la valeur de l'exécuteur testamentaire, dans certains cas, il est nécessaire d'enregistrer la valeur actuelle d'un autre GA (comme le statut plutôt que la commande) avec une "valeur de scène réelle".
Par exemple, l'obturateur à rouleaux: l'état GA de hauteur absolue reflète la position exacte.Cet état GA est utilisé pour mettre à jour la commande GA de l'exécuteur exécutif concerné dans la scène.```javascript
msg.savevalue = true;
msg.topic = "0/1/1"; // GA
msg.payload = 70; // 要保存的值
return msg;
``` **Désactiver le contrôleur de scène**
Désactivez les commandes du bus KNX (acceptez toujours les messages de processus).Par exemple, il est utile lorsque vous ne voulez pas rappeler / enregistrer une scène du bouton d'entité la nuit.```javascript
msg.disabled = true; // false 重新启用
return msg;
```## Voir
[Exemple de contrôleur de scène](/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node)