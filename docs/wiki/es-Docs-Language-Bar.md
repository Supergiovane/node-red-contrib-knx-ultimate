---
layout: wiki
title: "Docs-Language-Bar"
lang: es
permalink: /wiki/es-Docs-Language-Bar
translation_key: "Docs-Language-Bar"
---

# Traducciones de la wiki — Cómo hacerlo

El sitio de la documentación muestra cada página en seis idiomas: inglés, italiano, alemán, francés, español y chino simplificado. El menú de idiomas de la barra de navegación enlaza automáticamente las traducciones de la misma página.

## Nombres de archivo

- La página en inglés no tiene prefijo (por ejemplo `Device.md`).
- Las traducciones usan los prefijos `it-`, `de-`, `fr-`, `es-` y `zh-CN-` (por ejemplo `it-Device.md`).

## Front matter

Cada página empieza con un bloque de front matter:

```yaml
---
layout: wiki
title: "Device"
lang: it
permalink: /wiki/it-Device
translation_key: "Device"
---
```

- `lang` debe coincidir con el prefijo del archivo (`en` si no hay prefijo).
- `translation_key` es igual en todas las traducciones de una página: la barra de navegación lo usa para enlazarlas.
- `npm run wiki:refresh` crea el front matter de las páginas nuevas.

## Comprobaciones

- `npm run wiki:validate` informa de las páginas sin front matter, con un `lang` incorrecto o sin `translation_key`, de las páginas que todavía tienen la antigua barra "🌐 Language:" y de las páginas a las que les falta alguna traducción.
- `npm run wiki:fix-langbar` corrige `lang` y `translation_key` y elimina la antigua barra. Las traducciones que faltan deben escribirse a mano.
- `_Sidebar.md`, `_Footer.md` y las páginas en `samples/` no se comprueban.
