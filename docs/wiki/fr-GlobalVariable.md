---
layout: wiki
title: "GlobalVariable"
lang: fr
permalink: /wiki/fr-GlobalVariable
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/GlobalVariable) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-GlobalVariable) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-GlobalVariable) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-GlobalVariable) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-GlobalVariable) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-GlobalVariable)

# Variable globale KNX

Ce nœud expose l'adresse de groupe reçue du bus à une variable globale **** 

Vous pouvez écrire dans le bus KNX en mettant simplement à jour la variable globale! 

## Aperçu

Mettez un nœud de contexte global dans l'écoulement, puis donnez-lui un nom. 

Le nom que vous donnez au nœud deviendra le nom de la variable de contexte globale. 

C'est tout. Pour des raisons de sécurité, veuillez modifier le nom du nœud par défaut** 

Vous pouvez accéder à la variable globale en ajoutant le suffixe \ _read au nom du nœud. 

Vous pouvez activer / désactiver la variable de contexte globale, ou activer la lecture ou lire / écrire dans la fenêtre de configuration. 

Vous pouvez émettre une commande KNX Bus Write, en modifiant simplement le nom de variable global avec Suffix \ _Write. _ **Une fois les commandes exécutées, la variable globale avec suffixe \ _write est automatiquement vidé, pas pour répéter infiniment les commandes. ** _ 
**Paramètres**

| Propriété | Description |
|-|-|
| Passerelle | La passerelle KNX. |
| Nom variable | Nom du contexte mondial. 2 variables avec ce nom seront créées, l'une avec le suffixe \ _read (pour la lecture d'adresses de groupe) et l'autre avec le suffixe \ _Write (pour l'écriture d'adresses de groupe). Par exemple, si le nom de la variable est "knxGlobalContext", les 2 variables knxglobalcontext \ _read et knxglobalcontext \ _write sont créées. Étant donné que la variable globale est visible à partir de tous les nœuds (même les non-KNX-ultime), pour des raisons de sécurité, définissez un nom autre que celui par défaut. Cliquez sur l'exemple de lien en bas de la page. |
| Exposer en tant que variable globale | Choisissez si et comment vous souhaitez exposer la variable globale. Si vous n'avez pas l'intention d'écrire sur le bus KNX, pour la sécurité, laissez "lire seulement". |
| Intervalle d'écriture de bus | Le nœud vérifie la variable avec le suffixe \ _Write à intervalles réguliers pour écrire sur le bus KNX. Choisissez l'intervalle que vous préférez. |

## Propriétés MSG

```javascript

// Properties of the variable, both in reading and in writing
{
    address : "0/0/1",
    dpt: "1.001", 
    payload: true,
    devicename:"Dinning Room->Table Light"
}

```

# Utilisation

## Échantillon de nœud de contexte global

Ce nœud expose l'adresse de groupe reçue du bus à une variable globale **** 

Vous pouvez écrire dans le bus KNX en mettant simplement à jour la variable globale! 

## Aperçu

Mettez un nœud de contexte global dans l'écoulement, puis donnez-lui un nom. 

Le nom que vous donnez au nœud deviendra le nom de la variable de contexte globale. 

C'est tout. Pour des raisons de sécurité, veuillez modifier le nom du nœud par défaut** 

Vous pouvez accéder à la variable globale en ajoutant le suffixe \ _read au nom du nœud. 

Vous pouvez activer / désactiver la variable de contexte globale, ou activer la lecture ou lire / écrire dans la fenêtre de configuration. 

Vous pouvez émettre une commande KNX Bus Write, en modifiant simplement le nom de variable global avec Suffix \ _Write. _ **Une fois les commandes exécutées, la variable globale avec suffixe \ _write est automatiquement vidé, pas pour répéter infiniment les commandes.** _ 

### Voir le code

> Ajustez les nœuds en fonction de votre configuration

```javascript

[{"id":"ababb834.9073","type":"knxUltimateGlobalContext","z":"5ed79f4a958a1f20","server":"b60c0d73.1c02b","name":"KNXContextBanana","exposeAsVariable":"exposeAsVariableREADWRITE","writeExecutionInterval":"1000","x":230,"y":200,"wires":[]},{"id":"2954e7ea.f53988","type":"function","z":"5ed79f4a958a1f20","name":"Write to the KNXContextBanana variable","func":"// This function writes some values to the KNX bus\nlet GroupAddresses = [];\nGroupAddresses.push ({address: \"0/0/10\", dpt:\"1.001\", payload:true});\nGroupAddresses.push({ address: \"0/0/11\", dpt: \"1.001\", payload: true });\nGroupAddresses.push({ address: \"0/0/12\", dpt: \"1.001\", payload: false });\n\n// You can also avoid setting datapoint.\n// This works gread if you have imported the ETS file, otherwise it'll guess the datapoint type by analyzing the payload\nGroupAddresses.push ({address: \"0/0/14\", payload:false});\nGroupAddresses.push({ address: \"0/0/15\", payload: 50 });\n\n// Remember: add the string \"_WRITE\" after the node name to write to the bus\nglobal.set(\"KNXContextBanana_WRITE\",GroupAddresses);\n","outputs":0,"noerr":0,"initialize":"","finalize":"","libs":[],"x":480,"y":300,"wires":[]},{"id":"bd4380e3.8c1ea","type":"inject","z":"5ed79f4a958a1f20","name":"Call the function","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"true","payloadType":"bool","x":220,"y":300,"wires":[["2954e7ea.f53988"]]},{"id":"269bf86a.34e9f8","type":"comment","z":"5ed79f4a958a1f20","name":"Exposing the Group Addresses to the global context variable","info":"","x":360,"y":160,"wires":[]},{"id":"f9a6ff93.086a","type":"function","z":"5ed79f4a958a1f20","name":"Read the KNXContextBanana variable","func":"// This function reads the variable\n// Remember: add the string \"_READ\" after the node name to read the variable\nlet GroupAddresses = global.get(\"KNXContextBanana_READ\") || [];\n\n// Outputs the array, as example\nnode.send({payload:GroupAddresses});\n\n// Get the Group Address object, having address 0/0/10\nlet Ga = GroupAddresses.find(a => a.address === \"0/0/10\");\n\n// Outputs the object, as example\nnode.send({ Found: Ga });\n\n// Do some testing and output some stuffs.\nif (Ga.payload === true) return {payload : \"FOUND AND TRUE\"};\nif (Ga.payload === false) return {payload : \"FOUND AND FALSE\"};\n\n","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":410,"y":420,"wires":[["f4109aa5.270e08"]]},{"id":"64c9e0f0.b13178","type":"inject","z":"5ed79f4a958a1f20","name":"Read","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"true","payloadType":"bool","x":190,"y":420,"wires":[["f9a6ff93.086a"]]},{"id":"f4109aa5.270e08","type":"debug","z":"5ed79f4a958a1f20","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","statusVal":"","statusType":"auto","x":630,"y":420,"wires":[]},{"id":"bf16d5a9.073b6","type":"comment","z":"5ed79f4a958a1f20","name":"Check global variable and do some stuffs","info":"","x":300,"y":380,"wires":[]},{"id":"85c342f08c9c4705","type":"comment","z":"5ed79f4a958a1f20","name":"This function writes some values to the bus","info":"","x":310,"y":260,"wires":[]},{"id":"b60c0d73.1c02b","type":"knxUltimate-config","host":"224.0.23.12","port":"3671","physAddr":"15.15.22","suppressACKRequest":false,"csv":"","KNXEthInterface":"Auto","KNXEthInterfaceManuallyInput":"","statusDisplayLastUpdate":false,"statusDisplayDeviceNameWhenALL":true,"statusDisplayDataPoint":true,"stopETSImportIfNoDatapoint":"fake","loglevel":"error","name":"Multicast","localEchoInTunneling":true,"delaybetweentelegrams":"","delaybetweentelegramsfurtherdelayREAD":"","ignoreTelegramsWithRepeatedFlag":false,"keyringFileXML":""}]

```

## Obtenez la valeur de la variable

```javascript

// This function reads the variable
// Remember: add the string "_READ" after the node name to read the variable
let GroupAddresses = global.get("KNXContextBanana_READ") || [];

// Outputs the array, as example
node.send({payload:GroupAddresses});

// Get the Group Address object, having address 0/0/10
let Ga = GroupAddresses.find(a => a.address === "0/0/10");

// Outputs the object, as example
node.send({ Found: Ga });

// Do some testing and output some stuffs.
if (Ga.payload === true) return {payload : "FOUND AND TRUE"};
if (Ga.payload === false) return {payload : "FOUND AND FALSE"};

```

## Envoyer KNX Telegram via une variable globale

```javascript

// This function writes the value to the KNX bus
let GroupAddressesSend = [];
GroupAddressesSend.push({address: "0/0/10", dpt:"1.001", payload:msg.payload});

// You can also avoid setting datapoint.
// This works gread if you have imported the ETS file, otherwise it'll guess the datapoint type by analyzing the payload
GroupAddressesSend.push({address: "0/0/11", payload:msg.payload});

// Remember: add the string "_WRITE" after the node name to write to the bus
global.set("KNXContextBanana_WRITE",GroupAddressesSend);

```

# ÉCHANTILLON

<a href = "https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/SampleglobalContextNode" Target = "_ Blank"> <i class="fa fa-info-circle"> </i> Voir cet échantillon </a>
