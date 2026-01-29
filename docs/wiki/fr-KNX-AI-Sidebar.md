---
layout: wiki
title: "KNX-AI-Sidebar"
lang: fr
permalink: /wiki/fr-KNX-AI-Sidebar
---
L’onglet de barre latérale **KNX AI** affiche en temps réel vos nœuds **KNX AI** : résumé, anomalies et une chat pour poser des questions sur le trafic KNX.

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/knx-ai-sidebar.svg" alt="KNX AI sidebar" style="width:100%;max-width:980px;border-radius:14px;box-shadow:0 12px 26px rgba(0,0,0,0.18);" />

## À quoi ça sert

- Afficher le résumé produit par le nœud `knxUltimateAI` sélectionné.
- Consulter les anomalies détectées.
- Poser des questions via la chat (les réponses sont rendues en Markdown) pour accélérer le dépannage.

## Comment l’utiliser

1. Sélectionnez le nœud `knxUltimateAI` dans la liste.
2. Cliquez sur **Refresh Summary** (ou activez **Auto**).
3. Utilisez la chat pour demander “pourquoi” et “quoi vérifier ensuite”.

## Plus de contexte (meilleures réponses)

Dans le nœud `knxUltimateAI` sélectionné, vous pouvez inclure du contexte supplémentaire dans le prompt du LLM :

- **Inventaire des flows :** l’IA “voit” quels nœuds KNX Ultimate (et gateways) sont présents dans vos flows, et peut relier les télégrammes à votre logique.
- **Extraits de documentation :** ajoute des extraits pertinents depuis l’aide/README/exemples (et `docs/wiki` si disponible) pour mieux expliquer les nœuds et proposer la bonne configuration.

## Exemples d’utilisation (scénarios)

- **Boucle / télégrammes dupliqués :** identifier les causes probables et isoler la source.
- **GA très bavarde :** comprendre pourquoi une GA est en tête et quelles sources écrivent dessus.
- **Comportement inattendu après un déploiement :** voir ce qui a changé et quels patterns sont apparus.
- **Routing entre passerelles :** filtrer/réécrire pour éviter storms et boucles de retour.

## Exemples de questions à coller dans la chat

- « Pourquoi `2/4/2` est si active ? Quelles causes sont les plus probables ? »
- « Vois-tu un pattern de boucle entre deux adresses de groupe ? »
- « Quelles adresses physiques écrivent sur `x/y/z` et à quelle fréquence ? »
- « Quels filtres mettre dans Router Filter pour stopper le spam tout en gardant le trafic normal ? »

## Prérequis

- Au moins un nœud `knxUltimateAI` dans vos flows.
- Le nœud `knxUltimateAI` sélectionné doit être lié à une passerelle `knxUltimate-config`.
- Pour les réponses LLM : activer le LLM dans `knxUltimateAI` et configurer la clé API dans ce nœud.
