---
layout: wiki
title: "HATranslator"
lang: de
permalink: /wiki/de-HATranslator
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HATranslator) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HATranslator) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HATranslator) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HATranslator) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HATranslator) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HATranslator)

Dieser Knoten übersetzt das Eingabe -MSG in gültige wahre/falsche Werte. 

Es kann eine Eingangsnutzlast auf einen wahren /falschen booleschen Werte umsetzen. 

Jede Zeile im Textfeld repräsentiert einen Übersetzungsbefehl.

Sie können Ihre eigene Übersetzungsreihe hinzufügen. 

| Eigenschaft | Beschreibung |
|-|-|
|Name |Der Knotenname.|
|Eingabe |Die Eingabe -MSG -Eigenschaft, die bewertet und übersetzt werden soll.|
|Übersetzen |Fügen Sie Ihren eigenen Übersetzungsbefehl hinzu, löschen oder bearbeiten Sie.Der Übersetzungsbefehl der Zeile muss \*\* Eingangszeichenfolge aus HA: KNX -Wert \*\* (_KNX -Wer&#x74;_&#x61;ls wahr oder falsch) sein.Zum Beispiel: <Code> Öffnen: True </code> <code> geschlossen: false </code>.|
