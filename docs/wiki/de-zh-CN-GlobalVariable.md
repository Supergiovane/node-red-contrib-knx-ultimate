---
layout: wiki
title: "zh-CN-GlobalVariable"
lang: de
permalink: /wiki/de-zh-CN-GlobalVariable
---
---


# KNX Globale Variablen

Dieser Knoten ordnet die vom Bus empfangene Gruppenadresse in die globale Kontextvariable \ ab, \
Und lassen Sie das Schreiben in den KNX -Bus durch diese Variable schreiben.

## Übersicht

- Fügen Sie den globalen Kontextknoten zum Prozess hinzu und nennen Sie ihn.Dieser Name wird als Grundname der globalen Variablen verwendet.
- Lesen Sie mit dem Suffix `_read` (wie` myvar_read`).
- Schreiben Sie, um das Suffix `_write` (wie` myvar_write`) zu verwenden.
- Variablen können als schreibgeschützte oder in Konfiguration gelesen/schreiben/schreiben.
- Ändern Sie aus Sicherheitsgründen bitte den Standardnamen.

Hinweis: Nachdem das Schreiben ausgeführt wurde, wird `<name> _write` automatisch gelöscht, um wiederholtes Schreiben zu vermeiden.

## aufstellen

| Eigenschaften | Beschreibung |
|-|-|
| Gateway | KNX -Tor. |
| Variabler Name |Der grundlegende Name der globalen Variablen.`<name> _read` und` <name> _write` werden erstellt. Verwenden Sie den Standardnamen aus Sicherheitsgründen nicht.|
| Als globale Variable aussetzen |Wählen Sie aus, ob und wie globale Variablen freigelegt werden. Wenn Sie nicht schreiben müssen, wird empfohlen, nur schreibgeschützt zu sein.|
| Bus -Schreibintervall | Umfrage `<Name> _write` und schreiben Sie in den Bus.|

## MSG -Objekt in Variable```javascript
{
  address: "0/0/1",
  dpt: "1.001",
  payload: true,
  devicename: "Dinning Room->Table Light"
}
```## Schnelle Verwendung

### Lesen Sie Variablen```javascript
const list = global.get("KNXContextBanana_READ") || [];
node.send({ payload: list });

const ga = list.find(a => a.address === "0/0/10");
if (ga && ga.payload === true) return { payload: "FOUND AND TRUE" };
if (ga && ga.payload === false) return { payload: "FOUND AND FALSE" };
```### Schreiben Sie durch Variablen in den Bus```javascript
const toSend = [];
toSend.push({ address: "0/0/10", dpt: "1.001", payload: msg.payload });
// 如果已导入 ETS，可省略 dpt，由系统据 payload 推断
toSend.push({ address: "0/0/11", payload: msg.payload });

global.set("KNXContextBanana_WRITE", toSend);
```## Vollständiges Beispiel

<a href = "/node-red-contrib-knx-ultimate/wiki/sampleglobalcontextnode" target = "_ leer"> <i class="fa-info-circle"
