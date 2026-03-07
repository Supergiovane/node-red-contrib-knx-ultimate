---
layout: wiki
title: "KNX-AI-Sidebar"
lang: it
permalink: /wiki/it-KNX-AI-Sidebar
---
La **Web Dashboard KNX AI** e' ora l'interfaccia ufficiale per l'analisi live dei tuoi nodi **KNX AI**: summary, anomalie, flow map e chat.
Questa pagina mantiene il nome storico `KNX-AI-Sidebar` per compatibilita'.

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/knx-ai-sidebar.svg" alt="KNX AI sidebar" style="width:100%;max-width:980px;border-radius:14px;box-shadow:0 12px 26px rgba(0,0,0,0.18);" />

## A cosa serve

- Leggere velocemente la summary prodotta dal nodo `knxUltimateAI` selezionato.
- Controllare le anomalie rilevate.
- Fare domande in chat (le risposte vengono renderizzate in Markdown) per velocizzare la diagnosi.

## Come si usa (in pratica)

1. Aprila dall'editor del nodo KNX AI con il pulsante **Open Web Page**.
2. In alternativa usa direttamente `/knxUltimateAI/sidebar/page` (opzionalmente con `?nodeId=<id>`).
3. Seleziona il nodo `knxUltimateAI` dal menu a tendina.
4. Usa **Auto** o refresh manuale e fai domande in chat.

## Rendi l’AI più “intelligente” (contesto extra)

Nel nodo `knxUltimateAI` selezionato puoi includere ulteriore contesto nel prompt dell’LLM:

- **Inventario flow:** permette all’AI di “vedere” quali nodi KNX Ultimate (e gateway) sono presenti nei tuoi flow, così può collegare i telegrammi alla logica.
- **Estratti documentazione:** aggiunge frammenti rilevanti da help/README/esempi (e `docs/wiki` quando disponibile) in modo che l’AI possa spiegare meglio i nodi e suggerire configurazioni corrette.

## Esempi di utilizzo (scenari umani)

- **Loop / telegrammi duplicati:** chiedi quali sono le cause più probabili e come isolare l’origine.
- **GA rumoroso:** chiedi perché un GA è tra i più attivi e quali sorgenti lo stanno scrivendo.
- **Comportamento strano dopo un deploy:** chiedi cosa è cambiato negli ultimi minuti e se sono comparsi pattern.
- **Problemi di routing tra gateway:** chiedi come filtrare/riscrivere i telegrammi per evitare tempeste o feedback loop.

## Esempi di domande da copiare in chat

- “Perché `2/4/2` è così attivo? Quali cause sono più probabili?”
- “Vedi pattern da loop tra due group address?”
- “Quali indirizzi fisici stanno scrivendo su `x/y/z` e con che frequenza?”
- “Che filtri metto nel Router Filter per fermare lo spam ma mantenere il traffico normale?”

## Requisiti

- Almeno un nodo `knxUltimateAI` nei tuoi flow.
- Il nodo `knxUltimateAI` selezionato deve essere collegato ad un gateway `knxUltimate-config`.
- Per le risposte LLM in chat: abilita l’LLM nel nodo `knxUltimateAI` e configura lì le credenziali (API key).
