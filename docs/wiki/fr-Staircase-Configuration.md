🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/Staircase-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-Staircase-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-Staircase-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-Staircase-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-Staircase-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-Staircase-Configuration)
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
# Temporisateur d'escalier
Le nœud **KNX Staircase** émule un éclairage d'escalier temporisé. Lorsqu'un front actif est reçu sur la GA d'impulsion la lampe s'allume, le compte à rebours démarre et un préavis peut être envoyé avant l'extinction. Override manuel, blocage et émission d'événements sont également pris en charge.
## Adresses de groupe
|Usage|Propriété|Remarques|
|--|--|--|
| Impulsion | `Trigger GA` (`gaTrigger`) | La valeur `1` démarre ou prolonge le minuteur. Avec l'option « La valeur 0 annule » un `0` éteint immédiatement. |
| Sortie | `Output GA` (`gaOutput`) | Actionneur commandé pendant le cycle (DPT par défaut 1.001). |
| État | `Status GA` (`gaStatus`) | Reflète l'état actif et le préavis. |
| Override | `gaOverride` | Maintient l'éclairage allumé et suspend le minuteur tant que la valeur vaut `1`. |
| Blocage | `gaBlock` | Empêche les nouvelles impulsions et peut forcer l'arrêt. |
## Minuteur et préavis
- **Durée du minuteur** définit la durée de base.
- **Nouvelle impulsion** permet de redémarrer, prolonger ou ignorer les impulsions supplémentaires.
- **La valeur 0 annule le cycle** termine le minuteur avec le motif `manual-off` lorsque l'impulsion repasse à `0`.
- **Lors du blocage** indique si l'on se contente d'ignorer les impulsions ou si l'on coupe également la sortie.
- Le préavis peut basculer la GA d'état ou faire clignoter la sortie pendant la durée définie.
## Événements et sortie
- En activant *Émettre des événements* le nœud publie des objets contenant `event`, `remaining`, `active`, `override`, `blocked` (`trigger`, `extend`, `prewarn`, `timeout`, `manual-off`, `override`, `block`).
- La GA d'état peut servir de retour direct dans une logique KNX.
## Exemple de flow
```javascript
// Démarrer le temporisateur d'escalier
msg.payload = true;
return msg;
```
```javascript
// Annuler le cycle (option "La valeur 0 annule")
msg.payload = false;
return msg;
```
## Bonnes pratiques
- Utilisez l'override pour la maintenance ou des nettoyages prolongés.
- Affichez la GA d'état sur un tableau de bord ou un voyant.
- Le clignotement de préavis nécessite un actionneur capable de commuter rapidement.
