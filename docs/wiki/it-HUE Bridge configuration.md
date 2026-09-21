---
layout: wiki
title: "HUE Bridge configuration"
lang: it
permalink: /wiki/it-HUE%20Bridge%20configuration
---
## Aggiornamento a KNX Ultimate 8

La versione 7 aggiunge un piccolo pulsante **Aggiorna alla v8** nella parte alta di ogni editor. Il pulsante esegue il backup dei flow, installa i package HUE/Matter necessari, converte i nodi compatibili, esegue un Deploy completo, verifica i flow salvati e installa la versione 8. Quando richiesto, riavvia il servizio Node-RED: ricaricare soltanto il browser non basta. I nodi KNX AI legacy fermano la procedura automatica.

[Leggi la guida completa all’aggiornamento](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-Upgrade-to-v8)

<h1>PHILIPS HUE NODES

</h1>

  <img src='https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/huehub.jpg' width='40%'>

Questo nodo registra Node-RED presso l'Hue Bridge e ora gestisce automaticamente la procedura di abbinamento.

Inserisci l'IP del bridge (o scegli uno tra quelli individuati automaticamente) e premi **CONNECT**. L'editor continua a interrogare il bridge e chiude la finestra di attesa non appena premi il pulsante fisico di collegamento. Usa **CANCEL** se vuoi interrompere l'attesa e riprovare più tardi. I campi Username e Client Key restano sempre modificabili in modo da poter copiare o incollare le credenziali quando serve.

Hai già le credenziali? Fai clic su **HO GIÀ LE CREDENZIALI** per mostrare subito i campi e inserirle manualmente senza attendere il pulsante del bridge.

**Generale**

| Proprietà | Descrizione |
|--|--|
| IP | Inserisci l'IP fisso del tuo bridge Hue oppure seleziona uno tra quelli scoperti automaticamente. |
| CONNETTI | Avvia la registrazione e attende il pulsante di collegamento del bridge. La finestra si chiude automaticamente quando premi il pulsante; usa **CANCEL** per interrompere l'attesa. |
| Nome | Nome del bridge letto dalla Hue Bridge dopo una connessione riuscita. |
| Username | Username restituito dalla Hue Bridge dopo l'abbinamento. Il campo resta modificabile per consentire copia/incolla o l'inserimento manuale. |
| Client Key | Client Key restituita dalla Hue Bridge dopo l'abbinamento. Il campo resta modificabile per consentire copia/incolla o l'inserimento manuale. |

![image.png](../img/hude-config.png)
