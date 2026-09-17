---
layout: wiki
title: "Erste Schritte"
lang: de
permalink: /wiki/de-Getting-Started
translation_key: "Getting-Started"
---

# Erste Schritte

Für eine neue Installation folge diesen Schritten. Wenn deine Flows bereits KNX Ultimate 7 nutzen, lies zuerst die Upgrade-Anleitung.

> [Upgrade von Version 7]({{ '/wiki/de-Migration-8' | relative_url }})

Erfordert Node.js ab 20.18.1 und Node-RED ab 3.1.1.

1. Öffne **Palette verwalten → Installieren** und installiere `node-red-contrib-knx-ultimate`. Starte Node-RED neu.

2. Ziehe **KNX Device** in den Flow. Erstelle eine Gateway-Konfiguration mit Adresse und Verbindungseinstellungen deiner KNX-Schnittstelle. Importiere bei Bedarf die ETS-Gruppenadressen.

3. Wähle eine Gruppenadresse deiner Anlage und den passenden Datenpunkt. Für Ein/Aus nutze den vorgesehenen booleschen Datenpunkt, zum Beispiel `1.001`.

4. Verbinde einen **Inject**-Knoten mit booleschem `msg.payload` (`true` oder `false`) mit KNX Device. Verbinde dessen Ausgang mit **Debug**, um empfangene Telegramme zu sehen.

5. Prüfe die Adresse und klicke **Deploy**. Sende den Befehl mit Inject. Aktiviere **React to response**, um Antworten auf Leseanforderungen zu sehen.

## Einen Wert vom Bus lesen

Aktiviere den manuellen Button von KNX Device. Die Aktionen sind **Toggle boolean**, **KNX Read senden** (zweiter Eintrag) und **Benutzerdefinierten Wert schreiben**. Wähle Read und klicke den Button, um die konfigurierte Adresse abzufragen. Im Universalmodus ist diese Button-Aktion nicht verfügbar. Aus einem Flow kannst du auch `msg.readstatus = true` senden.

[KNX Device]({{ '/wiki/de-Device' | relative_url }}) · [KNX Gateway]({{ '/wiki/de-Gateway-configuration' | relative_url }}) · [Beispiele]({{ '/wiki/de--SamplesHome' | relative_url }})

## Videoanleitungen

[Max Supervibe — YouTube](https://www.youtube.com/playlist?list=PL9Yh1bjbLAYrU8PsVhW4xzEug2WtVFv3E)
