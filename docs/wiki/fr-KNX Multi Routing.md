---
layout: wiki
title: "KNX Multi Routing"
lang: fr
permalink: /wiki/fr-KNX%20Multi%20Routing
---
<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/knx-multi-routing-filter.svg" width="95%"><br/>

Ce nœud sert à **interconnecter plusieurs gateways KNX Ultimate** (plusieurs `knxUltimate-config`) via des liaisons Node-RED.

Il émet en sortie un objet contenant des informations **RAW** (APDU + cEMI hex + adresses) pour chaque télégramme reçu sur le bus KNX du gateway sélectionné.
Il peut aussi accepter ces objets RAW en entrée et les transmettre vers le bus KNX du gateway sélectionné.

## Mode serveur KNX/IP
Réglez **Mode** sur **Server KNX/IP** pour démarrer un serveur KNXnet/IP tunneling (UDP) intégré. Les télégrammes reçus des clients sont émis au même format RAW.
Le nœud accepte aussi en entrée des objets RAW et les injecte vers les clients tunneling connectés.

**Important (Advertise host) :** les clients KNXnet/IP enverront les données à l’IP annoncée par le serveur dans la CONNECT_RESPONSE. Si le client indique *connecté* mais que le serveur ne reçoit aucun télégramme, définissez **Advertise host** sur l’IP LAN du serveur accessible par le client (surtout si Node-RED tourne dans Docker/VM ou sur une machine multi-homée).

## Format du message en sortie
`msg.payload` contient :
- `knx.event` : `GroupValue_Write` / `GroupValue_Response` / `GroupValue_Read`
- `knx.source` : adresse physique (ex. `1.1.10`)
- `knx.destination` : adresse de groupe (ex. `0/0/1`)
- `knx.apdu.data` : payload APDU en `Buffer` (uniquement Write/Response)
- `knx.apdu.bitlength` : longueur en bits (`<=6` signifie encodé dans les bits bas de l’APCI)
- `knx.cemi.hex` : cEMI complet en hex (style ETS)
- `knx.echoed` : `true` si le gateway l’a « echoed »
- `knxMultiRouting.gateway` : métadonnées du gateway (`id`, `name`, `physAddr`)

## Routing counter (hop count)
MultiRouting peut utiliser le routing counter (hop count) présent dans `knx.cemi.hex` pour éviter les boucles de télégrammes.
- **Respect routing counter (drop if 0)** : les télégrammes avec routing counter `0` ne sont pas transmis.
- **Decrement routing counter when routing** : le nœud décrémente le routing counter lors du transfert. S’il atteint `0`, le télégramme est supprimé.

La valeur courante est exposée via `knx.routingCounter` (et via `knx.cemi.hopCount` lorsque `knx.cemi` est un objet).

## Réécriture des télégrammes
Si vous réécrivez `knx.source` / `knx.destination` dans votre flow, vous devez aussi maintenir `knx.cemi.hex` cohérent. Recommandé : placez **KNX Router Filter** entre les nœuds MultiRouting : il maintient automatiquement `knx.cemi.hex` cohérent lors d’une réécriture.

## Notes
- Lors d’un transfert vers un autre gateway, l’**adresse physique source change** (elle devient celle du gateway émetteur). Utilisez `knx.source` et/ou `knxMultiRouting.gateway` pour filtrer les boucles.
- L’option **« Drop messages already tagged for this gateway »** aide à prévenir des boucles simples lorsque plusieurs routeurs sont interconnectés.
