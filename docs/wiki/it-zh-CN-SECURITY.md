---
layout: wiki
title: "zh-CN-SECURITY"
lang: it
permalink: /wiki/it-zh-CN-SECURITY
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/SECURITY) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-SECURITY) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-SECURITY) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-SECURITY) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-SECURITY) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-SECURITY)
---
# Politica di sicurezza
L'automazione domestica non è uno scherzo.Si prega di considerare tutti i pericoli coinvolti nell'uso di questo repository per controllare la casa o l'edificio.
Ad esempio, quando non sei a casa, una luce è accesa e **può diventare un serio pericolo per sparare** .<br/>
Tutte le attrezzature incustoditi mettono a rischio il tuo edificio.<br/>
Per non parlare del fatto che sia a causa della tua colpa o di un errore nel repository KNX-STUNTIM, la porta del garage è chiusa mentre il bambino è seduto in mezzo.
**La sicurezza dell'edificio** deve essere il tuo problema principale.<br/>
Si prega di utilizzare KNX-ultimo (ma di solito lo stesso per tutti i repository) per controllare solo attuatori garantiti con altri mezzi certificati.<br/> <br/>
Nell'esempio sopra, la porta del garage deve essere protetta da un sistema meccanico o elettronico certificato per prevenire danni a persone, animali o cose.
Lo sviluppatore del repository KNX-ATTIME e tutti gli sviluppatori coinvolti nel progetto non sono responsabili per eventuali danni, come indicato nella licenza del MIT, è possibile trovare \ [qui](§url0§).<br/> <br/>
## Regole di automazione domestica
Nella mia esperienza, ho sviluppato alcune migliori pratiche per proteggere la mia casa dai rischi di incendio, danni e rischi in terza persona.<br/>
Ecco alcune cose interessanti per te.Spero che lo apprezzi.<br/>
- Installa uno o più interruttori di alimentazione principali per tagliare l'intera casa quando non ci si è lì, lasciando solo un numero minimo di apparecchiature necessarie (come coperture, pannelli di allarme, router Internet, ecc.).Se hai bisogno di un po 'di automazione quando vai, è possibile attivare temporaneamente l'interruttore di alimentazione principale e riprendere l'accesso completo.Vale la pena evitare di hackerare la tua casa attraverso persone con accesso, come dispositivi IoT in modo improprio e sempre capaci.
- Utilizzare un'altra linea WAN per installare un router Internet ridondante, come la connessione LTE.Se perdi uno WAN, ne hai un altro su cui fare affidamento.
- Anche in un'interruzione di corrente (ad esempio, la chiave meccanical Phisycal da qualche parte nel giardino), anche a casa tua, trova un modo.
- Anche in caso di interruzione di corrente, puoi trovare un modo per uscire da \*\* casa (ad esempio, da qualche parte vicino al cancello, una chiave meccanical di Phisycal).
- Trova un modo per fuggire da casa quando si verifica un allarme di schiuma o antincendio (ad esempio attraverso una scala espandibile sul balcone).
- Utilizzare solo i sistemi di sicurezza/sicurezza antincendio professionali e certificati e quindi comandato da KNX.Si prega di notare che la parte KNX del sistema di sicurezza diventa il backdoor di possibili problemi.Non lasciare mai che i nodi KNX non siano sicuri del sistema di sicurezza senza password.Se si utilizza un touchscreen, evita di utilizzare la funzione **singolo pulsante ** .Crea pulsanti che simulano i pannelli di sicurezza**tastiera** Atserpion.
- Installa **Emergenza medica ** KNX Pushtton, ad esempio, posizionarlo vicino al letto.In caso di emergenza, la tua famiglia o qualcuno che può aiutarti a avvisare automaticamente tutte le luci importanti, creare una modalità di ammissione visibile**per i caregiver, sbloccare le porte e consentire loro di connettersi con te, anche se diventi sopraffatto.Ripeti un messaggio audio per aiutare il caregiver a equipaggiare, come usare i diffusori di Sonos, spiegare come trovarti a casa, i genitori chiamano ** , la tua malattia**La malattia \*\*di quale malattia soffri.Puoi anche innescare questo pulsante KNX con Alexa, Siri o Google Home (vedi la sezione di esempio del wiki) nel caso in cui tu abbia un ictus e non puoi muoverti.
- Installa un ** Pank** KNX Pushbutton
- Con questo in mente: non entrare nella tua casa se qualcuno lo costringe e ti minaccia di farlo, specialmente se la tua famiglia è dentro.Una volta entrato, il criminale può fare quello che vuole e nessuno esterno può preoccuparsi di te.Installa un pulsante \*\* panico \*\* vicino al dipartimento esterno e al garage.
- Se si dispone di sensori periferici periferici installati, una volta che qualcuno entra nel perimetro al crepuscolo o alla notte, puoi illuminare l'ora di almeno 4 (ogni angolo della tua casa) per tornare a casa.
- Anche se sei a casa, fai un annuncio tramite la tastiera di avviso quando qualcuno apre una finestra, una porta esterna o una finestra cieca.
## Ricorda: sei la sola responsabilità per la sicurezza della proprietà.Segui la legge, considera questo nodo in stile KNX solo con l'aiuto di automazione, basandosi esclusivamente su apparecchiature di automazione certificate, meccaniche o elettronicamente fisse.Considera la tua sicurezza.Pensa che qualcosa possa essere problematico o fallito, quindi avere un backup e per motivi di guarigione e rischi per la sicurezza, avere un backup a doppia sicurezza.Solo in questo modo puoi goderti la vita con l'aiuto e il divertimento dell'automazione domestica!
