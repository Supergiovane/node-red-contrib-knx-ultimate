🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/FAQ-Troubleshoot) | [IT](/node-red-contrib-knx-ultimate/wiki/it-FAQ-Troubleshoot) | [DE](/node-red-contrib-knx-ultimate/wiki/de-FAQ-Troubleshoot) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-FAQ-Troubleshoot) | [ES](/node-red-contrib-knx-ultimate/wiki/es-FAQ-Troubleshoot) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-FAQ-Troubleshoot)
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
#Faq & dépannage
Merci d'utiliser mon nœud rouge de nœud!Si vous avez des problèmes, ne vous inquiétez pas: suivez simplement la liste ci-dessous pour vérifier l'article par article.KNX-ultimate a été largement utilisé et est stable et fiable.
Exigences minimales: **node.js> = 16**
## Le nœud ne fonctionne pas
- Le nœud de configuration de la passerelle](/node-red-contrib-knx-ultimate/wiki/Gateway-configuration) (pointant-il vers votre routeur KNX / IP ou le port IP / Port de votre interface) est-il créé et correctement configuré?
- KNX / IP **ROUTER ** :**HOST** FILL EN `224.0.23.12`, port` 3671`.
- KNX / IP **Interface ** :**hôte** Remplissez le périphérique IP (tel que `192.168.1.22`), port` 3671`.
- Lorsque plusieurs NICS **existent (Ethernet / Wireless), spécifiez les NICS à utiliser dans la passerelle ou désactivez le Wi-Fi. Après modification, assurez-vous de ** redémarrer le nœud - rouge** .
- Utilisez uniquement l'interface KNX / IP Certifiée et certifiée ou KNX / IP pour éviter les périphériques "All-in-One / Agent".
- Lorsque vous utilisez l'interface, vous pouvez activer le test "Supprimer la demande ACK" dans la passerelle.
- Voir "Recevoir uniquement / ne peut pas envoyer" ci-dessous.
- Si vous exécutez dans un conteneur, veuillez retarder légèrement le nœud de démarrage** (parfois la carte réseau n'est pas prête).
## Arrêtez après avoir couru pendant un moment
- Reportez-vous à la section précédente "Les nœuds ne peuvent pas fonctionner".
- Temporairement **Éteignez la protection des inondations DDOS / UDP sur le commutateur / routeur** (peut intercepter les paquets UDP de KNX).
- Connectez directement les périphériques KNX / IP au test hôte rouge-rouge.
- Évitez les interfaces bon marché ou entièrement one et donnez la priorité au routeur **knx / ip** .
- Soyez conscient de la limite de connexion simultanée lors de l'utilisation de l'interface (voir Manuel du produit).Le routeur n'a généralement pas une telle limitation.
Configuration ## KNXD
- **KNXD** Lorsque sur le même hôte que Node - Red, l'interface est recommandée d'utiliser `127.0.0.1`.
- Vérifiez les tables de filtre et ajustez l'adresse physique de la configuration en conséquence.
- Activer "Echo Send Message à tous les nœuds avec la même adresse de groupe" dans Gateway.
## ETS peut voir des messages, mais l'exécuteur testamentaire n'a aucune réponse
Peut entrer en conflit avec d'autres plugins KNX.
- Supprimez les autres plug-ins KNX de la palette rouge du nœud, en gardant uniquement KNX-ultimate (et supprimez également les codes de configuration cachés).
- Allumez le test "Supprimer la demande ACK" dans la passerelle lors de l'utilisation de l'interface.
## ne peut recevoir que, pas d'envoyer (ou vice versa)
Votre routeur / interface peut avoir le filtrage activé.
- Autoriser **Transfert** dans ETS; ou ajustez l'adresse physique du nœud de configuration en fonction de la table de filtre du routeur.
- Lorsque vous utilisez **KNXD** , veuillez vérifier la table de filtre et ajuster l'adresse physique en conséquence.
## Erreur de valeur
- Utilisez le point de données correct (température: `9.001`).
- Importer ETS CSV dans Gateway pour obtenir le DPT correct.
- Évitez deux nœuds en utilisant le même ga **mais différent DPT** .
## pas "intercommunication" entre les nœuds du même GA
Tourné couramment dans le tunneling / unicast (interface, KNXD).
- Activer "Echo Send Message à tous les nœuds avec la même adresse de groupe" dans Gateway.
## Routeur / interfaces KNX sécurisées
Non pris en charge lorsque le mode sécurisé est activé;Si des connexions non sécurisées sont autorisées, elle peut fonctionner correctement.
- Fermez le routage sécurisé ou permettez des connexions dangereuses.
- Facultatif: Ajoutez une carte réseau dédiée directement connectée au routeur KNX à Node - Red, et définissez "Bind to Interface Local" sur la passerelle.
- Les connexions sécurisées peuvent être prises en charge à l'avenir.
## Protection des inondations (protection des limites de courant)
Pour éviter la surcharge d'interface utilisateur et de bus: chaque nœud par défaut pour recevoir jusqu'à 120 messages dans une fenêtre de 1 seconde.
- Utilisez le nœud **Delay** pour disperser les messages.
- Filtrez des valeurs en double utilisant **rbe** .
[Détails](/node-red-contrib-knx-ultimate/wiki/Protections)
## Un avertissement de point de données apparaît après l'importation d'ETS
- Remplissez les ETS (sous-types, tels que `5.001`).
- ou sélectionnez "Importer avec un faux point de données 1.001 (non recommandé)" lors de l'importation ou de la sauts de l'AG associée.
## Protection de référence circulaire
Lorsque deux nœuds sont connectés directement avec le même GA Out → IN, le système le désactivera pour empêcher le bouclage.
- Processus de réglage: divisez ces deux nœuds ou ajoutez-y des nœuds "médiation / tampon".
- Activer **rbe** pour éviter le bouclage.
[Détails](/node-red-contrib-knx-ultimate/wiki/Protections)
## Vous avez encore des problèmes?
- Il est recommandé de faire un problème (priorité) dans [GitHub](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/issues).
- ou envoyez-moi un message privé à [knx-user-forum](https://knx-user-forum.de) (utilisateur: theax74; s'il vous plaît en anglais).