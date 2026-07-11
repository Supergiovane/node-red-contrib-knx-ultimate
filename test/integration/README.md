# Test di integrazione dal vivo - nodo Light multimodale

Test reali, su hardware. I segreti stanno in **`config.local.json`** (escluso da git -
copialo da `config.example.json` e inserisci i tuoi valori reali; non committarlo mai).

```bash
cp test/integration/config.example.json test/integration/config.local.json
# poi modifica config.local.json
```

## 1. `npm run avviaquesto-itest:light` - indipendente, senza Node-RED (consigliato)

Pilota **direttamente la lampada Hue reale**, importando lo STESSO codice di produzione
che usa il nodo (`nodes/utils/lightEngines` + il vero manager del bridge `classHUE`).
Esegue una sequenza tramite `engine.applyState()` - le identiche chiamate canoniche che
fa il nodo - e stampa il feedback push del bridge via `engine.handleIncoming()`. Nessun
Node-RED, nessun bus KNX.

```bash
npm run avviaquesto-itest:light            # on → dim → kelvin → colore → off, sulla lampada reale
npm run avviaquesto-itest:light -- --list  # elenca gli id delle luci del bridge (per riempire hue.deviceId)
```

Serve solo il blocco `hue` di `config.local.json` (`host`, `username`, `clientkey`,
`deviceId`). Il `deviceId` può essere un id di device o di light - il driver risolve
automaticamente l'id `/resource/light` corretto. Solo Hue: Matter tiene il commissioning
su disco e non può avviare un secondo controller mentre Node-RED lo detiene.

## 1b. `npm run avviaquesto-itest:matterlight` - indipendente, senza Node-RED (nodo Matter)

Il gemello del test Hue per il **nodo Matter Light**: importa lo STESSO codice di
produzione (`MatterLightEngine` + il vero controller `classMatter`) e apre il **fabric
Matter già commissionato** della tua installazione Node-RED, pilotando la lampada reale
con le identiche chiamate canoniche del nodo. Il feedback (report attributi) viene
stampato in tempo reale.

**IMPORTANTE: Node-RED deve essere FERMO** mentre gira (un fabric ammette un solo
controller attivo; il driver apre lo stesso storage/identità del tuo matter-config).

```bash
npm run avviaquesto-itest:matterlight            # on → dim → kelvin → colore → off
npm run avviaquesto-itest:matterlight -- --list  # elenca i nodi commissionati + endpoint luce
```

Serve il blocco `matter` di `config.local.json`: `userDir` (la userDir del tuo Node-RED
reale, es. `/Users/tuonome/.node-red` - lo storage sta in
`<userDir>/knxultimatestorage/matter`), `nodeId` (usa `--list` per scoprirlo),
`endpointId`. `instanceId` viene auto-rilevato.

## 2. `npm run avviaquesto-itest:nodered-knx` - auto-contenuto, avvia da solo Node-RED

Il percorso completo del nodo, totalmente automatizzato. Genera il flow, avvia
un'**istanza privata di Node-RED** (che carica i nodi di QUESTO repo via symlink), attende
che KNX e Hue si colleghino, fa scattare i nodi inject tramite l'admin API di Node-RED, e
cattura il feedback che il nodo Light riscrive sul bus - tutto sulla connessione KNX di
Node-RED stesso, quindi niente secondo tunnel e nessun problema di condivisione del bus.
Richiede `node-red` nel PATH (installazione globale) e i blocchi `hue` + `knx` + `light` +
`nodered` di `config.local.json`. L'id della luce Hue viene risolto automaticamente.

```bash
npm run avviaquesto-itest:nodered-knx   # genera flow -> avvia Node-RED -> pilota la lampada -> riepilogo feedback ✔/✗
```

Scrive una userDir usa-e-getta `test/integration/.nodered/` (esclusa da git). Regola il
tempo di attesa all'avvio con `nodered.connectWaitMs` e la porta con `nodered.port`.

### 2m. `npm run avviaquesto-itest:nodered-matter` - come sopra, per il nodo Matter Light

Stessa orchestrazione, ma il flow generato contiene il **nodo Matter Light**. L'istanza
privata apre il **fabric commissionato reale**: lo storage Matter viene collegato via
symlink da `matter.userDir` e il config-node generato riusa l'identità del tuo
matter-config (auto-rilevata dallo storage), così il controller vede le tue lampade.

**IMPORTANTE: il tuo Node-RED di produzione deve essere FERMO** (un solo controller
attivo per fabric, e libera anche il tunnel KNX).

```bash
npm run avviaquesto-itest:nodered-matter   # genera flow -> avvia Node-RED -> pilota la lampada -> ✔/✗
```

Richiede i blocchi `matter` (userDir, nodeId, endpointId) + `knx` + `light` + `nodered`
di `config.local.json`.

### 2b. `npm run avviaquesto-itest:knxbus` (osservatore esterno, avanzato)

Il vecchio harness KNX standalone: un processo separato che scrive le GA di comando e
ascolta i feedback. Funziona solo se riesce a **condividere il bus KNX** con un Node-RED
già attivo (fallisce con gateway solo-tunneling o quando Node-RED è su un altro host).
Preferisci l'opzione 2.

## 2s. `npm run avviaquesto-itest:serve` - avvia Node-RED col flow e LO LASCIA APERTO

Come l'opzione 2 ma **non pilota nulla**: avvia un Node-RED privato caricato con il flow
unito (tab Hue + tab Matter) e resta in ascolto. Apri `http://localhost:1881`, premi tu i
pulsanti inject e guarda la lampada. `Ctrl+C` per fermarlo.

```bash
npm run avviaquesto-itest:serve
```

- Il tab **Hue** funziona col blocco `hue` di `config.local.json`.
- Il tab **Matter** apre il tuo fabric commissionato reale solo se `matter.userDir` è
  impostato (lo storage viene collegato e l'id del config-node riusato) - e allora il tuo
  Node-RED di produzione deve essere **FERMO**. Senza `matter.userDir` il tab Matter si
  carica su un fabric vuoto.

## 3. `npm run avviaquesto-itest:buildflow` - genera un flow importabile in Node-RED

Legge `config.local.json` e scrive UN unico `flow.local.json` (escluso da git - contiene
le credenziali Hue) con **due tab**:
- tab *KNX-Ultimate • Light live test* - nodo **Hue Light**;
- tab *KNX-Ultimate • Matter Light live test* - nodo **Matter Light**.

Il config del gateway KNX è condiviso fra i due tab. Ogni tab ha nodo Light + pulsanti
inject (comandi GA) + debug (feedback). Importalo in Node-RED e premi i pulsanti - il test
definitivo, funziona con qualsiasi gateway. Sul tab Matter: dopo l'import, apri il nodo
Matter Light e seleziona il TUO controller Matter esistente + la luce dal picker (il
matter-config generato creerebbe un fabric nuovo e vuoto).

## Note

- I test toccano solo il device / le GA presenti in `config.local.json`. Usa una lampada
  di test dedicata.
- `config.local.json` e `flow.local.json` sono esclusi da git; `config.example.json` è il
  template committato.
