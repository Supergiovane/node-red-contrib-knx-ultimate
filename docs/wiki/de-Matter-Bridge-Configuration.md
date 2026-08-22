---
layout: wiki
title: "Matter-Bridge-Configuration"
lang: de
permalink: /wiki/de-Matter-Bridge-Configuration
---
# Matter Bridge

<div data-matter-bridge-config-overview="hero" style="margin:18px 0 28px;padding:24px;border-radius:16px;background:linear-gradient(135deg,#0d314f 0%,#176b91 55%,#27a9c7 100%);box-shadow:0 14px 30px rgba(13,49,79,0.25);color:#f3fbff;">
  <div style="font-size:0.72rem;letter-spacing:0.18em;text-transform:uppercase;font-weight:700;color:#d1f3ff;">Matter-Server · Multi-Fabric · Stabile Identität</div>
  <div style="font-size:1.75rem;line-height:1.15;font-weight:800;margin:8px 0 10px;">Eine Bridge koppeln. Alle KNX-Geräte bereitstellen.</div>
  <p style="margin:0 0 18px;max-width:860px;line-height:1.6;color:#f3fbff;">Dieser Konfigurations-Node besitzt Matter-Server, Bridge-Identität und Controller-Sitzungen. Alexa, Google Home, Apple Home und weitere Controller koppeln ihn einmal; Device-Nodes erscheinen danach als Live-Endpunkte.</p>
  <div style="display:flex;flex-wrap:wrap;gap:10px;">
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">Einmal koppeln</strong><span style="font-size:0.76rem;color:#e0f7ff;">QR + manueller Code</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">Multi-Fabric</strong><span style="font-size:0.76rem;color:#e0f7ff;">mehrere Controller</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">Live-Abgleich</strong><span style="font-size:0.76rem;color:#e0f7ff;">Endpunkte in Sekunden</span></div>
  </div>
</div>

## Die Bridge im Überblick

| Bereich | Funktionsumfang |
|---|---|
| **Kopplung** | QR und manueller Code, mehrere Matter-Fabrics und explizites Zurücksetzen. |
| **Identität** | Stabile Bridge-Identität bei normalen Deploys, Namensänderungen und Endpunkt-Abgleich. |
| **Skalierung** | Mehrere unabhängige Bridges auf getrennten UDP-Ports und beliebig viele Device-Nodes. |
| **Schutz** | Export/Import von Fabrics, privaten Zugangsdaten, Sitzungen und Kopplungsdaten. |

> Backups wie ein Passwort schützen und **Kopplung zurücksetzen** nur zum Entfernen aller Controller verwenden.

## Technische Übersicht

Dieser Konfigurations-Node ist die **Matter-Bridge selbst**: Er betreibt den Matter-Server, den Alexa, Google Home, Apple Home (oder jeder Matter-Controller) **einmal** koppeln. Jeder **Matter Bridge device**-Node in deinen Flows verweist hierher und erscheint in den Apps als ein Gerät der Bridge.

Die Editoren der Matter-Bridge-Geräte ordnen **Zuordnungen** und **Erweiterte Optionen** als vertikale Tabs links an, entsprechend dem Matter Controller.

Der Selektor **Node Ein-/Ausgangs-PINs** befindet sich außerhalb dieser Tabs. Nach dem Aktivieren erscheint direkt darunter ein kontextbezogener Bereich **Flow-Eingang/-Ausgang** mit kopierbaren Beispielen für Flow → Matter und Matter → Flow, gefiltert nach dem ausgewählten Gerätetyp.

## Konfiguration

|Feld|Beschreibung|
|--|--|
| Name | Der Name dieses Konfigurations-Nodes in Node-RED |
| Name der Matter-Bridge | Wie die Bridge selbst in den Matter-Apps heißt. **Leer lassen, um den Namen dieses Nodes zu verwenden.** |
| Port | UDP-Port des Matter-Servers (Standard 5540). Jede Bridge braucht ihren eigenen Port, daher sind **mehrere unabhängige Bridges** möglich |

## Kopplung

1. **Deployen**, ein paar Sekunden warten, dann diesen Node erneut öffnen.
2. Das Kopplungs-Panel zeigt den **QR-Code** und den **manuellen Code**: scannen oder in Alexa / Google Home / Apple Home eingeben ("Matter-Gerät hinzufügen").
3. Mehrere Controller können mit derselben Bridge gekoppelt werden (Matter Multi-Fabric).

Um nach dem Ausblenden des QR-Codes einen weiteren Controller hinzuzufügen, den Kopplungsmodus über einen bereits gekoppelten Controller öffnen und dann im neuen Controller ein Matter-Gerät hinzufügen. **Kopplung zurücksetzen** nur verwenden, um alle vorhandenen Controller zu entfernen und neu zu beginnen.

Der Button **Kopplung zurücksetzen** entfernt alle gekoppelten Controller und startet die Kopplungs-Ankündigung neu.

## Identität und Speicherung

Die Bridge-Identität ist an diesen Konfigurations-Node gebunden und wird in `knxultimatestorage/matter` im Node-RED-Benutzerverzeichnis gespeichert: Re-Deploys (auch mit geändertem Port oder Namen) erfordern **KEINE** neue Kopplung. Nur das Löschen dieses Konfigurations-Nodes und das Anlegen eines neuen ändert die Identität — in dem Fall die alte Bridge aus der Matter-App entfernen und neu koppeln.

Mit **Exportieren** wird eine vollständige Sicherung dieser Bridge-Instanz heruntergeladen, einschließlich Fabrics, privater Zugangsdaten, Sitzungen und Kopplungsdaten. **Die Datei wie ein Passwort schützen.** Der Import ersetzt den Speicher dieser Instanz und startet die Bridge kurz neu. Eine Bridge-Sicherung kann nicht in einen Controller importiert werden.

## Hinweise

- Der Node-RED-Host muss **IPv6 link-local** aktiviert haben (Standard-Matter-Anforderung) und von den Controllern im lokalen Netzwerk erreichbar sein.
- Hinzugefügte/umbenannte/entfernte Device-Nodes werden von den gekoppelten Controllern innerhalb von Sekunden übernommen, ohne neue Kopplung.
- **Namen:** Alexa und Google Home übernehmen die hier gesetzten Namen (Bridge-Name und Device-Node-Namen). **Apple Home ignoriert sie und verlangt, jedes Zubehör bei der Einrichtung manuell zu benennen** — eine Einschränkung von Apple, nicht der Bridge.
