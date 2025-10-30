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
<p> Ce nœud répondra aux demandes de lecture du bus KNX.
Le nœud enregistre tous les télégrammes transmis au bus KNX et stockent les valeurs en mémoire. \
Il répond ensuite aux demandes de lecture en renvoyant cette valeur mémorisée dans le bus comme demande. \
Si l'adresse du groupe à lire n'a pas encore de valeur, le nœud répondra avec une valeur par défaut. \
Le nœud répondra uniquement aux adresses de groupe spécifiées dans le champ **Réponse au** JSON. \
Par défaut, il existe un exemple **pré-compilé ** "Répondez au" Texte JSON, où vous pouvez simplement changer / supprimer des choses.Veuillez vous assurer que**de ne pas l'utiliser comme c'est ** !!!**Configuration**
| Propriété | Description |
|-|-|
|Passerelle |Sélectionnez la passerelle KNX à utiliser |
|Répondre à |Le nœud répondra aux demandes de lecture provenant des adresses de groupe spécifiées dans ce tableau JSON.Le format est spécifié ci-dessous.|
<br/>
**Format JSON ** Le JSON est**toujours** un tableau d'objet, contenant chaque directive.Chaque directive indique au nœud ce qui fait.
| Propriété | Description |
|-|-|
|Remarque | **Facultatif** Note Key, pour les rappels.Il ne sera utilisé nulle part.|
|GA |L'adresse du groupe.Vous pouvez également utiliser les Wildchars "..", pour spécifier une gamme d'adresses de groupe.Le ".." ne peut être utilisé qu'avec le niveau du troisième GA, Ex: **1/1/0..257** .Voir les échantillons ci-dessous.|
|DPT |Le groupe adressé le point de données, dans le format "1.001".C'est **facultatif** Si le fichier ETS CSV a été importé.|
|par défaut |La valeur envoyée au bus en réponse à une demande de lecture, lorsque la valeur d'adresse du groupe n'a pas encore été mémorisée par le nœud.|
**Commençons par une directive**
Le nœud AutoResPonder répondra aux demandes de lecture de l'adresse du groupe 2/7/1.Si aucune valeur n'est encore en mémoire, elle répondra avec _true _. \
Le fichier ETS CSV doit avoir été importé, sinon vous devez également ajouter la clé **"DPT": "1.001"** .```json
[
    {
        "ga": "2/7/1",
        "default": true
    }
]
``` **Directive un peu plus complète**
Le nœud AutoResPonder répondra aux demandes de lecture de l'adresse du groupe à partir du 3/1/1 au 3/1/22 inclus.Si aucune valeur n'est encore en mémoire, elle répondra avec _false _. \
Il y a aussi une touche **note** , simplement comme une note de rappel.Il ne sera utilisé nulle part.```json
[
    {
        "note": "Virtual sensors coming from Hikvision AX-Pro",
        "ga": "3/1/1..22",
        "dpt": "1.001",
        "default": false
    }
]
``` **Directives de concaténation**
Le nœud de réponse automatique répondra aux demandes de lecture de l'adresse du groupe à partir du 2/2/5 au 2/2/21 incluse.Si aucune valeur n'est encore en mémoire, elle répondra avec une valeur de 25. \
Le nœud AutoResPonder répondra également aux demandes de lecture de l'adresse du groupe 2/4/22.Si aucune valeur n'est encore en mémoire, elle répondra avec la chaîne _Unknown Status! _. \
Veuillez noter le **virgule** entre l'objet JSON de chaque directive.```json
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