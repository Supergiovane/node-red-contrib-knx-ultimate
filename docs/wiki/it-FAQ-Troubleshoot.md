---
layout: wiki
title: "FAQ-Troubleshoot"
lang: it
permalink: /wiki/it-FAQ-Troubleshoot
---
---
# FAQ e Troubleshoot
Grazie per usare i miei nodi Node-RED! Se sei qui probabilmente hai un problema: niente panico, lo risolviamo. KNX-Ultimate funziona ed è ampiamente usato. Segui i punti sotto; in coda trovi come contattarmi.
Requisito minimo: **Node.js >= 16**
## Il nodo non funziona
- Hai creato il [Gateway configuration node](/node-red-contrib-knx-ultimate/wiki/Gateway-configuration) con IP/Port corretti verso il tuo KNX/IP Router o Interface?
- KNX/IP **Router ** : in**Host** metti l'indirizzo multicast KNX `224.0.23.12`, porta `3671`.
- KNX/IP **Interface ** : in**Host** metti l'IP dell'interfaccia (es. `192.168.1.22`), porta `3671`.
- Se hai **più interfacce di rete ** (es. Ethernet + Wi-Fi) indica quale usare nel Gateway oppure disabilita il Wi-Fi. Ricorda di**riavviare Node-RED** .
- Usa solo router/interfacce KNX/IP "puri” e certificati. Evita device "all-in-one” o proxy non dedicati al routing KNX/IP.
- Con interfaccia IP prova a disabilitare l'ACK selezionando "Suppress ACK request” nel Gateway.
- Vedi anche la sezione "Ricevo soltanto / Non invio”.
- Se Node-RED gira in container, ritarda l'avvio di Node-RED di qualche secondo: alcune NIC sono ancora down quando parte Node-RED.
## Dopo un po' smette di funzionare
- Rileggi "Il nodo non funziona”.
- Disabilita eventuale protezione DDOS/UDP flood su switch/router (può bloccare UDP KNX).
- Prova collegamento diretto tra PC e KNX/IP.
- Evita interfacce economiche/all-in-one: meglio un **KNX/IP Router** .
- Con interfacce IP verifica il limite connessioni contemporanee (manuale del produttore). I router non hanno questo limite.
## Configurazione knxd
- knxd sulla stessa macchina di Node-RED: usa `127.0.0.1` come interfaccia.
- Controlla le tabelle di filtro e adegua l'indirizzo fisico del config-node.
- Abilita in Gateway "Echo sent message to all node with same Group Address” (opzioni avanzate).
## In ETS vedo il telegramma ma l'attuatore non reagisce
Potresti avere altri plug-in KNX per Node-RED installati.
- Rimuovi tutti i plug-in KNX dalla palette lasciando solo KNX-Ultimate (rimuovi anche i config-node nascosti).
- Con interfacce IP prova "Suppress ACK request” nel Gateway.
## Ricevo solo i telegrammi, non invio (o viceversa)
Potrebbero esserci filtri attivi nel Router/Interface.
- In ETS abilita il **forwarding** in tutte le pagine del router oppure cambia l'indirizzo fisico del config-node in base alle tabelle di filtro.
- Con knxd controlla le tabelle di filtro e adegua l'indirizzo fisico.
## Valori errati dal nodo
- Usa il datapoint corretto (per temperatura `9.001`).
- Se possibile importa il CSV ETS nel Gateway: avrai sempre i DPT corretti.
- Verifica di non avere due nodi con **stesso GA ** ma**DPT diverso** .
## Messaggi tra nodi con lo stesso GA non si propagano
Accade con connessioni tunneling/unicast (KNX/IP Interface o knxd).
- Abilita "Echo sent message to all node with same Group Address” nel Gateway (opzioni avanzate).
## Secure KNX Router/Interfaces
In modalità secure non funzionano; funzionano se consenti connessioni non secure.
- Disattiva il routing secure o consenti connessioni non secure.
- Per maggiore isolamento, collega una seconda NIC dedicata tra Node-RED e il Router KNX, e imposta "Bind to local interface” sul Gateway.
- La connessione secure potrà essere implementata in futuro.
## Flood protection
Evita di saturare l'UI e il BUS limitando i msg in ingresso al nodo a max 120/secondo (finestra 1s).
- Inserisci un nodo **delay** per spalmare i messaggi.
- Usa il filtro **RBE** per scartare valori invariati.
  [Dettagli](/node-red-contrib-knx-ultimate/wiki/Protections)
## Avvisi sui Datapoint dopo import ETS
In ETS i DPT sono fondamentali per una corretta codifica/decodifica.
- Aggiungi i DPT mancanti in ETS (subtype incluso, es. `5.001`).
- In alternativa, in import imposta "Import with a fake 1.001 datapoint (Not recommended)” o salta i GA coinvolti.
## Protezione da riferimenti circolari
Evita loop tra due nodi con lo stesso GA collegando direttamente output→input.
- Rivedi il flow: separa i due nodi o inserisci un "moderatore”.
- Attiva RBE per evitare rimbalzi.
  [Dettagli](/node-red-contrib-knx-ultimate/wiki/Protections)
## Ho ancora problemi
- Apri una issue su [GitHub](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/issues) (preferita).
- Oppure PM su [Knx-User-Forum](https://knx-user-forum.de) (utente: TheMax74; scrivi in inglese).
## La protezione delle inondazioni entra in gioco.Che diavolo è quello?
La protezione delle inondazioni evita che l'interfaccia utente rosso nodo non risponda, a causa di una quantità troppo elevata di messaggi inviati al pin di input TE del nodo in un periodo di tempo specificato di 1 secondo. <br/>
Il numero massimo di msg che puoi inviare a un nodo è 120 al secondo.Se è necessario inviare un sacco di MSG al nodo, si prega di considerare un nodo "ritardo", per ritardare un po 'ogni messaggio. <br/>
\[Vedi qui](§url0§)
- Rivedi il tuo flusso.Invia meno messaggi al nodo o usa un nodo \*\* ritardo \*\*.
- Usa il filtro RBE, per scartare i messaggi con il payload uguale al payload del nodo corrente.
## Ho importato il file ETS ma ci sono avvertimenti sui punti dati
In un'installazione ETS, l'impostazione di dati è obbligatoria, almeno per uno professionale. <br/>
Con DataPoints, tutti i dispositivi di visualizzazione e controllo sanno come gestire il telegramma e come eseguire una decondinf giusta di valori. <br/>
Vedrai che tutti i dispositivi, il software di controllo, i sistemi di visualizzazione e tutto il mondo KNX necessitano di punti dati, quindi perché non ringraziare KNX-ultimo, per costringerti a correggere finalmente l'installazione di ETS, che aspetta così a lungo per essere risolto?:-) <br/>
- Metti una cuffia sulla testa, con buona musica, apri ET e inizia ad aggiungere punti dati.
- Oppure ... Importa il file ETS selezionando l'opzione "Se l'indirizzo di gruppo non ha un punto dati", per "importare con un punto dati falso 1.001 (non consigliato)" o per saltare DataPoint interessato.
- Ricorda di impostare il punto completo di dataPoint (tipo principale + sottotipo), altrimenti l'importatore imposterà un sottotipo .001 predefinito.Si prega di consultare questa immagine! \[Pic di sottotipo](§url0§)
## La protezione circolare di riferimento entra in gioco.Che diavolo è quello?
La protezione di riferimento circolare evita che l'interfaccia utente rossa del nodo non risponde e l'installazione KNX sia inondata, disabilitando due nodi con lo stesso collegamento dell'indirizzo di gruppo Toghether. <br/>
Ad esempio, se si collega l'output \*\* \*\* il pin di un nodo con indirizzo di gruppo 0/1/1, al ping \*\* input \*\* di un altro nodo con lo stesso indirizzo di gruppo 0/1/1, la protezione entrerà in entrata. <br/>
\[Vedi qui](§url0§)
- Rivedi il tuo flusso.Staccare i due nodi identici o fuori qualcosa in mezzo, agendo come "moderatore".
- Usa il filtro RBE, per scartare i messaggi con il payload uguale al payload del nodo corrente.
## Ho ancora problemi
### Usa uno dei canali qui sotto per raggiungermi (preferisco GitHub)
- Apri un problema su \[github](§url0§).Ogni volta che apri un problema, ricevo un'e -mail e posso risolverlo immediatamente.
- Inviami un PM su \[KNX-UNER-FORUM](§url0§).Sono qui come argomento.Il mio tedesco non è così bravo, quindi per favore scrivi in ​​inglese!
