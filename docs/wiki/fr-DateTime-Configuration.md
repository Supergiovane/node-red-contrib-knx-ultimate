---
layout: wiki
title: "DateTime-Configuration"
lang: fr
permalink: /wiki/fr-DateTime-Configuration
---
# Configuration Date/Heure

Le nœud **KNX DateTime** écrit la date/heure courante sur une ou plusieurs adresses de groupe KNX.

Pris en charge :
- **DPT 19.001** (Date/Heure) – recommandé
- **DPT 11.001** (Date) – optionnel
- **DPT 10.001** (Heure) – optionnel

## Adresses de groupe

|Usage|Propriété|DPT|
|--|--|--|
| Date/Heure | `GA Date/Heure` (`gaDateTime`) | `19.001` |
| Date | `GA Date` (`gaDate`) | `11.001` |
| Heure | `GA Heure` (`gaTime`) | `10.001` |

## Quand il envoie

- Au déploiement/démarrage (optionnel, avec délai)
- Envoi périodique (optionnel, secondes/minutes)
- À chaque entrée (toujours)
- Bouton dans l'éditeur (envoyer maintenant)

## Payload d'entrée

Si `msg.payload` est vide, le nœud envoie la date/heure système courante.

Supporté :
- `Date` (`new Date()`)
- timestamp (ms)
- chaîne acceptée par `new Date("...")`
- `"now"`

## Sortie du nœud

Un message est émis à chaque envoi :
- `msg.payload` : la `Date` envoyée
- `msg.sent` : tableau de `{ ga, dpt, name }`
- `msg.reason` : `input`, `startup`, `periodic` ou `button`

## Auto-remplissage (ETS)

Lors de l'ajout d'un nouveau nœud, le premier gateway KNX avec import ETS peut être sélectionné automatiquement et les GA cohérentes pré-remplies.

