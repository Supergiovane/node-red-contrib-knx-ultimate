🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/Logger-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-Logger-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-Logger-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-Logger-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-Logger-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-Logger-Configuration)
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
# Enregistreur
<p> Le nœud d'enregistrement enregistre tous les télégrammes et les sortira dans un fichier compatible XML moniteur de bus ETS. </p>
<br/>
Vous pouvez enregistrer le fichier sur le disque ou l'envoyer à un serveur FTP, par exemple.Le fichier peut ensuite être lu par votre ETS, par exemple pour le diagnostic ou pour une rediffusion des télégrammes.
<br/>
Le nœud peut également compter les télégrammes par seconde (ou tout intervalle que vous souhaitez).
<br/> <a href = "/node-red-contrib-knx-ultimate/wiki/Logger-sample" Target = "_ Blank"> Les exemples sont ici. </a>
<br/>
## PARAMÈTRES
| Propriété | Description |
|-|-|
|Passerelle |La passerelle KNX.|
|Sujet |Le sujet du nœud.|
|Nom |Nom du nœud.|
## fichier de diagnostic de bus compatible ETS
| Propriété | Description |
|-|-|
|Timer de démarrage automatique |Démarre automatiquement la minuterie sur le déploiement ou sur le démarrage du rouge-rouge.|
|Sortir de nouveaux XML chaque (en minutes) |L'heure, en quelques minutes, que le journaliste sortira le fichier compatible du moniteur de bus XML ETS XML.|
|Nombre maximum de lignes dans XML (0 = aucune limite) |Démarre automatiquement la minuterie sur le déploiement ou sur le démarrage du rouge-rouge.|
|Timer de démarrage automatique |Cela représente le nombre maximum de ligne, que le fichier XML peut contenir dans l'intervalle spécifié ci-dessus.Mettez 0 pour ne pas limiter le nombre de lignes dans le fichier.|
|Nombre maximum de lignes dans XML (0 = aucune limite) |Cela représente le nombre maximum de ligne, que le fichier XML peut contenir dans l'intervalle spécifié ci-dessus.Mettez 0 pour ne pas limiter le nombre de lignes dans le fichier.|
<br/>
## KNX TELEGRAM COMPTER
| Propriété | Description |
|-|-|
|Timer de démarrage automatique |Démarre automatiquement la minuterie sur le déploiement ou sur le démarrage du rouge-rouge.|
|Intervalle de comptage (en quelques secondes) |À quelle fréquence émettent un MSG à l'écoulement, contenant le nombre de télégrammes KNX.En quelques secondes.|
<br/>
---
# Sortie du message de l'enregistreur
**broche 1: fichier de fichier compatible du moniteur de bus XML ETS**
Vous pouvez utiliser un nœud de fichier pour enregistrer la charge utile au système de fichiers, ou vous pouvez l'envoyer, par exemple, à un serveur FTP.```javascript
msg = {
        topic:"MyLogger"
        payload: "CommunicationLog xmlns=http://knx.org/xml/telegrams/01 Telegram Timestamp=2020-03-27T07:32:39.470Z Service=L_Data.ind...." (A String containing the XML file)
    }
```<br/> <br/>
**PIN 2: COMPRESSION DE TÉLÉGRAM KNX**
Chaque nombre, le nœud émettra un télégramme comme celui-ci:```javascript
msg = {
        topic:"",
        payload:10,
        countIntervalInSeconds:5,
        currentTime:"25/10/2021, 11:11:44"
    }
```<br/>
---
# Message de flux d'entrée
Vous pouvez contrôler l'enregistreur à certains égards.
## fichier de moniteur de bus compatible ETS XML
**Démarrer la minuterie** <br/>```javascript
// Start the timer
msg.etsstarttimer = true;
return msg;
``` **Arrêtez la minuterie** <br/>```javascript
// Start the timer
msg.etsstarttimer = false;
return msg;
``` **Sortie immédiatement une charge utile avec le fichier ETS** <br/>```javascript
// Output payload. Restart timer as well (in case the timer was active)
msg.etsoutputnow = true;
return msg;
```## KNX TELEGRAM COMPTER
**Démarrer la minuterie** <br/>```javascript
// Start the timer
msg.telegramcounterstarttimer = true;
return msg;
``` **Arrêtez la minuterie** <br/>```javascript
// Start the timer
msg.telegramcounterstarttimer = false;
return msg;
``` **Message de compte télégramme de sortie immédiatement** <br/>```javascript
// Output payload.
msg.telegramcounteroutputnow = true;
return msg;
```## Voir aussi
- _Sample_
- [Exemple d'enregistreur](/node-red-contrib-knx-ultimate/wiki/Logger-Sample)
