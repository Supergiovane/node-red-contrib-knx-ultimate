---
layout: wiki
title: "HUE Bridge configuration"
lang: it
permalink: /wiki/it-HUE%20Bridge%20configuration
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Bridge%20configuration) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Bridge%20configuration) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Bridge%20configuration) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Bridge%20configuration) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Bridge%20configuration) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Bridge%20configuration)

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
| CONNECT | Avvia la registrazione e attende il pulsante di collegamento del bridge. La finestra si chiude automaticamente quando premi il pulsante; usa **CANCEL** per interrompere l'attesa. |
| Name | Nome del bridge letto dalla Hue Bridge dopo una connessione riuscita. |
| Username / Client Key | Credenziali restituite dalla Hue Bridge dopo l'abbinamento. Restano modificabili per consentire copia/incolla o l'inserimento manuale. |

![image.png](../img/hude-config.png)
