---
layout: wiki
title: "Passare dalla versione 7"
lang: it
permalink: /wiki/it-Migration-8
translation_key: "Migration-8"
---

# Passare dalla versione 7

La versione 8 rimuove i vecchi nodi HUE, Matter e AI, i relativi nodi di configurazione e i nodi Utility separati. Completa la migrazione mentre KNX Ultimate 7 è ancora installato.

> ▶️ [Guarda il video sulla migrazione da KNX Ultimate 7 a 8](https://youtu.be/fpNNi1jZZSc)

1. Fai un backup dell’intera cartella utente di Node-RED: flow, credenziali, impostazioni e `knxultimatestorage`. Il solo JSON dei flow non salva gli abbinamenti Matter.

2. Con KNX Ultimate 7, usa **Migra KNX** o il pulsante di conversione di KNX Utility per trasformare i vecchi nodi Utility. Controlla tutti i flow e subflow, poi fai Deploy.

3. Installa `node-red-contrib-hue-ultimate` e/o `node-red-contrib-matter-ultimate` e riavvia Node-RED. Accetta il messaggio di migrazione. HUE converte sia i vecchi nodi singoli sia il vecchio Controller multimodale.

4. Controlla i flow convertiti e fai Deploy. Gli strumenti conservano ID e riferimenti alle configurazioni. Mantieni la stessa cartella utente e non eliminare `knxultimatestorage/matter`: contiene identità di abbinamento e fabric Matter.

5. Sostituisci o rimuovi `knxUltimateAI` e `knxUltimateAIHomeAssistant` prima dell’aggiornamento. Cerebrum Ultimate è il package AI separato; non c’è conversione automatica dei nodi AI. Elimina anche le vecchie configurazioni inutilizzate.

6. Verifica che i dispositivi funzionino, poi installa KNX Ultimate 8 e riavvia Node-RED. I nodi HUE e Matter che usano KNX mantengono il gateway esistente.

## Se l’installazione viene bloccata

L’installazione della versione 8 controlla i flow salvati e cerca vecchi nodi HUE e Matter, comprese configurazioni, schede disabilitate e subflow. Non basta installare i nuovi package: devi convertire e fare Deploy. Il controllo non copre ogni sistema di salvataggio personalizzato né le modifiche non salvate nell’editor: segui comunque i passaggi della migrazione.

Se hai aggiornato troppo presto, reinstalla KNX Ultimate 7 e riavvia Node-RED prima di migrare. Se necessario, ripristina il backup completo; non eliminare i nodi sconosciuti e non resettare gli abbinamenti Matter.

## Documentazione

- [KNX Utility]({{ '/wiki/it-KNX-Utility' | relative_url }})
- [HUE Ultimate](https://supergiovane.github.io/node-red-contrib-hue-ultimate/it/index.html)
- [Matter Ultimate](https://supergiovane.github.io/node-red-contrib-matter-ultimate/it/index.html)
- [Cerebrum Ultimate](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate#readme)
