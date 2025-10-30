🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/Device) | [IT](/node-red-contrib-knx-ultimate/wiki/it-Device) | [DE](/node-red-contrib-knx-ultimate/wiki/de-Device) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-Device) | [ES](/node-red-contrib-knx-ultimate/wiki/es-Device) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-Device)
<!-- NAV START -->
Navigation: [Startseite](/node-red-contrib-knx-ultimate/wiki/de-Home) 
Übersicht: [Changelog](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/CHANGELOG.md) • [FAQ](/node-red-contrib-knx-ultimate/wiki/de-FAQ-Troubleshoot) • [Sicherheit](/node-red-contrib-knx-ultimate/wiki/de-SECURITY) • [Doku: Sprachleiste](/node-red-contrib-knx-ultimate/wiki/de-Docs-Language-Bar) 
KNX Geräteknoten: [Gateway](/node-red-contrib-knx-ultimate/wiki/de-Gateway-configuration) • [Gerät](/node-red-contrib-knx-ultimate/wiki/de-Device) • [Knotenschutz](/node-red-contrib-knx-ultimate/wiki/de-Protections) 
Weitere KNX‑Knoten: [Szenencontroller](/node-red-contrib-knx-ultimate/wiki/de-SceneController-Configuration) • [WatchDog](/node-red-contrib-knx-ultimate/wiki/de-WatchDog-Configuration) • [Logger](/node-red-contrib-knx-ultimate/wiki/de-Logger-Configuration) • [Global Context](/node-red-contrib-knx-ultimate/wiki/de-GlobalVariable) • [Alerter](/node-red-contrib-knx-ultimate/wiki/de-Alerter-Configuration) • [Laststeuerung](/node-red-contrib-knx-ultimate/wiki/de-LoadControl-Configuration) • [Viewer](/node-red-contrib-knx-ultimate/wiki/de-knxUltimateViewer) • [Auto‑Responder](/node-red-contrib-knx-ultimate/wiki/de-KNXAutoResponder) • [HA‑Übersetzer](/node-red-contrib-knx-ultimate/wiki/de-HATranslator) • [IoT Bridge](/node-red-contrib-knx-ultimate/wiki/de-IoT-Bridge-Configuration) 
HUE: [Bridge](/node-red-contrib-knx-ultimate/wiki/de-HUE+Bridge+configuration) • [Licht](/node-red-contrib-knx-ultimate/wiki/de-HUE+Light) • [Batterie](/node-red-contrib-knx-ultimate/wiki/de-HUE+Battery) • [Taster](/node-red-contrib-knx-ultimate/wiki/de-HUE+Button) • [Kontakt](/node-red-contrib-knx-ultimate/wiki/de-HUE+Contact+sensor) • [Geräte‑SW‑Update](/node-red-contrib-knx-ultimate/wiki/de-HUE+Device+software+update) • [Lichtsensor](/node-red-contrib-knx-ultimate/wiki/de-HUE+Light+sensor) • [Bewegung](/node-red-contrib-knx-ultimate/wiki/de-HUE+Motion) • [Szene](/node-red-contrib-knx-ultimate/wiki/de-HUE+Scene) • [Tap Dial](/node-red-contrib-knx-ultimate/wiki/de-HUE+Tapdial) • [Temperatur](/node-red-contrib-knx-ultimate/wiki/de-HUE+Temperature+sensor) • [Zigbee‑Konnektivität](/node-red-contrib-knx-ultimate/wiki/de-HUE+Zigbee+connectivity) 
Beispiele: [Logger](/node-red-contrib-knx-ultimate/wiki/de-Logger-Sample) • [Switch Light](/node-red-contrib-knx-ultimate/wiki/-Sample---Switch-light) • [Dimming](/node-red-contrib-knx-ultimate/wiki/-Sample---Dimming) • [RGB color](/node-red-contrib-knx-ultimate/wiki/-Sample---RGB-Color) • [RGBW color + White](/node-red-contrib-knx-ultimate/wiki/-Sample---RGBW-Color-plus-White) • [Command a scene actuator](/node-red-contrib-knx-ultimate/wiki/-Sample---Control-a-scene-actuator) • [Datapoint 213.x 4x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT213) • [Datapoint 222.x 3x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT222) • [Datapoint 237.x DALI diags](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT237) • [Datapoint 2.x 1 bit proprity](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT2) • [Datapoint 22.x RCHH Status](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT22) • [Datetime to BUS](/node-red-contrib-knx-ultimate/wiki/-Sample---DateTime-to-BUS) • [Read Status](/node-red-contrib-knx-ultimate/wiki/-Sample---Read-value-from-Device) • [Virtual Device](/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device) • [Subtype decoded](/node-red-contrib-knx-ultimate/wiki/-Sample---Subtype) • [Alexa](/node-red-contrib-knx-ultimate/wiki/-Sample---Alexa) • [Apple Homekit](/node-red-contrib-knx-ultimate/wiki/-Sample---Apple-Homekit) • [Google Home](/node-red-contrib-knx-ultimate/wiki/-Sample---Google-Assistant) • [Switch on/off POE port of Unifi switch](/node-red-contrib-knx-ultimate/wiki/-Sample---UnifiPOE) • [Set configuration by msg](/node-red-contrib-knx-ultimate/wiki/-Sample-setConfig) • [Scene Controller node](/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node) • [WatchDog node](/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog) • [Global Context node](/node-red-contrib-knx-ultimate/wiki/SampleGlobalContextNode) • [Alerter node](/node-red-contrib-knx-ultimate/wiki/SampleAlerter) • [Load control node](/node-red-contrib-knx-ultimate/wiki/SampleLoadControl) • [Viewer node](/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer) • [MySQL, InfluxDB, MQTT Sample](/node-red-contrib-knx-ultimate/wiki/Sample-KNX2MQTT-KNX2MySQL-KNX2InfluxDB) 
Contribute to Wiki: [Link](/node-red-contrib-knx-ultimate/wiki/de-Manage-Wiki)
<!-- NAV END -->
---
## KNX‑ULTIMATE GERÄTE‑NODE EINSTELLUNGEN

Dieser Node steuert eine KNX‑Gruppenadresse und ist der am häufigsten verwendete.

[<i class="fa fa-code"></i> Beispiele findest du hier](/node-red-contrib-knx-ultimate/wiki/-SamplesHome)

**Konfiguration**

|Eigenschaft|Beschreibung|
|--|--|
| Gateway | Zu verwendendes KNX‑Gateway auswählen |
| GA‑Typ (Dropdown) | Typ der Gruppenadresse. **3‑Ebenen** ist Standard (Eingabe der 3‑stufigen GA oder GA‑Bezeichnung, sofern ETS importiert). **Global** liest die GA beim Start aus einer globalen Variablen, **Flow** analog auf Flow‑Ebene. **$Env variable** liest die GA aus einer Umgebungsvariable. **Universeller Modus (alle GAs abhören)** reagiert auf ALLE Gruppenadressen. |
| Group Addr. | Zu steuernde Gruppenadresse. Mit importierter ETS kannst du den Gerätenamen tippen. Kann leer bleiben, wenn du sie per `msg.setConfig` setzt. |
| Datapoint | Der zum Node gehörende Datapoint. |

### Manueller Befehlsbutton

Im Editor kann pro Node ein kleiner Button angezeigt werden, über den du KNX‑Telegramme ohne zusätzlichen Inject‑Knoten auslösen kannst.

|Eigenschaft|Beschreibung|
|--|--|
| Manuellen Button anzeigen | Blendet den Button im Workspace und in der Knotenliste ein bzw. aus. |
| Schaltflächenaktion | Legt fest, was beim Klick geschieht. **KNX-Leseanforderung senden** erzeugt ein normales Read-Telegramm. **Boolean umschalten (Schreiben)** steht bei DPT 1.x zur Verfügung und wechselt zwischen _true_ und _false_. **Benutzerdefinierten Wert schreiben** sendet den angegebenen Wert (muss zum eingestellten Datapoint passen). |
| Initialer Toggle-Status | (Nur für boolesche Datapoints) Startwert der Toggle-Funktion. Der Zustand bleibt mit den ankommenden KNX-Telegrammen synchron. |
| Benutzerdefinierter Wert | Wert für den Modus „Benutzerdefinierten Wert schreiben“. Erlaubt sind JSON-Literale wie `42`, `true`, `"Text"` oder `{ "red": 255 }`. |

Der Button wird nur eingeblendet, wenn die Option aktiv ist. Im Universalmodus ist die Leseaktion deaktiviert, da keine feste Gruppenadresse vorhanden ist.

## TAB Erweiterte Optionen

|Eigenschaft|Beschreibung|
|--|--|
|| **Allgemein** |
| Node‑Name | Anzeigename. |
| Topic | Topic der Ausgabe. Leer lassen, um die Gruppenadresse zu verwenden. |
| Passthrough | Leitet die Eingangs‑Nachricht an den Ausgang weiter. |
|| **Vom Node‑EINGANG zum KNX‑BUS** |
| Telegrammtyp | `write` zum Senden eines Schreib‑Telegramms (üblich), alternativ Reaktion auf andere Typen. |
| RBE‑Filter | "Report by change". Wenn aktiv, sendet nur geänderte Werte zum BUS. Für identische Wiederholungen deaktivieren. Bei Aktivierung wird "rbe" dem Nodename hinzugefügt. |
|| **Vom KNX‑BUS zum Node‑AUSGANG** |
| Status beim Start lesen | Liest den GA‑Status bei Editorstart und jeder Wiederverbindung. Werte werden in einer Datei gepuffert, Quelle wählbar (Datei/BUS). |
| RBE‑Filter | Wie oben, aber für Ausgaben zum Flow. |
| Auf Schreib‑Telegramme reagieren | Sendet bei eingehendem Write eine Nachricht an den Flow. |
| Auf Response‑Telegramme reagieren | Sendet bei Response eine Nachricht an den Flow. |
| Auf Lese‑Telegramme reagieren | Sendet bei Read eine Nachricht an den Flow (z. B. um eigene Werte zu liefern). |
| Multiply/Decimals/Negatives | Skaliert, rundet und behandelt negative Werte (nur numerische Werte). |

## TAB KNX Function

Mit JavaScript kannst du das Verhalten eingehender Nachrichten (vom Flow) und ausgehender Telegramme (zum BUS) anpassen. Der Editor stellt Hilfsobjekte und ‑funktionen bereit, um GA‑Werte zu lesen - mit ETS (ohne DPT) oder ohne ETS (mit DPT).
Der Code läuft bei jeder Eingangs‑Nachricht und bei jedem BUS‑Telegramm. Bei Aktivierung erscheint "f(x)" im Nodename.

|Eigenschaft|Beschreibung|
|--|--|
| Search GA | Nur mit importierter ETS: tippen, GA wählen und das Feld in `getGAValue` einfügen. |

### Verfügbare Objekte/Funktionen

|Objekt/Funktion|Beschreibung|
|--|--|
| `msg` | Aktuelle Nachricht. |
| `getGAValue(GA, DPT?)` | Liest den Wert einer GA, z. B. `'1/0/1'` oder `'1/0/1 Bed table light'` (Text nach Leerzeichen wird ignoriert). DPT nur ohne ETS erforderlich. |
| `setGAValue(GA, value, DPT?)` | Setzt den Wert der GA; DPT wie oben. |
| `self(value)` | Setzt den eigenen Node‑Wert und sendet ihn an den BUS (Achtung Schleifen). |
| `toggle()` | Toggeln wie `self`. |
| `node`, `RED`, `return(msg)` | Node‑Objekt, RED‑Objekt, Rückgabe der Nachricht. |

### Beispiele (Flow → BUS)

```javascript
const statusGA = getGAValue('0/0/09','1.001');
if (msg.payload !== statusGA){ return msg; } else { return; }
```

```javascript
if (msg.payload){
 setGAValue('0/1/8', true)
 setTimeout(function(){ self(off); }, 2000);
}
return msg;
```

### Beispiele (BUS → Ausgang)

```javascript
msg.externalTemperature = getGAValue('0/0/10'); // ohne ETS: getGAValue('0/0/10','9.001')
return msg;
```

```javascript
if (msg.payload === false && getGAValue('0/0/11','1.001') === false){ return; } else { return msg; }
```

### Inputs **destination (string)**: 3‑stufige GA, z. B. `1/1/0`. **payload (any)**: zu sendender Wert. **event (string)**: `GroupValue_Write`, `GroupValue_Response`, `Update_NoWrite` (nur interner Wert, kein BUS‑Senden). **readstatus (boolean)**: Leseauftrag an den BUS. **dpt (string)**: z. B. `1.001`. **writeraw (buffer)**, **bitlenght (int)**: RAW‑Senden, `bitlenght` in Bit. **resetRBE (boolean)**: RBE‑Filter zurücksetzen. **setConfig (json)**: GA/DPT des Nodes per Nachricht ändern.

### setConfig Details

```javascript
var config= { setGroupAddress: "0/1/2", setDPT: "1.001" };
msg.setConfig = config; return msg;
```

```javascript
var config= { setGroupAddress: "0/1/2", setDPT: "auto" };
msg.setConfig = config; return msg;
```

### Outputs

1. Standardausgang: `payload` am PIN 1.
2. Fehler: `error` am PIN 2.

### Ausgehende Nachricht (Beispiel)

```json
msg = {
 topic: "0/1/2",
 payload: false,
 previouspayload: true,
 payloadmeasureunit: "%",
 payloadsubtypevalue: "Start",
 devicename: "Esstischlampe",
 gainfo: {
 maingroupname: "Light actuators",
 middlegroupname: "First flow lights",
 ganame: "Table Light",
 maingroupnumber: "1",
 middlegroupnumber: "1",
 ganumber: "0"
 },
 echoed: true,
 knx: {
 event: "GroupValue_Write",
 dpt: "1.001",
 dptdesc: "Humidity",
 source: "15.15.22",
 destination: "0/1/2",
 rawValue: "<buffer>"
 }
}
```

---

# EINGANGS‑NACHRICHT AUS DEM FLOW

## KNX‑Geräte steuern

Der Node nimmt Nachrichten entgegen und sendet sie auf den KNX‑BUS; eingehende BUS‑Telegramme werden als Nachrichten an den Flow ausgegeben. Alle Eigenschaften optional, außer `payload`. **msg.destination**: z. B. `0/0/1`. **msg.payload**: z. B. `true/false/21/"Hello"`. **msg.event**: `GroupValue_Write`/`GroupValue_Response`/`Update_NoWrite`. Bei `Update_NoWrite` geben alle Nodes mit derselben GA eine Meldung mit `event: 'Update_NoWrite'` aus.

Für Read statt `event` bitte `msg.readstatus = true` verwenden. **msg.readstatus = true**: Read an den BUS. **msg.dpt**: z. B. `1.001` (auch `9`, `"9"`, `"DPT9.001"`). **msg.writeraw**, **msg.bitlenght**: RAW‑Senden; ignoriert den am Node gesetzten DPT. **msg.resetRBE = true**: RBE‑Filter zurücksetzen.

## Konfiguration per Nachricht ändern

[Siehe Beispielseite.](/node-red-contrib-knx-ultimate/wiki/-Sample-setConfig)

---

# QUICK HOW TO

Weitere Beispiele [hier](/node-red-contrib-knx-ultimate/wiki/-SamplesHome) **LAMPE EINSCHALTEN** ```javascript
msg.payload = true; return msg;
``` **ABSOLUTES DIMMEN** ```javascript
msg.payload = 30; return msg;
``` **TEXT AN DISPLAY** ```javascript
msg.payload = "Output Tem. 35°C"; return msg;
``` **STATUS LESEN** ```javascript
msg.readstatus = true; return msg;
``` **RAW AN BUS SENDEN** ```javascript
msg.writeraw = Buffer.from('01','hex');
msg.bitlenght = 1; return msg;
// Temperatur (DPT9): 18.4 °C = <0730>
// msg.writeraw = Buffer.from('0730','hex'); return msg;
```
