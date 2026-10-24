---
layout: wiki
title: "Docs-Language-Bar"
lang: en
permalink: /wiki/Docs-Language-Bar
translation_key: "Docs-Language-Bar"
---

# Wiki translations — How To

The documentation site shows every page in six languages: English, Italian, German, French, Spanish and Simplified Chinese. The language menu of the navbar links the translations of the same page automatically.

## Filenames

- The English page has no prefix (for example `Device.md`).
- Translations use the prefixes `it-`, `de-`, `fr-`, `es-` and `zh-CN-` (for example `it-Device.md`).

## Front matter

Every page starts with a front matter block:

```yaml
---
layout: wiki
title: "Device"
lang: it
permalink: /wiki/it-Device
translation_key: "Device"
---
```

- `lang` must match the filename prefix (`en` when there is no prefix).
- `translation_key` is the same in all the translations of a page: the navbar uses it to link them.
- `npm run wiki:refresh` creates the front matter of new pages.

## Checks

- `npm run wiki:validate` reports pages without front matter, with a wrong `lang` or without `translation_key`, pages still carrying the obsolete "🌐 Language:" bar, and pages missing some translations.
- `npm run wiki:fix-langbar` fixes `lang` and `translation_key` and removes the obsolete bar. Missing translations must be written by hand.
- `_Sidebar.md`, `_Footer.md` and the pages under `samples/` are not checked.
