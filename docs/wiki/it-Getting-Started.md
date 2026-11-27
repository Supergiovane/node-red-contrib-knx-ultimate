---
layout: wiki
title: "Primi passi"
lang: it
permalink: /wiki/it-Getting-Started
translation_key: "Getting-Started"
---

# Primi passi

Per una nuova installazione, segui i passaggi qui sotto. Se i tuoi flow usano già KNX Ultimate 7, completa prima la guida all’aggiornamento.

> [Passare dalla versione 7]({{ '/wiki/it-Migration-8' | relative_url }})

Servono Node.js 20.18.1 o successivo e Node-RED 3.1.1 o successivo.

1. In Node-RED, apri **Gestisci palette → Installa** e installa `node-red-contrib-knx-ultimate`. Riavvia Node-RED.

2. Trascina **KNX Device** nel flow. Aggiungi una configurazione gateway e inserisci indirizzo e parametri della tua interfaccia KNX. Importa gli indirizzi di gruppo ETS, se disponibili.

3. Scegli un indirizzo di gruppo del tuo impianto e il relativo datapoint. Per un comando acceso/spento usa il datapoint booleano previsto, ad esempio `1.001`.

4. Collega un nodo **Inject** con `msg.payload` booleano (`true` o `false`) a KNX Device. Collega l’uscita di KNX Device a **Debug** per vedere i telegrammi ricevuti.

5. Controlla l’indirizzo scelto e premi **Deploy**. Usa Inject per inviare il comando. Abilita **Reagisci all’evento Risposta** per vedere le risposte alle richieste di lettura.

## Il primo flow, passo per passo

L'animazione qui sotto costruisce un primo flow: un nodo **KNX Device** per l'indirizzo di gruppo `1/1/0` con datapoint `1.001`, la sua configurazione del gateway e un nodo **Debug**.

1. Trascina **KNX DEVICE** dalla palette nel flow e fai doppio clic.
2. Accanto a **Gateway** clicca **+**. La configurazione del gateway cerca le interfacce KNX/IP in rete: scrivi l'indirizzo della tua (qui `192.168.1.117`) e sceglila dall'elenco. Indirizzo, porta e protocollo vengono compilati. Clicca **Add**.
3. In **Group Addr.** scrivi `1/1/0`, dai un nome al nodo e lascia il datapoint `1.001 Switch`. Clicca **Done**.
4. Trascina un nodo **Debug** nel flow, collega l'uscita di KNX Device e clicca **Deploy**.

Quando il nodo mostra **Connected. On duty.**, ogni telegramma inviato a `1/1/0` sul bus compare nella barra laterale **Debug**.

![Creazione di un nodo KNX Device per l’indirizzo di gruppo 1/1/0, della configurazione del gateway e di un nodo Debug](/node-red-contrib-knx-ultimate/assets/getting-started/first-flow.gif)

## Leggere un valore dal bus

Abilita il pulsante manuale di KNX Device. Le azioni sono **Alterna valore booleano**, **Invia KNX Read** (seconda voce) e **Scrivi valore personalizzato**. Scegli Read e premi il pulsante per leggere l’indirizzo configurato. Questa azione non è disponibile in modalità universale. Dal flow puoi anche inviare `msg.readstatus = true`.

[KNX Device]({{ '/wiki/it-Device' | relative_url }}) · [KNX Gateway]({{ '/wiki/it-Gateway-configuration' | relative_url }}) · [Esempi]({{ '/wiki/it--SamplesHome' | relative_url }})

## Video tutorial

[Max Supervibe — YouTube](https://www.youtube.com/playlist?list=PL9Yh1bjbLAYrU8PsVhW4xzEug2WtVFv3E)
