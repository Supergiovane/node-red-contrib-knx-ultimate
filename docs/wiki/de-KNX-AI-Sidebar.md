---
layout: wiki
title: "KNX-AI-Sidebar"
lang: de
permalink: /wiki/de-KNX-AI-Sidebar
---
Das **KNX AI Dashboard** hilft dir, deine KNX-Anlage einfach zu überwachen.
Du siehst schnell, was passiert, findest Anomalien, startest Tests und stellst Fragen in normaler Sprache.
Diese Seite behält den historischen Namen `KNX-AI-Sidebar` aus Kompatibilitätsgründen.

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/knx-ai-sidebar.svg" alt="KNX AI sidebar" style="width:100%;max-width:980px;border-radius:14px;box-shadow:0 12px 26px rgba(0,0,0,0.18);" />

## Was du damit machen kannst

- Anlagenstatus auf einen Blick sehen.
- Erkennen, welche Gruppenadressen am aktivsten sind.
- Bereiche mit KI-Unterstützung erstellen und verwalten.
- Geführte Tests ausführen und klare Ergebnisse lesen.
- Den Assistenten fragen: "Was stimmt nicht?"

## Schnell starten

1. Öffne es im KNX-AI-Node-Editor mit **Open Web Page**.
2. Deinen KNX-AI-Node aus der Liste auswählen.
3. Bei Bedarf **Refresh** drücken.

## Hauptbereiche (kurz erklärt)

- **Overview**: Live-Zusammenfassung und Aktivität.
- **Areas**: Räume/Zonen und zugehörige Gruppenadressen.
- **Tests**: Prüfungen vorbereiten und starten.
- **Test Results**: Historie mit pass/warn/fail.
- **Ask**: Fragen in natürlicher Sprache stellen.
- **Settings**: Node-Auswahl und Import/Export.

## Empfohlener Ablauf (erste Nutzung)

1. In **Overview** prüfen, ob das System stabil wirkt.
2. In **Areas** kontrollieren, ob Räume/Zonen sinnvoll sind.
3. Bei Bedarf **Regenerate AI Areas** verwenden.
4. In **Tests** einen Test starten und danach **Test Results** prüfen.
5. In **Ask** das Problem in einem Satz beschreiben und die Vorschläge abarbeiten.

## Wichtige Buttons

- **Refresh**: Daten sofort aktualisieren.
- **Regenerate AI Areas**: KI-Bereichsvorschläge aus ETS-Adressen neu erstellen.
- **Delete AI Areas**: alle KI-erzeugten Bereiche auf einmal löschen.
- **New Area**: einen Bereich manuell anlegen.

## Wenn die KI arbeitet

Beim Generieren oder Löschen von Bereichen erscheint ein Wartebildschirm in der Mitte.
Das ist normal: Die Seite blockiert Klicks bis zum Ende, damit keine falschen Änderungen passieren.

## Voraussetzungen

- Mindestens ein konfigurierter KNX-AI-Node.
- Ein verbundenes und laufendes Gateway.
- Für Chat-Antworten: LLM aktivieren und API-Key im KNX-AI-Node eintragen.
