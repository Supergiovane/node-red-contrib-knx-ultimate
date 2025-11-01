---
layout: wiki
title: "zh-CN-HUE Scene"
lang: fr
permalink: /wiki/fr-zh-CN-HUE%20Scene/
---
---
Le nœud **Hue Scene** publie la scène Hue à KNX et peut envoyer les événements originaux de Hue au processus de Node-Red. Les champs de scène prennent en charge l'achèvement automatique;Après avoir ajouté de nouvelles scènes au pont, veuillez cliquer sur l'icône d'actualisation pour mettre à jour la liste.
### Aperçu de l'onglet
- **Mapping** - Associer l'adresse du groupe KNX à la scène de teinte sélectionnée.DPT 1.xxx est utilisé pour le contrôle booléen, et DPT 18.xxx est utilisé pour envoyer des numéros de scène KNX.
- **Scénarios multiples** - Créez une liste de règles, mappez différents numéros de scène KNX dans les scènes de teinte et sélectionnez la méthode d'appel de _active_ / _dynamic \ _palette_ / _static_.
- **comportement** - contrôle si la broche de sortie du nœud-rouge s'affiche.Lorsque la passerelle KNX n'est pas configurée, la broche reste activée afin que l'événement de pont continue d'entrer dans le processus.
### Paramètres généraux
| Propriétés | Description |
|-|-|
| KNX GW | Une passerelle KNX qui fournit un répertoire d'adresse d'achèvement automatique.|
| Hue Bridge | Hue Bridge qui héberge la scène. |
| Scène de la teinte |Scène à appeler (la complétion automatique est prise en charge; le bouton de rafraîchissement reprendra la liste).|
Onglet de mappage ###
| Propriétés | Description |
|-|-|
| Rappelons GA | Appelez l'adresse du groupe KNX de la scène.Utilisez DPT 1.xxx pour envoyer une valeur booléenne, ou utilisez DPT 18.xxx pour envoyer un numéro de scène KNX.|
| DPT | Le type de point de données utilisé avec un rappel GA (1.xxx ou 18.001).|
| Nom | Nom de l'instruction pour rappeler GA.|
| # | Affiché lorsque KNX Scene DPT est sélectionné, utilisé pour sélectionner le numéro de scène à envoyer.|
| Statut GA | Boolean GA en option pour faire des commentaires si la scène est active.|
Onglet Multi-Scene ###
| Propriétés | Description |
|-|-|
| Rappelons GA | Utilisez GA de DPT 18.001 pour sélectionner une scène par le numéro de scène KNX. |
| Liste des scènes |Liste modifiable pour correspondre au numéro de scène KNX à la scène Hue et à son mode d'appel.Faites glisser des barres pour réorganiser.|
> ℹ️ Les commandes liées au KNX ne seront affichées qu'après avoir sélectionné la passerelle KNX; L'onglet Mappage restera caché jusqu'à la configuration du pont Hue et de la passerelle KNX.
