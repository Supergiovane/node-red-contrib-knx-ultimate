🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/HUE+Plug) | [IT](/node-red-contrib-knx-ultimate/wiki/it-HUE+Plug) | [DE](/node-red-contrib-knx-ultimate/wiki/de-HUE+Plug) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-HUE+Plug) | [ES](/node-red-contrib-knx-ultimate/wiki/es-HUE+Plug) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Plug)
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
# Plug / prise
## Aperçu
Le nœud Hue Plug relie une fiche Smart Hue Philips (Service `Plug`) avec des adresses de groupe KNX afin que vous puissiez contrôler l'alimentation et suivre l'état directement à partir du bus.
- prend en charge **Contrôle ON / OFF ** et**Feedback d'état** .
- mappage facultatif de la teinte `power_state` (on / standby).
- Peut exposer les broches d'entrée / sortie de Node-Red pour transmettre les événements de teinte aux flux ou envoyer des charges utiles API avancées.
Configuration ##
| Champ | Description |
|-|-|
|KNX GW |KNX Gateway utilisé pour les télégrammes |
|Hue Bridge |Bridge Hue configuré |
|Nom |Sélectionnez la fiche Hue dans la liste de saisie semi-automatique |
|Contrôle |KNX GA pour les commandes ON / OFF (Boolean DPT) |
|Statut |GA pour les commentaires ON / OFF provenant de Hue |
|État de pouvoir |Hue en miroir en option `power_state` (booléen / texte) |
|Lire l'état au démarrage |Lorsqu'il est activé, le nœud émet l'état de fiche actuel sur le déploiement / la connexion |
|Broches d'E / S de nœud |Activer les broches d'entrée / sortie rouge-rouge.L'entrée attend des charges utiles de l'API Hue (par exemple `{on: {on: true}}`).La sortie transmet chaque événement Hue.|
## conseils de mappage KNX
- Utilisez un point de données booléen (par exemple DPT 1.001) pour la commande et l'état.
- Si vous exposez `Power_State`, mappez-le à un GA booléen (true =` on`, false = `standby`).
- Pour les demandes de lecture (`GroupValue_Read`), le nœud renvoie la dernière valeur de teinte en cache.
## Intégration de flux
Lorsque _Node E / S Pins_ sont activés:
- **Entrée:** Envoyer des charges utiles Hue V2 pour effectuer des actions avancées (par exemple `msg.on = {on: true}`).
- **sortie:** Recevoir un objet d'événement `{Payé: Boolean, ON, Power_State, RawEvent}` Chaque fois que Hue signale un changement.
## Référence de l'API Hue
Le nœud utilise `/ ressource / plug / {id}` sur https.Les modifications d'état sont fournies via le flux d'événements Hue et mises en cache pour les réponses KNX Read.