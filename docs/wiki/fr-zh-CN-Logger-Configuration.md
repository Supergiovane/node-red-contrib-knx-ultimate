---
layout: wiki
title: "zh-CN-Logger-Configuration"
lang: fr
permalink: /wiki/fr-zh-CN-Logger-Configuration
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Logger-Configuration) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-Logger-Configuration) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-Logger-Configuration) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-Logger-Configuration) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-Logger-Configuration) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-Logger-Configuration)
---
# Logger (journal)
Le nœud d'enregistrement enregistre tous les messages et publie un fichier XML compatible avec ETS Bus Monitor.
Vous pouvez l'enregistrer sur le disque avec le nœud de fichier, ou l'envoyer à FTP, etc.Ce fichier peut être utilisé dans ETS pour diagnostiquer ou lire des messages.
Ce nœud peut également compter le nombre de messages (par seconde ou intervalle personnalisé).<br/> <a href = "/node-red-contrib-knx-ultimate/wiki/Logger-sample" Target = "_ Blank"> L'exemple est ici </a>
## installation
| Propriétés | Description |
|-|-|
| Passerelle | KNX Gateway. |
| Sujet | Le sujet du nœud. |
| Nom | Nom du nœud. |
## fichiers de diagnostic de bus compatibles ETS
|Propriétés |Description |
|-|-|
| Timer de démarrage automatique | Démarrez automatiquement la minuterie lors du déploiement ou du démarrage.|
| Sortir de nouveaux XML chaque (en minutes) | Combien de minutes la sortie XML compatible ETS?|
| Nombre maximum de lignes dans XML (0 = aucune limite) | Le nombre maximal de lignes de XML dans cette fenêtre temporelle; 0 signifie aucune limite.|
## compteur de messages KNX
| Propriétés | Description |
|-|-|
| Timer de démarrage automatique | Démarrez automatiquement la minuterie lors du déploiement ou du démarrage.|
| Intervalle de comptage (en quelques secondes) | L'intervalle pour la sortie du compte dans le processus en secondes.|
---
#NODE SORTIE
**broche 1: ETS compatible XML**
Utilisez le nœud de fichier pour enregistrer `msg.payload`, ou envoyez-le à FTP, etc.```javascript
msg = {
  topic: "MyLogger",
  payload: "CommunicationLog xmlns=http://knx.org/xml/telegrams/01 Telegram Timestamp=2020-03-27T07:32:39.470Z Service=L_Data.ind...." // XML 字符串
}
``` **PIN 2: Nombre de messages KNX**
Sortie par cycle de comptage:```javascript
msg = {
  topic: "",
  payload: 10,
  countIntervalInSeconds: 5,
  currentTime: "25/10/2021, 11:11:44"
}
```---
# Entrez le message (entrée)
Contrôle XML compatible ETS
**Démarrer la minuterie** ```javascript
msg.etsstarttimer = true; return msg;
``` **Stop Timer** ```javascript
msg.etsstarttimer = false; return msg;
``` **Sortie XML maintenant** ```javascript
// 立刻输出 XML；若计时器在运行，则一并重启
msg.etsoutputnow = true; return msg;
```Counter Control Control
**Démarrer la minuterie** ```javascript
msg.telegramcounterstarttimer = true; return msg;
``` **Stop Timer** ```javascript
msg.telegramcounterstarttimer = false; return msg;
``` **Compte de sortie immédiatement** ```javascript
msg.telegramcounteroutputnow = true; return msg;
```## Voir
- [Exemple d'enregistreur](/node-red-contrib-knx-ultimate/wiki/Logger-Sample)
