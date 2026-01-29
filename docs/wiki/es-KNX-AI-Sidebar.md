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
- Hacer preguntas en el chat (respuestas renderizadas en Markdown) para acelerar el diagnóstico.

## Cómo usarlo

1. Selecciona el nodo `knxUltimateAI` en el desplegable.
2. Pulsa **Refresh Summary** (o activa **Auto**).
3. Usa el chat para preguntar “por qué” y “qué revisar”.

## Más contexto (mejores respuestas)

En el nodo `knxUltimateAI` seleccionado puedes incluir contexto extra en el prompt del LLM:

- **Inventario del flow:** permite que la IA “vea” qué nodos KNX Ultimate (y gateways) existen en tus flows, para relacionar telegramas con tu lógica.
- **Fragmentos de documentación:** añade extractos relevantes de help/README/ejemplos (y `docs/wiki` si está disponible) para explicar mejor los nodos y sugerir configuraciones correctas.

## Ejemplos de uso (escenarios)

- **Bucle / telegramas duplicados:** identificar causas probables y aislar el origen.
- **GA ruidosa:** por qué una GA es la más activa y qué fuentes escriben en ella.
- **Comportamiento raro tras un deploy:** qué cambió en los últimos minutos y qué patrones aparecieron.
- **Problemas de routing entre gateways:** filtrar/reescribir para evitar tormentas o bucles de retorno.

## Ejemplos de preguntas para pegar en el chat

- “¿Por qué `2/4/2` está tan activa? ¿Cuáles son las causas más probables?”
- “¿Ves patrones de bucle entre dos direcciones de grupo?”
- “¿Qué direcciones físicas escriben en `x/y/z` y con qué frecuencia?”
- “¿Qué filtros pongo en Router Filter para parar el spam pero mantener el tráfico normal?”

## Requisitos

- Al menos un nodo `knxUltimateAI` en tus flujos.
- El nodo `knxUltimateAI` seleccionado debe estar asociado a un gateway `knxUltimate-config`.
- Para respuestas LLM: habilita el LLM en `knxUltimateAI` y configura allí la API key.
