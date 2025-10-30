🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/Home) | [IT](/node-red-contrib-knx-ultimate/wiki/it-Home) | [DE](/node-red-contrib-knx-ultimate/wiki/de-Home) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-Home) | [ES](/node-red-contrib-knx-ultimate/wiki/es-Home) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-Home)
<!-- NAV START -->
Navigation: [Home](/node-red-contrib-knx-ultimate/wiki/Home)  
Overview: [Changelog](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/CHANGELOG.md) • [FAQ](/node-red-contrib-knx-ultimate/wiki/FAQ-Troubleshoot) • [Security](/node-red-contrib-knx-ultimate/wiki/SECURITY) • [Docs: Language bar](/node-red-contrib-knx-ultimate/wiki/Docs-Language-Bar)  
KNX Device: [Gateway](/node-red-contrib-knx-ultimate/wiki/Gateway-configuration) • [Device](/node-red-contrib-knx-ultimate/wiki/Device) • [Protections](/node-red-contrib-knx-ultimate/wiki/Protections)  
Other KNX Nodes: [Scene Controller](/node-red-contrib-knx-ultimate/wiki/SceneController-Configuration) • [WatchDog](/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration) • [Logger](/node-red-contrib-knx-ultimate/wiki/Logger-Configuration) • [Global Context](/node-red-contrib-knx-ultimate/wiki/GlobalVariable) • [Alerter](/node-red-contrib-knx-ultimate/wiki/Alerter-Configuration) • [Load Control](/node-red-contrib-knx-ultimate/wiki/LoadControl-Configuration) • [Viewer](/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer) • [Auto Responder](/node-red-contrib-knx-ultimate/wiki/KNXAutoResponder) • [HA Translator](/node-red-contrib-knx-ultimate/wiki/HATranslator) • [IoT Bridge](/node-red-contrib-knx-ultimate/wiki/IoT-Bridge-Configuration)  
HUE: [Bridge](/node-red-contrib-knx-ultimate/wiki/HUE+Bridge+configuration) • [Light](/node-red-contrib-knx-ultimate/wiki/HUE+Light) • [Battery](/node-red-contrib-knx-ultimate/wiki/HUE+Battery) • [Button](/node-red-contrib-knx-ultimate/wiki/HUE+Button) • [Contact](/node-red-contrib-knx-ultimate/wiki/HUE+Contact+sensor) • [Device SW update](/node-red-contrib-knx-ultimate/wiki/HUE+Device+software+update) • [Light sensor](/node-red-contrib-knx-ultimate/wiki/HUE+Light+sensor) • [Motion](/node-red-contrib-knx-ultimate/wiki/HUE+Motion) • [Scene](/node-red-contrib-knx-ultimate/wiki/HUE+Scene) • [Tap Dial](/node-red-contrib-knx-ultimate/wiki/HUE+Tapdial) • [Temperature](/node-red-contrib-knx-ultimate/wiki/HUE+Temperature+sensor) • [Zigbee connectivity](/node-red-contrib-knx-ultimate/wiki/HUE+Zigbee+connectivity)  
Samples: [Logger](/node-red-contrib-knx-ultimate/wiki/Logger-Sample) • [Switch Light](/node-red-contrib-knx-ultimate/wiki/-Sample---Switch-light) • [Dimming](/node-red-contrib-knx-ultimate/wiki/-Sample---Dimming) • [RGB color](/node-red-contrib-knx-ultimate/wiki/-Sample---RGB-Color) • [RGBW color + White](/node-red-contrib-knx-ultimate/wiki/-Sample---RGBW-Color-plus-White) • [Command a scene actuator](/node-red-contrib-knx-ultimate/wiki/-Sample---Control-a-scene-actuator) • [Datapoint 213.x 4x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT213) • [Datapoint 222.x 3x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT222) • [Datapoint 237.x DALI diags](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT237) • [Datapoint 2.x 1 bit proprity](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT2) • [Datapoint 22.x RCHH Status](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT22) • [Datetime to BUS](/node-red-contrib-knx-ultimate/wiki/-Sample---DateTime-to-BUS) • [Read Status](/node-red-contrib-knx-ultimate/wiki/-Sample---Read-value-from-Device) • [Virtual Device](/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device) • [Subtype decoded](/node-red-contrib-knx-ultimate/wiki/-Sample---Subtype) • [Alexa](/node-red-contrib-knx-ultimate/wiki/-Sample---Alexa) • [Apple Homekit](/node-red-contrib-knx-ultimate/wiki/-Sample---Apple-Homekit) • [Google Home](/node-red-contrib-knx-ultimate/wiki/-Sample---Google-Assistant) • [Switch on/off POE port of Unifi switch](/node-red-contrib-knx-ultimate/wiki/-Sample---UnifiPOE) • [Set configuration by msg](/node-red-contrib-knx-ultimate/wiki/-Sample-setConfig) • [Scene Controller node](/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node) • [WatchDog node](/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog) • [Global Context node](/node-red-contrib-knx-ultimate/wiki/SampleGlobalContextNode) • [Alerter node](/node-red-contrib-knx-ultimate/wiki/SampleAlerter) • [Load control node](/node-red-contrib-knx-ultimate/wiki/SampleLoadControl) • [Viewer node](/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer) • [MySQL, InfluxDB, MQTT Sample](/node-red-contrib-knx-ultimate/wiki/Sample-KNX2MQTT-KNX2MySQL-KNX2InfluxDB)  
Contribute to Wiki: [Link](/node-red-contrib-knx-ultimate/wiki/Manage-Wiki)
<!-- NAV END -->
# Présentation professionnelle des nodes KNX Ultimate
## knxUltimate-config
**À quoi ça sert** : définir les paramètres du passerelle KNX/IP et les rendre disponibles aux autres nodes.
**Fonctions clés** : tunnelling et KNX Secure, import ETS CSV avec autocomplétion, diagnostic de connexion et moniteur de bus.
**Comment le configurer** : saisir hôte et port, choisir l'interface réseau, importer le fichier ETS et activer au besoin les options Secure ou monitoring.
## hueConfig
**À quoi ça sert** : gérer l'authentification avec le bridge Philips Hue et partager le token avec l'ensemble des nodes Hue.
**Fonctions clés** : appairage guidé, tokens persistants, EventStream, fallback REST, gestion TLS/horloge.
**Comment le configurer** : appuyer sur le bouton link du bridge, lancer l'assistant d'appairage, sélectionner EventStream ou polling et nommer la configuration.
## knxUltimate
**À quoi ça sert** : lire et écrire des télégrammes KNX avec conversion DPT automatique.
**Fonctions clés** : autocomplétion GA, filtres ETS, gestion des priorités, statistiques runtime, Node Pins optionnels.
**Comment le configurer** : choisir le passerelle, définir le DPT adéquat, régler ACK/retry et activer pins ou filtres selon la logique de flux.
## knxUltimateSceneController
**À quoi ça sert** : orchestrer des scènes KNX multi-étapes avec conditions et override manuel.
**Fonctions clés** : séquences programmables, déclencheurs conditionnels, mémoire de scène, commandes manuelles.
**Comment le configurer** : déclarer les scènes cibles, régler délais et conditions et câbler les triggers via Node Pins.
## knxUltimateWatchDog
**À quoi ça sert** : surveiller passerelles, dispositifs et GA et alerter en cas de timeout.
**Fonctions clés** : pings cycliques, suivi de latence, actions de reprise automatiques, métriques d'état.
**Comment le configurer** : indiquer les GA à surveiller, fixer intervalles/timeout et relier les sorties vers logger ou notifications.
## knxUltimateLogger
**À quoi ça sert** : journaliser télégrammes et valeurs KNX pour audit, diagnostic ou export.
**Fonctions clés** : buffer circulaire, filtres GA/DPT, export CSV/JSON, intégration context.
**Comment le configurer** : choisir le dossier cible, définir rétention et seuils, activer notifications ou exports désirés.
## knxUltimateGlobalContext
**À quoi ça sert** : synchroniser les valeurs KNX avec le context global de Node-RED.
**Fonctions clés** : liaisons GA→context, synchronisation bidirectionnelle optionnelle, filtrage DPT.
**Comment le configurer** : nommer la variable de context, choisir le sens de synchro et configurer les Node Pins pour mises à jour externes.
## knxUltimateAlerter
**À quoi ça sert** : générer des alertes quand les valeurs KNX franchissent des seuils ou règles.
**Fonctions clés** : comparateurs multiples, hystérésis, reset automatique, sorties email/MQTT/log.
**Comment le configurer** : poser les conditions, rédiger les messages et relier les sorties aux canaux choisis.
## knxUltimateLoadControl
**À quoi ça sert** : superviser la charge électrique KNX et délester les circuits non essentiels.
**Fonctions clés** : groupes de charge, priorités dynamiques, cycles shed/restore, tampon d'événements.
**Comment le configurer** : mapper les GA de mesure, attribuer les charges aux priorités et définir délais d'arrêt/rétablissement.
## knxUltimateViewer
**À quoi ça sert** : fournir des dashboards HTML/JSON pour visualiser les télégrammes KNX en direct.
**Fonctions clés** : tableaux live, cartes responsives, export JSON, analyse de file.
**Comment le configurer** : sélectionner les GA à afficher, personnaliser libellés et fréquence de rafraîchissement puis publier le dashboard.
## knxUltimateAutoResponder
**À quoi ça sert** : répondre automatiquement aux lectures KNX avec la dernière valeur connue.
**Fonctions clés** : cache de valeurs, mapping multi-GA, mises à jour externes via Node Pins, journal d'activité.
**Comment le configurer** : définir GA écoute/réponse, durée de cache et connecter les entrées d'actualisation nécessaires.
## knxUltimateStaircase
**À quoi ça sert** : piloter l'éclairage temporisé avec préavis, override et reset automatique.
**Fonctions clés** : minuteries multiples, impulsions d'avertissement, forçages manuels, lecture au démarrage.
**Comment le configurer** : paramétrer GA commande/état, durée du timer, pins d'override et logique de reset.
## knxUltimateGarage
**À quoi ça sert** : gérer portes de garage avec impulsion, feedback et sécurités.
**Fonctions clés** : commande impulsionnelle, suivi d'état, verrouillage sécurité, logique photocellule, auto-close.
**Comment le configurer** : attribuer GA commande/état/alerte, configurer temps de course et règles de verrouillage/réouverture.
## knxUltimateIoTBridge
**À quoi ça sert** : relier KNX bidirectionnellement à MQTT/REST/Modbus.
**Fonctions clés** : table de mapping, mise à l'échelle, acknowledgements personnalisés, buffer offline.
**Comment le configurer** : renseigner la table de correspondance, configurer les endpoints externes et définir la stratégie d'ack/retry.
## Panneau KNX Monitor
**À quoi ça sert** : afficher dans la barre latérale droite de Node-RED, là où se trouvent les onglets, le trafic KNX en direct.
**Fonctions clés** : rafraîchissement 1 s, surlignage des nouveaux télégrammes, toggles rapides, tri optionnel.
**Comment le configurer** : choisir le passerelle, activer/désactiver auto-refresh ou tri et filtrer les GA utiles.
## Panneau KNX Debug
**À quoi ça sert** : inspecter toutes les lignes de log KNX en temps réel depuis la barre latérale sans ouvrir la console du serveur.
**Fonctions clés** : tampon circulaire de 5 000 lignes, couleurs par niveau de sévérité, rafraîchissement auto/manuel, copie en un clic vers le presse-papiers.
**Comment le configurer** : ouvrir l’onglet, laisser l’auto-rafraîchissement actif (ou cliquer sur Rafraîchir au besoin) et utiliser l’icône de copie pour exporter l’instantané courant.
## knxUltimateHATranslator
**À quoi ça sert** : convertir les messages KNX vers les payloads Home Assistant et inversement.
**Fonctions clés** : mapping DPT→entité, aides au discovery, normalisation bool/numérique, ack optionnels.
**Comment le configurer** : définir les entités cibles, régler conversions et templates et raccorder les Node Pins pour feedback.
## knxUltimateHueLight
**À quoi ça sert** : contrôler les lampes Hue depuis KNX (on/off, dim, couleur, scènes dynamiques).
**Fonctions clés** : mapping multi-GA, profils jour/nuit, feedback d'état, Node Pins.
**Comment le configurer** : associer GA switch/état/dimmer/couleur, configurer rampes et modes de scène et activer EventStream sur le bridge.
## knxUltimateHueButton
**À quoi ça sert** : recevoir les événements de boutons Hue et les traduire en télégrammes KNX.
**Fonctions clés** : détection appui court/long, multi ressources, mapping DPT 1.xxx/18.xxx, debounce.
**Comment le configurer** : sélectionner la ressource Hue, lier les GA par événement et régler le filtrage des rebonds et le feedback.
## knxUltimateHueMotion
**À quoi ça sert** : intégrer les détecteurs de mouvement Hue dans KNX.
**Fonctions clés** : sortie booléenne, filtres DPT, temporisations, Node Pins configurables.
**Comment le configurer** : définir GA mouvement/état, ajuster le timeout et gérer la visibilité des pins dans l'onglet Behaviour.
## knxUltimateHueTapDial
**À quoi ça sert** : exploiter le Hue Tap Dial comme contrôleur rotatif ou sélecteur de scènes KNX.
**Fonctions clés** : pas +/- incrémentaux, mapping DPT 3.007/5.001/personnalisé, feedback optionnel.
**Comment le configurer** : choisir la ressource Hue, fixer GA cible et sensibilité et activer les pins utiles.
## knxUltimateHueLightSensor
**À quoi ça sert** : envoyer sur le bus KNX les lux mesurés par les capteurs Hue.
**Fonctions clés** : conversion auto en DPT 9.004, lissage, lecture initiale.
**Comment le configurer** : attribuer la GA de luminosité, définir filtres ou offsets et décider d'exposer ou non les Node Pins.
## knxUltimateHueTemperatureSensor
**À quoi ça sert** : publier dans KNX les températures issues des capteurs Hue.
**Fonctions clés** : conversion DPT 9.001, offset, synchronisation initiale, Node Pins.
**Comment le configurer** : configurer GA température, corrections éventuelles et sorties vers d'autres flows.
## knxUltimateHueScene
**À quoi ça sert** : déclencher des scènes Hue via des événements KNX simples ou multi-scènes.
**Fonctions clés** : support DPT 1.xxx/18.xxx, onglet de règles multi-scènes, feedback optionnel.
**Comment le configurer** : sélectionner les scènes Hue, associer GA trigger/status et définir les mappings avancés nécessaires.
## knxUltimateHueBattery
**À quoi ça sert** : suivre l'état de batterie des dispositifs Hue dans KNX.
**Fonctions clés** : conversion device_power→DPT 5.001, lecture au démarrage, alertes seuil, Node Pins.
**Comment le configurer** : définir la GA pourcentage, paramétrer les seuils d'alerte et brancher notifications ou logs.
## knxUltimateHueZigbeeConnectivity
**À quoi ça sert** : remonter sur KNX l'état de connectivité Zigbee des équipements Hue.
**Fonctions clés** : mapping booléen, lecture initiale, stratégies de fallback.
**Comment le configurer** : renseigner GA booléenne et DPT, prévoir l'action en cas de perte et relier les alarmes nécessaires.
## knxUltimateHueCameraMotion
**À quoi ça sert** : exposer les détections de mouvement des caméras Hue Secure vers KNX.
**Fonctions clés** : EventStream temps réel, mapping booléen, anti faux positifs, buffer initial.
**Comment le configurer** : choisir la caméra, définir GA/DPT, régler les filtres et relier les sorties aux logiques de sécurité.
## knxUltimateContactSensor
**À quoi ça sert** : synchroniser capteurs magnétiques Hue (ouvert/fermé) avec des adresses KNX.
**Fonctions clés** : filtre de ressource `contact`, mapping DPT 1.019, inversion logique possible, libellés ETS.
**Comment le configurer** : sélectionner le capteur, mapper GA état/alerte et configurer alertes ou temporisations.
## knxUltimateHueHumiditySensor
**À quoi ça sert** : envoyer sur KNX l'humidité relative mesurée par Hue.
**Fonctions clés** : scaling DPT 9.007, lissage optionnel, lecture initiale, Node Pins.
**Comment le configurer** : définir GA humidité, fixer filtres ou seuils et câbler les sorties selon les besoins.
## knxUltimateHuePlug
**À quoi ça sert** : piloter les prises Hue et lire état ainsi que puissance.
**Fonctions clés** : commandes on/off, canaux état/puissance, power availability, Node Pins.
**Comment le configurer** : mapper GA commande/état/puissance, choisir le DPT approprié et activer les lectures automatiques au démarrage.
## knxUltimateHuedevice_software_update
**À quoi ça sert** : notifier via KNX la disponibilité d'updates firmware Hue.
**Fonctions clés** : interprétation des états `up_to_date/available/required`, journalisation, alertes programmables.
**Comment le configurer** : définir la GA d'alerte, régler la politique de notification et raccorder dashboards ou outils de ticketing.
