---
layout: wiki
title: "DateTime-Configuration"
lang: fr
permalink: /wiki/fr-DateTime-Configuration
---
## Mise à jour vers KNX Ultimate 8

La version 7 ajoute un petit bouton **Mettre à jour vers v8** en haut de chaque éditeur de nœud. Il sauvegarde les flux, installe les packages HUE/Matter requis, convertit les nœuds compatibles, effectue un Deploy complet, vérifie les flux enregistrés et installe la version 8. Redémarrez ensuite le service Node-RED comme demandé ; recharger uniquement le navigateur ne suffit pas. Les anciens nœuds KNX AI arrêtent l’opération automatique.

[Lire le guide complet de mise à jour](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-Upgrade-to-v8)


<!-- KNX_UTILITY_LEGACY_NOTICE -->
> Ce nœud dédié reste compatible avec les flux existants. Pour les nouveaux flux, utilisez [KNX Utility](/node-red-contrib-knx-ultimate/wiki/fr-KNX-Utility) et sélectionnez **DateTime**. Son éditeur convertit tous les anciens utilitaires compatibles dans tous les flux et sous-flux, avec une seule opération Annuler et un Deploy manuel.

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
