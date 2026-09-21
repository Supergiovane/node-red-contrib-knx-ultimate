---
layout: wiki
title: "Cerebrum Ultimate"
lang: es
permalink: /wiki/es-Cerebrum-Ultimate
---
### Actualizar a KNX Ultimate 8

La versión 7 muestra un pequeño botón **Actualizar a v8** en la parte superior de este editor. Descarga una copia de los flujos, instala los paquetes HUE/Matter necesarios, convierte los nodos compatibles, realiza un Deploy completo, verifica los flujos guardados e instala la versión 8. Reinicia después el servicio Node-RED cuando se indique; recargar solo el navegador no es suficiente. Los nodos antiguos KNX AI detienen la operación automática.

[Guía completa de actualización](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-Upgrade-to-v8)

<br/>

# Cerebrum Ultimate

El nodo de IA incluido anteriormente en KNX Ultimate ha sido sustituido por el paquete independiente **Cerebrum Ultimate**.

Cerebrum Ultimate utiliza KNX Ultimate como una integración compatible opcional, al igual que Home Assistant, HUE, Matter, UniFi Protect y otros adaptadores registrados. Las instalaciones nuevas deben usar [`node-red-contrib-cerebrum-ultimate`](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate).

Desde **7.1.1**, los nodos antiguos `knxUltimateAI` y `knxUltimateAIHomeAssistant` y su interfaz web vuelven a estar incluidos para mantener la compatibilidad con los flows existentes. Los nodos están ocultos en la paleta; las configuraciones existentes y los datos de IA guardados siguen siendo compatibles. La migración al paquete independiente Cerebrum Ultimate es opcional y no hay conversión automática.

La documentación completa en inglés está en el [README de Cerebrum Ultimate](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate#readme).
