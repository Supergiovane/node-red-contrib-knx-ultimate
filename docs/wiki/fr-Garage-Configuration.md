---
layout: wiki
title: "Garage-Configuration"
lang: fr
permalink: /wiki/fr-Garage-Configuration
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Garage-Configuration) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-Garage-Configuration) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-Garage-Configuration) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-Garage-Configuration) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-Garage-Configuration) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-Garage-Configuration)
---
# Porte de garage
Le nœud **KNX Garage** pilote un portail motorisé en utilisant des GA dédiées pour les commandes booléennes ou par impulsion, gère la cellule photo/obstruction, autorise le maintien ouvert ou la désactivation et propose une refermeture automatique.
## Adresses de groupe
|Usage|Propriété|Remarques|
|--|--|--|
| Commande directe | `Command GA` (`gaCommand`) | GA booléenne : `true` ouvre, `false` ferme (DPT 1.001). |
| Impulsion | `Impulse GA` (`gaImpulse`) | Le front montant commute le portail (DPT 1.017). Utilisée lorsque la commande directe n'est pas disponible. |
| Mouvement | `gaMoving` | Impulsion optionnelle à chaque commande de déplacement. |
| Obstruction | `gaObstruction` | Diffuse l'état d'obstruction pour les autres équipements KNX. |
| Maintien ouvert | `gaHoldOpen` | Annule la refermeture automatique tant que la valeur reste à true. |
| Désactivation | `gaDisable` | Bloque toute action générée par le nœud (mode maintenance). |
| Cellule photo | `gaPhotocell` | Passe à true lorsqu'un obstacle coupe le faisceau ; le nœud rouvre et signale l'obstruction. |
## Refermeture automatique
- Activez le temporisateur pour envoyer la fermeture après le délai configuré.
- Maintien ouvert ou désactivation suspendent le timer tant qu'ils sont actifs.
- À l'échéance le nœud exécute `auto-close` et envoie la commande de fermeture (ou l'impulsion).
## Sécurité
- Une cellule photo à true pendant la fermeture rouvre immédiatement et positionne l'état d'obstruction.
- Les écritures externes sur la GA obstruction gardent l'état interne synchronisé avec tableaux de bord et alarmes.
- Les impulsions de mouvement peuvent alimenter ventilation, éclairage ou logique d'alarme.
## Intégration dans les flows
- `msg.payload` accepte `true`, `false`, `'open'`, `'close'`, `'toggle'` pour commander la porte depuis Node-RED.
- Avec *Émettre des événements* activé, des objets détaillant `event`, `state`, `disabled`, `holdOpen`, `obstruction` sont envoyés.
## Exemple de flow
```javascript
// Ouvrir le portail
msg.payload = 'open'; // accepte aussi true
return msg;
```
```javascript
// Fermer le portail
msg.payload = 'close'; // accepte aussi false
return msg;
```
```javascript
// Basculer l’état du portail
msg.payload = 'toggle';
return msg;
```
