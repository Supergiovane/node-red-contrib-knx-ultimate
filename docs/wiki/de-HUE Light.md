---
layout: wiki
title: "HUE Light"
lang: de
permalink: /wiki/de-HUE%20Light
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Light) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Light) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Light) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Light) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Light) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Light)

Dieser Node steuert HUE‑Leuchten (einzeln oder gruppiert) und ordnet Befehle/Zustände KNX‑Gruppenadressen zu.

**Allgemein**

| Eigenschaft | Beschreibung |
|--|--|
| KNX GW | Zu verwendendes KNX‑Gateway |
| HUE Bridge | Zu verwendender HUE Bridge |
| Name | HUE‑Leuchte oder ‑Gruppe (Autocomplete während der Eingabe) |

**Gerät lokalisieren**

Die Schaltfläche `Locate` (Play-Symbol) startet eine Hue-Identify-Sitzung für die ausgewählte Ressource. Solange die Sitzung aktiv ist, wechselt der Button auf das Stoppsymbol und die Bridge lässt die Leuchte – oder alle Leuchten der Gruppe – einmal pro Sekunde blinken. Drücke den Button erneut, um sofort zu beenden; andernfalls stoppt die Sitzung automatisch nach 10 Minuten.

**Optionen**

Hier verknüpfst du KNX‑Gruppenadressen mit den verfügbaren HUE‑Befehlen/Zuständen.

Im GA‑Feld Geräte‑Name oder GA eingeben; Vorschläge erscheinen während der Eingabe.

**Schalten**

| Eigenschaft | Beschreibung |
|--|--|
| Control | KNX‑GA zum Ein/Aus (Boolean true/false) |
| Status | GA für Schalt‑Status |

**Dim**

| Eigenschaft | Beschreibung |
|--|--|
| Control dim | Relatives Dimmen der Leuchte (Geschwindigkeit in **Behaviour** ) |
| Control % | Absolute Helligkeit (0-100 %) |
| Status % | GA für Helligkeits‑Status |
| Dim Speed (ms) | Dimmgeschwindigkeit in Millisekunden; gilt für Helligkeit und Tunable‑White (Berechnung 0 %→100 %) |
| Min Dim brightness | Untere Helligkeitsgrenze (Stoppt das Dimmen bei diesem %) |
| Max Dim brightness | Obere Helligkeitsgrenze |

**Tunable White**

| Eigenschaft | Beschreibung |
|--|--|
| Control dim | Weißtemperatur relativ dimmen (DPT 3.007), Geschwindigkeit in **Behaviour** |
| Control % | Weißtemperatur mit DPT 5.001; 0 = warm, 100 = kalt |
| Status % | GA für Temperatur‑Status (DPT 5.001; 0 = warm, 100 = kalt) |
| Control kelvin | **DPT 7.600: ** Kelvin im KNX‑Bereich 2000-6535 (Konvertierung nach HUE mirek).
**DPT 9.002:** Kelvin im HUE‑Bereich 2000-6535 K (Ambiance ab 2200 K). Kleine Abweichungen durch Konvertierung möglich |
| Status kelvin | **DPT 7.600: ** Kelvin lesen (KNX‑Bereich 2000-6535, konvertiert).
**DPT 9.002:** Kelvin lesen (HUE‑Bereich 2000-6535 K). Kleine Abweichungen möglich |
| Invert dim direction | Dimmrichtung invertieren |

**RGB/HSV**

| Eigenschaft | Beschreibung |
|--|--|
| **RGB‑Abschnitt** ||
| Control rgb | Farbe setzen per RGB‑Tripel (r,g,b), inkl. Gamut‑Korrektur. Farb‑Telegramm schaltet die Leuchte ein (Farbe/Helligkeit); r,g,b=0 schaltet aus |
| Status rgb | GA für Farb‑Status (RGB‑Tripel) |
| **HSV‑Abschnitt** ||
| Color H dim | Durch HSV‑Farbkreis (Hue) dimmen (DPT 3.007), Geschwindigkeit in **Behaviour** |
| Status H % | Status des Hue‑Werts |
| Control S dim | Sättigung dimmen (DPT 3.007), Geschwindigkeit in **Behaviour** |
| Status S % | GA für Sättigungs‑Status |
| Dim Speed (ms) | Dimmgeschwindigkeit (unten→oben) |

Hinweis: Die HSV‑Helligkeit "V" wird über die Standard‑ **Dim** ‑Steuerung geregelt.

**Effekte**

_Nicht-Hue-Basiseffekte_

| Eigenschaft | Beschreibung |
|--|--|
| Blink | _true_ = blinken, _false_ = stoppen. Lässt die Leuchte ein/aus blinken - ideal zum Signalisieren. Funktioniert mit allen HUE-Leuchten. |
| Color Cycle | _true_ = Start, _false_ = Stopp. Zufälliger Farbwechsel in Intervallen (nur für farbfähige Leuchten). Der Effekt startet ca. 10 s nach dem Kommando. |

_Hue-native Effekte_

Die Tabelle **Hue-native Effekte** ordnet KNX-Werte den vom Bridge gemeldeten Effekten zu (z. B. `candle`, `fireplace`, `prism`). Jede Zeile verknüpft einen KNX-Wert (Boolean, Zahl oder Text - je nach Datenpunkt) mit einem Hue-Effekt. Du kannst:

- den gemappten Wert senden, um den Effekt zu aktivieren;
- optional eine Status-GA angeben: der Node liefert beim Effektwechsel den gemappten Wert zurück. Existiert keine Zuordnung, wird der reine Effektname gesendet (benötigt Text-Datenpunkte wie 16.xxx).

**Behaviour**

| Eigenschaft | Beschreibung |
|--|--|
| Read status at startup | Beim Start/Voll‑Deploy Status aus HUE lesen und an KNX ausgeben |
| KNX brightness status | Verhalten der Helligkeits‑Status‑GA bei Ein/Aus (0 % senden und letzten Wert wiederherstellen vs. "as is") |
| On behaviour | Verhalten beim Einschalten (Farbe wählen / Temperatur+Helligkeit wählen / none) |
| Night lighting | Nacht‑Profil (Farbe oder Temperatur/Helligkeit) |
| Day/Night | GA zur Umschaltung Tag/Nacht (_true_ = Tag, _false_ = Nacht) |
| Invert Day/Night | Wert der Tag/Nacht‑GA invertieren |
| Node I/O pins | Ein/Ausblenden der Eingangs/Ausgangs‑Pins; Input folgt HUE API v2 (z. B. <code>msg.on = { on: true }</code>) |

Hinweis: Start/Stop‑Dimmen im KNX‑Modus wird über die üblichen Start/Stop‑Telegramme gesteuert.
