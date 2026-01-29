---
layout: wiki
title: "KNX Router Filter"
lang: it
permalink: /wiki/it-KNX%20Router%20Filter
---
Filtra i telegrammi RAW (tipicamente prodotti dal nodo **KNX Multi Routing**) prima di inoltrarli su un altro gateway.

## Sintassi pattern
- I pattern per Group Address supportano `*` per livello:
  - `0/0/*` matcha tutti i GA in `0/0`
  - `0` equivale a `0/*/*`
- I pattern per Source (indirizzo fisico) supportano `*` per livello:
  - `1.1.*` matcha tutti i device nell’area `1`, linea `1`
  - `1` equivale a `1.*.*`
- Avanzato: `re:<regex>` per usare una regex.

## Modalità (GA / Source)
- **Off**: nessun filtro
- **Consenti solo match**: passa solo ciò che matcha i pattern
- **Blocca i match**: scarta ciò che matcha i pattern

## Output
1. **Passati** (da inoltrare)
2. **Scartati** (debug opzionale)

## Rewrite
Puoi (opzionalmente) riscrivere:
- destination Group Address (`knx.destination`)
- source indirizzo fisico (`knx.source`)

Le regole sono valutate dall’alto verso il basso: la prima che matcha vince.

Esempi sintassi:
- Wildcard: `0/0/* => 2/0/*` (il `*` viene catturato e riutilizzato)
- Regex: `re:^1/2/(\\d+)$ => 3/2/$1`

## Metadati
Il nodo aggiunge `msg.payload.knxRouterFilter`:
- messaggi scartati: `{ dropped: true, reason: 'event'|'ga'|'source', ... }`
- messaggi passati: `{ dropped: false, rewritten: <bool>, rewrite: { ... }, original: { ... } }`
