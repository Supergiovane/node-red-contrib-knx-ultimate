🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/HUE+Light) | [IT](/node-red-contrib-knx-ultimate/wiki/it-HUE+Light) | [DE](/node-red-contrib-knx-ultimate/wiki/de-HUE+Light) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-HUE+Light) | [ES](/node-red-contrib-knx-ultimate/wiki/es-HUE+Light) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Light)

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

<p>Dieser Node steuert HUE‑Leuchten (einzeln oder gruppiert) und ordnet Befehle/Zustände KNX‑Gruppenadressen zu.</p>

**Allgemein**
| Eigenschaft | Beschreibung |
|--|--|
| KNX GW | Zu verwendendes KNX‑Gateway |
| HUE Bridge | Zu verwendender HUE Bridge |
| Name | HUE‑Leuchte oder ‑Gruppe (Autocomplete während der Eingabe) |

<br/>

**Gerät lokalisieren**

Die Schaltfläche `Locate` (Play-Symbol) startet eine Hue-Identify-Sitzung für die ausgewählte Ressource. Solange die Sitzung aktiv ist, wechselt der Button auf das Stoppsymbol und die Bridge lässt die Leuchte – oder alle Leuchten der Gruppe – einmal pro Sekunde blinken. Drücke den Button erneut, um sofort zu beenden; andernfalls stoppt die Sitzung automatisch nach 10 Minuten.

<br/>

**Optionen**

Hier verknüpfst du KNX‑Gruppenadressen mit den verfügbaren HUE‑Befehlen/Zuständen.<br/>
Im GA‑Feld Geräte‑Name oder GA eingeben; Vorschläge erscheinen während der Eingabe.

**Schalten**
| Eigenschaft | Beschreibung |
|--|--|
| Control | KNX‑GA zum Ein/Aus (Boolean true/false) |
| Status | GA für Schalt‑Status |

<br/>

**Dim**
| Eigenschaft | Beschreibung |
|--|--|
| Control dim | Relatives Dimmen der Leuchte (Geschwindigkeit in **Behaviour** ) |
| Control % | Absolute Helligkeit (0-100 %) |
| Status % | GA für Helligkeits‑Status |
| Dim Speed (ms) | Dimmgeschwindigkeit in Millisekunden; gilt für Helligkeit und Tunable‑White (Berechnung 0 %→100 %) |
| Min Dim brightness | Untere Helligkeitsgrenze (Stoppt das Dimmen bei diesem %) |
| Max Dim brightness | Obere Helligkeitsgrenze |

<br/>

**Tunable White**
| Eigenschaft | Beschreibung |
|--|--|
| Control dim | Weißtemperatur relativ dimmen (DPT 3.007), Geschwindigkeit in **Behaviour** |
| Control % | Weißtemperatur mit DPT 5.001; 0 = warm, 100 = kalt |
| Status % | GA für Temperatur‑Status (DPT 5.001; 0 = warm, 100 = kalt) |
| Control kelvin | **DPT 7.600: ** Kelvin im KNX‑Bereich 2000-6535 (Konvertierung nach HUE mirek).<br/>**DPT 9.002:** Kelvin im HUE‑Bereich 2000-6535 K (Ambiance ab 2200 K). Kleine Abweichungen durch Konvertierung möglich |
| Status kelvin | **DPT 7.600: ** Kelvin lesen (KNX‑Bereich 2000-6535, konvertiert).<br/>**DPT 9.002:** Kelvin lesen (HUE‑Bereich 2000-6535 K). Kleine Abweichungen möglich |
| Invert dim direction | Dimmrichtung invertieren |

<br/>

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

<br/>

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

<br/>

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

<br/>
