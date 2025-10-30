---
layout: wiki
title: "zh-CN-Docs-Language-Bar"
lang: de
permalink: /wiki/de-zh-CN-Docs-Language-Bar
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Docs-Language-Bar) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-Docs-Language-Bar) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-Docs-Language-Bar) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-Docs-Language-Bar) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-Docs-Language-Bar) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-Docs-Language-Bar)
---

<H1> <p Align = 'Center'> Wiki -Sprachleiste - Wie </p> </h1>

Verwenden Sie diesen Modus, um der Wiki -Seite Sprachschalter hinzuzufügen und eine konsistente Benennung in der Übersetzung beizubehalten.

Führung

-Dateiname: Basisseite, dann Präfixe für andere Sprachen: "It-", "de-," zh-cn "(z. B." Hue light.md.md \ ", It-Hue Light.md").
- Erste Zeile (erforderlich): Fügen Sie die Sprachleiste mit dem Erde -Symbol hinzu und verlinken Sie mit vier Varianten.
-Segmentierer: Hinzufügen von `---` in der nächsten Zeile, dann in der leeren Zeile, dann auf den Seiteninhalt.
- Link: Verwenden Sie die absolute Wiki -URL.Ändern Sie Platz in '+`+` in der URL
- Neue Seite: Wenn Sie nicht übersetzt wurden, können Sie die EN -Seite vorübergehend behalten.Fügen Sie andere Dateien hinzu, wenn Sie bereit sind.

Fragment

- Platzieren Sie es ganz oben auf jeder Seite und ersetzen Sie den "Seitentitel" ohne Erweiterung durch den Namen Wiki -Datei:
- `🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/Page+Title) | [IT](/node-red-contrib-knx-ultimate/wiki/it-Page+Title) | [DE](/node-red-contrib-knx-ultimate/wiki/de-Page+Title) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-Page+Title)` `
-`---`

Treffen

.
- Verwenden Sie eine konsistente DPT -Notation (z. B. `DPT 3.007`,` DPT 5.001`, `DPT 9.001`).
- Halten Sie den Produktnamen und die Marke unverändert (z. B. Hue, KNX).

Betreuer

- Überprüfen Sie alle Seiten: \ `npm run wiki: validate ''
- Automatische feste Sprachleiste für absolute URL: \ `NPM Wiki: Fix-Langbar \` \ `
- HINWEIS: Seiten unter `_sidebar.md`, '\ _foter.md \`, \ `\` proben/' sind von der Überprüfung ausgeschlossen.
