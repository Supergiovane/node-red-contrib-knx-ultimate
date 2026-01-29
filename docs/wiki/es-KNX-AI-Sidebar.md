---
layout: wiki
title: "KNX-AI-Sidebar"
lang: es
permalink: /wiki/es-KNX-AI-Sidebar
---
La pestaña lateral **KNX AI** muestra en tiempo real tus nodos **KNX AI**: resumen, anomalías y un chat para hacer preguntas sobre el tráfico KNX.

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/knx-ai-sidebar.svg" alt="KNX AI sidebar" style="width:100%;max-width:980px;border-radius:14px;box-shadow:0 12px 26px rgba(0,0,0,0.18);" />

## Para qué sirve

- Ver el resumen del nodo `knxUltimateAI` seleccionado.
- Revisar anomalías detectadas.
- Hacer preguntas en el chat (respuestas renderizadas en Markdown).

## Requisitos

- Al menos un nodo `knxUltimateAI` en tus flujos.
- El nodo `knxUltimateAI` seleccionado debe estar asociado a un gateway `knxUltimate-config`.
- Para respuestas LLM: habilita el LLM en `knxUltimateAI` y configura allí la API key.

## Habilitado por

Esta pestaña la proporciona el plugin de Node-RED:

- `package.json` → `node-red.plugins.knxUltimateAISidebar`
- Archivo: `nodes/plugins/knxUltimateAI-sidebar-plugin.html`

