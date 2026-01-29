---
layout: wiki
title: "KNX AI"
lang: fr
permalink: /wiki/fr-KNX%20AI
---
Ce nœud écoute **tous les télégrammes KNX** du gateway KNX Ultimate sélectionné, construit des statistiques, détecte des anomalies simples et peut (optionnellement) interroger un LLM pour produire une analyse lisible.

## Ce qu’il fait
- Conserve un historique glissant des télégrammes KNX (déjà décodés par KNX Ultimate) en RAM.
- Émet des **résumés de trafic** périodiquement ou à la demande (Top GA, types d’événement, débit).
- Émet des **événements d’anomalie** (débit bus trop élevé, spam sur GA, « flapping »).
- Optionnel : interroge un LLM via la commande `ask`.

## Sorties
1. **Résumé/Statistiques** (`msg.payload` est du JSON)
2. **Anomalies** (`msg.payload` est un JSON décrivant l’anomalie)
3. **Assistant IA** (`msg.payload` est du texte ; inclut `msg.summary`)

## Commandes (entrée)
Envoyez un message avec `msg.topic` :
- `summary` (ou vide) : émet un résumé immédiatement
- `reset` : efface l’historique et les compteurs
- `ask` : questionne le LLM avec le résumé + le trafic récent

Pour `ask`, mettez la question dans `msg.prompt` (recommandé) ou dans `msg.payload` (chaîne).

## Notes
- Si vous activez le LLM, des informations du bus seront envoyées à l’endpoint configuré. Utilisez un provider local si vous voulez rester on‑premise.
- Pour OpenAI, collez **uniquement** la clé API (commence par `sk-`). Ne collez pas `Bearer ...` ni l’en-tête complet `Authorization: ...`.
