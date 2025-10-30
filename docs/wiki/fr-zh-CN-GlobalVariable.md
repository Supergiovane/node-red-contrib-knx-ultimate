---
layout: wiki
title: "zh-CN-GlobalVariable"
lang: fr
permalink: /wiki/fr-zh-CN-GlobalVariable
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/GlobalVariable) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-GlobalVariable) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-GlobalVariable) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-GlobalVariable) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-GlobalVariable) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-GlobalVariable)
---
# KNX Variables globales
Ce nœud mappe l'adresse de groupe reçue du bus à la variable de contexte global, \
Et permettre l'écriture au bus KNX via cette variable.
## Aperçu
- Ajouter le nœud de contexte global au processus et le nommer;Ce nom est utilisé comme nom de base de la variable globale.
- Lisez à l'aide du suffixe `_read` (comme` myvar_read`).
- Écrivez pour utiliser le suffixe `_write` (comme` myvar_write`).
- Les variables peuvent être exposées en lecture seule ou en lecture / écriture en configuration.
- Pour des raisons de sécurité, veuillez modifier le nom par défaut.
Remarque: Une fois l'écriture exécutée, `<name> _write` sera automatiquement effacée pour éviter une écriture répétée.
## installation
| Propriétés | Description |
|-|-|
| Passerelle | KNX Gateway.|
| Nom variable | Le nom de base de la variable globale.`<name> _read` et` <name> _write` sont créés. N'utilisez pas le nom par défaut pour des raisons de sécurité.|
| Exposer en tant que variable globale |Sélectionnez si et comment exposer les variables globales. Si vous n'avez pas besoin d'écrire, il est recommandé de régler en lecture seule.|
| Intervalle d'écriture de bus | Poll `<nom> _Write` et écrivez dans le bus.|
## objet msg en variable```javascript
{
  address: "0/0/1",
  dpt: "1.001",
  payload: true,
  devicename: "Dinning Room->Table Light"
}
```## Utilisation rapide
### Read Variables```javascript
const list = global.get("KNXContextBanana_READ") || [];
node.send({ payload: list });
const ga = list.find(a => a.address === "0/0/10");
if (ga && ga.payload === true) return { payload: "FOUND AND TRUE" };
if (ga && ga.payload === false) return { payload: "FOUND AND FALSE" };
```### Écrivez dans le bus à travers des variables```javascript
const toSend = [];
toSend.push({ address: "0/0/10", dpt: "1.001", payload: msg.payload });
// 如果已导入 ETS，可省略 dpt，由系统据 payload 推断
toSend.push({ address: "0/0/11", payload: msg.payload });
global.set("KNXContextBanana_WRITE", toSend);
```## Exemple complet
<a href = "/node-red-contrib-knx-ultimate/wiki/SampleglobalContextNode" Target = "_ Blank"> <i class="fa fa-info-circle"> </i> Voir l'exemple </a>
