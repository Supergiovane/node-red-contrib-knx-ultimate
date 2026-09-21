---
layout: wiki
title: "knxUltimateViewer"
lang: es
permalink: /wiki/es-knxUltimateViewer
---
## Actualizar a KNX Ultimate 8

La versión 7 añade un pequeño botón **Actualizar a v8** en la parte superior de cada editor de nodo. Crea una copia de los flujos, instala los paquetes HUE/Matter necesarios, convierte los nodos compatibles, realiza un Deploy completo, verifica los flujos guardados e instala la versión 8. Reinicia después el servicio Node-RED cuando se indique; recargar solo el navegador no es suficiente. Los nodos antiguos KNX AI detienen la operación automática.

[Leer la guía completa de actualización](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-Upgrade-to-v8)

# KNX Viewer

KNX Viewer muestra los cambios de estado de las direcciones de grupo (GA) en una tabla sencilla, similar a un monitor ETS básico.

## Configuración

Selecciona la **pasarela KNX** y asigna un **nombre** al nodo. Despliega el flow, vuelve a abrir el nodo y pulsa **Abrir monitor KNX Viewer**. La página se abre en una pestaña nueva y utiliza la misma autenticación y los mismos permisos de lectura que el editor de Node-RED.

## Monitor web

Cada fila muestra la hora, el tipo de telegrama (Read, Write, Response, etc.), la dirección de origen, la GA, el nombre, el DPT, el valor anterior y el nuevo valor. Las entradas más recientes aparecen primero. Para los telegramas Write y Response se registran el primer valor observado de una GA y los cambios posteriores; los valores sin cambios no añaden filas.

Las solicitudes Read también se registran en el historial de 24 horas, sin valor anterior ni nuevo valor. No modifican el último valor conocido de la GA.

Selecciona un Viewer, busca en la lista o recorre las páginas para consultar cambios anteriores. **Pausa** congela la visualización para facilitar su lectura; **En directo** reanuda las actualizaciones. La grabación continúa durante la pausa y cuando la página del navegador está cerrada.

## Historial de 24 horas

El nodo Viewer activo guarda automáticamente el historial en archivos bajo `userDir/knxultimatestorage/viewer`, separados por Viewer y pasarela. Los cambios de más de 24 horas se eliminan automáticamente. Después de reiniciar Node-RED, el Viewer recupera el historial que todavía está dentro de ese período.

La grabación comienza cuando el Viewer actualizado está desplegado y en funcionamiento. No reconstruye el tráfico anterior del bus.

## Salidas del flow

El nodo conserva sus tres salidas existentes:

1. **Valores actuales de las direcciones de grupo** — `msg.payload` contiene una tabla HTML para un nodo Template del panel.
2. **Array de direcciones de grupo** — `msg.payload` contiene los datos de las GA en un array para procesarlos o registrarlos en el flow.
3. **Cola de telegramas** — `msg.payload` contiene una tabla HTML de la cola de transmisión de la pasarela.

El monitor web puede utilizarse sin conectar estas salidas.
