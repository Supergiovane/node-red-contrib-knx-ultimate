# Politica di sicurezza domotica
<a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/SECURITY.md"><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/flags/usa-today.png"/></a>
<a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/de-SECURITY.md"><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/flags/germany.png"/></a>
<a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/it-SECURITY.md"><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/flags/italy.png"/></a>

La domotica non è uno scherzo. Ti preghiamo di considerare tutti i pericoli connessi all'uso di questo repository per controllare la tua casa o edificio.
Una singola luce che rimane accesa mentre non sei in casa, ad esempio, **può diventare un serio pericolo di incendio**. <br/>
Tutti i dispositivi incustoditi mettono a rischio la tua casa. <br/>
Per non parlare del fatto che, per colpa tua o di un ERRORE nel repository knx-ultimate, le porte di un garage si possano chiudere mentre un bambino è seduto sotto.
La **sicurezza dell'edificio** deve essere la tua preoccupazione principale. <br/>
Per favore utilizza knx-ultimate (ma è generalmente lo stesso per TUTTI i repository) solo per controllare gli attuatori che sono stati resi sicuri con altri mezzi certificati. <br/>
Nell'esempio sopra, la porta del garage deve essere protetta da un **sistema meccanico o elettronico** CERTIFICATO, per prevenire danni a persone, animali o cose.
Lo sviluppatore del repository knx-ultimate e tutti gli sviluppatori coinvolti in questo progetto, non sono in alcun modo responsabili per eventuali danni, come indicato nella Licenza MIT che puoi trovare [qui](https://github.com/Supergiovane/node-red-contrib-KNX-ultimate/blob/master/LICENSE). <br/>


## Regole di domotica

Nella mia esperienza, ho sviluppato alcune **best practices** per proteggere la mia casa da incendi, danni e rischi per terzi. <br/>
Alcune cose interessanti sono qui sotto, per te. Spero che tu lo possa apprezzare. <br/>

* Installa uno o più interruttori di alimentazione principali, che interrompano l'alimentazione in tutta la casa mentre sei assente, lasciando alimentato solo il numero minimo di dispositivi necessari (come frigorifero, pannello di allarme, router Internet e così via). Se hai bisogno di un po 'di automazione mentre sei lontano, puoi temporaneamente accendere l'interruttore di alimentazione principale e riavere quindi l'accesso completo. Ciò è utile per evitare possibili hackeraggi della tua casa da parte di qualcuno che ha avuto accesso, ad esempio, a un dispositivo IOT protetto in modo improprio e sempre alimentato.
* Installa un router Internet ridondante utilizzando un'altra linea wan, ad esempio una connessione LTE. Nel caso in cui tu abbia perso una linea, ne hai un' altra a cui affidarti.
* Trova un modo per **entrare** nella tua casa, anche in caso di interruzioni di corrente (ad esempio, una chiave meccanica da qualche parte nel giardino).
* Trova un modo per **uscire** da casa tua, anche in caso di interruzioni di corrente (ad esempio, una chiave meccanica da qualche parte vicino alla porta principale).
* Trova un modo per **scappare** da casa tua in caso di ladri o allarme antincendio (ad esempio, tramite una scala estensibile da un balcone).
* Utilizza solo sistemi di allarme / antincendio professionali e certificati e comandali tramite KNX. Attenzione, la parte KNX del sistema di sicurezza diventa una backdoor per possibili problemi. Non consentire mai al nodo KNX di disinserire il sistema di sicurezza senza una password. Se usi un touchscreen, evita la funzionalità di **disinserimento premendo un pulsante singolo**. In alternativa, crea pulsanti che simulano la pressione di un tasto della **tastiera del tuo antifurto**.
* Installa un pulsante **di emergenza medica** KNX e mettilo, ad esempio, vicino al tuo letto. In caso di emergenza, esso avvisa automaticamente la tua famiglia o qualcuno che può aiutarti, accende tutte le luci significative, crea un **percorso di ingresso visibile** per i paramedici apre le porte per consentire loro di raggiungerti anche nel caso in cui tu possa perdere conoscenza. Ripeti un messaggio audio per aiutare **l'equipe di paramedici**, usando ad esempio i tuoi altoparlanti Sonos, indicando **come trovarti** nella tua casa (per esempio comunicando in quale stanza potresti essere), **quali parenti chiamare**, quali **malattie preesistenti** hai. Puoi persino usare Alexa, Siri o Google Home per attivare questo pulsante KNX (vedi nella sezione esempio delle wiki), nel caso tu abbia un ictus (sgrat sgrat) e non riesca a muoverti.
* Installa un pulsante **antipanico** KNX
* Prendi questa cosa in seria considerazione: non entrare mai in casa tua nel caso in cui qualcuno ti costringa e ti minacci di farlo, specialmente se la tua famiglia è dentro. Una volta dentro, **l'aggressore può fare tutto ciò che vuole** e nessuno fuori se ne potrà accorgere. Installa un pulsante **antipanico** da qualche parte vicino alle porte e ai garage esterni.
* Se hai installato sensori perimetrali esterni, illumina l'esterno della casa per mezzo di almeno 4 (uno per ogni angolo della tua casa) potenti proiettori a LED, non appena qualcuno entra nel perimetro al crepuscolo o di notte.
* Fai un annuncio tramite tastiere di allarme non appena qualcuno apre una finestra, una porta esterna o una tenda, anche se sei a casa.



## RICORDA: SEI L'UNICO RESPONSABILE DELLA SICUREZZA DELLA TUA PROPRIETÀ. SEGUIRE LA LEGGE, CONSIDERA QUESTO NODO KNX-ULTIMATE SOLO COME AIUTO PER L'AUTOMAZIONE, AFFIDATI SOLO A DISPOSITIVI DI AUTOMAZIONE CERTIFICATI RESI SICURI MECCANICAMENTE O ELETTRONICAMENTE. PENSA ALLA TUA SICUREZZA. PENSA CHE QUALCOSA POTREBBE ANDARE STORTO, QUINDI PREVEDI UN BACKUP E, PER DISPOSITIVI CHE METTONO A RISCHIO LA SALUTE E LA SICUREZZA, PREVEDI UN DOPPIO BACKUP. 