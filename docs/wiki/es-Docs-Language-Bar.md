---
layout: wiki
title: "Docs-Language-Bar"
lang: es
permalink: /wiki/es-Docs-Language-Bar/
---
---
<h1> <p Align = 'Center'> Wiki Language Bar - Cómo </p> </h1>
Use este patrón para agregar el cambio de idioma a las páginas wiki y seguir nombrando de manera consistente en las traducciones.
Pautas
-nombres de archivo: base en página, luego prefijo otros idiomas: `it-`, `de-`, `zh-cn-` (por ejemplo, `hue light.md`,` it-hue light.md`).
- Primera línea (requerida): agregue la barra de idiomas con el icono del mundo y los enlaces a las cuatro variantes.
-Separador: Agregar `---` en la siguiente línea, luego una línea en blanco, luego el contenido de la página.
- Enlaces: use URL de wiki absoluta.Los espacios se convierten en `+` en URL (por ejemplo, `Hue Light` →` Hue+Light`).
- Páginas nuevas: si una traducción aún no está disponible, puede mantener temporalmente solo la página EN publicada;Agregue otros archivos cuando esté listo.
Retazo
- Pon esto en la parte superior de cada página, reemplazando el `Título de la página` con el nombre de archivo wiki sin extensión:
- `🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/Page+Title) | [IT](/node-red-contrib-knx-ultimate/wiki/it-Page+Title) | [DE](/node-red-contrib-knx-ultimate/wiki/de-Page+Title) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-Page+Title)`
-`---`
Convenciones
- Páginas de nodo Hue: las secciones deben seguir `General`,` Mapping`, `salidas`,` detalles '.
- Use anotaciones de DPT consistentes (por ejemplo, `DPT 3.007`,` DPT 5.001`, `DPT 9.001`).
- Mantenga los nombres y marcas de productos sin cambios (por ejemplo, Hue, KNX).
Mantenedores
- Validar todas las páginas: `NPM Run Wiki: Validate`
-Barras de idioma auto-fijado a URL absolutas: `npm run wiki: fix-langbar`
- Notas: `_sidebar.md`,` _footer.md`, y las páginas bajo `muestras/` están excluidas de la validación.
