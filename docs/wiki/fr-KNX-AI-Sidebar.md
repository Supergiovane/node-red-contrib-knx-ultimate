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
- Generer un flux Node-RED pret a importer a partir d'une description en langage naturel (Flow Builder, BETA).

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
  Si l'archive disque est activée dans le nœud, Ask consulte cette archive par défaut et, sans date explicite, utilise les dernières 24 heures.
- **Flow Builder** (BETA) : decrivez une automatisation avec des mots et obtenez un flux Node-RED (JSON) a coller dans l'editeur.
- **Settings** : selection du nœud et import/export.

## Flow Builder (BETA)

Transformez une phrase en un flux Node-RED fonctionnel.

1. Ouvrez **Flow Builder** et ecrivez ce que vous voulez, par exemple : *"Quand la lumiere du couloir s'allume, allume la lumiere de la salle de bain du rez-de-chaussee puis eteins-la apres 10 secondes."*
2. Appuyez sur **Generate flow**. L'IA construit le flux avec les nœuds KNX Ultimate, les nœuds Philips Hue et les nœuds natifs Function/logique, relies a vos adresses de groupe importees.
3. Appuyez sur **Copy JSON**, puis dans Node-RED ouvrez **Menu > Import** et collez-le.

Bon a savoir :

- C'est une BETA : verifiez les nœuds generes avant le deploiement.
- Les id des nœuds et le cablage sont reconstruits automatiquement, et les references aux nœuds de configuration KNX/Hue pointent vers vos nœuds de configuration existants.
- Fonctionne avec n'importe quel fournisseur LLM configure (compatible OpenAI, Anthropic/Claude ou Ollama).

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
- Pour les reponses du chat et le Flow Builder : LLM active dans le nœud KNX AI, avec un fournisseur configure — compatible OpenAI, **Anthropic (Claude)** ou Ollama (local). Une cle API est requise pour les fournisseurs cloud.
