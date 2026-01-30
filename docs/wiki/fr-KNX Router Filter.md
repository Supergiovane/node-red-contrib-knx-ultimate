---
layout: wiki
title: "KNX Router Filter"
lang: fr
permalink: /wiki/fr-KNX%20Router%20Filter
---
Filtre des objets de télégrammes RAW (généralement produits par **KNX Multi Routing**) avant de les transmettre vers un autre gateway.

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/sample-knx-router-filter.svg" width="95%"><br/>

## Syntaxe des motifs
- Motifs d’adresse de groupe (GA) avec `*` par niveau :
  - `0/0/*` correspond à toutes les GA dans `0/0`
  - `0` équivaut à `0/*/*`
- Motifs Source (adresse physique) avec `*` par niveau :
  - `1.1.*` correspond à tous les appareils sur zone `1`, ligne `1`
  - `1` équivaut à `1.*.*`
- Avancé : `re:<regex>` pour utiliser directement une regex.

## Mode (GA / Source)
- **Off** : pas de filtrage
- **Allow only matching** : autorise uniquement ce qui correspond
- **Block matching** : bloque ce qui correspond

## Sorties
1. **Passés** (à transmettre)
2. **Rejetés** (debug optionnel)

## Réécriture (Rewrite)
Vous pouvez réécrire (optionnellement) :
- destination (adresse de groupe) `knx.destination`
- source (adresse physique) `knx.source`

Lors d’une réécriture, le nœud met aussi à jour `knx.cemi.hex` pour refléter les valeurs réécrites de `knx.source`/`knx.destination` (lorsque `knx.cemi.hex` est présent).

Les règles sont évaluées de haut en bas (première correspondance gagnante).

Exemples :
- Wildcards : `0/0/* => 2/0/*` (le `*` est capturé et réutilisé)
- Regex : `re:^1/2/(\\d+)$ => 3/2/$1`

## Métadonnées
Le nœud ajoute `msg.payload.knxRouterFilter` :
- rejetés : `{ dropped: true, reason: 'event'|'ga'|'source', ... }`
- passés : `{ dropped: false, rewritten: <bool>, cemiSynced: <bool>, rewrite: { ... }, original: { ... } }`

## msg.setConfig
Vous pouvez modifier la configuration du nœud à l’exécution en envoyant un objet `msg.setConfig` à l’entrée.
Clés prises en charge : `allowWrite`, `allowResponse`, `allowRead`, `gaMode`, `gaPatterns`, `srcMode`, `srcPatterns`, `rewriteGA`, `gaRewriteRules`, `rewriteSource`, `srcRewriteRules`.
La configuration est conservée jusqu’au prochain `msg.setConfig` ou jusqu’à un redeploy/redémarrage. Les messages de configuration ne sont pas transmis.

Signification des propriétés :
- `allowWrite` : autorise les télégrammes `GroupValue_Write`.
- `allowResponse` : autorise les télégrammes `GroupValue_Response`.
- `allowRead` : autorise les télégrammes `GroupValue_Read`.
- `gaMode` : mode de filtre GA de destination (`off` = pas de filtre, `allow` = autoriser uniquement les correspondances, `block` = bloquer les correspondances).
- `gaPatterns` : motifs GA de destination utilisés par `gaMode` (un par ligne, supporte `*` et `re:<regex>`).
- `srcMode` : mode de filtre Source (adresse physique) (`off`/`allow`/`block`).
- `srcPatterns` : motifs Source utilisés par `srcMode` (un par ligne, supporte `*` et `re:<regex>`).
- `rewriteGA` : active la réécriture de `knx.destination` sur les télégrammes passés.
- `gaRewriteRules` : règles de réécriture GA (`de => vers`, première correspondance gagnante ; supporte `*` et `re:<regex>`).
- `rewriteSource` : active la réécriture de `knx.source` sur les télégrammes passés.
- `srcRewriteRules` : règles de réécriture Source (`de => vers`, première correspondance gagnante ; supporte `*` et `re:<regex>`).

Exemple :
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
