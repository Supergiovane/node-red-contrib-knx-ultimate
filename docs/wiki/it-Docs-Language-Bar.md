---
layout: wiki
title: "Docs-Language-Bar"
lang: it
permalink: /wiki/it-Docs-Language-Bar
translation_key: "Docs-Language-Bar"
---

# Traduzioni della wiki — Come fare

Il sito della documentazione mostra ogni pagina in sei lingue: inglese, italiano, tedesco, francese, spagnolo e cinese semplificato. Il menu lingua della barra di navigazione collega automaticamente le traduzioni della stessa pagina.

## Nomi dei file

- La pagina inglese non ha prefisso (ad esempio `Device.md`).
- Le traduzioni usano i prefissi `it-`, `de-`, `fr-`, `es-` e `zh-CN-` (ad esempio `it-Device.md`).

## Front matter

Ogni pagina inizia con un blocco di front matter:

```yaml
---
layout: wiki
title: "Device"
lang: it
permalink: /wiki/it-Device
translation_key: "Device"
---
```

- `lang` deve corrispondere al prefisso del file (`en` se non c'è prefisso).
- `translation_key` è uguale in tutte le traduzioni di una pagina: la barra di navigazione lo usa per collegarle.
- `npm run wiki:refresh` crea il front matter delle nuove pagine.

## Verifiche

- `npm run wiki:validate` segnala le pagine senza front matter, con `lang` errato o senza `translation_key`, le pagine che hanno ancora la vecchia barra "🌐 Language:" e le pagine a cui manca qualche traduzione.
- `npm run wiki:fix-langbar` corregge `lang` e `translation_key` e rimuove la vecchia barra. Le traduzioni mancanti vanno scritte a mano.
- `_Sidebar.md`, `_Footer.md` e le pagine in `samples/` non vengono verificati.
