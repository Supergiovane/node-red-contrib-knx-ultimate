---
layout: wiki
title: "KNXAutoResponder"
lang: fr
permalink: /wiki/fr-KNXAutoResponder
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/KNXAutoResponder) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-KNXAutoResponder) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-KNXAutoResponder) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-KNXAutoResponder) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-KNXAutoResponder) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-KNXAutoResponder)

Ce nœud répondra aux demandes de lecture du bus KNX.

Le nœud enregistre tous les télégrammes transmis au bus KNX et stockent les valeurs en mémoire. \
Il répond ensuite aux demandes de lecture en renvoyant cette valeur mémorisée dans le bus comme demande. \
Si l'adresse du groupe à lire n'a pas encore de valeur, le nœud répondra avec une valeur par défaut. \
Le nœud répondra uniquement aux adresses de groupe spécifiées dans le champ **Réponse au** JSON. \
Par défaut, il existe un exemple **pré-compilé ** "Répondez au" Texte JSON, où vous pouvez simplement changer / supprimer des choses.Veuillez vous assurer que**de ne pas l'utiliser comme c'est ** !!!**Configuration**

| Propriété | Description |
|-|-|
|Passerelle |Sélectionnez la passerelle KNX à utiliser |
|Répondre à |Le nœud répondra aux demandes de lecture provenant des adresses de groupe spécifiées dans ce tableau JSON.Le format est spécifié ci-dessous.|

**Format JSON ** Le JSON est**toujours** un tableau d'objet, contenant chaque directive.Chaque directive indique au nœud ce qui fait.

| Propriété | Description |
|-|-|
|Remarque | **Facultatif** Note Key, pour les rappels.Il ne sera utilisé nulle part.|
|GA |L'adresse du groupe.Vous pouvez également utiliser les Wildchars "..", pour spécifier une gamme d'adresses de groupe.Le ".." ne peut être utilisé qu'avec le niveau du troisième GA, Ex: **1/1/0..257** .Voir les échantillons ci-dessous.|
|DPT |Le groupe adressé le point de données, dans le format "1.001".C'est **facultatif** Si le fichier ETS CSV a été importé.|
|par défaut |La valeur envoyée au bus en réponse à une demande de lecture, lorsque la valeur d'adresse du groupe n'a pas encore été mémorisée par le nœud.|

**Commençons par une directive**

Le nœud AutoResPonder répondra aux demandes de lecture de l'adresse du groupe 2/7/1.Si aucune valeur n'est encore en mémoire, elle répondra avec _true _. \
Le fichier ETS CSV doit avoir été importé, sinon vous devez également ajouter la clé **"DPT": "1.001"** .```json
[
    {
        "ga": "2/7/1",
        "default": true
    }
]
``` **Directive un peu plus complète**

Le nœud AutoResPonder répondra aux demandes de lecture de l'adresse du groupe à partir du 3/1/1 au 3/1/22 inclus.Si aucune valeur n'est encore en mémoire, elle répondra avec _false _. \
Il y a aussi une touche **note** , simplement comme une note de rappel.Il ne sera utilisé nulle part.```json
[
    {
        "note": "Virtual sensors coming from Hikvision AX-Pro",
        "ga": "3/1/1..22",
        "dpt": "1.001",
        "default": false
    }
]
``` **Directives de concaténation**

Le nœud de réponse automatique répondra aux demandes de lecture de l'adresse du groupe à partir du 2/2/5 au 2/2/21 incluse.Si aucune valeur n'est encore en mémoire, elle répondra avec une valeur de 25. \
Le nœud AutoResPonder répondra également aux demandes de lecture de l'adresse du groupe 2/4/22.Si aucune valeur n'est encore en mémoire, elle répondra avec la chaîne _Unknown Status! _. \
Veuillez noter le **virgule** entre l'objet JSON de chaque directive.```json
[
    {
        "note": "DALI garden virtual brightness %",
        "ga": "2/2/5..21"
        "default": 25
    },
    {
        "note": "Alarm armed status text",
        "ga": "2/4/22",
        "dpt": "16.001",
        "default": "Unknown status!"
    }
]
```
