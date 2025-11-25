---
layout: wiki
title: "Gateway-configuration"
lang: de
permalink: /wiki/de-Gateway-configuration
---
# KNX Gateway Konfiguration

Dieser Node stellt die Verbindung zu deinem KNX/IP‑Gateway her.

<div markdown="1" style="background:#e9f7e9;border:1px solid #c8e6c8;border-radius:10px;padding:14px 16px;margin:16px 0;">


### Using KNX Ultimate with kBerry on Raspberry Pi 3 (UART / FT1.2)

This guide explains how to connect a **kBerry** KNX interface directly
to a **Raspberry Pi 3** and use it with **KNX Ultimate** over the
**hardware UART** (`ttyAMA0`) using the **FT1.2 (TPUART)** protocol.

> This procedure is tested with Raspberry Pi OS Bookworm on a  
> Raspberry Pi 3 and has been written on November, 25, 2025.

## 1. Prerequisites

- Raspberry Pi 3 (Model B or B+)
- Raspberry Pi OS (Bookworm recommended)
- kBerry KNX interface mounted on the GPIO header
- Node-RED with KNX Ultimate installed
- Basic terminal access (SSH or local console)

## 2. Wiring / Hardware Overview

The kBerry uses the Raspberry Pi's primary UART:

- **TX / RX**: GPIO14 (TXD) and GPIO15 (RXD)
- **GND**: A common ground between Raspberry Pi and kBerry
- **Power**: Provided via the GPIO header

Make sure the kBerry is properly seated on the Raspberry Pi GPIO header
and that no other HAT is conflicting with those pins.

## 3. Disable Bluetooth and Enable the Hardware UART

### 3.1 Edit the correct config file (Bookworm)

```bash
sudo nano /boot/firmware/config.txt
```

Add:

```ini
enable_uart=1
dtoverlay=pi3-disable-bt
```

### 3.2 Disable ModemManager

```bash
sudo systemctl disable --now ModemManager
```

### 3.3 Disable Bluetooth service

```bash
sudo systemctl disable --now bluetooth.service
```

## 4. Disable Serial Login Console / Enable Hardware UART

```bash
sudo raspi-config
```

- Disable login shell on serial → **No**
- Enable serial hardware → **Yes**

Reboot.

## 5. Verify UART

```bash
ls -l /dev/serial0
ls -l /dev/ttyAMA0
dmesg | grep tty
```

Expected:

    /dev/serial0 -> ttyAMA0
    /dev/ttyAMA0 exists

## 6. Add Node-RED User to dialout

```bash
sudo usermod -aG dialout nodered
sudo reboot
```

## 7. Configure KNX Ultimate

- **Interface type**: Serial FT1.2 / TPUART
- **Serial port**: `/dev/ttyAMA0`
- **Baud rate**: 19200
- **Data bits**: 8
- **Parity**: Even
- **Stop bits**: 1

## 9. Troubleshooting

### No `/dev/ttyAMA0`

- Check `/boot/firmware/config.txt` entries
- Reboot
- Re-check `dmesg`

### `/dev/serial0` → `ttyS0`

- `dtoverlay=pi3-disable-bt` not applied
- Re-check config file path
- Reboot

### Serial cannot be opened

- Ensure user is in `dialout`
- Check that no other program uses `/dev/ttyAMA0`

---

Done.
</div>

**Allgemein**

|Eigenschaft|Beschreibung|
|--|--|
| Name | Name des Nodes. |
| Gateway | Gib die KNX/IP‑Adresse bzw. den Hostnamen oder einen seriellen Pfad (z. B. `/dev/ttyUSB0`) ein. Im Dropdown erscheinen automatisch erkannte KNX/IP‑Gateways sowie FT1.2‑Seriellports; beim Auswählen eines Serials wird das Protokoll auf Serial FT1.2 gesetzt und die UART‑Defaults werden übernommen. |

**Konfiguration**

|Eigenschaft|Beschreibung|
|--|--|
| Gateway-Port | Verbindungsport. Standard: `3671`. Für Serial FT1.2 nicht verwendet. |
| Verbindungsprotokoll | `Tunnel UDP` für KNX/IP‑Interfaces, `Multicast UDP` für KNX/IP‑Router, `Serial FT1.2` für TP/FT1.2‑Adapter (wird automatisch gewählt, wenn du einen Serialport auswählst). **Auto** versucht, das passende Protokoll zu ermitteln. |
| Serial FT1.2 Modus | Legt fest, wie die FT1.2‑Schnittstelle initialisiert wird: **KBerry/BAOS** aktiviert die spezielle Initialisierung für Weinzierl KBerry/BAOS‑Module (Reset, BAOS‑Link‑Layer‑Modus, keine GA‑Filter), während **Standard FT1.2** einen generischen FT1.2‑Adapter ohne KBerry‑spezifische Schritte verwendet. Standard ist KBerry/BAOS. |
| KNX Physical Address | Physikalische KNX‑Adresse, z. B. `1.1.200`. Standard: `15.15.22`. |
| Bind to local interface | Lokales Netzwerk‑Interface für die Kommunikation. "Auto" wählt automatisch. Bei mehreren Interfaces (Ethernet/WLAN) ist eine manuelle Auswahl empfehlenswert, damit keine UDP‑Telegramme verloren gehen. |
| Automatically connect to KNX BUS at start | Automatisch beim Start verbinden. Standard: "Yes". |
| Secure credentials source | Bestimme, wie KNX Secure Daten bereitgestellt werden: **ETS-Keyring-Datei ** (Data-Secure-Schlüssel und ggf. Tunneling-Zugangsdaten stammen aus dem Keyring),**Manuelle Zugangsdaten ** (nur KNX IP Tunnelling Secure mit manuell eingetragenem Benutzer) oder**Keyring + manuelles Tunnel-Passwort** (Data-Secure-Schlüssel aus dem Keyring, Tunnel-Benutzer/-Passwort manuell). Wichtig: KNX Data Secure Telegramme benötigen immer eine Keyring-Datei. |
| Tunnel interface individual address | Sichtbar, sobald die Option manuelle Zugangsdaten umfasst (Manuelle Zugangsdaten oder Keyring + manuelles Tunnel-Passwort). Optionale KNX-Individualadresse der sicheren Tunnel-Schnittstelle (z. B. `1.1.1`); leer lassen, damit KNX Ultimate automatisch verhandelt. |
| Tunnel user ID | Sichtbar bei manuellen Zugangsdaten. Optionale Kennung des KNX Secure Tunnel-Benutzers aus ETS. |
| Tunnel user password | Sichtbar bei manuellen Zugangsdaten. Passwort des KNX Secure Tunnel-Benutzers aus ETS. |

> **KNX Secure im Überblick** \
> • _KNX Data Secure_ schützt Gruppenadress-Telegramme und benötigt immer eine Keyring-Datei mit den Gruppenschlüsseln.\
> • _KNX IP Tunnelling Secure_ schützt den Verbindungsaufbau mittels Commissioning-Passwort. Je nach Modus stammt dieses aus dem Keyring oder wird manuell eingetragen.\
> • KNX/IP Secure (Tunnel-Handshake) gilt nur für IP-Transporte (Tunnel TCP / sicheres Routing). KNX Data Secure schützt Gruppenadress-Telegramme und kann sowohl über IP (Tunneling/Routing) als auch über TP via Serial FT1.2 verwendet werden, sofern ein ETS-Keyring vorhanden ist.

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
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/greenring.png"></td><td>Schutz gegen zyklische Referenzen (<a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Protections" target="_blank">siehe Seite</a>)</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/bluedot.png"></td><td>Auf Response‑Telegramme reagieren</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/bluering.png"></td><td>Node‑Wert automatisch als Response senden (<a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device" target="_blank">Virtual Device</a>)</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/greudot.png"></td><td>Auf Read‑Telegramme reagieren</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/greyring.png"></td><td>RBE‑Filter: Kein Telegramm gesendet</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/reddot.png"></td><td>Fehler oder getrennt</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/redring.png"></td><td>Node deaktiviert wegen zyklischer Referenz (<a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Protections" target="_blank">siehe Seite</a>)</td></tr>
    </table>
