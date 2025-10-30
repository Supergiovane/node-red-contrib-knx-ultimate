🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/Gateway-configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-Gateway-configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-Gateway-configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-Gateway-configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-Gateway-configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-Gateway-configuration)

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

# KNX Gateway Konfiguration

Dieser Node stellt die Verbindung zu deinem KNX/IP‑Gateway her.

**Allgemein**
|Eigenschaft|Beschreibung|
|--|--|
| Name | Name des Nodes. |
| IP/Hostname | Multicast‑Adresse des ETH/KNX‑Routers oder Unicast‑IP einer KNX/IP‑Schnittstelle. Für Interfaces nutze die Geräte‑IP (z. B. 192.168.1.22); für Router `224.0.23.12`. Hostname ist ebenfalls möglich. |

<br/>

**Konfiguration**
|Eigenschaft|Beschreibung|
|--|--|
| IP Port | Verbindungsport. Standard: `3671`. |
| IP Protocol | `Tunnel UDP` für KNX/IP‑Interfaces, `Multicast UDP` für KNX/IP‑Router. **Auto** erkennt automatisch (Standard). |
| KNX Physical Address | Physikalische KNX‑Adresse, z. B. `1.1.200`. Standard: `15.15.22`. |
| Bind to local interface | Lokales Netzwerk‑Interface für die Kommunikation. "Auto" wählt automatisch. Bei mehreren Interfaces (Ethernet/WLAN) ist eine manuelle Auswahl empfehlenswert, damit keine UDP‑Telegramme verloren gehen. |
| Automatically connect to KNX BUS at start | Automatisch beim Start verbinden. Standard: "Yes". |
| Secure credentials source | Bestimme, wie KNX Secure Daten bereitgestellt werden: **ETS-Keyring-Datei ** (Data-Secure-Schlüssel und ggf. Tunneling-Zugangsdaten stammen aus dem Keyring),**Manuelle Zugangsdaten ** (nur KNX IP Tunnelling Secure mit manuell eingetragenem Benutzer) oder**Keyring + manuelles Tunnel-Passwort** (Data-Secure-Schlüssel aus dem Keyring, Tunnel-Benutzer/-Passwort manuell). Wichtig: KNX Data Secure Telegramme benötigen immer eine Keyring-Datei. |
| Tunnel interface individual address | Sichtbar, sobald die Option manuelle Zugangsdaten umfasst (Manuelle Zugangsdaten oder Keyring + manuelles Tunnel-Passwort). Optionale KNX-Individualadresse der sicheren Tunnel-Schnittstelle (z. B. `1.1.1`); leer lassen, damit KNX Ultimate automatisch verhandelt. |
| Tunnel user ID | Sichtbar bei manuellen Zugangsdaten. Optionale Kennung des KNX Secure Tunnel-Benutzers aus ETS. |
| Tunnel user password | Sichtbar bei manuellen Zugangsdaten. Passwort des KNX Secure Tunnel-Benutzers aus ETS. |

> **KNX Secure im Überblick** \
> • _KNX Data Secure_ schützt Gruppenadress-Telegramme und benötigt immer eine Keyring-Datei mit den Gruppenschlüsseln.\
> • _KNX IP Tunnelling Secure_ schützt den Verbindungsaufbau mittels Commissioning-Passwort. Je nach Modus stammt dieses aus dem Keyring oder wird manuell eingetragen.

<br/>

**Erweitert**
|Eigenschaft|Beschreibung|
|--|--|
| Echo sent message to all node with same Group Address | Leitet Flow‑Nachrichten an alle Nodes mit derselben GA weiter, so als kämen sie vom BUS. Nützlich bei KNX‑Emulation oder fehlender BUS‑Verbindung. **Wird künftig standardmäßig aktiviert und dann entfernt.** |
| Suppress repeated (R-Flag) telegrams fom BUS | Wiederholte BUS‑Telegramme (R‑Flag) ignorieren. |
| Suppress ACK request in tunneling mode | Für sehr alte KNX/IP‑Gateways: ACK ignorieren, alle Telegramme akzeptieren. |
| Delay between each telegram (ms) | KNX erlaubt max. 50 Telegramme/s. 25-50 ms sind üblich; bei langsamen Verbindungen höher (z. B. 200-500 ms). |
| Loglevel | Log‑Detailgrad. Standard: "Error". |
| Aktualisierung der Status-Badges | Legt fest, wie oft die Statusanzeige der Nodes erneuert wird. Mit einer Verzögerung werden Zwischenstände verworfen und nur der letzte Wert nach dem gewählten Intervall angezeigt. Wählen Sie **Sofort**, um das bisherige Echtzeitverhalten beizubehalten. |

<br/>

**ETS‑Import**
|Eigenschaft|Beschreibung|
|--|--|
| If Group Address has no Datapoint | Wenn eine GA keinen DPT hat: Import abbrechen, GA überspringen oder GA mit Platzhalter‑DPT `1.001` übernehmen. |
| ETS group address list | Inhalt der ETS‑Datei (CSV/ESF) einfügen oder Dateipfad angeben (z. B. `/home/pi/mycsv.csv`). Siehe Hilfelinks. |

<br/>

**Werkzeuge**
|Eigenschaft|Beschreibung|
|--|--|
| Gather debug info for troubleshoot | Button klicken und Ausgabe an ein GitHub‑Issue anhängen. |
| Get all used GA for KNX routing filter | Mit READ eine Textliste aller in Flows verwendeten GAs für dieses Gateway holen - zum Befüllen der Filtertabelle deines KNX/IP‑Routers. |

<br/>

# Arbeit mit ETS‑CSV oder ESF

Statt für jede GA einen Node anzulegen, importiere die ETS‑Gruppenadressen als CSV (empfohlen) oder ESF (ab v1.1.35, z. B. bei ETS Inside). Unterstützt ab ETS 4.

Seit v1.4.18 kann der Dateipfad direkt eingetragen werden (z. B. `/home/pi/mycsv.csv`).

Mit **Universal mode (listen to all Group Addresses)** wird der Node zu einem universellen I/O‑Node, der DPTs, GAs und Gerätenamen kennt. Eingehende Payloads werden mit passendem DPT kodiert; BUS‑Telegramme werden anhand des ETS‑DPT dekodiert.

Seit v1.1.11 ist der Universal‑Modus auch ohne ETS möglich: DPT und Wert per Nachricht übergeben. Bei BUS‑Eingang wird zusätzlich der RAW‑Wert ausgegeben und nach Möglichkeit ohne DPT dekodiert.

Hinweis: CSV enthält genaue DPTs inkl. Subtyp; ESF hat keinen Subtyp. Bevorzuge CSV, da ESF zu falschen Werten führen kann. Nach ESF‑Import DPTs prüfen/anpassen. Ab v1.4.1 ist Import auch zur Laufzeit per WatchDog möglich.

Video: <a href="https://youtu.be/egRbR_KwP9I"><img src='https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/yt.png'></a>

- **ETS‑CSV Gruppenadressen importieren ** Achtung: Im GA‑Namen dürfen keine Tabulator‑Zeichen vorkommen.**If Group Address has no Datapoint ** > Ohne DPT in ETS: Import abbrechen, GA überspringen oder mit Platzhalter‑DPT fortfahren.**CSV‑Export in ETS**

> In ETS Gruppenadressenliste wählen → Rechtsklick → Exportieren. Optionen:<br/>
> Output Format: CSV<br/>
> CSV Format: 1/1 Name/Address<br/>
> Export with header line: aktiv<br/>
> CSV Separator: Tabulator<br/>
> Dann den Dateitext hier einfügen. Datei muss pro GA einen DPT enthalten. Ergebnisse erscheinen in Node‑RED DEBUG.

> Ergebnisse: **ERROR ** (DPT fehlt → Import stoppt) oder**WARNING ** (Subtyp fehlt → Default wird ergänzt, bitte prüfen). Subtyp ist die Zahl rechts vom Punkt, z. B. `5.001`.**ESF‑Export in ETS**

> Projekt wählen → Export‑Symbol (Pfeil nach oben) → ESF wählen (nicht `.knxprod`) → Inhalt im Feld "ETS group address list" einfügen.

<p>
    <table style="font-size:12px">
        <tr><th colspan="2" style="font-size:14px">Statusfarben des Nodes</th></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/greendot.png"></td><td>Auf Write‑Telegramme reagieren</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/greenring.png"></td><td>Schutz gegen zyklische Referenzen (<a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki" target="_blank">siehe Seite</a>)</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/bluedot.png"></td><td>Auf Response‑Telegramme reagieren</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/bluering.png"></td><td>Node‑Wert automatisch als Response senden (<a href="/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device" target="_blank">Virtual Device</a>)</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/greudot.png"></td><td>Auf Read‑Telegramme reagieren</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/greyring.png"></td><td>RBE‑Filter: Kein Telegramm gesendet</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/reddot.png"></td><td>Fehler oder getrennt</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/redring.png"></td><td>Node deaktiviert wegen zyklischer Referenz (<a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki" target="_blank">siehe Seite</a>)</td></tr>
    </table>
</p>
