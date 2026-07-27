---
layout: wiki
title: "Control Matter from KNX"
lang: de
permalink: /wiki/de-Control%20Matter%20from%20KNX
---
# Control Matter from KNX (BETA)

> Dieser Knoten ist **BETA**: das Verhalten kann sich ändern, während die Matter-Implementierung weiter verfeinert wird.

Dieser Knoten steuert einen bereits gekoppelten Matter-Endpunkt über KNX. Wähle das Matter-Gerät aus; der Editor erkennt die Fähigkeiten des Endpunkts und zeigt nur die passenden KNX-Zuordnungen.

Er ersetzt die unveröffentlichten getrennten Matter-Controller-Nodes und behält die komplette Licht-UI bei, wenn der gewählte Endpunkt ein Licht ist.

## Konfiguration

|Feld|Beschreibung|
|--|--|
| KNX GW | KNX-Gateway zum Schreiben und Beantworten der konfigurierten Gruppenadressen. Kann leer bleiben, wenn nur der Node-RED-Ausgang benötigt wird. |
| Matter controller | Matter-Controller-Konfigurationsknoten, in dem das Gerät gekoppelt wurde. |
| Matter device | Matter-Endpunkt aus den gekoppelten Geräten. Die UI wird aus den echten Fähigkeiten neu aufgebaut. |
| Switch / Steckdose / Licht On-Off | On/Off-Befehls- und Status-Gruppenadressen, normalerweise DPT `1.001`. |
| Türschloss | Eine DPT-`1.xxx`-Befehls-GA ruft bei `true` `lockDoor` und bei `false` `unlockDoor` auf; eine separate Status-GA erhält nur eindeutige Verriegelt/Entriegelt-Zustände. Falls erforderlich, wird die Fernbedienungs-PIN im Credential-Feld gespeichert. Nicht angebotene Befehle werden abgewiesen. |
| Andere Endpunkte | Window-Covering-, Thermostat-, Fan- und Switch-Endpunkte verwenden dedizierte, anhand ihrer Fähigkeiten ausgewählte Profile; Switch-Ereignisse wie Initial-, Lang- und Mehrfachdruck werden am optionalen Flow-Ausgang ausgegeben. Steckdosen, Ein/Aus-Aktoren, Sensoren, Batterie, Leistung und Energie verwenden den generischen Mapping-Fallback. Der Tab **Zuordnungen** enthält nur tatsächlich angebotene Funktionen. |
| Lichtsteuerung | Für Licht-Endpunkte wird die vollständige Licht-UI verwendet: relatives DIM (DPT `3.007`), Helligkeit %, RGB/HSV, Tunable White, Einschalt-Helligkeit/-Temperatur, Tag/Nacht-Licht, Min/Max-Dimmlevel und Dimmgeschwindigkeit. Nicht unterstützte Bereiche bleiben ausgeblendet. |
| Sensoren | Sensor-Endpunkte zeigen ihre Mess-/Status-GA nur bei Unterstützung: Temperatur, Feuchte, Helligkeit, Präsenz, Kontakt und Batterie. |
| Read at startup | Veröffentlicht den gecachten Matter-Wert beim Deploy/Start oder wenn sich das Gerät erneut verbindet. |
| Update local state from KNX write | Aktualisiert den lokalen Matter/KNX-Cache, wenn ein Telegramm auf eine konfigurierte KNX-GA geschrieben wird. |
| Node Input/Output PINs | Zeigt Node-RED-Eingangs-/Ausgangspins. Nicht-Licht-Endpunkte akzeptieren das einfache `{function,value}`-Format sowie die bisherigen erweiterten Matter-Selektoren. |

## Flow-Eingangsnachrichten

Öffne nach Auswahl eines Nicht-Licht-Endpunkts den Tab **Flow-Eingang**. Der Tab wird aus der angekündigten Struktur erzeugt und zeigt kopierbare Beispiele, die Endpoint ID, alle lesbaren/schreibbaren Attribute und alle akzeptierten Befehle. Er bleibt auch verfügbar, wenn der Knoten ohne KNX-Gateway nur im Flow verwendet wird.

Mit `msg.payload = {function:"position",value:35}` wird in verständlichen Einheiten geschrieben. Ohne `value` wird ein unterstützter Zustand gelesen, etwa `{function:"temperature"}`; das Ergebnis steht in `msg.payload`, Rohdetails in `msg.matter`. Je nach Endpunkt stehen unter anderem `onoff`, `level`, `position`, `open`, `close`, `stop`, Sollwerte, Lüfter- und Sensorfunktionen zur Verfügung. Türschlösser akzeptieren `{function:"lock",value:true|false}`.

Bestehende Flows bleiben kompatibel. Erweiterte Nachrichten verwenden weiterhin `msg.clusterId` mit `msg.command`/`msg.args` oder `msg.attribute` und optional `msg.value`. Node ID und Endpoint ID sind bereits ausgewählt.

## Verhalten

Der Knoten pflegt einen lokalen Cache aus Matter-Updates und KNX-Schreibtelegrammen, beantwortet KNX-Leseanfragen aus diesem Cache und kann Werte beim Start lesen/ausgeben. Er hört nur auf konfigurierte Gruppenadressen, daher wird fremder KNX-Verkehr ignoriert.

Befehle laufen pro gekoppeltem Gerät in einer eigenen geordneten Warteschlange. Ein offline befindliches, zeitüberschreitendes oder entferntes Gerät kann daher andere Matter-Geräte mit derselben KNX-Gruppenadresse nicht verzögern. Verweist ein Node weiterhin auf ein entferntes Gerät, wird der Befehl sofort abgewiesen und **Device no longer commissioned** rot angezeigt; wähle ein gültiges Matter-Gerät oder entferne den verwaisten Controller-Node.

Ein Fehler wegen eines nicht verfügbaren Geräts bleibt verriegelt: weitere KNX- und Flow-Befehle werden ignoriert und können den roten Status nicht überschreiben. Der Node wird automatisch wieder aktiv, sobald dieses Matter-Gerät `connected` meldet; auch das Öffnen des Node-Editors löst die Verriegelung für einen manuellen Neuversuch.
