🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/HUE+Light) | [IT](/node-red-contrib-knx-ultimate/wiki/it-HUE+Light) | [DE](/node-red-contrib-knx-ultimate/wiki/de-HUE+Light) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-HUE+Light) | [ES](/node-red-contrib-knx-ultimate/wiki/es-HUE+Light) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Light)
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
<p> Ce nœud vous permet de contrôler les lumières de tonalité Philips et les lumières groupées, et d'envoyer également l'état de cette lumière dans le bus KNX.</p>
**Général**
| Propriétés | Description |
|-|-|
| KNX GW | Sélectionnez le portail KNX à utiliser |
| Hua Bridge | Sélectionnez le pont de ton à utiliser |
| Nom | Lampe de teinte ou la lumière groupée par Hue.Les lumières et les groupes disponibles lorsque vous tapez commencent à apparaître. |
<br/>
**Options**
Ici, vous pouvez sélectionner l'adresse KNX que vous souhaitez lier aux lumières / statuts de tonalité disponibles.<br/>
Commencez à entrer dans le champ GA, le nom ou l'adresse de groupe du périphérique KNX et le périphérique disponible commence à s'afficher lors de l'entrée.
**changement**
| Propriétés | Description |
|-|-|
| Contrôle | Ce GA est utilisé pour allumer / éteindre la lumière de ton par la valeur booléenne KNX de True / False |
| Statut | Le lier à l'adresse du groupe d'état du commutateur de la lumière |
<br/>
**faible**
| Propriétés | Description |
|-|-|
| Contrôle DIM | Semballage relativement assombri.Vous pouvez définir la vitesse de gradation dans l'onglet \ *\* _Behavior_ **.|
| Control% | modifie la luminosité du ton absolu (0-100%) |
| Statut% | Linez-le à l'état de luminosité de la lumière du groupe KNX Adresse du groupe |
| Vitesse sombre (ms) | Petite vitesse en millisecondes.Cela fonctionne pour ** Light ** , ainsi que pour**Réglable White \* \ * Points de données planifiés.Il est calculé de 0% à 100%.|
| La dernière luminosité sombre | La luminosité la plus basse que la lumière peut atteindre.Par exemple, si vous souhaitez refuser la lumière, la lumière cesse de gradir à la luminosité spécifiée%.|
| Luminosité maximale DIM |Luminosité maximale que la lampe peut atteindre.Par exemple, si vous souhaitez ajuster la lumière, la lumière cessera de gradier à la luminosité spécifiée%. |
<br/>
**blanc réglable**
| Propriétés | Description |
|-|-|
| Contrôle DIM |Utilisez DPT 3.007 Semballage pour changer la température blanche de la lampe de ton.Vous pouvez définir la vitesse de gradation dans l'onglet \ *\* _Behavior_ \ *\*. |
| Contrôle% | Utilisez DPT 5.001 pour modifier la température de couleur blanche; 0 est chaud, 100 est froid |
| Statut% | Adresse du groupe d'état de température de couleur de lumière blanche (DPT 5.001; 0 = chaud, 100 = froid) |
| Contrôle Kelvin | **DPT 7.600: ** Set par KNX Range 2000-6535 K (Converti à Hue Mirek). <br/>**DPT 9.002:** Set par Hue Range 2000-6535 K (l'ambiance commence à partir de 2200 K).La conversion peut entraîner de légères déviations |
| Statut Kelvin | **DPT 7.600: ** Lire Kelvin (KNX 2000-6535, conversion).<br/>**DPT 9.002:** LIRE GAMME HUE 2000-6535 K; La conversion peut avoir de légères déviations |
| Inverser la direction sombre | Inverser la direction sombre.|
<br/>
\ *\* Rgb / hsv \ *\*
| Propriétés | Description |
|-|-|
| **Partie RGB** ||
| Contrôle RVB | Utilisez RVB Triples (R, G, B) pour modifier la couleur, y compris la correction de la gamme de couleurs. Envoyer la couleur s'allumer et régler la couleur / la luminosité;r, g, b = 0 éteignez la lumière |
| Statut RVB | Adresse du groupe d'état des couleurs lumineuses.Les points de données acceptés sont des triplets RVB (R, G, B) |
| **Partie HSV** ||
| Couleur H Teamage | Boucle sur la boucle HSV Hue en utilisant DPT 3.007; Vitesse dans **Comportement** Paramètres |
| État H% | État du cercle de couleur HSV. |
| Contrôle S Semballage |Utilisez DPT 3.007 pour changer la saturation; Vitesse dans **Comportement** Paramètres |
| État S% | Adresse du groupe d'état saturé léger. |
| Vitesse sombre (ms) |vitesse miniature du bas à l'échelle la plus élevée en millisecondes.|
CONSEIL: Pour le "V" (luminosité) du HSV, veuillez utiliser les contrôles standard de l'onglet **Dim** .
<br/>
**Effet**
_NE-HUE BASIC EFFETS_
| Propriétés | Description |
|-|-|
| Blink | _true_ clignote la lumière, _false_ arrête de clignoter. Des interrupteurs alternatifs, adaptés aux invites.Prend en charge toutes les lumières de la teinte.|
|Boucle de couleur | _true_ démarre la boucle, _false_ arrête la boucle.Changez la couleur au hasard à intervalles fixes, uniquement pour les lumières de teinte qui prennent en charge la lumière de la couleur.L'effet commence environ 10 secondes après la publication de la commande. |
_Hue Effet natif_
Dans le tableau des effets natifs **Hue** , mappez la valeur KNX aux effets pris en charge par le luminaire (par exemple, «bougie», `foyer», «prisme»).Chaque ligne associe une valeur KNX (booléen, numérique ou texte, selon le point de données sélectionné) avec un effet renvoyé par le pont.Ce sera:
- Envoyer des valeurs KNX mappées pour déclencher l'effet correspondant;
- (Facultatif) Configurer une adresse de groupe d'état: Lorsque le pont de teinte rapporte l'effet change, le nœud écrit la valeur de la carte; Si aucune carte n'est trouvée, le nom d'effet d'origine est envoyé (la classe de texte DPT est requise, par exemple 16.xxx).
<br/>
**Comportement**
| Propriétés | Description |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lire l'état au démarrage | Lisez l'état de la lumière des teintes dans le démarrage de Node-Red ou le déploiement complet de Node-Red, puis envoyez ce statut au bus KNX |
| Statut de luminosité KNX | Chaque fois que la lumière de ton est allumée / désactivée, l'état de l'adresse du groupe de luminosité KNX est mis à jour. L'option est **Envoyer 0% lorsque la teinte est désactivée. Lorsque la teinte est activée, restaurez les valeurs précédentes (comportement KNX par défaut) et ** * comme IS (comportement de la teinte par défaut)**. Si vous avez un gradateur KNX avec un statut de luminosité, tel que MDT, l'option recommandée est \* \ *\*, et lorsque la lumière de Hue est éteinte, envoyez 0%. Lorsque la tonalité est activée, restaurez la valeur précédente (comportement KNX par défaut) \ *\* \ * |
| Comportement ouvert | En cas, il définit le comportement de la lumière.Vous pouvez choisir parmi différents comportements.<br/> \ *\* Sélectionner la couleur: \ *\* La lumière sera activée en utilisant la couleur que vous avez sélectionnée.Pour modifier la couleur, cliquez simplement sur le sélecteur de couleur (fabriqué sous "Sélectionnez la beauté". <br/> \ *\* Sélectionnez Température et luminosité: ** La température (Kelvin) et la luminosité (0-100) que vous avez sélectionnées allumera la lumière. <br/> Aucun:** Aucun État de la température définie pendant la journée. |
| Éclairage nocturne | Il permet de régler des couleurs / luminosité lumineuses spécifiques la nuit. Les options sont les mêmes que pendant la journée. Vous pouvez choisir la température / la luminosité ou la couleur. La température confortable est de 2700 Kelvin et la luminosité est de 10% ou 20%, ce qui en fait un bon choix pour les veilleuses de la salle de bain. |
| Jour / nuit | Sélectionnez l'adresse de groupe pour définir un comportement de jour / nuit. La valeur d'adresse de groupe est \ _true \ _if Daytime, \ _false \ _if Nighttime. |
| Valeur de jour / nuit de pliage | Inversez la valeur de l'adresse du jour / de la nuit \ _GROUP. Valeur par défaut** Non sélectionné.|
| Lire l'état au démarrage |Lire l'état au démarrage et transmettre des événements au bus KNX au démarrage / reconnecter.(Par défaut "non") |
|Couvrir le mode nuit |Vous pouvez écraser le mode nocturne en changeant manuellement les lumières décrites ici: \ *\* Passez au mode jour en éteignant rapidement la ligth puis (cette lumière uniquement) (cette lumière uniquement) \ *\* effectuez l'action décrite et ne fonctionne que sur ce mode de la lumière pour passer au mode jour.\ *\* Passez en mode quotidien en fermant rapidement la ligth, puis en allumant (appliquant tous les nœuds lumineux).|
| Pin d'entrée / sortie de nœud | Masquer ou afficher la broche d'entrée / sortie.La broche d'entrée / sortie permet au nœud d'accepter l'entrée de trafic et d'envoyer la sortie MSG au trafic.Le MSG d'entrée doit se conformer à la norme API V.2 Hue.Voici un exemple de msg qui allume la lumière: <code> msg.on = {"on": true} </code>. Voir \ [Page officielle de l'API Hue](§Url0§) |
### Notes
La fonction de dégagements fonctionne en mode \ *\* knx \ `start \` \ `'' 'et st off' **. Pour commencer à graver, envoyez simplement un télégramme KNX "start".Pour arrêter de tuer, envoyez un télégramme KNX "stop".S'il vous plaît** N'oubliez pas \* \ *, lorsque vous configurez le mur, n'oubliez pas.
<br/>
<br/>