---
layout: wiki
title: "zh-CN-Docs-Language-Bar"
lang: es
permalink: /wiki/es-zh-CN-Docs-Language-Bar
---
---
<h1> <p align = 'Center'> Wiki Language Bar - Cómo </p> </h1>
Use este modo para agregar interruptores de lenguaje a la página Wiki y mantener un nombramiento constante en la traducción.
guía
-Nombre del archivo: página base, luego prefijos para otros idiomas: `` it- ', `de-,` zh-cn-- (por ejemplo, `` hue light.md.md \ `, it-hue light.md' ').
- Primera línea (requerida): agregue la barra de idiomas con el icono de la Tierra y el enlace a cuatro variantes.
-Segmenter: Agregar `---` en la línea siguiente, luego la línea en blanco, luego el contenido de la página.
- Enlace: use la URL wiki absoluta.Cambiar espacio a '+`+` en URL
- Página nueva: si no ha traducido, puede mantener temporalmente la página EN;Agregue otros archivos cuando esté listo.
Fragmento
- Coloque en la parte superior de cada página, reemplazando el "título de la página" con el nombre del archivo wiki sin extensión:
- `🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/Page+Title) | [IT](/node-red-contrib-knx-ultimate/wiki/it-Page+Title) | [DE](/node-red-contrib-knx-ultimate/wiki/de-Page+Title) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-Page+Title)`
-`---`
Reunión
- Página de nodo Hue: las piezas deben seguir \ `\` germal ', \ `\` \ `map', 'uptuffs', \` `
- Use notación DPT consistente (por ejemplo, `DPT 3.007`,` DPT 5.001`, `DPT 9.001`).
- Mantenga el nombre del producto y la marca sin cambios (por ejemplo, Hue, KNX).
Mantenedor
- Verifique todas las páginas: \ `npm ejecutar wiki: validar '
- barra de lenguaje fijo automática para URL absoluta: \ `npm ejecutar wiki: fix-langbar \` \ `
- Nota: Las páginas en `_sidebar.md`, '\ _footer.md \`, \ `\` SAMPLES/' están excluidas de la verificación.
