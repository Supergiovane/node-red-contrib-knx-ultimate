---
layout: wiki
title: "Docs-Language-Bar"
lang: de
permalink: /wiki/de-Docs-Language-Bar
translation_key: "Docs-Language-Bar"
---

# Wiki-Übersetzungen — Anleitung

Die Dokumentationsseite zeigt jede Seite in sechs Sprachen: Englisch, Italienisch, Deutsch, Französisch, Spanisch und vereinfachtes Chinesisch. Das Sprachmenü der Navigationsleiste verknüpft die Übersetzungen derselben Seite automatisch.

## Dateinamen

- Die englische Seite hat kein Präfix (zum Beispiel `Device.md`).
- Übersetzungen verwenden die Präfixe `it-`, `de-`, `fr-`, `es-` und `zh-CN-` (zum Beispiel `it-Device.md`).

## Front Matter

Jede Seite beginnt mit einem Front-Matter-Block:

```yaml
---
layout: wiki
title: "Device"
lang: it
permalink: /wiki/it-Device
translation_key: "Device"
---
```

- `lang` muss zum Präfix des Dateinamens passen (`en`, wenn es kein Präfix gibt).
- `translation_key` ist in allen Übersetzungen einer Seite gleich: Die Navigationsleiste verknüpft sie darüber.
- `npm run wiki:refresh` erstellt das Front Matter neuer Seiten.

## Prüfungen

- `npm run wiki:validate` meldet Seiten ohne Front Matter, mit falschem `lang` oder ohne `translation_key`, Seiten mit der veralteten Leiste "🌐 Language:" sowie Seiten, denen Übersetzungen fehlen.
- `npm run wiki:fix-langbar` korrigiert `lang` und `translation_key` und entfernt die veraltete Leiste. Fehlende Übersetzungen müssen von Hand geschrieben werden.
- `_Sidebar.md`, `_Footer.md` und die Seiten unter `samples/` werden nicht geprüft.
