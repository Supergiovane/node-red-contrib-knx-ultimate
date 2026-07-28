# Lezione YouTube — Messaggi di input per Matter Controller e Matter Bridge

Data della lezione: **28 giugno 2026**

## Obiettivo

Mostrare in modo pratico come un flow Node-RED può:

1. comandare e leggere un dispositivo Matter reale tramite **Control Matter from KNX (BETA)**;
2. aggiornare lo stato di un dispositivo KNX/virtuale esposto a Matter tramite **Expose KNX to Matter (BETA)**;
3. distinguere chiaramente i formati dei messaggi, che non sono uguali nei due casi.

La regola da ricordare durante tutta la lezione è:

> **Controller:** il flow comanda o legge un dispositivo Matter reale.
> **Bridge:** il flow aggiorna lo stato Matter di un dispositivo che KNX-Ultimate espone ad Alexa, Google Home, Apple Home o altri controller.

---

## 1. Quali nodi ricevono davvero i messaggi

I nodi di configurazione **Matter Controller** e **Matter Bridge** gestiscono connessione, fabric, storage e associazioni, ma non sono i nodi a cui collegare direttamente un Inject.

I messaggi vanno inviati ai nodi operativi:

- **Control Matter from KNX (BETA)**: KNX-Ultimate agisce come controller e pilota un dispositivo Matter reale;
- **Expose KNX to Matter (BETA)**: KNX-Ultimate espone a Matter un dispositivo KNX o virtuale.

Nel nodo operativo occorre abilitare i **PIN input/output** e fare il deploy.

Per la lezione è utile mantenere sempre collegato un nodo **Debug completo**:

- all'output del nodo Matter;
- all'uscita di eventuali Function usate per costruire i messaggi;
- impostato su **complete msg object**.

---

# Parte A — Control Matter from KNX

## 2. Il formato dipende dal profilo selezionato

Il nodo **Control Matter from KNX** sceglie automaticamente un profilo in base alle capability dell'endpoint:

- luce;
- endpoint mappato, per esempio presa, sensore, tapparella, termostato o ventilatore;
- serratura;
- Modalità Universale.

I relativi messaggi di input sono differenti.

---

## 3. Profilo luce

Per una luce, il messaggio usa direttamente proprietà in stile stato luce. Non mettere questi dati dentro `msg.payload`.

### Accensione

In un nodo Function:

```javascript
msg.on = { on: true };
return msg;
```

### Spegnimento

```javascript
msg.on = { on: false };
return msg;
```

### Luminosità al 65%

```javascript
msg.dimming = { brightness: 65 };
return msg;
```

### Accensione, luminosità e bianco caldo insieme

```javascript
msg.on = { on: true };
msg.dimming = { brightness: 60 };
msg.color_temperature = { mirek: 370 };
return msg;
```

`mirek` è l'inverso della temperatura Kelvin:

```text
mirek = 1.000.000 / Kelvin
```

Esempi indicativi:

| Kelvin | Mirek |
| -----: | ----: |
| 2700 K |   370 |
| 3000 K |   333 |
| 4000 K |   250 |
| 6500 K |   154 |

### Colore XY

```javascript
msg.on = { on: true };
msg.dimming = { brightness: 80 };
msg.color = {
  xy: {
    x: 0.675,
    y: 0.322,
  },
};
return msg;
```

Il nodo converte lo stato luce nel comando Matter adatto alle capability dell'endpoint.

### Errore tipico

Questo messaggio non è il formato previsto dal profilo luce:

```javascript
msg.payload = { on: true }; // Non usare questo formato per una luce
return msg;
```

---

## 4. Endpoint mappati

Per prese, attuatori, sensori, tapparelle, termostati, ventilatori e altri endpoint mappati è disponibile un formato semplice, uguale a quello del Matter Bridge:

```javascript
msg.payload = {
  function: "position",
  value: 35,
};
return msg;
```

Il nodo conosce già Node ID ed Endpoint ID e traduce internamente la funzione nel cluster, comando o attributo corretto.

### 4.1 La scheda “Input dal flow”

Dopo aver selezionato il dispositivo, apri la scheda **Input dal flow** nell'editor del nodo. La scheda, integrata nelle TAB del nodo, mostra:

- solo le funzioni realmente annunciate dall'endpoint;
- esempi pronti con pulsante **Copia**;
- l'Endpoint ID selezionato;
- tutti gli attributi leggibili e scrivibili;
- tutti i comandi accettati;
- i messaggi Matter avanzati equivalenti.

Ricorda di abilitare i **PIN di Input/Output del nodo**.

### 4.2 Formato semplice consigliato

Esempi di scrittura:

```javascript
msg.payload = { function: "onoff", value: true };
return msg;
```

```javascript
msg.payload = { function: "fanspeed", value: 60 };
return msg;
```

```javascript
msg.payload = { function: "setpoint", value: 21.5 };
return msg;
```

Per leggere, ometti `value`:

```javascript
msg.payload = { function: "temperature" };
return msg;
```

La risposta arriva in `msg.payload` usando unità comprensibili; `msg.matter` conserva endpoint, cluster, attributo e valore Matter raw.

### 4.3 Formato Matter avanzato

Il formato precedente resta disponibile per compatibilità e per i casi avanzati. I selettori vanno direttamente nel `msg`:

```text
msg.clusterId
msg.attribute oppure msg.command
msg.value oppure msg.args
msg.endpointId               opzionale
msg.requestFromRemote        opzionale
```

Se `msg.endpointId` non è presente, viene usato l'endpoint scelto nell'editor del nodo.

#### Leggere un attributo dalla cache

Esempio: attributo `onOff` del cluster On/Off:

```javascript
msg.clusterId = 6;
msg.attribute = "onOff";
return msg;
```

Il valore letto viene emesso dall'output in:

```text
msg.payload
```

Il nodo aggiunge anche:

```javascript
msg.matter = {
  source: "inputRead",
  nodeId: "...",
  endpointId: 1,
  clusterId: 6,
  attribute: "onOff",
};
```

#### Forzare una lettura dal dispositivo

Per non usare il valore in cache:

```javascript
msg.clusterId = 6;
msg.attribute = "onOff";
msg.requestFromRemote = true;
return msg;
```

La lettura remota può essere più lenta e può fallire se il dispositivo è offline.

#### Scrivere un attributo

Per la scrittura occorre aggiungere `msg.value`.

Esempio: setpoint riscaldamento a 21,5 °C:

```javascript
msg.clusterId = 513;
msg.attribute = "occupiedHeatingSetpoint";
msg.value = 21.5;
return msg;
```

Nel profilo mappato si usano unità amichevoli: il nodo converte `21.5` °C nei centesimi di grado richiesti da Matter.

Esempio: ventilatore al 60%:

```javascript
msg.clusterId = 514;
msg.attribute = "percentSetting";
msg.value = 60;
return msg;
```

#### Invocare un comando

Per un comando si usano:

```text
msg.clusterId
msg.command
msg.args
```

Nel profilo mappato, per i cluster conosciuti `msg.args` contiene il valore in unità amichevoli e il nodo costruisce gli argomenti Matter completi.

#### Accendere

```javascript
msg.clusterId = 6;
msg.command = "on";
msg.args = true;
return msg;
```

#### Spegnere

```javascript
msg.clusterId = 6;
msg.command = "off";
msg.args = false;
return msg;
```

#### Luminosità al 50%

```javascript
msg.clusterId = 8;
msg.command = "moveToLevelWithOnOff";
msg.args = 50;
return msg;
```

#### Portare una tapparella al 35%

```javascript
msg.clusterId = 258;
msg.command = "goToLiftPercentage";
msg.args = 35;
return msg;
```

#### Fermare una tapparella

```javascript
msg.clusterId = 258;
msg.command = "stopMotion";
return msg;
```

#### Identify per 15 secondi

Il profilo converte il comando `identify` nella richiesta prevista dal nodo, con una durata di 15 secondi:

```javascript
msg.clusterId = 3;
msg.command = "identify";
return msg;
```

Per altri cluster non gestiti dalle conversioni note, un oggetto in `msg.args` viene inoltrato come argomento del comando. La forma dell'oggetto deve rispettare il comando Matter effettivamente pubblicizzato dal dispositivo: il nodo non inventa capability mancanti.

### Cluster ID utili durante la lezione

| Cluster                       | ID decimale |
| ----------------------------- | ----------: |
| Identify                      |           3 |
| On/Off                        |           6 |
| Level Control                 |           8 |
| Power Source / batteria       |          47 |
| Boolean State                 |          69 |
| Electrical Power Measurement  |         144 |
| Electrical Energy Measurement |         145 |
| Door Lock                     |         257 |
| Window Covering               |         258 |
| Thermostat                    |         513 |
| Fan Control                   |         514 |
| Color Control                 |         768 |
| Illuminance Measurement       |        1024 |
| Temperature Measurement       |        1026 |
| Relative Humidity Measurement |        1029 |
| Occupancy Sensing             |        1030 |

---

## 5. Serratura

Il profilo Door Lock ha un input semplificato.

### Bloccare

```javascript
msg.payload = { function: "lock", value: true };
return msg;
```

Resta compatibile anche il formato precedente:

```javascript
msg.payload = true;
return msg;
```

oppure:

```javascript
msg.payload = { locked: true };
return msg;
```

### Sbloccare

```javascript
msg.payload = { function: "lock", value: false };
return msg;
```

Resta compatibile anche:

```javascript
msg.payload = false;
return msg;
```

oppure:

```javascript
msg.payload = { locked: false };
return msg;
```

Se l'endpoint richiede una credenziale per operazioni remote, il PIN deve essere configurato nel nodo. I comandi non annunciati dall'endpoint vengono rifiutati.

---

## 6. Modalità Universale

La Modalità Universale consente di lavorare con qualsiasi nodo ed endpoint commissionato. Qui bisogna specificare anche `nodeId` ed `endpointId`.

I selettori possono stare:

- direttamente in `msg`;
- dentro `msg.matter`.

Non vanno normalmente messi in `msg.payload`, fatta eccezione per l'azione `getAllBatteries`.

### 6.1 Comando On

```javascript
msg.nodeId = "2";
msg.endpointId = 13;
msg.clusterId = 6;
msg.command = "on";
msg.args = {};
return msg;
```

### 6.2 Comando Level Control in formato Matter nativo

```javascript
msg.nodeId = "2";
msg.endpointId = 13;
msg.clusterId = 8;
msg.command = "moveToLevelWithOnOff";
msg.args = {
  level: 127,
  transitionTime: 0,
  optionsMask: {},
  optionsOverride: {},
};
return msg;
```

In Modalità Universale gli argomenti sono Matter nativi: `127` è circa il 50% della scala Matter `0–254`.

### 6.3 Leggere un attributo

```javascript
msg.nodeId = "2";
msg.endpointId = 13;
msg.clusterId = 6;
msg.attribute = "onOff";
return msg;
```

Per forzare la lettura remota:

```javascript
msg.requestFromRemote = true;
return msg;
```

### 6.4 Scrivere un attributo in unità Matter native

```javascript
msg.nodeId = "2";
msg.endpointId = 1;
msg.clusterId = 513;
msg.attribute = "occupiedHeatingSetpoint";
msg.value = 2150;
return msg;
```

In Modalità Universale `2150` significa 21,50 °C perché il valore è espresso nei centesimi di grado Matter.

### 6.5 Selettori dentro `msg.matter`

```javascript
msg.matter = {
  nodeId: "2",
  endpointId: 13,
  clusterId: 6,
  command: "off",
  args: {},
};
return msg;
```

### 6.6 Richiedere l'inventario delle batterie

Nel servizio Monitor batterie:

```javascript
msg.payload = {
  action: "getAllBatteries",
};
return msg;
```

L'output restituisce in `msg.payload` un array con dispositivi, endpoint, percentuale, livello di carica, sostituibilità, tensione e indicazione di batteria scarica.

---

## 7. Dispositivo Matter non disponibile

Ogni dispositivo associato dispone di una propria coda di comandi. Se più nodi **Control Matter from KNX** ascoltano lo stesso indirizzo di gruppo KNX, un dispositivo Matter offline, in timeout o rimosso non blocca quindi i comandi diretti agli altri dispositivi.

Quando un nodo non riesce più a raggiungere il dispositivo selezionato:

1. mostra uno stato rosso di dispositivo Matter non disponibile;
2. mantiene lo stato di errore, invece di nasconderlo al comando successivo;
3. ignora temporaneamente i nuovi comandi provenienti sia da KNX sia dal flow;
4. riprende automaticamente l'attività non appena lo stesso dispositivo Matter segnala nuovamente lo stato `connected`.

Non occorre aprire l'editor o fare un nuovo deploy quando il dispositivo torna online: la riattivazione automatica è il comportamento normale.

L'apertura dell'editor del nodo azzera comunque il blocco e consente un tentativo manuale. Questa possibilità è utile dopo aver corretto la configurazione o quando si vuole verificare immediatamente un dispositivo che non ha ancora notificato la riconnessione.

### Dispositivo temporaneamente offline

Per una presa scollegata dall'alimentazione:

```text
comando KNX → nodo rosso e comando rifiutato
presa nuovamente alimentata → Matter segnala connected
comando KNX successivo → eseguito normalmente
```

I comandi ricevuti durante il periodo offline vengono ignorati e non sono riprodotti in ritardo alla riconnessione.

### Dispositivo rimosso dal fabric

Se il dispositivo è stato rimosso dalle associazioni del Matter Controller ma il relativo nodo operativo è ancora nel flow, il comando viene rifiutato immediatamente con **Device no longer commissioned**.

In questo caso la riconnessione automatica non è possibile, perché quel Node ID non appartiene più al fabric. Occorre:

- associare nuovamente il dispositivo e selezionarlo nel nodo;
- oppure eliminare dal flow il nodo Controller rimasto orfano.

### Demo consigliata con due dispositivi sullo stesso GA

1. configura due nodi Controller con lo stesso GA di comando;
2. verifica che entrambi reagiscano;
3. spegni o disconnetti uno dei due dispositivi Matter;
4. invia nuovamente il comando KNX e mostra che l'altro dispositivo continua a rispondere;
5. riaccendi il dispositivo offline;
6. attendi la riconnessione Matter e verifica che anche il nodo rosso riprenda automaticamente.

---

# Parte B — Expose KNX to Matter

## 8. Contratto unico dell'input Bridge

Il nodo **Expose KNX to Matter** usa sempre questo formato:

```javascript
msg.payload = {
  function: "nomeFunzione",
  value: valore,
};
return msg;
```

È accettato anche l'alias `fn`, ma per chiarezza nella lezione conviene usare sempre `function`.

Esempio equivalente:

```javascript
msg.payload = {
  fn: "onoff",
  value: true,
};
return msg;
```

L'input aggiorna lo stato esposto a Matter **senza scrivere sul bus KNX**. Serve per:

- riportare a Matter uno stato calcolato nel flow;
- costruire un dispositivo solo-flow;
- aggiornare Alexa, Google Home o Apple Home dopo una risposta proveniente da un'API;
- simulare sensori durante la lezione.

La funzione deve essere compatibile con il tipo di dispositivo scelto nel nodo.

---

## 9. Esempi Bridge pronti per Inject/Function

### Luce o presa On/Off

```javascript
msg.payload = {
  function: "onoff",
  value: true,
};
return msg;
```

Per spegnere:

```javascript
msg.payload = {
  function: "onoff",
  value: false,
};
return msg;
```

### Luce dimmerabile

```javascript
msg.payload = {
  function: "level",
  value: 72,
};
return msg;
```

Il valore è una percentuale `0–100`.

### Luce RGB

```javascript
msg.payload = {
  function: "rgb",
  value: {
    red: 255,
    green: 80,
    blue: 20,
  },
};
return msg;
```

Ogni componente RGB è compresa tra `0` e `255`.

### Luce bianco dinamico

```javascript
msg.payload = {
  function: "colortemp",
  value: 3000,
};
return msg;
```

Il valore può essere espresso in Kelvin. Per compatibilità sono accettati anche i mired quando il valore è inferiore a `1000`.

### Sensore temperatura

```javascript
msg.payload = {
  function: "temperature",
  value: 22.6,
};
return msg;
```

### Sensore umidità

```javascript
msg.payload = {
  function: "humidity",
  value: 48.5,
};
return msg;
```

### Sensore luminosità

```javascript
msg.payload = {
  function: "illuminance",
  value: 350,
};
return msg;
```

Il valore è espresso in lux.

### Presenza

```javascript
msg.payload = {
  function: "occupancy",
  value: true,
};
return msg;
```

### Contatto porta/finestra

```javascript
msg.payload = {
  function: "contact",
  value: true,
};
return msg;
```

### Tapparella

```javascript
msg.payload = {
  function: "position",
  value: 35,
};
return msg;
```

Il valore è `0–100`. Normalmente:

- `0` = aperta;
- `100` = chiusa.

Le opzioni **Inverti posizione** e **Scambia Apri/Chiudi** possono modificare la convenzione esposta.

L'input serve a riportare la posizione/stato. I comandi `updown` e `stop` arrivano dall'output del nodo quando un controller Matter li invia; non sono funzioni di aggiornamento stato accettate dall'input.

### Termostato

Temperatura ambiente:

```javascript
msg.payload = {
  function: "currenttemp",
  value: 20.8,
};
return msg;
```

Setpoint riscaldamento:

```javascript
msg.payload = {
  function: "setpoint",
  value: 21.5,
};
return msg;
```

Setpoint raffrescamento:

```javascript
msg.payload = {
  function: "coolingsetpoint",
  value: 24,
};
return msg;
```

I valori sono in gradi Celsius.

### Ventilatore

```javascript
msg.payload = {
  function: "fanspeed",
  value: 55,
};
return msg;
```

Il valore è una percentuale `0–100`; `0` corrisponde a Off.

### Fumo, monossido e perdita acqua

```javascript
msg.payload = {
  function: "smoke",
  value: true,
};
return msg;
```

```javascript
msg.payload = {
  function: "co",
  value: false,
};
return msg;
```

```javascript
msg.payload = {
  function: "leak",
  value: true,
};
return msg;
```

### CO₂ e qualità aria

```javascript
msg.payload = {
  function: "co2",
  value: 1250,
};
return msg;
```

Il valore è espresso in ppm. Il bridge ricava automaticamente anche la classe Matter Air Quality.

---

## 10. Tabella rapida delle funzioni Bridge

| Tipo dispositivo     | Funzioni di stato accettate in input         |
| -------------------- | -------------------------------------------- |
| Luce/Presa On-Off    | `onoff`                                      |
| Luce dimmerabile     | `onoff`, `level`                             |
| Luce RGB             | `onoff`, `level`, `rgb`                      |
| Luce bianco dinamico | `onoff`, `level`, `colortemp`                |
| Sensore temperatura  | `temperature`                                |
| Sensore umidità      | `humidity`                                   |
| Sensore luminosità   | `illuminance`                                |
| Sensore presenza     | `occupancy`                                  |
| Sensore contatto     | `contact`                                    |
| Tapparella           | `position`                                   |
| Termostato           | `currenttemp`, `setpoint`, `coolingsetpoint` |
| Ventilatore          | `fanspeed`                                   |
| Fumo/CO              | `smoke`, `co`                                |
| Allagamento          | `leak`                                       |
| Qualità aria         | `co2`                                        |
| Robot aspirapolvere  | `rvcstate`, `rvcmode`                        |

---

## 11. Robot aspirapolvere solo-flow

Il robot aspirapolvere è l'esempio migliore per spiegare un dispositivo Matter gestito interamente dal flow.

### Stato operativo

```javascript
msg.payload = {
  function: "rvcstate",
  value: "running",
};
return msg;
```

Valori supportati:

```text
stopped
running
paused
error
seekingcharger
charging
docked
```

### Modalità

```javascript
msg.payload = {
  function: "rvcmode",
  value: "cleaning",
};
return msg;
```

Valori supportati:

```text
idle
cleaning
```

### Comandi in uscita

Quando Alexa o un altro controller comanda il robot, l'output può contenere:

```javascript
msg.matter.fn = "rvccommand";
msg.payload = "gohome";
```

oppure:

```javascript
msg.matter.fn = "rvccommand";
msg.payload = "pause";
```

oppure:

```javascript
msg.matter.fn = "rvcmode";
msg.payload = "cleaning";
```

Il flow esegue il comando tramite l'API del robot e, quando riceve conferma, aggiorna l'input del nodo con `rvcstate` e `rvcmode`.

---

## 12. Capire l'output del Matter Bridge

Quando un controller Matter invia un comando, il nodo **Expose KNX to Matter** emette:

```javascript
{
  topic: "Nome del dispositivo",
  payload: true,
  device: {
    id: "...",
    type: "onofflight",
    name: "Nome del dispositivo"
  },
  matter: {
    fn: "onoff",
    value: true
  }
}
```

Per un dispositivo solo-flow, dopo aver eseguito realmente il comando si può costruire il feedback:

```javascript
const funzione = msg.matter.fn;

if (funzione === "onoff" || funzione === "level") {
  return {
    payload: {
      function: funzione,
      value: msg.payload,
    },
  };
}

return null;
```

Questo messaggio torna all'input dello stesso nodo e aggiorna lo stato Matter.

Con un impianto KNX reale è preferibile aspettare il telegramma del GA di stato, così Matter riflette il valore confermato dall'attuatore invece del solo comando richiesto.

---

## 13. Differenze da mostrare chiaramente in video

| Caso                         | Dove sono i dati?                                            | Unità                                     |
| ---------------------------- | ------------------------------------------------------------ | ----------------------------------------- |
| Controller, luce             | proprietà dirette `msg.on`, `msg.dimming`, ecc.              | formato luce                              |
| Controller, endpoint mappato | proprietà dirette `msg.clusterId`, `msg.attribute`/`command` | unità amichevoli per i cluster supportati |
| Controller, Door Lock        | `msg.payload` booleano o `{locked}`                          | booleano                                  |
| Controller, Universale       | proprietà dirette o `msg.matter`                             | unità Matter native                       |
| Bridge                       | `msg.payload = {function, value}`                            | unità KNX/umane                           |

La frase utile per il pubblico:

> Nel Controller descrivo **cosa voglio fare sul protocollo Matter**.
> Nel Bridge descrivo **quale stato del dispositivo virtuale voglio aggiornare**.

---

## 14. Flow minimo consigliato per la lezione

Il repository contiene il flow pronto da importare `examples/Matter Controller - Semantic Flow Input.json`. L'esempio non crea un nuovo fabric e non invia comandi automatici: dopo l'importazione occorre selezionare il proprio Matter Controller e un endpoint già associato.

### Demo Controller

```text
[Inject] → [Function: costruisci msg] → [Control Matter from KNX] → [Debug completo]
```

Sequenza:

1. accendere una luce;
2. regolare la luminosità;
3. leggere `onOff` dalla cache;
4. ripetere la lettura con `requestFromRemote = true`;
5. mostrare l'errore generato da un cluster o comando non supportato;
6. con due nodi sullo stesso GA, scollegare un dispositivo e verificare che l'altro continui a rispondere;
7. ricollegare il dispositivo e mostrare la ripresa automatica del nodo.

### Demo Bridge

```text
[Inject temperatura] ─┐
[Inject presenza] ────┼→ [Expose KNX to Matter] → [Debug comandi Matter]
[API/simulatore] ─────┘
```

Sequenza:

1. aggiornare un sensore temperatura virtuale;
2. verificare il valore nell'app Matter;
3. comandare una luce dall'app;
4. osservare `msg.payload` e `msg.matter` sul Debug;
5. restituire lo stato confermato all'input.

---

## 15. Errori frequenti

### Il nodo non ha il PIN input

Abilitare **Node Input/Output PINs** e fare il deploy.

### Il Bridge segnala `msg.payload must be { function, value }`

È stato inviato un payload scalare o con nomi errati. Usare:

```javascript
msg.payload = {
  function: "onoff",
  value: true,
};
return msg;
```

### Il Controller segnala che mancano cluster e target

Negli endpoint mappati usare proprietà top-level:

```javascript
msg.clusterId = 6;
msg.command = "on";
msg.args = true;
return msg;
```

Non inserire questi selettori sotto `msg.payload`.

### Una lettura restituisce un valore vecchio

Aggiungere:

```javascript
msg.requestFromRemote = true;
```

### Il valore `false` oppure `0` sembra non funzionare

`false` e `0` sono valori validi. In un Function non usare controlli come:

```javascript
if (msg.payload.value) { ... } // Errato per false e 0
```

Usare invece:

```javascript
if (msg.payload.value !== undefined) { ... }
```

### Un comando non viene accettato

Controllare:

- che il dispositivo sia online;
- che `nodeId` ed `endpointId` siano corretti;
- che il cluster esista su quell'endpoint;
- che il comando o l'attributo sia realmente annunciato;
- che le unità siano corrette per il profilo scelto.

Se il nodo mostra in rosso che il dispositivo Matter non è disponibile, i comandi KNX e flow vengono ignorati fino alla riconnessione. Il nodo si riattiva automaticamente quando il dispositivo torna `connected`; aprire l'editor soltanto se si desidera forzare un tentativo manuale.

Se compare **Device no longer commissioned**, il dispositivo non è più associato a quel Matter Controller: associarlo nuovamente e riselezionarlo, oppure eliminare il nodo operativo rimasto orfano.

### Si confondono Controller e Bridge

- **Controller**: parla verso un dispositivo Matter già associato.
- **Bridge**: pubblica uno stato verso i controller abbinati al bridge.

---

## 16. Testo breve per l'apertura della lezione

> Oggi vediamo le due direzioni Matter di KNX-Ultimate. Nella prima, Node-RED è il controller e comanda un dispositivo Matter reale. Nella seconda, Node-RED espone un dispositivo KNX o virtuale ad Alexa, Google Home e Apple Home. La parte più importante è capire la forma del `msg`: nel Controller dipende dal profilo dell'endpoint, mentre nel Bridge usiamo sempre `msg.payload` con `function` e `value`.

## 17. Chiusura e teaser

> Ora sappiamo comandare dispositivi Matter reali e aggiornare dispositivi esposti dal Matter Bridge direttamente dal flow. Nella prossima lezione possiamo costruire un dispositivo Matter completamente solo-flow, collegarlo a una vera API esterna e gestire insieme comando, conferma dello stato, timeout e disponibilità.
