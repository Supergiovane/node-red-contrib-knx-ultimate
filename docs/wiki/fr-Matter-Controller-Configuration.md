---
layout: wiki
title: "Matter-Controller-Configuration"
lang: fr
permalink: /wiki/fr-Matter-Controller-Configuration
---
# Contrôleur Matter

## Vue d'ensemble

Ce nœud de configuration est un **contrôleur Matter** complet : il crée sa propre *fabric* Matter et y appaire (commissionne) vos appareils Matter. Les appareils appairés sont ensuite disponibles pour les nœuds **Matter Device**, qui les mappent sur des adresses de groupe KNX.

Le contrôleur communique avec les appareils via le **réseau IP** (WiFi, Ethernet ou Thread via un border router). L'appairage Bluetooth n'est pas pris en charge : l'appareil doit déjà être joignable sur le réseau.

## Appairer un appareil

1. **Déployez** d'abord ce nœud de configuration (le contrôleur doit être en fonction).
2. Rouvrez le nœud et saisissez le **code d'appairage** : le code manuel à 11 chiffres (ex. `3497-011-2332`) ou le contenu du QR code (`MT:....`).
3. Cliquez sur **APPAIRER**. Le commissionnement peut prendre jusqu'à une minute.

Si l'appareil est neuf et ne prend en charge que l'appairage Bluetooth, appairez-le d'abord avec l'app du fabricant ou un autre contrôleur Matter (Alexa, Google Home, Apple Home), puis utilisez sa fonction **« partager / appairer avec un autre hub »** pour générer un nouveau code pour KNX-Ultimate. L'appareil rejoint ainsi plusieurs fabrics à la fois.

Préférez le payload QR (`MT:...`) : il contient le discriminateur complet. Le code manuel ne contient que le discriminateur court et peut sélectionner le mauvais appareil si plusieurs modèles identiques sont en mode appairage. Appairez un appareil à la fois.

## Mode universel

Dans **Control Matter from KNX**, choisissez **Mode universel** pour surveiller tous les appareils. La passerelle KNX est optionnelle et sert uniquement aux GA alarme/texte du moniteur.

Le **Moniteur universel de batteries** analyse tous les nœuds et endpoints appairés pour Power Source, émet un instantané initial et conserve l'état normalisé complet. Il peut n'émettre que les batteries sous le seuil ou chaque mise à jour. `{payload:{action:"getAllBatteries"}}` renvoie l'inventaire en cache ; les métadonnées Matter brutes sont dans `msg.matter`.

Les entrées exigent `nodeId`, `endpointId`, `clusterId` et `command` ou `attribute` (directement ou sous `msg.matter`) :

- Allumer : `{nodeId:"100", endpointId:1, clusterId:6, command:"on", args:{}}`
- Lire : `{nodeId:"100", endpointId:1, clusterId:47, attribute:"batPercentRemaining"}`
- Écrire : `{nodeId:"100", endpointId:1, clusterId:513, attribute:"occupiedHeatingSetpoint", value:2100}`

## Stockage

Les identifiants de la fabric et les appareils appairés sont enregistrés dans le dossier `knxultimatestorage/matter` du répertoire utilisateur de Node-RED. Supprimer ce dossier efface tous les appairages.

Utilisez **Exporter** pour télécharger une sauvegarde complète de cette instance de contrôleur. Elle contient la fabric, les identifiants privés, les sessions et les données des appareils associés. **Protégez le fichier comme un mot de passe.** L'import remplace le stockage Matter de cette instance et redémarre brièvement le contrôleur. Une sauvegarde de contrôleur ne peut pas être importée dans un bridge.

## Supprimer un appareil

Utilisez le bouton corbeille dans la liste des appareils appairés. Le contrôleur essaie de retirer l'appareil proprement ; s'il est injoignable, il est quand même supprimé de la fabric (une réinitialisation d'usine de l'appareil peut alors être nécessaire).

Dans le moniteur universel, les sorties KNX optionnelles publient l'alarme globale en DPT 1.005 et font défiler les appareils toutes les 2 secondes en texte DPT 16.001 de 14 octets.
