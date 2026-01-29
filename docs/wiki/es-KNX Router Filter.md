---
layout: wiki
title: "KNX Router Filter"
lang: es
permalink: /wiki/es-KNX%20Router%20Filter
---
Filtra objetos de telegramas RAW (normalmente producidos por **KNX Multi Routing**) antes de reenviarlos a otro gateway.

## Sintaxis de patrones
- Patrones de Dirección de Grupo (GA) con `*` por nivel:
  - `0/0/*` coincide con todas las GA en `0/0`
  - `0` equivale a `0/*/*`
- Patrones de Source (dirección física) con `*` por nivel:
  - `1.1.*` coincide con todos los dispositivos en área `1`, línea `1`
  - `1` equivale a `1.*.*`
- Avanzado: `re:<regex>` para usar una expresión regular directamente.

## Modo (GA / Source)
- **Off**: sin filtro
- **Allow only matching**: permite solo lo que coincida
- **Block matching**: bloquea lo que coincida

## Salidas
1. **Pasados** (para reenviar)
2. **Descartados** (debug opcional)

## Reescritura (Rewrite)
Puedes reescribir opcionalmente:
- destino (Group Address) `knx.destination`
- origen (dirección física) `knx.source`

Las reglas se evalúan de arriba hacia abajo (la primera coincidencia gana).

Ejemplos:
- Wildcards: `0/0/* => 2/0/*` (el `*` se captura y se reutiliza)
- Regex: `re:^1/2/(\\d+)$ => 3/2/$1`

## Metadatos
El nodo añade `msg.payload.knxRouterFilter`:
- descartados: `{ dropped: true, reason: 'event'|'ga'|'source', ... }`
- pasados: `{ dropped: false, rewritten: <bool>, rewrite: { ... }, original: { ... } }`
