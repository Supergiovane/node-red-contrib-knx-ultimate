---
layout: wiki
title: "HUE Controller"
lang: de
permalink: /wiki/de-HUE%20Controller
---
# HUE Controller

[**KNX-Ultimate video tutorials (YouTube playlist)**](https://www.youtube.com/playlist?list=PL9Yh1bjbLAYrU8PsVhW4xzEug2WtVFv3E)

<div data-hue-controller-overview="hero" style="margin:18px 0 28px;padding:24px;border-radius:16px;background:linear-gradient(135deg,#0b2d5a 0%,#1767bf 55%,#2a8dff 100%);box-shadow:0 14px 30px rgba(11,45,90,0.24);color:#f4f9ff;">
  <div style="font-size:0.72rem;letter-spacing:0.18em;text-transform:uppercase;font-weight:700;color:#cfe4ff;">Hue API v2 · KNX · Node-RED</div>
  <div style="font-size:1.75rem;line-height:1.15;font-weight:800;margin:8px 0 10px;">Ein Node. Fünfzehn Hue-Funktionen.</div>
  <p style="margin:0 0 18px;max-width:860px;line-height:1.6;color:#f4f9ff;">HUE Controller vereint den vollständigen, bewährten Funktionsumfang der früheren dedizierten Hue-Nodes in einem eigenständigen, gepflegten Node. Hue-Gerät oder -Ressource auswählen – der Typ wird automatisch erkannt und Editor, KNX-Zuordnungen sowie Flow-Anschlüsse passen sich an.</p>
  <div style="display:flex;flex-wrap:wrap;gap:10px;">
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.12);"><strong style="display:block;font-size:1.05rem;color:#fff;">15</strong><span style="font-size:0.76rem;color:#e8f3ff;">Gerätefunktionen</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.12);"><strong style="display:block;font-size:1.05rem;color:#fff;">Hue API v2</strong><span style="font-size:0.76rem;color:#e8f3ff;">native Ressourcen</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.12);"><strong style="display:block;font-size:1.05rem;color:#fff;">KNX</strong><span style="font-size:0.76rem;color:#e8f3ff;">optionale Integration</span></div>
  </div>
</div>

## Alles in einem Node

| Bereich | Funktionen | Wichtigste Möglichkeiten |
|---|---|---|
| **Licht & Leistung** | Leuchte / Leuchtengruppe, Steckdose | Ein/Aus, relatives und absolutes Dimmen, Tunable White, RGB/HSV, Effekte, Tag/Nacht-Profile, Locate, Leistungsschaltung und bidirektionale Rückmeldung. |
| **Szenen & Bedienung** | Szene, Taster, Tap dial | Einzelner oder nummerierter Szenenaufruf, DPT-1/18-Zuordnung, kurzer/langer/wiederholter Tastendruck, Umschaltlogik und Drehereignisse. |
| **Präsenz & Sicherheit** | Bewegung, Bereichsbewegung, Kamerabewegung, Kontakt | Bewegungs- und Offen/Geschlossen-Zustände, Start-Synchronisation, KNX-Veröffentlichung und optionale Flow-Ereignisse. |
| **Umgebung** | Lichtstärke, Temperatur, Luftfeuchtigkeit | Hue-Sensormesswerte auf die passenden KNX-Datenpunkte abbilden. |
| **Gerätezustand** | Batterie, Zigbee-Verbindung, Softwareupdate | Batteriestand, Verbindungsstatus und verfügbare Updates auf KNX oder im Node-RED-Flow. |

## Ein konsistentes Controller-Erlebnis

- Eine geräteorientierte Hue-Ressourcensuche mit Autovervollständigung und Aktualisierung; die passende Funktion wird automatisch ermittelt.
- Ein Klick oder Fokus auf das Gerätefeld öffnet auch nach einer Auswahl immer die vollständige Hue-Liste; Tippen filtert sie.
- Fähigkeitsabhängige Leuchtenzuordnungen: Dimmen, abstimmbares Weiß, RGB/HSV und native Effekte folgen den Live-Eigenschaften `dimming`, `color_temperature`, `color` und `effects` der ausgewählten Hue-API-v2-Leuchtenressource.
- Begrenzte Bereitschaftsprüfung im Leuchteneditor: Während die Hue Bridge ihre Ressourcen lädt, erscheint eine animierte Sanduhr; die Prüfung erfolgt alle 500 ms und gibt den Editor nach etwa 10 Sekunden mit einer lokalisierten Fehlermeldung frei. Speichern, Schließen und Funktionswechsel beenden den Timer.
- Robuster Leuchteneditor: Locate und der Zuordnungsbereich werden vor den optionalen Effekt- und Register-Widgets initialisiert. Ein browserseitiger Fehler erzeugt eine feste Node-RED-Meldung mit Phase und technischem Detail, statt den Editor still und leer zu lassen.
- Kompakte KNX-Zuordnungszeilen halten GA, DPT und Name in einer Zeile; DPT und Name verwenden reduzierte Breiten, wobei sich das Namensfeld in schmalen Editoren ohne Änderung des gespeicherten Werts weiter verkleinern kann. Gespeicherte DPT-Werte bleiben erhalten, während die Auswahloptionen asynchron geladen werden.
- Optionales KNX-Gateway: Gruppenadressen oder importierte ETS-Namen verwenden; passende Datenpunkte liefert das ausgewählte Gateway.
- Profildynamische Node-RED-Anschlüsse für validierte Hue-API-v2-Eingaben und Hue-Ereignisse, sofern unterstützt.
- Startabfrage, Hue→KNX-Statussynchronisation und Schleifenschutz in jedem privaten Profil.
- Vollständig lokale Migration aller fünfzehn veralteten Knotentypen mit anschließendem bearbeitbarem E-Mail-Entwurf, optionaler Unterstützungsschaltfläche in der Abschlussmeldung, lokaler Prüfung und manuellem Deploy.

## Start in vier Schritten

1. Die **Hue Bridge** einmal konfigurieren.
2. **HUE Controller** hinzufügen und ein **Hue-Gerät** auswählen oder aktualisieren; der **Gerätetyp** wird automatisch eingetragen.
3. Ein **KNX-Gateway** auswählen und Befehle/Zustände zuordnen – oder `none` für reine Flow-Nutzung belassen.
4. Funktionsspezifisches Verhalten und Anschlüsse festlegen, deployen und den Live-Status prüfen.

> **Kein KNX-Gateway?** Der Controller funktioniert weiterhin als Hue-zu-Node-RED-Integration. KNX-Felder werden ausgeblendet; die von der gewählten Funktion unterstützten Flow-Optionen bleiben verfügbar.

Die folgenden Abschnitte bilden die vollständige, aus den früheren dedizierten Nodes konsolidierte Funktionsreferenz.

## Legacy-HUE-Knoten konvertieren

Der Migrationsbutton erscheint nur, wenn der Node-RED-Editor mindestens einen Legacy-HUE-Knoten in den aktuellen Flows erkennt. Ein Link zur [Videoanleitung für die Migration auf YouTube](https://youtu.be/f0Evf2QFI7c) steht unmittelbar vor demselben kontrastreichen orangefarbenen Button mit weißer Beschriftung in HUE Controller und jedem Legacy-HUE-Editor. Der Hinweis bestätigt, dass keine Flow- oder Knotendaten den Browser verlassen.

Klicken Sie auf **Legacy-HUE-Knoten konvertieren** und bestätigen Sie. Der Browser führt die gesamte Konvertierung lokal aus und sendet keinerlei Flow-, Knoten-, `hue-config`-, `knxUltimate-config`-, Gruppenadress-, Verbindungs-, Zugangs-, Namens-, Positions- oder Knoten-ID-Daten. Nach erfolgreicher Konvertierung öffnet er nur einen bearbeitbaren E-Mail-Entwurf an den Autor, ohne Node-RED zu verlassen. Der Entwurf enthält nur die Anzahl konvertierter Knoten und Platz für optionale Hinweise; Sie entscheiden über das Senden und automatisch gesendet wird er nie. Die abschließende Node-RED-Meldung bietet eine optionale Unterstützungsschaltfläche; die Spendenseite öffnet sich nur nach einem Klick darauf.

Exportieren Sie vor dem Start eine Sicherung Ihrer Flows. Der Browser schließt den aktuellen Knoteneditor und ändert ausschließlich die erkannten Legacy-HUE-Knoten in HUE-Controller-Instanzen. Gespeicherte Eigenschaften, Konfigurationsreferenzen, Positionen, Gruppenzugehörigkeit und Verbindungen bleiben unverändert. Der Arbeitsbereich wird als geändert markiert, aber nie automatisch deployt: Prüfen Sie das Ergebnis und klicken Sie selbst auf **Deploy**. Geänderte Knoten, gesperrte Flows oder lokale Konvertierungsfehler lassen den Arbeitsbereich unverändert. **Sicherheitsprüfung:** Prüfen Sie vor dem Deploy jeden geänderten HUE-Knoten einschließlich Funktion, Konfigurationsreferenzen, Ein-/Ausgangsanschlüssen und Verbindungen. Nach Abschluss bleibt eine feste Node-RED-Meldung sichtbar, bis Sie auf **OK** klicken.

Hue-Ereignisse bleiben Statusaktualisierungen und werden nicht zu neuen Hue-Befehlen. HUE Controller enthält private Profile für Runtime, Editor, Vorlagen und Übersetzungen und ist daher nicht vom Laden der veralteten Knotentypen abhängig. Der ursprüngliche Hue-Light-Knoten bleibt unverändert. Die dedizierten Hue-Knoten bleiben für bestehende Flows registriert, sind jedoch eingefroren und erhalten keine neuen Funktionen oder Wartungsupdates. Node-RED blendet ihre spezielle Kategorie `deprecated` aus der Palette aus; vorhandene Instanzen bleiben bearbeitbar und einsatzfähig, verwenden eine hellere Farbe als HUE Controller, sind auf der Arbeitsfläche mit `(deprecated)` gekennzeichnet und zeigen oben im Editor einen Migrationshinweis.

<!-- HUE_CONTROLLER_PROFILE_DOCS_START -->

## Gerätefunktion

- [Leuchte / Leuchtengruppe (`light`)](#hue-controller-docs-light)
- [Steckdose / Ausgang (`plug`)](#hue-controller-docs-plug)
- [Taster (`button`)](#hue-controller-docs-button)
- [Tap dial (`relative_rotary`)](#hue-controller-docs-relative_rotary)
- [Bewegung (`motion`)](#hue-controller-docs-motion)
- [Bereichsbewegung (`area_motion`)](#hue-controller-docs-area_motion)
- [Kamerabewegung (`camera_motion`)](#hue-controller-docs-camera_motion)
- [Kontakt (`contact`)](#hue-controller-docs-contact)
- [Lichtstärke (`light_level`)](#hue-controller-docs-light_level)
- [Temperatur (`temperature`)](#hue-controller-docs-temperature)
- [Luftfeuchtigkeit (`humidity`)](#hue-controller-docs-humidity)
- [Szene (`scene`)](#hue-controller-docs-scene)
- [Batterie (`device_power`)](#hue-controller-docs-device_power)
- [Zigbee-Verbindung (`zigbee_connectivity`)](#hue-controller-docs-zigbee_connectivity)
- [Geräte-Softwareupdate (`device_software_update`)](#hue-controller-docs-device_software_update)

<span id="hue-controller-docs-light" data-hue-controller-type="light"></span>

## Leuchte / Leuchtengruppe (`light`)

Dieser Node steuert HUE-Leuchten (einzeln oder gruppiert) und ordnet Befehle/Zustände KNX-Gruppenadressen zu.

**Allgemein**

| Eigenschaft | Beschreibung |
|--|--|
| KNX-Gateway | Zu verwendendes KNX-Gateway |
| Hue Bridge | Zu verwendende Hue Bridge |
| Name | HUE-Leuchte oder -Gruppe (Autocomplete während der Eingabe) |

**Gerät lokalisieren**

Die Schaltfläche `Locate` (Play-Symbol) startet eine Hue-Identify-Sitzung für die ausgewählte Ressource. Solange die Sitzung aktiv ist, wechselt der Button auf das Stoppsymbol und die Bridge lässt die Leuchte – oder alle Leuchten der Gruppe – einmal pro Sekunde blinken. Drücke den Button erneut, um sofort zu beenden; andernfalls stoppt die Sitzung automatisch nach 10 Minuten.

**Optionen**

Hier verknüpfst du KNX-Gruppenadressen mit den verfügbaren HUE-Befehlen/Zuständen.

Im GA-Feld Geräte-Name oder GA eingeben; Vorschläge erscheinen während der Eingabe.

**Schalten**

| Eigenschaft | Beschreibung |
|--|--|
| Control | KNX-GA zum Ein/Aus (Boolean true/false) |
| Status | GA für Schalt-Status |

**Dim**

| Eigenschaft | Beschreibung |
|--|--|
| Control dim | Relatives Dimmen der Leuchte (Geschwindigkeit in **Behaviour** ) |
| Control % | Absolute Helligkeit (0-100 %) |
| Status % | GA für Helligkeits-Status |
| Dim Speed (ms) | Dimmgeschwindigkeit in Millisekunden; gilt für Helligkeit und Tunable-White (Berechnung 0 %→100 %) |
| Min Dim brightness | Untere Helligkeitsgrenze (Stoppt das Dimmen bei diesem %) |
| Max Dim brightness | Obere Helligkeitsgrenze |

**Tunable White**

| Eigenschaft | Beschreibung |
|--|--|
| Control dim | Weißtemperatur relativ dimmen (DPT 3.007), Geschwindigkeit in **Behaviour** |
| Control % | Weißtemperatur mit DPT 5.001; 0 = warm, 100 = kalt |
| Status % | GA für Temperatur-Status (DPT 5.001; 0 = warm, 100 = kalt) |
| Control kelvin | **DPT 7.600: ** Kelvin im KNX-Bereich 2000-6535 (Konvertierung nach HUE mirek).
**DPT 9.002:** Kelvin im HUE-Bereich 2000-6535 K (Ambiance ab 2200 K). Kleine Abweichungen durch Konvertierung möglich |
| Status kelvin | **DPT 7.600: ** Kelvin lesen (KNX-Bereich 2000-6535, konvertiert).
**DPT 9.002:** Kelvin lesen (HUE-Bereich 2000-6535 K). Kleine Abweichungen möglich |
| Invert dim direction | Dimmrichtung invertieren |

**RGB/HSV**

| Eigenschaft | Beschreibung |
|--|--|
| **RGB-Abschnitt** ||
| Control rgb | Farbe setzen per RGB-Tripel (r,g,b), inkl. Gamut-Korrektur. Farb-Telegramm schaltet die Leuchte ein (Farbe/Helligkeit); r,g,b=0 schaltet aus |
| Status rgb | GA für Farb-Status (RGB-Tripel) |
| **HSV-Abschnitt** ||
| Color H dim | Durch HSV-Farbkreis (Hue) dimmen (DPT 3.007), Geschwindigkeit in **Behaviour** |
| Status H % | Status des Hue-Werts |
| Control S dim | Sättigung dimmen (DPT 3.007), Geschwindigkeit in **Behaviour** |
| Status S % | GA für Sättigungs-Status |
| Dim Speed (ms) | Dimmgeschwindigkeit (unten→oben) |

Hinweis: Die HSV-Helligkeit "V" wird über die Standard- **Dim** -Steuerung geregelt.

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
| Read status at startup | Beim Start/Voll-Deploy Status aus HUE lesen und an KNX ausgeben |
| KNX brightness status | Verhalten der Helligkeits-Status-GA bei Ein/Aus (0 % senden und letzten Wert wiederherstellen vs. "as is") |
| Lokalen Hue-Cache durch KNX-Bus-Schreibtelegramme aktualisieren | Erweiterte Option, standardmaessig aktiviert. Wenn aktiv, aktualisieren Schreibtelegramme vom KNX-Bus sofort auch den lokal gecachten Hue-Zustand des Nodes, ohne auf Feedback/Ereignisse der Hue Bridge zu warten. Das sorgt fuer schnellere lokale Reaktionen und konsistentere sofortige KNX-Leseantworten, besonders wenn Leuchte oder Gruppe AUS sind. Deaktivieren Sie die Option, wenn der Cache nur echten Rueckmeldungen/Ereignissen der Hue Bridge folgen soll. |
| On behaviour | Verhalten beim Einschalten (Farbe wählen / Temperatur+Helligkeit wählen / none) |
| Night lighting | Nacht-Profil (Farbe oder Temperatur/Helligkeit) |
| Day/Night | GA zur Umschaltung Tag/Nacht (_true_ = Tag, _false_ = Nacht) |
| Invert Day/Night | Wert der Tag/Nacht-GA invertieren |
| Node I/O pins | Ein/Ausblenden der Eingangs/Ausgangs-Pins; Input folgt HUE API v2 (z. B. <code>msg.on = { on: true }</code>) |

Hinweis: Start/Stop-Dimmen im KNX-Modus wird über die üblichen Start/Stop-Telegramme gesteuert.

---

<span id="hue-controller-docs-plug" data-hue-controller-type="plug"></span>

## Steckdose / Ausgang (`plug`)

### Hue Steckdose / Plug

#### Überblick

Der Hue-Plug-Node verbindet eine Philips-Hue-Steckdose mit KNX-Gruppenadressen:

- Ein/Aus-Steuerung über den KNX-Bus
- Rückmeldung des Zustands direkt aus der Hue-Bridge
- Optionale Übertragung des Parameters `power_state`

#### Konfiguration

|Feld|Beschreibung|
|--|--|
| KNX-Gateway | Verwendetes KNX-Gateway |
| Hue Bridge | Konfigurierte Hue Bridge |
| Name | Hue-Steckdose auswählen (Autocomplete) |
| Befehl | KNX-GA für Ein/Aus (Boolean-DPT) |
| Status | GA für die Rückmeldung des Hue-Ein/Aus-Zustands |
| Power state | Optionale GA für den Hue-Parameter `power_state` (on/standby) |
| Status beim Start lesen | Sendet beim Deploy den aktuellen Zustand |
| Node I/O Pins | Aktiviert Node-RED-Ein/Ausgänge für eigene Hue-Payloads bzw. Ereignisse |

#### KNX-Hinweise

- Befehl und Status als DPT 1.xxx definieren.
- `power_state` auf eine boolesche GA mappen (true = on, false = standby) oder DPT 16.xxx für Klartext nutzen.
- Auf KNX-Leseanforderungen antwortet der Node mit dem letzten bekannten Hue-Wert.

#### Flow-Integration

Mit aktivierten Pins:

- **Input:** Hue v2 Payloads senden (z. B. `{ on: { on: true } }`).
- **Output:** `{ payload, on, power_state, rawEvent }` für jedes Hue-Ereignis.

#### Hue API

Die Kommunikation erfolgt über `/resource/plug/{id}`. Änderungen werden über den Event-Stream empfangen und für KNX beibehalten.

---

<span id="hue-controller-docs-button" data-hue-controller-type="button"></span>

## Taster (`button`)

Der Hue-Taster-Node spiegelt Hue-Taster-Ereignisse auf KNX und den Flow-Ausgang und nutzt das Attribut <code>button.button_report.event</code>.

Tippen Sie im GA-Feld (Name oder Gruppenadresse), um die KNX-GA zu verknüpfen; passende Einträge erscheinen während der Eingabe.

**Allgemein**

|Eigenschaft|Beschreibung|
|--|--|
| KNX-Gateway | Zu verwendendes KNX-Gateway |
| Hue Bridge | Zu verwendende Hue Bridge |
| Hue-Taster | Zu verwendender Hue-Taster (Autovervollständigung) |

**Schalten**

|Eigenschaft|Beschreibung|
|--|--|
| Schalter | GA, die vom Ereignis <code>short\_release</code> ausgelöst wird (kurzer Druck). |
| Status-GA | Optionale Rückmelde-GA, wenn <em>Werte toggeln</em> aktiv ist; hält den internen Zustand synchron. |

**Dimmen**

|Eigenschaft|Beschreibung|
|--|--|
| Dimmen | GA für <code>long\_press</code>/<code>repeat</code>-Ereignisse beim Dimmen (typischerweise DPT 3.007). |

**Verhalten**

|Eigenschaft|Beschreibung|
|--|--|
| Werte toggeln | Schaltet automatisch zwischen <code>true/false</code> und Dimmen hoch/runter. |
| Schalt-Payload | Payload, der bei deaktiviertem Toggle an KNX/Flow gesendet wird. |
| Dim-Payload | Richtung, die bei deaktiviertem Toggle an KNX/Flow gesendet wird. |

##### Ausgänge

1. Standardausgang
   : `msg.payload` enthält den boolean/dimm-Payload; `msg.event` die Hue-Ereignis-Zeichenfolge (z. B. `short_release`, `repeat`).

##### Details

`msg.event` entspricht `button.button_report.event`. Das originale Hue-Ereignis steht in `msg.rawEvent`. Nutzen Sie die optionale Status-GA, um den Toggle-Zustand mit anderen Schaltern zu synchronisieren.

---

<span id="hue-controller-docs-relative_rotary" data-hue-controller-type="relative_rotary"></span>

## Tap dial (`relative_rotary`)

Der **Hue Tap Dial** -Node verknüpft den Rotationsdienst des Tap Dial mit KNX und gibt das unveränderte Hue-Ereignis an Ihren Flow weiter. Nach dem Koppeln eines neuen Tap Dial verwenden Sie bitte das Refresh-Symbol neben dem Geräteeingabefeld.

##### Reiter

- **Zuordnung** - Wählen Sie GA und DPT für die Rotationsereignisse (unterstützt DPT 3.007, 5.001 und 232.600).
- **Verhalten** - Blendet den Node-RED-Ausgang ein oder aus. Ohne KNX-Gateway bleibt der Ausgang erzwungen aktiv, damit Hue-Ereignisse weiterhin den Flow erreichen.

##### Allgemeine Einstellungen

| Eigenschaft | Beschreibung |
|--|--|
| KNX-Gateway | KNX-Gateway, das für die Autovervollständigung der GA verwendet wird. |
| Hue Bridge | Hue Bridge, die das Tap Dial bereitstellt. |
| Hue Tap Dial | Drehgerät, das gesteuert wird (Autocomplete; Refresh lädt die Liste neu). |

##### Reiter Zuordnung

| Eigenschaft | Beschreibung |
|--|--|
| Dreh-GA | KNX-GA für die Rotationsereignisse (DPT 3.007, 5.001 oder 232.600). |
| Name | Beschreibung der GA. |

##### Ausgänge

|#|Port|Payload|
|--|--|--|
|1|Standardausgang|`msg.payload` (Objekt) Rohes Hue-Ereignis des Tap Dial.|

> ℹ️ KNX-bezogene Steuerelemente erscheinen erst nach Auswahl eines KNX-Gateways; der Zuordnung-Reiter bleibt verborgen, bis sowohl Bridge als auch Gateway konfiguriert sind.

---

<span id="hue-controller-docs-motion" data-hue-controller-type="motion"></span>

## Bewegung (`motion`)

Dieser Node empfängt Bewegungsereignisse eines Hue-Bewegungssensors und leitet sie an KNX bzw. den Node-RED-Flow weiter.

Im GA-Feld den KNX-Gerätenamen oder die Gruppenadresse eingeben; beim Tippen erscheinen Vorschläge. Über das Aktualisieren-Symbol neben "Hue Sensor" lässt sich die Geräteliste der Hue-Bridge neu laden.

**Allgemein**

| Eigenschaft | Beschreibung |
|--|--|
| KNX-Gateway | KNX-Gateway, das die Bewegungszustände erhält (erforderlich, damit die KNX-Optionen angezeigt werden). |
| Hue Bridge | Hue Bridge, auf der der Sensor liegt. |
| Hue-Bewegungssensor | Hue-Bewegungssensor (unterstützt Autovervollständigung und Refresh). |

**Zuordnung**

| Eigenschaft | Beschreibung |
|--|--|
| Bewegung | KNX-GA, die bei Bewegung `true` und sonst `false` erhält. Empfohlener DPT: <b>1.001</b>. |

**Verhalten**

| Eigenschaft | Beschreibung |
|--|--|
| Node-Ausgangspin | Node-RED-Ausgang ein-/ausblenden. Ohne KNX-Gateway bleibt der Ausgang aktiv, damit Hue-Ereignisse weiterhin den Flow erreichen. |

> ℹ️ Die KNX-Felder werden erst sichtbar, nachdem ein KNX-Gateway gewählt wurde - praktisch, wenn der Node nur als Hue → Node-RED Listener dient.

##### Ausgang

1. Standardausgang — `msg.payload` (boolean)
   : `true` bei Bewegung, `false` sobald sie endet.

---

<span id="hue-controller-docs-area_motion" data-hue-controller-type="area_motion"></span>

## Bereichsbewegung (`area_motion`)

Der Hue Motion Area Node lauscht auf MotionAware-Bereichsereignisse (Hue Bridge Pro) und spiegelt den aggregierten Bewegungsstatus (Bewegung / keine Bewegung) nach KNX bzw. in Ihren Node-RED-Flow.

Geben Sie im GA-Feld den KNX-Gerätenamen oder die Gruppenadresse ein; passende Vorschläge erscheinen während der Eingabe.

**Allgemein**

|Eigenschaft|Beschreibung|
|--|--|
| KNX GW | KNX-Gateway, das den Bewegungsstatus erhält. |
| HUE Bridge | Zu verwendende Hue Bridge Pro. |
| HUE Area | Zu überwachender MotionAware-Bereich (Convenience oder Security, mit Autovervollständigung). |
| Status beim Start auslesen | Liest beim Start/bei Wiederverbindung den aktuellen Wert und sendet ihn an KNX (Standard: ja). |

**Zuordnung**

|Eigenschaft|Beschreibung|
|--|--|
| Bewegung | KNX-GA für den Bewegungsstatus des Bereichs (Boolean). Empfohlener DPT: <b>1.001</b>. |

**Verhalten**

|Eigenschaft|Beschreibung|
|--|--|
| Node-Ausgangspin | Node-RED-Ausgang ein-/ausblenden. Ohne KNX-Gateway bleibt der Ausgang aktiv, damit MotionAware-Ereignisse weiterhin den Flow erreichen. |

##### Ausgang

1. Standardausgang
   : `msg.payload` (Boolean): `true`, wenn im Bereich Bewegung erkannt wird, sonst `false`.

##### Details

`msg.payload` enthält den von MotionAware gelieferten, aggregierten Bewegungsstatus des ausgewählten Bereichs.

---

<span id="hue-controller-docs-camera_motion" data-hue-controller-type="camera_motion"></span>

## Kamerabewegung (`camera_motion`)

Der Hue Camera Motion Node lauscht auf Bewegungsereignisse der Philips-Hue-Kameras und spiegelt den erkannt/nicht-erkannt-Status in KNX.

Geben Sie im GA-Feld (Name oder Gruppenadresse) den gewünschten Wert ein; passende Geräte werden während der Eingabe vorgeschlagen.

**Allgemein**

|Eigenschaft|Beschreibung|
|--|--|
| KNX Gateway | Zu verwendendes KNX-Gateway auswählen |
| Hue Bridge | Zu verwendende Hue Bridge auswählen |
| HUE Kamerabewegung | Hue-Kamera-Bewegungssensor (Autovervollständigung während der Eingabe) |
| Status beim Start auslesen | Liest beim Start/bei Wiederverbindung den aktuellen Wert und sendet ihn an KNX (Standard: nein) |

**Zuordnung**

|Eigenschaft|Beschreibung|
|--|--|
| Bewegung | KNX-GA für die Kamerabewegung (Boolean). Empfohlener DPT: <b>1.001</b> |

##### Ausgaben

1. Standardausgang
   : `msg.payload` (Boolean): `true`, wenn Bewegung erkannt wird, sonst `false`

##### Details

`msg.payload` enthält den zuletzt vom Hue-Kameraservice gemeldeten Bewegungsstatus.

---

<span id="hue-controller-docs-contact" data-hue-controller-type="contact"></span>

## Kontakt (`contact`)

Dieser Node leitet Ereignisse eines HUE-Kontaktsensors weiter und ordnet sie KNX-Gruppenadressen zu.

Tippen Sie in das Feld GA, die Name oder die Gruppenadresse Ihres KNX -Geräts, die avabaren Geräte werden beim Eingeben angezeigt.

**Allgemein**

| Eigenschaft | Beschreibung |
|-|-|
|KNX-Gateway |Wählen Sie das zu verwendende KNX -Gateway |
|Hue Bridge |Wählen Sie die zu verwendende Hue Bridge aus |
| Hue-Kontaktsensor | Zu verwendender HUE-Kontaktsensor (Autocomplete) |

|Eigenschaft |Beschreibung |
|-------- |------------------------------------------------------------------------------------------------------------------ |
| Kontakt | Bei Öffnen/Schließen senden: _true_ (aktiv/offen), sonst _false_ |

##### Ausgänge

1. Standardausgabe
   : Nutzlast (Boolean): Die Standardausgabe des Befehls.

##### Details

`msg.payload` enthält das HUE-Ereignis (Boolean/Objekt) für eigene Logik.

---

<span id="hue-controller-docs-light_level" data-hue-controller-type="light_level"></span>

## Lichtstärke (`light_level`)

Dieser Node liest Lux-Ereignisse eines HUE-Lichtsensors und spiegelt sie nach KNX.

Es wird die Umgebungshelligkeit (Lux) bei Änderungen ausgegeben. Im GA-Feld den KNX-Gerätenamen oder die GA eingeben (Autocomplete), um die GA zu verknüpfen.

**Allgemein**

| Eigenschaft | Beschreibung |
|-|-|
|KNX-Gateway |Wählen Sie das zu verwendende KNX -Gateway |
|Hue Bridge |Wählen Sie die zu verwendende Hue Bridge aus |
| Hue Lichtsensor | Zu verwendender HUE-Lichtsensor (Autocomplete) |
|Status bei Startup lesen |Lesen Sie den Status beim Start und geben Sie das Ereignis bei Startup/Wiederverbindung an den KNX -Bus aus.(Standard "nein") |

**Zuordnung**

| Eigenschaft | Beschreibung |
|--|--|
| Lux | KNX-GA, die den Lux-Wert erhält |

##### Ausgänge

1. Standardausgang
   : payload (number): aktueller Lux-Wert

##### Details

`msg.payload` enthält den numerischen Lux-Wert.

---

<span id="hue-controller-docs-temperature" data-hue-controller-type="temperature"></span>

## Temperatur (`temperature`)

Dieser Node liest die Temperatur (°C) eines HUE-Temperatursensors und spiegelt sie nach KNX.

Beginnen Sie im GA-Feld (Name oder Gruppenadresse) zu tippen, um die KNX-GA zu verknüpfen; Geräte werden während der Eingabe vorgeschlagen.

**Allgemein**

| Eigenschaft | Beschreibung |
|--|--|
| KNX-Gateway | Zu verwendendes KNX-Gateway |
| Hue Bridge | Zu verwendende Hue Bridge |
| Hue-Temperatursensor | HUE-Temperatursensor (Autocomplete während der Eingabe) |
| Status beim Start lesen | Beim Start/Wiederverbindung aktuellen Wert lesen und auf KNX senden (Standard: nein) |

**Mapping**

| Eigenschaft | Beschreibung |
|--|--|
| Temperatur | KNX-GA für Temperatur in °C. Empfohlener DPT: <b>9.001</b> |

##### Ausgänge

1. Standardausgang
   : `msg.payload` (number): aktuelle Temperatur in °C

##### Details

`msg.payload` enthält den numerischen Temperaturwert.

---

<span id="hue-controller-docs-humidity" data-hue-controller-type="humidity"></span>

## Luftfeuchtigkeit (`humidity`)

Dieser Knoten liest die relative Luftfeuchtigkeit (%) von einem HUE-Sensor und überträgt sie auf KNX.

Beginne im GA-Feld (Name oder Gruppenadresse) zu tippen, um die KNX-GA zu verknüpfen; während der Eingabe werden passende Geräte angezeigt.

**Allgemein**

|Eigenschaft|Beschreibung|
|--|--|
| KNX Gateway | Das zu verwendende KNX-Gateway auswählen |
| Hue Bridge | Die zu verwendende Hue Bridge auswählen |
| HUE Sensor | HUE-Luftfeuchtigkeitssensor (Auto-Vervollständigung beim Tippen) |
| Status beim Start auslesen | Beim Start/Reconnect den aktuellen Wert lesen und auf KNX senden (Standard: Nein) |

**Zuordnung**

|Eigenschaft|Beschreibung|
|--|--|
| Luftfeuchtigkeit | KNX-GA für die relative Luftfeuchtigkeit %. Empfohlener DPT: <b>9.007</b> |

##### Ausgänge

1. Standardausgang
   : `msg.payload` (Zahl): aktuelle relative Luftfeuchtigkeit in %

##### Details

`msg.payload` enthält den numerischen Luftfeuchtigkeitswert (Prozentangabe).

---

<span id="hue-controller-docs-scene" data-hue-controller-type="scene"></span>

## Szene (`scene`)

Der **Hue Scene** -Node stellt Hue-Szenen per KNX bereit und kann die Rohereignisse an Ihren Node-RED-Flow weitergeben. Das Feld "Hue Szene" besitzt Autovervollständigung; verwenden Sie nach dem Anlegen neuer Szenen das Aktualisierungssymbol, damit die Liste aktuell bleibt.

##### Überblick über die Reiter

- **Zuordnung** - Verknüpft KNX-Gruppenadressen mit der ausgewählten Hue-Szene. DPT 1.xxx sendet boolesche Werte, DPT 18.xxx überträgt eine KNX-Szenennummer.
- **Mehrfachszene** - Erstellt eine Liste von Regeln, die KNX-Szenennummern verschiedenen Hue-Szenen und Abrufarten (active, dynamic\_palette, static) zuordnet.
- **Verhalten** - Blendet den Node-RED-Ausgang ein oder aus. Ohne konfiguriertes KNX-Gateway bleibt der Ausgang aktiv, damit Bridge-Ereignisse weiterhin im Flow landen.

##### Allgemeine Einstellungen

| Eigenschaft | Beschreibung |
|--|--|
| KNX-Gateway | KNX-Gateway mit dem Adresskatalog für das Autocomplete. |
| Hue Bridge | Hue Bridge, die die Szenen bereitstellt. |
| HUE Szene | Szene, die aufgerufen wird (Autocomplete; Refresh lädt den Bridge-Katalog neu). |

##### Reiter Zuordnung

| Eigenschaft | Beschreibung |
|--|--|
| GA Aufruf | KNX-GA zum Abrufen der Szene. Verwenden Sie DPT 1.xxx für boolsche Steuerung oder DPT 18.xxx für KNX-Szenennummern. |
| DPT | Datapoint, der zusammen mit der Aufruf-GA genutzt wird (1.xxx oder 18.001). |
| Name | Bezeichnung für die Aufruf-GA. |
| # | Wird angezeigt, wenn ein KNX-Szenen-DPT gewählt ist; wählen Sie die zu sendende Szenennummer. |
| Status-GA | Optionale boolsche GA, die anzeigt, ob die Szene aktiv ist. |

##### Reiter Mehrfachszene

| Eigenschaft | Beschreibung |
|--|--|
| GA Aufruf | KNX-GA (DPT 18.001), um Szenen anhand ihrer KNX-Nummer auszuwählen. |
| Szenenliste | Bearbeitbare Liste, die KNX-Szenennummern Hue-Szenen und Abrufmodi zuordnet. Ziehen Sie die Griffe zum Umordnen. |

> ℹ️ KNX-spezifische Bedienelemente erscheinen erst nach Auswahl eines KNX-Gateways. Die Mapping-Reiter bleiben verborgen, bis sowohl Bridge als auch Gateway konfiguriert sind.

---

<span id="hue-controller-docs-device_power" data-hue-controller-type="device_power"></span>

## Batterie (`device_power`)

Dieser Node spiegelt den Batteriestand eines Hue-Geräts nach KNX und löst Ereignisse aus, sobald sich der Wert ändert.

Im GA-Feld den KNX-Gerätenamen oder die Gruppenadresse eingeben; beim Tippen erscheinen Vorschläge. Über das Aktualisieren-Symbol neben "Hue Sensor" lässt sich die Geräteliste der Hue-Bridge neu laden.

**Allgemein**

| Eigenschaft | Beschreibung |
|--|--|
| KNX-Gateway | KNX-Gateway, auf das der Batteriestand veröffentlicht wird (erforderlich, damit KNX-Felder angezeigt werden). |
| Hue Bridge | Hue Bridge, auf der das Gerät eingebunden ist. |
| Hue-Batteriesensor | Hue-Gerät/Sensor, das den Batteriestand liefert (unterstützt Autovervollständigung und Refresh). |

**Zuordnung**

| Eigenschaft | Beschreibung |
|--|--|
| Level | KNX-GA für den Batteriestand (0-100 %). Empfohlener DPT: <b>5.001</b>. |

**Verhalten**

| Eigenschaft | Beschreibung |
|--|--|
| Status beim Start lesen | Beim Deploy/Wiederverbinden aktuellen Wert lesen und an KNX senden. Standard: "ja". |
| Node-Ausgangspin | Node-RED-Ausgang anzeigen/ausblenden. Ohne KNX-Gateway bleibt der Ausgang aktiv, damit Hue-Ereignisse weiterhin den Flow erreichen. |

> ℹ️ Die KNX-Mapping-Felder bleiben ausgeblendet, bis ein KNX-Gateway gewählt wurde - ideal, wenn der Node nur als Hue → Node-RED Ereignisquelle dient.

---

<span id="hue-controller-docs-zigbee_connectivity" data-hue-controller-type="zigbee_connectivity"></span>

## Zigbee-Verbindung (`zigbee_connectivity`)

Dieser Node liest den Zigbee-Konnektivitätsstatus eines HUE-Geräts und spiegelt ihn nach KNX.

Gib im GA-Feld den Gerätenamen oder die Gruppenadresse ein; beim Tippen erscheinen Vorschläge.

**Allgemein**

| Eigenschaft | Beschreibung |
|--|--|
| KNX-Gateway | KNX-Gateway, auf das veröffentlicht wird. |
| Hue Bridge | Zu verwendende Hue Bridge. |
| Hue-Zigbee-Konnektivität | HUE-Sensor/Gerät mit Zigbee-Konnektivitätsinfo (Autocomplete). |

**Zuordnung**

| Eigenschaft | Beschreibung |
|--|--|
| Status | KNX-GA, die die Zigbee-Konnektivität abbildet. _true_ = verbunden, sonst _false_. |
| Status beim Start lesen | Beim Start/bei Wiederverbindung Status lesen und an KNX ausgeben. Standard: "Ja". |

##### Ausgänge

1. Standardausgang
   : payload (boolean): Konnektivitätszustand.

##### Details

`msg.payload` ist true/false.\
`msg.status` ist Text: **connected, disconnected, connectivity\_issue, unidirectional\_incoming** .

---

<span id="hue-controller-docs-device_software_update" data-hue-controller-type="device_software_update"></span>

## Geräte-Softwareupdate (`device_software_update`)

Dieser Node überwacht, ob ein HUE-Gerät ein Software-Update hat, und spiegelt den Status nach KNX.

Geben Sie den Namen oder die Gruppenadresse Ihres KNX -Geräts im Feld GA ein.
Sie tippen.

**Allgemein**

| Eigenschaft | Beschreibung |
|-|-|
|KNX-Gateway |Wählen Sie das zu verwendende KNX -Gateway |
|Hue Bridge |Wählen Sie die zu verwendende Hue Bridge aus |
| Hue-Gerät | Zu überwachendes HUE-Gerät (Autocomplete) |

**Zuordnung**

| Eigenschaft | Beschreibung |
|--|--|
| Status | KNX-GA für Update-Status: _true_, wenn verfügbar/bereit/in Installation, sonst _false_. |
| Status beim Start lesen | Beim Start/Wiederverbindung lesen und an KNX ausgeben (Standard "Ja"). |

##### Ausgänge

1. Standardausgang
   : payload (boolean): Update-Flag.
   : status (string): **no\_update, update\_pending, ready\_to\_install, installing** .

<!-- HUE_CONTROLLER_PROFILE_DOCS_END -->
