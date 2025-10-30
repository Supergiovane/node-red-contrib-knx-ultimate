🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/KNXAutoResponder) | [IT](/node-red-contrib-knx-ultimate/wiki/it-KNXAutoResponder) | [DE](/node-red-contrib-knx-ultimate/wiki/de-KNXAutoResponder) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-KNXAutoResponder) | [ES](/node-red-contrib-knx-ultimate/wiki/es-KNXAutoResponder) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-KNXAutoResponder)
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
<p> Ce nœud répondra à la demande de lecture du bus KNX.
Le nœud enregistre tous les télégrammes qui sont transférés dans le bus KNX et stockent les valeurs en mémoire.
Il répond ensuite à la demande de lecture en renvoyant ces valeurs mémorisées au bus en fonction de la demande.
Si l'adresse du groupe à lire n'a pas encore de valeur, le nœud répondra avec la valeur par défaut.
Ce nœud répondra uniquement à l'adresse de groupe spécifiée dans le champ **Response** JSON.
Par défaut, il existe un texte JSON précompilé * ***"Response" que vous pouvez simplement modifier / supprimer du contenu.Veuillez vous assurer que** n'appuyez pas sur **pour l'utiliser!!!** Configuration**| Propriétés | Description |
|-|-|
| Passerelle | Sélectionnez le portail KNX à utiliser |
| Réponse | Node répondra à une demande de lecture de l'adresse de groupe spécifiée dans ce tableau JSON.Le format est spécifié ci-dessous.|
<br/>
\ *\* JSON Format \ *\*
JSON est toujours un tableau d'objets contenant chaque instruction.Chaque instruction indique au nœud quoi faire.
| Propriétés | Description |
|-|-|
| Remarque | ** Clé de note facultative** Remarque pour obtenir des rappels.Il ne sera utilisé nulle part.|
| GA | Adresse du groupe.Vous pouvez également utiliser ".." des pièces sauvages à des groupes d'adresses spécifiques.".." ne peut être utilisé qu'avec le troisième niveau GA, par exemple: \ *\* 1/1/0..257**.Veuillez consulter l'échantillon ci-dessous.|
| DPT | Point de données d'adresse de groupe, format "1.001".Si le fichier ETS CSV a été importé, **Facultatif \* \ *. |
| Par défaut |Lorsque la valeur d'adresse du composant n'a pas été rappelée par le nœud, il est envoyé au bus dans une réponse de demande de lecture.| ** Commençons par une commande** Le nœud de répondeur automatique répondra à une demande de lecture à l'adresse du groupe 2/7/1.Si ce n'est pas encore en mémoire, il répondra avec _true _. |
Le fichier ETS CSV doit être importé, sinon vous devez également ajouter la touche __"DPT": "1.001" \ *\*.```json
[
    {
        "ga": "2/7/1",
        "default": true
    }
]
``` ** Instructions plus complètes** Le nœud de réponse automatique répondra aux demandes de lecture à partir du 3/1/1, y compris le 3/1/22.Si la mémoire n'a pas encore de valeur, elle répondra avec _false _.
Il existe également une touche__ note \ *\*, qui n'est utilisée que comme note de rappel.Il ne sera utilisé nulle part.```json
[
    {
        "note": "Virtual sensors coming from Hikvision AX-Pro",
        "ga": "3/1/1..22",
        "dpt": "1.001",
        "default": false
    }
]
``` ** Commande connectée** Du 2/2/5 au 2/2/21, le nœud AutoResPonder répondra à une demande de lecture à l'adresse du groupe.S'il n'y a pas encore de valeur en mémoire, il répondra avec une valeur de 25.
Le nœud AutoResPonder répondra également aux demandes de lecture du composant 2/4/22.S'il n'y a pas encore de valeur en mémoire, il utilisera l'état de chaîne \ *inconnu!\*répondre.
Notez la ** virgule** entre les objets JSON de chaque directive.```json
[
    {
        "note": "DALI garden virtual brightness %",
        "ga": "2/2/5..21"
        "default": 25
    },
    {
        "note": "Alarm armed status text",
        "ga": "2/4/22",
        "dpt": "16.001",
        "default": "Unknown status!"
    }
]
```<br/>