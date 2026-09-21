---
layout: wiki
title: "Garage-Configuration"
lang: fr
permalink: /wiki/fr-Garage-Configuration
---
## Mise à jour vers KNX Ultimate 8

La version 7 ajoute un petit bouton **Mettre à jour vers v8** en haut de chaque éditeur de nœud. Il sauvegarde les flux, installe les packages HUE/Matter requis, convertit les nœuds compatibles, effectue un Deploy complet, vérifie les flux enregistrés et installe la version 8. Redémarrez ensuite le service Node-RED comme demandé ; recharger uniquement le navigateur ne suffit pas. Les anciens nœuds KNX AI arrêtent l’opération automatique.

[Lire le guide complet de mise à jour](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-Upgrade-to-v8)


<!-- KNX_UTILITY_LEGACY_NOTICE -->
> Ce nœud dédié reste compatible avec les flux existants. Pour les nouveaux flux, utilisez [KNX Utility](/node-red-contrib-knx-ultimate/wiki/fr-KNX-Utility) et sélectionnez **Garage**. Son éditeur convertit tous les anciens utilitaires compatibles dans tous les flux et sous-flux, avec une seule opération Annuler et un Deploy manuel.

---
# Porte de garage
Le nœud **KNX Garage** pilote un portail motorisé en utilisant des GA dédiées pour les commandes booléennes ou par impulsion, gère la cellule photo/obstruction, autorise le maintien ouvert ou la désactivation et propose une refermeture automatique.
## Adresses de groupe

|Usage|Propriété|Remarques|
|--|--|--|
| Commande directe | `Command GA` (`gaCommand`) | GA booléenne : `true` ouvre, `false` ferme (DPT 1.001). |
| Impulsion | `Impulse GA` (`gaImpulse`) | Le front montant commute le portail (DPT 1.017). Utilisée lorsque la commande directe n'est pas disponible. |
| Mouvement | `gaMoving` | Impulsion optionnelle à chaque commande de déplacement. |
| Obstruction | `gaObstruction` | Diffuse l'état d'obstruction pour les autres équipements KNX. |
| Maintien ouvert | `gaHoldOpen` | Annule la refermeture automatique tant que la valeur reste à true. |
| Désactivation | `gaDisable` | Bloque toute action générée par le nœud (mode maintenance). |
| Cellule photo | `gaPhotocell` | Passe à true lorsqu'un obstacle coupe le faisceau ; le nœud rouvre et signale l'obstruction. |

## Refermeture automatique
- Activez le temporisateur pour envoyer la fermeture après le délai configuré.
- Maintien ouvert ou désactivation suspendent le timer tant qu'ils sont actifs.
- À l'échéance le nœud exécute `auto-close` et envoie la commande de fermeture (ou l'impulsion).
## Sécurité
- Une cellule photo à true pendant la fermeture rouvre immédiatement et positionne l'état d'obstruction.
- Les écritures externes sur la GA obstruction gardent l'état interne synchronisé avec tableaux de bord et alarmes.
- Les impulsions de mouvement peuvent alimenter ventilation, éclairage ou logique d'alarme.
## Intégration dans les flows
- `msg.payload` accepte `true`, `false`, `'open'`, `'close'`, `'toggle'` pour commander la porte depuis Node-RED.
- Avec *Émettre des événements* activé, des objets détaillant `event`, `state`, `disabled`, `holdOpen`, `obstruction` sont envoyés.
## Exemple de flow
```javascript

// Ouvrir le portail
msg.payload = 'open'; // accepte aussi true
return msg;
```

```javascript
// Fermer le portail
msg.payload = 'close'; // accepte aussi false
return msg;
```

```javascript
// Basculer l’état du portail
msg.payload = 'toggle';
return msg;
```
