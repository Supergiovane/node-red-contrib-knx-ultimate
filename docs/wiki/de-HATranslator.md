---
layout: wiki
title: "HATranslator"
lang: de
permalink: /wiki/de-HATranslator
---
## Upgrade auf KNX Ultimate 8

Version 7 ergänzt oben in jedem Knoteneditor eine kleine Schaltfläche **Auf v8 aktualisieren**. Sie sichert die Flows, installiert die benötigten HUE-/Matter-Pakete, konvertiert kompatible Knoten, führt ein vollständiges Deploy aus, prüft die gespeicherten Flows und installiert Version 8. Starten Sie den Node-RED-Dienst anschließend wie aufgefordert neu; nur den Browser neu zu laden genügt nicht. Bisherige KNX-AI-Knoten stoppen den automatischen Vorgang.

[Vollständige Upgrade-Anleitung lesen](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-Upgrade-to-v8)


<!-- KNX_UTILITY_LEGACY_NOTICE -->
> Dieser Einzelknoten bleibt mit bestehenden Flows kompatibel. Verwenden Sie für neue Flows [KNX Utility](/node-red-contrib-knx-ultimate/wiki/de-KNX-Utility) und wählen Sie **Home Assistant Translator**. Sein Editor konvertiert alle kompatiblen bisherigen Hilfsknoten in allen Flows und Subflows gemeinsam, mit einmaligem Rückgängig und manuellem Deploy.

Home Assistant Translator hat einen Eingang und einen Ausgang und benötigt kein KNX-Gateway. Wählen Sie die zu übersetzende Nachrichteneigenschaft (etwa `payload` oder `data.new_state.state`) und bearbeiten Sie die Zuordnungen `Quelle:true` / `Quelle:false`, zum Beispiel `open:true` und `closed:false`. Der übersetzte boolesche Wert wird in `msg.payload` ausgegeben. Verbinden Sie den Ausgang mit KNX Device, wenn ein Schreiben auf den Bus erforderlich ist.

Dieser Knoten übersetzt das Eingabe -MSG in gültige wahre/falsche Werte. 

Es kann eine Eingangsnutzlast auf einen wahren /falschen booleschen Werte umsetzen. 

Jede Zeile im Textfeld repräsentiert einen Übersetzungsbefehl.

Sie können Ihre eigene Übersetzungsreihe hinzufügen. 

| Eigenschaft | Beschreibung |
|-|-|
|Name |Der Knotenname.|
|Eingabe |Die Eingabe -MSG -Eigenschaft, die bewertet und übersetzt werden soll.|
|Übersetzen |Fügen Sie Ihren eigenen Übersetzungsbefehl hinzu, löschen oder bearbeiten Sie.Der Übersetzungsbefehl der Zeile muss \*\* Eingangszeichenfolge aus HA: KNX -Wert \*\* (_KNX -Wer&#x74;_&#x61;ls wahr oder falsch) sein.Zum Beispiel: <Code> Öffnen: True </code> <code> geschlossen: false </code>.|
