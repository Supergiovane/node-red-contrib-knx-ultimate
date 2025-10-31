---
layout: wiki
title: "GlobalVariable"
lang: it
permalink: /wiki/it-GlobalVariable
---
# VARIABILE GLOBALE KNX

Questo nodo espone gli indirizzi di gruppo ricevuti dal BUS a una variabile di contesto globale.\
Puoi anche scrivere sul BUS KNX aggiornando la variabile globale dedicata.

## Panoramica

- Inserisci il nodo Global Context nel flow e assegnagli un nome. Il nome del nodo diventa il nome base della variabile globale.
- La lettura avviene tramite il suffisso `_READ` (es. `MiaVar_READ`).
- La scrittura avviene tramite il suffisso `_WRITE` (es. `MiaVar_WRITE`).
- Dalla finestra di configurazione puoi esporre la variabile come sola lettura o lettura/scrittura.
- Per sicurezza, cambia sempre il nome predefinito della variabile.

Nota: dopo l'esecuzione dei comandi, la variabile con suffisso `_WRITE` viene svuotata automaticamente, per evitare cicli di scrittura infiniti.

## Impostazioni

| Proprietà | Descrizione |
|--|--|
| Gateway | Gateway KNX. |
| Variable Name | Nome base del contesto globale. Verranno create due variabili: `<Nome>_READ` (lettura) e `<Nome>_WRITE` (scrittura). Scegli un nome non predefinito per motivi di sicurezza. |
| Expose as Global variable | Se e come esporre la variabile globale. Se non devi scrivere sul BUS, imposta "read only”. |
| BUS write interval | Intervallo con cui il nodo controlla `<Nome>_WRITE` per inviare comandi al BUS. |

## Proprietà msg (oggetti nella variabile)

```javascript
{
  address: "0/0/1",
  dpt: "1.001",
  payload: true,
  devicename: "Dinning Room->Table Light"
}
```

## Utilizzo rapido

### Leggere la variabile

```javascript
// Legge l'array di oggetti GA dalla variabile globale
let list = global.get("KNXContextBanana_READ") || [];
node.send({ payload: list });

// Trova una GA specifica
let ga = list.find(a => a.address === "0/0/10");
if (ga && ga.payload === true) return { payload: "FOUND AND TRUE" };
if (ga && ga.payload === false) return { payload: "FOUND AND FALSE" };
```

### Scrivere sul BUS tramite variabile

```javascript
// Prepara comandi da inviare al BUS
let toSend = [];
toSend.push({ address: "0/0/10", dpt: "1.001", payload: msg.payload });
// Con ETS importato si può omettere dpt: verrà dedotto
toSend.push({ address: "0/0/11", payload: msg.payload });

// Scrittura: usa il suffisso _WRITE
global.set("KNXContextBanana_WRITE", toSend);
```

## Esempio completo

<a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/SampleGlobalContextNode" target="_blank"><i class="fa fa-info-circle"></i> Vedi questo esempio</a>
