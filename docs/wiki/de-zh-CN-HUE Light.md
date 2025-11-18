---
layout: wiki
title: "zh-CN-HUE Light"
lang: de
permalink: /wiki/de-zh-CN-HUE%20Light
---
---

<p> Mit diesem Knoten können Sie Philips -Tonlichter und gruppierte Lichter steuern und den Status dieses Lichts an den KNX -Bus senden.</p>

**Allgemein**
| Eigenschaften | Beschreibung |
|-|-|
| KNX GW | Wählen Sie das zu verwendende KNX -Portal |
| Hua Bridge | Wählen Sie die zu verwendende Tonbrücke aus |
| Name | Farbtonlampe oder Licht mit Farbton gruppiert.Die Lichter und Gruppen, die erhältlich sind, wenn Sie eingeben, starten angezeigt. |

<br/>

**Optionen**

Hier können Sie die KNX -Adresse auswählen, die Sie mit den verfügbaren Tonlichtern/Status verlinken möchten.<br/>
Starten Sie das Feld GA, den Namen oder die Gruppenadresse des KNX -Geräts, und das verfügbare Gerät wird beim Eingeben angezeigt.

**ändern**
| Eigenschaften | Beschreibung |
|-|-|
| Kontrolle | Mit diesem GA wird das Tonlicht durch booleschen KNX -Wert von True/False | ein-/ausgeschaltet |
| Status | Verknüpfen Sie es mit der Switch -Statusgruppenadresse des Lichts |

<br/>

**dim**
| Eigenschaften | Beschreibung |
|-|-|
| Kontrolle dim | Relativ verdunkeltes Dimmen.Sie können die Dimmgeschwindigkeit in der Registerkarte \*\* _behavior einstellen.|
| Kontrolle %| ändert die Helligkeit des absoluten Tons (0-100 %) |
| Status %| Verknüpfen Sie es mit dem Helligkeitszustand der Lichtknx -Gruppe |
| Dunkle Geschwindigkeit (MS) | Winzige Geschwindigkeit in Millisekunden.Dies funktioniert für **Licht ** und auch für**einstellbare weiße \*\*geplante Datenpunkte.Es wird von 0% bis 100% berechnet.|
| Die neueste schwache Helligkeit |Die niedrigste Helligkeit, die das Licht erreichen kann.Wenn Sie beispielsweise das Licht drehen möchten, hört das Licht auf, an der angegebenen Helligkeit %zu dimmen.|
| Maximale schwache Helligkeit | Maximale Helligkeit, die die Lampe erreichen kann. Wenn Sie beispielsweise das Licht einstellen möchten, hört das Licht auf, an der angegebenen Helligkeit %zu dimmen. |

<br/> ** einstellbares Weiß** | Eigenschaften | Beschreibung |
|-|-|
|Kontrolle dim | Verwenden Sie DPT 3.007 Dimming, um die weiße Temperatur der Tonlampe zu ändern. Sie können die Dimmgeschwindigkeit in \*\* _behavior_ \*\* Tab einstellen. |
| Kontrolle % | Verwenden Sie DPT 5.001, um die weiße Farbtemperatur zu ändern. 0 ist warm, 100 ist kalt |
| Status % | Weiße Lichtgruppe der weißen Lichttemperatur (DPT 5.001; 0 = warm, 100 = kalt) |
| Kontrolle Kelvin | ** DPT 7.600: ** Set von KNX Range 2000-6535 K (konvertieren in Hue Mirek). <br/>**DPT 9.002:** Set von Hue Range 2000-6535 K (Ambiente beginnt ab 2200 K).Die Umwandlung kann zu leichten Abweichungen führen |
| Status Kelvin | ** DPT 7.600: ** Kelvin lesen (KNX 2000-6535, Umwandlung).<br/>**DPT 9.002:** Hue Range 2000-6535 K; Die Konvertierung kann leichte Abweichungen haben |
| Umgekehrt die schwache Richtung | Die schwache Richtung umkehren. |
<br/>

\*\*Rgb/hsv \*\*
| Eigenschaften | Beschreibung |
|-|-|
| ** RGB -Teil** ||
| Kontrolle RGB | Verwenden Sie RGB -Tripel (R, G, B), um die Farbe zu ändern, einschließlich der Korrektur von Farbspieldarstellern. Senden Sie Farbe leuchtet und setzen Sie Farbe/Helligkeit.r, g, b = 0 schalten das Licht aus |
| Status RGB | Licht -Farbstatus -Gruppenadresse.Akzeptierte Datenpunkte sind RGB -Tripletts (R, G, B) |
| ** HSV -Teil** ||
| Farbe H DIMP | Schleife auf der HSV -Hue -Schleife mit DPT 3.007; Geschwindigkeit in ** Verhalten** Einstellungen |
| Zustand H%| Zustand des HSV -Farbkreises. |
| Kontrolle S DIMP |Verwenden Sie DPT 3.007, um die Sättigung zu ändern. Geschwindigkeit in ** Verhalten** Einstellungen |
| Zustand s% | Leicht gesättigte Zustandsgruppenadresse. |
| Dunkle Geschwindigkeit (MS) |Miniaturgeschwindigkeit von unten bis zur höchsten Skala in Millisekunden. |

Tipp: Für die "V" (Helligkeit) des HSV verwenden Sie bitte die Standardsteuerungen der Registerkarte ** Dim** .

<br/> **Wirkung** _Non-Hue Basic Effects_
| Eigenschaften | Beschreibung |
|-|-|
| Blink | _true_ blinkt das Licht, _false_ hört auf zu blinken. Alternative Schalter, geeignet für Eingabeaufforderungen.Unterstützt alle Farbtöne.|
|Farbschleife | _true_ startet die Schleife, _false_ stoppt die Schleife.Ändern Sie die Farbe in festen Intervallen zufällig, nur für Farbtöne, die Farblicht unterstützen.Der Effekt beginnt etwa 10 Sekunden nach der Ausgabe des Befehls. |

_Hue native effekt_

In der Tabelle ** Hue native Effekte** den KNX -Wert auf die durch das Gerät unterstützten Effekte (z. B. "Kerzen", "Kamin", "Prism") abgeben.Jede Zeile assoziiert einen KNX -Wert (boolean, numerisch oder text, abhängig vom ausgewählten Datenpunkt) mit einem von der Brücke zurückgegebenen Effekt.Dies wird:

- Senden Sie kartierte KNX -Werte, um den entsprechenden Effekt auszulösen.
- (optional) Konfigurieren Sie eine Statusgruppenadresse: Wenn die Hue Bridge die Effektänderung meldet, schreibt der Knoten den Kartenwert zurück;Wenn keine Karte gefunden wird, wird der ursprüngliche Effektname gesendet (die Textklasse -DPT ist erforderlich, z. B. 16.xxx).

<br/> **Verhalten** | Eigenschaften | Beschreibung |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------/ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------/ ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Lesen Sie den Status beim Start | Lesen Sie den Status des Farbtonlichts im Start von Knotenrot oder die vollständige Bereitstellung von Knoten-Red und senden Sie diesen Status an den KNX-Bus |
| KNX Helligkeitsstatus | Immer wenn das Tonlicht ein-/ausgeschaltet ist, wird der Status der KNX -Helligkeitsgruppe aktualisiert.Die Option ist ** 0% senden, wenn der Farbton ausgeschaltet ist.Wenn der Farbton eingeschaltet ist, stellen Sie die vorherigen Werte (Standard -KNX -Verhalten) wieder her und ** * wie ist (Standard -Hue -Verhalten)**.Wenn Sie einen KNX -Dimmer mit Helligkeitsstatus wie MDT haben, lautet die empfohlene Option \*\*\*, und wenn das Hue -Licht ausgeschaltet ist, senden Sie 0%.Wenn der Ton eingeschaltet ist, stellen Sie den vorherigen Wert (Standard -KNX -Verhalten) \*\*\*| wieder her. |
|Offenes Verhalten |Wenn eingeschaltet wird, setzt es das Verhalten des Lichts.Sie können aus verschiedenen Verhaltensweisen wählen. <br/> \*\*Wählen Sie Farbe: \*\*Das Licht wird mit der von Ihnen ausgewählten Farbe eingeschaltet.Um die Farbe zu ändern, klicken Sie einfach auf den Farbwählers (erstellt unter "Die Schönheit". |
| Nachtbeleuchtung | Es ermöglicht, dass bestimmte Lichtfarben/Helligkeit nachts festgelegt werden. Die Optionen sind die gleichen wie tagsüber. Sie können Temperatur/Helligkeit oder Farbe wählen. Die bequeme Temperatur beträgt 2700 Kelvin und die Helligkeit beträgt 10% oder 20%, was es zu einer guten Wahl für Badezimmer -Nachtlichter macht. |
| Tag/Nacht | Wählen Sie die Gruppenadresse aus, um ein Tag/Nacht -Verhalten festzulegen. Der Gruppenadressenwert ist \ _true \ _if DayTime, \ _false \ _if NightTime. |
| FALT DAY/NACHT VALUE | Um invertieren den Wert von Tag/Nacht \ _group -Adresse. Standardwert **Nicht ausgewählt. |
| Status beim Start lesen | Status beim Start lesen und Ereignisse beim KNX -Bus beim Start/Wiederverbinden übertragen. (Standard "nein") |
| Tagmodus erzwingen | Sie können den Tagmodus erzwingen, indem Sie die hier beschriebenen Lichter manuell umschalten: \*\*In den Tagesmodus wechseln, indem Sie das Licht schnell aus- und wieder einschalten (nur dieses Licht)** führt die beschriebene Aktion aus und wirkt nur auf dieses Licht. **In den Tagesmodus wechseln, indem Sie das Licht schnell aus- und wieder einschalten (auf alle Licht-Knoten anwenden)** wirkt auf alle Licht-Knoten, indem die Tag/Nacht-Gruppenadresse auf Tag gesetzt wird.|
| Knoteneingang/Ausgangspin | Eingabestift ausblenden oder anzeigen.Mit dem Eingangs-/Ausgangspin kann der Knoten die Verkehrseingabe akzeptieren und die MSG -Ausgabe an den Datenverkehr senden. Die Eingabe -MSG muss dem Hue -API v.2 Standard entsprechen.Hier ist ein Beispiel -MSG, das das Licht einschaltet: <Code> msg.on = {"on": true} </code>. Siehe \ [offizielle Hue -API -Seite](§url0§) |

### Notizen

Die Dimmfunktion funktioniert in \*\*KNX -Modus \ `start \` \ `'' 'und st off'**.Um zu dimmen, senden Sie einfach ein "Start" KNX -Telegramm.Um nicht mehr zu dimmen, senden Sie ein "Stop" -KNX -Telegramm.Bitte erinnern Sie sich an \*\*, wenn Sie die Wand einrichten, denken Sie daran.

<br/>

<br/>
