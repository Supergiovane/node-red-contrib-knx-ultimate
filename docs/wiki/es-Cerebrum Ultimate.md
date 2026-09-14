---
layout: wiki
title: "Cerebrum Ultimate"
lang: es
permalink: /wiki/es-Cerebrum-Ultimate
---

# Cerebrum Ultimate

El nodo de IA incluido anteriormente en KNX Ultimate ha sido sustituido por el paquete independiente **Cerebrum Ultimate**.

Cerebrum Ultimate utiliza KNX Ultimate como una integración compatible opcional, al igual que Home Assistant, HUE, Matter, UniFi Protect y otros adaptadores registrados. Las instalaciones nuevas deben usar [`node-red-contrib-cerebrum-ultimate`](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate).

A partir de **7.1.0-beta.0**, `knxUltimateAI`, `knxUltimateAIHomeAssistant` y su interfaz web se han eliminado de KNX Ultimate. Los flows existentes que contengan estos tipos mostrarán nodos desconocidos. Migra esos flows al paquete independiente Cerebrum Ultimate antes de actualizar; no hay conversión automática. Los datos de IA guardados en disco se conservan.

La documentación completa en inglés está en el [README de Cerebrum Ultimate](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate#readme).
