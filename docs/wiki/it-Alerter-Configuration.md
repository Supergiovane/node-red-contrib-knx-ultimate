---
layout: wiki
title: "Alerter-Configuration"
lang: it
permalink: /wiki/it-Alerter-Configuration
---
# Configurazione del nodo Alerter

Con il nodo Alerter puoi segnalare su un display o al nodo node-red-contrib-tts-ultimate (feedback vocale) se i dispositivi selezionati sono in stato di allarme, cioè hanno `payload` **true** .
Il nodo emette messaggi a intervalli configurabili (uno alla volta) contenenti i dettagli di ciascun dispositivo in allarme. Ad esempio, può dirti quante e quali finestre sono aperte.

Il nodo legge i valori dei dispositivi direttamente dal BUS KNX. Inoltre puoi inviare al nodo messaggi personalizzati, non collegati a dispositivi KNX.

Nella pagina di esempio trovi come usarlo nel flusso.

- **Gateway**

> Gateway KNX selezionato. È anche possibile non selezionare alcun gateway; in tal caso verranno considerati solo i messaggi in ingresso al nodo.

- **Nome**

> Nome del nodo.

- **Tipo di avvio del ciclo di avvisi**

> Seleziona l'evento che fa partire il ciclo di invio dei messaggi relativi ai dispositivi in allarme.

- **Intervallo tra ciascun MSG (in secondi)**

> Intervallo fra ciascun messaggio emesso dal nodo.

## Dispositivi da monitorare

Qui puoi aggiungere i dispositivi da tenere sotto controllo.

Inserisci l'indirizzo di gruppo o un'etichetta per il dispositivo.

- **Leggi il valore di ciascun dispositivo alla connessione/riconnessione**

> All'avvio o alla riconnessione, il nodo invia una richiesta di lettura per ogni dispositivo presente in elenco.

- **Pulsante Aggiungi**

> Aggiunge una riga all'elenco.

- **Righe dei dispositivi ** > Il primo campo è l'indirizzo di gruppo (puoi anche inserire un testo qualsiasi, utile con i messaggi in ingresso: vedi la pagina di esempio), il secondo è il nome breve del dispositivo (**MAX 14 CARATTERI** ), il terzo è il nome esteso.

- **Pulsante Elimina**

> Rimuove il dispositivo dall'elenco.

## Messaggi in uscita dal nodo

PIN1: il nodo emette un messaggio per ciascun dispositivo in allarme, a intervalli selezionabili.

PIN2: il nodo emette un unico messaggio che contiene tutti i dispositivi in allarme.

PIN3: il nodo emette un messaggio che contiene solo l'ultimo dispositivo andato in allarme.

**PIN1**

```javascript
msg = {
  topic: "0/1/12",
  count: 3, // Numero TOTALE di dispositivi in allarme
  devicename: "Finestra camera",
  longdevicename: "Finestra principale camera",
  payload: true
}
```

**PIN2**

```javascript
msg = {
  topic: "door, 0/0/11, 0/1/2, 0/0/9",
  devicename: "Porta ingresso, Applique soggiorno, Applique taverna, Luce studio",
  longdevicename: "Porta d'ingresso principale, Applique sinistra soggiorno, Applique destra taverna, Luce soffitto studio",
  count: 4,
  payload: true
}
```

**PIN3**

```javascript
msg = {
  topic: "0/1/12",
  count: 3, // Numero TOTALE di dispositivi in allarme
  devicename: "Finestra camera",
  longdevicename: "Finestra principale camera",
  payload: true
}
```

Messaggio in uscita quando tutti i dispositivi sono a riposo:

**PIN1, PIN2, PIN3**

```javascript
msg = {
  topic: "",
  count: 0,
  devicename: "",
  longdevicename: "",
  payload: false
}
```

## Messaggi in ingresso al nodo

```javascript
msg.readstatus = true
```

Legge il valore di ciascun dispositivo presente in elenco.

```javascript
msg.start = true
```

Avvia il ciclo di invio di tutti i dispositivi in allarme. Il ciclo termina con l'ultimo dispositivo; per ripeterlo, reinvia questo messaggio.

**Allarme dispositivo personalizzato** 

Per aggiornare lo stato (true/false) di un dispositivo personalizzato, invia questo messaggio in ingresso:

```javascript
msg = {
  topic: "door",
  payload: true // Oppure false per azzerare l'allarme di questo dispositivo
}
```

## Esempio

<a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/SampleAlerter">FAI CLIC QUI PER L'ESEMPIO</a>
