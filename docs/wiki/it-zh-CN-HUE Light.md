🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/HUE+Light) | [IT](/node-red-contrib-knx-ultimate/wiki/it-HUE+Light) | [DE](/node-red-contrib-knx-ultimate/wiki/de-HUE+Light) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-HUE+Light) | [ES](/node-red-contrib-knx-ultimate/wiki/es-HUE+Light) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Light)
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
<p> Questo nodo ti consente di controllare le luci del tono di Philips e le luci raggruppate e anche inviare lo stato di questa luce al bus KNX.</p>
**Generale**
| Proprietà | Descrizione |
|-|-|
| KNX GW | Seleziona il portale KNX da utilizzare |
| Bridge Hua | Seleziona il bridge tone da usare |
| Nome | Lampada da tonalità o luce raggruppata per tonalità.Le luci e i gruppi disponibili quando si digita iniziano. |
<br/>
**Opzioni**
Qui puoi selezionare l'indirizzo KNX che si desidera collegare alle luci/stato di tono disponibili.<br/>
Inizia ad immettere il campo GA, il nome o l'indirizzo di gruppo del dispositivo KNX e il dispositivo disponibile inizia a visualizzare quando si entra.
**modifica**
| Proprietà | Descrizione |
|-|-|
| Control | Questo GA viene utilizzato per attivare/spento la luce tono dal valore booleano KNX di True/False |
| Stato | Collegalo all'indirizzo del gruppo di stato Switch della luce |
<br/>
**Dim**
| Proprietà | Descrizione |
|-|-|
| Control Dim | Dimmio relativamente buio.È possibile impostare la velocità di attenuazione nella scheda \*\* _behavior_ **.|
| Control %| cambia la luminosità del tono assoluto (0-100 %) |
| Stato %| Collegalo allo stato di luminosità della luce Indirizzo del gruppo KNX |
| Dark Speed ​​(MS) | Piccola velocità in millisecondi.Funziona per ** Light ** e anche per**Punti di dati pianificati White \*\*. È calcolato dallo 0% al 100%.|
| L'ultima luminosità del fiocchi |La luminosità più bassa che la luce può ottenere.Ad esempio, se si desidera abbassare la luce, la luce smette di attenuare la luminosità specificata.|
| Massima luminosità fioca |Massima luminosità che la lampada può ottenere.Ad esempio, se si desidera regolare la luce, la luce smetterà di attenuare la luminosità specificata. |
<br/>
**bianco regolabile**
| Proprietà | Descrizione |
|-|-|
| Control Dim |Utilizzare DPT 3.007 Dimming per cambiare la temperatura bianca della lampada tono.È possibile impostare la velocità di attenuazione nella scheda \*\* _behavior_ \*\*. |
| Controllo % | Utilizzare DPT 5.001 per cambiare la temperatura del colore bianco; 0 è caldo, 100 è freddo |
| Stato % | Indirizzo del gruppo di temperatura del colore chiaro bianco (DPT 5.001; 0 = caldo, 100 = freddo) |
| Controllo Kelvin | **DPT 7.600: ** Impostato da KNX Range 2000-6535 K (Converti in Hue Mirek). <br/>**DPT 9.002:** Set da Hue Range 2000-6535 K (Ambiance inizia da 2200 K).La conversione può portare a lievi deviazioni |
| Stato Kelvin | **DPT 7.600: ** Leggi Kelvin (KNX 2000-6535, conversione).<br/>**dpt 9.002:** Leggi Hue Range 2000-6535 K; La conversione può avere lievi deviazioni |
| Invertire la direzione fioca | Invertire la direzione fioca.|
<br/>
\*\*Rgb/hsv \*\*
| Proprietà | Descrizione |
|-|-|
| **Parte RGB** ||
| Controllo RGB | Usa RGB Triples (R, G, B) per cambiare il colore, inclusa la correzione del colore. Invia il colore si illuminerà e imposterà colore/luminosità;r, g, b = 0 Spegnere la luce |
| Stato RGB | Indirizzo del gruppo di stato del colore chiaro.I punti dati accettati sono terzine RGB (R, G, B) |
| **Parte HSV** ||
| Color H Dimming | Loop su HSV Hue Loop usando DPT 3.007; Speed ​​in **Comportamento** Impostazioni |
| State H%| State of HSV Color Circle. |
| Control S Dimming |Utilizzare DPT 3.007 per cambiare la saturazione; Speed ​​in **Comportamento** Impostazioni |
| State S% | Indirizzo del gruppo di stato saturo di luce. |
| Dark Speed ​​(MS) |Velocità in miniatura dal fondo alla scala più alta di Milisecondi. |
Suggerimento: per la "V" (luminosità) dell'HSV, utilizzare i controlli standard della scheda **Dim** .
<br/>
**Effetto**
_Non-hue Basic Effects_
| Proprietà | Descrizione |
|-|-|
| Blink | _true_ lampeggia la luce, _false_ smette di lampeggiare. Interruttori alternativi, adatti per i prompt.Supporta tutte le luci Hue.|
|Color Loop | _true_ avvia il ciclo, _false_ arresta il loop.Cambia il colore in modo casuale a intervalli fissi, solo per le luci da tonalità che supportano la luce del colore.L'effetto inizia circa 10 secondi dopo aver emesso il comando. |
_HUE Effect nativo_
Nella tabella **Native Effects** , mappare il valore KNX agli effetti supportati dal dispositivo (ad esempio, `candela`,` camino`, `prism`).Ogni riga associa un valore KNX (booleano, numerico o testo, a seconda del punto dati selezionato) con un effetto restituito dal ponte.Questo sarà:
- Invia valori KNX mappati per attivare l'effetto corrispondente;
- (Opzionale) Configurare un indirizzo del gruppo di stato: quando Hue Bridge segnala l'effetto cambia, il nodo scrive il valore della mappa;Se non viene trovata alcuna mappa, viene inviato il nome dell'effetto originale (è richiesta la classe di testo DPT, ad esempio 16.xxx).
<br/>
**Comportamento**
| Proprietà | Descrizione |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Leggi lo stato all'avvio | Leggi lo stato della luce Hue nell'avvio di nodo-rosso o la distribuzione completa di rosso nodo e quindi invia tale stato al bus KNX |
| Stato di luminosità KNX | Ogni volta che la luce del tono viene attivata/spenta, viene aggiornato lo stato dell'indirizzo del gruppo di luminosità KNX. L'opzione è **inviare lo 0% quando la tonalità è spenta. Quando la tonalità è attivata, ripristina i valori precedenti (comportamento KNX predefinito) e ** * come è (comportamento della tonalità predefinito)**. Se si dispone di un Dimmer KNX con stato di luminosità, come MDT, l'opzione consigliata è \*\*\*e quando la luce HUE è spenta, invia lo 0%.Quando il tono è acceso, ripristina il valore precedente (comportamento KNX predefinito) \*\*\*|
| Comportamento aperto | Quando acceso, imposta il comportamento della luce.Puoi scegliere tra comportamenti diversi. <br/> \*\*Seleziona colore: \*\*La luce verrà attivata usando il colore selezionato.Per modificare il colore, basta fare clic sul selettore del colore (realizzato in "Seleziona la bellezza". <br/> \*\*Seleziona temperatura e luminosità: ** La temperatura (Kelvin) e la luminosità (0-100) che hai selezionato accenderà la luce. <br/> Nessuna:** Nessuna: se si abilita l'illuminazione notturna, dopo la notte, la luce tornerà al colore/temperatura set durante la giornata. |
| Illuminazione notturna | Permette di impostare i colori della luce/luminosità specifici di notte. Le opzioni sono le stesse di durante il giorno. Puoi scegliere temperatura/luminosità o colore. La temperatura comoda è di 2700 Kelvin e la luminosità è del 10% o 20%, rendendolo una buona scelta per le luci notturne del bagno. |
| Giorno/notte | Seleziona l'indirizzo di gruppo per impostare il comportamento giorno/notte. Il valore dell'indirizzo di gruppo è \ _true \ _if Daytime, \ _False \ _if Nighttime. |
| Valore del giorno/notte di piega | Inverti il ​​valore di giorno/notte \ _Group Indirizzo. Valore predefinito** Non selezionato.|
| Leggi lo stato all'avvio |Leggi lo stato all'avvio e trasmetti gli eventi al bus KNX all'avvio/riconnessione. (Predefinito "no") |
| Forza modalità diurna |È possibile forzare la modalità diurna cambiando manualmente le luci descritte qui: \*\*Passa alla modalità giorno spegnendo rapidamente Ligth e quindi (solo questa luce) (solo questa luce) \*\*Fai l'azione descritta e funziona solo su questa luce per passare alla modalità Day. \*\*Passa alla modalità giornaliera chiudendo rapidamente il ligth e quindi accendendo (applicando tutti i nodi di luce).|
| Pin di ingresso/output del nodo |Nascondere o visualizzare il pin di ingresso/output.Il pin di input/output consente al nodo di accettare l'ingresso del traffico e di inviare l'output MSG al traffico. L'MSG di input deve rispettare lo standard API V.2 HUE.Ecco un MSG di esempio che accende la luce: <code> msg.on = {"on": true} </code>. Vedi \ [Pagina API HUE ufficiale](§url0§) |
Note ###
La funzione Dimming funziona in modalità \*\*kNX \ `start \` \ `'' 'e st off' **.Per iniziare a oscurarsi, basta inviare un KNX Telegram "Start".Per smettere di oscurarsi, invia un telegramma KNX "Stop".Per favore** Ricorda \*\*, quando imposti il ​​muro, ricorda.
<br/>
<br/>
