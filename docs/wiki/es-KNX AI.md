---
layout: wiki
title: "KNX AI"
lang: es
permalink: /wiki/es-KNX%20AI
---
Este nodo escucha **todos los telegramas KNX** del gateway KNX Ultimate seleccionado, genera estadísticas de tráfico, detecta anomalías y puede consultar opcionalmente un LLM.

## Salidas
1. **Resumen/Estadísticas** (`msg.payload` JSON)
2. **Anomalías** (`msg.payload` JSON)
3. **Asistente IA** (`msg.payload` texto, con `msg.summary`)

## Comandos (entrada)
Envía `msg.topic`:
- `summary` (o vacío): emite el resumen inmediatamente
- `reset`: limpia historial y contadores internos
- `ask`: envía una pregunta al LLM configurado

Para `ask`, envía la pregunta en `msg.prompt` (recomendado) o `msg.payload` (string).

## Campos de configuración
Aquí tienes todos los campos tal como se muestran en el editor de KNX AI.

### General
- **Gateway**: gateway/config node KNX Ultimate usado como fuente de telegramas.
- **Name**: nombre del nodo y título del dashboard.
- **Topic**: topic base usado en las salidas del nodo.
- Botón **Open KNX AI Web**: abre el dashboard web (`/knxUltimateAI/sidebar/page`).

### Capture
- **Capture GroupValue_Write**: captura telegramas Write.
- **Capture GroupValue_Response**: captura telegramas Response.
- **Capture GroupValue_Read**: captura telegramas Read.

### Analysis
- **Analysis window (seconds)**: ventana principal para resumen/rate.
- **History window (seconds)**: ventana de retención del historial interno.
- **Max stored events**: número máximo de telegramas en memoria.
- **Auto emit summary (seconds, 0=off)**: intervalo periódico de resumen.
- **Top list size**: cantidad de group addresses/fuentes en el top.
- **Detect simple patterns (A -> B)**: habilita detección de transiciones/patrones.
- **Pattern max lag (ms)**: diferencia temporal máxima para correlación.
- **Pattern min occurrences**: ocurrencias mínimas antes de reportar patrón.

### Anomalies
- **Rate window (seconds)**: ventana deslizante para controles de rate.
- **Max overall telegrams/sec (0=off)**: umbral en el bus global.
- **Max telegrams/sec per GA (0=off)**: umbral por group address.
- **Flap window (seconds)**: ventana para detectar flapping/cambios rápidos.
- **Max changes per GA in window (0=off)**: cambios máximos permitidos en ventana.

### LLM Assistant
- **Enable LLM assistant**: habilita funciones Ask/chat.
- **Provider**: backend LLM (OpenAI-compatible u Ollama).
- **Endpoint URL**: URL endpoint chat/completions.
- **API key**: clave API (no requerida con Ollama local).
- **Model**: ID/nombre de modelo.
- **System prompt**: instrucción global para análisis KNX.
- **Temperature**: temperatura de muestreo.
- **Max tokens**: máximo de tokens de completado.
- **Timeout (ms)**: timeout HTTP de peticiones LLM.
- **Recent events included**: máximo de eventos recientes en el prompt.
- **Include raw payload hex**: incluye payload hex raw en el prompt.
- **Include Node-RED KNX node inventory**: incluye inventario de flows en el prompt.
- **Max flow nodes included**: límite de nodos flow incluidos.
- **Include documentation snippets (help/README/examples)**: incluye contexto de documentación.
- **Docs language**: idioma preferido de snippets documentación.
- **Max docs snippets**: máximo de snippets de documentación.
- **Max docs chars**: máximo total de caracteres de documentación.
- Botón **Refresh**: consulta el provider y carga modelos disponibles.

## Nota de seguridad
Si el LLM está habilitado, el contexto de tráfico KNX puede enviarse al endpoint configurado. Para privacidad on-premise, usa proveedores locales.
