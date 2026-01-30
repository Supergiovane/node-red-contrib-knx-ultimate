---
layout: wiki
title: "KNX Router Filter"
lang: it
permalink: /wiki/it-KNX%20Router%20Filter
---
Filtra i telegrammi RAW (tipicamente prodotti dal nodo **KNX Multi Routing**) prima di inoltrarli su un altro gateway.

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/sample-knx-router-filter.svg" width="95%"><br/>

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

Durante il rewrite, il nodo aggiorna anche `knx.cemi.hex` per riflettere i valori riscritti di `knx.source`/`knx.destination` (quando `knx.cemi.hex` è presente).

Le regole sono valutate dall’alto verso il basso: la prima che matcha vince.

Esempi sintassi:
- Wildcard: `0/0/* => 2/0/*` (il `*` viene catturato e riutilizzato)
- Regex: `re:^1/2/(\\d+)$ => 3/2/$1`

## Metadati
Il nodo aggiunge `msg.payload.knxRouterFilter`:
- messaggi scartati: `{ dropped: true, reason: 'event'|'ga'|'source', ... }`
- messaggi passati: `{ dropped: false, rewritten: <bool>, cemiSynced: <bool>, rewrite: { ... }, original: { ... } }`

## msg.setConfig
Puoi cambiare la configurazione del nodo a runtime inviando un oggetto `msg.setConfig` all’ingresso.
Chiavi supportate: `allowWrite`, `allowResponse`, `allowRead`, `gaMode`, `gaPatterns`, `srcMode`, `srcPatterns`, `rewriteGA`, `gaRewriteRules`, `rewriteSource`, `srcRewriteRules`.
La nuova configurazione viene mantenuta fino al prossimo `msg.setConfig` o fino a redeploy/riavvio. I messaggi di configurazione non vengono inoltrati.

Significato delle proprietà:
- `allowWrite`: consente i telegrammi `GroupValue_Write`.
- `allowResponse`: consente i telegrammi `GroupValue_Response`.
- `allowRead`: consente i telegrammi `GroupValue_Read`.
- `gaMode`: modalità filtro per la GA di destinazione (`off` = nessun filtro, `allow` = consenti solo i match, `block` = scarta i match).
- `gaPatterns`: pattern GA di destinazione usati da `gaMode` (uno per riga, supporta `*` e `re:<regex>`).
- `srcMode`: modalità filtro per la source (indirizzo fisico) (`off`/`allow`/`block`).
- `srcPatterns`: pattern source usati da `srcMode` (uno per riga, supporta `*` e `re:<regex>`).
- `rewriteGA`: abilita la riscrittura di `knx.destination` sui telegrammi passati.
- `gaRewriteRules`: regole di riscrittura GA (`da => a`, prima regola che matcha vince; supporta `*` e `re:<regex>`).
- `rewriteSource`: abilita la riscrittura di `knx.source` sui telegrammi passati.
- `srcRewriteRules`: regole di riscrittura source (`da => a`, prima regola che matcha vince; supporta `*` e `re:<regex>`).

Esempio:
```js
msg.setConfig = {
  allowWrite: true,
  allowResponse: true,
  allowRead: true,
  gaMode: "allow",
  gaPatterns: "1/1/*\n1/2/3",
  srcMode: "off",
  srcPatterns: "",
  rewriteGA: true,
  gaRewriteRules: "5/5/1 => 1/1/1",
  rewriteSource: true,
  srcRewriteRules: "15.*.* => 1.1.254"
};
return msg;
```
