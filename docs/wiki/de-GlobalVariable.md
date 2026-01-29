---
layout: wiki
title: "GlobalVariable"
lang: de
permalink: /wiki/de-GlobalVariable
---
# KNX GLOBALE VARIABLE

Dieser Node spiegelt empfangene Gruppenadressen in eine globale Kontext-Variable\
und ermöglicht auch das Schreiben auf den KNX-BUS über diese Variable.

## Überblick

- Füge den Global-Context-Node in den Flow ein und gib ihm einen Namen. Dieser Name ist die Basis der globalen Variable.
- Lesen per Suffix `_READ` (z. B. `MeineVar_READ`).
- Schreiben per Suffix `_WRITE` (z. B. `MeineVar_WRITE`).
- Im Dialog lässt sich die Variable als Read-Only oder Read/Write exposen.
- Ändere aus Sicherheitsgründen den Standardnamen.

Hinweis: Nach der Ausführung werden Einträge in `<Name>_WRITE` automatisch geleert, um Endlosschleifen zu vermeiden.

## Einstellungen

| Property | Beschreibung |
|--|--|
| Gateway | KNX-Gateway. |
| Variablenname (keine Leerzeichen, nur Zeichen [a-z]) | Basisname der globalen Variable. Es werden `<Name>_READ` (Lesen) und `<Name>_WRITE` (Schreiben) erstellt. Wähle aus Sicherheitsgründen keinen Standardnamen. |
| Als globale Variable verfügbar machen | Ob und wie die Variable exponiert wird. Wenn kein Schreiben nötig ist, "read only" wählen. |
| BUS-Schreibintervall | Prüfintervall, in dem `<Name>_WRITE` ausgewertet und an den BUS gesendet wird. |

## msg-Objekte in der Variable

```javascript

{
  address: "0/0/1",
  dpt: "1.001",
  payload: true,
  devicename: "Dinning Room->Table Light"
}
```

## Schnelle Nutzung

### Variable lesen

```javascript

const list = global.get("KNXContextBanana_READ") || [];
node.send({ payload: list });

const ga = list.find(a => a.address === "0/0/10");
if (ga && ga.payload === true) return { payload: "FOUND AND TRUE" };
if (ga && ga.payload === false) return { payload: "FOUND AND FALSE" };
```

### Über Variable auf den BUS schreiben

```javascript

const toSend = [];
toSend.push({ address: "0/0/10", dpt: "1.001", payload: msg.payload });
toSend.push({ address: "0/0/11", payload: msg.payload }); // DPT kann mit ETS-Import entfallen

global.set("KNXContextBanana_WRITE", toSend);
```

## Vollständiges Beispiel

<a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/SampleGlobalContextNode" target="_blank"><i class="fa fa-info-circle"></i> Beispiel ansehen</a>
