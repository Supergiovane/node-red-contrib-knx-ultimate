---
layout: wiki
title: "Garage-Configuration"
lang: it
permalink: /wiki/it-Garage-Configuration
---
---
# Porta garage
Il nodo **KNX Garage** comanda un portone motorizzato con GA dedicate ai comandi diretti o a impulso, integra fotocellula e stato di ostruzione, permette il blocco della richiusura e la disabilitazione e può richiudere automaticamente dopo un intervallo.
## Indirizzi di gruppo
|Scopo|Proprietà|Note|
|--|--|--|
| Comando diretto | `Command GA` (`gaCommand`) | GA booleana: `true` apre, `false` chiude (DPT 1.001). |
| Impulso toggle | `Impulse GA` (`gaImpulse`) | Il fronte attivo commuta il portone (DPT 1.017). Usata anche in assenza di comando diretto. |
| Movimento | `gaMoving` | Impulso opzionale quando il nodo comanda il portone, utile per logiche ausiliarie. |
| Ostruzione | `gaObstruction` | Replica lo stato di ostruzione così altri dispositivi possono reagire. |
| Blocco richiusura | `gaHoldOpen` | Mantiene aperto e cancella la richiusura automatica finché resta a true. |
| Disabilitazione | `gaDisable` | Blocca qualsiasi comando emesso dal nodo (modo manutenzione/manuale). |
| Fotocellula | `gaPhotocell` | Va a true quando la fotocellula rileva un ostacolo; il nodo riapre e segnala l'ostruzione. |
## Richiusura automatica
- Abilita il timer di richiusura per inviare automaticamente il comando di chiusura dopo il tempo impostato.
- Il timer è sospeso mentre blocco richiusura o disabilitazione sono attivi.
- Allo scadere viene emesso l'evento `auto-close` e, se configurato, il comando diretto o l'impulso.
## Sicurezza
- Una fotocellula a true durante la chiusura provoca la riapertura immediata e l'impostazione dello stato di ostruzione.
- Scritture esterne sulla GA ostruzione mantengono allineati dashboard e logiche.
- Gli impulsi di movimento possono pilotare ventilazione, illuminazione o sistemi di allarme.
## Integrazione con i flow
- `msg.payload` accetta `true`, `false`, `'open'`, `'close'`, `'toggle'` per azionare il portone.
- Con *Emetti eventi* attivo vengono generati oggetti con `event`, `state`, `disabled`, `holdOpen`, `obstruction`.
## Esempio dal flow
```javascript
// Apri il portone
msg.payload = 'open'; // oppure true
return msg;
```
```javascript
// Chiudi il portone
msg.payload = 'close'; // oppure false
return msg;
```
```javascript
// Commutazione del portone
msg.payload = 'toggle';
return msg;
```
