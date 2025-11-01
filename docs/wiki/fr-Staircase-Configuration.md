---
layout: wiki
title: "Staircase-Configuration"
lang: fr
permalink: /wiki/fr-Staircase-Configuration/
---
---
# Temporisateur d'escalier
Le nœud **KNX Staircase** émule un éclairage d'escalier temporisé. Lorsqu'un front actif est reçu sur la GA d'impulsion la lampe s'allume, le compte à rebours démarre et un préavis peut être envoyé avant l'extinction. Override manuel, blocage et émission d'événements sont également pris en charge.
## Adresses de groupe
|Usage|Propriété|Remarques|
|--|--|--|
| Impulsion | `Trigger GA` (`gaTrigger`) | La valeur `1` démarre ou prolonge le minuteur. Avec l'option « La valeur 0 annule » un `0` éteint immédiatement. |
| Sortie | `Output GA` (`gaOutput`) | Actionneur commandé pendant le cycle (DPT par défaut 1.001). |
| État | `Status GA` (`gaStatus`) | Reflète l'état actif et le préavis. |
| Override | `gaOverride` | Maintient l'éclairage allumé et suspend le minuteur tant que la valeur vaut `1`. |
| Blocage | `gaBlock` | Empêche les nouvelles impulsions et peut forcer l'arrêt. |
## Minuteur et préavis
- **Durée du minuteur** définit la durée de base.
- **Nouvelle impulsion** permet de redémarrer, prolonger ou ignorer les impulsions supplémentaires.
- **La valeur 0 annule le cycle** termine le minuteur avec le motif `manual-off` lorsque l'impulsion repasse à `0`.
- **Lors du blocage** indique si l'on se contente d'ignorer les impulsions ou si l'on coupe également la sortie.
- Le préavis peut basculer la GA d'état ou faire clignoter la sortie pendant la durée définie.
## Événements et sortie
- En activant *Émettre des événements* le nœud publie des objets contenant `event`, `remaining`, `active`, `override`, `blocked` (`trigger`, `extend`, `prewarn`, `timeout`, `manual-off`, `override`, `block`).
- La GA d'état peut servir de retour direct dans une logique KNX.
## Exemple de flow
```javascript

// Démarrer le temporisateur d'escalier
msg.payload = true;
return msg;
```

```javascript
// Annuler le cycle (option "La valeur 0 annule")
msg.payload = false;
return msg;
```

## Bonnes pratiques
- Utilisez l'override pour la maintenance ou des nettoyages prolongés.
- Affichez la GA d'état sur un tableau de bord ou un voyant.
- Le clignotement de préavis nécessite un actionneur capable de commuter rapidement.
