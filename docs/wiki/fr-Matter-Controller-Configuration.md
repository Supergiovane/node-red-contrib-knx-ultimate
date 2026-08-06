---
layout: wiki
title: "Matter-Controller-Configuration"
lang: fr
permalink: /wiki/fr-Matter-Controller-Configuration
---
# Contrôleur Matter

<div data-matter-controller-overview="hero" style="margin:18px 0 28px;padding:24px;border-radius:16px;background:linear-gradient(135deg,#241047 0%,#5531a7 55%,#8b5cf6 100%);box-shadow:0 14px 30px rgba(36,16,71,0.25);color:#faf7ff;">
  <div style="font-size:0.72rem;letter-spacing:0.18em;text-transform:uppercase;font-weight:700;color:#e3d7ff;">Fabric Matter · Commissionnement · KNX</div>
  <div style="font-size:1.75rem;line-height:1.15;font-weight:800;margin:8px 0 10px;">Votre fabric Matter, sous votre contrôle.</div>
  <p style="margin:0 0 18px;max-width:860px;line-height:1.6;color:#faf7ff;">Commissionnez les appareils sur le réseau IP et rendez leurs endpoints disponibles à KNX et Node-RED. Appairez, surveillez, sauvegardez et supprimez depuis un seul nœud de configuration.</p>
  <div style="display:flex;flex-wrap:wrap;gap:10px;">
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">Fabric locale</strong><span style="font-size:0.76rem;color:#eee7ff;">identifiants privés</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">QR + manuel</strong><span style="font-size:0.76rem;color:#eee7ff;">codes d’appairage</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">Export / Import</strong><span style="font-size:0.76rem;color:#eee7ff;">sauvegarde protégée</span></div>
  </div>
</div>

## Un contrôleur pour tout le cycle de vie

| Domaine | Fonctionnalités |
|---|---|
| **Commissionnement** | Payload QR Matter, scan webcam ou image, code manuel et appairage multi-fabric via WiFi, Ethernet ou Thread. |
| **Gestion des appareils** | Inventaire, état de connexion, suppression sûre et files de commandes indépendantes par appareil. |
| **KNX et Node-RED** | Mapping des endpoints, Mode universel, commandes dynamiques et moniteur universel de batteries. |
| **Résilience et stockage** | Fabric persistante, sauvegarde/restauration, blocage des appareils indisponibles et reprise automatique. |

## Démarrer en quatre étapes

1. Ajoutez Matter Controller et **déployez-le**.
2. Rouvrez-le et commissionnez un appareil avec son payload QR Matter ou son code manuel.
3. Ajoutez **Control Matter from KNX**, puis choisissez l’appareil et son profil.
4. Mappez les adresses de groupe KNX ou activez les PIN Node-RED, puis déployez.

> **Conseil :** préférez le payload QR `MT:...` : il contient le discriminateur complet, tandis que le code manuel à 11 chiffres ne contient que le discriminateur court.

## Vue technique

Ce nœud de configuration est un **contrôleur Matter** complet : il crée sa propre *fabric* Matter et y appaire (commissionne) vos appareils Matter. Les appareils appairés sont ensuite disponibles pour les nœuds **Matter Device**, qui les mappent sur des adresses de groupe KNX.

Le contrôleur communique avec les appareils via le **réseau IP** (WiFi, Ethernet ou Thread via un border router). L'appairage Bluetooth n'est pas pris en charge : l'appareil doit déjà être joignable sur le réseau.

## Appairer un appareil

1. **Déployez** d'abord ce nœud de configuration (le contrôleur doit être en fonction).
2. Rouvrez le nœud et saisissez le **code d'appairage** : le code manuel à 11 chiffres (ex. `3497-011-2332`) ou le contenu du QR code (`MT:....`).
3. Pour un code saisi manuellement, cliquez sur **APPAIRER**. Un QR lu avec **Webcam** ou **Image** démarre automatiquement l'appairage. Le commissionnement peut prendre jusqu'à une minute.

Au lieu de saisir le payload QR, cliquez sur **Webcam** pour le scanner en direct ou sur **Image** pour le lire depuis une photo locale. Les QR codes standards sombres sur fond clair et les codes inversés blancs sur fond sombre sont pris en charge. Le décodage s'effectue entièrement dans le navigateur ; après la lecture d'un QR Matter valide, l'éditeur remplit le champ du code et démarre immédiatement l'appairage. Saisissez auparavant le nom facultatif de l'appareil si nécessaire. Un code saisi manuellement ne démarre toujours qu'après un clic sur **APPAIRER**. L'accès direct à la webcam exige que l'éditeur soit ouvert via HTTPS ou depuis `localhost` ; sinon l'éditeur explique cette limitation et le chargement d'une image reste disponible.

Pendant le commissionnement, un panneau bloquant recouvre l'éditeur et empêche tout autre clic jusqu'à la réussite ou l'échec de l'opération. La barre de progression suit les étapes réelles de matter.js et décrit l'opération en cours en anglais. Lorsque l'appareil expose son identité produit, le panneau affiche aussi le nom du produit, le Vendor ID et le Product ID.

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

La liste contient une ligne pour chaque nœud actuellement enregistré dans la fabric Matter de ce contrôleur. Les Node ID sont uniques au sein de cette fabric ; les endpoints exposés par un même bridge commissionné ne sont pas affichés comme des appareils distincts. La colonne d'état indique si chaque nœud est connecté, déconnecté, en cours de reconnexion ou en attente de découverte.

Le contrôleur conserve séparément l'ordre des commandes de chaque appareil appairé. Un appareil lent, hors ligne ou supprimé ne peut pas bloquer les commandes destinées aux autres appareils. Les nœuds Controller qui référencent encore un Node ID supprimé refusent immédiatement les nouvelles commandes et affichent **Device no longer commissioned**.

Lorsqu'un appareil devient indisponible, ses nœuds Controller restent bloqués et ignorent les commandes suivantes jusqu'à ce que cet appareil signale de nouveau `connected`. La reprise est automatique ; l'ouverture de l'éditeur du nœud appareil libère aussi le blocage pour un nouvel essai manuel.

Dans le moniteur universel, les sorties KNX optionnelles publient l'alarme globale en DPT 1.005 et font défiler les appareils toutes les 2 secondes en texte DPT 16.001 de 14 octets.
