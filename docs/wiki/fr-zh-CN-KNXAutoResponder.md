---
layout: wiki
title: "zh-CN-KNXAutoResponder"
lang: fr
permalink: /wiki/fr-zh-CN-KNXAutoResponder
---
---
<p> Ce nœud répondra à la demande de lecture du bus KNX.
Le nœud enregistre tous les télégrammes qui sont transférés dans le bus KNX et stockent les valeurs en mémoire.
Il répond ensuite à la demande de lecture en renvoyant ces valeurs mémorisées au bus en fonction de la demande.
Si l'adresse du groupe à lire n'a pas encore de valeur, le nœud répondra avec la valeur par défaut.
Ce nœud répondra uniquement à l'adresse de groupe spécifiée dans le champ **Response** JSON.
Par défaut, il existe un texte JSON précompilé * ***"Response" que vous pouvez simplement modifier / supprimer du contenu.Veuillez vous assurer que** n'appuyez pas sur **pour l'utiliser!!!** Configuration**| Propriétés | Description |
|-|-|
| Passerelle | Sélectionnez le portail KNX à utiliser |
| Réponse | Node répondra à une demande de lecture de l'adresse de groupe spécifiée dans ce tableau JSON.Le format est spécifié ci-dessous.|
<br/>
\ *\* JSON Format \ *\*
JSON est toujours un tableau d'objets contenant chaque instruction.Chaque instruction indique au nœud quoi faire.
| Propriétés | Description |
|-|-|
| Remarque | ** Clé de note facultative** Remarque pour obtenir des rappels.Il ne sera utilisé nulle part.|
| GA | Adresse du groupe.Vous pouvez également utiliser ".." des pièces sauvages à des groupes d'adresses spécifiques.".." ne peut être utilisé qu'avec le troisième niveau GA, par exemple: \ *\* 1/1/0..257**.Veuillez consulter l'échantillon ci-dessous.|
| DPT | Point de données d'adresse de groupe, format "1.001".Si le fichier ETS CSV a été importé, **Facultatif \* \ *. |
| Par défaut |Lorsque la valeur d'adresse du composant n'a pas été rappelée par le nœud, il est envoyé au bus dans une réponse de demande de lecture.| ** Commençons par une commande** Le nœud de répondeur automatique répondra à une demande de lecture à l'adresse du groupe 2/7/1.Si ce n'est pas encore en mémoire, il répondra avec _true _. |
Le fichier ETS CSV doit être importé, sinon vous devez également ajouter la touche __"DPT": "1.001" \ *\*.

```json

[
    {
        "ga": "2/7/1",
        "default": true
    }
]
```

** Instructions plus complètes** Le nœud de réponse automatique répondra aux demandes de lecture à partir du 3/1/1, y compris le 3/1/22.Si la mémoire n'a pas encore de valeur, elle répondra avec _false _.
Il existe également une touche__ note \ *\*, qui n'est utilisée que comme note de rappel.Il ne sera utilisé nulle part.

```json

[
    {
        "note": "Virtual sensors coming from Hikvision AX-Pro",
        "ga": "3/1/1..22",
        "dpt": "1.001",
        "default": false
    }
]
```

** Commande connectée** Du 2/2/5 au 2/2/21, le nœud AutoResPonder répondra à une demande de lecture à l'adresse du groupe.S'il n'y a pas encore de valeur en mémoire, il répondra avec une valeur de 25.
Le nœud AutoResPonder répondra également aux demandes de lecture du composant 2/4/22.S'il n'y a pas encore de valeur en mémoire, il utilisera l'état de chaîne \ *inconnu!\*répondre.
Notez la ** virgule** entre les objets JSON de chaque directive.

```json

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

<br/>
