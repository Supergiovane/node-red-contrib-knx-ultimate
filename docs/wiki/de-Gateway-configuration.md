---
layout: wiki
title: "Gateway-configuration"
lang: de
permalink: /wiki/de-Gateway-configuration
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Gateway-configuration) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-Gateway-configuration) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-Gateway-configuration) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-Gateway-configuration) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-Gateway-configuration) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-Gateway-configuration)

# KNX Gateway Konfiguration

Dieser Node stellt die Verbindung zu deinem KNX/IP‑Gateway her.

**Allgemein**

|Eigenschaft|Beschreibung|
|--|--|
| Name | Name des Nodes. |
| IP/Hostname | Multicast‑Adresse des ETH/KNX‑Routers oder Unicast‑IP einer KNX/IP‑Schnittstelle. Für Interfaces nutze die Geräte‑IP (z. B. 192.168.1.22); für Router `224.0.23.12`. Hostname ist ebenfalls möglich. |

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

**Erweitert**

|Eigenschaft|Beschreibung|
|--|--|
| Echo sent message to all node with same Group Address | Leitet Flow‑Nachrichten an alle Nodes mit derselben GA weiter, so als kämen sie vom BUS. Nützlich bei KNX‑Emulation oder fehlender BUS‑Verbindung. **Wird künftig standardmäßig aktiviert und dann entfernt.** |
| Suppress repeated (R-Flag) telegrams fom BUS | Wiederholte BUS‑Telegramme (R‑Flag) ignorieren. |
| Suppress ACK request in tunneling mode | Für sehr alte KNX/IP‑Gateways: ACK ignorieren, alle Telegramme akzeptieren. |
| Delay between each telegram (ms) | KNX erlaubt max. 50 Telegramme/s. 25-50 ms sind üblich; bei langsamen Verbindungen höher (z. B. 200-500 ms). |
| Loglevel | Log‑Detailgrad. Standard: "Error". |
| Aktualisierung der Status-Badges | Legt fest, wie oft die Statusanzeige der Nodes erneuert wird. Mit einer Verzögerung werden Zwischenstände verworfen und nur der letzte Wert nach dem gewählten Intervall angezeigt. Wählen Sie **Sofort**, um das bisherige Echtzeitverhalten beizubehalten. |

**ETS‑Import**

|Eigenschaft|Beschreibung|
|--|--|
| If Group Address has no Datapoint | Wenn eine GA keinen DPT hat: Import abbrechen, GA überspringen oder GA mit Platzhalter‑DPT `1.001` übernehmen. |
| ETS group address list | Inhalt der ETS‑Datei (CSV/ESF) einfügen oder Dateipfad angeben (z. B. `/home/pi/mycsv.csv`). Siehe Hilfelinks. |

**Werkzeuge**

|Eigenschaft|Beschreibung|
|--|--|
| Gather debug info for troubleshoot | Button klicken und Ausgabe an ein GitHub‑Issue anhängen. |
| Get all used GA for KNX routing filter | Mit READ eine Textliste aller in Flows verwendeten GAs für dieses Gateway holen - zum Befüllen der Filtertabelle deines KNX/IP‑Routers. |

# Arbeit mit ETS‑CSV oder ESF

Statt für jede GA einen Node anzulegen, importiere die ETS‑Gruppenadressen als CSV (empfohlen) oder ESF (ab v1.1.35, z. B. bei ETS Inside). Unterstützt ab ETS 4.

Seit v1.4.18 kann der Dateipfad direkt eingetragen werden (z. B. `/home/pi/mycsv.csv`).

Mit **Universal mode (listen to all Group Addresses)** wird der Node zu einem universellen I/O‑Node, der DPTs, GAs und Gerätenamen kennt. Eingehende Payloads werden mit passendem DPT kodiert; BUS‑Telegramme werden anhand des ETS‑DPT dekodiert.

Seit v1.1.11 ist der Universal‑Modus auch ohne ETS möglich: DPT und Wert per Nachricht übergeben. Bei BUS‑Eingang wird zusätzlich der RAW‑Wert ausgegeben und nach Möglichkeit ohne DPT dekodiert.

Hinweis: CSV enthält genaue DPTs inkl. Subtyp; ESF hat keinen Subtyp. Bevorzuge CSV, da ESF zu falschen Werten führen kann. Nach ESF‑Import DPTs prüfen/anpassen. Ab v1.4.1 ist Import auch zur Laufzeit per WatchDog möglich.

Video: <a href="https://youtu.be/egRbR_KwP9I"><img src='https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/yt.png'></a>

- **ETS‑CSV Gruppenadressen importieren ** Achtung: Im GA‑Namen dürfen keine Tabulator‑Zeichen vorkommen.**If Group Address has no Datapoint ** > Ohne DPT in ETS: Import abbrechen, GA überspringen oder mit Platzhalter‑DPT fortfahren.**CSV‑Export in ETS**

> In ETS Gruppenadressenliste wählen → Rechtsklick → Exportieren. Optionen:

> Output Format: CSV

> CSV Format: 1/1 Name/Address

> Export with header line: aktiv

> CSV Separator: Tabulator

> Dann den Dateitext hier einfügen. Datei muss pro GA einen DPT enthalten. Ergebnisse erscheinen in Node‑RED DEBUG.

> Ergebnisse: **ERROR ** (DPT fehlt → Import stoppt) oder**WARNING ** (Subtyp fehlt → Default wird ergänzt, bitte prüfen). Subtyp ist die Zahl rechts vom Punkt, z. B. `5.001`.**ESF‑Export in ETS**

> Projekt wählen → Export‑Symbol (Pfeil nach oben) → ESF wählen (nicht `.knxprod`) → Inhalt im Feld "ETS group address list" einfügen.

    <table style="font-size:12px">
        <tr><th colspan="2" style="font-size:14px">Statusfarben des Nodes</th></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/greendot.png"></td><td>Auf Write‑Telegramme reagieren</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/greenring.png"></td><td>Schutz gegen zyklische Referenzen (<a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki" target="_blank">siehe Seite</a>)</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/bluedot.png"></td><td>Auf Response‑Telegramme reagieren</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/bluering.png"></td><td>Node‑Wert automatisch als Response senden (<a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device" target="_blank">Virtual Device</a>)</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/greudot.png"></td><td>Auf Read‑Telegramme reagieren</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/greyring.png"></td><td>RBE‑Filter: Kein Telegramm gesendet</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/reddot.png"></td><td>Fehler oder getrennt</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/redring.png"></td><td>Node deaktiviert wegen zyklischer Referenz (<a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki" target="_blank">siehe Seite</a>)</td></tr>
    </table>
