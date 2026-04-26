---
layout: wiki
title: "KNX-AI-Sidebar"
lang: es
permalink: /wiki/es-KNX-AI-Sidebar
---
El **dashboard KNX AI** te ayuda a controlar tu instalacion KNX de forma simple.
Puedes ver que pasa, detectar anomalias, ejecutar pruebas y hacer preguntas en lenguaje natural.
Esta pagina mantiene el nombre historico `KNX-AI-Sidebar` por compatibilidad.

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/knx-ai-sidebar.svg" alt="KNX AI sidebar" style="width:100%;max-width:980px;border-radius:14px;box-shadow:0 12px 26px rgba(0,0,0,0.18);" />

## Que puedes hacer

- Ver el estado del sistema de un vistazo.
- Identificar las direcciones de grupo mas activas.
- Crear y gestionar areas con ayuda de IA.
- Ejecutar pruebas guiadas y leer resultados claros.
- Preguntar al asistente: "que esta fallando?"

## Inicio rapido

1. Ábrelo desde el editor del nodo KNX AI con **Open Web Page**.
2. Selecciona tu nodo KNX AI en la lista.
3. Pulsa **Refresh** si hace falta.

## Secciones principales (guia simple)

- **Overview**: resumen en vivo y actividad.
- **Areas**: habitaciones/zonas y direcciones de grupo asociadas.
- **Tests**: preparar y lanzar comprobaciones.
- **Test Results**: historial pass/warn/fail.
- **Ask**: escribir preguntas en lenguaje natural.
  Si el archivo en disco está activado en el nodo, Ask consulta ese archivo por defecto y, sin fecha explícita, usa las últimas 24 horas.
- **Settings**: seleccion de nodo e import/export.

## Flujo recomendado (primera vez)

1. Empieza en **Overview** para ver si el sistema esta estable.
2. Abre **Areas** y revisa habitaciones/zonas.
3. Si hace falta, usa **Regenerate AI Areas**.
4. Ejecuta una prueba en **Tests** y revisa **Test Results**.
5. En **Ask**, describe el problema en una frase y sigue las comprobaciones sugeridas.

## Botones mas usados

- **Refresh**: actualiza los datos al instante.
- **Regenerate AI Areas**: reconstruye sugerencias de areas IA desde direcciones ETS.
- **Delete AI Areas**: elimina todas las areas generadas por IA en una sola accion.
- **New Area**: crea un area manualmente.

## Cuando la IA esta trabajando

Mientras se generan o eliminan areas, aparece una pantalla de espera centrada.
Es normal: la pagina bloquea los clics hasta terminar para evitar cambios accidentales.

## Requisitos

- Al menos un nodo KNX AI configurado.
- Un gateway conectado y en marcha.
- Para respuestas en chat: LLM activado y API key configurada en el nodo KNX AI.
