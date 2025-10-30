🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/HUE+Scene) | [IT](/node-red-contrib-knx-ultimate/wiki/it-HUE+Scene) | [DE](/node-red-contrib-knx-ultimate/wiki/de-HUE+Scene) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-HUE+Scene) | [ES](/node-red-contrib-knx-ultimate/wiki/es-HUE+Scene) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Scene)
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
Le nœud **Hue Scene** expose des scènes de teinLe champ de scène prend en charge la saisie semi-automatique;Utilisez l'icône d'actualisation après avoir ajouté des scènes sur le pont afin que la liste reste à jour.
### Tabs en un coup d'œil
- **Mapping** - Lien des adresses de groupe KNX à la scène Hue sélectionnée.DPT 1.xxx effectue un rappel Boolean, tandis que DPT 18.xxx envoie un numéro de scène KNX.
- **Multi Scene** - Créez une liste de règles qui associe les numéros de scène KNX à différentes scènes de teintes et choisit si chaque scène est rappelée comme _ACTIVE_, _DYMAMIC \ _PALETTE_ ou _STATIC_.
- **comportement** - basculer la broche de sortie du nœud-rouge.Lorsqu'aucune passerelle KNX n'est configurée, la broche reste activée afin que les événements de pont atteignent toujours l'écoulement.
### Paramètres généraux
| Propriété | Description |
|-|-|
|KNX GW |KNX Gateway Fourniture du catalogue d'adresses utilisé pour la saisie semi-automatique.|
|Hue Bridge |Hue Bridge qui héberge les scènes.|
|Scène de la teinte |Scène à rappeler (Ambordage automatique; Bouton de rafraîchissement recharge le catalogue du pont).|
Onglet de mappage ###
| Propriété | Description |
|-|-|
|Rappelons GA |Adresse du groupe KNX qui rappelle la scène.Utilisez DPT 1.xxx pour le contrôle booléen ou DPT 18.xxx pour transmettre un numéro de scène KNX.|
|DPT |DataPoint utilisé avec le rappel GA (1.xxx ou 18.001).|
|Nom |Étiquette amicale pour le rappel GA.|
|# |Apparaît lorsqu'une scène KNX DPT est choisie;Sélectionnez le numéro de scène KNX à envoyer.|
|Statut GA |Boolean GA en option qui reflète si la scène est actuellement active.|
Onglet ### Multi Scene
| Propriété | Description |
|-|-|
|Rappelons GA |KNX GA (DPT 18.001) qui sélectionne les scènes par numéro.|
|Sélecteur de scène |Liste modifiable qui mappe les numéros de scène KNX aux scènes de teinte avec le mode de rappel souhaité.La traînée gère les entrées de réorganisation.|
> ℹ️ Les widgets spécifiques au KNX n'apparaissent qu'après la sélection d'une passerelle KNX.Les onglets de mappage restent masqués jusqu'à la configuration du pont et de la passerelle.