---
layout: wiki
title: "Matter-Bridge-Configuration"
lang: it
permalink: /wiki/it-Matter-Bridge-Configuration
---
# Bridge Matter

<div data-matter-bridge-config-overview="hero" style="margin:18px 0 28px;padding:24px;border-radius:16px;background:linear-gradient(135deg,#0d314f 0%,#176b91 55%,#27a9c7 100%);box-shadow:0 14px 30px rgba(13,49,79,0.25);color:#f3fbff;">
  <div style="font-size:0.72rem;letter-spacing:0.18em;text-transform:uppercase;font-weight:700;color:#d1f3ff;">Server Matter · Multi-fabric · Identità persistente</div>
  <div style="font-size:1.75rem;line-height:1.15;font-weight:800;margin:8px 0 10px;">Abbina un bridge. Esponi tutti i dispositivi KNX.</div>
  <p style="margin:0 0 18px;max-width:860px;line-height:1.6;color:#f3fbff;">Questo nodo di configurazione possiede server Matter, identità del bridge e sessioni dei controller abbinati. Alexa, Google Home, Apple Home e gli altri controller lo associano una sola volta; i nodi device compaiono poi sotto di esso come endpoint live.</p>
  <div style="display:flex;flex-wrap:wrap;gap:10px;">
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">Abbina una volta</strong><span style="font-size:0.76rem;color:#e0f7ff;">QR + codice manuale</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">Multi-fabric</strong><span style="font-size:0.76rem;color:#e0f7ff;">più controller</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">Riconciliazione live</strong><span style="font-size:0.76rem;color:#e0f7ff;">endpoint in pochi secondi</span></div>
  </div>
</div>

## Il bridge in sintesi

| Area | Cosa offre |
|---|---|
| **Abbinamento** | QR e codice manuale, più fabric Matter e reset esplicito per ripartire. |
| **Identità** | Identità stabile tra deploy ordinari, cambi nome e riconciliazione degli endpoint. |
| **Scalabilità** | Più bridge indipendenti su porte UDP distinte e qualsiasi numero di nodi device. |
| **Protezione** | Esportazione/importazione di fabric, credenziali private, sessioni e dati di abbinamento. |

> Proteggi il backup come una password e usa **Reset abbinamento** solo per rimuovere tutti i controller associati.

## Panoramica tecnica

Questo nodo di configurazione è il **bridge Matter vero e proprio**: esegue il server Matter che Alexa, Google Home, Apple Home (o qualunque controller Matter) associano **una sola volta**. Ogni nodo **Matter Bridge device** nei tuoi flow punta qui e compare nelle app come un dispositivo del bridge.

Gli editor dei dispositivi Matter Bridge dispongono **Mappature** e **Opzioni avanzate** come tab verticali a sinistra, coerentemente con Matter Controller.

Il selettore **PIN Input/Output del nodo** si trova fuori dalle TAB. Abilitandolo compare subito sotto una sezione contestuale **Input/output del flow**, con esempi copiabili Flow → Matter e Matter → Flow filtrati per il tipo di dispositivo selezionato.

## Configurazione

|Campo|Descrizione|
|--|--|
| Nome | Il nome di questo nodo di configurazione in Node-RED |
| Nome del bridge Matter | Come viene chiamato il bridge stesso nelle app Matter. **Lascia vuoto per riusare il Nome di questo nodo.** |
| Porta | Porta UDP del server Matter (default 5540). Ogni bridge richiede la propria porta, quindi puoi eseguire **più bridge indipendenti** |

## Abbinamento

1. Fai il **deploy**, attendi qualche secondo, poi riapri questo nodo.
2. Il pannello di abbinamento mostra il **QR code** e il **codice manuale**: scansiona o digita in Alexa / Google Home / Apple Home ("aggiungi dispositivo Matter").
3. Più controller possono essere abbinati allo stesso bridge (multi-fabric Matter).

Per aggiungere un altro controller quando il QR code è nascosto, apri la modalità di abbinamento da un controller già associato, poi aggiungi un dispositivo Matter nel nuovo controller. Usa **Reset abbinamento** solo per rimuovere tutti i controller esistenti e ripartire.

Il pulsante **Reset abbinamento** rimuove tutti i controller abbinati e riavvia l'advertising di abbinamento.

## Identità e archiviazione

L'identità del bridge è legata a questo nodo di configurazione ed è salvata in `knxultimatestorage/matter` nella directory utente di Node-RED: i re-deploy (anche cambiando porta o nome) **NON** richiedono un nuovo abbinamento. Solo eliminando questo nodo di configurazione e creandone uno nuovo cambia l'identità — in quel caso rimuovi il vecchio bridge dall'app Matter e riabbina.

Usa **Esporta** per scaricare un backup completo di questa istanza bridge, incluse fabric, credenziali private, sessioni e dati di abbinamento. **Proteggi il file come una password.** L'importazione sostituisce lo storage dell'istanza e riavvia brevemente il bridge. Un backup bridge non può essere importato in un controller.

## Note

- L'host Node-RED deve avere **IPv6 link-local** attivo (requisito standard Matter) ed essere raggiungibile dai controller sulla rete locale.
- I nodi device aggiunti/rinominati/rimossi vengono recepiti dai controller abbinati in pochi secondi, senza riabbinare.
- **Nomi:** Alexa e Google Home rispettano i nomi che imposti qui (nome del bridge e nomi dei nodi device). **Apple Home li ignora e ti chiede di nominare manualmente ogni accessorio durante l'abbinamento** — è un limite di Apple, non del bridge.
