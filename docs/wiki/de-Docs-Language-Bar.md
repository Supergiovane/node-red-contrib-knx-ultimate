---
layout: wiki
title: "Docs-Language-Bar"
lang: de
permalink: /wiki/de-Docs-Language-Bar
translation_key: "Docs-Language-Bar"
---
---

<H1> <p Align = 'Center'> Wiki -Sprachleiste - Wie zu </p> </h1>

Verwenden Sie dieses Muster, um den Sprachschalter zu Wiki -Seiten hinzuzufügen und weiterhin übersetzende zu benennen.

Richtlinien
-Dateinamen: Basis-EN-Seite, dann Präfix für andere Sprachen: `it-`, `de-`,`zh-cn-'(z. B.`Hue light.md`,` it-hue light.md\`).

- Erste Zeile (erforderlich): Fügen Sie die Sprachleiste mit dem Globe -Symbol hinzu und verlinkt zu den vier Varianten.
  -Separator: Hinzufügen von `---` in der nächsten Zeile, dann einer leeren Zeile, dann auf dem Seiteninhalt.
- Links: Verwenden Sie absolute Wiki -URLs.Leerzeichen werden in URLs zu "+" (z. B. "Hue Light" → "Hue+Light").
- Neue Seiten: Wenn eine Übersetzung noch nicht verfügbar ist, können Sie nur vorübergehend die EN -Seite veröffentlichen.Fügen Sie andere Dateien hinzu, wenn Sie fertig sind.

Snippet

- Setzen Sie dies ganz oben auf jeder Seite und ersetzen Sie den Page -Titel "durch den Wiki -Dateinamen ohne Erweiterung:
- `🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/Page+Title) | [IT](/node-red-contrib-knx-ultimate/wiki/it-Page+Title) | [DE](/node-red-contrib-knx-ultimate/wiki/de-Page+Title) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-Page+Title)`
  -`---`

Konventionen
.

- Verwenden Sie konsistente DPT -Notationen (z. B. `DPT 3.007`,` DPT 5.001`, `DPT 9.001`).
- Halten Sie Produktnamen und Marken unverändert (z. B. Hue, KNX).

Betreuer

- Alle Seiten validieren: `NPM Run Wiki: validate`
  -Auto-Fix-Sprachbalken zu absoluten URLs: `NPM Run Wiki: Fix-Langbar`
- Hinweise: `_sideBar.md`,` _footer.md` und Seiten unter `proben/` werden von der Validierung ausgeschlossen.
