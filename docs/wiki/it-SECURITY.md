---
layout: wiki
title: "SECURITY"
lang: it
permalink: /wiki/it-SECURITY
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/SECURITY) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-SECURITY) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-SECURITY) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-SECURITY) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-SECURITY) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-SECURITY)
---
# Politica di sicurezza
L'automazione domestica non è uno scherzo.Si prega di considerare tutti i pericoli che coinvolgono l'uso di questo repository per controllare la casa o l'edificio.
Una sola luce che rimane accesa mentre non sei a casa, per esempio, \*\* può diventare un grave pericolo di fuoco \*\*. <br/>
Tutti i dispositivi incustoditi mettono a rischio il tuo edificio. <br/>
Per non parlare del fatto che, per la tua colpa o per un bug nel repository KNX-ultimo, un garage si chiude mentre un bambino è seduto in mezzo.
La \*\* Building Security \*\* deve essere la tua preoccupazione principale. <br/>
Si prega di utilizzare KNX-ultimo (ma è generalmente lo stesso per tutti i repository) solo per controllare gli attuatori che sono stati garantiti con altri mezzi certificati. <br/>
Per l'esempio sopra, la porta del garage deve essere fissata da un \*\* sistema meccanico o elettronico certificato \*\*, prevenendo danni a persone, animali o cose.
Lo sviluppatore del repository KNX-ultimo e tutti gli sviluppatori coinvolti in questo progetto, non sono in alcun modo responsabili per eventuali danni, come indicato nella licenza del MIT è possibile trovare \[qui](§url0§). <br/>
## Regole di automazione domestica
Nella mia esperienza, ho sviluppato alcune migliori pratiche \*\* per proteggere la mia casa da incendi, danni e rischi per terzi. <br/>
Alcune cose interessanti sono sotto, per te.Spero che lo apprezzi. <br/>
- Installa uno o più switch di alimentazione principali, che tagliano la potenza in tutta la casa mentre sei via, lasciando alimentato solo il numero minimo di dispositivi necessari (come il remirgorator, il pannello di allarme, il router Internet e così via).Se hai bisogno di un po 'di automazione mentre si è lontana, è possibile passare temporaneamente all'interruttore di alimentazione principale e riprendere l'accesso completo.Questo è degno di nota per evitare un possibile hacking della tua casa da parte di qualcuno che ha accesso, ad esempio, a un dispositivo IoT alimentato e sempre alimentato in modo improprio.
- Installa un router Internet ridondante utilizzando un'altra linea WAN, ad esempio una connessione LTE.Nel caso in cui tu abbia perso uno WAN, ne hai un altro a cui fare affidamento.
- Trova un modo per \*\* entrare \*\* nella tua casa, anche in caso di interruzioni di corrente (ad esempio, una chiave meccanica di Phisycal da qualche parte nel giardino).
- Trova un modo per \*\* uscire \*\* la tua casa, anche in caso di interruzioni di corrente (ad esempio, una chiave meccanical di Phisycal da qualche parte vicino alla porta principale).
- Trova un modo per \*\* sfuggire \*\* da casa tua in caso di allarme di bulgary o antincendio (ad esempio, per mezzo di una scala estensibile da un balcone).
- Utilizzare solo il sistema di sicurezza Bulgary/Fire professionale e certificato e comandalo da KNX.Sii consapevole, la parte KNX del tuo sistema di sicurezza, diventa un backdoor per possibili problemi.Non consentire mai mai al nodo KNX di disarmare il sistema di sicurezza senza password.Se si utilizza un touchscreen, evita la funzionalità \*\* Disarm \*\* Disarm \*\*.Crea pulsanti che simulano invece un pannello di sicurezza \*\* tastiera \*\* pressione.
- Installa un'emergenza medica \*\* Pushbutton KNX e mettilo, ad esempio, vicino al tuo letto.In caso di emergenza, avvisare automaticamente la tua famiglia o qualcuno che può aiutarti, accendi tutte le luci significative, crea un \*\* modello di ammissione visibile \*\* per i paramedici, sblocca le porte e il percorso per consentire loro di raggiungerti anche nel caso in cui diventi inconsapevole.Ripeti un messaggio audio per aiutare \*\* i paramedici equipaggiano \*\*, usando ad esempio i tuoi altoparlanti di Sonos, affermando \*\* come trovarti \*\* a casa tua, \*\* chi i genitori chiamarono \*\*, che preesistenti \*\* malattie \*\* hai.Puoi persino usare Alexa, Siri o Google Home per attivare questo pulsante KNX (vedi nella sezione di esempio del wiki), nel caso in cui tu abbia un colpo e non puoi muoverti.
- Installa un \*\* panico \*\* knx pushbutton
- Prendi in considerazione questo: non entrare mai nella tua casa in caso di forze e minaccia di farlo, specialmente se la tua famiglia è dentro.Una volta che sei dentro, \*\* l'autore del reato può fare quello che vuole \*\* e nessuno esterno può preoccuparsi di te.Installa un pulsante \*\* Panic \*\* da qualche parte vicino alle porte e ai garage esterni.
- Se hai installato sensori perimetrali esterni, illumina le ore a casa per mezzo di almeno 4 (uno per ogni angolo della tua casa) Proiettore LED potenti non appena qualcuno entra nel perimetro al tramonto o alla notte.
- Fai un annuncio tramite tastie di allarme non appena qualcuno apre una finestra, una porta esterna o cieco, anche se sei a casa.
## Ricorda: sei l'unico responsabile della sicurezza della tua proprietà.Segui la legge, considera questo nodo KNX-ultimo solo come aiuto per l'automazione, basarsi solo su dispositivi di automazione certificati e meccanicamente o elettronicamente.Pensa alla tua sicurezza.Pensa che qualcosa possa andare storto o fallire, quindi avere un backup e, per i rischi di guarigione e di sicurezza, avere un backup a doppia sicurezza.Solo allora puoi goderti la vita con l'aiuto e il divertimento dell'automazione domestica!
