---
layout: wiki
title: "zh-CN-GlobalVariable"
lang: it
permalink: /wiki/it-zh-CN-GlobalVariable
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/GlobalVariable) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-GlobalVariable) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-GlobalVariable) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-GlobalVariable) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-GlobalVariable) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-GlobalVariable)
---
# Variabili globali KNX
Questo nodo mappa l'indirizzo di gruppo ricevuto dal bus alla variabile di contesto globale, \
E consentire la scrittura sul bus KNX attraverso questa variabile.
Panoramica ##
- Aggiungere il nodo di contesto globale al processo e nominarlo;Questo nome è usato come nome di base della variabile globale.
- Leggi usando il suffisso `_read` (come` myvar_read`).
- Scrivi per usare il suffisso `_write` (come` myvar_write`).
- Le variabili possono essere esposte come sola lettura o lettura/scrittura in configurazione.
- Per motivi di sicurezza, modificare il nome predefinito.
Nota: dopo l'esecuzione della scrittura, `<name> _Write` verrà automaticamente cancellato per evitare la scrittura ripetuta.
## impostare
| Proprietà | Descrizione |
|-|-|
| Gateway | KNX Gateway. |
| Nome variabile |Il nome di base della variabile globale.Sono creati `<name> _read` e` <name> _write`. Non utilizzare il nome predefinito per motivi di sicurezza.|
| Esporre come variabile globale |Seleziona se e come esporre variabili globali. Se non è necessario scrivere, si consiglia di impostare in sola lettura.|
| Intervallo di scrittura del bus | Sondaggio `<nome> _Write` e scrivere sul bus.|
## oggetto msg in variabile```javascript
{
  address: "0/0/1",
  dpt: "1.001",
  payload: true,
  devicename: "Dinning Room->Table Light"
}
```## Utilizzo rapido
### Leggi le variabili```javascript
const list = global.get("KNXContextBanana_READ") || [];
node.send({ payload: list });
const ga = list.find(a => a.address === "0/0/10");
if (ga && ga.payload === true) return { payload: "FOUND AND TRUE" };
if (ga && ga.payload === false) return { payload: "FOUND AND FALSE" };
```### Scrivi sul bus attraverso le variabili```javascript
const toSend = [];
toSend.push({ address: "0/0/10", dpt: "1.001", payload: msg.payload });
// 如果已导入 ETS，可省略 dpt，由系统据 payload 推断
toSend.push({ address: "0/0/11", payload: msg.payload });
global.set("KNXContextBanana_WRITE", toSend);
```## Esempio completo
<a href = "/node-red-contrib-knx-ultimate/wiki/sampleglobalcontextNode" Target = "_ blank"> <i class="fa-info-cirle"> </i> Visualizza Esempio </a>
