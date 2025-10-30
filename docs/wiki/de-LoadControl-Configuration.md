---
layout: wiki
title: "LoadControl-Configuration"
lang: de
permalink: /wiki/de-LoadControl-Configuration
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/LoadControl-Configuration) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-LoadControl-Configuration) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-LoadControl-Configuration) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-LoadControl-Configuration) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-LoadControl-Configuration) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-LoadControl-Configuration)

# KNX Load Control Node

Mit dem Load‑Control‑Node schaltest du Lasten (Waschmaschine, Ofen usw.) automatisch ab, wenn der Verbrauch einen Schwellwert überschreitet.
Das Abschalten erfolgt intelligent: der mögliche Geräteverbrauch wird berücksichtigt, um zu entscheiden, ob gemeinsam mit anderen abgeschaltet wird.
Der Node kann Lasten automatisch wieder zuschalten.
Es wird jeweils ein Gerät (oder mehrere) in der konfigurierten Reihenfolge geschaltet.

**Allgemein**

|Eigenschaft|Beschreibung|
|--|--|
| Gateway | KNX‑Gateway. Ohne Auswahl werden nur Eingangs‑Nachrichten berücksichtigt. |
| Monitor Wh | GA für den Gesamtverbrauch des Gebäudes. |
| Limit Wh | Maximaler Zähler/Vertragsschwellwert. Bei Überschreitung beginnt das Abschalten. |
| Delay switch off (s) | Prüfintervall (Sekunden) zum Abschalten. |
| Delay switch on (s) | Prüfintervall (Sekunden) zum Wiederzuschalten. |

**Load Control**

Füge Geräte hinzu, die bei Überlast abgeschaltet werden sollen.
Wähle das Gerät über Name oder GA.
Optional: GA mit Geräteleistung angeben. Überschreitet die Leistung einen Grenzwert, gilt das Gerät als "in Benutzung". Bei geringem Verbrauch kann es zusammen mit dem nächsten abgeschaltet werden.
Ist "Automatische Wiederherstellung" aktiv, wird nach Ablauf des Reset‑Delays wieder eingeschaltet.

## Inputs

|Eigenschaft|Beschreibung|
|--|--|
| `msg.readstatus = true` | Liest die aktuellen Watt‑Werte aller gelisteten Geräte vom BUS (normalerweise automatisch). |
| `msg.enable = true` | Lastabwurf aktivieren. |
| `msg.disable = true` | Lastabwurf deaktivieren. |
| `msg.reset = true` | Node zurücksetzen und alle Geräte einschalten. |
| `msg.shedding` | String: `shed` = Vorwärts‑Abwurf, `unshed` = Rücknahme. Start/Stop des Timers erzwingen (ignoriert Monitor‑GA). `auto` reaktiviert die Überwachung der Monitor‑GA. |

## Outputs

1. Standardausgang: `payload (string|object)` mit dem Ergebnis.

## Details

```javascript
msg = {
  topic: "Home Total Consumption",
  operation: "Increase Shedding" | "Decrease Shedding" | "enable/disable/reset",
  device: "Washing machine",
  ga: "",
  totalPowerConsumption: 3100,
  wattLimit: 3000,
  payload: 1
}
```

# Beispiel

<a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/SampleLoadControl">HIER KLICKEN FÜR DAS BEISPIEL</a>
