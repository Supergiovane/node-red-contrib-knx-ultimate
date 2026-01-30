---
layout: wiki
title: "KNX Multi Routing"
lang: fr
permalink: /wiki/fr-KNX%20Multi%20Routing
---
Ce nœud sert à **interconnecter plusieurs gateways KNX Ultimate** (plusieurs `knxUltimate-config`) via des liaisons Node-RED.

Il émet en sortie un objet contenant des informations **RAW** (APDU + cEMI hex + adresses) pour chaque télégramme reçu sur le bus KNX du gateway sélectionné.
Il peut aussi accepter ces objets RAW en entrée et les transmettre vers le bus KNX du gateway sélectionné.

## Mode serveur KNX/IP
Réglez **Mode** sur **Server KNX/IP** pour démarrer un serveur KNXnet/IP tunneling (UDP) intégré. Les télégrammes reçus des clients sont émis au même format RAW.
Le nœud accepte aussi en entrée des objets RAW et les injecte vers les clients tunneling connectés.

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

## Notes
- Lors d’un transfert vers un autre gateway, l’**adresse physique source change** (elle devient celle du gateway émetteur). Utilisez `knx.source` et/ou `knxMultiRouting.gateway` pour filtrer les boucles.
- L’option **« Drop messages already tagged for this gateway »** aide à prévenir des boucles simples lorsque plusieurs routeurs sont interconnectés.
