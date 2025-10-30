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
<p> Le nœud de contrôle de la scène, se comporte exactement comme un périphérique de contrôleur de scène.Il est capable d'économiser et de rappeler une scène. </p>
# Paramètres de nœud de contrôleur de scène
|Propriété |Description |
|------------ |------------------------------------------------------------------------------------------------ |
|Passerelle |Gateway KNX sélectionné.|
|Rappel de scène | **DataPoint ** et**Valeur de déclenchement ** .Adresse du groupe pour le rappel de la scène.Exemple 0/0/1.Le contrôleur de scène réagira aux télégrammes provenant de cette adresse de groupe, pour rappeler la scène.Le point de données est le type de point de données (DPT) de l'adresse de groupe _Scène Rappel_.La valeur de déclenchement est la valeur qui doit être reçue, pour déclencher le rappel de la scène.**N'oubliez pas ** : Pour déclencher une scène ou enregistrer une scène via une commande DIM, mettez le rappel de scène ou la scène SAVE**Valeur de déclenchement** , l'objet correct pour l'amorçage ({diminution \ _incr: 1, Données: 5} pour une augmentation DIM, {diminution \ _incr: 0, données: 5} pour la diminution DIM) |
|Scene sauve | **DataPoint ** et**Valeur de déclenchement ** .Adresse du groupe pour enregistrer une scène.Exemple 0/0/2.Le contrôleur de scène réagira aux télégrammes provenant de cette adresse de groupe, en enregistrant toutes les valeurs actuelles de tous les appareils de la scène, qui peuvent être rappelées plus tard.Chaque fois que vous appuyez sur, ou appuyez longtemps sur un vrai bouton-poussoir KNX dans votre bâtiment, le contrôleur de scène lira les valeurs de tous les appareils de la scène et l'enregistrera dans un stockage non volatil.Le point de données est le type de point de données (DPT) de l'adresse de groupe _Scène Save_.La valeur de déclenchement est la valeur qui doit être reçue, pour déclencher l'enregistrement de la scène.**N'oubliez pas ** : Pour déclencher une scène ou enregistrer une scène via une commande DIM, mettez le rappel de scène ou la scène SAVE**Valeur de déclenchement** , l'objet correct pour l'amorçage ({diminution \ _incr: 1, Données: 5} pour une augmentation DIM, {diminution \ _incr: 0, données: 5} pour la diminution DIM) |
|Nom du nœud |Nom du nœud, dans le format "Rappel: nom de l'appareil utilisé pour rappeler la scène / enregistrer: nom de l'appareil pour enregistrer la scène".Mais vous pouvez définir le nom que vous voulez.|
|Sujet |Sujet de Node.|
Configuration de la scène ##
Vous devez ajouter des appareils à la scène, comme un appareil KNX de contrôleur de scène réel standard.Il s'agit d'une liste, chaque ligne représente un appareil.
_ **Le nœud de scène enregistre automatiquement les valeurs mises à jour de tous les actionneurs appartenant à la scène, chaque fois qu'il reçoit une nouvelle valeur du bus.** _
|Propriété |Description |
|------------- |------------------------------------------------------------------------------------------------ |
|Ajouter le bouton |Ajoutez une ligne à la liste.|
|Champ de la ligne |Le premier champ est l'adresse de groupe, la deuxième est le point de données, le troisième est la valeur par défaut de ce périphérique dans la scène (cela peut être remplacé par la fonction _Scene Save_).Ci-dessous, le nom du périphérique est ci-dessous.( **12s ** ) <br> Pour définir une valeur en minutes, ajoutez**m ** après la valeur numérique, par exemple (**5m ** ) <br> Pour définir une valeur en heures, ajoutez**h ** après la valeur numérique, par exemple (**1h** ) |
|Supprimer le bouton |Supprimer un appareil de la liste.|
# Sortie du message du nœud de contrôleur de scène```javascript
msg = {
    topic: "Scene Controller" <i>(Contains the node's topic, for example "MyTopic").</i>
    recallscene: <i>(<b>true</b> if a scene has been recalled, otherwise <b>false</b>).</i>
    savescene: <i>(<b>true</b> if a scene has been saved, otherwise <b>false</b>).</i>
    savevalue: <i>(<b>true</b> if a group address value belonging to an actuator in the scene, has been manually saved by a msg input, otherwise <b>false</b>).</i>
    disabled: <i>(<b>true</b> if the scene controller has been disabled via input message msg.disabled = true, otherwise <b>false</b>).</i>
}
```---
# Message de flux d'entrée
Le nœud de contrôleur de scène réagit primoramment aux télégrammes KNX et s'appuie à cela pour rappeler et sauver des scènes.
Vous pouvez cependant rappeler et enregistrer des scènes en envoyant un MSG au nœud.Le contrôleur de scène peut être désactivé pour inhiber les commandes provenant du bus KNX.
**Rappelez-vous une scène** ```javascript
// Example of a function that recall the scene
msg.recallscene = true;
return msg;
``` **Enregistrer une scène** ```javascript
// Example of a function that saves the scene
msg.savescene = true;
return msg;
``` **Enregistrer la valeur actuelle d'une adresse de groupe ** _**Le nœud de scène enregistre déjà les valeurs mises à jour de tous les actionneurs appartenant à la scène.** _
Parfois, il est utile de pouvoir enregistrer la valeur actuelle d'une adresse de groupe différente de celle entrée dans la scène, en tant que valeur réelle de l'actionneur de scène.
Par exemple, un actionneur d'obturation a généralement une adresse de groupe de commande et un statut.
Le nœud enregistre la scène en prenant des valeurs d'adresse de groupe de commande, qui peuvent ne pas être alignées sur la valeur de l'état réelle.
Cependant, vous pouvez contourner cela en mettant manuellement la valeur de l'adresse du groupe de commande, en le tirant de l'adresse du groupe d'état.
Pensez ceci: si vous avez un actionneur aveugle, ayant une adresse de groupe pour déplacer, une adresse de groupe pour Step, une adresse de groupe pour la hauteur absolue, etc.<br/>
Avec cette adresse de groupe d'état, vous pouvez mettre à jour les adresses de groupe de commandement des actionneurs aveugles appartenant à la scène.Veuillez consulter l'échantillon dans le wiki.```javascript
// Example of a function that saves the status of a blind actuator, belongind to the scene.
msg.savevalue = true;
msg.topic = "0/1/1";
msg.payload = 70;
return msg;
``` **Désactiver le contrôleur de scène**
Vous pouvez désactiver le contrôleur de scène (il désactive la réception de Telegram à partir du bus KNX mais le nœud accepte toujours le msg d'entrée du flux à la place).Il est parfois conseillé de désactiver le rappel et la sauvegarde d'une scène, par exemple, quand c'est la nuit et que vous appelez, à partir d'un bouton de poussée KNX, une "scène télévisée" qui soulève ou abaisse un aveugle, la scène ne sera pas rappelée ou sauvée.Au lieu de cela, vous pouvez activer une autre scène, juste pour la nuit, par exemple pour diminuer une série de lumières.```javascript
// Example of disabling the scene controller. The commands coming from KNX BUS will be disabled. The node still accept the input msg from the flow instead!
msg.disabled = true; // Otherwise "msg.disabled = false" to re-enable the node.
return msg;
```## Voir aussi
[Exemple de contrôleur de scène](/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node)