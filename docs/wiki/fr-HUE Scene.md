---
layout: wiki
title: "HUE Scene"
lang: fr
permalink: /wiki/fr-HUE%20Scene
---
Le nœud **Hue Scene** expose des scènes de teinLe champ de scène prend en charge la saisie semi-automatique;Utilisez l'icône d'actualisation après avoir ajouté des scènes sur le pont afin que la liste reste à jour.

### Tabs en un coup d'œil

- **Mapping** - Lien des adresses de groupe KNX à la scène Hue sélectionnée.DPT 1.xxx effectue un rappel Boolean, tandis que DPT 18.xxx envoie un numéro de scène KNX.
- **Multi Scene** - Créez une liste de règles qui associe les numéros de scène KNX à différentes scènes de teintes et choisit si chaque scène est rappelée comme _ACTIVE_, _DYMAMIC \ _PALETTE_ ou _STATIC_.
- **comportement** - basculer la broche de sortie du nœud-rouge.Lorsqu'aucune passerelle KNX n'est configurée, la broche reste activée afin que les événements de pont atteignent toujours l'écoulement.

### Paramètres généraux

| Propriété | Description |
|-|-|
|KNX GW |KNX Gateway Fourniture du catalogue d'adresses utilisé pour la saisie semi-automatique.|
|Pont Hue |Hue Bridge qui héberge les scènes.|
|Scène de teinte |Scène à rappeler (Ambordage automatique; Bouton de rafraîchissement recharge le catalogue du pont).|

Onglet de mappage ###

| Propriété | Description |
|-|-|
|Rappel |Adresse du groupe KNX qui rappelle la scène.Utilisez DPT 1.xxx pour le contrôle booléen ou DPT 18.xxx pour transmettre un numéro de scène KNX.|
|DPT |DataPoint utilisé avec le rappel GA (1.xxx ou 18.001).|
|Nom |Étiquette amicale pour le rappel GA.|
|# |Apparaît lorsqu'une scène KNX DPT est choisie;Sélectionnez le numéro de scène KNX à envoyer.|
|Statut GA |Boolean GA en option qui reflète si la scène est actuellement active.|

Onglet ### Multi Scene

| Propriété | Description |
|-|-|
|Rappel |KNX GA (DPT 18.001) qui sélectionne les scènes par numéro.|
|Sélecteur de scène |Liste modifiable qui mappe les numéros de scène KNX aux scènes de teinte avec le mode de rappel souhaité.La traînée gère les entrées de réorganisation.|

> ℹ️ Les widgets spécifiques au KNX n'apparaissent qu'après la sélection d'une passerelle KNX.Les onglets de mappage restent masqués jusqu'à la configuration du pont et de la passerelle.
