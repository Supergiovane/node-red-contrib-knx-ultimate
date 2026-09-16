---
layout: wiki
title: "Cerebrum Ultimate"
lang: it
permalink: /wiki/it-Cerebrum-Ultimate
---

# Cerebrum Ultimate

Il precedente nodo AI incluso in KNX Ultimate è stato sostituito dal package autonomo **Cerebrum Ultimate**.

Cerebrum Ultimate usa KNX Ultimate come integrazione compatibile opzionale, insieme a Home Assistant, HUE, Matter, UniFi Protect e agli altri adapter registrati. Per le nuove installazioni occorre usare [`node-red-contrib-cerebrum-ultimate`](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate).

Dalla versione **7.1.1**, i nodi legacy `knxUltimateAI` e `knxUltimateAIHomeAssistant` e la loro interfaccia web sono nuovamente inclusi per mantenere compatibili i flow esistenti. I nodi sono nascosti dalla palette; le configurazioni esistenti e i dati AI salvati restano supportati. La migrazione al package autonomo Cerebrum Ultimate è facoltativa e non è prevista una conversione automatica.

La documentazione completa in inglese è nel [README di Cerebrum Ultimate](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate#readme).
