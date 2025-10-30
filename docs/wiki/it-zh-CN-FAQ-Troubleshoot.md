🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/FAQ-Troubleshoot) | [IT](/node-red-contrib-knx-ultimate/wiki/it-FAQ-Troubleshoot) | [DE](/node-red-contrib-knx-ultimate/wiki/de-FAQ-Troubleshoot) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-FAQ-Troubleshoot) | [ES](/node-red-contrib-knx-ultimate/wiki/es-FAQ-Troubleshoot) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-FAQ-Troubleshoot)
<!-- NAV START -->
Navigazione: [Home](/node-red-contrib-knx-ultimate/wiki/it-Home)  
Panoramica: [Changelog](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/CHANGELOG.md) • [FAQ](/node-red-contrib-knx-ultimate/wiki/it-FAQ-Troubleshoot) • [Sicurezza](/node-red-contrib-knx-ultimate/wiki/it-SECURITY) • [Docs: Barra lingue](/node-red-contrib-knx-ultimate/wiki/it-Docs-Language-Bar)  
Nodo KNX Dispositivo: [Gateway](/node-red-contrib-knx-ultimate/wiki/it-Gateway-configuration) • [Dispositivo](/node-red-contrib-knx-ultimate/wiki/it-Device) • [Protezioni](/node-red-contrib-knx-ultimate/wiki/it-Protections)  
Altri Nodi KNX: [Scene Controller](/node-red-contrib-knx-ultimate/wiki/it-SceneController-Configuration) • [WatchDog](/node-red-contrib-knx-ultimate/wiki/it-WatchDog-Configuration) • [Logger](/node-red-contrib-knx-ultimate/wiki/it-Logger-Configuration) • [Global Context](/node-red-contrib-knx-ultimate/wiki/it-GlobalVariable) • [Alerter](/node-red-contrib-knx-ultimate/wiki/it-Alerter-Configuration) • [Controllo Carico](/node-red-contrib-knx-ultimate/wiki/it-LoadControl-Configuration) • [Viewer](/node-red-contrib-knx-ultimate/wiki/it-knxUltimateViewer) • [Auto Responder](/node-red-contrib-knx-ultimate/wiki/it-KNXAutoResponder) • [Traduttore HA](/node-red-contrib-knx-ultimate/wiki/it-HATranslator) • [IoT Bridge](/node-red-contrib-knx-ultimate/wiki/it-IoT-Bridge-Configuration)  
HUE: [Bridge](/node-red-contrib-knx-ultimate/wiki/it-HUE+Bridge+configuration) • [Luce](/node-red-contrib-knx-ultimate/wiki/it-HUE+Light) • [Batteria](/node-red-contrib-knx-ultimate/wiki/it-HUE+Battery) • [Pulsante](/node-red-contrib-knx-ultimate/wiki/it-HUE+Button) • [Contatto](/node-red-contrib-knx-ultimate/wiki/it-HUE+Contact+sensor) • [Aggiornamento SW](/node-red-contrib-knx-ultimate/wiki/it-HUE+Device+software+update) • [Sensore Luce](/node-red-contrib-knx-ultimate/wiki/it-HUE+Light+sensor) • [Movimento](/node-red-contrib-knx-ultimate/wiki/it-HUE+Motion) • [Scena](/node-red-contrib-knx-ultimate/wiki/it-HUE+Scene) • [Tap Dial](/node-red-contrib-knx-ultimate/wiki/it-HUE+Tapdial) • [Temperatura](/node-red-contrib-knx-ultimate/wiki/it-HUE+Temperature+sensor) • [Connettività Zigbee](/node-red-contrib-knx-ultimate/wiki/it-HUE+Zigbee+connectivity)  
Esempi: [Logger](/node-red-contrib-knx-ultimate/wiki/it-Logger-Sample) • [Switch Light](/node-red-contrib-knx-ultimate/wiki/-Sample---Switch-light) • [Dimming](/node-red-contrib-knx-ultimate/wiki/-Sample---Dimming) • [RGB color](/node-red-contrib-knx-ultimate/wiki/-Sample---RGB-Color) • [RGBW color + White](/node-red-contrib-knx-ultimate/wiki/-Sample---RGBW-Color-plus-White) • [Command a scene actuator](/node-red-contrib-knx-ultimate/wiki/-Sample---Control-a-scene-actuator) • [Datapoint 213.x 4x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT213) • [Datapoint 222.x 3x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT222) • [Datapoint 237.x DALI diags](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT237) • [Datapoint 2.x 1 bit proprity](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT2) • [Datapoint 22.x RCHH Status](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT22) • [Datetime to BUS](/node-red-contrib-knx-ultimate/wiki/-Sample---DateTime-to-BUS) • [Read Status](/node-red-contrib-knx-ultimate/wiki/-Sample---Read-value-from-Device) • [Virtual Device](/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device) • [Subtype decoded](/node-red-contrib-knx-ultimate/wiki/-Sample---Subtype) • [Alexa](/node-red-contrib-knx-ultimate/wiki/-Sample---Alexa) • [Apple Homekit](/node-red-contrib-knx-ultimate/wiki/-Sample---Apple-Homekit) • [Google Home](/node-red-contrib-knx-ultimate/wiki/-Sample---Google-Assistant) • [Switch on/off POE port of Unifi switch](/node-red-contrib-knx-ultimate/wiki/-Sample---UnifiPOE) • [Set configuration by msg](/node-red-contrib-knx-ultimate/wiki/-Sample-setConfig) • [Scene Controller node](/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node) • [WatchDog node](/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog) • [Global Context node](/node-red-contrib-knx-ultimate/wiki/SampleGlobalContextNode) • [Alerter node](/node-red-contrib-knx-ultimate/wiki/SampleAlerter) • [Load control node](/node-red-contrib-knx-ultimate/wiki/SampleLoadControl) • [Viewer node](/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer) • [MySQL, InfluxDB, MQTT Sample](/node-red-contrib-knx-ultimate/wiki/Sample-KNX2MQTT-KNX2MySQL-KNX2InfluxDB)  
Contribuisci alla Wiki: [Link](/node-red-contrib-knx-ultimate/wiki/it-Manage-Wiki)
<!-- NAV END -->
---
#Faq e risoluzione dei problemi
Grazie per aver usato il mio nodo rosso nodo!In caso di problemi, non preoccuparti: basta seguire l'elenco qui sotto per controllare l'articolo per articolo.KNX -ultimo è stato ampiamente utilizzato ed è stabile e affidabile.
Requisiti minimi: **node.js> = 16**
## il nodo non funziona
- Il [nodo di configurazione gateway è (/node-red-contrib-knx-ultimate/wiki/Gateway-configuration) (indicando il router KNX/IP o l'IP/porta dell'interfaccia) creato e configurato correttamente?
- KNX/IP **router ** :**host** compila `224.0.23.12`, porta` 3671`.
- Interfaccia KNX/IP * ***:** Host**compila l'IP del dispositivo (come `192.168.1.22`), porta` 3671`.
- Quando esistono più NICS ** (Ethernet/Wireless), specificare i NICS da utilizzare nel gateway o disabilitare Wi-Fi.Dopo la modifica, assicurati di ** riavviare il nodo rosso**.
- Utilizzare solo il router KNX/IP certificato o l'interfaccia IP/IP per evitare dispositivi "in uno/agente".
- Quando si utilizza l'interfaccia, è possibile abilitare il test "SUPPRESS ACK RICHIEST" nel gateway.
- Vedi "Ricevi solo / Impossibile inviare" di seguito.
- Se si esegue in un contenitore, ritardare l'avvio leggermente rosso nodo **(a volte la scheda di rete non è pronta).
## fermati dopo aver funzionato per un po '
- Fare riferimento alla sezione precedente "I nodi non possono funzionare".
- temporaneamente ** Spegnere la protezione delle inondazioni DDoS/UDP sullo switch/router** (può intercettare i pacchetti UDP di KNX).
- Collegare direttamente i dispositivi KNX/IP al test host rosso nodo.
- Evita le interfacce economiche o all -in e dai priorità al router ** KNX/IP** .
- Sii consapevole del limite di connessione simultanea quando si utilizza l'interfaccia (vedere Manuale del prodotto).Il router di solito non ha tale limitazione.
Configurazione ## KNXD
- ** KNXD** Quando sullo stesso host del nodo rosso, si consiglia l'interfaccia di utilizzare `127.0.0.1`.
- Controllare le tabelle di filtro e regolare di conseguenza l'indirizzo fisico della configurazione.
- Abilita "Echo ha inviato il messaggio a tutto il nodo con lo stesso indirizzo di gruppo" in gateway.
## ETS può vedere i messaggi, ma l'esecutore non ha risposta
Può essere in conflitto con altri plugin KNX.
- Rimuovere altri plug-in KNX dalla tavolozza rossa nodo, mantenendo solo KNX-ultimo (e rimuovi anche i nodi configurati nascosti).
- Accendi il test "SUPPRESS ACK RICHIEST" nel gateway quando si utilizza l'interfaccia.
## può ricevere solo, non inviare (o viceversa)
Il tuo router/interfaccia potrebbe avere il filtro abilitato.
- Consenti ** inoltro** in ETS; oppure regolare l'indirizzo fisico della configurazione in base alla tabella del filtro del router.
- Quando si utilizza ** KNXD** , si prega di controllare la tabella del filtro e regolare di conseguenza l'indirizzo fisico.
## Errore nel valore
- Utilizzare il punto dati corretto (temperatura: `9.001`).
- Importa CSV ETS in gateway per ottenere il DPT corretto.
- Evita due nodi usando lo stesso ga ** ma diverso DPT** .
## no "intercomunicazione" tra i nodi dello stesso GA
Comunemente presente nel tunneling/unicast (interfaccia, KNXD).
- Abilita "Echo ha inviato il messaggio a tutto il nodo con lo stesso indirizzo di gruppo" in gateway.
## Secure KNX Router/Interfaces
Non supportato quando la modalità sicura è abilitata; Se sono consentite connessioni non sicure, può funzionare correttamente.
- Chiudi il routing sicuro o consentire connessioni non sicure.
- Facoltativo: aggiungi una scheda di rete dedicata direttamente connessa al router KNX al rosso nodo e imposta "Bind to Local Interface" sul gateway.
- Le connessioni sicure potrebbero essere supportate in futuro.
## protezione delle inondazioni (protezione limite attuale)
Per evitare il sovraccarico dell'interfaccia utente e del bus: ogni nodo predefinito riceve fino a 120 messaggi all'interno di una finestra di 1 seconda.
- Utilizzare il nodo ** ritardo** per disperdere i messaggi.
- Filtra i valori duplicati usando ** rbe** .
[Dettagli](/node-red-contrib-knx-ultimate/wiki/Protections)
## DataPoint Avviso viene visualizzato dopo l'importazione di ETS
- Compila ETS (sottotipi, come `5.001`).
- oppure selezionare "Importa con un falso 1.001 DataPoint (non consigliato)" durante l'importazione o saltare il GA correlato.
## Protezione di riferimento circolare
Quando due nodi sono collegati direttamente con lo stesso GA out → In, il sistema lo disabiliterà per prevenire il loopback.
- Processo di regolazione: dividere questi due nodi o aggiungere nodi "mediazione/buffer".
- Abilita ** rbe** per evitare loopback.
[Dettagli](/node-red-contrib-knx-ultimate/wiki/Protections)
## Hai ancora problemi?
- Si consiglia di fare un problema (priorità) in [GitHub](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/issues).
- o inviami un messaggio privato su [KNX -USER -PERUM](https://knx-user-forum.de) (utente: thax74; per favore in inglese).