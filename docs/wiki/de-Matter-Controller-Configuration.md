---
layout: wiki
title: "Matter-Controller-Configuration"
lang: de
permalink: /wiki/de-Matter-Controller-Configuration
---
# Matter Controller

<div data-matter-controller-overview="hero" style="margin:18px 0 28px;padding:24px;border-radius:16px;background:linear-gradient(135deg,#241047 0%,#5531a7 55%,#8b5cf6 100%);box-shadow:0 14px 30px rgba(36,16,71,0.25);color:#faf7ff;">
  <div style="font-size:0.72rem;letter-spacing:0.18em;text-transform:uppercase;font-weight:700;color:#e3d7ff;">Matter-Fabric · Kommissionierung · KNX</div>
  <div style="font-size:1.75rem;line-height:1.15;font-weight:800;margin:8px 0 10px;">Deine Matter-Fabric, unter deiner Kontrolle.</div>
  <p style="margin:0 0 18px;max-width:860px;line-height:1.6;color:#faf7ff;">Geräte über das IP-Netzwerk kommissionieren und ihre Endpunkte KNX und Node-RED bereitstellen. Koppeln, überwachen, sichern und entfernen – alles in einem Konfigurations-Node.</p>
  <div style="display:flex;flex-wrap:wrap;gap:10px;">
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">Lokale Fabric</strong><span style="font-size:0.76rem;color:#eee7ff;">private Zugangsdaten</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">QR + manuell</strong><span style="font-size:0.76rem;color:#eee7ff;">Kopplungscodes</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">Export / Import</strong><span style="font-size:0.76rem;color:#eee7ff;">geschütztes Backup</span></div>
  </div>
</div>

## Ein Controller für den gesamten Lebenszyklus

| Bereich | Funktionsumfang |
|---|---|
| **Kommissionierung** | Matter-QR-Payload, Webcam- oder Bildscan, manueller Code und Multi-Fabric-Kopplung über WLAN, Ethernet oder Thread. |
| **Geräteverwaltung** | Inventar, Verbindungsstatus, sichere Entfernung und unabhängige Befehlswarteschlangen pro Gerät. |
| **KNX & Node-RED** | Endpunkt-Mappings, Universeller Modus, dynamische Befehle und universeller Batteriemonitor. |
| **Ausfallsicherheit & Speicher** | Persistente Fabric, Backup/Wiederherstellung, Gerätesperre und automatische Erholung. |

## Start in vier Schritten

1. Matter Controller hinzufügen und **deployen**.
2. Erneut öffnen und ein Gerät per Matter-QR-Payload oder manuellem Code kommissionieren.
3. **Control Matter from KNX** hinzufügen, dann Gerät und Profil wählen.
4. KNX-Gruppenadressen abbilden oder Node-RED-PINs aktivieren und deployen.

> **Tipp:** Den QR-Payload `MT:...` bevorzugen: Er enthält den vollständigen Diskriminator, der 11-stellige manuelle Code nur den kurzen.

## Technische Übersicht

Dieser Konfigurations-Node ist ein vollwertiger **Matter-Controller**: Er erstellt seine eigene Matter-*Fabric* und koppelt (kommissioniert) deine Matter-Geräte. Die gekoppelten Geräte stehen anschließend den **Matter Device**-Nodes zur Verfügung, die sie auf KNX-Gruppenadressen abbilden.

Der Controller kommuniziert mit den Geräten über das **IP-Netzwerk** (WLAN, Ethernet oder Thread über einen Border Router). Bluetooth-Kommissionierung wird nicht unterstützt: Das Gerät muss bereits im Netzwerk erreichbar sein.

## Ein Gerät koppeln

1. Zuerst diesen Konfigurations-Node **deployen** (der Controller muss laufen).
2. Den Node erneut öffnen und den **Kopplungscode** eingeben: entweder den 11-stelligen manuellen Code (z.B. `3497-011-2332`) oder den QR-Code-Inhalt (`MT:....`).
3. Bei einem manuell eingegebenen Code auf **KOPPELN** klicken. Ein mit **Webcam** oder **Bild** gelesener QR-Code startet die Kopplung automatisch. Die Kommissionierung kann bis zu einer Minute dauern.

Statt den QR-Payload einzutippen, klicke auf **Webcam**, um ihn live zu scannen, oder auf **Bild**, um ihn aus einem lokalen Foto zu lesen. Sowohl normale dunkle QR-Codes auf hellem Grund als auch invertierte weiße Codes auf dunklem Grund werden unterstützt. Die Dekodierung erfolgt vollständig im Browser; nach dem Lesen eines gültigen Matter-QR-Codes füllt der Editor das Kopplungscode-Feld und startet die Kopplung sofort. Gib den optionalen Gerätenamen vor dem Scannen ein. Ein manuell eingegebener Code startet weiterhin erst mit **KOPPELN**. Der Live-Zugriff auf die Webcam setzt voraus, dass der Editor über HTTPS oder von `localhost` geöffnet wurde; andernfalls erklärt der Editor die Einschränkung und das Laden eines Bildes bleibt verfügbar.

Während der Kommissionierung überdeckt ein blockierender Wartebildschirm den Editor und verhindert weitere Klicks, bis der Vorgang erfolgreich abgeschlossen wird oder fehlschlägt.

Wenn das Gerät fabrikneu ist und nur Bluetooth-Kommissionierung unterstützt, kopple es zuerst mit der Hersteller-App oder einem anderen Matter-Controller (Alexa, Google Home, Apple Home) und nutze dann dessen Funktion **"mit weiterem Hub teilen"**, um einen neuen Kopplungscode für KNX-Ultimate zu erzeugen. So tritt das Gerät mehreren Fabrics gleichzeitig bei.

Bevorzuge den QR-Payload (`MT:...`): Er enthält den vollständigen Diskriminator. Der manuelle Code enthält nur den kurzen Diskriminator und kann bei mehreren identischen Modellen im Kopplungsmodus das falsche Gerät auswählen. Immer nur ein Gerät gleichzeitig koppeln.

## Universeller Modus

Wähle in **Control Matter from KNX** den **Universellen Modus**, um alle Geräte zu überwachen. Ein KNX-Gateway ist optional und wird nur für die Alarm-/Text-GAs des Batteriemonitors benötigt.

Der **Universelle Batteriemonitor** durchsucht alle gekoppelten Nodes und Endpunkte nach Power Source, sendet einen anfänglichen Snapshot und speichert den vollständigen normalisierten Batteriestatus. Er kann nur Batterien unter dem Schwellwert oder jede Aktualisierung ausgeben. `{payload:{action:"getAllBatteries"}}` liefert das Cache-Inventar; rohe Matter-Metadaten stehen in `msg.matter`.

Eingaben benötigen `nodeId`, `endpointId`, `clusterId` sowie `command` oder `attribute` (direkt oder unter `msg.matter`):

- Ein: `{nodeId:"100", endpointId:1, clusterId:6, command:"on", args:{}}`
- Lesen: `{nodeId:"100", endpointId:1, clusterId:47, attribute:"batPercentRemaining"}`
- Schreiben: `{nodeId:"100", endpointId:1, clusterId:513, attribute:"occupiedHeatingSetpoint", value:2100}`

## Speicherung

Die Fabric-Zugangsdaten und die gekoppelten Geräte werden im Ordner `knxultimatestorage/matter` im Node-RED-Benutzerverzeichnis gespeichert. Das Löschen dieses Ordners entfernt alle Kopplungen.

Mit **Exportieren** wird eine vollständige Sicherung dieser Controller-Instanz heruntergeladen. Sie enthält Fabric, private Zugangsdaten, Sitzungen und Daten gekoppelter Geräte. **Die Datei wie ein Passwort schützen.** Der Import ersetzt den Matter-Speicher dieser Instanz und startet den Controller kurz neu. Eine Controller-Sicherung kann nicht in eine Bridge importiert werden.

## Ein Gerät entfernen

Nutze den Papierkorb-Button in der Liste der gekoppelten Geräte. Der Controller versucht, das Gerät sauber zu dekommissionieren; ist es nicht erreichbar, wird es trotzdem aus der Fabric entfernt (danach kann ein Werksreset des Geräts nötig sein).

Die Liste enthält eine Zeile für jeden Node, der derzeit in der Matter-Fabric dieses Controllers gespeichert ist. Node-IDs sind innerhalb dieser Fabric eindeutig; Endpunkte eines einzelnen kommissionierten Bridges werden nicht als separate Geräte aufgeführt. Die Statusspalte zeigt an, ob ein Node verbunden, getrennt, in Wiederverbindung oder auf Geräteerkennung wartend ist.

Der Controller hält die Befehlsreihenfolge für jedes gekoppelte Gerät getrennt. Ein langsames, offline befindliches oder entferntes Gerät kann Befehle für andere Geräte nicht blockieren. Controller-Gerätenodes, die weiterhin auf eine entfernte Node ID verweisen, weisen neue Befehle sofort ab und zeigen **Device no longer commissioned** an.

Wird ein Gerät nicht verfügbar, bleiben seine Controller-Nodes gesperrt und ignorieren weitere Befehle, bis dieses Gerät erneut `connected` meldet. Die Wiederherstellung erfolgt automatisch; auch das Öffnen des Geräte-Node-Editors löst die Sperre für einen manuellen Neuversuch.

Im universellen Batteriemonitor senden optionale KNX-Ausgänge den Sammelalarm als DPT 1.005 und wechseln alle 2 Sekunden die Gerätenamen als 14-Byte-Text DPT 16.001.
