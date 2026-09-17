---
layout: wiki
title: "GlobalVariable"
lang: fr
permalink: /wiki/fr-GlobalVariable
translation_key: "GlobalVariable"
---

> Dans la version 8, utilisez **KNX Utility** et choisissez **Global Context**. Les réglages ci-dessous décrivent cette fonction. L’ancien nœud séparé n’est plus inclus.
>
> [KNX Utility]({{ '/wiki/fr-KNX-Utility' | relative_url }}) · [Passer de la version 7 à la 8]({{ '/wiki/fr-Migration-8' | relative_url }})


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
| Porte | La passerelle KNX. |
| Nom variable (pas d'espaces, seulement Chars [A-Z]) | Nom du contexte mondial. 2 variables avec ce nom seront créées, l'une avec le suffixe \ _read (pour la lecture d'adresses de groupe) et l'autre avec le suffixe \ _Write (pour l'écriture d'adresses de groupe). Par exemple, si le nom de la variable est "knxGlobalContext", les 2 variables knxglobalcontext \ _read et knxglobalcontext \ _write sont créées. Étant donné que la variable globale est visible à partir de tous les nœuds (même les non-KNX-ultime), pour des raisons de sécurité, définissez un nom autre que celui par défaut. Cliquez sur l'exemple de lien en bas de la page. |
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

[Télécharger le JSON]({{ '/examples/Global%20Context%20-%20Expose%20KNX%20Values.json' | relative_url }})

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

<a href = "https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/SampleGlobalContextNode" Target = "_ Blank"> <i class="fa fa-info-circle"> </i> Voir cet échantillon </a>
