---
layout: wiki
title: "HUE Light"
lang: it
permalink: /wiki/it-HUE%20Light
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Light) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Light) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Light) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Light) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Light) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Light)

Questo nodo controlla le luci HUE (singole o raggruppate) e mappa comandi/stati su KNX.

**Generale**

| Proprietà | Descrizione |
|-|-|
|KNX GW |Seleziona il gateway KNX da utilizzare |
|Bridge Hue |Seleziona il ponte Hue da utilizzare |
|Nome |Luce Hue o gruppo da utilizzare. Le luci e i gruppi disponibili compaiono mentre digiti|

**Localizza dispositivo**

Il pulsante `Locate` (icona play) avvia una sessione di identificazione Hue per la risorsa selezionata. Quando la sessione è attiva il pulsante mostra l'icona stop e il bridge fa lampeggiare la luce — o tutte le luci del gruppo — ogni secondo. Premi di nuovo il pulsante per interrompere subito; in caso contrario la sessione termina automaticamente dopo 10 minuti.

**Opzioni**

Qui puoi scegliere gli indirizzi KNX per essere collegati ai comandi/stati della luce Avable Hue. 

Inizia a digitare nel campo GA (nome o indirizzo di gruppo) e i dispositivi disponibili compariranno mentre digiti.

**Interruttore**

| Proprietà | Descrizione |
|-|-|
|Controllo |Questo GA viene utilizzato per accendere/disattivare la luce della tonalità tramite un valore KNX booleano True/False |
|Stato |Collegalo all'indirizzo del gruppo di stato dell'interruttore della luce |

**Dim**

| Proprietà | Descrizione |
|-|-|
|Control Dim | Dim relativo della luce HUE. La velocità si imposta nella scheda **Behaviour** .|
|Controllo % |Cambia la luminosità della luce della tonalità assoluta (0-100%) |
|Stato % |Collegalo all'indirizzo del gruppo KNX di luminosità della luce |
|Dim Speed (ms) | Velocità di dimming in millisecondi. Vale per la luce e per il "tunable white”. Calcolata sul range 0%→100%.|
|Min Dim Luminosità |La luminosità minima che la lampada può raggiungere.Ad esempio, se si sta dimmulando la luce, la luce smetterà di attenuare la luminosità specificata.|
|Max Dim Brightness |La massima luminosità che la lampada può raggiungere.Ad esempio, se si sta dimmulando la luce, la luce smetterà di attenuare la luminosità specificata.|

**Tunable White**

| Proprietà | Descrizione |
|-|-|
|Control Dim | Cambia la temperatura del bianco con DPT 3.007 (velocità in **Behaviour** ). |
|Controllo % | Cambia la temperatura del bianco con DPT 5.001. 0 = caldo, 100 = freddo |
|Stato %| GA di stato temperatura (DPT 5.001). 0 = caldo, 100 = freddo |
|Controllo Kelvin | **DPT 7.600: ** imposta in Kelvin con range KNX 2000-6535 (convertito in mirek).
**DPT 9.002:** imposta in Kelvin con range HUE 2000-6535 (Ambiance da 2200). Possibili piccole variazioni per conversioni. |
|Stato Kelvin | **DPT 7.600: ** leggi in Kelvin via range KNX 2000-6535 (convertito).
**DPT 9.002:** leggi in Kelvin via range HUE 2000-6535 (Ambiance da 2200). Possibili piccole variazioni per conversioni. |
|Inverti Dim Direction |Inverte la direzione fioca.|

**RGB/HSV**

| Proprietà | Descrizione |
|-|-|
| **Sezione RGB** ||
|Controllo RGB | Cambia colore con tripla RGB (r,g,b); gestione gamut inclusa. L'invio colore accende la luce impostando colore/luminosità; con r,g,b=0 la luce si spegne |
|Stato RGB |L'indirizzo del gruppo di stato del colore della luce.DataPoint accettato è RGB Triplet (R, G, B) |
| **Sezione HSV** ||
|Color H Dim | Scorri la tonalità (HSV) con DPT 3.007; velocità in **Behaviour** |
|Stato H %|Stato del circolo cromatico HSV. |
|Control S Dim | Cambia saturazione con DPT 3.007; velocità in **Behaviour** |
|Stato S %|L'indirizzo del gruppo di stato di saturazione del colore chiaro. |
|Dim Speed ​​(MS) |La velocità di oscuramento, in millisecondi, dal basso alla scala superiore.|

Per controllare la "V” (luminosità) dell'HSV, usa i controlli standard nella scheda **Dim** .

**Effetti**

_Effetti base non HUE_

| Proprietà | Descrizione |
|-|-|
| Blink | _true_ fa lampeggiare la luce, _false_ ferma il lampeggio. Alterna acceso/spento; utile per segnalazioni. Funziona con tutte le luci HUE. |
| Color Cycle | _true_ avvia il ciclo colori, _false_ lo interrompe. Cambia casualmente il colore della luce HUE a intervalli regolari. Funziona con le luci HUE che supportano il colore. L'effetto parte dopo 10 secondi. |

_Effetti nativi HUE_

La tabella **Effetti nativi HUE** consente di associare valori KNX agli effetti supportati dalla lampada selezionata (per esempio `candle`, `fireplace`, `prism`). Ogni riga collega un valore KNX (booleano, numerico o testuale a seconda del datapoint scelto) a uno degli effetti esposti dal bridge. Dal lato KNX puoi:

- inviare il valore mappato per attivare l'effetto corrispondente;
- impostare facoltativamente un indirizzo di stato: il nodo restituisce il valore mappato quando il bridge Hue segnala un cambio di effetto; se non trova corrispondenze invia il nome grezzo dell'effetto (necessita di un DPT testuale, ad esempio 16.xxx).

**Comportamento**

|Proprietà |Descrizione |
|------------------------------------------------- |------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|Leggi lo stato all'avvio |Leggi lo stato della luce HUE all'avvio del nodo-rosso o al rosso nodo-rosso del nodo e invia quello stato al bus KNX |
|Stato di luminosità KNX |Aggiorna lo stato dell'indirizzo del gruppo di luminosità KNX, ogni volta che la lampada Hue viene accesa/disattivata.Le opzioni sono \*\* quando Hue Light è spento, inviare lo 0%.Quando accesa, ripristinare il valore precedente (comportamento KNX predefinito) \*\* e \*\* lasciano come (comportamento di tonalità predefinito) \*\*.Se si dispone di Dimmer KNX con stato di luminosità, come MDT, l'opzione suggerita è \*\*\*quando la luce della tonalità è disattivata, inviare lo 0%.Quando accesa, ripristinare il valore precedente (comportamento KNX predefinito) \*\*\* |
|Accendi comportamento |Imposta il comportamento delle luci quando acceso.Puoi scegliere tra comportamenti diversi. 
 \*\* Seleziona colore: \*\* La luce verrà accesa con il colore di tua scelta.Per cambiare il colore, fai clic sul selettore dei colori (sotto il controll&#x6F;_&#x53;eleziona colore_). 
 \*\* Seleziona temperatura e luminosità: \*\* La luce verrà accesa con la temperatura (kelvin) e la luminosità (0-100) di tua scelta. 
 \*\* Nessuna: \*\* La luce manterrà il suo ultimo stato.Nel caso in cui tu abbia abilitato l'illuminazione notturna, dopo la fine della notte, la lampada riprenderà lo stato del colore/temperatura/luminosità fissata al giorno.|
|Illuminazione notturna |Permette di impostare un particolare colore/luminosità della luce di notte.Le opzioni sono le stesse del giorno.È possibile selezionare una temperatura/luminosità o colore.Una temperatura accogliente di 2700 Kelvin, con una luminosità del 10% o 20%, è una buona scelta per la luce notturna del bagno |
|Giorno/notte |Seleziona l'indirizzo di gruppo utilizzato per impostare il comportamento giorno/notte.Il valore dell'indirizzo di gruppo è _true_ se giorno, _false_ se notturno.|
|Valore giorno/notte invertito |Inverti i valori dell'indirizzo di gruppo _day/night_.Il valore predefinito è \*\* non controllato **.|
|Leggi lo stato all'avvio |Leggi lo stato all'avvio ed emetti l'evento al bus KNX all'avvio/riconnessione.(Predefinito "no") |
|Forza modalità diurna |È possibile forzare la modalità diurna cambiando manualmente la luce come descritto qui: \*\* Passa alla modalità Day spostando rapidamente il Ligth OFF e poi solo questa luce) \*\* fa ciò che ha descritto e agisce solo su questa luce.** Passa alla modalità Day mediante rapido spegnimento del LIGTH OFF e quindi (applica tutti i nodi leggeri) \*\* agisce a tutti i nodi leggeri, impostando l'indirizzo del gruppo Day/Night in modalità Day.|
|Pin di input/output del nodo |Nascondi o mostra i pin di input/output.I pin di input/output consentono al nodo di accettare l'ingresso MSG dal flusso e inviare l'uscita MSG al flusso.L'MSG di input deve seguire gli standard API V.2 HUE.Questo è un esempio di MSG, che accende la luce: <code> msg.on = {"on": true} </code>.Fare riferimento alla \[pagina API HUE ufficiale](§url0§) |

### Nota

La funzione Dimming funziona in modalità \*\* KNX `start` e` stop` \*\*.Per iniziare a Dimming, invia solo un telegramma KNX "Start".Per smettere di oscurarsi, invia un telegramma KNX "Stop".Per favore \*\* ricorda che \*\*, quando imposti le proprietà del tuo muro.
