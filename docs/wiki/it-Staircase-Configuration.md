---
layout: wiki
title: "Staircase-Configuration"
lang: it
permalink: /wiki/it-Staircase-Configuration
---
---
# Temporizzatore scale
Il nodo **Temporizzatore scale KNX** replica il timer delle luci scala. Quando la GA di impulso riceve un fronte attivo il portone viene acceso, parte il conto alla rovescia e (se configurato) viene emesso un preavviso prima dello spegnimento. Sono disponibili override manuale, blocco e generazione di eventi per l'integrazione con Node-RED.
## Indirizzi di gruppo
|Scopo|Proprietà|Note|
|--|--|--|
| Impulso | `Trigger GA` (`gaTrigger`) | Il valore `1` avvia o estende il timer. Con l'opzione "Il valore 0 annulla" lo `0` spegne subito la luce. |
| Uscita | `Output GA` (`gaOutput`) | Pilota l'attuatore (DPT predefinito 1.001). |
| Stato | `Status GA` (`gaStatus`) | Replica lo stato attivo e il flag di preavviso. |
| Override | `gaOverride` | Mantiene la luce accesa finché resta a `1` e sospende il timer. |
| Blocco | `gaBlock` | Evita nuove attivazioni e può forzare lo spegnimento. |
## Timer e preavviso
- **Durata timer** definisce il tempo base del ciclo.
- **Nuovo impulso** consente di riavviare, prolungare o ignorare gli impulsi successivi.
- **Il valore 0 annulla il ciclo** ferma il timer con motivo `manual-off` quando l'impulso torna a `0`.
- **Quando è bloccato** decide se il blocco inibisce soltanto gli impulsi o spegne anche l'uscita.
- Il preavviso può segnalare lo spegnimento commutando la GA di stato o lampeggiando l'attuatore per la durata impostata.
## Eventi e output
- Attivando *Emit events* il nodo invia oggetti con `event`, `remaining`, `active`, `override`, `blocked` (`trigger`, `extend`, `prewarn`, `timeout`, `manual-off`, `override`, `block`).
- In alternativa puoi usare la GA di stato come feedback direttamente sul bus KNX.
## Esempio dal flow
```javascript

// Avvia il temporizzatore scale
msg.payload = true;
return msg;
```

```javascript
// Annulla il ciclo (opzione "Il valore 0 annulla")
msg.payload = false;
return msg;
```

## Suggerimenti operativi
- Usa l'override durante la manutenzione o le pulizie.
- Associa la GA di stato a un indicatore visivo o a una dashboard.
- Il lampeggio di preavviso richiede attuatori in grado di commutare rapidamente.
