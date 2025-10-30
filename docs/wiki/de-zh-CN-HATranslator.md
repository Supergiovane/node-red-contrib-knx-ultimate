---
layout: wiki
title: "zh-CN-HATranslator"
lang: de
permalink: /wiki/de-zh-CN-HATranslator
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HATranslator) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HATranslator) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HATranslator) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HATranslator) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HATranslator) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HATranslator)
---

<p> Dieser Knoten konvertiert Eingabe -MSG in einen gültigen wahren/falschen Wert.<p>

Es kann die Eingangsnutzlast in true /false boolean umwandeln.<br />
Jede Zeile im Textfeld stellt einen Übersetzungsbefehl dar. <br/>
Sie können Ihre eigenen Übersetzungslinien hinzufügen.<br/>

| Eigenschaften | Beschreibung |
|-|-|
| Name | Knotenname. |
| Eingabe |Eingabe -MSG -Eigenschaften zur Bewertung und Übersetzung. |
| Übersetzung |Ihre eigenen Übersetzungsbefehle hinzufügen, löschen oder bearbeiten.Der Übersetzungsbefehl für diese Zeile muss die \*\* Eingabezeichenfolge aus HA: KNX -Wert \*\* (_knx Valu _ &#x4E3A; true oder falsch) sein.Zum Beispiel: <Code> Öffnen: True </code> <code> geschlossen: false </code>. |

<br/>
