---
layout: wiki
title: "Aggiornamento a KNX Ultimate 8"
lang: it
permalink: /wiki/it-Upgrade-to-v8
---
# Aggiornamento a KNX Ultimate 8

La versione 7 mostra un piccolo pulsante **Aggiorna alla v8** nella parte alta dell’editor di ogni nodo KNX Ultimate. Un’unica procedura guidata esegue la migrazione; non installare prima la versione 8 manualmente.

## Cosa fa il pulsante

1. Scarica un backup JSON di tutti i flow presenti nell’editor. Come nell’esportazione standard di Node-RED, il file non contiene le credenziali protette, che restano comunque archiviate da Node-RED.
2. Installa HUE Ultimate e/o Matter Ultimate soltanto se nei flow sono presenti nodi che richiedono quei package.
3. Converte sul posto i nodi KNX Utility, HUE e Matter compatibili, conservando ID, collegamenti, gruppi, riferimenti alle configurazioni e archivio Matter.
4. Esegue un Deploy completo e rilegge i flow salvati da Node-RED. KNX Ultimate 8 viene installato solo se non rimane alcun tipo di nodo rimosso.
5. Chiede di riavviare il servizio Node-RED. Il riavvio è obbligatorio: ricaricare soltanto il browser non basta.

All’avvio della procedura la finestra del nodo corrente viene chiusa; salva quindi prima le eventuali modifiche fatte nel form. L’account deve poter leggere e distribuire i flow e installare/aggiornare i moduli della palette.

Se è già installata una vecchia versione del package separato HUE Ultimate o Matter Ultimate, il pulsante ne prepara prima l’aggiornamento e richiede un riavvio preliminare del servizio. Ricarica l’editor e premi nuovamente il pulsante; in questo passaggio preliminare nessun flow viene modificato. Una normale installazione della versione 7 non richiede questo riavvio aggiuntivo.

## Arresti di sicurezza

La procedura si ferma prima di modificare qualsiasi cosa se trova un flow bloccato, un nodo sconosciuto o non valido estraneo alla migrazione oppure un vecchio nodo KNX AI / KNX AI Home Assistant. Le impostazioni AI non possono essere convertite in modo sicuro in Cerebrum Ultimate: sostituisci o rimuovi manualmente quei rari nodi e avvia di nuovo il pulsante.

Se l’installazione di un package fallisce prima del Deploy, la conversione nell’editor viene annullata. Se invece il flow convertito è già stato distribuito ma l’installazione di KNX Ultimate 8 fallisce, la versione 7 e i package separati restano utilizzabili: risolvi l’errore indicato e premi nuovamente il pulsante.

Se la richiesta di un package scade e potrebbe essere ancora in corso, non eseguire Deploy: riavvia il servizio Node-RED, ricarica l’editor e premi nuovamente il pulsante.

Se un’interruzione della connessione rende impossibile verificare l’esito del Deploy, la procedura non presume il risultato e non esegue un rollback automatico. Ricarica l’editor e controlla i flow salvati prima di riprovare. Se invece un altro editor ha cambiato la revisione dei flow, viene annullata localmente soltanto la conversione automatica: controlla o esporta le modifiche locali già presenti, quindi ricarica l’editor.

Node-RED può essere eseguito come servizio di sistema, container Docker, add-on Home Assistant o tramite altri supervisori; per questo l’editor non può impartire un unico comando di riavvio sicuro in ogni ambiente.
