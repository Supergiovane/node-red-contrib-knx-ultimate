---
layout: wiki
title: "Cerebrum Ultimate"
lang: it
permalink: /wiki/it-Cerebrum-Ultimate
---

# Cerebrum Ultimate

Il precedente nodo AI incluso in KNX Ultimate è stato sostituito dal package autonomo **Cerebrum Ultimate**.

Cerebrum Ultimate usa KNX Ultimate come integrazione compatibile opzionale, insieme a Home Assistant, HUE, Matter, UniFi Protect e agli altri adapter registrati. Per le nuove installazioni occorre usare [`node-red-contrib-cerebrum-ultimate`](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate).

Dalla versione **7.1.0-beta.0**, i nodi `knxUltimateAI` e `knxUltimateAIHomeAssistant` e la loro interfaccia web sono stati rimossi da KNX Ultimate. I flow esistenti che contengono questi tipi mostreranno nodi sconosciuti. Migra questi flow al package autonomo Cerebrum Ultimate prima di aggiornare; non è prevista una conversione automatica. I dati AI salvati su disco restano intatti.

La documentazione completa in inglese è nel [README di Cerebrum Ultimate](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate#readme).
