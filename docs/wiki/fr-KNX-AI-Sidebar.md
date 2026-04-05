---
layout: wiki
title: "KNX-AI-Sidebar"
lang: fr
permalink: /wiki/fr-KNX-AI-Sidebar
---
Le **tableau de bord KNX AI** vous aide à surveiller votre installation KNX simplement.
Vous voyez rapidement ce qui se passe, vous repérez les anomalies, vous lancez des tests et vous posez des questions en langage naturel.
Cette page conserve le nom historique `KNX-AI-Sidebar` pour compatibilité.

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/knx-ai-sidebar.svg" alt="KNX AI sidebar" style="width:100%;max-width:980px;border-radius:14px;box-shadow:0 12px 26px rgba(0,0,0,0.18);" />

## Ce que vous pouvez faire

- Voir l'etat du systeme en un coup d'oeil.
- Identifier les adresses de groupe les plus actives.
- Creer et gerer des zones avec l'aide de l'IA.
- Lancer des tests guides et lire des resultats clairs.
- Demander a l'assistant : "qu'est-ce qui ne va pas ?"

## Demarrage rapide

1. Ouvrez-le depuis l’éditeur du nœud KNX AI avec **Open Web Page**.
2. Selectionnez votre nœud KNX AI dans la liste.
3. Appuyez sur **Refresh** si necessaire.

## Sections principales (guide simple)

- **Overview** : resume en direct et activite.
- **Areas** : pieces/zones et adresses de groupe associees.
- **Tests** : preparer et executer des controles.
- **Test Results** : historique pass/warn/fail.
- **Ask** : poser une question en langage naturel.
- **Settings** : selection du nœud et import/export.

## Parcours conseille (premiere utilisation)

1. Commencez par **Overview** pour verifier si le systeme est stable.
2. Ouvrez **Areas** pour controler les pieces/zones.
3. Si besoin, utilisez **Regenerate AI Areas**.
4. Lancez un test dans **Tests**, puis lisez **Test Results**.
5. Dans **Ask**, decrivez le probleme en une phrase et suivez les verifications proposees.

## Boutons les plus utiles

- **Refresh** : met a jour les donnees immediatement.
- **Regenerate AI Areas** : reconstruit les suggestions de zones IA a partir des adresses ETS.
- **Delete AI Areas** : supprime toutes les zones generees par l'IA en une action.
- **New Area** : cree une zone manuellement.

## Quand l'IA travaille

Pendant la generation ou la suppression des zones, un ecran d'attente apparait au centre.
C'est normal : la page bloque les clics jusqu'a la fin pour eviter les modifications involontaires.

## Prérequis

- Au moins un nœud KNX AI configure.
- Une passerelle connectee et active.
- Pour les reponses du chat : LLM active et cle API configuree dans le nœud KNX AI.
