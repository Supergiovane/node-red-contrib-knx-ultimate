---
layout: wiki
title: "Home"
lang: fr
permalink: /wiki/fr-Home
---
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
