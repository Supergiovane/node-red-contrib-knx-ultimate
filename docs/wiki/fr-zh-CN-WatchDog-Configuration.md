---
layout: wiki
title: "zh-CN-WatchDog-Configuration"
lang: fr
permalink: /wiki/fr-zh-CN-WatchDog-Configuration
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-WatchDog-Configuration) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-WatchDog-Configuration) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-WatchDog-Configuration) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-WatchDog-Configuration) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-WatchDog-Configuration)
---
# Watchdog (Watchdog)
Utilisé pour détecter l'état de connexion avec une passerelle ou un appareil KNX spécifique et effectuer des opérations automatisées en cas de défaillance.
**Fonction**
1. Envoyez des messages périodiquement et attendez une réponse. Si la connexion du bus est anormale, diffusez les messages au processus.Deux niveaux de détection sont disponibles (voir ci-dessous).
2. Modifiez les paramètres de passerelle du nœud de configuration (config-node) via le message pour réaliser la commutation du routeur / interface KNX / IP (tel que la commutation de support maître).
3. Force l'établissement / déconnexion du bus KNX.
## Détection de couche de couche Ethernet et KNX
Watchdog fournit des tests à deux niveaux:
- Niveau Ethernet: détecter uniquement la connectivité entre KNX-ultimate et l'interface KNX / IP (unicast).
- Ethernet + KNX - TP: vérifiez l'intégralité du lien (Ethernet → TP).Un appareil physique qui répond aux demandes de lecture est requis.
Convient pour les alarmes d'erreur d'erreur / connexion (notifications par e-mail, commutation automatique de passerelle de sauvegarde, etc.).
## Paramètres (paramètres)
| Propriétés | Description |
|-|-|
| Passerelle | Gateway KNX sélectionné. |
|Adresse du groupe à surveiller |Adresse de groupe utilisée pour l'envoi et la surveillance; DPT doit être 1.x (booléen).|
| Nom | Nom du nœud. |
|Démarrer automatiquement la minuterie de chien de garde | Démarrez automatiquement la minuterie sur le déploiement / démarrage. |
| Niveau de contrôle |Voir ci-dessus. |
**Vérifier le niveau**
> Ethernet: détecter les connexions entre KNX-ultimate (unicast) et l'interface KNX / IP. <br/>
> Ethernet + KNX TP: détection complète (prend en charge le routeur / interface).Envoyer lire à l'appareil physique et attendre la réponse;Toute échec sur Ethernet ou TP sera signalée.Veuillez configurer un **État** GA dans ETS pour un actionneur qui répond à la lecture. <br/>
## Options avancées
| Propriétés | Description |
|-|-|
| Intervalle de réception (en secondes) | Intervalle de détection en secondes. |
| Nombre de réessayer avant de donner une erreur |Combien d'échecs consécutifs sont signalés. |
# Sortie de chien de garde
Watchdog publie un message lorsque la détection interne trouve un défaut, ou qu'un nœud ultime KNX signale une erreur dans le processus.
**Problème de connexion de Watchdog**
<a href = "https://github.com/supergiovane/node-red-constrib-knx-ultimate/wiki/watchdog-configuration" cible = "_ Blank"> Voir ici pour les détails </a>```javascript
msg = {
  type: "BUSError",
  checkPerformed: "Ethernet" // 或 "Eth+KNX",
  nodeid: "23HJ.2355",
  payload: true,
  description: "..."
}
``` **Exception s'est produite sur l'un de vos nœuds ultimes KNX** ```javascript
msg = {
  type: "NodeError",
  checkPerformed: "Self KNX-Ultimate node reporting a red color status",
  nodeid: "23HJ.2355",
  payload: true,
  description: "...",
  completeError: {
    nodeid: "23HJ.2355",
    topic: "0/1/1",
    devicename: "Kitchen Light",
    GA: "0/1/1"
  }
}
``` **Modifier la configuration de la passerelle via setgatewayconfig** ```javascript
msg = {
  type: "setGatewayConfig",
  checkPerformed: "The Watchdog node changed the gateway configuration.",
  nodeid: "23HJ.2355",
  payload: true,
  description: "New Config issued to the gateway. IP:224.0.23.12 Port:3671 PhysicalAddress:15.15.1\nBindLocalInterface:Auto",
  completeError: ""
}
``` **Connexion forcée / déconnexion** ```javascript
msg = {
  type: "connectGateway",
  checkPerformed: "The Watchdog issued a connection/disconnection to the gateway.",
  nodeid: "23HJ.2355",
  payload: true, // true=连接，false=断开
  description: "Connection",
  completeError: ""
}
```---
# Entrez le message (entrée)
## start / stop watddog```javascript
msg.start = true; return msg; // 启动
```
```javascript
msg.start = false; return msg; // 停止
```## Modifier les paramètres de passerelle KNX / IP pendant l'exécution
Modifier IP / Port / PhysicalAddress / Protocol, etc. via `msg.setgatewayconfig`; Le nœud de configuration s'appliquera à la reconnexion.Node - Red se restaure aux paramètres du nœud de configuration après le redémarrage.Tous les paramètres sont facultatifs.```javascript
msg.setGatewayConfig = { IP:"224.0.23.12", Port:3671, PhysicalAddress:"15.15.1", BindToEthernetInterface:"Auto",
  Protocol:"Multicast", importCSV:`"Group name" "Address" "Central" "Unfiltered" "Description" "DatapointType" "Security"
"Attuatori luci" "0/-/-" "" "" "" "" "Auto"
"Luci primo piano" "0/0/-" "" "" "" "" "Auto"
"Luce camera da letto" "0/0/1" "" "" "" "DPST-1-1" "Auto"` };
return msg;
```Changez uniquement l'IP:```javascript
msg.setGatewayConfig = { IP:"224.0.23.12" }; return msg;
``` **Déconnexion forcée et désactiver la reconnexion automatique** ```javascript
msg.connectGateway = false; return msg;
``` **Connexion forcée et activer la reconnexion automatique** ```javascript
msg.connectGateway = true; return msg;
```## Voir
[Exemple de chien de garde](/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog)
