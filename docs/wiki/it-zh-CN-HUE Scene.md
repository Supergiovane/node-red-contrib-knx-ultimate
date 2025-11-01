---
layout: wiki
title: "zh-CN-HUE Scene"
lang: it
permalink: /wiki/it-zh-CN-HUE%20Scene/
---
---
Il nodo **Hue Scene** pubblica la scena Hue su KNX e può inviare eventi originali di Hue al processo rosso nodo. I campi di scena supportano il completamento automatico;Dopo aver aggiunto nuove scene al ponte, fare clic sull'icona di aggiornamento per aggiornare l'elenco.
Panoramica della scheda ###
- **Mappatura** - Associa l'indirizzo del gruppo KNX alla scena della tonalità selezionata.DPT 1.xxx viene utilizzato per il controllo booleano e DPT 18.xxx viene utilizzato per inviare numeri di scena KNX.
- **Scenari multipli** - Costruisci un elenco di regole, mappa diversi numeri di scena KNX per accontentare le scene e selezionare il metodo di chiamata di _active_ / _dynamic \ _parlette_ / _static_.
- **Comportamento** - Controlla se viene visualizzato il pin di uscita rosso -rosso.Quando il gateway KNX non è configurato, il pin rimane abilitato in modo che l'evento Bridge continui ad entrare nel processo.
### impostazioni generali
| Proprietà | Descrizione |
|-|-|
| KNX GW | Un gateway KNX che fornisce directory di indirizzi di completamento automatico.|
| Bridge Hue | Hue Bridge che ospita la scena. |
| SCENA HUE |Scena da chiamare (il completamento automatico è supportato; il pulsante di aggiornamento riprenderà l'elenco).|
Scheda di mappatura ###
| Proprietà | Descrizione |
|-|-|
| Ricorda Ga | Chiama l'indirizzo del gruppo KNX della scena.Utilizzare DPT 1.xxx per inviare un valore booleano o utilizzare DPT 18.xxx per inviare un numero di scena KNX.|
| Dpt | Il tipo di punto dati utilizzato con un GA di richiamo (1.xxx o 18.001). |
| Nome |Nome dell'istruzione per richiamare GA. |
| # |Visualizzato quando viene selezionata la scena KNX DPT, utilizzata per selezionare il numero di scena da inviare.|
| Stato GA | Opzionale GA booleano al feedback se la scena è attiva.|
Scheda ### multi-scene
| Proprietà | Descrizione |
|-|-|
| Ricorda Ga | Usa GA di DPT 18.001 per selezionare una scena per numero di scena KNX. |
| Elenco delle scene |Elenco modificabile per corrispondere al numero della scena KNX alla scena Hue e alla sua modalità chiamata.Drag bar da riordinare. |
> ℹ️ I controlli relativi a KNX verranno visualizzati solo dopo aver selezionato il gateway KNX; La scheda di mappatura rimarrà nascosta fino a quando non saranno configurati sia il ponte Hue che il gateway KNX.
