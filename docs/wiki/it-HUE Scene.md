---
layout: wiki
title: "HUE Scene"
lang: it
permalink: /wiki/it-HUE%20Scene
---
Il nodo **Hue Scene** pubblica le scene Hue su KNX e può inoltrare gli eventi grezzi al flow di Node-RED. Il campo scena supporta l'autocompletamento; dopo aver creato nuove scene sulla bridge premi l'icona di aggiornamento per ricaricare l'elenco.

### Schede disponibili

- **Mappatura** - collega gli indirizzi di gruppo KNX alla scena selezionata. I DPT 1.xxx eseguono un richiamo booleano, mentre i DPT 18.xxx inviano un numero scena KNX.
- **Multi scena** - crea un elenco di regole che associano numeri scena KNX a scene Hue e definiscono se richiamarle come _active_, _dynamic\_palette_ o _static_.
- **Comportamento** - mostra/nasconde il pin di output del nodo. Senza un gateway KNX configurato il pin rimane comunque attivo, così gli eventi Hue raggiungono il flow.

### Impostazioni generali

| Proprietà | Descrizione |
|--|--|
| Gateway KNX | Gateway KNX che fornisce il catalogo delle GA per l'autocomplete. |
| Hue Bridge | Hue Bridge che ospita le scene. |
| Scena HUE | Scena da richiamare (autocomplete; il pulsante di refresh ricarica il catalogo). |

### Scheda Mappatura

| Proprietà | Descrizione |
|--|--|
| Richiama | Indirizzo KNX che richiama la scena. Usa DPT 1.xxx per un comando booleano o DPT 18.xxx per inviare un numero scena. |
| DPT | Datapoint usato per il richiamo (1.xxx oppure 18.001). |
| Nome | Etichetta descrittiva per la GA di richiamo. |
| # | Appare quando è selezionato un DPT scena KNX; scegli il numero scena da inviare. |
| GA stato | GA opzionale che indica se la scena è attualmente attiva (booleano). |

### Scheda Multi scena

| Proprietà | Descrizione |
|--|--|
| Richiama | GA KNX (DPT 18.001) che consente di selezionare le scene tramite numero. |
| Selettore scena | Lista modificabile che abbina numeri scena KNX a scene Hue e imposta la modalità di richiamo. Trascina le "grip” per riordinare. |

> ℹ️ Gli elementi KNX vengono mostrati solo dopo aver selezionato un gateway KNX. Le schede di mappatura restano nascoste finché non sono configurati sia bridge sia gateway.
