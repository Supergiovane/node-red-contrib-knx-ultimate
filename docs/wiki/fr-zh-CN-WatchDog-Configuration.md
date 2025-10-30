🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-WatchDog-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-WatchDog-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-WatchDog-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-WatchDog-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-WatchDog-Configuration)
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
# Watchdog (Watchdog)
Utilisé pour détecter l'état de connexion avec une passerelle ou un appareil KNX spécifique et effectuer des opérations automatisées en cas de défaillance.
**Fonction**
1. Envoyez des messages périodiquement et attendez une réponse. Si la connexion du bus est anormale, diffusez les messages au processus.Deux niveaux de détection sont disponibles (voir ci-dessous).
2. Modifiez les paramètres de passerelle du nœud de configuration (config-node) via le message pour réaliser la commutation du routeur / interface KNX / IP (tel que la commutation de support maître).
3. Force l'établissement / déconnexion du bus KNX.
## Détection de couche de couche Ethernet et KNX
Watchdog fournit des tests à deux niveaux:
- Niveau Ethernet: détecter uniquement la connectivité entre KNX-ultimate et l'interface KNX / IP (unicast).
- Ethernet + KNX - TP: vérifiez l'intégralité du lien (Ethernet → TP).Un appareil physique qui répond aux demandes de lecture est requis.
Convient pour les alarmes d'erreur d'erreur / connexion (notifications par e-mail, commutation automatique de passerelle de sauvegarde, etc.).
## Paramètres (paramètres)
| Propriétés | Description |
|-|-|
| Passerelle | Gateway KNX sélectionné. |
|Adresse du groupe à surveiller |Adresse de groupe utilisée pour l'envoi et la surveillance; DPT doit être 1.x (booléen).|
| Nom | Nom du nœud. |
|Démarrer automatiquement la minuterie de chien de garde | Démarrez automatiquement la minuterie sur le déploiement / démarrage. |
| Niveau de contrôle |Voir ci-dessus. |
**Vérifier le niveau**
> Ethernet: détecter les connexions entre KNX-ultimate (unicast) et l'interface KNX / IP. <br/>
> Ethernet + KNX TP: détection complète (prend en charge le routeur / interface).Envoyer lire à l'appareil physique et attendre la réponse;Toute échec sur Ethernet ou TP sera signalée.Veuillez configurer un **État** GA dans ETS pour un actionneur qui répond à la lecture. <br/>
## Options avancées
| Propriétés | Description |
|-|-|
| Intervalle de réception (en secondes) | Intervalle de détection en secondes. |
| Nombre de réessayer avant de donner une erreur |Combien d'échecs consécutifs sont signalés. |
# Sortie de chien de garde
Watchdog publie un message lorsque la détection interne trouve un défaut, ou qu'un nœud ultime KNX signale une erreur dans le processus.
**Problème de connexion de Watchdog**
<a href = "https://github.com/supergiovane/node-red-constrib-knx-ultimate/wiki/watchdog-configuration" cible = "_ Blank"> Voir ici pour les détails </a>```javascript
msg = {
  type: "BUSError",
  checkPerformed: "Ethernet" // 或 "Eth+KNX",
  nodeid: "23HJ.2355",
  payload: true,
  description: "..."
}
``` **Exception s'est produite sur l'un de vos nœuds ultimes KNX** ```javascript
msg = {
  type: "NodeError",
  checkPerformed: "Self KNX-Ultimate node reporting a red color status",
  nodeid: "23HJ.2355",
  payload: true,
  description: "...",
  completeError: {
    nodeid: "23HJ.2355",
    topic: "0/1/1",
    devicename: "Kitchen Light",
    GA: "0/1/1"
  }
}
``` **Modifier la configuration de la passerelle via setgatewayconfig** ```javascript
msg = {
  type: "setGatewayConfig",
  checkPerformed: "The Watchdog node changed the gateway configuration.",
  nodeid: "23HJ.2355",
  payload: true,
  description: "New Config issued to the gateway. IP:224.0.23.12 Port:3671 PhysicalAddress:15.15.1\nBindLocalInterface:Auto",
  completeError: ""
}
``` **Connexion forcée / déconnexion** ```javascript
msg = {
  type: "connectGateway",
  checkPerformed: "The Watchdog issued a connection/disconnection to the gateway.",
  nodeid: "23HJ.2355",
  payload: true, // true=连接，false=断开
  description: "Connection",
  completeError: ""
}
```---
# Entrez le message (entrée)
## start / stop watddog```javascript
msg.start = true; return msg; // 启动
```
```javascript
msg.start = false; return msg; // 停止
```## Modifier les paramètres de passerelle KNX / IP pendant l'exécution
Modifier IP / Port / PhysicalAddress / Protocol, etc. via `msg.setgatewayconfig`; Le nœud de configuration s'appliquera à la reconnexion.Node - Red se restaure aux paramètres du nœud de configuration après le redémarrage.Tous les paramètres sont facultatifs.```javascript
msg.setGatewayConfig = { IP:"224.0.23.12", Port:3671, PhysicalAddress:"15.15.1", BindToEthernetInterface:"Auto",
  Protocol:"Multicast", importCSV:`"Group name" "Address" "Central" "Unfiltered" "Description" "DatapointType" "Security"
"Attuatori luci" "0/-/-" "" "" "" "" "Auto"
"Luci primo piano" "0/0/-" "" "" "" "" "Auto"
"Luce camera da letto" "0/0/1" "" "" "" "DPST-1-1" "Auto"` };
return msg;
```Changez uniquement l'IP:```javascript
msg.setGatewayConfig = { IP:"224.0.23.12" }; return msg;
``` **Déconnexion forcée et désactiver la reconnexion automatique** ```javascript
msg.connectGateway = false; return msg;
``` **Connexion forcée et activer la reconnexion automatique** ```javascript
msg.connectGateway = true; return msg;
```## Voir
[Exemple de chien de garde](/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog)
