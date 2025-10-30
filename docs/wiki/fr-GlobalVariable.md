🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/GlobalVariable) | [IT](/node-red-contrib-knx-ultimate/wiki/it-GlobalVariable) | [DE](/node-red-contrib-knx-ultimate/wiki/de-GlobalVariable) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-GlobalVariable) | [ES](/node-red-contrib-knx-ultimate/wiki/es-GlobalVariable) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-GlobalVariable)
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
# Variable globale KNX
Ce nœud expose l'adresse de groupe reçue du bus à une variable globale **** <br/>
Vous pouvez écrire dans le bus KNX en mettant simplement à jour la variable globale! <br/>
## Aperçu
Mettez un nœud de contexte global dans l'écoulement, puis donnez-lui un nom. <br/>
Le nom que vous donnez au nœud deviendra le nom de la variable de contexte globale. <br/>
C'est tout. Pour des raisons de sécurité, veuillez modifier le nom du nœud par défaut** <br/>
Vous pouvez accéder à la variable globale en ajoutant le suffixe \ _read au nom du nœud. <br/>
Vous pouvez activer / désactiver la variable de contexte globale, ou activer la lecture ou lire / écrire dans la fenêtre de configuration. <br/>
Vous pouvez émettre une commande KNX Bus Write, en modifiant simplement le nom de variable global avec Suffix \ _Write. _ **Une fois les commandes exécutées, la variable globale avec suffixe \ _write est automatiquement vidé, pas pour répéter infiniment les commandes. ** _ <br/>**Paramètres**
| Propriété | Description |
|-|-|
| Passerelle | La passerelle KNX. |
| Nom variable | Nom du contexte mondial. 2 variables avec ce nom seront créées, l'une avec le suffixe \ _read (pour la lecture d'adresses de groupe) et l'autre avec le suffixe \ _Write (pour l'écriture d'adresses de groupe). Par exemple, si le nom de la variable est "knxGlobalContext", les 2 variables knxglobalcontext \ _read et knxglobalcontext \ _write sont créées. Étant donné que la variable globale est visible à partir de tous les nœuds (même les non-KNX-ultime), pour des raisons de sécurité, définissez un nom autre que celui par défaut. Cliquez sur l'exemple de lien en bas de la page. |
| Exposer en tant que variable globale | Choisissez si et comment vous souhaitez exposer la variable globale. Si vous n'avez pas l'intention d'écrire sur le bus KNX, pour la sécurité, laissez "lire seulement". |
| Intervalle d'écriture de bus | Le nœud vérifie la variable avec le suffixe \ _Write à intervalles réguliers pour écrire sur le bus KNX. Choisissez l'intervalle que vous préférez. |
## Propriétés MSG
```javascript
// Properties of the variable, both in reading and in writing
{
    address : "0/0/1",
    dpt: "1.001",
    payload: true,
    devicename:"Dinning Room->Table Light"
}
```
# Utilisation
## Échantillon de nœud de contexte global
Ce nœud expose l'adresse de groupe reçue du bus à une variable globale **** <br/>
Vous pouvez écrire dans le bus KNX en mettant simplement à jour la variable globale! <br/>
## Aperçu
Mettez un nœud de contexte global dans l'écoulement, puis donnez-lui un nom. <br/>
Le nom que vous donnez au nœud deviendra le nom de la variable de contexte globale. <br/>
C'est tout. Pour des raisons de sécurité, veuillez modifier le nom du nœud par défaut** <br/>
Vous pouvez accéder à la variable globale en ajoutant le suffixe \ _read au nom du nœud. <br/>
Vous pouvez activer / désactiver la variable de contexte globale, ou activer la lecture ou lire / écrire dans la fenêtre de configuration. <br/>
Vous pouvez émettre une commande KNX Bus Write, en modifiant simplement le nom de variable global avec Suffix \ _Write. _ **Une fois les commandes exécutées, la variable globale avec suffixe \ _write est automatiquement vidé, pas pour répéter infiniment les commandes.** _ <br/>
<br/>
<br/>
### Voir le code
> Ajustez les nœuds en fonction de votre configuration
```javascript
[{"id":"ababb834.9073","type":"knxUltimateGlobalContext","z":"5ed79f4a958a1f20","server":"b60c0d73.1c02b","name":"KNXContextBanana","exposeAsVariable":"exposeAsVariableREADWRITE","writeExecutionInterval":"1000","x":230,"y":200,"wires":[]},{"id":"2954e7ea.f53988","type":"function","z":"5ed79f4a958a1f20","name":"Write to the KNXContextBanana variable","func":"// This function writes some values to the KNX bus\nlet GroupAddresses = [];\nGroupAddresses.push ({address: \"0/0/10\", dpt:\"1.001\", payload:true});\nGroupAddresses.push({ address: \"0/0/11\", dpt: \"1.001\", payload: true });\nGroupAddresses.push({ address: \"0/0/12\", dpt: \"1.001\", payload: false });\n\n// You can also avoid setting datapoint.\n// This works gread if you have imported the ETS file, otherwise it'll guess the datapoint type by analyzing the payload\nGroupAddresses.push ({address: \"0/0/14\", payload:false});\nGroupAddresses.push({ address: \"0/0/15\", payload: 50 });\n\n// Remember: add the string \"_WRITE\" after the node name to write to the bus\nglobal.set(\"KNXContextBanana_WRITE\",GroupAddresses);\n","outputs":0,"noerr":0,"initialize":"","finalize":"","libs":[],"x":480,"y":300,"wires":[]},{"id":"bd4380e3.8c1ea","type":"inject","z":"5ed79f4a958a1f20","name":"Call the function","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"true","payloadType":"bool","x":220,"y":300,"wires":[["2954e7ea.f53988"]]},{"id":"269bf86a.34e9f8","type":"comment","z":"5ed79f4a958a1f20","name":"Exposing the Group Addresses to the global context variable","info":"","x":360,"y":160,"wires":[]},{"id":"f9a6ff93.086a","type":"function","z":"5ed79f4a958a1f20","name":"Read the KNXContextBanana variable","func":"// This function reads the variable\n// Remember: add the string \"_READ\" after the node name to read the variable\nlet GroupAddresses = global.get(\"KNXContextBanana_READ\") || [];\n\n// Outputs the array, as example\nnode.send({payload:GroupAddresses});\n\n// Get the Group Address object, having address 0/0/10\nlet Ga = GroupAddresses.find(a => a.address === \"0/0/10\");\n\n// Outputs the object, as example\nnode.send({ Found: Ga });\n\n// Do some testing and output some stuffs.\nif (Ga.payload === true) return {payload : \"FOUND AND TRUE\"};\nif (Ga.payload === false) return {payload : \"FOUND AND FALSE\"};\n\n","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":410,"y":420,"wires":[["f4109aa5.270e08"]]},{"id":"64c9e0f0.b13178","type":"inject","z":"5ed79f4a958a1f20","name":"Read","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"true","payloadType":"bool","x":190,"y":420,"wires":[["f9a6ff93.086a"]]},{"id":"f4109aa5.270e08","type":"debug","z":"5ed79f4a958a1f20","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","statusVal":"","statusType":"auto","x":630,"y":420,"wires":[]},{"id":"bf16d5a9.073b6","type":"comment","z":"5ed79f4a958a1f20","name":"Check global variable and do some stuffs","info":"","x":300,"y":380,"wires":[]},{"id":"85c342f08c9c4705","type":"comment","z":"5ed79f4a958a1f20","name":"This function writes some values to the bus","info":"","x":310,"y":260,"wires":[]},{"id":"b60c0d73.1c02b","type":"knxUltimate-config","host":"224.0.23.12","port":"3671","physAddr":"15.15.22","suppressACKRequest":false,"csv":"","KNXEthInterface":"Auto","KNXEthInterfaceManuallyInput":"","statusDisplayLastUpdate":false,"statusDisplayDeviceNameWhenALL":true,"statusDisplayDataPoint":true,"stopETSImportIfNoDatapoint":"fake","loglevel":"error","name":"Multicast","localEchoInTunneling":true,"delaybetweentelegrams":"","delaybetweentelegramsfurtherdelayREAD":"","ignoreTelegramsWithRepeatedFlag":false,"keyringFileXML":""}]
```
<br/>
## Obtenez la valeur de la variable
```javascript
// This function reads the variable
// Remember: add the string "_READ" after the node name to read the variable
let GroupAddresses = global.get("KNXContextBanana_READ") || [];
// Outputs the array, as example
node.send({payload:GroupAddresses});
// Get the Group Address object, having address 0/0/10
let Ga = GroupAddresses.find(a => a.address === "0/0/10");
// Outputs the object, as example
node.send({ Found: Ga });
// Do some testing and output some stuffs.
if (Ga.payload === true) return {payload : "FOUND AND TRUE"};
if (Ga.payload === false) return {payload : "FOUND AND FALSE"};
```
## Envoyer KNX Telegram via une variable globale
```javascript
// This function writes the value to the KNX bus
let GroupAddressesSend = [];
GroupAddressesSend.push({address: "0/0/10", dpt:"1.001", payload:msg.payload});
// You can also avoid setting datapoint.
// This works gread if you have imported the ETS file, otherwise it'll guess the datapoint type by analyzing the payload
GroupAddressesSend.push({address: "0/0/11", payload:msg.payload});
// Remember: add the string "_WRITE" after the node name to write to the bus
global.set("KNXContextBanana_WRITE",GroupAddressesSend);
```
# ÉCHANTILLON
<a href = "/node-red-contrib-knx-ultimate/wiki/SampleglobalContextNode" Target = "_ Blank"> <i class="fa fa-info-circle"> </i> Voir cet échantillon </a>
